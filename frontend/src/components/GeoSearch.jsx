import { useState } from "react";
import styles from "./GeoSearch.module.css";
import SearchInput from "./shared/SearchInput";
import geolocation from "../assets/icons/geolocation.svg";
import dollar from "../assets/icons/dollar.svg";
import closePrice from "../assets/icons/close_price.svg";
import chevron from "../assets/icons/chevron_thick.svg";

function GeoSearch() {
  const [searchText, setSearchText] = useState("");
  const [showPrice, setShowPrice] = useState(false);
  const [fuelTypeOn, setFuelTypeOn] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  function toggleButton() {
    setShowPrice((prev) => !prev);
  }

  function dropDown() {
    setFuelTypeOn((prev) => !prev);
  }

  const handleSearch = async () => {
    console.log("Searching for:", searchText);
    try {
      const params = new URLSearchParams({
        q: searchText
      });
      const response = await fetch(`http://localhost:4000/api/stations-search/search?${params}`)
      const data = await response.json()
      console.log("Search results:", data)
      setSearchResults(data);

    } catch (err) {
      console.error("Search failed:", err)
    }

    // TODO: trigger map or API logic here
  };

  console.log("searchResults:", searchResults);

  return (
    <div className={styles.geoSearchContainer}>
      <div className={styles.innerContainer}>
        <p className={styles.header}>Search Z stations</p>
        <form onSubmit={(e) => e.preventDefault()}>
          <SearchInput
            value={searchText}
            onChange={setSearchText}
            onEnter={handleSearch}
          />
        </form>
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
