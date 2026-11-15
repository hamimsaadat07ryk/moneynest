/* Used only by the phone/web copy: keeps the app openable without internet.
   Network first (so updates arrive), cached copy when offline. */
const CACHE = 'moneynest-app-v3';
const SHELL = ['./', 'index.html', 'report.html', 'config.js', 'manifest.webmanifest', 'css/style.css', 'css/report.css', 'js/core.js', 'js/charts.js', 'js/i18n.js', 'js/drive.js', 'js/ui.js', 'js/report.js',
  'fonts/Inter-400.woff', 'fonts/Inter-500.woff', 'fonts/Inter-600.woff', 'fonts/Inter-700.woff', 'fonts/Poppins-500.woff', 'fonts/Poppins-700.woff', 'icons/logo.svg', 'icons/icon-192.png', 'icons/icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => Promise.all(SHELL.map(u => c.add(u).catch(() => { })))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(fetch(req).then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; })
    .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('./'))));
});
