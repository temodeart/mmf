import React from 'react';

function Pager({ page, total, perPage, onChange }) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;
  const vis = Array.from({ length: pages }, (_, i) => i + 1).filter(p => p === 1 || p === pages || Math.abs(p - page) <= 1);
  const items = []; vis.forEach((p, i) => { if (i > 0 && vis[i] - vis[i - 1] > 1) items.push('…'); items.push(p); });
  const Btn = ({ lbl, active, off, go }) => (
    <button onClick={off ? undefined : go} style={{ minWidth: 36, height: 36, padding: '0 10px', borderRadius: 10, border: `1px solid ${active ? 'var(--indigo)' : 'var(--line)'}`, background: active ? 'var(--indigo)' : 'var(--surface)', color: active ? '#fff' : 'var(--muted)', fontWeight: 700, fontSize: 13, cursor: off ? 'default' : 'pointer', opacity: off ? 0.4 : 1, fontFamily: 'inherit' }}>{lbl}</button>
  );
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <Btn lbl="‹" off={page <= 1} go={() => onChange(page - 1)} />
      {items.map((p, i) => p === '…' ? <span key={`e${i}`} style={{ color: 'var(--muted)', fontSize: 13, padding: '0 4px' }}>…</span> : <Btn key={p} lbl={p} active={p === page} go={() => onChange(p)} />)}
      <Btn lbl="›" off={page >= pages} go={() => onChange(page + 1)} />
    </div>
  );
}

/**
 * DataTable — the core data surface. Sticky header, sortable columns, whole-row
 * hover/click/selection, and all four states (loading / empty / error /
 * populated). Numeric columns should set `align:'right'` and `mono:true`.
 */
export function DataTable({
  columns, rows, loading, error,
  emptyTitle, emptyBody, emptyAction,
  onRowClick, selected, sortBy, sortDir = 'desc', onSort,
  page = 1, perPage = 10, total, onPageChange, title, action,
}) {
  const Th = col => (
    <th key={col.key} onClick={col.sortable && onSort ? () => onSort(col.key) : undefined} style={{
      textAlign: col.align === 'right' ? 'right' : 'left', fontSize: 11, fontWeight: 700, letterSpacing: '.06em',
      color: 'var(--muted)', textTransform: 'uppercase', padding: '13px 16px', background: 'var(--field-bg)',
      borderBottom: '1px solid var(--line-2)', userSelect: 'none', cursor: col.sortable ? 'pointer' : 'default', width: col.width || 'auto',
    }}>
      {col.label}
      {col.sortable && <span style={{ marginLeft: 4, opacity: sortBy === col.key ? 0.7 : 0.3 }}>{sortBy === col.key ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}</span>}
    </th>
  );

  const Body = () => {
    if (loading) return (
      <tbody>
        {[0, 1, 2, 3, 4].map(i => (
          <tr key={i} style={{ borderBottom: '1px solid var(--line-2)' }}>
            {columns.map((col, j) => <td key={col.key} style={{ padding: '14px 16px' }}><div className="skeleton" style={{ height: 14, borderRadius: 4, width: j === 0 ? '68%' : '50%' }} /></td>)}
          </tr>
        ))}
      </tbody>
    );
    if (error) return (
      <tbody><tr><td colSpan={columns.length} style={{ padding: 16 }}>
        <div style={{ display: 'flex', gap: 12, padding: 16, borderRadius: 12, background: 'var(--neg-soft)', border: '1px solid var(--neg-border)', alignItems: 'flex-start' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--neg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="1.8" fill="none" /><path d="M12 8v5M12 16.5v.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" /></svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--neg)' }}>{error.title || 'Алдаа гарлаа'}</div>
            {error.body && <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', lineHeight: 1.5, marginTop: 2 }}>{error.body}</div>}
            {error.action && <button onClick={error.action.onClick} style={{ marginTop: 10, fontSize: 12.5, fontWeight: 700, color: 'var(--neg)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline', fontFamily: 'inherit' }}>{error.action.label}</button>}
          </div>
        </div>
      </td></tr></tbody>
    );
    if (!rows || rows.length === 0) return (
      <tbody><tr><td colSpan={columns.length} style={{ padding: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '48px 24px', gap: 12 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em' }}>{emptyTitle || 'Өгөгдөл олдсонгүй'}</div>
          {emptyBody && <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--muted)', lineHeight: 1.55, maxWidth: 300 }}>{emptyBody}</div>}
          {emptyAction && <button onClick={emptyAction.onClick} style={{ marginTop: 4, height: 36, padding: '0 16px', borderRadius: 10, border: 'none', background: 'var(--indigo)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>{emptyAction.label}</button>}
        </div>
      </td></tr></tbody>
    );
    return (
      <tbody>
        {rows.map(row => (
          <tr key={row.id} onClick={() => onRowClick?.(row)} style={{ borderBottom: '1px solid var(--line-2)', background: selected === row.id ? 'var(--indigo-soft)' : 'transparent', cursor: onRowClick ? 'pointer' : 'default', transition: 'background .12s' }}>
            {columns.map(col => (
              <td key={col.key} style={{ padding: '14px 16px', fontSize: 13.5, fontWeight: 600, color: 'var(--text)', textAlign: col.align === 'right' ? 'right' : 'left', fontVariantNumeric: col.mono ? 'tabular-nums' : 'normal', fontFamily: col.mono ? "'JetBrains Mono', monospace" : 'inherit' }}>
                {col.render ? col.render(row) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  };

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--line-2)', borderRadius: 20, overflow: 'hidden' }}>
      {(title || action) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--line-2)' }}>
          {title && <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.01em' }}>{title}</div>}
          {action}
        </div>
      )}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>{columns.map(Th)}</tr></thead>
          <Body />
        </table>
      </div>
      {total > 0 && !loading && onPageChange && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderTop: '1px solid var(--line-2)' }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>Нийт <b style={{ color: 'var(--text)' }}>{total}</b> · {((page - 1) * perPage) + 1}–{Math.min(page * perPage, total)}</div>
          <Pager page={page} total={total} perPage={perPage} onChange={onPageChange} />
        </div>
      )}
    </div>
  );
}
