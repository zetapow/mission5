import React, { useRef, useEffect, useState } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";

const SimpleMapTest = () => {
  const mapContainer = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const apiKey = import.meta.env.VITE_MAPTILER_API;

  useEffect(() => {
    console.log("Simple map test - API Key:", apiKey ? "Present" : "Missing");

    if (!apiKey) {
      console.error("No API key!");
      return;
    }

    if (!mapContainer.current) {
      console.error("No container!");
      return;
    }

    console.log("Creating simple map...");

    maptilersdk.config.apiKey = apiKey;

    const map = new maptilersdk.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${apiKey}`,
      center: [174.7645, -36.8485],
      zoom: 6,
    });

    map.on("load", () => {
      console.log("Simple map loaded!");
      setMapLoaded(true);
    });

    map.on("error", (e) => {
      console.error("Simple map error:", e);
    });

    return () => {
      map.remove();
    };
  }, [apiKey]);

  if (!apiKey) {
    return <div style={{ padding: "20px", color: "red" }}>Missing API Key</div>;
  }

  return (
    <div style={{ width: "100%", height: "500px", border: "1px solid red" }}>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          background: "white",
          padding: "5px",
        }}>
        Map Loaded: {mapLoaded ? "Yes" : "No"}
      </div>
    </div>
  );
};

export default SimpleMapTest;
