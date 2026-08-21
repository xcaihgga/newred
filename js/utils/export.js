/* ============================================================
 * utils/export.js - 数据导出导入封装
 * ============================================================ */
if (window.__REHAB_EXPORT_LOADED__) return;
window.__REHAB_EXPORT_LOADED__ = true;

function exportData() {
  if (!window.RehabStorage) return false;
  const state = window.Store ? window.Store.getState() : null;
  if (!state) return false;
  return window.RehabStorage.exportData(state);
}

function importData(file) {
  if (!window.RehabStorage) return Promise.reject(new Error('Storage 未就绪'));
  return window.RehabStorage.importData(file);
}

function resetData() {
  if (!window.RehabStorage) return false;
  const seed = window.Seed ? window.Seed.data : null;
  if (!seed) return false;
  window.RehabStorage.save(seed);
  if (window.Store) {
    window.Store.dispatch({ type: 'HYDRATE', payload: seed });
  }
  return true;
}

function backupNow() {
  if (!window.RehabStorage) return false;
  const state = window.Store ? window.Store.getState() : null;
  if (!state) return false;
  return window.RehabStorage.backup(state);
}

window.DataIO = {
  export: exportData,
  import: importData,
  reset: resetData,
  backup: backupNow
};
