// ============================================================
// CARD LINKING — optional add-on right after bank verification (step 3)
// C1 ask → C2 add (+ autopay consent toggle) → C3 linking →
// C4 linked · C5 failed (edge case). Mongolian Cyrillic, 390×844.
// ============================================================

const { useState: useStateCL } = React;
const { C: CCL, Frame: FrameCL, StickyBar: StickyBarCL, BigBtn: BigBtnCL, SignupStepHeader: StepHeaderCL, BackBar: BackBarCL } = window;

const CARD_HOLDER_CL = 'BATBOLD TEMUUJIN';
const CardStepCL = ({ title }) => <StepHeaderCL step={3} total={9} title={title} nextLabel="Нууц үг"/>;

// brand detection + gradients
const cardBrandCL = (digits) => digits.startsWith('4') ? 'visa' : digits.startsWith('5') ? 'mc' : null;
const CARD_GRADS_CL = {
  visa: 'linear-gradient(135deg,#312E81 0%,#4F46E5 62%,#2D6BFF 135%)',
  mc: 'linear-gradient(135deg,#0B1020 0%,#232A4D 58%,#3B4FB0 135%)',
  none: 'linear-gradient(135deg,#3A415E 0%,#5A617E 100%)',
  expired: 'linear-gradient(135deg,#6A7086 0%,#8B91A6 100%)',
};
const BrandMarkCL = ({ brand, h = 20 }) => brand === 'mc'
  ? <svg width={h * 1.7} height={h} viewBox="0 0 34 20" style={{ display:'block' }}><circle cx="12" cy="10" r="9.5" fill="#EB001B"/><circle cx="22" cy="10" r="9.5" fill="#F79E1B" fillOpacity=".92"/></svg>
  : brand === 'visa'
    ? <span style={{ fontStyle:'italic', fontWeight: 900, color:'#fff', fontSize: h * 0.9, letterSpacing:'0.05em', lineHeight: 1 }}>VISA</span>
    : <span style={{ width: h * 1.6, height: h, borderRadius: 5, border:'1.5px dashed rgba(255,255,255,.4)', display:'block' }}/>;

const CardChipCL = () => (
  <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
    <svg width="34" height="26" viewBox="0 0 34 26"><rect x="1" y="1" width="32" height="24" rx="5" fill="rgba(255,255,255,.28)" stroke="rgba(255,255,255,.5)"/><path d="M1 9h10M1 17h10M23 9h10M23 17h10M11 9v8h12V9" stroke="rgba(255,255,255,.5)" fill="none"/></svg>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 9a8 8 0 010 6M10 7a12 12 0 010 10M14 5a16 16 0 010 14" stroke="rgba(255,255,255,.55)" strokeWidth="2" strokeLinecap="round"/></svg>
  </div>
);

