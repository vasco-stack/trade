import { useState, useRef } from 'react';

export default function PositionCard({ position, onTap, onClose }) {
  const [translateX, setTranslateX] = useState(0);
  const startX = useRef(0);
  const isDragging = useRef(false);

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = false;
  };

  const handleTouchMove = (e) => {
    const diff = e.touches[0].clientX - startX.current;
    if (diff < -10) {
      isDragging.current = true;
      setTranslateX(Math.max(diff, -80));
    } else if (diff > 10 && translateX < 0) {
      isDragging.current = true;
      setTranslateX(Math.min(0, translateX + diff));
    }
  };

  const handleTouchEnd = () => {
    if (translateX < -40) {
      setTranslateX(-80);
    } else {
      setTranslateX(0);
    }
  };

  const handleClick = () => {
    if (!isDragging.current && translateX === 0) {
      onTap();
    }
  };

  const isLong = position.direction === 'Long';
  // Health: high % = healthy (green), low % = near liquidation (red)
  // Formula: (equity - maintenance_margin) / equity
  const healthRgb = position.healthPercent > 50 ? '123,241,121' : position.healthPercent > 25 ? '255,217,61' : '255,71,87';

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Red close button behind */}
      <div className="absolute right-0 top-0 bottom-0 w-20 flex items-center justify-center" style={{ backgroundColor: '#FF4757' }}>
        <button
          onClick={onClose}
          style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 13, color: '#fff' }}
        >
          Close
        </button>
      </div>

      {/* Card foreground */}
      <div
        className="relative px-3 py-2.5 rounded-xl transition-transform"
        style={{
          background: `linear-gradient(135deg, rgba(${healthRgb},0.08) 0%, rgba(${healthRgb},0.02) 100%), #0a0a0a`,
          border: `1px solid rgba(${healthRgb},0.12)`,
          boxShadow: `0 2px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(${healthRgb},0.06)`,
          transform: `translateX(${translateX}px)`,
          transition: isDragging.current ? 'none' : 'transform 0.3s ease',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
      >
        {/* Top row */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: isLong ? '#7BF179' : '#FF4757', boxShadow: `0 0 6px ${isLong ? 'rgba(123,241,121,0.6)' : 'rgba(255,71,87,0.6)'}` }}
            />
            <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 12 }} className="text-white">
              {position.asset} {position.direction}
            </span>
          </div>
          <div className="text-right">
            <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 12, color: position.pnlPositive ? '#7BF179' : '#FF4757' }}>
              {position.pnl}
            </span>
            <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.35)', marginLeft: 4 }}>
              {position.pnlPercent}
            </span>
          </div>
        </div>

        {/* Second row */}
        <div className="flex items-center justify-between">
          <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>
            {position.leverage} · Entry: {position.entryPrice}
          </span>
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 10, color: `rgba(${healthRgb},0.9)` }}>
              {position.healthPercent}% health
            </span>
            <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>
              {position.positionSize}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
