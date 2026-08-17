/* =========================================================================
   Money Market Fund — Mobile App · Screen: PayFailed
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

/* module aliases (loan_eligibility.jsx) */
const useStateLE = React.useState;
const FrameLE = Frame;
const CLE = C;
const BackBarLE = BackBar;
const DotLE = Dot;
const LogoMarkLE = LogoMark;

const LEFooter = ({ children, secondary, onSecondary, dark = false, disabled = false }) => (
  <div style={{ padding:'12px 24px 6px', background:'#fff', borderTop:`1px solid ${CLE.line2}`, flexShrink: 0, display:'flex', flexDirection:'column', gap: 8 }}>
    <button disabled={disabled} style={{
      width:'100%', height: 52, borderRadius: 14, border:'none', cursor: disabled ? 'default' : 'pointer',
      background: disabled ? '#E7E9F2' : (dark ? CLE.ink : CLE.indigo),
      color: disabled ? CLE.muted2 : '#fff',
      fontWeight: 700, fontSize: 15, letterSpacing:'-0.01em',
      display:'flex', alignItems:'center', justifyContent:'center', gap: 10,
      boxShadow: (disabled || dark) ? 'none' : '0 8px 22px -8px rgba(79,70,229,.5)',
      transition:'background .15s',
    }}>{children}</button>
    {secondary && (
      <button onClick={onSecondary} style={{ width:'100%', height: 48, borderRadius: 14, background:'transparent', color: CLE.muted, border:'none', fontWeight: 700, fontSize: 14, cursor:'pointer' }}>{secondary}</button>
    )}
  </div>
);

const PayStatus = ({ label, screenN, state }) => {
  // state: 'waiting' | 'confirmed' | 'failed' | 'timeout'
  const cfg = {
    waiting:   { ring: CLE.indigo, soft: CLE.indigoSoft, title:'Төлбөр баталгаажиж байна', body:'Төлбөрийн мэдээллийг шалгаж байна.', cta:'Төлбөр шалгах', spin:true },
    confirmed: { ring: CLE.green,  soft: CLE.greenSoft,  title:'Төлбөр баталгаажлаа',        body:'ЗМС лавлагаа эхэлж байна.' },
    failed:    { ring: CLE.red,    soft: CLE.redSoft,    title:'Төлбөр баталгаажсангүй',     body:'Төлбөр амжилттай хийгдээгүй байна. Та дахин оролдоно уу.', cta:'Дахин төлөх', dark:true },
    timeout:   { ring: CLE.amber,  soft: CLE.amberSoft,  title:'Төлбөр хүлээгдэж байна',      body:'Хэрэв та төлбөрөө төлсөн бол дахин шалгана уу.', cta:'Дахин шалгах' },
  }[state];

  const glyph = state === 'confirmed' ? (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke={CLE.green} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ) : state === 'failed' ? (
    <svg width="42" height="42" viewBox="0 0 24 24" fill="none"><path d="M7 7l10 10M17 7L7 17" stroke={CLE.red} strokeWidth="3" strokeLinecap="round"/></svg>
  ) : state === 'timeout' ? (
    <svg width="42" height="42" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={CLE.amber} strokeWidth="2.2" fill="none"/><path d="M12 7.5V12l3 2" stroke={CLE.amber} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ) : (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="7" stroke={CLE.indigo} strokeWidth="2" fill="none"/><path d="M12 8v4l2.5 1.5" stroke={CLE.indigo} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  );

  return (
    <FrameLE label={label}>
      <BackBarLE title=""/>
      <div style={{ flex: 1, overflow:'auto', padding: '8px 24px 20px', display:'flex', flexDirection:'column' }}>
        <div style={{ flex: 1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', textAlign:'center' }}>
          <div style={{ position:'relative', width: 110, height: 110, display:'flex', alignItems:'center', justifyContent:'center' }}>
            {cfg.spin && <div className="omf-spin" style={{ position:'absolute', inset: 6, borderRadius:999, border:`4px solid ${cfg.soft}`, borderTopColor: cfg.ring }}/>}
            <div style={{ width: 88, height: 88, borderRadius: 28, background: cfg.soft, display:'flex', alignItems:'center', justifyContent:'center' }}>{glyph}</div>
          </div>
          <div style={{ fontSize: 23, fontWeight: 800, color: CLE.ink, marginTop: 26, letterSpacing:'-0.02em', lineHeight: 1.2 }}>{cfg.title}</div>
          <div style={{ fontSize: 13.5, color: CLE.muted, marginTop: 12, lineHeight: 1.55, maxWidth: 290 }}>{cfg.body}</div>
          {state === 'confirmed' && (
            <div style={{ marginTop: 18, display:'inline-flex', alignItems:'center', gap: 8, padding:'8px 14px', borderRadius: 999, background: CLE.greenSoft, color: CLE.green, fontSize: 12, fontWeight: 700 }}>
              <div className="omf-spin" style={{ width: 14, height: 14, borderRadius:999, border:`2px solid ${CLE.green}`, borderTopColor:'transparent' }}/>
              ЗМС шалгалт руу шилжиж байна
            </div>
          )}
          <div style={{ marginTop: 18, display:'inline-flex', alignItems:'center', gap: 6, padding:'5px 12px', borderRadius: 999, background:'#FAFBFE', border:`1px solid ${CLE.line2}`, fontSize: 11.5, fontWeight: 700, color: CLE.muted }}>
            <DotLE color={cfg.ring}/>ЗМС лавлагаа · ₮4,000
          </div>
        </div>
      </div>
      {cfg.cta && <LEFooter dark={cfg.dark}>{cfg.cta}</LEFooter>}
    </FrameLE>
  );
};

/* ----- this screen ----- */
const PayFailed    = () => <PayStatus label="38 — Payment · Failed"    state="failed"/>;

(window.__MMF_SCREENS = window.__MMF_SCREENS || {}).PayFailed = PayFailed;
})();