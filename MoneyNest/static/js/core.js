'use strict';
/* =====================================================================
   MoneyNest core: storage on device, sync with the PC, helpers
   ===================================================================== */
const APP_KEY = 'mn_v1';
/* true when the app runs from the web (phone) instead of from the server on your PC */
const STANDALONE = (window.MN_CONFIG && typeof MN_CONFIG.standalone === 'boolean') ? MN_CONFIG.standalone : !/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

/* ---------- small pure-JS SHA-256 (used only for the on-device PIN lock) ---------- */
const sha256 = (() => {
  const K = [], H0 = [];
  let p = 2, n = 0;
  while (n < 64) {
    let prime = true;
    for (let d = 2; d * d <= p; d++) if (p % d === 0) { prime = false; break; }
    if (prime) {
      if (n < 8) H0[n] = (Math.pow(p, 1 / 2) % 1 * 4294967296) | 0;
      K[n] = (Math.pow(p, 1 / 3) % 1 * 4294967296) | 0;
      n++;
    }
    p++;
  }
  const rr = (v, a) => (v >>> a) | (v << (32 - a));
  return function (str) {
    const bytes = new TextEncoder().encode(str);
    const l = bytes.length;
    const total = (((l + 8) >> 6) + 1) * 16;
    const words = new Int32Array(total);
    for (let i = 0; i < l; i++) words[i >> 2] |= bytes[i] << (24 - (i % 4) * 8);
    words[l >> 2] |= 0x80 << (24 - (l % 4) * 8);
    words[total - 1] = l * 8;
    let H = H0.slice();
    for (let j = 0; j < total; j += 16) {
      const w = Array.from(words.subarray(j, j + 16));
      const old = H.slice(0, 8);
      for (let i = 0; i < 64; i++) {
        const w15 = w[i - 15], w2 = w[i - 2];
        const a = H[0], e = H[4];
        const wi = i < 16 ? w[i] : (w[i - 16] + (rr(w15, 7) ^ rr(w15, 18) ^ (w15 >>> 3)) + w[i - 7] + (rr(w2, 17) ^ rr(w2, 19) ^ (w2 >>> 10))) | 0;
        w[i] = wi;
        const t1 = H[7] + (rr(e, 6) ^ rr(e, 11) ^ rr(e, 25)) + ((e & H[5]) ^ (~e & H[6])) + K[i] + wi;
        const t2 = (rr(a, 2) ^ rr(a, 13) ^ rr(a, 22)) + ((a & H[1]) ^ (a & H[2]) ^ (H[1] & H[2]));
        H = [(t1 + t2) | 0].concat(H.slice(0, 7));
        H[4] = (H[4] + t1) | 0;
      }
      for (let i = 0; i < 8; i++) H[i] = (H[i] + old[i]) | 0;
    }
    return H.map(x => ('00000000' + (x >>> 0).toString(16)).slice(-8)).join('');
  };
})();

/* ---------- Store: everything lives in this device's browser storage and
   is merged with the PC database by Sync (last write wins per record) ---------- */
