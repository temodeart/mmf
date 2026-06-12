// ============================================================
// BANK ACCOUNT VERIFICATION — final KYC step (after contract signing)
// Inserts: B1 verify form (+ IBAN auto-fill + bank picker) ·
//          B2 IBAN helper bottom sheet · B3 checking ·
//          B4 verified summary · B5 KYC complete
// Reuses tokens + Frame + StickyBar/BigBtn from screens.jsx / flow_kit.jsx.
// All copy Mongolian Cyrillic. Mobile-native 390×844. Matches v2 visual system.
// ============================================================

const { useState: useStateBV } = React;
const { C: CBV, Frame: FrameBV, StickyBar: StickyBarBV, BigBtn: BigBtnBV } = window;

// DAN-verified identity (read-only across this step)
const DAN_NAME = 'Батболд Тэмүүжин';

// Mongolian banks — ORIGINAL monogram tiles (not real bank logos)
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

// ---- monogram tile ----
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
const LockedField = ({ label, value }) => (
  <div>
    <div style={{ fontSize: 12, color: CBV.muted, fontWeight: 600, marginBottom: 8 }}>{label}</div>
    <div style={{
      height: 52, borderRadius: 14, background:'#F1F2F7', border:`1.5px solid ${CBV.line}`,
      padding:'0 14px', display:'flex', alignItems:'center', justifyContent:'space-between', gap: 10,
    }}>
      <span style={{ fontSize: 15, fontWeight: 700, color: CBV.ink2 }}>{value}</span>
      <span style={{ display:'inline-flex', alignItems:'center', gap: 5, fontSize: 10.5, fontWeight: 700, color: CBV.muted2, background:'#fff', padding:'4px 8px', borderRadius: 999, border:`1px solid ${CBV.line}` }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke={CBV.muted2} strokeWidth="2"/><path d="M8 11V8a4 4 0 018 0v3" stroke={CBV.muted2} strokeWidth="2"/></svg>
        ДАН
      </span>
    </div>
  </div>
);

// ---- main-screen IBAN field with fixed "MN" prefix (image ref) ----
const IbanField = ({ value, onChange, justFilled }) => {
  const [focus, setFocus] = useStateBV(false);
  return (
    <div>
      <div style={{ fontSize: 12, color: CBV.muted, fontWeight: 600, marginBottom: 8 }}>IBAN дугаар</div>
      <div style={{
        minHeight: 56, borderRadius: 14, background: focus ? '#fff' : '#FAFBFE',
        border:`1.5px solid ${justFilled ? CBV.green : focus ? CBV.indigo : CBV.line}`,
        boxShadow: focus ? `0 0 0 4px ${CBV.indigoSoft}` : justFilled ? `0 0 0 4px ${CBV.greenSoft}` : 'none',
        padding:'0 14px', display:'flex', alignItems:'center', gap: 12, transition:'border-color .2s, box-shadow .2s',
      }}>
        <span style={{ fontSize: 15, fontWeight: 800, color: CBV.ink, letterSpacing:'0.02em' }}>MN</span>
        <span style={{ width: 1, height: 26, background: CBV.line, flexShrink: 0 }}/>
        <input
          value={value} onChange={(e)=>onChange(e.target.value.replace(/[^\d ]/g,''))}
          onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}
          placeholder="IBAN дугаар" inputMode="numeric"
          style={{
            flex: 1, minWidth: 0, border:'none', outline:'none', background:'transparent',
            fontSize: 15, fontWeight: 700, color: CBV.ink, fontFamily:'inherit',
            fontVariantNumeric:'tabular-nums', letterSpacing:'0.04em',
          }}
        />
        {justFilled && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0 }}><path d="M5 12l4 4 10-10" stroke={CBV.green} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </div>
    </div>
  );
};

// ---- "IBAN лавлах" button — design-system secondary action (indigo, no green) ----
const IbanLookupButton = ({ onClick }) => (
  <button onClick={onClick} style={{
    width:'100%', height: 52, borderRadius: 14, cursor:'pointer',
    background: CBV.indigoSoft, border:`1.5px solid ${CBV.indigo}`,
    display:'flex', alignItems:'center', justifyContent:'center', gap: 9,
  }}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke={CBV.indigo} strokeWidth="2.2"/><path d="M20 20l-3.2-3.2" stroke={CBV.indigo} strokeWidth="2.2" strokeLinecap="round"/></svg>
    <span style={{ fontSize: 14.5, fontWeight: 700, color: CBV.indigo, letterSpacing:'-0.01em' }}>IBAN лавлах</span>
  </button>
);

