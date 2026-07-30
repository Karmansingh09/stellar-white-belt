import { motion } from 'framer-motion';
import { ExternalLink, CheckCircle2, Vote, ArrowUpRight } from 'lucide-react';
import { CONTRACT_ID } from '../services/stellar';

const INITIAL_TRANSACTIONS = [
  {
    hash: '4a9669d8ccd710795bbc41d01d4b8fe44b73c81e555b871b688e6b5f30ea1e6f',
    type: 'vote_a',
    label: 'Option A (Stellar Expansion)',
    timestamp: 'Just now',
    status: 'Confirmed',
    contract: CONTRACT_ID,
  },
  {
    hash: '9fba1ac0a22c6f8f66d285456ac27a7729f9ee752ba6e08377b626a6d4602c61',
    type: 'deploy',
    label: 'Soroban Contract Deployment',
    timestamp: 'Deployment Ledger',
    status: 'Confirmed',
    contract: CONTRACT_ID,
  },
];

export default function TransactionTable() {
  const truncateHash = (hash) => `${hash.slice(0, 10)}...${hash.slice(-8)}`;

  return (
    <section id="transactions" className="py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="animated-border rounded-3xl p-6 sm:p-8"
          style={{
            background: 'linear-gradient(145deg, rgba(15,22,41,0.95) 0%, rgba(10,14,26,0.98) 100%)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
          }}
        >
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                Recent On-Chain Activity
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                  Stellar Testnet
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Verified real transactions executed against Soroban contract <code className="text-slate-300">{CONTRACT_ID.slice(0, 8)}...</code>
              </p>
            </div>
            <a
              href={`https://stellar.expert/explorer/testnet/contract/${CONTRACT_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl glass-light text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              Contract History <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-stellar-border text-xs text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 px-3 font-semibold">Method / Action</th>
                  <th className="pb-3 px-3 font-semibold">Real Transaction Hash</th>
                  <th className="pb-3 px-3 font-semibold">Time</th>
                  <th className="pb-3 px-3 font-semibold">Status</th>
                  <th className="pb-3 px-3 text-right font-semibold">Explorer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {INITIAL_TRANSACTIONS.map((tx) => (
                  <tr key={tx.hash} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                          <Vote className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-xs">{tx.label}</p>
                          <p className="text-[11px] font-mono text-slate-500">{tx.type}()</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3 font-mono text-xs text-slate-300">
                      {truncateHash(tx.hash)}
                    </td>
                    <td className="py-4 px-3 text-xs text-slate-400">
                      {tx.timestamp}
                    </td>
                    <td className="py-4 px-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-4 px-3 text-right">
                      <a
                        href={`https://stellar.expert/explorer/testnet/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 inline-flex items-center gap-1 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-white/5 transition-colors text-xs font-semibold"
                        title="View transaction details on Stellar Expert"
                      >
                        View Tx <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
