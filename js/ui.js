'use strict';
/* =====================================================================
   MoneyNest screens
   ===================================================================== */
const ICONS = {
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
  chart: '<path d="M5 20v-7M11 20V5M17 20v-10M3 20h18"/>',
  heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z"/>',
  sliders: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
  up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  swap: '<path d="M7 7h13M16 3l4 4-4 4M17 17H4M8 13l-4 4 4 4"/>',
  food: '<path d="M6 3v7a2 2 0 002 2v9M10 3v7a2 2 0 01-2 2M17 21V3c-2 1-3 4-3 8h3"/>',
  bus: '<rect x="4" y="4" width="16" height="13" rx="3"/><path d="M4 11h16M8 21v-4M16 21v-4"/><circle cx="8" cy="14" r=".6"/><circle cx="16" cy="14" r=".6"/>',
  book: '<path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2V5z"/><path d="M4 19a2 2 0 012-2h13"/>',
  bag: '<path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 016 0v2"/>',
  bolt: '<path d="M13 3L5 14h6l-1 7 8-11h-6l1-7z"/>',
  pulse: '<path d="M3 12h4l2-6 4 12 2-6h6"/>',
  fun: '<circle cx="12" cy="12" r="9"/><path d="M10 8.5l6 3.5-6 3.5v-7z"/>',
  dots: '<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
  userplus: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M19 8v6M16 11h6"/>',
  users: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 5a3 3 0 010 6M21 20c0-2.5-1.5-4.6-3.5-5.5"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18"/>',
  gift: '<rect x="3" y="9" width="18" height="4" rx="1"/><path d="M12 9v12M5 13v7h14v-7"/><path d="M12 9c-1-3-5-4-5-1.5C7 9 12 9 12 9zM12 9c1-3 5-4 5-1.5C17 9 12 9 12 9z"/>',
  wallet: '<path d="M4 7a2 2 0 012-2h11v4"/><rect x="3" y="7" width="18" height="13" rx="3"/><circle cx="16.5" cy="13.5" r="1.2"/>',
  bank: '<path d="M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/>',
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
  cash: '<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 9v.01M18 15v.01"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
  sync: '<path d="M20 11a8 8 0 00-14-4M4 4v4h4M4 13a8 8 0 0014 4M20 20v-4h-4"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  chevL: '<path d="M15 5l-7 7 7 7"/>',
  chevR: '<path d="M9 5l7 7-7 7"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  search: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
  download: '<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',
  tag: '<path d="M3 12V4h8l10 10-8 8L3 12z"/><circle cx="7.5" cy="8.5" r="1"/>',
  piggy: '<path d="M5 11a7 6 0 0114 0v3a3 3 0 01-3 3h-1v3h-3v-3h-2v3H7v-3a4 4 0 01-2-3.5V11z"/><path d="M19 9l2-1M9 8.5h.01"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z"/>',
  file: '<path d="M6 3h8l4 4v14H6V3z"/><path d="M14 3v4h4M9 13h6M9 17h6"/>',
  bolt2: '<path d="M13 3L5 14h6l-1 7 8-11h-6l1-7z"/>'
};
const ic = (n, s) => '<svg class="ic" viewBox="0 0 24 24" width="' + (s || 20) + '" height="' + (s || 20) + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[n] || ICONS.tag) + '</svg>';
const t = k => ((T[Store.d.lang] && T[Store.d.lang][k]) || T.en[k] || k);
const nm = o => (o ? (Store.d.lang === 'bn' && o.nameBn ? o.nameBn : o.name) : '');
const tint = c => (c || '#64748b') + '1f';
const PALETTE = ['#f97316', '#3b82f6', '#8b5cf6', '#ec4899', '#eab308', '#ef4444', '#14b8a6', '#16a34a', '#0ea5e9', '#d946ef', '#64748b', '#0f9d8a'];
const CAT_ICONS = ['food', 'bus', 'book', 'bag', 'bolt', 'pulse', 'fun', 'gift', 'users', 'briefcase', 'wallet', 'target', 'home', 'tag'];
const parseAmt = s => {
  const a = String(s == null ? '' : s).replace(/[০-৯]/g, d => BN_DIGITS.indexOf(d)).replace(/[,\s৳]/g, '');
  const v = parseFloat(a);
  return isFinite(v) ? v : 0;
};
/* emoji if the item has one, otherwise the line icon */
const iconHTML = (o, sz, fallback) => { const e = emojiOf(o); return e ? '<span class="emo">' + esc(e) + '</span>' : ic((o && o.icon) || fallback || 'tag', sz); };
const emojiPicker = cur => '<div class="field"><span>' + t('emoji') + '</span><div class="emoji-row"><input name="emoji" type="text" maxlength="8" value="' + esc(cur || '') + '" placeholder="🙂" autocomplete="off"><small>' + t('pickEmoji') + '</small></div><div class="emoji-grid">' + EMOJI_SET.map(e => '<button type="button" class="emoji-btn' + (e === cur ? ' on' : '') + '" data-act="pickEmoji" data-e="' + e + '">' + e + '</button>').join('') + '</div></div>';
const inputAmt = v => (v ? String(v) : '');

