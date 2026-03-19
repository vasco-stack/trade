export default function ModeToggle({ mode, onToggle }) {
  const accentColor = mode === 'perps' ? '#00D4FF' : '#7BF179';

  return (
    <div
      className="flex rounded-full p-0.5"
      style={{
        background: 'rgba(255,255,255,0.06)',
        border: `1px solid ${mode === 'perps' ? 'rgba(0,212,255,0.12)' : 'rgba(123,241,121,0.12)'}`,
        transition: 'border-color 0.4s ease',
      }}
    >
      {['perps', 'spot'].map((m) => {
        const isActive = mode === m;
        const pillColor = m === 'perps' ? '#00D4FF' : '#7BF179';
        return (
          <button
            key={m}
            onClick={() => onToggle(m)}
            className="flex-1 py-1.5 rounded-full"
            style={{
              fontFamily: "'Google Sans Flex', sans-serif",
              fontWeight: 500,
              fontSize: 12,
              color: isActive ? '#000' : 'rgba(255,255,255,0.4)',
              background: isActive ? pillColor : 'transparent',
              transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {m === 'perps' ? 'Leverage' : 'Spot'}
          </button>
        );
      })}
    </div>
  );
}
