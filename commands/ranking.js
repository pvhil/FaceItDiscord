const { fRanking } = require("../embedFinisher")
const { getInteractionOption } = require("../utils/interaction")
const { postCommandToStatcord } = require("../utils/statcord")

module.exports = async interaction => {
  await interaction.deferReply()
  const region = getInteractionOption(interaction, "region")
  const country = getInteractionOption(interaction, "country")
  const resp = await fRanking(region, country)

  postCommandToStatcord(interaction)

  interaction.editReply({
    embeds: [resp]
  })
}