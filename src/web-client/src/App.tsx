import React from 'react';

import {
  establishConnection,
  createAccount,
  transfer,
  getBalance as fetchBalance,
} from './solana';
import './App.css';
import {PublicKey} from '@solana/web3.js';

function App() {
  const addressRef = React.useRef<HTMLInputElement>(null);
  const amountRef = React.useRef<HTMLInputElement>(null);
  const [account, setAccount] = React.useState('');
  const [balance, setBalance] = React.useState(0);
  React.useEffect(() => {
    init();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>$BROWSER_COIN</p>
        <div>Your account is: {account}</div>
        <div>Your balance is: {balance}</div>
        <button onClick={getBalance}>Refresh</button>
        <h2>Transfer</h2>
        <input ref={addressRef} name="address" placeholder="0x"></input>
        <input ref={amountRef} name="amount" placeholder="0"></input>
        <button onClick={handleClick}>Transfer</button>
      </header>
    </div>
  );

  async function init() {
    // Establish connection to the cluster
    await establishConnection();

    // Create account
    const createdAccount = await createAccount();
    setAccount(createdAccount.toString());

    getBalance();
  }

  async function getBalance() {
    const b = await fetchBalance();
    setBalance(Number(b));
  }

  async function handleClick() {
    const address = addressRef.current?.value;
    const amount = amountRef.current?.value;
    if (address && amount) {
      await transfer(new PublicKey(address), Number(amount));
      getBalance();
    }
  }
}

export default App;
