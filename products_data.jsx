// products_data.jsx — MMF Web · Миний бүтээгдэхүүн (owned products)
// Holdings dataset + type palette + payout/sell math + the holding card & row.
// Loaded before products_page.jsx. Exports to window (babel scopes don't share).

const PT = { cd:{c1:'#2D6BFF',c2:'#4F46E5'}, trust:{c1:'#4F46E5',c2:'#7C3AED'}, inv:{c1:'#0E9F6E',c2:'#0891B2'}, cp:{c1:'#FF6B2C',c2:'#DC2626'} };
const PTL = { cd:'Хадгаламжийн сертификат', trust:'Итгэлцэл', inv:'Нэхэмжлэх', cp:'Арилжааны бичиг' };
const PTS = { cd:'ХС', trust:'ИТ', inv:'НЭ', cp:'АБ' };
const PMONO = "'JetBrains Mono',monospace";
const P_SELL_DISCOUNT = { cp:true };

/* 11 holdings — enough breadth that filtering is a real task, not a demo.
   status: '' active · 'soon' maturing ≤30d · 'onsale' has a live sell order */
const PHOLDINGS = [
  { id:'h1',  issuer:'Капитрон Банк',         type:'cd',    ticker:'CAPIT 1450 CD 270218', unit:1025000, qty:8,  rate:15.5, mat:'2027-02-18', matDays:278, term:365, status:'' },
  { id:'h2',  issuer:'Голден Хилл Партнерс',  type:'trust', ticker:'GOLDH 2300 IT 270914', unit:1000000, qty:12, rate:25.6, mat:'2027-09-14', matDays:327, term:365, status:'onsale' },
  { id:'h3',  issuer:'Кредитекс СТМ ББСБ',    type:'trust', ticker:'MSTRT 2400 IT 260711', unit:1300000, qty:5,  rate:21.3, mat:'2026-07-11', matDays:5,   term:180, status:'soon' },
  { id:'h4',  issuer:'Мерит Финанс ББСБ',     type:'inv',   ticker:'INV 0820 11 260820',   unit:4300000, qty:1,  rate:18.0, mat:'2026-08-20', matDays:45,  term:90,  status:'' },
  { id:'h5',  issuer:'Эм Си Эс Холдинг',      type:'cp',    ticker:'NEXT 7500 CP 260715',  unit:3800000, qty:1,  rate:7.5,  mat:'2026-07-15', matDays:12,  term:60,  status:'soon' },
  { id:'h6',  issuer:'Хас Банк',              type:'cd',    ticker:'XACB 1380 CD 261210',  unit:1000000, qty:15, rate:13.8, mat:'2026-12-10', matDays:164, term:270, status:'' },
  { id:'h7',  issuer:'Дарь Финанс ББСБ',      type:'trust', ticker:'DARI 2300 IT 270227',  unit:1000000, qty:6,  rate:23.0, mat:'2027-02-27', matDays:287, term:365, status:'' },
  { id:'h8',  issuer:'Анлок ББСБ',            type:'trust', ticker:'ANLK 2450 IT 260805',  unit:1100000, qty:4,  rate:24.5, mat:'2026-08-05', matDays:30,  term:180, status:'soon' },
  { id:'h9',  issuer:'Тээвэр Логистик ХХК',   type:'inv',   ticker:'INV 1090 04 261105',   unit:2600000, qty:2,  rate:19.4, mat:'2026-11-05', matDays:129, term:180, status:'' },
  { id:'h10', issuer:'Голомт Банк',           type:'cd',    ticker:'GLMT 1420 CD 270401',  unit:1050000, qty:10, rate:14.2, mat:'2027-04-01', matDays:320, term:365, status:'' },
  { id:'h11', issuer:'Ти Ди Би Лизинг',       type:'cp',    ticker:'TDBL 0680 CP 260922',  unit:2900000, qty:2,  rate:6.8,  mat:'2026-09-22', matDays:85,  term:120, status:'' },
].map(h => ({ ...h, value: h.unit * h.qty, ab: PTS[h.type] }));

/* payout at maturity per unit — gross interest less 10% withholding */
const pPayoutUnit = h => { const gi = h.unit * (h.rate/100) * (h.term/360); return h.unit + gi - gi*0.10; };

function pSellCalc(h, qty, priceInput, isDiscount) {
  const salePrice = isDiscount ? Math.round(h.unit * (1 - priceInput/100)) : Math.max(0, Math.round(priceInput || 0));
  const gross = salePrice * qty, fee = Math.round(gross * 0.001);
  const payoutUnit = pPayoutUnit(h);
  const buyerYield = salePrice > 0 && h.matDays > 0 ? ((payoutUnit - salePrice) / salePrice) * (360/h.matDays) * 100 : 0;
  return { salePrice, gross, fee, total: gross - fee, payoutUnit, buyerYield };
}

const pBadge = (h, onSale) => (onSale != null ? onSale : h.status === 'onsale') ? { t:'Зарагдаж байна', fg:window.T.warn, bg:window.T.warnSoft }
  : h.matDays <= 30 ? { t:`Удахгүй өгөөж · ${h.matDays} хоног`, fg:window.T.pos, bg:window.T.posSoft }
  : { t:'Идэвхтэй', fg:window.T.muted, bg:'#F4F5F9' };

/* Live sell-listings bridge — on-sale state is owned by MMFListings (the same
   store the Trade page reads), never by a hardcoded flag, so listing here and
   cancelling from Trade (or the reverse) can never disagree.
   The seed gives the statically on-sale sample holdings a real listing row. */
