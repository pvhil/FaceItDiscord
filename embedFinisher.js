const { countryCodeEmoji } = require("country-code-emoji")
const { MessageEmbed } = require("discord.js")
const {
  nickStats,
  searchPlayer,
  historyReq,
  detailedMatch,
  idStatsCheck,
  idStats,
  plRankRegion,
  plRankCountry,
  vOneRequest,
  rankRegion,
  rankCountry,
  searchHub,
  hubInfo,
  hubLeaderboard,
  teamSearch,
  teamInfo
} = require("./faceitRequests")

const numbformat = new Intl.NumberFormat()

const checkPlayer = async (name) => {
  let sCon
  try { sCon = await nickStats(name) }
  catch (ex) { sCon = await searchPlayer(name) }
  return sCon
}

const fStats = async name => {
  try {
    const id = (await checkPlayer(name)).player_id,
      temp = await idStatsCheck(id),
      csgoStats = await idStats(temp.player_id),
      region = temp.games.csgo.region,
      country = temp.country,
      rank = await plRankRegion(temp.player_id, region),
      rankw = await plRankCountry(temp.player_id, country, region),
      skilllevel = temp.games.csgo["skill_level"].toString(),
      premium = temp.memberships.toString().includes("free") ? "" : " Premium User ",
      skilllevelpic = "https://raw.githubusercontent.com/pvhil/FaceItDiscord/master/pictures/level" + skilllevel + ".png"

    const embed = new MessageEmbed()
      .setColor("#FF5500")
      .setTitle("Stats for " + premium + temp.nickname)
      .addFields({
        name: "Country",
        value: countryCodeEmoji(country),
        inline: true
      }, {
        name: "Wins",
        value: (csgoStats.lifetime.Wins).toString(),
        inline: true
      }, {
        name: "Winrate",
        value: csgoStats.lifetime["Win Rate %"].toString() + "%",
        inline: true
      }, {
        name: "K/D",
        value: csgoStats.lifetime["Average K/D Ratio"].toString(),
        inline: true
      }, {
        name: "Longest Winstreak",
        value: csgoStats.lifetime["Longest Win Streak"].toString(),
        inline: true
      }, {
        name: "Last 5 Games",
        value: csgoStats.lifetime["Recent Results"].toString().replaceAll(",", "").replaceAll("0", "❌").replaceAll("1", "🏆").replaceAll("null", ""),
        inline: true
      }, {
        name: "Headshot %",
        value: csgoStats.lifetime["Average Headshots %"].toString() + "%",
        inline: true
      })
      .setAuthor("Elo: " + temp.games.csgo.faceit_elo.toString(), skilllevelpic)
      .setThumbnail(temp.avatar)
      .setDescription(`[FaceIT Profile](${temp.faceit_url.toString().replace("{lang}", "en")}) and [Steam Profile](https://steamcommunity.com/profiles/${temp.steam_id_64})`)
      .setFooter(`🌐 Rank: ${numbformat.format(rank.position).toString()} | Country Rank: ${numbformat.format(rankw.position).toString()}`)

    return embed
  } catch (e) {
    const errembed = new MessageEmbed()
      .setColor("#ff0000")
      .setTitle("Wrong FaceIT Name")
      .setDescription("This FaceIT Name is invalid! Try again")
      .setTimestamp()

    return errembed
  }
}

