// loan_request_flow.jsx — MMF Web · Зээл request + ЗМС sequence (mobile screens 33–43)
// Exports: LoanRequestFlow
// Load after loan_desktop.jsx (needs QrPlaceholder, LoanPinInput, CheckList, LoanRail) + comp_kit.jsx.

const { useState: _uQ, useEffect: _uQE } = React;
const { T: _T, WebButton: _WebButton, WebModal: _WebModal, WebBadge: _WebBadge } = window;
const { QrPlaceholder: _QrPlaceholder, LoanPinInput: _LoanPinInput, CheckList: _CheckList, LoanRail: _LoanRail } = window;
const { ZMS_FEE: _ZMS_FEE, feeFor: _feeFor, netFor: _netFor } = window;
const _mnt = n => window.formatMNT(n);
const _df  = d => window.formatDate(d);

const PrevSwitch = ({ label, options, value, onChange }) => (
  <div className="prev-switch">
    <span className="prev-switch__label">{label}</span>
    {options.map(o => (
      <button key={o.v} className={'prev-btn' + (value===o.v ? ' active' : '')} onClick={() => onChange(o.v)}>{o.l}</button>
    ))}
  </div>
);

const Layout2 = ({ left, right }) => (
  <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) 340px', gap:24, maxWidth:1080, margin:'0 auto', alignItems:'start' }}>
    <div style={{ minWidth:0 }}>{left}</div>
    <div style={{ minWidth:0 }}>{right}</div>
  </div>
);
const Card = ({ children, footer }) => (
  <div style={{ background:_T.surface, border:`1px solid ${_T.line2}`, borderRadius:24, overflow:'hidden' }}>
    <div style={{ padding:'28px 32px' }}>{children}</div>
    {footer && <div style={{ padding:'18px 32px', borderTop:`1px solid ${_T.line2}`, background:_T.field, display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>{footer}</div>}
  </div>
);
const Centered = ({ children, footer, maxWidth=560 }) => (
  <div style={{ maxWidth, margin:'0 auto' }}>
    <div style={{ background:_T.surface, border:`1px solid ${_T.line2}`, borderRadius:24, overflow:'hidden' }}>
      <div style={{ padding:'34px 36px' }}>{children}</div>
      {footer && <div style={{ padding:'18px 36px', borderTop:`1px solid ${_T.line2}`, background:_T.field, display:'flex', flexDirection:'column', gap:10 }}>{footer}</div>}
    </div>
  </div>
);

const LoanRequestFlow = ({ onExit }) => {
  const [stage, setStage] = _uQ('amount');           // amount | blocked | qpay | pay-status | zms-checking | decision | pin | disbursed
  const [amount, setAmount] = _uQ(3000000);
  const [term, setTerm] = _uQ(30);
  const [borrowedToday, setBorrowedToday] = _uQ('no'); // preview toggle
  const [payState, setPayState] = _uQ('waiting');      // preview toggle: waiting | confirmed | failed | timeout
  const [outcome, setOutcome] = _uQ('accepted');       // preview toggle: accepted | partial | declined
  const [cancelOpen, setCancelOpen] = _uQ(false);
  const [pin, setPin] = _uQ('');
  const [checkStep, setCheckStep] = _uQ(0);

  const fee = _feeFor(amount);
  const net = _netFor(amount);
  const dailyRate = 0.025 / 30;
  const interest = Math.round(amount * dailyRate * term);
  const dueTotal = amount + interest;

  const decisionAmount = outcome === 'partial' ? Math.round(amount / 3 / 10000) * 10000 : amount;
  const decisionFee = _feeFor(decisionAmount);
  const decisionNet = decisionAmount - decisionFee;

  // auto-advance timers
  _uQE(() => {
    if (stage === 'pay-status' && payState === 'confirmed') {
      const t = setTimeout(() => setStage('zms-checking'), 1600);
      return () => clearTimeout(t);
    }
  }, [stage, payState]);

  _uQE(() => {
    if (stage !== 'zms-checking') return;
    setCheckStep(0);
    const timers = [
      setTimeout(() => setCheckStep(1), 700),
      setTimeout(() => setCheckStep(2), 1500),
      setTimeout(() => setCheckStep(3), 2300),
      setTimeout(() => setCheckStep(4), 3000),
      setTimeout(() => setStage('decision'), 3700),
    ];
    return () => timers.forEach(clearTimeout);
  }, [stage]);

  const CHECK_ITEMS = [
    { t:'ЗМС лавлагаа илгээгдлээ' },
    { t:'FICO оноо шалгаж байна' },
    { t:'Өр, орлогын харьцаа тооцоолж байна' },
    { t:'Зээлийн түүх шалгаж байна' },
    { t:'Зээлийн хүсэлтийг шийдвэрлэж байна' },
  ].map((it, i) => ({ ...it, s: i < checkStep ? 'done' : i === checkStep ? 'loading' : 'pending' }));

  /* ── amount + term entry ── */
  if (stage === 'amount') return (
    <>
      <PrevSwitch label="Өнөөдөр" options={[{v:'no',l:'Зээлгүй'},{v:'yes',l:'Зээлтэй'}]} value={borrowedToday} onChange={setBorrowedToday}/>
      <Layout2
        left={
          <Card footer={
            <>
              <button onClick={onExit} style={{ background:'none', border:'none', color:_T.muted, fontWeight:700, fontSize:13.5, cursor:'pointer', fontFamily:'inherit', padding:'8px 4px' }}>Цуцлах</button>
              <WebButton variant="primary" disabled={amount===0} onClick={() => setStage(borrowedToday==='yes' ? 'blocked' : 'qpay')}>Үргэлжлүүлэх →</WebButton>
            </>
          }>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'5px 12px', borderRadius:999, background:_T.indigoSoft, color:_T.indigo, fontSize:11.5, fontWeight:700 }}>Богино хугацааны зээл</div>
            <h1 style={{ fontSize:24, fontWeight:800, color:_T.ink, letterSpacing:'-0.02em', lineHeight:1.25, margin:'16px 0 10px' }}>Хүссэн дүнгээ оруулна уу</h1>
            <p style={{ fontSize:14, color:_T.muted, lineHeight:1.6, margin:'0 0 22px' }}>Авахыг хүсэж буй зээлийн дүнгээ оруулна уу. Хүсэлтийг хянасны дараа зөвшөөрөх дүнг танд мэдэгдэнэ.</p>

            <div style={{ fontSize:12, color:_T.muted, fontWeight:600, marginBottom:8 }}>Хүссэн зээлийн дүн</div>
            <div style={{ background:_T.field, borderRadius:16, border:`1.5px solid ${_T.line}`, padding:16, marginBottom:20 }}>
              <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
                <span style={{ fontSize:28, fontWeight:800, color:_T.indigo }}>₮</span>
                <input value={amount===0?'':amount.toLocaleString('en-US')} onChange={e => { const d=e.target.value.replace(/[^0-9]/g,''); setAmount(d===''?0:parseInt(d,10)); }} placeholder="0"
                  style={{ flex:1, minWidth:0, border:'none', outline:'none', background:'transparent', fontSize:30, fontWeight:800, color:_T.ink, fontFamily:"'JetBrains Mono',monospace" }}/>
              </div>
              <div style={{ marginTop:10, paddingTop:10, borderTop:`1px dashed ${_T.line2}`, fontSize:11.5, color:_T.muted }}>Дээд хязгаар тогтоогоогүй — та хүссэн дүнгээ оруулж болно.</div>
            </div>

            <div style={{ fontSize:12, color:_T.muted, fontWeight:600, marginBottom:8 }}>Зээлийн хугацаа</div>
            <window.TermSelector term={term} setTerm={setTerm}/>
          </Card>
        }
        right={<_LoanRail mode="request" amount={amount} term={term} fee={fee} net={net} interest={interest} dueTotal={dueTotal}/>}
      />
    </>
  );

  /* ── blocked (already borrowed today) — calm info card, not error ── */
  if (stage === 'blocked') return (
    <Centered footer={<WebButton variant="ghost" full onClick={onExit}>Буцах</WebButton>}>
      <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'5px 12px', borderRadius:999, background:_T.indigoSoft, color:_T.indigo, fontSize:11.5, fontWeight:700 }}>30 хоногийн богино хугацааны зээл</div>
      <h1 style={{ fontSize:22, fontWeight:800, color:_T.ink, letterSpacing:'-0.02em', lineHeight:1.25, margin:'18px 0 20px' }}>Хүссэн дүнгээ оруулна уу</h1>
      <div style={{ background:_T.indigoSoft, borderRadius:18, padding:20, border:`1px solid ${_T.indigo}22` }}>
        <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
          <div style={{ width:44, height:44, borderRadius:13, background:_T.surface, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="4" y="5" width="16" height="16" rx="3" stroke={_T.indigo} strokeWidth="2" fill="none"/><path d="M8 3v4M16 3v4M4 10h16" stroke={_T.indigo} strokeWidth="2" strokeLinecap="round"/></svg>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:800, color:_T.ink }}>Та өнөөдөр зээл авсан байна</div>
            <div style={{ fontSize:12.5, color:_T.muted, marginTop:6, lineHeight:1.55 }}>Дараагийн хүсэлтийг маргааш <b className="num" style={{ color:_T.ink }}>{_df('2026-06-13')}</b>нд илгээх боломжтой.</div>
          </div>
        </div>
        <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${_T.indigo}22`, fontSize:11.5, color:_T.muted, lineHeight:1.5 }}>Одоогийн идэвхтэй зээлийг хугацаанд нь эргэн төлснөөр шинэ зээл авах боломж нэмэгдэнэ.</div>
      </div>
    </Centered>
  );

  /* ── QPay payment of the ЗМС fee ── */
  if (stage === 'qpay') return (
    <Layout2
      left={
        <Card footer={<><WebButton variant="ghost" onClick={() => setStage('amount')}>Буцах</WebButton><WebButton variant="primary" onClick={() => { setPayState('waiting'); setStage('pay-status'); }}>Төлбөр шалгах</WebButton></>}>
          <h1 style={{ fontSize:22, fontWeight:800, color:_T.ink, letterSpacing:'-0.02em', margin:'0 0 10px' }}>Төлбөр төлөх</h1>
          <p style={{ fontSize:13.5, color:_T.muted, lineHeight:1.6, margin:'0 0 20px' }}>QPay ашиглан ЗМС лавлагааны төлбөрөө төлнө үү.</p>
          <div style={{ background:_T.field, borderRadius:16, border:`1px solid ${_T.line2}`, padding:16, display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
            <span style={{ fontSize:13, fontWeight:700, color:_T.muted }}>Төлөх дүн</span>
            <span className="num" style={{ fontSize:22, fontWeight:800, color:_T.ink }}>{_mnt(_ZMS_FEE)}</span>
          </div>
          <div style={{ textAlign:'center' }}>
            <div style={{ display:'inline-block', padding:12, borderRadius:14, border:`1px solid ${_T.line2}` }}><_QrPlaceholder size={172}/></div>
            <div style={{ fontSize:12, color:_T.muted, marginTop:12, fontWeight:600 }}>QR код уншуулж төлөх</div>
          </div>
        </Card>
      }
      right={<_LoanRail mode="fee" amount={amount}/>}
    />
  );

  /* ── payment status (waiting/confirmed/failed/timeout) ── */
  if (stage === 'pay-status') {
    const cfg = {
      waiting:   { ring:_T.indigo, soft:_T.indigoSoft, title:'Төлбөр баталгаажиж байна', body:'Төлбөрийн мэдээллийг шалгаж байна.', spin:true },
      confirmed: { ring:_T.pos,    soft:_T.posSoft,    title:'Төлбөр баталгаажлаа', body:'ЗМС лавлагаа эхэлж байна.' },
      failed:    { ring:_T.neg,    soft:_T.negSoft,    title:'Төлбөр баталгаажсангүй', body:'Төлбөр амжилттай хийгдээгүй байна. Та дахин оролдоно уу.' },
      timeout:   { ring:_T.warn,   soft:_T.warnSoft,   title:'Төлбөр хүлээгдэж байна', body:'Хэрэв та төлбөрөө төлсөн бол дахин шалгана уу.' },
    }[payState];
    const glyph = payState==='confirmed'
      ? <svg width="42" height="42" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke={_T.pos} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
      : payState==='failed'
      ? <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M7 7l10 10M17 7L7 17" stroke={_T.neg} strokeWidth="3" strokeLinecap="round"/></svg>
      : payState==='timeout'
      ? <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={_T.warn} strokeWidth="2.2" fill="none"/><path d="M12 7.5V12l3 2" stroke={_T.warn} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      : <svg width="38" height="38" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="7" stroke={_T.indigo} strokeWidth="2" fill="none"/><path d="M12 8v4l2.5 1.5" stroke={_T.indigo} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;

    return (
      <>
        <PrevSwitch label="Төлбөр" options={[{v:'waiting',l:'Хүлээгдэж'},{v:'confirmed',l:'Баталгаажсан'},{v:'failed',l:'Амжилтгүй'},{v:'timeout',l:'Хугацаа'}]} value={payState} onChange={setPayState}/>
        <Centered footer={
          payState==='failed' ? <WebButton variant="ink" full onClick={() => setStage('qpay')}>Дахин төлөх</WebButton>
          : payState==='timeout' ? <WebButton variant="primary" full onClick={() => setPayState('waiting')}>Дахин шалгах</WebButton>
          : payState==='waiting' ? <WebButton variant="primary" full onClick={() => setPayState('confirmed')}>Төлбөр шалгах</WebButton>
          : null
        }>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center' }}>
            <div style={{ position:'relative', width:100, height:100, display:'flex', alignItems:'center', justifyContent:'center' }}>
              {cfg.spin && <div className="loan-spin" style={{ position:'absolute', inset:6, borderRadius:999, border:`4px solid ${cfg.soft}`, borderTopColor:cfg.ring }}/>}
              <div style={{ width:80, height:80, borderRadius:26, background:cfg.soft, display:'flex', alignItems:'center', justifyContent:'center' }}>{glyph}</div>
            </div>
            <div style={{ fontSize:21, fontWeight:800, color:_T.ink, marginTop:22, letterSpacing:'-0.02em' }}>{cfg.title}</div>
            <p style={{ fontSize:13.5, color:_T.muted, marginTop:10, lineHeight:1.55, maxWidth:320 }}>{cfg.body}</p>
            {payState==='confirmed' && (
              <div style={{ marginTop:16, display:'inline-flex', alignItems:'center', gap:8, padding:'8px 14px', borderRadius:999, background:_T.posSoft, color:_T.pos, fontSize:12, fontWeight:700 }}>
                <div className="loan-spin" style={{ width:13, height:13, borderRadius:999, border:`2px solid ${_T.pos}`, borderTopColor:'transparent' }}/>
                ЗМС шалгалт руу шилжиж байна
              </div>
            )}
            <div style={{ marginTop:16, display:'inline-flex', alignItems:'center', gap:6, padding:'5px 12px', borderRadius:999, background:_T.field, border:`1px solid ${_T.line2}`, fontSize:11.5, fontWeight:700, color:_T.muted }}>
              <window.WebDot color={cfg.ring}/>ЗМС лавлагаа · {_mnt(_ZMS_FEE)}
            </div>
          </div>
        </Centered>
      </>
    );
  }

  /* ── ЗМС checking progress ── */
  if (stage === 'zms-checking') return (
    <Centered maxWidth={520}>
      <div style={{ display:'flex', justifyContent:'center' }}>
        <div style={{ position:'relative', width:88, height:88 }}>
          <div className="loan-spin" style={{ position:'absolute', inset:0, borderRadius:999, border:`4px solid ${_T.indigoSoft}`, borderTopColor:_T.indigo }}/>
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M5 19l5-5 3 3 6-8" stroke={_T.indigo} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 9h5v5" stroke={_T.indigo} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
      </div>
      <div style={{ fontSize:21, fontWeight:800, color:_T.ink, marginTop:22, letterSpacing:'-0.02em', textAlign:'center' }}>Зээлийн хүсэлтийг хянаж байна</div>
      <p style={{ fontSize:13, color:_T.muted, marginTop:10, lineHeight:1.55, textAlign:'center', maxWidth:320, marginLeft:'auto', marginRight:'auto' }}>ЗМС мэдээлэлд үндэслэн таны зээлийн хүсэлтийг хянаж байна.</p>
      <div style={{ marginTop:22 }}><_CheckList items={CHECK_ITEMS}/></div>
    </Centered>
  );

  /* ── decision: accepted / partially accepted / declined ── */
  if (stage === 'decision') {
    if (outcome === 'declined') return (
      <>
        <PrevSwitch label="Шийдвэр" options={[{v:'accepted',l:'Зөвшөөрсөн'},{v:'partial',l:'Хэсэгчилсэн'},{v:'declined',l:'Татгалзсан'}]} value={outcome} onChange={setOutcome}/>
        <Centered footer={<WebButton variant="ghost" full onClick={onExit}>Нүүр хуудас руу буцах</WebButton>}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center' }}>
            <div style={{ width:76, height:76, borderRadius:24, background:_T.field, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={_T.muted} strokeWidth="2" fill="none"/><path d="M8.5 12h7" stroke={_T.muted} strokeWidth="2.4" strokeLinecap="round"/></svg>
            </div>
            <div style={{ fontSize:21, fontWeight:800, color:_T.ink, marginTop:20, letterSpacing:'-0.02em', lineHeight:1.3 }}>Зээлийн хүсэлт татгалзагдлаа</div>
            <p style={{ fontSize:13, color:_T.muted, marginTop:10, lineHeight:1.6, maxWidth:340 }}>ЗМС мэдээлэл болон зээлийн шалгуурт үндэслэн таны зээлийн хүсэлтийг одоогоор зөвшөөрөх боломжгүй байна.</p>
          </div>
          <div style={{ marginTop:20, fontSize:11.5, color:_T.muted, fontWeight:700, letterSpacing:'.04em', textTransform:'uppercase' }}>Боломжит шалтгаанууд</div>
          <div style={{ marginTop:10, background:_T.field, borderRadius:16, border:`1px solid ${_T.line2}`, overflow:'hidden' }}>
            {['Өр, орлогын харьцаа өндөр байх','Зээлийн түүх хангалтгүй байх','Идэвхтэй зээлийн ачаалал өндөр байх','Мэдээлэл шинэчлэгдээгүй байх'].map((r,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', borderTop: i?`1px solid ${_T.line2}`:'none' }}>
                <div style={{ width:7, height:7, borderRadius:999, background:_T.muted2, flexShrink:0 }}/>
                <div style={{ fontSize:13, fontWeight:600, color:_T.text }}>{r}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:14, display:'flex', alignItems:'center', gap:10, padding:'12px 14px', borderRadius:12, background:_T.indigoSoft }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="4" y="5" width="16" height="16" rx="3" stroke={_T.indigo} strokeWidth="2" fill="none"/><path d="M8 3v4M16 3v4M4 10h16" stroke={_T.indigo} strokeWidth="2" strokeLinecap="round"/></svg>
            <div className="num" style={{ fontSize:12.5, color:_T.ink, fontWeight:600 }}>Дахин шалгах боломжтой огноо: <b>{_df('2026-06-28')}</b></div>
          </div>
        </Centered>
      </>
    );

    const isPartial = outcome === 'partial';
    return (
      <>
        <PrevSwitch label="Шийдвэр" options={[{v:'accepted',l:'Зөвшөөрсөн'},{v:'partial',l:'Хэсэгчилсэн'},{v:'declined',l:'Татгалзсан'}]} value={outcome} onChange={setOutcome}/>
        <Layout2
          left={
            <Card footer={<><WebButton variant="ghost" onClick={() => setCancelOpen(true)}>Татгалзах</WebButton><WebButton variant="primary" onClick={() => setStage('pin')}>{_mnt(decisionNet)} хэтэвчинд авах →</WebButton></>}>
              <div style={{ borderRadius:20, padding:24, color:'#fff', textAlign:'center', background: isPartial ? `linear-gradient(150deg, ${_T.indigo} 0%, #3D34C9 60%, ${_T.navy} 150%)` : `linear-gradient(150deg, ${_T.pos} 0%, #0B8F60 60%, ${_T.navy} 140%)`, position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', right:-40, top:-40, width:160, height:160, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,255,255,.2), transparent 70%)' }}/>
                <div style={{ position:'relative' }}>
                  <div style={{ width:56, height:56, borderRadius:999, margin:'0 auto', background:'rgba(255,255,255,.16)', border:'1px solid rgba(255,255,255,.25)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div style={{ fontSize:13, fontWeight:700, marginTop:14, opacity:.85 }}>{isPartial ? 'Хэсэгчлэн зөвшөөрөгдлөө' : 'Зээлийн хүсэлт зөвшөөрөгдлөө'}</div>
                  <div className="num" style={{ fontSize:34, fontWeight:800, letterSpacing:'-0.02em', marginTop:6 }}>{_mnt(decisionAmount)}</div>
                  {isPartial && <div style={{ fontSize:12, opacity:.8, marginTop:4 }}>зөвшөөрсөн дүн · хүссэн {_mnt(amount)}</div>}
                </div>
              </div>
              <h1 style={{ fontSize:19, fontWeight:800, color:_T.ink, marginTop:20, letterSpacing:'-0.02em', lineHeight:1.3 }}>{isPartial ? 'Зээл хэсэгчлэн зөвшөөрөгдлөө' : 'Зээл бүрэн зөвшөөрөгдлөө'}</h1>
              <p style={{ fontSize:13, color:_T.muted, marginTop:8, lineHeight:1.55 }}>
                {isPartial ? <>Таны хүссэн {_mnt(amount)}-аас <b style={{ color:_T.ink }}>{_mnt(decisionAmount)}</b> зөвшөөрөгдлөө. Шимтгэл хасагдсан дүн хэтэвчинд орно.</> : 'Таны хүсэлт зөвшөөрөгдлөө. Шимтгэл хасагдсан дүн таны хэтэвчинд орно.'}
              </p>
            </Card>
          }
          right={<_LoanRail mode="decision" amount={amount} decisionAmount={decisionAmount}/>}
        />
        {cancelOpen && (
          <_WebModal open onClose={() => setCancelOpen(false)} title="Санал татгалзах уу?" footer={
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <WebButton variant="primary" full onClick={() => setCancelOpen(false)}>Буцах</WebButton>
              <WebButton variant="neg" full onClick={onExit}>Татгалзах</WebButton>
            </div>
          }>
            <p style={{ fontSize:13, color:_T.text, lineHeight:1.6, margin:0 }}>
              Татгалзсан тохиолдолд энэ санал байнгын хэлбэрээр цуцлагдана. Шинэ хүсэлт илгээхэд ЗМС лавлагааны шимтгэл <b style={{ color:_T.ink }}>{_mnt(_ZMS_FEE)}</b> дахин төлөгдөнө.
            </p>
          </_WebModal>
        )}
      </>
    );
  }

  /* ── PIN confirm before disbursement ── */
  if (stage === 'pin') return (
    <Layout2
      left={
        <Card footer={<WebButton variant="primary" full disabled={pin.length!==4} onClick={() => setStage('disbursed')}>Баталгаажуулах →</WebButton>}>
          <h1 style={{ fontSize:21, fontWeight:800, color:_T.ink, letterSpacing:'-0.02em', margin:'0 0 8px' }}>ПИН кодоо оруулна уу</h1>
          <p style={{ fontSize:12.5, color:_T.muted, lineHeight:1.55, margin:'0 0 24px' }}><b style={{ color:_T.ink }}>{_mnt(decisionAmount)}</b> зээл авахыг гүйлгээний ПИН кодоор баталгаажуулна уу.</p>
          <div style={{ display:'flex', justifyContent:'center' }}><_LoanPinInput onChange={setPin}/></div>
        </Card>
      }
      right={<_LoanRail mode="decision" amount={amount} decisionAmount={decisionAmount}/>}
    />
  );

  /* ── disbursed — full paid-fees breakdown repeated ── */
  if (stage === 'disbursed') return (
    <Centered footer={<><WebButton variant="primary" full onClick={onExit}>Дансаа харах →</WebButton><WebButton variant="ghost" full onClick={onExit}>Нүүр хуудас руу буцах</WebButton></>}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center' }}>
        <div style={{ width:80, height:80, borderRadius:26, background:`linear-gradient(135deg, ${_T.pos}, #0B8F60)`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 18px 40px -12px rgba(14,159,110,.55)' }}>
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{ fontSize:21, fontWeight:800, color:_T.ink, marginTop:20, letterSpacing:'-0.02em' }}>Зээл амжилттай олгогдлоо</div>
        <p style={{ fontSize:13.5, color:_T.muted, marginTop:10, lineHeight:1.55, maxWidth:320 }}><b className="num" style={{ color:_T.ink }}>{_mnt(decisionNet)}</b> таны хэтэвчинд шилжлээ.</p>
      </div>
      <div style={{ marginTop:22, background:_T.field, borderRadius:16, border:`1px solid ${_T.line2}`, overflow:'hidden' }}>
        {[
          ['Зөвшөөрсөн дүн', _mnt(decisionAmount)],
          ['Шимтгэл (1%)', '−' + _mnt(decisionFee)],
          ['Хэтэвчинд орсон дүн', _mnt(decisionNet)],
          [`Хүү (2.5% / ${term} хоног)`, _mnt(Math.round(decisionAmount * dailyRate * term))],
          ['Эргэн төлөх огноо', _df('2026-06-28')],
          ['ЗМС шимтгэл (төлөгдсөн)', _mnt(_ZMS_FEE)],
        ].map(([l,v],i) => (
          <div key={l} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 16px', borderTop: i?`1px solid ${_T.line2}`:'none' }}>
            <span style={{ fontSize:12.5, color:_T.muted, fontWeight:600 }}>{l}</span>
            <span className="num" style={{ fontSize:13, fontWeight:700, color:_T.ink }}>{v}</span>
          </div>
        ))}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 16px', background:_T.indigoSoft }}>
          <span style={{ fontSize:13, color:_T.ink, fontWeight:800 }}>Нийт эргэн төлөх</span>
          <span className="num" style={{ fontSize:17, color:_T.indigo, fontWeight:800 }}>{_mnt(decisionAmount + Math.round(decisionAmount * dailyRate * term))}</span>
        </div>
      </div>
      <div style={{ marginTop:14, display:'inline-flex', alignItems:'center', gap:6, padding:'6px 12px', borderRadius:999, background:_T.warnSoft, color:_T.warn, fontSize:11.5, fontWeight:700 }}>Эргэн төлөх өдөр нэг удаа бүтэн төлнө</div>
    </Centered>
  );

  return null;
};

Object.assign(window, { LoanRequestFlow });
