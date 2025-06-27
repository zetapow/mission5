import "./App.css";
import Test from "./components/Test";
import GeoSearch from "./components/GeoSearch";
import StationMap from "./components/StationMap/StationMap";
import Header from "./components/shared/Header/Header";
import Footer from "./components/shared/Footer/Footer";
import ResultsMenu from "./components/shared/ResultsMenu/ResultsMenu";
import { useState, useEffect, useMemo } from "react";
import { LoadingState } from "./components/StationMap/LoadingState";

function App() {
  // "lifted-states from Geosearch so that they can be used in StationMap and ResultsMenu"
  // loading and error to show messages to user if needed
  const [searchResults, setSearchResults] = useState([]); //raw results from API
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");

  //check if a search has been attempted to help with conditional render of ResultsMenu on search
  const [searchAttempted, setSearchAttempted] = useState(false);

  // State for filters applied in ResultsMenu (FilterMenu)
  // State 'lifted' as filters need to be applied to search results.
  const [selectedFilters, setSelectedFilters] = useState({
    services: [],
    stationTypes: [],
    fuelTypes: [],
  });

  // State for any 1 stations selected by User
  // so only 1 station shown when user clicks station name
  const [selectedStationId, setSelectedStationId] = useState(null);

  // --- PETER!!!!!!!!! code below should get you the full object
  // for the selectedStationId so you can pass it to StationMap
  // So when user clicks a station title selectedStationId and selectedStationObject can be used to 'zoom-in'
  // you can pass selectedStationObject to StationMap to do this

  // Get full station Object for selectedStationId so can pass to StationMap
  // const selectedStationObject = useMemo(() => {
  //   if (selectedStationId && searchResults.length > 0) {
  //     return searchResults.find(station => (station._id || station.uuid) === selectedStationId);
  //     }
  //     return null;
  //   }, [selectedStationId, searchResults]);
  // Dependencies on selectedStationId and searchResults list

  // handlers to update states
  const handleSearchResultsUpdate = (results) => {
    setSearchResults(results);
    setIsLoading(false);
    setError(null);
    setSearchAttempted(true);
    setSelectedStationId(null);
    setSelectedFilters({ services: [], stationTypes: [], fuelTypes: [] });
  };

  //NOTE: 'loadingState' not the same as 'LoadingState' (cap. I)
  const handleLoading = (loadingState) => {
    setIsLoading(loadingState);
    // if loading, means search attempted
    if (loadingState) {
      setSearchAttempted(true);
      setSelectedStationId(null);
      setSelectedFilters({ services: [], stationTypes: [], fuelTypes: [] });
    }
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setIsLoading(false);
    // if error, means search attempted
    setSearchAttempted(true);
    setSelectedStationId(null);
    setSelectedFilters({ services: [], stationTypes: [], fuelTypes: [] });
  };

  const handleSearchTextChange = (text) => {
    setSearchText(text);
    // if user clears searchtext, clear error and loading states
    if (text === "") {
      setError(null);
      setIsLoading(false);
    }
  };

  // Function to handle filter application from FilterMenu
  const handleApplyFilters = (filters) => {
    setSelectedFilters(filters);
    //debugging filter OR vs AND issue
    console.log("Current selectedFilters state:", selectedFilters);
    // Could also re-fetch & search again here?
    // Currently just filtering existing SearchResults.
    console.log("Filters applied in App.jsx:", filters);
    setSelectedStationId(null);
  };

  // Handler for users to click station card and 'un-display' others
  const handleStationCardClick = (stationId) => {
    //trying to debug issue with single StationCard render onClick
    console.log("App.jsx: Station card clicked, setting ID:", stationId);
    setSelectedStationId(stationId);
  };

  // Handler to show all searchResults again if user clicks away from single station
  const handleShowAllResults = () => {
    //trying to debug issue with single StationCard render onClick
    console.log("App.jsx: Show ALL results button clicked");
    setSelectedStationId(null);
  };

  // Memoized filtering logic
  // hook will re-run when rawSearchResults or selectedFilters change
  //had to do some debugging here was using for filters .some (OR logic) also needed .every (AND logic)
  const displayedResults = useMemo(() => {
    let filtered = searchResults; //raw data from API search

    // Filter by Services (requires ALL selected (AND and OR))
    if (selectedFilters.services && selectedFilters.services.length > 0) {
      filtered = filtered.filter((station) =>
        selectedFilters.services.every(
          (selectedService) =>
            station.services &&
            station.services.some(
              (stationService) => stationService.name === selectedService
            )
        )
      );
    }

    // Filter by Station Types
    if (
      selectedFilters.stationTypes &&
      selectedFilters.stationTypes.length > 0
    ) {
      filtered = filtered.filter((station) =>
        selectedFilters.stationTypes.includes(station.type)
      );
    }

    // Filter by Fuel Types (requires ALL selected (AND and OR))
    if (selectedFilters.fuelTypes && selectedFilters.fuelTypes.length > 0) {
      filtered = filtered.filter((station) =>
        selectedFilters.fuelTypes.every(
          (selectedFuel) =>
            station.fuels &&
            station.fuels.some(
              (stationFuel) => stationFuel.name === selectedFuel
            )
        )
      );
    }

    return filtered;
  }, [searchResults, selectedFilters]); // Dependencies for useMemo

  //To decide when to render ResultsMenu
  //IF currently loading, error, results to display, search attempted
  const shouldShowResultsMenu =
    isLoading ||
    error ||
    displayedResults.length > 0 ||
    (searchAttempted && searchText !== "");

  // For debugging, single station onClick not working
  useEffect(() => {
    console.log("App.jsx - selectedFilters UPDATED:", selectedFilters);
    console.log(
      "App.jsx - displayedResults count after filter update:",
      displayedResults.length
    );
    console.log("App.jsx - selectedStationId UPDATED:", selectedStationId); // Debugging single station view
  }, [selectedFilters, displayedResults, selectedStationId]);

  // For debugging filters not working:
  useEffect(() => {
    console.log("App.jsx - selectedFilters UPDATED:", selectedFilters);
    // Also log how many results are showing AFTER the filter change
    console.log(
      "App.jsx - displayedResults count after filter update:",
      displayedResults.length
    );
  }, [selectedFilters, displayedResults]); // Add displayedResults here to see its update too

  return (
    <div className="App">
      <Header className="header" />
      <main className="main" role="main" aria-label="Z Service Station finder">
        <div className="mapContainer">
          <StationMap
            aria-label="Map showing Z service stations"
            searchResults={searchResults}
            isLoading={isLoading}
            error={error}
          />

          <GeoSearch
            role="search"
            searchText={searchText}
            onSearchTextChange={handleSearchTextChange}
            onSearchResults={handleSearchResultsUpdate}
            onLoading={handleLoading}
            onError={handleError}
          />

          {/* Conditional Rendering for after search/loading/error */}
          {shouldShowResultsMenu && (
            <ResultsMenu
              results={displayedResults}
              isLoading={isLoading}
              error={error}
              searchText={searchText}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              onStationCardClick={handleStationCardClick}
              selectedStationId={selectedStationId}
              handleShowAllResults={handleShowAllResults}
            />
          )}
        </div>
      </main>
      <Footer className="footer" />
    </div>
  );
}

export default App;
