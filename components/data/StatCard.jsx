import React from 'react';

function Spark({ data, color }) {
  if (!data || data.length < 2) {
    return <div style={{ fontSize: 11, color: 'var(--muted-2)', fontWeight: 600, alignSelf: 'center', whiteSpace: 'nowrap' }}>Датагүй</div>;
  }
  const w = 80, h = 44, min = Math.min(...data), max = Math.max(...data), rng = max - min || 1;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - 4 - ((v - min) / rng) * (h - 8)]);
  const d = 'M' + pts.map(p => p.join(',')).join(' L');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <path d={d + ` L${w},${h} L0,${h} Z`} fill={color} opacity={0.1} />
      <path d={d} stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * StatCard — eyebrow label → big mono value → signed delta → optional
 * sparkline. Empty renders ₮0 / Датагүй with no fake delta; loading shimmers.
 */
export function StatCard({ label, value, delta, deltaPositive, trend, loading, heroValue }) {
  if (loading) {
    return (
      <div style={{ background: 'var(--surface)', border: '1px solid var(--line-2)', borderRadius: 20, padding: 20 }}>
        <div className="skeleton" style={{ height: 14, borderRadius: 4, width: '55%', marginBottom: 14 }} />
        <div className="skeleton" style={{ height: 32, borderRadius: 4, width: '72%' }} />
      </div>
    );
  }
  const dc = deltaPositive ? 'var(--pos)' : 'var(--neg)';
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--line-2)', borderRadius: 20, padding: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 12 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontSize: heroValue ? 32 : 26, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', lineHeight: 1.1, fontFamily: "'JetBrains Mono', monospace" }}>{value ?? '—'}</div>
          {delta != null && (
            <div style={{ fontSize: 12.5, fontWeight: 700, color: dc, marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 10 }}>{deltaPositive ? '▲' : '▼'}</span>{delta}
            </div>
          )}
        </div>
        {trend != null && <Spark data={trend} color={dc} />}
      </div>
    </div>
  );
}