const P_SEED_KEY = 'mmf_products_seeded_v1';
const P_LIVE = ['new','active','pending'];
function pSeedListings() {
  if (!window.MMFListings) return;
  try { if (localStorage.getItem(P_SEED_KEY)) return; } catch (e) {}
  PHOLDINGS.filter(h => h.status === 'onsale').forEach(h => {
    if (window.MMFListings.activeForTicker(h.ticker).length) return;
    const unit = Math.round(h.unit * 0.98);
    window.MMFListings.add({ id:'seed-'+h.id, holdingId:h.id, bank:h.issuer, type:h.type, ticker:h.ticker, side:'sell', qty:h.qty, total:unit*h.qty, status:'active', date:'2026-05-18' });
  });
  try { localStorage.setItem(P_SEED_KEY, '1'); } catch (e) {}
}
const pLiveFor = (list, h) => list.filter(l => l.ticker === h.ticker && P_LIVE.indexOf(l.status) > -1);

/* ── Card view ── */
const PHoldingCard = ({ h, onSell, onCancel, onSale, listedQty }) => {
  const T = window.T, tc = PT[h.type], b = pBadge(h, onSale);
  const pct = Math.max(3, Math.min(100, Math.round(((h.term - h.matDays) / h.term) * 100)));
  return (
    <div className="holding-card hover-card" style={{ display:'flex', flexDirection:'column', gap:14, padding:18, background:T.surface, border:`1px solid ${T.line2}`, borderRadius:18, minWidth:0 }}>
      <div style={{ display:'flex', alignItems:'flex-start', gap:12, minWidth:0 }}>
        <div style={{ width:42, height:42, borderRadius:12, background:`${tc.c1}18`, color:tc.c1, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:13, flexShrink:0 }}>{h.ab}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div className="truncate" title={h.issuer} style={{ fontSize:14.5, fontWeight:700, color:T.ink, letterSpacing:'-0.01em', lineHeight:1.25 }}>{h.issuer}</div>
          <div className="truncate" style={{ fontSize:11, color:T.muted, fontWeight:600, marginTop:4 }}>
            <span style={{ fontFamily:PMONO, color:T.text }}>{h.ticker.split(' ').slice(0,2).join(' ')}</span> · {PTL[h.type]}
          </div>
        </div>
        <div style={{ textAlign:'right', flexShrink:0 }}>
          <div className="num" style={{ fontSize:15, fontWeight:800, color:T.ink, fontFamily:PMONO, fontVariantNumeric:'tabular-nums' }}>{window.formatMNT(h.value)}</div>
          <div className="num" style={{ fontSize:12, fontWeight:700, color:T.pos, marginTop:2, fontFamily:PMONO }}>{window.formatRate(h.rate)}</div>
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, flexWrap:'wrap', rowGap:6 }}>
        <span style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'4px 10px', borderRadius:999, background:b.bg, color:b.fg, fontSize:11, fontWeight:700, whiteSpace:'nowrap' }}>
          <span style={{ width:6, height:6, borderRadius:99, background:b.fg }}/>{b.t}{onSale && listedQty ? ` · ${listedQty} ш` : ''}
        </span>
        <span className="num" style={{ fontSize:11, color:T.muted, fontWeight:600, fontFamily:PMONO, whiteSpace:'nowrap' }}>Дуусах {window.formatDate(h.mat)}</span>
      </div>
      <div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:8, fontSize:11, color:T.muted, fontWeight:600, marginBottom:6 }}>
          <span style={{ whiteSpace:'nowrap' }}>Хугацааны явц</span>
          <span className="num" style={{ fontFamily:PMONO, whiteSpace:'nowrap' }}>{h.matDays} хоног үлдсэн</span>
        </div>
        <div style={{ height:6, borderRadius:999, background:'#F0F2F8', overflow:'hidden' }}>
          <div style={{ width:pct+'%', height:'100%', borderRadius:999, background:`linear-gradient(90deg, ${T.indigo}, ${T.blue})` }}/>
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', gap:8, padding:'10px 12px', borderRadius:12, background:T.field, border:`1px solid ${T.line2}` }}>
        <span style={{ fontSize:11.5, color:T.muted, fontWeight:600 }}>Хугацааны эцэст</span>
        <span className="num" style={{ fontSize:13, fontWeight:800, color:T.ink, fontFamily:PMONO }}>{window.formatMNT(Math.round(pPayoutUnit(h) * h.qty))}</span>
      </div>
      <div style={{ display:'flex', gap:8, marginTop:2 }}>
        <a href="13 Transaction History.html" style={{ flex:1, height:38, borderRadius:11, border:`1px solid ${T.line}`, background:T.surface, color:T.text, textDecoration:'none', fontSize:12.5, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>Гүйлгээний түүх</a>
        {onSale
          ? <button onClick={() => onCancel(h)} style={{ flex:1, height:38, borderRadius:11, border:`1.5px solid ${T.line}`, background:T.surface, color:T.neg, fontSize:12.5, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>Зарлага цуцлах</button>
          : <button onClick={() => onSell(h)} style={{ flex:1, height:38, borderRadius:11, border:`1.5px solid ${T.warn}`, background:'#fff', color:T.warn, fontSize:12.5, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>Зарах</button>}
      </div>
    </div>
  );
};

Object.assign(window, { PT, PTL, PTS, PMONO, P_SELL_DISCOUNT, PHOLDINGS, pPayoutUnit, pSellCalc, pBadge, PHoldingCard, pSeedListings, pLiveFor, P_LIVE });
