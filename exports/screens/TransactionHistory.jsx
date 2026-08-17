/* =========================================================================
   Money Market Fund — Mobile App · Screen: TransactionHistory
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

const LogoMark = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path d="M9.6 11.4V28.6L0 34.4V0h9.9L24 8.4 38.1 0H48v5.6L24 20 9.6 11.4z" fill="#FF6B2C"/>
    <path d="M38.4 36.6V19.4L48 13.6V48h-9.9L24 39.6 9.9 48H0v-5.6L24 28l14.4 8.6z" fill="#2D6BFF"/>
  </svg>
);

const Dot = ({ color }) => (
  <span style={{ display:'inline-block', width:6, height:6, borderRadius:999, background: color }}/>
);

const Badge = ({ tone='new', children }) => {
  const map = {
    new:    { fg: C.green,  bg: C.greenSoft,  dot: C.green },
    active: { fg: C.amber,  bg: C.amberSoft,  dot: C.amber },
    sell:   { fg: C.red,    bg: C.redSoft,    dot: C.red },
    buy:    { fg: C.blue,   bg: C.blueSoft,   dot: C.blue },
    info:   { fg: C.indigo, bg: C.indigoSoft, dot: C.indigo },
  }[tone] || { fg: C.muted, bg: C.line2, dot: C.muted };
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:6,
      padding:'4px 10px', borderRadius: 999,
      background: map.bg, color: map.fg, fontSize: 11, fontWeight: 700,
      letterSpacing: '0.01em',
    }}>
      <Dot color={map.dot}/>{children}
    </span>
  );
};

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

/* module aliases (wallet_flows.jsx) */
const useStateW = React.useState;
const FrameW = Frame;
const CW = C;
const BackBarW = BackBar;
const DotW = Dot;
const BadgeW = Badge;
const LogoMarkW = LogoMark;

const TX_TYPES = [
  { k:'all',      l:'Бүгд' },
  { k:'deposit',  l:'Орлого' },
  { k:'withdraw', l:'Зарлага' },
  { k:'buy',      l:'Худалдан авалт' },
  { k:'sell',     l:'Зарсан' },
];

const TX_DATA = [
  { type:'deposit',  t:'Орлого · QPay',              d:'2026-05-21', a:'5,000,000',  sign:'+' },
  { type:'buy',      t:'Захиалга · MSTRT 2400',      d:'2026-05-20', a:'10,000,000', sign:'-' },
  { type:'deposit',  t:'Эргэн төлөлт · CAPIT 1450',  d:'2026-05-18', a:'1,145,000',  sign:'+' },
  { type:'sell',     t:'Зарсан · GOLDH 2300',        d:'2026-05-15', a:'12,000,000', sign:'+' },
  { type:'withdraw', t:'Зарлага · Хаан банк',        d:'2026-05-12', a:'1,000,300',  sign:'-' },
  { type:'buy',      t:'Захиалга · INV 0820',        d:'2026-05-09', a:'4,300,000',  sign:'-' },
  { type:'deposit',  t:'Орлого · Дансаар',           d:'2026-04-28', a:'2,000,000',  sign:'+' },
  { type:'deposit',  t:'Хүүгийн төлөлт · NEXT 7.5',  d:'2026-04-22', a:'285,000',    sign:'+' },
  { type:'withdraw', t:'Зарлага · Хаан банк',        d:'2026-04-20', a:'500,300',    sign:'-' },
  { type:'buy',      t:'Захиалга · CAPIT 1620',      d:'2026-04-14', a:'9,400,000',  sign:'-' },
];

