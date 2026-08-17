// profile_extra.jsx — MMF Web · Profile F4 parity pass
// Additional Profile tabs beyond the audited info/password/security trio:
//   ContractsTab  — Гэрээнүүд (master contract + product/loan contract list → viewer)
//   CertsTab      — Тодорхойлолт (statement request: invest | loan)
//   SettingsTab   — Хэл · Мэдэгдлийн тохиргоо · Үйлчилгээний нөхцөл · Тусламж · Апп хувилбар · Гарах
// Ported from mobile profile.jsx (ProfileMain menu, ContractViewer, CertRequest/CertSuccess,
// NotifSettings) — desktop-adapted as in-tab panels rather than push-navigated screens.
// <script type="text/babel" src="profile_extra.jsx"></script>  (after comp_kit.jsx)

const { useState: _usePX, useEffect: _useEffPX } = React;
const { T: _T, WebButton: _Btn, WebModal: _Modal, WebConfirmDialog: _Confirm } = window;

/* ── shared icon set (mirrors mobile pIcon) ── */
const _pxIcon = (k, color = _T.ink) => {
  const p = { stroke: color, strokeWidth: 2, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
  const M = {
    doc:   <g {...p}><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></g>,
    docs:  <g {...p}><rect x="4" y="5" width="11" height="14" rx="2"/><path d="M18 8v11H8" opacity=".5"/><path d="M7 9h5M7 12h5"/></g>,
    cert:  <g {...p}><circle cx="12" cy="9" r="5"/><path d="M9 13l-1.5 7L12 18l4.5 2L15 13"/></g>,
    globe: <g {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"/></g>,
    bell:  <g {...p}><path d="M6 9a6 6 0 0112 0c0 6 2.5 7 2.5 7H3.5S6 15 6 9z"/><path d="M10 20a2 2 0 004 0"/></g>,
    shield:<g {...p}><path d="M12 3l8 3v6c0 4.5-3 7.5-8 9-5-1.5-8-4.5-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/></g>,
    help:  <g {...p}><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 113.5 2.3c-.8.4-1 .9-1 1.7M12 17h.01"/></g>,
    info:  <g {...p}><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></g>,
    out:   <g {...p}><path d="M15 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h7a2 2 0 002-2v-2M10 12h10M17 9l3 3-3 3"/></g>,
  };
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none">{M[k]}</svg>;
};

const _MenuGroup = ({ title, children }) => (
  <div>
    {title && <div style={{ fontSize:11, fontWeight:700, color:_T.muted, letterSpacing:'.07em', textTransform:'uppercase', padding:'0 4px 8px' }}>{title}</div>}
    <div style={{ background:_T.surface, borderRadius:16, border:`1px solid ${_T.line2}`, overflow:'hidden' }}>{children}</div>
  </div>
);
/* Rows with an action render as buttons; value-only rows (version, contact)
   render as plain divs so nothing looks pressable that isn't. */
const _MenuRow = ({ icon, label, value, danger, chevron=true, onClick, top }) => {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag onClick={onClick} style={{ width:'100%', textAlign:'left', display:'flex', alignItems:'center', gap:12, padding:'14px 16px', background:'transparent', border:'none', borderTop: top ? `1px solid ${_T.line2}` : 'none', cursor: onClick ? 'pointer' : 'default', fontFamily:'inherit', boxSizing:'border-box' }}>
      {icon && <div style={{ width:36, height:36, borderRadius:10, background: danger ? _T.negSoft : _T.field, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{icon}</div>}
      <span style={{ flex:1, fontSize:13.5, fontWeight:700, color: danger ? _T.neg : _T.ink }}>{label}</span>
      {value && <span style={{ fontSize:12.5, color:_T.muted, fontWeight:600 }}>{value}</span>}
      {chevron && onClick && <svg width="17" height="17" viewBox="0 0 24 24" fill="none" style={{ marginLeft: value ? 4 : 0, flexShrink:0 }}><path d="M9 6l6 6-6 6" stroke={_T.muted2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </Tag>
  );
};

/* ══════════════════════════════════════════════════════════════════
   Гэрээнүүд — master contract + product/loan contracts → paper viewer
   (ported from mobile MyContracts.jsx + ContractViewer.jsx). Desktop
   adaptation: viewer opens as a centered paper-on-gray overlay instead
   of a pushed full-screen route.
   ══════════════════════════════════════════════════════════════════ */
const _CONTRACTS = {
  master: { title:'Үйлчилгээний мастер гэрээ', docNumber:'MMF-MC-2026', docDate:'2026-05-15',
    parties:[ { r:'1-р тал', n:'Мони Маркет Фанд ХХК', reg:'РД: 6700123' }, { r:'2-р тал', n:'Батболд Тэмүүжин', reg:'РД: УБ91051512' } ],
    sections:['Нэг. Ерөнхий нөхцөл','Хоёр. Данс нээх, хаах журам','Гурав. Эрх, үүрэг, хариуцлага'] },
  products: [
    { id:'p1', t:'CAPIT 1450 CD 270218', n:'CT-2026-04823', d:'2026-06-01', issuer:'Капитрон Банк ХХК', issuerReg:'РД: 2611290' },
    { id:'p2', t:'GOLDH 2300 IT 270914', n:'CT-2026-04102', d:'2026-04-14', issuer:'Голден Хилл Партнерс', issuerReg:'РД: 5512207' },
    { id:'p3', t:'MSTRT 2400 IT 260711', n:'CT-2025-09810', d:'2025-11-17', issuer:'Кредитекс СТМ ББСБ', issuerReg:'РД: 6208814' },
  ],
  loans: [
    { id:'l1', t:'Зээлийн гэрээ', n:'LN-2026-04823', d:'2026-05-29', issuer:'Мони Маркет Фанд ХХК', issuerReg:'РД: 6700123' },
  ],
};

const _Bar = ({ w='100%' }) => <div style={{ height:8, borderRadius:4, background:'#EAECF2', width:w }}/>;

/* paper card — reused for master + product + loan contracts */
const ContractPaper = ({ doc, onClose }) => {
  if (!doc) return null;
  const isMaster = doc.kind === 'master';
  const parties = isMaster ? _CONTRACTS.master.parties : [
    { r:'Гаргагч', n:doc.issuer, reg:doc.issuerReg },
    { r:'Хөрөнгө оруулагч', n:'Батболд Тэмүүжин', reg:'РД: УБ91051512' },
    { r:'Зохицуулагч', n:'Мони Маркет Фанд ХХК', reg:'РД: 6700123' },
  ];
  const sections = isMaster ? _CONTRACTS.master.sections : ['Нэг. Гэрээний зүйл','Хоёр. Талуудын эрх, үүрэг','Гурав. Төлбөр тооцоо'];
  const docNumber = isMaster ? _CONTRACTS.master.docNumber : doc.n;
  const docDate = isMaster ? _CONTRACTS.master.docDate : doc.d;
  const title = isMaster ? 'ҮЙЛЧИЛГЭЭНИЙ МАСТЕР ГЭРЭЭ' : (doc.t.includes('LN') || doc.issuer === 'Мони Маркет Фанд ХХК' && !isMaster && doc.t.toLowerCase().includes('зээл')) ? 'ЗЭЭЛИЙН ГЭРЭЭ' : 'ҮНЭТ ЦААС ХУДАЛДАХ, ХУДАЛДАН АВАХ ГЭРЭЭ';

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:70, background:'rgba(5,11,31,.5)', backdropFilter:'blur(3px)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div onClick={e => e.stopPropagation()} style={{ width:'min(600px,100%)', maxHeight:'92vh', display:'flex', flexDirection:'column', borderRadius:16, overflow:'hidden', boxShadow:'0 30px 70px -24px rgba(15,20,55,.5)' }}>
        <div style={{ height:58, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 18px', background:_T.surface, borderBottom:`1px solid ${_T.line2}` }}>
          <div style={{ fontSize:14.5, fontWeight:800, color:_T.ink }}>Гэрээ</div>
          <div style={{ display:'flex', gap:8 }}>
            <button style={{ width:36, height:36, borderRadius:10, background:_T.field, border:`1px solid ${_T.line}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }} aria-label="Татах">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M12 4v10M8 11l4 4 4-4M5 19h14" stroke={_T.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button onClick={onClose} style={{ width:36, height:36, borderRadius:10, background:_T.field, border:`1px solid ${_T.line}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }} aria-label="Хаах">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke={_T.ink} strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>
        <div style={{ flex:1, overflow:'auto', padding:22, background:'#E9EBF1' }}>
          <div style={{ background:'#fff', borderRadius:6, boxShadow:'0 10px 30px -12px rgba(15,20,55,.3)', padding:'28px 26px', border:`1px solid ${_T.line2}` }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:`2px solid ${_T.ink}`, paddingBottom:14 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <svg width="26" height="26" viewBox="0 0 48 48" fill="none"><path d="M9.6 11.4V28.6L0 34.4V0h9.9L24 8.4 38.1 0H48v5.6L24 20 9.6 11.4z" fill="#FF6B2C"/><path d="M38.4 36.6V19.4L48 13.6V48h-9.9L24 39.6 9.9 48H0v-5.6L24 28l14.4 8.6z" fill="#2D6BFF"/></svg>
                <div>
                  <div style={{ fontSize:12.5, fontWeight:800, color:_T.ink }}>Мони Маркет Фанд ХХК</div>
                  <div style={{ fontSize:9, color:_T.muted, fontWeight:600, letterSpacing:'.04em' }}>MONEY MARKET FUND LLC</div>
                </div>
              </div>
              <div style={{ fontSize:9, color:_T.muted, fontWeight:700, textAlign:'right', fontFamily:'monospace', lineHeight:1.4 }}>СЗХ ЗОХИЦУУЛАЛТ<br/>2024-А/118</div>
            </div>
            <div style={{ fontSize:15, fontWeight:800, color:_T.ink, textAlign:'center', marginTop:18, lineHeight:1.4 }}>{title}</div>
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:16, fontSize:11 }}>
              <div><span style={{ color:_T.muted, fontWeight:600 }}>Дугаар:</span> <span className="num" style={{ fontWeight:800, color:_T.ink, fontFamily:'monospace' }}>{docNumber}</span></div>
              <div><span style={{ color:_T.muted, fontWeight:600 }}>Огноо:</span> <span className="num" style={{ fontWeight:800, color:_T.ink }}>{window.formatDate ? window.formatDate(docDate) : docDate}</span></div>
            </div>
            <div style={{ marginTop:16, display:'flex', flexDirection:'column', gap:9 }}>
              {parties.map((p,i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', borderBottom:`1px dashed ${_T.line2}`, paddingBottom:8 }}>
                  <div>
                    <div style={{ fontSize:9.5, color:_T.muted, fontWeight:700, textTransform:'uppercase', letterSpacing:'.04em' }}>{p.r}</div>
                    <div style={{ fontSize:12.5, fontWeight:700, color:_T.ink, marginTop:2 }}>{p.n}</div>
                  </div>
                  <div style={{ fontSize:10, color:_T.muted, fontWeight:600, fontFamily:'monospace' }}>{p.reg}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:20, display:'flex', flexDirection:'column', gap:16 }}>
              {sections.map((h,i) => (
                <div key={i}>
                  <div style={{ fontSize:12, fontWeight:800, color:_T.ink }}>{h}</div>
                  <div style={{ marginTop:8, display:'flex', flexDirection:'column', gap:6 }}><_Bar/><_Bar/><_Bar w="78%"/></div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:16, fontFamily:'monospace', fontSize:10, color:_T.muted2, textAlign:'center' }}>// гэрээний бүрэн эх — жишээ баримт</div>
            <div style={{ marginTop:24, display:'flex', justifyContent:'space-between', gap:16 }}>
              {['Гаргагч талын төлөөлөл','Хөрөнгө оруулагч'].map((s,i) => (
                <div key={i} style={{ flex:1 }}>
                  <div style={{ height:34 }}/>
                  <div style={{ borderTop:`1px solid ${_T.muted2}`, paddingTop:6, fontSize:10, color:_T.muted, fontWeight:600, textAlign:'center' }}>{s}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContractsTab = () => {
  const [doc, setDoc] = _usePX(null);
  const openMaster = () => setDoc({ kind:'master', t:'Үйлчилгээний мастер гэрээ' });
  const openOne = (c) => () => setDoc({ kind:'product', ...c });
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <_MenuGroup title="Гэрээ, баримт">
        <_MenuRow icon={_pxIcon('doc', _T.indigo)} label="Үндсэн гэрээ" onClick={openMaster}/>
      </_MenuGroup>
      <_MenuGroup title="Бүтээгдэхүүний гэрээ">
        {_CONTRACTS.products.map((c,i) => (
          <_MenuRow key={c.id} top={i>0} icon={_pxIcon('docs', _T.ink)} label={c.t} value={c.n} chevron onClick={openOne(c)}/>
        ))}
      </_MenuGroup>
      <_MenuGroup title="Зээлийн гэрээ">
        {_CONTRACTS.loans.map((c,i) => (
          <_MenuRow key={c.id} top={i>0} icon={_pxIcon('docs', _T.ink)} label={c.t} value={c.n} chevron onClick={openOne(c)}/>
        ))}
      </_MenuGroup>
      {doc && <ContractPaper doc={doc} onClose={() => setDoc(null)}/>}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   Тодорхойлолт — statement request (invest | loan), ported from mobile
   CertRequest.jsx + CertSuccess.jsx. Desktop adaptation: inline card
   swaps to a success state rather than pushing a new full screen.
   ══════════════════════════════════════════════════════════════════ */
const _CERT_CFG = {
  invest: { title:'Хөрөнгө оруулалтын тодорхойлолт', color:_T.pos,
    items:['Эзэмшиж буй бүтээгдэхүүний жагсаалт','Нийт үнэ цэнэ ба хуримтлагдсан өгөөж','Тайлант хугацааны гүйлгээ','Баталгаажуулсан QR код'] },
  loan: { title:'Зээлийн тодорхойлолт', color:_T.indigo,
    items:['Идэвхтэй зээлийн дэлгэрэнгүй','Үлдэгдэл ба эргэн төлөлтийн хуваарь','Төлөлтийн түүх','Баталгаажуулсан QR код'] },
};

const CertCard = ({ type, email }) => {
  const cfg = _CERT_CFG[type];
  const [addr, setAddr] = _usePX(email);
  const [state, setState] = _usePX('idle'); // idle | sending | sent
  const submit = () => { if (!addr || state==='sending') return; setState('sending'); setTimeout(() => setState('sent'), 900); };
  return (
    <div style={{ background:_T.surface, border:`1px solid ${_T.line2}`, borderRadius:20, overflow:'hidden' }}>
      <div style={{ padding:'18px 24px 4px', display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ width:38, height:38, borderRadius:11, background:`${cfg.color}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{_pxIcon('cert', cfg.color)}</div>
        <div style={{ fontSize:15, fontWeight:800, color:_T.ink, letterSpacing:'-0.01em' }}>{cfg.title}</div>
      </div>
      <div style={{ padding:'14px 24px 20px' }}>
        {state === 'sent' ? (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', padding:'20px 8px' }}>
            <div style={{ width:56, height:56, borderRadius:16, background:`linear-gradient(135deg, ${_T.pos}, #0B8F60)`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 14px 30px -10px rgba(14,159,110,.5)' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{ fontSize:14.5, fontWeight:800, color:_T.ink, marginTop:14 }}>Хүсэлт амжилттай илгээгдлээ</div>
            <div style={{ fontSize:12.5, color:_T.muted, marginTop:6, lineHeight:1.5, maxWidth:320 }}>Тодорхойлолтыг 1 ажлын өдрийн дотор <b style={{ color:_T.text }}>{addr}</b> хаяг руу илгээнэ.</div>
            <button onClick={() => setState('idle')} style={{ marginTop:14, fontSize:12.5, fontWeight:700, color:_T.indigo, background:'none', border:'none', cursor:'pointer', fontFamily:'inherit', padding:0 }}>Дахин хүсэлт илгээх</button>
          </div>
        ) : (
          <>
            <div style={{ fontSize:12.5, color:_T.muted, lineHeight:1.6, marginBottom:10 }}>Тодорхойлолтод дараах мэдээлэл багтана:</div>
            <div style={{ background:_T.field, borderRadius:14, border:`1px solid ${_T.line2}`, overflow:'hidden', marginBottom:14 }}>
              {cfg.items.map((t,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderTop:i?`1px solid ${_T.line2}`:'none' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill={_T.posSoft}/><path d="M8 12l3 3 5-6" stroke={_T.pos} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span style={{ fontSize:12.5, color:_T.text, fontWeight:600 }}>{t}</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize:11.5, fontWeight:700, color:_T.muted, letterSpacing:'.05em', textTransform:'uppercase', marginBottom:8 }}>И-мэйл хаяг</div>
            <div style={{ height:48, borderRadius:12, border:`1.5px solid ${_T.line}`, background:_T.field, display:'flex', alignItems:'center', padding:'0 14px', marginBottom:14 }}>
              <input value={addr} onChange={e => setAddr(e.target.value)} style={{ flex:1, border:'none', outline:'none', background:'transparent', fontSize:13.5, fontWeight:600, color:_T.ink, fontFamily:'inherit' }}/>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'11px 14px', borderRadius:12, background:_T.field, border:`1px solid ${_T.line2}`, marginBottom:16 }}>
              <span style={{ fontSize:12, color:_T.muted, fontWeight:600 }}>Үйлчилгээний хураамж</span>
              <span style={{ fontSize:13, color:_T.ink, fontWeight:800 }}>Төлбөргүй</span>
            </div>
            <_Btn variant="primary" full disabled={!addr || state==='sending'} onClick={submit}>{state==='sending' ? 'Илгээж байна…' : 'Хүсэлт илгээх'}</_Btn>
          </>
        )}
      </div>
    </div>
  );
};

const CertsTab = ({ email }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
    <CertCard type="invest" email={email}/>
    {!window.MMF_V1 && <CertCard type="loan" email={email}/>}
  </div>
);

/* ══════════════════════════════════════════════════════════════════
   Тохиргоо — Хэл · Мэдэгдлийн тохиргоо · Бусад (terms/help/version/logout)
   ══════════════════════════════════════════════════════════════════ */
const _Toggle = ({ on, onClick }) => (
  <button onClick={onClick} style={{ width:44, height:26, borderRadius:999, border:'none', cursor:'pointer', background: on?_T.indigo:_T.line, position:'relative', transition:'background .15s', flexShrink:0, minHeight:0 }}>
    <span style={{ position:'absolute', top:3, left:on?21:3, width:20, height:20, borderRadius:999, background:'#fff', transition:'left .15s', boxShadow:'0 1px 3px rgba(0,0,0,.2)' }}/>
  </button>
);

const _NOTIF_PREF_KEY = 'mmf_notif_prefs_v1';
const _readPrefs = () => { try { return { txn:true, trade:true, loan:true, sys:false, email:true, ...JSON.parse(localStorage.getItem(_NOTIF_PREF_KEY)||'{}') }; } catch(e) { return { txn:true, trade:true, loan:true, sys:false, email:true }; } };

const TermsModal = ({ open, onClose }) => (
  !open ? null : (
    <_Modal open onClose={onClose} title="Үйлчилгээний нөхцөл">
      <div style={{ display:'flex', flexDirection:'column', gap:18, paddingBottom:8 }}>
        {['1. Ерөнхий заалт','2. Данс, хэтэвчний үйлчилгээ','3. Арилжаа, гүйлгээний нөхцөл','4. Хариуцлага, маргаан таслах журам'].map((h,i) => (
          <div key={i}>
            <div style={{ fontSize:13, fontWeight:800, color:_T.ink }}>{h}</div>
            <div style={{ marginTop:8, display:'flex', flexDirection:'column', gap:6 }}><_Bar/><_Bar/><_Bar w="70%"/></div>
          </div>
        ))}
        <div style={{ fontFamily:'monospace', fontSize:11, color:_T.muted2, textAlign:'center' }}>// үйлчилгээний нөхцөлийн бүрэн эх — жишээ баримт</div>
      </div>
    </_Modal>
  )
);

const _HELP_CHANNELS = [
  { k:'phone', l:'Утсаар холбогдох', v:'+976 7000 1234', sub:'Даваа–Баа 09:00–18:00', href:'tel:+97670001234', cta:'Залгах' },
  { k:'mail',  l:'И-мэйл',           v:'support@mmf.mn',  sub:'1 ажлын өдөрт хариу',   href:'mailto:support@mmf.mn', cta:'Бичих' },
  { k:'chat',  l:'Чат дэмжлэг',      v:'Апп дотор',       sub:'Ажлын цагаар шуурхай',  cta:'Чат нээх' },
];
const _HELP_FAQ = [
  ['Хугацаанаас өмнө мөнгөө авч болох уу?', 'Бүтээгдэхүүнээ хоёрдогч зах зээлд зарах захиалга үүсгэснээр боломжтой. Миний бүтээгдэхүүн хуудсаас "Зарах" дарна.'],
  ['Өгөөж хэзээ, хэрхэн тооцогдох вэ?', 'Хугацааны эцэст үндсэн дүн + хүү (10% татварыг хассан) хэтэвчинд автоматаар шилжинэ.'],
  ['Зарлага гаргах хугацаа хэр вэ?', 'Ажлын цагаар 15 минут дотор, ажлын бус цагт дараагийн ажлын өдөр банкны дансанд тусна.'],
  ['ПИН кодоо мартвал?', 'Аюулгүй байдал таб дээрх "ПИН код солих"-оор и-мэйл баталгаажуулалтаар шинээр тохируулна.'],
];

const HelpModal = ({ open, onClose }) => {
  const [openQ, setOpenQ] = _usePX(null);
  if (!open) return null;
  return (
    <_Modal open onClose={onClose} title="Тусламж, холбоо барих">
      <div style={{ display:'flex', flexDirection:'column', gap:18, paddingBottom:8 }}>
        <div style={{ border:`1px solid ${_T.line2}`, borderRadius:14, overflow:'hidden' }}>
          {_HELP_CHANNELS.map((c,i) => (
            <div key={c.k} style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 14px', borderTop: i ? `1px solid ${_T.line2}` : 'none' }}>
              <div style={{ width:36, height:36, borderRadius:10, background:_T.indigoSoft, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={_T.indigo} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {c.k==='phone' ? <path d="M5 3h3l2 5-2.5 1.5a12 12 0 006 6L15 13l5 2v3a2 2 0 01-2.2 2A17 17 0 013 5.2A2 2 0 015 3z"/>
                   : c.k==='mail' ? <><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/></>
                   : <path d="M21 12a8 8 0 01-11.5 7.2L4 21l1.8-5.5A8 8 0 1121 12z"/>}
                </svg>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13.5, fontWeight:700, color:_T.ink }}>{c.l}</div>
                <div style={{ fontSize:11.5, color:_T.muted, fontWeight:600, marginTop:2 }}>{c.v} · {c.sub}</div>
              </div>
              {c.href
                ? <a href={c.href} style={{ flexShrink:0, fontSize:12, fontWeight:700, color:_T.indigo, textDecoration:'none', padding:'7px 12px', borderRadius:10, border:`1px solid ${_T.line}` }}>{c.cta}</a>
                : <span style={{ flexShrink:0, fontSize:12, fontWeight:700, color:_T.muted2, padding:'7px 12px', borderRadius:10, border:`1px solid ${_T.line2}`, background:_T.field }}>Удахгүй</span>}
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.1em', color:_T.muted2, textTransform:'uppercase', marginBottom:8 }}>Түгээмэл асуулт</div>
          <div style={{ border:`1px solid ${_T.line2}`, borderRadius:14, overflow:'hidden' }}>
            {_HELP_FAQ.map(([q,a],i) => (
              <div key={i} style={{ borderTop: i ? `1px solid ${_T.line2}` : 'none' }}>
                <button onClick={() => setOpenQ(openQ===i?null:i)} style={{ width:'100%', textAlign:'left', display:'flex', alignItems:'center', gap:10, padding:'12px 14px', background:'transparent', border:'none', cursor:'pointer', fontFamily:'inherit' }}>
                  <span style={{ flex:1, fontSize:13, fontWeight:700, color:_T.ink }}>{q}</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, transform: openQ===i?'rotate(180deg)':'none', transition:'transform .16s' }}><path d="M6 9l6 6 6-6" stroke={_T.muted2} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                {openQ===i && <div style={{ padding:'0 14px 14px', fontSize:12.5, color:_T.muted, lineHeight:1.6, textWrap:'pretty' }}>{a}</div>}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display:'flex', gap:9, alignItems:'flex-start', padding:'12px 14px', borderRadius:12, background:_T.field, border:`1px solid ${_T.line2}` }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:1 }}><circle cx="12" cy="12" r="9" stroke={_T.muted2} strokeWidth="2"/><path d="M12 16v-4M12 8.5h.01" stroke={_T.muted2} strokeWidth="2" strokeLinecap="round"/></svg>
          <div style={{ fontSize:11.5, color:_T.muted, lineHeight:1.5 }}>Гүйлгээний талаар бичихдээ гүйлгээний дугаарыг хавсаргавал шалгах хугацаа багасна.</div>
        </div>
      </div>
    </_Modal>
  );
};

const SettingsTab = ({ onLogout }) => {
  const [lang, setLang] = _usePX(() => (typeof localStorage !== 'undefined' && localStorage.getItem('mmf_lang')) || 'mn');
  const [langNote, setLangNote] = _usePX(false);
  const [prefs, setPrefs] = _usePX(_readPrefs);
  const [termsOpen, setTermsOpen] = _usePX(false);
  const [helpOpen, setHelpOpen] = _usePX(false);
  const [logoutOpen, setLogoutOpen] = _usePX(false);

  const pickLang = (l) => {
    setLang(l);
    try { localStorage.setItem('mmf_lang', l); } catch(e) {}
    if (l === 'en') { setLangNote(true); setTimeout(() => setLangNote(false), 3400); }
  };
  const flip = (k) => { const next = { ...prefs, [k]: !prefs[k] }; setPrefs(next); try { localStorage.setItem(_NOTIF_PREF_KEY, JSON.stringify(next)); } catch(e) {} };

  const notifRows = [
    { k:'txn',   l:'Гүйлгээний мэдэгдэл', d:'Орлого, зарлага, шилжүүлэг' },
    { k:'trade', l:'Арилжааны мэдэгдэл',  d:'Худалдан авалт, өгөөж, зарах санал' },
    { k:'loan',  l:'Зээлийн мэдэгдэл',    d:'Хүсэлт, эргэн төлөлтийн сануулга' },
    { k:'sys',   l:'Системийн мэдэгдэл',  d:'Шинэчлэлт, аюулгүй байдал' },
    { k:'email', l:'И-мэйл мэдэгдэл',     d:'Чухал мэдэгдлийг и-мэйлээр хүлээн авах' },
  ];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <_MenuGroup title="Хэл">
        <div style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 16px' }}>
          <div style={{ width:36, height:36, borderRadius:10, background:_T.field, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{_pxIcon('globe')}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13.5, fontWeight:700, color:_T.ink }}>Интерфэйсийн хэл</div>
            {langNote && <div style={{ fontSize:11, color:_T.indigo, fontWeight:600, marginTop:2 }}>Англи орчуулга удахгүй нэмэгдэнэ.</div>}
          </div>
          <div style={{ display:'inline-flex', background:_T.field, border:`1px solid ${_T.line}`, borderRadius:999, padding:3, gap:2 }}>
            {['mn','en'].map(l => (
              <button key={l} onClick={() => pickLang(l)} style={{ padding:'6px 14px', borderRadius:999, border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:12, fontWeight:800, letterSpacing:'.02em', background: lang===l?_T.surface:'transparent', color: lang===l?_T.ink:_T.muted, boxShadow: lang===l?'0 1px 3px rgba(15,23,42,.12)':'none' }}>{l.toUpperCase()}</button>
            ))}
          </div>
        </div>
      </_MenuGroup>

      <_MenuGroup title="Мэдэгдлийн тохиргоо">
        {notifRows.map((r,i) => (
          <div key={r.k} style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 16px', borderTop: i ? `1px solid ${_T.line2}` : 'none' }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13.5, fontWeight:700, color:_T.ink }}>{r.l}</div>
              <div style={{ fontSize:11.5, color:_T.muted, marginTop:2 }}>{r.d}</div>
            </div>
            <_Toggle on={prefs[r.k]} onClick={() => flip(r.k)}/>
          </div>
        ))}
      </_MenuGroup>

      <_MenuGroup title="Бусад">
        <_MenuRow icon={_pxIcon('shield')} label="Үйлчилгээний нөхцөл" onClick={() => setTermsOpen(true)}/>
        <_MenuRow top icon={_pxIcon('help')} label="Тусламж, холбоо барих" onClick={() => setHelpOpen(true)}/>
        <_MenuRow top icon={_pxIcon('info')} label="Апп хувилбар" value="v1.0.0" chevron={false}/>
        <_MenuRow top danger icon={_pxIcon('out', _T.neg)} label="Гарах" chevron={false} onClick={() => setLogoutOpen(true)}/>
      </_MenuGroup>

      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)}/>

      <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)}/>
      <_Confirm open={logoutOpen} title="Гарах уу?" tone="neg"
        body="Та дахин нэвтрэхдээ и-мэйл, нууц үгээ оруулах шаардлагатай болно."
        confirmLabel="Тийм, гарах" cancelLabel="Болих"
        onConfirm={() => { setLogoutOpen(false); onLogout && onLogout(); }} onCancel={() => setLogoutOpen(false)}/>
    </div>
  );
};

Object.assign(window, { ContractsTab, CertsTab, SettingsTab, ContractPaper });
