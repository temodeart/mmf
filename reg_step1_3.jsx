// reg_step1_3.jsx — MMF Web · Registration steps 1–3
// Step1PhoneOtp · Step2EmailOtp · Step3Password
// Load after reg_shell.jsx.

const { useState: _uS1, useEffect: _uE1 } = React;
const { RegT: T, STEPS, StepCard, StepFooter, CodeBoxes } = window;

const fmtCd = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

/* ══ STEP 1 · Утасны баталгаажуулалт — OTP lives ONLY here + password reset ══ */
const Step1PhoneOtp = ({ onNext, onBack }) => {
  const [sent, setSent]     = _uS1(false);
  const [code, setCode]     = _uS1('');
  const [phase, setPhase]   = _uS1('idle');   // idle | error | success
  const [cd, setCd]         = _uS1(60);

  _uE1(() => { if (!sent) return; const t = setInterval(() => setCd(c => c>0?c-1:0), 1000); return () => clearInterval(t); }, [sent]);

  const send = () => { setSent(true); setCd(60); };
  const resend = () => { if (cd>0) return; setCd(60); setCode(''); setPhase('idle'); };

  const onCodeChange = (v) => {
    setCode(v);
    if (v.length < 6) { if (phase!=='idle') setPhase('idle'); return; }
    if (v === '000000') setPhase('error'); else setPhase('success');
  };

  const canContinue = phase === 'success';

  return (
    <StepCard step={STEPS[0]} footer={
      <StepFooter onBack={onBack} hideBack primaryLabel="Үргэлжлүүлэх" onPrimary={onNext}
        primaryDisabled={!canContinue} primaryReason={!sent ? 'Утасны дугаараа баталгаажуулна уу.' : phase!=='success' ? '6 оронтой кодоо оруулна уу.' : undefined}/>
    }>
      <h1 style={{ fontSize:24, fontWeight:800, color:T.ink, letterSpacing:'-0.02em', lineHeight:1.25, margin:'0 0 10px' }}>Утасны дугаараа баталгаажуулна уу</h1>
      <p style={{ fontSize:14, color:T.muted, lineHeight:1.6, margin:'0 0 24px' }}>
        {sent ? 'Бид таны утсанд баталгаажуулах код илгээлээ.' : 'Үргэлжлүүлэхийн тулд утасны дугаараа баталгаажуулна уу.'}
      </p>

      <div style={{ fontSize:12, color:T.muted, fontWeight:600, marginBottom:8 }}>Утасны дугаар</div>
      <div style={{ height:52, borderRadius:14, background:T.surface, border:`1.5px solid ${sent ? T.indigo : T.line}`, boxShadow: sent ? `0 0 0 4px ${T.indigoSoft}` : 'none', display:'flex', alignItems:'center', padding:'0 8px 0 16px', gap:10 }}>
        <span style={{ fontSize:14, fontWeight:700, color:T.ink, paddingRight:10, borderRight:`1px solid ${T.line}`, fontFamily:"'JetBrains Mono',monospace" }}>+976</span>
        <span style={{ fontSize:15, fontWeight:600, color:T.ink, fontFamily:"'JetBrains Mono',monospace", letterSpacing:'0.04em' }}>9552 2981</span>
        {sent ? (
          <span style={{ marginLeft:'auto', marginRight:8, display:'inline-flex', alignItems:'center', gap:5, color:T.pos, fontSize:11.5, fontWeight:700 }}>
            <window.WebDot color={T.pos}/>Илгээсэн
          </span>
        ) : (
          <button onClick={send} style={{ marginLeft:'auto', height:36, padding:'0 14px', borderRadius:10, background:T.indigo, color:'#fff', border:'none', cursor:'pointer', fontSize:12.5, fontWeight:700, fontFamily:'inherit', flexShrink:0 }}>Код илгээх</button>
        )}
      </div>

      {sent && (
        <div style={{ marginTop:26 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
            <div style={{ fontSize:12, color:T.muted, fontWeight:600 }}>Баталгаажуулах код</div>
            {cd>0
              ? <span style={{ fontSize:11.5, fontWeight:700, color:T.muted2, fontFamily:"'JetBrains Mono',monospace" }}>{fmtCd(cd)} · Дахин илгээх</span>
              : <button onClick={resend} style={{ background:'none', border:'none', color:T.indigo, fontWeight:800, fontSize:11.5, cursor:'pointer', fontFamily:'inherit', padding:0 }}>Дахин илгээх</button>}
          </div>
          <CodeBoxes length={6} value={code} onChange={onCodeChange} state={phase} autoFocus/>
          {phase==='error' && (
            <div style={{ marginTop:12, display:'flex', alignItems:'center', gap:7, fontSize:12.5, fontWeight:700, color:T.neg }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={T.neg} strokeWidth="2"/><path d="M12 7.5v5.5M12 16.5h.01" stroke={T.neg} strokeWidth="2.2" strokeLinecap="round"/></svg>
              Код буруу байна. Дахин оруулна уу.
            </div>
          )}
          {phase==='success' && (
            <div style={{ marginTop:12, display:'flex', alignItems:'center', gap:7, fontSize:12.5, fontWeight:700, color:T.pos }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke={T.pos} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Баталгаажлаа
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop:22, display:'flex', gap:9, alignItems:'flex-start', padding:13, borderRadius:13, background:T.field, border:`1px solid ${T.line2}` }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:1 }}><circle cx="12" cy="12" r="9" stroke={T.muted2} strokeWidth="2"/><path d="M12 11v5M12 8h.01" stroke={T.muted2} strokeWidth="2" strokeLinecap="round"/></svg>
        <div style={{ fontSize:11.5, color:T.muted, lineHeight:1.5 }}>OTP код зөвхөн энэ алхам болон нууц үг сэргээхэд ашиглагдана.</div>
      </div>
    </StepCard>
  );
};

/* ══ STEP 2 · И-мэйл баталгаажуулалт ══ */
const Step2EmailOtp = ({ onNext, onBack }) => {
  const [code, setCode]   = _uS1('');
  const [phase, setPhase] = _uS1('idle');
  const [cd, setCd]       = _uS1(60);

  _uE1(() => { const t = setInterval(() => setCd(c => c>0?c-1:0), 1000); return () => clearInterval(t); }, []);

  const resend = () => { if (cd>0) return; setCd(60); setCode(''); setPhase('idle'); };
  const onCodeChange = (v) => {
    setCode(v);
    if (v.length < 6) { if (phase!=='idle') setPhase('idle'); return; }
    if (v === '000000') setPhase('error'); else setPhase('success');
  };
  const canContinue = phase === 'success';

  return (
    <StepCard step={STEPS[1]} footer={
      <StepFooter onBack={onBack} primaryLabel="Үргэлжлүүлэх" onPrimary={onNext}
        primaryDisabled={!canContinue} primaryReason={phase!=='success' ? '6 оронтой кодоо оруулна уу.' : undefined}/>
    }>
      <h1 style={{ fontSize:24, fontWeight:800, color:T.ink, letterSpacing:'-0.02em', lineHeight:1.25, margin:'0 0 10px' }}>И-мэйл хаягаа баталгаажуулна уу</h1>
      <p style={{ fontSize:14, color:T.muted, lineHeight:1.6, margin:'0 0 24px' }}>Бид таны и-мэйл хаяг руу баталгаажуулах код илгээлээ.</p>

      <div style={{ fontSize:12, color:T.muted, fontWeight:600, marginBottom:8 }}>И-мэйл хаяг</div>
      <div style={{ height:52, borderRadius:14, background:T.surface, border:`1.5px solid ${T.indigo}`, boxShadow:`0 0 0 4px ${T.indigoSoft}`, display:'flex', alignItems:'center', padding:'0 16px', gap:10, marginBottom:26 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke={T.muted} strokeWidth="2"/><path d="M4 8l8 5 8-5" stroke={T.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <span style={{ fontSize:15, fontWeight:600, color:T.ink }}>temuujin@gmail.com</span>
        <span style={{ marginLeft:'auto', display:'inline-flex', alignItems:'center', gap:5, color:T.pos, fontSize:11.5, fontWeight:700 }}><window.WebDot color={T.pos}/>Илгээсэн</span>
      </div>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
        <div style={{ fontSize:12, color:T.muted, fontWeight:600 }}>Баталгаажуулах код</div>
        {cd>0
          ? <span style={{ fontSize:11.5, fontWeight:700, color:T.muted2, fontFamily:"'JetBrains Mono',monospace" }}>{fmtCd(cd)} · Дахин илгээх</span>
          : <button onClick={resend} style={{ background:'none', border:'none', color:T.indigo, fontWeight:800, fontSize:11.5, cursor:'pointer', fontFamily:'inherit', padding:0 }}>Дахин илгээх</button>}
      </div>
      <CodeBoxes length={6} value={code} onChange={onCodeChange} state={phase} autoFocus/>
      {phase==='error' && (
        <div style={{ marginTop:12, display:'flex', alignItems:'center', gap:7, fontSize:12.5, fontWeight:700, color:T.neg }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={T.neg} strokeWidth="2"/><path d="M12 7.5v5.5M12 16.5h.01" stroke={T.neg} strokeWidth="2.2" strokeLinecap="round"/></svg>
          Код буруу байна. Дахин оруулна уу.
        </div>
      )}
      {phase==='success' && (
        <div style={{ marginTop:12, display:'flex', alignItems:'center', gap:7, fontSize:12.5, fontWeight:700, color:T.pos }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke={T.pos} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Баталгаажлаа
        </div>
      )}
      <div style={{ marginTop:20, fontSize:12, color:T.muted, lineHeight:1.5 }}>
        Кодыг и-мэйлийн <b style={{ color:T.ink }}>Inbox</b> эсвэл <b style={{ color:T.ink }}>Spam</b> хэсгээс шалгана уу.
      </div>
    </StepCard>
  );
};

/* ══ STEP 3 · Нууц үг үүсгэх ══ */
const PwField = ({ label, value, onChange, error }) => {
  const [show, setShow] = _uS1(false);
  const [focused, setFocused] = _uS1(false);
  return (
    <div>
      <label style={{ display:'block', fontSize:12, color:T.muted, fontWeight:600, marginBottom:8 }}>{label}</label>
      <div style={{ height:52, borderRadius:14, background:focused?T.surface:T.field, border:`1.5px solid ${error?T.neg:focused?T.indigo:T.line}`, boxShadow: focused&&!error?`0 0 0 4px ${T.indigoSoft}`:'none', padding:'0 8px 0 16px', display:'flex', alignItems:'center', gap:8 }}>
        <input type={show?'text':'password'} value={value} onChange={e=>onChange(e.target.value)}
          onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
          placeholder="Нууц үгээ оруулна уу" autoComplete="new-password"
          style={{ flex:1, minWidth:0, border:'none', outline:'none', background:'transparent', fontSize:15, fontWeight:600, color:T.ink, fontFamily:'inherit', letterSpacing: show?0:'0.12em' }}/>
        <button type="button" onClick={()=>setShow(s=>!s)} style={{ width:36, height:36, borderRadius:10, border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:T.muted, minHeight:0 }}>
          {show
            ? <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></svg>
            : <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="2"/><path d="M4 4l16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>}
        </button>
      </div>
    </div>
  );
};

const Step3Password = ({ onNext, onBack }) => {
  const [pw, setPw]   = _uS1('');
  const [pw2, setPw2] = _uS1('');
  const rules = [
    { label:'8+ тэмдэгт', ok: pw.length >= 8 },
    { label:'1 том үсэг', ok: /[A-ZА-ЯӨҮ]/.test(pw) },
    { label:'1 тоо', ok: /\d/.test(pw) },
    { label:'1 тусгай тэмдэгт', ok: /[^A-Za-zА-Яа-яӨҮөү0-9]/.test(pw) },
  ];
  const allOk = rules.every(r => r.ok);
  const mismatch = pw2.length > 0 && pw !== pw2;
  const valid = allOk && pw2.length > 0 && !mismatch;

  return (
    <StepCard step={STEPS[3]} footer={
      <StepFooter onBack={onBack} primaryLabel="Үргэлжлүүлэх" onPrimary={onNext}
        primaryDisabled={!valid} primaryReason={!valid ? 'Шаардлагыг хангасан нууц үг оруулж, давтана уу.' : undefined}/>
    }>
      <h1 style={{ fontSize:24, fontWeight:800, color:T.ink, letterSpacing:'-0.02em', lineHeight:1.25, margin:'0 0 10px' }}>Нууц үг үүсгэх</h1>
      <p style={{ fontSize:14, color:T.muted, lineHeight:1.6, margin:'0 0 24px' }}>Цаашид бүртгэлдээ нэвтрэхэд ашиглах нууц үгээ үүсгэнэ үү.</p>

      <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
        <PwField label="Нууц үг" value={pw} onChange={setPw}/>
        <PwField label="Нууц үг давтах" value={pw2} onChange={setPw2} error={mismatch}/>
      </div>

      {mismatch && (
        <div style={{ marginTop:10, display:'flex', alignItems:'center', gap:6, fontSize:12, fontWeight:700, color:T.neg }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={T.neg} strokeWidth="2"/><path d="M12 7.5v5.5M12 16.5h.01" stroke={T.neg} strokeWidth="2.2" strokeLinecap="round"/></svg>
          Нууц үг таарахгүй байна
        </div>
      )}

      <div style={{ marginTop:18, display:'flex', flexWrap:'wrap', gap:8 }}>
        {rules.map((r,i) => (
          <div key={i} style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'8px 12px', borderRadius:999, background: r.ok?T.posSoft:T.field, color: r.ok?T.pos:T.muted, fontSize:12, fontWeight:700 }}>
            {r.ok
              ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke={T.pos} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              : <span style={{ width:11, height:11, borderRadius:999, border:`2px solid ${T.muted2}` }}/>}
            {r.label}
          </div>
        ))}
      </div>
    </StepCard>
  );
};

Object.assign(window, { Step1PhoneOtp, Step2EmailOtp, Step3Password });
