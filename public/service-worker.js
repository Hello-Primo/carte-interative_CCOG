const CORE_CACHE = "core-v1";
const TILE_CACHE = "tiles-v1";
const ROUTE_CACHE = "route-v1";
const OTHER_CACHE = "other-v1";

const CORE_ASSETS = ["/", "/manifest.json", "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CORE_CACHE).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  const allowed = [CORE_CACHE, TILE_CACHE, ROUTE_CACHE, OTHER_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !allowed.includes(key))
            .map((key) => caches.delete(key))
        )
      )
  );
  self.clients.claim();
});

function cacheFirst(request, cacheName) {
  return caches.open(cacheName).then((cache) =>
    cache.match(request).then((resp) => {
      if (resp) {
        return resp;
      }
      return fetch(request).then((networkResp) => {
        if (networkResp && networkResp.status === 200) {
          cache.put(request, networkResp.clone());
        }
        return networkResp;
      });
    })
  );
}

function networkFirst(request, cacheName) {
  return caches.open(cacheName).then((cache) =>
    fetch(request)
      .then((networkResp) => {
        if (networkResp && networkResp.status === 200) {
          cache.put(request, networkResp.clone());
        }
        return networkResp;
      })
      .catch(() => cache.match(request))
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(request, CORE_CACHE));
    return;
  }

  if (url.hostname === "tile.openstreetmap.org") {
    event.respondWith(cacheFirst(request, TILE_CACHE));
    return;
  }

  if (url.hostname === "api.openrouteservice.org") {
    event.respondWith(networkFirst(request, ROUTE_CACHE));
    return;
  }

  event.respondWith(networkFirst(request, OTHER_CACHE));
});
