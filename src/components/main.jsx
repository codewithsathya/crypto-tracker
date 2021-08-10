import React, { Component } from "react";
import CryptoTracker from "./cryptoTracker";
import getTradableCoins from "../services/cryptoDataMethods";

class Main extends Component {
  state = {
    tradablePairs: {},
    candles: {},
    defaultQuote: "USDT"
  };

  constructor() {
    super();
  }

  async componentDidMount() {
    let tradablePairs = await getTradableCoins(["BTC", "BNB", "ETH", "DOT", "ATOM"]);
    this.setState({ tradablePairs });
  }

  render() {
    console.log(this.state.tradablePairs);
    return <CryptoTracker />;
  }
}

export default Main;
