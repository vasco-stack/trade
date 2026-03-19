// Sparkline data generators
const upCurve = [20, 25, 22, 30, 28, 35, 40];
const downCurve = [40, 38, 35, 30, 32, 28, 25];
const flatCurve = [30, 30, 30, 30, 30, 30, 30];
const volatileUp = [25, 20, 30, 22, 35, 28, 42];
const volatileDown = [40, 45, 35, 42, 30, 35, 25];

export const spotAssets = [
  {
    id: 'sei',
    name: 'SEI',
    subtitle: 'Sei',
    price: 0.42,
    priceDisplay: '$0.42',
    change: 5.2,
    sparkline: upCurve,
    logo: '/logos/sei.png',
    logoColor: '#E31B54',
    marketCap: '$1.8B',
    volume24h: '$245M',
    circulatingSupply: '4.2B SEI',
    high24h: 0.44,
    low24h: 0.39,
    about: 'Sei is a specialized Layer 1 blockchain designed for trading. It offers the fastest time to finality of any blockchain, making it ideal for exchanges and trading applications.',
    news: [
      { headline: 'Sei Network Announces Major Protocol Upgrade', source: 'CoinDesk', time: '2h ago' },
      { headline: 'Trading Volume Surges on Sei Ecosystem', source: 'The Block', time: '5h ago' },
      { headline: 'New Partnerships Drive Sei Adoption', source: 'Decrypt', time: '1d ago' },
    ],
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    subtitle: 'ETH',
    price: 3521.40,
    priceDisplay: '$3,521.40',
    change: -1.8,
    sparkline: downCurve,
    logo: '/logos/eth.png',
    logoColor: '#627EEA',
    marketCap: '$423B',
    volume24h: '$12.1B',
    circulatingSupply: '120.2M ETH',
    high24h: 3610,
    low24h: 3480,
    about: 'Ethereum is a decentralized platform that enables smart contracts and decentralized applications. It is the second-largest cryptocurrency by market capitalization.',
    news: [
      { headline: 'Ethereum Staking Rewards Hit New High', source: 'Bloomberg', time: '3h ago' },
      { headline: 'Layer 2 Solutions Drive ETH Demand', source: 'Reuters', time: '8h ago' },
      { headline: 'Institutional Interest in Ethereum Grows', source: 'CNBC', time: '1d ago' },
    ],
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    subtitle: 'BTC',
    price: 63450.00,
    priceDisplay: '$63,450.00',
    change: 2.1,
    sparkline: volatileUp,
    logo: '/logos/btc.png',
    logoColor: '#F7931A',
    marketCap: '$1.24T',
    volume24h: '$28.5B',
    circulatingSupply: '19.6M BTC',
    high24h: 64200,
    low24h: 62100,
    about: 'Bitcoin is the first and most recognized cryptocurrency. It operates on a decentralized peer-to-peer network and serves as a store of value and medium of exchange.',
    news: [
      { headline: 'Bitcoin ETF Inflows Break Monthly Record', source: 'Bloomberg', time: '1h ago' },
      { headline: 'Halving Effects Begin to Impact Supply', source: 'CoinDesk', time: '4h ago' },
      { headline: 'Global Adoption Accelerates in 2026', source: 'Financial Times', time: '12h ago' },
    ],
  },
  {
    id: 'usd',
    name: 'US Dollar',
    subtitle: 'Your Cash',
    price: 1240.00,
    priceDisplay: '$1,240.00',
    change: null,
    sparkline: null,
    logo: '$',
    logoColor: '#7BF179',
    isCash: true,
  },
];

