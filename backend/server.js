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

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI + process.env.DATABASE_NAME
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

// Initialize database connection
connectDB();

// Routes
app.use("/api/maptiler", maptilerRoutes);
app.use("/api/stations", stationRoutes);

// server start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
