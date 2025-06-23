import { useState, useEffect, useCallback, useRef } from "react";

// Debounce utility function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

export const useViewport = (map, mapLoaded, debounceMs = 300) => {
  const [viewport, setViewport] = useState(null);
  const [bounds, setBounds] = useState(null);
  const lastViewportRef = useRef(null);

  // Debounced viewport update function
  const debouncedUpdateViewport = useCallback(
    debounce((newViewport, newBounds) => {
      // Only update if viewport actually changed significantly
      const lastViewport = lastViewportRef.current;
      if (
        !lastViewport ||
        Math.abs(lastViewport.zoom - newViewport.zoom) > 0.1 ||
        Math.abs(lastViewport.center.lng - newViewport.center.lng) > 0.001 ||
        Math.abs(lastViewport.center.lat - newViewport.center.lat) > 0.001
      ) {
        setViewport(newViewport);
        setBounds(newBounds);
        lastViewportRef.current = newViewport;

        console.log("Viewport updated:", newViewport);
      }
    }, debounceMs),
    [debounceMs]
  );

  const updateViewport = useCallback(() => {
    if (!map || !mapLoaded) return;

    const center = map.getCenter();
    const zoom = map.getZoom();
    const mapBounds = map.getBounds();

    const newViewport = {
      center: { lng: center.lng, lat: center.lat },
      zoom: zoom,
      timestamp: Date.now(),
    };

    const newBounds = {
      north: mapBounds.getNorth(),
      south: mapBounds.getSouth(),
      east: mapBounds.getEast(),
      west: mapBounds.getWest(),
    };

    debouncedUpdateViewport(newViewport, newBounds);
  }, [map, mapLoaded, debouncedUpdateViewport]);

  useEffect(() => {
    if (!map || !mapLoaded) return;

    // Initial viewport
    updateViewport();

    // Event listeners for map movement
    const handleMove = () => updateViewport();
    const handleZoom = () => updateViewport();
    const handleResize = () => updateViewport();

    map.on("moveend", handleMove);
    map.on("zoomend", handleZoom);
    map.on("resize", handleResize);

    return () => {
      map.off("moveend", handleMove);
      map.off("zoomend", handleZoom);
      map.off("resize", handleResize);
    };
  }, [map, mapLoaded, updateViewport]);

  return { viewport, bounds, updateViewport };
};