export const perpsMarkets = [
  {
    id: 'btc-perp', name: 'Bitcoin', ticker: 'BTC/USD', price: 63450.00, priceDisplay: '$63,450.00', change: 2.1, leverage: '50×', category: 'crypto', sparkline: volatileUp, logo: '/logos/btc.png', logoColor: '#F7931A', volume: '$1.2B', funding: '0.01%', oi: '$450M', high24h: 64200, low24h: 62100,
    about: 'Bitcoin is the first and largest cryptocurrency by market capitalization. BTC perpetual contracts allow traders to speculate on Bitcoin price movements with leverage and no expiry date.',
    news: [
      { headline: 'Bitcoin ETF Inflows Break Monthly Record', source: 'Bloomberg', time: '1h ago' },
      { headline: 'BTC Perpetual Open Interest Hits All-Time High', source: 'The Block', time: '4h ago' },
      { headline: 'Institutional Demand Drives Bitcoin Past $63K', source: 'CoinDesk', time: '8h ago' },
    ],
  },
  {
    id: 'eth-perp', name: 'Ethereum', ticker: 'ETH/USD', price: 3521.40, priceDisplay: '$3,521.40', change: -1.8, leverage: '50×', category: 'crypto', sparkline: downCurve, logo: '/logos/eth.png', logoColor: '#627EEA', volume: '$890M', funding: '0.008%', oi: '$320M', high24h: 3610, low24h: 3480,
    about: 'Ethereum is the leading smart contract platform powering DeFi, NFTs, and thousands of decentralized applications. ETH perpetuals offer leveraged exposure to the second-largest crypto asset.',
    news: [
      { headline: 'Ethereum Layer 2 Activity Surges to Record Levels', source: 'The Block', time: '2h ago' },
      { headline: 'ETH Staking Yield Attracts Institutional Capital', source: 'Reuters', time: '6h ago' },
      { headline: 'Ethereum Foundation Announces Protocol Roadmap', source: 'CoinDesk', time: '1d ago' },
    ],
  },
  {
    id: 'sei-perp', name: 'SEI', ticker: 'SEI/USD', price: 0.42, priceDisplay: '$0.42', change: 5.2, leverage: '20×', category: 'crypto', sparkline: upCurve, logo: '/logos/sei.png', logoColor: '#E31B54', volume: '$45M', funding: '0.012%', oi: '$18M', high24h: 0.44, low24h: 0.39,
    about: 'Sei is a specialized Layer 1 blockchain optimized for trading with the fastest time to finality. SEI perpetuals let traders gain leveraged exposure to the Sei network token.',
    news: [
      { headline: 'Sei Network Hits 1 Million Daily Transactions', source: 'CoinDesk', time: '3h ago' },
      { headline: 'New DEXs Launch on Sei as Ecosystem Expands', source: 'The Block', time: '7h ago' },
      { headline: 'Sei Foundation Announces Developer Grant Program', source: 'Decrypt', time: '1d ago' },
    ],
  },
  {
    id: 'sol-perp', name: 'Solana', ticker: 'SOL/USD', price: 142.80, priceDisplay: '$142.80', change: 3.4, leverage: '30×', category: 'crypto', sparkline: volatileUp, logo: '/logos/sol.png', logoColor: '#9945FF', volume: '$560M', funding: '0.009%', oi: '$210M', high24h: 146.50, low24h: 138.20,
    about: 'Solana is a high-performance blockchain known for fast transactions and low fees. SOL perpetuals allow leveraged trading on one of the most active Layer 1 ecosystems.',
    news: [
      { headline: 'Solana DeFi TVL Climbs Past $8 Billion', source: 'DeFi Llama', time: '2h ago' },
      { headline: 'Solana Processes Record 65K Transactions Per Second', source: 'The Block', time: '5h ago' },
      { headline: 'Visa Explores Payments Integration on Solana', source: 'Bloomberg', time: '12h ago' },
    ],
  },
  {
    id: 'doge-perp', name: 'Dogecoin', ticker: 'DOGE/USD', price: 0.162, priceDisplay: '$0.162', change: -0.5, leverage: '20×', category: 'crypto', sparkline: volatileDown, logo: '/logos/doge.png', logoColor: '#C2A633', volume: '$180M', funding: '0.006%', oi: '$85M', high24h: 0.168, low24h: 0.155,
    about: 'Dogecoin is a meme-inspired cryptocurrency that has grown into a widely recognized digital asset. DOGE perpetuals offer leveraged exposure to one of the most traded altcoins.',
    news: [
      { headline: 'Dogecoin Network Upgrade Improves Transaction Speed', source: 'CoinDesk', time: '4h ago' },
      { headline: 'DOGE Trading Volume Spikes After Social Media Buzz', source: 'Decrypt', time: '8h ago' },
      { headline: 'Merchants Accepting Dogecoin Reach New Milestone', source: 'The Block', time: '1d ago' },
    ],
  },
  {
    id: 'avax-perp', name: 'Avalanche', ticker: 'AVAX/USD', price: 38.20, priceDisplay: '$38.20', change: 1.1, leverage: '20×', category: 'crypto', sparkline: upCurve, logo: '/logos/avax.png', logoColor: '#E84142', volume: '$120M', funding: '0.007%', oi: '$62M', high24h: 39.10, low24h: 37.40,
    about: 'Avalanche is a fast, low-cost smart contract platform with a unique subnet architecture. AVAX perpetuals provide leveraged trading on this growing multi-chain ecosystem.',
    news: [
      { headline: 'Avalanche Subnets Attract Major Gaming Studios', source: 'The Block', time: '3h ago' },
      { headline: 'AVAX Staking Participation Rate Hits 62%', source: 'CoinDesk', time: '9h ago' },
      { headline: 'Avalanche Partners with Traditional Finance Firm', source: 'Bloomberg', time: '1d ago' },
    ],
  },
  {
    id: 'link-perp', name: 'Chainlink', ticker: 'LINK/USD', price: 14.85, priceDisplay: '$14.85', change: -2.3, leverage: '25×', category: 'crypto', sparkline: downCurve, logo: '/logos/link.png', logoColor: '#2A5ADA', volume: '$95M', funding: '0.005%', oi: '$48M', high24h: 15.40, low24h: 14.50,
    about: 'Chainlink is the leading decentralized oracle network connecting smart contracts to real-world data. LINK perpetuals let traders speculate on the backbone of DeFi infrastructure.',
    news: [
      { headline: 'Chainlink CCIP Expands to Five New Blockchains', source: 'CoinDesk', time: '2h ago' },
      { headline: 'LINK Staking V2 Sees $1B in Deposits', source: 'The Block', time: '6h ago' },
      { headline: 'Major Bank Integrates Chainlink Price Feeds', source: 'Reuters', time: '1d ago' },
    ],
  },
  {
    id: 'arb-perp', name: 'Arbitrum', ticker: 'ARB/USD', price: 1.12, priceDisplay: '$1.12', change: 0.8, leverage: '20×', category: 'crypto', sparkline: upCurve, logo: '/logos/arb.png', logoColor: '#28A0F0', volume: '$72M', funding: '0.004%', oi: '$35M', high24h: 1.15, low24h: 1.08,
    about: 'Arbitrum is a leading Ethereum Layer 2 scaling solution using optimistic rollups to deliver faster, cheaper transactions. ARB perpetuals offer exposure to Ethereum scaling growth.',
    news: [
      { headline: 'Arbitrum DAO Approves $50M Ecosystem Fund', source: 'The Block', time: '3h ago' },
      { headline: 'DeFi Protocols Migrate to Arbitrum for Lower Fees', source: 'CoinDesk', time: '7h ago' },
      { headline: 'Arbitrum Orbit Chains Surpass 100 Deployments', source: 'Decrypt', time: '1d ago' },
    ],
  },
  {
    id: 'aapl-perp', name: 'Apple', ticker: 'AAPL/USD', price: 187.50, priceDisplay: '$187.50', change: 1.4, leverage: '10×', category: 'stocks', sparkline: upCurve, logo: '/logos/aapl.png', logoColor: '#555', volume: '$2.1B', funding: '0.002%', oi: '$890M', isStock: true, high24h: 189.80, low24h: 185.20,
    about: 'Apple Inc. is the world\'s most valuable company, known for the iPhone, Mac, and services ecosystem. AAPL perpetuals allow 24/7 leveraged trading on Apple stock price movements.',
    news: [
      { headline: 'Apple Reports Record Services Revenue in Q1', source: 'CNBC', time: '2h ago' },
      { headline: 'iPhone Sales Beat Analyst Expectations', source: 'Bloomberg', time: '5h ago' },
      { headline: 'Apple Announces New AI Features at Developer Event', source: 'Reuters', time: '1d ago' },
    ],
  },
  {
    id: 'tsla-perp', name: 'Tesla', ticker: 'TSLA/USD', price: 245.30, priceDisplay: '$245.30', change: -3.2, leverage: '10×', category: 'stocks', sparkline: volatileDown, logo: '/logos/tsla.png', logoColor: '#CC0000', volume: '$1.8B', funding: '0.003%', oi: '$720M', isStock: true, high24h: 254.10, low24h: 242.50,
    about: 'Tesla Inc. is the world\'s leading electric vehicle manufacturer and clean energy company. TSLA perpetuals enable round-the-clock leveraged exposure to Tesla stock.',
    news: [
      { headline: 'Tesla Deliveries Surge 20% in Latest Quarter', source: 'Bloomberg', time: '3h ago' },
      { headline: 'New Tesla Model Breaks Pre-Order Records', source: 'CNBC', time: '6h ago' },
      { headline: 'Tesla Energy Division Revenue Doubles Year Over Year', source: 'Reuters', time: '1d ago' },
    ],
  },
  {
    id: 'nvda-perp', name: 'Nvidia', ticker: 'NVDA/USD', price: 875.40, priceDisplay: '$875.40', change: 4.1, leverage: '10×', category: 'stocks', sparkline: volatileUp, logo: '/logos/nvda.png', logoColor: '#76B900', volume: '$3.2B', funding: '0.002%', oi: '$1.1B', isStock: true, high24h: 892.30, low24h: 858.60,
    about: 'Nvidia is the dominant designer of GPUs powering AI, gaming, and data center workloads. NVDA perpetuals provide 24/7 leveraged access to the AI chip leader.',
    news: [
      { headline: 'Nvidia Data Center Revenue Exceeds $20B in Quarter', source: 'Bloomberg', time: '1h ago' },
      { headline: 'Next-Gen AI Chips Enter Mass Production', source: 'CNBC', time: '4h ago' },
      { headline: 'Nvidia Partners with Cloud Providers on AI Platform', source: 'Reuters', time: '10h ago' },
    ],
  },
  {
    id: 'msft-perp', name: 'Microsoft', ticker: 'MSFT/USD', price: 415.20, priceDisplay: '$415.20', change: 0.6, leverage: '10×', category: 'stocks', sparkline: upCurve, logo: '/logos/msft.png', logoColor: '#00A4EF', volume: '$1.5B', funding: '0.001%', oi: '$650M', isStock: true, high24h: 418.90, low24h: 412.10,
    about: 'Microsoft Corporation is a global technology leader in cloud computing, productivity software, and AI. MSFT perpetuals let traders speculate on Microsoft stock around the clock.',
    news: [
      { headline: 'Azure Cloud Revenue Grows 30% Year Over Year', source: 'Bloomberg', time: '2h ago' },
      { headline: 'Microsoft Copilot Reaches 100 Million Users', source: 'CNBC', time: '5h ago' },
      { headline: 'Microsoft Expands AI Partnership with OpenAI', source: 'Reuters', time: '1d ago' },
    ],
  },
];

