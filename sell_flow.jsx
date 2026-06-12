// ============================================================
// FLOW 3 — SELLING an owned product to the SECONDARY market
// Screens 3.1 owned detail · 3.2 sell setup · 3.3 review+OTP · 3.4 listing success
// IMPORTANT: this creates a sell LISTING — not an instant cash sale.
// ============================================================

// ---------- 3.1 — Owned product detail ----------
const OwnedDetail = () => (
  <Frame label="L3.1 — Owned product detail">
    <FlowHeader title="CAPIT 1450 CD" subtitle="Миний багц · эзэмшиж буй бүтээгдэхүүн"/>
    <div style={{ flex: 1, overflow:'auto', padding: '0 24px 16px' }}>
      {/* owned summary */}
      <div style={{ borderRadius: 22, padding: 20, background:'#fff', border:`1px solid ${C.line2}`, boxShadow:'0 2px 6px -2px rgba(15,20,55,.04)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, background: C.blue, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight: 800, fontSize: 18 }}>К</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>Капитрон Банк ХХК</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 2, fontWeight: 600 }}>Сертификат · CAPIT 1450 CD</div>
            </div>
          </div>
          <Badge tone="active">Эзэмшилд</Badge>
        </div>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginTop: 18 }}>
          <div>
            <div style={{ fontSize: 10.5, color: C.muted, fontWeight: 600 }}>Эзэмшиж буй ширхэг</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: C.ink, letterSpacing:'-0.02em', fontVariantNumeric:'tabular-nums' }}>1 <span style={{ fontSize: 14, color: C.muted, fontWeight: 600 }}>ширхэг</span></div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize: 10.5, color: C.muted, fontWeight: 600 }}>Хуримтлагдсан хүү</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.green, fontVariantNumeric:'tabular-nums' }}>+3,734 ₮</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <SectionCard rows={[
          { l:'Нэрлэсэн үнэ', v:'100,000 MNT' },
          { l:'Нэрлэсэн хүү /жилийн/', v:'14.50%' },
          { l:'Хүү төлөх давтамж', v:'Хугацааны эцэст' },
          { l:'Үлдсэн хугацаа', v:'278 хоног' },
          { l:'Төлөгдөх огноо', v:'2027-02-24' },
          { l:'Хугацааны эцэст авах дүн', v:'113,050 MNT', tone: C.green },
        ]}/>
      </div>
      <div style={{ height: 8 }}/>
    </div>
    <StickyBar><BigBtn>Хоёрдогч зах зээлд зарах</BigBtn></StickyBar>
  </Frame>
);

