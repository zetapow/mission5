const { MongoClient } = require("mongodb");
const stations = require("../data/stations.json");
require("dotenv").config();

const URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const database = process.env.MONGODB_DATABASE || "stations";

// Clear existing data and seed new data
async function seedDatabase() {
  const client = new MongoClient(URI, {});

  try {
    await client.connect();
    const db = client.db(database);
    const collection = db.collection(database);

    // Clear existing data
    await collection.deleteMany({});

    // Insert new station data
    const result = await collection.insertMany(stations);
    console.log(`${result.insertedCount} stations inserted successfully.`);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.close();
  }
}

// Clear all data from the database
async function clearDatabase() {
  const client = new MongoClient(URI, {});

  try {
    await client.connect();
    const db = client.db(database);
    const collection = db.collection(database);

    // Clear existing data
    const result = await collection.deleteMany({});
    console.log(`${result.deletedCount} stations deleted successfully.`);
  } catch (error) {
    console.error("Error clearing database:", error);
  } finally {
    await client.close();
  }
}

module.exports = { seedDatabase, clearDatabase };
