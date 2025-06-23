import { useState, useEffect, useCallback, useRef } from "react";
import { fetchStations, filterStationsByBounds } from "../util/fetchStations";

export const useStations = (
  apiUrl,
  bounds = null,
  useViewportFiltering = true
) => {
  const [stations, setStations] = useState([]);
  const [allStations, setAllStations] = useState([]); // Cache all stations
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  // Fetch stations based on viewport bounds
  const fetchStationsInBounds = useCallback(
    async (requestBounds = null) => {
      // Abort previous request if still pending
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        setLoading(true);
        setError(null);

        const options = { signal: controller.signal };

        // Add bounds to request if viewport filtering is enabled and bounds exist
        if (useViewportFiltering && requestBounds) {
          options.bounds = requestBounds;
        }

        const data = await fetchStations(apiUrl, options);

        // Only process if not aborted
        if (!controller.signal.aborted) {
          if (useViewportFiltering && requestBounds) {
            // For viewport-based requests, set stations directly
            setStations(data);
          } else {
            // For initial load, cache all stations and filter client-side
            setAllStations(data);
            setStations(data);
          }
        }
      } catch (err) {
        if (err.name !== "AbortError" && !controller.signal.aborted) {
          console.error("Error fetching stations:", err);
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    },
    [apiUrl, useViewportFiltering]
  );

  // Initial load (get all stations or first viewport)
  useEffect(() => {
    fetchStationsInBounds(bounds);

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [apiUrl]); // Only depend on apiUrl for initial load

  // Handle viewport changes
  useEffect(() => {
    if (bounds && useViewportFiltering) {
      // If we have cached all stations, filter client-side for better performance
      if (allStations.length > 0) {
        const filtered = filterStationsByBounds(allStations, bounds);
        setStations(filtered);
      } else {
        // Otherwise fetch from server with bounds
        fetchStationsInBounds(bounds);
      }
    }
  }, [bounds, allStations, useViewportFiltering, fetchStationsInBounds]);

  return {
    stations,
    allStations,
    loading,
    error,
    refetch: () => fetchStationsInBounds(bounds),
  };
};
