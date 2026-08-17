// comp_atoms.jsx — MMF Web · Pass 01
// Primitives: T, WebDot, WebBadge, WebButton, WebTextInput,
//             WebSparkline, WebEmptyState, WebErrorState, WebSkeletonBlock
// <script type="text/babel" src="comp_atoms.jsx"></script>

const { useState: _useStateAtoms } = React;

/* ── Design token constants (mirrors colors_and_type.css :root) ── */
const T = {
  indigo: '#4F46E5', indigoSoft: '#EEF0FE', indigoBorder: '#DDDAFB',
  blue: '#2D6BFF',  blueSoft: '#E7EEFF',
  pos: '#0E9F6E',   posSoft: '#E3F5EE',   posBorder: '#BFE9D8',
  neg: '#DC2626',   negSoft: '#FDECEC',   negBorder: '#F5C9C9',
  warn: '#B7791F',  warnSoft: '#FFF3D6',  warnBorder: '#FFE9C4', warnSurface: '#FFFBF2',
  ink: '#0B1020', text: '#2A3052', muted: '#6B7191', muted2: '#6E7492', /* R11: darkened for AA contrast (was #9099B5, 2.8:1) */
  surface: '#FFFFFF', bg: '#F4F6FA', field: '#FAFBFE',
  line: '#E7E9F2', line2: '#EFF1F8', navy: '#050B1F',
  BADGE: {
    new:       { fg: '#0E9F6E', bg: '#E3F5EE' },
    active:    { fg: '#B7791F', bg: '#FFF3D6' },
    pending:   { fg: '#2D6BFF', bg: '#E7EEFF' },
    filled:    { fg: '#4F46E5', bg: '#EEF0FE' },
    cancelled: { fg: '#6B7191', bg: '#EFF1F8' },
    sell:      { fg: '#DC2626', bg: '#FDECEC' },
    buy:       { fg: '#2D6BFF', bg: '#E7EEFF' },
    info:      { fg: '#4F46E5', bg: '#EEF0FE' },
    default:   { fg: '#6B7191', bg: '#EFF1F8' },
  },
};

/* ── OrderStatusBadge — the ONE shared order-status pill (Шинэ/Идэвхтэй/
   Хүлээгдэж буй/Биелсэн/Цуцлагдсан). Reads window.MMF_ORDER_STATUS
   (mmf_status.js) so home orders, wallet ledger, and the trade market
   all render the identical label + tone for a given status key. ── */
const OrderStatusBadge = ({ status, size }) => {
  const meta = (window.MMF_ORDER_STATUS && window.MMF_ORDER_STATUS[status]) || { label: status, tone: 'default' };
  return <WebBadge tone={meta.tone} size={size}>{meta.label}</WebBadge>;
};

/* ── WebDot ─── color, size=7 */
const WebDot = ({ color, size = 7 }) => (
  <span style={{ display:'inline-block', width:size, height:size, borderRadius:999, background:color, flexShrink:0 }}/>
);

/* ── WebBadge ─── tone: new|active|pending|sell|buy|info  size: sm|md */
const WebBadge = ({ tone = 'default', size = 'sm', children }) => {
  const m = T.BADGE[tone] || T.BADGE.default;
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:5,
      padding: size === 'md' ? '4px 10px' : '3px 8px', borderRadius:999,
      background:m.bg, color:m.fg, fontSize: size==='md' ? 11.5 : 10.5,
      fontWeight:700, letterSpacing:'.01em', whiteSpace:'nowrap', flexShrink:0,
    }}>
      <WebDot color={m.fg} size={5}/>{children}
    </span>
  );
};

/* ── WebButton ─── variant: primary|ghost|ink|pos|neg  size: sm|md
   disabled+reason: button greyed + reason text shown beneath */
