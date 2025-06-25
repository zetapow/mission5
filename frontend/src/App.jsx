import "./App.css";
import Test from "./components/Test";
import GeoSearch from "./components/GeoSearch";
import StationMap from "./components/StationMap/StationMap";
import Header from "./components/shared/Header/Header";
import Footer from "./components/shared/Footer/Footer";
import ResultsMenu from "./components/shared/ResultsMenu/ResultsMenu";
import { useState } from "react";
import { LoadingState } from "./components/StationMap/LoadingState";

function App() {

  // "lifted-states from Geosearch so that they can be used in StationMap and ResultsMenu"
  // loading and error to show messages to user if needed
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");

  // handlers to update states
  const handleSearchResultsUpdate = (results) => {
    setSearchResults(results);
    setIsLoading(false);
    setError(null);
  };

  const handleLoading = (LoadingState) => {
    setIsLoading(LoadingState);
  };
  
  const handleError = (errorMessage) => {
    setError(errorMessage);
    setIsLoading(false);
  };

  const handleSearchTextChange = (text) => {
    setSearchText(text);
  };


  return (
    <div className="App">
      <Header className="header" />
      <main className="main">
        <div className="mapContainer">
          <StationMap />
          
          <GeoSearch
            searchText={searchText}
            onSearchTextChange={handleSearchTextChange}
            onSearchResults={handleSearchResultsUpdate}
            onLoading={handleLoading}
            onError={handleError}

            />
          
          <ResultsMenu 
            results={searchResults}
            isLoading={isLoading}
            error={error}
            searchText={searchText}
            />


        </div>
      </main>
      <Footer className="footer" />
    </div>
  );
}

export default App;
