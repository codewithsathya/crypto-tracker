import http from "./httpService";

const minute = 60000;
const day = 24 * 60 * minute;
const limit = 500;

const apiUrl = "https://api.binance.com/api/v3";
const coinsArray = [
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
  // "COMP",
  // "THETA",
  // "LTC",
  // "EOS",
  // "TRX",
  // "RUNE",
  // "AXS",
  // "KSM",
  // "FORTH",
  // "UNI",
  // "BCH",
  // "IOST",
  // "GRT",
  // "ATOM",
  // "CAKE",
  // "SXP",
  // "CHZ",
  // "TFUEL",
  // "CELO",
  // "NEO",
  // "IOTX",
  // "BAKE",
  // "ZEC",
  // "XLM",
  // "SLP",
  // "LUNA",
  // "NEAR",
  // "MDX",
  // "FET",
  // "FTM",
  // "ROSE",
  // "XMR",
  // "EGLD",
  // "ONT",
  // "HBAR",
  // "SUSHI",
  // "WIN",
  // "KAVA",
  // "ENJ",
  // "ANT",
  // "CRV",
  // "IOTA",
  // "FTT",
  // "DENT",
  // "STMX",
  // "OMG",
  // "DOCK",
  // "WAVES",
  // "QTUM",
  // "MKR",
  // "STRAX",
  // "1INCH",
  // "DASH",
  // "ZIL",
  // "AVAX",
  // "HOT",
  // "BAT"
];
const quote = "USDT";

let athPrices = {};

async function getAthDifferences(base, quote, presentPrice) {
  if (!athPrices[base]) {
    let symbol = base + quote;
    let presentTime = new Date().getTime();
    let presentDay = Math.floor(presentTime / day) * day;
    let startDay = presentDay - (limit - 1) * day;

    const { data: candles } = await http.get(
      getUrl(symbol, startDay, presentDay, "1d")
    );
    let high = 0;
    for (let candle of candles) {
      if (parseFloat(candle[2]) > high) {
        high = parseFloat(candle[2]);
      }
    }
    athPrices[base] = high;
  }
  return parseFloat(
    (((presentPrice - athPrices[base]) / athPrices[base]) * 100).toFixed(2)
  );
}

function getUrl(symbol, startTime, endTime, timeFrame) {
  return `${apiUrl}/klines?symbol=${symbol}&interval=${timeFrame}&startTime=${startTime}&endTime=${endTime}`;
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
  return await http.get(getUrl(symbol, startMinute, presentMinute, "1m"));
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

  const { data: candles } = await getDataFromApi(
    symbol,
    startMinute,
    presentMinute
  );

  if (!candles || !candles[limit - 1]) return previousCryptoDataOfCoin;
  let presentPrice = parseFloat(candles[limit - 1][4]);

  let finalData = {};
  finalData.base = `${base}`;
  finalData.quote = `${quote}`;
  finalData.presentPrice = parseFloat(presentPrice.toPrecision(7));
  finalData.athDifference = await getAthDifferences(
    base,
    quote,
    finalData.presentPrice
  );

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
