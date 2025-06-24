// Entry point for backend
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

const Station = require("./models/Station");

const maptilerRoutes = require("./routes/maptiler");
const stationRoutes = require("./routes/stations");
const stationSearch = require("./routes/stationSearch");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//MongoDB Connection - needed to connect and load Schema / apply text index
const MONGODB_CONNECTION = process.env.MONGODB_URI || "mongodb://localhost:27017/stations";

// Connect to MongoDB using Mongoose
mongoose.connect(MONGODB_CONNECTION)
  .then(() => {
    console.log("MongoDB connected successfully.");

  // Routes
  app.use("/api/maptiler", maptilerRoutes);
  app.use("/api/stations", stationRoutes);
  app.use("/api/stations-search", stationSearch);

  // server start
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  });

})
.catch((err)=> {
  console.error("MongoDB connection failed:", err.message);
  process.exit(1);
});
