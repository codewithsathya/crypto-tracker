import React from 'react';
import { ToastContainer } from 'react-toastify';
import CryptoTracker from './components/cryptoTracker';
import './App.css';

function App() {
  return (
    <React.Fragment>
      <ToastContainer />
      <main className="container">
        <CryptoTracker />
      </main>
    </React.Fragment>
  );
}

export default App;
