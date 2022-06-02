require('dotenv').config()
const {
  Client,
  Intents,
} = require('discord.js')

const client = new Client({
  intents: [Intents.FLAGS.GUILDS]
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag} !`)
  client.application.commands.set(
    [{
      'name': 'stats',
      'description': 'Look up FaceIt Stats',
      'options': [{
        'type': 3,
        'name': 'faceitname',
        'description': 'The FaceIt User you want to check',
        'required': true
      }]
    },
    {
      'name': 'latest',
      'description': 'Look up your latest Game',
      'options': [{
        'type': 3,
        'name': 'faceitname',
        'description': 'The FaceIt User you want to check',
        'required': true,
      }]
    },
    {
      'name': 'map',
      'description': 'Look up your Map Stats',
      'options': [{
        'type': 3,
        'name': 'faceitname',
        'description': 'The FaceIt User you want to check',
        'required': true,
      }]
    },
    {
      'name': 'last',
      'description': 'Look up your last 20 games',
      'options': [{
        'type': 3,
        'name': 'faceitname',
        'description': 'The FaceIt User you want to check',
        'required': true,
      },
      {
        'type': 3,
        'name': 'games',
        'description': 'If you want to look up more or less games than 20'
      }]
    },
    {
      'name': 'ranking',
      'description': 'Look up Rankings',
      'options': [{
        'type': 3,
        'name': 'region',
        'description': 'Which region?',
        'required': true
      },
      {
        'type': 3,
        'name': 'country',
        'description': 'Opt: Which country?'
      }]
    },
    {
      'name': 'hub',
      'description': 'Look up a Hub',
      'options': [{
        'type': 3,
        'name': 'hub',
        'description': 'The hub name',
        'required': true
      }]
    },
    {
      'name': 'team',
      'description': 'Look up a Hub',
      'options': [{
        'type': 3,
        'name': 'team',
        'description': 'The team name',
        'required': true
      }]
    },
    {
      'name': 'save',
      'description': 'Link a FaceIt Profile to your Discord (Rolesystem, etc.)',
      'options': [{
        'type': 3,
        'name': 'faceit',
        'description': 'Your FaceIt Name',
        'required': true
      }]
    },
    {
      'name': 'FaceIT Stats',
      'type': 2
    },
    {
      'name': 'help',
      'description': 'Help for the FaceIT Bot',
    },
    {
      'name': 'settings',
      'description': 'Settings for the FaceIT Bot',
      'options': [{
        'type': 1,
        'name': 'rolesystem',
        'description': 'Activate the Rolesystem',
        'options': [{
          'type': 8,
          'name': 'level1',
          'description': 'The Role for Level 1',
          'required': true
        },
        {
          'type': 8,
          'name': 'level2',
          'description': 'The Role for Level 2',
          'required': true
        },
        {
          'type': 8,
          'name': 'level3',
          'description': 'The Role for Level 3',
          'required': true
        },
        {
          'type': 8,
          'name': 'level4',
          'description': 'The Role for Level 4',
          'required': true
        },
        {
          'type': 8,
          'name': 'level5',
          'description': 'The Role for Level 5',
          'required': true
        },
        {
          'type': 8,
          'name': 'level6',
          'description': 'The Role for Level 6',
          'required': true
        },
        {
          'type': 8,
          'name': 'level7',
          'description': 'The Role for Level 7',
          'required': true
        },
        {
          'type': 8,
          'name': 'level8',
          'description': 'The Role for Level 8',
          'required': true
        },
        {
          'type': 8,
          'name': 'level9',
          'description': 'The Role for Level 9',
          'required': true
        },
        {
          'type': 8,
          'name': 'level10',
          'description': 'The Role for Level 10',
          'required': true
        }]
      }]
    }])
    .then(() => console.log('Commands registered!'))
    .catch(console.error)
})

client.login(process.env.BOTTOKEN)