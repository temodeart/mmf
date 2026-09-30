/**
 * screen-export.js — review-only affordance: download a screen as PNG or SVG.
 *
 *   PNG  pixel-exact raster via html-to-image (2x, clamped for very long pages).
 *   SVG  real vector via dom-to-svg — <text>, <rect>, <path> nodes, so it opens
 *        editable in Figma / Illustrator. Blur and backdrop-blur effects are
 *        dropped; the PNG is the pixel reference.
 *
 * Files are named by screen title ("MMF Web - 04 Нүүр - Бүрэн.png",
 * "MMF Mobile - 048 Худалдан авах - Анхдагч зах.svg"). Batch ZIPs: runBatch().
 *
 * Ways in:
 *   <script src="../screen-export.js" data-page></script>
 *       Web app / landing pages. Mounts a floating "Татах" button (bottom-right)
 *       that captures the whole document.
 *   MMFExport.openMenu(anchorButton, { target, name, prepare })
 *       Custom viewers (the mobile prototype dock). `target` is an element or a
 *       function returning one; `prepare` may undo scaling and return a restore fn.
 *
 * Review chrome ([data-mmf-noexport], state switchers, tweaks panel) is hidden
 * while a capture runs.
 * Plain script; libraries load lazily from jsDelivr on first use.
 */
