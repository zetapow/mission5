import { useState } from "react";
import styles from "./GeoSearch.module.css"; // Assuming you have a CSS file for styles

import geolocation from "../assets/icons/geolocation.svg";
import { geocode } from "../util/geocodeApi";
import SearchInput from "./shared/SearchInput";

function GeoSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!query) return;
    setLoading(true);
    setResults(null);
    setError(null);

    try {
      const data = await geocode(query);
      setResults(data);
    } catch (error) {
      setResults({ error: "Failed to fetch geocoding data." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.geoSearchContainer}>
      <p>Search Z stations</p>
      <form onSubmit={handleSearch}>
        <SearchInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          loading={loading}
        />
      </form>
      <pre className={styles.results}>
        {results && JSON.stringify(results, null, 2)}
      </pre>
      <div className={styles.current_location}>
        <img src={geolocation} alt="geolocation" />
        <p>Use my current location</p>
      </div>
    </div>
  );
}

export default GeoSearch;
