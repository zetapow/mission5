import React from "react";
import styles from "./ErrorState.module.css";

export const ErrorState = ({ error }) => (
  <div className={styles.errorContainer}>
    <p className={styles.errorMessage}>Error loading stations: {error}</p>
  </div>
);
