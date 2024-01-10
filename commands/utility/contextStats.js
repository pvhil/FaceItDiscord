const {
  ContextMenuCommandBuilder,
  EmbedBuilder,
  ApplicationCommandType,
} = require("discord.js");
const statsEmbed = require("../../embeds/statsEmbed");
const { createActionRow } = require("../../utility/util");

module.exports = {
  cooldown: 5,
  data: new ContextMenuCommandBuilder()
    .setName("FaceIT Stats")
    .setType(ApplicationCommandType.User),
  async execute(interaction) {
    const targetUser = interaction.targetUser;

    // get faceitname from database by discordid

    const faceitName = "kennyS"; // TODO

    let embed = await statsEmbed.createEmbed(faceitName);

    if (!embed) {
      embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("Wrong FaceIT Name")
        .setDescription("This FaceIT Name is invalid! Try again")
        .setTimestamp();
    }

    await interaction.reply({
      embeds: [embed],
      components: [createActionRow(faceitName)],
      ephemeral: true,
    });
  },
};
