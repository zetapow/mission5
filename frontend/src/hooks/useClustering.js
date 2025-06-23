import { useState, useEffect, useCallback, useRef } from "react";
import Supercluster from "supercluster";

export const useClustering = (stations, map, mapLoaded) => {
  const [clusters, setClusters] = useState([]);
  const [zoom, setZoom] = useState(6);
  const [bounds, setBounds] = useState(null);
  const superclusterRef = useRef(null);

  // Initialize supercluster
  useEffect(() => {
    if (!stations || stations.length === 0) return;

    // Convert stations to GeoJSON points
    const points = stations.map((station, index) => ({
      type: "Feature",
      properties: {
        cluster: false,
        stationId: station._id,
        station: station,
        index: index,
      },
      geometry: {
        type: "Point",
        coordinates: [
          parseFloat(station.location.longitude),
          parseFloat(station.location.latitude),
        ],
      },
    }));

    // Initialize supercluster
    superclusterRef.current = new Supercluster({
      radius: 40, // Cluster radius in pixels
      maxZoom: 16, // Max zoom to cluster points on
      minZoom: 0, // Min zoom to cluster points on
      minPoints: 2, // Minimum points to form a cluster
    });

    superclusterRef.current.load(points);
    console.log("Supercluster initialized with", points.length, "points");
  }, [stations]);

  // Update clusters when map viewport changes
  const updateClusters = useCallback(() => {
    if (!map || !mapLoaded || !superclusterRef.current) return;

    const mapBounds = map.getBounds();
    const mapZoom = Math.floor(map.getZoom());

    const bbox = [
      mapBounds.getWest(),
      mapBounds.getSouth(),
      mapBounds.getEast(),
      mapBounds.getNorth(),
    ];

    const newClusters = superclusterRef.current.getClusters(bbox, mapZoom);

    setClusters(newClusters);
    setZoom(mapZoom);
    setBounds(bbox);

    console.log(
      `Updated clusters: ${newClusters.length} items at zoom ${mapZoom}`
    );
  }, [map, mapLoaded]);

  // Set up map event listeners
  useEffect(() => {
    if (!map || !mapLoaded) return;

    // Initial update
    updateClusters();

    // Event listeners
    const handleMapMove = () => updateClusters();

    map.on("move", handleMapMove);
    map.on("zoom", handleMapMove);

    return () => {
      map.off("move", handleMapMove);
      map.off("zoom", handleMapMove);
    };
  }, [map, mapLoaded, updateClusters]);

  // Get cluster expansion bounds
  const getClusterExpansionZoom = useCallback((clusterId) => {
    if (!superclusterRef.current) return null;
    return superclusterRef.current.getClusterExpansionZoom(clusterId);
  }, []);

  // Get cluster children
  const getClusterChildren = useCallback((clusterId) => {
    if (!superclusterRef.current) return [];
    return superclusterRef.current.getChildren(clusterId);
  }, []);

  return {
    clusters,
    zoom,
    bounds,
    updateClusters,
    getClusterExpansionZoom,
    getClusterChildren,
  };
};
