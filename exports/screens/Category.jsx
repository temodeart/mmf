/* =========================================================================
   Money Market Fund — Mobile App · Screen: Category
   Self-contained JSX (DA->CL bundle, contract v1.0). Shared kit, module aliases,
   and tokens for this screen are inlined below, in dependency order.
   Mongolian Cyrillic UI · 390x844 · white-first. Requires React in host scope.
   Registers the screen component to window.__MMF_SCREENS.
   ========================================================================= */
(function () {
const { useState, useRef, useEffect, useMemo, useCallback, useLayoutEffect, Fragment } = React;

/* ----- shared kit · module aliases · tokens (dependency-ordered) ----- */
const C = {
  bg: '#F4F6FA',
  surface: '#FFFFFF',
  navy: '#050B1F',
  navy2: '#0E1631',
  navy3: '#1A2547',
  indigo: '#4F46E5',
  indigoSoft: '#EEF0FE',
  blue: '#2D6BFF',
  blueSoft: '#E7EEFF',
  orange: '#FF6B2C',
  orangeSoft: '#FFEDE2',
  green: '#0E9F6E',
  greenSoft: '#E3F5EE',
  amber: '#B7791F',
  amberSoft: '#FFF3D6',
  red: '#DC2626',
  redSoft: '#FDECEC',
  ink: '#0B1020',
  ink2: '#1F2540',
  text: '#2A3052',
  muted: '#6B7191',
  muted2: '#9099B5',
  line: '#E7E9F2',
  line2: '#EFF1F8',
};

// ----- Tiny atoms -----

const StatusBar = ({ dark = false }) => (
  <div style={{
    height: 44, padding: '0 28px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    color: dark ? '#fff' : C.ink, fontWeight: 600, fontSize: 15,
    fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em', flexShrink: 0,
  }}>
    <span>9:41</span>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {/* signal */}
      <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
        {[2,5,8,11].map((h,i)=>(
          <rect key={i} x={i*4} y={11-h} width="3" height={h} rx="0.5" fill={dark?'#fff':C.ink}/>
        ))}
      </svg>
      {/* wifi */}
      <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
        <path d="M7.5 11l2-2.5a2.5 2.5 0 00-4 0L7.5 11z" fill={dark?'#fff':C.ink}/>
        <path d="M3.5 6.5a6 6 0 018 0" stroke={dark?'#fff':C.ink} strokeWidth="1.3" strokeLinecap="round" fill="none" opacity=".5"/>
        <path d="M.5 3a10 10 0 0114 0" stroke={dark?'#fff':C.ink} strokeWidth="1.3" strokeLinecap="round" fill="none" opacity=".5"/>
      </svg>
      {/* battery */}
      <svg width="26" height="11" viewBox="0 0 26 11" fill="none">
        <rect x="0.5" y="0.5" width="22" height="10" rx="2.5" stroke={dark?'#fff':C.ink} opacity=".4" fill="none"/>
        <rect x="2" y="2" width="19" height="7" rx="1.3" fill={dark?'#fff':C.ink}/>
        <rect x="23.5" y="3.5" width="1.5" height="4" rx="0.5" fill={dark?'#fff':C.ink} opacity=".4"/>
      </svg>
    </div>
  </div>
);

const HomeIndicator = ({ dark = false }) => (
  <div style={{ height: 34, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 8, flexShrink: 0 }}>
    <div style={{ width: 134, height: 5, borderRadius: 999, background: dark ? 'rgba(255,255,255,.6)' : '#0B1020' }}/>
  </div>
);

const Frame = ({ label, children, bg = C.bg, statusDark = false }) => (
  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink: 0 }}>
    <div style={{
      fontFamily: 'JetBrains Mono, ui-monospace, monospace',
      fontSize: 11, color: C.muted, fontWeight: 600, letterSpacing: '0.08em',
      marginBottom: 16, textTransform: 'uppercase',
    }}>{label}</div>
    <div style={{
      width: 390, height: 844, borderRadius: 48,
      background: bg, overflow: 'hidden',
      boxShadow: '0 30px 60px -25px rgba(15,20,55,.18), 0 8px 20px -10px rgba(15,20,55,.08)',
      display: 'flex', flexDirection: 'column', position: 'relative',
      border: `1px solid ${C.line2}`,
    }}>
      <StatusBar dark={statusDark}/>
      <div style={{ flex: 1, overflow: 'hidden', display:'flex', flexDirection:'column' }}>
        {children}
      </div>
      <HomeIndicator dark={statusDark}/>
    </div>
  </div>
);

