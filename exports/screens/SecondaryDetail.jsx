/* =========================================================================
   Money Market Fund — Mobile App · Screen: SecondaryDetail
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

const FlowHeader = ({ title, subtitle, badge, right }) => (
  <div style={{ flexShrink: 0, padding: '0 16px 12px 8px' }}>
    <div style={{ height: 56, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
      <button style={{
        width: 40, height: 40, borderRadius: 12, background:'#fff', border:`1px solid ${C.line}`,
        display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke={C.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <div style={{ width: 40, display:'flex', justifyContent:'flex-end' }}>{right}</div>
    </div>
    <div style={{ padding: '0 8px' }}>
      <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.ink, letterSpacing:'-0.02em', fontVariantNumeric:'tabular-nums' }}>{title}</div>
        {badge}
      </div>
      <div style={{ fontSize: 13, color: C.muted, fontWeight: 600, marginTop: 4 }}>{subtitle}</div>
    </div>
  </div>
);

// ---- Section card: titled group of label/value rows ----

const SectionCard = ({ eyebrow, rows, style }) => (
  <div style={{ background:'#fff', borderRadius: 18, border:`1px solid ${C.line2}`, padding: 4, ...style }}>
    {eyebrow && (
      <div style={{ padding: '12px 14px 8px', fontSize: 11, fontWeight: 800, color: C.muted, textTransform:'uppercase', letterSpacing:'0.08em' }}>{eyebrow}</div>
    )}
    {rows.map((r, i) => (
      <div key={i} style={{
        display:'flex', justifyContent:'space-between', alignItems:'baseline', gap: 14,
        padding: '12px 14px',
        borderTop: i > 0 ? `1px solid ${C.line2}` : 'none',
      }}>
        <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 600, flexShrink: 0 }}>{r.l}</span>
        <span style={{
          fontSize: r.big ? 15 : 13, fontWeight: r.big ? 800 : 700, textAlign:'right',
          color: r.tone || C.ink, fontVariantNumeric:'tabular-nums', letterSpacing: r.big ? '-0.01em' : 0,
        }}>{r.v}</span>
      </div>
    ))}
  </div>
);

const StickyBar = ({ children }) => (
  <div style={{ padding: '12px 24px 6px', background:'#fff', borderTop:`1px solid ${C.line2}`, flexShrink: 0 }}>
    {children}
  </div>
);

const BigBtn = ({ children, tone = C.indigo, disabled, onClick, ghost }) => (
  <button onClick={disabled ? undefined : onClick} style={{
    width:'100%', height: 52, borderRadius: 14, border: ghost ? `1.5px solid ${C.line}` : 'none',
    background: ghost ? '#fff' : (disabled ? '#C9CEDD' : tone),
    color: ghost ? C.ink : '#fff', fontWeight: 700, fontSize: 15, letterSpacing:'-0.01em',
    cursor: disabled ? 'default' : 'pointer',
    display:'flex', alignItems:'center', justifyContent:'center', gap: 8,
    boxShadow: (disabled || ghost) ? 'none' : `0 8px 22px -8px ${tone}80`,
    transition:'background .15s',
  }}>{children}</button>
);

// ---- Review scaffold: scroll body + consent + PIN + sticky enable-gated CTA ----

/* ----- this screen ----- */
const SecondaryDetail = () => (
  <Frame label="S2.1 — Secondary listing detail">
    <FlowHeader
      title="CAPIT 1450 CD 240227"
      subtitle="Хоёрдогч зах зээлийн санал"
    />
    <div style={{ flex: 1, overflow:'auto', padding: '0 24px 16px' }}>
      {/* hero — actual yield is the headline for secondary */}
      <div style={{ borderRadius: 22, padding: 20, background:`linear-gradient(135deg, ${C.navy} 0%, ${C.indigo} 130%)`, color:'#fff', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', right:-30, bottom:-50, width:160, height:160, borderRadius:'50%', background:'radial-gradient(circle, rgba(45,107,255,.45), transparent 70%)'}}/>
        <div style={{ position:'relative' }}>
          <div style={{ fontSize: 11, opacity:.7, fontWeight: 600, letterSpacing:'0.06em' }}>БОДИТ ӨГӨӨЖ</div>
          <div style={{ display:'flex', alignItems:'baseline', gap: 6, marginTop: 6 }}>
            <span style={{ fontSize: 48, fontWeight: 800, letterSpacing:'-0.03em', fontVariantNumeric:'tabular-nums' }}>15.2</span>
            <span style={{ fontSize: 18, opacity:.8 }}>% / жил</span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 10, marginTop: 18 }}>
            {[['Худалдан авах үнэ','100,000 ₮'],['Үлдсэн хугацаа','278 хоног'],['Боломжит','7 ш']].map((x,i)=>(
              <div key={i}>
                <div style={{ fontSize: 9.5, opacity:.6, fontWeight: 600 }}>{x[0]}</div>
                <div style={{ fontSize: 12.5, fontWeight: 700, marginTop: 3, fontVariantNumeric:'tabular-nums' }}>{x[1]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <SectionCard eyebrow="Бүтээгдэхүүний нөхцөл" rows={[
          { l:'Тикер', v:'CAPIT 1450 CD 240227' },
          { l:'Нэрлэсэн үнэ', v:'100,000 MNT' },
          { l:'Нэрлэсэн хүү /жилийн/', v:'14.50%' },
          { l:'Хүү төлөх давтамж', v:'Хугацааны эцэст' },
          { l:'Сүүлд хүү төлөгдсөн огноо', v:'2026-02-24' },
          { l:'Дуусах хүртлэх хугацаа', v:'278 хоног' },
          { l:'Төлөгдөх огноо', v:'2027-02-24' },
          { l:'Боломжит ширхэг', v:'7 ширхэг' },
        ]}/>
      </div>

      <div style={{ marginTop: 14, background: C.blueSoft, borderRadius: 14, padding: 14, display:'flex', gap: 10 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{flexShrink:0, marginTop:1}}><circle cx="12" cy="12" r="9" stroke={C.blue} strokeWidth="2"/><path d="M12 11v5M12 8h.01" stroke={C.blue} strokeWidth="2.2" strokeLinecap="round"/></svg>
        <div style={{ fontSize: 12, color:'#1E40AF', lineHeight: 1.5 }}>Энэ нь өөр хэрэглэгчийн байршуулсан зарах санал. Худалдан авах үнэ болон бодит өгөөж нь анхдагч нөхцөлөөс ялгаатай.</div>
      </div>
      <div style={{ height: 8 }}/>
    </div>
    <StickyBar><BigBtn>Авах</BigBtn></StickyBar>
  </Frame>
);

// ---------- 2.2 — Secondary buy setup ----------

(window.__MMF_SCREENS = window.__MMF_SCREENS || {}).SecondaryDetail = SecondaryDetail;
})();