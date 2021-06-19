import http from "./httpService";

const apiUrl = "https://api.binance.com/api/v3";
const coinsArray = ["BTC", "DOGE", "ETH", "BNB"];
const quote = "USDT";

function getUrl(symbol, startTime, endTime) {
  return `${apiUrl}/klines?symbol=${symbol}&interval=1m&startTime=${startTime}&endTime=${endTime}`;
}

async function getDataOfCoin(base, quote, ...rest) {
  const symbol = base + quote;
  const minute = 60000;
  const limit = 500;
  let presentTime = new Date().getTime();
  let presentMinute = Math.floor(presentTime / minute) * minute;
  let startMinute = presentMinute - (limit - 1) * minute;
  let ratio = (presentTime - presentMinute) / minute;
  const { data: candles } = await http.get(
    getUrl(symbol, startMinute, presentMinute)
  );
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
    result.percentDifference = (
      ((presentPrice - pastPrice) / pastPrice) *
      100
    ).toFixed(2);
    result.pastPrice = pastPrice.toPrecision(7);

    return result;
  });

  finalData.differences = differences;
  return finalData;
}

function getCryptoData(...rest) {
  let finalArray = coinsArray.map((item) =>
    getDataOfCoin(item, quote, ...rest)
  );
  return Promise.all(finalArray);
}

export {
  getCryptoData,
};
