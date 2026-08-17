// ============================================================
// Money Market Fund — User Profile
// Grouped menu lists + personal info + тодорхойлолт request +
// terms + logout. Reuses Frame, BackBar, Badge, Dot, ContractViewer.
// ============================================================

const { useState: useStateP } = React;

// ---- row icons (2px stroke) ----
const pIcon = (k, color = C.ink) => {
  const p = { stroke: color, strokeWidth: 2, fill:'none', strokeLinecap:'round', strokeLinejoin:'round' };
  const M = {
    user:  <g {...p}><circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0114 0"/></g>,
    pin:   <g {...p}><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></g>,
    card:  <g {...p}><rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18M7 15.5h4"/></g>,
    lock:  <g {...p}><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 018 0v3M12 14v3"/></g>,
    globe: <g {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"/></g>,
    bell:  <g {...p}><path d="M6 9a6 6 0 0112 0c0 6 2.5 7 2.5 7H3.5S6 15 6 9z"/><path d="M10 20a2 2 0 004 0"/></g>,
    doc:   <g {...p}><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></g>,
    docs:  <g {...p}><rect x="4" y="5" width="11" height="14" rx="2"/><path d="M18 8v11H8" opacity=".5"/><path d="M7 9h5M7 12h5"/></g>,
    cert:  <g {...p}><circle cx="12" cy="9" r="5"/><path d="M9 13l-1.5 7L12 18l4.5 2L15 13"/></g>,
    shield:<g {...p}><path d="M12 3l8 3v6c0 4.5-3 7.5-8 9-5-1.5-8-4.5-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/></g>,
    help:  <g {...p}><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 113.5 2.3c-.8.4-1 .9-1 1.7M12 17h.01"/></g>,
    info:  <g {...p}><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></g>,
    out:   <g {...p}><path d="M15 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h7a2 2 0 002-2v-2M10 12h10M17 9l3 3-3 3"/></g>,
  };
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none">{M[k]}</svg>;
};

// ---- menu primitives ----
// Rows with an action are buttons; value-only rows (app version) are static,
// so nothing in the menu looks tappable unless it actually goes somewhere.
const MenuGroup = ({ title, children }) => (
  <div style={{ marginTop: 18 }}>
    {title && <div style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, letterSpacing:'0.04em', textTransform:'uppercase', padding:'0 4px 8px' }}>{title}</div>}
    <div style={{ background:'#fff', borderRadius: 16, border:`1px solid ${C.line2}`, overflow:'hidden' }}>{children}</div>
  </div>
);
const MenuRow = ({ icon, label, value, danger, chevron=true, onClick, top }) => {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag onClick={onClick} style={{ width:'100%', textAlign:'left', display:'flex', alignItems:'center', gap:12, padding:'13px 14px', background:'transparent', border:'none', borderTop: top ? `1px solid ${C.line2}` : 'none', cursor: onClick ? 'pointer' : 'default', boxSizing:'border-box' }}>
      {icon && <div style={{ width:34, height:34, borderRadius:10, background: danger ? C.redSoft : '#F4F6FB', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{icon}</div>}
      <span style={{ flex:1, fontSize:13.5, fontWeight:600, color: danger ? C.red : C.ink }}>{label}</span>
      {value && <span style={{ fontSize:12.5, color:C.muted, fontWeight:600 }}>{value}</span>}
      {chevron && onClick && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginLeft: value ? 4 : 0, flexShrink:0 }}><path d="M9 6l6 6-6 6" stroke={C.muted2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </Tag>
  );
};

// ============================================================
// PROFILE MAIN
// ============================================================
const ProfileMain = ({ onNav }) => {
  const [logout, setLogout] = useStateP(false);
  const go = (id) => () => onNav && onNav(id);
  return (
    <Frame label="Profile · main">
      <BackBar title="Профайл"/>
      <div style={{ flex:1, overflow:'auto', padding:'2px 24px 24px' }}>
        {/* header */}
        <div style={{ background:'#fff', borderRadius: 20, border:`1px solid ${C.line2}`, padding: 18, display:'flex', alignItems:'center', gap: 14 }}>
          <div style={{ width: 60, height: 60, borderRadius: 18, background:`linear-gradient(135deg, ${C.indigo}, ${C.blue})`, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight: 800, fontSize: 22, flexShrink:0 }}>БТ</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: C.ink, letterSpacing:'-0.01em' }}>Батболд Тэмүүжин</div>
            <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2, fontVariantNumeric:'tabular-nums' }}>+976 9905 1512</div>
            <div style={{ marginTop: 8 }}><Badge tone="new">КҮС баталгаажсан</Badge></div>
          </div>
        </div>

        <MenuGroup title="Хувийн мэдээлэл">
          <MenuRow icon={pIcon('user', C.indigo)} label="Хувийн мэдээлэл" onClick={go('personalInfo')}/>
        </MenuGroup>

        <MenuGroup title="Тохиргоо">
          <MenuRow icon={pIcon('pin', C.ink)} label="ПИН код солих" onClick={go('pinChange')}/>
          <MenuRow icon={pIcon('lock', C.ink)} label="Нууц үг солих" top onClick={go('passwordChange')}/>
          <MenuRow icon={pIcon('globe', C.ink)} label="Хэл" value="Монгол" chevron top onClick={go('language')}/>
          <MenuRow icon={pIcon('bell', C.ink)} label="Мэдэгдлийн тохиргоо" top onClick={go('notifSettings')}/>
        </MenuGroup>

        <MenuGroup title="Гэрээ, баримт">
          <MenuRow icon={pIcon('doc', C.ink)} label="Үндсэн гэрээ" onClick={go('profileContract')}/>
          <MenuRow icon={pIcon('docs', C.ink)} label="Миний гэрээнүүд" top onClick={go('myContracts')}/>
        </MenuGroup>

        <MenuGroup title="Тодорхойлолт авах">
          <MenuRow icon={pIcon('cert', C.green)} label="Хөрөнгө оруулалтын тодорхойлолт" onClick={go('certInvest')}/>
          {!window.MMF_V1 && <MenuRow icon={pIcon('cert', C.indigo)} label="Зээлийн тодорхойлолт" top onClick={go('certLoan')}/>}
        </MenuGroup>

        <MenuGroup title="Бусад">
          <MenuRow icon={pIcon('shield', C.ink)} label="Үйлчилгээний нөхцөл" onClick={go('terms')}/>
          <MenuRow icon={pIcon('help', C.ink)} label="Тусламж" top onClick={go('help')}/>
          <MenuRow icon={pIcon('info', C.ink)} label="Апп хувилбар" value="v1.0.0" chevron={false} top/>
          <MenuRow icon={pIcon('out', C.red)} label="Гарах" danger chevron={false} top onClick={() => setLogout(true)}/>
        </MenuGroup>
      </div>

      {logout && (
        <div style={{ position:'absolute', inset:0, background:'rgba(5,11,31,.45)', display:'flex', flexDirection:'column', justifyContent:'flex-end', zIndex:20 }}>
          <div onClick={() => setLogout(false)} style={{ position:'absolute', inset:0 }}/>
          <div style={{ position:'relative', background:'#fff', borderRadius:'24px 24px 0 0', padding:'24px 24px 30px', boxShadow:'0 -10px 40px -16px rgba(15,20,55,.4)' }}>
            <div style={{ width:40, height:5, borderRadius:999, background:C.line, margin:'0 auto 18px' }}/>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: C.redSoft, display:'flex', alignItems:'center', justifyContent:'center', marginBottom: 14 }}>
              {pIcon('out', C.red)}
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.ink, letterSpacing:'-0.01em' }}>Гарах уу?</div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 8, lineHeight: 1.6 }}>Та дахин нэвтрэхдээ утасны дугаар, нууц үгээ оруулах шаардлагатай болно.</div>
            <div style={{ marginTop: 20, display:'flex', flexDirection:'column', gap: 10 }}>
              <button onClick={() => setLogout(false)} style={{ width:'100%', height: 52, borderRadius: 14, background: C.indigo, color:'#fff', border:'none', fontWeight: 700, fontSize: 15, cursor:'pointer', boxShadow:'0 8px 22px -8px rgba(79,70,229,.5)' }}>Болих</button>
              <button onClick={() => { setLogout(false); onNav && onNav('login'); }} style={{ width:'100%', height: 48, borderRadius: 14, background:'transparent', color: C.red, border:`1.5px solid ${C.red}`, fontWeight: 700, fontSize: 14, cursor:'pointer' }}>Гарах</button>
            </div>
          </div>
        </div>
      )}
    </Frame>
  );
};

