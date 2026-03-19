import { useId, useState, useEffect } from 'react';

export default function Sparkline({ data, positive = true, width = 100, height = 40 }) {
  if (!data || data.length === 0) return null;

  const id = useId();
  const color = positive ? '#7BF179' : '#FF4757';
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const coords = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 4) - 2;
    return [x, y];
  });

  const points = coords.map(([x, y]) => `${x},${y}`).join(' ');

  const fillPoints = [
    ...coords.map(([x, y]) => `${x},${y}`),
    `${width},${height}`,
    `0,${height}`,
  ].join(' ');

  const gradientId = `spark-grad-${id}`;
  const glowId = `spark-glow-${id}`;
  const clipId = `spark-clip-${id}`;

  // Animate the clip-path reveal
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame;
    const start = performance.now();
    const duration = 600;
    const animate = (now) => {
      const t = Math.min((now - start) / duration, 1);
      // ease out cubic
      setProgress(1 - Math.pow(1 - t, 3));
      if (t < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
        <filter id={glowId}>
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id={clipId}>
          <rect x="0" y="0" width={width * progress} height={height} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <polygon
          points={fillPoints}
          fill={`url(#${gradientId})`}
        />
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${glowId})`}
        />
      </g>
    </svg>
  );
}
