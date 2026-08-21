/* ============================================================
 * utils/esc.js - HTML 转义工具
 * 防止 XSS 攻击
 * ============================================================ */

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
