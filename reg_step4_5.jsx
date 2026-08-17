// reg_step4_5.jsx — MMF Web · Registration step 4 (PIN) + step 5 (ДАН consent + MONPEP check)
// Load after reg_shell.jsx.

const { useState: _uS45, useEffect: _uE45 } = React;
const { RegT: T, STEPS, StepCard, StepFooter, CodeBoxes, DanLogo } = window;

/* ══ STEP 4 · Гүйлгээний PIN код (4-digit create → confirm) ══ */
const Step4Pin = ({ onNext, onBack }) => {
  const [stage, setStage] = _uS45('create');   // create | confirm | done
  const [pin, setPin]     = _uS45('');
  const [confirm, setConfirm] = _uS45('');
  const [error, setError] = _uS45(false);
  const [key, setKey]     = _uS45(0);

  const active = stage === 'create' ? pin : confirm;

  const onChange = (v) => {
    if (stage === 'create') {
      setPin(v);
      if (v.length === 4) setTimeout(() => setStage('confirm'), 250);
    } else if (stage === 'confirm') {
      setError(false);
      setConfirm(v);
      if (v.length === 4) {
        setTimeout(() => {
          if (v === pin) setStage('done');
          else { setError(true); setConfirm(''); setKey(k=>k+1); }
        }, 250);
      }
    }
  };

  const title = stage === 'create' ? '4 оронтой PIN код оруулна уу'
    : stage === 'confirm' ? 'PIN кодоо давтан оруулна уу'
    : 'PIN код амжилттай үүслээ';

  return (
    <StepCard step={STEPS[4]} footer={
      <StepFooter onBack={onBack} primaryLabel="Үргэлжлүүлэх" onPrimary={onNext}
        primaryDisabled={stage !== 'done'} primaryReason={stage!=='done' ? '4 оронтой PIN кодоо үүсгэж, давтана уу.' : undefined}/>
    }>
      <h1 style={{ fontSize:24, fontWeight:800, color:T.ink, letterSpacing:'-0.02em', lineHeight:1.25, margin:'0 0 10px' }}>Гүйлгээний PIN код үүсгэх</h1>
      <p style={{ fontSize:14, color:T.muted, lineHeight:1.6, margin:'0 0 26px' }}>Худалдан авах, зарах, мөнгө татах зэрэг санхүүгийн үйлдлийг баталгаажуулахад ашиглана.</p>

      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'8px 0 6px' }}>
        {stage === 'done' ? (
          <>
            <div style={{ width:72, height:72, borderRadius:22, background:'linear-gradient(135deg, #1F8A5B, #0E9F6E)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 14px 30px -10px rgba(14,159,110,.55)' }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{ fontSize:15, fontWeight:800, color:T.ink, marginTop:16 }}>{title}</div>
          </>
        ) : (
          <>
            <div style={{ fontSize:13.5, fontWeight:700, color: error ? T.neg : T.text, marginBottom:22, textAlign:'center' }}>{error ? 'PIN код таарсангүй. Дахин оруулна уу.' : title}</div>
            <div style={{ width:260 }}>
              <CodeBoxes key={key} length={4} value={active} onChange={onChange} state={error?'error':'idle'} mask autoFocus/>
            </div>
          </>
        )}
      </div>

      <div style={{ marginTop:24, display:'flex', gap:9, alignItems:'flex-start', padding:13, borderRadius:13, background:T.field, border:`1px solid ${T.line2}` }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:1 }}><circle cx="12" cy="12" r="9" stroke={T.muted2} strokeWidth="2"/><path d="M12 11v5M12 8h.01" stroke={T.muted2} strokeWidth="2" strokeLinecap="round"/></svg>
        <div style={{ fontSize:11.5, color:T.muted, lineHeight:1.5 }}>Биометр баталгаажуулалт (Face ID / хурууны хээ) зөвхөн мобайл аппад байдаг — хөтөч дээр эквивалент бүртгэлийн API байхгүй тул веб дээр алгасна.</div>
      </div>
    </StepCard>
  );
};

