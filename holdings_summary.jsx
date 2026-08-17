// ============================================================
// SHARED · Миний бүтээгдэхүүн summary donut + Сарын урсгал chart
// Extracted from 06 Wallet.html so Миний самбар (04 Dashboard) and Хэтэвч
// (06 Wallet) render the SAME two cards from one definition.
// HoldingsSummaryCard takes an optional `holdings` array ({ type, value }) —
// pass a page's live holdings to make the donut follow that page's state, or
// omit it to fall back to the shared HOLDINGS_SUMMARY fixture.
// ============================================================
const { useState } = React;
const T = window.T;

/* type palette + labels — same values as products_data.jsx (PT / PTL) */
const HS_TYPE = {
  cd:    { label:'Хадгаламжийн сертификат', c1:'#2D6BFF', c2:'#4F46E5' },
  trust: { label:'Итгэлцэл',                c1:'#4F46E5', c2:'#7C3AED' },
  inv:   { label:'Нэхэмжлэх',               c1:'#0E9F6E', c2:'#0891B2' },
  cp:    { label:'Арилжааны бичиг',         c1:'#FF6B2C', c2:'#DC2626' },
};
const HS_TYPE_ORDER = ['cd','trust','inv','cp'];

/* Group any holdings array into donut segments, in a stable type order. */
const hsSummarize = (holdings) => HS_TYPE_ORDER
  .map(type => {
    const rows = holdings.filter(h => h.type === type);
    return { type, ...HS_TYPE[type], count: rows.length, value: rows.reduce((s,h) => s + (h.value || 0), 0) };
  })
  .filter(s => s.value > 0);

/* P4 · monthly cash-flow data — returns land every month (green, up); loan
   repayments only on their due months (red, down, sparse by design). */
const FLOW_DATA = [
  { m:'2026.01', ret:1200000, loan:0 },
  { m:'2026.02', ret:900000,  loan:1100000 },
  { m:'2026.03', ret:1500000, loan:0 },
  { m:'2026.04', ret:1100000, loan:0 },
  { m:'2026.05', ret:1800000, loan:950000 },
  { m:'2026.06', ret:1145000, loan:0 },
];

/* Shared fixture — mirrors Dashboard's HOLDINGS_FULL so the pages never disagree */
const HOLDINGS_SUMMARY = [
  { type:'cd',    label:'Хадгаламжийн сертификат', count:1, value:8200000,  c1:'#2D6BFF', c2:'#4F46E5' },
  { type:'trust', label:'Итгэлцэл',                count:2, value:18500000, c1:'#4F46E5', c2:'#7C3AED' },
  { type:'inv',   label:'Нэхэмжлэх',               count:1, value:4300000,  c1:'#0E9F6E', c2:'#0891B2' },
  { type:'cp',    label:'Арилжааны бичиг',         count:1, value:3800000,  c1:'#FF6B2C', c2:'#DC2626' },
];
const HOLDINGS_TOTAL_COUNT = HOLDINGS_SUMMARY.reduce((s,h) => s+h.count, 0);
const HOLDINGS_TOTAL_VALUE = HOLDINGS_SUMMARY.reduce((s,h) => s+h.value, 0);

