const { MessageEmbed } = require("discord.js")
const { postCommandToStatcord } = require("../utils/statcord")

const helpEmbed = new MessageEmbed()
  .setColor("#FF5500")
  .setTitle("How to use the Bot:")
  .addFields({
    name: "**/stats** faceitname",
    value: "The Main Commands. Shows Statistics about a FaceIT Player",
    inline: true
  }, {
    name: "**/last** faceitname opt: count",
    value: "Shows Statistics from the Last 20 Games",
    inline: true
  }, {
    name: "**/latest** faceitname",
    value: "Shows the latest Game",
    inline: true
  }, {
    name: "**/map** faceitname",
    value: "Shows statistics in every Map",
    inline: true
  }, {
    name: "**/ranking** region opt: country",
    value: "Shows the leaderboard in a region/country",
    inline: true
  }, {
    name: "**/hub** hubname",
    value: "Shows Hub information and leaderboard",
    inline: true
  }, {
    name: "**/team** teamname",
    value: "Shows Team information",
    inline: true
  }, {
    name: "**/save** faceitname",
    value: "Will link your FaceIT Profile to this Bot (Rolesystem, RightClick-Stats etc.)",
    inline: true
  }, {
    name: "**/help**",
    value: "Shows this Message",
    inline: true
  }, {
    name: "**Right Click** on a User",
    value: "Will show Statistics from this User when saved",
    inline: true
  }, {
    name: "❓ Helpful Links",
    value: "[Top.GG](https://top.gg/bot/770312130037153813) | [Invite Link](https://discord.com/oauth2/authorize?client_id=770312130037153813&permissions=268823616&scope=bot%20applications.commands) | [Support Server](https://discord.gg/DUuCMgXDJC)",
    inline: false
  })
  .setThumbnail("https://images.discordapp.net/avatars/770312130037153813/704aab707701ace86dd8e737800b4521.png?size=512")
  .setFooter("Made by phil#0346")

module.exports = async interaction => {
  await interaction.deferReply()

  interaction.editReply({
    embeds: [helpEmbed]
  })
  
  postCommandToStatcord(interaction)
}