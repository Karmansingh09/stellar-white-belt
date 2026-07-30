import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Vote,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Copy,
  Zap,
  Sparkles,
  ShieldCheck,
  ArrowUpRight,
  WifiOff,
} from 'lucide-react';
import {
  CONTRACT_ID,
  fetchVotesOnChain,
  submitVoteOnChain,
} from '../services/stellar';

export default function VotingCard({ isConnected, walletAddress, onConnect }) {
  const [votes, setVotes] = useState({ votesA: 0, votesB: 0 });
  const [isLoadingVotes, setIsLoadingVotes] = useState(false);
  const [votingOption, setVotingOption] = useState(null); // 'a' or 'b'
  const [statusMessage, setStatusMessage] = useState('');
  const [lastTxHash, setLastTxHash] = useState('');
  const [lastTxUrl, setLastTxUrl] = useState('');
  const [error, setError] = useState('');
  const [rpcWarning, setRpcWarning] = useState('');
  const [copiedContract, setCopiedContract] = useState(false);

  const loadVotes = async () => {
    setIsLoadingVotes(true);
    setRpcWarning('');
    try {
      const data = await fetchVotesOnChain();
      if (data && data.error) {
        setRpcWarning(data.error);
      } else if (data) {
        setVotes({ votesA: data.votesA, votesB: data.votesB });
      }
    } catch (err) {
      console.warn('Failed to load votes:', err);
      setRpcWarning('Unable to sync live votes from Stellar Testnet.');
    } finally {
      setIsLoadingVotes(false);
    }
  };

  useEffect(() => {
    loadVotes();
    const interval = setInterval(loadVotes, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleVote = async (option) => {
    if (!isConnected) {
      onConnect();
      return;
    }

    setVotingOption(option);
    setError('');
    setStatusMessage('Preparing transaction...');

    try {
      const result = await submitVoteOnChain(option, walletAddress, (msg) => {
        setStatusMessage(msg);
      });

      setLastTxHash(result.hash);
      setLastTxUrl(result.explorerUrl);
      setStatusMessage(`Vote cast successfully! Confirmed in ledger.`);
      await loadVotes();
    } catch (err) {
      console.error('Vote submission error:', err);
      setError(err.message || 'Failed to submit vote on Testnet');
    } finally {
      setVotingOption(null);
    }
  };

  const handleCopyContract = () => {
    navigator.clipboard.writeText(CONTRACT_ID);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  const totalVotes = votes.votesA + votes.votesB;
  const percentA = totalVotes > 0 ? Math.round((votes.votesA / totalVotes) * 100) : 50;
  const percentB = totalVotes > 0 ? 100 - percentA : 50;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="animated-border rounded-3xl overflow-hidden shadow-card"
      style={{
        background: 'linear-gradient(145deg, rgba(15,22,41,0.97) 0%, rgba(10,14,26,0.99) 100%)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
      }}
    >
      {/* Header */}
      <div className="p-6 border-b border-stellar-border flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-glow-blue">
            <Vote className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Soroban Smart Contract Voting
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                Live Testnet
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Decentralized poll powered by Soroban on Stellar
            </p>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={loadVotes}
          disabled={isLoadingVotes}
          className="p-2.5 rounded-xl glass-light text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-1.5 text-xs font-medium"
        >
          <RefreshCw className={`w-4 h-4 ${isLoadingVotes ? 'animate-spin text-blue-400' : ''}`} />
          <span>Sync Votes</span>
        </motion.button>
      </div>

      {/* Contract Details Banner */}
      <div className="px-6 py-3 bg-white/[0.02] border-b border-white/[0.04] flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-2 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="text-slate-500">Contract ID:</span>
          <span className="text-slate-200 font-semibold">{CONTRACT_ID.slice(0, 10)}...{CONTRACT_ID.slice(-8)}</span>
          <button
            onClick={handleCopyContract}
            className="p-1 hover:text-blue-400 transition-colors"
            title="Copy Contract ID"
          >
            {copiedContract ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
        <a
          href={`https://stellar.expert/explorer/testnet/contract/${CONTRACT_ID}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium transition-colors"
        >
          View on Explorer <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Main Voting Body */}
      <div className="p-6 space-y-6">
        {/* RPC Warning Banner */}
        {rpcWarning && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>{rpcWarning}</span>
          </div>
        )}

        {/* Real-time Vote Tally Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-end text-sm">
            <div>
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Option A Tally</span>
              <p className="text-2xl font-black text-blue-400">{votes.votesA} <span className="text-sm font-medium text-slate-500">votes ({percentA}%)</span></p>
            </div>
            <div className="text-right">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Option B Tally</span>
              <p className="text-2xl font-black text-purple-400">{votes.votesB} <span className="text-sm font-medium text-slate-500">votes ({percentB}%)</span></p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-4 w-full rounded-full bg-slate-800/80 p-0.5 flex overflow-hidden border border-white/10 shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-l-full"
              initial={{ width: '50%' }}
              animate={{ width: `${percentA}%` }}
              transition={{ duration: 0.5 }}
            />
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-r-full"
              initial={{ width: '50%' }}
              animate={{ width: `${percentB}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <p className="text-center text-xs text-slate-500 mt-1">
            Total On-Chain Votes Recorded: <span className="font-bold text-white">{totalVotes}</span>
          </p>
        </div>

        {/* Voting Action Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Vote A Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/40 to-slate-900 border border-blue-500/30 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
                  Option A
                </span>
                <Sparkles className="w-4 h-4 text-blue-400" />
              </div>
              <h4 className="text-lg font-bold text-white">Stellar Ecosystem Expansion</h4>
              <p className="text-xs text-slate-400 mt-1">
                Vote to allocate smart contract resource priority to developer tooling and ecosystem growth.
              </p>
            </div>

            <button
              onClick={() => handleVote('a')}
              disabled={votingOption !== null}
              className={`w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all ${
                votingOption === 'a'
                  ? 'bg-blue-600/50 cursor-wait'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-glow-blue'
              }`}
            >
              {votingOption === 'a' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Voting Option A...
                </>
              ) : (
                <>
                  <Vote className="w-4 h-4" />
                  Vote for Option A
                </>
              )}
            </button>
          </motion.div>

          {/* Vote B Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-500/30 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider">
                  Option B
                </span>
                <Zap className="w-4 h-4 text-purple-400" />
              </div>
              <h4 className="text-lg font-bold text-white">Liquidity Incentive Pool</h4>
              <p className="text-xs text-slate-400 mt-1">
                Vote to route protocol yield towards automated market maker liquidity provider rewards.
              </p>
            </div>

            <button
              onClick={() => handleVote('b')}
              disabled={votingOption !== null}
              className={`w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all ${
                votingOption === 'b'
                  ? 'bg-purple-600/50 cursor-wait'
                  : 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 shadow-glow-purple'
              }`}
            >
              {votingOption === 'b' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Voting Option B...
                </>
              ) : (
                <>
                  <Vote className="w-4 h-4" />
                  Vote for Option B
                </>
              )}
            </button>
          </motion.div>
        </div>

        {/* Live Status & Progress Feedback */}
        <AnimatePresence>
          {statusMessage && !error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3"
            >
              <RefreshCw className="w-5 h-5 text-blue-400 animate-spin flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-blue-300">Transaction Execution Status</p>
                <p className="text-xs text-slate-300">{statusMessage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Feedback */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-red-300">Transaction Failed</p>
                <p className="text-xs text-red-200/80 mt-0.5">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirmed Transaction Hash Box */}
        <AnimatePresence>
          {lastTxHash && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-300">Confirmed Stellar Transaction Hash</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/20 px-2 py-0.5 rounded-full">
                  Stellar Testnet
                </span>
              </div>

              <p className="text-xs font-mono text-slate-200 break-all bg-black/30 p-2.5 rounded-xl border border-white/5">
                {lastTxHash}
              </p>

              <div className="flex justify-end pt-1">
                <a
                  href={lastTxUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold transition-colors"
                >
                  View on Stellar Expert Explorer <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
