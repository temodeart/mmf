/**
 * portal-version.js — review portal, V1 / V2 scope switch.
 * V1 is the earlier build: no Зээл, no Автомат хөрөнгө оруулалт.
 * Flow pages mark those entries with data-v2; ?v=1 drops them, renumbers the
 * remaining flows and re-counts each section so the list stays coherent.
 */
(function () {
  var v = new URLSearchParams(location.search).get('v');
  var isV1 = v === '1';

  function stamp() {
    var el = document.querySelector('.pt-stamp');
    if (!el) return;
    var wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;align-items:center;gap:8px';
    var tag = document.createElement('span');
    tag.className = 'pt-ver';
    tag.textContent = isV1 ? 'V1' : 'V2';
    el.parentNode.insertBefore(wrap, el);
    wrap.appendChild(tag);
    wrap.appendChild(el);
  }

  function prune() {
    document.querySelectorAll('[data-v2]').forEach(function (n) { n.remove(); });
    document.querySelectorAll('.pt-section').forEach(function (sec) {
      var rows = sec.querySelectorAll('.pt-flow');
      if (!rows.length) { sec.remove(); return; }
      var count = sec.querySelector('.pt-section-h span');
      if (count) count.textContent = String(rows.length).padStart(2, '0');
    });
    var n = 0;
    document.querySelectorAll('.pt-flow .pt-num').forEach(function (el) {
      n += 1; el.textContent = String(n).padStart(2, '0');
    });
    var sub = document.querySelector('.pt-head .pt-sub');
    if (sub) {
      var note = document.createElement('span');
      note.style.cssText = 'display:block;margin-top:10px;font-size:13.5px;font-weight:700;color:#B7791F';
      note.textContent = 'V1 — Зээл ба Автомат хөрөнгө оруулалт багтаагүй хувилбар.';
      sub.appendChild(note);
    }
  }

  // Every flow target carries the chosen scope so the prototype itself is gated.
  function keepVersion() {
    var v = isV1 ? '1' : '2';
    document.querySelectorAll('a.pt-flow').forEach(function (a) {
      var h = a.getAttribute('href');
      if (!h) return;
      var hash = '';
      var hi = h.indexOf('#');
      if (hi >= 0) { hash = h.slice(hi); h = h.slice(0, hi); }
      h = h.replace(/([?&])v=[^&]*/, '$1').replace(/[?&]$/, '');
      a.setAttribute('href', h + (h.indexOf('?') >= 0 ? '&' : '?') + 'v=' + v + hash);
    });
  }

  function run() { stamp(); if (isV1) { prune(); } keepVersion(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
