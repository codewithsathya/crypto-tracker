import React from 'react';
import { ToastContainer } from 'react-toastify';
import Main from './components/main';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  return (
    <React.Fragment>
      <ToastContainer />
      <main className="container">
        <Main />
      </main>
    </React.Fragment>
  );
}

export default App;
