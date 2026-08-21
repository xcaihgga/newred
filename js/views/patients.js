/* ============================================================
 * views/patients.js - 患者列表视图
 * 展示患者卡片网格，支持本地搜索筛选，点击进入详情
 * ============================================================ */
(function() {
  if (window.__REHAB_VIEW_PATIENTS_LOADED__) return;
  window.__REHAB_VIEW_PATIENTS_LOADED__ = true;


/* ---------- 路由注册 ---------- */
function registerRoutes(router, store) {
  // 注册 '/patients' 路由，渲染患者列表
  router.register('/patients', function () {
    const state = store.getState();
    return renderPatients(state);
  });
}

/* ---------- 辅助：格式化性别年龄 ---------- */
function formatGenderAge(p) {
  const gender = window.Esc.esc(p.gender || '');
  const age = window.Esc.esc(p.age != null ? String(p.age) : '');
  if (gender && age) return gender + ' · ' + age + '岁';
  return gender || age ? (gender + age) : '-';
}

/* ---------- 辅助：获取患者首字作为头像 ---------- */
function getAvatar(p) {
  const name = (p && p.name) || '';
  return window.Esc.esc(name.charAt(0) || '?');
}

/* ---------- 辅助：获取标签颜色 ---------- */
function getTagColor(p) {
  return window.Esc.escAttr(p && p.color ? p.color : '#3b82c4');
}

/* ---------- 辅助：构建搜索框 ---------- */
function buildSearchBox() {
  return '' +
    '<div class="search-box">' +
      '<span class="search-icon">🔍</span>' +
      '<input type="text" class="search-input" data-search="patients" placeholder="按姓名 / 诊断 搜索患者...">' +
      '<button class="search-clear" data-search-clear="patients" style="display:none">✕</button>' +
    '</div>';
}

/* ---------- 辅助：构建患者卡片网格 ---------- */
function buildPatientCards(state) {
  const patients = (state.patients || []).slice();

  if (patients.length === 0) {
    return '' +
      '<div class="panel">' +
        '<div class="panel-empty">' +
          '<div class="empty-icon">👥</div>' +
          '<div class="empty-text">暂无患者</div>' +
        '</div>' +
      '</div>';
  }

  const cards = patients.map(function (p) {
    const id = window.Esc.escAttr(p.id);
    const name = window.Esc.esc(p.name || '');
    const genderAge = formatGenderAge(p);
    const diagnosis = window.Esc.esc(p.diagnosis || '未诊断');
    const lastVisit = window.Esc.esc(p.lastVisit || '尚未就诊');
    const avatar = getAvatar(p);
    const color = getTagColor(p);

    return '' +
      '<a class="patient-card" data-nav="/patients/' + id + '">' +
        '<div class="patient-avatar" style="background:' + color + '">' + avatar + '</div>' +
        '<div class="patient-card-body">' +
          '<div class="patient-name-row">' +
            '<span class="patient-name">' + name + '</span>' +
            '<span class="patient-gender-age">' + genderAge + '</span>' +
          '</div>' +
          '<div class="patient-diagnosis">' + diagnosis + '</div>' +
          '<div class="patient-last-visit">' +
            '<span class="patient-last-icon">🕐</span>' +
            '<span>最后就诊：' + lastVisit + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="patient-arrow">›</div>' +
      '</a>';
  }).join('');

  return '' +
    '<div class="panel">' +
      '<div class="panel-hd">' +
        '<span class="panel-title">患者列表</span>' +
        '<span class="panel-count">' + patients.length + ' 位</span>' +
      '</div>' +
      '<div class="patient-grid">' + cards + '</div>' +
    '</div>';
}

/* ---------- 主渲染函数 ---------- */
function renderPatients(state) {
  state = state || {};
  const total = (state.patients || []).length;

  return '' +
    '<div class="patients-view">' +
      // 顶部统计
      '<div class="page-header-bar">' +
        '<div class="page-header-title">患者管理</div>' +
        '<div class="page-header-meta">共 ' + total + ' 位患者</div>' +
      '</div>' +
      // 搜索框
      buildSearchBox() +
      // 卡片网格
      buildPatientCards(state) +
    '</div>';
}

// 暴露到全局
window.PatientsView = {
  registerRoutes: registerRoutes,
  render: renderPatients
};
})();
