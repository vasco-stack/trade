export function HomeIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#7BF179' : '#6B6B6B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={active ? { filter: 'drop-shadow(0 0 6px rgba(123,241,121,0.5))' } : undefined}>
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

export function TradeIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#7BF179' : '#6B6B6B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={active ? { filter: 'drop-shadow(0 0 6px rgba(123,241,121,0.5))' } : undefined}>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

export function AppsIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#7BF179' : '#6B6B6B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={active ? { filter: 'drop-shadow(0 0 6px rgba(123,241,121,0.5))' } : undefined}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

export function WalletIcon({ active }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#7BF179' : '#6B6B6B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={active ? { filter: 'drop-shadow(0 0 6px rgba(123,241,121,0.5))' } : undefined}>
      <rect x="2" y="5" width="20" height="15" rx="2" />
      <path d="M16 12h.01" />
      <path d="M2 10h20" />
    </svg>
  );
}

export function ClockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function BackArrow() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

export function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B6B6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function SwapArrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </svg>
  );
}

export function CheckIcon({ size = 48, color = '#7BF179' }) {
  const glowColor = color === '#7BF179'
    ? 'drop-shadow(0 0 8px rgba(123,241,121,0.5)) drop-shadow(0 0 20px rgba(123,241,121,0.2))'
    : 'drop-shadow(0 0 8px rgba(255,71,87,0.5)) drop-shadow(0 0 20px rgba(255,71,87,0.2))';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: glowColor }}>
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

export function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B6B6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function WarningIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF4757" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export function Spinner({ color = '#7BF179', size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite', filter: `drop-shadow(0 0 6px ${color}40)` }}>
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="3" fill="none" strokeDasharray="31.4 31.4" strokeLinecap="round" />
    </svg>
  );
}

export function AssetLogo({ logo, color, size = 40 }) {
  const isImage = logo && (logo.startsWith('/') || logo.startsWith('http'));
  return (
    <div
      className="flex items-center justify-center rounded-full shrink-0 overflow-hidden"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.45,
        color: color,
        fontWeight: 500,
        fontFamily: "'Google Sans Flex', sans-serif",
      }}
    >
      {isImage ? (
        <img src={logo} alt="" style={{ width: size, height: size, objectFit: 'cover' }} />
      ) : (
        logo
      )}
    </div>
  );
}