// ============================================================
// PERSONAL INFO (read-only KYC)
// ============================================================
const PersonalInfo = () => {
  const rows = [
    { l:'Овог нэр', v:'Батболд Тэмүүжин' },
    { l:'Регистрийн дугаар', v:'УБ91051512' },
    { l:'Утасны дугаар', v:'+976 9905 1512' },
    { l:'И-мэйл', v:'temuujin@example.mn' },
    { l:'Төрсөн огноо', v:'1991-05-15' },
    { l:'Хаяг', v:'Улаанбаатар, ХУД, 15-р хороо' },
  ];
  return (
    <Frame label="Profile · personal info">
      <BackBar title="Хувийн мэдээлэл"/>
      <div style={{ flex:1, overflow:'auto', padding:'2px 24px 24px' }}>
        <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
          <Badge tone="new">КҮС баталгаажсан</Badge>
          <span style={{ fontSize: 11.5, color: C.muted, fontWeight: 600 }}>Шинэчилсэн 2026-05-22</span>
        </div>
        <div style={{ marginTop: 14, background:'#fff', borderRadius: 18, border:`1px solid ${C.line2}`, overflow:'hidden' }}>
          {rows.map((r, i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap: 14, padding:'14px 16px', borderTop: i ? `1px solid ${C.line2}` : 'none' }}>
              <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 600, flexShrink:0 }}>{r.l}</span>
              <span style={{ fontSize: 13, color: C.ink, fontWeight: 700, textAlign:'right' }}>{r.v}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, display:'flex', gap: 10, alignItems:'flex-start', padding: 14, borderRadius: 14, background:'#FAFBFE', border:`1px solid ${C.line2}` }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:1 }}><circle cx="12" cy="12" r="9" stroke={C.muted2} strokeWidth="2"/><path d="M12 8v.5M12 11v5" stroke={C.muted2} strokeWidth="2" strokeLinecap="round"/></svg>
          <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.55 }}>Энэ мэдээлэл КҮС-ээр баталгаажсан тул засварлах боломжгүй. Өөрчлөх шаардлагатай бол <span style={{ color: C.indigo, fontWeight: 700 }}>дэмжлэгтэй холбогдоно</span> уу.</div>
        </div>
      </div>
    </Frame>
  );
};

