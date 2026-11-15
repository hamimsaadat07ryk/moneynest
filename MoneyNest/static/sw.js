/* Version 1 installed a phone/offline cache. This version does not need it, so this file
   removes the old cache and unregisters itself the next time the browser checks for updates. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.map(k => caches.delete(k)))).then(() => self.registration.unregister()).then(() => self.clients.claim()));
});
