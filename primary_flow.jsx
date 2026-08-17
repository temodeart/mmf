// ============================================================
// FLOW 1 — Buying from the PRIMARY market (Анхдагч зах)
// Screens 1.1 detail · 1.2 buy setup · 1.3 review+PIN · 1.4 success
// Product: CAPIT 1450 CD · Капитрон Банк ХХК
// ============================================================

// Auto-renew loop: at maturity the principal is re-invested into the same
// product and only the interest lands in the wallet. Shared across flow steps
// (each renders as its own screen in the navigator).
const PF_LOOP = (() => {
  let on = false;
  const subs = new Set();
  return { get on() { return on; }, set(v) { on = v; subs.forEach(f => f(n => n + 1)); }, sub(f) { subs.add(f); return () => subs.delete(f); } };
})();
const usePfLoop = () => { const [, t] = useState(0); useEffect(() => PF_LOOP.sub(t), []); return PF_LOOP; };
const PfLoopIcon = ({ c }) => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M4 12a8 8 0 0113.7-5.6M20 12a8 8 0 01-13.7 5.6" stroke={c} strokeWidth="2" strokeLinecap="round"/><path d="M18 3v4h-4M6 21v-4h4" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const PfLoopCard = ({ on, onToggle, interest }) => (
  <div style={{ background:'#fff', borderRadius: 18, border:`${on ? 2 : 1}px solid ${on ? C.indigo : C.line2}`, padding: 18 }}>
    <div style={{ display:'flex', alignItems:'flex-start', gap: 12 }}>
      <div style={{ width: 38, height: 38, borderRadius: 11, background: on ? C.indigoSoft : '#F4F6FA', display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>
        <PfLoopIcon c={on ? C.indigo : C.muted}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 800, color: C.ink, letterSpacing:'-0.01em' }}>Хугацаа дуусахад дахин автоматаар авах</div>
        <div style={{ fontSize: 11.5, color: C.muted, marginTop: 4, lineHeight: 1.55 }}>Үндсэн дүн ижил бүтээгдэхүүнд дахин хөрөнгө оруулагдаж, зөвхөн хүү хэтэвчид орно.</div>
      </div>
      <button onClick={onToggle} aria-label="Дахин автоматаар авах" style={{ width: 46, height: 28, borderRadius: 999, border:'none', cursor:'pointer', background: on ? C.indigo : '#D9DCE7', position:'relative', flexShrink: 0, transition:'background .2s' }}>
        <span style={{ position:'absolute', top: 3, left: 3, width: 22, height: 22, borderRadius: 999, background:'#fff', boxShadow:'0 2px 6px rgba(0,0,0,.2)', transform: on ? 'translateX(18px)' : 'none', transition:'transform .2s', pointerEvents:'none' }}/>
      </button>
    </div>
    {on ? (
      <div style={{ marginTop: 12, padding:'12px 14px', borderRadius: 12, background: C.indigoSoft, display:'flex', flexDirection:'column', gap: 7 }}>
        {[['Үндсэн дүн', 'Дахин авна → CAPIT 1450 CD'], ['Бодогдсон хүү', interest + ' → Хэтэвч'], ['Давталт', 'Та зогсоох хүртэл']].map(([l, v]) => (
          <div key={l} style={{ display:'flex', justifyContent:'space-between', gap: 12 }}>
            <span style={{ fontSize: 11.5, color: C.muted, fontWeight: 600, flexShrink: 0 }}>{l}</span>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: C.ink, textAlign:'right' }}>{v}</span>
          </div>
        ))}
      </div>
    ) : (
      <div style={{ fontSize: 11, color: C.muted2, marginTop: 10, lineHeight: 1.5, fontWeight: 600 }}>Асаагаагүй тохиолдолд төлөгдөх нийт дүн хэтэвчид орно.</div>
    )}
  </div>
);

