/* =========================================================================
   Money Market Fund — Mobile App · Screen: SellPin
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

const TransactionPin = ({ onFilled }) => {
  const [digits, setDigits] = useState('');
  const [phase, setPhase] = useState('idle');
  const [failCount, setFailCount] = useState(0);
  const [shaking, setShaking] = useState(false);
  const MAX_FAILS = 3;

  const onKey = (n) => {
    if (phase === 'locked' || phase === 'done') return;
    if (phase === 'error') { setPhase('filling'); setDigits(n); return; }
    if (digits.length >= 4) return;
    const next = digits + n;
    setDigits(next);
    setPhase('filling');
    if (next.length === 4) {
      setTimeout(() => {
        if (failCount === 0) {
          setFailCount(1);
          setShaking(true);
          setPhase('error');
          setDigits('');
          setTimeout(() => setShaking(false), 450);
        } else if (failCount + 1 >= MAX_FAILS) {
          setFailCount(f => f + 1);
          setPhase('locked');
        } else {
          setPhase('done');
          onFilled && onFilled();
        }
      }, 180);
    }
  };

  const onDel = () => {
    if (phase === 'locked' || phase === 'done') return;
    if (phase === 'error') { setPhase('idle'); setDigits(''); return; }
    const next = digits.slice(0, -1);
    setDigits(next);
    setPhase(next.length > 0 ? 'filling' : 'idle');
  };

  const isError  = phase === 'error';
  const isDone   = phase === 'done';
  const isLocked = phase === 'locked';
  const filledCount  = isDone ? 4 : digits.length;
  const remAttempts  = MAX_FAILS - failCount;

  if (isLocked) {
    return (
      <div style={{ textAlign:'center', padding:'8px 0' }}>
        <div style={{ display:'flex', gap: 16, justifyContent:'center', marginBottom: 14 }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{ width:14, height:14, borderRadius:999, background:C.red, border:`2px solid ${C.red}`, transition:'all .12s' }}/>
          ))}
        </div>
        <div style={{ width:52, height:52, borderRadius:16, background:C.redSoft, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke={C.red} strokeWidth="2"/><path d="M8 11V8a4 4 0 018 0v3" stroke={C.red} strokeWidth="2"/></svg>
        </div>
        <div style={{ fontSize:14, fontWeight:800, color:C.red }}>ПИН код хаагдлаа</div>
        <div style={{ fontSize:12, color:C.muted, marginTop:6, fontWeight:600, lineHeight:1.4 }}>30 минутаас хойш дахин оролдоно уу.</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display:'flex', gap:16, justifyContent:'center', marginBottom:14,
        animation: shaking ? 'omf-pin-shake .4s ease' : 'none' }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            width:14, height:14, borderRadius:999,
            background: i < filledCount ? (isError ? C.red : C.indigo) : 'transparent',
            border: `2px solid ${i < filledCount ? (isError ? C.red : C.indigo) : C.line}`,
            transition: 'all .12s',
          }}/>
        ))}
      </div>
      {isError && (
        <div style={{ fontSize:12, color:C.red, fontWeight:700, textAlign:'center', marginBottom:14 }}>
          ПИН код буруу байна. Үлдсэн оролдлого: {remAttempts}
        </div>
      )}
      {isDone && (
        <div style={{ fontSize:12, color:C.green, fontWeight:700, textAlign:'center', marginBottom:14 }}>✓ Баталгаажлаа</div>
      )}
      <Keypad onKey={onKey} onDel={onDel}/>
    </div>
  );
};

// ============================================================
// 08C — BIOMETRIC SETUP (optional, after PIN)  [NEW]
// ============================================================

const StickyBar = ({ children }) => (
  <div style={{ padding: '12px 24px 6px', background:'#fff', borderTop:`1px solid ${C.line2}`, flexShrink: 0 }}>
    {children}
  </div>
);

const BigBtn = ({ children, tone = C.indigo, disabled, onClick, ghost }) => (
  <button onClick={disabled ? undefined : onClick} style={{
    width:'100%', height: 52, borderRadius: 14, border: ghost ? `1.5px solid ${C.line}` : 'none',
    background: ghost ? '#fff' : (disabled ? '#C9CEDD' : tone),
    color: ghost ? C.ink : '#fff', fontWeight: 700, fontSize: 15, letterSpacing:'-0.01em',
    cursor: disabled ? 'default' : 'pointer',
    display:'flex', alignItems:'center', justifyContent:'center', gap: 8,
    boxShadow: (disabled || ghost) ? 'none' : `0 8px 22px -8px ${tone}80`,
    transition:'background .15s',
  }}>{children}</button>
);

// ---- Review scaffold: scroll body + consent + PIN + sticky enable-gated CTA ----

const PinConfirm = ({ label, title = 'Гүйлгээний ПИН код', heading = 'ПИН кодоо оруулна уу', subtitle, amount, amountLabel = 'Гүйлгээний дүн', ctaLabel = 'Баталгаажуулах', ctaTone = C.indigo }) => {
  const [pinFilled, setPinFilled] = useState(false);
  return (
    <Frame label={label}>
      <BackBar title={title}/>
      <div style={{ flex: 1, overflow:'auto', padding: '4px 24px 16px', display:'flex', flexDirection:'column' }}>
        <div style={{ fontSize: 21, fontWeight: 800, color: C.ink, letterSpacing:'-0.02em', lineHeight: 1.2 }}>{heading}</div>
        {subtitle && <div style={{ fontSize: 12.5, color: C.muted, marginTop: 8, lineHeight: 1.5 }}>{subtitle}</div>}
        {amount && (
          <div style={{ marginTop: 16, background:'#FAFBFE', borderRadius: 16, border:`1px solid ${C.line2}`, padding:'14px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', gap: 12 }}>
            <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 600 }}>{amountLabel}</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: C.ink, fontVariantNumeric:'tabular-nums', letterSpacing:'-0.01em' }}>{amount}</span>
          </div>
        )}
        <div style={{ flex: 1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', paddingTop: 12, minHeight: 12 }}>
          <TransactionPin onFilled={() => setPinFilled(true)}/>
        </div>
      </div>
      <StickyBar>
        <BigBtn tone={ctaTone} disabled={!pinFilled}>{ctaLabel}</BigBtn>
        {!pinFilled && (
          <div style={{ fontSize: 11, color: C.muted2, fontWeight: 600, textAlign:'center', marginTop: 8 }}>
            ПИН кодоо оруулж баталгаажуулна уу
          </div>
        )}
      </StickyBar>
    </Frame>
  );
};

// ---- Success screen template ----

/* ----- this screen ----- */
const SellPin = () => (
  <PinConfirm
    label="L3.3b — Sell · PIN"
    subtitle="Хоёрдогч зах зээлд зарах захиалгыг баталгаажуулна уу."
    amount="99,750.00 ₮"
    amountLabel="Таны авах дүн"
    ctaLabel="Зарах захиалга үүсгэх"
  />
);

// ---------- 3.4 — Sell listing success ----------

(window.__MMF_SCREENS = window.__MMF_SCREENS || {}).SellPin = SellPin;
})();