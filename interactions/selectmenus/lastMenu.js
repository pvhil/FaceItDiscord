const { fLast } = require("../../embedFinisher")
const { editInteraction, getInteractionOption } = require("../../utils/interaction")
const { postCommandToStatcord } = require("../../utils/statcord")

module.exports = async interaction => {
  const name = getInteractionOption(interaction, "faceitname") || interaction.customId.split("-")[1]
  const last = await fLast(name, 20)

  editInteraction(interaction, { embeds: [last] })
  postCommandToStatcord(interaction, "last")
}