import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./common/input";
import Radio from "./common/radio";

class TimeForm extends Component {
  state = { selectedRadio: "percent", data: { time: "" }, errors: {} };

  schema = {
    time: Joi.number().integer().min(1).required(),
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  validate = () => {
    const options = { abortEarly: false };
    if (this.state.selectedRadio === "")
      return { selectedRadio: "Select an option" };
    const { error } = Joi.validate(this.state.data, this.schema, options);
    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  handleRadioChange = ({ currentTarget: input }) => {
    this.setState({ selectedRadio: input.value });
  };

  handleAdd = () => {};

  handleDelete = () => {};

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    let errorMessage = this.validateProperty(input);
    if (errorMessage && errorMessage !== `"time" must be a number`)
      errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data, errors });
  };

  validateTime = (timeInMin = this.state.data.time) => {
    const { timeSlotsForPercent, timeSlotsForPrice } = this.props;
    const { selectedRadio } = this.state;
    // console.log(this.props);
    // console.log(selectedRadio);
    // console.log(typeof timeInMin);
    let time = parseInt(timeInMin);
    // console.log(timeSlotsForPercent);

    if (selectedRadio === "percent") {
      if (timeSlotsForPercent.includes(time)) {
        return "Already exists";
      } else return null;
    } else if (selectedRadio === "price") {
      if (timeSlotsForPrice.includes(time)) {
        return "Already exists";
      } else return null;
    } else {
      if (
        timeSlotsForPercent.includes(time) ||
        timeSlotsForPrice.includes(time)
      ) {
        return "Already exists";
      } else return null;
    }
  };

  render() {
    const { data, errors, selectedRadio } = this.state;
    // console.log(this.state.selectedRadio);
    return (
      <div className="flex-container d-flex flex-row flex-wrap justify-content-between align-content-center">
        <div className="flex-item-a">
          <Input
            name="time"
            placeholder="Enter time in min"
            value={data["time"]}
            onChange={this.handleChange}
            error={errors["time"]}
          />
        </div>
        <div className="flex-item-a">
          <Radio
            name="selectedRadio"
            label="Percent"
            value="percent"
            onChange={this.handleRadioChange}
            checked={selectedRadio === "percent" ? "check" : ""}
          />
        </div>
        <div className="flex-item-a">
          <Radio
            name="selectedRadio"
            label="Price"
            value="price"
            onChange={this.handleRadioChange}
            checked={selectedRadio === "price" ? "check" : ""}
          />
        </div>
        <div className="flex-item-a">
          <Radio
            name="selectedRadio"
            label="Both"
            value="both"
            onChange={this.handleRadioChange}
            checked={selectedRadio === "both" ? "check" : ""}
          />
        </div>

        <div className="flex-item-c">
          <button
            className="btn btn-primary btn-sm"
            disabled={this.validate() || this.validateTime()}
          >
            Add
          </button>
        </div>
        <div className="flex-item-c">
          <button
            className="btn btn-danger btn-sm"
            disabled={this.validate() || !this.validateTime()}
          >
            Delete
          </button>
        </div>
      </div>
    );
  }
}

export default TimeForm;
