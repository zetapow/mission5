import "./App.css";
import Test from "./components/Test";
import GeoSearch from "./components/GeoSearch";
import StationMap from "./components/StationMap/StationMap";
import Header from "./components/shared/Header/Header";
import Footer from "./components/shared/Footer/Footer";

function App() {
  return (
    <div className="App">
      <Header className="header" />
      <main className="main">
        <div className="mapContainer">
          <StationMap />
          <GeoSearch />
        </div>
      </main>
      <Footer className="footer" />
    </div>
  );
}

export default App;
