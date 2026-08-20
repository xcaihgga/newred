/* ============================================================
   个人康复工作台 · 路由 + 渲染 + 交互（原型，纯前端）
   ============================================================ */

/* ---------- 图标（Lucide 风格 24×24 stroke） ---------- */
var ICONS = {
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  listchecks: '<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',
  settings: '<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>',
  search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  menu: '<line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>',
  x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  chevron: '<polyline points="9 18 15 12 9 6"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  clipboard: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>',
  filetext: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  checkcircle: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  alert: '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mappin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'
};

function icon(name) {
  var p = ICONS[name] || ICONS.grid;
  return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>';
}

/* ---------- 工具 ---------- */
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function px(id) { return getPatient(id); }
function initials(name) { return String(name).replace(/[·示例]/g, '').slice(0, 1); }

var EXAM_RESULT = { positive: { t: '阳性', c: 'pos' }, negative: { t: '阴性', c: 'neg' }, suspect: { t: '可疑', c: 'neutral' } };
var LEVEL = { high: { t: '高', c: 'pri-h' }, mid: { t: '中', c: 'pri-m' }, low: { t: '低', c: 'pri-l' } };
var RECORD_TYPES = {
  assessment: { label: '评估', color: '#0e9488', icon: 'clipboard' },
  exam: { label: '特殊检查', color: '#3b82c4', icon: 'activity' },
  scale: { label: '量表', color: '#8b5fbf', icon: 'activity' },
  plan: { label: '方案', color: '#d9804a', icon: 'filetext' },
  treatment: { label: '治疗', color: '#0e9488', icon: 'clock' },
  photo: { label: '照片', color: '#4f9e63', icon: 'grid' }
};

function toast(msg) {
  var t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(function () { t.remove(); }, 1800);
}

/* ---------- 导航配置 ---------- */
var NAV = [
  { route: 'dashboard', label: '今日概览', ic: 'home' },
  { route: 'schedule', label: '日程', ic: 'calendar' },
  { route: 'records', label: '记录', ic: 'filetext' },
  { route: 'patients', label: '患者', ic: 'users' },
  { route: 'todo', label: '待办', ic: 'listchecks' },
  { route: 'settings', label: '设置', ic: 'settings' }
];
var ROUTE_TITLES = { dashboard: '今日概览', schedule: '日程', records: '记录中心', patients: '患者管理', patient: '患者详情', todo: '待办与打卡', settings: '设置', assess: '评估量表' };

/* ---------- Shell 初始化 ---------- */
function renderShell() {
  var sq = icon('search');
  var bell = icon('bell');
  var plus = icon('plus');
  var menu = icon('menu');
  document.getElementById('searchIc').innerHTML = sq;
  document.getElementById('btnNotify').innerHTML = bell + '<span class="dot"></span>';
  document.getElementById('btnPlus').innerHTML = plus;
  document.getElementById('hamburger').innerHTML = menu;

  var navHtml = NAV.map(function (n) {
    return '<a class="nav-item" data-route="' + n.route + '" href="#/' + n.route + '">' +
      '<span class="ic">' + icon(n.ic) + '</span>' + n.label +
      (n.route === 'todo' ? '<span class="badge todo-badge">' + openTodoCount() + '</span>' : '') +
      '</a>';
  }).join('');
  document.getElementById('navDesk').innerHTML = '<div class="nav-label">工作台</div>' + navHtml;
  document.getElementById('navMobile').innerHTML = '<div class="nav-label">工作台</div>' + navHtml;

  var th = DB.therapist;
  var tc = '<div class="therapist"><div class="av">' + esc(th.avatar) + '</div><div><div class="tn">' + esc(th.name) + '</div><div class="tr">' + esc(th.department) + ' · ' + esc(th.role) + '</div></div></div>';
  document.getElementById('sideFootDesk').innerHTML = tc;
  document.getElementById('sideFootMobile').innerHTML = tc;

  /* 底栏（移动，最多 5 项：不含设置） */
  var tabItems = NAV.slice(0, 5).map(function (n) {
    return '<div class="tabx" data-route="' + n.route + '" onclick="go(\'' + n.route + '\')">' + icon(n.ic) + '<span>' + n.label.replace('今日概览', '首页') + '</span></div>';
  }).join('');
  document.getElementById('tabbar').innerHTML = tabItems;
  document.getElementById('fab').innerHTML = icon('plus');

  document.getElementById('hamburger').onclick = function () { document.getElementById('mDrawer').style.display = 'flex'; };
  document.querySelector('[data-close-drawer]').onclick = closeDrawer;
  document.getElementById('btnNotify').onclick = function () { toast('暂无新通知（原型演示）'); };
  document.getElementById('btnPlus').onclick = openAddMenu;
  document.getElementById('fab').onclick = openAddMenu;
  document.getElementById('globalSearch').onkeydown = function (e) {
    if (e.key === 'Enter') { go('patients'); toast('原型演示：搜索聚焦患者列表'); }
  };
}

function openTodoCount() {
  return DB.todos.filter(function (t) { return !t.done; }).length;
}
function closeDrawer() { document.getElementById('mDrawer').style.display = 'none'; }

