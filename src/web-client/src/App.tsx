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
  const [greetedPubkey, setGreetedPubkey] = React.useState('');
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    init();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>Hello world</p>
        <button onClick={handleClick}>Click Me</button>
        <div>
          {greetedPubkey} has been greeted {count} times
        </div>
      </header>
    </div>
  );

  async function init() {
    // Establish connection to the cluster
    await establishConnection();

    // Determine who pays for the fees
    await establishPayer();

    // Check if the program has been deployed
    const greetedPubKey = await checkProgram();
    setGreetedPubkey(greetedPubKey?.toString() ?? '');

    await getCount();
  }

  async function getCount() {
    // Find out how many times that account has been greeted
    const count = await reportGreetings();
    setCount(count);
  }

  async function handleClick() {
    // Say hello to an account
    await sayHello();

    await getCount();
  }
}

export default App;
