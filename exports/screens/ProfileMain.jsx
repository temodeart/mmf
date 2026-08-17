/* =========================================================================
   Money Market Fund — Mobile App · Screen: ProfileMain
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

const Dot = ({ color }) => (
  <span style={{ display:'inline-block', width:6, height:6, borderRadius:999, background: color }}/>
);

const Badge = ({ tone='new', children }) => {
  const map = {
    new:    { fg: C.green,  bg: C.greenSoft,  dot: C.green },
    active: { fg: C.amber,  bg: C.amberSoft,  dot: C.amber },
    sell:   { fg: C.red,    bg: C.redSoft,    dot: C.red },
    buy:    { fg: C.blue,   bg: C.blueSoft,   dot: C.blue },
    info:   { fg: C.indigo, bg: C.indigoSoft, dot: C.indigo },
  }[tone] || { fg: C.muted, bg: C.line2, dot: C.muted };
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:6,
      padding:'4px 10px', borderRadius: 999,
      background: map.bg, color: map.fg, fontSize: 11, fontWeight: 700,
      letterSpacing: '0.01em',
    }}>
      <Dot color={map.dot}/>{children}
    </span>
  );
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

/* module aliases (profile.jsx) */
const useStateP = React.useState;

const pIcon = (k, color = C.ink) => {
  const p = { stroke: color, strokeWidth: 2, fill:'none', strokeLinecap:'round', strokeLinejoin:'round' };
  const M = {
    user:  <g {...p}><circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0114 0"/></g>,
    pin:   <g {...p}><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></g>,
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

const MenuGroup = ({ title, children }) => (
  <div style={{ marginTop: 18 }}>
    {title && <div style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, letterSpacing:'0.04em', textTransform:'uppercase', padding:'0 4px 8px' }}>{title}</div>}
    <div style={{ background:'#fff', borderRadius: 16, border:`1px solid ${C.line2}`, overflow:'hidden' }}>{children}</div>
  </div>
);

const MenuRow = ({ icon, label, value, danger, chevron=true, onClick, top }) => (
  <button onClick={onClick} style={{ width:'100%', textAlign:'left', display:'flex', alignItems:'center', gap:12, padding:'13px 14px', background:'transparent', border:'none', borderTop: top ? `1px solid ${C.line2}` : 'none', cursor:'pointer' }}>
    {icon && <div style={{ width:34, height:34, borderRadius:10, background: danger ? C.redSoft : '#F4F6FB', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{icon}</div>}
    <span style={{ flex:1, fontSize:13.5, fontWeight:600, color: danger ? C.red : C.ink }}>{label}</span>
    {value && <span style={{ fontSize:12.5, color:C.muted, fontWeight:600 }}>{value}</span>}
    {chevron && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginLeft: value ? 4 : 0, flexShrink:0 }}><path d="M9 6l6 6-6 6" stroke={C.muted2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
  </button>
);

// ============================================================
// PROFILE MAIN
// ============================================================

/* ----- this screen ----- */
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
          <MenuRow icon={pIcon('pin', C.ink)} label="ПИН код солих"/>
          <MenuRow icon={pIcon('lock', C.ink)} label="Нууц үг солих" top/>
          <MenuRow icon={pIcon('globe', C.ink)} label="Хэл" value="Монгол" chevron top/>
          <MenuRow icon={pIcon('bell', C.ink)} label="Мэдэгдлийн тохиргоо" top onClick={go('notifSettings')}/>
        </MenuGroup>

        <MenuGroup title="Гэрээ, баримт">
          <MenuRow icon={pIcon('doc', C.ink)} label="Үндсэн гэрээ" onClick={go('profileContract')}/>
          <MenuRow icon={pIcon('docs', C.ink)} label="Миний гэрээнүүд" top onClick={go('myContracts')}/>
        </MenuGroup>

        <MenuGroup title="Тодорхойлолт авах">
          <MenuRow icon={pIcon('cert', C.green)} label="Хөрөнгө оруулалтын тодорхойлолт" onClick={go('certInvest')}/>
          <MenuRow icon={pIcon('cert', C.indigo)} label="Зээлийн тодорхойлолт" top onClick={go('certLoan')}/>
        </MenuGroup>

        <MenuGroup title="Бусад">
          <MenuRow icon={pIcon('shield', C.ink)} label="Үйлчилгээний нөхцөл" onClick={go('terms')}/>
          <MenuRow icon={pIcon('help', C.ink)} label="Тусламж" top/>
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
              <button style={{ width:'100%', height: 48, borderRadius: 14, background:'transparent', color: C.red, border:`1.5px solid ${C.red}`, fontWeight: 700, fontSize: 14, cursor:'pointer' }}>Гарах</button>
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

(window.__MMF_SCREENS = window.__MMF_SCREENS || {}).ProfileMain = ProfileMain;
})();