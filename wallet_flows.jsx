// ============================================================
// Money Market Fund — Wallet money-movement flows
// (1) Орлого / Хэтэвч цэнэглэх  — add money (QPay / bank transfer)
// (2) Зарлага  — withdraw to the linked bank account (+ PIN, edge case)
// Reuses screens.jsx atoms + the app's existing visual language.
// ============================================================

const { useState: useStateW } = React;
const { Frame: FrameW, C: CW, BackBar: BackBarW, Dot: DotW, Badge: BadgeW, LogoMark: LogoMarkW } = window;

const fmtW = (n) => n.toLocaleString('en-US');

// Linked bank account (matches the Wallet screen)
const W_BANK = { name:'Хаан Банк', ab:'ХБ', c:'#0E5F2E', holder:'Батболд Тэмүүжин', masked:'•••• 5026 940 450' };
const W_BALANCE = 2180000;

// ---------- shared bits ----------
const ArrowW = ({ c = '#fff' }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

const WFooter = ({ children, secondary, dark = false, disabled = false }) => (
  <div style={{ padding:'12px 24px 6px', background:'#fff', borderTop:`1px solid ${CW.line2}`, flexShrink: 0, display:'flex', flexDirection:'column', gap: 8 }}>
    <button disabled={disabled} style={{
      width:'100%', height: 52, borderRadius: 14, border:'none', cursor: disabled ? 'default' : 'pointer',
      background: disabled ? '#E7E9F2' : (dark ? CW.ink : CW.indigo),
      color: disabled ? CW.muted2 : '#fff', fontWeight: 700, fontSize: 15, letterSpacing:'-0.01em',
      display:'flex', alignItems:'center', justifyContent:'center', gap: 10,
      boxShadow: (disabled || dark) ? 'none' : '0 8px 22px -8px rgba(79,70,229,.5)',
    }}>{children}</button>
    {secondary && (
      <button style={{ width:'100%', height: 48, borderRadius: 14, background:'transparent', color: CW.muted, border:'none', fontWeight: 700, fontSize: 14, cursor:'pointer' }}>{secondary}</button>
    )}
  </div>
);

const AmountCard = ({ amount, setAmount, focused, setFocused, chips, max }) => (
  <div style={{ background:'#fff', borderRadius: 20, border:`1.5px solid ${focused ? CW.indigo : CW.line2}`, boxShadow: focused ? `0 0 0 4px ${CW.indigoSoft}` : 'none', padding: 18, transition:'border-color .15s, box-shadow .15s' }}>
    <div style={{ fontSize: 12, color: CW.muted, fontWeight: 600 }}>Дүн</div>
    <div style={{ display:'flex', alignItems:'baseline', gap: 6, marginTop: 8 }}>
      <span style={{ fontSize: 30, fontWeight: 800, color: CW.indigo, letterSpacing:'-0.02em' }}>₮</span>
      <input
        type="text" inputMode="numeric" data-nodrag
        value={amount === 0 ? '' : fmtW(amount)}
        onChange={(e)=>{ const d = e.target.value.replace(/[^0-9]/g,''); const v = d===''?0:parseInt(d,10); setAmount(max ? Math.min(v, max) : v); }}
        onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
        placeholder="0"
        style={{ flex: 1, minWidth: 0, border:'none', outline:'none', background:'transparent', fontSize: 32, fontWeight: 800, color: CW.ink, letterSpacing:'-0.02em', fontVariantNumeric:'tabular-nums', padding: 0 }}
      />
    </div>
    {chips && (
      <div style={{ display:'flex', gap: 8, marginTop: 16 }}>
        {chips.map((c, i) => {
          const active = amount === c.v;
          return (
            <button key={i} data-nodrag onClick={()=>setAmount(c.v)} style={{
              flex: 1, height: 36, borderRadius: 10, cursor:'pointer',
              background: active ? CW.indigo : '#FAFBFE', border:`1px solid ${active ? CW.indigo : CW.line}`,
              color: active ? '#fff' : CW.muted, fontWeight: 700, fontSize: 12, transition:'all .12s',
            }}>{c.l}</button>
          );
        })}
      </div>
    )}
  </div>
);

const RowsCard = ({ rows, foot }) => (
  <div style={{ background:'#fff', borderRadius: 18, border:`1px solid ${CW.line2}`, overflow:'hidden' }}>
    {rows.map((r, i) => (
      <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'13px 16px', borderTop: i ? `1px solid ${CW.line2}` : 'none' }}>
        <span style={{ fontSize: 12.5, color: CW.muted, fontWeight: 600 }}>{r.l}</span>
        <span style={{ fontSize: r.big ? 15 : 13, fontWeight: r.big ? 800 : 700, color: r.tone || CW.ink, fontVariantNumeric:'tabular-nums', letterSpacing: r.big ? '-0.01em' : 0 }}>{r.v}</span>
      </div>
    ))}
    {foot && (
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px 16px', background:'#FAFBFE' }}>
        <span style={{ fontSize: 13, color: CW.ink, fontWeight: 800 }}>{foot.l}</span>
        <span style={{ fontSize: 20, color: CW.indigo, fontWeight: 800, fontVariantNumeric:'tabular-nums', letterSpacing:'-0.01em' }}>{foot.v}</span>
      </div>
    )}
  </div>
);