// ============================================================
// NOTIFICATION SETTINGS (toggles)
// ============================================================
const Toggle = ({ on, onClick }) => (
  <button onClick={onClick} style={{ width: 44, height: 26, borderRadius: 999, border:'none', cursor:'pointer', background: on ? C.indigo : C.line, position:'relative', transition:'background .15s', flexShrink:0 }}>
    <span style={{ position:'absolute', top: 3, left: on ? 21 : 3, width: 20, height: 20, borderRadius: 999, background:'#fff', transition:'left .15s', boxShadow:'0 1px 3px rgba(0,0,0,.2)' }}/>
  </button>
);
const NotifSettings = () => {
  const [s, setS] = useStateP({ txn:true, trade:true, loan:true, sys:false, email:true });
  const flip = (k) => () => setS(v => ({ ...v, [k]: !v[k] }));
  const group = (title, items) => (
    <div style={{ marginTop: 18 }}>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, letterSpacing:'0.04em', textTransform:'uppercase', padding:'0 4px 8px' }}>{title}</div>
      <div style={{ background:'#fff', borderRadius: 16, border:`1px solid ${C.line2}`, overflow:'hidden' }}>
        {items.map((it, i) => (
          <div key={it.k} style={{ display:'flex', alignItems:'center', gap: 12, padding:'13px 14px', borderTop: i ? `1px solid ${C.line2}` : 'none' }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}>{it.l}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{it.d}</div>
            </div>
            <Toggle on={s[it.k]} onClick={flip(it.k)}/>
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <Frame label="Profile · notif settings">
      <BackBar title="Мэдэгдлийн тохиргоо"/>
      <div style={{ flex:1, overflow:'auto', padding:'2px 24px 24px' }}>
        {group('Апп мэдэгдэл', [
          { k:'txn', l:'Гүйлгээний мэдэгдэл', d:'Орлого, зарлага, шилжүүлэг' },
          { k:'trade', l:'Арилжааны мэдэгдэл', d:'Худалдан авалт, өгөөж, зарах санал' },
          { k:'loan', l:'Зээлийн мэдэгдэл', d:'Хүсэлт, эргэн төлөлтийн сануулга' },
          { k:'sys', l:'Системийн мэдэгдэл', d:'Шинэчлэлт, аюулгүй байдал' },
        ])}
        {group('И-мэйл', [
          { k:'email', l:'И-мэйл мэдэгдэл', d:'Чухал мэдэгдлийг и-мэйлээр хүлээн авах' },
        ])}
      </div>
    </Frame>
  );
};

// ============================================================
// MY CONTRACTS (list → contract viewer)
// ============================================================
const MyContracts = ({ onNav }) => {
  const products = [
    { t:'CAPIT 1450 CD', n:'CT-2026-04823', d:'2026-05-22' },
    { t:'GOLDH 2300 IT', n:'CT-2026-04102', d:'2026-04-14' },
    { t:'MSTRT 2400 IT', n:'CT-2025-09810', d:'2025-11-17' },
  ];
  const loans = [
    { t:'Зээлийн гэрээ', n:'LN-2026-04823', d:'2026-05-29' },
  ];
  const Row = ({ c, top }) => (
    <button onClick={() => onNav && onNav('profileContract')} style={{ width:'100%', textAlign:'left', display:'flex', alignItems:'center', gap: 12, padding:'13px 14px', background:'transparent', border:'none', borderTop: top ? `1px solid ${C.line2}` : 'none', cursor:'pointer' }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background:'#F4F6FB', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{pIcon('doc', C.indigo)}</div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: C.ink }}>{c.t}</div>
        <div style={{ fontSize: 11, color: C.muted, marginTop: 2, fontFamily:"'JetBrains Mono', monospace" }}>{c.n} · {c.d}</div>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke={C.muted2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </button>
  );
  return (
    <Frame label="Profile · my contracts">
      <BackBar title="Миний гэрээнүүд"/>
      <div style={{ flex:1, overflow:'auto', padding:'2px 24px 24px' }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, letterSpacing:'0.04em', textTransform:'uppercase', padding:'0 4px 8px', marginTop: 6 }}>Бүтээгдэхүүний гэрээ</div>
        <div style={{ background:'#fff', borderRadius: 16, border:`1px solid ${C.line2}`, overflow:'hidden' }}>
          {products.map((c, i) => <Row key={i} c={c} top={i > 0}/>)}
        </div>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, letterSpacing:'0.04em', textTransform:'uppercase', padding:'0 4px 8px', marginTop: 18 }}>Зээлийн гэрээ</div>
        <div style={{ background:'#fff', borderRadius: 16, border:`1px solid ${C.line2}`, overflow:'hidden' }}>
          {loans.map((c, i) => <Row key={i} c={c} top={i > 0}/>)}
        </div>
      </div>
    </Frame>
  );
};

