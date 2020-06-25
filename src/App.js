import React from 'react';
import logo from './logo.svg';
import Graphic from './graphic3d'
import './App.css';

function App() {
  return (
    <div className="App">
      {/* <header className="App-header"> */}
      <h1>3d Ex3</h1>
        <Graphic/>
        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
      {/* </header> */}
    </div>
  );
}

export default App;
