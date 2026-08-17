/* =========================================================================
   Money Market Fund — Landing (Calm Authority)
   Sticky nav · yield-taster calculator · FAQ · scroll reveal · count-up
   · subtle rates ticking. Uses formatters from foundations.js.
   ========================================================================= */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── sticky nav ──────────────────────────────────────────────────────── */
  var nav = document.querySelector('.lp-nav');
  function onScroll() { if (nav) nav.classList.toggle('is-stuck', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── yield taster ────────────────────────────────────────────────────── */
  var MMF_RATE = 16.8;   /* representative blended MMF yield, % /year */
  var BANK_RATE = 9.0;   /* representative bank savings rate, % /year */
  var TAX = 0.10;        /* 10% withholding on yield */

  var amountEl = document.getElementById('calcAmount');
  var termEls  = Array.prototype.slice.call(document.querySelectorAll('.lp-term'));
  var chipEls  = Array.prototype.slice.call(document.querySelectorAll('.lp-chip'));
  var state = { amount: 1000000, months: 3 };

  function netYield(principal, ratePct, months) {
    return principal * (ratePct / 100) * (months / 12) * (1 - TAX);
  }
  function parseAmount(str) {
    var n = Number(String(str).replace(/[^0-9]/g, ''));
    if (!isFinite(n) || n < 0) n = 0;
    if (n > 100000000000) n = 100000000000; /* graceful cap */
    return n;
  }
  function renderAmount() {
    if (!amountEl) return;
    amountEl.value = state.amount ? state.amount.toLocaleString('en-US') : '';
  }
  function renderCalc() {
    var p = state.amount, m = state.months;
    var mmf = netYield(p, MMF_RATE, m);
    var bank = netYield(p, BANK_RATE, m);
    var net = document.getElementById('resNet');
    var sub = document.getElementById('resSub');
    var mult = document.getElementById('resMult');
    var mmfA = document.getElementById('resMmfAmt');
    var bankA = document.getElementById('resBankAmt');
    var mmfF = document.getElementById('resMmfFill');
    var bankF = document.getElementById('resBankFill');

    if (net) net.textContent = (p === 0 ? '\u2014' : '+' + window.formatMNT(mmf).replace('\u20AE\u00A0', '\u20AE\u00A0'));
    if (net && p > 0) net.textContent = window.formatDelta(mmf);
    if (sub) {
      sub.innerHTML = p > 0
        ? '<b>' + state.months + ' сар</b>-ын дараа таны хүртэх цэвэр өгөөж (10% татвар хассан).'
        : 'Дүн оруулна уу.';
    }
    var ratio = bank > 0 ? mmf / bank : 0;
    if (mult) mult.querySelector('.big').textContent = (p > 0 ? ratio.toFixed(1) + '\u00D7' : '\u2014');
    if (mmfA) mmfA.textContent = window.formatDelta(mmf);
    if (bankA) bankA.textContent = window.formatDelta(bank);
    if (mmfF) mmfF.style.width = '100%';
    if (bankF) bankF.style.width = (mmf > 0 ? Math.max(6, (bank / mmf) * 100) : 0) + '%';
  }

  if (amountEl) {
    amountEl.addEventListener('input', function () {
      var caretEnd = amountEl.selectionStart === amountEl.value.length;
      state.amount = parseAmount(amountEl.value);
      renderAmount();
      if (caretEnd) { try { amountEl.setSelectionRange(amountEl.value.length, amountEl.value.length); } catch (e) {} }
      renderCalc();
    });
    amountEl.addEventListener('blur', renderAmount);
  }
  chipEls.forEach(function (c) {
    c.addEventListener('click', function () {
      state.amount = Number(c.getAttribute('data-amt'));
      renderAmount(); renderCalc();
    });
  });
  termEls.forEach(function (t) {
    t.addEventListener('click', function () {
      termEls.forEach(function (x) { x.classList.remove('is-active'); x.setAttribute('aria-pressed', 'false'); });
      t.classList.add('is-active'); t.setAttribute('aria-pressed', 'true');
      state.months = Number(t.getAttribute('data-months'));
      renderCalc();
    });
  });
  renderAmount();
  renderCalc();

  /* ── FAQ accordion ───────────────────────────────────────────────────── */
  Array.prototype.slice.call(document.querySelectorAll('.lp-faq-item')).forEach(function (item) {
    var btn = item.querySelector('.lp-faq-q');
    var ans = item.querySelector('.lp-faq-a');
    if (!btn || !ans) return;
    btn.addEventListener('click', function () {
      var open = item.classList.contains('is-open');
      if (open) {
        item.classList.remove('is-open');
        ans.style.maxHeight = '0px';
        btn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('is-open');
        ans.style.maxHeight = ans.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ── count-up on scroll ──────────────────────────────────────────────── */
  function countUp(el) {
    var target = Number(el.getAttribute('data-target'));
    var decimals = Number(el.getAttribute('data-decimals') || 0);
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduceMotion) {
      el.textContent = prefix + target.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
      return;
    }
    var start = performance.now(), dur = 1400;
    function frame(now) {
      var t = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      var val = target * eased;
      el.textContent = prefix + val.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ── scroll reveal + trigger count-up ────────────────────────────────── */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.lp-reveal'));
  function reveal(el) {
    el.classList.add('is-in');
    Array.prototype.slice.call(el.querySelectorAll('[data-target]')).forEach(countUp);
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        reveal(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' }); /* threshold 0 → fires for tall sections too */
    revealEls.forEach(function (el) { io.observe(el); });
    /* safety: reveal anything still hidden after 4s (e.g. observer missed) */
    setTimeout(function () { revealEls.forEach(function (el) { if (!el.classList.contains('is-in')) reveal(el); }); }, 4000);
  } else {
    revealEls.forEach(reveal);
  }

  /* ── subtle rates ticking (calm, ±0.1 oscillation) ──────────────────── */
  if (!reduceMotion) {
    var rateEls = Array.prototype.slice.call(document.querySelectorAll('[data-rate]'));
    var bases = rateEls.map(function (el) { return Number(el.getAttribute('data-rate')); });
    setInterval(function () {
      var i = Math.floor(Math.random() * rateEls.length);
      var el = rateEls[i];
      var jitter = (Math.random() < 0.5 ? -1 : 1) * 0.1;
      var v = Math.max(bases[i] - 0.1, Math.min(bases[i] + 0.1, bases[i] + jitter));
      var numSpan = el.childNodes[0];
      el.firstChild.nodeValue = v.toFixed(1);
      el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
    }, 3600);
  }
})();
