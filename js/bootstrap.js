/* ============================================================
 * bootstrap.js - 应用启动引导
 * 顺序：加载数据 → 初始化 Store → 注册路由 → 渲染 Shell → 启动
 * ============================================================ */

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
  let fromSeed = false;

  try {
    if (window.RehabStorage && typeof window.RehabStorage.isAvailable === 'function' && window.RehabStorage.isAvailable()) {
      data = window.RehabStorage.load();
    }
  } catch (e) {
    console.warn('[Bootstrap] Storage.load 失败:', e);
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
    fromSeed = true;
  }

  if (!data) {
    console.error('[Bootstrap] 无法加载任何数据');
    return;
  }

  console.log('[Bootstrap] 数据已加载:', {
    patients: data.patients ? data.patients.length : 0,
    records: data.records ? data.records.length : 0,
    todos: data.todos ? data.todos.length : 0,
    fromSeed: fromSeed
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

  const store = window.createStore(data);
  window.Store = store;

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
