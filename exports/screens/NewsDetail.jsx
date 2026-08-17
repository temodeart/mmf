/* =========================================================================
   Money Market Fund — Mobile App · Screen: NewsDetail
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
// ----- Home earnings hero (direction A) -----

const HOME_MINT = '#7FF3C2', HOME_DIM = '#FCA5A5';

const HomeChartAxes = ({ color, pts, yTop, yBot, dim }) => {
  const w = 300, h = 56;
  const dMin = Math.min(...pts), dMax = Math.max(...pts);
  const lo = Math.min(0, dMin), hi = Math.max(0, dMax), range = (hi - lo) || 1;
  const yOf = (v) => h - ((v - lo) / range) * (h - 6) - 3;
  const step = w / (pts.length - 1);
  const co = pts.map((p, i) => [i * step, yOf(p)]);
  const line = co.map((c, i) => (i === 0 ? 'M' : 'L') + c[0].toFixed(1) + ' ' + c[1].toFixed(1)).join(' ');
  const zeroY = yOf(0);
  const area = line + ` L ${w} ${zeroY} L 0 ${zeroY} Z`;
  const last = co[co.length - 1];
  return (
    <div style={{ display:'flex', gap:7, marginTop:8, opacity: dim ? .6 : 1 }}>
      <div style={{ display:'flex', flexDirection:'column', justifyContent:'space-between', height:h, fontSize:8.5, opacity:.45, fontWeight:600, textAlign:'right', whiteSpace:'nowrap', fontVariantNumeric:'tabular-nums' }}>
        <span>{yTop}</span><span>{yBot}</span>
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display:'block', height:h }}>
          <line x1="0" y1={zeroY} x2={w} y2={zeroY} stroke="rgba(255,255,255,.18)" strokeWidth="1" strokeDasharray="3 3"/>
          {!dim && <path d={area} fill={color} opacity="0.14"/>}
          <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx={last[0]} cy={last[1]} r="3.5" fill={color}/>
        </svg>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:4, fontSize:8.5, opacity:.45, fontWeight:600, fontVariantNumeric:'tabular-nums' }}>
          <span>06-06</span><span>06-09</span><span>Өнөөдөр</span>
        </div>
      </div>
    </div>
  );
};

const EarningsHero = ({ day = 48500 }) => {
  const totalAssets = 48250000, totalYield = 3420000;
  const neg = day < 0, zero = day === 0;
  const color = zero ? 'rgba(255,255,255,.92)' : neg ? HOME_DIM : HOME_MINT;
  const sign = zero ? '' : neg ? '− ' : '+ ';
  const pts = zero ? [6,6,6,6,6,6,6,6] : neg ? [26,24,20,16,10,4,-4,-10] : [4,8,6,14,12,20,26,34];
  const yTop = zero ? '₮10к' : neg ? '₮26к' : '₮50к';
  const yBot = neg ? '−₮12к' : '₮0';
  const cmp = zero ? null : neg ? 'өчигдрөөс −24%' : 'өчигдрөөс +6%';
  const cmpC = neg ? HOME_DIM : HOME_MINT;
  const f = (n) => Math.abs(n).toLocaleString('en-US');
  return (
    <div style={{ borderRadius: 24, padding: 22, color:'#fff', cursor:'pointer', background:`linear-gradient(135deg, ${C.navy} 0%, ${C.indigo} 130%)`, position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', right:-40, top:-40, width: 180, height: 180, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,107,44,.4), transparent 70%)' }}/>
      <div style={{ position:'relative' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontSize: 12, opacity: .7, fontWeight: 600 }}>Өдрийн өгөөж</div>
          <span style={{ display:'inline-flex', alignItems:'center', gap: 3, fontSize: 12, fontWeight: 700, opacity:.85 }}>
            Дэлгэрэнгүй
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
        </div>
        <div style={{ display:'flex', alignItems:'baseline', gap: 8, marginTop: 6 }}>
          <span style={{ fontSize: 32, fontWeight: 800, color, letterSpacing:'-0.02em', fontVariantNumeric:'tabular-nums' }}>{sign}₮ {f(day)}</span>
          <span style={{ fontSize: 13, opacity:.7 }}>өнөөдөр</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop: 14 }}>
          <span style={{ fontSize: 10, opacity:.55, fontWeight: 600 }}>Сүүлийн 7 хоног</span>
          {cmp && (
            <span style={{ display:'inline-flex', alignItems:'center', gap: 4, fontSize: 10.5, fontWeight: 700, color: cmpC }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ transform: neg ? 'scaleY(-1)' : 'none' }}><path d="M12 19V5M5 12l7-7 7 7" stroke={cmpC} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              {cmp}
            </span>
          )}
        </div>
        <HomeChartAxes color={color} pts={pts} yTop={yTop} yBot={yBot} dim={zero}/>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop: 14, paddingTop: 14, borderTop:'1px solid rgba(255,255,255,.12)' }}>
          <div>
            <div style={{ fontSize: 10.5, opacity:.6, fontWeight: 600 }}>Нийт хөрөнгө</div>
            <div style={{ fontSize: 14, fontWeight: 800, marginTop: 3, fontVariantNumeric:'tabular-nums' }}>₮ {f(totalAssets)}</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize: 10.5, opacity:.6, fontWeight: 600 }}>Нийт өгөөж</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: HOME_MINT, marginTop: 3, fontVariantNumeric:'tabular-nums' }}>+ ₮ {f(totalYield)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomeAllocCard = () => (
  <div style={{ background:'#fff', borderRadius: 18, border:`1px solid ${C.line2}`, padding: 16, marginTop: 12 }}>
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: C.ink }}>Багцын бүтэц</div>
      <span style={{ fontSize: 11, color: C.muted, fontWeight: 700 }}>3 төрөл</span>
    </div>
    <div style={{ display:'flex', gap: 3, marginTop: 12, height: 10, borderRadius: 999, overflow:'hidden' }}>
      <div style={{ flexBasis:'45%', background:'#8B7CFF' }}/>
      <div style={{ flexBasis:'35%', background: C.blue }}/>
      <div style={{ flexBasis:'20%', background:'#2DD4BF' }}/>
    </div>
    <div style={{ display:'flex', flexWrap:'wrap', gap:'8px 16px', marginTop: 12 }}>
      {[
        { c:'#8B7CFF', l:'Итгэлцэл', p:'45%' },
        { c: C.blue, l:'Сертификат', p:'35%' },
        { c:'#2DD4BF', l:'Мөнгө хөрөнгө', p:'20%' },
      ].map((x,i)=>(
        <div key={i} style={{ display:'flex', alignItems:'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: x.c }}/>
          <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{x.l}</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: C.ink, fontVariantNumeric:'tabular-nums' }}>{x.p}</span>
        </div>
      ))}
    </div>
  </div>
);
// ============================================================
// EDUCATION — bottom-of-Home learn carousel (visually distinct)
// 3 portrait cards: 1 opens a video modal, 2 open a detail/blog page.
// ============================================================

const EDU_CARDS = [
  { key:'trust',  kind:'video',   t:'Итгэлцэл (Trust) гэж юу вэ?',        meta:'3:20', tagline:'Шинэхэн хөрөнгө оруулагчдад', c1:'#6D4FD0', c2:'#9333EA' },
  { key:'mmf',    kind:'article', t:'Мөнгөний зах зээлийн сан гэж юу вэ?', meta:'4 мин унших', tagline:'Үндсэн ойлголт', c1:'#2D6BFF', c2:'#0EA5E9' },
  { key:'market', kind:'article', t:'Анхдагч ба хоёрдогч зах зээл',        meta:'3 мин унших', tagline:'Хэрхэн ялгах вэ', c1:'#0E9F6E', c2:'#0891B2' },
];

const EduCard = ({ c, onClick }) => (
  <button onClick={onClick} style={{
    width: 172, flexShrink: 0, textAlign:'left', padding: 0, border:'none', cursor:'pointer',
    background:'#fff', borderRadius: 20, overflow:'hidden', boxShadow:'0 12px 28px -18px rgba(15,20,55,.45)',
  }}>
    <div style={{ height: 110, background:`linear-gradient(150deg, ${c.c1}, ${c.c2})`, position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ position:'absolute', left:-16, bottom:-16, width: 64, height: 64, borderRadius:'50%', background:'rgba(255,255,255,.14)' }}/>
      <div style={{ position:'absolute', right:14, top:14, width: 26, height: 26, borderRadius:'50%', border:'2px solid rgba(255,255,255,.3)' }}/>
      {c.kind === 'video' ? (
        <div style={{ width: 48, height: 48, borderRadius:'50%', background:'rgba(255,255,255,.95)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 20px -8px rgba(0,0,0,.4)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M8 5.5v13l11-6.5-11-6.5z" fill={c.c1}/></svg>
        </div>
      ) : (
        <div style={{ width: 48, height: 48, borderRadius: 14, background:'rgba(255,255,255,.18)', border:'1px solid rgba(255,255,255,.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 5.5A2 2 0 016 4h5v15H6a2 2 0 01-2-2V5.5zM20 5.5A2 2 0 0018 4h-5v15h5a2 2 0 002-2V5.5z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"/></svg>
        </div>
      )}
      <span style={{ position:'absolute', left: 12, top: 12, display:'inline-flex', alignItems:'center', gap: 5, fontSize: 10, fontWeight: 800, color:'#fff', background:'rgba(0,0,0,.22)', padding:'4px 9px', borderRadius: 999 }}>
        {c.kind === 'video'
          ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M8 5.5v13l11-6.5-11-6.5z" fill="#fff"/></svg>
          : <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 4h11l3 3v13H5z" stroke="#fff" strokeWidth="2.4" strokeLinejoin="round"/></svg>}
        {c.meta}
      </span>
    </div>
    <div style={{ padding: 13 }}>
      <div style={{ fontSize: 12.5, fontWeight: 800, color: C.ink, lineHeight: 1.3, letterSpacing:'-0.01em', minHeight: 33, textWrap:'pretty' }}>{c.t}</div>
      <div style={{ fontSize: 10.5, color: C.muted, fontWeight: 600, marginTop: 6 }}>{c.tagline}</div>
      <div style={{ marginTop: 9, display:'inline-flex', alignItems:'center', gap: 5, fontSize: 11.5, fontWeight: 800, color: c.c1 }}>
        {c.kind === 'video' ? 'Үзэх' : 'Унших'}
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke={c.c1} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
    </div>
  </button>
);

const EducationSection = ({ onOpenVideo, onNav }) => (
  <div style={{ marginTop: 24, marginLeft:-24, marginRight:-24, padding:'20px 0 22px', background:'linear-gradient(180deg, #F3F1FF 0%, #FFFFFF 100%)', borderTop:`1px solid ${C.line2}`, borderBottom:`1px solid ${C.line2}` }}>
    <div style={{ padding:'0 24px', display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom: 14 }}>
      <div>
        <div style={{ display:'inline-flex', alignItems:'center', gap: 7, fontSize: 16, fontWeight: 800, color: C.ink, letterSpacing:'-0.01em' }}>
          <span style={{ width: 22, height: 22, borderRadius: 7, background:`linear-gradient(135deg, ${C.indigo}, ${C.blue})`, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M3 7l9-4 9 4-9 4-9-4z" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/><path d="M7 9.5V14c0 1.5 2.2 2.5 5 2.5s5-1 5-2.5V9.5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
          </span>
          Суралцах
        </div>
        <div style={{ fontSize: 11.5, color: C.muted, marginTop: 4, fontWeight: 600 }}>Хөрөнгө оруулалтаа богино видео, нийтлэлээр ойлгоё</div>
      </div>
      <span style={{ fontSize: 12, color: C.indigo, fontWeight: 700, flexShrink: 0 }}>Бүгд →</span>
    </div>
    <div style={{ display:'flex', gap: 12, overflowX:'auto', padding:'4px 24px 2px' }}>
      {EDU_CARDS.map(c => (
        <EduCard key={c.key} c={c} onClick={() => c.kind === 'video' ? (onOpenVideo && onOpenVideo(c)) : (onNav && onNav('eduDetail'))}/>
      ))}
    </div>
  </div>
);

const EduVideoModal = ({ card, onClose }) => (
  <div onClick={onClose} style={{ position:'absolute', inset:0, zIndex:55, display:'flex', flexDirection:'column', justifyContent:'flex-end', background:'rgba(5,11,31,.55)' }}>
    <div onClick={(e)=>e.stopPropagation()} style={{ background:'#fff', borderRadius:'28px 28px 0 0', padding:'10px 20px 26px' }}>
      <div style={{ width:40, height:5, borderRadius:999, background:C.line, margin:'0 auto 16px' }}/>
      {/* video player (placeholder) */}
      <div style={{ borderRadius: 18, overflow:'hidden', position:'relative', aspectRatio:'16 / 9', background:`linear-gradient(150deg, ${card.c1}, ${card.c2})` }}>
        <div style={{ position:'absolute', inset:0, background:'rgba(5,11,31,.34)' }}/>
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ width: 64, height: 64, borderRadius:'50%', background:'rgba(255,255,255,.95)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 12px 30px -10px rgba(0,0,0,.5)' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M8 5.5v13l11-6.5-11-6.5z" fill={card.c1}/></svg>
          </div>
        </div>
        <div style={{ position:'absolute', left: 14, right: 14, bottom: 12 }}>
          <div style={{ height: 4, borderRadius: 999, background:'rgba(255,255,255,.3)', overflow:'hidden' }}>
            <div style={{ width:'24%', height:'100%', background:'#fff', borderRadius: 999 }}/>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop: 6, fontSize: 10, fontWeight: 700, color:'rgba(255,255,255,.9)', fontVariantNumeric:'tabular-nums' }}>
            <span>0:48</span><span>{card.meta}</span>
          </div>
        </div>
        <div style={{ position:'absolute', left: 12, top: 10, fontFamily:"'JetBrains Mono', monospace", fontSize: 10, color:'rgba(255,255,255,.6)' }}>// видео тоглуулагч</div>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap: 8, marginTop: 16 }}>
        <Badge tone="info">Видео</Badge>
        <span style={{ fontSize: 11.5, color: C.muted, fontWeight: 600 }}>{card.meta}</span>
      </div>
      <div style={{ fontSize: 18, fontWeight: 800, color: C.ink, marginTop: 10, letterSpacing:'-0.01em', lineHeight: 1.25 }}>{card.t}</div>
      <div style={{ fontSize: 13, color: C.text, marginTop: 8, lineHeight: 1.6 }}>
        Итгэлцэл нь хөрөнгө оруулагчийн мөнгийг мэргэжлийн байгууллага удирдан, тогтоосон хугацаанд өгөөж олгодог бүтээгдэхүүн. Энэ богино видеонд үндсэн ойлголт, эрсдэл, өгөөжийг тайлбарлана.
      </div>
      <button onClick={onClose} style={{ width:'100%', height: 50, borderRadius: 14, marginTop: 18, background: C.ink, color:'#fff', border:'none', fontWeight: 700, fontSize: 15, cursor:'pointer' }}>Хаах</button>
    </div>
  </div>
);

