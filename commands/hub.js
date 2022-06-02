const { fHub } = require("../embedFinisher")
const { getInteractionOption } = require("../utils/interaction")
const { postCommandToStatcord } = require("../utils/statcord")

module.exports = async interaction => {
  await interaction.deferReply()
  
  var hub = getInteractionOption(interaction, "hub")
  var resp = await fHub(hub)

  if (resp.length == 2) await interaction.editReply({
    embeds: [resp[0], resp[1]]
  })
  else await interaction.editReply({
    embeds: [resp[0]]
  })

  postCommandToStatcord(interaction)
}