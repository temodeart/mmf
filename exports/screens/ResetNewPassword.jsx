/* =========================================================================
   Money Market Fund — Mobile App · Screen: ResetNewPassword
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

const PwField = ({ label, value, onChange, show, onToggle, error, placeholder }) => (
  <div>
    <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginBottom: 8 }}>{label}</div>
    <div style={{
      height: 52, borderRadius: 14, background:'#fff',
      border:`1.5px solid ${error ? C.red : value ? C.indigo : C.line}`,
      boxShadow: value && !error ? `0 0 0 4px ${C.indigoSoft}` : 'none',
      padding:'0 8px 0 16px', display:'flex', alignItems:'center', gap: 8,
    }}>
      <input
        type={show ? 'text' : 'password'} value={value} onChange={(e)=>onChange(e.target.value)}
        placeholder={placeholder}
        style={{ flex: 1, minWidth: 0, border:'none', outline:'none', background:'transparent', fontSize: 15, fontWeight: 600, color: C.ink, fontFamily:'inherit', letterSpacing: show ? 0 : '0.12em' }}
      />
      <button onClick={onToggle} style={{ width: 38, height: 38, borderRadius: 10, border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>
        {show
          ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke={C.muted} strokeWidth="2" fill="none"/><circle cx="12" cy="12" r="3" stroke={C.muted} strokeWidth="2" fill="none"/></svg>
          : <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke={C.muted2} strokeWidth="2" fill="none"/><path d="M4 4l16 16" stroke={C.muted2} strokeWidth="2" strokeLinecap="round"/></svg>}
      </button>
    </div>
  </div>
);

/* module aliases (reset_password.jsx) */
const useStateRP = React.useState;

const ResetIntro = ({ glyph, title, sub }) => (
  <div style={{ marginTop: 8 }}>
    <div style={{
      width: 56, height: 56, borderRadius: 16, background: C.indigoSoft,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {glyph}
    </div>
    <div style={{ fontSize: 26, fontWeight: 800, color: C.ink, marginTop: 18, letterSpacing: '-0.02em', lineHeight: 1.12 }}>
      {title}
    </div>
    <div style={{ fontSize: 13.5, color: C.muted, marginTop: 10, lineHeight: 1.5, maxWidth: 320 }}>
      {sub}
    </div>
  </div>
);

const KeyGlyph = (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <circle cx="8" cy="9" r="4.5" stroke={C.indigo} strokeWidth="2"/>
    <path d="M11 12l8 8M16 17l2-2M18 19l2-2" stroke={C.indigo} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ============================================================
// R1 — RESET · Enter phone (no code sent yet)
// ============================================================

/* ----- this screen ----- */
const ResetNewPassword = () => {
  const [pw, setPw] = useStateRP('');
  const [pw2, setPw2] = useStateRP('');
  const [show, setShow] = useStateRP(false);
  const [show2, setShow2] = useStateRP(false);
  const rules = [
    { label: '8+ тэмдэгт', ok: pw.length >= 8 },
    { label: '1 том үсэг', ok: /[A-ZА-ЯӨҮ]/.test(pw) },
    { label: '1 тоо', ok: /\d/.test(pw) },
    { label: '1 тусгай тэмдэгт', ok: /[^A-Za-zА-Яа-яӨҮөү0-9]/.test(pw) },
  ];
  const allOk = rules.every(r => r.ok);
  const mismatch = pw2.length > 0 && pw !== pw2;
  const valid = allOk && pw2.length > 0 && pw === pw2;
  return (
    <Frame label="R3 — Reset · New password">
      <BackBar title=""/>
      <div style={{ flex: 1, overflow: 'auto', padding: '0 24px 24px' }}>
        <ResetIntro
          glyph={KeyGlyph}
          title="Шинэ нууц үг үүсгэх"
          sub="Хуучин нууц үгнээс ялгаатай, шинэ нууц үгээ оруулна уу."
        />

        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <PwField label="Шинэ нууц үг" value={pw} onChange={setPw} show={show} onToggle={() => setShow(s => !s)} placeholder="Шинэ нууц үгээ оруулна уу"/>
          <PwField label="Нууц үг давтах" value={pw2} onChange={setPw2} show={show2} onToggle={() => setShow2(s => !s)} error={mismatch} placeholder="Шинэ нууц үгээ давтан оруулна уу"/>
        </div>

        {mismatch && (
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: C.red }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={C.red} strokeWidth="2"/><path d="M12 7.5v5.5M12 16.5h.01" stroke={C.red} strokeWidth="2.2" strokeLinecap="round"/></svg>
            Нууц үг таарахгүй байна
          </div>
        )}

        <div style={{ marginTop: 18, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {rules.map((r, i) => (
            <div key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 12px', borderRadius: 999,
              background: r.ok ? C.greenSoft : '#F4F6FA', color: r.ok ? C.green : C.muted,
              fontSize: 12, fontWeight: 700, transition: 'all .15s',
            }}>
              {r.ok
                ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke={C.green} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                : <span style={{ width: 11, height: 11, borderRadius: 999, border: `2px solid ${C.muted2}` }}/>}
              {r.label}
            </div>
          ))}
        </div>
      </div>
      <FooterCTA>
        <span style={{ opacity: valid ? 1 : .6 }}>Нууц үг шинэчлэх</span>
      </FooterCTA>
    </Frame>
  );
};

// ============================================================
// R4 — RESET · Success
// ============================================================

(window.__MMF_SCREENS = window.__MMF_SCREENS || {}).ResetNewPassword = ResetNewPassword;
})();