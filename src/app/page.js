"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import L from "leaflet";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
const GeoJSON = dynamic(
  () => import("react-leaflet").then((mod) => mod.GeoJSON),
  { ssr: false }
);

// Données des sous-zones (extrait, à compléter)
const sousZonesSLM = [
  {
    name: "A1",
    color: "red",
    collecte: {
      encombrants: "Mardi 02 Novembre (1er MARDI du mois)",
      verts: "Mercredi 03 Novembre (1er MERCREDI du mois)",
      opacity: 0.3,
    },
    lieux: [
      { nom: "Chandon", coord: [5.504496155191266, -54.03048410030026] },
      { nom: "Les Cultures", coord: [5.503562310807634, -54.028787351439064] },
      { nom: "Marinas", coord: [5.506649, -54.024784] },
    ],
  },
  // ...autres zones à compléter
];

const slmVilleGeojson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Saint-Laurent-du-Maroni (ville)" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-54.013837207389244, 5.511957978505066],
            [-54.012842422153, 5.51096660075099],
            [-54.02377595076858, 5.511022232736451],
            [-54.03489081783944, 5.506260924274841],
            [-54.05049117559348, 5.477562254984889],
            [-54.054330210999055, 5.447195023824804],
            [-54.01993273058761, 5.438374723613649],
            [-53.988108012433585, 5.503401879396279],
            [-54.013837207389244, 5.511957978505066],
          ],
        ],
      },
    },
  ],
};

export default function Home() {
  const [selectedCommune, setSelectedCommune] = useState("");
  const [showPoints, setShowPoints] = useState(false);
  const [showEncombrants, setShowEncombrants] = useState(false);
  const [showVerts, setShowVerts] = useState(false);
  const [routesData, setRoutesData] = useState({});

  useEffect(() => {
    // Patch Leaflet marker icons côté client uniquement
    if (typeof window !== "undefined") {
      const setupIcons = async () => {
        const markerIcon2x = await import(
          "leaflet/dist/images/marker-icon-2x.png"
        );
        const markerIcon = await import(
          "leaflet/dist/images/marker-icon.png"
        );
        const markerShadow = await import(
          "leaflet/dist/images/marker-shadow.png"
        );

        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: markerIcon2x.default,
          iconUrl: markerIcon.default,
          shadowUrl: markerShadow.default,
        });
      };

      setupIcons();
    }
  }, []);

  useEffect(() => {
    const orsApiKey = process.env.NEXT_PUBLIC_ORS_API_KEY;
    if (!showPoints || selectedCommune !== "slm") {
      return setRoutesData({});
    }
    if (!orsApiKey) return;

    let cancelled = false;
    const fetchRoutes = async () => {
      try {
        const results = await Promise.all(
          sousZonesSLM.map((zone) =>
            fetch(
              "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: orsApiKey,
                },
                body: JSON.stringify({
                  coordinates: zone.lieux.map((l) => [l.coord[1], l.coord[0]]),
                }),
              }
            ).then((res) => (res.ok ? res.json() : null))
          )
        );
        if (!cancelled) {
          const obj = {};
          results.forEach((geo, idx) => {
            if (geo) obj[sousZonesSLM[idx].name] = geo;
          });
          setRoutesData(obj);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchRoutes();

    return () => {
      cancelled = true;
    };
  }, [showPoints, selectedCommune]);

  // Centrage initial sur la Guyane Ouest
  const center = [5.5, -54.03];

  return (
    <main className="w-screen h-screen">
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] bg-white p-3 rounded-lg shadow-lg border border-gray-300">
        <strong className="text-black">Choisir une commune :</strong>
        <br />
        <select
          className="border rounded p-1 mt-1 text-black bg-white"
          value={selectedCommune}
          onChange={(e) => {
            setSelectedCommune(e.target.value);
            setShowPoints(!!e.target.value);
            setShowEncombrants(false);
            setShowVerts(false);
          }}
        >
          <option value="">-- Sélectionner --</option>
          <option value="slm">Saint-Laurent-du-Maroni</option>
        </select>
        <div className="mt-2">
          <label className="text-black">
            <input
              type="checkbox"
              checked={showPoints}
              onChange={(e) => setShowPoints(e.target.checked)}
            />
            <span className="ml-1">Points & tracés routiers</span>
          </label>
          <br />
          <label className="text-black">
            <input
              type="checkbox"
              checked={showEncombrants}
              onChange={(e) => setShowEncombrants(e.target.checked)}
            />
            <span className="ml-1">Dates collecte encombrants</span>
          </label>
          <br />
          <label className="text-black">
            <input
              type="checkbox"
              checked={showVerts}
              onChange={(e) => setShowVerts(e.target.checked)}
            />
            <span className="ml-1">Dates collecte déchets verts</span>
          </label>
        </div>
      </div>
      <MapContainer
        center={center}
        zoom={7}
        scrollWheelZoom={true}
        className="w-screen h-screen min-h-[500px] z-[1]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={22}
        />
        {selectedCommune === "slm" && (
          <GeoJSON
            data={slmVilleGeojson}
            style={{
              color: "#1976d2",
              weight: 2,
              fillOpacity: 0.03,
            }}
          />
        )}
        {showPoints &&
          selectedCommune === "slm" &&
          sousZonesSLM.map((zone, i) =>
            zone.lieux
              .filter(
                (lieu) =>
                  lieu.nom && Array.isArray(lieu.coord) && lieu.coord.length === 2
              )
              .map((lieu, j) => (
                <Marker key={zone.name + j} position={lieu.coord}>
                  <Popup>
                    <b>{lieu.nom}</b>
                    <br />
                    <b>Secteur :</b> {zone.name}
                    {showEncombrants && zone.collecte.encombrants && (
                      <>
                        <br />
                        <b>Collecte encombrants :</b> {zone.collecte.encombrants}
                      </>
                    )}
                    {showVerts && zone.collecte.verts && (
                      <>
                        <br />
                        <b>Collecte déchets verts :</b> {zone.collecte.verts}
                      </>
                    )}
                  </Popup>
                </Marker>
              ))
          )}
        {showPoints &&
          selectedCommune === "slm" &&
          Object.entries(routesData).map(([name, geo]) => (
            <GeoJSON
              key={`route-${name}`}
              data={geo}
              style={{
                color:
                  sousZonesSLM.find((z) => z.name === name)?.color || "#1976d2",
                weight: 3,
              }}
            />
          ))}
      </MapContainer>
    </main>
  );
}
