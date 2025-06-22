import React from "react";
import styles from "./SearchInput.module.css";

export default function SearchInput({ value, onChange, loading }) {
  return (
    <>
      <input
        type="text"
        className={styles.input}
        value={value}
        onChange={onChange}
        placeholder="Enter a location..."
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !value}
        className={styles.button}>
        {loading ? "Loading..." : "Search"}
      </button>
    </>
  );
}
