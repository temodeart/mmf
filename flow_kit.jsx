// ============================================================
// Trading Flow Kit — shared building blocks for the 3 product flows
// Reuses tokens (C), Frame, BackBar, Badge from screens.jsx
// and TransactionPin / PinDots / Keypad from onboarding_v2.jsx.
// All copy in Mongolian Cyrillic. Mobile-native, 390×844.
// ============================================================

// ---- Contextual flow header: back · title · subtitle · optional action ----
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

const EyebrowLabel = ({ children, color }) => (
  <div style={{ fontSize: 11, fontWeight: 800, color: color || C.muted, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom: 10 }}>{children}</div>
);

// ---- Product summary mini-card ----
const ProductMini = ({ letter, color = C.indigo, name, sub, right }) => (
  <div style={{ background:'#fff', borderRadius: 16, padding: 14, border:`1px solid ${C.line2}`, display:'flex', alignItems:'center', gap: 12 }}>
    <div style={{ width: 44, height: 44, borderRadius: 12, background: color, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight: 800, flexShrink: 0 }}>{letter}</div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, letterSpacing:'-0.01em' }}>{name}</div>
      <div style={{ fontSize: 11, color: C.muted, marginTop: 3, fontWeight: 600, fontVariantNumeric:'tabular-nums' }}>{sub}</div>
    </div>
    {right && <div style={{ textAlign:'right', flexShrink: 0 }}>{right}</div>}
  </div>
);

// ---- Quantity stepper ----
const QtyStepper = ({ value, setValue, max, unit = 'ширхэг' }) => {
  const clamp = (n) => Math.max(1, Math.min(max, n || 1));
  const pct = max > 1 ? ((value - 1) / (max - 1)) * 100 : 0;
  const btn = (label, fn, disabled) => (
    <button onClick={disabled ? undefined : fn} style={{
      width: 44, height: 44, borderRadius: 12, flexShrink: 0,
      background: disabled ? '#F4F6FA' : '#fff', border:`1.5px solid ${C.line}`,
      color: disabled ? C.muted2 : C.ink, fontSize: 22, fontWeight: 600,
      display:'flex', alignItems:'center', justifyContent:'center', cursor: disabled ? 'default' : 'pointer',
    }}>{label}</button>
  );
  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
        {btn('–', () => setValue(Math.max(1, value - 1)), value <= 1)}
        <div style={{
          flex: 1, height: 52, borderRadius: 14, background:'#FAFBFE', border:`1.5px solid ${C.line}`,
          display:'flex', alignItems:'center', justifyContent:'center', gap: 6,
        }}>
          <input
            type="text" inputMode="numeric" data-nodrag value={value}
            onChange={(e) => setValue(clamp(parseInt((e.target.value || '').replace(/[^0-9]/g, ''), 10)))}
            style={{
              width: 78, border:'none', background:'transparent', textAlign:'right', outline:'none',
              fontFamily:'inherit', fontSize: 22, fontWeight: 800, color: C.ink, fontVariantNumeric:'tabular-nums',
              padding: 0,
            }}/>
          <span style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>{unit}</span>
        </div>
        {btn('+', () => setValue(Math.min(max, value + 1)), value >= max)}
      </div>
      <div style={{ marginTop: 16 }}>
        <input
          type="range" className="loan-range" min={1} max={max} value={value} data-nodrag
          onChange={(e) => setValue(clamp(parseInt(e.target.value, 10)))}
          style={{ background: `linear-gradient(90deg, ${C.indigo} ${pct}%, ${C.line} ${pct}%)` }}/>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop: 8, fontSize: 11.5, fontWeight: 600, color: C.muted }}>
          <span>1 {unit}</span>
          <span>Дээд: <span style={{ color: C.ink, fontWeight: 700 }}>{max} {unit}</span></span>
        </div>
      </div>
    </div>
  );
};

