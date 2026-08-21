/* ============================================================
 * views/schedule.js - 日程管理视图
 * 展示预约列表时间线，支持今天/本周切换筛选
 * ============================================================ */
(function() {
  if (window.__REHAB_VIEW_SCHEDULE_LOADED__) return;
  window.__REHAB_VIEW_SCHEDULE_LOADED__ = true;


/* ---------- 路由注册 ---------- */
function registerRoutes(router, store) {
  router.register('/schedule', function () {
    const state = store.getState();
    return renderSchedule(state);
  });
}

/* ---------- 辅助：查找患者名 ---------- */
function getPatientName(state, patientId) {
  if (!state.patients || !patientId) return '未知患者';
  const p = state.patients.find(function (x) { return x.id === patientId; });
  return p ? p.name : '未知患者';
}

/* ---------- 辅助：获取类型颜色 ---------- */
function getTypeColor(type) {
  const map = {
    '评估': '#0e9488',
    '检查': '#3b82c4',
    '量表': '#8b5fbf',
    '方案': '#d9804a',
    '治疗': '#4f9e63',
    '影像': '#d9534f'
  };
  return map[type] || '#3b82c4';
}

/* ---------- 辅助：构建切换按钮 ---------- */
function buildFilterTabs() {
  const tabs = [
    { key: 'today', label: '今天', active: true },
    { key: 'week', label: '本周', active: false }
  ];

  return '' +
    '<div class="filter-tabs">' +
      tabs.map(function (t) {
        const activeCls = t.active ? ' active' : '';
        return '<span class="filter-tab' + activeCls + '" data-filter="' + window.Esc.escAttr(t.key) + '">' +
          window.Esc.esc(t.label) + '</span>';
      }).join('') +
    '</div>';
}

/* ---------- 辅助：构建预约时间线 ---------- */
function buildApptTimeline(state) {
  const appts = (state.appointments || [])
    .filter(function (a) { return a.date === 'today'; })
    .sort(function (a, b) { return a.time.localeCompare(b.time); });

  if (appts.length === 0) {
    return '' +
      '<div class="panel">' +
        '<div class="panel-empty">暂无预约安排</div>' +
      '</div>';
  }

  const items = appts.map(function (a) {
    const patientName = window.Esc.esc(getPatientName(state, a.patientId));
    const type = window.Esc.esc(a.type || '');
    const note = window.Esc.esc(a.note || '');
    const time = window.Esc.esc(a.time || '');
    const color = window.Esc.escAttr(a.color || getTypeColor(a.type));

    return '' +
      '<div class="appt-timeline-item">' +
        '<div class="appt-time-col">' +
          '<div class="appt-time">' + time + '</div>' +
        '</div>' +
        '<div class="appt-dot" style="background:' + color + '"></div>' +
        '<div class="appt-content">' +
          '<div class="appt-row">' +
            '<span class="appt-name">' + patientName + '</span>' +
            '<span class="appt-type-tag" style="background:' + color + '">' + type + '</span>' +
          '</div>' +
          '<div class="appt-note">' + note + '</div>' +
        '</div>' +
      '</div>';
  }).join('');

  return '' +
    '<div class="panel">' +
      '<div class="panel-hd">' +
        '<span class="panel-title">预约列表</span>' +
        '<span class="panel-count">' + appts.length + ' 条</span>' +
      '</div>' +
      '<div class="appt-timeline">' + items + '</div>' +
    '</div>';
}

/* ---------- 辅助：构建底部操作栏 ---------- */
function buildActionBar() {
  return '' +
    '<div class="action-bar">' +
      '<button class="btn btn-primary" id="btnAddAppt" onclick="window.Toast.info(\'新增预约功能开发中\')">' +
        window.getIcon('plus') +
        '<span>新增预约</span>' +
      '</button>' +
    '</div>';
}

/* ---------- 主渲染函数 ---------- */
function renderSchedule(state) {
  state = state || {};

  return '' +
    '<div class="schedule-view">' +
      buildFilterTabs() +
      buildApptTimeline(state) +
      buildActionBar() +
    '</div>';
}

// 暴露到全局
window.ScheduleView = {
  registerRoutes: registerRoutes,
  render: renderSchedule
};})();
