const express = require("express");
const router = express.Router();

// import mongoose model
const Station = require("../models/Station.js");

// Get hall stations with optional viewport filtering
router.get("/", async (req, res) => {
  try {
    const { west, south, east, north } = req.query;

    // If bounding box parameters are provided, filter by viewport
    if (west && south && east && north) {
      const bounds = {
        west: parseFloat(west),
        south: parseFloat(south),
        east: parseFloat(east),
        north: parseFloat(north),
      };

      // Validate that coordinates are numbers
      if (Object.values(bounds).some(isNaN)) {
        return res.status(400).json({
          error:
            "Invalid coordinates. All bounding box values must be numbers.",
        });
      }
      console.log(`Fetching stations within bounds:`, bounds);

      // Query stations within the bounding box
      // Now using direct numeric comparison since coordinates are stored as numbers
      const stations = await Station.find(
        {
          "location.latitude": { $gte: bounds.south, $lte: bounds.north },
          "location.longitude": { $gte: bounds.west, $lte: bounds.east },
        },
        {
          name: 1,
          "location.latitude": 1,
          "location.longitude": 1,
          "location.address": 1,
          "location.city": 1,
          "location.suburb": 1,
        }
      );

      console.log(`Found ${stations.length} stations in viewport`);
      res.json(stations);
    } else {
      // No viewport parameters - return all stations
      const stations = await Station.find(
        {},
        {
          name: 1,
          "location.latitude": 1,
          "location.longitude": 1,
          "location.address": 1,
          "location.city": 1,
          "location.suburb": 1,
        }
      );

      console.log(`Returning all ${stations.length} stations`);
      res.json(stations);
    }
  } catch (error) {
    console.error("Error fetching stations:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching stations" });
  }
});

module.exports = router;
// Export the router to use in the main app
