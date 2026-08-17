// cards_desktop.jsx — MMF Web · Wallet "Миний картууд" section (desktop port of card_manage.jsx)
// Exports: WalletCardsSection. Load after comp_atoms.jsx + comp_kit.jsx.
// Mobile parity: same card set, main-card rule, per-product usage assignment
// (one product ↔ one card), expiring/expired states, delete guard.
// Desktop swaps bottom sheets for a kebab popover + WebModal dialogs.

const { useState: _uSC, useEffect: _uEC, useRef: _uRC } = React;
const _TC = window.T;
const MONO_C = "'JetBrains Mono',monospace";

const CD_GRADS = {
  visa: 'linear-gradient(135deg,#312E81 0%,#4F46E5 62%,#2D6BFF 135%)',
  mc: 'linear-gradient(135deg,#0B1020 0%,#232A4D 58%,#3B4FB0 135%)',
  none: 'linear-gradient(135deg,#1B2140 0%,#2A3052 100%)',
  expired: 'linear-gradient(135deg,#6A7086 0%,#8B91A6 100%)',
};
const CD_HOLDER = 'BATBOLD TEMUUJIN';
const CD_USES = {
  loan: { l: 'Зээлийн автомат төлөлт', c: _TC.indigo, soft: _TC.indigoSoft, icon: c => <g stroke={c} strokeWidth="2" fill="none" strokeLinecap="round"><rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18"/></g> },
  invest: { l: 'Автомат хөрөнгө оруулалт', c: _TC.pos, soft: _TC.posSoft, icon: c => <g stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M4 17l5-6 4 3 7-8M14 6h6v6"/></g> },
  topup: { l: 'Хэтэвч цэнэглэлт', c: _TC.blue, soft: _TC.blueSoft, icon: c => <g stroke={c} strokeWidth="2" fill="none" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></g> },
};
const CD_INIT = [
  { id: 1, brand: 'visa', last4: '4821', num: '4218402155674821', exp: '09/28', main: true, status: 'active', uses: ['loan', 'invest'] },
  { id: 2, brand: 'mc', last4: '7710', num: '5417751208447710', exp: '08/26', main: false, status: 'expiring', uses: ['topup'] },
  { id: 3, brand: 'visa', last4: '1053', num: '4321880234511053', exp: '05/26', main: false, status: 'expired', uses: [] },
];

const CdBrand = ({ brand, h = 18 }) => brand === 'mc'
  ? <svg width={h * 1.7} height={h} viewBox="0 0 34 20" style={{ display: 'block' }}><circle cx="12" cy="10" r="9.5" fill="#EB001B"/><circle cx="22" cy="10" r="9.5" fill="#F79E1B" fillOpacity=".92"/></svg>
  : brand === 'visa'
    ? <span style={{ fontStyle: 'italic', fontWeight: 900, color: '#fff', fontSize: h * 0.9, letterSpacing: '0.05em', lineHeight: 1 }}>VISA</span>
    : <span style={{ width: h * 1.6, height: h, borderRadius: 5, border: '1.5px dashed rgba(255,255,255,.4)', display: 'block' }}/>;

const CdChip = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <svg width="34" height="26" viewBox="0 0 34 26"><rect x="1" y="1" width="32" height="24" rx="5" fill="rgba(255,255,255,.28)" stroke="rgba(255,255,255,.5)"/><path d="M1 9h10M1 17h10M23 9h10M23 17h10M11 9v8h12V9" stroke="rgba(255,255,255,.5)" fill="none"/></svg>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 9a8 8 0 010 6M10 7a12 12 0 010 10M14 5a16 16 0 010 14" stroke="rgba(255,255,255,.55)" strokeWidth="2" strokeLinecap="round"/></svg>
  </div>
);

/* ── Card face — desktop scale (fixed 300×186 in a responsive grid) ── */
const CdCardFace = ({ card, badge }) => {
  const expired = card.status === 'expired';
  const groups = [0, 1, 2, 3].map(g => (card.num || '').replace(/\D/g, '').slice(g * 4, g * 4 + 4).padEnd(4, '•'));
  return (
    <div style={{ position: 'relative', height: 186, borderRadius: 20, overflow: 'hidden', color: '#fff', padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: expired ? CD_GRADS.expired : CD_GRADS[card.brand || 'none'], boxShadow: '0 18px 40px -20px rgba(15,20,55,.55)', filter: expired ? 'saturate(.35)' : 'none' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(340px 200px at 88% -20%, rgba(255,255,255,.16), transparent 60%), radial-gradient(300px 220px at -10% 120%, rgba(255,255,255,.08), transparent 55%)', pointerEvents: 'none' }}/>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative', gap: 10 }}>
        <CdChip/>
        {badge || <CdBrand brand={card.brand}/>}
      </div>
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', gap: 14, fontFamily: MONO_C, fontSize: 17, fontWeight: 600, letterSpacing: '0.08em', textShadow: '0 1px 4px rgba(0,0,0,.25)' }}>
          {groups.map((g, i) => <span key={i}>{g}</span>)}
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 16, gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '0.14em', opacity: .6, textTransform: 'uppercase' }}>Карт эзэмшигч</div>
            <div className="truncate" style={{ fontSize: 12.5, fontWeight: 700, marginTop: 3, letterSpacing: '0.06em' }}>{CD_HOLDER}</div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '0.14em', opacity: .6, textTransform: 'uppercase' }}>Хүчинтэй</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, marginTop: 3, fontFamily: MONO_C }}>{card.exp || '••/••'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CdBadge = ({ tone, children }) => {
  const s = tone === 'main' ? { bg: '#fff', c: _TC.indigo } : tone === 'warn' ? { bg: _TC.warnSoft, c: _TC.warn } : { bg: _TC.negSoft, c: _TC.neg };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 999, background: s.bg, color: s.c, fontSize: 10.5, fontWeight: 800, letterSpacing: '.02em', whiteSpace: 'nowrap', boxShadow: '0 4px 12px -4px rgba(11,16,32,.35)' }}>
      {tone === 'main' && <svg width="11" height="11" viewBox="0 0 24 24" fill={_TC.indigo}><path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2z"/></svg>}
      {children}
    </span>
  );
};

