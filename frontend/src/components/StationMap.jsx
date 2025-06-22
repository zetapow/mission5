import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
// import Supercluster from "supercluster"; // COMMENTED OUT FOR LAZY LOADING
import markerServiceIcon from "../assets/marker-service.png";
// import areaPinIcon from "../assets/icons/area_pin.svg"; // COMMENTED OUT FOR LAZY LOADING

const StationMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  // const clusterRef = useRef(null); // COMMENTED OUT FOR LAZY LOADING
  const activePopupRef = useRef(null);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapError, setMapError] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(6);
  // const [loadedBounds, setLoadedBounds] = useState(null); // COMMENTED OUT - LAZY LOADING
  // const [isLoadingStations, setIsLoadingStations] = useState(false); // COMMENTED OUT - LAZY LOADING// Get API key and log for debugging
  const apiKey = import.meta.env.VITE_MAPTILER_API_KEY;
  console.log("MapTiler API Key:", apiKey ? "Present" : "Missing");

  // Ref callback to ensure container is available
  const setMapContainer = useCallback((node) => {
    if (node !== null) {
      console.log("Map container ref set:", node);
      mapContainer.current = node;
    }
  }, []); // Create custom station marker element
  const createStationMarker = (station) => {
    const el = document.createElement("div");
    el.className = "custom-station-marker";
    el.style.cssText = `
      width: 32px;
      height: 40px;
      background-image: url(${markerServiceIcon});
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      cursor: pointer;
      display: block;
      pointer-events: auto;
    `;

    return el;
  };

  /* COMMENTED OUT FOR LAZY LOADING - NO CLUSTERING
  // Create cluster marker element
  const createClusterMarker = (count) => {
    const el = document.createElement("div");
    el.className = "custom-cluster-marker";
    el.style.cssText = `
      width: 50px;
      height: 60px;
      background-image: url(${areaPinIcon});
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      cursor: pointer;
      position: relative;
      display: block;
      pointer-events: auto;
    `;

    // Create simple count overlay
    const countEl = document.createElement("div");
    countEl.style.cssText = `
      position: absolute;
      top: 35%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #FF6B35;
      color: white;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
      border: 2px solid white;
      pointer-events: none;
    `;
    countEl.textContent = count;
    el.appendChild(countEl);

    return el;
  };
  */
  // Update markers - simplified for lazy loading (no clustering)
  const updateMarkers = useCallback(() => {
    if (!map.current || !mapLoaded) {
      console.log(
        "UpdateMarkers skipped - Map:",
        !!map.current,
        "MapLoaded:",
        mapLoaded
      );
      return;
    }

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      try {
        marker.remove();
      } catch (e) {
        console.warn("Error removing marker:", e);
      }
    });
    markersRef.current = [];

    // Clear any active popup
    if (activePopupRef.current) {
      try {
        activePopupRef.current.remove();
        activePopupRef.current = null;
      } catch (e) {
        console.warn("Error removing active popup:", e);
      }
    }

    console.log(`Creating ${stations.length} individual station markers`);

    // Create marker for each station (no clustering)
    stations.forEach((station) => {
      const lng = parseFloat(station.location.longitude);
      const lat = parseFloat(station.location.latitude);

      if (isNaN(lng) || isNaN(lat)) {
        console.warn(
          "Invalid coordinates for station:",
          station.name,
          lng,
          lat
        );
        return;
      }

      const el = createStationMarker(station);
      const marker = new maptilersdk.Marker({
        element: el,
        anchor: "bottom",
        offset: [0, 0],
      })
        .setLngLat([lng, lat])
        .addTo(map.current);

      // Create popup for station
      const popup = new maptilersdk.Popup({
        offset: [0, -40],
        closeButton: true,
        closeOnClick: false,
      }).setHTML(`
        <div style="padding: 10px; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; color: #FF6B35; font-size: 16px;">
            ${station.name}
          </h3>
          <div style="font-size: 12px; color: #666;">
            <p style="margin: 2px 0;"><strong>Latitude:</strong> ${lat.toFixed(
              6
            )}</p>
            <p style="margin: 2px 0;"><strong>Longitude:</strong> ${lng.toFixed(
              6
            )}</p>
            ${
              station.location?.address
                ? `<p style="margin: 2px 0;"><strong>Address:</strong> ${station.location.address}</p>`
                : ""
            }
            ${
              station.location?.suburb
                ? `<p style="margin: 2px 0;"><strong>Suburb:</strong> ${station.location.suburb}</p>`
                : ""
            }
          </div>
        </div>
      `);

      marker.setPopup(popup);

      // Add click handler to ensure only one popup is open
      el.addEventListener("click", () => {
        // Close any existing active popup
        if (activePopupRef.current && activePopupRef.current !== popup) {
          activePopupRef.current.remove();
        }
        // Set this popup as the active one
        activePopupRef.current = popup;
      });

      // Listen for popup close to clear the active reference
      popup.on("close", () => {
        if (activePopupRef.current === popup) {
          activePopupRef.current = null;
        }
      });

      markersRef.current.push(marker);
    });

    console.log(`Updated map with ${stations.length} individual markers`);
  }, [stations, mapLoaded]); /* COMMENTED OUT FOR LAZY LOADING - NO CLUSTERING
  // Initialize cluster
  useEffect(() => {
    if (stations.length > 0) {
      const cluster = new Supercluster({
        radius: 40,
        maxZoom: 14, // Clusters separate at zoom 15+
        minZoom: 0,
        minPoints: 2,
      });

      // Convert stations to GeoJSON features
      const points = stations
        .map((station) => ({
          type: "Feature",
          properties: {
            cluster: false,
            stationId: station._id,
            name: station.name,
          },
          geometry: {
            type: "Point",
            coordinates: [
              parseFloat(station.location.longitude),
              parseFloat(station.location.latitude),
            ],
          },
        }))
        .filter(
          (point) =>
            !isNaN(point.geometry.coordinates[0]) &&
            !isNaN(point.geometry.coordinates[1])
        );
      cluster.load(points);
      clusterRef.current = cluster;

      console.log(`Cluster initialized with ${points.length} points`);

      // Update markers immediately after cluster is initialized
      if (mapLoaded) {
        updateMarkers();
      }
    }
  }, [stations, mapLoaded, updateMarkers]);
  */  /* COMMENTED OUT - LAZY LOADING
  // Debounce function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Function to load stations for the current viewport
  const loadStationsForViewport = useCallback(async () => {
    if (!map.current || !mapLoaded || isLoadingStations) {
      console.log(
        "Skipping station load - Map:",
        !!map.current,
        "MapLoaded:",
        mapLoaded,
        "IsLoading:",
        isLoadingStations
      );
      return;
    }

    const bounds = map.current.getBounds();
    const bbox = {
      west: bounds.getWest(),
      south: bounds.getSouth(),
      east: bounds.getEast(),
      north: bounds.getNorth(),
    };

    // Check if we need to load data (expand bounds slightly to avoid too many requests)
    const buffer = 0.01; // ~1km buffer
    if (
      loadedBounds &&
      bbox.west >= loadedBounds.west + buffer &&
      bbox.south >= loadedBounds.south + buffer &&
      bbox.east <= loadedBounds.east - buffer &&
      bbox.north <= loadedBounds.north - buffer
    ) {
      console.log("Viewport already loaded, skipping fetch");
      return;
    }

    setIsLoadingStations(true);
    console.log("Loading stations for viewport:", bbox);

    try {
      const response = await fetch(
        `http://localhost:4000/api/stations/viewport?west=${bbox.west}&south=${bbox.south}&east=${bbox.east}&north=${bbox.north}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Loaded ${data.length} stations for current viewport`);

      setStations(data);
      setLoadedBounds(bbox);
    } catch (err) {
      console.error("Error loading stations for viewport:", err);
      setError(err.message);
    } finally {
      setIsLoadingStations(false);
    }
  }, [mapLoaded, isLoadingStations, loadedBounds]);

  // Debounced version of the function
  const debouncedLoadStations = useMemo(
    () => debounce(loadStationsForViewport, 300),
    [loadStationsForViewport]
  );

  // Initial load when map becomes available
  useEffect(() => {
    if (mapLoaded && !isLoadingStations && stations.length === 0) {
      console.log("Map loaded but no stations - triggering initial load");
      setLoading(false); // Set loading to false once map is ready
      loadStationsForViewport();
    }
  }, [mapLoaded, isLoadingStations, stations.length, loadStationsForViewport]);
  */
  // Fetch stations from backend
  useEffect(() => {
    const fetchStations = async () => {
      try {
        console.log("Fetching stations...");
        const response = await fetch("http://localhost:4000/api/stations");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(`Fetched ${data.length} stations`);
        setStations(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching stations:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  /* COMMENTED OUT - REPLACED WITH NORMAL LOADING
  // Initial load - load stations for initial viewport
  useEffect(() => {
    if (mapLoaded) {
      console.log("Map loaded, loading initial stations for viewport");
      loadStationsForViewport();
      setLoading(false); // Set loading to false once map is ready
    }
  }, [mapLoaded, loadStationsForViewport]);
  */

  /* COMMENTED OUT - REPLACED WITH NORMAL LOADING
  // Fetch stations from backend
  useEffect(() => {
    const fetchStations = async () => {
      try {
        console.log("Fetching stations...");
        const response = await fetch("http://localhost:4000/api/stations");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(`Fetched ${data.length} stations`);
        setStations(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching stations:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStations();
  }, []);
  */// Initialize map - simplified approach
  useEffect(() => {
    let isMounted = true;

    const initMap = () => {
      if (!isMounted || map.current || !mapContainer.current) {
        return;
      }

      try {
        console.log("Initializing map with container:", mapContainer.current);

        // Set API key
        maptilersdk.config.apiKey = apiKey;

        // Create map
        map.current = new maptilersdk.Map({
          container: mapContainer.current,
          style: maptilersdk.MapStyle.STREETS,
          center: [174.7645, -36.8485], // Auckland, NZ
          zoom: 6,
        });        map.current.on("load", () => {
          if (isMounted) {
            console.log("Map loaded successfully");
            setMapLoaded(true);
            // Removed lazy loading call - stations will be loaded via useEffect
          }
        });
          map.current.on("zoom", () => {
          if (isMounted) {
            const zoom = map.current.getZoom();
            setCurrentZoom(zoom);
            // Removed lazy loading call
          }
        });

        map.current.on("moveend", () => {
          if (isMounted) {
            // Removed lazy loading call
          }
        });

        map.current.on("error", (e) => {
          if (isMounted) {
            console.error("Map error:", e);
            setMapError(e.error?.message || "Map initialization failed");
          }
        });
      } catch (err) {
        if (isMounted) {
          console.error("Error creating map:", err);
          setMapError(err.message);
        }
      }
    };

    // Initialize immediately if container is ready, otherwise wait a bit
    if (mapContainer.current) {
      initMap();
    } else {
      const timeoutId = setTimeout(initMap, 100);
      return () => {
        clearTimeout(timeoutId);
        isMounted = false;
      };
    }

    // Cleanup
    return () => {
      isMounted = false;
      if (map.current) {
        try {
          map.current.remove();
        } catch (e) {
          console.error("Error removing map:", e);
        }
        map.current = null;
      }    };
  }, [apiKey]); // Removed lazy loading dependencies
  useEffect(() => {
    console.log(
      "Marker effect running - MapLoaded:",
      mapLoaded,
      "Stations:",
      stations.length
    );

    if (mapLoaded && stations.length > 0) {
      console.log("Both map and stations ready - updating markers");
      updateMarkers();
    }
  }, [mapLoaded, stations, updateMarkers]);

  // Render loading state
  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Loading stations...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
        <p>Error loading stations: {error}</p>
      </div>
    );
  }

  // Render map error state
  if (mapError) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
        <p>Map Error: {mapError}</p>
        <p>Please check your MapTiler API key in .env file</p>
      </div>
    );
  }
  return (
    <div style={{ width: "100%", height: "500px", border: "1px solid #ccc" }}>
      {console.log("Rendering map container")}
      <div
        ref={setMapContainer}
        style={{ width: "100%", height: "100%" }}
        id="map-container"
      />
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          background: "rgba(255,255,255,0.95)",
          padding: "8px 12px",
          borderRadius: "6px",
          fontSize: "12px",
          zIndex: 1000,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          border: "1px solid #ddd",
        }}>
        {" "}        <div
          style={{ color: "#FF6B35", fontWeight: "bold", marginBottom: "2px" }}>
          Z Energy Stations
        </div>
        <div style={{ color: "#666" }}>
          {stations.length} stations loaded
        </div>
        <div style={{ color: "#666", fontSize: "10px" }}>
          Zoom: {currentZoom.toFixed(1)} | Individual Markers
        </div>
      </div>
    </div>
  );
};

export default StationMap;
