import { motion } from 'framer-motion';
import { GitFork, ExternalLink, Zap, MessageCircle, BookOpen, Shield } from 'lucide-react';

const footerLinks = [
  {
    category: 'Protocol',
    links: [
      { name: 'Swap', href: '#swap' },
      { name: 'Liquidity Pools', href: '#pool' },
      { name: 'Analytics', href: '#analytics' },
      { name: 'Governance', href: '#' },
    ],
  },
  {
    category: 'Developers',
    links: [
      { name: 'Documentation', href: 'https://developers.stellar.org', external: true },
      { name: 'GitHub', href: 'https://github.com/stellar/stellar-protocol', external: true },
      { name: 'SDK Reference', href: 'https://stellar.github.io/js-stellar-sdk/', external: true },
      { name: 'Bug Bounty', href: '#', external: false },
    ],
  },
  {
    category: 'Resources',
    links: [
      { name: 'Stellar.org', href: 'https://stellar.org', external: true },
      { name: 'Stellar Expert', href: 'https://stellar.expert', external: true },
      { name: 'Status Page', href: '#', external: false },
      { name: 'Terms of Use', href: '#', external: false },
    ],
  },
];

const socialLinks = [
  { icon: <GitFork className="w-4 h-4" />, href: 'https://github.com/stellar/stellar-protocol', label: 'GitHub' },
  { icon: <MessageCircle className="w-4 h-4" />, href: 'https://twitter.com/StellarOrg', label: 'Twitter' },
  { icon: <BookOpen className="w-4 h-4" />, href: 'https://developers.stellar.org', label: 'Docs' },
  { icon: <Shield className="w-4 h-4" />, href: '#', label: 'Audit' },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-stellar-border overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-blue-500 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-purple-500 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-glow-blue">
                <Zap className="w-5 h-5 text-white" fill="white" />
              </div>
              <div>
                <span className="font-bold text-base">
                  <span className="gradient-text">StellarSwap</span>
                  <span className="text-white"> Pro</span>
                </span>
              </div>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              The premier decentralized exchange on the Stellar network.
              Fast, secure, and non-custodial trading.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-2">
              {socialLinks.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-xl glass-light border border-stellar-border flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/30 transition-colors"
                  aria-label={s.label}
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>

            {/* Security Badge */}
            <div className="mt-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-light border border-emerald-500/20 text-xs font-medium text-emerald-400">
              <Shield className="w-3 h-3" />
              Audited by CertiK
            </div>
          </div>

          {/* Link Groups */}
          {footerLinks.map((group) => (
            <div key={group.category}>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                {group.category}
              </h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="text-sm text-slate-500 hover:text-white transition-colors flex items-center gap-1 group"
                    >
                      {link.name}
                      {link.external && (
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-stellar-border/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span>© 2025 StellarSwap Pro. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              All systems operational
            </div>
            <a
              href="https://stellar.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-600 hover:text-blue-400 transition-colors flex items-center gap-1"
            >
              Powered by Stellar
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
