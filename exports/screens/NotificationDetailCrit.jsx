/* =========================================================================
   Money Market Fund — Mobile App · Screen: NotificationDetailCrit
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

const critIcon = (color) => <g stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3.5l9.5 16.5H2.5z"/><path d="M12 10v4M12 17.4h.01"/></g>;

// demo dataset

/* ----- referenced sibling screens ----- */
const NotificationDetail = ({ critical=false }) => (
  <Frame label={'Notification detail' + (critical ? ' · critical' : '')}>
    <BackBar title="Мэдэгдэл" right={
      <button style={{ width: 40, height: 40, borderRadius: 12, background:'#fff', border:`1px solid ${C.line}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="6" cy="12" r="2.4" stroke={C.ink} strokeWidth="2"/><circle cx="18" cy="6" r="2.4" stroke={C.ink} strokeWidth="2"/><circle cx="18" cy="18" r="2.4" stroke={C.ink} strokeWidth="2"/><path d="M8.2 10.9l7.6-3.8M8.2 13.1l7.6 3.8" stroke={C.ink} strokeWidth="2"/></svg>
      </button>
    }/>
    <div style={{ flex: 1, overflow:'auto', padding:'0 24px 16px' }}>
      {critical ? (
        <div style={{ marginTop: 6, background: C.redSoft, border:`1px solid #F7CFCF`, borderRadius: 16, padding: 16, display:'flex', gap: 12, alignItems:'flex-start' }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">{critIcon(C.red)}</svg>
          </div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: C.red }}>Шилжүүлэг амжилтгүй боллоо</div>
            <div style={{ fontSize: 12, color:'#9B2C2C', marginTop: 3, lineHeight: 1.5 }}>Гүйлгээ цуцлагдаж, мөнгө хэтэвчинд буцаагдсан. Үлдэгдэлд өөрчлөлт ороогүй.</div>
          </div>
        </div>
      ) : (
        <div style={{ borderRadius: 18, overflow:'hidden', height: 150, position:'relative', background:`linear-gradient(135deg, ${C.navy}, ${C.indigo})` }}>
          <div style={{ position:'absolute', right:-30, top:-30, width: 120, height: 120, borderRadius:'50%', background:'rgba(255,107,44,.35)' }}/>
          <div style={{ position:'absolute', left:28, bottom:-22, width: 80, height: 80, borderRadius:'50%', border:'2px solid rgba(255,255,255,.25)' }}/>
          <div style={{ position:'absolute', left:'44%', top:'28%', width: 38, height: 38, background:'rgba(255,255,255,.14)', transform:'rotate(45deg)' }}/>
          <div style={{ position:'absolute', left: 14, bottom: 12, fontFamily:"'JetBrains Mono', monospace", fontSize: 10, color:'rgba(255,255,255,.55)' }}>// баннер зураг</div>
        </div>
      )}

      <div style={{ display:'flex', alignItems:'center', gap: 10, marginTop: 16 }}>
        <Badge tone={critical ? 'sell' : 'info'}>{critical ? 'Систем' : 'Зар мэдээ'}</Badge>
        <span style={{ fontSize: 11.5, color: C.muted, fontWeight: 600, fontVariantNumeric:'tabular-nums' }}>2026-06-12 · {critical ? '09:12' : '10:24'}</span>
      </div>

      <div style={{ fontSize: 21, fontWeight: 800, color: C.ink, marginTop: 12, letterSpacing:'-0.02em', lineHeight: 1.25, textWrap:'pretty' }}>
        {critical ? 'Таны ₮ 1,000,000 шилжүүлэг амжилтгүй боллоо' : 'Шинэ хадгаламжийн сертификатын арилжаа нээлттэй боллоо'}
      </div>

      <div style={{ fontSize: 13.5, color: C.text, marginTop: 12, lineHeight: 1.7 }}>
        {critical
          ? 'Банк хооронд хийсэн шилжүүлэг гүйцэтгэгдэх явцад цуцлагдсан тул дүн таны хэтэвчинд бүрэн буцаагдсан болно. Та дансны мэдээллээ шалгаад дахин оролдох боломжтой. Асуудал давтагдвал дэмжлэгтэй холбогдоно уу.'
          : 'Капитрон Банк ХК шинэ хадгаламжийн сертификатын анхдагч арилжаагаа нээлээ. Нэрлэсэн үр шим жилийн 14.5%, хугацаа 12 сар. Та хүссэн дүнгээрээ хөрөнгө оруулалт хийх боломжтой. Арилжааны нөхцөл болон холбогдох мэдээллийг доорх товчоор үзнэ үү.'}
      </div>
    </div>
    <div style={{ padding:'12px 24px 16px', borderTop:`1px solid ${C.line2}`, background:'#fff', flexShrink: 0 }}>
      <button style={{ width:'100%', height: 52, borderRadius: 14, background: critical ? C.ink : C.indigo, color:'#fff', border:'none', fontWeight: 700, fontSize: 15, cursor:'pointer', boxShadow: critical ? 'none' : '0 8px 22px -8px rgba(79,70,229,.5)' }}>
        {critical ? 'Дахин оролдох' : 'Дэлгэрэнгүй үзэх'}
      </button>
    </div>
  </Frame>
);

/* ----- this screen ----- */
const NotificationDetailCrit = () => <NotificationDetail critical/>;

(window.__MMF_SCREENS = window.__MMF_SCREENS || {}).NotificationDetailCrit = NotificationDetailCrit;
})();