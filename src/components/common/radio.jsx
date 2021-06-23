import React from 'react';

const Radio = ({name, label, ...rest}) => {
	return ( 
		<div className="form-check">
			<input {...rest} type="radio" className="form-check-input" name={name} id={name}/>
			<label htmlFor={name} className="form-check-label">{label}</label>
		</div>
	 );
}
 
export default Radio;