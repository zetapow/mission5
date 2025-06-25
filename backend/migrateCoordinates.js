const fs = require("fs");
const path = require("path");

// Read the current stations.json file
const stationsFilePath = path.join(__dirname, "data", "stations.json");
const stationsData = JSON.parse(fs.readFileSync(stationsFilePath, "utf8"));

console.log("Converting latitude and longitude from strings to numbers...");

// Convert latitude and longitude from strings to numbers
const convertedStations = stationsData.map((station) => {
  if (
    station.location &&
    station.location.latitude &&
    station.location.longitude
  ) {
    return {
      ...station,
      location: {
        ...station.location,
        latitude: parseFloat(station.location.latitude),
        longitude: parseFloat(station.location.longitude),
      },
    };
  }
  return station;
});

// Write the converted data back to the file
fs.writeFileSync(stationsFilePath, JSON.stringify(convertedStations, null, 2));

console.log(`Successfully converted ${convertedStations.length} stations`);
console.log("Migration complete!");
