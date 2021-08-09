const axios = require('axios');

let cd = [
  "BTC",
  "ETH",
  "ADA",
  "BNB",
  "XRP",
  "DOGE",
  "ETC",
  "MATIC",
  "SOL",
  "DOT",
  "ICP",
  "VET",
  "SHIB",
  "FIL",
  "LINK",
  "AAVE",
  "COMP",
  "THETA",
  "LTC",
  "EOS",
  "TRON",
  "RUNE"
]

let url = "https://api.binance.com/api/v3"


async function show() {
  let {data} = await axios.get(url + "/exchangeInfo");
  // let filtered = data.filter((obj) => {
  //   return parseFloat(obj.price) !== 0;
  // })
  // let pairs = data.map(obj => obj.symbol);
  // pairs = JSON.stringify(pairs);

  let quotes = new Set();

  let filtered = data["symbols"].filter(obj => {
    return obj.status === 'TRADING' && obj.symbol === 'CVPBUSD';
  })
  // filtered.forEach(obj => {
  //   quotes.add(obj.quoteAsset);
  // })
  console.log(filtered[0].filters);
}

show();