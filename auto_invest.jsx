// ============================================================
// AUTO-INVEST — isolated flow prototype (Арилжаа copy + setup wizard)
// v2 after usability audit: 3 setup steps (was 4), reactive matching
// engine, min-ticket handling, start-date choice, working back/pause,
// skip rules for the no-match / no-funds cases, closed loop back to
// the Арилжаа page with an active-plan card.
// Pattern synthesis: Robinhood (start date, backup payment, runs until
// paused), Coinbase (first buy executes immediately), Binance (plan hub).
// ============================================================
const { useState: useStateAI, useEffect: useEffectAI } = React;

const AI = {
  indigo: C.indigo, ink: C.ink, muted: C.muted, muted2: C.muted2,
  line: C.line, line2: C.line2, green: C.green, amber: C.amber, red: C.red,
  soft: C.indigoSoft || '#EEF0FE', greenSoft: C.greenSoft || '#EAF8F0', amberSoft: C.amberSoft || '#FEF6E7',
};
const aiFmt = (n) => n.toLocaleString('en-US');

// Live market used by the matching engine. AUTO-INVEST IS PRIMARY-MARKET ONLY
// and covers Сертификат (3/6/12 сар) + Итгэлцэл (6/12 сар).
// Nominal unit price is fixed per product class: ₮100,000 / ₮1,000,000.
const AI_MK = (t, term, rows) => rows.map(([ticker, issuer, kind, y]) => ({
  m:'primary', t, term, ticker, issuer, kind, y, stab: kind === 'Банк' ? 3 : 1,
  min: t === 'Итгэлцэл' ? 1000000 : 100000,
}));
const AI_MARKET = [
  ...AI_MK('Сертификат', 3, [
    ['KHAN 1220','Хаан Банк','Банк',12.2],['GLMT 1250','Голомт Банк','Банк',12.5],
    ['TDB 1240','Худалдаа Банк','Банк',12.4],['XAC 1280','Хас Банк','Банк',12.8],
    ['CAPIT 1310','Капитрон Банк','Банк',13.1],['NOMFI 1450','Ном Финанс ББСБ','ББСБ',14.5],
    ['INVSC 1520','Инвескор ББСБ','ББСБ',15.2],
  ]),
  ...AI_MK('Сертификат', 6, [
    ['KHAN 1380','Хаан Банк','Банк',13.8],['GLMT 1400','Голомт Банк','Банк',14.0],
    ['TDB 1390','Худалдаа Банк','Банк',13.9],['CAPIT 1460','Капитрон Банк','Банк',14.6],
    ['ARIG 1510','Ариг Банк','Банк',15.1],['NOMFI 1720','Ном Финанс ББСБ','ББСБ',17.2],
    ['ARDCR 1780','Ард Кредит ББСБ','ББСБ',17.8],
  ]),
  ...AI_MK('Сертификат', 12, [
    ['KHAN 1480','Хаан Банк','Банк',14.8],['TDB 1500','Худалдаа Банк','Банк',15.0],
    ['GLMT 1520','Голомт Банк','Банк',15.2],['CAPIT 1450','Капитрон Банк','Банк',15.5],
    ['XAC 1560','Хас Банк','Банк',15.6],['BOGD 1690','Богд Банк','Банк',16.9],
    ['NOMFI 1820','Ном Финанс ББСБ','ББСБ',18.2],['INVSC 1880','Инвескор ББСБ','ББСБ',18.8],
  ]),
  ...AI_MK('Итгэлцэл', 6, [
    ['GLMTR 1900','Голомт Итгэлцэл','Банк',19.0],['TDBTR 1950','ХХБ Итгэлцэл','Банк',19.5],
    ['ARDCR 2080','Ард Кредит ББСБ','ББСБ',20.8],['MSTRT 2130','Кредитекс СТМ','ББСБ',21.3],
    ['MNDL 2150','Мандал Финанс','ББСБ',21.5],['INVSC 2200','Инвескор ББСБ','ББСБ',22.0],
  ]),
  ...AI_MK('Итгэлцэл', 12, [
    ['TDBTR 2050','ХХБ Итгэлцэл','Банк',20.5],['GLMTR 2100','Голомт Итгэлцэл','Банк',21.0],
    ['ARDCR 2280','Ард Кредит ББСБ','ББСБ',22.8],['MNDL 2350','Мандал Финанс','ББСБ',23.5],
    ['INVSC 2400','Инвескор ББСБ','ББСБ',24.0],['SNDBX 2450','Сэндибокс ББСБ','ББСБ',24.5],
    ['GOLDH 2560','Голден Хилл ББСБ','ББСБ',25.6],
  ]),
];
const aiMatch = (cfg) => AI_MARKET.filter(p => cfg.types.includes(p.t) && (cfg.maxTerm === 0 || p.term <= cfg.maxTerm));
// бүтээгдэхүүний төрөл + тухайн бүтээгдэхүүний хугацаагаар тохирох сан
const AI_TERMS = { 'Сертификат': [3, 6, 12], 'Итгэлцэл': [6, 12] };
const aiPool = (cfg) => AI_MARKET.filter(p => p.t === (cfg.types[0] || 'Сертификат') && p.term === cfg.term);
const AI_DEFAULT = {
  market:'primary', types:['Сертификат'], term:12, maxTerm:12,
  units:5, amount:500000,
  freq:'Сар бүр', payDay:25, payWd:0, day:'25', start:'today', accumulate:true,
  endMode:'unlimited', endYears:3, endDate:null,
  order:[], picked:[],
};
// One product type per plan — the nominal unit price follows from it.
const AI_TICKET = { 'Сертификат': 100000, 'Итгэлцэл': 1000000 };
const aiType = (cfg) => cfg.types[0] || 'Сертификат';
const aiUnitPrice = (cfg) => AI_TICKET[aiType(cfg)] || 100000;
const aiMinTicket = (cfg) => AI_TICKET[aiType(cfg)] || 100000;
const aiAmountSteps = (cfg) => aiMinTicket(cfg) === 1000000 ? [1000000, 2000000, 3000000, 5000000] : [100000, 300000, 500000, 1000000];
// Editing an existing plan: always include its current amount so it is never invisible.
const aiEditSteps = (cfg) => {
  const st = aiAmountSteps(cfg);
  return st.includes(cfg.amount) ? st : [cfg.amount, ...st].sort((a, b) => a - b).slice(0, 4);
};
const aiStable = () => false;
// Prioritisation is now an explicit, user-ordered list — no yield/stability switch.
const aiStrategyLabel = (cfg) => (cfg.picked && cfg.picked.length)
  ? 'Эрэмбэлсэн ' + cfg.picked.length + ' бүтээгдэхүүн'
  : 'Эрэмбэ тохируулаагүй';
const aiPerYear = (f) => f === 'Өдөр бүр' ? 250 : f === 'Сар бүр' ? 12 : f === '14 хоног бүр' ? 26 : 52;
const aiMarketLabel = (m) => m === 'both' ? 'Анхдагч + Хоёрдогч зах' : m === 'primary' ? 'Зөвхөн Анхдагч зах' : 'Зөвхөн Хоёрдогч зах';
const aiTermLabel = (t) => t === 0 ? 'Хязгааргүй' : t + ' сар хүртэл';
const aiNextDate = (cfg) => cfg.freq === 'Сар бүр' ? '8 сарын ' + cfg.day : cfg.freq === 'Өдөр бүр' ? 'Маргааш' : cfg.freq === '7 хоног бүр' ? 'Дараа 7 хоногт' : 'Дараа 14 хоногт';
const aiPastDate = (cfg) => cfg.freq === 'Сар бүр' ? '6 сарын ' + cfg.day : cfg.freq === 'Өдөр бүр' ? 'Өчигдөр' : cfg.freq === '7 хоног бүр' ? '7 хоногийн өмнө' : '14 хоногийн өмнө';