function openAddMenu() {
  openModal(
    '<div class="modal-hd"><span>快速新建</span><span class="x" onclick="closeModal()">×</span></div>' +
    '<div class="modal-bd">' +
    '<div class="g2" style="display:grid">' +
    addMenuBtn('patients', 'users', '新增患者', '建立患者档案') +
    addMenuBtn('schedule', 'calendar', '新建预约', '安排治疗/评估时间') +
    addMenuBtn('records', 'filetext', '新增记录', '治疗 / 评估 / 量表 / 照片') +
    addMenuBtn('assess', 'clipboard', '快速评估', '量表 + 特殊检查') +
    addMenuBtn('todo', 'listchecks', '添加待办', '记录今日待办') +
    '</div></div>'
  );
}
function addMenuBtn(route, ic, t, s) {
  return '<div class="scale-item" style="flex-direction:column;align-items:flex-start;gap:4px" onclick="closeModal();go(\'' + route + '\')">' +
    '<span class="s-ic" style="background:var(--accent-muted);color:var(--accent)">' + icon(ic) + '</span>' +
    '<span class="si-name">' + t + '</span><span class="si-sub">' + s + '</span></div>';
}

/* ---------- 路由 ---------- */
function parseRoute() {
  var h = location.hash.replace(/^#\/?/, '');
  return h.split('/').filter(Boolean);
}
function route() {
  var p = parseRoute();
  var section = p[0] || 'dashboard';
  if (!ROUTE_TITLES[section]) section = 'dashboard';
  document.getElementById('pageTitle').textContent = ROUTE_TITLES[section] || '今日概览';
  updateNav(section === 'patient' ? 'patients' : section);
  closeDrawer();
  var html;
  if (section === 'dashboard') html = renderDashboard();
  else if (section === 'schedule') html = renderSchedule();
  else if (section === 'records') html = renderRecords();
  else if (section === 'patients') html = renderPatients();
  else if (section === 'patient') html = renderPatientDetail(p[1], p[2] || 'assessment');
  else if (section === 'todo') html = renderTodo();
  else if (section === 'assess') html = renderAssess();
  else if (section === 'settings') html = renderSettings();
  document.getElementById('view').innerHTML = html;
  window.scrollTo(0, 0);
}
function updateNav(section) {
  document.querySelectorAll('#navDesk .nav-item, #navMobile .nav-item').forEach(function (el) {
    el.classList.toggle('on', el.getAttribute('data-route') === section);
  });
  document.querySelectorAll('#tabbar .tabx').forEach(function (el) {
    el.classList.toggle('on', el.getAttribute('data-route') === section);
  });
}
function go(r) { location.hash = '#/' + r; }
function goPatient(id, tab) { location.hash = '#/patient/' + id + (tab ? '/' + tab : ''); }

window.addEventListener('hashchange', route);

/* ---------- 通用小块 ---------- */
function statCard(ic, color, num, lbl, delta, up) {
  return '<div class="stat">' +
    '<div class="s-top"><span class="s-ic" style="background:' + color + '22;color:' + color + '">' + icon(ic) + '</span></div>' +
    '<div class="s-num">' + num + '</div><div class="s-lbl">' + lbl + '</div>' +
    (delta ? '<div class="s-delta ' + (up ? 'up' : '') + '">' + delta + '</div>' : '') +
    '</div>';
}
function tag(text, cls) { return '<span class="tag ' + cls + '">' + text + '</span>'; }
function avatarHtml(p, size) {
  return '<div class="av" style="background:' + (p && p.color || '#0e9488') + '">' + initials(p ? p.name : '') + '</div>';
}

/* ---------- 视图：今日概览 ---------- */
function renderDashboard() {
  var th = DB.therapist;
  var s = DB.stats;
  var appts = DB.schedule.slice(0, 4);
  var tl = appts.map(function (a) {
    var p = px(a.patientId);
    return '<div class="tl-item"><div class="tl-time">' + a.time + '</div>' +
      '<div class="tl-dot" style="background:' + a.color + '"></div>' +
      '<div class="tl-body"><div class="tb-t">' + esc(p.name) + ' · ' + a.type + '</div>' +
      '<div class="tb-m"><span>' + esc(a.note) + '</span><span class="tagchip">' + esc(p.diagnosis) + '</span></div></div></div>';
  }).join('');

  var recentRecs = DB.records.slice(0, 4).map(recordRow).join('');

  var todos = DB.todos.slice(0, 3).map(todoRow).join('');

  return (
    '<div class="hero">' +
      '<div class="h-left">' +
        '<div class="h-hi">' + greet() + '，' + esc(th.name) + '</div>' +
        '<div class="h-name">' + esc(th.department) + ' · ' + esc(th.role) + '</div>' +
        '<div class="h-sub">今天有 ' + s.todayAppt + ' 个预约，已完成 ' + s.todayDone + ' 项，还有 ' + s.pending + ' 位患者待评估。</div>' +
        '<button class="h-cta" onclick="go(\'schedule\')">' + icon('calendar') + ' 查看今日日程</button>' +
      '</div>' +
    '</div>' +

    '<div class="grid g4" style="margin-top:16px">' +
      statCard('calendar', '#0e9488', s.todayAppt, '今日预约', '较昨日 +1', true) +
      statCard('filetext', '#8b5fbf', s.todayRecords, '今日记录', '评估+治疗+量表') +
      statCard('users', '#3b82c4', s.totalPatients, '在管患者', '本月 +12') +
      statCard('alert', '#d9804a', s.pending, '待评估', '需今日处理') +
    '</div>' +

    '<div class="grid g13" style="margin-top:16px">' +
      '<div class="card"><div class="card-hd"><div class="tt">今日日程<small>前 ' + appts.length + ' 项</small></div><div class="lnk" onclick="go(\'schedule\')">全部</div></div>' +
        '<div class="card-bd">' + (tl || emptyBlock('今天暂无预约')) + '</div></div>' +

      '<div class="grid" style="gap:16px">' +
        '<div class="card"><div class="card-hd"><div class="tt">待办</div><div class="lnk" onclick="go(\'todo\')">全部</div></div>' +
          '<div class="card-bd">' + (todos || emptyBlock('待办已清空')) + '</div></div>' +
        '<div class="card"><div class="card-hd"><div class="tt">最近记录</div><div class="lnk" onclick="go(\'records\')">全部</div></div>' +
          '<div class="card-bd" style="padding:12px 15px;display:flex;flex-direction:column;gap:8px">' + (recentRecs || emptyBlock('暂无记录')) + '</div></div>' +
      '</div>' +
    '</div>' +

    '<div class="card" style="margin-top:16px"><div class="card-hd"><div class="tt">快捷入口</div></div>' +
      '<div class="card-bd"><div class="chips">' +
      quick('records', 'filetext', '记录中心') + quick('patients', 'users', '新增患者') +
      quick('assess', 'clipboard', '快速评估') + quick('assess', 'activity', '量表库') +
      quick('schedule', 'calendar', '排班') + quick('settings', 'settings', '收费查询') +
      '</div></div></div>'
  );
}
function greet() {
  var h = new Date().getHours();
  if (h < 6) return '凌晨好';
  if (h < 12) return '早上好';
  if (h < 14) return '中午好';
  if (h < 18) return '下午好';
  return '晚上好';
}
function quick(route, ic, t) {
  return '<span class="chip" onclick="go(\'' + route + '\')">' + icon(ic) + ' ' + t + '</span>';
}
function emptyBlock(t) { return '<div class="empty" style="padding:20px"><div class="et">' + t + '</div></div>'; }

/* ---------- 视图：日程 ---------- */
var DAY_LABELS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
function renderSchedule() {
  var timeline = DB.schedule.map(function (a) {
    var p = px(a.patientId);
    return '<div class="tl-item"><div class="tl-time">' + a.time + '</div>' +
      '<div class="tl-dot" style="background:' + a.color + '"></div>' +
      '<div class="tl-body"><div class="tb-t">' + esc(p.name) + ' · ' + a.type + '</div>' +
      '<div class="tb-m"><span>' + esc(a.note) + '</span></div></div></div>';
  }).join('');

  return (
    '<div class="card" style="margin-bottom:16px"><div class="card-bd" style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap">' +
      '<div class="seg" id="scheduleSeg"><button class="on" onclick="setViewMode(0)">今日</button><button onclick="setViewMode(1)">周视图</button></div>' +
      '<div style="display:flex;gap:8px"><button class="btn btn-ghost btn-sm" onclick="toast(\'演示：跳转上一周\')">上一周</button>' +
      '<button class="btn btn-primary btn-sm" onclick="openApptModal()">' + icon('plus') + ' 新建预约</button></div>' +
    '</div></div>' +
    '<div id="scheduleBody">' +
      '<div class="card"><div class="card-hd"><div class="tt">今日日程<small>' + DB.schedule.length + ' 项</small></div></div><div class="card-bd">' + timeline + '</div></div>' +
    '</div>'
  );
}
var scheduleMode = 0;
function setViewMode(m) {
  scheduleMode = m;
  var segBtns = document.querySelectorAll('#scheduleSeg button');
  segBtns.forEach(function (b, i) { b.classList.toggle('on', i === m); });
  var body = document.getElementById('scheduleBody');
  if (m === 0) {
    var timeline = DB.schedule.map(function (a) {
      var p = px(a.patientId);
      return '<div class="tl-item"><div class="tl-time">' + a.time + '</div>' +
        '<div class="tl-dot" style="background:' + a.color + '"></div>' +
        '<div class="tl-body"><div class="tb-t">' + esc(p.name) + ' · ' + a.type + '</div>' +
        '<div class="tb-m"><span>' + esc(a.note) + '</span></div></div></div>';
    }).join('');
    body.innerHTML = '<div class="card"><div class="card-hd"><div class="tt">今日日程<small>' + DB.schedule.length + ' 项</small></div></div><div class="card-bd">' + timeline + '</div></div>';
  } else {
    var todayIdx = (new Date().getDay() + 6) % 7;
    var headRow = '<div class="wk-grid"><div class="wk-head wk-corner"></div>' +
      DAY_LABELS.map(function (d, i) {
        return '<div class="wk-head' + (i === todayIdx ? ' today' : '') + '"><span class="wd">' + d + '</span><span class="dd">' + (new Date().getDate() - todayIdx + i) + '</span></div>';
      }).join('') + '</div>';
    var rows = '';
    for (var i = 0; i < 8; i++) {
      rows += '<div class="wk-grid"><div class="wk-time">' + ('0' + (8 + i)).slice(-2) + ':00</div>' +
        DAY_LABELS.map(function (d, j) {
          var isToday = j === todayIdx;
          var cell = '';
          if (isToday) { var a = DB.schedule[i]; if (a) { var p = px(a.patientId); cell = '<div class="wk-evt" style="background:' + a.color + '" onclick="goPatient(\'' + a.patientId + '\')">' + a.time + ' ' + esc(p.name) + '</div>'; } }
          return '<div class="wk' + (isToday ? ' today' : '') + '">' + cell + '</div>';
        }).join('') + '</div>';
    }
    body.innerHTML = '<div class="card"><div class="card-bd" style="overflow-x:auto">' + headRow + rows + '</div></div>' +
      '<div style="font-size:12px;color:var(--text-3);margin-top:10px">提示：原型演示——本周仅「今天」有排期数据。</div>';
  }
}

/* ---------- 视图：患者列表 ---------- */
var patientFilter = 'all';
function patientCard(p) {
  return '<div class="pat-card" onclick="goPatient(\'' + p.id + '\')">' + avatarHtml(p) +
    '<div class="pi"><div class="pn">' + esc(p.name) + ' ' + tag(p.tag, p.tagCls) + (p.pending ? ' ' + tag('待评估', 'pos') : '') + '</div>' +
    '<div class="pm"><span>' + esc(p.diagnosis) + '</span></div>' +
    '<div class="pm"><span>' + p.gender + ' · ' + p.age + '岁</span><span>末次 ' + esc(p.lastVisit) + '</span></div>' +
    '<div class="pc">' + (p.scales.length ? tag(p.scales.length + ' 项量表', 'accent') : '') + '</div></div>' +
    '<span class="chev">' + icon('chevron') + '</span></div>';
}
function patientFiltered() {
  return DB.patients.filter(function (p) {
    if (patientFilter === 'all') return true;
    if (patientFilter === 'pending') return p.pending;
    if (patientFilter === 'msk') return p.tagCls === 'msk';
    if (patientFilter === 'neuro') return p.tagCls === 'neuro';
    return true;
  });
}
function renderPatients() {
  var cats = [
    { k: 'all', t: '全部', n: DB.patients.length },
    { k: 'pending', t: '待评估', n: DB.patients.filter(function (p) { return p.pending; }).length },
    { k: 'msk', t: '肌骨', n: DB.patients.filter(function (p) { return p.tagCls === 'msk'; }).length },
    { k: 'neuro', t: '神经', n: DB.patients.filter(function (p) { return p.tagCls === 'neuro'; }).length }
  ];
  var chips = cats.map(function (c) {
    return '<span class="chip' + (patientFilter === c.k ? ' on' : '') + '" onclick="filterPatients(\'' + c.k + '\')">' + c.t + ' (' + c.n + ')</span>';
  }).join('');
  var list = patientFiltered().map(patientCard).join('');
  return (
    '<div class="card" style="margin-bottom:16px"><div class="card-bd" style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;justify-content:space-between">' +
      '<div class="chips">' + chips + '</div>' +
      '<button class="btn btn-primary btn-sm" onclick="openPatientModal()">' + icon('plus') + ' 新增患者</button>' +
    '</div></div>' +
    '<div class="grid" style="gap:12px">' + (list || emptyBlock('无匹配患者')) + '</div>'
  );
}
function filterPatients(f) {
  patientFilter = f;
  document.getElementById('view').innerHTML = renderPatients();
}

/* ---------- 视图：患者详情 ---------- */
function renderPatientDetail(id, tab) {
  var p = px(id);
  if (!p) return emptyBlock('未找到该患者');
  var tabs = [
    { k: 'assessment', t: '评估' },
    { k: 'scales', t: '量表' },
    { k: 'plan', t: '康复方案' },
    { k: 'record', t: '记录' }
  ];
  var tabBar = '<div class="tabs">' + tabs.map(function (tb) {
    return '<button class="tab-btn' + (tab === tb.k ? ' on' : '') + '" onclick="goPatient(\'' + id + '\',\'' + tb.k + '\')">' + tb.t + '</button>';
  }).join('') + '</div>';

  var body = '';
  if (tab === 'assessment') body = renderAssessment(p);
  else if (tab === 'scales') body = renderScales(p);
  else if (tab === 'plan') body = renderPlan(p);
  else if (tab === 'record') body = renderPatientRecords(p);

  return (
    '<div class="detail-hd" style="margin-bottom:16px">' +
      '<div class="av" style="background:rgba(255,255,255,.2)">' + initials(p.name) + '</div>' +
      '<div class="dh-main"><div class="dh-name">' + esc(p.name) + ' <span class="tag" style="background:rgba(255,255,255,.2);color:#fff">' + p.tag + '</span></div>' +
      '<div class="dh-meta"><span>' + p.gender + ' · ' + p.age + '岁</span><span>' + esc(p.diagnosis) + '</span></div>' +
      '<div class="dh-id">编号 ' + esc(p.id.toUpperCase()) + '</div></div>' +
      '<div class="dh-actions"><button class="btn" style="background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.3)" onclick="openAssessModal(\'' + id + '\')">' + icon('clipboard') + ' 快速评估</button></div>' +
    '</div>' +
    tabBar + body
  );
}

function renderAssessment(p) {
  var a = p.assessment;
  if (!a) return emptyBlock('该患者尚未完成评估，点击右上角「快速评估」开始');
  var cc = a.chiefComplaint, pal = a.palpation;
  var rom = a.rom.map(function (r) {
    return '<div class="kv"><span class="k">' + esc(r.joint) + '</span><span class="v">主动：' + esc(r.active) + '<br>被动：' + esc(r.passive) + '</span></div>';
  }).join('');
  var muscle = a.muscle.map(function (m) {
    return '<div class="kv"><span class="k">' + esc(m.group) + '</span><span class="v">肌力 ' + m.grade + ' 级 ' + esc(m.note || '') + '</span></div>';
  }).join('');
  var adl = Object.keys(a.adl).map(function (k) {
    var v = a.adl[k];
    return '<div class="kv"><span class="k">' + k + '</span><span class="v"><div class="pbar" style="max-width:180px"><div class="fill" style="width:' + (v * 20) + '%;background:var(--accent)"></div></div> <span style="font-size:12px;color:var(--text-3)">' + v + '/5</span></span></div>';
  }).join('');

  var exams = p.exams.map(function (e) {
    var r = EXAM_RESULT[e.result] || { t: e.result, c: 'neutral' };
    return '<span class="tag ' + r.c + '">' + esc(e.name) + ' · ' + r.t + '</span>';
  }).join('') || '<span class="tag neutral">暂无特殊检查</span>';

  return (
    '<div class="grid g2">' +
      card('<div class="tt">主诉与病史</div>', '<div class="kv"><span class="k">主诉</span><span class="v">' + esc(cc.symptoms) + '</span></div>' +
        '<div class="kv"><span class="k">发病</span><span class="v">' + esc(cc.onset) + '</span></div>' +
        '<div class="kv"><span class="k">诱因</span><span class="v">' + esc(cc.triggers) + '</span></div>' +
        '<div class="kv"><span class="k">病史</span><span class="v">' + esc(cc.history) + '</span></div>') +
      card('<div class="tt">触诊与压痛</div>', '<div class="kv"><span class="k">部位</span><span class="v">' + pal.sites.map(esc).join('、') + '</span></div>' +
        '<div class="kv"><span class="k">VAS</span><span class="v">' + pal.painLevel + '/10</span></div>' +
        '<div class="kv"><span class="k">发现</span><span class="v">' + esc(pal.findings) + '</span></div>') +
      card('<div class="tt">关节活动度 (ROM)</div>', rom) +
      card('<div class="tt">肌力评估 (MMT)</div>', muscle) +
      '<div class="card" style="grid-column:1/-1"><div class="card-hd"><div class="tt">日常生活能力 (ADL)</div></div><div class="card-bd">' + adl + '</div></div>' +
      '<div class="card" style="grid-column:1/-1"><div class="card-hd"><div class="tt">特殊检查</div></div><div class="card-bd"><div class="dot-row">' + exams + '</div></div></div>' +
    '</div>'
  );
}
function card(titleHtml, body) {
  return '<div class="card"><div class="card-hd">' + titleHtml + '</div><div class="card-bd">' + body + '</div></div>';
}

function renderScales(p) {
  var items = p.scales.map(function (s) {
    var icMap = { VAS: 'm1', NRS: 'm1', ODI: 'm1', NDI: 'm2', Barthel: 'm2', BBS: 'm2', MMSE: 'm3', Constant: 'm4', Lysholm: 'm4', JOAC: 'm2', DASH: 'm4', Walk6Min: 'm5' };
    var c = icMap[s.key] || 'm1';
    return '<div class="scale-item" onclick="toast(\'演示：' + esc(s.name) + ' 详情\')">' +
      '<span class="s-ic" style="background:var(--' + c + ')22;color:var(--' + c + ')">' + icon('activity') + '</span>' +
      '<div class="si-main"><div class="si-name">' + esc(s.name) + '</div><div class="si-sub">' + esc(s.conclusion) + ' · ' + s.date + '</div></div>' +
      '<div class="si-score">' + esc(s.score) + '</div></div>';
  }).join('');
  return '<div class="grid" style="gap:10px">' + items + '</div>' +
    '<div style="margin-top:14px"><button class="btn btn-primary" onclick="openAssessModal(\'' + p.id + '\')">' + icon('plus') + ' 新增量表记录</button></div>';
}

function renderPlan(p) {
  var stages = [
    { k: 'acute', cls: 'acute', t: '急性期（0-2周）' },
    { k: 'subacute', cls: 'subacute', t: '亚急性期（2-6周）' },
    { k: 'chronic', cls: 'chronic', t: '慢性期（6周+）' }
  ];
  var html = stages.map(function (st) {
    var d = p.plan[st.k];
    if (!d) return '';
    return '<div class="stage ' + st.cls + '"><div class="st-title"><span class="dot"></span>' + st.t + '</div>' +
      '<div class="st-goal">' + esc(d.goal) + '</div><ul>' + d.items.map(function (it) { return '<li>' + esc(it) + '</li>'; }).join('') + '</ul></div>';
  }).join('');
  return card('<div class="tt">康复方案（分三期）</div>', html);
}

/* ---------- 记录中心（主要体现「记录」主线） ---------- */
var recordFilter = 'all';
function recordRow(r) {
  var p = px(r.patientId);
  var t = RECORD_TYPES[r.type] || RECORD_TYPES.assessment;
  return '<div class="rec-item" onclick="goPatient(\'' + r.patientId + '\',\'record\')">' +
    '<span class="ric" style="background:' + t.color + '22;color:' + t.color + '">' + icon(t.icon) + '</span>' +
    '<div class="ri-main"><div class="ri-title">' + esc(r.title) + ' <span class="tag neutral">' + t.label + '</span></div>' +
    '<div class="ri-sum">' + esc(r.summary) + '</div>' +
    '<div class="ri-meta"><span>' + (p ? esc(p.name) : '') + '</span><span>' + r.time + '</span></div></div>' +
    '<span class="chev">' + icon('chevron') + '</span></div>';
}
function renderRecords() {
  var cats = [{ k: 'all', t: '全部', n: DB.records.length }].concat(
    Object.keys(RECORD_TYPES).map(function (k) {
      return { k: k, t: RECORD_TYPES[k].label, n: DB.records.filter(function (r) { return r.type === k; }).length };
    })
  );
  var chips = cats.map(function (c) {
    return '<span class="chip' + (recordFilter === c.k ? ' on' : '') + '" onclick="filterRecords(\'' + c.k + '\')">' + c.t + ' (' + c.n + ')</span>';
  }).join('');

  var list = DB.records.filter(function (r) { return recordFilter === 'all' || r.type === recordFilter; });
  var order = [], groups = {};
  list.forEach(function (r) {
    if (!groups[r.date]) { groups[r.date] = []; order.push(r.date); }
    groups[r.date].push(r);
  });
  var body = order.map(function (d) {
    return '<div class="dt-head"><span class="dt-date">' + esc(d) + '</span><span class="dt-count">' + groups[d].length + ' 条</span></div>' +
      groups[d].map(recordRow).join('');
  }).join('');

  return (
    '<div class="card" style="margin-bottom:16px"><div class="card-bd" style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;justify-content:space-between">' +
      '<div class="chips">' + chips + '</div>' +
      '<button class="btn btn-primary btn-sm" onclick="openAddRecord()">' + icon('plus') + ' 新增记录</button>' +
    '</div></div>' +
    (body || emptyBlock('暂无记录'))
  );
}
function filterRecords(f) {
  recordFilter = f;
  document.getElementById('view').innerHTML = renderRecords();
}
function renderPatientRecords(p) {
  var list = DB.records.filter(function (r) { return r.patientId === p.id; });
  if (!list.length) return emptyBlock('该患者暂无记录');
  return '<div style="display:flex;flex-direction:column;gap:8px">' + list.map(recordRow).join('') + '</div>';
}
function openAddRecord() {
  var items = Object.keys(RECORD_TYPES).map(function (k) {
    var t = RECORD_TYPES[k];
    return '<div class="scale-item" style="flex-direction:column;align-items:flex-start;gap:4px" onclick="closeModal();toast(\'演示：新建 ' + t.label + ' 记录\')">' +
      '<span class="s-ic" style="background:' + t.color + '22;color:' + t.color + '">' + icon(t.icon) + '</span>' +
      '<span class="si-name">' + t.label + '</span><span class="si-sub">新增一条' + t.label + '记录</span></div>';
  }).join('');
  openModal(
    '<div class="modal-hd"><span>新增记录</span><span class="x" onclick="closeModal()">×</span></div>' +
    '<div class="modal-bd"><div class="g2" style="display:grid">' + items + '</div></div>'
  );
}

/* ---------- 视图：待办与打卡 ---------- */
function renderTodo() {
  var todoList = DB.todos.map(todoRow).join('');
  var checkList = DB.checkins.map(function (c) {
    return '<div class="checkin' + (c.done ? ' done' : '') + '" onclick="toggleCheckin(\'' + c.id + '\')">' +
      '<span class="ci-em">' + c.emoji + '</span>' +
      '<div class="ci-main"><div class="ci-name">' + esc(c.name) + '</div><div class="ci-streak">连续 ' + c.streak + ' 天</div></div>' +
      '<div class="ci-done">' + icon('check') + '</div></div>';
  }).join('');
  return (
    '<div class="grid g13">' +
      '<div class="card"><div class="card-hd"><div class="tt">今日待办<small>' + openTodoCount() + ' 项未完成</small></div><div class="lnk" onclick="openTodoModal()">+ 添加</div></div>' +
        '<div class="card-bd" id="todoList">' + todoList + '</div></div>' +
      '<div class="card"><div class="card-hd"><div class="tt">我的习惯打卡</div></div>' +
        '<div class="card-bd" style="display:flex;flex-direction:column;gap:10px" id="checkinList">' + checkList + '</div></div>' +
    '</div>'
  );
}
function todoRow(t) {
  var lv = LEVEL[t.level] || LEVEL.low;
  return '<div class="todo-item' + (t.done ? ' done' : '') + '" onclick="toggleTodo(\'' + t.id + '\')">' +
    '<span class="ck">' + icon('check') + '</span><span class="pri ' + lv.c + '"></span>' +
    '<div class="ti"><div class="tt">' + esc(t.text) + '</div><div class="ts">' + lv.t + '优先级 · ' + esc(t.due) + '</div></div></div>';
}
function toggleTodo(id) {
  var t = DB.todos.find(function (x) { return x.id === id; });
  if (t) {
    t.done = !t.done;
    var el = document.getElementById('todoList');
    if (el) el.innerHTML = DB.todos.map(todoRow).join('');
    else route();
    document.querySelectorAll('.todo-badge').forEach(function (b) { b.textContent = openTodoCount(); });
    toast(t.done ? '已完成 ✓' : '已取消完成');
  }
}
function toggleCheckin(id) {
  var c = DB.checkins.find(function (x) { return x.id === id; });
  if (c) {
    c.done = !c.done;
    var el = document.getElementById('checkinList');
    if (el) {
      el.innerHTML = DB.checkins.map(function (x) {
        return '<div class="checkin' + (x.done ? ' done' : '') + '" onclick="toggleCheckin(\'' + x.id + '\')">' +
          '<span class="ci-em">' + x.emoji + '</span>' +
          '<div class="ci-main"><div class="ci-name">' + esc(x.name) + '</div><div class="ci-streak">连续 ' + x.streak + ' 天</div></div>' +
          '<div class="ci-done">' + icon('check') + '</div></div>';
      }).join('');
    }
    toast(c.done ? '打卡成功 🔥' : '已取消打卡');
  }
}

/* ---------- 视图：评估量表库 ---------- */
var scaleCat = '全部';
function renderAssess() {
  var cats = ['全部', '疼痛评估', '颈肩评估', '功能与生活能力', '平衡与步行', '心理状态', '上肢评估', '下肢评估', '心肺评估'];
  var filtered = DB.scaleLibrary.filter(function (s) {
    return scaleCat === '全部' || s.category === scaleCat;
  });
  var items = filtered.map(function (s) {
    var c = 'var(--' + s.ic + ')';
    return '<div class="scale-item" onclick="toast(\'演示：' + esc(s.name) + ' 评估表单\')">' +
      '<span class="s-ic" style="background:' + c + '22;color:' + c + '">' + icon('activity') + '</span>' +
      '<div class="si-main"><div class="si-name">' + esc(s.name) + '</div><div class="si-sub">' + esc(s.category) + '</div></div>' +
      '<span class="chev">' + icon('chevron') + '</span></div>';
  }).join('');
  return (
    '<div class="card" style="margin-bottom:16px"><div class="card-bd"><div class="chips">' +
      cats.map(function (c) { return '<span class="chip' + (scaleCat === c ? ' on' : '') + '" onclick="setScaleCat(\'' + esc(c) + '\')">' + c + '</span>'; }).join('') +
      '</div></div></div>' +
    '<div class="grid g2" style="gap:10px">' + items + '</div>'
  );
}
function setScaleCat(c) {
  scaleCat = c;
  document.getElementById('view').innerHTML = renderAssess();
}

/* ---------- 视图：设置 ---------- */
function renderSettings() {
  var th = DB.therapist;
  return (
    '<div class="grid g2">' +
      card('<div class="tt">治疗师信息</div>',
        '<div style="display:flex;align-items:center;gap:14px;margin-bottom:14px"><div class="av" style="width:56px;height:56px;font-size:22px;background:var(--accent-muted);color:var(--accent-strong)">' + esc(th.avatar) + '</div>' +
        '<div><div style="font-weight:700">' + esc(th.name) + '</div><div style="font-size:12px;color:var(--text-2)">' + esc(th.department) + ' · ' + esc(th.role) + '</div></div></div>' +
        '<div class="field"><label>姓名</label><input value="' + esc(th.name) + '"></div>' +
        '<div class="row2"><div class="field"><label>科室</label><input value="' + esc(th.department) + '"></div>' +
        '<div class="field"><label>职称</label><input value="' + esc(th.role) + '"></div></div>' +
        '<button class="btn btn-primary" onclick="toast(\'演示：已保存\')">保存</button>') +
      card('<div class="tt">偏好与安全</div>',
        '<div class="kv"><span class="k">数据存储</span><span class="v">本地浏览器 (localStorage 演示)</span></div>' +
        '<div class="kv"><span class="k">角色权限</span><span class="v">主管治疗师（可编辑全部）</span></div>' +
        '<div class="kv"><span class="k">PIN 保护</span><span class="v">未设置</span></div>' +
        '<div class="kv"><span class="k">收费项目库</span><span class="v">东营市康复医疗收费项目（内置）</span></div>' +
        '<button class="btn btn-ghost" style="margin-top:10px" onclick="toast(\'演示：设置 PIN\')">设置 PIN 码</button>') +
    '</div>'
  );
}

/* ---------- Modal ---------- */
function openModal(html) {
  closeModal();
  var m = document.createElement('div');
  m.className = 'mask';
  m.id = 'modalRoot';
  m.innerHTML = '<div class="modal">' + html + '</div>';
  document.body.appendChild(m);
  m.addEventListener('click', function (e) { if (e.target === m) closeModal(); });
}
function closeModal() {
  var m = document.getElementById('modalRoot');
  if (m) m.remove();
}
function openApptModal() {
  openModal(
    '<div class="modal-hd"><span>新建预约</span><span class="x" onclick="closeModal()">×</span></div>' +
    '<div class="modal-bd">' +
      '<div class="field"><label>患者</label><select>' + DB.patients.map(function (p) { return '<option value="' + p.id + '">' + esc(p.name) + ' · ' + esc(p.diagnosis) + '</option>'; }).join('') + '</select></div>' +
      '<div class="row2"><div class="field"><label>日期</label><input type="date" value="2026-08-20"></div>' +
      '<div class="field"><label>时间</label><input type="time" value="09:00"></div></div>' +
      '<div class="row2"><div class="field"><label>类型</label><select><option>评估</option><option>治疗</option><option>量表</option></select></div>' +
      '<div class="field"><label>备注</label><input placeholder="如：腰椎牵引 + 中频"></div></div>' +
    '</div>' +
    '<div class="modal-ft"><button class="btn btn-ghost" onclick="closeModal()">取消</button><button class="btn btn-primary" onclick="saveAppt()">保存预约</button></div>'
  );
}
function saveAppt() { closeModal(); toast('预约已保存（演示）'); }
function openPatientModal() {
  openModal(
    '<div class="modal-hd"><span>新增患者</span><span class="x" onclick="closeModal()">×</span></div>' +
    '<div class="modal-bd">' +
      '<div class="row2"><div class="field"><label>姓名</label><input placeholder="患者姓名"></div>' +
      '<div class="field"><label>性别</label><select><option>男</option><option>女</option></select></div></div>' +
      '<div class="row2"><div class="field"><label>年龄</label><input type="number" placeholder="年龄"></div>' +
      '<div class="field"><label>联系电话</label><input placeholder="手机号"></div></div>' +
      '<div class="field"><label>诊断</label><input placeholder="如：腰椎间盘突出症"></div>' +
      '<div class="field"><label>备注</label><textarea placeholder="病史、注意项…"></textarea></div>' +
    '</div>' +
    '<div class="modal-ft"><button class="btn btn-ghost" onclick="closeModal()">取消</button><button class="btn btn-primary" onclick="savePatient()">保存</button></div>'
  );
}
function savePatient() { closeModal(); toast('患者已新增（演示）'); }
function openTodoModal() {
  openModal(
    '<div class="modal-hd"><span>添加待办</span><span class="x" onclick="closeModal()">×</span></div>' +
    '<div class="modal-bd"><div class="field"><label>待办内容</label><input id="todoText" placeholder="如：跟进 张先生 的复评"></div>' +
    '<div class="field"><label>优先级</label><div class="seg fluid"><button class="on">高</button><button>中</button><button>低</button></div></div></div>' +
    '<div class="modal-ft"><button class="btn btn-ghost" onclick="closeModal()">取消</button><button class="btn btn-primary" onclick="addTodo()">添加</button></div>'
  );
}
function addTodo() {
  var t = document.getElementById('todoText');
  var v = t && t.value.trim();
  if (v) {
    DB.todos.unshift({ id: 't' + Date.now(), text: v, level: 'mid', done: false, due: '今天' });
    document.querySelectorAll('.todo-badge').forEach(function (b) { b.textContent = openTodoCount(); });
  }
  closeModal();
  toast('待办已添加（演示）');
  route();
}
function openAssessModal(id) {
  var p = px(id);
  openModal(
    '<div class="modal-hd"><span>快速评估 · ' + (p ? esc(p.name) : '') + '</span><span class="x" onclick="closeModal()">×</span></div>' +
    '<div class="modal-bd">' +
      '<div class="field"><label>VAS 疼痛评分</label><input type="range" min="0" max="10" value="5"><div class="hint" style="display:flex;justify-content:space-between"><span>0 无痛</span><span>10 剧痛</span></div></div>' +
      '<div class="field"><label>快速量表</label><select>' + DB.scaleLibrary.map(function (s) { return '<option>' + esc(s.name) + '</option>'; }).join('') + '</select></div>' +
      '<div class="field"><label>备注</label><textarea placeholder="评估发现…"></textarea></div>' +
    '</div>' +
    '<div class="modal-ft"><button class="btn btn-ghost" onclick="closeModal()">取消</button><button class="btn btn-primary" onclick="saveAssess()">保存评估</button></div>'
  );
}
function saveAssess() { closeModal(); toast('评估已保存（演示）'); }

/* ---------- 启动 ---------- */
renderShell();
if (!location.hash) location.hash = '#/dashboard';
route();