// ---------- 3.2 — Sell setup (create listing) ----------
const SellSetup = () => {
  const [qty, setQty] = useState(1);
  const [mode, setMode] = useState(0); // 0 percent, 1 price
  const [cond, setCond] = useState(2); // condition index
  const conditions = ['Тухайн өдөр дуусах хүртэл','Заасан өдөр дуусах хүртэл','Нөхцөл биелтэл хүчинтэй'];
  return (
    <Frame label="L3.2 — Sell setup">
      <FlowHeader title="CAPIT 1450 CD" subtitle="Хоёрдогч зах зээлд зарах"/>
      <div style={{ flex: 1, overflow:'auto', padding: '0 24px 16px', display:'flex', flexDirection:'column', gap: 14 }}>
        {/* product selector */}
        <div>
          <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 8 }}>Бүтээгдэхүүн</div>
          <div style={{ height: 54, borderRadius: 14, background:'#fff', border:`1.5px solid ${C.line}`, padding: '0 14px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: C.blue, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight: 800, fontSize: 12 }}>К</div>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: C.ink, fontVariantNumeric:'tabular-nums' }}>CAPIT 1450 CD 011226 · Үлдэгдэл [1]</span>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke={C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>

        <div style={{ display:'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <Field label="Нэрлэсэн үнэ" value="100,000 ₮"/>
          </div>
          <div style={{ flex: 1 }}>
            <Field label="Эзэмшиж буй" value="1 ширхэг"/>
          </div>
        </div>

        <div style={{ background:'#fff', borderRadius: 18, border:`1px solid ${C.line2}`, padding: 18 }}>
          <EyebrowLabel>Зарах тоо ширхэг</EyebrowLabel>
          <QtyStepper value={qty} setValue={setQty} max={1}/>
        </div>

        {/* price mode */}
        <div>
          <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 8 }}>Зарах үнэ тогтоох</div>
          <div style={{ display:'flex', gap: 8, marginBottom: 10 }}>
            {['Хувь (%)','Үнэ (₮)'].map((l,i)=>(
              <div key={i} onClick={()=>setMode(i)} style={{
                flex: 1, height: 40, borderRadius: 10, cursor:'pointer',
                background: mode===i ? C.indigoSoft : '#FAFBFE', border:`1.5px solid ${mode===i ? C.indigo : C.line}`,
                display:'flex', alignItems:'center', justifyContent:'center', gap: 8,
                fontSize: 12.5, fontWeight: 700, color: mode===i ? C.indigo : C.muted,
              }}>
                <div style={{ width: 14, height: 14, borderRadius: 999, border:`2px solid ${mode===i ? C.indigo : C.line}`, position:'relative' }}>
                  {mode===i && <div style={{ position:'absolute', inset: 2, borderRadius: 999, background: C.indigo }}/>}
                </div>{l}
              </div>
            ))}
          </div>
          <div style={{ height: 52, borderRadius: 14, background:'#FAFBFE', border:`1.5px solid ${C.line}`, padding: '0 16px', display:'flex', alignItems:'center', justifyContent:'space-between', color: C.ink, fontSize: 18, fontWeight: 800, fontVariantNumeric:'tabular-nums' }}>
            <span>{mode === 0 ? '100.00' : '100,000'}</span>
            <span style={{ color: C.muted, fontSize: 14, fontWeight: 600 }}>{mode === 0 ? '%' : '₮'}</span>
          </div>
        </div>

        {/* condition */}
        <div>
          <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 8 }}>Нөхцөл</div>
          <div style={{ display:'flex', flexDirection:'column', gap: 8 }}>
            {conditions.map((c,i)=>(
              <div key={i} onClick={()=>setCond(i)} style={{
                minHeight: 48, borderRadius: 12, cursor:'pointer', padding: '0 14px',
                background: cond===i ? C.indigoSoft : '#fff', border:`1.5px solid ${cond===i ? C.indigo : C.line}`,
                display:'flex', alignItems:'center', gap: 12,
              }}>
                <div style={{ width: 18, height: 18, borderRadius: 999, border:`2px solid ${cond===i ? C.indigo : C.line}`, position:'relative', flexShrink: 0 }}>
                  {cond===i && <div style={{ position:'absolute', inset: 3, borderRadius: 999, background: C.indigo }}/>}
                </div>
                <span style={{ fontSize: 13, fontWeight: cond===i ? 700 : 600, color: cond===i ? C.ink : C.text }}>{c}</span>
              </div>
            ))}
          </div>
          {cond === 1 && (
            <div style={{ marginTop: 10 }}>
              <div style={{ height: 52, borderRadius: 14, background:'#fff', border:`1.5px solid ${C.indigo}`, boxShadow:`0 0 0 4px ${C.indigoSoft}`, padding: '0 14px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.ink, fontVariantNumeric:'tabular-nums' }}>2026-12-01</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="3" stroke={C.indigo} strokeWidth="2"/><path d="M3 9h18M8 3v4M16 3v4" stroke={C.indigo} strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
            </div>
          )}
        </div>

        {/* helper */}
        <div style={{ background: C.amberSoft, borderRadius: 14, padding: 14, display:'flex', gap: 10 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{flexShrink:0, marginTop:1}}><circle cx="12" cy="12" r="9" stroke={C.amber} strokeWidth="2"/><path d="M12 11v5M12 8h.01" stroke={C.amber} strokeWidth="2.2" strokeLinecap="round"/></svg>
          <div style={{ fontSize: 12, color:'#7A5A1F', lineHeight: 1.5 }}>Таны зарах захиалга хоёрдогч зах зээл дээр байрших бөгөөд худалдан авагч биелүүлсний дараа төлбөр тооцоо хийгдэнэ.</div>
        </div>
        <div style={{ height: 4 }}/>
      </div>
      <StickyBar><BigBtn>Үргэлжлүүлэх</BigBtn></StickyBar>
    </Frame>
  );
};

// ---------- 3.3 — Sell review + OTP ----------
const SellReview = () => (
  <Frame label="L3.3 — Sell review + OTP">
    <FlowHeader title="CAPIT 1450 CD" subtitle="Хоёрдогч зах зээлд зарах · баталгаажуулалт"/>
    <ReviewScaffold
      consentLabel="Би зарах захиалгын нөхцөлтэй танилцаж зөвшөөрч байна."
      ctaLabel="Зарах захиалга үүсгэх"
      ctaTone={C.indigo}
    >
      <SectionCard eyebrow="Бүтээгдэхүүний мэдээлэл" rows={[
        { l:'Бүтээгдэхүүн', v:'CAPIT 1450 CD' },
        { l:'Эзэмшиж буй ширхэг', v:'1 ширхэг' },
        { l:'Зарах ширхэг', v:'1 ширхэг' },
        { l:'Нэрлэсэн үнэ', v:'100,000 MNT' },
        { l:'Нэрлэсэн хүү /жилийн/', v:'14.50%' },
        { l:'Төлөгдөх огноо', v:'2027-02-24' },
        { l:'Үлдсэн хугацаа', v:'278 хоног' },
      ]}/>
      <SectionCard eyebrow="Зарах захиалгын мэдээлэл" rows={[
        { l:'Зарах үнэ', v:'100,000.00 ₮', big: true },
        { l:'Хувь / үнэ', v:'100.00%' },
        { l:'Захиалгын нөхцөл', v:'Нөхцөл биелтэл хүчинтэй' },
        { l:'Хүчинтэй хугацаа', v:'Цуцлах хүртэл' },
        { l:'Шимтгэл', v:'− 250.00 ₮', tone: C.red },
        { l:'Таны авах дүн', v:'99,750.00 ₮', big: true, tone: C.green },
      ]}/>
      <div style={{ background: C.amberSoft, borderRadius: 14, padding: 14, display:'flex', gap: 10 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{flexShrink:0, marginTop:1}}><circle cx="12" cy="12" r="9" stroke={C.amber} strokeWidth="2"/><path d="M12 11v5M12 8h.01" stroke={C.amber} strokeWidth="2.2" strokeLinecap="round"/></svg>
        <div style={{ fontSize: 12, color:'#7A5A1F', lineHeight: 1.5 }}>Энэ нь зарах захиалга үүсгэх үйлдэл. Худалдан авагч биелүүлсний дараа төлбөр тооцоо хийгдэнэ.</div>
      </div>
    </ReviewScaffold>
  </Frame>
);

// ---------- 3.4 — Sell listing success ----------
const SellSuccess = () => (
  <SuccessScreen
    label="L3.4 — Sell listing success"
    tone={C.indigo}
    title="Зарах захиалга амжилттай үүслээ"
    subtitle="Таны бүтээгдэхүүн хоёрдогч зах зээл дээр байрших болно."
    rows={[
      { l:'Бүтээгдэхүүн', v:'CAPIT 1450 CD' },
      { l:'Зарах ширхэг', v:'1 ширхэг' },
      { l:'Зарах үнэ', v:'100,000.00 ₮', big: true },
      { l:'Захиалгын нөхцөл', v:'Нөхцөл биелтэл хүчинтэй' },
      { l:'Төлөв', v:'Идэвхтэй', tone: C.green },
    ]}
    primaryCta="Захиалгаа харах"
    secondaryCta="Миний багц руу буцах"
  />
);
