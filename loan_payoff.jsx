// ============================================================
// Money Market Fund — Loan payoff flow
// Wires the "Зээл хаах" / "Хувааж төлөх" CTAs on the active-loan screen.
// Reuses shared scaffolds (FlowHeader, ReviewScaffold, SectionCard,
// PinConfirm, SuccessScreen) from flow_kit.jsx + screens.jsx.
// Loan is partly paid: principal 3,000,000, paid 1,200,000,
// remaining 1,800,000 + 15,000 accrued = 1,815,000 payoff.
// Settled ONLY from the wallet balance. Balance (1,250,000) is short
// by 565,000 → CTA tops up the wallet, loan auto-closes after.
// ============================================================

const PO_PAYOFF = 1815000;
const PO_WALLET = 1250000;
const PO_SHORT  = PO_PAYOFF - PO_WALLET;          // 565,000
const PO_INSUF  = PO_SHORT > 0;
const pf = (n) => n.toLocaleString('en-US');

// ---------- Review: payoff breakdown + wallet funding + top-up gate ----------
const PayoffReview = () => (
  <Frame label="LN — Зээл хаах · баталгаажуулах">
    <FlowHeader title="Зээл хаах" subtitle="Идэвхтэй зээл · LN-2026-04823"/>
    <ReviewScaffold
      consentLabel="Хэтэвч цэнэглэгдмэгц зээл автоматаар бүрэн хаагдахыг зөвшөөрч байна."
      ctaLabel={PO_INSUF ? 'Цэнэглээд төлөх' : 'Хэтэвчээр төлөх'}
      ctaTone={C.indigo}
    >
      <SectionCard eyebrow="Төлбөрийн задаргаа" rows={[
        { l:'Үлдэгдэл үндсэн', v:'1,800,000 ₮' },
        { l:'Хуримтлагдсан хүү', v:'15,000 ₮' },
        { l:'Төлж хаах дүн', v: pf(PO_PAYOFF) + ' ₮', big: true, tone: C.indigo },
      ]}/>

      {/* Wallet — the only funding source */}
      <div style={{ background:'#fff', borderRadius: 18, border:`1px solid ${C.line2}`, padding: 16 }}>
        <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, letterSpacing:'0.06em', textTransform:'uppercase', marginBottom: 12 }}>Төлбөрийн эх үүсвэр</div>
        <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: C.indigoSoft, display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="13" rx="3" stroke={C.indigo} strokeWidth="2"/><path d="M3 10h18" stroke={C.indigo} strokeWidth="2"/><circle cx="16.5" cy="14.5" r="1.3" fill={C.indigo}/></svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: C.ink, letterSpacing:'-0.01em' }}>Хэтэвчний үлдэгдэл</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Боломжит үлдэгдэл</div>
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, fontVariantNumeric:'tabular-nums', letterSpacing:'-0.01em', color: PO_INSUF ? C.red : C.ink }}>₮ {pf(PO_WALLET)}</div>
        </div>

        {PO_INSUF && (
          <>
            <div style={{ marginTop: 14, height: 6, borderRadius: 999, background: C.line2, overflow:'hidden' }}>
              <div style={{ width: Math.round((PO_WALLET / PO_PAYOFF) * 100) + '%', height:'100%', borderRadius: 999, background: C.indigo }}/>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: 9 }}>
              <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Төлбөрт шаардлагатай</span>
              <span style={{ fontSize: 12.5, color: C.ink, fontWeight: 700, fontVariantNumeric:'tabular-nums' }}>₮ {pf(PO_PAYOFF)}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: 9, paddingTop: 10, borderTop:`1px dashed ${C.line}` }}>
              <span style={{ fontSize: 12.5, color: C.red, fontWeight: 700 }}>Дутагдаж буй дүн</span>
              <span style={{ fontSize: 14, color: C.red, fontWeight: 800, fontVariantNumeric:'tabular-nums', letterSpacing:'-0.01em' }}>₮ {pf(PO_SHORT)}</span>
            </div>
          </>
        )}
      </div>

      {PO_INSUF && (
        <div style={{ background: C.amberSoft, borderRadius: 14, padding: 14, display:'flex', gap: 10 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:1 }}><circle cx="12" cy="12" r="9" stroke={C.amber} strokeWidth="2" fill="none"/><path d="M12 8v.5M12 11v5" stroke={C.amber} strokeWidth="2" strokeLinecap="round"/></svg>
          <div style={{ fontSize: 12, color: C.ink, lineHeight: 1.5 }}>
            Хэтэвчний үлдэгдэл хүрэлцэхгүй байна. Дутах <strong>₮ {pf(PO_SHORT)}</strong>-г цэнэглэснээр зээл автоматаар бүрэн хаагдана.
          </div>
        </div>
      )}
    </ReviewScaffold>
  </Frame>
);

