const {
  ContextMenuCommandBuilder,
  EmbedBuilder,
  ApplicationCommandType,
} = require("discord.js");
const statsEmbed = require("../../embeds/statsEmbed");
const { createActionRow } = require("../../utility/util");
const { MongoClient, ServerApiVersion } = require("mongodb");
var { mongodbUrl } = require("./../../config.json");

module.exports = {
  cooldown: 5,
  data: new ContextMenuCommandBuilder()
    .setName("FaceIT Stats")
    .setType(ApplicationCommandType.User),
  async execute(interaction) {
    const targetUser = interaction.targetUser;
    var faceitName;

    // get faceitname from database by discordid
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
        var query = { discordID: targetUser.id };
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
        .setDescription("This user has to /save a FaceIT Name!")
        .setTimestamp();

      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      return;
    }

    console.log(faceitName);

    embed = await statsEmbed.createEmbed(faceitName);

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
    });
  },
};
