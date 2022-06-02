const { getStats } = require('../../commands/stats')
const { editInteraction } = require('../../utils/interaction')

module.exports = interaction => {
  interaction.deferUpdate()
    .then(async () => {
      editInteraction(interaction, await getStats(interaction))
    })
}