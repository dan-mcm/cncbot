require('dotenv').config();
const tmi = require('tmi.js');
const axios = require('axios');


// Define configuration options
const opts = {
  identity: {
    username: process.env.USERNAME,
    password: process.env.OAUTH
  },
  channels: [
    process.env.CHANNEL
  ]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  // const commandName = msg.trim();

  // getting args from message
  const args = msg.slice(1).split(' ');

  // If the command is known, let's execute it
  if (msg.startsWith('!getrank')) {

    // accounting for user error only entering '!getrank' with no args
    if(args.length < 2){
      return client.say(target, `Please specify a username and gametype (default td): !getrank danku ra`)
    }

    // '40' default for Danku player-id
    const rank = getRank(args[1], args[2])
    rank.then(res => {
      // handle success
      if(res.data.length === 0){
        console.log(`* Executed !${args[0]} command -> Failed to find ${args[1]} on leaderboard`)
        return client.say(target, `No leaderboard results found for user: ${args[1]}`)
      } else {
        console.log(`* Executed !${args[0]} command -> Rank for ${res.data[0].player_name}: ${res.data[0].rank}. Total points: ${Math.ceil(res.data[0].points)}. Games won: ${res.data[0].wins}. Games lost: ${res.data[0].losses}.`);
        // assumption result[0] in array is the most accurate and only using that one
        return client.say(target, `Current ${args[2] || 'td' } rank for ${res.data[0].player_name}: ${res.data[0].rank}; Total points: ${Math.ceil(res.data[0].points)}; Games won: ${res.data[0].wins}; Games lost: ${res.data[0].losses}.`)
      }
     }
    )
    .catch(err => {
        console.log(err)
        return console.log(`Error running !${args[0]} command`);
      }
    )
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}


// custom function when "getrank" command is issued
function getRank(playername, game) {
  let gameQuery = ''

  if(!game) {
    gameQuery = 'tiberian-dawn'
  } else if (game.toLowerCase() == 'ra'){
    gameQuery = 'red-alert'
  } else {
    gameQuery = 'tiberian-dawn'
  }

  return axios.get(`https://cnc.community/api/leaderboard/${gameQuery}/players/search?search=${playername}`)

}
