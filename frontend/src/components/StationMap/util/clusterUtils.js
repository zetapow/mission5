// Cluster configuration constants
const CLUSTER_CONFIG = {
  SIZES: {
    SMALL_THRESHOLD: 10, // Threshold for small clusters
    MEDIUM_THRESHOLD: 25, // Threshold for medium clusters

    // Sizes for cluster markers based on point count
    SMALL_SIZE: 40,
    MEDIUM_SIZE: 60,
    LARGE_SIZE: 80,
  },
  COLORS: {
    SMALL: "rgba(255, 160, 0, 0.9)", // Base accent color with transparency
    MEDIUM: "rgba(230, 144, 13, 0.95)", // Darker shade with less transparency
    LARGE: "rgba(204, 128, 0, 1)", // Darkest shade for many stations
  },
  FONT_SIZES: {
    SMALL: "12px",
    LARGE: "14px",
  },
};

// Utility functions for cluster markers

export function createClusterMarker(
  cluster,
  maptilersdk,
  map,
  getClusterExpansionZoom
) {
  const { geometry, properties } = cluster;
  const [lng, lat] = geometry.coordinates;
  const { cluster: isCluster, point_count: pointCount } = properties;

  // Replace the magic number logic
  function getClusterSize(pointCount) {
    if (pointCount < CLUSTER_CONFIG.SIZES.SMALL_THRESHOLD)
      return CLUSTER_CONFIG.SIZES.SMALL_SIZE;
    if (pointCount < CLUSTER_CONFIG.SIZES.MEDIUM_THRESHOLD)
      return CLUSTER_CONFIG.SIZES.MEDIUM_SIZE;
    return CLUSTER_CONFIG.SIZES.LARGE_SIZE;
  }

  function getClusterColor(pointCount) {
    if (pointCount < CLUSTER_CONFIG.SIZES.SMALL_THRESHOLD)
      return CLUSTER_CONFIG.COLORS.SMALL;
    if (pointCount < CLUSTER_CONFIG.SIZES.MEDIUM_THRESHOLD)
      return CLUSTER_CONFIG.COLORS.MEDIUM;
    return CLUSTER_CONFIG.COLORS.LARGE;
  }

  // Create cluster element
  function createClusterElement(pointCount) {
    const el = document.createElement("div");
    el.className = "cluster-marker";
    el.innerHTML = `<span>${pointCount}</span>`;

    const size = getClusterSize(pointCount);
    const backgroundColor = getClusterColor(pointCount);
    const fontSize =
      size > 40
        ? CLUSTER_CONFIG.FONT_SIZES.LARGE
        : CLUSTER_CONFIG.FONT_SIZES.SMALL;

    el.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background-color: ${backgroundColor};
      font-size: ${fontSize};
      border-radius: 50%;
      border: none;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `;

    return el;
  }

  function createStationElement() {
    const el = document.createElement("div");
    el.className = "station-marker";
    el.innerHTML = `<img src="/src/assets/marker-service.png" alt="Station" style="width: 32px; height: 40px;" />`;
    el.style.cssText = `width: 32px; height: 40px;`;
    return el;
  }

  const el = isCluster
    ? createClusterElement(pointCount)
    : createStationElement();

  // Create marker
  const marker = new maptilersdk.Marker({
    element: el,
    anchor: "center",
  }).setLngLat([lng, lat]);

  // Click to zoom for cluster markers
  if (isCluster) {
    el.addEventListener("click", () => {
      const expansionZoom = getClusterExpansionZoom(properties.cluster_id);
      if (expansionZoom) {
        map.flyTo({
          center: [lng, lat],
          zoom: expansionZoom,
        });
      }
    });
  }

  return marker;
}

// Add security function
function escapeHtml(text) {
  if (typeof text !== "string") return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

export function createStationPopup(station, maptilersdk) {
  // Validate input
  if (!station || !station.name) {
    const errorContent = `
      <div class="station-popup-error">
        Invalid station data
      </div>
    `;
    return new maptilersdk.Popup({
      offset: 25,
      closeButton: true,
      closeOnClick: true,
    }).setHTML(errorContent);
  }

  // Create clean HTML with CSS classes
  const popupContent = `
    <div class="station-popup">
      <h3 class="station-popup-title">${escapeHtml(station.name)}</h3>
      <p class="station-popup-address">
        ${escapeHtml(station.location?.address || "Address not available")}
      </p>
      ${
        station.location?.city
          ? `
        <p class="station-popup-city">
          ${escapeHtml(station.location.city)}
        </p>
      `
          : ""
      }
    </div>
  `;

  return new maptilersdk.Popup({
    offset: 25,
    closeButton: true,
    closeOnClick: true,
  }).setHTML(popupContent);
}
