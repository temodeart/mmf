/* =========================================================================
   Money Market Fund — Mobile App · Screen: NotificationList
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

/* module aliases (notifications.jsx) */
const useStateN = React.useState;

const NOTIF_CAT = {
  txn:   { l:'Гүйлгээ',  c: C.blue,   soft: C.blueSoft },
  loan:  { l:'Зээл',     c: C.indigo, soft: C.indigoSoft },
  trade: { l:'Арилжаа',  c: C.green,  soft: C.greenSoft },
  sys:   { l:'Систем',   c: C.amber,  soft: C.amberSoft },
};

const catIcon = (cat, color) => {
  const p = { stroke: color, strokeWidth: 2, fill:'none', strokeLinecap:'round', strokeLinejoin:'round' };
  if (cat === 'txn')   return <g {...p}><path d="M8 7V4l-4 4 4 4V9h8M16 17v3l4-4-4-4v3H8"/></g>;
  if (cat === 'loan')  return <g {...p}><circle cx="8" cy="8" r="2.2"/><circle cx="16" cy="16" r="2.2"/><path d="M7 17L17 7"/></g>;
  if (cat === 'trade') return <g {...p}><path d="M4 19V5M4 19h16M8 14l3-4 3 2 4-6"/></g>;
  return <g {...p}><circle cx="12" cy="12" r="3"/><path d="M12 4v2M12 18v2M4 12h2M18 12h2M6.5 6.5l1.4 1.4M16.1 16.1l1.4 1.4M17.5 6.5l-1.4 1.4M7.9 16.1l-1.4 1.4"/></g>;
};

const critIcon = (color) => <g stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3.5l9.5 16.5H2.5z"/><path d="M12 10v4M12 17.4h.01"/></g>;

// demo dataset

const NOTIFS = [
  { cat:'txn',   day:'Өнөөдөр', time:'10:24', unread:true,  title:'Хэтэвч цэнэглэгдлээ', preview:'₮ 500,000 таны хэтэвчинд амжилттай нэмэгдлээ. Шинэ үлдэгдэл ₮ 2,680,000.' },
  { cat:'trade', day:'Өнөөдөр', time:'09:48', unread:true,  title:'Худалдан авалт амжилттай', preview:'CAPIT 1450 CD · 1 ширхэг худалдан авлаа. Төлөгдөх огноо 2027-05-29.' },
  { cat:'txn',   day:'Өнөөдөр', time:'09:12', unread:true,  critical:true, title:'Шилжүүлэг амжилтгүй боллоо', preview:'₮ 1,000,000 шилжүүлэг цуцлагдаж, мөнгө хэтэвчинд буцаагдсан. Дахин оролдоно уу.' },
  { cat:'loan',  day:'Өчигдөр', time:'16:30', unread:false, title:'Зээлийн хүсэлт зөвшөөрөгдлөө', preview:'₮ 3,000,000 зээл зөвшөөрөгдлөө. Шимтгэл хасагдсан дүн хэтэвчинд шилжсэн.' },
  { cat:'trade', day:'Өчигдөр', time:'11:05', unread:false, title:'Удахгүй өгөөж төлөгдөнө', preview:'MSTRT 2400 IT · 5 хоногийн дараа эргэн төлөгдөж, өгөөж хэтэвчинд шилжинэ.' },
  { cat:'sys',   day:'2026-06-09', time:'08:40', unread:false, title:'Системийн шинэчлэлт ба үйлчилгээний нөхцөлийн өөрчлөлтийн талаарх чухал мэдэгдэл хэрэглэгчдэд', preview:'Платформын үйлчилгээний нөхцөл шинэчлэгдсэн тул дэлгэрэнгүйг уншина уу.' },
  { cat:'sys',   day:'2026-06-09', time:'07:15', unread:false, title:'Шинэ төхөөрөмжөөс нэвтэрлээ', preview:'iPhone 15 · Улаанбаатар. Хэрэв энэ та биш бол нууц үгээ нэн даруй солино уу.' },
  { cat:'loan',  day:'2026-06-08', time:'12:00', unread:false, title:'Эргэн төлөлтийн сануулга', preview:'Таны зээл 2026-06-28-нд бүрэн төлөгдөнө. Дансандаа хүрэлцэхүйц үлдэгдэл байршуулна уу.' },
];

// ---- one notification row ----

