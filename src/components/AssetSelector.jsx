import { motion, AnimatePresence } from 'framer-motion';
import { spotAssets } from '../data/mockData';
import { AssetLogo } from './Icons';

export default function AssetSelector({ isOpen, onClose, onSelect, excludeId }) {
  const filtered = spotAssets.filter(a => a.id !== excludeId);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => { e.stopPropagation(); onClose(); }}
          />

          {/* Sheet */}
          <motion.div
            onClick={e => e.stopPropagation()}
            className="absolute bottom-0 left-0 right-0 z-50 rounded-t-2xl pb-8"
            style={{
              background: 'rgba(22,22,26,0.98)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderBottom: 'none',
              boxShadow: '0 -8px 40px rgba(0,0,0,0.5)',
            }}
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-4">
              <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
            </div>

            {/* Title */}
            <div className="px-5 pb-3">
              <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 16 }} className="text-white">
                Select Asset
              </span>
            </div>

            {/* Asset list */}
            <div className="px-3">
              {filtered.map(a => (
                <button
                  key={a.id}
                  onClick={e => { e.stopPropagation(); onSelect(a); onClose(); }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl active:scale-[0.98] transition-all"
                  style={{ background: 'transparent' }}
                  onMouseDown={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  onMouseUp={e => e.currentTarget.style.background = 'transparent'}
                  onTouchStart={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  onTouchEnd={e => e.currentTarget.style.background = 'transparent'}
                >
                  <AssetLogo logo={a.logo} color={a.logoColor} size={36} />
                  <div className="flex-1 text-left">
                    <div style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 14 }} className="text-white">
                      {a.isCash ? 'Cash' : a.name}
                    </div>
                    <div style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 12 }} className="text-text-secondary">
                      {a.isCash ? 'USD' : a.subtitle}
                    </div>
                  </div>
                  {!a.isCash && (
                    <div className="text-right">
                      <div style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 13 }} className="text-white">
                        ${a.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  )}
                  {a.isCash && (
                    <div className="text-right">
                      <div style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 13 }} className="text-white">
                        ${a.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
