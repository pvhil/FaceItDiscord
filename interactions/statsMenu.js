const { getStats } = require('../commands/stats')
const { editInteraction } = require('../utils/interaction')

module.exports = async interaction => {
  editInteraction(interaction, await getStats(interaction))
}