// mmf_notifications.js — MMF · shared notification center data + read-state store.
// Plain script (not JSX) — load with a normal <script src> tag, before the
// text/babel component scripts, on any page that shows the topbar bell
// (Dashboard, Trade, Wallet, Profile, News, Loan). Mirrors mmf_status.js's
// pattern: one source of truth so the topbar dropdown and the full list page
// (12 Notifications.html) never drift out of sync.
//
// window.MMF_NOTIF_CAT — category vocabulary (label + color) shared by the
//   topbar dropdown and the full list's filter chips.
// window.MMFNotifs — read/list API, localStorage-backed read-state.
(function () {
  var KEY_READ = 'mmf_notif_read_v1';

  window.MMF_NOTIF_CAT = {
    txn:   { label: 'Гүйлгээ',  color: '#2D6BFF' },
    loan:  { label: 'Зээл',     color: '#4F46E5' },
    trade: { label: 'Арилжаа',  color: '#0E9F6E' },
    sys:   { label: 'Систем',   color: '#B7791F' },
  };

  var now = Date.now();
  var HOUR = 3600000, DAY = 86400000;

  // seedUnread: whether this item starts unread on a fresh browser (no read-state yet).
  // Each item's real `url` is precomputed here so both the dropdown and the
  // full list page navigate identically — deep-linking straight to the
  // subject (order → Dashboard's orders table, payout → Wallet, news → article)
  // rather than an interstitial notification-detail screen (desktop adaptation).
  var NOTIFS = [
    { id:'no1', cat:'txn',   critical:false, seedUnread:true,  date: now - 2*HOUR,        title:'Хэтэвч цэнэглэгдлээ',
      body:'₮ 500,000 таны хэтэвчинд амжилттай нэмэгдлээ. Шинэ үлдэгдэл ₮ 12,500,000.', url:'13 Transaction History.html?tx=t1' },
    { id:'no2', cat:'trade', critical:false, seedUnread:true,  date: now - 5*HOUR,        title:'Худалдан авалт амжилттай',
      body:'CAPIT 1450 CD · 1 ширхэг худалдан авлаа. Дуусах огноо 2027.02.18.', url:'17 My Products.html' },
    { id:'no3', cat:'txn',   critical:true,  seedUnread:true,  date: now - 8*HOUR,        title:'Шилжүүлэг амжилтгүй боллоо',
      body:'₮ 1,000,000 шилжүүлэг цуцлагдаж, мөнгө хэтэвчинд буцаагдсан. Дахин оролдоно уу.', url:'13 Transaction History.html?tx=tfail' },
    { id:'no4', cat:'loan',  critical:false, seedUnread:true,  date: now - 1*DAY,         title:'Зээлийн хүсэлт зөвшөөрөгдлөө',
      body:'₮ 3,000,000 зээл зөвшөөрөгдлөө. Шимтгэл хасагдсан дүн хэтэвчинд шилжсэн.', url:'10 Loan.html' },
    { id:'no5', cat:'trade', critical:false, seedUnread:false, date: now - 1*DAY - 4*HOUR, title:'Удахгүй өгөөж төлөгдөнө',
      body:'MSTRT 2400 IT · 5 хоногийн дараа эргэн төлөгдөж, өгөөж хэтэвчинд шилжинэ.', url:'17 My Products.html' },
    { id:'no6', cat:'sys',   critical:false, seedUnread:false, date: now - 2*DAY,          title:'Шинэ хадгаламжийн сертификатын арилжаа нээлттэй боллоо',
      body:'Капитрон Банк ХК 14.5% жилийн үр шимтэй, 12 сарын хугацаатай шинэ ХС гаргалаа.', url:'08 News.html?article=kapitron-cd-shine-hugatsaa' },
    { id:'no7', cat:'sys',   critical:false, seedUnread:false, date: now - 2*DAY - 3*HOUR, title:'Шинэ төхөөрөмжөөс нэвтэрлээ',
      body:'iPhone 15 · Улаанбаатар. Хэрэв энэ та биш бол нууц үгээ нэн даруй солино уу.', url:'07 Profile.html?tab=security' },
    { id:'no8', cat:'loan',  critical:false, seedUnread:false, date: now - 3*DAY,          title:'Эргэн төлөлтийн сануулга',
      body:'Таны зээл 2026.06.28-нд бүрэн төлөгдөнө. Дансандаа хүрэлцэхүйц үлдэгдэл байршуулна уу.', url:'10 Loan.html' },
    { id:'no9', cat:'sys',   critical:false, seedUnread:false, date: now - 6*DAY,          title:'Үйлчилгээний нөхцөл шинэчлэгдлээ',
      body:'Платформын үйлчилгээний нөхцөл шинэчлэгдсэн тул профайл хэсгээс дэлгэрэнгүйг уншина уу.', url:'07 Profile.html?tab=settings' },
  ];

  function readSet() {
    try { return new Set(JSON.parse(localStorage.getItem(KEY_READ) || '[]')); }
    catch (e) { return new Set(); }
  }
  function writeSet(s) {
    try { localStorage.setItem(KEY_READ, JSON.stringify(Array.from(s))); } catch (e) {}
  }

  function list() {
    var read = readSet();
    return NOTIFS.slice().sort(function (a, b) { return b.date - a.date; }).map(function (n) {
      return Object.assign({}, n, { unread: !!n.seedUnread && !read.has(n.id) });
    });
  }
  function unreadCount() { return list().filter(function (n) { return n.unread; }).length; }
  function markRead(id) { var s = readSet(); s.add(id); writeSet(s); }
  function markAllRead() { var s = readSet(); NOTIFS.forEach(function (n) { s.add(n.id); }); writeSet(s); }
  function isEmpty() { return NOTIFS.length === 0; }

  window.MMFNotifs = { list: list, unreadCount: unreadCount, markRead: markRead, markAllRead: markAllRead, isEmpty: isEmpty };
})();
