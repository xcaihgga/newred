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
      '<button class="btn btn-primary" id="btnAddAppt" data-appt-add>' +
        window.getIcon('plus') +
        '<span>新增预约</span>' +
      '</button>' +
    '</div>';
}

/* ---------- 辅助：预约类型选项 ---------- */
const APPT_TYPES = ['评估', '检查', '量表', '治疗', '影像'];

/* ---------- 辅助：处理新增预约 ---------- */
function promptAddAppt(store) {
  if (!store) return;
  const patients = store.getState().patients || [];
  const options = patients.map(function (p) {
    return '<option value="' + window.Esc.escAttr(p.id) + '">' + window.Esc.esc(p.name) + '</option>';
  }).join('');

  const form =
    '<div class="appt-form">' +
      '<div class="form-row">' +
        '<label class="form-label">患者</label>' +
        '<select class="form-input" data-appt-patient>' + options + '</select>' +
      '</div>' +
      '<div class="form-row">' +
        '<label class="form-label">时间</label>' +
        '<input type="time" class="form-input" data-appt-time value="09:00">' +
      '</div>' +
      '<div class="form-row">' +
        '<label class="form-label">类型</label>' +
        '<select class="form-input" data-appt-type>' +
          APPT_TYPES.map(function (t) { return '<option value="' + window.Esc.escAttr(t) + '">' + window.Esc.esc(t) + '</option>'; }).join('') +
        '</select>' +
      '</div>' +
      '<div class="form-row">' +
        '<label class="form-label">备注</label>' +
        '<input type="text" class="form-input" data-appt-note placeholder="如：腰椎·首评">' +
      '</div>' +
    '</div>';

  window.Modal.open({
    title: '新增预约',
    content: form,
    confirmText: '保存',
    onConfirm: function (dialog) {
      const patientId = dialog.querySelector('[data-appt-patient]').value;
      const time = dialog.querySelector('[data-appt-time]').value;
      const type = dialog.querySelector('[data-appt-type]').value;
      const note = dialog.querySelector('[data-appt-note]').value;
      if (!patientId || !time) {
        window.Toast.warn('请选择患者并填写时间');
        return false;
      }
      store.dispatch({
        type: 'ADD_APPOINTMENT',
        payload: {
          id: 'a' + Date.now(),
          patientId: patientId,
          time: time,
          date: 'today',
          type: type,
          note: note,
          color: getTypeColor(type)
        }
      });
      window.Toast.success('已新增预约');
      if (window.Router && typeof window.Router.refresh === 'function') window.Router.refresh();
    }
  });
}

/* ---------- 渲染后绑定事件 ---------- */
function init(container, store) {
  if (!container) return;
  var addBtn = container.querySelector('[data-appt-add]');
  if (addBtn) {
    addBtn.addEventListener('click', function () { promptAddAppt(store); });
  }
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
  render: renderSchedule,
  init: init,
  _addAppt: promptAddAppt
};})();