const BankRow = ({ label }) => (
  <div>
    {label && <div style={{ fontSize: 12, color: CW.muted, fontWeight: 600, marginBottom: 8 }}>{label}</div>}
    <div style={{ background:'#fff', borderRadius: 14, border:`1px solid ${CW.line2}`, padding: 14, display:'flex', alignItems:'center', gap: 12 }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: W_BANK.c, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{W_BANK.ab}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: CW.ink }}>{W_BANK.name}</div>
        <div style={{ fontSize: 12, color: CW.muted, marginTop: 2, fontVariantNumeric:'tabular-nums' }}>{W_BANK.holder} · {W_BANK.masked}</div>
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color: CW.green, padding:'4px 10px', background: CW.greenSoft, borderRadius: 999, flexShrink: 0 }}>Холбоотой</span>
    </div>
  </div>
);

// deterministic pseudo-QR (placeholder, not scannable)
const QrW = ({ size = 150 }) => {
  const n = 21, cell = size / n; let seed = 13;
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return (seed >> 8) / 0x7fffff % 1; };
  const isFinder = (r, c) => (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
  const rects = [];
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) { if (isFinder(r, c)) continue; if (rnd() > 0.5) rects.push(<rect key={r+'-'+c} x={c*cell} y={r*cell} width={cell} height={cell} fill={CW.ink}/>); }
  const finder = (gx, gy) => (
    <g transform={`translate(${gx*cell},${gy*cell})`}><rect width={cell*7} height={cell*7} fill={CW.ink}/><rect x={cell} y={cell} width={cell*5} height={cell*5} fill="#fff"/><rect x={cell*2} y={cell*2} width={cell*3} height={cell*3} fill={CW.ink}/></g>
  );
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display:'block' }}><rect width={size} height={size} fill="#fff"/>{rects}{finder(0,0)}{finder(n-7,0)}{finder(0,n-7)}</svg>
  );
};

// ---------- transaction PIN (native iOS-style keypad) ----------
const WPinDots = ({ count, error }) => (
  <div style={{ display:'flex', gap: 16, justifyContent:'center' }}>
    {[0,1,2,3,4,5].map(i => (
      <div key={i} style={{ width: 15, height: 15, borderRadius: 999, background: i < count ? (error ? CW.red : CW.indigo) : 'transparent', border:`2px solid ${i < count ? (error ? CW.red : CW.indigo) : CW.line}`, transition:'all .12s' }}/>
    ))}
  </div>
);
const W_LETTERS = { '2':'ABC','3':'DEF','4':'GHI','5':'JKL','6':'MNO','7':'PQRS','8':'TUV','9':'WXYZ' };
const WKeypad = ({ onKey, onDel }) => {
  const Digit = ({ n }) => (
    <button onClick={()=>onKey(n)} style={{ width: 72, height: 72, borderRadius:'50%', border:'none', cursor:'pointer', background:'rgba(120,120,128,0.16)', fontFamily:'-apple-system, system-ui, sans-serif', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap: 1 }}>
      <span style={{ fontSize: 30, fontWeight: 400, color: CW.ink, lineHeight: 1 }}>{n}</span>
      {W_LETTERS[n] && <span style={{ fontSize: 9, fontWeight: 600, letterSpacing:'0.16em', color: CW.muted, marginLeft:'0.16em' }}>{W_LETTERS[n]}</span>}
    </button>
  );
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 72px)', columnGap: 24, rowGap: 14, justifyContent:'center' }}>
      {['1','2','3','4','5','6','7','8','9'].map(n => <Digit key={n} n={n}/>)}
      <div/>
      <Digit n="0"/>
      <button onClick={onDel} style={{ width: 72, height: 72, borderRadius:'50%', border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M9 5h11a1 1 0 011 1v12a1 1 0 01-1 1H9l-6-7 6-7z" stroke={CW.ink} strokeWidth="1.6" strokeLinejoin="round"/><path d="M13 10l4 4M17 10l-4 4" stroke={CW.ink} strokeWidth="1.6" strokeLinecap="round"/></svg>
      </button>
    </div>
  );
};

