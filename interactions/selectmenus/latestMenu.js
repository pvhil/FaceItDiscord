const { fLatest } = require("../../embedFinisher")
const { editInteraction, getInteractionOption } = require("../../utils/interaction")
const { postCommandToStatcord } = require("../../utils/statcord")

module.exports = async interaction => {
  const name = getInteractionOption(interaction, "faceitname") || interaction.customId.split("-")[1]
  const latest = await fLatest(name)

  editInteraction(interaction, { embeds: [latest] })
  postCommandToStatcord(interaction, "latest")
}