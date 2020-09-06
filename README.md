# CNCbot

A twitch bot for enabling quick user lookup of player ranks in chat using the public OBS API - docs available [here](https://cnc.community/news/official-news/new-streamer-cc-remastered-apis-available-for-obs)

## Local Setup

The bot requires the configuration of the following variables, dotenv is enabled on the project to allow reading these from a local file .env in the root directory of the project.

```
USERNAME="CNCbot"
OAUTH="oauth:yourtmioauthtoken"
CHANNEL="yourtwitchchannelname"
```

TMI oauth token configuration can be obtained here `https://twitchapps.com/tmi/`

```bash
// install dependencies
yarn install

// start bot
yarn start
```

Note: bot will only run so long as you have it running locally - this is currently not configured on a public server for permanent access.


## Sample Usage

![Twitch Chat Sample](screenshots/screenshot.png")

## To Do

* Currently investigating if API endpoint is available to search for users by name rather than ID -> this is currently hardcoded to Danku's player id for testing.
