import React, { useRef, useMemo, useEffect } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import markerServiceIcon from "../../assets/marker-service.png";
import styles from "./StationMap.module.css";

// Custom hooks
import { useMapTiler } from "../../hooks/useMapTiler";
import { useStations } from "../../hooks/useStations";
import { useMarkers } from "../../hooks/useMarkers";
import { useViewport } from "../../hooks/useViewport";
import { useClustering } from "../../hooks/useClustering";
import { useClusteredMarkers } from "../../hooks/useClusteredMarkers";

// UI Components
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";

// Constants
import { MAP_CONFIG } from "../../constants/mapConstants";

const API_URL = `${MAP_CONFIG.API_BASE_URL}/stations`;

const StationMap = ({
  searchResults = [],
  isLoading: searchLoading,
  error: searchError,
}) => {
  const apiKey = import.meta.env.VITE_MAPTILER_API;

  // Early return before hooks are called
  if (!apiKey) {
    return (
      <div className={styles.apiKeyError}>
        <p>Missing MapTiler API key</p>
        <p>Please check the .env file and ensure VITE_MAPTILER_API is set</p>
      </div>
    );
  }

  const mapContainer = useRef(null);

  // Preload API key to avoid delays
  useEffect(() => {
    if (apiKey) {
      maptilersdk.config.apiKey = apiKey;
    }
  }, [apiKey]);

  // Optimized map options with performance settings
  const mapOptions = useMemo(
    () => ({
      style: `https://api.maptiler.com/maps/streets/style.json?key=${apiKey}`,
      center: MAP_CONFIG.DEFAULT_CENTER,
      zoom: MAP_CONFIG.DEFAULT_ZOOM,
      // Performance optimizations
      antialias: false,
      attributionControl: false,
      logoControl: false,
      renderWorldCopies: false,
      maxTileCacheSize: 50,
      preserveDrawingBuffer: false,
    }),
    [apiKey]
  );

  // Custom hooks
  const { map, mapLoaded } = useMapTiler(apiKey, mapContainer, mapOptions);
  const { viewport, bounds } = useViewport(
    map,
    mapLoaded,
    MAP_CONFIG.VIEWPORT_DEBOUNCE_MS
  );
  const { stations, allStations, loading, error } = useStations(
    API_URL,
    bounds,
    MAP_CONFIG.ENABLE_VIEWPORT_FILTERING
  );

  // Use search results when available, otherwise use all stations
  const displayStations = searchResults.length > 0 ? searchResults : stations;

  // Jump to search results when they change
  useEffect(() => {
    // Only run if we have a map, it's loaded, and we have search results
    if (map && mapLoaded && searchResults.length > 0) {
      // Get coordinates from all search results
      const coordinates = searchResults
        .filter(
          (station) => station.location?.latitude && station.location?.longitude
        )
        .map((station) => [
          station.location.longitude,
          station.location.latitude,
        ]);

      if (coordinates.length > 0) {
        if (coordinates.length === 1) {
          // Single result: Center on that station
          map.flyTo({
            center: coordinates[0],
            zoom: 14,
            duration: 1000,
          });
        } else {
          // Multiple results: Fit bounds to show all stations
          const bounds = coordinates.reduce((bounds, coord) => {
            return bounds.extend(coord);
          }, new maptilersdk.LngLatBounds(coordinates[0], coordinates[0]));

          map.fitBounds(bounds, {
            padding: 50,
            duration: 1000,
            maxZoom: 15,
          });
        }
      }
    }
  }, [map, mapLoaded, searchResults]);

  // Call all hooks, conditionally use results
  const { clusters, getClusterExpansionZoom } = useClustering(
    displayStations,
    map,
    mapLoaded
  );

  // Use clustering or individual markers based on configuration
  if (MAP_CONFIG.ENABLE_CLUSTERING) {
    useClusteredMarkers(
      map,
      mapLoaded,
      clusters,
      maptilersdk,
      getClusterExpansionZoom
    );
  } else {
    useMarkers(
      map,
      mapLoaded,
      displayStations,
      styles,
      markerServiceIcon,
      maptilersdk
    );
  }

  // Early returns for different states
  if (error) return <ErrorState error={error} />;

  return (
    <div className={styles.mapWrapper}>
      <div
        ref={mapContainer}
        className={styles.mapContainer}
        id="map-container"
      />
      {loading && (
        <div className={styles.loadingOverlay}>
          <LoadingState />
        </div>
      )}
    </div>
  );
};

export default StationMap;
