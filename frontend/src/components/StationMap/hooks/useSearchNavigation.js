import { useEffect } from "react";
import * as maptilersdk from "@maptiler/sdk";

export const useSearchNavigation = (map, mapLoaded, searchResults) => {
  useEffect(() => {
    if (!map || !mapLoaded || searchResults.length === 0) return;

    const coordinates = searchResults
      .filter(
        (station) => station.location?.latitude && station.location?.longitude
      )
      .map((station) => [
        station.location.longitude,
        station.location.latitude,
      ]);

    if (coordinates.length === 0) return;

    if (coordinates.length === 1) {
      map.flyTo({ center: coordinates[0], zoom: 14, duration: 1000 });
    } else {
      const bounds = coordinates.reduce(
        (bounds, coord) => bounds.extend(coord),
        new maptilersdk.LngLatBounds(coordinates[0], coordinates[0])
      );
      map.fitBounds(bounds, { padding: 50, duration: 1000, maxZoom: 15 });
    }
  }, [map, mapLoaded, searchResults]);
};
