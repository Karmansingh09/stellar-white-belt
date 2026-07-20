# StellarPay

![Stellar](https://img.shields.io/badge/Built%20for-Stellar%20White%20Belt-7DD3FC?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Freighter](https://img.shields.io/badge/Freighter%20Wallet-Compatible-0EA5E9?style=for-the-badge)

StellarPay is a React + Vite Web3 app built for the **Stellar Monthly Builder Challenge** and the **Stellar White Belt Submission**. It connects to the **Freighter Wallet**, reads the wallet address and XLM balance on **Stellar Testnet**, and lets users send native XLM transactions with a clean, judge-friendly UI.

Live Demo: https://stellar-white-belt-sigma.vercel.app

Repository: https://github.com/Karmansingh09/stellar-white-belt

## Project Overview

StellarPay demonstrates a simple end-to-end Stellar wallet experience for Testnet:

1. Connect a Freighter wallet.
2. Display the connected wallet address.
3. Fetch the wallet's XLM balance from Stellar Testnet.
4. Build, sign, and submit XLM payments.
5. Show transaction status and hash after submission.

The project is intentionally lightweight and focused on the core wallet and transaction flow judges care about in a hackathon submission.

## Features

- Connect Freighter Wallet
- Disconnect Wallet
- Display connected Stellar address
- Fetch and display XLM balance from Stellar Testnet
- Send XLM transactions on Testnet
- Show transaction success or failure
- Show the transaction hash after a successful transfer
- Responsive, modern, simple UI
- Console logs for wallet and transaction debugging

## Demo Links

- Live Demo: https://stellar-white-belt-sigma.vercel.app
- GitHub Repository: https://github.com/Karmansingh09/stellar-white-belt

## Screenshots

Add these images to your repository to complete the showcase. The wallet-connected screenshot should be saved as `public/screenshots/wallet-connected.png` and used as the featured proof of wallet integration.

| Preview | File |
| --- | --- |
| Wallet connected | `wallet-connected.png` |
| Balance displayed | `balance-displayed.png` |
| Send XLM form | `send-xlm.png` |
| Transaction success | `transaction-success.png` |
| Transaction hash | `transaction-hash.png` |

Required submission shots for judges:

- Wallet connected state
- Balance displayed
- Successful Testnet transaction
- Transaction result shown to the user
- Transaction hash visible after success

Example placeholders:

```md
![Wallet Connected](public/screenshots/wallet-connected.png)
![Balance Displayed](public/screenshots/balance-displayed.png)
![Send XLM](public/screenshots/send-xlm.png)
![Transaction Success](public/screenshots/transaction-success.png)
![Transaction Hash](public/screenshots/transaction-hash.png)
```

If you want to feature the wallet-connected state at the top of the README, add this line directly under the project intro:

```md
![StellarPay Wallet Connected](public/screenshots/wallet-connected.png)
```

## Installation Instructions

### Prerequisites

- Node.js 18+
- npm
- Freighter Wallet browser extension
- Freighter set to **Stellar Testnet**
- Testnet account funded with XLM

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

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```text
stellarpay/
├── public/
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Stellar Testnet Configuration

StellarPay is configured for **Stellar Testnet** and uses Freighter for wallet access.

### Wallet Requirements

- Freighter Wallet installed in the browser
- Freighter network set to **Testnet**
- Permission granted when prompted by the app

### Network Details

```js
Networks.TESTNET
```

### Horizon API

The app uses the Stellar Testnet Horizon endpoint for account lookup, balance fetching, fee estimation, and transaction submission:

```js
https://horizon-testnet.stellar.org
```

### Freighter Flow

The wallet flow used by the app is:

```js
isAllowed() -> requestAccess() -> getAddress() -> signTransaction()
```

## Tech Stack

- React
- Vite
- JavaScript
- Stellar SDK
- Freighter Wallet API
- Vercel

## Future Improvements

- Add multi-asset support beyond native XLM
- Add transaction history and recent activity
- Add QR code or paste-shortcut support for recipient addresses
- Add memo support for exchanges and memo-required accounts
- Add better validation for Stellar addresses and amounts
- Add network status and account loading indicators

## Acknowledgements

- **Stellar** for the ecosystem, SDK, and Testnet tooling
- **Freighter Wallet** for secure browser-based wallet integration
- The **Stellar Monthly Builder Challenge** for the submission prompt and inspiration

## License

This project is currently intended for challenge submission and demo purposes.

If you plan to publish or reuse it publicly, add a license file such as **MIT** or **Apache 2.0**.
