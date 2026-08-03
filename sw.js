const VIPYCTMALL_SW_VERSION = '20260803-install-detect-v5';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith('vipyctmall-')).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

// Keep every page network-first so website updates are not trapped in an old cache.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(fetch(event.request));
});
