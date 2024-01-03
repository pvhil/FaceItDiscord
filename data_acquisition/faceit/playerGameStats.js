const axios = require("axios");
const { faceitKey } = require("../../config.json");

async function get(faceitPlayerID, limit) {
  try {
    const res = await axios.get(
      `https://open.faceit.com/data/v4/players/${faceitPlayerID}/games/cs2/stats?offset=0&limit=${limit}`,
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
