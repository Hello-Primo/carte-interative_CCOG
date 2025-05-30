"use client";
import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { sousZonesSLM, slmVilleGeojson } from "./sousZonesSLM";

const positionGuyane = [5.5, -54.03];

function FitBounds({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) map.fitBounds(bounds, { maxZoom: 14 });
  }, [bounds, map]);
  return null;
}

export default function CarteInteractive() {
  const [commune, setCommune] = useState("");
  const [showPoints, setShowPoints] = useState(false);
  const [showEncombrants, setShowEncombrants] = useState(false);
  const [showVerts, setShowVerts] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [bounds, setBounds] = useState(null);

  // Pour stocker les marqueurs (pour update popup)
  const markersRef = useRef([]);

  // Gestion du changement de commune
  useEffect(() => {
    setShowPoints(!!commune);
    setShowEncombrants(false);
    setShowVerts(false);
    setRoutes([]);
    setBounds(null);
    if (commune === "slm") {
      // Calculer les bounds du polygone
      const geo = slmVilleGeojson.features[0].geometry.coordinates[0];
      setBounds(L.latLngBounds(geo.map(([lng, lat]) => [lat, lng])));
      // Générer les routes
      addSousSecteurRoutes();
    }
    // eslint-disable-next-line
  }, [commune]);

  // Gestion de l'affichage des routes
  function addSousSecteurRoutes() {
    if (commune !== "slm") return;
    const apiKey = "5b3ce3597851110001cf62483abfcab827f04c11bd08909b3982092d";
    let promises = [];
    sousZonesSLM.forEach((zone) => {
      for (let i = 0; i < zone.lieux.length - 1; i++) {
        const from = zone.lieux[i].coord;
        const to = zone.lieux[i + 1].coord;
        promises.push(
          fetch(
            "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
            {
              method: "POST",
              headers: {
                Authorization: apiKey,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                coordinates: [
                  [from[1], from[0]],
                  [to[1], to[0]],
                ],
              }),
            }
          )
            .then((r) => r.json())
            .then((data) => data.features?.[0]?.geometry)
        );
      }
    });
    Promise.all(promises).then((geoms) => {
      setRoutes(geoms.filter(Boolean));
    });
  }

  // Génération du contenu du popup
  function getPopupContentLieu(zone, lieu) {
    let html = `<b>${lieu.nom}</b><br><b>Secteur :</b> ${zone.name}`;
    if (showEncombrants && zone.collecte.encombrants) {
      html += `<br><b>Collecte encombrants :</b> ${zone.collecte.encombrants}`;
    }
    if (showVerts && zone.collecte.verts) {
      html += `<br><b>Collecte déchets verts :</b> ${zone.collecte.verts}`;
    }
    return html;
  }

  return (
    <div className="w-full h-screen relative bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* UI flottante */}
      <div className="absolute top-6 right-8 z-[1000] bg-white/95 p-4 rounded-xl shadow-xl min-w-[220px] max-w-[270px] border border-blue-200 backdrop-blur-md">
        <strong className="text-black text-base font-semibold tracking-wide">
          Choisir une commune :
        </strong>
        <select
          className="block w-full mt-2 mb-3 border border-blue-200 rounded px-2 py-1 text-black bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none transition text-sm"
          value={commune}
          onChange={(e) => setCommune(e.target.value)}
        >
          <option value="">-- Sélectionner --</option>
          <option value="slm">Saint-Laurent-du-Maroni</option>
        </select>
        <div className="mt-2 space-y-1">
          <label className="flex items-center gap-2 text-black text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showPoints}
              onChange={() => setShowPoints((v) => !v)}
              disabled={!commune}
              className="accent-blue-600 w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-blue-400"
            />
            <span>Points & tracés routiers</span>
          </label>
          <label className="flex items-center gap-2 text-black text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showEncombrants}
              onChange={() => setShowEncombrants((v) => !v)}
              disabled={!commune}
              className="accent-green-600 w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-green-400"
            />
            <span>Dates collecte encombrants</span>
          </label>
          <label className="flex items-center gap-2 text-black text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showVerts}
              onChange={() => setShowVerts((v) => !v)}
              disabled={!commune}
              className="accent-lime-600 w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-lime-400"
            />
            <span>Dates collecte déchets verts</span>
          </label>
        </div>
      </div>
      {/* Carte */}
      <MapContainer
        center={positionGuyane}
        zoom={7}
        scrollWheelZoom
        className="w-full h-screen z-0 rounded-xl shadow-xl border border-blue-100"
        style={{ minHeight: 500 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={22}
        />
        {/* Polygone de la commune */}
        {commune === "slm" && (
          <GeoJSON
            data={slmVilleGeojson}
            style={{ color: "#1976d2", weight: 2, fillOpacity: 0.03 }}
          />
        )}
        {/* Markers et routes */}
        {commune === "slm" &&
          showPoints &&
          sousZonesSLM.map((zone, i) =>
            zone.lieux.map((lieu, j) => (
              <Marker
                key={zone.name + j}
                position={lieu.coord}
                icon={L.icon({
                  iconUrl:
                    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                  iconAnchor: [12, 41],
                })}
                ref={(el) => (markersRef.current[i * 10 + j] = el)}
              >
                <Popup>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: getPopupContentLieu(zone, lieu),
                    }}
                  />
                </Popup>
              </Marker>
            ))
          )}
        {/* Tracés routiers */}
        {commune === "slm" &&
          showPoints &&
          routes.map((geom, idx) =>
            geom ? (
              <GeoJSON
                key={idx}
                data={geom}
                style={{ color: "red", weight: 5, opacity: 0.3 }}
              />
            ) : null
          )}
        {/* Fit bounds sur la commune */}
        {bounds && <FitBounds bounds={bounds} />}
      </MapContainer>
    </div>
  );
}