// ---------- atoms ----------
const AiBar = ({ title, step, total, onBack, onCancel }) => {
  const [ask, setAsk] = useStateAI(false);
  return (
  <div style={{ padding:'6px 24px 10px', flexShrink:0 }}>
    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
      <button onClick={onBack} aria-label="Буцах" style={{ width:36, height:36, borderRadius:11, background:'#fff', border:`1px solid ${AI.line}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke={AI.ink} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <div style={{ flex:1, fontSize:16, fontWeight:800, color:AI.ink, letterSpacing:'-0.01em' }}>{title}</div>
      {step && <span style={{ fontSize:11.5, fontWeight:700, color:AI.muted, fontVariantNumeric:'tabular-nums' }}>{step}/{total}</span>}
      {onCancel && (
        <button onClick={()=>setAsk(true)} aria-label="Хаах" style={{ width:36, height:36, borderRadius:11, background:'#fff', border:`1px solid ${AI.line}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M7 7l10 10M17 7L7 17" stroke={AI.ink} strokeWidth="2.2" strokeLinecap="round"/></svg>
        </button>
      )}
    </div>
    {step && (
      <div style={{ marginTop:12, height:4, borderRadius:999, background:'#E7E9F2', overflow:'hidden' }}>
        <div style={{ width:`${step/total*100}%`, height:'100%', borderRadius:999, background:AI.indigo, transition:'width .3s ease' }}></div>
      </div>
    )}
    {ask && (
      <div style={{ position:'absolute', inset:0, zIndex:30, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
        <div onClick={()=>setAsk(false)} style={{ position:'absolute', inset:0, background:'rgba(15,20,55,.42)' }}></div>
        <div style={{ position:'relative', width:'100%', background:'#fff', borderRadius:22, padding:'22px 20px 18px', boxShadow:'0 20px 50px -12px rgba(15,20,55,.4)' }}>
          <div style={{ fontSize:16.5, fontWeight:800, color:AI.ink, letterSpacing:'-0.01em' }}>Тохиргоог зогсоох уу?</div>
          <div style={{ fontSize:12.5, color:AI.muted, marginTop:8, lineHeight:1.6 }}>Одоог хүртэл сонгосон нөхцөлүүд хадгалагдахгүй. Автомат хөрөнгө оруулалт үүсэхгүй.</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:18 }}>
            <button onClick={()=>{ setAsk(false); onCancel && onCancel(); }} style={{ height:48, borderRadius:14, background:AI.red || '#D6455D', border:'none', color:'#fff', fontSize:13.5, fontWeight:700, cursor:'pointer' }}>Тийм, зогсооно</button>
            <button onClick={()=>setAsk(false)} style={{ height:48, borderRadius:14, background:'#fff', border:`1.5px solid ${AI.line}`, color:AI.ink, fontSize:13.5, fontWeight:700, cursor:'pointer' }}>Үргэлжлүүлэх</button>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

const aiBest = (cfg) => aiMatch(cfg).filter(p => p.min <= cfg.amount)
  .sort((a, b) => aiStable(cfg) ? (b.stab - a.stab || b.y - a.y) : (b.y - a.y))[0];

const AiCta = ({ label, onClick, sub, disabled, secondary, onSecondary }) => (
  <div style={{ padding:'12px 24px 16px', flexShrink:0, background:'linear-gradient(transparent, #F4F6FA 40%)' }}>
    {sub && <div style={{ fontSize:11, color:AI.muted, textAlign:'center', marginBottom:8, lineHeight:1.5 }}>{sub}</div>}
    <button onClick={disabled ? undefined : onClick} {...(disabled ? { 'data-nodrag': '' } : {})} style={{ width:'100%', height:52, borderRadius:15, background: disabled ? '#E7E9F2' : AI.indigo, color: disabled ? AI.muted2 : '#fff', border:'none', fontWeight:700, fontSize:15, cursor: disabled ? 'default' : 'pointer', boxShadow: disabled ? 'none' : '0 10px 24px -8px rgba(79,70,229,.5)' }}>{label}</button>
    {secondary && <button onClick={onSecondary} data-nodrag style={{ width:'100%', height:46, marginTop:8, borderRadius:14, background:'transparent', border:'none', color:AI.muted, fontWeight:700, fontSize:13.5, cursor:'pointer' }}>{secondary}</button>}
  </div>
);

const AiChip = ({ label, active, onClick, sub }) => (
  <button onClick={onClick} style={{ padding: sub ? '8px 14px' : '9px 15px', borderRadius:999, fontSize:13, fontWeight:700, cursor:'pointer', background: active ? AI.ink : '#fff', color: active ? '#fff' : C.text, border:`1px solid ${active ? AI.ink : AI.line}`, whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:6 }}>
    {label}{sub && <span style={{ fontSize:10.5, fontWeight:700, opacity:.6 }}>{sub}</span>}
  </button>
);

const AiToggle = ({ on, onClick, label }) => (
  <button onClick={onClick} aria-label={label} style={{ width:46, height:28, borderRadius:999, border:'none', cursor:'pointer', background: on ? AI.indigo : '#D9DCE7', position:'relative', transition:'background .2s', flexShrink:0 }}>
    <span style={{ position:'absolute', top:3, left:3, width:22, height:22, borderRadius:999, background:'#fff', boxShadow:'0 2px 6px rgba(0,0,0,.2)', transform: on ? 'translateX(18px)' : 'none', transition:'transform .2s', pointerEvents:'none' }}></span>
  </button>
);

const AiNote = ({ tone = 'info', children }) => {
  const map = { info:[AI.soft, AI.indigo, AI.ink], warn:[AI.amberSoft, AI.amber, '#7A5410'], good:[AI.greenSoft, AI.green, AI.ink] };
  const [bg, ic, fg] = map[tone];
  return (
    <div style={{ display:'flex', gap:9, alignItems:'flex-start', padding:'13px 15px', borderRadius:14, background:bg, border:`1px solid ${ic}22` }}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:1 }}>
        {tone === 'warn'
          ? <React.Fragment><path d="M12 4L2.5 20h19L12 4z" stroke={ic} strokeWidth="2" strokeLinejoin="round"/><path d="M12 10v4M12 17h.01" stroke={ic} strokeWidth="2" strokeLinecap="round"/></React.Fragment>
          : <React.Fragment><circle cx="12" cy="12" r="9" stroke={ic} strokeWidth="2"/><path d="M12 16v-4M12 8h.01" stroke={ic} strokeWidth="2" strokeLinecap="round"/></React.Fragment>}
      </svg>
      <div style={{ fontSize:12, color:fg, lineHeight:1.55, fontWeight:600 }}>{children}</div>
    </div>
  );
};

const AiRow = ({ l, v, strong }) => (
  <div style={{ display:'flex', justifyContent:'space-between', gap:14, padding:'11px 0', borderTop:`1px solid ${AI.line2}` }}>
    <span style={{ fontSize:12.5, color:AI.muted, fontWeight:600, flexShrink:0 }}>{l}</span>
    <span style={{ fontSize:12.5, fontWeight: strong ? 800 : 700, color: strong ? AI.indigo : AI.ink, textAlign:'right' }}>{v}</span>
  </div>
);

const AiPlanIcon = ({ size = 42, r = 13 }) => (
  <div style={{ width:size, height:size, borderRadius:r, background:AI.soft, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
    <svg width={size*0.48} height={size*0.48} viewBox="0 0 24 24" fill="none"><path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke={AI.indigo} strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="12" r="5.5" stroke={AI.indigo} strokeWidth="2"/></svg>
  </div>
);

// Prototype-only switch: which of the two stakeholder options is on show.
const AiVariantSwitch = ({ value, onPick }) => (
  <div style={{ marginTop:20, border:`1px dashed ${AI.line}`, borderRadius:14, padding:'10px 12px 12px', background:'rgba(255,255,255,.5)' }}>
    <div style={{ fontFamily:'JetBrains Mono, monospace', fontSize:9.5, fontWeight:700, letterSpacing:'0.1em', color:AI.muted2, textTransform:'uppercase' }}>Stakeholder шийдвэрлэх</div>
    <div style={{ display:'flex', gap:6, marginTop:8 }}>
      {[['a','A · Автомат'],['b','B · Сонголттой']].map(([k, l]) => (
        <button key={k} onClick={()=>onPick(k)} style={{ flex:1, height:32, borderRadius:9, cursor:'pointer', border:`1px solid ${value===k ? AI.indigo : AI.line}`, background: value===k ? AI.soft : '#fff', color: value===k ? AI.indigo : AI.muted, fontWeight:700, fontSize:11.5 }}>{l}</button>
      ))}
    </div>
  </div>
);

const AiRadioCard = ({ active, onClick, title, desc, meta }) => (
  <button onClick={onClick} style={{ width:'100%', textAlign:'left', display:'block', padding:'15px 16px', borderRadius:18, cursor:'pointer', background:'#fff', border:`1px solid ${active ? AI.indigo : AI.line2}`, boxShadow: active ? `0 0 0 1px ${AI.indigo}, 0 6px 18px -10px rgba(49,52,140,.45)` : '0 1px 2px rgba(16,24,40,.04)', transition:'box-shadow .18s ease, border-color .18s ease' }}>
    <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:14, fontWeight:800, color:AI.ink, letterSpacing:'-.01em' }}>{title}</div>
        <div style={{ fontSize:11.5, color:AI.muted, marginTop:3, lineHeight:1.5 }}>{desc}</div>
      </div>
      <span style={{ width:22, height:22, borderRadius:999, flexShrink:0, marginTop:1, background: active ? AI.indigo : '#fff', border:`${active ? 0 : 1.5}px solid #D3D7E6`, display:'flex', alignItems:'center', justifyContent:'center', transition:'background .18s ease' }}>
        {active && <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </span>
    </div>
    {meta && <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:11 }}>
      {String(meta).split(' · ').map((m, i) => (
        <span key={i} style={{ fontSize:10.5, fontWeight:700, color: active ? AI.indigo : AI.muted2, background: active ? AI.soft : '#F4F5F9', borderRadius:7, padding:'4px 8px', whiteSpace:'nowrap' }}>{m}</span>
      ))}
    </div>}
  </button>
);

// ============================================================
// 1 & 10 — Арилжаа page (isolated copy). hasPlan closes the loop.
// ============================================================
const AITrade = ({ onNext, cfg, hasPlan }) => {
  const primary = [
    { issuer:'Капитрон Банк ХК', type:'Сертификат', yield:'14.5', term:'12 сар', c:'#1677FF' },
    { issuer:'Голден Хилл Партнерс', type:'Итгэлцэл', yield:'23.0', term:'12 сар', c:'#F59E0B' },
  ];
  const secondary = [
    { ticker:'CAPIT 1450 CD', real:'15.2', term:'278 хоног' },
    { ticker:'GOLDH 2300 IT', real:'24.8', term:'327 хоног' },
  ];
  return (
    <Frame label={hasPlan ? 'AI-10 — Арилжаа · төлөвлөгөөтэй' : 'AI-1 — Арилжаа + оролт'}>
      <div style={{ padding:'6px 24px 12px', flexShrink:0 }}>
        <div style={{ fontSize:24, fontWeight:800, color:AI.ink, letterSpacing:'-0.02em' }}>Арилжаа</div>
        <div style={{ marginTop:12, height:44, borderRadius:14, background:'#fff', border:`1px solid ${AI.line}`, display:'flex', alignItems:'center', padding:'0 14px', gap:10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6" stroke={AI.muted} strokeWidth="2"/><path d="M16 16l4 4" stroke={AI.muted} strokeWidth="2" strokeLinecap="round"/></svg>
          <span style={{ color:AI.muted2, fontSize:14 }}>Тикер, арилжаа хайх</span>
        </div>
      </div>
      <div style={{ flex:1, overflow:'auto', padding:'0 24px 100px' }}>
        {hasPlan ? (
          <button onClick={onNext} style={{ width:'100%', textAlign:'left', background:'#fff', borderRadius:20, border:`1px solid ${AI.line2}`, padding:16, cursor:'pointer', display:'flex', alignItems:'center', gap:13 }}>
            <AiPlanIcon/>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                <span style={{ fontSize:13.5, fontWeight:800, color:AI.ink }}>Автомат хөрөнгө оруулалт</span>
                <span style={{ width:6, height:6, borderRadius:999, background:AI.green }}></span>
              </div>
              <div style={{ fontSize:11.5, color:AI.muted, marginTop:3 }}>₮ {aiFmt(cfg.amount)} · {cfg.freq} · дараагийн {aiNextDate(cfg)}</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke={AI.muted2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        ) : (
          <button onClick={onNext} style={{ width:'100%', textAlign:'left', border:'none', borderRadius:20, padding:18, cursor:'pointer', position:'relative', overflow:'hidden', background:`linear-gradient(120deg, ${C.navy} 0%, ${AI.indigo} 100%)`, color:'#fff' }}>
            <div style={{ position:'absolute', right:-30, top:-30, opacity:.2 }}><LogoMark size={120}/></div>
            <div style={{ position:'relative' }}>
              <span style={{ fontSize:10, fontWeight:800, background:C.orange, padding:'4px 9px', borderRadius:999, letterSpacing:'0.04em' }}>ШИНЭ</span>
              <div style={{ fontSize:17, fontWeight:800, marginTop:10, letterSpacing:'-0.01em' }}>Автомат хөрөнгө оруулалт</div>
              <div style={{ fontSize:12, opacity:.75, marginTop:5, lineHeight:1.5, maxWidth:270 }}>Тогтмол хугацаанд, тогтмол дүнгээр — зах зээлийг ажиглах шаардлагагүй.</div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, marginTop:12, background:'#fff', color:AI.ink, fontWeight:700, fontSize:12.5, padding:'9px 14px', borderRadius:11 }}>
                Төлөвлөгөө үүсгэх
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke={AI.ink} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          </button>
        )}

        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginTop:20, marginBottom:12 }}>
          <div>
            <div style={{ fontSize:14, fontWeight:800, color:AI.ink }}>Анхдагч зах</div>
            <div style={{ fontSize:11, color:AI.muted, fontWeight:600, marginTop:2 }}>Шинэ гаргалт · 3 нээлттэй</div>
          </div>
          <span style={{ fontSize:12, color:AI.indigo, fontWeight:700 }}>Бүгд →</span>
        </div>
        <div style={{ display:'flex', gap:12, overflowX:'auto', marginLeft:-24, paddingLeft:24, paddingRight:24, marginRight:-24 }}>
          {primary.map((p, i) => (
            <div key={i} style={{ minWidth:230, background:'#fff', borderRadius:20, padding:16, border:`1px solid ${AI.line2}`, flexShrink:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:p.c, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:13 }}>{p.issuer.charAt(0)}</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:AI.ink, lineHeight:1.2 }}>{p.issuer}</div>
                  <div style={{ fontSize:10, color:AI.muted, marginTop:2 }}>{p.type}</div>
                </div>
              </div>
              <div style={{ display:'flex', gap:18, marginTop:14 }}>
                <div><div style={{ fontSize:10, color:AI.muted, fontWeight:600 }}>Үр шим</div><div style={{ fontSize:16, fontWeight:800, color:p.c, marginTop:2 }}>{p.yield}%</div></div>
                <div><div style={{ fontSize:10, color:AI.muted, fontWeight:600 }}>Хугацаа</div><div style={{ fontSize:12, fontWeight:600, color:AI.ink, marginTop:4 }}>{p.term}</div></div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop:20, marginBottom:12 }}>
          <div style={{ fontSize:14, fontWeight:800, color:AI.ink }}>Хоёрдогч зах</div>
          <div style={{ fontSize:11, color:AI.muted, fontWeight:600, marginTop:2 }}>Бусад хэрэглэгчийн зарах санал</div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {secondary.map((s, i) => (
            <div key={i} style={{ background:'#fff', borderRadius:16, padding:'13px 16px', border:`1px solid ${AI.line2}`, display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:700, color:AI.ink }}>{s.ticker}</div>
                <div style={{ fontSize:11, color:AI.muted, marginTop:2 }}>{s.term}</div>
              </div>
              <div style={{ fontSize:14, fontWeight:800, color:AI.green }}>{s.real}%</div>
            </div>
          ))}
        </div>
      </div>
      <BottomTabs active="trade"/>
    </Frame>
  );
};

