import { useState } from 'react';
import { BackArrow, AssetLogo } from '../components/Icons';
import { PerpsChart } from '../components/MockChart';
import { motion } from 'framer-motion';
import { aiMarketPulse } from '../data/mockData';

export default function PerpsMarketScreen({ market, onBack, onLong, onShort }) {
  const [marketClosed, setMarketClosed] = useState(false);
  const positive = market.change > 0;
  const isStock = market.isStock;
  const accentColor = positive ? '#7BF179' : '#FF4757';

  // Find AI signal for this asset
  const allSignals = [...(aiMarketPulse.perps?.signals || []), ...(aiMarketPulse.spot?.signals || [])];
  const tickerBase = (market.ticker || '').split('/')[0].toUpperCase();
  const idUp = (market.id || '').toUpperCase().replace(/-PERP$/, '');
  const sig = allSignals.find(s => s.asset === tickerBase || s.asset === idUp || s.ticker?.toUpperCase().includes(tickerBase));
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
            {market.ticker.split('/')[0]}
          </span>
          <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 400, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            USD
          </span>
          <span
            className="px-1.5 py-0.5 rounded-full ml-0.5"
            style={{
              background: 'rgba(123,241,121,0.1)',
              color: '#7BF179',
              fontFamily: "'Google Sans Flex', sans-serif",
              fontSize: 10,
              fontWeight: 500,
              border: '1px solid rgba(123,241,121,0.15)',
            }}
          >
            {market.leverage}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isStock && (
            <button
              onClick={() => setMarketClosed(!marketClosed)}
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', fontSize: 8 }}
              title="Toggle market open/closed (demo)"
            >
              {marketClosed ? '🔴' : '🟢'}
            </button>
          )}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
      </div>

      <div className="flex-1 scroll-container" style={{ overflowY: 'auto' }}>
        {/* Price + Logo row */}
        <div className="px-4 pb-3 flex items-start justify-between">
          <div>
            <div style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 600, fontSize: 32 }} className="text-white leading-none">
              {market.priceDisplay}
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <span style={{
                fontFamily: "'Google Sans Flex', sans-serif",
                fontSize: 13,
                fontWeight: 500,
                color: accentColor,
              }}>
                {positive ? '↑' : '↓'}{Math.abs(market.change)}%
              </span>
              <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                past 24 hours
              </span>
            </div>
          </div>
          <AssetLogo logo={market.logo} color={market.logoColor} size={44} />
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
            {marketClosed && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-2xl">
                <div style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 18 }} className="text-white mb-2">
                  Market Closed
                </div>
                <div className="text-text-secondary" style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 13 }}>
                  Opens Monday 9:00 AM EST
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats list */}
        <div className="px-4 py-3">
          {[
            {
              label: '24h change',
              value: `${positive ? '↑' : '↓'}${market.priceDisplay} / ${positive ? '↑' : '↓'}${Math.abs(market.change)}%`,
              valueColor: accentColor,
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              ),
            },
            {
              label: '24h volume',
              value: market.volume,
              valueColor: '#fff',
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 20V10M12 20V4M6 20v-6" />
                </svg>
              ),
            },
            {
              label: 'Open interest',
              value: market.oi,
              valueColor: '#fff',
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ),
            },
            {
              label: 'Holding fee',
              value: market.funding,
              valueColor: '#fff',
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
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
            {market.about}
          </p>
        </div>

        {/* News */}
        <div className="px-4 pb-4">
          <h3 style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 15, fontWeight: 600 }} className="text-white mb-3">
            News
          </h3>
          {market.news?.map((item, i) => (
            <div key={i}>
              <div className="py-3">
                <div className="text-white" style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 13, lineHeight: 1.4 }}>
                  {item.headline}
                </div>
                <div className="mt-1" style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
                  {item.source} · {item.time}
                </div>
              </div>
              {i < market.news.length - 1 && <div className="h-px" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />}
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
      <div className="px-4 py-4 flex gap-3" style={{
        background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <button
          onClick={() => !marketClosed && onShort()}
          disabled={marketClosed}
          className="flex-1 py-3.5 rounded-full active:scale-[0.97] transition-all flex items-center justify-center"
          style={{
            backgroundColor: marketClosed ? '#1A1A1A' : '#FF4757',
            color: marketClosed ? '#444' : '#fff',
            fontFamily: "'Google Sans Flex', sans-serif",
            fontWeight: 600,
            fontSize: 14,
            boxShadow: marketClosed ? 'none' : '0 4px 20px rgba(255,71,87,0.25)',
          }}
        >
          Short
        </button>
        <button
          onClick={() => !marketClosed && onLong()}
          disabled={marketClosed}
          className="flex-1 py-3.5 rounded-full active:scale-[0.97] transition-all flex items-center justify-center"
          style={{
            backgroundColor: marketClosed ? '#1A1A1A' : '#7BF179',
            color: marketClosed ? '#444' : '#000',
            fontFamily: "'Google Sans Flex', sans-serif",
            fontWeight: 600,
            fontSize: 14,
            boxShadow: marketClosed ? 'none' : '0 4px 20px rgba(123,241,121,0.25)',
          }}
        >
          Long
        </button>
      </div>
    </motion.div>
  );
}