const Store = {
  d: null,
  load() {
    try { this.d = JSON.parse(localStorage.getItem(APP_KEY)); } catch (e) { this.d = null; }
    if (!this.d || !this.d.records) {
      this.d = { records: {}, seq: 0, dirty: {}, token: '', salt: '', pinHash: '', lastSync: 0, lang: 'en', seeded: 0, seeded2: 0 };
    }
  },
  save() {
    try { localStorage.setItem(APP_KEY, JSON.stringify(this.d)); }
    catch (e) { if ((typeof UI !== "undefined" && UI)) UI.toast('Storage is full on this device'); }
  },
  list(kind) {
    const out = [];
    for (const key in this.d.records) {
      const r = this.d.records[key];
      if (r.kind === kind && !r.deleted) out.push(Object.assign({}, r.data, { id: r.id }));
    }
    return out;
  },
  get(kind, id) {
    const r = this.d.records[kind + ':' + id];
    return r && !r.deleted ? Object.assign({}, r.data, { id: r.id }) : null;
  },
  put(kind, id, data) {
    const key = kind + ':' + id;
    const old = this.d.records[key];
    const ts = Math.max(Date.now(), (old ? old.updated_at : 0) + 1);
    const clean = Object.assign({}, data); delete clean.id;
    this.d.records[key] = { kind, id, data: clean, updated_at: ts, deleted: 0 };
    this.d.dirty[key] = ts;
    this.save();
    Sync.soon();
  },
  remove(kind, id) {
    const key = kind + ':' + id;
    const old = this.d.records[key];
    if (!old) return;
    const ts = Math.max(Date.now(), old.updated_at + 1);
    this.d.records[key] = { kind, id, data: old.data, updated_at: ts, deleted: 1 };
    this.d.dirty[key] = ts;
    this.save();
    Sync.soon();
  },
  /* default accounts/categories use fixed ids so every device agrees */
  seed() {
    if (this.d.seeded) return;
    const put = (kind, id, data) => { this.d.records[kind + ':' + id] = { kind, id, data, updated_at: 1, deleted: 0 }; };
    [['acc_cash', 'Cash', 'নগদ টাকা', 'cash'], ['acc_bkash', 'bKash', 'বিকাশ', 'phone'], ['acc_bank', 'Bank', 'ব্যাংক', 'bank']]
      .forEach(([id, name, nameBn, icon], i) => put('account', id, { name, nameBn, icon, opening: 0, order: i }));
    const ex = [
      ['cat_food', 'Food', 'খাবার', 'food', '#f97316'], ['cat_transport', 'Transport', 'যাতায়াত', 'bus', '#3b82f6'],
      ['cat_study', 'Study', 'পড়াশোনা', 'book', '#8b5cf6'], ['cat_shopping', 'Shopping', 'কেনাকাটা', 'bag', '#ec4899'],
      ['cat_bills', 'Bills', 'বিল', 'bolt', '#eab308'], ['cat_health', 'Health', 'স্বাস্থ্য', 'pulse', '#ef4444'],
      ['cat_fun', 'Entertainment', 'বিনোদন', 'fun', '#14b8a6'], ['cat_wish', 'Wishlist', 'উইশলিস্ট', 'heart', '#d946ef'],
      ['cat_other', 'Other', 'অন্যান্য', 'dots', '#64748b']];
    ex.forEach(([id, name, nameBn, icon, color], i) => put('category', id, { name, nameBn, icon, color, type: 'expense', order: i }));
    const inc = [
      ['cat_parents', 'Parents', 'বাবা-মা', 'users', '#16a34a'], ['cat_salary', 'Salary / Job', 'বেতন / চাকরি', 'briefcase', '#0ea5e9'],
      ['cat_gift', 'Gift', 'উপহার', 'gift', '#f43f5e'], ['cat_other_in', 'Other', 'অন্যান্য', 'dots', '#64748b']];
    inc.forEach(([id, name, nameBn, icon, color], i) => put('category', id, { name, nameBn, icon, color, type: 'income', order: i }));
    this.d.seeded = 1;
    this.save();
  },
  /* one-tap shortcuts (Bus 10/15, Cigarette 10/23) are added once, for old and new users */
  seed2() {
    if (this.d.seeded2) return;
    const put = (id, data) => { this.d.records['quick:' + id] = { kind: 'quick', id, data, updated_at: 1, deleted: 0 }; };
    put('q_bus', { name: 'Bus', nameBn: 'বাস', emoji: '🚌', cat: 'cat_transport', amounts: [10, 15], order: 0 });
    put('q_cig', { name: 'Cigarette', nameBn: 'সিগারেট', emoji: '🚬', cat: 'cat_fun', amounts: [10, 23], order: 1 });
    this.d.seeded2 = 1;
    this.save();
  }
};

