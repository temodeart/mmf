// order_modal.jsx — MMF Web · Pass 03
// Single reusable confirm modal: buy + sell variants, OTP + password gate, no double-submit.
// Steps: review → auth → submitting → success | error
// <script type="text/babel" src="order_modal.jsx"></script>  (after comp_kit.jsx)

const { useState: _useStateOM, useRef: _useRefOM, useEffect: _useEffectOM } = React;
const { T, WebButton, WebModal, WebDisclaimer } = window;

const _OM_TL = { cd:'Хадгаламжийн сертификат', trust:'Итгэлцэл', inv:'Нэхэмжлэх', cp:'Арилжааны бичиг' };
const _OM_TC = { cd:{c1:'#2D6BFF',c2:'#4F46E5'}, trust:{c1:'#4F46E5',c2:'#7C3AED'}, inv:{c1:'#0E9F6E',c2:'#0891B2'}, cp:{c1:'#FF6B2C',c2:'#DC2626'} };
const _omInit = s => s.replace('ББСБ','').replace('банк','').trim().split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase();

/* ── helpers ── */
const _OMHead = ({ label }) => (
  <div style={{ fontSize:10.5, fontWeight:700, letterSpacing:'.12em', color:T.muted2, textTransform:'uppercase', marginBottom:10 }}>{label}</div>
);
const _OMRow = ({ label, value, big, pos, last, wrapVal }) => (
  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, padding:big?'10px 0':'8px 0', borderBottom:last?'none':`1px solid ${T.line2}` }}>
    <span style={{ fontSize:big?14:13, fontWeight:big?800:600, color:big?T.ink:T.muted, whiteSpace:'nowrap', flexShrink:0 }}>{label}</span>
    <span style={{ fontSize:big?16:13.5, fontWeight:big?800:700, color:pos?T.pos:T.ink, fontFamily:"'JetBrains Mono',monospace", fontVariantNumeric:'tabular-nums', textAlign:'right', whiteSpace:wrapVal?'normal':'nowrap' }}>{value}</span>
  </div>
);

/* ── WebPinInput — 4-digit transaction PIN, web-sized PinDots parity (P2) ──
   Masked cells, auto-advance, backspace focus-back, R0 focus ring.          */
const WebPinInput = ({ length=4, onChange, error, disabled }) => {
  const [vals, setVals] = _useStateOM(Array(length).fill(''));
  const refs = _useRefOM([]);
  const set = (i, v) => {
    const d = v.replace(/\D/g,'').slice(-1);
    const next = [...vals]; next[i] = d; setVals(next);
    onChange && onChange(next.join(''));
    if (d && i < length-1) refs.current[i+1] && refs.current[i+1].focus();
  };
  const key = (i, e) => { if (e.key==='Backspace' && !vals[i] && i>0) refs.current[i-1] && refs.current[i-1].focus(); };
  return (
    <div style={{ display:'flex', gap:14, justifyContent:'center' }}>
      {vals.map((v,i) => (
        <input key={i} ref={el => refs.current[i]=el} value={v} disabled={disabled} inputMode="numeric" maxLength={1} aria-label={`PIN ${i+1}`}
          onChange={e => set(i, e.target.value)} onKeyDown={e => key(i,e)}
          style={{ width:60, height:64, textAlign:'center', border:`2px solid ${error?T.neg:(v?T.indigo:T.line)}`, borderRadius:16, background:v?T.surface:T.field, fontFamily:"'JetBrains Mono',monospace", fontSize:26, fontWeight:700, color:T.ink, outline:'none', WebkitTextSecurity:v?'disc':'none', boxShadow:v&&!error?`0 0 0 4px ${T.indigoSoft}`:'none', transition:'all .12s' }}/>
      ))}
    </div>
  );
};

/* ══ PinResetFlow — shared OTP→new-PIN sheet (order modal forgot-link + profile security tab)
   NO current-PIN entry: a forgot-PIN user can't supply it; OTP re-verify is the gate
   (mobile parity). Steps: otp → pin (create + confirm) → success. ══ */
