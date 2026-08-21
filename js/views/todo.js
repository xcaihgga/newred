/* ============================================================
 * views/todo.js - 待办列表视图
 * 展示未完成待办数、今日/本周/已完成 分组，支持勾选与新增
 * ============================================================ */
(function() {
  if (window.__REHAB_VIEW_TODO_LOADED__) return;
  window.__REHAB_VIEW_TODO_LOADED__ = true;


/* ---------- 路由注册 ---------- */
function registerRoutes(router, store) {
  router.register('/todo', function () {
    const state = store.getState();
    return renderTodo(state, store);
  });
}

/* ---------- 辅助：获取今天日期字符串 YYYY-MM-DD ---------- */
function getTodayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = ('0' + (d.getMonth() + 1)).slice(-2);
  const day = ('0' + d.getDate()).slice(-2);
  return y + '-' + m + '-' + day;
}

/* ---------- 辅助：获取本周一日期字符串 ---------- */
function getWeekStartStr() {
  const d = new Date();
  const day = d.getDay() || 7;
  d.setDate(d.getDate() - (day - 1));
  const y = d.getFullYear();
  const m = ('0' + (d.getMonth() + 1)).slice(-2);
  const dayStr = ('0' + d.getDate()).slice(-2);
  return y + '-' + m + '-' + dayStr;
}

/* ---------- 辅助：判断待办所属分组 ---------- */
function groupTodo(todo) {
  if (todo.done) return 'done';
  const today = getTodayStr();
  const weekStart = getWeekStartStr();
  const due = todo.due || '';
  if (due === today) return 'today';
  if (due >= weekStart) return 'week';
  return 'week';
}

/* ---------- 辅助：优先级颜色 ---------- */
function levelClass(level) {
  return 'level-' + (level || 'mid');
}

function levelLabel(level) {
  return { high: '高', mid: '中', low: '低' }[level || 'mid'] || '中';
}

/* ---------- 辅助：构建待办条目 ---------- */
function buildTodoItem(todo) {
  const id = window.Esc.escAttr(todo.id);
  const text = window.Esc.esc(todo.text || '');
  const done = todo.done ? ' checked' : '';
  const level = todo.level || 'mid';
  const levelCls = levelClass(level);
  const levelTxt = levelLabel(level);
  const due = window.Esc.esc(todo.due || '无截止');

  return '' +
    '<div class="todo-item' + done + '" data-todo-id="' + id + '">' +
      '<label class="todo-check">' +
        '<input type="checkbox" data-todo-check="' + id + '"' + (todo.done ? ' checked' : '') + '>' +
        '<span class="todo-check-box"></span>' +
      '</label>' +
      '<div class="todo-body">' +
        '<div class="todo-text">' + text + '</div>' +
        '<div class="todo-due">截止：' + due + '</div>' +
      '</div>' +
      '<span class="todo-level ' + levelCls + '">' + levelTxt + '</span>' +
    '</div>';
}

/* ---------- 辅助：构建分组区块 ---------- */
function buildGroup(title, todos, emptyText) {
  if (todos.length === 0) {
    return '' +
      '<div class="panel">' +
        '<div class="panel-hd">' +
          '<span class="panel-title">' + window.Esc.esc(title) + '</span>' +
          '<span class="panel-count">' + todos.length + ' 条</span>' +
        '</div>' +
        '<div class="panel-empty">' + window.Esc.esc(emptyText || '暂无待办') + '</div>' +
      '</div>';
  }

  const items = todos.map(buildTodoItem).join('');

  return '' +
    '<div class="panel">' +
      '<div class="panel-hd">' +
        '<span class="panel-title">' + window.Esc.esc(title) + '</span>' +
        '<span class="panel-count">' + todos.length + ' 条</span>' +
      '</div>' +
      '<div class="todo-list">' + items + '</div>' +
    '</div>';
}

/* ---------- 辅助：处理新增待办 ---------- */
function promptAddTodo(store) {
  const result = window.Modal.prompt('新增待办', '请输入待办内容：');
  if (!result) return;
  const text = (result.text || '').trim();
  if (!text) {
    window.Modal.toast('内容不能为空');
    return;
  }
  const due = result.due || '';
  const level = result.level || 'mid';
  store.dispatch({
    type: 'ADD_TODO',
    payload: {
      id: 'todo_' + Date.now(),
      text: text,
      level: level,
      due: due,
      done: false
    }
  });
  window.Modal.toast('已添加');
}

/* ---------- 辅助：处理勾选切换 ---------- */
function toggleTodo(store, id, done) {
  store.dispatch({
    type: 'UPDATE_TODO',
    payload: { id: id, done: done }
  });
}

/* ---------- 主渲染函数 ---------- */
function renderTodo(state, store) {
  state = state || {};
  const todos = state.todos || [];

  const undoneCount = todos.filter(function (t) { return !t.done; }).length;
  const todayTodos = todos.filter(function (t) { return groupTodo(t) === 'today'; });
  const weekTodos = todos.filter(function (t) { return groupTodo(t) === 'week'; });
  const doneTodos = todos.filter(function (t) { return groupTodo(t) === 'done'; });

  const title = window.Esc.esc('待办列表');

  return '' +
    '<div class="todo-view">' +
      '<div class="page-header-bar">' +
        '<div class="page-header-title">' + title + '</div>' +
        '<div class="page-header-meta">未完成 <span class="todo-undone-count">' + undoneCount + '</span> 条</div>' +
      '</div>' +
      buildGroup('今日待办', todayTodos, '今日无待办安排') +
      buildGroup('本周待办', weekTodos, '本周无待办安排') +
      buildGroup('已完成', doneTodos, '暂无已完成待办') +
      '<div class="todo-footer">' +
        '<button class="btn btn-primary todo-add-btn" data-todo-add>' +
          '<span class="btn-icon">＋</span>' +
          '<span>新增待办</span>' +
        '</button>' +
      '</div>' +
    '</div>';
}

// 暴露到全局
window.TodoView = {
  registerRoutes: registerRoutes,
  render: renderTodo,
  _toggleTodo: toggleTodo,
  _promptAddTodo: promptAddTodo
};
})();
