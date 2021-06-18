import React from 'react';
import CryptoTracker from './components/cryptoTracker';
import './App.css';

function App() {
  return (
    <React.Fragment>
      <main className="container">
        <CryptoTracker />
      </main>
    </React.Fragment>
  );
}

export default App;
