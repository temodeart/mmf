// loan_desktop.jsx — MMF Web · Loan (Зээл) shared pieces
// Exports: QrPlaceholder, LoanPinInput, CheckList, LoanRail, HistoryRow, loanFmt helpers
// Load after comp_atoms.jsx + comp_kit.jsx + foundations.js.

const { useState: _uSL, useRef: _uRL } = React;
const _TL = window.T;
const mntL = n => window.formatMNT(n);

/* ── deterministic pseudo-QR (placeholder, not scannable) ── */
const QrPlaceholder = ({ size = 168 }) => {
  const n = 21, cell = size / n; let seed = 7;
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return (seed >> 8) / 0x7fffff % 1; };
  const isFinder = (r, c) => (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
  const rects = [];
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) { if (isFinder(r, c)) continue; if (rnd() > 0.52) rects.push(<rect key={r+'-'+c} x={c*cell} y={r*cell} width={cell} height={cell} fill={_TL.ink}/>); }
  const finder = (gx, gy) => (<g transform={`translate(${gx*cell},${gy*cell})`}><rect width={cell*7} height={cell*7} fill={_TL.ink}/><rect x={cell} y={cell} width={cell*5} height={cell*5} fill="#fff"/><rect x={cell*2} y={cell*2} width={cell*3} height={cell*3} fill={_TL.ink}/></g>);
  return <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display:'block' }}><rect width={size} height={size} fill="#fff"/>{rects}{finder(0,0)}{finder(n-7,0)}{finder(0,n-7)}</svg>;
};

/* ── 4-digit transaction PIN (order-modal parity) ── */
const LoanPinInput = ({ length = 4, onChange, error }) => {
  const [vals, setVals] = _uSL(Array(length).fill(''));
  const refs = _uRL([]);
  const set = (i, v) => {
    const d = v.replace(/\D/g, '').slice(-1);
    const next = [...vals]; next[i] = d; setVals(next);
    onChange && onChange(next.join(''));
    if (d && i < length - 1) refs.current[i + 1] && refs.current[i + 1].focus();
  };
  const key = (i, e) => { if (e.key === 'Backspace' && !vals[i] && i > 0) refs.current[i - 1] && refs.current[i - 1].focus(); };
  return (
    <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
      {vals.map((v, i) => (
        <input key={i} ref={el => refs.current[i] = el} value={v} inputMode="numeric" maxLength={1} aria-label={`PIN ${i+1}`}
          onChange={e => set(i, e.target.value)} onKeyDown={e => key(i, e)}
          style={{ width:54, height:58, textAlign:'center', border:`2px solid ${error ? _TL.neg : (v ? _TL.indigo : _TL.line)}`, borderRadius:14, background: v ? _TL.surface : _TL.field, fontFamily:"'JetBrains Mono',monospace", fontSize:23, fontWeight:700, color:_TL.ink, outline:'none' }}/>
      ))}
    </div>
  );
};

/* ── ЗМС checking progress list ── */
const CheckList = ({ items }) => {
  const glyph = (s) => s === 'done' ? (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill={_TL.posSoft}/><path d="M8 12l3 3 5-6" stroke={_TL.pos} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ) : s === 'loading' ? (
    <div className="loan-spin" style={{ width:22, height:22, borderRadius:999, border:`2.5px solid ${_TL.indigoSoft}`, borderTopColor:_TL.indigo }}/>
  ) : <div style={{ width:22, height:22, borderRadius:999, border:`2px solid ${_TL.line}`, background:_TL.surface }}/>;
  return (
    <div style={{ background:_TL.surface, borderRadius:18, border:`1px solid ${_TL.line2}`, overflow:'hidden' }}>
      {items.map((it,i) => (
        <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 16px', borderTop: i?`1px solid ${_TL.line2}`:'none' }}>
          <div style={{ flexShrink:0 }}>{glyph(it.s)}</div>
          <div style={{ flex:1, fontSize:13.5, fontWeight:700, color: it.s==='pending'?_TL.muted2:_TL.ink }}>{it.t}</div>
        </div>
      ))}
    </div>
  );
};

