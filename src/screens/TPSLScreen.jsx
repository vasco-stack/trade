import { useState } from 'react';
import { BackArrow } from '../components/Icons';
import { motion } from 'framer-motion';

export default function TPSLScreen({ position, onBack, onSave }) {
  const [tpPrice, setTpPrice] = useState(position.tp ? String(position.tp) : '');
  const [slPrice, setSlPrice] = useState(position.sl ? String(position.sl) : '');
  const isLong = position.direction === 'Long';

  const tpNum = parseFloat(tpPrice) || 0;
  const slNum = parseFloat(slPrice) || 0;
  const entry = position.entryPriceNum;
  const posSize = parseFloat(position.positionSize.replace(/[$,]/g, ''));
  const lev = parseInt(position.leverage);

  // Calculate estimated P&L
  const tpPnl = tpNum > 0
    ? isLong
      ? ((tpNum - entry) / entry) * posSize
      : ((entry - tpNum) / entry) * posSize
    : 0;

  const slPnl = slNum > 0
    ? isLong
      ? ((slNum - entry) / entry) * posSize
      : ((entry - slNum) / entry) * posSize
    : 0;

  const tpPercent = tpPnl ? ((tpPnl / posSize) * 100).toFixed(1) : 0;
  const slPercent = slPnl ? ((slPnl / posSize) * 100).toFixed(1) : 0;

  return (
    <motion.div
      className="absolute inset-0 bg-app-bg z-50 flex flex-col"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="flex items-center gap-3 px-4 pt-4 pb-4">
        <button onClick={onBack} className="p-1 active:opacity-70"><BackArrow /></button>
        <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 15 }} className="text-white">
          Take Profit / Stop Loss
        </span>
      </div>

      <div className="px-4 flex-1">
        {/* Badge */}
        <div className="mb-6">
          <span
            className="px-3 py-1 rounded-full text-xs"
            style={{
              backgroundColor: isLong ? '#7BF179' : '#FF4757',
              color: isLong ? '#000' : '#fff',
              fontFamily: "'Google Sans Flex', sans-serif",
              fontWeight: 500,
            }}
          >
            {position.asset} {position.direction}
          </span>
        </div>

        {/* Take Profit */}
        <div className="mb-6">
          <label className="text-text-secondary mb-2 block" style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 13 }}>
            Take Profit
          </label>
          <input
            type="number"
            value={tpPrice}
            onChange={e => setTpPrice(e.target.value)}
            placeholder="Enter price"
            className="w-full px-4 py-3 rounded-xl border outline-none text-white"
            style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 15,
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
            }}
          />
          {tpNum > 0 && (
            <div className="mt-2" style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 13, color: tpPnl > 0 ? '#7BF179' : '#FF4757' }}>
              Est. profit: {tpPnl > 0 ? '+' : ''}${tpPnl.toFixed(2)} ({tpPnl > 0 ? '+' : ''}{tpPercent}%)
            </div>
          )}
        </div>

        {/* Stop Loss */}
        <div className="mb-6">
          <label className="text-text-secondary mb-2 block" style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 13 }}>
            Stop Loss
          </label>
          <input
            type="number"
            value={slPrice}
            onChange={e => setSlPrice(e.target.value)}
            placeholder="Enter price"
            className="w-full px-4 py-3 rounded-xl border outline-none text-white"
            style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 15,
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
            }}
          />
          {slNum > 0 && (
            <div className="mt-2" style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 13, color: slPnl < 0 ? '#FF4757' : '#7BF179' }}>
              Est. loss: {slPnl > 0 ? '+' : ''}${slPnl.toFixed(2)} ({slPnl > 0 ? '+' : ''}{slPercent}%)
            </div>
          )}
        </div>
      </div>

      <div className="px-4 pb-6">
        <button
          onClick={() => onSave({ tp: tpNum, sl: slNum })}
          className="w-full py-3.5 rounded-xl active:brightness-110"
          style={{ backgroundColor: '#7BF179', color: '#000', fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 15,
            boxShadow: '0 4px 20px rgba(123,241,121,0.3), 0 1px 4px rgba(123,241,121,0.15)' }}
        >
          Save
        </button>
      </div>
    </motion.div>
  );
}
