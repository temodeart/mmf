// trade_f03.jsx — MMF Web · Trade template audit fixes (F-03/05/06/07/15/16/17)
// One template for all four verticals (СД · Итгэлцэл · Нэхэмжлэх · Арилжааны бичиг).
// Exposes: TF (data), IssuerLogo, BuyButton, DirButton, PrimaryCard, EmptyPrimary,
//          SecondaryTable  → window
// Load after comp_atoms.jsx + comp_kit.jsx (needs window.T, formatMNT/Rate/Pct).

const { useState: _uS, useEffect: _uE, useRef: _uR } = React;
const _T = window.T;
const mnt  = n => window.formatMNT(n);
const rate = n => window.formatRate(n);            // "14.5% жилийн"

/* ── verticals ──────────────────────────────────────────────── */
const VERTICALS = [
  { key:'all',   label:'Бүгд' },
  { key:'cd',    label:'СД',              full:'Хадгаламжийн сертификат', color:'#2D6BFF' },
  { key:'trust', label:'Итгэлцэл',        full:'Итгэлцэл',               color:'#4F46E5' },
  { key:'inv',   label:'Нэхэмжлэх',       full:'Нэхэмжлэх',              color:'#0E9F6E' },
  { key:'cp',    label:'Арилжааны бичиг', full:'Арилжааны бичиг',        color:'#FF6B2C' },
];
const VLABEL = Object.fromEntries(VERTICALS.map(v => [v.key, v.full || v.label]));
const VCOLOR = { cd:'#2D6BFF', trust:'#4F46E5', inv:'#0E9F6E', cp:'#FF6B2C' };

/* F-05 — verticals whose primary market is empty *today* (normal, not broken) */
const EMPTY_PRIMARY = {
  inv: { next:'2026.07.20', note:'Нэхэмжлэхийн санхүүжилтийг гаргагч байгууллагаас шинээр гаргах үед энд нээгдэнэ.' },
  cp:  { next:'2026.07.28', note:'Арилжааны бичгийн бүх гаргалт өнөөдөр борлогдсон. Дараагийн гаргалтыг хүлээж байна.' },
};

/* ── primary offerings (cd / trust / inv populated; cp empty today) ── */
const PRIMARY = [
  { id:'dari',  bank:'Дарь Финанс ББСБ',    short:'Дарь Финанс', letters:'ДФ', color:'#4F46E5', type:'trust', rate:23.0, unit:100000,  term:272, ticker:'DARI 2300 IT 270227', avail:840,  total:1000, badge:'new',    url:'https://darifinance.mn' },
  { id:'anlock',bank:'Анлок ББСБ',          short:'Анлок',       letters:'АН', color:'#0E9F6E', type:'trust', rate:24.5, unit:100000,  term:365, ticker:'ANLK 2450 IT 270701', avail:1500, total:1600, badge:'new',    url:'https://anlock.mn' },
  { id:'micro', bank:'Микро Кредит ББСБ',   short:'Микро Кредит',letters:'МК', color:'#7C3AED', type:'trust', rate:21.5, unit:100000,  term:180, ticker:'MCRO 2150 IT 261220', avail:430,  total:1500, badge:'active', url:'https://microcredit.mn' },
  { id:'capit', bank:'Капитрон банк',        short:'Капитрон',    letters:'КА', color:'#2D6BFF', type:'cd',    rate:14.5, unit:1000000, term:240, ticker:'CAPIT 1450 CD 270218',avail:95,   total:300,  badge:'active', url:'https://capitronbank.mn' },
  { id:'bogd',  bank:'Богд банк',            short:'Богд банк',   letters:'БО', color:'#1677FF', type:'cd',    rate:13.8, unit:1000000, term:180, ticker:'BOGD 1380 CD 261220', avail:210,  total:400,  badge:null,     url:'https://bogdbank.com' },
  { id:'kredit',bank:'Кредитех ББСБ',        short:'Кредитех',    letters:'КР', color:'#0891B2', type:'inv',   rate:20.0, unit:500000,  term:120, ticker:'KRDT 2000 IN 261110', avail:60,   total:120,  badge:'new',    url:'https://kreditech.mn' },
];

