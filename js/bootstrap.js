/* ============================================================
 * bootstrap.js - 应用启动引导
 * 顺序：加载数据 → 初始化 Store → 注册路由 → 渲染 Shell → 启动
 * ============================================================ */
(function() {
  if (window.__REHAB_BOOTSTRAP_LOADED__) return;
  window.__REHAB_BOOTSTRAP_LOADED__ = true;


console.log('[Bootstrap] bootstrap.js 已加载');
console.log('[Bootstrap] window.RehabStorage exists:', typeof window.RehabStorage !== 'undefined');
console.log('[Bootstrap] window.Schema exists:', typeof window.Schema !== 'undefined');
console.log('[Bootstrap] window.createStore exists:', typeof window.createStore !== 'undefined');
console.log('[Bootstrap] window.Seed exists:', typeof window.Seed !== 'undefined');

function init() {
  console.log('[Bootstrap] 初始化个人康复工作台 v2.0');

  const container = document.getElementById('view');
  if (!container) {
    console.error('[Bootstrap] 找不到 #view 容器');
    return;
  }

  container.innerHTML = '<div class="empty-state">加载中...</div>';

  setTimeout(function () {
    try {
      bootstrap();
    } catch (e) {
      console.error('[Bootstrap] 启动失败:', e);
      container.innerHTML =
        '<div class="error-state">' +
          '<div class="error-title">😵 启动失败</div>' +
          '<div class="error-desc">' + (e.message || '未知错误') + '</div>' +
          '<button class="btn btn-primary" onclick="location.reload()">刷新重试</button>' +
        '</div>';
    }
  }, 50);
}

function bootstrap() {
  console.log('[Bootstrap] 正在加载数据...');
  console.log('[Bootstrap] window.RehabStorage:', typeof window.RehabStorage);
  console.log('[Bootstrap] window.RehabStorage.isAvailable:', window.RehabStorage ? typeof window.RehabStorage.isAvailable : 'N/A');

  let data = null;
  let loadStatus = 'unknown';

  try {
    if (window.RehabStorage && typeof window.RehabStorage.isAvailable === 'function' && window.RehabStorage.isAvailable()) {
      data = window.RehabStorage.load();
      loadStatus = window.RehabStorage.getLastLoadStatus ? window.RehabStorage.getLastLoadStatus() : 'unknown';
    }
  } catch (e) {
    console.warn('[Bootstrap] Storage.load 失败:', e);
  }

  // 数据损坏且无备份可恢复 → 不要静默覆盖，交给用户处理
  if (!data && loadStatus === 'corrupt') {
    renderCorruptState();
    return;
  }

  if (!data && window.Seed) {
    console.log('[Bootstrap] localStorage 为空，使用种子数据');
    data = JSON.parse(JSON.stringify(window.Seed.data));
    try {
      if (window.RehabStorage && typeof window.RehabStorage.isAvailable === 'function' && window.RehabStorage.isAvailable()) {
        window.RehabStorage.save(data);
      }
    } catch (e) {
      console.warn('[Bootstrap] Storage.save 失败:', e);
    }
    loadStatus = 'empty';
  }

  if (!data) {
    console.error('[Bootstrap] 无法加载任何数据');
    return;
  }

  console.log('[Bootstrap] 数据已加载:', {
    patients: data.patients ? data.patients.length : 0,
    records: data.records ? data.records.length : 0,
    todos: data.todos ? data.todos.length : 0,
    loadStatus: loadStatus
  });

  if (window.Schema) {
    const errors = window.Schema.validateData(data);
    if (errors.length > 0) {
      console.warn('[Bootstrap] 数据校验错误，尝试修复:', errors);
      data = window.Schema.repairData(data);
      if (window.RehabStorage && window.RehabStorage.isAvailable()) {
        window.RehabStorage.save(data);
      }
    }
  }

  // 启动时写一次"最后完好快照"，补上自动恢复链
  try {
    if (window.RehabStorage && typeof window.RehabStorage.backup === 'function') {
      window.RehabStorage.backup(data);
    }
  } catch (e) {
    console.warn('[Bootstrap] 启动备份失败:', e);
  }

  const store = window.createStore(data);
  window.Store = store;

  // 注册通用 reducer（否则所有 dispatch 写入都无效）
  if (typeof window.createGenericReducers === 'function') {
    window.createGenericReducers(store);
  }

  console.log('[Bootstrap] Store 已初始化');

  if (window.Router) {
    window.Router.setStore(store);
    
    if (window.DashboardView) window.DashboardView.registerRoutes(window.Router, store);
    if (window.ScheduleView) window.ScheduleView.registerRoutes(window.Router, store);
    if (window.RecordsView) window.RecordsView.registerRoutes(window.Router, store);
    if (window.PatientsView) window.PatientsView.registerRoutes(window.Router, store);
    if (window.PatientDetailView) window.PatientDetailView.registerRoutes(window.Router, store);
    if (window.TodoView) window.TodoView.registerRoutes(window.Router, store);
    if (window.AssessView) window.AssessView.registerRoutes(window.Router, store);
    if (window.ScaleView) window.ScaleView.registerRoutes(window.Router, store);
    if (window.PlanView) window.PlanView.registerRoutes(window.Router, store);
    if (window.FeeView) window.FeeView.registerRoutes(window.Router, store);
    if (window.SettingsView) window.SettingsView.registerRoutes(window.Router, store);
  }

  if (window.Shell) {
    window.Shell.init(store);
  }

  if (window.Router) {
    window.Router.start('/');
    console.log('[Bootstrap] 路由已启动');
  }

  setupOfflineDetection();

  window.addEventListener('error', function (e) {
    console.error('[Bootstrap] 全局错误:', e.error || e.message);
  });

  console.log('[Bootstrap] 启动完成 ✓');
}

/* ---------- 数据损坏时的兜底界面（不覆盖原数据） ---------- */
function renderCorruptState() {
  const container = document.getElementById('view');
  if (!container) {
    alert('本地数据文件损坏，无法读取。请打开浏览器开发者工具导出 localStorage 中的原始数据。');
    return;
  }
  container.innerHTML = '' +
    '<div class="error-state">' +
      '<div class="error-title">😰 本地数据文件损坏，无法读取</div>' +
      '<div class="error-desc">原始数据没有被删除，请先导出备份再处理。</div>' +
      '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:16px">' +
        '<button class="btn btn-primary" id="btnExportRaw">下载原始数据文件</button>' +
        '<button class="btn" id="btnResetData">清除并重新开始</button>' +
      '</div>' +
    '</div>';

  const exportBtn = document.getElementById('btnExportRaw');
  if (exportBtn) {
    exportBtn.addEventListener('click', function () {
      if (window.RehabStorage && typeof window.RehabStorage.exportRaw === 'function') {
        const ok = window.RehabStorage.exportRaw();
        if (ok) window.alert('已下载原始数据文件，可尝试用文本编辑器修复后，在「设置→导入数据」中恢复。');
      }
    });
  }
  const resetBtn = document.getElementById('btnResetData');
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      if (window.Modal && typeof window.Modal.confirm === 'function') {
        window.Modal.confirm('清除并重新开始', '将删除本地损坏数据并恢复示例数据，此操作不可撤销。确认继续？', function () {
          if (window.RehabStorage && typeof window.RehabStorage.clearAll === 'function') {
            window.RehabStorage.clearAll();
          }
          window.location.reload();
        });
      } else {
        window.RehabStorage.clearAll();
        window.location.reload();
      }
    });
  }
  console.error('[Bootstrap] 数据损坏，等待用户处理');
}

function setupOfflineDetection() {
  function updateOnlineStatus() {
    const banner = document.getElementById('pwa_offline_banner');
    if (navigator.onLine) {
      if (banner) banner.remove();
    } else {
      if (!banner) {
        const div = document.createElement('div');
        div.id = 'pwa_offline_banner';
        div.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#e67e22;color:#fff;text-align:center;padding:8px;font-size:13px;z-index:9999';
        div.textContent = '📴 当前离线，数据已保存，联网后自动同步';
        document.body.appendChild(div);
      }
    }
  }
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();
