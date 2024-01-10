const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const statsEmbed = require("../../embeds/statsEmbed");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("save")
    .setDescription("Save your FaceIT Name!")
    .addStringOption((option) =>
      option.setName("name").setDescription("FaceIT Name").setRequired(true)
    ),
  async execute(interaction) {
    const faceitName = interaction.options.getString("name");

    // primitive way to test if name is correcet
    let embed = await statsEmbed.createEmbed(faceitName);
    if (!embed) {
      embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("Wrong FaceIT Name")
        .setDescription("This FaceIT Name is invalid! Try again")
        .setTimestamp();
    } else {
      // database store logic

      embed = new EmbedBuilder()
        .setColor(0xff5500)
        .setTitle("Successfully stored your FaceIT Name!")
        .setDescription(
          "You can now use shorter commands, the rolesystem and other user can right-click you to see your statistics!"
        )
        .setTimestamp();
    }

    await interaction.editReply({
      embeds: [embed],
    });
  },
};