const SEC_SORTS = [
  { k:'term',  l:'Төлөгдөх хугацаа', d:'Богиноос → урт' },
  { k:'yield', l:'Бодит өгөөж',      d:'Өндөр → бага' },
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
// SECONDARY-MARKET CARD + TICKER EXPLAINER SHEET
// ============================================================

const MONO = "'JetBrains Mono', ui-monospace, monospace";

const SEC_ISSUERS = {
  CAPIT: { name:'Капитрон Банк ХК', c: C.blue,  type:'Сертификат', issued:'2024-02-27' },
  GOLDH: { name:'Голден Хилл Партнерс', c:'#F59E0B', type:'Итгэлцэл', issued:'2024-04-14' },
  MSTRT: { name:'Кредитекс СТМ ББСБ', c: C.indigo, type:'Итгэлцэл', issued:'2024-11-17' },
  DMFIN: { name:'Дарь Финанс ББСБ', c:'#7C3AED', type:'Итгэлцэл', issued:'2024-11-28' },
  ZEELY: { name:'Зээлэх Капитал ББСБ', c:'#0EA5A5', type:'Итгэлцэл', issued:'2024-11-09' },
};

const secYmd = (s) => (!s || s.length < 6) ? '' : ('20' + s.slice(4,6) + '-' + s.slice(2,4) + '-' + s.slice(0,2));

const augSec = (s) => {
  const code = String(s.ticker).split(' ')[0];
  const meta = SEC_ISSUERS[code] || { name: code, c: C.indigo, type:'—', issued:'—' };
  const mat = String(s.ticker).split(' ')[3] || '';
  return { ...s, issuer: meta.name, c: meta.c, typeName: meta.type, issued: meta.issued, maturityDate: secYmd(mat) };
};

const SecCard = ({ s, onOpen, badge, variant }) => {
  const stats = variant === 'cat'
    ? [{ l:'Ширхэг', v: s.qty }, { l:'Нэгж үнэ', v:'₮'+s.price }, { l:'Төлөгдөх', v: s.term }]
    : [{ l:'Боломжит', v: s.qty+' ш' }, { l:'Худ. авах үнэ', v:'₮'+s.price }, { l:'Үлдсэн хугацаа', v: s.term }];
  return (
    <div style={{ background:'#fff', borderRadius: 16, padding: 14, border:`1px solid ${C.line2}` }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap: 8 }}>
        <button onClick={() => onOpen && onOpen(s)} style={{ flex:1, minWidth:0, textAlign:'left', background:'none', border:'none', padding:0, cursor:'pointer', display:'flex', alignItems:'flex-start', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: s.c||C.indigo, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight: 800, fontSize: 14, flexShrink:0 }}>{(s.issuer||'').charAt(0)}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, letterSpacing:'-0.01em', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{s.issuer}</div>
            </div>
            <div style={{ marginTop: 3, fontSize: 11, color: C.muted2, fontFamily: MONO, fontWeight: 600, display:'flex', alignItems:'center', gap: 6 }}>
              {s.ticker}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, opacity:.7 }}><circle cx="12" cy="12" r="9" stroke={C.muted2} strokeWidth="2"/><path d="M12 11v5M12 8h.01" stroke={C.muted2} strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <div style={{ marginTop: 6, fontSize: 11, color: C.muted, fontWeight: 600 }}>Бодит өгөөж <span style={{ color: C.indigo, fontWeight: 800, fontSize: 13, fontVariantNumeric:'tabular-nums' }}>{s.real}% /жил</span></div>
          </div>
        </button>
        <button style={{ height: 32, padding:'0 14px', borderRadius: 10, background: C.indigoSoft, color: C.indigo, fontWeight: 700, fontSize: 12, border:'none', flexShrink:0, cursor:'pointer' }}>Авах</button>
      </div>
      <div style={{ display:'flex', gap: 16, marginTop: 12, paddingTop: 12, borderTop:`1px dashed ${C.line2}` }}>
        {stats.map((x, j) => (
          <div key={j} style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: C.muted, fontWeight: 600 }}>{x.l}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginTop: 2, fontVariantNumeric:'tabular-nums' }}>{x.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TickerSheet = ({ item, onClose }) => {
  if (!item) return null;
  const parts = String(item.ticker).split(' ');
  const segs = [
    { v: parts[0]||'', label:'Гаргагчийн код', c: C.blue },
    { v: parts[1]||'', label:'Нэрлэсэн код', c: C.indigo },
    { v: parts[2]||'', label:'Бүтээгдэхүүний төрөл', c: C.amber },
    { v: parts[3]||'', label:'Төлөгдөх огноо', c: C.green },
  ];
  return (
    <div style={{ position:'absolute', inset:0, zIndex: 40 }}>
      <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(5,11,31,.45)' }}/>
      <div style={{ position:'absolute', left:0, right:0, bottom:0, background:'#fff', borderRadius:'24px 24px 0 0', boxShadow:'0 -10px 40px -16px rgba(15,20,55,.4)', maxHeight:'92%', display:'flex', flexDirection:'column' }}>
        <div style={{ width: 40, height: 5, borderRadius: 999, background: C.line, margin:'10px auto 8px', flexShrink:0 }}/>
        <div style={{ overflow:'auto', padding:'6px 22px 16px' }}>
          <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
            <div style={{ width: 46, height: 46, borderRadius: 13, background: item.c||C.indigo, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight: 800, fontSize: 18, flexShrink:0 }}>{(item.issuer||'').charAt(0)}</div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.ink, letterSpacing:'-0.01em' }}>{item.issuer}</div>
              <div style={{ fontSize: 11, color: C.muted2, fontWeight: 600, fontFamily: MONO }}>{item.ticker}</div>
            </div>
          </div>

          <div style={{ marginTop: 18, fontSize: 11, fontWeight: 800, color: C.muted, textTransform:'uppercase', letterSpacing:'0.06em' }}>Тикерийн бүтэц</div>
          <div style={{ marginTop: 12, display:'flex', gap: 10, justifyContent:'center', flexWrap:'wrap' }}>
            {segs.map((sg, i) => (
              <div key={i} style={{ textAlign:'center' }}>
                <div style={{ fontSize: 17, fontWeight: 800, color: C.ink, fontFamily: MONO, letterSpacing:'0.02em' }}>{sg.v}</div>
                <div style={{ height: 3, borderRadius: 2, background: sg.c, marginTop: 6 }}/>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, display:'flex', flexDirection:'column', gap: 9 }}>
            {segs.map((sg, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap: 10 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: sg.c, flexShrink:0 }}/>
                <span style={{ fontSize: 12, color: C.text, fontWeight: 600, flex:1 }}>{sg.label}</span>
                <span style={{ fontSize: 12, color: C.ink, fontWeight: 700, fontFamily: MONO }}>{sg.v}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 18, background:'#FAFBFE', borderRadius: 16, border:`1px solid ${C.line2}`, overflow:'hidden' }}>
            {[
              { l:'Бүтээгдэхүүний төрөл', v: item.typeName },
              { l:'Гаргасан огноо', v: item.issued },
              { l:'Төлөгдөх огноо', v: item.maturityDate },
              { l:'Нэрлэсэн үр шим', v: item.rate+'% /жил' },
            ].map((r, i) => (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 14px', borderTop: i ? `1px solid ${C.line2}` : 'none' }}>
                <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 600 }}>{r.l}</span>
                <span style={{ fontSize: 13, color: C.ink, fontWeight: 700, fontVariantNumeric:'tabular-nums' }}>{r.v}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12, background: C.amberSoft, border:`1px solid #FFE9C4`, borderRadius: 14, padding: 13, display:'flex', gap: 10 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:1 }}><path d="M12 8v5M12 16h.01" stroke={C.amber} strokeWidth="2.2" strokeLinecap="round"/><circle cx="12" cy="12" r="9" stroke={C.amber} strokeWidth="2"/></svg>
            <div style={{ fontSize: 11, color:'#7A5A1F', lineHeight: 1.5 }}>Бодит өгөөж нь зах зээлийн нөхцлөөс хамаарч өөрчлөгдөж болзошгүй. Өнгөрсөн үеийн өгөөж ирээдүйн үр дүнг баталгаажуулахгүй.</div>
          </div>
        </div>
        <div style={{ flexShrink:0, padding:'12px 22px 20px', borderTop:`1px solid ${C.line2}`, display:'flex', flexDirection:'column', gap: 10, background:'#fff' }}>
          <button style={{ width:'100%', height: 50, borderRadius: 14, background: C.indigo, color:'#fff', border:'none', fontWeight: 700, fontSize: 15, cursor:'pointer', boxShadow:'0 8px 22px -8px rgba(79,70,229,.5)' }}>Авах</button>
          <button onClick={onClose} style={{ width:'100%', height: 46, borderRadius: 14, background:'transparent', color: C.muted, border:`1px solid ${C.line}`, fontWeight: 700, fontSize: 14, cursor:'pointer' }}>Хаах</button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// 09 — TRADING / MARKETPLACE
