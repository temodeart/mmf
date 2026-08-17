import React, { useState } from 'react';

/**
 * TextInput — 52px labeled field. Focus lifts the fill to white and adds the
 * indigo ring; error swaps the border/message to --neg. `mono` renders the
 * value in JetBrains Mono w/ tabular figures (money, quantities, codes).
 */
export function TextInput({
  label, value, onChange, placeholder,
  error, hint, disabled = false,
  type = 'text', mono = false, prefix,
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      {label && (
        <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text)', marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
          <span>{label}</span>
          {hint && <span style={{ color: 'var(--muted)', fontWeight: 600 }}>{hint}</span>}
        </div>
      )}
      <div style={{
        height: 52, borderRadius: 14, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10,
        background: focused ? 'var(--surface)' : 'var(--field-bg)',
        border: `1.5px solid ${error ? 'var(--neg)' : focused ? 'var(--indigo)' : 'var(--line)'}`,
        boxShadow: focused && !error ? '0 0 0 4px var(--indigo-soft)' : 'none',
        opacity: disabled ? 0.5 : 1, transition: 'border-color .15s, box-shadow .15s',
      }}>
        {prefix && <span style={{ color: 'var(--muted)', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>{prefix}</span>}
        <input
          type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            flex: 1, border: 'none', background: 'transparent', outline: 'none',
            fontSize: 15, fontWeight: 500, color: 'var(--ink)',
            fontFamily: mono ? "'JetBrains Mono', monospace" : 'inherit',
            fontVariantNumeric: mono ? 'tabular-nums' : 'normal',
          }}
        />
      </div>
      {error && <div style={{ fontSize: 12, color: 'var(--neg)', fontWeight: 600, marginTop: 6 }}>{error}</div>}
    </div>
  );
}
