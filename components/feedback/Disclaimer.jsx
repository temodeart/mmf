import React from 'react';

/**
 * Disclaimer — the required regulatory (СЗХ) risk notice. Amber warning
 * surface + triangle glyph. Every instrument-detail surface must show one.
 */
export function Disclaimer({ children }) {
  return (
    <div style={{ display: 'flex', gap: 11, padding: '13px 15px', borderRadius: 13, background: 'var(--warn-surface)', border: '1px solid var(--warn-border)', alignItems: 'flex-start' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
        <path d="M12 3l9 16H3l9-16z" stroke="var(--warn)" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M12 10v4M12 16.5v.5" stroke="var(--warn)" strokeWidth="1.9" strokeLinecap="round" />
      </svg>
      <p style={{ margin: 0, fontSize: 11.5, fontWeight: 600, color: '#8A6516', lineHeight: 1.5 }}>{children}</p>
    </div>
  );
}
