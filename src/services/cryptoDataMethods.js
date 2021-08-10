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

async function loadCryptoCandles(coins, quote, timeFrame) {
  let timeNow = new Date().getTime();
  let cryptoData = coins.map((coin) => {
    let coinData = getLatestCandles(coin + quote, timeFrame, 1000);
    return coinData;
  });
  return Promise.all(cryptoData);
}

function convertArrayToObject(keys, values) {
  let obj = {}
  for(let i = 0; i < keys.length; i++){
    obj[keys[i]] = values[i];
    // console.log(obj);
  }
  return obj;
}
// getTradableCoins();

async function show(quote) {
  console.time("start");
  let tradableCoins = await getTradableCoins();
  // console.log(tradableCoins);
  let data = await loadCryptoCandles(tradableCoins[quote], quote, "1m");
  let candles = convertArrayToObject(tradableCoins[quote], data);
  // console.log(candles);
  console.timeEnd("start");
  console.log(memorySizeOf(candles))
}

show("USDT");


function memorySizeOf(obj) {
    var bytes = 0;

    function sizeOf(obj) {
        if(obj !== null && obj !== undefined) {
            switch(typeof obj) {
            case 'number':
                bytes += 8;
                break;
            case 'string':
                bytes += obj.length * 2;
                break;
            case 'boolean':
                bytes += 4;
                break;
            case 'object':
                var objClass = Object.prototype.toString.call(obj).slice(8, -1);
                if(objClass === 'Object' || objClass === 'Array') {
                    for(var key in obj) {
                        if(!obj.hasOwnProperty(key)) continue;
                        sizeOf(obj[key]);
                    }
                } else bytes += obj.toString().length * 2;
                break;
            }
        }
        return bytes;
    };

    function formatByteSize(bytes) {
        if(bytes < 1024) return bytes + " bytes";
        else if(bytes < 1048576) return(bytes / 1024).toFixed(3) + " KiB";
        else if(bytes < 1073741824) return(bytes / 1048576).toFixed(3) + " MiB";
        else return(bytes / 1073741824).toFixed(3) + " GiB";
    };

    return formatByteSize(sizeOf(obj));
};

// export default getTradableCoins;