// ============================================================
// ТОДОРХОЙЛОЛТ REQUEST (type: invest | loan) + success
// ============================================================
const CertRequest = ({ type='invest' }) => {
  const cfg = type === 'loan'
    ? { title:'Зээлийн тодорхойлолт', items:['Идэвхтэй зээлийн дэлгэрэнгүй','Үлдэгдэл ба эргэн төлөлтийн хуваарь','Төлөлтийн түүх','Баталгаажуулсан QR код'] }
    : { title:'Хөрөнгө оруулалтын тодорхойлолт', items:['Эзэмшиж буй бүтээгдэхүүний жагсаалт','Нийт үнэ цэнэ ба хуримтлагдсан өгөөж','Тайлант хугацааны гүйлгээ','Баталгаажуулсан QR код'] };
  return (
    <Frame label={'Profile · cert ' + type}>
      <BackBar title={cfg.title}/>
      <div style={{ flex:1, overflow:'auto', padding:'2px 24px 16px' }}>
        <div style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.6 }}>Тодорхойлолтод дараах мэдээлэл багтана:</div>
        <div style={{ marginTop: 12, background:'#fff', borderRadius: 16, border:`1px solid ${C.line2}`, overflow:'hidden' }}>
          {cfg.items.map((t, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap: 12, padding:'12px 14px', borderTop: i ? `1px solid ${C.line2}` : 'none' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill={C.greenSoft}/><path d="M8 12l3 3 5-6" stroke={C.green} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span style={{ fontSize: 13, color: C.ink, fontWeight: 600 }}>{t}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 18, fontSize: 12, color: C.muted, fontWeight: 700, letterSpacing:'0.04em', textTransform:'uppercase' }}>Хүргэх арга</div>
        <div style={{ marginTop: 10, background:'#fff', borderRadius: 16, border:`1px solid ${C.line2}`, padding: 14 }}>
          <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: C.indigoSoft, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 8l9 6 9-6M3 7h18v10H3z" stroke={C.indigo} strokeWidth="2" strokeLinejoin="round"/></svg>
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: C.ink }}>И-мэйлээр илгээх</div>
          </div>
          <div style={{ marginTop: 12, height: 48, borderRadius: 12, border:`1.5px solid ${C.line}`, background:'#FAFBFE', display:'flex', alignItems:'center', padding:'0 14px' }}>
            <input data-nodrag defaultValue="temuujin@example.mn" style={{ flex:1, border:'none', outline:'none', background:'transparent', fontSize: 14, fontWeight: 600, color: C.ink }}/>
          </div>
        </div>

        <div style={{ marginTop: 12, background:'#FAFBFE', borderRadius: 14, border:`1px solid ${C.line2}`, padding:'13px 16px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 600 }}>Үйлчилгээний хураамж</span>
          <span style={{ fontSize: 13.5, color: C.ink, fontWeight: 800 }}>Төлбөргүй</span>
        </div>
      </div>
      <div style={{ padding:'12px 24px 16px', borderTop:`1px solid ${C.line2}`, background:'#fff', flexShrink:0 }}>
        <button style={{ width:'100%', height: 52, borderRadius: 14, background: C.indigo, color:'#fff', border:'none', fontWeight: 700, fontSize: 15, cursor:'pointer', boxShadow:'0 8px 22px -8px rgba(79,70,229,.5)' }}>Хүсэлт илгээх</button>
      </div>
    </Frame>
  );
};
const CertSuccess = () => (
  <Frame label="Profile · cert success">
    <div style={{ height: 44, flexShrink:0 }}/>
    <div style={{ flex:1, overflow:'auto', padding:'6px 24px 22px', display:'flex', flexDirection:'column' }}>
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center' }}>
        <div style={{ width: 88, height: 88, borderRadius: 28, background:`linear-gradient(135deg, ${C.green}, #0B8F60)`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 18px 40px -12px rgba(14,159,110,.55)' }}>
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.ink, marginTop: 22, letterSpacing:'-0.02em' }}>Хүсэлт амжилттай илгээгдлээ</div>
        <div style={{ fontSize: 13.5, color: C.muted, marginTop: 10, lineHeight: 1.55, maxWidth: 290 }}>Тодорхойлолтыг 1 ажлын өдрийн дотор <strong style={{ color: C.ink }}>temuujin@example.mn</strong> хаяг руу илгээнэ.</div>
      </div>
    </div>
    <div style={{ padding:'12px 24px 16px', background:'#fff', borderTop:`1px solid ${C.line2}`, flexShrink:0 }}>
      <button style={{ width:'100%', height: 52, borderRadius: 14, background: C.indigo, color:'#fff', border:'none', fontWeight: 700, fontSize: 15, cursor:'pointer', boxShadow:'0 8px 22px -8px rgba(79,70,229,.5)' }}>Профайл руу буцах</button>
    </div>
  </Frame>
);

