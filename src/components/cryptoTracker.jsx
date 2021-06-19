import React, { Component } from "react";
import CryptoTable from "./cryptoTable";
import crypto from '../services/cryptoService.js';

class CryptoTracker extends Component {
  state = {
		timeSlots: [3, 6],
    cryptoData: [],
    sortColumn: { path: "pair", order: "asc" },
  };

  async componentDidMount() {
		let cryptoData = await crypto.getCryptoData(...this.state.timeSlots);
		console.log(cryptoData);
    this.setState({
      cryptoData,
    });
  }

  render() {
    return (
      <div className="row">
        <CryptoTable />
      </div>
    );
  }
}

export default CryptoTracker;
