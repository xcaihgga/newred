/* ============================================================
 * views/assess.js - 评估记录视图
 * 分步评估表单：主诉、触诊、ROM、肌力、ADL，提交生成评估记录
 * ============================================================ */
(function() {
  if (window.__REHAB_VIEW_ASSESS_LOADED__) return;
  window.__REHAB_VIEW_ASSESS_LOADED__ = true;


/* ---------- 路由注册 ---------- */
function registerRoutes(router, store) {
  router.register('/assess', function () {
    const state = store.getState();
    return renderAssess(state, store);
  });
}

/* ---------- 常量：ADL 六项 ---------- */
const ADL_ITEMS = ['进食', '穿衣', '洗澡', '如厕', '转移', '活动'];

/* ---------- 辅助：构建患者选择 ---------- */
function buildPatientSelect(state) {
  const patients = state.patients || [];
  const options = patients.map(function (p) {
    const id = window.Esc.escAttr(p.id);
    const name = window.Esc.esc(p.name || '');
    return '<option value="' + id + '">' + name + '</option>';
  }).join('');

  return '' +
    '<div class="form-block">' +
      '<div class="form-label">选择患者 <span class="req">*</span></div>' +
      '<select class="form-select" data-assess-patient>' +
        '<option value="">请选择患者</option>' +
        options +
      '</select>' +
    '</div>';
}

/* ---------- 辅助：构建主诉区块 ---------- */
function buildChiefComplaint() {
  return '' +
    '<div class="form-section">' +
      '<div class="form-section-title">主诉</div>' +
      '<div class="form-block">' +
        '<div class="form-label">症状</div>' +
        '<textarea class="form-textarea" data-assess-symptoms placeholder="请描述主要症状..."></textarea>' +
      '</div>' +
      '<div class="form-block">' +
        '<div class="form-label">发病时间</div>' +
        '<input type="text" class="form-input" data-assess-onset placeholder="例如：3 天前 / 2026-08-18">' +
      '</div>' +
      '<div class="form-block">' +
        '<div class="form-label">诱因</div>' +
        '<input type="text" class="form-input" data-assess-triggers placeholder="例如：运动 / 外伤 / 无明显诱因">' +
      '</div>' +
      '<div class="form-block">' +
        '<div class="form-label">病史</div>' +
        '<textarea class="form-textarea" data-assess-history placeholder="既往病史、手术史、过敏史等..."></textarea>' +
      '</div>' +
    '</div>';
}

/* ---------- 辅助：构建触诊区块 ---------- */
function buildPalpation() {
  return '' +
    '<div class="form-section">' +
      '<div class="form-section-title">触诊</div>' +
      '<div class="form-block">' +
        '<div class="form-label">压痛部位（多选）</div>' +
        '<div class="check-group" data-assess-sites>' +
          '<label class="check-item"><input type="checkbox" value="颈部"><span>颈部</span></label>' +
          '<label class="check-item"><input type="checkbox" value="肩部"><span>肩部</span></label>' +
          '<label class="check-item"><input type="checkbox" value="肘部"><span>肘部</span></label>' +
          '<label class="check-item"><input type="checkbox" value="腕部"><span>腕部</span></label>' +
          '<label class="check-item"><input type="checkbox" value="背部"><span>背部</span></label>' +
          '<label class="check-item"><input type="checkbox" value="腰部"><span>腰部</span></label>' +
          '<label class="check-item"><input type="checkbox" value="髋部"><span>髋部</span></label>' +
          '<label class="check-item"><input type="checkbox" value="膝部"><span>膝部</span></label>' +
          '<label class="check-item"><input type="checkbox" value="踝部"><span>踝部</span></label>' +
        '</div>' +
      '</div>' +
      '<div class="form-block">' +
        '<div class="form-label">压痛等级 <span class="req">*</span> <span class="range-value" data-assess-pain-value>5</span>/10</div>' +
        '<input type="range" min="0" max="10" value="5" class="form-range" data-assess-pain>' +
        '<div class="range-scale"><span>无痛</span><span>轻痛</span><span>中痛</span><span>重痛</span></div>' +
      '</div>' +
      '<div class="form-block">' +
        '<div class="form-label">体征描述</div>' +
        '<textarea class="form-textarea" data-assess-findings placeholder="压痛部位、性质、放射等..."></textarea>' +
      '</div>' +
    '</div>';
}

/* ---------- 辅助：构建 ROM 区块 ---------- */
function buildROMSection() {
  return '' +
    '<div class="form-section">' +
      '<div class="form-section-title">' +
        '<span>关节活动度 (ROM)</span>' +
        '<button type="button" class="btn-add-row" data-rom-add>+ 添加行</button>' +
      '</div>' +
      '<div class="data-table">' +
        '<div class="table-row table-head">' +
          '<div class="table-cell">关节</div>' +
          '<div class="table-cell">主动 (°)</div>' +
          '<div class="table-cell">被动 (°)</div>' +
          '<div class="table-cell table-cell-actions"></div>' +
        '</div>' +
        '<div class="table-row" data-rom-row>' +
          '<div class="table-cell"><input type="text" class="form-input" data-rom-joint placeholder="如：膝关节"></div>' +
          '<div class="table-cell"><input type="number" class="form-input" data-rom-active placeholder="0"></div>' +
          '<div class="table-cell"><input type="number" class="form-input" data-rom-passive placeholder="0"></div>' +
          '<div class="table-cell table-cell-actions"><button type="button" class="btn-remove-row" data-rom-remove>✕</button></div>' +
        '</div>' +
      '</div>' +
    '</div>';
}

/* ---------- 辅助：构建肌力区块 ---------- */
function buildMuscleSection() {
  return '' +
    '<div class="form-section">' +
      '<div class="form-section-title">' +
        '<span>肌力</span>' +
        '<button type="button" class="btn-add-row" data-muscle-add>+ 添加行</button>' +
      '</div>' +
      '<div class="data-table">' +
        '<div class="table-row table-head">' +
          '<div class="table-cell">肌群</div>' +
          '<div class="table-cell">等级 (0-5)</div>' +
          '<div class="table-cell">备注</div>' +
          '<div class="table-cell table-cell-actions"></div>' +
        '</div>' +
        '<div class="table-row" data-muscle-row>' +
          '<div class="table-cell"><input type="text" class="form-input" data-muscle-group placeholder="如：股四头肌"></div>' +
          '<div class="table-cell">' +
            '<select class="form-select" data-muscle-grade>' +
              '<option value="0">0 - 无收缩</option>' +
              '<option value="1">1 - 有收缩</option>' +
              '<option value="2">2 - 可水平移动</option>' +
              '<option value="3">3 - 可抗重力</option>' +
              '<option value="4">4 - 可抗阻力</option>' +
              '<option value="5" selected>5 - 正常</option>' +
            '</select>' +
          '</div>' +
          '<div class="table-cell"><input type="text" class="form-input" data-muscle-note placeholder="备注"></div>' +
          '<div class="table-cell table-cell-actions"><button type="button" class="btn-remove-row" data-muscle-remove>✕</button></div>' +
        '</div>' +
      '</div>' +
    '</div>';
}

/* ---------- 辅助：构建 ADL 区块 ---------- */
function buildADLSection() {
  const items = ADL_ITEMS.map(function (name) {
    const safeName = window.Esc.escAttr(name);
    const label = window.Esc.esc(name);
    return '' +
      '<div class="adl-row">' +
        '<div class="adl-name">' + label + '</div>' +
        '<div class="adl-score">' +
          '<input type="range" min="0" max="5" value="0" class="form-range" data-adl="' + safeName + '">' +
          '<span class="adl-score-val" data-adl-val="' + safeName + '">0</span>' +
        '</div>' +
      '</div>';
  }).join('');

  return '' +
    '<div class="form-section">' +
      '<div class="form-section-title">日常生活活动 (ADL) - 评分 0-5</div>' +
      '<div class="adl-list">' + items + '</div>' +
    '</div>';
}

/* ---------- 辅助：表单校验 ---------- */
function validateForm(root) {
  const patientEl = root.querySelector('[data-assess-patient]');
  if (!patientEl || !patientEl.value) {
    return '请选择患者';
  }
  const painEl = root.querySelector('[data-assess-pain]');
  if (!painEl) return '';
  const pain = parseInt(painEl.value, 10);
  if (isNaN(pain) || pain < 0 || pain > 10) {
    return '压痛等级必须在 0-10 之间';
  }
  return '';
}

/* ---------- 辅助：收集表单数据 ---------- */
function collectFormData(root) {
  const data = {};

  data.patientId = root.querySelector('[data-assess-patient]').value;

  data.chiefComplaint = {
    symptoms: root.querySelector('[data-assess-symptoms]').value,
    onset: root.querySelector('[data-assess-onset]').value,
    triggers: root.querySelector('[data-assess-triggers]').value,
    history: root.querySelector('[data-assess-history]').value
  };

  const siteEls = root.querySelectorAll('[data-assess-sites] input[type="checkbox"]:checked');
  const sites = [];
  for (let i = 0; i < siteEls.length; i++) sites.push(siteEls[i].value);

  data.palpation = {
    sites: sites,
    painLevel: parseInt(root.querySelector('[data-assess-pain]').value, 10),
    findings: root.querySelector('[data-assess-findings]').value
  };

  data.rom = [];
  const romRows = root.querySelectorAll('[data-rom-row]');
  for (let i = 0; i < romRows.length; i++) {
    const row = romRows[i];
    const joint = row.querySelector('[data-rom-joint]').value;
    if (!joint) continue;
    data.rom.push({
      joint: joint,
      active: row.querySelector('[data-rom-active]').value,
      passive: row.querySelector('[data-rom-passive]').value
    });
  }

  data.muscle = [];
  const muscleRows = root.querySelectorAll('[data-muscle-row]');
  for (let i = 0; i < muscleRows.length; i++) {
    const row = muscleRows[i];
    const group = row.querySelector('[data-muscle-group]').value;
    if (!group) continue;
    data.muscle.push({
      group: group,
      grade: row.querySelector('[data-muscle-grade]').value,
      note: row.querySelector('[data-muscle-note]').value
    });
  }

  data.adl = {};
  const adlRanges = root.querySelectorAll('[data-adl]');
  for (let i = 0; i < adlRanges.length; i++) {
    const r = adlRanges[i];
    data.adl[r.getAttribute('data-adl')] = parseInt(r.value, 10);
  }

  return data;
}

/* ---------- 辅助：提交评估 ---------- */
function submitAssessment(store, root) {
  const err = validateForm(root);
  if (err) {
    window.Modal.toast(err);
    return;
  }
  const data = collectFormData(root);
  const now = new Date();
  const pad = function (n) { return n < 10 ? '0' + n : '' + n; };
  const dateStr = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
  const timeStr = pad(now.getHours()) + ':' + pad(now.getMinutes());

  store.dispatch({
    type: 'ADD_RECORD',
    payload: {
      id: 'rec_' + Date.now(),
      type: 'assessment',
      patientId: data.patientId,
      title: '评估记录',
      summary: '压痛 ' + data.palpation.painLevel + '/10 · ROM ' + data.rom.length + '项 · 肌力 ' + data.muscle.length + '项',
      date: dateStr,
      time: timeStr,
      createdAt: now.getTime(),
      data: data
    }
  });
  window.Modal.toast('评估记录已提交');
}

/* ---------- 主渲染函数 ---------- */
function renderAssess(state, store) {
  state = state || {};

  return '' +
    '<div class="assess-view">' +
      '<div class="page-header-bar">' +
        '<div class="page-header-title">新增评估</div>' +
        '<div class="page-header-meta">填写评估表单并提交</div>' +
      '</div>' +
      '<form class="assess-form" data-assess-form>' +
        buildPatientSelect(state) +
        buildChiefComplaint() +
        buildPalpation() +
        buildROMSection() +
        buildMuscleSection() +
        buildADLSection() +
        '<div class="form-footer">' +
          '<button type="submit" class="btn btn-primary btn-submit" data-assess-submit>提交评估</button>' +
        '</div>' +
      '</form>' +
    '</div>';
}

// 暴露到全局
window.AssessView = {
  registerRoutes: registerRoutes,
  render: renderAssess,
  _submit: submitAssessment,
  _validate: validateForm,
  _collect: collectFormData
};
})();
