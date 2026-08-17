// ============================================================
// AUTO-INVEST — web app (desktop)
// Same plan model + rules as the mobile flow (auto_invest.jsx):
// shared localStorage key, same matching engine, same edge cases.
// Desktop shape: a page for the plan + a modal wizard for setup.
// ============================================================
const _AT = window.T;
const { WebModal: _AWModal, WebButton: _AWBtn, WebDisclaimer: _AWDisc, WebOTPInput: _AWOtp } = window;
const _aiwS = React.useState, _aiwE = React.useEffect;

const AIW_KEY = 'mmf_auto_plan_v1';
// AUTO-INVEST IS PRIMARY-MARKET ONLY and covers Сертификат + Итгэлцэл.
// stab = issuer stability tier (3 = bank, 1 = ББСБ). min = minimum ticket size.
// Same catalogue the mobile app matches against (auto_invest.jsx AI_MARKET):
// Сертификат 3/6/12 сар, Итгэлцэл 6/12 сар, several issuers per term so the
// prioritisation step has a real list to rank.
const AIW_MK = (t, term, rows) => rows.map(([ticker, issuer, kind, y]) => ({
  m:'primary', t, term, ticker, issuer, kind, y, stab: kind === 'Банк' ? 3 : 1,
  min: t === 'Итгэлцэл' ? 1000000 : 100000,
}));
const AIW_MARKET = [
  ...AIW_MK('Сертификат', 3, [
    ['KHAN 1220','Хаан Банк','Банк',12.2],['GLMT 1250','Голомт Банк','Банк',12.5],
    ['TDB 1240','Худалдаа Банк','Банк',12.4],['XAC 1280','Хас Банк','Банк',12.8],
    ['CAPIT 1310','Капитрон Банк','Банк',13.1],['NOMFI 1450','Ном Финанс ББСБ','ББСБ',14.5],
    ['INVSC 1520','Инвескор ББСБ','ББСБ',15.2],
  ]),
  ...AIW_MK('Сертификат', 6, [
    ['KHAN 1380','Хаан Банк','Банк',13.8],['GLMT 1400','Голомт Банк','Банк',14.0],
    ['TDB 1390','Худалдаа Банк','Банк',13.9],['CAPIT 1460','Капитрон Банк','Банк',14.6],
    ['ARIG 1510','Ариг Банк','Банк',15.1],['NOMFI 1720','Ном Финанс ББСБ','ББСБ',17.2],
    ['ARDCR 1780','Ард Кредит ББСБ','ББСБ',17.8],
  ]),
  ...AIW_MK('Сертификат', 12, [
    ['KHAN 1480','Хаан Банк','Банк',14.8],['TDB 1500','Худалдаа Банк','Банк',15.0],
    ['GLMT 1520','Голомт Банк','Банк',15.2],['CAPIT 1450','Капитрон Банк','Банк',15.5],
    ['XAC 1560','Хас Банк','Банк',15.6],['BOGD 1690','Богд Банк','Банк',16.9],
    ['NOMFI 1820','Ном Финанс ББСБ','ББСБ',18.2],['INVSC 1880','Инвескор ББСБ','ББСБ',18.8],
  ]),
  ...AIW_MK('Итгэлцэл', 6, [
    ['GLMTR 1900','Голомт Итгэлцэл','Банк',19.0],['TDBTR 1950','ХХБ Итгэлцэл','Банк',19.5],
    ['ARDCR 2080','Ард Кредит ББСБ','ББСБ',20.8],['MSTRT 2130','Кредитекс СТМ','ББСБ',21.3],
    ['MNDL 2150','Мандал Финанс','ББСБ',21.5],['INVSC 2200','Инвескор ББСБ','ББСБ',22.0],
  ]),
  ...AIW_MK('Итгэлцэл', 12, [
    ['TDBTR 2050','ХХБ Итгэлцэл','Банк',20.5],['GLMTR 2100','Голомт Итгэлцэл','Банк',21.0],
    ['ARDCR 2280','Ард Кредит ББСБ','ББСБ',22.8],['MNDL 2350','Мандал Финанс','ББСБ',23.5],
    ['INVSC 2400','Инвескор ББСБ','ББСБ',24.0],['SNDBX 2450','Сэндибокс ББСБ','ББСБ',24.5],
    ['GOLDH 2560','Голден Хилл ББСБ','ББСБ',25.6],
  ]),
];
const AIW_DEFAULT = {
  market:'primary', types:['Сертификат'], maxTerm:12, term:12,
  units:5, amount:500000, freq:'Сар бүр', day:'25', payWd:0, start:'today', accumulate:true,
  endMode:'unlimited', endYears:3, endDate:null, reinvest:true, order:null, picked:null,
  variant:'a', priority:'yield',
};
const aiwMnt = (n) => '₮ ' + n.toLocaleString('en-US');
const aiwMatch = (c) => AIW_MARKET.filter(p => c.types.includes(p.t) && (c.maxTerm === 0 || p.term <= c.maxTerm));
// One product type per plan — the minimum ticket follows from it.
const AIW_TICKET = { 'Сертификат': 100000, 'Итгэлцэл': 1000000 };
const aiwType = (c) => c.types[0] || 'Сертификат';
const aiwMinTicket = (c) => AIW_TICKET[aiwType(c)] || 100000;
const aiwAmountSteps = (c) => aiwMinTicket(c) === 1000000 ? [1000000, 2000000, 3000000, 5000000] : [100000, 300000, 500000, 1000000];
// Editing an existing plan: always include its current amount so it is never invisible.
const aiwEditSteps = (c) => {
  const st = aiwAmountSteps(c);
  return st.includes(c.amount) ? st : [c.amount, ...st].sort((a, b) => a - b).slice(0, 4);
};
const aiwStable = (c) => c.variant === 'b' && c.priority === 'stability';
const aiwStrategyLabel = (c) => c.variant === 'b'
  ? (c.priority === 'stability' ? 'Тогтвортой байдлыг эрэмбэлэх' : 'Өндөр өгөөжийг эрэмбэлэх')
  : 'Хамгийн өндөр өгөөж (автомат)';
// v2: buy by the user's ranking — walk the ordered list, take the first affordable one
const aiwRanked = (c) => {
  const pool = aiwPool(c), tickers = pool.map(p => p.ticker);
  const saved = (c.order || []).filter(t => tickers.includes(t));
  const order = [...saved, ...tickers.filter(t => !saved.includes(t))];
  const picked = c.picked && c.picked.length ? c.picked.filter(t => tickers.includes(t)) : tickers;
  return order.filter(t => picked.includes(t)).map(t => pool.find(p => p.ticker === t));
};
const aiwBest = (c) => {
  const ranked = aiwRanked(c).filter(p => p.min <= c.amount);
  if (ranked.length) return ranked[0];
  return aiwPool(c).filter(p => p.min <= c.amount).sort((a, b) => b.y - a.y)[0];
};
const aiwPerYear = (f) => f === 'Өдөр бүр' ? 252 : f === 'Сар бүр' ? 12 : f === '14 хоног бүр' ? 26 : 52;
const aiwNext = (c) => c.freq === 'Өдөр бүр' ? 'Маргааш' : c.freq === 'Сар бүр' ? '8 сарын ' + c.day : c.freq === '7 хоног бүр' ? 'Дараа 7 хоногт' : 'Дараа 14 хоногт';
const aiwPast = (c) => c.freq === 'Сар бүр' ? '6 сарын ' + c.day : c.freq === '7 хоног бүр' ? '7 хоногийн өмнө' : '14 хоногийн өмнө';
const aiwMarketLabel = (m) => m === 'both' ? 'Анхдагч + Хоёрдогч зах' : m === 'primary' ? 'Зөвхөн Анхдагч зах' : 'Зөвхөн Хоёрдогч зах';
const aiwTermLabel = (t) => t === 0 ? 'Хязгааргүй' : t + ' сар хүртэл';
const aiwAutoName = (c) => aiwType(c) + ' · ' + ((c.term || c.maxTerm) ? (c.term || c.maxTerm) + ' сар' : (c.freq || 'Сар бүр'));
const AIW_WDFULL = ['Даваа','Мягмар','Лхагва','Пүрэв','Баасан'];
// v2: one exact product term per plan (not a "up to N months" ceiling)
const aiwTerms = (t) => [...new Set(AIW_MARKET.filter(p => p.t === t).map(p => p.term))].sort((a, b) => a - b);
const aiwTermOf = (c) => c.term || c.maxTerm || 12;
const aiwPool = (c) => AIW_MARKET.filter(p => p.t === aiwType(c) && p.term === aiwTermOf(c));
const aiwUnitPrice = (c) => AIW_TICKET[aiwType(c)] || 100000;
const aiwDayLabel = (c) => c.freq === 'Сар бүр' ? 'Сарын ' + c.day + '-нд'
  : c.freq === '7 хоног бүр' ? AIW_WDFULL[Math.min(Math.max(c.payWd || 0, 0), AIW_WDFULL.length - 1)] + ' гараг'
  : 'Ажлын өдөр бүр';