const CdUseChip = ({ k }) => {
  const u = CD_USES[k];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 999, background: u.soft, color: u.c, fontSize: 11, fontWeight: 700 }}>
      <svg width="12" height="12" viewBox="0 0 24 24">{u.icon(u.c)}</svg>{u.l}
    </span>
  );
};

const CdToggle = ({ on, onClick }) => (
  <button onClick={onClick} role="switch" aria-checked={on} style={{ width: 46, height: 27, borderRadius: 999, border: 'none', cursor: 'pointer', background: on ? _TC.indigo : _TC.line, position: 'relative', transition: 'background .15s', flexShrink: 0 }}>
    <span style={{ position: 'absolute', top: 3, left: on ? 22 : 3, width: 21, height: 21, borderRadius: 999, background: '#fff', transition: 'left .15s', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }}/>
  </button>
);

const CdMiniCard = ({ card }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 14, background: _TC.field, border: `1px solid ${_TC.line2}` }}>
    <div style={{ width: 46, height: 32, borderRadius: 7, background: card.status === 'expired' ? CD_GRADS.expired : CD_GRADS[card.brand], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <CdBrand brand={card.brand} h={card.brand === 'visa' ? 8 : 13}/>
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div className="num" style={{ fontSize: 13.5, fontWeight: 700, color: _TC.ink }}>•••• {card.last4}</div>
      <div style={{ fontSize: 11.5, color: card.status === 'expired' ? _TC.neg : _TC.muted, marginTop: 1, fontWeight: 600 }}>Хүчинтэй: {card.exp}{card.status === 'expired' ? ' · дууссан' : ''}</div>
    </div>
    {card.main && <CdBadge tone="main">Үндсэн</CdBadge>}
  </div>
);

/* ── Kebab popover — shared by the full tile and the compact row ── */
const CdKebab = ({ card, onSetMain, onUses, onDelete, onRenew, size = 34 }) => {
  const [menu, setMenu] = _uSC(false);
  const [pos, setPos] = _uSC(null);   // fixed-position box, measured off the button
  const btnRef = _uRC(null);
  const expired = card.status === 'expired';
  const MENU_W = 236;
  const open = () => {
    const r = btnRef.current.getBoundingClientRect();
    const rows = 1 + (!expired && !card.main ? 1 : 0) + (!expired ? 1 : 0) + (card.status !== 'active' ? 1 : 0);
    const h = rows * 47 + 8;
    const below = window.innerHeight - r.bottom - 12 >= h;   // flip up when there is no room
    setPos({ left: Math.max(12, r.right - MENU_W), top: below ? r.bottom + 4 : undefined, bottom: below ? undefined : window.innerHeight - r.top + 4 });
    setMenu(true);
  };
  _uEC(() => {
    if (!menu) return;
    const esc = e => e.key === 'Escape' && setMenu(false);
    const close = () => setMenu(false);
    window.addEventListener('keydown', esc);
    window.addEventListener('resize', close);
    window.addEventListener('scroll', close, true);
    return () => { window.removeEventListener('keydown', esc); window.removeEventListener('resize', close); window.removeEventListener('scroll', close, true); };
  }, [menu]);
  const Item = ({ label, icon, danger, top, onClick }) => (
    <button onClick={() => { setMenu(false); onClick(); }} style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'transparent', border: 'none', borderTop: top ? `1px solid ${_TC.line2}` : 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, color: danger ? _TC.neg : _TC.ink }}
      onMouseEnter={e => e.currentTarget.style.background = _TC.field} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      <span style={{ width: 26, height: 26, borderRadius: 8, background: danger ? _TC.negSoft : _TC.field, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</span>
      {label}
    </button>
  );
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <button ref={btnRef} onClick={() => menu ? setMenu(false) : open()} aria-label="Картын үйлдэл" aria-expanded={menu} style={{ width: size, height: size, borderRadius: 10, background: menu ? _TC.field : 'transparent', border: `1px solid ${_TC.line}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill={_TC.ink}><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
      </button>
      {menu && (
        <>
          <div onClick={() => setMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 30 }}/>
          <div style={{ position: 'fixed', left: pos.left, top: pos.top, bottom: pos.bottom, zIndex: 31, width: MENU_W, background: _TC.surface, border: `1px solid ${_TC.line}`, borderRadius: 14, boxShadow: '0 20px 44px -18px rgba(15,20,55,.4)', overflow: 'hidden', padding: '4px 0' }}>
            {!expired && !card.main && <Item label="Үндсэн карт болгох" onClick={() => onSetMain(card.id)} icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 3l2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 16.9 6.4 20l1.3-6.2L3 9.5l6.3-.7L12 3z" stroke={_TC.indigo} strokeWidth="2" strokeLinejoin="round"/></svg>}/>}
            {!expired && <Item top={!card.main} label="Ашиглалт тохируулах" onClick={() => onUses(card.id)} icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 7h10M18 7h2M4 17h2M10 17h10M14 4.5v5M8 14.5v5" stroke={_TC.ink} strokeWidth="2" strokeLinecap="round"/></svg>}/>}
            {card.status !== 'active' && <Item top label="Мэдээлэл шинэчлэх" onClick={() => onRenew(card.id)} icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 11a8 8 0 10-1.5 6.5M20 5v6h-6" stroke={_TC.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}/>}
            <Item top danger label="Картыг устгах" onClick={() => onDelete(card.id)} icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13M10 11v5M14 11v5" stroke={_TC.neg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}/>
          </div>
        </>
      )}
    </div>
  );
};

/* ── Full card tile (face + usage chips) — used where space allows ── */
const CdCardTile = ({ card, ...menu }) => {
  const expired = card.status === 'expired';
  return (
    <div>
      <CdCardFace card={card} badge={
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {card.main && <CdBadge tone="main">Үндсэн</CdBadge>}
          {card.status === 'expiring' && <CdBadge tone="warn">Удахгүй дуусна</CdBadge>}
          {expired && <CdBadge tone="bad">Хугацаа дууссан</CdBadge>}
          <span style={{ marginLeft: 2 }}><CdBrand brand={card.brand} h={card.brand === 'visa' ? 13 : 17}/></span>
        </div>
      }/>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 10 }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {expired ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 999, background: _TC.negSoft, color: _TC.neg, fontSize: 11, fontWeight: 700 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={_TC.neg} strokeWidth="2"/><path d="M12 7.5v5.5M12 16.5h.01" stroke={_TC.neg} strokeWidth="2.2" strokeLinecap="round"/></svg>
              Автомат төлбөр идэвхгүй
            </span>
          ) : card.uses.length ? card.uses.map(u => <CdUseChip key={u} k={u}/>)
            : <span style={{ padding: '5px 10px', borderRadius: 999, background: '#EEF0F6', color: _TC.muted, fontSize: 11, fontWeight: 700 }}>Ашиглалт тохируулаагүй</span>}
        </div>
        <CdKebab card={card} {...menu}/>
      </div>
    </div>
  );
};

/* ── Compact row — the Wallet default: one line per card, no full face.
   Status carries a colored dot + label (never colour alone). ── */
const CdCardRow = ({ card, last, ...menu }) => {
  const expired = card.status === 'expired';
  const st = expired ? { c: _TC.neg, l: 'Хугацаа дууссан' }
    : card.status === 'expiring' ? { c: _TC.warn, l: `Хүчинтэй ${card.exp} · удахгүй дуусна` }
    : { c: _TC.pos, l: `Хүчинтэй ${card.exp}` };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderTop: last ? 'none' : `1px solid ${_TC.line2}` }}>
      <div style={{ width: 42, height: 29, borderRadius: 6, background: expired ? CD_GRADS.expired : CD_GRADS[card.brand], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, filter: expired ? 'saturate(.35)' : 'none' }}>
        <CdBrand brand={card.brand} h={card.brand === 'visa' ? 8 : 12}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span className="num" style={{ fontSize: 13, fontWeight: 700, color: _TC.ink }}>•••• {card.last4}</span>
          {card.main && <span style={{ fontSize: 10, fontWeight: 800, color: _TC.indigo, background: _TC.indigoSoft, padding: '2px 7px', borderRadius: 999, whiteSpace: 'nowrap' }}>Үндсэн</span>}
        </div>
        <div className="truncate" style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3, fontSize: 11.5, fontWeight: 600, color: _TC.muted }}>
          <span style={{ width: 7, height: 7, borderRadius: 999, background: st.c, flexShrink: 0 }}/>{st.l}
        </div>
        {!expired && card.uses.length > 0 && (
          <div style={{ display: 'flex', gap: 5, marginTop: 6, flexWrap: 'wrap' }}>
            {card.uses.map(k => (
              <span key={k} title={CD_USES[k].l} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 7px', borderRadius: 999, background: CD_USES[k].soft, color: CD_USES[k].c, fontSize: 10.5, fontWeight: 700 }}>
                <svg width="10" height="10" viewBox="0 0 24 24">{CD_USES[k].icon(CD_USES[k].c)}</svg>{CD_USES[k].l}
              </span>
            ))}
          </div>
        )}
      </div>
      <CdKebab card={card} size={30} {...menu}/>
    </div>
  );
};

/* ══ Add-card modal — number / exp / CVV / holder ══ */
const CdAddCardModal = ({ open, onClose, onAdd }) => {
  const { WebModal, WebButton } = window;
  const [num, setNum] = _uSC('');
  const [exp, setExp] = _uSC('');
  const [cvv, setCvv] = _uSC('');
  const digits = num.replace(/\D/g, '');
  const brand = digits.startsWith('4') ? 'visa' : digits.startsWith('5') ? 'mc' : null;
  const valid = digits.length === 16 && /^\d{2}\/\d{2}$/.test(exp) && cvv.length === 3;
  if (!open) return null;
  const close = () => { setNum(''); setExp(''); setCvv(''); onClose(); };
  const field = { width: '100%', height: 48, borderRadius: 12, border: `1.5px solid ${_TC.line}`, background: _TC.field, padding: '0 14px', fontFamily: MONO_C, fontSize: 15, fontWeight: 600, color: _TC.ink, outline: 'none', boxSizing: 'border-box' };
  const lbl = { fontSize: 12, fontWeight: 700, color: _TC.muted, marginBottom: 6, display: 'block' };
  return (
    <WebModal open onClose={close} title="Карт нэмэх" footer={
      <div style={{ display: 'flex', gap: 10 }}>
        <WebButton variant="ghost" full onClick={close}>Болих</WebButton>
        <WebButton variant="primary" full disabled={!valid} onClick={() => { onAdd({ brand: brand || 'visa', num: digits, last4: digits.slice(-4), exp }); close(); }}>Холбох</WebButton>
      </div>
    }>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ maxWidth: 320, width: '100%', margin: '0 auto' }}>
          <CdCardFace card={{ brand, num: digits, exp: exp || '••/••', status: 'active' }}/>
        </div>
        <div>
          <label style={lbl}>Картын дугаар</label>
          <div style={{ position: 'relative' }}>
            <input value={num} inputMode="numeric" placeholder="0000 0000 0000 0000" onChange={e => setNum(e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim())} style={field}/>
            {brand && <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', filter: 'invert(1) grayscale(1) brightness(.4)' }}><CdBrand brand={brand} h={brand === 'visa' ? 11 : 15}/></span>}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={lbl}>Хүчинтэй хугацаа</label>
            <input value={exp} inputMode="numeric" placeholder="ММ/ЖЖ" onChange={e => { const d = e.target.value.replace(/\D/g, '').slice(0, 4); setExp(d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d); }} style={field}/>
          </div>
          <div>
            <label style={lbl}>CVV</label>
            <input value={cvv} inputMode="numeric" type="password" placeholder="•••" onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))} style={field}/>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start', padding: '12px 14px', borderRadius: 12, background: _TC.field, border: `1px solid ${_TC.line2}` }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}><rect x="5" y="11" width="14" height="9" rx="2" stroke={_TC.muted2} strokeWidth="2"/><path d="M8 11V8a4 4 0 018 0v3" stroke={_TC.muted2} strokeWidth="2"/></svg>
          <div style={{ fontSize: 11.5, color: _TC.muted, lineHeight: 1.5 }}>Картын мэдээлэл олон улсын PCI DSS стандартын дагуу шифрлэгдэж хадгалагдана. Баталгаажуулахад ₮100 түр татагдаж, шууд буцаагдана.</div>
        </div>
      </div>
    </WebModal>
  );
};

/* ══ Renew-card modal — re-verify an expiring/expired card in place ══
   Same fields as the add dialog minus the number (the card stays the same);
   saving re-dates the card and returns it to the active state. ══ */
const CdRenewCardModal = ({ card, onClose, onSave }) => {
  const { WebModal, WebButton } = window;
  const [exp, setExp] = _uSC('');
  const [cvv, setCvv] = _uSC('');
  const expired = card.status === 'expired';
  const valid = /^\d{2}\/\d{2}$/.test(exp) && cvv.length === 3;
  const field = { width: '100%', height: 48, borderRadius: 12, border: `1.5px solid ${_TC.line}`, background: _TC.field, padding: '0 14px', fontFamily: MONO_C, fontSize: 15, fontWeight: 600, color: _TC.ink, outline: 'none', boxSizing: 'border-box' };
  const lbl = { fontSize: 12, fontWeight: 700, color: _TC.muted, marginBottom: 6, display: 'block' };
  return (
    <WebModal open onClose={onClose} title="Картын мэдээлэл шинэчлэх" footer={
      <div style={{ display: 'flex', gap: 10 }}>
        <WebButton variant="ghost" full onClick={onClose}>Болих</WebButton>
        <WebButton variant="primary" full disabled={!valid} reason={!valid ? 'Шинэ хүчинтэй хугацаа болон CVV-г оруулна уу.' : undefined} onClick={() => onSave(card.id, exp)}>Шинэчлэх</WebButton>
      </div>
    }>
      <CdMiniCard card={card}/>
      <div style={{ marginTop: 14, display: 'flex', gap: 9, alignItems: 'flex-start', padding: '12px 14px', borderRadius: 12, background: _TC.warnSoft, border: `1px solid ${_TC.warnBorder}` }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}><path d="M12 4L2.5 20h19L12 4z" stroke={_TC.warn} strokeWidth="2" strokeLinejoin="round"/><path d="M12 10v4M12 17h.01" stroke={_TC.warn} strokeWidth="2" strokeLinecap="round"/></svg>
        <div style={{ fontSize: 12, color: '#7A5410', lineHeight: 1.5, fontWeight: 600, textWrap: 'pretty' }}>{expired ? `•••• ${card.last4} картын хугацаа дууссан.` : `•••• ${card.last4} картын хугацаа удахгүй дуусна.`} Банкнаас шинэчилсэн хугацаа, CVV-г оруулснаар автомат төлбөр саадгүй үргэлжилнэ.</div>
      </div>
      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={lbl}>Шинэ хүчинтэй хугацаа</label>
          <input value={exp} inputMode="numeric" placeholder="ММ/ЖЖ" onChange={e => { const d = e.target.value.replace(/\D/g, '').slice(0, 4); setExp(d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d); }} style={field}/>
        </div>
        <div>
          <label style={lbl}>CVV</label>
          <input value={cvv} inputMode="numeric" type="password" placeholder="•••" onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))} style={field}/>
        </div>
      </div>
      <div style={{ marginTop: 14, display: 'flex', gap: 9, alignItems: 'flex-start', padding: '12px 14px', borderRadius: 12, background: _TC.field, border: `1px solid ${_TC.line2}` }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}><rect x="5" y="11" width="14" height="9" rx="2" stroke={_TC.muted2} strokeWidth="2"/><path d="M8 11V8a4 4 0 018 0v3" stroke={_TC.muted2} strokeWidth="2"/></svg>
        <div style={{ fontSize: 11.5, color: _TC.muted, lineHeight: 1.5 }}>Картын дугаар өөрчлөгдөхгүй. Баталгаажуулахад ₮100 түр татагдаж, шууд буцаагдана.</div>
      </div>
    </WebModal>
  );
};

/* ══ WALLET · MY CARDS SECTION ══════════════════════════════════════════ */
const WalletCardsSection = ({ compact }) => {
  const { WebModal, WebButton } = window;
  const [cards, setCards] = _uSC(CD_INIT);
  const [dlg, setDlg] = _uSC(null); // { type:'uses'|'delete'|'renew', id }
  const [addOpen, setAddOpen] = _uSC(false);
  const cur = dlg ? cards.find(c => c.id === dlg.id) : null;

  const setMain = id => setCards(cs => cs.map(c => ({ ...c, main: c.id === id })));
  const toggleUse = (id, key) => setCards(cs => {
    const has = cs.find(c => c.id === id).uses.includes(key);
    return cs.map(c => c.id === id
      ? { ...c, uses: has ? c.uses.filter(u => u !== key) : [...c.uses, key] }
      : { ...c, uses: c.uses.filter(u => u !== key || has) });
  });
  const delCard = id => {
    setCards(cs => {
      const rest = cs.filter(c => c.id !== id);
      if (rest.length && !rest.some(c => c.main)) {
        const first = rest.find(c => c.status !== 'expired') || rest[0];
        return rest.map(c => ({ ...c, main: c.id === first.id }));
      }
      return rest;
    });
    setDlg(null);
  };
  const addCard = c => setCards(cs => [...cs, { ...c, id: Date.now(), main: cs.length === 0, status: 'active', uses: [] }]);
  const renewCard = (id, exp) => { setCards(cs => cs.map(c => c.id === id ? { ...c, exp, status: 'active' } : c)); setDlg(null); };
  const expiredCount = cards.filter(c => c.status === 'expired').length;

  return (
    <div style={{ background: _TC.surface, border: `1px solid ${_TC.line2}`, borderRadius: 20, overflow: 'hidden' }}>
      {compact ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '13px 16px', borderBottom: `1px solid ${_TC.line2}` }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: _TC.ink }}>Миний картууд <span style={{ color: _TC.muted, fontWeight: 700 }}>· {cards.length}</span></div>
          <button onClick={() => setAddOpen(true)} style={{ border: 'none', background: 'none', color: _TC.indigo, fontWeight: 700, fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit', padding: '4px 2px' }}>+ Нэмэх</button>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '18px 20px', borderBottom: `1px solid ${_TC.line2}`, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: _TC.ink, letterSpacing: '-0.01em' }}>Миний картууд</div>
            <div style={{ fontSize: 12, color: _TC.muted, fontWeight: 600, marginTop: 3 }}>Цэнэглэлт, зээлийн болон хөрөнгө оруулалтын автомат төлбөрт ашиглана</div>
          </div>
          <WebButton variant="ghost" onClick={() => setAddOpen(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={_TC.indigo} strokeWidth="2.4" strokeLinecap="round"/></svg>
            Карт нэмэх
          </WebButton>
        </div>
      )}

      {compact ? (
        cards.length === 0 ? (
          <div style={{ padding: '20px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: _TC.ink }}>Холбосон карт алга</div>
            <div style={{ fontSize: 11.5, color: _TC.muted, marginTop: 5, lineHeight: 1.5 }}>Карт холбовол шуурхай цэнэглэлт, автомат төлөлт идэвхжинэ.</div>
            <div style={{ marginTop: 14 }}><WebButton size="sm" variant="ghost" onClick={() => setAddOpen(true)}>Карт нэмэх</WebButton></div>
          </div>
        ) : (
          <>
            {cards.map((c, i) => (
              <CdCardRow key={c.id} card={c} last={false}
                onSetMain={setMain}
                onUses={id => setDlg({ type: 'uses', id })}
                onRenew={id => setDlg({ type: 'renew', id })}
                onDelete={id => setDlg({ type: 'delete', id })}/>
            ))}
            {expiredCount > 0 && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '11px 16px', borderTop: `1px solid ${_TC.line2}`, background: _TC.warnSurface }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}><path d="M12 4L2.5 20h19L12 4z" stroke={_TC.warn} strokeWidth="2" strokeLinejoin="round"/><path d="M12 10v4M12 17h.01" stroke={_TC.warn} strokeWidth="2" strokeLinecap="round"/></svg>
                <div style={{ fontSize: 11.5, color: '#7A5410', lineHeight: 1.45, fontWeight: 600, textWrap: 'pretty' }}>{expiredCount} картын хугацаа дууссан. Мэдээллийг шинэчлэх эсвэл устгана уу.</div>
              </div>
            )}
          </>
        )
      ) : (
      <div style={{ padding: '20px' }}>
        {cards.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '26px 20px 30px' }}>
            <div style={{ position: 'relative', width: 176, height: 112 }}>
              <div style={{ position: 'absolute', left: 30, top: 22, width: 134, height: 84, borderRadius: 12, background: '#E7E9F2', transform: 'rotate(5deg)' }}/>
              <div style={{ position: 'absolute', left: 8, top: 6, width: 134, height: 84, borderRadius: 12, background: CD_GRADS.visa, transform: 'rotate(-4deg)', display: 'flex', alignItems: 'flex-end', padding: 12 }}>
                <div style={{ width: '55%', height: 8, borderRadius: 4, background: 'rgba(255,255,255,.4)' }}/>
              </div>
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: _TC.ink, marginTop: 22, letterSpacing: '-0.01em' }}>Холбосон карт алга</div>
            <div style={{ fontSize: 13, color: _TC.muted, marginTop: 8, lineHeight: 1.55, maxWidth: 340 }}>Картаа холбовол шуурхай цэнэглэлт, зээлийн автомат төлөлт, автомат хөрөнгө оруулалт идэвхжинэ.</div>
            <div style={{ marginTop: 20 }}><WebButton variant="primary" onClick={() => setAddOpen(true)}>Карт нэмэх</WebButton></div>
          </div>
        ) : (
          <>
            {expiredCount > 0 && (
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '12px 14px', borderRadius: 14, background: _TC.warnSoft, border: `1px solid ${_TC.warnBorder}`, marginBottom: 18 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}><path d="M12 4L2.5 20h19L12 4z" stroke={_TC.warn} strokeWidth="2" strokeLinejoin="round"/><path d="M12 10v4M12 17h.01" stroke={_TC.warn} strokeWidth="2" strokeLinecap="round"/></svg>
                <div style={{ fontSize: 12, color: '#7A5410', lineHeight: 1.5, fontWeight: 600, maxWidth: 560, textWrap: 'pretty' }}>{expiredCount} картын хугацаа дууссан байна. Мэдээллийг шинэчлэх эсвэл картыг устгана уу.</div>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(288px,1fr))', gap: 22 }}>
              {cards.map(c => (
                <CdCardTile key={c.id} card={c} cards={cards}
                  onSetMain={setMain}
                  onUses={id => setDlg({ type: 'uses', id })}
                  onRenew={id => setDlg({ type: 'renew', id })}
                  onDelete={id => setDlg({ type: 'delete', id })}/>
              ))}
              <button onClick={() => setAddOpen(true)} style={{ height: 186, borderRadius: 20, background: 'transparent', border: `1.5px dashed ${_TC.line}`, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, color: _TC.indigo, fontWeight: 700, fontSize: 13.5, fontFamily: 'inherit' }}>
                <span style={{ width: 42, height: 42, borderRadius: 13, background: _TC.indigoSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={_TC.indigo} strokeWidth="2.4" strokeLinecap="round"/></svg>
                </span>
                Карт нэмэх
              </button>
            </div>
            <div style={{ marginTop: 18, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}><rect x="5" y="11" width="14" height="9" rx="2" stroke={_TC.muted2} strokeWidth="2"/><path d="M8 11V8a4 4 0 018 0v3" stroke={_TC.muted2} strokeWidth="2"/></svg>
              <div style={{ fontSize: 11.5, color: _TC.muted, lineHeight: 1.5 }}>Картын мэдээлэл олон улсын PCI DSS стандартын дагуу шифрлэгдэж хадгалагдана.</div>
            </div>
          </>
        )}
      </div>
      )}

      <CdAddCardModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={addCard}/>

      {cur && dlg.type === 'uses' && (
        <WebModal open onClose={() => setDlg(null)} title="Ашиглалт тохируулах" footer={<WebButton variant="primary" full onClick={() => setDlg(null)}>Болсон</WebButton>}>
          <CdMiniCard card={cur}/>
          <div style={{ marginTop: 6 }}>
            {Object.keys(CD_USES).map((k, i) => {
              const u = CD_USES[k];
              const other = cards.find(c => c.id !== cur.id && c.uses.includes(k));
              return (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 2px', borderTop: i ? `1px solid ${_TC.line2}` : 'none' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 11, background: u.soft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="17" height="17" viewBox="0 0 24 24">{u.icon(u.c)}</svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: _TC.ink }}>{u.l}</div>
                    {other && !cur.uses.includes(k) && <div style={{ fontSize: 11, color: _TC.warn, fontWeight: 700, marginTop: 2 }}>Одоо •••• {other.last4} картад холбоотой</div>}
                  </div>
                  <CdToggle on={cur.uses.includes(k)} onClick={() => toggleUse(cur.id, k)}/>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'flex-start', padding: '12px 14px', borderRadius: 12, background: _TC.field, border: `1px solid ${_TC.line2}` }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="9" stroke={_TC.muted2} strokeWidth="2"/><path d="M12 16v-4M12 8.5h.01" stroke={_TC.muted2} strokeWidth="2" strokeLinecap="round"/></svg>
            <div style={{ fontSize: 11.5, color: _TC.muted, lineHeight: 1.5 }}>Нэг бүтээгдэхүүнд зөвхөн нэг карт холбогдоно. Энэ картад шилжүүлбэл өмнөх картын тохиргоо автоматаар цуцлагдана.</div>
          </div>
        </WebModal>
      )}

      {cur && dlg.type === 'renew' && <CdRenewCardModal card={cur} onClose={() => setDlg(null)} onSave={renewCard}/>}

      {cur && dlg.type === 'delete' && (
        <WebModal open onClose={() => setDlg(null)} title="Картыг устгах уу?" footer={
          <div style={{ display: 'flex', gap: 10 }}>
            <WebButton variant="ghost" full onClick={() => setDlg(null)}>Болих</WebButton>
            <WebButton variant="neg" full onClick={() => delCard(cur.id)}>Устгах</WebButton>
          </div>
        }>
          <CdMiniCard card={cur}/>
          {cur.uses.length > 0 && (
            <div style={{ marginTop: 12, display: 'flex', gap: 9, alignItems: 'flex-start', padding: '12px 14px', borderRadius: 12, background: _TC.warnSoft, border: `1px solid ${_TC.warnBorder}` }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}><path d="M12 4L2.5 20h19L12 4z" stroke={_TC.warn} strokeWidth="2" strokeLinejoin="round"/><path d="M12 10v4M12 17h.01" stroke={_TC.warn} strokeWidth="2" strokeLinecap="round"/></svg>
              <div style={{ fontSize: 12, color: '#7A5410', lineHeight: 1.5, fontWeight: 600 }}>Энэ карт: {cur.uses.map(u => CD_USES[u].l.toLowerCase()).join(', ')}-д ашиглагдаж байна. Устгавал эдгээр автомат төлбөр зогсох тул өөр карт сонгоно уу.</div>
            </div>
          )}
        </WebModal>
      )}
    </div>
  );
};

Object.assign(window, { WalletCardsSection });