/* ══ STEP 5 · Танин баталгаажуулалт — ДАН consent → MONPEP automatic check ══ */
const DAN_PERMS = [
  { t:'Иргэний үнэмлэхний мэдээлэл', ic:<><rect x="3" y="5" width="18" height="14" rx="2.5" stroke={T.indigo} strokeWidth="2" fill="none"/><circle cx="8.5" cy="11" r="2" stroke={T.indigo} strokeWidth="2" fill="none"/><path d="M13 9.5h5M13 13h3.5" stroke={T.indigo} strokeWidth="2" strokeLinecap="round"/></>},
  { t:'Иргэний бүртгэлтэй хаяг', ic:<><path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z" stroke={T.indigo} strokeWidth="2" fill="none" strokeLinejoin="round"/><circle cx="12" cy="10" r="2.4" stroke={T.indigo} strokeWidth="2" fill="none"/></>},
  { t:'Өмчлөлд байгаа хөрөнгийн мэдээлэл', ic:<><path d="M4 10l8-6 8 6" stroke={T.indigo} strokeWidth="2" strokeLinejoin="round" fill="none"/><path d="M6 10v9h12v-9M10 19v-5h4v5" stroke={T.indigo} strokeWidth="2" strokeLinejoin="round" fill="none"/></>},
  { t:'Нийгмийн даатгалын шимтгэл төлөлт', ic:<><rect x="3" y="6" width="18" height="13" rx="2.5" stroke={T.indigo} strokeWidth="2" fill="none"/><path d="M3 10h18" stroke={T.indigo} strokeWidth="2"/><path d="M7 15h4" stroke={T.indigo} strokeWidth="2" strokeLinecap="round"/></>},
  { t:'Гэрлэлтийн байдал', ic:<><circle cx="8.5" cy="9" r="3" stroke={T.indigo} strokeWidth="2" fill="none"/><circle cx="15.5" cy="9" r="3" stroke={T.indigo} strokeWidth="2" fill="none"/><path d="M5.5 19c0-2.5 1.5-4 3-4M18.5 19c0-2.5-1.5-4-3-4" stroke={T.indigo} strokeWidth="2" strokeLinecap="round"/></>},
];

const CheckRow = ({ state, label }) => {
  const glyph = state === 'done' ? (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill={T.posSoft}/><path d="M8 12l3 3 5-6" stroke={T.pos} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ) : state === 'loading' ? (
    <div className="reg-spin" style={{ width:22, height:22, borderRadius:999, border:`2.5px solid ${T.indigoSoft}`, borderTopColor:T.indigo }}/>
  ) : (
    <div style={{ width:22, height:22, borderRadius:999, border:`2px solid ${T.line}`, background:T.surface }}/>
  );
  const color = state === 'todo' ? T.muted2 : T.ink;
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 14px' }}>
      <div style={{ flexShrink:0 }}>{glyph}</div>
      <div style={{ flex:1, fontSize:13.5, fontWeight:700, color }}>{label}</div>
      {state === 'loading' && <span style={{ fontSize:11, fontWeight:700, color:T.indigo }}>Шалгаж байна</span>}
    </div>
  );
};