const aiwEndLabel = (c) => c.endMode === 'years' ? c.endYears + ' жил'
  : c.endMode === 'date' && c.endDate ? c.endDate.replace(/-/g, '.')
  : 'Хязгааргүй';
const aiwYears = (c) => c.endMode === 'years' ? c.endYears
  : c.endMode === 'date' && c.endDate ? Math.max(0.25, (new Date(c.endDate) - new Date(2026, 7, 14)) / (365.25 * 24 * 3600 * 1000))
  : 0;
const aiwRate = (c) => { const p = aiwPool(c); return p.length ? p.reduce((s, x) => s + x.y, 0) / p.length / 100 : 0.16; };
const aiwFV = (a, n, years, r) => { const i = r / n, k = Math.round(n * years); return i === 0 ? a * k : a * ((Math.pow(1 + i, k) - 1) / i); };

// Legacy plans (multi-type, sub-minimum amounts, retired minY/fallback/market
// keys) are normalised on every read AND every write, so no surface can show or
// re-save an impossible plan.
const aiwNormalize = (c) => {
  const types = Array.isArray(c.types) && c.types.length ? [c.types[0]] : ['Сертификат'];
  const out = { ...c, types };
  delete out.minY; delete out.fallback; delete out.market;
  out.payWd = Math.min(Math.max(Number(out.payWd) || 0, 0), AIW_WDFULL.length - 1);
  out.term = aiwTerms(types[0]).includes(out.term) ? out.term : aiwTerms(types[0])[0];
  out.maxTerm = out.term;
  const valid = aiwPool(out).map(p => p.ticker);
  out.order = Array.isArray(out.order) ? out.order.filter(t => valid.includes(t)) : null;
  out.picked = Array.isArray(out.picked) ? out.picked.filter(t => valid.includes(t)) : null;
  if (out.picked && !out.picked.length) out.picked = null;
  out.units = Math.max(1, Number(out.units) || 1);
  out.amount = Math.max(Number(out.amount) || 0, aiwMinTicket(out));
  return out;
};

const AIW_STORE = (() => {
  let s = { cfg: { ...AIW_DEFAULT }, active: false, paused: false, cancelled: false };
  try { const j = JSON.parse(localStorage.getItem(AIW_KEY)); if (j && j.cfg) s = { ...s, ...j, cfg: { ...AIW_DEFAULT, ...j.cfg } }; } catch (e) {}
  s.cfg = aiwNormalize(s.cfg);
  const subs = new Set();
  const emit = () => { try { localStorage.setItem(AIW_KEY, JSON.stringify(s)); } catch (e) {} subs.forEach(f => f(n => n + 1)); };
  return {
    get state() { return s; }, get cfg() { return s.cfg; },
    get live() { return s.active && !s.cancelled; },
    setCfg: (p) => { s = { ...s, cfg: aiwNormalize({ ...s.cfg, ...p }) }; emit(); },
    put: (p) => { s = { ...s, ...p }; emit(); },
    sub: (f) => { subs.add(f); return () => subs.delete(f); },
  };
})();
const useAiwPlan = () => { const [, t] = _aiwS(0); _aiwE(() => AIW_STORE.sub(t), []); return AIW_STORE; };

