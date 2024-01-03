const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const mapEmbed = require("../../embeds/mapEmbed");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("map")
    .setDescription("Get your statistics in a certain map!")
    .addStringOption((option) =>
      option.setName("name").setDescription("FaceIT Name").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("map").setDescription("Choose the Map").setRequired(true)
    ),
  async execute(interaction) {
    const faceitName = interaction.options.getString("name");
    let games = interaction.options.getInteger("games");
    if (games == null) {
      games = 20;
    }

    let embed = await mapEmbed.createEmbed(faceitName, games);

    if (!embed) {
      embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("Wrong FaceIT Name or invalid Map")
        .setDescription("This FaceIT Name or Map is invalid! Try again")
        .setTimestamp();
    }

    await interaction.editReply({ embeds: [embed] });
  },
};
