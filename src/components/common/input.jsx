import React from "react";

const Input = ({ name, error, ...rest }) => {
  return (
    <div className="form-group">
      <input {...rest} name={name} id={name} className="form-control" />
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

export default Input;
