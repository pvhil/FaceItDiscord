var express = require("express");
var passport = require("passport");
var session = require("express-session");
var OAuth2Strategy = require("passport-oauth2");
const {
  faceitOauthId,
  faceitOauthSecret,
  mongodbUrl,
} = require("./../config.json");
const { jwtDecode } = require("jwt-decode");
var app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");

app.set("view engine", "ejs");

app.use(
  session({
    secret: "idontthinkthisissupersecurebutitsenough",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);
app.use(passport.initialize());
app.use(passport.session());

var strategy = new OAuth2Strategy(
  {
    authorizationURL: "https://accounts.faceit.com",
    tokenURL: "https://api.faceit.com/auth/v1/oauth/token",
    clientID: faceitOauthId,
    clientSecret: faceitOauthSecret,
    store: true,
    pkce: true,
  },
  function (accessToken, refreshToken, params, profile, done) {
    const userData = jwtDecode(params.id_token);
    done(null, {
      faceitId: userData.guid,
      faceitNickname: userData.nickname,
    });
  }
);

strategy.authorizationParams = function (options) {
  return {
    redirect_popup: true,
  };
};

passport.use(strategy);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.get("/info", async function (req, res) {
  if (req.user) {
    const cookies = req.headers.cookie.split("; ");
    var ridcookie;
    cookies.forEach((element) => {
      if (element.includes("rid=")) {
        ridcookie = element.split("rid=")[1];
      }
    });
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
        var query = { randomID: ridcookie };
        var resultQuery = await dbo
          .collection("faceitloginids")
          .find(query)
          .toArray();
        if (resultQuery.length == 0) {
          res.send("Something bad happened, please try again!");
        } else {
          var saveObj = {
            faceitName: req.user.faceitNickname,
            discordID: resultQuery[0].discordID,
            randomIDUsed: ridcookie,
          };
          //save name
          await dbo
            .collection("faceitsaves")
            .insertOne(saveObj, function (err, res) {
              if (err) throw err;
              console.log("FaceIT /save command used, SAVED one name");
            });

          // delete randomID
          var myquery = { randomID: ridcookie };

          await dbo
            .collection("faceitloginids")
            .deleteOne(myquery, function (err, obj) {
              if (err) throw err;
              console.log("1 document deleted with rid: " + ridcookie);
            });
          res.send(
            `
            <div style="margin: 300px auto;
            max-width: 400px;
            display: flex;
            flex-direction: column;
            align-items: center;
            font-family: sans-serif;"
            >
                <h3>Hi ` +
              resultQuery[0].discordName +
              `! You logged in with your FaceIT Account "` +
              req.user.faceitNickname +
              `"</h3>
                <p>Please use the "/save" command again to delete your FaceIT-Profile from your Discord Profile</p>
            </div>
        `
          );
        }
      } finally {
        // Ensures that the client will close when you finish/error
        await mongoDBClient.close();
      }
    }
    await run();
  } else res.redirect("/");
});

app.get("/bad", function (req, res) {
  res.send(
    `
      <div style="margin: 300px auto;
      max-width: 400px;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-family: sans-serif;"
      >
          <h3>Linking with your FaceIT-Account failed!"</h3>
          <p>Please try again with "/save"</p>
      </div>
  `
  );
});

app.get("/faceitauth", async (req, res) => {
  try {
    if (!req.query.rid) {
      res.send(`
          <div style="margin: 300px auto;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: sans-serif;"
          >
              <h3>This is the FaceIT Discord Bot Authentication Website by phil</h3>
              <p>Please use the "/save" command in your discord server to link your accounts!</p>
          </div>
      `);
    } else {
      //get information
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
          var query = { randomID: req.query.rid };
          var resultQuery = await dbo
            .collection("faceitloginids")
            .find(query)
            .toArray();
          if (resultQuery.length == 0) {
            res.send(
              `
              <div style="margin: 300px auto;
              max-width: 400px;
              display: flex;
              flex-direction: column;
              align-items: center;
              font-family: sans-serif;"
              >
                  <h3>This is the FaceIT Discord Bot Authentication Site"</h3>
                  <p>Please use the "/save" command again to delete your FaceIT-Profile from your Discord Profile</p>
              </div>
          `
            );
          } else {
            res.cookie("rid", resultQuery[0].randomID);
            res.send(
              `
              <div style="margin: 300px auto;
              max-width: 400px;
              display: flex;
              flex-direction: column;
              align-items: center;
              font-family: sans-serif;"
              >
                  <h3>Hi ` +
                resultQuery[0].discordName +
                `! Please login with FaceIT to link your Accounts!</h3>
                  <p>This link will redirect you to an official FaceIT Login Site. We have no access to your username and password. After logging in, we will only store your FaceITName, Discord-ID and Discord-Name in our database</p>
                  <p>This link will be invalid after successfully logging in or in 3 minutes!</p>
                  <a href="/auth/faceit?rid=` +
                resultQuery[0].randomID +
                `">Login with FaceIT</a>
              </div>
          `
            );
          }
        } finally {
          // Ensures that the client will close when you finish/error
          await mongoDBClient.close();
        }
      }
      await run();
    }
  } catch (err) {
    console.log(err);
    res.send("Service not working right now, please try again later!");
  }
});

app.get("/auth/faceit", passport.authenticate("oauth2"));

app.get(
  "/auth/faceit/callback",
  passport.authenticate("oauth2", {
    successRedirect: "/info",
    failureRedirect: "/bad",
  }),
  function (req, res) {
    console.log(req.params);
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

module.exports = app;
