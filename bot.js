const faceit = require("./embedFinisher");
const fr = require("./faceitRequests");
const dotenv = require('dotenv').config()

const {
	AutoPoster
} = require('topgg-autoposter')


const pg = require('pg').Client;

const discordToken = process.env.BOTTOKEN
const pgcred = JSON.parse(process.env.PGTOK)




const pgclient = new pg(pgcred);

pgclient.connect();
const Statcord = require("statcord.js");

const {
	Client,
	Intents,
	MessageEmbed,
	MessageActionRow,
	MessageButton,
	MessageSelectMenu,
	Permissions
} = require('discord.js');
const client = new Client({
	intents: [Intents.FLAGS.GUILDS]
});


const helpEmbed = new MessageEmbed()
	.setColor('#FF5500')
	.setTitle("How to use the Bot:")
	.addFields({
		name: '**/stats** faceitname',
		value: "The Main Commands. Shows Statistics about a FaceIT Player",
		inline: true
	}, {
		name: '**/last** faceitname opt: count',
		value: "Shows Statistics from the Last 20 Games",
		inline: true
	}, {
		name: '**/latest** faceitname',
		value: "Shows the latest Game",
		inline: true
	}, {
		name: '**/map** faceitname',
		value: "Shows statistics in every Map",
		inline: true
	}, {
		name: '**/ranking** region opt: country',
		value: "Shows the leaderboard in a region/country",
		inline: true
	}, {
		name: '**/hub** hubname',
		value: "Shows Hub information and leaderboard",
		inline: true
	}, {
		name: '**/team** teamname',
		value: "Shows Team information",
		inline: true
	}, {
		name: '**/save** faceitname',
		value: "Will link your FaceIT Profile to this Bot (Rolesystem, RightClick-Stats etc.)",
		inline: true
	}, {
		name: '**/help**',
		value: "Shows this Message",
		inline: true
	}, {
		name: '**Right Click** on a User',
		value: "Will show Statistics from this User when saved",
		inline: true
	}, {
		name: '❓ Helpful Links',
		value: "[Top.GG](https://top.gg/bot/770312130037153813) | [Invite Link](https://discord.com/oauth2/authorize?client_id=770312130037153813&permissions=268823616&scope=bot%20applications.commands) | [Support Server](https://discord.gg/DUuCMgXDJC)",
		inline: false
	}, )
	.setThumbnail("https://images.discordapp.net/avatars/770312130037153813/704aab707701ace86dd8e737800b4521.png?size=512")
	.setFooter("Made by phil#0346");


//client ready
client.on('ready', () => {
	client.user.setActivity('your stats | /help', {
		type: 'WATCHING'
	});
	console.log("logged in!")
})

const ap = AutoPoster(process.env.TOPTOKEN, client)

ap.on('posted', () => {
	console.log('Posted stats to Top.gg!')
})


