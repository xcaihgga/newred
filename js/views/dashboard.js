/* ============================================================
 * views/dashboard.js - 概览页视图
 * 展示欢迎横幅、统计卡片、今日预约、待办、快捷入口、打卡进度
 * ============================================================ */

/* ---------- 路由注册 ---------- */
function registerRoutes(router, store) {
  // 注册 '/' 路由，渲染概览页
  router.register('/', function () {
    const state = store.getState();
    return renderDashboard(state);
  });
}

/* ---------- 辅助：格式化日期为中文 ---------- */
function formatChineseDate() {
  const d = new Date();
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日 ' + weekdays[d.getDay()];
}

/* ---------- 辅助：查找患者名 ---------- */
function getPatientName(state, patientId) {
  if (!state.patients || !patientId) return '未知患者';
  const p = state.patients.find(function (x) { return x.id === patientId; });
  return p ? p.name : '未知患者';
}

/* ---------- 辅助：构建统计卡片 HTML ---------- */
function buildStatsCards(state) {
  const stats = state.stats || {};
  const cards = [
    { label: '今日预约', value: stats.todayAppt || 0, icon: 'schedule', color: '#3b82c4' },
    { label: '已完成', value: stats.todayDone || 0, icon: 'check', color: '#10b981' },
    { label: '记录数', value: (state.records || []).length, icon: 'records', color: '#8b5fbf' },
    { label: '待办数', value: (state.todos || []).filter(function (t) { return !t.done; }).length, icon: 'todo', color: '#d9804a' }
  ];

  return cards.map(function (c) {
    return '' +
      '<div class="stat-card">' +
        '<div class="stat-icon" style="color:' + c.color + '">' + window.getIcon(c.icon) + '</div>' +
        '<div class="stat-body">' +
          '<div class="stat-value">' + c.value + '</div>' +
          '<div class="stat-label">' + window.Esc.esc(c.label) + '</div>' +
        '</div>' +
      '</div>';
  }).join('');
}

/* ---------- 辅助：构建欢迎横幅 ---------- */
function buildWelcome(state) {
  const therapist = state.therapist || {};
  const name = window.Esc.esc(therapist.name || '治疗师');
  const dept = window.Esc.esc(therapist.department || '');
  const date = formatChineseDate();
  const avatar = window.Esc.esc(therapist.avatar || (therapist.name || '?').charAt(0));

  return '' +
    '<div class="welcome-banner">' +
      '<div class="welcome-avatar">' + avatar + '</div>' +
      '<div class="welcome-info">' +
        '<div class="welcome-title">你好，' + name + ' 👋</div>' +
        '<div class="welcome-sub">' + window.Esc.esc(dept) + ' · ' + date + '</div>' +
      '</div>' +
    '</div>';
}

/* ---------- 辅助：构建今日预约列表 ---------- */
function buildAppointments(state) {
  const appts = (state.appointments || [])
    .filter(function (a) { return a.date === 'today'; })
    .sort(function (a, b) { return a.time.localeCompare(b.time); });

  if (appts.length === 0) {
    return '' +
      '<div class="panel">' +
        '<div class="panel-hd"><span class="panel-title">今日预约</span></div>' +
        '<div class="panel-empty">暂无预约安排</div>' +
      '</div>';
  }

  const items = appts.map(function (a) {
    const patientName = window.Esc.esc(getPatientName(state, a.patientId));
    const type = window.Esc.esc(a.type || '');
    const note = window.Esc.esc(a.note || '');
    const time = window.Esc.esc(a.time || '');
    const color = window.Esc.escAttr(a.color || '#3b82c4');

    return '' +
      '<a class="appt-item" data-nav="/schedule">' +
        '<div class="appt-time">' + time + '</div>' +
        '<div class="appt-dot" style="background:' + color + '"></div>' +
        '<div class="appt-body">' +
          '<div class="appt-name">' + patientName + '</div>' +
          '<div class="appt-meta">' + type + (note ? ' · ' + note : '') + '</div>' +
        '</div>' +
        '<div class="appt-arrow">' + window.getIcon('chevronRight') + '</div>' +
      '</a>';
  }).join('');

  return '' +
    '<div class="panel">' +
      '<div class="panel-hd">' +
        '<span class="panel-title">今日预约</span>' +
        '<span class="panel-more" data-nav="/schedule">查看全部 ' + appts.length + ' 条 ›</span>' +
      '</div>' +
      '<div class="appt-timeline">' + items + '</div>' +
    '</div>';
}

