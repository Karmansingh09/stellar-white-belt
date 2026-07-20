# StellarPoll - Yellow Belt Submission

![Stellar](https://img.shields.io/badge/Built%20for-Stellar%20Yellow%20Belt-F59E0B?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Soroban](https://img.shields.io/badge/Soroban-Smart%20Contracts-8B5CF6?style=for-the-badge)
![Freighter](https://img.shields.io/badge/Freighter%20Wallet-Compatible-0EA5E9?style=for-the-badge)

StellarPoll is a React + Vite Web3 dApp built for the **Stellar Monthly Builder Challenge - Yellow Belt Submission**. It demonstrates a full-stack integration with a **Soroban Smart Contract** on the **Stellar Testnet**, allowing users to vote on-chain using their Freighter wallet.

Live Demo: https://stellar-yellow-belt-demo.vercel.app

Repository: https://github.com/Karmansingh09/stellar-yellow-belt

## Project Overview

StellarPoll fulfills the Yellow Belt requirements by interacting with a deployed Soroban smart contract. 

1. Connect a Freighter wallet.
2. View real-time polling data fetched from the smart contract.
3. Submit a vote (`vote_a` or `vote_b`) by signing a Soroban transaction via Freighter.
4. Display the resulting transaction hash and updated vote counts.

## Features

- **Soroban Integration**: Uses `@stellar/stellar-sdk` to simulate and submit transactions to a Soroban contract.
- **On-Chain Voting**: Users can interact with the contract's `vote_a` and `vote_b` methods.
- **Real-Time Polling**: The frontend polls the contract's `get_votes` method every 5 seconds to keep the UI in sync.
- **Freighter Wallet**: Seamlessly connects to Freighter to approve transactions.
- **Modern UI**: A responsive, animated, and clean interface to display the voting status.

## Smart Contract Details

- **Network**: Stellar Testnet
- **Contract ID**: `CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM`
- **Methods**:
  - `vote_a()`: Increments the vote count for Option A.
  - `vote_b()`: Increments the vote count for Option B.
  - `get_votes()`: Returns the current vote tallies.

## Screenshots

Required submission shots for judges:

![Wallet Connected](public/screenshots/wallet-connected.png)
![Voting Interface](public/screenshots/voting-interface.png)
![Transaction Success](public/screenshots/transaction-success.png)
![Transaction Hash](public/screenshots/transaction-hash.png)

## Installation Instructions

### Prerequisites

- Node.js 18+
- npm
- Freighter Wallet browser extension
- Freighter set to **Stellar Testnet**

### Install Dependencies

```bash
npm install
```

## Running Locally

Start the Vite development server on `localhost:5173`:

```bash
npm run dev
```

Open the app in your browser:

```bash
http://localhost:5173
```

Build the production version:

```bash
npm run build
```

## Tech Stack

- **Frontend**: React, Vite, CSS
- **Blockchain**: Stellar Soroban, `@stellar/stellar-sdk`
- **Wallet**: Freighter Wallet

## Acknowledgements

- **Stellar & Soroban** for the ecosystem and smart contract platform.
- **Freighter Wallet** for secure browser-based wallet integration.
- The **Stellar Monthly Builder Challenge** for the Yellow Belt prompt!
