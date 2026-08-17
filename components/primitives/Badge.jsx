import React from 'react';

const TONES = {
  new:     { fg: 'var(--green)',  bg: 'var(--green-soft)' },
  active:  { fg: 'var(--amber)',  bg: 'var(--amber-soft)' },
  pending: { fg: 'var(--amber)',  bg: 'var(--amber-soft)' },
  sell:    { fg: 'var(--neg)',    bg: 'var(--neg-soft)' },
  buy:     { fg: 'var(--blue)',   bg: 'var(--blue-soft)' },
  info:    { fg: 'var(--indigo)', bg: 'var(--indigo-soft)' },
  default: { fg: 'var(--muted)',  bg: 'var(--line-2)' },
};

/**
 * Badge — status & type chip. Always a colored dot + label inside a
 * soft-tinted pill; never color-only. One tone per meaning.
 */
export function Badge({ tone = 'default', size = 'sm', children }) {
  const m = TONES[tone] || TONES.default;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: size === 'md' ? '4px 10px' : '3px 8px', borderRadius: 999,
      background: m.bg, color: m.fg, fontSize: size === 'md' ? 11.5 : 10.5,
      fontWeight: 700, letterSpacing: '.01em', whiteSpace: 'nowrap', flexShrink: 0,
    }}>
      <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: 999, background: m.fg, flexShrink: 0 }} />
      {children}
    </span>
  );
}
