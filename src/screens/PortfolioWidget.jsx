import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { AssetLogo } from '../components/Icons';
import PositionCard from './PositionCard';

// Mock spot holdings
const spotHoldings = [
  { id: 'sei', name: 'SEI', amount: '2,400', value: '$1,008.00', change: +5.2, logo: '/logos/sei.png', logoColor: '#E31B54', price: '$0.42' },
  { id: 'eth', name: 'ETH', amount: '0.014', value: '$49.30', change: -1.8, logo: '/logos/eth.png', logoColor: '#627EEA', price: '$3,521.40' },
  { id: 'btc', name: 'BTC', amount: '0.003', value: '$190.35', change: +2.1, logo: '/logos/btc.png', logoColor: '#F7931A', price: '$63,450' },
];

function generatePnlHistory() {
  const data = [];
  let cumulative = 0;
  for (let i = 0; i < 30; i++) {
    const daily = (Math.random() - 0.42) * 40;
    cumulative += daily;
    data.push({ day: i, pnl: Math.round(cumulative * 100) / 100 });
  }
  return data;
}

export default function PortfolioWidget({ positions, orders = [], onPositionTap, onClosePosition, onCancelOrder }) {
  const [expanded, setExpanded] = useState(false);
  const [section, setSection] = useState('overview');
  const pnlData = useMemo(() => generatePnlHistory(), []);
  const latestPnl = pnlData[pnlData.length - 1].pnl;
  const positive = latestPnl >= 0;

  const spotTotal = spotHoldings.reduce((s, h) => s + parseFloat(h.value.replace(/[$,]/g, '')), 0);
  const perpsUnrealized = positions.reduce((s, p) => {
    const val = parseFloat(p.pnl.replace(/[$,+]/g, ''));
    return s + val;
  }, 0);
  const perpsMargin = positions.reduce((s, p) => s + parseFloat(p.margin.replace(/[$,]/g, '')), 0);
  const perpsPositionValue = positions.reduce((s, p) => s + parseFloat(p.positionSize.replace(/[$,]/g, '')), 0);
  const totalValue = 1240 + spotTotal + perpsMargin;
  const dailyPnl = 12.40;
  const dailyPnlPercent = ((dailyPnl / totalValue) * 100).toFixed(2);

  const accentColor = positive ? '#7BF179' : '#FF4757';
  const spotOrders = orders.filter(o => o.type === 'spot');
  const leverageOrders = orders.filter(o => o.type === 'leverage');

  // Animated counter
  const [displayValue, setDisplayValue] = useState(0);
  const animatedRef = useRef(false);
  useEffect(() => {
    if (animatedRef.current) return;
    animatedRef.current = true;
    const start = performance.now();
    const duration = 900;
    const target = totalValue;
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setDisplayValue(ease * target);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [totalValue]);

  return (
    <div className="mx-4 mb-3">
      {/* Collapsed preview — always visible, includes chart */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full transition-all active:scale-[0.98] overflow-hidden relative"
        style={{
          background: 'linear-gradient(135deg, rgba(123,241,121,0.06) 0%, rgba(20,20,20,0.95) 40%, rgba(123,241,121,0.03) 100%)',
          border: '1px solid rgba(123,241,121,0.12)',
          boxShadow: `0 4px 24px rgba(0,0,0,0.3), 0 0 40px rgba(123,241,121,0.04), inset 0 1px 0 rgba(123,241,121,0.08)`,
          borderRadius: expanded ? '16px 16px 0 0' : 16,
        }}
      >
        {/* Ambient corner glow */}
        <div className="absolute top-0 left-0 w-32 h-32 pointer-events-none" style={{
          background: 'radial-gradient(circle at top left, rgba(123,241,121,0.08) 0%, transparent 70%)',
        }} />
        <div className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none" style={{
          background: 'radial-gradient(circle at bottom right, rgba(123,241,121,0.05) 0%, transparent 70%)',
        }} />

        <div className="relative px-4 pt-3.5 pb-1">
          {/* Top row: label + chevron */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{
                backgroundColor: '#7BF179',
                boxShadow: '0 0 6px rgba(123,241,121,0.6)',
              }} />
              <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: 0.3, color: 'rgba(123,241,121,0.6)' }}>
                Portfolio
              </span>
            </div>
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              style={{ color: 'rgba(123,241,121,0.4)' }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          </div>

          {/* Value row */}
          <div className="flex items-end justify-between">
            <div>
              <div style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 600, fontSize: 26 }} className="text-white leading-none">
                ${displayValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="px-1.5 py-px rounded" style={{
                  fontFamily: "'Google Sans Flex', sans-serif", fontSize: 11, fontWeight: 500,
                  color: '#7BF179',
                  background: 'rgba(123,241,121,0.08)',
                  border: '1px solid rgba(123,241,121,0.12)',
                }}>
                  +${dailyPnl.toFixed(2)}
                </span>
                <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>
                  +{dailyPnlPercent}% today
                </span>
              </div>
            </div>
            {/* Mini stats */}
            <div className="text-right mb-1">
              <div className="flex items-center gap-1 justify-end">
                <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>Spot</span>
                <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
                  ${spotTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center gap-1 justify-end mt-0.5">
                <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>Leverage</span>
                <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
                  ${perpsPositionValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Inline chart — visible in collapsed state */}
        <div className="relative" style={{ height: 72, marginTop: -4 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={pnlData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="widget-preview-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accentColor} stopOpacity={0.25} />
                  <stop offset="60%" stopColor={accentColor} stopOpacity={0.06} />
                  <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="widget-preview-glow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accentColor} stopOpacity={0.1} />
                  <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis domain={['dataMin - 10', 'dataMax + 10']} hide />
              <Area type="monotone" dataKey="pnl" stroke={accentColor} strokeWidth={4} strokeOpacity={0.1} fill="url(#widget-preview-glow)" dot={false} isAnimationActive={false} />
              <Area type="monotone" dataKey="pnl" stroke={accentColor} strokeWidth={1.5} fill="url(#widget-preview-gradient)" dot={false} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
          {/* Fade edges */}
          <div className="absolute inset-y-0 left-0 w-8 pointer-events-none" style={{
            background: 'linear-gradient(to right, rgba(20,20,20,0.9), transparent)',
          }} />
          <div className="absolute inset-y-0 right-0 w-8 pointer-events-none" style={{
            background: 'linear-gradient(to left, rgba(20,20,20,0.9), transparent)',
          }} />
        </div>

        {/* Time labels */}
        <div className="flex justify-between px-4 pb-3 relative">
          <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>30d ago</span>
          <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>Today</span>
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              overflow: 'hidden',
              background: '#0A0A0A',
              borderLeft: '1px solid rgba(255,255,255,0.12)',
              borderRight: '1px solid rgba(255,255,255,0.12)',
              borderBottom: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '0 0 16px 16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}
          >
            <div>
              {/* Section toggle */}
              <div className="flex mx-4 mb-3 mt-3 rounded-xl p-1" style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                {['overview', 'spot', 'leverage'].map(s => (
                  <button
                    key={s}
                    onClick={(e) => { e.stopPropagation(); setSection(s); }}
                    className="flex-1 py-1.5 rounded-lg text-xs transition-all capitalize"
                    style={{
                      fontFamily: "'Google Sans Flex', sans-serif",
                      fontWeight: 500,
                      fontSize: 11,
                      color: section === s ? '#7BF179' : '#6B6B6B',
                      background: section === s ? 'rgba(255,255,255,0.08)' : 'transparent',
                      boxShadow: section === s ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Spot holdings */}
              {(section === 'overview' || section === 'spot') && (
                <div className="px-4 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 12 }} className="text-white">
                      Spot Holdings
                    </h3>
                    <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                      ${spotTotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="rounded-xl overflow-hidden" style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}>
                    {spotHoldings.map((h, i) => (
                      <div key={h.id}>
                        <div className="flex items-center justify-between px-3 py-2.5">
                          <div className="flex items-center gap-2.5">
                            <AssetLogo logo={h.logo} color={h.logoColor} size={24} />
                            <div>
                              <div style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 12 }} className="text-white">
                                {h.name}
                              </div>
                              <div style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>
                                {h.amount} · {h.price}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 12 }} className="text-white">
                              {h.value}
                            </div>
                            <div style={{
                              fontFamily: "'Google Sans Flex', sans-serif", fontSize: 10,
                              color: h.change > 0 ? '#7BF179' : '#FF4757',
                            }}>
                              {h.change > 0 ? '+' : ''}{h.change}%
                            </div>
                          </div>
                        </div>
                        {i < spotHoldings.length - 1 && (
                          <div className="h-px mx-3" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
                        )}
                      </div>
                    ))}

                    {/* Spot open orders */}
                    {spotOrders.length > 0 && (
                      <>
                        <div className="mx-3 mt-1" style={{ borderTop: '1px dashed rgba(0,212,255,0.2)' }} />
                        <div className="flex items-center gap-1.5 px-3 pt-2 pb-1">
                          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: '#00D4FF' }} />
                          <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 9, fontWeight: 600, color: 'rgba(0,212,255,0.6)', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                            Open Orders
                          </span>
                        </div>
                        {spotOrders.map((o, i) => (
                          <div key={o.id}>
                            <div className="flex items-center justify-between px-3 py-2">
                              <div className="flex items-center gap-2.5">
                                <div className="relative">
                                  <AssetLogo logo={o.logo} color={o.logoColor} size={24} />
                                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full flex items-center justify-center" style={{
                                    background: '#0A0A0A', border: '1px solid rgba(0,212,255,0.4)',
                                  }}>
                                    <svg width="6" height="6" viewBox="0 0 10 10" fill="none">
                                      <path d="M5 2V8M2 5H8" stroke="#00D4FF" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                  </div>
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 12, color: '#fff' }}>
                                      {o.asset}
                                    </span>
                                    <span className="px-1.5 py-px rounded" style={{
                                      fontFamily: "'Google Sans Flex', sans-serif", fontSize: 8, fontWeight: 600,
                                      color: o.direction === 'Buy' ? '#7BF179' : '#FF4757',
                                      background: o.direction === 'Buy' ? 'rgba(123,241,121,0.1)' : 'rgba(255,71,87,0.1)',
                                      border: `1px solid ${o.direction === 'Buy' ? 'rgba(123,241,121,0.2)' : 'rgba(255,71,87,0.2)'}`,
                                    }}>
                                      {o.direction}
                                    </span>
                                    <span className="px-1.5 py-px rounded" style={{
                                      fontFamily: "'Google Sans Flex', sans-serif", fontSize: 8, fontWeight: 600,
                                      color: '#00D4FF', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)',
                                    }}>
                                      LIMIT
                                    </span>
                                  </div>
                                  <div style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>
                                    {o.tokenAmount.toLocaleString()} @ ${o.limitPrice < 1 ? o.limitPrice.toFixed(4) : o.limitPrice.toLocaleString()}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="text-right">
                                  <div style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 12, color: '#fff' }}>
                                    ${o.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </div>
                                  <div style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 9, color: 'rgba(0,212,255,0.5)' }}>
                                    Pending
                                  </div>
                                </div>
                                <button
                                  onClick={(e) => { e.stopPropagation(); onCancelOrder?.(o.id); }}
                                  className="w-5 h-5 rounded-full flex items-center justify-center active:scale-90 transition-transform"
                                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                                >
                                  <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                                    <path d="M2 2L8 8M8 2L2 8" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            {i < spotOrders.length - 1 && (
                              <div className="h-px mx-3" style={{ backgroundColor: 'rgba(0,212,255,0.06)' }} />
                            )}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Leverage positions */}
              {(section === 'overview' || section === 'leverage') && (
                <div className="px-4 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 12 }} className="text-white">
                      Leverage Positions
                    </h3>
                    <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                      ${perpsPositionValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  {positions.length === 0 && leverageOrders.length === 0 ? (
                    <div className="text-text-secondary text-center py-4" style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 12 }}>
                      No open positions
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {positions.map(pos => (
                        <PositionCard
                          key={pos.id}
                          position={pos}
                          onTap={() => onPositionTap(pos)}
                          onClose={() => onClosePosition(pos)}
                        />
                      ))}

                      {/* Leverage open orders */}
                      {leverageOrders.length > 0 && (
                        <>
                          {positions.length > 0 && (
                            <div className="flex items-center gap-1.5 pt-1 pb-0.5">
                              <div className="w-1 h-1 rounded-full" style={{ backgroundColor: '#00D4FF' }} />
                              <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 9, fontWeight: 600, color: 'rgba(0,212,255,0.6)', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                                Open Orders
                              </span>
                            </div>
                          )}
                          {leverageOrders.map(o => (
                            <div key={o.id} className="rounded-xl px-3 py-2.5" style={{
                              background: 'rgba(0,212,255,0.03)',
                              border: '1px dashed rgba(0,212,255,0.15)',
                            }}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                  <div className="relative">
                                    <AssetLogo logo={o.logo} color={o.logoColor} size={24} />
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full flex items-center justify-center" style={{
                                      background: '#0A0A0A', border: '1px solid rgba(0,212,255,0.4)',
                                    }}>
                                      <svg width="6" height="6" viewBox="0 0 10 10" fill="none">
                                        <path d="M5 2V8M2 5H8" stroke="#00D4FF" strokeWidth="1.5" strokeLinecap="round" />
                                      </svg>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 12, color: '#fff' }}>
                                        {o.asset}
                                      </span>
                                      <span className="px-1.5 py-px rounded" style={{
                                        fontFamily: "'Google Sans Flex', sans-serif", fontSize: 8, fontWeight: 600,
                                        color: o.direction === 'Long' ? '#7BF179' : '#FF4757',
                                        background: o.direction === 'Long' ? 'rgba(123,241,121,0.1)' : 'rgba(255,71,87,0.1)',
                                        border: `1px solid ${o.direction === 'Long' ? 'rgba(123,241,121,0.2)' : 'rgba(255,71,87,0.2)'}`,
                                      }}>
                                        {o.direction}
                                      </span>
                                      <span className="px-1.5 py-px rounded" style={{
                                        fontFamily: "'Google Sans Flex', sans-serif", fontSize: 8, fontWeight: 600,
                                        color: '#00D4FF', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)',
                                      }}>
                                        LIMIT
                                      </span>
                                      <span className="px-1.5 py-px rounded" style={{
                                        fontFamily: "'Google Sans Flex', sans-serif", fontSize: 8, fontWeight: 600,
                                        color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                                      }}>
                                        {o.leverage}x
                                      </span>
                                    </div>
                                    <div style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>
                                      {o.tokenAmount.toLocaleString()} @ ${o.limitPrice < 1 ? o.limitPrice.toFixed(4) : o.limitPrice.toLocaleString()}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="text-right">
                                    <div style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 12, color: '#fff' }}>
                                      ${o.positionSize?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || o.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                    <div style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 9, color: 'rgba(0,212,255,0.5)' }}>
                                      Pending
                                    </div>
                                  </div>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); onCancelOrder?.(o.id); }}
                                    className="w-5 h-5 rounded-full flex items-center justify-center active:scale-90 transition-transform"
                                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                                  >
                                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                                      <path d="M2 2L8 8M8 2L2 8" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
