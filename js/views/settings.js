/* ============================================================
 * views/settings.js - 系统设置视图
 * 展示治疗师信息编辑、数据管理（导出/导入/重置/备份）、存储状态、关于
 * ============================================================ */
if (window.__REHAB_VIEW_SETTINGS_LOADED__) return;
window.__REHAB_VIEW_SETTINGS_LOADED__ = true;

/* ---------- 路由注册 ---------- */
function registerRoutes(router, store) {
  router.register('/settings', function () {
    const state = store.getState();
    return renderSettings(state, store);
  });
}

/* ---------- 辅助：构建治疗师信息编辑卡 ---------- */
function buildTherapistCard(state, store) {
  const therapist = state.therapist || {};
  const name = window.Esc.esc(therapist.name || '');
  const department = window.Esc.esc(therapist.department || '');
  const title = window.Esc.esc(therapist.title || '');

  return '' +
    '<div class="panel">' +
      '<div class="panel-hd"><span class="panel-title">治疗师信息</span></div>' +
      '<div class="form-row">' +
        '<label class="form-label">姓名</label>' +
        '<input type="text" class="form-input" data-therapist-field="name" value="' + name + '" placeholder="请输入姓名">' +
      '</div>' +
      '<div class="form-row">' +
        '<label class="form-label">科室</label>' +
        '<input type="text" class="form-input" data-therapist-field="department" value="' + department + '" placeholder="请输入科室">' +
      '</div>' +
      '<div class="form-row">' +
        '<label class="form-label">职称</label>' +
        '<input type="text" class="form-input" data-therapist-field="title" value="' + title + '" placeholder="请输入职称">' +
      '</div>' +
      '<div class="form-actions">' +
        '<button class="btn-primary" id="therapist-save">保存</button>' +
      '</div>' +
    '</div>';
}

/* ---------- 辅助：保存治疗师信息 ---------- */
function saveTherapist(store, formEl) {
  if (!formEl) return;
  var inputs = formEl.querySelectorAll('[data-therapist-field]');
  var payload = {};
  for (var i = 0; i < inputs.length; i++) {
    var el = inputs[i];
    payload[el.getAttribute('data-therapist-field')] = el.value;
  }
  if (store && typeof store.dispatch === 'function') {
    store.dispatch({
      type: 'UPDATE_THERAPIST',
      payload: payload
    });
  }
  window.Modal.toast('已保存');
}

/* ---------- 辅助：构建数据管理区块 ---------- */
function buildDataManagement(store) {
  return '' +
    '<div class="panel">' +
      '<div class="panel-hd"><span class="panel-title">数据管理</span></div>' +
      '<div class="data-actions">' +
        '<button class="btn-block" id="data-export">' +
          window.getIcon('download') + ' 导出数据' +
        '</button>' +
        '<button class="btn-block" id="data-import">' +
          window.getIcon('upload') + ' 导入数据' +
        '</button>' +
        '<button class="btn-block btn-warn" id="data-reset">' +
          window.getIcon('trash') + ' 重置数据' +
        '</button>' +
        '<button class="btn-block" id="data-backup">' +
          window.getIcon('cloud') + ' 备份数据' +
        '</button>' +
        '<input type="file" id="data-import-file" accept=".json" style="display:none">' +
      '</div>' +
    '</div>';
}

/* ---------- 辅助：处理导出 ---------- */
function handleExport() {
  if (!window.DataIO || typeof window.DataIO.export !== 'function') {
    window.Modal.toast('导出功能不可用');
    return;
  }
  try {
    const result = window.DataIO.export();
    if (result !== false) {
      window.Modal.toast('导出成功');
    } else {
      window.Modal.toast('导出失败');
    }
  } catch (e) {
    window.Modal.toast('导出异常：' + (e && e.message ? e.message : ''));
  }
}

/* ---------- 辅助：处理导入 ---------- */
function handleImportClick() {
  const fileInput = document.getElementById('data-import-file');
  if (fileInput) fileInput.click();
}

function handleImportFile(file) {
  if (!window.DataIO || typeof window.DataIO.import !== 'function') {
    window.Modal.toast('导入功能不可用');
    return;
  }
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const result = window.DataIO.import(e.target.result);
      if (result !== false) {
        window.Modal.toast('导入成功');
      } else {
        window.Modal.toast('导入失败');
      }
    } catch (err) {
      window.Modal.toast('导入异常：' + (err && err.message ? err.message : ''));
    }
  };
  reader.readAsText(file);
}

