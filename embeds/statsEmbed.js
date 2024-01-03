const { EmbedBuilder } = require("discord.js");
const players = require("../data_acquisition/faceit/players");
const stats = require("../data_acquisition/faceit/stats");
const rankingPlayer = require("../data_acquisition/faceit/rankingPlayer");
const rankingPlayerCountry = require("../data_acquisition/faceit/rankingPlayerCountry");

const { flag } = require("country-emoji");

async function createEmbed(faceitName) {
  const responsePlayers = await players.get(faceitName);
  if (!responsePlayers) {
    console.log(responsePlayers);
    return false;
  }
  const responsePlayerStats = await stats.get(responsePlayers["player_id"]);

  const responseRankingPlayer = await rankingPlayer.get(
    responsePlayers["player_id"],
    responsePlayers.games["cs2"].region
  );

  const responseRankingPlayerCountry = await rankingPlayerCountry.get(
    responsePlayers["player_id"],
    responsePlayers.games["cs2"].region,
    responsePlayers.country
  );

  let profileText = "Stats for ";
  if (responsePlayers.memberships.toString().includes("premium")) {
    profileText = "Stats for Premium User ";
  }

  const embed = new EmbedBuilder()
    .setColor(0xff5500)
    .setTitle(`${profileText} ${responsePlayers.nickname}`)
    .setAuthor({
      name: "Elo: " + responsePlayers.games["cs2"].faceit_elo,
      iconURL: `https://raw.githubusercontent.com/pvhil/FaceItDiscord/master/utility/pictures/level${responsePlayers.games["cs2"]["skill_level"]}.png`,
    })
    .setDescription(
      `[Faceit Profile](${responsePlayers["faceit_url"]
        .toString()
        .replace(
          "{lang}",
          "en"
        )}) and [Steam Profile](https://steamcommunity.com/profiles/${
        responsePlayers["steam_id_64"]
      })`
    )
    .addFields(
      { name: "Country", value: flag(responsePlayers.country), inline: true },
      {
        name: "Wins",
        value: responsePlayerStats.lifetime.Wins,
        inline: true,
      },
      {
        name: "Winrate",
        value: responsePlayerStats.lifetime["Win Rate %"],
        inline: true,
      },
      {
        name: "K/D",
        value: responsePlayerStats.lifetime["Average K/D Ratio"],
        inline: true,
      },
      {
        name: "Longest Winstreak",
        value: responsePlayerStats.lifetime["Longest Win Streak"],
        inline: true,
      },
      {
        name: "Last 5 Games",
        value: responsePlayerStats.lifetime["Recent Results"]
          .toString()
          .replaceAll(",", "")
          .replaceAll("0", "❌")
          .replaceAll("1", "🏆")
          .replaceAll("null", ""),
        inline: true,
      },
      {
        name: "Headshot %",
        value: responsePlayerStats.lifetime["Average Headshots %"],
        inline: true,
      }
    )
    .setThumbnail(responsePlayers.avatar)
    .setFooter({
      text: `Global Rank: ${responseRankingPlayer.position} | Country Rank: ${responseRankingPlayerCountry.position} `,
    });

  return embed;
}

module.exports = { createEmbed };
