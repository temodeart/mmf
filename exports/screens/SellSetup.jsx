/* =========================================================================
   Money Market Fund — Mobile App · Screen: SellSetup
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

const Field = ({ label, value, placeholder, focused }) => (
  <div>
    <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 8, letterSpacing:'0.01em' }}>{label}</div>
    <div style={{
      height: 52, borderRadius: 14,
      background: focused ? '#fff' : '#FAFBFE',
      border: `1.5px solid ${focused ? C.indigo : C.line}`,
      boxShadow: focused ? `0 0 0 4px ${C.indigoSoft}` : 'none',
      padding: '0 16px', display: 'flex', alignItems: 'center',
      color: value ? C.ink : C.muted2, fontSize: 15, fontWeight: 500,
    }}>{value || placeholder}</div>
  </div>
);

// Tiny sparkline

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

const FlowHeader = ({ title, subtitle, badge, right }) => (
  <div style={{ flexShrink: 0, padding: '0 16px 12px 8px' }}>
    <div style={{ height: 56, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
      <button style={{
        width: 40, height: 40, borderRadius: 12, background:'#fff', border:`1px solid ${C.line}`,
        display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke={C.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <div style={{ width: 40, display:'flex', justifyContent:'flex-end' }}>{right}</div>
    </div>
    <div style={{ padding: '0 8px' }}>
      <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.ink, letterSpacing:'-0.02em', fontVariantNumeric:'tabular-nums' }}>{title}</div>
        {badge}
      </div>
      <div style={{ fontSize: 13, color: C.muted, fontWeight: 600, marginTop: 4 }}>{subtitle}</div>
    </div>
  </div>
);

// ---- Section card: titled group of label/value rows ----

const EyebrowLabel = ({ children, color }) => (
  <div style={{ fontSize: 11, fontWeight: 800, color: color || C.muted, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom: 10 }}>{children}</div>
);

// ---- Product summary mini-card ----

const QtyStepper = ({ value, setValue, max, unit = 'ширхэг' }) => {
  const clamp = (n) => Math.max(1, Math.min(max, n || 1));
  const pct = max > 1 ? ((value - 1) / (max - 1)) * 100 : 0;
  const btn = (label, fn, disabled) => (
    <button onClick={disabled ? undefined : fn} style={{
      width: 44, height: 44, borderRadius: 12, flexShrink: 0,
      background: disabled ? '#F4F6FA' : '#fff', border:`1.5px solid ${C.line}`,
      color: disabled ? C.muted2 : C.ink, fontSize: 22, fontWeight: 600,
      display:'flex', alignItems:'center', justifyContent:'center', cursor: disabled ? 'default' : 'pointer',
    }}>{label}</button>
  );
  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
        {btn('–', () => setValue(Math.max(1, value - 1)), value <= 1)}
        <div style={{
          flex: 1, height: 52, borderRadius: 14, background:'#FAFBFE', border:`1.5px solid ${C.line}`,
          display:'flex', alignItems:'center', justifyContent:'center', gap: 6,
        }}>
          <input
            type="text" inputMode="numeric" data-nodrag value={value}
            onChange={(e) => setValue(clamp(parseInt((e.target.value || '').replace(/[^0-9]/g, ''), 10)))}
            style={{
              width: 78, border:'none', background:'transparent', textAlign:'right', outline:'none',
              fontFamily:'inherit', fontSize: 22, fontWeight: 800, color: C.ink, fontVariantNumeric:'tabular-nums',
              padding: 0,
            }}/>
          <span style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>{unit}</span>
        </div>
        {btn('+', () => setValue(Math.min(max, value + 1)), value >= max)}
      </div>
      <div style={{ marginTop: 16 }}>
        <input
          type="range" className="loan-range" min={1} max={max} value={value} data-nodrag
          onChange={(e) => setValue(clamp(parseInt(e.target.value, 10)))}
          style={{ background: `linear-gradient(90deg, ${C.indigo} ${pct}%, ${C.line} ${pct}%)` }}/>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop: 8, fontSize: 11.5, fontWeight: 600, color: C.muted }}>
          <span>1 {unit}</span>
          <span>Дээд: <span style={{ color: C.ink, fontWeight: 700 }}>{max} {unit}</span></span>
        </div>
      </div>
    </div>
  );
};

// ---- Consent checkbox (stateful) ----

const Consent = ({ checked, onToggle, children }) => (
  <div onClick={onToggle} style={{ display:'flex', gap: 12, alignItems:'flex-start', cursor:'pointer', padding: '2px 0' }}>
    <div style={{
      width: 22, height: 22, borderRadius: 7, flexShrink: 0, marginTop: 1,
      background: checked ? C.indigo : '#fff', border:`1.5px solid ${checked ? C.indigo : C.line}`,
      display:'flex', alignItems:'center', justifyContent:'center', transition:'all .15s',
    }}>
      {checked && <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </div>
    <div style={{ fontSize: 12.5, color: C.text, lineHeight: 1.5, fontWeight: 500 }}>{children}</div>
  </div>
);

// TransactionPin is defined in onboarding_v2.jsx and exported to window.
// ReviewScaffold uses it directly as a global.

// ---- Sticky bottom CTA bar ----

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

const ReviewScaffold = ({ children, consentLabel, ctaLabel, ctaTone = C.indigo }) => {
  const [consent, setConsent] = useState(false);
  return (
    <>
      <div style={{ flex: 1, overflow:'auto', padding: '0 24px 16px', display:'flex', flexDirection:'column', gap: 14 }}>
        {children}

        {/* consent */}
        <div style={{ background:'#FAFBFE', borderRadius: 16, padding: 14, border:`1px solid ${C.line2}` }}>
          <Consent checked={consent} onToggle={() => setConsent(c => !c)}>{consentLabel}</Consent>
        </div>

        <div style={{ height: 4 }}/>
      </div>
      <StickyBar>
        <BigBtn tone={ctaTone} disabled={!consent}>{ctaLabel}</BigBtn>
        {!consent && (
          <div style={{ fontSize: 11, color: C.muted2, fontWeight: 600, textAlign:'center', marginTop: 8 }}>
            Зөвшөөрөл өгч үргэлжлүүлнэ үү
          </div>
        )}
      </StickyBar>
    </>
  );
};

