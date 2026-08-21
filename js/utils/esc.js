/* ============================================================
 * utils/esc.js - HTML 转义工具
 * 防止 XSS 攻击
 * ============================================================ */
(function() {
  if (window.__REHAB_ESC_LOADED__) return;
  window.__REHAB_ESC_LOADED__ = true;

document.documentElement.setAttribute('data-esc-loaded', '1');

function esc(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escAttr(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeHtml(str) {
  return esc(str);
}

window.Esc = {
  esc: esc,
  escAttr: escAttr,
  safeHtml: safeHtml
};
})();
