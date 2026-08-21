/* ============================================================
 * views/scale.js - 量表库视图
 * 展示按分类筛选的量表卡片，支持查看详情、对患者使用
 * ============================================================ */
if (window.__REHAB_VIEW_SCALE_LOADED__) return;
window.__REHAB_VIEW_SCALE_LOADED__ = true;

/* ---------- 路由注册 ---------- */
function registerRoutes(router, store) {
  router.register('/scale', function () {
    const state = store.getState();
    return renderScale(state, store);
  });
}

/* ---------- 常量：量表分类 ---------- */
const SCALE_CATEGORIES = [
  { key: 'all',        label: '全部',     icon: 'list' },
  { key: 'pain',       label: '疼痛评估', icon: 'assess' },
  { key: 'neck',       label: '颈肩',     icon: 'records' },
  { key: 'function',   label: '功能',     icon: 'todo' },
  { key: 'balance',    label: '平衡',     icon: 'schedule' },
  { key: 'psych',      label: '心理',     icon: 'assess' },
  { key: 'upper',      label: '上肢',     icon: 'records' },
  { key: 'lower',      label: '下肢',     icon: 'records' },
  { key: 'cardio',     label: '心肺',     icon: 'assess' }
];

/* ---------- 常量：量表库 ---------- */
const SCALE_LIBRARY = [
  { key: 'vas',      name: '视觉模拟疼痛评分 (VAS)',  category: 'pain',     icon: 'assess', scoreRange: '0-10',
    desc: '最常用的单维度疼痛评估工具，通过 0-10 cm 的直线直观反映患者疼痛感受。',
    usage: '在纸上或白板上画一条 10 cm 直线，左端标注"无痛 (0)"，右端标注"最剧烈疼痛 (10)"。让患者在直线上标出当前疼痛位置，测量刻度即为评分。' },
  { key: 'nrs',      name: '数字疼痛评分 (NRS)',    category: 'pain',     icon: 'assess', scoreRange: '0-10',
    desc: '0-10 分的数字化疼痛评估量表，简单易用，适用于成人及能理解数字的儿童。',
    usage: '询问患者当前疼痛程度，0 为无痛，10 为最痛。让患者说出一个数字，即为当前疼痛评分。' },
  { key: 'neckdis',  name: '颈部功能障碍指数 (NDI)',  category: 'neck',     icon: 'records', scoreRange: '0-50',
    desc: '针对颈椎病患者的功能障碍评估，涵盖疼痛强度、个人生活、工作、驾驶、睡眠等 10 项。',
    usage: '让患者根据过去一周的症状，对 10 项日常活动选择 0-5 的等级，总分越高表示功能障碍越严重。' },
  { key: 'shoulder', name: '肩关节功能评分 (ASES)',  category: 'neck',     icon: 'records', scoreRange: '0-100',
    desc: '美国肩肘外科协会评分，由患者自评（疼痛与日常活动）和医生评估（活动度、稳定性等）组成。',
    usage: '分为自我评估部分（疼痛 0-10 + 10 项日常活动）和医生检查部分（活动范围、肌力、稳定性、体征）。满分为 100。' },
  { key: 'rom',      name: '关节活动度 (ROM)',       category: 'function', icon: 'todo', scoreRange: '按关节',
    desc: '评估各关节主动/被动活动范围，是康复治疗最基本的功能评估。',
    usage: '使用量角器测量或通过目测评估主要关节的主动与被动活动范围，记录异常角度及受限方向。' },
  { key: 'mmt',      name: '徒手肌力测试 (MMT)',     category: 'function', icon: 'todo', scoreRange: '0-5',
    desc: '由 Lovett 提出的肌力分级标准，通过抗阻力、抗重力、去重力等方式评定 0-5 级肌力。',
    usage: '让患者按标准姿势收缩目标肌群，检查者施加阻力或重力，依据 Lovett 分级标准给出 0-5 级评定。' },
  { key: 'berg',     name: 'Berg 平衡量表',          category: 'balance',  icon: 'schedule', scoreRange: '0-56',
    desc: '14 项平衡能力测试，广泛用于脑卒中、老年人及前庭疾病患者的平衡功能评估。',
    usage: '按 14 项任务依次测试：坐位→站立→转移→闭眼站立→单腿站立等，每项 0-4 分，总分 56 分。' },
  { key: 'tinetti',  name: 'Tinetti 平衡与步态量表', category: 'balance',  icon: 'schedule', scoreRange: '0-28',
    desc: '包含平衡（16 项）和步态（8 项）两部分，用于评估老年人跌倒风险。',
    usage: '先进行平衡测试（坐位、站立、转身等），再进行步态测试，各项 0-2 或 0-1 分，分数越低跌倒风险越高。' },
  { key: 'gds',      name: '简易精神状态量表 (GDS)', category: 'psych',    icon: 'assess', scoreRange: '0-30',
    desc: '老年人抑郁筛查量表，共 30 题，中文版常用 15 题或 5 题版本。',
    usage: '以"是/否"作答，总分越高抑郁症状越明显。通常 ≥ 10 分建议进一步评估。' },
  { key: 'sas',      name: 'Zung 焦虑自评量表 (SAS)', category: 'psych',   icon: 'assess', scoreRange: '25-100',
    desc: '20 项症状自评量表，评估过去一周的焦虑症状频率与程度。',
    usage: '让患者根据最近一周的感受，对 20 项症状选择 1-4 级频率，计算粗分后乘 1.25 得标准分。≥50 为异常。' },
  { key: 'dash',     name: '上肢功能障碍量表 (DASH)', category: 'upper',   icon: 'records', scoreRange: '0-100',
    desc: '美国手外科学会上肢功能量表，评估上肢疾患对日常活动的影响。',
    usage: '30 项自填表，涵盖日常活动、症状、社交、工作等，原始分转换为 0-100 分，分数越高障碍越严重。' },
  { key: '握力',     name: '握力测试',               category: 'upper',   icon: 'records', scoreRange: '按年龄',
    desc: '使用握力计评估前臂屈肌群力量，是上肢功能评估的重要指标。',
    usage: '患者坐位，上臂贴紧躯干，前臂中立位，使用握力计以最大力量握 3 次，取最大值，与同年龄同性别标准对比。' },
  { key: 'fma',      name: 'Fugl-Meyer 下肢评分',    category: 'lower',   icon: 'records', scoreRange: '0-34',
    desc: '脑卒中偏瘫患者下肢运动功能评估，包含 7 项反射、9 项主动运动、3 项协调与速度。',
    usage: '按标准动作逐项测试，每项 0-2 分，满分 34 分。' },
  { key: 'walk',     name: '10 米步行测试 (10MWT)',  category: 'lower',   icon: 'records', scoreRange: '按秒',
    desc: '评估患者步行速度与能力的简单、可靠工具。',
    usage: '在一条 16 米长的通道中，以 1 米助跑距离计时行走 10 米，记录完成时间，通常测 3 次取平均值。' },
  { key: '6mwt',     name: '6 分钟步行测试 (6MWT)',  category: 'cardio',  icon: 'assess', scoreRange: '米',
    desc: '评估心肺功能及整体运动耐力的经典测试，适用于多种慢性疾病。',
    usage: '在一条 30 米直线路径上，患者在 6 分钟内以自己能耐受的最快速度往返行走，测量步行总距离。' },
  { key: 'nyha',     name: 'NYHA 心功能分级',        category: 'cardio',  icon: 'assess', scoreRange: 'I-IV',
    desc: '纽约心脏病协会心功能分级，将患者活动能力分为 I-IV 级。',
    usage: '根据患者日常活动受限程度分为 4 级：I 级无症状、II 级轻度受限、III 级明显受限、IV 级静息也有症状。' }
];

