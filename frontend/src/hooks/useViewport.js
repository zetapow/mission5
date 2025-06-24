import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook to track the map's current view (center, zoom, bounds)
 * Updates when user pans, zooms, or resizes the map
 */
export const useViewport = (map, mapLoaded, debounceMs = 300) => {
  const [viewport, setViewport] = useState(null);
  const [bounds, setBounds] = useState(null);

  // Helper function to get current map information
  const getCurrentMapInfo = useCallback(() => {
    if (!map || !mapLoaded) return null;

    const center = map.getCenter();
    const zoom = map.getZoom();
    const mapBounds = map.getBounds();

    return {
      viewport: {
        center: { lng: center.lng, lat: center.lat },
        zoom: zoom,
      },
      bounds: {
        north: mapBounds.getNorth(),
        south: mapBounds.getSouth(),
        east: mapBounds.getEast(),
        west: mapBounds.getWest(),
      },
    };
  }, [map, mapLoaded]);

  // Update viewport when map changes
  const updateViewport = useCallback(() => {
    const mapInfo = getCurrentMapInfo();
    if (mapInfo) {
      setViewport(mapInfo.viewport);
      setBounds(mapInfo.bounds);
      console.log("Map viewport updated:", mapInfo.viewport);
    }
  }, [getCurrentMapInfo]);

  // Set up map event listeners
  useEffect(() => {
    if (!map || !mapLoaded) return;

    // Update viewport immediately when map loads
    updateViewport();

    // Listen for map changes
    map.on("moveend", updateViewport);
    map.on("zoomend", updateViewport);

    // Clean up listeners when component unmounts
    return () => {
      map.off("moveend", updateViewport);
      map.off("zoomend", updateViewport);
    };
  }, [map, mapLoaded, updateViewport]);

  return { viewport, bounds };
};