export const mockPositions = [
  {
    id: 'pos-1',
    asset: 'BTC',
    ticker: 'BTC/USD',
    direction: 'Long',
    leverage: '10×',
    entryPrice: '$63,450.00',
    entryPriceNum: 63450,
    positionSize: '$1,000',
    pnl: '+$11.81',
    pnlPercent: '+2.36%',
    pnlPositive: true,
    healthPercent: 55,
    currentPrice: '$64,945.00',
    liquidationPrice: '$57,105.00',
    margin: '$100.00',
    holdingFeeRate: '0.01%',
    holdingFeePaid: '-$2.40',
    holdingFeePositive: false,
    holdingFeeHistory: [
      { date: 'Mar 18', amount: '-$0.85', positive: false },
      { date: 'Mar 17', amount: '-$0.82', positive: false },
      { date: 'Mar 16', amount: '-$0.73', positive: false },
    ],
    logo: '/logos/btc.png',
    logoColor: '#F7931A',
  },
  {
    id: 'pos-2',
    asset: 'AAPL',
    ticker: 'AAPL/USD',
    direction: 'Short',
    leverage: '5×',
    entryPrice: '$189.20',
    entryPriceNum: 189.20,
    positionSize: '$500',
    pnl: '-$5.20',
    pnlPercent: '-1.04%',
    pnlPositive: false,
    healthPercent: 74,
    currentPrice: '$187.50',
    liquidationPrice: '$208.12',
    margin: '$100.00',
    holdingFeeRate: '0.002%',
    holdingFeePaid: '+$1.15',
    holdingFeePositive: true,
    holdingFeeHistory: [
      { date: 'Mar 18', amount: '+$0.42', positive: true },
      { date: 'Mar 17', amount: '+$0.38', positive: true },
      { date: 'Mar 16', amount: '+$0.35', positive: true },
    ],
    logo: '/logos/aapl.png',
    logoColor: '#555',
  },
];

