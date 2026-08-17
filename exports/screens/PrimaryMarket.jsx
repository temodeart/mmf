/* =========================================================================
   Money Market Fund — Mobile App · Screen: PrimaryMarket
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

/* ----- this screen ----- */
const PrimaryMarket = ({ onNav }) => {
  const chips = ['Бүгд','Сертификат','Итгэлцэл','Нэхэмжлэх','Арилжааны бичиг'];
  const [active, setActive] = useState(0);
  const all = [
    { issuer:'Капитрон Банк ХК',           ticker:'CAPIT 1450', type:'Сертификат',      yield:'14.5', term:'12 сар',   price:'100,000',   avail:'1.2 тэрбум', c: C.blue,   logoColor:'#1677FF' },
    { issuer:'Хадгаламж Банк ХК',          ticker:'XADGB 1180', type:'Сертификат',      yield:'12.5', term:'6 сар',    price:'100,000',   avail:'900 сая',    c: C.blue,   logoColor:'#0E5F8A' },
    { issuer:'Голден Хилл Партнерс ББСБ',  ticker:'GOLDH 2300', type:'Итгэлцэл',        yield:'23.0', term:'12 сар',   price:'1,000,000', avail:'365 сая',    c:'#F59E0B', logoColor:'#F59E0B' },
    { issuer:'Кредитекс СТМ ББСБ',         ticker:'MSTRT 2400', type:'Итгэлцэл',        yield:'19.5', term:'6 сар',    price:'1,000,000', avail:'785 сая',    c: C.indigo, logoColor: C.indigo },
    { issuer:'Анлок Капитал ББСБ',         ticker:'ANLOK 2250', type:'Итгэлцэл',        yield:'22.5', term:'1 жил',    price:'1,000,000', avail:'540 сая',    c: C.blue,   logoColor:'#2D6BFF' },
    { issuer:'Мерит Финанс ББСБ',          ticker:'MERIT 1900', type:'Нэхэмжлэх',       yield:'19.0', term:'90 хоног', price:'500,000',   avail:'220 сая',    c: C.green,  logoColor:'#0E9F6E' },
    { issuer:'Тэнгэр Капитал ББСБ',        ticker:'TENGR 1750', type:'Нэхэмжлэх',       yield:'17.5', term:'120 хоног',price:'500,000',   avail:'180 сая',    c: C.green,  logoColor:'#0891B2' },
    { issuer:'Эм Си Эс Холдинг ХК',        ticker:'MCSH 0800',  type:'Арилжааны бичиг', yield:'8.0',  term:'60 хоног', price:'1,000,000', avail:'1.5 тэрбум', c: C.orange, logoColor:'#FF6B2C' },
    { issuer:'Болор Девелопмент ХК',       ticker:'BOLOR 0650', type:'Арилжааны бичиг', yield:'6.5',  term:'45 хоног', price:'1,000,000', avail:'800 сая',    c: C.orange, logoColor:'#DC2626' },
  ];
  const list = active === 0 ? all : all.filter(p => p.type === chips[active]);
  return (
    <Frame label="26 — Primary market · Анхдагч зах">
      <BackBar title="Анхдагч зах"/>
      <div style={{ padding: '2px 24px 12px', flexShrink: 0 }}>
        <div style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Шинэ гаргалт · гаргагчаас шууд · {all.length} нээлттэй</div>
        {/* type filters */}
        <div style={{ display:'flex', gap: 8, marginTop: 12, overflowX:'auto', marginLeft: -24, marginRight: -24, paddingLeft: 24, paddingRight: 24 }}>
          {chips.map((c, i) => (
            <div key={i} onClick={() => setActive(i)} style={{
              padding: '8px 14px', borderRadius: 999, whiteSpace:'nowrap',
              background: active===i ? C.ink : '#fff', color: active===i ? '#fff' : C.text,
              border: `1px solid ${active===i ? C.ink : C.line}`,
              fontSize: 13, fontWeight: 600, cursor:'pointer', flexShrink: 0,
            }}>{c}</div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflow:'auto', padding: '2px 24px 16px' }}>
        <div style={{ display:'flex', flexDirection:'column', gap: 12 }}>
          {list.map((p, i) => (
            <div key={i} onClick={() => onNav && onNav('primaryDetail')} style={{
              background:'#fff', borderRadius: 20, padding: 16, border:`1px solid ${C.line2}`,
              boxShadow:'0 2px 6px -2px rgba(15,20,55,.04)', cursor:'pointer',
            }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap: 10 }}>
                <div style={{ display:'flex', alignItems:'center', gap: 10, minWidth: 0 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: p.logoColor, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
                    {p.issuer.charAt(0)}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, letterSpacing:'-0.01em', lineHeight:1.2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.issuer}</div>
                    <div style={{ fontSize: 10, color: C.muted, marginTop: 2, fontFamily:'JetBrains Mono, monospace', letterSpacing:'0.02em' }}>{p.ticker}</div>
                  </div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: p.c, background:`${p.c}14`, padding:'4px 9px', borderRadius: 999, whiteSpace:'nowrap', flexShrink: 0 }}>{p.type}</span>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 8, marginTop: 14 }}>
                {[
                  { l:'Үр шим', v: p.yield+'%', strong: true },
                  { l:'Хугацаа', v: p.term },
                  { l:'Нэрлэсэн үнэ', v: '₮ '+p.price },
                  { l:'Боломжит', v: '₮ '+p.avail },
                ].map((x, j)=>(
                  <div key={j}>
                    <div style={{ fontSize: 10, color: C.muted, fontWeight: 600 }}>{x.l}</div>
                    <div style={{ fontSize: x.strong ? 16 : 12, fontWeight: x.strong ? 800 : 600, color: x.strong ? p.c : C.ink, marginTop: 2, fontVariantNumeric:'tabular-nums', letterSpacing: x.strong ? '-0.02em' : 0 }}>{x.v}</div>
                  </div>
                ))}
              </div>
              <button style={{
                width:'100%', height: 40, borderRadius: 12, marginTop: 14,
                background: C.indigo, color:'#fff', fontWeight: 700, fontSize: 13, border:'none', cursor:'pointer',
              }}>Авах</button>
            </div>
          ))}
        </div>
        <div style={{ height: 12 }}/>
      </div>
    </Frame>
  );
};

// ============================================================
// 10 — INSTRUMENT CATEGORY LISTING (Итгэлцэл)
// ============================================================

(window.__MMF_SCREENS = window.__MMF_SCREENS || {}).PrimaryMarket = PrimaryMarket;
})();