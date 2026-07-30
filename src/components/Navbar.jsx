import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Vote, History, Shield, ChevronDown } from 'lucide-react';

export default function Navbar({ onConnectWallet, walletAddress, isConnected }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Voting Poll', href: '#voting', icon: <Vote className="w-4 h-4" /> },
    { name: 'On-Chain Transactions', href: '#transactions', icon: <History className="w-4 h-4" /> },
  ];

  const truncateAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-lg shadow-black/30' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2.5 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative w-9 h-9">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-glow-blue">
                <Vote className="w-5 h-5 text-white" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 blur-md opacity-50 -z-10" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-bold tracking-tight">
                <span className="gradient-text">StellarPoll</span>
                <span className="text-white"> Soroban</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">Decentralized Voting</span>
            </div>
          </motion.div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {link.icon}
                {link.name}
              </motion.a>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Network Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-light text-xs font-medium text-slate-400">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Stellar Testnet
            </div>

            {/* Wallet Button */}
            <motion.button
              onClick={onConnectWallet}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isConnected
                  ? 'glass-light border border-slate-700 text-white hover:border-blue-500/50'
                  : 'btn-stellar text-white shadow-glow-blue'
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {isConnected ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  {truncateAddress(walletAddress)}
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Connect Wallet
                </>
              )}
            </motion.button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-xl glass-light text-slate-400 hover:text-white transition-colors"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden glass border-t border-stellar-border"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  {link.icon}
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
