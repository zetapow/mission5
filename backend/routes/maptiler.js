const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();

const MAPTILER_API = process.env.MAPTILER_API;

// endpoint to geocode
router.get("/geocode", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "query parameter is required" });
  }
  try {
    const response = await axios.get(
      `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json`,
      {
        params: {
          key: MAPTILER_API,
        },
      }
    );

    if (response.data.features.length === 0) {
      return res
        .status(404)
        .json({ error: "No results found for the given query" });
    }

    res.json(response.data.features[0]);
  } catch (error) {
    console.error("Error fetching geocode data:", error);
    res.status(500).json({
      error: "An error occurred while fetching geocode data",
    });
  }
});

module.exports = router;
