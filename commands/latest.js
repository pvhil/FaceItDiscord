const faceit = require('../embedFinisher')
const { getInteractionOption } = require('../utils/interaction')
const { postCommandToStatcord } = require('../utils/statcord')

module.exports = async interaction => {
  await interaction.deferReply()
  const name = getInteractionOption(interaction, 'faceitname')
  const resp = await faceit.fLatest(name)

  postCommandToStatcord(interaction)

  interaction.editReply({
    embeds: [resp]
  })
}