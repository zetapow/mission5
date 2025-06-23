import React from "react";

export const ErrorState = ({ error }) => (
  <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
    <p>Error loading stations: {error}</p>
  </div>
);
