const CACHE = "little-steward-v1";
const FILES = ["./", "./index.html", "./styles.css", "./app.js", "./manifest.json", "./icon.svg"];
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES))));
self.addEventListener("fetch", event => event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request))));
