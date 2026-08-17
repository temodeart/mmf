// ============================================================
// FLOW 3 — SELLING an owned product to the SECONDARY market
// Screens 3.1 owned detail · 3.2 sell setup · 3.3 review+PIN · 3.4 listing success
// IMPORTANT: this creates a sell LISTING — not an instant cash sale.
// ============================================================

// ---------- 3.1 — Owned product detail (dedicated per-holding page) ----------
const ownedStatusCfg = {
  default: { dot: C.green,  text:'Хэвийн' },
  onsale:  { dot: C.amber,  text:'Зарагдаж байгаа' },
  soon:    { dot: C.orange, text:'Хугацаа дуусах дөхсөн' },
};
const ownedData = {
  default: { days: 278, accrued: 3734,  current: 103734 },
  onsale:  { days: 278, accrued: 3734,  current: 103734 },
  soon:    { days: 5,   accrued: 12650, current: 112650 },
};
// Manage the auto-renew loop set at purchase time (primary_flow.jsx · PF_LOOP).
// Lives on the holding itself, so there is no separate screen to hunt for.
const OwnedLoopCard = () => {
  const loop = usePfLoop();
  const [confirm, setConfirm] = useState(false);
  const on = loop.on;
  return (
    <div style={{ marginTop: 14, background:'#fff', borderRadius: 18, border:`${on ? 2 : 1}px solid ${on ? C.indigo : C.line2}`, padding: 16 }}>
      <div style={{ display:'flex', alignItems:'flex-start', gap: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: on ? C.indigoSoft : '#F4F6FA', display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>
          <PfLoopIcon c={on ? C.indigo : C.muted}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display:'flex', alignItems:'center', gap: 8, flexWrap:'wrap' }}>
            <span style={{ fontSize: 13.5, fontWeight: 800, color: C.ink, letterSpacing:'-0.01em' }}>Дахин автоматаар авах</span>
            <span style={{ fontSize: 10, fontWeight: 800, color: on ? C.indigo : C.muted, background: on ? C.indigoSoft : '#F1F2F7', padding:'3px 8px', borderRadius: 999 }}>{on ? 'Асаалттай' : 'Асаалтгүй'}</span>
          </div>
          <div style={{ fontSize: 11.5, color: C.muted, marginTop: 4, lineHeight: 1.55 }}>
            {on
              ? '2027-02-24-нд үндсэн 100,000 ₮ ижил бүтээгдэхүүнд дахин орж, 13,050 ₮ хүү хэтэвчид орно.'
              : 'Хугацааны эцэст төлөгдөх нийт дүн хэтэвчид орно.'}
          </div>
        </div>
      </div>
      {confirm ? (
        <div style={{ marginTop: 12, padding: 14, borderRadius: 12, background:'#FAFBFE', border:`1px solid ${C.line2}` }}>
          <div style={{ fontSize: 12.5, fontWeight: 800, color: C.ink }}>Давталтыг зогсоох уу?</div>
          <div style={{ fontSize: 11.5, color: C.muted, marginTop: 4, lineHeight: 1.5 }}>Хугацаа дуусахад дахин худалдан авалт хийгдэхгүй — үндсэн дүн, хүү хоёулаа хэтэвчид орно. Одоо эзэмшиж буй бүтээгдэхүүнд өөрчлөлт орохгүй.</div>
          <div style={{ display:'flex', gap: 8, marginTop: 12 }}>
            <button data-nodrag onClick={()=>setConfirm(false)} style={{ flex: 1, height: 40, borderRadius: 12, background:'#fff', border:`1.5px solid ${C.line}`, fontWeight: 700, fontSize: 12.5, color: C.ink, cursor:'pointer' }}>Болих</button>
            <button data-nodrag onClick={()=>{ loop.set(false); setConfirm(false); }} style={{ flex: 1, height: 40, borderRadius: 12, background: C.ink, border:'none', fontWeight: 700, fontSize: 12.5, color:'#fff', cursor:'pointer' }}>Зогсоох</button>
          </div>
        </div>
      ) : (
        <button data-nodrag onClick={()=> on ? setConfirm(true) : loop.set(true)} style={{ width:'100%', height: 42, marginTop: 12, borderRadius: 12, background: on ? 'transparent' : C.indigo, border: on ? `1.5px solid ${C.line}` : 'none', fontWeight: 700, fontSize: 12.5, color: on ? C.ink : '#fff', cursor:'pointer' }}>
          {on ? 'Давталтыг зогсоох' : 'Давталтыг асаах'}
        </button>
      )}
    </div>
  );
};

