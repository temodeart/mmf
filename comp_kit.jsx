// comp_kit.jsx — MMF Web · Pass 01
// Composites: WebStatCard, WebPagination, WebDataTable, WebInstrumentCard,
//   WebSegmentedControl, WebFilterChips, WebOrderTicket, WebOTPInput,
//   WebSidebar, WebTopbar, WebPageHeader, WebModal, WebDisclaimer
// <script type="text/babel" src="comp_kit.jsx"></script>  (after comp_atoms.jsx)

const { useState: _useState, useRef: _useRef } = React;
const { T, WebBadge, WebSparkline, WebButton, WebEmptyState, WebErrorState, WebSkeletonBlock } = window;

const _fmt  = n => window.formatMNT  ? window.formatMNT(n)  : '₮\u00A0' + Math.abs(Math.round(n||0)).toLocaleString('en-US');
const _pct  = n => window.formatPct  ? window.formatPct(n)  : (n||0).toFixed(1) + '%';
const _init = s => s.replace('ББСБ','').replace('банк','').trim().split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase();
const _TYPE = {
  cd:    { label:'Хадгаламжийн сертификат', c1:'#2D6BFF', c2:'#4F46E5' },
  trust: { label:'Итгэлцэл',                c1:'#4F46E5', c2:'#7C3AED' },
  inv:   { label:'Нэхэмжлэх',               c1:'#0E9F6E', c2:'#0891B2' },
  cp:    { label:'Арилжааны бичиг',          c1:'#FF6B2C', c2:'#DC2626' },
};

/* ─── WebStatCard ────────────────────────────────────────────────
   label, value (string), delta (string|null), deltaPositive (bool),
   trend (number[]|null), loading (bool), heroValue (bool — larger num) */
const WebStatCard = ({ label, value, delta, deltaPositive, trend, loading, heroValue, caption }) => {
  if (loading) return (
    <div style={{ background:T.surface, border:`1px solid ${T.line2}`, borderRadius:20, padding:20 }}>
      <WebSkeletonBlock variant="text" width="55%" style={{ marginBottom:14 }}/>
      <WebSkeletonBlock variant="num" width="72%"/>
    </div>
  );
  const dc = deltaPositive ? T.pos : T.neg;
  return (
    <div style={{ background:T.surface, border:`1px solid ${T.line2}`, borderRadius:20, padding:20, minWidth:0 }}>
      <div className="truncate" style={{ fontSize:11, fontWeight:700, color:T.muted, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:12 }}>{label}</div>
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:12 }}>
        <div style={{ minWidth:0 }}>
          <div className="num" style={{ fontSize:heroValue?32:26, fontWeight:800, color:T.ink, letterSpacing:'-0.02em', fontVariantNumeric:'tabular-nums', lineHeight:1.1, fontFamily:"'JetBrains Mono',monospace" }}>{value??'—'}</div>
          {delta != null && (
            <div style={{ fontSize:12.5, fontWeight:700, color:dc, marginTop:6, display:'flex', alignItems:'center', gap:4 }}>
              <span style={{ fontSize:10 }}>{deltaPositive?'▲':'▼'}</span>{delta}
            </div>
          )}
          {caption && (
            <div style={{ fontSize:11.5, fontWeight:600, color:T.muted2, marginTop:6, lineHeight:1.4 }}>{caption}</div>
          )}
        </div>
        {trend != null && (
          trend.length >= 2
            ? <WebSparkline data={trend} color={dc} width={80} height={44}/>
            : <div style={{ fontSize:11, color:T.muted2, fontWeight:600, alignSelf:'center', whiteSpace:'nowrap' }}>Датагүй</div>
        )}
      </div>
    </div>
  );
};

/* ─── WebUnderlineTabs (F-14) ──────────────────────────────────────
   tabs: [{key,label,count?}] — underline pattern (matches Wallet tabs):
   active = ink text + 2px indigo underline; inactive = plain muted text,
   no pill background/border — fixes the "button cluster" audit flag. */
const WebUnderlineTabs = ({ tabs, value, onChange }) => (
  <div style={{ display:'flex', gap:24, borderBottom:`1px solid ${T.line2}`, overflowX:'auto' }}>
    {tabs.map(t => {
      const active = t.key === value;
      return (
        <button key={t.key} onClick={() => onChange(t.key)} style={{
          position:'relative', padding:'4px 2px 13px', background:'none', border:'none', cursor:'pointer',
          fontSize:13.5, fontWeight:700, color:active?T.ink:T.muted, fontFamily:'inherit', display:'flex',
          alignItems:'center', gap:7, borderBottom:active?`2px solid ${T.indigo}`:'2px solid transparent',
          marginBottom:-1, whiteSpace:'nowrap', minHeight:0, borderRadius:0,
        }}>
          {t.label}
          {t.count != null && (
            <span style={{ fontSize:11, fontWeight:700, color:active?T.indigo:T.muted2, background:active?T.indigoSoft:T.line2, padding:'1px 7px', borderRadius:99 }}>{t.count}</span>
          )}
        </button>
      );
    })}
  </div>
);

/* ─── WebPagination ──────────────────────────────────────────── */
const WebPagination = ({ page, total, perPage=10, onChange }) => {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;
  const vis = Array.from({ length:pages }, (_,i) => i+1).filter(p => p===1||p===pages||Math.abs(p-page)<=1);
  const items = [];
  vis.forEach((p,i) => { if (i>0 && vis[i]-vis[i-1]>1) items.push('…'); items.push(p); });
  const Btn = ({ lbl, active, off, go }) => (
    <button onClick={off?undefined:go} style={{ minWidth:36, height:36, padding:'0 10px', borderRadius:10, border:`1px solid ${active?T.indigo:T.line}`, background:active?T.indigo:T.surface, color:active?'#fff':T.muted, fontWeight:700, fontSize:13, cursor:off?'default':'pointer', opacity:off?.4:1, fontFamily:'inherit' }}>{lbl}</button>
  );
  return (
    <div style={{ display:'flex', gap:6, alignItems:'center' }}>
      <Btn lbl="‹" off={page<=1} go={() => onChange(page-1)}/>
      {items.map((p,i) => p==='…'
        ? <span key={`e${i}`} style={{ color:T.muted, fontSize:13, padding:'0 4px' }}>…</span>
        : <Btn key={p} lbl={p} active={p===page} go={() => onChange(p)}/>)}
      <Btn lbl="›" off={page>=pages} go={() => onChange(page+1)}/>
    </div>
  );
};