const Step5Kyc = ({ onNext, onBack }) => {
  const [stage, setStage] = _uS45('consent');       // consent | processing | failed
  const [rowState, setRowState] = _uS45(['todo','todo','todo']);
  const [outcome, setOutcome] = _uS45('success');    // preview toggle: success | fail

  const startCheck = () => {
    setStage('processing');
    setRowState(['loading','todo','todo']);
    setTimeout(() => setRowState(['done','loading','todo']), 900);
    setTimeout(() => setRowState(['done','done','loading']), 1900);
    setTimeout(() => {
      setRowState(['done','done','done']);
      setTimeout(() => { outcome === 'fail' ? setStage('failed') : onNext(); }, 500);
    }, 2700);
  };

  return (
    <div style={{ position:'relative' }}>
      {/* preview-only outcome switch — not part of the shipped screen */}
      <div style={{ position:'fixed', top:18, right:22, zIndex:50, display:'flex', alignItems:'center', gap:8, background:'rgba(11,16,32,.92)', borderRadius:12, padding:'6px 8px 6px 12px' }}>
        <span style={{ fontSize:10, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'#A8AFC9' }}>MONPEP</span>
        {['success','fail'].map(o => (
          <button key={o} onClick={() => setOutcome(o)} style={{ border:'none', background: outcome===o ? '#4F46E5' : 'transparent', color: outcome===o ? '#fff' : '#C4C9DE', fontSize:11.5, fontWeight:700, padding:'6px 10px', borderRadius:8, cursor:'pointer', fontFamily:'inherit', minHeight:0 }}>{o==='success'?'Амжилттай':'Амжилтгүй'}</button>
        ))}
      </div>

      {stage === 'consent' && (
        <StepCard step={STEPS[5]} footer={
          <StepFooter onBack={onBack} dark primaryLabel="ДАН-аар баталгаажуулах" onPrimary={startCheck}/>
        }>
          <div style={{ borderRadius:20, padding:'26px 24px', background:'linear-gradient(160deg, #EAF3FF 0%, #F4F8FF 60%, #FFFFFF 100%)', border:'1px solid #DCE9FB', textAlign:'center', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', inset:0, opacity:.5, background:'radial-gradient(circle at 50% 0%, rgba(31,58,138,.15), transparent 60%)' }}/>
            <div style={{ position:'relative', display:'flex', flexDirection:'column', alignItems:'center', gap:14 }}>
              <DanLogo size={40}/>
              <span style={{ fontSize:12, fontWeight:700, color:'#1F3A8A', padding:'4px 12px', borderRadius:999, background:'#fff', border:'1px solid #DCE9FB' }}>ДАН систем</span>
            </div>
          </div>

          <h1 style={{ fontSize:24, fontWeight:800, color:T.ink, letterSpacing:'-0.02em', lineHeight:1.25, margin:'24px 0 10px' }}>Танин баталгаажуулалт</h1>
          <p style={{ fontSize:14, color:T.text, lineHeight:1.6, margin:0 }}>
            Таны зөвшөөрлөөр ДАН системээс шаардлагатай мэдээллийг татаж баталгаажуулна. Хуваалцах мэдээллээ ДАН системийн баталгаажуулах хуудсан дээр эцэслэн харж, зөвшөөрнө.
          </p>

          <div style={{ marginTop:22, fontSize:11, fontWeight:800, letterSpacing:'.07em', textTransform:'uppercase', color:T.muted, marginBottom:10 }}>ДАН-аас татах мэдээлэл</div>
          <div style={{ background:T.field, border:`1px solid ${T.line2}`, borderRadius:16, overflow:'hidden' }}>
            {DAN_PERMS.map((p,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:13, padding:'13px 16px', borderTop: i ? `1px solid ${T.line2}` : 'none' }}>
                <div style={{ width:34, height:34, borderRadius:10, background:T.indigoSoft, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">{p.ic}</svg>
                </div>
                <div style={{ fontSize:13.5, fontWeight:600, color:T.text }}>{p.t}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop:16, display:'flex', gap:12, alignItems:'flex-start', padding:14, borderRadius:14, background:T.field, border:`1px solid ${T.line2}` }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:1 }}><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" stroke={T.muted} strokeWidth="1.9" fill="none" strokeLinejoin="round"/><path d="M9 12l2 2 4-4.5" stroke={T.muted} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <div style={{ fontSize:12.5, color:T.text, lineHeight:1.55 }}>
              Баталгаажуулсны дараа хууль тогтоомжийн дагуу таны мэдээллийг олон улсын хориг болон улс төрд нөлөө бүхий этгээдийн (MONPEP) бүртгэлтэй автоматаар тулгаж шалгана. Шалгалт хэдхэн секунд үргэлжилнэ.
            </div>
          </div>
        </StepCard>
      )}

      {stage === 'processing' && (
        <StepCard step={STEPS[5]} footer={null}>
          <div style={{ display:'flex', justifyContent:'center', marginTop:6 }}>
            <div style={{ position:'relative', width:88, height:88 }}>
              <div className="reg-spin" style={{ position:'absolute', inset:0, borderRadius:999, border:`4px solid ${T.indigoSoft}`, borderTopColor:T.indigo }}/>
              <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" stroke={T.indigo} strokeWidth="2" fill="none" strokeLinejoin="round"/><path d="M9 12l2 2 4-4.5" stroke={T.indigo} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          </div>
          <div style={{ fontSize:22, fontWeight:800, color:T.ink, marginTop:24, letterSpacing:'-0.02em', textAlign:'center' }}>Мэдээлэл шалгаж байна</div>
          <div style={{ fontSize:13.5, color:T.muted, marginTop:10, lineHeight:1.55, textAlign:'center', maxWidth:340, marginLeft:'auto', marginRight:'auto' }}>
            Таны бүртгэлийн мэдээлэлд шаардлагатай автомат шалгалтууд хийгдэж байна.
          </div>
          <div style={{ marginTop:26, background:T.surface, borderRadius:18, border:`1px solid ${T.line2}`, overflow:'hidden' }}>
            <CheckRow state={rowState[0]} label="ДАН мэдээлэл баталгаажсан"/>
            <div style={{ height:1, background:T.line2 }}/>
            <CheckRow state={rowState[1]} label="MONPEP шалгалт хийгдэж байна"/>
            <div style={{ height:1, background:T.line2 }}/>
            <CheckRow state={rowState[2]} label="Бүртгэл үргэлжлэх боломжийг шалгаж байна"/>
          </div>
          <div style={{ fontSize:11.5, color:T.muted2, textAlign:'center', marginTop:20 }}>Энэ хооронд хуудаснаас гарахгүй байхыг хүсье.</div>
        </StepCard>
      )}

      {stage === 'failed' && (
        <StepCard step={STEPS[5]} footer={
          <StepFooter onBack={() => setStage('consent')} backLabel="Дахин оролдох" dark primaryLabel="Дэмжлэгтэй холбогдох" onPrimary={()=>{}}/>
        }>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', padding:'10px 0' }}>
            <div style={{ width:80, height:80, borderRadius:24, background:T.negSoft, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={T.neg} strokeWidth="2.2" fill="none"/><path d="M12 7.5v5.5M12 16.5h.01" stroke={T.neg} strokeWidth="2.4" strokeLinecap="round"/></svg>
            </div>
            <div style={{ fontSize:22, fontWeight:800, color:T.ink, marginTop:22, letterSpacing:'-0.02em', lineHeight:1.25 }}>Бүртгэл үргэлжлэх боломжгүй</div>
            <div style={{ fontSize:13.5, color:T.muted, marginTop:12, lineHeight:1.6, maxWidth:360 }}>Таны мэдээлэл системийн шалгуурт нийцээгүй тул бүртгэлийг үргэлжлүүлэх боломжгүй байна.</div>
            <div style={{ marginTop:18, display:'inline-flex', alignItems:'center', gap:6, padding:'6px 12px', borderRadius:999, background:T.negSoft, color:T.neg, fontSize:11, fontWeight:700 }}>
              <window.WebDot color={T.neg}/>MONPEP шалгалт амжилтгүй
            </div>
          </div>
        </StepCard>
      )}
    </div>
  );
};

Object.assign(window, { Step4Pin, Step5Kyc });
