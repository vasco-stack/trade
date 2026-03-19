import { motion, AnimatePresence } from 'framer-motion';

export default function BottomSheet({ isOpen, onClose, children, height = '55%' }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-[20px]"
            style={{
              maxHeight: height,
              background: 'rgba(26, 26, 26, 0.88)',
              backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 -8px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            }}
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}>
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.25), rgba(255,255,255,0.1))' }} />
            </div>
            <div className="scroll-container" style={{ maxHeight: `calc(${height} - 20px)` }}>{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
