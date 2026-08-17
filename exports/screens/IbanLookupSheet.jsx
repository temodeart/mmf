/* =========================================================================
   Money Market Fund — Mobile App · Screen: IbanLookupSheet
   Self-contained JSX (DA->CL bundle, contract v1.0). Shared kit, module aliases,
   and tokens for this screen are inlined below, in dependency order.
   Mongolian Cyrillic UI · 390x844 · white-first. Requires React in host scope.
   Registers the screen component to window.__MMF_SCREENS.
   ========================================================================= */
(function () {
const { useState, useRef, useEffect, useMemo, useCallback, useLayoutEffect, Fragment } = React;

/* ----- shared kit · module aliases · tokens (dependency-ordered) ----- */
const C = {
  bg: '#F4F6FA',
  surface: '#FFFFFF',
  navy: '#050B1F',
  navy2: '#0E1631',
  navy3: '#1A2547',
  indigo: '#4F46E5',
  indigoSoft: '#EEF0FE',
  blue: '#2D6BFF',
  blueSoft: '#E7EEFF',
  orange: '#FF6B2C',
  orangeSoft: '#FFEDE2',
  green: '#0E9F6E',
  greenSoft: '#E3F5EE',
  amber: '#B7791F',
  amberSoft: '#FFF3D6',
  red: '#DC2626',
  redSoft: '#FDECEC',
  ink: '#0B1020',
  ink2: '#1F2540',
  text: '#2A3052',
  muted: '#6B7191',
  muted2: '#9099B5',
  line: '#E7E9F2',
  line2: '#EFF1F8',
};

// ----- Tiny atoms -----

const StatusBar = ({ dark = false }) => (
  <div style={{
    height: 44, padding: '0 28px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    color: dark ? '#fff' : C.ink, fontWeight: 600, fontSize: 15,
    fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em', flexShrink: 0,
  }}>
    <span>9:41</span>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {/* signal */}
      <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
        {[2,5,8,11].map((h,i)=>(
          <rect key={i} x={i*4} y={11-h} width="3" height={h} rx="0.5" fill={dark?'#fff':C.ink}/>
        ))}
      </svg>
      {/* wifi */}
      <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
        <path d="M7.5 11l2-2.5a2.5 2.5 0 00-4 0L7.5 11z" fill={dark?'#fff':C.ink}/>
        <path d="M3.5 6.5a6 6 0 018 0" stroke={dark?'#fff':C.ink} strokeWidth="1.3" strokeLinecap="round" fill="none" opacity=".5"/>
        <path d="M.5 3a10 10 0 0114 0" stroke={dark?'#fff':C.ink} strokeWidth="1.3" strokeLinecap="round" fill="none" opacity=".5"/>
      </svg>
      {/* battery */}
      <svg width="26" height="11" viewBox="0 0 26 11" fill="none">
        <rect x="0.5" y="0.5" width="22" height="10" rx="2.5" stroke={dark?'#fff':C.ink} opacity=".4" fill="none"/>
        <rect x="2" y="2" width="19" height="7" rx="1.3" fill={dark?'#fff':C.ink}/>
        <rect x="23.5" y="3.5" width="1.5" height="4" rx="0.5" fill={dark?'#fff':C.ink} opacity=".4"/>
      </svg>
    </div>
  </div>
);

const HomeIndicator = ({ dark = false }) => (
  <div style={{ height: 34, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 8, flexShrink: 0 }}>
    <div style={{ width: 134, height: 5, borderRadius: 999, background: dark ? 'rgba(255,255,255,.6)' : '#0B1020' }}/>
  </div>
);

const PillBtn = ({ children, primary, ghost, onClick, full, small }) => {
  const h = small ? 36 : 48;
  let style = {
    height: h, padding: small ? '0 16px' : '0 22px',
    width: full ? '100%' : 'auto',
    borderRadius: small ? 12 : 14, fontWeight: 700, fontSize: small ? 13 : 15,
    letterSpacing: '-0.01em', border: 'none', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  };
  if (primary) style = { ...style, background: C.indigo, color: '#fff', boxShadow:'0 6px 18px -6px rgba(79,70,229,.45)' };
  else if (ghost) style = { ...style, background: 'transparent', color: C.ink, border: `1.5px solid ${C.line}` };
  else style = { ...style, background: C.ink, color: '#fff' };
  return <button style={style} onClick={onClick}>{children}</button>;
};

const Frame = ({ label, children, bg = C.bg, statusDark = false }) => (
  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink: 0 }}>
    <div style={{
      fontFamily: 'JetBrains Mono, ui-monospace, monospace',
      fontSize: 11, color: C.muted, fontWeight: 600, letterSpacing: '0.08em',
      marginBottom: 16, textTransform: 'uppercase',
    }}>{label}</div>
    <div style={{
      width: 390, height: 844, borderRadius: 48,
      background: bg, overflow: 'hidden',
      boxShadow: '0 30px 60px -25px rgba(15,20,55,.18), 0 8px 20px -10px rgba(15,20,55,.08)',
      display: 'flex', flexDirection: 'column', position: 'relative',
      border: `1px solid ${C.line2}`,
    }}>
      <StatusBar dark={statusDark}/>
      <div style={{ flex: 1, overflow: 'hidden', display:'flex', flexDirection:'column' }}>
        {children}
      </div>
      <HomeIndicator dark={statusDark}/>
    </div>
  </div>
);

