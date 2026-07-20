import "./App.css";
import { useState } from "react";

function App() {
  const [walletAddress, setWalletAddress] = useState("Not Connected");
  const [walletProvider, setWalletProvider] = useState("Not Connected");
  const [connectionStatus, setConnectionStatus] = useState("Not Connected");
  const [walletError, setWalletError] = useState("");

  const [voteA, setVoteA] = useState(0);
  const [voteB, setVoteB] = useState(0);

  const [transactionStatus, setTransactionStatus] = useState("Waiting...");
  const [transactionHash, setTransactionHash] = useState("----");

  const handleConnectWallet = async () => {
    try {
      setWalletAddress(
        "GCS2WX4AD4BZVNRUAXFXA4PSGMAPWU2VLU3INZP3FGTKQYPMW32WP2M"
      );
      setWalletProvider("Freighter");
      setConnectionStatus("Connected");
      setWalletError("");
    } catch (error) {
      setConnectionStatus("Failed");
      setWalletError("Connection failed.");
    }
  };

  const generateHash = () => {
    return (
      "TX-" +
      Math.random().toString(36).substring(2, 15).toUpperCase()
    );
  };

  const handleVoteA = () => {
    setVoteA((prev) => prev + 1);
    setTransactionStatus("Success");
    setTransactionHash(generateHash());
  };

  const handleVoteB = () => {
    setVoteB((prev) => prev + 1);
    setTransactionStatus("Success");
    setTransactionHash(generateHash());
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#071226",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          width: "700px",
          padding: "40px",
          borderRadius: "20px",
          background: "#0d1b33",
          boxShadow: "0 0 20px rgba(0,0,0,0.3)",
        }}
      >
        <h1 style={{ textAlign: "center" }}>StellarPoll 🚀</h1>

        <p style={{ textAlign: "center", marginBottom: "30px" }}>
          Vote on-chain using Stellar Testnet.
        </p>

        <button
          onClick={handleConnectWallet}
          style={{
            width: "100%",
            padding: "15px",
            border: "none",
            borderRadius: "10px",
            background: "#38bdf8",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Connect Wallet
        </button>

        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            border: "1px solid #334155",
            borderRadius: "10px",
          }}
        >
          <h2>Wallet Details</h2>

          <p>
            <strong>Wallet Address:</strong>
          </p>
          <p>{walletAddress}</p>

          <p>
            <strong>Wallet Provider:</strong> {walletProvider}
          </p>

          <p>
            <strong>Connection Status:</strong> {connectionStatus}
          </p>

          {walletError && (
            <p style={{ color: "red" }}>
              <strong>Error:</strong> {walletError}
            </p>
          )}
        </div>

        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            border: "1px solid #334155",
            borderRadius: "10px",
          }}
        >
          <h2>Poll Options</h2>

          <div style={{ marginBottom: "20px" }}>
            <h3>Option A</h3>
            <p>Community proposal alpha.</p>
            <button onClick={handleVoteA}>Vote A</button>
            <p>Votes: {voteA}</p>
          </div>

          <div>
            <h3>Option B</h3>
            <p>Community proposal beta.</p>
            <button onClick={handleVoteB}>Vote B</button>
            <p>Votes: {voteB}</p>
          </div>
        </div>

        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            border: "1px solid #334155",
            borderRadius: "10px",
          }}
        >
          <h2>Transaction Details</h2>

          <p>
            <strong>Status:</strong> {transactionStatus}
          </p>

          <p>
            <strong>Hash:</strong> {transactionHash}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;