// ============================================================
// Money Market Fund — Loan Eligibility Check flow (ЗМС lavlagaa)
// Starts AFTER Home → Loan. One product only: 30-day quick loan.
// Reuses screens.jsx atoms + existing MMF visual language.
// ============================================================

const { useState: useStateLE } = React;

const { Frame: FrameLE, C: CLE, BackBar: BackBarLE, Dot: DotLE, LogoMark: LogoMarkLE } = window;

const fmtMNT = (n) => n.toLocaleString('en-US');

// ----- shared footer -----
const LEFooter = ({ children, secondary, dark = false, disabled = false }) => (
  <div style={{ padding:'12px 24px 6px', background:'#fff', borderTop:`1px solid ${CLE.line2}`, flexShrink: 0, display:'flex', flexDirection:'column', gap: 8 }}>
    <button disabled={disabled} style={{
      width:'100%', height: 52, borderRadius: 14, border:'none', cursor: disabled ? 'default' : 'pointer',
      background: disabled ? '#E7E9F2' : (dark ? CLE.ink : CLE.indigo),
      color: disabled ? CLE.muted2 : '#fff',
      fontWeight: 700, fontSize: 15, letterSpacing:'-0.01em',
      display:'flex', alignItems:'center', justifyContent:'center', gap: 10,
      boxShadow: (disabled || dark) ? 'none' : '0 8px 22px -8px rgba(79,70,229,.5)',
      transition:'background .15s',
    }}>{children}</button>
    {secondary && (
      <button style={{ width:'100%', height: 48, borderRadius: 14, background:'transparent', color: CLE.muted, border:'none', fontWeight: 700, fontSize: 14, cursor:'pointer' }}>{secondary}</button>
    )}
  </div>
);

