import { AssetLogo } from '../components/Icons';
import { spotAssets } from '../data/mockData';

const walletAssets = spotAssets.filter(a => !a.isCash);
const cashAsset = spotAssets.find(a => a.isCash);

export default function WalletPage({ onConvert }) {
  const totalBalance = 1892.45;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-6 pb-3">
        <h1 style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 22 }} className="text-white">
          Wallet
        </h1>
      </div>

      <div className="flex-1 scroll-container" style={{ overflowY: 'auto' }}>
        {/* Total balance card */}
        <div className="mx-4 mb-5 px-5 py-5 rounded-2xl" style={{
          background: 'linear-gradient(135deg, rgba(123,241,121,0.08) 0%, rgba(123,241,121,0.02) 100%)',
          border: '1px solid rgba(123,241,121,0.12)',
        }}>
          <div className="text-text-secondary mb-1" style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 12 }}>
            Total Balance
          </div>
          <div style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 32 }} className="text-white">
            ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 13, color: '#7BF179' }}>
              ▲ +$24.30
            </span>
            <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 12, color: '#6B6B6B' }}>
              (1.3%) today
            </span>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex gap-3 px-4 mb-5">
          <button
            onClick={onConvert}
            className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2 active:scale-[0.97] transition-all"
            style={{
              backgroundColor: '#7BF179',
              boxShadow: '0 4px 20px rgba(123,241,121,0.3), 0 1px 4px rgba(123,241,121,0.15)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 14V9a4 4 0 014-4h11" />
              <path d="M14 1l4 4-4 4" />
              <path d="M21 10v5a4 4 0 01-4 4H6" />
              <path d="M10 23l-4-4 4-4" />
            </svg>
            <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 600, fontSize: 14, color: '#000' }}>
              Convert
            </span>
          </button>
          <button
            className="flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 active:scale-[0.97] transition-all"
            style={{ borderColor: 'rgba(255,255,255,0.15)', backgroundColor: 'transparent' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
            <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 14, color: '#fff' }}>
              Deposit
            </span>
          </button>
          <button
            className="flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 active:scale-[0.97] transition-all"
            style={{ borderColor: 'rgba(255,255,255,0.15)', backgroundColor: 'transparent' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17l9.2-9.2M17 17V7H7" />
            </svg>
            <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 14, color: '#fff' }}>
              Send
            </span>
          </button>
        </div>

        {/* Assets section */}
        <div className="px-4 pb-6">
          <div className="flex items-center justify-between mb-3">
            <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 15 }} className="text-white">
              Your Assets
            </span>
          </div>

          {/* Cash */}
          <div className="flex items-center justify-between py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-3">
              <AssetLogo logo="$" color="#7BF179" size={36} />
              <div>
                <div className="text-white" style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 14, fontWeight: 500 }}>
                  US Dollar
                </div>
                <div className="text-text-secondary" style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 12 }}>
                  Cash
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white" style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 14, fontWeight: 500 }}>
                $1,240.00
              </div>
            </div>
          </div>

          {/* Crypto holdings */}
          {walletAssets.map((asset, i) => {
            const holdings = asset.id === 'sei' ? 245.5 : asset.id === 'ethereum' ? 0.042 : 0.0031;
            const value = holdings * asset.price;
            const positive = asset.change > 0;
            return (
              <div key={asset.id} className="flex items-center justify-between py-3.5" style={{
                borderBottom: i < walletAssets.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}>
                <div className="flex items-center gap-3">
                  <AssetLogo logo={asset.logo} color={asset.logoColor} size={36} />
                  <div>
                    <div className="text-white" style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 14, fontWeight: 500 }}>
                      {asset.name}
                    </div>
                    <div className="text-text-secondary" style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 12 }}>
                      {holdings} {asset.subtitle}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white" style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 14, fontWeight: 500 }}>
                    ${value.toFixed(2)}
                  </div>
                  <div style={{
                    fontFamily: "'Google Sans Flex', sans-serif",
                    fontSize: 11,
                    color: positive ? '#7BF179' : '#FF4757',
                  }}>
                    {positive ? '+' : ''}{asset.change}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
