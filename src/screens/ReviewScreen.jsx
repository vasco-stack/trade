import { useState } from 'react';
import { BackArrow, AssetLogo, CheckIcon, Spinner } from '../components/Icons';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReviewScreen({ asset, amount, receive, mode = 'buy', onBack, onConfirm }) {
  const [state, setState] = useState('review'); // review | loading | success | error
  const fee = 0.10;
  const total = (amount + fee).toFixed(2);
  const isBuy = mode === 'buy';

  const handleConfirm = () => {
    setState('loading');
    setTimeout(() => {
      // Simulate occasional error (show once then succeed)
      if (Math.random() < 0.15 && state !== 'error') {
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
      <motion.div
        className="absolute inset-0 bg-app-bg z-40 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Spinner />
      </motion.div>
    );
  }

  if (state === 'error') {
    return (
      <motion.div
        className="absolute inset-0 bg-app-bg z-40 flex flex-col items-center justify-center px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
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
      <motion.div
        className="absolute inset-0 bg-app-bg z-40 flex flex-col items-center justify-center px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="relative animate-scale-up mb-6">
          <div className="absolute inset-0 rounded-full animate-pulse" style={{
            background: 'radial-gradient(circle, rgba(123,241,121,0.2) 0%, transparent 70%)',
            transform: 'scale(2)',
          }} />
          <CheckIcon size={64} />
        </div>
        <div style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 20 }} className="text-white text-center mb-2">
          You {isBuy ? 'bought' : 'sold'} {receive} {asset.subtitle}
        </div>
        <div className="text-text-secondary text-center mb-8" style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 16 }}>
          for ${total}
        </div>
        <button
          onClick={() => onConfirm('wallet')}
          className="w-full py-3.5 rounded-xl mb-3 active:brightness-110"
          style={{ backgroundColor: '#7BF179', color: '#000', fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 15,
            boxShadow: '0 4px 20px rgba(123,241,121,0.3), 0 1px 4px rgba(123,241,121,0.15)' }}
        >
          View in Wallet
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

  return (
    <motion.div
      className="absolute inset-0 bg-app-bg z-40 flex flex-col"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="flex items-center gap-3 px-4 pt-4 pb-6">
        <button onClick={onBack} className="p-1 active:opacity-70">
          <BackArrow />
        </button>
        <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 16 }} className="text-white">
          Review Order
        </span>
      </div>

      <div className="px-4 flex-1">
        <div className="rounded-2xl border overflow-hidden" style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03)',
        }}>
          {[
            { label: `You're ${isBuy ? 'buying' : 'selling'}`, value: asset.subtitle, hasLogo: true },
            { label: 'Amount', value: `$${amount.toFixed(2)}` },
            { label: `You'll receive`, value: `≈ ${receive} ${isBuy ? asset.subtitle : 'USD'}` },
            { label: 'Exchange rate', value: `1 ${asset.subtitle} = ${asset.priceDisplay}` },
            { label: 'Fee', value: `$${fee.toFixed(2)}` },
            { label: 'Total', value: `$${total}`, bold: true },
          ].map((row, i, arr) => (
            <div key={i}>
              <div className="flex items-center justify-between px-4 py-3.5">
                <span className="text-text-secondary" style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 14 }}>
                  {row.label}
                </span>
                <div className="flex items-center gap-2">
                  {row.hasLogo && <AssetLogo logo={asset.logo} color={asset.logoColor} size={20} />}
                  <span
                    className="text-white"
                    style={{
                      fontFamily: "'Google Sans Flex', sans-serif",
                      fontSize: row.bold ? 16 : 14,
                      fontWeight: row.bold ? 700 : 400,
                    }}
                  >
                    {row.value}
                  </span>
                </div>
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
            backgroundColor: '#7BF179',
            color: '#000',
            fontFamily: "'Google Sans Flex', sans-serif",
            fontWeight: 500,
            fontSize: 15,
            boxShadow: '0 4px 20px rgba(123,241,121,0.3), 0 1px 4px rgba(123,241,121,0.15)',
          }}
        >
          Confirm {isBuy ? 'Buy' : 'Sell'}
        </button>
      </div>
    </motion.div>
  );
}