// ============================================================
// ADD MONEY · A1 — amount + method
// ============================================================
const AddMoneyAmount = () => {
  const [amount, setAmount] = useStateW(500000);
  const [focused, setFocused] = useStateW(false);
  const [method, setMethod] = useStateW('qpay');
  const methods = [
    { id:'qpay', t:'QPay', d:'Банкны апп эсвэл картаар', ic:<g><rect x="4" y="4" width="7" height="7" rx="1.5" stroke={CW.indigo} strokeWidth="2"/><rect x="13" y="4" width="7" height="7" rx="1.5" stroke={CW.indigo} strokeWidth="2"/><rect x="4" y="13" width="7" height="7" rx="1.5" stroke={CW.indigo} strokeWidth="2"/><path d="M14 14h2v2M18 18h2M16 18v2" stroke={CW.indigo} strokeWidth="2" strokeLinecap="round"/></g> },
    { id:'bank', t:'Банкны шилжүүлэг', d:'Дансаар шилжүүлэх', ic:<g stroke={CW.indigo} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10l8-5 8 5"/><path d="M5 10v8m14-8v8M3 21h18M9 10v8M15 10v8"/></g> },
  ];
  return (
    <FrameW label="W1 — Орлого · дүн ба арга">
      <BackBarW title="Хэтэвч цэнэглэх"/>
      <div style={{ flex: 1, overflow:'auto', padding: '6px 24px 24px' }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: CW.ink, letterSpacing:'-0.02em', lineHeight: 1.18 }}>Хэтэвчээ цэнэглэх</div>
        <div style={{ fontSize: 13.5, color: CW.muted, marginTop: 10, lineHeight: 1.55 }}>Цэнэглэх дүн болон аргаа сонгоно уу.</div>

        <div style={{ marginTop: 18 }}>
          <AmountCard amount={amount} setAmount={setAmount} focused={focused} setFocused={setFocused}
            chips={[{l:'₮100к',v:100000},{l:'₮500к',v:500000},{l:'₮1сая',v:1000000},{l:'₮5сая',v:5000000}]}/>
        </div>

        <div style={{ marginTop: 20, fontSize: 12, color: CW.muted, fontWeight: 700, letterSpacing:'0.04em', textTransform:'uppercase' }}>Цэнэглэх арга</div>
        <div style={{ marginTop: 10, display:'flex', flexDirection:'column', gap: 10 }}>
          {methods.map((m) => {
            const sel = method === m.id;
            return (
              <button key={m.id} onClick={()=>setMethod(m.id)} style={{
                textAlign:'left', display:'flex', alignItems:'center', gap: 12, padding: 14, borderRadius: 16, cursor:'pointer',
                background: sel ? CW.indigoSoft : '#fff', border:`1.5px solid ${sel ? CW.indigo : CW.line2}`, transition:'all .15s',
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background:'#fff', border:`1px solid ${CW.line}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">{m.ic}</svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: CW.ink }}>{m.t}</div>
                  <div style={{ fontSize: 11.5, color: CW.muted, marginTop: 2 }}>{m.d}</div>
                </div>
                <div style={{ width: 22, height: 22, borderRadius: 999, border:`2px solid ${sel ? CW.indigo : CW.line}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>
                  {sel && <div style={{ width: 11, height: 11, borderRadius: 999, background: CW.indigo }}/>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <WFooter disabled={amount === 0}>Үргэлжлүүлэх <ArrowW/></WFooter>
    </FrameW>
  );
};

// ============================================================
// ADD MONEY · A2 — QPay
// ============================================================
const AddMoneyQPay = () => {
  const banks = [
    { n:'Хаан банк', c:'#0E5F2E', a:'ХБ' }, { n:'Голомт банк', c:'#0B2A6B', a:'ГБ' },
    { n:'Худалдаа хөгжлийн банк', c:'#1F3A8A', a:'ХХ' }, { n:'Төрийн банк', c:'#0E7490', a:'ТБ' },
  ];
  return (
    <FrameW label="W2 — Орлого · QPay">
      <BackBarW title="QPay-ээр цэнэглэх"/>
      <div style={{ flex: 1, overflow:'auto', padding: '6px 24px 24px' }}>
        <div style={{ background:'#FAFBFE', borderRadius: 16, border:`1px solid ${CW.line2}`, padding: 16, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: CW.muted }}>Цэнэглэх дүн</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: CW.ink, fontVariantNumeric:'tabular-nums', letterSpacing:'-0.02em' }}>₮ 500,000</div>
        </div>

        <div style={{ marginTop: 16, background:'#fff', borderRadius: 18, border:`1px solid ${CW.line2}`, padding: 18, textAlign:'center' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap: 8 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background:'#0A66C2', color:'#fff', fontSize: 11, fontWeight: 800, display:'flex', alignItems:'center', justifyContent:'center' }}>Q</div>
            <span style={{ fontSize: 13, fontWeight: 800, color: CW.ink }}>QPay</span>
          </div>
          <div style={{ display:'inline-block', marginTop: 14, padding: 12, borderRadius: 14, border:`1px solid ${CW.line2}` }}><QrW size={150}/></div>
          <div style={{ fontSize: 12, color: CW.muted, marginTop: 12, fontWeight: 600 }}>QR код уншуулж төлбөрөө хийнэ үү</div>
        </div>

        <div style={{ marginTop: 18, fontSize: 12, color: CW.muted, fontWeight: 700, letterSpacing:'0.04em', textTransform:'uppercase' }}>Банкны апп сонгох</div>
        <div style={{ marginTop: 10, display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10 }}>
          {banks.map((b, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap: 10, padding:'12px 12px', borderRadius: 14, background:'#fff', border:`1px solid ${CW.line2}`, cursor:'pointer' }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: b.c, color:'#fff', fontWeight: 800, fontSize: 12, display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>{b.a}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: CW.ink, lineHeight: 1.2 }}>{b.n}</div>
            </div>
          ))}
        </div>
      </div>
      <WFooter secondary="Буцах">Төлбөр шалгах</WFooter>
    </FrameW>
  );
};

// ============================================================
// ADD MONEY · A2b — bank transfer instructions
// ============================================================
const AddMoneyBank = () => {
  const rows = [
    { l:'Хүлээн авагч банк', v:'Голомт банк' },
    { l:'Дансны дугаар', v:'1105 0024 5588', copy:true },
    { l:'Хүлээн авагч', v:'Мони Маркет Фанд ХХК' },
    { l:'Гүйлгээний утга', v:'MMF-200001281', copy:true, tone: CW.indigo },
  ];
  return (
    <FrameW label="W2b — Орлого · Шилжүүлэг">
      <BackBarW title="Банкны шилжүүлэг"/>
      <div style={{ flex: 1, overflow:'auto', padding: '6px 24px 24px' }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: CW.ink, letterSpacing:'-0.02em', lineHeight: 1.18 }}>Шилжүүлгээр цэнэглэх</div>
        <div style={{ fontSize: 13, color: CW.muted, marginTop: 8, lineHeight: 1.5 }}>Доорх данс руу дараах мэдээллийн дагуу шилжүүлэг хийнэ үү.</div>

        <div style={{ marginTop: 16, background:'#FAFBFE', borderRadius: 16, border:`1px solid ${CW.line2}`, padding: 16, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: CW.muted }}>Шилжүүлэх дүн</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: CW.ink, fontVariantNumeric:'tabular-nums', letterSpacing:'-0.02em' }}>₮ 500,000</div>
        </div>

        <div style={{ marginTop: 14, background:'#fff', borderRadius: 18, border:`1px solid ${CW.line2}`, overflow:'hidden' }}>
          {rows.map((r, i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap: 12, padding:'14px 16px', borderTop: i ? `1px solid ${CW.line2}` : 'none' }}>
              <span style={{ fontSize: 12.5, color: CW.muted, fontWeight: 600, flexShrink: 0 }}>{r.l}</span>
              <span style={{ display:'flex', alignItems:'center', gap: 8, textAlign:'right' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: r.tone || CW.ink, fontVariantNumeric:'tabular-nums' }}>{r.v}</span>
                {r.copy && <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="11" height="11" rx="2" stroke={CW.indigo} strokeWidth="2"/><path d="M5 15V5a2 2 0 012-2h10" stroke={CW.indigo} strokeWidth="2" strokeLinecap="round"/></svg>}
              </span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 14, display:'flex', gap: 10, alignItems:'flex-start', padding: 13, borderRadius: 12, background: CW.amberSoft, border:`1px solid #FFE9C4` }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop: 1 }}><path d="M12 8v5M12 16h.01" stroke={CW.amber} strokeWidth="2.2" strokeLinecap="round"/><circle cx="12" cy="12" r="9" stroke={CW.amber} strokeWidth="2"/></svg>
          <div style={{ fontSize: 11.5, color:'#7A5A1F', lineHeight: 1.5 }}>Гүйлгээний утгыг заавал хуулж бичнэ үү. Орлого 1–5 минутын дотор хэтэвчинд тусгагдана.</div>
        </div>
      </div>
      <WFooter>Шилжүүлгээ хийсэн</WFooter>
    </FrameW>
  );
};

