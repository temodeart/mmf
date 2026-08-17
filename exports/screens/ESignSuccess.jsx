/* =========================================================================
   Money Market Fund — Mobile App · Screen: ESignSuccess
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

/* ----- this screen ----- */
const ESignSuccess = () => (
  <Frame label="16 — Цахим · Амжилттай">
    <div style={{ height: 44, flexShrink: 0 }}/>
    <div style={{ flex: 1, overflow:'auto', padding: '8px 24px 20px', display:'flex', flexDirection:'column' }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', paddingTop: 8 }}>
        <div style={{
          width: 88, height: 88, borderRadius: 28, position:'relative',
          background:`linear-gradient(135deg, ${C.indigo}, ${C.blue})`,
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'0 18px 40px -12px rgba(79,70,229,.55)',
        }}>
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{ fontSize: 23, fontWeight: 800, color: C.ink, marginTop: 20, letterSpacing:'-0.02em', lineHeight: 1.15 }}>
          Гэрээ амжилттай<br/>баталгаажлаа
        </div>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 10, lineHeight: 1.55, maxWidth: 290 }}>
          Цахим гарын үсгээр баталгаажуулсан тул танд дараах бүтээгдэхүүн нээгдлээ.
        </div>
      </div>

      {/* available products */}
      <div style={{ marginTop: 20, fontSize: 11, fontWeight: 800, color: C.muted, textTransform:'uppercase', letterSpacing:'0.08em' }}>Бүтээгдэхүүн</div>
      <div style={{ marginTop: 10, background:'#fff', borderRadius: 16, border:`1px solid ${C.line2}`, overflow:'hidden' }}>
        {[
          { t:'Хадгаламжийн сертификат', ok:true },
          { t:'Нэхэмжлэх', ok:true },
          { t:'Арилжааны бичиг', ok:true },
          { t:'Итгэлцэл', ok:false },
        ].map((p, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap: 12, padding:'12px 14px', borderTop: i ? `1px solid ${C.line2}` : 'none', background: p.ok ? '#fff' : '#FAFBFE' }}>
            {p.ok
              ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill={C.greenSoft}/><path d="M8 12l3 3 5-6" stroke={C.green} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              : <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#F0F1F6"/><rect x="8.5" y="11" width="7" height="5.5" rx="1.4" stroke={C.muted2} strokeWidth="1.7"/><path d="M9.7 11V9.6a2.3 2.3 0 014.6 0V11" stroke={C.muted2} strokeWidth="1.7"/></svg>}
            <div style={{ flex: 1, fontSize: 13.5, fontWeight: 700, color: p.ok ? C.ink : C.muted2 }}>{p.t}</div>
            {!p.ok && (
              <span style={{ fontSize: 11, fontWeight: 700, color: C.amber, background: C.amberSoft, padding:'4px 9px', borderRadius: 999 }}>Боломжгүй</span>
            )}
          </div>
        ))}
      </div>

      {/* locked Trust service */}
      <div style={{ marginTop: 14, background:'#FFFBF2', borderRadius: 16, border:`1px solid #FFE9C4`, padding: 14, display:'flex', gap: 12, alignItems:'flex-start' }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background:'#FFF1D6', flexShrink: 0, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke={C.amber} strokeWidth="2"/><path d="M8 11V8a4 4 0 018 0v3" stroke={C.amber} strokeWidth="2"/></svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 800, color:'#5E4413' }}>Итгэлцэл — түгжээтэй</div>
          <div style={{ fontSize: 12, color:'#7A5A1F', marginTop: 4, lineHeight: 1.5 }}>
            Цахим гарын үсгээр Итгэлцэл ашиглах боломжгүй. Идэвхжүүлэхийн тулд G-Sign баталгаажуулалт хийнэ үү.
          </div>
        </div>
      </div>
    </div>
    <div style={{ padding:'12px 24px 6px', background:'#fff', borderTop:`1px solid ${C.line2}`, flexShrink: 0, display:'flex', flexDirection:'column', gap: 8 }}>
      <button style={{
        width:'100%', height: 52, borderRadius: 14, background: C.indigo, color:'#fff', border:'none',
        fontWeight: 700, fontSize: 15, cursor:'pointer', boxShadow:'0 8px 22px -8px rgba(79,70,229,.5)',
        display:'flex', alignItems:'center', justifyContent:'center', gap: 10,
      }}>
        Данс баталгаажуулах
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <button style={{ width:'100%', height: 48, borderRadius: 14, background:'transparent', color: C.indigo, border:'none', fontWeight: 700, fontSize: 14, cursor:'pointer' }}>
        G-Sign-ээр баталгаажуулах
      </button>
    </div>
  </Frame>
);

// ============================================================
// 17 — G-SIGN REQUEST  [NEW]
// ============================================================

(window.__MMF_SCREENS = window.__MMF_SCREENS || {}).ESignSuccess = ESignSuccess;
})();