/* ---------- 辅助：构建分类筛选标签 ---------- */
function buildCategoryTabs(activeKey) {
  const tabs = SCALE_CATEGORIES.map(function (c) {
    const activeCls = c.key === activeKey ? ' active' : '';
    const safeKey = window.Esc.escAttr(c.key);
    const safeLabel = window.Esc.esc(c.label);
    const iconHtml = c.icon ? window.getIcon(c.icon) : '';
    return '<div class="filter-tab' + activeCls + '" data-scale-cat="' + safeKey + '">' +
      iconHtml + '<span>' + safeLabel + '</span></div>';
  }).join('');
  return '<div class="filter-tabs scale-cat-tabs">' + tabs + '</div>';
}

/* ---------- 辅助：构建量表卡片网格 ---------- */
function buildScaleGrid(category) {
  const list = SCALE_LIBRARY.filter(function (s) {
    return category === 'all' || s.category === category;
  });

  if (list.length === 0) {
    return '<div class="panel-empty">该分类下暂无量表</div>';
  }

  const cards = list.map(function (s) {
    const safeKey = window.Esc.escAttr(s.key);
    const safeName = window.Esc.esc(s.name);
    const safeCat = window.Esc.esc((getCategoryLabel(s.category) || ''));
    const safeRange = window.Esc.esc(s.scoreRange || '');
    const iconHtml = s.icon ? window.getIcon(s.icon) : '';
    const catColor = getCategoryColor(s.category);
    return '' +
      '<div class="scale-card" data-scale-key="' + safeKey + '">' +
        '<div class="scale-card-icon" style="color:' + catColor + '">' + iconHtml + '</div>' +
        '<div class="scale-card-body">' +
          '<div class="scale-card-name">' + safeName + '</div>' +
          '<div class="scale-card-meta">' +
            '<span class="scale-card-tag" style="background:' + catColor + '">' + safeCat + '</span>' +
            '<span class="scale-card-range">满分 ' + safeRange + '</span>' +
          '</div>' +
        '</div>' +
      '</div>';
  }).join('');

  return '<div class="scale-grid">' + cards + '</div>';
}

