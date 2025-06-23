// Utility functions for creating cluster markers

export function createClusterMarker(
  cluster,
  maptilersdk,
  map,
  getClusterExpansionZoom
) {
  const { geometry, properties } = cluster;
  const [lng, lat] = geometry.coordinates;
  const { cluster: isCluster, point_count: pointCount } = properties;

  // Create cluster element
  const el = document.createElement("div");
  el.className = "cluster-marker";
  if (isCluster) {
    // Cluster marker
    el.innerHTML = `<span>${pointCount}</span>`;

    // Size and color based on point count
    const size = pointCount < 10 ? 30 : pointCount < 25 ? 40 : 50;

    // Color intensity based on cluster size - using accent color (#ffa000) with transparency
    let backgroundColor;
    if (pointCount < 10) {
      backgroundColor = "rgba(255, 160, 0, 0.9)"; // Base accent color with transparency
    } else if (pointCount < 25) {
      backgroundColor = "rgba(230, 144, 13, 0.95)"; // Darker shade with less transparency
    } else {
      backgroundColor = "rgba(204, 128, 0, 1)"; // Darkest shade, fully opaque
    } // Set size and color via inline styles
    el.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background-color: ${backgroundColor};
      border-radius: 50%;
      border: none;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      font-size: ${size > 40 ? "14px" : "12px"};
    `; // Remove hover effects for now to avoid positioning issues
    // el.addEventListener('mouseenter', () => {
    //   el.style.transform = 'translate(-50%, -50%) scale(1.1)';
    //   el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    // });

    // el.addEventListener('mouseleave', () => {
    //   el.style.transform = 'translate(-50%, -50%) scale(1)';
    //   el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    // });

    // Click to zoom
    el.addEventListener("click", () => {
      const expansionZoom = getClusterExpansionZoom(properties.cluster_id);
      if (expansionZoom) {
        map.flyTo({
          center: [lng, lat],
          zoom: expansionZoom,
        });
      }
    });
  } else {
    // Individual station marker
    el.className = "station-marker";
    el.innerHTML = `<img src="/src/assets/marker-service.png" alt="Station" style="width: 32px; height: 40px;" />`;

    el.style.cssText = `
      width: 32px;
      height: 40px;
    `;
  }

  // Create marker
  const marker = new maptilersdk.Marker({
    element: el,
    anchor: "center",
  }).setLngLat([lng, lat]);

  return marker;
}

export function createStationPopup(station, maptilersdk) {
  const popupContent = `
    <div style="padding: 10px; min-width: 200px;">
      <h3 style="margin: 0 0 8px 0; color: #333;">${station.name}</h3>
      <p style="margin: 0 0 4px 0; color: #666;">
        ${station.location?.address || "Address not available"}
      </p>
      ${
        station.location?.city
          ? `
        <p style="margin: 0; color: #666; font-weight: bold;">
          ${station.location.city}
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
