#!/usr/bin/env node
/**
 * build-packages.mjs — writes downloads/manifest.json for the Portal's
 * "Татаж авах" (download) panel. The Portal zips these files in the browser.
 *
 *   node tools/build-packages.mjs
 *
 * Re-run after adding, removing or renaming files, then commit the manifest.
 *
 * Packages
 *   all      every file in the repo (git ls-files + new untracked files)
 *   landing  landings/*.html + everything they load
 *   mobile   Mobile Flows.html + mobile-app/*.html + everything they load
 *   web      Web Flows.html + web-app/*.html + everything they load
 *
 * "Everything they load" is found by crawling src/href attributes, CSS url() /
 * @import, and asset-looking string literals in .js/.jsx. HTML links are only
 * followed inside a package's own scope, so the mobile package doesn't pull in
 * the web app through a cross-link.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, statSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rel = (abs) => path.relative(ROOT, abs).split(path.sep).join('/');
const abs = (r) => path.join(ROOT, r);

// Never ship: local tooling state, scratch, OS junk, and the zips' own manifest.
const EXCLUDE = [/^\.git\//, /^\.claude\//, /^_scratch\//, /(^|\/)\.DS_Store$/, /^downloads\/manifest\.json$/];
const excluded = (r) => EXCLUDE.some((re) => re.test(r));

const htmlIn = (dir) => readdirSync(abs(dir)).filter((f) => f.endsWith('.html')).map((f) => `${dir}/${f}`);

const PACKAGES = {
  all: {
    title: 'Бүх төсөл',
    zip: 'mmf-full-project.zip',
    folder: 'mmf-full-project',
    entry: 'Portal.html',
  },
  landing: {
    title: 'Landing',
    zip: 'mmf-landing.zip',
    folder: 'mmf-landing',
    entry: 'landings/13 Landing - App First.html',
    entries: () => htmlIn('landings'),
    scope: ['landings/'],
  },
  mobile: {
    title: 'Гар утасны апп',
    zip: 'mmf-mobile-app.zip',
    folder: 'mmf-mobile-app',
    entry: 'Mobile Flows.html',
    entries: () => ['Mobile Flows.html', ...htmlIn('mobile-app')],
    scope: ['mobile-app/', 'Mobile Flows.html'],
  },
  web: {
    title: 'Веб апп',
    zip: 'mmf-web-app.zip',
    folder: 'mmf-web-app',
    entry: 'Web Flows.html',
    entries: () => ['Web Flows.html', ...htmlIn('web-app')],
    scope: ['web-app/', 'Web Flows.html'],
  },
};

// ── reference extraction ────────────────────────────────────────────
const ASSET_EXT = 'png|jpe?g|gif|webp|avif|svg|ico|mp4|webm|mov|woff2?|ttf|otf|css|js|jsx|json|pdf|html';
const RE_ATTR = /\b(?:src|href|poster|data-src)\s*=\s*("([^"]*)"|'([^']*)')/gi;
const RE_SRCSET = /\bsrcset\s*=\s*("([^"]*)"|'([^']*)')/gi;
const RE_CSS_URL = /url\(\s*(['"]?)([^'")]+)\1\s*\)/gi;
const RE_CSS_IMPORT = /@import\s+(['"])([^'"]+)\1/gi;
const RE_JS_STR = new RegExp(`(['"\`])((?:\\.{1,2}/|[\\w-]+/)?[^'"\`\\s<>{}$]*?\\.(?:${ASSET_EXT}))(?:[?#][^'"\`]*)?\\1`, 'gi');

const decodeEntities = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

function cleanRef(raw) {
  let r = decodeEntities(raw.trim());
  if (!r || /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(r)) return null; // http:, data:, mailto:, //cdn, #anchor
  r = r.replace(/[?#].*$/, '');
  if (!r || r.startsWith('/')) return null;
  try { r = decodeURIComponent(r); } catch { /* keep as-is */ }
  return r;
}

