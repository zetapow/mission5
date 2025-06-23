// hooks for MapTiler integration
import { useState, useEffect, useRef } from "react";
import * as maptilersdk from "@maptiler/sdk";

export function useMapTiler(apiKey, containerRef, options) {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    console.log("useMapTiler effect running:", {
      hasContainer: !!containerRef.current,
      hasMap: !!mapRef.current,
      hasApiKey: !!apiKey,
      options,
    });

    if (!containerRef.current || mapRef.current || !apiKey) {
      console.log("useMapTiler early return:", {
        noContainer: !containerRef.current,
        mapExists: !!mapRef.current,
        noApiKey: !apiKey,
      });
      return;
    }

    console.log("Creating MapTiler map...");

    try {
      // Set API key globally for better performance
      maptilersdk.config.apiKey = apiKey;

      // Create map with performance optimizations
      mapRef.current = new maptilersdk.Map({
        container: containerRef.current,
        ...options,
        // Additional performance settings
        fadeDuration: 0, // No fade animation for faster loading
        crossSourceCollisions: false, // Disable collision detection
      });

      console.log("Map created successfully:", mapRef.current);

      // Use 'style.load' instead of 'load' for faster detection
      mapRef.current.on("style.load", () => {
        console.log("Map style loaded!");
        setMapLoaded(true);
      });

      // Handle errors
      mapRef.current.on("error", (e) => {
        console.error("Map error:", e);
      });
    } catch (error) {
      console.error("Error creating map:", error);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        setMapLoaded(false);
      }
    };
  }, [apiKey, containerRef.current]); // Add containerRef.current as dependency

  return { map: mapRef.current, mapLoaded };
}
