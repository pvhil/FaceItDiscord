const { MessageSelectMenu, MessageActionRow, MessageButton } = require("discord.js")
const { fMap } = require("../embedFinisher")
const { getInteractionOption } = require("../utils/interaction")
const { postCommandToStatcord } = require("../utils/statcord")

const getMapInteraction = async (interaction, map) => {
  const faceitname = getInteractionOption(interaction, "faceitname") || interaction.customId.split("-")[1]
  const resp = await fMap(faceitname, map)
  const row = new MessageActionRow()
    .addComponents(new MessageSelectMenu()
      .setCustomId("maps-" + faceitname)
      .setPlaceholder("Change Map")
      .addOptions([{
        label: "Dust2",
        description: "Performance in Dust2",
        value: "de_dust2",
        emoji: "<:dust2:907604904745529395>",
      },
      {
        label: "Mirage",
        description: "Performance in Mirage",
        value: "de_mirage",
        emoji: "<:mirage:907604905089454110>",
      },
      {
        label: "Inferno",
        description: "Performance in Inferno",
        value: "de_inferno",
        emoji: "<:inferno:907604904858751017>",
      },
      {
        label: "Nuke",
        description: "Performance in Nuke",
        value: "de_nuke",
        emoji: "<:nuke:907604905244647454>",
      },
      {
        label: "Overpass",
        description: "Performance in Overpass",
        value: "de_overpass",
        emoji: "<:overpass:907604905097842719>",
      },
      {
        label: "Ancient",
        description: "Performance in Ancient",
        value: "de_ancient",
        emoji: "<:ancient:907605107720466442>",
      },
      {
        label: "Vertigo",
        description: "Performance in Vertigo",
        value: "de_vertigo",
        emoji: "<:vertigo:907604905097826384>",
      },
      {
        label: "Train",
        description: "Performance in Train",
        value: "de_train",
        emoji: "<:train:907604905097842718>",
      }]))

  const exit = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId("stats-" + faceitname)
        .setEmoji("↩️")
        .setLabel("Main Stats")
        .setStyle("PRIMARY"))

  return {
    embeds: [resp],
    components: [row, exit]
  }
}

module.exports = async (interaction) => {
  await interaction.deferReply()
  const resp = await getMapInteraction(interaction)
  interaction.editReply(resp)
  postCommandToStatcord(interaction)
}

module.exports.getMapInteraction = getMapInteraction