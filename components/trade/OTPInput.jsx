import React, { useState, useRef } from 'react';

/**
 * OTPInput — one-box-per-digit code entry. Auto-advances on input, backspaces
 * to the previous box, and fires onComplete when every box is filled.
 */
export function OTPInput({ length = 6, onComplete }) {
  const [vals, setVals] = useState(Array(length).fill(''));
  const refs = useRef([]);
  const update = (i, v) => {
    const next = [...vals]; next[i] = v.replace(/\D/g, '').slice(0, 1); setVals(next);
    if (next[i] && i < length - 1) refs.current[i + 1]?.focus();
    if (next.every(c => c)) onComplete?.(next.join(''));
  };
  const onKey = (i, e) => { if (e.key === 'Backspace' && !vals[i] && i > 0) refs.current[i - 1]?.focus(); };
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      {vals.map((v, i) => (
        <input
          key={i} ref={el => (refs.current[i] = el)} maxLength={1} value={v} inputMode="numeric"
          onChange={e => update(i, e.target.value)} onKeyDown={e => onKey(i, e)}
          style={{
            flex: 1, height: 54, border: `1.5px solid ${v ? 'var(--indigo)' : 'var(--line)'}`, borderRadius: 13,
            background: v ? 'var(--surface)' : 'var(--field-bg)', textAlign: 'center',
            fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 700, color: 'var(--ink)',
            outline: 'none', boxShadow: v ? '0 0 0 4px var(--indigo-soft)' : 'none', transition: 'all .15s',
          }}
        />
      ))}
    </div>
  );
}
