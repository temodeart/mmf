/* =========================================================================
   Money Market Fund — Mobile App · Screen: Splash
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

const PillBtn = ({ children, primary, ghost, onClick, full, small }) => {
  const h = small ? 36 : 48;
  let style = {
    height: h, padding: small ? '0 16px' : '0 22px',
    width: full ? '100%' : 'auto',
    borderRadius: small ? 12 : 14, fontWeight: 700, fontSize: small ? 13 : 15,
    letterSpacing: '-0.01em', border: 'none', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  };
  if (primary) style = { ...style, background: C.indigo, color: '#fff', boxShadow:'0 6px 18px -6px rgba(79,70,229,.45)' };
  else if (ghost) style = { ...style, background: 'transparent', color: C.ink, border: `1.5px solid ${C.line}` };
  else style = { ...style, background: C.ink, color: '#fff' };
  return <button style={style} onClick={onClick}>{children}</button>;
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

/* ----- this screen ----- */
const Splash = () => (
  <Frame label="01 — Splash / Welcome">
    <div style={{ flex: 1, position: 'relative', padding: '24px 24px 0', display: 'flex', flexDirection: 'column' }}>
      {/* abstract gradient shape */}
      <div style={{
        position: 'absolute', top: -120, right: -100, width: 380, height: 380,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%, #2D6BFF 0%, #4F46E5 45%, #050B1F 100%)',
        opacity: .9, filter: 'blur(2px)',
      }}/>
      <div style={{
        position: 'absolute', top: 80, right: -60, width: 200, height: 200,
        borderRadius: '50%', background: 'radial-gradient(circle, #FF6B2C 0%, transparent 70%)',
        opacity: .35,
      }}/>

      <div style={{ marginTop: 32, position:'relative', zIndex:1 }}>
        <LogoMark size={44}/>
      </div>

      <div style={{ flex: 1 }}/>

      <div style={{ position: 'relative', zIndex: 1, paddingBottom: 24 }}>
        <div style={{
          fontSize: 13, fontWeight: 700, color: C.indigo, letterSpacing: '0.18em',
          textTransform: 'uppercase', marginBottom: 16,
        }}>МӨНГӨНИЙ ЗАХ ЗЭЭЛ</div>
        <div style={{ fontSize: 44, fontWeight: 800, color: C.ink, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
          Money never<br/>sleeps.
        </div>
        <div style={{ fontSize: 16, color: C.muted, marginTop: 16, lineHeight: 1.5, maxWidth: 300 }}>
          Богино хугацааны санхүүгийн бүтээгдэхүүнд найдвартай хөрөнгө оруулах боломж.
        </div>

        <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <PillBtn primary full data-nav="signup">Бүртгүүлэх</PillBtn>
          <button style={{
            height: 52, background: 'transparent', border: `1.5px solid ${C.line}`,
            borderRadius: 14, color: C.ink, fontWeight: 700, fontSize: 15, cursor: 'pointer',
          }} data-nav="login">Нэвтрэх</button>
        </div>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 11, color: C.muted2, letterSpacing: '0.04em' }}>
          МОНИ МАРКЕТ ФАНД ХХК · 2026
        </div>
      </div>
    </div>
  </Frame>
);

// ============================================================
// 02–04 — ONBOARDING
// ============================================================

(window.__MMF_SCREENS = window.__MMF_SCREENS || {}).Splash = Splash;
})();