/* ── secondary listings ─────────────────────────────────────── */
const SECONDARY = [
  { id:'s1', bank:'Дарь Финанс ББСБ',   short:'Дарь Финанс', type:'trust', rate:22.4, unit:101800,  left:248, qty:120, side:'sell', ticker:'DARI 2300 IT 270227', term:272, valid:'2026.06.30' },
  { id:'s2', bank:'Капитрон банк',       short:'Капитрон',    type:'cd',    rate:14.2, unit:1012000, left:226, qty:18,  side:'sell', ticker:'CAPIT 1450 CD 270218', term:240, valid:'2026.07.02' },
  { id:'s3', bank:'Микро Кредит ББСБ',  short:'Микро Кредит',type:'trust', rate:21.8, unit:100900,  left:162, qty:75,  side:'buy',  ticker:'MCRO 2150 IT 261220', term:180, valid:'2026.06.28' },
  { id:'s4', bank:'Кредитех ББСБ',       short:'Кредитех',    type:'inv',   rate:18.6, unit:503400,  left:78,  qty:40,  side:'sell', ticker:'KRDT 2000 IN 261110', term:120, valid:'2026.06.25' },
  { id:'s5', bank:'Богд банк',           short:'Богд банк',   type:'cd',    rate:13.6, unit:1008500, left:168, qty:32,  side:'buy',  ticker:'BOGD 1380 CD 261220', term:180, valid:'2026.07.05' },
  { id:'s6', bank:'Анлок ББСБ',          short:'Анлок',       type:'trust', rate:21.9, unit:101200,  left:351, qty:210, side:'sell', ticker:'ANLK 2450 IT 270701', term:365, valid:'2026.07.10' },
  { id:'s7', bank:'Дарь Финанс ББСБ',   short:'Дарь Финанс', type:'trust', rate:22.1, unit:101500,  left:248, qty:55,  side:'buy',  ticker:'DARI 2300 IT 270227', term:272, valid:'2026.06.29' },
];

const dashTicker = t => t.replace(/\s+/g, '-');
const months = d => Math.max(1, Math.round(d / 30)) + ' сар';

/* ══ F-06 · issuer logo — neutral 1:1 plate, letter mark can't go dark ══ */
const IssuerLogo = ({ letters, color, size = 44 }) => (
  <span className="issuer-logo" style={{ width:size, height:size, flexShrink:0 }}>
    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:800, fontSize:size*0.34, color:color||_T.indigo, letterSpacing:'.02em' }}>{letters}</span>
  </span>
);

/* ══ F-15 · ONE primary button token for Авах (green, +arrow — a11y §06) ══ */
const _UP   = <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 19V5M6 11l6-6 6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const _DOWN = <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M6 13l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const BuyButton = ({ onClick, full, height = 46 }) => (
  <button onClick={onClick} style={{ height, width:full?'100%':'auto', padding:full?0:'0 20px', borderRadius:13, border:'none', background:_T.pos, color:'#fff', fontSize:14.5, fontWeight:800, letterSpacing:'-0.01em', cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow:'0 8px 20px -10px rgba(14,159,110,.6)' }}>
    {_UP}Авах
  </button>
);
/* a11y §06 · direction cue for secondary rows — color + text + arrow */
const DirButton = ({ side = 'buy', onClick }) => {
  const buy = side === 'buy';
  return (
    <button onClick={onClick} style={{ height:34, padding:'0 14px', borderRadius:10, border:'none', background:buy?_T.pos:_T.neg, color:'#fff', fontSize:12.5, fontWeight:800, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:6, boxShadow:`0 6px 14px -8px ${buy?'rgba(14,159,110,.7)':'rgba(220,38,38,.7)'}` }}>
      {buy?_UP:_DOWN}{buy?'Авах':'Зарах'}
    </button>
  );
};

