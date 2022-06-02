const axios = require("axios")
const { defaultQuery } = require("./utils/faceit")
require("dotenv").config()

const topggtoken = process.env.TOPTOKEN

// search player
const searchPlayer = x => defaultQuery(`https://open.faceit.com/data/v4/search/players?nickname=${encodeURIComponent(x)}&game=csgo&offset=0&limit=1`)

// return match need matchid
const detailedMatch = x => defaultQuery(`https://open.faceit.com/data/v4/matches/${encodeURIComponent(x)}/stats`)

//search hub need hub name
const searchHub = x => defaultQuery(`https://open.faceit.com/data/v4/search/hubs?name=${encodeURIComponent(x)}&offset=0&limit=1`)

// hub info need id?
const hubInfo = x => defaultQuery(`https://open.faceit.com/data/v4/hubs/${encodeURIComponent(x)}`)

// hub leaderboard hub id?
const hubLeaderboard = x => defaultQuery(`https://open.faceit.com/data/v4/leaderboards/hubs/${encodeURIComponent(x)}/general?offset=0&limit=10`)

//last 20 games playerid
const vOneRequest = x => defaultQuery(`https://api.faceit.com/stats/api/v1/stats/time/users/${encodeURIComponent(x)}/games/csgo`, 1)

// needed for last games needs number and id
const historyReq = x => defaultQuery(`https://open.faceit.com/data/v4/players/${encodeURIComponent(x)}/history?game=csgo&offset=0&limit=20`)

//normal stats need id
const idStats = x => defaultQuery(`https://open.faceit.com/data/v4/players/${encodeURIComponent(x)}/stats/csgo`)

//normal stats need id
const idStatsCheck = x => defaultQuery(`https://open.faceit.com/data/v4/players/${encodeURIComponent(x)}`)

//stats with nickname
const nickStats = x => defaultQuery(`https://open.faceit.com/data/v4/players?nickname=${encodeURIComponent(x)}`)

//other games id and gameid
const otherGames = (x, game) => defaultQuery(`https://open.faceit.com/data/v4/players/${encodeURIComponent(x)}/stats/${game}`)

//player rank in region, needs id and region
const plRankRegion = (x, reg) => defaultQuery(`https://open.faceit.com/data/v4/rankings/games/csgo/regions/${reg}/players/${encodeURIComponent(x)}?limit=1`)

//player rank in country, needs id and country and region
const plRankCountry = (x, country, reg) => defaultQuery(`https://open.faceit.com/data/v4/rankings/games/csgo/regions/${reg}/players/${encodeURIComponent(x)}?country=${country}&limit=1`)

//region rankings need region
const rankRegion = reg => defaultQuery(`https://open.faceit.com/data/v4/rankings/games/csgo/regions/${reg}?offset=0&limit=15`)

//ranking country needs region and country
const rankCountry = (country, reg) => defaultQuery(`https://open.faceit.com/data/v4/rankings/games/csgo/regions/${reg}?country=${country}&offset=0&limit=15`)

// team search needs team
const teamSearch = team => defaultQuery(`https://open.faceit.com/data/v4/search/teams?nickname=${encodeURIComponent(team)}&offset=0&limit=1`)

// team info needs teamid
const teamInfo = x => defaultQuery(`https://open.faceit.com/data/v4/teams/${encodeURIComponent(x)}`)

// extra: vote check
async function topggcheck(x) {
  return new Promise((resolve, reject) => {
    try {
      axios.get("https://top.gg/api/bots/770312130037153813/check?userId=" + x, {
        headers: {
          "Authorization": topggtoken
        }
      })
        .then(function (response) {
          resolve(response.data)
        })
        .catch(function (error) {
          reject("error")
          console.log(error)
        })
    } catch (err) {
      return "error"
    }
  })
}


module.exports = {
  teamInfo,
  searchPlayer,
  teamSearch,
  rankCountry,
  rankRegion,
  plRankCountry,
  plRankRegion,
  otherGames,
  nickStats,
  idStats,
  historyReq,
  detailedMatch,
  searchHub,
  vOneRequest,
  hubLeaderboard,
  hubInfo,
  idStatsCheck,
  topggcheck
}