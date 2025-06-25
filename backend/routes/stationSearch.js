const express = require("express");
const router = express.Router();

// import searchStationsByKeywords function
const {searchStationsByKeywords} = require("../util/searchUtil.js");

// GET /api/stations-search
// search for stations based on keywords
//keywords expected as query parameter 'q'.
//example api/stations-search?q=hamilton carwash


router.get("/", async (req, res) => {
    const searchInput = req.query.q;

    if(!searchInput){
        return res.status(400).json({error: "Search query parameter 'q' is required"});
    }

 try {
    // Call search function
    const stations = await searchStationsByKeywords(searchInput);

    // search results as a JSON response
    res.json(stations);
  } catch (error) {
    // Log the error for server-side debugging
    console.error("Error searching stations:", error);

    // Send a 500 status code and an error message to the client
    res.status(500).json({ error: "An error occurred while performing the search." });
  }
});

// Export the router to be used by server.js
module.exports = router;