/* =========================================================================
   Money Market Fund — Mobile App · Screen: CodeEntry
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

/* module aliases (bank_verify.jsx) */
const useStateBV = React.useState;
const useEffectBV = React.useEffect;
const useRefBV = React.useRef;
const CBV = C;
const FrameBV = Frame;
const StickyBarBV = StickyBar;
const BigBtnBV = BigBtn;
const StepHeaderBV = SignupStepHeader;

const BANK_STEP = 8;

const BankStep = ({ title }) => <StepHeaderBV step={BANK_STEP} total={BANK_STEP} title={title}/>;

// Mongolian banks — ORIGINAL monogram tiles (not real bank logos)

const MN_BANKS = [
  { id:'khan',     name:'Хаан Банк',                   short:'Хаан',     ab:'ХААН', c:'#0E7C4A', code:'0005' },
  { id:'golomt',   name:'Голомт банк',                 short:'Голомт',   ab:'ГБ',   c:'#0B5CAB', code:'0015' },
  { id:'tdb',      name:'Худалдаа хөгжлийн банк',      short:'ХХБ',      ab:'ХХБ',  c:'#0A2A6B', code:'0004' },
  { id:'state',    name:'Төрийн банк',                 short:'Төрийн',   ab:'ТБ',   c:'#0E8F8A', code:'0034' },
  { id:'xac',      name:'ХасБанк',                     short:'Хас',      ab:'ХАС',  c:'#E8722B', code:'0030' },
  { id:'capitron', name:'Капитрон банк',               short:'Капитрон', ab:'КБ',   c:'#6E4FB0', code:'0042' },
  { id:'mbank',    name:'М банк',                       short:'М банк',   ab:'М',    c:'#C0392B', code:'0050' },
  { id:'bogd',     name:'Богд банк',                   short:'Богд',     ab:'ББ',   c:'#3B4FB0', code:'0026' },
  { id:'arig',     name:'Ариг банк',                   short:'Ариг',     ab:'АБ',   c:'#1F8A5B', code:'0021' },
];

// Shared facts for the micro-deposit verification (mock).

const VBANK   = MN_BANKS[0];   // Хаан Банк (selected in B1)

const VCODE   = '482715';      // the value printed in гүйлгээний утга

const VAMOUNT = '10.00';       // the small incoming deposit

const fmtCd = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

// ---- monogram tile ----