const NotifRow = ({ n, onOpen }) => {
  const cat = NOTIF_CAT[n.cat] || NOTIF_CAT.sys;
  const crit = n.critical;
  return (
    <div onClick={onOpen} style={{
      display:'flex', gap: 12, padding: 14, cursor:'pointer',
      background: crit ? C.redSoft : '#fff',
      border:`1px solid ${crit ? '#F7CFCF' : C.line2}`, borderRadius: 16,
      opacity: n.unread ? 1 : .68, transition:'opacity .15s',
    }}>
      <div style={{ width: 40, height: 40, borderRadius: 11, background: crit ? '#fff' : cat.soft, display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">{crit ? critIcon(C.red) : catIcon(n.cat, cat.c)}</svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap: 8 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: crit ? C.red : C.ink, lineHeight: 1.3, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{n.title}</div>
          <div style={{ display:'flex', alignItems:'center', gap: 6, flexShrink: 0, paddingTop: 1 }}>
            <span style={{ fontSize: 10.5, color: C.muted2, fontWeight: 600, fontVariantNumeric:'tabular-nums' }}>{n.time}</span>
            {n.unread && <span style={{ width: 8, height: 8, borderRadius: 999, background: C.orange }}/>}
          </div>
        </div>
        <div style={{ fontSize: 12, color: C.muted, marginTop: 4, lineHeight: 1.45, display:'-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{n.preview}</div>
      </div>
    </div>
  );
};

// ---- empty states ----

const NotifEmpty = () => (
  <div style={{ marginTop: 36, display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', padding:'30px 24px', background:'#fff', borderRadius: 20, border:`1px dashed ${C.line}` }}>
    <div style={{ width: 86, height: 86, borderRadius: 26, background: C.indigoSoft, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9z" stroke={C.indigo} strokeWidth="2" strokeLinejoin="round"/><path d="M10 21a2 2 0 004 0" stroke={C.indigo} strokeWidth="2" strokeLinecap="round"/></svg>
    </div>
    <div style={{ fontSize: 16, fontWeight: 800, color: C.ink, marginTop: 18 }}>Мэдэгдэл байхгүй байна</div>
    <div style={{ fontSize: 12.5, color: C.muted, marginTop: 6, lineHeight: 1.5, maxWidth: 250 }}>Шинэ гүйлгээ, арилжаа болон системийн мэдэгдэл энд харагдана.</div>
  </div>
);

const NotifFilterEmpty = () => (
  <div style={{ marginTop: 40, display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', padding:'24px' }}>
    <div style={{ width: 70, height: 70, borderRadius: 22, background:'#F4F5F9', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke={C.muted2} strokeWidth="2"/><path d="M16 16l4 4" stroke={C.muted2} strokeWidth="2" strokeLinecap="round"/><path d="M8.5 11h5" stroke={C.muted2} strokeWidth="2" strokeLinecap="round"/></svg>
    </div>
    <div style={{ fontSize: 14.5, fontWeight: 800, color: C.ink, marginTop: 16 }}>Энэ төрлийн мэдэгдэл алга</div>
    <div style={{ fontSize: 12, color: C.muted, marginTop: 6, lineHeight: 1.5, maxWidth: 230 }}>Өөр төрөл сонгож үзнэ үү.</div>
  </div>
);

// ============================================================
// NOTIFICATION LIST
// state: default | allread | empty | unread | filterEmpty
// ============================================================

/* ----- this screen ----- */
const NotificationList = ({ state='default', onNav }) => {
  const chips = [['all','Бүгд'],['txn','Гүйлгээ'],['loan','Зээл'],['trade','Арилжаа'],['sys','Систем']];
  const [filter, setFilter] = useStateN(state === 'filterEmpty' ? 'trade' : 'all');

  let base = NOTIFS;
  if (state === 'allread')     base = base.map(n => ({ ...n, unread:false }));
  if (state === 'unread')      base = base.map(n => ({ ...n, unread:true }));
  if (state === 'filterEmpty') base = base.filter(n => n.cat !== 'trade');
  const data = state === 'empty' ? [] : base;
  const filtered = filter === 'all' ? data : data.filter(n => n.cat === filter);
  const unreadCount = data.filter(n => n.unread).length;

  const groups = [];
  filtered.forEach(n => {
    let g = groups.find(x => x.day === n.day);
    if (!g) { g = { day: n.day, items: [] }; groups.push(g); }
    g.items.push(n);
  });

  return (
    <Frame label={'Notifications · ' + state}>
      <BackBar title="Мэдэгдэл" right={
        (state !== 'empty' && unreadCount > 0) ? (
          <button title="Бүгдийг унших" style={{ width: 40, height: 40, borderRadius: 12, background:'#fff', border:`1px solid ${C.line}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M2 12l4 4 6-7" stroke={C.indigo} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M11 16l3 3 8-9" stroke={C.indigo} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        ) : null
      }/>

      {state !== 'empty' && (
        <div style={{ display:'flex', gap: 8, padding:'0 24px 12px', overflowX:'auto', flexShrink: 0 }}>
          {chips.map(([k, l]) => {
            const sel = filter === k;
            return (
              <button key={k} onClick={() => setFilter(k)} style={{
                flexShrink: 0, padding:'7px 14px', borderRadius: 999, whiteSpace:'nowrap', cursor:'pointer',
                background: sel ? C.ink : '#fff', color: sel ? '#fff' : C.text,
                border:`1px solid ${sel ? C.ink : C.line}`, fontSize: 12.5, fontWeight: 600,
              }}>{l}</button>
            );
          })}
        </div>
      )}

      <div style={{ flex: 1, overflow:'auto', padding:'2px 24px 20px' }}>
        {state === 'empty'
          ? <NotifEmpty/>
          : filtered.length === 0
          ? <NotifFilterEmpty/>
          : groups.map((g, gi) => (
              <div key={gi} style={{ marginTop: gi ? 18 : 2 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, marginBottom: 10, letterSpacing:'0.02em' }}>{g.day}</div>
                <div style={{ display:'flex', flexDirection:'column', gap: 10 }}>
                  {g.items.map((n, i) => <NotifRow key={i} n={n} onOpen={() => onNav && onNav(n.critical ? 'notifDetailCrit' : 'notifDetail')}/>)}
                </div>
              </div>
            ))}
      </div>
    </Frame>
  );
};

// ============================================================
// NOTIFICATION DETAIL (reusable announcement / system-critical)
// ============================================================

(window.__MMF_SCREENS = window.__MMF_SCREENS || {}).NotificationList = NotificationList;
})();