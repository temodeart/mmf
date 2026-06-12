// ============================================================
// Money Market Fund — Mobile App Screens
// All copy in Mongolian Cyrillic. White-first, regulated fintech.
// ============================================================

const { useState, useRef, useEffect } = React;

// ----- Design tokens -----
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

const LogoFull = ({ dark = false, size = 24 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <LogoMark size={size + 4} />
    <div style={{
      fontWeight: 800, fontSize: size * 0.46, lineHeight: 1.1, letterSpacing: '-0.01em',
      color: dark ? '#fff' : C.ink, textTransform: 'none',
    }}>
      Money<br/>Market<br/>Fund
    </div>
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

const Field = ({ label, value, placeholder, focused }) => (
  <div>
    <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 8, letterSpacing:'0.01em' }}>{label}</div>
    <div style={{
      height: 52, borderRadius: 14,
      background: focused ? '#fff' : '#FAFBFE',
      border: `1.5px solid ${focused ? C.indigo : C.line}`,
      boxShadow: focused ? `0 0 0 4px ${C.indigoSoft}` : 'none',
      padding: '0 16px', display: 'flex', alignItems: 'center',
      color: value ? C.ink : C.muted2, fontSize: 15, fontWeight: 500,
    }}>{value || placeholder}</div>
  </div>
);

// Tiny sparkline
const Spark = ({ data, color, height = 36, width = 100, fill = true }) => {
  const max = Math.max(...data), min = Math.min(...data);
  const r = max - min || 1;
  const pts = data.map((v, i) => [(i/(data.length-1))*width, height - ((v-min)/r)*(height-4) - 2]);
  const d = 'M' + pts.map(p => p.join(',')).join(' L');
  const area = d + ` L${width},${height} L0,${height} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{display:'block'}}>
      {fill && <path d={area} fill={color} opacity=".12"/>}
      <path d={d} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

// ============================================================
// SCREEN FRAME WRAPPER
// ============================================================
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
const Splash = () => (
  <Frame label="01 — Splash / Welcome">
    <div style={{ flex: 1, position: 'relative', padding: '24px 24px 0', display: 'flex', flexDirection: 'column' }}>
      {/* abstract gradient shape */}
      <div style={{
        position: 'absolute', top: -120, right: -100, width: 380, height: 380,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%, #2D6BFF 0%, #4F46E5 45%, #050B1F 100%)',
        opacity: .9, filter: 'blur(2px)',
      }}/>
      <div style={{
        position: 'absolute', top: 80, right: -60, width: 200, height: 200,
        borderRadius: '50%', background: 'radial-gradient(circle, #FF6B2C 0%, transparent 70%)',
        opacity: .35,
      }}/>

      <div style={{ marginTop: 32, position:'relative', zIndex:1 }}>
        <LogoMark size={44}/>
      </div>

      <div style={{ flex: 1 }}/>

      <div style={{ position: 'relative', zIndex: 1, paddingBottom: 24 }}>
        <div style={{
          fontSize: 13, fontWeight: 700, color: C.indigo, letterSpacing: '0.18em',
          textTransform: 'uppercase', marginBottom: 16,
        }}>МӨНГӨНИЙ ЗАХ ЗЭЭЛ</div>
        <div style={{ fontSize: 44, fontWeight: 800, color: C.ink, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
          Money never<br/>sleeps.
        </div>
        <div style={{ fontSize: 16, color: C.muted, marginTop: 16, lineHeight: 1.5, maxWidth: 300 }}>
          Богино хугацааны санхүүгийн бүтээгдэхүүнд найдвартай хөрөнгө оруулах боломж.
        </div>

        <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <PillBtn primary full data-nav="signup">Бүртгүүлэх</PillBtn>
          <button style={{
            height: 52, background: 'transparent', border: `1.5px solid ${C.line}`,
            borderRadius: 14, color: C.ink, fontWeight: 700, fontSize: 15, cursor: 'pointer',
          }} data-nav="login">Нэвтрэх</button>
        </div>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 11, color: C.muted2, letterSpacing: '0.04em' }}>
          МОНИ МАРКЕТ ФАНД ХХК · 2026
        </div>
      </div>
    </div>
  </Frame>
);

// ============================================================
// 02–04 — ONBOARDING
// ============================================================
const OnboardingChrome = ({ index, total = 3 }) => (
  <>
    <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink:0 }}>
      <LogoMark size={24}/>
      <button style={{
        background: 'transparent', border: 'none', color: C.muted, fontWeight: 600, fontSize: 14, cursor: 'pointer',
      }}>Алгасах</button>
    </div>
  </>
);

const OnbDots = ({ index, total = 3 }) => (
  <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 0 }}>
    {Array.from({length: total}).map((_, i) => (
      <div key={i} style={{
        height: 6, width: i === index ? 24 : 6, borderRadius: 999,
        background: i === index ? C.indigo : C.line, transition: 'all .3s',
      }}/>
    ))}
  </div>
);

// Visual A — yield curve / card stack
const VizYield = () => (
  <div style={{ position: 'relative', height: 280, padding: '0 24px' }}>
    <div style={{
      position: 'absolute', inset: '20px 24px', borderRadius: 28,
      background: 'linear-gradient(160deg, #EEF0FE 0%, #E7EEFF 60%, #F4F6FA 100%)',
    }}/>
    {/* curve */}
    <svg viewBox="0 0 340 260" style={{ position:'absolute', inset:'20px 24px', width:'calc(100% - 48px)', height: 240 }}>
      <defs>
        <linearGradient id="cg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#4F46E5" stopOpacity=".35"/>
          <stop offset="100%" stopColor="#4F46E5" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d="M0 200 C 60 180, 120 80, 200 70 S 320 30, 340 20 L 340 240 L 0 240 Z" fill="url(#cg)"/>
      <path d="M0 200 C 60 180, 120 80, 200 70 S 320 30, 340 20" stroke="#4F46E5" strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* dots */}
      <circle cx="60" cy="178" r="5" fill="#fff" stroke="#4F46E5" strokeWidth="3"/>
      <circle cx="200" cy="70" r="5" fill="#fff" stroke="#4F46E5" strokeWidth="3"/>
      <circle cx="320" cy="28" r="5" fill="#fff" stroke="#4F46E5" strokeWidth="3"/>
    </svg>
    {/* floating yield card */}
    <div style={{
      position:'absolute', right: 36, top: 36, background: '#fff', borderRadius: 16, padding: '12px 14px',
      boxShadow: '0 10px 30px -10px rgba(15,20,55,.25)',
    }}>
      <div style={{ fontSize: 10, color: C.muted, fontWeight: 600, textTransform:'uppercase', letterSpacing:'0.08em' }}>Үр шим</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: C.ink, letterSpacing:'-0.02em' }}>14.5<span style={{fontSize:13,color:C.muted}}> %/жил</span></div>
    </div>
    <div style={{
      position:'absolute', left: 40, bottom: 32, background: C.navy, color:'#fff', borderRadius: 16, padding: '12px 14px',
      boxShadow: '0 10px 30px -10px rgba(15,20,55,.4)',
    }}>
      <div style={{ fontSize: 10, opacity:.6, fontWeight: 600, textTransform:'uppercase', letterSpacing:'0.08em' }}>Хугацаа</div>
      <div style={{ fontSize: 18, fontWeight: 800 }}>3–12 сар</div>
    </div>
  </div>
);

// Visual B — instrument cards stack
const VizInstruments = () => {
  const items = [
    { t: 'Хадгаламжийн сертификат', s: 'CAPIT · 14.5%', c1: '#2D6BFF', c2: '#4F46E5' },
    { t: 'Итгэлцэл',                 s: 'GOLDH · 23.0%', c1: '#4F46E5', c2: '#FF6B2C' },
    { t: 'Нэхэмжлэх',                s: 'INV · 18.0%',   c1: '#0E9F6E', c2: '#2D6BFF' },
    { t: 'Арилжааны бичиг',          s: 'NEXT · 7.5%',   c1: '#FF6B2C', c2: '#050B1F' },
  ];
  return (
    <div style={{ height: 280, padding: '0 24px', position:'relative' }}>
      {items.map((it, i) => (
        <div key={i} style={{
          position: 'absolute', left: 24 + i*18, right: 24 + (items.length - 1 - i)*0, top: 20 + i*36,
          height: 76, borderRadius: 18, padding: '14px 18px',
          background: `linear-gradient(135deg, ${it.c1} 0%, ${it.c2} 100%)`,
          color:'#fff', display:'flex', flexDirection:'column', justifyContent:'space-between',
          boxShadow: `0 18px 30px -18px ${it.c1}88`,
          transform: `rotate(${(i-1.5)*1.2}deg)`,
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, letterSpacing:'-0.01em' }}>{it.t}</div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
            <div style={{ fontSize: 11, opacity: .8, fontWeight: 600 }}>{it.s}</div>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
      ))}
    </div>
  );
};

// Visual C — security shield
const VizShield = () => (
  <div style={{ height: 280, padding: '0 24px', position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
    <div style={{
      position:'absolute', inset:'20px 24px', borderRadius: 28,
      background: 'linear-gradient(160deg, #050B1F 0%, #1A2547 100%)', overflow:'hidden',
    }}>
      {/* grid */}
      <svg width="100%" height="100%" style={{ position:'absolute', inset:0, opacity:.18 }}>
        <defs>
          <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M24 0H0V24" stroke="#fff" strokeWidth="0.5" fill="none"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)"/>
      </svg>
      {/* rings */}
      {[140, 100, 70].map((r, i) => (
        <div key={i} style={{
          position:'absolute', left:'50%', top:'50%', width:r*2, height:r*2,
          marginLeft:-r, marginTop:-r, borderRadius:'50%',
          border: `1px solid rgba(45,107,255,${.18 + i*.18})`,
        }}/>
      ))}
      {/* shield icon */}
      <div style={{
        position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)',
        width: 84, height: 84, borderRadius: 24,
        background: 'linear-gradient(135deg, #2D6BFF, #4F46E5)',
        display:'flex', alignItems:'center', justifyContent:'center',
        boxShadow:'0 18px 40px -10px rgba(45,107,255,.6)',
      }}>
        <svg width="40" height="44" viewBox="0 0 40 44" fill="none">
          <path d="M20 2L4 8v12c0 10 7 18 16 22 9-4 16-12 16-22V8L20 2z" stroke="#fff" strokeWidth="2.4" strokeLinejoin="round" fill="none"/>
          <path d="M14 22l4 4 8-9" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      </div>
    </div>
    {/* floating badges */}
    <div style={{
      position:'absolute', left: 36, top: 56, background:'#fff', borderRadius: 14, padding: '10px 12px',
      boxShadow:'0 10px 24px -8px rgba(15,20,55,.3)', display:'flex', alignItems:'center', gap:8,
    }}>
      <Dot color={C.green}/>
      <span style={{ fontSize: 12, fontWeight: 700, color: C.ink }}>СЗХ зөвшөөрөл</span>
    </div>
    <div style={{
      position:'absolute', right: 36, bottom: 56, background:'#fff', borderRadius: 14, padding: '10px 12px',
      boxShadow:'0 10px 24px -8px rgba(15,20,55,.3)', display:'flex', alignItems:'center', gap:8,
    }}>
      <Dot color={C.indigo}/>
      <span style={{ fontSize: 12, fontWeight: 700, color: C.ink }}>Хадгаламжийн даатгал</span>
    </div>
  </div>
);

const OnboardingScreen = ({ idx, total = 4, label, viz, eyebrow, title, subline }) => (
  <Frame label={label}>
    <OnboardingChrome index={idx}/>
    <div style={{ padding: '8px 0 0' }}>
      {viz}
    </div>
    <div style={{ flex: 1, padding: '32px 28px 24px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.indigo, letterSpacing: '0.18em', textTransform:'uppercase' }}>{eyebrow}</div>
        <div style={{ fontSize: 30, fontWeight: 800, color: C.ink, marginTop: 14, lineHeight: 1.1, letterSpacing:'-0.02em', textWrap:'pretty' }}>{title}</div>
        <div style={{ fontSize: 15, color: C.muted, marginTop: 14, lineHeight: 1.55 }}>{subline}</div>
      </div>
      <div>
        <OnbDots index={idx} total={total}/>
        <div style={{ display:'flex', gap: 12, marginTop: 24 }}>
          <button style={{
            flex: 1, height: 52, borderRadius: 14, border: `1.5px solid ${C.line}`,
            background:'transparent', color: C.ink, fontWeight: 700, cursor:'pointer',
          }}>Буцах</button>
          <button style={{
            flex: 2, height: 52, borderRadius: 14, border: 'none',
            background: C.indigo, color:'#fff', fontWeight: 700, cursor:'pointer',
            boxShadow:'0 8px 22px -8px rgba(79,70,229,.5)',
          }}>{idx === total - 1 ? 'Эхлэх' : 'Үргэлжлүүлэх'}</button>
        </div>
      </div>
    </div>
  </Frame>
);

// Visual D — loan / quick money
const VizLoan = () => (
  <div style={{ height: 280, padding: '0 24px', position:'relative' }}>
    <div style={{
      position:'absolute', inset:'20px 24px', borderRadius: 28,
      background: 'linear-gradient(160deg, #FFF7F1 0%, #FFEDE2 60%, #F4F6FA 100%)',
    }}/>
    {/* coin/bills stack */}
    <svg viewBox="0 0 340 240" style={{ position:'absolute', inset:'20px 24px', width:'calc(100% - 48px)', height: 240 }}>
      {/* dotted path showing flow */}
      <path d="M40 200 Q 170 60, 300 200" stroke="#FF6B2C" strokeWidth="2" strokeDasharray="4 6" fill="none" opacity=".4"/>
      {/* From: bank icon */}
      <g transform="translate(20,170)">
        <rect width="60" height="50" rx="10" fill="#fff" stroke="#FFE3CC" strokeWidth="1.5"/>
        <path d="M10 22h40M10 30h40M16 38h28" stroke="#FF6B2C" strokeWidth="2" strokeLinecap="round"/>
        <path d="M30 8L8 16h44L30 8z" fill="#FF6B2C"/>
      </g>
      {/* To: phone */}
      <g transform="translate(260,170)">
        <rect width="44" height="58" rx="8" fill={C.navy} stroke={C.navy}/>
        <rect x="4" y="6" width="36" height="42" rx="3" fill="#fff"/>
        <circle cx="22" cy="52" r="1.5" fill="#fff"/>
        <text x="22" y="32" fontSize="9" fontWeight="700" fill={C.navy} textAnchor="middle">₮</text>
      </g>
    </svg>
    {/* Money card */}
    <div style={{
      position:'absolute', left:'50%', top: 70, transform:'translateX(-50%) rotate(-4deg)',
      width: 220, height: 130, borderRadius: 16, padding: 16,
      background: `linear-gradient(135deg, ${C.navy} 0%, ${C.indigo} 100%)`,
      color:'#fff', boxShadow:'0 20px 40px -15px rgba(5,11,31,.5)',
      display:'flex', flexDirection:'column', justifyContent:'space-between',
    }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <div style={{ fontSize: 10, opacity: .7, fontWeight: 600 }}>ЗЭЭЛИЙН ХЭМЖЭЭ</div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4, letterSpacing:'-0.02em', fontVariantNumeric:'tabular-nums' }}>₮ 20,000,000</div>
        </div>
        <LogoMark size={22}/>
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
        <div>
          <div style={{ fontSize: 9, opacity: .6 }}>ХҮҮ</div>
          <div style={{ fontSize: 12, fontWeight: 700 }}>1.8% / сар</div>
        </div>
        <div style={{ fontSize: 9, opacity: .6 }}>12 САР</div>
      </div>
    </div>
    {/* Floating chips */}
    <div style={{
      position:'absolute', left: 28, top: 36, background:'#fff', borderRadius: 999, padding:'6px 12px',
      boxShadow:'0 8px 20px -8px rgba(15,20,55,.2)', display:'flex', alignItems:'center', gap: 6,
      fontSize: 11, fontWeight: 700, color: C.ink,
    }}>
      <span style={{ width: 16, height: 16, borderRadius: 999, background: C.green, display:'inline-flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize: 9, fontWeight: 800 }}>✓</span>
      Зөвшөөрөгдсөн
    </div>
    <div style={{
      position:'absolute', right: 28, top: 24, background:'#fff', borderRadius: 999, padding:'6px 12px',
      boxShadow:'0 8px 20px -8px rgba(15,20,55,.2)', display:'flex', alignItems:'center', gap: 6,
      fontSize: 11, fontWeight: 700, color: C.ink,
    }}>
      ⚡ 5 мин
    </div>
  </div>
);

const Onb1 = () => <OnboardingScreen idx={0} total={4} label="03 — Onboarding · Money market"
  viz={<VizYield/>}
  eyebrow="01 / 04"  title="Богино хугацаатай хөрөнгө оруулалт нэг газар"
  subline="Мөнгөний захын дөрвөн төрлийн бүтээгдэхүүнийг нэг платформоос харьцуулан худалдан авах боломж."
/>;
const Onb2 = () => <OnboardingScreen idx={1} total={4} label="04 — Onboarding · Instruments"
  viz={<VizInstruments/>}
  eyebrow="02 / 04"
  title="Дөрвөн төрлийн санхүүгийн хэрэгсэл"
  subline="Хадгаламжийн сертификат, Итгэлцэл, Нэхэмжлэх, Арилжааны бичиг — бүгд гар утсан дээрээс."
/>;
const Onb3 = () => <OnboardingScreen idx={2} total={4} label="05 — Onboarding · Loan"
  viz={<VizLoan/>}
  eyebrow="03 / 04"
  title="Зээлийн санхүүжилт хэдхэн товшилтоор"
  subline="Манай түнш ББСБ-уудаас цалингийн, бизнесийн болон хурдан зээлийг гар утсан дээрээсээ хүсэн авах боломж."
/>;
const Onb4 = () => <OnboardingScreen idx={3} total={4} label="06 — Onboarding · Security"
  viz={<VizShield/>}
  eyebrow="04 / 04"
  title="Зохицуулалттай, ил тод платформ"
  subline="СЗХ-ноос зөвшөөрөгдсөн арилжаа эрхлэгчдийн санхүүгийн хэрэгслийг найдвартай орчинд."
/>;

// ============================================================
// 05 — SIGN UP
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
const SignupStep1 = () => {
  const otp = ['4','7','2','1','',''];
  return (
    <Frame label="06 — Sign up · Step 1/3">
      <SignupStepHeader step={1} title="Бүртгүүлэх" nextLabel="ДАН холболт"/>
      <div style={{ flex: 1, overflow:'auto', padding: '16px 24px 24px' }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.ink, letterSpacing:'-0.02em', lineHeight: 1.15 }}>
          Утасны дугаар,<br/>нууц үг үүсгэх
        </div>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 8, lineHeight: 1.5 }}>
          Бид таны утсан дээр баталгаажуулах код илгээнэ.
        </div>

        {/* Phone */}
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 8 }}>Утасны дугаар</div>
          <div style={{
            height: 52, borderRadius: 14, background:'#fff',
            border:`1.5px solid ${C.indigo}`, boxShadow:`0 0 0 4px ${C.indigoSoft}`,
            display:'flex', alignItems:'center', padding:'0 16px', gap: 10,
          }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.ink, paddingRight: 10, borderRight:`1px solid ${C.line}`, fontVariantNumeric:'tabular-nums' }}>+976</span>
            <span style={{ fontSize: 15, fontWeight: 600, color: C.ink, fontVariantNumeric:'tabular-nums', letterSpacing:'0.04em' }}>9552 2981</span>
            <span style={{ marginLeft: 'auto', display:'inline-flex', alignItems:'center', gap: 4, color: C.green, fontSize: 11, fontWeight: 700 }}>
              <Dot color={C.green}/>Зөв
            </span>
          </div>
        </div>

        {/* OTP */}
        <div style={{ marginTop: 20 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Баталгаажуулах код</div>
            <span style={{ fontSize: 11, fontWeight: 700, color: C.indigo, fontVariantNumeric:'tabular-nums' }}>00:42 · Дахин илгээх</span>
          </div>
          <div style={{ display:'flex', gap: 8 }}>
            {otp.map((d, i) => {
              const next = otp.findIndex(x => !x);
              return (
                <div key={i} style={{
                  flex: 1, height: 52, borderRadius: 12,
                  background: '#fff',
                  border: `1.5px solid ${d ? C.indigo : (i === next ? C.indigo : C.line)}`,
                  boxShadow: (!d && i === next) ? `0 0 0 3px ${C.indigoSoft}` : 'none',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize: 20, fontWeight: 700, color: C.ink, fontVariantNumeric:'tabular-nums',
                }}>{d}</div>
              );
            })}
          </div>
        </div>

        {/* Password */}
        <div style={{ marginTop: 20, display:'flex', flexDirection:'column', gap: 14 }}>
          <div>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 8 }}>Нууц үг</div>
            <div style={{
              height: 52, borderRadius: 14, background:'#FAFBFE', border:`1.5px solid ${C.line}`,
              display:'flex', alignItems:'center', padding:'0 16px', gap: 10,
            }}>
              <span style={{ fontSize: 18, color: C.ink, fontWeight: 700, letterSpacing:'0.1em' }}>••••••••</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginLeft:'auto' }}>
                <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" stroke={C.muted} strokeWidth="2" fill="none"/>
                <circle cx="12" cy="12" r="3" stroke={C.muted} strokeWidth="2" fill="none"/>
              </svg>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 8 }}>Нууц үг давтах</div>
            <div style={{
              height: 52, borderRadius: 14, background:'#FAFBFE', border:`1.5px solid ${C.line}`,
              display:'flex', alignItems:'center', padding:'0 16px',
            }}>
              <span style={{ color: C.muted2, fontSize: 15, fontWeight: 500 }}>••••••••</span>
            </div>
          </div>
          {/* requirements */}
          <div style={{ display:'flex', flexWrap:'wrap', gap: 6 }}>
            {[
              { l:'8+ тэмдэгт', ok: true },
              { l:'1 том үсэг',  ok: true },
              { l:'1 тоо',       ok: true },
              { l:'1 тэмдэгт',   ok: false },
            ].map((r, i) => (
              <span key={i} style={{
                display:'inline-flex', alignItems:'center', gap: 4,
                padding:'4px 8px', borderRadius: 8,
                background: r.ok ? C.greenSoft : '#F4F5F9',
                color: r.ok ? C.green : C.muted, fontSize: 10, fontWeight: 700,
              }}>
                {r.ok ? '✓' : '○'} {r.l}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding:'12px 24px 6px', background:'#fff', borderTop:`1px solid ${C.line2}`, flexShrink: 0 }}>
        <PillBtn primary full>Үргэлжлүүлэх</PillBtn>
      </div>
    </Frame>
  );
};

// ============================================================
// 07 — SIGN UP · Step 2 / 3 — DAN connect
// ============================================================
const DanLogo = ({ size = 56 }) => (
  // Simplified DAN brand mark — blue gradient text
  <svg width={size*2.4} height={size} viewBox="0 0 144 60" fill="none">
    <defs>
      <linearGradient id="dang" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor="#5BA9F5"/>
        <stop offset="100%" stopColor="#1F3A8A"/>
      </linearGradient>
    </defs>
    <text x="0" y="48" fontFamily="Manrope, sans-serif" fontWeight="800" fontSize="52" fill="url(#dang)" letterSpacing="-2">DAN</text>
    {/* small chevron accent on the A */}
    <path d="M58 38 L66 26 L74 38" stroke="url(#dang)" strokeWidth="3" fill="none" strokeLinecap="round"/>
  </svg>
);

const SignupStep2 = () => (
  <Frame label="07 — Sign up · Step 2/3 · DAN">
    <SignupStepHeader step={2} title="Танин баталгаажуулалт" nextLabel="Нэмэлт мэдээлэл"/>

    <div style={{ flex: 1, overflow:'auto', padding: '20px 24px 24px' }}>
      {/* DAN brand panel */}
      <div style={{
        borderRadius: 22, padding: '32px 24px',
        background: 'linear-gradient(160deg, #EAF3FF 0%, #F4F8FF 60%, #FFFFFF 100%)',
        border:`1px solid #DCE9FB`, textAlign:'center', position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute', inset:0, opacity:.5,
          background:'radial-gradient(circle at 50% 0%, rgba(31,58,138,.15), transparent 60%)'}}/>
        <div style={{ position:'relative', display:'flex', flexDirection:'column', alignItems:'center', gap: 16 }}>
          <DanLogo size={44}/>
        </div>
      </div>

      <div style={{ fontSize: 22, fontWeight: 800, color: C.ink, marginTop: 24, letterSpacing:'-0.02em', lineHeight: 1.2 }}>
        Танин баталгаажуулалт
      </div>
      <div style={{ fontSize: 13, color: C.text, marginTop: 12, lineHeight: 1.6 }}>
        <strong style={{ color: C.ink }}>1.</strong> Танин баталгаажуулалтыг ДАН системээр гүйцэтгэх явцад системийн ачааллаас шалтгаалан алдаа гарсан тохиолдолд ХУР системийг ашиглан танин баталгаажуулалтыг үргэлжлүүлэн хийнэ.
      </div>

      {/* info pills */}
      <div style={{ marginTop: 16, background:'#fff', borderRadius: 14, border:`1px solid ${C.line2}`, overflow:'hidden' }}>
        {[
          { ic:'🔒', t:'Аюулгүй холболт', s:'ДАН протоколоор хамгаалсан' },
          { ic:'⚡', t:'Хурдан', s:'Дунджаар 30 секунд' },
          { ic:'📋', t:'Шилжих мэдээлэл', s:'Нэр, төрсөн огноо, иргэний дугаар' },
        ].map((r, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap: 12, padding:'12px 14px', borderTop: i?`1px solid ${C.line2}`:'none' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background:'#EAF3FF',
              display:'flex', alignItems:'center', justifyContent:'center', fontSize: 16,
            }}>{r.ic}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{r.t}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{r.s}</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div style={{ padding:'12px 24px 6px', background:'#fff', borderTop:`1px solid ${C.line2}`, flexShrink: 0 }}>
      <button style={{
        width:'100%', height: 52, borderRadius: 999,
        background: C.ink, color:'#fff', border:'none', fontWeight: 700, fontSize: 15, cursor:'pointer',
        display:'flex', alignItems:'center', justifyContent:'center', gap: 10,
      }}>
        Зөвшөөрөх
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>
  </Frame>
);

