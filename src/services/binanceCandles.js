const axios = require("axios");
const getTimeFrameInMilliseconds = require("../utils/getTimeFrameInMilliseconds");

let apiUrl = "https://api.binance.com/api/v3";
let limit = 1000;
function getKlinesApiUrl(
  symbol,
  timeFrame,
  startTimeInMilliseconds,
  endTimeInMilliseconds
) {
  return `${apiUrl}/klines?symbol=${symbol}&interval=${timeFrame}&startTime=${startTimeInMilliseconds}&endTime=${endTimeInMilliseconds}&limit=1000`;
}

async function getLimitedCandles(
  symbol,
  timeFrame,
  startTimeInMilliseconds,
  endTimeInMilliseconds
) {
  const { data: candles } = await axios.get(
    getKlinesApiUrl(
      symbol,
      timeFrame,
      startTimeInMilliseconds,
      endTimeInMilliseconds
    )
  );
  return candles;
}

function getLatestCandles(symbol, timeFrame, noOfCandles) {
  let endTime = new Date().getTime();
  let milliseconds = getTimeFrameInMilliseconds(timeFrame);

  let endTimeInMilliseconds = Math.floor(endTime / milliseconds) * milliseconds;
  let startTimeInMilliseconds = endTimeInMilliseconds - (noOfCandles - 1) * milliseconds;
  return getCandles(symbol, timeFrame, startTimeInMilliseconds, endTimeInMilliseconds);
}

async function getCandles(symbol, timeFrame, startTime, endTime, extraCandles = 0) {
  let milliseconds = getTimeFrameInMilliseconds(timeFrame);
  let endTimeInMilliseconds = new Date(endTime).getTime();
  let startTimeInMilliseconds = new Date(startTime).getTime() - extraCandles * milliseconds;
  endTimeInMilliseconds =
    Math.floor(endTimeInMilliseconds / milliseconds) * milliseconds;

  let noOfCandles =
    (endTimeInMilliseconds - startTimeInMilliseconds) / milliseconds + 1;

  try {
    if (noOfCandles <= limit) {
      return await getLimitedCandles(
        symbol,
        timeFrame,
        startTimeInMilliseconds,
        endTimeInMilliseconds
      );
    } else {
      let candles = [];
      let partition = 0;
      while (partition + limit < noOfCandles) {
        candles = [
          ...candles,
          ...(await getLimitedCandles(
            symbol,
            timeFrame,
            startTimeInMilliseconds + partition * milliseconds,
            startTimeInMilliseconds + (partition + limit - 1) * milliseconds
          )),
        ];
        partition += limit;
      }
      candles = [
        ...candles,
        ...(await getLimitedCandles(
          symbol,
          timeFrame,
          startTimeInMilliseconds + partition * milliseconds,
          endTimeInMilliseconds
        )),
      ];
      return candles;
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getCandles, 
  getLatestCandles
}