import './index.css';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, AlertCircle } from 'lucide-react';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import VotingCard from './components/VotingCard';
import WalletCard from './components/WalletCard';
import TransactionTable from './components/TransactionTable';
import Footer from './components/Footer';

import { checkWalletConnection, connectFreighterWallet } from './services/stellar';

function Toast({ message, isError, show, onClose }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 80, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl glass border shadow-card max-w-sm ${
            isError ? 'border-red-500/30 text-red-200' : 'border-emerald-500/30 text-emerald-200'
          }`}
        >
          {isError ? (
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          ) : (
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          )}
          <p className="text-sm font-medium text-white flex-1">{message}</p>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors ml-1">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', isError: false });

  const showToast = (message, isError = false) => {
    setToast({ show: true, message, isError });
    setTimeout(() => setToast({ show: false, message: '', isError: false }), 4000);
  };

  useEffect(() => {
    checkWalletConnection().then((res) => {
      if (res.isConnected && res.address) {
        setIsConnected(true);
        setWalletAddress(res.address);
      }
    });
  }, []);

  const handleConnectWallet = async () => {
    if (isConnected) {
      setIsConnected(false);
      setWalletAddress('');
      showToast('Freighter wallet disconnected.');
      return;
    }

    try {
      const address = await connectFreighterWallet();
      setWalletAddress(address);
      setIsConnected(true);
      showToast(`Freighter connected! (${address.slice(0, 6)}...${address.slice(-4)})`);
    } catch (err) {
      console.error('Wallet connection failed:', err);
      showToast(err.message || 'Freighter connection failed. Make sure Freighter is installed & unlocked.', true);
    }
  };

  return (
    <div className="min-h-screen bg-stellar-dark text-white">
      {/* Background mesh gradient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59,130,246,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(139,92,246,0.08) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Navbar */}
      <Navbar
        isConnected={isConnected}
        walletAddress={walletAddress}
        onConnectWallet={handleConnectWallet}
      />

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero */}
        <Hero onConnectWallet={handleConnectWallet} isConnected={isConnected} />

        {/* Voting + Wallet Section */}
        <section id="voting" className="py-20 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Voting Card */}
              <div className="lg:col-span-7">
                <VotingCard
                  isConnected={isConnected}
                  walletAddress={walletAddress}
                  onConnect={handleConnectWallet}
                />
              </div>

              {/* Wallet Card */}
              <div className="lg:col-span-5">
                <WalletCard
                  walletAddress={walletAddress}
                  isConnected={isConnected}
                  onConnect={handleConnectWallet}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Recent On-Chain Transactions */}
        <TransactionTable />
      </main>

      {/* Footer */}
      <Footer />

      {/* Toast Notification */}
      <Toast
        show={toast.show}
        message={toast.message}
        isError={toast.isError}
        onClose={() => setToast({ show: false, message: '', isError: false })}
      />
    </div>
  );
}