// ============================================================
// 08 — SIGN UP · Step 3 / 3 — Additional Info
// ============================================================
const SignupStep3 = () => {
  const [pep, setPep] = useState(false); // false = no
  return (
    <Frame label="08 — Sign up · Step 3/3 · Info">
      <SignupStepHeader step={3} title="Нэмэлт мэдээлэл" nextLabel="Дуусгах"/>

      <div style={{ flex: 1, overflow:'auto', padding: '20px 24px 24px' }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.ink, letterSpacing:'-0.02em', lineHeight: 1.15 }}>
          Нэмэлт мэдээлэл
        </div>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 8, lineHeight: 1.5 }}>
          Хууль ёсны шаардлагын дагуу зайлшгүй цуглуулах мэдээлэл.
        </div>

        <div style={{ marginTop: 22, display:'flex', flexDirection:'column', gap: 18 }}>

          {/* Text input */}
          <div>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 8 }}>Гэрийн хаяг</div>
            <div style={{
              height: 52, borderRadius: 14, background:'#fff',
              border:`1.5px solid ${C.indigo}`, boxShadow:`0 0 0 4px ${C.indigoSoft}`,
              padding:'0 16px', display:'flex', alignItems:'center',
              color: C.ink, fontSize: 14, fontWeight: 500,
            }}>УБ, Сүхбаатар дүүрэг, 1-р хороо</div>
          </div>

          {/* Dropdown */}
          <div>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 8 }}>Ажлын чиглэл</div>
            <div style={{
              height: 52, borderRadius: 14, background:'#FAFBFE',
              border:`1.5px solid ${C.line}`, padding:'0 16px',
              display:'flex', alignItems:'center', justifyContent:'space-between',
              color: C.ink, fontSize: 14, fontWeight: 500,
            }}>
              <span>Мэдээллийн технологи</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke={C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>

          {/* File upload */}
          <div>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 8 }}>Орлогын тодорхойлолт</div>
            <div style={{
              borderRadius: 14, background:'#FAFBFE',
              border:`1.5px dashed ${C.indigo}`, padding: '18px 16px',
              display:'flex', alignItems:'center', gap: 14,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: C.indigoSoft, color: C.indigo,
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 16V4M7 9l5-5 5 5M5 20h14" stroke={C.indigo} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>Файл байршуулах</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>PDF, JPG, PNG · 10MB хүртэл</div>
              </div>
              <button style={{
                height: 32, padding:'0 12px', borderRadius: 10,
                background: C.indigo, color:'#fff', border:'none', fontSize: 12, fontWeight: 700, cursor:'pointer',
              }}>Сонгох</button>
            </div>
            {/* uploaded file pill */}
            <div style={{
              marginTop: 8, display:'flex', alignItems:'center', gap: 10,
              padding: '10px 12px', borderRadius: 12, background:'#fff', border:`1px solid ${C.line2}`,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, background: C.greenSoft, color: C.green,
                display:'flex', alignItems:'center', justifyContent:'center', fontSize: 13, fontWeight: 800,
              }}>✓</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>orlogo_2025.pdf</div>
                <div style={{ fontSize: 10, color: C.muted, marginTop: 1 }}>342 KB · Амжилттай</div>
              </div>
              <button style={{ background:'transparent', border:'none', color: C.muted, cursor:'pointer', padding: 4 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6l-12 12" stroke={C.muted} strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>
          </div>

          {/* Yes / No segmented question */}
          <div>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 8 }}>
              Та улс төрд нөлөө бүхий этгээд (PEP) мөн үү?
            </div>
            <div style={{ display:'flex', gap: 8 }}>
              {[
                { l:'Тийм', v: true,  c: C.ink },
                { l:'Үгүй', v: false, c: C.ink },
              ].map((o, i) => {
                const sel = pep === o.v;
                return (
                  <div key={i} onClick={()=>setPep(o.v)} style={{
                    flex: 1, height: 52, borderRadius: 14,
                    background: sel ? '#fff' : '#FAFBFE',
                    border:`1.5px solid ${sel ? C.indigo : C.line}`,
                    boxShadow: sel ? `0 0 0 3px ${C.indigoSoft}` : 'none',
                    display:'flex', alignItems:'center', justifyContent:'center', gap: 8,
                    fontWeight: 700, fontSize: 14, color: sel ? C.indigo : C.ink,
                    cursor:'pointer', transition:'all .15s',
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: 999, border:`2px solid ${sel ? C.indigo : C.line}`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                    }}>
                      {sel && <div style={{ width: 8, height: 8, borderRadius: 999, background: C.indigo }}/>}
                    </div>
                    {o.l}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Source of funds — checklist style */}
          <div>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 8 }}>
              Хөрөнгийн эх үүсвэр (олон сонголттой)
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap: 8 }}>
              {[
                { l:'Цалин', sel: true },
                { l:'Бизнес орлого', sel: true },
                { l:'Хадгаламж', sel: false },
                { l:'Бэлэг / Өв', sel: false },
                { l:'Бусад', sel: false },
              ].map((c, i) => (
                <div key={i} style={{
                  padding:'8px 12px', borderRadius: 999,
                  background: c.sel ? C.indigo : '#fff',
                  color: c.sel ? '#fff' : C.text,
                  border: `1px solid ${c.sel ? C.indigo : C.line}`,
                  fontSize: 12, fontWeight: 700, cursor:'pointer',
                  display:'inline-flex', alignItems:'center', gap: 6,
                }}>
                  {c.sel && <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  {c.l}
                </div>
              ))}
            </div>
          </div>

          {/* Consent */}
          <div style={{ display:'flex', gap: 10, alignItems:'flex-start' }}>
            <div style={{
              width: 20, height: 20, borderRadius: 6, background: C.indigo, flexShrink:0,
              display:'flex', alignItems:'center', justifyContent:'center', marginTop: 1,
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>
              Дээрх мэдээлэл үнэн зөв болохыг баталж, нөхцөлтэй танилцсан.
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding:'12px 24px 6px', background:'#fff', borderTop:`1px solid ${C.line2}`, flexShrink: 0 }}>
        <PillBtn primary full>Бүртгэлээ дуусгах</PillBtn>
      </div>
    </Frame>
  );
};

