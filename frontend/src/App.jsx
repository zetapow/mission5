import "./App.css";
import Test from "./components/Test";
import GeoSearch from "./components/GeoSearch";
import StationMap from "./components/StationMap/StationMap";

function App() {
  return (
    <div className="App">
      <h1>Welcome to Mission 5</h1>
      {/* <GeoSearch /> */}
      <StationMap className="stationMapContainer" />
      {/* <Test /> */}
    </div>
  );
}

export default App;