/* ---------- emoji defaults (used when the user has not picked one) ---------- */
const DEFAULT_EMOJI = {
  cat_food: '🍔', cat_transport: '🚌', cat_study: '📚', cat_shopping: '🛍️', cat_bills: '💡', cat_health: '💊', cat_fun: '🎬', cat_wish: '🎁', cat_other: '✨',
  cat_parents: '👨‍👩‍👧', cat_salary: '💼', cat_gift: '🎁', cat_other_in: '✨', acc_cash: '💵', acc_bkash: '📱', acc_bank: '🏦'
};
const EMOJI_SET = ['🍔', '🍕', '🍜', '☕', '🥤', '🍎', '🛒', '🚌', '🚕', '🚆', '⛽', '🏍️', '📚', '✏️', '🎓', '🛍️', '👕', '👟', '💡', '📱', '💻', '🎧', '🎬', '🎮', '🎵', '🚬', '🍿', '⚽', '💊', '🏥', '🎁', '🎂', '🏠', '💼', '💰', '💵', '🏦', '👨‍👩‍👧', '❤️', '✈️', '🐶', '🌟', '✨', '🔧', '💈', '🧾', '🙏', '🎯'];
/* once a record has an emoji field (even empty) the user's choice wins; otherwise use the default */
const emojiOf = o => (o ? (typeof o.emoji === 'string' ? o.emoji : (DEFAULT_EMOJI[o.id] || '')) : '');

/* ---------- theme: light / dark / auto (stored in this browser) ---------- */
const Theme = {
  key: 'mn_theme',
  get() { try { return localStorage.getItem(this.key) || 'light'; } catch (e) { return 'light'; } },
  resolved(mode) { mode = mode || this.get(); return mode === 'auto' ? (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : mode; },
  apply(mode, animate) {
    const r = this.resolved(mode), el = document.documentElement;
    if (animate) { el.classList.add('theme-anim'); setTimeout(() => el.classList.remove('theme-anim'), 500); }
    el.setAttribute('data-theme', r);
    const m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', r === 'dark' ? '#090f1d' : '#ffffff');
  },
  set(mode) { try { localStorage.setItem(this.key, mode); } catch (e) { /* ignore */ } this.apply(mode, true); },
  toggle() { this.set(this.resolved() === 'dark' ? 'light' : 'dark'); }
};
if (window.matchMedia) {
  try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (Theme.get() === 'auto') Theme.apply('auto', true); }); } catch (e) { /* old browser */ }
}

/* ---------- Sync with the PC ---------- */
const Sync = {
  busy: false,
  timer: null,
  status: 'offline', // ok | syncing | offline | auth
  async api(path, body) {
    const headers = { 'Content-Type': 'application/json' };
    if (Store.d.token) headers.Authorization = 'Bearer ' + Store.d.token;
    const ctl = new AbortController();
    const to = setTimeout(() => ctl.abort(), 12000);
    try {
      const r = await fetch(path, { method: body ? 'POST' : 'GET', headers, body: body ? JSON.stringify(body) : undefined, signal: ctl.signal, cache: 'no-store' });
      let j = {};
      try { j = await r.json(); } catch (e) { /* not json */ }
      if (!r.ok) { const err = new Error(j.error || ('HTTP ' + r.status)); err.status = r.status; err.data = j; throw err; }
      return j;
    } finally { clearTimeout(to); }
  },
  setStatus(s) { this.status = s; if ((typeof UI !== "undefined" && UI)) UI.syncBadge(); },
  soon() { if ((typeof UI !== "undefined" && UI)) UI.syncBadge(); if ((typeof Drive !== "undefined" && Drive)) Drive.soon(); clearTimeout(this.timer); this.timer = setTimeout(() => this.run(), 700); },
  async run(retry) {
    if (this.busy || !Store.d.token) return;
    this.busy = true;
    this.setStatus('syncing');
    try {
      const keys = Object.keys(Store.d.dirty);
      const sentAt = {};
      const changes = keys.map(k => {
        const r = Store.d.records[k];
        sentAt[k] = r.updated_at;
        return { kind: r.kind, id: r.id, data: r.data, updated_at: r.updated_at, deleted: r.deleted };
      });
      const res = await this.api('/api/sync', { since: Store.d.seq, changes });
      for (const k of keys) if (Store.d.dirty[k] === sentAt[k]) delete Store.d.dirty[k];
      let touched = false;
      for (const ch of res.changes) {
        const key = ch.kind + ':' + ch.id;
        if (Store.d.dirty[key]) continue; // a newer local edit is still waiting to be sent
        const loc = Store.d.records[key];
        if (!loc || ch.updated_at > loc.updated_at) {
          Store.d.records[key] = { kind: ch.kind, id: ch.id, data: ch.data, updated_at: ch.updated_at, deleted: ch.deleted ? 1 : 0 };
          touched = true;
        }
      }
      if (res.seq < Store.d.seq && !retry) { // PC database was restored/replaced: start over
        Store.d.seq = 0;
        for (const k in Store.d.records) Store.d.dirty[k] = Store.d.records[k].updated_at;
        Store.save(); this.busy = false;
        return this.run(true);
      }
      Store.d.seq = res.seq;
      Store.d.lastSync = Date.now();
      Store.save();
      this.setStatus('ok');
      if (touched && (typeof UI !== "undefined" && UI)) { UI.refresh(); if ((typeof Drive !== "undefined" && Drive)) Drive.soon(); }
    } catch (e) {
      if (e.status === 401) { this.setStatus('auth'); if ((typeof UI !== "undefined" && UI)) UI.needLogin(); }
      else this.setStatus('offline');
    } finally { this.busy = false; }
  },
  pending() { return Object.keys(Store.d.dirty).length; }
};

