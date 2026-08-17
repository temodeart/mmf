// products_page.jsx — MMF Web · Миний бүтээгдэхүүн page body.
// Summary strip → filter bar (search / type / status / maturity / sort / view)
// → card grid or table → sell drawer. Depends on products_data.jsx.

const { useState: _uSP, useEffect: _uEP, useMemo: _uMP } = React;

const PSellSheet = ({ holding, onClose, onContinue }) => {
  const T = window.T, { WebButton } = window, _mnt = window.formatMNT;
  const [qty, setQty] = _uSP(1);
  const [qtyErr, setQtyErr] = _uSP('');
  const [price, setPrice] = _uSP(0);
  const [discount, setDiscount] = _uSP(2);
  _uEP(() => { if (holding) { setQty(1); setQtyErr(''); setPrice(holding.unit); setDiscount(2); } }, [holding && holding.id]);
  if (!holding) return null;
  const isDiscount = !!window.P_SELL_DISCOUNT[holding.type];
  const setQtyClamped = v => {
    if (v === '') { setQty(''); setQtyErr(''); return; }
    const n = parseInt(v, 10);
    if (isNaN(n)) { setQty(''); return; }
    setQty(n);
    setQtyErr(n < 1 ? 'Хамгийн багадаа 1 ширхэг сонгоно уу.' : n > holding.qty ? `Танд ${holding.qty} ширхэг байна — түүнээс дээш зарах боломжгүй.` : '');
  };
  const qtyNum = typeof qty === 'number' && !isNaN(qty) ? qty : 0;
  const calc = window.pSellCalc(holding, Math.max(qtyNum,0), isDiscount ? discount : price, isDiscount);
  const ok = qtyNum >= 1 && qtyNum <= holding.qty && calc.salePrice > 0;
  const Row = ({ l, v, tone, big }) => (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, padding:big?'11px 0':'8px 0', borderBottom:`1px solid ${T.line2}` }}>
      <span style={{ fontSize:big?14:12.5, fontWeight:big?800:600, color:big?T.ink:T.muted }}>{l}</span>
      <span className="num" style={{ fontSize:big?15:13, fontWeight:big?800:700, color:tone||T.ink, fontFamily:window.PMONO, textAlign:'right' }}>{v}</span>
    </div>
  );
  const card = { background:T.surface, border:`1px solid ${T.line2}`, borderRadius:16, padding:16 };
  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:60, background:'rgba(5,11,31,.4)', display:'flex', justifyContent:'flex-end' }}>
      <div onClick={e => e.stopPropagation()} style={{ width:'min(468px, 94vw)', height:'100%', background:T.bg, boxShadow:'-24px 0 60px -24px rgba(15,20,55,.4)', display:'flex', flexDirection:'column', minWidth:0 }}>
        <div style={{ flexShrink:0, height:64, display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, padding:'0 20px', background:T.surface, borderBottom:`1px solid ${T.line}` }}>
          <div style={{ minWidth:0 }}>
            <div className="truncate" style={{ fontSize:15, fontWeight:800, color:T.ink, letterSpacing:'-0.01em' }}>{holding.issuer}</div>
            <div className="truncate" style={{ fontSize:11, fontWeight:600, color:T.muted2, fontFamily:window.PMONO, marginTop:2 }}>{holding.ticker} · Зарах захиалга</div>
          </div>
          <button onClick={onClose} aria-label="Хаах" style={{ width:38, height:38, borderRadius:11, border:`1px solid ${T.line}`, background:T.surface, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke={T.ink} strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
        <div style={{ flex:1, overflowY:'auto', minHeight:0, padding:20, display:'flex', flexDirection:'column', gap:16 }}>
          <div style={card}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,minmax(0,1fr))', gap:12 }}>
              {[['Нэрлэсэн үнэ', _mnt(holding.unit)], ['Эзэмшиж буй', holding.qty+' ширхэг'], ['Үлдсэн хугацаа', holding.matDays+' хоног']].map(([k,v]) => (
                <div key={k} style={{ minWidth:0 }}>
                  <div style={{ fontSize:10.5, color:T.muted, fontWeight:600 }}>{k}</div>
                  <div className="num truncate" style={{ fontSize:13, fontWeight:800, color:T.ink, marginTop:3, fontFamily:window.PMONO }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={card}>
            <div style={{ fontSize:12, fontWeight:700, color:T.text, marginBottom:8, display:'flex', justifyContent:'space-between' }}>
              <span>Зарах тоо ширхэг</span><span style={{ color:T.muted, fontWeight:600 }}>эзэмшиж буй: {holding.qty}</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', border:`1.5px solid ${qtyErr?T.neg:T.line}`, borderRadius:13, background:T.field, overflow:'hidden' }}>
              <button onClick={() => setQtyClamped(String(Math.max(1, qtyNum-1)))} style={{ width:48, height:50, border:'none', background:'transparent', fontSize:20, fontWeight:700, color:T.muted, cursor:'pointer', flexShrink:0, fontFamily:'inherit' }}>−</button>
              <input type="number" value={qty} onChange={e => setQtyClamped(e.target.value)} style={{ flex:1, minWidth:0, border:'none', background:'transparent', textAlign:'center', fontFamily:window.PMONO, fontSize:18, fontWeight:700, color:T.ink, outline:'none' }}/>
              <button onClick={() => setQtyClamped(String(Math.min(holding.qty, qtyNum+1)))} style={{ width:48, height:50, border:'none', background:'transparent', fontSize:20, fontWeight:700, color:T.muted, cursor:'pointer', flexShrink:0, fontFamily:'inherit' }}>+</button>
            </div>
            {qtyErr && <div style={{ fontSize:12, color:T.neg, fontWeight:600, marginTop:8 }}>{qtyErr}</div>}
            <div style={{ display:'flex', gap:7, marginTop:10 }}>
              {[1, Math.max(1,Math.ceil(holding.qty/2)), holding.qty].filter((v,i,a)=>a.indexOf(v)===i).map(q => <button key={q} onClick={() => setQtyClamped(String(q))} style={{ flex:1, height:32, borderRadius:9, border:`1px solid ${T.line}`, background:T.surface, fontSize:11.5, fontWeight:700, color:T.muted, cursor:'pointer', fontFamily:'inherit' }}>{q===holding.qty?'Бүгд':q}</button>)}
            </div>
          </div>
          <div style={card}>
            <div style={{ fontSize:12, fontWeight:700, color:T.text, marginBottom:8 }}>{isDiscount ? 'Хямдруулалтын хувь' : 'Нэгжийн зарах үнэ'}</div>
            {isDiscount ? (
              <div style={{ display:'flex', alignItems:'center', border:`1.5px solid ${T.line}`, borderRadius:13, background:T.field, padding:'0 8px 0 16px' }}>
                <input type="number" value={discount} min={0} max={20} step={0.5} onChange={e => setDiscount(Math.max(0, Math.min(20, parseFloat(e.target.value||'0'))))} style={{ flex:1, minWidth:0, height:48, border:'none', background:'transparent', fontFamily:window.PMONO, fontSize:17, fontWeight:700, color:T.ink, outline:'none' }}/>
                <span style={{ fontSize:16, fontWeight:800, color:T.muted, paddingRight:8 }}>%</span>
              </div>
            ) : (
              <div style={{ display:'flex', alignItems:'center', border:`1.5px solid ${T.line}`, borderRadius:13, background:T.field, padding:'0 16px' }}>
                <span style={{ fontSize:16, fontWeight:800, color:T.muted, paddingRight:8 }}>₮</span>
                <input type="number" value={price} onChange={e => setPrice(Math.max(0, parseInt(e.target.value||'0',10)))} style={{ flex:1, minWidth:0, height:48, border:'none', background:'transparent', fontFamily:window.PMONO, fontSize:17, fontWeight:700, color:T.ink, outline:'none' }}/>
              </div>
            )}
            <div style={{ fontSize:11, color:T.muted2, fontWeight:600, marginTop:8 }}>Зарах үнэ: <b style={{ color:T.text, fontFamily:window.PMONO }}>{_mnt(calc.salePrice)}</b> / нэгж</div>
          </div>
          <div style={{ ...card, padding:'6px 16px 12px' }}>
            <div style={{ fontSize:10.5, fontWeight:700, letterSpacing:'.12em', color:T.muted2, textTransform:'uppercase', margin:'12px 0 6px' }}>Захиалгын тооцоо</div>
            <Row l="Нийт зарах дүн" v={_mnt(calc.gross)}/>
            <Row l="Шимтгэл (0.1%)" v={'−'+_mnt(calc.fee)}/>
            <Row l="Таны гарт орох дүн" v={_mnt(calc.total)} big tone={T.pos}/>
          </div>
          <div style={{ background:T.indigoSoft, border:`1px solid ${T.indigoBorder}`, borderRadius:16, padding:'6px 16px 12px' }}>
            <div style={{ fontSize:10.5, fontWeight:700, letterSpacing:'.12em', color:T.indigo, textTransform:'uppercase', margin:'12px 0 6px' }}>Худалдан авагчийн тооцоо</div>
            <Row l="Хугацааны эцэст авах (нэгж)" v={_mnt(calc.payoutUnit)}/>
            <Row l="Жилийн бодит өгөөж" v={calc.buyerYield.toFixed(2)+'%'} big tone={T.indigo}/>
          </div>
        </div>
        <div style={{ flexShrink:0, padding:'14px 20px', background:T.surface, borderTop:`1px solid ${T.line2}` }}>
          <WebButton variant="neg" full disabled={!ok} reason={!ok ? (qtyErr || 'Зарах үнээ оруулна уу.') : undefined} onClick={() => onContinue({ holding, qty:qtyNum, calc })}>Зарах захиалга үргэлжлүүлэх</WebButton>
        </div>
      </div>
    </div>
  );
};

/* ── filter primitives ── */
const PChip = ({ on, onClick, children, count }) => {
  const T = window.T;
  return (
    <button onClick={onClick} aria-pressed={on} style={{ display:'inline-flex', alignItems:'center', gap:7, height:36, padding:'0 13px', borderRadius:11, cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:700, whiteSpace:'nowrap', color:on?'#fff':T.text, background:on?T.indigo:T.surface, border:`1px solid ${on?T.indigo:T.line}`, transition:'background .14s' }}>
      {children}
      {count != null && <span className="num" style={{ fontSize:11.5, fontWeight:700, padding:'1px 6px', borderRadius:99, background:on?'rgba(255,255,255,.22)':T.field, color:on?'#fff':T.muted }}>{count}</span>}
    </button>
  );
};

const PSelect = ({ value, onChange, options, label }) => {
  const T = window.T;
  return (
    <label style={{ display:'inline-flex', alignItems:'center', gap:8, height:36, padding:'0 6px 0 12px', borderRadius:11, background:T.surface, border:`1px solid ${T.line}` }}>
      <span style={{ fontSize:12, fontWeight:600, color:T.muted, whiteSpace:'nowrap' }}>{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)} style={{ border:'none', background:'transparent', font:'inherit', fontSize:13, fontWeight:700, color:T.ink, cursor:'pointer', outline:'none', padding:'0 4px', height:34 }}>
        {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </label>
  );
};

const PStat = ({ label, value, sub, tone }) => {
  const T = window.T;
  return (
    <div style={{ minWidth:0, padding:'2px 0' }}>
      <div style={{ fontSize:11.5, fontWeight:600, color:T.muted, whiteSpace:'nowrap' }}>{label}</div>
      <div className="num truncate" style={{ fontSize:19, fontWeight:800, color:tone||T.ink, fontFamily:window.PMONO, letterSpacing:'-0.02em', marginTop:5 }}>{value}</div>
      {sub && <div className="truncate" style={{ fontSize:11.5, fontWeight:600, color:T.muted2, marginTop:3 }}>{sub}</div>}
    </div>
  );
};

/* ══ PAGE ══════════════════════════════════════════════════════════ */
const MyProductsBody = ({ onSell, listingsVersion }) => {
  const T = window.T, _mnt = window.formatMNT;
  const { WebEmptyState, WebDataTable, WebSkeletonBlock, WebButton, WebModal } = window;
  const H = window.PHOLDINGS;
  const [loading, setLoading] = _uSP(true);
  const [q, setQ] = _uSP('');
  const [type, setType] = _uSP('all');
  const [status, setStatus] = _uSP('all');
  const [win, setWin] = _uSP('all');
  const [sort, setSort] = _uSP('value');
  const [view, setView] = _uSP('cards');
  const [lv, setLv] = _uSP(0);
  const [cancelTarget, setCancelTarget] = _uSP(null);
  _uEP(() => { const t = setTimeout(() => setLoading(false), 650); return () => clearTimeout(t); }, []);

  /* Deep links — Wallet's allocation legend and the Dashboard open a
     pre-filtered view (?type=cd&status=onsale) instead of the whole list. */
  _uEP(() => {
    window.pSeedListings && window.pSeedListings();
    setLv(v => v + 1);
    if (typeof location === 'undefined') return;
    const p = new URLSearchParams(location.search);
    const t = p.get('type'); if (t && (t === 'all' || window.PTL[t])) setType(t);
    const s = p.get('status'); if (s && ['all','active','soon','onsale'].indexOf(s) > -1) setStatus(s);
    const qq = p.get('q'); if (qq) setQ(qq);
  }, []);
  _uEP(() => { setLv(v => v + 1); }, [listingsVersion]);

  /* On-sale state is derived from the shared MMFListings store, so a listing
     created here, or cancelled on the Trade page, stays consistent everywhere. */
  const listings = _uMP(() => (window.MMFListings ? window.MMFListings.all() : []), [lv]);
  const saleInfo = _uMP(() => {
    const m = {};
    H.forEach(h => { const ls = window.pLiveFor(listings, h); m[h.id] = { onSale: ls.length > 0, qty: ls.reduce((s,l) => s + (l.qty||0), 0), listing: ls[0] || null }; });
    return m;
  }, [H, listings]);
  const onS = h => !!(saleInfo[h.id] && saleInfo[h.id].onSale);

  const cancelListing = () => {
    const info = cancelTarget ? saleInfo[cancelTarget.id] : null;
    if (info && info.listing && window.MMFListings) window.MMFListings.setStatus(info.listing.id, 'cancelled');
    setCancelTarget(null);
    setLv(v => v + 1);
  };

  const typeCounts = _uMP(() => H.reduce((a,h) => (a[h.type]=(a[h.type]||0)+1, a), {}), [H]);
  const rows = _uMP(() => {
    const term = q.trim().toLowerCase();
    let r = H.filter(h =>
      (type === 'all' || h.type === type) &&
      (status === 'all' || (status === 'onsale' ? onS(h) : status === 'soon' ? h.matDays <= 30 && !onS(h) : !onS(h) && h.matDays > 30)) &&
      (win === 'all' || (win === '30' ? h.matDays <= 30 : win === '90' ? h.matDays <= 90 : h.matDays > 90)) &&
      (!term || h.issuer.toLowerCase().includes(term) || h.ticker.toLowerCase().includes(term))
    );
    const cmp = { value:(a,b)=>b.value-a.value, rate:(a,b)=>b.rate-a.rate, mat:(a,b)=>a.matDays-b.matDays, issuer:(a,b)=>a.issuer.localeCompare(b.issuer,'mn') };
    return [...r].sort(cmp[sort]);
  }, [H, q, type, status, win, sort, saleInfo]);

  const sum = _uMP(() => {
    const total = rows.reduce((s,h)=>s+h.value, 0);
    const payout = rows.reduce((s,h)=>s+window.pPayoutUnit(h)*h.qty, 0);
    const wRate = total ? rows.reduce((s,h)=>s+h.rate*h.value, 0)/total : 0;
    const next = [...rows].sort((a,b)=>a.matDays-b.matDays)[0];
    return { total, payout:Math.round(payout), wRate, next, count:rows.length };
  }, [rows]);

  const dirty = q || type !== 'all' || status !== 'all' || win !== 'all';
  const clear = () => { setQ(''); setType('all'); setStatus('all'); setWin('all'); };

  const COLS = [
    { key:'issuer', label:'Бүтээгдэхүүн', sortable:false, render:h => (
      <div style={{ display:'flex', alignItems:'center', gap:11, minWidth:0 }}>
        <div style={{ width:34, height:34, borderRadius:10, background:`${window.PT[h.type].c1}18`, color:window.PT[h.type].c1, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:11.5, flexShrink:0 }}>{h.ab}</div>
        <div style={{ minWidth:0 }}>
          <div className="truncate" style={{ fontSize:13.5, fontWeight:700, color:T.ink }}>{h.issuer}</div>
          <div className="truncate" style={{ fontSize:11, color:T.muted, fontFamily:window.PMONO, marginTop:2 }}>{h.ticker}</div>
        </div>
      </div>
    ) },
    { key:'type', label:'Төрөл', render:h => <span style={{ fontSize:12.5, fontWeight:600, color:T.text }}>{window.PTL[h.type]}</span> },
    { key:'qty', label:'Тоо', align:'right', mono:true, render:h => h.qty },
    { key:'value', label:'Үнэлгээ', align:'right', mono:true, render:h => <b>{_mnt(h.value)}</b> },
    { key:'rate', label:'Хүү', align:'right', mono:true, render:h => <span style={{ color:T.pos, fontWeight:700 }}>{h.rate.toFixed(1)}%</span> },
    { key:'mat', label:'Дуусах', align:'right', mono:true, render:h => (
      <div>
        <div>{window.formatDate(h.mat)}</div>
        <div style={{ fontSize:11, color:h.matDays<=30?T.pos:T.muted, fontWeight:600, marginTop:2 }}>{h.matDays} хоног</div>
      </div>
    ) },
    { key:'status', label:'Статус', render:h => { const b = window.pBadge(h, onS(h)); return (
      <span style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'4px 9px', borderRadius:999, background:b.bg, color:b.fg, fontSize:11, fontWeight:700, whiteSpace:'nowrap' }}>
        <span style={{ width:6, height:6, borderRadius:99, background:b.fg }}/>{b.t.split(' · ')[0]}
      </span>
    ); } },
    { key:'act', label:'', align:'right', render:h => onS(h)
      ? <button onClick={e => { e.stopPropagation(); setCancelTarget(h); }} style={{ height:32, padding:'0 14px', borderRadius:9, border:`1.5px solid ${T.line}`, background:T.surface, color:T.neg, fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap' }}>Цуцлах</button>
      : <button onClick={e => { e.stopPropagation(); onSell(h); }} style={{ height:32, padding:'0 14px', borderRadius:9, border:`1.5px solid ${T.warn}`, background:'#fff', color:T.warn, fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap' }}>Зарах</button> },
  ];

  const iconBtn = on => ({ width:36, height:36, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', background:on?T.indigoSoft:'transparent', border:`1px solid ${on?T.indigoBorder:'transparent'}`, color:on?T.indigo:T.muted });

  return (
    <>
      {/* summary — computed from the FILTERED set, so it answers the question on screen */}
      <div style={{ background:T.surface, border:`1px solid ${T.line2}`, borderRadius:20, padding:'18px 22px', marginBottom:16, display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(168px,1fr))', gap:22, alignItems:'start' }}>
        {loading ? [0,1,2,3].map(i => <div key={i}><WebSkeletonBlock variant="text" width="60%"/><div style={{ height:8 }}/><WebSkeletonBlock variant="text" width="85%"/></div>) : (
          <>
            <PStat label={dirty ? 'Шүүсэн үнэлгээ' : 'Нийт үнэлгээ'} value={_mnt(sum.total)} sub={`${sum.count} бүтээгдэхүүн`}/>
            <PStat label="Жигнэсэн дундаж хүү" value={sum.wRate.toFixed(1)+'%'} sub="жилийн" tone={T.pos}/>
            <PStat label="Хугацааны эцэст хүлээгдэх" value={_mnt(sum.payout)} sub={`+${_mnt(sum.payout - sum.total)} хүү (татварын дараа)`}/>
            <PStat label="Дараагийн өгөөж" value={sum.next ? window.formatDate(sum.next.mat) : '—'} sub={sum.next ? `${sum.next.matDays} хоногт · ${sum.next.issuer}` : 'Байхгүй'}/>
          </>
        )}
      </div>

      {/* filter bar */}
      <div style={{ background:T.surface, border:`1px solid ${T.line2}`, borderRadius:18, padding:14, marginBottom:16, display:'flex', flexDirection:'column', gap:12 }}>
        <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
          <div style={{ position:'relative', flex:'1 1 260px', minWidth:200 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ position:'absolute', left:12, top:10, pointerEvents:'none' }}><circle cx="11" cy="11" r="6.5" stroke={T.muted2} strokeWidth="2"/><path d="M16 16l4 4" stroke={T.muted2} strokeWidth="2" strokeLinecap="round"/></svg>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Гаргагч эсвэл тикерээр хайх" style={{ width:'100%', height:36, boxSizing:'border-box', padding:'0 34px 0 34px', borderRadius:11, border:`1px solid ${T.line}`, background:T.field, font:'inherit', fontSize:13, fontWeight:600, color:T.ink, outline:'none' }}/>
            {q && <button onClick={() => setQ('')} aria-label="Хайлт цэвэрлэх" style={{ position:'absolute', right:6, top:6, width:24, height:24, borderRadius:7, border:'none', background:'transparent', cursor:'pointer', color:T.muted }}>✕</button>}
          </div>
          <PSelect label="Хугацаа" value={win} onChange={setWin} options={[{v:'all',l:'Бүгд'},{v:'30',l:'30 хоногт'},{v:'90',l:'90 хоногт'},{v:'90+',l:'90+ хоног'}]}/>
          <PSelect label="Эрэмбэ" value={sort} onChange={setSort} options={[{v:'value',l:'Үнэлгээ'},{v:'rate',l:'Хүү'},{v:'mat',l:'Дуусах хугацаа'},{v:'issuer',l:'Нэр'}]}/>
          <div style={{ display:'flex', gap:2, padding:2, borderRadius:12, background:T.field, border:`1px solid ${T.line}` }}>
            <button onClick={() => setView('cards')} aria-label="Картаар" aria-pressed={view==='cards'} style={iconBtn(view==='cards')}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="2"/><rect x="13" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="2"/><rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="2"/><rect x="13" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="2"/></svg>
            </button>
            <button onClick={() => setView('table')} aria-label="Хүснэгтээр" aria-pressed={view==='table'} style={iconBtn(view==='table')}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
          <PChip on={type==='all'} onClick={() => setType('all')} count={window.PHOLDINGS.length}>Бүх төрөл</PChip>
          {Object.keys(window.PTL).map(k => <PChip key={k} on={type===k} onClick={() => setType(k)} count={typeCounts[k]||0}>{window.PTL[k]}</PChip>)}
          <span style={{ width:1, height:24, background:T.line2, margin:'0 3px' }}/>
          {[{v:'all',l:'Бүх статус'},{v:'active',l:'Идэвхтэй'},{v:'soon',l:'Удахгүй дуусах'},{v:'onsale',l:'Зарагдаж байгаа'}].map(s => <PChip key={s.v} on={status===s.v} onClick={() => setStatus(s.v)}>{s.l}</PChip>)}
          {dirty && <button onClick={clear} style={{ marginLeft:'auto', height:36, padding:'0 12px', borderRadius:11, border:'none', background:'transparent', color:T.indigo, fontSize:12.5, fontWeight:700, cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap' }}>Шүүлтүүр цэвэрлэх</button>}
        </div>
      </div>

      {/* results */}
      {loading ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:16 }}>
          {[0,1,2,3,4,5].map(i => <div key={i} style={{ background:T.surface, border:`1px solid ${T.line2}`, borderRadius:18, padding:18 }}><WebSkeletonBlock variant="text" width="70%"/><div style={{ height:10 }}/><WebSkeletonBlock variant="text" width="45%"/><div style={{ height:18 }}/><WebSkeletonBlock variant="text" width="100%"/></div>)}
        </div>
      ) : rows.length === 0 ? (
        <WebEmptyState
          title="Шүүлтүүрт тохирох бүтээгдэхүүн олдсонгүй"
          body="Хайлтын үг эсвэл шүүлтүүрийг сулруулж дахин үзнэ үү."
          action={{ label:'Шүүлтүүр цэвэрлэх', onClick: clear }}/>
      ) : view === 'cards' ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:16 }}>
          {rows.map(h => <window.PHoldingCard key={h.id} h={h} onSell={onSell} onCancel={setCancelTarget} onSale={onS(h)} listedQty={saleInfo[h.id] ? saleInfo[h.id].qty : 0}/>)}
        </div>
      ) : (
        <WebDataTable columns={COLS} rows={rows}/>
      )}
      {!loading && rows.length > 0 && (
        <div style={{ fontSize:12, color:T.muted, fontWeight:600, marginTop:14 }}>{rows.length} / {window.PHOLDINGS.length} бүтээгдэхүүн харуулж байна</div>
      )}

      {cancelTarget && (
        <WebModal open onClose={() => setCancelTarget(null)} title="Зарах захиалга цуцлах уу?" footer={
          <div style={{ display:'flex', gap:10 }}>
            <WebButton variant="ghost" full onClick={() => setCancelTarget(null)}>Болих</WebButton>
            <WebButton variant="neg" full onClick={cancelListing}>Захиалга цуцлах</WebButton>
          </div>
        }>
          <div style={{ background:T.field, border:`1px solid ${T.line2}`, borderRadius:14, padding:'13px 15px' }}>
            <div style={{ fontSize:14, fontWeight:800, color:T.ink }}>{cancelTarget.issuer}</div>
            <div className="num" style={{ fontSize:11.5, color:T.muted, fontWeight:600, fontFamily:window.PMONO, marginTop:3 }}>{cancelTarget.ticker}</div>
            <div style={{ display:'flex', gap:20, marginTop:12 }}>
              {[['Зарагдаж байгаа', (saleInfo[cancelTarget.id] ? saleInfo[cancelTarget.id].qty : 0) + ' ширхэг'], ['Үлдсэн хугацаа', cancelTarget.matDays + ' хоног']].map(([k,v]) => (
                <div key={k}>
                  <div style={{ fontSize:10.5, color:T.muted, fontWeight:600 }}>{k}</div>
                  <div className="num" style={{ fontSize:13, fontWeight:800, color:T.ink, fontFamily:window.PMONO, marginTop:2 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop:14, fontSize:12.5, color:T.muted, lineHeight:1.6, textWrap:'pretty' }}>Захиалга цуцлагдаж бүтээгдэхүүн хоёрдогч зах зээлээс хасагдана. Бүтээгдэхүүн таны багцад үлдэж, хүү нь хэвийн хуримтлагдсаар байна. Дахин зарахын тулд шинээр захиалга үүсгэнэ.</div>
        </WebModal>
      )}
    </>
  );
};

Object.assign(window, { MyProductsBody, PSellSheet, PChip, PSelect, PStat });
