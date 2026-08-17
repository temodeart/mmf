/* MMF — App-First landing · behavior */
(function () {
  'use strict';
  const doc = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motionOn = () => !reduced && doc.dataset.motion !== 'off';

  /* ---------- nav scrolled state ---------- */
  const nav = document.querySelector('[data-nav]');
  const onScrollNav = () => nav && nav.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- reveals ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach((el) => io.observe(el));
    /* Fail-safe: content must never be stuck invisible. If no reveal has landed
       shortly after load (observer starved, or never delivered), show everything. */
    setTimeout(() => {
      const any = document.querySelector('[data-reveal].is-in');
      if (!any) doc.classList.add('laf-reveal-off');
    }, 1200);
  } else {
    revealEls.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- count-up numbers ---------- */
  const fmt = (n, dec) => n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    if (!motionOn()) { el.textContent = prefix + fmt(target, dec) + suffix; return; }
    const dur = 1400;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + fmt(target * eased, dec) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const countEls = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    countEls.forEach((el) => cio.observe(el));
  } else {
    countEls.forEach(animateCount);
  }

  /* ---------- marquee: duplicate tracks for seamless loop ---------- */
  document.querySelectorAll('[data-marquee]').forEach((track) => {
    track.innerHTML += track.innerHTML;
  });

  /* ---------- hero phone: upright, drifts down on scroll ---------- */
  const heroPhone = document.querySelector('.laf-hero-phone');
  if (heroPhone) {
    const update = () => {
      if (!motionOn()) { heroPhone.style.transform = ''; return; }
      const h = window.innerHeight;
      const p = Math.min(1, Math.max(0, window.scrollY / (h * 0.8)));
      heroPhone.style.transform = 'translateY(' + (p * 40).toFixed(1) + 'px)';
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('tweakchange', update);
    update();
  }

  /* ---------- invest: products × trajectory ----------
     One argument instead of two sections: the product you pick redraws the
     curve, and all four are drawn together as a ghosted fan so the choice reads
     as a spread of outcomes rather than four separate marketing claims. */
  const plot = document.querySelector('.laf-plot-card');
  const pickRow = document.querySelector('.laf-pick-row');
  if (plot && pickRow) {
    const TAX = 0.9;                 // 10% interest tax
    const BANK_GROSS = 0.124;        // benchmark 12-month MNT deposit
    const PRODS = {
      cd:    { nm: 'Хадгаламжийн сертификат', c: '#2D6BFF', lo: 0.118, hi: 0.145 },
      trust: { nm: 'Итгэлцэл',                c: '#4F46E5', lo: 0.195, hi: 0.230 },
      inv:   { nm: 'Нэхэмжлэх',               c: '#0E9F6E', lo: 0.170, hi: 0.210 },
      cp:    { nm: 'Арилжааны бичиг',         c: '#FF6B2C', lo: 0.065, hi: 0.080 },
    };
    const ORDER = ['cd', 'trust', 'inv', 'cp'];
    ORDER.forEach((k) => { PRODS[k].gross = (PRODS[k].lo + PRODS[k].hi) / 2; PRODS[k].net = PRODS[k].gross * TAX; });
    const BANK_NET = BANK_GROSS * TAX;

    const W = 720, H = 250;
    const el = (q) => plot.querySelector(q);
    const range = el('#lafGrowAmount');
    const outTotal = el('[data-grow-total]');
    const outEarn = el('[data-grow-earn]');
    const outDelta = el('[data-grow-delta]');
    const outAmount = el('[data-grow-amount]');
    const vsChip = el('[data-grow-vsbank]');
    const prodName = el('[data-grow-prodname]');
    const termLabel = el('[data-grow-termlabel]');
    const yax = el('[data-grow-yax]');
    const xax = el('[data-grow-xax]');
    const note = el('[data-grow-note]');
    const legend = el('[data-grow-legend]');
    const gridG = el('[data-grow-grid]');
    const dotsG = el('[data-grow-dots]');
    const fanG = el('[data-grow-fan]');
    const pLine = el('[data-grow-line]');
    const pBank = el('[data-grow-bank]');
    const pGap = el('[data-grow-gap]');
    const stop1 = el('[data-grow-stop1]');
    const stop2 = el('[data-grow-stop2]');
    const termBtns = Array.from(plot.querySelectorAll('[data-grow-term]'));
    const pickBtns = Array.from(pickRow.querySelectorAll('[data-prod]'));

    let years = 5;
    let sel = 'trust';
    let shown = 0;
    let raf = null;

    const mnt = (n) => '\u20ae ' + Math.round(n).toLocaleString('en-US');
    const compact = (n) => {
      if (n <= 0) return '\u20ae0';
      if (n >= 1e6) return '\u20ae' + (n / 1e6).toFixed(n >= 1e7 ? 0 : 1).replace('.0', '') + 'сая';
      return '\u20ae' + Math.round(n / 1e3) + 'к';
    };
    const pct = (r) => (r * 100).toFixed(1).replace('.0', '') + '%';
    const at = (p, rate, t) => p * Math.pow(1 + rate, t);

    /* Chart strokes and legend swatches are information-bearing — they are the
       only tie between a curve, its legend row and the selected card — so they
       must clear 3:1 on white. Two of the four brand colours do not (the orange
       is 2.84:1), so each is darkened toward ink only as far as it needs to be,
       rather than hand-picking hexes that drift when the palette changes. */
    const hex2rgb = (h) => [1, 3, 5].map((i) => parseInt(h.substr(i, 2), 16));
    const rgb2hex = (a) => '#' + a.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
    const lum = (a) => {
      const f = a.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
      return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2];
    };
    const onWhite = (a) => 1.05 / (lum(a) + 0.05);
    const ensure3 = (h) => {
      const src = hex2rgb(h), ink = [11, 16, 32];
      for (let k = 0; k <= 60; k++) {
        const m = k / 100;
        const mix = src.map((v, i) => v * (1 - m) + ink[i] * m);
        if (onWhite(mix) >= 3.2) return rgb2hex(mix);
      }
      return rgb2hex(ink);
    };
    ORDER.forEach((k) => { PRODS[k].cSafe = ensure3(PRODS[k].c); });

    legend.innerHTML = '<span data-lg-sel><i class="sel"></i>Сонгосон хэрэгсэл<b data-lg-rate></b></span>'
      + '<span><i class="ghost"></i>Бусад хэрэгсэл</span>'
      + '<span><i class="bank"></i>Банкны хадгаламж<b>' + pct(BANK_GROSS) + '</b></span>'
      + '<span><i class="base"></i>Графикийн доод шугам — хөрөнгө оруулсан дүн</span>';
    const lgSel = legend.querySelector('[data-lg-sel]');
    const lgRate = legend.querySelector('[data-lg-rate]');

    /* Written synchronously and unconditionally first: rAF is suspended in
       hidden tabs, so the count-up is decoration over an already-correct DOM. */
    const countTo = (target) => {
      if (raf) cancelAnimationFrame(raf);
      raf = null;
      const from = shown;
      shown = target;
      outTotal.textContent = mnt(target);
      if (!motionOn() || from === target) return;
      const t0 = performance.now(), dur = 620;
      const tick = (now) => {
        const k = Math.min(1, (now - t0) / dur);
        const e = 1 - Math.pow(1 - k, 3);
        outTotal.textContent = mnt(from + (target - from) * e);
        if (k < 1) raf = requestAnimationFrame(tick);
        else { outTotal.textContent = mnt(target); raf = null; }
      };
      raf = requestAnimationFrame(tick);
    };

    const render = (animateNumber) => {
      const p = +range.value;
      const P = PRODS[sel];
      const final = at(p, P.net, years);
      const bankFinal = at(p, BANK_NET, years);

      /* Axis rebased on the deposit, and its ceiling held to the BEST product
         rather than the selected one, so switching compares like with like
         instead of silently rescaling under the reader. */
      const base = p;
      const peak = Math.max.apply(null, ORDER.map((k) => at(p, PRODS[k].net, years)).concat([bankFinal]));
      const top = base + (peak - base) * 1.08;

      const x = (t) => (t / years) * W;
      const y = (v) => H - ((v - base) / (top - base)) * (H - 10) - 5;
      const steps = 72;
      const pts = (rate) => {
        let d = '';
        for (let i = 0; i <= steps; i++) {
          const t = (i / steps) * years;
          d += (i ? 'L' : 'M') + x(t).toFixed(1) + ' ' + y(at(p, rate, t)).toFixed(1) + ' ';
        }
        return d.trim();
      };

      /* the fan: every instrument at once, the chosen one lifted out of it */
      fanG.innerHTML = ORDER.filter((k) => k !== sel).map((k) =>
        '<path d="' + pts(PRODS[k].net) + '" fill="none" stroke="' + PRODS[k].cSafe
        + '" stroke-width="2" stroke-opacity=".26" stroke-linecap="round"></path>').join('');

      pLine.setAttribute('d', pts(P.net));
      pLine.setAttribute('stroke', P.cSafe);
      pBank.setAttribute('d', pts(BANK_NET));
      stop1.setAttribute('stop-color', P.cSafe);
      stop2.setAttribute('stop-color', P.cSafe);

      /* the gap against a bank deposit — the comparison that matters */
      let gap = '';
      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * years;
        gap += (i ? 'L' : 'M') + x(t).toFixed(1) + ' ' + y(at(p, P.net, t)).toFixed(1) + ' ';
      }
      for (let i = steps; i >= 0; i--) {
        const t = (i / steps) * years;
        gap += 'L' + x(t).toFixed(1) + ' ' + y(at(p, BANK_NET, t)).toFixed(1) + ' ';
      }
      pGap.setAttribute('d', gap + 'Z');

      const stepY = years <= 5 ? 1 : 2;
      let dots = '', grid = '';
      for (let t = stepY; t <= years - 0.01; t += stepY) {
        grid += '<line class="laf-grow-vline" x1="' + x(t).toFixed(1) + '" y1="0" x2="' + x(t).toFixed(1) + '" y2="' + H + '"></line>';
        dots += '<circle class="laf-grow-dot" style="stroke:' + P.cSafe + '" cx="' + x(t).toFixed(1) + '" cy="' + y(at(p, P.net, t)).toFixed(1) + '" r="4.5"></circle>';
      }
      grid += '<line class="laf-grow-base" x1="0" y1="' + (H - 5) + '" x2="' + W + '" y2="' + (H - 5) + '"></line>';
      const ex = x(years).toFixed(1), ey = y(final).toFixed(1);
      dots += '<circle class="laf-grow-halo" style="fill:' + P.cSafe + '" cx="' + ex + '" cy="' + ey + '" r="9"></circle>'
            + '<circle class="laf-grow-end" style="fill:' + P.cSafe + '" cx="' + ex + '" cy="' + ey + '" r="5"></circle>';
      gridG.innerHTML = grid;
      dotsG.innerHTML = dots;

      yax.innerHTML = '<span>' + compact(top) + '</span><span>' + compact(base + (top - base) / 2) + '</span>'
                    + '<span class="b">' + compact(base) + '</span>';
      let xs = '<span>Өнөөдөр</span>';
      for (let t = stepY; t <= years - 0.01; t += stepY) xs += '<span>' + t + ' жил</span>';
      xs += '<span>' + years + ' жил</span>';
      xax.innerHTML = xs;

      /* per-product outcome on every card — the growth of each, not just the pick */
      pickBtns.forEach((b) => {
        const k = b.dataset.prod;
        b.querySelector('[data-pick-out]').textContent = compact(at(p, PRODS[k].net, years));
        const sub = b.querySelector('.out i');
        if (sub) sub.textContent = years + ' жилийн дараа';
      });

      outAmount.textContent = mnt(p);
      /* the painted track fill — dropped in the merge rewrite, which pinned the
         gradient to its 9% CSS fallback while the thumb moved freely */
      range.style.setProperty('--fill', ((p - range.min) / (range.max - range.min) * 100).toFixed(1) + '%');
      outEarn.textContent = '+' + mnt(final - p);
      prodName.textContent = P.nm;
      termLabel.textContent = years + ' жил';
      lgSel.style.setProperty('--c1', P.cSafe);
      plot.style.setProperty('--selc', P.c);   // slider + thumb adopt the chosen instrument
      lgRate.textContent = pct(P.gross);

      /* An instrument can sit BELOW a bank deposit (commercial paper does).
         Say so plainly rather than letting a "+" imply a gain that isn't there. */
      const ahead = final >= bankFinal;
      vsChip.classList.toggle('neg', !ahead);
      outDelta.textContent = (ahead ? '+' : '−') + mnt(Math.abs(final - bankFinal)) + (ahead ? ' их' : ' бага');

      note.textContent = P.nm + ' — ' + pct(P.lo) + '–' + pct(P.hi) + ' хүрээний дундаж '
        + pct(P.gross) + ', хүүгийн 10% татварыг хассан. Хугацаа дуусах бүрд ижил нөхцөлөөр шинэчилж, өгөөжийг бүрэн дахин хөрөнгө оруулсан тохиолдлын төсөөлөл — эдгээр нь 60–365 хоногийн хэрэгсэл. Банкны хадгаламжийн жишиг '
        + pct(BANK_GROSS) + '. Баталгаат өгөөж биш.';

      if (animateNumber) countTo(final); else { shown = final; outTotal.textContent = mnt(final); }
    };

    range.addEventListener('input', () => render(false));
    range.addEventListener('change', () => render(true));
    termBtns.forEach((b) => b.addEventListener('click', () => {
      termBtns.forEach((o) => o.classList.toggle('on', o === b));
      years = +b.dataset.growTerm;
      render(true);
    }));
    pickBtns.forEach((b) => b.addEventListener('click', () => {
      sel = b.dataset.prod;
      pickBtns.forEach((o) => {
        const on = o === b;
        o.classList.toggle('on', on);
        o.setAttribute('aria-checked', on ? 'true' : 'false');
      });
      render(true);
    }));
    window.addEventListener('tweakchange', () => render(false));

    /* Footer links name individual instruments — make them land on that
       instrument rather than all three dumping into the same default view. */
    document.querySelectorAll('[data-goto-prod]').forEach((a) => {
      a.addEventListener('click', () => {
        const b = pickRow.querySelector('[data-prod="' + a.dataset.gotoProd + '"]');
        if (b) b.click();
      });
    });

    render(false);

    const startDraw = () => {
      if (plot.dataset.grown) return;
      plot.dataset.grown = '1';
      if (!motionOn()) return;
      try {
        plot.style.setProperty('--len', Math.ceil(pLine.getTotalLength()));
        plot.classList.add('is-drawing');
      } catch (err) {}
      shown = 0;
      countTo(at(+range.value, PRODS[sel].net, years));
    };
    if (plot.classList.contains('is-in')) startDraw();
    else if ('MutationObserver' in window) {
      const mo = new MutationObserver(() => {
        if (plot.classList.contains('is-in')) { mo.disconnect(); startDraw(); }
      });
      mo.observe(plot, { attributes: true, attributeFilter: ['class'] });
      const io = new IntersectionObserver((es) => {
        es.forEach((e) => { if (e.isIntersecting) { io.disconnect(); mo.disconnect(); startDraw(); } });
      }, { threshold: 0.05 });
      io.observe(plot);
    } else startDraw();
  }

  /* ---------- tour: step -> screen sync ---------- */
  const steps = Array.from(document.querySelectorAll('.laf-step'));
  const screens = Array.from(document.querySelectorAll('.laf-scrset .scr'));
  const setScreen = (id) => {
    screens.forEach((s) => s.classList.toggle('is-on', s.dataset.scr === id));
    steps.forEach((st) => st.classList.toggle('is-active', st.dataset.step === id));
  };
  if (steps.length && screens.length) {
    setScreen(steps[0].dataset.step);
    if ('IntersectionObserver' in window) {
      const tio = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setScreen(e.target.dataset.step); });
      }, { rootMargin: '-42% 0px -42% 0px', threshold: 0 });
      steps.forEach((st) => tio.observe(st));
    }
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.laf-q > button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const open = item.classList.contains('is-open');
      item.parentElement.querySelectorAll('.laf-q.is-open').forEach((q) => {
        q.classList.remove('is-open');
        q.querySelector('button').setAttribute('aria-expanded', 'false');
      });
      if (!open) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();
