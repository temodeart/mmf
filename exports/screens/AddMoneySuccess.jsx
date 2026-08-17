/* =========================================================================
   Money Market Fund — Mobile App · Screen: AddMoneySuccess
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

const RowsCard = ({ rows, foot }) => (
  <div style={{ background:'#fff', borderRadius: 18, border:`1px solid ${CW.line2}`, overflow:'hidden' }}>
    {rows.map((r, i) => (
      <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'13px 16px', borderTop: i ? `1px solid ${CW.line2}` : 'none' }}>
        <span style={{ fontSize: 12.5, color: CW.muted, fontWeight: 600 }}>{r.l}</span>
        <span style={{ fontSize: r.big ? 15 : 13, fontWeight: r.big ? 800 : 700, color: r.tone || CW.ink, fontVariantNumeric:'tabular-nums', letterSpacing: r.big ? '-0.01em' : 0 }}>{r.v}</span>
      </div>
    ))}
    {foot && (
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px 16px', background:'#FAFBFE' }}>
        <span style={{ fontSize: 13, color: CW.ink, fontWeight: 800 }}>{foot.l}</span>
        <span style={{ fontSize: 20, color: CW.indigo, fontWeight: 800, fontVariantNumeric:'tabular-nums', letterSpacing:'-0.01em' }}>{foot.v}</span>
      </div>
    )}
  </div>
);

/* ----- this screen ----- */
const AddMoneySuccess = () => (
  <FrameW label="W3 — Орлого · Амжилттай">
    <div style={{ height: 44, flexShrink: 0 }}/>
    <div style={{ flex: 1, overflow:'auto', padding: '6px 24px 22px', display:'flex', flexDirection:'column' }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center' }}>
        <div style={{ width: 88, height: 88, borderRadius: 28, background:`linear-gradient(135deg, ${CW.green}, #0B8F60)`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 18px 40px -12px rgba(14,159,110,.55)' }}>
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, color: CW.ink, marginTop: 22, letterSpacing:'-0.02em', lineHeight: 1.2 }}>Хэтэвч цэнэглэгдлээ</div>
        <div style={{ fontSize: 13.5, color: CW.muted, marginTop: 10, lineHeight: 1.55, maxWidth: 290 }}>
          <strong style={{ color: CW.ink }}>₮ 500,000</strong> таны хэтэвчинд нэмэгдлээ.
        </div>
      </div>
      <div style={{ marginTop: 22 }}>
        <RowsCard rows={[
          { l:'Цэнэглэсэн дүн', v:'₮ 500,000' },
          { l:'Арга', v:'QPay' },
          { l:'Огноо', v:'2026.06.08 · 14:21' },
        ]} foot={{ l:'Шинэ үлдэгдэл', v:'₮ 2,680,000' }}/>
      </div>
    </div>
    <div style={{ padding:'12px 24px 6px', background:'#fff', borderTop:`1px solid ${CW.line2}`, flexShrink: 0, display:'flex', flexDirection:'column', gap: 8 }}>
      <button style={{ width:'100%', height: 52, borderRadius: 14, background: CW.indigo, color:'#fff', border:'none', fontWeight: 700, fontSize: 15, cursor:'pointer', boxShadow:'0 8px 22px -8px rgba(79,70,229,.5)' }}>Хэтэвч рүү буцах</button>
      <button style={{ width:'100%', height: 48, borderRadius: 14, background:'transparent', color: CW.muted, border:'none', fontWeight: 700, fontSize: 14, cursor:'pointer' }}>Гүйлгээ харах</button>
    </div>
  </FrameW>
);

// ============================================================
// WITHDRAW · W1 — amount + destination
// ============================================================

(window.__MMF_SCREENS = window.__MMF_SCREENS || {}).AddMoneySuccess = AddMoneySuccess;
})();