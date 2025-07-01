const express = require("express");
const router = express.Router();

// Import the function to get station location for directions
const { stationLocationForDirections } = require("../util/stationAddress");

// GET /api/get-directions
// Shoul expect stationId as a query parameter so can find relevant document from MongoDB and get address
//  (e.g., /api/get-directions?stationId=some_id)
router.get("/", async (req, res) => {
  const stationId = req.query.stationId; // Get stationId from query parameters

  if (!stationId) {
    return res.status(400).json({ error: "Station ID (stationId) is required as a query parameter." });
  }

  try {
    // Call the utility function to get the full address
    const address = await stationLocationForDirections(stationId);

    if (!address) {
      return res.status(404).json({ error: `Station with ID ${stationId} not found or has no address.` });
    }

    // Send the address back as JSON
    res.json({ address: address });

  } catch (error) {
    console.error(`Error in /api/get-directions for ID ${stationId}:`, error);
    res.status(500).json({ error: "An internal server error occurred while getting directions." });
  }
});

module.exports = router;
