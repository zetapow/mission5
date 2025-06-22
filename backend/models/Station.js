const mongoose = require("mongoose");

const StationSchema = new mongoose.Schema({
  uuid: { type: String, required: true, unique: true },
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
      short_name: String,
    },
  ],
  services: [
    {
      link: String,
    },
  ],
});

module.exports = mongoose.model("Station", StationSchema);
