// ============================================================
// Money Market Fund — Onboarding flow v2 (registration → signing → home access)
// Extends screens.jsx. Reuses the same atoms / visual language.
// All copy in Mongolian Cyrillic. White-first, regulated fintech.
// ============================================================

const { useState, useRef, useEffect } = React;

// Shared atoms pulled from screens.jsx (already loaded + exported to window)
const { Frame, C, PillBtn, BackBar, SignupStepHeader, LogoMark, Dot, Badge, DanLogo } = window;

const TOTAL_STEPS = 8;

// ----- Small shared helpers for this flow -----

// 6-box OTP row with a couple of digits filled + resend timer
const OtpRow = ({ filled = ['4','7','2',''] }) => {
  const otp = [...filled, ...Array(6 - filled.length).fill('')].slice(0, 6);
  const next = otp.findIndex(x => !x);
  return (
    <div style={{ display:'flex', gap: 8 }}>
      {otp.map((d, i) => (
        <div key={i} style={{
          flex: 1, height: 54, borderRadius: 12, background:'#fff',
          border: `1.5px solid ${d ? C.indigo : (i === next ? C.indigo : C.line)}`,
          boxShadow: (!d && i === next) ? `0 0 0 3px ${C.indigoSoft}` : 'none',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize: 22, fontWeight: 700, color: C.ink, fontVariantNumeric:'tabular-nums',
        }}>{d}</div>
      ))}
    </div>
  );
};

const OtpHeaderRow = ({ timer = '00:42' }) => (
  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 8 }}>
    <div style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Баталгаажуулах код</div>
    <span style={{ fontSize: 11, fontWeight: 700, color: C.indigo, fontVariantNumeric:'tabular-nums' }}>{timer} · Дахин илгээх</span>
  </div>
);

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
const PhoneVerify = () => {
  // 'idle' = code not sent yet · 'sent' = OTP dispatched
  const [sent, setSent] = useState(false);
  return (
    <Frame label="07 — Phone verification">
      <SignupStepHeader step={1} total={TOTAL_STEPS} title="Утасны баталгаажуулалт" nextLabel="И-мэйл"/>
      <div style={{ flex: 1, overflow:'auto', padding: '16px 24px 24px' }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.ink, letterSpacing:'-0.02em', lineHeight: 1.18 }}>
          Утасны дугаараа<br/>баталгаажуулна уу
        </div>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 10, lineHeight: 1.5 }}>
          {sent
            ? 'Бид таны утсанд баталгаажуулах код илгээлээ.'
            : 'Үргэлжлүүлэхийн тулд утасны дугаараа баталгаажуулна уу.'}
        </div>

        {/* Phone */}
        <div style={{ marginTop: 26 }}>
          <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 8 }}>Утасны дугаар</div>
          <div style={{
            height: 52, borderRadius: 14, background:'#fff',
            border:`1.5px solid ${sent ? C.indigo : C.line}`,
            boxShadow: sent ? `0 0 0 4px ${C.indigoSoft}` : 'none',
            display:'flex', alignItems:'center', padding:'0 8px 0 16px', gap: 10,
          }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.ink, paddingRight: 10, borderRight:`1px solid ${C.line}`, fontVariantNumeric:'tabular-nums' }}>+976</span>
            <span style={{ fontSize: 15, fontWeight: 600, color: C.ink, fontVariantNumeric:'tabular-nums', letterSpacing:'0.04em' }}>9552 2981</span>
            {sent ? (
              <span style={{ marginLeft:'auto', marginRight: 8, display:'inline-flex', alignItems:'center', gap: 4, color: C.green, fontSize: 11, fontWeight: 700 }}>
                <Dot color={C.green}/>Илгээсэн
              </span>
            ) : (
              <button onClick={()=>setSent(true)} style={{
                marginLeft:'auto', height: 36, padding:'0 14px', borderRadius: 10,
                background: C.indigo, color:'#fff', border:'none', cursor:'pointer',
                fontSize: 12.5, fontWeight: 700, fontFamily:'inherit', flexShrink: 0,
                display:'inline-flex', alignItems:'center', gap: 6,
                boxShadow:'0 6px 16px -8px rgba(79,70,229,.6)',
              }}>
                Код илгээх
              </button>
            )}
          </div>
        </div>

        {/* OTP */}
        {sent ? (
          <div style={{ marginTop: 22 }}>
            <OtpHeaderRow/>
            <OtpRow filled={['4','7','2','']}/>
            <div style={{ marginTop: 14, fontSize: 12, color: C.muted, lineHeight: 1.5 }}>
              Код хүлээж аваагүй бол <span style={{ color: C.muted2 }}>00:42</span>-ийн дараа дахин илгээх боломжтой.
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 22 }}>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 8 }}>Баталгаажуулах код</div>
            <div style={{ display:'flex', gap: 8, opacity: .5 }}>
              {[0,1,2,3,4,5].map(i => (
                <div key={i} style={{ flex: 1, height: 54, borderRadius: 12, background:'#F4F6FA', border:`1.5px solid ${C.line}` }}/>
              ))}
            </div>
            <div style={{ marginTop: 14, display:'flex', alignItems:'flex-start', gap: 8, fontSize: 12, color: C.muted, lineHeight: 1.5 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="9" stroke={C.muted2} strokeWidth="2"/><path d="M12 11v5M12 8h.01" stroke={C.muted2} strokeWidth="2.2" strokeLinecap="round"/></svg>
              <span>Дээрх дугаар луу код илгээхийн тулд <span style={{ color: C.ink, fontWeight: 700 }}>Код илгээх</span> товчийг дарна уу.</span>
            </div>
          </div>
        )}
      </div>
      <FooterCTA><span style={{ opacity: sent ? 1 : .6 }}>Үргэлжлүүлэх</span></FooterCTA>
    </Frame>
  );
};

