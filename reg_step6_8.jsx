// reg_step6_8.jsx — MMF Web · Registration steps 6–8
// Step6Terms · Step7MasterContract · Step8Signing (E-signature canvas + G-Sign flow)
// Load after reg_shell.jsx.

const { useState: _uS68, useRef: _uR68, useEffect: _uE68 } = React;
const { RegT: T, STEPS, StepCard, StepFooter, GSignLogo } = window;

/* ── shared: scrollable document body that unlocks the agree checkbox
   once the user reaches the bottom (scroll-to-enable). ── */
const ScrollDoc = ({ sections, onReachEnd, height=320 }) => {
  const ref = _uR68(null);
  const onScroll = () => {
    const el = ref.current; if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 6) onReachEnd();
  };
  _uE68(() => {
    // if content already fits without scrolling, unlock immediately
    const el = ref.current; if (el && el.scrollHeight <= el.clientHeight + 4) onReachEnd();
  }, []);
  return (
    <div ref={ref} onScroll={onScroll} style={{ background:T.field, borderRadius:16, border:`1px solid ${T.line2}`, padding:'6px 20px', maxHeight:height, overflowY:'auto' }}>
      {sections.map((s,i) => (
        <div key={i} style={{ padding:'16px 0', borderTop: i ? `1px solid ${T.line2}` : 'none' }}>
          <div style={{ fontSize:14, fontWeight:800, color:T.ink, letterSpacing:'-0.01em' }}>{s.h}</div>
          <div style={{ fontSize:13, color:T.text, marginTop:7, lineHeight:1.65 }}>{s.b}</div>
        </div>
      ))}
    </div>
  );
};

