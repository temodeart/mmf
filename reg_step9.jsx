// reg_step9.jsx — MMF Web · Registration step 9 — Данс баталгаажуулалт (port of bank_verify.jsx)
// Sub-stages: form -> sending -> info -> code -> verified -> complete
// Load after reg_shell.jsx.

const { useState: _uS9, useEffect: _uE9 } = React;
const { RegT: T, STEPS, StepCard, StepFooter, CodeBoxes } = window;

const DAN_NAME = 'Батболд Тэмүүжин';
const MN_BANKS = [
  { id:'khan',   name:'Хаан Банк',              ab:'ХААН', c:'#0E7C4A', code:'0005' },
  { id:'golomt', name:'Голомт банк',            ab:'ГБ',   c:'#0B5CAB', code:'0015' },
  { id:'tdb',    name:'Худалдаа хөгжлийн банк', ab:'ХХБ',  c:'#0A2A6B', code:'0004' },
  { id:'state',  name:'Төрийн банк',            ab:'ТБ',   c:'#0E8F8A', code:'0034' },
  { id:'xac',    name:'ХасБанк',                ab:'ХАС',  c:'#E8722B', code:'0030' },
  { id:'capitron', name:'Капитрон банк',        ab:'КБ',   c:'#6E4FB0', code:'0042' },
];
const VBANK = MN_BANKS[0];
const VMASK = '•••• 4567';
const VCODE = '482715';
const VAMOUNT = '10.00';
const fmtCd = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
const buildIban = (bank, acct) => {
  const digits = acct.replace(/\D/g,'');
  const padded = (digits + '000000000000').slice(0,12);
  return ('MN58' + bank.code + padded).replace(/(.{4})/g,'$1 ').trim();
};

const BankMark = ({ bank, size=38 }) => (
  <div style={{ width:size, height:size, borderRadius:size*0.28, flexShrink:0, background:bank.c, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize: bank.ab.length>2?11:14 }}>{bank.ab}</div>
);