// ---- reusable card face (also used by profile card manager) ----
const CardVisualCL = ({ brand, num = '', name = '', exp = '', height = 200, grad, badge, dim, fontScale = 1 }) => {
  const digits = (num || '').replace(/\D/g, '');
  const groups = [0, 1, 2, 3].map(g => {
    const part = digits.slice(g * 4, g * 4 + 4);
    return part + '••••'.slice(part.length);
  });
  return (
    <div style={{
      position:'relative', width:'100%', height, borderRadius: 20, overflow:'hidden',
      background: grad || CARD_GRADS_CL[brand || 'none'], color:'#fff',
      boxShadow:'0 18px 40px -18px rgba(15,20,55,.5)', filter: dim ? 'saturate(.35)' : 'none',
      padding: 20 * fontScale, display:'flex', flexDirection:'column', justifyContent:'space-between',
    }}>
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(340px 200px at 88% -20%, rgba(255,255,255,.16), transparent 60%), radial-gradient(300px 220px at -10% 120%, rgba(255,255,255,.08), transparent 55%)', pointerEvents:'none' }}/>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', position:'relative' }}>
        <CardChipCL/>
        {badge || <BrandMarkCL brand={brand} h={20 * fontScale}/>}
      </div>
      <div style={{ position:'relative' }}>
        <div style={{ display:'flex', gap: 14 * fontScale, fontFamily:"'JetBrains Mono', monospace", fontSize: 17 * fontScale, fontWeight: 600, letterSpacing:'0.08em', textShadow:'0 1px 4px rgba(0,0,0,.25)' }}>
          {groups.map((g, i) => <span key={i}>{g}</span>)}
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginTop: 16 * fontScale }}>
          <div>
            <div style={{ fontSize: 8.5 * fontScale, fontWeight: 700, letterSpacing:'0.14em', opacity:.6, textTransform:'uppercase' }}>Карт эзэмшигч</div>
            <div style={{ fontSize: 12.5 * fontScale, fontWeight: 700, letterSpacing:'0.06em', marginTop: 3 }}>{name || '——'}</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize: 8.5 * fontScale, fontWeight: 700, letterSpacing:'0.14em', opacity:.6, textTransform:'uppercase' }}>Хүчинтэй</div>
            <div style={{ fontSize: 12.5 * fontScale, fontWeight: 700, fontFamily:"'JetBrains Mono', monospace", marginTop: 3 }}>{exp || '••/••'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// C1 — ASK: link a card? (optional, skippable)
// ============================================================
const CardAsk = () => {
  const benefits = [
    { t:'Шуурхай цэнэглэлт', d:'Хэтэвчээ картнаасаа шууд цэнэглэнэ', icon:<path d="M13 3L5 13h5l-1 8 8-10h-5l1-8z" strokeLinejoin="round"/> },
    { t:'Зээлийн автомат төлөлт', d:'Эргэн төлөлт хугацаандаа автоматаар хийгдэнэ', icon:<><rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18"/></> },
    { t:'Автомат хөрөнгө оруулалт', d:'Тогтмол дүнгээр давтамжтай хөрөнгө оруулна', icon:<path d="M4 17l5-6 4 3 7-8M14 6h6v6"/> },
  ];
  return (
    <FrameCL label="C1 — Карт холбох уу?">
      <CardStepCL title="Карт холбох"/>
      <div style={{ flex:1, overflow:'auto', padding:'6px 24px 18px' }}>
        {/* stacked mini cards */}
        <div style={{ position:'relative', height: 148, margin:'6px 6px 18px' }}>
          <div style={{ position:'absolute', left: 26, right: 26, top: 26, transform:'rotate(4deg)', opacity:.55 }}>
            <CardVisualCL brand="mc" height={118} fontScale={0.72} num="5417" exp="08/27" name={CARD_HOLDER_CL}/>
          </div>
          <div style={{ position:'absolute', left: 10, right: 10, top: 0, transform:'rotate(-3deg)' }}>
            <CardVisualCL brand="visa" height={124} fontScale={0.75} num="4218" exp="09/28" name={CARD_HOLDER_CL}/>
          </div>
        </div>
        <div style={{ fontSize: 21, fontWeight: 800, color: CCL.ink, letterSpacing:'-0.02em', lineHeight: 1.2 }}>Төлбөрийн картаа холбох уу?</div>
        <div style={{ fontSize: 13, color: CCL.muted, marginTop: 8, lineHeight: 1.55 }}>Картаа холбовол дараах боломжууд нээгдэнэ.</div>
        <div style={{ marginTop: 16, background:'#fff', borderRadius: 16, border:`1px solid ${CCL.line2}`, overflow:'hidden' }}>
          {benefits.map((b, i) => (
            <div key={i} style={{ display:'flex', gap: 12, alignItems:'center', padding:'12px 14px', borderTop: i ? `1px solid ${CCL.line2}` : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: CCL.indigoSoft, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={CCL.indigo} strokeWidth="2" strokeLinecap="round">{b.icon}</svg>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: CCL.ink }}>{b.t}</div>
                <div style={{ fontSize: 11.5, color: CCL.muted, marginTop: 2, lineHeight: 1.4 }}>{b.d}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, display:'flex', gap: 9, alignItems:'flex-start', padding:'12px 14px', borderRadius: 14, background: CCL.greenSoft }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:1 }}><path d="M12 3l8 3v6c0 4.5-3 7.5-8 9-5-1.5-8-4.5-8-9V6l8-3z" stroke={CCL.green} strokeWidth="2" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke={CCL.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <div style={{ fontSize: 12, color:'#0B6B4C', lineHeight: 1.5, fontWeight: 600 }}>Таны зөвшөөрөлгүйгээр картаас ямар ч төлбөр авахгүй. Автомат төлбөрийг та өөрөө идэвхжүүлж, хүссэн үедээ унтраана.</div>
        </div>
      </div>
      <StickyBarCL>
        <BigBtnCL>Карт холбох</BigBtnCL>
        <button style={{ width:'100%', height: 44, marginTop: 6, background:'transparent', border:'none', color: CCL.muted, fontWeight: 700, fontSize: 13.5, cursor:'pointer' }}>Дараа нь холбох</button>
      </StickyBarCL>
    </FrameCL>
  );
};

// ============================================================
// C2 — ADD CARD: live preview + fields + autopay consent toggle
// ============================================================
const ToggleCL = ({ on, onClick }) => (
  <button onClick={onClick} aria-label="Автомат төлбөр" style={{ width: 46, height: 27, borderRadius: 999, border:'none', cursor:'pointer', background: on ? CCL.indigo : CCL.line, position:'relative', transition:'background .15s', flexShrink:0 }}>
    <span style={{ position:'absolute', top: 3, left: on ? 22 : 3, width: 21, height: 21, borderRadius: 999, background:'#fff', transition:'left .15s', boxShadow:'0 1px 3px rgba(0,0,0,.2)' }}/>
  </button>
);

const FieldCL = ({ label, error, children }) => (
  <div style={{ flex:1, minWidth: 0 }}>
    <div style={{ fontSize: 12, color: CCL.muted, fontWeight: 600, marginBottom: 7 }}>{label}</div>
    {children}
    {error && (
      <div style={{ display:'flex', alignItems:'center', gap: 5, marginTop: 6, fontSize: 11.5, fontWeight: 700, color: CCL.red }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={CCL.red} strokeWidth="2"/><path d="M12 7.5v5.5M12 16.5h.01" stroke={CCL.red} strokeWidth="2.2" strokeLinecap="round"/></svg>
        {error}
      </div>
    )}
  </div>
);
const inputBoxCL = (bad) => ({
  height: 52, borderRadius: 14, background:'#fff', border:`1.5px solid ${bad ? CCL.red : CCL.line}`,
  boxShadow: bad ? `0 0 0 3px ${CCL.redSoft}` : 'none',
  padding:'0 14px', display:'flex', alignItems:'center', gap: 10, transition:'border-color .15s, box-shadow .15s',
});
const rawInputCL = {
  flex:1, minWidth:0, border:'none', outline:'none', background:'transparent',
  fontSize: 15, fontWeight: 700, color:'#0B1020', fontFamily:'inherit', fontVariantNumeric:'tabular-nums', letterSpacing:'0.04em',
};

// expiry check against "now" (07/2026)
const expiryErrorCL = (exp) => {
  if (exp.length < 5) return null;
  const mm = +exp.slice(0, 2), yy = +exp.slice(3, 5);
  if (mm < 1 || mm > 12) return 'Сар буруу байна';
  if (yy < 26 || (yy === 26 && mm < 7)) return 'Картын хугацаа дууссан байна';
  return null;
};

const CardAdd = ({ seed, label, context }) => {
  const [num, setNum]   = useStateCL(seed?.num ?? '');
  const [exp, setExp]   = useStateCL(seed?.exp ?? '');
  const [cvv, setCvv]   = useStateCL(seed?.cvv ?? '');
  const [name, setName] = useStateCL(seed?.name ?? '');
  const [autopay, setAutopay] = useStateCL(seed?.autopay ?? false);

  const digits = num.replace(/\D/g, '');
  const brand = cardBrandCL(digits);
  const expErr = expiryErrorCL(exp);
  const numErr = digits.length > 0 && digits.length < 16 && digits.length >= 8 ? null : (digits.length === 16 && !brand ? 'Зөвхөн Visa, Mastercard карт дэмжинэ' : null);
  const valid = digits.length === 16 && brand && exp.length === 5 && !expErr && cvv.length === 3 && name.trim().length >= 3;

  const onNum = (e) => { const d = e.target.value.replace(/\D/g, '').slice(0, 16); setNum(d.replace(/(.{4})/g, '$1 ').trim()); };
  const onExp = (e) => { let d = e.target.value.replace(/\D/g, '').slice(0, 4); setExp(d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d); };

  return (
    <FrameCL label={label || 'C2 — Карт нэмэх'}>
      {context === 'profile' ? <BackBarCL title="Карт нэмэх"/> : <CardStepCL title="Карт холбох"/>}
      <div style={{ flex:1, overflow:'auto', padding:'4px 24px 18px', display:'flex', flexDirection:'column', gap: 14 }}>
        <CardVisualCL brand={brand} num={digits} name={name || CARD_HOLDER_CL} exp={exp} height={176} fontScale={0.92}/>

        <FieldCL label="Картын дугаар" error={numErr}>
          <div style={inputBoxCL(!!numErr)}>
            <input data-nodrag value={num} onChange={onNum} placeholder="0000 0000 0000 0000" inputMode="numeric" style={rawInputCL}/>
            {brand && <BrandMarkCL brand={brand} h={brand === 'visa' ? 13 : 17}/>}
            {digits.length === 16 && brand && <svg width="17" height="17" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0 }}><path d="M5 12l4 4 10-10" stroke={CCL.green} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
        </FieldCL>

        <div style={{ display:'flex', gap: 12 }}>
          <FieldCL label="Дуусах хугацаа" error={expErr}>
            <div style={inputBoxCL(!!expErr)}>
              <input data-nodrag value={exp} onChange={onExp} placeholder="ММ/ЖЖ" inputMode="numeric" style={rawInputCL}/>
            </div>
          </FieldCL>
          <FieldCL label="CVV код">
            <div style={inputBoxCL(false)}>
              <input data-nodrag value={cvv} onChange={(e)=>setCvv(e.target.value.replace(/\D/g,'').slice(0,3))} placeholder="•••" type="password" inputMode="numeric" style={rawInputCL}/>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0 }}><rect x="5" y="11" width="14" height="9" rx="2" stroke={CCL.muted2} strokeWidth="2"/><path d="M8 11V8a4 4 0 018 0v3" stroke={CCL.muted2} strokeWidth="2"/></svg>
            </div>
          </FieldCL>
        </div>

        <FieldCL label="Карт эзэмшигчийн нэр">
          <div style={inputBoxCL(false)}>
            <input data-nodrag value={name} onChange={(e)=>setName(e.target.value.toUpperCase())} placeholder="BATBOLD TEMUUJIN" style={{ ...rawInputCL, letterSpacing:'0.06em' }}/>
          </div>
        </FieldCL>

        {/* autopay consent */}
        <div style={{ background:'#fff', borderRadius: 16, border:`1.5px solid ${autopay ? CCL.indigo : CCL.line2}`, boxShadow: autopay ? `0 0 0 3px ${CCL.indigoSoft}` : 'none', padding:'14px 14px', transition:'border-color .15s, box-shadow .15s' }}>
          <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: CCL.ink }}>Автомат төлбөрт ашиглах</div>
              <div style={{ fontSize: 11.5, color: CCL.muted, marginTop: 3, lineHeight: 1.45 }}>Зээлийн эргэн төлөлт, автомат хөрөнгө оруулалт зэрэг таны идэвхжүүлсэн тогтмол төлбөрийг энэ картаас суутгана.</div>
            </div>
            <ToggleCL on={autopay} onClick={()=>setAutopay(a=>!a)}/>
          </div>
          <div style={{ marginTop: 11, paddingTop: 11, borderTop:`1px solid ${CCL.line2}`, display:'flex', gap: 7, alignItems:'flex-start' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:1 }}><path d="M12 3l8 3v6c0 4.5-3 7.5-8 9-5-1.5-8-4.5-8-9V6l8-3z" stroke={CCL.green} strokeWidth="2" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke={CCL.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <div style={{ fontSize: 11, color: CCL.muted, lineHeight: 1.45 }}>Таны зөвшөөрөлгүйгээр ямар ч суутгал хийгдэхгүй. Төлбөр бүрийн өмнө мэдэгдэл очно.</div>
          </div>
        </div>
      </div>
      <StickyBarCL>
        <BigBtnCL disabled={!valid}>Холбох</BigBtnCL>
        {!valid && <div style={{ fontSize: 11, color: CCL.muted2, fontWeight: 600, textAlign:'center', marginTop: 8 }}>Картын мэдээллээ бүрэн оруулна уу</div>}
      </StickyBarCL>
    </FrameCL>
  );
};

