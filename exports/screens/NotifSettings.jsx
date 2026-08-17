/* =========================================================================
   Money Market Fund — Mobile App · Screen: NotifSettings
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

const Toggle = ({ on, onClick }) => (
  <button onClick={onClick} style={{ width: 44, height: 26, borderRadius: 999, border:'none', cursor:'pointer', background: on ? C.indigo : C.line, position:'relative', transition:'background .15s', flexShrink:0 }}>
    <span style={{ position:'absolute', top: 3, left: on ? 21 : 3, width: 20, height: 20, borderRadius: 999, background:'#fff', transition:'left .15s', boxShadow:'0 1px 3px rgba(0,0,0,.2)' }}/>
  </button>
);

/* ----- this screen ----- */
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

(window.__MMF_SCREENS = window.__MMF_SCREENS || {}).NotifSettings = NotifSettings;
})();