'use strict';
/* =====================================================================
   Google Drive sync (optional).
   Every device (PC browser, phone) writes ONE file of its own into a "MoneyNest" folder
   in your Google Drive and reads the files of the other devices. Records are merged by
   "newest edit wins". Nothing is ever deleted from Drive, and deletions inside the app are kept
   as markers, so no device can erase another device's data. A backup file is also saved
   once per month and never changed afterwards.
   ===================================================================== */
const Drive = {
  state: 'off', // off | ok | syncing | reconnect | error | offline
  msg: '',
  busy: false,
  timer: null,
  tokenClient: null,
  scope: 'https://www.googleapis.com/auth/drive.file',
  api() { return (window.MN_CONFIG && MN_CONFIG.driveApi) || 'https://www.googleapis.com'; },
  clientId() {
    let id = (window.MN_CONFIG && MN_CONFIG.googleClientId) || '';
    if (!id) { try { id = localStorage.getItem('mn_gclient') || ''; } catch (e) { /* ignore */ } }
    return id.trim();
  },
  enabled() { return !!(this.clientId() && Store.d && Store.d.driveOn); },
  deviceId() {
    let id = '';
    try { id = localStorage.getItem('mn_device') || ''; } catch (e) { /* ignore */ }
    if (!id) { id = uid(); try { localStorage.setItem('mn_device', id); } catch (e) { /* ignore */ } }
    return id;
  },
  set(state, msg) { this.state = state; this.msg = msg || ''; if ((typeof UI !== "undefined" && UI)) { UI.syncBadge(); UI.driveCardUpdate(); } },

  /* ---------- sign-in (Google Identity Services) ---------- */
  getStoredToken() {
    try { const j = JSON.parse(localStorage.getItem('mn_gtoken') || 'null'); if (j && j.exp > Date.now() + 60000) return j.t; } catch (e) { /* ignore */ }
    return '';
  },
  hasToken() { return !!(this.testToken() || this.getStoredToken()); },
  testToken() { return (window.MN_CONFIG && MN_CONFIG.testToken) || ''; },
  loadGsi() {
    if (window.google && google.accounts && google.accounts.oauth2) return Promise.resolve();
    if (this._gsi) return this._gsi;
    this._gsi = new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = 'https://accounts.google.com/gsi/client'; s.async = true;
      s.onload = () => res(); s.onerror = () => { this._gsi = null; rej(new Error('offline')); };
      document.head.appendChild(s);
    });
    return this._gsi;
  },
  async token(interactive) {
    const tt = this.testToken(); if (tt) return tt;
    const have = this.getStoredToken(); if (have) return have;
    await this.loadGsi();
    return new Promise((res, rej) => {
      if (!this.tokenClient) {
        this.tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: this.clientId(), scope: this.scope,
          callback: r => {
            if (r && r.access_token) {
              try { localStorage.setItem('mn_gtoken', JSON.stringify({ t: r.access_token, exp: Date.now() + (+r.expires_in || 3600) * 1000 })); } catch (e) { /* ignore */ }
              this._cb && this._cb.res(r.access_token);
            } else this._cb && this._cb.rej(new Error((r && r.error) || 'denied'));
          },
          error_callback: e => { this._cb && this._cb.rej(new Error((e && e.type) || 'popup')); }
        });
      }
      this._cb = { res, rej };
      setTimeout(() => rej(new Error('timeout')), 90000);
      try { this.tokenClient.requestAccessToken({ prompt: '' }); } catch (e) { rej(e); }
    });
  },
  forgetToken() { try { localStorage.removeItem('mn_gtoken'); } catch (e) { /* ignore */ } },

  /* ---------- Drive REST ---------- */
  async call(path, opts, tok) {
    const r = await fetch(this.api() + path, Object.assign({}, opts, { headers: Object.assign({ Authorization: 'Bearer ' + tok }, (opts && opts.headers) || {}) }));
    if (r.status === 401) { this.forgetToken(); const e = new Error('auth'); e.auth = true; throw e; }
    if (!r.ok) { let m = ''; try { m = (await r.json()).error.message; } catch (e) { /* ignore */ } const e = new Error(m || ('HTTP ' + r.status)); e.status = r.status; throw e; }
    return r;
  },
  async list(q, fields, tok) {
    const out = []; let page = '';
    do {
      const r = await this.call('/drive/v3/files?pageSize=200&spaces=drive&q=' + encodeURIComponent(q) + '&fields=' + encodeURIComponent('nextPageToken,files(' + fields + ')') + (page ? '&pageToken=' + page : ''), {}, tok);
      const j = await r.json(); out.push(...(j.files || [])); page = j.nextPageToken || '';
    } while (page);
    return out;
  },
  async upload(meta, bodyObj, tok, id) {
    const b = 'mn' + Math.random().toString(36).slice(2);
    const body = '--' + b + '\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n' + JSON.stringify(meta) + '\r\n--' + b + '\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n' + JSON.stringify(bodyObj) + '\r\n--' + b + '--';
    const r = await this.call('/upload/drive/v3/files' + (id ? '/' + id : '') + '?uploadType=multipart&fields=id,modifiedTime', { method: id ? 'PATCH' : 'POST', headers: { 'Content-Type': 'multipart/related; boundary=' + b }, body }, tok);
    return r.json();
  },
  async download(id, tok) { const r = await this.call('/drive/v3/files/' + id + '?alt=media', {}, tok); return r.json(); },

  /* ---------- merge ---------- */
  mergeIn(records) {
    let touched = 0;
    for (const key in records || {}) {
      const r = records[key];
      if (!r || typeof r.kind !== 'string' || typeof r.id !== 'string' || !isFinite(+r.updated_at) || typeof r.data !== 'object' || r.data === null) continue;
      if (key !== r.kind + ':' + r.id) continue;
      const loc = Store.d.records[key];
      if (!loc || r.updated_at > loc.updated_at) {
        Store.d.records[key] = { kind: r.kind, id: r.id, data: r.data, updated_at: +r.updated_at, deleted: r.deleted ? 1 : 0 };
        if (!STANDALONE) Store.d.dirty[key] = +r.updated_at; // PC database should receive it too
        touched++;
      }
    }
    return touched;
  },
  signature() {
    let n = 0, mx = 0, sum = 0;
    for (const k in Store.d.records) { const u = Store.d.records[k].updated_at; n++; if (u > mx) mx = u; sum = (sum + (u % 1000003)) % 1000000007; }
    return n + ':' + mx + ':' + sum;
  },

  /* ---------- the sync ---------- */
  async sync(interactive) {
    if (!this.clientId()) { this.set('off'); return; }
    if (this.busy) return;
    this.busy = true;
    const prev = this.state;
    try {
      let tok;
      try { tok = await this.token(!!interactive); }
      catch (e) { this.set(e.message === 'offline' || !navigator.onLine ? 'offline' : 'reconnect'); return; }
      this.set('syncing');
      // 1. folder(s)
      let folders = await this.list("name = 'MoneyNest' and mimeType = 'application/vnd.google-apps.folder' and trashed = false", 'id,name,createdTime', tok);
      folders.sort((a, b) => String(a.createdTime).localeCompare(String(b.createdTime)));
      if (!folders.length) {
        const r = await this.call('/drive/v3/files?fields=id,createdTime', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'MoneyNest', mimeType: 'application/vnd.google-apps.folder' }) }, tok);
        folders = [await r.json()];
      }
      const home = folders[0].id;
      // 2. files of all devices (own file included, so a wiped device gets everything back)
      let files = [];
      for (const f of folders) files.push(...await this.list("'" + f.id + "' in parents and trashed = false", 'id,name,modifiedTime', tok));
      const me = 'moneynest-device-' + this.deviceId() + '.json';
      const seen = Store.d.driveSeen || (Store.d.driveSeen = {});
      let pulled = 0;
      for (const f of files) {
        if (!/^moneynest-device-.+\.json$/.test(f.name)) continue;
        if (seen[f.id] === f.modifiedTime) continue;
        const j = await this.download(f.id, tok);
        if (j && j.records) pulled += this.mergeIn(j.records);
        seen[f.id] = f.modifiedTime;
      }
      if (pulled) Store.save();
      // 3. upload own file if anything changed
      const mine = files.find(f => f.name === me);
      const sig = this.signature();
      if (!mine || Store.d.driveSig !== sig) {
        const payload = { app: 'MoneyNest', version: 1, device: this.deviceId(), label: STANDALONE ? 'phone/web' : 'pc', savedAt: Date.now(), records: Store.d.records };
        const up = await this.upload(mine ? { name: me } : { name: me, parents: [home], mimeType: 'application/json' }, payload, tok, mine && mine.id);
        seen[up.id] = up.modifiedTime;
        Store.d.driveSig = sig;
      }
      // 4. one permanent backup per month (created once, never changed or deleted)
      const bk = 'moneynest-backup-' + curMonth() + '.json';
      if (!files.some(f => f.name === bk)) {
        await this.upload({ name: bk, parents: [home], mimeType: 'application/json' }, { app: 'MoneyNest', version: 1, savedAt: Date.now(), records: Store.d.records }, tok);
      }
      Store.d.driveLast = Date.now(); Store.d.driveOn = 1;
      Store.save();
      this.set('ok');
      if (pulled && (typeof UI !== "undefined" && UI)) { UI.refresh(); Sync.soon(); }
    } catch (e) {
      if (e.auth) this.set('reconnect');
      else if (e.name === 'TypeError' || !navigator.onLine) this.set('offline');
      else this.set('error', e.message);
      if (prev === 'ok' && this.state === 'offline') this.state = 'offline';
    } finally { this.busy = false; }
  },
  soon() {
    if (!this.enabled()) return;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => { if (this.hasToken()) this.sync(false); else this.set('reconnect'); }, 3500);
  },
  /* called when the app opens */
  boot() {
    if (!this.clientId()) return;
    if (this.enabled()) {
      this.state = 'reconnect';
      if (this.hasToken()) this.sync(false);
      else {
        // browsers only allow the sign-in window after a tap, so try once on the first tap
        const once = () => { document.removeEventListener('click', once, true); if (this.enabled() && !this.hasToken() && !this.busy) this.sync(true); };
        document.addEventListener('click', once, true);
        this.sync(false);
      }
      if (!this._iv) this._iv = setInterval(() => { if (!document.hidden && this.enabled() && this.hasToken()) this.sync(false); }, 60000);
    } else this.set('off');
  },
  async connect() { await this.sync(true); if (this.state === 'ok' && !this._iv) this._iv = setInterval(() => { if (!document.hidden && this.enabled() && this.hasToken()) this.sync(false); }, 60000); },
  disconnect() {
    const t = this.getStoredToken();
    try { if (t && window.google && google.accounts) google.accounts.oauth2.revoke(t, () => { }); } catch (e) { /* ignore */ }
    this.forgetToken(); Store.d.driveOn = 0; Store.save(); this.set('off');
  }
};
