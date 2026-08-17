/* =========================================================================
   Money Market Fund — Mobile App · Screen: OwnedDetail
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

const ownedStatusCfg = {
  default: { dot: C.green,  text:'Хэвийн' },
  onsale:  { dot: C.amber,  text:'Зарагдаж байгаа' },
  soon:    { dot: C.orange, text:'Хугацаа дуусах дөхсөн' },
};

const ownedData = {
  default: { days: 278, accrued: 3734,  current: 103734 },
  onsale:  { days: 278, accrued: 3734,  current: 103734 },
  soon:    { days: 5,   accrued: 12650, current: 112650 },
};

/* ----- this screen ----- */
const OwnedDetail = ({ state='default' }) => {
  const st = ownedStatusCfg[state] || ownedStatusCfg.default;
  const d = ownedData[state] || ownedData.default;
  const fmtO = (n) => n.toLocaleString('en-US');
  return (
    <Frame label={'L3.1 — Owned detail · ' + state}>
      <FlowHeader title="CAPIT 1450 CD" subtitle="Миний багц · эзэмшиж буй бүтээгдэхүүн"/>
      <div style={{ flex: 1, overflow:'auto', padding: '0 24px 16px' }}>
        {/* navy gradient hero */}
        <div style={{ borderRadius: 22, padding: 20, background:`linear-gradient(135deg, ${C.navy} 0%, ${C.navy3} 100%)`, color:'#fff', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', right:-40, top:-40, width: 160, height: 160, borderRadius:'50%', background:'radial-gradient(circle, rgba(45,107,255,.4), transparent 70%)'}}/>
          <div style={{ position:'relative' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap: 10 }}>
              <div style={{ display:'flex', alignItems:'center', gap: 12, minWidth: 0 }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: C.blue, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight: 800, fontSize: 18, flexShrink: 0 }}>К</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>Капитрон Банк ХХК</div>
                  <div style={{ fontSize: 11, opacity:.65, marginTop: 2, fontWeight: 600 }}>Сертификат · CAPIT 1450 CD</div>
                </div>
              </div>
              <span style={{ display:'inline-flex', alignItems:'center', gap: 5, padding:'5px 10px', borderRadius: 999, background:'rgba(255,255,255,.14)', border:'1px solid rgba(255,255,255,.2)', fontSize: 10.5, fontWeight: 700, flexShrink: 0, whiteSpace:'nowrap' }}>
                <span style={{ width: 7, height: 7, borderRadius: 999, background: st.dot }}/>{st.text}
              </span>
            </div>
            <div style={{ fontSize: 11, opacity:.7, marginTop: 18, fontWeight: 600 }}>Одоогийн үнэ цэнэ</div>
            <div style={{ fontSize: 32, fontWeight: 800, letterSpacing:'-0.02em', marginTop: 2, fontVariantNumeric:'tabular-nums' }}>₮ {fmtO(d.current)}</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10, marginTop: 16 }}>
              <div style={{ background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.12)', borderRadius: 12, padding: 12 }}>
                <div style={{ fontSize: 10, opacity:.6, fontWeight: 600 }}>Хуримтлагдсан үр шим</div>
                <div style={{ fontSize: 16, fontWeight: 800, marginTop: 4, color:'#7FF3C2', fontVariantNumeric:'tabular-nums' }}>+ ₮ {fmtO(d.accrued)}</div>
              </div>
              <div style={{ background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.12)', borderRadius: 12, padding: 12 }}>
                <div style={{ fontSize: 10, opacity:.6, fontWeight: 600 }}>Эзэмшиж буй</div>
                <div style={{ fontSize: 16, fontWeight: 800, marginTop: 4, fontVariantNumeric:'tabular-nums' }}>1 ширхэг</div>
              </div>
            </div>
          </div>
        </div>

        {/* status-specific note */}
        {state === 'onsale' && (
          <div style={{ marginTop: 14, background: C.amberSoft, border:`1px solid #FFE9C4`, borderRadius: 16, padding: 14, display:'flex', gap: 12, alignItems:'flex-start' }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3.5 7.5h17l-1.4 12.2a1 1 0 01-1 .8H5.9a1 1 0 01-1-.8L3.5 7.5z" stroke={C.amber} strokeWidth="2" strokeLinejoin="round"/><path d="M8.5 7.5V6a3.5 3.5 0 017 0v1.5" stroke={C.amber} strokeWidth="2"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color:'#5E4413' }}>Хоёрдогч зах зээлд зарагдаж байна</div>
              <div style={{ fontSize: 11.5, color:'#7A5A1F', marginTop: 3, lineHeight: 1.5 }}>Зарах үнэ <strong>100,000 ₮</strong> · Зарласан 2026-05-18</div>
            </div>
          </div>
        )}
        {state === 'soon' && (
          <div style={{ marginTop: 14, background: C.greenSoft, border:`1px solid ${C.green}22`, borderRadius: 16, padding: 14, display:'flex', gap: 12, alignItems:'center' }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 7v5l3 2" stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="9" stroke={C.green} strokeWidth="2"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: C.ink }}>Удахгүй төлөгдөнө · {d.days} хоног</div>
              <div style={{ fontSize: 11.5, color: C.muted, marginTop: 3, lineHeight: 1.5 }}>Хугацааны эцэст <strong style={{ color: C.ink }}>113,050 ₮</strong> хэтэвчинд шилжинэ.</div>
            </div>
          </div>
        )}

        {/* key facts */}
        <div style={{ marginTop: 14 }}>
          <SectionCard eyebrow="Бүтээгдэхүүний мэдээлэл" rows={[
            { l:'Нэрлэсэн үнэ', v:'100,000 MNT' },
            { l:'Нэрлэсэн үр шим /жилийн/', v:'14.50%' },
            { l:'Гаргасан огноо', v:'2026-05-22' },
            { l:'Төлөгдөх огноо', v:'2027-02-24' },
            { l:'Үлдсэн хугацаа', v: d.days + ' хоног', tone: state === 'soon' ? C.orange : undefined },
            { l:'Тоо ширхэг', v:'1 ширхэг' },
            { l:'Хугацааны эцэст авах дүн', v:'113,050 MNT', tone: C.green },
          ]}/>
        </div>

        {/* required disclaimer */}
        <div style={{ marginTop: 14, background: C.amberSoft, border:`1px solid #FFE9C4`, borderRadius: 14, padding: 14, display:'flex', gap: 10 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop: 1 }}><path d="M12 8v5M12 16h.01" stroke={C.amber} strokeWidth="2.2" strokeLinecap="round"/><circle cx="12" cy="12" r="9" stroke={C.amber} strokeWidth="2"/></svg>
          <div style={{ fontSize: 11.5, color:'#7A5A1F', lineHeight: 1.55 }}>
            Үнэт цаасны зах зээл дэх хөрөнгө оруулалт эрсдэлтэй. Өнгөрсөн үеийн өгөөж ирээдүйн үр дүнг баталгаажуулахгүй. Энэ бүтээгдэхүүн нь банкны хадгаламжийн даатгалд хамаарахгүй.
          </div>
        </div>

        <div style={{ height: 8 }}/>
      </div>
      <StickyBar>
        <div style={{ display:'flex', flexDirection:'column', gap: 10 }}>
          {state === 'onsale'
            ? <BigBtn tone={C.red}>Зарах захиалга цуцлах</BigBtn>
            : <BigBtn>Хоёрдогч зах зээлд зарах</BigBtn>}
          <BigBtn ghost>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" stroke={C.ink} strokeWidth="1.8" strokeLinejoin="round"/><path d="M14 3v5h5M9 13h6M9 17h4" stroke={C.ink} strokeWidth="1.8" strokeLinecap="round"/></svg>
            Гэрээ харах
          </BigBtn>
        </div>
      </StickyBar>
    </Frame>
  );
};

// ---------- 3.5 — Contract viewer (PDF-style document) ----------

(window.__MMF_SCREENS = window.__MMF_SCREENS || {}).OwnedDetail = OwnedDetail;
})();