const txVisual = (type) => ({
  deposit:  { bg: CW.greenSoft,  fg: CW.green,  glyph:<path d="M12 5v14M19 12l-7 7-7-7" stroke={CW.green} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/> },
  withdraw: { bg: CW.indigoSoft, fg: CW.indigo, glyph:<path d="M12 19V5M5 12l7-7 7 7" stroke={CW.indigo} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/> },
  buy:      { bg: CW.blueSoft,   fg: CW.blue,   glyph:<><circle cx="9" cy="20" r="1.4" fill={CW.blue}/><circle cx="17" cy="20" r="1.4" fill={CW.blue}/><path d="M3 4h2l2.2 11h10l1.8-8H6" stroke={CW.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></> },
  sell:     { bg: CW.amberSoft,  fg: CW.amber,  glyph:<path d="M4 13l8-8 8 8-8 8-8-8z M12 9v4" stroke={CW.amber} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/> },
}[type] || { bg: CW.line2, fg: CW.muted2, glyph:null });

const txMonthLabel = (m) => { const [y, mo] = m.split('-'); return `${y} оны ${parseInt(mo, 10)}-р сар`; };

/* ----- this screen ----- */
const TransactionHistory = () => {
  const [filter, setFilter] = useStateW('all');
  const list = filter === 'all' ? TX_DATA : TX_DATA.filter(t => t.type === filter);
  const groups = [];
  list.forEach(t => {
    const m = t.d.slice(0, 7);
    let g = groups.find(x => x.m === m);
    if (!g) { g = { m, items: [] }; groups.push(g); }
    g.items.push(t);
  });
  return (
    <FrameW label="W8 — Гүйлгээний түүх">
      <BackBarW title="Гүйлгээний түүх"/>
      {/* filter chips */}
      <div style={{ flexShrink: 0, padding:'2px 0 12px' }}>
        <div style={{ display:'flex', gap: 8, overflowX:'auto', padding:'0 24px', scrollbarWidth:'none' }}>
          {TX_TYPES.map(ty => {
            const on = filter === ty.k;
            return (
              <button key={ty.k} onClick={() => setFilter(ty.k)} data-nodrag style={{
                flexShrink: 0, height: 36, padding:'0 16px', borderRadius: 999, cursor:'pointer',
                background: on ? CW.ink : '#fff', color: on ? '#fff' : CW.text,
                border: `1px solid ${on ? CW.ink : CW.line}`, fontWeight: 700, fontSize: 12.5,
                fontFamily:'inherit', whiteSpace:'nowrap', transition:'all .15s',
              }}>{ty.l}</button>
            );
          })}
        </div>
      </div>

      <div style={{ flex: 1, overflow:'auto', padding:'0 24px 20px' }}>
        {list.length === 0 ? (
          <div style={{ marginTop: 60, textAlign:'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: CW.line2, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="4" y="5" width="16" height="14" rx="3" stroke={CW.muted2} strokeWidth="2"/><path d="M8 12h8" stroke={CW.muted2} strokeWidth="2.4" strokeLinecap="round"/></svg>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: CW.ink, marginTop: 14 }}>Энэ төрлийн гүйлгээ алга</div>
            <div style={{ fontSize: 12.5, color: CW.muted, marginTop: 6 }}>Өөр шүүлтүүр сонгож үзнэ үү.</div>
          </div>
        ) : groups.map((g, gi) => (
          <div key={g.m} style={{ marginTop: gi ? 18 : 4 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: CW.muted, marginBottom: 8, fontVariantNumeric:'tabular-nums' }}>{txMonthLabel(g.m)}</div>
            <div style={{ background:'#fff', borderRadius: 16, border:`1px solid ${CW.line2}`, overflow:'hidden' }}>
              {g.items.map((t, i) => {
                const v = txVisual(t.type);
                return (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap: 12, padding:'13px 14px', borderTop: i ? `1px solid ${CW.line2}` : 'none' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: v.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">{v.glyph}</svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: CW.ink, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.t}</div>
                      <div style={{ fontSize: 11, color: CW.muted, marginTop: 2, fontVariantNumeric:'tabular-nums' }}>{t.d}</div>
                    </div>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: t.sign === '+' ? CW.green : CW.ink, fontVariantNumeric:'tabular-nums', flexShrink: 0 }}>
                      {t.sign === '+' ? '+ ' : '– '}₮{t.a}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </FrameW>
  );
};

// ============================================================
// EXPORT TO WINDOW
// ============================================================

(window.__MMF_SCREENS = window.__MMF_SCREENS || {}).TransactionHistory = TransactionHistory;
})();