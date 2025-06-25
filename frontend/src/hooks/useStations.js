import { useState, useEffect } from "react";

/**
 * Custom hook to fetch station data from the API
 * Can filter stations by map bounds for better performance
 */
export const useStations = (
  apiUrl,
  bounds = null,
  useViewportFiltering = true
) => {
  const [stations, setStations] = useState([]);
  const [allStations, setAllStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch stations from API
  const fetchStations = async (requestBounds = null) => {
    try {
      setLoading(true);
      setError(null);

      // Build API URL with optional bounds filtering
      let url = apiUrl;
      if (useViewportFiltering && requestBounds) {
        const params = new URLSearchParams({
          north: requestBounds.north,
          south: requestBounds.south,
          east: requestBounds.east,
          west: requestBounds.west,
        });
        url += `?${params.toString()}`;
      }

      console.log("Fetching stations from:", url);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (useViewportFiltering && requestBounds) {
        // For viewport requests, update current stations
        setStations(data);
      } else {
        // For initial load, save all stations
        setAllStations(data);
        setStations(data);
      }

      console.log(`Loaded ${data.length} stations`);
    } catch (err) {
      console.error("Error fetching stations:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  // Filter stations by bounds (client-side)
  const filterStationsByBounds = (stationList, filterBounds) => {
    return stationList.filter((station) => {
      const lng = station.location.longitude;
      const lat = station.location.latitude;

      return (
        lng >= filterBounds.west &&
        lng <= filterBounds.east &&
        lat >= filterBounds.south &&
        lat <= filterBounds.north
      );
    });
  };

  // Initial load - fetch all stations
  useEffect(() => {
    fetchStations();
  }, [apiUrl]);

  // Update stations when map bounds change
  useEffect(() => {
    if (!bounds) return;

    if (useViewportFiltering) {
      if (allStations.length > 0) {
        // Filter existing stations (faster)
        const filtered = filterStationsByBounds(allStations, bounds);
        setStations(filtered);
        console.log(`Filtered to ${filtered.length} stations in viewport`);
      } else {
        // Fetch from server (first time)
        fetchStations(bounds);
      }
    }
  }, [bounds, allStations, useViewportFiltering]);

  return {
    stations, // Stations currently shown
    allStations, // All stations (cached)
    loading, // Is loading data?
    error, // Any error message
  };
};
