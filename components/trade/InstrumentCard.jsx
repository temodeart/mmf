import React from 'react';

const fmt = n => '₮\u00A0' + Math.abs(Math.round(n || 0)).toLocaleString('en-US');
const initials = s => s.replace('ББСБ', '').replace('банк', '').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
const TYPE = {
  cd:    { label: 'Хадгаламжийн сертификат', c1: '#2D6BFF', c2: '#4F46E5' },
  trust: { label: 'Итгэлцэл',                c1: '#4F46E5', c2: '#7C3AED' },
  inv:   { label: 'Нэхэмжлэх',               c1: '#0E9F6E', c2: '#0891B2' },
  cp:    { label: 'Арилжааны бичиг',          c1: '#FF6B2C', c2: '#DC2626' },
};

/**
 * InstrumentCard — primary-market product card. Rate is the hero (large mono
 * %); issuer letter-mark, spec rows, availability meter, and an Авах CTA.
 * Selected state adds an indigo outline + ring.
 */
export function InstrumentCard({ data, selected, onSelect, onBuy }) {
  const tp = TYPE[data.type] || TYPE.trust;
  const pct = data.total > 0 ? Math.round(data.avail / data.total * 100) : 0;
  return (
    <div onClick={onSelect} style={{ background: 'var(--surface)', border: `1.5px solid ${selected ? 'var(--indigo)' : 'var(--line-2)'}`, borderRadius: 20, padding: 20, cursor: 'pointer', boxShadow: selected ? '0 0 0 3px var(--indigo-soft)' : 'none', transition: 'border-color .15s, box-shadow .15s' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: `linear-gradient(135deg,${tp.c1},${tp.c2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 16 }}>{initials(data.bank)}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.01em', lineHeight: 1.25 }}>{data.bank}</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted-2)', marginTop: 3, fontFamily: "'JetBrains Mono', monospace" }}>{data.ticker}</div>
        </div>
        {data.badge && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 999, background: data.badge === 'new' ? 'var(--green-soft)' : 'var(--amber-soft)', color: data.badge === 'new' ? 'var(--green)' : 'var(--amber)', fontSize: 10.5, fontWeight: 700 }}>
            <span style={{ width: 5, height: 5, borderRadius: 999, background: 'currentColor' }} />{data.badge === 'new' ? 'Шинэ' : 'Идэвхтэй'}
          </span>
        )}
      </div>
      <div style={{ marginTop: 18, display: 'flex', alignItems: 'baseline', gap: 7 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 34, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{data.rate.toFixed(1)}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--pos)' }}>%</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginLeft: 'auto' }}>{tp.label}</span>
      </div>
      <div style={{ marginTop: 16, borderTop: '1px solid var(--line-2)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[['Нэрлэсэн үнэ', fmt(data.unit)], ['Хугацаа', `${data.term} хоног`]].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>{k}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14 }}>
        <div style={{ height: 6, borderRadius: 99, background: 'var(--line-2)', overflow: 'hidden' }}><div style={{ height: '100%', borderRadius: 99, background: 'var(--indigo)', width: `${pct}%` }} /></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 7, fontSize: 11, fontWeight: 600, color: 'var(--muted)' }}>
          <span>Үлдсэн ширхэг</span>
          <span><b style={{ color: 'var(--text)' }}>{data.avail.toLocaleString('en-US')}</b> / {data.total.toLocaleString('en-US')}</span>
        </div>
      </div>
      <button onClick={e => { e.stopPropagation(); onBuy?.(); }} style={{ marginTop: 16, width: '100%', height: 46, borderRadius: 13, border: 'none', background: 'var(--pos)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 8px 20px -10px rgba(14,159,110,.6)' }}>Авах</button>
    </div>
  );
}
