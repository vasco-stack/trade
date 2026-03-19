import { useState } from 'react';
import { BackArrow, AssetLogo } from '../components/Icons';
import BottomSheet from '../components/BottomSheet';
import { motion } from 'framer-motion';

export default function PositionDetail({ position, isOpen, onClose, onClosePosition, onTPSL }) {
  const isLong = position?.direction === 'Long';

  if (!position) return null;

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} height="80%">
      <div className="px-4 pb-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: isLong ? '#7BF179' : '#FF4757' }} />
          <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 16 }} className="text-white">
            {position.asset} {position.direction}
          </span>
          <span className="px-2 py-0.5 rounded text-text-secondary" style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 11, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {position.leverage}
          </span>
        </div>

        {/* Details */}
        <div className="rounded-2xl mb-5" style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03)',
        }}>
          {[
            { label: 'Entry Price', value: position.entryPrice },
            { label: 'Current Price', value: position.currentPrice },
            { label: 'Liquidation Price', value: position.liquidationPrice },
            { label: 'Position Size', value: position.positionSize },
            { label: 'Collateral', value: position.margin },
            { label: 'Unrealized PnL', value: `${position.pnl} (${position.pnlPercent})`, isColored: true },
            ...(position.holdingFeePaid ? [{ label: 'Holding Fee', value: position.holdingFeePaid, isColored: true, colorOverride: position.holdingFeePositive }] : []),
          ].map((row, i, arr) => (
            <div key={i}>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-text-secondary" style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 13 }}>
                  {row.label}
                </span>
                <span
                  style={{
                    fontFamily: "'Google Sans Flex', sans-serif",
                    fontSize: 13,
                    fontWeight: row.isColored ? 700 : 400,
                    color: row.isColored ? (('colorOverride' in row ? row.colorOverride : position.pnlPositive) ? '#7BF179' : '#FF4757') : '#fff',
                  }}
                >
                  {row.value}
                </span>
              </div>
              {i < arr.length - 1 && <div className="h-px mx-4" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />}
            </div>
          ))}
        </div>

        {/* TP/SL — shown when set */}
        {(position.tp || position.sl) && (
          <div className="rounded-2xl mb-5" style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03)',
          }}>
            <div className="flex items-center justify-between px-4 py-2.5">
              <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.4)', letterSpacing: 0.3 }}>
                TP / SL
              </span>
            </div>
            <div className="h-px mx-4" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
            {position.tp && (
              <>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-text-secondary" style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 13 }}>
                    Take Profit
                  </span>
                  <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 13, fontWeight: 700, color: '#7BF179' }}>
                    ${position.tp.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                {position.sl && <div className="h-px mx-4" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />}
              </>
            )}
            {position.sl && (
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-text-secondary" style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 13 }}>
                  Stop Loss
                </span>
                <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 13, fontWeight: 700, color: '#FF4757' }}>
                  ${position.sl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => onClosePosition(position)}
            className="w-full py-3.5 rounded-xl active:brightness-110"
            style={{ backgroundColor: '#FF4757', color: '#fff', fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 14,
              boxShadow: '0 4px 20px rgba(255,71,87,0.3), 0 1px 4px rgba(255,71,87,0.15)' }}
          >
            Close Position
          </button>
          <button
            className="w-full py-3.5 rounded-xl border active:brightness-110"
            style={{ borderColor: '#fff', color: '#fff', fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 14, backgroundColor: 'transparent' }}
          >
            Add Collateral
          </button>
          <button
            onClick={() => onTPSL(position)}
            className="w-full py-3.5 rounded-xl border active:brightness-110"
            style={{ borderColor: '#fff', color: '#fff', fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 14, backgroundColor: 'transparent' }}
          >
            {position.tp || position.sl ? 'Edit TP/SL' : 'Set TP/SL'}
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
