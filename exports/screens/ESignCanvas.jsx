/* =========================================================================
   Money Market Fund — Mobile App · Screen: ESignCanvas
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

const FooterCTA = ({ children, dark = false, onClick }) => (
  <div style={{ padding:'12px 24px 6px', background:'#fff', borderTop:`1px solid ${C.line2}`, flexShrink: 0 }}>
    <button onClick={onClick} style={{
      width:'100%', height: 52, borderRadius: 14,
      background: dark ? C.ink : C.indigo, color:'#fff', border:'none',
      fontWeight: 700, fontSize: 15, cursor:'pointer', letterSpacing:'-0.01em',
      display:'flex', alignItems:'center', justifyContent:'center', gap: 10,
      boxShadow: dark ? 'none' : '0 8px 22px -8px rgba(79,70,229,.5)',
    }}>{children}</button>
  </div>
);

// Generic, original G-Sign mark (NOT the government logo) — rounded square + ring/check glyph

/* ----- this screen ----- */
const ESignCanvas = () => {
  const canvasRef = useRef(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 2.6; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#0B1020';

    let drawing = false, last = null;
    const pos = (e) => {
      const r = canvas.getBoundingClientRect();
      const t = e.touches ? e.touches[0] : e;
      return { x: t.clientX - r.left, y: t.clientY - r.top };
    };
    const start = (e) => { drawing = true; last = pos(e); setDrawn(true); e.preventDefault(); };
    const move = (e) => {
      if (!drawing) return;
      const p = pos(e);
      ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke();
      last = p; e.preventDefault();
    };
    const end = () => { drawing = false; };
    canvas.addEventListener('pointerdown', start);
    canvas.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
    canvas._clear = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); setDrawn(false); };
    return () => {
      canvas.removeEventListener('pointerdown', start);
      canvas.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
    };
  }, []);

  const clear = () => { const c = canvasRef.current; if (c && c._clear) c._clear(); };

  return (
    <Frame label="15 — Цахим гарын үсэг">
      <BackBar title="Цахим гарын үсэг"/>
      <div style={{ flex: 1, overflow:'auto', padding: '8px 24px 20px', display:'flex', flexDirection:'column' }}>
        <div style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.5 }}>
          Доорх талбарт хуруугаараа гарын үсгээ зурна уу.
        </div>

        {/* canvas */}
        <div data-nodrag style={{ marginTop: 16, position:'relative', borderRadius: 18, background:'#fff', border:`1.5px solid ${C.line}`, overflow:'hidden' }}>
          <canvas ref={canvasRef} data-nodrag style={{ display:'block', width:'100%', height: 300, touchAction:'none', cursor:'crosshair' }}/>
          {/* baseline + placeholder */}
          <div style={{ position:'absolute', left: 24, right: 24, bottom: 64, height: 1, borderTop:`1.5px dashed ${C.line}`, pointerEvents:'none' }}/>
          <div style={{ position:'absolute', left: 24, bottom: 44, fontSize: 11, color: C.muted2, fontWeight: 600, pointerEvents:'none' }}>✕ Гарын үсэг</div>
          {!drawn && (
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
              <span style={{ fontSize: 16, color: C.muted2, fontWeight: 600 }}>Энд зурна уу</span>
            </div>
          )}
        </div>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: 12 }}>
          <button onClick={clear} style={{
            height: 40, padding:'0 16px', borderRadius: 12, background:'#fff', border:`1.5px solid ${C.line}`,
            color: C.ink, fontWeight: 700, fontSize: 13, cursor:'pointer', display:'inline-flex', alignItems:'center', gap: 8,
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" stroke={C.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Арилгах
          </button>
          <button style={{ height: 40, padding:'0 8px', background:'transparent', border:'none', color: C.indigo, fontWeight: 700, fontSize: 13, cursor:'pointer' }}>
            G-Sign-ээр зурах →
          </button>
        </div>
      </div>
      <FooterCTA>Гарын үсэг баталгаажуулах</FooterCTA>
    </Frame>
  );
};

// ============================================================
// 16 — ELECTRONIC SIGNATURE SUCCESS  [NEW]
// ============================================================

(window.__MMF_SCREENS = window.__MMF_SCREENS || {}).ESignCanvas = ESignCanvas;
})();