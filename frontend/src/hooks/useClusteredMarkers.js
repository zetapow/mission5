import { useRef, useCallback, useEffect } from "react";
import { createClusterMarker, createStationPopup } from "../util/clusterUtils";
import { error } from "node:console";

export const useClusteredMarkers = (
  map,
  mapLoaded,
  clusters,
  maptilersdk,
  getClusterExpansionZoom
) => {
  const markersRef = useRef([]);
  const activePopupRef = useRef(null);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((marker) => {
      try {
        marker.remove();
      } catch (err) {
        console.warn("Error removing marker:", error);
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

  const updateClusteredMarkers = useCallback(() => {
    if (!map || !mapLoaded || !clusters || clusters.length === 0) return;

    clearMarkers();
    clearActivePopup();

    clusters.forEach((cluster) => {
      const { properties } = cluster;
      const { cluster: isCluster } = properties;

      // Create marker (cluster or individual)
      const marker = createClusterMarker(
        cluster,
        maptilersdk,
        map,
        getClusterExpansionZoom
      );

      // Add popup for individual stations
      if (!isCluster && properties.station) {
        const popup = createStationPopup(properties.station, maptilersdk);
        marker.setPopup(popup);

        // Handle popup events
        marker.getElement().addEventListener("click", () => {
          clearActivePopup();
          activePopupRef.current = popup;
        });

        popup.on("close", () => {
          if (activePopupRef.current === popup) {
            activePopupRef.current = null;
          }
        });
      }

      marker.addTo(map);
      markersRef.current.push(marker);
    });

    console.log(`Added ${clusters.length} clustered markers to map`);
  }, [
    map,
    mapLoaded,
    clusters,
    maptilersdk,
    getClusterExpansionZoom,
    clearMarkers,
    clearActivePopup,
  ]);

  useEffect(() => {
    updateClusteredMarkers();
  }, [updateClusteredMarkers]);

  return { updateClusteredMarkers, clearMarkers };
};
