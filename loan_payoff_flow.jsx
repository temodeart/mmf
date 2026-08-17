// loan_payoff_flow.jsx — MMF Web · Зээл хаах (payoff) + Хувааж төлөх (partial pay)
// Exports: PayoffFlow, PartialPayFlow
// Load after loan_desktop.jsx + comp_kit.jsx.

const { useState: _uP, useEffect: _uPE } = React;
const { T: _TP, WebButton: _WBtn } = window;
const { LoanPinInput: _PinInput, LoanRail: _Rail } = window;
const { WALLET_BALANCE: _WB_DEFAULT } = window;
const _mntP = n => window.formatMNT(n);

const PrevSwitchP = ({ label, options, value, onChange }) => (
  <div className="prev-switch">
    <span className="prev-switch__label">{label}</span>
    {options.map(o => (<button key={o.v} className={'prev-btn' + (value===o.v?' active':'')} onClick={() => onChange(o.v)}>{o.l}</button>))}
  </div>
);
const Layout2P = ({ left, right }) => (
  <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) 340px', gap:24, maxWidth:1080, margin:'0 auto', alignItems:'start' }}>
    <div style={{ minWidth:0 }}>{left}</div>
    <div style={{ minWidth:0 }}>{right}</div>
  </div>
);
const CardP = ({ children, footer }) => (
  <div style={{ background:_TP.surface, border:`1px solid ${_TP.line2}`, borderRadius:24, overflow:'hidden' }}>
    <div style={{ padding:'28px 32px' }}>{children}</div>
    {footer && <div style={{ padding:'18px 32px', borderTop:`1px solid ${_TP.line2}`, background:_TP.field, display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>{footer}</div>}
  </div>
);
const CenteredP = ({ children, footer, maxWidth=560 }) => (
  <div style={{ maxWidth, margin:'0 auto' }}>
    <div style={{ background:_TP.surface, border:`1px solid ${_TP.line2}`, borderRadius:24, overflow:'hidden' }}>
      <div style={{ padding:'34px 36px' }}>{children}</div>
      {footer && <div style={{ padding:'18px 36px', borderTop:`1px solid ${_TP.line2}`, background:_TP.field, display:'flex', flexDirection:'column', gap:10 }}>{footer}</div>}
    </div>
  </div>
);

/* ── shared top-up mini-flow (chains R5's Орлого concept) → processing → success/failure ── */
const TopUpMini = ({ shortfall, onSuccess, onExit }) => {
  const [stage, setStage] = _uP('amount');   // amount | processing | failed
  const [outcome, setOutcome] = _uP('success');
  const [amount, setAmount] = _uP(shortfall);

  if (stage === 'amount') return (
    <CenteredP footer={<><WBtnRow/></>}>
      <h1 style={{ fontSize:20, fontWeight:800, color:_TP.ink, letterSpacing:'-0.02em', margin:'0 0 8px' }}>Хэтэвч цэнэглэх</h1>
      <p style={{ fontSize:13, color:_TP.muted, lineHeight:1.55, margin:'0 0 20px' }}>Дутагдаж буй дүнг цэнэглэснээр төлбөр автоматаар үргэлжлэнэ.</p>
      <div style={{ background:_TP.field, borderRadius:16, border:`1.5px solid ${_TP.line}`, padding:16 }}>
        <div style={{ fontSize:12, color:_TP.muted, fontWeight:600 }}>Цэнэглэх дүн</div>
        <div style={{ display:'flex', alignItems:'baseline', gap:6, marginTop:8 }}>
          <span style={{ fontSize:26, fontWeight:800, color:_TP.indigo }}>₮</span>
          <input value={amount===0?'':amount.toLocaleString('en-US')} onChange={e => { const d=e.target.value.replace(/[^0-9]/g,''); setAmount(d===''?0:parseInt(d,10)); }}
            style={{ flex:1, minWidth:0, border:'none', outline:'none', background:'transparent', fontSize:28, fontWeight:800, color:_TP.ink, fontFamily:"'JetBrains Mono',monospace" }}/>
        </div>
      </div>
      <div style={{ marginTop:12, fontSize:11.5, color:_TP.muted }}>Санал болгож буй дүн: дутагдаж буй {_mntP(shortfall)}</div>
    </CenteredP>
  );

  function WBtnRow() {
    return (
      <>
        <_WBtn variant="ghost" full onClick={onExit}>Цуцлах</_WBtn>
        <_WBtn variant="primary" full disabled={amount < shortfall} onClick={() => setStage('processing')}>Цэнэглэх</_WBtn>
      </>
    );
  }

  if (stage === 'processing') {
    _uPE(() => { const t = setTimeout(() => { if (outcome === 'failed') setStage('failed'); else onSuccess(amount); }, 2000); return () => clearTimeout(t); }, []);
    return (
      <>
        <PrevSwitchP label="Цэнэглэлт" options={[{v:'success',l:'Амжилттай'},{v:'failed',l:'Амжилтгүй'}]} value={outcome} onChange={setOutcome}/>
        <CenteredP maxWidth={480}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center' }}>
            <div style={{ position:'relative', width:90, height:90, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <div className="loan-pulse" style={{ position:'absolute', inset:0, borderRadius:26, background:'rgba(79,70,229,.2)' }}/>
              <div style={{ position:'relative', width:66, height:66, borderRadius:20, background:`linear-gradient(135deg, ${_TP.indigo}, ${_TP.blue})`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="13" rx="3" stroke="#fff" strokeWidth="2"/><path d="M2 11h20M7 4h10" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
            </div>
            <div style={{ fontSize:18, fontWeight:800, color:_TP.ink, marginTop:20 }}>Төлбөр боловсруулж байна</div>
            <p style={{ fontSize:12.5, color:_TP.muted, marginTop:8, lineHeight:1.5 }}>Хэтэвч цэнэглэгдэж, зээлийн үлдэгдэл автоматаар суутгагдана.</p>
          </div>
        </CenteredP>
      </>
    );
  }

  // failed
  return (
    <>
      <PrevSwitchP label="Цэнэглэлт" options={[{v:'success',l:'Амжилттай'},{v:'failed',l:'Амжилтгүй'}]} value={outcome} onChange={setOutcome}/>
      <CenteredP footer={<><_WBtn variant="ink" full onClick={() => setStage('amount')}>Дахин оролдох</_WBtn><_WBtn variant="ghost" full onClick={onExit}>Цуцлах</_WBtn></>}>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center' }}>
          <div style={{ width:76, height:76, borderRadius:24, background:_TP.negSoft, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none"><path d="M7 7l10 10M17 7L7 17" stroke={_TP.neg} strokeWidth="3" strokeLinecap="round"/></svg>
          </div>
          <div style={{ fontSize:19, fontWeight:800, color:_TP.ink, marginTop:18 }}>Цэнэглэлт амжилтгүй боллоо</div>
          <p style={{ fontSize:13, color:_TP.muted, marginTop:8, lineHeight:1.55, maxWidth:300 }}>Төлбөрийн үйлчилгээ хариу өгсөнгүй. Та дахин оролдоно уу эсвэл өөр аргаар цэнэглэнэ үү.</p>
        </div>
      </CenteredP>
    </>
  );
};

/* ══ PAYOFF · Зээл хаах ══════════════════════════════════════════════════ */
const PayoffFlow = ({ loan, onExit, onHome }) => {
  const [stage, setStage] = _uP('review');       // review | topup | pin | success
  const [walletMode, setWalletMode] = _uP('short'); // preview: short | enough
  const [pin, setPin] = _uP('');
  const wallet = walletMode === 'enough' ? loan.payoff + 200000 : _WB_DEFAULT;
  const insufficient = wallet < loan.payoff;
  const shortfall = Math.max(loan.payoff - wallet, 0);
  const [toppedUp, setToppedUp] = _uP(0);

  if (stage === 'review') return (
    <>
      <PrevSwitchP label="Үлдэгдэл" options={[{v:'short',l:'Дутуу'},{v:'enough',l:'Хангалттай'}]} value={walletMode} onChange={setWalletMode}/>
      <Layout2P
        left={
          <CardP footer={<><_WBtn variant="ghost" onClick={onExit}>Буцах</_WBtn><_WBtn variant="primary" onClick={() => setStage(insufficient ? 'topup' : 'pin')}>{insufficient ? 'Цэнэглээд төлөх' : 'Хэтэвчээр төлөх'} →</_WBtn></>}>
            <h1 style={{ fontSize:22, fontWeight:800, color:_TP.ink, letterSpacing:'-0.02em', margin:'0 0 8px' }}>{loan.bulk ? 'Бүх зээлээ хаах' : 'Зээл хаах'}</h1>
            <p style={{ fontSize:13, color:_TP.muted, lineHeight:1.6, margin:'0 0 20px' }}>{loan.bulk ? <>{loan.count} идэвхтэй зээл · <span className="num">{loan.id}</span></> : <>Идэвхтэй зээл · <span className="num">{loan.id}</span></>}</p>

            <div style={{ background:_TP.field, borderRadius:16, border:`1px solid ${_TP.line2}`, overflow:'hidden', marginBottom:18 }}>
              {[['Үлдэгдэл үндсэн', _mntP(loan.remain)], ['Хуримтлагдсан хүү', _mntP(loan.accrued)]].map(([l,v],i) => (
                <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'12px 16px', borderTop: i?`1px solid ${_TP.line2}`:'none' }}>
                  <span style={{ fontSize:12.5, color:_TP.muted, fontWeight:600 }}>{loan.bulk ? l + ' (нийт)' : l}</span>
                  <span className="num" style={{ fontSize:13, fontWeight:700, color:_TP.ink }}>{v}</span>
                </div>
              ))}
              <div style={{ display:'flex', justifyContent:'space-between', padding:'14px 16px', background:_TP.indigoSoft }}>
                <span style={{ fontSize:13, fontWeight:800, color:_TP.ink }}>{loan.bulk ? 'Нийт төлж хаах дүн' : 'Төлж хаах дүн'}</span>
                <span className="num" style={{ fontSize:17, fontWeight:800, color:_TP.indigo }}>{_mntP(loan.payoff)}</span>
              </div>
            </div>

            {loan.bulk && (
              <div style={{ marginBottom:18, display:'flex', gap:10, alignItems:'flex-start', padding:14, borderRadius:14, background:_TP.indigoSoft }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:1 }}><circle cx="12" cy="12" r="9" stroke={_TP.indigo} strokeWidth="2"/><path d="M12 16v-4M12 8.5h.01" stroke={_TP.indigo} strokeWidth="2" strokeLinecap="round"/></svg>
                <div style={{ fontSize:12, color:_TP.ink, lineHeight:1.5, textWrap:'pretty' }}>Нэг гүйлгээгээр {loan.count} зээл хоёулаа бүрэн хаагдана. Зөвхөн нэгийг хаахыг хүсвэл тухайн зээлийн дэлгэрэнгүй рүү орно уу.</div>
              </div>
            )}

            <div style={{ fontSize:11, color:_TP.muted, fontWeight:700, letterSpacing:'.06em', textTransform:'uppercase', marginBottom:10 }}>Төлбөрийн эх үүсвэр</div>
            <div style={{ background:_TP.surface, borderRadius:16, border:`1px solid ${_TP.line2}`, padding:16 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:40, height:40, borderRadius:12, background:_TP.indigoSoft, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="13" rx="3" stroke={_TP.indigo} strokeWidth="2"/><path d="M3 10h18" stroke={_TP.indigo} strokeWidth="2"/></svg>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13.5, fontWeight:700, color:_TP.ink }}>Хэтэвчний үлдэгдэл</div>
                  <div style={{ fontSize:11, color:_TP.muted, marginTop:2 }}>Боломжит үлдэгдэл</div>
                </div>
                <div className="num" style={{ fontSize:15, fontWeight:800, color: insufficient ? _TP.neg : _TP.ink }}>{_mntP(wallet)}</div>
              </div>
              {insufficient && (
                <>
                  <div style={{ marginTop:14, height:6, borderRadius:999, background:_TP.line2, overflow:'hidden' }}>
                    <div style={{ width:Math.round((wallet/loan.payoff)*100)+'%', height:'100%', borderRadius:999, background:_TP.indigo }}/>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginTop:10, paddingTop:10, borderTop:`1px dashed ${_TP.line}` }}>
                    <span style={{ fontSize:12.5, color:_TP.neg, fontWeight:700 }}>Дутагдаж буй дүн</span>
                    <span className="num" style={{ fontSize:14, color:_TP.neg, fontWeight:800 }}>{_mntP(shortfall)}</span>
                  </div>
                </>
              )}
            </div>

            {insufficient && (
              <div style={{ marginTop:14, background:_TP.warnSurface, borderRadius:14, padding:14, display:'flex', gap:10 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:1 }}><circle cx="12" cy="12" r="9" stroke={_TP.warn} strokeWidth="2"/><path d="M12 8v.5M12 11v5" stroke={_TP.warn} strokeWidth="2" strokeLinecap="round"/></svg>
                <div style={{ fontSize:12, color:_TP.ink, lineHeight:1.5 }}>Хэтэвчний үлдэгдэл хүрэлцэхгүй байна. Дутах <b>{_mntP(shortfall)}</b>-г цэнэглэснээр зээл автоматаар бүрэн хаагдана.</div>
              </div>
            )}
          </CardP>
        }
        right={<_Rail mode="payoff" payoffAmount={loan.payoff} walletBalance={wallet}/>}
      />
    </>
  );

  if (stage === 'topup') return <TopUpMini shortfall={shortfall} onExit={() => setStage('review')} onSuccess={(amt) => { setToppedUp(amt); setStage('success'); }}/>;

  if (stage === 'pin') return (
    <Layout2P
      left={<CardP footer={<_WBtn variant="primary" full disabled={pin.length!==4} onClick={() => setStage('success')}>Зээл хаах баталгаажуулах</_WBtn>}>
        <h1 style={{ fontSize:20, fontWeight:800, color:_TP.ink, letterSpacing:'-0.02em', margin:'0 0 8px' }}>ПИН кодоо оруулна уу</h1>
        <p style={{ fontSize:12.5, color:_TP.muted, lineHeight:1.55, margin:'0 0 22px' }}>{loan.bulk ? `${loan.count} зээлийг нэг дор хаах гүйлгээг ПИН кодоор баталгаажуулна уу.` : 'Зээл хаах гүйлгээг ПИН кодоор баталгаажуулна уу.'}</p>
        <div style={{ display:'flex', justifyContent:'center' }}><_PinInput onChange={setPin}/></div>
      </CardP>}
      right={<_Rail mode="payoff" payoffAmount={loan.payoff} walletBalance={wallet}/>}
    />
  );

  return (
    <CenteredP footer={<><_WBtn variant="primary" full onClick={onHome}>Нүүр хуудас руу</_WBtn><_WBtn variant="ghost" full onClick={onExit}>{loan.bulk ? 'Зээлийн хуудас' : 'Зээлийн дэлгэрэнгүй'}</_WBtn></>}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center' }}>
        <div style={{ width:80, height:80, borderRadius:26, background:`linear-gradient(135deg, ${_TP.pos}, #0B8F60)`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 18px 40px -12px rgba(14,159,110,.55)' }}>
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{ fontSize:21, fontWeight:800, color:_TP.ink, marginTop:20, letterSpacing:'-0.02em' }}>{loan.bulk ? `${loan.count} зээл амжилттай хаагдлаа` : 'Зээл амжилттай хаагдлаа'}</div>
        <p style={{ fontSize:13.5, color:_TP.muted, marginTop:10, lineHeight:1.55, maxWidth:320 }}>{toppedUp>0 ? 'Хэтэвч цэнэглэгдэж, үлдэгдэл төлбөр автоматаар суутгагдан зээл бүрэн хаагдлаа.' : 'Хэтэвчний үлдэгдлээс төлбөр суутгагдан зээл бүрэн хаагдлаа.'}</p>
      </div>
      <div style={{ marginTop:22, background:_TP.field, borderRadius:16, border:`1px solid ${_TP.line2}`, overflow:'hidden' }}>
        {[[loan.bulk ? 'Хаагдсан зээл' : 'Зээл', loan.bulk ? loan.count + ' зээл' : loan.id], toppedUp>0 ? ['Хэтэвч цэнэглэлт', _mntP(toppedUp)] : null, ['Зээлд төлсөн', _mntP(loan.payoff)], ['Төлөв', 'Хаагдсан']].filter(Boolean).map(([l,v],i) => (
          <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'12px 16px', borderTop: i?`1px solid ${_TP.line2}`:'none' }}>
            <span style={{ fontSize:12.5, color:_TP.muted, fontWeight:600 }}>{l}</span>
            <span className="num" style={{ fontSize:13, fontWeight:700, color: v==='Хаагдсан'?_TP.pos:_TP.ink }}>{v}</span>
          </div>
        ))}
      </div>
    </CenteredP>
  );
};

/* ══ PARTIAL PAY · Хувааж төлөх ══════════════════════════════════════════ */
const PartialPayFlow = ({ loan, onExit, onHome }) => {
  const [stage, setStage] = _uP('amount');
  const [amount, setAmount] = _uP(800000);
  const wallet = _WB_DEFAULT;
  const isFull = amount >= loan.payoff;
  const over = amount > wallet;
  const after = Math.max(loan.payoff - amount, 0);
  const [stagePost, setStagePost] = _uP(null); // 'topup' when over
  const [pin, setPin] = _uP('');

  const cta = over ? 'Цэнэглээд төлөх' : (isFull ? 'Зээл хаах' : 'Төлөх');

  if (stage === 'amount') return (
    <Layout2P
      left={
        <CardP footer={<><_WBtn variant="ghost" onClick={onExit}>Буцах</_WBtn><_WBtn variant="primary" disabled={amount===0} onClick={() => setStage(over ? 'topup' : 'pin')}>{cta} →</_WBtn></>}>
          <div style={{ background:`linear-gradient(135deg, ${_TP.navy} 0%, ${_TP.navy}CC 100%)`, color:'#fff', borderRadius:16, padding:16, marginBottom:20 }}>
            <div style={{ fontSize:11, opacity:.7, fontWeight:600 }}>Идэвхтэй зээл · {loan.id}</div>
            <div style={{ fontSize:12, opacity:.7, marginTop:10 }}>Зээл хаах дүн</div>
            <div className="num" style={{ fontSize:24, fontWeight:800, marginTop:2 }}>{_mntP(loan.payoff)}</div>
          </div>

          <div style={{ fontSize:12, color:_TP.muted, fontWeight:600, marginBottom:8 }}>Төлөх дүн</div>
          <div style={{ background:_TP.field, borderRadius:16, border:`1.5px solid ${_TP.line}`, padding:16 }}>
            <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
              <span style={{ fontSize:26, fontWeight:800, color:_TP.indigo }}>₮</span>
              <input value={amount===0?'':amount.toLocaleString('en-US')} onChange={e => { const d=e.target.value.replace(/[^0-9]/g,''); setAmount(Math.min(d===''?0:parseInt(d,10), loan.payoff)); }}
                style={{ flex:1, minWidth:0, border:'none', outline:'none', background:'transparent', fontSize:28, fontWeight:800, color:_TP.ink, fontFamily:"'JetBrains Mono',monospace" }}/>
            </div>
          </div>
          <div className="num" style={{ fontSize:11.5, color:_TP.muted, marginTop:8 }}>Дээд тал нь {_mntP(loan.payoff)} · үлдэгдэл бүрэн</div>

          {amount > 0 && (isFull ? (
            <div style={{ marginTop:16, display:'flex', gap:10, alignItems:'flex-start', padding:14, borderRadius:14, background:_TP.indigoSoft }}>
              <div style={{ width:22, height:22, borderRadius:999, background:_TP.indigo, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div style={{ fontSize:12, color:_TP.ink, lineHeight:1.5 }}>Та үлдэгдлийг бүрэн төлж, <b>зээлээ хаах</b> гэж байна. Төлөгдсөний дараа энэ зээл бүрэн хаагдана.</div>
            </div>
          ) : (
            <div style={{ marginTop:16, background:_TP.surface, borderRadius:16, border:`1px solid ${_TP.line2}`, overflow:'hidden' }}>
              <div style={{ display:'flex', justifyContent:'space-between', padding:'13px 16px' }}>
                <span style={{ fontSize:12.5, color:_TP.muted, fontWeight:600 }}>Төлөх дүн</span>
                <span className="num" style={{ fontSize:13.5, fontWeight:700, color:_TP.ink }}>{_mntP(amount)}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', padding:'14px 16px', background:_TP.field, borderTop:`1px solid ${_TP.line2}` }}>
                <span style={{ fontSize:13, fontWeight:800, color:_TP.ink }}>Төлсний дараах үлдэгдэл</span>
                <span className="num" style={{ fontSize:16, fontWeight:800, color:_TP.indigo }}>{_mntP(after)}</span>
              </div>
            </div>
          ))}
        </CardP>
      }
      right={<_Rail mode="partial" payoffAmount={loan.payoff} partialAmount={amount} walletBalance={wallet}/>}
    />
  );

  if (stage === 'topup') return <TopUpMini shortfall={amount - wallet} onExit={() => setStage('amount')} onSuccess={() => setStage('success')}/>;

  if (stage === 'pin') return (
    <Layout2P
      left={<CardP footer={<_WBtn variant="primary" full disabled={pin.length!==4} onClick={() => setStage('success')}>{isFull ? 'Зээл хаах' : 'Төлөх'} баталгаажуулах</_WBtn>}>
        <h1 style={{ fontSize:20, fontWeight:800, color:_TP.ink, letterSpacing:'-0.02em', margin:'0 0 8px' }}>ПИН кодоо оруулна уу</h1>
        <p style={{ fontSize:12.5, color:_TP.muted, lineHeight:1.55, margin:'0 0 22px' }}>Төлбөрийн гүйлгээг ПИН кодоор баталгаажуулна уу.</p>
        <div style={{ display:'flex', justifyContent:'center' }}><_PinInput onChange={setPin}/></div>
      </CardP>}
      right={<_Rail mode="partial" payoffAmount={loan.payoff} partialAmount={amount} walletBalance={wallet}/>}
    />
  );

  return (
    <CenteredP footer={<><_WBtn variant="primary" full onClick={onExit}>Зээлийн дэлгэрэнгүй</_WBtn><_WBtn variant="ghost" full onClick={onHome}>Нүүр хуудас руу</_WBtn></>}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center' }}>
        <div style={{ width:80, height:80, borderRadius:26, background:`linear-gradient(135deg, ${_TP.pos}, #0B8F60)`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 18px 40px -12px rgba(14,159,110,.55)' }}>
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{ fontSize:21, fontWeight:800, color:_TP.ink, marginTop:20, letterSpacing:'-0.02em' }}>{isFull ? 'Зээл амжилттай хаагдлаа' : 'Төлбөр амжилттай хийгдлээ'}</div>
        <p style={{ fontSize:13.5, color:_TP.muted, marginTop:10, lineHeight:1.55, maxWidth:320 }}>{isFull ? 'Үлдэгдэл бүрэн төлөгдөж, зээл хаагдлаа.' : 'Таны төлбөр зээлийн үлдэгдлээс хасагдаж, хүү буурлаа.'}</p>
      </div>
      <div style={{ marginTop:22, background:_TP.field, borderRadius:16, border:`1px solid ${_TP.line2}`, overflow:'hidden' }}>
        {[['Зээл', loan.id], ['Төлсөн дүн', _mntP(amount)], isFull ? ['Төлөв','Хаагдсан'] : ['Үлдсэн төлбөр', _mntP(after)]].map(([l,v],i) => (
          <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'12px 16px', borderTop: i?`1px solid ${_TP.line2}`:'none' }}>
            <span style={{ fontSize:12.5, color:_TP.muted, fontWeight:600 }}>{l}</span>
            <span className="num" style={{ fontSize:13, fontWeight:700, color: v==='Хаагдсан'?_TP.pos:_TP.ink }}>{v}</span>
          </div>
        ))}
      </div>
    </CenteredP>
  );
};

Object.assign(window, { PayoffFlow, PartialPayFlow });
