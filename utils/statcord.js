const Statcord = require("statcord.js")

const postCommandToStatcord = (interaction, commandName = null) => {
  if (interaction.client.shard) Statcord.ShardingClient.postCommand(commandName || interaction.commandName, interaction.user.id, client)
}

module.exports = {
  postCommandToStatcord
}