// ---- bank tile for the lookup sheet (logo card + name below) ----
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
const BankVerify = () => {
  const [bank, setBank] = useStateBV(null);
  const [picker, setPicker] = useStateBV(false);
  const [iban, setIban] = useStateBV('');      // digits after the "MN" prefix
  const [lookup, setLookup] = useStateBV(false);
  const [justFilled, setJustFilled] = useStateBV(false);

  const ibanDigits = iban.replace(/\D/g, '');
  const ibanValid = ibanDigits.length >= 18;   // MN + 18 digits = 20-char IBAN
  const canVerify = bank && ibanValid;

  // called by the lookup sheet's "Хуулах" — drop the IBAN into the main field
  const fillIban = (full) => {
    const rest = full.replace(/^MN\s*/, '');    // strip the "MN" prefix
    setIban(rest);
    setLookup(false);
    setJustFilled(true);
    try { navigator.clipboard && navigator.clipboard.writeText(full.replace(/\s/g,'')); } catch(e){}
    setTimeout(() => setJustFilled(false), 2200);
  };

  return (
    <FrameBV label="B1 — Банк данс баталгаажуулах">
      <BVHeader/>
      <div style={{ flex: 1, overflow:'auto', padding:'2px 24px 18px', display:'flex', flexDirection:'column', gap: 16, position:'relative' }}>
        <div>
          <div style={{ fontSize: 21, fontWeight: 800, color: CBV.ink, letterSpacing:'-0.02em', lineHeight: 1.2 }}>Банкны данс баталгаажуулах</div>
          <div style={{ fontSize: 13, color: CBV.muted, marginTop: 8, lineHeight: 1.5 }}>
            Мөнгөн хөрөнгөөс зарлага гаргах үед ашиглах өөрийн нэр дээрх банкны дансаа баталгаажуулна уу.
          </div>
        </div>

        {/* owner name — read-only from DAN */}
        <LockedField label="Данс эзэмшигч" value={DAN_NAME}/>
        <div style={{ display:'flex', gap: 8, alignItems:'flex-start', marginTop: -6, padding:'0 2px' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop: 1 }}><circle cx="12" cy="12" r="9" stroke={CBV.muted2} strokeWidth="2"/><path d="M12 16v-4M12 8.5h.01" stroke={CBV.muted2} strokeWidth="2" strokeLinecap="round"/></svg>
          <div style={{ fontSize: 11.5, color: CBV.muted, lineHeight: 1.45 }}>Та зөвхөн өөрийн нэр дээрх банкны дансыг баталгаажуулах боломжтой.</div>
        </div>

        {/* bank selector */}
        <div>
          <div style={{ fontSize: 12, color: CBV.muted, fontWeight: 600, marginBottom: 8 }}>Банк сонгох</div>
          <button onClick={()=>setPicker(p=>!p)} style={{
            width:'100%', height: 56, borderRadius: 14, cursor:'pointer',
            background: bank ? '#fff' : '#FAFBFE', border:`1.5px solid ${picker ? CBV.indigo : CBV.line}`,
            boxShadow: picker ? `0 0 0 4px ${CBV.indigoSoft}` : 'none',
            padding:'0 12px', display:'flex', alignItems:'center', gap: 12,
          }}>
            {bank ? <BankMark bank={bank} size={38}/> : (
              <div style={{ width: 38, height: 38, borderRadius: 11, background:'#EDEFF6', display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 10l8-5 8 5M5 10v8m4-8v8m6-8v8m4-8v8M3 21h18" stroke={CBV.muted2} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            )}
            <span style={{ flex: 1, textAlign:'left', fontSize: 15, fontWeight: bank ? 700 : 500, color: bank ? CBV.ink : CBV.muted2 }}>
              {bank ? bank.name : 'Сонгох'}
            </span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ transform: picker ? 'rotate(180deg)' : 'none', transition:'transform .2s' }}><path d="M6 9l6 6 6-6" stroke={CBV.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>

          {picker && (
            <div style={{ marginTop: 8, background:'#fff', border:`1px solid ${CBV.line}`, borderRadius: 14, overflow:'hidden', boxShadow:'0 18px 40px -16px rgba(15,20,55,.22)' }}>
              {MN_BANKS.map((b, i) => (
                <div key={b.id} onClick={()=>{ setBank(b); setPicker(false); }} style={{
                  display:'flex', alignItems:'center', gap: 12, padding:'10px 14px', cursor:'pointer',
                  borderTop: i > 0 ? `1px solid ${CBV.line2}` : 'none',
                  background: bank && bank.id === b.id ? CBV.indigoSoft : '#fff',
                }}>
                  <BankMark bank={b} size={34}/>
                  <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: CBV.ink }}>{b.name}</span>
                  {bank && bank.id === b.id && <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke={CBV.indigo} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* IBAN лавлах — opens the lookup sheet */}
        <IbanLookupButton onClick={()=>setLookup(true)}/>

        {/* IBAN дугаар — receives the looked-up / pasted IBAN */}
        <IbanField value={iban} onChange={(v)=>{ setIban(v); setJustFilled(false); }} justFilled={justFilled}/>
        {justFilled && (
          <div style={{ display:'flex', alignItems:'center', gap: 6, marginTop: -8, padding:'0 2px', fontSize: 11.5, fontWeight: 700, color: CBV.green }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke={CBV.green} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            IBAN дугаар хуулагдаж орлоо
          </div>
        )}

        <div style={{ height: 2 }}/>

        {/* in-frame lookup bottom sheet */}
        {lookup && <IbanLookupBody onClose={()=>setLookup(false)} onCopy={fillIban} presetBank={bank}/>}
      </div>

      <StickyBarBV>
        <BigBtnBV disabled={!canVerify}>Данс шалгах</BigBtnBV>
        {!canVerify && (
          <div style={{ fontSize: 11, color: CBV.muted2, fontWeight: 600, textAlign:'center', marginTop: 8 }}>
            Банк сонгож, IBAN дугаараа оруулна уу
          </div>
        )}
      </StickyBarBV>
    </FrameBV>
  );
};

// ---- IBAN lookup bottom sheet: pick bank + account → Лавлах → result + Хуулах ----
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

const IbanLookupSheet = () => (
  <FrameBV label="B2 — IBAN лавлах · хайх">
    <BVHeader/>
    <div style={{ flex: 1, position:'relative', overflow:'hidden' }}>
      <DimmedForm/>
      <IbanLookupBody onClose={()=>{}} onCopy={()=>{}} presetBank={MN_BANKS[1]}/>
    </div>
  </FrameBV>
);

const IbanLookupResult = () => (
  <FrameBV label="B2b — IBAN лавлах · үр дүн">
    <BVHeader/>
    <div style={{ flex: 1, position:'relative', overflow:'hidden' }}>
      <DimmedForm/>
      <IbanLookupBody onClose={()=>{}} onCopy={()=>{}} presetBank={MN_BANKS[1]} seedAcct="5301234567" seedResult={buildIban(MN_BANKS[1], '5301234567')}/>
    </div>
  </FrameBV>
);
// ============================================================
const BankChecking = () => (
  <FrameBV label="B3 — Данс шалгаж байна">
    <div style={{ height: 44, flexShrink: 0 }}/>
    <div style={{ flex: 1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', textAlign:'center', padding:'0 32px' }}>
      <div style={{ position:'relative', width: 110, height: 110, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div className="omf-pulse" style={{ position:'absolute', inset:0, borderRadius: 30, background:'rgba(79,70,229,.22)' }}/>
        <div className="omf-pulse omf-pulse-2" style={{ position:'absolute', inset:0, borderRadius: 30, background:'rgba(79,70,229,.18)' }}/>
        <div style={{ position:'relative', width: 80, height: 80, borderRadius: 24, background:`linear-gradient(135deg, ${CBV.indigo}, ${CBV.blue})`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 14px 30px -10px ${CBV.indigo}99` }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="omf-spin"><path d="M21 12a9 9 0 11-2.6-6.4" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round"/><path d="M21 4v5h-5" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>
      <div style={{ fontSize: 23, fontWeight: 800, color: CBV.ink, marginTop: 28, letterSpacing:'-0.02em' }}>Данс шалгаж байна</div>
      <div style={{ fontSize: 13.5, color: CBV.muted, marginTop: 12, lineHeight: 1.55, maxWidth: 280 }}>
        Таны банкны дансны мэдээллийг баталгаажуулж байна.
      </div>
    </div>
  </FrameBV>
);

// ============================================================
// B4 — VERIFIED (success + summary)
// ============================================================
const BankVerified = () => (
  <FrameBV label="B4 — Данс баталгаажлаа">
    <div style={{ height: 44, flexShrink: 0 }}/>
    <div style={{ flex: 1, overflow:'auto', padding:'8px 24px 16px', display:'flex', flexDirection:'column' }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', paddingTop: 18 }}>
        <div style={{ width: 88, height: 88, borderRadius: 28, background:`linear-gradient(135deg, #1F8A5B, ${CBV.green})`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 16px 36px -12px ${CBV.green}88` }}>
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{ fontSize: 23, fontWeight: 800, color: CBV.ink, marginTop: 22, letterSpacing:'-0.02em', lineHeight: 1.18 }}>Данс амжилттай<br/>баталгаажлаа</div>
        <div style={{ fontSize: 13, color: CBV.muted, marginTop: 10, lineHeight: 1.5, maxWidth: 290 }}>
          Таны банкны дансыг зарлага гаргах дансаар бүртгэлээ.
        </div>
      </div>

      <div style={{ marginTop: 22, background:'#fff', borderRadius: 18, border:`1px solid ${CBV.line2}`, overflow:'hidden' }}>
        {[
          { l:'Данс эзэмшигч', v: DAN_NAME },
          { l:'Банк', v:'Хаан Банк', mark: MN_BANKS[0] },
          { l:'Дансны дугаар', v:'•••• 1234' },
          { l:'IBAN', v:'MN58 0005 •••• 1234' },
        ].map((r, i) => (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap: 12, padding:'14px 16px', borderTop: i>0 ? `1px solid ${CBV.line2}` : 'none' }}>
            <span style={{ fontSize: 12.5, color: CBV.muted, fontWeight: 600 }}>{r.l}</span>
            <span style={{ display:'flex', alignItems:'center', gap: 8, fontSize: 13.5, fontWeight: 700, color: CBV.ink, fontVariantNumeric:'tabular-nums' }}>
              {r.mark && <BankMark bank={r.mark} size={22}/>}
              {r.v}
            </span>
          </div>
        ))}
      </div>
      <div style={{ flex: 1 }}/>
    </div>
    <StickyBarBV>
      <BigBtnBV>Үргэлжлүүлэх</BigBtnBV>
    </StickyBarBV>
  </FrameBV>
);

// ============================================================
// B5 — KYC COMPLETE / ACCOUNT READY
// ============================================================
const KycComplete = () => {
  const items = [
    'Утас баталгаажсан',
    'И-мэйл баталгаажсан',
    'Танин баталгаажуулалт хийгдсэн',
    'Мастер гэрээ баталгаажсан',
    'Банкны данс баталгаажсан',
  ];
  return (
    <FrameBV label="B5 — Бүртгэл баталгаажлаа">
      <div style={{ height: 44, flexShrink: 0 }}/>
      <div style={{ flex: 1, overflow:'auto', padding:'8px 24px 16px', display:'flex', flexDirection:'column' }}>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', paddingTop: 14 }}>
          <div style={{ width: 92, height: 92, borderRadius: 30, position:'relative', background:`linear-gradient(135deg, ${CBV.indigo}, ${CBV.blue})`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 18px 40px -12px ${CBV.indigo}8C` }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: CBV.ink, marginTop: 22, letterSpacing:'-0.02em', lineHeight: 1.16 }}>Бүртгэл амжилттай<br/>баталгаажлаа</div>
          <div style={{ fontSize: 13, color: CBV.muted, marginTop: 10, lineHeight: 1.5, maxWidth: 290 }}>
            Таны бүртгэл, гэрээ болон банкны данс амжилттай баталгаажлаа.
          </div>
        </div>

        <div style={{ marginTop: 24, background:'#fff', borderRadius: 18, border:`1px solid ${CBV.line2}`, padding: 6 }}>
          {items.map((t, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap: 12, padding:'12px 12px', borderTop: i>0 ? `1px solid ${CBV.line2}` : 'none' }}>
              <div style={{ width: 24, height: 24, borderRadius: 999, background: CBV.greenSoft, display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke={CBV.green} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: CBV.text }}>{t}</span>
            </div>
          ))}
        </div>
        <div style={{ flex: 1 }}/>
      </div>
      <StickyBarBV>
        <BigBtnBV>
          Нүүр хуудас руу очих
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </BigBtnBV>
      </StickyBarBV>
    </FrameBV>
  );
};

Object.assign(window, {
  BankVerify, IbanLookupSheet, IbanLookupResult, BankChecking, BankVerified, KycComplete,
});