const fLatest = async name => {
  try {
    const id = (await checkPlayer(name)).player_id,
      historty = await historyReq(id, 1),
      history = historty.items[0],
      game = await detailedMatch(history["match_id"])

    let teamIndex = ""
    let plIndex = ""
    let isWin = "0"

    const team1 = [], team2 = []

    for (let i = 0; i < game.rounds[0].teams.length; i++) {
      for (let a = 0; a < game.rounds[0].teams[i].players.length; a++)
        if (i == 0) team1.push(game.rounds[0].teams[i].players[a].nickname)
        else team2.push(game.rounds[0].teams[i].players[a].nickname)

      if (JSON.stringify(game.rounds[0].teams[i]).includes(id))
        for (let a = 0; a < game.rounds[0].teams[i].players.length; a++)
          if (JSON.stringify(game.rounds[0].teams[i].players[a]).includes(id)) {
            teamIndex = i
            plIndex = a
            isWin = game.rounds[0].teams[i].players[a].Result
          }
    }

    const plStats = game.rounds[0].teams[teamIndex].players[plIndex]["player_stats"]
    let date = new Date(historty.to * 1000)
    const win = isWin == "1" ? "https://raw.githubusercontent.com/pvhil/FaceItDiscord/master/pictures/trophy.png" : "https://raw.githubusercontent.com/pvhil/FaceItDiscord/master/pictures/l.png"

    const embed = new MessageEmbed()
      .setColor("#FF5500")
      .setTitle(history.teams.faction1.nickname + " vs " + history.teams.faction2.nickname)
      .addFields({
        name: "Team 1",
        value: team1.toString().replaceAll(",", "\n"),
        inline: true
      }, {
        name: "Team 2",
        value: team2.toString().replaceAll(",", "\n"),
        inline: true
      }, {
        name: "\u200b",
        value: "\u200b",
        inline: false
      }, {
        name: "Final Score",
        value: game.rounds[0].round_stats.Score.toString(),
        inline: true
      }, {
        name: "Map",
        value: game.rounds[0].round_stats.Map.toString(),
        inline: true
      }, {
        name: "\u200b",
        value: "\u200b",
        inline: false
      }, {
        name: "Kills",
        value: plStats.Kills.toString(),
        inline: true
      }, {
        name: "Deaths",
        value: plStats.Deaths.toString(),
        inline: true
      }, {
        name: "K/D",
        value: plStats["K/D Ratio"].toString(),
        inline: true
      }, {
        name: "Triple Kills",
        value: plStats["Triple Kills"].toString(),
        inline: true
      }, {
        name: "Quadro Kills",
        value: plStats["Quadro Kills"].toString(),
        inline: true
      }, {
        name: "Aces",
        value: plStats["Penta Kills"].toString(),
        inline: true
      }, {
        name: "K/R",
        value: plStats["K/R Ratio"].toString(),
        inline: true
      }, {
        name: "Assists",
        value: plStats.Assists.toString(),
        inline: true
      }, {
        name: "Headshots",
        value: plStats.Headshots.toString(),
        inline: true
      }, {
        name: "Headshot %",
        value: plStats["Headshots %"].toString() + "%",
        inline: true
      }, {
        name: "MVPs",
        value: plStats.MVPs.toString(),
        inline: true
      }, {
        name: "HLTV 1.0",
        value: "In work",
        inline: true
      })
      .setThumbnail(win)
      .setDescription(`[Link to Game](${history.faceit_url.toString().replace("{lang}", "en")})`)
      .setFooter("Match played: ", "https://raw.githubusercontent.com/pvhil/FaceItDiscord/master/src/main/resources/images/clock.png")

    return embed
  } catch (e) {
    return new MessageEmbed()
      .setColor("#ff0000")
      .setTitle("Wrong FaceIT Name")
      .setDescription("This FaceIT Name is invalid! Try again")
      .setTimestamp()
  }
}

async function fMap(name, map = "de_dust2") {
  try {
    const id = (await checkPlayer(name)).player_id,
      playerStats = await idStats(id),
      mapDatas = playerStats.segments.filter(x => x.label == map)[0],
      mapStats = mapDatas.stats

    const embed = new MessageEmbed()
      .setColor("#FF5500")
      .setTitle("Stats for " + map)
      .addFields({
        name: "Kills",
        value: mapStats.Kills,
        inline: true
      }, {
        name: "Deaths",
        value: mapStats.Deaths,
        inline: true
      }, {
        name: "Assists",
        value: mapStats.Assists,
        inline: true
      }, {
        name: "Avg Kills",
        value: mapStats["Average Kills"],
        inline: true
      }, {
        name: "Avg Deaths",
        value: mapStats["Average Deaths"],
        inline: true
      }, {
        name: "Played Rounds",
        value: mapStats.Rounds,
        inline: true
      }, {
        name: "Matches",
        value: mapStats.Matches,
        inline: true
      }, {
        name: "Wins",
        value: mapStats.Wins,
        inline: true
      }, {
        name: "Winrate",
        value: mapStats["Win Rate %"] + "%",
        inline: true
      }, {
        name: "Triple Kills",
        value: mapStats["Triple Kills"],
        inline: true
      }, {
        name: "Quadro Kills",
        value: mapStats["Quadro Kills"],
        inline: true
      }, {
        name: "Aces",
        value: mapStats["Penta Kills"],
        inline: true
      }, {
        name: "Headshots",
        value: mapStats.Headshots,
        inline: true
      }, {
        name: "Headshots per Match",
        value: mapStats["Headshots per Match"],
        inline: true
      }, {
        name: "Avg K/D",
        value: mapStats["Average K/D Ratio"],
        inline: true
      }, {
        name: "MVPS",
        value: mapStats["MVPs"],
        inline: true
      })
      .setThumbnail(mapDatas.img_regular)

    return embed
  } catch (e) {
    console.log(e)
    return new MessageEmbed()
      .setColor("#ff0000")
      .setTitle("Wrong FaceIT Name")
      .setDescription("This FaceIT Name is invalid! Try again")
      .setTimestamp()
  }
}

