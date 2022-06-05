const { MessageEmbed, Permissions } = require("discord.js")
const { topggcheck } = require("../faceitRequests")
const { syncQuery } = require("../utils/postgres")

module.exports = async interaction => {
  await interaction.deferReply({ ephemeral: true })
  if (!(interaction.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES))) {
    const errembed = new MessageEmbed()
      .setColor("#ff0000")
      .setTitle("You do not have enough Permissions!")
      .setDescription("You need MANAGE ROLES to change the settings")
      .setTimestamp()
    interaction.editReply({
      embeds: [errembed],
      ephemeral: true
    })
  }

  if (interaction.options.getSubcommand() == "rolesystem") {
    try {
      const gId = interaction.guild.id
      const roles = []
      const botrole = interaction.guild.roles.botRoleFor(interaction.guild.me)

      var topggvote = await topggcheck(interaction.user.id)
      if (topggvote.voted != 1) {
        const errembed = new MessageEmbed()
          .setColor("#ff0000")
          .setTitle("You need to vote for the Bot to use this Feature!")
          .setDescription("Please vote for our bot [here](https://top.gg/bot/770312130037153813/vote) to use the Rolesystem.\nThank you!")
          .setTimestamp()
        interaction.editReply({
          embeds: [errembed],
          ephemeral: true
        })

        return
      }

      for (var i = 1; i < 11; i++) {
        roles.push(interaction.options.getRole("level" + i).id)
        if (interaction.options.getRole("level" + i).comparePositionTo(botrole) > 0) {
          console.log("not interactable")
          const errembed = new MessageEmbed()
            .setColor("#ff0000")
            .setTitle("Cant interact with these Roles!")
            .setDescription("My BotRole Position is too low! Please move my Role (FaceItBot) in the Role Settings of this Server to the top!\nLook at the video down below for more help.")
            .setImage("https://raw.githubusercontent.com/pvhil/FaceItDiscord/master/pictures/rolehelp.gif")
            .setTimestamp()
          interaction.editReply({
            embeds: [errembed],
            ephemeral: true
          })

          return
        }
      }

      syncQuery("INSERT INTO levelrole(discordid,level1,level2,level3,level4,level5,level6,level7,level8,level9,level10) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ON CONFLICT ON CONSTRAINT levelrole_pkey DO UPDATE SET discordid=EXCLUDED.discordid;", [gId, roles[0], roles[1], roles[2], roles[3], roles[4], roles[5], roles[6], roles[7], roles[8], roles[9]])
        .then(() => {
          const errembed = new MessageEmbed()
            .setColor("#FF5500")
            .setTitle("Activated the Role System!")
            .setDescription("Bot automatically assigns Role to users by their FaceIT Level! \n It will check every hour for level updates.\n Users have to use .faceitrole *name* to use the system")
            .addFields({
              name: "Level 1",
              value: "<@&" + roles[0] + ">",
              inline: true
            }, {
              name: "Level 2",
              value: "<@&" + roles[1] + ">",
              inline: true
            }, {
              name: "Level 3",
              value: "<@&" + roles[2] + ">",
              inline: true
            }, {
              name: "Level 4",
              value: "<@&" + roles[3] + ">",
              inline: true
            }, {
              name: "Level 5",
              value: "<@&" + roles[4] + ">",
              inline: true
            }, {
              name: "Level 6",
              value: "<@&" + roles[5] + ">",
              inline: true
            }, {
              name: "Level 7",
              value: "<@&" + roles[6] + ">",
              inline: true
            }, {
              name: "Level 8",
              value: "<@&" + roles[7] + ">",
              inline: true
            }, {
              name: "Level 9",
              value: "<@&" + roles[8] + ">",
              inline: true
            }, {
              name: "Level 10",
              value: "<@&" + roles[9] + ">",
              inline: true
            })
            .setTimestamp()

          interaction.editReply({
            embeds: [errembed],
            ephemeral: true
          })
        })
    } catch (e) {
      const errembed = new MessageEmbed()
        .setColor("#ff0000")
        .setTitle("?")
        .setDescription("unknown error")
        .setTimestamp()

      interaction.editReply({
        embeds: [errembed],
        ephemeral: true
      })
    }
  }
}