export function createStationMarker(
  station,
  styles,
  markerServiceIcon,
  maptilersdk,
  activePopupRef
) {
  const el = document.createElement("div");
  el.className = "custom-station-marker";
  el.style.cssText = `
    width: 32px;
    height: 40px;
    position: relative;
  `;

  // Create image element for the marker
  const img = document.createElement("img");
  img.src = "/src/assets/marker-service.png";
  img.alt = "Station";
  img.style.cssText = `
    width: 32px;
    height: 40px;
    cursor: pointer;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
  `;

  el.appendChild(img);

  const marker = new maptilersdk.Marker({
    element: el,
    anchor: "bottom",
    offset: [0, 0],
  }).setLngLat([
    parseFloat(station.location.longitude),
    parseFloat(station.location.latitude),
  ]);

  // Create popup for station
  const popupContent = document.createElement("div");
  popupContent.className = styles.stationPopup;

  const title = document.createElement("h3");
  title.className = styles.stationPopupTitle;
  title.textContent = station.name;
  popupContent.appendChild(title);

  const text = document.createElement("div");
  text.className = styles.stationPopupText;
  text.innerHTML = `
    ${station.location?.address ? `<p>${station.location.address}</p>` : ""}
    ${
      station.location?.suburb
        ? `<p><strong>${station.location.suburb}</strong></p>`
        : ""
    }
    ${
      station.location?.city
        ? `<p><strong>${station.location.city}</strong></p>`
        : ""
    }
  `;
  popupContent.appendChild(text);

  const popup = new maptilersdk.Popup({
    offset: [0, -40],
    closeButton: true,
    closeOnClick: false,
  }).setDOMContent(popupContent);

  marker.setPopup(popup);

  el.addEventListener("click", () => {
    if (activePopupRef.current && activePopupRef.current !== popup) {
      activePopupRef.current.remove();
    }
    activePopupRef.current = popup;
  });

  popup.on("close", () => {
    if (activePopupRef.current === popup) {
      activePopupRef.current = null;
    }
  });

  return marker;
}
