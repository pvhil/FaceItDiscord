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
        shard.send({type: "shardId", data: {shardId: shard.id}});
    });
});

manager.spawn();