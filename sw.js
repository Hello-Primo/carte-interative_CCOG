const CACHE_NAME = "ccog-map-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css",
  "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // Si la requête concerne les tuiles OSM, on les met en cache dynamiquement
  if (url.startsWith("https://tile.openstreetmap.org/")) {
    event.respondWith(
      caches.open("osm-tiles").then((cache) =>
        cache.match(event.request).then((response) => {
          if (response) return response;
          return fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
      )
    );
    return;
  }

  // Si la requête concerne OpenRouteService, on met aussi en cache dynamiquement
  if (url.startsWith("https://api.openrouteservice.org/")) {
    event.respondWith(
      caches.open("ors-routes").then((cache) =>
        cache.match(event.request).then((response) => {
          if (response) return response;
          return fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
      )
    );
    return;
  }

  // Sinon, comportement par défaut
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