/* ---------- 辅助：处理重置 ---------- */
function handleReset() {
  window.Modal.confirm('重置确认', '重置将清除所有本地数据，确定要继续吗？', function (ok) {
    if (!ok) return;
    if (!window.DataIO || typeof window.DataIO.reset !== 'function') {
      window.Modal.toast('重置功能不可用');
      return;
    }
    try {
      const result = window.DataIO.reset();
      if (result !== false) {
        window.Modal.toast('已重置');
      } else {
        window.Modal.toast('重置失败');
      }
    } catch (e) {
      window.Modal.toast('重置异常：' + (e && e.message ? e.message : ''));
    }
  });
}

/* ---------- 辅助：处理备份 ---------- */
function handleBackup() {
  if (!window.DataIO || typeof window.DataIO.backup !== 'function') {
    window.Modal.toast('备份功能不可用');
    return;
  }
  try {
    const result = window.DataIO.backup();
    if (result !== false) {
      window.Modal.toast('备份成功');
    } else {
      window.Modal.toast('备份失败');
    }
  } catch (e) {
    window.Modal.toast('备份异常：' + (e && e.message ? e.message : ''));
  }
}

/* ---------- 辅助：构建存储状态 ---------- */
function buildStorageStatus(state) {
  const storage = (state && state.storage) || {};
  const usedKB = storage.usedKB || 0;
  const totalKB = storage.totalKB || 0;
  const freeKB = totalKB > 0 ? Math.max(totalKB - usedKB, 0) : 0;
  const usedPct = totalKB > 0 ? Math.round((usedKB / totalKB) * 100) : 0;

  const usedText = usedKB >= 1024 ? (usedKB / 1024).toFixed(2) + ' MB' : usedKB + ' KB';
  const freeText = freeKB >= 1024 ? (freeKB / 1024).toFixed(2) + ' MB' : freeKB + ' KB';

  return '' +
    '<div class="panel">' +
      '<div class="panel-hd"><span class="panel-title">存储状态</span></div>' +
      '<div class="storage-info">' +
        '<div class="storage-row">' +
          '<span>已用</span><span class="storage-val">' + window.Esc.esc(usedText) + '</span>' +
        '</div>' +
        '<div class="storage-row">' +
          '<span>可用</span><span class="storage-val">' + window.Esc.esc(freeText) + '</span>' +
        '</div>' +
        '<div class="storage-bar"><div class="storage-bar-fill" style="width:' + usedPct + '%"></div></div>' +
        '<div class="storage-pct">已使用 ' + usedPct + '%</div>' +
      '</div>' +
    '</div>';
}

/* ---------- 辅助：构建关于信息 ---------- */
function buildAbout() {
  return '' +
    '<div class="panel">' +
      '<div class="panel-hd"><span class="panel-title">关于</span></div>' +
      '<div class="about-info">' +
        '<div class="about-row"><span>版本号</span><span>v1.0.0</span></div>' +
        '<div class="about-row"><span>技术栈</span><span>原生 JavaScript (ES5)</span></div>' +
        '<div class="about-row"><span>数据存储</span><span>LocalStorage</span></div>' +
        '<div class="about-row"><span>UI 框架</span><span>轻量 CSS Components</span></div>' +
        '<div class="about-desc">本应用用于辅助康复科治疗师进行患者管理、记录、收费等日常工作。</div>' +
      '</div>' +
    '</div>';
}

/* ---------- 主渲染函数 ---------- */
function renderSettings(state, store) {
  state = state || {};

  return '' +
    '<div class="settings-view">' +
      '<div class="page-header-bar">' +
        '<div class="page-header-title">系统设置</div>' +
      '</div>' +
      buildTherapistCard(state, store) +
      buildDataManagement(store) +
      buildStorageStatus(state) +
      buildAbout() +
    '</div>';
}

// 暴露到全局
window.SettingsView = {
  registerRoutes: registerRoutes,
  render: renderSettings,
  _saveTherapist: saveTherapist,
  _handlers: {
    export: handleExport,
    importClick: handleImportClick,
    importFile: handleImportFile,
    reset: handleReset,
    backup: handleBackup
  }
};
