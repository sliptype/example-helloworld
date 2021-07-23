import React from 'react';

import {PublicKey} from '@solana/web3.js';

import {
  establishConnection,
  createAccount,
  transfer,
  getBalance as fetchBalance,
} from './solana';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  CloseButton,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from '@chakra-ui/react';

function App() {
  const addressRef = React.useRef<HTMLInputElement>(null);
  const amountRef = React.useRef<HTMLInputElement>(null);
  const [account, setAccount] = React.useState('');
  const [balance, setBalance] = React.useState(0);
  const [error, setError] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  React.useEffect(() => {
    init();
  }, []);

  return (
    <>
      {error && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle mr={2}>Something went wrong!</AlertTitle>
          <AlertDescription>Please refresh and try again</AlertDescription>
          <CloseButton
            onClick={() => setError(false)}
            position="absolute"
            right="8px"
            top="8px"
          />
        </Alert>
      )}
      {success && (
        <Alert status="success">
          <AlertIcon />
          <AlertTitle mr={2}>Transfer successful!</AlertTitle>
          <AlertDescription>
            The recipient has received $BROWSER_COIN
          </AlertDescription>
          <CloseButton
            onClick={() => setSuccess(false)}
            position="absolute"
            right="8px"
            top="8px"
          />
        </Alert>
      )}
      <Container h="100%">
        <Heading mt={20} mb={5}>
          $BROWSER_COIN
        </Heading>
        <Box mb={4}>
          <div>Your account is: {account}</div>
          <div>Your balance is: {balance}</div>
        </Box>
        <Button onClick={getBalance}>Refresh</Button>
        <Heading mt={10}>Transfer</Heading>
        <Box mb={4}>
          <FormControl id="address">
            <FormLabel>Solana Address</FormLabel>
            <Input ref={addressRef}></Input>
          </FormControl>
          <FormControl id="amount">
            <FormLabel>Amount</FormLabel>
            <Input ref={amountRef} placeholder="0"></Input>
          </FormControl>
        </Box>
        <Button onClick={handleClick}>Transfer</Button>
      </Container>
    </>
  );

  async function init() {
    setError(false);
    try {
      // Establish connection to the cluster
      await establishConnection();

      // Create account
      const createdAccount = await createAccount();
      setAccount(createdAccount.toString());

      getBalance();
    } catch {
      setError(true);
    }
  }

  async function getBalance() {
    const b = await fetchBalance();
    setBalance(Number(b) / 1000000000);
  }

  async function handleClick() {
    setSuccess(false);
    const address = addressRef.current?.value;
    const amount = amountRef.current?.value;
    if (address && amount) {
      try {
        await transfer(new PublicKey(address), Number(amount));
        getBalance();
        setSuccess(true);
      } catch {
        setError(true);
      }
    }
  }
}

export default App;