const UI = {
  page: 'home', personId: '', month: curMonth(), filter: 'all', q: '', unlocked: false, draft: null, hiddenAt: 0, openLogs: {}, showBought: false,

  /* ------------------------------------------------------------ boot */
  async boot() {
    Store.load(); Store.seed(); Store.seed2(); Theme.apply(Theme.get());
    document.documentElement.lang = Store.d.lang === 'bn' ? 'bn' : 'en';
    this.bindGlobal();
    if (STANDALONE) { // phone / web copy: no PC server, the PIN is checked on this device
      if (Store.d.pinHash) return this.showLock(true);
      return this.showSetup();
    }
    let status = null;
    try { status = await Sync.api('/api/status'); } catch (e) { /* PC off or no network */ }
    if (status && !status.setup) { Store.d.token = ''; Store.d.pinHash = ''; return this.showSetup(); }
    if (status) Store.d.salt = status.salt || Store.d.salt;
    if (Store.d.token && Store.d.pinHash) return this.showLock(!!status);
    if (status) return this.showLogin();
    return this.showOffline();
  },
  authShell(inner) {
    $('#app').innerHTML = '<div class="auth"><div class="auth-card"><img class="auth-logo" src="icons/logo.svg" alt="MoneyNest"><h1>MoneyNest</h1>' + inner + '</div></div>';
    const i = $('#app input'); if (i) setTimeout(() => i.focus(), 50);
  },
  deviceLabel() { return /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent) ? 'Phone' : 'PC'; },
  showSetup() {
    this.authShell('<p class="sub">' + t(STANDALONE ? 'setupSubPhone' : 'setupSub') + '</p><form data-form="setup"><input class="pin" name="pin" type="password" inputmode="numeric" autocomplete="new-password" maxlength="12" placeholder="' + t('newPin') + '"><input class="pin" name="pin2" type="password" inputmode="numeric" autocomplete="new-password" maxlength="12" placeholder="' + t('confirmPin') + '"><div class="err" id="autherr"></div><button class="btn primary block" type="submit">' + t('createPin') + '</button></form><p class="hint">' + t(STANDALONE ? 'pinHintPhone' : 'pinHint') + '</p>');
  },
  showLogin(msg) {
    this.authShell('<p class="sub">' + t('loginSub') + '</p><form data-form="login"><input class="pin" name="pin" type="password" inputmode="numeric" autocomplete="current-password" maxlength="12" placeholder="' + t('enterPin') + '"><div class="err" id="autherr">' + esc(msg || '') + '</div><button class="btn primary block" type="submit">' + t('signIn') + '</button></form>');
  },
  showLock(online) {
    this.unlocked = false;
    this.authShell('<p class="sub">' + t('lockSub') + '</p><form data-form="unlock"><input class="pin" name="pin" type="password" inputmode="numeric" autocomplete="off" maxlength="12" placeholder="' + t('enterPin') + '"><div class="err" id="autherr"></div><button class="btn primary block" type="submit">' + t('unlock') + '</button></form>' + (online === false ? '<p class="hint">' + t('offlineLock') + '</p>' : '') + (STANDALONE ? '' : '<button class="link" data-act="useServerLogin">' + t('forgotPin') + '</button>'));
  },
  showOffline() {
    this.authShell('<p class="sub">' + t('offlineFirst') + '</p><button class="btn primary block" data-act="retryBoot">' + t('retry') + '</button>');
  },
  needLogin() { if (this.unlocked) { this.toast(t('signInAgain')); } this.showLogin(t('signInAgain')); this.unlocked = false; },
  enter() {
    this.unlocked = true;
    this.render();
    Sync.run();
    Drive.boot();
    if (!this._timer) {
      this._timer = setInterval(() => { if (this.unlocked && !document.hidden) Sync.run(); }, 30000);
    }
  },

  /* ------------------------------------------------------------ shell */
  navItems() { return [['home', 'home'], ['tx', 'list'], ['people', 'users'], ['charts', 'chart'], ['wish', 'heart'], ['settings', 'sliders']]; },
  render() {
    if (!this.unlocked) return;
    const nav = this.navItems().map(([k, i]) => '<button class="navbtn' + (this.page === k ? ' on' : '') + '" data-act="go" data-p="' + k + '">' + ic(i, 22) + '<span>' + t('nav_' + k) + '</span></button>').join('');
    const key = this.page + '|' + this.personId + '|' + this.month + '|' + this.filter;
    const animate = key !== this._key; this._key = key;
    const dark = Theme.resolved() === 'dark';
    $('#app').innerHTML =
      '<div class="shell' + (animate ? ' enter' : '') + '">' +
      '<aside class="side"><div class="brand"><img src="icons/logo.svg" alt=""><b>MoneyNest</b></div>' +
      '<button class="btn primary block" data-act="addTx">' + ic('plus', 18) + ' ' + t('addEntry') + '</button>' +
      '<nav class="sidenav">' + nav + '</nav><div class="sync-badge"></div></aside>' +
      '<main class="main"><header class="top"><div class="top-l"><img src="icons/logo.svg" alt=""><h1>' + t('nav_' + this.page) + '</h1></div><div class="top-r"><button class="themebtn" data-act="toggleTheme" aria-label="' + t('switchTheme') + '" title="' + t('switchTheme') + '">' + ic(dark ? 'sun' : 'moon', 19) + '</button><div class="sync-badge"></div></div></header>' +
      '<div id="page">' + this.pageHTML() + '</div></main>' +
      '<nav class="tabs">' + nav + '</nav>' +
      '<button class="fab" data-act="addTx" aria-label="' + t('addEntry') + '">' + ic('plus', 26) + '</button></div>';
    this.syncBadge();
    if (animate) { this.countUp(); clearTimeout(this._enterT); this._enterT = setTimeout(() => { const sh = $('.shell'); if (sh) sh.classList.remove('enter'); }, 1600); }
  },
  refresh() {
    if (!this.unlocked) return;
    const y = window.scrollY;
    const sheetOpen = $('#sheet').innerHTML !== '';
    this.render();
    window.scrollTo(0, y);
    if (sheetOpen) { /* keep the open form untouched */ }
  },
  /* numbers count up from zero when a page opens */
  countUp() {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    $$('[data-count]').forEach(el => {
      const to = +el.dataset.count, pre = el.dataset.pre || '';
      if (!isFinite(to) || to === 0) return;
      const t0 = performance.now(), dur = 850;
      const step = now => {
        const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        el.textContent = pre + money(to * e);
        if (k < 1) requestAnimationFrame(step); else el.textContent = pre + money(to);
      };
      requestAnimationFrame(step);
    });
  },
  syncBadge() {
    if (STANDALONE) {
      const ds = Drive.state, m = { off: ['off', t('driveLocalOnly')], ok: ['ok', t('driveSaved')], syncing: ['busy', t('driveSyncing')], reconnect: ['off', t('driveReconnect')], offline: ['off', t('driveOffline')], error: ['err', t('driveError')] }[ds] || ['off', t('driveLocalOnly')];
      if (!Drive.clientId()) { m[0] = 'off'; m[1] = t('driveLocalOnly'); }
      $$('.sync-badge').forEach(el => { el.innerHTML = '<span class="dot ' + m[0] + '"></span><span>' + esc(m[1]) + '</span>'; el.setAttribute('data-act', 'syncNow'); });
      return;
    }
    const st = Sync.status, n = Sync.pending();
    let cls = 'ok', txt = t('synced');
    if (st === 'syncing') { cls = 'busy'; txt = t('syncing'); }
    else if (st === 'offline') { cls = 'off'; txt = n ? t('pcOffWait').replace('{n}', localDigits(n)) : t('pcOff'); }
    else if (st === 'auth') { cls = 'err'; txt = t('signInAgain'); }
    $$('.sync-badge').forEach(el => { el.innerHTML = '<span class="dot ' + cls + '"></span><span>' + esc(txt) + '</span>'; el.setAttribute('data-act', 'syncNow'); });
  },
  pageHTML() {
    return ({ home: () => this.pageHome(), tx: () => this.pageTx(), people: () => this.pagePeople(), charts: () => this.pageCharts(), wish: () => this.pageWish(), settings: () => this.pageSettings() })[this.page]();
  },
  monthNav() {
    const next = this.month < curMonth();
    return '<div class="monthnav"><button data-act="mPrev" aria-label="Previous month">' + ic('chevL', 18) + '</button><span>' + esc(fmtMonth(this.month)) + '</span><button data-act="mNext" ' + (next ? '' : 'disabled') + ' aria-label="Next month">' + ic('chevR', 18) + '</button></div>';
  },
  toast(msg, label, fn) {
    const el = $('#toast'); if (!el) return;
    this._toastFn = fn || null;
    el.innerHTML = '<span>' + esc(msg) + '</span>' + (fn ? '<button data-act="toastAction">' + esc(label) + '</button>' : '');
    el.classList.add('show');
    clearTimeout(this._tt); this._tt = setTimeout(() => { el.classList.remove('show'); this._toastFn = null; }, fn ? 5000 : 2600);
  },

  /* ------------------------------------------------------------ rows */
  txRow(tx, cats, accs) {
    const isT = tx.type === 'transfer';
    const cat = cats[tx.cat];
    const color = isT ? '#2f6fed' : (cat ? cat.color : '#64748b');
    const icon = isT ? 'swap' : (cat ? cat.icon : 'dots');
    const title = isT ? nm(accs[tx.account]) + ' → ' + nm(accs[tx.to]) : (cat ? nm(cat) : t('cat_deleted'));
    const sub = [tx.note, isT ? '' : nm(accs[tx.account])].filter(Boolean).join(' · ');
    const sign = tx.type === 'income' ? '+' : tx.type === 'expense' ? '−' : '';
    const cls = tx.type === 'income' ? 'pos' : tx.type === 'expense' ? 'neg' : 'neu';
    return '<button class="row" data-act="editTx" data-id="' + esc(tx.id) + '"><span class="ico" style="background:' + tint(color) + ';color:' + color + '">' + (isT ? ic(icon, 20) : iconHTML(cat, 20, 'dots')) + '</span><span class="row-main"><b>' + esc(title) + '</b><small>' + esc(sub) + '</small></span><span class="amt ' + cls + '">' + sign + money(tx.amount) + '</span></button>';
  },
  lookups() {
    return { cats: Object.fromEntries(Store.list('category').map(c => [c.id, c])), accs: Object.fromEntries(Store.list('account').map(a => [a.id, a])) };
  },

  /* ------------------------------------------------------------ HOME */
  pageHome() {
    const txs = Calc.txs(), s = Calc.settings(), today = todayISO(), ym = curMonth();
    const { cats, accs } = this.lookups();
    const bal = Calc.balances(txs), accList = Calc.accounts();
    const total = accList.reduce((x, a) => x + (bal[a.id] || 0), 0);
    const reserved = Calc.reserved();
    const spent = Calc.spentOn(txs, today), limit = +s.dailyLimit || 0;
    const ms = Calc.monthStats(txs, ym);

    // balance hero
    let h = '<section class="card hero full"><div class="hero-l"><small>' + t('totalBalance') + '</small><div class="big" data-count="' + total + '">' + money(total) + '</div>' +
      (reserved > 0 ? '<div class="muted">' + t('availableAfter') + ' <b>' + money(total - reserved) + '</b> · ' + t('inWishlist') + ' ' + money(reserved) + '</div>' : '') + '</div>' +
      '<div class="accs">' + accList.map(a => '<div class="acc"><span class="ico sm">' + iconHTML(a, 18, 'wallet') + '</span><span><small>' + esc(nm(a)) + '</small><b>' + money(bal[a.id] || 0) + '</b></span></div>').join('') + '</div></section>';

    // today vs daily limit
    let dl;
    if (limit > 0) {
      const pct = spent / limit;
      const col = pct > 1 ? COLORS.expense : pct >= 0.8 ? COLORS.warn : COLORS.brand;
      const left = limit - spent;
      dl = '<section class="card today"><div class="ring">' + Charts.ring(pct, col, localDigits(Math.round(pct * 100)) + '%', t('ofLimit')) + '</div><div class="today-r"><h3>' + t('todaySpending') + '</h3>' +
        '<div class="kv"><span>' + t('spent') + '</span><b>' + money(spent) + '</b></div><div class="kv"><span>' + t('dailyLimit') + '</span><b>' + money(limit) + '</b></div>' +
        (left >= 0 ? '<div class="pill ok">' + t('canSpend') + ' ' + money(left) + '</div><div class="pill save">' + t('savedToday') + ' ' + money(left) + '</div>' : '<div class="pill bad">' + t('overBy') + ' ' + money(-left) + '</div>') + '</div></section>';
    } else {
      dl = '<section class="card today empty"><div><h3>' + t('todaySpending') + '</h3><p class="muted">' + t('spent') + ' ' + money(spent) + '</p><p class="muted">' + t('noLimitYet') + '</p><button class="btn" data-act="go" data-p="settings">' + ic('target', 18) + ' ' + t('setLimit') + '</button></div></section>';
    }

    // month budget
    const budget = +s.monthlyBudget || 0;
    let mb;
    if (budget > 0) {
      const pct = ms.expense / budget, remain = budget - ms.expense;
      const daysLeft = daysInMonth(ym) - (+today.slice(8)) + 1;
      const col = pct > 1 ? COLORS.expense : pct >= 0.8 ? COLORS.warn : COLORS.brand;
      mb = '<section class="card"><div class="card-h"><h3>' + t('monthlyBudget') + '</h3><span class="muted">' + esc(fmtMonth(ym)) + '</span></div>' +
        '<div class="bar"><i style="width:' + Math.min(100, pct * 100).toFixed(1) + '%;background:' + col + '"></i></div>' +
        '<div class="kv"><span>' + t('spent') + ' ' + money(ms.expense) + ' / ' + money(budget) + '</span><b class="' + (remain < 0 ? 'neg' : '') + '">' + (remain >= 0 ? money(remain) + ' ' + t('left') : t('overBy') + ' ' + money(-remain)) + '</b></div>' +
        (remain > 0 ? '<p class="muted">' + t('safePerDay') + ' <b>' + money(remain / daysLeft) + '</b> (' + localDigits(daysLeft) + ' ' + t('daysLeft') + ')</p>' : '') + '</section>';
    } else {
      mb = '<section class="card"><div class="card-h"><h3>' + t('monthlyBudget') + '</h3></div><p class="muted">' + t('noBudgetYet') + '</p><button class="btn" data-act="go" data-p="settings">' + t('setBudget') + '</button></section>';
    }

    // month stats
    const stats = '<section class="stats full"><div class="card stat"><span class="ico sm pos-bg"><span class="emo">💰</span></span><small>' + t('deposits') + '</small><b class="pos" data-count="' + ms.income + '">' + money(ms.income) + '</b></div>' +
      '<div class="card stat"><span class="ico sm neg-bg"><span class="emo">💸</span></span><small>' + t('expenses') + '</small><b class="neg" data-count="' + ms.expenseAll + '">' + money(ms.expenseAll) + '</b></div>' +
      '<div class="card stat"><span class="ico sm save-bg"><span class="emo">🐷</span></span><small>' + t('savedMonth') + '</small><b class="' + (ms.saved < 0 ? 'neg' : 'save') + '" data-count="' + ms.saved + '">' + money(ms.saved) + '</b></div></section>';

    // lend / borrow summary
    const lt = Calc.loanTotals(), dues = Calc.dueList();
    const dueRows = dues.slice(0, 3).map(x => '<button class="row" data-act="openPerson" data-id="' + esc(x.person.id) + '" data-go="1">' + this.avatar(x.person.name) + '<span class="row-main"><b>' + esc(x.person.name) + this.dueBadge(x.days, x.due) + '</b><small>' + (x.dir === 'get' ? t('theyOwe') : t('iOwe')) + '</small></span><span class="amt ' + (x.dir === 'get' ? 'pos' : 'neg') + '">' + money(x.remaining) + '</span></button>').join('');
    const lc = '<section class="card"><div class="card-h"><h3><span class="emo">🤝</span> ' + t('lendBorrow') + '</h3><button class="link" data-act="go" data-p="people">' + t('open') + '</button></div><div class="split2"><div><small>' + t('youWillGet') + '</small><div class="mid pos">' + money(lt.toGet) + '</div></div><div><small>' + t('youOwe') + '</small><div class="mid neg">' + money(lt.toPay) + '</div></div></div>' +
      (dueRows ? '<h4>' + t('dueSoonCard') + '</h4><div class="rows">' + dueRows + '</div>' : '') + '</section>';

    // last 7 days
    const days = [];
    for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); const date = isoDate(d); days.push({ date, day: d.getDate(), spent: Calc.spentOn(txs, date) }); }
    const chart = '<section class="card full"><div class="card-h"><h3>' + t('last7') + '</h3><button class="link" data-act="go" data-p="charts">' + t('seeCharts') + '</button></div>' + Charts.dailyBars(days, limit, t('last7')) +
      (limit > 0 ? '<div class="legend"><span><i class="sw" style="background:' + COLORS.brand + '"></i>' + t('spent') + '</span><span><i class="sw" style="background:' + COLORS.expense + '"></i>' + t('overLimit') + '</span><span><i class="sw dash"></i>' + t('dailyLimit') + '</span></div>' : '') + '</section>';

    // recent
    const recent = txs.sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)).slice(0, 6);
    const rec = '<section class="card"><div class="card-h"><h3>' + t('recent') + '</h3><button class="link" data-act="go" data-p="tx">' + t('seeAll') + '</button></div>' +
      (recent.length ? '<div class="rows">' + recent.map(x => this.txRow(x, cats, accs)).join('') + '</div>' : '<p class="muted center pad">' + t('noEntries') + '</p>') + '</section>';

    // greeting, streak, due alerts, quick add
    const nameTxt = (s.name || '').trim() || t('friend');
    const hr = new Date().getHours();
    const [gk, ge] = hr < 5 ? ['night', '🌙'] : hr < 12 ? ['morning', '🌅'] : hr < 17 ? ['afternoon', '☀️'] : hr < 21 ? ['evening', '🌆'] : ['night', '🌙'];
    const st = Calc.streak(txs, limit);
    const tier = st.cur <= 0 ? 't0' : st.cur >= 30 ? 't4' : st.cur >= 7 ? 't3' : 't1';
    const greet = '<div class="greet"><div><small>' + ge + ' ' + esc(fmtDate(today, { weekday: 'long', day: 'numeric', month: 'long' })) + '</small><h2>' + t('greet_' + gk) + ', <span class="gname">' + esc(nameTxt) + '</span> <span class="wave">👋</span></h2></div>' +
      '<button class="streak ' + tier + '" data-act="streakInfo" aria-label="' + t('streakTitle') + '"><span class="fl">🔥</span><span>' + (st.cur > 0 ? t('streakDays').replace('{n}', localDigits(st.cur)) : t('streakZero')) + '</span></button></div>';
    const over = dues.filter(x => x.days < 0), soon = dues.filter(x => x.days >= 0 && x.days <= 7);
    const alertHTML = (cls, emo, txt) => '<button class="alert' + cls + '" data-act="go" data-p="people"><span class="emo">' + emo + '</span><span>' + txt + '<small>' + t('alertSub') + '</small></span></button>';
    const alerts = (over.length ? alertHTML('', '⏰', t('alertOverdue').replace('{n}', localDigits(over.length))) : '') + (soon.length ? alertHTML(' soon', '🔔', t('alertSoon').replace('{n}', localDigits(soon.length))) : '');
    const qs = Calc.quicks(), catMap = cats;
    const quick = '<section class="card full qa"><div class="card-h"><h3><span class="emo">⚡</span> ' + t('quickAdd') + '</h3><button class="link" data-act="go" data-p="settings">' + t('manageQuick') + '</button></div>' +
      (qs.length ? '<div class="qa-list">' + qs.map(q => '<div class="qa-item"><div class="qa-top"><span class="emo">' + esc(q.emoji || '💸') + '</span><span>' + esc(nm(q)) + '</span><span class="badge">' + esc(nm(catMap[q.cat]) || t('cat_deleted')) + '</span></div><div class="qa-amts">' +
        q.amounts.map(a => '<button class="qa-amt" data-act="quickAdd" data-q="' + esc(q.id) + '" data-a="' + a + '">' + money(a) + '</button>').join('') +
        '<button class="qa-amt other" data-act="quickOther" data-q="' + esc(q.id) + '">' + t('other') + '</button></div></div>').join('') + '</div>' : '<p class="qa-empty">' + t('noQuick') + '</p>') + '</section>';
    return '<div class="home-top">' + greet + alerts + '</div><div class="grid home">' + h + quick + dl + mb + stats + chart + lc + rec + '</div>';
  },
  dueBadge(days, due) {
    if (days < 0) return '<span class="due over">' + t('dueOver').replace('{n}', localDigits(-days)) + '</span>';
    if (days === 0) return '<span class="due soon">' + t('dueToday') + '</span>';
    if (days === 1) return '<span class="due soon">' + t('dueTomorrow') + '</span>';
    if (days <= 7) return '<span class="due soon">' + t('dueIn').replace('{n}', localDigits(days)) + '</span>';
    return '<span class="due later">' + t('dueOn').replace('{d}', esc(fmtDate(due))) + '</span>';
  },
  streakSheet() {
    const txs = Calc.txs(), limit = +Calc.settings().dailyLimit || 0, st = Calc.streak(txs, limit);
    const msg = !st.started ? t('streakNoData') : !limit ? t('streakNeedLimit') : st.cur >= 30 ? t('streakMsg30') : st.cur >= 7 ? t('streakMsg7') : st.cur >= 3 ? t('streakMsg3') : st.cur >= 1 ? t('streakMsg1') : t('streakMsg0');
    const dots = st.last7.map(d => '<div class="sdot ' + (d.skip ? '' : d.ok ? 'ok' : 'bad') + (d.today ? ' today' : '') + '"><i>' + (d.skip ? '·' : d.ok ? '✓' : '✕') + '</i>' + esc(new Date(d.date + 'T00:00:00').toLocaleDateString(locale(), { weekday: 'short' })) + '</div>').join('');
    this.sheet(t('streakTitle'), '<div class="sbig"><div class="fl">🔥</div><div class="num">' + localDigits(st.cur) + '</div><div class="muted">' + t('days') + '</div></div><p class="center">' + esc(msg) + '</p><div class="sdots">' + dots + '</div>' +
      '<div class="kv"><span>' + t('streakCurrent') + '</span><b>' + localDigits(st.cur) + ' ' + t('days') + '</b></div><div class="kv"><span>' + t('streakBest') + '</span><b>' + localDigits(st.best) + ' ' + t('days') + '</b></div><p class="muted xs">' + t('streakHelp') + '</p>');
  },

  /* ------------------------------------------------------------ TRANSACTIONS */
  pageTx() {
    const ms = Calc.monthStats(Calc.txs(), this.month);
    return this.monthNav() +
      '<div class="toolbar"><div class="seg">' + [['all', 'all'], ['income', 'deposits'], ['expense', 'expenses'], ['transfer', 'transfers']].map(([k, l]) => '<button class="' + (this.filter === k ? 'on' : '') + '" data-act="filter" data-f="' + k + '">' + t(l) + '</button>').join('') + '</div>' +
      '<label class="search">' + ic('search', 18) + '<input data-q type="search" placeholder="' + t('search') + '" value="' + esc(this.q) + '"></label></div>' +
      '<div class="summary"><span class="pos">+' + money(ms.income) + '</span><span class="neg">−' + money(ms.expenseAll) + '</span><span class="' + (ms.saved < 0 ? 'neg' : 'save') + '">' + t('savedMonth') + ' ' + money(ms.saved) + '</span></div>' +
      '<div id="txlist">' + this.txListHTML() + '</div>';
  },
  txListHTML() {
    const { cats, accs } = this.lookups();
    const q = this.q.trim().toLowerCase();
    let list = Calc.txs().filter(x => monthOf(x.date) === this.month && (this.filter === 'all' || x.type === this.filter));
    if (q) list = list.filter(x => ((x.note || '') + ' ' + nm(cats[x.cat]) + ' ' + nm(accs[x.account]) + ' ' + x.amount).toLowerCase().includes(q));
    if (!list.length) return '<div class="card empty-state">' + ic('wallet', 34) + '<p>' + t('noEntries') + '</p><button class="btn primary" data-act="addTx">' + t('addEntry') + '</button></div>';
    list.sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
    const groups = {};
    list.forEach(x => (groups[x.date] = groups[x.date] || []).push(x));
    return Object.keys(groups).sort().reverse().map(d => {
      const g = groups[d];
      const net = g.reduce((s, x) => s + (x.type === 'income' ? +x.amount : x.type === 'expense' ? -x.amount : 0), 0);
      return '<section class="card day"><div class="day-h"><b>' + esc(fmtDate(d, { weekday: 'long', day: 'numeric', month: 'short' })) + '</b><span class="' + (net < 0 ? 'neg' : 'pos') + '">' + (net >= 0 ? '+' : '') + money(net) + '</span></div><div class="rows">' + g.map(x => this.txRow(x, cats, accs)).join('') + '</div></section>';
    }).join('');
  },

  /* ------------------------------------------------------------ CHARTS */
  pageCharts() {
    const txs = Calc.txs(), s = Calc.settings(), limit = +s.dailyLimit || 0, ym = this.month;
    const n = daysInMonth(ym), today = todayISO();
    const { cats } = this.lookups();
    const days = [];
    for (let d = 1; d <= n; d++) { const date = ym + '-' + pad(d); days.push({ date, day: d, spent: Calc.spentOn(txs, date), future: date > today }); }
    const past = days.filter(d => !d.future);
    const total = past.reduce((a, d) => a + d.spent, 0);
    const under = limit > 0 ? past.filter(d => d.spent <= limit).length : 0;
    const best = past.length ? past.reduce((m, d) => (d.spent > m.spent ? d : m), past[0]) : null;

    let c1 = '<section class="card"><div class="card-h"><h3>' + t('dailySpending') + '</h3></div>' + Charts.dailyBars(days, limit, t('dailySpending')) +
      '<div class="legend"><span><i class="sw" style="background:' + COLORS.brand + '"></i>' + t('spent') + '</span>' + (limit > 0 ? '<span><i class="sw" style="background:' + COLORS.expense + '"></i>' + t('overLimit') + '</span><span><i class="sw dash"></i>' + t('dailyLimit') + ' ' + money(limit) + '</span>' : '') + '</div>' +
      '<div class="mini-stats"><div><small>' + t('avgDaily') + '</small><b>' + money(past.length ? total / past.length : 0) + '</b></div>' +
      (limit > 0 ? '<div><small>' + t('daysUnder') + '</small><b>' + localDigits(under) + ' / ' + localDigits(past.length) + '</b></div>' : '') +
      '<div><small>' + t('highestDay') + '</small><b>' + (best && best.spent > 0 ? money(best.spent) + ' · ' + esc(fmtDate(best.date)) : '—') + '</b></div></div></section>';

    let c2;
    if (limit > 0) {
      const pts = Calc.limitSavings(txs, ym, limit, ym === curMonth() ? today : null);
      const final = pts.length ? pts[pts.length - 1].cum : 0;
      c2 = '<section class="card"><div class="card-h"><h3>' + t('savingsByLimit') + '</h3><b class="' + (final < 0 ? 'neg' : 'save') + '">' + money(final) + '</b></div><p class="muted">' + t('savingsByLimitHelp') + '</p>' +
        Charts.line(pts.map(p => ({ y: p.cum, label: localDigits(p.day), tip: fmtDate(p.date) + ': ' + money(p.cum) })), t('savingsByLimit'), COLORS.save) + '</section>';
    } else {
      c2 = '<section class="card"><div class="card-h"><h3>' + t('savingsByLimit') + '</h3></div><p class="muted">' + t('noLimitYet') + '</p><button class="btn" data-act="go" data-p="settings">' + t('setLimit') + '</button></section>';
    }

    const months = [];
    for (let i = 5; i >= 0; i--) { const m = shiftMonth(ym, -i); const st = Calc.monthStats(txs, m); months.push({ ym: m, income: st.income, expense: st.expenseAll }); }
    const c3 = '<section class="card"><div class="card-h"><h3>' + t('incomeVsExpense') + '</h3></div>' + Charts.groupedBars(months, t('incomeVsExpense')) +
      '<div class="legend"><span><i class="sw" style="background:' + COLORS.income + '"></i>' + t('deposits') + '</span><span><i class="sw" style="background:' + COLORS.expense + '"></i>' + t('expenses') + '</span></div></section>';

    const byCat = {};
    txs.filter(x => x.type === 'expense' && monthOf(x.date) === ym).forEach(x => { byCat[x.cat] = (byCat[x.cat] || 0) + +x.amount; });
    const items = Object.keys(byCat).map(id => ({ name: cats[id] ? nm(cats[id]) : t('cat_deleted'), color: cats[id] ? cats[id].color : '#94a3b8', value: byCat[id] })).sort((a, b) => b.value - a.value);
    const sum = items.reduce((a, i) => a + i.value, 0);
    const c4 = '<section class="card"><div class="card-h"><h3>' + t('byCategory') + '</h3></div>' + (items.length ?
      '<div class="donut-wrap">' + Charts.donut(items, t('expenses'), t('byCategory')) + '<ul class="cat-list">' + items.map(i => '<li><i class="sw" style="background:' + i.color + '"></i><span>' + esc(i.name) + '</span><b>' + money(i.value) + '</b><small>' + localDigits(Math.round(i.value / sum * 100)) + '%</small></li>').join('') + '</ul></div>' : Charts.empty(t('noExpenseMonth'))) + '</section>';

    return this.monthNav() + '<div class="reportbar"><button class="btn" data-act="openReport">' + ic('file', 18) + ' ' + t('reportBtn') + '</button></div><div class="grid charts">' + c1 + c2 + c3 + c4 + '</div>';
  },

  /* ------------------------------------------------------------ WISHLIST */
  pageWish() {
    const wishes = Store.list('wish');
    const saved = Calc.wishSavedMap();
    const active = wishes.filter(w => w.status !== 'bought').sort((a, b) => (b.created || '').localeCompare(a.created || ''));
    const bought = wishes.filter(w => w.status === 'bought').sort((a, b) => (b.boughtOn || '').localeCompare(a.boughtOn || ''));
    const reserved = Calc.reserved();
    const goal = active.reduce((s, w) => s + (+w.price || 0), 0);
    const head = '<section class="card hero wish-hero"><div class="hero-l"><small>' + t('savedForWishes') + '</small><div class="big">' + money(reserved) + '</div><div class="muted">' + t('ofTotalGoal') + ' ' + money(goal) + '</div></div><button class="btn primary" data-act="addWish">' + ic('plus', 18) + ' ' + t('addWish') + '</button></section>';
    if (!wishes.length) return head + '<div class="card empty-state">' + ic('heart', 34) + '<p>' + t('noWishes') + '</p></div>';
    const entries = Store.list('wishsave');
    const card = w => {
      const sv = Math.max(0, saved[w.id] || 0), price = +w.price || 0;
      const pct = price > 0 ? Math.min(100, sv / price * 100) : 0;
      const isB = w.status === 'bought';
      const log = entries.filter(e => e.wishId === w.id).sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
      const open = this.openLogs[w.id];
      return '<section class="card wish' + (isB ? ' done' : '') + (pct >= 100 && !isB ? ' complete' : '') + '"><div class="wish-top"><span class="ico" style="background:' + tint('#d946ef') + ';color:#d946ef">' + (isB ? ic('check', 20) : (typeof w.emoji === 'string' && w.emoji ? '<span class="emo">' + esc(w.emoji) + '</span>' : '<span class="emo">🎁</span>')) + '</span><div class="row-main"><b>' + esc(w.name) + '</b><small>' + esc(w.note || '') + '</small></div><button class="iconbtn" data-act="editWish" data-id="' + esc(w.id) + '" aria-label="' + t('edit') + '">' + ic('edit', 18) + '</button></div>' +
        '<div class="wish-nums"><div><small>' + t('price') + '</small><b>' + money(price) + '</b></div><div><small>' + t('saved') + '</small><b class="save">' + money(sv) + '</b></div><div><small>' + t('remaining') + '</small><b>' + money(Math.max(0, price - sv)) + '</b></div></div>' +
        '<div class="bar"><i style="width:' + pct.toFixed(1) + '%;background:' + (pct >= 100 ? COLORS.income : COLORS.save) + '"></i></div><div class="muted xs">' + localDigits(Math.round(pct)) + '% ' + (isB ? '· ' + t('boughtOn') + ' ' + esc(w.boughtOn ? fmtDate(w.boughtOn) : '') : '') + '</div>' +
        '<div class="btns">' + (isB ? '<button class="btn" data-act="reopenWish" data-id="' + esc(w.id) + '">' + t('moveBack') + '</button>' : '<button class="btn primary" data-act="addSaving" data-id="' + esc(w.id) + '">' + ic('piggy', 18) + ' ' + t('addSavings') + '</button><button class="btn" data-act="useSaving" data-id="' + esc(w.id) + '"' + (sv > 0 ? '' : ' disabled') + '>' + ic('bag', 18) + ' ' + t('useSavings') + '</button>') +
        '<button class="link" data-act="toggleLog" data-id="' + esc(w.id) + '">' + (open ? t('hideHistory') : t('history') + ' (' + localDigits(log.length) + ')') + '</button></div>' +
        (open ? '<div class="log">' + (log.length ? log.map(e => '<div class="log-row"><span>' + esc(fmtDate(e.date)) + (e.note ? ' · ' + esc(e.note) : '') + '</span><b class="' + (e.type === 'add' ? 'save' : 'neg') + '">' + (e.type === 'add' ? '+' : '−') + money(e.amount) + '</b><small>' + (e.type === 'add' ? t('added') : t('used')) + '</small><button class="iconbtn sm" data-act="delEntry" data-id="' + esc(e.id) + '" aria-label="' + t('delete') + '">' + ic('x', 16) + '</button></div>').join('') : '<p class="muted xs">' + t('noHistory') + '</p>') + '</div>' : '') + '</section>';
    };
    return head + '<div class="grid wishes">' + active.map(card).join('') + '</div>' +
      (bought.length ? '<button class="link center-link" data-act="toggleBought">' + (this.showBought ? t('hideBought') : t('showBought') + ' (' + localDigits(bought.length) + ')') + '</button>' + (this.showBought ? '<div class="grid wishes">' + bought.map(card).join('') + '</div>' : '') : '');
  },

  /* ------------------------------------------------------------ LOANS (lend / borrow) */
  loanMeta(kind) { return ({ lend: ['down', '#e5484d', -1], pay: ['down', '#e5484d', -1], back: ['up', '#16a34a', 1], borrow: ['up', '#16a34a', 1] })[kind] || ['dots', '#64748b', 0]; },
  avatar(name, big) {
    let h = 0; for (const c of name) h = (h * 31 + c.codePointAt(0)) % 997;
    const col = PALETTE[h % PALETTE.length];
    return '<span class="avatar' + (big ? ' lg' : '') + '" style="background:' + tint(col) + ';color:' + col + '">' + esc((Array.from(name.trim())[0] || '?').toUpperCase()) + '</span>';
  },
  balanceText(n) { return n > 0.004 ? t('owesYou') + ' ' + money(n) : n < -0.004 ? t('youOweThem') + ' ' + money(-n) : t('settled'); },
  pagePeople() {
    const cur = this.personId && Store.get('person', this.personId);
    if (cur) return this.pagePerson(cur);
    this.personId = '';
    const all = Calc.loans(), tot = Calc.loanTotals();
    const nextDue = {}; Calc.dueList().forEach(x => { if (!nextDue[x.person.id]) nextDue[x.person.id] = x; });
    const rows = Calc.people().map(pp => ({ pp, st: Calc.personStats(pp.id, all) }))
      .sort((a, b) => Math.abs(b.st.net) - Math.abs(a.st.net) || a.pp.name.localeCompare(b.pp.name));
    const head = '<section class="stats two"><div class="card stat"><span class="ico sm pos-bg">' + ic('up', 18) + '</span><small>' + t('youWillGet') + '</small><b class="pos">' + money(tot.toGet) + '</b></div><div class="card stat"><span class="ico sm neg-bg">' + ic('down', 18) + '</span><small>' + t('youOwe') + '</small><b class="neg">' + money(tot.toPay) + '</b></div></section>' +
      '<div class="btns pbar"><button class="btn primary" data-act="addPerson">' + ic('userplus', 18) + ' ' + t('addPerson') + '</button></div>';
    if (!rows.length) return head + '<div class="card empty-state">' + ic('users', 34) + '<p>' + t('noPeople') + '</p></div>';
    return head + '<section class="card"><div class="rows">' + rows.map(({ pp, st }) => {
      const n = st.net, cls = n > 0.004 ? 'pos' : n < -0.004 ? 'neg' : 'neu';
      const lab = n > 0.004 ? t('owesYou') : n < -0.004 ? t('youOweThem') : t('settled');
      return '<button class="row" data-act="openPerson" data-id="' + esc(pp.id) + '">' + this.avatar(pp.name) + '<span class="row-main"><b>' + esc(pp.name) + '</b><small>' + esc(pp.code) + ' \u00b7 ' + localDigits(st.count) + ' ' + t('entriesCount') + (nextDue[pp.id] ? this.dueBadge(nextDue[pp.id].days, nextDue[pp.id].due) : '') + '</small></span><span class="amt ' + cls + '">' + (Math.abs(n) > 0.004 ? money(Math.abs(n)) : '') + '<small class="bs">' + lab + '</small></span></button>';
    }).join('') + '</div></section>';
  },
  pagePerson(p) {
    const loans = Calc.loans(p.id), st = Calc.personStats(p.id, loans), n = st.net;
    const accs = Object.fromEntries(Calc.accounts().map(a => [a.id, a]));
    const cls = n > 0.004 ? 'pos' : n < -0.004 ? 'neg' : 'neu';
    const headline = n > 0.004 ? t('owesYouLong').replace('{name}', esc(p.name)) : n < -0.004 ? t('youOweLong').replace('{name}', esc(p.name)) : t('settled');
    const asc = loans.slice().sort((a, b) => a.date.localeCompare(b.date) || (a.ts || 0) - (b.ts || 0) || a.id.localeCompare(b.id));
    const openMap = Calc.loanOpen(p.id, loans);
    let run = 0;
    const list = asc.map(l => { run += Calc.loanDelta(l); return { l, bal: run }; }).reverse();
    const btn = (k, extra) => '<button class="btn' + (extra || '') + '" data-act="addLoan" data-kind="' + k + '">' + ic(this.loanMeta(k)[0], 18) + ' ' + t('loan_' + k) + '</button>';
    return '<button class="link backlink" data-act="backPeople">' + ic('chevL', 16) + ' ' + t('nav_people') + '</button>' +
      '<section class="card person-head">' + this.avatar(p.name, true) + '<div class="row-main"><b class="pname">' + esc(p.name) + '</b><small>' + t('personId') + ': <b>' + esc(p.code) + '</b>' + (p.phone ? ' \u00b7 ' + esc(p.phone) : '') + '</small>' + (p.note ? '<small>' + esc(p.note) + '</small>' : '') + '</div><button class="iconbtn" data-act="editPerson" data-id="' + esc(p.id) + '" aria-label="' + t('edit') + '">' + ic('edit', 18) + '</button></section>' +
      '<section class="card status ' + cls + '-card"><small>' + t('balance') + '</small><div class="big ' + cls + '">' + (Math.abs(n) > 0.004 ? money(Math.abs(n)) : '\u2713') + '</div><div class="muted">' + headline + '</div></section>' +
      '<section class="grid4"><div class="card stat"><small>' + t('totalLent') + '</small><b>' + money(st.lent) + '</b></div><div class="card stat"><small>' + t('totalBack') + '</small><b>' + money(st.back) + '</b></div><div class="card stat"><small>' + t('totalBorrowed') + '</small><b>' + money(st.borrowed) + '</b></div><div class="card stat"><small>' + t('totalPaid') + '</small><b>' + money(st.paid) + '</b></div></section>' +
      '<div class="btns four">' + btn('lend', ' primary') + btn('back') + btn('borrow') + btn('pay') + '</div>' +
      '<section class="card"><div class="card-h"><h3>' + t('transactions') + '</h3></div>' +
      (list.length ? '<div class="rows">' + list.map(({ l, bal }) => {
        const [icon, color, sgn] = this.loanMeta(l.kind);
        const sub = [fmtDate(l.date, { day: 'numeric', month: 'short', year: 'numeric' }), nm(accs[l.account]), l.note].filter(Boolean).join(' \u00b7 ');
        return '<button class="row" data-act="editLoan" data-id="' + esc(l.id) + '"><span class="ico" style="background:' + tint(color) + ';color:' + color + '">' + ic(icon, 20) + '</span><span class="row-main"><b>' + t('loan_' + l.kind) + (l.due ? this.loanDueBadge(l, openMap[l.id]) : '') + '</b><small>' + esc(sub) + '</small></span><span class="amt ' + (sgn > 0 ? 'pos' : 'neg') + '">' + (sgn > 0 ? '+' : '\u2212') + money(l.amount) + '<small class="bs">' + this.balanceText(bal) + '</small></span></button>';
      }).join('') + '</div>' : '<p class="muted center pad">' + t('noLoanEntries') + '</p>') + '</section>';
  },
  loanDueBadge(l, o) {
    if (!o) return '';
    if (o.remaining <= 0.004) return '<span class="due paid">\u2713 ' + t('repaid') + '</span>';
    return this.dueBadge(daysUntil(l.due), l.due) + (o.repaid > 0.004 ? '<span class="due later">' + money(o.remaining) + ' ' + t('leftToPay') + '</span>' : '');
  },
  personSheet(id) {
    const p = id ? Store.get('person', id) : { name: '', phone: '', note: '' };
    this.sheetId = id || '';
    this.simpleSheet(id ? t('editPerson') : t('addPerson'), 'person',
      '<input type="hidden" name="id" value="' + esc(id || '') + '"><label class="field"><span>' + t('personName') + '</span><input name="name" type="text" maxlength="60" value="' + esc(p.name) + '" autofocus></label><label class="field"><span>' + t('phone') + '</span><input name="phone" type="text" inputmode="tel" maxlength="30" value="' + esc(p.phone || '') + '"></label><label class="field"><span>' + t('note') + '</span><input name="note" type="text" maxlength="120" value="' + esc(p.note || '') + '"></label>' +
      (id ? '<p class="muted xs">' + t('personId') + ': <b>' + esc(p.code) + '</b></p>' : '<p class="muted xs">' + t('idAuto') + '</p>'),
      t('save'), id ? '<button type="button" class="btn danger" data-act="delPerson">' + ic('trash', 18) + ' ' + t('delete') + '</button>' : '');
  },
  loanSheet(kind, id, personId) {
    const ex = id ? Store.get('loan', id) : null, p = Store.get('person', personId), accs = Calc.accounts();
    if (!p) return;
    this.sheetId = id || '';
    const sel = ex ? ex.account : (Store.d.lastAcc && accs.some(a => a.id === Store.d.lastAcc) ? Store.d.lastAcc : (accs[0] || {}).id);
    this.simpleSheet(t('loan_' + kind) + ' \u00b7 ' + esc(p.name), 'loan',
      '<input type="hidden" name="id" value="' + esc(id || '') + '"><input type="hidden" name="personId" value="' + esc(personId) + '"><input type="hidden" name="kind" value="' + kind + '">' +
      '<label class="amount-field"><span>\u09f3</span><input name="amount" type="text" inputmode="decimal" placeholder="0" value="' + esc(ex ? ex.amount : '') + '" autofocus></label>' +
      '<div class="two"><label class="field"><span>' + t(kind === 'lend' || kind === 'pay' ? 'payFrom' : 'receiveIn') + '</span><select name="account">' + this.accountOptions(sel) + '</select></label><label class="field"><span>' + t('date') + '</span><input name="date" type="date" value="' + esc(ex ? ex.date : todayISO()) + '"></label></div>' +
      '<label class="field"><span>' + t('note') + '</span><input name="note" type="text" maxlength="120" value="' + esc(ex ? ex.note || '' : '') + '" placeholder="' + t('notePh') + '"></label>' +
      (kind === 'lend' || kind === 'borrow' ? '<label class="field"><span>' + t('dueDate') + ' (' + t('optional') + ')</span><input name="due" type="date" value="' + esc(ex && ex.due ? ex.due : '') + '"><span class="duechips"><button type="button" class="btn sm" data-act="dueIn" data-d="7">' + t('inWeek') + '</button><button type="button" class="btn sm" data-act="dueIn" data-d="30">' + t('inMonth') + '</button><button type="button" class="btn sm" data-act="dueIn" data-d="0">' + t('noDate') + '</button></span></label><p class="muted xs">' + t('dueHelp') + '</p>' : '') + '<p class="muted xs">' + t('loanNote') + '</p>',
      t('save'), id ? '<button type="button" class="btn danger" data-act="delLoan">' + ic('trash', 18) + ' ' + t('delete') + '</button>' : '');
  },

  /* ------------------------------------------------------------ SETTINGS */
  pageSettings() {
    const s = Calc.settings(), accs = Calc.accounts(), bal = Calc.balances();
    const cats = Calc.categories();
    const catChip = c => '<button class="chip" data-act="editCat" data-id="' + esc(c.id) + '"><span class="ico xs" style="background:' + tint(c.color) + ';color:' + c.color + '">' + iconHTML(c, 14) + '</span>' + esc(nm(c)) + '</button>';
    const cm = Theme.get();
    const lastSync = Store.d.lastSync ? new Date(Store.d.lastSync).toLocaleString(locale(), { dateStyle: 'medium', timeStyle: 'short' }) : t('never');
    const qrows = Calc.quicks().map(q => '<button class="row" data-act="editQuick" data-id="' + esc(q.id) + '"><span class="ico"><span class="emo">' + esc(q.emoji || '💸') + '</span></span><span class="row-main"><b>' + esc(nm(q)) + '</b><small>' + esc(nm(Store.get('category', q.cat)) || t('cat_deleted')) + '</small></span><span class="amt">' + q.amounts.map(a => money(a)).join(' · ') + '</span></button>').join('');
    return '<div class="grid settings">' +
      '<section class="card"><div class="card-h"><h3><span class="emo">🎨</span> ' + t('profile') + '</h3></div>' +
      '<label class="field"><span>' + t('yourName') + '</span><input data-sett="name" type="text" maxlength="30" value="' + esc(s.name || '') + '" placeholder="' + t('yourNamePh') + '"></label>' +
      '<div class="field"><span>' + t('theme') + '</span><div class="seg">' + [['light', 'themeLight', 'sun'], ['dark', 'themeDark', 'moon'], ['auto', 'themeAuto', 'sliders']].map(([k, l, i]) => '<button class="' + (cm === k ? 'on' : '') + '" data-act="setTheme" data-m="' + k + '">' + ic(i, 16) + ' ' + t(l) + '</button>').join('') + '</div></div></section>' +
      '<section class="card"><div class="card-h"><h3><span class="emo">⚡</span> ' + t('manageQuick') + '</h3><button class="btn sm" data-act="addQuick">' + ic('plus', 16) + ' ' + t('add') + '</button></div>' +
      (qrows ? '<div class="rows qlist">' + qrows + '</div>' : '<p class="muted">' + t('noQuick') + '</p>') + '<p class="muted xs">' + t('quickNote') + '</p></section>' +
      '<section class="card"><div class="card-h"><h3>' + ic('target', 20) + ' ' + t('budgetLimits') + '</h3></div>' +
      '<label class="field"><span>' + t('monthlyBudget') + ' (৳)</span><input data-set="monthlyBudget" type="text" inputmode="decimal" value="' + inputAmt(s.monthlyBudget) + '" placeholder="0"></label>' +
      '<label class="field"><span>' + t('dailyLimit') + ' (৳)</span><input data-set="dailyLimit" type="text" inputmode="decimal" value="' + inputAmt(s.dailyLimit) + '" placeholder="0"></label>' +
      '<p class="muted xs">' + t('limitNote') + '</p></section>' +

      '<section class="card"><div class="card-h"><h3>' + ic('wallet', 20) + ' ' + t('accounts') + '</h3><button class="btn sm" data-act="addAccount">' + ic('plus', 16) + ' ' + t('add') + '</button></div><div class="rows">' +
      accs.map(a => '<button class="row" data-act="editAccount" data-id="' + esc(a.id) + '"><span class="ico">' + iconHTML(a, 20, 'wallet') + '</span><span class="row-main"><b>' + esc(nm(a)) + '</b><small>' + t('openingBalance') + ' ' + money(a.opening || 0) + '</small></span><span class="amt">' + money(bal[a.id] || 0) + '</span></button>').join('') + '</div></section>' +

      '<section class="card"><div class="card-h"><h3>' + ic('tag', 20) + ' ' + t('categories') + '</h3><button class="btn sm" data-act="addCat">' + ic('plus', 16) + ' ' + t('add') + '</button></div>' +
      '<h4>' + t('expenses') + '</h4><div class="chips">' + cats.filter(c => c.type === 'expense').map(catChip).join('') + '</div>' +
      '<h4>' + t('deposits') + '</h4><div class="chips">' + cats.filter(c => c.type === 'income').map(catChip).join('') + '</div></section>' +

      this.dataCard(lastSync) + '<section class="card" id="drivecard">' + this.driveCardInner() + '</section>' +

      '<section class="card"><div class="card-h"><h3>' + ic('lock', 20) + ' ' + t('securityLanguage') + '</h3></div>' +
      '<div class="field"><span>' + t('language') + '</span><div class="seg"><button class="' + (Store.d.lang === 'en' ? 'on' : '') + '" data-act="lang" data-l="en">English</button><button class="' + (Store.d.lang === 'bn' ? 'on' : '') + '" data-act="lang" data-l="bn">বাংলা</button></div></div>' +
      '<div class="btns"><button class="btn" data-act="changePin">' + ic('lock', 18) + ' ' + t('changePin') + '</button><button class="btn" data-act="lockNow">' + t('lockNow') + '</button></div></section></div>';
  },
  dataCard(lastSync) {
    const exports = '<button class="btn" data-act="openReport">' + ic('file', 18) + ' ' + t('reportBtn') + '</button><button class="btn" data-act="exportCSV">' + ic('download', 18) + ' ' + t('exportCSV') + '</button><button class="btn" data-act="exportLoansCSV">' + ic('download', 18) + ' ' + t('exportLoans') + '</button><button class="btn" data-act="exportBackup">' + ic('download', 18) + ' ' + t('backup') + '</button>';
    if (STANDALONE) return '<section class="card"><div class="card-h"><h3>' + ic('sync', 20) + ' ' + t('phoneData') + '</h3></div><div class="btns" style="margin-top:0">' + exports + '</div><p class="muted xs">' + t('phoneDataSafe') + '</p></section>';
    return '<section class="card"><div class="card-h"><h3>' + ic('sync', 20) + ' ' + t('syncData') + '</h3></div>' +
      '<div class="kv"><span>' + t('status') + '</span><span class="sync-badge"></span></div><div class="kv"><span>' + t('lastSync') + '</span><b>' + esc(lastSync) + '</b></div><div class="kv"><span>' + t('waiting') + '</span><b>' + localDigits(Sync.pending()) + '</b></div>' +
      '<div class="btns"><button class="btn primary" data-act="syncNow">' + ic('sync', 18) + ' ' + t('syncNow') + '</button>' + exports + '</div><p class="muted xs">' + t('dataSafe') + '</p></section>';
  },
  driveCardInner() {
    const ok = !!Drive.clientId(), on = ok && Store.d.driveOn;
    const st = { off: ['off', t('driveOff')], ok: ['ok', t('driveOk')], syncing: ['busy', t('driveSyncing')], reconnect: ['off', t('driveReconnect')], offline: ['off', t('driveOffline')], error: ['err', t('driveError') + (Drive.msg ? ': ' + Drive.msg : '')] }[on || Drive.state !== 'off' ? Drive.state : 'off'] || ['off', t('driveOff')];
    const last = Store.d.driveLast ? new Date(Store.d.driveLast).toLocaleString(locale(), { dateStyle: 'medium', timeStyle: 'short' }) : t('never');
    return '<div class="card-h"><h3><span class="emo">☁️</span> ' + t('driveTitle') + '</h3></div>' +
      (ok ? '<div class="kv"><span>' + t('driveStatus') + '</span><span class="sync-badge" data-act="driveConnect"><span class="dot ' + st[0] + '"></span><span>' + esc(st[1]) + '</span></span></div><div class="kv"><span>' + t('driveLast') + '</span><b>' + esc(last) + '</b></div>' +
        '<div class="btns">' + (on ? '<button class="btn primary" data-act="driveConnect">' + ic('sync', 18) + ' ' + t('driveSyncNow') + '</button><button class="btn" data-act="driveOff">' + t('driveDisconnect') + '</button>' : '<button class="btn primary" data-act="driveConnect">' + ic('sync', 18) + ' ' + t('driveConnect') + '</button>') + '</div>'
        : '<p class="muted">' + t('driveNotSet') + '</p>') +
      '<label class="field" style="margin-top:12px"><span>' + t('driveClientId') + '</span><input data-sett-local="gclient" type="text" value="' + esc((window.MN_CONFIG && MN_CONFIG.googleClientId) ? '' : (function () { try { return localStorage.getItem('mn_gclient') || ''; } catch (e) { return ''; } })()) + '" placeholder="123456-abc.apps.googleusercontent.com" autocomplete="off"' + ((window.MN_CONFIG && MN_CONFIG.googleClientId) ? ' disabled' : '') + '></label>' +
      '<p class="muted xs">' + t('driveSafe') + '</p>';
  },
  driveCardUpdate() {
    const el = $('#drivecard'); if (!el || (document.activeElement && el.contains(document.activeElement))) return;
    el.innerHTML = this.driveCardInner();
  },
  /* ------------------------------------------------------------ sheets / forms */
  sheet(title, body) {
    $('#sheet').innerHTML = '<div class="backdrop" data-act="closeSheet"></div><div class="sheet" role="dialog" aria-modal="true"><div class="sheet-h"><h2>' + title + '</h2><button class="iconbtn" data-act="closeSheet" aria-label="' + t('close') + '">' + ic('x', 20) + '</button></div><div class="sheet-b">' + body + '</div></div>';
    document.body.classList.add('noscroll');
  },
  closeSheet() { $('#sheet').innerHTML = ''; document.body.classList.remove('noscroll'); this.draft = null; },

  openTx(id) {
    const accs = Calc.accounts();
    const ex = id ? Store.get('tx', id) : null;
    const type = ex ? ex.type : 'expense';
    this.draft = ex ? Object.assign({}, ex, { amount: String(ex.amount) }) :
      { type, amount: '', cat: (Calc.categories('expense')[0] || {}).id, account: Store.d.lastAcc && accs.some(a => a.id === Store.d.lastAcc) ? Store.d.lastAcc : (accs[0] || {}).id, to: (accs[1] || accs[0] || {}).id, date: todayISO(), note: '' };
    this.draft._id = ex ? ex.id : '';
    this.txSheet();
  },
  txSheet() {
    const d = this.draft, accs = Calc.accounts(), isT = d.type === 'transfer';
    const cats = isT ? [] : Calc.categories(d.type);
    if (!isT && !cats.some(c => c.id === d.cat)) d.cat = (cats[0] || {}).id;
    const seg = ['expense', 'income', 'transfer'].map(k => '<button type="button" class="' + (d.type === k ? 'on ' + k : '') + '" data-act="txType" data-k="' + k + '">' + ic(k === 'expense' ? 'down' : k === 'income' ? 'up' : 'swap', 16) + ' ' + t('type_' + k) + '</button>').join('');
    const body = '<form data-form="tx" autocomplete="off"><div class="seg big">' + seg + '</div>' +
      '<label class="amount-field"><span>৳</span><input name="amount" type="text" inputmode="decimal" placeholder="0" value="' + esc(d.amount) + '" autofocus></label>' +
      (isT ? '' : '<div class="field"><span>' + t('category') + '</span><div class="chips pick">' + cats.map(c => '<button type="button" class="chip' + (d.cat === c.id ? ' on' : '') + '" data-act="pickCat" data-id="' + esc(c.id) + '"><span class="ico xs" style="background:' + tint(c.color) + ';color:' + c.color + '">' + iconHTML(c, 14) + '</span>' + esc(nm(c)) + '</button>').join('') + '</div></div>') +
      '<div class="two"><label class="field"><span>' + (isT ? t('fromAccount') : t('account')) + '</span><select name="account">' + accs.map(a => '<option value="' + esc(a.id) + '"' + (d.account === a.id ? ' selected' : '') + '>' + esc(nm(a)) + '</option>').join('') + '</select></label>' +
      (isT ? '<label class="field"><span>' + t('toAccount') + '</span><select name="to">' + accs.map(a => '<option value="' + esc(a.id) + '"' + (d.to === a.id ? ' selected' : '') + '>' + esc(nm(a)) + '</option>').join('') + '</select></label>' : '<label class="field"><span>' + t('date') + '</span><input name="date" type="date" value="' + esc(d.date) + '"></label>') + '</div>' +
      (isT ? '<label class="field"><span>' + t('date') + '</span><input name="date" type="date" value="' + esc(d.date) + '"></label>' : '') +
      '<label class="field"><span>' + t('note') + '</span><input name="note" type="text" maxlength="120" value="' + esc(d.note || '') + '" placeholder="' + t('notePh') + '"></label><div class="err" id="formerr"></div>' +
      '<div class="btns end">' + (d._id ? '<button type="button" class="btn danger" data-act="delTx">' + ic('trash', 18) + ' ' + t('delete') + '</button>' : '') + '<button class="btn primary" type="submit">' + ic('check', 18) + ' ' + t('save') + '</button></div></form>';
    this.sheet(d._id ? t('editEntry') : t('addEntry'), body);
  },

  simpleSheet(title, form, fields, submitLabel, extraBtns) {
    this.sheet(title, '<form data-form="' + form + '" autocomplete="off">' + fields + '<div class="err" id="formerr"></div><div class="btns end">' + (extraBtns || '') + '<button class="btn primary" type="submit">' + ic('check', 18) + ' ' + (submitLabel || t('save')) + '</button></div></form>');
  },
  accountOptions(sel) { return Calc.accounts().map(a => '<option value="' + esc(a.id) + '"' + (sel === a.id ? ' selected' : '') + '>' + esc(nm(a)) + '</option>').join(''); },

  /* ------------------------------------------------------------ actions */
  acts: {
    go(d) { UI.page = d.p; if (d.p === 'people') UI.personId = ''; UI.render(); window.scrollTo(0, 0); },
    mPrev() { UI.month = shiftMonth(UI.month, -1); UI.render(); },
    mNext() { if (UI.month < curMonth()) { UI.month = shiftMonth(UI.month, 1); UI.render(); } },
    filter(d) { UI.filter = d.f; UI.render(); },
    addTx() { UI.openTx(); },
    editTx(d) { UI.openTx(d.id); },
    closeSheet() { UI.closeSheet(); },
    txType(d) { UI.readForm(); UI.draft.type = d.k; if (d.k === 'transfer' && UI.draft.account === UI.draft.to) { const a = Calc.accounts().find(x => x.id !== UI.draft.account); if (a) UI.draft.to = a.id; } UI.txSheet(); },
    pickCat(d) { UI.readForm(); UI.draft.cat = d.id; UI.txSheet(); },
    delTx() { if (confirm(t('confirmDelete'))) { const id = UI.draft._id; const tx = Store.get('tx', id); Store.remove('tx', id); if (tx && tx.wishId) { Store.list('wishsave').filter(e => e.txId === id).forEach(e => Store.remove('wishsave', e.id)); } UI.closeSheet(); UI.refresh(); UI.toast(t('deleted')); } },
    syncNow() {
      if (STANDALONE) { if (!Drive.clientId()) { UI.page = 'settings'; UI.render(); return; } Drive.connect().then(() => UI.toast(Drive.state === 'ok' ? t('driveSaved') : t(Drive.state === 'offline' ? 'driveOffline' : 'driveReconnect'))); return; }
      Sync.run().then(() => UI.toast(Sync.status === 'ok' ? t('synced') : t('pcOff')));
      if (Drive.clientId() && Store.d.driveOn) Drive.sync(true);
    },
    driveConnect() { Drive.connect(); },
    driveOff() { if (confirm(t('driveDisconnect') + '?')) { Drive.disconnect(); UI.refresh(); } },
    exportCSV() { exportCSV(); },
    async exportBackup() { if (STANDALONE) { download('moneynest-backup.json', JSON.stringify({ records: Store.d.records }, null, 1), 'application/json'); return; } try { const j = await Sync.api('/api/export'); download('moneynest-backup.json', JSON.stringify(j, null, 1), 'application/json'); } catch (e) { UI.toast(t('needPc')); } },
    lang(d) { Store.d.lang = d.l; Store.save(); document.documentElement.lang = d.l === 'bn' ? 'bn' : 'en'; UI.render(); },
    lockNow() { UI.showLock(true); },
    retryBoot() { UI.boot(); },
    useServerLogin() { Sync.api('/api/status').then(() => UI.showLogin()).catch(() => UI.toast(t('needPc'))); },
    changePin() { UI.simpleSheet(t('changePin'), 'pin', '<label class="field"><span>' + t('currentPin') + '</span><input name="old" type="password" inputmode="numeric" maxlength="12"></label><label class="field"><span>' + t('newPin') + '</span><input name="new" type="password" inputmode="numeric" maxlength="12"></label><p class="muted xs">' + t('pinChangeNote') + '</p>'); },
    /* wishlist */
    addWish() { UI.wishSheet(); },
    editWish(d) { UI.wishSheet(d.id); },
    addSaving(d) { UI.simpleSheet(t('addSavings'), 'addsave', '<input type="hidden" name="id" value="' + esc(d.id) + '"><label class="amount-field"><span>৳</span><input name="amount" type="text" inputmode="decimal" placeholder="0" autofocus></label><div class="two"><label class="field"><span>' + t('date') + '</span><input name="date" type="date" value="' + todayISO() + '"></label><label class="field"><span>' + t('note') + '</span><input name="note" type="text" maxlength="80"></label></div><p class="muted xs">' + t('addSavingsNote') + '</p>'); },
    useSaving(d) {
      const w = Store.get('wish', d.id), sv = Math.max(0, Calc.wishSavedMap()[d.id] || 0);
      UI.simpleSheet(t('useSavings') + ' · ' + esc(w.name), 'usesave', '<input type="hidden" name="id" value="' + esc(d.id) + '"><label class="amount-field"><span>৳</span><input name="amount" type="text" inputmode="decimal" value="' + sv + '"></label><div class="two"><label class="field"><span>' + t('payFrom') + '</span><select name="account">' + UI.accountOptions(Store.d.lastAcc) + '</select></label><label class="field"><span>' + t('date') + '</span><input name="date" type="date" value="' + todayISO() + '"></label></div><label class="check"><input type="checkbox" name="bought" checked> ' + t('markBought') + '</label><p class="muted xs">' + t('useSavingsNote') + ' ' + money(sv) + '.</p>');
    },
    reopenWish(d) { const w = Store.get('wish', d.id); Store.put('wish', d.id, Object.assign(w, { status: 'saving' })); UI.refresh(); },
    toggleLog(d) { UI.openLogs[d.id] = !UI.openLogs[d.id]; UI.refresh(); },
    toggleBought() { UI.showBought = !UI.showBought; UI.refresh(); },
    delEntry(d) { if (!confirm(t('confirmDelete'))) return; const e = Store.get('wishsave', d.id); if (e && e.txId) Store.remove('tx', e.txId); Store.remove('wishsave', d.id); UI.refresh(); },
    delWish() { const id = UI.sheetId; if (!confirm(t('confirmDeleteWish'))) return; Store.list('wishsave').filter(e => e.wishId === id).forEach(e => Store.remove('wishsave', e.id)); Store.remove('wish', id); UI.closeSheet(); UI.refresh(); },
    /* lend / borrow */
    openPerson(d) { UI.personId = d.id; UI.page = 'people'; UI.render(); window.scrollTo(0, 0); },
    toggleTheme() { Theme.toggle(); UI.render(); },
    setTheme(d) { Theme.set(d.m); UI.refresh(); },
    toastAction() { const fn = UI._toastFn; UI._toastFn = null; $('#toast').classList.remove('show'); if (fn) fn(); },
    streakInfo() { UI.streakSheet(); },
    openReport() { window.open('report.html?m=' + (UI.page === 'charts' ? UI.month : curMonth()), '_blank'); },
    dueIn(d, el) {
      const f = el.closest('form'); if (!f) return;
      const n = +d.d, dt = new Date(); dt.setDate(dt.getDate() + n);
      f.elements.due.value = n ? isoDate(dt) : '';
    },
    pickEmoji(d, el) {
      const f = el.closest('form'); if (!f) return;
      f.elements.emoji.value = d.e;
      $$('.emoji-btn', f).forEach(b => b.classList.toggle('on', b === el));
    },
    quickAdd(d) {
      const q = Store.get('quick', d.q), amt = +d.a; if (!q || !(amt > 0)) return;
      const accs = Calc.accounts(), acc = Store.d.lastAcc && accs.some(a => a.id === Store.d.lastAcc) ? Store.d.lastAcc : (accs[0] || {}).id;
      const id = uid();
      Store.put('tx', id, { type: 'expense', amount: amt, cat: q.cat, account: acc, date: todayISO(), note: q.name });
      UI.refresh();
      UI.toast(t('quickAdded').replace('{name}', nm(q)).replace('{amt}', money(amt)), t('undo'), () => { Store.remove('tx', id); UI.refresh(); });
    },
    quickOther(d) {
      const q = Store.get('quick', d.q); if (!q) return;
      UI.openTx(); UI.draft.cat = q.cat; UI.draft.note = q.name; UI.txSheet();
    },
    addQuick() { UI.quickSheet(); },
    editQuick(d) { UI.quickSheet(d.id); },
    delQuick() { if (confirm(t('confirmDelete'))) { Store.remove('quick', UI.sheetId); UI.closeSheet(); UI.refresh(); } },
    backPeople() { UI.personId = ''; UI.render(); window.scrollTo(0, 0); },
    addPerson() { UI.personSheet(); },
    editPerson(d) { UI.personSheet(d.id); },
    addLoan(d) { UI.loanSheet(d.kind, '', UI.personId); },
    editLoan(d) { const l = Store.get('loan', d.id); if (l) UI.loanSheet(l.kind, l.id, l.personId); },
    delLoan() { if (confirm(t('confirmDelete'))) { Store.remove('loan', UI.sheetId); UI.closeSheet(); UI.refresh(); UI.toast(t('deleted')); } },
    delPerson() {
      if (!confirm(t('confirmDeletePerson'))) return;
      const id = UI.sheetId;
      Store.list('loan').filter(l => l.personId === id).forEach(l => Store.remove('loan', l.id));
      Store.remove('person', id); UI.personId = ''; UI.closeSheet(); UI.refresh(); UI.toast(t('deleted'));
    },
    exportLoansCSV() { exportLoansCSV(); },
    /* accounts and categories */
    addAccount() { UI.accountSheet(); },
    editAccount(d) { UI.accountSheet(d.id); },
    delAccount() { const id = UI.sheetId; const used = Calc.txs().some(x => x.account === id || x.to === id) || Store.list('loan').some(l => l.account === id); if (used) { UI.toast(t('accountInUse')); return; } if (confirm(t('confirmDelete'))) { Store.remove('account', id); UI.closeSheet(); UI.refresh(); } },
    addCat() { UI.catSheet(); },
    editCat(d) { UI.catSheet(d.id); },
    delCat() { const id = UI.sheetId; if (confirm(t('confirmDelete'))) { Store.remove('category', id); UI.closeSheet(); UI.refresh(); } },
    pickColor(d) { UI.catDraft.color = d.c; UI.readCatForm(); UI.catSheetRender(); },
    pickIcon(d) { UI.catDraft.icon = d.i; UI.readCatForm(); UI.catSheetRender(); }
  },
  readForm() {
    const f = $('#sheet form[data-form="tx"]'); if (!f || !this.draft) return;
    ['amount', 'account', 'to', 'date', 'note'].forEach(n => { if (f.elements[n]) this.draft[n] = f.elements[n].value; });
  },
  wishSheet(id) {
    const w = id ? Store.get('wish', id) : { name: '', price: '', note: '' };
    this.sheetId = id || '';
    this.simpleSheet(id ? t('editWish') : t('addWish'), 'wish', '<input type="hidden" name="id" value="' + esc(id || '') + '"><label class="field"><span>' + t('wishName') + '</span><input name="name" type="text" maxlength="60" value="' + esc(w.name) + '" placeholder="' + t('wishNamePh') + '" autofocus></label><label class="field"><span>' + t('price') + ' (৳)</span><input name="price" type="text" inputmode="decimal" value="' + inputAmt(w.price) + '" placeholder="0"></label><label class="field"><span>' + t('note') + '</span><input name="note" type="text" maxlength="120" value="' + esc(w.note || '') + '"></label>' + emojiPicker(typeof w.emoji === 'string' ? w.emoji : '🎁'), t('save'), id ? '<button type="button" class="btn danger" data-act="delWish">' + ic('trash', 18) + ' ' + t('delete') + '</button>' : '');
  },
  quickSheet(id) {
    const q = id ? Store.get('quick', id) : { name: '', emoji: '💸', cat: (Calc.categories('expense')[0] || {}).id, amounts: [] };
    this.sheetId = id || '';
    const cats = Calc.categories('expense');
    this.simpleSheet(id ? t('editQuick') : t('addQuick'), 'quick',
      '<input type="hidden" name="id" value="' + esc(id || '') + '"><label class="field"><span>' + t('quickName') + '</span><input name="name" type="text" maxlength="30" value="' + esc(nm(q)) + '" autofocus></label>' +
      '<label class="field"><span>' + t('quickAmounts') + '</span><input name="amounts" type="text" inputmode="decimal" value="' + esc(q.amounts.map(a => localDigits(a)).join(', ')) + '" placeholder="' + t('quickAmountsPh') + '"></label>' +
      '<label class="field"><span>' + t('category') + '</span><select name="cat">' + cats.map(c => '<option value="' + esc(c.id) + '"' + (q.cat === c.id ? ' selected' : '') + '>' + esc((emojiOf(c) ? emojiOf(c) + ' ' : '') + nm(c)) + '</option>').join('') + '</select></label>' +
      emojiPicker(q.emoji || ''), t('save'), id ? '<button type="button" class="btn danger" data-act="delQuick">' + ic('trash', 18) + ' ' + t('delete') + '</button>' : '');
  },
  accountSheet(id) {
    const a = id ? Store.get('account', id) : { name: '', opening: '', icon: 'wallet' };
    this.sheetId = id || '';
    this.simpleSheet(id ? t('editAccount') : t('addAccount'), 'account', '<input type="hidden" name="id" value="' + esc(id || '') + '"><label class="field"><span>' + t('accountName') + '</span><input name="name" type="text" maxlength="30" value="' + esc(nm(a)) + '" autofocus></label><label class="field"><span>' + t('openingBalance') + ' (৳)</span><input name="opening" type="text" inputmode="decimal" value="' + inputAmt(a.opening) + '" placeholder="0"></label><div class="field"><span>' + t('icon') + '</span><div class="chips pick"><label class="chip"><input type="radio" name="icon" value="cash"' + (a.icon === 'cash' ? ' checked' : '') + '> ' + ic('cash', 16) + '</label><label class="chip"><input type="radio" name="icon" value="phone"' + (a.icon === 'phone' ? ' checked' : '') + '> ' + ic('phone', 16) + '</label><label class="chip"><input type="radio" name="icon" value="bank"' + (a.icon === 'bank' ? ' checked' : '') + '> ' + ic('bank', 16) + '</label><label class="chip"><input type="radio" name="icon" value="wallet"' + ((!a.icon || a.icon === 'wallet') ? ' checked' : '') + '> ' + ic('wallet', 16) + '</label></div></div>' + emojiPicker(emojiOf(a)), t('save'), id ? '<button type="button" class="btn danger" data-act="delAccount">' + ic('trash', 18) + ' ' + t('delete') + '</button>' : '');
  },
  catSheet(id) {
    const c = id ? Store.get('category', id) : { name: '', type: 'expense', color: PALETTE[0], icon: 'tag' };
    this.sheetId = id || '';
    this.catDraft = Object.assign({}, c);
    this.catSheetRender();
  },
  catSheetRender() {
    const c = this.catDraft, id = this.sheetId;
    this.simpleSheet(id ? t('editCategory') : t('addCategory'), 'cat',
      '<input type="hidden" name="id" value="' + esc(id) + '"><label class="field"><span>' + t('categoryName') + '</span><input name="name" type="text" maxlength="30" value="' + esc(nm(c)) + '" autofocus></label>' +
      (id ? '' : '<div class="field"><span>' + t('type') + '</span><div class="seg"><label class="' + (c.type === 'expense' ? 'on' : '') + '"><input type="radio" name="type" value="expense"' + (c.type === 'expense' ? ' checked' : '') + '> ' + t('expenses') + '</label><label class="' + (c.type === 'income' ? 'on' : '') + '"><input type="radio" name="type" value="income"' + (c.type === 'income' ? ' checked' : '') + '> ' + t('deposits') + '</label></div></div>') +
      emojiPicker(emojiOf(c)) +
      '<div class="field"><span>' + t('color') + '</span><div class="swatches">' + PALETTE.map(col => '<button type="button" class="swatch' + (c.color === col ? ' on' : '') + '" style="background:' + col + '" data-act="pickColor" data-c="' + col + '" aria-label="' + col + '"></button>').join('') + '</div></div>' +
      '<div class="field"><span>' + t('icon') + '</span><div class="chips pick">' + CAT_ICONS.map(i => '<button type="button" class="chip icononly' + (c.icon === i ? ' on' : '') + '" data-act="pickIcon" data-i="' + i + '">' + ic(i, 18) + '</button>').join('') + '</div></div>',
      t('save'), id ? '<button type="button" class="btn danger" data-act="delCat">' + ic('trash', 18) + ' ' + t('delete') + '</button>' : '');
  },
  readCatForm() {
    const f = $('#sheet form[data-form="cat"]'); if (!f) return;
    this.catDraft.name = f.elements.name.value; this.catDraft.nameBn = '';
    if (f.elements.emoji) this.catDraft.emoji = f.elements.emoji.value.trim();
    const ty = f.querySelector('input[name="type"]:checked'); if (ty) this.catDraft.type = ty.value;
  },

  /* ------------------------------------------------------------ form submits */
  forms: {
    async setup(f) {
      const pin = f.pin.value.trim(), p2 = f.pin2.value.trim(), err = $('#autherr');
      if (!/^\d{4,12}$/.test(pin)) { err.textContent = t('pinRule'); return; }
      if (pin !== p2) { err.textContent = t('pinMismatch'); return; }
      if (STANDALONE) { Store.d.salt = uid() + uid(); Store.d.pinHash = sha256(Store.d.salt + pin); Store.save(); UI.enter(); return; }
      try { const r = await Sync.api('/api/setup', { pin, device: UI.deviceLabel() }); UI.afterAuth(r, pin); }
      catch (e) { err.textContent = e.message; }
    },
    async login(f) {
      const pin = f.pin.value.trim(), err = $('#autherr');
      try { const r = await Sync.api('/api/login', { pin, device: UI.deviceLabel() }); UI.afterAuth(r, pin); }
      catch (e) { err.textContent = e.status ? e.message : t('needPc'); f.pin.value = ''; }
    },
    unlock(f) {
      const pin = f.pin.value.trim(), err = $('#autherr');
      if (sha256((Store.d.salt || '') + pin) === Store.d.pinHash) { UI.enter(); }
      else { err.textContent = t('wrongPin'); f.pin.value = ''; f.classList.remove('shake'); void f.offsetWidth; f.classList.add('shake'); }
    },
    pin(f) {
      const err = $('#formerr');
      if (STANDALONE) {
        if (sha256((Store.d.salt || '') + f.old.value.trim()) !== Store.d.pinHash) { err.textContent = t('wrongPin'); return; }
        const np = f.new.value.trim(); if (!/^\d{4,12}$/.test(np)) { err.textContent = t('pinRule'); return; }
        Store.d.salt = uid() + uid(); Store.d.pinHash = sha256(Store.d.salt + np); Store.save(); UI.closeSheet(); UI.toast(t('pinChanged')); return;
      }
      Sync.api('/api/pin', { old: f.old.value.trim(), new: f.new.value.trim(), device: UI.deviceLabel() })
        .then(r => { Store.d.token = r.token; Store.d.salt = r.salt; Store.d.pinHash = sha256(r.salt + f.new.value.trim()); Store.save(); UI.closeSheet(); UI.toast(t('pinChanged')); })
        .catch(e => { err.textContent = e.status ? e.message : t('needPc'); });
    },
    tx(f) {
      UI.readForm();
      const d = UI.draft, err = $('#formerr'), amount = parseAmt(d.amount);
      if (!(amount > 0)) { err.textContent = t('enterAmount'); return; }
      if (d.type === 'transfer' && d.account === d.to) { err.textContent = t('sameAccount'); return; }
      if (!d.date) { err.textContent = t('pickDate'); return; }
      const old = d._id ? Store.get('tx', d._id) : null;
      const rec = { type: d.type, amount, account: d.account, date: d.date, note: (d.note || '').trim() };
      if (d.type === 'transfer') rec.to = d.to; else rec.cat = d.cat;
      if (old && old.wishId) rec.wishId = old.wishId;
      Store.put('tx', d._id || uid(), rec);
      Store.d.lastAcc = d.account; Store.save();
      UI.closeSheet(); UI.refresh(); UI.toast(t('saved_ok'));
    },
    wish(f) {
      const name = f.elements.name.value.trim(), price = parseAmt(f.price.value), err = $('#formerr');
      if (!name) { err.textContent = t('enterName'); return; }
      if (!(price > 0)) { err.textContent = t('enterAmount'); return; }
      const id = f.elements.id.value, old = id ? Store.get('wish', id) : null;
      Store.put('wish', id || uid(), Object.assign({ status: 'saving', created: todayISO() }, old || {}, { name, price, note: f.note.value.trim(), emoji: f.elements.emoji.value.trim() }));
      UI.closeSheet(); UI.refresh();
    },
    addsave(f) {
      const amount = parseAmt(f.amount.value), err = $('#formerr');
      if (!(amount > 0)) { err.textContent = t('enterAmount'); return; }
      Store.put('wishsave', uid(), { wishId: f.elements.id.value, type: 'add', amount, date: f.date.value || todayISO(), note: f.note.value.trim() });
      UI.closeSheet(); UI.refresh(); UI.toast(t('saved_ok'));
    },
    usesave(f) {
      const amount = parseAmt(f.amount.value), err = $('#formerr'), wid = f.elements.id.value;
      const w = Store.get('wish', wid), sv = Math.max(0, Calc.wishSavedMap()[wid] || 0);
      if (!(amount > 0)) { err.textContent = t('enterAmount'); return; }
      if (amount > sv + 0.0001) { err.textContent = t('moreThanSaved'); return; }
      const date = f.date.value || todayISO(), txId = uid();
      Store.put('tx', txId, { type: 'expense', amount, cat: 'cat_wish', account: f.account.value, date, note: w.name, wishId: wid });
      Store.put('wishsave', uid(), { wishId: wid, type: 'use', amount, date, txId, note: '' });
      if (f.bought.checked) Store.put('wish', wid, Object.assign(w, { status: 'bought', boughtOn: date }));
      Store.d.lastAcc = f.account.value; Store.save();
      UI.closeSheet(); UI.refresh(); UI.toast(t('saved_ok'));
    },
    person(f) {
      const name = f.elements.name.value.trim(), err = $('#formerr');
      if (!name) { err.textContent = t('enterName'); return; }
      const id = f.elements.id.value;
      if (Calc.people().some(x => x.id !== id && x.name.trim().toLowerCase() === name.toLowerCase())) { err.textContent = t('personExists'); return; }
      const old = id ? Store.get('person', id) : null, pid = id || uid();
      Store.put('person', pid, Object.assign({}, old || {}, { name, phone: f.elements.phone.value.trim(), note: f.elements.note.value.trim(), code: old ? old.code : Calc.nextPersonCode() }));
      if (!id) UI.personId = pid;
      UI.closeSheet(); UI.refresh();
    },
    loan(f) {
      const el = f.elements, err = $('#formerr'), amount = parseAmt(el.amount.value);
      if (!(amount > 0)) { err.textContent = t('enterAmount'); return; }
      if (!el.date.value) { err.textContent = t('pickDate'); return; }
      const id = el.id.value, old = id ? Store.get('loan', id) : null;
      const rec = { personId: el.personId.value, kind: el.kind.value, amount, account: el.account.value, date: el.date.value, note: el.note.value.trim(), ts: old && old.ts ? old.ts : Date.now() };
      if (el.due && el.due.value) rec.due = el.due.value;
      Store.put('loan', id || uid(), rec);
      Store.d.lastAcc = el.account.value; Store.save();
      UI.closeSheet(); UI.refresh(); UI.toast(t('saved_ok'));
    },
    quick(f) {
      const el = f.elements, name = el.name.value.trim(), err = $('#formerr');
      if (!name) { err.textContent = t('enterName'); return; }
      const amounts = Array.from(new Set(el.amounts.value.split(/[,\u060c\s\/]+/).map(parseAmt).filter(a => a > 0))).slice(0, 6);
      if (!amounts.length) { err.textContent = t('quickNeedAmounts'); return; }
      const id = el.id.value, old = id ? Store.get('quick', id) : null;
      const rec = Object.assign({ order: Calc.quicks().length }, old || {}, { name: (old && nm(old) === name) ? old.name : name, amounts, cat: el.cat.value, emoji: el.emoji.value.trim() || '💸' });
      if (old && nm(old) !== name) rec.nameBn = '';
      Store.put('quick', id || uid(), rec);
      UI.closeSheet(); UI.refresh();
    },
    account(f) {
      const name = f.elements.name.value.trim(), err = $('#formerr');
      if (!name) { err.textContent = t('enterName'); return; }
      const id = f.elements.id.value, old = id ? Store.get('account', id) : null;
      const icon = (f.querySelector('input[name="icon"]:checked') || {}).value || 'wallet';
      const rec = Object.assign({ order: Calc.accounts().length }, old || {}, { name: (old && nm(old) === name) ? old.name : name, opening: parseAmt(f.opening.value), icon, emoji: f.elements.emoji.value.trim() });
      if (old && nm(old) !== name) rec.nameBn = '';
      Store.put('account', id || uid(), rec);
      UI.closeSheet(); UI.refresh();
    },
    cat(f) {
      UI.readCatForm();
      const c = UI.catDraft, err = $('#formerr');
      if (!c.name.trim()) { err.textContent = t('enterName'); return; }
      const id = f.elements.id.value, old = id ? Store.get('category', id) : null;
      const rec = Object.assign({ order: Calc.categories().length }, old || {}, { name: (old && nm(old) === c.name.trim()) ? old.name : c.name.trim(), color: c.color, icon: c.icon, emoji: (c.emoji || '').trim(), type: old ? old.type : c.type });
      if (old && nm(old) !== c.name.trim()) rec.nameBn = '';
      Store.put('category', id || uid(), rec);
      UI.closeSheet(); UI.refresh();
    }
  },
  afterAuth(r, pin) {
    Store.d.token = r.token; Store.d.salt = r.salt; Store.d.pinHash = sha256(r.salt + pin); Store.save();
    this.enter();
  },
  saveSetting(key, val) {
    const s = Calc.settings();
    s[key] = parseAmt(val);
    Store.put('settings', 'main', s);
    this.toast(t('saved_ok'));
    this.refresh();
  },

  /* ------------------------------------------------------------ global events */
  bindGlobal() {
    document.addEventListener('click', e => {
      const el = e.target.closest('[data-act]');
      if (!el || el.disabled) return;
      const fn = UI.acts[el.dataset.act];
      if (fn) { e.preventDefault(); fn(el.dataset, el, e); }
    });
    document.addEventListener('submit', e => {
      const f = e.target.closest('form[data-form]');
      if (!f) return;
      e.preventDefault();
      const fn = UI.forms[f.dataset.form];
      if (fn) fn(f);
    });
    document.addEventListener('input', e => {
      const q = e.target.closest('[data-q]');
      if (q) { UI.q = q.value; const l = $('#txlist'); if (l) l.innerHTML = UI.txListHTML(); }
    });
    document.addEventListener('change', e => {
      const tx = e.target.closest('[data-sett]');
      if (tx) { const s = Calc.settings(); s[tx.dataset.sett] = tx.value.trim(); Store.put('settings', 'main', s); UI.toast(t('saved_ok')); }
      const gl = e.target.closest('[data-sett-local]');
      if (gl) { try { localStorage.setItem('mn_' + gl.dataset.settLocal, gl.value.trim()); } catch (er) { /* ignore */ } UI.refresh(); }
      const el = e.target.closest('[data-set]');
      if (el) UI.saveSetting(el.dataset.set, el.value);
      const cf = e.target.closest('form[data-form="cat"] input[name="type"]');
      if (cf) { UI.readCatForm(); UI.catSheetRender(); }
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#sheet').innerHTML) UI.closeSheet(); });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { UI.hiddenAt = Date.now(); return; }
      if (UI.unlocked && UI.hiddenAt && Date.now() - UI.hiddenAt > 5 * 60000) UI.showLock(true);
      else if (UI.unlocked) Sync.run();
    });
    window.addEventListener('online', () => { if (UI.unlocked) Sync.run(); });
    window.addEventListener('offline', () => Sync.setStatus('offline'));
    let rz; window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { if (UI.unlocked && ['home', 'charts'].includes(UI.page) && !$('#sheet').innerHTML) UI.refresh(); }, 250); });
  }
};

window.addEventListener('DOMContentLoaded', () => {
  UI.boot();
  // version 1 installed a phone/offline cache; this version does not need it
  try {
    if (STANDALONE) {
      // the phone/web copy keeps itself available offline
      if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw-app.js').catch(() => { });
    } else {
      if ('serviceWorker' in navigator) navigator.serviceWorker.getRegistrations().then(rs => rs.forEach(r => r.unregister())).catch(() => { });
      if (window.caches) caches.keys().then(ks => ks.forEach(k => { if (k.startsWith('moneynest-')) caches.delete(k); })).catch(() => { });
    }
  } catch (e) { /* ignore */ }
});
