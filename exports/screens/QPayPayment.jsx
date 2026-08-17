/* =========================================================================
   Money Market Fund — Mobile App · Screen: QPayPayment
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

/* module aliases (loan_eligibility.jsx) */
const useStateLE = React.useState;
const FrameLE = Frame;
const CLE = C;
const BackBarLE = BackBar;
const DotLE = Dot;
const LogoMarkLE = LogoMark;

const LEFooter = ({ children, secondary, onSecondary, dark = false, disabled = false }) => (
  <div style={{ padding:'12px 24px 6px', background:'#fff', borderTop:`1px solid ${CLE.line2}`, flexShrink: 0, display:'flex', flexDirection:'column', gap: 8 }}>
    <button disabled={disabled} style={{
      width:'100%', height: 52, borderRadius: 14, border:'none', cursor: disabled ? 'default' : 'pointer',
      background: disabled ? '#E7E9F2' : (dark ? CLE.ink : CLE.indigo),
      color: disabled ? CLE.muted2 : '#fff',
      fontWeight: 700, fontSize: 15, letterSpacing:'-0.01em',
      display:'flex', alignItems:'center', justifyContent:'center', gap: 10,
      boxShadow: (disabled || dark) ? 'none' : '0 8px 22px -8px rgba(79,70,229,.5)',
      transition:'background .15s',
    }}>{children}</button>
    {secondary && (
      <button onClick={onSecondary} style={{ width:'100%', height: 48, borderRadius: 14, background:'transparent', color: CLE.muted, border:'none', fontWeight: 700, fontSize: 14, cursor:'pointer' }}>{secondary}</button>
    )}
  </div>
);

const QrPlaceholder = ({ size = 168 }) => {
  // deterministic pseudo-QR pattern (placeholder, not a scannable code)
  const n = 21, cell = size / n;
  let seed = 7;
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return (seed >> 8) / 0x7fffff % 1; };
  const isFinder = (r, c) => (
    (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7)
  );
  const rects = [];
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    if (isFinder(r, c)) continue;
    if (rnd() > 0.52) rects.push(<rect key={r+'-'+c} x={c*cell} y={r*cell} width={cell} height={cell} fill={CLE.ink}/>);
  }
  const finder = (gx, gy) => (
    <g transform={`translate(${gx*cell},${gy*cell})`}>
      <rect x="0" y="0" width={cell*7} height={cell*7} fill={CLE.ink}/>
      <rect x={cell} y={cell} width={cell*5} height={cell*5} fill="#fff"/>
      <rect x={cell*2} y={cell*2} width={cell*3} height={cell*3} fill={CLE.ink}/>
    </g>
  );
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display:'block' }}>
      <rect width={size} height={size} fill="#fff"/>
      {rects}
      {finder(0,0)}{finder(n-7,0)}{finder(0,n-7)}
    </svg>
  );
};

/* ----- this screen ----- */
const QPayPayment = () => {
  const banks = [
    { n:'Хаан банк', c:'#0E5F2E', a:'ХБ' },
    { n:'Голомт банк', c:'#0B2A6B', a:'ГБ' },
    { n:'Худалдаа хөгжлийн банк', c:'#1F3A8A', a:'ХХ' },
    { n:'Төрийн банк', c:'#0E7490', a:'ТБ' },
  ];
  return (
    <FrameLE label="35 — QPay Payment">
      <BackBarLE title="Төлбөр төлөх"/>
      <div style={{ flex: 1, overflow:'auto', padding: '6px 24px 24px' }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: CLE.ink, letterSpacing:'-0.02em', lineHeight: 1.18 }}>
          Төлбөр төлөх
        </div>
        <div style={{ fontSize: 13.5, color: CLE.muted, marginTop: 8, lineHeight: 1.5 }}>
          QPay ашиглан ЗМС лавлагааны төлбөрөө төлнө үү.
        </div>

        {/* amount */}
        <div style={{ marginTop: 16, background:'#FAFBFE', borderRadius: 16, border:`1px solid ${CLE.line2}`, padding: 16, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: CLE.muted }}>Төлөх дүн</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: CLE.ink, fontVariantNumeric:'tabular-nums', letterSpacing:'-0.02em' }}>₮ 4,000</div>
        </div>

        {/* QR */}
        <div style={{ marginTop: 16, background:'#fff', borderRadius: 18, border:`1px solid ${CLE.line2}`, padding: 18, textAlign:'center' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap: 8 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background:'#0A66C2', color:'#fff', fontSize: 11, fontWeight: 800, display:'flex', alignItems:'center', justifyContent:'center' }}>Q</div>
            <span style={{ fontSize: 13, fontWeight: 800, color: CLE.ink }}>QPay</span>
          </div>
          <div style={{ display:'inline-block', marginTop: 14, padding: 12, borderRadius: 14, border:`1px solid ${CLE.line2}` }}>
            <QrPlaceholder size={160}/>
          </div>
          <div style={{ fontSize: 12, color: CLE.muted, marginTop: 12, fontWeight: 600 }}>QR код уншуулж төлөх</div>
        </div>

        {/* banks */}
        <div style={{ marginTop: 18, fontSize: 12, color: CLE.muted, fontWeight: 700, letterSpacing:'0.04em', textTransform:'uppercase' }}>Банкны апп сонгох</div>
        <div style={{ marginTop: 10, display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10 }}>
          {banks.map((b, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap: 10, padding:'12px 12px', borderRadius: 14, background:'#fff', border:`1px solid ${CLE.line2}`, cursor:'pointer' }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: b.c, color:'#fff', fontWeight: 800, fontSize: 12, display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>{b.a}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: CLE.ink, lineHeight: 1.2 }}>{b.n}</div>
            </div>
          ))}
        </div>
      </div>
      <LEFooter secondary="Буцах">Төлбөр шалгах</LEFooter>
    </FrameLE>
  );
};

// ============================================================
// 36–39 — PAYMENT STATUS (4 states)
// ============================================================

(window.__MMF_SCREENS = window.__MMF_SCREENS || {}).QPayPayment = QPayPayment;
})();