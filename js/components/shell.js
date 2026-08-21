/* ============================================================
 * components/shell.js - Shell 组件
 * 负责：导航渲染、事件绑定、全局交互
 * ============================================================ */
(function() {
  if (window.__REHAB_SHELL_LOADED__) return;
  window.__REHAB_SHELL_LOADED__ = true;


const NAV_CONFIG = [
  { key: 'home', path: '/', label: '概览', ic: 'home' },
  { key: 'schedule', path: '/schedule', label: '日程', ic: 'schedule' },
  { key: 'records', path: '/records', label: '记录', ic: 'records' },
  { key: 'patients', path: '/patients', label: '患者', ic: 'patients' },
  { key: 'todo', path: '/todo', label: '待办', ic: 'todo' },
  { key: 'assess', path: '/assess', label: '评估', ic: 'assess' },
  { key: 'scale', path: '/scale', label: '量表', ic: 'scale' },
  { key: 'plan', path: '/plan', label: '方案', ic: 'plan' },
  { key: 'fee', path: '/fee', label: '收费', ic: 'fee' },
  { key: 'settings', path: '/settings', label: '设置', ic: 'settings' }
];

function init(store) {
  renderNav(store);
  renderSidebar(store);
  renderTabbar(store);
  bindGlobalEvents(store);
  setupSearch(store);
}

function renderNav(store) {
  const navDesk = document.getElementById('navDesk');
  const navMobile = document.getElementById('navMobile');
  if (!navDesk || !navMobile) return;

  const therapist = store.getState().therapist;
  const navItems = NAV_CONFIG.map(function (item) {
    return '<div class="nav-item" data-path="' + item.path + '" data-nav="' + item.path + '">' +
      '<span class="nav-ic">' + (window.getIcon ? window.getIcon(item.ic) : '') + '</span>' +
      '<span class="nav-label">' + item.label + '</span>' +
    '</div>';
  }).join('');

  const brandHtml =
    '<div class="side-user">' +
      '<div class="side-avatar">' + (therapist.avatar || therapist.name.charAt(0)) + '</div>' +
      '<div class="side-user-info">' +
        '<div class="side-user-name">' + (therapist.name || '') + '</div>' +
        '<div class="side-user-dept">' + (therapist.department || '') + '</div>' +
      '</div>' +
    '</div>';

  const sideFoot = document.getElementById('sideFootDesk');
  if (sideFoot) sideFoot.innerHTML = brandHtml;

  const sideFootMobile = document.getElementById('sideFootMobile');
  if (sideFootMobile) sideFootMobile.innerHTML = brandHtml;

  navDesk.innerHTML = navItems;
  navMobile.innerHTML = navItems;
}

function renderSidebar(store) {
  const drawer = document.getElementById('mDrawer');
  if (!drawer) return;
}

function renderTabbar(store) {
  const tabbar = document.getElementById('tabbar');
  if (!tabbar) return;

  const mobileNav = NAV_CONFIG.filter(function (item) {
    return ['home', 'schedule', 'records', 'patients', 'todo'].includes(item.key);
  });

  tabbar.innerHTML = mobileNav.map(function (item) {
    return '<div class="tab-item" data-path="' + item.path + '" data-nav="' + item.path + '">' +
      '<div class="tab-ic">' + (window.getIcon ? window.getIcon(item.ic) : '') + '</div>' +
      '<div class="tab-label">' + item.label + '</div>' +
    '</div>';
  }).join('');
}

function bindGlobalEvents(store) {
  const hamburger = document.getElementById('hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', function () {
      const drawer = document.getElementById('mDrawer');
      if (drawer) {
        drawer.style.display = 'flex';
      }
    });
  }

  const backdrop = document.querySelector('[data-close-drawer]');
  if (backdrop) {
    backdrop.addEventListener('click', function () {
      const drawer = document.getElementById('mDrawer');
      if (drawer) drawer.style.display = 'none';
    });
  }

  const btnPlus = document.getElementById('btnPlus');
  if (btnPlus) {
    btnPlus.addEventListener('click', function () {
      showQuickActions(store);
    });
  }

  const fab = document.getElementById('fab');
  if (fab) {
    fab.addEventListener('click', function () {
      showQuickActions(store);
    });
  }

  const btnNotify = document.getElementById('btnNotify');
  if (btnNotify) {
    btnNotify.addEventListener('click', function () {
    });
  }
}

function showQuickActions(store) {
  const actions = [
    { label: '新增患者', path: '/patients' },
    { label: '新增预约', path: '/schedule' },
    { label: '新增记录', path: '/records' },
    { label: '新增待办', path: '/todo' }
  ];

  const html =
    '<div class="quick-actions">' +
      actions.map(function (a) {
        return '<button class="quick-btn" data-nav="' + a.path + '">' + a.label + '</button>';
      }).join('') +
    '</div>';

  window.Modal && window.Modal.open({
    title: '快速新增',
    content: html,
    confirmText: '关闭',
    cancelText: '',
    onConfirm: function (dialog) { return true; }
  });
}

function setupSearch(store) {
  const searchInput = document.getElementById('globalSearch');
  if (!searchInput) return;

  let timer = null;
  searchInput.addEventListener('input', function (e) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () {
      const query = e.target.value.trim().toLowerCase();
      if (query.length > 0) {
        performSearch(store, query);
      } else {
        if (window.Router) window.Router.navigate('/');
      }
    }, 300);
  });
}

