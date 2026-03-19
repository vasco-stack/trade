import { useState, useMemo } from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

const timeRanges = ['1D', '1W', '1M', '1Y', 'All'];

function generateData(range, trend = 'up') {
  const counts = { '1D': 24, '1W': 7, '1M': 30, '1Y': 52, 'All': 100 };
  const points = counts[range] || 50;
  const data = [];
  let base = trend === 'up' ? 100 : 150;
  const volatility = range === '1D' ? 3 : range === '1W' ? 5 : 8;

  for (let i = 0; i < points; i++) {
    const noise = (Math.random() - 0.5) * volatility;
    const dir = trend === 'up' ? 0.4 : -0.3;
    base += dir + noise;
    base = Math.max(50, Math.min(200, base));
    data.push({ x: i, price: Math.round(base * 100) / 100 });
  }
  return data;
}

export default function MockChart({ positive = true, height = '55%' }) {
  const [activeRange, setActiveRange] = useState('1M');
  const color = positive ? '#7BF179' : '#FF4757';
  const trend = positive ? 'up' : 'down';

  const data = useMemo(() => generateData(activeRange, trend), [activeRange, trend]);

  return (
    <div>
      <div style={{ height: typeof height === 'number' ? height : 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${positive}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                <stop offset="50%" stopColor={color} stopOpacity={0.12} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
              <linearGradient id={`glow-${positive}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.15} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
            {/* Glow halo layer */}
            <Area
              type="monotone"
              dataKey="price"
              stroke={color}
              strokeWidth={6}
              strokeOpacity={0.12}
              fill={`url(#glow-${positive})`}
              dot={false}
              isAnimationActive={false}
            />
            {/* Main area */}
            <Area
              type="monotone"
              dataKey="price"
              stroke={color}
              strokeWidth={2.5}
              fill={`url(#gradient-${positive})`}
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-2 mt-3 px-4">
        {timeRanges.map(r => (
          <button
            key={r}
            onClick={() => setActiveRange(r)}
            className="px-3 py-1.5 rounded-full text-xs transition-all"
            style={{
              fontFamily: "'Google Sans Flex', sans-serif",
              backgroundColor: activeRange === r ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: activeRange === r ? '#fff' : '#6B6B6B',
              border: activeRange === r ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
              backdropFilter: activeRange === r ? 'blur(8px)' : 'none',
            }}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}

// Generate OHLC candlestick data
function generateCandleData(range, trend = 'up') {
  const counts = { '1H': 12, '4H': 16, '1D': 24, '1W': 7, '1M': 30 };
  const points = counts[range] || 24;
  const data = [];
  let base = trend === 'up' ? 100 : 150;
  const volatility = range === '1H' ? 2 : range === '4H' ? 3 : range === '1D' ? 4 : 6;

  for (let i = 0; i < points; i++) {
    const move = (Math.random() - (trend === 'up' ? 0.42 : 0.58)) * volatility;
    const open = base;
    const close = base + move;
    const high = Math.max(open, close) + Math.random() * volatility * 0.6;
    const low = Math.min(open, close) - Math.random() * volatility * 0.6;
    data.push({ x: i, open, close, high, low });
    base = close;
    base = Math.max(50, Math.min(200, base));
  }
  return data;
}

// SVG Candlestick chart
function CandlestickChart({ data, width = 343, height = 220 }) {
  if (!data || data.length === 0) return null;

  const padding = { top: 12, right: 8, bottom: 8, left: 8 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const allValues = data.flatMap(d => [d.high, d.low]);
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);
  const valRange = maxVal - minVal || 1;

  const candleWidth = Math.max(3, (chartW / data.length) * 0.6);
  const gap = chartW / data.length;

  const toY = (val) => padding.top + chartH - ((val - minVal) / valRange) * chartH;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      {/* Grid lines */}
      {[0.25, 0.5, 0.75].map((pct, i) => (
        <line
          key={i}
          x1={padding.left} x2={width - padding.right}
          y1={padding.top + chartH * pct} y2={padding.top + chartH * pct}
          stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="4 4"
        />
      ))}
      {data.map((d, i) => {
        const x = padding.left + i * gap + gap / 2;
        const isUp = d.close >= d.open;
        const color = isUp ? '#7BF179' : '#FF4757';
        const bodyTop = toY(Math.max(d.open, d.close));
        const bodyBottom = toY(Math.min(d.open, d.close));
        const bodyH = Math.max(1, bodyBottom - bodyTop);

        return (
          <g key={i}>
            {/* Wick */}
            <line
              x1={x} x2={x}
              y1={toY(d.high)} y2={toY(d.low)}
              stroke={color} strokeWidth={1} strokeOpacity={0.7}
            />
            {/* Body */}
            <rect
              x={x - candleWidth / 2} y={bodyTop}
              width={candleWidth} height={bodyH}
              rx={1}
              fill={color} fillOpacity={isUp ? 0.9 : 0.85}
            />
          </g>
        );
      })}
    </svg>
  );
}

// Chart type toggle icon components
function LineChartIcon({ active }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={active ? '#fff' : 'rgba(255,255,255,0.4)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function CandleChartIcon({ active }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={active ? '#fff' : 'rgba(255,255,255,0.4)'} strokeWidth="2" strokeLinecap="round">
      <line x1="9" y1="2" x2="9" y2="7" />
      <line x1="9" y1="13" x2="9" y2="22" />
      <rect x="5" y="7" width="8" height="6" rx="1" fill={active ? '#fff' : 'rgba(255,255,255,0.4)'} />
      <line x1="17" y1="2" x2="17" y2="11" />
      <line x1="17" y1="17" x2="17" y2="22" />
      <rect x="13" y="11" width="8" height="6" rx="1" fill="none" />
    </svg>
  );
}

// Smaller chart for perps with different time ranges
export function PerpsChart({ positive = true }) {
  const [activeRange, setActiveRange] = useState('1D');
  const [chartType, setChartType] = useState('line'); // 'line' or 'candle'
  const color = positive ? '#7BF179' : '#FF4757';
  const trend = positive ? 'up' : 'down';
  const ranges = ['1H', '4H', '1D', '1W', '1M'];

  const lineData = useMemo(() => generateData(activeRange, trend), [activeRange, trend]);
  const candleData = useMemo(() => generateCandleData(activeRange, trend), [activeRange, trend]);

  return (
    <div className="relative">
      {/* Chart type toggle */}
      <div className="absolute top-3 left-3 z-10 flex rounded-lg overflow-hidden" style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <button
          onClick={() => setChartType('line')}
          className="flex items-center justify-center transition-all"
          style={{
            width: 30, height: 28,
            background: chartType === 'line' ? 'rgba(255,255,255,0.1)' : 'transparent',
          }}
        >
          <LineChartIcon active={chartType === 'line'} />
        </button>
        <button
          onClick={() => setChartType('candle')}
          className="flex items-center justify-center transition-all"
          style={{
            width: 30, height: 28,
            background: chartType === 'candle' ? 'rgba(255,255,255,0.1)' : 'transparent',
          }}
        >
          <CandleChartIcon active={chartType === 'candle'} />
        </button>
      </div>

      {chartType === 'line' ? (
        <div style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={lineData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`perp-gradient-${positive}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="50%" stopColor={color} stopOpacity={0.1} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
                <linearGradient id={`perp-glow-${positive}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.12} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
              <Area
                type="monotone"
                dataKey="price"
                stroke={color}
                strokeWidth={6}
                strokeOpacity={0.1}
                fill={`url(#perp-glow-${positive})`}
                dot={false}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={color}
                strokeWidth={2.5}
                fill={`url(#perp-gradient-${positive})`}
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div style={{ height: 220 }}>
          <CandlestickChart data={candleData} height={220} />
        </div>
      )}

      <div className="flex justify-center gap-2 mt-2 px-4">
        {ranges.map(r => (
          <button
            key={r}
            onClick={() => setActiveRange(r)}
            className="px-3 py-1.5 rounded-full text-xs transition-all"
            style={{
              fontFamily: "'Google Sans Flex', sans-serif",
              backgroundColor: activeRange === r ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: activeRange === r ? '#fff' : '#6B6B6B',
              border: activeRange === r ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
              backdropFilter: activeRange === r ? 'blur(8px)' : 'none',
            }}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}
