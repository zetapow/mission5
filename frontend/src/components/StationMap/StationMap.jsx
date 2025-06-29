import React, { useRef, useMemo, useEffect } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import markerServiceIcon from "../../assets/marker-service.png";
import styles from "./StationMap.module.css";

// Constants that can be configured globally
import { MAP_CONFIG, MAP_STYLES } from "../../constants/mapConstants";

/**  Custom hooks **/
import { useViewport } from "./hooks/useViewport"; // manage map viewport and bounds
import { useMapConfig } from "./hooks/useMapConfig"; // run once to set Global MapTiler API key
import { useMapTiler } from "./hooks/useMapTiler"; // create map instance
import { useStations } from "./hooks/useStations"; // fetch stations data
import { useClustering } from "./hooks/useClustering"; // group nearby stations
import { useClusteredMarkers } from "./hooks/useClusteredMarkers"; // manage clustered markers
import { useMarkers } from "./hooks/useMarkers"; // display individual station markers when clusters are disabled

// UI imports
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";

const API_URL = `${MAP_CONFIG.API_BASE_URL}/stations`;

const StationMap = ({
  searchResults = [],
  isLoading: searchLoading,
  error: searchError,
}) => {
  const apiKey = import.meta.env.VITE_MAPTILER_API;

  // Early return before hooks
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
  useMapConfig(apiKey);

  // Optimized map options with performance settings
  const mapOptions = useMemo(
    () => ({
      style: `https://api.maptiler.com/maps/${MAP_STYLES.STREETS}/style.json?key=${apiKey}`,
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

  // Jump to search results
  useEffect(() => {
    // Only run map exists, loaded and have search results
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

  useClusteredMarkers(
    map,
    mapLoaded,
    MAP_CONFIG.ENABLE_CLUSTERING ? clusters : [],
    maptilersdk,
    getClusterExpansionZoom
  );

  useMarkers(
    map,
    mapLoaded,
    MAP_CONFIG.ENABLE_CLUSTERING ? [] : displayStations,
    styles,
    markerServiceIcon,
    maptilersdk
  );

  // all error states
  const hasError = error || searchError;
  if (hasError) return <ErrorState error={hasError} />;

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