// Keep SignUp as alias to step 1 for back-compat
const SignUp = SignupStep1;

// ============================================================
// 06 — OTP
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
const Login = () => {
  const [bio, setBio] = useState(true);
  return (
    <Frame label="02 — Login / Register">
      <BackBar title=""/>
      <div style={{ flex: 1, padding: '0 24px', display:'flex', flexDirection:'column' }}>
        <div style={{ marginTop: 8 }}>
          <LogoMark size={32}/>
          <div style={{ fontSize: 28, fontWeight: 800, color: C.ink, marginTop: 18, letterSpacing:'-0.02em', lineHeight:1.1 }}>
            Тавтай морил
          </div>
          <div style={{ fontSize: 14, color: C.muted, marginTop: 10, lineHeight:1.5 }}>
            Дансандаа нэвтэрч арилжаагаа үргэлжлүүлээрэй.
          </div>
        </div>

        <div style={{ marginTop: 28, display:'flex', flexDirection:'column', gap: 16 }}>
          {/* Phone */}
          <div>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 8 }}>Утасны дугаар</div>
            <div style={{
              height: 52, borderRadius: 14, background:'#fff',
              border:`1.5px solid ${C.line}`,
              display:'flex', alignItems:'center', padding:'0 16px', gap: 10,
            }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.ink, paddingRight: 10, borderRight:`1px solid ${C.line}`, fontVariantNumeric:'tabular-nums' }}>+976</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: C.ink, fontVariantNumeric:'tabular-nums', letterSpacing:'0.04em' }}>9552 2981</span>
            </div>
          </div>
          {/* Password */}
          <div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Нууц үг</div>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.indigo }}>Нууц үг мартсан?</span>
            </div>
            <div style={{
              height: 52, borderRadius: 14, background:'#fff',
              border:`1.5px solid ${C.indigo}`, boxShadow:`0 0 0 4px ${C.indigoSoft}`,
              padding:'0 16px', display:'flex', alignItems:'center',
            }}>
              <span style={{ fontSize: 18, color: C.ink, fontWeight: 700, letterSpacing:'0.1em' }}>••••••••</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginLeft:'auto' }}>
                <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" stroke={C.muted} strokeWidth="2" fill="none"/>
                <circle cx="12" cy="12" r="3" stroke={C.muted} strokeWidth="2" fill="none"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Biometric toggle row */}
        <div style={{
          marginTop: 18, padding:'14px 16px', borderRadius: 14,
          background:'#fff', border:`1px solid ${C.line2}`,
          display:'flex', alignItems:'center', gap: 12,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, background: C.indigoSoft,
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            {/* Face ID style icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M4 7V5a1 1 0 011-1h2M20 7V5a1 1 0 00-1-1h-2M4 17v2a1 1 0 001 1h2M20 17v2a1 1 0 01-1 1h-2" stroke={C.indigo} strokeWidth="2" strokeLinecap="round"/>
              <path d="M9 10v2M15 10v2M9 16s1.2 1 3 1 3-1 3-1M12 9v4l-1 1" stroke={C.indigo} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>Биометр нэвтрэлт</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Face ID / Хурууны хээгээр нэвтрэх</div>
          </div>
          {/* iOS-style toggle */}
          <div onClick={()=>setBio(b=>!b)} style={{
            width: 50, height: 30, borderRadius: 999, padding: 3,
            background: bio ? C.indigo : '#D7DAE5',
            transition:'background .2s', cursor:'pointer', position:'relative',
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: 999, background:'#fff',
              boxShadow:'0 2px 6px rgba(0,0,0,.2)',
              transform: bio ? 'translateX(20px)' : 'translateX(0)',
              transition:'transform .2s',
            }}/>
          </div>
        </div>

        <div style={{ flex: 1 }}/>

        <div style={{ paddingBottom: 16 }}>
          <div style={{ display:'flex', gap: 10 }}>
            <PillBtn primary full>Нэвтрэх</PillBtn>
            {bio && (
              <button style={{
                width: 52, height: 52, borderRadius: 14, background: C.ink, border:'none',
                display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
              }} aria-label="Face ID">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M4 7V5a1 1 0 011-1h2M20 7V5a1 1 0 00-1-1h-2M4 17v2a1 1 0 001 1h2M20 17v2a1 1 0 01-1 1h-2" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M9 10v2M15 10v2M9 16s1.2 1 3 1 3-1 3-1M12 9v4l-1 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </button>
            )}
          </div>
          <div style={{ textAlign:'center', marginTop: 16, fontSize: 14, color: C.muted }}>
            Шинэ хэрэглэгч үү? <span style={{ color: C.indigo, fontWeight: 700 }}>Бүртгүүлэх</span>
          </div>
        </div>
      </div>
    </Frame>
  );
};

// ============================================================
// BOTTOM TAB BAR (shared)
// ============================================================
const tabIcons = {
  home: (a) => <path d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-4v-6h-6v6H5a1 1 0 01-1-1v-9z" stroke={a?C.indigo:C.muted2} strokeWidth="2" strokeLinejoin="round" fill={a?C.indigoSoft:'none'}/>,
  trade:(a) => <g stroke={a?C.indigo:C.muted2} strokeWidth="2" strokeLinecap="round" fill="none">
    <path d="M4 17l4-4 3 3 5-7 4 6"/><circle cx="4" cy="17" r="1.5" fill={a?C.indigo:'none'}/><circle cx="20" cy="15" r="1.5" fill={a?C.indigo:'none'}/></g>,
  loan: (a) => <g stroke={a?C.indigo:C.muted2} strokeWidth="2" strokeLinecap="round" fill="none"><rect x="3" y="7" width="18" height="12" rx="2" fill={a?C.indigoSoft:'none'}/><path d="M3 11h18"/><circle cx="8" cy="15" r="1.2" fill={a?C.indigo:C.muted2} stroke="none"/><path d="M13 15h4"/></g>,
  wallet:(a) => <g><rect x="3" y="6" width="18" height="13" rx="2.5" stroke={a?C.indigo:C.muted2} strokeWidth="2" fill={a?C.indigoSoft:'none'}/><path d="M16 12.5h2" stroke={a?C.indigo:C.muted2} strokeWidth="2" strokeLinecap="round"/></g>,
  news: (a) => <g stroke={a?C.indigo:C.muted2} strokeWidth="2" fill={a?C.indigoSoft:'none'}><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 13h8M8 17h5" strokeLinecap="round"/></g>,
};

