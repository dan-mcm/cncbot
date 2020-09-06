const axios = require('axios');

function getRank(game, playername) {

  let gameQuery = ''

  if (game.toLowerCase() == 'ra'){
    gameQuery = 'red-alert'
  } else {
    gameQuery = 'tiberian-dawn'
  }

  axios.get(`https://cnc.community/api/leaderboard/${gameQuery}/player/${playername}/`)
    .then(function (res) {
      // handle success
      console.log(`Rank for \`${res.data.name}\`: ${res.data.rank}. Total points: ${res.data.points}. Games won: ${res.data.wins}. Games lost: ${res.data.losses}.`);
      console.log(res.data)
    })
    .catch( function (err) {
      // handle error
      console.log(err)
    })
  }

getRank('td', '40')

//?search=danku endpoint?
