import "./App.css";
import Test from "./components/Test";
import GeoSearch from "./components/GeoSearch";
import StationMap from "./components/StationMap/StationMap";
import Header from "./components/shared/Header/Header";
import Footer from "./components/shared/Footer/Footer";
import ResultsMenu from "./components/shared/ResultsMenu/ResultsMenu";

function App() {
  return (
    <div className="App">
      <Header className="header" />
      <main className="main">
        <div className="mapContainer">
          <StationMap />
          <GeoSearch />
          <ResultsMenu />
        </div>
      </main>
      <Footer className="footer" />
    </div>
  );
}

export default App;
