// FilterMenu.jsx
import React, { useState } from 'react';
import styles from './FilterMenu.module.css';
import FilterDropdown from './FilterDropDown.jsx';

export default function FilterMenu() {
  // These states will eventually be replaced by props from a parent component.
  // For now, they are initialized as empty arrays.
  const [serviceOptions, setServiceOptions] = useState(["car wash", "trailer hire"]);
  const [fuelOptions, setFuelOptions] = useState([]);
  const [stationTypeOptions, setStationTypeOptions] = useState([]);

  // States for selected items (these remain within FilterMenu as they manage its internal display)
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedStationTypes, setSelectedStationTypes] = useState([]);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState([]);


  // next usestate to hold ALL selections by user, update on click of 'APPLY' button, use contents of selectedServices above.
  

  // Callback functions for the FilterDropdown components
  const handleServiceItemSelect = (option) => {
    setSelectedServices(prevSelected => {
      if (prevSelected.includes(option)) {
        return prevSelected.filter(item => item !== option);
      } else {
        return [...prevSelected, option];
      }
    });
  };

  const handleServiceItemRemove = (itemToRemove) => {
    setSelectedServices(prevSelected =>
      prevSelected.filter(item => item !== itemToRemove)
    );
  };

  const handleStationTypeItemSelect = (option) => {
    setSelectedStationTypes(prevSelected => {
      if (prevSelected.includes(option)) {
        return prevSelected.filter(item => item !== option);
      } else {
        return [...prevSelected, option];
      }
    });
  };

  const handleStationTypeItemRemove = (typeToRemove) => {
    setSelectedStationTypes(prevSelected =>
      prevSelected.filter(item => item !== typeToRemove)
    );
  };

  const handleFuelTypeItemSelect = (option) => {
    setSelectedFuelTypes(prevSelected => {
      if (prevSelected.includes(option)) {
        return prevSelected.filter(item => item !== option);
      } else {
        return [...prevSelected, option];
      }
    });
  };

  const handleFuelTypeItemRemove = (itemToRemove) => {
    setSelectedFuelTypes(prevSelected =>
      prevSelected.filter(item => item !== itemToRemove)
    );
  };


  return (
    <main className={styles.filterMenuBox}>
      <div className={styles.Title}>Filter</div>

      <div className={styles.popularFiltersBox}>
        <p>Popular filters</p>
        <div className={styles.popularFiltersButtons}>
          <button>Car wash</button>
          <button>Open now</button>
          <button>91 Unleaded</button>
        </div>
      </div>

      {/* Reusable FilterDropdown for Services */}
      <FilterDropdown
        title="Services"
        placeholderText="Select Services"
        options={serviceOptions} // Now an empty useState array
        selectedItems={selectedServices}
        onItemSelect={handleServiceItemSelect}
        onItemRemove={handleServiceItemRemove}
      />

      {/* Reusable FilterDropdown for Station Type */}
      <FilterDropdown
        title="Station Type"
        placeholderText="Select Station Type"
        options={stationTypeOptions} // Now an empty useState array
        selectedItems={selectedStationTypes}
        onItemSelect={handleStationTypeItemSelect}
        onItemRemove={handleStationTypeItemRemove}
      />

      {/* Reusable FilterDropdown for Fuel Type */}
      <FilterDropdown
        title="Fuel Type"
        placeholderText="Select Fuel Type"
        options={fuelOptions} // Now an empty useState array
        selectedItems={selectedFuelTypes}
        onItemSelect={handleFuelTypeItemSelect}
        onItemRemove={handleFuelTypeItemRemove}
      />

    </main>
  );
}