// ============================================================
// 2 — Intro
// ============================================================
const AIIntro = ({ onNext, onBack }) => (
  <Frame label="AI-2 — Танилцуулга">
    <AiBar title="Автомат хөрөнгө оруулалт" onBack={onBack}/>
    <div style={{ flex:1, overflow:'auto', padding:'8px 24px 16px' }}>
      <div style={{ borderRadius:22, padding:'26px 20px', background:`linear-gradient(135deg, ${C.navy} 0%, ${AI.indigo} 100%)`, color:'#fff', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', left:-40, bottom:-40, opacity:.15 }}><LogoMark size={160}/></div>
        <div style={{ position:'relative' }}>
          <div style={{ width:60, height:60, borderRadius:18, background:'rgba(255,255,255,.12)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="12" r="5.5" stroke="#fff" strokeWidth="2"/><path d="M12 9.5v2.5l1.8 1.4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </div>
          <div style={{ fontSize:20, fontWeight:800, marginTop:14, letterSpacing:'-0.01em' }}>Хөрөнгө чинь өөрөө ажиллана</div>
          <div style={{ fontSize:12.5, opacity:.75, marginTop:8, lineHeight:1.6 }}>Та дүн, давтамжаа нэг удаа тохируулна. Бид таны шалгуурт нийцсэн хамгийн өндөр өгөөжтэй бүтээгдэхүүнийг автоматаар худалдан авна.</div>
        </div>
      </div>
      {[
        { n:'1', t:'Юу авахаа сонгоно', d:'Бүтээгдэхүүний төрөл, дээд хугацаа. Зөвхөн Анхдагч зах.' },
        { n:'2', t:'Дүн, давтамжаа сонгоно', d:'Жишээ нь: сар бүрийн 25-нд ₮500,000.' },
        { n:'3', t:'Бид гүйцэтгэнэ', d:'Сонгосон зарчмаар хамгийн тохирохыг нь авч, мэдэгдэл илгээнэ.' },
      ].map((s, i) => (
        <div key={i} style={{ display:'flex', gap:14, alignItems:'flex-start', marginTop: i ? 14 : 20, padding:'0 4px' }}>
          <div style={{ width:32, height:32, borderRadius:10, background:AI.soft, color:AI.indigo, fontWeight:800, fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{s.n}</div>
          <div>
            <div style={{ fontSize:13.5, fontWeight:800, color:AI.ink }}>{s.t}</div>
            <div style={{ fontSize:12, color:AI.muted, marginTop:3, lineHeight:1.55 }}>{s.d}</div>
          </div>
        </div>
      ))}
      <div style={{ marginTop:18 }}><AiNote>Хүссэн үедээ түр зогсоох, өөрчлөх, цуцлах боломжтой. Урьдчилсан төлбөр, шимтгэлгүй.</AiNote></div>
    </div>
    <AiCta label="Эхлэх" onClick={onNext} sub="Тохиргоо 3 алхамтай, 1 минут орчим"/>
  </Frame>
);

// ============================================================
// 3 — What to buy (market + criteria merged, reactive matching)
// ============================================================
const AICriteria = ({ onNext, onBack, onCancel, cfg, set }) => {
  const pickType = (t) => {
    const terms = AI_TERMS[t] || [12];
    const term = terms.includes(cfg.term) ? cfg.term : terms[terms.length - 1];
    set({ types:[t], term, maxTerm:term, amount: cfg.units * (AI_TICKET[t] || 100000), order:[], picked:[] });
  };
  const matches = AI_MARKET.filter(p => p.t === aiType(cfg));
  return (
    <Frame label="AI-3 — Юу худалдан авах">
      <AiBar title="Юу худалдан авах вэ?" step={1} total={9} onBack={onBack} onCancel={onCancel}/>
      <div style={{ flex:1, overflow:'auto', padding:'12px 24px 16px' }}>
        <div style={{ padding:'12px 14px', borderRadius:13, background:'#fff', border:`1px solid ${AI.line2}`, display:'flex', alignItems:'center', gap:10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0 }}><circle cx="12" cy="12" r="9" stroke={AI.muted2} strokeWidth="2"/><path d="M12 16v-4M12 8h.01" stroke={AI.muted2} strokeWidth="2" strokeLinecap="round"/></svg>
          <div style={{ fontSize:11.5, color:AI.muted, fontWeight:600, lineHeight:1.5 }}>Автомат хөрөнгө оруулалт зөвхөн <b style={{ color:AI.ink }}>Анхдагч зах зээл</b> дээр ажиллана.</div>
        </div>
        <div style={{ fontSize:13, fontWeight:800, color:AI.ink, marginTop:20 }}>Бүтээгдэхүүний төрөл <span style={{ fontWeight:600, color:AI.muted, fontSize:11.5 }}>(нэгийг сонгоно)</span></div>
        <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:10 }}>
          {[['Сертификат','Банкны хадгаламжийн сертификат','Нэгжийн үнэ ₮ 100,000 · 3/6/12 сар'],['Итгэлцэл','ББСБ-ын итгэлцлийн нэгж','Нэгжийн үнэ ₮ 1,000,000 · 6/12 сар']].map(([t, d, m]) => (
            <AiRadioCard key={t} active={aiType(cfg)===t} onClick={()=>pickType(t)} title={t} desc={d} meta={m}/>
          ))}
        </div>
      </div>
      <AiCta label="Үргэлжлүүлэх" onClick={onNext}/>
    </Frame>
  );
};

// ============================================================
// 4 — Amount + frequency + start date (min-ticket aware)
// ============================================================
const AIAmount = ({ onNext, onBack, onCancel, cfg, set }) => {
  const matches = aiMatch(cfg);
  const afford = matches.filter(p => p.min <= cfg.amount);
  const minTicket = aiMinTicket(cfg);
  const steps = aiAmountSteps(cfg);
  const cheapest = matches.length ? Math.min(...matches.map(p => p.min)) : 0;
  const perYear = aiPerYear(cfg.freq);
  return (
    <Frame label="AI-4 — Дүн, давтамж">
      <AiBar title="Хэдээр, хэзээ?" step={2} total={3} onBack={onBack} onCancel={onCancel}/>
      <div style={{ flex:1, overflow:'auto', padding:'12px 24px 16px' }}>
        <div style={{ fontSize:13, fontWeight:800, color:AI.ink }}>Нэг удаагийн дүн</div>
        <button style={{ width:'100%', marginTop:10, background:'#fff', borderRadius:16, border:`1px solid ${AI.line2}`, padding:'16px 18px', display:'flex', alignItems:'center', gap:6, cursor:'pointer', textAlign:'left' }}>
          <span style={{ fontSize:20, fontWeight:800, color:AI.muted2 }}>₮</span>
          <span style={{ flex:1, fontSize:28, fontWeight:800, color:AI.ink, fontVariantNumeric:'tabular-nums', letterSpacing:'-0.02em' }}>{aiFmt(cfg.amount)}</span>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M4 20h4L19 9l-4-4L4 16v4z" stroke={AI.muted2} strokeWidth="2" strokeLinejoin="round"/></svg>
        </button>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:10 }}>
          {steps.map(v => (
            <button key={v} onClick={()=>set({ amount:v })} style={{ height:40, borderRadius:12, fontSize:13, fontWeight:700, cursor:'pointer', background: cfg.amount===v ? AI.ink : '#fff', color: cfg.amount===v ? '#fff' : C.text, border:`1px solid ${cfg.amount===v ? AI.ink : AI.line}` }}>₮{aiFmt(v)}</button>
          ))}
        </div>
        <div style={{ fontSize:11.5, color: cfg.amount < minTicket ? AI.amber : AI.muted, fontWeight:700, marginTop:9 }}>
          {aiType(cfg)}-ийн нэгж үнэ ₮ {aiFmt(minTicket)} — доод дүн {cfg.amount < minTicket ? '(хүрэхгүй байна)' : '✓'}
        </div>

        <div style={{ fontSize:13, fontWeight:800, color:AI.ink, marginTop:20 }}>Давтамж</div>
        <div style={{ display:'flex', gap:8, marginTop:10 }}>
          {['7 хоног бүр','14 хоног бүр','Сар бүр'].map(f => <AiChip key={f} label={f} active={cfg.freq===f} onClick={()=>set({ freq:f })}/>)}
        </div>
        {cfg.freq === 'Сар бүр' && (
          <React.Fragment>
            <div style={{ fontSize:13, fontWeight:800, color:AI.ink, marginTop:20 }}>Гүйцэтгэх өдөр</div>
            <div style={{ display:'flex', gap:8, marginTop:10 }}>
              {['1','15','25'].map(d => <AiChip key={d} label={'Сарын ' + d} active={cfg.day===d} onClick={()=>set({ day:d })}/>)}
            </div>
          </React.Fragment>
        )}

        <div style={{ fontSize:13, fontWeight:800, color:AI.ink, marginTop:20 }}>Хэзээ эхлэх</div>
        <div style={{ display:'flex', gap:8, marginTop:10 }}>
          <AiChip label="Өнөөдөр" active={cfg.start==='today'} onClick={()=>set({ start:'today' })}/>
          <AiChip label={'Дараагийн хуваарь' + (cfg.freq === 'Сар бүр' ? ' (8/' + cfg.day + ')' : '')} active={cfg.start==='next'} onClick={()=>set({ start:'next' })}/>
        </div>

        {/* min-ticket reality check */}
        <div style={{ marginTop:20 }}>
          {afford.length === 0
            ? <AiNote tone="warn"><b>{aiType(cfg)}</b>-ийн нэгж үнэ <b>₮{aiFmt(cheapest)}</b> — энэ дүн хүрэхгүй байна. Хуримтлуулах горимыг асаах эсвэл дүнгээ нэмнэ үү.</AiNote>
            : <AiNote>Энэ дүнгээр <b>{aiType(cfg)}</b>-ийн {Math.floor(cfg.amount / minTicket)} нэгж хүртэл авах боломжтой ({afford.length}/{matches.length} бүтээгдэхүүн).</AiNote>}
        </div>
        <div style={{ marginTop:12, background:'#fff', borderRadius:16, border:`1px solid ${AI.line2}`, padding:'14px 16px', display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:800, color:AI.ink }}>Хүрэлцэхгүй бол хуримтлуулах</div>
            <div style={{ fontSize:11.5, color:AI.muted, marginTop:3, lineHeight:1.5 }}>Нэгж үнэд хүрэхгүй бол мөнгө хэтэвчинд хуримтлагдаж, хүрэлцсэн үед худалдан авна.</div>
          </div>
          <AiToggle on={cfg.accumulate} onClick={()=>set({ accumulate:!cfg.accumulate })} label="Хуримтлуулах"/>
        </div>

        <div style={{ marginTop:16, padding:'14px 16px', borderRadius:16, background:'#fff', border:`1px solid ${AI.line2}` }}>
          <div style={{ fontSize:11, color:AI.muted, fontWeight:700 }}>Жилийн нийт хөрөнгө оруулалт</div>
          <div style={{ fontSize:20, fontWeight:800, color:AI.ink, marginTop:4, fontVariantNumeric:'tabular-nums' }}>₮ {aiFmt(cfg.amount * perYear)}</div>
          <div style={{ fontSize:11.5, color:AI.green, fontWeight:700, marginTop:3 }}>Төсөөлөх өгөөж: ~₮ {aiFmt(Math.round(cfg.amount * perYear * 0.09))} (16–18% жилийн)</div>
        </div>
      </div>
      <AiCta label="Үргэлжлүүлэх" onClick={onNext} disabled={afford.length === 0 && !cfg.accumulate}/>
    </Frame>
  );
};

// ============================================================
// 5 — Funding source
// ============================================================
const AIPayment = ({ onNext, onBack, onCancel, cfg, set, onNav }) => (
  <Frame label="AI-5 — Төлбөрийн эх үүсвэр">
    <AiBar title="Хаанаас төлөх вэ?" step={8} total={9} onBack={onBack} onCancel={onCancel}/>
    <div style={{ flex:1, overflow:'auto', padding:'12px 24px 16px' }}>
      <div style={{ background:'#fff', borderRadius:16, border:`1px solid ${AI.line2}`, padding:'15px 16px' }}>
        <div style={{ display:'flex', gap:13, alignItems:'center' }}>
          <div style={{ width:38, height:38, borderRadius:11, background:AI.soft, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="13" rx="3" stroke={AI.indigo} strokeWidth="2"/><path d="M16 12.5h2" stroke={AI.indigo} strokeWidth="2.4" strokeLinecap="round"/></svg>
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:14, fontWeight:800, color:AI.ink }}>Хэтэвчний үлдэгдэл</span>
              <span style={{ fontSize:10, fontWeight:800, color:AI.indigo, background:AI.soft, padding:'3px 8px', borderRadius:999 }}>Үндсэн</span>
            </div>
            <div style={{ fontSize:12, color:AI.muted, marginTop:3, fontVariantNumeric:'tabular-nums' }}>₮ 12,000,000</div>
          </div>
        </div>
        <div style={{ marginTop:13, padding:'13px 14px', borderRadius:13, background:'#FAFBFE', border:`1px solid ${AI.line2}` }}>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', gap:10 }}>
            <span style={{ fontSize:11, color:AI.muted, fontWeight:700 }}>Нэг удаад хасагдах</span>
            <span style={{ fontSize:19, fontWeight:800, color:AI.ink, letterSpacing:'-0.01em', fontVariantNumeric:'tabular-nums', whiteSpace:'nowrap' }}>₮ {aiFmt(cfg.amount)}</span>
          </div>
          <div style={{ marginTop:9, paddingTop:9, borderTop:`1px solid ${AI.line2}`, display:'flex', flexDirection:'column', gap:7 }}>
            <div style={{ display:'flex', justifyContent:'space-between', gap:10 }}>
              <span style={{ fontSize:11.5, color:AI.muted, fontWeight:600 }}>Давтамж</span>
              <span style={{ fontSize:12, fontWeight:700, color:AI.ink }}>{cfg.freq}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', gap:10 }}>
              <span style={{ fontSize:11.5, color:AI.muted, fontWeight:600 }}>Хасагдах өдөр</span>
              <span style={{ fontSize:12, fontWeight:700, color:AI.ink }}>{cfg.freq === 'Сар бүр' ? 'Сарын ' + (cfg.payDay || cfg.day) + '-нд' : cfg.freq === 'Өдөр бүр' ? 'Ажлын өдөр бүр' : 'Долоо хоног бүр'}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', gap:10 }}>
              <span style={{ fontSize:11.5, color:AI.muted, fontWeight:600 }}>Сард ойролцоогоор</span>
              <span style={{ fontSize:12, fontWeight:700, color:AI.ink, fontVariantNumeric:'tabular-nums' }}>₮ {aiFmt(Math.round(cfg.amount * aiPerYear(cfg.freq) / 12))}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop:14, display:'flex', alignItems:'center', gap:11, padding:'13px 14px', borderRadius:14, background:'#fff', border:`1px solid ${AI.line2}` }}>
        <div style={{ width:34, height:24, borderRadius:6, background:'#0E5F2E', color:'#fff', fontSize:8, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>ХБ</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:12.5, fontWeight:700, color:AI.ink }}>Хаан Банк •••• 4512</div>
          <div style={{ fontSize:10.5, color:AI.muted, marginTop:1 }}>Хасалт хийгдэх карт</div>
        </div>
        <button onClick={() => onNav && onNav('myCards')} style={{ fontSize:11.5, fontWeight:700, color:AI.indigo, cursor:'pointer', flexShrink:0, border:'none', background:'none', padding:0, fontFamily:'inherit' }}>Солих</button>
      </div>
      <div style={{ fontSize:11, color:AI.muted, marginTop:8, lineHeight:1.55 }}>Үлдэгдэл хүрэлцэхгүй тохиолдолд дутах дүнг картаас автоматаар хасна. Автомат төлөвлөгөөнд үүнийг тасалах боломжгүй.</div>

      <div style={{ marginTop:14 }}>
        <AiNote>Гүйцэтгэх өдөр тохирох бүтээгдэхүүн байхгүй бол <b>картаас мөнгө хасахгүй</b> — тэр өдрийг алгасаж, дараагийн хуваарьт дахин оролдоно.</AiNote>
      </div>
    </div>
    <AiCta label="Үргэлжлүүлэх" onClick={onNext}/>
  </Frame>
);

