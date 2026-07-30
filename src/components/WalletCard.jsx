import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, CheckCircle, Wifi, WifiOff, Shield, ExternalLink, RefreshCw } from 'lucide-react';
import { CONTRACT_ID } from '../services/stellar';

export default function WalletCard({ walletAddress, isConnected, onConnect }) {
  const [copied, setCopied] = useState(false);

  const truncateAddress = (addr) => {
    if (!addr || !isConnected) return '—';
    return `${addr.slice(0, 10)}...${addr.slice(-8)}`;
  };

  const handleCopy = () => {
    if (!walletAddress) return;
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="animated-border rounded-3xl p-6 card-hover shadow-card"
      style={{
        background: 'linear-gradient(145deg, rgba(15,22,41,0.95) 0%, rgba(10,14,26,0.98) 100%)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Freighter Wallet</h3>
            <p className="text-xs text-slate-500">Stellar Soroban Network</p>
          </div>
        </div>
        {/* Connection Status */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
          isConnected
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : 'bg-red-500/10 text-red-400 border border-red-500/20'
        }`}>
          {isConnected
            ? <><Wifi className="w-3 h-3" /> Connected</>
            : <><WifiOff className="w-3 h-3" /> Disconnected</>
          }
        </div>
      </div>

      {isConnected ? (
        <>
          {/* Connected Public Address Display */}
          <div className="mb-6 space-y-2">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Connected Account Address</p>
            <div className="p-3.5 rounded-2xl bg-black/40 border border-stellar-border flex items-center justify-between gap-2">
              <span className="text-xs font-mono text-slate-200 truncate">
                {walletAddress}
              </span>
              <div className="flex items-center gap-1 flex-shrink-0">
                <motion.button
                  onClick={handleCopy}
                  whileTap={{ scale: 0.9 }}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-blue-400"
                  title="Copy account address"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </motion.button>
                <a
                  href={`https://stellar.expert/explorer/testnet/account/${walletAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-blue-400"
                  title="View account on Stellar Expert Explorer"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Soroban Contract Connection Info */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-3 mb-6">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Target Soroban Contract:</span>
              <span className="font-mono text-slate-200 font-semibold">VotingContract</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Contract ID:</span>
              <span className="font-mono text-blue-400 font-medium">{CONTRACT_ID.slice(0, 8)}...{CONTRACT_ID.slice(-6)}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Available Methods:</span>
              <span className="font-mono text-emerald-400">vote_a, vote_b, get_votes</span>
            </div>
          </div>

          {/* Testnet Friendbot info */}
          <div className="p-3.5 rounded-2xl bg-blue-500/5 border border-blue-500/10 text-xs text-slate-300 flex items-center justify-between">
            <span>Need Testnet XLM for gas fees?</span>
            <a
              href={`https://laboratory.stellar.org/#account-creator?network=testnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition-colors"
            >
              Fund via Friendbot <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Network Footer */}
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Stellar Testnet RPC Ready
            </div>
            <button
              onClick={onConnect}
              className="text-slate-400 hover:text-red-400 transition-colors font-medium"
            >
              Disconnect
            </button>
          </div>
        </>
      ) : (
        /* Disconnected State */
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
            <WifiOff className="w-7 h-7 text-slate-500" />
          </div>
          <p className="text-slate-300 font-semibold text-base mb-1">No Freighter Wallet Connected</p>
          <p className="text-slate-400 text-xs mb-6 max-w-xs mx-auto">
            Connect your browser extension wallet to sign Soroban smart contract transactions on Stellar Testnet.
          </p>
          <motion.button
            onClick={onConnect}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn-stellar px-6 py-3 rounded-2xl text-sm font-bold text-white w-full shadow-glow-blue"
          >
            Connect Freighter Wallet
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
