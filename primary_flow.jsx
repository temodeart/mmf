// ============================================================
// FLOW 1 — Buying from the PRIMARY market (Анхдагч зах)
// Screens 1.1 detail · 1.2 buy setup · 1.3 review+OTP · 1.4 success
// Product: CAPIT 1450 CD · Капитрон Банк ХХК
// ============================================================

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

        <SectionCard eyebrow="Захиалгын мэдээлэл" rows={[
          { l:'Нэрлэсэн үнэ', v:'100,000 ₮' },
          { l:'Тоо ширхэг', v:`${qty} ширхэг` },
          { l:'Хугацаа', v:'12 сар' },
          { l:'Төлөгдөх огноо', v:'2027-05-29' },
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

// ---------- 1.3 — Primary buy review + OTP ----------
const PrimaryBuyReview = () => (
  <Frame label="P1.3 — Primary review + OTP">
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
      ]}/>
      <SectionCard eyebrow="Төлбөр / өгөөжийн тооцоо" rows={[
        { l:'Бодогдох хүү', v:'14,500.00 ₮', tone: C.green },
        { l:'Татвар', v:'− 1,450.00 ₮', tone: C.red },
        { l:'Хугацааны эцэст төлөгдөх дүн', v:'113,050.00 ₮', big: true },
        { l:'Бодит өгөөж', v:'13.05%', tone: C.indigo },
        { l:'Бэлэн мөнгөний үлдэгдэл', v:'635.89 MNT' },
      ]}/>
    </ReviewScaffold>
  </Frame>
);

// ---------- 1.4 — Primary buy success ----------
const PrimaryBuySuccess = () => (
  <SuccessScreen
    label="P1.4 — Primary success"
    title="Худалдан авалт амжилттай хийгдлээ"
    subtitle="Та анхдагч зах зээлээс бүтээгдэхүүн амжилттай худалдан авлаа."
    rows={[
      { l:'Бүтээгдэхүүн', v:'CAPIT 1450 CD' },
      { l:'Ширхэг', v:'1 ширхэг' },
      { l:'Худалдан авсан дүн', v:'100,000 MNT' },
      { l:'Төлөгдөх огноо', v:'2027-05-29' },
      { l:'Хугацааны эцэст авах дүн', v:'113,050 MNT', big: true, tone: C.green },
    ]}
    primaryCta="Миний багц харах"
    secondaryCta="Нүүр рүү буцах"
  />
);