/* ---------- 辅助：构建待办列表前 3 条 ---------- */
function buildTodos(state) {
  const todos = (state.todos || [])
    .filter(function (t) { return !t.done; })
    .slice(0, 3);

  if (todos.length === 0) {
    return '' +
      '<div class="panel">' +
        '<div class="panel-hd"><span class="panel-title">待办事项</span></div>' +
        '<div class="panel-empty">当前没有待办 🎉</div>' +
      '</div>';
  }

  const items = todos.map(function (t) {
    const text = window.Esc.esc(t.text || '');
    const due = window.Esc.esc(t.due || '');
    const level = t.level || 'mid';
    const levelLabel = { high: '高', mid: '中', low: '低' }[level] || '中';

    return '' +
      '<a class="todo-item" data-nav="/todo">' +
        '<span class="todo-level level-' + level + '">' + levelLabel + '</span>' +
        '<div class="todo-body">' +
          '<div class="todo-text">' + text + '</div>' +
          '<div class="todo-due">截止：' + due + '</div>' +
        '</div>' +
        '<div class="todo-arrow">' + window.getIcon('chevronRight') + '</div>' +
      '</a>';
  }).join('');

  return '' +
    '<div class="panel">' +
      '<div class="panel-hd">' +
        '<span class="panel-title">待办事项</span>' +
        '<span class="panel-more" data-nav="/todo">查看全部 ›</span>' +
      '</div>' +
      '<div class="todo-list">' + items + '</div>' +
    '</div>';
}

/* ---------- 辅助：构建快捷入口网格 ---------- */
function buildQuickActions() {
  const actions = [
    { label: '新增评估', icon: 'assess', path: '/assess' },
    { label: '新增量表', icon: 'scale', path: '/scale' },
    { label: '查看记录', icon: 'records', path: '/records' },
    { label: '导出数据', icon: 'download', path: '/records' }
  ];

  const items = actions.map(function (a) {
    return '' +
      '<a class="quick-item" data-nav="' + window.Esc.escAttr(a.path) + '">' +
        '<div class="quick-icon">' + window.getIcon(a.icon) + '</div>' +
        '<div class="quick-label">' + window.Esc.esc(a.label) + '</div>' +
      '</a>';
  }).join('');

  return '' +
    '<div class="panel">' +
      '<div class="panel-hd"><span class="panel-title">快捷入口</span></div>' +
      '<div class="quick-grid">' + items + '</div>' +
    '</div>';
}

/* ---------- 辅助：构建打卡进度卡片 ---------- */
function buildCheckins(state) {
  const checkins = state.checkins || [];

  if (checkins.length === 0) {
    return '' +
      '<div class="panel">' +
        '<div class="panel-hd"><span class="panel-title">打卡进度</span></div>' +
        '<div class="panel-empty">暂无打卡项目</div>' +
      '</div>';
  }

  const items = checkins.map(function (c) {
    const name = window.Esc.esc(c.name || '');
    const emoji = window.Esc.esc(c.emoji || '✅');
    const streak = c.streak || 0;
    const doneCls = c.done ? ' done' : '';
    const statusIcon = c.done ? window.getIcon('check') : '';
    const statusText = c.done ? '已完成' : '未完成';

    return '' +
      '<div class="checkin-item' + doneCls + '">' +
        '<div class="checkin-emoji">' + emoji + '</div>' +
        '<div class="checkin-body">' +
          '<div class="checkin-name">' + name + '</div>' +
          '<div class="checkin-streak">🔥 连续 ' + streak + ' 天</div>' +
        '</div>' +
        '<div class="checkin-status">' +
          '<span class="status-icon">' + statusIcon + '</span>' +
          '<span class="status-text">' + statusText + '</span>' +
        '</div>' +
      '</div>';
  }).join('');

  const doneCount = checkins.filter(function (c) { return c.done; }).length;
  const total = checkins.length;
  const percent = Math.round((doneCount / total) * 100);

  return '' +
    '<div class="panel checkin-panel">' +
      '<div class="panel-hd">' +
        '<span class="panel-title">打卡进度</span>' +
        '<span class="checkin-progress">' + doneCount + '/' + total + ' · ' + percent + '%</span>' +
      '</div>' +
      '<div class="checkin-bar"><div class="checkin-bar-fill" style="width:' + percent + '%"></div></div>' +
      '<div class="checkin-list">' + items + '</div>' +
    '</div>';
}

/* ---------- 主渲染函数 ---------- */
function renderDashboard(state) {
  // 确保 state 存在
  state = state || {};

  return '' +
    '<div class="dashboard-view">' +
      // 欢迎横幅
      buildWelcome(state) +
      // 统计卡片组（4列网格）
      '<div class="stats-grid">' + buildStatsCards(state) + '</div>' +
      // 今日预约列表
      buildAppointments(state) +
      // 待办列表前3条
      buildTodos(state) +
      // 快捷入口网格
      buildQuickActions() +
      // 打卡进度卡片
      buildCheckins(state) +
    '</div>';
}

// 暴露到全局
window.DashboardView = {
  registerRoutes: registerRoutes,
  render: renderDashboard
};