/* ---------- date + money helpers ---------- */
const pad = n => String(n).padStart(2, '0');
const isoDate = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const todayISO = () => isoDate(new Date());
const monthOf = iso => iso.slice(0, 7);
const curMonth = () => monthOf(todayISO());
const daysInMonth = ym => { const [y, m] = ym.split('-').map(Number); return new Date(y, m, 0).getDate(); };
const shiftMonth = (ym, delta) => { const [y, m] = ym.split('-').map(Number); const d = new Date(y, m - 1 + delta, 1); return d.getFullYear() + '-' + pad(d.getMonth() + 1); };
const locale = () => (Store.d.lang === 'bn' ? 'bn-BD' : 'en-IN');
const BN_DIGITS = '০১২৩৪৫৬৭৮৯';
const localDigits = s => (Store.d.lang === 'bn' ? String(s).replace(/[0-9]/g, d => BN_DIGITS[d]) : String(s));
const num = n => { const v = Math.round((+n || 0) * 100) / 100; return Math.abs(v).toLocaleString(locale(), { maximumFractionDigits: 2 }); };
const money = n => { const v = Math.round((+n || 0) * 100) / 100; return (v < 0 ? '−' : '') + '৳' + num(v); };
const shortNum = n => {
  const a = Math.abs(n);
  let s;
  if (a >= 100000) s = (n / 100000).toFixed(a % 100000 ? 1 : 0).replace(/\.0$/, '') + (Store.d.lang === 'bn' ? ' লা' : 'L');
  else if (a >= 1000) s = (n / 1000).toFixed(a % 1000 ? 1 : 0).replace(/\.0$/, '') + 'k';
  else s = String(Math.round(n));
  return localDigits(s);
};
const fmtDate = (iso, opts) => new Date(iso + 'T00:00:00').toLocaleDateString(locale(), opts || { day: 'numeric', month: 'short' });
const fmtMonth = ym => new Date(ym + '-01T00:00:00').toLocaleDateString(locale(), { month: 'long', year: 'numeric' });
const daysUntil = iso => Math.round((new Date(iso + 'T00:00:00') - new Date(todayISO() + 'T00:00:00')) / 86400000);
const fmtMonthShort = ym => new Date(ym + '-01T00:00:00').toLocaleDateString(locale(), { month: 'short' });

