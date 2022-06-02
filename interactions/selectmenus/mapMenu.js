const { getMapInteraction } = require("../../commands/map")
const { editInteraction } = require("../../utils/interaction")
const { postCommandToStatcord } = require("../../utils/statcord")

module.exports = async interaction => {
  const name = interaction.values[0] !== "maps" ? interaction.values[0] : "de_dust2"
  const mapStats = await getMapInteraction(interaction, name)

  editInteraction(interaction, mapStats)
  postCommandToStatcord(interaction, "map")
}