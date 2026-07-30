import { motion } from 'framer-motion';
import { ArrowRight, Vote, Shield, CheckCircle2, ChevronDown } from 'lucide-react';
import { CONTRACT_ID } from '../services/stellar';

const features = [
  { icon: <Vote className="w-5 h-5" />, text: 'On-Chain Soroban Voting' },
  { icon: <Shield className="w-5 h-5" />, text: 'Freighter Wallet Sign' },
  { icon: <CheckCircle2 className="w-5 h-5" />, text: 'Stellar Testnet RPC' },
];

export default function Hero({ onConnectWallet, isConnected }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="orb absolute -top-32 -left-32 w-[500px] h-[500px] opacity-20"
          style={{ background: 'radial-gradient(circle, #3B82F6, transparent 70%)' }}
        />
        <div
          className="orb absolute top-20 -right-32 w-[400px] h-[400px] opacity-15"
          style={{ background: 'radial-gradient(circle, #8B5CF6, transparent 70%)', animationDelay: '-3s' }}
        />
        <div
          className="orb absolute bottom-20 left-1/3 w-[350px] h-[350px] opacity-10"
          style={{ background: 'radial-gradient(circle, #06B6D4, transparent 70%)', animationDelay: '-6s' }}
        />
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(59,130,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light text-xs font-semibold text-blue-400 mb-8 border border-blue-500/20"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Stellar Yellow Belt Soroban Application · Testnet Deployed
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6"
        >
          Decentralized Voting on{' '}
          <br />
          <span className="gradient-text">Stellar Soroban</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Vote on-chain using your Freighter wallet. State updates are recorded directly to smart contract instance storage on Stellar Testnet.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <motion.button
            onClick={() => {
              if (!isConnected) onConnectWallet();
              document.getElementById('voting')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn-stellar px-8 py-4 rounded-2xl font-bold text-white text-base flex items-center gap-2 min-w-[200px] justify-center shadow-glow-blue"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            {isConnected ? 'Cast Your Vote' : 'Connect Freighter & Vote'}
            <ArrowRight className="w-4 h-4" />
          </motion.button>
          <motion.a
            href={`https://stellar.expert/explorer/testnet/contract/${CONTRACT_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-2xl font-semibold text-slate-300 text-base glass-light border border-slate-700 hover:border-blue-500/50 hover:text-white transition-all flex items-center gap-2 min-w-[200px] justify-center"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Contract Explorer
            <Vote className="w-4 h-4" />
          </motion.a>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center gap-4 flex-wrap mb-12"
        >
          {features.map((feat, i) => (
            <motion.div
              key={feat.text}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium text-slate-300 glass-light border border-white/5"
            >
              <span className="text-blue-400">{feat.icon}</span>
              {feat.text}
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-col items-center gap-2 text-slate-600 cursor-pointer"
          onClick={() => document.getElementById('voting')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="text-xs font-medium">Scroll to Vote</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
