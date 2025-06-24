import React from "react";
import styles from "./StationMap.module.css";

export const InfoBox = ({
  stationCount,
  viewport,
  totalStations,
  enableClustering = false,
}) => (
  <div className={styles.infoBox}>
    <div className={styles.infoTitle}>Z Energy Stations</div>
    <div className={styles.infoText}>
      {stationCount} stations in view
      {totalStations && totalStations !== stationCount && (
        <span style={{ opacity: 0.7 }}> of {totalStations} total</span>
      )}
    </div>
    <div className={styles.infoSmall}>
      {viewport && (
        <>
          Zoom: {viewport.zoom.toFixed(1)} | Lat:{" "}
          {viewport.center.lat.toFixed(4)}, Lng:{" "}
          {viewport.center.lng.toFixed(4)}
        </>
      )}
      {!viewport &&
        (enableClustering ? "Clustered Markers" : "Individual Markers")}
    </div>
  </div>
);
