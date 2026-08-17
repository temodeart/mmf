// trade_flow.jsx — MMF Web · F2 · Mobile buy-flow parity, desktop-adapted
// Replaces the legacy order-ticket-in-right-rail model (trade_page.jsx).
// Flow: vertical page → product/offer cards → PRODUCT DETAIL panel
//       (decoded ticker + rate + payout + amount entry w/ live math)
//       → ConfirmOrderModal (R3: grouped rows + PIN) → success.
// Reuses trade_f03 (PrimaryCard, EmptyPrimary, SecondaryTable, IssuerLogo — F-05/06/07/15/16/17)
//   + order_modal (ConfirmOrderModal — R3 + trading-states parity) + comp_kit shell.

const { useState: _uS, useEffect: _uE } = React;
const _T = window.T;
const { WebSidebar, WebTopbar, WebFooter, WebPageHeader, WebDisclaimer, WebButton, WebFilterChips, OrderStatusBadge, WebConfirmDialog } = window;
const { PrimaryCard, EmptyPrimary, SecondaryTable, IssuerLogo } = window;
const { ConfirmOrderModal } = window;

const _mnt  = n => window.formatMNT(n);
const _rate = n => window.formatRate(n);
const BALANCE = 2450000;

/* ══ Per-vertical config + data (СД ₮100,000 · Итгэлцэл ₮1,000,000 Үр шим ·
   Нэхэмжлэх + Арилжааны бичиг → F-05 empty primary; cp → discount-% sell) ══ */
const VCONF = {
  cd: {
    key:'cd', label:'Хадгаламжийн сертификат', pickWord:'сертификат', rateWord:'Хүү',
    product:'сертификат', rateHeadPrimary:'НЭРЛЭСЭН ХҮҮ /ЖИЛИЙН/', color:'#2D6BFF',
    primary:[
      { id:'capit', bank:'Капитрон банк', short:'Капитрон', letters:'КА', color:'#2D6BFF', type:'cd', rate:14.5, unit:100000, termMonths:12, term:360, ticker:'CAPIT 1450 CD 270702', mat:'2027-07-02', avail:95,  total:300, badge:'active', url:'https://capitronbank.mn' },
      { id:'khan',  bank:'Хаан банк',      short:'Хаан',     letters:'ХА', color:'#0B7A3B', type:'cd', rate:14.2, unit:100000, termMonths:12, term:360, ticker:'KHAN 1420 CD 270620', mat:'2027-06-20', avail:260, total:500, badge:'new',    url:'https://khanbank.com' },
      { id:'bogd',  bank:'Богд банк',      short:'Богд',     letters:'БО', color:'#1677FF', type:'cd', rate:13.8, unit:100000, termMonths:6,  term:180, ticker:'BOGD 1380 CD 261228', mat:'2026-12-28', avail:140, total:300, badge:null,     url:'https://bogdbank.com' },
    ],
    secondary:[
      { id:'c1', bank:'Капитрон банк', short:'Капитрон', letters:'КА', color:'#2D6BFF', type:'cd', rate:15.2, unit:100000, left:278, qty:7,  owned:8,  side:'buy', ticker:'CAPIT 1450 CD 270702', termMonths:12, term:360, mat:'2027-07-02', valid:'2026.07.05' },
      { id:'c2', bank:'Богд банк',     short:'Богд',     letters:'БО', color:'#1677FF', type:'cd', rate:14.6, unit:100850, left:168, qty:32, side:'buy',  ticker:'BOGD 1380 CD 261228', termMonths:6,  term:180, mat:'2026-12-28', valid:'2026.07.10' },
      { id:'c3', bank:'Хаан банк',     short:'Хаан',     letters:'ХА', color:'#0B7A3B', type:'cd', rate:14.9, unit:101500, left:250, qty:45, owned:12, side:'buy', ticker:'KHAN 1420 CD 270620', termMonths:12, term:360, mat:'2027-06-20', valid:'2026.07.02' },
    ],
  },
  trust: {
    key:'trust', label:'Итгэлцэл', pickWord:'бүтээгдэхүүн', rateWord:'Үр шим',
    product:'итгэлцлийн бүтээгдэхүүн', rateHeadPrimary:'ЖИЛИЙН ҮР ШИМ', color:'#4F46E5', potential:true,
    primary:[
      { id:'dari',   bank:'Дарь Финанс ББСБ', short:'Дарь Финанс', letters:'ДФ', color:'#4F46E5', type:'trust', rate:23.0, unit:1000000, termMonths:9,  term:270, ticker:'DARI 2300 IT 270227', mat:'2027-02-27', avail:840,  total:1000, badge:'new',    url:'https://darifinance.mn' },
      { id:'anlock', bank:'Анлок ББСБ',       short:'Анлок',       letters:'АН', color:'#0E9F6E', type:'trust', rate:21.0, unit:1000000, termMonths:12, term:365, ticker:'ANLK 2100 IT 270701', mat:'2027-07-01', avail:1500, total:1600, badge:'new',    url:'https://anlock.mn' },
      { id:'micro',  bank:'Микро Кредит ББСБ',short:'Микро Кредит',letters:'МК', color:'#7C3AED', type:'trust', rate:19.5, unit:1000000, termMonths:6,  term:180, ticker:'MCRO 1950 IT 261220', mat:'2026-12-20', avail:430,  total:1500, badge:'active', url:'https://microcredit.mn' },
    ],
    secondary:[
      { id:'t1', bank:'Дарь Финанс ББСБ', short:'Дарь Финанс', letters:'ДФ', color:'#4F46E5', type:'trust', rate:22.4, unit:1018000, left:248, qty:12, owned:4, side:'buy', ticker:'DARI 2300 IT 270227', termMonths:9,  term:270, mat:'2027-02-27', valid:'2026.06.30' },
      { id:'t2', bank:'Анлок ББСБ',       short:'Анлок',       letters:'АН', color:'#0E9F6E', type:'trust', rate:20.6, unit:1012000, left:351, qty:8,  owned:3, side:'buy', ticker:'ANLK 2100 IT 270701', termMonths:12, term:365, mat:'2027-07-01', valid:'2026.07.10' },
      { id:'t3', bank:'Микро Кредит ББСБ',short:'Микро Кредит',letters:'МК', color:'#7C3AED', type:'trust', rate:19.8, unit:1009000, left:162, qty:15, side:'buy',  ticker:'MCRO 1950 IT 261220', termMonths:6,  term:180, mat:'2026-12-20', valid:'2026.06.28' },
    ],
  },
  inv: {
    key:'inv', label:'Нэхэмжлэх', pickWord:'нэхэмжлэх', rateWord:'Үр шим',
    product:'нэхэмжлэх', rateHeadPrimary:'ЖИЛИЙН ҮР ШИМ', color:'#0E9F6E', primaryEmpty:true,
    primary:[],
    secondary:[
      { id:'i1', bank:'Кредитех ББСБ',        short:'Кредитех',    letters:'КР', color:'#0891B2', type:'inv', rate:18.6, unit:503400, left:78, qty:40, owned:10, side:'buy', ticker:'KRDT 2000 IN 261110', termMonths:4, term:120, mat:'2026-11-10', valid:'2026.06.25' },
      { id:'i2', bank:'Тээвэр хөгжлийн банк', short:'Тээвэр хөгжил',letters:'ТХ', color:'#2D6BFF', type:'inv', rate:19.0, unit:501500, left:64, qty:22, side:'buy',  ticker:'TDBM 1900 IN 260921', termMonths:3, term:90,  mat:'2026-09-21', valid:'2026.07.01' },
    ],
  },
  cp: {
    key:'cp', label:'Арилжааны бичиг', pickWord:'бичиг', rateWord:'Үр шим',
    product:'арилжааны бичиг', rateHeadPrimary:'ЖИЛИЙН ҮР ШИМ', color:'#FF6B2C', primaryEmpty:true, sellDiscount:true,
    primary:[],
    secondary:[
      { id:'p1', bank:'Богд банк',     short:'Богд',     letters:'БО', color:'#1677FF', type:'cp', rate:16.5, unit:97800, left:52, qty:120, owned:30, side:'buy', ticker:'BOGD 1650 CP 260815', termMonths:2, term:60, mat:'2026-08-15', valid:'2026.06.24' },
      { id:'p2', bank:'Капитрон банк', short:'Капитрон', letters:'КА', color:'#2D6BFF', type:'cp', rate:15.8, unit:98200, left:44, qty:80,  side:'buy',  ticker:'CAPIT 1580 CP 260808', termMonths:2, term:60, mat:'2026-08-08', valid:'2026.06.22' },
    ],
  },
};
const VORDER = ['cd','trust','inv','cp'];
const _TYPELABEL = { cd:'Сертификат', trust:'Итгэлцэл', inv:'Нэхэмжлэх', cp:'Арилжааны бичиг' };

