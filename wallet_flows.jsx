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
const W_BALANCE = 12000000;

// ---------- shared bits ----------
const ArrowW = ({ c = '#fff' }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

const WFooter = ({ children, secondary, onSecondary, dark = false, disabled = false }) => (
  <div style={{ padding:'12px 24px 6px', background:'#fff', borderTop:`1px solid ${CW.line2}`, flexShrink: 0, display:'flex', flexDirection:'column', gap: 8 }}>
    <button disabled={disabled} style={{
      width:'100%', height: 52, borderRadius: 14, border:'none', cursor: disabled ? 'default' : 'pointer',
      background: disabled ? '#E7E9F2' : (dark ? CW.ink : CW.indigo),
      color: disabled ? CW.muted2 : '#fff', fontWeight: 700, fontSize: 15, letterSpacing:'-0.01em',
      display:'flex', alignItems:'center', justifyContent:'center', gap: 10,
      boxShadow: (disabled || dark) ? 'none' : '0 8px 22px -8px rgba(79,70,229,.5)',
    }}>{children}</button>
    {secondary && (
      <button onClick={onSecondary} data-nodrag={onSecondary ? '' : undefined} style={{ width:'100%', height: 48, borderRadius: 14, background:'transparent', color: CW.muted, border:'none', fontWeight: 700, fontSize: 14, cursor:'pointer' }}>{secondary}</button>
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
        <div data-pay-method={method} style={{ marginTop: 10, display:'flex', flexDirection:'column', gap: 10 }}>
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
// ADD MONEY · A2b — bank transfer details (copy fields + toast)
// ============================================================
const AddMoneyBank = () => {
  const [copiedKey, setCopiedKey] = useStateW(null);
  const AMOUNT = 500000;
  const REF = 'MMF-200001281';

  // MMF holds a receiving account at each bank — pick the one you bank with so the
  // transfer stays intra-bank (instant, no interbank fee).
  const RECEIVERS = [
    { id:'khan',   short:'Хаан',   name:'Хаан Банк',              ab:'ХААН', c:'#0E7C4A', acct:'5041 28100 1281' },
    { id:'golomt', short:'Голомт', name:'Голомт банк',            ab:'ГБ',   c:'#0B5CAB', acct:'1165 0012 8100' },
    { id:'tdb',    short:'ХХБ',    name:'Худалдаа хөгжлийн банк', ab:'ХХБ',  c:'#0A2A6B', acct:'4990 1281 0028' },
    { id:'state',  short:'Төрийн', name:'Төрийн банк',            ab:'ТБ',   c:'#0E8F8A', acct:'1050 0128 1005' },
  ];
  const [bank, setBank] = useStateW(RECEIVERS[0]);

  const fields = [
    { key:'bank',   l:'Хүлээн авах банк',  v:bank.name              },
    { key:'acct',   l:'Дансны дугаар',      v:bank.acct              },
    { key:'name',   l:'Хүлээн авагч',       v:'Мони Маркет Фанд ХХК' },
    { key:'amount', l:'Шилжүүлэх дүн',      v:`₮ ${fmtW(AMOUNT)}`    },
    { key:'ref',    l:'Гүйлгээний утга',    v:REF, highlight:true     },
  ];

  const tap = (key) => {
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(k => k === key ? null : k), 1800);
  };

  const CopyBtn = ({ fkey }) => {
    const done = copiedKey === fkey || copiedKey === 'all';
    return (
      <button data-nodrag onClick={() => tap(fkey)} style={{
        flexShrink:0, border:'none', borderRadius:8, padding:'5px 9px', cursor:'pointer',
        background: done ? CW.greenSoft : CW.indigoSoft,
        color: done ? CW.green : CW.indigo,
        fontSize:11, fontWeight:700,
        display:'flex', alignItems:'center', gap:4,
        transition:'all .15s', whiteSpace:'nowrap',
      }}>
        {done
          ? <><svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke={CW.green} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>Хуулагдлаа</>
          : <><svg width="11" height="11" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="11" height="11" rx="2" stroke={CW.indigo} strokeWidth="2"/><path d="M5 15V5a2 2 0 012-2h10" stroke={CW.indigo} strokeWidth="2" strokeLinecap="round"/></svg>Хуулах</>
        }
      </button>
    );
  };

  return (
    <FrameW label="W2b — Орлого · Дансаар шилжүүлэх">
      <BackBarW title="Дансаар шилжүүлэх"/>
      <div style={{ flex:1, overflow:'auto', padding:'6px 24px 24px' }}>
        <div style={{ fontSize:22, fontWeight:800, color:CW.ink, letterSpacing:'-0.02em', lineHeight:1.18 }}>Шилжүүлгийн мэдээлэл</div>
        <div style={{ fontSize:13, color:CW.muted, marginTop:8, lineHeight:1.5 }}>Доорх мэдээллийг банкны аппдаа хуулж шилжүүлэг хийнэ үү.</div>

        <div style={{ marginTop:18, fontSize:12, color:CW.muted, fontWeight:700, letterSpacing:'0.04em', textTransform:'uppercase' }}>Аль банкнаас шилжүүлэх вэ?</div>
        <div style={{ display:'flex', gap:8, marginTop:10, overflowX:'auto', marginLeft:-24, marginRight:-24, paddingLeft:24, paddingRight:24 }}>
          {RECEIVERS.map(b => {
            const sel = bank.id === b.id;
            return (
              <button key={b.id} data-nodrag onClick={()=>{ setBank(b); setCopiedKey(null); }} style={{
                flexShrink:0, display:'flex', alignItems:'center', gap:8, padding:'8px 14px 8px 8px', borderRadius:999, cursor:'pointer',
                background: sel ? CW.indigoSoft : '#fff', border:`1.5px solid ${sel ? CW.indigo : CW.line2}`, transition:'all .15s',
              }}>
                <span style={{ width:26, height:26, borderRadius:8, background:b.c, color:'#fff', fontSize:8.5, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{b.ab}</span>
                <span style={{ fontSize:13, fontWeight:700, color: sel ? CW.indigo : CW.ink, whiteSpace:'nowrap' }}>{b.short}</span>
              </button>
            );
          })}
        </div>
        <div style={{ fontSize:11.5, color:CW.muted, marginTop:9, lineHeight:1.5 }}>Үйлчлүүлэгчийнхээ банкыг сонговол дотоод шилжүүлэг болж, төлбөргүй шууд орно.</div>

        <div style={{ marginTop:16, background:'#fff', borderRadius:18, border:`1px solid ${CW.line2}`, overflow:'hidden' }}>
          {fields.map((f, i) => (
            <div key={f.key} style={{
              display:'flex', justifyContent:'space-between', alignItems:'center', gap:10,
              padding:'13px 14px 13px 16px',
              borderTop: i ? `1px solid ${CW.line2}` : 'none',
              background: f.highlight ? 'rgba(255,233,196,.25)' : 'transparent',
            }}>
              <span style={{ fontSize:12.5, color:CW.muted, fontWeight:600, flexShrink:0, minWidth:96 }}>{f.l}</span>
              <span style={{ display:'flex', alignItems:'center', gap:8, flex:1, justifyContent:'flex-end', minWidth:0 }}>
                <span style={{ fontSize:13, fontWeight:700, color: f.highlight ? '#5E4413' : CW.ink, fontVariantNumeric:'tabular-nums', textAlign:'right', letterSpacing: f.highlight ? '0.02em' : 0 }}>{f.v}</span>
                <CopyBtn fkey={f.key}/>
              </span>
            </div>
          ))}
        </div>

        <div style={{ marginTop:12, display:'flex', gap:10, alignItems:'flex-start', padding:14, borderRadius:14, background:CW.amberSoft, border:`1px solid #FFE9C4` }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:1 }}><path d="M12 8v5M12 16h.01" stroke={CW.amber} strokeWidth="2.2" strokeLinecap="round"/><circle cx="12" cy="12" r="9" stroke={CW.amber} strokeWidth="2"/></svg>
          <div style={{ fontSize:12, color:'#7A5A1F', lineHeight:1.55 }}>
            <strong style={{ color:'#5E4413' }}>Гүйлгээний утга</strong>-г яг{' '}<strong style={{ color:'#5E4413', letterSpacing:'0.02em' }}>{REF}</strong> гэж бичнэ үү — буруу бичвэл орлогыг автоматаар таних боломжгүй болно.
          </div>
        </div>
      </div>
      <WFooter>
        Шилжүүлэг хийсэн <ArrowW/>
      </WFooter>
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
  const W_FEE = 300;
  const maxWithdraw = W_BALANCE - W_FEE;
  const over = amount + W_FEE > W_BALANCE;
  const bigTxn = amount > 5000000;
  const sched = (() => {
    const now = new Date();
    const day = now.getDay();
    const hr = now.getHours() + now.getMinutes() / 60;
    const wd = day >= 1 && day <= 5;
    if (wd && hr >= 9 && hr < 16) return { today: true, label: 'Өнөөдөр ажлын цагт' };
    if (wd && hr < 9) return { today: false, label: 'Өнөөдөр 09:00' };
    const names = ['Ням','Даваа','Мягмар','Лхагва','Пүрэв','Баасан','Бямба'];
    const d = new Date(now); let add = 0;
    do { d.setDate(d.getDate() + 1); add++; } while (d.getDay() === 0 || d.getDay() === 6);
    return { today: false, label: (add === 1 ? 'Маргааш' : names[d.getDay()]) + ' 09:00' };
  })();
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
            chips={[{l:'25%',v:Math.round(W_BALANCE*0.25)},{l:'50%',v:Math.round(W_BALANCE*0.5)},{l:'75%',v:Math.round(W_BALANCE*0.75)},{l:'Бүгд',v:maxWithdraw}]}/>
        </div>

        {/* live fee breakdown */}
        {amount > 0 && (
          <div style={{ marginTop: 14, background:'#FAFBFE', borderRadius: 16, border:`1px solid ${CW.line2}`, overflow:'hidden' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 16px' }}>
              <span style={{ fontSize: 12.5, color: CW.muted, fontWeight: 600 }}>Шимтгэл</span>
              <span style={{ fontSize: 13, color: CW.ink, fontWeight: 700, fontVariantNumeric:'tabular-nums' }}>₮ {fmtW(W_FEE)}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 16px', borderTop:`1px solid ${CW.line2}` }}>
              <span style={{ fontSize: 12.5, color: CW.muted, fontWeight: 600 }}>Таны данс руу орох дүн</span>
              <span style={{ fontSize: 13, color: CW.ink, fontWeight: 700, fontVariantNumeric:'tabular-nums' }}>₮ {fmtW(amount)}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 16px', background: over ? CW.redSoft : '#F4F6FB' }}>
              <span style={{ fontSize: 13, color: over ? CW.red : CW.ink, fontWeight: 800 }}>Нийт хасагдах дүн</span>
              <span style={{ fontSize: 16, color: over ? CW.red : CW.indigo, fontWeight: 800, fontVariantNumeric:'tabular-nums', letterSpacing:'-0.01em' }}>₮ {fmtW(amount + W_FEE)}</span>
            </div>
          </div>
        )}

        {/* large-transaction rule (> ₮5M) — concise schedule + lock notice */}
        {bigTxn && (
          <div style={{ marginTop: 12, background:'#FFFBF2', border:'1px solid #FFE9C4', borderRadius: 14, padding:'12px 14px', display:'flex', gap: 10, alignItems:'flex-start' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:1 }}><circle cx="12" cy="12" r="9" stroke="#B7791F" strokeWidth="2"/><path d="M12 7.5V12l3 2" stroke="#B7791F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 800, color:'#7A5A1F' }}>Их дүнтэй гүйлгээ</div>
              <div style={{ fontSize: 11.5, color:'#8A6A2F', marginTop: 3, lineHeight: 1.45 }}>5 сая ₮-с дээш дүн ажлын өдрийн 09:00–16:00 цагт шилжинэ.</div>
            </div>
          </div>
        )}

        {/* insufficient-balance error + tap to fill */}
        {over && (
          <button onClick={() => setAmount(maxWithdraw)} data-nodrag style={{ width:'100%', marginTop: 10, textAlign:'left', display:'flex', gap: 10, alignItems:'flex-start', padding: 13, borderRadius: 12, background: CW.redSoft, border:`1px solid #F7CFCF`, cursor:'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:1 }}><path d="M12 8v5M12 16h.01" stroke={CW.red} strokeWidth="2.2" strokeLinecap="round"/><circle cx="12" cy="12" r="9" stroke={CW.red} strokeWidth="2"/></svg>
            <div style={{ fontSize: 12, color:'#9B2C2C', lineHeight: 1.5 }}>Шимтгэл ₮ 300 нэмэгдэхэд үлдэгдэл хүрэлцэхгүй байна. Татах боломжит дүн: <strong style={{ fontVariantNumeric:'tabular-nums' }}>₮ {fmtW(maxWithdraw)}</strong> <span style={{ color: CW.red, fontWeight: 700, textDecoration:'underline' }}>— энэ дүнгээр бөглөх</span></div>
          </button>
        )}

        <div style={{ marginTop: 18 }}>
          <BankRow label="Шилжүүлэх данс"/>
        </div>

        <div style={{ marginTop: 14, display:'flex', alignItems:'flex-start', gap: 8, padding: 12, borderRadius: 12, background:'#FAFBFE', border:`1px solid ${CW.line2}` }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:1 }}><circle cx="12" cy="12" r="9" stroke={CW.muted2} strokeWidth="2"/><path d="M12 11v5M12 8h.01" stroke={CW.muted2} strokeWidth="2" strokeLinecap="round"/></svg>
          <div style={{ fontSize: 11.5, color: CW.muted, lineHeight: 1.5 }}>Зарлага 1 ажлын өдрийн дотор таны банкны дансанд орно.</div>
        </div>
      </div>
      <WFooter disabled={amount === 0 || over}>Үргэлжлүүлэх <ArrowW/></WFooter>
    </FrameW>
  );
};

// ============================================================
// WITHDRAW · W2 — review + transaction PIN
// ============================================================
const WithdrawReview = () => (
  <FrameW label="W5 — Зарлага · Баталгаажуулах">
    <BackBarW title="Баталгаажуулах"/>
    <div style={{ flex: 1, overflow:'auto', padding: '4px 24px 16px', display:'flex', flexDirection:'column' }}>
      <RowsCard rows={[
        { l:'Дансанд орох дүн', v:'₮ 1,000,000', big:true },
        { l:'Шилжүүлэх данс', v:'Хаан Банк ••••450' },
        { l:'Шимтгэл', v:'₮ 300', tone: CW.red },
      ]} foot={{ l:'Нийт хасагдах дүн', v:'₮ 1,000,300' }}/>

      <div style={{ marginTop: 14, display:'flex', alignItems:'flex-start', gap: 8, padding: 12, borderRadius: 12, background:'#FAFBFE', border:`1px solid ${CW.line2}` }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:1 }}><circle cx="12" cy="12" r="9" stroke={CW.muted2} strokeWidth="2"/><path d="M12 11v5M12 8h.01" stroke={CW.muted2} strokeWidth="2" strokeLinecap="round"/></svg>
        <div style={{ fontSize: 11.5, color: CW.muted, lineHeight: 1.5 }}>Зарлага 1 ажлын өдрийн дотор таны банкны дансанд орно.</div>
      </div>
      <div style={{ flex: 1, minHeight: 14 }}/>
    </div>
    <WFooter>Үргэлжлүүлэх <ArrowW/></WFooter>
  </FrameW>
);

// ============================================================
// WITHDRAW · W5b — transaction PIN (its own step)
// ============================================================
const WithdrawPin = () => (
  <PinConfirm
    label="W5b — Зарлага · ПИН"
    subtitle="Зарлага гаргах гүйлгээг баталгаажуулна уу."
    amount="₮ 1,000,300"
    amountLabel="Зарлага гаргах дүн"
    ctaLabel="Зарлага гаргах"
  />
);

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
          { l:'Шимтгэл', v:'₮ 300' },
          { l:'Шилжүүлсэн данс', v:'Хаан Банк ••••450' },
          { l:'Шинэ үлдэгдэл', v:'₮ 1,179,700' },
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
// ADD MONEY · A2c — bank transfer pending
// ============================================================
const AddMoneyBankPending = () => (
  <FrameW label="W2c — Орлого · Гүйлгээг шалгаж байна">
    <BackBarW title=""/>
    <div style={{ flex:1, overflow:'auto', padding:'8px 24px 24px', display:'flex', flexDirection:'column' }}>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', textAlign:'center', paddingBottom:24 }}>
        <div style={{ position:'relative', width:100, height:100, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:26 }}>
          <div className="omf-spin" style={{ position:'absolute', inset:0, borderRadius:999, border:`4px solid ${CW.indigoSoft}`, borderTopColor:CW.indigo }}/>
          <div style={{ width:68, height:68, borderRadius:22, background:CW.indigoSoft, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="13" rx="3" stroke={CW.indigo} strokeWidth="2"/><path d="M2 11h20M7 4h10" stroke={CW.indigo} strokeWidth="2" strokeLinecap="round"/></svg>
          </div>
        </div>
        <div style={{ fontSize:22, fontWeight:800, color:CW.ink, letterSpacing:'-0.02em', lineHeight:1.2 }}>Гүйлгээг шалгаж байна</div>
        <div style={{ fontSize:13.5, color:CW.muted, marginTop:12, lineHeight:1.55, maxWidth:290 }}>
          Шилжүүлэг хийсний дараа орлого хэдэн минутын дотор хэтэвчинд тусгагдана.
        </div>
        <div style={{ marginTop:20, display:'inline-flex', alignItems:'center', gap:7, padding:'8px 14px', borderRadius:999, background:'#FAFBFE', border:`1px solid ${CW.line2}` }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={CW.muted2} strokeWidth="2"/><path d="M12 7.5V12l3 2" stroke={CW.muted2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span style={{ fontSize:12, color:CW.muted, fontWeight:600 }}>1–5 минут хүлээгдэнэ</span>
        </div>
      </div>
    </div>
    <WFooter secondary="Хэтэвч рүү буцах">Дахин шалгах <ArrowW/></WFooter>
  </FrameW>
);

// ============================================================
// ADD MONEY · A2d — bank transfer confirmed
// ============================================================
const AddMoneyBankSuccess = () => (
  <FrameW label="W2d — Орлого · Дансаар амжилттай">
    <div style={{ height:44, flexShrink:0 }}/>
    <div style={{ flex:1, overflow:'auto', padding:'6px 24px 22px', display:'flex', flexDirection:'column' }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center' }}>
        <div style={{ width:88, height:88, borderRadius:28, background:`linear-gradient(135deg, ${CW.green}, #0B8F60)`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 18px 40px -12px rgba(14,159,110,.55)' }}>
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{ fontSize:24, fontWeight:800, color:CW.ink, marginTop:22, letterSpacing:'-0.02em', lineHeight:1.2 }}>Хэтэвч цэнэглэгдлээ</div>
        <div style={{ fontSize:13.5, color:CW.muted, marginTop:10, lineHeight:1.55, maxWidth:290 }}>
          <strong style={{ color:CW.ink }}>₮ 500,000</strong> таны хэтэвчинд нэмэгдлээ.
        </div>
      </div>
      <div style={{ marginTop:22 }}>
        <RowsCard rows={[
          { l:'Цэнэглэсэн дүн', v:'₮ 500,000' },
          { l:'Арга', v:'Дансаар шилжүүлэх' },
          { l:'Гүйлгээний утга', v:'MMF-200001281' },
          { l:'Огноо', v:'2026.06.12 · 10:45' },
        ]} foot={{ l:'Шинэ үлдэгдэл', v:'₮ 2,680,000' }}/>
      </div>
    </div>
    <div style={{ padding:'12px 24px 6px', background:'#fff', borderTop:`1px solid ${CW.line2}`, flexShrink:0, display:'flex', flexDirection:'column', gap:8 }}>
      <button style={{ width:'100%', height:52, borderRadius:14, background:CW.indigo, color:'#fff', border:'none', fontWeight:700, fontSize:15, cursor:'pointer', boxShadow:'0 8px 22px -8px rgba(79,70,229,.5)' }}>Хэтэвч рүү буцах</button>
      <button style={{ width:'100%', height:48, borderRadius:14, background:'transparent', color:CW.muted, border:'none', fontWeight:700, fontSize:14, cursor:'pointer' }}>Гүйлгээ харах</button>
    </div>
  </FrameW>
);

// ============================================================
// ADD MONEY · A2e — bank transfer not found / timeout
// ============================================================
const AddMoneyBankNotFound = () => (
  <FrameW label="W2e — Орлого · Гүйлгээ олдсонгүй">
    <BackBarW title=""/>
    <div style={{ flex:1, overflow:'auto', padding:'6px 24px 24px', display:'flex', flexDirection:'column' }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', marginTop:16 }}>
        <div style={{ width:84, height:84, borderRadius:26, background:CW.amberSoft, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke={CW.amber} strokeWidth="2.2" fill="none"/>
            <path d="M12 7.5V12l3.5 2" stroke={CW.amber} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ fontSize:22, fontWeight:800, color:CW.ink, marginTop:20, letterSpacing:'-0.02em', lineHeight:1.2 }}>Гүйлгээ олдсонгүй</div>
        <div style={{ fontSize:13, color:CW.muted, marginTop:12, lineHeight:1.6, maxWidth:300 }}>
          Гүйлгээний утга буруу эсвэл шилжүүлэг хоцрогдсон байж болно. Хэдэн минутын дараа дахин шалгана уу.
        </div>
      </div>
      <div style={{ marginTop:22, display:'flex', flexDirection:'column', gap:10 }}>
        <div style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'13px 14px', borderRadius:14, background:CW.amberSoft, border:`1px solid #FFE9C4` }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:1 }}><path d="M12 8v5M12 16h.01" stroke={CW.amber} strokeWidth="2.2" strokeLinecap="round"/><circle cx="12" cy="12" r="9" stroke={CW.amber} strokeWidth="2"/></svg>
          <div style={{ fontSize:12, color:'#7A5A1F', lineHeight:1.5 }}>Гүйлгээний утга <strong style={{ letterSpacing:'0.02em' }}>MMF-200001281</strong> гэж бичсэн эсэхийг банкны аппдаа шалгана уу.</div>
        </div>
        <button style={{ width:'100%', height:44, borderRadius:12, background:'transparent', color:CW.indigo, border:`1.5px solid ${CW.indigo}`, fontWeight:700, fontSize:13.5, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke={CW.indigo} strokeWidth="2" strokeLinejoin="round"/></svg>
          Дэмжлэгтэй холбогдох
        </button>
      </div>
    </div>
    <WFooter secondary="Хэтэвч рүү буцах">Дахин шалгах <ArrowW/></WFooter>
  </FrameW>
);

// ============================================================
// TRANSACTION HISTORY — full "See all" list with type filter chips
// ============================================================
const TX_TYPES = [
  { k:'all',      l:'Бүгд' },
  { k:'deposit',  l:'Орлого' },
  { k:'withdraw', l:'Зарлага' },
  { k:'buy',      l:'Худалдан авалт' },
  { k:'sell',     l:'Зарсан' },
];
const TX_DATA = [
  { type:'deposit',  t:'Орлого · Дансаар',           d:'2026-05-22', a:'500,000',    sign:'+', time:'10:24', via:'Хаан Банк 5041 28100 1281', ref:'MMF-200001281', bal:'2,680,000' },
  { type:'deposit',  t:'Орлого · QPay',              d:'2026-05-21', a:'5,000,000',  sign:'+', time:'14:02', via:'QPay · Хаан Банк', ref:'QP-88421905' },
  { type:'buy',      t:'Захиалга · MSTRT 2400',      d:'2026-05-20', a:'10,000,000', sign:'-', time:'11:36', via:'Анхдагч зах', ref:'ORD-4471120' },
  { type:'deposit',  t:'Эргэн төлөлт · CAPIT 1450',  d:'2026-05-18', a:'1,145,000',  sign:'+', time:'09:00', via:'Хугацаа дууссан', ref:'RPY-1450029' },
  { type:'sell',     t:'Зарсан · GOLDH 2300',        d:'2026-05-15', a:'12,000,000', sign:'+', time:'15:20', via:'Хоёрдогч зах', ref:'SEL-2300088' },
  { type:'withdraw', t:'Зарлага · Хаан банк',        d:'2026-05-12', a:'1,000,300',  sign:'-', time:'10:11', via:'Хаан банк •••• 4567', ref:'WDR-7710422', fee:'300' },
  { type:'buy',      t:'Захиалга · INV 0820',        d:'2026-05-09', a:'4,300,000',  sign:'-', time:'13:45', via:'Анхдагч зах', ref:'ORD-4460918' },
  { type:'deposit',  t:'Орлого · Дансаар',           d:'2026-04-28', a:'2,000,000',  sign:'+', time:'16:07', via:'Голомт банк', ref:'MMF-200001281' },
  { type:'deposit',  t:'Хүүгийн төлөлт · NEXT 7.5',  d:'2026-04-22', a:'285,000',    sign:'+', time:'09:00', via:'Сар тутмын хүү', ref:'INT-0750221' },
  { type:'withdraw', t:'Зарлага · Хаан банк',        d:'2026-04-20', a:'500,300',    sign:'-', time:'11:52', via:'Хаан банк •••• 4567', ref:'WDR-7690420', fee:'300' },
  { type:'buy',      t:'Захиалга · CAPIT 1620',      d:'2026-04-14', a:'9,400,000',  sign:'-', time:'10:30', via:'Анхдагч зах', ref:'ORD-4440414' },
];
// The wallet top-up the "Хэтэвч цэнэглэгдлээ" notification points at.
const TX_TOPUP = TX_DATA[0];
const TX_FAILED = { type:'withdraw', t:'Шилжүүлэг амжилтгүй', d:'2026-05-22', a:'1,000,000', sign:'-', time:'09:12', via:'Хаан банк •••• 4567', ref:'WDR-7710519', failed:true };
const txVisual = (type) => ({
  deposit:  { bg: CW.greenSoft,  fg: CW.green,  glyph:<path d="M12 5v14M19 12l-7 7-7-7" stroke={CW.green} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/> },
  withdraw: { bg: CW.indigoSoft, fg: CW.indigo, glyph:<path d="M12 19V5M5 12l7-7 7 7" stroke={CW.indigo} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/> },
  buy:      { bg: CW.blueSoft,   fg: CW.blue,   glyph:<><circle cx="9" cy="20" r="1.4" fill={CW.blue}/><circle cx="17" cy="20" r="1.4" fill={CW.blue}/><path d="M3 4h2l2.2 11h10l1.8-8H6" stroke={CW.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></> },
  sell:     { bg: CW.amberSoft,  fg: CW.amber,  glyph:<path d="M4 13l8-8 8 8-8 8-8-8z M12 9v4" stroke={CW.amber} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/> },
}[type] || { bg: CW.line2, fg: CW.muted2, glyph:null });
const txMonthLabel = (m) => { const [y, mo] = m.split('-'); return `${y} оны ${parseInt(mo, 10)}-р сар`; };

const TX_TYPE_LABEL = { deposit:'Орлого', withdraw:'Зарлага', buy:'Худалдан авалт', sell:'Зарсан' };

// ---- one transaction, opened from Гүйлгээний түүх or a Гүйлгээ notification ----
const TxDetail = ({ tx }) => {
  const t = tx || TX_DATA[0];
  const v = txVisual(t.type);
  const inflow = t.sign === '+';
  const bad = !!t.failed;
  const rows = [
    ['Гүйлгээний төрөл', TX_TYPE_LABEL[t.type] || 'Гүйлгээ'],
    ['Огноо', t.d + (t.time ? ' · ' + t.time : '')],
    [inflow ? 'Хаанаас' : 'Хаашаа', t.via || '—'],
    ['Гүйлгээний дугаар', t.ref || '—'],
    ['Шимтгэл', t.fee ? '₮ ' + t.fee : '₮ 0'],
  ];
  if (t.bal) rows.push(['Шинэ үлдэгдэл', '₮ ' + t.bal]);
  return (
    <FrameW label="W8b — Гүйлгээний дэлгэрэнгүй">
      <BackBarW title="Гүйлгээний дэлгэрэнгүй"/>
      <div style={{ flex:1, overflow:'auto', padding:'6px 24px 24px' }}>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', paddingTop:8 }}>
          <div style={{ width:64, height:64, borderRadius:20, background: bad ? '#FDECEF' : v.bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
            {bad
              ? <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M7 7l10 10M17 7L7 17" stroke="#D6455D" strokeWidth="2.6" strokeLinecap="round"/></svg>
              : <svg width="30" height="30" viewBox="0 0 24 24" fill="none">{v.glyph}</svg>}
          </div>
          <div style={{ fontSize:13, color:CW.muted, fontWeight:600, marginTop:16 }}>{t.t}</div>
          <div style={{ fontSize:32, fontWeight:800, letterSpacing:'-0.03em', marginTop:6, color: bad ? CW.muted2 : inflow ? CW.green : CW.ink, fontVariantNumeric:'tabular-nums', textDecoration: bad ? 'line-through' : 'none' }}>{inflow ? '+' : '–'} ₮ {t.a}</div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:7, marginTop:14, padding:'6px 13px', borderRadius:999, background: bad ? '#FDECEF' : CW.greenSoft }}>
            {bad
              ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 8v5M12 16h.01" stroke="#D6455D" strokeWidth="2.6" strokeLinecap="round"/></svg>
              : <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4L19 7" stroke={CW.green} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            <span style={{ fontSize:12, fontWeight:800, color: bad ? '#D6455D' : CW.green }}>{bad ? 'Цуцлагдсан' : 'Амжилттай'}</span>
          </div>
        </div>

        <div style={{ marginTop:22, background:'#fff', borderRadius:18, border:`1px solid ${CW.line2}`, overflow:'hidden' }}>
          {rows.map(([l, val], i) => (
            <div key={l} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, padding:'13px 16px', borderTop: i ? `1px solid ${CW.line2}` : 'none' }}>
              <span style={{ fontSize:12.5, color:CW.muted, fontWeight:600, flexShrink:0 }}>{l}</span>
              <span style={{ fontSize:13, fontWeight:700, color:CW.ink, textAlign:'right', fontVariantNumeric:'tabular-nums' }}>{val}</span>
            </div>
          ))}
        </div>

        <div style={{ fontSize:11.5, color:CW.muted, marginTop:12, lineHeight:1.55 }}>
          {bad
            ? 'Мөнгө бүрэн дүнгээр хэтэвчинд буцаагдсан. Дахин оролдож болно.'
            : 'Гүйлгээний дугаарыг дэмжлэгийн багтай холбогдохдоо баримт болгон хэрэглэнэ.'}
        </div>
      </div>
      <WFooter>{bad ? 'Дахин оролдох' : 'Баримт татах'} <ArrowW/></WFooter>
    </FrameW>
  );
};

const TransactionHistory = ({ start = null }) => {
  const [open, setOpen] = useStateW(start);
  const [filter, setFilter] = useStateW('all');
  if (open) return <TxDetail tx={open}/>;
  const list = filter === 'all' ? TX_DATA : TX_DATA.filter(t => t.type === filter);
  const groups = [];
  list.forEach(t => {
    const m = t.d.slice(0, 7);
    let g = groups.find(x => x.m === m);
    if (!g) { g = { m, items: [] }; groups.push(g); }
    g.items.push(t);
  });
  return (
    <FrameW label="W8 — Гүйлгээний түүх">
      <BackBarW title="Гүйлгээний түүх"/>
      {/* filter chips */}
      <div style={{ flexShrink: 0, padding:'2px 0 12px' }}>
        <div style={{ display:'flex', gap: 8, overflowX:'auto', padding:'0 24px', scrollbarWidth:'none' }}>
          {TX_TYPES.map(ty => {
            const on = filter === ty.k;
            return (
              <button key={ty.k} onClick={() => setFilter(ty.k)} data-nodrag style={{
                flexShrink: 0, height: 36, padding:'0 16px', borderRadius: 999, cursor:'pointer',
                background: on ? CW.ink : '#fff', color: on ? '#fff' : CW.text,
                border: `1px solid ${on ? CW.ink : CW.line}`, fontWeight: 700, fontSize: 12.5,
                fontFamily:'inherit', whiteSpace:'nowrap', transition:'all .15s',
              }}>{ty.l}</button>
            );
          })}
        </div>
      </div>

      <div style={{ flex: 1, overflow:'auto', padding:'0 24px 20px' }}>
        {list.length === 0 ? (
          <div style={{ marginTop: 60, textAlign:'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: CW.line2, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="4" y="5" width="16" height="14" rx="3" stroke={CW.muted2} strokeWidth="2"/><path d="M8 12h8" stroke={CW.muted2} strokeWidth="2.4" strokeLinecap="round"/></svg>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: CW.ink, marginTop: 14 }}>Энэ төрлийн гүйлгээ алга</div>
            <div style={{ fontSize: 12.5, color: CW.muted, marginTop: 6 }}>Өөр шүүлтүүр сонгож үзнэ үү.</div>
          </div>
        ) : groups.map((g, gi) => (
          <div key={g.m} style={{ marginTop: gi ? 18 : 4 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: CW.muted, marginBottom: 8, fontVariantNumeric:'tabular-nums' }}>{txMonthLabel(g.m)}</div>
            <div style={{ background:'#fff', borderRadius: 16, border:`1px solid ${CW.line2}`, overflow:'hidden' }}>
              {g.items.map((t, i) => {
                const v = txVisual(t.type);
                return (
                  <button key={i} data-nodrag onClick={()=>setOpen(t)} style={{ width:'100%', textAlign:'left', background:'transparent', cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap: 12, padding:'13px 14px', border:'none', borderTop: i ? `1px solid ${CW.line2}` : 'none' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: v.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">{v.glyph}</svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: CW.ink, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.t}</div>
                      <div style={{ fontSize: 11, color: CW.muted, marginTop: 2, fontVariantNumeric:'tabular-nums' }}>{t.d}</div>
                    </div>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: t.sign === '+' ? CW.green : CW.ink, fontVariantNumeric:'tabular-nums', flexShrink: 0 }}>
                      {t.sign === '+' ? '+ ' : '– '}₮{t.a}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </FrameW>
  );
};

// ============================================================
// EXPORT TO WINDOW
// ============================================================
Object.assign(window, {
  AddMoneyAmount, AddMoneyQPay,
  AddMoneyBank, AddMoneyBankPending, AddMoneyBankSuccess, AddMoneyBankNotFound,
  AddMoneySuccess,
  WithdrawAmount, WithdrawReview, WithdrawPin, WithdrawSuccess, WithdrawInsufficient,
  TransactionHistory, TxDetail, TX_DATA, TX_TOPUP, TX_FAILED,
});
