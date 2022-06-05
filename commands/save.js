const { MessageEmbed } = require("discord.js")
const { getInteractionOption } = require("../utils/interaction")
const { syncQuery } = require("../utils/postgres")

module.exports = async interaction => {
  await interaction.deferReply()
  const name = getInteractionOption(interaction, "faceit")
  const uId = interaction.user.id

  try {
    const valid = await fr.nickStats(name)
    const level = valid.games.csgo["skill_level"]

    console.log(level)

    syncQuery("INSERT INTO stats(discord,faceit) VALUES ($1,$2) ON CONFLICT ON CONSTRAINT stats_pkey DO UPDATE SET faceit=EXCLUDED.faceit;", [uId, name])
      .then(() => {
        const errembed = new MessageEmbed()
          .setColor("#FF5500")
          .setTitle("Saved your FaceIT Name")
          .setDescription("You will gain Level-Specific Roles when the Rolesystem is activated.\nOther Users also can Right-Click on you to see Statistics")
          .setTimestamp()

        interaction.editReply({
          embeds: [errembed],
          ephemeral: true
        })
        postCommandToStatcord(interaction)
      })

  } catch (err) {
    const errembed = new MessageEmbed()
      .setColor("#ff0000")
      .setTitle("This FaceIT-Name is invalid!")
      .setDescription("Remember that the FaceIT Name is case-sensetive!")
      .setTimestamp()

    interaction.editReply({
      embeds: [errembed],
      ephemeral: true
    })
  }

  const guildid = interaction.guild.id

  try {
    const guildInfo = await syncQuery(`SELECT * FROM levelrole WHERE discordid=$1`, [guildid])
    if (guildInfo.rows.length === 1) await interaction.member.roles.add(guildInfo.rows[0]["level" + level])
  } catch (e) {
    console.log("no rolesystem")
  }
}