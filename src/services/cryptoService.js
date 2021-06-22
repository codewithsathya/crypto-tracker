import http from "./httpService";

const minute = 60000;
const limit = 500;

const apiUrl = "https://api.binance.com/api/v3";
const coinsArray = [
  "ADA",
  "ATOM",
  "BAT",
  "BCH",
  "BNB",
  "BTC",
  "DASH",
  "DOGE",
  "DOT",
  "EOS",
  "ETC",
  "ETH",
  "IOST",
  "IOTA",
  "LTC",
  "NEO",
  "ONT",
  "QTUM",
  "TRX",
  "XMR",
  "XRP",
  "ZEC",
];
const quote = "USDT";

function getUrl(symbol, startTime, endTime) {
  return `${apiUrl}/klines?symbol=${symbol}&interval=1m&startTime=${startTime}&endTime=${endTime}`;
}

async function getDataOfCoin(base, quote, previousCryptoDataOfCoin, ...rest) {
  const symbol = base + quote;

  let presentTime = new Date().getTime();
  let presentMinute = Math.floor(presentTime / minute) * minute;
  let startMinute = presentMinute - (limit - 1) * minute;
  let ratio = (presentTime - presentMinute) / minute;

  const { data: candles } = await http.get(
    getUrl(symbol, startMinute, presentMinute)
  );

  if (!candles || !candles[limit - 1]) return previousCryptoDataOfCoin;
  let presentPrice = parseFloat(candles[limit - 1][4]);

  let finalData = {};
  finalData.pair = `${base}/${quote}`;
  finalData.presentPrice = presentPrice.toPrecision(7);

  const differences = rest.map((timeInMin) => {
    let pastIndex = limit - 1 - timeInMin;
    let pastOpeningPrice = parseFloat(candles[pastIndex][1]);
    let pastClosingPrice = parseFloat(candles[pastIndex][4]);
    let pastPrice =
      pastOpeningPrice + (pastClosingPrice - pastOpeningPrice) * ratio;

    let result = {};
    result.timeDifference = timeInMin;
    result.priceDifference = (presentPrice - pastPrice).toPrecision(4);
    result.percentDifference = parseFloat(
      ((presentPrice - pastPrice) / pastPrice) * 100
    ).toFixed(2);
    result.pastPrice = pastPrice.toPrecision(7);

    return result;
  });

  finalData.differences = differences;
  return finalData;
}

function getCryptoData(previousCryptoData, ...rest) {
  let finalArray = coinsArray.map((item, index) =>
    getDataOfCoin(
      item,
      quote,
      previousCryptoData ? previousCryptoData[index] : null,
      ...rest
    )
  );
  return Promise.all(finalArray);
}

export { getCryptoData };
