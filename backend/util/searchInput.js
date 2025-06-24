const Station = require("../models/Station");
const { options } = require("../routes/maptiler");

  @param {string} searchTerm
  @param {object} options

async function searchInput(searchTerm, options = {}) {
  const {limit = 10, sortByScore = true} = options;

  try {
    const results = await Station.find(
      { $text: }
    )
  }
}