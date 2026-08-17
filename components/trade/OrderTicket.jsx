import React from 'react';

const fmt = n => '₮\u00A0' + Math.abs(Math.round(n || 0)).toLocaleString('en-US');
const pct = n => (n || 0).toFixed(1) + '%';
const initials = s => s.replace('ББСБ', '').replace('банк', '').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
const TYPE = {
  cd:    { c1: '#2D6BFF', c2: '#4F46E5' }, trust: { c1: '#4F46E5', c2: '#7C3AED' },
  inv:   { c1: '#0E9F6E', c2: '#0891B2' }, cp:    { c1: '#FF6B2C', c2: '#DC2626' },
};

/**
 * OrderTicket — the Trade right-rail. Buy/Sell segmented header → selected
 * instrument summary (empty prompt when none) → quantity stepper + presets →
 * live cost summary → balance/shortfall pill → intent-colored CTA that is
 * disabled-with-reason until an instrument + valid quantity are present.
 */
export function OrderTicket({ side = 'buy', onSideChange, instrument, qty = 0, onQtyChange, balance = 0, onSubmit, buyOnly = false }) {
  const tp = instrument ? (TYPE[instrument.type] || TYPE.trust) : null;
  const maxQty = instrument ? (side === 'buy' ? Math.min(instrument.avail || 999, Math.floor(balance / (instrument.unit * 1.001))) : (instrument.owned || 0)) : 0;
  const subtotal = instrument ? instrument.unit * qty : 0;
  const fee = subtotal * 0.001;
  const total = subtotal + fee;
  const isShort = side === 'buy' && total > balance && qty > 0;
  let reason = '';
  if (!instrument) reason = 'Эхлэхийн тулд бүтээгдэхүүн сонгоно уу.';
  else if (qty <= 0) reason = 'Тоо ширхэгийг оруулна уу.';
  else if (isShort) reason = 'Үлдэгдэл хүрэлцэхгүй байна. Хэтэвчээ цэнэглэнэ үү.';

  const ctaBg = side === 'buy' ? 'var(--pos)' : 'var(--neg)';

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--line-2)', borderRadius: 24, overflow: 'hidden' }}>
      <div style={{ padding: '18px 20px 0' }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.01em', marginBottom: 14 }}>Авах захиалга</div>
        {!buyOnly && (
          <div style={{ display: 'inline-flex', background: 'var(--field-bg)', border: '1px solid var(--line)', borderRadius: 14, padding: 4, gap: 4 }}>
            {[{ v: 'buy', l: 'Авах' }, { v: 'sell', l: 'Зарах' }].map(o => {
              const active = o.v === side;
              const abg = o.v === 'buy' ? 'var(--pos)' : 'var(--neg)';
              return (
                <button key={o.v} onClick={() => onSideChange?.(o.v)} style={{ height: 38, padding: '0 18px', border: 'none', borderRadius: 10, background: active ? abg : 'transparent', color: active ? '#fff' : 'var(--muted)', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 999, background: 'currentColor', opacity: active ? 1 : 0.6 }} />{o.l}
                </button>
              );
            })}
          </div>
        )}
      </div>
      <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {instrument ? (
          <div style={{ border: '1px solid var(--line)', borderRadius: 14, padding: 14, background: 'var(--field-bg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg,${tp.c1},${tp.c2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{initials(instrument.bank)}</div>
              <div><div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--ink)' }}>{instrument.bank}</div><div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--muted-2)', marginTop: 2, fontFamily: "'JetBrains Mono', monospace" }}>{instrument.ticker}</div></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--line-2)' }}>
              <div><div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>Үр шим</div><div style={{ fontSize: 14, fontWeight: 800, color: 'var(--pos)', marginTop: 3, fontFamily: "'JetBrains Mono', monospace" }}>{pct(instrument.rate)}</div></div>
              <div><div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>Хугацаа</div><div style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink)', marginTop: 3 }}>{instrument.term} хоног</div></div>
              <div><div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>Нэрлэсэн үнэ</div><div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink)', marginTop: 3, fontVariantNumeric: 'tabular-nums', fontFamily: "'JetBrains Mono', monospace" }}>{fmt(instrument.unit)}</div></div>
              <div><div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>Боломжит тоо</div><div style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink)', marginTop: 3, fontFamily: "'JetBrains Mono', monospace" }}>{maxQty}</div></div>
            </div>
          </div>
        ) : (
          <div style={{ border: '1.5px dashed var(--line)', borderRadius: 14, padding: '26px 18px', textAlign: 'center' }}>
            <div style={{ width: 46, height: 46, borderRadius: 13, background: 'var(--indigo-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M7 7h11l-3-3M17 17H6l3 3" stroke="var(--indigo)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--ink)' }}>Бүтээгдэхүүн сонгоно уу</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 5, lineHeight: 1.45 }}>Зүүн талын картаас сонгоно уу.</div>
          </div>
        )}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
            <span>Тоо ширхэг</span><span style={{ color: 'var(--muted)', fontWeight: 600 }}>боломжит: {maxQty}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--line)', borderRadius: 13, background: 'var(--field-bg)', overflow: 'hidden' }}>
            <button onClick={() => onQtyChange?.(Math.max(0, qty - 1))} style={{ width: 48, height: 50, border: 'none', background: 'transparent', fontSize: 20, fontWeight: 700, color: 'var(--muted)', cursor: 'pointer', flexShrink: 0, fontFamily: 'inherit' }}>−</button>
            <input type="number" value={qty} onChange={e => onQtyChange?.(Math.max(0, parseInt(e.target.value || '0', 10)))} style={{ flex: 1, border: 'none', background: 'transparent', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 700, color: 'var(--ink)', outline: 'none' }} />
            <button onClick={() => onQtyChange?.(qty + 1)} style={{ width: 48, height: 50, border: 'none', background: 'transparent', fontSize: 20, fontWeight: 700, color: 'var(--muted)', cursor: 'pointer', flexShrink: 0, fontFamily: 'inherit' }}>+</button>
          </div>
          <div style={{ display: 'flex', gap: 7, marginTop: 10 }}>
            {[1, 5, 10, 'max'].map(q => <button key={q} onClick={() => onQtyChange?.(q === 'max' ? maxQty : q)} style={{ flex: 1, height: 32, borderRadius: 9, border: '1px solid var(--line)', background: 'var(--surface)', fontSize: 11.5, fontWeight: 700, color: 'var(--muted)', cursor: 'pointer', fontFamily: 'inherit' }}>{q === 'max' ? 'Бүгд' : q}</button>)}
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--line-2)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[['Нэгж үнэ', instrument ? fmt(instrument.unit) : '—'], ['Шимтгэл (0.1%)', qty > 0 && instrument ? fmt(fee) : '—']].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>{k}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', fontFamily: "'JetBrains Mono', monospace", fontVariantNumeric: 'tabular-nums' }}>{v}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--ink)' }}>Нийт төлбөр</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--ink)', fontFamily: "'JetBrains Mono', monospace", fontVariantNumeric: 'tabular-nums' }}>{fmt(total)}</span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 13px', borderRadius: 11, background: isShort ? 'var(--neg-soft)' : 'var(--indigo-soft)' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: isShort ? 'var(--neg)' : 'var(--indigo)' }}>{isShort ? 'Дутагдаж буй дүн' : 'Боломжит үлдэгдэл'}</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: isShort ? 'var(--neg)' : 'var(--indigo)', fontFamily: "'JetBrains Mono', monospace", fontVariantNumeric: 'tabular-nums' }}>{isShort ? fmt(total - balance) : fmt(balance)}</span>
        </div>
        <div>
          <button disabled={!!reason} onClick={reason ? undefined : onSubmit} style={{ width: '100%', height: 52, borderRadius: 14, border: 'none', fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em', cursor: reason ? 'not-allowed' : 'pointer', fontFamily: 'inherit', background: reason ? '#E3E5EF' : ctaBg, color: reason ? 'var(--muted-2)' : '#fff', boxShadow: reason ? 'none' : `0 8px 22px -8px ${side === 'buy' ? 'rgba(14,159,110,.5)' : 'rgba(220,38,38,.5)'}` }}>
            {side === 'buy' ? 'Авах захиалга өгөх' : 'Зарах захиалга өгөх'}
          </button>
          {reason && <div style={{ fontSize: 11.5, color: 'var(--muted-2)', fontWeight: 600, textAlign: 'center', marginTop: 8, lineHeight: 1.4 }}>{reason}</div>}
        </div>
      </div>
    </div>
  );
}
