const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { MongoClient, ServerApiVersion } = require("mongodb");
var crypto = require("crypto");
var { mongodbUrl, faceitloginurl } = require("./../../config.json");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("save")
    .setDescription("Save your FaceIT Name!"),
  async execute(interaction) {
    var randomId = crypto.randomBytes(15).toString("hex");
    var deleted;

    //Store Id
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
        var saveObj = {
          discordName: interaction.user.tag,
          discordID: interaction.user.id,
          randomID: randomId,
          expiresAfter: new Date(),
        };

        var query = { discordID: interaction.user.id };
        var resultQuery = await dbo
          .collection("faceitsaves")
          .find(query)
          .toArray();
        if (resultQuery.length == 0) {
          await dbo
            .collection("faceitloginids")
            .insertOne(saveObj, function (err, res) {
              if (err) throw err;
              console.log("FaceIT /save command used, created 1 login link!");
            });
        } else {
          var myquery = { discordID: interaction.user.id };

          await dbo
            .collection("faceitsaves")
            .deleteOne(myquery, function (err, obj) {
              if (err) throw err;
              console.log(
                "1 document deleted with dID: " + interaction.user.id
              );
            });
          deleted = true;
        }
      } finally {
        // Ensures that the client will close when you finish/error
        await mongoDBClient.close();
      }
    }
    await run();

    if (deleted) {
      embed = new EmbedBuilder()
        .setColor(0xff5500)
        .setTitle("Deleted your FaceIT-Profile from Database!")
        .setDescription("Use /save again to store a new FaceIT User!")
        .setTimestamp();
    } else {
      embed = new EmbedBuilder()
        .setColor(0xff5500)
        .setTitle("Login with your FaceIT-Account!!")
        .setDescription(
          "[Click here to login with FaceIT!](" +
            faceitloginurl +
            "faceitauth/?rid=" +
            randomId +
            ")\nYou will be redirected to an official FaceIT Login Webpage.\nThis Bot does not store sensitive data, it only stores your FaceIT Nickname after successfully logging in.\nThis Link will be invalid after using it or after 3 minutes!\nAfter logging in, you can use '/save' again to delete your FaceIT-Name from the Database!"
        )
        .setTimestamp();
    }

    await interaction.editReply({
      embeds: [embed],
      ephermal: true,
    });
  },
};
