import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { HomeIcon, TradeIcon, AppsIcon, WalletIcon, ClockIcon } from './components/Icons';
import { mockPositions } from './data/mockData';
import AssetDetail from './screens/AssetDetail';
import ConvertScreen from './screens/ConvertScreen';
import ReviewScreen from './screens/ReviewScreen';
import PerpsLanding from './screens/PerpsLanding';
import PerpsMarketScreen from './screens/PerpsMarketScreen';
import OrderEntry from './screens/OrderEntry';
import PerpsReview from './screens/PerpsReview';
import PositionDetail from './screens/PositionDetail';
import TPSLScreen from './screens/TPSLScreen';
import TransactionHistory from './screens/TransactionHistory';
import SpotOrderEntry from './screens/SpotOrderEntry';
import WalletPage from './screens/WalletPage';

const mockOrders = [
  {
    id: 'order-1',
    type: 'spot',
    asset: 'SEI',
    direction: 'Buy',
    limitPrice: 0.38,
    amount: 500,
    tokenAmount: 1315.79,
    logo: '/logos/sei.png',
    logoColor: '#E31B54',
    createdAt: Date.now() - 3600000,
  },
  {
    id: 'order-2',
    type: 'leverage',
    asset: 'ETH',
    direction: 'Long',
    limitPrice: 3400,
    amount: 100,
    leverage: 10,
    positionSize: 1000,
    tokenAmount: 0.294,
    logo: '/logos/eth.png',
    logoColor: '#627EEA',
    createdAt: Date.now() - 7200000,
  },
];