// ============================================================
// 08 — EMAIL VERIFICATION (step 2/6)  [NEW]
// ============================================================
const EmailVerify = () => (
  <Frame label="08 — Email verification">
    <SignupStepHeader step={2} total={TOTAL_STEPS} title="И-мэйл баталгаажуулалт" nextLabel="Нууц үг"/>
    <div style={{ flex: 1, overflow:'auto', padding: '16px 24px 24px' }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: C.ink, letterSpacing:'-0.02em', lineHeight: 1.18 }}>
        И-мэйл хаягаа<br/>баталгаажуулна уу
      </div>
      <div style={{ fontSize: 13, color: C.muted, marginTop: 10, lineHeight: 1.5 }}>
        Бид таны и-мэйл хаяг руу баталгаажуулах код илгээнэ.
      </div>

      {/* Email */}
      <div style={{ marginTop: 26 }}>
        <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 8 }}>И-мэйл хаяг</div>
        <div style={{
          height: 52, borderRadius: 14, background:'#fff',
          border:`1.5px solid ${C.indigo}`, boxShadow:`0 0 0 4px ${C.indigoSoft}`,
          display:'flex', alignItems:'center', padding:'0 16px', gap: 10,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke={C.muted} strokeWidth="2" fill="none"/><path d="M4 8l8 5 8-5" stroke={C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span style={{ fontSize: 15, fontWeight: 600, color: C.ink }}>temuujin@gmail.com</span>
          <span style={{ marginLeft:'auto', display:'inline-flex', alignItems:'center', gap: 4, color: C.green, fontSize: 11, fontWeight: 700 }}>
            <Dot color={C.green}/>Илгээсэн
          </span>
        </div>
      </div>

      {/* OTP */}
      <div style={{ marginTop: 22 }}>
        <OtpHeaderRow/>
        <OtpRow filled={['9','1','','']}/>
        <div style={{ marginTop: 14, fontSize: 12, color: C.muted, lineHeight: 1.5 }}>
          Кодыг и-мэйлийн <span style={{ color: C.ink, fontWeight: 700 }}>Inbox</span> эсвэл <span style={{ color: C.ink, fontWeight: 700 }}>Spam</span> хэсгээс шалгана уу.
        </div>
      </div>
    </div>
    <FooterCTA>Үргэлжлүүлэх</FooterCTA>
  </Frame>
);

// ============================================================
// 08A — CREATE PASSWORD (step 3/8)  [NEW]
// ============================================================
const PwField = ({ label, value, onChange, show, onToggle, error, placeholder }) => (
  <div>
    <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 8 }}>{label}</div>
    <div style={{
      height: 52, borderRadius: 14, background:'#fff',
      border:`1.5px solid ${error ? C.red : value ? C.indigo : C.line}`,
      boxShadow: value && !error ? `0 0 0 4px ${C.indigoSoft}` : 'none',
      padding:'0 8px 0 16px', display:'flex', alignItems:'center', gap: 8,
    }}>
      <input
        type={show ? 'text' : 'password'} value={value} onChange={(e)=>onChange(e.target.value)}
        placeholder={placeholder}
        style={{ flex: 1, minWidth: 0, border:'none', outline:'none', background:'transparent', fontSize: 15, fontWeight: 600, color: C.ink, fontFamily:'inherit', letterSpacing: show ? 0 : '0.12em' }}
      />
      <button onClick={onToggle} style={{ width: 38, height: 38, borderRadius: 10, border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>
        {show
          ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke={C.muted} strokeWidth="2" fill="none"/><circle cx="12" cy="12" r="3" stroke={C.muted} strokeWidth="2" fill="none"/></svg>
          : <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke={C.muted2} strokeWidth="2" fill="none"/><path d="M4 4l16 16" stroke={C.muted2} strokeWidth="2" strokeLinecap="round"/></svg>}
      </button>
    </div>
  </div>
);

const CreatePassword = () => {
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const rules = [
    { label:'8+ тэмдэгт', ok: pw.length >= 8 },
    { label:'1 том үсэг', ok: /[A-ZА-ЯӨҮ]/.test(pw) },
    { label:'1 тоо', ok: /\d/.test(pw) },
    { label:'1 тусгай тэмдэгт', ok: /[^A-Za-zА-Яа-яӨҮөү0-9]/.test(pw) },
  ];
  const allOk = rules.every(r => r.ok);
  const mismatch = pw2.length > 0 && pw !== pw2;
  const valid = allOk && pw2.length > 0 && pw === pw2;
  return (
    <Frame label="08A — Create password">
      <SignupStepHeader step={3} total={TOTAL_STEPS} title="Нууц үг үүсгэх" nextLabel="PIN код"/>
      <div style={{ flex: 1, overflow:'auto', padding: '16px 24px 24px' }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.ink, letterSpacing:'-0.02em', lineHeight: 1.18 }}>Нууц үг үүсгэх</div>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 10, lineHeight: 1.5 }}>
          Цаашид бүртгэлдээ нэвтрэхэд ашиглах нууц үгээ үүсгэнэ үү.
        </div>

        <div style={{ marginTop: 22, display:'flex', flexDirection:'column', gap: 16 }}>
          <PwField label="Нууц үг" value={pw} onChange={setPw} show={show} onToggle={()=>setShow(s=>!s)} placeholder="Нууц үгээ оруулна уу"/>
          <PwField label="Нууц үг давтах" value={pw2} onChange={setPw2} show={show2} onToggle={()=>setShow2(s=>!s)} error={mismatch} placeholder="Нууц үгээ давтан оруулна уу"/>
        </div>

        {mismatch && (
          <div style={{ marginTop: 10, display:'flex', alignItems:'center', gap: 6, fontSize: 12, fontWeight: 700, color: C.red }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={C.red} strokeWidth="2"/><path d="M12 7.5v5.5M12 16.5h.01" stroke={C.red} strokeWidth="2.2" strokeLinecap="round"/></svg>
            Нууц үг таарахгүй байна
          </div>
        )}

        {/* checklist */}
        <div style={{ marginTop: 18, display:'flex', flexWrap:'wrap', gap: 8 }}>
          {rules.map((r, i) => (
            <div key={i} style={{
              display:'inline-flex', alignItems:'center', gap: 7, padding:'8px 12px', borderRadius: 999,
              background: r.ok ? C.greenSoft : '#F4F6FA', color: r.ok ? C.green : C.muted,
              fontSize: 12, fontWeight: 700, transition:'all .15s',
            }}>
              {r.ok
                ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke={C.green} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                : <span style={{ width: 11, height: 11, borderRadius: 999, border:`2px solid ${C.muted2}` }}/>}
              {r.label}
            </div>
          ))}
        </div>
      </div>
      <FooterCTA onClick={valid ? ()=>{} : undefined}>
        <span style={{ opacity: valid ? 1 : .6 }}>Үргэлжлүүлэх</span>
      </FooterCTA>
    </Frame>
  );
};

