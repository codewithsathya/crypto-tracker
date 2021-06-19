import React, { Component } from "react";
import CryptoTable from "./cryptoTable";
import crypto from "../services/cryptoService.js";

class CryptoTracker extends Component {
  state = {
    timeSlots: [3, 6],
    cryptoData: [],
    sortColumn: { path: "pair", order: "asc" },
  };

  async componentDidMount() {
    let cryptoData = await crypto.getCryptoData(...this.state.timeSlots);
    this.setState({
      cryptoData: this.mapModelToView(cryptoData),
    });
  }

  mapModelToView = (data) => {
    let mappedData = data.map((coinData, index) => {
      let obj = {};
      obj._id = index.toString();
      obj.pair = coinData.pair;
      obj.presentPrice = coinData.presentPrice;
      coinData.differences.forEach((item) => {
        obj[`${item.timeDifference}min %`] = item.percentDifference;
        obj[`${item.timeDifference}min $`] = item.priceDifference;
      });
      return obj;
    });
    return mappedData;
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  render() {
    const { cryptoData, sortColumn } = this.state;
    return (
      <div className="row">
        <CryptoTable cryptoData={cryptoData} sortColumn={sortColumn} onSort={this.handleSort}/>
      </div>
    );
  }
}

export default CryptoTracker;
