// Entry point for backend
require("dotenv").config({ path: "../.env" });
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

const Station = require("./models/Station");

const maptilerRoutes = require("./routes/maptiler");

const stations = require("./routes/stations");
const stationSearch = require("./routes/stationRoutes");


const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


const MONGODB_CONNECTION = process.env.MONGODB_CONNECTION || "mongodb://localhost:27017/stations";

mongoose.connect(MONGODB_CONNECTION).then(() => {
  console.log("MongoDB connected successfully");
});

// Routes
app.use("/api/maptiler", maptilerRoutes);
app.use("/api/stations", stations);

app.use("/api/stations-search", stationSearch);

// server start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
