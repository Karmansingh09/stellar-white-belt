import { useEffect, useState } from "react";
import {
  getAddress,
  isAllowed,
  requestAccess,
  signTransaction,
} from "@stellar/freighter-api";
import {
  Asset,
  Horizon,
  Networks,
  Operation,
  TransactionBuilder,
} from "@stellar/stellar-sdk";

const horizonServer = new Horizon.Server("https://horizon-testnet.stellar.org");

function App() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("0");
  const [status, setStatus] = useState("Checking wallet...");
  const [error, setError] = useState("");
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [sending, setSending] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("");
  const [transactionHash, setTransactionHash] = useState("");

  const getErrorMessage = (err, fallbackMessage) => {
    if (err instanceof Error) {
      return err.message;
    }

    if (typeof err === "string") {
      return err;
    }

    return fallbackMessage;
  };

  const readWalletAddress = async () => {
    console.log("[StellarPay] Reading wallet address...");

    const response = await getAddress();
    console.log("[StellarPay] getAddress response:", response);

    if (response.error) {
      throw new Error(response.error.message || "Unable to read wallet address.");
    }

    if (!response.address) {
      throw new Error("Freighter returned no address.");
    }

    setAddress(response.address);
    setStatus("Wallet connected");
  };

  const loadBalance = async (walletAddress) => {
    try {
      console.log("[StellarPay] Loading XLM balance for:", walletAddress);

      const account = await horizonServer.loadAccount(walletAddress);
      console.log("[StellarPay] Horizon account response:", account);

      const nativeBalance = account.balances.find(
        (entry) => entry.asset_type === "native"
      );

      setBalance(nativeBalance?.balance ?? "0");
      setError("");
    } catch (err) {
      console.error("[StellarPay] Balance fetch failed:", err);
      setBalance("0");
      setError(getErrorMessage(err, "Unable to load balance from Testnet."));
    }
  };

  useEffect(() => {
    const checkWallet = async () => {
      try {
        console.log("[StellarPay] Checking Freighter connection on localhost:5173...");

        const allowedResponse = await isAllowed();
        console.log("[StellarPay] isAllowed response:", allowedResponse);

        if (allowedResponse.error) {
          throw new Error(
            allowedResponse.error.message || "Unable to check wallet permissions."
          );
        }

        if (allowedResponse.isAllowed) {
          setStatus("Freighter already allowed");
          await readWalletAddress();
        } else {
          setStatus("Wallet not connected");
        }
      } catch (err) {
        console.error("[StellarPay] Wallet check failed:", err);
        setStatus("Wallet check failed");
        setError(err instanceof Error ? err.message : "Unknown wallet error.");
      }
    };

    checkWallet();
  }, []);

  useEffect(() => {
    if (!address) {
      setBalance("0");
      return;
    }

    void loadBalance(address);
  }, [address]);

  const connectWallet = async () => {
    setLoadingWallet(true);
    setError("");

    try {
      console.log("[StellarPay] Connect Wallet clicked.");

      const allowedResponse = await isAllowed();
      console.log("[StellarPay] isAllowed before connect:", allowedResponse);

      if (allowedResponse.error) {
        throw new Error(
          allowedResponse.error.message || "Unable to check wallet permissions."
        );
      }

      if (!allowedResponse.isAllowed) {
        console.log("[StellarPay] Requesting Freighter permission...");
        const accessResponse = await requestAccess();
        console.log("[StellarPay] requestAccess response:", accessResponse);

        if (accessResponse.error) {
          throw new Error(
            accessResponse.error.message || "Freighter permission was denied or failed."
          );
        }
      }

      await readWalletAddress();

      setStatus("Wallet connected");
    } catch (err) {
      console.error("[StellarPay] Connect wallet failed:", err);
      setError(getErrorMessage(err, "Unable to connect wallet."));
      setStatus("Connection failed");
    } finally {
      setLoadingWallet(false);
    }
  };

  const disconnectWallet = () => {
    console.log("[StellarPay] Disconnecting wallet from the app state.");
    setAddress("");
    setBalance("0");
    setRecipientAddress("");
    setAmount("");
    setTransactionStatus("");
    setTransactionHash("");
    setError("");
    setStatus("Wallet disconnected");
  };

  const sendXlm = async (event) => {
    event.preventDefault();

    setSending(true);
    setError("");
    setTransactionStatus("");
    setTransactionHash("");

    try {
      if (!address) {
        throw new Error("Connect your wallet before sending XLM.");
      }

      if (!recipientAddress.trim()) {
        throw new Error("Recipient address is required.");
      }

      if (!amount || Number(amount) <= 0) {
        throw new Error("Amount must be greater than 0.");
      }

      console.log("[StellarPay] Preparing payment transaction:", {
        source: address,
        destination: recipientAddress.trim(),
        amount,
      });

      const sourceAccount = await horizonServer.loadAccount(address);
      const baseFee = await horizonServer.fetchBaseFee();

      const transaction = new TransactionBuilder(sourceAccount, {
        fee: baseFee.toString(),
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(
          Operation.payment({
            destination: recipientAddress.trim(),
            asset: Asset.native(),
            amount: amount.trim(),
          })
        )
        .setTimeout(180)
        .build();

      const unsignedXdr = transaction.toXDR();
      console.log("[StellarPay] Unsigned XDR:", unsignedXdr);

      const signedResponse = await signTransaction(unsignedXdr, {
        networkPassphrase: Networks.TESTNET,
        address,
      });

      console.log("[StellarPay] signTransaction response:", signedResponse);

      if (signedResponse.error) {
        throw new Error(
          signedResponse.error.message || "Freighter could not sign the transaction."
        );
      }

      const signedTransaction = TransactionBuilder.fromXDR(
        signedResponse.signedTxXdr,
        Networks.TESTNET
      );

      const submitResponse = await horizonServer.submitTransaction(signedTransaction);
      console.log("[StellarPay] submitTransaction response:", submitResponse);

      setTransactionStatus("Transaction successful");
      setTransactionHash(submitResponse.hash);
      setStatus("Payment sent");
      setRecipientAddress("");
      setAmount("");
      await loadBalance(address);
    } catch (err) {
      console.error("[StellarPay] Send transaction failed:", err);
      setTransactionStatus("Transaction failed");
      setTransactionHash("");
      setError(getErrorMessage(err, "Unable to send XLM on Testnet."));
      setStatus("Payment failed");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "16px",
        padding: "24px",
        fontFamily: "system-ui, sans-serif",
        background: "linear-gradient(180deg, #08111f 0%, #0f172a 100%)",
        color: "#e5e7eb",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "420px" }}>
        <h1 style={{ margin: 0, fontSize: "2.5rem" }}>StellarPay</h1>
        <p style={{ marginTop: "8px", color: "#94a3b8" }}>
          Connect your Freighter wallet on Testnet.
        </p>
      </div>

      <button
        onClick={connectWallet}
        style={{
          padding: "12px 18px",
          borderRadius: "10px",
          border: "none",
          background: loadingWallet ? "#334155" : "#38bdf8",
          color: "#020617",
          fontWeight: 700,
          cursor: loadingWallet ? "not-allowed" : "pointer",
          minWidth: "180px",
        }}
        disabled={loadingWallet}
      >
        {loadingWallet ? "Connecting..." : "Connect Wallet"}
      </button>

      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "16px",
          borderRadius: "12px",
          background: "rgba(15, 23, 42, 0.7)",
          border: "1px solid rgba(148, 163, 184, 0.25)",
        }}
      >
        <p style={{ margin: 0, color: "#94a3b8" }}>Status: {status}</p>
        {address ? (
          <>
            <p style={{ margin: "12px 0 0", wordBreak: "break-all" }}>
              <strong>Wallet Address:</strong> {address}
            </p>
            <p style={{ margin: "8px 0 0" }}>
              <strong>XLM Balance:</strong> {balance}
            </p>
            <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
              <button
                onClick={disconnectWallet}
                style={{
                  padding: "10px 16px",
                  borderRadius: "10px",
                  border: "1px solid rgba(148, 163, 184, 0.35)",
                  background: "transparent",
                  color: "#e5e7eb",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Disconnect Wallet
              </button>
            </div>
          </>
        ) : (
          <p style={{ margin: "12px 0 0", color: "#cbd5e1" }}>
            No wallet connected yet.
          </p>
        )}
        {error ? (
          <p style={{ margin: "12px 0 0", color: "#fca5a5" }}>{error}</p>
        ) : null}
      </div>

      <form
        onSubmit={sendXlm}
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "16px",
          borderRadius: "12px",
          background: "rgba(15, 23, 42, 0.7)",
          border: "1px solid rgba(148, 163, 184, 0.25)",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div>
          <label style={{ display: "block", marginBottom: "6px", color: "#cbd5e1" }}>
            Recipient Address
          </label>
          <input
            value={recipientAddress}
            onChange={(event) => setRecipientAddress(event.target.value)}
            placeholder="G..."
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid rgba(148, 163, 184, 0.25)",
              background: "rgba(2, 6, 23, 0.65)",
              color: "#e5e7eb",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "6px", color: "#cbd5e1" }}>
            Amount
          </label>
          <input
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="0.0000001"
            inputMode="decimal"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid rgba(148, 163, 184, 0.25)",
              background: "rgba(2, 6, 23, 0.65)",
              color: "#e5e7eb",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={sending || !address}
          style={{
            padding: "12px 18px",
            borderRadius: "10px",
            border: "none",
            background: sending || !address ? "#334155" : "#38bdf8",
            color: "#020617",
            fontWeight: 700,
            cursor: sending || !address ? "not-allowed" : "pointer",
          }}
        >
          {sending ? "Sending..." : "Send XLM"}
        </button>

        <div style={{ color: "#cbd5e1" }}>
          <p style={{ margin: 0 }}>
            <strong>Transaction Status:</strong> {transactionStatus || "Waiting"}
          </p>
          <p style={{ margin: "8px 0 0", wordBreak: "break-all" }}>
            <strong>Transaction Hash:</strong> {transactionHash || "—"}
          </p>
        </div>
      </form>
    </div>
  );
}

export default App;