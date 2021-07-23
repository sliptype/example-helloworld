import React from 'react';

import {
  establishConnection,
  establishPayer,
  checkProgram,
  sayHello,
  reportGreetings,
} from './solana';
import './App.css';

function App() {
  React.useEffect(() => {
    init();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>Hello world</p>
        <button onClick={handleClick}>Click Me</button>
      </header>
    </div>
  );

  async function init() {
    // Establish connection to the cluster
    await establishConnection();

    // Determine who pays for the fees
    await establishPayer();

    // Check if the program has been deployed
    await checkProgram();
  }

  async function handleClick() {
    // Say hello to an account
    await sayHello();

    // Find out how many times that account has been greeted
    await reportGreetings();
  }
}

export default App;