// ---- Dedicated PIN-confirmation screen — its own step, kept clean (no order wall above) ----

/* ----- this screen ----- */
const SellSetup = () => {
  const [qty, setQty] = useState(1);
  const [mode, setMode] = useState(0); // 0 percent, 1 price
  const [cond, setCond] = useState(2); // condition index
  const [selOpen, setSelOpen] = useState(false);
  const [sel, setSel] = useState(0);
  const holdings = [
    { ab:'К', c: C.blue,    t:'CAPIT 1450 CD 011226', sub:'Үлдэгдэл [1]' },
    { ab:'Г', c:'#F59E0B',  t:'GOLDH 2300 IT 140427', sub:'Үлдэгдэл [180]' },
    { ab:'М', c: C.indigo,  t:'MSTRT 2400 IT 171126', sub:'Үлдэгдэл [227]' },
  ];
  const cur = holdings[sel];
  const conditions = ['Тухайн өдөр дуусах хүртэл','Заасан өдөр дуусах хүртэл','Нөхцөл биелтэл хүчинтэй'];
  return (
    <Frame label="L3.2 — Sell setup">
      <FlowHeader title="CAPIT 1450 CD" subtitle="Хоёрдогч зах зээлд зарах"/>
      <div style={{ flex: 1, overflow:'auto', padding: '0 24px 16px', display:'flex', flexDirection:'column', gap: 14 }}>
        {/* product selector */}
        <div data-nodrag>
          <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 8 }}>Бүтээгдэхүүн</div>
          <div onClick={() => setSelOpen(o => !o)} style={{ height: 54, borderRadius: 14, background:'#fff', border:`1.5px solid ${selOpen ? C.indigo : C.line}`, boxShadow: selOpen ? `0 0 0 4px ${C.indigoSoft}` : 'none', padding: '0 14px', display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer', transition:'border-color .15s' }}>
            <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: cur.c, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight: 800, fontSize: 12 }}>{cur.ab}</div>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: C.ink, fontVariantNumeric:'tabular-nums' }}>{cur.t} · {cur.sub}</span>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ transform: selOpen ? 'rotate(180deg)' : 'none', transition:'transform .2s' }}><path d="M6 9l6 6 6-6" stroke={C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          {selOpen && (
            <div style={{ marginTop: 8, background:'#fff', borderRadius: 14, border:`1px solid ${C.line2}`, overflow:'hidden', boxShadow:'0 16px 36px -18px rgba(15,20,55,.4)' }}>
              {holdings.map((h, i) => (
                <div key={i} onClick={() => { setSel(i); setQty(1); setSelOpen(false); }} style={{
                  display:'flex', alignItems:'center', gap: 10, padding:'12px 14px', cursor:'pointer',
                  borderTop: i ? `1px solid ${C.line2}` : 'none', background: sel===i ? C.indigoSoft : '#fff',
                }}>
                  <div style={{ width: 30, height: 30, borderRadius: 9, background: h.c, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight: 800, fontSize: 12, flexShrink: 0 }}>{h.ab}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, fontVariantNumeric:'tabular-nums' }}>{h.t}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{h.sub}</div>
                  </div>
                  {sel===i && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0 }}><path d="M5 12l4 4 10-10" stroke={C.indigo} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display:'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <Field label="Нэрлэсэн үнэ" value="100,000 ₮"/>
          </div>
          <div style={{ flex: 1 }}>
            <Field label="Эзэмшиж буй" value="1 ширхэг"/>
          </div>
        </div>

        <div style={{ background:'#fff', borderRadius: 18, border:`1px solid ${C.line2}`, padding: 18 }}>
          <EyebrowLabel>Зарах тоо ширхэг</EyebrowLabel>
          <QtyStepper value={qty} setValue={setQty} max={1}/>
        </div>

        {/* price mode */}
        <div>
          <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 8 }}>Зарах үнэ тогтоох</div>
          <div style={{ display:'flex', gap: 8, marginBottom: 10 }}>
            {['Хувь (%)','Үнэ (₮)'].map((l,i)=>(
              <div key={i} onClick={()=>setMode(i)} style={{
                flex: 1, height: 40, borderRadius: 10, cursor:'pointer',
                background: mode===i ? C.indigoSoft : '#FAFBFE', border:`1.5px solid ${mode===i ? C.indigo : C.line}`,
                display:'flex', alignItems:'center', justifyContent:'center', gap: 8,
                fontSize: 12.5, fontWeight: 700, color: mode===i ? C.indigo : C.muted,
              }}>
                <div style={{ width: 14, height: 14, borderRadius: 999, border:`2px solid ${mode===i ? C.indigo : C.line}`, position:'relative' }}>
                  {mode===i && <div style={{ position:'absolute', inset: 2, borderRadius: 999, background: C.indigo }}/>}
                </div>{l}
              </div>
            ))}
          </div>
          <div style={{ height: 52, borderRadius: 14, background:'#FAFBFE', border:`1.5px solid ${C.line}`, padding: '0 16px', display:'flex', alignItems:'center', justifyContent:'space-between', color: C.ink, fontSize: 18, fontWeight: 800, fontVariantNumeric:'tabular-nums' }}>
            <span>{mode === 0 ? '100.00' : '100,000'}</span>
            <span style={{ color: C.muted, fontSize: 14, fontWeight: 600 }}>{mode === 0 ? '%' : '₮'}</span>
          </div>
        </div>

        {/* condition */}
        <div>
          <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 8 }}>Нөхцөл</div>
          <div style={{ display:'flex', flexDirection:'column', gap: 8 }}>
            {conditions.map((c,i)=>(
              <div key={i} onClick={()=>setCond(i)} style={{
                minHeight: 48, borderRadius: 12, cursor:'pointer', padding: '0 14px',
                background: cond===i ? C.indigoSoft : '#fff', border:`1.5px solid ${cond===i ? C.indigo : C.line}`,
                display:'flex', alignItems:'center', gap: 12,
              }}>
                <div style={{ width: 18, height: 18, borderRadius: 999, border:`2px solid ${cond===i ? C.indigo : C.line}`, position:'relative', flexShrink: 0 }}>
                  {cond===i && <div style={{ position:'absolute', inset: 3, borderRadius: 999, background: C.indigo }}/>}
                </div>
                <span style={{ fontSize: 13, fontWeight: cond===i ? 700 : 600, color: cond===i ? C.ink : C.text }}>{c}</span>
              </div>
            ))}
          </div>
          {cond === 1 && (
            <div style={{ marginTop: 10 }}>
              <div style={{ height: 52, borderRadius: 14, background:'#fff', border:`1.5px solid ${C.indigo}`, boxShadow:`0 0 0 4px ${C.indigoSoft}`, padding: '0 14px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.ink, fontVariantNumeric:'tabular-nums' }}>2026-12-01</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="3" stroke={C.indigo} strokeWidth="2"/><path d="M3 9h18M8 3v4M16 3v4" stroke={C.indigo} strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
            </div>
          )}
        </div>

        {/* helper */}
        <div style={{ background: C.amberSoft, borderRadius: 14, padding: 14, display:'flex', gap: 10 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{flexShrink:0, marginTop:1}}><circle cx="12" cy="12" r="9" stroke={C.amber} strokeWidth="2"/><path d="M12 11v5M12 8h.01" stroke={C.amber} strokeWidth="2.2" strokeLinecap="round"/></svg>
          <div style={{ fontSize: 12, color:'#7A5A1F', lineHeight: 1.5 }}>Таны зарах захиалга хоёрдогч зах зээл дээр байрших бөгөөд худалдан авагч биелүүлсний дараа төлбөр тооцоо хийгдэнэ.</div>
        </div>
        <div style={{ height: 4 }}/>
      </div>
      <StickyBar><BigBtn>Үргэлжлүүлэх</BigBtn></StickyBar>
    </Frame>
  );
};

// ---------- 3.3 — Sell review + PIN ----------

(window.__MMF_SCREENS = window.__MMF_SCREENS || {}).SellSetup = SellSetup;
})();