// ---- Consent checkbox (stateful) ----
const Consent = ({ checked, onToggle, children }) => (
  <div data-nodrag onClick={onToggle} style={{ display:'flex', gap: 12, alignItems:'flex-start', cursor:'pointer', padding: '2px 0' }}>
    <div style={{
      width: 22, height: 22, borderRadius: 7, flexShrink: 0, marginTop: 1,
      background: checked ? C.indigo : '#fff', border:`1.5px solid ${checked ? C.indigo : C.line}`,
      display:'flex', alignItems:'center', justifyContent:'center', transition:'all .15s',
    }}>
      {checked && <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-10" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </div>
    <div style={{ fontSize: 12.5, color: C.text, lineHeight: 1.5, fontWeight: 500 }}>{children}</div>
  </div>
);

// TransactionPin is defined in onboarding_v2.jsx and exported to window.
// ReviewScaffold uses it directly as a global.

// ---- Sticky bottom CTA bar ----
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
const ReviewScaffold = ({ children, consentLabel, ctaLabel, ctaTone = C.indigo }) => {
  const [consent, setConsent] = useState(false);
  return (
    <>
      <div style={{ flex: 1, overflow:'auto', padding: '0 24px 16px', display:'flex', flexDirection:'column', gap: 14 }}>
        {children}

        {/* consent */}
        <div style={{ background:'#FAFBFE', borderRadius: 16, padding: 14, border:`1px solid ${C.line2}` }}>
          <Consent checked={consent} onToggle={() => setConsent(c => !c)}>{consentLabel}</Consent>
        </div>

        <div style={{ height: 4 }}/>
      </div>
      <StickyBar>
        <BigBtn tone={ctaTone} disabled={!consent}>{ctaLabel}</BigBtn>
        {!consent && (
          <div style={{ fontSize: 11, color: C.muted2, fontWeight: 600, textAlign:'center', marginTop: 8 }}>
            Зөвшөөрөл өгч үргэлжлүүлнэ үү
          </div>
        )}
      </StickyBar>
    </>
  );
};

// ---- Dedicated PIN-confirmation screen — its own step, kept clean (no order wall above) ----
const PinConfirm = ({ label, title = 'Гүйлгээний ПИН код', heading = 'ПИН кодоо оруулна уу', subtitle, amount, amountLabel = 'Гүйлгээний дүн', ctaLabel = 'Баталгаажуулах', ctaTone = C.indigo, onConfirm }) => {
  const [pinFilled, setPinFilled] = useState(false);
  return (
    <Frame label={label}>
      <BackBar title={title}/>
      <div style={{ flex: 1, overflow:'auto', padding: '4px 24px 16px', display:'flex', flexDirection:'column' }}>
        <div style={{ fontSize: 21, fontWeight: 800, color: C.ink, letterSpacing:'-0.02em', lineHeight: 1.2 }}>{heading}</div>
        {subtitle && <div style={{ fontSize: 12.5, color: C.muted, marginTop: 8, lineHeight: 1.5 }}>{subtitle}</div>}
        {amount && (
          <div style={{ marginTop: 16, background:'#FAFBFE', borderRadius: 16, border:`1px solid ${C.line2}`, padding:'14px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', gap: 12 }}>
            <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 600 }}>{amountLabel}</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: C.ink, fontVariantNumeric:'tabular-nums', letterSpacing:'-0.01em' }}>{amount}</span>
          </div>
        )}
        <div style={{ flex: 1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', paddingTop: 12, minHeight: 12 }}>
          <TransactionPin onFilled={() => setPinFilled(true)}/>
        </div>
      </div>
      <StickyBar>
        <BigBtn tone={ctaTone} disabled={!pinFilled} onClick={onConfirm}>{ctaLabel}</BigBtn>
        {!pinFilled && (
          <div style={{ fontSize: 11, color: C.muted2, fontWeight: 600, textAlign:'center', marginTop: 8 }}>
            ПИН кодоо оруулж баталгаажуулна уу
          </div>
        )}
      </StickyBar>
    </Frame>
  );
};