const BottomTabs = ({ active, onNav }) => {
  const tabs = [
    { id: 'home',   label: 'Нүүр',    target: 'home' },
    { id: 'trade',  label: 'Арилжаа', target: 'trade' },
    { id: 'loan',   label: 'Зээл',    target: 'loan' },
    { id: 'wallet', label: 'Хэтэвч',  target: 'wallet' },
    { id: 'news',   label: 'Мэдээ',   target: 'news' },
  ];
  return (
    <div style={{
      height: 80, background: '#fff', borderTop: `1px solid ${C.line2}`,
      display:'flex', alignItems:'flex-start', paddingTop: 10, flexShrink: 0,
    }}>
      {tabs.map(t => {
        const a = active === t.id;
        return (
          <div key={t.id} onClick={() => onNav && onNav(t.target)} style={{
            flex: 1, display:'flex', flexDirection:'column', alignItems:'center', gap: 4,
            cursor:'pointer',
          }}>
            <div style={{
              width: 44, height: 28, borderRadius: 14,
              background: a ? C.indigoSoft : 'transparent',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">{tabIcons[t.id](a)}</svg>
            </div>
            <div style={{
              fontSize: 11, fontWeight: a ? 700 : 600,
              color: a ? C.indigo : C.muted2, letterSpacing:'-0.005em',
            }}>{t.label}</div>
          </div>
        );
      })}
    </div>
  );
};

// ============================================================
// 08 — HOME / DASHBOARD
// ============================================================
const Home = ({ activeTab='home', onNav, loanState='active', label='10 — Home / Dashboard', signMethod='gsign', showLockSheet=false, portfolio='filled' }) => {
  const [lockSheet, setLockSheet] = useState(showLockSheet);
  const news = [
    { d: '2026-04-10', t: 'Арилжааны бичгийн анхдагч арилжаа зарлагдсан', tag: 'Арилжааны бичиг' },
    { d: '2026-04-08', t: 'Хөтөлномгон ББСБ ХХК анхдагч арилжаагаа зарлалаа', tag: 'Итгэлцэл' },
  ];
  const products = [
    { t: 'Хадгаламжийн сертификат', n: '12 нээлттэй', y: '11.8 – 14.5%', c1: '#2D6BFF', c2: '#4F46E5' },
    { t: 'Итгэлцэл',                n: '8 нээлттэй',  y: '19.5 – 23.0%', c1: '#4F46E5', c2: '#7C3AED', trust: true },
    { t: 'Нэхэмжлэх',               n: '5 нээлттэй',  y: '17.0 – 21.0%', c1: '#0E9F6E', c2: '#0891B2' },
    { t: 'Арилжааны бичиг',         n: '2 нээлттэй',  y: '6.5 – 8.0%',   c1: '#FF6B2C', c2: '#DC2626' },
  ];
  return (
    <Frame label={label}>
      {/* top */}
      <div style={{ padding: '8px 24px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
          <LogoMark size={28}/>
          <div>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>Сайн байна уу,</div>
            <div style={{ fontSize: 15, color: C.ink, fontWeight: 700, letterSpacing:'-0.01em' }}>Тэмүүжин</div>
          </div>
        </div>
        <div style={{ display:'flex', gap: 8 }}>
          <button style={{
            width: 40, height: 40, borderRadius: 12, background:'#fff', border:`1px solid ${C.line}`,
            display:'flex', alignItems:'center', justifyContent:'center', position:'relative',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9z" stroke={C.ink} strokeWidth="2" strokeLinejoin="round" fill="none"/><path d="M10 21a2 2 0 004 0" stroke={C.ink} strokeWidth="2" strokeLinecap="round"/></svg>
            <span style={{ position:'absolute', top: 8, right: 9, width: 8, height: 8, borderRadius: 999, background: C.orange, border: '2px solid #fff' }}/>
          </button>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: `linear-gradient(135deg, ${C.indigo}, ${C.blue})`,
            display:'flex', alignItems:'center', justifyContent:'center',
            color:'#fff', fontWeight: 800, fontSize: 14,
          }}>T</div>
        </div>
      </div>

      <div style={{ flex: 1, overflow:'auto', padding: '0 24px 16px' }}>
        {/* Portfolio hero card — Миний багц */}
        {portfolio === 'empty' ? (
          <div style={{
            borderRadius: 24, padding: 22, color:'#fff',
            background: `linear-gradient(135deg, ${C.navy} 0%, ${C.indigo} 130%)`,
            position:'relative', overflow:'hidden',
          }}>
            <div style={{ position:'absolute', right:-40, top:-40, width: 180, height: 180, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,107,44,.4), transparent 70%)' }}/>
            <div style={{ position:'relative' }}>
              <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 11, background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.18)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 8.5l9-5 9 5v7l-9 5-9-5v-7z" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinejoin="round"/><path d="M3 8.5l9 5 9-5M12 13.5V20" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div style={{ fontSize: 12, opacity: .7, fontWeight: 600 }}>Миний багц</div>
              </div>
              <div style={{ fontSize: 30, fontWeight: 800, letterSpacing:'-0.02em', fontVariantNumeric:'tabular-nums', marginTop: 12 }}>₮ 0</div>
              <div style={{ fontSize: 13, opacity: .82, marginTop: 8, lineHeight: 1.5, maxWidth: 270 }}>
                Итгэлцэл эсвэл сертификат авч багцаа үүсгээрэй.
              </div>
              <div style={{ display:'flex', gap: 10, marginTop: 18 }}>
                <button onClick={() => onNav && onNav('trading')} style={{
                  flex: 1.45, height: 48, borderRadius: 14, background:'#fff', color: C.ink, border:'none',
                  fontWeight: 800, fontSize: 14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap: 8,
                  boxShadow:'0 10px 24px -10px rgba(0,0,0,.5)',
                }}>
                  Багцаа үүсгэх
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke={C.ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <button onClick={() => onNav && onNav('wallet')} style={{
                  flex: 1, height: 48, borderRadius: 14, background:'rgba(255,255,255,.1)', color:'#fff',
                  border:'1px solid rgba(255,255,255,.28)', fontWeight: 700, fontSize: 14, cursor:'pointer',
                }}>
                  Мөнгө нэмэх
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            borderRadius: 24, padding: 22, color:'#fff', cursor:'pointer',
            background: `linear-gradient(135deg, ${C.navy} 0%, ${C.indigo} 130%)`,
            position:'relative', overflow:'hidden',
          }}>
            <div style={{ position:'absolute', right:-40, top:-40, width: 180, height: 180, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,107,44,.4), transparent 70%)' }}/>
            <div style={{ position:'relative' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ fontSize: 12, opacity: .7, fontWeight: 600 }}>Миний багц</div>
                <span style={{ display:'inline-flex', alignItems:'center', gap: 3, fontSize: 12, fontWeight: 700, opacity:.85 }}>
                  Дэлгэрэнгүй
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </div>
              <div style={{ fontSize: 30, fontWeight: 800, letterSpacing:'-0.02em', fontVariantNumeric:'tabular-nums', marginTop: 4 }}>
                ₮ 48,250,000
              </div>

              {/* allocation breakdown */}
              <div style={{ fontSize: 11, opacity:.6, fontWeight:600, marginTop: 18 }}>Багцын бүтэц</div>
              <div style={{ display:'flex', gap: 3, marginTop: 8, height: 10, borderRadius: 999, overflow:'hidden' }}>
                <div style={{ flexBasis:'45%', background:'#8B7CFF' }}/>
                <div style={{ flexBasis:'35%', background:'#2D6BFF' }}/>
                <div style={{ flexBasis:'20%', background:'#2DD4BF' }}/>
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'8px 16px', marginTop: 12 }}>
                {[
                  { c:'#8B7CFF', l:'Итгэлцэл', p:'45%' },
                  { c:'#2D6BFF', l:'Сертификат', p:'35%' },
                  { c:'#2DD4BF', l:'Мөнгө хөрөнгө', p:'20%' },
                ].map((x,i)=>(
                  <div key={i} style={{ display:'flex', alignItems:'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 999, background: x.c }}/>
                    <span style={{ fontSize: 12, fontWeight: 600, opacity:.9 }}>{x.l}</span>
                    <span style={{ fontSize: 12, fontWeight: 800, fontVariantNumeric:'tabular-nums' }}>{x.p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div style={{ display:'flex', gap: 10, marginTop: 14 }}>
          <button style={{ flex:1, height: 48, borderRadius: 14, background: '#fff', border: `1px solid ${C.line}`, display:'flex', alignItems:'center', justifyContent:'center', gap: 8, fontWeight: 700, fontSize: 14, color: C.ink, cursor:'pointer' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12l7-7 7 7" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Орлого
          </button>
          <button style={{ flex:1, height: 48, borderRadius: 14, background: '#fff', border: `1px solid ${C.line}`, display:'flex', alignItems:'center', justifyContent:'center', gap: 8, fontWeight: 700, fontSize: 14, color: C.ink, cursor:'pointer' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 19V5M5 12l7 7 7-7" stroke={C.indigo} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Зарлага
          </button>
        </div>

        {/* Loan section */}
        <div style={{ marginTop: 24, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.ink, letterSpacing:'-0.01em' }}>Зээл</div>
          {loanState === 'active' && (
            <span style={{ fontSize: 12, color: C.indigo, fontWeight: 700 }} onClick={() => onNav && onNav('loan')}>Дэлгэрэнгүй →</span>
          )}
        </div>

        {loanState === 'coming-soon' ? (
          <div style={{
            marginTop: 12, borderRadius: 22, padding: 22, position:'relative', overflow:'hidden',
            background: `linear-gradient(140deg, #FFFFFF 0%, #F4F1FF 60%, #EEF0FE 100%)`,
            border:`1px solid ${C.line2}`,
          }}>
            {/* decorative orbs */}
            <div style={{ position:'absolute', right:-30, top:-30, width: 140, height: 140, borderRadius:'50%', background:'radial-gradient(circle, rgba(79,70,229,.2), transparent 70%)'}}/>
            <div style={{ position:'absolute', right: 30, bottom: -20, width: 80, height: 80, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,107,44,.25), transparent 70%)'}}/>

            <div style={{ position:'relative' }}>
              <div style={{
                display:'inline-flex', alignItems:'center', gap: 6,
                padding:'5px 10px', borderRadius: 999,
                background:'#fff', border:`1px solid ${C.line}`,
                fontSize: 10, fontWeight: 700, color: C.indigo, letterSpacing:'0.06em', textTransform:'uppercase',
              }}>
                <Dot color={C.indigo}/>Тун удахгүй
              </div>
              <div style={{
                fontSize: 22, fontWeight: 800, color: C.ink, marginTop: 14,
                letterSpacing:'-0.02em', lineHeight: 1.2, textWrap:'pretty',
              }}>
                Зээлийн бүтээгдэхүүн<br/>тун удахгүй
              </div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 8, lineHeight: 1.5, maxWidth: 280 }}>
                30 хоногийн богино хугацааны зээлийг тун удахгүй танд хүргэнэ.
              </div>

              {/* Product terms preview */}
              <div style={{ marginTop: 16, display:'flex', gap: 8 }}>
                {[
                  { l:'Хүү', v:'2.5%' },
                  { l:'Хугацаа', v:'30 хоног' },
                  { l:'Дүн', v:'Чөлөөт' },
                ].map((p, i) => (
                  <div key={i} style={{
                    flex: 1, background:'#fff', borderRadius: 12, padding:'10px 12px', border:`1px solid ${C.line}`,
                  }}>
                    <div style={{ fontSize: 10, color: C.muted, fontWeight: 600 }}>{p.l}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: C.ink, marginTop: 3, fontVariantNumeric:'tabular-nums', letterSpacing:'-0.01em' }}>{p.v}</div>
                  </div>
                ))}
              </div>

              <button style={{
                marginTop: 16, height: 42, padding:'0 18px', borderRadius: 12,
                background: C.ink, color:'#fff', border:'none', fontWeight: 700, fontSize: 13, cursor:'pointer',
                display:'inline-flex', alignItems:'center', gap: 8,
              }}>
                Мэдэгдэл авах
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9z" stroke="#fff" strokeWidth="2" strokeLinejoin="round" fill="none"/><path d="M10 21a2 2 0 004 0" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>
          </div>
        ) : loanState === 'check-eligibility' ? (
          <div style={{
            marginTop: 12, borderRadius: 22, padding: 22, position:'relative', overflow:'hidden',
            background: `linear-gradient(140deg, ${C.navy} 0%, ${C.navy3} 55%, ${C.indigo} 135%)`,
            color:'#fff',
          }}>
            {/* decorative orbs */}
            <div style={{ position:'absolute', right:-40, top:-50, width: 180, height: 180, borderRadius:'50%', background:'radial-gradient(circle, rgba(45,107,255,.45), transparent 70%)'}}/>
            <div style={{ position:'absolute', right: 40, bottom:-40, width: 110, height: 110, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,107,44,.4), transparent 70%)'}}/>

            <div style={{ position:'relative' }}>
              <div style={{
                display:'inline-flex', alignItems:'center', gap: 6,
                padding:'5px 10px', borderRadius: 999,
                background:'rgba(255,255,255,.12)', border:'1px solid rgba(255,255,255,.18)',
                fontSize: 10, fontWeight: 700, color:'#fff', letterSpacing:'0.08em', textTransform:'uppercase',
              }}>
                <Dot color={C.orange}/>Шинэ боломж
              </div>
              <div style={{
                fontSize: 23, fontWeight: 800, marginTop: 14,
                letterSpacing:'-0.02em', lineHeight: 1.18, textWrap:'pretty',
              }}>
                Богино хугацааны<br/>зээл хэрэгтэй юу?
              </div>
              <div style={{ fontSize: 12, color:'rgba(255,255,255,.75)', marginTop: 8, lineHeight: 1.5, maxWidth: 290 }}>
                30 хоногийн богино хугацааны зээлийн хүсэлтээ хэдхэн товшилтоор илгээгээрэй.
              </div>

              {/* value props (no partner pills) */}
              <div style={{ display:'flex', gap: 18, marginTop: 18 }}>
                {[
                  { v:'30 хоног', l:'Хугацаа' },
                  { v:'Чөлөөт', l:'Дүн' },
                  { v:'2.5%', l:'Хүү' },
                ].map((x, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 16, fontWeight: 800, letterSpacing:'-0.01em', fontVariantNumeric:'tabular-nums' }}>{x.v}</div>
                    <div style={{ fontSize: 10, color:'rgba(255,255,255,.6)', marginTop: 2, fontWeight: 600 }}>{x.l}</div>
                  </div>
                ))}
              </div>

              <button onClick={() => onNav && onNav('loan')} style={{
                width:'100%', marginTop: 20, height: 48, borderRadius: 14,
                background:'#fff', color: C.ink, border:'none', fontWeight: 800, fontSize: 14, cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center', gap: 8,
                boxShadow:'0 10px 24px -10px rgba(0,0,0,.5)',
              }}>
                Зээлийн хүсэлт явуулах
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke={C.ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <div style={{ fontSize: 10, color:'rgba(255,255,255,.55)', marginTop: 10, textAlign:'center' }}>
                ЗМС лавлагааны төлбөр ₮4,000 · Эргэн төлөлт нэг удаа бүтэн.
              </div>
            </div>
          </div>
        ) : loanState === 'request-pending' ? (
          <div style={{ marginTop: 12, background:'#fff', borderRadius: 18, border:`1px solid ${C.line2}`, overflow:'hidden' }}>
            <div style={{ padding: 16 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: C.indigoSoft, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke={C.indigo} strokeWidth="2" fill="none"/><path d="M12 7.5V12l3 2" stroke={C.indigo} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Зээлийн хүсэлт</div>
                    <div style={{ fontSize: 11, color: C.muted2, fontVariantNumeric:'tabular-nums' }}>LR-2026-06-08</div>
                  </div>
                </div>
                <Badge tone="info">Хянагдаж байна</Badge>
              </div>

              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 10, color: C.muted, fontWeight: 600 }}>Хүссэн дүн</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: C.ink, fontVariantNumeric:'tabular-nums', letterSpacing:'-0.02em', marginTop: 2 }}>₮ 3,000,000</div>
              </div>

              <div style={{ marginTop: 14 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize: 10, color: C.muted, marginBottom: 6, fontWeight: 600 }}>
                  <span>Хянаж байна</span><span>30 хоног · 2.5%</span>
                </div>
                <div style={{ height: 6, borderRadius: 999, background:'#F0F2F8', overflow:'hidden' }}>
                  <div style={{ width:'55%', height:'100%', borderRadius: 999, background:`linear-gradient(90deg, ${C.indigo}, ${C.blue})` }}/>
                </div>
              </div>
            </div>
            <div style={{ borderTop:`1px solid ${C.line2}`, padding:'12px 16px', display:'flex', alignItems:'flex-start', gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="9" stroke={C.muted2} strokeWidth="2"/><path d="M12 11v5M12 8h.01" stroke={C.muted2} strokeWidth="2" strokeLinecap="round"/></svg>
              <span style={{ fontSize: 11.5, color: C.muted, fontWeight: 600, lineHeight: 1.5 }}>Хүсэлтийн хариуг удахгүй мэдэгдэнэ. Мэдэгдэл хүлээнэ үү.</span>
            </div>
          </div>
        ) : loanState === 'request-result' ? (
          <div style={{ marginTop: 12, background:'#fff', borderRadius: 18, border:`1px solid ${C.line2}`, overflow:'hidden' }}>
            <div style={{ padding: 16 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: C.greenSoft, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7.5" stroke={C.green} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Зээлийн хүсэлт</div>
                    <div style={{ fontSize: 11, color: C.muted2, fontVariantNumeric:'tabular-nums' }}>LR-2026-06-08</div>
                  </div>
                </div>
                <Badge tone="new">Зөвшөөрөгдлөө</Badge>
              </div>

              <div style={{ marginTop: 14, display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
                <div>
                  <div style={{ fontSize: 10, color: C.muted, fontWeight: 600 }}>Зөвшөөрсөн дүн</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: C.ink, fontVariantNumeric:'tabular-nums', letterSpacing:'-0.02em', marginTop: 2 }}>₮ 3,000,000</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize: 10, color: C.muted, fontWeight: 600 }}>Эргэн төлөх</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginTop: 2, fontVariantNumeric:'tabular-nums' }}>2026-06-28</div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 2, fontWeight: 600 }}>Хүү 2.5%</div>
                </div>
              </div>
            </div>
            <div style={{ borderTop:`1px solid ${C.line2}`, padding: 12 }}>
              <button onClick={() => onNav && onNav('loan')} style={{
                width:'100%', height: 46, borderRadius: 12, background: C.indigo, color:'#fff', border:'none',
                fontWeight: 800, fontSize: 14, cursor:'pointer', boxShadow:'0 8px 20px -8px rgba(79,70,229,.5)',
                display:'flex', alignItems:'center', justifyContent:'center', gap: 8,
              }}>
                Зээлээ авах
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
        ) : (
        <div style={{
          marginTop: 12, background:'#fff', borderRadius: 18, border:`1px solid ${C.line2}`, overflow:'hidden',
        }}>
          <div style={{ padding: 16 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, background: C.indigoSoft,
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="18" height="12" rx="2" stroke={C.indigo} strokeWidth="2" fill="none"/><path d="M3 11h18" stroke={C.indigo} strokeWidth="2"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Идэвхтэй зээл</div>
                  <div style={{ fontSize: 11, color: C.muted2, fontVariantNumeric:'tabular-nums' }}>LN-2026-04823</div>
                </div>
              </div>
              <Badge tone="new">Хэвийн</Badge>
            </div>

            <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginTop: 14 }}>
              <div>
                <div style={{ fontSize: 10, color: C.muted, fontWeight: 600 }}>Эргэн төлөх дүн</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: C.ink, fontVariantNumeric:'tabular-nums', letterSpacing:'-0.02em', marginTop: 2 }}>₮ 3,075,000</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize: 10, color: C.muted, fontWeight: 600 }}>Эргэн төлөх огноо</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginTop: 2, fontVariantNumeric:'tabular-nums' }}>2026-06-28</div>
                <div style={{ fontSize: 10, color: C.indigo, marginTop: 2, fontWeight: 600, fontVariantNumeric:'tabular-nums' }}>24 хоног үлдлээ</div>
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize: 10, color: C.muted, marginBottom: 6, fontWeight: 600 }}>
                <span>6 / 30 хоног</span>
                <span>Нэг удаа бүтэн төлнө</span>
              </div>
              <div style={{ height: 6, borderRadius: 999, background: '#F0F2F8', overflow:'hidden' }}>
                <div style={{ width:'20%', height:'100%', borderRadius: 999, background: `linear-gradient(90deg, ${C.indigo}, ${C.blue})` }}/>
              </div>
            </div>
          </div>

          <div style={{ borderTop:`1px solid ${C.line2}`, display:'flex' }}>
            <button style={{
              flex: 1, height: 48, background:'transparent', border:'none',
              fontWeight: 700, fontSize: 13, color: C.ink, cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', gap: 8,
              borderRight: `1px solid ${C.line2}`,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Бүтэн төлөх
            </button>
            <button style={{
              flex: 1, height: 48, background:'transparent', border:'none',
              fontWeight: 700, fontSize: 13, color: C.indigo, cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', gap: 8,
            }} onClick={() => onNav && onNav('loan')}>
              Дэлгэрэнгүй
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke={C.indigo} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
        )}

        {/* Section header */}
        <div style={{ marginTop: 24, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.ink, letterSpacing:'-0.01em' }}>Бүтээгдэхүүн</div>
          <span style={{ fontSize: 12, color: C.indigo, fontWeight: 700 }}>Бүгд →</span>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10, marginTop: 12 }}>
          {products.map((p, i) => {
            const locked = signMethod === 'esign' && p.trust;
            return (
            <div key={i} onClick={locked ? () => setLockSheet(true) : undefined} style={{
              background:'#fff', borderRadius: 18, padding: 14, border: `1px solid ${locked ? C.line : C.line2}`,
              position:'relative', cursor: locked ? 'pointer' : 'default',
            }}>
              <div style={{ opacity: locked ? 0.45 : 1 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `linear-gradient(135deg, ${p.c1}, ${p.c2})`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginTop: 12, lineHeight: 1.25, letterSpacing:'-0.01em', minHeight: 32 }}>{p.t}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{p.n}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: p.c1, marginTop: 8, fontVariantNumeric:'tabular-nums' }}>{p.y}</div>
              </div>
              {locked && (
                <React.Fragment>
                  <div style={{ position:'absolute', top: 12, right: 12, width: 26, height: 26, borderRadius: 8, background: C.navy, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke="#fff" strokeWidth="2" fill="none"/><path d="M8 11V8a4 4 0 018 0v3" stroke="#fff" strokeWidth="2" fill="none"/></svg>
                  </div>
                  <div style={{ marginTop: 10, display:'inline-flex', alignItems:'center', gap: 5, padding:'4px 9px', borderRadius: 999, background: C.amberSoft, color: C.amber, fontSize: 10, fontWeight: 800 }}>
                    <Dot color={C.amber}/>G-Sign шаардлагатай
                  </div>
                </React.Fragment>
              )}
            </div>
            );
          })}
        </div>

        {/* News */}
        <div style={{ marginTop: 24, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.ink, letterSpacing:'-0.01em' }}>Мэдээ мэдээлэл</div>
          <span style={{ fontSize: 12, color: C.indigo, fontWeight: 700 }} onClick={() => onNav && onNav('news')}>Бүгд →</span>
        </div>
        <div style={{ marginTop: 12, background:'#fff', borderRadius: 18, border:`1px solid ${C.line2}`, overflow:'hidden' }}>
          {news.map((n, i) => (
            <div key={i} style={{
              padding: '14px 14px', display:'flex', gap: 12, alignItems:'center',
              borderTop: i ? `1px solid ${C.line2}` : 'none',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, background: C.indigoSoft, flexShrink:0,
                display:'flex', alignItems:'center', justifyContent:'center', color: C.indigo, fontWeight: 800, fontSize: 11,
              }}>10<br/>04</div>
              <div style={{ flex:1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, lineHeight: 1.3, overflow:'hidden', textOverflow:'ellipsis', display:'-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient:'vertical' }}>{n.t}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{n.tag}</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke={C.muted2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          ))}
        </div>

        <div style={{ height: 12 }}/>
      </div>

      <BottomTabs active={activeTab} onNav={onNav}/>

      {lockSheet && (
        <div onClick={() => setLockSheet(false)} style={{
          position:'absolute', inset:0, zIndex:50,
          display:'flex', flexDirection:'column', justifyContent:'flex-end',
          background:'rgba(5,11,31,.45)',
        }}>
          <div onClick={(e)=>e.stopPropagation()} style={{ background:'#fff', borderRadius:'28px 28px 0 0', padding:'10px 24px 36px' }}>
            <div style={{ width:40, height:5, borderRadius:999, background:C.line, margin:'0 auto 20px' }}/>
            <div style={{ width:60, height:60, borderRadius:18, background:C.navy, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke="#fff" strokeWidth="2" fill="none"/><path d="M8 11V8a4 4 0 018 0v3" stroke="#fff" strokeWidth="2" fill="none"/></svg>
            </div>
            <div style={{ fontSize:20, fontWeight:800, color:C.ink, textAlign:'center', marginTop:18, letterSpacing:'-0.01em', lineHeight:1.2 }}>G-Sign баталгаажуулалт шаардлагатай</div>
            <div style={{ fontSize:13, color:C.muted, textAlign:'center', marginTop:10, lineHeight:1.55 }}>Итгэлцлийн үйлчилгээг ашиглахын тулд мастер гэрээг G-Sign-ээр баталгаажуулах шаардлагатай.</div>
            <button style={{ width:'100%', height:52, borderRadius:14, background:C.indigo, color:'#fff', border:'none', fontWeight:700, fontSize:15, marginTop:22, cursor:'pointer', boxShadow:'0 10px 22px -8px rgba(79,70,229,.5)' }}>G-Sign ашиглах</button>
            <button style={{ width:'100%', height:48, borderRadius:14, background:'transparent', color:C.indigo, border:'none', fontWeight:700, fontSize:14, marginTop:4, cursor:'pointer' }}>G-Sign хэрхэн суулгах вэ?</button>
          </div>
        </div>
      )}
    </Frame>
  );
};

// ============================================================
// SECONDARY-MARKET SORT — shared by Trading + Category
// ============================================================
const SEC_SORTS = [
  { k:'term',  l:'Төлөгдөх хугацаа', d:'Богиноос → урт' },
  { k:'yield', l:'Өгөөж',           d:'Өндөр → бага' },
  { k:'rate',  l:'Хүү %',           d:'Өндөр → бага' },
];
const secLabel = (k) => (SEC_SORTS.find(s => s.k === k) || SEC_SORTS[1]).l;
const parseTermDays = (t) => parseInt(String(t).replace(/[^0-9]/g, ''), 10) || 0;
const sortSecondary = (arr, k) => {
  const a = [...arr];
  if (k === 'term') a.sort((x, y) => parseTermDays(x.term) - parseTermDays(y.term));
  else if (k === 'rate') a.sort((x, y) => parseFloat(y.rate) - parseFloat(x.rate));
  else a.sort((x, y) => parseFloat(y.real) - parseFloat(x.real));
  return a;
};
const SortButton = ({ label, onClick }) => (
  <button onClick={onClick} data-nodrag style={{
    display:'inline-flex', alignItems:'center', gap: 6, height: 32, padding:'0 12px', borderRadius: 10,
    background:'#fff', border:`1px solid ${C.line}`, cursor:'pointer', fontSize: 11.5, fontWeight: 700, color: C.ink, flexShrink: 0,
  }}>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M7 19V5M7 5L4 8M7 5l3 3M17 5v14M17 19l3-3M17 19l-3-3" stroke={C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    {label}
  </button>
);
const SortSheet = ({ open, value, onClose, onPick }) => {
  if (!open) return null;
  return (
    <div style={{ position:'absolute', inset:0, zIndex: 30 }}>
      <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(5,11,31,.45)' }}/>
      <div style={{ position:'absolute', left:0, right:0, bottom:0, background:'#fff', borderRadius:'24px 24px 0 0', padding:'10px 0 20px', boxShadow:'0 -10px 40px -16px rgba(15,20,55,.4)' }}>
        <div style={{ width: 40, height: 5, borderRadius: 999, background: C.line, margin:'0 auto 12px' }}/>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px 10px' }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.ink }}>Эрэмбэлэх</div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 999, background:'#F4F6FA', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke={C.muted} strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
        {SEC_SORTS.map((o) => {
          const sel = value === o.k;
          return (
            <button key={o.k} onClick={() => onPick(o.k)} style={{
              width:'100%', textAlign:'left', display:'flex', alignItems:'center', gap: 12, padding:'13px 20px',
              background: sel ? C.indigoSoft : 'transparent', border:'none', cursor:'pointer',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: sel ? C.indigo : C.ink }}>{o.l}</div>
                <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{o.d}</div>
              </div>
              <div style={{ width: 22, height: 22, borderRadius: 999, border:`2px solid ${sel ? C.indigo : C.line}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                {sel && <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke={C.indigo} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================
// 09 — TRADING / MARKETPLACE
// ============================================================
const Trading = ({ activeTab='trade', onNav }) => {
  const chips = ['Бүгд','Сертификат','Итгэлцэл','Нэхэмжлэх','Арилжааны бичиг'];
  const [active, setActive] = useState(0);
  const [secSort, setSecSort] = useState('yield');
  const [sortOpen, setSortOpen] = useState(false);

  const primary = [
    { issuer:'Капитрон Банк ХК', ticker:'CAPIT 1450', type:'Сертификат', price:'100,000', yield:'14.5', real:'15.5', term:'12 сар', avail:'1.2 тэрбум', c:C.blue, logoColor:'#1677FF' },
    { issuer:'Голден Хилл Партнерс', ticker:'GOLDH 2300', type:'Итгэлцэл', price:'1,000,000', yield:'23.0', real:'25.6', term:'12 сар', avail:'365 сая', c:'#F59E0B', logoColor:'#F59E0B' },
    { issuer:'Кредитекс СТМ ББСБ', ticker:'MSTRT 2400', type:'Итгэлцэл', price:'1,000,000', yield:'19.5', real:'21.3', term:'6 сар', avail:'785 сая', c:C.indigo, logoColor:C.indigo },
  ];
  const secondary = [
    { ticker:'CAPIT 1450 CD 240227', type:'Зарах', qty: 7, price:'100,000', term:'278 хоног', real:'15.2', rate:'14.0' },
    { ticker:'GOLDH 2300 IT 140427', type:'Зарах', qty: 180, price:'1,000,000', term:'327 хоног', real:'24.8', rate:'23.0' },
    { ticker:'MSTRT 2400 IT 171126', type:'Зарах', qty: 227, price:'1,000,000', term:'179 хоног', real:'20.6', rate:'19.5' },
  ];

  return (
    <Frame label="24 — Trading / Marketplace">
      <div style={{ padding: '6px 24px 12px', flexShrink: 0 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: C.ink, letterSpacing:'-0.02em' }}>Арилжаа</div>
          <button style={{ width: 40, height: 40, borderRadius: 12, background:'#fff', border:`1px solid ${C.line}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M7 12h10M10 18h4" stroke={C.ink} strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
        {/* search */}
        <div style={{
          marginTop: 12, height: 44, borderRadius: 14,
          background:'#fff', border:`1px solid ${C.line}`,
          display:'flex', alignItems:'center', padding: '0 14px', gap: 10,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6" stroke={C.muted} strokeWidth="2" fill="none"/><path d="M16 16l4 4" stroke={C.muted} strokeWidth="2" strokeLinecap="round"/></svg>
          <span style={{ color: C.muted2, fontSize: 14 }}>Тикер, арилжаа хайх</span>
        </div>
        {/* chips */}
        <div style={{ display:'flex', gap: 8, marginTop: 12, overflowX:'auto' }}>
          {chips.map((c, i) => (
            <div key={i} onClick={()=>setActive(i)} style={{
              padding: '8px 14px', borderRadius: 999, whiteSpace:'nowrap',
              background: active===i ? C.ink : '#fff',
              color: active===i ? '#fff' : C.text,
              border: `1px solid ${active===i ? C.ink : C.line}`,
              fontSize: 13, fontWeight: 600, cursor:'pointer', flexShrink: 0,
            }}>{c}</div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflow:'auto', padding: '0 24px 16px' }}>
        {/* Анхдагч */}
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.ink, letterSpacing:'-0.01em' }}>Анхдагч зах</div>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginTop: 2 }}>Шинэ гаргалт · гаргагчаас шууд</div>
          </div>
          <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>{primary.length} нээлттэй</span>
        </div>
        <div style={{ display:'flex', gap: 12, overflowX:'auto', marginLeft: -24, paddingLeft: 24, paddingRight: 24, marginRight: -24 }}>
          {primary.map((p, i) => (
            <div key={i} style={{
              minWidth: 260, background:'#fff', borderRadius: 20, padding: 16,
              border:`1px solid ${C.line2}`, flexShrink: 0,
              boxShadow: '0 2px 6px -2px rgba(15,20,55,.04)',
            }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: p.logoColor, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight: 800, fontSize: 13 }}>
                    {p.issuer.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, letterSpacing:'-0.01em', lineHeight:1.2 }}>{p.issuer}</div>
                    <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{p.type}</div>
                  </div>
                </div>
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

        {/* Хоёрдогч */}
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginTop: 24, marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.ink, letterSpacing:'-0.01em' }}>Хоёрдогч зах</div>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginTop: 2 }}>Бусад хэрэглэгчийн зарах санал · {secondary.length}+ санал</div>
          </div>
          <SortButton label={secLabel(secSort)} onClick={()=>setSortOpen(true)}/>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap: 10 }}>
          {sortSecondary(secondary, secSort).map((s, i) => (
            <div key={i} style={{ background:'#fff', borderRadius: 16, padding: 14, border:`1px solid ${C.line2}` }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap: 8 }}>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, fontVariantNumeric:'tabular-nums' }}>{s.ticker}</div>
                    <span style={{ fontSize: 9.5, fontWeight: 700, color: C.amber, background: C.amberSoft, padding:'2px 7px', borderRadius: 999 }}>Зарах санал</span>
                  </div>
                  <div style={{ marginTop: 6, fontSize: 11, color: C.muted, fontWeight: 600 }}>Бодит өгөөж <span style={{ color: C.indigo, fontWeight: 800, fontSize: 13, fontVariantNumeric:'tabular-nums' }}>{s.real}% /жил</span></div>
                </div>
                <button style={{
                  height: 32, padding: '0 14px', borderRadius: 10,
                  background: C.indigoSoft, color: C.indigo, fontWeight: 700, fontSize: 12, border:'none',
                }}>Авах</button>
              </div>
              <div style={{ display:'flex', gap: 16, marginTop: 12, paddingTop: 12, borderTop: `1px dashed ${C.line2}` }}>
                {[
                  { l:'Боломжит', v: s.qty+' ш' },
                  { l:'Худ. авах үнэ', v: '₮'+s.price },
                  { l:'Үлдсэн хугацаа', v: s.term },
                ].map((x, j) => (
                  <div key={j} style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: C.muted, fontWeight: 600 }}>{x.l}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginTop: 2, fontVariantNumeric:'tabular-nums' }}>{x.v}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ height: 12 }}/>
      </div>

      <SortSheet open={sortOpen} value={secSort} onClose={()=>setSortOpen(false)} onPick={(k)=>{ setSecSort(k); setSortOpen(false); }}/>
      <BottomTabs active={activeTab} onNav={onNav}/>
    </Frame>
  );
};

// ============================================================
// 10 — INSTRUMENT CATEGORY LISTING (Итгэлцэл)
// ============================================================
const Category = () => {
  const [seg, setSeg] = useState(0); // 0 primary, 1 secondary
  const [secSort, setSecSort] = useState('yield');
  const [sortOpen, setSortOpen] = useState(false);
  const primary = [
    { issuer:'Голден Хилл Партнерс ББСБ ХХК', y:'23.0', real:'25.6', t:'12 сар', p:'1,000,000', a:'365 сая', c:'#F59E0B' },
    { issuer:'Кредитекс СТМ ББСБ ХХК',         y:'19.5', real:'21.3', t:'6 сар',  p:'1,000,000', a:'785 сая', c:C.indigo },
    { issuer:'Анлок Капитал ББСБ ХХК',         y:'22.5', real:'24.9', t:'1 жил',  p:'1,000,000', a:'540 сая', c:C.blue },
  ];
  const secondary = [
    { ticker:'GOLDH 2300 IT 140427', type:'Зарах', qty: 180, price:'1,000,000', term:'327 хоног', real:'24.8', rate:'23.0' },
    { ticker:'MSTRT 2400 IT 171126', type:'Зарах', qty: 227, price:'1,000,000', term:'179 хоног', real:'20.6', rate:'19.5' },
    { ticker:'DMFIN 2250 IT 281126', type:'Зарах', qty: 30,  price:'1,000,000', term:'190 хоног', real:'22.9', rate:'21.5' },
    { ticker:'ZEELY 2100 IT 091126', type:'Зарах', qty: 50,  price:'1,000,000', term:'141 хоног', real:'21.4', rate:'20.0' },
  ];
  return (
    <Frame label="25 — Category · Итгэлцэл">
      <BackBar title="Итгэлцэл" right={
        <button style={{ width: 40, height: 40, borderRadius: 12, background:'#fff', border:`1px solid ${C.line}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6" stroke={C.ink} strokeWidth="2" fill="none"/><path d="M16 16l4 4" stroke={C.ink} strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      }/>

      {/* segmented */}
      <div style={{ padding: '8px 24px 16px', flexShrink: 0 }}>
        <div style={{ background: '#EDEFF6', borderRadius: 14, padding: 4, display:'flex' }}>
          {['Анхдагч','Хоёрдогч'].map((s, i) => (
            <div key={i} onClick={() => setSeg(i)} style={{
              flex: 1, height: 40, borderRadius: 10,
              background: seg===i ? '#fff' : 'transparent',
              boxShadow: seg===i ? '0 2px 6px -2px rgba(15,20,55,.12)' : 'none',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontWeight: seg===i ? 700 : 600, fontSize: 13, color: seg===i ? C.ink : C.muted,
              cursor:'pointer', transition:'all .2s',
            }}>{s}</div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflow:'auto', padding: '0 24px 16px' }}>
        {seg === 0 ? (
          <div style={{ display:'flex', flexDirection:'column', gap: 12 }}>
            {primary.map((p, i) => (
              <div key={i} style={{ background:'#fff', borderRadius: 20, padding: 16, border:`1px solid ${C.line2}`, boxShadow: '0 2px 6px -2px rgba(15,20,55,.04)' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: p.c, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight: 800 }}>
                      {p.issuer.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, lineHeight:1.2, letterSpacing:'-0.01em' }}>{p.issuer}</div>
                      <div style={{ fontSize: 10, color: C.muted, marginTop: 3 }}>Анхдагч арилжаа</div>
                    </div>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginTop: 14 }}>
                  <div>
                    <div style={{ fontSize: 10, color: C.muted, fontWeight: 600 }}>Үр шим</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: p.c, fontVariantNumeric:'tabular-nums', letterSpacing:'-0.02em' }}>{p.y}<span style={{fontSize:14, color: C.muted, fontWeight:600}}> %</span></div>
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 8, marginTop: 12, paddingTop: 12, borderTop: `1px dashed ${C.line2}` }}>
                  {[
                    { l:'Хугацаа', v: p.t },
                    { l:'Нэгж үнэ', v: '₮'+p.p },
                    { l:'Боломжит', v: '₮'+p.a },
                  ].map((x, j) => (
                    <div key={j}>
                      <div style={{ fontSize: 10, color: C.muted, fontWeight: 600 }}>{x.l}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginTop: 2, fontVariantNumeric:'tabular-nums' }}>{x.v}</div>
                    </div>
                  ))}
                </div>
                <button style={{
                  width:'100%', height: 44, borderRadius: 12, marginTop: 14,
                  background: C.indigo, color:'#fff', fontWeight: 700, fontSize: 14, border:'none', cursor:'pointer',
                }}>Авах</button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap: 10 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 2 }}>
              <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>{secondary.length} зарах санал</span>
              <SortButton label={secLabel(secSort)} onClick={()=>setSortOpen(true)}/>
            </div>
            {sortSecondary(secondary, secSort).map((s, i) => (
              <div key={i} style={{ background:'#fff', borderRadius: 16, padding: 14, border:`1px solid ${C.line2}` }}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, fontVariantNumeric:'tabular-nums' }}>{s.ticker}</div>
                    <div style={{ marginTop: 6, fontSize: 11, color: C.muted, fontWeight: 600 }}>Бодит өгөөж <span style={{ color: C.indigo, fontWeight: 800, fontSize: 13, fontVariantNumeric:'tabular-nums' }}>{s.real}% /жил</span></div>
                  </div>
                  <button style={{ height: 32, padding:'0 14px', borderRadius: 10, background: C.indigoSoft, color: C.indigo, fontWeight: 700, fontSize: 12, border:'none' }}>Авах</button>
                </div>
                <div style={{ display:'flex', gap: 16, marginTop: 12, paddingTop: 12, borderTop:`1px dashed ${C.line2}` }}>
                  {[
                    { l:'Ширхэг', v: s.qty },
                    { l:'Нэгж үнэ', v: '₮'+s.price },
                    { l:'Төлөгдөх', v: s.term },
                  ].map((x, j) => (
                    <div key={j} style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, color: C.muted, fontWeight: 600 }}>{x.l}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginTop: 2, fontVariantNumeric:'tabular-nums' }}>{x.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={{ height: 8 }}/>
      </div>
      <SortSheet open={sortOpen} value={secSort} onClose={()=>setSortOpen(false)} onPick={(k)=>{ setSecSort(k); setSortOpen(false); }}/>
    </Frame>
  );
};

// ============================================================
// 11 — INSTRUMENT DETAIL
// ============================================================
const Detail = () => (
  <Frame label="26 — Instrument Detail">
    <BackBar title="" right={
      <button style={{ width: 40, height: 40, borderRadius: 12, background:'#fff', border:`1px solid ${C.line}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 4h12v17l-6-4-6 4V4z" stroke={C.ink} strokeWidth="2" strokeLinejoin="round" fill="none"/></svg>
      </button>
    }/>

    <div style={{ flex: 1, overflow:'auto', padding: '0 24px 16px' }}>
      <div style={{ display:'flex', alignItems:'center', gap: 14 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: C.indigo, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight: 800, fontSize: 20 }}>К</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.ink, letterSpacing:'-0.01em', lineHeight: 1.2 }}>Кредитекс СТМ ББСБ ХХК</div>
          <div style={{ display:'flex', gap: 8, marginTop: 6 }}>
            <Badge tone="info">Итгэлцэл</Badge>
            <Badge tone="new">Шинэ</Badge>
          </div>
        </div>
      </div>

      {/* Hero card */}
      <div style={{
        marginTop: 16, borderRadius: 22, padding: 20,
        background: `linear-gradient(135deg, ${C.navy} 0%, ${C.indigo} 130%)`, color:'#fff',
        position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute', right:-30, bottom:-50, width:160, height:160, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,107,44,.4), transparent 70%)'}}/>
        <div style={{ position:'relative' }}>
          <div style={{ fontSize: 11, opacity: .7, fontWeight: 600, letterSpacing:'0.06em' }}>ҮР ШИМ</div>
          <div style={{ display:'flex', alignItems:'baseline', gap: 6, marginTop: 6 }}>
            <span style={{ fontSize: 48, fontWeight: 800, letterSpacing:'-0.03em', fontVariantNumeric:'tabular-nums' }}>19.5</span>
            <span style={{ fontSize: 18, opacity: .8 }}>% / жил</span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 10, marginTop: 18 }}>
            {[
              { l:'Нэрлэсэн үнэ', v:'₮ 1,000,000' },
              { l:'Хугацаа', v:'6 сар' },
              { l:'Боломжит', v:'₮ 785M' },
            ].map((x,i)=>(
              <div key={i}>
                <div style={{ fontSize: 9.5, opacity: .6, fontWeight: 600 }}>{x.l}</div>
                <div style={{ fontSize: 12, fontWeight: 700, marginTop: 3, fontVariantNumeric:'tabular-nums' }}>{x.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div style={{ marginTop: 16, background:'#fff', borderRadius: 18, padding: 4, border:`1px solid ${C.line2}` }}>
        {[
          ['Тикер','MSTRT 2400 IT 171126'],
          ['Нэгж үнэ','₮ 1,000,000'],
          ['Тоо ширхэг','785 ширхэг'],
          ['Төлөгдөх хүртэлх','179 хоног'],
          ['Захиалгын хүчинтэй','Нөхцөл биелтэл'],
          ['Валют','MNT'],
        ].map((r, i) => (
          <div key={i} style={{
            display:'flex', justifyContent:'space-between', padding: '13px 14px',
            borderBottom: i < 5 ? `1px solid ${C.line2}` : 'none',
          }}>
            <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>{r[0]}</span>
            <span style={{ fontSize: 13, color: C.ink, fontWeight: 700, fontVariantNumeric:'tabular-nums' }}>{r[1]}</span>
          </div>
        ))}
      </div>

      {/* Risk note */}
      <div style={{ marginTop: 14, background: '#FFFBF2', borderRadius: 14, padding: 14, border: `1px solid #FFE9C4`, display:'flex', gap: 10 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{flexShrink:0, marginTop:1}}>
          <path d="M12 8v5M12 17h.01" stroke={C.amber} strokeWidth="2.4" strokeLinecap="round"/>
          <circle cx="12" cy="12" r="9" stroke={C.amber} strokeWidth="2" fill="none"/>
        </svg>
        <div style={{ fontSize: 12, color: '#7A5A1F', lineHeight: 1.5 }}>
          Өгөөж нь зах зээлийн нөхцөл болон бүтээгдэхүүний нөхцөлөөс хамааран өөрчлөгдөж болно.
        </div>
      </div>
      <div style={{ height: 92 }}/>
    </div>

    {/* sticky CTA */}
    <div style={{
      position:'absolute', left:0, right:0, bottom: 34,
      padding: '12px 24px 16px', background:'#fff',
      borderTop:`1px solid ${C.line2}`,
      display:'flex', gap: 10,
    }}>
      <button style={{
        width: 52, height: 52, borderRadius: 14, background:'#fff', border:`1.5px solid ${C.line}`,
        display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 4h12v17l-6-4-6 4V4z" stroke={C.ink} strokeWidth="2" strokeLinejoin="round" fill="none"/></svg>
      </button>
      <button style={{
        flex: 1, height: 52, borderRadius: 14, background: C.indigo, color:'#fff',
        fontWeight: 700, fontSize: 15, border:'none', cursor:'pointer',
        boxShadow:'0 10px 22px -8px rgba(79,70,229,.5)',
      }}>Авах</button>
    </div>
  </Frame>
);

// ============================================================
// 12 — BUY / SELL ORDER
// ============================================================
const Order = () => {
  const [side, setSide] = useState(0); // 0 buy, 1 sell
  const [mode, setMode] = useState(0); // 0 percent, 1 price
  return (
    <Frame label="27 — Buy / Sell Order">
      <BackBar title="Захиалга өгөх"/>

      <div style={{ flex: 1, overflow:'auto', padding: '0 24px 12px' }}>
        {/* segmented */}
        <div style={{ background: '#EDEFF6', borderRadius: 14, padding: 4, display:'flex', marginTop: 4 }}>
          {[
            { l:'Авах', tone: C.indigo },
            { l:'Зарах', tone: C.red },
          ].map((s, i) => (
            <div key={i} onClick={()=>setSide(i)} style={{
              flex: 1, height: 40, borderRadius: 10,
              background: side===i ? '#fff' : 'transparent',
              boxShadow: side===i ? '0 2px 6px -2px rgba(15,20,55,.12)' : 'none',
              display:'flex', alignItems:'center', justifyContent:'center', gap: 8,
              fontWeight: side===i ? 700 : 600, fontSize: 14,
              color: side===i ? s.tone : C.muted,
              cursor:'pointer',
            }}>
              <Dot color={side===i ? s.tone : C.muted2}/>{s.l}
            </div>
          ))}
        </div>

        {/* Product summary */}
        <div style={{
          marginTop: 14, background:'#fff', borderRadius: 18, padding: 14, border:`1px solid ${C.line2}`,
          display:'flex', alignItems:'center', gap: 12,
        }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: C.indigo, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight: 800 }}>К</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, letterSpacing:'-0.01em' }}>Кредитекс СТМ ББСБ</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2, fontVariantNumeric:'tabular-nums' }}>MSTRT 2400 IT 171126 · ₮1,000,000 · 6 сар</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.indigo, fontVariantNumeric:'tabular-nums', letterSpacing:'-0.02em' }}>19.5%</div>
          </div>
        </div>

        {/* Form */}
        <div style={{ marginTop: 16, display:'flex', flexDirection:'column', gap: 14 }}>
          <Field label="Бүтээгдэхүүн" value="MSTRT 2400 IT 171126"/>
          <Field label="Нэрлэсэн үнэ" value="₮ 1,000,000"/>
          <Field label="Тоо ширхэг" value="50 ш" focused/>

          {/* percent vs price toggle */}
          <div>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 8 }}>Хямдруулалт</div>
            <div style={{ display:'flex', gap: 8, marginBottom: 10 }}>
              {['Хувь (%)','Үнэ (₮)'].map((l, i) => (
                <div key={i} onClick={()=>setMode(i)} style={{
                  flex: 1, height: 36, borderRadius: 10,
                  background: mode===i ? C.indigoSoft : '#FAFBFE',
                  border: `1.5px solid ${mode===i ? C.indigo : C.line}`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize: 12, fontWeight: 700, color: mode===i ? C.indigo : C.muted,
                  cursor:'pointer',
                }}>
                  <div style={{
                    width: 14, height: 14, borderRadius: 999, border: `2px solid ${mode===i ? C.indigo : C.line}`,
                    background: mode===i ? C.indigo : '#fff', marginRight: 8, position:'relative',
                  }}>
                    {mode===i && <div style={{ position:'absolute', inset: 3, borderRadius:999, background:'#fff' }}/>}
                  </div>
                  {l}
                </div>
              ))}
            </div>
            <div style={{
              height: 52, borderRadius: 14, background: '#FAFBFE', border:`1.5px solid ${C.line}`,
              padding: '0 16px', display:'flex', alignItems:'center', justifyContent:'space-between',
              color: C.ink, fontSize: 16, fontWeight: 700, fontVariantNumeric:'tabular-nums',
            }}>
              <span>2.5</span>
              <span style={{ color: C.muted, fontSize: 13 }}>%</span>
            </div>
          </div>

          <Field label="Нөхцөл" value="Нөхцөл биелтэл хүчинтэй"/>
        </div>

        {/* Order summary */}
        <div style={{ marginTop: 16, background:'#FAFBFE', borderRadius: 18, padding: 16, border:`1px solid ${C.line2}` }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform:'uppercase', letterSpacing:'0.06em' }}>Захиалгын дүн</div>
          <div style={{ marginTop: 10, display:'flex', flexDirection:'column', gap: 8 }}>
            {[
              ['Нийт дүн','₮ 50,000,000'],
              ['Шимтгэл','₮ 25,000'],
              ['Хугацаа','179 хоног'],
              ['Хүлээн авах өгөөж','+ ₮ 4,775,000'],
            ].map((r,i)=>(
              <div key={i} style={{ display:'flex', justifyContent:'space-between' }}>
                <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>{r[0]}</span>
                <span style={{
                  fontSize: 13, fontWeight: 700,
                  color: i===3 ? C.green : C.ink, fontVariantNumeric:'tabular-nums',
                }}>{r[1]}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 14, display:'flex', gap: 10, alignItems:'flex-start' }}>
          <div style={{
            width: 20, height: 20, borderRadius: 6, background: C.indigo, flexShrink:0,
            display:'flex', alignItems:'center', justifyContent:'center', marginTop: 1,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>
            Захиалгын нөхцөл, эрсдэлтэй танилцаж зөвшөөрсөн.
          </div>
        </div>

        <div style={{ height: 12 }}/>
      </div>

      <div style={{ padding: '12px 24px 6px', background:'#fff', borderTop:`1px solid ${C.line2}`, flexShrink:0 }}>
        <PillBtn primary full>Захиалга баталгаажуулах</PillBtn>
      </div>
    </Frame>
  );
};

// ============================================================
// 13 — WALLET / PORTFOLIO DASHBOARD
// ============================================================
const WHolding = ({ h, onNav }) => {
  const badge = h.status === 'onsale'
    ? { t:'Зарагдаж байна', fg: C.amber, bg: C.amberSoft }
    : h.status === 'soon'
    ? { t:'Удахгүй өгөөж · ' + h.matDays + ' хоног', fg: C.green, bg: C.greenSoft }
    : null;
  return (
    <button onClick={()=>onNav && onNav('ownedDetail')} style={{
      width:'100%', textAlign:'left', display:'flex', alignItems:'center', gap: 12, padding: 14,
      background:'#fff', border:`1px solid ${C.line2}`, borderRadius: 16, cursor:'pointer',
    }}>
      <div style={{ width: 42, height: 42, borderRadius: 12, background: h.c+'18', color: h.c, display:'flex', alignItems:'center', justifyContent:'center', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{h.ab}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, fontVariantNumeric:'tabular-nums', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{h.ticker}</div>
        <div style={{ fontSize: 11, color: C.muted, marginTop: 2, fontWeight: 600 }}>{h.type} · Төлөгдөх {h.mat}</div>
        {badge && (
          <span style={{ display:'inline-flex', alignItems:'center', gap: 5, marginTop: 7, padding:'3px 8px', borderRadius: 999, background: badge.bg, color: badge.fg, fontSize: 10, fontWeight: 700 }}>
            <Dot color={badge.fg}/>{badge.t}
          </span>
        )}
      </div>
      <div style={{ textAlign:'right', flexShrink: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 800, color: C.ink, fontVariantNumeric:'tabular-nums', letterSpacing:'-0.01em' }}>₮{h.val}</div>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.green, marginTop: 2, fontVariantNumeric:'tabular-nums' }}>+{h.y}%</div>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0 }}><path d="M9 6l6 6-6 6" stroke={C.muted2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </button>
  );
};