/* ══ Primary market card — F-06 logo · F-07 link · F-15 button · F-16 rate ══ */
const PrimaryCard = ({ data, onBuy }) => {
  const pct = data.total > 0 ? Math.round(data.avail / data.total * 100) : 0;
  const vc = VCOLOR[data.type];
  return (
    <div style={{ background:_T.surface, border:`1px solid ${_T.line2}`, borderRadius:18, padding:18, display:'flex', flexDirection:'column' }}>
      <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
        <IssuerLogo letters={data.letters} color={data.color} size={46}/>
        <div style={{ flex:1, minWidth:0 }}>
          <div className="truncate" title={data.bank} style={{ fontSize:14.5, fontWeight:800, color:_T.ink, letterSpacing:'-0.01em' }}>{data.bank}</div>
          <div style={{ display:'flex', alignItems:'center', gap:7, marginTop:6, flexWrap:'wrap' }}>
            <span style={{ fontSize:10.5, fontWeight:700, color:vc, background:`${vc}14`, padding:'2px 8px', borderRadius:99 }}>{VLABEL[data.type]}</span>
            {data.badge && <span style={{ fontSize:10.5, fontWeight:700, color:data.badge==='new'?_T.pos:_T.warn, background:data.badge==='new'?_T.posSoft:_T.warnSoft, padding:'2px 8px', borderRadius:99 }}>{data.badge==='new'?'Шинэ':'Идэвхтэй'}</span>}
          </div>
        </div>
      </div>

      {/* F-16 · rate is the largest number on the card, mono, "NN.N% жилийн" */}
      <div style={{ marginTop:16, display:'flex', alignItems:'baseline', gap:8, flexWrap:'wrap' }} title={rate(data.rate)}>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:42, fontWeight:700, color:_T.ink, letterSpacing:'-0.02em', lineHeight:1, fontVariantNumeric:'tabular-nums' }}>
          {data.rate.toFixed(1)}<span style={{ fontSize:22, color:_T.pos }}>%</span>
        </span>
        <span style={{ fontSize:13, fontWeight:700, color:_T.muted }}>жилийн</span>
      </div>

      <div style={{ marginTop:16, borderTop:`1px solid ${_T.line2}`, paddingTop:14, display:'flex', flexDirection:'column', gap:9 }}>
        {[['Хугацаа', `${data.term} хоног`], ['Нэрлэсэн үнэ', mnt(data.unit)]].map(([k,v]) => (
          <div key={k} style={{ display:'flex', justifyContent:'space-between', gap:10 }}>
            <span style={{ fontSize:12.5, fontWeight:600, color:_T.muted }}>{k}</span>
            <span className="num" style={{ fontSize:13, fontWeight:700, color:_T.text, fontFamily:"'JetBrains Mono',monospace" }}>{v}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop:14 }}>
        <div style={{ height:6, borderRadius:99, background:_T.line2, overflow:'hidden' }}><div style={{ height:'100%', borderRadius:99, background:vc, width:`${pct}%` }}/></div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:7, fontSize:11, fontWeight:600, color:_T.muted }}>
          <span>Үлдсэн ширхэг</span>
          <span className="num"><b style={{ color:_T.text }}>{data.avail.toLocaleString('en-US')}</b> / {data.total.toLocaleString('en-US')}</span>
        </div>
      </div>

      {/* F-07 · issuer external link — https · _blank · noopener · trailing arrow */}
      <a className="ext-link" href={data.url} target="_blank" rel="noopener noreferrer" style={{ marginTop:14, fontSize:12 }}>
        Гаргагчийн тухай
        <svg className="ext-link__icon" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </a>

      <div style={{ marginTop:14 }}><BuyButton full onClick={onBuy}/></div>
    </div>
  );
};