export const mockTransactions = [
  { id: 1, action: 'Bought ETH', amount: '$50.00', date: 'Mar 12, 2026', type: 'spot', status: 'completed', logo: '/logos/eth.png' },
  { id: 2, action: 'Sold SEI', amount: '$25.00', date: 'Mar 11, 2026', type: 'spot', status: 'completed', logo: '/logos/sei.png' },
  { id: 3, action: 'Opened BTC Long', amount: '$100.00', date: 'Mar 10, 2026', type: 'leverage', status: 'completed', logo: '/logos/btc.png' },
  { id: 4, action: 'Closed AAPL Short', amount: '+$14.20', date: 'Mar 9, 2026', type: 'leverage', status: 'completed', logo: '/logos/aapl.png' },
  { id: 5, action: 'Bought Bitcoin', amount: '$200.00', date: 'Mar 8, 2026', type: 'spot', status: 'completed', logo: '/logos/btc.png' },
  { id: 6, action: 'Opened ETH Short', amount: '$75.00', date: 'Mar 7, 2026', type: 'leverage', status: 'completed', logo: '/logos/eth.png' },
  { id: 7, action: 'Sold Ethereum', amount: '$30.00', date: 'Mar 5, 2026', type: 'spot', status: 'failed', logo: '/logos/eth.png' },
  { id: 8, action: 'Bought SEI', amount: '$15.00', date: 'Mar 4, 2026', type: 'spot', status: 'completed', logo: '/logos/sei.png' },
];

