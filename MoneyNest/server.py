#!/usr/bin/env python3
"""
MoneyNest server
----------------
Runs on YOUR PC only. Stores everything in one SQLite file that lives in a
permanent folder in your user folder (MoneyNestData), NOT inside the app folder,
so replacing, re-unzipping or deleting the app folder can never erase your data.
The server listens on this PC only (127.0.0.1); it is not reachable from Wi-Fi.

Uses only the Python standard library - nothing to install.
"""
import hashlib
import json
import mimetypes
import os
import re
import secrets
import shutil
import sqlite3
import threading
import time
from datetime import date
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse

BASE = os.path.dirname(os.path.abspath(__file__))
STATIC = os.path.join(BASE, "static")
# Permanent data folder, outside the app folder (e.g. C:\\Users\\you\\MoneyNestData)
DATA = os.environ.get("MONEYNEST_DATA") or os.path.join(os.path.expanduser("~"), "MoneyNestData")
LEGACY_DATA = os.path.join(BASE, "data")  # where version 1 kept the database
BACKUPS = os.path.join(DATA, "backups")
DB_PATH = os.path.join(DATA, "moneynest.db")
PORT = int(os.environ.get("MONEYNEST_PORT", "8765"))
HOST = "127.0.0.1"  # this PC only
MAX_BODY = 8 * 1024 * 1024  # 8 MB per request
SESSION_DAYS = 120

os.makedirs(BACKUPS, exist_ok=True)
WRITE_LOCK = threading.Lock()

# ---------------------------------------------------------------- database


def db():
    conn = sqlite3.connect(DB_PATH, timeout=20)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with db() as c:
        c.executescript(
            """
            CREATE TABLE IF NOT EXISTS records(
                kind TEXT NOT NULL,
                id TEXT NOT NULL,
                data TEXT NOT NULL,
                updated_at INTEGER NOT NULL,
                deleted INTEGER NOT NULL DEFAULT 0,
                seq INTEGER NOT NULL,
                PRIMARY KEY(kind, id)
            );
            CREATE INDEX IF NOT EXISTS idx_records_seq ON records(seq);
            CREATE TABLE IF NOT EXISTS meta(key TEXT PRIMARY KEY, value TEXT);
            CREATE TABLE IF NOT EXISTS sessions(
                token_hash TEXT PRIMARY KEY,
                created INTEGER NOT NULL,
                label TEXT
            );
            """
        )


def meta_get(c, key, default=None):
    row = c.execute("SELECT value FROM meta WHERE key=?", (key,)).fetchone()
    return row["value"] if row else default


def meta_set(c, key, value):
    c.execute("INSERT OR REPLACE INTO meta(key,value) VALUES(?,?)", (key, value))


def hash_pin(pin, salt_hex):
    return hashlib.pbkdf2_hmac(
        "sha256", pin.encode("utf-8"), bytes.fromhex(salt_hex), 200_000
    ).hex()


def hash_token(token):
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def _copy_db(target):
    src = sqlite3.connect(DB_PATH)
    dst = sqlite3.connect(target)
    try:
        src.backup(dst)
    finally:
        dst.close()
        src.close()


def daily_backup():
    """One copy per day (kept 30 days) and one per month (kept forever)."""
    if not os.path.exists(DB_PATH):
        return
    today = date.today()
    daily = os.path.join(BACKUPS, "moneynest-%s.db" % today.isoformat())
    monthly = os.path.join(BACKUPS, "moneynest-monthly-%s.db" % today.strftime("%Y-%m"))
    for target in (daily, monthly):
        if not os.path.exists(target):
            try:
                _copy_db(target)
            except Exception as exc:  # a backup problem must never stop the app
                print("Backup skipped:", exc)
    daily_files = sorted(f for f in os.listdir(BACKUPS) if re.fullmatch(r"moneynest-\d{4}-\d{2}-\d{2}\.db", f))
    for old in daily_files[:-30]:
        try:
            os.remove(os.path.join(BACKUPS, old))
        except OSError:
            pass


def backup_loop():
    while True:
        time.sleep(3600)
        daily_backup()


def import_old_data():
    """Version 1 stored the database inside the app folder (data/). Copy it to the
    permanent folder the first time, without touching or deleting the original."""
    old_db = os.path.join(LEGACY_DATA, "moneynest.db")
    if os.path.exists(DB_PATH) or not os.path.exists(old_db):
        return False
    shutil.copy2(old_db, DB_PATH)
    print("  Imported your existing data from: %s" % old_db)
    return True


# ---------------------------------------------------------- login throttle

_fail = {"count": 0, "locked_until": 0.0}
_fail_lock = threading.Lock()


def throttle_check():
    with _fail_lock:
        wait = _fail["locked_until"] - time.time()
        return max(0, int(wait) + 1) if wait > 0 else 0


