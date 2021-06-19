import React, { Component } from "react";
import Table from "./common/table";

class CryptoTable extends Component {
  columns = [
    { path: "pair", label: "Pair" },
    { path: "presentPrice", label: "Last Price" },
    { path: "3min %", label: "3min %" },
    { path: "3min $", label: "3min $" },
    { path: "6min %", label: "6min %" },
    { path: "6min $", label: "6min $" },
  ];
  state = {};
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
