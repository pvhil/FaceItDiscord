const { ShardingManager } = require("discord.js");
const { token, expressPort, mongodbUrl } = require("./config.json");
const https = require("https");
const { MongoClient, ServerApiVersion } = require("mongodb");

// Auth server
const app = require("./web/faceitAuth");

const server = https.createServer(app).listen(expressPort, () => {
  console.log("FaceIT OAuth Server listening on port " + expressPort);
});

//test db
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
    // Send a ping to confirm a successful connection
    await mongoDBClient.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    // Create collection if not exists TODO

    // Create if not exists index to delete ids
    await mongoDBClient
      .db("FaceITDiscordBot")
      .collection("faceitloginids")
      .createIndex({ expiresAfter: 1 }, { expireAfterSeconds: 180 });
    console.log("Created Index in MongoDB");
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoDBClient.close();
  }
}
run().catch(console.dir);

const manager = new ShardingManager("./bot.js", {
  token: token,
});

manager.on("shardCreate", (shard) => console.log(`Launched shard ${shard.id}`));

manager.spawn();
