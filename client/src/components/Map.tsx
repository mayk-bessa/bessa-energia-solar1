/**
 * GOOGLE MAPS FRONTEND INTEGRATION - ESSENTIAL GUIDE
 *
 * USAGE FROM PARENT COMPONENT:
 * ======
 *
 * const mapRef = useRef<google.maps.Map | null>(null);
 *
 * <MapView
 *   initialCenter={{ lat: 40.7128, lng: -74.0060 }}
 *   initialZoom={15}
 *   onMapReady={(map) => {
 *     mapRef.current = map; // Store to control map from parent anytime, google map itself is in charge of the re-rendering, not react state.
 * </MapView>
 *
 * ======
 * Available Libraries and Core Features:
 * -------------------------------
 * 📍 MARKER (from `marker` library)
 * - Attaches to map using { map, position }
 * new google.maps.marker.AdvancedMarkerElement({
 *   map,
 *   position: { lat: 37.7749, lng: -122.4194 },
 *   title: "San Francisco",
 * });
 *
 * -------------------------------
 * 🏢 PLACES (from `places` library)
 * - Does not attach directly to map; use data with your map manually.
 * const place = new google.maps.places.Place({ id: PLACE_ID });
 * await place.fetchFields({ fields: ["displayName", "location"] });
 * map.setCenter(place.location);
 * new google.maps.marker.AdvancedMarkerElement({ map, position: place.location });
 *
 * -------------------------------
 * 🧭 GEOCODER (from `geocoding` library)
 * - Standalone service; manually apply results to map.
 * const geocoder = new google.maps.Geocoder();
 * geocoder.geocode({ address: "New York" }, (results, status) => {
 *   if (status === "OK" && results[0]) {
 *     map.setCenter(results[0].geometry.location);
 *     new google.maps.marker.AdvancedMarkerElement({
 *       map,
 *       position: results[0].geometry.location,
 *     });
 *   }
 * });
 *
 * -------------------------------
 * 📐 GEOMETRY (from `geometry` library)
 * - Pure utility functions; not attached to map.
 * const dist = google.maps.geometry.spherical.computeDistanceBetween(p1, p2);
 *
 * -------------------------------
 * 🛣️ ROUTES (from `routes` library)
 * - Combines DirectionsService (standalone) + DirectionsRenderer (map-attached)
 * const directionsService = new google.maps.DirectionsService();
 * const directionsRenderer = new google.maps.DirectionsRenderer({ map });
 * directionsService.route(
 *   { origin, destination, travelMode: "DRIVING" },
 *   (res, status) => status === "OK" && directionsRenderer.setDirections(res)
 * );
 *
 * -------------------------------
 * 🌦️ MAP LAYERS (attach directly to map)
 * - new google.maps.TrafficLayer().setMap(map);
 * - new google.maps.TransitLayer().setMap(map);
 * - new google.maps.BicyclingLayer().setMap(map);
 *
 * -------------------------------
 * ✅ SUMMARY
 * - “map-attached” → AdvancedMarkerElement, DirectionsRenderer, Layers.
 * - “standalone” → Geocoder, DirectionsService, DistanceMatrixService, ElevationService.
 * - “data-only” → Place, Geometry utilities.
 */

/// <reference types="@types/google.maps" />

import { useEffect, useRef, useState } from "react";
import { usePersistFn } from "@/hooks/usePersistFn";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    google?: typeof google;
  }
}

const API_KEY = import.meta.env.VITE_FRONTEND_FORGE_API_KEY;
const FORGE_BASE_URL =
  import.meta.env.VITE_FRONTEND_FORGE_API_URL ||
  "https://forge.butterfly-effect.dev";
const MAPS_PROXY_URL = `${FORGE_BASE_URL}/v1/maps/proxy`;
const FALLBACK_MAP_URL =
  "https://www.google.com/maps?q=Minas+Gerais%2C+Brazil&output=embed";
const COMPANY_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Minas+Gerais%2C+Brasil";

const FALLBACK_REGIONS = [
  { name: "Triângulo Mineiro", left: "29%", top: "50%" },
  { name: "Grande BH", left: "63%", top: "62%" },
  { name: "Vale do Aço", left: "77%", top: "56%" },
  { name: "Sul de Minas", left: "51%", top: "76%" },
] as const;

function loadMapScript() {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `${MAPS_PROXY_URL}/maps/api/js?key=${API_KEY}&v=weekly&libraries=marker,places,geocoding,geometry`;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onload = () => {
      resolve();
      script.remove(); // Clean up immediately
    };
    script.onerror = () => {
      console.error("Failed to load Google Maps script");
      script.remove();
      reject(new Error("Google Maps indisponível"));
    };
    document.head.appendChild(script);
  });
}

interface MapViewProps {
  className?: string;
  initialCenter?: google.maps.LatLngLiteral;
  initialZoom?: number;
  onMapReady?: (map: google.maps.Map) => void;
}

export function MapView({
  className,
  initialCenter = { lat: 37.7749, lng: -122.4194 },
  initialZoom = 12,
  onMapReady,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const [mapError, setMapError] = useState(false);

  const init = usePersistFn(async () => {
    try {
      await loadMapScript();
      if (!window.google?.maps?.Map) {
        throw new Error("Google Maps API indisponível após o carregamento");
      }
      if (!mapContainer.current) {
        throw new Error("Map container not found");
      }
      map.current = new window.google.maps.Map(mapContainer.current, {
        zoom: initialZoom,
        center: initialCenter,
        mapTypeControl: true,
        fullscreenControl: true,
        zoomControl: true,
        streetViewControl: true,
        mapId: "DEMO_MAP_ID",
      });
      setMapError(false);
      if (onMapReady) {
        onMapReady(map.current);
      }
    } catch (error) {
      console.error("Failed to initialize Google Maps", error);
      setMapError(true);
    }
  });

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div className={cn("relative w-full h-[500px]", className)}>
      <div ref={mapContainer} className="h-full w-full" aria-label="Mapa de cobertura da Bessa Energia" />
      {mapError ? (
        <div className="absolute inset-0 overflow-hidden bg-slate-100">
          <iframe
            src={FALLBACK_MAP_URL}
            title="Mapa alternativo de cobertura em Minas Gerais"
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div
            className="pointer-events-none absolute inset-0"
            aria-label="Regiões de atuação destacadas no mapa"
          >
            <div className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] rounded-lg bg-white/95 p-3 text-xs text-slate-700 shadow-lg">
              <p className="mb-2 font-semibold text-[#253c7e]">Regiões atendidas</p>
              <div className="flex flex-wrap gap-1.5">
                {FALLBACK_REGIONS.map((region) => (
                  <span
                    key={region.name}
                    className="rounded-full bg-[#253c7e]/95 px-2 py-1 font-medium text-white"
                  >
                    {region.name}
                  </span>
                ))}
              </div>
            </div>
            {FALLBACK_REGIONS.map((region) => (
              <div
                key={region.name}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[10px] font-semibold text-[#253c7e] shadow-md ring-2 ring-[#ff6900]/70 sm:text-xs"
                style={{ left: region.left, top: region.top }}
              >
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff6900] ring-2 ring-white" />
                {region.name}
              </div>
            ))}
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-2 rounded-lg bg-white/95 p-3 text-sm text-slate-700 shadow-lg sm:flex-row sm:items-center sm:justify-between">
            <span>Mapa alternativo com regiões de atuação destacadas</span>
            <a
              href={COMPANY_MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[#253c7e] underline decoration-[#ff6900] underline-offset-2 hover:text-[#ff6900]"
            >
              Abrir no Google Maps
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
