const { fLast } = require('../embedFinisher')
const { getInteractionOption } = require('../utils/interaction')

module.exports = async interaction => {
  await interaction.deferReply()
  const name = getInteractionOption(interaction, 'faceitname')
  const count = getInteractionOption(interaction, 'games')
  const resp = await fLast(name, count || 20)
  interaction.editReply({
    embeds: [resp]
  })
}