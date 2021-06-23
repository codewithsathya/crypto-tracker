import React, { Component } from "react";
import CryptoTable from "./cryptoTable";
import { getCryptoData } from "../services/cryptoService.js";
import _ from "lodash";
import TimeForm from "./timeForm";

class CryptoTracker extends Component {
  state = {
    timeSlotsForPercent: [1, 3, 15, 60, 180],
    timeSlotsForPrice: [],
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
      this.state.timeSlotsForPercent,
      this.state.timeSlotsForPrice
    );
    this.setState({
      cryptoData: this.mapModelToView(cryptoData),
    });
    this.previousCryptoData = cryptoData;
    this.interval = setTimeout(this.populateCryptoData.bind(this), 5000);
  };

  sortData = (data, sortColumn) => {
    if (data.length !== 0 && typeof data[0][sortColumn.path] === "number") {
      if (sortColumn.order === "asc") {
        return data.sort((a, b) => a[sortColumn.path] - b[sortColumn.path]);
      } else {
        return data.sort((a, b) => b[sortColumn.path] - a[sortColumn.path]);
      }
    } else {
      return _.orderBy(data, [sortColumn.path], [sortColumn.order]);
    }
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
      coinData.percentDifferences.forEach((item) => {
        obj[`${item.timeDifference}min %`] = item.percentDifference;
      });
      coinData.priceDifferences.forEach((item) => {
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
    const { cryptoData, sortColumn, timeSlotsForPercent, timeSlotsForPrice } =
      this.state;
    let sorted = this.sortData(cryptoData, sortColumn);

    return (
      <div className="row">
        <div className="row">
          <div className="col-6 p-3">
            <TimeForm
              timeSlotsForPercent={timeSlotsForPercent}
              timeSlotsForPrice={timeSlotsForPrice}
            />
          </div>
        </div>
        <div className="row">
          <CryptoTable
            cryptoData={sorted}
            sortColumn={sortColumn}
            onSort={this.handleSort}
            timeSlotsForPercent={timeSlotsForPercent}
            timeSlotsForPrice={timeSlotsForPrice}
          />
        </div>
      </div>
    );
  }
}

export default CryptoTracker;