const _compactMnt = (n) => n >= 1e6 ? '₮' + (n/1e6).toFixed(1).replace(/\.0$/,'') + 'сая' : '₮' + Math.round(n/1e3) + 'мянга';
const MonthlyFlowChart = ({ data }) => {
  const [hi, setHi] = useState(null);
  const niceMax = Math.max(...data.map(d => Math.max(d.ret, d.loan)), 1);
  const VW = 720, VH = 168, zero = VH/2, half = VH/2 - 18, barW = 34;
  const slot = VW / data.length;
  const sc = v => (v / niceMax) * half;
  const active = hi != null ? data[hi] : null;
  const MONO = "'JetBrains Mono',monospace";
  return (
    <div style={{ background:T.surface, border:`1px solid ${T.line2}`, borderRadius:20, padding:'20px 22px' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
        <div>
          <div style={{ fontSize:15, fontWeight:800, color:T.ink, letterSpacing:'-0.01em' }}>Сарын урсгал</div>
          <div style={{ fontSize:12, color:T.muted, fontWeight:600, marginTop:3 }}>Сүүлийн 6 сар · ₮</div>
        </div>
        <div style={{ display:'flex', gap:16 }}>
          <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, fontWeight:700, color:T.text }}><span style={{ width:10, height:10, borderRadius:3, background:T.pos }}/>Буцаан олголт</span>
          <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, fontWeight:700, color:T.text }}><span style={{ width:10, height:10, borderRadius:3, background:T.neg }}/>Зээлийн төлөлт</span>
        </div>
      </div>
      <div style={{ display:'flex', gap:12, marginTop:18 }}>
        <div style={{ display:'flex', flexDirection:'column', justifyContent:'space-between', height:VH, fontSize:11, color:T.muted2, fontWeight:600, textAlign:'right', fontFamily:MONO }}>
          <span>+{_compactMnt(niceMax)}</span><span>0</span><span>−{_compactMnt(niceMax)}</span>
        </div>
        <div style={{ flex:1, minWidth:0, position:'relative' }}>
          {active && (
            <div style={{ position:'absolute', top:-8, left:`${((hi*slot+slot/2)/VW)*100}%`, transform:'translate(-50%,-100%)', background:T.ink, color:'#fff', borderRadius:10, padding:'9px 12px', fontSize:11.5, fontWeight:600, whiteSpace:'nowrap', pointerEvents:'none', boxShadow:'0 10px 24px -8px rgba(0,0,0,.45)', zIndex:3 }}>
              <div style={{ fontFamily:MONO, fontWeight:700, marginBottom:5, opacity:.85 }}>{active.m}</div>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}><span style={{ width:8, height:8, borderRadius:2, background:T.pos }}/>Буцаан олголт&nbsp;<span style={{ fontFamily:MONO, fontWeight:700, marginLeft:'auto', paddingLeft:10 }}>{window.formatMNT(active.ret)}</span></div>
              {active.loan > 0 && <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:4 }}><span style={{ width:8, height:8, borderRadius:2, background:T.neg }}/>Зээлийн төлөлт&nbsp;<span style={{ fontFamily:MONO, fontWeight:700, marginLeft:'auto', paddingLeft:10 }}>{window.formatMNT(active.loan)}</span></div>}
            </div>
          )}
          <svg width="100%" viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="none" onMouseLeave={() => setHi(null)} style={{ display:'block', height:VH, cursor:'pointer' }}>
            <line x1="0" y1={zero-half} x2={VW} y2={zero-half} stroke={T.line2} strokeWidth="1" strokeDasharray="4 4"/>
            <line x1="0" y1={zero+half} x2={VW} y2={zero+half} stroke={T.line2} strokeWidth="1" strokeDasharray="4 4"/>
            <line x1="0" y1={zero} x2={VW} y2={zero} stroke={T.line} strokeWidth="1.5"/>
            {data.map((d,i) => {
              const cx = i*slot + slot/2;
              const inH = sc(d.ret), outH = sc(d.loan);
              const on = hi === i, dim = hi != null && !on;
              return (
                <g key={i} onMouseEnter={() => setHi(i)} opacity={dim ? 0.32 : 1} style={{ transition:'opacity .15s' }}>
                  {on && <rect x={i*slot+2} y="0" width={slot-4} height={VH} rx="8" fill={T.field}/>}
                  <rect x={cx-barW/2} y={zero-inH} width={barW} height={inH} rx="4" fill={T.pos}/>
                  {d.loan > 0 && <rect x={cx-barW/2} y={zero} width={barW} height={outH} rx="4" fill={T.neg}/>}
                  <rect x={i*slot} y="0" width={slot} height={VH} fill="transparent"/>
                </g>
              );
            })}
          </svg>
          <div style={{ display:'flex', marginTop:6 }}>
            {data.map((d,i) => <div key={d.m} style={{ flex:1, textAlign:'center', fontSize:11, color: hi===i ? T.ink : T.muted, fontWeight: hi===i ? 800 : 600, fontFamily:MONO, transition:'color .15s' }}>{d.m.slice(5)}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
};

const HoldingsSummaryCard = ({ holdings, note }) => {
  const [hi, setHi] = useState(null);
  const MONO = "'JetBrains Mono',monospace";
  const rows  = holdings ? hsSummarize(holdings) : HOLDINGS_SUMMARY;
  const count = holdings ? holdings.length : HOLDINGS_TOTAL_COUNT;
  const total = rows.reduce((s,h) => s + h.value, 0) || 1;
  const R = 52, SW = 20, C = 2 * Math.PI * R;
  let acc = 0;
  const segs = rows.map((h) => {
    const frac = h.value / total;
    const seg = { ...h, frac, len: frac * C, off: acc };
    acc += frac * C;
    return seg;
  });
  const active = hi != null ? segs[hi] : null;
  return (
    <div style={{ background:T.surface, border:`1px solid ${T.line2}`, borderRadius:20, overflow:'hidden' }}>
      <div style={{ padding:'18px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:`1px solid ${T.line2}`, flexWrap:'wrap', gap:10 }}>
        <div>
          <div style={{ fontSize:15, fontWeight:800, color:T.ink, letterSpacing:'-0.01em' }}>Миний бүтээгдэхүүн</div>
          <div style={{ fontSize:12, color:T.muted, fontWeight:600, marginTop:3 }}>{count} идэвхтэй байршуулалт{note ? ' · ' + note : ''}</div>
        </div>
        <div className="num" style={{ fontSize:20, fontWeight:800, color:T.ink, fontFamily:MONO }}>{window.formatMNT(total)}</div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:22, padding:'22px 20px' }}>
        <div style={{ position:'relative', width:132, height:132, flexShrink:0 }}>
          <svg width="132" height="132" viewBox="0 0 132 132">
            <g transform="rotate(-90 66 66)">
              {segs.map((s,i) => (
                <circle key={s.type} cx="66" cy="66" r={R} fill="none"
                  stroke={s.c1} strokeWidth={hi===i ? SW+5 : SW}
                  strokeDasharray={`${Math.max(s.len-2,0)} ${C-Math.max(s.len-2,0)}`} strokeDashoffset={-s.off}
                  opacity={hi!=null && hi!==i ? 0.28 : 1}
                  onMouseEnter={() => setHi(i)} onMouseLeave={() => setHi(null)}
                  style={{ transition:'opacity .15s, stroke-width .15s', cursor:'pointer' }}/>
              ))}
            </g>
          </svg>
          <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', pointerEvents:'none', textAlign:'center', padding:'0 14px' }}>
            {active ? (
              <>
                <div style={{ fontSize:22, fontWeight:800, color:T.ink, fontFamily:MONO, letterSpacing:'-0.02em' }}>{Math.round(active.frac*100)}%</div>
                <div style={{ fontSize:10, color:T.muted, fontWeight:700, marginTop:2, lineHeight:1.2 }}>{active.label}</div>
              </>
            ) : (
              <>
                <div style={{ fontSize:10.5, color:T.muted, fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em' }}>Нийт</div>
                <div style={{ fontSize:14, fontWeight:800, color:T.ink, fontFamily:MONO, marginTop:3, letterSpacing:'-0.02em' }}>{window.formatMNT(total)}</div>
              </>
            )}
          </div>
        </div>
        <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:10 }}>
          {segs.map((s,i) => (
            <a key={s.type} href={`17 My Products.html?type=${s.type}`} title={`${s.label} — миний бүтээгдэхүүн дээр шүүж харах`}
              onMouseEnter={() => setHi(i)} onMouseLeave={() => setHi(null)}
              style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer', textDecoration:'none', opacity: hi!=null && hi!==i ? 0.42 : 1, transition:'opacity .15s' }}>
              <span style={{ width:11, height:11, borderRadius:3, background:s.c1, flexShrink:0 }}/>
              <div className="truncate" style={{ flex:1, minWidth:0, fontSize:12.5, fontWeight:700, color:T.ink }}>{s.label}</div>
              <div style={{ textAlign:'right', flexShrink:0 }}>
                <div className="num" style={{ fontSize:12.5, fontWeight:800, color:T.ink, fontFamily:MONO }}>{Math.round(s.frac*100)}%</div>
                <div className="num" style={{ fontSize:10.5, color:T.muted, fontWeight:600, fontFamily:MONO, marginTop:1 }}>{window.formatMNT(s.value)}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
      <div style={{ padding:'14px 20px', borderTop:`1px solid ${T.line2}`, background:T.field }}>
        <a href="17 My Products.html" style={{ fontSize:13, fontWeight:700, color:T.indigo, textDecoration:'none' }}>Бүх бүтээгдэхүүнээ харах →</a>
      </div>
    </div>
  );
};

Object.assign(window, {
  MonthlyFlowChart, HoldingsSummaryCard, hsSummarize,
  FLOW_DATA, HOLDINGS_SUMMARY, HOLDINGS_TOTAL_COUNT, HOLDINGS_TOTAL_VALUE, HS_TYPE, HS_TYPE_ORDER,
});
