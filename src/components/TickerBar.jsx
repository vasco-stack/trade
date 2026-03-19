import { spotAssets, perpsMarkets } from '../data/mockData';
import { AssetLogo } from './Icons';

const tickerItems = [
  ...spotAssets.filter(a => !a.isCash).map(a => ({ ticker: a.subtitle, change: a.change, logo: a.logo, logoColor: a.logoColor })),
  ...perpsMarkets.filter(m => !spotAssets.some(s => s.id === m.id.replace('-perp', ''))).map(m => ({
    ticker: m.ticker.split('/')[0],
    change: m.change,
    logo: m.logo,
    logoColor: m.logoColor,
  })),
];

export default function TickerBar() {
  // Double the items for seamless loop
  const items = [...tickerItems, ...tickerItems];

  return (
    <div className="relative overflow-hidden" style={{ height: 36 }}>
      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-8 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, var(--color-app-bg), transparent)' }} />
      <div className="absolute inset-y-0 right-0 w-8 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, var(--color-app-bg), transparent)' }} />

      <div className="flex items-center gap-5 ticker-scroll" style={{ width: 'max-content' }}>
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5 shrink-0">
            <AssetLogo logo={item.logo} color={item.logoColor} size={20} />
            <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 12, color: '#fff' }}>
              {item.ticker}
            </span>
            <span style={{
              fontFamily: "'Google Sans Flex', sans-serif", fontSize: 12, fontWeight: 500,
              color: item.change > 0 ? '#7BF179' : '#FF4757',
            }}>
              {item.change > 0 ? '↑' : '↓'}{Math.abs(item.change)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