const StatementHint = () => (
  <div style={{ marginTop: 4 }}>
    <div style={{ fontSize: 11.5, fontWeight: 700, color: CBV.muted, marginBottom: 8, display:'flex', alignItems:'center', gap: 6 }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="3" stroke={CBV.muted2} strokeWidth="2"/><path d="M3 9h18" stroke={CBV.muted2} strokeWidth="2"/></svg>
      Банкны аппд ингэж харагдана
    </div>
    <div style={{ borderRadius: 16, background:'#fff', border:`1px solid ${CBV.line2}`, overflow:'hidden', boxShadow:'0 10px 26px -18px rgba(15,20,55,.3)' }}>
      <div style={{ display:'flex', alignItems:'center', gap: 12, padding:'13px 14px' }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: CBV.greenSoft, display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M17 7L8 16" stroke={CBV.green} strokeWidth="2.2" strokeLinecap="round"/><path d="M15 16H8V9" stroke={CBV.green} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: CBV.ink }}>Орлого</div>
          <div style={{ fontSize: 11.5, color: CBV.muted, marginTop: 2 }}>{VBANK.short} · 14:32</div>
        </div>
        <div style={{ fontSize: 14, fontWeight: 800, color: CBV.green, fontVariantNumeric:'tabular-nums' }}>+{VAMOUNT}₮</div>
      </div>
      <div style={{ height: 1, background: CBV.line2 }}/>
      <div style={{ padding:'12px 14px', background:'#FAFBFE' }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: CBV.muted2, marginBottom: 8, textTransform:'uppercase', letterSpacing:'0.06em' }}>Гүйлгээний утга</div>
        <div style={{ display:'flex', alignItems:'center', gap: 8, flexWrap:'wrap' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: CBV.ink2, fontFamily:'JetBrains Mono, monospace' }}>MMF·</span>
          <span style={{ fontSize: 15, fontWeight: 800, color:'#fff', background: CBV.indigo, padding:'5px 11px', borderRadius: 9, fontFamily:'JetBrains Mono, monospace', letterSpacing:'0.14em', boxShadow:`0 0 0 3px ${CBV.indigoSoft}` }}>{VCODE}</span>
          <span style={{ fontSize: 11, fontWeight: 800, color: CBV.indigo, display:'inline-flex', alignItems:'center', gap: 3 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M11 6L5 12l6 6" stroke={CBV.indigo} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 12h14" stroke={CBV.indigo} strokeWidth="2.4" strokeLinecap="round"/></svg>
            энэ код
          </span>
        </div>
      </div>
    </div>
  </div>
);

// 6-box OTP-style entry (reuses the onboarding OTP look — transparent input overlay)

const CodeBoxes = ({ value, state, onFocus }) => {
  const next = value.length;
  return (
    <div style={{ position:'relative' }}>
      <div style={{ display:'flex', gap: 8, pointerEvents:'none' }}>
        {[0,1,2,3,4,5].map((i) => {
          const d = value[i] || '';
          const cursor = state !== 'success' && i === next;
          const border = state === 'error' ? CBV.red
            : state === 'success' ? CBV.green
            : d ? CBV.indigo : cursor ? CBV.indigo : CBV.line;
          const ring = state === 'error' ? `0 0 0 3px ${CBV.redSoft}`
            : (cursor && state !== 'success') ? `0 0 0 3px ${CBV.indigoSoft}` : 'none';
          return (
            <div key={i} style={{
              flex: 1, height: 56, borderRadius: 12, background:'#fff',
              border: `1.5px solid ${border}`, boxShadow: ring,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize: 24, fontWeight: 700, color: state === 'error' ? CBV.red : CBV.ink,
              fontVariantNumeric:'tabular-nums', transition:'border-color .15s, box-shadow .15s',
            }}>{d}</div>
          );
        })}
      </div>
    </div>
  );
};

/* ----- this screen ----- */
const CodeEntry = ({ seed, label = 'B4 — Баталгаажуулах код' }) => {
  const inputRef = useRefBV(null);
  const [val, setVal]       = useStateBV(seed?.value ?? '');
  const [phase, setPhase]   = useStateBV(seed?.phase ?? 'idle');   // idle | error | success
  const [attempts, setAtt]  = useStateBV(seed?.attempts ?? 3);
  const [cd, setCd]         = useStateBV(seed?.cd ?? 90);
  const [resent, setResent] = useStateBV(false);

  // resend cooldown ticker
  useEffectBV(() => {
    const t = setInterval(() => setCd(c => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const onInput = (e) => {
    const v = e.target.value.replace(/\D/g, '').slice(0, 6);
    setVal(v);
    if (phase === 'error' || phase === 'success') setPhase('idle');
  };
  const verify = () => {
    if (val.length < 6 || phase === 'success') return;
    if (val === VCODE) setPhase('success');
    else { setPhase('error'); setAtt(a => Math.max(0, a - 1)); setVal(''); }
  };
  const resend = () => {
    if (cd > 0) return;
    setResent(true); setCd(90);
    setTimeout(() => setResent(false), 2400);
  };

  const full    = val.length === 6;
  const success = phase === 'success';
  const error   = phase === 'error';

  return (
    <FrameBV label={label}>
      <BankStep title="Данс баталгаажуулах"/>
      <div style={{ flex: 1, overflow:'auto', padding:'14px 24px 18px' }}>
        <div style={{ fontSize: 21, fontWeight: 800, color: CBV.ink, letterSpacing:'-0.02em', lineHeight: 1.2 }}>Баталгаажуулах код</div>
        <div style={{ fontSize: 13, color: CBV.muted, marginTop: 9, lineHeight: 1.5 }}>
          Банкны дансанд ирсэн гүйлгээний утгад байгаа <strong style={{ color: CBV.text }}>6 оронтой кодыг</strong> оруулна уу.
        </div>

        <div style={{ marginTop: 16 }}><StatementHint/></div>

        {/* OTP-style entry */}
        <div style={{ marginTop: 22, position:'relative' }} onClick={() => inputRef.current && inputRef.current.focus()}>
          <input
            ref={inputRef} value={val} onChange={onInput}
            inputMode="numeric" maxLength={6} aria-label="Баталгаажуулах код"
            style={{ position:'absolute', inset: 0, width:'100%', height:'100%', opacity: 0, border:'none', background:'transparent', cursor:'pointer', fontSize: 16, zIndex: 2 }}
          />
          <CodeBoxes value={val} state={phase}/>
        </div>

        {error && (
          <div style={{ marginTop: 12, display:'flex', alignItems:'center', gap: 7, fontSize: 12.5, fontWeight: 700, color: CBV.red }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={CBV.red} strokeWidth="2"/><path d="M12 7.5v5.5M12 16.5h.01" stroke={CBV.red} strokeWidth="2.2" strokeLinecap="round"/></svg>
            Код буруу байна. Үлдсэн оролдлого: {attempts}
          </div>
        )}
        {success && (
          <div style={{ marginTop: 12, display:'flex', alignItems:'center', gap: 7, fontSize: 12.5, fontWeight: 700, color: CBV.green }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke={CBV.green} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Код зөв байна
          </div>
        )}

        {/* resend with cooldown */}
        <div style={{ marginTop: 22, display:'flex', alignItems:'center', justifyContent:'center', gap: 7, fontSize: 12.5 }}>
          {resent ? (
            <span style={{ display:'inline-flex', alignItems:'center', gap: 7, color: CBV.indigo, fontWeight: 700 }}>
              <span className="omf-spin" style={{ width: 13, height: 13, borderRadius: 999, border:`2px solid ${CBV.indigoSoft}`, borderTopColor: CBV.indigo }}/>
              Гүйлгээ дахин илгээгдэж байна…
            </span>
          ) : (
            <>
              <span style={{ color: CBV.muted, fontWeight: 600 }}>Гүйлгээ ирээгүй юу?</span>
              {cd > 0 ? (
                <span style={{ color: CBV.muted2, fontWeight: 700, fontVariantNumeric:'tabular-nums' }}>Дахин илгээх · {fmtCd(cd)}</span>
              ) : (
                <button onClick={resend} style={{ background:'transparent', border:'none', padding: 0, cursor:'pointer', color: CBV.indigo, fontWeight: 800, fontSize: 12.5, fontFamily:'inherit' }}>Гүйлгээ дахин илгээх</button>
              )}
            </>
          )}
        </div>
      </div>

      <StickyBarBV>
        {success ? (
          <BigBtnBV tone={CBV.green}>
            Үргэлжлүүлэх
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </BigBtnBV>
        ) : (
          <BigBtnBV disabled={!full} onClick={verify}>Баталгаажуулах</BigBtnBV>
        )}
      </StickyBarBV>
    </FrameBV>
  );
};

// ============================================================
// B4 — VERIFIED (success + summary)
// ============================================================

(window.__MMF_SCREENS = window.__MMF_SCREENS || {}).CodeEntry = CodeEntry;
})();