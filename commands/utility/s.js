const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const statsEmbed = require("../../embeds/statsEmbed");
const { createActionRow } = require("../../utility/util");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("s")
    .setDescription("Get FaceIT statistics of your saved user!"),
  async execute(interaction) {
    const discordUser = interaction.user;

    // logic getting faceitname by discord id
    if (!embed) {
        embed = new EmbedBuilder()
          .setColor("#ff0000")
          .setTitle("No FaceIT Name stored!")
          .setDescription("Please save your username with /save before using this command!")
          .setTimestamp();

          await interaction.editReply({
            embeds: [embed],
            components: [createActionRow(faceitName)],
          });
          return;
      }


    const faceitName = interaction.options.getString("name");

    let embed = await statsEmbed.createEmbed(faceitName);

    if (!embed) {
      embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("Wrong FaceIT Name")
        .setDescription("This FaceIT Name is invalid! Please store a new username!")
        .setTimestamp();
    }

    await interaction.editReply({
      embeds: [embed],
      components: [createActionRow(faceitName)],
    });
  },
};