// ============================================================
// 08B — CREATE TRANSACTION PIN (step 4/8)  [NEW]
// ============================================================
const PinDots = ({ count, error }) => (
  <div style={{ display:'flex', gap: 16, justifyContent:'center' }}>
    {[0,1,2,3,4,5].map(i => (
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

const CreatePin = () => {
  const [stage, setStage] = useState('create'); // create | confirm | done
  const [pin, setPin] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState(false);

  const active = stage === 'create' ? pin : confirm;
  const setActive = (v) => { stage === 'create' ? setPin(v) : setConfirm(v); };

  const onKey = (n) => {
    if (stage === 'done') return;
    if (active.length >= 6) return;
    const next = active + n;
    if (stage === 'create') {
      setPin(next);
      if (next.length === 6) setTimeout(() => setStage('confirm'), 180);
    } else {
      setError(false);
      setConfirm(next);
      if (next.length === 6) {
        setTimeout(() => {
          if (next === pin) setStage('done');
          else { setError(true); setConfirm(''); }
        }, 180);
      }
    }
  };
  const onDel = () => setActive(active.slice(0, -1));

  const title = stage === 'create' ? '6 оронтой PIN код оруулна уу'
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
// 08C — BIOMETRIC SETUP (optional, after PIN)  [NEW]
// ============================================================
const BiometricSetup = () => (
  <Frame label="08C — Biometric setup">
    <BackBar title=""/>
    <div style={{ flex: 1, overflow:'auto', padding: '8px 24px 20px', display:'flex', flexDirection:'column' }}>
      <div style={{ flex: 1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', textAlign:'center' }}>
        <div style={{ width: 96, height: 96, borderRadius: 30, background: C.indigoSoft, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M5 7a4 4 0 014-2.5M19 7a4 4 0 00-4-2.5M12 8a3 3 0 013 3v1.5M9 11a3 3 0 013-3M9 11v2c0 3 .8 4.5.8 4.5M15 12.5c0 4-.8 6.5-.8 6.5M12 11v3.5c0 2 .5 3.5.5 3.5" stroke={C.indigo} strokeWidth="1.8" strokeLinecap="round"/></svg>
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.ink, marginTop: 24, letterSpacing:'-0.02em', lineHeight: 1.2 }}>
          Биометр баталгаажуулалт<br/>ашиглах уу?
        </div>
        <div style={{ fontSize: 13.5, color: C.muted, marginTop: 12, lineHeight: 1.55, maxWidth: 300 }}>
          Цаашид гүйлгээ баталгаажуулахдаа PIN кодын оронд Face ID эсвэл хурууны хээ ашиглах боломжтой.
        </div>
        <div style={{ marginTop: 18, display:'inline-flex', alignItems:'center', gap: 6, padding:'5px 12px', borderRadius: 999, background:'#F4F6FA', color: C.muted, fontSize: 11, fontWeight: 700 }}>
          Сонголтоор
        </div>
      </div>
    </div>
    <div style={{ padding:'12px 24px 6px', background:'#fff', borderTop:`1px solid ${C.line2}`, flexShrink: 0, display:'flex', flexDirection:'column', gap: 8 }}>
      <button style={{
        width:'100%', height: 52, borderRadius: 14, background: C.indigo, color:'#fff', border:'none',
        fontWeight: 700, fontSize: 15, cursor:'pointer', boxShadow:'0 8px 22px -8px rgba(79,70,229,.5)',
      }}>Идэвхжүүлэх</button>
      <button style={{ width:'100%', height: 48, borderRadius: 14, background:'transparent', color: C.muted, border:'none', fontWeight: 700, fontSize: 14, cursor:'pointer' }}>
        Алгасах
      </button>
    </div>
  </Frame>
);

// ============================================================
// 09 — KYC · ДАН CONSENT (step 5/8)
// ============================================================
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
const CheckRow = ({ state, label }) => {
  // state: 'done' | 'loading' | 'pending'
  const glyph = state === 'done' ? (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill={C.greenSoft}/><path d="M8 12l3 3 5-6" stroke={C.green} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ) : state === 'loading' ? (
    <div className="omf-spin" style={{ width: 22, height: 22, borderRadius:999, border:`2.5px solid ${C.indigoSoft}`, borderTopColor: C.indigo }}/>
  ) : (
    <div style={{ width: 22, height: 22, borderRadius:999, border:`2px solid ${C.line}`, background:'#fff' }}/>
  );
  const color = state === 'done' ? C.ink : state === 'loading' ? C.ink : C.muted2;
  return (
    <div style={{ display:'flex', alignItems:'center', gap: 12, padding:'14px 14px' }}>
      <div style={{ flexShrink: 0 }}>{glyph}</div>
      <div style={{ flex: 1, fontSize: 13.5, fontWeight: 700, color }}>{label}</div>
      {state === 'loading' && <span style={{ fontSize: 11, fontWeight: 700, color: C.indigo }}>Шалгаж байна</span>}
    </div>
  );
};

const MonpepCheck = () => {
  const [started, setStarted] = useState(false);

  if (!started) {
    // consent / initiate view — user must press to start the check
    return (
      <Frame label="10 — MONPEP check">
        <BackBar title=""/>
        <div style={{ flex: 1, overflow:'auto', padding: '8px 24px 24px', display:'flex', flexDirection:'column' }}>
          <div style={{ display:'flex', justifyContent:'center', marginTop: 18 }}>
            <div style={{ width: 96, height: 96, borderRadius: 28, background: C.indigoSoft, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" stroke={C.indigo} strokeWidth="2" fill="none" strokeLinejoin="round"/><path d="M9 12l2 2 4-4.5" stroke={C.indigo} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>

          <div style={{ fontSize: 24, fontWeight: 800, color: C.ink, marginTop: 26, letterSpacing:'-0.02em', textAlign:'center' }}>
            MONPEP шалгалт
          </div>
          <div style={{ fontSize: 13.5, color: C.muted, marginTop: 10, lineHeight: 1.55, textAlign:'center', maxWidth: 300, marginLeft:'auto', marginRight:'auto' }}>
            Хууль тогтоомжийн дагуу таны мэдээллийг олон улсын хориг болон улс төрд нөлөө бүхий этгээдийн (MONPEP) бүртгэлтэй тулгаж шалгана.
          </div>

          <div style={{ marginTop: 22, background:'#FAFBFE', borderRadius: 16, border:`1px solid ${C.line2}`, padding: 16, display:'flex', gap: 12, textAlign:'left' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop: 1 }}><circle cx="12" cy="12" r="9" stroke={C.muted2} strokeWidth="2"/><path d="M12 16v-4M12 8.5h.01" stroke={C.muted2} strokeWidth="2" strokeLinecap="round"/></svg>
            <div style={{ fontSize: 12.5, color: C.text, lineHeight: 1.55 }}>
              Шалгалт хийхийг зөвшөөрснөөр та бүртгэлээ үргэлжлүүлэх боломжтой. Шалгалт хэдхэн секунд үргэлжилнэ.
            </div>
          </div>
          <div style={{ flex: 1 }}/>
        </div>
        <FooterCTA onClick={() => setStarted(true)}>
          Шалгалт хийхийг зөвшөөрөх
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </FooterCTA>
      </Frame>
    );
  }

  return (
  <Frame label="10 — MONPEP check">
    <div style={{ height: 56, display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>
      <LogoMark size={24}/>
    </div>
    <div style={{ flex: 1, overflow:'auto', padding: '24px 24px', display:'flex', flexDirection:'column' }}>
      {/* Spinner */}
      <div style={{ display:'flex', justifyContent:'center', marginTop: 18 }}>
        <div style={{ position:'relative', width: 96, height: 96 }}>
          <div className="omf-spin" style={{ position:'absolute', inset:0, borderRadius:999, border:`4px solid ${C.indigoSoft}`, borderTopColor: C.indigo }}/>
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" stroke={C.indigo} strokeWidth="2" fill="none" strokeLinejoin="round"/><path d="M9 12l2 2 4-4.5" stroke={C.indigo} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
      </div>

      <div style={{ fontSize: 24, fontWeight: 800, color: C.ink, marginTop: 28, letterSpacing:'-0.02em', textAlign:'center' }}>
        Мэдээлэл шалгаж байна
      </div>
      <div style={{ fontSize: 13.5, color: C.muted, marginTop: 10, lineHeight: 1.55, textAlign:'center', maxWidth: 300, marginLeft:'auto', marginRight:'auto' }}>
        Таны бүртгэлийн мэдээлэлд шаардлагатай автомат шалгалтууд хийгдэж байна.
      </div>

      <div style={{ marginTop: 28, background:'#fff', borderRadius: 18, border:`1px solid ${C.line2}`, overflow:'hidden' }}>
        <CheckRow state="done"    label="ДАН мэдээлэл баталгаажсан"/>
        <div style={{ height: 1, background: C.line2 }}/>
        <CheckRow state="loading" label="MONPEP шалгалт хийгдэж байна"/>
        <div style={{ height: 1, background: C.line2 }}/>
        <CheckRow state="pending" label="Бүртгэл үргэлжлэх боломжийг шалгаж байна"/>
      </div>

      <div style={{ flex: 1 }}/>
      <div style={{ fontSize: 11.5, color: C.muted2, textAlign:'center', paddingBottom: 8 }}>
        Энэ хооронд аппликейшнээс гарахгүй байхыг хүсье.
      </div>
    </div>
  </Frame>
  );
};

// ============================================================
// 11 — MONPEP failed state  [NEW]
// ============================================================
const MonpepFailed = () => (
  <Frame label="11 — MONPEP failed">
    <BackBar title=""/>
    <div style={{ flex: 1, overflow:'auto', padding: '8px 24px 24px', display:'flex', flexDirection:'column' }}>
      <div style={{ flex: 1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', textAlign:'center' }}>
        <div style={{
          width: 88, height: 88, borderRadius: 26, background: C.redSoft,
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={C.red} strokeWidth="2.2" fill="none"/><path d="M12 7.5v5.5M12 16.5h.01" stroke={C.red} strokeWidth="2.4" strokeLinecap="round"/></svg>
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, color: C.ink, marginTop: 26, letterSpacing:'-0.02em', lineHeight: 1.2 }}>
          Бүртгэл үргэлжлэх<br/>боломжгүй
        </div>
        <div style={{ fontSize: 13.5, color: C.muted, marginTop: 12, lineHeight: 1.6, maxWidth: 300 }}>
          Таны мэдээлэл системийн шалгуурт нийцээгүй тул бүртгэлийг үргэлжлүүлэх боломжгүй байна.
        </div>
        <div style={{ marginTop: 18, display:'inline-flex', alignItems:'center', gap: 6, padding:'6px 12px', borderRadius: 999, background: C.redSoft, color: C.red, fontSize: 11, fontWeight: 700 }}>
          <Dot color={C.red}/>MONPEP шалгалт амжилтгүй
        </div>
      </div>
    </div>
    <div style={{ padding:'12px 24px 6px', background:'#fff', borderTop:`1px solid ${C.line2}`, flexShrink: 0, display:'flex', flexDirection:'column', gap: 8 }}>
      <button style={{
        width:'100%', height: 52, borderRadius: 14, background: C.ink, color:'#fff', border:'none',
        fontWeight: 700, fontSize: 15, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap: 10,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 6a2 2 0 012-2h2.5l1.5 4-2 1.5a12 12 0 005 5l1.5-2 4 1.5V18a2 2 0 01-2 2A15 15 0 014 6z" stroke="#fff" strokeWidth="2" fill="none" strokeLinejoin="round"/></svg>
        Дэмжлэгтэй холбогдох
      </button>
      <button style={{ width:'100%', height: 48, borderRadius: 14, background:'transparent', color: C.muted, border:'none', fontWeight: 700, fontSize: 14, cursor:'pointer' }}>
        Эхэлсэн хэсэг рүү буцах
      </button>
    </div>
  </Frame>
);

// ============================================================
// 12 — TERMS OF USE (step 4/6)  [NEW]
// ============================================================
const TermsOfUse = () => {
  const sections = [
    { h:'1. Ерөнхий нөхцөл', b:'Энэхүү нөхцөл нь MMF платформ болон түүний бүтээгдэхүүн, үйлчилгээг ашиглахтай холбоотой талуудын эрх, үүргийг зохицуулна.' },
    { h:'2. Хэрэглэгчийн үүрэг', b:'Хэрэглэгч үнэн зөв мэдээлэл оруулах, нэвтрэх мэдээллээ хамгаалах, гүйлгээний аюулгүй байдлыг хангах үүрэгтэй.' },
    { h:'3. Эрсдэлийн мэдэгдэл', b:'Хөрөнгө оруулалтын өгөөж нь зах зээлийн нөхцөлөөс хамаарч өөрчлөгдөж болохыг хэрэглэгч хүлээн зөвшөөрнө.' },
    { h:'4. Мэдээллийн нууцлал', b:'Таны хувийн мэдээллийг холбогдох хууль тогтоомжийн дагуу хамгаалж, зөвхөн үйлчилгээний зорилгоор ашиглана.' },
  ];
  return (
    <Frame label="12 — Terms of Use">
      <SignupStepHeader step={6} total={TOTAL_STEPS} title="Үйлчилгээний нөхцөл" nextLabel="Мастер гэрээ"/>
      <div style={{ flex: 1, overflow:'auto', padding: '16px 24px 24px' }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.ink, letterSpacing:'-0.02em', lineHeight: 1.18 }}>
          Үйлчилгээний нөхцөл
        </div>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 10, lineHeight: 1.5 }}>
          Үйлчилгээг ашиглахын өмнө үйлчилгээний нөхцөлтэй танилцаж зөвшөөрнө үү.
        </div>

        <div style={{ marginTop: 18, background:'#fff', borderRadius: 18, border:`1px solid ${C.line2}`, padding: '6px 18px', maxHeight: 360, overflow:'auto' }}>
          {sections.map((s, i) => (
            <div key={i} style={{ padding:'14px 0', borderTop: i ? `1px solid ${C.line2}` : 'none' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.ink, letterSpacing:'-0.01em' }}>{s.h}</div>
              <div style={{ fontSize: 12.5, color: C.text, marginTop: 6, lineHeight: 1.6 }}>{s.b}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16, display:'flex', gap: 12, alignItems:'flex-start', padding: 14, borderRadius: 14, background: C.indigoSoft, border:`1px solid ${C.line2}` }}>
          <div style={{ width: 22, height: 22, borderRadius: 7, background: C.indigo, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', marginTop: 1 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div style={{ fontSize: 12.5, color: C.ink, lineHeight: 1.5, fontWeight: 600 }}>
            Би үйлчилгээний нөхцөлтэй танилцаж, зөвшөөрч байна.
          </div>
        </div>
      </div>
      <FooterCTA>Зөвшөөрөх</FooterCTA>
    </Frame>
  );
};

// ============================================================
// 13 — MASTER CONTRACT (step 5/6)  [NEW]
// ============================================================
const MasterContract = () => (
  <Frame label="13 — Master Contract">
    <SignupStepHeader step={7} total={TOTAL_STEPS} title="Мастер гэрээ" nextLabel="Гарын үсэг"/>
    <div style={{ flex: 1, overflow:'auto', padding: '18px 24px 24px' }}>
      {/* contract document visual */}
      <div style={{
        borderRadius: 22, padding: 22, position:'relative', overflow:'hidden',
        background: `linear-gradient(135deg, ${C.navy} 0%, ${C.indigo} 130%)`, color:'#fff',
      }}>
        <div style={{ position:'absolute', right:-30, bottom:-40, width: 150, height: 150, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,107,44,.4), transparent 70%)'}}/>
        <div style={{ position:'relative' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background:'rgba(255,255,255,.12)', border:'1px solid rgba(255,255,255,.18)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M7 3h7l4 4v14a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="#fff" strokeWidth="2" fill="none" strokeLinejoin="round"/><path d="M14 3v4h4M9 13h6M9 17h4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, padding:'4px 10px', borderRadius: 999, background:'rgba(255,255,255,.12)', border:'1px solid rgba(255,255,255,.18)' }}>MMF-MC-2026</span>
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, marginTop: 16, letterSpacing:'-0.01em' }}>Үйлчилгээний мастер гэрээ</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12, marginTop: 16 }}>
            {[
              { l:'1-р тал', v:'Мони Маркет Фанд ХХК' },
              { l:'2-р тал', v:'Тэмүүжин Б.' },
            ].map((x, i) => (
              <div key={i}>
                <div style={{ fontSize: 10, opacity:.6, fontWeight: 600 }}>{x.l}</div>
                <div style={{ fontSize: 13, fontWeight: 700, marginTop: 3 }}>{x.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ fontSize: 22, fontWeight: 800, color: C.ink, marginTop: 22, letterSpacing:'-0.02em', lineHeight: 1.2 }}>
        Мастер гэрээ байгуулах
      </div>
      <div style={{ fontSize: 13, color: C.text, marginTop: 10, lineHeight: 1.55 }}>
        MMF платформын бүтээгдэхүүн, үйлчилгээг ашиглахын тулд мастер гэрээг баталгаажуулах шаардлагатай.
      </div>

      <div style={{ marginTop: 16, background:'#fff', borderRadius: 16, border:`1px solid ${C.line2}`, overflow:'hidden' }}>
        {[
          'Данс нээх, хаах ерөнхий нөхцөл',
          'Арилжаа, гүйлгээний эрх, хязгаарлалт',
          'Шимтгэл, хураамжийн ерөнхий заалт',
        ].map((t, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap: 12, padding:'13px 14px', borderTop: i ? `1px solid ${C.line2}` : 'none' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill={C.indigoSoft}/><path d="M8 12l3 3 5-6" stroke={C.indigo} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: C.text }}>{t}</div>
          </div>
        ))}
      </div>
    </div>
    <FooterCTA dark>
      Гэрээ байгуулах
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </FooterCTA>
  </Frame>
);

// ============================================================
// 14 — SIGNING METHOD SELECTION (step 6/6)  [NEW · key screen]
// ============================================================
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
const ESignCanvas = () => {
  const canvasRef = useRef(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 2.6; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#0B1020';

    let drawing = false, last = null;
    const pos = (e) => {
      const r = canvas.getBoundingClientRect();
      const t = e.touches ? e.touches[0] : e;
      return { x: t.clientX - r.left, y: t.clientY - r.top };
    };
    const start = (e) => { drawing = true; last = pos(e); setDrawn(true); e.preventDefault(); };
    const move = (e) => {
      if (!drawing) return;
      const p = pos(e);
      ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke();
      last = p; e.preventDefault();
    };
    const end = () => { drawing = false; };
    canvas.addEventListener('pointerdown', start);
    canvas.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
    canvas._clear = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); setDrawn(false); };
    return () => {
      canvas.removeEventListener('pointerdown', start);
      canvas.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
    };
  }, []);

  const clear = () => { const c = canvasRef.current; if (c && c._clear) c._clear(); };

  return (
    <Frame label="15 — Цахим гарын үсэг">
      <BackBar title="Цахим гарын үсэг"/>
      <div style={{ flex: 1, overflow:'auto', padding: '8px 24px 20px', display:'flex', flexDirection:'column' }}>
        <div style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.5 }}>
          Доорх талбарт хуруугаараа гарын үсгээ зурна уу.
        </div>

        {/* canvas */}
        <div data-nodrag style={{ marginTop: 16, position:'relative', borderRadius: 18, background:'#fff', border:`1.5px solid ${C.line}`, overflow:'hidden' }}>
          <canvas ref={canvasRef} data-nodrag style={{ display:'block', width:'100%', height: 300, touchAction:'none', cursor:'crosshair' }}/>
          {/* baseline + placeholder */}
          <div style={{ position:'absolute', left: 24, right: 24, bottom: 64, height: 1, borderTop:`1.5px dashed ${C.line}`, pointerEvents:'none' }}/>
          <div style={{ position:'absolute', left: 24, bottom: 44, fontSize: 11, color: C.muted2, fontWeight: 600, pointerEvents:'none' }}>✕ Гарын үсэг</div>
          {!drawn && (
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
              <span style={{ fontSize: 16, color: C.muted2, fontWeight: 600 }}>Энд зурна уу</span>
            </div>
          )}
        </div>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: 12 }}>
          <button onClick={clear} style={{
            height: 40, padding:'0 16px', borderRadius: 12, background:'#fff', border:`1.5px solid ${C.line}`,
            color: C.ink, fontWeight: 700, fontSize: 13, cursor:'pointer', display:'inline-flex', alignItems:'center', gap: 8,
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" stroke={C.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Арилгах
          </button>
          <button style={{ height: 40, padding:'0 8px', background:'transparent', border:'none', color: C.indigo, fontWeight: 700, fontSize: 13, cursor:'pointer' }}>
            G-Sign-ээр зурах →
          </button>
        </div>
      </div>
      <FooterCTA>Гарын үсэг баталгаажуулах</FooterCTA>
    </Frame>
  );
};

// ============================================================
// 16 — ELECTRONIC SIGNATURE SUCCESS  [NEW]
// ============================================================
const ESignSuccess = () => (
  <Frame label="16 — Цахим · Амжилттай">
    <div style={{ height: 44, flexShrink: 0 }}/>
    <div style={{ flex: 1, overflow:'auto', padding: '8px 24px 20px', display:'flex', flexDirection:'column' }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', paddingTop: 8 }}>
        <div style={{
          width: 88, height: 88, borderRadius: 28, position:'relative',
          background:`linear-gradient(135deg, ${C.indigo}, ${C.blue})`,
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'0 18px 40px -12px rgba(79,70,229,.55)',
        }}>
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{ fontSize: 23, fontWeight: 800, color: C.ink, marginTop: 20, letterSpacing:'-0.02em', lineHeight: 1.15 }}>
          Гэрээ амжилттай<br/>баталгаажлаа
        </div>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 10, lineHeight: 1.55, maxWidth: 290 }}>
          Цахим гарын үсгээр баталгаажуулсан тул танд дараах бүтээгдэхүүн нээгдлээ.
        </div>
      </div>

      {/* available products */}
      <div style={{ marginTop: 20, fontSize: 11, fontWeight: 800, color: C.muted, textTransform:'uppercase', letterSpacing:'0.08em' }}>Бүтээгдэхүүн</div>
      <div style={{ marginTop: 10, background:'#fff', borderRadius: 16, border:`1px solid ${C.line2}`, overflow:'hidden' }}>
        {[
          { t:'Хадгаламжийн сертификат', ok:true },
          { t:'Нэхэмжлэх', ok:true },
          { t:'Арилжааны бичиг', ok:true },
          { t:'Итгэмжлэл', ok:false },
        ].map((p, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap: 12, padding:'12px 14px', borderTop: i ? `1px solid ${C.line2}` : 'none', background: p.ok ? '#fff' : '#FAFBFE' }}>
            {p.ok
              ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill={C.greenSoft}/><path d="M8 12l3 3 5-6" stroke={C.green} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              : <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#F0F1F6"/><rect x="8.5" y="11" width="7" height="5.5" rx="1.4" stroke={C.muted2} strokeWidth="1.7"/><path d="M9.7 11V9.6a2.3 2.3 0 014.6 0V11" stroke={C.muted2} strokeWidth="1.7"/></svg>}
            <div style={{ flex: 1, fontSize: 13.5, fontWeight: 700, color: p.ok ? C.ink : C.muted2 }}>{p.t}</div>
            {!p.ok && (
              <span style={{ fontSize: 11, fontWeight: 700, color: C.amber, background: C.amberSoft, padding:'4px 9px', borderRadius: 999 }}>Боломжгүй</span>
            )}
          </div>
        ))}
      </div>

      {/* locked Trust service */}
      <div style={{ marginTop: 14, background:'#FFFBF2', borderRadius: 16, border:`1px solid #FFE9C4`, padding: 14, display:'flex', gap: 12, alignItems:'flex-start' }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background:'#FFF1D6', flexShrink: 0, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke={C.amber} strokeWidth="2"/><path d="M8 11V8a4 4 0 018 0v3" stroke={C.amber} strokeWidth="2"/></svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 800, color:'#5E4413' }}>Итгэмжлэл — түгжээтэй</div>
          <div style={{ fontSize: 12, color:'#7A5A1F', marginTop: 4, lineHeight: 1.5 }}>
            Цахим гарын үсгээр Итгэмжлэл ашиглах боломжгүй. Идэвхжүүлэхийн тулд G-Sign баталгаажуулалт хийнэ үү.
          </div>
        </div>
      </div>
    </div>
    <div style={{ padding:'12px 24px 6px', background:'#fff', borderTop:`1px solid ${C.line2}`, flexShrink: 0, display:'flex', flexDirection:'column', gap: 8 }}>
      <button style={{
        width:'100%', height: 52, borderRadius: 14, background: C.indigo, color:'#fff', border:'none',
        fontWeight: 700, fontSize: 15, cursor:'pointer', boxShadow:'0 8px 22px -8px rgba(79,70,229,.5)',
        display:'flex', alignItems:'center', justifyContent:'center', gap: 10,
      }}>
        Данс баталгаажуулах
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <button style={{ width:'100%', height: 48, borderRadius: 14, background:'transparent', color: C.indigo, border:'none', fontWeight: 700, fontSize: 14, cursor:'pointer' }}>
        G-Sign-ээр баталгаажуулах
      </button>
    </div>
  </Frame>
);

// ============================================================
// 17 — G-SIGN REQUEST  [NEW]
// ============================================================
const GSignRequest = () => {
  const [tab, setTab] = useState(0); // 0 = register, 1 = civil registration
  return (
    <Frame label="17 — G-Sign request">
      <BackBar title="G-Sign"/>
      <div style={{ flex: 1, overflow:'auto', padding: '8px 24px 24px' }}>
        {/* brand panel */}
        <div style={{
          borderRadius: 20, padding: '22px', background:'linear-gradient(160deg, #ECFBF3 0%, #F4FBF7 60%, #FFFFFF 100%)',
          border:`1px solid #CFEEDD`, display:'flex', alignItems:'center', justifyContent:'space-between',
        }}>
          <GSignLogo size={38}/>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.green, padding:'4px 10px', borderRadius: 999, background: C.greenSoft }}>Төрийн үйлчилгээ</span>
        </div>

        <div style={{ fontSize: 18, fontWeight: 800, color: C.ink, marginTop: 20, letterSpacing:'-0.01em' }}>G-Sign-аар баталгаажуулах</div>
        <div style={{ fontSize: 12.5, color: C.muted, marginTop: 6, lineHeight: 1.5 }}>
          Мэдээллээ оруулснаар G-Sign апп руу хүсэлт илгээнэ.
        </div>

        {/* segmented tabs */}
        <div style={{ marginTop: 18, background:'#EDEFF6', borderRadius: 14, padding: 4, display:'flex' }}>
          {['Регистрийн дугаар','Иргэний бүртгэлийн дугаар'].map((t, i) => (
            <div key={i} onClick={()=>setTab(i)} style={{
              flex: 1, height: 42, borderRadius: 10, padding:'0 4px',
              background: tab===i ? '#fff' : 'transparent',
              boxShadow: tab===i ? '0 2px 6px -2px rgba(15,20,55,.12)' : 'none',
              display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center',
              fontWeight: tab===i ? 700 : 600, fontSize: 11.5, color: tab===i ? C.ink : C.muted,
              cursor:'pointer', transition:'all .2s', lineHeight: 1.15,
            }}>{t}</div>
          ))}
        </div>

        {/* dynamic field */}
        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 8 }}>{tab===0 ? 'Регистрийн дугаар' : 'Иргэний бүртгэлийн дугаар'}</div>
          <div style={{
            height: 52, borderRadius: 14, background:'#fff',
            border:`1.5px solid ${C.indigo}`, boxShadow:`0 0 0 4px ${C.indigoSoft}`,
            padding:'0 16px', display:'flex', alignItems:'center',
            color: C.ink, fontSize: 16, fontWeight: 700, fontVariantNumeric:'tabular-nums', letterSpacing:'0.06em',
          }}>{tab===0 ? 'УБ 95 02 18 11' : '200 145 2261'}</div>
        </div>

        {/* phone */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 8 }}>Утасны дугаар</div>
          <div style={{
            height: 52, borderRadius: 14, background:'#FAFBFE', border:`1.5px solid ${C.line}`,
            display:'flex', alignItems:'center', padding:'0 16px', gap: 10,
          }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.ink, paddingRight: 10, borderRight:`1px solid ${C.line}`, fontVariantNumeric:'tabular-nums' }}>+976</span>
            <span style={{ fontSize: 15, fontWeight: 600, color: C.ink, fontVariantNumeric:'tabular-nums', letterSpacing:'0.04em' }}>9552 2981</span>
          </div>
        </div>

        <button style={{
          width:'100%', height: 46, marginTop: 18, borderRadius: 14, background:'transparent',
          color: C.indigo, border:'none', fontWeight: 700, fontSize: 13.5, cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center', gap: 8,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={C.indigo} strokeWidth="2" fill="none"/><path d="M12 16v-4M12 8.5h.01" stroke={C.indigo} strokeWidth="2" strokeLinecap="round"/></svg>
          G-Sign хэрхэн ашиглах вэ?
        </button>
      </div>
      <FooterCTA dark>
        G-Sign хүсэлт илгээх
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </FooterCTA>
    </Frame>
  );
};

