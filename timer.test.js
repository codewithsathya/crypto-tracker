const axios = require("axios");

let url = "https://api.binance.com/api/v3";

let minute = 60000;
let hour = 60 * minute;

let now = new Date().getTime();
let nextMinute = now - (now % minute) + minute + 20;
let millis = nextMinute - now;


show();
setTimeout(() => {
  repeatEveryMinute();
}, millis);

async function show() {
  let now = new Date().getTime();
  try {
    let { data } = await axios.get(`${url}/klines?symbol=BTCUSDT&interval=1m&startTime=${now - 2 * minute}&endTime=${now}`);
    console.log(data);
  } catch (error) {
    console.log(error);
  }
  console.log("Hello");
}

function repeatEveryMinute() {
  show();
  nextMinute += minute;
  let millis = nextMinute - new Date().getTime();
  setTimeout(repeatEveryMinute, millis);
}