/* ---------- 辅助：分类标签 ---------- */
function getCategoryLabel(key) {
  for (let i = 0; i < SCALE_CATEGORIES.length; i++) {
    if (SCALE_CATEGORIES[i].key === key) return SCALE_CATEGORIES[i].label;
  }
  return '';
}

function getCategoryColor(key) {
  const colors = {
    pain: '#d9534f', neck: '#d9804a', function: '#3b82c4',
    balance: '#8b5fbf', psych: '#0e9488', upper: '#4f9e63',
    lower: '#3b82c4', cardio: '#d9534f'
  };
  return colors[key] || '#3b82c4';
}

/* ---------- 辅助：查找量表 ---------- */
function findScale(key) {
  for (let i = 0; i < SCALE_LIBRARY.length; i++) {
    if (SCALE_LIBRARY[i].key === key) return SCALE_LIBRARY[i];
  }
  return null;
}

/* ---------- 辅助：构建患者选择器选项 ---------- */
function buildPatientOptions(state) {
  const patients = state && state.patients ? state.patients : [];
  if (patients.length === 0) {
    return '<div class="panel-empty">暂无患者，请先添加</div>';
  }
  return patients.map(function (p) {
    const id = window.Esc.escAttr(p.id);
    const name = window.Esc.esc(p.name || '');
    const gender = window.Esc.esc(p.gender || '');
    const age = window.Esc.esc(p.age != null ? String(p.age) : '');
    return '<option value="' + id + '">' + name + ' · ' + gender + ' · ' + age + '岁</option>';
  }).join('');
}