// ---------- PIN confirm (sufficient-balance path) ----------
const PayoffPin = () => (
  <PinConfirm
    label="LN — Зээл хаах · ПИН"
    subtitle="Зээл хаах гүйлгээг ПИН кодоор баталгаажуулна уу."
    amount={pf(PO_PAYOFF) + '.00 ₮'}
    amountLabel="Төлж хаах дүн"
    ctaLabel="Зээл хаах"
  />
);

// ---------- Success: loan closed ----------
const PayoffSuccess = () => (
  <SuccessScreen
    label="LN — Зээл хаах · амжилттай"
    tone={C.green}
    title="Зээл амжилттай хаагдлаа"
    subtitle="Хэтэвч цэнэглэгдэж, үлдэгдэл төлбөр автоматаар суутгагдан зээл бүрэн хаагдлаа."
    rows={[
      { l:'Зээл', v:'LN-2026-04823' },
      { l:'Хэтэвч цэнэглэлт', v: pf(PO_SHORT) + ' ₮' },
      { l:'Зээлд төлсөн', v: pf(PO_PAYOFF) + ' ₮', big: true },
      { l:'Төлөв', v:'Хаагдсан', tone: C.green },
    ]}
    primaryCta="Нүүр хуудас руу"
    secondaryCta="Зээлийн дэлгэрэнгүй"
  />
);

Object.assign(window, { PayoffReview, PayoffPin, PayoffSuccess });

// ============================================================
// Partial payment ("Хувааж төлөх") — pay any amount toward the loan.
// Settled from the wallet. Entering the full remaining closes the loan
// (the amount screen shows a dynamic "you are about to close" notice).
// ============================================================
const PP_PAYOFF = PO_PAYOFF;     // 1,815,000 remaining to fully close
let   PP_AMOUNT = 800000;        // last-entered amount, shared downstream

const PartialPayAmount = () => {
  const [amount, setAmount] = useState(PP_AMOUNT);
  const [focused, setFocused] = useState(false);
  PP_AMOUNT = amount;
  const isFull = amount >= PP_PAYOFF;
  const over   = amount > PO_WALLET;
  const after  = Math.max(PP_PAYOFF - amount, 0);
  const short  = Math.max(amount - PO_WALLET, 0);
  const cta = over ? 'Цэнэглээд төлөх' : (isFull ? 'Зээл хаах' : 'Төлөх');
  return (
    <Frame label="LN — Хувааж төлөх · дүн">
      <BackBar title="Хувааж төлөх"/>
      <div style={{ flex:1, overflow:'auto', padding:'6px 24px 20px' }}>
        {/* loan summary */}
        <div style={{ background:`linear-gradient(135deg, ${C.navy} 0%, ${C.navy3} 100%)`, color:'#fff', borderRadius:18, padding:16 }}>
          <div style={{ fontSize:11, opacity:.7, fontWeight:600 }}>Идэвхтэй зээл · LN-2026-04823</div>
          <div style={{ fontSize:12, opacity:.7, marginTop:10 }}>Зээл хаах дүн</div>
          <div style={{ fontSize:26, fontWeight:800, marginTop:2, letterSpacing:'-0.02em', fontVariantNumeric:'tabular-nums' }}>₮ {pf(PP_PAYOFF)}</div>
        </div>

        {/* amount input — free entry, no quick chips */}
        <div style={{ marginTop:16 }}>
          <div style={{ fontSize:12, color:C.muted, fontWeight:600, marginBottom:8 }}>Төлөх дүн</div>
          <div style={{ background:'#fff', borderRadius:16, border:`1.5px solid ${focused ? C.indigo : C.line2}`, boxShadow: focused ? `0 0 0 4px ${C.indigoSoft}` : 'none', padding:'16px 18px', transition:'border-color .15s, box-shadow .15s', display:'flex', alignItems:'baseline', gap:6 }}>
            <span style={{ fontSize:28, fontWeight:800, color:C.indigo, letterSpacing:'-0.02em' }}>₮</span>
            <input type="text" inputMode="numeric" data-nodrag
              value={amount===0 ? '' : pf(amount)}
              onChange={(e)=>{ const d=e.target.value.replace(/[^0-9]/g,''); const v=d===''?0:parseInt(d,10); setAmount(Math.min(v, PP_PAYOFF)); }}
              onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} placeholder="0"
              style={{ flex:1, minWidth:0, border:'none', outline:'none', background:'transparent', fontSize:30, fontWeight:800, color:C.ink, letterSpacing:'-0.02em', fontVariantNumeric:'tabular-nums', padding:0 }}/>
          </div>
          <div style={{ fontSize:11.5, color:C.muted, marginTop:8, fontVariantNumeric:'tabular-nums' }}>Дээд тал нь ₮ {pf(PP_PAYOFF)} · үлдэгдэл бүрэн</div>

          {/* wallet balance — subtle by default, prominent when the amount exceeds it */}
          {over ? (
            <div style={{ marginTop:12, background:C.redSoft, borderRadius:14, border:'1px solid #F7CFCF', padding:14 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="13" rx="3" stroke={C.red} strokeWidth="2"/><path d="M3 10h18" stroke={C.red} strokeWidth="2"/></svg>
                  <span style={{ fontSize:13, color:C.ink, fontWeight:700 }}>Хэтэвчний үлдэгдэл</span>
                </div>
                <span style={{ fontSize:14.5, color:C.red, fontWeight:800, fontVariantNumeric:'tabular-nums' }}>₮ {pf(PO_WALLET)}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:10, paddingTop:10, borderTop:'1px dashed #F0C2C2' }}>
                <span style={{ fontSize:12.5, color:C.red, fontWeight:700 }}>Дутагдаж буй дүн</span>
                <span style={{ fontSize:14, color:C.red, fontWeight:800, fontVariantNumeric:'tabular-nums' }}>₮ {pf(short)}</span>
              </div>
              <div style={{ fontSize:11.5, color:'#9B2C2C', marginTop:8, lineHeight:1.5 }}>Дутах дүнг цэнэглэснээр төлбөр хийгдэж, зээл төлөгдөнө.</div>
            </div>
          ) : (
            <div style={{ marginTop:10, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontSize:12, color:C.muted, fontWeight:600 }}>Хэтэвчний үлдэгдэл</span>
              <span style={{ fontSize:12.5, color:C.muted, fontWeight:700, fontVariantNumeric:'tabular-nums' }}>₮ {pf(PO_WALLET)}</span>
            </div>
          )}
        </div>

        {/* dynamic info: full amount → closing the loan; else → remaining after */}
        {amount > 0 && (isFull ? (
          <div style={{ marginTop:14, display:'flex', gap:10, alignItems:'flex-start', padding:14, borderRadius:14, background:C.indigoSoft, border:`1px solid ${C.indigo}33` }}>
            <div style={{ width:22, height:22, borderRadius:999, background:C.indigo, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{ fontSize:12, color:C.ink, lineHeight:1.5 }}>
              Та үлдэгдлийг бүрэн төлж, <strong>зээлээ хаах</strong> гэж байна. Төлөгдсөний дараа энэ зээл бүрэн хаагдана.
            </div>
          </div>
        ) : (
          <div style={{ marginTop:14, background:'#fff', borderRadius:16, border:`1px solid ${C.line2}`, overflow:'hidden' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'13px 16px' }}>
              <span style={{ fontSize:12.5, color:C.muted, fontWeight:600 }}>Төлөх дүн</span>
              <span style={{ fontSize:13.5, color:C.ink, fontWeight:700, fontVariantNumeric:'tabular-nums' }}>₮ {pf(amount)}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 16px', background:'#FAFBFE', borderTop:`1px solid ${C.line2}` }}>
              <span style={{ fontSize:13, color:C.ink, fontWeight:800 }}>Төлсний дараах зээлийн үлдэгдэл</span>
              <span style={{ fontSize:16, color:C.indigo, fontWeight:800, fontVariantNumeric:'tabular-nums', letterSpacing:'-0.01em' }}>₮ {pf(after)}</span>
            </div>
          </div>
        ))}
      </div>
      <StickyBar>
        <BigBtn tone={C.indigo} disabled={amount === 0}>{cta}</BigBtn>
      </StickyBar>
    </Frame>
  );
};

