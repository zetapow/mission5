// Example: Assign random price to each fuel in a station
function assignRandomPricesToFuels(station) {
   station.fuels = station.fuels.map((fuel) => ({
      ...fuel,
      price: (Math.random() * (2.8 - 2.0) + 2.0).toFixed(2), // Generates a price between 2.00 and 2.80
   }));
   return station;
}

// Usage:
const station = {
   name: "Example Station",
   fuels: [
      { short_name: "91" },
      { short_name: "95" },
      { short_name: "diesel" },
   ],
};

const stationWithPrices = assignRandomPricesToFuels(station);
console.log(stationWithPrices);
