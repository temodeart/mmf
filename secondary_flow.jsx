// ============================================================
// FLOW 2 — Buying from the SECONDARY market (Хоёрдогч зах)
// Screens 2.1 listing detail · 2.2 buy setup · 2.3 review+OTP · 2.4 success
// Listed product: CAPIT 1450 CD 240227
// ============================================================

// ---------- 2.1 — Secondary listing detail ----------
const SecondaryDetail = () => (
  <Frame label="S2.1 — Secondary listing detail">
    <FlowHeader
      title="CAPIT 1450 CD 240227"
      subtitle="Хоёрдогч зах зээлийн санал"
      badge={<Badge tone="active">Зарах санал</Badge>}
    />
    <div style={{ flex: 1, overflow:'auto', padding: '0 24px 16px' }}>
      {/* hero — actual yield is the headline for secondary */}
      <div style={{ borderRadius: 22, padding: 20, background:`linear-gradient(135deg, ${C.navy} 0%, ${C.indigo} 130%)`, color:'#fff', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', right:-30, bottom:-50, width:160, height:160, borderRadius:'50%', background:'radial-gradient(circle, rgba(45,107,255,.45), transparent 70%)'}}/>
        <div style={{ position:'relative' }}>
          <div style={{ fontSize: 11, opacity:.7, fontWeight: 600, letterSpacing:'0.06em' }}>БОДИТ ӨГӨӨЖ</div>
          <div style={{ display:'flex', alignItems:'baseline', gap: 6, marginTop: 6 }}>
            <span style={{ fontSize: 48, fontWeight: 800, letterSpacing:'-0.03em', fontVariantNumeric:'tabular-nums' }}>15.2</span>
            <span style={{ fontSize: 18, opacity:.8 }}>% / жил</span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 10, marginTop: 18 }}>
            {[['Худалдан авах үнэ','100,000 ₮'],['Үлдсэн хугацаа','278 хоног'],['Боломжит','7 ш']].map((x,i)=>(
              <div key={i}>
                <div style={{ fontSize: 9.5, opacity:.6, fontWeight: 600 }}>{x[0]}</div>
                <div style={{ fontSize: 12.5, fontWeight: 700, marginTop: 3, fontVariantNumeric:'tabular-nums' }}>{x[1]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <SectionCard eyebrow="Бүтээгдэхүүний нөхцөл" rows={[
          { l:'Тикер', v:'CAPIT 1450 CD 240227' },
          { l:'Нэрлэсэн үнэ', v:'100,000 MNT' },
          { l:'Нэрлэсэн хүү /жилийн/', v:'14.50%' },
          { l:'Хүү төлөх давтамж', v:'Хугацааны эцэст' },
          { l:'Сүүлд хүү төлөгдсөн огноо', v:'2026-02-24' },
          { l:'Дуусах хүртлэх хугацаа', v:'278 хоног' },
          { l:'Төлөгдөх огноо', v:'2027-02-24' },
          { l:'Боломжит ширхэг', v:'7 ширхэг' },
        ]}/>
      </div>

      <div style={{ marginTop: 14, background: C.blueSoft, borderRadius: 14, padding: 14, display:'flex', gap: 10 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{flexShrink:0, marginTop:1}}><circle cx="12" cy="12" r="9" stroke={C.blue} strokeWidth="2"/><path d="M12 11v5M12 8h.01" stroke={C.blue} strokeWidth="2.2" strokeLinecap="round"/></svg>
        <div style={{ fontSize: 12, color:'#1E40AF', lineHeight: 1.5 }}>Энэ нь өөр хэрэглэгчийн байршуулсан зарах санал. Худалдан авах үнэ болон бодит өгөөж нь анхдагч нөхцөлөөс ялгаатай.</div>
      </div>
      <div style={{ height: 8 }}/>
    </div>
    <StickyBar><BigBtn>Авах</BigBtn></StickyBar>
  </Frame>
);

// ---------- 2.2 — Secondary buy setup ----------
const SecondaryBuySetup = () => {
  const [qty, setQty] = useState(1);
  const max = 7;
  return (
    <Frame label="S2.2 — Secondary buy setup">
      <FlowHeader title="CAPIT 1450 CD 240227" subtitle="Хоёрдогч зах зээлийн санал"/>
      <div style={{ flex: 1, overflow:'auto', padding: '0 24px 16px', display:'flex', flexDirection:'column', gap: 14 }}>
        <ProductMini letter="К" color={C.blue} name="CAPIT 1450 CD 240227"
          sub="Худалдан авах үнэ · 100,000 ₮ · 278 хоног"
          right={<div style={{ textAlign:'right' }}><div style={{ fontSize: 9.5, color: C.muted, fontWeight: 600 }}>Бодит өгөөж</div><div style={{ fontSize: 16, fontWeight: 800, color: C.indigo, fontVariantNumeric:'tabular-nums', letterSpacing:'-0.02em' }}>15.2%</div></div>}/>

        <div style={{ background:'#fff', borderRadius: 18, border:`1px solid ${C.line2}`, padding: 18 }}>
          <EyebrowLabel>Хэдэн ширхэг авах вэ?</EyebrowLabel>
          <QtyStepper value={qty} setValue={setQty} max={max}/>
        </div>

        <SectionCard eyebrow="Саналын мэдээлэл" rows={[
          { l:'Худалдан авах үнэ /нэгж/', v:'100,000 ₮' },
          { l:'Боломжит ширхэг', v:`${max} ширхэг` },
          { l:'Үлдсэн хугацаа', v:'278 хоног' },
          { l:'Жилийн бодит өгөөж', v:'15.2%', tone: C.indigo },
        ]}/>

        <div style={{ display:'flex', alignItems:'center', gap: 10, padding: '2px 4px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={C.muted2} strokeWidth="2"/><path d="M12 11v5M12 8h.01" stroke={C.muted2} strokeWidth="2.2" strokeLinecap="round"/></svg>
          <div style={{ fontSize: 11.5, color: C.muted, fontWeight: 600 }}>Зарах саналын үнийг өөрчлөх боломжгүй — зөвхөн ширхэг сонгоно.</div>
        </div>
        <div style={{ height: 4 }}/>
      </div>
      <StickyBar><BigBtn>Үргэлжлүүлэх</BigBtn></StickyBar>
    </Frame>
  );
};

// ---------- 2.3 — Secondary buy review + OTP ----------
const SecondaryBuyReview = () => (
  <Frame label="S2.3 — Secondary review + OTP">
    <FlowHeader title="CAPIT 1450 CD 240227" subtitle="Хоёрдогч зах зээлийн санал · баталгаажуулалт"/>
    <ReviewScaffold
      consentLabel="Би хоёрдогч зах зээлийн худалдан авалтын нөхцөлтэй танилцаж зөвшөөрч байна."
      ctaLabel="Худалдан авах"
    >
      <SectionCard eyebrow="Бүтээгдэхүүний мэдээлэл" rows={[
        { l:'Нэрлэсэн үнэ', v:'100,000.00 MNT' },
        { l:'Нэрлэсэн хүү /жилийн/', v:'14.50%' },
        { l:'Хүү төлөх давтамж', v:'Хугацааны эцэст' },
        { l:'Сүүлд хүү төлөгдсөн огноо', v:'2026-02-24' },
        { l:'Дуусах хүртлэх хугацаа', v:'271 хоног' },
        { l:'Төлөгдөх огноо', v:'2027-02-24' },
        { l:'Худалдан авах үнэ', v:'100.00%' },
        { l:'Ширхэг', v:'1 ширхэг' },
      ]}/>

      {/* Section A — what you pay today */}
      <div>
        <EyebrowLabel color={C.indigo}>А · Өнөөдөр төлөх дүн</EyebrowLabel>
        <SectionCard rows={[
          { l:'Худалдан авах үнэ', v:'100,000.00 MNT' },
          { l:'Хуримтлагдсан хүү', v:'+ 3,734.25 MNT', tone: C.green },
          { l:'Ноогдох татвар', v:'− 373.42 MNT', tone: C.red },
          { l:'Төлбөр тооцоо хийгдэх дүн', v:'103,360.83 MNT', big: true, tone: C.indigo },
        ]}/>
      </div>

      {/* Section B — what you receive at maturity */}
      <div>
        <EyebrowLabel color={C.green}>Б · Хугацааны эцэст авах</EyebrowLabel>
        <SectionCard rows={[
          { l:'Үндсэн үнэ', v:'100,000.00 MNT' },
          { l:'Хуримтлагдсан хүү', v:'3,734.25 MNT' },
          { l:'Үлдсэн хугацааны хүү', v:'10,765.75 MNT', tone: C.green },
          { l:'Тооцогдох татвар', v:'− 1,076.58 MNT', tone: C.red },
          { l:'Хугацааны эцэст авах', v:'113,050.00 MNT', big: true, tone: C.green },
          { l:'Жилийн бодит өгөөж', v:'12.63%', tone: C.indigo },
        ]}/>
      </div>
    </ReviewScaffold>
  </Frame>
);

// ---------- 2.4 — Secondary buy success ----------
const SecondaryBuySuccess = () => (
  <SuccessScreen
    label="S2.4 — Secondary success"
    title="Худалдан авалт амжилттай хийгдлээ"
    subtitle="Та хоёрдогч зах зээлээс бүтээгдэхүүн амжилттай худалдан авлаа."
    rows={[
      { l:'Бүтээгдэхүүн', v:'CAPIT 1450 CD 240227' },
      { l:'Ширхэг', v:'1 ширхэг' },
      { l:'Төлбөр тооцоо хийгдсэн дүн', v:'103,360.83 MNT', big: true, tone: C.indigo },
      { l:'Төлөгдөх огноо', v:'2027-02-24' },
      { l:'Хугацааны эцэст авах', v:'113,050.00 MNT', big: true, tone: C.green },
      { l:'Жилийн бодит өгөөж', v:'12.63%' },
    ]}
    primaryCta="Миний багц харах"
    secondaryCta="Арилжаа руу буцах"
  />
);
