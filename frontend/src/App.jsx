import "./App.css";
import Test from "./components/Test";
import GeoSearch from "./components/GeoSearch";
import StationMap from "./components/StationMap/StationMap";
import Header from "./components/shared/Header/Header";

function App() {
  return (
    <div className="App">
      <h1>Welcome to Mission 5</h1>
      <Header />
      {/* <GeoSearch /> */}
      <StationMap className="stationMapContainer" />
      {/* <Test /> */}
    </div>
  );
}

export default App;
