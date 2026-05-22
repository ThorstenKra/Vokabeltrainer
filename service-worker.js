const CACHE = "vt-en-v11";
const PRECACHE = [
  "./Vokabeltrainer_EN.html",
  "./manifest.json",
  "./src/data/prepositions_en.json",
  "./src/data/philosophy_rhetoric_en.json",
  "./src/data/academic_word_list_1.json",
  "./src/data/academic_word_list_2.json",
  "./src/data/academic_word_list_3.json",
  "./src/data/academic_word_list_4.json",
  "./src/data/academic_word_list_5.json",
  "./src/data/academic_word_list_6.json",
  "./src/data/academic_word_list_7.json",
  "./src/data/academic_word_list_8.json",
  "./src/data/academic_word_list_9.json",
  "./src/data/academic_word_list_10.json",
  "./src/data/academic_word_list_11.json",
  "./src/data/academic_word_list_12.json",
  "./src/data/academic_word_list_13.json",
  "./src/data/academic_word_list_14.json",
  "./src/data/academic_word_list_15.json",
  "./src/data/academic_word_list_16.json",
  "./src/data/academic_word_list_17.json",
  "./src/data/academic_word_list_18.json",
  "./src/data/academic_word_list_19.json",
  "./src/data/academic_word_list_20.json",
  "./src/data/academic_word_list_21.json",
  "./src/data/academic_word_list_22.json",
  "./src/data/academic_word_list_23.json",
  "./src/data/academic_word_list_24.json",
  "./src/data/academic_word_list_25.json",
  "./src/data/academic_word_list_26.json"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE))
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
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  // Never intercept Anthropic API calls or CDN requests
  if (url.hostname !== self.location.hostname) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(resp => {
        if (resp.ok) {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return resp;
      });
    })
  );
});
