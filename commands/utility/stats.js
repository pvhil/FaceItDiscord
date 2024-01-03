const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const statsEmbed = require("../../embeds/statsEmbed");
const { createActionRow } = require("../../utility/util");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Get basic FaceIT Statistics!")
    .addStringOption((option) =>
      option.setName("name").setDescription("FaceIT Name").setRequired(true)
    ),
  async execute(interaction) {
    const faceitName = interaction.options.getString("name");

    let embed = await statsEmbed.createEmbed(faceitName);

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
