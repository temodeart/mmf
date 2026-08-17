/* =========================================================================
   Money Market Fund — Mobile App · Screen: ContractViewer
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

const LogoMark = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path d="M9.6 11.4V28.6L0 34.4V0h9.9L24 8.4 38.1 0H48v5.6L24 20 9.6 11.4z" fill="#FF6B2C"/>
    <path d="M38.4 36.6V19.4L48 13.6V48h-9.9L24 39.6 9.9 48H0v-5.6L24 28l14.4 8.6z" fill="#2D6BFF"/>
  </svg>
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

/* ----- this screen ----- */
const ContractViewer = () => {
  const Bar = ({ w='100%' }) => <div style={{ height: 8, borderRadius: 4, background:'#EAECF2', width: w }}/>;
  const IconBtn = ({ children }) => (
    <button style={{ width: 40, height: 40, borderRadius: 12, background:'#fff', border:`1px solid ${C.line}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>{children}</button>
  );
  return (
    <Frame label="L3.5 — Contract viewer" bg="#E9EBF1">
      <div style={{ height: 56, flexShrink: 0, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 12px', background:'#fff', borderBottom:`1px solid ${C.line2}` }}>
        <IconBtn><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke={C.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></IconBtn>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>Гэрээ</div>
        <div style={{ display:'flex', gap: 8 }}>
          <IconBtn><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 4v10M8 11l4 4 4-4M5 19h14" stroke={C.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></IconBtn>
          <IconBtn><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="6" cy="12" r="2.4" stroke={C.ink} strokeWidth="2"/><circle cx="18" cy="6" r="2.4" stroke={C.ink} strokeWidth="2"/><circle cx="18" cy="18" r="2.4" stroke={C.ink} strokeWidth="2"/><path d="M8.2 10.9l7.6-3.8M8.2 13.1l7.6 3.8" stroke={C.ink} strokeWidth="2"/></svg></IconBtn>
        </div>
      </div>

      <div style={{ flex: 1, overflow:'auto', padding: 18, background:'#E9EBF1' }}>
        <div style={{ background:'#fff', borderRadius: 6, boxShadow:'0 10px 30px -12px rgba(15,20,55,.3)', padding: '26px 24px', border:`1px solid ${C.line2}` }}>
          {/* letterhead */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:`2px solid ${C.ink}`, paddingBottom: 14 }}>
            <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
              <LogoMark size={26}/>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: C.ink }}>Мони Маркет Фанд ХХК</div>
                <div style={{ fontSize: 8.5, color: C.muted, fontWeight: 600, letterSpacing:'0.04em' }}>MONEY MARKET FUND LLC</div>
              </div>
            </div>
            <div style={{ fontSize: 8.5, color: C.muted, fontWeight: 700, textAlign:'right', fontFamily:'monospace', lineHeight: 1.4 }}>СЗХ ЗОХИЦУУЛАЛТ<br/>2024-А/118</div>
          </div>

          <div style={{ fontSize: 14, fontWeight: 800, color: C.ink, textAlign:'center', marginTop: 18, lineHeight: 1.4, letterSpacing:'0.01em' }}>ҮНЭТ ЦААС ХУДАЛДАХ,<br/>ХУДАЛДАН АВАХ ГЭРЭЭ</div>

          <div style={{ display:'flex', justifyContent:'space-between', marginTop: 16, fontSize: 10.5 }}>
            <div><span style={{ color: C.muted, fontWeight: 600 }}>Дугаар:</span> <span style={{ fontWeight: 800, color: C.ink, fontFamily:'monospace' }}>CT-2026-04823</span></div>
            <div><span style={{ color: C.muted, fontWeight: 600 }}>Огноо:</span> <span style={{ fontWeight: 800, color: C.ink, fontVariantNumeric:'tabular-nums' }}>2026-05-22</span></div>
          </div>

          <div style={{ marginTop: 16, display:'flex', flexDirection:'column', gap: 9 }}>
            {[
              { r:'Худалдагч /Гаргагч/', n:'Капитрон Банк ХХК', reg:'РД: 2611290' },
              { r:'Худалдан авагч', n:'Батболд Тэмүүжин', reg:'РД: УБ91051512' },
              { r:'Зохицуулагч', n:'Мони Маркет Фанд ХХК', reg:'РД: 6700123' },
            ].map((p, i) => (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', borderBottom:`1px dashed ${C.line2}`, paddingBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 9, color: C.muted, fontWeight: 700, textTransform:'uppercase', letterSpacing:'0.04em' }}>{p.r}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginTop: 2 }}>{p.n}</div>
                </div>
                <div style={{ fontSize: 9.5, color: C.muted, fontWeight: 600, fontFamily:'monospace' }}>{p.reg}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, display:'flex', flexDirection:'column', gap: 16 }}>
            {['Нэг. Гэрээний зүйл','Хоёр. Талуудын эрх, үүрэг','Гурав. Төлбөр тооцоо'].map((h, i) => (
              <div key={i}>
                <div style={{ fontSize: 11.5, fontWeight: 800, color: C.ink }}>{h}</div>
                <div style={{ marginTop: 8, display:'flex', flexDirection:'column', gap: 6 }}>
                  <Bar/><Bar/><Bar w="78%"/>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, fontFamily:'monospace', fontSize: 9.5, color: C.muted2, textAlign:'center' }}>// гэрээний бүрэн эх — жишээ баримт</div>

          <div style={{ marginTop: 22, display:'flex', justifyContent:'space-between', gap: 16 }}>
            {['Худалдагч','Худалдан авагч'].map((s, i) => (
              <div key={i} style={{ flex: 1 }}>
                <div style={{ height: 34 }}/>
                <div style={{ borderTop:`1px solid ${C.muted2}`, paddingTop: 6, fontSize: 9.5, color: C.muted, fontWeight: 600, textAlign:'center' }}>{s}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: 16 }}/>
      </div>
    </Frame>
  );
};

// ---------- 3.2 — Sell setup (create listing) ----------

(window.__MMF_SCREENS = window.__MMF_SCREENS || {}).ContractViewer = ContractViewer;
})();