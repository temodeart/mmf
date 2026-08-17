// ============================================================
// Money Market Fund — Notifications
// List (filters · day groups · states) + reusable detail template.
// Reuses Frame, BackBar, Badge, Dot, C from screens.jsx (on window).
// ============================================================

const { useState: useStateN } = React;

// category → label + color
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

// Every notification opens the thing it is about, not a generic detail page.
//   txn   → the transaction in Гүйлгээний түүх (failed one → its cancelled record)
//   trade → the product the purchase/maturity concerns
//   loan  → the loan screen
//   sys   → the notification text itself (nothing else to open)
const NOTIF_DEST = (n) => {
  if (n.cat === 'txn')   return n.critical ? 'txDetailFailed' : 'txDetail';
  if (n.cat === 'trade') return 'ownedDetail';
  if (n.cat === 'loan')  return 'loan';
  return n.critical ? 'notifDetailCrit' : 'notifDetail';
};

// ---- one notification row ----
const NotifRow = ({ n, onOpen }) => {
  const cat = NOTIF_CAT[n.cat] || NOTIF_CAT.sys;
  const crit = n.critical;
  return (
    <div data-nodrag onClick={onOpen} style={{
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
                  {g.items.map((n, i) => <NotifRow key={i} n={n} onOpen={() => onNav && onNav(NOTIF_DEST(n))}/>)}
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
const NotificationDetailCrit = () => <NotificationDetail critical/>;

Object.assign(window, { NotificationList, NotificationDetail, NotificationDetailCrit });
