// hooks for MapTiler integration
import { useState, useEffect, useRef } from "react";
import * as maptilersdk from "@maptiler/sdk";

/**
 * Custom hook to create and manage a MapTiler map instance
 * Returns the map object and loading state
 */
export function useMapTiler(apiKey, containerRef, options) {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Don't create map if we don't have what we need
    if (!containerRef.current || !apiKey || mapRef.current) {
      return;
    }

    console.log("Creating MapTiler map...");

    try {
      // Set up API key
      maptilersdk.config.apiKey = apiKey;

      // Create the map
      mapRef.current = new maptilersdk.Map({
        container: containerRef.current,
        ...options,
      });

      // Wait for map to finish loading
      mapRef.current.on("load", () => {
        console.log("Map loaded successfully!");
        setMapLoaded(true);
      });

      // Handle any errors
      mapRef.current.on("error", (error) => {
        console.error("Map error:", error);
      });
    } catch (error) {
      console.error("Failed to create map:", error);
    }

    // Clean up when component unmounts
    return () => {
      if (mapRef.current) {
        console.log("Cleaning up map...");
        mapRef.current.remove();
        mapRef.current = null;
        setMapLoaded(false);
      }
    };
  }, [apiKey, containerRef.current]);

  return {
    map: mapRef.current, // The map instance
    mapLoaded, // Whether map is ready to use
  };
}
