import React from "react";
import styles from "./LoadingState.module.css";

export const LoadingState = () => (
  <div className={styles.loadingContainer}>
    <div className={styles.loadingContent}>
      <div className={styles.spinner}></div>
      <p className={styles.loadingText}>Loading map and stations...</p>
    </div>
  </div>
);
