import { useRef, useEffect } from "react";
import { createStationMarker } from "../util/mapMarkerUtils";

/**
 * Custom hook to manage individual station markers on the map
 * Creates, updates, and removes markers as stations change
 */
export const useMarkers = (
  map,
  mapLoaded,
  stations,
  styles,
  markerServiceIcon,
  maptilersdk
) => {
  const markersRef = useRef([]);
  const activePopupRef = useRef(null);

  // Remove all markers from the map
  const clearMarkers = () => {
    markersRef.current.forEach((marker) => {
      try {
        marker.remove();
      } catch (error) {
        console.warn("Error removing marker:", error);
      }
    });
    markersRef.current = [];
    console.log("Cleared all markers");
  };

  // Close any open popup
  const closeActivePopup = () => {
    if (activePopupRef.current) {
      try {
        activePopupRef.current.remove();
        activePopupRef.current = null;
      } catch (error) {
        console.warn("Error closing popup:", error);
      }
    }
  };

  // Create markers for all stations
  const createMarkers = () => {
    if (!map || !mapLoaded || stations.length === 0) {
      return;
    }

    console.log(`Creating ${stations.length} station markers...`);

    // Clear existing markers first
    clearMarkers();
    closeActivePopup(); // Create a marker for each station
    stations.forEach((station) => {
      // Check if station has valid coordinates
      const lng = station.location.longitude;
      const lat = station.location.latitude;

      if (
        typeof lng !== "number" ||
        typeof lat !== "number" ||
        isNaN(lng) ||
        isNaN(lat)
      ) {
        console.warn(`Invalid coordinates for station: ${station.name}`);
        return;
      }

      // Create and add marker to map
      const marker = createStationMarker(
        station,
        styles,
        markerServiceIcon,
        maptilersdk,
        activePopupRef
      );

      marker.addTo(map);
      markersRef.current.push(marker);
    });

    console.log(`Added ${markersRef.current.length} markers to map`);
  };

  // Update markers whenever stations change
  useEffect(() => {
    createMarkers();
  }, [map, mapLoaded, stations]);

  return { clearMarkers };
};
