import React from 'react';

/**
 * Sparkline — tiny trend line for StatCards. < 2 points renders a dashed
 * "no data" baseline. Color by delta sign (--pos / --neg).
 */
export function Sparkline({ data = [], color = 'var(--pos)', width = 100, height = 36 }) {
  if (!data || data.length < 2) {
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
        <line x1={0} y1={height / 2} x2={width} y2={height / 2} stroke="var(--line)" strokeWidth={1.5} strokeDasharray="4 3" />
      </svg>
    );
  }
  const min = Math.min(...data), max = Math.max(...data), rng = max - min || 1;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * width, height - 4 - ((v - min) / rng) * (height - 8)]);
  const d = 'M' + pts.map(p => p.join(',')).join(' L');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      <path d={d + ` L${width},${height} L0,${height} Z`} fill={color} opacity={0.1} />
      <path d={d} stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