// ============================================================
// 01 — SPLASH / WELCOME
// ============================================================

const BackBar = ({ title, right }) => (
  <div style={{ height: 56, display:'flex', alignItems:'center', justifyContent:'space-between', padding: '0 16px 0 8px', flexShrink: 0 }}>
    <button style={{
      width: 40, height: 40, borderRadius: 12, background: '#fff', border: `1px solid ${C.line}`,
      display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke={C.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </button>
    <div style={{ fontSize: 16, fontWeight: 700, color: C.ink, letterSpacing:'-0.01em' }}>{title}</div>
    <div style={{ width: 40 }}>{right}</div>
  </div>
);

// ============================================================
// SIGNUP — Shared step header
// ============================================================

const SignupStepHeader = ({ step, total = 3, title, nextLabel }) => {
  const pct = Math.round((step / total) * 100);
  return (
    <div style={{ flexShrink: 0 }}>
      <div style={{ height: 56, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 16px 0 8px' }}>
        <button style={{ width: 40, height: 40, borderRadius: 12, background:'#fff', border:`1px solid ${C.line}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke={C.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.ink, letterSpacing:'-0.01em' }}>{title}</div>
        <div style={{ width: 40 }}/>
      </div>
      {/* progress */}
      <div style={{ padding: '0 24px' }}>
        <div style={{ height: 6, borderRadius: 999, background: '#F0F2F8', overflow:'hidden' }}>
          <div style={{
            width: `${pct}%`, height:'100%', borderRadius: 999,
            background: `linear-gradient(90deg, ${C.orange}, #FF8B4F)`,
            transition: 'width .35s',
          }}/>
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop: 10 }}>
          <div style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>
            <span style={{ color: C.ink, fontWeight: 700 }}>Алхам {step} / {total}</span>
            {nextLabel && <span style={{ color: C.muted2 }}> · Дараагийн: {nextLabel}</span>}
          </div>
          <div style={{
            background: C.orange, color:'#fff',
            padding: '3px 10px', borderRadius: 999,
            fontSize: 11, fontWeight: 800, letterSpacing:'-0.01em', fontVariantNumeric:'tabular-nums',
          }}>{pct} %</div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// 06 — SIGN UP · Step 1 / 3 — Phone + OTP + Password
// ============================================================

const OTP = () => {
  const digits = ['4','7','2','1','',''];
  return (
    <Frame label="06 — OTP / Verification">
      <BackBar title=""/>
      <div style={{ flex: 1, padding: '8px 24px', display:'flex', flexDirection:'column' }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16, background: C.indigoSoft,
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M4 8l8 5 8-5" stroke={C.indigo} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="3" y="5" width="18" height="14" rx="2" stroke={C.indigo} strokeWidth="2" fill="none"/></svg>
        </div>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.ink, marginTop: 18, letterSpacing:'-0.02em', lineHeight:1.1 }}>
          Баталгаажуулах код
        </div>
        <div style={{ fontSize: 14, color: C.muted, marginTop: 10, lineHeight:1.5 }}>
          Бид таны утсанд илгээсэн 6 оронтой кодыг доор оруулна уу.
        </div>

        <div style={{ display:'flex', gap: 10, marginTop: 32 }}>
          {digits.map((d, i) => (
            <div key={i} style={{
              flex: 1, height: 60, borderRadius: 14,
              background: '#fff',
              border: `1.5px solid ${d ? C.indigo : (i === digits.findIndex(x => !x) ? C.indigo : C.line)}`,
              boxShadow: (!d && i === digits.findIndex(x => !x)) ? `0 0 0 4px ${C.indigoSoft}` : 'none',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize: 24, fontWeight: 700, color: C.ink, fontVariantNumeric:'tabular-nums',
            }}>{d}</div>
          ))}
        </div>

        <div style={{ marginTop: 24, fontSize: 14, color: C.muted, textAlign:'center' }}>
          Код хүлээж аваагүй юу? <span style={{ color: C.indigo, fontWeight: 700 }}>Дахин илгээх</span>
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: C.muted2, textAlign:'center', fontVariantNumeric:'tabular-nums' }}>
          00:42 хүрэхэд дахин илгээх боломжтой
        </div>

        <div style={{ flex: 1 }}/>

        <div style={{ paddingBottom: 16 }}>
          <PillBtn primary full>Баталгаажуулах</PillBtn>
        </div>
      </div>
    </Frame>
  );
};

// ============================================================
// LOGIN — Phone + Password + Biometric toggle + Forgot
// ============================================================

const StickyBar = ({ children }) => (
  <div style={{ padding: '12px 24px 6px', background:'#fff', borderTop:`1px solid ${C.line2}`, flexShrink: 0 }}>
    {children}
  </div>
);

const BigBtn = ({ children, tone = C.indigo, disabled, onClick, ghost }) => (
  <button onClick={disabled ? undefined : onClick} style={{
    width:'100%', height: 52, borderRadius: 14, border: ghost ? `1.5px solid ${C.line}` : 'none',
    background: ghost ? '#fff' : (disabled ? '#C9CEDD' : tone),
    color: ghost ? C.ink : '#fff', fontWeight: 700, fontSize: 15, letterSpacing:'-0.01em',
    cursor: disabled ? 'default' : 'pointer',
    display:'flex', alignItems:'center', justifyContent:'center', gap: 8,
    boxShadow: (disabled || ghost) ? 'none' : `0 8px 22px -8px ${tone}80`,
    transition:'background .15s',
  }}>{children}</button>
);

// ---- Review scaffold: scroll body + consent + PIN + sticky enable-gated CTA ----

/* module aliases (bank_verify.jsx) */
const useStateBV = React.useState;
const useEffectBV = React.useEffect;
const useRefBV = React.useRef;
const CBV = C;
const FrameBV = Frame;
const StickyBarBV = StickyBar;
const BigBtnBV = BigBtn;
const StepHeaderBV = SignupStepHeader;

const MN_BANKS = [
  { id:'khan',     name:'Хаан Банк',                   short:'Хаан',     ab:'ХААН', c:'#0E7C4A', code:'0005' },
  { id:'golomt',   name:'Голомт банк',                 short:'Голомт',   ab:'ГБ',   c:'#0B5CAB', code:'0015' },
  { id:'tdb',      name:'Худалдаа хөгжлийн банк',      short:'ХХБ',      ab:'ХХБ',  c:'#0A2A6B', code:'0004' },
  { id:'state',    name:'Төрийн банк',                 short:'Төрийн',   ab:'ТБ',   c:'#0E8F8A', code:'0034' },
  { id:'xac',      name:'ХасБанк',                     short:'Хас',      ab:'ХАС',  c:'#E8722B', code:'0030' },
  { id:'capitron', name:'Капитрон банк',               short:'Капитрон', ab:'КБ',   c:'#6E4FB0', code:'0042' },
  { id:'mbank',    name:'М банк',                       short:'М банк',   ab:'М',    c:'#C0392B', code:'0050' },
  { id:'bogd',     name:'Богд банк',                   short:'Богд',     ab:'ББ',   c:'#3B4FB0', code:'0026' },
  { id:'arig',     name:'Ариг банк',                   short:'Ариг',     ab:'АБ',   c:'#1F8A5B', code:'0021' },
];

// Shared facts for the micro-deposit verification (mock).

const BankMark = ({ bank, size = 40 }) => (
  <div style={{
    width: size, height: size, borderRadius: size * 0.28, flexShrink: 0,
    background: bank.c, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center',
    fontWeight: 800, fontSize: bank.ab.length > 2 ? 12 : 15, letterSpacing:'-0.01em',
    boxShadow:`0 6px 14px -6px ${bank.c}99`,
  }}>{bank.ab}</div>
);

// ---- header (back + title) ----

const BVHeader = () => (
  <div style={{ flexShrink: 0, paddingBottom: 6 }}>
    <div style={{ height: 56, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 16px 0 8px' }}>
      <button style={{ width: 40, height: 40, borderRadius: 12, background:'#fff', border:`1px solid ${CBV.line}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke={CBV.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <div style={{ fontSize: 15, fontWeight: 700, color: CBV.ink, letterSpacing:'-0.01em' }}>Данс баталгаажуулах</div>
      <div style={{ width: 40 }}/>
    </div>
  </div>
);

// ---- read-only field with lock affordance ----

const BankTile = ({ bank, selected, onClick }) => (
  <button onClick={onClick} style={{
    width: 92, flexShrink: 0, cursor:'pointer', background:'transparent', border:'none', padding: 0,
    display:'flex', flexDirection:'column', alignItems:'center', gap: 8,
  }}>
    <div style={{
      width: 92, height: 86, borderRadius: 18, background:'#fff',
      border:`1.5px solid ${selected ? CBV.indigo : CBV.line2}`,
      boxShadow: selected ? `0 0 0 3px ${CBV.indigoSoft}` : '0 2px 8px -4px rgba(15,20,55,.12)',
      display:'flex', alignItems:'center', justifyContent:'center', transition:'all .15s',
    }}>
      <BankMark bank={bank} size={46}/>
    </div>
    <span style={{ fontSize: 12, fontWeight: 600, color: selected ? CBV.ink : CBV.muted, maxWidth: 92, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{bank.short || bank.name}</span>
  </button>
);

// build a mock-but-plausible Mongolian IBAN from bank + account number

function buildIban(bank, acct) {
  const digits = acct.replace(/\D/g, '');
  const padded = (digits + '000000000000').slice(0, 12);
  const raw = 'MN58' + bank.code + padded; // MN + 2 check + 4 bank + 12 account = 22
  return raw.replace(/(.{4})/g, '$1 ').trim();
}

// ============================================================
// B1 — BANK ACCOUNT VERIFICATION (interactive)
// ============================================================

const IbanLookupBody = ({ onClose, onCopy, presetBank, seedAcct, seedResult }) => {
  const [bank, setBank] = useStateBV(presetBank || null);
  const [acct, setAcct] = useStateBV(seedAcct || '');
  const [result, setResult] = useStateBV(seedResult || null);  // full IBAN string once looked up
  const [copied, setCopied] = useStateBV(false);

  const acctDigits = acct.replace(/\D/g, '');
  const canLookup = bank && acctDigits.length >= 6;

  const doLookup = () => setResult(buildIban(bank, acctDigits));
  const doCopy = () => {
    setCopied(true);
    try { navigator.clipboard && navigator.clipboard.writeText(result.replace(/\s/g,'')); } catch(e){}
    setTimeout(() => onCopy(result), 650);
  };

  return (
    <div style={{ position:'absolute', inset:0, zIndex: 5 }}>
      <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(5,11,31,.45)' }}/>
      <div style={{ position:'absolute', left:0, right:0, bottom:0, background:'#fff', borderRadius:'26px 26px 0 0', padding:'10px 0 22px' }}>
        <div style={{ width:40, height:5, borderRadius:999, background:CBV.line, margin:'0 auto 14px' }}/>
        <div style={{ fontSize: 18, fontWeight: 800, color: CBV.ink, textAlign:'center', letterSpacing:'-0.01em' }}>IBAN лавлах</div>

        {!result ? (
          <>
            {/* horizontally scrollable bank tiles */}
            <div style={{ display:'flex', gap: 12, overflowX:'auto', padding:'16px 24px 4px', WebkitOverflowScrolling:'touch' }}>
              {MN_BANKS.map((b) => (
                <BankTile key={b.id} bank={b} selected={bank && bank.id === b.id} onClick={()=>setBank(b)}/>
              ))}
            </div>

            {/* account number input */}
            <div style={{ padding:'8px 24px 0' }}>
              <div style={{
                minHeight: 60, borderRadius: 16, background:'#fff', border:`1.5px solid ${acct ? CBV.indigo : CBV.line}`,
                boxShadow: acct ? `0 0 0 4px ${CBV.indigoSoft}` : 'none', padding:'0 18px', display:'flex', alignItems:'center',
              }}>
                <input
                  value={acct} onChange={(e)=>setAcct(e.target.value.replace(/[^\d ]/g,''))}
                  placeholder="Дансны дугаарыг оруулна уу" inputMode="numeric"
                  style={{ width:'100%', border:'none', outline:'none', background:'transparent', fontSize: 16, fontWeight: 600, color: CBV.ink, fontFamily:'inherit', fontVariantNumeric:'tabular-nums', letterSpacing:'0.03em' }}
                />
              </div>
              <button onClick={canLookup ? doLookup : undefined} style={{
                width:'100%', height: 52, marginTop: 16, borderRadius: 14, border:'none',
                background: canLookup ? CBV.indigo : '#C9CEDD', color:'#fff', fontWeight: 700, fontSize: 15,
                cursor: canLookup ? 'pointer' : 'default',
                boxShadow: canLookup ? `0 8px 22px -8px ${CBV.indigo}99` : 'none', transition:'background .15s',
              }}>Лавлах</button>
            </div>
          </>
        ) : (
          <div style={{ padding:'18px 24px 0' }}>
            {/* result card: bank · account · IBAN */}
            <div style={{ background: CBV.indigoSoft, border:`1px solid ${CBV.indigo}33`, borderRadius: 18, padding: 18 }}>
              <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
                <BankMark bank={bank} size={40}/>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: CBV.ink }}>{bank.name}</div>
                  <div style={{ fontSize: 12, color: CBV.muted, marginTop: 2, fontVariantNumeric:'tabular-nums' }}>Данс: {acctDigits}</div>
                </div>
              </div>
              <div style={{ height: 1, background:`${CBV.indigo}22`, margin:'16px 0' }}/>
              <div style={{ fontSize: 11, fontWeight: 800, color: CBV.indigo, textTransform:'uppercase', letterSpacing:'0.08em' }}>IBAN дугаар</div>
              <div style={{ fontSize: 19, fontWeight: 800, color: CBV.ink, marginTop: 8, fontFamily:'JetBrains Mono, monospace', letterSpacing:'0.02em', lineHeight: 1.3 }}>{result}</div>
            </div>

            <button onClick={doCopy} style={{
              width:'100%', height: 52, marginTop: 16, borderRadius: 14, border:'none', cursor:'pointer',
              background: copied ? CBV.green : CBV.ink, color:'#fff', fontWeight: 700, fontSize: 15,
              display:'flex', alignItems:'center', justifyContent:'center', gap: 9, transition:'background .15s',
            }}>
              {copied
                ? <><svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg> Хууллаа</>
                : <><svg width="17" height="17" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="11" height="11" rx="2.5" stroke="#fff" strokeWidth="2"/><path d="M5 15V5a2 2 0 012-2h8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg> Хуулах</>}
            </button>
            <button onClick={()=>setResult(null)} style={{
              width:'100%', height: 44, marginTop: 6, background:'transparent', border:'none',
              color: CBV.muted, fontWeight: 700, fontSize: 13.5, cursor:'pointer',
            }}>Өөр данс лавлах</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// B2 — IBAN LOOKUP SHEET (standalone artboards)
// ============================================================

const DimmedForm = () => (
  <div style={{ position:'absolute', inset:0, padding:'2px 24px', filter:'blur(1.5px)', opacity:.4, display:'flex', flexDirection:'column', gap: 14 }}>
    <div style={{ height: 18, width:'70%', borderRadius: 6, background:'#E2E5F0' }}/>
    <div style={{ height: 52, borderRadius: 14, background:'#F1F2F7', border:`1px solid ${CBV.line}` }}/>
    <div style={{ height: 56, borderRadius: 14, background:'#fff', border:`1px solid ${CBV.line}` }}/>
    <div style={{ height: 54, borderRadius: 14, background:'#fff', border:`1px solid ${CBV.line}` }}/>
    <div style={{ height: 56, borderRadius: 14, background:'#fff', border:`1px solid ${CBV.line}` }}/>
  </div>
);

/* ----- this screen ----- */
const IbanLookupSheet = () => (
  <FrameBV label="B2 — IBAN лавлах · хайх">
    <BVHeader/>
    <div style={{ flex: 1, position:'relative', overflow:'hidden' }}>
      <DimmedForm/>
      <IbanLookupBody onClose={()=>{}} onCopy={()=>{}} presetBank={MN_BANKS[1]}/>
    </div>
  </FrameBV>
);

(window.__MMF_SCREENS = window.__MMF_SCREENS || {}).IbanLookupSheet = IbanLookupSheet;
})();