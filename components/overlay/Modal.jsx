import React from 'react';

/**
 * Modal — centered dialog + scrim. Header carries an optional logo/letter-mark,
 * title and mono ticker, plus a close button; a sticky footer holds the CTA.
 * Clicking the scrim closes it. This is the single order-confirmation dialog.
 */
export function Modal({ open, onClose, logo, logoColor, title, ticker, children, footer }) {
  if (!open) return null;
  return (
    <div onClick={e => e.target === e.currentTarget && onClose?.()} style={{ position: 'fixed', inset: 0, background: 'rgba(8,11,25,.5)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: 24 }}>
      <div style={{ width: 480, maxWidth: '100%', maxHeight: '92vh', overflow: 'auto', background: 'var(--surface)', borderRadius: 24, boxShadow: '0 24px 60px -16px rgba(15,20,55,.28)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '22px 24px', borderBottom: '1px solid var(--line-2)', display: 'flex', alignItems: 'center', gap: 13, position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 2, flexShrink: 0 }}>
          {logo && <div style={{ width: 46, height: 46, borderRadius: 12, background: logoColor || 'var(--indigo)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 15, flexShrink: 0 }}>{logo}</div>}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--ink)' }}>{title}</div>
            {ticker && <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted-2)', marginTop: 3, fontFamily: "'JetBrains Mono', monospace" }}>{ticker}</div>}
          </div>
          <button onClick={onClose} style={{ width: 38, height: 38, borderRadius: 10, border: '1px solid var(--line)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div style={{ padding: '20px 24px 4px', flex: 1 }}>{children}</div>
        {footer && <div style={{ padding: '8px 24px 24px', position: 'sticky', bottom: 0, background: 'var(--surface)' }}>{footer}</div>}
      </div>
    </div>
  );
}