// ============================================================
// 01 — SPLASH / WELCOME
// ============================================================

const BackBar = ({ title, right }) => (
  <div style={{ height: 56, display:'flex', alignItems:'center', justifyContent:'space-between', padding: '0 16px 0 8px', flexShrink: 0 }}>
    <button style={{
      width: 40, height: 40, borderRadius: 12, background: '#fff', border: `1px solid ${C.line}`,
      display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke={C.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </button>
    <div style={{ fontSize: 16, fontWeight: 700, color: C.ink, letterSpacing:'-0.01em' }}>{title}</div>
    <div style={{ width: 40 }}>{right}</div>
  </div>
);

// ============================================================
// SIGNUP — Shared step header
// ============================================================

const SEC_SORTS = [
  { k:'term',  l:'Төлөгдөх хугацаа', d:'Богиноос → урт' },
  { k:'yield', l:'Бодит өгөөж',      d:'Өндөр → бага' },
];

const secLabel = (k) => (SEC_SORTS.find(s => s.k === k) || SEC_SORTS[1]).l;

const parseTermDays = (t) => parseInt(String(t).replace(/[^0-9]/g, ''), 10) || 0;

const sortSecondary = (arr, k) => {
  const a = [...arr];
  if (k === 'term') a.sort((x, y) => parseTermDays(x.term) - parseTermDays(y.term));
  else if (k === 'rate') a.sort((x, y) => parseFloat(y.rate) - parseFloat(x.rate));
  else a.sort((x, y) => parseFloat(y.real) - parseFloat(x.real));
  return a;
};

const SortButton = ({ label, onClick }) => (
  <button onClick={onClick} data-nodrag style={{
    display:'inline-flex', alignItems:'center', gap: 6, height: 32, padding:'0 12px', borderRadius: 10,
    background:'#fff', border:`1px solid ${C.line}`, cursor:'pointer', fontSize: 11.5, fontWeight: 700, color: C.ink, flexShrink: 0,
  }}>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M7 19V5M7 5L4 8M7 5l3 3M17 5v14M17 19l3-3M17 19l-3-3" stroke={C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    {label}
  </button>
);

const SortSheet = ({ open, value, onClose, onPick }) => {
  if (!open) return null;
  return (
    <div style={{ position:'absolute', inset:0, zIndex: 30 }}>
      <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(5,11,31,.45)' }}/>
      <div style={{ position:'absolute', left:0, right:0, bottom:0, background:'#fff', borderRadius:'24px 24px 0 0', padding:'10px 0 20px', boxShadow:'0 -10px 40px -16px rgba(15,20,55,.4)' }}>
        <div style={{ width: 40, height: 5, borderRadius: 999, background: C.line, margin:'0 auto 12px' }}/>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px 10px' }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.ink }}>Эрэмбэлэх</div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 999, background:'#F4F6FA', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke={C.muted} strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
        {SEC_SORTS.map((o) => {
          const sel = value === o.k;
          return (
            <button key={o.k} onClick={() => onPick(o.k)} style={{
              width:'100%', textAlign:'left', display:'flex', alignItems:'center', gap: 12, padding:'13px 20px',
              background: sel ? C.indigoSoft : 'transparent', border:'none', cursor:'pointer',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: sel ? C.indigo : C.ink }}>{o.l}</div>
                <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{o.d}</div>
              </div>
              <div style={{ width: 22, height: 22, borderRadius: 999, border:`2px solid ${sel ? C.indigo : C.line}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                {sel && <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke={C.indigo} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================
// SECONDARY-MARKET CARD + TICKER EXPLAINER SHEET
// ============================================================

const MONO = "'JetBrains Mono', ui-monospace, monospace";

const SEC_ISSUERS = {
  CAPIT: { name:'Капитрон Банк ХК', c: C.blue,  type:'Сертификат', issued:'2024-02-27' },
  GOLDH: { name:'Голден Хилл Партнерс', c:'#F59E0B', type:'Итгэлцэл', issued:'2024-04-14' },
  MSTRT: { name:'Кредитекс СТМ ББСБ', c: C.indigo, type:'Итгэлцэл', issued:'2024-11-17' },
  DMFIN: { name:'Дарь Финанс ББСБ', c:'#7C3AED', type:'Итгэлцэл', issued:'2024-11-28' },
  ZEELY: { name:'Зээлэх Капитал ББСБ', c:'#0EA5A5', type:'Итгэлцэл', issued:'2024-11-09' },
};

const secYmd = (s) => (!s || s.length < 6) ? '' : ('20' + s.slice(4,6) + '-' + s.slice(2,4) + '-' + s.slice(0,2));

const augSec = (s) => {
  const code = String(s.ticker).split(' ')[0];
  const meta = SEC_ISSUERS[code] || { name: code, c: C.indigo, type:'—', issued:'—' };
  const mat = String(s.ticker).split(' ')[3] || '';
  return { ...s, issuer: meta.name, c: meta.c, typeName: meta.type, issued: meta.issued, maturityDate: secYmd(mat) };
};

const SecCard = ({ s, onOpen, badge, variant }) => {
  const stats = variant === 'cat'
    ? [{ l:'Ширхэг', v: s.qty }, { l:'Нэгж үнэ', v:'₮'+s.price }, { l:'Төлөгдөх', v: s.term }]
    : [{ l:'Боломжит', v: s.qty+' ш' }, { l:'Худ. авах үнэ', v:'₮'+s.price }, { l:'Үлдсэн хугацаа', v: s.term }];
  return (
    <div style={{ background:'#fff', borderRadius: 16, padding: 14, border:`1px solid ${C.line2}` }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap: 8 }}>
        <button onClick={() => onOpen && onOpen(s)} style={{ flex:1, minWidth:0, textAlign:'left', background:'none', border:'none', padding:0, cursor:'pointer', display:'flex', alignItems:'flex-start', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: s.c||C.indigo, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight: 800, fontSize: 14, flexShrink:0 }}>{(s.issuer||'').charAt(0)}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, letterSpacing:'-0.01em', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{s.issuer}</div>
            </div>
            <div style={{ marginTop: 3, fontSize: 11, color: C.muted2, fontFamily: MONO, fontWeight: 600, display:'flex', alignItems:'center', gap: 6 }}>
              {s.ticker}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, opacity:.7 }}><circle cx="12" cy="12" r="9" stroke={C.muted2} strokeWidth="2"/><path d="M12 11v5M12 8h.01" stroke={C.muted2} strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <div style={{ marginTop: 6, fontSize: 11, color: C.muted, fontWeight: 600 }}>Бодит өгөөж <span style={{ color: C.indigo, fontWeight: 800, fontSize: 13, fontVariantNumeric:'tabular-nums' }}>{s.real}% /жил</span></div>
          </div>
        </button>
        <button style={{ height: 32, padding:'0 14px', borderRadius: 10, background: C.indigoSoft, color: C.indigo, fontWeight: 700, fontSize: 12, border:'none', flexShrink:0, cursor:'pointer' }}>Авах</button>
      </div>
      <div style={{ display:'flex', gap: 16, marginTop: 12, paddingTop: 12, borderTop:`1px dashed ${C.line2}` }}>
        {stats.map((x, j) => (
          <div key={j} style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: C.muted, fontWeight: 600 }}>{x.l}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginTop: 2, fontVariantNumeric:'tabular-nums' }}>{x.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TickerSheet = ({ item, onClose }) => {
  if (!item) return null;
  const parts = String(item.ticker).split(' ');
  const segs = [
    { v: parts[0]||'', label:'Гаргагчийн код', c: C.blue },
    { v: parts[1]||'', label:'Нэрлэсэн код', c: C.indigo },
    { v: parts[2]||'', label:'Бүтээгдэхүүний төрөл', c: C.amber },
    { v: parts[3]||'', label:'Төлөгдөх огноо', c: C.green },
  ];
  return (
    <div style={{ position:'absolute', inset:0, zIndex: 40 }}>
      <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(5,11,31,.45)' }}/>
      <div style={{ position:'absolute', left:0, right:0, bottom:0, background:'#fff', borderRadius:'24px 24px 0 0', boxShadow:'0 -10px 40px -16px rgba(15,20,55,.4)', maxHeight:'92%', display:'flex', flexDirection:'column' }}>
        <div style={{ width: 40, height: 5, borderRadius: 999, background: C.line, margin:'10px auto 8px', flexShrink:0 }}/>
        <div style={{ overflow:'auto', padding:'6px 22px 16px' }}>
          <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
            <div style={{ width: 46, height: 46, borderRadius: 13, background: item.c||C.indigo, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight: 800, fontSize: 18, flexShrink:0 }}>{(item.issuer||'').charAt(0)}</div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.ink, letterSpacing:'-0.01em' }}>{item.issuer}</div>
              <div style={{ fontSize: 11, color: C.muted2, fontWeight: 600, fontFamily: MONO }}>{item.ticker}</div>
            </div>
          </div>

          <div style={{ marginTop: 18, fontSize: 11, fontWeight: 800, color: C.muted, textTransform:'uppercase', letterSpacing:'0.06em' }}>Тикерийн бүтэц</div>
          <div style={{ marginTop: 12, display:'flex', gap: 10, justifyContent:'center', flexWrap:'wrap' }}>
            {segs.map((sg, i) => (
              <div key={i} style={{ textAlign:'center' }}>
                <div style={{ fontSize: 17, fontWeight: 800, color: C.ink, fontFamily: MONO, letterSpacing:'0.02em' }}>{sg.v}</div>
                <div style={{ height: 3, borderRadius: 2, background: sg.c, marginTop: 6 }}/>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, display:'flex', flexDirection:'column', gap: 9 }}>
            {segs.map((sg, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap: 10 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: sg.c, flexShrink:0 }}/>
                <span style={{ fontSize: 12, color: C.text, fontWeight: 600, flex:1 }}>{sg.label}</span>
                <span style={{ fontSize: 12, color: C.ink, fontWeight: 700, fontFamily: MONO }}>{sg.v}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 18, background:'#FAFBFE', borderRadius: 16, border:`1px solid ${C.line2}`, overflow:'hidden' }}>
            {[
              { l:'Бүтээгдэхүүний төрөл', v: item.typeName },
              { l:'Гаргасан огноо', v: item.issued },
              { l:'Төлөгдөх огноо', v: item.maturityDate },
              { l:'Нэрлэсэн үр шим', v: item.rate+'% /жил' },
            ].map((r, i) => (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 14px', borderTop: i ? `1px solid ${C.line2}` : 'none' }}>
                <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 600 }}>{r.l}</span>
                <span style={{ fontSize: 13, color: C.ink, fontWeight: 700, fontVariantNumeric:'tabular-nums' }}>{r.v}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12, background: C.amberSoft, border:`1px solid #FFE9C4`, borderRadius: 14, padding: 13, display:'flex', gap: 10 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:1 }}><path d="M12 8v5M12 16h.01" stroke={C.amber} strokeWidth="2.2" strokeLinecap="round"/><circle cx="12" cy="12" r="9" stroke={C.amber} strokeWidth="2"/></svg>
            <div style={{ fontSize: 11, color:'#7A5A1F', lineHeight: 1.5 }}>Бодит өгөөж нь зах зээлийн нөхцлөөс хамаарч өөрчлөгдөж болзошгүй. Өнгөрсөн үеийн өгөөж ирээдүйн үр дүнг баталгаажуулахгүй.</div>
          </div>
        </div>
        <div style={{ flexShrink:0, padding:'12px 22px 20px', borderTop:`1px solid ${C.line2}`, display:'flex', flexDirection:'column', gap: 10, background:'#fff' }}>
          <button style={{ width:'100%', height: 50, borderRadius: 14, background: C.indigo, color:'#fff', border:'none', fontWeight: 700, fontSize: 15, cursor:'pointer', boxShadow:'0 8px 22px -8px rgba(79,70,229,.5)' }}>Авах</button>
          <button onClick={onClose} style={{ width:'100%', height: 46, borderRadius: 14, background:'transparent', color: C.muted, border:`1px solid ${C.line}`, fontWeight: 700, fontSize: 14, cursor:'pointer' }}>Хаах</button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// 09 — TRADING / MARKETPLACE
// ============================================================

/* ----- this screen ----- */
const Category = () => {
  const [seg, setSeg] = useState(0); // 0 primary, 1 secondary
  const [secSort, setSecSort] = useState('yield');
  const [sortOpen, setSortOpen] = useState(false);
  const [tk, setTk] = useState(null);
  const primary = [
    { issuer:'Голден Хилл Партнерс ББСБ ХХК', y:'23.0', real:'25.6', t:'12 сар', p:'1,000,000', a:'365 сая', c:'#F59E0B' },
    { issuer:'Кредитекс СТМ ББСБ ХХК',         y:'19.5', real:'21.3', t:'6 сар',  p:'1,000,000', a:'785 сая', c:C.indigo },
    { issuer:'Анлок Капитал ББСБ ХХК',         y:'22.5', real:'24.9', t:'1 жил',  p:'1,000,000', a:'540 сая', c:C.blue },
  ];
  const secondary = [
    { ticker:'GOLDH 2300 IT 140427', type:'Зарах', qty: 180, price:'1,000,000', term:'327 хоног', real:'24.8', rate:'23.0' },
    { ticker:'MSTRT 2400 IT 171126', type:'Зарах', qty: 227, price:'1,000,000', term:'179 хоног', real:'20.6', rate:'19.5' },
    { ticker:'DMFIN 2250 IT 281126', type:'Зарах', qty: 30,  price:'1,000,000', term:'190 хоног', real:'22.9', rate:'21.5' },
    { ticker:'ZEELY 2100 IT 091126', type:'Зарах', qty: 50,  price:'1,000,000', term:'141 хоног', real:'21.4', rate:'20.0' },
  ];
  return (
    <Frame label="25 — Category · Итгэлцэл">
      <BackBar title="Итгэлцэл"/>

      {/* segmented */}
      <div style={{ padding: '8px 24px 16px', flexShrink: 0 }}>
        <div style={{ background: '#EDEFF6', borderRadius: 14, padding: 4, display:'flex' }}>
          {['Анхдагч','Хоёрдогч'].map((s, i) => (
            <div key={i} onClick={() => setSeg(i)} style={{
              flex: 1, height: 40, borderRadius: 10,
              background: seg===i ? '#fff' : 'transparent',
              boxShadow: seg===i ? '0 2px 6px -2px rgba(15,20,55,.12)' : 'none',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontWeight: seg===i ? 700 : 600, fontSize: 13, color: seg===i ? C.ink : C.muted,
              cursor:'pointer', transition:'all .2s',
            }}>{s}</div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflow:'auto', padding: '0 24px 16px' }}>
        {seg === 0 ? (
          <div style={{ display:'flex', flexDirection:'column', gap: 12 }}>
            {primary.map((p, i) => (
              <div key={i} style={{ background:'#fff', borderRadius: 20, padding: 16, border:`1px solid ${C.line2}`, boxShadow: '0 2px 6px -2px rgba(15,20,55,.04)' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: p.c, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight: 800 }}>
                      {p.issuer.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, lineHeight:1.2, letterSpacing:'-0.01em' }}>{p.issuer}</div>
                      <div style={{ fontSize: 10, color: C.muted, marginTop: 3 }}>Анхдагч арилжаа</div>
                    </div>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginTop: 14 }}>
                  <div>
                    <div style={{ fontSize: 10, color: C.muted, fontWeight: 600 }}>Үр шим</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: p.c, fontVariantNumeric:'tabular-nums', letterSpacing:'-0.02em' }}>{p.y}<span style={{fontSize:14, color: C.muted, fontWeight:600}}> %</span></div>
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 8, marginTop: 12, paddingTop: 12, borderTop: `1px dashed ${C.line2}` }}>
                  {[
                    { l:'Хугацаа', v: p.t },
                    { l:'Нэгж үнэ', v: '₮'+p.p },
                    { l:'Боломжит', v: '₮'+p.a },
                  ].map((x, j) => (
                    <div key={j}>
                      <div style={{ fontSize: 10, color: C.muted, fontWeight: 600 }}>{x.l}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginTop: 2, fontVariantNumeric:'tabular-nums' }}>{x.v}</div>
                    </div>
                  ))}
                </div>
                <button style={{
                  width:'100%', height: 44, borderRadius: 12, marginTop: 14,
                  background: C.indigo, color:'#fff', fontWeight: 700, fontSize: 14, border:'none', cursor:'pointer',
                }}>Авах</button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap: 10 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 2 }}>
              <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>{secondary.length} зарах санал</span>
              <SortButton label={secLabel(secSort)} onClick={()=>setSortOpen(true)}/>
            </div>
            {sortSecondary(secondary, secSort).map((s, i) => (
              <SecCard key={i} s={augSec(s)} variant="cat" onOpen={setTk}/>
            ))}
          </div>
        )}
        <div style={{ height: 8 }}/>
      </div>
      <SortSheet open={sortOpen} value={secSort} onClose={()=>setSortOpen(false)} onPick={(k)=>{ setSecSort(k); setSortOpen(false); }}/>
      <TickerSheet item={tk} onClose={()=>setTk(null)}/>
    </Frame>
  );
};

// ============================================================
// 11 — INSTRUMENT DETAIL
// ============================================================

(window.__MMF_SCREENS = window.__MMF_SCREENS || {}).Category = Category;
})();