/* ---------- derived numbers ---------- */
const Calc = {
  settings() { return Object.assign({ monthlyBudget: 0, dailyLimit: 0, name: '' }, Store.get('settings', 'main') || {}); },
  txs() { return Store.list('tx').filter(t => typeof t.date === 'string' && t.date.length === 10 && isFinite(+t.amount)); },
  accounts() { return Store.list('account').sort((a, b) => (a.order || 0) - (b.order || 0)); },
  categories(type) { return Store.list('category').filter(c => !type || c.type === type).sort((a, b) => (a.order || 0) - (b.order || 0)); },
  balances(txs) {
    const accs = this.accounts();
    const bal = {};
    accs.forEach(a => { bal[a.id] = +a.opening || 0; });
    (txs || this.txs()).forEach(t => {
      if (!(t.account in bal)) return;
      if (t.type === 'income') bal[t.account] += +t.amount;
      else if (t.type === 'expense') bal[t.account] -= +t.amount;
      else if (t.type === 'transfer') { bal[t.account] -= +t.amount; if (t.to in bal) bal[t.to] += +t.amount; }
    });
    // lend/borrow entries move real money in and out of accounts (but are not income/expense)
    this.loans().forEach(l => {
      if (!(l.account in bal)) return;
      bal[l.account] += (l.kind === 'borrow' || l.kind === 'back') ? +l.amount : -l.amount;
    });
    return bal;
  },
  /* ---- lend / borrow ----
     kinds: lend = I gave money, back = they paid me back, borrow = I took money, pay = I paid back
     net > 0  -> they owe me     net < 0  -> I owe them */
  people() { return Store.list('person').sort((a, b) => (a.code || '').localeCompare(b.code || '')); },
  loans(personId) {
    const ids = new Set(Store.list('person').map(p => p.id));
    return Store.list('loan').filter(l => ids.has(l.personId) && isFinite(+l.amount) && (!personId || l.personId === personId));
  },
  loanDelta(l) { const a = +l.amount; return (l.kind === 'lend' || l.kind === 'pay') ? a : -a; },
  personStats(personId, all) {
    const st = { lent: 0, back: 0, borrowed: 0, paid: 0, net: 0, count: 0 };
    (all || this.loans(personId)).forEach(l => {
      if (l.personId !== personId) return;
      st.count++;
      if (l.kind === 'lend') st.lent += +l.amount; else if (l.kind === 'back') st.back += +l.amount;
      else if (l.kind === 'borrow') st.borrowed += +l.amount; else if (l.kind === 'pay') st.paid += +l.amount;
    });
    st.net = (st.lent - st.back) - (st.borrowed - st.paid);
    return st;
  },
  loanTotals() {
    const all = this.loans(), out = { toGet: 0, toPay: 0 };
    this.people().forEach(p => { const n = this.personStats(p.id, all).net; if (n > 0.004) out.toGet += n; else if (n < -0.004) out.toPay += -n; });
    return out;
  },
  nextPersonCode() {
    let max = 0;
    Store.list('person').forEach(p => { const m = /^P-(\d+)$/.exec(p.code || ''); if (m) max = Math.max(max, +m[1]); });
    return 'P-' + String(max + 1).padStart(3, '0');
  },
  /* ---- quick-add shortcuts ---- */
  quicks() { return Store.list('quick').filter(q => Array.isArray(q.amounts)).sort((a, b) => (a.order || 0) - (b.order || 0)); },

  /* ---- loan due dates ----
     Repayments are matched to the oldest loan first (FIFO), separately for "I lent" and "I borrowed".
     Returns { entryId: {remaining, repaid} } for lend / borrow entries. */
  loanOpen(personId, all) {
    const list = (all || this.loans(personId)).filter(l => l.personId === personId);
    const out = {};
    [['lend', 'back'], ['borrow', 'pay']].forEach(([give, ret]) => {
      let pool = list.filter(l => l.kind === ret).reduce((s, l) => s + +l.amount, 0);
      list.filter(l => l.kind === give).sort((a, b) => a.date.localeCompare(b.date) || (a.ts || 0) - (b.ts || 0) || a.id.localeCompare(b.id)).forEach(l => {
        const used = Math.min(pool, +l.amount);
        pool -= used;
        out[l.id] = { remaining: +l.amount - used, repaid: used };
      });
    });
    return out;
  },
  /* open loans that have a due date, soonest first */
  dueList() {
    const all = this.loans(), res = [];
    this.people().forEach(p => {
      const open = this.loanOpen(p.id, all);
      all.forEach(l => {
        if (l.personId !== p.id || !l.due || !open[l.id] || open[l.id].remaining <= 0.004) return;
        res.push({ loan: l, person: p, remaining: open[l.id].remaining, dir: l.kind === 'lend' ? 'get' : 'owe', due: l.due, days: daysUntil(l.due) });
      });
    });
    return res.sort((a, b) => a.due.localeCompare(b.due));
  },

  /* ---- streak: days in a row you stayed within your daily limit ----
     A day counts when spent <= limit. Counting starts on your first entry; today counts while you are still under. */
  streak(txs, limit) {
    const res = { cur: 0, best: 0, last7: [], hasLimit: limit > 0, started: false };
    const dates = txs.map(t => t.date).sort();
    const first = dates[0];
    const today = todayISO();
    const spent = {};
    txs.forEach(t => { if (t.type === 'expense' && !t.wishId) spent[t.date] = (spent[t.date] || 0) + +t.amount; });
    const ok = d => limit > 0 && (spent[d] || 0) <= limit;
    if (first) res.started = true;
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i); const date = isoDate(d);
      res.last7.push({ date, ok: !!first && date >= first && ok(date), skip: !first || date < first || !(limit > 0), today: date === today, label: d.getDay() });
    }
    if (!first || !(limit > 0)) return res;
    let run = 0, d = new Date(first + 'T00:00:00'), end = new Date(today + 'T00:00:00');
    for (; d <= end; d.setDate(d.getDate() + 1)) {
      if (ok(isoDate(d))) { run++; res.best = Math.max(res.best, run); } else run = 0;
    }
    res.cur = run; // the walk ends today, so run is the live streak
    return res;
  },
  wishSavedMap() {
    const m = {};
    Store.list('wishsave').forEach(e => { m[e.wishId] = (m[e.wishId] || 0) + (e.type === 'add' ? +e.amount : -e.amount); });
    return m;
  },
  reserved() {
    const m = this.wishSavedMap();
    return Store.list('wish').filter(w => w.status !== 'bought').reduce((s, w) => s + Math.max(0, m[w.id] || 0), 0);
  },
  /* money you actually "spend" for limits: expenses except wishlist purchases */
  spentOn(txs, date) { return txs.filter(t => t.type === 'expense' && !t.wishId && t.date === date).reduce((s, t) => s + +t.amount, 0); },
  monthStats(txs, ym) {
    const m = txs.filter(t => monthOf(t.date) === ym);
    const income = m.filter(t => t.type === 'income').reduce((s, t) => s + +t.amount, 0);
    const expenseAll = m.filter(t => t.type === 'expense').reduce((s, t) => s + +t.amount, 0);
    const expense = m.filter(t => t.type === 'expense' && !t.wishId).reduce((s, t) => s + +t.amount, 0);
    return { income, expenseAll, expense, saved: income - expenseAll };
  },
  /* money saved by staying under the daily limit, cumulative up to `upTo` */
  limitSavings(txs, ym, limit, upTo) {
    const n = daysInMonth(ym);
    const last = upTo ? Math.min(n, +upTo.slice(8)) : n;
    const pts = [];
    let cum = 0;
    for (let d = 1; d <= last; d++) {
      const date = ym + '-' + pad(d);
      const spent = this.spentOn(txs, date);
      const diff = limit > 0 ? limit - spent : 0;
      cum += diff;
      pts.push({ date, day: d, spent, diff, cum });
    }
    return pts;
  }
};

