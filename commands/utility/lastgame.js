const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const lastgameEmbed = require("../../embeds/lastgameEmbed");
const { createActionRow } = require("../../utility/util");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("lastgame")
    .setDescription("Get Information about your last game!")
    .addStringOption((option) =>
      option.setName("name").setDescription("FaceIT Name").setRequired(true)
    ),
  async execute(interaction) {
    const faceitName = interaction.options.getString("name");

    let embed = await lastgameEmbed.createEmbed(faceitName);

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