/* ══ order math — verified: ₮100,000 @ 14.5% · 12 сар → +14,500 −1,450 → 113,050 ══ */
function calcOrder(inst, qty, side, discount) {
  if (!inst || qty <= 0) return { fee:0, total:0, subtotal:0 };
  const nominal = inst.unit;
  const fee = Math.round(nominal * qty * 0.001);
  if (side === 'sell') {
    const salePrice = discount != null ? Math.round(nominal * (1 - discount/100)) : nominal;
    const proceeds  = salePrice * qty;
    return { fee, subtotal:proceeds, salePrice, total: proceeds - fee, sell:true };
  }
  const termYears = (inst.termMonths || inst.term/30) / 12;
  const interest  = Math.round(nominal * (inst.rate/100) * termYears) * qty;
  const tax       = Math.round(interest * 0.10);
  const netYield  = interest - tax;
  const subtotal  = nominal * qty;
  const realYield = subtotal > 0 ? (netYield / subtotal) * (360 / (inst.term || 360)) * 100 : 0;
  return { fee, subtotal, total: subtotal + fee, interest, tax, netYield, payout: subtotal + netYield, realYield };
}

/* ══ ticker decode — "CAPIT 1450 CD 270702" → labelled anatomy ══ */
function decodeTicker(ticker) {
  const parts = String(ticker || '').trim().split(/\s+/);
  const labels = ['Гаргагчийн код', 'Хүүгийн код', 'Төрлийн код', 'Дуусах огноо'];
  return parts.map((p, i) => {
    let val = p;
    if (i === parts.length - 1 && /^\d{6}$/.test(p)) val = `20${p.slice(0,2)}.${p.slice(2,4)}.${p.slice(4,6)}`;
    return { label: labels[i] || `Хэсэг ${i+1}`, value: val };
  });
}

