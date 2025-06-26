import { useEffect, useState } from "react";
import styles from "./SearchSuggestions.module.css";
import pin_area from "../assets/icons/pin_area.svg";
import car_bubbles from "../assets/icons/car_bubbles.svg";
import station_icon from "../assets/icons/station.svg";

const SearchSuggestions = ({ searchText, searchResults, onSelect }) => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!searchText.trim()) {
      setSuggestions([]);
      return;
    }

    const tempSuggestions = [];

    searchResults.forEach((station) => {
      const suburb = station.location?.suburb;
      const city = station.location?.city;
      const region = station.location?.region;

      // locations
      if (suburb) {
        tempSuggestions.push({ type: "location", label: suburb });
      }
      if (city) {
        tempSuggestions.push({ type: "location", label: city });
      }
      if (region) {
        tempSuggestions.push({ type: "location", label: region });
      }

      // Station name
      tempSuggestions.push({ type: "station", label: station.name });

      station.services?.forEach((service) => {
        if (service.name?.toLowerCase() === "z2o carwash") {
          tempSuggestions.push({ type: "service", label: "Car Wash" });

          if (suburb) {
            tempSuggestions.push({
              type: "service-location",
              label: `${suburb} Car Wash`,
            });
          }

          if (city && city !== suburb) {
            tempSuggestions.push({
              type: "service-location",
              label: `${city} Car Wash`,
            });
          }
        }
      });
    });

    // Remove duplicates
    const uniqueSuggestions = Array.from(
      new Map(
        tempSuggestions.map((item) => [item.label.toLowerCase(), item])
      ).values()
    );

    // filter by user input
    const filtered = uniqueSuggestions.filter((item) => {
      const normalizedLabel = item.label.toLowerCase().replace(/\s+/g, "");
      const normalizedInput = searchText.toLowerCase().replace(/\s+/g, "");

      return normalizedLabel.includes(normalizedInput);
    });

    setSuggestions(filtered);
  }, [searchText, searchResults]);

  if (!suggestions.length) return null;

  return (
    <div className={styles.dropDown}>
      {suggestions.map((item) => (
        <div
          key={item.label}
          className={styles.dropDownItem}
          onClick={() => onSelect(item)}
        >
          {item.label}
          <img
            src={
              item.type === "location"
                ? pin_area
                : item.type === "service" || item.type === "service-location"
                ? car_bubbles
                : station_icon
            }
            alt={item.type}
            className={styles.icon}
          />
        </div>
      ))}
    </div>
  );
};

export default SearchSuggestions;
