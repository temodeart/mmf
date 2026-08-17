import React from 'react';

/**
 * PageHeader — navy H1 + optional subtitle on the left, an actions slot on the
 * right. Sits at the top of a content view, above the cards/tables.
 */
export function PageHeader({ title, subtitle, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 22, flexWrap: 'wrap' }}>
      <div>
        <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--navy)', margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ margin: '8px 0 0', fontSize: 13.5, fontWeight: 600, color: 'var(--muted)' }}>{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}
