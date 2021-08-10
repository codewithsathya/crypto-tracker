// import axios from "axios";
const axios = require("axios");
const { getLatestCandles } = require("./binanceCandles");

let url = "https://api.binance.com/api/v3";

let group = {
  "BNB markets": ["BNB"],
  "BTC markets": ["BTC"],
  "ALTS markets": ["ETH", "TRX", "XRP"],
  // prettier-ignore
  "FIAT markets": ["USDT", "BUSD", "BRL", "AUD", "BIDR", "EUR", "GBP", "RUB", "TRY", "TUSD", "USDC", "DAI", "IDRT", "PAX", "UAH", "NGN", "VAI", "BVND"],
  ETF: ["USDT"],
  allQuotes: [
    "BNB",
    "BTC",
    "ETH",
    "TRX",
    "XRP",
    "USDT",
    "BUSD",
    "BRL",
    "AUD",
    "BIDR",
    "EUR",
    "GBP",
    "RUB",
    "TRY",
    "TUSD",
    "USDC",
    "DAI",
    "IDRT",
    "PAX",
    "UAH",
    "NGN",
    "VAI",
    "BVND",
  ],
};

async function getTradableCoins() {
  const { data } = await axios.get(url + "/exchangeInfo");
  let tradablePairs = data.symbols.filter((item) => {
    return item.status === "TRADING";
  });
  let coinsData = {};
  group.allQuotes.forEach((quote) => {
    coinsData[quote] = [];
  });

  tradablePairs.forEach((item) => {
    coinsData[item.quoteAsset].push(item.baseAsset);
  });
  return coinsData;
}

async function loadCryptoCandles(coins, quote) {
  let timeNow = new Date().getTime();
  let cryptoData = {};
  for(coin of coins){
    let coinData = { "1m": []};
    for(let timeFrame of Object.keys(coinData)){
      console.time("start1");
      coinData[timeFrame] = await getLatestCandles(coin + quote, timeFrame, 1000)
      console.timeEnd("start1")
    };
    cryptoData[coin] = coinData;
  };
  return cryptoData;
}
// getTradableCoins();

async function show(){
  console.time("start");
  let tradableCoins = await getTradableCoins();
  // console.log(tradableCoins);
  let data = await loadCryptoCandles(["BNB", "BTC"], "USDT");
  console.timeEnd("start");
  console.log(data)
}

show();

// export default getTradableCoins;
