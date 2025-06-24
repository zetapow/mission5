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
    latitude: String,
    longitude: String,
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

// Text index
StationSchema.index(
  {
    "name": "text",
    "location.city": "text",
    "location.suburb": "text",
    "location.address": "text",
    "location.region": "text",
    "services.name": "text",
    "services.summary": "text",
    "fuels.name": "text",
    "fuels.short_name": "text",
  },

  {
    name: "station_fulltext_index",
    weights: {
      "name": 10,
      "location.city": 8,
      "location.suburb": 6,
      "location.address": 5,
      "location.region": 4,
      "services.name": 9,
      "services.summary": 4,
      "fuels.name": 7,
      "fuels.short_name": 6,
    },
    default_language: "en"
  }
);

StationSchema.index({ "uuid": 1 }, { unique: true });

module.exports = mongoose.model("Station", StationSchema);
