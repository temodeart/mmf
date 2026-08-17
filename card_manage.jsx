// ============================================================
// MY CARDS — profile card manager. Multiple cards, main card,
// per-product assignment (loan autopay / auto-invest / top-up),
// expiring & expired states, action / usage / delete sheets.
// Reuses CardVisualCL + BrandMarkCL from card_link.jsx.
// ============================================================

const { useState: useStateCM } = React;
const { C: CCM, Frame: FrameCM, BackBar: BackBarCM, CardVisualCL: CardFaceCM, BrandMarkCL: BrandMarkCM, CARD_GRADS_CL: GRADS_CM } = window;

const CM_HOLDER = 'BATBOLD TEMUUJIN';
const CM_USES = {
  loan:   { l:'Зээлийн автомат төлөлт', c: CCM.indigo, soft: CCM.indigoSoft, icon:(c)=><g stroke={c} strokeWidth="2" fill="none" strokeLinecap="round"><rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18"/></g> },
  invest: { l:'Автомат хөрөнгө оруулалт', c: CCM.green, soft: CCM.greenSoft, icon:(c)=><g stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M4 17l5-6 4 3 7-8M14 6h6v6"/></g> },
  topup:  { l:'Хэтэвч цэнэглэлт', c: CCM.blue, soft: CCM.blueSoft, icon:(c)=><g stroke={c} strokeWidth="2" fill="none" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></g> },
};
const CM_INIT = [
  { id:1, brand:'visa', last4:'4821', num:'4218402155674821', exp:'09/28', main:true,  status:'active',   uses:['loan','invest'] },
  { id:2, brand:'mc',   last4:'7710', num:'5417751208447710', exp:'08/26', main:false, status:'expiring', uses:['topup'] },
  { id:3, brand:'visa', last4:'1053', num:'4321880234511053', exp:'05/26', main:false, status:'expired',  uses:[] },
];

// ---- badges on the card face ----
const CmBadge = ({ tone, children }) => {
  const s = tone === 'main' ? { bg:'#fff', c: CCM.indigo } : tone === 'warn' ? { bg: CCM.amberSoft, c: CCM.amber } : { bg: CCM.redSoft, c: CCM.red };
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap: 5, padding:'4px 10px', borderRadius: 999, background: s.bg, color: s.c, fontSize: 10.5, fontWeight: 800, letterSpacing:'0.02em', boxShadow:'0 4px 12px -4px rgba(11,16,32,.35)' }}>
      {tone === 'main' && <svg width="11" height="11" viewBox="0 0 24 24" fill={CCM.indigo}><path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2z"/></svg>}
      {children}
    </span>
  );
};