const fLast = async (name, count = 20) => {
  if (count > 99) return new MessageEmbed()
    .setColor("#ff0000")
    .setTitle("Number is too High!")
    .setDescription("You can only check under 99 games at once.")
    .setTimestamp()

  try {
    const playerDatas = await checkPlayer(name),
      id = playerDatas.player_id,
      nickname = playerDatas.nickname,
      stats = await vOneRequest(id),
      playerStats = await nickStats(nickname),
      elopoints = [],
      kdlist = []

    let wins = 0, totalkills = 0, totaldeaths = 0, totalassists = 0, totalmvps = 0, totalhs = 0, totaltriple = 0, totalquadro = 0, totalace = 0, totalrounds = 0, totalkr = 0, totalhsperc = 0, totalkd = 0

    for (let i = 0; i < (count > stats.length ? stats.length : count); i++) {
      const stat = stats[i]
      if (stat.elo) elopoints.push(stat.elo)
      if (stat.i10 == "1") wins++
      const kd = parseFloat(stat.c2)

      totalkills += parseInt(stat.i6)
      totaldeaths += parseInt(stat.i8)
      totalkd += kd
      totaltriple += parseInt(stat.i14)
      totalquadro += parseInt(stat.i15)
      totalassists += parseInt(stat.i7)
      totalace += parseInt(stat.i16)
      totalhs += parseInt(stat.i13)
      totalmvps = parseInt(stat.i9)
      totalkr += parseFloat(stat.c3)
      totalhsperc += parseFloat(stat.c4)
      totalrounds += parseInt(stat.i12)

      kdlist.push(kd.toFixed(2))
    }

    const realkd = (Math.round((totalkd / parseFloat(count)) * 100) / 100).toFixed(2)
    const realkr = (Math.round((totalkr / parseFloat(count)) * 100) / 100).toFixed(2)

    const embed = new MessageEmbed()
      .setColor("#FF5500")
      .setTitle(nickname + "'s last " + count + " Games")
      .addFields({
        name: "Avg Kills",
        value: (Math.round(totalkills / count)).toString(),
        inline: true
      }, {
        name: "Avg Deaths",
        value: (Math.round(totaldeaths / count)).toString(),
        inline: true
      }, {
        name: "Avg K/D",
        value: realkd.toString(),
        inline: true
      }, {
        name: "Avg Assists",
        value: (Math.round(totalassists / count)).toString(),
        inline: true
      }, {
        name: "Avg MVPs",
        value: (Math.round(totalmvps / count)).toString(),
        inline: true
      }, {
        name: "Avg Headshots",
        value: (Math.round(totalhs / count)).toString(),
        inline: true
      }, {
        name: "Winrate",
        value: `${Math.round((wins * 100) / count)}%`,
        inline: true
      }, {
        name: "Avg K/R",
        value: realkr.toString(),
        inline: true
      }, {
        name: "Headshot %",
        value: (Math.round(totalhsperc / count)).toString() + "%",
        inline: true
      }, {
        name: "Triple Kills",
        value: (Math.round(totaltriple / count)).toString(),
        inline: true
      }, {
        name: "Quadro Kills",
        value: (Math.round(totalquadro / count)).toString(),
        inline: true
      }, {
        name: "Aces",
        value: (Math.round(totalace / count)).toString(),
        inline: true
      }, {
        name: "HLTV 1.0",
        value: "Coming back",
        inline: true
      }, {
        name: "Start / End Elo",
        value: (elopoints[0] + " / " + elopoints[elopoints.length - 1]).toString(),
        inline: true
      }, {
        name: "Min. / Max. Elo",
        value: (Math.min(...elopoints) + " / " + Math.max(...elopoints)).toString(),
        inline: true
      })
      .setThumbnail(playerStats.avatar)
      .setImage(`https://quickchart.io/chart?bkg=white&c={type:%27line%27,data:{labels:[${"\"\",".repeat(count)}],datasets:[{label:%27Elo%27,yAxisID:%27A%27,data:[${elopoints.toString()}],backgroundColor:%22rgba(255,0,0,0.5)%22,borderColor:%27red%27},{label:%27K%2FD%27,yAxisID:%27B%27,data:[${kdlist.toString()}],backgroundColor:%22rgba(78,80,255,0)%22,borderColor:%27blue%27}]},options:{scales:{xAxes:[{ticks:{reverse:true}}],yAxes:[{id:%27A%27,type:%27linear%27,position:%27left%27,ticks:{beginAtZero:false,}},{id:%27B%27,type:%27linear%27,position:%27right%27,ticks:{beginAtZero:false}}]}}}`)

    return embed
  } catch (e) {
    console.log(e)

    return new MessageEmbed()
      .setColor("#ff0000")
      .setTitle("Wrong FaceIT Name")
      .setDescription("This FaceIT Name is invalid! Try again")
      .setTimestamp()
  }
}

