/* =========================================================================
   Money Market Fund — Mobile App · Screen: CreatePin
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

const PinDots = ({ count, error }) => (
  <div style={{ display:'flex', gap: 16, justifyContent:'center' }}>
    {[0,1,2,3].map(i => (
      <div key={i} style={{
        width: 16, height: 16, borderRadius: 999,
        background: i < count ? (error ? C.red : C.indigo) : 'transparent',
        border: `2px solid ${i < count ? (error ? C.red : C.indigo) : C.line}`,
        transition:'all .12s',
      }}/>
    ))}
  </div>
);

const KP_LETTERS = { '2':'ABC', '3':'DEF', '4':'GHI', '5':'JKL', '6':'MNO', '7':'PQRS', '8':'TUV', '9':'WXYZ' };

const Keypad = ({ onKey, onDel }) => {
  const Digit = ({ n }) => (
    <button onClick={()=>onKey(n)} style={{
      width: 78, height: 78, borderRadius: '50%', border: 'none', cursor: 'pointer',
      background: 'rgba(120,120,128,0.16)',
      fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1,
      WebkitTapHighlightColor: 'transparent',
    }}>
      <span style={{ fontSize: 33, fontWeight: 400, color: C.ink, lineHeight: 1 }}>{n}</span>
      {KP_LETTERS[n] && <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', color: C.muted, marginLeft: '0.18em' }}>{KP_LETTERS[n]}</span>}
    </button>
  );
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 78px)', columnGap: 26, rowGap: 16, justifyContent:'center' }}>
      {['1','2','3','4','5','6','7','8','9'].map(n => <Digit key={n} n={n}/>)}
      <div/>
      <Digit n="0"/>
      <button onClick={onDel} style={{
        width: 78, height: 78, borderRadius: '50%', border:'none', background:'transparent', cursor:'pointer',
        display:'flex', alignItems:'center', justifyContent:'center', WebkitTapHighlightColor: 'transparent',
      }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M9 5h11a1 1 0 011 1v12a1 1 0 01-1 1H9l-6-7 6-7z" stroke={C.ink} strokeWidth="1.6" strokeLinejoin="round"/><path d="M13 10l4 4M17 10l-4 4" stroke={C.ink} strokeWidth="1.6" strokeLinecap="round"/></svg>
      </button>
    </div>
  );
};

/* ----- this screen ----- */
const CreatePin = () => {
  const [stage, setStage] = useState('create'); // create | confirm | done
  const [pin, setPin] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState(false);

  const active = stage === 'create' ? pin : confirm;
  const setActive = (v) => { stage === 'create' ? setPin(v) : setConfirm(v); };

  const onKey = (n) => {
    if (stage === 'done') return;
    if (active.length >= 4) return;
    const next = active + n;
    if (stage === 'create') {
      setPin(next);
      if (next.length === 4) setTimeout(() => setStage('confirm'), 180);
    } else {
      setError(false);
      setConfirm(next);
      if (next.length === 4) {
        setTimeout(() => {
          if (next === pin) setStage('done');
          else { setError(true); setConfirm(''); }
        }, 180);
      }
    }
  };
  const onDel = () => setActive(active.slice(0, -1));

  const title = stage === 'create' ? '4 оронтой PIN код оруулна уу'
    : stage === 'confirm' ? 'PIN кодоо давтан оруулна уу'
    : 'PIN код амжилттай үүслээ';

  return (
    <Frame label="08B — Transaction PIN">
      <SignupStepHeader step={4} total={TOTAL_STEPS} title="Гүйлгээний PIN код" nextLabel="Танин баталгаажуулалт"/>
      <div style={{ flex: 1, overflow:'auto', padding: '14px 24px 20px', display:'flex', flexDirection:'column' }}>
        <div style={{ fontSize: 21, fontWeight: 800, color: C.ink, letterSpacing:'-0.02em', lineHeight: 1.18 }}>Гүйлгээний PIN код үүсгэх</div>
        <div style={{ fontSize: 12.5, color: C.muted, marginTop: 8, lineHeight: 1.5 }}>
          Худалдан авах, зарах, мөнгө татах зэрэг санхүүгийн үйлдлийг баталгаажуулахад ашиглана.
        </div>

        <div style={{ flex: 1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', paddingTop: 8 }}>
          {stage === 'done' ? (
            <>
              <div style={{ width: 76, height: 76, borderRadius: 24, background:`linear-gradient(135deg, #1F8A5B, ${C.green})`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 14px 30px -10px ${C.green}88` }}>
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.ink, marginTop: 18 }}>PIN код амжилттай үүслээ</div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 14, fontWeight: 700, color: error ? C.red : C.text, marginBottom: 22, textAlign:'center' }}>{error ? 'PIN код таарсангүй. Дахин оруулна уу' : title}</div>
              <PinDots count={active.length} error={error}/>
            </>
          )}
        </div>

        {stage !== 'done' && <Keypad onKey={onKey} onDel={onDel}/>}
      </div>
      <FooterCTA onClick={stage === 'done' ? ()=>{} : undefined}>
        <span style={{ opacity: stage === 'done' ? 1 : .6 }}>Үргэлжлүүлэх</span>
      </FooterCTA>
    </Frame>
  );
};

// ============================================================
// TRANSACTION PIN — reusable 4-digit entry component
// States: idle · filling (1-4 dots) · error (shake+red) · locked · done
// Demo: attempt 1 = wrong; attempt 2 = correct; attempt 3 = locked
// ============================================================

(window.__MMF_SCREENS = window.__MMF_SCREENS || {}).CreatePin = CreatePin;
})();