// ============================================================
// C3 — LINKING (pending)
// ============================================================
const CardLinking = () => (
  <FrameCL label="C3 — Карт холбогдож байна">
    <div style={{ height: 44, flexShrink:0 }}/>
    <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', textAlign:'center', padding:'0 32px' }}>
      <div style={{ position:'relative', width: 110, height: 110, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div className="omf-pulse" style={{ position:'absolute', inset:0, borderRadius: 30, background:'rgba(79,70,229,.22)' }}/>
        <div className="omf-pulse omf-pulse-2" style={{ position:'absolute', inset:0, borderRadius: 30, background:'rgba(79,70,229,.18)' }}/>
        <div style={{ position:'relative', width: 80, height: 80, borderRadius: 24, background:`linear-gradient(135deg, ${CCL.indigo}, ${CCL.blue})`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 14px 30px -10px ${CCL.indigo}99` }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="13" rx="2.5" stroke="#fff" strokeWidth="2"/><path d="M3 10h18M7 15.5h4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
        </div>
      </div>
      <div style={{ fontSize: 23, fontWeight: 800, color: CCL.ink, marginTop: 28, letterSpacing:'-0.02em' }}>Карт холбогдож байна</div>
      <div style={{ fontSize: 13.5, color: CCL.muted, marginTop: 12, lineHeight: 1.55, maxWidth: 290 }}>Картыг банкнаас баталгаажуулж байна. Хэдхэн секунд болно…</div>
      <div style={{ marginTop: 24, display:'flex', alignItems:'center', gap: 10, padding:'10px 14px', borderRadius: 14, background:'#fff', border:`1px solid ${CCL.line2}` }}>
        <BrandMarkCL brand="visa" h={13}/>
        <span style={{ fontSize: 13, fontWeight: 600, color: CCL.muted, fontVariantNumeric:'tabular-nums' }}>•••• 4821</span>
      </div>
    </div>
    <div style={{ padding:'0 24px 18px', flexShrink:0 }}>
      <div style={{ fontSize: 11.5, color: CCL.muted2, textAlign:'center' }}>Картаас мөнгө суутгахгүй — зөвхөн баталгаажуулалт хийнэ.</div>
    </div>
  </FrameCL>
);

// ============================================================
// C4 — LINKED (success + summary)
// ============================================================
const CardLinked = ({ autopay = true }) => (
  <FrameCL label="C4 — Карт холбогдлоо">
    <div style={{ height: 44, flexShrink:0 }}/>
    <div style={{ flex:1, overflow:'auto', padding:'8px 24px 16px', display:'flex', flexDirection:'column' }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', paddingTop: 18 }}>
        <div style={{ width: 88, height: 88, borderRadius: 28, background:`linear-gradient(135deg, #1F8A5B, ${CCL.green})`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 16px 36px -12px ${CCL.green}88` }}>
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{ fontSize: 23, fontWeight: 800, color: CCL.ink, marginTop: 22, letterSpacing:'-0.02em' }}>Карт амжилттай холбогдлоо</div>
        <div style={{ fontSize: 13, color: CCL.muted, marginTop: 10, lineHeight: 1.5, maxWidth: 300 }}>Та картаа профайл хэсгээс хүссэн үедээ удирдах боломжтой.</div>
      </div>
      <div style={{ marginTop: 22, background:'#fff', borderRadius: 18, border:`1px solid ${CCL.line2}`, overflow:'hidden' }}>
        {[
          { l:'Карт', v:<span style={{ display:'flex', alignItems:'center', gap: 8 }}><BrandMarkCL brand="visa" h={11}/><span style={{ fontVariantNumeric:'tabular-nums' }}>•••• 4821</span></span> },
          { l:'Эзэмшигч', v: CARD_HOLDER_CL },
          { l:'Хүчинтэй хугацаа', v:'09/28' },
          { l:'Автомат төлбөр', v: autopay
            ? <span style={{ display:'inline-flex', alignItems:'center', gap: 6, padding:'4px 10px', borderRadius: 999, background: CCL.greenSoft, color: CCL.green, fontSize: 11.5, fontWeight: 800 }}>Зөвшөөрсөн</span>
            : <span style={{ display:'inline-flex', alignItems:'center', gap: 6, padding:'4px 10px', borderRadius: 999, background:'#EEF0F6', color: CCL.muted, fontSize: 11.5, fontWeight: 800 }}>Идэвхгүй</span> },
        ].map((r, i) => (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap: 12, padding:'14px 16px', borderTop: i ? `1px solid ${CCL.line2}` : 'none' }}>
            <span style={{ fontSize: 12.5, color: CCL.muted, fontWeight: 600 }}>{r.l}</span>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: CCL.ink, letterSpacing:'0.02em' }}>{r.v}</span>
          </div>
        ))}
      </div>
      {autopay && (
        <div style={{ marginTop: 12, display:'flex', gap: 9, alignItems:'flex-start', padding:'12px 14px', borderRadius: 14, background:'#FAFBFE', border:`1px solid ${CCL.line2}` }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:1 }}><circle cx="12" cy="12" r="9" stroke={CCL.muted2} strokeWidth="2"/><path d="M12 16v-4M12 8.5h.01" stroke={CCL.muted2} strokeWidth="2" strokeLinecap="round"/></svg>
          <div style={{ fontSize: 11.5, color: CCL.muted, lineHeight: 1.5 }}>Автомат суутгал бүрийн өмнө танд мэдэгдэл очно. Профайл → Миний картууд хэсгээс хүссэн үедээ унтраана.</div>
        </div>
      )}
      <div style={{ flex:1 }}/>
    </div>
    <StickyBarCL>
      <BigBtnCL>Үргэлжлүүлэх</BigBtnCL>
    </StickyBarCL>
  </FrameCL>
);

