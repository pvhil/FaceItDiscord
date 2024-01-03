const { EmbedBuilder } = require("discord.js");
const players = require("../data_acquisition/faceit/players");
const playerGameStats = require("../data_acquisition/faceit/playerGameStats");

async function createEmbed(faceitName, games) {
  const responsePlayers = await players.get(faceitName);
  if (!responsePlayers) {
    return false;
  }
  const responsePlayerGameStats = await playerGameStats.get(
    responsePlayers["player_id"],
    games
  );

  let totalKills = 0;
  let totalDeaths = 0;
  let totalAssists = 0;
  let totalMVPs = 0;
  let totalHS = 0;
  let totalTriple = 0;
  let totalQuadro = 0;
  let totalAce = 0;
  let totalRounds = 0;
  let totalKR = 0;
  let totalHSPerc = 0;
  let totalKD = 0;
  let wins = 0;
  var kdlist = [];

  responsePlayerGameStats.items.forEach((game) => {
    totalKills += parseInt(game.stats.Kills);
    totalDeaths += parseInt(game.stats.Deaths);
    totalAssists += parseInt(game.stats.Assists);
    totalMVPs += parseInt(game.stats.MVPs);
    totalHS += parseInt(game.stats.Headshots);
    totalTriple += parseInt(game.stats["Triple Kills"]);
    totalQuadro += parseInt(game.stats["Quadro Kills"]);
    totalAce += parseInt(game.stats["Penta Kills"]);
    totalRounds += parseInt(game.stats.Rounds);
    totalKR += parseFloat(game.stats["K/R Ratio"]);
    totalHSPerc += parseInt(game.stats["Headshots %"]);
    totalKD += parseFloat(game.stats["K/D Ratio"]);
    kdlist.push(parseFloat(game.stats["K/D Ratio"]));
    if (game.stats.Result == "1") {
      wins++;
    }
  });


  var realkd = (Math.round((totalKD / parseFloat(games)) * 100) / 100).toFixed(
    2
  );
  var realkr = (Math.round((totalKR / parseFloat(games)) * 100) / 100).toFixed(
    2
  );

  const embed = new EmbedBuilder()
    .setColor("#FF5500")
    .setTitle(responsePlayers.nickname + "'s last " + games + " Games")
    .addFields(
      {
        name: "Avg Kills",
        value: Math.round(totalKills / games).toString(),
        inline: true,
      },
      {
        name: "Avg Deaths",
        value: Math.round(totalDeaths / games).toString(),
        inline: true,
      },
      {
        name: "Avg K/D",
        value: realkd.toString(),
        inline: true,
      },
      {
        name: "Avg Assists",
        value: Math.round(totalAssists / games).toString(),
        inline: true,
      },
      {
        name: "Avg MVPs",
        value: Math.round(totalMVPs / games).toString(),
        inline: true,
      },
      {
        name: "Avg Headshots",
        value: (totalHS / games).toString(),
        inline: true,
      },
      {
        name: "Winrate",
        value: Math.round((wins * 100) / games).toString(),
        inline: true,
      },
      {
        name: "Avg K/R",
        value: realkr.toString(),
        inline: true,
      },
      {
        name: "Headshot %",
        value: Math.round(totalHSPerc / games).toString() + "%",
        inline: true,
      },
      {
        name: "Triple Kills",
        value: Math.round(totalTriple / games).toString(),
        inline: true,
      },
      {
        name: "Quadro Kills",
        value: Math.round(totalQuadro / games).toString(),
        inline: true,
      },
      {
        name: "Aces",
        value: Math.round(totalAce / games).toString(),
        inline: true,
      },
      {
        name: "HLTV 1.0",
        value: "Coming back",
        inline: true,
      }
    )
    .setThumbnail(responsePlayers["avatar"])
    .setImage(
      "https://quickchart.io/chart?bkg=white&c={type:%27line%27,data:{labels:[" +
        '"",'.repeat(games) +
        "],datasets:[{label:%27Elo%27,yAxisID:%27A%27,data:[" +
        "0" +
        "],backgroundColor:%22rgba(255,0,0,0.5)%22,borderColor:%27red%27},{label:%27K%2FD%27,yAxisID:%27B%27,data:[" +
        kdlist.toString() +
        "],backgroundColor:%22rgba(78,80,255,0)%22,borderColor:%27blue%27}]},options:{scales:{xAxes:[{ticks:{reverse:true}}],yAxes:[{id:%27A%27,type:%27linear%27,position:%27left%27,ticks:{beginAtZero:false,}},{id:%27B%27,type:%27linear%27,position:%27right%27,ticks:{beginAtZero:false}}]}}}"
    );

  return embed;
}

module.exports = { createEmbed };
