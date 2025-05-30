const CORE_CACHE = "core-v1";
const TILE_CACHE = "tiles-v1";
const ROUTE_CACHE = "route-v1";
const OTHER_CACHE = "other-v1";

const CORE_ASSETS = ["/", "/manifest.json", "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CORE_CACHE).then((cache) => cache.addAll(CORE_ASSETS)),
      caches.open(TILE_CACHE).then((cache) => cache.addAll(SLM_TILES)),
    ])
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

// --- Précaching des tuiles OSM pour le polygone SLM (zoom 15 à 18) ---
// Coordonnées du polygone SLM (lon, lat)
const SLM_POLYGON = [
  [-54.013837207389244, 5.511957978505066],
  [-54.012842422153, 5.51096660075099],
  [-54.02377595076858, 5.511022232736451],
  [-54.03489081783944, 5.506260924274841],
  [-54.05049117559348, 5.477562254984889],
  [-54.054330210999055, 5.447195023824804],
  [-54.01993273058761, 5.438374723613649],
  [-53.988108012433585, 5.503401879396279],
  [-54.013837207389244, 5.511957978505066],
];

// Conversion lat/lon -> tuiles OSM
function lngLatToTile(lon, lat, z) {
  const x = Math.floor(((lon + 180) / 360) * Math.pow(2, z));
  const y = Math.floor(
    (1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) /
      2 *
      Math.pow(2, z)
  );
  return { x, y };
}

// Génère toutes les tuiles couvrant le polygone (bbox)
function getTilesForPolygon(polygon, zooms = [15, 16, 17, 18]) {
  let tiles = [];
  zooms.forEach((z) => {
    let lats = polygon.map((c) => c[1]);
    let lons = polygon.map((c) => c[0]);
    let minLat = Math.min(...lats);
    let maxLat = Math.max(...lats);
    let minLon = Math.min(...lons);
    let maxLon = Math.max(...lons);
    let { x: xMin, y: yMax } = lngLatToTile(minLon, minLat, z);
    let { x: xMax, y: yMin } = lngLatToTile(maxLon, maxLat, z);
    for (let x = xMin; x <= xMax; x++) {
      for (let y = yMin; y <= yMax; y++) {
        tiles.push(`https://tile.openstreetmap.org/${z}/${x}/${y}.png`);
      }
    }
  });
  return tiles;
}

const SLM_TILES = getTilesForPolygon(SLM_POLYGON);