def throttle_fail():
    with _fail_lock:
        _fail["count"] += 1
        if _fail["count"] >= 5:
            # 30s, 60s, 120s ... up to 15 minutes
            step = min(900, 30 * 2 ** ((_fail["count"] - 5) // 1))
            _fail["locked_until"] = time.time() + step


def throttle_ok():
    with _fail_lock:
        _fail["count"] = 0
        _fail["locked_until"] = 0.0


# ------------------------------------------------------------------ helpers


def valid_pin(pin):
    return isinstance(pin, str) and pin.isdigit() and 4 <= len(pin) <= 12


def apply_changes(conn, changes):
    """Last-write-wins merge of records sent by a device."""
    applied = 0
    row = conn.execute("SELECT COALESCE(MAX(seq),0) AS m FROM records").fetchone()
    seq = row["m"]
    for ch in changes:
        try:
            kind = str(ch["kind"])[:32]
            rid = str(ch["id"])[:80]
            updated = int(ch["updated_at"])
            deleted = 1 if ch.get("deleted") else 0
            data = json.dumps(ch.get("data") or {}, ensure_ascii=False)
        except (KeyError, TypeError, ValueError):
            continue
        if len(data) > 20000:
            continue
        cur = conn.execute(
            "SELECT updated_at FROM records WHERE kind=? AND id=?", (kind, rid)
        ).fetchone()
        if cur is None or updated >= cur["updated_at"]:
            seq += 1
            conn.execute(
                "INSERT OR REPLACE INTO records(kind,id,data,updated_at,deleted,seq)"
                " VALUES(?,?,?,?,?,?)",
                (kind, rid, data, updated, deleted, seq),
            )
            applied += 1
    return applied


# ------------------------------------------------------------------ handler


class Handler(BaseHTTPRequestHandler):
    server_version = "MoneyNest/1.0"
    protocol_version = "HTTP/1.1"

    def log_message(self, fmt, *args):  # quiet console
        pass

    # ---- output helpers
    def _send(self, code, body, ctype="application/json; charset=utf-8", extra=None):
        if isinstance(body, (dict, list)):
            body = json.dumps(body, ensure_ascii=False).encode("utf-8")
        elif isinstance(body, str):
            body = body.encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        self.send_header("X-Frame-Options", "DENY")
        for k, v in (extra or {}).items():
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(body)

    def _json_body(self):
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            length = 0
        if length <= 0 or length > MAX_BODY:
            return None
        try:
            return json.loads(self.rfile.read(length).decode("utf-8"))
        except (ValueError, UnicodeDecodeError):
            return None

    def _authed(self):
        auth = self.headers.get("Authorization", "")
        if not auth.startswith("Bearer "):
            return False
        token = auth[7:].strip()
        if not token:
            return False
        with db() as c:
            row = c.execute(
                "SELECT created FROM sessions WHERE token_hash=?", (hash_token(token),)
            ).fetchone()
        if not row:
            return False
        return time.time() - row["created"] < SESSION_DAYS * 86400

    def _new_session(self, c, label):
        token = secrets.token_urlsafe(32)
        c.execute(
            "INSERT INTO sessions(token_hash,created,label) VALUES(?,?,?)",
            (hash_token(token), int(time.time()), (label or "device")[:60]),
        )
        return token

    # ---- routing
    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/api/status":
            with db() as c:
                setup = meta_get(c, "pin_hash") is not None
                salt = meta_get(c, "local_salt", "")
            return self._send(200, {"ok": True, "setup": setup, "salt": salt, "time": int(time.time() * 1000)})
        if path == "/api/export":
            if not self._authed():
                return self._send(401, {"error": "auth"})
            with db() as c:
                rows = c.execute("SELECT kind,id,data,updated_at,deleted FROM records").fetchall()
            out = [
                {"kind": r["kind"], "id": r["id"], "data": json.loads(r["data"]),
                 "updated_at": r["updated_at"], "deleted": r["deleted"]}
                for r in rows
            ]
            return self._send(
                200, {"app": "MoneyNest", "exported": int(time.time()), "records": out},
                extra={"Content-Disposition": 'attachment; filename="moneynest-backup.json"'},
            )
        if path.startswith("/api/"):
            return self._send(404, {"error": "not found"})
        return self._static(path)

    def do_POST(self):
        path = urlparse(self.path).path
        body = self._json_body()
        if body is None:
            return self._send(400, {"error": "bad request"})

        if path == "/api/setup":
            with WRITE_LOCK, db() as c:
                if meta_get(c, "pin_hash") is not None:
                    return self._send(409, {"error": "already set up"})
                pin = body.get("pin")
                if not valid_pin(pin):
                    return self._send(400, {"error": "PIN must be 4-12 digits"})
                salt = secrets.token_hex(16)
                meta_set(c, "pin_salt", salt)
                meta_set(c, "pin_hash", hash_pin(pin, salt))
                meta_set(c, "local_salt", secrets.token_hex(8))
                token = self._new_session(c, body.get("device"))
                local_salt = meta_get(c, "local_salt")
            return self._send(200, {"token": token, "salt": local_salt})

        if path == "/api/login":
            wait = throttle_check()
            if wait:
                return self._send(429, {"error": "Too many attempts. Try again in %d seconds." % wait, "wait": wait})
            pin = body.get("pin")
            with WRITE_LOCK, db() as c:
                salt = meta_get(c, "pin_salt")
                stored = meta_get(c, "pin_hash")
                if not stored or not isinstance(pin, str):
                    return self._send(400, {"error": "not set up"})
                ok = secrets.compare_digest(hash_pin(pin, salt), stored)
                if not ok:
                    throttle_fail()
                    return self._send(401, {"error": "Wrong PIN"})
                throttle_ok()
                token = self._new_session(c, body.get("device"))
                local_salt = meta_get(c, "local_salt")
            return self._send(200, {"token": token, "salt": local_salt})

        # everything below needs a logged-in device
        if not self._authed():
            return self._send(401, {"error": "auth"})

        if path == "/api/sync":
            try:
                since = int(body.get("since", 0))
            except (TypeError, ValueError):
                since = 0
            changes = body.get("changes") or []
            if not isinstance(changes, list):
                return self._send(400, {"error": "bad changes"})
            with WRITE_LOCK, db() as c:
                applied = apply_changes(c, changes[:5000]) if changes else 0
                rows = c.execute(
                    "SELECT kind,id,data,updated_at,deleted,seq FROM records WHERE seq>? ORDER BY seq",
                    (since,),
                ).fetchall()
                top = c.execute("SELECT COALESCE(MAX(seq),0) AS m FROM records").fetchone()["m"]
            out = [
                {"kind": r["kind"], "id": r["id"], "data": json.loads(r["data"]),
                 "updated_at": r["updated_at"], "deleted": r["deleted"]}
                for r in rows
            ]
            return self._send(200, {"seq": top, "changes": out, "applied": applied})

        if path == "/api/pin":
            old, new = body.get("old"), body.get("new")
            if not valid_pin(new):
                return self._send(400, {"error": "New PIN must be 4-12 digits"})
            wait = throttle_check()
            if wait:
                return self._send(429, {"error": "Too many attempts. Try again in %d seconds." % wait})
            with WRITE_LOCK, db() as c:
                salt = meta_get(c, "pin_salt")
                if not isinstance(old, str) or not secrets.compare_digest(hash_pin(old, salt), meta_get(c, "pin_hash")):
                    throttle_fail()
                    return self._send(401, {"error": "Current PIN is wrong"})
                throttle_ok()
                new_salt = secrets.token_hex(16)
                meta_set(c, "pin_salt", new_salt)
                meta_set(c, "pin_hash", hash_pin(new, new_salt))
                c.execute("DELETE FROM sessions")  # sign out every device
                token = self._new_session(c, body.get("device"))
                local_salt = meta_get(c, "local_salt")
            return self._send(200, {"token": token, "salt": local_salt})

        if path == "/api/logout":
            token = self.headers.get("Authorization", "")[7:].strip()
            with WRITE_LOCK, db() as c:
                c.execute("DELETE FROM sessions WHERE token_hash=?", (hash_token(token),))
            return self._send(200, {"ok": True})

        return self._send(404, {"error": "not found"})

    # ---- static files
    def _static(self, path):
        if path in ("", "/"):
            path = "/index.html"
        rel = os.path.normpath(path.lstrip("/"))
        full = os.path.abspath(os.path.join(STATIC, rel))
        if not full.startswith(os.path.abspath(STATIC) + os.sep) or not os.path.isfile(full):
            return self._send(404, "Not found", "text/plain; charset=utf-8")
        ctype = mimetypes.guess_type(full)[0] or "application/octet-stream"
        ext = os.path.splitext(full)[1].lower()
        # fixed types, because Windows can report wrong ones from its registry
        ctype = {".woff": "font/woff", ".woff2": "font/woff2", ".js": "application/javascript", ".css": "text/css",
                 ".html": "text/html", ".svg": "image/svg+xml", ".json": "application/json", ".webmanifest": "application/manifest+json"}.get(ext, ctype)
        if ctype.startswith("text/") or ctype in ("application/javascript", "application/json", "image/svg+xml"):
            ctype += "; charset=utf-8" if "charset" not in ctype else ""
        with open(full, "rb") as fh:
            data = fh.read()
        cache = "no-cache" if full.endswith((".html", ".js", ".css")) else "public, max-age=300"
        return self._send(200, data, ctype, {"Cache-Control": cache})


# --------------------------------------------------------------------- main


def main():
    imported = import_old_data()
    init_db()
    daily_backup()
    try:
        httpd = ThreadingHTTPServer((HOST, PORT), Handler)
    except OSError:
        print("")
        print("  MoneyNest could not start: port %d is already in use." % PORT)
        print("  It is probably already running in another window. Open http://localhost:%d" % PORT)
        print("")
        return
    threading.Thread(target=backup_loop, daemon=True).start()
    print("")
    print("  MoneyNest is running.  Keep this window open while you use the app.")
    print("  ----------------------------------------------------------------")
    print("  Open in your browser :  http://localhost:%d" % PORT)
    print("  Your data is saved in:  %s" % DB_PATH)
    print("  Backups               :  %s" % BACKUPS)
    print("  (Only this PC can open the app. Closing this window just stops the app;")
    print("   your data stays in the folder above.)")
    print("")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n  Stopped.")
    finally:
        httpd.server_close()


if __name__ == "__main__":
    main()
