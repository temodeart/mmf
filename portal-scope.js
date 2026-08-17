/**
 * portal-scope.js — web app · V1 / V2 scope flag.
 * V1 is the earlier build: no Зээл, no Автомат хөрөнгө оруулалт.
 * The flow list stamps ?v=1|2 on its links; this persists the choice for the
 * rest of the multi-page session and exposes window.MMF_V1 to the components.
 * Must load BEFORE comp_kit.jsx so the sidebar nav can read the flag.
 */
(function () {
  var KEY = 'mmf_scope_v';
  var v = new URLSearchParams(location.search).get('v');
  if (v === '1' || v === '2') { try { sessionStorage.setItem(KEY, v); } catch (e) {} }
  else { try { v = sessionStorage.getItem(KEY); } catch (e) {} }
  window.MMF_SCOPE_V = v === '1' ? '1' : '2';
  window.MMF_V1 = window.MMF_SCOPE_V === '1';
})();
