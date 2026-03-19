import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AssetLogo } from '../components/Icons';

export default function SpotOrderEntry({ asset, direction, onClose, onReview }) {
  const [activeTab, setActiveTab] = useState(direction || 'Buy');
  const [amount, setAmount] = useState('');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [orderType, setOrderType] = useState('Market');
  const [limitPrice, setLimitPrice] = useState(asset.price);

  const isBuy = activeTab === 'Buy';
  const isLimit = orderType === 'Limit';
  const dirColor = isBuy ? '#7BF179' : '#FF4757';
  const amountNum = parseFloat(amount) || 0;
  const availableBalance = 1240.00;
  const price = isLimit ? limitPrice : asset.price;
  const ticker = asset.subtitle || asset.name;

  // Price step: ~0.1% of market price, rounded nicely
  const priceStep = useMemo(() => {
    const raw = asset.price * 0.001;
    if (raw >= 1) return Math.round(raw);
    const decimals = Math.max(2, -Math.floor(Math.log10(raw)) + 1);
    return parseFloat(raw.toFixed(decimals));
  }, [asset.price]);

  // Parse holdings for sell mode (e.g. "0.45 BTC" → 0.45)
  const holdingsNum = parseFloat((asset.amount || '0').replace(/[^0-9.]/g, '')) || 0;

  // Buy: input is USD. Sell: input is asset units.
  const dollarValue = isBuy ? amountNum : amountNum * price;
  const tokenAmount = isBuy ? (price > 0 ? amountNum / price : 0) : amountNum;
  const fee = dollarValue * 0.001;
  const total = isBuy ? amountNum + fee : dollarValue - fee;
  const insufficientFunds = isBuy ? amountNum > availableBalance : amountNum > holdingsNum;

  const estimatedReceive = useMemo(() => {
    if (!amountNum || !price) return '0';
    if (isBuy) {
      return (amountNum / price).toFixed(price < 1 ? 2 : 6);
    }
    return (amountNum * price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }, [amountNum, price, isBuy]);

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
        const maxDec = isBuy ? 2 : 8;
        if (parts[1] && parts[1].length >= maxDec) return prev;
        return prev + key;
      });
    }
  }, [isBuy]);

  const handleMax = () => {
    if (isBuy) {
      setAmount(availableBalance.toFixed(2));
    } else {
      setAmount(String(holdingsNum));
    }
  };

  const adjustLimitPrice = (dir) => {
    setLimitPrice(prev => {
      const next = prev + dir * priceStep;
      return Math.max(priceStep, parseFloat(next.toFixed(8)));
    });
  };

  const canSubmit = amountNum > 0 && !insufficientFunds && price > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onReview({
      direction: activeTab,
      orderType,
      amount: isBuy ? amountNum : dollarValue,
      tokenAmount,
      receive: estimatedReceive,
      fee,
      total,
      ...(isLimit && { limitPrice }),
    });
  };

  const displayAmount = amount || '0';

  const numKeys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['.', '0', 'backspace'],
  ];

  const formatPrice = (p) => {
    if (p >= 1) return `$${p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    return `$${p.toFixed(Math.max(2, -Math.floor(Math.log10(p)) + 3))}`;
  };

  const detailItems = isBuy ? [
    { label: isLimit ? 'Limit price' : 'Price', value: formatPrice(price) },
    { label: 'You receive', value: `${estimatedReceive} ${ticker}` },
    { label: 'Fee (0.1%)', value: `$${fee.toFixed(2)}` },
    { label: 'Total cost', value: `$${total.toFixed(2)}` },
  ] : [
    { label: isLimit ? 'Limit price' : 'Price', value: formatPrice(price) },
    { label: 'You sell', value: `${amountNum || 0} ${ticker}` },
    { label: 'Fee (0.1%)', value: `$${fee.toFixed(2)}` },
    { label: 'You receive', value: `$${total.toFixed(2)}` },
  ];

  return (
    <motion.div
      className="absolute inset-0 bg-app-bg z-30 flex flex-col"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-1">
        <button onClick={onClose} className="p-1 active:opacity-70">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <AssetLogo logo={asset.logo} color={asset.logoColor} size={22} />
          <span style={{
            fontFamily: "'Google Sans Flex', sans-serif",
            fontWeight: 600,
            fontSize: 16,
            color: '#fff',
          }}>
            {asset.name}
          </span>
        </div>
        <div className="w-8" />
      </div>

      {/* Price subtitle */}
      <div className="px-5 pb-3">
        <span style={{
          fontFamily: "'Google Sans Flex', sans-serif",
          fontSize: 12,
          color: 'rgba(255,255,255,0.35)',
        }}>
          Price {asset.priceDisplay}
        </span>
      </div>

      {/* Buy / Sell toggle tabs */}
      <div className="mx-5 mb-3 p-1 rounded-xl flex" style={{ background: 'rgba(255,255,255,0.04)' }}>
        {['Buy', 'Sell'].map(tab => {
          const active = activeTab === tab;
          const tabColor = tab === 'Buy' ? '#7BF179' : '#FF4757';
          return (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setAmount(''); }}
              className="flex-1 py-2 rounded-lg relative transition-all"
              style={{
                background: active ? `${tabColor}15` : 'transparent',
                border: active ? `1px solid ${tabColor}30` : '1px solid transparent',
              }}
            >
              <span style={{
                fontFamily: "'Google Sans Flex', sans-serif",
                fontWeight: 600,
                fontSize: 13,
                color: active ? tabColor : 'rgba(255,255,255,0.35)',
              }}>
                {tab}
              </span>
            </button>
          );
        })}
      </div>

      {/* Limit price editor */}
      <AnimatePresence>
        {isLimit && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mx-5 mb-3 px-3 py-2.5 rounded-xl flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                Limit price
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => adjustLimitPrice(-1)}
                  className="w-7 h-7 rounded-full flex items-center justify-center active:opacity-60"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <span style={{ color: '#fff', fontSize: 16, lineHeight: 1 }}>−</span>
                </button>
                <span style={{
                  fontFamily: "'Google Sans Flex', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#fff',
                  minWidth: 70,
                  textAlign: 'center',
                }}>
                  {formatPrice(limitPrice)}
                </span>
                <button
                  onClick={() => adjustLimitPrice(1)}
                  className="w-7 h-7 rounded-full flex items-center justify-center active:opacity-60"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <span style={{ color: '#fff', fontSize: 16, lineHeight: 1 }}>+</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrollable middle */}
      <div className="flex-1 flex flex-col" style={{ minHeight: 0 }}>
        {/* Large amount display */}
        <div className="flex-shrink-0 flex flex-col items-center pt-1 pb-6">
          {isBuy ? (
            <div style={{
              fontFamily: "'Google Sans Flex', sans-serif",
              fontWeight: 300,
              fontSize: amountNum > 99999 ? 65 : 85,
              color: insufficientFunds ? '#FF4757' : (amountNum > 0 ? '#fff' : 'rgba(255,255,255,0.2)'),
              letterSpacing: -1,
              lineHeight: 1.1,
            }}>
              ${displayAmount}
            </div>
          ) : (
            <div className="flex items-baseline justify-center gap-2">
              <div style={{
                fontFamily: "'Google Sans Flex', sans-serif",
                fontWeight: 300,
                fontSize: displayAmount.length > 8 ? 55 : (displayAmount.length > 5 ? 65 : 85),
                color: insufficientFunds ? '#FF4757' : (amountNum > 0 ? '#fff' : 'rgba(255,255,255,0.2)'),
                letterSpacing: -1,
                lineHeight: 1.1,
              }}>
                {displayAmount}
              </div>
              <span style={{
                fontFamily: "'Google Sans Flex', sans-serif",
                fontWeight: 400,
                fontSize: 20,
                color: 'rgba(255,255,255,0.3)',
              }}>
                {ticker}
              </span>
            </div>
          )}

          {/* Receive info */}
          {amountNum > 0 && !insufficientFunds && (
            <div className="flex items-center gap-3 mt-3">
              <span style={{
                fontFamily: "'Google Sans Flex', sans-serif",
                fontSize: 11,
                color: 'rgba(255,255,255,0.5)',
              }}>
                {isBuy ? `≈ ${estimatedReceive} ${ticker}` : `≈ $${estimatedReceive}`}
              </span>
            </div>
          )}
          {insufficientFunds && (
            <div className="mt-2" style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 12, color: '#FF4757' }}>
              {isBuy ? 'Insufficient balance' : 'Insufficient holdings'}
            </div>
          )}
        </div>

        {/* Details collapsible section */}
        <div className="flex-shrink-0 px-5 mb-1">
          <div className="flex justify-center py-1.5">
            <button
              onClick={() => setDetailsOpen(!detailsOpen)}
              className="flex items-center gap-1.5 active:opacity-70"
            >
              <span style={{
                fontFamily: "'Google Sans Flex', sans-serif",
                fontSize: 11,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.35)',
              }}>
                Details
              </span>
              <motion.svg
                width="10" height="10" viewBox="0 0 24 24" fill="none"
                stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                animate={{ rotate: detailsOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <polyline points="6 9 12 15 18 9" />
              </motion.svg>
            </button>
          </div>

          <AnimatePresence>
            {detailsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pb-3 space-y-2.5">
                  {detailItems.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span style={{
                        fontFamily: "'Google Sans Flex', sans-serif",
                        fontSize: 12,
                        color: 'rgba(255,255,255,0.35)',
                      }}>{item.label}</span>
                      <span style={{
                        fontFamily: "'Google Sans Flex', sans-serif",
                        fontSize: 12,
                        fontWeight: 500,
                        color: 'rgba(255,255,255,0.6)',
                      }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Market/Limit toggle + Available balance */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 py-2 mb-1">
          <div className="flex p-0.5 rounded-md" style={{ background: 'rgba(255,255,255,0.04)' }}>
            {['Market', 'Limit'].map(type => {
              const active = orderType === type;
              return (
                <button
                  key={type}
                  onClick={() => {
                    setOrderType(type);
                    if (type === 'Limit') setLimitPrice(asset.price);
                  }}
                  className="px-2.5 py-0.5 rounded transition-all"
                  style={{
                    background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                  }}
                >
                  <span style={{
                    fontFamily: "'Google Sans Flex', sans-serif",
                    fontSize: 10,
                    fontWeight: 500,
                    color: active ? '#fff' : 'rgba(255,255,255,0.3)',
                  }}>
                    {type}
                  </span>
                </button>
              );
            })}
          </div>
          <button
            onClick={handleMax}
            className="active:opacity-70"
          >
            <span style={{
              fontFamily: "'Google Sans Flex', sans-serif",
              fontSize: 11,
              color: 'rgba(255,255,255,0.45)',
            }}>
              {isBuy ? `$${availableBalance.toFixed(2)}` : `${holdingsNum} ${ticker}`}{' '}
              <span style={{ color: dirColor, fontWeight: 600 }}>Avail</span>
            </span>
          </button>
        </div>

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

        {/* Bottom action */}
        <div className="flex-shrink-0 px-5 pb-2 pt-2">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full py-3.5 rounded-full active:scale-[0.97] transition-all"
            style={{
              backgroundColor: canSubmit ? dirColor : 'rgba(255,255,255,0.06)',
              color: canSubmit ? (isBuy ? '#000' : '#fff') : 'rgba(255,255,255,0.2)',
              fontFamily: "'Google Sans Flex', sans-serif",
              fontWeight: 600,
              fontSize: 15,
              boxShadow: canSubmit ? `0 4px 20px ${dirColor}40` : 'none',
            }}
          >
            {activeTab} {asset.name}
          </button>
          <div className="text-center mt-2 pb-0.5">
            <span style={{
              fontFamily: "'Google Sans Flex', sans-serif",
              fontSize: 10,
              color: 'rgba(255,255,255,0.2)',
            }}>
              Spot trading · {orderType} order
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