// ============================================================

/* ----- referenced sibling screens ----- */
const Home = ({ activeTab='home', onNav, loanState='active', label='10 — Home / Dashboard', signMethod='gsign', showLockSheet=false, portfolio='filled' }) => {
  const [eduVideo, setEduVideo] = useState(null);
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
          <button onClick={() => onNav && onNav('notifications')} style={{
            width: 40, height: 40, borderRadius: 12, background:'#fff', border:`1px solid ${C.line}`,
            display:'flex', alignItems:'center', justifyContent:'center', position:'relative', cursor:'pointer',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9z" stroke={C.ink} strokeWidth="2" strokeLinejoin="round" fill="none"/><path d="M10 21a2 2 0 004 0" stroke={C.ink} strokeWidth="2" strokeLinecap="round"/></svg>
            <span style={{ position:'absolute', top: 8, right: 9, width: 8, height: 8, borderRadius: 999, background: C.orange, border: '2px solid #fff' }}/>
          </button>
          <button onClick={() => onNav && onNav('profile')} style={{
            width: 40, height: 40, borderRadius: 12, border:'none', cursor:'pointer',
            background: `linear-gradient(135deg, ${C.indigo}, ${C.blue})`,
            display:'flex', alignItems:'center', justifyContent:'center',
            color:'#fff', fontWeight: 800, fontSize: 14,
          }}>T</button>
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
                  Хэтэвч цэнэглэх
                </button>
              </div>
            </div>
          </div>
        ) : (
          <EarningsHero/>
        )}

        {portfolio !== 'empty' && <HomeAllocCard/>}

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
          <span style={{ fontSize: 12, color: C.indigo, fontWeight: 700, cursor:'pointer' }} onClick={() => onNav && onNav('trade')}>Бүгд →</span>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12, marginTop: 14 }}>
          {products.map((p, i) => {
            const locked = signMethod === 'esign' && p.trust;
            return (
            <div key={i} onClick={locked ? () => setLockSheet(true) : () => onNav && onNav('trade')} style={{
              background:'#fff', borderRadius: 20, padding: 10, border: `1px solid ${C.line2}`,
              position:'relative', cursor: 'pointer',
            }}>
              <div style={{ opacity: locked ? 0.55 : 1 }}>
                {/* soft aurora — the calm, dreamy hero of the card */}
                <div style={{
                  height: 104, borderRadius: 16, position:'relative', overflow:'hidden',
                  background:'linear-gradient(160deg, #FCFCFE 0%, #F3F5FC 100%)',
                }}>
                  <div style={{ position:'absolute', width: 116, height: 116, borderRadius:'50%', filter:'blur(28px)', background: p.c1, opacity: 0.40, top: -26, left: -18 }}/>
                  <div style={{ position:'absolute', width: 100, height: 100, borderRadius:'50%', filter:'blur(30px)', background: p.c2, opacity: 0.32, bottom: -30, right: -14 }}/>
                  <div style={{ position:'absolute', width: 66, height: 66, borderRadius:'50%', filter:'blur(22px)', background:'#fff', opacity: 0.62, top: 28, right: 32 }}/>
                  {locked && (
                    <div style={{ position:'absolute', top: 10, right: 10, width: 28, height: 28, borderRadius: 10, background:'rgba(255,255,255,.86)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke={C.navy} strokeWidth="2" fill="none"/><path d="M8 11V8a4 4 0 018 0v3" stroke={C.navy} strokeWidth="2" fill="none"/></svg>
                    </div>
                  )}
                </div>
                <div style={{ padding:'0 4px' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, marginTop: 13, lineHeight: 1.3, letterSpacing:'-0.01em', minHeight: 36 }}>{p.t}</div>
                  <div style={{ fontSize: 12.5, color: C.muted, fontWeight: 600, marginTop: 5, fontVariantNumeric:'tabular-nums' }}>
                    <span style={{ color: C.text, fontWeight: 700 }}>{p.y}</span> өгөөж
                  </div>
                </div>
              </div>
              {locked && (
                <div style={{ margin:'10px 4px 2px', display:'inline-flex', alignItems:'center', gap: 5, padding:'4px 9px', borderRadius: 999, background: C.amberSoft, color: C.amber, fontSize: 10, fontWeight: 800 }}>
                  <Dot color={C.amber}/>G-Sign
                </div>
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
            <div key={i} onClick={()=>onNav && onNav('newsDetail')} style={{
              padding: '14px 14px', display:'flex', gap: 12, alignItems:'center', cursor:'pointer',
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

        <EducationSection onOpenVideo={setEduVideo} onNav={onNav}/>

        <div style={{ height: 12 }}/>
      </div>

      <BottomTabs active={activeTab} onNav={onNav}/>

      {eduVideo && <EduVideoModal card={eduVideo} onClose={()=>setEduVideo(null)}/>}

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

const Trading = ({ activeTab='trade', onNav }) => {
  const chips = ['Бүгд','Сертификат','Итгэлцэл','Нэхэмжлэх','Арилжааны бичиг'];
  const [active, setActive] = useState(0);
  const [secSort, setSecSort] = useState('yield');
  const [sortOpen, setSortOpen] = useState(false);
  const [tk, setTk] = useState(null);

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
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginTop: 2 }}>Шинэ гаргалт · {primary.length} нээлттэй</div>
          </div>
          <span style={{ fontSize: 12, color: C.indigo, fontWeight: 700, cursor:'pointer' }} onClick={()=>onNav && onNav('primaryMarket')}>Бүгд →</span>
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
            <SecCard key={i} s={augSec(s)} variant="trade" badge onOpen={setTk}/>
          ))}
        </div>
        <div style={{ height: 12 }}/>
      </div>

      <SortSheet open={sortOpen} value={secSort} onClose={()=>setSortOpen(false)} onPick={(k)=>{ setSecSort(k); setSortOpen(false); }}/>
      <TickerSheet item={tk} onClose={()=>setTk(null)}/>
      <BottomTabs active={activeTab} onNav={onNav}/>
    </Frame>
  );
};

// ============================================================
// 26 — PRIMARY MARKET (Анхдагч зах) — full listing + type filters
// ============================================================

const Category = () => {
  const [seg, setSeg] = useState(0); // 0 primary, 1 secondary
  const [secSort, setSecSort] = useState('yield');
  const [sortOpen, setSortOpen] = useState(false);
  const [tk, setTk] = useState(null);
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
      <BackBar title="Итгэлцэл"/>

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
              <SecCard key={i} s={augSec(s)} variant="cat" onOpen={setTk}/>
            ))}
          </div>
        )}
        <div style={{ height: 8 }}/>
      </div>
      <SortSheet open={sortOpen} value={secSort} onClose={()=>setSortOpen(false)} onPick={(k)=>{ setSecSort(k); setSortOpen(false); }}/>
      <TickerSheet item={tk} onClose={()=>setTk(null)}/>
    </Frame>
  );
};