// ============================================================
// 18 — G-SIGN WAITING  [NEW]
// ============================================================
const GSignWaiting = () => (
  <Frame label="18 — G-Sign waiting">
    <BackBar title=""/>
    <div style={{ flex: 1, overflow:'auto', padding: '8px 24px 20px', display:'flex', flexDirection:'column' }}>
      <div style={{ flex: 1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', textAlign:'center' }}>
        {/* pulsing icon */}
        <div style={{ position:'relative', width: 110, height: 110, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div className="omf-pulse" style={{ position:'absolute', inset:0, borderRadius: 30, background:'rgba(14,159,110,.25)' }}/>
          <div className="omf-pulse omf-pulse-2" style={{ position:'absolute', inset:0, borderRadius: 30, background:'rgba(14,159,110,.2)' }}/>
          <div style={{ position:'relative', width: 80, height: 80, borderRadius: 24, background:'linear-gradient(135deg, #1F8A5B, #0E9F6E)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 14px 30px -10px rgba(14,159,110,.6)' }}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none"><path d="M20.5 12a8.5 8.5 0 1 0-3 6.5" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round"/><path d="M12 12h6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"/></svg>
          </div>
        </div>

        <div style={{ fontSize: 24, fontWeight: 800, color: C.ink, marginTop: 28, letterSpacing:'-0.02em' }}>
          G-Sign хүсэлт илгээгдлээ
        </div>
        <div style={{ fontSize: 13.5, color: C.muted, marginTop: 12, lineHeight: 1.55, maxWidth: 300 }}>
          Та G-Sign апп руу орж хүсэлтийг зөвшөөрөн гэрээг баталгаажуулна уу.
        </div>

        <div style={{ marginTop: 22, width:'100%', background:'#FAFBFE', borderRadius: 16, border:`1px solid ${C.line2}`, padding: 16, display:'flex', gap: 12, textAlign:'left' }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: C.indigoSoft, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={C.indigo} strokeWidth="2" fill="none"/><path d="M12 16v-4M12 8.5h.01" stroke={C.indigo} strokeWidth="2" strokeLinecap="round"/></svg>
          </div>
          <div style={{ fontSize: 12.5, color: C.text, lineHeight: 1.55 }}>
            G-Sign апп дээр баталгаажуулсны дараа энэ дэлгэц рүү буцаж <strong style={{ color: C.ink }}>«Шалгах»</strong> товчийг дарна уу.
          </div>
        </div>
      </div>
    </div>
    <div style={{ padding:'12px 24px 6px', background:'#fff', borderTop:`1px solid ${C.line2}`, flexShrink: 0, display:'flex', flexDirection:'column', gap: 8 }}>
      <button style={{
        width:'100%', height: 52, borderRadius: 14, background: C.indigo, color:'#fff', border:'none',
        fontWeight: 700, fontSize: 15, cursor:'pointer', boxShadow:'0 8px 22px -8px rgba(79,70,229,.5)',
        display:'flex', alignItems:'center', justifyContent:'center', gap: 10,
      }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" className="omf-spin"><path d="M21 12a9 9 0 11-2.6-6.4" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round"/><path d="M21 4v5h-5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Шалгах
      </button>
      <button style={{ width:'100%', height: 48, borderRadius: 14, background:'transparent', color: C.indigo, border:'none', fontWeight: 700, fontSize: 14, cursor:'pointer' }}>
        G-Sign хэрхэн ашиглах вэ?
      </button>
    </div>
  </Frame>
);

// ============================================================
// 19 — G-SIGN SUCCESS  [NEW]
// ============================================================
const GSignSuccess = () => (
  <Frame label="19 — G-Sign · Амжилттай">
    <div style={{ height: 44, flexShrink: 0 }}/>
    <div style={{ flex: 1, overflow:'auto', padding: '8px 24px 20px', display:'flex', flexDirection:'column' }}>
      <div style={{ flex: 1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', textAlign:'center' }}>
        <div style={{
          width: 96, height: 96, borderRadius: 30,
          background:`linear-gradient(135deg, #1F8A5B, ${C.green})`,
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'0 18px 40px -12px rgba(14,159,110,.55)',
        }}>
          <svg width="46" height="46" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{ fontSize: 25, fontWeight: 800, color: C.ink, marginTop: 26, letterSpacing:'-0.02em', lineHeight: 1.15 }}>
          Гэрээ амжилттай<br/>баталгаажлаа
        </div>
        <div style={{ fontSize: 13.5, color: C.muted, marginTop: 12, lineHeight: 1.55, maxWidth: 290 }}>
          Танд платформын бүх бүтээгдэхүүн, үйлчилгээ нээгдлээ.
        </div>

        <div style={{ marginTop: 22, width:'100%', display:'flex', flexWrap:'wrap', gap: 8, justifyContent:'center' }}>
          {['Сертификат','Итгэлцэл','Нэхэмжлэх','Арилжааны бичиг'].map((t, i) => (
            <span key={i} style={{ display:'inline-flex', alignItems:'center', gap: 5, padding:'6px 12px', borderRadius: 999, background: C.greenSoft, color: C.green, fontSize: 12, fontWeight: 700 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke={C.green} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
    <div style={{ padding:'12px 24px 6px', background:'#fff', borderTop:`1px solid ${C.line2}`, flexShrink: 0 }}>
      <button style={{
        width:'100%', height: 52, borderRadius: 14, background: C.indigo, color:'#fff', border:'none',
        fontWeight: 700, fontSize: 15, cursor:'pointer', boxShadow:'0 8px 22px -8px rgba(79,70,229,.5)',
        display:'flex', alignItems:'center', justifyContent:'center', gap: 10,
      }}>
        Данс баталгаажуулах
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>
  </Frame>
);

// ============================================================
// 20 — G-SIGN TUTORIAL / HELP (bottom sheet)  [NEW]
// ============================================================
const GSignTutorial = () => {
  const steps = [
    'G-Sign апп суулгана',
    'Өөрийн мэдээллээр нэвтэрч баталгаажуулна',
    'MMF апп дээрээс хүсэлт илгээнэ',
    'G-Sign апп дээр хүсэлтийг зөвшөөрнө',
    'MMF апп руу буцаж гэрээгээ дуусгана',
  ];
  return (
    <Frame label="20 — G-Sign tutorial">
      {/* dimmed context behind the sheet */}
      <div style={{ flex: 1, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, padding:'20px 24px', filter:'blur(1px)', opacity:.5 }}>
          <GSignLogo size={36}/>
          <div style={{ marginTop: 18, height: 52, borderRadius: 14, background:'#fff', border:`1px solid ${C.line}` }}/>
          <div style={{ marginTop: 16, height: 52, borderRadius: 14, background:'#fff', border:`1px solid ${C.line}` }}/>
        </div>
        <div style={{ position:'absolute', inset:0, background:'rgba(5,11,31,.45)' }}/>

        {/* sheet */}
        <div style={{ position:'absolute', left:0, right:0, bottom:0, background:'#fff', borderRadius:'28px 28px 0 0', padding:'10px 24px 28px' }}>
          <div style={{ width:40, height:5, borderRadius:999, background:C.line, margin:'0 auto 18px' }}/>
          <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
            <GSignLogo size={30}/>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.ink, marginTop: 16, letterSpacing:'-0.01em' }}>
            G-Sign хэрхэн ашиглах вэ?
          </div>

          <div style={{ marginTop: 16, display:'flex', flexDirection:'column', gap: 4 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap: 14, padding:'10px 0' }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 999, flexShrink: 0,
                  background: C.indigoSoft, color: C.indigo, fontWeight: 800, fontSize: 14,
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>{i + 1}</div>
                <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: C.text, lineHeight: 1.35 }}>{s}</div>
              </div>
            ))}
          </div>

          <a href="https://www.facebook.com/share/v/195SVqc3sm/" target="_blank" rel="noopener noreferrer" style={{
            width:'100%', height: 50, borderRadius: 14, marginTop: 16, boxSizing:'border-box',
            background:'#fff', color: C.ink, border:`1.5px solid ${C.line}`, fontWeight: 700, fontSize: 14, cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center', gap: 10, textDecoration:'none',
          }}>
            <span style={{ width: 26, height: 26, borderRadius: 8, background:'#1877F2', display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
            </span>
            Видео заавар үзэх
            <span style={{ fontSize: 11, fontWeight: 700, color: C.muted2 }}>· Facebook</span>
          </a>

          <button style={{
            width:'100%', height: 52, borderRadius: 14, marginTop: 12,
            background: C.indigo, color:'#fff', border:'none', fontWeight: 700, fontSize: 15, cursor:'pointer',
            boxShadow:'0 8px 22px -8px rgba(79,70,229,.5)',
          }}>Ойлголоо</button>
        </div>
      </div>
    </Frame>
  );
};

// ============================================================
// EXPORT NEW SCREENS TO WINDOW
// ============================================================
Object.assign(window, {
  PhoneVerify, EmailVerify, CreatePassword, CreatePin, BiometricSetup, KycConsent, MonpepCheck, MonpepFailed,
  TermsOfUse, MasterContract, SigningMethod,
  ESignCanvas, ESignSuccess, GSignRequest, GSignWaiting, GSignSuccess, GSignTutorial,
  GSignLogo,
});