// ============================================================
// 6 — Review
// ============================================================
const AIReview = ({ onNext, onBack, cfg }) => (
  <Frame label="AI-6 — Баталгаажуулалт">
    <AiBar title="Төлөвлөгөөгөө хянана уу" onBack={onBack}/>
    <div style={{ flex:1, overflow:'auto', padding:'10px 24px 16px' }}>
      <div style={{ background:'#fff', borderRadius:20, border:`1px solid ${AI.line2}`, padding:'6px 18px 4px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 0' }}>
          <AiPlanIcon/>
          <div>
            <div style={{ fontSize:15, fontWeight:800, color:AI.ink, whiteSpace:'nowrap' }}>₮ {aiFmt(cfg.amount)} · {cfg.freq}</div>
            <div style={{ fontSize:11.5, color:AI.muted, marginTop:2 }}>{cfg.freq === 'Сар бүр' ? 'Сарын ' + cfg.day + '-нд гүйцэтгэнэ' : 'Тогтмол хуваариар гүйцэтгэнэ'}</div>
          </div>
        </div>
        <AiRow l="Зах зээл" v="Зөвхөн Анхдагч зах"/>
        <AiRow l="Төрөл" v={cfg.types.join(', ')}/>
        <AiRow l="Стратеги" v={aiStrategyLabel(cfg)} strong/>
        <AiRow l="Дээд хугацаа" v={aiTermLabel(cfg.maxTerm)}/>
        <AiRow l="Эх үүсвэр" v="Хэтэвч → карт (автомат)"/>
        <AiRow l="Хасах карт" v="•••• 4512 (Хаан Банк)"/>
        <AiRow l="Эхний гүйцэтгэл" v={cfg.start === 'today' ? 'Өнөөдөр (баталгаажмагц)' : aiNextDate(cfg)} strong/>
        <AiRow l="Дуусах хугацаа" v="Таныг зогсоох хүртэл"/>
      </div>

      <div style={{ fontSize:12.5, fontWeight:800, color:AI.ink, marginTop:18, marginBottom:8 }}>Онцгой тохиолдолд</div>
      <div style={{ background:'#fff', borderRadius:16, border:`1px solid ${AI.line2}`, padding:'4px 16px' }}>
        {[
          ['Тохирох бүтээгдэхүүн олдоогүй', 'Тэр өдрийг алгасана — картаас мөнгө хасахгүй. Дараагийн хуваарьт дахин оролдоно.'],
          ['Нэгж үнэд хүрэхгүй', cfg.accumulate ? 'Хуримтлуулж, хүрэлцсэн үед худалдан авна.' : 'Тухайн гүйцэтгэлийг алгасана.'],
          ['Картаас хасалт амжилтгүй', 'Гүйцэтгэл алгасаж, мэдэгдэл илгээнэ. Төлөвлөгөө цуцлагдахгүй.'],
        ].map(([t, d], i) => (
          <div key={i} style={{ padding:'12px 0', borderTop: i ? `1px solid ${AI.line2}` : 'none' }}>
            <div style={{ fontSize:12.5, fontWeight:700, color:AI.ink }}>{t}</div>
            <div style={{ fontSize:11.5, color:AI.muted, marginTop:3, lineHeight:1.5 }}>{d}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop:14 }}>
        <AiNote tone="warn">Хөрөнгө оруулалт эрсдэлтэй. Өнгөрсөн өгөөж ирээдүйн үр дүнг баталгаажуулахгүй.</AiNote>
      </div>
    </div>
    <AiCta label="Баталгаажуулах" onClick={onNext} sub="ПИН кодоор баталгаажуулна"/>
  </Frame>
);

// ============================================================
// 7 — PIN
// ============================================================
const AIPin = ({ onNext, cfg }) => (
  <PinConfirm
    label="AI-7 — ПИН код"
    title="Гүйлгээний ПИН код"
    subtitle="Автомат хөрөнгө оруулалтын төлөвлөгөөг идэвхжүүлэхийг баталгаажуулна уу."
    amount={cfg ? '₮ ' + aiFmt(cfg.amount) : undefined}
    amountLabel="Тогтмол дүн"
    ctaLabel="Идэвхжүүлэх"
    onConfirm={onNext}
  />
);

// ============================================================
// 8 — Success
// ============================================================
const AISuccess = ({ onNext, onGoto, cfg }) => {
  const first = aiBest(cfg);
  const accumulating = cfg.start === 'today' && !first && cfg.accumulate;
  return (
    <Frame label="AI-8 — Амжилттай">
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'0 28px', textAlign:'center' }}>
        <div style={{ width:84, height:84, borderRadius:26, background:AI.greenSoft, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke={AI.green} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{ fontSize:21, fontWeight:800, color:AI.ink, marginTop:22, letterSpacing:'-0.01em' }}>{(cfg.name && cfg.name.trim()) || 'Төлөвлөгөө'} идэвхжлээ</div>
        <div style={{ fontSize:13, color:AI.muted, marginTop:10, lineHeight:1.6 }}>
          {cfg.start === 'today' && first
            ? <React.Fragment>Эхний худалдан авалт хийгдэж байна: <b style={{ color:AI.ink }}>{first.ticker}</b> · {first.y}%</React.Fragment>
            : accumulating
              ? <React.Fragment>Тохирох нэгж үнэд хүрээгүй тул <b style={{ color:AI.ink }}>₮ {aiFmt(cfg.amount)}</b> хэтэвчинд хуримтлагдаж эхэллээ.</React.Fragment>
              : 'Эхний худалдан авалт товлосон өдөр хийгдэнэ.'}
        </div>
        <div style={{ marginTop:22, width:'100%', background:'#fff', borderRadius:18, border:`1px solid ${AI.line2}`, padding:'16px 18px', textAlign:'left' }}>
          <div style={{ display:'flex', justifyContent:'space-between', gap:12 }}>
            <span style={{ fontSize:12, color:AI.muted, fontWeight:600, flexShrink:0 }}>Төлөвлөгөө</span>
            <span style={{ fontSize:12, fontWeight:800, color:AI.ink, whiteSpace:'nowrap' }}>₮ {aiFmt(cfg.amount)} · {cfg.freq}</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:10, gap:12 }}>
            <span style={{ fontSize:12, color:AI.muted, fontWeight:600, flexShrink:0 }}>Дараагийн гүйцэтгэл</span>
            <span style={{ fontSize:12, fontWeight:800, color:AI.indigo, whiteSpace:'nowrap' }}>{aiNextDate(cfg)}</span>
          </div>
        </div>
      </div>
      <AiCta label="Төлөвлөгөө харах" onClick={onNext} secondary="Арилжаа руу буцах" onSecondary={()=>onGoto && onGoto('active')}/>
    </Frame>
  );
};

