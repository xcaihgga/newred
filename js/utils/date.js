/* ============================================================
 * utils/date.js - 日期工具函数
 * ============================================================ */
if (window.__REHAB_DATE_LOADED__) return;
window.__REHAB_DATE_LOADED__ = true;

function pad(n) { return n < 10 ? '0' + n : '' + n; }

function formatDate(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}

function formatDateTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return formatDate(ts) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
}

function formatTime(hours, minutes) {
  return pad(hours) + ':' + pad(minutes);
}

function today() {
  const d = new Date();
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}

function relativeTime(ts) {
  if (!ts) return '';
  const diff = Date.now() - ts;
  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前';
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前';
  if (diff < 604800000) return Math.floor(diff / 86400000) + '天前';
  return formatDate(ts);
}

function todayStr() {
  return today();
}

window.DateUtil = {
  pad: pad,
  formatDate: formatDate,
  formatDateTime: formatDateTime,
  formatTime: formatTime,
  today: today,
  relativeTime: relativeTime,
  todayStr: todayStr
};
