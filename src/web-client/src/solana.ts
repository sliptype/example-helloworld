/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {Token, TOKEN_PROGRAM_ID} from '@solana/spl-token';
import {
  Keypair,
  Connection,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';

const RPC_URL = 'https://api.devnet.solana.com';

const TOKEN_ADDRESS = new PublicKey(
  'A1ppnB3P7KtKqEM1eu7qUcxGhnimXN71ty5JVnhDEH2s',
);

let account: Keypair;
let connection: Connection;

let token: Token;

/**
 * Establish a connection to the cluster
 */
export async function establishConnection(): Promise<void> {
  connection = new Connection(RPC_URL, 'confirmed');
  const version = await connection.getVersion();
  console.log('Connection to cluster established:', RPC_URL, version);
}

/**
 * Create an account for this session
 */
export async function createAccount(): Promise<PublicKey> {
  account = Keypair.generate();
  const fromAirdropSignature = await connection.requestAirdrop(
    account.publicKey,
    LAMPORTS_PER_SOL,
  );

  await connection.confirmTransaction(fromAirdropSignature);

  token = new Token(connection, TOKEN_ADDRESS, TOKEN_PROGRAM_ID, account);
  await token.getOrCreateAssociatedAccountInfo(account.publicKey);

  return account.publicKey;
}

/**
 * Transfer balance
 */
export async function transfer(
  toTokenAccountAddress: PublicKey,
  amount: number,
): Promise<void> {
  const fromTokenAccount = await token.getOrCreateAssociatedAccountInfo(
    account.publicKey,
  );

  const toTokenAccount = await token.getOrCreateAssociatedAccountInfo(
    toTokenAccountAddress,
  );

  const transaction = new Transaction().add(
    Token.createTransferInstruction(
      TOKEN_PROGRAM_ID,
      fromTokenAccount.address,
      toTokenAccount.address,
      account.publicKey,
      [],
      amount * 1000000000,
    ),
  );

  await sendAndConfirmTransaction(connection, transaction, [account], {
    commitment: 'confirmed',
  });
}

/**
 * Get the balance
 */
export async function getBalance(): Promise<number> {
  const tokenAccount = await token.getOrCreateAssociatedAccountInfo(
    account.publicKey,
  );
  return tokenAccount.amount.toNumber();
}
