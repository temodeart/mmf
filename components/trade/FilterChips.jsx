import React from 'react';

/**
 * FilterChips — single-select pill row (e.g. instrument type filters). Active
 * chip goes solid ink; an optional per-option color dot aids scanning.
 */
export function FilterChips({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      {options.map(opt => {
        const active = opt.value === value;
        return (
          <button key={opt.value} onClick={() => onChange(opt.value)} style={{
            height: 36, padding: '0 14px', borderRadius: 999,
            border: `1px solid ${active ? 'var(--ink)' : 'var(--line)'}`,
            background: active ? 'var(--ink)' : 'var(--surface)', color: active ? '#fff' : 'var(--text)',
            fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all .15s',
          }}>
            {opt.color && <span style={{ width: 8, height: 8, borderRadius: 999, background: active ? 'rgba(255,255,255,.7)' : opt.color }} />}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
