import "./App.css";
import { useEffect, useState } from "react";
import {
  AlbedoModule,
  BitgetModule,
  CactusLinkModule,
  DcentModule,
  FreighterModule,
  HanaModule,
  KleverModule,
  LedgerModule,
  LobstrModule,
  Networks,
  OneKeyModule,
  RabetModule,
  StellarWalletsKit,
  SwkAppDarkTheme,
  xBullModule,
} from "@creit.tech/stellar-wallets-kit";

const voteOptions = [
  {
    id: "A",
    label: "Option A",
    description: "Community proposal alpha.",
    votes: "0",
    accent: "cyan",
  },
  {
    id: "B",
    label: "Option B",
    description: "Community proposal beta.",
    votes: "0",
    accent: "violet",
  },
];

const statusPills = [
  { label: "Connection Status", value: "Not Connected" },
  { label: "Transaction Status", value: "Waiting..." },
];

const walletModules = [
  new FreighterModule(),
  new xBullModule(),
  new AlbedoModule(),
  new HanaModule(),
  new LobstrModule(),
  new RabetModule(),
  new OneKeyModule(),
  new CactusLinkModule(),
  new DcentModule(),
  new BitgetModule(),
  new KleverModule(),
  new LedgerModule(),
];

const isUserRejectedError = (error) => {
  const message = String(error?.message || error?.error?.message || "").toLowerCase();
  const code = error?.code ?? error?.error?.code;

  return (
    code === -1 &&
    (message.includes("closed the modal") ||
      message.includes("rejected") ||
      message.includes("cancel") ||
      message.includes("denied"))
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

  useEffect(() => {
    StellarWalletsKit.init({
      modules: walletModules,
      network: Networks.TESTNET,
      theme: SwkAppDarkTheme,
      authModal: {
        hideUnsupportedWallets: false,
        showInstallLabel: true,
      },
    });

    StellarWalletsKit.refreshSupportedWallets().catch(() => {
      setWalletError("Wallet not found.");
    });
  }, []);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    setWalletError("");
    setConnectionStatus("Connecting...");

    try {
      const supportedWallets = await StellarWalletsKit.refreshSupportedWallets();
      const availableWallets = supportedWallets.filter((wallet) => wallet.isAvailable);

      if (!availableWallets.length) {
        throw new Error("Wallet not found.");
      }

      const { address } = await StellarWalletsKit.authModal();
      const selectedWallet = StellarWalletsKit.selectedModule?.productName || "Unknown wallet";

      setWalletAddress(address);
      setWalletProvider(selectedWallet);
      setConnectionStatus("Connected");
    } catch (error) {
      setWalletAddress("Not Connected");
      setWalletProvider("Not Connected");
      setConnectionStatus("Connection failed");
      setWalletError(getWalletErrorMessage(error));
    } finally {
      setIsConnecting(false);
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
                <span className="info-row__value">Waiting...</span>
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
                <span className="vote-count__value">{option.votes}</span>
              </div>

              <button className="vote-button" type="button">
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
              {statusPills.map((item) => (
                <div key={item.label} className="status-pill">
                  <span className="status-pill__label">{item.label}</span>
                  <span className="status-pill__value">{item.value}</span>
                </div>
              ))}
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}

export default App;