export const newsBanners = [
  {
    id: 'n1',
    headline: 'Bitcoin ETF Inflows Smash Records as Institutions Pour In',
    source: 'Bloomberg',
    time: '32m ago',
    category: 'BTC',
    accent: '#F7931A',
    bg: 'linear-gradient(135deg, rgba(247,147,26,0.12) 0%, rgba(247,147,26,0.03) 100%)',
    border: 'rgba(247,147,26,0.18)',
  },
  {
    id: 'n2',
    headline: 'Nvidia Surpasses $3T Market Cap on AI Chip Demand',
    source: 'CNBC',
    time: '1h ago',
    category: 'NVDA',
    accent: '#76B900',
    bg: 'linear-gradient(135deg, rgba(118,185,0,0.12) 0%, rgba(118,185,0,0.03) 100%)',
    border: 'rgba(118,185,0,0.18)',
  },
  {
    id: 'n3',
    headline: 'Fed Signals Rate Pause — Risk Assets Rally Across the Board',
    source: 'Reuters',
    time: '2h ago',
    category: 'Macro',
    accent: '#3B82F6',
    bg: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0.03) 100%)',
    border: 'rgba(59,130,246,0.18)',
  },
  {
    id: 'n4',
    headline: 'Sei Network Processes 1M Daily Txns, TVL Hits ATH',
    source: 'The Block',
    time: '3h ago',
    category: 'SEI',
    accent: '#E31B54',
    bg: 'linear-gradient(135deg, rgba(227,27,84,0.12) 0%, rgba(227,27,84,0.03) 100%)',
    border: 'rgba(227,27,84,0.18)',
  },
  {
    id: 'n5',
    headline: 'Tesla Unveils Next-Gen Robotaxi — Stock Jumps 8% After Hours',
    source: 'Bloomberg',
    time: '4h ago',
    category: 'TSLA',
    accent: '#CC0000',
    bg: 'linear-gradient(135deg, rgba(204,0,0,0.12) 0%, rgba(204,0,0,0.03) 100%)',
    border: 'rgba(204,0,0,0.18)',
  },
  {
    id: 'n6',
    headline: 'Ethereum Layer 2 Ecosystem Surpasses $40B in Total Value Locked',
    source: 'CoinDesk',
    time: '5h ago',
    category: 'ETH',
    accent: '#627EEA',
    bg: 'linear-gradient(135deg, rgba(98,126,234,0.12) 0%, rgba(98,126,234,0.03) 100%)',
    border: 'rgba(98,126,234,0.18)',
  },
];