/* ---------- 辅助：打开量表详情弹窗 ---------- */
function openScaleDetail(state, store, key) {
  const s = findScale(key);
  if (!s) return;

  const safeName = window.Esc.esc(s.name);
  const safeDesc = window.Esc.esc(s.desc || '');
  const safeUsage = window.Esc.esc(s.usage || '');
  const safeKey = window.Esc.escAttr(s.key);
  const safeRange = window.Esc.esc(s.scoreRange || '');

  const content = '' +
    '<div class="scale-detail-modal">' +
      '<div class="scale-detail-head">' +
        '<div class="scale-detail-title">' + safeName + '</div>' +
        '<div class="scale-detail-meta">评分范围：' + safeRange + '</div>' +
      '</div>' +
      '<div class="scale-detail-section">' +
        '<div class="scale-detail-label">说明</div>' +
        '<div class="scale-detail-text">' + safeDesc + '</div>' +
      '</div>' +
      '<div class="scale-detail-section">' +
        '<div class="scale-detail-label">使用方法</div>' +
        '<div class="scale-detail-text">' + safeUsage + '</div>' +
      '</div>' +
      '<div class="scale-detail-section">' +
        '<div class="scale-detail-label">对该患者使用</div>' +
        '<div class="scale-form-row">' +
          '<select class="form-select" data-scale-patient>' +
            '<option value="">请选择患者</option>' +
            buildPatientOptions(state) +
          '</select>' +
        '</div>' +
        '<div class="scale-form-row">' +
          '<div class="form-label">评分结果</div>' +
          '<input type="text" class="form-input" data-scale-score placeholder="请输入本次评分">' +
        '</div>' +
        '<div class="scale-form-row">' +
          '<div class="form-label">结论/备注</div>' +
          '<textarea class="form-textarea" data-scale-conclusion placeholder="结论或备注..."></textarea>' +
        '</div>' +
      '</div>' +
      '<div class="scale-detail-footer">' +
        '<button type="button" class="btn btn-ghost" data-scale-cancel>取消</button>' +
        '<button type="button" class="btn btn-primary" data-scale-use="' + safeKey + '">保存记录</button>' +
      '</div>' +
    '</div>';

  window.Modal.open({
    title: '量表详情',
    content: content,
    onMount: function (root) {
      const cancelBtn = root.querySelector('[data-scale-cancel]');
      if (cancelBtn) cancelBtn.addEventListener('click', function () {
        window.Modal.close();
      });

      const useBtn = root.querySelector('[data-scale-use]');
      if (useBtn) {
        useBtn.addEventListener('click', function () {
          const patientEl = root.querySelector('[data-scale-patient]');
          const scoreEl = root.querySelector('[data-scale-score]');
          const conclusionEl = root.querySelector('[data-scale-conclusion]');
          const patientId = patientEl ? patientEl.value : '';
          const score = scoreEl ? scoreEl.value : '';
          const conclusion = conclusionEl ? conclusionEl.value : '';

          if (!patientId) {
            window.Modal.toast('请选择患者');
            return;
          }
          if (!score) {
            window.Modal.toast('请输入评分');
            return;
          }

          const now = new Date();
          const pad = function (n) { return n < 10 ? '0' + n : '' + n; };
          const dateStr = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
          const timeStr = pad(now.getHours()) + ':' + pad(now.getMinutes());

          store.dispatch({
            type: 'ADD_RECORD',
            payload: {
              id: 'rec_' + Date.now(),
              type: 'scale',
              patientId: patientId,
              title: s.name,
              summary: '评分 ' + score + ' / ' + (s.scoreRange || ''),
              date: dateStr,
              time: timeStr,
              createdAt: now.getTime(),
              data: {
                key: s.key,
                name: s.name,
                category: s.category,
                score: score,
                conclusion: conclusion
              }
            }
          });

          window.Modal.close();
          window.Modal.toast('评估记录已保存');
        });
      }
    }
  });
}

/* ---------- 主渲染函数 ---------- */
function renderScale(state, store) {
  state = state || {};

  const html = '' +
    '<div class="scale-view">' +
      '<div class="page-header-bar">' +
        '<div class="page-header-title">量表库</div>' +
        '<div class="page-header-meta">标准化康复评估量表集合</div>' +
      '</div>' +
      '<div data-scale-root>' +
        buildCategoryTabs('all') +
        buildScaleGrid('all') +
      '</div>' +
    '</div>';

  // 挂载后绑定交互
  setTimeout(function () {
    const root = document.querySelector('[data-scale-root]');
    if (!root) return;

    // 分类切换
    root.addEventListener('click', function (ev) {
      const tab = ev.target.closest && ev.target.closest('[data-scale-cat]');
      if (tab) {
        const key = tab.getAttribute('data-scale-cat');
        const newHtml = buildCategoryTabs(key) + buildScaleGrid(key);
        root.innerHTML = newHtml;
        return;
      }
      // 卡片点击
      const card = ev.target.closest && ev.target.closest('[data-scale-key]');
      if (card) {
        const k = card.getAttribute('data-scale-key');
        openScaleDetail(state, store, k);
      }
    });
  }, 0);

  return html;
}

// 暴露到全局
window.ScaleView = {
  registerRoutes: registerRoutes,
  render: renderScale,
  _library: SCALE_LIBRARY,
  _openDetail: openScaleDetail
};