/* ─── WebDataTable ───────────────────────────────────────────────
   columns: [{key, label, align:'right', sortable, width, render, mono}]
   rows: objects with id. loading|error|empty states auto-handled.
   error: { title, body, action }  */
const WebDataTable = ({ columns, rows, loading, error, emptyTitle, emptyBody, emptyAction, onRowClick, selected, sortBy, sortDir='desc', onSort, page=1, perPage=10, total, onPageChange, title, action:hdrAction }) => {
  const Th = col => (
    <th key={col.key} aria-sort={col.sortable ? (sortBy===col.key ? (sortDir==='asc'?'ascending':'descending') : 'none') : undefined} onClick={col.sortable&&onSort ? ()=>onSort(col.key) : undefined} style={{
      textAlign:col.align==='right'?'right':'left', fontSize:11, fontWeight:700, letterSpacing:'.06em',
      color:T.muted, textTransform:'uppercase', padding:'13px 16px', background:T.field,
      borderBottom:`1px solid ${T.line2}`, userSelect:'none', cursor:col.sortable?'pointer':'default', width:col.width||'auto',
    }}>
      {col.label}
      {col.sortable && <span style={{ marginLeft:4, opacity:sortBy===col.key?.7:.3 }}>{sortBy===col.key?(sortDir==='asc'?'↑':'↓'):'↕'}</span>}
    </th>
  );
  const Body = () => {
    if (loading) return (
      <tbody>
        {[0,1,2,3,4].map(i => (
          <tr key={i} style={{ borderBottom:`1px solid ${T.line2}` }}>
            {columns.map((col,j) => <td key={col.key} style={{ padding:'14px 16px' }}><WebSkeletonBlock variant="text" width={j===0?'68%':'50%'}/></td>)}
          </tr>
        ))}
      </tbody>
    );
    if (error) return <tbody><tr><td colSpan={columns.length} style={{ padding:16 }}><WebErrorState variant="neg" title={error.title||'Алдаа гарлаа'} body={error.body} action={error.action}/></td></tr></tbody>;
    if (!rows||rows.length===0) return <tbody><tr><td colSpan={columns.length} style={{ padding:0 }}><WebEmptyState title={emptyTitle||'Өгөгдөл олдсонгүй'} body={emptyBody} action={emptyAction}/></td></tr></tbody>;
    return (
      <tbody>
        {rows.map(row => (
          <tr key={row.id} onClick={() => onRowClick?.(row)} style={{ borderBottom:`1px solid ${T.line2}`, background:selected===row.id?T.indigoSoft:'transparent', cursor:onRowClick?'pointer':'default', transition:'background .12s' }}>
            {columns.map(col => (
              <td key={col.key} style={{ padding:'14px 16px', fontSize:13.5, fontWeight:600, color:T.text, textAlign:col.align==='right'?'right':'left', fontVariantNumeric:col.mono?'tabular-nums':'normal', fontFamily:col.mono?"'JetBrains Mono',monospace":'inherit' }}>
                {col.render ? col.render(row) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  };
  return (
    <div style={{ background:T.surface, border:`1px solid ${T.line2}`, borderRadius:20, overflow:'hidden' }}>
      {(title||hdrAction) && (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:`1px solid ${T.line2}` }}>
          {title && <div style={{ fontSize:15, fontWeight:800, color:T.ink, letterSpacing:'-0.01em' }}>{title}</div>}
          {hdrAction}
        </div>
      )}
      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr>{columns.map(Th)}</tr></thead>
          <Body/>
        </table>
      </div>
      {total>0 && !loading && onPageChange && (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 20px', borderTop:`1px solid ${T.line2}` }}>
          <div style={{ fontSize:12.5, fontWeight:600, color:T.muted }}>Нийт <b style={{ color:T.text }}>{total}</b> · {((page-1)*perPage)+1}–{Math.min(page*perPage,total)}</div>
          <WebPagination page={page} total={total} perPage={perPage} onChange={onPageChange}/>
        </div>
      )}
    </div>
  );
};

/* ─── WebInstrumentCard ──────────────────────────────────────── */
const WebInstrumentCard = ({ data, selected, onSelect, onBuy }) => {
  const tp = _TYPE[data.type]||_TYPE.trust;
  const pct = data.total>0 ? Math.round(data.avail/data.total*100) : 0;
  return (
    <div onClick={onSelect} style={{ background:T.surface, border:`1.5px solid ${selected?T.indigo:T.line2}`, borderRadius:20, padding:20, cursor:'pointer', boxShadow:selected?`0 0 0 3px ${T.indigoSoft}`:'none', transition:'border-color .15s, box-shadow .15s' }}>
      <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
        <div style={{ width:44, height:44, borderRadius:12, flexShrink:0, background:`linear-gradient(135deg,${tp.c1},${tp.c2})`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:16 }}>{_init(data.bank)}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:14.5, fontWeight:800, color:T.ink, letterSpacing:'-0.01em', lineHeight:1.25 }}>{data.bank}</div>
          <div style={{ fontSize:11, fontWeight:600, color:T.muted2, marginTop:3, fontFamily:"'JetBrains Mono',monospace" }}>{data.ticker}</div>
        </div>
        {data.badge && <WebBadge tone={data.badge}>{data.badge==='new'?'Шинэ':'Идэвхтэй'}</WebBadge>}
      </div>
      <div style={{ marginTop:18, display:'flex', alignItems:'baseline', gap:7 }}>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:34, fontWeight:700, color:T.ink, letterSpacing:'-0.02em', fontVariantNumeric:'tabular-nums' }}>{data.rate.toFixed(1)}</span>
        <span style={{ fontSize:14, fontWeight:700, color:T.pos }}>%</span>
        <span style={{ fontSize:11, fontWeight:700, color:T.muted, textTransform:'uppercase', letterSpacing:'.06em', marginLeft:'auto' }}>{tp.label}</span>
      </div>
      <div style={{ marginTop:16, borderTop:`1px solid ${T.line2}`, paddingTop:14, display:'flex', flexDirection:'column', gap:10 }}>
        {[['Нэрлэсэн үнэ', _fmt(data.unit)], ['Хугацаа', `${data.term} хоног`]].map(([k,v]) => (
          <div key={k} style={{ display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontSize:12.5, fontWeight:600, color:T.muted }}>{k}</span>
            <span style={{ fontSize:13, fontWeight:700, color:T.text, fontVariantNumeric:'tabular-nums' }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop:14 }}>
        <div style={{ height:6, borderRadius:99, background:T.line2, overflow:'hidden' }}><div style={{ height:'100%', borderRadius:99, background:T.indigo, width:`${pct}%` }}/></div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:7, fontSize:11, fontWeight:600, color:T.muted }}>
          <span>Үлдсэн ширхэг</span>
          <span><b style={{ color:T.text }}>{data.avail.toLocaleString('en-US')}</b> / {data.total.toLocaleString('en-US')}</span>
        </div>
      </div>
      <button onClick={e => { e.stopPropagation(); onBuy?.(); }} style={{ marginTop:16, width:'100%', height:46, borderRadius:13, border:'none', background:T.pos, color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit', boxShadow:`0 8px 20px -10px rgba(14,159,110,.6)` }}>Авах</button>
    </div>
  );
};

/* ─── WebSegmentedControl ────────────────────────────────────────
   options: [{value, label, count?}]  semantic: null | 'buy-sell' */
const WebSegmentedControl = ({ options, value, onChange, semantic }) => {
  const isBuySell = semantic === 'buy-sell';
  return (
    <div style={{ display:'inline-flex', background:T.field, border:`1px solid ${T.line}`, borderRadius:14, padding:4, gap:4 }}>
      {options.map(opt => {
        const active = opt.value === value;
        let activeBg = T.indigo, activeShadow = '0 6px 16px -8px rgba(79,70,229,.6)';
        if (isBuySell && opt.value==='buy')  { activeBg=T.pos; activeShadow=`0 6px 16px -8px rgba(14,159,110,.6)`; }
        if (isBuySell && opt.value==='sell') { activeBg=T.neg; activeShadow=`0 6px 16px -8px rgba(220,38,38,.6)`; }
        return (
          <button key={opt.value} onClick={() => onChange(opt.value)} style={{ height:38, padding:'0 18px', border:'none', borderRadius:10, background:active?activeBg:'transparent', color:active?'#fff':T.muted, fontSize:13.5, fontWeight:700, cursor:'pointer', fontFamily:'inherit', boxShadow:active?activeShadow:'none', display:'flex', alignItems:'center', gap:8, transition:'all .15s' }}>
            {isBuySell && <span style={{ width:8, height:8, borderRadius:99, background:'currentColor', opacity:active?1:.6 }}/>}
            {opt.label}
            {opt.count != null && <span style={{ fontSize:11, fontWeight:700, padding:'1px 7px', borderRadius:99, background:active?'rgba(255,255,255,.22)':T.line2, color:active?'#fff':T.muted }}>{opt.count}</span>}
          </button>
        );
      })}
    </div>
  );
};

/* ─── WebFilterChips ─────────────────────────────────────────── */
const WebFilterChips = ({ options, value, onChange }) => (
  <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
    {options.map(opt => {
      const active = opt.value === value;
      return (
        <button key={opt.value} onClick={() => onChange(opt.value)} style={{ height:36, padding:'0 14px', borderRadius:99, border:`1px solid ${active?T.ink:T.line}`, background:active?T.ink:T.surface, color:active?'#fff':T.text, fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:8, transition:'all .15s' }}>
          {opt.color && <span style={{ width:8, height:8, borderRadius:99, background:active?'rgba(255,255,255,.7)':opt.color }}/>}
          {opt.label}
        </button>
      );
    })}
  </div>
);

/* ─── WebOrderTicket ─────────────────────────────────────────────
   side:'buy'|'sell', instrument:{bank,type,rate,unit,term,ticker,avail} or null,
   qty, balance. Disabled-with-reason on submit CTA. */
const WebOrderTicket = ({ side='buy', onSideChange, instrument, qty=0, onQtyChange, balance=0, onSubmit, buyOnly=false }) => {
  const tp = instrument ? (_TYPE[instrument.type]||_TYPE.trust) : null;
  const maxQty = instrument ? (side==='buy' ? Math.min(instrument.avail||999, Math.floor(balance/(instrument.unit*1.001))) : (instrument.owned||0)) : 0;
  const subtotal = instrument ? instrument.unit*qty : 0;
  const fee = subtotal*0.001;
  const total = subtotal+fee;
  const isShort = side==='buy' && total>balance && qty>0;
  let reason = '';
  if (!instrument) reason = 'Эхлэхийн тулд бүтээгдэхүүн сонгоно уу.';
  else if (qty<=0)  reason = 'Тоо ширхэгийг оруулна уу.';
  else if (isShort) reason = 'Үлдэгдэл хүрэлцэхгүй байна. Хэтэвчээ цэнэглэнэ үү.';
  return (
    <div style={{ background:T.surface, border:`1px solid ${T.line2}`, borderRadius:24, overflow:'hidden' }}>
      <div style={{ padding:'18px 20px 0' }}>
        <div style={{ fontSize:15, fontWeight:800, color:T.ink, letterSpacing:'-0.01em', marginBottom:14 }}>Авах захиалга</div>
        {buyOnly
          ? null
          : <WebSegmentedControl semantic="buy-sell" value={side} onChange={onSideChange} options={[{value:'buy',label:'Авах'},{value:'sell',label:'Зарах'}]}/>}
      </div>
      <div style={{ padding:'18px 20px 20px', display:'flex', flexDirection:'column', gap:16 }}>
        {/* Instrument slot */}
        {instrument ? (
          <div style={{ border:`1px solid ${T.line}`, borderRadius:14, padding:14, background:T.field }}>
            <div style={{ display:'flex', alignItems:'center', gap:11 }}>
              <div style={{ width:38, height:38, borderRadius:10, background:`linear-gradient(135deg,${tp.c1},${tp.c2})`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:14, flexShrink:0 }}>{_init(instrument.bank)}</div>
              <div><div style={{ fontSize:13.5, fontWeight:800, color:T.ink }}>{instrument.bank}</div><div style={{ fontSize:10.5, fontWeight:600, color:T.muted2, marginTop:2, fontFamily:"'JetBrains Mono',monospace" }}>{instrument.ticker}</div></div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:14, paddingTop:12, borderTop:`1px solid ${T.line2}` }}>
              <div><div style={{ fontSize:11, color:T.muted, fontWeight:600 }}>Үр шим</div><div style={{ fontSize:14, fontWeight:800, color:T.pos, marginTop:3, fontFamily:"'JetBrains Mono',monospace" }}>{_pct(instrument.rate)}</div></div>
              <div><div style={{ fontSize:11, color:T.muted, fontWeight:600 }}>Хугацаа</div><div style={{ fontSize:14, fontWeight:800, color:T.ink, marginTop:3 }}>{instrument.term} хоног</div></div>
              <div><div style={{ fontSize:11, color:T.muted, fontWeight:600 }}>Нэрлэсэн үнэ</div><div style={{ fontSize:13, fontWeight:800, color:T.ink, marginTop:3, fontVariantNumeric:'tabular-nums', fontFamily:"'JetBrains Mono',monospace" }}>{_fmt(instrument.unit)}</div></div>
              <div><div style={{ fontSize:11, color:T.muted, fontWeight:600 }}>Боломжит тоо</div><div style={{ fontSize:14, fontWeight:800, color:T.ink, marginTop:3, fontFamily:"'JetBrains Mono',monospace" }}>{maxQty}</div></div>
            </div>
          </div>
        ) : (
          <div style={{ border:`1.5px dashed ${T.line}`, borderRadius:14, padding:'26px 18px', textAlign:'center' }}>
            <div style={{ width:46, height:46, borderRadius:13, background:T.indigoSoft, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M7 7h11l-3-3M17 17H6l3 3" stroke={T.indigo} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{ fontSize:13.5, fontWeight:800, color:T.ink }}>Бүтээгдэхүүн сонгоно уу</div>
            <div style={{ fontSize:12, color:T.muted, marginTop:5, lineHeight:1.45 }}>Зүүн талын картаас сонгоно уу.</div>
          </div>
        )}
        {/* Qty stepper */}
        <div>
          <div style={{ fontSize:12, fontWeight:700, color:T.text, marginBottom:8, display:'flex', justifyContent:'space-between' }}>
            <span>Тоо ширхэг</span>
            <span style={{ color:T.muted, fontWeight:600 }}>боломжит: {maxQty}</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', border:`1.5px solid ${T.line}`, borderRadius:13, background:T.field, overflow:'hidden' }}>
            <button onClick={() => onQtyChange?.(Math.max(0,qty-1))} style={{ width:48, height:50, border:'none', background:'transparent', fontSize:20, fontWeight:700, color:T.muted, cursor:'pointer', flexShrink:0, fontFamily:'inherit' }}>−</button>
            <input type="number" value={qty} onChange={e => onQtyChange?.(Math.max(0,parseInt(e.target.value||'0',10)))} style={{ flex:1, border:'none', background:'transparent', textAlign:'center', fontFamily:"'JetBrains Mono',monospace", fontSize:18, fontWeight:700, color:T.ink, outline:'none' }}/>
            <button onClick={() => onQtyChange?.(qty+1)} style={{ width:48, height:50, border:'none', background:'transparent', fontSize:20, fontWeight:700, color:T.muted, cursor:'pointer', flexShrink:0, fontFamily:'inherit' }}>+</button>
          </div>
          <div style={{ display:'flex', gap:7, marginTop:10 }}>
            {[1,5,10,'max'].map(q => <button key={q} onClick={() => onQtyChange?.(q==='max'?maxQty:q)} style={{ flex:1, height:32, borderRadius:9, border:`1px solid ${T.line}`, background:T.surface, fontSize:11.5, fontWeight:700, color:T.muted, cursor:'pointer', fontFamily:'inherit' }}>{q==='max'?'Бүгд':q}</button>)}
          </div>
        </div>
        {/* Summary */}
        <div style={{ borderTop:`1px solid ${T.line2}`, paddingTop:14, display:'flex', flexDirection:'column', gap:10 }}>
          {[['Нэгж үнэ', instrument?_fmt(instrument.unit):'—'],['Шимтгэл (0.1%)', qty>0&&instrument?_fmt(fee):'—']].map(([k,v]) => (
            <div key={k} style={{ display:'flex', justifyContent:'space-between' }}>
              <span style={{ fontSize:12.5, fontWeight:600, color:T.muted }}>{k}</span>
              <span style={{ fontSize:13, fontWeight:700, color:T.text, fontFamily:"'JetBrains Mono',monospace", fontVariantNumeric:'tabular-nums' }}>{v}</span>
            </div>
          ))}
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontSize:13.5, fontWeight:800, color:T.ink }}>Нийт төлбөр</span>
            <span style={{ fontSize:16, fontWeight:800, color:T.ink, fontFamily:"'JetBrains Mono',monospace", fontVariantNumeric:'tabular-nums' }}>{_fmt(total)}</span>
          </div>
        </div>
        {/* Balance pill */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'11px 13px', borderRadius:11, background:isShort?T.negSoft:T.indigoSoft }}>
          <span style={{ fontSize:12, fontWeight:700, color:isShort?T.neg:T.indigo }}>{isShort?'Дутагдаж буй дүн':'Боломжит үлдэгдэл'}</span>
          <span style={{ fontSize:13, fontWeight:800, color:isShort?T.neg:T.indigo, fontFamily:"'JetBrains Mono',monospace", fontVariantNumeric:'tabular-nums' }}>{isShort?_fmt(total-balance):_fmt(balance)}</span>
        </div>
        <WebButton variant={side==='buy'?'pos':'neg'} full disabled={!!reason} reason={reason} onClick={onSubmit}>
          {side==='buy'?'Авах захиалга өгөх':'Зарах захиалга өгөх'}
        </WebButton>
      </div>
    </div>
  );
};

/* ─── WebOTPInput ────────────────────────────────────────────── */
const WebOTPInput = ({ length=6, onComplete }) => {
  const [vals, setVals] = _useState(Array(length).fill(''));
  const refs = _useRef([]);
  const update = (i, v) => {
    const next = [...vals]; next[i] = v.replace(/\D/g,'').slice(0,1); setVals(next);
    if (next[i] && i<length-1) refs.current[i+1]?.focus();
    if (next.every(c=>c)) onComplete?.(next.join(''));
  };
  const onKey = (i, e) => { if (e.key==='Backspace' && !vals[i] && i>0) refs.current[i-1]?.focus(); };
  return (
    <div style={{ display:'flex', gap:10 }}>
      {vals.map((v,i) => (
        <input key={i} ref={el => refs.current[i]=el} maxLength={1} value={v} inputMode="numeric"
          onChange={e => update(i, e.target.value)} onKeyDown={e => onKey(i,e)}
          style={{ flex:1, minWidth:0, height:54, border:`1.5px solid ${v?T.indigo:T.line}`, borderRadius:13, background:v?T.surface:T.field, textAlign:'center', fontFamily:"'JetBrains Mono',monospace", fontSize:22, fontWeight:700, color:T.ink, outline:'none', boxShadow:v?`0 0 0 4px ${T.indigoSoft}`:'none', transition:'all .15s' }}
        />
      ))}
    </div>
  );
};

/* ─── WebSidebar ─────────────────────────────────────────────── */
const _NAV = [
  { path:'/dashboard', href:'04 Dashboard.html', label:'Миний самбар', icon: <><rect x="3" y="3" width="7" height="9" rx="1.6" stroke="currentColor" strokeWidth="1.8" fill="none"/><rect x="14" y="3" width="7" height="5" rx="1.6" stroke="currentColor" strokeWidth="1.8" fill="none"/><rect x="14" y="12" width="7" height="9" rx="1.6" stroke="currentColor" strokeWidth="1.8" fill="none"/><rect x="3" y="16" width="7" height="5" rx="1.6" stroke="currentColor" strokeWidth="1.8" fill="none"/></> },
  { path:'/products', href:'17 My Products.html', label:'Миний бүтээгдэхүүн', icon: <><path d="M4 8.5L12 4l8 4.5v7L12 20l-8-4.5v-7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="none"/><path d="M4 8.5l8 4.5 8-4.5M12 13v7" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></> },
  { path:'/trade', href:'02 Trade Screen.html', label:'Арилжаа', icon: <path d="M7 7h11l-3-3M17 17H6l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/> },
  { path:'/auto', href:'16 Auto Invest.html', label:'Автомат хөрөнгө оруулалт', icon: <><circle cx="12" cy="12" r="5.5" stroke="currentColor" strokeWidth="1.8" fill="none"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></> },
  { path:'/wallet', href:'06 Wallet.html', label:'Хэтэвч', icon: <><rect x="3" y="6" width="18" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.8" fill="none"/><path d="M3 10h18M16 14.5h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></> },
  { path:'/loan', href:'10 Loan.html', label:'Зээл', icon: <path d="M12 3l8 4v5c0 4.5-3 7.5-8 9-5-1.5-8-4.5-8-9V7l8-4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="none"/> },
  { path:'/news', href:'08 News.html', label:'Мэдээ мэдээлэл', icon: <><path d="M5 4h11l3 3v13H5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="none"/><path d="M8 9h8M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></> },
];
// V1 scope (portal-scope.js) ships without Зээл / Автомат хөрөнгө оруулалт.
const _NAV_V = () => window.MMF_V1 ? _NAV.filter(i => i.path !== '/auto' && i.path !== '/loan') : _NAV;
const WebSidebar = ({ activePath='/trade/primary' }) => {
  const [exp, setExp] = _useState('/trade');
  return (
    <aside style={{ width:268, flexShrink:0, background:'rgba(255,255,255,.72)', backdropFilter:'blur(14px)', borderRight:`1px solid ${T.line}`, display:'flex', flexDirection:'column', padding:'26px 18px', position:'sticky', top:0, height:'100vh', overflowY:'auto' }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, padding:'0 8px 4px' }}>
        <svg width="42" height="42" viewBox="0 0 48 48" fill="none"><path d="M9.6 11.4V28.6L0 34.4V0h9.9L24 8.4 38.1 0H48v5.6L24 20 9.6 11.4z" fill="#FF6B2C"/><path d="M38.4 36.6V19.4L48 13.6V48h-9.9L24 39.6 9.9 48H0v-5.6L24 28l14.4 8.6z" fill="#2D6BFF"/></svg>
        <div style={{ fontWeight:800, fontSize:17, lineHeight:1.05, letterSpacing:'-0.02em' }}>Money Market<br/><span style={{ color:T.muted2, fontWeight:600 }}>Fund</span></div>
      </div>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.14em', color:T.muted2, padding:'26px 12px 10px', textTransform:'uppercase' }}>ҮНДСЭН</div>
      <nav style={{ display:'flex', flexDirection:'column', gap:4 }}>
        {_NAV_V().map(item => {
          const isAct = activePath.startsWith(item.path);
          const isExp = exp===item.path;
          return (
            <React.Fragment key={item.path}>
              <a href={item.sub ? '#' : (item.href||'#')} onClick={e=>{if(item.sub){e.preventDefault();setExp(isExp?null:item.path);}}} style={{ display:'flex', alignItems:'center', gap:13, padding:'12px 14px', borderRadius:14, fontSize:14.5, fontWeight:600, color:isAct?T.indigo:T.text, textDecoration:'none', border:`1px solid ${isAct?T.indigoBorder:'transparent'}`, background:isAct?T.indigoSoft:'transparent', transition:'background .15s' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0 }}>{item.icon}</svg>
                {item.label}
                {item.sub && <svg style={{ marginLeft:'auto', opacity:.5, transition:'transform .2s', transform:isExp?'rotate(180deg)':'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </a>
              {item.sub && isExp && (
                <div style={{ margin:'2px 0 2px 30px', paddingLeft:14, borderLeft:`1.5px solid ${T.line}`, display:'flex', flexDirection:'column', gap:2 }}>
                  {item.sub.map(s => <a key={s.path} href={`02 Trade Screen.html?v=${s.path.split('/').pop()}`} style={{ fontSize:13.5, fontWeight:activePath===s.path?700:600, color:activePath===s.path?T.indigo:T.muted, padding:'8px 12px', borderRadius:10, textDecoration:'none' }}>{s.label}</a>)}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </nav>
      <div style={{ marginTop:'auto', padding:'14px 12px 2px' }}>
        <div style={{ fontSize:11, color:T.muted2, fontWeight:600, fontFamily:"'JetBrains Mono',monospace" }}>{'v' + (window.MMF_SCOPE_V || '2') + ' · 2026.06.23'}</div>
      </div>
    </aside>
  );
};

/* ─── WebNotifBell — topbar bell + dropdown panel ─────────────────
   Reads window.MMFNotifs (mmf_notifications.js) when present: shows a live
   unread-count dot, the 5 most-recent notifications, mark-all-read, and a
   footer link to the full list (12 Notifications.html). Rows deep-link
   straight to their subject (order/wallet/loan/profile/news) and mark
   themselves read on click — no interstitial detail screen (desktop
   adaptation of mobile's NotificationDetail). Falls back to a plain
   `notifCount`-driven dot (no dropdown) on pages that haven't loaded the
   shared data script yet. */
const _notifCatIcon = (cat, color) => {
  const p = { stroke:color, strokeWidth:2, fill:'none', strokeLinecap:'round', strokeLinejoin:'round' };
  if (cat==='txn')   return <g {...p}><path d="M8 7V4l-4 4 4 4V9h8M16 17v3l4-4-4-4v3H8"/></g>;
  if (cat==='loan')  return <g {...p}><circle cx="8" cy="8" r="2.2"/><circle cx="16" cy="16" r="2.2"/><path d="M7 17L17 7"/></g>;
  if (cat==='trade') return <g {...p}><path d="M4 19V5M4 19h16M8 14l3-4 3 2 4-6"/></g>;
  return <g {...p}><circle cx="12" cy="12" r="3"/><path d="M12 4v2M12 18v2M4 12h2M18 12h2M6.5 6.5l1.4 1.4M16.1 16.1l1.4 1.4M17.5 6.5l-1.4 1.4M7.9 16.1l-1.4 1.4"/></g>;
};
const _critIcon = color => <g stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3.5l9.5 16.5H2.5z"/><path d="M12 10v4M12 17.4h.01"/></g>;

const WebNotifBell = ({ notifCount=0, iconBtn }) => {
  const [open, setOpen] = _useState(false);
  const [, tick] = _useState(0);
  const has = typeof window !== 'undefined' && !!window.MMFNotifs;
  const all = has ? window.MMFNotifs.list() : [];
  const unread = has ? all.filter(n => n.unread).length : notifCount;
  const recent = all.slice(0, 5);

  const go = (n) => {
    if (has) window.MMFNotifs.markRead(n.id);
    setOpen(false);
    window.location.href = n.url;
  };
  const markAll = (e) => { e.stopPropagation(); window.MMFNotifs.markAllRead(); tick(x => x+1); };

  return (
    <div style={{ position:'relative' }}>
      <button aria-label="Мэдэгдэл" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(o => !o)} style={iconBtn}>
        {unread>0 && <span style={{ position:'absolute', top:9, right:10, width:7, height:7, borderRadius:99, background:'#FF6B2C', border:'1.5px solid #fff' }}/>}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 9a6 6 0 1112 0c0 5 2 6 2 6H4s2-1 2-6z" stroke={T.text} strokeWidth="1.8" strokeLinejoin="round"/><path d="M10 20a2 2 0 004 0" stroke={T.text} strokeWidth="1.8" strokeLinecap="round"/></svg>
      </button>
      {open && has && (<>
        <div onClick={() => setOpen(false)} style={{ position:'fixed', inset:0, zIndex:30 }}/>
        <div role="menu" style={{ position:'absolute', right:0, top:52, width:380, maxHeight:480, overflow:'auto', background:T.surface, border:`1px solid ${T.line}`, borderRadius:18, boxShadow:'0 16px 40px -12px rgba(15,20,55,.22)', zIndex:40 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', borderBottom:`1px solid ${T.line2}`, position:'sticky', top:0, background:T.surface }}>
            <span style={{ fontSize:14, fontWeight:800, color:T.ink }}>Мэдэгдэл</span>
            {unread>0 && <button onClick={markAll} style={{ fontSize:12, fontWeight:700, color:T.indigo, background:'none', border:'none', cursor:'pointer', fontFamily:'inherit', padding:0 }}>Бүгдийг унших</button>}
          </div>
          {recent.length === 0 ? (
            <div style={{ padding:'28px 20px', textAlign:'center' }}>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>Мэдэгдэл байхгүй байна</div>
              <div style={{ fontSize:11.5, color:T.muted, marginTop:4 }}>Шинэ гүйлгээ, арилжааны мэдэгдэл энд харагдана.</div>
            </div>
          ) : (
            <div style={{ padding:'6px 8px' }}>
              {recent.map(n => {
                const cat = window.MMF_NOTIF_CAT[n.cat] || window.MMF_NOTIF_CAT.sys;
                return (
                  <button key={n.id} role="menuitem" onClick={() => go(n)} style={{ width:'100%', textAlign:'left', display:'flex', gap:11, padding:'11px 10px', background: n.unread ? T.field : 'transparent', border:'none', borderRadius:12, cursor:'pointer', fontFamily:'inherit', minHeight:0 }}>
                    <div style={{ width:34, height:34, borderRadius:10, background: n.critical ? T.negSoft : `${cat.color}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">{n.critical ? _critIcon(T.neg) : _notifCatIcon(n.cat, cat.color)}</svg>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8 }}>
                        <span className="truncate" style={{ fontSize:12.5, fontWeight:700, color: n.critical ? T.neg : T.ink, lineHeight:1.3 }}>{n.title}</span>
                        <span style={{ display:'flex', alignItems:'center', gap:5, flexShrink:0, paddingTop:1 }}>
                          <span className="num" style={{ fontSize:10, color:T.muted2, fontWeight:600 }}>{window.formatRelative(n.date)}</span>
                          {n.unread && <span style={{ width:7, height:7, borderRadius:99, background:'#FF6B2C' }}/>}
                        </span>
                      </div>
                      <div className="truncate" style={{ fontSize:11.5, color:T.muted, marginTop:3 }}>{n.body}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
          <a href="12 Notifications.html" style={{ display:'block', textAlign:'center', padding:'12px 16px', borderTop:`1px solid ${T.line2}`, fontSize:12.5, fontWeight:700, color:T.indigo, textDecoration:'none' }}>Бүгдийг харах →</a>
        </div>
      </>)}
    </div>
  );
};

/* ─── WebTopbar ──────────────────────────────────────────────── */
/* Name + avatar on the bar; email demoted into the dropdown (never the raw,
   ALL-CAPS email on the bar). Bell · gear · avatar menu all keyboard-focusable
   and inside the R0 focus ring; menu items carry role=menuitem + .dropdown-item. */
const WebTopbar = ({ title, userName='Тэмүүжин Батбаяр', userEmail='temuujin.batbayar@example.mn', initials='ТБ', notifCount=0, defaultMenuOpen=false }) => {
  const [open, setOpen] = _useState(defaultMenuOpen);
  const iconBtn = { width:42, height:42, borderRadius:12, border:`1px solid ${T.line}`, background:T.surface, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', cursor:'pointer', flexShrink:0 };
  return (
    <header style={{ height:72, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 36px', borderBottom:`1px solid ${T.line}`, background:'rgba(255,255,255,.6)', backdropFilter:'blur(10px)', position:'sticky', top:0, zIndex:20, flexShrink:0 }}>
      <div style={{ fontSize:18, fontWeight:800, letterSpacing:'-0.02em', minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{title}</div>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <WebNotifBell notifCount={notifCount} iconBtn={iconBtn}/>
        <button aria-label="Тохиргоо" onClick={()=>{ window.location.href='07 Profile.html?tab=settings'; }} style={iconBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3.2" stroke={T.text} strokeWidth="1.8"/><path d="M12 3v2.4M12 18.6V21M4.6 4.6l1.7 1.7M17.7 17.7l1.7 1.7M3 12h2.4M18.6 12H21M4.6 19.4l1.7-1.7M17.7 6.3l1.7-1.7" stroke={T.text} strokeWidth="1.8" strokeLinecap="round"/></svg>
        </button>
        <div style={{ position:'relative' }}>
          <button onClick={()=>setOpen(o=>!o)} aria-haspopup="menu" aria-expanded={open} style={{ display:'flex', alignItems:'center', gap:11, padding:'5px 12px 5px 5px', borderRadius:999, border:`1px solid ${T.line}`, background:T.surface, cursor:'pointer', minHeight:0 }}>
            <div style={{ width:34, height:34, borderRadius:999, background:`linear-gradient(135deg,${T.blue},${T.indigo})`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:13, flexShrink:0 }}>{initials}</div>
            <div style={{ fontSize:13.5, fontWeight:700, color:T.ink, lineHeight:1.1, maxWidth:150, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{userName}</div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ transition:'transform .2s', transform:open?'rotate(180deg)':'none', flexShrink:0 }}><path d="M6 9l6 6 6-6" stroke={T.muted2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          {open && (<>
            <div onClick={()=>setOpen(false)} style={{ position:'fixed', inset:0, zIndex:30 }}/>
            <div role="menu" style={{ position:'absolute', right:0, top:52, width:258, background:T.surface, border:`1px solid ${T.line}`, borderRadius:16, boxShadow:'0 8px 24px -8px rgba(15,20,55,.18)', zIndex:40, padding:6 }}>
              <div style={{ padding:'10px 12px 12px', borderBottom:`1px solid ${T.line2}`, marginBottom:6 }}>
                <div style={{ fontSize:13.5, fontWeight:700, color:T.ink, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{userName}</div>
                <div title={userEmail} style={{ fontSize:11.5, fontWeight:600, color:T.muted2, marginTop:3, fontFamily:"'JetBrains Mono',monospace", whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{userEmail}</div>
              </div>
              <button role="menuitem" className="dropdown-item" onClick={()=>{ window.location.href='07 Profile.html'; }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.8"/><path d="M5 20c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>Профайл
              </button>
              <button role="menuitem" className="dropdown-item" onClick={()=>{ window.location.href='07 Profile.html?tab=settings'; }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/><path d="M12 4v1.6M12 18.4V20M5 12H3.4M20.6 12H19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>Тохиргоо
              </button>
              <button role="menuitem" className="dropdown-item" style={{ color:T.neg }} onClick={()=>{ window.location.href='05 Login.html'; }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M15 12H4M8 8l-4 4 4 4M14 4h4a2 2 0 012 2v12a2 2 0 01-2 2h-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>Гарах
              </button>
            </div>
          </>)}
        </div>
      </div>
    </header>
  );
};

/* ─── WebFooter (F-23) ───────────────────────────────────────── */
const _FOOT_LINKS = [
  { label:'Үйлчилгээний нөхцөл', href:'15 Terms.html#terms' },
  { label:'Нууцлалын бодлого',   href:'15 Terms.html#privacy' },
  { label:'Холбоо барих',        href:'15 Terms.html#contact' },
  { label:'Тусламж',             href:'14 Education.html' },
];
const WebFooter = ({ license='0000/000' }) => (
  <footer style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:'8px 20px', padding:'18px 36px', borderTop:`1px solid ${T.line}`, fontSize:12, fontWeight:600, color:T.muted }}>
    {_FOOT_LINKS.map((l,i)=>(<a key={i} href={l.href} style={{ color:T.muted, textDecoration:'none' }}>{l.label}</a>))}
    <span style={{ marginLeft:'auto', color:T.muted2, fontFamily:"'JetBrains Mono',monospace", fontSize:11.5 }}>СЗХ тусгай зөвшөөрлийн № {license}</span>
  </footer>
);

/* ─── WebAppShell — shared shell: skip-link · sidebar · topbar · main · footer
   F-01: pass `rail` to lay the content area out on the R0 fluid grid.
   R11 · a11y §06 (4.1.3): sr-only aria-live region announces page-load /
   route-change status for screen readers during the 3–5s blank transitions;
   set its text via a ref or state update on each navigation in a real app. ── */
const WebAppShell = ({ activePath='/trade/primary', title, notifCount=0, defaultMenuOpen=false, rail, children }) => (
  <div style={{ display:'flex', minHeight:'100vh' }}>
    <a href="#mmf-main" className="skip-link">Үндсэн хэсэг рүү очих</a>
    <div aria-live="polite" className="sr-only">{title ? `${title} хуудас ачааллаа` : ''}</div>
    <WebSidebar activePath={activePath}/>
    <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column' }}>
      <WebTopbar title={title} notifCount={notifCount} defaultMenuOpen={defaultMenuOpen}/>
      <main id="mmf-main" tabIndex={-1} style={{ flex:1, padding:'30px 36px 40px', outline:'none' }}>
        {rail ? (
          <div className="app-grid">
            <div style={{ minWidth:0 }}>{children}</div>
            <div style={{ minWidth:0 }}>{rail}</div>
          </div>
        ) : children}
      </main>
      <WebFooter/>
    </div>
  </div>
);

/* ─── WebPageHeader ──────────────────────────────────────────── */
const WebPageHeader = ({ title, subtitle, right }) => (
  <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:24, marginBottom:22, flexWrap:'wrap' }}>
    <div>
      <h1 style={{ fontSize:30, fontWeight:800, letterSpacing:'-0.03em', color:T.navy, margin:0 }}>{title}</h1>
      {subtitle && <p style={{ margin:'8px 0 0', fontSize:13.5, fontWeight:600, color:T.muted }}>{subtitle}</p>}
    </div>
    {right}
  </div>
);

/* ─── WebModal ───────────────────────────────────────────────── */
const WebModal = ({ open, onClose, logo, logoColor, title, ticker, children, footer }) => {
  if (!open) return null;
  return (
    <div onClick={e => e.target===e.currentTarget&&onClose?.()} style={{ position:'fixed', inset:0, background:'rgba(8,11,25,.5)', backdropFilter:'blur(3px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:60, padding:24 }}>
      <div style={{ width:480, maxWidth:'100%', maxHeight:'92vh', overflow:'auto', background:T.surface, borderRadius:24, boxShadow:'0 24px 60px -16px rgba(15,20,55,.28)', display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'22px 24px', borderBottom:`1px solid ${T.line2}`, display:'flex', alignItems:'center', gap:13, position:'sticky', top:0, background:T.surface, zIndex:2, flexShrink:0 }}>
          {logo && <div style={{ width:46, height:46, borderRadius:12, background:logoColor||T.indigo, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:15, flexShrink:0 }}>{logo}</div>}
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15, fontWeight:800, color:T.ink }}>{title}</div>
            {ticker && <div style={{ fontSize:11, fontWeight:600, color:T.muted2, marginTop:3, fontFamily:"'JetBrains Mono',monospace" }}>{ticker}</div>}
          </div>
          <button onClick={onClose} style={{ width:38, height:38, borderRadius:10, border:`1px solid ${T.line}`, background:T.surface, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke={T.muted} strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
        <div style={{ padding:'20px 24px 4px', flex:1 }}>{children}</div>
        {footer && <div style={{ padding:'8px 24px 24px', position:'sticky', bottom:0, background:T.surface }}>{footer}</div>}
      </div>
    </div>
  );
};

/* ─── WebDisclaimer ──────────────────────────────────────────── */
const WebDisclaimer = ({ children }) => (
  <div style={{ display:'flex', gap:11, padding:'13px 15px', borderRadius:13, background:T.warnSurface, border:`1px solid ${T.warnBorder}`, alignItems:'flex-start' }}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:1 }}>
      <path d="M12 3l9 16H3l9-16z" stroke={T.warn} strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M12 10v4M12 16.5v.5" stroke={T.warn} strokeWidth="1.9" strokeLinecap="round"/>
    </svg>
    <p style={{ margin:0, fontSize:11.5, fontWeight:600, color:'#8A6516', lineHeight:1.5 }}>{children}</p>
  </div>
);

Object.assign(window, {
  WebStatCard, WebPagination, WebDataTable, WebInstrumentCard,
  WebSegmentedControl, WebFilterChips, WebOrderTicket, WebOTPInput,
  WebSidebar, WebTopbar, WebPageHeader, WebModal, WebDisclaimer,
  WebFooter, WebAppShell, WebUnderlineTabs, WebNotifBell,
});
