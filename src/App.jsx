import "./App.css";
import { useEffect, useState } from "react";

const voteOptions = [
  {
    id: "A",
    label: "Option A",
    description: "Community proposal alpha.",
    accent: "cyan",
  },
  {
    id: "B",
    label: "Option B",
    description: "Community proposal beta.",
    accent: "violet",
  },
];

const isUserRejectedError = (error) => {
  const message = String(error?.message || error?.error?.message || "").toLowerCase();
  const code = error?.code ?? error?.error?.code;

  return (
    code === -1 ||
    message.includes("closed the modal") ||
    message.includes("rejected") ||
    message.includes("cancel") ||
    message.includes("denied") ||
    message.includes("user reject")
  );
};

const getWalletErrorMessage = (error) => {
  const message = String(error?.message || error?.error?.message || error || "");
  const lowered = message.toLowerCase();

  if (isUserRejectedError(error)) {
    return "User rejected connection.";
  }

  if (lowered.includes("insufficient")) {
    return "Insufficient balance.";
  }

  if (lowered.includes("wallet not found") || lowered.includes("no supported wallet")) {
    return "Wallet not found.";
  }

  return message || "Unable to connect wallet.";
};

function App() {
  const [walletAddress, setWalletAddress] = useState("Not Connected");
  const [walletProvider, setWalletProvider] = useState("Not Connected");
  const [connectionStatus, setConnectionStatus] = useState("Not Connected");
  const [walletError, setWalletError] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState("Waiting...");
  const [votes, setVotes] = useState({ A: 0, B: 0 });

  useEffect(() => {
    if (typeof window !== "undefined" && !window.freighter) {
      setWalletError("Freighter not detected. Please install the Freighter extension.");
    }
  }, []);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    setWalletError("");
    setConnectionStatus("Connecting...");

    try {
      if (typeof window === "undefined" || !window.freighter) {
        throw new Error("Freighter wallet not found.");
      }

      const address = await window.freighter.requestAccess();
      if (!address) {
        throw new Error("User rejected connection.");
      }

      setWalletAddress(address);
      setWalletProvider("Freighter");
      setConnectionStatus("Connected");
      setWalletError("");
    } catch (error) {
      setWalletAddress("Not Connected");
      setWalletProvider("Not Connected");
      setConnectionStatus("Connection failed");
      setWalletError(getWalletErrorMessage(error));
    } finally {
      setIsConnecting(false);
    }
  };

  const handleVote = async (optionId) => {
    if (connectionStatus !== "Connected") {
      setWalletError("Please connect your wallet first.");
      return;
    }
    setWalletError("");
    setTransactionStatus("Submitting vote...");

    try {
      if (typeof window === "undefined" || !window.freighter) {
        throw new Error("Freighter wallet not found.");
      }

      const address = await window.freighter.requestAccess();
      if (!address) {
        throw new Error("User rejected connection.");
      }

      setTransactionStatus("Signing transaction...");
      // Simulate Soroban contract interaction / transaction signing delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      setVotes((prev) => ({
        ...prev,
        [optionId]: prev[optionId] + 1,
      }));
      setTransactionStatus(`Vote for Option ${optionId} successful!`);
    } catch (error) {
      setTransactionStatus("Transaction failed");
      setWalletError(getWalletErrorMessage(error));
    }
  };

  const walletBadge = isConnecting
    ? "Connecting"
    : connectionStatus === "Connected"
      ? "Connected"
      : "Offline";

  return (
    <main className="poll-app">
      <div className="aurora aurora-left" aria-hidden="true" />
      <div className="aurora aurora-right" aria-hidden="true" />

      <section className="shell">
        <header className="hero card">
          <div className="hero__copy">
            <span className="eyebrow">Stellar Soroban Voting</span>
            <h1>StellarPoll</h1>
            <p className="subtitle">Vote on-chain using Stellar Soroban.</p>
          </div>

          <div className="hero__actions">
            <button
              className="primary-button"
              type="button"
              onClick={handleConnectWallet}
              disabled={isConnecting}
              aria-busy={isConnecting}
            >
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
            <div className="status-chip status-chip--demo">Demo UI</div>
          </div>
        </header>

        <section className="grid grid--top">
          <article className="card card--wallet">
            <div className="card__heading">
              <span className="card__label">Wallet Panel</span>
              <span className="card__badge card__badge--neutral">{walletBadge}</span>
            </div>

            <div className="info-stack">
              <div className="info-row">
                <span className="info-row__label">Wallet Address</span>
                <span className="info-row__value info-row__value--mono">{walletAddress}</span>
              </div>
              <div className="info-row">
                <span className="info-row__label">Wallet Name / Provider</span>
                <span className="info-row__value">{walletProvider}</span>
              </div>
              <div className="info-row">
                <span className="info-row__label">Connection Status</span>
                <span className="info-row__value">{connectionStatus}</span>
              </div>
            </div>

            {walletError ? (
              <p style={{ marginTop: "14px", color: "#fca5a5", lineHeight: 1.5 }}>
                {walletError}
              </p>
            ) : null}
          </article>

          <article className="card card--contract">
            <div className="card__heading">
              <span className="card__label">Contract Details</span>
              <span className="card__badge card__badge--mint">Soroban</span>
            </div>

            <div className="info-stack">
              <div className="info-row">
                <span className="info-row__label">Contract Address</span>
                <span className="info-row__value info-row__value--mono">CBXXXXXXXXXXXXXXXX</span>
              </div>
              <div className="info-row">
                <span className="info-row__label">Transaction Hash</span>
                <span className="info-row__value info-row__value--mono">----</span>
              </div>
              <div className="info-row">
                <span className="info-row__label">Transaction Status</span>
                <span className="info-row__value">{transactionStatus}</span>
              </div>
            </div>
          </article>
        </section>

        <section className="grid grid--votes">
          {voteOptions.map((option) => (
            <article key={option.id} className={`card vote-card vote-card--${option.accent}`}>
              <div className="vote-card__top">
                <span className="card__label">Voting Option</span>
                <span className="card__badge">Live</span>
              </div>

              <div>
                <h2>{option.label}</h2>
                <p className="muted">{option.description}</p>
              </div>

              <div className="vote-count">
                <span className="vote-count__label">Votes</span>
                <span className="vote-count__value">{votes[option.id]}</span>
              </div>

              <button 
                className="vote-button" 
                type="button"
                onClick={() => handleVote(option.id)}
              >
                Vote {option.id}
              </button>
            </article>
          ))}
        </section>

        <section className="grid grid--status">
          <article className="card status-card">
            <div className="card__heading">
              <span className="card__label">Session Status</span>
              <span className="card__badge card__badge--dark">Placeholder</span>
            </div>

            <div className="status-list">
              <div className="status-pill">
                <span className="status-pill__label">Connection Status</span>
                <span className="status-pill__value">{connectionStatus}</span>
              </div>
              <div className="status-pill">
                <span className="status-pill__label">Transaction Status</span>
                <span className="status-pill__value">{transactionStatus}</span>
              </div>
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}

export default App;