// ============================================================
// ADD MONEY · A3 — success
// ============================================================
const AddMoneySuccess = () => (
  <FrameW label="W3 — Орлого · Амжилттай">
    <div style={{ height: 44, flexShrink: 0 }}/>
    <div style={{ flex: 1, overflow:'auto', padding: '6px 24px 22px', display:'flex', flexDirection:'column' }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center' }}>
        <div style={{ width: 88, height: 88, borderRadius: 28, background:`linear-gradient(135deg, ${CW.green}, #0B8F60)`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 18px 40px -12px rgba(14,159,110,.55)' }}>
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, color: CW.ink, marginTop: 22, letterSpacing:'-0.02em', lineHeight: 1.2 }}>Хэтэвч цэнэглэгдлээ</div>
        <div style={{ fontSize: 13.5, color: CW.muted, marginTop: 10, lineHeight: 1.55, maxWidth: 290 }}>
          <strong style={{ color: CW.ink }}>₮ 500,000</strong> таны хэтэвчинд нэмэгдлээ.
        </div>
      </div>
      <div style={{ marginTop: 22 }}>
        <RowsCard rows={[
          { l:'Цэнэглэсэн дүн', v:'₮ 500,000' },
          { l:'Арга', v:'QPay' },
          { l:'Огноо', v:'2026.06.08 · 14:21' },
        ]} foot={{ l:'Шинэ үлдэгдэл', v:'₮ 2,680,000' }}/>
      </div>
    </div>
    <div style={{ padding:'12px 24px 6px', background:'#fff', borderTop:`1px solid ${CW.line2}`, flexShrink: 0, display:'flex', flexDirection:'column', gap: 8 }}>
      <button style={{ width:'100%', height: 52, borderRadius: 14, background: CW.indigo, color:'#fff', border:'none', fontWeight: 700, fontSize: 15, cursor:'pointer', boxShadow:'0 8px 22px -8px rgba(79,70,229,.5)' }}>Хэтэвч рүү буцах</button>
      <button style={{ width:'100%', height: 48, borderRadius: 14, background:'transparent', color: CW.muted, border:'none', fontWeight: 700, fontSize: 14, cursor:'pointer' }}>Гүйлгээ харах</button>
    </div>
  </FrameW>
);

// ============================================================
// WITHDRAW · W1 — amount + destination
// ============================================================
const WithdrawAmount = () => {
  const [amount, setAmount] = useStateW(1000000);
  const [focused, setFocused] = useStateW(false);
  return (
    <FrameW label="W4 — Зарлага · дүн">
      <BackBarW title="Зарлага гаргах"/>
      <div style={{ flex: 1, overflow:'auto', padding: '6px 24px 24px' }}>
        {/* available balance */}
        <div style={{ background:`linear-gradient(135deg, ${CW.navy} 0%, ${CW.navy3} 100%)`, color:'#fff', borderRadius: 18, padding: 16 }}>
          <div style={{ fontSize: 11, opacity:.7, fontWeight: 600 }}>Боломжит үлдэгдэл · Хэтэвч</div>
          <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4, letterSpacing:'-0.02em', fontVariantNumeric:'tabular-nums' }}>₮ {fmtW(W_BALANCE)}</div>
        </div>

        <div style={{ marginTop: 16 }}>
          <AmountCard amount={amount} setAmount={setAmount} focused={focused} setFocused={setFocused} max={W_BALANCE}
            chips={[{l:'25%',v:Math.round(W_BALANCE*0.25)},{l:'50%',v:Math.round(W_BALANCE*0.5)},{l:'75%',v:Math.round(W_BALANCE*0.75)},{l:'Бүгд',v:W_BALANCE}]}/>
        </div>

        <div style={{ marginTop: 18 }}>
          <BankRow label="Шилжүүлэх данс"/>
        </div>

        <div style={{ marginTop: 14, display:'flex', alignItems:'flex-start', gap: 8, padding: 12, borderRadius: 12, background:'#FAFBFE', border:`1px solid ${CW.line2}` }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:1 }}><circle cx="12" cy="12" r="9" stroke={CW.muted2} strokeWidth="2"/><path d="M12 11v5M12 8h.01" stroke={CW.muted2} strokeWidth="2" strokeLinecap="round"/></svg>
          <div style={{ fontSize: 11.5, color: CW.muted, lineHeight: 1.5 }}>Шимтгэл <strong style={{ color: CW.ink }}>₮0</strong> · Зарлага 1 ажлын өдрийн дотор таны банкны дансанд орно.</div>
        </div>
      </div>
      <WFooter disabled={amount === 0}>Үргэлжлүүлэх <ArrowW/></WFooter>
    </FrameW>
  );
};

