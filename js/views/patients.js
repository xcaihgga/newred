/* ============================================================
 * views/patients.js - 患者列表视图
 * 展示患者卡片网格 + 示例患者模板 + 新增患者
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
      '<input type="text" class="search-input" id="patientSearch" placeholder="按姓名 / 诊断 搜索患者...">' +
      '<button class="search-clear" id="patientSearchClear" style="display:none">✕</button>' +
    '</div>';
}

/* ---------- 辅助：构建示例患者模板面板 ---------- */
function buildTemplatePanel() {
  const tpls = (window.PatientTemplates && window.PatientTemplates.list) || [];
  if (tpls.length === 0) return '';

  const cards = tpls.map(function (t) {
    const name = window.Esc.esc(t.name);
    const desc = window.Esc.esc(t.desc);
    const tag = window.Esc.esc(t.tag);
    const tagCls = t.tagCls === 'neuro' ? 'tag-neuro' : 'tag-msk';
    return '' +
      '<div class="tpl-item" data-tpl="' + window.Esc.escAttr(t.key) + '" role="button" tabindex="0">' +
        '<span class="tpl-tag ' + tagCls + '">' + tag + '</span>' +
        '<div class="tpl-name">' + name + '</div>' +
        '<div class="tpl-desc">' + desc + '</div>' +
      '</div>';
  }).join('');

  return '' +
    '<div class="panel tpl-panel">' +
      '<div class="panel-hd">' +
        '<span class="panel-title">🎓 示例患者模板（点击一键载入完整评估数据）</span>' +
      '</div>' +
      '<div class="tpl-grid">' + cards + '</div>' +
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
          '<div class="empty-text">暂无患者，点击右上角「＋ 新增患者」或选择上方示例模板</div>' +
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
      // 顶部统计 + 新增患者按钮
      '<div class="page-header-bar">' +
        '<div>' +
          '<div class="page-header-title">患者管理</div>' +
          '<div class="page-header-meta">共 ' + total + ' 位患者</div>' +
        '</div>' +
        '<button class="btn btn-primary" id="btnAddPatient">＋ 新增患者</button>' +
      '</div>' +
      // 示例患者模板
      buildTemplatePanel() +
      // 搜索框
      buildSearchBox() +
      // 卡片网格
      buildPatientCards(state) +
    '</div>';
}

/* ---------- 新增患者（手动录入） ---------- */
function promptAddPatient(store) {
  const formHtml = '' +
    '<div class="tpl-form">' +
      '<label class="tpl-form-row"><span class="tpl-form-label">姓名</span>' +
        '<input class="modal-input" id="npName" type="text" placeholder="患者姓名" maxlength="20"></label>' +
      '<label class="tpl-form-row"><span class="tpl-form-label">性别</span>' +
        '<select class="modal-input" id="npGender"><option value="男">男</option><option value="女">女</option></select></label>' +
      '<label class="tpl-form-row"><span class="tpl-form-label">年龄</span>' +
        '<input class="modal-input" id="npAge" type="number" placeholder="0-150" min="0" max="150"></label>' +
      '<label class="tpl-form-row"><span class="tpl-form-label">诊断</span>' +
        '<input class="modal-input" id="npDiagnosis" type="text" placeholder="诊断（可空）" maxlength="60"></label>' +
    '</div>';

  window.Modal.open({
    title: '新增患者',
    content: formHtml,
    confirmText: '保存',
    cancelText: '取消',
    onConfirm: function (dialog) {
      const nameEl = dialog.querySelector('#npName');
      const ageEl = dialog.querySelector('#npAge');
      const name = (nameEl.value || '').trim();
      const ageStr = (ageEl.value || '').trim();
      const gender = dialog.querySelector('#npGender').value;
      const diagnosis = (dialog.querySelector('#npDiagnosis').value || '').trim();

      if (!name) {
        nameEl.focus();
        window.Toast.warn('请填写姓名');
        return false;
      }
      const age = Number(ageStr);
      if (!ageStr || isNaN(age) || age < 0 || age > 150) {
        ageEl.focus();
        window.Toast.warn('年龄需为 0-150 的数字');
        return false;
      }

      store.dispatch({
        type: 'ADD_PATIENT',
        payload: {
          id: 'p-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6),
          name: name,
          gender: gender,
          age: age,
          diagnosis: diagnosis || '未诊断',
          tag: '未分类',
          tagCls: 'default',
          phone: '',
          color: '#3b82c4',
          lastVisit: '尚未就诊',
          pending: false
        }
      });
      window.Toast.success('已新增患者：' + name);
      if (window.Router && typeof window.Router.refresh === 'function') window.Router.refresh();
    }
  });
}

/* ---------- 载入示例模板患者 ---------- */
function loadTemplatePatient(store, key) {
  if (!window.PatientTemplates) {
    window.Toast.warn('模板库未加载');
    return;
  }
  const tpl = window.PatientTemplates.list.filter(function (t) { return t.key === key; })[0];
  if (!tpl) return;

  window.Modal.confirm(
    '载入示例患者',
    '将创建一位「<b>' + window.Esc.esc(tpl.name) + '</b>」示例患者，包含完整的主诉/评估/量表/康复方案。确认载入？',
    function () {
      const p = window.PatientTemplates.loadTemplate(key);
      if (!p) return;
      store.dispatch({ type: 'ADD_PATIENT', payload: p });
      window.Toast.success('已载入：' + p.name);
      if (window.Router && typeof window.Router.refresh === 'function') {
        window.Router.refresh();
      }
      setTimeout(function () {
        const card = document.querySelector('.patient-card[data-nav="/patients/' + p.id + '"]');
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          card.classList.add('hl-new');
          setTimeout(function () { card.classList.remove('hl-new'); }, 2000);
        }
      }, 300);
    }
  );
}

/* ---------- 渲染后事件绑定 ---------- */
function init(container, store) {
  if (!container) return;

  // 新增患者按钮
  const addBtn = container.querySelector('#btnAddPatient');
  if (addBtn && !addBtn._bound) {
    addBtn._bound = true;
    addBtn.addEventListener('click', function () { promptAddPatient(store); });
  }

  // 示例模板卡片
  container.querySelectorAll('[data-tpl]').forEach(function (el) {
    if (el._bound) return;
    el._bound = true;
    const key = el.getAttribute('data-tpl');
    el.addEventListener('click', function () { loadTemplatePatient(store, key); });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); loadTemplatePatient(store, key); }
    });
  });

  // 本地搜索过滤
  const searchInput = container.querySelector('#patientSearch');
  const clearBtn = container.querySelector('#patientSearchClear');
  if (searchInput && !searchInput._bound) {
    searchInput._bound = true;
    searchInput.addEventListener('input', function () {
      const kw = searchInput.value.trim().toLowerCase();
      clearBtn.style.display = kw ? 'block' : 'none';
      container.querySelectorAll('.patient-card').forEach(function (card) {
        const text = (card.textContent || '').toLowerCase();
        card.style.display = (kw && text.indexOf(kw) === -1) ? 'none' : '';
      });
    });
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        searchInput.focus();
      });
    }
  }
}

// 暴露到全局
window.PatientsView = {
  registerRoutes: registerRoutes,
  render: renderPatients,
  init: init
};
})();