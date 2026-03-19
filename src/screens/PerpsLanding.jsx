import { useState, useMemo, useEffect, useRef } from 'react';
import { perpsMarkets, spotAssets, newsBanners, aiMarketPulse } from '../data/mockData';
import { SearchIcon, AssetLogo } from '../components/Icons';
import Sparkline from '../components/Sparkline';
import PortfolioWidget from './PortfolioWidget';
import TickerBar from '../components/TickerBar';
import ModeToggle from '../components/ConvertWidget';
import BottomSheet from '../components/BottomSheet';

function parseVolume(vol) {
  if (!vol) return 0;
  const num = parseFloat(vol.replace(/[$,]/g, ''));
  if (vol.includes('B')) return num * 1e9;
  if (vol.includes('M')) return num * 1e6;
  if (vol.includes('K')) return num * 1e3;
  return num;
}

const perpsCategories = ['Trending', 'Crypto', 'Stocks', 'Volume', 'Gainers', 'Losers'];
const spotCategories = ['All', 'Gainers', 'Losers'];

export default function PerpsLanding({ onMarketTap, onAssetTap, onConvert, positions, orders = [], onPositionTap, onClosePosition, onCancelOrder }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Trending');
  const [showDeposit, setShowDeposit] = useState(false);
  const [mode, setMode] = useState('perps');

  const handleModeToggle = (newMode) => {
    setMode(newMode);
    setActiveCategory(newMode === 'perps' ? 'Trending' : 'All');
    setSearch('');
  };

  const categories = mode === 'perps' ? perpsCategories : spotCategories;

  const depositMethods = [
    { id: 'crypto', label: 'Crypto', desc: 'Send crypto from another wallet', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
      </svg>
    ), bg: 'rgba(255,255,255,0.08)' },
    { id: 'venmo', label: 'Venmo', desc: 'Add funds using your Venmo balance', icon: (
      <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 700, fontSize: 16, color: '#fff' }}>V</span>
    ), bg: '#3D95CE' },
    { id: 'apple', label: 'Apple Pay', desc: 'Fast and secure payments with Apple Pay', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    ), bg: '#000' },
    { id: 'bank', label: 'Bank Card', desc: 'Use a debit or credit card', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ), bg: 'rgba(255,255,255,0.08)' },
  ];

  const filteredPerps = useMemo(() => {
    let list = [...perpsMarkets];
    if (activeCategory === 'Crypto') list = list.filter(m => m.category === 'crypto');
    if (activeCategory === 'Stocks') list = list.filter(m => m.category === 'stocks');
    if (activeCategory === 'Volume') list.sort((a, b) => parseVolume(b.volume) - parseVolume(a.volume));
    if (activeCategory === 'Trending') list.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
    if (activeCategory === 'Gainers') list.sort((a, b) => b.change - a.change);
    if (activeCategory === 'Losers') list.sort((a, b) => a.change - b.change);
    if (search) list = list.filter(m =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.ticker.toLowerCase().includes(search.toLowerCase())
    );
    if (!search) list = list.slice(0, 7);
    return list;
  }, [search, activeCategory]);

  const filteredSpot = useMemo(() => {
    let list = spotAssets.filter(a => !a.isCash);
    if (activeCategory === 'Gainers') list.sort((a, b) => b.change - a.change);
    if (activeCategory === 'Losers') list.sort((a, b) => a.change - b.change);
    if (search) list = list.filter(a =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.subtitle.toLowerCase().includes(search.toLowerCase())
    );
    return list;
  }, [search, activeCategory]);

  // Price ticker with flash animation
  const PriceTicker = ({ price, positive }) => {
    const [flash, setFlash] = useState(null);
    const prevPrice = useRef(price);
    const intervalRef = useRef(null);

    useEffect(() => {
      // Simulate price tick every 3-6s
      intervalRef.current = setInterval(() => {
        const dir = Math.random() > 0.5 ? 'up' : 'down';
        setFlash(dir);
        setTimeout(() => setFlash(null), 600);
      }, 3000 + Math.random() * 3000);
      return () => clearInterval(intervalRef.current);
    }, []);

    return (
      <div style={{
        fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 12,
        color: flash === 'up' ? '#7BF179' : flash === 'down' ? '#FF4757' : '#fff',
        transition: 'color 0.15s ease',
      }}>
        {price}
      </div>
    );
  };

  // 24h range bar
  const RangeBar = ({ low, high, current }) => {
    if (!low || !high) return null;
    const range = high - low || 1;
    const pct = Math.max(0, Math.min(100, ((current - low) / range) * 100));
    return (
      <div className="flex items-center gap-1 mt-1" style={{ width: '100%' }}>
        <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 8, color: '#FF4757', opacity: 0.6 }}>L</span>
        <div style={{ flex: 1, height: 2, borderRadius: 1, background: 'rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, height: '100%', borderRadius: 1,
            width: `${pct}%`,
            background: `linear-gradient(90deg, #FF4757, #7BF179)`,
            opacity: 0.7,
          }} />
          <div style={{
            position: 'absolute', top: -1, height: 4, width: 2, borderRadius: 1,
            left: `calc(${pct}% - 1px)`, background: '#fff',
          }} />
        </div>
        <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 8, color: '#7BF179', opacity: 0.6 }}>H</span>
      </div>
    );
  };

  // News section with title + subtitle
  const NewsSection = () => (
    <div className="pt-3 pb-1">
      <div className="px-4 pb-2.5">
        <div style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 600, fontSize: 15, color: '#fff' }}>
          News
        </div>
        <div style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
          Latest market updates
        </div>
      </div>
      <div className="scroll-x flex gap-4 px-4 pb-1 snap-x snap-mandatory" style={{ paddingTop: 2 }}>
        {newsBanners.map(n => (
          <button
            key={n.id}
            className="shrink-0 rounded-2xl active:scale-[0.97] transition-all text-left overflow-hidden snap-center"
            style={{
              width: 343,
              minWidth: 343,
              background: n.bg,
              border: `1px solid ${n.border}`,
              padding: 0,
            }}
          >
            <div style={{ height: 2.5, background: n.accent, opacity: 0.6 }} />
            <div style={{ padding: '12px 14px 13px' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full" style={{
                  fontFamily: "'Google Sans Flex', sans-serif", fontSize: 9.5, fontWeight: 600,
                  letterSpacing: 0.3, color: n.accent, background: `${n.accent}15`, border: `1px solid ${n.accent}25`,
                }}>
                  {n.category}
                </span>
                <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 10, color: '#6B6B6B' }}>
                  {n.time}
                </span>
              </div>
              <div style={{
                fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 13, lineHeight: '18px',
                color: '#fff', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                overflow: 'hidden', marginBottom: 8,
              }}>
                {n.headline}
              </div>
              <div className="flex items-center gap-1.5">
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: n.accent, opacity: 0.7 }} />
                <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 10.5, fontWeight: 500, color: '#8E8E93' }}>
                  {n.source}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // AI Market Sentiment — compact, no card background, dashed dividers
  const AIMarketSentiment = ({ data }) => {
    const avgBull = Math.round(
      data.signals.reduce((sum, s) => {
        const bull = s.signal === 'Bearish' ? 100 - s.confidence : s.signal === 'Bullish' ? s.confidence : 50;
        return sum + bull;
      }, 0) / data.signals.length
    );
    const avgBear = 100 - avgBull;

    return (
      <div className="px-4 pt-1 pb-1">
        {/* Dashed divider above */}
        <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', marginBottom: 12 }} />
        {/* Header row */}
        <div className="flex items-center justify-between mb-2.5">
          <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 600, fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 0.3 }}>
            Market Sentiment
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
        {/* Sentiment bar */}
        <div className="flex items-center gap-2">
          <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 11, fontWeight: 700, color: '#7BF179', minWidth: 28 }}>
            {avgBull}%
          </span>
          <div style={{ flex: 1, height: 5, borderRadius: 3, display: 'flex', overflow: 'hidden', gap: 1 }}>
            <div style={{ width: `${avgBull}%`, height: '100%', borderRadius: '3px 0 0 3px', background: '#7BF179', transition: 'width 0.6s ease' }} />
            <div style={{ width: `${avgBear}%`, height: '100%', borderRadius: '0 3px 3px 0', background: '#FF4757', transition: 'width 0.6s ease' }} />
          </div>
          <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 11, fontWeight: 700, color: '#FF4757', minWidth: 28, textAlign: 'right' }}>
            {avgBear}%
          </span>
        </div>
        {/* Labels */}
        <div className="flex justify-between mt-1" style={{ paddingLeft: 36, paddingRight: 36 }}>
          <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 8, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: 0.6 }}>Bullish</span>
          <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 8, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: 0.6 }}>Bearish</span>
        </div>
        {/* Dashed divider below */}
        <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', marginTop: 12 }} />
      </div>
    );
  };

  return (
    <div className="flex-1 scroll-container" style={{
      overflowY: 'auto',
      background: mode === 'perps'
        ? 'linear-gradient(180deg, rgba(0,212,255,0.025) 0%, transparent 35%)'
        : 'transparent',
      transition: 'background 0.5s ease',
    }}>
      <TickerBar />
      <PortfolioWidget positions={positions} orders={orders} onPositionTap={onPositionTap} onClosePosition={onClosePosition} onCancelOrder={onCancelOrder} />

      {/* Mode toggle + Add Cash row */}
      <div className="px-4 pb-2 flex items-stretch gap-2">
        <div className="flex-1 min-w-0">
          <ModeToggle mode={mode} onToggle={handleModeToggle} />
        </div>
        <button
          onClick={() => setShowDeposit(true)}
          className="shrink-0 rounded-full active:scale-[0.96] transition-all flex items-center justify-center px-4"
          style={{ background: '#fff' }}
        >
          <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 600, fontSize: 12, color: '#000', whiteSpace: 'nowrap' }}>
            Add Cash
          </span>
        </button>
      </div>

      {/* Search */}
      <div className="px-4 pt-1.5 pb-0">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{
          background: '#0A0A0A',
          border: '1px solid rgba(255,255,255,0.12)',
        }}>
          <SearchIcon />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={mode === 'perps' ? 'Search markets...' : 'Search tokens...'}
            className="bg-transparent outline-none flex-1 text-white placeholder-text-tertiary"
            style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 14 }}
          />
        </div>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 px-4 pt-3.5 pb-1.5 overflow-x-auto no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-4 py-1.5 rounded-full text-xs transition-colors"
            style={{
              fontFamily: "'Google Sans Flex', sans-serif",
              background: activeCategory === cat ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: activeCategory === cat ? '#fff' : '#6B6B6B',
              border: activeCategory === cat ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ===== PERPS CONTENT ===== */}
      {mode === 'perps' && (
        <>
          {/* Perps market list */}
          <div className="px-4">
            <div className="rounded-2xl overflow-hidden" style={{ background: '#0A0A0A' }}>
            {filteredPerps.map((m, i) => (
              <button
                key={m.id}
                onClick={() => onMarketTap(m)}
                className="w-full flex items-center justify-between py-2.5 px-3 active:brightness-110 transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <AssetLogo logo={m.logo} color={m.logoColor} size={28} />
                  <div className="text-left">
                    <div style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 600, fontSize: 13 }} className="text-white">
                      {m.name}
                    </div>
                    <div style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 11 }} className="text-text-secondary">
                      Vol {m.volume}
                    </div>
                  </div>
                </div>
                <div className="mx-1.5 shrink-0">
                  <Sparkline data={m.sparkline} positive={m.change > 0} width={50} height={22} />
                </div>
                <div className="text-right shrink-0" style={{ minWidth: 72 }}>
                  <PriceTicker price={m.priceDisplay} positive={m.change > 0} />
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    <span style={{
                      fontFamily: "'Google Sans Flex', sans-serif",
                      fontSize: 10,
                      color: m.change > 0 ? '#7BF179' : '#FF4757',
                    }}>
                      {m.change > 0 ? '▲' : '▼'} {Math.abs(m.change)}%
                    </span>
                    <span className="px-1 py-px rounded text-text-secondary" style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 9, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.04)' }}>
                      {m.leverage}
                    </span>
                  </div>
                </div>
                {i < filteredPerps.length - 1 && (
                  <div className="absolute left-16 right-0 bottom-0 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
                )}
              </button>
            ))}
            </div>
          </div>

          {/* News — below asset list */}
          {!search && <NewsSection />}

          {/* AI Market Sentiment — Perps */}
          {!search && <AIMarketSentiment data={aiMarketPulse.perps} />}
        </>
      )}

      {/* ===== SPOT CONTENT ===== */}
      {mode === 'spot' && (
        <>
          <div className="px-4">
            <div className="rounded-2xl overflow-hidden" style={{ background: '#0A0A0A' }}>
              {filteredSpot.map((a, i) => (
                <button
                  key={a.id}
                  onClick={() => onAssetTap(a)}
                  className="w-full flex items-center justify-between py-2.5 px-3 active:brightness-110 transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <AssetLogo logo={a.logo} color={a.logoColor} size={28} />
                    <div className="text-left">
                      <div style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 600, fontSize: 13 }} className="text-white">
                        {a.name}
                      </div>
                      <div style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 11 }} className="text-text-secondary">
                        {a.subtitle.toUpperCase()}/USD
                      </div>
                    </div>
                  </div>
                  <div className="mx-1.5 shrink-0">
                    <Sparkline data={a.sparkline} positive={a.change > 0} width={50} height={22} />
                  </div>
                  <div className="text-right shrink-0" style={{ minWidth: 72 }}>
                    <PriceTicker price={a.priceDisplay} positive={a.change > 0} />
                    <div className="flex items-center justify-end gap-1 mt-0.5">
                      <span style={{
                        fontFamily: "'Google Sans Flex', sans-serif",
                        fontSize: 10,
                        color: a.change > 0 ? '#7BF179' : '#FF4757',
                      }}>
                        {a.change > 0 ? '▲' : '▼'} {Math.abs(a.change)}%
                      </span>
                    </div>
                  </div>
                  {i < filteredSpot.length - 1 && (
                    <div className="absolute left-16 right-0 bottom-0 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* News — below asset list */}
          {!search && <NewsSection />}

          {/* AI Market Sentiment — Spot */}
          {!search && <AIMarketSentiment data={aiMarketPulse.spot} />}
        </>
      )}

      {/* Bottom spacer */}
      <div className="pb-28" />

      {/* Deposit method bottom sheet */}
      <BottomSheet isOpen={showDeposit} onClose={() => setShowDeposit(false)} height="auto">
        <div className="px-5 pb-6">
          <h2 style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 600, fontSize: 17, textAlign: 'center', marginBottom: 16 }} className="text-white">
            Select a Deposit Method
          </h2>
          <div className="flex flex-col gap-2.5">
            {depositMethods.map(m => (
              <button
                key={m.id}
                onClick={() => setShowDeposit(false)}
                className="flex items-center gap-3.5 w-full px-4 py-3.5 rounded-2xl active:scale-[0.98] transition-all text-left"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: m.bg }}>
                  {m.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 14 }} className="text-white">
                    {m.label}
                  </div>
                  <div style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                    {m.desc}
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0" style={{ opacity: 0.3 }}>
                  <path d="M6 4L10 8L6 12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