/* ══ Secondary offer card — mobile-style default presentation ══ */
const OfferCard = ({ o, onPick }) => {
  const tc = VCONF[o.type] ? VCONF[o.type].color : _T.indigo;
  const isBuy = (o.side || 'buy') === 'buy';
  return (
    <button onClick={() => onPick(o)} className="offer-card" style={{
      textAlign:'left', display:'flex', flexDirection:'column', gap:14, padding:16, minWidth:0,
      background:_T.surface, border:`1px solid ${_T.line2}`, borderRadius:18, cursor:'pointer', fontFamily:'inherit',
    }}>
      <div style={{ display:'flex', alignItems:'flex-start', gap:12, minWidth:0 }}>
        <IssuerLogo letters={o.letters} color={o.color} size={42}/>
        <div style={{ flex:1, minWidth:0 }}>
          <div className="truncate" style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:_T.ink }}>{o.ticker.replace(/\s+/g,'-')}</div>
          <div className="truncate" style={{ fontSize:11.5, color:_T.muted, fontWeight:600, marginTop:3 }}>{o.short} · {_TYPELABEL[o.type]}</div>
        </div>
        <span style={{ fontSize:10.5, fontWeight:700, color:_T.warn, background:_T.warnSoft, padding:'3px 9px', borderRadius:99, whiteSpace:'nowrap', flexShrink:0 }}>Зарах санал</span>
      </div>
      <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:30, fontWeight:700, color:_T.ink, letterSpacing:'-0.02em', lineHeight:1 }}>{o.rate.toFixed(1)}<span style={{ fontSize:17, color:_T.pos }}>%</span></span>
        <span style={{ fontSize:12, fontWeight:700, color:_T.muted }}>жилийн бодит өгөөж</span>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,minmax(0,1fr))', gap:10, borderTop:`1px solid ${_T.line2}`, paddingTop:12 }}>
        {[['Үнэ', _mnt(o.unit)], ['Үлдсэн', `${o.left} хоног`], ['Боломжит', `${o.qty} ш`]].map(([k,v]) => (
          <div key={k} style={{ minWidth:0 }}>
            <div style={{ fontSize:10.5, color:_T.muted, fontWeight:600 }}>{k}</div>
            <div className="num truncate" style={{ fontSize:12.5, fontWeight:700, color:_T.ink, marginTop:3, fontFamily:"'JetBrains Mono',monospace" }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ display:'inline-flex', alignSelf:'flex-start', alignItems:'center', gap:6, height:36, padding:'0 16px', borderRadius:11, background:_T.pos, color:'#fff', fontSize:13, fontWeight:800 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 19V5M6 11l6-6 6 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Авах
      </div>
    </button>
  );
};

/* ══ PRODUCT DETAIL panel — decoded ticker + rate + payout + amount entry ══ */
const _dRow = ({ l, v, tone, big }) => (
  <div key={l} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, padding:big?'11px 0':'8px 0', borderBottom:`1px solid ${_T.line2}` }}>
    <span style={{ fontSize:big?14:12.5, fontWeight:big?800:600, color:big?_T.ink:_T.muted, whiteSpace:'nowrap' }}>{l}</span>
    <span className="num" style={{ fontSize:big?15:13, fontWeight:big?800:700, color:tone||_T.ink, fontFamily:"'JetBrains Mono',monospace", textAlign:'right' }}>{v}</span>
  </div>
);

