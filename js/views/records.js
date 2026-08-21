/* ============================================================
 * views/records.js - 记录中心视图
 * 展示记录时间线，支持类型筛选，按日期分组
 * ============================================================ */
if (window.__REHAB_VIEW_RECORDS_LOADED__) return;
window.__REHAB_VIEW_RECORDS_LOADED__ = true;

/* ---------- 路由注册 ---------- */
function registerRoutes(router, store) {
  router.register('/records', function () {
    const state = store.getState();
    return renderRecords(state);
  });
}

/* ---------- 辅助：查找患者名 ---------- */
function getPatientName(state, patientId) {
  if (!state.patients || !patientId) return '未知患者';
  const p = state.patients.find(function (x) { return x.id === patientId; });
  return p ? p.name : '未知患者';
}

/* ---------- 辅助：记录类型映射 ---------- */
const RECORD_TYPES = {
  assessment: { label: '评估', icon: 'assess', color: '#0e9488' },
  exam:       { label: '检查', icon: 'assess', color: '#3b82c4' },
  scale:      { label: '量表', icon: 'scale', color: '#8b5fbf' },
  plan:       { label: '方案', icon: 'plan', color: '#d9804a' },
  treatment:  { label: '治疗', icon: 'records', color: '#4f9e63' },
  photo:      { label: '影像', icon: 'upload', color: '#d9534f' }
};

/* ---------- 辅助：构建筛选标签 ---------- */
function buildFilterTabs() {
  const tabs = [
    { key: 'all', label: '全部' },
    { key: 'assessment', label: '评估' },
    { key: 'exam', label: '检查' },
    { key: 'scale', label: '量表' },
    { key: 'plan', label: '方案' },
    { key: 'treatment', label: '治疗' },
    { key: 'photo', label: '影像' }
  ];

  return '' +
    '<div class="filter-tabs">' +
      tabs.map(function (t) {
        return '<span class="filter-tab" data-filter="' + window.Esc.escAttr(t.key) + '">' +
          window.Esc.esc(t.label) + '</span>';
      }).join('') +
    '</div>';
}

/* ---------- 辅助：构建记录列表 ---------- */
function buildRecordList(state) {
  const records = (state.records || []).slice().sort(function (a, b) {
    return (b.createdAt || 0) - (a.createdAt || 0);
  });

  if (records.length === 0) {
    return '' +
      '<div class="panel">' +
        '<div class="panel-empty">暂无记录</div>' +
      '</div>';
  }

  // 按日期分组
  const groups = {};
  records.forEach(function (r) {
    const date = r.date || '未知日期';
    if (!groups[date]) groups[date] = [];
    groups[date].push(r);
  });

  const groupKeys = Object.keys(groups);

  const groupsHtml = groupKeys.map(function (date) {
    const items = groups[date];
    const itemsHtml = items.map(function (r) {
      const typeInfo = RECORD_TYPES[r.type] || { label: '其他', icon: 'records', color: '#3b82c4' };
      const title = window.Esc.esc(r.title || '');
      const summary = window.Esc.esc(r.summary || '');
      const time = window.Esc.esc(r.time || '');
      const patientName = window.Esc.esc(getPatientName(state, r.patientId));
      const color = window.Esc.escAttr(typeInfo.color);

      return '' +
        '<div class="record-item" data-type="' + window.Esc.escAttr(r.type) + '">' +
          '<div class="record-type-icon" style="color:' + color + '">' +
            window.getIcon(typeInfo.icon) +
          '</div>' +
          '<div class="record-body">' +
            '<div class="record-title">' + title + '</div>' +
            '<div class="record-summary">' + summary + '</div>' +
            '<div class="record-meta">' +
              '<span class="record-type-tag" style="background:' + color + '">' + typeInfo.label + '</span>' +
              '<span class="record-patient" data-nav="/patients">' + patientName + '</span>' +
              '<span class="record-time">' + time + '</span>' +
            '</div>' +
          '</div>' +
        '</div>';
    }).join('');

    return '' +
      '<div class="record-group">' +
        '<div class="record-group-hd">' + window.Esc.esc(date) + '</div>' +
        '<div class="record-list">' + itemsHtml + '</div>' +
      '</div>';
  }).join('');

  return '' +
    '<div class="panel">' +
      '<div class="panel-hd">' +
        '<span class="panel-title">记录时间线</span>' +
        '<span class="panel-count">' + records.length + ' 条</span>' +
      '</div>' +
      '<div class="record-timeline">' + groupsHtml + '</div>' +
    '</div>';
}

/* ---------- 主渲染函数 ---------- */
function renderRecords(state) {
  state = state || {};

  return '' +
    '<div class="records-view">' +
      buildFilterTabs() +
      buildRecordList(state) +
    '</div>';
}

// 暴露到全局
window.RecordsView = {
  registerRoutes: registerRoutes,
  render: renderRecords
};