const Wallet = ({ activeTab='wallet', onNav, view='default' }) => {
  const cash = 2180000;
  const base = [
    { ticker:'CAPIT 1450', type:'Сертификат', ab:'CD', c: C.blue, valN: 8200000, val:'8,200,000', y:'15.5', mat:'278 хоног', matDays: 278, status:'' },
    { ticker:'GOLDH 2300', type:'Итгэлцэл', ab:'ИТ', c:'#F59E0B', valN: 12000000, val:'12,000,000', y:'25.6', mat:'327 хоног', matDays: 327, status:'onsale' },
    { ticker:'MSTRT 2400', type:'Итгэлцэл', ab:'ИТ', c: C.indigo, valN: 6500000, val:'6,500,000', y:'21.3', mat:'5 хоног', matDays: 5, status:'soon' },
    { ticker:'INV 0820', type:'Нэхэмжлэх', ab:'НЭ', c: C.green, valN: 4300000, val:'4,300,000', y:'18.0', mat:'45 хоног', matDays: 45, status:'' },
    { ticker:'NEXT 7.5', type:'Арилжааны бичиг', ab:'АБ', c: C.orange, valN: 3800000, val:'3,800,000', y:'7.5', mat:'12 хоног', matDays: 12, status:'' },
  ];
  const extra = [
    { ticker:'DMFIN 2250', type:'Итгэлцэл', ab:'ИТ', c:'#7C3AED', valN: 5200000, val:'5,200,000', y:'22.9', mat:'190 хоног', matDays: 190, status:'' },
    { ticker:'ZEELY 2100', type:'Итгэлцэл', ab:'ИТ', c:'#0EA5A5', valN: 2100000, val:'2,100,000', y:'21.4', mat:'141 хоног', matDays: 141, status:'onsale' },
    { ticker:'CAPIT 1620', type:'Сертификат', ab:'CD', c: C.blue, valN: 9400000, val:'9,400,000', y:'14.8', mat:'310 хоног', matDays: 310, status:'' },
  ];
  const holdings = view === 'empty' ? [] : view === 'many' ? [...base, ...extra] : base;
  const holdTotal = holdings.reduce((s, h) => s + h.valN, 0);
  const total = cash + holdTotal;
  const fmt = (n) => n.toLocaleString('en-US');

  const typeColors = { 'Бэлэн мөнгө': C.muted2, 'Сертификат': C.blue, 'Итгэлцэл':'#F59E0B', 'Нэхэмжлэх': C.green, 'Арилжааны бичиг': C.orange };
  const allocMap = {};
  holdings.forEach(h => { allocMap[h.type] = (allocMap[h.type] || 0) + h.valN; });
  const alloc = [{ k:'Бэлэн мөнгө', v: cash }, ...Object.keys(allocMap).map(k => ({ k, v: allocMap[k] }))].filter(a => a.v > 0);
  const R = 46, SW = 16, CIRC = 2 * Math.PI * R;
  let off = 0;
  const segs = alloc.map((a) => { const dash = (a.v / total) * CIRC; const seg = { a, dash, off }; off += dash; return seg; });

  const onSale = holdings.filter(h => h.status === 'onsale').length;
  const soon = holdings.find(h => h.status === 'soon');

  return (
    <Frame label="28 — Wallet · Багц">
      <div style={{ padding: '6px 24px 12px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink: 0 }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: C.ink, letterSpacing:'-0.02em' }}>Хэтэвч</div>
        <button style={{ width: 40, height: 40, borderRadius: 12, background:'#fff', border:`1px solid ${C.line}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke={C.ink} strokeWidth="2" fill="none"/><path d="M12 1v3M12 20v3M23 12h-3M4 12H1M20 4l-2 2M6 18l-2 2M20 20l-2-2M6 6L4 4" stroke={C.ink} strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>

      <div style={{ flex: 1, overflow:'auto', padding: '0 24px 12px' }}>
        {/* CASH — on top, separate */}
        <div style={{ borderRadius: 22, padding: 20, background:`linear-gradient(135deg, ${C.navy} 0%, ${C.navy3} 100%)`, color:'#fff', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', right:-40, top:-40, opacity:.35 }}><LogoMark size={140}/></div>
          <div style={{ position:'relative' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontSize: 11, opacity:.7, fontWeight: 600 }}>Бэлэн мөнгө · Хэтэвч</div>
              <div style={{ background:'rgba(255,255,255,.1)', padding:'4px 10px', borderRadius:999, fontSize: 11, fontWeight:700 }}>MNT</div>
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, marginTop: 10, letterSpacing:'-0.02em', fontVariantNumeric:'tabular-nums' }}>₮ {fmt(cash)}</div>
            <div style={{ fontSize: 11, opacity:.55, fontWeight: 600, marginTop: 4, fontVariantNumeric:'tabular-nums' }}>№ 200001281 · Хаан Банк ••••450</div>
            <div style={{ display:'flex', gap: 8, marginTop: 18 }}>
              <button onClick={()=>onNav && onNav('addAmount')} style={{ flex: 1, height: 44, borderRadius: 12, background:'#fff', border:'none', color: C.ink, fontWeight: 700, fontSize: 13, display:'flex', alignItems:'center', justifyContent:'center', gap: 6, cursor:'pointer' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12l7-7 7 7" stroke={C.green} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Орлого
              </button>
              <button onClick={()=>onNav && onNav('wdAmount')} style={{ flex: 1, height: 44, borderRadius: 12, background:'rgba(255,255,255,.12)', border:'1px solid rgba(255,255,255,.18)', color:'#fff', fontWeight: 700, fontSize: 13, display:'flex', alignItems:'center', justifyContent:'center', gap: 6, cursor:'pointer' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 19V5M5 12l7 7 7-7" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Зарлага
              </button>
            </div>
          </div>
        </div>

        {/* PORTFOLIO overview + allocation donut */}
        <div style={{ marginTop: 14, background:'#fff', borderRadius: 20, padding: 18, border:`1px solid ${C.line2}` }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontSize: 12, color: C.muted, fontWeight: 700 }}>Нийт хөрөнгө</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: C.ink, marginTop: 2, letterSpacing:'-0.02em', fontVariantNumeric:'tabular-nums' }}>₮ {fmt(total)}</div>
            </div>
            {holdings.length > 0 && (
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>Нийт өгөөж</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: C.green, fontVariantNumeric:'tabular-nums' }}>+18.4%</div>
              </div>
            )}
          </div>
          {holdings.length > 0 ? (
            <div style={{ display:'flex', alignItems:'center', gap: 18, marginTop: 14 }}>
              <svg width="118" height="118" viewBox="0 0 120 120" style={{ flexShrink: 0 }}>
                {segs.map((s, i) => (
                  <circle key={i} r={R} cx="60" cy="60" fill="none" stroke={typeColors[s.a.k] || C.muted2} strokeWidth={SW}
                    strokeDasharray={s.dash + ' ' + (CIRC - s.dash)} strokeDashoffset={-s.off} transform="rotate(-90 60 60)"/>
                ))}
                <text x="60" y="56" textAnchor="middle" fontSize="9" fontWeight="600" fill={C.muted}>Хуваарилалт</text>
                <text x="60" y="71" textAnchor="middle" fontSize="13" fontWeight="800" fill={C.ink}>{alloc.length} төрөл</text>
              </svg>
              <div style={{ flex: 1, display:'flex', flexDirection:'column', gap: 7 }}>
                {alloc.map((a, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap: 8 }}>
                    <span style={{ width: 9, height: 9, borderRadius: 3, background: typeColors[a.k] || C.muted2, flexShrink: 0 }}/>
                    <span style={{ flex: 1, fontSize: 11.5, color: C.text, fontWeight: 600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{a.k}</span>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: C.ink, fontVariantNumeric:'tabular-nums' }}>{Math.round(a.v / total * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ marginTop: 10, fontSize: 12.5, color: C.muted, lineHeight: 1.5 }}>Зөвхөн бэлэн мөнгө байна. Эхний бүтээгдэхүүнээ авч багцаа бүрдүүлээрэй.</div>
          )}
        </div>

        {/* alert: soon-to-pay-interest */}
        {soon && (
          <div style={{ marginTop: 12, display:'flex', alignItems:'center', gap: 10, padding:'12px 14px', borderRadius: 14, background: C.greenSoft, border:`1px solid ${C.green}22` }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 7v5l3 2" stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="9" stroke={C.green} strokeWidth="2"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: C.ink }}>{soon.ticker} — удахгүй өгөөж</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{soon.matDays} хоногийн дараа эргэн төлөгдөнө.</div>
            </div>
          </div>
        )}

        {/* PRODUCTS section */}
        <div style={{ marginTop: 18, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: C.ink, letterSpacing:'-0.01em' }}>Миний бүтээгдэхүүн{holdings.length ? ' (' + holdings.length + ')' : ''}</div>
          {onSale > 0 && <span style={{ fontSize: 11, fontWeight: 700, color: C.amber, background: C.amberSoft, padding:'4px 10px', borderRadius: 999 }}>{onSale} зарагдаж байна</span>}
        </div>

        {holdings.length === 0 ? (
          <div style={{ marginTop: 12, background:'#fff', borderRadius: 18, border:`1px dashed ${C.line}`, padding:'34px 24px', textAlign:'center' }}>
            <div style={{ width: 60, height: 60, borderRadius: 18, background: C.indigoSoft, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="4" y="7" width="16" height="13" rx="2.5" stroke={C.indigo} strokeWidth="2"/><path d="M4 11h16M9 4h6" stroke={C.indigo} strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.ink, marginTop: 16 }}>Бүтээгдэхүүн алга</div>
            <div style={{ fontSize: 12.5, color: C.muted, marginTop: 6, lineHeight: 1.5, maxWidth: 260, marginLeft:'auto', marginRight:'auto' }}>Та эхний хөрөнгө оруулалтаа хийснээр энд бүтээгдэхүүнүүд харагдана.</div>
            <button onClick={()=>onNav && onNav('trade')} style={{ height: 44, padding:'0 22px', borderRadius: 12, marginTop: 16, background: C.indigo, color:'#fff', border:'none', fontWeight: 700, fontSize: 14, cursor:'pointer' }}>Хөрөнгө оруулж эхлэх</button>
          </div>
        ) : (
          <div style={{ marginTop: 12, display:'flex', flexDirection:'column', gap: 10 }}>
            {holdings.map((h, i) => <WHolding key={i} h={h} onNav={onNav}/>)}
          </div>
        )}

        {/* Transactions */}
        <div style={{ marginTop: 18, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: C.ink, letterSpacing:'-0.01em' }}>Гүйлгээний түүх</div>
          <span style={{ fontSize: 12, color: C.indigo, fontWeight: 700 }}>Бүгд →</span>
        </div>
        <div style={{ marginTop: 10, background:'#fff', borderRadius: 16, border:`1px solid ${C.line2}`, overflow:'hidden' }}>
          {[
            { t:'Орлого', d:'2026-05-21', a:'+ 5,000,000', c: C.green },
            { t:'Захиалга: MSTRT 2400', d:'2026-05-20', a:'– 10,000,000', c: C.ink },
            { t:'Эргэн төлөлт: CAPIT 1450', d:'2026-05-18', a:'+ 1,145,000', c: C.green },
          ].map((t, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap: 12, padding:'12px 14px', borderTop: i ? `1px solid ${C.line2}` : 'none' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.t}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2, fontVariantNumeric:'tabular-nums' }}>{t.d}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: t.c, fontVariantNumeric:'tabular-nums' }}>{t.a}</div>
            </div>
          ))}
        </div>

        <div style={{ height: 8 }}/>
      </div>

      <BottomTabs active={activeTab} onNav={onNav}/>
    </Frame>
  );
};

// ============================================================
// 14 — NEWS / ANNOUNCEMENTS
// ============================================================
const News = ({ activeTab='news', onNav }) => {
  const featured = {
    t:'Арилжааны бичгийн анхдагч арилжаа зарлагдсан тухай',
    d:'2026-04-10',
    body:'Монголын мөнгөний зах зээлд арилжааны бичиг (Commercial Paper)-ийн анхны арилжаа зарлагдлаа.',
    tag:'Арилжааны бичиг',
  };
  const items = [
    { t:'Хөтөлномгон ББСБ ХХК анхдагч арилжаагаа зарлалаа', d:'2025-04-08', tag:'Итгэлцэл' },
    { t:'Дарь Финанс ББСБ ХХК Итгэлцлийн анхдагч арилжаагаа зарлалаа', d:'2025-03-07', tag:'Итгэлцэл' },
    { t:'Микро Кредит ББСБ ХХК -ийн MICRO итгэлцэл дахин зарлагдлаа', d:'2025-01-21', tag:'Итгэлцэл' },
    { t:'"ДЭМ" Итгэлцлийн бүтээгдэхүүн Анхдагч зах зээл дээр шинээр гарлаа', d:'2024-11-15', tag:'Итгэлцэл' },
  ];
  return (
    <Frame label="29 — News / Announcements">
      <div style={{ padding:'6px 24px 12px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: C.ink, letterSpacing:'-0.02em' }}>Мэдээ мэдээлэл</div>
        <button style={{ width: 40, height: 40, borderRadius: 12, background:'#fff', border:`1px solid ${C.line}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6" stroke={C.ink} strokeWidth="2" fill="none"/><path d="M16 16l4 4" stroke={C.ink} strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>

      <div style={{ padding:'0 24px 12px', flexShrink:0 }}>
        <div style={{ display:'flex', gap: 8, overflowX:'auto', marginLeft:-24, paddingLeft:24, paddingRight:24, marginRight:-24 }}>
          {['Бүгд','Итгэлцэл','Сертификат','Нэхэмжлэх','Арилжааны бичиг'].map((c, i) => (
            <div key={i} style={{
              padding:'7px 12px', borderRadius: 999, whiteSpace:'nowrap', flexShrink: 0,
              background: i===0 ? C.ink : '#fff', color: i===0 ? '#fff' : C.text,
              border: `1px solid ${i===0 ? C.ink : C.line}`,
              fontSize: 12, fontWeight: 600,
            }}>{c}</div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflow:'auto', padding: '0 24px 16px' }}>
        {/* Featured */}
        <div style={{
          borderRadius: 22, overflow:'hidden',
          background: `linear-gradient(160deg, ${C.indigo}, ${C.blue})`,
          color:'#fff', padding: 18, position: 'relative',
        }}>
          <div style={{ position:'absolute', right:-40, bottom:-40, width: 160, height: 160, borderRadius:'50%', background:'rgba(255,255,255,.08)'}}/>
          <div style={{ position:'absolute', right:0, top: 0, width: 90, height: 90, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,107,44,.5), transparent)'}}/>
          <div style={{ position:'relative' }}>
            <Badge tone="info">Онцлох</Badge>
            <div style={{ fontSize: 18, fontWeight: 800, marginTop: 12, letterSpacing:'-0.01em', lineHeight: 1.25, textWrap:'pretty' }}>{featured.t}</div>
            <div style={{ fontSize: 13, opacity:.85, marginTop: 10, lineHeight: 1.5 }}>{featured.body}</div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop: 14, fontSize: 11, opacity: .8, fontVariantNumeric:'tabular-nums' }}>
              <span>{featured.d}</span>
              <span style={{ fontWeight: 700 }}>Унших →</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 18, fontSize: 14, fontWeight: 800, color: C.ink, letterSpacing:'-0.01em' }}>Бусад мэдээ</div>

        <div style={{ marginTop: 12, display:'flex', flexDirection:'column', gap: 10 }}>
          {items.map((n, i) => (
            <div key={i} style={{ background:'#fff', borderRadius: 16, padding: 14, border:`1px solid ${C.line2}`, display:'flex', gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: C.indigoSoft, color: C.indigo,
                display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column',
                fontWeight: 800, fontSize: 11, lineHeight: 1, flexShrink: 0,
              }}>
                <span>{n.d.slice(8,10)}</span>
                <span style={{ fontSize: 9, marginTop: 2, opacity: .7 }}>{['','01','02','03','04','05','06','07','08','09','10','11','12'][parseInt(n.d.slice(5,7))]}/{n.d.slice(2,4)}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
                  <Badge tone="info">{n.tag}</Badge>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginTop: 6, lineHeight: 1.3, letterSpacing:'-0.005em' }}>{n.t}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ height: 8 }}/>
      </div>

      <BottomTabs active={activeTab} onNav={onNav}/>
    </Frame>
  );
};

