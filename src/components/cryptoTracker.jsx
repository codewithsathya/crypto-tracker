import React, { Component } from "react";
import CryptoTable from "./cryptoTable";
import { getCryptoData } from "../services/cryptoService.js";
import mapModelToView from "../utils/mapModelToView";
import sortData from "../utils/sortData";
import _ from "lodash";
import TimeForm from "./timeForm";

class CryptoTracker extends Component {
  state = {
    timeSlotsForPercent: [1, 3, 5, 10, 15, 30, 60, 120, 180],
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
      cryptoData: mapModelToView(cryptoData),
    });
    this.previousCryptoData = cryptoData;
    this.interval = setTimeout(this.populateCryptoData.bind(this), 5000);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleAddTime = (time, selectedOption) => {
    this.addOrDeleteTime(time, selectedOption, "add");
  };

  handleDeleteTime = (time, selectedOption) => {
    this.addOrDeleteTime(time, selectedOption, "delete");
  };

  addOrDeleteTime = (time, selectedOption, addOrDelete) => {
    let timeSlotsForPercent = [...this.state.timeSlotsForPercent];
    let timeSlotsForPrice = [...this.state.timeSlotsForPrice];
    if (addOrDelete === "add")
      if (selectedOption === "percent") {
        timeSlotsForPercent.push(time);
      } else {
        timeSlotsForPrice.push(time);
      }
    else {
      if (selectedOption === "percent") {
        timeSlotsForPercent = _.remove(timeSlotsForPercent, (value) => {
          return value !== time;
        });
      } else {
        timeSlotsForPrice = _.remove(timeSlotsForPrice, (value) => {
          return value !== time;
        });
      }
    }
    this.setState({ timeSlotsForPercent, timeSlotsForPrice });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  render() {
    const { cryptoData, sortColumn, timeSlotsForPercent, timeSlotsForPrice } =
      this.state;
    let sorted = sortData(cryptoData, sortColumn);

    return (
      <div className="row">
        <div className="row">
          <div className="col-md-6 col-xs-12 p-3">
            <TimeForm
              timeSlotsForPercent={timeSlotsForPercent}
              timeSlotsForPrice={timeSlotsForPrice}
              handleAddTime={this.handleAddTime}
              handleDeleteTime={this.handleDeleteTime}
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
