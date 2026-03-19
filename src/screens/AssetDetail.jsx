import { BackArrow, AssetLogo } from '../components/Icons';
import { PerpsChart } from '../components/MockChart';
import { motion } from 'framer-motion';
import { aiMarketPulse } from '../data/mockData';

export default function AssetDetail({ asset, onBack, onTrade }) {
  const positive = asset.change > 0;
  const accentColor = positive ? '#7BF179' : '#FF4757';

  if (asset.isCash) {
    return <CashDetail asset={asset} onBack={onBack} />;
  }

  // Find AI signal for this asset
  const allSignals = [...(aiMarketPulse.perps?.signals || []), ...(aiMarketPulse.spot?.signals || [])];
  const nameUp = (asset.name || '').toUpperCase();
  const idUp = (asset.id || '').toUpperCase();
  const sig = allSignals.find(s => s.asset === nameUp || s.asset === idUp || s.ticker?.toUpperCase().includes(idUp));
  const bullPct = sig
    ? (sig.signal === 'Bearish' ? 100 - sig.confidence : sig.signal === 'Bullish' ? sig.confidence : 50)
    : (positive ? 62 : 38);
  const bearPct = 100 - bullPct;

  return (
    <motion.div
      className="absolute inset-0 bg-app-bg z-20 flex flex-col"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button onClick={onBack} className="p-1 active:opacity-70">
          <BackArrow />
        </button>
        <div className="flex items-center gap-2">
          <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 600, fontSize: 15 }} className="text-white">
            {asset.id.toUpperCase()}
          </span>
          <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 400, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            USD
          </span>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 scroll-container" style={{ overflowY: 'auto' }}>
        {/* Price + Logo row */}
        <div className="px-4 pb-3 flex items-start justify-between">
          <div>
            <div style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 600, fontSize: 32 }} className="text-white leading-none">
              {asset.priceDisplay}
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <span style={{
                fontFamily: "'Google Sans Flex', sans-serif",
                fontSize: 13,
                fontWeight: 500,
                color: accentColor,
              }}>
                {positive ? '↑' : '↓'}{Math.abs(asset.change)}%
              </span>
              <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                past 24 hours
              </span>
            </div>
          </div>
          <AssetLogo logo={asset.logo} color={asset.logoColor} size={44} />
        </div>

        {/* Chart card */}
        <div className="px-4 mb-2 relative">
          <div
            className="rounded-2xl overflow-hidden relative"
            style={{
              background: '#0A0A0A',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <PerpsChart positive={positive} />
          </div>
        </div>

        {/* Stats list */}
        <div className="px-4 py-3">
          {[
            {
              label: '24h change',
              value: `${positive ? '↑' : '↓'}${asset.priceDisplay} / ${positive ? '↑' : '↓'}${Math.abs(asset.change)}%`,
              valueColor: accentColor,
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              ),
            },
            {
              label: '24h volume',
              value: asset.volume24h || '—',
              valueColor: '#fff',
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 20V10M12 20V4M6 20v-6" />
                </svg>
              ),
            },
            {
              label: 'Market cap',
              value: asset.marketCap || '—',
              valueColor: '#fff',
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v12M8 10h8M8 14h8" />
                </svg>
              ),
            },
            {
              label: 'Circulating supply',
              value: asset.circulatingSupply || '—',
              valueColor: '#fff',
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 11-6.22-8.56" />
                  <polyline points="22 4 12 12 9 9" />
                </svg>
              ),
            },
          ].map((stat, i) => (
            <div key={i}>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2.5">
                  {stat.icon}
                  <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                    {stat.label}
                  </span>
                </div>
                <span style={{
                  fontFamily: "'Google Sans Flex', sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  color: stat.valueColor,
                }}>
                  {stat.value}
                </span>
              </div>
              {i < 3 && <div className="h-px" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />}
            </div>
          ))}
        </div>

        {/* About */}
        <div className="px-4 pb-4">
          <h3 style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 15, fontWeight: 600 }} className="text-white mb-2">
            About
          </h3>
          <p style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 13, lineHeight: 1.6, color: 'rgba(255,255,255,0.45)' }}>
            {asset.about}
          </p>
        </div>

        {/* News */}
        <div className="px-4 pb-4">
          <h3 style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 15, fontWeight: 600 }} className="text-white mb-3">
            News
          </h3>
          {asset.news?.map((item, i) => (
            <div key={i}>
              <div className="py-3">
                <div className="text-white" style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 13, lineHeight: 1.4 }}>
                  {item.headline}
                </div>
                <div className="mt-1" style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
                  {item.source} · {item.time}
                </div>
              </div>
              {i < asset.news.length - 1 && <div className="h-px" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />}
            </div>
          ))}
        </div>

        {/* AI Sentiment */}
        <div className="px-4 pt-1 pb-1">
          <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', marginBottom: 12 }} />
          <div className="flex items-center justify-between mb-2.5">
            <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 600, fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 0.3 }}>
              AI Sentiment
            </span>
            <div className="flex items-center gap-1">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>
                AI · now
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 11, fontWeight: 700, color: '#7BF179', minWidth: 28 }}>
              {bullPct}%
            </span>
            <div style={{ flex: 1, height: 5, borderRadius: 3, display: 'flex', overflow: 'hidden', gap: 1 }}>
              <div style={{ width: `${bullPct}%`, height: '100%', borderRadius: '3px 0 0 3px', background: '#7BF179', transition: 'width 0.6s ease' }} />
              <div style={{ width: `${bearPct}%`, height: '100%', borderRadius: '0 3px 3px 0', background: '#FF4757', transition: 'width 0.6s ease' }} />
            </div>
            <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 11, fontWeight: 700, color: '#FF4757', minWidth: 28, textAlign: 'right' }}>
              {bearPct}%
            </span>
          </div>
          <div className="flex justify-between mt-1" style={{ paddingLeft: 36, paddingRight: 36 }}>
            <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 8, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: 0.6 }}>Bullish</span>
            <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 8, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: 0.6 }}>Bearish</span>
          </div>
          <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', marginTop: 12 }} />
        </div>

        <div className="pb-28" />
      </div>

      {/* Bottom action bar */}
      <div className="absolute bottom-0 left-0 right-0 px-4 py-4 flex gap-3" style={{
        background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <button
          onClick={() => onTrade('Buy')}
          className="flex-1 py-3.5 rounded-xl active:brightness-110 transition-all"
          style={{ backgroundColor: '#7BF179', fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 15, color: '#000',
            boxShadow: '0 4px 20px rgba(123,241,121,0.3), 0 1px 4px rgba(123,241,121,0.15)' }}
        >
          Buy
        </button>
        <button
          onClick={() => onTrade('Sell')}
          className="flex-1 py-3.5 rounded-xl border active:brightness-110 transition-all"
          style={{ borderColor: '#fff', fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 15, color: '#fff', backgroundColor: 'transparent' }}
        >
          Sell
        </button>
      </div>
    </motion.div>
  );
}

