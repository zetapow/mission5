const { MongoClient } = require("mongodb");
require("dotenv").config();

const URI = process.env.MONGODB_URI;
const database = process.env.DATABASE_NAME;

async function searchStationsByKeywords(searchInput) {
  const client = new MongoClient(URI, {}); // preparing client
  let stations = []; //list to hold search results

  try {
    await client.connect();
    const db = client.db(database);
    const collection = db.collection("stations"); // access stations data
    const transformedSearchInput = searchInput
      .split(/\s+/)
      .map((term) => `\"${term}\"`)
      .join(" "); // "hamilton car wash"  =>  "\"hamilton\" \"car\" \"wash\""

    const query = {
      $text: {
        $search: transformedSearchInput, // perform search
      },
    };

    const cursor = collection
      .find(query, {
        projection: { score: { $meta: "textScore" } },
      })
      .sort({ score: { $meta: "textScore" } })
      .limit(10);

    stations = await cursor.toArray(); // convert cursor into js array

    return stations;
  } catch (err) {
    console.error("Search error:", err);
  } finally {
    await client.close();
  }
}
module.exports = { searchStationsByKeywords };
