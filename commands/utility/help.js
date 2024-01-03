const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Get Information about this bot!"),
  async execute(interaction) {
    const helpEmbed = new EmbedBuilder()
      .setColor("#FF5500")
      .setTitle("How to use the Bot:")
      .addFields(
        {
          name: "**/stats** faceitname",
          value: "The Main Commands. Shows Statistics about a FaceIT Player",
          inline: true,
        },
        {
          name: "**/last** faceitname opt: count",
          value: "Shows Statistics from the Last 20 Games",
          inline: true,
        },
        {
          name: "**/lastgame** faceitname",
          value: "Shows the latest Game",
          inline: true,
        },
        {
          name: "**/map** faceitname map",
          value: "Shows statistics in every Map",
          inline: true,
        },
        {
          name: "**/save** faceitname",
          value:
            "Will link your FaceIT Profile to this Bot (Rolesystem, RightClick-Stats etc.)",
          inline: true,
        },
        {
          name: "**/help**",
          value: "Shows this Message",
          inline: true,
        },
        {
          name: "**Right Click** on a User",
          value: "Will show Statistics from this User when saved",
          inline: true,
        },
        {
          name: "❓ Helpful Links",
          value:
            "[Top.GG](https://top.gg/bot/770312130037153813) | [Invite Link](https://discord.com/oauth2/authorize?client_id=770312130037153813&permissions=268823616&scope=bot%20applications.commands) | [Support Server](https://discord.gg/DUuCMgXDJC)",
          inline: false,
        }
      )
      .setThumbnail(
        "https://images.discordapp.net/avatars/770312130037153813/704aab707701ace86dd8e737800b4521.png?size=512"
      )
      .setFooter({
        text: "Made by phil (Discord: genuss)",
      });
    await interaction.editReply({ embeds: [helpEmbed] });
  },
};