// ---- Success screen template ----
const SuccessScreen = ({ label, title, subtitle, rows, primaryCta, secondaryCta, tone = C.green }) => (
  <Frame label={label}>
    <div style={{ flex: 1, overflow:'auto', padding: '0 24px', display:'flex', flexDirection:'column' }}>
      <div style={{ height: 24 }}/>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', padding: '20px 0 8px' }}>
        <div style={{
          width: 84, height: 84, borderRadius: 999, background: `${tone}1A`,
          display:'flex', alignItems:'center', justifyContent:'center', marginBottom: 22,
        }}>
          <div style={{ width: 58, height: 58, borderRadius: 999, background: tone, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 10px 24px -8px ${tone}80` }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.ink, letterSpacing:'-0.02em', lineHeight: 1.2, maxWidth: 300 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 13.5, color: C.muted, marginTop: 10, lineHeight: 1.5, maxWidth: 300, fontWeight: 500 }}>{subtitle}</div>}
      </div>

      <div style={{ marginTop: 18 }}>
        <SectionCard rows={rows}/>
      </div>
      <div style={{ flex: 1 }}/>
    </div>
    <StickyBar>
      <div style={{ display:'flex', flexDirection:'column', gap: 10 }}>
        <BigBtn>{primaryCta}</BigBtn>
        <BigBtn ghost>{secondaryCta}</BigBtn>
      </div>
    </StickyBar>
  </Frame>
);

// ---- Edge-state screen template (icon + title + desc + optional rows + CTAs) ----
const StateScreen = ({ label, tone, glyph, title, desc, rows, primaryCta, secondaryCta, primaryTone }) => (
  <Frame label={label}>
    <BackBar title=""/>
    <div style={{ flex: 1, overflow:'auto', padding: '0 24px', display:'flex', flexDirection:'column' }}>
      <div style={{ height: 12 }}/>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', padding: '20px 0 8px' }}>
        <div style={{ width: 84, height: 84, borderRadius: 999, background: `${tone}1A`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom: 22 }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">{glyph(tone)}</svg>
        </div>
        <div style={{ fontSize: 21, fontWeight: 800, color: C.ink, letterSpacing:'-0.02em', lineHeight: 1.25, maxWidth: 300 }}>{title}</div>
        {desc && <div style={{ fontSize: 13.5, color: C.muted, marginTop: 10, lineHeight: 1.55, maxWidth: 300, fontWeight: 500 }}>{desc}</div>}
      </div>
      {rows && <div style={{ marginTop: 16 }}><SectionCard rows={rows}/></div>}
      <div style={{ flex: 1 }}/>
    </div>
    <StickyBar>
      <div style={{ display:'flex', flexDirection:'column', gap: 10 }}>
        <BigBtn tone={primaryTone || C.indigo}>{primaryCta}</BigBtn>
        {secondaryCta && <BigBtn ghost>{secondaryCta}</BigBtn>}
      </div>
    </StickyBar>
  </Frame>
);

// glyph helpers for state screens
const Glyphs = {
  wallet: (c) => (<><rect x="3" y="6" width="18" height="13" rx="3" stroke={c} strokeWidth="2"/><path d="M16 12h2" stroke={c} strokeWidth="2.4" strokeLinecap="round"/><path d="M3 9h18" stroke={c} strokeWidth="2"/></>),
  empty:  (c) => (<><rect x="4" y="5" width="16" height="14" rx="3" stroke={c} strokeWidth="2"/><path d="M8 12h8" stroke={c} strokeWidth="2.4" strokeLinecap="round"/></>),
  ban:    (c) => (<><circle cx="12" cy="12" r="9" stroke={c} strokeWidth="2"/><path d="M6 6l12 12" stroke={c} strokeWidth="2.4" strokeLinecap="round"/></>),
  refresh:(c) => (<><path d="M20 11a8 8 0 10-1.5 5.5M20 5v4h-4" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></>),
  warn:   (c) => (<><path d="M12 8v5M12 17h.01" stroke={c} strokeWidth="2.6" strokeLinecap="round"/><circle cx="12" cy="12" r="9" stroke={c} strokeWidth="2"/></>),
  retry:  (c) => (<><path d="M3 12a9 9 0 109-9 9 9 0 00-6.5 2.8L3 8m0-5v5h5" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></>),
};