(function () {
  if (window.MMFExport) return;

  var HTI_URL = 'https://cdn.jsdelivr.net/npm/html-to-image@1.11.13/dist/html-to-image.js';
  var D2S_URL = 'https://cdn.jsdelivr.net/npm/dom-to-svg@0.12.2/+esm';
  var FONT_CSS = 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap';
  var MAX_CANVAS = 16000; // px per side; browsers refuse larger canvases
  var SVG_NS = 'http://www.w3.org/2000/svg';
  // Review-only controls that never belong in a delivered screen.
  var REVIEW_CHROME = '[data-mmf-noexport], .scn-switch, .prev-switch, .twk-panel';

  // ── lazy libraries ────────────────────────────────────────────────
  var htiP = null, d2sP = null;
  function loadHti() {
    if (window.htmlToImage) return Promise.resolve(window.htmlToImage);
    if (!htiP) htiP = new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = HTI_URL;
      s.onload = function () { res(window.htmlToImage); };
      s.onerror = function () { htiP = null; rej(new Error('html-to-image failed to load')); };
      document.head.appendChild(s);
    });
    return htiP;
  }
  function loadD2s() {
    if (!d2sP) d2sP = import(D2S_URL).catch(function (e) { d2sP = null; throw e; });
    return d2sP;
  }

  // Brand fonts as data: URLs for the PNG. The pages' Google Fonts <link>s are
  // cross-origin without CORS, so html-to-image can't read them on its own.
  var fontCssP = null;
  var KEEP_SUBSETS = /^(latin|latin-ext|cyrillic|cyrillic-ext)$/;
  function toDataUrl(blob) {
    return new Promise(function (res, rej) {
      var fr = new FileReader();
      fr.onload = function () { res(fr.result); };
      fr.onerror = rej;
      fr.readAsDataURL(blob);
    });
  }
  function fontEmbedCss() {
    if (!fontCssP) fontCssP = fetch(FONT_CSS).then(function (r) { return r.text(); }).then(function (text) {
      var blocks = text.split(/(?=\/\*\s*[\w-]+\s*\*\/)/).filter(function (b) {
        var m = b.match(/^\/\*\s*([\w-]+)\s*\*\//);
        return !m || KEEP_SUBSETS.test(m[1]);
      });
      return Promise.all(blocks.map(function (b) {
        var m = b.match(/url\((https:[^)]+)\)/);
        if (!m) return b;
        return fetch(m[1]).then(function (r) { return r.blob(); }).then(toDataUrl)
          .then(function (d) { return b.replace(m[1], d); });
      })).then(function (parts) { return parts.join('\n'); });
    }).catch(function (e) { fontCssP = null; console.warn('[screen-export] fonts not embedded', e); return undefined; });
    return fontCssP;
  }

  // ── styles ────────────────────────────────────────────────────────
  var css = [
    '.mmfx-fab{position:fixed;right:14px;bottom:14px;z-index:9999;display:inline-flex;align-items:center;gap:7px;height:34px;padding:0 14px 0 11px;border-radius:999px;border:1px solid rgba(11,16,32,.08);background:rgba(255,255,255,.9);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 10px 28px -16px rgba(15,20,55,.5);color:#2A3052;font:700 12.5px/1 Manrope,system-ui,sans-serif;letter-spacing:-.01em;cursor:pointer}',
    '.mmfx-fab:hover{color:#0B1020;border-color:rgba(11,16,32,.16)}',
    '.mmfx-menu{position:fixed;z-index:10000;width:236px;padding:6px;border-radius:16px;background:#fff;border:1px solid #E7E9F2;box-shadow:0 24px 60px -20px rgba(15,20,55,.45);font-family:Manrope,system-ui,sans-serif}',
    '.mmfx-h{padding:9px 10px 7px;font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#9099B5}',
    '.mmfx-opt{width:100%;display:flex;align-items:center;gap:11px;padding:9px 10px;border:0;border-radius:11px;background:transparent;text-align:left;cursor:pointer;font-family:inherit}',
    '.mmfx-opt:hover,.mmfx-opt:focus-visible{background:#F4F5FB;outline:none}',
    '.mmfx-opt[disabled]{opacity:.5;cursor:default}',
    '.mmfx-fmt{flex-shrink:0;width:38px;height:26px;border-radius:8px;display:flex;align-items:center;justify-content:center;background:#EEF0FE;color:#4F46E5;font:600 10.5px/1 "JetBrains Mono",ui-monospace,monospace;letter-spacing:.04em}',
    '.mmfx-t{display:block;font-size:13px;font-weight:700;color:#0B1020;letter-spacing:-.01em}',
    '.mmfx-s{display:block;margin-top:2px;font-size:11.5px;font-weight:500;color:#5A6285}',
    '.mmfx-frame-btn{width:24px;height:24px;padding:0;border-radius:7px;border:1px solid #E7E9F2;background:#fff;color:#9099B5;display:inline-flex;align-items:center;justify-content:center;cursor:pointer}',
    '.mmfx-frame-btn:hover,.mmfx-frame-btn[aria-expanded="true"]{color:#4F46E5;border-color:#C9CDF7}',
    '.mmfx-frame-btn svg{width:13px;height:13px}',
    '.mmfx-sep{height:1px;margin:6px 4px;background:#EFF1F7}',
    '.mmfx-batch{position:fixed;inset:0;z-index:10002;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(8,11,25,.45);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);font-family:Manrope,system-ui,sans-serif}',
    '.mmfx-batch-card{width:420px;max-width:100%;padding:20px;border-radius:22px;background:#fff;box-shadow:0 30px 70px -20px rgba(15,20,55,.45)}',
    '.mmfx-batch-h{display:flex;align-items:center;gap:12px}',
    '.mmfx-batch-h strong{display:block;font-size:15.5px;font-weight:800;letter-spacing:-.02em;color:#0B1020}',
    '.mmfx-batch-sub{display:block;margin-top:3px;font:600 11.5px/1 "JetBrains Mono",ui-monospace,monospace;color:#9099B5;font-variant-numeric:tabular-nums}',
    '.mmfx-batch-stage{position:relative;margin-top:16px;height:240px;border-radius:14px;overflow:hidden;background:#F4F6FA;border:1px solid #EFF1F7}',
    '.mmfx-batch-bar{margin-top:16px;height:6px;border-radius:999px;background:#EEF0F6;overflow:hidden}',
    '.mmfx-batch-bar i{display:block;height:100%;width:0;border-radius:999px;background:#4F46E5;transition:width .2s ease}',
    '.mmfx-batch-f{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:12px}',
    '.mmfx-batch-now{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12.5px;font-weight:600;color:#5A6285}',
    '.mmfx-batch-f button{flex-shrink:0;height:36px;padding:0 15px;border-radius:11px;border:1px solid #E7E9F2;background:#fff;font:700 12.5px/1 Manrope,system-ui,sans-serif;color:#5A6285;cursor:pointer}',
    '.mmfx-batch-f button:hover{color:#0B1020}',
    '.mmfx-toast{position:fixed;left:50%;top:18px;transform:translateX(-50%);z-index:10001;display:flex;align-items:center;gap:9px;padding:9px 15px;border-radius:999px;background:#0B1020;color:#fff;font:700 12.5px/1.2 Manrope,system-ui,sans-serif;box-shadow:0 14px 34px -14px rgba(15,20,55,.6)}',
    '.mmfx-toast.err{background:#B42318}',
    '.mmfx-spin{width:13px;height:13px;border-radius:50%;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;animation:mmfx-spin .8s linear infinite}',
    '@keyframes mmfx-spin{to{transform:rotate(360deg)}}',
    // While capturing: land every scroll-reveal and freeze transitions.
    'html.mmfx-capturing [data-reveal]{opacity:1!important;transform:none!important}',
    'html.mmfx-capturing *,html.mmfx-capturing *::before,html.mmfx-capturing *::after{transition:none!important;animation-duration:1ms!important;animation-delay:0s!important;animation-iteration-count:1!important}',
  ].join('\n');
  function injectCss() {
    if (document.getElementById('mmfx-css')) return;
    var st = document.createElement('style');
    st.id = 'mmfx-css';
    st.textContent = css;
    document.head.appendChild(st);
  }

  var DL_ICON = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 19h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  // ── helpers ───────────────────────────────────────────────────────
  // File-system-safe, human-readable name (keeps Cyrillic titles as-is).
  function cleanName(t) {
    return String(t || '').replace(/[\\/:*?"<>|\u0000-\u001f]+/g, ' - ')
      .replace(/\s+/g, ' ').replace(/(\s-\s)+/g, ' - ').replace(/^[\s-]+|[\s-]+$/g, '')
      .slice(0, 110).trim() || 'screen';
  }
  function visible(n) {
    if (!n || n.closest(REVIEW_CHROME)) return false;
    var r = n.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && getComputedStyle(n).visibility !== 'hidden';
  }
  function text(n) { return n ? n.textContent.replace(/\s+/g, ' ').trim() : ''; }
  // An open modal / drawer: a fixed layer covering most of the viewport.
  function openOverlay(doc) {
    var W = window.innerWidth, H = window.innerHeight, best = null;
    doc.querySelectorAll('body *').forEach(function (n) {
      if (best && best.contains(n)) return;
      var cs = getComputedStyle(n);
      if (cs.position !== 'fixed' || cs.display === 'none' || !visible(n)) return;
      var r = n.getBoundingClientRect();
      if (r.width >= W * 0.6 && r.height >= H * 0.6 && n.querySelector('h1,h2,h3,[role=heading],button')) best = n;
    });
    return best;
  }
  // A modal's title: its first heading, else its largest short line of text.
  function headingIn(root) {
    var hs = root.querySelectorAll('h1,h2,h3,[role=heading]');
    for (var i = 0; i < hs.length; i++) if (visible(hs[i]) && text(hs[i])) return text(hs[i]);
    var best = '', size = 0, top = Infinity;
    root.querySelectorAll('*').forEach(function (n) {
      var own = Array.prototype.some.call(n.childNodes, function (c) { return c.nodeType === 3 && c.textContent.trim(); });
      if (!own || n.closest('button, a, input, label') || !visible(n)) return;
      var t = text(n);
      // a title reads as words, not a figure or unit ("14.5%", "% / жил")
      var letters = (t.match(/[A-Za-zА-Яа-яӨөҮүЁё]/g) || []).length, chars = t.replace(/\s/g, '').length;
      if (t.length > 70 || letters < 4 || letters / chars < 0.7) return;
      var fs = parseFloat(getComputedStyle(n).fontSize) || 0, y = n.getBoundingClientRect().top;
      if (fs > size + 0.5 || (Math.abs(fs - size) <= 0.5 && y < top)) { best = t; size = fs; top = y; }
    });
    return best;
  }
  var pathParts = location.pathname.split('/').map(function (x) { try { return decodeURIComponent(x); } catch (e) { return x; } });
  var FILE = (pathParts[pathParts.length - 1] || 'index').replace(/\.html?$/i, '');
  var DIR = pathParts[pathParts.length - 2] || '';
  var KIND = DIR === 'web-app' ? 'Web' : DIR === 'landings' ? 'Landing' : DIR === 'mobile-app' ? 'Mobile' : '';
  // "04 Нүүр - Эхний удаа": page number, the page's title, then whatever tells
  // this state apart — preview-state switcher, open modal, or the step heading.
  function screenLabel() {
    var base = document.title.split(/\s+[—–]\s+/).map(function (x) { return x.trim(); })
      .filter(function (x) { return x && !/^money market fund$/i.test(x); })[0] || FILE;
    var num = KIND === 'Web' && (FILE.match(/^(\d+)\s/) || [])[1];
    var parts = [base];
    var state = document.querySelector('.scn-btn.active, .prev-btn.active');
    if (state) parts.push(text(state));
    var ov = openOverlay(document);
    var ctx = ov ? headingIn(ov) : '';
    if (!ctx) {
      var h1 = Array.prototype.filter.call(document.querySelectorAll('main h1, h1'), visible)[0];
      var h = text(h1);
      if (h && h !== base && !/^сайн байна уу/i.test(h)) ctx = h;
    }
    if (ctx && ctx !== base) parts.push(ctx);
    return cleanName((num ? num + ' ' : '') + parts.join(' - '));
  }
  function pageName() { return cleanName('MMF' + (KIND ? ' ' + KIND : '') + ' - ' + screenLabel()); }
  function save(href, filename, revoke) {
    var a = document.createElement('a');
    a.href = href;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    if (revoke) setTimeout(function () { URL.revokeObjectURL(href); }, 4000);
  }
  function bgOf(el) {
    for (var n = el; n && n.nodeType === 1; n = n.parentElement) {
      var c = getComputedStyle(n).backgroundColor;
      if (c && c !== 'transparent' && !/rgba\(.*,\s*0\)$/.test(c)) return c;
    }
    return '#ffffff';
  }

  var toastEl = null;
  function toast(msg, kind) {
    if (toastEl) toastEl.remove();
    toastEl = document.createElement('div');
    toastEl.className = 'mmfx-toast' + (kind === 'err' ? ' err' : '');
    toastEl.setAttribute('data-mmf-noexport', '');
    toastEl.setAttribute('role', 'status');
    toastEl.innerHTML = (kind === 'busy' ? '<span class="mmfx-spin"></span>' : '') + '<span></span>';
    toastEl.lastChild.textContent = msg;
    document.body.appendChild(toastEl);
    if (kind !== 'busy') {
      var mine = toastEl;
      setTimeout(function () { if (toastEl === mine) { mine.remove(); toastEl = null; } }, kind === 'err' ? 5000 : 2200);
    }
  }

  // Hide review chrome and settle animations; returns an undo function.
  function enterCapture(root) {
    var hidden = [];
    document.querySelectorAll(REVIEW_CHROME).forEach(function (n) {
      if (n === toastEl || (root && !root.contains(n))) return;
      hidden.push([n, n.style.display]);
      n.style.display = 'none';
    });
    if (toastEl) toastEl.style.visibility = 'hidden';
    document.documentElement.classList.add('mmfx-capturing');
    // Count-up numbers only animate when scrolled into view; show their end value.
    document.querySelectorAll('[data-count]').forEach(function (n) {
      var t = parseFloat(n.dataset.count), dec = parseInt(n.dataset.decimals || '0', 10);
      if (isNaN(t)) return;
      n.textContent = (n.dataset.prefix || '') + t.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + (n.dataset.suffix || '');
    });
    return function () {
      hidden.forEach(function (h) { h[0].style.display = h[1]; });
      if (toastEl) toastEl.style.visibility = '';
      document.documentElement.classList.remove('mmfx-capturing');
    };
  }
  // Two paints so style changes land; the timeout covers background tabs (no rAF).
  function frame() {
    return new Promise(function (r) {
      var t = setTimeout(r, 120);
      requestAnimationFrame(function () { requestAnimationFrame(function () { clearTimeout(t); r(); }); });
    });
  }

  // dom-to-svg appends a node's in-flow children after its z-index layer groups,
  // so positioned overlays (tab bars, sticky headers) end up painted underneath.
  // Re-sort each group's children into CSS paint order.
  var LAYER_ORDER = {
    rootBackgroundAndBorders: 0,
    childStackingContextsWithNegativeStackLevels: 1,
    inFlowNonInlineNonPositionedDescendants: 2,
    nonPositionedFloats: 3,
    inFlowInlineLevelNonPositionedDescendants: 4,
    childStackingContextsWithStackLevelZeroAndPositionedDescendantsWithStackLevelZero: 5,
    childStackingContextsWithPositiveStackLevels: 6,
  };
  function fixPaintOrder(root) {
    root.querySelectorAll('g').forEach(function (g) {
      var kids = Array.prototype.slice.call(g.children);
      if (!kids.some(function (k) { return k.hasAttribute('data-stacking-layer'); })) return;
      var rank = function (k) {
        var l = k.getAttribute('data-stacking-layer');
        if (l && l in LAYER_ORDER) return LAYER_ORDER[l];
        if (/^(mask|clipPath|defs|linearGradient|radialGradient|pattern|style)$/.test(k.tagName)) return -1;
        return 2; // un-layered element = normal in-flow content
      };
      var sorted = kids.map(function (k, i) { return [rank(k), i, k]; })
        .sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
      if (sorted.every(function (s, i) { return s[1] === i; })) return;
      sorted.forEach(function (s) { g.appendChild(s[2]); });
    });
  }

  // Vector-only DOM tweaks, undone right after conversion:
  //  · SVG has no backdrop blur, so frosted-glass bars would show the content
  //    behind them — thicken their tint.
  //  · dom-to-svg only clips overflow:hidden boxes that are stacking contexts;
  //    CSS also clips their positioned children. Isolate positioned clippers so
  //    decorative absolutes (card watermarks, glows) stay inside.
  //  · CSS outlines (the landing's phone bezels) aren't converted at all. Tag
  //    each outlined element so addOutlines() can draw it back as a stroke.
  function svgPrep(root) {
    var undo = [], outlines = [];
    var set = function (n, prop, val) { undo.push([n, prop, n.style[prop]]); n.style[prop] = val; };
    root.querySelectorAll('*').forEach(function (n) {
      if (n.closest(REVIEW_CHROME)) return;
      var cs = getComputedStyle(n);
      var bf = cs.backdropFilter || cs.webkitBackdropFilter;
      if (bf && bf !== 'none') {
        var m = cs.backgroundColor.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/);
        if (m) set(n, 'backgroundColor', 'rgba(' + m[1] + ',' + m[2] + ',' + m[3] + ',' + (+m[4] + (1 - +m[4]) * 0.8).toFixed(3) + ')');
      }
      if (cs.position !== 'static' && cs.isolation !== 'isolate' && (cs.overflowX !== 'visible' || cs.overflowY !== 'visible')) {
        set(n, 'isolation', 'isolate');
      }
      var ow = parseFloat(cs.outlineWidth);
      if (cs.outlineStyle !== 'none' && ow > 0 && n.offsetWidth) {
        var r = n.getBoundingClientRect(), k = r.width / n.offsetWidth; // ancestor scale()
        var id = n.id || ('mmfx-ol-' + outlines.length);
        if (!n.id) { n.id = id; undo.push([n, null, null]); }
        outlines.push({
          id: id, x: r.left, y: r.top, w: r.width, h: r.height, k: k,
          width: ow * k, offset: (parseFloat(cs.outlineOffset) || 0) * k,
          radius: (parseFloat(cs.borderTopLeftRadius) || 0) * k, color: cs.outlineColor,
        });
      }
    });
    return {
      outlines: outlines,
      undo: function () {
        for (var i = undo.length - 1; i >= 0; i--) {
          if (undo[i][1] === null) undo[i][0].removeAttribute('id');
          else undo[i][0].style[undo[i][1]] = undo[i][2];
        }
      },
    };
  }

  // Draw each recorded outline as a stroked rect painted right after its element
  // (outside the element's own overflow mask, like CSS).
  function addOutlines(svg, outlines, dx, dy) {
    outlines.forEach(function (o) {
      var g = svg.querySelector('[id="' + o.id + '"]');
      var half = o.width / 2, grow = o.offset + half;
      var rc = document.createElementNS(SVG_NS, 'rect');
      rc.setAttribute('x', o.x + dx - grow); rc.setAttribute('y', o.y + dy - grow);
      rc.setAttribute('width', o.w + grow * 2); rc.setAttribute('height', o.h + grow * 2);
      if (o.radius) { rc.setAttribute('rx', o.radius + grow); rc.setAttribute('ry', o.radius + grow); }
      rc.setAttribute('fill', 'none');
      rc.setAttribute('stroke', o.color);
      rc.setAttribute('stroke-width', o.width);
      if (g && g.parentNode) g.parentNode.insertBefore(rc, g.nextSibling);
      else svg.appendChild(rc);
    });
  }

  // dom-to-svg's overflow masks pick up extra <rect>s for descendants' boxes,
  // which punches holes for anything overflowing the clip. The first rect is
  // the element's own box — keep only that.
  function fixMasks(root) {
    root.querySelectorAll('mask[id^="mask-for-"]').forEach(function (m) {
      var kids = Array.prototype.slice.call(m.children);
      kids.slice(1).forEach(function (k) { if (k.tagName === 'rect') k.remove(); });
    });
  }

  // Vector text keeps its CSS font-size while boxes follow ancestor scale(),
  // so a zoomed viewer would export mismatched text. Drop ancestor transforms
  // for the capture when the target isn't at 1:1.
  function unscale(el) {
    var r = el.getBoundingClientRect();
    if (!el.offsetWidth || Math.abs(r.width / el.offsetWidth - 1) < 0.001) return null;
    var undo = [];
    for (var n = el.parentElement; n && n !== document.documentElement; n = n.parentElement) {
      if (getComputedStyle(n).transform === 'none') continue;
      undo.push([n, n.style.transform, n.style.transition]);
      n.style.transition = 'none';
      n.style.transform = 'none';
    }
    return function () { undo.forEach(function (u) { u[0].style.transform = u[1]; u[0].style.transition = u[2]; }); };
  }

  function captureBox(el, isPage) {
    if (isPage) {
      var de = document.documentElement;
      return {
        w: Math.max(de.scrollWidth, document.body.scrollWidth, window.innerWidth),
        h: Math.max(de.scrollHeight, document.body.scrollHeight, window.innerHeight),
      };
    }
    return { w: el.offsetWidth, h: el.offsetHeight };
  }

  // ── capture ───────────────────────────────────────────────────────
  // render(): capture only → Promise<{ blob, ext }>. Used by single downloads
  // here and by batch ZIPs (including from a parent page into an iframe).
  var running = false;
  function render(fmt, opts) {
    var isPage = !!opts.page;
    var restorePrep = null, restoreCapture = null, sx = window.scrollX, sy = window.scrollY;
    var libs = fmt === 'png' ? loadHti() : loadD2s();
    return Promise.all([libs, fmt === 'png' ? fontEmbedCss() : null, document.fonts ? document.fonts.ready : null]).then(function (r) {
      var lib = r[0], fontCss = r[1];
      var el0 = isPage ? null : (typeof opts.target === 'function' ? opts.target() : opts.target);
      restoreCapture = enterCapture(el0);
      if (isPage) window.scrollTo(0, 0);
      return frame().then(function () {
        // Right before measuring: viewers may re-apply their own scaling on a timer.
        if (opts.prepare) restorePrep = opts.prepare() || null;
        var el = isPage ? document.body : (typeof opts.target === 'function' ? opts.target() : opts.target);
        if (!el) throw new Error('Дэлгэц олдсонгүй');
        if (!isPage && !opts.prepare) restorePrep = unscale(el);
        var box = captureBox(el, isPage);
        if (fmt === 'png') {
          var ratio = Math.max(1, Math.min(2, MAX_CANVAS / box.w, MAX_CANVAS / box.h));
          return lib.toBlob(el, {
            width: box.w, height: box.h, pixelRatio: ratio, fontEmbedCSS: fontCss,
            backgroundColor: isPage ? bgOf(document.body) : undefined,
            style: isPage ? { margin: '0' } : undefined,
            filter: function (n) { return !(n.matches && n.matches(REVIEW_CHROME)); },
          }).then(function (blob) {
            if (!blob) throw new Error('PNG үүсгэж чадсангүй');
            return { blob: blob, ext: 'png' };
          });
        }
        var prep = svgPrep(isPage ? document.body : el);
        var doc;
        try { doc = lib.elementToSVG(isPage ? document.documentElement : el); } finally { prep.undo(); }
        return lib.inlineResources(doc.documentElement).then(function () {
          var svg = doc.documentElement;
          fixPaintOrder(svg);
          fixMasks(svg);
          addOutlines(svg, prep.outlines, 0, 0);
          var vb = (svg.getAttribute('viewBox') || '').split(/\s+/).map(Number);
          if (isPage && vb.length === 4) { vb[2] = box.w; vb[3] = box.h; svg.setAttribute('viewBox', vb.join(' ')); }
          if (vb.length === 4) { svg.setAttribute('width', vb[2]); svg.setAttribute('height', vb[3]); }
          // Solid page background behind everything.
          var bg = document.createElementNS(SVG_NS, 'rect');
          bg.setAttribute('x', vb[0] || 0); bg.setAttribute('y', vb[1] || 0);
          bg.setAttribute('width', '100%'); bg.setAttribute('height', '100%');
          bg.setAttribute('fill', isPage ? bgOf(document.body) : 'none');
          svg.insertBefore(bg, svg.firstChild);
          // Brand fonts when the SVG is opened in a browser (Figma has Manrope built in).
          var st = document.createElementNS(SVG_NS, 'style');
          st.textContent = "@import url('" + FONT_CSS + "');";
          svg.insertBefore(st, svg.firstChild);
          var xml = '<?xml version="1.0" encoding="UTF-8"?>\n' + new XMLSerializer().serializeToString(doc);
          return { blob: new Blob([xml], { type: 'image/svg+xml;charset=utf-8' }), ext: 'svg' };
        });
      });
    }).then(function (out) { cleanup(); return out; }, function (err) { cleanup(); throw err; });

    function cleanup() {
      if (restorePrep) { try { restorePrep(); } catch (e) {} restorePrep = null; }
      if (restoreCapture) { restoreCapture(); restoreCapture = null; }
      if (isPage) window.scrollTo(sx, sy);
    }
  }

  function exportScreen(fmt, opts) {
    if (running) return Promise.resolve();
    running = true;
    // Name first: the state switcher and modals are read before chrome is hidden.
    var name = cleanName((typeof opts.name === 'function' ? opts.name() : opts.name) || pageName());
    toast(fmt.toUpperCase() + ' бэлтгэж байна…', 'busy');
    return render(fmt, opts).then(function (out) {
      running = false;
      save(URL.createObjectURL(out.blob), name + '.' + out.ext, true);
      toast(name + '.' + out.ext + ' татагдлаа');
    }, function (err) {
      running = false;
      console.error('[screen-export]', err);
      toast('Татаж чадсангүй — дахин оролдоно уу', 'err');
    });
  }

  // ── batch → ZIP ───────────────────────────────────────────────────
  // runBatch({ fmt, title, zipName, total, item(i) → Promise<{ name, capture() → Promise<{blob, ext}> }>, stage?, start?, onClose? })
  // Captures one screen at a time into a ZIP, with a progress dialog and cancel.
  // `stage` (optional element, e.g. an iframe) is shown as a live preview.
  var JSZIP_URL = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
  var jszipP = null;
  function loadJSZip() {
    if (window.JSZip) return Promise.resolve(window.JSZip);
    if (!jszipP) jszipP = new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = JSZIP_URL;
      s.onload = function () { res(window.JSZip); };
      s.onerror = function () { jszipP = null; rej(new Error('JSZip failed to load')); };
      document.head.appendChild(s);
    });
    return jszipP;
  }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function runBatch(cfg) {
    if (running) return Promise.resolve();
    running = true;
    injectCss();
    var cancelled = false, failed = [];
    var scrim = document.createElement('div');
    scrim.className = 'mmfx-batch';
    scrim.setAttribute('data-mmf-noexport', '');
    scrim.setAttribute('role', 'dialog');
    scrim.setAttribute('aria-modal', 'true');
    scrim.setAttribute('aria-labelledby', 'mmfx-batch-t');
    scrim.innerHTML =
      '<div class="mmfx-batch-card">' +
        '<div class="mmfx-batch-h"><span class="mmfx-fmt">' + cfg.fmt.toUpperCase() + '</span>' +
        '<div><strong id="mmfx-batch-t"></strong><span class="mmfx-batch-sub"></span></div></div>' +
        '<div class="mmfx-batch-stage"></div>' +
        '<div class="mmfx-batch-bar"><i></i></div>' +
        '<div class="mmfx-batch-f"><span class="mmfx-batch-now" aria-live="polite"></span><button type="button">Болих</button></div>' +
      '</div>';
    scrim.querySelector('strong').textContent = cfg.title;
    var sub = scrim.querySelector('.mmfx-batch-sub'), now = scrim.querySelector('.mmfx-batch-now');
    var bar = scrim.querySelector('.mmfx-batch-bar i'), btn = scrim.querySelector('button');
    var stage = scrim.querySelector('.mmfx-batch-stage');
    if (cfg.stage) stage.appendChild(cfg.stage); else stage.remove();
    btn.addEventListener('click', function () { cancelled = true; btn.disabled = true; now.textContent = 'Зогсоож байна…'; });
    document.body.appendChild(scrim);
    btn.focus();
    var set = function (i, label) {
      sub.textContent = Math.min(i, cfg.total) + ' / ' + cfg.total;
      bar.style.width = (100 * i / Math.max(1, cfg.total)).toFixed(1) + '%';
      if (label != null) now.textContent = label;
    };
    set(0, 'Бэлтгэж байна…');

    var used = {};
    var unique = function (n) {
      var k = n.toLowerCase(), c = used[k] || 0;
      used[k] = c + 1;
      return c ? n + ' (' + (c + 1) + ')' : n;
    };
    var finish = function () {
      running = false;
      scrim.remove();
      if (cfg.onClose) try { cfg.onClose(); } catch (e) {}
    };

    // start(): optional async setup once the dialog (and stage) is on screen —
    // e.g. load the iframe and set cfg.total.
    return Promise.resolve(cfg.start && cfg.start()).then(function () {
      set(0);
      return loadJSZip();
    }).then(function (JSZip) {
      var zip = new JSZip();
      var folder = zip.folder(cleanName(cfg.zipName));
      var i = 0;
      var step = function () {
        if (cancelled || i >= cfg.total) return Promise.resolve();
        var k = i++;
        return Promise.resolve(cfg.item(k)).then(function (it) {
          if (!it) return;
          var name = cleanName(it.name);
          set(k, name);
          return it.capture().then(function (out) {
            // Bytes copied into this realm: the blob may come from an iframe's window.
            return out.blob.arrayBuffer().then(function (buf) {
              folder.file(unique(name) + '.' + out.ext, new Uint8Array(buf), out.ext === 'png' ? { compression: 'STORE' } : { compression: 'DEFLATE' });
            });
          }).catch(function (err) {
            console.error('[screen-export] batch item failed', name, err);
            failed.push(name);
          });
        }).then(function () { set(k + 1); return step(); });
      };
      return step().then(function () {
        if (cancelled) { finish(); toast('Цуцлагдлаа'); return; }
        if (failed.length) folder.file('_татагдаагүй.txt', failed.join('\r\n') + '\r\n');
        now.textContent = 'ZIP шахаж байна…';
        return zip.generateAsync({ type: 'blob' }).then(function (blob) {
          finish();
          save(URL.createObjectURL(blob), cleanName(cfg.zipName) + '.zip', true);
          toast(cfg.total - failed.length + ' дэлгэц татагдлаа' + (failed.length ? ' · ' + failed.length + ' алдаатай' : ''), failed.length ? 'err' : null);
        });
      });
    }).catch(function (err) {
      finish();
      console.error('[screen-export] batch', err);
      toast('Багц татаж чадсангүй — дахин оролдоно уу', 'err');
    });
  }

  // Every Frame on a canvas page (the download icon beside each screen label).
  function frameBatch(fmt) {
    var btns = Array.prototype.slice.call(document.querySelectorAll('.mmfx-frame-btn'));
    return runBatch({
      fmt: fmt,
      title: 'Энэ хуудасны бүх дэлгэц',
      zipName: 'MMF Mobile - ' + FILE.replace(/^Money Market Fund\s*-\s*/i, '') + ' - ' + fmt.toUpperCase(),
      total: btns.length,
      item: function (i) {
        var b = btns[i];
        return {
          name: b.getAttribute('data-label') || ('Screen ' + (i + 1)),
          capture: function () { return render(fmt, { target: b.parentElement.nextElementSibling }); },
        };
      },
    });
  }
  function openFrameMenu(anchor, label) {
    var n = document.querySelectorAll('.mmfx-frame-btn').length;
    openMenu(anchor, {
      target: function () { return anchor.parentElement.nextElementSibling; },
      name: 'MMF Mobile - ' + label,
      batch: n > 1 ? { label: 'Энэ хуудасны бүх ' + n + ' дэлгэц', run: frameBatch } : null,
    });
  }

  // ── menu ──────────────────────────────────────────────────────────
  var menuEl = null, menuAnchor = null;
  function closeMenu() {
    if (!menuEl) return;
    menuEl.remove(); menuEl = null;
    if (menuAnchor) { menuAnchor.setAttribute('aria-expanded', 'false'); menuAnchor.focus(); }
    menuAnchor = null;
    document.removeEventListener('pointerdown', onDocDown, true);
    document.removeEventListener('keydown', onKey, true);
  }
  function onDocDown(e) { if (menuEl && !menuEl.contains(e.target) && e.target !== menuAnchor && !menuAnchor.contains(e.target)) closeMenu(); }
  function onKey(e) { if (e.key === 'Escape') { e.stopPropagation(); closeMenu(); } }

  function openMenu(anchor, opts) {
    injectCss();
    if (menuEl) { var same = menuAnchor === anchor; closeMenu(); if (same) return; }
    menuAnchor = anchor;
    anchor.setAttribute('aria-expanded', 'true');
    menuEl = document.createElement('div');
    menuEl.className = 'mmfx-menu';
    menuEl.setAttribute('role', 'menu');
    menuEl.setAttribute('data-mmf-noexport', '');
    menuEl.innerHTML =
      '<div class="mmfx-h">' + (opts.page ? 'Хуудсыг татах' : 'Дэлгэцийг татах') + '</div>' +
      '<button type="button" role="menuitem" class="mmfx-opt" data-fmt="png"><span class="mmfx-fmt">PNG</span><span><span class="mmfx-t">Зураг (PNG)</span><span class="mmfx-s">Яг харагдаж буйгаар, 2x</span></span></button>' +
      '<button type="button" role="menuitem" class="mmfx-opt" data-fmt="svg"><span class="mmfx-fmt">SVG</span><span><span class="mmfx-t">Вектор (SVG)</span><span class="mmfx-s">Figma, Illustrator-т засварлана</span></span></button>' +
      (opts.batch ?
        '<div class="mmfx-sep"></div><div class="mmfx-h">Бүгдийг ZIP-ээр</div>' +
        '<button type="button" role="menuitem" class="mmfx-opt" data-fmt="png" data-batch><span class="mmfx-fmt">ZIP</span><span><span class="mmfx-t">Бүх дэлгэц · PNG</span><span class="mmfx-s"></span></span></button>' +
        '<button type="button" role="menuitem" class="mmfx-opt" data-fmt="svg" data-batch><span class="mmfx-fmt">ZIP</span><span><span class="mmfx-t">Бүх дэлгэц · SVG</span><span class="mmfx-s"></span></span></button>'
        : '');
    if (opts.batch) menuEl.querySelectorAll('[data-batch] .mmfx-s').forEach(function (n) { n.textContent = opts.batch.label; });
    menuEl.addEventListener('click', function (e) {
      var b = e.target.closest('[data-fmt]');
      if (!b) return;
      e.stopPropagation();
      var fmt = b.getAttribute('data-fmt');
      closeMenu();
      if (b.hasAttribute('data-batch')) opts.batch.run(fmt);
      else exportScreen(fmt, opts);
    });
    document.body.appendChild(menuEl);

    // Place above the anchor if there's room, else below; keep inside the viewport.
    var r = anchor.getBoundingClientRect(), mw = menuEl.offsetWidth, mh = menuEl.offsetHeight;
    var top = r.top - mh - 8 >= 8 ? r.top - mh - 8 : Math.min(r.bottom + 8, window.innerHeight - mh - 8);
    var left = Math.max(8, Math.min(r.right - mw, window.innerWidth - mw - 8));
    menuEl.style.top = top + 'px';
    menuEl.style.left = left + 'px';
    menuEl.querySelector('.mmfx-opt').focus();
    document.addEventListener('pointerdown', onDocDown, true);
    document.addEventListener('keydown', onKey, true);
  }

  // ── page mode ─────────────────────────────────────────────────────
  function mountFab() {
    injectCss();
    if (document.getElementById('mmfx-fab')) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.id = 'mmfx-fab';
    b.className = 'mmfx-fab';
    b.setAttribute('data-mmf-noexport', '');
    b.setAttribute('aria-haspopup', 'menu');
    b.setAttribute('aria-expanded', 'false');
    b.innerHTML = DL_ICON + 'Татах';
    b.addEventListener('click', function () { openMenu(b, { page: true }); });
    document.body.appendChild(b);
  }

  window.MMFExport = {
    openMenu: openMenu, openFrameMenu: openFrameMenu, exportScreen: exportScreen,
    render: render, runBatch: runBatch, frame: frame, wait: wait,
    pageName: pageName, screenLabel: screenLabel, cleanName: cleanName, icon: DL_ICON,
  };
  injectCss();

  var me = document.currentScript;
  if (me && me.hasAttribute('data-page')) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountFab);
    else mountFab();
  }
})();
