const dotenv = require('dotenv').config()
const discordToken = process.env.BOTTOKEN
const {
    ShardingManager
} = require('discord.js');

const manager = new ShardingManager('./rolesystem.js', {
    token: discordToken
});

manager.on('shardCreate', shard => {
    shard.on("ready", () => {
        console.log(`[DEBUG/SHARD] Shard ${shard.id} connected to Discord's Gateway.`)
        shard.send({type: "shardId", data: {shardId: shard.id}});
    });
});

manager.spawn();