/* ══ F-05 · empty primary market — informative, NOT an error ══ */
const EmptyPrimary = ({ vertical }) => {
  const info = EMPTY_PRIMARY[vertical] || {};
  const [notify, setNotify] = _uS(false);
  const full = VLABEL[vertical] || 'энэ төрөл';
  return (
    <div style={{ background:_T.surface, border:`1px solid ${_T.line2}`, borderRadius:20, padding:'40px 32px', display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap:14 }}>
      <div style={{ width:56, height:56, borderRadius:16, background:_T.indigoSoft, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 8v5l3 2" stroke={_T.indigo} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="9" stroke={_T.indigo} strokeWidth="1.8"/></svg>
      </div>
      <div style={{ fontSize:17, fontWeight:800, color:_T.ink, letterSpacing:'-0.01em' }}>Одоогоор нээлттэй гаргалт алга</div>
      <p style={{ fontSize:13.5, fontWeight:500, color:_T.muted, lineHeight:1.6, margin:0, maxWidth:440 }}>
        <b style={{ color:_T.text }}>Анхдагч зах зээл</b> дээр {full}-ийг гаргагчаас шинээр худалдаж авдаг. {info.note}
      </p>
      {info.next && (
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'8px 14px', borderRadius:99, background:_T.field, border:`1px solid ${_T.line}`, fontSize:12.5, fontWeight:700, color:_T.text }}>
          <span style={{ width:7, height:7, borderRadius:99, background:_T.pos }}/>
          Дараагийн гаргалт: <span className="num" style={{ fontFamily:"'JetBrains Mono',monospace" }}>{info.next}</span>
        </div>
      )}
      <button onClick={() => setNotify(v => !v)} aria-pressed={notify} style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'10px 16px', borderRadius:12, border:`1.5px solid ${notify?_T.indigo:_T.line}`, background:notify?_T.indigoSoft:_T.surface, color:notify?_T.indigo:_T.text, fontSize:13.5, fontWeight:700, cursor:'pointer', fontFamily:'inherit', marginTop:4 }}>
        <span style={{ width:34, height:20, borderRadius:99, background:notify?_T.indigo:_T.line, position:'relative', transition:'background .15s', flexShrink:0 }}>
          <span style={{ position:'absolute', top:2, left:notify?16:2, width:16, height:16, borderRadius:99, background:'#fff', transition:'left .15s' }}/>
        </span>
        {notify ? 'Мэдэгдэл авахаар тохирлоо' : 'Мэдэгдэл авах'}
      </button>
    </div>
  );
};

/* ══ F-03 · secondary table — sticky ticker col · toggle cols · card fallback ══
   + F-17 search (clear ×, debounce, Илэрц count) + sort affordance/focus.
   Dev note (a11y §06, 4.1.2): sort trigger is a real <button> (gets the
   global :focus-visible ring for free) and carries aria-sort on the parent
   <th> so screen readers announce ascending/descending/none. */
const ALL_COLS = [
  { key:'type',  label:'Төрөл',                   toggleable:true,  on:true,  render:r => <span style={{ fontSize:11.5, fontWeight:700, color:VCOLOR[r.type], background:`${VCOLOR[r.type]}14`, padding:'3px 9px', borderRadius:99, whiteSpace:'nowrap' }}>{VERTICALS.find(v=>v.key===r.type).label}</span> },
  { key:'qty',   label:'Тоо ширхэг',   num:true,  toggleable:true,  on:true,  render:r => r.qty },
  { key:'unit',  label:'Нэгж үнэ',     num:true,  toggleable:true,  on:true,  sortable:true, render:r => mnt(r.unit) },
  { key:'left',  label:'Төлөгдөх хүртэлх хоног', num:true, toggleable:true, on:true, sortable:true, render:r => `${r.left} хоног` },
  { key:'sale',  label:'Худалдах үнэ', num:true,  toggleable:true,  on:false, render:r => mnt(Math.round(r.unit*1.002)) },
  { key:'status',label:'Төлөв',                   toggleable:true,  on:false, render:r => <span style={{ fontSize:11.5, fontWeight:700, color:_T.pos, background:_T.posSoft, padding:'3px 9px', borderRadius:99 }}>Нээлттэй</span> },
  { key:'valid', label:'Захиалгын хүчинтэй хугацаа', num:true, toggleable:true, on:false, render:r => r.valid },
];
const COL_KEYS = ALL_COLS.map(c => c.key);
const LS_KEY = 'mmf-sec-cols-v1';

