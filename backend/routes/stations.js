const express = require("express");
const router = express.Router();

// import mondoose model
const Station = require("../models/Station.js");

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
