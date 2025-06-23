import { useRef, useCallback, useEffect } from "react";
import { createStationMarker } from "../util/mapMarkerUtils";

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

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((marker) => {
      try {
        marker.remove();
      } catch (e) {
        console.warn("Error removing marker:", e);
      }
    });
    markersRef.current = [];
  }, []);

  const clearActivePopup = useCallback(() => {
    if (activePopupRef.current) {
      try {
        activePopupRef.current.remove();
        activePopupRef.current = null;
      } catch (e) {
        console.warn("Error removing active popup:", e);
      }
    }
  }, []);

  const updateMarkers = useCallback(() => {
    if (!map || !mapLoaded || stations.length === 0) return;

    clearMarkers();
    clearActivePopup();

    stations.forEach((station) => {
      const lng = parseFloat(station.location.longitude);
      const lat = parseFloat(station.location.latitude);

      if (isNaN(lng) || isNaN(lat)) {
        console.warn(
          "Invalid coordinates for station:",
          station.name,
          lng,
          lat
        );
        return;
      }

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
  }, [
    map,
    mapLoaded,
    stations,
    clearMarkers,
    clearActivePopup,
    styles,
    markerServiceIcon,
    maptilersdk,
  ]);

  useEffect(() => {
    if (mapLoaded && map && stations.length > 0) {
      updateMarkers();
    }
  }, [mapLoaded, map, stations, updateMarkers]);

  return { updateMarkers };
};