const _PR_RESEND = 30;
const PinResetFlow = ({ phoneHint = '+976 •••• 4127', onExit, onSuccess, doneLabel = 'Дуусгах' }) => {
  const [step, setStep]         = _useStateOM('otp');
  const [otp, setOtp]           = _useStateOM('');
  const [otpErr, setOtpErr]     = _useStateOM('');
  const [otpKey, setOtpKey]     = _useStateOM(0);
  const [cool, setCool]         = _useStateOM(_PR_RESEND);
  const [verifying, setVerify]  = _useStateOM(false);
  const [pin1, setPin1]         = _useStateOM('');
  const [pin2, setPin2]         = _useStateOM('');
  const [pinErr, setPinErr]     = _useStateOM('');
  const [pinKey, setPinKey]     = _useStateOM(0);

  _useEffectOM(() => {
    if (step !== 'otp' || cool <= 0) return;
    const t = setInterval(() => setCool(c => (c <= 1 ? (clearInterval(t), 0) : c - 1)), 1000);
    return () => clearInterval(t);
  }, [step, cool]);

  const mm = String(Math.floor(cool/60)); const ss = String(cool%60).padStart(2,'0');

  const verifyOtp = () => {
    if (otp.length !== 6) return;
    setVerify(true);
    setTimeout(() => {
      setVerify(false);
      if (otp === '000000') { setOtpErr('Код буруу байна. Дахин оролдоно уу.'); setOtp(''); setOtpKey(k=>k+1); return; }
      setStep('pin');
    }, 700);
  };
  const resend = () => { if (cool > 0) return; setOtp(''); setOtpErr(''); setOtpKey(k=>k+1); setCool(_PR_RESEND); };
  const submitPin = () => {
    if (pin1.length !== 4 || pin2.length !== 4) return;
    if (pin1 !== pin2) { setPinErr('PIN код таарахгүй байна. Дахин оруулна уу.'); setPin2(''); setPinKey(k=>k+1); return; }
    setStep('success'); onSuccess && onSuccess();
  };

  const glyphBox = g => <div style={{ width:52, height:52, borderRadius:15, background:T.indigoSoft, display:'flex', alignItems:'center', justifyContent:'center', margin:'2px auto 16px' }}>{g}</div>;

  return (
    <div style={{ padding:'4px 0 8px' }}>
      {step === 'otp' && (
        <>
          {glyphBox(<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M4 5h16v14H4z" stroke={T.indigo} strokeWidth="1.9"/><path d="M4 6l8 7 8-7" stroke={T.indigo} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/></svg>)}
          <div style={{ fontSize:16, fontWeight:800, color:T.ink, letterSpacing:'-0.01em', textAlign:'center' }}>Гүйлгээний PIN сэргээх</div>
          <p style={{ fontSize:12.5, fontWeight:500, color:T.muted, lineHeight:1.6, margin:'8px auto 18px', maxWidth:330, textAlign:'center' }}>
            Бид таны бүртгэлтэй мобайл дугаар <b style={{ color:T.text }}>{phoneHint}</b> руу 6 оронтой баталгаажуулах код илгээлээ.
          </p>
          <window.WebOTPInput key={otpKey} length={6} onComplete={c => { setOtp(c); setOtpErr(''); }}/>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:12, fontSize:12.5, fontWeight:600, color:T.muted }}>
            <span style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ width:8, height:8, borderRadius:99, background: otp.length===6 ? T.pos : T.line }}/>
              {otp.length===6 ? 'Код бэлэн' : (cool>0 ? `Код ${mm}:${ss} хүчинтэй` : 'Код хүчингүй болсон')}
            </span>
            <button onClick={resend} disabled={cool>0} style={{ color: cool>0?T.muted2:T.indigo, fontWeight:700, background:'none', border:'none', cursor:cool>0?'default':'pointer', fontFamily:'inherit', fontSize:12.5, padding:0 }}>
              {cool>0 ? `Дахин илгээх (${mm}:${ss})` : 'Дахин илгээх'}
            </button>
          </div>
          {otpErr && <div style={{ marginTop:14 }}><window.WebErrorState variant="neg" title="Код буруу байна" body={otpErr}/></div>}
          <div style={{ marginTop:20, display:'flex', flexDirection:'column', gap:10 }}>
            <WebButton variant="primary" full disabled={otp.length!==6 || verifying} reason={otp.length!==6 ? '6 оронтой кодоо бүрэн оруулна уу.' : undefined} onClick={verifyOtp}>
              {verifying ? 'Шалгаж байна…' : 'Үргэлжлүүлэх'}
            </WebButton>
            {onExit && <WebButton variant="ghost" full onClick={onExit}>Болих</WebButton>}
          </div>
        </>
      )}

      {step === 'pin' && (
        <>
          {glyphBox(<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="4.5" y="10.5" width="15" height="10" rx="3" stroke={T.indigo} strokeWidth="2"/><path d="M8 10.5V8a4 4 0 018 0v2.5" stroke={T.indigo} strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="15.5" r="1.6" fill={T.indigo}/></svg>)}
          <div style={{ fontSize:16, fontWeight:800, color:T.ink, letterSpacing:'-0.01em', textAlign:'center' }}>Шинэ гүйлгээний PIN</div>
          <p style={{ fontSize:12.5, fontWeight:500, color:T.muted, lineHeight:1.6, margin:'8px auto 18px', maxWidth:330, textAlign:'center' }}>
            4 оронтой шинэ PIN код үүсгэнэ үү. Одоогийн PIN шаардлагагүй.
          </p>
          <div style={{ fontSize:12, fontWeight:700, color:T.text, textAlign:'center', marginBottom:10 }}>Шинэ PIN код</div>
          <WebPinInput key={'a'+pinKey} length={4} onChange={p => { setPin1(p); if (pinErr) setPinErr(''); }}/>
          <div style={{ fontSize:12, fontWeight:700, color:T.text, textAlign:'center', margin:'18px 0 10px' }}>PIN код давтах</div>
          <WebPinInput key={'b'+pinKey} length={4} error={!!pinErr} onChange={p => { setPin2(p); if (pinErr) setPinErr(''); }}/>
          {pinErr && <div style={{ fontSize:12.5, color:T.neg, fontWeight:700, textAlign:'center', marginTop:14 }}>{pinErr}</div>}
          <div style={{ marginTop:22, display:'flex', flexDirection:'column', gap:10 }}>
            <WebButton variant="primary" full disabled={pin1.length!==4 || pin2.length!==4} reason={(pin1.length!==4||pin2.length!==4) ? '4 оронтой PIN кодоо хоёуланг нь оруулна уу.' : undefined} onClick={submitPin}>PIN хадгалах</WebButton>
            {onExit && <WebButton variant="ghost" full onClick={onExit}>Болих</WebButton>}
          </div>
        </>
      )}

      {step === 'success' && (
        <div style={{ textAlign:'center', padding:'12px 0 4px' }}>
          <div style={{ width:72, height:72, borderRadius:999, background:`${T.pos}1A`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 18px' }}>
            <div style={{ width:52, height:52, borderRadius:999, background:T.pos, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 10px 24px -8px ${T.pos}80` }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
          <div style={{ fontSize:20, fontWeight:800, color:T.ink, letterSpacing:'-0.02em' }}>Гүйлгээний PIN шинэчлэгдлээ</div>
          <div style={{ fontSize:13, color:T.muted, marginTop:10, lineHeight:1.55, maxWidth:330, marginLeft:'auto', marginRight:'auto' }}>Шинэ PIN кодоо гүйлгээ баталгаажуулахад ашиглана уу. Түгжигдсэн гүйлгээ дахин нээгдлээ.</div>
          <div style={{ marginTop:20 }}><WebButton variant="primary" full onClick={onExit}>{doneLabel}</WebButton></div>
        </div>
      )}
    </div>
  );
};

/* ── Success toast ── */
const _Toast = ({ show, children }) => (
  <div style={{ position:'fixed', top:24, left:'50%', transform:`translateX(-50%) translateY(${show?'0':'-160%'})`, zIndex:80, transition:'transform .3s cubic-bezier(.2,.8,.2,1)', display:'flex', alignItems:'center', gap:10, padding:'12px 18px', borderRadius:14, background:T.ink, color:'#fff', boxShadow:'0 16px 40px -12px rgba(0,0,0,.4)', fontSize:13.5, fontWeight:700 }}>
    <span style={{ width:22, height:22, borderRadius:99, background:T.pos, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </span>
    {children}
  </div>
);

/* ── ConfirmOrderModal ─────────────────────────────────────────
   Props:
     open (bool) · onClose (fn) · instrument (obj) · qty (num)
     side ('buy'|'sell') · calc ({fee,total,gross,net})
     onConfirmed (fn)  — called after success
   Steps: review → auth → submitting → success | error
   No double-submit: step set to 'submitting' before async, button disabled.
   ─────────────────────────────────────────────────────────── */
const _PIN_MAX_ATTEMPTS = 3;
const ConfirmOrderModal = ({ open, onClose, instrument:inst, qty, side='buy', calc={}, balance=Infinity, onTopup, onConfirmed, reinvest=false, _forceStep }) => {
  const [step,      setStep]      = _useStateOM('review');
  const [pin,       setPin]       = _useStateOM('');
  const [pinErr,    setPinErr]    = _useStateOM('');
  const [pinKey,    setPinKey]    = _useStateOM(0);
  const [attempts,  setAttempts] = _useStateOM(_PIN_MAX_ATTEMPTS);
  const [errMsg,    setErrMsg]    = _useStateOM('');
  const [toast,     setToast]     = _useStateOM(false);
  const [forgotOpen,setForgotOpen]= _useStateOM(false);

  if (!open || !inst) return null;
  const tc = _OM_TC[inst.type] || _OM_TC.trust;
  const activeStep = _forceStep || step;          /* _forceStep used only in preview */

  const canConfirm = pin.length === 4 && attempts > 0;   /* 4-digit transaction PIN */

  const reset = () => { setStep('review'); setPin(''); setPinErr(''); setErrMsg(''); setToast(false); setPinKey(k => k+1); setAttempts(_PIN_MAX_ATTEMPTS); setForgotOpen(false); };
  const close = () => { reset(); onClose?.(); };

  /* submit: set 'submitting' synchronously → no second click possible */
  const submit = () => {
    if (activeStep === 'submitting') return;        /* hard double-submit guard */
    if (!canConfirm) return;
    setStep('submitting');
    setTimeout(() => {                              /* swap for real API call in prod */
      if (pin === '0000') {                          /* demo: wrong PIN → decrement attempts */
        const left = attempts - 1;
        setAttempts(left);
        setPin(''); setPinKey(k => k+1);
        if (left <= 0) {
          setStep('locked');
        } else {
          setPinErr(`Буруу PIN код. Үлдсэн оролдлого: ${left}`);
          setStep('auth');
        }
      } else {
        setStep('success'); setToast(true); onConfirmed?.();
        setTimeout(() => setToast(false), 3400);
      }
    }, 1100);
  };

  const fmt   = window.formatMNT  || (n => '₮\u00A0' + Math.abs(Math.round(n||0)).toLocaleString('en-US'));
  const frate = window.formatRate || (n => (n||0).toFixed(1)+'% жилийн');
  const fdt   = window.formatDate || (d => (new Date(d)).toISOString().slice(0,10).replace(/-/g,'.'));

  /* order-flow gating + verified yield/tax math */
  const subtotal   = (inst.unit||0) * (qty||0);
  const totalCost  = calc.total != null ? calc.total : subtotal + Math.round(subtotal*0.001);
  const invalidQty = !(qty > 0);
  const insufficient = side==='buy' && totalCost > balance;
  const shortBy    = insufficient ? totalCost - balance : 0;
  const _interest  = calc.interest != null ? calc.interest : Math.max(0, (calc.gross||subtotal) - subtotal);
  const _tax       = calc.tax      != null ? calc.tax      : Math.round(_interest * 0.10);
  const _netYield  = calc.netYield != null ? calc.netYield : _interest - _tax;
  const _payout    = calc.payout   != null ? calc.payout   : subtotal + _netYield;

  /* ── Footer per step ── */
  const footer = () => {
    if (activeStep === 'review') {
      const rReason = invalidQty ? 'Тоо ширхэгээ оруулна уу.' : insufficient ? 'Үлдэгдэл хүрэлцэхгүй байна.' : undefined;
      return <WebButton variant="primary" full disabled={!!rReason} reason={rReason} onClick={() => setStep('auth')}>Баталгаажуулалт руу үргэлжлүүлэх →</WebButton>;
    }
    if (activeStep === 'auth' || activeStep === 'submitting') {
      if (forgotOpen) return null;   /* PinResetFlow owns its own step buttons */
      return (
        <WebButton
          variant={side==='buy'?'pos':'neg'} full
          disabled={!canConfirm || activeStep==='submitting'}
          reason={activeStep!=='submitting' ? (!canConfirm ? 'Гүйлгээний PIN кодоо бүрэн оруулна уу.' : undefined) : undefined}
          onClick={submit}
        >
          {activeStep==='submitting' ? 'Баталгаажуулж байна…' : (side==='buy'?'Авах захиалга баталгаажуулах':'Зарах захиалга баталгаажуулах')}
        </WebButton>
      );
    }
    if (activeStep === 'locked') return (
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        <WebButton variant="primary" full onClick={() => { window.location.href = '07 Profile.html?pin=reset'; }}>ПИН сэргээх</WebButton>
        <WebButton variant="ghost"   full onClick={close}>Хаах</WebButton>
      </div>
    );
    if (activeStep === 'success') return (
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        <WebButton variant="primary" full onClick={() => { window.location.href = '06 Wallet.html'; }}>Багц руу очих</WebButton>
        <WebButton variant="ghost"   full onClick={close}>Арилжаа үргэлжлүүлэх</WebButton>
      </div>
    );
    if (activeStep === 'error') return (
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        <WebButton variant="primary" full onClick={() => { setErrMsg(''); setStep('auth'); }}>Дахин оролдох</WebButton>
        <WebButton variant="ghost"   full onClick={close}>Цуцлах</WebButton>
      </div>
    );
  };

  return (
    <>
    <_Toast show={toast && activeStep==='success'}>Захиалга амжилттай баталгаажлаа</_Toast>
    <WebModal open onClose={close}
      logo={_omInit(inst.bank)} logoColor={`linear-gradient(135deg,${tc.c1},${tc.c2})`}
      title={inst.bank} ticker={inst.ticker}
      footer={footer()}
    >
      {/* ── Step: review ── */}
      {activeStep === 'review' && (
        <>
          <div style={{ marginBottom:16 }}>
            <_OMHead label="Нөхцөл"/>
            <_OMRow label="Тал"          value={(side==='buy'?'Авах · ':'Зарах · ')+(_OM_TL[inst.type]||'')} wrapVal/>
            <_OMRow label="Үр шим / Хүү" value={frate(inst.rate)} pos/>
            <_OMRow label="Хугацаа"      value={(inst.term||inst.left||0)+' хоног'}/>
            <_OMRow label="Дуусах огноо" value={fdt(inst.mat)} last={!reinvest}/>
            {reinvest && <_OMRow label="Хугацаа дуусахад" value="Үндсэн дүн дахин авна · хүү хэтэвчид" wrapVal last/>}
          </div>
          <div style={{ marginBottom:16 }}>
            <_OMHead label="Зардал"/>
            <_OMRow label="Нэгж үнэ"       value={fmt(inst.unit)}/>
            <_OMRow label="Тоо ширхэг"      value={qty+' ширхэг'}/>
            <_OMRow label="Шимтгэл (0.1%)" value={fmt(calc.fee||0)}/>
            <_OMRow label="Нийт төлбөр"    value={fmt(totalCost)} big last/>
          </div>
          {invalidQty && (
            <div style={{ marginBottom:16, padding:'11px 14px', background:T.warnSurface, border:`1px solid ${T.warnBorder}`, borderRadius:12, fontSize:12.5, fontWeight:700, color:T.warn }}>Тоо ширхэгээ оруулж захиалгаа үргэлжлүүлнэ үү.</div>
          )}
          {insufficient && (
            <div style={{ marginBottom:16, padding:'13px 15px', background:T.negSoft, border:`1px solid ${T.negBorder}`, borderRadius:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', gap:10 }}>
                <span style={{ fontSize:13, fontWeight:800, color:T.neg }}>Үлдэгдэл хүрэлцэхгүй байна</span>
                <span style={{ fontSize:13, fontWeight:800, color:T.neg, fontFamily:"'JetBrains Mono',monospace" }}>−{fmt(shortBy)}</span>
              </div>
              <div style={{ fontSize:12, fontWeight:600, color:T.text, marginTop:6, lineHeight:1.5 }}>Захиалгыг үргэлжлүүлэхийн тулд хэтэвчээ цэнэглэнэ үү.</div>
              <button onClick={onTopup} style={{ marginTop:10, display:'inline-flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:10, border:'none', background:T.neg, color:'#fff', fontSize:12.5, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
                Хэтэвч цэнэглэх
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          )}
          {side === 'buy' && (
            <div style={{ marginBottom:16, padding:'14px 15px', background:T.posSoft, borderRadius:12, border:`1px solid ${T.posBorder}` }}>
              <_OMHead label="Хүлээгдэж буй өгөөж"/>
              <_OMRow label={'Хүү · '+frate(inst.rate)} value={'+'+fmt(_interest)} pos/>
              <_OMRow label="Татвар (10%)" value={'−'+fmt(_tax)}/>
              <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:`1px solid ${T.posBorder}` }}>
                <span style={{ fontSize:13, fontWeight:700, color:T.pos }}>Цэвэр өгөөж</span>
                <span style={{ fontSize:13.5, fontWeight:800, color:T.pos, fontFamily:"'JetBrains Mono',monospace" }}>+{fmt(_netYield)}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', paddingTop:10 }}>
                <span style={{ fontSize:14, fontWeight:800, color:T.ink }}>Хугацааны эцэст авах</span>
                <span style={{ fontSize:16, fontWeight:800, color:T.ink, fontFamily:"'JetBrains Mono',monospace" }}>{fmt(_payout)}</span>
              </div>
            </div>
          )}
          <WebDisclaimer>
            Захиалга нь <span title="Нөхцөл: (1) сонгосон хугацаанд нэгж үнэ тогтоогдох, (2) эсрэг талын захиалгатай тоо хэмжээгээр нийцэх, (3) Хэтэвчинд шаардлагатай үлдэгдэл хэвээр байх." style={{ textDecoration:'underline dotted', textUnderlineOffset:3, cursor:'help' }}>нөхцөл биелтэл хүчинтэй</span>. Баталгаажуулсны дараа цуцлах боломжгүй.
          </WebDisclaimer>
        </>
      )}

      {/* ── Step: auth | submitting — 4-digit transaction PIN (P2 parity) ── */}
      {(activeStep === 'auth' || activeStep === 'submitting') && !forgotOpen && (
        <>
          <div style={{ marginBottom:18, textAlign:'center' }}>
            <div style={{ width:48, height:48, borderRadius:14, background:T.indigoSoft, display:'flex', alignItems:'center', justifyContent:'center', margin:'2px auto 14px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2.5" stroke={T.indigo} strokeWidth="1.9"/><path d="M8 11V8a4 4 0 018 0v3" stroke={T.indigo} strokeWidth="1.9" strokeLinecap="round"/></svg>
            </div>
            <div style={{ fontSize:15, fontWeight:800, color:T.ink, letterSpacing:'-0.01em' }}>Гүйлгээний PIN код</div>
            <div style={{ fontSize:12.5, fontWeight:600, color:T.muted, marginTop:6, lineHeight:1.5, maxWidth:320, marginLeft:'auto', marginRight:'auto' }}>Захиалгаа баталгаажуулахын тулд 4 оронтой гүйлгээний PIN кодоо оруулна уу.</div>
          </div>
          <div style={{ opacity:activeStep==='submitting'?.55:1, pointerEvents:activeStep==='submitting'?'none':'auto' }}>
            <WebPinInput key={pinKey} length={4} error={!!pinErr}
              onChange={p => { setPin(p); if (pinErr) setPinErr(''); }}
              disabled={activeStep==='submitting'}/>
          </div>
          {pinErr && <div style={{ fontSize:12.5, color:T.neg, fontWeight:700, textAlign:'center', marginTop:14 }}>{pinErr}</div>}
          {!pinErr && attempts < _PIN_MAX_ATTEMPTS && (
            <div style={{ fontSize:12, color:T.muted, fontWeight:600, textAlign:'center', marginTop:14 }}>Үлдсэн оролдлого: {attempts}</div>
          )}
          <div style={{ textAlign:'center', marginTop:16 }}>
            <button onClick={() => setForgotOpen(true)} style={{ color:T.indigo, fontWeight:700, background:'none', border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:12.5, padding:'4px 8px', borderRadius:8, minHeight:0 }}>PIN код мартсан уу?</button>
          </div>
          <div style={{ marginTop:16, padding:'10px 14px', background:T.line2, borderRadius:10, display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontSize:12, color:T.muted, fontWeight:600 }}>Баталгаажуулах дүн</span>
            <span style={{ fontSize:13, fontWeight:800, color:T.ink, fontFamily:"'JetBrains Mono',monospace" }}>{fmt(totalCost)}</span>
          </div>
        </>
      )}

      {/* ── Step: success ── */}
      {activeStep === 'success' && (
        <div style={{ textAlign:'center', padding:'28px 0 8px' }}>
          <div style={{ width:72, height:72, borderRadius:999, background:`${T.pos}1A`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
            <div style={{ width:52, height:52, borderRadius:999, background:T.pos, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 10px 24px -8px ${T.pos}80` }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
          <div style={{ fontSize:22, fontWeight:800, color:T.ink, letterSpacing:'-0.02em' }}>Захиалга амжилттай!</div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, marginTop:12 }}>
            <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11.5, fontWeight:700, color:T.pos, background:T.posSoft, padding:'4px 10px', borderRadius:99 }}><span style={{ width:6, height:6, borderRadius:99, background:T.pos }}/>Шинэ</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke={T.muted2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11.5, fontWeight:700, color:T.warn, background:T.warnSoft, padding:'4px 10px', borderRadius:99 }}><span style={{ width:6, height:6, borderRadius:99, background:T.warn }}/>Идэвхтэй</span>
          </div>
          <div style={{ fontSize:13.5, color:T.muted, marginTop:12, lineHeight:1.55 }}>Захиалга <b style={{ color:T.text }}>Шинэ</b> төлөвт бүртгэгдэж, тооцоо хийгдмэгц <b style={{ color:T.text }}>Идэвхтэй</b> болно. Дэлгэрэнгүйг багцаасаа харна уу.</div>
          <div style={{ marginTop:20, padding:'12px 14px', background:T.line2, borderRadius:10, display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontSize:12, color:T.muted, fontWeight:600 }}>Нийт төлбөр</span>
            <span style={{ fontSize:13, fontWeight:800, color:T.ink, fontFamily:"'JetBrains Mono',monospace" }}>{fmt(calc.total||0)}</span>
          </div>
        </div>
      )}

      {/* ── Forgot-PIN → in-place OTP re-verify → new PIN (shared PinResetFlow) ── */}
      {(activeStep === 'auth' || activeStep === 'submitting') && forgotOpen && (
        <PinResetFlow phoneHint="+976 •••• 4127" doneLabel="Буцах" onExit={() => setForgotOpen(false)}/>
      )}
      {activeStep === 'locked' && (
        <div style={{ textAlign:'center', padding:'28px 0 8px' }}>
          <div style={{ width:72, height:72, borderRadius:999, background:T.negSoft, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
            <div style={{ width:52, height:52, borderRadius:999, background:T.neg, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 10px 24px -8px ${T.neg}80` }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2.5" stroke="#fff" strokeWidth="2"/><path d="M8 11V8a4 4 0 018 0v3" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="15.5" r="1.4" fill="#fff"/></svg>
            </div>
          </div>
          <div style={{ fontSize:22, fontWeight:800, color:T.ink, letterSpacing:'-0.02em' }}>PIN код түгжигдлээ</div>
          <div style={{ fontSize:13.5, color:T.muted, marginTop:10, lineHeight:1.55, maxWidth:340, marginLeft:'auto', marginRight:'auto' }}>3 удаа буруу PIN код оруулсан тул аюулгүй байдлын үүднээс түгжлээ. PIN кодоо сэргээнэ үү.</div>
        </div>
      )}

      {activeStep === 'error' && (
        <div style={{ textAlign:'center', padding:'28px 0 8px' }}>
          <div style={{ width:72, height:72, borderRadius:999, background:T.negSoft, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
            <div style={{ width:52, height:52, borderRadius:999, background:T.neg, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 10px 24px -8px ${T.neg}80` }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M6 18L18 6M6 6l12 12" stroke="#fff" strokeWidth="2.6" strokeLinecap="round"/></svg>
            </div>
          </div>
          <div style={{ fontSize:22, fontWeight:800, color:T.ink, letterSpacing:'-0.02em' }}>Баталгаажуулалт амжилтгүй</div>
          <div style={{ fontSize:13.5, color:T.muted, marginTop:10, lineHeight:1.55 }}>{errMsg || 'Гүйлгээг боловсруулахад алдаа гарлаа. Дахин оролдоно уу.'}</div>
        </div>
      )}
    </WebModal>
    </>
  );
};

Object.assign(window, { ConfirmOrderModal, WebPinInput, PinResetFlow });
