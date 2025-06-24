const { MongoClient } = require("mongodb");
require("dotenv").config();

const URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const database = process.env.MONGODB_DATABASE || "stations";

// Clear existing data and seed new data
async function searchStationsByKeywords(searchInput) {
  const client = new MongoClient(URI, {});
  let stations = [];

  try {
    await client.connect();
    const db = client.db(database);
    const collection = db.collection(database);

    // The $text operator requires text index (setup on schema).
    // also sort by 'textScore' to get relevance ranking (see index for weighting).
   // Split the input into individual terms, and wrap each term in escaped double quotes.
   // This forces MongoDB's $text operator to implicitly AND these terms.
    const transformedSearchInput = searchInput.split(/\s+/).map(term => `\"${term}\"`).join(' ');
   
   
    const query = {
            $text: {
                $search: transformedSearchInput
            }
        };

        const cursor = collection.find(
            query, // Use the query object with only $text
            {
                score: { $meta: "textScore" }
            }
        ).sort(
            {
                score: { $meta: "textScore" }
            }
        );

    //convert cursor to an array of documents
    stations = await cursor.toArray();
    console.log(`Found ${stations.length} stations for search "${searchInput}"`);

    return stations;
    
  } catch (error) {
    console.error(`Error executing search for "${searchInput}"`, error);
    throw error;
  } finally {
    if (client) {
        await client.close();
        console.log("MongoDB connection closed after search.")
    }
  }
};

module.exports = {searchStationsByKeywords };
