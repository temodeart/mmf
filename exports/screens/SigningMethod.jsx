/* =========================================================================
   Money Market Fund — Mobile App · Screen: SigningMethod
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

const Dot = ({ color }) => (
  <span style={{ display:'inline-block', width:6, height:6, borderRadius:999, background: color }}/>
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
const SigningMethod = () => (
  <Frame label="14 — Signing method">
    <SignupStepHeader step={8} total={TOTAL_STEPS} title="Гарын үсэг зурах"/>
    <div style={{ flex: 1, overflow:'auto', padding: '16px 24px 24px' }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: C.ink, letterSpacing:'-0.02em', lineHeight: 1.18 }}>
        Гэрээгээ хэрхэн<br/>баталгаажуулах вэ?
      </div>
      <div style={{ fontSize: 13, color: C.muted, marginTop: 10, lineHeight: 1.5 }}>
        Хоёр аргын алинаар ч гэрээ хүчинтэй. Эрхийн хүрээ нь ялгаатай.
      </div>

      {/* G-Sign — recommended, full access */}
      <div style={{
        marginTop: 18, borderRadius: 20, padding: 18, position:'relative',
        background:'#fff', border:`2px solid ${C.green}`,
        boxShadow:'0 10px 30px -16px rgba(14,159,110,.5)',
      }}>
        <div style={{ position:'absolute', top:-11, right: 18, padding:'4px 10px', borderRadius: 999, background: C.green, color:'#fff', fontSize: 10, fontWeight: 800, letterSpacing:'0.04em' }}>САНАЛ БОЛГОХ</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <GSignLogo size={34}/>
          <span style={{ display:'inline-flex', alignItems:'center', gap: 5, padding:'4px 10px', borderRadius: 999, background: C.greenSoft, color: C.green, fontSize: 10, fontWeight: 800 }}>
            <Dot color={C.green}/>Бүх үйлчилгээ нээгдэнэ
          </span>
        </div>
        <div style={{ fontSize: 16, fontWeight: 800, color: C.ink, marginTop: 14, letterSpacing:'-0.01em' }}>G-Sign</div>
        <div style={{ fontSize: 12.5, color: C.muted, marginTop: 4, lineHeight: 1.5 }}>Төрийн G-Sign апп ашиглан гэрээг баталгаажуулна.</div>
        <div style={{ fontSize: 12.5, color: C.text, marginTop: 10, lineHeight: 1.55 }}>
          G-Sign ашигласнаар <strong style={{ color: C.ink }}>Итгэлцлийн үйлчилгээ</strong> зэрэг бүх бүтээгдэхүүн ашиглах боломжтой болно.
        </div>
        <button style={{
          width:'100%', height: 48, borderRadius: 14, marginTop: 14,
          background: C.indigo, color:'#fff', border:'none', fontWeight: 700, fontSize: 14, cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center', gap: 8, boxShadow:'0 8px 20px -8px rgba(79,70,229,.45)',
        }}>
          G-Sign ашиглах
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      {/* Electronic signature — limited */}
      <div style={{ marginTop: 14, borderRadius: 20, padding: 18, background:'#fff', border:`1px solid ${C.line}` }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: C.indigoSoft, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 18c3-1 4-9 6-9s2 6 4 6 2-4 4-4" stroke={C.indigo} strokeWidth="2" fill="none" strokeLinecap="round"/><path d="M4 21h16" stroke={C.indigo} strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.ink, letterSpacing:'-0.01em' }}>Цахим гарын үсэг</div>
          </div>
          <span style={{ display:'inline-flex', alignItems:'center', gap: 5, padding:'4px 10px', borderRadius: 999, background: C.amberSoft, color: C.amber, fontSize: 10, fontWeight: 800 }}>
            <Dot color={C.amber}/>Хязгаарлагдмал
          </span>
        </div>
        <div style={{ fontSize: 12.5, color: C.muted, marginTop: 10, lineHeight: 1.5 }}>Дэлгэц дээр хуруугаараа зурж гэрээг баталгаажуулна.</div>
        <div style={{ fontSize: 12.5, color: C.text, marginTop: 10, lineHeight: 1.55 }}>
          Энэ сонголтоор ихэнх бүтээгдэхүүн нээгдэх боловч <strong style={{ color: C.ink }}>Итгэлцлийн үйлчилгээ</strong> ашиглах боломжгүй.
        </div>
        <button style={{
          width:'100%', height: 48, borderRadius: 14, marginTop: 14,
          background:'#fff', color: C.ink, border:`1.5px solid ${C.line}`, fontWeight: 700, fontSize: 14, cursor:'pointer',
        }}>
          Цахимаар зурах
        </button>
      </div>

      <button style={{
        width:'100%', height: 46, marginTop: 14, borderRadius: 14, background:'transparent',
        color: C.indigo, border:'none', fontWeight: 700, fontSize: 13.5, cursor:'pointer',
        display:'flex', alignItems:'center', justifyContent:'center', gap: 8,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={C.indigo} strokeWidth="2" fill="none"/><path d="M12 16v-4M12 8.5h.01" stroke={C.indigo} strokeWidth="2" strokeLinecap="round"/></svg>
        G-Sign хэрхэн ашиглах вэ?
      </button>
    </div>
  </Frame>
);

// ============================================================
// 15 — ELECTRONIC SIGNATURE CANVAS  [NEW · interactive pad]
// ============================================================

(window.__MMF_SCREENS = window.__MMF_SCREENS || {}).SigningMethod = SigningMethod;
})();