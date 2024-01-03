const { EmbedBuilder } = require("discord.js");
const players = require("../data_acquisition/faceit/players");
const playerGameStats = require("../data_acquisition/faceit/playerGameStats");
const gameStats = require("../data_acquisition/faceit/gameStats");

async function createEmbed(faceitName) {
  const responsePlayers = await players.get(faceitName);
  if (!responsePlayers) {
    return false;
  }
  const responsePlayerGameStats = await playerGameStats.get(
    responsePlayers["player_id"],
    1
  );

  const playerStatsinGame = responsePlayerGameStats.items[0].stats;

  const responsegameStats = await gameStats.get(playerStatsinGame["Match Id"]);

  let rosterArray1 = [];
  let rosterArray2 = [];

  const roster1 = responsegameStats.teams["faction1"].roster;
  const roster2 = responsegameStats.teams["faction2"].roster;

  roster1.forEach((player) => {
    rosterArray1.push(player.nickname);
  });

  roster2.forEach((player) => {
    rosterArray2.push(player.nickname);
  });

  let win = "test";
  if (playerStatsinGame.Result == "1") {
    win = "win";
  }

  const embed = new EmbedBuilder()
    .setColor("#FF5500")
    .setTitle(
      responsegameStats.teams["faction1"].name +
        " vs " +
        responsegameStats.teams["faction2"].name
    )
    .addFields(
      {
        name: "Team 1",
        value: rosterArray1.toString().replaceAll(",", "\n"),
        inline: true,
      },
      {
        name: "Team 2",
        value: rosterArray2.toString().replaceAll(",", "\n"),
        inline: true,
      },
      {
        name: "\u200b",
        value: "\u200b",
        inline: false,
      },
      {
        name: "Final Score",
        value: playerStatsinGame.Score,
        inline: true,
      },
      {
        name: "Map",
        value: playerStatsinGame.Map,
        inline: true,
      },
      {
        name: "\u200b",
        value: "\u200b",
        inline: false,
      },
      {
        name: "Kills",
        value: playerStatsinGame.Kills,
        inline: true,
      },
      {
        name: "Deaths",
        value: playerStatsinGame.Deaths,
        inline: true,
      },
      {
        name: "K/D",
        value: playerStatsinGame["K/D Ratio"],
        inline: true,
      },
      {
        name: "Triple Kills",
        value: playerStatsinGame["Triple Kills"].toString(),
        inline: true,
      },
      {
        name: "Quadro Kills",
        value: playerStatsinGame["Quadro Kills"].toString(),
        inline: true,
      },
      {
        name: "Aces",
        value: playerStatsinGame["Penta Kills"].toString(),
        inline: true,
      },
      {
        name: "K/R",
        value: playerStatsinGame["K/R Ratio"].toString(),
        inline: true,
      },
      {
        name: "Assists",
        value: playerStatsinGame["Assists"].toString(),
        inline: true,
      },
      {
        name: "Headshots",
        value: playerStatsinGame["Headshots"].toString(),
        inline: true,
      },
      {
        name: "Headshot %",
        value: playerStatsinGame["Headshots %"].toString() + "%",
        inline: true,
      },
      {
        name: "MVPs",
        value: playerStatsinGame["MVPs"].toString(),
        inline: true,
      },
      {
        name: "HLTV 1.0",
        value: "In work",
        inline: true,
      }
    )
    .setDescription(
      "[Link to Game](" +
        responsegameStats.faceit_url.toString().replace("{lang}", "en") +
        ")"
    )
    .setFooter({
      text: "Match played: ",
      iconURL:
        "https://raw.githubusercontent.com/pvhil/FaceItDiscord/master/src/main/resources/images/clock.png",
    });
  return embed;
}

module.exports = { createEmbed };
