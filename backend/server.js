// Entry point for backend
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

const maptilerRoutes = require("./routes/maptiler");
const stationRoutes = require("./routes/stations");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/maptiler", maptilerRoutes);
app.use("/api/stations", stationRoutes);

// server start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