// ============================================================
// 15 — LOAN APP
// ============================================================
const Loan = ({ activeTab='loan', onNav }) => {
  const daysTotal = 30, daysLeft = 24;
  const elapsedPct = Math.round(((daysTotal - daysLeft) / daysTotal) * 100);
  return (
    <Frame label="30 — Loan / Зээл">
      <div style={{ padding:'6px 24px 12px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: C.ink, letterSpacing:'-0.02em' }}>Зээл</div>
        <button style={{ width: 40, height: 40, borderRadius: 12, background:'#fff', border:`1px solid ${C.line}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="1.5" fill={C.ink}/><circle cx="12" cy="5" r="1.5" fill={C.ink}/><circle cx="12" cy="19" r="1.5" fill={C.ink}/></svg>
        </button>
      </div>

      <div style={{ flex: 1, overflow:'auto', padding: '0 24px 16px' }}>
        {/* Active loan hero */}
        <div style={{
          borderRadius: 22, padding: 20, color:'#fff',
          background: `linear-gradient(135deg, ${C.navy} 0%, ${C.indigo} 130%)`,
          position: 'relative', overflow:'hidden',
        }}>
          <div style={{ position:'absolute', right:-50, bottom:-50, width: 200, height: 200, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,107,44,.35), transparent 70%)'}}/>
          <div style={{ position:'relative' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div>
                <div style={{ fontSize: 11, opacity: .7, fontWeight: 600 }}>Идэвхтэй зээл</div>
                <div style={{ fontSize: 11, opacity: .5, fontWeight: 600, marginTop: 2, fontVariantNumeric:'tabular-nums' }}>LN-2026-04823 · 30 хоног</div>
              </div>
              <Badge tone="new">Хэвийн</Badge>
            </div>
            <div style={{ fontSize: 12, opacity: .7, marginTop: 16 }}>Эргэн төлөх дүн</div>
            <div style={{ fontSize: 34, fontWeight: 800, letterSpacing:'-0.02em', fontVariantNumeric:'tabular-nums', marginTop: 2 }}>
              ₮ 3,075,000
            </div>
            {/* Countdown to single due date */}
            <div style={{ marginTop: 16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize: 11, opacity:.7, marginBottom: 6 }}>
                <span>{daysTotal - daysLeft} / {daysTotal} хоног</span>
                <span style={{ fontVariantNumeric:'tabular-nums' }}>{daysLeft} хоног үлдлээ</span>
              </div>
              <div style={{ height: 6, borderRadius: 999, background:'rgba(255,255,255,.15)', overflow:'hidden' }}>
                <div style={{ width: elapsedPct+'%', height:'100%', borderRadius: 999, background:'linear-gradient(90deg, #7FF3C2, #2D6BFF)' }}/>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10, marginTop: 18 }}>
              <div style={{ background:'rgba(255,255,255,.06)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,.1)', borderRadius: 12, padding: 12 }}>
                <div style={{ fontSize: 10, opacity: .6, fontWeight: 600 }}>Эргэн төлөх огноо</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4, fontVariantNumeric:'tabular-nums' }}>2026-06-28</div>
                <div style={{ fontSize: 10, opacity: .65, marginTop: 2 }}>Нэг удаа бүтэн төлнө</div>
              </div>
              <div style={{ background:'rgba(255,255,255,.06)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,.1)', borderRadius: 12, padding: 12 }}>
                <div style={{ fontSize: 10, opacity: .6, fontWeight: 600 }}>Хүү</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4, fontVariantNumeric:'tabular-nums' }}>2.5 % / 30 хоног</div>
                <div style={{ fontSize: 10, opacity: .65, marginTop: 2 }}>Үндсэн ₮ 3,000,000</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display:'flex', gap: 10, marginTop: 14 }}>
          <button style={{ flex:1, height: 48, borderRadius: 14, background: C.indigo, color:'#fff', border:'none', fontWeight: 700, fontSize: 14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap: 8, boxShadow:'0 8px 20px -8px rgba(79,70,229,.4)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Бүтэн төлөх
          </button>
          <button style={{ flex:1, height: 48, borderRadius: 14, background:'#fff', border:`1px solid ${C.line}`, fontWeight: 700, fontSize: 14, color: C.ink, cursor:'pointer' }}>
            Дэлгэрэнгүй
          </button>
        </div>

        {/* Repayment breakdown — single lump sum */}
        <div style={{ marginTop: 18, fontSize: 12, color: C.muted, fontWeight: 700, letterSpacing:'0.04em', textTransform:'uppercase' }}>Эргэн төлөлт</div>
        <div style={{ marginTop: 10, background:'#fff', borderRadius: 18, border:`1px solid ${C.line2}`, overflow:'hidden' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'13px 16px', borderBottom:`1px solid ${C.line2}` }}>
            <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 600 }}>Үндсэн зээл</span>
            <span style={{ fontSize: 13.5, color: C.ink, fontWeight: 700, fontVariantNumeric:'tabular-nums' }}>₮ 3,000,000</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'13px 16px', borderBottom:`1px solid ${C.line2}` }}>
            <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 600 }}>Хүү (2.5% / 30 хоног)</span>
            <span style={{ fontSize: 13.5, color: C.ink, fontWeight: 700, fontVariantNumeric:'tabular-nums' }}>₮ 75,000</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px 16px', background:'#FAFBFE' }}>
            <span style={{ fontSize: 13, color: C.ink, fontWeight: 800 }}>Нийт эргэн төлөх</span>
            <span style={{ fontSize: 18, color: C.indigo, fontWeight: 800, fontVariantNumeric:'tabular-nums', letterSpacing:'-0.01em' }}>₮ 3,075,000</span>
          </div>
        </div>
        <div style={{ marginTop: 12, display:'flex', gap: 10, alignItems:'flex-start', padding: 13, borderRadius: 12, background: C.indigoSoft }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop: 1 }}><circle cx="12" cy="12" r="9" stroke={C.indigo} strokeWidth="2" fill="none"/><path d="M12 8v.5M12 11v5" stroke={C.indigo} strokeWidth="2" strokeLinecap="round"/></svg>
          <div style={{ fontSize: 12, color: C.ink, lineHeight: 1.5 }}>
            Энэ зээлийг <strong>эргэн төлөх өдөр нэг удаа бүтэн</strong> төлнө. Сар бүрийн хуваарьт төлбөргүй.
          </div>
        </div>

        {/* Product terms — single 30-day product */}
        <div style={{ marginTop: 18, fontSize: 12, color: C.muted, fontWeight: 700, letterSpacing:'0.04em', textTransform:'uppercase' }}>Бүтээгдэхүүний нөхцөл</div>
        <div style={{ marginTop: 10, background:'#fff', borderRadius: 18, border:`1px solid ${C.line2}`, padding: 16 }}>
          <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background:`linear-gradient(135deg, ${C.indigo}, ${C.blue})`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="18" height="12" rx="2" stroke="#fff" strokeWidth="2" fill="none"/><path d="M3 11h18" stroke="#fff" strokeWidth="2"/></svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.ink, letterSpacing:'-0.01em' }}>30 хоногийн богино хугацааны зээл</div>
              <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>Нэг удаагийн бүтэн төлөлттэй</div>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 8, marginTop: 14 }}>
            {[
              { l:'Хүү', v:'2.5%' },
              { l:'Хугацаа', v:'30 хоног' },
              { l:'Дүн', v:'Чөлөөт' },
            ].map((x, i) => (
              <div key={i} style={{ background:'#FAFBFE', borderRadius: 12, padding:'10px 12px', border:`1px solid ${C.line2}` }}>
                <div style={{ fontSize: 10, color: C.muted, fontWeight: 600 }}>{x.l}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: C.ink, marginTop: 3, fontVariantNumeric:'tabular-nums', letterSpacing:'-0.01em' }}>{x.v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, display:'flex', alignItems:'center', gap: 8, fontSize: 11.5, color: C.muted }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke={C.muted} strokeWidth="2" fill="none"/><path d="M8 11V8a4 4 0 018 0v3" stroke={C.muted} strokeWidth="2" fill="none"/></svg>
            Идэвхтэй зээл төлөгдсөний дараа шинэ зээл авах боломжтой.
          </div>
        </div>

        <div style={{ height: 8 }}/>
      </div>

      <BottomTabs active={activeTab} onNav={onNav}/>
    </Frame>
  );
};

// ============================================================
// 19 — LOAN ELIGIBILITY · KYC CHECK
// ============================================================
const LoanEligibility = () => {
  const [emp, setEmp] = useState(0);
  const [consent, setConsent] = useState(true);
  return (
    <Frame label="33 — Loan eligibility · KYC">
      <BackBar title="Зээлийн эрх шалгах"/>
      {/* progress */}
      <div style={{ padding:'0 24px 14px', flexShrink: 0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize: 11, color: C.muted, fontWeight: 600, marginBottom: 8 }}>
          <span>Алхам 2 / 3 · Орлогын мэдээлэл</span>
          <span style={{ fontVariantNumeric:'tabular-nums' }}>66%</span>
        </div>
        <div style={{ height: 6, borderRadius: 999, background: C.line2, overflow:'hidden' }}>
          <div style={{ width:'66%', height:'100%', borderRadius: 999, background: C.indigo }}/>
        </div>
      </div>

      <div style={{ flex: 1, overflow:'auto', padding:'6px 24px 20px' }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.ink, letterSpacing:'-0.02em', lineHeight: 1.18 }}>
          Зээлийн эрхээ шалгах
        </div>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 8, lineHeight: 1.5 }}>
          Доорх мэдээллийг бөглөснөөр урьдчилсан зээлийн эрхээ хормын дотор харах боломжтой.
        </div>

        <div style={{ marginTop: 22, display:'flex', flexDirection:'column', gap: 18 }}>
          {/* Monthly income */}
          <div>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 8 }}>Сарын дундаж орлого</div>
            <div style={{
              height: 52, borderRadius: 14, background:'#fff',
              border:`1.5px solid ${C.indigo}`, boxShadow:`0 0 0 4px ${C.indigoSoft}`,
              padding:'0 16px', display:'flex', alignItems:'center', justifyContent:'space-between',
              color: C.ink, fontSize: 15, fontWeight: 700, fontVariantNumeric:'tabular-nums',
            }}>
              <span>₮ 3,500,000</span>
              <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>/ сар</span>
            </div>
          </div>

          {/* Employment type */}
          <div>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 8 }}>Ажил эрхлэлтийн төрөл</div>
            <div style={{ display:'flex', gap: 8 }}>
              {['Цалинтай','Хувиараа','Бизнес'].map((t, i) => (
                <div key={i} onClick={() => setEmp(i)} style={{
                  flex: 1, height: 46, borderRadius: 12,
                  background: emp===i ? C.indigoSoft : '#FAFBFE',
                  border:`1.5px solid ${emp===i ? C.indigo : C.line}`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize: 13, fontWeight: 700, color: emp===i ? C.indigo : C.muted, cursor:'pointer',
                }}>{t}</div>
              ))}
            </div>
          </div>

          {/* Employer / tenure */}
          <div>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 8 }}>Ажил олгогч · ажилласан хугацаа</div>
            <div style={{
              height: 52, borderRadius: 14, background:'#FAFBFE',
              border:`1.5px solid ${C.line}`, padding:'0 16px',
              display:'flex', alignItems:'center', justifyContent:'space-between',
              color: C.ink, fontSize: 14, fontWeight: 500,
            }}>
              <span>Голомт Банк · 3 жил 4 сар</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke={C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>

          {/* Desired amount */}
          <div>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 8 }}>Хүсэх дүн</div>
            <div style={{
              height: 52, borderRadius: 14, background:'#FAFBFE',
              border:`1.5px solid ${C.line}`, padding:'0 16px',
              display:'flex', alignItems:'center', justifyContent:'space-between',
              color: C.ink, fontSize: 15, fontWeight: 700, fontVariantNumeric:'tabular-nums',
            }}>
              <span>₮ 15,000,000</span>
              <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>12 сар</span>
            </div>
          </div>

          {/* Consent — credit bureau */}
          <div onClick={() => setConsent(!consent)} style={{
            display:'flex', gap: 12, alignItems:'flex-start', cursor:'pointer',
            padding: 14, borderRadius: 14, background:'#FAFBFE', border:`1px solid ${C.line2}`,
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: 7, flexShrink: 0, marginTop: 1,
              background: consent ? C.indigo : '#fff', border:`1.5px solid ${consent ? C.indigo : C.line}`,
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              {consent && <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
            <div style={{ fontSize: 12, color: C.text, lineHeight: 1.5 }}>
              Зээлийн мэдээллийн санд хандаж миний зээлийн түүхийг шалгахыг <strong style={{ color: C.ink }}>зөвшөөрч</strong> байна.
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding:'12px 24px 6px', background:'#fff', borderTop:`1px solid ${C.line2}`, flexShrink: 0 }}>
        <button style={{
          width:'100%', height: 52, borderRadius: 999,
          background: C.ink, color:'#fff', border:'none', fontWeight: 700, fontSize: 15, cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center', gap: 10,
        }}>
          Эрх шалгах
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </Frame>
  );
};

// ============================================================
// 20 — LOAN ELIGIBILITY · RESULT (pre-approved)
// ============================================================
const LoanEligibilityResult = () => (
  <Frame label="34 — Loan eligibility · Result">
    <BackBar title="Шалгалтын үр дүн"/>
    <div style={{ flex: 1, overflow:'auto', padding:'6px 24px 20px' }}>
      {/* hero */}
      <div style={{
        borderRadius: 22, padding: 24, color:'#fff', textAlign:'center',
        background: `linear-gradient(150deg, ${C.green} 0%, #0B8F60 60%, ${C.navy3} 140%)`,
        position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute', right:-40, top:-40, width: 160, height: 160, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,255,255,.22), transparent 70%)'}}/>
        <div style={{ position:'relative' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 999, margin:'0 auto',
            background:'rgba(255,255,255,.16)', border:'1px solid rgba(255,255,255,.25)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, marginTop: 16, opacity: .85, letterSpacing:'0.04em' }}>Танд урьдчилсан зөвшөөрөл олгогдлоо</div>
          <div style={{ fontSize: 38, fontWeight: 800, letterSpacing:'-0.02em', marginTop: 6, fontVariantNumeric:'tabular-nums' }}>₮ 18,000,000</div>
          <div style={{ fontSize: 12, opacity: .8, marginTop: 4 }}>хүртэлх зээлийн эрх</div>
        </div>
      </div>

      {/* terms */}
      <div style={{ marginTop: 14, display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10 }}>
        {[
          { l:'Хүү', v:'1.8 %/сар' },
          { l:'Хугацаа', v:'12 сар хүртэл' },
          { l:'Сарын төлбөр', v:'₮ 1.65 сая' },
          { l:'Эрхийн хүчинтэй', v:'30 хоног' },
        ].map((x, i) => (
          <div key={i} style={{ background:'#fff', borderRadius: 14, padding: 14, border:`1px solid ${C.line2}` }}>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>{x.l}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.ink, marginTop: 4, fontVariantNumeric:'tabular-nums', letterSpacing:'-0.01em' }}>{x.v}</div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 14, display:'flex', gap: 10, alignItems:'flex-start',
        padding: 14, borderRadius: 14, background: C.indigoSoft, border:`1px solid ${C.line2}`,
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="9" stroke={C.indigo} strokeWidth="2" fill="none"/><path d="M12 8v.5M12 11v5" stroke={C.indigo} strokeWidth="2" strokeLinecap="round"/></svg>
        <div style={{ fontSize: 12, color: C.text, lineHeight: 1.5 }}>
          Энэ нь урьдчилсан тооцоолол бөгөөд эцсийн шийдвэр баримт бичиг шалгасны дараа гарна.
        </div>
      </div>
    </div>

    <div style={{ padding:'12px 24px 6px', background:'#fff', borderTop:`1px solid ${C.line2}`, flexShrink: 0 }}>
      <button style={{
        width:'100%', height: 52, borderRadius: 999,
        background: C.indigo, color:'#fff', border:'none', fontWeight: 700, fontSize: 15, cursor:'pointer',
        display:'flex', alignItems:'center', justifyContent:'center', gap: 10,
        boxShadow:'0 10px 24px -10px rgba(79,70,229,.5)',
      }}>
        Зээлийн хүсэлт үргэлжлүүлэх
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>
  </Frame>
);

// ============================================================
// EXPORT EVERYTHING TO WINDOW
// ============================================================
Object.assign(window, {
  Splash, Onb1, Onb2, Onb3, Onb4, SignUp, SignupStep1, SignupStep2, SignupStep3, OTP, Login,
  Home, Trading, Category, Detail, Order, Wallet, News, Loan,
  LoanEligibility, LoanEligibilityResult,
  Frame, BottomTabs, C,
  // shared atoms for onboarding_v2.jsx
  StatusBar, HomeIndicator, LogoMark, LogoFull, Dot, Badge, PillBtn, Field, Spark,
  BackBar, SignupStepHeader, DanLogo,
});