const AgreeRow = ({ checked, onToggle, disabled, label }) => (
  <button onClick={disabled ? undefined : onToggle} style={{ width:'100%', textAlign:'left', display:'flex', gap:12, alignItems:'flex-start', padding:14, borderRadius:14, background: checked?T.indigoSoft:T.field, border:`1px solid ${checked?T.indigoBorder:T.line2}`, cursor: disabled?'not-allowed':'pointer', fontFamily:'inherit', opacity: disabled?.6:1, marginTop:16 }}>
    <div style={{ width:22, height:22, borderRadius:7, background: checked?T.indigo:T.surface, border:`1.5px solid ${checked?T.indigo:T.line}`, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', marginTop:1 }}>
      {checked && <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </div>
    <div style={{ fontSize:12.5, color:T.ink, lineHeight:1.5, fontWeight:600 }}>{label}</div>
  </button>
);

/* ══ STEP 6 · Үйлчилгээний нөхцөл ══ */
const TERMS_SECTIONS = [
  { h:'1. Ерөнхий нөхцөл', b:'Энэхүү нөхцөл нь MMF платформ болон түүний бүтээгдэхүүн, үйлчилгээг ашиглахтай холбоотой талуудын эрх, үүргийг зохицуулна.' },
  { h:'2. Хэрэглэгчийн үүрэг', b:'Хэрэглэгч үнэн зөв мэдээлэл оруулах, нэвтрэх мэдээллээ хамгаалах, гүйлгээний аюулгүй байдлыг хангах үүрэгтэй.' },
  { h:'3. Эрсдэлийн мэдэгдэл', b:'Хөрөнгө оруулалтын өгөөж нь зах зээлийн нөхцөлөөс хамаарч өөрчлөгдөж болохыг хэрэглэгч хүлээн зөвшөөрнө.' },
  { h:'4. Мэдээллийн нууцлал', b:'Таны хувийн мэдээллийг холбогдох хууль тогтоомжийн дагуу хамгаалж, зөвхөн үйлчилгээний зорилгоор ашиглана.' },
  { h:'5. Хариуцлага', b:'Платформ нь техникийн доголдол, гуравдагч талын үйлчилгээний саатлаас үүдэлтэй шууд бус хохирлыг хариуцахгүй болохыг хэрэглэгч хүлээн зөвшөөрнө.' },
];

const Step6Terms = ({ onNext, onBack }) => {
  const [reachedEnd, setReachedEnd] = _uS68(false);
  const [checked, setChecked] = _uS68(false);
  return (
    <StepCard step={STEPS[6]} footer={
      <StepFooter onBack={onBack} primaryLabel="Зөвшөөрөх" onPrimary={onNext}
        primaryDisabled={!checked} primaryReason={!reachedEnd ? 'Нөхцөлийг эцэс хүртэл уншина уу.' : !checked ? 'Зөвшөөрснөө тэмдэглэнэ үү.' : undefined}/>
    }>
      <h1 style={{ fontSize:24, fontWeight:800, color:T.ink, letterSpacing:'-0.02em', lineHeight:1.25, margin:'0 0 10px' }}>Үйлчилгээний нөхцөл</h1>
      <p style={{ fontSize:14, color:T.muted, lineHeight:1.6, margin:'0 0 20px' }}>Үйлчилгээг ашиглахын өмнө үйлчилгээний нөхцөлтэй танилцаж зөвшөөрнө үү.</p>
      <ScrollDoc sections={TERMS_SECTIONS} onReachEnd={() => setReachedEnd(true)}/>
      <AgreeRow checked={checked} onToggle={() => setChecked(c=>!c)} disabled={!reachedEnd} label="Би үйлчилгээний нөхцөлтэй танилцаж, зөвшөөрч байна."/>
      {!reachedEnd && (
        <div style={{ marginTop:10, fontSize:11.5, color:T.muted2, fontWeight:600, textAlign:'center' }}>Зөвшөөрлийн нүд идэвхжихийн тулд бичвэрийг эцэс хүртэл гүйлгэнэ үү.</div>
      )}
    </StepCard>
  );
};

/* ══ STEP 7 · Мастер гэрээ ══ */
const CONTRACT_SECTIONS = [
  { h:'Данс нээх, хаах ерөнхий нөхцөл', b:'MMF платформ дээр хэрэглэгчийн данс нээх, хааx, идэвхгүй болгох нөхцөлийг тодорхойлно.' },
  { h:'Арилжаа, гүйлгээний эрх, хязгаарлалт', b:'Худалдан авах, зарах болон мөнгөн хөрөнгө шилжүүлэх эрх, өдрийн болон гүйлгээ тус бүрийн хязгаарыг заана.' },
  { h:'Шимтгэл, хураамжийн ерөнхий заалт', b:'Гүйлгээ тус бүрт хамаарах шимтгэл, хураамжийн тооцооллын үндсэн зарчмыг тодорхойлно.' },
];

const Step7MasterContract = ({ onNext, onBack }) => {
  const [reachedEnd, setReachedEnd] = _uS68(false);
  const [checked, setChecked] = _uS68(false);
  return (
    <StepCard step={STEPS[7]} footer={
      <StepFooter onBack={onBack} dark primaryLabel="Гэрээ байгуулах" onPrimary={onNext}
        primaryDisabled={!checked} primaryReason={!reachedEnd ? 'Гэрээг эцэс хүртэл уншина уу.' : !checked ? 'Зөвшөөрснөө тэмдэглэнэ үү.' : undefined}/>
    }>
      <div style={{ borderRadius:20, padding:22, position:'relative', overflow:'hidden', background:`linear-gradient(135deg, ${T.navy} 0%, ${T.indigo} 130%)`, color:'#fff', marginBottom:22 }}>
        <div style={{ position:'absolute', right:-30, bottom:-40, width:150, height:150, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,107,44,.4), transparent 70%)' }}/>
        <div style={{ position:'relative' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ width:48, height:48, borderRadius:14, background:'rgba(255,255,255,.12)', border:'1px solid rgba(255,255,255,.18)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M7 3h7l4 4v14a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="#fff" strokeWidth="2" fill="none" strokeLinejoin="round"/><path d="M14 3v4h4M9 13h6M9 17h4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <span style={{ fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:999, background:'rgba(255,255,255,.12)', border:'1px solid rgba(255,255,255,.18)' }}>MMF-MC-2026</span>
          </div>
          <div style={{ fontSize:18, fontWeight:800, marginTop:16, letterSpacing:'-0.01em' }}>Үйлчилгээний мастер гэрээ</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:16 }}>
            <div><div style={{ fontSize:10, opacity:.6, fontWeight:600 }}>1-р тал</div><div style={{ fontSize:13, fontWeight:700, marginTop:3 }}>Мони Маркет Фанд ХХК</div></div>
            <div><div style={{ fontSize:10, opacity:.6, fontWeight:600 }}>2-р тал</div><div style={{ fontSize:13, fontWeight:700, marginTop:3 }}>Тэмүүжин Б.</div></div>
          </div>
        </div>
      </div>

      <p style={{ fontSize:14, color:T.text, lineHeight:1.6, margin:'0 0 18px' }}>MMF платформын бүтээгдэхүүн, үйлчилгээг ашиглахын тулд мастер гэрээг баталгаажуулах шаардлагатай.</p>
      <ScrollDoc sections={CONTRACT_SECTIONS} onReachEnd={() => setReachedEnd(true)} height={220}/>
      <AgreeRow checked={checked} onToggle={() => setChecked(c=>!c)} disabled={!reachedEnd} label="Би мастер гэрээтэй танилцаж, зөвшөөрч байна."/>
      {!reachedEnd && (
        <div style={{ marginTop:10, fontSize:11.5, color:T.muted2, fontWeight:600, textAlign:'center' }}>Зөвшөөрлийн нүд идэвхжихийн тулд гэрээг эцэс хүртэл гүйлгэнэ үү.</div>
      )}
    </StepCard>
  );
};

/* ══ STEP 8 · Гарын үсэг зурах — signing method + e-sign canvas + G-Sign ══ */
const ESignCanvas = ({ onDrawn }) => {
  const canvasRef = _uR68(null);
  const [drawn, setDrawn] = _uS68(false);

  _uE68(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = T.ink;
    let drawing = false, last = null;
    const pos = e => { const r = canvas.getBoundingClientRect(); return { x:e.clientX-r.left, y:e.clientY-r.top }; };
    const start = e => { drawing = true; last = pos(e); setDrawn(true); onDrawn && onDrawn(true); e.preventDefault(); };
    const move = e => { if (!drawing) return; const p = pos(e); ctx.beginPath(); ctx.moveTo(last.x,last.y); ctx.lineTo(p.x,p.y); ctx.stroke(); last = p; e.preventDefault(); };
    const end = () => { drawing = false; };
    canvas.addEventListener('pointerdown', start);
    canvas.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
    canvas._clear = () => { ctx.clearRect(0,0,canvas.width,canvas.height); setDrawn(false); onDrawn && onDrawn(false); };
    return () => { canvas.removeEventListener('pointerdown', start); canvas.removeEventListener('pointermove', move); window.removeEventListener('pointerup', end); };
  }, []);

  const clear = () => { const c = canvasRef.current; if (c && c._clear) c._clear(); };

  return (
    <div>
      <div style={{ position:'relative', borderRadius:18, background:T.surface, border:`1.5px solid ${T.line}`, overflow:'hidden' }}>
        <canvas ref={canvasRef} style={{ display:'block', width:'100%', height:260, touchAction:'none', cursor:'crosshair' }}/>
        <div style={{ position:'absolute', left:24, right:24, bottom:52, height:1, borderTop:`1.5px dashed ${T.line}`, pointerEvents:'none' }}/>
        <div style={{ position:'absolute', left:24, bottom:32, fontSize:11, color:T.muted2, fontWeight:600, pointerEvents:'none' }}>✕ Гарын үсэг</div>
        {!drawn && <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}><span style={{ fontSize:15, color:T.muted2, fontWeight:600 }}>Энд хулганаараа зурна уу</span></div>}
      </div>
      <button onClick={clear} style={{ marginTop:12, height:38, padding:'0 15px', borderRadius:11, background:T.surface, border:`1.5px solid ${T.line}`, color:T.ink, fontWeight:700, fontSize:12.5, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:7, fontFamily:'inherit' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" stroke={T.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Арилгах
      </button>
    </div>
  );
};

const Step8Signing = ({ onNext, onBack }) => {
  const [stage, setStage] = _uS68('choose');   // choose | esign | gsign-request | gsign-waiting
  const [drawn, setDrawn] = _uS68(false);
  const [regnoTab, setRegnoTab] = _uS68(0);

  if (stage === 'choose') return (
    <StepCard step={STEPS[8]} footer={<StepFooter onBack={onBack} hideBack={false} primaryLabel="Товч сонгоно уу" onPrimary={()=>{}} primaryDisabled/>}>
      <h1 style={{ fontSize:24, fontWeight:800, color:T.ink, letterSpacing:'-0.02em', lineHeight:1.25, margin:'0 0 10px' }}>Гэрээгээ хэрхэн баталгаажуулах вэ?</h1>
      <p style={{ fontSize:14, color:T.muted, lineHeight:1.6, margin:'0 0 20px' }}>Хоёр аргын алинаар ч гэрээ хүчинтэй. Эрхийн хүрээ нь ялгаатай.</p>

      <div style={{ borderRadius:20, padding:18, position:'relative', background:T.surface, border:`2px solid ${T.pos}`, boxShadow:'0 10px 30px -16px rgba(14,159,110,.5)' }}>
        <div style={{ position:'absolute', top:-11, right:18, padding:'4px 10px', borderRadius:999, background:T.pos, color:'#fff', fontSize:10, fontWeight:800, letterSpacing:'0.04em' }}>САНАЛ БОЛГОХ</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <GSignLogo size={32}/>
          <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:999, background:T.posSoft, color:T.pos, fontSize:10, fontWeight:800 }}><window.WebDot color={T.pos}/>Бүх үйлчилгээ нээгдэнэ</span>
        </div>
        <p style={{ fontSize:12.5, color:T.text, marginTop:14, lineHeight:1.55 }}>G-Sign ашигласнаар <b style={{ color:T.ink }}>Итгэлцлийн үйлчилгээ</b> зэрэг бүх бүтээгдэхүүн ашиглах боломжтой болно.</p>
        <button onClick={() => setStage('gsign-request')} style={{ width:'100%', height:48, borderRadius:14, marginTop:14, background:T.indigo, color:'#fff', border:'none', fontWeight:700, fontSize:14, cursor:'pointer' }}>G-Sign ашиглах</button>
      </div>

      <div style={{ marginTop:14, borderRadius:20, padding:18, background:T.surface, border:`1px solid ${T.line}` }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:38, height:38, borderRadius:11, background:T.indigoSoft, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 18c3-1 4-9 6-9s2 6 4 6 2-4 4-4" stroke={T.indigo} strokeWidth="2" fill="none" strokeLinecap="round"/><path d="M4 21h16" stroke={T.indigo} strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <div style={{ fontSize:16, fontWeight:800, color:T.ink }}>Цахим гарын үсэг</div>
          </div>
          <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:999, background:T.warnSoft, color:T.warn, fontSize:10, fontWeight:800 }}><window.WebDot color={T.warn}/>Хязгаарлагдмал</span>
        </div>
        <p style={{ fontSize:12.5, color:T.text, marginTop:14, lineHeight:1.55 }}>Энэ сонголтоор ихэнх бүтээгдэхүүн нээгдэх боловч <b style={{ color:T.ink }}>Итгэлцлийн үйлчилгээ</b> ашиглах боломжгүй.</p>
        <button onClick={() => setStage('esign')} style={{ width:'100%', height:48, borderRadius:14, marginTop:14, background:T.surface, color:T.ink, border:`1.5px solid ${T.line}`, fontWeight:700, fontSize:14, cursor:'pointer' }}>Цахимаар зурах</button>
      </div>
    </StepCard>
  );

  if (stage === 'esign') return (
    <StepCard step={STEPS[8]} footer={
      <StepFooter onBack={() => setStage('choose')} primaryLabel="Гарын үсэг баталгаажуулах" onPrimary={onNext}
        primaryDisabled={!drawn} primaryReason={!drawn ? 'Дээрх талбарт гарын үсгээ зурна уу.' : undefined}/>
    }>
      <h1 style={{ fontSize:22, fontWeight:800, color:T.ink, letterSpacing:'-0.02em', margin:'0 0 10px' }}>Цахим гарын үсэг</h1>
      <p style={{ fontSize:13.5, color:T.muted, lineHeight:1.6, margin:'0 0 18px' }}>Доорх талбарт хулгана эсвэл трэкпадаараа гарын үсгээ зурна уу.</p>
      <ESignCanvas onDrawn={setDrawn}/>
    </StepCard>
  );

  if (stage === 'gsign-request') return (
    <StepCard step={STEPS[8]} footer={<StepFooter onBack={() => setStage('choose')} dark primaryLabel="G-Sign хүсэлт илгээх" onPrimary={() => setStage('gsign-waiting')}/>}>
      <div style={{ borderRadius:20, padding:22, background:'linear-gradient(160deg, #ECFBF3 0%, #F4FBF7 60%, #FFFFFF 100%)', border:'1px solid #CFEEDD', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <GSignLogo size={36}/>
        <span style={{ fontSize:11, fontWeight:700, color:T.pos, padding:'4px 10px', borderRadius:999, background:T.posSoft }}>Төрийн үйлчилгээ</span>
      </div>
      <h2 style={{ fontSize:17, fontWeight:800, color:T.ink, marginTop:20, letterSpacing:'-0.01em' }}>G-Sign-аар баталгаажуулах</h2>
      <p style={{ fontSize:12.5, color:T.muted, marginTop:6, lineHeight:1.5 }}>Мэдээллээ оруулснаар G-Sign апп руу хүсэлт илгээнэ.</p>

      <div style={{ marginTop:18, background:T.line2, borderRadius:14, padding:4, display:'flex' }}>
        {['Регистрийн дугаар','Иргэний бүртгэлийн дугаар'].map((t,i) => (
          <div key={i} onClick={() => setRegnoTab(i)} style={{ flex:1, height:42, borderRadius:10, padding:'0 4px', background: regnoTab===i?T.surface:'transparent', boxShadow: regnoTab===i?'0 2px 6px -2px rgba(15,20,55,.12)':'none', display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center', fontWeight: regnoTab===i?700:600, fontSize:11.5, color: regnoTab===i?T.ink:T.muted, cursor:'pointer', lineHeight:1.15 }}>{t}</div>
        ))}
      </div>

      <div style={{ marginTop:18 }}>
        <div style={{ fontSize:12, color:T.muted, fontWeight:600, marginBottom:8 }}>{regnoTab===0?'Регистрийн дугаар':'Иргэний бүртгэлийн дугаар'}</div>
        <div style={{ height:52, borderRadius:14, background:T.surface, border:`1.5px solid ${T.indigo}`, boxShadow:`0 0 0 4px ${T.indigoSoft}`, padding:'0 16px', display:'flex', alignItems:'center', color:T.ink, fontSize:16, fontWeight:700, fontFamily:"'JetBrains Mono',monospace", letterSpacing:'0.06em' }}>{regnoTab===0?'УБ 95 02 18 11':'200 145 2261'}</div>
      </div>

      <div style={{ marginTop:16 }}>
        <div style={{ fontSize:12, color:T.muted, fontWeight:600, marginBottom:8 }}>Утасны дугаар</div>
        <div style={{ height:52, borderRadius:14, background:T.field, border:`1.5px solid ${T.line}`, display:'flex', alignItems:'center', padding:'0 16px', gap:10 }}>
          <span style={{ fontSize:14, fontWeight:700, color:T.ink, paddingRight:10, borderRight:`1px solid ${T.line}`, fontFamily:"'JetBrains Mono',monospace" }}>+976</span>
          <span style={{ fontSize:15, fontWeight:600, color:T.ink, fontFamily:"'JetBrains Mono',monospace", letterSpacing:'0.04em' }}>9552 2981</span>
        </div>
      </div>
    </StepCard>
  );

  if (stage === 'gsign-waiting') return (
    <StepCard step={STEPS[8]} footer={<StepFooter onBack={() => setStage('gsign-request')} primaryLabel="Шалгах" onPrimary={onNext}/>}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', padding:'10px 0' }}>
        <div style={{ position:'relative', width:104, height:104, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div className="reg-pulse" style={{ position:'absolute', inset:0, borderRadius:30, background:'rgba(14,159,110,.25)' }}/>
          <div style={{ position:'relative', width:76, height:76, borderRadius:22, background:'linear-gradient(135deg, #1F8A5B, #0E9F6E)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 14px 30px -10px rgba(14,159,110,.6)' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M20.5 12a8.5 8.5 0 1 0-3 6.5" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round"/><path d="M12 12h6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"/></svg>
          </div>
        </div>
        <div style={{ fontSize:22, fontWeight:800, color:T.ink, marginTop:24, letterSpacing:'-0.02em' }}>G-Sign хүсэлт илгээгдлээ</div>
        <p style={{ fontSize:13.5, color:T.muted, marginTop:10, lineHeight:1.55, maxWidth:340 }}>Та G-Sign апп руу орж хүсэлтийг зөвшөөрөн гэрээг баталгаажуулна уу.</p>
        <div style={{ marginTop:20, width:'100%', background:T.field, borderRadius:16, border:`1px solid ${T.line2}`, padding:16, display:'flex', gap:12, textAlign:'left' }}>
          <div style={{ width:34, height:34, borderRadius:10, background:T.indigoSoft, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={T.indigo} strokeWidth="2" fill="none"/><path d="M12 16v-4M12 8.5h.01" stroke={T.indigo} strokeWidth="2" strokeLinecap="round"/></svg>
          </div>
          <div style={{ fontSize:12.5, color:T.text, lineHeight:1.55 }}>G-Sign апп дээр баталгаажуулсны дараа энэ хуудас руу буцаж <b style={{ color:T.ink }}>«Шалгах»</b> товчийг дарна уу.</div>
        </div>
      </div>
    </StepCard>
  );

  return null;
};

Object.assign(window, { Step6Terms, Step7MasterContract, Step8Signing });
