const CACHE = "radio80-v2";
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(["./", "./index.html", "./manifest.json", "./icone.svg"])));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  if (!e.request.url.startsWith(self.location.origin)) return; // YouTube etc. passent en direct
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(n => {
      const copie = n.clone();
      caches.open(CACHE).then(c => c.put(e.request, copie));
      return n;
    }).catch(() => caches.match("./index.html")))
  );
});
