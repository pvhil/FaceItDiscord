const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js')
const { fStats } = require('../../embedFinisher')
const { syncQuery } = require('../../utils/postgres')

module.exports = async (interaction) => {
  await interaction.deferReply()

  let notLinked = false

  const tId = interaction.targetId
  const res = await syncQuery('SELECT * FROM stats WHERE discord=$1', [tId]).catch(() => {
    const errembed = new MessageEmbed()
      .setColor('#ff0000')
      .setTitle('This User has not linked his FaceIT Profile!')
      .setDescription('This User has no FaceIT Profile linked.\n He can link one with **/save**')
      .setTimestamp()

    notLinked = true

    interaction.editReply({
      embeds: [errembed],
      ephemeral: true
    })
  })

  if (notLinked) return

  const resp = await fStats(res.rows[0].faceit)
  const row = new MessageActionRow()
    .addComponents(
      new MessageSelectMenu()
        .setCustomId('selector-' + res.rows[0].faceit)
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
        }]))

  interaction.editReply({
    embeds: [resp],
    components: [row]
  })

  postCommandToStatcord(interaction, 'Contextstats')
}