// AI Market Pulse data — rich per-signal cards
export const aiMarketPulse = {
  perps: {
    signals: [
      {
        asset: 'BTC', ticker: 'BTC/USD', signal: 'Bullish', confidence: 82,
        logo: '/logos/btc.png', logoColor: '#F7931A', price: '$63,450', change: '+2.1%',
        thesis: 'ETF inflows broke monthly record. Whale wallets accumulating above $63K support. Holding fees neutral — no overcrowded longs.',
        factors: [
          { label: 'ETF Flows', value: '+$420M', positive: true },
          { label: 'Holding Fee', value: '0.01%', positive: true },
          { label: 'OI Change', value: '+8.2%', positive: true },
        ],
        updatedAt: '2 min ago',
      },
      {
        asset: 'NVDA', ticker: 'NVDA/USD', signal: 'Bullish', confidence: 78,
        logo: '/logos/nvda.png', logoColor: '#76B900', price: '$875.40', change: '+4.1%',
        thesis: 'AI capex cycle accelerating with Blackwell in mass production. Data center revenue exceeded $20B — pricing power intact.',
        factors: [
          { label: 'Revenue', value: '$20B+', positive: true },
          { label: 'Margins', value: '75%', positive: true },
          { label: 'Guidance', value: 'Beat', positive: true },
        ],
        updatedAt: '5 min ago',
      },
      {
        asset: 'ETH', ticker: 'ETH/USD', signal: 'Neutral', confidence: 55,
        logo: '/logos/eth.png', logoColor: '#627EEA', price: '$3,521', change: '-1.8%',
        thesis: 'L2 activity surging but fee burn declining. ETH/BTC ratio at multi-year lows. Waiting on Pectra upgrade catalyst.',
        factors: [
          { label: 'L2 TVL', value: '$40B', positive: true },
          { label: 'Fee Burn', value: '-22%', positive: false },
          { label: 'ETH/BTC', value: '0.055', positive: false },
        ],
        updatedAt: '8 min ago',
      },
      {
        asset: 'TSLA', ticker: 'TSLA/USD', signal: 'Bearish', confidence: 68,
        logo: '/logos/tsla.png', logoColor: '#CC0000', price: '$245.30', change: '-3.2%',
        thesis: 'Delivery growth strong at 20% but margins compressed to 17.4%. Robotaxi hype vs execution risk.',
        factors: [
          { label: 'Margins', value: '17.4%', positive: false },
          { label: 'Deliveries', value: '+20%', positive: true },
          { label: 'Competition', value: 'High', positive: false },
        ],
        updatedAt: '12 min ago',
      },
    ],
  },
  spot: {
    signals: [
      {
        asset: 'SEI', ticker: 'SEI', signal: 'Bullish', confidence: 85,
        logo: '/logos/sei.png', logoColor: '#E31B54', price: '$0.42', change: '+5.2%',
        thesis: 'Ecosystem TVL at ATH with new DEX launches driving volume. Sei v2 EVM upgrade on track for Q2.',
        factors: [
          { label: 'TVL', value: '$420M', positive: true },
          { label: 'Daily Txns', value: '1M+', positive: true },
          { label: 'Volume', value: '+180%', positive: true },
        ],
        updatedAt: '3 min ago',
      },
      {
        asset: 'BTC', ticker: 'BTC', signal: 'Bullish', confidence: 79,
        logo: '/logos/btc.png', logoColor: '#F7931A', price: '$63,450', change: '+2.1%',
        thesis: 'Post-halving supply dynamics tightening. Exchange reserves at 5-year low. Dominance holding above 52%.',
        factors: [
          { label: 'ETF Inflows', value: '+$420M', positive: true },
          { label: 'Exchange Rsv', value: '5yr Low', positive: true },
          { label: 'Dominance', value: '52%', positive: true },
        ],
        updatedAt: '5 min ago',
      },
      {
        asset: 'ETH', ticker: 'ETH', signal: 'Neutral', confidence: 52,
        logo: '/logos/eth.png', logoColor: '#627EEA', price: '$3,521', change: '-1.8%',
        thesis: 'Underperforming vs L1 peers this quarter. Consider rotating to high-beta L1s for upside potential.',
        factors: [
          { label: 'vs BTC', value: '-15%', positive: false },
          { label: 'Staking', value: '4.2%', positive: true },
          { label: 'L2 Fees', value: '-90%', positive: false },
        ],
        updatedAt: '10 min ago',
      },
    ],
  },
};

