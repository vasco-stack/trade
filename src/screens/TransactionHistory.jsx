import { useState } from 'react';
import { BackArrow, AssetLogo } from '../components/Icons';
import { mockTransactions } from '../data/mockData';
import { motion } from 'framer-motion';

const filters = ['All', 'Spot', 'Leverage'];

export default function TransactionHistory({ onBack }) {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All'
    ? mockTransactions
    : mockTransactions.filter(t => t.type === activeFilter.toLowerCase());

  return (
    <motion.div
      className="absolute inset-0 bg-app-bg z-20 flex flex-col"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="flex items-center gap-3 px-4 pt-4 pb-4">
        <button onClick={onBack} className="p-1 active:opacity-70"><BackArrow /></button>
        <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 16 }} className="text-white">
          Transaction History
        </span>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 px-4 mb-3">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className="px-4 py-1.5 rounded-full text-xs transition-colors"
            style={{
              fontFamily: "'Google Sans Flex', sans-serif",
              background: activeFilter === f ? 'rgba(255,255,255,0.08)' : 'transparent',
              border: activeFilter === f ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
              color: activeFilter === f ? '#fff' : '#6B6B6B',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Transaction list */}
      <div className="flex-1 scroll-container px-4" style={{ overflowY: 'auto' }}>
        {filtered.map((tx, i) => (
          <div key={tx.id}>
            <div className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  {tx.logo && tx.logo.startsWith('/') ? (
                    <img src={tx.logo} alt="" className="w-5 h-5 object-contain" />
                  ) : tx.logo}
                </div>
                <div>
                  <div className="text-white flex items-center gap-2" style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 14 }}>
                    {tx.action}
                  </div>
                  <div className="text-text-secondary mt-0.5 flex items-center gap-1.5" style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 12 }}>
                    {tx.date}
                    <span
                      className="w-1.5 h-1.5 rounded-full inline-block"
                      style={{ backgroundColor: tx.status === 'completed' ? '#7BF179' : '#FF4757' }}
                    />
                  </div>
                </div>
              </div>
              <div style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 14, fontWeight: 600 }} className="text-white">
                {tx.amount}
              </div>
            </div>
            {i < filtered.length - 1 && <div className="h-px" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
