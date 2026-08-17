// mmf_status.js — MMF · shared order-status vocabulary + "my sell listings" store.
// Plain script (not JSX) — load with a normal <script src> tag, before the
// text/babel component scripts, on any page that shows order status or
// creates/cancels a sell listing (Dashboard, Wallet, Trade).
//
// window.MMF_ORDER_STATUS — the 5-state vocabulary used everywhere:
//   Шинэ (new) → Идэвхтэй (active) → Биелсэн (filled) | Цуцлагдсан (cancelled)
//   Хүлээгдэж буй (pending) — awaiting counterpart / settlement
//
// window.MMFListings — tiny localStorage-backed store for sell listings the
// current user has created from a holding (F3). Shared across pages so a
// listing created on the Dashboard shows up — with the same status badge —
// on the Trade page's secondary market, and can be cancelled from either.
(function () {
  window.MMF_ORDER_STATUS = {
    new:       { label: 'Шинэ',          tone: 'new' },
    active:    { label: 'Идэвхтэй',       tone: 'active' },
    pending:   { label: 'Хүлээгдэж буй',  tone: 'pending' },
    filled:    { label: 'Биелсэн',        tone: 'filled' },
    cancelled: { label: 'Цуцлагдсан',     tone: 'cancelled' },
  };

  var KEY = 'mmf_my_listings_v1';

  function read() {
    try { var v = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(v) ? v : []; }
    catch (e) { return []; }
  }
  function write(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {}
  }

  window.MMFListings = {
    all: function () { return read(); },
    add: function (listing) {
      var l = read();
      l.unshift(listing);
      write(l);
      return l;
    },
    setStatus: function (id, status) {
      var l = read().map(function (x) { return x.id === id ? Object.assign({}, x, { status: status }) : x; });
      write(l);
      return l;
    },
    // active listings (still on the market) for a given ticker / vertical
    activeForTicker: function (ticker) {
      return read().filter(function (x) { return x.ticker === ticker && (x.status === 'new' || x.status === 'active' || x.status === 'pending'); });
    },
    activeForType: function (type) {
      return read().filter(function (x) { return x.type === type && (x.status === 'new' || x.status === 'active' || x.status === 'pending'); });
    },
  };
})();