function refsOf(file, text) {
  const out = [];
  const push = (v) => { const c = cleanRef(v); if (c) out.push(c); };
  const ext = path.extname(file).toLowerCase();
  if (ext === '.html' || ext === '.htm') {
    for (const m of text.matchAll(RE_ATTR)) push(m[2] ?? m[3]);
    for (const m of text.matchAll(RE_SRCSET)) (m[2] ?? m[3]).split(',').forEach((c) => push(c.trim().split(/\s+/)[0]));
    for (const m of text.matchAll(RE_CSS_URL)) push(m[2]);
    for (const m of text.matchAll(RE_CSS_IMPORT)) push(m[2]);
    // inline <script> bodies may reference assets as plain strings too
    for (const m of text.matchAll(RE_JS_STR)) push(m[2]);
  } else if (ext === '.css') {
    for (const m of text.matchAll(RE_CSS_URL)) push(m[2]);
    for (const m of text.matchAll(RE_CSS_IMPORT)) push(m[2]);
  } else if (ext === '.js' || ext === '.jsx' || ext === '.mjs') {
    for (const m of text.matchAll(RE_JS_STR)) push(m[2]);
  }
  return out;
}

// ── crawl ───────────────────────────────────────────────────────────
function crawl(pkg) {
  const inScope = (r) => pkg.scope.some((s) => (s.endsWith('/') ? r.startsWith(s) : r === s));
  const files = new Set();
  // JS paths resolve against the page that loads them, not the script's own folder.
  const bases = new Map(); // file -> Set(of base dirs to resolve its refs against)
  const queue = [];
  const add = (r, base) => {
    if (excluded(r) || !existsSync(abs(r)) || !statSync(abs(r)).isFile()) return false;
    if (!bases.has(r)) bases.set(r, new Set());
    const b = bases.get(r);
    const fresh = !files.has(r) || !b.has(base);
    b.add(base);
    if (!files.has(r)) files.add(r);
    if (fresh) queue.push(r);
    return true;
  };
  for (const e of pkg.entries()) add(e, path.posix.dirname(e));

  while (queue.length) {
    const file = queue.shift();
    const ext = path.extname(file).toLowerCase();
    if (!/^\.(html?|css|jsx?|mjs)$/.test(ext)) continue;
    const text = readFileSync(abs(file), 'utf8');
    const isHtml = /^\.html?$/.test(ext);
    const ownDir = path.posix.dirname(file);
    const tryDirs = isHtml || ext === '.css' ? [ownDir] : [ownDir, ...bases.get(file)];
    for (const ref of refsOf(file, text)) {
      for (const dir of new Set(tryDirs)) {
        const target = path.posix.normalize(path.posix.join(dir, ref));
        if (target.startsWith('..')) continue;
        if (/\.html?$/i.test(target) && !inScope(target)) continue; // cross-product link
        // A page's scripts resolve against the page; a stylesheet's against itself.
        const base = isHtml ? ownDir : ext === '.css' ? path.posix.dirname(target) : dir;
        if (add(target, base)) break;
      }
    }
  }
  return [...files];
}

function allFiles() {
  const out = execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], { cwd: ROOT });
  return out.toString('utf8').split('\0').filter(Boolean).filter((r) => !excluded(r) && existsSync(abs(r)));
}

// ── write ───────────────────────────────────────────────────────────
const manifest = { generated: new Date().toISOString(), packages: {} };
for (const [key, pkg] of Object.entries(PACKAGES)) {
  const list = (key === 'all' ? allFiles() : crawl(pkg)).sort((a, b) => a.localeCompare(b));
  if (!list.includes(pkg.entry)) throw new Error(`${key}: entry "${pkg.entry}" missing from package`);
  const files = list.map((p) => ({ p, s: statSync(abs(p)).size }));
  const bytes = files.reduce((n, f) => n + f.s, 0);
  manifest.packages[key] = { title: pkg.title, zip: pkg.zip, folder: pkg.folder, entry: pkg.entry, count: files.length, bytes, files };
  console.log(`${key.padEnd(8)} ${String(files.length).padStart(4)} files  ${(bytes / 1048576).toFixed(1).padStart(6)} MB  → ${pkg.zip}`);
}
mkdirSync(abs('downloads'), { recursive: true });
writeFileSync(abs('downloads/manifest.json'), JSON.stringify(manifest, null, 1) + '\n');
console.log('wrote downloads/manifest.json');