/* ── atoms ───────────────────────────────────────────────────── */
const AiwLabel = ({ children, hint, top = 20 }) => (
  <div style={{ fontSize:12.5, fontWeight:800, color:_AT.ink, marginTop:top, marginBottom:9 }}>
    {children}{hint && <span style={{ fontWeight:600, color:_AT.muted, fontSize:11.5 }}> {hint}</span>}
  </div>
);
const AiwChip = ({ label, active, onClick, sub }) => (
  <button onClick={onClick} style={{ padding:'9px 14px', borderRadius:999, fontSize:12.5, fontWeight:700, cursor:'pointer', fontFamily:'inherit', background: active ? _AT.ink : _AT.surface, color: active ? '#fff' : _AT.text, border:`1px solid ${active ? _AT.ink : _AT.line}`, whiteSpace:'nowrap', display:'inline-flex', alignItems:'center', gap:6 }}>
    {label}{sub && <span style={{ fontSize:10.5, opacity:.6 }}>{sub}</span>}
  </button>
);
// Native checkbox so the browser — not React style patching — owns the link
// between state and paint. appearance:none + :checked drives the whole visual.
const AIW_SWITCH_CSS = 'aiw-switch-css';
if (!document.getElementById(AIW_SWITCH_CSS)) {
  const st = document.createElement('style');
  st.id = AIW_SWITCH_CSS;
  st.textContent = [
    'input.aiw-switch{-webkit-appearance:none;appearance:none;margin:0;width:46px;height:28px;border-radius:999px;border:none;padding:0;cursor:pointer;position:relative;flex-shrink:0;background:#D9DCE7;transition:background .2s}',
    'input.aiw-switch:checked{background:' + _AT.indigo + '}',
    'input.aiw-switch::after{content:"";position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:999px;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.2);transition:transform .2s}',
    'input.aiw-switch:checked::after{transform:translateX(18px)}',
    'input.aiw-switch:focus-visible{outline:2px solid ' + _AT.indigo + ';outline-offset:2px}',
  ].join('');
  document.head.appendChild(st);
}
const AiwToggle = ({ on, onClick, label }) => (
  <input type="checkbox" role="switch" className="aiw-switch" aria-label={label} checked={!!on} onChange={onClick}/>
);
const AiwNote = ({ tone = 'info', children }) => {
  const map = { info:[_AT.indigoSoft, _AT.indigo, _AT.text], warn:[_AT.warnSoft, _AT.warn, '#8A6516'], good:[_AT.posSoft, _AT.pos, _AT.text] };
  const [bg, ic, fg] = map[tone];
  return (
    <div style={{ display:'flex', gap:10, alignItems:'flex-start', padding:'12px 14px', borderRadius:13, background:bg, border:`1px solid ${ic}2A` }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:1 }}>
        {tone === 'warn'
          ? <React.Fragment><path d="M12 4L2.5 20h19L12 4z" stroke={ic} strokeWidth="2" strokeLinejoin="round"/><path d="M12 10v4M12 17h.01" stroke={ic} strokeWidth="2" strokeLinecap="round"/></React.Fragment>
          : <React.Fragment><circle cx="12" cy="12" r="9" stroke={ic} strokeWidth="2"/><path d="M12 16v-4M12 8h.01" stroke={ic} strokeWidth="2" strokeLinecap="round"/></React.Fragment>}
      </svg>
      <div style={{ fontSize:12, color:fg, lineHeight:1.55, fontWeight:600 }}>{children}</div>
    </div>
  );
};
const AiwRow = ({ l, v, strong }) => (
  <div style={{ display:'flex', justifyContent:'space-between', gap:16, padding:'11px 0', borderTop:`1px solid ${_AT.line2}` }}>
    <span style={{ fontSize:12.5, color:_AT.muted, fontWeight:600, flexShrink:0 }}>{l}</span>
    <span style={{ fontSize:12.5, fontWeight: strong ? 800 : 700, color: strong ? _AT.indigo : _AT.ink, textAlign:'right' }}>{v}</span>
  </div>
);
const AiwIcon = ({ size = 44, r = 13, light }) => (
  <div style={{ width:size, height:size, borderRadius:r, background: light ? 'rgba(255,255,255,.12)' : _AT.indigoSoft, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
    <svg width={size*0.5} height={size*0.5} viewBox="0 0 24 24" fill="none"><path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke={light ? '#fff' : _AT.indigo} strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="12" r="5.5" stroke={light ? '#fff' : _AT.indigo} strokeWidth="2"/></svg>
  </div>
);
const aiwCard = { background:_AT.surface, border:`1px solid ${_AT.line2}`, borderRadius:20 };
// Plan-name field — reads as a real text input: focus ring, clear button, counter.
const AiwNameField = ({ value, auto, onChange, size = 16 }) => {
  const [foc, setFoc] = _aiwS(false);
  const v = value === undefined ? auto : value;
  return (
    <React.Fragment>
      <div style={{ display:'flex', alignItems:'center', height:52, background:_AT.surface, borderRadius:12, border:'1.5px solid ' + (foc ? _AT.indigo : _AT.line), boxShadow: foc ? `0 0 0 4px ${_AT.indigoSoft}` : 'none', transition:'border-color .15s, box-shadow .15s' }}>
        <input value={v} maxLength={28} onChange={(e)=>onChange(e.target.value)} placeholder={auto}
          onFocus={()=>setFoc(true)} onBlur={()=>setFoc(false)}
          style={{ flex:1, minWidth:0, height:'100%', border:'none', outline:'none', background:'transparent', padding:'0 6px 0 15px', fontSize:size, fontWeight:700, color:_AT.ink, letterSpacing:'-0.01em', fontFamily:'inherit' }}/>
        {v.length > 0 && (
          <button onClick={()=>onChange('')} aria-label="Цэвэрлэх" style={{ width:26, height:26, marginRight:6, flexShrink:0, borderRadius:999, border:'none', background:_AT.field, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', padding:0 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6l-12 12" stroke={_AT.muted} strokeWidth="2.6" strokeLinecap="round"/></svg>
          </button>
        )}
        <span className="num" style={{ paddingRight:14, fontSize:11.5, color: v.length >= 28 ? _AT.warn : _AT.muted2, fontWeight:700, flexShrink:0 }}>{v.length}/28</span>
      </div>
      {!v.trim() && <div style={{ marginTop:7, fontSize:11.5, color:_AT.muted, fontWeight:600 }}>Хоосон бол автомат нэр хэрэглэнэ — „{auto}“</div>}
    </React.Fragment>
  );
};
// Prototype-only switch: which of the two stakeholder options is on show.
const AiwVariantSwitch = ({ value, onPick }) => (
  <div style={{ marginTop:20, border:`1px dashed ${_AT.line}`, borderRadius:14, padding:'10px 12px 12px', background:_AT.field }}>
    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9.5, fontWeight:700, letterSpacing:'0.1em', color:_AT.muted2, textTransform:'uppercase' }}>Stakeholder шийдвэрлэх</div>
    <div style={{ display:'flex', gap:6, marginTop:8 }}>
      {[['a','A · Автомат'],['b','B · Сонголттой']].map(([k, l]) => (
        <button key={k} onClick={()=>onPick(k)} style={{ flex:1, height:32, borderRadius:9, cursor:'pointer', fontFamily:'inherit', border:`1px solid ${value===k ? _AT.indigo : _AT.line}`, background: value===k ? _AT.indigoSoft : _AT.surface, color: value===k ? _AT.indigo : _AT.muted, fontWeight:700, fontSize:11.5 }}>{l}</button>
      ))}
    </div>
  </div>
);
const AiwRadioCard = ({ active, onClick, title, desc, meta }) => (
  <button onClick={onClick} style={{ width:'100%', textAlign:'left', display:'flex', gap:12, alignItems:'flex-start', padding:'14px 15px', borderRadius:14, cursor:'pointer', fontFamily:'inherit', background: active ? _AT.indigoSoft : _AT.surface, border:`${active ? 2 : 1}px solid ${active ? _AT.indigo : _AT.line2}` }}>
    <span style={{ width:20, height:20, borderRadius:999, flexShrink:0, marginTop:1, border:`2px solid ${active ? _AT.indigo : '#CFD4E4'}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
      {active && <span style={{ width:10, height:10, borderRadius:999, background:_AT.indigo }}></span>}
    </span>
    <div style={{ flex:1, minWidth:0 }}>
      <div style={{ fontSize:13.5, fontWeight:800, color:_AT.ink }}>{title}</div>
      <div style={{ fontSize:11.5, color:_AT.muted, marginTop:4, lineHeight:1.55 }}>{desc}</div>
      {meta && <div style={{ fontSize:11, color:_AT.muted2, marginTop:6, fontWeight:700 }}>{meta}</div>}
    </div>
  </button>
);

/* ── setup wizard (modal) ────────────────────────────────────── */
const AiwLoopCard = ({ on, onToggle }) => {
  const [info, setInfo] = _aiwS(false);
  return (
    <div style={{ ...aiwCard, borderRadius:14, marginTop:12, padding:'14px 16px', border:`1px solid ${on ? _AT.indigo : _AT.line2}` }}>
      <div style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
        <div style={{ width:36, height:36, borderRadius:11, background: on ? _AT.indigoSoft : _AT.field, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M4 12a8 8 0 0113.7-5.6M20 12a8 8 0 01-13.7 5.6" stroke={on ? _AT.indigo : _AT.muted} strokeWidth="2" strokeLinecap="round"/><path d="M18 3v4h-4M6 21v-4h4" stroke={on ? _AT.indigo : _AT.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:13, fontWeight:800, color:_AT.ink }}>Хугацаа дуусахад дахин автоматаар авах</div>
          <div style={{ fontSize:11.5, color:_AT.muted, marginTop:3, lineHeight:1.5 }}>Үндсэн дүн ижил буюу төстэй бүтээгдэхүүнд дахин хөрөнгө оруулагдана. Хэтэвчинд сул хэвтэхгүй.</div>
        </div>
        <AiwToggle on={on} onClick={onToggle} label="Дахин автоматаар авах"/>
      </div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, marginTop:10 }}>
        <span style={{ fontSize:11, color:_AT.muted2, fontWeight:600 }}>{on ? 'Хугацаа дуусах бүрт автоматаар шинэчилнэ' : 'Асаагаагүй бол төлөгдөх дүн хэтэвчид орно'}</span>
        <button onClick={()=>setInfo(v=>!v)} style={{ background:'none', border:'none', padding:0, cursor:'pointer', fontFamily:'inherit', fontSize:11.5, fontWeight:700, color:_AT.indigo, textDecoration:'underline', textUnderlineOffset:3 }}>{info ? 'Хаах' : 'Энэ юу вэ?'}</button>
      </div>
      {info && (
        <div style={{ marginTop:12, borderTop:`1px solid ${_AT.line2}`, paddingTop:12, display:'flex', flexDirection:'column', gap:10 }}>
          {[['1','Хугацаа дуусна','Үндсэн дүн болон бодогдсон өгөөж хэтэвчинд орно.'],['2','Ижил бүтээгдэхүүн хайна','Тэр өдөр анхдагч зах зээлд байгаа ижил төрөл, ижил хугацаатайг эрэмбийн дарааллаар шалгана.'],['3','Дахин худалдан авна','Үндсэн дүнгээр шинэ бүтээгдэхүүн авна. Ижил нь байхгүй бол төстэй нөхцөлтэйг санал болгоно.'],['4','Өгөөж хэтэвчид','Бодогдсон өгөөж хэтэвчинд үлдэх бөгөөд та чөлөөтэй захиран зарцуулна.']].map(([n,t,d]) => (
            <div key={n} style={{ display:'flex', gap:11, alignItems:'flex-start' }}>
              <span style={{ width:22, height:22, borderRadius:8, background:_AT.indigoSoft, color:_AT.indigo, fontSize:11.5, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>{n}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12.5, fontWeight:800, color:_AT.ink }}>{t}</div>
                <div style={{ fontSize:11.5, color:_AT.muted, marginTop:2, lineHeight:1.5 }}>{d}</div>
              </div>
            </div>
          ))}
          <div style={{ padding:'11px 13px', borderRadius:11, background:_AT.field, fontSize:11.5, color:_AT.muted, lineHeight:1.5 }}>Та үүнийг хэдийд ч унтраах боломжтой. Унтраасны дараа дуусах хугацаанд үндсэн дүн хэтэвчинд орж, дахин худалдан авалт хийгдэхгүй.</div>
        </div>
      )}
    </div>
  );
};

const AIW_STEPS = ['Төрөл ба хугацаа', 'Нэгж ба давтамж', 'Эрэмбэ', 'Эх үүсвэр', 'Хянах'];
const AIW_LASTSTEP = AIW_STEPS.length - 1;

const AiwUnitStepper = ({ units, price, onSet }) => (
  <div style={{ ...aiwCard, borderRadius:16, padding:'16px 18px', display:'flex', alignItems:'center', gap:16 }}>
    <button onClick={() => onSet(units - 1)} aria-label="Хасах" style={{ width:44, height:44, borderRadius:13, background:_AT.field, border:'1px solid ' + _AT.line2, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke={_AT.ink} strokeWidth="2.6" strokeLinecap="round"/></svg>
    </button>
    <div style={{ flex:1, textAlign:'center' }}>
      <div className="num" style={{ fontSize:32, fontWeight:800, color:_AT.ink, lineHeight:1, letterSpacing:'-0.02em' }}>{units}</div>
      <div style={{ fontSize:11.5, color:_AT.muted, fontWeight:700, marginTop:6 }}>ширхэг × {aiwMnt(price)} = {aiwMnt(units * price)}</div>
    </div>
    <button onClick={() => onSet(units + 1)} aria-label="Нэмэх" style={{ width:44, height:44, borderRadius:13, background:_AT.indigo, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.6" strokeLinecap="round"/></svg>
    </button>
  </div>
);

const AiwRankRow = ({ p, rank, on, onToggle, onUp, onDown, first, last }) => (
  <div style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 14px', borderRadius:14, background:_AT.surface, border:'1px solid ' + (on ? _AT.indigoBorder : _AT.line2), opacity: on ? 1 : .62 }}>
    <span style={{ width:26, height:26, borderRadius:9, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12.5, fontWeight:800, background: on ? _AT.indigo : _AT.field, color: on ? '#fff' : _AT.muted2 }}>{on ? rank : '–'}</span>
    <button onClick={onToggle} style={{ flex:1, minWidth:0, display:'flex', alignItems:'center', gap:11, background:'none', border:'none', padding:0, cursor:'pointer', textAlign:'left', fontFamily:'inherit' }}>
      <span style={{ width:20, height:20, borderRadius:6, flexShrink:0, border:'2px solid ' + (on ? _AT.indigo : '#CFD4E4'), background: on ? _AT.indigo : _AT.surface, display:'flex', alignItems:'center', justifyContent:'center' }}>
        {on && <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </span>
      <span style={{ flex:1, minWidth:0 }}>
        <span style={{ display:'block', fontSize:13, fontWeight:800, color:_AT.ink, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.issuer}</span>
        <span style={{ display:'block', fontSize:11, color:_AT.muted, marginTop:2 }}>{p.ticker} · {p.kind}</span>
      </span>
      <span className="num" style={{ fontSize:13.5, fontWeight:800, color: on ? _AT.pos : _AT.muted2, flexShrink:0 }}>{p.y.toFixed(1)}%</span>
    </button>
    <div style={{ display:'flex', flexDirection:'column', gap:3, flexShrink:0 }}>
      <button onClick={onUp} disabled={first} aria-label="Дээш" style={{ width:26, height:19, borderRadius:6, background:_AT.field, border:'1px solid ' + _AT.line2, cursor: first ? 'default' : 'pointer', opacity: first ? .4 : 1, display:'flex', alignItems:'center', justifyContent:'center', padding:0 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 15l6-6 6 6" stroke={_AT.ink} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <button onClick={onDown} disabled={last} aria-label="Доош" style={{ width:26, height:19, borderRadius:6, background:_AT.field, border:'1px solid ' + _AT.line2, cursor: last ? 'default' : 'pointer', opacity: last ? .4 : 1, display:'flex', alignItems:'center', justifyContent:'center', padding:0 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke={_AT.ink} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>
  </div>
);

const AiwSetupModal = ({ open, onClose, onDone }) => {
  const s = useAiwPlan();
  const [step, setStep] = _aiwS(0);
  const [draft, setDraft] = _aiwS(() => ({ ...s.cfg }));
  _aiwE(() => {
    if (!open) return;
    setStep(0);
    // A new plan seeds from the live plan's shape but NOT its narrowed
    // selection/order — those are per-plan and default to "all products".
    setDraft({ ...AIW_DEFAULT, ...AIW_STORE.cfg, picked: null, order: null });
  }, [open]);
  const set = (p) => setDraft(d => ({ ...d, ...p }));
  if (!open) return null;

  const type = aiwType(draft);
  const term = aiwTermOf(draft);
  const price = aiwUnitPrice(draft);
  const units = draft.units || 1;
  const total = units * price;
  const pool = aiwPool(draft);
  const tickers = pool.map(p => p.ticker);
  const saved = (draft.order || []).filter(t => tickers.includes(t));
  const order = [...saved, ...tickers.filter(t => !saved.includes(t))];
  const picked = draft.picked === null || draft.picked === undefined ? tickers : draft.picked.filter(t => tickers.includes(t));
  const chosen = order.filter(t => picked.includes(t));
  const byT = {}; pool.forEach(p => { byT[p.ticker] = p; });

  const pickType = (t) => set({ types:[t], term: aiwTerms(t)[0], maxTerm: aiwTerms(t)[0], amount: (draft.units || 1) * (AIW_TICKET[t] || 100000), order:null, picked:null });
  const pickTerm = (t) => set({ term:t, maxTerm:t, order:null, picked:null });
  const setU = (u) => { const n = Math.max(1, Math.min(999, u)); set({ units:n, amount: n * price }); };
  const move = (t, dir) => { const arr = [...order]; const i = arr.indexOf(t), j = i + dir; if (j < 0 || j >= arr.length) return; arr[i] = arr[j]; arr[j] = t; set({ order: arr }); };
  const toggle = (t) => set({ picked: picked.includes(t) ? picked.filter(x => x !== t) : [...picked, t] });

  const blocked = step === 0 ? pool.length === 0 : step === 2 ? chosen.length === 0 : false;
  const blockReason = step === 0 ? 'Энэ хугацаагаар бүтээгдэхүүн алга' : 'Даад тал нэг бүтээгдэхүүн сонгоно уу';
  const ctaLabel = step === AIW_LASTSTEP ? 'Баталгаажуулах' : step === AIW_LASTSTEP - 1 ? 'Хянах' : 'Үргэлжлүүлэх';
  const advance = () => {
    if (step < AIW_LASTSTEP) { setStep(step + 1); return; }
    AIW_STORE.setCfg({ ...draft, order, picked });
    onDone && onDone();
  };

  const panes = [
    (
      <React.Fragment key="p0">
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', borderRadius:12, background:_AT.field, border:'1px solid ' + _AT.line2 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0 }}><circle cx="12" cy="12" r="9" stroke={_AT.muted2} strokeWidth="2"/><path d="M12 16v-4M12 8h.01" stroke={_AT.muted2} strokeWidth="2" strokeLinecap="round"/></svg>
          <div style={{ fontSize:11.5, color:_AT.muted, fontWeight:600, lineHeight:1.5 }}>Автомат хөрөнгө оруулалт зөвхөн <b style={{ color:_AT.ink }}>Анхдагч зах зээл</b> дээр ажиллана.</div>
        </div>
        <AiwLabel hint="(нэгийг сонгоно)">Бүтээгдэхүүний төрөл</AiwLabel>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
          {[['Сертификат','Банкны хадгаламжийн сертификат','Нэгж ₮ 100,000'],['Итгэлцэл','ББСБ-ын итгэлцлийн нэгж','Нэгж ₮ 1,000,000']].map(([t, d, m]) => (
            <AiwRadioCard key={t} active={type===t} onClick={()=>pickType(t)} title={t} desc={d} meta={m}/>
          ))}
        </div>
        <AiwLabel hint="— бүтээгдэхүүний хугацаа, төлөвлөгөөнийх биш">Хугацаа</AiwLabel>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
          {aiwTerms(type).map(t => {
            const ps = AIW_MARKET.filter(p => p.t === type && p.term === t);
            const ys = ps.map(p => p.y);
            return <AiwRadioCard key={t} active={term===t} onClick={()=>pickTerm(t)} title={t + ' сар'}
              desc={ps.length + ' гаргагчийн бүтээгдэхүүн боломжтой'}
              meta={ys.length ? 'Өгөөж ' + Math.min(...ys).toFixed(1) + '–' + Math.max(...ys).toFixed(1) + '%' : ''}/>;
          })}
        </div>
        <div style={{ marginTop:6 }}>
          <AiwLoopCard on={draft.reinvest !== false} onToggle={()=>set({ reinvest: !(draft.reinvest !== false) })}/>
        </div>
        <div style={{ marginTop:12 }}>
          <AiwNote tone="warn">Харагдаж буй өгөөж нь өнөөдрийн зах зээлийн түвшин. Гаргагч бүр шинэ бүтээгдэхүүнээ өөр хүүтэй гаргаж болох тул ирээдүйн худалдан авалтын өгөөж өөрчлөгдөнө — тогтмол биш.</AiwNote>
        </div>
      </React.Fragment>
    ),
    (
      <React.Fragment key="p1">
        <AiwLabel top={0} hint={'— нэгжийн үнэ ' + aiwMnt(price)}>Нэгжийн тоо</AiwLabel>
        <AiwUnitStepper units={units} price={price} onSet={setU}/>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginTop:10 }}>
          {[1, 3, 5, 10].map(u => (
            <button key={u} onClick={()=>setU(u)} style={{ height:40, borderRadius:11, fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit', background: units===u ? _AT.ink : _AT.surface, color: units===u ? '#fff' : _AT.text, border:'1px solid ' + (units===u ? _AT.ink : _AT.line) }}>{u}</button>
          ))}
        </div>
        <AiwLabel>Давтамж</AiwLabel>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {['Өдөр бүр','7 хоног бүр','Сар бүр'].map(f => <AiwChip key={f} label={f} active={draft.freq===f} onClick={()=>set({ freq:f })}/>)}
        </div>
        <AiwLabel>Гүйцэтгэх өдөр</AiwLabel>
        {draft.freq === 'Өдөр бүр' ? (
          <div style={{ ...aiwCard, borderRadius:14, padding:'14px 16px', display:'flex', alignItems:'flex-start', gap:12 }}>
            <div style={{ width:36, height:36, borderRadius:11, background:_AT.indigoSoft, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={_AT.indigo} strokeWidth="2"/><path d="M12 7v5l3 2" stroke={_AT.indigo} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:800, color:_AT.ink }}>Ажлын өдөр бүр (Да–Ба)</div>
              <div style={{ fontSize:11.5, color:_AT.muted, marginTop:3, lineHeight:1.5 }}>Ажлын өдөр бүр {aiwMnt(total)} хасагдана. Амралтын болон баярын өдөр алгасна. Сонгох зүйл алга.</div>
            </div>
          </div>
        ) : draft.freq === '7 хоног бүр' ? (
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {AIW_WDFULL.map((w, i) => <AiwChip key={w} label={w} active={(draft.payWd || 0)===i} onClick={()=>set({ payWd:i })}/>)}
          </div>
        ) : (
          <div style={{ ...aiwCard, borderRadius:14, padding:'12px 14px' }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:6 }}>
              {Array.from({ length:28 }, (_, k) => k + 1).map(d => (
                <button key={d} onClick={()=>set({ day:String(d) })} className="num" style={{ height:34, borderRadius:9, fontSize:12.5, fontWeight: String(d)===draft.day ? 800 : 600, cursor:'pointer', fontFamily:'inherit', background: String(d)===draft.day ? _AT.indigo : 'transparent', color: String(d)===draft.day ? '#fff' : _AT.text, border:'none' }}>{d}</button>
              ))}
            </div>
            <div style={{ fontSize:11, color:_AT.muted, marginTop:10, lineHeight:1.5, borderTop:'1px solid ' + _AT.line2, paddingTop:10 }}>29–31 нь бүх сард давтагдахгүй тул сонгох боломжгүй.</div>
          </div>
        )}
        <AiwLabel>Төлөвлөгөө дуусах</AiwLabel>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          <AiwChip label="Хязгааргүй" active={draft.endMode==='unlimited'} onClick={()=>set({ endMode:'unlimited' })}/>
          {[3, 5, 10].map(y => <AiwChip key={y} label={y + ' жил'} active={draft.endMode==='years' && draft.endYears===y} onClick={()=>set({ endMode:'years', endYears:y })}/>)}
          <AiwChip label="Тодорхой огноо" active={draft.endMode==='date'} onClick={()=>set({ endMode:'date' })}/>
        </div>
        {draft.endMode === 'date' && (
          <input type="date" value={draft.endDate || ''} min="2026-08-15" onChange={(e)=>set({ endDate:e.target.value })}
            style={{ marginTop:10, width:'100%', height:44, borderRadius:12, border:'1px solid ' + _AT.line, background:_AT.surface, padding:'0 14px', fontSize:13.5, fontWeight:700, color:_AT.ink, fontFamily:'inherit' }}/>
        )}
        <div style={{ ...aiwCard, borderRadius:14, marginTop:18, padding:'14px 16px', display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:800, color:_AT.ink }}>Хүрэлцэхгүй бол хуримтлуулах</div>
            <div style={{ fontSize:11.5, color:_AT.muted, marginTop:3, lineHeight:1.5 }}>Нэгж үнэд хүрэхгүй бол мөнгө хэтэвчинд хуримтлагдаж, хүрэлцсэн үед худалдан авна.</div>
          </div>
          <AiwToggle on={draft.accumulate} onClick={()=>set({ accumulate:!draft.accumulate })} label="Хуримтлуулах"/>
        </div>
        <div style={{ ...aiwCard, borderRadius:14, marginTop:12, padding:'14px 16px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', gap:16 }}>
            <div>
              <div style={{ fontSize:11, color:_AT.muted, fontWeight:700 }}>Нэг удаад</div>
              <div className="num" style={{ fontSize:18, fontWeight:800, color:_AT.ink, marginTop:4 }}>{aiwMnt(total)}</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:11, color:_AT.muted, fontWeight:700 }}>Жилд нийт</div>
              <div className="num" style={{ fontSize:18, fontWeight:800, color:_AT.ink, marginTop:4 }}>{aiwMnt(total * aiwPerYear(draft.freq))}</div>
            </div>
          </div>
          {aiwYears(draft) > 0 && (
            <div style={{ marginTop:12, borderTop:'1px solid ' + _AT.line2, paddingTop:12, display:'flex', justifyContent:'space-between', gap:16 }}>
              <span style={{ fontSize:11.5, color:_AT.muted, fontWeight:700 }}>{aiwEndLabel(draft)}-н дараах төсөөлөл</span>
              <span className="num" style={{ fontSize:14, fontWeight:800, color:_AT.pos }}>{aiwMnt(Math.round(aiwFV(total, aiwPerYear(draft.freq), aiwYears(draft), aiwRate(draft))))}</span>
            </div>
          )}
        </div>
      </React.Fragment>
    ),
    (
      <React.Fragment key="p2">
        <AiwNote>Гүйцэтгэх өдөр бүр <b>1-рт</b> тавьсныг эхэлж авна. Тэр өдөр зарагдаагүй бол <b>2-рт</b>, дараа нь <b>3-рт</b> тавьсныг авна. Өөрөөр хэлбэл дээрээс нь доош дараалуулж шалгана.</AiwNote>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, marginTop:18 }}>
          <div style={{ fontSize:12.5, fontWeight:800, color:_AT.ink }}>{type} · {term} сар</div>
          <span style={{ fontSize:11.5, fontWeight:800, color: chosen.length ? _AT.pos : _AT.warn }}>Сонгосон {chosen.length}/{pool.length}</span>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:10 }}>
          {order.map((t, i) => {
            const p = byT[t]; if (!p) return null;
            const on = picked.includes(t);
            const rank = order.slice(0, i + 1).filter(x => picked.includes(x)).length;
            return <AiwRankRow key={t} p={p} rank={rank} on={on} first={i === 0} last={i === order.length - 1}
              onToggle={()=>toggle(t)} onUp={()=>move(t, -1)} onDown={()=>move(t, 1)}/>;
          })}
        </div>
        <div style={{ marginTop:14 }}>
          <AiwNote tone="warn">Харагдаж буй өгөөж нь өнөөдрийн зах зээлийн түвшин. Гаргагч бүр шинэ бүтээгдэхүүнээ өөр хүүтэй гаргаж болох тул ирээдүйн худалдан авалтын өгөөж өөрчлөгдөнө — тогтмол биш.</AiwNote>
        </div>
      </React.Fragment>
    ),
    (
      <React.Fragment key="p3">
        {/* Same structure as the mobile AIPayment card: plain surface, balance
            line, then a quiet summary panel of what gets debited and when. */}
        <div style={{ ...aiwCard, borderRadius:16, padding:'15px 16px' }}>
          <div style={{ display:'flex', gap:13, alignItems:'center' }}>
            <div style={{ width:38, height:38, borderRadius:11, background:_AT.indigoSoft, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="13" rx="3" stroke={_AT.indigo} strokeWidth="2"/><path d="M16 12.5h2" stroke={_AT.indigo} strokeWidth="2.4" strokeLinecap="round"/></svg>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:14, fontWeight:800, color:_AT.ink }}>Хэтэвчний үлдэгдэл</span>
                <span style={{ fontSize:10, fontWeight:800, color:_AT.indigo, background:_AT.indigoSoft, padding:'3px 8px', borderRadius:999 }}>Үндсэн</span>
              </div>
              <div className="num" style={{ fontSize:12, color:_AT.muted, marginTop:3, fontFamily:"'JetBrains Mono',monospace" }}>₮ 12,000,000</div>
            </div>
          </div>
          <div style={{ marginTop:13, padding:'13px 14px', borderRadius:13, background:_AT.field, border:'1px solid ' + _AT.line2 }}>
            <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', gap:10 }}>
              <span style={{ fontSize:11, color:_AT.muted, fontWeight:700 }}>Нэг удаад хасагдах</span>
              <span className="num" style={{ fontSize:19, fontWeight:800, color:_AT.ink, letterSpacing:'-0.01em', whiteSpace:'nowrap', fontFamily:"'JetBrains Mono',monospace" }}>{aiwMnt(total)}</span>
            </div>
            <div style={{ marginTop:9, paddingTop:9, borderTop:'1px solid ' + _AT.line2, display:'flex', flexDirection:'column', gap:7 }}>
              {[
                ['Давтамж', draft.freq],
                ['Хасагдах өдөр', aiwDayLabel(draft)],
                ['Сард ойролцоогоор', aiwMnt(Math.round(total * aiwPerYear(draft.freq) / 12))],
              ].map(([l, v]) => (
                <div key={l} style={{ display:'flex', justifyContent:'space-between', gap:10 }}>
                  <span style={{ fontSize:11.5, color:_AT.muted, fontWeight:600 }}>{l}</span>
                  <span style={{ fontSize:12, fontWeight:700, color:_AT.ink }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ ...aiwCard, borderRadius:14, marginTop:14, padding:'15px 16px', border:'2px solid ' + _AT.indigo }}>
          <div style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                <span style={{ fontSize:13, fontWeight:800, color:_AT.ink }}>Картаас автомат хасалт</span>
                <span style={{ fontSize:10, fontWeight:800, color:_AT.indigo, background:_AT.indigoSoft, padding:'3px 8px', borderRadius:999 }}>Шаардлагатай</span>
              </div>
              <div style={{ fontSize:11.5, color:_AT.muted, marginTop:3, lineHeight:1.5 }}>Үлдэгдэл хүрэлцэхгүй тохиолдолд дутах дүнг холбосон картаас автоматаар хасна.</div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:2 }}><rect x="5" y="11" width="14" height="9" rx="2.5" stroke={_AT.indigo} strokeWidth="1.9"/><path d="M8 11V8a4 4 0 018 0v3" stroke={_AT.indigo} strokeWidth="1.9" strokeLinecap="round"/></svg>
          </div>
          <div style={{ marginTop:12, display:'flex', alignItems:'center', gap:11, padding:'11px 13px', borderRadius:11, background:_AT.field, border:'1px solid ' + _AT.line2 }}>
            <div style={{ width:34, height:24, borderRadius:6, background:'#0E5F2E', color:'#fff', fontSize:8, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center' }}>ХБ</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12.5, fontWeight:700, color:_AT.ink }}>Хаан Банк •••• 4512</div>
              <div style={{ fontSize:10.5, color:_AT.muted, marginTop:1 }}>Хасалт хийгдэх карт</div>
            </div>
            <a href="06 Wallet.html#cards" style={{ fontSize:11.5, fontWeight:700, color:_AT.indigo, textDecoration:'none' }}>Солих</a>
          </div>
        </div>
        <div style={{ marginTop:14 }}><AiwNote>Гүйцэтгэх өдөр тохирох бүтээгдэхүүн байхгүй бол <b>картаас мөнгө хасахгүй</b> — тэр өдрийг алгасаж, дараагийн хуваарьт дахин оролдоно.</AiwNote></div>
      </React.Fragment>
    ),
    (
      <React.Fragment key="p4">
        <AiwLabel top={0} hint="— дараа ч өөрчилж болно">Төлөвлөгөөний нэр</AiwLabel>
        <AiwNameField value={draft.name} auto={aiwAutoName(draft)} onChange={(name)=>set({ name })}/>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop:10 }}>
          {[aiwAutoName(draft), 'Хуримтлал', 'Боловсролын сан', 'Аюулгүйн нөөц'].map(n => (
            <AiwChip key={n} label={n} active={(draft.name === undefined ? aiwAutoName(draft) : draft.name) === n} onClick={()=>set({ name:n })}/>
          ))}
        </div>
        <div style={{ ...aiwCard, padding:'4px 18px 6px', marginTop:18 }}>
          <div style={{ display:'flex', alignItems:'center', gap:13, padding:'14px 0' }}>
            <AiwIcon/>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:15, fontWeight:800, color:_AT.ink }}>{(draft.name && draft.name.trim()) || aiwAutoName(draft)}</div>
              <div style={{ fontSize:11.5, color:_AT.muted, marginTop:2 }}>{aiwMnt(total)} · {draft.freq} · {units} нэгж</div>
            </div>
          </div>
          <AiwRow l="Бүтээгдэхүүн" v={type + ' · ' + term + ' сар'}/>
          <AiwRow l="Нэгж" v={units + ' × ' + aiwMnt(price)}/>
          <AiwRow l="Давтамж" v={draft.freq}/>
          <AiwRow l="Гүйцэтгэх" v={aiwDayLabel(draft)}/>
          <AiwRow l="Эрэмбэ" v={chosen.length + ' бүтээгдэхүүн'}/>
          <AiwRow l="Дуусах" v={aiwEndLabel(draft)}/>
          <AiwRow l="Хугацаа дуусахад" v={draft.reinvest !== false ? 'Дахин автоматаар авна' : 'Хэтэвчинд орно'} strong/>
        </div>
        <div style={{ fontSize:12.5, fontWeight:800, color:_AT.ink, marginTop:18, marginBottom:8 }}>Худалдан авах эрэмбэ</div>
        <div style={{ ...aiwCard, padding:'2px 16px 4px' }}>
          {chosen.map((t, i) => (
            <div key={t} style={{ display:'flex', alignItems:'center', gap:11, padding:'11px 0', borderTop: i ? '1px solid ' + _AT.line2 : 'none' }}>
              <span style={{ width:24, height:24, borderRadius:8, background:_AT.indigoSoft, color:_AT.indigo, fontSize:12, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{i + 1}</span>
              <span style={{ flex:1, minWidth:0, fontSize:12.5, fontWeight:700, color:_AT.ink, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{byT[t].issuer}</span>
              <span className="num" style={{ fontSize:12.5, fontWeight:800, color:_AT.pos, flexShrink:0 }}>{byT[t].y.toFixed(1)}%</span>
            </div>
          ))}
        </div>
        <div style={{ fontSize:12.5, fontWeight:800, color:_AT.ink, marginTop:18, marginBottom:8 }}>Онцгой тохиолдолд</div>
        <div style={{ ...aiwCard, padding:'4px 16px' }}>
          {[
            ['Эрэмбэд тавьсан нь зарагдаагүй', 'Дараагийн эрэмбэд шилжинэ. Нэг ч байхгүй бол тэр өдрийг алгасана — мөнгө хасахгүй.'],
            ['Нэгж үнэд хүрэхгүй', draft.accumulate ? 'Хуримтлуулж, хүрэлцсэн үед худалдан авна.' : 'Тухайн гүйцэтгэлийг алгасана.'],
            ['Хугацаа дуусахад', draft.reinvest !== false ? 'Үндсэн дүн ижил бүтээгдэхүүнд дахин ажиллана. Өгөөж хэтэвчид үлдэнэ.' : 'Үндсэн дүн болон өгөөж хэтэвчинд буцаж орно.'],
          ].map(([t, d], i) => (
            <div key={i} style={{ padding:'12px 0', borderTop: i ? '1px solid ' + _AT.line2 : 'none' }}>
              <div style={{ fontSize:12.5, fontWeight:700, color:_AT.ink }}>{t}</div>
              <div style={{ fontSize:11.5, color:_AT.muted, marginTop:3, lineHeight:1.5 }}>{d}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:14 }}><_AWDisc>Хөрөнгө оруулалт эрсдэлтэй. Өнгөрсөн өгөөж ирээдүйн үр дүнг баталгаажуулахгүй.</_AWDisc></div>
      </React.Fragment>
    ),
  ];

  return (
    <_AWModal open onClose={onClose} title="Автомат хөрөнгө оруулалт" ticker={'Алхам ' + (step + 1) + '/' + AIW_STEPS.length + ' · ' + AIW_STEPS[step]}
      footer={
        <div>
          <_AWBtn full variant="primary" disabled={blocked} reason={blocked ? blockReason : null} onClick={advance}>{ctaLabel}</_AWBtn>
          {step > 0 && <button onClick={()=>setStep(step - 1)} style={{ width:'100%', height:44, marginTop:8, borderRadius:12, background:'transparent', border:'none', color:_AT.muted, fontWeight:700, fontSize:13.5, cursor:'pointer', fontFamily:'inherit' }}>Буцах</button>}
        </div>
      }>
      <div style={{ height:4, borderRadius:999, background:_AT.line, overflow:'hidden', marginBottom:18 }}>
        <div style={{ width: ((step + 1) / AIW_STEPS.length * 100) + '%', height:'100%', background:_AT.indigo, borderRadius:999, transition:'width .3s ease' }}></div>
      </div>
      {panes[step]}
    </_AWModal>
  );
};

/* ── PIN confirm + success ───────────────────────────────────── */
const AiwPinModal = ({ open, onClose, onDone }) => {
  if (!open) return null;
  return (
    <_AWModal open onClose={onClose} title="ПИН кодоор баталгаажуулах" ticker="Автомат төлөвлөгөө">
      <div style={{ padding:'6px 0 20px' }}>
        <div style={{ fontSize:13, color:_AT.muted, fontWeight:600, lineHeight:1.55, marginBottom:18 }}>Төлөвлөгөөг идэвхжүүлэхийн тулд 4 оронтой ПИН кодоо оруулна уу.</div>
        <_AWOtp length={4} onComplete={()=>setTimeout(onDone, 250)}/>
      </div>
    </_AWModal>
  );
};

const AiwSuccessModal = ({ open, onClose }) => {
  const s = useAiwPlan();
  if (!open) return null;
  const first = aiwBest(s.cfg);
  const accumulating = s.cfg.start === 'today' && !first && s.cfg.accumulate;
  return (
    <_AWModal open onClose={onClose} title="Төлөвлөгөө идэвхжлээ"
      footer={<_AWBtn full variant="primary" onClick={onClose}>Төлөвлөгөө харах</_AWBtn>}>
      <div style={{ textAlign:'center', padding:'8px 0 4px' }}>
        <div style={{ width:76, height:76, borderRadius:24, background:_AT.posSoft, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke={_AT.pos} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{ fontSize:13, color:_AT.muted, marginTop:16, lineHeight:1.6, fontWeight:600 }}>
          {s.cfg.start === 'today' && first
            ? <React.Fragment>Эхний худалдан авалт хийгдэж байна: <b style={{ color:_AT.ink }}>{first.ticker}</b> · {first.y}%</React.Fragment>
            : accumulating
              ? <React.Fragment>Тохирох нэгж үнэд хүрээгүй тул <b style={{ color:_AT.ink }}>{aiwMnt(s.cfg.amount)}</b> хэтэвчинд хуримтлагдаж эхэллээ.</React.Fragment>
              : 'Эхний худалдан авалт товлосон өдөр хийгдэнэ.'}
        </div>
      </div>
      <div style={{ ...aiwCard, marginTop:18, padding:'6px 16px' }}>
        <AiwRow l="Төлөвлөгөө" v={aiwMnt(s.cfg.amount) + ' · ' + s.cfg.freq}/>
        <AiwRow l="Дараагийн гүйцэтгэл" v={aiwNext(s.cfg)} strong/>
      </div>
    </_AWModal>
  );
};

/* ── edit modal (mirrors the mobile Засах sheet) ─────────────── */
const AiwEditModal = (props) => props.open ? <AiwEditSheet {...props}/> : null;
// Mounted only while open, so the draft is always seeded from the live plan.
const AiwEditSheet = ({ open, onClose }) => {
  const s = useAiwPlan();
  const [d, setD] = _aiwS(() => ({ ...AIW_STORE.cfg }));
  const [confirm, setConfirm] = _aiwS(false);
  const set = (p) => setD(x => ({ ...x, ...p }));
  const n = aiwPool(d).length;
  return (
    <_AWModal open onClose={onClose} title="Төлөвлөгөө засах" ticker="Дараагийн гүйцэтгэлээс хүчинтэй"
      footer={<_AWBtn full variant="primary" onClick={()=>{ AIW_STORE.setCfg(d); onClose(); }}>Хадгалах</_AWBtn>}>
      <AiwLabel top={0} hint="— дараа ч өөрчилж болно">Төлөвлөгөөний нэр</AiwLabel>
      <AiwNameField value={d.name} auto={aiwAutoName(d)} onChange={(name)=>set({ name })} size={15}/>
      <AiwLabel hint={'— нэгжийн үнэ ' + aiwMnt(aiwUnitPrice(d))}>Нэгжийн тоо</AiwLabel>
      <AiwUnitStepper units={d.units || 1} price={aiwUnitPrice(d)} onSet={(u)=>{ const n2 = Math.max(1, Math.min(999, u)); set({ units:n2, amount: n2 * aiwUnitPrice(d) }); }}/>
      <AiwLabel>Давтамж</AiwLabel>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
        {['Өдөр бүр','7 хоног бүр','Сар бүр'].map(f => <AiwChip key={f} label={f} active={d.freq===f} onClick={()=>set({ freq:f })}/>)}
      </div>
      {d.freq === 'Өдөр бүр' ? (
        <div style={{ fontSize:11.5, color:_AT.muted, marginTop:10, lineHeight:1.5 }}>Ажлын өдөр бүр (Да–Ба) гүйцэтгэнэ. Сонгох өдөр байхгүй.</div>
      ) : (
        <React.Fragment>
          <AiwLabel>Гүйцэтгэх өдөр</AiwLabel>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {d.freq === 'Сар бүр'
              ? ['1','15','25'].map(x => <AiwChip key={x} label={'Сарын ' + x} active={d.day===x} onClick={()=>set({ day:x })}/>)
              : AIW_WDFULL.map((w, i) => <AiwChip key={w} label={w} active={(d.payWd || 0)===i} onClick={()=>set({ payWd:i })}/>)}
          </div>
        </React.Fragment>
      )}
      <div style={{ ...aiwCard, borderRadius:14, marginTop:18, padding:'14px 16px', display:'flex', alignItems:'center', gap:14 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:12.5, fontWeight:800, color:_AT.ink }}>Хүрэлцэхгүй үед хуримтлуулах</div>
          <div style={{ fontSize:11, color:_AT.muted, marginTop:3, lineHeight:1.5 }}>Нэгж үнэд хүрэх хүртэл хэтэвчинд хуримтлана.</div>
        </div>
        <AiwToggle on={d.accumulate} onClick={()=>set({ accumulate:!d.accumulate })} label="Хуримтлуулах"/>
      </div>
      <AiwLoopCard on={d.reinvest !== false} onToggle={()=>set({ reinvest: !(d.reinvest !== false) })}/>
      <div style={{ ...aiwCard, borderRadius:12, marginTop:12, padding:'11px 14px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
        <span style={{ fontSize:11.5, color:_AT.muted, fontWeight:600 }}>Тохирох бүтээгдэхүүн</span>
        <span style={{ fontSize:12.5, fontWeight:800, color: n ? _AT.ink : _AT.warn }}>{n} санал</span>
      </div>
      {confirm ? (
        <div style={{ ...aiwCard, borderRadius:14, marginTop:14, padding:15, borderColor:_AT.negBorder }}>
          <div style={{ fontSize:12.5, fontWeight:800, color:_AT.ink }}>Төлөвлөгөөг цуцлах?</div>
          <div style={{ fontSize:11.5, color:_AT.muted, marginTop:4, lineHeight:1.5 }}>Дараагийн худалдан авалтууд хийгдэхгүй. Худалдан авсан хөрөнгө багцад хэвээр байна.</div>
          <div style={{ display:'flex', gap:8, marginTop:12 }}>
            <button onClick={()=>setConfirm(false)} style={{ flex:1, height:40, borderRadius:11, background:_AT.surface, border:`1.5px solid ${_AT.line}`, fontWeight:700, fontSize:12.5, color:_AT.ink, cursor:'pointer', fontFamily:'inherit' }}>Болих</button>
            <button onClick={()=>{ AIW_STORE.put({ cancelled:true, paused:false }); onClose(); }} style={{ flex:1, height:40, borderRadius:11, background:_AT.neg, border:'none', fontWeight:700, fontSize:12.5, color:'#fff', cursor:'pointer', fontFamily:'inherit' }}>Цуцлах</button>
          </div>
        </div>
      ) : (
        <button onClick={()=>setConfirm(true)} style={{ width:'100%', height:44, marginTop:14, borderRadius:12, background:'transparent', border:'none', fontWeight:700, fontSize:12.5, color:_AT.neg, cursor:'pointer', fontFamily:'inherit' }}>Төлөвлөгөөг цуцлах</button>
      )}
    </_AWModal>
  );
};

/* ── entry points ────────────────────────────────────────────── */
const AiwPromoBanner = ({ compact }) => {
  if (window.MMF_V1) return null;
  const s = useAiwPlan();
  if (!s.live) return (
    <a href="16 Auto Invest.html" style={{ display:'block', textDecoration:'none', borderRadius:20, padding:'20px 24px', marginBottom:24, background:`linear-gradient(120deg, ${_AT.navy} 0%, ${_AT.indigo} 100%)`, color:'#fff', position:'relative', overflow:'hidden' }}>
      <div style={{ display:'flex', alignItems:'center', gap:20, flexWrap:'wrap' }}>
        <AiwIcon size={48} r={14} light/>
        <div style={{ flex:1, minWidth:240 }}>
          <div style={{ display:'flex', alignItems:'center', gap:9 }}>
            <span style={{ fontSize:10, fontWeight:800, background:'#FF6B2C', padding:'3px 9px', borderRadius:999, letterSpacing:'.04em' }}>ШИНЭ</span>
            <span style={{ fontSize:16, fontWeight:800, letterSpacing:'-0.01em' }}>Автомат хөрөнгө оруулалт</span>
          </div>
          <div style={{ fontSize:12.5, opacity:.75, marginTop:6, lineHeight:1.5, maxWidth:560 }}>Тогтмол хугацаанд, тогтмол дүнгээр — шалгуурт нийцсэн хамгийн өндөр өгөөжтэйг бид автоматаар худалдан авна.</div>
        </div>
        <span style={{ display:'inline-flex', alignItems:'center', gap:7, background:'#fff', color:_AT.ink, fontWeight:700, fontSize:13, padding:'11px 16px', borderRadius:12, flexShrink:0 }}>
          Төлөвлөгөө үүсгэх
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke={_AT.ink} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </span>
      </div>
    </a>
  );
  const p = s.state.paused;
  return (
    <a href="16 Auto Invest.html" style={{ ...aiwCard, display:'flex', alignItems:'center', gap:14, padding:'16px 20px', marginBottom:24, textDecoration:'none' }}>
      <AiwIcon size={42}/>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:13.5, fontWeight:800, color:_AT.ink }}>Автомат хөрөнгө оруулалт</span>
          <span style={{ fontSize:10.5, fontWeight:800, color: p ? _AT.warn : _AT.pos, background: p ? _AT.warnSoft : _AT.posSoft, padding:'3px 9px', borderRadius:999 }}>{p ? 'Түр зогссон' : 'Идэвхтэй'}</span>
        </div>
        <div style={{ fontSize:12, color:_AT.muted, fontWeight:600, marginTop:3 }}>{aiwMnt(s.cfg.amount)} · {s.cfg.freq} · {p ? 'зогссон' : 'дараагийн ' + aiwNext(s.cfg)}</div>
      </div>
      <span style={{ fontSize:12.5, fontWeight:700, color:_AT.indigo, flexShrink:0 }}>Удирдах →</span>
    </a>
  );
};

const AiwWalletCard = () => {
  if (window.MMF_V1) return null;
  const s = useAiwPlan();
  const first = aiwBest(s.cfg);
  const p = s.state.paused;
  if (!s.live) return (
    <a href="16 Auto Invest.html" style={{ ...aiwCard, display:'flex', alignItems:'center', gap:14, padding:'16px 20px', textDecoration:'none' }}>
      <AiwIcon size={42}/>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:14, fontWeight:800, color:_AT.ink, letterSpacing:'-0.01em' }}>Автомат хөрөнгө оруулалт</div>
        <div style={{ fontSize:12, color:_AT.muted, fontWeight:600, marginTop:3 }}>Тогтмол дүнгээр өөрөө худалдан авах төлөвлөгөө</div>
      </div>
      <span style={{ fontSize:12.5, fontWeight:700, color:_AT.indigo, flexShrink:0 }}>Тохируулах →</span>
    </a>
  );
  return (
    <div style={{ ...aiwCard, padding:'18px 20px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
        <AiwIcon size={42}/>
        <div style={{ flex:1, minWidth:200 }}>
          <div style={{ display:'flex', alignItems:'center', gap:9 }}>
            <span style={{ fontSize:14, fontWeight:800, color:_AT.ink, letterSpacing:'-0.01em' }}>Автомат хөрөнгө оруулалт</span>
            <span style={{ fontSize:10.5, fontWeight:800, color: p ? _AT.warn : _AT.pos, background: p ? _AT.warnSoft : _AT.posSoft, padding:'3px 9px', borderRadius:999 }}>{p ? 'Түр зогссон' : 'Идэвхтэй'}</span>
          </div>
          <div style={{ fontSize:12, color:_AT.muted, fontWeight:600, marginTop:3 }}>{(s.cfg.name && s.cfg.name.trim()) || aiwAutoName(s.cfg)} · {aiwRanked(s.cfg).length} бүтээгдэхүүн эрэмбэлсэн · зөвхөн анхдагч зах</div>
        </div>
        <a href="16 Auto Invest.html" style={{ fontSize:12.5, fontWeight:700, color:_AT.indigo, textDecoration:'none', flexShrink:0 }}>Удирдах →</a>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:12, marginTop:16 }}>
        {[
          ['Дүн · давтамж', aiwMnt(s.cfg.amount) + ' · ' + s.cfg.freq],
          ['Дараагийн хасалт', p ? 'Зогссон' : aiwNext(s.cfg)],
          ['Сүүлийн худалдан авалт', first ? first.ticker + ' · ' + first.y + '%' : 'Хуримтлагдаж байна'],
        ].map(([l, v], i) => (
          <div key={i} style={{ background:_AT.field, border:`1px solid ${_AT.line2}`, borderRadius:12, padding:'11px 13px' }}>
            <div style={{ fontSize:11, color:_AT.muted, fontWeight:700 }}>{l}</div>
            <div style={{ fontSize:12.5, fontWeight:800, color: i === 1 && p ? _AT.muted2 : _AT.ink, marginTop:3 }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

Object.assign(window, {
  AIW_STORE, useAiwPlan, AIW_MARKET, AIW_DEFAULT,
  aiwMnt, aiwMatch, aiwBest, aiwNext, aiwPast, aiwPerYear, aiwMarketLabel, aiwTermLabel, aiwStable, aiwStrategyLabel, aiwType, aiwMinTicket, aiwAmountSteps, aiwEditSteps, aiwNormalize, AIW_TICKET, aiwAutoName,
  aiwPool, aiwTerms, aiwTermOf, aiwUnitPrice, aiwDayLabel, aiwEndLabel, aiwYears, aiwRate, aiwFV, AIW_WDFULL, AiwUnitStepper, aiwRanked,
  AiwLabel, AiwChip, AiwToggle, AiwNote, AiwRow, AiwIcon, aiwCard, AiwVariantSwitch, AiwRadioCard,
  AiwSetupModal, AiwPinModal, AiwSuccessModal, AiwEditModal,
  AiwPromoBanner, AiwWalletCard,
});