// ---------- 1.1 — Primary product detail ----------
const PrimaryDetail = () => (
  <Frame label="P1.1 — Primary detail">
    <FlowHeader
      title="CAPIT 1450 CD"
      subtitle="Анхдагч зах зээлээс авах"
      right={
        <button style={{ width: 40, height: 40, borderRadius: 12, background:'#fff', border:`1px solid ${C.line}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 4h12v17l-6-4-6 4V4z" stroke={C.ink} strokeWidth="2" strokeLinejoin="round" fill="none"/></svg>
        </button>
      }
    />

    <div style={{ flex: 1, overflow:'auto', padding: '0 24px 16px' }}>
      {/* issuer */}
      <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
        <div style={{ width: 46, height: 46, borderRadius: 12, background: C.blue, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight: 800, fontSize: 18 }}>К</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, letterSpacing:'-0.01em' }}>Капитрон Банк ХХК</div>
          <div style={{ display:'flex', gap: 6, marginTop: 6 }}>
            <Badge tone="info">Сертификат</Badge>
            <Badge tone="buy">Анхдагч зах</Badge>
          </div>
        </div>
      </div>

      {/* hero — big annual interest */}
      <div style={{ marginTop: 16, borderRadius: 22, padding: 20, background:`linear-gradient(135deg, ${C.navy} 0%, ${C.indigo} 130%)`, color:'#fff', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', right:-30, bottom:-50, width:160, height:160, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,107,44,.4), transparent 70%)'}}/>
        <div style={{ position:'relative' }}>
          <div style={{ fontSize: 11, opacity:.7, fontWeight: 600, letterSpacing:'0.06em' }}>НЭРЛЭСЭН ХҮҮ /ЖИЛИЙН/</div>
          <div style={{ display:'flex', alignItems:'baseline', gap: 6, marginTop: 6 }}>
            <span style={{ fontSize: 48, fontWeight: 800, letterSpacing:'-0.03em', fontVariantNumeric:'tabular-nums' }}>14.5</span>
            <span style={{ fontSize: 18, opacity:.8 }}>% / жил</span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 10, marginTop: 18 }}>
            {[['Нэрлэсэн үнэ','100,000 ₮'],['Хугацаа','12 сар'],['Боломжит','1,250 ш']].map((x,i)=>(
              <div key={i}>
                <div style={{ fontSize: 9.5, opacity:.6, fontWeight: 600 }}>{x[0]}</div>
                <div style={{ fontSize: 12.5, fontWeight: 700, marginTop: 3, fontVariantNumeric:'tabular-nums' }}>{x[1]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* key info */}
      <div style={{ marginTop: 16 }}>
        <SectionCard rows={[
          { l:'Тикер', v:'CAPIT 1450 CD' },
          { l:'Нэрлэсэн үнэ', v:'100,000 MNT' },
          { l:'Нэрлэсэн хүү /жилийн/', v:'14.50%' },
          { l:'Хүү төлөх давтамж', v:'Хугацааны эцэст' },
          { l:'Хугацаа', v:'12 сар' },
          { l:'Төлөгдөх огноо', v:'2027-05-29' },
          { l:'Боломжит ширхэг', v:'1,250 ширхэг' },
          { l:'Валют', v:'MNT' },
        ]}/>
      </div>

      {/* risk note */}
      <div style={{ marginTop: 14, background:'#FFFBF2', borderRadius: 14, padding: 14, border:`1px solid #FFE9C4`, display:'flex', gap: 10 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{flexShrink:0, marginTop:1}}><path d="M12 8v5M12 17h.01" stroke={C.amber} strokeWidth="2.4" strokeLinecap="round"/><circle cx="12" cy="12" r="9" stroke={C.amber} strokeWidth="2" fill="none"/></svg>
        <div style={{ fontSize: 12, color:'#7A5A1F', lineHeight: 1.5 }}>Өгөөж нь зах зээлийн нөхцөл болон бүтээгдэхүүний нөхцөлөөс хамааран өөрчлөгдөж болно.</div>
      </div>
      <div style={{ height: 8 }}/>
    </div>

    <StickyBar><BigBtn>Авах</BigBtn></StickyBar>
  </Frame>
);

// ---------- 1.2 — Primary buy setup (quantity) ----------
const PrimaryBuySetup = () => {
  const [qty, setQty] = useState(1);
  const loop = usePfLoop();
  const max = 1250;
  const price = 100000;
  const total = qty * price;
  const fmt = (n) => n.toLocaleString('en-US');
  return (
    <Frame label="P1.2 — Primary buy setup">
      <FlowHeader title="CAPIT 1450 CD" subtitle="Анхдагч зах зээлээс авах"/>
      <div style={{ flex: 1, overflow:'auto', padding: '0 24px 16px', display:'flex', flexDirection:'column', gap: 14 }}>
        <ProductMini letter="К" color={C.blue} name="Капитрон Банк ХХК · Сертификат"
          sub="CAPIT 1450 CD · 100,000 ₮ · 12 сар"
          right={<div style={{ fontSize: 16, fontWeight: 800, color: C.indigo, fontVariantNumeric:'tabular-nums', letterSpacing:'-0.02em' }}>14.5%</div>}/>

        <div style={{ background:'#fff', borderRadius: 18, border:`1px solid ${C.line2}`, padding: 18 }}>
          <EyebrowLabel>Тоо ширхэг сонгох</EyebrowLabel>
          <QtyStepper value={qty} setValue={setQty} max={max}/>
        </div>

        <PfLoopCard on={loop.on} onToggle={()=>loop.set(!loop.on)} interest={'+' + fmt(qty * 13050) + ' ₮'}/>

        <SectionCard eyebrow="Захиалгын мэдээлэл" rows={[
          { l:'Нэрлэсэн үнэ', v:'100,000 ₮' },
          { l:'Тоо ширхэг', v:`${qty} ширхэг` },
          { l:'Хугацаа', v:'12 сар' },
          { l:'Төлөгдөх огноо', v:'2027-05-29' },
          { l:'Хугацааны эцэст', v: loop.on ? 'Үндсэн дүн дахин авна' : 'Нийт дүн хэтэвчид' },
          { l:'Худалдан авах нийт үнэ', v:`${fmt(total)} ₮`, big: true, tone: C.indigo },
        ]}/>

        <div style={{ display:'flex', alignItems:'center', gap: 10, padding: '2px 4px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={C.muted2} strokeWidth="2"/><path d="M12 11v5M12 8h.01" stroke={C.muted2} strokeWidth="2.2" strokeLinecap="round"/></svg>
          <div style={{ fontSize: 11.5, color: C.muted, fontWeight: 600 }}>Анхдагч зах зээлийн нэрлэсэн үнэ тогтмол — зөвхөн тоо ширхэгээ сонгоно.</div>
        </div>
        <div style={{ height: 4 }}/>
      </div>
      <StickyBar><BigBtn>Үргэлжлүүлэх</BigBtn></StickyBar>
    </Frame>
  );
};

// ---------- 1.3 — Primary buy review + PIN ----------
const PrimaryBuyReview = () => { const loop = usePfLoop(); return (
  <Frame label="P1.3 — Primary review + PIN">
    <FlowHeader title="CAPIT 1450 CD" subtitle="Анхдагч зах зээлээс авах · баталгаажуулалт"/>
    <ReviewScaffold
      consentLabel="Би бүтээгдэхүүний нөхцөл, захиалгын мэдээлэлтэй танилцаж зөвшөөрч байна."
      ctaLabel="Худалдан авах"
    >
      <SectionCard eyebrow="Бүтээгдэхүүний мэдээлэл" rows={[
        { l:'Бүтээгдэхүүн', v:'CAPIT 1450 CD' },
        { l:'Үнэт цаас гаргагч', v:'Капитрон Банк ХХК' },
        { l:'Нэрлэсэн үнэ', v:'100,000 MNT' },
        { l:'Нэрлэсэн хүү /жилийн/', v:'14.50%' },
        { l:'Хүү төлөх давтамж', v:'Хугацааны эцэст' },
        { l:'Хугацаа', v:'12 сар' },
        { l:'Төлөгдөх огноо', v:'2027-05-29' },
        { l:'Валют', v:'MNT' },
      ]}/>
      <SectionCard eyebrow="Захиалгын мэдээлэл" rows={[
        { l:'Ширхэг', v:'1 ширхэг' },
        { l:'Худалдан авах үнэ', v:'100,000.00 ₮' },
        { l:'Дахин автоматаар авах', v: loop.on ? 'Асаалттай' : 'Асаалтгүй', tone: loop.on ? C.indigo : undefined },
      ]}/>
      <SectionCard eyebrow="Төлбөр / өгөөжийн тооцоо" rows={[
        { l:'Бодогдох хүү', v:'14,500.00 ₮', tone: C.green },
        { l:'Татвар', v:'− 1,450.00 ₮', tone: C.red },
        { l:'Хугацааны эцэст төлөгдөх дүн', v:'113,050.00 ₮', big: true },
        { l:'Бодит өгөөж', v:'13.05%', tone: C.indigo },
        { l:'Бэлэн мөнгөний үлдэгдэл', v:'635.89 MNT' },
      ]}/>
      {loop.on && (
        <div style={{ background: C.indigoSoft, borderRadius: 16, padding:'14px 16px', display:'flex', gap: 11, alignItems:'flex-start' }}>
          <div style={{ flexShrink: 0, marginTop: 1 }}><PfLoopIcon c={C.indigo}/></div>
          <div style={{ fontSize: 12, color: C.text, lineHeight: 1.55, fontWeight: 600 }}>
            <b style={{ color: C.ink }}>2027-05-29</b>-нд үндсэн 100,000 ₮ ижил бүтээгдэхүүнд дахин орж, 13,050 ₮ хүү хэтэвчид орно. Давталтыг хүссэн үедээ зогсоож болно.
          </div>
        </div>
      )}
    </ReviewScaffold>
  </Frame>
); };

// ---------- 1.3b — Primary buy · PIN confirm (own step) ----------
const PrimaryBuyPin = () => (
  <PinConfirm
    label="P1.3b — Primary · PIN"
    subtitle="CAPIT 1450 CD худалдан авалтыг баталгаажуулна уу."
    amount="100,000.00 ₮"
    amountLabel="Худалдан авах дүн"
    ctaLabel="Худалдан авах"
  />
);

// ---------- 1.4 — Primary buy success ----------
const PrimaryBuySuccess = () => { const loop = usePfLoop(); return (
  <SuccessScreen
    label="P1.4 — Primary success"
    title="Худалдан авалт амжилттай хийгдлээ"
    subtitle={loop.on
      ? 'Бүтээгдэхүүн авлаа. Хугацаа дуусахад үндсэн дүн ижил бүтээгдэхүүнд дахин автоматаар орно.'
      : 'Та анхдагч зах зээлээс бүтээгдэхүүн амжилттай худалдан авлаа.'}
    rows={[
      { l:'Бүтээгдэхүүн', v:'CAPIT 1450 CD' },
      { l:'Ширхэг', v:'1 ширхэг' },
      { l:'Худалдан авсан дүн', v:'100,000 MNT' },
      { l:'Төлөгдөх огноо', v:'2027-05-29' },
      { l:'Дахин автоматаар авах', v: loop.on ? 'Асаалттай · үндсэн дүн' : 'Асаалтгүй', tone: loop.on ? C.indigo : undefined },
      { l: loop.on ? 'Хүү хэтэвчид орно' : 'Хугацааны эцэст авах дүн', v: loop.on ? '13,050 MNT' : '113,050 MNT', big: true, tone: C.green },
    ]}
    primaryCta="Миний багц харах"
    secondaryCta="Нүүр рүү буцах"
  />
); };