// ============================================================
// 11 — INSTRUMENT DETAIL
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
      <div style={{ padding:'6px 24px 12px', flexShrink:0 }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: C.ink, letterSpacing:'-0.02em' }}>Мэдээ мэдээлэл</div>
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
        <div onClick={()=>onNav && onNav('newsDetail')} style={{
          borderRadius: 22, overflow:'hidden', cursor:'pointer',
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
            <div key={i} onClick={()=>onNav && onNav('newsDetail')} style={{ background:'#fff', borderRadius: 16, padding: 14, border:`1px solid ${C.line2}`, display:'flex', gap: 12, cursor:'pointer' }}>
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
// 29A — NEWS DETAIL (opens when a news card is tapped)
// ============================================================

const Loan = ({ activeTab='loan', onNav, multi=false }) => {
  const daysTotal = 30, daysLeft = 24;
  const daysElapsed = daysTotal - daysLeft;
  const elapsedPct = Math.round((daysElapsed / daysTotal) * 100);
  const L_PRINCIPAL = 3000000, L_DAILY = 2500;
  const L_ACCRUED  = daysElapsed * L_DAILY;
  const L_PAYOFF   = L_PRINCIPAL + L_ACCRUED;
  const L_MATURITY = L_PRINCIPAL + L_DAILY * daysTotal;
  const lf = (n) => n.toLocaleString('en-US');
  const [showList, setShowList] = useState(multi);
  const loanCards = [
    { id:'LN-2026-04823', payoff:'3,015,000', principal:'3,000,000', daysTotal:30, daysLeft:24, due:'2026-06-28', status:'Хэвийн', tone:'new' },
    { id:'LN-2026-05110', payoff:'1,510,000', principal:'1,500,000', daysTotal:30, daysLeft:8,  due:'2026-07-12', status:'Хэвийн', tone:'new' },
  ];
  if (showList) {
    return (
      <Frame label="30L — Loan list">
        <div style={{ padding:'6px 24px 12px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: C.ink, letterSpacing:'-0.02em' }}>Зээл</div>
          <button style={{ width: 40, height: 40, borderRadius: 12, background:'#fff', border:`1px solid ${C.line}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="1.5" fill={C.ink}/><circle cx="12" cy="5" r="1.5" fill={C.ink}/><circle cx="12" cy="19" r="1.5" fill={C.ink}/></svg>
          </button>
        </div>
        <div style={{ flex: 1, overflow:'auto', padding: '0 24px 16px' }}>
          <div style={{ fontSize: 12, color: C.muted, fontWeight: 700, letterSpacing:'0.04em', textTransform:'uppercase', marginBottom: 12 }}>{loanCards.length} идэвхтэй зээл</div>
          <div style={{ display:'flex', flexDirection:'column', gap: 12 }}>
            {loanCards.map((L, i) => (
              <button key={i} onClick={() => setShowList(false)} style={{
                width:'100%', textAlign:'left', display:'block', background:'#fff', border:`1px solid ${C.line2}`,
                borderRadius: 18, padding: 16, cursor:'pointer',
              }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background:`linear-gradient(135deg, ${C.navy}, ${C.indigo})`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="18" height="12" rx="2" stroke="#fff" strokeWidth="2" fill="none"/><path d="M3 11h18" stroke="#fff" strokeWidth="2"/></svg>
                    </div>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 800, color: C.ink, letterSpacing:'-0.01em' }}>Богино хугацааны зээл</div>
                      <div style={{ fontSize: 10.5, color: C.muted, marginTop: 2, fontFamily:'JetBrains Mono, monospace', letterSpacing:'0.02em' }}>{L.id}</div>
                    </div>
                  </div>
                  <Badge tone={L.tone}>{L.status}</Badge>
                </div>
                <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginTop: 14 }}>
                  <div>
                    <div style={{ fontSize: 10.5, color: C.muted, fontWeight: 600 }}>Өнөөдөр төлж хаах</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: C.ink, fontVariantNumeric:'tabular-nums', letterSpacing:'-0.02em', marginTop: 2 }}>₮ {L.payoff}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize: 10.5, color: C.muted, fontWeight: 600 }}>Үлдсэн</div>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: C.indigo, fontVariantNumeric:'tabular-nums', marginTop: 2 }}>{L.daysLeft} хоног</div>
                  </div>
                </div>
                <div style={{ marginTop: 12, height: 6, borderRadius: 999, background: C.line2, overflow:'hidden' }}>
                  <div style={{ width: Math.round(((L.daysTotal - L.daysLeft) / L.daysTotal) * 100) + '%', height:'100%', borderRadius: 999, background:`linear-gradient(90deg, ${C.indigo}, ${C.blue})` }}/>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', marginTop: 8, fontSize: 10.5, color: C.muted, fontWeight: 600, fontVariantNumeric:'tabular-nums' }}>
                  <span>Үндсэн ₮ {L.principal}</span>
                  <span>Дуусах {L.due}</span>
                </div>
              </button>
            ))}
          </div>

          <div style={{ marginTop: 18, fontSize: 12, color: C.muted, fontWeight: 700, letterSpacing:'0.04em', textTransform:'uppercase' }}>Шинэ зээл</div>
          <button onClick={() => onNav && onNav('loanEntry')} style={{
            width:'100%', marginTop: 10, textAlign:'left', display:'flex', alignItems:'center', gap: 14, padding: 16,
            background:'#fff', border:`1px solid ${C.line2}`, borderRadius: 18, cursor:'pointer',
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: C.indigoSoft, display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={C.indigo} strokeWidth="2.4" strokeLinecap="round"/></svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.ink, letterSpacing:'-0.01em' }}>Дахин зээл хүсэх</div>
              <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2, lineHeight: 1.4 }}>Идэвхтэй зээлтэй ч шинэ хүсэлт илгээх боломжтой</div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0 }}><path d="M9 6l6 6-6 6" stroke={C.muted2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>

          <div style={{ height: 8 }}/>
        </div>
        <BottomTabs active={activeTab} onNav={onNav}/>
      </Frame>
    );
  }
  return (
    <Frame label="30 — Loan / Зээл">
      <div style={{ padding:'6px 24px 12px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
          {multi && (
            <button data-nodrag onClick={()=>setShowList(true)} style={{ width: 40, height: 40, borderRadius: 12, background:'#fff', border:`1px solid ${C.line}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke={C.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          )}
          <div style={{ fontSize: 24, fontWeight: 800, color: C.ink, letterSpacing:'-0.02em' }}>Зээл</div>
        </div>
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
            <div style={{ fontSize: 12, opacity: .7, marginTop: 16 }}>Өнөөдөр төлж хаах дүн</div>
            <div style={{ fontSize: 34, fontWeight: 800, letterSpacing:'-0.02em', fontVariantNumeric:'tabular-nums', marginTop: 2 }}>
              ₮ {lf(L_PAYOFF)}
            </div>
            {/* Countdown to single due date */}
            <div style={{ marginTop: 16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize: 11, opacity:.7, marginBottom: 6 }}>
                <span>{daysElapsed} / {daysTotal} хоног</span>
                <span style={{ fontVariantNumeric:'tabular-nums' }}>{daysLeft} хоног үлдлээ</span>
              </div>
              <div style={{ height: 6, borderRadius: 999, background:'rgba(255,255,255,.15)', overflow:'hidden' }}>
                <div style={{ width: elapsedPct+'%', height:'100%', borderRadius: 999, background:'linear-gradient(90deg, #7FF3C2, #2D6BFF)' }}/>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10, marginTop: 18 }}>
              <div style={{ background:'rgba(255,255,255,.06)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,.1)', borderRadius: 12, padding: 12 }}>
                <div style={{ fontSize: 10, opacity: .6, fontWeight: 600 }}>Дуусах огноо</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4, fontVariantNumeric:'tabular-nums' }}>2026-06-28</div>
                <div style={{ fontSize: 10, opacity: .65, marginTop: 2 }}>Сүүлчийн хугацаа</div>
              </div>
              <div style={{ background:'rgba(255,255,255,.06)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,.1)', borderRadius: 12, padding: 12 }}>
                <div style={{ fontSize: 10, opacity: .6, fontWeight: 600 }}>Хүү</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4, fontVariantNumeric:'tabular-nums' }}>2.5 % / 30 хоног</div>
                <div style={{ fontSize: 10, opacity: .65, marginTop: 2 }}>Үндсэн ₮ 3,000,000</div>
              </div>
            </div>
          </div>
        </div>

        <button onClick={() => onNav && onNav('payoffConfirm')} style={{ width:'100%', height: 52, borderRadius: 14, background: C.indigo, color:'#fff', border:'none', fontWeight: 700, fontSize: 15, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap: 8, boxShadow:'0 8px 22px -8px rgba(79,70,229,.5)', marginTop: 14 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Зээл төлж хаах
        </button>

        {/* Payoff breakdown — accrues daily */}
        <div style={{ marginTop: 18, fontSize: 12, color: C.muted, fontWeight: 700, letterSpacing:'0.04em', textTransform:'uppercase' }}>Төлбөрийн мэдээлэл</div>
        <div style={{ marginTop: 10, background:'#fff', borderRadius: 18, border:`1px solid ${C.line2}`, overflow:'hidden' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'13px 16px', borderBottom:`1px solid ${C.line2}` }}>
            <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 600 }}>Үндсэн зээл</span>
            <span style={{ fontSize: 13.5, color: C.ink, fontWeight: 700, fontVariantNumeric:'tabular-nums' }}>₮ {lf(L_PRINCIPAL)}</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'13px 16px', borderBottom:`1px solid ${C.line2}` }}>
            <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 600 }}>Хуримтлагдсан хүү ({daysElapsed} хоног)</span>
            <span style={{ fontSize: 13.5, color: C.ink, fontWeight: 700, fontVariantNumeric:'tabular-nums' }}>₮ {lf(L_ACCRUED)}</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'15px 16px', background:'#FAFBFE' }}>
            <span style={{ fontSize: 13, color: C.ink, fontWeight: 800 }}>Өнөөдөр төлж хаах</span>
            <span style={{ fontSize: 18, color: C.indigo, fontWeight: 800, fontVariantNumeric:'tabular-nums', letterSpacing:'-0.01em' }}>₮ {lf(L_PAYOFF)}</span>
          </div>
        </div>
        <div style={{ marginTop: 12, display:'flex', gap: 10, alignItems:'flex-start', padding: 13, borderRadius: 12, background: C.indigoSoft }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop: 1 }}><circle cx="12" cy="12" r="9" stroke={C.indigo} strokeWidth="2" fill="none"/><path d="M12 8v.5M12 11v5" stroke={C.indigo} strokeWidth="2" strokeLinecap="round"/></svg>
          <div style={{ fontSize: 12, color: C.ink, lineHeight: 1.5 }}>
            Хүү өдөр бүр хуримтлагдана. Эрт төлж хаавал нийт хүү бага. Дуусах өдөр (2026-06-28) төлбөл нийт <strong>₮ {lf(L_MATURITY)}</strong>.
          </div>
        </div>

        {/* Disbursement history */}
        <div style={{ marginTop: 18, fontSize: 12, color: C.muted, fontWeight: 700, letterSpacing:'0.04em', textTransform:'uppercase' }}>Олголтын түүх</div>
        <div style={{ marginTop: 10, background:'#fff', borderRadius: 18, border:`1px solid ${C.line2}`, overflow:'hidden' }}>
          {[
            { t:'Зээл олгогдсон', d:'2026.05.29 · 14:21', sub:'Хэтэвчинд шилжсэн', v:'+ ₮ 3,000,000', tone: C.green, soft: C.greenSoft, up:true },
            { t:'ЗМС лавлагааны төлбөр', d:'2026.05.29 · 14:18', sub:'QPay', v:'− ₮ 4,000', tone: C.muted, soft:'#F4F5F9', up:false },
          ].map((h, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap: 12, padding:'13px 16px', borderTop: i ? `1px solid ${C.line2}` : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: h.soft, display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>
                {h.up
                  ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M6 13l6 6 6-6" stroke={h.tone} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  : <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke={h.tone} strokeWidth="2" fill="none"/><path d="M12 8.5v7M10 10.5h3a1.5 1.5 0 010 3h-2a1.5 1.5 0 000 3h3" stroke={h.tone} strokeWidth="1.6" strokeLinecap="round"/></svg>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{h.t}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2, fontVariantNumeric:'tabular-nums' }}>{h.d} · {h.sub}</div>
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: h.tone, fontVariantNumeric:'tabular-nums', flexShrink: 0 }}>{h.v}</div>
            </div>
          ))}
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
              <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>Хүссэн үедээ төлж хаах боломжтой</div>
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="4" y="5" width="16" height="16" rx="3" stroke={C.muted} strokeWidth="2" fill="none"/><path d="M8 3v4M16 3v4M4 10h16" stroke={C.muted} strokeWidth="2" strokeLinecap="round"/></svg>
            Идэвхтэй зээлтэй зэрэгцэн шинэ зээлийн хүсэлт илгээх боломжтой. Өдөрт нэг удаа.
          </div>
        </div>

        {/* Request another loan — allowed alongside an active loan */}
        <div style={{ marginTop: 18, fontSize: 12, color: C.muted, fontWeight: 700, letterSpacing:'0.04em', textTransform:'uppercase' }}>Шинэ зээл</div>
        <button onClick={() => onNav && onNav('loanEntry')} style={{
          width:'100%', marginTop: 10, textAlign:'left', display:'flex', alignItems:'center', gap: 14, padding: 16,
          background:'#fff', border:`1px solid ${C.line2}`, borderRadius: 18, cursor:'pointer',
        }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: C.indigoSoft, display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={C.indigo} strokeWidth="2.4" strokeLinecap="round"/></svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.ink, letterSpacing:'-0.01em' }}>Дахин зээл хүсэх</div>
            <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2, lineHeight: 1.4 }}>Идэвхтэй зээлтэй ч шинэ хүсэлт илгээх боломжтой</div>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0 }}><path d="M9 6l6 6-6 6" stroke={C.muted2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        <div style={{ height: 8 }}/>
      </div>

      <BottomTabs active={activeTab} onNav={onNav}/>
    </Frame>
  );
};

