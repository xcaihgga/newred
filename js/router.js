/* ============================================================
 * router.js - 轻量路由系统
 * 支持 hash 路由、参数解析、生命周期钩子
 * ============================================================ */

const routes = [];
let currentRoute = null;
let beforeRouteChange = null;
let afterRouteChange = null;
let storeRef = null;

function register(pattern, handler) {
  routes.push({ pattern: pattern, handler: handler });
}

function before(handler) {
  beforeRouteChange = handler;
}

function after(handler) {
  afterRouteChange = handler;
}

function setStore(store) {
  storeRef = store;
}

function parseHash() {
  const hash = window.location.hash.replace('#', '') || '/';
  const queryIdx = hash.indexOf('?');
  const pathStr = queryIdx !== -1 ? hash.substring(0, queryIdx) : hash;
  const parts = pathStr.split('/').filter(Boolean);
  const fullPath = '/' + parts.join('/');
  const query = queryIdx !== -1 ? parseQuery(hash.substring(queryIdx + 1)) : {};
  
  const match = matchRoute(fullPath);
  return {
    path: fullPath,
    params: match ? match.params : {},
    matchedPattern: match ? match.pattern : fullPath,
    query: query
  };
}

function parseQuery(qs) {
  const query = {};
  qs.split('&').forEach(function (pair) {
    const idx = pair.indexOf('=');
    if (idx !== -1) {
      query[decodeURIComponent(pair.substring(0, idx))] = decodeURIComponent(pair.substring(idx + 1));
    }
  });
  return query;
}

function matchRoute(path) {
  const pathParts = path.split('/').filter(Boolean);
  let bestMatch = null;
  let bestScore = -1;
  
  routes.forEach(function (route) {
    const patternParts = route.pattern.split('/').filter(Boolean);
    if (patternParts.length !== pathParts.length) return;
    
    let score = 0;
    let matched = true;
    const params = {};
    
    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i];
      const pathPart = pathParts[i];
      
      if (patternPart.startsWith(':')) {
        params[patternPart.substring(1)] = pathPart;
        score += 1;
      } else if (patternPart === pathPart) {
        score += 10;
      } else {
        matched = false;
        break;
      }
    }
    
    if (matched && score > bestScore) {
      bestScore = score;
      bestMatch = { pattern: route.pattern, handler: route.handler, params: params };
    }
  });
  
  return bestMatch;
}

function resolvePath(rawPath) {
  const parts = rawPath.split('/').filter(Boolean);
  if (parts.length === 0) return '/';
  if (parts.length >= 2) {
    return '/' + parts.slice(0, 1).join('/') + '/:id';
  }
  return '/' + parts[0];
}

function navigate(path, replace) {
  if (replace) {
    const oldPush = window.history.pushState;
    window.history.pushState = function () {};
    window.location.hash = '#' + path;
    window.history.pushState = oldPush;
  } else {
    window.location.hash = '#' + path;
  }
}

function start(defaultPath) {
  if (!window.location.hash) {
    window.location.hash = '#' + (defaultPath || '/');
  }
  window.addEventListener('hashchange', function () {
    handleRoute();
  });
  handleRoute();
}

function handleRoute() {
  const route = parseHash();
  
  if (beforeRouteChange) {
    const result = beforeRouteChange(route, currentRoute);
    if (result === false) return;
  }

  currentRoute = route;

  const matched = matchRoute(route.path);
  if (matched) {
    try {
      const html = matched.handler(route.params, route.query);
      const view = document.getElementById('view');
      if (view) {
        view.innerHTML = html || '<div class="empty-state">页面加载中...</div>';
        bindRouteEvents(route.path);
        bindDynamicEvents();
      }
    } catch (e) {
      console.error('[Router] 渲染错误:', e);
      const view = document.getElementById('view');
      if (view) {
        view.innerHTML = '<div class="error-state"><div class="error-title">😵 页面出错了</div><div class="error-desc">' + (window.Esc ? window.Esc.esc(e.message) : e.message) + '</div><button class="btn btn-primary" id="retryRoute">重试</button></div>';
        const retryBtn = document.getElementById('retryRoute');
        if (retryBtn) retryBtn.addEventListener('click', function () { window.location.reload(); });
      }
    }
  } else {
    const view = document.getElementById('view');
    if (view) {
      view.innerHTML = '<div class="empty-state"><div class="empty-emoji">🤔</div><div class="empty-title">页面不存在</div><button class="btn btn-primary" data-nav="/">返回首页</button></div>';
      bindRouteEvents('/');
    }
  }

  updateNavActive(route.path);
  updatePageTitle(route.path);

  if (afterRouteChange) {
    afterRouteChange(route);
  }
}

function bindDynamicEvents() {
  if (window.TodoView) {
    document.querySelectorAll('[data-todo-check]').forEach(function (el) {
      if (!el._bound) {
        el._bound = true;
        el.addEventListener('change', function () {
          const id = el.getAttribute('data-todo-check');
          if (id && storeRef) {
            const todo = storeRef.getState().todos.find(function (t) { return t.id === id; });
            if (todo) {
              storeRef.dispatch({
                type: 'UPDATE_TODO',
                payload: { id: id, done: !todo.done }
              });
            }
          }
        });
      }
    });
  }
}

function refresh() {
  handleRoute();
}

function updateNavActive(activePath) {
  document.querySelectorAll('.nav-item').forEach(function (el) {
    const path = el.getAttribute('data-path');
    if (path === activePath || (path === '/' && activePath === '/')) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });
}

function updatePageTitle(path) {
  const titleMap = {
    '/': '今日概览',
    '/schedule': '日程管理',
    '/records': '记录中心',
    '/patients': '患者管理',
    '/todo': '待办事项',
    '/assess': '评估记录',
    '/scale': '量表库',
    '/plan': '康复方案',
    '/fee': '收费项目',
    '/settings': '系统设置'
  };
  const navEl = document.getElementById('pageTitle');
  if (navEl) navEl.textContent = titleMap[path] || '个人康复工作台';
}

function bindRouteEvents(path) {
  document.querySelectorAll('[data-nav]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      const target = el.getAttribute('data-nav');
      if (target) navigate(target);
    });
  });
}

function getCurrentRoute() {
  return currentRoute;
}

window.Router = {
  register: register,
  navigate: navigate,
  start: start,
  before: before,
  after: after,
  setStore: setStore,
  refresh: refresh,
  getCurrentRoute: getCurrentRoute,
  parseHash: parseHash,
  resolvePath: resolvePath
};