const OwnedDetail = ({ state='default' }) => {
  const st = ownedStatusCfg[state] || ownedStatusCfg.default;
  const d = ownedData[state] || ownedData.default;
  const fmtO = (n) => n.toLocaleString('en-US');
  return (
    <Frame label={'L3.1 — Owned detail · ' + state}>
      <FlowHeader title="CAPIT 1450 CD" subtitle="Миний багц · эзэмшиж буй бүтээгдэхүүн"/>
      <div style={{ flex: 1, overflow:'auto', padding: '0 24px 16px' }}>
        {/* navy gradient hero */}
        <div style={{ borderRadius: 22, padding: 20, background:`linear-gradient(135deg, ${C.navy} 0%, ${C.navy3} 100%)`, color:'#fff', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', right:-40, top:-40, width: 160, height: 160, borderRadius:'50%', background:'radial-gradient(circle, rgba(45,107,255,.4), transparent 70%)'}}/>
          <div style={{ position:'relative' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap: 10 }}>
              <div style={{ display:'flex', alignItems:'center', gap: 12, minWidth: 0 }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: C.blue, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight: 800, fontSize: 18, flexShrink: 0 }}>К</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>Капитрон Банк ХХК</div>
                  <div style={{ fontSize: 11, opacity:.65, marginTop: 2, fontWeight: 600 }}>Сертификат · CAPIT 1450 CD</div>
                </div>
              </div>
              <span style={{ display:'inline-flex', alignItems:'center', gap: 5, padding:'5px 10px', borderRadius: 999, background:'rgba(255,255,255,.14)', border:'1px solid rgba(255,255,255,.2)', fontSize: 10.5, fontWeight: 700, flexShrink: 0, whiteSpace:'nowrap' }}>
                <span style={{ width: 7, height: 7, borderRadius: 999, background: st.dot }}/>{st.text}
              </span>
            </div>
            <div style={{ fontSize: 11, opacity:.7, marginTop: 18, fontWeight: 600 }}>Одоогийн үнэ цэнэ</div>
            <div style={{ fontSize: 32, fontWeight: 800, letterSpacing:'-0.02em', marginTop: 2, fontVariantNumeric:'tabular-nums' }}>₮ {fmtO(d.current)}</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10, marginTop: 16 }}>
              <div style={{ background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.12)', borderRadius: 12, padding: 12 }}>
                <div style={{ fontSize: 10, opacity:.6, fontWeight: 600 }}>Хуримтлагдсан үр шим</div>
                <div style={{ fontSize: 16, fontWeight: 800, marginTop: 4, color:'#7FF3C2', fontVariantNumeric:'tabular-nums' }}>+ ₮ {fmtO(d.accrued)}</div>
              </div>
              <div style={{ background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.12)', borderRadius: 12, padding: 12 }}>
                <div style={{ fontSize: 10, opacity:.6, fontWeight: 600 }}>Эзэмшиж буй</div>
                <div style={{ fontSize: 16, fontWeight: 800, marginTop: 4, fontVariantNumeric:'tabular-nums' }}>1 ширхэг</div>
              </div>
            </div>
          </div>
        </div>

        {/* status-specific note */}
        {state === 'onsale' && (
          <div style={{ marginTop: 14, background: C.amberSoft, border:`1px solid #FFE9C4`, borderRadius: 16, padding: 14, display:'flex', gap: 12, alignItems:'flex-start' }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3.5 7.5h17l-1.4 12.2a1 1 0 01-1 .8H5.9a1 1 0 01-1-.8L3.5 7.5z" stroke={C.amber} strokeWidth="2" strokeLinejoin="round"/><path d="M8.5 7.5V6a3.5 3.5 0 017 0v1.5" stroke={C.amber} strokeWidth="2"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color:'#5E4413' }}>Хоёрдогч зах зээлд зарагдаж байна</div>
              <div style={{ fontSize: 11.5, color:'#7A5A1F', marginTop: 3, lineHeight: 1.5 }}>Зарах үнэ <strong>100,000 ₮</strong> · Зарласан 2026-05-18</div>
            </div>
          </div>
        )}
        {state === 'soon' && (
          <div style={{ marginTop: 14, background: C.greenSoft, border:`1px solid ${C.green}22`, borderRadius: 16, padding: 14, display:'flex', gap: 12, alignItems:'center' }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 7v5l3 2" stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="9" stroke={C.green} strokeWidth="2"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: C.ink }}>Удахгүй төлөгдөнө · {d.days} хоног</div>
              <div style={{ fontSize: 11.5, color: C.muted, marginTop: 3, lineHeight: 1.5 }}>Хугацааны эцэст <strong style={{ color: C.ink }}>113,050 ₮</strong> хэтэвчинд шилжинэ.</div>
            </div>
          </div>
        )}

        {/* auto-renew loop — the ONLY place the buy-time toggle can be undone */}
        <OwnedLoopCard/>

        {/* key facts */}
        <div style={{ marginTop: 14 }}>
          <SectionCard eyebrow="Бүтээгдэхүүний мэдээлэл" rows={[
            { l:'Нэрлэсэн үнэ', v:'100,000 MNT' },
            { l:'Нэрлэсэн үр шим /жилийн/', v:'14.50%' },
            { l:'Гаргасан огноо', v:'2026-05-22' },
            { l:'Төлөгдөх огноо', v:'2027-02-24' },
            { l:'Үлдсэн хугацаа', v: d.days + ' хоног', tone: state === 'soon' ? C.orange : undefined },
            { l:'Тоо ширхэг', v:'1 ширхэг' },
            { l:'Хугацааны эцэст авах дүн', v:'113,050 MNT', tone: C.green },
          ]}/>
        </div>

        {/* required disclaimer */}
        <div style={{ marginTop: 14, background: C.amberSoft, border:`1px solid #FFE9C4`, borderRadius: 14, padding: 14, display:'flex', gap: 10 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop: 1 }}><path d="M12 8v5M12 16h.01" stroke={C.amber} strokeWidth="2.2" strokeLinecap="round"/><circle cx="12" cy="12" r="9" stroke={C.amber} strokeWidth="2"/></svg>
          <div style={{ fontSize: 11.5, color:'#7A5A1F', lineHeight: 1.55 }}>
            Үнэт цаасны зах зээл дэх хөрөнгө оруулалт эрсдэлтэй. Өнгөрсөн үеийн өгөөж ирээдүйн үр дүнг баталгаажуулахгүй. Энэ бүтээгдэхүүн нь банкны хадгаламжийн даатгалд хамаарахгүй.
          </div>
        </div>

        <div style={{ height: 8 }}/>
      </div>
      <StickyBar>
        <div style={{ display:'flex', flexDirection:'column', gap: 10 }}>
          {state === 'onsale'
            ? <BigBtn tone={C.red}>Зарах захиалга цуцлах</BigBtn>
            : <BigBtn>Хоёрдогч зах зээлд зарах</BigBtn>}
          <BigBtn ghost>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" stroke={C.ink} strokeWidth="1.8" strokeLinejoin="round"/><path d="M14 3v5h5M9 13h6M9 17h4" stroke={C.ink} strokeWidth="1.8" strokeLinecap="round"/></svg>
            Гэрээ харах
          </BigBtn>
        </div>
      </StickyBar>
    </Frame>
  );
};

// ---------- 3.5 — Contract viewer (PDF-style document) ----------
const ContractViewer = () => {
  const Bar = ({ w='100%' }) => <div style={{ height: 8, borderRadius: 4, background:'#EAECF2', width: w }}/>;
  const IconBtn = ({ children }) => (
    <button style={{ width: 40, height: 40, borderRadius: 12, background:'#fff', border:`1px solid ${C.line}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>{children}</button>
  );
  return (
    <Frame label="L3.5 — Contract viewer" bg="#E9EBF1">
      <div style={{ height: 56, flexShrink: 0, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 12px', background:'#fff', borderBottom:`1px solid ${C.line2}` }}>
        <IconBtn><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke={C.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></IconBtn>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>Гэрээ</div>
        <div style={{ display:'flex', gap: 8 }}>
          <IconBtn><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 4v10M8 11l4 4 4-4M5 19h14" stroke={C.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></IconBtn>
          <IconBtn><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="6" cy="12" r="2.4" stroke={C.ink} strokeWidth="2"/><circle cx="18" cy="6" r="2.4" stroke={C.ink} strokeWidth="2"/><circle cx="18" cy="18" r="2.4" stroke={C.ink} strokeWidth="2"/><path d="M8.2 10.9l7.6-3.8M8.2 13.1l7.6 3.8" stroke={C.ink} strokeWidth="2"/></svg></IconBtn>
        </div>
      </div>

      <div style={{ flex: 1, overflow:'auto', padding: 18, background:'#E9EBF1' }}>
        <div style={{ background:'#fff', borderRadius: 6, boxShadow:'0 10px 30px -12px rgba(15,20,55,.3)', padding: '26px 24px', border:`1px solid ${C.line2}` }}>
          {/* letterhead */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:`2px solid ${C.ink}`, paddingBottom: 14 }}>
            <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
              <LogoMark size={26}/>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: C.ink }}>Мони Маркет Фанд ХХК</div>
                <div style={{ fontSize: 8.5, color: C.muted, fontWeight: 600, letterSpacing:'0.04em' }}>MONEY MARKET FUND LLC</div>
              </div>
            </div>
            <div style={{ fontSize: 8.5, color: C.muted, fontWeight: 700, textAlign:'right', fontFamily:'monospace', lineHeight: 1.4 }}>СЗХ ЗОХИЦУУЛАЛТ<br/>2024-А/118</div>
          </div>

          <div style={{ fontSize: 14, fontWeight: 800, color: C.ink, textAlign:'center', marginTop: 18, lineHeight: 1.4, letterSpacing:'0.01em' }}>ҮНЭТ ЦААС ХУДАЛДАХ,<br/>ХУДАЛДАН АВАХ ГЭРЭЭ</div>

          <div style={{ display:'flex', justifyContent:'space-between', marginTop: 16, fontSize: 10.5 }}>
            <div><span style={{ color: C.muted, fontWeight: 600 }}>Дугаар:</span> <span style={{ fontWeight: 800, color: C.ink, fontFamily:'monospace' }}>CT-2026-04823</span></div>
            <div><span style={{ color: C.muted, fontWeight: 600 }}>Огноо:</span> <span style={{ fontWeight: 800, color: C.ink, fontVariantNumeric:'tabular-nums' }}>2026-05-22</span></div>
          </div>

          <div style={{ marginTop: 16, display:'flex', flexDirection:'column', gap: 9 }}>
            {[
              { r:'Худалдагч /Гаргагч/', n:'Капитрон Банк ХХК', reg:'РД: 2611290' },
              { r:'Худалдан авагч', n:'Батболд Тэмүүжин', reg:'РД: УБ91051512' },
              { r:'Зохицуулагч', n:'Мони Маркет Фанд ХХК', reg:'РД: 6700123' },
            ].map((p, i) => (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', borderBottom:`1px dashed ${C.line2}`, paddingBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 9, color: C.muted, fontWeight: 700, textTransform:'uppercase', letterSpacing:'0.04em' }}>{p.r}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginTop: 2 }}>{p.n}</div>
                </div>
                <div style={{ fontSize: 9.5, color: C.muted, fontWeight: 600, fontFamily:'monospace' }}>{p.reg}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, display:'flex', flexDirection:'column', gap: 16 }}>
            {['Нэг. Гэрээний зүйл','Хоёр. Талуудын эрх, үүрэг','Гурав. Төлбөр тооцоо'].map((h, i) => (
              <div key={i}>
                <div style={{ fontSize: 11.5, fontWeight: 800, color: C.ink }}>{h}</div>
                <div style={{ marginTop: 8, display:'flex', flexDirection:'column', gap: 6 }}>
                  <Bar/><Bar/><Bar w="78%"/>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, fontFamily:'monospace', fontSize: 9.5, color: C.muted2, textAlign:'center' }}>// гэрээний бүрэн эх — жишээ баримт</div>

          <div style={{ marginTop: 22, display:'flex', justifyContent:'space-between', gap: 16 }}>
            {['Худалдагч','Худалдан авагч'].map((s, i) => (
              <div key={i} style={{ flex: 1 }}>
                <div style={{ height: 34 }}/>
                <div style={{ borderTop:`1px solid ${C.muted2}`, paddingTop: 6, fontSize: 9.5, color: C.muted, fontWeight: 600, textAlign:'center' }}>{s}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: 16 }}/>
      </div>
    </Frame>
  );
};

// ---------- 3.2 — Sell setup (create listing) ----------
const SellSetup = () => {
  const [qty, setQty] = useState(1);
  const [mode, setMode] = useState(0); // 0 percent, 1 price
  const [cond, setCond] = useState(2); // condition index
  const [selOpen, setSelOpen] = useState(false);
  const [sel, setSel] = useState(0);
  const holdings = [
    { ab:'К', c: C.blue,    t:'CAPIT 1450 CD 011226', sub:'Үлдэгдэл [1]' },
    { ab:'Г', c:'#F59E0B',  t:'GOLDH 2300 IT 140427', sub:'Үлдэгдэл [180]' },
    { ab:'М', c: C.indigo,  t:'MSTRT 2400 IT 171126', sub:'Үлдэгдэл [227]' },
  ];
  const cur = holdings[sel];
  const conditions = ['Тухайн өдөр дуусах хүртэл','Заасан өдөр дуусах хүртэл','Нөхцөл биелтэл хүчинтэй'];
  return (
    <Frame label="L3.2 — Sell setup">
      <FlowHeader title="CAPIT 1450 CD" subtitle="Хоёрдогч зах зээлд зарах"/>
      <div style={{ flex: 1, overflow:'auto', padding: '0 24px 16px', display:'flex', flexDirection:'column', gap: 14 }}>
        {/* product selector */}
        <div data-nodrag>
          <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 8 }}>Бүтээгдэхүүн</div>
          <div onClick={() => setSelOpen(o => !o)} style={{ height: 54, borderRadius: 14, background:'#fff', border:`1.5px solid ${selOpen ? C.indigo : C.line}`, boxShadow: selOpen ? `0 0 0 4px ${C.indigoSoft}` : 'none', padding: '0 14px', display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer', transition:'border-color .15s' }}>
            <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: cur.c, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight: 800, fontSize: 12 }}>{cur.ab}</div>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: C.ink, fontVariantNumeric:'tabular-nums' }}>{cur.t} · {cur.sub}</span>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ transform: selOpen ? 'rotate(180deg)' : 'none', transition:'transform .2s' }}><path d="M6 9l6 6 6-6" stroke={C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          {selOpen && (
            <div style={{ marginTop: 8, background:'#fff', borderRadius: 14, border:`1px solid ${C.line2}`, overflow:'hidden', boxShadow:'0 16px 36px -18px rgba(15,20,55,.4)' }}>
              {holdings.map((h, i) => (
                <div key={i} onClick={() => { setSel(i); setQty(1); setSelOpen(false); }} style={{
                  display:'flex', alignItems:'center', gap: 10, padding:'12px 14px', cursor:'pointer',
                  borderTop: i ? `1px solid ${C.line2}` : 'none', background: sel===i ? C.indigoSoft : '#fff',
                }}>
                  <div style={{ width: 30, height: 30, borderRadius: 9, background: h.c, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight: 800, fontSize: 12, flexShrink: 0 }}>{h.ab}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, fontVariantNumeric:'tabular-nums' }}>{h.t}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{h.sub}</div>
                  </div>
                  {sel===i && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0 }}><path d="M5 12l4 4 10-10" stroke={C.indigo} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
              ))}
            </div>
          )}
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

// ---------- 3.3 — Sell review + PIN ----------
const SellReview = () => (
  <Frame label="L3.3 — Sell review + PIN">
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

// ---------- 3.3b — Sell · PIN confirm (own step) ----------
const SellPin = () => (
  <PinConfirm
    label="L3.3b — Sell · PIN"
    subtitle="Хоёрдогч зах зээлд зарах захиалгыг баталгаажуулна уу."
    amount="99,750.00 ₮"
    amountLabel="Таны авах дүн"
    ctaLabel="Зарах захиалга үүсгэх"
  />
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
