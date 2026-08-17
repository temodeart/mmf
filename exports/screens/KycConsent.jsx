/* =========================================================================
   Money Market Fund — Mobile App · Screen: KycConsent
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

const SignupStepHeader = ({ step, total = 3, title, nextLabel }) => {
  const pct = Math.round((step / total) * 100);
  return (
    <div style={{ flexShrink: 0 }}>
      <div style={{ height: 56, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 16px 0 8px' }}>
        <button style={{ width: 40, height: 40, borderRadius: 12, background:'#fff', border:`1px solid ${C.line}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke={C.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.ink, letterSpacing:'-0.01em' }}>{title}</div>
        <div style={{ width: 40 }}/>
      </div>
      {/* progress */}
      <div style={{ padding: '0 24px' }}>
        <div style={{ height: 6, borderRadius: 999, background: '#F0F2F8', overflow:'hidden' }}>
          <div style={{
            width: `${pct}%`, height:'100%', borderRadius: 999,
            background: `linear-gradient(90deg, ${C.orange}, #FF8B4F)`,
            transition: 'width .35s',
          }}/>
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop: 10 }}>
          <div style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>
            <span style={{ color: C.ink, fontWeight: 700 }}>Алхам {step} / {total}</span>
            {nextLabel && <span style={{ color: C.muted2 }}> · Дараагийн: {nextLabel}</span>}
          </div>
          <div style={{
            background: C.orange, color:'#fff',
            padding: '3px 10px', borderRadius: 999,
            fontSize: 11, fontWeight: 800, letterSpacing:'-0.01em', fontVariantNumeric:'tabular-nums',
          }}>{pct} %</div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// 06 — SIGN UP · Step 1 / 3 — Phone + OTP + Password
// ============================================================

const DanLogo = ({ size = 56 }) => (
  // Simplified DAN brand mark — blue gradient text
  <svg width={size*2.4} height={size} viewBox="0 0 144 60" fill="none">
    <defs>
      <linearGradient id="dang" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor="#5BA9F5"/>
        <stop offset="100%" stopColor="#1F3A8A"/>
      </linearGradient>
    </defs>
    <text x="0" y="48" fontFamily="Manrope, sans-serif" fontWeight="800" fontSize="52" fill="url(#dang)" letterSpacing="-2">DAN</text>
    {/* small chevron accent on the A */}
    <path d="M58 38 L66 26 L74 38" stroke="url(#dang)" strokeWidth="3" fill="none" strokeLinecap="round"/>
  </svg>
);

const OTP = () => {
  const digits = ['4','7','2','1','',''];
  return (
    <Frame label="06 — OTP / Verification">
      <BackBar title=""/>
      <div style={{ flex: 1, padding: '8px 24px', display:'flex', flexDirection:'column' }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16, background: C.indigoSoft,
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M4 8l8 5 8-5" stroke={C.indigo} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="3" y="5" width="18" height="14" rx="2" stroke={C.indigo} strokeWidth="2" fill="none"/></svg>
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.ink, marginTop: 18, letterSpacing:'-0.02em', lineHeight:1.1 }}>
          Баталгаажуулах код
        </div>
        <div style={{ fontSize: 14, color: C.muted, marginTop: 10, lineHeight:1.5 }}>
          Бид таны утсанд илгээсэн 6 оронтой кодыг доор оруулна уу.
        </div>

        <div style={{ display:'flex', gap: 10, marginTop: 32 }}>
          {digits.map((d, i) => (
            <div key={i} style={{
              flex: 1, height: 60, borderRadius: 14,
              background: '#fff',
              border: `1.5px solid ${d ? C.indigo : (i === digits.findIndex(x => !x) ? C.indigo : C.line)}`,
              boxShadow: (!d && i === digits.findIndex(x => !x)) ? `0 0 0 4px ${C.indigoSoft}` : 'none',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize: 24, fontWeight: 700, color: C.ink, fontVariantNumeric:'tabular-nums',
            }}>{d}</div>
          ))}
        </div>

        <div style={{ marginTop: 24, fontSize: 14, color: C.muted, textAlign:'center' }}>
          Код хүлээж аваагүй юу? <span style={{ color: C.indigo, fontWeight: 700 }}>Дахин илгээх</span>
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: C.muted2, textAlign:'center', fontVariantNumeric:'tabular-nums' }}>
          00:42 хүрэхэд дахин илгээх боломжтой
        </div>

        <div style={{ flex: 1 }}/>

        <div style={{ paddingBottom: 16 }}>
          <PillBtn primary full>Баталгаажуулах</PillBtn>
        </div>
      </div>
    </Frame>
  );
};

