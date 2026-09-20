// 셸 파일만 캐시한다. 데이터·API 응답은 절대 캐시하지 않는다. /share?url= 는 #/add?url= 로 돌린다.
const PREFIX = `meonji-shell:${self.registration.scope}:`;
const VERSION = `${PREFIX}1.1.2`;
const SHELL = [
  './', './index.html', './style.css', './app.js', './manifest.webmanifest',
  './lib/page-capture.js', './lib/capture-import.js', './lib/ulid.js', './lib/model.js', './lib/db.js', './lib/ui.js',
  './adapters/local.js', './adapters/remote.js',
  './views/deck.js', './views/add.js', './views/list.js', './views/criteria.js', './views/settings.js',
  './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith(PREFIX) && k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

const scopePath = new URL(self.registration.scope).pathname;

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.includes('/api/')) return; // API는 손대지 않는다

  // 공유 대상: /share?url=…&title=…&text=… → index.html#/add?…
  if (url.pathname === `${scopePath}share`) {
    const p = new URLSearchParams();
    for (const k of ['url', 'title', 'text']) { const v = url.searchParams.get(k); if (v) p.set(k, v); }
    e.respondWith(Response.redirect(new URL(`${scopePath}#/add?${p.toString()}`, self.location.origin).href, 303));
    return;
  }

  if (req.mode === 'navigate') {
    e.respondWith(caches.open(VERSION).then((c) => c.match('./index.html')).then((hit) => hit || fetch(req)));
    return;
  }

  e.respondWith(caches.open(VERSION).then((c) => c.match(req, { ignoreSearch: true })).then((hit) => hit || fetch(req)));
});

self.addEventListener('message', (e) => { if (e.data === 'skipWaiting') self.skipWaiting(); });
