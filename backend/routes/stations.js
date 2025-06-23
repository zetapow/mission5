const express = require("express");
const router = express.Router();

// import mondoose model
const Station = require("../models/Station.js");

// Get stations within a bounding box (for viewport-based loading)
router.get("/viewport", async (req, res) => {
  try {
    const { west, south, east, north } = req.query;

    // Validate bounding box parameters
    if (!west || !south || !east || !north) {
      return res.status(400).json({
        error:
          "Missing bounding box parameters. Required: west, south, east, north",
      });
    }

    const bounds = {
      west: parseFloat(west),
      south: parseFloat(south),
      east: parseFloat(east),
      north: parseFloat(north),
    };

    // Validate that coordinates are numbers
    if (Object.values(bounds).some(isNaN)) {
      return res.status(400).json({
        error: "Invalid coordinates. All bounding box values must be numbers.",
      });
    }

    console.log(`Fetching stations within bounds:`, bounds);    // Query stations within the bounding box
    // Note: coordinates are stored as strings, so we need to convert them for comparison
    const stations = await Station.find(
      {
        $expr: {
          $and: [
            { $gte: [{ $toDouble: "$location.longitude" }, bounds.west] },
            { $lte: [{ $toDouble: "$location.longitude" }, bounds.east] },
            { $gte: [{ $toDouble: "$location.latitude" }, bounds.south] },
            { $lte: [{ $toDouble: "$location.latitude" }, bounds.north] }
          ]
        }
      },
      // only fetch required fields
      {
        name: 1,
        "location.latitude": 1,
        "location.longitude": 1,
        "location.address": 1,
        "location.suburb": 1,
      }
    );

    console.log(`Found ${stations.length} stations in viewport`);
    res.json(stations);
  } catch (error) {
    console.error("Error fetching stations by viewport:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching stations" });
  }
});

// Get all stations (keeping for backward compatibility)
router.get("/", async (req, res) => {
  try {
    const stations = await Station.find(
      {},
      // only fetch requried fields
      { name: 1, "location.latitude": 1, "location.longitude": 1 }
    ); // Fetch all stations from the database

    res.json(stations); // Send the stations as a JSON response
  } catch (error) {
    console.error("Error fetching stations:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching stations" });
  }
});

module.exports = router;
// Export the router to use in the main app
