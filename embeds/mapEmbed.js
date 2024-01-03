const { EmbedBuilder } = require("discord.js");
const players = require("../data_acquisition/faceit/players");
const stats = require("../data_acquisition/faceit/stats");

async function createEmbed(faceitName, map) {
  const responsePlayers = await players.get(faceitName);
  if (!responsePlayers) {
    return false;
  }
  const responsePlayerStats = await stats.get(responsePlayers["player_id"]);

  for (var i = 0; i < responsePlayerStats.segments.length; i++) {
    if (
      JSON.stringify(responsePlayerStats.segments[i]).includes("5v5") &&
      JSON.stringify(responsePlayerStats.segments[i]).includes(map)
    ) {
      let mapstats = responsePlayerStats.segments[i].stats;

      const embed = new EmbedBuilder()
        .setColor("#FF5500")
        .setTitle("Stats for " + map)
        .addFields(
          {
            name: "Kills",
            value: mapstats.Kills,
            inline: true,
          },
          {
            name: "Deaths",
            value: mapstats.Deaths,
            inline: true,
          },
          {
            name: "Assists",
            value: mapstats.Assists,
            inline: true,
          },
          {
            name: "Avg Kills",
            value: mapstats["Average Kills"],
            inline: true,
          },
          {
            name: "Avg Deaths",
            value: mapstats["Average Deaths"],
            inline: true,
          },
          {
            name: "Played Rounds",
            value: mapstats.Rounds,
            inline: true,
          },
          {
            name: "Matches",
            value: mapstats.Matches,
            inline: true,
          },
          {
            name: "Wins",
            value: mapstats.Wins,
            inline: true,
          },
          {
            name: "Winrate",
            value: mapstats["Win Rate %"] + "%",
            inline: true,
          },
          {
            name: "Triple Kills",
            value: mapstats["Triple Kills"].toString(),
            inline: true,
          },
          {
            name: "Quadro Kills",
            value: mapstats["Quadro Kills"].toString(),
            inline: true,
          },
          {
            name: "Aces",
            value: mapstats["Penta Kills"].toString(),
            inline: true,
          },
          {
            name: "Headshots",
            value: mapstats.Headshots.toString(),
            inline: true,
          },
          {
            name: "Headshots per Match",
            value: mapstats["Headshots per Match"].toString(),
            inline: true,
          },
          {
            name: "Avg K/D",
            value: mapstats["Average K/D Ratio"].toString(),
            inline: true,
          },
          {
            name: "MVPS",
            value: mapstats["MVPs"].toString(),
            inline: true,
          }
        )
        .setThumbnail(responsePlayerStats.segments[i]["img_regular"]);

      return embed;
    }
  }
  return false;
}
module.exports = { createEmbed };
