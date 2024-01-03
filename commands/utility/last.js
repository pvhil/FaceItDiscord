const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const lastEmbed = require("../../embeds/lastEmbed");
const { createActionRow } = require("../../utility/util");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("last")
    .setDescription(
      "Get information about your last X Games! (Default: 20 Games)"
    )
    .addStringOption((option) =>
      option.setName("name").setDescription("FaceIT Name").setRequired(true)
    )
    .addIntegerOption((option) =>
      option.setName("games").setDescription("Amount of Games")
    ),
  async execute(interaction) {
    const faceitName = interaction.options.getString("name");
    let games = interaction.options.getInteger("games");
    if (games == null) {
      games = 20;
    }

    let embed = await lastEmbed.createEmbed(faceitName, games);

    if (!embed) {
      embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("Wrong FaceIT Name")
        .setDescription("This FaceIT Name is invalid! Try again")
        .setTimestamp();
    }

    await interaction.editReply({
      embeds: [embed],
      components: [createActionRow(faceitName)],
    });
  },
};
