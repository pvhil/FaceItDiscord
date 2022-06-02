const {
  MessageActionRow,
  MessageSelectMenu,
} = require('discord.js')
const { postCommandToStatcord } = require('../utils/statcord')
const { getInteractionOption } = require('../utils/interaction')
const { fStats } = require('../embedFinisher')

const getStats = async (interaction) => {
  const name = getInteractionOption(interaction, 'faceitname') || interaction.customId.split('-')[1]
  const resp = await fStats(name)

  const row = new MessageActionRow()
    .addComponents(
      new MessageSelectMenu()
        .setCustomId(`selector-${name}`)
        .setPlaceholder('Change Stats')
        .addOptions([{
          label: 'Normal Stats',
          description: 'Look at the players FaceIt Stats',
          value: 'normal',
          emoji: '<:faceit:907599188152434688>',
        },
        {
          label: 'Latest Game',
          description: 'Look at the players latest game',
          value: 'latest',
          emoji: '<:lastmatch:907598468921589801>',
        },
        {
          label: 'Last 20 Games',
          description: 'Look at the players last 20 Games',
          value: 'last',
          emoji: '<:last20:907598469139685416>',
        },
        {
          label: 'Map Stats',
          description: 'Look at the players performance in certain maps',
          value: 'maps',
          emoji: '🗺️',
        },
        ]),
    )

  postCommandToStatcord(interaction)

  return {
    embeds: [resp],
    components: [row]
  }
}

module.exports = async interaction => {
  await interaction.deferReply()
  const resp = await getStats(interaction)

  interaction.editReply(resp)
}

module.exports.getStats = getStats