const DetailPanel = ({ sel, onClose, onContinue }) => {
  const inst = sel ? sel.inst : null;
  const source = sel ? sel.source : null;
  const [qty, setQty]   = _uS(1);
  const [disc, setDisc] = _uS(2);
  const [reinv, setReinv] = _uS(false);
  _uE(() => { setQty(1); setDisc(2); setReinv(false); }, [sel && sel.inst && sel.inst.id]);
  if (!inst) return null;

  const conf = VCONF[inst.type] || VCONF.cd;
  const side = sel.side || 'buy';
  const discountMode = conf.sellDiscount && side === 'sell';
  const calc = calcOrder(inst, qty, side, discountMode ? disc : null);
  const maxQty = side === 'buy' ? Math.min(inst.avail || inst.qty || 9999, 9999) : (inst.owned || 0);
  const unit1  = calcOrder(inst, 1, 'buy', null);   // payout for a single unit
  const anatomy = decodeTicker(inst.ticker);
  const insufficient = side === 'buy' && calc.total > BALANCE && qty > 0;
  const heroLabel = source === 'secondary' ? 'ЖИЛИЙН БОДИТ ӨГӨӨЖ' : conf.rateHeadPrimary;

  return (
    <div className="detail-scrim" onClick={onClose} style={{ position:'fixed', inset:0, zIndex:60, background:'rgba(5,11,31,.4)', display:'flex', justifyContent:'flex-end' }}>
      <div className="detail-panel" onClick={e => e.stopPropagation()} style={{
        width:'min(468px, 94vw)', height:'100%', background:_T.bg, boxShadow:'-24px 0 60px -24px rgba(15,20,55,.4)',
        display:'flex', flexDirection:'column', minWidth:0,
      }}>
        {/* header */}
        <div style={{ flexShrink:0, height:64, display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, padding:'0 20px', background:_T.surface, borderBottom:`1px solid ${_T.line}` }}>
          <div style={{ minWidth:0 }}>
            <div className="truncate" style={{ fontSize:15, fontWeight:800, color:_T.ink, letterSpacing:'-0.01em' }}>{inst.bank}</div>
            <div className="truncate" style={{ fontSize:11, fontWeight:600, color:_T.muted2, fontFamily:"'JetBrains Mono',monospace", marginTop:2 }}>{source==='secondary'?'Хоёрдогч зах зээл':'Анхдагч зах зээл'}</div>
          </div>
          <button onClick={onClose} aria-label="Хаах" style={{ width:38, height:38, borderRadius:11, border:`1px solid ${_T.line}`, background:_T.surface, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke={_T.ink} strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* scroll body */}
        <div style={{ flex:1, overflowY:'auto', minHeight:0, padding:'20px', display:'flex', flexDirection:'column', gap:16 }}>
          {/* issuer + badges */}
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <IssuerLogo letters={inst.letters} color={inst.color} size={46}/>
            <div style={{ flex:1, minWidth:0 }}>
              <div className="truncate" style={{ fontSize:14, fontWeight:700, color:_T.ink }}>{inst.bank}</div>
              <div style={{ display:'flex', gap:6, marginTop:6, flexWrap:'wrap' }}>
                <span style={{ fontSize:10.5, fontWeight:700, color:conf.color, background:`${conf.color}14`, padding:'2px 8px', borderRadius:99 }}>{_TYPELABEL[inst.type]}</span>
                <span style={{ fontSize:10.5, fontWeight:700, color:_T.indigo, background:_T.indigoSoft, padding:'2px 8px', borderRadius:99 }}>{source==='secondary'?'Хоёрдогч зах':'Анхдагч зах'}</span>
              </div>
            </div>
          </div>

          {/* hero — big rate. flexShrink:0 is required: overflow:hidden zeroes the
              flex item's automatic minimum size, so the column would squash it. */}
          <div style={{ borderRadius:20, padding:20, flexShrink:0, background:`linear-gradient(135deg, ${_T.navy} 0%, ${_T.indigo} 135%)`, color:'#fff', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', right:-30, bottom:-50, width:160, height:160, borderRadius:'50%', background:'radial-gradient(circle, rgba(45,107,255,.45), transparent 70%)' }}/>
            <div style={{ position:'relative' }}>
              <div style={{ fontSize:10.5, opacity:.72, fontWeight:700, letterSpacing:'0.06em' }}>{heroLabel}</div>
              <div style={{ display:'flex', alignItems:'baseline', gap:6, marginTop:6 }}>
                <span className="num" style={{ fontSize:44, fontWeight:800, letterSpacing:'-0.03em', fontFamily:"'JetBrains Mono',monospace" }}>{inst.rate.toFixed(1)}</span>
                <span style={{ fontSize:17, opacity:.8 }}>% / жил</span>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginTop:18 }}>
                {[[source==='secondary'?'Худалдан авах үнэ':'Нэрлэсэн үнэ', _mnt(inst.unit)],
                  [source==='secondary'?'Үлдсэн хугацаа':'Хугацаа', source==='secondary'?`${inst.left} хоног`:`${inst.termMonths} сар`],
                  ['Боломжит', `${(inst.avail||inst.qty||0).toLocaleString('en-US')} ш`]].map(([k,v],i) => (
                  <div key={i}>
                    <div style={{ fontSize:9.5, opacity:.6, fontWeight:600 }}>{k}</div>
                    <div className="num" style={{ fontSize:12.5, fontWeight:700, marginTop:3, fontFamily:"'JetBrains Mono',monospace" }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* decoded ticker anatomy */}
          <div style={{ background:_T.surface, border:`1px solid ${_T.line2}`, borderRadius:16, padding:16 }}>
            <div style={{ fontSize:10.5, fontWeight:700, letterSpacing:'.12em', color:_T.muted2, textTransform:'uppercase', marginBottom:12 }}>Тикерийн задаргаа</div>
            <div style={{ display:'flex', alignItems:'stretch', gap:8, flexWrap:'wrap' }}>
              {anatomy.map((a,i) => (
                <div key={i} style={{ flex:'1 1 92px', minWidth:0, background:_T.field, border:`1px solid ${_T.line2}`, borderRadius:11, padding:'10px 12px' }}>
                  <div style={{ fontSize:9.5, color:_T.muted, fontWeight:600 }}>{a.label}</div>
                  <div className="num truncate" style={{ fontSize:13, fontWeight:800, color:_T.ink, marginTop:3, fontFamily:"'JetBrains Mono',monospace" }} title={a.value}>{a.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* key info */}
          <div style={{ background:_T.surface, border:`1px solid ${_T.line2}`, borderRadius:16, padding:'6px 16px 12px' }}>
            <div style={{ fontSize:10.5, fontWeight:700, letterSpacing:'.12em', color:_T.muted2, textTransform:'uppercase', margin:'12px 0 6px' }}>Бүтээгдэхүүний нөхцөл</div>
            {[
              ['Тикер', inst.ticker],
              ['Нэрлэсэн үнэ', _mnt(inst.unit)],
              [conf.rateWord + ' /жилийн/', _rate(inst.rate)],
              ['Хүү төлөх давтамж', 'Хугацааны эцэст'],
              ['Хугацаа', source==='secondary' ? `${inst.left} хоног` : `${inst.termMonths} сар`],
              ['Төлөгдөх огноо', window.formatDate(inst.mat)],
              ['Боломжит ширхэг', `${(inst.avail||inst.qty||0).toLocaleString('en-US')} ширхэг`],
            ].map(([l,v]) => _dRow({ l, v }))}
            <a className="ext-link" href={inst.url || '#'} target="_blank" rel="noopener noreferrer" style={{ marginTop:12, fontSize:12, display:'inline-flex' }}>
              Гаргагчийн тухай
              <svg className="ext-link__icon" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          </div>

          {/* payout for one unit */}
          <div style={{ background:_T.posSoft, border:`1px solid ${_T.posBorder}`, borderRadius:16, padding:'6px 16px 12px' }}>
            <div style={{ fontSize:10.5, fontWeight:700, letterSpacing:'.12em', color:_T.pos, textTransform:'uppercase', margin:'12px 0 6px' }}>1 ширхэгийн өгөөж</div>
            {_dRow({ l:'Бодогдох хүү', v:'+'+_mnt(unit1.interest), tone:_T.pos })}
            {_dRow({ l:'Татвар (10%)', v:'−'+_mnt(unit1.tax) })}
            {_dRow({ l:'Хугацааны эцэст төлөгдөх дүн', v:_mnt(unit1.payout), big:true })}
            {_dRow({ l:'Бодит өгөөж', v:unit1.realYield.toFixed(2)+'%', tone:_T.indigo })}
          </div>

          {/* amount / quantity entry */}
          <div style={{ background:_T.surface, border:`1px solid ${_T.line2}`, borderRadius:16, padding:16 }}>
            <div style={{ fontSize:12, fontWeight:700, color:_T.text, marginBottom:8, display:'flex', justifyContent:'space-between' }}>
              <span>Тоо ширхэг</span><span style={{ color:_T.muted, fontWeight:600 }}>боломжит: {maxQty}</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', border:`1.5px solid ${_T.line}`, borderRadius:13, background:_T.field, overflow:'hidden' }}>
              <button onClick={() => setQty(q => Math.max(1, q-1))} style={{ width:48, height:50, border:'none', background:'transparent', fontSize:20, fontWeight:700, color:_T.muted, cursor:'pointer', flexShrink:0, fontFamily:'inherit' }}>−</button>
              <input type="number" value={qty} onChange={e => setQty(Math.max(1, parseInt(e.target.value||'1',10)))} style={{ flex:1, minWidth:0, border:'none', background:'transparent', textAlign:'center', fontFamily:"'JetBrains Mono',monospace", fontSize:18, fontWeight:700, color:_T.ink, outline:'none' }}/>
              <button onClick={() => setQty(q => q+1)} style={{ width:48, height:50, border:'none', background:'transparent', fontSize:20, fontWeight:700, color:_T.muted, cursor:'pointer', flexShrink:0, fontFamily:'inherit' }}>+</button>
            </div>
            <div style={{ display:'flex', gap:7, marginTop:10 }}>
              {[1,5,10,'max'].map(q => <button key={q} onClick={() => setQty(q==='max'?Math.max(1,maxQty):q)} style={{ flex:1, height:32, borderRadius:9, border:`1px solid ${_T.line}`, background:_T.surface, fontSize:11.5, fontWeight:700, color:_T.muted, cursor:'pointer', fontFamily:'inherit' }}>{q==='max'?'Бүгд':q}</button>)}
            </div>

            {discountMode && (
              <div style={{ marginTop:14 }}>
                <div style={{ fontSize:12, fontWeight:700, color:_T.text, marginBottom:8 }}>Хямдруулалтын хувь</div>
                <div style={{ display:'flex', alignItems:'center', border:`1.5px solid ${_T.line}`, borderRadius:13, background:_T.field, padding:'0 8px 0 16px' }}>
                  <input type="number" value={disc} min={0} max={20} step={0.5} onChange={e => setDisc(Math.max(0, Math.min(20, parseFloat(e.target.value||'0'))))} style={{ flex:1, minWidth:0, height:48, border:'none', background:'transparent', fontFamily:"'JetBrains Mono',monospace", fontSize:17, fontWeight:700, color:_T.ink, outline:'none' }}/>
                  <span style={{ fontSize:16, fontWeight:800, color:_T.muted, paddingRight:8 }}>%</span>
                </div>
              </div>
            )}

            {/* live preview */}
            <div style={{ marginTop:14, borderTop:`1px solid ${_T.line2}`, paddingTop:10 }}>
              {side === 'sell' ? (
                <>
                  {_dRow({ l:'Борлуулах үнэ', v:_mnt(calc.salePrice||inst.unit) })}
                  {_dRow({ l:'Шимтгэл (0.1%)', v:_mnt(calc.fee) })}
                  {_dRow({ l:'Орох дүн', v:_mnt(calc.total), big:true, tone:_T.ink })}
                </>
              ) : (
                <>
                  {_dRow({ l:'Бодогдох хүү', v:'+'+_mnt(calc.interest), tone:_T.pos })}
                  {_dRow({ l:'Татвар (10%)', v:'−'+_mnt(calc.tax) })}
                  {_dRow({ l:'Хугацааны эцэст төлөгдөх дүн', v:_mnt(calc.payout) })}
                  {_dRow({ l:'Бодит өгөөж', v:calc.realYield.toFixed(2)+'%', tone:_T.indigo })}
                  {_dRow({ l:'Нийт төлбөр', v:_mnt(calc.total), big:true })}
                </>
              )}
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'11px 13px', borderRadius:11, marginTop:12, background:insufficient?_T.negSoft:_T.indigoSoft }}>
              <span style={{ fontSize:12, fontWeight:700, color:insufficient?_T.neg:_T.indigo }}>{insufficient?'Дутагдаж буй дүн':'Боломжит үлдэгдэл'}</span>
              <span className="num" style={{ fontSize:13, fontWeight:800, color:insufficient?_T.neg:_T.indigo, fontFamily:"'JetBrains Mono',monospace" }}>{insufficient?_mnt(calc.total-BALANCE):_mnt(BALANCE)}</span>
            </div>
          </div>

          {/* auto-renew loop — primary market buys only */}
          {source === 'primary' && side === 'buy' && (
            <div style={{ background:_T.surface, border:`${reinv ? 2 : 1}px solid ${reinv ? _T.indigo : _T.line2}`, borderRadius:16, padding:16 }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:13 }}>
                <div style={{ width:38, height:38, borderRadius:11, background: reinv ? _T.indigoSoft : _T.field, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M4 12a8 8 0 0113.7-5.6M20 12a8 8 0 01-13.7 5.6" stroke={reinv ? _T.indigo : _T.muted} strokeWidth="2" strokeLinecap="round"/><path d="M18 3v4h-4M6 21v-4h4" stroke={reinv ? _T.indigo : _T.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13.5, fontWeight:800, color:_T.ink, letterSpacing:'-0.01em' }}>Хугацаа дуусахад дахин автоматаар авах</div>
                  <div style={{ fontSize:11.5, color:_T.muted, marginTop:4, lineHeight:1.55 }}>Үндсэн дүн ижил бүтээгдэхүүнд дахин хөрөнгө оруулагдаж, зөвхөн хүү хэтэвчид орно.</div>
                </div>
                <button onClick={() => setReinv(v => !v)} role="switch" aria-checked={reinv} aria-label="Дахин автоматаар авах" style={{ width:46, height:28, borderRadius:999, border:'none', cursor:'pointer', background: reinv ? _T.indigo : '#D9DCE7', position:'relative', flexShrink:0, transition:'background .2s' }}>
                  <span style={{ position:'absolute', top:3, left:3, width:22, height:22, borderRadius:999, background:'#fff', boxShadow:'0 2px 6px rgba(0,0,0,.2)', transform: reinv ? 'translateX(18px)' : 'none', transition:'transform .2s', pointerEvents:'none' }}/>
                </button>
              </div>
              {reinv ? (
                <div style={{ marginTop:12, padding:'12px 14px', borderRadius:12, background:_T.indigoSoft, display:'flex', flexDirection:'column', gap:7 }}>
                  {[['Үндсэн дүн', 'Дахин авна → ' + inst.ticker], ['Бодогдсон хүү', '+' + _mnt(calc.netYield != null ? calc.netYield : (calc.interest || 0) - (calc.tax || 0)) + ' → Хэтэвч'], ['Давталт', 'Та зогсоох хүртэл']].map(([l, v]) => (
                    <div key={l} style={{ display:'flex', justifyContent:'space-between', gap:12 }}>
                      <span style={{ fontSize:11.5, color:_T.muted, fontWeight:600, flexShrink:0 }}>{l}</span>
                      <span className="num truncate" style={{ fontSize:11.5, fontWeight:700, color:_T.ink, textAlign:'right', fontFamily:"'JetBrains Mono',monospace" }}>{v}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize:11, color:_T.muted2, marginTop:10, lineHeight:1.5, fontWeight:600 }}>Асаагаагүй тохиолдолд төлөгдөх нийт дүн хэтэвчид орно.</div>
              )}
            </div>
          )}

          {/* risk note */}
          <div style={{ background:_T.warnSurface, borderRadius:14, padding:14, border:`1px solid ${_T.warnBorder}`, display:'flex', gap:10 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:1 }}><path d="M12 8v5M12 17h.01" stroke={_T.warn} strokeWidth="2.4" strokeLinecap="round"/><circle cx="12" cy="12" r="9" stroke={_T.warn} strokeWidth="2" fill="none"/></svg>
            <div style={{ fontSize:12, color:'#7A5A1F', lineHeight:1.5 }}>Өгөөж нь зах зээлийн нөхцөл болон бүтээгдэхүүний нөхцөлөөс хамааран өөрчлөгдөж болно.</div>
          </div>
        </div>

        {/* sticky footer CTA */}
        <div style={{ flexShrink:0, padding:'14px 20px', background:_T.surface, borderTop:`1px solid ${_T.line2}` }}>
          <WebButton variant={side==='buy'?'pos':'neg'} full disabled={qty<=0} onClick={() => onContinue({ inst, side, qty, discount: discountMode?disc:null, calc, reinvest: source === 'primary' && side === 'buy' && reinv })}>
            {side==='buy'?'Үргэлжлүүлэх':'Зарах захиалга үргэлжлүүлэх'}
          </WebButton>
        </div>
      </div>
    </div>
  );
};

/* ══ Secondary-market sort — same two options as the mobile app.
   ONE source of truth ({ by, dir }) shared by the card grid, the Эрэмбэлэх menu
   and SecondaryTable's column headers, so the two views never disagree. ══ */
const SEC_SORTS = [
  { k:'term',  l:'Төлөгдөх хугацаа', d:'Богиноос → урт', by:'left', dir:'asc'  },
  { k:'yield', l:'Бодит өгөөж',      d:'Өндөр → бага',   by:'rate', dir:'desc' },
];
const SEC_COL_LABEL = { unit:'Нэгж үнэ', left:'Төлөгдөх хугацаа', rate:'Бодит өгөөж' };
const secSortKey = s => { const o = SEC_SORTS.find(x => x.by === s.by && x.dir === s.dir); return o ? o.k : null; };
const secSortLabel = s => {
  const o = SEC_SORTS.find(x => x.by === s.by && x.dir === s.dir);
  return o ? o.l : (SEC_COL_LABEL[s.by] || 'Эрэмбэлэх') + (s.dir === 'asc' ? ' ↑' : ' ↓');
};
const sortSecondary = (arr, s) => [...arr].sort((x, y) => ((x[s.by] || 0) - (y[s.by] || 0)) * (s.dir === 'asc' ? 1 : -1));
const SecSortMenu = ({ sort, onPick }) => {
  const active = secSortKey(sort);
  const [open, setOpen] = _uS(false);
  const ref = React.useRef(null);
  _uE(() => {
    if (!open) return;
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);
  return (
    <div ref={ref} style={{ position:'relative' }}>
      <button onClick={() => setOpen(o => !o)} aria-haspopup="listbox" aria-expanded={open} style={{ display:'inline-flex', alignItems:'center', gap:7, height:40, padding:'0 13px', borderRadius:11, border:`1px solid ${_T.line}`, background:_T.surface, color:_T.ink, fontSize:12.5, fontWeight:700, cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap' }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M7 19V5M7 5L4 8M7 5l3 3M17 5v14M17 19l3-3M17 19l-3-3" stroke={_T.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        {secSortLabel(sort)}
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ transform: open ? 'rotate(180deg)' : 'none' }}><path d="M6 9l6 6 6-6" stroke={_T.muted} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      {open && (
        <div role="listbox" style={{ position:'absolute', right:0, top:46, zIndex:20, minWidth:236, background:_T.surface, border:`1px solid ${_T.line}`, borderRadius:14, boxShadow:'0 18px 40px -16px rgba(15,20,55,.34)', overflow:'hidden' }}>
          <div style={{ padding:'11px 15px 7px', fontSize:10.5, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:_T.muted2 }}>Эрэмбэлэх</div>
          {SEC_SORTS.map(o => {
            const sel = o.k === active;
            return (
              <button key={o.k} role="option" aria-selected={sel} onClick={() => { onPick({ by:o.by, dir:o.dir }); setOpen(false); }} style={{ width:'100%', textAlign:'left', display:'flex', alignItems:'center', gap:12, padding:'11px 15px', border:'none', background: sel ? _T.indigoSoft : 'transparent', cursor:'pointer', fontFamily:'inherit' }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, color: sel ? _T.indigo : _T.ink }}>{o.l}</div>
                  <div style={{ fontSize:11.5, color:_T.muted, marginTop:2 }}>{o.d}</div>
                </div>
                <span style={{ width:20, height:20, borderRadius:999, flexShrink:0, border:`2px solid ${sel ? _T.indigo : _T.line}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {sel && <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke={_T.indigo} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ══ Section header ══ */
const SectionHead = ({ label, count, intro, right }) => (
  <div style={{ marginBottom:16, display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>
    <div style={{ minWidth:0 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <h2 style={{ fontSize:18, fontWeight:800, color:_T.ink, letterSpacing:'-0.02em', margin:0 }}>{label}</h2>
        {count != null && <span className="num" style={{ fontSize:11.5, fontWeight:700, color:_T.indigo, background:_T.indigoSoft, padding:'2px 9px', borderRadius:99, fontFamily:"'JetBrains Mono',monospace" }}>{count}</span>}
      </div>
      {intro && <p style={{ fontSize:13, fontWeight:500, color:_T.muted, margin:'7px 0 0', lineHeight:1.5, maxWidth:640 }}>{intro}</p>}
    </div>
    {right}
  </div>
);

/* ══ Trade screen ══ */
/* All four product families live on ONE screen — type is a filter, not a route. */
const ALL_PRIMARY   = VORDER.flatMap(k => VCONF[k].primary);
const ALL_SECONDARY = VORDER.flatMap(k => VCONF[k].secondary);
const TYPE_CHIPS = [
  { value:'all', label:'Бүгд' },
  ...VORDER.map(k => ({ value:k, label:VCONF[k].label, color:VCONF[k].color })),
];

function TradeScreen() {
  const urlV = (() => { try { const v = new URLSearchParams(location.search).get('v'); return VORDER.includes(v) ? v : 'all'; } catch(e){ return 'all'; } })();
  const [vert, setVert] = _uS(urlV);
  const [sel, setSel]   = _uS(null);              // detail panel: { inst, source, side }
  const [order, setOrder] = _uS(null);            // confirm modal payload
  const [open, setOpen] = _uS(false);
  const [secView, setSecView] = _uS('cards');     // cards | table
  const [secSort, setSecSort] = _uS({ by:'rate', dir:'desc' }); // shared by cards + table
  const [search, setSearch] = _uS('');
  // F3 · sell listings created from a holding (Dashboard) show up here too —
  // same localStorage store, same status badges, cancel-from-either-surface.
  const [myListings, setMyListings] = _uS(() => (window.MMFListings ? window.MMFListings.all() : []));
  const [cancelTarget, setCancelTarget] = _uS(null);

  const conf = vert === 'all' ? null : VCONF[vert];
  const switchVert = v => { setVert(v); setSel(null); setOpen(false); setSecView('cards'); try { history.replaceState(null,'', v==='all' ? location.pathname : `?v=${v}`); } catch(e){} };

  const myActive = myListings.filter(l => (vert==='all' || l.type===vert) && (l.status==='new'||l.status==='active'||l.status==='pending'));
  const confirmCancelListing = () => {
    if (!cancelTarget) return;
    if (window.MMFListings) window.MMFListings.setStatus(cancelTarget.id, 'cancelled');
    setMyListings(window.MMFListings ? window.MMFListings.all() : []);
    setCancelTarget(null);
  };

  const q = search.trim().toLowerCase();
  const match = x => !q || x.ticker.toLowerCase().includes(q) || x.bank.toLowerCase().includes(q) || x.short.toLowerCase().includes(q);
  const inType = x => vert === 'all' || x.type === vert;
  const primaryAll   = ALL_PRIMARY.filter(inType);
  const secondaryAll = ALL_SECONDARY.filter(inType);
  const primary   = primaryAll.filter(match);
  const secondary = secondaryAll.filter(match);

  const pickPrimary   = data => setSel({ inst:data, source:'primary',   side:'buy' });
  const pickSecondary = row  => setSel({ inst:row,  source:'secondary', side: row.side || 'buy' });

  const onContinue = payload => { setOrder(payload); setOpen(true); };
  const closeModal = () => { setOpen(false); setOrder(null); setSel(null); };

  const modalInst = order && order.side === 'sell' && order.calc.salePrice != null ? { ...order.inst, unit: order.calc.salePrice } : (order ? order.inst : null);

  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>
      <a href="#mmf-main" className="skip-link">Үндсэн хэсэг рүү очих</a>

      <WebSidebar activePath="/trade"/>

      <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column' }}>
        <WebTopbar title="Арилжаа" notifCount={2}/>
        <main id="mmf-main" tabIndex={-1} style={{ flex:1, minWidth:0, padding:'30px 36px 40px', outline:'none' }}>
          <WebPageHeader title="Арилжаа" subtitle="Бүх бүтээгдэхүүн нэг дор — анхдагч ба хоёрдогч зах зээл"/>

          {window.AiwPromoBanner && React.createElement(window.AiwPromoBanner)}

          {/* F-17 · search */}
          <div style={{ position:'relative', maxWidth:440, marginBottom:16 }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)' }}><circle cx="11" cy="11" r="7" stroke={_T.muted2} strokeWidth="1.9"/><path d="M20 20l-3.5-3.5" stroke={_T.muted2} strokeWidth="1.9" strokeLinecap="round"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Тикер эсвэл гаргагчаар хайх…"
              style={{ width:'100%', height:44, borderRadius:12, border:`1.5px solid ${_T.line}`, background:_T.surface, padding:'0 38px', fontFamily:'inherit', fontSize:13.5, fontWeight:500, color:_T.ink, outline:'none' }}/>
            {search && (
              <button onClick={() => setSearch('')} aria-label="Хайлт цэвэрлэх" style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', width:26, height:26, borderRadius:8, border:'none', background:_T.line2, color:_T.muted, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            )}
          </div>

          {/* product-type filter — mirrors the mobile trade screen's chips */}
          <div style={{ marginBottom:28 }}>
            <WebFilterChips value={vert} onChange={switchVert}
              options={TYPE_CHIPS.map(c => ({ ...c, label: c.value==='all' ? `${c.label} · ${ALL_PRIMARY.length + ALL_SECONDARY.length}` : `${c.label} · ${VCONF[c.value].primary.length + VCONF[c.value].secondary.length}` }))}/>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:38, minWidth:0 }}>
            {/* Анхдагч зах зээл */}
            <section style={{ minWidth:0 }}>
              <SectionHead label="Анхдагч зах зээл" count={primaryAll.length === 0 ? null : primary.length}
                intro={`Банк, ББСБ-аас шинээр гаргасан ${conf ? conf.product : 'бүтээгдэхүүн'}-ыг нэрлэсэн үнээр худалдаж авна.`}/>
              {primaryAll.length === 0 ? (
                <EmptyPrimary vertical={conf ? conf.key : 'cd'}/>
              ) : primary.length === 0 ? (
                <div style={{ padding:'32px', textAlign:'center', color:_T.muted, fontSize:13, fontWeight:600, background:_T.surface, border:`1px solid ${_T.line2}`, borderRadius:16 }}>Хайлтад тохирох бүтээгдэхүүн олдсонгүй</div>
              ) : (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(288px,1fr))', gap:16 }}>
                  {primary.map(p => <PrimaryCard key={p.id} data={p} onBuy={() => pickPrimary(p)}/>)}
                </div>
              )}
            </section>

            {/* Хоёрдогч зах зээл — default mobile-style cards + Хүснэгтээр toggle (F-03) */}
            <section style={{ minWidth:0 }}>
              <SectionHead label="Хоёрдогч зах зээл" count={secondary.length}
                intro={`Бусад хэрэглэгчдийн санал болгож буй ${conf ? conf.product : 'бүтээгдэхүүн'}-ыг худалдаж авах.`}
                right={
                  <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
                    <SecSortMenu sort={secSort} onPick={setSecSort}/>
                    <div style={{ display:'flex', gap:6, background:_T.field, border:`1px solid ${_T.line}`, borderRadius:11, padding:4 }}>
                      {[['cards','Картаар'],['table','Хүснэгтээр']].map(([k,l]) => (
                        <button key={k} onClick={() => setSecView(k)} style={{ height:32, padding:'0 13px', borderRadius:8, border:'none', background:secView===k?_T.surface:'transparent', color:secView===k?_T.ink:_T.muted, fontSize:12.5, fontWeight:700, cursor:'pointer', fontFamily:'inherit', boxShadow:secView===k?'0 1px 3px rgba(15,20,55,.12)':'none' }}>{l}</button>
                      ))}
                    </div>
                  </div>
                }/>
              {myActive.length > 0 && (
                <div style={{ marginBottom:16, background:_T.indigoSoft, border:`1px solid ${_T.indigoBorder}`, borderRadius:16, overflow:'hidden' }}>
                  <div style={{ padding:'12px 16px', fontSize:12, fontWeight:800, color:_T.indigo, letterSpacing:'-0.01em' }}>{vert==='all' ? 'Миний зарах захиалга' : 'Миний зарах захиалга — энэ бүтээгдэхүүний төрөлдө'}</div>
                  <div style={{ background:_T.surface }}>
                    {myActive.map(l => (
                      <div key={l.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderTop:`1px solid ${_T.line2}` }}>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div className="truncate" style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12.5, fontWeight:700, color:_T.ink }}>{l.ticker.replace(/\s+/g,'-')}</div>
                          <div className="truncate" style={{ fontSize:11, color:_T.muted, fontWeight:600, marginTop:2 }}>{l.bank} · {l.qty} ширхэг · {_mnt(l.total)}</div>
                        </div>
                        <OrderStatusBadge status={l.status}/>
                        <button onClick={() => setCancelTarget(l)} style={{ height:32, padding:'0 12px', borderRadius:9, border:`1px solid ${_T.line}`, background:_T.surface, color:_T.neg, fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap', flexShrink:0 }}>Цуцлах</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {secView === 'table' ? (
                <SecondaryTable rows={secondary} onAct={pickSecondary}
                  sortBy={secSort.by} sortDir={secSort.dir} onSortChange={setSecSort}/>
              ) : secondary.length === 0 ? (
                <div style={{ padding:'32px', textAlign:'center', color:_T.muted, fontSize:13, fontWeight:600, background:_T.surface, border:`1px solid ${_T.line2}`, borderRadius:16 }}>Хайлтад тохирох санал олдсонгүй</div>
              ) : (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
                  {sortSecondary(secondary, secSort).map(o => <OfferCard key={o.id} o={o} onPick={pickSecondary}/>)}
                </div>
              )}
            </section>

            <WebDisclaimer>Өгөөж нь зах зээлийн нөхцөл болон бүтээгдэхүүний нөхцөлөөс хамааран өөрчлөгдөж болно. Энэ нь баталгаат өгөөж биш болохыг анхаарна уу.</WebDisclaimer>
          </div>
        </main>
        <WebFooter/>
      </div>

      {/* PRODUCT DETAIL panel */}
      {sel && <DetailPanel sel={sel} onClose={() => setSel(null)} onContinue={onContinue}/>}

      {/* R3 confirm modal — grouped rows + PIN + trading-states parity */}
      <ConfirmOrderModal
        open={open} onClose={closeModal}
        instrument={modalInst} qty={order?order.qty:0} side={order?order.side:'buy'} calc={order?order.calc:{}} reinvest={!!(order && order.reinvest)}
        balance={BALANCE} onTopup={() => { window.location.href = '06 Wallet.html'; }} onConfirmed={() => {}}/>

      {/* F3 · cancel-listing confirm (shared component, same copy as Dashboard) */}
      <WebConfirmDialog
        open={!!cancelTarget}
        title="Захиалга цуцлах уу?"
        body={cancelTarget ? (cancelTarget.ticker.replace(/\s+/g,'-') + ' — зарах захиалгыг цуцлана уу? Бүтээгдэхүүн багцад дахин "Идэвхтэй" төлөвөөр харагдана.') : ''}
        confirmLabel="Тийм, цуцлах" cancelLabel="Болих" tone="neg"
        onConfirm={confirmCancelListing} onCancel={() => setCancelTarget(null)}/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<TradeScreen/>);
