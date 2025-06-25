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
import { InfoBox } from "./InfoBox";

// Constants
import { MAP_CONFIG } from "../../constants/mapConstants";

const API_URL = `${MAP_CONFIG.API_BASE_URL}/stations`;

const StationMap = () => {
  const apiKey = import.meta.env.VITE_MAPTILER_API;
  const mapContainer = useRef(null);

  // Debug logging
  console.log("StationMap render - API Key:", apiKey ? "Present" : "Missing");

  // Early return if no API key
  if (!apiKey) {
    return (
      <div className={styles.apiKeyError}>
        <p>Missing MapTiler API key</p>
        <p>Please check the .env file and ensure VITE_MAPTILER_API is set</p>
      </div>
    );
  }

  // Preload API key to avoid delays
  useEffect(() => {
    if (apiKey) {
      maptilersdk.config.apiKey = apiKey;
      console.log("API key set globally");
    } else {
      console.error("No API key found!");
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

  // Choose between clustering or individual markers
  if (MAP_CONFIG.ENABLE_CLUSTERING) {
    const { clusters, getClusterExpansionZoom } = useClustering(
      stations,
      map,
      mapLoaded
    );
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
      stations,
      styles,
      markerServiceIcon,
      maptilersdk
    );
  }

  // Debug logging for hooks
  console.log("Hook states:", {
    map: !!map,
    mapLoaded,
    stationsCount: stations.length,
    loading,
    error: !!error,
  });

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
      {/* <InfoBox
        stationCount={stations.length}
        viewport={viewport}
        totalStations={allStations.length}
        enableClustering={MAP_CONFIG.ENABLE_CLUSTERING}
      /> */}
    </div>
  );
};

export default StationMap;
