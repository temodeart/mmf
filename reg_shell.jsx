// reg_shell.jsx — MMF Web · Registration wizard shell (shared by all step files)
// Exports: T (re-export), STEPS, DONE_THROUGH, LogoWedge, DanLogo, StepRail,
//          StepCard, StepStub, CodeBoxes (generic OTP/PIN box row)
// Load AFTER comp_atoms.jsx, BEFORE any reg_step*.jsx file.

const T = window.T;

const LogoWedge = ({ size = 34 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path d="M9.6 11.4V28.6L0 34.4V0h9.9L24 8.4 38.1 0H48v5.6L24 20 9.6 11.4z" fill="#FF6B2C"/>
    <path d="M38.4 36.6V19.4L48 13.6V48h-9.9L24 39.6 9.9 48H0v-5.6L24 28l14.4 8.6z" fill="#2D6BFF"/>
  </svg>
);

const DanLogo = ({ size = 44 }) => (
  <svg width={size * 2.4} height={size} viewBox="0 0 144 60" fill="none">
    <defs>
      <linearGradient id="dang" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor="#5BA9F5"/>
        <stop offset="100%" stopColor="#1F3A8A"/>
      </linearGradient>
    </defs>
    <text x="0" y="48" fontFamily="Manrope, sans-serif" fontWeight="800" fontSize="52" fill="url(#dang)" letterSpacing="-2">DAN</text>
    <path d="M58 38 L66 26 L74 38" stroke="url(#dang)" strokeWidth="3" fill="none" strokeLinecap="round"/>
  </svg>
);

const GSignLogo = ({ size = 34 }) => (
  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
    <div style={{ width:size, height:size, borderRadius:size*0.28, background:'linear-gradient(135deg, #1F8A5B, #0E9F6E)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 18px -8px rgba(14,159,110,.6)' }}>
      <svg width={size*0.56} height={size*0.56} viewBox="0 0 24 24" fill="none">
        <path d="M20.5 12a8.5 8.5 0 1 0-3 6.5" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
        <path d="M12 12h6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"/>
      </svg>
    </div>
    <div style={{ fontWeight:800, fontSize:size*0.42, letterSpacing:'-0.02em', color:T.ink }}>G<span style={{ color:'#0E9F6E' }}>·</span>Sign</div>
  </div>
);

/* ── The real mobile steps (order + copy parity) ─────────────────────────── */
const STEPS = [
  { n:1, label:'Утасны баталгаажуулалт',  scope:'Утасны дугаар + OTP код. OTP зөвхөн энэ алхам болон нууц үг сэргээхэд харагдана — өөр хаана ч биш.' },
  { n:2, label:'И-мэйл баталгаажуулалт',  scope:'И-мэйл хаяг + баталгаажуулах код.' },
  { n:3, label:'Данс баталгаажуулалт',     scope:'Банкны данс баталгаажуулах (микро-шилжүүлгээр). И-мэйл баталгаажсаны дараа шууд.' },
  { n:4, label:'Нууц үг үүсгэх',           scope:'Нэвтрэх нууц үг үүсгэх — 8+ тэмдэгт, том үсэг, тоо, тусгай тэмдэгт шаардлагатай.' },
  { n:5, label:'Гүйлгээний PIN код',       scope:'4 оронтой гүйлгээний PIN үүсгэх + давтах. Биометр (Face ID / хурууны хээ) алхам зөвхөн мобайл дээр байдаг — веб дээр алгасна, учир нь хөтөч дээр эквивалент бүртгэлийн API байхгүй.' },
  { n:6, label:'Танин баталгаажуулалт',    scope:'ДАН зөвшөөрөл + MONPEP автомат шалгалт.' },
  { n:7, label:'Үйлчилгээний нөхцөл',      scope:'Үйлчилгээний нөхцөлтэй танилцаж зөвшөөрөх.' },
  { n:8, label:'Мастер гэрээ',             scope:'Мастер гэрээтэй танилцаж байгуулах.' },
  { n:9, label:'Гарын үсэг зурах',         scope:'Гэрээнд гарын үсэг зурах — G-Sign (бүх үйлчилгээ) эсвэл цахим гарын үсэг (хязгаарлагдмал).' },
];
const DONE_THROUGH_DEFAULT = 0;

/* ── Left step rail ──────────────────────────────────────────────────────── */
const StepRail = ({ current, doneThrough, onPick }) => (
  <aside style={{ width:300, flexShrink:0, display:'flex', flexDirection:'column', padding:'34px 26px', borderRight:`1px solid ${T.line}`, background:'rgba(255,255,255,.6)', backdropFilter:'blur(10px)', minHeight:'100vh' }}>
    <div style={{ display:'flex', alignItems:'center', gap:11, marginBottom:6 }}>
      <LogoWedge size={34}/>
      <div style={{ fontWeight:800, fontSize:16, lineHeight:1.05, letterSpacing:'-0.02em', color:T.ink }}>Money Market<br/><span style={{ color:T.muted2, fontWeight:600 }}>Fund</span></div>
    </div>
    <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.14em', color:T.muted2, textTransform:'uppercase', margin:'28px 0 16px' }}>Бүртгэл · Алхам {current} / {STEPS.length}</div>

    <nav style={{ display:'flex', flexDirection:'column' }}>
      {STEPS.map((s, i) => {
        const state = s.n === current ? 'current' : (s.n <= doneThrough ? 'done' : 'todo');
        const last = i === STEPS.length - 1;
        return (
          <button key={s.n} onClick={() => state !== 'todo' && onPick(s.n)} disabled={state === 'todo'} aria-disabled={state === 'todo'}
            title={state === 'todo' ? 'Өмнөх алхмуудыг дуусгасны дараа энэ алхам нээгдэнэ' : undefined}
            style={{ position:'relative', display:'flex', alignItems:'flex-start', gap:13, padding:0, background:'none', border:'none', cursor: state === 'todo' ? 'default' : 'pointer', fontFamily:'inherit', textAlign:'left', minHeight:0 }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
              <div style={{
                width:28, height:28, borderRadius:999, display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:12.5, fontWeight:800, marginTop:2,
                background: state==='current' ? T.indigo : state==='done' ? T.pos : T.surface,
                color: state==='todo' ? T.muted2 : '#fff',
                border: state==='todo' ? `1.5px solid ${T.line}` : 'none',
                boxShadow: state==='current' ? `0 0 0 4px ${T.indigoSoft}` : 'none',
              }}>
                {state==='done'
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  : s.n}
              </div>
              {!last && <div style={{ width:2, flex:1, minHeight:26, background: s.n < current ? T.pos : T.line2, margin:'4px 0' }}/>}
            </div>
            <div style={{ paddingBottom: last ? 0 : 18, paddingTop:5 }}>
              <div style={{ fontSize:13.5, fontWeight: state==='current'?800:600, color: state==='todo'?T.muted:T.ink, lineHeight:1.3 }}>{s.label}</div>
              {state==='current' && <div style={{ fontSize:11.5, color:T.muted, fontWeight:600, marginTop:3 }}>Одоо энд байна</div>}
            </div>
          </button>
        );
      })}
    </nav>

    <div style={{ marginTop:'auto', paddingTop:24, display:'flex', gap:10, alignItems:'flex-start' }}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:1 }}><path d="M5 4h11l3 3v13H5z" stroke={T.muted} strokeWidth="1.8" strokeLinejoin="round"/><path d="M8 4v5h6" stroke={T.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="15" r="2.4" stroke={T.muted} strokeWidth="1.8"/></svg>
      <div style={{ fontSize:11.5, color:T.muted, fontWeight:600, lineHeight:1.5 }}>Явцыг автоматаар хадгалж байна. Та дурын үедээ гарч, дараа үргэлжлүүлэх боломжтой.</div>
    </div>
  </aside>
);

/* ── Content: card scaffold shared by every step ─────────────────────────── */
const StepCard = ({ step, children, footer, wide }) => (
  <div style={{ width:'100%', maxWidth: wide ? 860 : 720, margin:'0 auto' }}>
    <div style={{ fontSize:12, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:T.indigo, marginBottom:10 }}>Алхам {step.n} / {STEPS.length}</div>
    <div style={{ background:T.surface, border:`1px solid ${T.line2}`, borderRadius:24, overflow:'hidden' }}>
      <div style={{ padding:'28px 32px' }}>{children}</div>
      {footer && <div style={{ padding:'18px 32px', borderTop:`1px solid ${T.line2}`, background:T.field, display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>{footer}</div>}
    </div>
  </div>
);

/* ── Stub for the not-yet-built steps ────────────────────────────────────── */
const StepStub = ({ step, onNext, onBack }) => (
  <StepCard step={step} footer={
    <>
      <button onClick={onBack} disabled={step.n===1} style={{ display:'inline-flex', alignItems:'center', gap:7, background:'none', border:'none', color: step.n===1?T.muted2:T.muted, fontWeight:700, fontSize:13.5, cursor: step.n===1?'default':'pointer', fontFamily:'inherit', padding:'8px 4px', minHeight:0, opacity: step.n===1?.5:1 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Өмнөх
      </button>
      <button onClick={onNext} style={{ height:52, padding:'0 24px', borderRadius:14, background:T.indigo, color:'#fff', border:'none', fontWeight:700, fontSize:15, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:10 }}>
        Үргэлжлүүлэх
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </>
  }>
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', padding:'22px 8px' }}>
      <div style={{ width:56, height:56, borderRadius:16, background:T.line2, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18 }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h10" stroke={T.muted2} strokeWidth="2" strokeLinecap="round"/></svg>
      </div>
      <h1 style={{ fontSize:22, fontWeight:800, color:T.ink, letterSpacing:'-0.01em', margin:'0 0 8px' }}>{step.label}</h1>
      <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'4px 12px', borderRadius:999, background:T.warnSoft, color:T.warn, fontSize:11, fontWeight:700, marginBottom:16 }}>Дараагийн шатанд бүтээгдэнэ</div>
      <p style={{ fontSize:13.5, color:T.muted, lineHeight:1.6, margin:0, maxWidth:440 }}>{step.scope}</p>
    </div>
  </StepCard>
);

/* ── Generic footer bar: Өмнөх (ghost) + primary CTA ─────────────────────── */
const StepFooter = ({ onBack, primaryLabel, onPrimary, primaryDisabled, primaryReason, dark, backLabel='Өмнөх', hideBack }) => (
  <>
    {!hideBack ? (
      <button onClick={onBack} style={{ display:'inline-flex', alignItems:'center', gap:7, background:'none', border:'none', color:T.muted, fontWeight:700, fontSize:13.5, cursor:'pointer', fontFamily:'inherit', padding:'8px 4px', minHeight:0 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        {backLabel}
      </button>
    ) : <span/>}
    <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6 }}>
      <button onClick={primaryDisabled ? undefined : onPrimary} disabled={primaryDisabled} style={{
        height:52, padding:'0 24px', borderRadius:14, border:'none', fontWeight:700, fontSize:15, fontFamily:'inherit',
        display:'inline-flex', alignItems:'center', gap:10, cursor: primaryDisabled ? 'not-allowed':'pointer',
        background: primaryDisabled ? '#E3E5EF' : (dark ? T.ink : T.indigo), color: primaryDisabled ? T.muted2 : '#fff',
      }}>
        {primaryLabel}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      {primaryDisabled && primaryReason && <div style={{ fontSize:11.5, color:T.muted2, fontWeight:600 }}>{primaryReason}</div>}
    </div>
  </>
);

/* ── Generic code-box row — used for phone/email OTP (6) and PIN (4) ─────
   Click anywhere focuses a hidden input; boxes render the typed digits.
   state: 'idle' | 'error' | 'success' (drives border/text color). mask=true dots the digits (PIN). */
const CodeBoxes = ({ length, value, onChange, state='idle', mask, autoFocus }) => {
  const ref = React.useRef(null);
  React.useEffect(() => { if (autoFocus && ref.current) ref.current.focus(); }, [autoFocus]);
  const next = value.length;
  const color = state==='error' ? T.neg : state==='success' ? T.pos : T.indigo;
  return (
    <div style={{ position:'relative' }} onClick={() => ref.current && ref.current.focus()}>
      <input ref={ref} value={value} inputMode="numeric" maxLength={length} aria-label="Код"
        onChange={e => onChange(e.target.value.replace(/\D/g,'').slice(0,length))}
        style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0, border:'none', background:'transparent', cursor:'pointer', zIndex:2 }}/>
      <div style={{ display:'flex', gap:10, pointerEvents:'none' }}>
        {Array.from({ length }).map((_, i) => {
          const d = value[i] || '';
          const cursor = state!=='success' && i === next;
          const border = state==='error' ? T.neg : d ? color : cursor ? T.indigo : T.line;
          const ring = state==='error' ? `0 0 0 3px ${T.negSoft}` : (cursor ? `0 0 0 3px ${T.indigoSoft}` : 'none');
          return (
            <div key={i} style={{ flex:1, height:56, borderRadius:12, background:T.surface, border:`1.5px solid ${border}`, boxShadow:ring, display:'flex', alignItems:'center', justifyContent:'center', fontSize: mask ? 28 : 22, fontWeight:700, color: state==='error'?T.neg:T.ink, fontFamily:"'JetBrains Mono',monospace" }}>
              {mask ? (d ? '•' : '') : d}
            </div>
          );
        })}
      </div>
    </div>
  );
};

Object.assign(window, {
  RegT: T, STEPS, DONE_THROUGH_DEFAULT, LogoWedge, DanLogo, GSignLogo,
  StepRail, StepCard, StepStub, StepFooter, CodeBoxes,
});
