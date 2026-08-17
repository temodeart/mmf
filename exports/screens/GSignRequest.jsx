/* =========================================================================
   Money Market Fund — Mobile App · Screen: GSignRequest
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

const FooterCTA = ({ children, dark = false, onClick }) => (
  <div style={{ padding:'12px 24px 6px', background:'#fff', borderTop:`1px solid ${C.line2}`, flexShrink: 0 }}>
    <button onClick={onClick} style={{
      width:'100%', height: 52, borderRadius: 14,
      background: dark ? C.ink : C.indigo, color:'#fff', border:'none',
      fontWeight: 700, fontSize: 15, cursor:'pointer', letterSpacing:'-0.01em',
      display:'flex', alignItems:'center', justifyContent:'center', gap: 10,
      boxShadow: dark ? 'none' : '0 8px 22px -8px rgba(79,70,229,.5)',
    }}>{children}</button>
  </div>
);

// Generic, original G-Sign mark (NOT the government logo) — rounded square + ring/check glyph

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
const GSignRequest = () => {
  const [tab, setTab] = useState(0); // 0 = register, 1 = civil registration
  return (
    <Frame label="17 — G-Sign request">
      <BackBar title="G-Sign"/>
      <div style={{ flex: 1, overflow:'auto', padding: '8px 24px 24px' }}>
        {/* brand panel */}
        <div style={{
          borderRadius: 20, padding: '22px', background:'linear-gradient(160deg, #ECFBF3 0%, #F4FBF7 60%, #FFFFFF 100%)',
          border:`1px solid #CFEEDD`, display:'flex', alignItems:'center', justifyContent:'space-between',
        }}>
          <GSignLogo size={38}/>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.green, padding:'4px 10px', borderRadius: 999, background: C.greenSoft }}>Төрийн үйлчилгээ</span>
        </div>

        <div style={{ fontSize: 18, fontWeight: 800, color: C.ink, marginTop: 20, letterSpacing:'-0.01em' }}>G-Sign-аар баталгаажуулах</div>
        <div style={{ fontSize: 12.5, color: C.muted, marginTop: 6, lineHeight: 1.5 }}>
          Мэдээллээ оруулснаар G-Sign апп руу хүсэлт илгээнэ.
        </div>

        {/* segmented tabs */}
        <div style={{ marginTop: 18, background:'#EDEFF6', borderRadius: 14, padding: 4, display:'flex' }}>
          {['Регистрийн дугаар','Иргэний бүртгэлийн дугаар'].map((t, i) => (
            <div key={i} onClick={()=>setTab(i)} style={{
              flex: 1, height: 42, borderRadius: 10, padding:'0 4px',
              background: tab===i ? '#fff' : 'transparent',
              boxShadow: tab===i ? '0 2px 6px -2px rgba(15,20,55,.12)' : 'none',
              display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center',
              fontWeight: tab===i ? 700 : 600, fontSize: 11.5, color: tab===i ? C.ink : C.muted,
              cursor:'pointer', transition:'all .2s', lineHeight: 1.15,
            }}>{t}</div>
          ))}
        </div>

        {/* dynamic field */}
        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 8 }}>{tab===0 ? 'Регистрийн дугаар' : 'Иргэний бүртгэлийн дугаар'}</div>
          <div style={{
            height: 52, borderRadius: 14, background:'#fff',
            border:`1.5px solid ${C.indigo}`, boxShadow:`0 0 0 4px ${C.indigoSoft}`,
            padding:'0 16px', display:'flex', alignItems:'center',
            color: C.ink, fontSize: 16, fontWeight: 700, fontVariantNumeric:'tabular-nums', letterSpacing:'0.06em',
          }}>{tab===0 ? 'УБ 95 02 18 11' : '200 145 2261'}</div>
        </div>

        {/* phone */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 8 }}>Утасны дугаар</div>
          <div style={{
            height: 52, borderRadius: 14, background:'#FAFBFE', border:`1.5px solid ${C.line}`,
            display:'flex', alignItems:'center', padding:'0 16px', gap: 10,
          }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.ink, paddingRight: 10, borderRight:`1px solid ${C.line}`, fontVariantNumeric:'tabular-nums' }}>+976</span>
            <span style={{ fontSize: 15, fontWeight: 600, color: C.ink, fontVariantNumeric:'tabular-nums', letterSpacing:'0.04em' }}>9552 2981</span>
          </div>
        </div>

        <button style={{
          width:'100%', height: 46, marginTop: 18, borderRadius: 14, background:'transparent',
          color: C.indigo, border:'none', fontWeight: 700, fontSize: 13.5, cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center', gap: 8,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={C.indigo} strokeWidth="2" fill="none"/><path d="M12 16v-4M12 8.5h.01" stroke={C.indigo} strokeWidth="2" strokeLinecap="round"/></svg>
          G-Sign хэрхэн ашиглах вэ?
        </button>
      </div>
      <FooterCTA dark>
        G-Sign хүсэлт илгээх
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </FooterCTA>
    </Frame>
  );
};

// ============================================================
// 18 — G-SIGN WAITING  [NEW]
// ============================================================

(window.__MMF_SCREENS = window.__MMF_SCREENS || {}).GSignRequest = GSignRequest;
})();