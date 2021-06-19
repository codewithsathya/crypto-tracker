import React, { Component } from "react";

class CryptoTable extends Component {
  state = {};
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-1">Hello</div>
          <div className="col">Hello</div>
        </div>
				<div className="row">
					<div className="col-2">Hello</div>
					<div className="col">Hello</div>
				</div>
				<div className="row">
					<div className="col-3">Hello</div>
					<div className="col">Hello</div>
				</div>
				<div className="row">
					<div className="col-4">Hello</div>
					<div className="col">Hello</div>
				</div>
				<div className="row">
					<div className="col-5">Hello</div>
					<div className="col">Hello</div>
				</div>
      </div>
    );
  }
}

export default CryptoTable;
