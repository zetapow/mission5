import { useState } from "react";
import styles from "./GeoSearch.module.css";
import SearchInput from "./shared/SearchInput";
import geolocation from "../assets/icons/geolocation.svg";
import dollar from "../assets/icons/dollar.svg";
import closePrice from "../assets/icons/close_price.svg";
import chevron from "../assets/icons/chevron_thick.svg";
import SearchSuggestions from "./SearchSuggestions";

// props to lift-state of search results to App.jsx
function GeoSearch({
  searchText,
  onSearchTextChange,
  onSearchResults,
  onLoading,
  onError,
}) {
  //searchText state now handled by App.jsx so can be passed to other components in App.jsx
  const [showPrice, setShowPrice] = useState(false);
  const [fuelTypeOn, setFuelTypeOn] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  function toggleButton() {
    setShowPrice((prev) => !prev);
  }

  function dropDown() {
    setFuelTypeOn((prev) => !prev);
  }

  const fetchSearchResults = async (input) => {
    console.log("Searching for:", input);
    if (!input.trim()) {
      setSearchResults([]);
      if (onSearchResults) onSearchResults([]);
      return;
    }
    //potential loading and error messages to show user for search
    if (onLoading) onLoading(true);
    if (onError) onError(null);

    try {
      const params = new URLSearchParams({
        q: input,
      });
      const response = await fetch(
        `http://localhost:4000/api/stations-search/search?${params}`
      );
      const data = await response.json();
      console.log("Search results:", data);
      setSearchResults(data);
      if (onSearchResults) onSearchResults(data);
    } catch (err) {
      console.error("Search failed:", err);
      if (onError) onError(err.message || "Failed to fetch search results.");
      setSearchResults([]);
      if (onSearchResults) onSearchResults([]);
    } finally {
      if (onLoading) onLoading(false);
    }
  };

  const handleSearchInputChange = (value) => {
    onSearchTextChange(value)
    fetchSearchResults(value)
  }

  const handleSearch = () => {
    fetchSearchResults(searchText)
  }

  console.log("searchResults:", searchResults);

  return (
    <div className={styles.geoSearchContainer}>
      <div className={styles.innerContainer}>
        <p className={styles.header}>Search Z stations</p>
        <div className={styles.searchWrapper}>
          <SearchInput
            value={searchText}
            onChange={handleSearchInputChange}
            onEnter={handleSearch}
          />
          <SearchSuggestions
            searchText={searchText}
            searchResults={searchResults}
            onSelect={(item) => {
              console.log("User selected:", item, searchText);
              onSearchTextChange(item.label);
              fetchSearchResults(item.label);
            }}
          />
        </div>

        <div className={styles.currentLocation}>
          <img
            className={styles.geolocationIcon}
            src={geolocation}
            alt="geolocation"
          />
          <p className={styles.locationText}>Use my current location</p>
        </div>
        <div
          className={showPrice ? styles.hideContainer : styles.showContainer}
        >
          <div
            className={showPrice ? styles.hidePrice : styles.showPrice}
            onClick={toggleButton}
          >
            {showPrice ? (
              <div className={styles.right}>
                <p className={styles.closePriceText}>Hide Price</p>
                <img
                  src={closePrice}
                  alt="close-price-icon"
                  className={styles.closePrice}
                />
              </div>
            ) : (
              <div className={styles.left}>
                <img src={dollar} alt="dollar-icon" className={styles.dollar} />
                <p className={styles.priceText}>Show Price</p>
              </div>
            )}
          </div>
          {showPrice ? (
            <div className={styles.fuelWrapper}>
              <div className={styles.fueltype} onClick={dropDown}>
                <p className={styles.fuelText}>Fuel Type</p>
                <img className={styles.chevron} src={chevron} alt="chevron" />
              </div>
              {fuelTypeOn ? (
                <div className={styles.dropDown}>
                  <p>Z91 Unleaded</p>
                  <p>ZX Premium</p>
                  <p>Z Diesel</p>
                </div>
              ) : (
                ""
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default GeoSearch;