/* ── sub-stage: bank + IBAN form ─────────────────────────────────────────── */
const BankForm = ({ onSubmit, onBack }) => {
  const [bank, setBank] = _uS9(null);
  const [picker, setPicker] = _uS9(false);
  const [acct, setAcct] = _uS9('');
  const [iban, setIban] = _uS9('');
  const [justFilled, setJustFilled] = _uS9(false);

  const ibanDigits = iban.replace(/\D/g,'');
  const canFind = bank && acct.replace(/\D/g,'').length >= 6;
  const canVerify = bank && ibanDigits.length >= 18;

  const autoFill = () => {
    if (!canFind) return;
    setIban(buildIban(bank, acct).replace(/^MN\s*/,''));
    setJustFilled(true);
    setTimeout(() => setJustFilled(false), 2200);
  };

  return (
    <StepCard step={STEPS[2]} footer={
      <StepFooter onBack={onBack} primaryLabel="Баталгаажуулах гүйлгээ авах" onPrimary={() => onSubmit(bank)}
        primaryDisabled={!canVerify} primaryReason={!canVerify ? 'Банк сонгож, IBAN дугаараа бөглөнө үү.' : undefined}/>
    }>
      <h1 style={{ fontSize:24, fontWeight:800, color:T.ink, letterSpacing:'-0.02em', lineHeight:1.25, margin:'0 0 10px' }}>Банкны данс баталгаажуулах</h1>
      <p style={{ fontSize:14, color:T.muted, lineHeight:1.6, margin:'0 0 22px' }}>Мөнгөн хөрөнгөөс зарлага гаргах үед ашиглах өөрийн нэр дээрх банкны дансаа баталгаажуулна уу.</p>

      <div style={{ fontSize:12, color:T.muted, fontWeight:600, marginBottom:8 }}>Данс эзэмшигч</div>
      <div style={{ height:52, borderRadius:14, background:T.line2, border:`1.5px solid ${T.line}`, padding:'0 14px', display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <span style={{ fontSize:15, fontWeight:700, color:T.text }}>{DAN_NAME}</span>
        <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:10.5, fontWeight:700, color:T.muted2, background:T.surface, padding:'4px 8px', borderRadius:999, border:`1px solid ${T.line}` }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke={T.muted2} strokeWidth="2"/><path d="M8 11V8a4 4 0 018 0v3" stroke={T.muted2} strokeWidth="2"/></svg>
          ДАН
        </span>
      </div>

      <div style={{ fontSize:12, color:T.muted, fontWeight:600, marginBottom:8 }}>Банк сонгох</div>
      <button onClick={() => setPicker(p=>!p)} style={{ width:'100%', height:56, borderRadius:14, cursor:'pointer', background: bank?T.surface:T.field, border:`1.5px solid ${picker?T.indigo:T.line}`, boxShadow: picker?`0 0 0 4px ${T.indigoSoft}`:'none', padding:'0 12px', display:'flex', alignItems:'center', gap:12, fontFamily:'inherit', marginBottom: picker?8:20 }}>
        {bank ? <BankMark bank={bank}/> : <div style={{ width:38, height:38, borderRadius:11, background:T.line2, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 10l8-5 8 5M5 10v8m4-8v8m6-8v8m4-8v8M3 21h18" stroke={T.muted2} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></div>}
        <span style={{ flex:1, textAlign:'left', fontSize:15, fontWeight: bank?700:500, color: bank?T.ink:T.muted2 }}>{bank ? bank.name : 'Сонгох'}</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ transform: picker?'rotate(180deg)':'none' }}><path d="M6 9l6 6 6-6" stroke={T.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      {picker && (
        <div style={{ background:T.surface, border:`1px solid ${T.line}`, borderRadius:14, overflow:'hidden', marginBottom:20, boxShadow:'0 12px 30px -16px rgba(15,20,55,.2)' }}>
          {MN_BANKS.map((b,i) => (
            <div key={b.id} onClick={() => { setBank(b); setPicker(false); }} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', cursor:'pointer', borderTop: i?`1px solid ${T.line2}`:'none', background: bank&&bank.id===b.id?T.indigoSoft:T.surface }}>
              <BankMark bank={b} size={32}/>
              <span style={{ flex:1, fontSize:13.5, fontWeight:600, color:T.ink }}>{b.name}</span>
              {bank && bank.id===b.id && <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke={T.indigo} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
          ))}
        </div>
      )}

      <div style={{ fontSize:12, color:T.muted, fontWeight:600, marginBottom:8 }}>Дансны дугаар</div>
      <div style={{ display:'flex', gap:10, marginBottom:20 }}>
        <input value={acct} onChange={e => setAcct(e.target.value.replace(/[^\d ]/g,''))} placeholder="Дансны дугаараа оруулна уу" inputMode="numeric"
          style={{ flex:1, minWidth:0, height:52, borderRadius:14, border:`1.5px solid ${T.line}`, background:T.field, padding:'0 16px', fontSize:15, fontWeight:600, color:T.ink, fontFamily:"'JetBrains Mono',monospace", outline:'none' }}/>
        <button onClick={autoFill} disabled={!canFind} style={{ flexShrink:0, height:52, padding:'0 18px', borderRadius:14, border:`1.5px solid ${canFind?T.indigo:T.line}`, background: canFind?T.indigoSoft:T.line2, color: canFind?T.indigo:T.muted2, fontWeight:700, fontSize:13, cursor: canFind?'pointer':'not-allowed', fontFamily:'inherit', whiteSpace:'nowrap' }}>IBAN олох</button>
      </div>

      <div style={{ fontSize:12, color:T.muted, fontWeight:600, marginBottom:8 }}>IBAN дугаар</div>
      <div style={{ minHeight:56, borderRadius:14, background: justFilled?T.surface:T.field, border:`1.5px solid ${justFilled?T.pos:T.line}`, boxShadow: justFilled?`0 0 0 4px ${T.posSoft}`:'none', padding:'0 14px', display:'flex', alignItems:'center', gap:12 }}>
        <span style={{ fontSize:15, fontWeight:800, color:T.ink, letterSpacing:'0.02em' }}>MN</span>
        <span style={{ width:1, height:26, background:T.line, flexShrink:0 }}/>
        <input value={iban} onChange={e => { setIban(e.target.value.replace(/[^\d ]/g,'')); setJustFilled(false); }} placeholder="IBAN дугаар" inputMode="numeric"
          style={{ flex:1, minWidth:0, border:'none', outline:'none', background:'transparent', fontSize:15, fontWeight:700, color:T.ink, fontFamily:"'JetBrains Mono',monospace", letterSpacing:'0.04em' }}/>
        {justFilled && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0 }}><path d="M5 12l4 4 10-10" stroke={T.pos} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </div>
      {justFilled && <div style={{ marginTop:8, fontSize:11.5, fontWeight:700, color:T.pos }}>IBAN дугаар автоматаар бөглөгдлөө</div>}

      <div style={{ marginTop:18, display:'flex', gap:9, alignItems:'flex-start', padding:13, borderRadius:13, background:T.field, border:`1px solid ${T.line2}` }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:1 }}><circle cx="12" cy="12" r="9" stroke={T.muted2} strokeWidth="2"/><path d="M12 16v-4M12 8.5h.01" stroke={T.muted2} strokeWidth="2" strokeLinecap="round"/></svg>
        <div style={{ fontSize:11.5, color:T.muted, lineHeight:1.5 }}>Та зөвхөн өөрийн нэр дээрх банкны дансыг баталгаажуулах боломжтой.</div>
      </div>
    </StepCard>
  );
};

/* ── sub-stage: sending (pending) ────────────────────────────────────────── */
const DepositSending = ({ bank, onDone }) => {
  _uE9(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, []);
  return (
    <StepCard step={STEPS[2]} footer={null}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', padding:'26px 0' }}>
        <div style={{ position:'relative', width:100, height:100, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div className="reg-pulse" style={{ position:'absolute', inset:0, borderRadius:30, background:'rgba(79,70,229,.2)' }}/>
          <div style={{ position:'relative', width:76, height:76, borderRadius:22, background:`linear-gradient(135deg, ${T.indigo}, ${T.blue})`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 14px 30px -10px ${T.indigo}99` }}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none"><path d="M12 4v11" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"/><path d="M8 11l4 4 4-4" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 19h14" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"/></svg>
          </div>
        </div>
        <div style={{ fontSize:22, fontWeight:800, color:T.ink, marginTop:26, letterSpacing:'-0.02em' }}>Гүйлгээ илгээгдэж байна</div>
        <p style={{ fontSize:13.5, color:T.muted, marginTop:10, lineHeight:1.55, maxWidth:340 }}>Бид таны данс руу баталгаажуулах жижиг гүйлгээ илгээж байна. Энэ хэдэн минут зарцуулж магадгүй.</p>
        <div style={{ marginTop:22, display:'flex', alignItems:'center', gap:10, padding:'10px 14px 10px 10px', borderRadius:14, background:T.surface, border:`1px solid ${T.line2}` }}>
          <BankMark bank={bank} size={28}/>
          <span style={{ fontSize:13, fontWeight:700, color:T.ink }}>{bank.name}</span>
          <span style={{ fontSize:13, fontWeight:600, color:T.muted, fontFamily:"'JetBrains Mono',monospace" }}>{VMASK}</span>
        </div>
      </div>
    </StepCard>
  );
};

/* ── sub-stage: deposit info (mock statement row) ────────────────────────── */
const DepositInfo = ({ bank, onNext }) => (
  <StepCard step={STEPS[2]} footer={<StepFooter onBack={()=>{}} hideBack primaryLabel="Баталгаажуулах код оруулах" onPrimary={onNext}/>}>
    <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'5px 11px 5px 6px', borderRadius:999, background:T.posSoft, marginBottom:14 }}>
      <span style={{ width:22, height:22, borderRadius:999, background:T.pos, display:'flex', alignItems:'center', justifyContent:'center' }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
      <span style={{ fontSize:11, fontWeight:800, color:T.pos, letterSpacing:'0.03em', textTransform:'uppercase' }}>Гүйлгээ илгээгдлээ</span>
    </div>
    <h1 style={{ fontSize:22, fontWeight:800, color:T.ink, letterSpacing:'-0.02em', lineHeight:1.3, margin:'0 0 10px' }}>Бид таны данс руу баталгаажуулах жижиг гүйлгээ хийлээ</h1>
    <p style={{ fontSize:14, color:T.muted, lineHeight:1.6, margin:'0 0 20px' }}>
      Банкны аппаа нээж, ирсэн орлогын <b style={{ color:T.text }}>гүйлгээний утга</b>-д байгаа баталгаажуулах кодыг тэмдэглэж аваарай.
    </p>

    {/* mock bank statement row */}
    <div style={{ background:T.surface, borderRadius:16, border:`1px solid ${T.line2}`, overflow:'hidden', boxShadow:'0 10px 26px -18px rgba(15,20,55,.3)', marginBottom:16 }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 16px' }}>
        <div style={{ width:38, height:38, borderRadius:11, background:T.posSoft, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M17 7L8 16" stroke={T.pos} strokeWidth="2.2" strokeLinecap="round"/><path d="M15 16H8V9" stroke={T.pos} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:13.5, fontWeight:700, color:T.ink }}>Орлого</div>
          <div style={{ fontSize:11.5, color:T.muted, marginTop:2 }}>{bank.name} · 14:32</div>
        </div>
        <div style={{ fontSize:14, fontWeight:800, color:T.pos, fontFamily:"'JetBrains Mono',monospace" }}>+{VAMOUNT}₮</div>
      </div>
      <div style={{ height:1, background:T.line2 }}/>
      <div style={{ padding:'12px 16px', background:T.field }}>
        <div style={{ fontSize:10.5, fontWeight:700, color:T.muted2, marginBottom:8, textTransform:'uppercase', letterSpacing:'0.06em' }}>Гүйлгээний утга</div>
        <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
          <span style={{ fontSize:14, fontWeight:700, color:T.text, fontFamily:"'JetBrains Mono',monospace" }}>MMF·</span>
          <span style={{ fontSize:15, fontWeight:800, color:'#fff', background:T.indigo, padding:'5px 11px', borderRadius:9, fontFamily:"'JetBrains Mono',monospace", letterSpacing:'0.14em', boxShadow:`0 0 0 3px ${T.indigoSoft}` }}>{VCODE}</span>
          <span style={{ fontSize:11, fontWeight:800, color:T.indigo }}>← энэ код</span>
        </div>
      </div>
    </div>

    <div style={{ display:'flex', gap:10, alignItems:'flex-start', padding:14, borderRadius:14, background:T.field, border:`1px solid ${T.line2}` }}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:1 }}><circle cx="12" cy="12" r="9" stroke={T.muted2} strokeWidth="2"/><path d="M12 16v-4M12 8.5h.01" stroke={T.muted2} strokeWidth="2" strokeLinecap="round"/></svg>
      <div style={{ fontSize:12, color:T.muted, lineHeight:1.5 }}>Гүйлгээ ирэхэд хэдэн минут зарцуулж магадгүй. Баталгаажуулах код бол таны хувийн мэдээлэл тул бусадтай хуваалцахгүй байхыг анхаарна уу.</div>
    </div>
  </StepCard>
);

/* ── sub-stage: code entry (OTP-style, wrong attempts + resend cooldown) ──── */
const CodeEntryStep = ({ bank, onVerified }) => {
  const [val, setVal]     = _uS9('');
  const [phase, setPhase] = _uS9('idle');
  const [attempts, setAtt]= _uS9(3);
  const [cd, setCd]       = _uS9(90);
  const [resent, setResent] = _uS9(false);

  _uE9(() => { const t = setInterval(() => setCd(c => c>0?c-1:0), 1000); return () => clearInterval(t); }, []);

  const onChange = (v) => {
    setVal(v);
    if (phase==='error' || phase==='success') setPhase('idle');
  };
  const verify = () => {
    if (val.length < 6 || phase==='success') return;
    if (val === VCODE) setPhase('success');
    else { setPhase('error'); setAtt(a => Math.max(0,a-1)); setVal(''); }
  };
  const resend = () => { if (cd>0) return; setResent(true); setCd(90); setTimeout(() => setResent(false), 2000); };

  const full = val.length === 6;
  const success = phase === 'success';

  return (
    <StepCard step={STEPS[2]} footer={
      success
        ? <StepFooter onBack={()=>{}} hideBack primaryLabel="Үргэлжлүүлэх" onPrimary={onVerified}/>
        : <StepFooter onBack={()=>{}} hideBack primaryLabel="Баталгаажуулах" onPrimary={verify} primaryDisabled={!full} primaryReason={!full?'6 оронтой кодоо оруулна уу.':undefined}/>
    }>
      <h1 style={{ fontSize:22, fontWeight:800, color:T.ink, letterSpacing:'-0.02em', margin:'0 0 10px' }}>Баталгаажуулах код</h1>
      <p style={{ fontSize:14, color:T.muted, lineHeight:1.6, margin:'0 0 22px' }}>Банкны дансанд ирсэн гүйлгээний утгад байгаа <b style={{ color:T.text }}>6 оронтой кодыг</b> оруулна уу.</p>

      <div style={{ maxWidth:340 }}>
        <CodeBoxes length={6} value={val} onChange={onChange} state={phase} autoFocus/>
      </div>

      {phase==='error' && (
        <div style={{ marginTop:14, display:'flex', alignItems:'center', gap:7, fontSize:12.5, fontWeight:700, color:T.neg }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={T.neg} strokeWidth="2"/><path d="M12 7.5v5.5M12 16.5h.01" stroke={T.neg} strokeWidth="2.2" strokeLinecap="round"/></svg>
          Код буруу байна. Үлдсэн оролдлого: {attempts}
        </div>
      )}
      {success && (
        <div style={{ marginTop:14, display:'flex', alignItems:'center', gap:7, fontSize:12.5, fontWeight:700, color:T.pos }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke={T.pos} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Код зөв байна
        </div>
      )}

      <div style={{ marginTop:24, display:'flex', alignItems:'center', justifyContent:'center', gap:7, fontSize:12.5 }}>
        {resent ? (
          <span style={{ display:'inline-flex', alignItems:'center', gap:7, color:T.indigo, fontWeight:700 }}>
            <span className="reg-spin" style={{ width:13, height:13, borderRadius:999, border:`2px solid ${T.indigoSoft}`, borderTopColor:T.indigo }}/>
            Гүйлгээ дахин илгээгдэж байна…
          </span>
        ) : (
          <>
            <span style={{ color:T.muted, fontWeight:600 }}>Гүйлгээ ирээгүй юу?</span>
            {cd>0
              ? <span style={{ color:T.muted2, fontWeight:700, fontFamily:"'JetBrains Mono',monospace" }}>Дахин илгээх · {fmtCd(cd)}</span>
              : <button onClick={resend} style={{ background:'none', border:'none', padding:0, cursor:'pointer', color:T.indigo, fontWeight:800, fontSize:12.5, fontFamily:'inherit' }}>Гүйлгээ дахин илгээх</button>}
          </>
        )}
      </div>
    </StepCard>
  );
};

/* ── sub-stage: verified summary ─────────────────────────────────────────── */
const BankVerifiedSummary = ({ bank, onNext }) => (
  <StepCard step={STEPS[2]} footer={<StepFooter onBack={()=>{}} hideBack primaryLabel="Үргэлжлүүлэх" onPrimary={onNext}/>}>
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', padding:'10px 0 6px' }}>
      <div style={{ width:80, height:80, borderRadius:26, background:'linear-gradient(135deg, #1F8A5B, #0E9F6E)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 16px 36px -12px rgba(14,159,110,.55)' }}>
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <div style={{ fontSize:22, fontWeight:800, color:T.ink, marginTop:20, letterSpacing:'-0.02em', lineHeight:1.25 }}>Данс амжилттай баталгаажлаа</div>
      <p style={{ fontSize:13.5, color:T.muted, marginTop:10, lineHeight:1.55, maxWidth:340 }}>Таны банкны дансыг зарлага гаргах дансаар бүртгэлээ.</p>
    </div>
    <div style={{ marginTop:22, background:T.field, borderRadius:16, border:`1px solid ${T.line2}`, overflow:'hidden' }}>
      {[
        { l:'Данс эзэмшигч', v:DAN_NAME },
        { l:'Банк', v:bank.name, mark:bank },
        { l:'Дансны дугаар', v:'•••• 1234' },
        { l:'IBAN', v:`MN58 ${bank.code} •••• 1234` },
      ].map((r,i) => (
        <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, padding:'14px 16px', borderTop: i?`1px solid ${T.line2}`:'none' }}>
          <span style={{ fontSize:12.5, color:T.muted, fontWeight:600 }}>{r.l}</span>
          <span style={{ display:'flex', alignItems:'center', gap:8, fontSize:13.5, fontWeight:700, color:T.ink, fontFamily:"'JetBrains Mono',monospace" }}>{r.mark && <BankMark bank={r.mark} size={22}/>}{r.v}</span>
        </div>
      ))}
    </div>
  </StepCard>
);

/* ── sub-stage: KYC complete ──────────────────────────────────────────────── */
const KycComplete = () => {
  const items = ['Утас баталгаажсан','И-мэйл баталгаажсан','Банкны данс баталгаажсан','Танин баталгаажуулалт хийгдсэн','Мастер гэрээ баталгаажсан'];
  return (
    <StepCard step={STEPS[8]} footer={
      <div style={{ width:'100%', display:'flex', justifyContent:'flex-end' }}>
        <a href="04 Dashboard.html?state=empty" style={{ height:52, padding:'0 24px', borderRadius:14, background:T.indigo, color:'#fff', border:'none', fontWeight:700, fontSize:15, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:10 }}>
          Нүүр хуудас руу очих
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </a>
      </div>
    }>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', padding:'8px 0 6px' }}>
        <div style={{ width:84, height:84, borderRadius:28, background:`linear-gradient(135deg, ${T.indigo}, ${T.blue})`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 18px 40px -12px ${T.indigo}8C` }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{ fontSize:23, fontWeight:800, color:T.ink, marginTop:20, letterSpacing:'-0.02em', lineHeight:1.2 }}>Бүртгэл амжилттай баталгаажлаа</div>
        <p style={{ fontSize:13.5, color:T.muted, marginTop:10, lineHeight:1.55, maxWidth:340 }}>Таны бүртгэл, гэрээ болон банкны данс амжилттай баталгаажлаа.</p>
      </div>
      <div style={{ marginTop:22, background:T.field, borderRadius:16, border:`1px solid ${T.line2}`, padding:6 }}>
        {items.map((t,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 12px', borderTop: i?`1px solid ${T.line2}`:'none' }}>
            <div style={{ width:24, height:24, borderRadius:999, background:T.posSoft, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke={T.pos} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span style={{ fontSize:13.5, fontWeight:600, color:T.text }}>{t}</span>
          </div>
        ))}
      </div>
    </StepCard>
  );
};

/* ── Step9 wrapper — owns the sub-stage state machine ────────────────────── */
const Step9BankVerify = ({ onNext, onBack }) => {
  // Bank verification now sits right after email (reg step 3), so it advances
  // into the rest of the flow via onNext instead of ending in KycComplete.
  const [stage, setStage] = _uS9('form');   // form -> sending -> info -> code -> verified
  const [bank, setBank] = _uS9(null);

  if (stage === 'form')     return <BankForm onSubmit={(b) => { setBank(b); setStage('sending'); }} onBack={onBack}/>;
  if (stage === 'sending')  return <DepositSending bank={bank} onDone={() => setStage('info')}/>;
  if (stage === 'info')     return <DepositInfo bank={bank} onNext={() => setStage('code')}/>;
  if (stage === 'code')     return <CodeEntryStep bank={bank} onVerified={() => setStage('verified')}/>;
  return <BankVerifiedSummary bank={bank} onNext={onNext}/>;
};

Object.assign(window, { Step9BankVerify, KycComplete });
