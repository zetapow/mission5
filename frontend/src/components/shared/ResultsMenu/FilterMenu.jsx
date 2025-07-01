import React  from 'react';
import styles from './FilterMenu.module.css';
import FilterDropdown from './FilterDropDown.jsx';
import ApplyTick from '../../../assets/icons/check.svg';
import App from '../../../App.jsx';

export default function FilterMenu({
  onClose,
  // currently 'displayed' results, used to generate dropdown options
  results,
  onApplyFilters,
  currentSelectedServices = [],
  currentSelectedStationTypes = [],
  currentSelectedFuelTypes = []

 }) {

  // states to be populated by search results. (options for dropdowns)
  const [serviceOptions, setServiceOptions] = useState([]);
  const [fuelOptions, setFuelOptions] = useState([]);
  const [stationTypeOptions, setStationTypeOptions] = useState([]);

  // States for selected items (internal to FilterMenu, temporary until 'Apply' is clicked)
  // Initialize from the props, so previously applied filters are shown if menu re-opens
  const [selectedServices, setSelectedServices] = useState(currentSelectedServices);
  const [selectedStationTypes, setSelectedStationTypes] = useState(currentSelectedStationTypes);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState(currentSelectedFuelTypes);


  
  

  // Helper function to extract unique service names
    const extractUniqueServiceNames = (stations) => {
        const uniqueServices = new Set(); 

        if (stations && Array.isArray(stations)) {
            stations.forEach(station => {
                // Check if station.services exists and is an array
                if (station.services && Array.isArray(station.services)) {
                    station.services.forEach(service => {
                        if (service.name) {
                            uniqueServices.add(service.name);
                        }
                    });
                }
            });
        }
        return Array.from(uniqueServices); // Convert Set back to an Array
    };



    // Helper function to extract unique station types
    const extractUniqueStationTypes = (stations) => {
        const uniqueTypes = new Set();
        if (stations && Array.isArray(stations)) {
            stations.forEach(station => {
                if (station.type) { 
                    uniqueTypes.add(station.type);
                }
            });
        }
        return Array.from(uniqueTypes);
    };

    // Helper function to extract unique fuel names
    const extractUniqueFuelNames = (stations) => {
        const uniqueFuels = new Set();
        if (stations && Array.isArray(stations)) {
            stations.forEach(station => {
                if (station.fuels && Array.isArray(station.fuels)) {
                    station.fuels.forEach(fuel => {
                        if (fuel.name) {
                            uniqueFuels.add(fuel.name);
                        }
                    });
                }
            });
        }
        return Array.from(uniqueFuels);
    };


    // useEffect to run the 'extraction' when 'results' change
    useEffect(() => {
        const extractedServices = extractUniqueServiceNames(results);
        setServiceOptions(extractedServices);

        const extractedStationTypes = extractUniqueStationTypes(results);
        setStationTypeOptions(extractedStationTypes); 

        const extractedFuelNames = extractUniqueFuelNames(results);
        setFuelOptions(extractedFuelNames); 

    }, [results]); // rerun when 'results' prop changes


    // Reset selected states when current selected props change
    // handles where filters are applied, menu closes, then a 'new search' is done,
    // and the filter menu re-opens. So previously applied filters match the new context.
    useEffect(() => {
        setSelectedServices(currentSelectedServices);
        setSelectedStationTypes(currentSelectedStationTypes);
        setSelectedFuelTypes(currentSelectedFuelTypes);
    }, [currentSelectedServices, currentSelectedStationTypes, currentSelectedFuelTypes]);

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

  // --- Handle Cancel button click ---
    const handleCancel = () => {
        // Revert to previously applied filters (passed as props)
        setSelectedServices(currentSelectedServices);
        setSelectedStationTypes(currentSelectedStationTypes);
        setSelectedFuelTypes(currentSelectedFuelTypes);
        onClose(); // Close the filter menu
    };

    // --- Handle Apply button click ---
    const handleApply = () => {
        const filtersToApply = {
            services: selectedServices,
            stationTypes: selectedStationTypes,
            fuelTypes: selectedFuelTypes
        };
        onApplyFilters(filtersToApply); // Pass the filters up to ResultsMenu, then App.jsx
        onClose(); // Close the filter menu
    };

    //handlers for popular filter buttons (opening hours unable to implement at this stage ran out of time)
    const handleCarwashClick = () => {
        const carwashService = "Z2O carwash"; // The exact string to add
        setSelectedServices(prevSelected => {
            // Only add if it's not already in the array
            if (!prevSelected.includes(carwashService)) {
                return [...prevSelected, carwashService];
            }
            return prevSelected; // If already includes, return current state (do nothing)
        });
    };

    const handleUnleadedClick = () => {
        const unleadedFuel = "Z91 Unleaded"; // The exact string to add
        setSelectedFuelTypes(prevSelected => {
            // Only add if it's not already in the array
            if (!prevSelected.includes(unleadedFuel)) {
                return [...prevSelected, unleadedFuel];
            }
            return prevSelected; // If already includes, return current state (do nothing)
        });
    };

  return (
    <main className={styles.filterMenuBox}>
      <div className={styles.title}>Filter</div>

      <div className={styles.popularFiltersBox}>
        <p className={styles.popularFiltersTitle}>Popular filters</p>
        <div className={styles.popularFiltersButtons}>
          <button className={styles.carwash} onClick={handleCarwashClick}>Car wash</button>
          <button>Open now</button>
          <button className={styles.unleaded} onClick={handleUnleadedClick}>91 Unleaded</button>
        </div>
      </div>

      {/* Reusable FilterDropdown for Services */}
      <FilterDropdown
        title="Services"
        placeholderText="Select Services"
        options={serviceOptions} 
        selectedItems={selectedServices}
        onItemSelect={handleServiceItemSelect}
        onItemRemove={handleServiceItemRemove}
      />

      {/* Reusable FilterDropdown for Station Type */}
      <FilterDropdown
        title="Station Type"
        placeholderText="Select Station Type"
        options={stationTypeOptions} 
        selectedItems={selectedStationTypes}
        onItemSelect={handleStationTypeItemSelect}
        onItemRemove={handleStationTypeItemRemove}
      />

      {/* Reusable FilterDropdown for Fuel Type */}
      <FilterDropdown
        title="Fuel Type"
        placeholderText="Select Fuel Type"
        options={fuelOptions} 
        selectedItems={selectedFuelTypes}
        onItemSelect={handleFuelTypeItemSelect}
        onItemRemove={handleFuelTypeItemRemove}
      />

      <div className={styles.filterApplyCancelDiv}>
        <button className={styles.cancelButton} onClick={handleCancel}>Cancel</button>
        <button className={styles.applyButton} onClick={handleApply}>
          <img src={ApplyTick} alt="Apply Tick" />
          Apply
        </button>
      </div>

    </main>
  );
}