const PartialPayPin = () => (
  <PinConfirm
    label="LN — Хувааж төлөх · ПИН"
    subtitle="Төлбөрийн гүйлгээг ПИН кодоор баталгаажуулна уу."
    amount={pf(PP_AMOUNT) + '.00 ₮'}
    amountLabel="Төлөх дүн"
    ctaLabel={PP_AMOUNT >= PP_PAYOFF ? 'Зээл хаах' : 'Төлөх'}
  />
);

const PartialPaySuccess = () => {
  const full = PP_AMOUNT >= PP_PAYOFF;
  const after = Math.max(PP_PAYOFF - PP_AMOUNT, 0);
  return (
    <SuccessScreen
      label="LN — Хувааж төлөх · амжилттай"
      tone={C.green}
      title={full ? 'Зээл амжилттай хаагдлаа' : 'Төлбөр амжилттай хийгдлээ'}
      subtitle={full
        ? 'Үлдэгдэл бүрэн төлөгдөж, зээл хаагдлаа.'
        : 'Таны төлбөр зээлийн үлдэгдлээс хасагдаж, хүү буурлаа.'}
      rows={[
        { l:'Зээл', v:'LN-2026-04823' },
        { l:'Төлсөн дүн', v: pf(PP_AMOUNT) + ' ₮', big: true },
        full
          ? { l:'Төлөв', v:'Хаагдсан', tone: C.green }
          : { l:'Үлдсэн төлбөр', v: pf(after) + ' ₮', tone: C.indigo },
      ]}
      primaryCta="Зээлийн дэлгэрэнгүй"
      secondaryCta="Нүүр хуудас руу"
    />
  );
};

Object.assign(window, { PartialPayAmount, PartialPayPin, PartialPaySuccess });