const Arrow = ({ c = '#fff' }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

// ============================================================
// Demo amounts (prototype): user-requested vs decision
// ============================================================
const LOAN_REQUESTED = 3000000;   // what the user asks for
const LOAN_PARTIAL   = 1000000;   // what's offered in the partial case

// ============================================================
// 33 — ENTRY · Зээлийн хүсэлт (user enters the amount they want)
// ============================================================
const LoanCheckEntry = () => {
  const [amount, setAmount] = useStateLE(LOAN_REQUESTED);
  const [focused, setFocused] = useStateLE(false);
  const onType = (e) => {
    const digits = e.target.value.replace(/[^0-9]/g, '');
    setAmount(digits === '' ? 0 : parseInt(digits, 10));
  };
  return (
    <FrameLE label="33 — Loan request · Entry">
      <BackBarLE title="Зээлийн хүсэлт"/>
      <div style={{ flex: 1, overflow:'auto', padding: '6px 24px 24px' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap: 6, padding:'5px 12px', borderRadius: 999, background: CLE.indigoSoft, color: CLE.indigo, fontSize: 11.5, fontWeight: 700 }}>
          <DotLE color={CLE.indigo}/>30 хоногийн богино хугацааны зээл
        </div>

        <div style={{ fontSize: 24, fontWeight: 800, color: CLE.ink, letterSpacing:'-0.02em', lineHeight: 1.18, marginTop: 16 }}>
          Хүссэн дүнгээ оруулна уу
        </div>
        <div style={{ fontSize: 13.5, color: CLE.muted, marginTop: 10, lineHeight: 1.55 }}>
          Авахыг хүсэж буй зээлийн дүнгээ оруулна уу. Хүсэлтийг хянасны дараа зөвшөөрөх дүнг танд мэдэгдэнэ.
        </div>

        {/* amount input — free entry, no preset limit */}
        <div style={{ marginTop: 18, background:'#fff', borderRadius: 20, border:`1.5px solid ${focused ? CLE.indigo : CLE.line2}`, boxShadow: focused ? `0 0 0 4px ${CLE.indigoSoft}` : 'none', padding: 18, transition:'border-color .15s, box-shadow .15s' }}>
          <div style={{ fontSize: 12, color: CLE.muted, fontWeight: 600 }}>Хүссэн зээлийн дүн</div>
          <div style={{ display:'flex', alignItems:'baseline', gap: 6, marginTop: 8 }}>
            <span style={{ fontSize: 30, fontWeight: 800, color: CLE.indigo, letterSpacing:'-0.02em' }}>₮</span>
            <input
              type="text" inputMode="numeric" data-nodrag
              value={amount === 0 ? '' : fmtMNT(amount)}
              onChange={onType}
              onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
              placeholder="0"
              style={{
                flex: 1, minWidth: 0, border:'none', outline:'none', background:'transparent',
                fontSize: 32, fontWeight: 800, color: CLE.ink, letterSpacing:'-0.02em',
                fontVariantNumeric:'tabular-nums', padding: 0,
              }}
            />
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, opacity:.5 }}><path d="M14 4l3 3-9 9H5v-3l9-9z" stroke={CLE.muted} strokeWidth="2" fill="none" strokeLinejoin="round"/></svg>
          </div>
          <div style={{ marginTop: 12, paddingTop: 12, borderTop:`1px dashed ${CLE.line2}`, fontSize: 11.5, color: CLE.muted, lineHeight: 1.5 }}>
            Дээд хязгаар тогтоогоогүй — та хүссэн дүнгээ оруулж болно.
          </div>
        </div>

        {/* term locked */}
        <div style={{ marginTop: 16, background:'#F4F5F9', borderRadius: 14, border:`1.5px solid ${CLE.line}`, padding:'0 16px', height: 52, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: CLE.ink }}>Хугацаа · 30 хоног</span>
          <span style={{ display:'inline-flex', alignItems:'center', gap: 6, fontSize: 11, fontWeight: 700, color: CLE.muted }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke={CLE.muted} strokeWidth="2" fill="none"/><path d="M8 11V8a4 4 0 018 0v3" stroke={CLE.muted} strokeWidth="2" fill="none"/></svg>
            Тогтмол
          </span>
        </div>

        {/* Fee card */}
        <div style={{ marginTop: 16, background:'#FAFBFE', borderRadius: 16, border:`1px solid ${CLE.line2}`, padding: 16 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background:'#fff', border:`1px solid ${CLE.line}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke={CLE.amber} strokeWidth="2" fill="none"/><path d="M12 8.5v7M10 10.5h3a1.5 1.5 0 010 3h-2a1.5 1.5 0 000 3h3" stroke={CLE.amber} strokeWidth="1.8" strokeLinecap="round"/></svg>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: CLE.ink }}>ЗМС лавлагааны төлбөр</div>
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: CLE.ink, fontVariantNumeric:'tabular-nums', letterSpacing:'-0.01em' }}>₮ 4,000</div>
          </div>
          <div style={{ fontSize: 11.5, color: CLE.muted, marginTop: 10, lineHeight: 1.5 }}>Хүсэлтийг хянахад ЗМС системийн лавлагааны төлбөр төлөгдөнө.</div>
        </div>
      </div>
      <LEFooter disabled={amount === 0}>Үргэлжлүүлэх <Arrow/></LEFooter>
    </FrameLE>
  );
};

// ============================================================
// 35 — QPAY PAYMENT
// ============================================================
const QrPlaceholder = ({ size = 168 }) => {
  // deterministic pseudo-QR pattern (placeholder, not a scannable code)
  const n = 21, cell = size / n;
  let seed = 7;
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return (seed >> 8) / 0x7fffff % 1; };
  const isFinder = (r, c) => (
    (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7)
  );
  const rects = [];
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    if (isFinder(r, c)) continue;
    if (rnd() > 0.52) rects.push(<rect key={r+'-'+c} x={c*cell} y={r*cell} width={cell} height={cell} fill={CLE.ink}/>);
  }
  const finder = (gx, gy) => (
    <g transform={`translate(${gx*cell},${gy*cell})`}>
      <rect x="0" y="0" width={cell*7} height={cell*7} fill={CLE.ink}/>
      <rect x={cell} y={cell} width={cell*5} height={cell*5} fill="#fff"/>
      <rect x={cell*2} y={cell*2} width={cell*3} height={cell*3} fill={CLE.ink}/>
    </g>
  );
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display:'block' }}>
      <rect width={size} height={size} fill="#fff"/>
      {rects}
      {finder(0,0)}{finder(n-7,0)}{finder(0,n-7)}
    </svg>
  );
};

const QPayPayment = () => {
  const banks = [
    { n:'Хаан банк', c:'#0E5F2E', a:'ХБ' },
    { n:'Голомт банк', c:'#0B2A6B', a:'ГБ' },
    { n:'Худалдаа хөгжлийн банк', c:'#1F3A8A', a:'ХХ' },
    { n:'Төрийн банк', c:'#0E7490', a:'ТБ' },
  ];
  return (
    <FrameLE label="35 — QPay Payment">
      <BackBarLE title="Төлбөр төлөх"/>
      <div style={{ flex: 1, overflow:'auto', padding: '6px 24px 24px' }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: CLE.ink, letterSpacing:'-0.02em', lineHeight: 1.18 }}>
          Төлбөр төлөх
        </div>
        <div style={{ fontSize: 13.5, color: CLE.muted, marginTop: 8, lineHeight: 1.5 }}>
          QPay ашиглан ЗМС лавлагааны төлбөрөө төлнө үү.
        </div>

        {/* amount */}
        <div style={{ marginTop: 16, background:'#FAFBFE', borderRadius: 16, border:`1px solid ${CLE.line2}`, padding: 16, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: CLE.muted }}>Төлөх дүн</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: CLE.ink, fontVariantNumeric:'tabular-nums', letterSpacing:'-0.02em' }}>₮ 4,000</div>
        </div>

        {/* QR */}
        <div style={{ marginTop: 16, background:'#fff', borderRadius: 18, border:`1px solid ${CLE.line2}`, padding: 18, textAlign:'center' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap: 8 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background:'#0A66C2', color:'#fff', fontSize: 11, fontWeight: 800, display:'flex', alignItems:'center', justifyContent:'center' }}>Q</div>
            <span style={{ fontSize: 13, fontWeight: 800, color: CLE.ink }}>QPay</span>
          </div>
          <div style={{ display:'inline-block', marginTop: 14, padding: 12, borderRadius: 14, border:`1px solid ${CLE.line2}` }}>
            <QrPlaceholder size={160}/>
          </div>
          <div style={{ fontSize: 12, color: CLE.muted, marginTop: 12, fontWeight: 600 }}>QR код уншуулж төлөх</div>
        </div>

        {/* banks */}
        <div style={{ marginTop: 18, fontSize: 12, color: CLE.muted, fontWeight: 700, letterSpacing:'0.04em', textTransform:'uppercase' }}>Банкны апп сонгох</div>
        <div style={{ marginTop: 10, display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10 }}>
          {banks.map((b, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap: 10, padding:'12px 12px', borderRadius: 14, background:'#fff', border:`1px solid ${CLE.line2}`, cursor:'pointer' }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: b.c, color:'#fff', fontWeight: 800, fontSize: 12, display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>{b.a}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: CLE.ink, lineHeight: 1.2 }}>{b.n}</div>
            </div>
          ))}
        </div>
      </div>
      <LEFooter secondary="Буцах">Төлбөр шалгах</LEFooter>
    </FrameLE>
  );
};

// ============================================================
// 36–39 — PAYMENT STATUS (4 states)
// ============================================================
const PayStatus = ({ label, screenN, state }) => {
  // state: 'waiting' | 'confirmed' | 'failed' | 'timeout'
  const cfg = {
    waiting:   { ring: CLE.indigo, soft: CLE.indigoSoft, title:'Төлбөр баталгаажиж байна', body:'Төлбөрийн мэдээллийг шалгаж байна.', cta:'Төлбөр шалгах', spin:true },
    confirmed: { ring: CLE.green,  soft: CLE.greenSoft,  title:'Төлбөр баталгаажлаа',        body:'ЗМС лавлагаа эхэлж байна.' },
    failed:    { ring: CLE.red,    soft: CLE.redSoft,    title:'Төлбөр баталгаажсангүй',     body:'Төлбөр амжилттай хийгдээгүй байна. Та дахин оролдоно уу.', cta:'Дахин төлөх', dark:true },
    timeout:   { ring: CLE.amber,  soft: CLE.amberSoft,  title:'Төлбөр хүлээгдэж байна',      body:'Хэрэв та төлбөрөө төлсөн бол дахин шалгана уу.', cta:'Дахин шалгах' },
  }[state];

  const glyph = state === 'confirmed' ? (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke={CLE.green} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ) : state === 'failed' ? (
    <svg width="42" height="42" viewBox="0 0 24 24" fill="none"><path d="M7 7l10 10M17 7L7 17" stroke={CLE.red} strokeWidth="3" strokeLinecap="round"/></svg>
  ) : state === 'timeout' ? (
    <svg width="42" height="42" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={CLE.amber} strokeWidth="2.2" fill="none"/><path d="M12 7.5V12l3 2" stroke={CLE.amber} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ) : (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="7" stroke={CLE.indigo} strokeWidth="2" fill="none"/><path d="M12 8v4l2.5 1.5" stroke={CLE.indigo} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  );

  return (
    <FrameLE label={label}>
      <BackBarLE title=""/>
      <div style={{ flex: 1, overflow:'auto', padding: '8px 24px 20px', display:'flex', flexDirection:'column' }}>
        <div style={{ flex: 1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', textAlign:'center' }}>
          <div style={{ position:'relative', width: 110, height: 110, display:'flex', alignItems:'center', justifyContent:'center' }}>
            {cfg.spin && <div className="omf-spin" style={{ position:'absolute', inset: 6, borderRadius:999, border:`4px solid ${cfg.soft}`, borderTopColor: cfg.ring }}/>}
            <div style={{ width: 88, height: 88, borderRadius: 28, background: cfg.soft, display:'flex', alignItems:'center', justifyContent:'center' }}>{glyph}</div>
          </div>
          <div style={{ fontSize: 23, fontWeight: 800, color: CLE.ink, marginTop: 26, letterSpacing:'-0.02em', lineHeight: 1.2 }}>{cfg.title}</div>
          <div style={{ fontSize: 13.5, color: CLE.muted, marginTop: 12, lineHeight: 1.55, maxWidth: 290 }}>{cfg.body}</div>
          {state === 'confirmed' && (
            <div style={{ marginTop: 18, display:'inline-flex', alignItems:'center', gap: 8, padding:'8px 14px', borderRadius: 999, background: CLE.greenSoft, color: CLE.green, fontSize: 12, fontWeight: 700 }}>
              <div className="omf-spin" style={{ width: 14, height: 14, borderRadius:999, border:`2px solid ${CLE.green}`, borderTopColor:'transparent' }}/>
              ЗМС шалгалт руу шилжиж байна
            </div>
          )}
          <div style={{ marginTop: 18, display:'inline-flex', alignItems:'center', gap: 6, padding:'5px 12px', borderRadius: 999, background:'#FAFBFE', border:`1px solid ${CLE.line2}`, fontSize: 11.5, fontWeight: 700, color: CLE.muted }}>
            <DotLE color={cfg.ring}/>ЗМС лавлагаа · ₮4,000
          </div>
        </div>
      </div>
      {cfg.cta && <LEFooter dark={cfg.dark}>{cfg.cta}</LEFooter>}
    </FrameLE>
  );
};

const PayWaiting   = () => <PayStatus label="36 — Payment · Waiting"   state="waiting"/>;
const PayConfirmed = () => <PayStatus label="37 — Payment · Confirmed" state="confirmed"/>;
const PayFailed    = () => <PayStatus label="38 — Payment · Failed"    state="failed"/>;
const PayTimeout   = () => <PayStatus label="39 — Payment · Timeout"   state="timeout"/>;

// ============================================================
// 40 — ЗМС CHECKING
// ============================================================
const ZmsChecking = () => {
  const items = [
    { s:'done',    t:'ЗМС лавлагаа илгээгдлээ' },
    { s:'done',    t:'FICO оноо шалгаж байна' },
    { s:'loading', t:'Өр, орлогын харьцаа тооцоолж байна' },
    { s:'pending', t:'Зээлийн түүх шалгаж байна' },
    { s:'pending', t:'Зээлийн хүсэлтийг шийдвэрлэж байна' },
  ];
  const glyph = (s) => s === 'done'
    ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill={CLE.greenSoft}/><path d="M8 12l3 3 5-6" stroke={CLE.green} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
    : s === 'loading'
    ? <div className="omf-spin" style={{ width: 22, height: 22, borderRadius:999, border:`2.5px solid ${CLE.indigoSoft}`, borderTopColor: CLE.indigo }}/>
    : <div style={{ width: 22, height: 22, borderRadius:999, border:`2px solid ${CLE.line}`, background:'#fff' }}/>;
  return (
    <FrameLE label="40 — ЗМС Checking">
      <div style={{ height: 56, display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}><LogoMarkLE size={24}/></div>
      <div style={{ flex: 1, overflow:'auto', padding: '24px 24px', display:'flex', flexDirection:'column' }}>
        <div style={{ display:'flex', justifyContent:'center', marginTop: 12 }}>
          <div style={{ position:'relative', width: 96, height: 96 }}>
            <div className="omf-spin" style={{ position:'absolute', inset:0, borderRadius:999, border:`4px solid ${CLE.indigoSoft}`, borderTopColor: CLE.indigo }}/>
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none"><path d="M5 19l5-5 3 3 6-8" stroke={CLE.indigo} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 9h5v5" stroke={CLE.indigo} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: CLE.ink, marginTop: 26, letterSpacing:'-0.02em', textAlign:'center', lineHeight: 1.25, textWrap:'pretty' }}>
          Зээлийн хүсэлтийг хянаж байна
        </div>
        <div style={{ fontSize: 13, color: CLE.muted, marginTop: 10, lineHeight: 1.55, textAlign:'center', maxWidth: 300, marginLeft:'auto', marginRight:'auto' }}>
          ЗМС мэдээлэлд үндэслэн таны зээлийн хүсэлтийг хянаж байна.
        </div>
        <div style={{ marginTop: 24, background:'#fff', borderRadius: 18, border:`1px solid ${CLE.line2}`, overflow:'hidden' }}>
          {items.map((it, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap: 12, padding:'13px 14px', borderTop: i ? `1px solid ${CLE.line2}` : 'none' }}>
              <div style={{ flexShrink: 0 }}>{glyph(it.s)}</div>
              <div style={{ flex: 1, fontSize: 13, fontWeight: 700, color: it.s === 'pending' ? CLE.muted2 : CLE.ink }}>{it.t}</div>
            </div>
          ))}
        </div>
      </div>
    </FrameLE>
  );
};

// ============================================================
// 41 — LOAN DECISION RESULTS (accepted / partial)
// ============================================================
const LoanResultCard = ({ rows }) => (
  <div style={{ marginTop: 16, background:'#fff', borderRadius: 18, border:`1px solid ${CLE.line2}`, overflow:'hidden' }}>
    {rows.map((r, i) => (
      <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', borderTop: i ? `1px solid ${CLE.line2}` : 'none' }}>
        <span style={{ fontSize: 12.5, color: CLE.muted, fontWeight: 600 }}>{r.l}</span>
        <span style={{ fontSize: r.strong ? 15 : 13, fontWeight: r.strong ? 800 : 700, color: r.tone || CLE.ink, fontVariantNumeric:'tabular-nums', letterSpacing: r.strong ? '-0.01em' : 0 }}>{r.v}</span>
      </div>
    ))}
  </div>
);

// 41A — ACCEPTED · full requested amount approved
const LoanAccepted = () => (
  <FrameLE label="41 — Result · Accepted">
    <BackBarLE title=""/>
    <div style={{ flex: 1, overflow:'auto', padding: '6px 24px 24px' }}>
      <div style={{
        borderRadius: 22, padding: 24, color:'#fff', textAlign:'center',
        background:`linear-gradient(150deg, ${CLE.green} 0%, #0B8F60 60%, ${CLE.navy3} 140%)`,
        position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute', right:-40, top:-40, width: 160, height: 160, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,255,255,.22), transparent 70%)'}}/>
        <div style={{ position:'relative' }}>
          <div style={{ width: 60, height: 60, borderRadius: 999, margin:'0 auto', background:'rgba(255,255,255,.16)', border:'1px solid rgba(255,255,255,.25)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, marginTop: 14, opacity:.85 }}>Зээлийн хүсэлт зөвшөөрөгдлөө</div>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing:'-0.02em', marginTop: 6, fontVariantNumeric:'tabular-nums' }}>₮ {fmtMNT(LOAN_REQUESTED)}</div>
          <div style={{ fontSize: 12, opacity:.8, marginTop: 4 }}>зөвшөөрсөн дүн</div>
        </div>
      </div>

      <div style={{ fontSize: 20, fontWeight: 800, color: CLE.ink, marginTop: 20, letterSpacing:'-0.02em', lineHeight: 1.25, textWrap:'pretty' }}>
        Зээл бүрэн зөвшөөрөгдлөө
      </div>
      <div style={{ fontSize: 13, color: CLE.muted, marginTop: 8, lineHeight: 1.55 }}>
        Таны хүссэн дүн бүрэн зөвшөөрөгдлөө. Доорх товчоор зээлээ дансандаа авна уу.
      </div>

      <LoanResultCard rows={[
        { l:'Хүссэн дүн', v:'₮ ' + fmtMNT(LOAN_REQUESTED) },
        { l:'Зөвшөөрсөн дүн', v:'₮ ' + fmtMNT(LOAN_REQUESTED), strong:true, tone: CLE.green },
        { l:'Хүү (2.5% / 30 хоног)', v:'₮ ' + fmtMNT(Math.round(LOAN_REQUESTED * 0.025)) },
        { l:'Эргэн төлөх огноо', v:'2026.06.28' },
      ]}/>
    </div>
    <LEFooter>₮{fmtMNT(LOAN_REQUESTED)} зээл авах <Arrow/></LEFooter>
  </FrameLE>
);

// 41B — PARTIALLY ACCEPTED · a lower amount is offered
const LoanPartial = () => (
  <FrameLE label="41A — Result · Partial">
    <BackBarLE title=""/>
    <div style={{ flex: 1, overflow:'auto', padding: '6px 24px 24px' }}>
      <div style={{
        borderRadius: 22, padding: 24, color:'#fff', textAlign:'center',
        background:`linear-gradient(150deg, ${CLE.indigo} 0%, #3D34C9 60%, ${CLE.navy3} 150%)`,
        position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute', right:-40, top:-40, width: 160, height: 160, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,255,255,.20), transparent 70%)'}}/>
        <div style={{ position:'relative' }}>
          <div style={{ width: 60, height: 60, borderRadius: 999, margin:'0 auto', background:'rgba(255,255,255,.16)', border:'1px solid rgba(255,255,255,.25)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, marginTop: 14, opacity:.85 }}>Хэсэгчлэн зөвшөөрөгдлөө</div>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing:'-0.02em', marginTop: 6, fontVariantNumeric:'tabular-nums' }}>₮ {fmtMNT(LOAN_PARTIAL)}</div>
          <div style={{ fontSize: 12, opacity:.8, marginTop: 4 }}>зөвшөөрсөн дүн · хүссэн ₮{fmtMNT(LOAN_REQUESTED)}</div>
        </div>
      </div>

      <div style={{ fontSize: 20, fontWeight: 800, color: CLE.ink, marginTop: 20, letterSpacing:'-0.02em', lineHeight: 1.25, textWrap:'pretty' }}>
        Зээл хэсэгчлэн зөвшөөрөгдлөө
      </div>
      <div style={{ fontSize: 13, color: CLE.muted, marginTop: 8, lineHeight: 1.55 }}>
        Таны хүссэн ₮{fmtMNT(LOAN_REQUESTED)}-аас <strong style={{ color: CLE.ink }}>₮{fmtMNT(LOAN_PARTIAL)}</strong> зээл зөвшөөрөгдлөө. Энэ дүнг авах эсэхээ сонгоно уу.
      </div>

      <LoanResultCard rows={[
        { l:'Хүссэн дүн', v:'₮ ' + fmtMNT(LOAN_REQUESTED) },
        { l:'Зөвшөөрсөн дүн', v:'₮ ' + fmtMNT(LOAN_PARTIAL), strong:true, tone: CLE.indigo },
        { l:'Хүү (2.5% / 30 хоног)', v:'₮ ' + fmtMNT(Math.round(LOAN_PARTIAL * 0.025)) },
        { l:'Эргэн төлөх огноо', v:'2026.06.28' },
      ]}/>
    </div>
    <LEFooter secondary="Татгалзах">₮{fmtMNT(LOAN_PARTIAL)} зээл авах <Arrow/></LEFooter>
  </FrameLE>
);

// ============================================================
// 43 — LOAN DISBURSED (after submit)  [NEW]
// ============================================================
const LoanSubmitted = () => (
  <FrameLE label="43 — Loan disbursed">
    <div style={{ height: 44, flexShrink: 0 }}/>
    <div style={{ flex: 1, overflow:'auto', padding: '6px 24px 22px', display:'flex', flexDirection:'column' }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center' }}>
        <div style={{
          width: 92, height: 92, borderRadius: 28,
          background:`linear-gradient(135deg, ${CLE.green}, #0B8F60)`,
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'0 18px 40px -12px rgba(14,159,110,.55)',
        }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, color: CLE.ink, marginTop: 22, letterSpacing:'-0.02em', lineHeight: 1.2 }}>
          Зээл амжилттай олгогдлоо
        </div>
        <div style={{ fontSize: 13.5, color: CLE.muted, marginTop: 10, lineHeight: 1.55, maxWidth: 290 }}>
          <strong style={{ color: CLE.ink }}>₮ 3,000,000</strong> таны дансанд шилжлээ.
        </div>
      </div>

      {/* summary card */}
      <div style={{ marginTop: 22, background:'#fff', borderRadius: 18, border:`1px solid ${CLE.line2}`, overflow:'hidden' }}>
        {[
          { l:'Олгосон дүн', v:'₮ 3,000,000' },
          { l:'Хүү (2.5% / 30 хоног)', v:'₮ 75,000' },
          { l:'Эргэн төлөх огноо', v:'2026.06.28' },
        ].map((r, i) => (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'13px 16px', borderBottom:`1px solid ${CLE.line2}` }}>
            <span style={{ fontSize: 12.5, color: CLE.muted, fontWeight: 600 }}>{r.l}</span>
            <span style={{ fontSize: 13.5, color: CLE.ink, fontWeight: 700, fontVariantNumeric:'tabular-nums' }}>{r.v}</span>
          </div>
        ))}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px 16px', background:'#FAFBFE' }}>
          <span style={{ fontSize: 13, color: CLE.ink, fontWeight: 800 }}>Нийт эргэн төлөх</span>
          <span style={{ fontSize: 18, color: CLE.indigo, fontWeight: 800, fontVariantNumeric:'tabular-nums', letterSpacing:'-0.01em' }}>₮ 3,075,000</span>
        </div>
      </div>

      <div style={{ marginTop: 14, display:'inline-flex', alignSelf:'center', alignItems:'center', gap: 6, padding:'6px 12px', borderRadius: 999, background: CLE.amberSoft, color: CLE.amber, fontSize: 11.5, fontWeight: 700 }}>
        <DotLE color={CLE.amber}/>Эргэн төлөх өдөр нэг удаа бүтэн төлнө
      </div>

      <div style={{ marginTop: 14, display:'flex', gap: 10, alignItems:'flex-start', padding: 13, borderRadius: 12, background:'#FAFBFE', border:`1px solid ${CLE.line2}` }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop: 1 }}><circle cx="12" cy="12" r="9" stroke={CLE.muted} strokeWidth="2" fill="none"/><path d="M12 8v.5M12 11v5" stroke={CLE.muted} strokeWidth="2" strokeLinecap="round"/></svg>
        <div style={{ fontSize: 11.5, color: CLE.muted, lineHeight: 1.5 }}>
          Эргэн төлөх өдөр дансанд хүрэлцэхүйц үлдэгдэл байршуулна уу. Хугацаа хэтэрвэл нэмэгдүүлсэн хүү тооцогдоно.
        </div>
      </div>
    </div>
    <div style={{ padding:'12px 24px 6px', background:'#fff', borderTop:`1px solid ${CLE.line2}`, flexShrink: 0, display:'flex', flexDirection:'column', gap: 8 }}>
      <button style={{
        width:'100%', height: 52, borderRadius: 14, background: CLE.indigo, color:'#fff', border:'none',
        fontWeight: 700, fontSize: 15, cursor:'pointer', boxShadow:'0 8px 22px -8px rgba(79,70,229,.5)',
        display:'flex', alignItems:'center', justifyContent:'center', gap: 10,
      }}>Дансаа харах <Arrow/></button>
      <button style={{ width:'100%', height: 48, borderRadius: 14, background:'transparent', color: CLE.muted, border:'none', fontWeight: 700, fontSize: 14, cursor:'pointer' }}>Нүүр хуудас руу буцах</button>
    </div>
  </FrameLE>
);

// ============================================================
// 43 — DECLINED (6B)
// ============================================================
const LoanDeclined = () => {
  const reasons = [
    'Өр, орлогын харьцаа өндөр байх',
    'Зээлийн түүх хангалтгүй байх',
    'Идэвхтэй зээлийн ачаалал өндөр байх',
    'Мэдээлэл шинэчлэгдээгүй байх',
  ];
  return (
    <FrameLE label="44 — Declined">
      <BackBarLE title=""/>
      <div style={{ flex: 1, overflow:'auto', padding: '6px 24px 24px' }}>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', marginTop: 8 }}>
          <div style={{ width: 80, height: 80, borderRadius: 26, background:'#F4F5F9', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={CLE.muted} strokeWidth="2" fill="none"/><path d="M8.5 12h7" stroke={CLE.muted} strokeWidth="2.4" strokeLinecap="round"/></svg>
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: CLE.ink, marginTop: 22, letterSpacing:'-0.02em', lineHeight: 1.2 }}>
            Зээлийн хүсэлт<br/>татгалзагдлаа
          </div>
          <div style={{ fontSize: 13, color: CLE.muted, marginTop: 12, lineHeight: 1.6, maxWidth: 300 }}>
            ЗМС мэдээлэл болон зээлийн шалгуурт үндэслэн таны зээлийн хүсэлтийг одоогоор зөвшөөрөх боломжгүй байна.
          </div>
        </div>

        <div style={{ marginTop: 22, fontSize: 12, color: CLE.muted, fontWeight: 700, letterSpacing:'0.04em', textTransform:'uppercase' }}>Боломжит шалтгаанууд</div>
        <div style={{ marginTop: 10, background:'#fff', borderRadius: 16, border:`1px solid ${CLE.line2}`, overflow:'hidden' }}>
          {reasons.map((r, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap: 12, padding:'13px 14px', borderTop: i ? `1px solid ${CLE.line2}` : 'none' }}>
              <div style={{ width: 7, height: 7, borderRadius:999, background: CLE.muted2, flexShrink: 0 }}/>
              <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: CLE.text }}>{r}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 14, display:'flex', alignItems:'center', gap: 10, padding:'12px 14px', borderRadius: 12, background: CLE.indigoSoft }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="4" y="5" width="16" height="16" rx="3" stroke={CLE.indigo} strokeWidth="2" fill="none"/><path d="M8 3v4M16 3v4M4 10h16" stroke={CLE.indigo} strokeWidth="2" strokeLinecap="round"/></svg>
          <div style={{ fontSize: 12.5, color: CLE.ink, fontWeight: 600 }}>Дахин шалгах боломжтой огноо: <span style={{ fontVariantNumeric:'tabular-nums', fontWeight: 800 }}>2026.06.28</span></div>
        </div>
      </div>
      <LEFooter secondary="Дэмжлэгтэй холбогдох">Нүүр хуудас руу буцах</LEFooter>
    </FrameLE>
  );
};

// ============================================================
// EXPORT TO WINDOW
// ============================================================
Object.assign(window, {
  LoanCheckEntry, QPayPayment,
  PayWaiting, PayConfirmed, PayFailed, PayTimeout,
  ZmsChecking, LoanAccepted, LoanPartial, LoanSubmitted, LoanDeclined,
});