// ============================================================
// TERMS OF SERVICE (scrollable text)
// ============================================================
const TermsScreen = () => {
  const secs = [
    { h:'1. Ерөнхий нөхцөл', b:'Энэхүү үйлчилгээний нөхцөл нь Мони Маркет Фанд ХХК (цаашид "Платформ") болон хэрэглэгчийн хооронд үүсэх харилцааг зохицуулна. Платформыг ашигласнаар та доорх нөхцөлийг хүлээн зөвшөөрсөнд тооцно.' },
    { h:'2. Бүртгэл ба баталгаажуулалт', b:'Хэрэглэгч нь үнэн зөв мэдээлэл оруулж, КҮС баталгаажуулалтыг бүрэн хийсэн байх шаардлагатай. Бүртгэлийн мэдээллийн үнэн зөв байдлыг хэрэглэгч хариуцна.' },
    { h:'3. Хөрөнгө оруулалтын эрсдэл', b:'Үнэт цаасны зах зээл дэх хөрөнгө оруулалт эрсдэлтэй бөгөөд өнгөрсөн үеийн өгөөж ирээдүйн үр дүнг баталгаажуулахгүй. Платформ нь хөрөнгө оруулалтын аливаа алдагдлыг хариуцахгүй.' },
    { h:'4. Гүйлгээ ба төлбөр тооцоо', b:'Платформ дээрх бүх гүйлгээ нь холбогдох хууль, журмын дагуу гүйцэтгэгдэнэ. Гүйлгээний шимтгэл, нөхцөлийг тухай бүрт нь танд мэдэгдэнэ.' },
    { h:'5. Нууцлал', b:'Хэрэглэгчийн хувийн мэдээллийг Платформ нь нууцлалын бодлогын дагуу хадгалж, хамгаална. Мэдээллийг гуравдагч этгээдэд хууль зөвшөөрснөөс бусад тохиолдолд дамжуулахгүй.' },
    { h:'6. Хариуцлага', b:'Платформ нь техникийн доголдол, гуравдагч талын үйлчилгээний саатлаас үүдэлтэй шууд бус хохирлыг хариуцахгүй болохыг хэрэглэгч хүлээн зөвшөөрнө.' },
  ];
  return (
    <Frame label="Profile · terms">
      <BackBar title="Үйлчилгээний нөхцөл"/>
      <div style={{ flex:1, overflow:'auto', padding:'4px 24px 28px' }}>
        <div style={{ fontSize: 11.5, color: C.muted, fontWeight: 600, marginTop: 4 }}>Хүчинтэй огноо: 2026-01-01 · Хувилбар 1.0</div>
        {secs.map((s, i) => (
          <div key={i} style={{ marginTop: 18 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.ink, letterSpacing:'-0.01em' }}>{s.h}</div>
            <div style={{ fontSize: 13, color: C.text, marginTop: 7, lineHeight: 1.7 }}>{s.b}</div>
          </div>
        ))}
        <div style={{ marginTop: 22, fontFamily:"'JetBrains Mono', monospace", fontSize: 10.5, color: C.muted2, textAlign:'center' }}>// нөхцөлийн бүрэн эх — жишээ баримт</div>
      </div>
    </Frame>
  );
};

Object.assign(window, { ProfileMain, PersonalInfo, NotifSettings, MyContracts, CertRequest, CertSuccess, TermsScreen });
