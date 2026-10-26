const PREFIX = `word-atlas-child:${new URL(self.registration.scope).pathname}:`;
const VERSION = "__BUILD_ID__";
const SHELL = `${PREFIX}${VERSION}:shell`;
const MEDIA = `${PREFIX}${VERSION}:media`;

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith(PREFIX) && k !== SHELL && k !== MEDIA).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

async function trim(name, max) {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i]);
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || req.headers.has("range")) return;
  const url = new URL(req.url);
  const scope = new URL(self.registration.scope);
  if (url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
  const isShell = req.mode === "navigate" || url.pathname.endsWith("/index.json");
  if (isShell) {
    event.respondWith(
      fetch(req).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          event.waitUntil(caches.open(SHELL).then((c) => c.put(req, copy)));
        }
        return res;
      }).catch(async () => {
        const cache = await caches.open(SHELL);
        return await cache.match(req) || await cache.match(scope.href) || Response.error();
      }),
    );
    return;
  }
  const name = /\/atlas\/(img|thumb|audio)\//.test(url.pathname) ? MEDIA : SHELL;
  event.respondWith(caches.open(name).then(async (cache) => {
    const hit = await cache.match(req);
    if (hit) return hit;
    const res = await fetch(req);
    if (res.ok && res.type === "basic") {
      const copy = res.clone();
      event.waitUntil(cache.put(req, copy).then(() => name === MEDIA && trim(MEDIA, 1500)));
    }
    return res;
  }));
});
