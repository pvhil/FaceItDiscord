const {
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
} = require("discord.js");

function createActionRow(faceitName) {
  const select = new StringSelectMenuBuilder()
    .setCustomId("selector-" + faceitName)
    .setPlaceholder("Change Stats")
    .addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel("Normal Stats")
        .setDescription("Look at the players FaceIt Stats")
        .setValue("normal")
        .setEmoji("<:faceit:907599188152434688>"),
      new StringSelectMenuOptionBuilder()
        .setLabel("Latest Game")
        .setDescription("Look at the players latest game")
        .setValue("latest")
        .setEmoji("<:lastmatch:907598468921589801>"),
      new StringSelectMenuOptionBuilder()
        .setLabel("Last 20 Games")
        .setDescription("Look at the players last 20 Games")
        .setValue("last")
        .setEmoji("<:last20:907598469139685416>")
    );

  const row = new ActionRowBuilder().addComponents(select);

  return row;
}

module.exports = {
  createActionRow,
};
