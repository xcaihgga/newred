/* ============================================================
 * views/plan.js - 康复方案视图
 * 按急性期 / 亚急性期 / 慢性期三阶段制定可编辑康复方案
 * ============================================================ */
(function() {
  if (window.__REHAB_VIEW_PLAN_LOADED__) return;
  window.__REHAB_VIEW_PLAN_LOADED__ = true;


/* ---------- 路由注册 ---------- */
function registerRoutes(router, store) {
  router.register('/plan', function () {
    const state = store.getState();
    return renderPlan(state, store);
  });
}

/* ---------- 常量：阶段定义 ---------- */
const PLAN_PHASES = [
  { key: 'acute',    label: '急性期',   range: '0 - 2 周',  color: '#d9534f',
    defaultGoal: '控制炎症与疼痛，保护损伤部位，维持基础关节活动度',
    defaultItems: [
      '冷敷 / 加压包扎',
      '肩关节被动辅助运动',
      '周围肌群等长收缩',
      '疼痛监测与记录'
    ]
  },
  { key: 'subacute', label: '亚急性期', range: '2 - 6 周',  color: '#d9804a',
    defaultGoal: '逐步恢复关节活动度与肌力，建立动态稳定性',
    defaultItems: [
      '关节松动术 (I-II 级)',
      '主动辅助 ROM 训练',
      '渐进式抗阻训练',
      '核心稳定训练'
    ]
  },
  { key: 'chronic',  label: '慢性期',   range: '6 周以上',  color: '#0e9488',
    defaultGoal: '恢复全范围关节活动与功能性肌力，回归日常生活与运动',
    defaultItems: [
      '全范围主动 ROM',
      '功能性抗阻训练',
      '平衡与本体感觉训练',
      '运动专项训练与回归运动'
    ]
  }
];

/* ---------- 辅助：查找患者 ---------- */
function findPatient(state, id) {
  if (!state.patients || !id) return null;
  for (let i = 0; i < state.patients.length; i++) {
    if (state.patients[i].id === id) return state.patients[i];
  }
  return null;
}

/* ---------- 辅助：构建患者选择器 ---------- */
function buildPatientSelect(state, selectedId) {
  const patients = state && state.patients ? state.patients : [];
  let options = '<option value="">请选择患者</option>';
  options += patients.map(function (p) {
    const id = window.Esc.escAttr(p.id);
    const name = window.Esc.esc(p.name || '');
    const gender = window.Esc.esc(p.gender || '');
    const age = window.Esc.esc(p.age != null ? String(p.age) : '');
    const selected = p.id === selectedId ? ' selected' : '';
    return '<option value="' + id + '"' + selected + '>' + name + ' · ' + gender + ' · ' + age + '岁</option>';
  }).join('');

  return '' +
    '<div class="form-block">' +
      '<div class="form-label">患者 <span class="req">*</span></div>' +
      '<select class="form-select" data-plan-patient>' + options + '</select>' +
    '</div>';
}

/* ---------- 辅助：获取患者当前方案或默认 ---------- */
function getPlanData(patient) {
  if (patient && patient.plan) {
    return patient.plan;
  }
  const plan = {};
  for (let i = 0; i < PLAN_PHASES.length; i++) {
    const ph = PLAN_PHASES[i];
    plan[ph.key] = {
      goal: ph.defaultGoal,
      items: ph.defaultItems.slice()
    };
  }
  return plan;
}

/* ---------- 辅助：构建阶段卡片 ---------- */
function buildPhaseCards(plan) {
  const cards = PLAN_PHASES.map(function (ph) {
    const data = plan[ph.key] || { goal: '', items: [] };
    const safeKey = window.Esc.escAttr(ph.key);
    const safeLabel = window.Esc.esc(ph.label);
    const safeRange = window.Esc.esc(ph.range);
    const safeColor = window.Esc.escAttr(ph.color);
    const safeGoal = window.Esc.esc(data.goal || '');

    const itemsHtml = (data.items || []).map(function (item, idx) {
      const safeItem = window.Esc.esc(item);
      return '' +
        '<div class="plan-phase-item">' +
          '<input type="text" class="form-input" data-plan-item="' + safeKey + '" data-plan-idx="' + idx + '" value="' + safeItem + '" placeholder="治疗项内容">' +
          '<button type="button" class="btn-remove-row" data-plan-remove="' + safeKey + '" data-plan-remove-idx="' + idx + '">✕</button>' +
        '</div>';
    }).join('');

    return '' +
      '<div class="plan-phase-card" style="border-left-color:' + safeColor + '">' +
        '<div class="plan-phase-hd">' +
          '<div class="plan-phase-title-row">' +
            '<span class="plan-phase-dot" style="background:' + safeColor + '"></span>' +
            '<span class="plan-phase-label">' + safeLabel + '</span>' +
            '<span class="plan-phase-range">' + safeRange + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="plan-phase-body">' +
          '<div class="form-block">' +
            '<div class="form-label">阶段目标</div>' +
            '<textarea class="form-textarea" data-plan-goal="' + safeKey + '" placeholder="请填写该阶段的目标...">' + safeGoal + '</textarea>' +
          '</div>' +
          '<div class="form-block">' +
            '<div class="form-label">治疗项</div>' +
            '<div class="plan-phase-items" data-plan-items="' + safeKey + '">' +
              (itemsHtml || '<div class="panel-empty">暂无治疗项</div>') +
            '</div>' +
            '<button type="button" class="btn-add-row" data-plan-add="' + safeKey + '">+ 新增治疗项</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }).join('');

  return '<div class="plan-phase-list">' + cards + '</div>';
}

/* ---------- 辅助：收集方案数据 ---------- */
function collectPlanData(root) {
  const plan = {};
  for (let i = 0; i < PLAN_PHASES.length; i++) {
    const ph = PLAN_PHASES[i];
    const goalEl = root.querySelector('[data-plan-goal="' + ph.key + '"]');
    const goal = goalEl ? goalEl.value : '';

    const itemsContainer = root.querySelector('[data-plan-items="' + ph.key + '"]');
    const items = [];
    if (itemsContainer) {
      const inputs = itemsContainer.querySelectorAll('[data-plan-item]');
      for (let j = 0; j < inputs.length; j++) {
        const v = inputs[j].value.trim();
        if (v) items.push(v);
      }
    }

    plan[ph.key] = { goal: goal, items: items };
  }
  return plan;
}

/* ---------- 辅助：保存方案 ---------- */
function savePlan(store, root) {
  const patientEl = root.querySelector('[data-plan-patient]');
  const patientId = patientEl ? patientEl.value : '';

  if (!patientId) {
    window.Modal.toast('请选择患者');
    return;
  }

  const plan = collectPlanData(root);
  store.dispatch({
    type: 'UPDATE_PATIENT',
    payload: { id: patientId, plan: plan }
  });

  window.Modal.toast('方案已保存');
}

/* ---------- 辅助：添加治疗项 ---------- */
function addItem(root, phaseKey) {
  const container = root.querySelector('[data-plan-items="' + phaseKey + '"]');
  if (!container) return;

  const panelEmpty = container.querySelector('.panel-empty');
  if (panelEmpty) panelEmpty.remove();

  const idx = container.querySelectorAll('[data-plan-item]').length;
  const safeKey = window.Esc.escAttr(phaseKey);
  const safeIdx = window.Esc.escAttr(String(idx));
  const div = document.createElement('div');
  div.className = 'plan-phase-item';
  div.innerHTML = '<input type="text" class="form-input" data-plan-item="' + safeKey + '" data-plan-idx="' + safeIdx + '" placeholder="治疗项内容">' +
    '<button type="button" class="btn-remove-row" data-plan-remove="' + safeKey + '" data-plan-remove-idx="' + safeIdx + '">✕</button>';
  container.appendChild(div);
}

/* ---------- 辅助：删除治疗项 ---------- */
function removeItem(root, phaseKey, idx) {
  const container = root.querySelector('[data-plan-items="' + phaseKey + '"]');
  if (!container) return;
  const items = container.querySelectorAll('[data-plan-item]');
  for (let i = 0; i < items.length; i++) {
    if (parseInt(items[i].getAttribute('data-plan-idx'), 10) === idx) {
      const row = items[i].parentNode;
      if (row) row.remove();
      break;
    }
  }
  // 如果为空，显示空状态
  const remaining = container.querySelectorAll('[data-plan-item]');
  if (remaining.length === 0 && !container.querySelector('.panel-empty')) {
    container.innerHTML = '<div class="panel-empty">暂无治疗项</div>';
  }
}

/* ---------- 主渲染函数 ---------- */
function renderPlan(state, store) {
  state = state || {};

  let patientId = '';
  if (state.patients && state.patients.length > 0) {
    patientId = state.patients[0].id;
  }
  const patient = findPatient(state, patientId);
  const planData = getPlanData(patient);

  const html = '' +
    '<div class="plan-view">' +
      '<div class="page-header-bar">' +
        '<div class="page-header-title">康复方案</div>' +
        '<div class="page-header-meta">为患者制定个性化的分阶段康复计划</div>' +
      '</div>' +
      '<div data-plan-root>' +
        '<div class="plan-patient-block">' +
          buildPatientSelect(state, patientId) +
        '</div>' +
        '<div class="plan-content" data-plan-content>' +
          buildPhaseCards(planData) +
        '</div>' +
        '<div class="plan-footer">' +
          '<button type="button" class="btn btn-primary" data-plan-save>保存方案</button>' +
        '</div>' +
      '</div>' +
    '</div>';

  // 挂载后绑定交互
  setTimeout(function () {
    const root = document.querySelector('[data-plan-root]');
    if (!root) return;

    // 患者切换
    root.addEventListener('change', function (ev) {
      const sel = ev.target.closest && ev.target.closest('[data-plan-patient]');
      if (sel) {
        const pid = sel.value;
        const p = findPatient(state, pid);
        const data = getPlanData(p);
        const content = root.querySelector('[data-plan-content]');
        if (content) content.innerHTML = buildPhaseCards(data);
      }
    });

    // 点击事件委托：新增 / 删除 / 保存
    root.addEventListener('click', function (ev) {
      const addBtn = ev.target.closest && ev.target.closest('[data-plan-add]');
      if (addBtn) {
        addItem(root, addBtn.getAttribute('data-plan-add'));
        return;
      }
      const removeBtn = ev.target.closest && ev.target.closest('[data-plan-remove]');
      if (removeBtn) {
        const key = removeBtn.getAttribute('data-plan-remove');
        const idx = parseInt(removeBtn.getAttribute('data-plan-remove-idx'), 10);
        removeItem(root, key, idx);
        return;
      }
      const saveBtn = ev.target.closest && ev.target.closest('[data-plan-save]');
      if (saveBtn) {
        savePlan(store, root);
      }
    });
  }, 0);

  return html;
}

// 暴露到全局
window.PlanView = {
  registerRoutes: registerRoutes,
  render: renderPlan,
  _phases: PLAN_PHASES
};
})();
