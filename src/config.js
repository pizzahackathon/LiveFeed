const isProd = false

// ----- Twitter config
const twitter = {
  queryParam: ['pizzahackathon', 'pizzahack', 'pizzahackaton'],
  endPoint: 'http://139.5.144.137:3000/loadTweets/' //--- add end point here
}

// ----- Price chart btc/eth config
const chart = {
  endPoint: 'https://api.coinmarketcap.com/v2/ticker/',
  btcMin: 6424.0000,
  btcMax: 6425.0000,
  ethMin: 275.000,
  ethMax: 276.000
}

export default {
  isProd,
  twitter,
  chart
}
