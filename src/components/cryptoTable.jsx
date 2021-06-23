import React, { Component } from "react";
import Table from "./common/table";

class CryptoTable extends Component {
  state = {
    columns: [
      { path: "pair", label: "Pair" },
      { path: "presentPrice", label: "Last Price" },
    ],
  };

  componentDidMount() {
    let { timeSlotsForPercent, timeSlotsForPrice } = this.props;
    let columns = [...this.state.columns];
		timeSlotsForPercent.forEach(i => {
			columns.push({path: `${i}min %`, label: `${i}min %`})
		})
		timeSlotsForPrice.forEach(i => {
			columns.push({path: `${i}min $`, label: `${i}min $`})
		})
    this.setState({ columns });
  }

  render() {
    const { cryptoData, onSort, sortColumn } = this.props;
    return (
      <Table
        data={cryptoData}
        columns={this.state.columns}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default CryptoTable;
