const axios = require("axios");
const { faceitKey } = require("../../config.json");

async function get(faceitId, region, country) {
  try {
    const res = await axios.get(
      `https://open.faceit.com/data/v4/rankings/games/cs2/regions/${region}/players/${faceitId}?country=${country}&limit=1`,
      {
        headers: {
          Authorization: "Bearer " + faceitKey,
          Accept: "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    return false;
  }
}

module.exports = { get };
