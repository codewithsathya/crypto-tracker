import React, { Component } from 'react';
import CryptoTable from './cryptoTable';

class CryptoTracker extends Component {
	state = { 
	 }
	render() { 
		return ( 
			<div className="row">
				<CryptoTable />
			</div>
		 );
	}
}
 
export default CryptoTracker;