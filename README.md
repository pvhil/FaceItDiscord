# FaceIT Stats Discord Bot

## Overview

This Discord bot is designed to fetch and display player statistics from FaceIT, a popular platform for competitive gaming. With this bot, users can easily retrieve and share their FaceIT statistics within Discord servers.

## Features

- **Player Stats**: Retrieve detailed statistics for a specific FaceIT player.
- **Recent Matches**: View the latest matches played by a FaceIT user.
- **More Coming Soon**: This Bot is still in active development.

## Usage

### Commands

- `/stats [FaceIT Username]`: Get detailed statistics for the specified FaceIT user.
- `/lastgame [FaceIT Username]`: View the most recent match played by the specified FaceIT user.
- `/last [FaceIT Username] [Number of games]`: View the recent matches played by the specified FaceIT user.
- `/map [FaceIT Username] [Map]`: Display statistics in a specific map.

### Action Row

An Action Row is included with every Command to switch statistics faster than ever.

## Installation

Before installing, please make sure you have a discord bot token, a faceit api token and if you need it Oauth information from faceit

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/pvhil/FaceItDiscord.git
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Configure the bot by adding your Discord bot token, Bot-ID, Discord Test Server and FaceIT API key to the `config.json` file. You can also use the `config.json.example` file.

   ```json
   {
     "token": "",
     "clientId": "",
     "guildId": "",
     "faceitKey": ""
     ...
   }

   ```

4. Register Slash Commands:

   ```bash
   node deploy-commands-global.js
   ```

5. Run the bot:

   ```bash
   node .
   ```

6. If you want to use the /save command, you need a mongoDB Server. If you have one, paste the mongoDB URI in the config.

## Disclaimer

This bot is an independent project and is not affiliated with or endorsed by FaceIT. It does not establish any connections with FaceIT servers and relies on the public FaceIT API to fetch player statistics.

**Note:** Ensure that you comply with FaceIT's terms of service while using this bot, and respect the privacy and fair play policies of both Discord and FaceIT.

Feel free to contribute to the project or report any issues on the GitHub repository