function CashDetail({ asset, onBack }) {
  const transactions = [
    { label: 'Deposit from Bank', amount: '+$500.00', date: 'Mar 10, 2026' },
    { label: 'Bought ETH', amount: '-$50.00', date: 'Mar 12, 2026' },
    { label: 'Sold SEI', amount: '+$25.00', date: 'Mar 11, 2026' },
    { label: 'Deposit from Bank', amount: '+$800.00', date: 'Mar 5, 2026' },
  ];

  return (
    <motion.div
      className="absolute inset-0 bg-app-bg z-20 flex flex-col"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <button onClick={onBack} className="p-1 active:opacity-70">
          <BackArrow />
        </button>
        <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 16 }} className="text-white">
          US Dollar
        </span>
        <AssetLogo logo="$" color="#7BF179" size={28} />
      </div>

      <div className="flex-1 scroll-container" style={{ overflowY: 'auto' }}>
        <div className="text-center py-8">
          <div className="text-text-secondary mb-2" style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 14 }}>
            Your Cash Balance
          </div>
          <div style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 36 }} className="text-white">
            $1,240.00
          </div>
        </div>

        <div className="px-4 pb-28">
          <h3 style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 16, fontWeight: 500 }} className="text-white mb-3">
            Recent Transactions
          </h3>
          {transactions.map((tx, i) => (
            <div key={i}>
              <div className="flex justify-between items-center py-3.5">
                <div>
                  <div className="text-white" style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 14 }}>{tx.label}</div>
                  <div className="text-text-secondary mt-0.5" style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 12 }}>{tx.date}</div>
                </div>
                <div style={{
                  fontFamily: "'Google Sans Flex', sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  color: tx.amount.startsWith('+') ? '#7BF179' : '#FF4757',
                }}>
                  {tx.amount}
                </div>
              </div>
              {i < transactions.length - 1 && <div className="h-px" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 px-4 py-4" style={{
        background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <button
          className="w-full py-3.5 rounded-xl border active:brightness-110 transition-all"
          style={{ borderColor: '#fff', fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 15, color: '#fff', backgroundColor: 'transparent' }}
        >
          Convert
        </button>
      </div>
    </motion.div>
  );
}
