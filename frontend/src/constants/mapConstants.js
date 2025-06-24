/**
 *
 * This file contains all configuration settings for the MapTiler-based station map.
 * Modify these values to customize map behavior, performance, and appearance.
 */

export const MAP_CONFIG = {
  // Map Initial Position
  // DEFAULT_CENTER: [174.7645, -36.8485], // Auckland, NZ coordinates [longitude, latitude]
  DEFAULT_CENTER: [175.2528, -37.7826], // Hamilton, NZ coordinates [longitude, latitude]

  // Initial zoom level when map loads (higher = more zoomed in)
  DEFAULT_ZOOM: 10,

  // Backend API endpoint for fetching station data
  API_BASE_URL: "http://localhost:4000/api",

  // Performance settings - optimize map rendering and data loading
  MAX_ZOOM: 14, // Maximum zoom level users can reach
  MIN_ZOOM: 3, // Minimum zoom level (higher = can't zoom out too far)
  TILE_SIZE: 512, // Map tile size in pixels - larger tiles = fewer requests but more data per request

  // Viewport settings - controls how map responds to user interaction
  VIEWPORT_DEBOUNCE_MS: 300, // Wait time in milliseconds before processing viewport changes (prevents excessive API calls)
  ENABLE_VIEWPORT_FILTERING: true, // Only load stations visible in current map view (improves performance)
  VIEWPORT_PADDING: 0.1, // Extra area around visible map to preload stations (0.1 = 10% padding)

  // Clustering settings - groups nearby stations together for better performance and UX
  ENABLE_CLUSTERING: true, // Turn marker clustering on/off
  CLUSTER_RADIUS: 40, // Distance in pixels within which stations get grouped into clusters
  CLUSTER_MAX_ZOOM: 16, // Stop clustering at this zoom level (users can see individual stations)
  CLUSTER_MIN_POINTS: 2, // Minimum number of stations required to form a cluster
};

/**
 * Map Style Options
 *
 * MapTiler provides different visual styles for the map.
 * Change the style in your map component to use different appearances.
 */
export const MAP_STYLES = {
  STREETS: "streets-v2", // Standard street map view (v2 is performance optimized)
  SATELLITE: "satellite", // Satellite imagery view
  OUTDOOR: "outdoor", // Topographical/outdoor activity focused view
};

/**

 * Preload these resources to improve initial map loading speed.
 * These are font files used by the map for labels and text.
 */
// export const PRELOAD_RESOURCES = [
//   "https://api.maptiler.com/fonts/Open%20Sans%20Regular/0-255.pbf",
//   "https://api.maptiler.com/fonts/Open%20Sans%20Bold/0-255.pbf",
// ];
