/* ============================================================
 * views/patient-detail.js - 患者详情视图
 * 展示患者基本信息、评估、记录、方案三个 Tab，支持返回
 * ============================================================ */
(function() {
  if (window.__REHAB_VIEW_PATIENT_DETAIL_LOADED__) return;
  window.__REHAB_VIEW_PATIENT_DETAIL_LOADED__ = true;


/* ---------- 路由注册 ---------- */
function registerRoutes(router, store) {
  // 注册 '/patients/:id' 路由，渲染患者详情
  router.register('/patients/:id', function (params) {
    const state = store.getState();
    // router 目前未自动解析 :id，从 hash 中手动取段
    let pid = params && params.id;
    if (!pid) {
      const hash = window.location.hash.replace('#', '') || '';
      const segs = hash.split('/').filter(Boolean);
      if (segs.length >= 2) pid = segs[1];
    }
    return renderPatientDetail(state, { id: pid });
  });
}

/* ---------- 辅助：查找患者 ---------- */
function findPatient(state, id) {
  if (!state.patients || !id) return null;
  for (let i = 0; i < state.patients.length; i++) {
    if (state.patients[i].id === id) return state.patients[i];
  }
  return null;
}

/* ---------- 辅助：格式化姓名首字头像 ---------- */
function getAvatar(p) {
  const name = (p && p.name) || '';
  return window.Esc.esc(name.charAt(0) || '?');
}

/* ---------- 辅助：构建返回按钮 ---------- */
function buildBackButton() {
  return '' +
    '<a class="detail-back-btn" data-nav="/patients">' +
      '<span class="back-icon">‹</span>' +
      '<span>返回患者列表</span>' +
    '</a>';
}

/* ---------- 辅助：构建患者基本信息头部 ---------- */
function buildPatientHeader(p) {
  const id = window.Esc.escAttr(p.id);
  const name = window.Esc.esc(p.name || '');
  const gender = window.Esc.esc(p.gender || '-');
  const age = window.Esc.esc(p.age != null ? String(p.age) : '-');
  const diagnosis = window.Esc.esc(p.diagnosis || '未诊断');
  const phone = window.Esc.esc(p.phone || '-');
  const avatar = getAvatar(p);
  const color = p.color || '#3b82c4';

  return '' +
    '<div class="detail-header">' +
      buildBackButton() +
      '<div class="detail-header-card">' +
        '<div class="detail-avatar" style="background:' + color + '">' + avatar + '</div>' +
        '<div class="detail-info">' +
          '<div class="detail-name">' + name + '</div>' +
          '<div class="detail-meta">' +
            '<span>' + gender + '</span>' +
            '<span class="meta-dot">·</span>' +
            '<span>' + age + '岁</span>' +
          '</div>' +
          '<div class="detail-diagnosis">' + diagnosis + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="detail-info-card">' +
        '<div class="info-row"><span class="info-label">姓名</span><span class="info-value">' + name + '</span></div>' +
        '<div class="info-row"><span class="info-label">性别</span><span class="info-value">' + gender + '</span></div>' +
        '<div class="info-row"><span class="info-label">年龄</span><span class="info-value">' + age + '岁</span></div>' +
        '<div class="info-row"><span class="info-label">诊断</span><span class="info-value">' + diagnosis + '</span></div>' +
        '<div class="info-row"><span class="info-label">电话</span><span class="info-value">' + phone + '</span></div>' +
      '</div>' +
    '</div>';
}

/* ---------- 辅助：构建 Tab 切换栏 ---------- */
function buildTabBar(active) {
  const tabs = [
    { key: 'assessment', label: '评估' },
    { key: 'records', label: '记录' },
    { key: 'plan', label: '方案' }
  ];

  return '' +
    '<div class="tab-bar">' +
      tabs.map(function (t) {
        const activeCls = t.key === active ? ' active' : '';
        return '<div class="tab-item' + activeCls + '" data-tab="' + window.Esc.escAttr(t.key) + '">' +
          window.Esc.esc(t.label) + '</div>';
      }).join('') +
    '</div>';
}

/* ---------- 辅助：构建评估 Tab 内容 ---------- */
function buildAssessmentTab(p) {
  const a = p && p.assessment;
  const exams = (p && p.exams) || [];
  const scales = (p && p.scales) || [];

  if (!a && exams.length === 0 && scales.length === 0) {
    return '' +
      '<div class="tab-pane">' +
        '<div class="panel-empty">暂无评估数据</div>' +
      '</div>';
  }

  // 主诉
  let chiefHtml = '';
  if (a && a.chiefComplaint) {
    const cc = a.chiefComplaint;
    const symptom = window.Esc.esc(cc.symptoms || '');
    const onset = window.Esc.esc(cc.onset || '');
    const trigger = window.Esc.esc(cc.triggers || '');
    const history = window.Esc.esc(cc.history || '');
    chiefHtml = '' +
      '<div class="assessment-section">' +
        '<div class="section-title">主诉</div>' +
        '<div class="kv-list">' +
          '<div class="kv-item"><span class="kv-label">症状</span><span class="kv-value">' + symptom + '</span></div>' +
          '<div class="kv-item"><span class="kv-label">发病时间</span><span class="kv-value">' + onset + '</span></div>' +
          '<div class="kv-item"><span class="kv-label">诱因</span><span class="kv-value">' + trigger + '</span></div>' +
          '<div class="kv-item"><span class="kv-label">病史</span><span class="kv-value">' + history + '</span></div>' +
        '</div>' +
      '</div>';
  }

  // 触诊
  let palpHtml = '';
  if (a && a.palpation) {
    const pal = a.palpation;
    const sites = (pal.sites || []).map(function (s) { return window.Esc.esc(s); }).join('、');
    const painLevel = pal.painLevel != null ? String(pal.painLevel) : '';
    const findings = window.Esc.esc(pal.findings || '');
    palpHtml = '' +
      '<div class="assessment-section">' +
        '<div class="section-title">触诊</div>' +
        '<div class="kv-list">' +
          '<div class="kv-item"><span class="kv-label">部位</span><span class="kv-value">' + sites + '</span></div>' +
          '<div class="kv-item"><span class="kv-label">压痛等级</span><span class="kv-value">' + window.Esc.esc(painLevel) + '/10</span></div>' +
          '<div class="kv-item"><span class="kv-label">体征</span><span class="kv-value">' + findings + '</span></div>' +
        '</div>' +
      '</div>';
  }

  // ROM
  let romHtml = '';
  if (a && a.rom && a.rom.length > 0) {
    const romItems = a.rom.map(function (r) {
      const joint = window.Esc.esc(r.joint || '');
      const active = window.Esc.esc(r.active || '');
      const passive = window.Esc.esc(r.passive || '');
      return '' +
        '<div class="table-row">' +
          '<div class="table-cell table-cell-head">' + joint + '</div>' +
          '<div class="table-cell"><span class="kv-sub-label">主动：</span>' + active + '</div>' +
          '<div class="table-cell"><span class="kv-sub-label">被动：</span>' + passive + '</div>' +
        '</div>';
    }).join('');
    romHtml = '' +
      '<div class="assessment-section">' +
        '<div class="section-title">关节活动度 (ROM)</div>' +
        '<div class="data-table">' + romItems + '</div>' +
      '</div>';
  }

  // 肌力
  let muscleHtml = '';
  if (a && a.muscle && a.muscle.length > 0) {
    const muscleItems = a.muscle.map(function (m) {
      const group = window.Esc.esc(m.group || '');
      const grade = window.Esc.esc(String(m.grade != null ? m.grade : ''));
      const note = window.Esc.esc(m.note || '');
      return '' +
        '<div class="table-row">' +
          '<div class="table-cell table-cell-head">' + group + '</div>' +
          '<div class="table-cell"><span class="muscle-grade">' + grade + '级</span></div>' +
          '<div class="table-cell">' + note + '</div>' +
        '</div>';
    }).join('');
    muscleHtml = '' +
      '<div class="assessment-section">' +
        '<div class="section-title">肌力</div>' +
        '<div class="data-table">' + muscleItems + '</div>' +
      '</div>';
  }

  // ADL
  let adlHtml = '';
  if (a && a.adl) {
    const adl = a.adl;
    const items = Object.keys(adl).map(function (k) {
      const item = window.Esc.esc(k);
      const score = window.Esc.esc(String(adl[k]));
      return '<div class="adl-item"><span class="adl-name">' + item + '</span><span class="adl-score">' + score + '</span></div>';
    }).join('');
    if (items) {
      adlHtml = '' +
        '<div class="assessment-section">' +
          '<div class="section-title">日常生活活动 (ADL)</div>' +
          '<div class="adl-grid">' + items + '</div>' +
        '</div>';
    }
  }

  // 检查结果
  let examHtml = '';
  if (exams.length > 0) {
    const examItems = exams.map(function (e) {
      const name = window.Esc.esc(e.name || '');
      const category = window.Esc.esc(e.category || '');
      const result = e.result;
      const resultMap = {
        positive: { label: '阳性', cls: 'positive' },
        negative: { label: '阴性', cls: 'negative' },
        suspect: { label: '可疑', cls: 'suspect' },
        unchecked: { label: '未查', cls: 'unchecked' }
      };
      const r = resultMap[result] || { label: window.Esc.esc(result || ''), cls: '' };
      return '' +
        '<div class="exam-item">' +
          '<div class="exam-name">' + name + '</div>' +
          '<div class="exam-category">' + category + '</div>' +
          '<div class="exam-result ' + r.cls + '">' + r.label + '</div>' +
        '</div>';
    }).join('');
    examHtml = '' +
      '<div class="assessment-section">' +
        '<div class="section-title">检查结果</div>' +
        '<div class="exam-list">' + examItems + '</div>' +
      '</div>';
  }

  // 量表结果
  let scaleHtml = '';
  if (scales.length > 0) {
    const scaleItems = scales.map(function (s) {
      const name = window.Esc.esc(s.name || s.key || '');
      const score = window.Esc.esc(s.score || '');
      const conclusion = window.Esc.esc(s.conclusion || '');
      const date = window.Esc.esc(s.date || '');
      return '' +
        '<div class="scale-item">' +
          '<div class="scale-head">' +
            '<span class="scale-name">' + name + '</span>' +
            '<span class="scale-date">' + date + '</span>' +
          '</div>' +
          '<div class="scale-score">' + score + '</div>' +
          '<div class="scale-conclusion">' + conclusion + '</div>' +
        '</div>';
    }).join('');
    scaleHtml = '' +
      '<div class="assessment-section">' +
        '<div class="section-title">量表结果</div>' +
        '<div class="scale-list">' + scaleItems + '</div>' +
      '</div>';
  }

  return '' +
    '<div class="tab-pane tab-pane-assessment">' +
      chiefHtml +
      palpHtml +
      romHtml +
      muscleHtml +
      adlHtml +
      examHtml +
      scaleHtml +
    '</div>';
}

/* ---------- 辅助：构建记录 Tab 内容 ---------- */
function buildRecordsTab(state, p) {
  const records = (state.records || []).filter(function (r) {
    return r.patientId === p.id;
  }).sort(function (a, b) {
    return (b.createdAt || 0) - (a.createdAt || 0);
  });

  if (records.length === 0) {
    return '' +
      '<div class="tab-pane">' +
        '<div class="panel-empty">暂无记录</div>' +
      '</div>';
  }

  const typeMap = {
    assessment: { label: '评估', color: '#0e9488' },
    exam: { label: '检查', color: '#3b82c4' },
    scale: { label: '量表', color: '#8b5fbf' },
    plan: { label: '方案', color: '#d9804a' },
    treatment: { label: '治疗', color: '#4f9e63' },
    photo: { label: '影像', color: '#d9534f' }
  };

  const items = records.map(function (r) {
    const typeInfo = typeMap[r.type] || { label: '其他', color: '#3b82c4' };
    const title = window.Esc.esc(r.title || r.recordNo || '');
    const summary = window.Esc.esc(r.summary || '');
    const time = window.Esc.esc(r.time || r.timestamp || '');
    const color = window.Esc.escAttr(typeInfo.color);
    return '' +
      '<div class="record-item">' +
        '<div class="record-type-tag" style="background:' + color + '">' + typeInfo.label + '</div>' +
        '<div class="record-body">' +
          '<div class="record-title">' + title + '</div>' +
          '<div class="record-summary">' + summary + '</div>' +
          '<div class="record-time">' + time + '</div>' +
        '</div>' +
      '</div>';
  }).join('');

  return '' +
    '<div class="tab-pane tab-pane-records">' +
      '<div class="record-list">' + items + '</div>' +
    '</div>';
}

/* ---------- 辅助：构建方案 Tab 内容 ---------- */
function buildPlanTab(p) {
  const plan = p && p.plan;

  if (!plan) {
    return '' +
      '<div class="tab-pane">' +
        '<div class="panel-empty">暂无康复方案</div>' +
      '</div>';
  }

  const phases = [
    { key: 'acute', label: '急性期', color: '#d9534f' },
    { key: 'subacute', label: '亚急性期', color: '#d9804a' },
    { key: 'chronic', label: '慢性期', color: '#0e9488' }
  ];

  const phaseHtml = phases.map(function (ph) {
    const data = plan[ph.key];
    if (!data) return '';
    const goal = window.Esc.esc(data.goal || '');
    const items = (data.items || []).map(function (it) {
      return '<li>' + window.Esc.esc(it) + '</li>';
    }).join('');
    return '' +
      '<div class="plan-phase" style="border-left-color:' + ph.color + '">' +
        '<div class="plan-phase-hd">' +
          '<span class="plan-phase-dot" style="background:' + ph.color + '"></span>' +
          '<span class="plan-phase-label">' + ph.label + '</span>' +
        '</div>' +
        '<div class="plan-phase-goal">' + goal + '</div>' +
        (items ? '<ul class="plan-phase-items">' + items + '</ul>' : '') +
      '</div>';
  }).join('');

  return '' +
    '<div class="tab-pane tab-pane-plan">' +
      phaseHtml +
    '</div>';
}

/* ---------- 辅助：构建空状态 ---------- */
function buildEmptyState() {
  return '' +
    '<div class="patient-detail-view">' +
      buildBackButton() +
      '<div class="empty-state">' +
        '<div class="empty-state-icon">❓</div>' +
        '<div class="empty-state-text">患者不存在</div>' +
        '<a class="btn" data-nav="/patients">返回患者列表</a>' +
      '</div>' +
    '</div>';
}

/* ---------- 主渲染函数 ---------- */
function renderPatientDetail(state, params) {
  state = state || {};
  params = params || {};

  const p = findPatient(state, params.id);
  if (!p) return buildEmptyState();

  return '' +
    '<div class="patient-detail-view" data-pid="' + window.Esc.escAttr(p.id) + '">' +
      // 头部与基本信息
      buildPatientHeader(p) +
      // Tab 切换
      buildTabBar('assessment') +
      // 评估 Tab
      '<div class="tab-content" data-tab-content="assessment">' +
        buildAssessmentTab(p) +
      '</div>' +
      // 记录 Tab
      '<div class="tab-content" data-tab-content="records" style="display:none">' +
        buildRecordsTab(state, p) +
      '</div>' +
      // 方案 Tab
      '<div class="tab-content" data-tab-content="plan" style="display:none">' +
        buildPlanTab(p) +
      '</div>' +
    '</div>';
}

// 暴露到全局
window.PatientDetailView = {
  registerRoutes: registerRoutes,
  render: renderPatientDetail
};
})();
