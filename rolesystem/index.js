require("dotenv").config()

const {
  ShardingManager
} = require("discord.js")

const manager = new ShardingManager("./rolesystem.js", {
  token: process.env.BOTTOKEN
})

manager.on("shardCreate", shard => {
  shard.on("ready", () => {
    shard.send({type: "shardId", data: {shardId: shard.id}})
  })
})

manager.spawn()