// interaction handling
client.on('interactionCreate', async interaction => {
	if (interaction.isCommand()) {
		if (interaction.commandName === 'stats') {
			await interaction.deferReply();

			var name = interaction.options.getString('faceitname');
			var resp = await faceit.fStats(name)


			if (!(resp.title.toString() == "Wrong FaceIT Name")) {
				const row = new MessageActionRow()
					.addComponents(
						new MessageSelectMenu()
						.setCustomId('selector-' + name)
						.setPlaceholder('Change Stats')
						.addOptions([{
								label: 'Normal Stats',
								description: 'Look at the players FaceIt Stats',
								value: 'normal',
								emoji: '<:faceit:907599188152434688>',
							},
							{
								label: 'Latest Game',
								description: 'Look at the players latest game',
								value: 'latest',
								emoji: '<:lastmatch:907598468921589801>',
							},
							{
								label: 'Last 20 Games',
								description: 'Look at the players last 20 Games',
								value: 'last',
								emoji: '<:last20:907598469139685416>',
							},
							{
								label: 'Map Stats',
								description: 'Look at the players performance in certain maps',
								value: 'maps',
								emoji: '🗺️',
							},
						]),
					);
				Statcord.ShardingClient.postCommand(interaction.commandName, interaction.user.id, client);
				interaction.editReply({
					embeds: [resp],
					components: [row]
				})

			} else {
				interaction.editReply({
					embeds: [resp]
				})
			}
		} else if (interaction.commandName === 'latest') {
			await interaction.deferReply();
			var name = interaction.options.getString('faceitname');
			var resp = await faceit.fLatest(name)
			Statcord.ShardingClient.postCommand(interaction.commandName, interaction.user.id, client);

			interaction.editReply({
				embeds: [resp]
			})

		} else if (interaction.commandName === 'map') {
			await interaction.deferReply();
			var name = interaction.options.getString('faceitname');
			var resp = await faceit.fMap(name, "de_dust2")

			const row = new MessageActionRow()
				.addComponents(
					new MessageSelectMenu()
					.setCustomId('maps-' + name)
					.setPlaceholder('Change Map')
					.addOptions([{
							label: 'Dust2',
							description: 'Performance in Dust2',
							value: 'de_dust2',
							emoji: '<:dust2:907604904745529395>',
						},
						{
							label: 'Mirage',
							description: 'Performance in Mirage',
							value: 'de_mirage',
							emoji: '<:mirage:907604905089454110>',
						},
						{
							label: 'Inferno',
							description: 'Performance in Inferno',
							value: 'de_inferno',
							emoji: '<:inferno:907604904858751017>',
						},
						{
							label: 'Nuke',
							description: 'Performance in Nuke',
							value: 'de_nuke',
							emoji: '<:nuke:907604905244647454>',
						},
						{
							label: 'Overpass',
							description: 'Performance in Overpass',
							value: 'de_overpass',
							emoji: '<:overpass:907604905097842719>',
						},
						{
							label: 'Ancient',
							description: 'Performance in Ancient',
							value: 'de_ancient',
							emoji: '<:ancient:907605107720466442>',
						},
						{
							label: 'Vertigo',
							description: 'Performance in Vertigo',
							value: 'de_vertigo',
							emoji: '<:vertigo:907604905097826384>',
						},
						{
							label: 'Train',
							description: 'Performance in Train',
							value: 'de_train',
							emoji: '<:train:907604905097842718>',
						},
					]),
				);

			Statcord.ShardingClient.postCommand(interaction.commandName, interaction.user.id, client);

			interaction.editReply({
				embeds: [resp],
				components: [row]
			})
		} else if (interaction.commandName === 'last') {
			await interaction.deferReply();
			var name = interaction.options.getString('faceitname');
			var count = interaction.options.getString('games');
			var resp = await faceit.fLast(name, count)
			interaction.editReply({
				embeds: [resp]
			})
		} else if (interaction.commandName === 'ranking') {
			await interaction.deferReply();
			var region = interaction.options.getString('region');
			var country = interaction.options.getString('country');
			var resp = await faceit.fRanking(region, country)

			Statcord.ShardingClient.postCommand(interaction.commandName, interaction.user.id, client);

			interaction.editReply({
				embeds: [resp]
			})

		} else if (interaction.commandName === 'hub') {
			await interaction.deferReply();
			var hub = interaction.options.getString('hub');
			var resp = await faceit.fHub(hub)
			if (resp.length == 2) {
				await interaction.editReply({
					embeds: [resp[0], resp[1]]
				})
				Statcord.ShardingClient.postCommand(interaction.commandName, interaction.user.id, client);

			} else {
				await interaction.editReply({
					embeds: [resp[0]]
				})
			}

		} else if (interaction.commandName === 'team') {
			await interaction.deferReply();
			var team = interaction.options.getString('team');
			var resp = await faceit.fTeam(team)
			Statcord.ShardingClient.postCommand(interaction.commandName, interaction.user.id, client);

			interaction.editReply({
				embeds: [resp]
			})
		} else if (interaction.commandName === 'save') {
			await interaction.deferReply();
			var name = interaction.options.getString('faceit');
			var uId = interaction.user.id

			try {
				var valid = await fr.nickStats(name)
				console.log(valid.games.csgo)
				pgclient.query("INSERT INTO stats(discord,faceit) VALUES (" + uId + ", '" + name + "') ON CONFLICT ON CONSTRAINT stats_pkey DO UPDATE SET faceit=EXCLUDED.faceit;", (err, res) => {


					const errembed = new MessageEmbed()
						.setColor('#FF5500')
						.setTitle("Saved your FaceIT Name")
						.setDescription("You will gain Level-Specific Roles when the Rolesystem is activated.\nOther Users also can Right-Click on you to see Statistics")
						.setTimestamp()


					interaction.editReply({
						embeds: [errembed],
						ephemeral: true
					})
					Statcord.ShardingClient.postCommand(interaction.commandName, interaction.user.id, client);
				})

			} catch (err) {
				const errembed = new MessageEmbed()
					.setColor('#ff0000')
					.setTitle("This FaceIT-Name is invalid!")
					.setDescription("Remember that the FaceIT Name is case-sensetive!")
					.setTimestamp()

				interaction.editReply({
					embeds: [errembed],
					ephemeral: true
				})
			}

		} else if (interaction.commandName === 'settings') {
			await interaction.deferReply({ephemeral: true});
			if(!(interaction.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES))){
				const errembed = new MessageEmbed()
				.setColor('#ff0000')
				.setTitle("You do not have enough Permissions!")
				.setDescription("You need MANAGE ROLES to change the settings")
				.setTimestamp()
			interaction.editReply({
				embeds: [errembed],
				ephemeral: true
			})

			}

			if (interaction.options.getSubcommand() == "rolesystem") {
				try {
					var gId = interaction.guild.id
					var roles = []
					var botrole = interaction.guild.roles.botRoleFor(interaction.guild.me)
					for (var i = 1; i < 11; i++) {
						roles.push(interaction.options.getRole("level" + i).id)
						if (interaction.options.getRole("level" + i).comparePositionTo(botrole) > 0) {
							console.log("not interactable")
							const errembed = new MessageEmbed()
								.setColor('#ff0000')
								.setTitle("Cant interact with these Roles!")
								.setDescription("My BotRole Position is too low! Please move my Role (FaceItBot) in the RoleSettings of this Server to the top!")
								.setTimestamp()
							interaction.editReply({
								embeds: [errembed],
								ephemeral: true
							})

							return
						}
					}
					pgclient.query("INSERT INTO levelrole(discordid,level1,level2,level3,level4,level5,level6,level7,level8,level9,level10) VALUES ('" + gId + "','" + roles[0] + "','" + roles[1] + "','" + roles[2] + "','" + roles[3] + "','" + roles[4] + "','" + roles[5] + "','" + roles[6] + "','" + roles[7] + "','" + roles[8] + "','" + roles[9] + "') ON CONFLICT ON CONSTRAINT levelrole_pkey DO UPDATE SET discordid=EXCLUDED.discordid;", (err, res) => {
						const errembed = new MessageEmbed()
							.setColor('#FF5500')
							.setTitle("Activated the Role System!")
							.setDescription("Bot automatically assigns Role to users by their FaceIT Level! \n It will check every hour for level updates.\n Users have to use .faceitrole *name* to use the system")
							.addFields({
								name: 'Level 1',
								value: "<@&" + roles[0] + ">",
								inline: true
							}, {
								name: 'Level 2',
								value: "<@&" + roles[1] + ">",
								inline: true
							}, {
								name: 'Level 3',
								value: "<@&" + roles[2] + ">",
								inline: true
							}, {
								name: 'Level 4',
								value: "<@&" + roles[3] + ">",
								inline: true
							}, {
								name: 'Level 5',
								value: "<@&" + roles[4] + ">",
								inline: true
							}, {
								name: 'Level 6',
								value: "<@&" + roles[5] + ">",
								inline: true
							}, {
								name: 'Level 7',
								value: "<@&" + roles[6] + ">",
								inline: true
							}, {
								name: 'Level 8',
								value: "<@&" + roles[7] + ">",
								inline: true
							}, {
								name: 'Level 9',
								value: "<@&" + roles[8] + ">",
								inline: true
							}, {
								name: 'Level 10',
								value: "<@&" + roles[9] + ">",
								inline: true
							}, )
							.setTimestamp()

						interaction.editReply({
							embeds: [errembed],
							ephemeral: true
						})
					})
				} catch (e) {
					const errembed = new MessageEmbed()
						.setColor('#ff0000')
						.setTitle("?")
						.setDescription("unknown error")
						.setTimestamp()

					interaction.editReply({
						embeds: [errembed],
						ephemeral: true
					})


				}
			}
		} else if (interaction.commandName === 'help') {
			await interaction.deferReply();
			interaction.editReply({
				embeds: [helpEmbed]
			})
			Statcord.ShardingClient.postCommand(interaction.commandName, interaction.user.id, client);

		}



	} else if (interaction.isSelectMenu()) {
		if (interaction.customId.includes('select')) {
			interaction.deferUpdate();
			var name = interaction.customId.split('-')[1]
			if (interaction.values[0] == "last") {
				var resp = await faceit.fLast(name, null)
				await interaction.editReply({
					embeds: [resp]
				});
				Statcord.ShardingClient.postCommand("last", interaction.user.id, client);

			} else if (interaction.values[0] == "latest") {
				var resp = await faceit.fLatest(name)
				await interaction.editReply({
					embeds: [resp]
				});
				Statcord.ShardingClient.postCommand("latest", interaction.user.id, client);

			} else if (interaction.values[0] == "normal") {
				var resp = await faceit.fStats(name)
				await interaction.editReply({
					embeds: [resp]
				});
				Statcord.ShardingClient.postCommand("stats", interaction.user.id, client);
			} else if (interaction.values[0] == "maps") {
				var resp = await faceit.fMap(name, "de_dust2")
				const row = new MessageActionRow()
					.addComponents(
						new MessageSelectMenu()
						.setCustomId('maps-' + name)
						.setPlaceholder('Change Map')
						.addOptions([{
								label: 'Dust2',
								description: 'Performance in Dust2',
								value: 'de_dust2',
								emoji: '<:dust2:907604904745529395>',
							},
							{
								label: 'Mirage',
								description: 'Performance in Mirage',
								value: 'de_mirage',
								emoji: '<:mirage:907604905089454110>',
							},
							{
								label: 'Inferno',
								description: 'Performance in Inferno',
								value: 'de_inferno',
								emoji: '<:inferno:907604904858751017>',
							},
							{
								label: 'Nuke',
								description: 'Performance in Nuke',
								value: 'de_nuke',
								emoji: '<:nuke:907604905244647454>',
							},
							{
								label: 'Overpass',
								description: 'Performance in Overpass',
								value: 'de_overpass',
								emoji: '<:overpass:907604905097842719>',
							},
							{
								label: 'Ancient',
								description: 'Performance in Ancient',
								value: 'de_ancient',
								emoji: '<:ancient:907605107720466442>',
							},
							{
								label: 'Vertigo',
								description: 'Performance in Vertigo',
								value: 'de_vertigo',
								emoji: '<:vertigo:907604905097826384>',
							},
							{
								label: 'Train',
								description: 'Performance in Train',
								value: 'de_train',
								emoji: '<:train:907604905097842718>',
							},
						]),

					);

				const exit = new MessageActionRow()
					.addComponents(
						new MessageButton()
						.setCustomId('stats-' + name)
						.setEmoji('↩️')
						.setLabel('Main Stats')
						.setStyle('PRIMARY'),

					)


				interaction.editReply({
					embeds: [resp],
					components: [row, exit]
				})
				Statcord.ShardingClient.postCommand("map", interaction.user.id, client);
			}

		} else if (interaction.customId.includes('maps')) {
			await interaction.deferUpdate();
			var name = interaction.customId.split('-')[1]
			var resp = await faceit.fMap(name, interaction.values[0])
			interaction.editReply({
				embeds: [resp]
			})

		}



	} else if (interaction.isContextMenu()) {
		if (interaction.commandName == "FaceIT Stats") {
			try {
				await interaction.deferReply()
				var tId = interaction.targetId;
				var res = await syncQuery("SELECT * FROM stats WHERE discord=" + tId)
				var resp = await faceit.fStats(res.rows[0].faceit)

				const row = new MessageActionRow()
					.addComponents(
						new MessageSelectMenu()
						.setCustomId('selector-' + res.rows[0].faceit)
						.setPlaceholder('Change Stats')
						.addOptions([{
								label: 'Normal Stats',
								description: 'Look at the players FaceIt Stats',
								value: 'normal',
								emoji: '<:faceit:907599188152434688>',
							},
							{
								label: 'Latest Game',
								description: 'Look at the players latest game',
								value: 'latest',
								emoji: '<:lastmatch:907598468921589801>',
							},
							{
								label: 'Last 20 Games',
								description: 'Look at the players last 20 Games',
								value: 'last',
								emoji: '<:last20:907598469139685416>',
							},
							{
								label: 'Map Stats',
								description: 'Look at the players performance in certain maps',
								value: 'maps',
								emoji: '🗺️',
							},
						]),
					);
				interaction.editReply({
					embeds: [resp],
					components: [row]
				})
				Statcord.ShardingClient.postCommand("Contextstats", interaction.user.id, client);
			} catch (e) {
				const errembed = new MessageEmbed()
					.setColor('#ff0000')
					.setTitle("This User has not linked his FaceIT Profile!")
					.setDescription("This User has no FaceIT Profile linked.\n He can link one with **/save**")
					.setTimestamp()

				interaction.editReply({
					embeds: [errembed],
					ephemeral: true
				})
			}
		}


	} else if (interaction.isButton()) {
		if (interaction.customId.includes("stats")) {
			await interaction.deferUpdate();
			var name = interaction.customId.split('-')[1]
			var resp = await faceit.fStats(name)
			const row = new MessageActionRow()
				.addComponents(
					new MessageSelectMenu()
					.setCustomId('selector-' + name)
					.setPlaceholder('Change Stats')
					.addOptions([{
							label: 'Normal Stats',
							description: 'Look at the players FaceIt Stats',
							value: 'normal',
							emoji: '<:faceit:907599188152434688>',
						},
						{
							label: 'Latest Game',
							description: 'Look at the players latest game',
							value: 'latest',
							emoji: '<:lastmatch:907598468921589801>',
						},
						{
							label: 'Last 20 Games',
							description: 'Look at the players last 20 Games',
							value: 'last',
							emoji: '<:last20:907598469139685416>',
						},
						{
							label: 'Map Stats',
							description: 'Look at the players performance in certain maps',
							value: 'maps',
							emoji: '🗺️',
						},
					]),
				);
			interaction.editReply({
				embeds: [resp],
				components: [row]
			})
			Statcord.ShardingClient.postCommand("stats", interaction.user.id, client);

		}

	}
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


client.login(discordToken)