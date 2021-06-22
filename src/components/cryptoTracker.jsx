import React, { Component } from "react";
import CryptoTable from "./cryptoTable";
import { getCryptoData } from "../services/cryptoService.js";
import _ from "lodash";

class CryptoTracker extends Component {
  state = {
    timeSlots: [1, 3, 15, 180],
    cryptoData: [],
    sortColumn: { path: "pair", order: "asc" },
    time: Date.now(),
  };
  
  previousCryptoData = null;
  interval;

  async componentDidMount() {
    this.populateCryptoData();
  }

  populateCryptoData = async () => {
    let cryptoData = await getCryptoData(
      this.previousCryptoData,
      ...this.state.timeSlots
    );
    this.setState({
      cryptoData: this.mapModelToView(cryptoData),
    });
    this.previousCryptoData = cryptoData;
    this.interval = setTimeout(this.populateCryptoData.bind(this), 5000);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  mapModelToView = (data) => {
    let mappedData = data.map((coinData, index) => {
      if (!coinData) return {};
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
    const { cryptoData, sortColumn, timeSlots } = this.state;
    const sorted = _.orderBy(cryptoData, [sortColumn.path], [sortColumn.order]);
    return (
      <div className="row">
        <CryptoTable
          cryptoData={sorted}
          sortColumn={sortColumn}
          onSort={this.handleSort}
          timeSlots={timeSlots}
        />
      </div>
    );
  }
}

export default CryptoTracker;