// Enriched asset detail data
export const assetInsights = {
  sei: {
    atAGlance: [
      'Sei v2 upgrade brings EVM compatibility — opens door to Ethereum dApps',
      'Daily transactions crossed 1M milestone, fastest-growing L1 by usage',
      'Holding fee suggests balanced positioning — no crowded trades',
    ],
    whatToWatch: [
      'EVM parallel execution launch timeline (expected Q2 2026)',
      'DEX volume trends — Sei\'s core use case and value driver',
      'Validator set growth as measure of network decentralization',
    ],
    keyStats: {
      high24h: '$0.44', low24h: '$0.39', ath: '$1.14', athDate: 'Mar 2024',
      rank: '#42', fullyDiluted: '$4.2B', totalSupply: '10B SEI',
    },
  },
  ethereum: {
    atAGlance: [
      'Layer 2 ecosystem crossed $40B TVL — ETH as settlement layer thesis strengthens',
      'Staking yield at 4.2% attracting institutional allocators',
      'EIP-4844 blobs reducing L2 costs by 90% — but ETH fee revenue declining',
    ],
    whatToWatch: [
      'L2 fee revenue as % of L1 revenue — key value accrual metric',
      'Pectra upgrade timeline and staking withdrawal queue',
      'ETH/BTC ratio at multi-year lows — reversion or structural shift?',
    ],
    keyStats: {
      high24h: '$3,580', low24h: '$3,450', ath: '$4,891', athDate: 'Nov 2021',
      rank: '#2', fullyDiluted: '$423B', totalSupply: '120.2M ETH',
    },
  },
  bitcoin: {
    atAGlance: [
      'ETF inflows broke monthly record — institutional demand accelerating',
      'Post-halving supply dynamics tightening, exchange reserves at 5-year low',
      'Dominance at 52% — risk appetite shifting toward BTC as macro hedge',
    ],
    whatToWatch: [
      'Fed rate decision impact on risk assets and dollar strength',
      'ETF flow sustainability — watch for first major redemption week',
      'Mining difficulty adjustment and hash rate recovery post-halving',
    ],
    keyStats: {
      high24h: '$64,200', low24h: '$62,800', ath: '$73,750', athDate: 'Mar 2024',
      rank: '#1', fullyDiluted: '$1.33T', totalSupply: '21M BTC',
    },
  },
};

