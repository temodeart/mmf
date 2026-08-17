/* =========================================================================
   Money Market Fund — Mobile App · Screen: Onb1
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

const OnboardingChrome = ({ index, total = 3 }) => (
  <>
    <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink:0 }}>
      <LogoMark size={24}/>
      <button style={{
        background: 'transparent', border: 'none', color: C.muted, fontWeight: 600, fontSize: 14, cursor: 'pointer',
      }}>Алгасах</button>
    </div>
  </>
);

const OnbDots = ({ index, total = 3 }) => (
  <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 0 }}>
    {Array.from({length: total}).map((_, i) => (
      <div key={i} style={{
        height: 6, width: i === index ? 24 : 6, borderRadius: 999,
        background: i === index ? C.indigo : C.line, transition: 'all .3s',
      }}/>
    ))}
  </div>
);

// Visual A — yield curve / card stack

const VizYield = () => (
  <div style={{ position: 'relative', height: 280, padding: '0 24px' }}>
    <div style={{
      position: 'absolute', inset: '20px 24px', borderRadius: 28,
      background: 'linear-gradient(160deg, #EEF0FE 0%, #E7EEFF 60%, #F4F6FA 100%)',
    }}/>
    {/* curve */}
    <svg viewBox="0 0 340 260" style={{ position:'absolute', inset:'20px 24px', width:'calc(100% - 48px)', height: 240 }}>
      <defs>
        <linearGradient id="cg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#4F46E5" stopOpacity=".35"/>
          <stop offset="100%" stopColor="#4F46E5" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d="M0 200 C 60 180, 120 80, 200 70 S 320 30, 340 20 L 340 240 L 0 240 Z" fill="url(#cg)"/>
      <path d="M0 200 C 60 180, 120 80, 200 70 S 320 30, 340 20" stroke="#4F46E5" strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* dots */}
      <circle cx="60" cy="178" r="5" fill="#fff" stroke="#4F46E5" strokeWidth="3"/>
      <circle cx="200" cy="70" r="5" fill="#fff" stroke="#4F46E5" strokeWidth="3"/>
      <circle cx="320" cy="28" r="5" fill="#fff" stroke="#4F46E5" strokeWidth="3"/>
    </svg>
    {/* floating yield card */}
    <div style={{
      position:'absolute', right: 36, top: 36, background: '#fff', borderRadius: 16, padding: '12px 14px',
      boxShadow: '0 10px 30px -10px rgba(15,20,55,.25)',
    }}>
      <div style={{ fontSize: 10, color: C.muted, fontWeight: 600, textTransform:'uppercase', letterSpacing:'0.08em' }}>Үр шим</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: C.ink, letterSpacing:'-0.02em' }}>14.5<span style={{fontSize:13,color:C.muted}}> %/жил</span></div>
    </div>
    <div style={{
      position:'absolute', left: 40, bottom: 32, background: C.navy, color:'#fff', borderRadius: 16, padding: '12px 14px',
      boxShadow: '0 10px 30px -10px rgba(15,20,55,.4)',
    }}>
      <div style={{ fontSize: 10, opacity:.6, fontWeight: 600, textTransform:'uppercase', letterSpacing:'0.08em' }}>Хугацаа</div>
      <div style={{ fontSize: 18, fontWeight: 800 }}>3–12 сар</div>
    </div>
  </div>
);

// Visual B — instrument cards stack

const OnboardingScreen = ({ idx, total = 4, label, viz, eyebrow, title, subline }) => (
  <Frame label={label}>
    <OnboardingChrome index={idx}/>
    <div style={{ padding: '8px 0 0' }}>
      {viz}
    </div>
    <div style={{ flex: 1, padding: '32px 28px 24px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.indigo, letterSpacing: '0.18em', textTransform:'uppercase' }}>{eyebrow}</div>
        <div style={{ fontSize: 30, fontWeight: 800, color: C.ink, marginTop: 14, lineHeight: 1.1, letterSpacing:'-0.02em', textWrap:'pretty' }}>{title}</div>
        <div style={{ fontSize: 15, color: C.muted, marginTop: 14, lineHeight: 1.55 }}>{subline}</div>
      </div>
      <div>
        <OnbDots index={idx} total={total}/>
        <div style={{ display:'flex', gap: 12, marginTop: 24 }}>
          <button style={{
            flex: 1, height: 52, borderRadius: 14, border: `1.5px solid ${C.line}`,
            background:'transparent', color: C.ink, fontWeight: 700, cursor:'pointer',
          }}>Буцах</button>
          <button style={{
            flex: 2, height: 52, borderRadius: 14, border: 'none',
            background: C.indigo, color:'#fff', fontWeight: 700, cursor:'pointer',
            boxShadow:'0 8px 22px -8px rgba(79,70,229,.5)',
          }}>{idx === total - 1 ? 'Эхлэх' : 'Үргэлжлүүлэх'}</button>
        </div>
      </div>
    </div>
  </Frame>
);

// Visual D — loan / quick money

/* ----- this screen ----- */
const Onb1 = () => <OnboardingScreen idx={0} total={4} label="03 — Onboarding · Money market"
  viz={<VizYield/>}
  eyebrow="01 / 04"  title="Богино хугацаатай хөрөнгө оруулалт нэг газар"
  subline="Мөнгөний захын дөрвөн төрлийн бүтээгдэхүүнийг нэг платформоос харьцуулан худалдан авах боломж."
/>;

(window.__MMF_SCREENS = window.__MMF_SCREENS || {}).Onb1 = Onb1;
})();