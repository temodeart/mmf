import React from 'react';

/**
 * SegmentedControl — the single source of Buy/Sell semantics. With
 * semantic="buy-sell", the "buy" segment goes --pos and "sell" goes --neg,
 * and that intent should propagate to the ticket CTA. Otherwise indigo.
 */
export function SegmentedControl({ options, value, onChange, semantic }) {
  const isBuySell = semantic === 'buy-sell';
  return (
    <div style={{ display: 'inline-flex', background: 'var(--field-bg)', border: '1px solid var(--line)', borderRadius: 14, padding: 4, gap: 4 }}>
      {options.map(opt => {
        const active = opt.value === value;
        let activeBg = 'var(--indigo)', activeShadow = '0 6px 16px -8px rgba(79,70,229,.6)';
        if (isBuySell && opt.value === 'buy')  { activeBg = 'var(--pos)'; activeShadow = '0 6px 16px -8px rgba(14,159,110,.6)'; }
        if (isBuySell && opt.value === 'sell') { activeBg = 'var(--neg)'; activeShadow = '0 6px 16px -8px rgba(220,38,38,.6)'; }
        return (
          <button key={opt.value} onClick={() => onChange(opt.value)} style={{
            height: 38, padding: '0 18px', border: 'none', borderRadius: 10,
            background: active ? activeBg : 'transparent', color: active ? '#fff' : 'var(--muted)',
            fontSize: 13.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            boxShadow: active ? activeShadow : 'none', display: 'flex', alignItems: 'center', gap: 8, transition: 'all .15s',
          }}>
            {isBuySell && <span style={{ width: 8, height: 8, borderRadius: 999, background: 'currentColor', opacity: active ? 1 : 0.6 }} />}
            {opt.label}
            {opt.count != null && <span style={{ fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 999, background: active ? 'rgba(255,255,255,.22)' : 'var(--line-2)', color: active ? '#fff' : 'var(--muted)' }}>{opt.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
