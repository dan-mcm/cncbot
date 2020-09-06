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
  if (msg.startsWith('!dice')) {
    const num = rollDice();
    client.say(target, `You rolled a ${num}`);
    console.log(`* Executed ${commandName} command`);
  } else if (msg.startsWith('!getrank')) {
    // '40' default for Danku player-id
    const rank = getRank('40', args[2])
    rank.then(res => {
      // handle success
      console.log(`validating msg received ${args}`)
      console.log(`Rank for ${res.data.name}: ${res.data.rank}. Total points: ${res.data.points}. Games won: ${res.data.wins}. Games lost: ${res.data.losses}.`)
      console.log(`* Executed !${args[0]} command`);
      return client.say(target, `Current ${args[2] || 'td' } rank for ${res.data.name}: ${res.data.rank}; Total points: ${Math.ceil(res.data.points)}; Games won: ${res.data.wins}; Games lost: ${res.data.losses}.`)
     }
    )
    .catch(err => {
        console.log(err)
        return console.log(`Error running !${args[0]} command`);
      }
    )
  }
}


// Function called when the "dice" command is issued
function rollDice () {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
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

  return axios.get(`https://cnc.community/api/leaderboard/${gameQuery}/player/${playername}/`)

}