const loadCols = () => {
  try { const s = JSON.parse(localStorage.getItem(LS_KEY)); if (s && typeof s==='object') return s; } catch(e){}
  return Object.fromEntries(ALL_COLS.map(c => [c.key, c.on]));
};

const SortIcon = ({ state }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0 }}>
    <path d="M8 9l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity={state==='asc'?1:.35}/>
    <path d="M8 15l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity={state==='desc'?1:.35}/>
  </svg>
);

/* Sort is CONTROLLED when sortBy/sortDir/onSortChange are supplied (Trade screen
   drives it from the section-level Эрэмбэлэх menu, so both views always agree);
   otherwise the table falls back to its own state. */
const SecondaryTable = ({ rows, onAct, initialMenuOpen = false, sortBy: sortByProp, sortDir: sortDirProp, onSortChange }) => {
  const [cols, setCols]   = _uS(loadCols);
  const [menu, setMenu]   = _uS(initialMenuOpen);
  const [raw, setRaw]     = _uS('');
  const [q, setQ]         = _uS('');
  const [ownBy, setBy]    = _uS('left');
  const [ownDir, setDir]  = _uS('desc');
  const controlled = !!onSortChange;
  const sortBy = controlled ? sortByProp : ownBy;
  const dir    = controlled ? sortDirProp : ownDir;
  const [narrow, setNar]  = _uS(false);
  const wrapRef = _uR(null);

  // container-width driven fallback (F-03 C) — robust vs viewport media queries
  _uE(() => {
    const el = wrapRef.current; if (!el || !window.ResizeObserver) return;
    const ro = new ResizeObserver(es => setNar(es[0].contentRect.width < 960));
    ro.observe(el); return () => ro.disconnect();
  }, []);
  // F-17 · debounce search 300ms
  _uE(() => { const t = setTimeout(() => setQ(raw.trim().toLowerCase()), 300); return () => clearTimeout(t); }, [raw]);
  _uE(() => { try { localStorage.setItem(LS_KEY, JSON.stringify(cols)); } catch(e){} }, [cols]);

  const filtered = rows.filter(r => !q || dashTicker(r.ticker).toLowerCase().includes(q) || r.bank.toLowerCase().includes(q) || r.short.toLowerCase().includes(q));
  const sorted = [...filtered].sort((a,b) => ((a[sortBy]||0)-(b[sortBy]||0)) * (dir==='asc'?1:-1));
  const activeCols = ALL_COLS.filter(c => cols[c.key]);
  const toggle = k => setCols(c => ({ ...c, [k]: !c[k] }));
  const onSort = k => {
    const next = sortBy===k ? { by:k, dir: dir==='asc'?'desc':'asc' } : { by:k, dir:'desc' };
    if (controlled) onSortChange(next);
    else { setBy(next.by); setDir(next.dir); }
  };

  const th = { fontSize:11, fontWeight:700, letterSpacing:'.05em', color:_T.muted, textTransform:'uppercase', padding:'12px 16px', background:_T.field, borderBottom:`1px solid ${_T.line2}`, whiteSpace:'nowrap' };
  const td = { padding:'0 16px', height:56, fontSize:13, fontWeight:600, color:_T.text, borderBottom:`1px solid ${_T.line2}` };
  const monoTd = { ...td, fontFamily:"'JetBrains Mono',monospace", fontVariantNumeric:'tabular-nums', textAlign:'right' };

  return (
    <div ref={wrapRef} style={{ display:'flex', flexDirection:'column', gap:14 }}>

      {/* toolbar: search (F-17) + column toggle (F-03 B) */}
      <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
        <div style={{ position:'relative', flex:'1 1 260px', minWidth:0 }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)' }}><circle cx="11" cy="11" r="7" stroke={_T.muted2} strokeWidth="1.9"/><path d="M20 20l-3.5-3.5" stroke={_T.muted2} strokeWidth="1.9" strokeLinecap="round"/></svg>
          <input value={raw} onChange={e => setRaw(e.target.value)} placeholder="Тикер эсвэл гаргагчаар хайх…"
            style={{ width:'100%', height:42, borderRadius:12, border:`1.5px solid ${_T.line}`, background:_T.field, padding:'0 38px', fontFamily:'inherit', fontSize:13.5, fontWeight:500, color:_T.ink, outline:'none' }}/>
          {raw && (
            <button onClick={() => setRaw('')} aria-label="Хайлт цэвэрлэх" style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', width:26, height:26, borderRadius:8, border:'none', background:_T.line2, color:_T.muted, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', minHeight:0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          )}
        </div>
        <div style={{ position:'relative' }}>
          <button onClick={() => setMenu(m => !m)} aria-haspopup="menu" aria-expanded={menu} style={{ height:42, padding:'0 14px', borderRadius:12, border:`1.5px solid ${menu?_T.indigo:_T.line}`, background:menu?_T.indigoSoft:_T.surface, color:menu?_T.indigo:_T.text, fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            Багана
            <span className="num" style={{ fontSize:11, fontWeight:700, padding:'1px 6px', borderRadius:99, background:menu?'rgba(79,70,229,.15)':_T.line2 }}>{activeCols.length + 1}</span>
          </button>
          {menu && (<>
            <div onClick={() => setMenu(false)} style={{ position:'fixed', inset:0, zIndex:30 }}/>
            <div role="menu" style={{ position:'absolute', right:0, top:48, width:266, background:_T.surface, border:`1px solid ${_T.line}`, borderRadius:16, boxShadow:'0 12px 30px -10px rgba(15,20,55,.22)', zIndex:40, padding:8 }}>
              <div style={{ fontSize:10.5, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:_T.muted2, padding:'6px 10px 8px' }}>Харуулах багана</div>
              <div style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 10px', borderRadius:10, opacity:.6 }}>
                <span style={{ width:34, height:20, borderRadius:99, background:_T.indigo, position:'relative', flexShrink:0 }}><span style={{ position:'absolute', top:2, left:16, width:16, height:16, borderRadius:99, background:'#fff' }}/></span>
                <span style={{ fontSize:13, fontWeight:700, color:_T.text }}>Тикер</span>
                <span style={{ marginLeft:'auto', fontSize:10.5, fontWeight:700, color:_T.muted2 }}>тогтмол</span>
              </div>
              {ALL_COLS.map(c => (
                <button key={c.key} role="menuitemcheckbox" aria-checked={!!cols[c.key]} onClick={() => toggle(c.key)} className="dropdown-item" style={{ justifyContent:'flex-start' }}>
                  <span style={{ width:34, height:20, borderRadius:99, background:cols[c.key]?_T.indigo:_T.line, position:'relative', transition:'background .15s', flexShrink:0 }}><span style={{ position:'absolute', top:2, left:cols[c.key]?16:2, width:16, height:16, borderRadius:99, background:'#fff', transition:'left .15s' }}/></span>
                  {c.label}
                </button>
              ))}
            </div>
          </>)}
        </div>
      </div>

      {/* F-17 · result count + debounce note */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
        <div style={{ fontSize:12.5, fontWeight:700, color:_T.text }}>Илэрц: <span className="num" style={{ fontFamily:"'JetBrains Mono',monospace", color:_T.indigo }}>{sorted.length}</span> / <span className="num" style={{ fontFamily:"'JetBrains Mono',monospace" }}>{rows.length}</span></div>
        {raw && <div style={{ fontSize:11, fontWeight:600, color:_T.muted2 }}>Хайлт 300ms-ийн дараа шинэчлэгдэнэ</div>}
      </div>

      {narrow ? (
        /* ── F-03 C · card-list fallback below ~960px ── */
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {sorted.length===0 ? <div style={{ padding:'32px', textAlign:'center', color:_T.muted, fontSize:13, fontWeight:600, background:_T.surface, border:`1px solid ${_T.line2}`, borderRadius:16 }}>Илэрц олдсонгүй</div> :
          sorted.map(r => (
            <div key={r.id} style={{ background:_T.surface, border:`1px solid ${_T.line2}`, borderRadius:16, padding:14, display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div className="truncate" style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:_T.ink }}>{dashTicker(r.ticker)}</div>
                <div className="truncate" style={{ fontSize:11.5, fontWeight:600, color:_T.muted, marginTop:3 }}>{r.short} · {r.qty} ширхэг · {r.left} хоног</div>
              </div>
              <div style={{ textAlign:'right', flexShrink:0 }}>
                <div className="num" style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13.5, fontWeight:800, color:_T.ink }}>{mnt(r.unit)}</div>
                <div style={{ marginTop:6 }}><DirButton side={r.side} onClick={() => onAct?.(r)}/></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ── F-03 A · table: sticky mono ticker col, no multi-line wrap ── */
        <div style={{ background:_T.surface, border:`1px solid ${_T.line2}`, borderRadius:18, overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', tableLayout:'auto' }}>
            <thead>
              <tr>
                <th style={{ ...th, position:'sticky', left:0, zIndex:2, background:'#EEF1F7', textAlign:'left', minWidth:184 }}>Тикер</th>
                {activeCols.map(c => (
                  <th key={c.key} aria-sort={c.sortable ? (sortBy===c.key ? (dir==='asc'?'ascending':'descending') : 'none') : undefined} style={{ ...th, textAlign:c.num?'right':'left' }}>
                    {c.sortable ? (
                      <button onClick={() => onSort(c.key)} style={{ display:'inline-flex', alignItems:'center', gap:5, marginLeft:c.num?'auto':0, padding:'2px 4px', border:'none', background:'transparent', font:'inherit', fontSize:11, fontWeight:700, letterSpacing:'.05em', textTransform:'uppercase', color:sortBy===c.key?_T.indigo:_T.muted, cursor:'pointer', minHeight:0, borderRadius:6, flexDirection:c.num?'row-reverse':'row' }}>
                        <SortIcon state={sortBy===c.key?dir:null}/>{c.label}
                      </button>
                    ) : c.label}
                  </th>
                ))}
                <th style={{ ...th, textAlign:'right' }}>Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {sorted.length===0 ? (
                <tr><td colSpan={activeCols.length+2} style={{ padding:'40px', textAlign:'center', color:_T.muted, fontSize:13, fontWeight:600 }}>Илэрц олдсонгүй</td></tr>
              ) : sorted.map(r => (
                <tr key={r.id}>
                  {/* sticky first column — one-line mono ticker + caption */}
                  <td style={{ ...td, padding:'0 16px', position:'sticky', left:0, zIndex:1, background:'#F7F9FC', borderRight:`1px solid ${_T.line2}`, minWidth:184 }}>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12.5, fontWeight:700, color:_T.ink, whiteSpace:'nowrap' }}>{dashTicker(r.ticker)}</div>
                    <div style={{ fontSize:10.5, fontWeight:600, color:_T.muted2, whiteSpace:'nowrap', marginTop:2 }}>{r.short} · {months(r.term)}</div>
                  </td>
                  {activeCols.map(c => (
                    <td key={c.key} style={c.num ? { ...monoTd, fontWeight:c.key==='rate'?800:700, color:_T.ink } : { ...td }}>
                      {c.render ? c.render(r) : r[c.key]}
                    </td>
                  ))}
                  <td style={{ ...td, textAlign:'right' }}><DirButton side={r.side} onClick={() => onAct?.(r)}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

Object.assign(window, {
  TF: { VERTICALS, VLABEL, VCOLOR, PRIMARY, SECONDARY, EMPTY_PRIMARY },
  IssuerLogo, BuyButton, DirButton, PrimaryCard, EmptyPrimary, SecondaryTable,
});