// ============================================================
// 19 — LOAN ELIGIBILITY · KYC CHECK
// ============================================================

/* ----- this screen ----- */
const NewsDetail = ({ onNav, article }) => {
  const a = article || {
    tag: 'Арилжааны бичиг',
    date: '2026-04-10',
    title: 'Арилжааны бичгийн анхдагч арилжаа зарлагдсан тухай',
    lead: 'Монголын мөнгөний зах зээлд арилжааны бичиг (Commercial Paper)-ийн анхны арилжаа албан ёсоор зарлагдлаа.',
    body: [
      'Энэхүү бүтээгдэхүүн нь богино хугацаатай, өндөр өгөөжтэй хөрөнгө оруулалтын хэрэгсэл бөгөөд хөрөнгө оруулагчид мөнгөн хөрөнгөө уян хатан удирдах боломжийг олгоно.',
      'Анхдагч зах зээлийн арилжаа нь тогтсон нэрлэсэн үнэ, хүүтэй явагдах бөгөөд хөрөнгө оруулагч хүссэн ширхэгээ сонгон худалдан авах боломжтой. Арилжаа дуусмагц бүтээгдэхүүн таны багцад нэмэгдэнэ.',
    ],
    facts: [
      { l: 'Үнэт цаас гаргагч', v: 'Капитрон Банк ХК' },
      { l: 'Нэрлэсэн хүү /жилийн/', v: '14.50%' },
      { l: 'Хугацаа', v: '12 сар' },
      { l: 'Нэрлэсэн үнэ', v: '100,000 ₮' },
    ],
  };
  return (
    <Frame label="29A — News detail">
      <BackBar title="Мэдээ" right={
        <button style={{ width: 40, height: 40, borderRadius: 12, background:'#fff', border:`1px solid ${C.line}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="6" cy="12" r="2.4" stroke={C.ink} strokeWidth="2"/><circle cx="18" cy="6" r="2.4" stroke={C.ink} strokeWidth="2"/><circle cx="18" cy="18" r="2.4" stroke={C.ink} strokeWidth="2"/><path d="M8.2 10.9l7.6-3.8M8.2 13.1l7.6 3.8" stroke={C.ink} strokeWidth="2"/></svg>
        </button>
      }/>
      <div style={{ flex: 1, overflow:'auto', padding:'0 24px 16px' }}>
        {/* banner image placeholder */}
        <div style={{ borderRadius: 18, overflow:'hidden', height: 168, position:'relative', background:`linear-gradient(135deg, ${C.navy}, ${C.indigo})` }}>
          <div style={{ position:'absolute', right:-30, top:-30, width: 130, height: 130, borderRadius:'50%', background:'rgba(255,107,44,.35)' }}/>
          <div style={{ position:'absolute', left:28, bottom:-26, width: 86, height: 86, borderRadius:'50%', border:'2px solid rgba(255,255,255,.25)' }}/>
          <div style={{ position:'absolute', left:'46%', top:'30%', width: 40, height: 40, background:'rgba(255,255,255,.14)', transform:'rotate(45deg)' }}/>
          <div style={{ position:'absolute', left: 14, bottom: 12, fontFamily:"'JetBrains Mono', monospace", fontSize: 10, color:'rgba(255,255,255,.55)' }}>// мэдээний зураг</div>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap: 10, marginTop: 16 }}>
          <Badge tone="info">{a.tag}</Badge>
          <span style={{ fontSize: 11.5, color: C.muted, fontWeight: 600, fontVariantNumeric:'tabular-nums' }}>{a.date}</span>
        </div>

        <div style={{ fontSize: 21, fontWeight: 800, color: C.ink, marginTop: 12, letterSpacing:'-0.02em', lineHeight: 1.25, textWrap:'pretty' }}>{a.title}</div>

        <div style={{ fontSize: 14, color: C.ink, marginTop: 12, lineHeight: 1.6, fontWeight: 600 }}>{a.lead}</div>
        {a.body.map((p, i) => (
          <div key={i} style={{ fontSize: 13.5, color: C.text, marginTop: 12, lineHeight: 1.7 }}>{p}</div>
        ))}

        {/* key facts */}
        <div style={{ marginTop: 18, background:'#fff', borderRadius: 16, border:`1px solid ${C.line2}`, overflow:'hidden' }}>
          <div style={{ padding:'12px 14px 8px', fontSize: 11, fontWeight: 800, color: C.muted, textTransform:'uppercase', letterSpacing:'0.08em' }}>Үндсэн мэдээлэл</div>
          {a.facts.map((r, i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap: 14, padding:'12px 14px', borderTop:`1px solid ${C.line2}` }}>
              <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 600 }}>{r.l}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.ink, fontVariantNumeric:'tabular-nums' }}>{r.v}</span>
            </div>
          ))}
        </div>
        <div style={{ height: 8 }}/>
      </div>
      <div style={{ padding:'12px 24px 16px', borderTop:`1px solid ${C.line2}`, background:'#fff', flexShrink: 0 }}>
        <button onClick={()=>onNav && onNav('trade')} style={{ width:'100%', height: 52, borderRadius: 14, background: C.indigo, color:'#fff', border:'none', fontWeight: 700, fontSize: 15, cursor:'pointer', boxShadow:'0 8px 22px -8px rgba(79,70,229,.5)', display:'flex', alignItems:'center', justifyContent:'center', gap: 8 }}>
          Холбогдох бүтээгдэхүүн үзэх
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </Frame>
  );
};

// ============================================================
// 29B — EDUCATION ARTICLE (blog detail — reuses the detail template)
// ============================================================

(window.__MMF_SCREENS = window.__MMF_SCREENS || {}).NewsDetail = NewsDetail;
})();