const tabs = [
  { id: 'home', label: 'Home', Icon: HomeIcon },
  { id: 'trade', label: 'Trade', Icon: TradeIcon },
  { id: 'apps', label: 'Apps', Icon: AppsIcon },
  { id: 'wallets', label: 'Wallets', Icon: WalletIcon },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('trade');
  const [screen, setScreen] = useState('landing');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [convertMode, setConvertMode] = useState('buy');
  const [reviewData, setReviewData] = useState(null);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [orderDirection, setOrderDirection] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [positions, setPositions] = useState([...mockPositions]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [positionDetailOpen, setPositionDetailOpen] = useState(false);
  const [tpslPosition, setTpslPosition] = useState(null);
  const [closeConfirmPos, setCloseConfirmPos] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [spotDirection, setSpotDirection] = useState('Buy');
  const [orders, setOrders] = useState(mockOrders);
  // Wallet overlay screens
  const [walletScreen, setWalletScreen] = useState(null); // null | 'convert' | 'review'
  const [walletConvertAsset, setWalletConvertAsset] = useState(null);

  const resetToLanding = useCallback(() => {
    setScreen('landing');
    setSelectedAsset(null);
    setReviewData(null);
    setSelectedMarket(null);
    setOrderDirection(null);
    setOrderData(null);
    setTpslPosition(null);
    setSpotDirection('Buy');
  }, []);

  const resetWallet = useCallback(() => {
    setWalletScreen(null);
    setWalletConvertAsset(null);
    setReviewData(null);
    setConvertMode('buy');
  }, []);

  // Spot flow: AssetDetail → SpotOrderEntry → ReviewScreen
  const handleAssetTap = (asset) => { setSelectedAsset(asset); setScreen('assetDetail'); };
  const handleSpotTrade = (direction) => { setSpotDirection(direction); setScreen('spotOrder'); };
  const handleSpotOrderReview = (order) => {
    if (order.orderType === 'Limit') {
      const newOrder = {
        id: `order-${Date.now()}`,
        type: 'spot',
        asset: selectedAsset.name,
        direction: order.direction,
        limitPrice: order.limitPrice,
        amount: order.amount,
        tokenAmount: order.tokenAmount,
        logo: selectedAsset.logo,
        logoColor: selectedAsset.logoColor,
        createdAt: Date.now(),
      };
      setOrders(prev => [...prev, newOrder]);
      resetToLanding();
      return;
    }
    setReviewData({ amount: order.amount, receive: order.receive });
    setConvertMode(order.direction === 'Buy' ? 'buy' : 'sell');
    setScreen('review');
  };
  const handleSpotConfirm = (action) => {
    if (action === 'trade') resetToLanding();
    else { setActiveTab('wallets'); resetToLanding(); }
  };

  // Wallet Convert flow: WalletPage Convert → ConvertScreen → ReviewScreen (overlaid on wallet tab)
  const handleWalletConvert = () => {
    // Default: open convert with first non-cash asset (SEI)
    const defaultAsset = { id: 'sei', name: 'SEI', subtitle: 'Sei', price: 0.42, priceDisplay: '$0.42', logo: '/logos/sei.png', logoColor: '#E31B54' };
    setWalletConvertAsset(defaultAsset);
    setConvertMode('buy');
    setWalletScreen('convert');
  };
  const handleWalletReview = (amount, receive) => {
    setReviewData({ amount, receive });
    setWalletScreen('review');
  };
  const handleWalletConfirm = () => {
    resetWallet();
  };

  // Perps flow unchanged
  const handleMarketTap = (market) => { setSelectedMarket(market); setScreen('perpsMarket'); };
  const handleLong = () => { setOrderDirection('Long'); setScreen('orderEntry'); };
  const handleShort = () => { setOrderDirection('Short'); setScreen('orderEntry'); };
  const handleOrderReview = (order) => {
    if (order.orderType === 'Limit') {
      const newOrder = {
        id: `order-${Date.now()}`,
        type: 'leverage',
        asset: selectedMarket.name,
        direction: order.direction,
        limitPrice: order.limitPrice,
        amount: order.amount,
        leverage: order.leverage,
        positionSize: order.positionSize,
        tokenAmount: order.tokenAmount,
        logo: selectedMarket.logo,
        logoColor: selectedMarket.logoColor,
        createdAt: Date.now(),
      };
      setOrders(prev => [...prev, newOrder]);
      resetToLanding();
      return;
    }
    setOrderData(order); setScreen('perpsReview');
  };
  const handlePerpsConfirm = () => { resetToLanding(); };
  const handlePositionTap = (pos) => { setSelectedPosition(pos); setPositionDetailOpen(true); };
  const handleClosePosition = (pos) => { setCloseConfirmPos(pos); setPositionDetailOpen(false); };
  const confirmClosePosition = () => { setPositions(prev => prev.filter(p => p.id !== closeConfirmPos.id)); setCloseConfirmPos(null); };
  const handleTPSL = (pos) => { setPositionDetailOpen(false); setTpslPosition(pos); };
  const handleTPSLSave = (tpsl) => {
    setPositions(prev => prev.map(p => p.id === tpslPosition.id ? { ...p, tp: tpsl.tp || null, sl: tpsl.sl || null } : p));
    setTpslPosition(null);
  };
  const handleCancelOrder = (orderId) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  // Derive live position from state so TP/SL updates are reflected
  const liveSelectedPosition = selectedPosition ? positions.find(p => p.id === selectedPosition.id) || selectedPosition : null;

  // Legacy convert from PerpsLanding spot list (still used for quick-convert link if needed)
  const handleConvert = (asset, mode) => { setSelectedAsset(asset); setConvertMode(mode); setScreen('convert'); };

  const renderContent = () => {
    if (activeTab === 'wallets') {
      return <WalletPage onConvert={handleWalletConvert} />;
    }

    if (activeTab !== 'trade') {
      return (
        <div className="flex-1 flex items-center justify-center">
          <span style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 18, fontWeight: 500 }} className="text-white capitalize">
            {activeTab}
          </span>
        </div>
      );
    }

    return (
      <PerpsLanding
        onMarketTap={handleMarketTap}
        onAssetTap={handleAssetTap}
        onConvert={handleConvert}
        positions={positions}
        orders={orders}
        onPositionTap={handlePositionTap}
        onClosePosition={handleClosePosition}
        onCancelOrder={handleCancelOrder}
      />
    );
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black">
      <div className="phone-frame flex flex-col">
        {activeTab === 'trade' && (
          <div className="flex items-center justify-between px-5 pt-6 pb-3">
            <h1 style={{ fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 22 }} className="text-white">
              Trade
            </h1>
            <button onClick={() => setShowHistory(true)} className="p-1 active:opacity-70">
              <ClockIcon />
            </button>
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden relative">
          {renderContent()}

          <AnimatePresence>
            {/* Spot flow: AssetDetail → SpotOrderEntry → ReviewScreen */}
            {screen === 'assetDetail' && selectedAsset && (
              <AssetDetail key="asset-detail" asset={selectedAsset} onBack={() => setScreen('landing')} onTrade={handleSpotTrade} />
            )}
            {screen === 'spotOrder' && selectedAsset && (
              <SpotOrderEntry key="spot-order" asset={selectedAsset} direction={spotDirection} onClose={() => setScreen('assetDetail')} onReview={handleSpotOrderReview} />
            )}
            {screen === 'review' && selectedAsset && reviewData && (
              <ReviewScreen key="review" asset={selectedAsset} amount={reviewData.amount} receive={reviewData.receive} mode={convertMode} onBack={() => setScreen('spotOrder')} onConfirm={handleSpotConfirm} />
            )}

            {/* Perps flow */}
            {screen === 'perpsMarket' && selectedMarket && (
              <PerpsMarketScreen key="perps-market" market={selectedMarket} onBack={() => setScreen('landing')} onLong={handleLong} onShort={handleShort} />
            )}
            {screen === 'orderEntry' && selectedMarket && (
              <OrderEntry key="order-entry" market={selectedMarket} direction={orderDirection} onClose={() => setScreen('perpsMarket')} onReview={handleOrderReview} />
            )}
            {screen === 'perpsReview' && selectedMarket && orderData && (
              <PerpsReview key="perps-review" market={selectedMarket} order={orderData} onBack={() => setScreen('orderEntry')} onConfirm={handlePerpsConfirm} />
            )}

            {/* Wallet convert overlay screens */}
            {walletScreen === 'convert' && walletConvertAsset && (
              <ConvertScreen key="wallet-convert" asset={walletConvertAsset} mode={convertMode} onBack={resetWallet} onReview={handleWalletReview} />
            )}
            {walletScreen === 'review' && walletConvertAsset && reviewData && (
              <ReviewScreen key="wallet-review" asset={walletConvertAsset} amount={reviewData.amount} receive={reviewData.receive} mode={convertMode} onBack={() => setWalletScreen('convert')} onConfirm={handleWalletConfirm} />
            )}

            {showHistory && <TransactionHistory key="history" onBack={() => setShowHistory(false)} />}
            {tpslPosition && <TPSLScreen key="tpsl" position={tpslPosition} onBack={() => setTpslPosition(null)} onSave={handleTPSLSave} />}
          </AnimatePresence>

          <PositionDetail position={liveSelectedPosition} isOpen={positionDetailOpen} onClose={() => setPositionDetailOpen(false)} onClosePosition={handleClosePosition} onTPSL={handleTPSL} />

          {/* Close position confirmation - glass */}
          {closeConfirmPos && (
            <div className="absolute inset-0 z-[60] flex items-center justify-center px-8">
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setCloseConfirmPos(null)} />
              <div className="relative rounded-2xl p-6 w-full" style={{
                background: 'rgba(26,26,26,0.92)', backdropFilter: 'blur(40px)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
              }}>
                <div className="text-white mb-5" style={{ fontFamily: "'Google Sans Flex', sans-serif", fontSize: 15, lineHeight: 1.5 }}>
                  Close your {closeConfirmPos.asset} {closeConfirmPos.direction} position at market price?
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setCloseConfirmPos(null)}
                    className="flex-1 py-3 rounded-xl border"
                    style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#fff', fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 13, backgroundColor: 'transparent' }}>
                    Cancel
                  </button>
                  <button onClick={confirmClosePosition}
                    className="flex-1 py-3 rounded-xl"
                    style={{ backgroundColor: '#FF4757', color: '#fff', fontFamily: "'Google Sans Flex', sans-serif", fontWeight: 500, fontSize: 13,
                      boxShadow: '0 4px 20px rgba(255,71,87,0.3)' }}>
                    Close Position
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom tab bar - frosted glass */}
        <div className="flex items-center justify-around py-2 pb-4" style={{
          background: 'rgba(10, 10, 10, 0.85)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        }}>
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); if (id === 'trade') resetToLanding(); if (id !== 'wallets') resetWallet(); }}
              className="flex flex-col items-center gap-1 py-1 px-3 active:opacity-70"
            >
              <Icon active={activeTab === id} />
              <span style={{
                fontFamily: "'Google Sans Flex', sans-serif",
                fontSize: 10,
                fontWeight: 500,
                color: activeTab === id ? '#7BF179' : '#6B6B6B',
                filter: activeTab === id ? 'drop-shadow(0 0 4px rgba(123,241,121,0.4))' : 'none',
              }}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