/* ---------- CSV / JSON export ---------- */
function download(name, text, type) {
  const blob = new Blob([text], { type: type || 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}
function exportLoansCSV() {
  const accs = Object.fromEntries(Calc.accounts().map(a => [a.id, a.name]));
  const people = Object.fromEntries(Calc.people().map(p => [p.id, p]));
  const label = { lend: 'I lent', back: 'They paid me back', borrow: 'I borrowed', pay: 'I paid back' };
  const q = v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
  const rows = [['Person ID', 'Person', 'Date', 'Type', 'Amount', 'Account', 'Note']];
  Calc.loans().sort((a, b) => a.date.localeCompare(b.date)).forEach(l =>
    rows.push([people[l.personId].code, people[l.personId].name, l.date, label[l.kind] || l.kind, l.amount, accs[l.account] || '', l.note || '']));
  download('moneynest-loans.csv', '\ufeff' + rows.map(r => r.map(q).join(',')).join('\r\n'), 'text/csv');
}
function exportCSV() {
  const accs = Object.fromEntries(Calc.accounts().map(a => [a.id, a.name]));
  const cats = Object.fromEntries(Store.list('category').map(c => [c.id, c.name]));
  const q = v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
  const rows = [['Date', 'Type', 'Amount', 'Category', 'Account', 'To account', 'Note']];
  Calc.txs().sort((a, b) => a.date.localeCompare(b.date)).forEach(t =>
    rows.push([t.date, t.type, t.amount, cats[t.cat] || '', accs[t.account] || '', accs[t.to] || '', t.note || '']));
  download('moneynest-transactions.csv', '﻿' + rows.map(r => r.map(q).join(',')).join('\r\n'), 'text/csv');
}
