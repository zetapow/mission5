const mongoose = require("mongoose");
const Station = require("../models/Station"); // Import Station model

// This function (Util)
// Searches for a station by ID (_id or uuid) returns address.

//  param stationId - The _id or uuid of the station to find, taken from results of the Users initial search for stations.
//  returns the full address string if found, otherwise null.
 
async function stationLocationForDirections(stationId) {
    if (!mongoose.connection.readyState) {
        console.error("Mongoose is not connected. Attempting to connect...");
        return null;
    }

    try {
        // Find the station by _id or uuid
        const station = await Station.findOne({
            $or: [{ _id: stationId }, { uuid: stationId }],
        });

        if (!station) {
            console.log(`Station with ID ${stationId} not found.`);
            return null;
        }

        // Construct full address string
        const addressParts = [
            station.location.address,
            station.location.suburb,
            station.location.city,
            station.location.region, 
            station.location.postcode
        ].filter(part => part); // Removes any undefined/null/empty parts

        const fullAddress = addressParts.join(', ');

        console.log(`Found address for ${stationId}: ${fullAddress}`);
        return fullAddress;

    } catch (error) {
        console.error(`Error in stationLocationForDirections for ID ${stationId}:`, error);
        throw error; 
    }
}

module.exports = { stationLocationForDirections };