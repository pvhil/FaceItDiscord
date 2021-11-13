const axios = require('axios');
const dotenv = require('dotenv').config()


const ft = process.env.FACEITTOKEN

// search player
function searchPlayer(x) {
  return new Promise((resolve, reject) => {
    try {
      axios.get("https://open.faceit.com/data/v4/search/players?nickname=" + encodeURIComponent(x) + "&game=csgo&offset=0&limit=1", {
          headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer ' + ft
          }
        })
        .then(function (response) {
          resolve(response.data)
        })
        .catch(function (error) {
          reject("error")
        })
    } catch (err) {
      reject("error")
    }
  })
}

// return match need matchid
async function detailedMatch(x) {
  return new Promise((resolve, reject) => {
    try {
      axios.get("https://open.faceit.com/data/v4/matches/" + encodeURIComponent(x) + "/stats", {
          headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer ' + ft
          }
        })
        .then(function (response) {
          resolve(response.data)
        })
        .catch(function (error) {
          reject("error")
          console.log(error);
        })
    } catch (err) {
      return "error"
    }
  })
}

//search hub need hub name
async function searchHub(x) {
  return new Promise((resolve, reject) => {
    try {
      axios.get("https://open.faceit.com/data/v4/search/hubs?name=" + encodeURIComponent(x) + "&offset=0&limit=1", {
          headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer ' + ft
          }
        })
        .then(function (response) {
          resolve(response.data)
        })
        .catch(function (error) {
          reject("error")
          console.log(error);
        })
    } catch (err) {
      return "error"
    }
  })
}

// hub info need id?
async function hubInfo(x) {
  return new Promise((resolve, reject) => {
    try {
      axios.get("https://open.faceit.com/data/v4/hubs/" + encodeURIComponent(x), {
          headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer ' + ft
          }
        })
        .then(function (response) {
          resolve(response.data)
        })
        .catch(function (error) {
          reject("error")
          console.log(error);
        })
    } catch (err) {
      return "error"
    }
  })
}

// hub leaderboard hub id?
async function hubLeaderboard(x) {
  return new Promise((resolve, reject) => {
    try {
      axios.get("https://open.faceit.com/data/v4/leaderboards/hubs/" + encodeURIComponent(x) + "/general?offset=0&limit=10", {
          headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer ' + ft
          }
        })
        .then(function (response) {
          resolve(response.data)
        })
        .catch(function (error) {
          reject("error")
          console.log(error);
        })
    } catch (err) {
      return "error"
    }
  })
}

//last 20 games playerid
async function vOneRequest(x) {
  return new Promise((resolve, reject) => {
    try {
      axios.get("https://api.faceit.com/stats/api/v1/stats/time/users/" + encodeURIComponent(x) + "/games/csgo", {

        })
        .then(function (response) {
          resolve(response.data)
        })
        .catch(function (error) {
          reject("error")
          console.log(error);
        })
    } catch (err) {
      return "error"
    }
  })
}

// needed for last games needs number and id
async function historyReq(x, numb) {
  return new Promise((resolve, reject) => {
    try {
      axios.get("https://open.faceit.com/data/v4/players/" + encodeURIComponent(x) + "/history?game=csgo&offset=0&limit=" + numb, {
          headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer ' + ft
          }
        })
        .then(function (response) {
          resolve(response.data)
        })
        .catch(function (error) {
          reject("error")
          console.log(error);
        })
    } catch (err) {
      return "error"
    }
  })
}

//normal stats need id
async function idStats(x) {
  return new Promise((resolve, reject) => {
    try {
      axios.get("https://open.faceit.com/data/v4/players/" + x + "/stats/csgo", {
          headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer ' + ft
          }
        })
        .then(function (response) {
          resolve(response.data)
        })
        .catch(function (error) {
          reject("error")
          console.log(error);
        })
    } catch (err) {
      return "error"
    }
  })
}

//normal stats need id
async function idStatsCheck(x) {
  return new Promise((resolve, reject) => {
    try {
      axios.get("https://open.faceit.com/data/v4/players/" + x, {
          headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer ' + ft
          }
        })
        .then(function (response) {
          resolve(response.data)
        })
        .catch(function (error) {
          reject("error")
          console.log(error);
        })
    } catch (err) {
      return "error"
    }
  })
}

