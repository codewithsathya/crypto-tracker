import React, { Component } from "react";
import Table from "./common/table";

class CryptoTable extends Component {
  columns = [];

  defaultColumns = [
    { path: "pair", label: "Pair" },
    { path: "presentPrice", label: "Last Price" },
  ];

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(this.props.timeSlotsForPercent) !==
        JSON.stringify(prevProps.timeSlotsForPercent) ||
      JSON.stringify(this.props.timeSlotsForPrice) !==
        JSON.stringify(prevProps.timeSlotsForPrice)
    )
      this.setColumns();
  }

  componentDidMount() {
    this.setColumns();
  }

  setColumns = () => {
    let { timeSlotsForPercent, timeSlotsForPrice } = this.props;
    let columns = [...this.defaultColumns];
    timeSlotsForPercent.forEach((i) => {
      columns.push({ path: `${i}min %`, label: `${i}min %` });
    });
    timeSlotsForPrice.forEach((i) => {
      columns.push({ path: `${i}min $`, label: `${i}min $` });
    });
    this.columns = columns;
  };

  render() {
    const { cryptoData, onSort, sortColumn } = this.props;
    return (
      <Table
        data={cryptoData}
        columns={this.columns}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default CryptoTable;