// ---- one card block: face + glance chips + actions ----
const CmCardBlock = ({ card, onActions }) => {
  const expired = card.status === 'expired';
  const badges = (
    <div style={{ display:'flex', gap: 6, alignItems:'center' }}>
      {card.main && <CmBadge tone="main">Үндсэн</CmBadge>}
      {card.status === 'expiring' && <CmBadge tone="warn">Удахгүй дуусна</CmBadge>}
      {expired && <CmBadge tone="bad">Хугацаа дууссан</CmBadge>}
      <span style={{ marginLeft: 2 }}><BrandMarkCM brand={card.brand} h={card.brand === 'visa' ? 15 : 19}/></span>
    </div>
  );
  return (
    <div style={{ marginTop: 18 }}>
      <CardFaceCM brand={card.brand} num={card.num} name={CM_HOLDER} exp={card.exp} height={184} fontScale={0.92} badge={badges} dim={expired} grad={expired ? GRADS_CM.expired : undefined}/>
      <div style={{ display:'flex', alignItems:'center', gap: 8, marginTop: 10 }}>
        <div style={{ flex:1, minWidth:0, display:'flex', gap: 6, flexWrap:'wrap' }}>
          {expired ? (
            <span style={{ display:'inline-flex', alignItems:'center', gap: 6, padding:'5px 10px', borderRadius: 999, background: CCM.redSoft, color: CCM.red, fontSize: 11, fontWeight: 700 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={CCM.red} strokeWidth="2"/><path d="M12 7.5v5.5M12 16.5h.01" stroke={CCM.red} strokeWidth="2.2" strokeLinecap="round"/></svg>
              Автомат төлбөр идэвхгүй боллоо
            </span>
          ) : card.uses.length ? card.uses.map(u => (
            <span key={u} style={{ display:'inline-flex', alignItems:'center', gap: 6, padding:'5px 10px', borderRadius: 999, background: CM_USES[u].soft, color: CM_USES[u].c, fontSize: 11, fontWeight: 700 }}>
              <svg width="12" height="12" viewBox="0 0 24 24">{CM_USES[u].icon(CM_USES[u].c)}</svg>
              {CM_USES[u].l}
            </span>
          )) : (
            <span style={{ padding:'5px 10px', borderRadius: 999, background:'#EEF0F6', color: CCM.muted, fontSize: 11, fontWeight: 700 }}>Ашиглалт тохируулаагүй</span>
          )}
        </div>
        <button onClick={onActions} aria-label="Картын үйлдэл" style={{ width: 36, height: 36, borderRadius: 11, background:'#fff', border:`1px solid ${CCM.line}`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill={CCM.ink}><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
        </button>
      </div>
    </div>
  );
};

// ---- bottom sheet shell ----
const CmSheet = ({ onClose, children }) => (
  <div style={{ position:'absolute', inset:0, zIndex: 20 }}>
    <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(5,11,31,.45)' }}/>
    <div style={{ position:'absolute', left:0, right:0, bottom:0, background:'#fff', borderRadius:'26px 26px 0 0', padding:'10px 24px 26px', boxShadow:'0 -10px 40px -16px rgba(15,20,55,.4)' }}>
      <div style={{ width: 40, height: 5, borderRadius: 999, background: CCM.line, margin:'0 auto 14px' }}/>
      {children}
    </div>
  </div>
);
const CmMiniCard = ({ card }) => (
  <div style={{ display:'flex', alignItems:'center', gap: 12, padding:'12px 14px', borderRadius: 14, background:'#FAFBFE', border:`1px solid ${CCM.line2}` }}>
    <div style={{ width: 46, height: 32, borderRadius: 7, background: card.status === 'expired' ? GRADS_CM.expired : GRADS_CM[card.brand], display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
      <BrandMarkCM brand={card.brand} h={card.brand === 'visa' ? 8 : 13}/>
    </div>
    <div style={{ flex:1, minWidth:0 }}>
      <div style={{ fontSize: 13.5, fontWeight: 700, color: CCM.ink, fontVariantNumeric:'tabular-nums' }}>•••• {card.last4}</div>
      <div style={{ fontSize: 11.5, color: card.status === 'expired' ? CCM.red : CCM.muted, marginTop: 1, fontWeight: 600 }}>Хүчинтэй: {card.exp}{card.status === 'expired' ? ' · дууссан' : ''}</div>
    </div>
    {card.main && <CmBadge tone="main">Үндсэн</CmBadge>}
  </div>
);
const CmToggle = ({ on, disabled, onClick }) => (
  <button onClick={disabled ? undefined : onClick} style={{ width: 46, height: 27, borderRadius: 999, border:'none', cursor: disabled ? 'default' : 'pointer', background: on ? CCM.indigo : CCM.line, opacity: disabled ? .45 : 1, position:'relative', transition:'background .15s', flexShrink:0 }}>
    <span style={{ position:'absolute', top: 3, left: on ? 22 : 3, width: 21, height: 21, borderRadius: 999, background:'#fff', transition:'left .15s', boxShadow:'0 1px 3px rgba(0,0,0,.2)' }}/>
  </button>
);

// ============================================================
// MY CARDS screen
// ============================================================
const MyCards = ({ onNav, view }) => {
  const [cards, setCards] = useStateCM(view === 'empty' ? [] : CM_INIT);
  const [sheet, setSheet] = useStateCM(null);   // { type:'actions'|'uses'|'delete', id }
  const cur = sheet ? cards.find(c => c.id === sheet.id) : null;

  const setMain = (id) => { setCards(cs => cs.map(c => ({ ...c, main: c.id === id }))); setSheet(null); };
  const toggleUse = (id, key) => setCards(cs => {
    const has = cs.find(c => c.id === id).uses.includes(key);
    return cs.map(c => c.id === id
      ? { ...c, uses: has ? c.uses.filter(u => u !== key) : [...c.uses, key] }
      : { ...c, uses: c.uses.filter(u => u !== key || has) });
  });
  const delCard = (id) => {
    setCards(cs => {
      const rest = cs.filter(c => c.id !== id);
      if (rest.length && !rest.some(c => c.main)) {
        const firstActive = rest.find(c => c.status !== 'expired') || rest[0];
        return rest.map(c => ({ ...c, main: c.id === firstActive.id }));
      }
      return rest;
    });
    setSheet(null);
  };

  const expiredCount = cards.filter(c => c.status === 'expired').length;

  const SheetRow = ({ icon, label, danger, onClick, top }) => (
    <button onClick={onClick} style={{ width:'100%', textAlign:'left', display:'flex', alignItems:'center', gap: 12, padding:'14px 4px', background:'transparent', border:'none', borderTop: top ? `1px solid ${CCM.line2}` : 'none', cursor:'pointer' }}>
      <div style={{ width: 36, height: 36, borderRadius: 11, background: danger ? CCM.redSoft : '#F4F6FB', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{icon}</div>
      <span style={{ flex:1, fontSize: 14, fontWeight: 700, color: danger ? CCM.red : CCM.ink }}>{label}</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke={CCM.muted2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </button>
  );

  return (
    <FrameCM label="Wallet · my cards">
      <BackBarCM title="Миний картууд"/>
      <div style={{ flex:1, overflow:'auto', padding:'2px 24px 24px' }}>
        {cards.length === 0 ? (
          <div style={{ height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'0 12px' }}>
            <div style={{ position:'relative', width: 170, height: 110 }}>
              <div style={{ position:'absolute', left: 26, top: 22, width: 130, height: 82, borderRadius: 12, background:'#E7E9F2', transform:'rotate(5deg)' }}/>
              <div style={{ position:'absolute', left: 8, top: 8, width: 130, height: 82, borderRadius: 12, background: GRADS_CM.visa, transform:'rotate(-4deg)', display:'flex', alignItems:'flex-end', padding: 12 }}>
                <div style={{ width: '55%', height: 8, borderRadius: 4, background:'rgba(255,255,255,.4)' }}/>
              </div>
            </div>
            <div style={{ fontSize: 19, fontWeight: 800, color: CCM.ink, marginTop: 24, letterSpacing:'-0.01em' }}>Холбосон карт алга</div>
            <div style={{ fontSize: 13, color: CCM.muted, marginTop: 8, lineHeight: 1.55, maxWidth: 280 }}>Картаа холбовол шуурхай цэнэглэлт, зээлийн автомат төлөлт, автомат хөрөнгө оруулалт идэвхжинэ.</div>
            <button style={{ marginTop: 22, height: 50, padding:'0 26px', borderRadius: 14, background: CCM.indigo, color:'#fff', border:'none', fontWeight: 700, fontSize: 14.5, cursor:'pointer', boxShadow:'0 8px 22px -8px rgba(79,70,229,.5)' }}>Карт нэмэх</button>
          </div>
        ) : (
          <>
            {expiredCount > 0 && (
              <div style={{ display:'flex', gap: 10, alignItems:'flex-start', padding:'12px 14px', borderRadius: 14, background: CCM.amberSoft, border:`1px solid ${CCM.amber}33` }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:1 }}><path d="M12 4L2.5 20h19L12 4z" stroke={CCM.amber} strokeWidth="2" strokeLinejoin="round"/><path d="M12 10v4M12 17h.01" stroke={CCM.amber} strokeWidth="2" strokeLinecap="round"/></svg>
                <div style={{ fontSize: 12, color:'#7A5410', lineHeight: 1.5, fontWeight: 600 }}>{expiredCount} картын хугацаа дууссан байна. Мэдээллийг шинэчлэх эсвэл картыг устгана уу.</div>
              </div>
            )}
            {cards.map(c => <CmCardBlock key={c.id} card={c} onActions={() => setSheet({ type:'actions', id: c.id })}/>)}
            <button style={{ width:'100%', height: 60, marginTop: 18, borderRadius: 16, background:'transparent', border:`1.5px dashed ${CCM.line}`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap: 9, color: CCM.indigo, fontWeight: 700, fontSize: 14 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={CCM.indigo} strokeWidth="2.4" strokeLinecap="round"/></svg>
              Карт нэмэх
            </button>
            <div style={{ marginTop: 14, display:'flex', gap: 8, alignItems:'flex-start', padding:'0 2px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:1 }}><rect x="5" y="11" width="14" height="9" rx="2" stroke={CCM.muted2} strokeWidth="2"/><path d="M8 11V8a4 4 0 018 0v3" stroke={CCM.muted2} strokeWidth="2"/></svg>
              <div style={{ fontSize: 11, color: CCM.muted, lineHeight: 1.5 }}>Картын мэдээлэл олон улсын PCI DSS стандартын дагуу шифрлэгдэж хадгалагдана.</div>
            </div>
          </>
        )}
      </div>

      {/* ── actions sheet ── */}
      {cur && sheet.type === 'actions' && (
        <CmSheet onClose={() => setSheet(null)}>
          <CmMiniCard card={cur}/>
          <div style={{ marginTop: 8 }}>
            {cur.status !== 'expired' && !cur.main && (
              <SheetRow onClick={() => setMain(cur.id)} label="Үндсэн карт болгох" icon={<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M12 3l2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 16.9 6.4 20l1.3-6.2L3 9.5l6.3-.7L12 3z" stroke={CCM.indigo} strokeWidth="2" strokeLinejoin="round"/></svg>}/>
            )}
            {cur.status !== 'expired' && (
              <SheetRow top={!cur.main} onClick={() => setSheet({ type:'uses', id: cur.id })} label="Ашиглалт тохируулах" icon={<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M4 7h10M18 7h2M4 17h2M10 17h10M14 4.5v5M8 14.5v5" stroke={CCM.ink} strokeWidth="2" strokeLinecap="round"/></svg>}/>
            )}
            {cur.status !== 'active' && (
              <SheetRow top onClick={() => setSheet(null)} label="Картын мэдээлэл шинэчлэх" icon={<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M20 11a8 8 0 10-1.5 6.5M20 5v6h-6" stroke={CCM.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}/>
            )}
            <SheetRow top danger onClick={() => setSheet({ type:'delete', id: cur.id })} label="Картыг устгах" icon={<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13M10 11v5M14 11v5" stroke={CCM.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}/>
          </div>
        </CmSheet>
      )}

      {/* ── usage sheet ── */}
      {cur && sheet.type === 'uses' && (
        <CmSheet onClose={() => setSheet(null)}>
          <div style={{ fontSize: 18, fontWeight: 800, color: CCM.ink, textAlign:'center', letterSpacing:'-0.01em' }}>Ашиглалт тохируулах</div>
          <div style={{ marginTop: 14 }}><CmMiniCard card={cur}/></div>
          <div style={{ marginTop: 10 }}>
            {Object.keys(CM_USES).map((k, i) => {
              const u = CM_USES[k];
              const other = cards.find(c => c.id !== cur.id && c.uses.includes(k));
              return (
                <div key={k} style={{ display:'flex', alignItems:'center', gap: 12, padding:'13px 4px', borderTop: i ? `1px solid ${CCM.line2}` : 'none' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 11, background: u.soft, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <svg width="17" height="17" viewBox="0 0 24 24">{u.icon(u.c)}</svg>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: CCM.ink }}>{u.l}</div>
                    {other && !cur.uses.includes(k) && <div style={{ fontSize: 11, color: CCM.amber, fontWeight: 700, marginTop: 2 }}>Одоо •••• {other.last4} картад холбоотой</div>}
                  </div>
                  <CmToggle on={cur.uses.includes(k)} onClick={() => toggleUse(cur.id, k)}/>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 6, display:'flex', gap: 8, alignItems:'flex-start', padding:'12px 14px', borderRadius: 14, background:'#FAFBFE', border:`1px solid ${CCM.line2}` }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:1 }}><circle cx="12" cy="12" r="9" stroke={CCM.muted2} strokeWidth="2"/><path d="M12 16v-4M12 8.5h.01" stroke={CCM.muted2} strokeWidth="2" strokeLinecap="round"/></svg>
            <div style={{ fontSize: 11.5, color: CCM.muted, lineHeight: 1.5 }}>Нэг бүтээгдэхүүнд зөвхөн нэг карт холбогдоно. Энэ картад шилжүүлбэл өмнөх картын тохиргоо автоматаар цуцлагдана.</div>
          </div>
          <button onClick={() => setSheet(null)} style={{ width:'100%', height: 50, marginTop: 14, borderRadius: 14, background: CCM.indigo, color:'#fff', border:'none', fontWeight: 700, fontSize: 14.5, cursor:'pointer', boxShadow:'0 8px 22px -8px rgba(79,70,229,.5)' }}>Болсон</button>
        </CmSheet>
      )}

      {/* ── delete confirm sheet ── */}
      {cur && sheet.type === 'delete' && (
        <CmSheet onClose={() => setSheet(null)}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: CCM.redSoft, display:'flex', alignItems:'center', justifyContent:'center', marginBottom: 14 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13M10 11v5M14 11v5" stroke={CCM.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: CCM.ink, letterSpacing:'-0.01em' }}>Картыг устгах уу?</div>
          <div style={{ marginTop: 12 }}><CmMiniCard card={cur}/></div>
          {cur.uses.length > 0 && (
            <div style={{ marginTop: 10, display:'flex', gap: 9, alignItems:'flex-start', padding:'12px 14px', borderRadius: 14, background: CCM.amberSoft, border:`1px solid ${CCM.amber}33` }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:1 }}><path d="M12 4L2.5 20h19L12 4z" stroke={CCM.amber} strokeWidth="2" strokeLinejoin="round"/><path d="M12 10v4M12 17h.01" stroke={CCM.amber} strokeWidth="2" strokeLinecap="round"/></svg>
              <div style={{ fontSize: 12, color:'#7A5410', lineHeight: 1.5, fontWeight: 600 }}>Энэ карт: {cur.uses.map(u => CM_USES[u].l.toLowerCase()).join(', ')}-д ашиглагдаж байна. Устгавал эдгээр автомат төлбөр зогсох тул өөр карт сонгоно уу.</div>
            </div>
          )}
          <div style={{ marginTop: 16, display:'flex', flexDirection:'column', gap: 9 }}>
            <button onClick={() => delCard(cur.id)} style={{ width:'100%', height: 50, borderRadius: 14, background: CCM.red, color:'#fff', border:'none', fontWeight: 700, fontSize: 14.5, cursor:'pointer', boxShadow:'0 8px 22px -8px rgba(220,38,38,.45)' }}>Устгах</button>
            <button onClick={() => setSheet(null)} style={{ width:'100%', height: 46, borderRadius: 14, background:'transparent', color: CCM.ink, border:`1.5px solid ${CCM.line}`, fontWeight: 700, fontSize: 14, cursor:'pointer' }}>Болих</button>
          </div>
        </CmSheet>
      )}
    </FrameCM>
  );
};

Object.assign(window, { MyCards });
