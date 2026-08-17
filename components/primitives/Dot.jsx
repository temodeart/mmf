import React from 'react';

const COLORS = {
  new:    'var(--green)',
  active: 'var(--amber)',
  sell:   'var(--neg)',
  buy:    'var(--blue)',
  info:   'var(--indigo)',
  pos:    'var(--pos)',
  neg:    'var(--neg)',
};

/**
 * Dot — colored status dot, paired with a label to carry meaning.
 * Pass a semantic tone key or an explicit color.
 */
export function Dot({ tone, color, size = 7 }) {
  const c = color || COLORS[tone] || 'var(--muted)';
  return (
    <span style={{ display: 'inline-block', width: size, height: size, borderRadius: 999, background: c, flexShrink: 0 }} />
  );
}
