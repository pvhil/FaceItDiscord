const dotenv = require('dotenv').config()
const ft = process.env.FACEITTOKEN
const axios = require('axios');


const pg = require('pg').Client;

const discordToken = process.env.BOTTOKEN
const pgcred = JSON.parse(process.env.PGTOK)


const pgclient = new pg(pgcred);

pgclient.connect();

const {
	Client,
	Intents,
} = require('discord.js');
const client = new Client({
	intents: [Intents.FLAGS.GUILDS]
});

async function syncQuery(query) {
	return new Promise((resolve, reject) => {
		try {
			pgclient.query(query, (err, res) => {
				resolve(res)
			})

		} catch (err) {
			return "error"
		}
	})
}

var shardid = 0

process.on("message", message => {
    if (!message.type) return false;

    if (message.type == "shardId") {
        console.log(`The shard id is: ${message.data.shardId}`);
		shardid = message.data.shardId
		refreshRoles()
		setInterval(refreshRoles, 3600000);
    };
});

async function nickStats(x) {
	return new Promise((resolve, reject) => {
	  try {
		axios.get("https://open.faceit.com/data/v4/players?nickname=" + encodeURIComponent(x), {
			headers: {
			  'accept': 'application/json',
			  'Authorization': 'Bearer ' + ft
			}
		  })
		  .then(function (response) {
			resolve(response.data)
		  })
		  .catch(function (error) {
			reject("error")
			console.log(error);
		  })
	  } catch (err) {
		return "error"
	  }
	})
  }


async function refreshRoles(){
	console.log("-----Started Refreshing Roles-----")

	var count = await syncQuery("SELECT COUNT(*) AS rowcount FROM stats")

	var number = parseInt(count.rows[0].rowcount);
	var n = 3;
	var values = [];
	var endInt = number
	console.log(number)
	console.log(endInt)
	console.log(count.rows[0].rowcount)
	console.log()



	while (number > 0 && n > 0) {
		var a = Math.floor(number / n ) ;
		number -= a;
		n--;
		values.push(a);
	} 
	
	var startInt = 0
	if(shardid >= 0){
		startInt = startInt + 0
	}if(shardid >= 1){
		startInt = startInt + values[0]
	}if(shardid >= 2){
		startInt = startInt + values[2]
	}
	if(shardid <= 2){
		endInt = endInt - 0
	}if(shardid <= 1){
		endInt = endInt - values[1]
	}if(shardid <= 0){
		endInt = endInt - values[2]
	}
	

	console.log(startInt)
	console.log(endInt)

	var userReq = await syncQuery("SELECT * FROM stats")
	var guildReq = await syncQuery("SELECT * FROM levelrole")
	console.log("Users: "+count.rows[0].rowcount)


	for(var i=startInt; i < endInt;i++){
		console.log("----\n User Nr. "+i)
		var faceItName = userReq.rows[i].faceit 
		try{
		var resp = await nickStats(faceItName)
		var fLevel = resp.games.csgo["skill_level"]
		}catch(e){
			console.log("invalid faceitname?: "+faceItName)
			await syncQuery("DELETE FROM stats WHERE faceit='"+faceItName+"'")
			continue
		}
		console.log("FaceIt: "+faceItName)
		console.log("FaceIt Level: "+fLevel)
		console.log("Discord ID: "+userReq.rows[i].discord)

		for(var a =0; a< guildReq.rows.length;a++){
			console.log("-\nGuild Nr. "+a)
			console.log("Guild ID: "+guildReq.rows[a].discordid)
			try{
			var fetchedGuild = await client.guilds.fetch(guildReq.rows[a].discordid)
			}catch (e){
				//delete guild
				console.log("Bot Left Guild. Deleting from Database")
				await syncQuery("DELETE FROM levelrole WHERE discord='"+guildReq.rows[a].discordid+"'")
				continue
			}
			try{
			var fetchedMember = await fetchedGuild.members.fetch(userReq.rows[i].discord)
			}catch (e){
				console.log("Not in this Server. Next Guild")
				continue;
			}
			var levelRole = await syncQuery("SELECT * FROM levelrole WHERE discord='"+guildReq.rows[a].discordid+"'")
			
			try{
			if(!(fetchedMember.roles.cache.has(levelRole.rows[0]["level"+fLevel]))){
				var arrRoles = []
				for(var l=1; l< 11;l++){
					arrRoles.push(levelRole.rows[0]["level"+l])
				}
				await fetchedMember.roles.remove(arrRoles,"RoleSystem")
				await fetchedMember.roles.add(levelRole.rows[0]["level"+fLevel],"RoleSystem")
				console.log("Changed Role")

			}else{
				console.log("No Role Change")
				console.log("-")
				continue
			}
		}catch(e){
			console.log("invalid roles! deleting server")
			await syncQuery("DELETE FROM levelrole WHERE discord='"+guildReq.rows[a].discordid+"'")
			continue
		}
		console.log("-")
			
		}
		console.log("----")
	}
	console.log("-----Ended Refreshing Roles-----")
}




client.login(discordToken)
