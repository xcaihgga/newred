/* ============================================================
 * components/modal.js - Modal 对话框组件
 * ============================================================ */
(function() {
  if (window.__REHAB_MODAL_LOADED__) return;
  window.__REHAB_MODAL_LOADED__ = true;


function esc(s) {
  return (window.Esc && typeof window.Esc.esc === 'function') ? window.Esc.esc(s) : String(s);
}

function open(options) {
  options = options || {};
  const id = options.id || ('modal-' + Date.now());
  const onConfirm = options.onConfirm || function () {};
  const onCancel = options.onCancel || function () {};
  const confirmText = esc(options.confirmText || '确定');
  const cancelText = esc(options.cancelText || '取消');
  const title = options.title ? esc(options.title) : '';

  const mask = document.createElement('div');
  mask.className = 'modal-mask';
  mask.setAttribute('data-modal-id', id);

  const dialog = document.createElement('div');
  dialog.className = 'modal-dialog';

  dialog.innerHTML =
    '<div class="modal-content">' +
      '<div class="modal-body">' +
        (title ? '<div class="modal-title">' + title + '</div>' : '') +
        (options.content || '') +
      '</div>' +
      '<div class="modal-footer">' +
        (cancelText ? '<button class="btn modal-cancel">' + cancelText + '</button>' : '') +
        '<button class="btn btn-primary modal-confirm">' + confirmText + '</button>' +
      '</div>' +
    '</div>';

  mask.appendChild(dialog);
  document.body.appendChild(mask);
  document.body.style.overflow = 'hidden';

  function close() {
    mask.style.opacity = '0';
    setTimeout(function () {
      mask.remove();
      document.body.style.overflow = '';
    }, 150);
  }

  mask.addEventListener('click', function (e) {
    if (e.target === mask) close();
  });

  const confirmBtn = dialog.querySelector('.modal-confirm');
  const cancelBtn = dialog.querySelector('.modal-cancel');

  confirmBtn.addEventListener('click', function () {
    const result = onConfirm(dialog);
    if (result !== false) close();
  });
  if (cancelBtn) {
    cancelBtn.addEventListener('click', function () {
      onCancel(dialog);
      close();
    });
  }

  return { id: id, close: close };
}

function alertMsg(title, content, onOk) {
  return open({
    title: title,
    content: content,
    confirmText: '知道了',
    cancelText: '',
    onConfirm: onOk
  });
}

function confirmMsg(title, content, onConfirm, onCancel) {
  return open({
    title: title,
    content: content,
    confirmText: '确认',
    cancelText: '取消',
    onConfirm: onConfirm,
    onCancel: onCancel
  });
}

function promptMsg(title, placeholder, defaultValue, onSubmit) {
  const inputHtml = '<input class="modal-input" type="text" placeholder="' + esc(placeholder || '') + '" value="' + esc(defaultValue || '') + '">';
  return open({
    title: title,
    content: inputHtml,
    confirmText: '提交',
    onConfirm: function (dialog) {
      const input = dialog.querySelector('.modal-input');
      if (!input.value.trim()) {
        input.style.borderColor = '#d9534f';
        input.focus();
        return false;
      }
      onSubmit(input.value);
    }
  });
}

window.Modal = { open: open, alert: alertMsg, confirm: confirmMsg, prompt: promptMsg };
})();
