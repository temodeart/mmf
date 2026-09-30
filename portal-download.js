/**
 * portal-download.js — Portal "Татаж авах" panel.
 * Reads downloads/manifest.json (built by tools/build-packages.mjs), then on
 * click fetches that package's files and zips them in the browser with JSZip.
 * Every zip unpacks into one folder with the repo's relative paths intact, plus
 * a README.txt on how to open it.
 */
(function () {
  var JSZIP_URL = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
  var MANIFEST_URL = 'downloads/manifest.json';
  var STORE_EXT = /\.(png|jpe?g|gif|webp|avif|ico|mp4|webm|mov|woff2?|pdf|zip|gz)$/i;
  var CONCURRENCY = 6;

  var panel = document.getElementById('pt-dl');
  if (!panel) return;
  var items = panel.querySelectorAll('[data-pkg]');
  var status = document.getElementById('pt-dl-status');
  var manifest = null, busy = false;

  function href(p) { return p.split('/').map(encodeURIComponent).join('/'); }
  function mb(n) { return n >= 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB'; }
  function setStatus(msg, kind) {
    status.textContent = msg || '';
    status.className = 'pt-dl-status' + (kind ? ' ' + kind : '');
  }

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

  if (location.protocol === 'file:') {
    items.forEach(function (b) { b.disabled = true; });
    setStatus('ZIP татахын тулд порталыг вэб серверээс нээнэ үү (file:// дээр ажиллахгүй).', 'warn');
    return;
  }

  fetch(MANIFEST_URL, { cache: 'no-cache' }).then(function (r) {
    if (!r.ok) throw new Error('manifest ' + r.status);
    return r.json();
  }).then(function (m) {
    manifest = m;
    items.forEach(function (b) {
      var p = m.packages[b.getAttribute('data-pkg')];
      var meta = b.querySelector('.pt-dl-meta');
      if (!p) { b.disabled = true; meta.textContent = 'Багц олдсонгүй'; return; }
      meta.textContent = p.count + ' файл · ' + mb(p.bytes);
      b.disabled = false;
    });
  }).catch(function (e) {
    console.error('[portal-download]', e);
    items.forEach(function (b) { b.disabled = true; });
    setStatus('Багцын жагсаалт ачаалагдсангүй. Хуудсыг дахин ачаална уу.', 'err');
  });

  function readme(p, missing) {
    var url = href(p.entry);
    var lines = [
      'Money Market Fund — ' + p.title,
      '='.repeat(22 + p.title.length),
      '',
      'Бэлтгэсэн: ' + new Date().toISOString().slice(0, 10) + '   (жагсаалт: ' + manifest.generated.slice(0, 10) + ')',
      'Эхлэх файл: ' + p.entry,
      'Файлын тоо: ' + (p.count - missing.length),
      '',
      'НЭЭХ',
      '----',
      'Прототипууд .jsx файлуудыг браузерт ачаалдаг тул файлыг шууд давхар дарж (file://)',
      'нээхэд ажиллахгүй. Жижиг локал сервер ашиглана уу:',
      '',
      '  1. Терминал нээгээд энэ хавтас руу орно:   cd ' + p.folder,
      '  2. Сервер асаана:                          python3 -m http.server 8000',
      '  3. Браузерт нээнэ:                         http://localhost:8000/' + url,
      '',
      'React, Babel, фонтыг интернэтээс (unpkg.com, fonts.googleapis.com) ачаалдаг тул',
      'интернэт холболт шаардлагатай.',
      '',
      'OPEN (English)',
      '--------------',
      'The prototypes load .jsx files at runtime, so opening the HTML straight from disk',
      '(file://) will not work. From this folder run:  python3 -m http.server 8000',
      'then open  http://localhost:8000/' + url + '   (internet needed for React/Babel/fonts).',
    ];
    if (missing.length) {
      lines.push('', 'ТАТАЖ ЧАДААГҮЙ ФАЙЛУУД / FILES THAT FAILED TO DOWNLOAD', '');
      missing.forEach(function (f) { lines.push('  - ' + f); });
    }
    return lines.join('\r\n') + '\r\n';
  }

  function build(btn) {
    var key = btn.getAttribute('data-pkg');
    var p = manifest && manifest.packages[key];
    if (!p || busy) return;
    busy = true;
    panel.classList.add('is-busy');
    btn.classList.add('is-active');
    btn.setAttribute('aria-busy', 'true');
    var bar = btn.querySelector('.pt-dl-bar i');
    var meta = btn.querySelector('.pt-dl-meta');
    var metaText = meta.textContent;
    var done = 0, missing = [];
    var progress = function (frac, label) {
      bar.style.width = (frac * 100).toFixed(1) + '%';
      meta.textContent = label;
    };
    progress(0, 'Эхэлж байна…');
    setStatus('');

    loadJSZip().then(function (JSZip) {
      var zip = new JSZip();
      var root = zip.folder(p.folder);
      var queue = p.files.slice();
      var worker = function () {
        var f = queue.shift();
        if (!f) return Promise.resolve();
        return fetch(href(f.p)).then(function (r) {
          if (!r.ok) throw new Error(r.status);
          return r.arrayBuffer();
        }).then(function (buf) {
          root.file(f.p, buf, STORE_EXT.test(f.p) ? { compression: 'STORE' } : { compression: 'DEFLATE', compressionOptions: { level: 6 } });
        }, function () {
          missing.push(f.p);
        }).then(function () {
          done += f.s;
          progress(0.85 * done / Math.max(1, p.bytes), 'Татаж байна ' + Math.round(100 * done / Math.max(1, p.bytes)) + '%');
          return worker();
        });
      };
      var workers = [];
      for (var i = 0; i < CONCURRENCY; i++) workers.push(worker());
      return Promise.all(workers).then(function () {
        if (missing.length === p.files.length) throw new Error('no files fetched');
        root.file('README.txt', readme(p, missing));
        return zip.generateAsync({ type: 'blob', streamFiles: true }, function (m) {
          progress(0.85 + 0.15 * m.percent / 100, 'Шахаж байна ' + Math.round(m.percent) + '%');
        });
      });
    }).then(function (blob) {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = p.zip;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 10000);
      progress(1, 'Бэлэн · ' + mb(blob.size));
      setStatus(missing.length
        ? p.zip + ' татагдлаа — ' + missing.length + ' файл татагдсангүй (README.txt-д жагсаасан).'
        : p.zip + ' татагдлаа.', missing.length ? 'warn' : 'ok');
    }).catch(function (e) {
      console.error('[portal-download]', e);
      progress(0, metaText);
      setStatus('Татаж чадсангүй. Интернэт холболтоо шалгаад дахин оролдоно уу.', 'err');
    }).then(function () {
      busy = false;
      panel.classList.remove('is-busy');
      btn.classList.remove('is-active');
      btn.removeAttribute('aria-busy');
      setTimeout(function () { if (!busy) { bar.style.width = '0'; meta.textContent = metaText; } }, 4000);
    });
  }

  items.forEach(function (b) { b.addEventListener('click', function () { build(b); }); });
})();
