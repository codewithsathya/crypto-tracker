import React, { Component } from "react";
import CryptoTable from "./cryptoTable";
import { getCryptoData } from "../services/cryptoService.js";
import _ from "lodash";

class CryptoTracker extends Component {
  state = {
    timeSlots: [1, 3, 60],
    cryptoData: [],
    sortColumn: { path: "pair", order: "asc" },
    temp: 1,
  };

  async componentDidMount() {
    let cryptoData = await getCryptoData(...this.state.timeSlots);
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
