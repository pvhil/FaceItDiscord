const { Events } = require("discord.js");
const { createActionRow } = require("../utility/util");
const lastEmbed = require("../embeds/lastEmbed");
const lastgameEmbed = require("../embeds/lastgameEmbed");
const statsEmbed = require("../embeds/statsEmbed");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    // select menu
    if (interaction.isStringSelectMenu()) {
      if (interaction.customId.includes("select")) {
        interaction.deferUpdate();
        let name = interaction.customId.split("-")[1];

        if (interaction.values[0] == "last") {
          let embed = await lastEmbed.createEmbed(name, 20);
          await interaction.editReply({
            embeds: [embed],
            components: [createActionRow(name)],
          });
        } else if (interaction.values[0] == "latest") {
          let embed = await lastgameEmbed.createEmbed(name);
          await interaction.editReply({
            embeds: [embed],
            components: [createActionRow(name)],
          });
        } else if (interaction.values[0] == "normal") {
          let embed = await statsEmbed.createEmbed(name);
          await interaction.editReply({
            embeds: [embed],
            components: [createActionRow(name)],
          });
        }
      }
    }

    // Context Menu
    if (interaction.isContextMenuCommand()) {
      try {
        const command = interaction.client.commands.get(
          interaction.commandName
        );
        await command.execute(interaction);
      } catch (error) {
        console.log(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content:
              "There was an error while executing this command! Maybe this User has never played CS2 on FaceIT?",
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content:
              "There was an error while executing this command! Maybe this User has never played CS2 on FaceIT?",
            ephemeral: true,
          });
        }
      }
    }

    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`
        );
        return;
      }

      try {
        console.log(interaction.commandName + " used");
        // check if command is protected
        if (interaction.commandName === "save") {
          await interaction.deferReply({ ephemeral: true });
        } else {
          await interaction.deferReply();
        }
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content:
              "There was an error while executing this command! Maybe this User has never played CS2 on FaceIT?",
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content:
              "There was an error while executing this command! Maybe this User has never played CS2 on FaceIT?",
            ephemeral: true,
          });
        }
      }
    }
  },
};