// ============================================================
// WITHDRAW · W2 — review + transaction PIN
// ============================================================
const WithdrawReview = () => {
  const [pin, setPin] = useStateW('');
  const onKey = (n) => setPin(p => p.length < 6 ? p + n : p);
  const onDel = () => setPin(p => p.slice(0, -1));
  return (
    <FrameW label="W5 — Зарлага · Баталгаажуулах">
      <BackBarW title="Баталгаажуулах"/>
      <div style={{ flex: 1, overflow:'auto', padding: '4px 24px 16px', display:'flex', flexDirection:'column' }}>
        <RowsCard rows={[
          { l:'Зарлагын дүн', v:'₮ 1,000,000', big:true },
          { l:'Шилжүүлэх данс', v:'Хаан Банк ••••450' },
          { l:'Шимтгэл', v:'₮ 0' },
        ]} foot={{ l:'Дансанд орох дүн', v:'₮ 1,000,000' }}/>

        <div style={{ marginTop: 22, textAlign:'center' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: CW.text }}>Гүйлгээний PIN кодоо оруулна уу</div>
          <div style={{ marginTop: 16 }}><WPinDots count={pin.length}/></div>
        </div>

        <div style={{ flex: 1, minHeight: 14 }}/>
        <WKeypad onKey={onKey} onDel={onDel}/>
      </div>
    </FrameW>
  );
};

