/* ============================================================
 * storage.js - localStorage 持久化层
 * 职责：读取、写入、迁移、备份、恢复
 * ============================================================ */
if (window.__REHAB_STORAGE_LOADED__) return;
window.__REHAB_STORAGE_LOADED__ = true;

const STORAGE_KEY = 'rehab_workbench_data';
const META_KEY = 'rehab_workbench_meta';
const BACKUP_KEY = 'rehab_workbench_backup';
const MAX_STORAGE_SIZE = 4 * 1024 * 1024;

function isAvailable() {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

function getMeta() {
  try {
    const raw = localStorage.getItem(META_KEY);
    return raw ? JSON.parse(raw) : { version: 0, updatedAt: 0 };
  } catch (e) {
    return { version: 0, updatedAt: 0 };
  }
}

function setMeta(version) {
  try {
    localStorage.setItem(META_KEY, JSON.stringify({
      version: version,
      updatedAt: Date.now()
    }));
  } catch (e) {
    console.warn('[Storage] 设置 meta 失败:', e);
  }
}

function load() {
  if (!isAvailable()) {
    console.warn('[Storage] localStorage 不可用，将使用内存数据');
    return null;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    let data = JSON.parse(raw);
    const meta = getMeta();
    if (meta.version < window.Schema.DB_VERSION) {
      console.log('[Storage] 数据版本迁移:', meta.version, '->', window.Schema.DB_VERSION);
      data = window.Schema.migrateData(data, meta.version, window.Schema.DB_VERSION);
      setMeta(window.Schema.DB_VERSION);
      save(data);
    }
    const errors = window.Schema.validateData(data);
    if (errors.length > 0) {
      console.warn('[Storage] 数据校验失败，尝试修复:', errors);
      data = window.Schema.repairData(data);
      save(data);
    }
    return data;
  } catch (e) {
    console.error('[Storage] 读取数据失败:', e);
    return loadBackup() || null;
  }
}

function save(data) {
  if (!isAvailable()) {
    console.warn('[Storage] localStorage 不可用，跳过持久化');
    return false;
  }
  try {
    const json = JSON.stringify(data);
    const size = new Blob([json]).size;
    if (size > MAX_STORAGE_SIZE) {
      console.warn('[Storage] 数据量接近上限:', (size / 1024 / 1024).toFixed(2), 'MB');
    }
    localStorage.setItem(STORAGE_KEY, json);
    setMeta(window.Schema.DB_VERSION);
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError' || e.code === 22) {
      console.error('[Storage] localStorage 容量超限');
      alert('本地存储空间不足，请导出数据后清理浏览器缓存');
    } else {
      console.error('[Storage] 保存数据失败:', e);
    }
    return false;
  }
}

function backup(data) {
  if (!isAvailable()) return false;
  try {
    localStorage.setItem(BACKUP_KEY, JSON.stringify({
      data: data,
      createdAt: Date.now(),
      version: window.Schema.DB_VERSION
    }));
    return true;
  } catch (e) {
    console.warn('[Storage] 备份失败:', e);
    return false;
  }
}

function loadBackup() {
  if (!isAvailable()) return null;
  try {
    const raw = localStorage.getItem(BACKUP_KEY);
    if (!raw) return null;
    const backup = JSON.parse(raw);
    console.log('[Storage] 从备份恢复:', new Date(backup.createdAt).toLocaleString());
    return backup.data;
  } catch (e) {
    return null;
  }
}

function exportData(data) {
  try {
    const json = JSON.stringify({
      data: data,
      version: window.Schema.DB_VERSION,
      exportedAt: Date.now()
    }, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rehab-workbench-backup-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  } catch (e) {
    console.error('[Storage] 导出失败:', e);
    return false;
  }
}

function importData(file) {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const json = JSON.parse(e.target.result);
        if (!json.data) {
          reject(new Error('文件格式错误：缺少 data 字段'));
          return;
        }
        const errors = window.Schema.validateData(json.data);
        if (errors.length > 0) {
          reject(new Error('数据校验失败：' + errors.join('; ')));
          return;
        }
        resolve(json.data);
      } catch (err) {
        reject(new Error('JSON 解析失败：' + err.message));
      }
    };
    reader.onerror = function () {
      reject(new Error('文件读取失败'));
    };
    reader.readAsText(file);
  });
}

function clearAll() {
  if (!isAvailable()) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(META_KEY);
    localStorage.removeItem(BACKUP_KEY);
    console.log('[Storage] 已清空所有本地数据');
  } catch (e) {
    console.warn('[Storage] 清空失败:', e);
  }
}

function getStorageInfo() {
  if (!isAvailable()) return { available: false, usedBytes: 0, totalBytes: 0 };
  let usedBytes = 0;
  try {
    usedBytes = (localStorage.getItem(STORAGE_KEY) || '').length +
                (localStorage.getItem(META_KEY) || '').length +
                (localStorage.getItem(BACKUP_KEY) || '').length;
  } catch (e) {}
  return {
    available: true,
    usedBytes: usedBytes,
    usedKB: (usedBytes / 1024).toFixed(2),
    warningThreshold: 4 * 1024 * 1024
  };
}

window.RehabStorage = {
  isAvailable: isAvailable,
  load: load,
  save: save,
  backup: backup,
  loadBackup: loadBackup,
  exportData: exportData,
  importData: importData,
  clearAll: clearAll,
  getInfo: getStorageInfo
};
