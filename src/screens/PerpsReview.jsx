import { useState } from 'react';
import { BackArrow, CheckIcon, Spinner } from '../components/Icons';
import { motion } from 'framer-motion';

export default function PerpsReview({ market, order, onBack, onConfirm }) {
  const [state, setState] = useState('review');
  const isLong = order.direction === 'Long';

  const handleConfirm = () => {
    setState('loading');
    setTimeout(() => {
      if (Math.random() < 0.12) {
        setState('error');
      } else {
        setState('success');
      }
    }, 1500);
  };

  const handleRetry = () => {
    setState('loading');
    setTimeout(() => setState('success'), 1500);
  };

  if (state === 'loading') {
    return (
      <motion.div className="absolute inset-0 bg-app-bg z-40 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Spinner color={isLong ? '#7BF179' : '#FF4757'} />
      </motion.div>
    );
  }

  if (state === 'error') {
    return (
      <motion.div className="absolute inset-0 bg-app-bg z-40 flex flex-col items-center justify-center px-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="p-4 rounded-2xl w-full" style={{
          background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,71,87,0.15)', borderLeft: '3px solid #FF4757',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        }}>
          <div className="text-white mb-3" style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 15 }}>
            Something went wrong. Please try again.
          </div>
          <button
            onClick={handleRetry}
            className="px-6 py-2.5 rounded-lg border"
            style={{ borderColor: '#fff', color: '#fff', fontFamily: "'Google Sans Flex', sans-serif", fontSize: 13 }}
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  if (state === 'success') {
    return (
      <motion.div className="absolute inset-0 bg-app-bg z-40 flex flex-col items-center justify-center px-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="relative animate-scale-up mb-6">
          <div className="absolute inset-0 rounded-full animate-pulse" style={{
            background: isLong
              ? 'radial-gradient(circle, rgba(123,241,121,0.2) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(255,71,87,0.2) 0%, transparent 70%)',
            transform: 'scale(2)',
          }} />
          <CheckIcon size={64} color={isLong ? '#7BF179' : '#FF4757'} />
        </div>
        <div style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 18 }} className="text-white text-center mb-2">
          {market.name} {order.direction} position opened
        </div>
        <div className="text-text-secondary text-center mb-8" style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 15 }}>
          Position size: ${order.positionSize.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <button
          onClick={() => onConfirm('position')}
          className="w-full py-3.5 rounded-xl mb-3 active:brightness-110"
          style={{ backgroundColor: '#7BF179', color: '#000', fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 15,
            boxShadow: '0 4px 20px rgba(123,241,121,0.3), 0 1px 4px rgba(123,241,121,0.15)' }}
        >
          View Position
        </button>
        <button
          onClick={() => onConfirm('trade')}
          className="w-full py-3.5 rounded-xl border active:brightness-110"
          style={{ borderColor: '#fff', color: '#fff', fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 15, backgroundColor: 'transparent' }}
        >
          Trade Again
        </button>
      </motion.div>
    );
  }

  const fee = 0.05;

  return (
    <motion.div
      className="absolute inset-0 bg-app-bg z-40 flex flex-col"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="flex items-center gap-3 px-4 pt-4 pb-6">
        <button onClick={onBack} className="p-1 active:opacity-70"><BackArrow /></button>
        <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 16 }} className="text-white">Review Order</span>
      </div>

      <div className="px-4 flex-1">
        <div className="rounded-2xl border overflow-hidden" style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03)',
        }}>
          {[
            { label: 'Direction', value: order.direction, badge: true },
            { label: 'Asset', value: `${market.ticker} Perpetual` },
            { label: 'Order type', value: order.orderType },
            { label: 'Collateral', value: `$${order.amount.toFixed(2)}` },
            { label: 'Leverage', value: `${order.leverage}×` },
            { label: 'Position size', value: `$${order.positionSize.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
            { label: 'Est. entry price', value: `$${order.entryPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
            { label: 'Est. liquidation', value: `$${order.liquidationPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
            { label: 'Fee', value: `$${fee.toFixed(2)}` },
          ].map((row, i, arr) => (
            <div key={i}>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-text-secondary" style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 13 }}>{row.label}</span>
                {row.badge ? (
                  <span
                    className="px-2.5 py-0.5 rounded-full text-xs"
                    style={{
                      backgroundColor: isLong ? '#7BF179' : '#FF4757',
                      color: isLong ? '#000' : '#fff',
                      fontFamily: "'Google Sans Flex', sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    {row.value}
                  </span>
                ) : (
                  <span className="text-white" style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 13 }}>{row.value}</span>
                )}
              </div>
              {i < arr.length - 1 && <div className="h-px mx-4" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />}
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 pb-6">
        <button
          onClick={handleConfirm}
          className="w-full py-3.5 rounded-xl active:brightness-110 transition-all"
          style={{
            backgroundColor: isLong ? '#7BF179' : '#FF4757',
            color: isLong ? '#000' : '#fff',
            fontFamily: "'Google Sans Flex', sans-serif",
            fontWeight: 500,
            fontSize: 15,
            boxShadow: isLong
              ? '0 4px 20px rgba(123,241,121,0.3), 0 1px 4px rgba(123,241,121,0.15)'
              : '0 4px 20px rgba(255,71,87,0.3), 0 1px 4px rgba(255,71,87,0.15)',
          }}
        >
          Confirm {order.direction}
        </button>
      </div>
    </motion.div>
  );
}
