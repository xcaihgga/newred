/* ============================================================
 * components/toast.js - 轻量 Toast 提示组件
 * ============================================================ */
(function() {
  if (window.__REHAB_TOAST_LOADED__) return;
  window.__REHAB_TOAST_LOADED__ = true;


let toastTimer = null;

function show(message, type, duration) {
  type = type || 'info';
  duration = duration || 2500;
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  const colors = {
    info: '#3b82c4',
    success: '#2ca02c',
    warn: '#e67e22',
    error: '#d9534f'
  };
  toast.style.cssText = 'padding:12px 24px;background:' + (colors[type] || colors.info) + ';color:#fff;border-radius:8px;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,0.15);opacity:0;transition:opacity 0.2s ease;pointer-events:auto';
  toast.textContent = message;
  container.appendChild(toast);
  requestAnimationFrame(function () {
    toast.style.opacity = '1';
  });
  if (toastTimer) clearTimeout(toastTimer);
  setTimeout(function () {
    toast.style.opacity = '0';
    setTimeout(function () {
      toast.remove();
      if (container.children.length === 0) container.remove();
    }, 200);
  }, duration);
}

function info(message, duration) { show(message, 'info', duration); }
function success(message, duration) { show(message, 'success', duration); }
function warn(message, duration) { show(message, 'warn', duration); }
function error(message, duration) { show(message, 'error', duration); }

window.Toast = { show: show, info: info, success: success, warn: warn, error: error };
})();
