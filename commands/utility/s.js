const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { MongoClient, ServerApiVersion } = require("mongodb");

const statsEmbed = require("../../embeds/statsEmbed");
const { createActionRow } = require("../../utility/util");
var { mongodbUrl } = require("./../../config.json");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("s")
    .setDescription("Get FaceIT statistics of your saved user!"),
  async execute(interaction) {
    const discordUser = interaction.user;
    var faceitName;

    const mongoDBClient = new MongoClient(mongodbUrl, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    async function run() {
      try {
        // Connect the client to the server	(optional starting in v4.7)
        await mongoDBClient.connect();
        var dbo = mongoDBClient.db("FaceITDiscordBot");
        var query = { discordID: discordUser.id };
        var resultQuery = await dbo
          .collection("faceitsaves")
          .find(query)
          .toArray();
        if (resultQuery.length == 0) {
          faceitName = false;
        } else {
          faceitName = resultQuery[0].faceitName;
        }
      } finally {
        // Ensures that the client will close when you finish/error
        await mongoDBClient.close();
      }
    }
    await run();

    let embed;
    if (!faceitName) {
      embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("No FaceIT Name stored!")
        .setDescription(
          "Please save a new username with /save before using this command again!"
        )
        .setTimestamp();

      await interaction.editReply({
        embeds: [embed],
      });
      return;
    }

    console.log(faceitName);
    embed = await statsEmbed.createEmbed(faceitName);

    if (!embed) {
      embed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("Wrong FaceIT Name")
        .setDescription(
          "This FaceIT Name is invalid! Please store a new username!"
        )
        .setTimestamp();
    }

    await interaction.editReply({
      embeds: [embed],
      components: [createActionRow(faceitName)],
    });
  },
};
