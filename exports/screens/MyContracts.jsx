/* =========================================================================
   Money Market Fund — Mobile App · Screen: MyContracts
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

const pIcon = (k, color = C.ink) => {
  const p = { stroke: color, strokeWidth: 2, fill:'none', strokeLinecap:'round', strokeLinejoin:'round' };
  const M = {
    user:  <g {...p}><circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0114 0"/></g>,
    pin:   <g {...p}><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></g>,
    lock:  <g {...p}><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 018 0v3M12 14v3"/></g>,
    globe: <g {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"/></g>,
    bell:  <g {...p}><path d="M6 9a6 6 0 0112 0c0 6 2.5 7 2.5 7H3.5S6 15 6 9z"/><path d="M10 20a2 2 0 004 0"/></g>,
    doc:   <g {...p}><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></g>,
    docs:  <g {...p}><rect x="4" y="5" width="11" height="14" rx="2"/><path d="M18 8v11H8" opacity=".5"/><path d="M7 9h5M7 12h5"/></g>,
    cert:  <g {...p}><circle cx="12" cy="9" r="5"/><path d="M9 13l-1.5 7L12 18l4.5 2L15 13"/></g>,
    shield:<g {...p}><path d="M12 3l8 3v6c0 4.5-3 7.5-8 9-5-1.5-8-4.5-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/></g>,
    help:  <g {...p}><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 113.5 2.3c-.8.4-1 .9-1 1.7M12 17h.01"/></g>,
    info:  <g {...p}><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></g>,
    out:   <g {...p}><path d="M15 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h7a2 2 0 002-2v-2M10 12h10M17 9l3 3-3 3"/></g>,
  };
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none">{M[k]}</svg>;
};

// ---- menu primitives ----

/* ----- this screen ----- */
const MyContracts = ({ onNav }) => {
  const products = [
    { t:'CAPIT 1450 CD', n:'CT-2026-04823', d:'2026-05-22' },
    { t:'GOLDH 2300 IT', n:'CT-2026-04102', d:'2026-04-14' },
    { t:'MSTRT 2400 IT', n:'CT-2025-09810', d:'2025-11-17' },
  ];
  const loans = [
    { t:'Зээлийн гэрээ', n:'LN-2026-04823', d:'2026-05-29' },
  ];
  const Row = ({ c, top }) => (
    <button onClick={() => onNav && onNav('profileContract')} style={{ width:'100%', textAlign:'left', display:'flex', alignItems:'center', gap: 12, padding:'13px 14px', background:'transparent', border:'none', borderTop: top ? `1px solid ${C.line2}` : 'none', cursor:'pointer' }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background:'#F4F6FB', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{pIcon('doc', C.indigo)}</div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: C.ink }}>{c.t}</div>
        <div style={{ fontSize: 11, color: C.muted, marginTop: 2, fontFamily:"'JetBrains Mono', monospace" }}>{c.n} · {c.d}</div>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke={C.muted2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </button>
  );
  return (
    <Frame label="Profile · my contracts">
      <BackBar title="Миний гэрээнүүд"/>
      <div style={{ flex:1, overflow:'auto', padding:'2px 24px 24px' }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, letterSpacing:'0.04em', textTransform:'uppercase', padding:'0 4px 8px', marginTop: 6 }}>Бүтээгдэхүүний гэрээ</div>
        <div style={{ background:'#fff', borderRadius: 16, border:`1px solid ${C.line2}`, overflow:'hidden' }}>
          {products.map((c, i) => <Row key={i} c={c} top={i > 0}/>)}
        </div>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, letterSpacing:'0.04em', textTransform:'uppercase', padding:'0 4px 8px', marginTop: 18 }}>Зээлийн гэрээ</div>
        <div style={{ background:'#fff', borderRadius: 16, border:`1px solid ${C.line2}`, overflow:'hidden' }}>
          {loans.map((c, i) => <Row key={i} c={c} top={i > 0}/>)}
        </div>
      </div>
    </Frame>
  );
};

// ============================================================
// ТОДОРХОЙЛОЛТ REQUEST (type: invest | loan) + success
// ============================================================

(window.__MMF_SCREENS = window.__MMF_SCREENS || {}).MyContracts = MyContracts;
})();