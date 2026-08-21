/* ============================================================
 * views/fee.js - 收费项目视图
 * 展示收费项目卡片网格，支持分类筛选、新增/删除、统计
 * ============================================================ */
if (window.__REHAB_VIEW_FEE_LOADED__) return;
window.__REHAB_VIEW_FEE_LOADED__ = true;

/* ---------- 路由注册 ---------- */
function registerRoutes(router, store) {
  router.register('/fee', function () {
    const state = store.getState();
    return renderFee(state, store);
  });
}

/* ---------- 内存中的默认收费项目数据 ---------- */
let feeItems = [
  { id: 'fee_1', name: '首次评估', price: 120, unit: '次', category: '评估' },
  { id: 'fee_2', name: '复诊评估', price: 80, unit: '次', category: '评估' },
  { id: 'fee_3', name: '针灸治疗', price: 60, unit: '次', category: '治疗' },
  { id: 'fee_4', name: '推拿治疗', price: 80, unit: '次', category: '治疗' },
  { id: 'fee_5', name: '一个疗程治疗包', price: 600, unit: '疗程', category: '治疗' },
  { id: 'fee_6', name: 'X 光检查', price: 150, unit: '次', category: '检查' },
  { id: 'fee_7', name: '血液检查', price: 200, unit: '次', category: '检查' },
  { id: 'fee_8', name: '膏药耗材', price: 30, unit: '包', category: '耗材' },
  { id: 'fee_9', name: '其他服务', price: 50, unit: '次', category: '其他' }
];

/* ---------- 分类定义 ---------- */
const FEE_CATEGORIES = [
  { key: 'all',     label: '全部' },
  { key: '评估',    label: '评估' },
  { key: '治疗',    label: '治疗' },
  { key: '检查',    label: '检查' },
  { key: '耗材',    label: '耗材' },
  { key: '其他',    label: '其他' }
];

/* ---------- 分类颜色 ---------- */
const CATEGORY_COLORS = {
  '评估': '#3b82c4',
  '治疗': '#10b981',
  '检查': '#8b5fbf',
  '耗材': '#d9804a',
  '其他': '#6b7280'
};

/* ---------- 辅助：从 state 或内存中获取列表 ---------- */
function getFeeItems(state) {
  if (state && state.feeItems && state.feeItems.length) {
    return state.feeItems;
  }
  return feeItems;
}

/* ---------- 辅助：构建分类筛选标签 ---------- */
function buildFilterTabs() {
  const tabs = FEE_CATEGORIES.map(function (c) {
    return '' +
      '<span class="filter-tab" data-filter="' + window.Esc.escAttr(c.key) + '">' +
        window.Esc.esc(c.label) +
      '</span>';
  }).join('');

  return '<div class="filter-tabs">' + tabs + '</div>';
}

/* ---------- 辅助：构建收费项目卡片网格 ---------- */
function buildFeeCards(state) {
  const items = getFeeItems(state);

  if (items.length === 0) {
    return '' +
      '<div class="panel">' +
        '<div class="panel-empty">' +
          '<div class="empty-icon">💰</div>' +
          '<div class="empty-text">暂无收费项目</div>' +
        '</div>' +
      '</div>';
  }

  const cards = items.map(function (item) {
    const id = window.Esc.escAttr(item.id);
    const name = window.Esc.esc(item.name || '');
    const price = item.price || 0;
    const unit = window.Esc.esc(item.unit || '次');
    const category = window.Esc.esc(item.category || '其他');
    const color = window.Esc.escAttr(CATEGORY_COLORS[item.category] || CATEGORY_COLORS['其他']);

    return '' +
      '<div class="fee-card" data-category="' + window.Esc.escAttr(item.category) + '">' +
        '<div class="fee-card-hd">' +
          '<span class="fee-card-name">' + name + '</span>' +
          '<span class="fee-card-cat" style="background:' + color + '">' + category + '</span>' +
        '</div>' +
        '<div class="fee-card-price">¥' + price +
          '<span class="fee-card-unit"> / ' + unit + '</span>' +
        '</div>' +
        '<div class="fee-card-actions">' +
          '<button class="btn-ghost fee-delete" data-fee-id="' + id + '">' +
            window.getIcon('trash') + ' 删除' +
          '</button>' +
        '</div>' +
      '</div>';
  }).join('');

  return '' +
    '<div class="panel">' +
      '<div class="panel-hd">' +
        '<span class="panel-title">收费项目</span>' +
        '<span class="panel-count">' + items.length + ' 项</span>' +
      '</div>' +
      '<div class="fee-grid">' + cards + '</div>' +
    '</div>';
}

