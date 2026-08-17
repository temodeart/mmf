/* =========================================================================
   Money Market Fund — Mobile App · Screen: GSignTutorial
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

const GSignLogo = ({ size = 40 }) => (
  <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
    <div style={{
      width: size, height: size, borderRadius: size * 0.28,
      background:'linear-gradient(135deg, #1F8A5B, #0E9F6E)',
      display:'flex', alignItems:'center', justifyContent:'center',
      boxShadow:'0 8px 18px -8px rgba(14,159,110,.6)',
    }}>
      <svg width={size*0.56} height={size*0.56} viewBox="0 0 24 24" fill="none">
        <path d="M20.5 12a8.5 8.5 0 1 0-3 6.5" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
        <path d="M12 12h6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"/>
      </svg>
    </div>
    <div style={{ fontWeight: 800, fontSize: size * 0.42, letterSpacing:'-0.02em', color: C.ink }}>
      G<span style={{ color:'#0E9F6E' }}>·</span>Sign
    </div>
  </div>
);

// ============================================================
// 07 — PHONE VERIFICATION (step 1/6)
// ============================================================

/* ----- this screen ----- */
const GSignTutorial = () => {
  const steps = [
    'G-Sign апп суулгана',
    'Өөрийн мэдээллээр нэвтэрч баталгаажуулна',
    'MMF апп дээрээс хүсэлт илгээнэ',
    'G-Sign апп дээр хүсэлтийг зөвшөөрнө',
    'MMF апп руу буцаж гэрээгээ дуусгана',
  ];
  return (
    <Frame label="20 — G-Sign tutorial">
      {/* dimmed context behind the sheet */}
      <div style={{ flex: 1, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, padding:'20px 24px', filter:'blur(1px)', opacity:.5 }}>
          <GSignLogo size={36}/>
          <div style={{ marginTop: 18, height: 52, borderRadius: 14, background:'#fff', border:`1px solid ${C.line}` }}/>
          <div style={{ marginTop: 16, height: 52, borderRadius: 14, background:'#fff', border:`1px solid ${C.line}` }}/>
        </div>
        <div style={{ position:'absolute', inset:0, background:'rgba(5,11,31,.45)' }}/>

        {/* sheet */}
        <div style={{ position:'absolute', left:0, right:0, bottom:0, background:'#fff', borderRadius:'28px 28px 0 0', padding:'10px 24px 28px' }}>
          <div style={{ width:40, height:5, borderRadius:999, background:C.line, margin:'0 auto 18px' }}/>
          <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
            <GSignLogo size={30}/>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.ink, marginTop: 16, letterSpacing:'-0.01em' }}>
            G-Sign хэрхэн ашиглах вэ?
          </div>

          <div style={{ marginTop: 16, display:'flex', flexDirection:'column', gap: 4 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap: 14, padding:'10px 0' }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 999, flexShrink: 0,
                  background: C.indigoSoft, color: C.indigo, fontWeight: 800, fontSize: 14,
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>{i + 1}</div>
                <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: C.text, lineHeight: 1.35 }}>{s}</div>
              </div>
            ))}
          </div>

          <a href="https://www.facebook.com/share/v/195SVqc3sm/" target="_blank" rel="noopener noreferrer" style={{
            width:'100%', height: 50, borderRadius: 14, marginTop: 16, boxSizing:'border-box',
            background:'#fff', color: C.ink, border:`1.5px solid ${C.line}`, fontWeight: 700, fontSize: 14, cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center', gap: 10, textDecoration:'none',
          }}>
            <span style={{ width: 26, height: 26, borderRadius: 8, background:'#1877F2', display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
            </span>
            Видео заавар үзэх
            <span style={{ fontSize: 11, fontWeight: 700, color: C.muted2 }}>· Facebook</span>
          </a>

          <button style={{
            width:'100%', height: 52, borderRadius: 14, marginTop: 12,
            background: C.indigo, color:'#fff', border:'none', fontWeight: 700, fontSize: 15, cursor:'pointer',
            boxShadow:'0 8px 22px -8px rgba(79,70,229,.5)',
          }}>Ойлголоо</button>
        </div>
      </div>
    </Frame>
  );
};

// ============================================================
// EXPORT NEW SCREENS TO WINDOW
// ============================================================

(window.__MMF_SCREENS = window.__MMF_SCREENS || {}).GSignTutorial = GSignTutorial;
})();