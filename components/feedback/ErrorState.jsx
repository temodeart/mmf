import React from 'react';

const GLYPHS = {
  neg:  <><circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="1.8" fill="none" /><path d="M12 8v5M12 16.5v.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" /></>,
  warn: <><path d="M12 3l9 16H3l9-16z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" fill="none" /><path d="M12 10v4M12 17h.01" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" /></>,
  info: <><circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="1.8" fill="none" /><path d="M12 8v.01M12 11v5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" /></>,
};
const TONES = {
  neg:  { bg: 'var(--neg-soft)',   bdr: 'var(--neg-border)',   ic: 'var(--neg)',   tx: 'var(--neg)' },
  warn: { bg: 'var(--warn-surface)', bdr: 'var(--warn-border)', ic: 'var(--warn)', tx: 'var(--warn)' },
  info: { bg: 'var(--indigo-soft)', bdr: 'var(--indigo-border)', ic: 'var(--indigo)', tx: 'var(--indigo)' },
};

/**
 * ErrorState — inline alert. variant neg | warn | info sets glyph + tone.
 * Always pair a cause with a retry / next action.
 */
export function ErrorState({ variant = 'neg', title, body, action }) {
  const C = TONES[variant] || TONES.neg;
  return (
    <div style={{ display: 'flex', gap: 12, padding: 16, borderRadius: 12, background: C.bg, border: `1px solid ${C.bdr}`, alignItems: 'flex-start' }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: C.ic, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">{GLYPHS[variant]}</svg>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.tx }}>{title}</div>
        {body && <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', lineHeight: 1.5, marginTop: 2 }}>{body}</div>}
        {action && (
          <button onClick={action.onClick} style={{ marginTop: 10, fontSize: 12.5, fontWeight: 700, color: C.tx, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline', fontFamily: 'inherit' }}>
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}
