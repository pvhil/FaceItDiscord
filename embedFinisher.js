const fr = require("./faceitRequests");
const {
   countryCodeEmoji,
} = require('country-code-emoji');
const numbformat = new Intl.NumberFormat();


const {
   MessageEmbed,
} = require('discord.js');


async function fStats(name) {
   try {
      var id = 0
      try{
      var sCon = await fr.nickStats(name)
      id = sCon.player_id
      }catch (ex){
      var sCon = await fr.searchPlayer(name)
      id = sCon.items[0].player_id
      }

      var temp = await fr.idStatsCheck(id)
      var csgoStats = await fr.idStats(temp.player_id)
      var regiont = await fr.nickStats(temp.nickname)
      var region = regiont.games.csgo.region
      var country = regiont.country
      var rank = await fr.plRankRegion(temp.player_id, region)
      var rankw = await fr.plRankCountry(temp.player_id, country, region)
      var skilllevel = regiont.games.csgo["skill_level"].toString()

      var premium = ""
      if (!(regiont.memberships.toString().includes("free"))) {
         premium = " Premium User "
      }

      var skilllevelpic = "https://raw.githubusercontent.com/pvhil/FaceItDiscord/master/pictures/level" + skilllevel + ".png"


      const embed = new MessageEmbed()
         .setColor('#FF5500')
         .setTitle('Stats for ' + premium + temp.nickname)
         .addFields({
            name: 'Country',
            value: countryCodeEmoji(country),
            inline: true
         }, {
            name: 'Wins',
            value: (csgoStats.lifetime.Wins).toString(),
            inline: true
         }, {
            name: 'Winrate',
            value: csgoStats.lifetime["Win Rate %"].toString() + "%",
            inline: true
         }, {
            name: 'K/D',
            value: csgoStats.lifetime["Average K/D Ratio"].toString(),
            inline: true
         }, {
            name: 'Longest Winstreak',
            value: csgoStats.lifetime["Longest Win Streak"].toString(),
            inline: true
         }, {
            name: 'Last 5 Games',
            value: csgoStats.lifetime["Recent Results"].toString().replaceAll(",", "").replaceAll("0", "❌").replaceAll("1", "🏆").replaceAll("null", ""),
            inline: true
         }, {
            name: 'Headshot %',
            value: csgoStats.lifetime["Average Headshots %"].toString() + "%",
            inline: true
         })
         .setAuthor("Elo: " + regiont.games.csgo["faceit_elo"].toString(), skilllevelpic)
         .setThumbnail(regiont.avatar)
         .setDescription("[FaceIT Profile](" + regiont["faceit_url"].toString().replace("{lang}", "en") + ") and [Steam Profile](https://steamcommunity.com/profiles/" + regiont["steam_id_64"] + ")")
         .setFooter('🌐 Rank: ' + numbformat.format(rank.position).toString() + " | Country Rank: " + numbformat.format(rankw.position).toString());

      return embed
   } catch (e) {
      const errembed = new MessageEmbed()
         .setColor('#ff0000')
         .setTitle("Wrong FaceIT Name")
         .setDescription("This FaceIT Name is invalid! Try again")
         .setTimestamp()

      return errembed
   }
}
async function fLatest(name) {
   try {
      var id = 0
      try{
         var sCon = await fr.nickStats(name)
         id = sCon.player_id
         }catch (ex){
         var sCon = await fr.searchPlayer(name)
         id = sCon.items[0].player_id
         }
      var historty = await fr.historyReq(id, 1)
      var history = historty.items[0]
      var game = await fr.detailedMatch(history["match_id"])

      var teamIndex = ""
      var plIndex = ""
      var isWin = "0"

      var team1 = []
      var team2 = []

      for (var i = 0; i < game.rounds[0].teams.length; i++) {

         for (var a = 0; a < game.rounds[0].teams[i].players.length; a++) {
            if (i == 0) {
               team1.push(game.rounds[0].teams[i].players[a].nickname)
            } else {
               team2.push(game.rounds[0].teams[i].players[a].nickname)
            }
         }
         if (JSON.stringify(game.rounds[0].teams[i]).includes(id)) {

            for (var a = 0; a < game.rounds[0].teams[i].players.length; a++) {


               if (JSON.stringify(game.rounds[0].teams[i].players[a]).includes(id)) {
                  teamIndex = i
                  plIndex = a
                  isWin = game.rounds[0].teams[i].players[a].Result

               }
            }
         }
      }
      var plStats = game.rounds[0].teams[teamIndex].players[plIndex]["player_stats"]

      var date = new Date(historty.to * 1000)


      var win = "https://raw.githubusercontent.com/pvhil/FaceItDiscord/master/src/main/resources/images/lose.png"

      if (isWin == "1") {
         win = "https://raw.githubusercontent.com/pvhil/FaceItDiscord/master/src/main/resources/images/win.png"
      }


      const embed = new MessageEmbed()
         .setColor('#FF5500')
         .setTitle(history.teams.faction1.nickname + " vs " + history.teams.faction2.nickname)
         .addFields({
            name: 'Team 1',
            value: team1.toString().replaceAll(",", "\n"),
            inline: true
         }, {
            name: 'Team 2',
            value: team2.toString().replaceAll(",", "\n"),
            inline: true
         }, {
            name: '\u200b',
            value: "\u200b",
            inline: false
         }, {
            name: 'Final Score',
            value: game.rounds[0]["round_stats"].Score.toString(),
            inline: true
         }, {
            name: 'Map',
            value: game.rounds[0]["round_stats"].Map.toString(),
            inline: true
         }, {
            name: '\u200b',
            value: "\u200b",
            inline: false
         }, {
            name: 'Kills',
            value: plStats.Kills.toString(),
            inline: true
         }, {
            name: 'Deaths',
            value: plStats.Deaths.toString(),
            inline: true
         }, {
            name: 'K/D',
            value: plStats["K/D Ratio"].toString(),
            inline: true
         }, {
            name: 'Triple Kills',
            value: plStats["Triple Kills"].toString(),
            inline: true
         }, {
            name: 'Quadro Kills',
            value: plStats["Quadro Kills"].toString(),
            inline: true
         }, {
            name: 'Aces',
            value: plStats["Penta Kills"].toString(),
            inline: true
         }, {
            name: 'K/R',
            value: plStats["K/R Ratio"].toString(),
            inline: true
         }, {
            name: 'Assists',
            value: plStats["Assists"].toString(),
            inline: true
         }, {
            name: 'Headshots',
            value: plStats["Headshots"].toString(),
            inline: true
         }, {
            name: 'Headshot %',
            value: plStats["Headshots %"].toString() + "%",
            inline: true
         }, {
            name: 'MVPs',
            value: plStats["MVPs"].toString(),
            inline: true
         }, {
            name: 'HLTV 1.0',
            value: "In work",
            inline: true
         }, )
         .setThumbnail(win)
         .setDescription("[Link to Game](" + history.faceit_url.toString().replace("{lang}", "en") + ")")
         .setFooter("Match played: ", "https://raw.githubusercontent.com/pvhil/FaceItDiscord/master/src/main/resources/images/clock.png");

      return embed
   } catch (e) {
      const errembed = new MessageEmbed()
         .setColor('#ff0000')
         .setTitle("Wrong FaceIT Name")
         .setDescription("This FaceIT Name is invalid! Try again")
         .setTimestamp()

      return errembed

   }





}
async function fMap(name, map) {
   try {
      var id = 0
      try{
         var sCon = await fr.nickStats(name)
         id = sCon.player_id
         }catch (ex){
         var sCon = await fr.searchPlayer(name)
         id = sCon.items[0].player_id
         }
      var stats = await fr.idStats(id)

      for (var i = 0; i < stats.segments.length; i++) {
         if (JSON.stringify(stats.segments[i]).includes("5v5") && JSON.stringify(stats.segments[i]).includes(map)) {
            var mapstats = stats.segments[i].stats

            const embed = new MessageEmbed()
               .setColor('#FF5500')
               .setTitle("Stats for " + map)
               .addFields({
                  name: 'Kills',
                  value: mapstats.Kills,
                  inline: true
               }, {
                  name: 'Deaths',
                  value: mapstats.Deaths,
                  inline: true
               }, {
                  name: 'Assists',
                  value: mapstats.Assists,
                  inline: true
               }, {
                  name: 'Avg Kills',
                  value: mapstats["Average Kills"],
                  inline: true
               }, {
                  name: 'Avg Deaths',
                  value: mapstats["Average Deaths"],
                  inline: true
               }, {
                  name: 'Played Rounds',
                  value: mapstats.Rounds,
                  inline: true
               }, {
                  name: 'Matches',
                  value: mapstats.Matches,
                  inline: true
               }, {
                  name: 'Wins',
                  value: mapstats.Wins,
                  inline: true
               }, {
                  name: 'Winrate',
                  value: mapstats["Win Rate %"] + "%",
                  inline: true
               }, {
                  name: 'Triple Kills',
                  value: mapstats["Triple Kills"].toString(),
                  inline: true
               }, {
                  name: 'Quadro Kills',
                  value: mapstats["Quadro Kills"].toString(),
                  inline: true
               }, {
                  name: 'Aces',
                  value: mapstats["Penta Kills"].toString(),
                  inline: true
               }, {
                  name: 'Headshots',
                  value: mapstats.Headshots.toString(),
                  inline: true
               }, {
                  name: 'Headshots per Match',
                  value: mapstats["Headshots per Match"].toString(),
                  inline: true
               }, {
                  name: 'Avg K/D',
                  value: mapstats["Average K/D Ratio"].toString(),
                  inline: true
               }, {
                  name: 'MVPS',
                  value: mapstats["MVPs"].toString(),
                  inline: true
               }, )
               .setThumbnail(stats.segments[i]["img_regular"])

            return embed

         }
      }
   } catch (e) {
      const errembed = new MessageEmbed()
         .setColor('#ff0000')
         .setTitle("Wrong FaceIT Name")
         .setDescription("This FaceIT Name is invalid! Try again")
         .setTimestamp()

      return errembed

   }


}
async function fLast(name, count) {
   try {
      var id = 0
      var nickname = ""
      try{
         var sCon = await fr.nickStats(name)
         id = sCon.player_id
         nickname = sCon.nickname
         }catch (ex){
         var sCon = await fr.searchPlayer(name)
         id = sCon.items[0].player_id
         nickname = sCon.items[0].nickname
         }
      var stats = await fr.vOneRequest(id)
      var nickStats = await fr.nickStats(nickname)

      var elopoints = []
      var wins = 0
      var kdlist = []

      if (count == null) {
         count = "20"
      }
      var totalkills = 0;
      var totaldeaths = 0;
      var totalassists = 0;
      var totalmvps = 0;
      var totalhs = 0;
      var totaltriple = 0;
      var totalquadro = 0;
      var totalace = 0;
      var totalrounds = 0;
      var totalkr = 0;
      var totalhsperc = 0;
      var totalkd = 0;

      for (var i = 0; i < parseInt(count); i++) {
         if (JSON.stringify(stats[i]).includes("elo")) {
            elopoints.push(stats[i].elo)

            var e1 = parseInt(stats[i].i6)
            var e2 = parseInt(stats[i].i8)
            var e3 = parseFloat(stats[i].c2)
            var e4 = parseInt(stats[i].i14)
            var e5 = parseInt(stats[i].i15)
            var e6 = parseInt(stats[i].i7)
            var e7 = parseInt(stats[i].i16)
            var e8 = parseInt(stats[i].i13)
            var e9 = parseInt(stats[i].i9)
            var c5 = parseInt(stats[i].i12)
            var c3 = parseFloat(stats[i].c3)
            var c4 = parseInt(stats[i].c4)

            if (stats[i].i10 == "1") {
               wins++;
            }

            totalkd = totalkd + e3
            kdlist.push(e3)
            totalkills = totalkills + e1
            totaldeaths = totaldeaths + e2
            totalassists = totalassists + e6
            totalmvps = totalmvps + e9
            totalhs = totalhs + e8
            totaltriple = totaltriple + e4
            totalquadro = totalquadro + e5
            totalace = totalace + e7
            totalrounds = totalrounds + c5
            totalkr = totalkr + c3
            totalhsperc = totalhsperc + c4
         }
      }

      var realkd = (Math.round((totalkd / parseFloat(count)) * 100) / 100).toFixed(2);
      var realkr = (Math.round((totalkr / parseFloat(count)) * 100) / 100).toFixed(2);

      var countint = parseInt(count)

      const embed = new MessageEmbed()
         .setColor('#FF5500')
         .setTitle(nickname + "'s last " + count + " Games")
         .addFields({
            name: 'Avg Kills',
            value: (Math.round(totalkills / countint)).toString(),
            inline: true
         }, {
            name: 'Avg Deaths',
            value: (Math.round(totaldeaths / countint)).toString(),
            inline: true
         }, {
            name: 'Avg K/D',
            value: realkd.toString(),
            inline: true
         }, {
            name: 'Avg Assists',
            value: (Math.round(totalassists / countint)).toString(),
            inline: true
         }, {
            name: 'Avg MVPs',
            value: (Math.round(totalmvps / countint)).toString(),
            inline: true
         }, {
            name: 'Avg Headshots',
            value: (totalhs / countint).toString(),
            inline: true
         }, {
            name: 'Winrate',
            value: (Math.round((wins * 100) / countint)).toString(),
            inline: true
         }, {
            name: 'Avg K/R',
            value: realkr.toString(),
            inline: true
         }, {
            name: 'Headshot %',
            value: (Math.round(totalhsperc / countint)).toString() + "%",
            inline: true
         }, {
            name: 'Triple Kills',
            value: (Math.round(totaltriple / countint)).toString(),
            inline: true
         }, {
            name: 'Quadro Kills',
            value: (Math.round(totalquadro / countint)).toString(),
            inline: true
         }, {
            name: 'Aces',
            value: (Math.round(totalace / countint)).toString(),
            inline: true
         }, {
            name: 'HLTV 1.0',
            value: "Coming back",
            inline: true
         }, {
            name: 'Start / End Elo',
            value: (elopoints[0] + " / " + elopoints[elopoints.length - 1]).toString(),
            inline: true
         }, {
            name: 'Min. / Max. Elo',
            value: (Math.min(...elopoints) + " / " + Math.max(...elopoints)).toString(),
            inline: true
         }, )
         .setThumbnail(nickStats["avatar"])
         .setImage("https://quickchart.io/chart?bkg=white&c={type:%27line%27,data:{labels:[" + "\"\",".repeat(countint) + "],datasets:[{label:%27Elo%27,yAxisID:%27A%27,data:[" + elopoints.toString() + "],backgroundColor:%22rgba(255,0,0,0.5)%22,borderColor:%27red%27},{label:%27K%2FD%27,yAxisID:%27B%27,data:[" + kdlist.toString() + "],backgroundColor:%22rgba(78,80,255,0)%22,borderColor:%27blue%27}]},options:{scales:{xAxes:[{ticks:{reverse:true}}],yAxes:[{id:%27A%27,type:%27linear%27,position:%27left%27,ticks:{beginAtZero:false,}},{id:%27B%27,type:%27linear%27,position:%27right%27,ticks:{beginAtZero:false}}]}}}")

      return embed
   } catch (e) {
      const errembed = new MessageEmbed()
         .setColor('#ff0000')
         .setTitle("Wrong FaceIT Name")
         .setDescription("This FaceIT Name is invalid! Try again")
         .setTimestamp()

      return errembed
   }
}
async function fRanking(region, country) {
   try {
      var ranking = null
      const embed = new MessageEmbed()
      if (country == null) {
         ranking = await fr.rankRegion(region)
         embed.setThumbnail("https://www.countryflags.io/" + region + "/flat/64.png")
         embed.setTitle("Top 15 for " + region)

      } else {
         ranking = await fr.rankCountry(country, region)
         embed.setThumbnail("https://www.countryflags.io/" + country + "/flat/64.png")
         embed.setTitle("Top 15 for " + country)
         console.log(embed.thumbnail)

      }
      var ept = []
      for (var i = 0; i < 15; i++) {
         var namet = ranking.items[i].nickname
         var elot = ranking.items[i]["faceit_elo"]
         var lvlt = ranking.items[i]["game_skill_level"]
         ept.push(i + 1 + ". ***" + namet + "***: " + "Elo: " + elot + " | " + "Level: " + lvlt + "\n");

      }
      embed
         .setColor('#FF5500')
         .setDescription(ept.join(""))

      return embed
   } catch (e) {
      const errembed = new MessageEmbed()
         .setColor('#ff0000')
         .setTitle("Wrong FaceIT Name")
         .setDescription("This FaceIT Name is invalid! Try again")
         .setTimestamp()

      return errembed

   }
}
async function fHub(name) {
   try {
      var hubSearch = await fr.searchHub(encodeURIComponent(name));
      var hubInfo = await fr.hubInfo(hubSearch.items[0]["competition_id"])
      var hubLeaderboard = await fr.hubLeaderboard(hubSearch.items[0]["competition_id"])


      const embed = new MessageEmbed()
         .setColor('#FF5500')
         .setTitle(hubSearch.items[0]["name"])
         .setDescription(hubInfo["description"])
         .addFields({
            name: 'Players',
            value: hubInfo["players_joined"].toString(),
            inline: true
         }, {
            name: 'Min/Max Elolevel',
            value: hubInfo["min_skill_level"] + " / " + hubInfo["max_skill_level"],
            inline: true
         }, {
            name: 'Permissions',
            value: hubInfo["join_permission"],
            inline: true
         }, {
            name: 'FaceIT Link',
            value: "[Link to FaceIT Hub](" + hubInfo["faceit_url"].replaceAll("{lang}", "en") + ")",
            inline: true
         }, )
         .setThumbnail(hubInfo.avatar)

      var lDesc = []
      for (var i = 0; i < 9; i++) {
         var played = hubLeaderboard.items[i].played
         var winrate = hubLeaderboard.items[i]["win_rate"]
         var lvl = hubLeaderboard.items[i]["points"]
         var nick = hubLeaderboard.items[i].player.nickname
         lDesc.push(i + 1 + ". ***" + nick + "***: " + "Points: " + lvl + " | " + "Played Matches: " + played + " | " + "Winrate: " + winrate + "\n")
      }

      const lead = new MessageEmbed()
         .setColor('#FF5500')
         .setTitle("Leaderboard")
         .setDescription(lDesc.join(""))


      return [embed, lead]


   } catch (e) {
      const errembed = new MessageEmbed()
         .setColor('#ff0000')
         .setTitle("Wrong FaceIT Name")
         .setDescription("This FaceIT Name is invalid! Try again")
         .setTimestamp()

      return [errembed]

   }
}
async function fTeam(name) {
   try {
      var teamSearch = await fr.teamSearch(name)
      var teamInfo = await fr.teamInfo(teamSearch.items[0]["team_id"])

      const embed = new MessageEmbed()
         .setColor('#FF5500')
         .setTitle("Team " + teamSearch.items[0]["name"])
         .setDescription(teamInfo["description"] + "\n [Link to FaceIT](" + teamInfo["faceit_url"].replaceAll("{lang}", "en") + ")")
         .setThumbnail(teamInfo.avatar)

      for (var i = 0; i < teamInfo.members.length; i++) {
         embed.addField(name = countryCodeEmoji(teamInfo.members[i].country) + " " + teamInfo.members[i].nickname, value = "[Link to Profile](" + (teamInfo.members[i]["faceit_url"]).replace("{lang}", "en") + ")".toString())
      }

      return embed
   } catch (e) {
      const errembed = new MessageEmbed()
         .setColor('#ff0000')
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