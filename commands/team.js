const { fTeam } = require("../embedFinisher")
const { getInteractionOption } = require("../utils/interaction")
const { postCommandToStatcord } = require("../utils/statcord")

module.exports = async interaction => {
  await interaction.deferReply()
  var team = getInteractionOption(interaction, "team")
  var resp = await fTeam(team)
  
  postCommandToStatcord(interaction)

  interaction.editReply({
    embeds: [resp]
  })
}
