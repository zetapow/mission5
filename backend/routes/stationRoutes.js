const express = require("express");
const router = express.Router();
const { searchStationsByKeywords } = require("../util/searchInput");

router.get("/search", async (req, res) => {
  const searchInput = req.query.q
  
  if (!searchInput) return res.status(400).json({ error: "Missing search query" });

  try {
    const results = await searchStationsByKeywords(searchInput);
    console.log("Results:", results);
    res.json(results);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Search Failed" });
  }
});

module.exports = router;
