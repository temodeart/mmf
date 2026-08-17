import React from 'react';

/**
 * EmptyState — mark + one human line + a primary action. Reused by tables,
 * charts and lists; each surface passes its own Mongolian copy.
 */
export function EmptyState({ icon, title, body, action }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '48px 24px', gap: 12 }}>
      {icon && (
        <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--line-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
          {icon}
        </div>
      )}
      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em' }}>{title}</div>
      {body && <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--muted)', lineHeight: 1.55, maxWidth: 300 }}>{body}</div>}
      {action && (
        <button onClick={action.onClick} style={{ marginTop: 4, height: 36, padding: '0 16px', borderRadius: 10, border: 'none', background: 'var(--indigo)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          {action.label}
        </button>
      )}
    </div>
  );
}