// ============================================================
// LOGIN — Phone + Password + Biometric toggle + Forgot
// ============================================================

const TOTAL_STEPS = 8;

// ----- Small shared helpers for this flow -----

// 6-box OTP row with a couple of digits filled + resend timer

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

/* ----- this screen ----- */
const KycConsent = () => {
  const perms = [
    { t:'Иргэний үнэмлэхний мэдээлэл', icon:(
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2.5" stroke={C.indigo} strokeWidth="2" fill="none"/><circle cx="8.5" cy="11" r="2" stroke={C.indigo} strokeWidth="2" fill="none"/><path d="M13 9.5h5M13 13h3.5" stroke={C.indigo} strokeWidth="2" strokeLinecap="round"/></svg>
    )},
    { t:'Иргэний бүртгэлтэй хаяг', icon:(
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z" stroke={C.indigo} strokeWidth="2" fill="none" strokeLinejoin="round"/><circle cx="12" cy="10" r="2.4" stroke={C.indigo} strokeWidth="2" fill="none"/></svg>
    )},
    { t:'Өмчлөлд байгаа хөрөнгийн мэдээлэл', icon:(
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 10l8-6 8 6" stroke={C.indigo} strokeWidth="2" strokeLinejoin="round" fill="none"/><path d="M6 10v9h12v-9M10 19v-5h4v5" stroke={C.indigo} strokeWidth="2" strokeLinejoin="round" fill="none"/></svg>
    )},
    { t:'Нийгмийн даатгалын шимтгэл төлөлт', icon:(
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="13" rx="2.5" stroke={C.indigo} strokeWidth="2" fill="none"/><path d="M3 10h18" stroke={C.indigo} strokeWidth="2"/><path d="M7 15h4" stroke={C.indigo} strokeWidth="2" strokeLinecap="round"/></svg>
    )},
    { t:'Гэрлэлтийн байдал', icon:(
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="8.5" cy="9" r="3" stroke={C.indigo} strokeWidth="2" fill="none"/><circle cx="15.5" cy="9" r="3" stroke={C.indigo} strokeWidth="2" fill="none"/><path d="M5.5 19c0-2.5 1.5-4 3-4M18.5 19c0-2.5-1.5-4-3-4" stroke={C.indigo} strokeWidth="2" strokeLinecap="round"/></svg>
    )},
  ];
  return (
    <Frame label="09 — KYC · ДАН">
      <SignupStepHeader step={5} total={TOTAL_STEPS} title="Танин баталгаажуулалт" nextLabel="Үйлчилгээний нөхцөл"/>
      <div style={{ flex: 1, overflow:'auto', padding: '18px 24px 24px' }}>
        {/* ДАН brand panel */}
        <div style={{
          borderRadius: 22, padding: '26px 24px',
          background: 'linear-gradient(160deg, #EAF3FF 0%, #F4F8FF 60%, #FFFFFF 100%)',
          border:`1px solid #DCE9FB`, textAlign:'center', position:'relative', overflow:'hidden',
        }}>
          <div style={{ position:'absolute', inset:0, opacity:.5, background:'radial-gradient(circle at 50% 0%, rgba(31,58,138,.15), transparent 60%)'}}/>
          <div style={{ position:'relative', display:'flex', flexDirection:'column', alignItems:'center', gap: 12 }}>
            <DanLogo size={40}/>
            <div style={{ display:'flex', alignItems:'center', gap: 8, fontSize: 12, fontWeight: 700, color:'#1F3A8A' }}>
              <span style={{ padding:'4px 10px', borderRadius: 999, background:'#fff', border:'1px solid #DCE9FB' }}>ДАН систем</span>
            </div>
          </div>
        </div>

        <div style={{ fontSize: 22, fontWeight: 800, color: C.ink, marginTop: 22, letterSpacing:'-0.02em', lineHeight: 1.2 }}>
          Танин баталгаажуулалт
        </div>
        <div style={{ fontSize: 13, color: C.text, marginTop: 10, lineHeight: 1.55 }}>
          Таны зөвшөөрлөөр ДАН системээс шаардлагатай мэдээллийг татаж баталгаажуулна. Аппликейшнд хуваалцах мэдээллээ ДАН системийн баталгаажуулах хуудсан дээр харах болно.
        </div>
      </div>
      <FooterCTA dark>
        ДАН-аар баталгаажуулах
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </FooterCTA>
    </Frame>
  );
};

// ============================================================
// 10 — MONPEP AUTOMATIC CHECK · processing  [NEW]
// ============================================================

(window.__MMF_SCREENS = window.__MMF_SCREENS || {}).KycConsent = KycConsent;
})();