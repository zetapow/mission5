const MARKER_CONFIG = {
  DIMENSIONS: {
    WIDTH: 32,
    HEIGHT: 40,
  },
  IMAGE: {
    SRC: "/src/assets/marker-service.png",
    ALT: "Station marker",
  },
  POPUP: {
    OFFSET: [0, -40],
    CLOSE_BUTTON: true,
    CLOSE_ON_CLICK: false,
  },
};

const CSS_CLASSES = {
  MARKER: "custom-station-marker",
};

function createMarkerElement() {
  const element = document.createElement("div");
  element.className = CSS_CLASSES.MARKER;
  element.style.cssText = `
    width: ${MARKER_CONFIG.DIMENSIONS.WIDTH}px;
    height: ${MARKER_CONFIG.DIMENSIONS.HEIGHT}px;
    position: relative;
  `;
  return element;
}

function createMarkerImage() {
  const img = document.createElement("img");
  img.src = MARKER_CONFIG.IMAGE.SRC;
  img.alt = MARKER_CONFIG.IMAGE.ALT;
  img.style.cssText = `
    width: ${MARKER_CONFIG.DIMENSIONS.WIDTH}px;
    height: ${MARKER_CONFIG.DIMENSIONS.HEIGHT}px;
    cursor: pointer;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
  `;
  return img;
}

export function createStationMarker(
  station,
  styles,
  markerServiceIcon,
  maptilersdk,
  activePopupRef
) {
  const el = createMarkerElement();

  // Create image element for the marker
  const img = createMarkerImage();

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
    offset: MARKER_CONFIG.POPUP.OFFSET,
    closeButton: MARKER_CONFIG.POPUP.CLOSE_BUTTON,
    closeOnClick: MARKER_CONFIG.POPUP.CLOSE_ON_CLICK,
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