export const perpsInsights = {
  'btc-perp': {
    atAGlance: [
      'Open interest at ATH with balanced long/short ratio — healthy market',
      'Holding fee neutral at 0.01% — no overcrowded directional bets',
      'ETF-driven spot buying creating persistent upward pressure',
    ],
    whatToWatch: [
      'Holding fee spikes above 0.05% would signal overheated longs',
      'CME futures basis as proxy for institutional sentiment',
      'Options max pain at $62K this Friday — magnet for price action',
    ],
  },
  'eth-perp': {
    atAGlance: [
      'Underperforming BTC by 15% this quarter — ETH/BTC at 0.055',
      'L2 activity surging but fee burn declining — value accrual debate ongoing',
      'Short interest rising — potential for short squeeze above $3,600',
    ],
    whatToWatch: [
      'ETH/BTC ratio break above 0.058 would signal rotation',
      'Blob fee market dynamics post-Dencun',
      'Staking unlock queue — potential sell pressure gauge',
    ],
  },
  'sei-perp': {
    atAGlance: [
      'Sei TVL hit ATH at $420M — fastest growing L1 ecosystem',
      'Perpetual volume up 280% month-over-month on SEI/USD pair',
      'Low holding fee (0.012%) with positive trend — room to run',
    ],
    whatToWatch: [
      'Sei v2 EVM launch could be catalyst for major re-rating',
      'DEX aggregator integrations expanding addressable market',
      'Watch for profit-taking if price approaches previous ATH at $1.14',
    ],
  },
  'sol-perp': {
    atAGlance: [
      'Solana DeFi TVL climbed past $8B — second only to Ethereum',
      'Network processing 65K TPS consistently — reliability improving',
      'Strong retail engagement via Jupiter and Raydium DEXs',
    ],
    whatToWatch: [
      'Firedancer client launch — potential 10x throughput improvement',
      'SOL staking rate vs DeFi yield competition for capital',
      'Solana phone Chapter 2 launch impact on ecosystem growth',
    ],
  },
  'aapl-perp': {
    atAGlance: [
      'Services revenue hit $24B — growing 15% YoY, highest-margin segment',
      'iPhone 16 cycle beating expectations in China market',
      'AI features integration driving upgrade cycle acceleration',
    ],
    whatToWatch: [
      'Q2 earnings on April 24 — consensus EPS $1.62',
      'India manufacturing scale-up progress',
      'Vision Pro enterprise adoption metrics',
    ],
    analystConsensus: { buy: 28, hold: 8, sell: 2, avgTarget: '$205', upside: '+9.3%' },
    epsHistory: [
      { quarter: 'Q4 24', expected: 2.35, actual: 2.40, beat: true },
      { quarter: 'Q1 25', expected: 1.58, actual: 1.65, beat: true },
      { quarter: 'Q2 25', expected: 1.42, actual: 1.38, beat: false },
      { quarter: 'Q3 25', expected: 1.55, actual: 1.61, beat: true },
    ],
  },
  'tsla-perp': {
    atAGlance: [
      'Deliveries surged 20% but margins compressed to 17.4%',
      'Robotaxi reveal drove 8% after-hours jump — execution risk remains',
      'Energy division doubling YoY — becoming meaningful revenue driver',
    ],
    whatToWatch: [
      'FSD v13 wide release timeline — key catalyst for valuation',
      'China market share trends vs BYD and NIO',
      'Energy storage backlog and megapack production ramp',
    ],
    analystConsensus: { buy: 18, hold: 15, sell: 12, avgTarget: '$265', upside: '+8.0%' },
    epsHistory: [
      { quarter: 'Q4 24', expected: 0.82, actual: 0.71, beat: false },
      { quarter: 'Q1 25', expected: 0.68, actual: 0.73, beat: true },
      { quarter: 'Q2 25', expected: 0.75, actual: 0.69, beat: false },
      { quarter: 'Q3 25', expected: 0.80, actual: 0.85, beat: true },
    ],
  },
  'nvda-perp': {
    atAGlance: [
      'Data center revenue exceeded $20B in quarter — AI demand insatiable',
      'Blackwell chips in mass production — supply constraints easing',
      'Gross margins at 75% — pricing power intact despite competition',
    ],
    whatToWatch: [
      'Blackwell ramp trajectory — key driver of next earnings beat',
      'China export restriction impact on revenue guidance',
      'AMD MI300X competitive threat assessment',
    ],
    analystConsensus: { buy: 42, hold: 5, sell: 1, avgTarget: '$950', upside: '+8.5%' },
    epsHistory: [
      { quarter: 'Q4 24', expected: 4.60, actual: 5.16, beat: true },
      { quarter: 'Q1 25', expected: 5.50, actual: 6.12, beat: true },
      { quarter: 'Q2 25', expected: 6.08, actual: 6.75, beat: true },
      { quarter: 'Q3 25', expected: 7.00, actual: 7.42, beat: true },
    ],
  },
  'msft-perp': {
    atAGlance: [
      'Azure revenue growing 30% YoY — AI services driving acceleration',
      'Copilot reached 100M users — monetization inflection approaching',
      'Gaming division stable after Activision integration',
    ],
    whatToWatch: [
      'Azure AI capacity constraints — can they keep up with demand?',
      'Copilot enterprise pricing and adoption rate',
      'OpenAI partnership economics and competition dynamics',
    ],
    analystConsensus: { buy: 38, hold: 6, sell: 0, avgTarget: '$460', upside: '+10.8%' },
    epsHistory: [
      { quarter: 'Q4 24', expected: 2.82, actual: 2.95, beat: true },
      { quarter: 'Q1 25', expected: 3.10, actual: 3.23, beat: true },
      { quarter: 'Q2 25', expected: 3.18, actual: 3.30, beat: true },
      { quarter: 'Q3 25', expected: 3.25, actual: 3.40, beat: true },
    ],
  },
};

// Chart data generators for different time ranges
export function generateChartData(trend = 'up', points = 50) {
  const data = [];
  let base = trend === 'up' ? 100 : 150;
  for (let i = 0; i < points; i++) {
    const noise = (Math.random() - 0.5) * 8;
    const trendDir = trend === 'up' ? 0.5 : -0.3;
    base += trendDir + noise;
    base = Math.max(50, Math.min(200, base));
    data.push({ x: i, y: Math.round(base * 100) / 100 });
  }
  return data;
}
