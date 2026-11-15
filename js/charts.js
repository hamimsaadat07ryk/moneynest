'use strict';
/* =====================================================================
   Tiny SVG chart helpers (no external libraries, work fully offline)
   ===================================================================== */
const COLORS = {
  brand: 'var(--brand)', income: 'var(--pos)', expense: 'var(--neg)', save: 'var(--save)',
  warn: 'var(--warn)', grid: 'var(--grid)', text: 'var(--muted)', ink: 'var(--ink)', zero: 'var(--zero)', card: 'var(--card)'
};

const Charts = {
  fixed: 0, // the PDF report sets a fixed width
  width() {
    if (this.fixed) return this.fixed;
    const main = document.querySelector('.main');
    const w = (main ? main.clientWidth : window.innerWidth) - 64;
    return Math.max(300, Math.min(760, w));
  },
  niceMax(v) {
    if (v <= 0) return 100;
    const p = Math.pow(10, Math.floor(Math.log10(v)));
    const n = v / p;
    const m = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
    return m * p;
  },
  empty(msg) { return '<div class="chart-empty">' + esc(msg) + '</div>'; },

  /* axis + grid shared by bar/line charts */
  frame(W, H, pl, pr, pt, pb, max, ticks) {
    let s = '';
    for (let i = 0; i <= ticks; i++) {
      const v = (max / ticks) * i;
      const y = H - pb - (H - pt - pb) * (v / max);
      s += '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + y + '" y2="' + y + '" stroke="' + COLORS.grid + '" stroke-width="1"/>';
      s += '<text x="' + (pl - 6) + '" y="' + (y + 3.5) + '" text-anchor="end" font-size="10.5" fill="' + COLORS.text + '">' + shortNum(v) + '</text>';
    }
    return s;
  },

  /* daily spending bars with a dashed daily-limit line */
  dailyBars(days, limit, ariaLabel) {
    const W = this.width(), H = 220, pl = 40, pr = 8, pt = 14, pb = 26;
    const peak = Math.max(0, ...days.map(d => d.spent));
    const max = this.niceMax(Math.max(peak, limit * 1.15));
    const n = days.length, slot = (W - pl - pr) / n, bw = Math.max(3, Math.min(26, slot * 0.64));
    const y = v => H - pb - (H - pt - pb) * (v / max);
    let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" role="img" aria-label="' + esc(ariaLabel) + '">';
    s += this.frame(W, H, pl, pr, pt, pb, max, 4);
    const every = n > 20 ? 5 : n > 12 ? 2 : 1;
    days.forEach((d, i) => {
      const x = pl + slot * i + (slot - bw) / 2;
      const h = Math.max(d.spent > 0 ? 2 : 0, H - pb - y(d.spent));
      const over = limit > 0 && d.spent > limit;
      s += '<rect class="bx" style="animation-delay:' + Math.min(0.6, i * 0.018).toFixed(2) + 's" x="' + x.toFixed(1) + '" y="' + (H - pb - h).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + h.toFixed(1) + '" rx="3" fill="' + (over ? COLORS.expense : COLORS.brand) + '"' + (d.future ? ' opacity=".25"' : '') + '><title>' + esc(fmtDate(d.date) + ': ' + money(d.spent)) + '</title></rect>';
      if ((i + 1) % every === 0 || i === 0) s += '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="10.5" fill="' + COLORS.text + '">' + localDigits(d.day) + '</text>';
    });
    if (limit > 0) {
      s += '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + y(limit) + '" y2="' + y(limit) + '" stroke="' + COLORS.warn + '" stroke-width="1.6" stroke-dasharray="5 4" class="fadein-el"/>';
    }
    return s + '</svg>';
  },

  /* income vs expense per month */
  groupedBars(months, ariaLabel) {
    const W = this.width(), H = 220, pl = 40, pr = 8, pt = 14, pb = 26;
    const max = this.niceMax(Math.max(0, ...months.map(m => Math.max(m.income, m.expense))) * 1.1);
    const n = months.length, slot = (W - pl - pr) / n, bw = Math.max(8, Math.min(30, slot * 0.30));
    const y = v => H - pb - (H - pt - pb) * (v / max);
    let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" role="img" aria-label="' + esc(ariaLabel) + '">';
    s += this.frame(W, H, pl, pr, pt, pb, max, 4);
    months.forEach((m, i) => {
      const cx = pl + slot * i + slot / 2;
      [['income', COLORS.income, -bw - 1], ['expense', COLORS.expense, 1]].forEach(([k, col, dx]) => {
        const h = Math.max(m[k] > 0 ? 2 : 0, H - pb - y(m[k]));
        s += '<rect class="bx" style="animation-delay:' + (i * 0.08 + (k === 'expense' ? 0.05 : 0)).toFixed(2) + 's" x="' + (cx + dx).toFixed(1) + '" y="' + (H - pb - h).toFixed(1) + '" width="' + bw + '" height="' + h.toFixed(1) + '" rx="3" fill="' + col + '"><title>' + esc(fmtMonth(m.ym) + ' – ' + money(m[k])) + '</title></rect>';
      });
      s += '<text x="' + cx.toFixed(1) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="10.5" fill="' + COLORS.text + '">' + esc(fmtMonthShort(m.ym)) + '</text>';
    });
    return s + '</svg>';
  },

  /* donut for categories */
  donut(items, centerLabel, ariaLabel) {
    const total = items.reduce((s, i) => s + i.value, 0);
    const size = 190, r = 70, sw = 28, c = 2 * Math.PI * r, cx = size / 2;
    let s = '<svg viewBox="0 0 ' + size + ' ' + size + '" width="190" height="190" role="img" aria-label="' + esc(ariaLabel) + '">';
    s += '<circle cx="' + cx + '" cy="' + cx + '" r="' + r + '" fill="none" stroke="' + COLORS.grid + '" stroke-width="' + sw + '"/>';
    let offset = 0;
    s += '<g class="donut-seg">';
    items.forEach(it => {
      const len = (it.value / total) * c;
      s += '<circle cx="' + cx + '" cy="' + cx + '" r="' + r + '" fill="none" stroke="' + it.color + '" stroke-width="' + sw + '" stroke-dasharray="' + Math.max(0, len - 1.5).toFixed(2) + ' ' + (c - Math.max(0, len - 1.5)).toFixed(2) + '" stroke-dashoffset="' + (-offset).toFixed(2) + '" transform="rotate(-90 ' + cx + ' ' + cx + ')"><title>' + esc(it.name + ': ' + money(it.value)) + '</title></circle>';
      offset += len;
    });
    s += '</g>';
    s += '<text x="' + cx + '" y="' + (cx - 4) + '" text-anchor="middle" font-size="11" fill="' + COLORS.text + '">' + esc(centerLabel) + '</text>';
    s += '<text x="' + cx + '" y="' + (cx + 15) + '" text-anchor="middle" font-size="17" font-weight="700" fill="' + COLORS.ink + '">' + esc(money(total)) + '</text>';
    return s + '</svg>';
  },

  /* line with soft area (cumulative savings) */
  line(points, ariaLabel, color) {
    const W = this.width(), H = 220, pl = 44, pr = 12, pt = 14, pb = 26;
    const vals = points.map(p => p.y);
    let lo = Math.min(0, ...vals), hi = Math.max(0, ...vals);
    if (hi === lo) hi = lo + 100;
    const step = this.niceMax(hi - lo) / 4;
    lo = Math.floor(lo / step) * step;
    hi = Math.ceil(hi / step) * step;
    if (hi <= lo) hi = lo + step;
    const y = v => H - pb - (H - pt - pb) * ((v - lo) / (hi - lo));
    const n = points.length;
    const x = i => pl + (n === 1 ? (W - pl - pr) / 2 : (W - pl - pr) * (i / (n - 1)));
    let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" role="img" aria-label="' + esc(ariaLabel) + '">';
    for (let v = lo; v <= hi + 0.001; v += step) {
      s += '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke="' + (Math.abs(v) < 0.001 ? COLORS.zero : COLORS.grid) + '"/>';
      s += '<text x="' + (pl - 6) + '" y="' + (y(v) + 3.5) + '" text-anchor="end" font-size="10.5" fill="' + COLORS.text + '">' + shortNum(v) + '</text>';
    }
    const path = points.map((p, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(p.y).toFixed(1)).join(' ');
    const area = path + ' L' + x(n - 1).toFixed(1) + ' ' + y(0).toFixed(1) + ' L' + x(0).toFixed(1) + ' ' + y(0).toFixed(1) + ' Z';
    s += '<path class="area" d="' + area + '" fill="' + color + '" opacity=".12"/>';
    s += '<path class="draw bar-glow" pathLength="1" d="' + path + '" fill="none" stroke="' + color + '" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>';
    const every = n > 20 ? 5 : n > 12 ? 2 : 1;
    points.forEach((p, i) => {
      if (n <= 31) s += '<circle cx="' + x(i).toFixed(1) + '" cy="' + y(p.y).toFixed(1) + '" r="' + (n > 20 ? 2.4 : 3.2) + '" fill="' + COLORS.card + '" stroke="' + color + '" stroke-width="2"><title>' + esc(p.tip) + '</title></circle>';
      if ((i + 1) % every === 0 || i === 0) s += '<text x="' + x(i).toFixed(1) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="10.5" fill="' + COLORS.text + '">' + esc(p.label) + '</text>';
    });
    return s + '</svg>';
  },

  /* small progress ring for the daily target */
  ring(pct, color, big, small) {
    const size = 132, r = 54, sw = 12, c = 2 * Math.PI * r, cx = size / 2;
    const p = Math.max(0, Math.min(1, pct));
    let s = '<svg viewBox="0 0 ' + size + ' ' + size + '" width="132" height="132" aria-hidden="true">';
    s += '<circle cx="' + cx + '" cy="' + cx + '" r="' + r + '" fill="none" stroke="' + COLORS.grid + '" stroke-width="' + sw + '"/>';
    s += '<circle cx="' + cx + '" cy="' + cx + '" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="' + sw + '" stroke-linecap="round" pathLength="100" stroke-dasharray="' + (p * 100).toFixed(2) + ' 100" class="ring-arc" style="color:' + color + '" transform="rotate(-90 ' + cx + ' ' + cx + ')"/>';
    s += '<text x="' + cx + '" y="' + (cx + 2) + '" text-anchor="middle" font-size="20" font-weight="700" fill="' + COLORS.ink + '" style="font-family:var(--font-display)">' + esc(big) + '</text>';
    s += '<text x="' + cx + '" y="' + (cx + 20) + '" text-anchor="middle" font-size="10.5" fill="' + COLORS.text + '">' + esc(small) + '</text>';
    return s + '</svg>';
  }
};
