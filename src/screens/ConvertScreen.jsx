import { useState, useMemo, useCallback } from 'react';
import { BackArrow, AssetLogo } from '../components/Icons';
import { motion } from 'framer-motion';
import { spotAssets } from '../data/mockData';
import AssetSelector from '../components/AssetSelector';

const cashAsset = spotAssets.find(a => a.isCash);

export default function ConvertScreen({ asset, mode = 'buy', onBack, onReview }) {
  const [fromAsset, setFromAsset] = useState(() => mode === 'buy' ? cashAsset : asset);
  const [toAsset, setToAsset] = useState(() => mode === 'buy' ? asset : cashAsset);
  const [selectorTarget, setSelectorTarget] = useState(null); // null | 'from' | 'to'
  const [amount, setAmount] = useState('');

  const isBuy = fromAsset.isCash;
  const activeAsset = isBuy ? toAsset : fromAsset; // the crypto asset for price calculations
  const availableBalance = 1240;
  const amountNum = parseFloat(amount) || 0;
  const insufficientFunds = amountNum > availableBalance;

  const estimatedReceive = useMemo(() => {
    if (!amountNum || !activeAsset.price) return '0';
    return (amountNum / activeAsset.price).toFixed(activeAsset.price < 1 ? 2 : 6);
  }, [amountNum, activeAsset.price]);

  const handleNumPad = useCallback((key) => {
    if (key === 'backspace') {
      setAmount(prev => prev.slice(0, -1));
    } else if (key === '.') {
      setAmount(prev => {
        if (prev.includes('.')) return prev;
        return prev === '' ? '0.' : prev + '.';
      });
    } else {
      setAmount(prev => {
        if (prev === '0' && key !== '.') return key;
        const parts = prev.split('.');
        if (parts[1] && parts[1].length >= 2) return prev;
        return prev + key;
      });
    }
  }, []);

  const numKeys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['.', '0', 'backspace'],
  ];

  const handleSwap = () => {
    setFromAsset(toAsset);
    setToAsset(fromAsset);
  };

  const handleSelect = (selected) => {
    if (selectorTarget === 'from') {
      // If they pick the same asset that's already on "to", swap
      if (selected.id === toAsset.id) {
        setToAsset(fromAsset);
      }
      setFromAsset(selected);
    } else {
      if (selected.id === fromAsset.id) {
        setFromAsset(toAsset);
      }
      setToAsset(selected);
    }
  };

  return (
    <motion.div
      onClick={e => e.stopPropagation()}
      className="absolute inset-0 bg-app-bg z-30 flex flex-col overflow-hidden"
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}>
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <button onClick={onBack} className="p-1 active:opacity-70"><BackArrow /></button>
        <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 16 }} className="text-white">
          {isBuy ? 'Buy' : 'Sell'} {activeAsset.name}
        </span>
      </div>

      <div className="flex-1 flex flex-col" style={{ minHeight: 0 }}>
        <div style={{ flex: 0.35 }} />

        {/* From card - tappable */}
        <div
          onClick={() => setSelectorTarget('from')}
          className="mx-4 px-3.5 py-2.5 rounded-xl cursor-pointer active:scale-[0.98] transition-all"
          style={{
            background: '#0A0A0A',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <AssetLogo logo={fromAsset.logo} color={fromAsset.logoColor} size={30} />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-text-secondary" style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 11.5 }}>From</span>
                  <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 14 }} className="text-white">
                    {fromAsset.isCash ? 'Cash' : fromAsset.name}
                  </span>
                </div>
                <div className="text-text-secondary" style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 11.5 }}>
                  {fromAsset.isCash
                    ? `$${availableBalance.toLocaleString()}.00`
                    : `${(availableBalance / fromAsset.price).toFixed(4)} ${fromAsset.subtitle}`} available
                </div>
              </div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B6B6B" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>

        {/* Swap button */}
        <div className="flex justify-center -my-2.5 z-10">
          <button
            onClick={handleSwap}
            className="w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-all"
            style={{
              background: '#7BF179',
              boxShadow: '0 4px 16px rgba(123,241,121,0.35), 0 2px 6px rgba(0,0,0,0.3)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 14V9a4 4 0 014-4h11" />
              <path d="M14 1l4 4-4 4" />
              <path d="M21 10v5a4 4 0 01-4 4H6" />
              <path d="M10 23l-4-4 4-4" />
            </svg>
          </button>
        </div>

        {/* To card - tappable */}
        <div
          onClick={() => setSelectorTarget('to')}
          className="mx-4 px-3.5 rounded-xl cursor-pointer active:scale-[0.98] transition-all"
          style={{
            background: '#0A0A0A',
            border: '1px solid rgba(255,255,255,0.08)',
            paddingTop: 12,
            paddingBottom: 12,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <AssetLogo logo={toAsset.logo} color={toAsset.logoColor} size={30} />
              <div className="flex items-center gap-1.5">
                <span className="text-text-secondary" style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 11.5 }}>To</span>
                <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 14 }} className="text-white">
                  {toAsset.isCash ? 'Cash' : toAsset.name}
                </span>
              </div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B6B6B" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>

        <div className="flex-1" />

        {/* Amount display */}
        <div className="flex-shrink-0 flex flex-col items-center">
          <div style={{
            fontFamily: "'Google Sans Flex', sans-serif",
            fontWeight: 300,
            fontSize: amountNum > 99999 ? 65 : 85,
            color: insufficientFunds ? '#FF4757' : (amountNum > 0 ? '#fff' : 'rgba(255,255,255,0.2)'),
            letterSpacing: -1,
            lineHeight: 1.1,
          }}>
            ${amount || '0'}
          </div>
          {amountNum > 0 && !insufficientFunds && (
            <div className="mt-2 text-text-secondary" style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 12 }}>
              You'll receive ≈ {estimatedReceive} {activeAsset.subtitle}
            </div>
          )}
          {insufficientFunds && (
            <div className="mt-2" style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 12, color: '#FF4757' }}>
              Insufficient balance
            </div>
          )}
        </div>

        <div className="flex-1" />

        {/* Number pad */}
        <div className="flex-shrink-0 px-6 pt-1">
          <div className="grid grid-cols-3">
            {numKeys.map((row, ri) =>
              row.map((key, ci) => (
                <button
                  key={`${ri}-${ci}`}
                  onClick={() => handleNumPad(key)}
                  className="flex items-center justify-center py-1.5 active:opacity-50 transition-opacity"
                  style={{
                    fontFamily: "'Google Sans Flex', sans-serif",
                    fontSize: 20,
                    fontWeight: 400,
                    color: '#fff',
                  }}
                >
                  {key === 'backspace' ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z" />
                      <line x1="18" y1="9" x2="12" y2="15" />
                      <line x1="12" y1="9" x2="18" y2="15" />
                    </svg>
                  ) : key}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Review button */}
        <div className="flex-shrink-0 px-5 pb-2 pt-2">
          <button onClick={() => amountNum > 0 && !insufficientFunds && onReview(amountNum, estimatedReceive)}
            disabled={!amountNum || insufficientFunds}
            className="w-full py-3.5 rounded-full transition-all active:scale-[0.97]"
            style={{
              backgroundColor: amountNum > 0 && !insufficientFunds ? '#7BF179' : 'rgba(255,255,255,0.06)',
              color: amountNum > 0 && !insufficientFunds ? '#000' : 'rgba(255,255,255,0.2)',
              fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 600, fontSize: 15,
              boxShadow: amountNum > 0 && !insufficientFunds ? '0 4px 20px rgba(123,241,121,0.4)' : 'none',
            }}>Review</button>
        </div>
      </div>

      {/* Asset Selector bottom sheet */}
      <AssetSelector
        isOpen={selectorTarget !== null}
        onClose={() => setSelectorTarget(null)}
        onSelect={handleSelect}
        excludeId={selectorTarget === 'from' ? toAsset.id : fromAsset.id}
      />
    </motion.div>
  );
}