const fRanking = async (region, country) => {
  try {
    let ranking
    const embed = new MessageEmbed()

    if (country == null) {
      ranking = await rankRegion(region)
      embed.setThumbnail(`https://www.countryflags.io/${region}/flat/64.png`)
        .setTitle(`Top 15 for ${region}`)
    } else {
      ranking = await rankCountry(country, region)
      embed.setThumbnail(`https://www.countryflags.io/${country}/flat/64.png`)
        .setTitle(`Top 15 for ${country}`)
    }

    const ept = []
    for (let i = 0; i < 15; i++) {
      const namet = ranking.items[i].nickname,
        elot = ranking.items[i].faceit_elo,
        lvlt = ranking.items[i].game_skill_level
      ept.push(`${i + 1}. ***${namet}***: Elo: ${elot} | Level: ${lvlt}\n`)
    }

    embed.setColor("#FF5500")
      .setDescription(ept.join(""))

    return embed
  } catch (e) {
    const errembed = new MessageEmbed()
      .setColor("#ff0000")
      .setTitle("Wrong Region and/or Country")
      .setDescription("The region and/or country are invalid! Try again")
      .setTimestamp()

    return errembed
  }
}

const fHub = async name => {
  try {
    const hubSearch = await searchHub(encodeURIComponent(name)),
      hubInfo = await hubInfo(hubSearch.items[0].competition_id),
      hubLeaderboard = await hubLeaderboard(hubSearch.items[0].competition_id)

    const embed = new MessageEmbed()
      .setColor("#FF5500")
      .setTitle(hubSearch.items[0]["name"])
      .setDescription(hubInfo["description"])
      .addFields({
        name: "Players",
        value: hubInfo.players_joined.toString(),
        inline: true
      }, {
        name: "Min/Max Elolevel",
        value: `${hubInfo.min_skill_level} / ${hubInfo.max_skill_level}`,
        inline: true
      }, {
        name: "Permissions",
        value: hubInfo.join_permission,
        inline: true
      }, {
        name: "FaceIT Link",
        value: `[Link to FaceIT Hub](${hubInfo.faceit_url.replaceAll("{ lang }", "en")})`,
        inline: true
      })
      .setThumbnail(hubInfo.avatar)

    let lDesc = []
    for (let i = 0; i < 9; i++) {
      let played = hubLeaderboard.items[i].played
      let winrate = hubLeaderboard.items[i].win_rate
      let lvl = hubLeaderboard.items[i].points
      let nick = hubLeaderboard.items[i].player.nickname
      lDesc.push(i + 1 + ". ***" + nick + "***: " + "Points: " + lvl + " | " + "Played Matches: " + played + " | " + "Winrate: " + winrate + "\n")
    }

    const lead = new MessageEmbed()
      .setColor("#FF5500")
      .setTitle("Leaderboard")
      .setDescription(lDesc.join(""))

    return [embed, lead]
  } catch (e) {
    const errembed = new MessageEmbed()
      .setColor("#ff0000")
      .setTitle("Wrong FaceIT Name")
      .setDescription("This FaceIT Name is invalid! Try again")
      .setTimestamp()

    return [errembed]
  }
}

const fTeam = async name => {
  try {
    const teamSearch = await teamSearch(name),
      teamInfo = await teamInfo(teamSearch.items[0].team_id)

    const embed = new MessageEmbed()
      .setColor("#FF5500")
      .setTitle("Team " + teamSearch.items[0]["name"])
      .setDescription(`${teamInfo.description}\n[Link to FaceIT](${teamInfo["faceit_url"].replaceAll("{lang}", "en")})`)
      .setThumbnail(teamInfo.avatar)

    for (let i = 0; i < teamInfo.members.length; i++)
      embed.addField(`${countryCodeEmoji(teamInfo.members[i].country)}  ${teamInfo.members[i].nickname}`, `[Link to Profile](${teamInfo.members[i].faceit_url.replace("{lang}", "en")})`)

    return embed
  } catch (e) {
    const errembed = new MessageEmbed()
      .setColor("#ff0000")
      .setTitle("Wrong FaceIT Name")
      .setDescription("This FaceIT Name is invalid! Try again")
      .setTimestamp()

    return errembed
  }
}

module.exports = {
  fStats,
  fLatest,
  fMap,
  fLast,
  fRanking,
  fHub,
  fTeam
}