/* ── History row (Олголтын түүх) ── */
const HistoryRow = ({ h, first }) => (
  <div style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 16px', borderTop: first?'none':`1px solid ${_TL.line2}` }}>
    <div style={{ width:36, height:36, borderRadius:10, background:h.soft, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
      {h.up
        ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M6 13l6 6 6-6" stroke={h.tone} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        : <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke={h.tone} strokeWidth="2" fill="none"/><path d="M12 8.5v7M10 10.5h3a1.5 1.5 0 010 3h-2a1.5 1.5 0 000 3h3" stroke={h.tone} strokeWidth="1.6" strokeLinecap="round"/></svg>}
    </div>
    <div style={{ flex:1, minWidth:0 }}>
      <div style={{ fontSize:13, fontWeight:700, color:_TL.ink }}>{h.t}</div>
      <div className="num" style={{ fontSize:11, color:_TL.muted, marginTop:2 }}>{h.d} · {h.sub}</div>
    </div>
    <div className="num" style={{ fontSize:13.5, fontWeight:700, color:h.tone, flexShrink:0 }}>{h.v}</div>
  </div>
);

/* ── Right rail — persistent live-breakdown summary for the request→decision journey ──
   mode: 'request' | 'fee' | 'decision' | 'payoff' | 'partial' */
const LoanRail = ({ mode, amount, term, fee, net, interest, dueTotal, decisionAmount, payoffAmount, walletBalance, partialAmount }) => {
  const Row = ({ l, v, tone, strong }) => (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'11px 0', borderTop: `1px solid ${_TL.line2}` }}>
      <span style={{ fontSize:12, color:_TL.muted, fontWeight:600 }}>{l}</span>
      <span className="num" style={{ fontSize: strong?15:13, fontWeight: strong?800:700, color: tone||_TL.ink }}>{v}</span>
    </div>
  );
  return (
    <div style={{ position:'sticky', top:20 }}>
      <div style={{ background:_TL.surface, border:`1px solid ${_TL.line2}`, borderRadius:22, padding:'18px 20px', minWidth:0 }}>
        <div style={{ fontSize:13, fontWeight:800, color:_TL.ink, letterSpacing:'-0.01em', marginBottom:4 }}>Задаргаа</div>

        {mode === 'request' && (
          <>
            <Row l="Хүсэж буй дүн" v={mntL(amount)}/>
            <Row l="Шимтгэл (1%, доод ₮5,000)" v={'−' + mntL(fee)} tone={_TL.neg}/>
            <Row l="Хэтэвчинд орох дүн" v={mntL(net)} strong tone={_TL.pos}/>
            <Row l={`Хүү · ${term} хоног (2.5%/сар)`} v={mntL(interest)}/>
            <Row l="Хугацааны эцэст төлөх" v={mntL(dueTotal)} strong tone={_TL.indigo}/>
            <div style={{ marginTop:14, padding:'12px 14px', borderRadius:13, background:_TL.warnSurface, border:`1px solid ${_TL.warnBorder}`, display:'flex', gap:9 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:1 }}><circle cx="12" cy="12" r="9" stroke={_TL.warn} strokeWidth="2"/><path d="M12 8v5M12 16h.01" stroke={_TL.warn} strokeWidth="2" strokeLinecap="round"/></svg>
              <div style={{ fontSize:11.5, color:'#7A5A1F', lineHeight:1.5 }}>ЗМС лавлагааны шимтгэл <b style={{ color:'#5E4413' }}>{mntL(4000)}</b> хүсэлт бүрд төлөгдөнө.</div>
            </div>
          </>
        )}

        {mode === 'fee' && (
          <>
            <Row l="Хүсэж буй дүн" v={mntL(amount)}/>
            <Row l="ЗМС лавлагааны шимтгэл" v={mntL(4000)} strong tone={_TL.indigo}/>
            <div style={{ marginTop:14, fontSize:11.5, color:_TL.muted, lineHeight:1.5 }}>Энэ шимтгэл хүсэлт тус бүрт төлөгдөнө — хүсэлт цуцлагдсан ч буцаан олгогдохгүй.</div>
          </>
        )}

        {mode === 'decision' && (
          <>
            <Row l="Хүсэж буй дүн" v={mntL(amount)}/>
            <Row l="Шийдвэрлэсэн дүн" v={mntL(decisionAmount)} strong tone={_TL.indigo}/>
            <Row l="Шимтгэл (1%)" v={'−' + mntL(Math.max(5000, Math.round(decisionAmount*0.01)))} tone={_TL.neg}/>
            <Row l="Хэтэвчинд орох дүн" v={mntL(decisionAmount - Math.max(5000, Math.round(decisionAmount*0.01)))} strong tone={_TL.pos}/>
            <Row l="ЗМС шимтгэл (төлөгдсөн)" v={mntL(4000)} tone={_TL.muted}/>
          </>
        )}

        {mode === 'payoff' && (
          <>
            <Row l="Төлж хаах дүн" v={mntL(payoffAmount)} strong tone={_TL.indigo}/>
            <Row l="Хэтэвчний үлдэгдэл" v={mntL(walletBalance)} tone={walletBalance < payoffAmount ? _TL.neg : _TL.ink}/>
            {walletBalance < payoffAmount && <Row l="Дутагдаж буй дүн" v={mntL(payoffAmount - walletBalance)} strong tone={_TL.neg}/>}
          </>
        )}

        {mode === 'partial' && (
          <>
            <Row l="Зээл хаах дүн" v={mntL(payoffAmount)}/>
            <Row l="Төлөх дүн" v={mntL(partialAmount)} strong tone={_TL.indigo}/>
            <Row l="Төлсний дараах үлдэгдэл" v={mntL(Math.max(payoffAmount - partialAmount, 0))} strong/>
            <Row l="Хэтэвчний үлдэгдэл" v={mntL(walletBalance)} tone={partialAmount > walletBalance ? _TL.neg : _TL.ink}/>
          </>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { QrPlaceholder, LoanPinInput, CheckList, HistoryRow, LoanRail });