// ============================================================
// 9 — Plans hub (pause / resume works, history, rules)
// ============================================================
// ---- Shared plan-edit sheet (used by AIPlans and AIPlanDetail) ----
const AiEditSheet = ({ edit, setEdit, cfg, upd, save, put }) => {
  if (!edit) return null;
  return (
      <div style={{ position:'absolute', inset:0, zIndex:20, display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
        <div onClick={()=>setEdit(null)} style={{ position:'absolute', inset:0, background:'rgba(15,20,55,.42)' }}></div>
        <div style={{ position:'relative', background:'#F4F6FA', borderRadius:'26px 26px 0 0', maxHeight:'82%', display:'flex', flexDirection:'column', boxShadow:'0 -12px 40px rgba(15,20,55,.18)' }}>
          <div style={{ padding:'14px 22px 6px', flexShrink:0 }}>
            <div style={{ width:38, height:4, borderRadius:999, background:'#D9DCE7', margin:'0 auto 14px' }}></div>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ flex:1, fontSize:16.5, fontWeight:800, color:AI.ink, letterSpacing:'-0.01em' }}>Төлөвлөгөө засах</div>
              <button onClick={()=>setEdit(null)} style={{ background:'none', border:'none', fontSize:12.5, fontWeight:700, color:AI.muted, cursor:'pointer', padding:0 }}>Болих</button>
            </div>
          </div>
          <div style={{ flex:1, overflow:'auto', padding:'8px 22px 4px' }}>
            <div style={{ fontSize:12.5, fontWeight:800, color:AI.ink }}>Төлөвлөгөөний нэр</div>
            <div style={{ marginTop:9, background:'#fff', borderRadius:14, border:`1px solid ${AI.line2}`, padding:'11px 14px' }}>
              <input value={edit.name} maxLength={28} onChange={(e)=>upd({ name:e.target.value })} placeholder={window.ai2AutoName ? window.ai2AutoName(cfg) : 'Төлөвлөгөө'}
                style={{ width:'100%', border:'none', outline:'none', background:'transparent', fontSize:15, fontWeight:800, color:AI.ink, letterSpacing:'-0.01em', fontFamily:'inherit' }}/>
            </div>

            <div style={{ fontSize:12.5, fontWeight:800, color:AI.ink, marginTop:18 }}>Нэгжийн тоо</div>
            <div style={{ marginTop:9, background:'#fff', borderRadius:14, border:`1px solid ${AI.line2}`, padding:'12px 14px', display:'flex', alignItems:'center', gap:14 }}>
              <button onClick={()=>upd({ units: Math.max(1, edit.units - 1) })} aria-label="Хасах" style={{ width:38, height:38, borderRadius:12, background:'#F4F6FA', border:`1px solid ${AI.line2}`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke={AI.ink} strokeWidth="2.6" strokeLinecap="round"/></svg>
              </button>
              <div style={{ flex:1, textAlign:'center' }}>
                <div style={{ fontSize:24, fontWeight:800, color:AI.ink, lineHeight:1, fontVariantNumeric:'tabular-nums' }}>{edit.units}</div>
                <div style={{ fontSize:11, color:AI.muted, fontWeight:700, marginTop:4 }}>ширхэг · ₮ {aiFmt(edit.units * aiUnitPrice(cfg))}</div>
              </div>
              <button onClick={()=>upd({ units: Math.min(999, edit.units + 1) })} aria-label="Нэмэх" style={{ width:38, height:38, borderRadius:12, background:AI.indigo, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.6" strokeLinecap="round"/></svg>
              </button>
            </div>

            <div style={{ fontSize:12.5, fontWeight:800, color:AI.ink, marginTop:18 }}>Давтамж</div>
            <div style={{ display:'flex', gap:8, marginTop:9, flexWrap:'wrap' }}>
              {['Өдөр бүр','7 хоног бүр','Сар бүр'].map(f => <AiChip key={f} label={f} active={edit.freq===f} onClick={()=>upd({ freq:f })}/>)}
            </div>
            {edit.freq === 'Өдөр бүр'
              ? <div style={{ fontSize:11.5, color:AI.muted, marginTop:9, lineHeight:1.5 }}>Ажлын өдөр бүр (Да–Ба) гүйцэтгэнэ. Сонгох өдөр байхгүй.</div>
              : (
                <React.Fragment>
                  <div style={{ fontSize:12.5, fontWeight:800, color:AI.ink, marginTop:18 }}>Гүйцэтгэх өдөр</div>
                  <div style={{ display:'flex', gap:8, marginTop:9, flexWrap:'wrap' }}>
                    {(edit.freq === 'Сар бүр' ? ['1','15','25'] : ['Даваа','Лхагва','Баасан']).map(d => (
                      <AiChip key={d} label={edit.freq === 'Сар бүр' ? 'Сарын ' + d : d} active={edit.day===d} onClick={()=>upd({ day:d, payDay: edit.freq === 'Сар бүр' ? parseInt(d, 10) : edit.payDay })}/>
                    ))}
                  </div>
                </React.Fragment>
              )}

            <div style={{ marginTop:18, background:'#fff', borderRadius:14, border:`1px solid ${edit.reinvest ? AI.indigo : AI.line2}`, padding:'13px 15px', display:'flex', alignItems:'flex-start', gap:12 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12.5, fontWeight:800, color:AI.ink }}>Хугацаа дуусахад дахин авах</div>
                <div style={{ fontSize:11, color:AI.muted, marginTop:3, lineHeight:1.5 }}>Үндсэн дүн ижил бүтээгдэхүүнд дахин ажиллана. Өгөөж хэтэвчид үлдэнэ.</div>
              </div>
              <AiToggle on={edit.reinvest} onClick={()=>upd({ reinvest: !edit.reinvest })} label="Дахин авах"/>
            </div>

            <div style={{ marginTop:12, background:'#fff', borderRadius:14, border:`1px solid ${AI.line2}`, padding:'13px 15px', display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12.5, fontWeight:800, color:AI.ink }}>Хүрэлцэхгүй үед хуримтлуулах</div>
                <div style={{ fontSize:11, color:AI.muted, marginTop:3, lineHeight:1.5 }}>Нэгж үнэд хүрэх хүртэл хэтэвчинд хуримтлана.</div>
              </div>
              <AiToggle on={edit.accumulate} onClick={()=>upd({ accumulate:!edit.accumulate })} label="Хуримтлуулах"/>
            </div>
            <div style={{ marginTop:14, padding:'11px 14px', borderRadius:12, background:'#fff', border:`1px solid ${AI.line2}`, display:'flex', justifyContent:'space-between', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:11.5, color:AI.muted, fontWeight:600 }}>Тохирох бүтээгдэхүүн</span>
              <span style={{ fontSize:12.5, fontWeight:800, color: aiPool({ ...cfg, ...edit }).length ? AI.ink : AI.amber }}>{aiPool({ ...cfg, ...edit }).length} санал</span>
            </div>
            {edit.confirm ? (
              <div style={{ marginTop:14, background:'#fff', borderRadius:14, border:`1px solid ${AI.line2}`, padding:15 }}>
                <div style={{ fontSize:12.5, fontWeight:800, color:AI.ink }}>Төлөвлөгөөг цуцлах?</div>
                <div style={{ fontSize:11.5, color:AI.muted, marginTop:4, lineHeight:1.5 }}>Дараагийн худалдан авалтууд хийгдэхгүй. Худалдан авсан хөрөнгө багцад хэвээр байна.</div>
                <div style={{ display:'flex', gap:8, marginTop:12 }}>
                  <button onClick={()=>upd({ confirm:false })} style={{ flex:1, height:40, borderRadius:12, background:'#fff', border:`1.5px solid ${AI.line}`, fontWeight:700, fontSize:12.5, color:AI.ink, cursor:'pointer' }}>Болих</button>
                  <button onClick={()=>{ put({ cancelled:true, paused:false }); setEdit(null); }} style={{ flex:1, height:40, borderRadius:12, background:AI.red || '#D6455D', border:'none', fontWeight:700, fontSize:12.5, color:'#fff', cursor:'pointer' }}>Цуцлах</button>
                </div>
              </div>
            ) : (
              <button onClick={()=>upd({ confirm:true })} style={{ width:'100%', height:44, marginTop:14, borderRadius:13, background:'transparent', border:'none', fontWeight:700, fontSize:12.5, color:AI.red || '#D6455D', cursor:'pointer' }}>Төлөвлөгөөг цуцлах</button>
            )}
          </div>
          <AiCta label="Хадгалах" onClick={save}/>
        </div>
      </div>
  );
};

const AIPlans = ({ onNext, onBack, onNav, cfg, set, state, setState }) => {
  const [local, setLocal] = useStateAI({ paused:false, cancelled:false });
  const st = state || local;
  const put = setState || ((p) => setLocal(s => ({ ...s, ...p })));
  const paused = !!st.paused, cancelled = !!st.cancelled;
  const [edit, setEdit] = useStateAI(null);
  const [saved, setSaved] = useStateAI(false);
  const openEdit = () => { setEdit({ name: cfg.name === undefined ? (window.ai2AutoName ? window.ai2AutoName(cfg) : '') : cfg.name, units:cfg.units, freq:cfg.freq, day:cfg.day, payDay:cfg.payDay, variant:cfg.variant, priority:cfg.priority, accumulate:cfg.accumulate, reinvest: cfg.reinvest !== false, confirm:false }); setSaved(false); };
  const upd = (patch) => setEdit(e => ({ ...e, ...patch }));
  const save = () => { const price = aiUnitPrice(cfg); set({ name:edit.name, units:edit.units, amount: edit.units * price, freq:edit.freq, day:edit.day, payDay:edit.payDay, priority:edit.priority, accumulate:edit.accumulate, reinvest:edit.reinvest }); setEdit(null); setSaved(true); };
  const first = aiBest(cfg);
  const firstRow = first
    ? { kind:'ok', p: first.ticker + ' · ' + (first.m === 'primary' ? 'Анхдагч зах' : 'Хоёрдогч зах'), d:'Өнөөдөр', sub:'₮ ' + aiFmt(cfg.amount), v: first.y + '%' }
    : cfg.accumulate
      ? { kind:'hold', p:'Хуримтлагдлаа · нэгж үнэд хүрээгүй', d:'Өнөөдөр', sub:'₮ ' + aiFmt(cfg.amount) + ' хэтэвчинд', v:'' }
      : { kind:'skip', p:'Алгассан · нэгж үнэд хүрээгүй', d:'Өнөөдөр', sub:'', v:'' };
  return (
    <Frame label="AI-9 — Миний төлөвлөгөөнүүд">
      <AiBar title="Автомат хөрөнгө оруулалт" onBack={onBack}/>
      <div style={{ flex:1, overflow:'auto', padding:'8px 24px 100px' }}>
        <div style={{ background:'#fff', borderRadius:20, border:`1px solid ${AI.line2}`, padding:18, opacity: paused ? .92 : 1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <AiPlanIcon/>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:14.5, fontWeight:800, color:AI.ink, whiteSpace:'nowrap' }}>₮ {aiFmt(cfg.amount)} · {cfg.freq}</div>
              <div style={{ fontSize:11.5, color:AI.muted, marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{cfg.types.join(', ')} · {aiStrategyLabel(cfg)}</div>
            </div>
            <span style={{ fontSize:10.5, fontWeight:800, color: cancelled ? AI.muted2 : paused ? AI.amber : AI.green, background: cancelled ? '#F1F2F7' : paused ? AI.amberSoft : AI.greenSoft, padding:'4px 10px', borderRadius:999, flexShrink:0 }}>{cancelled ? 'Цуцлагдсан' : paused ? 'Түр зогссон' : 'Идэвхтэй'}</span>
          </div>
          <div style={{ marginTop:14, padding:'11px 13px', borderRadius:12, background:'#FAFBFE', border:`1px solid ${AI.line2}`, display:'flex', justifyContent:'space-between', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:11.5, color:AI.muted, fontWeight:600 }}>Дараагийн гүйцэтгэл</span>
            <span style={{ fontSize:12.5, fontWeight:800, color: paused || cancelled ? AI.muted2 : AI.ink, whiteSpace:'nowrap' }}>{cancelled ? '—' : paused ? 'Зогссон' : aiNextDate(cfg) + ' · ₮ ' + aiFmt(cfg.amount)}</span>
          </div>
          <div style={{ display: cancelled ? 'none' : 'flex', gap:8, marginTop:12 }}>
            <button onClick={()=>put({ paused: !paused })} style={{ flex:1, height:42, borderRadius:12, background: paused ? AI.indigo : '#fff', color: paused ? '#fff' : AI.ink, border: paused ? 'none' : `1.5px solid ${AI.line}`, fontWeight:700, fontSize:12.5, cursor:'pointer' }}>{paused ? 'Үргэлжлүүлэх' : 'Түр зогсоох'}</button>
            <button onClick={openEdit} style={{ flex:1, height:42, borderRadius:12, background:'#fff', border:`1.5px solid ${AI.line}`, fontWeight:700, fontSize:12.5, color:AI.ink, cursor:'pointer' }}>Засах</button>
          </div>
          {paused && <div style={{ marginTop:10 }}><AiNote tone="warn">Төлөвлөгөө зогссон байна. Үргэлжлүүлэх хүртэл худалдан авалт хийгдэхгүй.</AiNote></div>}
          {saved && !paused && !cancelled && <div style={{ marginTop:10 }}><AiNote tone="good">Төлөвлөгөө шинэчлэгдлээ. Дараагийн гүйцэтгэлээс хүчинтэй.</AiNote></div>}
          {cancelled && <div style={{ marginTop:12 }}><AiNote>Төлөвлөгөө цуцлагдлаа. Худалдан авсан хөрөнгө багцад хэвээр байна.</AiNote></div>}
        </div>

        <div style={{ fontSize:13, fontWeight:800, color:AI.ink, marginTop:22 }}>Гүйцэтгэлийн түүх</div>
        <div style={{ marginTop:10, background:'#fff', borderRadius:16, border:`1px solid ${AI.line2}`, overflow:'hidden' }}>
          {[
            firstRow,
            { kind:'skip', p:'Алгассан · тохирох бүтээгдэхүүн олдсонгүй', d:aiPastDate(cfg), sub:'', v:'' },
          ].map((h, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 15px', borderTop: i ? `1px solid ${AI.line2}` : 'none' }}>
              <div style={{ width:34, height:34, borderRadius:10, background: h.kind==='ok' ? AI.greenSoft : h.kind==='hold' ? AI.soft : '#F4F5F9', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                {h.kind==='ok'
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke={AI.green} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  : h.kind==='hold'
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 7v5l3 2" stroke={AI.indigo} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="9" stroke={AI.indigo} strokeWidth="2"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke={AI.muted2} strokeWidth="2.4" strokeLinecap="round"/></svg>}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12.5, fontWeight:700, color: h.kind==='skip' ? AI.muted : AI.ink, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{h.p}</div>
                <div style={{ fontSize:11, color:AI.muted, marginTop:2 }}>{h.d}{h.sub ? ' · ' + h.sub : ''}</div>
              </div>
              {h.v && <span style={{ fontSize:13, fontWeight:800, color:AI.green }}>{h.v}</span>}
            </div>
          ))}
        </div>
        <div style={{ fontSize:11.5, color:AI.muted, marginTop:10, lineHeight:1.5 }}>Худалдан авалт бүр таны багцад нэмэгдэж, Хэтэвч хуудсанд харагдана.</div>

        <button onClick={onNext} style={{ width:'100%', height:54, marginTop:18, borderRadius:15, background:'transparent', border:`1.5px dashed ${AI.line}`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, fontWeight:700, fontSize:13, color:AI.indigo }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={AI.indigo} strokeWidth="2.4" strokeLinecap="round"/></svg>
          Шинэ төлөвлөгөө нэмэх
        </button>
      </div>
      <BottomTabs active="trade" onNav={onNav}/>
      <AiEditSheet edit={edit} setEdit={setEdit} cfg={cfg} upd={upd} save={save} put={put}/>
    </Frame>
  );
};

// ============================================================
// 9b — Multiple plans · list + per-plan detail
// ============================================================
const AI_PLANS = [
  { id:'p1', name:'Хуримтлал', type:'Сертификат', term:12, units:5, amount:500000,  freq:'Сар бүр', day:'25', status:'active', next:'8 сарын 25', invested:8700000,  runs:11, holdings:2, last:{ ticker:'CAPIT 1450', y:15.5 } },
  { id:'p2', name:'Урт хугацаа', type:'Итгэлцэл',  term:12, units:2, amount:2000000, freq:'Сар бүр', day:'1',  status:'active', next:'9 сарын 1',  invested:24000000, runs:12, holdings:3, last:{ ticker:'TDBTR 2050', y:20.5 } },
  { id:'p3', name:'Туршилт',    type:'Сертификат', term:6,  units:1, amount:100000,  freq:'7 хоног бүр', day:'—', status:'paused', next:'Зогссон', invested:1200000,  runs:12, holdings:1, last:{ ticker:'NOMFI 1720', y:17.2 } },
];
const aiPlanCfg = (p) => ({ ...AI_DEFAULT, types:[p.type], term:p.term, maxTerm:p.term, units:p.units, amount:p.amount, freq:p.freq, day:p.day, payDay: parseInt(p.day, 10) || 25 });
const AI_STATUS = { active:['Идэвхтэй', AI.green, AI.greenSoft], paused:['Түр зогссон', AI.amber, AI.amberSoft], cancelled:['Цуцлагдсан', AI.muted2, '#F1F2F7'] };

const AiStatusChip = ({ status }) => {
  const [l, fg, bg] = AI_STATUS[status] || AI_STATUS.active;
  return <span style={{ fontSize:10.5, fontWeight:800, color:fg, background:bg, padding:'4px 10px', borderRadius:999, flexShrink:0, whiteSpace:'nowrap' }}>{l}</span>;
};

const AiPlanRow = ({ p, onClick }) => (
  <button onClick={onClick} style={{ width:'100%', textAlign:'left', background:'#fff', borderRadius:18, border:`1px solid ${AI.line2}`, padding:'15px 16px', cursor:'pointer', opacity: p.status==='paused' ? .9 : 1 }}>
    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
      <AiPlanIcon size={40} r={13}/>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:14, fontWeight:800, color:AI.ink, letterSpacing:'-0.01em', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</div>
        <div style={{ fontSize:11.5, color:AI.muted, marginTop:3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>₮ {aiFmt(p.amount)} · {p.freq}</div>
      </div>
    </div>
    <div style={{ display:'flex', alignItems:'center', gap:7, marginTop:11 }}>
      <span style={{ fontSize:10, fontWeight:800, color:AI.muted, background:'#F4F5F9', padding:'3px 9px', borderRadius:999, whiteSpace:'nowrap' }}>{p.type} · {p.term} сар</span>
      <AiStatusChip status={p.status}/>
    </div>
    <div style={{ marginTop:11, padding:'10px 12px', borderRadius:11, background:'#FAFBFE', border:`1px solid ${AI.line2}`, display:'flex', justifyContent:'space-between', alignItems:'center', gap:10 }}>
      <span style={{ fontSize:11, color:AI.muted, fontWeight:600 }}>Дараагийн гүйцэтгэл</span>
      <span style={{ fontSize:12, fontWeight:800, color: p.status==='active' ? AI.ink : AI.muted2, whiteSpace:'nowrap' }}>{p.status==='active' ? p.next + ' · ₮ ' + aiFmt(p.amount) : p.next}</span>
    </div>
  </button>
);

const AIPlansList = ({ onBack, onNav, onOpen, onNew, plans = AI_PLANS }) => {
  const active = plans.filter(p => p.status === 'active');
  const monthly = active.reduce((s, p) => s + p.amount * aiPerYear(p.freq) / 12, 0);
  return (
    <Frame label="AI-9b — Миний төлөвлөгөөнүүд">
      <AiBar title="Автомат хөрөнгө оруулалт" onBack={onBack}/>
      <div style={{ flex:1, overflow:'auto', padding:'8px 24px 100px' }}>
        <div style={{ display:'flex', gap:10 }}>
          {[['Идэвхтэй төлөвлөгөө', active.length + ' / ' + plans.length], ['Сарын дундаж', '₮ ' + aiFmt(Math.round(monthly))]].map(([l, v]) => (
            <div key={l} style={{ flex:1, minWidth:0, background:'#fff', borderRadius:16, border:`1px solid ${AI.line2}`, padding:'13px 14px' }}>
              <div style={{ fontSize:10.5, color:AI.muted, fontWeight:700, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{l}</div>
              <div style={{ fontSize:16, fontWeight:800, color:AI.ink, marginTop:5, fontVariantNumeric:'tabular-nums', whiteSpace:'nowrap' }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize:13, fontWeight:800, color:AI.ink, marginTop:20 }}>Төлөвлөгөөнүүд ({plans.length})</div>
        <div style={{ marginTop:10, display:'flex', flexDirection:'column', gap:10 }}>
          {plans.map(p => <AiPlanRow key={p.id} p={p} onClick={()=>onOpen && onOpen(p.id)}/>)}
        </div>
        <button onClick={onNew} style={{ width:'100%', height:54, marginTop:14, borderRadius:15, background:'transparent', border:`1.5px dashed ${AI.line}`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, fontWeight:700, fontSize:13, color:AI.indigo }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={AI.indigo} strokeWidth="2.4" strokeLinecap="round"/></svg>
          Шинэ төлөвлөгөө нэмэх
        </button>
        <div style={{ fontSize:11.5, color:AI.muted, marginTop:10, lineHeight:1.5 }}>Төлөвлөгөө тус бүр өөрийн бүтээгдэхүүн, хугацаа, эрэмбэтэй байна.</div>
      </div>
      <BottomTabs active="trade" onNav={onNav}/>
    </Frame>
  );
};

const AIPlanDetail = ({ onBack, onNav, onEdit, plan, plans = AI_PLANS, id = 'p1' }) => {
  const base = plan || plans.find(x => x.id === id) || plans[0];
  const [over, setOver] = useStateAI({});
  const p = { ...base, ...over };
  const [paused, setPaused] = useStateAI(base.status === 'paused');
  const [rec, setRec] = useStateAI(null);
  const [edit, setEdit] = useStateAI(null);
  const cfg = aiPlanCfg(p);
  // Засах opens the same sheet the plans hub uses — edits apply to this plan in place.
  const openEdit = () => setEdit({ name:p.name, units:p.units, freq:p.freq, day:p.day, payDay: parseInt(p.day, 10) || 25, accumulate: cfg.accumulate, reinvest: p.reinvest !== false, confirm:false });
  const updEdit = (patch) => setEdit(e => ({ ...e, ...patch }));
  const saveEdit = () => { const price = aiUnitPrice(cfg); setOver(o => ({ ...o, name:edit.name, units:edit.units, amount: edit.units * price, freq:edit.freq, day:edit.day, reinvest:edit.reinvest })); setEdit(null); };
  const putEdit = (patch) => { if (patch && patch.cancelled) setOver(o => ({ ...o, status:'cancelled' })); };
  const pool = aiPool(cfg).slice().sort((a, b) => b.y - a.y).slice(0, 5);
  return (
    <Frame label={'AI-9c — ' + p.name}>
      <AiBar title={p.name} onBack={onBack}/>
      <div style={{ flex:1, overflow:'auto', padding:'8px 24px 100px' }}>
        <div style={{ background:'#fff', borderRadius:20, border:`1px solid ${AI.line2}`, padding:18 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <AiPlanIcon/>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:15, fontWeight:800, color:AI.ink, whiteSpace:'nowrap' }}>₮ {aiFmt(p.amount)} · {p.freq}</div>
              <div style={{ fontSize:11.5, color:AI.muted, marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.units} нэгж {p.type} · {p.term} сар</div>
            </div>
            <AiStatusChip status={paused ? 'paused' : p.status}/>
          </div>
          <div style={{ marginTop:14, padding:'11px 13px', borderRadius:12, background:'#FAFBFE', border:`1px solid ${AI.line2}`, display:'flex', justifyContent:'space-between', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:11.5, color:AI.muted, fontWeight:600 }}>Дараагийн гүйцэтгэл</span>
            <span style={{ fontSize:12.5, fontWeight:800, color: paused ? AI.muted2 : AI.ink, whiteSpace:'nowrap' }}>{paused ? 'Зогссон' : p.next + ' · ₮ ' + aiFmt(p.amount)}</span>
          </div>
          <div style={{ display:'flex', gap:8, marginTop:12 }}>
            <button onClick={()=>setPaused(!paused)} style={{ flex:1, height:42, borderRadius:12, background: paused ? AI.indigo : '#fff', color: paused ? '#fff' : AI.ink, border: paused ? 'none' : `1.5px solid ${AI.line}`, fontWeight:700, fontSize:12.5, cursor:'pointer' }}>{paused ? 'Үргэлжлүүлэх' : 'Түр зогсоох'}</button>
            <button onClick={openEdit} style={{ flex:1, height:42, borderRadius:12, background:'#fff', border:`1.5px solid ${AI.line}`, fontWeight:700, fontSize:12.5, color:AI.ink, cursor:'pointer' }}>Засах</button>
          </div>
          {paused && <div style={{ marginTop:10 }}><AiNote tone="warn">Төлөвлөгөө зогссон байна. Үргэлжлүүлэх хүртэл худалдан авалт хийгдэхгүй.</AiNote></div>}
        </div>

        <div style={{ display:'flex', gap:10, marginTop:14 }}>
          {[['Хуримтлуулсан', '₮ ' + aiFmt(p.invested)], ['Гүйцэтгэл', p.runs + ' удаа']].map(([l, v]) => (
            <div key={l} style={{ flex:1, minWidth:0, background:'#fff', borderRadius:16, border:`1px solid ${AI.line2}`, padding:'13px 14px' }}>
              <div style={{ fontSize:10.5, color:AI.muted, fontWeight:700 }}>{l}</div>
              <div style={{ fontSize:15.5, fontWeight:800, color:AI.ink, marginTop:5, fontVariantNumeric:'tabular-nums', whiteSpace:'nowrap' }}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize:13, fontWeight:800, color:AI.ink, marginTop:20 }}>Төлөвлөгөөний нөхцөл</div>
        <div style={{ marginTop:8, background:'#fff', borderRadius:16, border:`1px solid ${AI.line2}`, padding:'4px 16px 12px' }}>
          <AiRow l="Бүтээгдэхүүн" v={p.type + ' · ' + p.term + ' сар'}/>
          <AiRow l="Нэгж" v={p.units + ' × ₮ ' + aiFmt(aiUnitPrice(cfg))}/>
          <AiRow l="Давтамж" v={p.freq}/>
          <AiRow l="Гүйцэтгэх өдөр" v={p.dayLabel || (p.freq === 'Сар бүр' ? 'Сарын ' + p.day : p.freq)}/>
          <AiRow l="Дуусах" v="Хязгааргүй"/>
          <AiRow l="Эх үүсвэр" v="Хэтэвч · ₮ 12,000,000"/>
          <AiRow l="Нэг удаад" v={'₮ ' + aiFmt(p.amount)} strong/>
        </div>

        <div style={{ fontSize:13, fontWeight:800, color:AI.ink, marginTop:20 }}>Худалдан авах эрэмбэ</div>
        <div style={{ marginTop:8, background:'#fff', borderRadius:16, border:`1px solid ${AI.line2}`, overflow:'hidden' }}>
          {pool.map((x, k) => (
            <div key={x.ticker} style={{ display:'flex', alignItems:'center', gap:11, padding:'11px 14px', borderTop: k ? `1px solid ${AI.line2}` : 'none' }}>
              <span style={{ width:24, height:24, borderRadius:8, background:AI.soft, color:AI.indigo, fontSize:12, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{k+1}</span>
              <span style={{ flex:1, minWidth:0, fontSize:12.5, fontWeight:700, color:AI.ink, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{x.issuer}</span>
              <span style={{ fontSize:12.5, fontWeight:800, color:AI.green, flexShrink:0 }}>{x.y.toFixed(1)}%</span>
            </div>
          ))}
        </div>

        <div style={{ fontSize:13, fontWeight:800, color:AI.ink, marginTop:20 }}>Гүйцэтгэлийн түүх</div>
        <div style={{ marginTop:8, background:'#fff', borderRadius:16, border:`1px solid ${AI.line2}`, overflow:'hidden' }}>
          {[
            { kind:'ok',   p:p.last.ticker, d:'Өнөөдөр', sub:'₮ ' + aiFmt(p.amount), v:p.last.y + '%', rank:1, units:p.units, issuer:p.last.issuer },
            { kind:'ok',   p:p.last.ticker, d:aiPastDate(cfg), sub:'₮ ' + aiFmt(p.amount), v:p.last.y + '%', rank:2, units:p.units, issuer:p.last.issuer },
            { kind:'skip', p:'Алгассан · эрэмбэд байхгүй', d: p.freq === 'Сар бүр' ? '5 сарын ' + p.day : 'Өмнөх гүйцэтгэл', sub:'', v:'' },
          ].map((h, i) => (
            <button key={i} onClick={()=>setRec(h)} style={{ width:'100%', textAlign:'left', background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:12, padding:'13px 15px', borderTop: i ? `1px solid ${AI.line2}` : 'none' }}>
              <div style={{ width:34, height:34, borderRadius:10, background: h.kind==='ok' ? AI.greenSoft : '#F4F5F9', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                {h.kind==='ok'
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke={AI.green} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke={AI.muted2} strokeWidth="2.4" strokeLinecap="round"/></svg>}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12.5, fontWeight:700, color: h.kind==='skip' ? AI.muted : AI.ink, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{h.p}</div>
                <div style={{ fontSize:11, color:AI.muted, marginTop:2 }}>{h.d}{h.sub ? ' · ' + h.sub : ''}</div>
              </div>
              {h.v && <span style={{ fontSize:13, fontWeight:800, color:AI.green }}>{h.v}</span>}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginLeft:2 }}><path d="M9 6l6 6-6 6" stroke={AI.muted2} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          ))}
        </div>
        <div style={{ fontSize:11.5, color:AI.muted, marginTop:10, lineHeight:1.5 }}>Энэ төлөвлөгөөгөөр {p.holdings} бүтээгдэхүүн худалдан авсан. Багц Хэтэвч хуудсанд харагдана.</div>
      </div>
      <AiEditSheet edit={edit} setEdit={setEdit} cfg={cfg} upd={updEdit} save={saveEdit} put={putEdit}/>
      <BottomTabs active="trade" onNav={onNav}/>
      {rec && (
        <div style={{ position:'absolute', inset:0, zIndex:30, display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
          <div onClick={()=>setRec(null)} style={{ position:'absolute', inset:0, background:'rgba(15,20,55,.42)' }}></div>
          <div style={{ position:'relative', background:'#fff', borderRadius:'26px 26px 0 0', padding:'10px 22px 20px', boxShadow:'0 -12px 40px rgba(15,20,55,.18)' }}>
            <div style={{ width:40, height:4, borderRadius:999, background:'#E1E4EE', margin:'0 auto 14px' }}></div>
            <div style={{ display:'flex', alignItems:'center', gap:11 }}>
              <div style={{ width:38, height:38, borderRadius:11, flexShrink:0, background: rec.kind==='ok' ? AI.greenSoft : '#F4F5F9', display:'flex', alignItems:'center', justifyContent:'center' }}>
                {rec.kind==='ok'
                  ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke={AI.green} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  : <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke={AI.muted2} strokeWidth="2.6" strokeLinecap="round"/></svg>}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:16, fontWeight:800, color:AI.ink, letterSpacing:'-0.01em' }}>{rec.kind==='ok' ? rec.p : 'Гүйцэтгэгдээгүй'}</div>
                <div style={{ fontSize:11.5, color:AI.muted, marginTop:2 }}>{rec.d}{rec.kind==='ok' ? ' · автомат худалдан авалт' : ' · алгассан'}</div>
              </div>
            </div>
            <div style={{ marginTop:14, background:'#fff', borderRadius:16, border:`1px solid ${AI.line2}`, overflow:'hidden' }}>
              {(rec.kind==='ok' ? [
                ['Гаргагч', (aiPool(cfg).find(x => x.ticker === rec.p) || {}).issuer || '—'],
                ['Төрөл', p.type],
                ['Эрэмбэ', rec.rank + '-рт тавьсан'],
                ['Нэгж', rec.units + ' ширхэг'],
                ['Өгөөж', rec.v],
                ['Хугацаа', p.term + ' сар'],
                ['Төлсөн дүн', rec.sub],
              ] : [
                ['Шалтгаан', 'Эрэмбэд тавьсан бүтээгдэхүүн тэр өдөр зарагдаагүй'],
                ['Төлөгдсөн дүн', '₮ 0'],
                ['Үлдэгдэл', 'Хэтэвчинд хэвээр үлдсэн'],
              ]).map(([l, v], k) => (
                <div key={l} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:14, padding:'11px 14px', borderTop: k ? `1px solid ${AI.line2}` : 'none' }}>
                  <span style={{ fontSize:12, color:AI.muted, fontWeight:600, flexShrink:0 }}>{l}</span>
                  <span style={{ fontSize:12.5, color:AI.ink, fontWeight:800, textAlign:'right' }}>{v}</span>
                </div>
              ))}
            </div>
            <button onClick={()=>setRec(null)} style={{ marginTop:16, width:'100%', height:48, borderRadius:14, border:'none', cursor:'pointer', background:AI.indigo, color:'#fff', fontSize:14, fontWeight:800 }}>Хаах</button>
          </div>
        </div>
      )}
    </Frame>
  );
};

// Gallery/prototype wrapper: list ↔ detail in one frame.
const AIPlansMulti = ({ onNav, onNew, start = null }) => {
  const [open, setOpen] = useStateAI(start);
  return open
    ? <AIPlanDetail id={open} onBack={()=>setOpen(null)} onNav={onNav}/>
    : <AIPlansList onOpen={setOpen} onNav={onNav} onNew={onNew}/>;
};

// ============================================================
// 10 — Хэтэвч · where active plans live day-to-day
// ============================================================
const AIWallet = ({ onGoto, cfg }) => {
  const first = aiPool(cfg).slice().sort((a, b) => b.y - a.y)[0];
  return (
    <Frame label="AI-10 — Хэтэвч · автомат">
      <div style={{ padding:'6px 24px 12px', flexShrink:0 }}>
        <div style={{ fontSize:24, fontWeight:800, color:AI.ink, letterSpacing:'-0.02em' }}>Хэтэвч</div>
      </div>
      <div style={{ flex:1, overflow:'auto', padding:'0 24px 100px' }}>
        <div style={{ borderRadius:22, padding:20, background:`linear-gradient(135deg, ${C.navy} 0%, ${C.navy3} 100%)`, color:'#fff', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', right:-40, top:-40, opacity:.35 }}><LogoMark size={140}/></div>
          <div style={{ position:'relative' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontSize:11, opacity:.7, fontWeight:600 }}>Бэлэн мөнгө · Хэтэвч</div>
              <div style={{ background:'rgba(255,255,255,.1)', padding:'4px 10px', borderRadius:999, fontSize:11, fontWeight:700 }}>MNT</div>
            </div>
            <div style={{ fontSize:36, fontWeight:800, marginTop:10, letterSpacing:'-0.02em', fontVariantNumeric:'tabular-nums' }}>₮ 12,000,000</div>
            <div style={{ fontSize:11, opacity:.55, fontWeight:600, marginTop:4, fontVariantNumeric:'tabular-nums' }}>№ 200001281 · Хаан Банк ••••450</div>
            <div style={{ display:'flex', gap:8, marginTop:18 }}>
              <div style={{ flex:1, height:44, borderRadius:12, background:'#fff', color:AI.ink, fontWeight:700, fontSize:13, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12l7-7 7 7" stroke={AI.green} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Орлого
              </div>
              <div style={{ flex:1, height:44, borderRadius:12, background:'rgba(255,255,255,.12)', border:'1px solid rgba(255,255,255,.18)', color:'#fff', fontWeight:700, fontSize:13, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 19V5M5 12l7 7 7-7" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Зарлага
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop:18, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontSize:14, fontWeight:800, color:AI.ink, letterSpacing:'-0.01em' }}>Автомат хөрөнгө оруулалт</div>
          <span onClick={()=>onGoto && onGoto('plans')} style={{ fontSize:12, color:AI.indigo, fontWeight:700, cursor:'pointer' }}>Удирдах →</span>
        </div>
        <button onClick={()=>onGoto && onGoto('plans')} style={{ width:'100%', textAlign:'left', marginTop:10, background:'#fff', borderRadius:18, border:`1px solid ${AI.line2}`, padding:16, cursor:'pointer' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <AiPlanIcon size={38} r={12}/>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13.5, fontWeight:800, color:AI.ink, whiteSpace:'nowrap' }}>₮ {aiFmt(cfg.units * aiUnitPrice(cfg))} · {cfg.freq}</div>
              <div style={{ fontSize:11, color:AI.muted, marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{cfg.units} нэгж {aiType(cfg)} · {cfg.term} сар</div>
            </div>
            <span style={{ fontSize:10.5, fontWeight:800, color:AI.green, background:AI.greenSoft, padding:'4px 10px', borderRadius:999, flexShrink:0 }}>Идэвхтэй</span>
          </div>
          <div style={{ marginTop:12, padding:'10px 12px', borderRadius:11, background:'#FAFBFE', border:`1px solid ${AI.line2}`, display:'flex', justifyContent:'space-between', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:11.5, color:AI.muted, fontWeight:600 }}>Дараагийн хасалт</span>
            <span style={{ fontSize:12, fontWeight:800, color:AI.ink, whiteSpace:'nowrap' }}>{aiNextDate(cfg)} · ₮ {aiFmt(cfg.units * aiUnitPrice(cfg))}</span>
          </div>
          {first && <div style={{ fontSize:11, color:AI.muted, marginTop:9, lineHeight:1.5 }}>Сүүлийн худалдан авалт: <b style={{ color:AI.ink }}>{first.ticker}</b> · {first.y}% · өнөөдөр</div>}
        </button>

        <div style={{ marginTop:14, background:'#fff', borderRadius:18, border:`1px solid ${AI.line2}`, padding:'14px 16px', display:'flex', alignItems:'center', gap:13 }}>
          <div style={{ width:40, height:40, borderRadius:12, background:AI.soft, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="12" rx="3" stroke={AI.indigo} strokeWidth="2"/><path d="M3 10h18" stroke={AI.indigo} strokeWidth="2"/></svg>
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13.5, fontWeight:700, color:AI.ink }}>Миний картууд</div>
            <div style={{ fontSize:11.5, color:AI.muted, marginTop:2 }}>Цэнэглэлт, автомат төлөлтөд ашиглах</div>
          </div>
          <span style={{ fontSize:12, fontWeight:700, color:AI.muted, flexShrink:0 }}>3 карт</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0 }}><path d="M9 6l6 6-6 6" stroke={AI.muted2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>

        <div style={{ marginTop:18, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontSize:14, fontWeight:800, color:AI.ink }}>Миний бүтээгдэхүүн (6)</div>
          <span style={{ fontSize:12, color:AI.indigo, fontWeight:700, cursor:'pointer' }}>Бүгд →</span>
        </div>
        <div style={{ marginTop:10, display:'flex', flexDirection:'column', gap:10 }}>
          {[
            { t:'CAPIT 1450', s:'Сертификат · автомат', v:'8,700,000', auto:true },
            { t:'TDBTR 2050', s:'Итгэлцэл', v:'12,000,000', auto:false },
          ].map((h, i) => (
            <div key={i} style={{ background:'#fff', borderRadius:16, padding:'13px 16px', border:`1px solid ${AI.line2}`, display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                  <span style={{ fontSize:13, fontWeight:700, color:AI.ink }}>{h.t}</span>
                  {h.auto && <span style={{ fontSize:9.5, fontWeight:800, color:AI.indigo, background:AI.soft, padding:'2px 7px', borderRadius:999 }}>АВТО</span>}
                </div>
                <div style={{ fontSize:11, color:AI.muted, marginTop:2 }}>{h.s}</div>
              </div>
              <div style={{ fontSize:13, fontWeight:800, color:AI.ink, fontVariantNumeric:'tabular-nums' }}>₮ {h.v}</div>
            </div>
          ))}
        </div>
      </div>
      <BottomTabs active="wallet"/>
    </Frame>
  );
};

// ============================================================
// Navigator — one-click linear flow, shared config.
// auto_invest_v2.jsx rewrites this list in place with the v2 steps.
// ============================================================
const AI_STEPS = [
  { id:'trade',    name:'Арилжаа + оролт',        El: AITrade },
  { id:'intro',    name:'Танилцуулга',            El: AIIntro },
  { id:'criteria', name:'Юу худалдан авах',       El: AICriteria },
  { id:'amount',   name:'Дүн, давтамж',           El: AIAmount },
  { id:'payment',  name:'Эх үүсвэр',              El: AIPayment },
  { id:'review',   name:'Баталгаажуулалт',        El: AIReview },
  { id:'pin',      name:'ПИН код',                El: AIPin },
  { id:'success',  name:'Идэвхжлээ',              El: AISuccess },
  { id:'plans',    name:'Төлөвлөгөөний удирдлага', El: AIPlans },
  { id:'wallet',   name:'Хэтэвч · идэвхтэй төлөвлөгөө', El: AIWallet },
];
const AI_KEY = 'mmf_auto_invest_step';

const AutoInvestProto = () => {
  const [vh, setVh] = useStateAI(window.innerHeight);
  useEffectAI(() => {
    const r = () => setVh(window.innerHeight);
    window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
  }, []);
  const scale = Math.min(0.9, Math.max(0.3, (vh - 130) / 892));
  const [cfg, setCfg] = useStateAI(AI_DEFAULT);
  const set = (patch) => setCfg(c => ({ ...c, ...patch }));
  const [i, setI] = useStateAI(() => {
    const s = parseInt(localStorage.getItem(AI_KEY), 10);
    return isNaN(s) ? 0 : Math.min(Math.max(s, 0), AI_STEPS.length - 1);
  });
  useEffectAI(() => { localStorage.setItem(AI_KEY, String(i)); }, [i]);
  useEffectAI(() => {
    const h = (e) => {
      if (e.key === 'ArrowRight') setI(x => Math.min(x + 1, AI_STEPS.length - 1));
      if (e.key === 'ArrowLeft') setI(x => Math.max(x - 1, 0));
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);
  const next = () => setI(x => Math.min(x + 1, AI_STEPS.length - 1));
  const back = () => setI(x => Math.max(x - 1, 0));
  const cancel = () => setI(0);
  const goto = (id) => { const k = AI_STEPS.findIndex(s => s.id === id); if (k >= 0) setI(k); };
  const step = AI_STEPS[Math.min(i, AI_STEPS.length - 1)];
  const NavBtn = ({ dir, disabled }) => (
    <button onClick={disabled ? undefined : () => setI(x => x + (dir === 'prev' ? -1 : 1))} aria-label={dir === 'prev' ? 'Өмнөх' : 'Дараах'} style={{ width:44, height:44, borderRadius:14, background:'#fff', border:`1px solid ${AI.line}`, cursor: disabled ? 'default' : 'pointer', opacity: disabled ? .35 : 1, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 14px -6px rgba(15,20,55,.15)' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ transform: dir === 'prev' ? 'rotate(180deg)' : 'none' }}><path d="M9 6l6 6-6 6" stroke={AI.ink} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </button>
  );
  return (
    <div style={{ height:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:14, padding:'14px 0', overflow:'hidden' }}>
      <div style={{ display:'flex', alignItems:'center', gap:14 }}>
        <span style={{ fontFamily:'JetBrains Mono, monospace', fontSize:11, fontWeight:600, letterSpacing:'0.08em', color:AI.muted, textTransform:'uppercase' }}>Auto-Invest · {i+1}/{AI_STEPS.length}</span>
        <span style={{ fontSize:13, fontWeight:800, color:AI.ink }}>{step.name}</span>
      </div>
      <div style={{ height: 892 * scale, display:'flex', alignItems:'flex-start', justifyContent:'center' }}>
        <div data-screen-label={`AI ${i+1} — ${step.name}`} style={{ transform:`scale(${scale})`, transformOrigin:'top center' }}>
          <step.El onNext={next} onBack={back} onCancel={cancel} onGoto={goto} cfg={cfg} set={set} hasPlan={step.hasPlan}/>
        </div>
      </div>
      <div style={{ display:'flex', gap:12, alignItems:'center' }}>
        <NavBtn dir="prev" disabled={i===0}/>
        <div style={{ display:'flex', gap:5 }}>
          {AI_STEPS.map((_, k) => <div key={k} onClick={()=>setI(k)} style={{ width: k===i ? 20 : 7, height:7, borderRadius:999, background: k===i ? AI.indigo : '#D9DCE7', cursor:'pointer', transition:'all .2s' }}></div>)}
        </div>
        <NavBtn dir="next" disabled={i===AI_STEPS.length-1}/>
      </div>
    </div>
  );
};

Object.assign(window, {
  AutoInvestProto, AI, AI_MARKET, AI_DEFAULT, AI_STEPS, AI_TERMS, aiPool, aiUnitPrice,
  AI_PLANS, aiPlanCfg, AiStatusChip, AiPlanRow, AIPlansList, AIPlanDetail, AIPlansMulti,
  aiFmt, aiMatch, aiBest, aiPerYear, aiMarketLabel, aiTermLabel, aiNextDate, aiPastDate, aiStable,
  aiStrategyLabel, aiType, aiMinTicket, aiAmountSteps, aiEditSteps, AI_TICKET, AiVariantSwitch,
  AiRadioCard, AiBar, AiCta, AiChip, AiToggle, AiNote, AiRow, AiPlanIcon,
  AITrade, AIIntro, AICriteria, AIAmount, AIPayment, AIReview, AIPin, AISuccess, AIPlans, AIWallet,
});
