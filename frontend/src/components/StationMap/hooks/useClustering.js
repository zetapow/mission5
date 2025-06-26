import { useState, useEffect, useRef } from "react";
import Supercluster from "supercluster";
import { MAP_CONFIG } from "/src/constants/mapConstants";

/**
 * Custom hook to cluster nearby stations together
 * Uses Supercluster library to group stations based on zoom level
 */
export const useClustering = (stations, map, mapLoaded) => {
  const [clusters, setClusters] = useState([]);
  const superclusterRef = useRef(null);

  // Convert stations to format that Supercluster can use
  const prepareStationData = (stationList) => {
    return stationList.map((station) => ({
      type: "Feature",
      properties: {
        cluster: false,
        stationId: station._id,
        station: station,
      },
      geometry: {
        type: "Point",
        coordinates: [station.location.longitude, station.location.latitude],
      },
    }));
  };

  // Set up clustering when stations change
  useEffect(() => {
    if (!stations || stations.length === 0) {
      setClusters([]);
      return;
    }

    console.log(`Setting up clustering for ${stations.length} stations...`);

    // Prepare station data for clustering
    const points = prepareStationData(stations);

    // Create clustering engine
    superclusterRef.current = new Supercluster({
      radius: MAP_CONFIG.CLUSTER_RADIUS, // Cluster radius in pixels
      maxZoom: MAP_CONFIG.CLUSTER_MAX_ZOOM, // Stop clustering at this zoom level
      minPoints: MAP_CONFIG.CLUSTER_MIN_POINTS, // Minimum stations needed to form a cluster
    });

    // Load stations into clustering engine
    superclusterRef.current.load(points);
    console.log("Clustering initialized");
  }, [stations]);

  // Update clusters when map view changes
  const updateClusters = () => {
    if (!map || !mapLoaded || !superclusterRef.current) {
      return;
    }

    // Get current map bounds and zoom
    const mapBounds = map.getBounds();
    const currentZoom = Math.floor(map.getZoom());

    // Define the area to get clusters for
    const bbox = [
      mapBounds.getWest(), // left
      mapBounds.getSouth(), // bottom
      mapBounds.getEast(), // right
      mapBounds.getNorth(), // top
    ];

    // Get clusters for current view
    const newClusters = superclusterRef.current.getClusters(bbox, currentZoom);
    setClusters(newClusters);

    console.log(
      `Updated clusters: ${newClusters.length} items at zoom ${currentZoom}`
    );
  };

  // Listen for map changes
  useEffect(() => {
    if (!map || !mapLoaded) return;

    // Update clusters immediately
    updateClusters();

    // Update clusters when map moves or zooms
    map.on("moveend", updateClusters);
    map.on("zoomend", updateClusters);

    // Clean up listeners
    return () => {
      map.off("moveend", updateClusters);
      map.off("zoomend", updateClusters);
    };
  }, [map, mapLoaded, stations]);

  // Function to expand a cluster when clicked
  const getClusterExpansionZoom = (clusterId) => {
    if (!superclusterRef.current) return null;
    return superclusterRef.current.getClusterExpansionZoom(clusterId);
  };

  return {
    clusters, // Current clusters to display
    getClusterExpansionZoom, // Function to expand clusters
  };
};
