const { Client, Intents } = require("discord.js")
const { nickStats } = require("../faceitRequests")
const { syncQuery } = require("../utils/postgres")
require("dotenv").config()

const discordToken = process.env.BOTTOKEN
const client = new Client({
  intents: [Intents.FLAGS.GUILDS]
})

const sleep = ms => new Promise((resolve) => setTimeout(resolve, ms))

let shardid = 0

process.on("message", async message => {
  if (!message.type || message.type != "shardId") return

  console.log(`The shard id is: ${message.data.shardId}`)
  shardid = message.data.shardId
  await sleep(10000)
  refreshRoles()
  setInterval(refreshRoles, 3600000)
})

async function refreshRoles() {
  console.log("-----Started Refreshing Roles-----")

  const count = await syncQuery("SELECT COUNT(*) AS rowcount FROM stats")
  let number = parseInt(count.rows[0].rowcount), n = 3, values = [], endInt = number

  console.log(number)
  console.log(endInt)
  console.log(count.rows[0].rowcount)
  console.log()

  while (number > 0 && n > 0) {
    let a = Math.floor(number / n)
    number -= a
    n--
    values.push(a)
  }

  let startInt = 0

  if (shardid >= 0) startInt = startInt + 0
  else if (shardid >= 1) startInt = startInt + values[0]
  else if (shardid >= 2) startInt = startInt + values[2]
  else if (shardid <= 2) endInt = endInt - 0
  else if (shardid <= 1) endInt = endInt - values[1]
  else if (shardid <= 0) endInt = endInt - values[2]

  console.log("start: ", startInt, "end: ", endInt)

  const userReq = await syncQuery("SELECT * FROM stats"),
    guildReq = await syncQuery("SELECT * FROM levelrole")

  console.log("Users: " + count.rows[0].rowcount)

  for (let i = startInt; i < endInt; i++) {
    console.log("----\n User Nr. " + i)

    const faceItName = userReq.rows[i].faceit
    let fLevel

    try {
      const resp = await nickStats(faceItName)
      fLevel = resp.games.csgo["skill_level"]
    } catch (e) {
      console.log("invalid faceitname?: " + faceItName)
      await syncQuery("DELETE FROM stats WHERE faceit=$1", [faceItName])
      continue
    }

    console.log("FaceIt: " + faceItName)
    console.log("FaceIt Level: " + fLevel)
    console.log("Discord ID: " + userReq.rows[i].discord)

    for (let a = 0; a < guildReq.rows.length; a++) {
      console.log("-\nGuild Nr. " + a)
      console.log("Guild ID: " + guildReq.rows[a].discordid)

      let fetchedGuild, fetchedMember

      try {
        fetchedGuild = await client.guilds.fetch(guildReq.rows[a].discordid)
      } catch (e) {
        //delete guild
        console.log("Bot Left Guild. Deleting from Database")
        await syncQuery("DELETE FROM levelrole WHERE discordid=$1", [guildReq.rows[a].discordid])
        continue
      }

      try {
        fetchedMember = await fetchedGuild.members.fetch(userReq.rows[i].discord)
      } catch (e) {
        console.log("Not in this Server. Next Guild")
        continue
      }

      let levelRole = await syncQuery("SELECT * FROM levelrole WHERE discordid=$1", [guildReq.rows[a].discordid])

      try {
        if (!(fetchedMember.roles.cache.has(levelRole.rows[0]["level" + fLevel]))) {
          const arrRoles = []
          for (var l = 1; l < 11; l++) arrRoles.push(levelRole.rows[0]["level" + l])

          await fetchedMember.roles.remove(arrRoles, "RoleSystem")
          await fetchedMember.roles.add(levelRole.rows[0]["level" + fLevel], "RoleSystem")

          console.log("Changed Role")
        } else {
          console.log("No Role Change \n-")
          continue
        }
      } catch (e) {
        console.log("invalid roles! deleting server")
        await syncQuery("DELETE FROM levelrole WHERE discordid=$1", [guildReq.rows[a].discordid])
        continue
      }
      console.log("-")
    }
    console.log("----")
  }
  console.log("-----Ended Refreshing Roles-----")
}

client.login(discordToken)
