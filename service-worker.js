// service-worker.js
// Cacht alle App-Dateien beim ersten Besuch für Offline-Nutzung

const CACHE = "vt-en-v1";
const FILES = [
  "./Vokabeltrainer_EN.html",
  "./vocab/en_b2_p1.js",
  "./vocab/en_b2_p2.js",
  "./vocab/en_b2_p3.js",
  "./vocab/en_b2_p4.js",
  "./vocab/en_c1_p1.js",
  "./vocab/en_c1_p2.js",
  "./vocab/en_c1_p3.js"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES))
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
