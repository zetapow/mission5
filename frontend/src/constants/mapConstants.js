export const MAP_CONFIG = {
  DEFAULT_CENTER: [174.7645, -36.8485], // Auckland, NZ
  DEFAULT_ZOOM: 6,
  API_BASE_URL: "http://localhost:4000/api",
  // Performance settings
  MAX_ZOOM: 18,
  MIN_ZOOM: 3,
  TILE_SIZE: 512, // Larger tiles = fewer requests
  // Viewport settings
  VIEWPORT_DEBOUNCE_MS: 300, // Debounce viewport changes
  ENABLE_VIEWPORT_FILTERING: true, // Enable viewport-based loading
  VIEWPORT_PADDING: 0.1, // Padding around viewport bounds (10%)
  // Clustering settings
  ENABLE_CLUSTERING: true, // Enable marker clustering
  CLUSTER_RADIUS: 40, // Cluster radius in pixels
  CLUSTER_MAX_ZOOM: 16, // Max zoom to cluster points
  CLUSTER_MIN_POINTS: 2, // Minimum points to form cluster
};

export const MAP_STYLES = {
  STREETS: "streets-v2", // v2 is optimized for performance
  SATELLITE: "satellite",
  OUTDOOR: "outdoor",
};

// Preload critical map resources
export const PRELOAD_RESOURCES = [
  "https://api.maptiler.com/fonts/Open%20Sans%20Regular/0-255.pbf",
  "https://api.maptiler.com/fonts/Open%20Sans%20Bold/0-255.pbf",
];