function performSearch(store, query) {
  const state = store.getState();
  const results = {
    patients: state.patients.filter(function (p) {
      return p.name.toLowerCase().includes(query) || (p.diagnosis || '').toLowerCase().includes(query);
    }).slice(0, 3),
    records: state.records.filter(function (r) {
      return r.title.toLowerCase().includes(query) || (r.summary || '').toLowerCase().includes(query);
    }).slice(0, 5),
    scales: (state.scaleLibrary || []).filter(function (s) {
      return s.name.toLowerCase().includes(query) || s.key.toLowerCase().includes(query);
    }).slice(0, 3)
  };

  const html = buildSearchResults(results, query);
  const view = document.getElementById('view');
  if (view) view.innerHTML = html;
}

function buildSearchResults(results, query) {
  const hasResults = results.patients.length > 0 || results.records.length > 0 || results.scales.length > 0;
  if (!hasResults) {
    return '<div class="empty-state"><div class="empty-emoji">🔍</div><div class="empty-title">没有找到"' + window.Esc.esc(query) + '"</div><div class="empty-desc">试试其他关键词</div></div>';
  }

  let html = '<div class="search-results"><h2>搜索结果: "' + window.Esc.esc(query) + '"</h2>';

  if (results.patients.length > 0) {
    html += '<div class="search-section"><div class="search-section-title">患者</div>';
    html += results.patients.map(function (p) {
      return '<div class="search-item" data-nav="/patients">' +
        '<div class="search-item-avatar">' + p.name.charAt(0) + '</div>' +
        '<div class="search-item-info"><div class="search-item-name">' + window.Esc.esc(p.name) + '</div>' +
        '<div class="search-item-desc">' + window.Esc.esc(p.diagnosis || '') + '</div></div></div>';
    }).join('');
    html += '</div>';
  }

  if (results.records.length > 0) {
    html += '<div class="search-section"><div class="search-section-title">记录</div>';
    html += results.records.map(function (r) {
      return '<div class="search-item"><div class="search-item-avatar">📝</div>' +
        '<div class="search-item-info"><div class="search-item-name">' + window.Esc.esc(r.title) + '</div>' +
        '<div class="search-item-desc">' + window.Esc.esc(r.summary || '') + '</div></div></div>';
    }).join('');
    html += '</div>';
  }

  if (results.scales.length > 0) {
    html += '<div class="search-section"><div class="search-section-title">量表</div>';
    html += results.scales.map(function (s) {
      return '<div class="search-item"><div class="search-item-avatar">📊</div>' +
        '<div class="search-item-info"><div class="search-item-name">' + window.Esc.esc(s.name) + '</div>' +
        '<div class="search-item-desc">' + window.Esc.esc(s.category) + '</div></div></div>';
    }).join('');
    html += '</div>';
  }

  return html + '</div>';
}

window.Shell = {
  init: init,
  renderNav: renderNav,
  renderTabbar: renderTabbar,
  NAV_CONFIG: NAV_CONFIG
};
})();