// ============================================================
// C5 — FAILED (edge case: wrong info / bank declined)
// ============================================================
const CardFailed = () => (
  <FrameCL label="C5 — Карт холбогдсонгүй">
    <div style={{ height: 44, flexShrink:0 }}/>
    <div style={{ flex:1, overflow:'auto', padding:'8px 24px 16px', display:'flex', flexDirection:'column' }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', paddingTop: 18 }}>
        <div style={{ width: 88, height: 88, borderRadius: 28, background: CCL.redSoft, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="13" rx="2.5" stroke={CCL.red} strokeWidth="2"/><path d="M3 10h18" stroke={CCL.red} strokeWidth="2"/><path d="M12 12.5v3M12 18h.01" stroke={CCL.red} strokeWidth="2.2" strokeLinecap="round"/></svg>
        </div>
        <div style={{ fontSize: 23, fontWeight: 800, color: CCL.ink, marginTop: 22, letterSpacing:'-0.02em' }}>Карт холбогдсонгүй</div>
        <div style={{ fontSize: 13, color: CCL.muted, marginTop: 10, lineHeight: 1.55, maxWidth: 300 }}>Банк картыг баталгаажуулж чадсангүй. Дараах шалтгаанууд байж болно:</div>
      </div>
      <div style={{ marginTop: 20, background:'#fff', borderRadius: 16, border:`1px solid ${CCL.line2}`, overflow:'hidden' }}>
        {['Картын дугаар, хугацаа эсвэл CVV буруу оруулсан', 'Картын хүчинтэй хугацаа дууссан', 'Карт интернэт гүйлгээнд хаалттай байна'].map((t, i) => (
          <div key={i} style={{ display:'flex', gap: 11, alignItems:'flex-start', padding:'12px 14px', borderTop: i ? `1px solid ${CCL.line2}` : 'none' }}>
            <div style={{ width: 22, height: 22, borderRadius: 999, background: CCL.redSoft, color: CCL.red, fontWeight: 800, fontSize: 11.5, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{i + 1}</div>
            <span style={{ fontSize: 13, fontWeight: 600, color: CCL.text, lineHeight: 1.45 }}>{t}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, display:'flex', gap: 9, alignItems:'flex-start', padding:'12px 14px', borderRadius: 14, background:'#FAFBFE', border:`1px solid ${CCL.line2}` }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:1 }}><circle cx="12" cy="12" r="9" stroke={CCL.muted2} strokeWidth="2"/><path d="M12 16v-4M12 8.5h.01" stroke={CCL.muted2} strokeWidth="2" strokeLinecap="round"/></svg>
        <div style={{ fontSize: 11.5, color: CCL.muted, lineHeight: 1.5 }}>Интернэт гүйлгээний эрхийг банкныхаа аппаас нээгээд дахин оролдоно уу.</div>
      </div>
      <div style={{ flex:1 }}/>
    </div>
    <StickyBarCL>
      <BigBtnCL>Дахин оролдох</BigBtnCL>
      <button style={{ width:'100%', height: 44, marginTop: 6, background:'transparent', border:'none', color: CCL.muted, fontWeight: 700, fontSize: 13.5, cursor:'pointer' }}>Дараа нь холбох</button>
    </StickyBarCL>
  </FrameCL>
);

Object.assign(window, { CardAsk, CardAdd, CardLinking, CardLinked, CardFailed, CardVisualCL, BrandMarkCL, CARD_GRADS_CL });
