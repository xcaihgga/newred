/* ============================================================
 * schema.js - 数据模型定义 + 校验
 * 所有数据结构的"单一事实来源"
 * ============================================================ */
(function() {
  if (window.__REHAB_SCHEMA_LOADED__) return;
  window.__REHAB_SCHEMA_LOADED__ = true;


const DB_VERSION = 1;
const SCHEMA_STORAGE_KEY = 'rehab_workbench_data';

/* ---------- 校验规则 ---------- */
const VALIDATORS = {
  patient: function (p) {
    const errors = [];
    if (!p.id || typeof p.id !== 'string') errors.push('patient.id 必填且为字符串');
    if (!p.name || typeof p.name !== 'string') errors.push('patient.name 必填且为字符串');
    if (!['男', '女'].includes(p.gender)) errors.push('patient.gender 必须为"男"或"女"');
    if (typeof p.age !== 'number' || p.age < 0 || p.age > 150) errors.push('patient.age 必须为 0-150 的数字');
    return errors;
  },
  record: function (r) {
    const errors = [];
    if (!r.id || typeof r.id !== 'string') errors.push('record.id 必填');
    if (!r.patientId) errors.push('record.patientId 必填');
    if (!['assessment', 'exam', 'scale', 'plan', 'treatment', 'photo'].includes(r.type)) {
      errors.push('record.type 必须为合法类型');
    }
    if (!r.title || typeof r.title !== 'string') errors.push('record.title 必填');
    return errors;
  },
  todo: function (t) {
    const errors = [];
    if (!t.id) errors.push('todo.id 必填');
    if (!t.text || typeof t.text !== 'string') errors.push('todo.text 必填');
    if (!['high', 'mid', 'low'].includes(t.level)) errors.push('todo.level 必须为 high/mid/low');
    if (typeof t.done !== 'boolean') errors.push('todo.done 必须为布尔值');
    return errors;
  },
  appointment: function (a) {
    const errors = [];
    if (!a.id) errors.push('appointment.id 必填');
    if (!a.patientId) errors.push('appointment.patientId 必填');
    if (!a.time || !a.date) errors.push('appointment.time 和 date 必填');
    return errors;
  }
};

/* ---------- 数据完整性检查 ---------- */
function validateRecord(record, type) {
  const validator = VALIDATORS[type];
  if (!validator) return [];
  return validator(record);
}

function validateData(data) {
  const errors = [];
  if (!data || typeof data !== 'object') {
    return ['数据必须为对象'];
  }
  const checks = [
    ['patients', 'array'],
    ['records', 'array'],
    ['todos', 'array'],
    ['appointments', 'array'],
    ['checkins', 'array'],
    ['therapist', 'object'],
    ['stats', 'object']
  ];
  checks.forEach(function ([key, expectedType]) {
    if (data[key] == null) {
      errors.push('data.' + key + ' 缺失');
    } else if (expectedType === 'array' && !Array.isArray(data[key])) {
      errors.push('data.' + key + ' 必须为数组');
    } else if (expectedType === 'object' && typeof data[key] !== 'object') {
      errors.push('data.' + key + ' 必须为对象');
    }
  });
  if (data.patients && Array.isArray(data.patients)) {
    data.patients.forEach(function (p) {
      validateRecord(p, 'patient').forEach(function (e) {
        errors.push('patient ' + p.id + ': ' + e);
      });
    });
  }
  if (data.records && Array.isArray(data.records)) {
    data.records.forEach(function (r) {
      validateRecord(r, 'record').forEach(function (e) {
        errors.push('record ' + r.id + ': ' + e);
      });
    });
  }
  return errors;
}

/* ---------- 修复缺失字段 ---------- */
function repairData(data) {
  if (!data) return null;
  if (!data.therapist) {
    data.therapist = { name: '张医生', department: '康复医学科', role: '主管治疗师', avatar: '张' };
  }
  if (!data.stats) {
    data.stats = { todayAppt: 0, todayDone: 0, todayRecords: 0, totalPatients: 0, pending: 0, todos: 0 };
  }
  ['patients', 'records', 'todos', 'appointments', 'checkins'].forEach(function (key) {
    if (!Array.isArray(data[key])) data[key] = [];
  });
  return data;
}

/* ---------- 版本迁移 ---------- */
function migrateData(data, fromVersion, toVersion) {
  let result = JSON.parse(JSON.stringify(data));
  for (let v = fromVersion; v < toVersion; v++) {
    result = applyMigration(result, v);
  }
  return result;
}

function applyMigration(data, version) {
  const migrations = {
    0: function (d) {
      return d;
    },
    1: function (d) {
      const patients = (d.patients || []).map(function (p) {
        if (!p.createdAt) p.createdAt = Date.now();
        if (!p.updatedAt) p.updatedAt = Date.now();
        return p;
      });
      const records = (d.records || []).map(function (r) {
        if (!r.createdAt) r.createdAt = Date.now();
        return r;
      });
      return Object.assign({}, d, { patients: patients, records: records });
    }
  };
  return (migrations[version] || function (d) { return d; })(data);
}

window.Schema = {
  DB_VERSION: DB_VERSION,
  STORAGE_KEY: SCHEMA_STORAGE_KEY,
  VALIDATORS: VALIDATORS,
  validateRecord: validateRecord,
  validateData: validateData,
  repairData: repairData,
  migrateData: migrateData
};
})();
