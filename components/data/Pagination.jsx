import React from 'react';

/**
 * Pagination — prev / numbered pages / next. Targets are >=36px. Renders
 * nothing when there is a single page. Collapses long runs with an ellipsis.
 */
export function Pagination({ page, total, perPage = 10, onChange }) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;
  const vis = Array.from({ length: pages }, (_, i) => i + 1).filter(p => p === 1 || p === pages || Math.abs(p - page) <= 1);
  const items = [];
  vis.forEach((p, i) => { if (i > 0 && vis[i] - vis[i - 1] > 1) items.push('…'); items.push(p); });

  const Btn = ({ lbl, active, off, go }) => (
    <button onClick={off ? undefined : go} style={{
      minWidth: 36, height: 36, padding: '0 10px', borderRadius: 10,
      border: `1px solid ${active ? 'var(--indigo)' : 'var(--line)'}`,
      background: active ? 'var(--indigo)' : 'var(--surface)', color: active ? '#fff' : 'var(--muted)',
      fontWeight: 700, fontSize: 13, cursor: off ? 'default' : 'pointer', opacity: off ? 0.4 : 1, fontFamily: 'inherit',
    }}>{lbl}</button>
  );

  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <Btn lbl="‹" off={page <= 1} go={() => onChange(page - 1)} />
      {items.map((p, i) => p === '…'
        ? <span key={`e${i}`} style={{ color: 'var(--muted)', fontSize: 13, padding: '0 4px' }}>…</span>
        : <Btn key={p} lbl={p} active={p === page} go={() => onChange(p)} />)}
      <Btn lbl="›" off={page >= pages} go={() => onChange(page + 1)} />
    </div>
  );
}
