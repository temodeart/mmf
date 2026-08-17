/**
 * portal-return.js — review-only affordance.
 * Adds a small "← Урсгалууд" pill so a reviewer can jump back to the flow
 * picker from any web-app screen, matching the mobile prototype's chrome.
 * Plain script; load after the page's own scripts. No product behaviour.
 */
(function () {
  function mount() {
    if (document.getElementById('mmf-portal-return')) return;
    var a = document.createElement('a');
    a.id = 'mmf-portal-return';
    var v = new URLSearchParams(location.search).get('v');
    try { v = v || sessionStorage.getItem('mmf_scope_v'); } catch (e) {}
    a.href = '../Web Flows.html?v=' + (v === '1' ? '1' : '2');
    a.setAttribute('aria-label', 'Урсгалын жагсаалт руу буцах');
    a.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path></svg>Урсгалууд';
    a.style.cssText = [
      'position:fixed', 'left:14px', 'bottom:14px', 'z-index:9999',
      'display:inline-flex', 'align-items:center', 'gap:6px',
      'height:32px', 'padding:0 13px 0 10px', 'border-radius:999px',
      'background:rgba(255,255,255,.86)', 'backdrop-filter:blur(10px)',
      '-webkit-backdrop-filter:blur(10px)', 'border:1px solid rgba(11,16,32,.08)',
      'box-shadow:0 10px 28px -16px rgba(15,20,55,.5)', 'text-decoration:none',
      'color:#2A3052', 'font:700 12px/1 Manrope,system-ui,sans-serif',
      'letter-spacing:-.01em',
    ].join(';');
    document.body.appendChild(a);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
