const { Client, Intents } = require('discord.js')
require('dotenv').config()

if (process.env.NODE_ENV === 'production') {
  const pg = require('pg').Client
  const { AutoPoster } = require('topgg-autoposter')

  const pgclient = new pg(process.env.PGTOK)
  pgclient.connect()

  const ap = AutoPoster(process.env.TOPTOKEN, client)
  ap.on('posted', () => console.log('Posted stats to Top.gg!'))
}

const stats = require('./commands/stats')
const latest = require('./commands/latest')
const map = require('./commands/map')
const last = require('./commands/last')
const ranking = require('./commands/ranking')
const hub = require('./commands/hub')
const team = require('./commands/team')
const save = require('./commands/save')
const settings = require('./commands/settings')
const mapMenu = require('./interactions/selectmenus/mapMenu')
const contextmenu = require('./interactions/contextmenus/contextmenu')
const help = require('./commands/help')
const lastMenu = require('./interactions/selectmenus/lastMenu')
const latestMenu = require('./interactions/selectmenus/latestMenu')
const statsMenu = require('./interactions/statsMenu')

const client = new Client({
  intents: [Intents.FLAGS.GUILDS]
})

//client ready
client.on('ready', () => {
  client.user.setActivity('your stats | /help', {
    type: 'WATCHING'
  })
  console.log('logged in!')
})

// interaction handling
client.on('interactionCreate', async interaction => {
  if (interaction.isCommand())
    switch (interaction.commandName) {
    case 'stats': { await stats(interaction); break }
    case 'latest': { await latest(interaction); break }
    case 'map': await map(interaction); break
    case 'last': await last(interaction); break
    case 'ranking': await ranking(interaction); break
    case 'hub': await hub(interaction); break
    case 'team': await team(interaction); break
    case 'save': await save(interaction); break
    case 'settings': await settings(interaction); break
    case 'help': await help(interaction); break
    default: break
    }
  else if (interaction.isButton()) {
    interaction.deferUpdate().then(async () => {
      if (interaction.customId.includes('stats')) await statsMenu(interaction)
    })
  } else if (interaction.isSelectMenu()) {
    interaction.deferUpdate()
      .then(async () => {
        if (interaction.customId.includes('selector'))
          switch (interaction.values[0]) {
          case 'normal': await statsMenu(interaction); break
          case 'latest': await latestMenu(interaction); break
          case 'last': await lastMenu(interaction); break
          case 'maps': await mapMenu(interaction); break
          default: break
          }
        else if (interaction.customId.includes('map')) await mapMenu(interaction)
      })
      .catch(console.error())
  } else if (interaction.isContextMenu()) {
    if (interaction.commandName == 'FaceIT Stats') contextmenu(interaction)
  }
})

client.login(process.env.BOTTOKEN)