const mongoose = require("mongoose");

const StationSchema = new mongoose.Schema({
  // uuid: { type: String, required: true, unique: true },
  last_edited: String,
  name: String,
  type: String,
  type_slug: String,
  brand: String,
  is_active: Number,
  closed_message: String,
  phone: String,
  link: String,
  site_id: String,
  pay_at_pump_247: Number,
  location: {
    address: String,
    suburb: String,
    city: String,
    region: String,
    postcode: String,
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
      validate: {
        validator: function (v) {
          return !isNaN(v) && isFinite(v);
        },
        message: "Latitude must be a valid number between -90 and 90",
      },
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
      validate: {
        validator: function (v) {
          return !isNaN(v) && isFinite(v);
        },
        message: "Longitude must be a valid number between -180 and 180",
      },
    },
  },
  opening_hours: [
    {
      day: String,
      hours: String,
      current: Boolean,
    },
  ],
  fuels: [
    {
      name: String,
      show_on_locator: Boolean,
      icon: String,
      slug: String,
      brand: String,
      short_name: String,
    },
  ],
  services: [
    {
      id: Number,
      name: String,
      code: String,
      summary: String,
      link: String,
    },
  ],
});

// Fixed text index - removed duplicates
StationSchema.index(
  {
    name: "text",
    "location.address": "text",
    "location.suburb": "text",
    "location.city": "text",
    "location.region": "text",
    "location.postcode": "text",
    "services.name": "text",
    "fuels.name": "text",
  },
  {
    name: "station_fulltext_index",
    weights: {
      name: 10,
      "location.address": 9,
      "location.suburb": 8,
      "location.city": 8,
      "location.region": 7,
      "location.postcode": 5,
      "services.name": 8,
      "fuels.name": 6,
    },
    default_language: "en",
  }
);

StationSchema.index({ uuid: 1 }, { unique: true });

module.exports = mongoose.model("Station", StationSchema);