const WebButton = ({ variant='primary', size='md', pill, disabled, reason, onClick, children, full, style:xs }) => {
  const h = size === 'sm' ? 36 : 52;
  const r = pill ? 999 : (size === 'sm' ? 10 : 14);
  const fs = size === 'sm' ? 13 : 15;
  let bg, color, shadow, border = 'none';
  if (disabled)              { bg = '#E3E5EF'; color = T.muted2; shadow = 'none'; }
  else if (variant==='ghost') { bg = 'transparent'; color = T.ink; shadow = 'none'; border = `1.5px solid ${T.line}`; }
  else if (variant==='ink')   { bg = T.ink; color = '#fff'; shadow = 'none'; }
  else if (variant==='pos')   { bg = T.pos; color = '#fff'; shadow = `0 8px 22px -8px rgba(14,159,110,.5)`; }
  else if (variant==='neg')   { bg = T.neg; color = '#fff'; shadow = `0 8px 22px -8px rgba(220,38,38,.5)`; }
  else                        { bg = T.indigo; color = '#fff'; shadow = '0 8px 22px -8px rgba(79,70,229,.55)'; }
  return (
    <div style={{ width: full ? '100%' : 'auto', display: full ? 'block' : 'inline-block' }}>
      <button disabled={disabled} onClick={disabled ? undefined : onClick} style={{
        height:h, padding:`0 ${size==='sm'?16:22}px`, borderRadius:r, fontSize:fs, fontWeight:700,
        letterSpacing:'-0.01em', background:bg, color, border, boxShadow:shadow,
        cursor: disabled ? 'not-allowed' : 'pointer', width: full ? '100%' : 'auto',
        display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8,
        fontFamily:'inherit', transition:'filter .15s', ...(xs||{}),
      }}>{children}</button>
      {disabled && reason && (
        <div style={{ fontSize:11.5, color:T.muted2, fontWeight:600, textAlign:'center', marginTop:8, lineHeight:1.4 }}>{reason}</div>
      )}
    </div>
  );
};

/* ── WebTextInput ─── label, value, onChange, placeholder, error, hint, disabled, type, mono, prefix */
const WebTextInput = ({ label, value, onChange, placeholder, error, hint, disabled, type='text', mono, prefix }) => {
  const [focused, setFocused] = _useStateAtoms(false);
  return (
    <div>
      {label && (
        <div style={{ fontSize:12.5, fontWeight:700, color:T.text, marginBottom:8, display:'flex', justifyContent:'space-between' }}>
          <span>{label}</span>
          {hint && <span style={{ color:T.muted, fontWeight:600 }}>{hint}</span>}
        </div>
      )}
      <div style={{
        height:52, borderRadius:14, display:'flex', alignItems:'center', padding:'0 16px', gap:10,
        background: focused ? T.surface : T.field,
        border: `1.5px solid ${error ? T.neg : focused ? T.indigo : T.line}`,
        boxShadow: focused && !error ? `0 0 0 4px ${T.indigoSoft}` : 'none',
        opacity: disabled ? 0.5 : 1, transition:'border-color .15s, box-shadow .15s',
      }}>
        {prefix && <span style={{ color:T.muted, fontWeight:700, fontSize:15, flexShrink:0 }}>{prefix}</span>}
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ flex:1, border:'none', background:'transparent', outline:'none', fontSize:15, fontWeight:500, color:T.ink,
            fontFamily: mono ? "'JetBrains Mono',monospace" : 'inherit',
            fontVariantNumeric: mono ? 'tabular-nums' : 'normal' }}/>
      </div>
      {error && <div style={{ fontSize:12, color:T.neg, fontWeight:600, marginTop:6 }}>{error}</div>}
    </div>
  );
};

/* ── WebSparkline ─── data:number[] (min 2). Empty/flat → dashed line. */
const WebSparkline = ({ data=[], color=T.pos, width=100, height=36 }) => {
  if (!data || data.length < 2) return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display:'block' }}>
      <line x1={0} y1={height/2} x2={width} y2={height/2} stroke={T.line} strokeWidth={1.5} strokeDasharray="4 3"/>
    </svg>
  );
  const min = Math.min(...data), max = Math.max(...data), rng = max-min||1;
  const pts = data.map((v,i) => [(i/(data.length-1))*width, height-4-((v-min)/rng)*(height-8)]);
  const d = 'M' + pts.map(p => p.join(',')).join(' L');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display:'block' }}>
      <path d={d+` L${width},${height} L0,${height} Z`} fill={color} opacity={.1}/>
      <path d={d} stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