// ============================================================
// WITHDRAW · W3 — success
// ============================================================
const WithdrawSuccess = () => (
  <FrameW label="W6 — Зарлага · Амжилттай">
    <div style={{ height: 44, flexShrink: 0 }}/>
    <div style={{ flex: 1, overflow:'auto', padding: '6px 24px 22px', display:'flex', flexDirection:'column' }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center' }}>
        <div style={{ width: 88, height: 88, borderRadius: 28, background:`linear-gradient(135deg, ${CW.green}, #0B8F60)`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 18px 40px -12px rgba(14,159,110,.55)' }}>
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, color: CW.ink, marginTop: 22, letterSpacing:'-0.02em', lineHeight: 1.2 }}>Зарлага амжилттай</div>
        <div style={{ fontSize: 13.5, color: CW.muted, marginTop: 10, lineHeight: 1.55, maxWidth: 290 }}>
          <strong style={{ color: CW.ink }}>₮ 1,000,000</strong> таны Хаан банкны данс руу шилжиж байна.
        </div>
      </div>
      <div style={{ marginTop: 22 }}>
        <RowsCard rows={[
          { l:'Зарлагын дүн', v:'₮ 1,000,000' },
          { l:'Шилжүүлсэн данс', v:'Хаан Банк ••••450' },
          { l:'Шинэ үлдэгдэл', v:'₮ 1,180,000' },
        ]}/>
      </div>
      <div style={{ marginTop: 14, alignSelf:'center', display:'inline-flex', alignItems:'center', gap: 6, padding:'6px 12px', borderRadius: 999, background: CW.amberSoft, color: CW.amber, fontSize: 11.5, fontWeight: 700 }}>
        <DotW color={CW.amber}/>1 ажлын өдрийн дотор дансанд орно
      </div>
    </div>
    <div style={{ padding:'12px 24px 6px', background:'#fff', borderTop:`1px solid ${CW.line2}`, flexShrink: 0 }}>
      <button style={{ width:'100%', height: 52, borderRadius: 14, background: CW.indigo, color:'#fff', border:'none', fontWeight: 700, fontSize: 15, cursor:'pointer', boxShadow:'0 8px 22px -8px rgba(79,70,229,.5)' }}>Дуусгах</button>
    </div>
  </FrameW>
);

// ============================================================
// WITHDRAW · edge — insufficient balance
// ============================================================
const WithdrawInsufficient = () => (
  <FrameW label="W7 — Зарлага · Үлдэгдэл хүрэлцэхгүй">
    <BackBarW title="Зарлага гаргах"/>
    <div style={{ flex: 1, overflow:'auto', padding: '6px 24px 24px', display:'flex', flexDirection:'column' }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', marginTop: 12 }}>
        <div style={{ width: 80, height: 80, borderRadius: 26, background: CW.redSoft, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none"><path d="M12 8v5M12 16.5h.01" stroke={CW.red} strokeWidth="2.4" strokeLinecap="round"/><circle cx="12" cy="12" r="9" stroke={CW.red} strokeWidth="2.2" fill="none"/></svg>
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: CW.ink, marginTop: 22, letterSpacing:'-0.02em', lineHeight: 1.2 }}>Үлдэгдэл хүрэлцэхгүй байна</div>
        <div style={{ fontSize: 13, color: CW.muted, marginTop: 12, lineHeight: 1.6, maxWidth: 300 }}>
          Таны оруулсан дүн боломжит үлдэгдлээс их байна. Дүнгээ багасгах эсвэл хэтэвчээ цэнэглэнэ үү.
        </div>
      </div>
      <div style={{ marginTop: 22 }}>
        <RowsCard rows={[
          { l:'Оруулсан дүн', v:'₮ 3,500,000', tone: CW.red },
          { l:'Боломжит үлдэгдэл', v:'₮ 2,180,000', big:true },
          { l:'Дутагдаж буй дүн', v:'₮ 1,320,000', tone: CW.red },
        ]}/>
      </div>
    </div>
    <WFooter secondary="Дүн засах" dark>Хэтэвч цэнэглэх</WFooter>
  </FrameW>
);

// ============================================================
// EXPORT TO WINDOW
// ============================================================
Object.assign(window, {
  AddMoneyAmount, AddMoneyQPay, AddMoneyBank, AddMoneySuccess,
  WithdrawAmount, WithdrawReview, WithdrawSuccess, WithdrawInsufficient,
});
