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

function getPeakAndDip(previousData, presentData, timeInMin) {
  let pastIndex = limit - 1 - timeInMin;
  let result = {};
  let minimum = presentData[pastIndex];
  let maximum = presentData[pastIndex];
  for (let i = pastIndex; i < limit; i++) {
    if (minimum > presentData[i][1]) {
      minimum = parseFloat(presentData[i][1]);
    }
    if (maximum < presentData[i][1]) {
      maximum = parseFloat(presentData[i][1]);
    }
  }
  result.minimum = minimum;
  result.maximum = maximum;
  if (presentData[limit - 1][4] <= minimum) {
    result.peakOrDip = -1;
  } else if (presentData[limit - 1][4] >= maximum) {
    result.peakOrDip = 1;
  } else {
    result.peakOrDip = 0;
  }
  return result;
}

async function getDataFromApi(symbol, startMinute, presentMinute) {
  return await http.get(getUrl(symbol, startMinute, presentMinute));
}

async function getDataOfCoin(
  base,
  quote,
  previousCryptoDataOfCoin,
  timeSlotsForPercent,
  timeSlotsForPrice
) {
  const symbol = base + quote;

  let presentTime = new Date().getTime();
  let presentMinute = Math.floor(presentTime / minute) * minute;
  let startMinute = presentMinute - (limit - 1) * minute;
  let ratio = (presentTime - presentMinute) / minute;

  const { data: candles } = await getDataFromApi(symbol, startMinute, presentMinute);

  if (!candles || !candles[limit - 1]) return previousCryptoDataOfCoin;
  let presentPrice = parseFloat(candles[limit - 1][4]);

  let finalData = {};
  finalData.pair = `${base}/${quote}`;
  finalData.presentPrice = parseFloat(presentPrice.toPrecision(7));

  const percentDifferences = timeSlotsForPercent.map((timeInMin) => {
    let pastIndex = limit - 1 - timeInMin;
    let pastOpeningPrice = parseFloat(candles[pastIndex][1]);
    let pastClosingPrice = parseFloat(candles[pastIndex][4]);
    let pastPrice =
      pastOpeningPrice + (pastClosingPrice - pastOpeningPrice) * ratio;

    let obj = getPeakAndDip(previousCryptoDataOfCoin, candles, timeInMin);

    let result = {};
    result.minimum = obj.minimum;
    result.maximum = obj.maximum;
    result.peakOrDip = obj.peakOrDip;
    result.timeDifference = timeInMin;

    result.percentDifference = parseFloat(
      (((presentPrice - pastPrice) / pastPrice) * 100).toFixed(2)
    );
    result.pastPrice = parseFloat(pastPrice.toPrecision(7));
    return result;
  });

  const priceDifferences = timeSlotsForPrice.map((timeInMin) => {
    let pastIndex = limit - 1 - timeInMin;
    let pastOpeningPrice = parseFloat(candles[pastIndex][1]);
    let pastClosingPrice = parseFloat(candles[pastIndex][4]);
    let pastPrice =
      pastOpeningPrice + (pastClosingPrice - pastOpeningPrice) * ratio;

    let obj = getPeakAndDip(previousCryptoDataOfCoin, candles, timeInMin);

    let result = {};
    result.minimum = obj.minimum;
    result.maximum = obj.maximum;
    result.peakOrDip = obj.peakOrDip;
    result.timeDifference = timeInMin;
    result.priceDifference = parseFloat(
      (presentPrice - pastPrice).toPrecision(4)
    );
    result.pastPrice = parseFloat(pastPrice.toPrecision(7));
    return result;
  });

  finalData.percentDifferences = percentDifferences;
  finalData.priceDifferences = priceDifferences;
  return finalData;
}

function getCryptoData(
  previousCryptoData,
  timeSlotsForPercent,
  timeSlotsForPrice
) {
  let finalArray = coinsArray.map((item, index) =>
    getDataOfCoin(
      item,
      quote,
      previousCryptoData ? previousCryptoData[index] : null,
      timeSlotsForPercent,
      timeSlotsForPrice
    )
  );
  return Promise.all(finalArray);
}

export { getCryptoData };