//stats with nickname
async function nickStats(x) {
  return new Promise((resolve, reject) => {
    try {
      axios.get("https://open.faceit.com/data/v4/players?nickname=" + encodeURIComponent(x), {
          headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer ' + ft
          }
        })
        .then(function (response) {
          resolve(response.data)
        })
        .catch(function (error) {
          reject("error")
          console.log(error);
        })
    } catch (err) {
      return "error"
    }
  })
}

//other games id and gameid
async function otherGames(x, game) {
  return new Promise((resolve, reject) => {
    try {
      axios.get("https://open.faceit.com/data/v4/players/" + encodeURIComponent(x) + "/stats/" + game, {
          headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer ' + ft
          }
        })
        .then(function (response) {
          resolve(response.data)
        })
        .catch(function (error) {
          reject("error")
          console.log(error);
        })
    } catch (err) {
      return "error"
    }
  })
}


//player rank in region, needs id and region
async function plRankRegion(x, reg) {
  return new Promise((resolve, reject) => {
    try {
      axios.get("https://open.faceit.com/data/v4/rankings/games/csgo/regions/" + reg + "/players/" + encodeURIComponent(x) + "?limit=1", {
          headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer ' + ft
          }
        })
        .then(function (response) {
          resolve(response.data)
        })
        .catch(function (error) {
          reject("error")
          console.log(error);
        })
    } catch (err) {
      return "error"
    }
  })
}

//player rank in country, needs id and country and region
async function plRankCountry(x, country, reg) {
  return new Promise((resolve, reject) => {
    try {
      axios.get("https://open.faceit.com/data/v4/rankings/games/csgo/regions/" + reg + "/players/" + encodeURIComponent(x) + "?country=" + country + "&limit=1", {
          headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer ' + ft
          }
        })
        .then(function (response) {
          resolve(response.data)
        })
        .catch(function (error) {
          reject("error")
          console.log(error);
        })
    } catch (err) {
      return "error"
    }
  })
}

//region rankings need region
async function rankRegion(reg) {
  return new Promise((resolve, reject) => {
    try {
      axios.get("https://open.faceit.com/data/v4/rankings/games/csgo/regions/" + reg + "?offset=0&limit=15", {
          headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer ' + ft
          }
        })
        .then(function (response) {
          resolve(response.data)
        })
        .catch(function (error) {
          reject("error")
          console.log(error);
        })
    } catch (err) {
      return "error"
    }
  })
}

//ranking country needs region and country
async function rankCountry(country, reg) {
  return new Promise((resolve, reject) => {
    try {
      axios.get("https://open.faceit.com/data/v4/rankings/games/csgo/regions/" + reg + "?country=" + country + "&offset=0&limit=15", {
          headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer ' + ft
          }
        })
        .then(function (response) {
          resolve(response.data)
        })
        .catch(function (error) {
          reject("error")
          console.log(error);
        })
    } catch (err) {
      return "error"
    }
  })
}

// team search needs team
async function teamSearch(team) {
  return new Promise((resolve, reject) => {
    try {
      axios.get("https://open.faceit.com/data/v4/search/teams?nickname=" + encodeURIComponent(team) + "&offset=0&limit=1", {
          headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer ' + ft
          }
        })
        .then(function (response) {
          resolve(response.data)
        })
        .catch(function (error) {
          reject("error")
          console.log(error);
        })
    } catch (err) {
      return "error"
    }
  })
}

// team info needs teamid
async function teamInfo(x) {
  return new Promise((resolve, reject) => {
    try {
      axios.get("https://open.faceit.com/data/v4/teams/" + encodeURIComponent(x), {
          headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer ' + ft
          }
        })
        .then(function (response) {
          resolve(response.data)
        })
        .catch(function (error) {
          reject("error")
          console.log(error);
        })
    } catch (err) {
      return "error"
    }
  })
}

// extra: vote check
async function topggcheck(x) {
  return new Promise((resolve, reject) => {
    try {
      axios.get("https://top.gg/api/bots/770312130037153813/check?userId="+x, {
        })
        .then(function (response) {
          resolve(response.data)
        })
        .catch(function (error) {
          reject("error")
          console.log(error);
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