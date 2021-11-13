const dotenv = require("dotenv").config()
const {
    ShardingManager
} = require("discord.js");
const Statcord = require("statcord.js");

//check envs
console.log(process.env.BOTTOKEN)
console.log(process.env.STATTOKEN)
console.log(process.env.PGTOK)
console.log(process.env.FACEITTOKEN)
console.log(process.env.TOPTOKEN)

const manager = new ShardingManager("./bot.js", {
    token: (process.env.BOTTOKEN).toString()
});

const statcord = new Statcord.ShardingClient({
    key: process.env.STATTOKEN,
    manager,
    postCpuStatistics: true,
    postMemStatistics: true,
    postNetworkStatistics: true,
    autopost: true
});

manager.on("shardCreate", shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();

statcord.on("autopost-start", () => {
    console.log("Started autopost");
});

statcord.on("post", status => {
    if (!status) console.log("Successful post");
    else console.error(status);
});