/* ── WebEmptyState ─── icon, title, body, action:{label,onClick} */
const WebEmptyState = ({ icon, title, body, action }) => (
  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'48px 24px', gap:12 }}>
    {icon && <div style={{ width:56, height:56, borderRadius:14, background:T.line2, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:4 }}>{icon}</div>}
    <div style={{ fontSize:16, fontWeight:700, color:T.ink, letterSpacing:'-0.01em' }}>{title}</div>
    {body && <div style={{ fontSize:13, fontWeight:500, color:T.muted, lineHeight:1.55, maxWidth:300 }}>{body}</div>}
    {action && <button onClick={action.onClick} style={{ marginTop:4, height:36, padding:'0 16px', borderRadius:10, border:'none', background:T.indigo, color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>{action.label}</button>}
  </div>
);

/* ── WebErrorState ─── variant: neg|warn|info */
const WebErrorState = ({ variant='neg', title, body, action }) => {
  const C = { neg:{bg:T.negSoft,bdr:T.negBorder,ic:T.neg,tx:T.neg}, warn:{bg:T.warnSurface,bdr:T.warnBorder,ic:T.warn,tx:T.warn}, info:{bg:T.indigoSoft,bdr:T.indigoBorder,ic:T.indigo,tx:T.indigo} }[variant]||{};
  const G = {
    neg:  <><circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="1.8" fill="none"/><path d="M12 8v5M12 16.5v.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/></>,
    warn: <><path d="M12 3l9 16H3l9-16z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" fill="none"/><path d="M12 10v4M12 17h.01" stroke="#fff" strokeWidth="1.9" strokeLinecap="round"/></>,
    info: <><circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="1.8" fill="none"/><path d="M12 8v.01M12 11v5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/></>,
  };
  return (
    <div style={{ display:'flex', gap:12, padding:16, borderRadius:12, background:C.bg, border:`1px solid ${C.bdr}`, alignItems:'flex-start' }}>
      <div style={{ width:36, height:36, borderRadius:10, background:C.ic, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">{G[variant]}</svg>
      </div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:14, fontWeight:700, color:C.tx }}>{title}</div>
        {body && <div style={{ fontSize:13, fontWeight:500, color:T.text, lineHeight:1.5, marginTop:2 }}>{body}</div>}
        {action && <button onClick={action.onClick} style={{ marginTop:10, fontSize:12.5, fontWeight:700, color:C.tx, background:'none', border:'none', cursor:'pointer', padding:0, textDecoration:'underline', fontFamily:'inherit' }}>{action.label}</button>}
      </div>
    </div>
  );
};

/* ── WebSkeletonBlock ─── variant: text|title|num|avatar|card|row */
const WebSkeletonBlock = ({ variant='text', width, style:xs }) => {
  const V = { text:{height:14,borderRadius:4}, title:{height:22,borderRadius:4}, num:{height:32,borderRadius:4,minWidth:80}, avatar:{width:44,height:44,borderRadius:10,flexShrink:0}, card:{height:120,borderRadius:16}, row:{height:52,borderRadius:4} };
  const s = V[variant]||V.text;
  return <div className="skeleton" style={{ ...s, width:width||s.width||'100%', ...(xs||{}) }}/>;
};

/* ── WebConfirmDialog — small centered Тийм/Үгүй confirm (cancel-listing etc.) ── */
const WebConfirmDialog = ({ open, title, body, confirmLabel='Тийм', cancelLabel='Үгүй', tone='neg', onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div onClick={onCancel} style={{ position:'fixed', inset:0, zIndex:90, background:'rgba(5,11,31,.45)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div onClick={e => e.stopPropagation()} style={{ width:'min(380px,100%)', background:T.surface, borderRadius:20, padding:24, boxShadow:'0 30px 70px -24px rgba(15,20,55,.5)' }}>
        <div style={{ fontSize:16, fontWeight:800, color:T.ink, letterSpacing:'-0.01em' }}>{title}</div>
        {body && <div style={{ fontSize:13, color:T.muted, fontWeight:500, marginTop:8, lineHeight:1.55 }}>{body}</div>}
        <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:20 }}>
          <WebButton variant={tone} full onClick={onConfirm}>{confirmLabel}</WebButton>
          <WebButton variant="ghost" full onClick={onCancel}>{cancelLabel}</WebButton>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { T, WebDot, WebBadge, WebButton, WebTextInput, WebSparkline, WebEmptyState, WebErrorState, WebSkeletonBlock, OrderStatusBadge, WebConfirmDialog });
