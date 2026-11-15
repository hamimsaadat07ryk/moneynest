'use strict';
/* Monthly report: reads the same data as the app (this browser's copy) and lays it out for A4 / PDF */
const t = k => ((T[Store.d.lang] && T[Store.d.lang][k]) || T.en[k] || k);
const nm = o => (o ? (Store.d.lang === 'bn' && o.nameBn ? o.nameBn : o.name) : '');
const Rep = {
  month: curMonth(),
  init() {
    Store.load();
    document.documentElement.setAttribute('data-theme', 'light'); // reports are always light
    const m = new URLSearchParams(location.search).get('m');
    if (m && /^\d{4}-\d{2}$/.test(m)) this.month = m;
    document.documentElement.lang = Store.d.lang === 'bn' ? 'bn' : 'en';
    document.addEventListener('click', e => {
      const el = e.target.closest('[data-r]'); if (!el) return;
      const a = el.dataset.r;
      if (a === 'prev') this.month = shiftMonth(this.month, -1);
      else if (a === 'next' && this.month < curMonth()) this.month = shiftMonth(this.month, 1);
      else if (a === 'print') return window.print();
      else if (a === 'lang') { Store.d.lang = el.dataset.l; Store.save(); document.documentElement.lang = el.dataset.l === 'bn' ? 'bn' : 'en'; }
      else if (a === 'back') { location.href = './'; return; }
      this.render();
    });
    this.render();
    if (new URLSearchParams(location.search).get('print') === '1') setTimeout(() => window.print(), 600);
  },
  render() {
    const ym = this.month;
    history.replaceState(null, '', '?m=' + ym);
    document.title = 'MoneyNest ' + ym;
    const txs = Calc.txs(), s = Calc.settings();
    const { cats, accs } = { cats: Object.fromEntries(Store.list('category').map(c => [c.id, c])), accs: Object.fromEntries(Store.list('account').map(a => [a.id, a])) };
    const endISO = ym + '-' + pad(daysInMonth(ym));
    const ms = Calc.monthStats(txs, ym), prev = Calc.monthStats(txs, shiftMonth(ym, -1));
    const limit = +s.dailyLimit || 0, budget = +s.monthlyBudget || 0, today = todayISO();
    const n = daysInMonth(ym);
    const days = [];
    for (let d = 1; d <= n; d++) { const date = ym + '-' + pad(d); days.push({ date, day: d, spent: Calc.spentOn(txs, date), future: date > today }); }
    const past = days.filter(d => !d.future);
    const total = past.reduce((a, d) => a + d.spent, 0);
    const under = limit > 0 ? past.filter(d => d.spent <= limit).length : 0;
    const peak = past.reduce((m, d) => (d.spent > (m ? m.spent : -1) ? d : m), null);
    const monthTx = txs.filter(x => monthOf(x.date) === ym).sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));

    // balances at month end (entries up to that date, loans too)
    const bal = {}; Calc.accounts().forEach(a => { bal[a.id] = +a.opening || 0; });
    txs.filter(x => x.date <= endISO).forEach(x => {
      if (!(x.account in bal)) return;
      if (x.type === 'income') bal[x.account] += +x.amount; else if (x.type === 'expense') bal[x.account] -= +x.amount;
      else if (x.type === 'transfer') { bal[x.account] -= +x.amount; if (x.to in bal) bal[x.to] += +x.amount; }
    });
    const loansAll = Calc.loans().filter(l => l.date <= endISO);
    loansAll.forEach(l => { if (l.account in bal) bal[l.account] += (l.kind === 'borrow' || l.kind === 'back') ? +l.amount : -l.amount; });
    const totalBal = Object.values(bal).reduce((a, b) => a + b, 0);

    // categories
    const byCat = {};
    monthTx.filter(x => x.type === 'expense').forEach(x => { byCat[x.cat] = (byCat[x.cat] || 0) + +x.amount; });
    const items = Object.keys(byCat).map(id => ({ name: cats[id] ? ((emojiOf(cats[id]) ? emojiOf(cats[id]) + ' ' : '') + nm(cats[id])) : t('cat_deleted'), color: cats[id] ? cats[id].color : '#94a3b8', value: byCat[id] })).sort((a, b) => b.value - a.value);
    const sum = items.reduce((a, i) => a + i.value, 0);
    const big = monthTx.filter(x => x.type === 'expense').sort((a, b) => b.amount - a.amount).slice(0, 8);

    // loans position
    const people = Calc.people().map(p => ({ p, st: Calc.personStats(p.id, loansAll) })).filter(x => Math.abs(x.st.net) > 0.004).sort((a, b) => Math.abs(b.st.net) - Math.abs(a.st.net));
    const toGet = people.filter(x => x.st.net > 0).reduce((a, x) => a + x.st.net, 0), toPay = people.filter(x => x.st.net < 0).reduce((a, x) => a - x.st.net, 0);

    const change = prev.expenseAll > 0 ? Math.round((ms.expenseAll - prev.expenseAll) / prev.expenseAll * 100) : null;
    Charts.fixed = 680;
    const next = ym < curMonth();
    const cls = v => (v < 0 ? 'neg' : 'pos');
    const kpi = (c, l, v) => '<div class="kpi ' + c + '"><small>' + l + '</small><b>' + v + '</b></div>';
    let h = '<div class="rep-bar noprint"><a class="btn sm" data-r="back" href="./">' + t('rep_back') + '</a>' +
      '<div class="monthnav"><button data-r="prev" aria-label="prev">‹</button><span>' + esc(fmtMonth(ym)) + '</span><button data-r="next" ' + (next ? '' : 'disabled') + ' aria-label="next">›</button></div>' +
      '<div class="seg"><button class="' + (Store.d.lang === 'en' ? 'on' : '') + '" data-r="lang" data-l="en">English</button><button class="' + (Store.d.lang === 'bn' ? 'on' : '') + '" data-r="lang" data-l="bn">বাংলা</button></div>' +
      '<button class="btn primary sm" data-r="print">' + t('rep_print') + '</button><div class="rep-tip">' + t('rep_pdfhint') + ' ' + t('rep_tip') + '</div></div>';
    h += '<div class="page-sheet"><div class="rep-head"><div class="brand-l"><img src="icons/logo.svg" alt=""><div><h1>MoneyNest</h1><small>' + t('monthlyReport') + (s.name ? ' · ' + esc(s.name) : '') + '</small></div></div><div class="month"><small>' + t('rep_for') + '</small><b>' + esc(fmtMonth(ym)) + '</b></div></div>';
    if (!monthTx.length && !loansAll.length) {
      h += '<div class="rep-empty">' + t('rep_nodata') + '</div>';
    } else {
      h += '<div class="rep-grid4">' + kpi('pos', t('deposits'), money(ms.income)) + kpi('neg', t('expenses'), money(ms.expenseAll)) + kpi(ms.saved < 0 ? 'neg' : 'save', t('rep_net'), money(ms.saved)) + kpi('', t('rep_balance'), money(totalBal)) + '</div>';
      h += '<div class="rep-sec"><h2>' + t('rep_overview') + '</h2><div class="rep-facts">' +
        '<div><span>' + t('rep_avgday') + '</span><b>' + money(past.length ? total / past.length : 0) + '</b></div>' +
        '<div><span>' + t('rep_peak') + '</span><b>' + (peak && peak.spent > 0 ? money(peak.spent) + ' · ' + esc(fmtDate(peak.date)) : '—') + '</b></div>' +
        (limit > 0 ? '<div><span>' + t('rep_limitdays') + '</span><b>' + localDigits(under) + ' / ' + localDigits(past.length) + '</b></div>' : '') +
        '<div><span>' + t('rep_prev') + ' (' + t('expenses') + ')</span><b>' + money(prev.expenseAll) + (change !== null ? ' · <span class="' + (change > 0 ? 'neg' : 'pos') + '">' + (change > 0 ? '+' : '') + localDigits(change) + '%</span>' : '') + '</b></div>' +
        '<div><span>' + t('transactions') + '</span><b>' + localDigits(monthTx.length) + ' ' + t('rep_entries') + '</b></div></div>';
      if (budget > 0) {
        const pct = ms.expense / budget, col = pct > 1 ? '#e5484d' : pct >= .8 ? '#f59e0b' : '#0f9d8a';
        h += '<div style="margin-top:10px"><div class="kv"><span>' + t('rep_budget') + ' · ' + money(ms.expense) + ' / ' + money(budget) + '</span><b class="' + (pct > 1 ? 'neg' : '') + '">' + localDigits(Math.round(pct * 100)) + '%</b></div><div class="rep-bar-track"><i style="width:' + Math.min(100, pct * 100).toFixed(1) + '%;background:' + col + '"></i></div></div>';
      }
      h += '</div>';
      h += '<div class="rep-sec"><h2>' + t('rep_daily') + '</h2>' + Charts.dailyBars(days, limit, t('rep_daily')) + (limit > 0 ? '<div class="legend"><span><i class="sw" style="background:#0f9d8a"></i>' + t('spent') + '</span><span><i class="sw" style="background:#e5484d"></i>' + t('overLimit') + '</span><span><i class="sw dash"></i>' + t('dailyLimit') + ' ' + money(limit) + '</span></div>' : '') + '</div>';
      h += '<div class="rep-sec"><h2>' + t('rep_topcat') + '</h2>' + (items.length ?
        '<div class="rep-two"><div class="rep-donut">' + Charts.donut(items, t('expenses'), t('rep_topcat')) + '</div><table class="rep-t"><thead><tr><th>' + t('category') + '</th><th class="r">' + t('expenses') + '</th><th class="r">%</th></tr></thead><tbody>' +
        items.map(i => '<tr><td><i class="sw" style="background:' + i.color + '"></i>' + esc(i.name) + '</td><td class="r">' + money(i.value) + '</td><td class="r">' + localDigits(Math.round(i.value / sum * 100)) + '%</td></tr>').join('') + '</tbody></table></div>' : '<p class="muted">' + t('noExpenseMonth') + '</p>') + '</div>';
      h += '<div class="rep-two"><div class="rep-sec"><h2>' + t('rep_accounts') + '</h2><table class="rep-t"><tbody>' + Calc.accounts().map(a => '<tr><td>' + esc((emojiOf(a) ? emojiOf(a) + ' ' : '') + nm(a)) + '</td><td class="r">' + money(bal[a.id] || 0) + '</td></tr>').join('') + '</tbody></table></div>' +
        '<div class="rep-sec"><h2>' + t('rep_loans') + '</h2><div class="kv"><span>' + t('youWillGet') + '</span><b class="pos">' + money(toGet) + '</b></div><div class="kv"><span>' + t('youOwe') + '</span><b class="neg">' + money(toPay) + '</b></div>' +
        (people.length ? '<table class="rep-t"><tbody>' + people.slice(0, 6).map(x => '<tr><td>' + esc(x.p.code + ' · ' + x.p.name) + '</td><td class="r ' + (x.st.net > 0 ? 'pos' : 'neg') + '">' + (x.st.net > 0 ? t('owesYou') : t('youOweThem')) + ' ' + money(Math.abs(x.st.net)) + '</td></tr>').join('') + '</tbody></table>' : '') + '</div></div>';
      if (big.length) h += '<div class="rep-sec"><h2>' + t('rep_biggest') + '</h2><table class="rep-t"><tbody>' + big.map(x => '<tr><td>' + esc(fmtDate(x.date)) + '</td><td>' + esc(cats[x.cat] ? ((emojiOf(cats[x.cat]) ? emojiOf(cats[x.cat]) + ' ' : '') + nm(cats[x.cat])) : t('cat_deleted')) + '</td><td>' + esc(x.note || '') + '</td><td class="r neg">' + money(x.amount) + '</td></tr>').join('') + '</tbody></table></div>';
      h += '<div class="rep-sec" style="break-inside:auto"><h2>' + t('transactions') + '</h2><table class="rep-t"><thead><tr><th>' + t('date') + '</th><th>' + t('category') + '</th><th>' + t('note') + '</th><th>' + t('account') + '</th><th class="r">' + (Store.d.lang === 'bn' ? 'পরিমাণ' : 'Amount') + '</th></tr></thead><tbody>' +
        monthTx.map(x => {
          const isT = x.type === 'transfer';
          const c = isT ? nm(accs[x.account]) + ' → ' + nm(accs[x.to]) : (cats[x.cat] ? ((emojiOf(cats[x.cat]) ? emojiOf(cats[x.cat]) + ' ' : '') + nm(cats[x.cat])) : t('cat_deleted'));
          return '<tr><td>' + esc(fmtDate(x.date)) + '</td><td>' + esc(c) + '</td><td>' + esc(x.note || '') + '</td><td>' + esc(isT ? '' : nm(accs[x.account])) + '</td><td class="r ' + (x.type === 'income' ? 'pos' : x.type === 'expense' ? 'neg' : '') + '">' + (x.type === 'income' ? '+' : x.type === 'expense' ? '−' : '') + money(x.amount) + '</td></tr>';
        }).join('') + '</tbody></table></div>';
    }
    h += '<div class="rep-foot"><span>MoneyNest</span><span>' + t('rep_generated') + ' ' + esc(fmtDate(todayISO(), { day: 'numeric', month: 'long', year: 'numeric' })) + '</span></div></div>';
    $('#rep').innerHTML = h;
  }
};
window.addEventListener('DOMContentLoaded', () => Rep.init());