/* ---------- 辅助：构建统计卡片 ---------- */
function buildStats(state) {
  const items = getFeeItems(state);
  const total = items.length;
  const totalAmount = items.reduce(function (sum, it) {
    return sum + (Number(it.price) || 0);
  }, 0);
  const avg = total > 0 ? (totalAmount / total).toFixed(2) : '0.00';

  const cards = [
    { label: '项目数', value: total, icon: 'records', color: '#3b82c4' },
    { label: '总金额', value: '¥' + totalAmount.toFixed(2), icon: 'fee', color: '#10b981' },
    { label: '平均单价', value: '¥' + avg, icon: 'plan', color: '#8b5fbf' }
  ];

  return '' +
    '<div class="stats-grid">' +
      cards.map(function (c) {
        return '' +
          '<div class="stat-card">' +
            '<div class="stat-icon" style="color:' + c.color + '">' + window.getIcon(c.icon) + '</div>' +
            '<div class="stat-body">' +
              '<div class="stat-value">' + c.value + '</div>' +
              '<div class="stat-label">' + window.Esc.esc(c.label) + '</div>' +
            '</div>' +
          '</div>';
      }).join('') +
    '</div>';
}

/* ---------- 辅助：处理新增项目 ---------- */
function promptAddFee(store) {
  const result = window.Modal.prompt('新增收费项目', '请填写项目信息（格式：名称|价格|单位|分类）：', '例如：中药治疗|50|次|治疗');
  if (!result) return;
  const text = (result.text || '').trim();
  if (!text) {
    window.Modal.toast('内容不能为空');
    return;
  }
  const parts = text.split('|').map(function (s) { return s.trim(); });
  if (parts.length < 2) {
    window.Modal.toast('格式错误，请填写至少名称和价格');
    return;
  }
  const item = {
    id: 'fee_' + Date.now(),
    name: parts[0],
    price: Number(parts[1]) || 0,
    unit: parts[2] || '次',
    category: parts[3] || '其他'
  };

  if (store && typeof store.dispatch === 'function') {
    store.dispatch({
      type: 'ADD_FEE_ITEM',
      payload: item
    });
  }
  feeItems.push(item);
  window.Modal.toast('已添加');
  if (window.Router && typeof window.Router.refresh === 'function') {
    window.Router.refresh();
  }
}

/* ---------- 辅助：处理删除项目 ---------- */
function deleteFee(store, id) {
  window.Modal.confirm('删除确认', '确定要删除该收费项目吗？', function (ok) {
    if (!ok) return;
    if (store && typeof store.dispatch === 'function') {
      store.dispatch({
        type: 'DELETE_FEE_ITEM',
        payload: { id: id }
      });
    }
    feeItems = feeItems.filter(function (it) { return it.id !== id; });
    window.Modal.toast('已删除');
    if (window.Router && typeof window.Router.refresh === 'function') {
      window.Router.refresh();
    }
  });
}

/* ---------- 主渲染函数 ---------- */
function renderFee(state, store) {
  state = state || {};

  return '' +
    '<div class="fee-view">' +
      '<div class="page-header-bar">' +
        '<div class="page-header-title">收费项目</div>' +
        '<button class="btn-primary fee-add-btn">+ 新增项目</button>' +
      '</div>' +
      buildStats(state) +
      buildFilterTabs() +
      buildFeeCards(state) +
    '</div>';
}

// 暴露到全局
window.FeeView = {
  registerRoutes: registerRoutes,
  render: renderFee,
  _add: promptAddFee,
  _delete: deleteFee
};
