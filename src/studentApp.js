/**
 * studentApp.js
 * UI controller for the student management page.
 * Depends on studentStore for persistence and index.html for DOM structure.
 */

import { studentStore } from './studentStore.js';

// ─── DOM refs ───────────────────────────────────────────────────────────────
const btnAdd          = document.getElementById('btn-add');
const searchInput     = document.getElementById('search-input');
const studentTbody    = document.getElementById('student-tbody');
const emptyMsg        = document.getElementById('empty-msg');

// Modal (add / edit)
const modalOverlay    = document.getElementById('modal-overlay');
const modalTitle      = document.getElementById('modal-title');
const studentForm     = document.getElementById('student-form');
const fieldId         = document.getElementById('field-id');
const fieldName       = document.getElementById('field-name');
const fieldClass      = document.getElementById('field-class');
const fieldDob        = document.getElementById('field-dob');
const fieldGender     = document.getElementById('field-gender');
const fieldEmail      = document.getElementById('field-email');
const btnCloseModal   = document.getElementById('btn-close-modal');
const btnCancel       = document.getElementById('btn-cancel');

// Error spans
const errName  = document.getElementById('err-name');
const errClass = document.getElementById('err-class');
const errDob   = document.getElementById('err-dob');
const errEmail = document.getElementById('err-email');

// Confirm delete dialog
const confirmOverlay  = document.getElementById('confirm-overlay');
const confirmMsg      = document.getElementById('confirm-msg');
const btnConfirmOk    = document.getElementById('btn-confirm-ok');
const btnConfirmCancel = document.getElementById('btn-confirm-cancel');

// ─── State ───────────────────────────────────────────────────────────────────
let pendingDeleteId = null;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Formats an ISO date string (YYYY-MM-DD) to Vietnamese locale DD/MM/YYYY.
 * @param {string} iso
 * @returns {string}
 */
function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

/**
 * Escapes HTML special characters to prevent XSS.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/** Clears all inline field error messages. */
function clearErrors() {
  errName.textContent  = '';
  errClass.textContent = '';
  errDob.textContent   = '';
  errEmail.textContent = '';
}

/**
 * Displays validation errors returned by validateStudent.
 * @param {Record<string, string>} errors
 */
function showErrors(errors) {
  if (errors.name)        errName.textContent  = errors.name;
  if (errors.className)   errClass.textContent = errors.className;
  if (errors.dateOfBirth) errDob.textContent   = errors.dateOfBirth;
  if (errors.email)       errEmail.textContent = errors.email;
}

// ─── Render ───────────────────────────────────────────────────────────────────

/**
 * Renders the student list table.
 * Filters by the current search query.
 */
function renderStudents() {
  const query = searchInput.value.trim().toLowerCase();
  const all   = studentStore.getAll();

  const filtered = query
    ? all.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.className.toLowerCase().includes(query)
      )
    : all;

  studentTbody.innerHTML = '';

  if (filtered.length === 0) {
    emptyMsg.hidden = false;
    return;
  }

  emptyMsg.hidden = true;

  filtered.forEach((student, index) => {
    const tr = document.createElement('tr');
    tr.dataset.id = student.id;
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${escapeHtml(student.name)}</td>
      <td>${escapeHtml(student.className)}</td>
      <td>${escapeHtml(formatDate(student.dateOfBirth))}</td>
      <td>${escapeHtml(student.gender)}</td>
      <td>${escapeHtml(student.email)}</td>
      <td class="actions">
        <button
          class="btn btn-sm btn-secondary btn-edit"
          data-id="${escapeHtml(student.id)}"
          aria-label="Sửa ${escapeHtml(student.name)}"
        >Sửa</button>
        <button
          class="btn btn-sm btn-danger btn-delete"
          data-id="${escapeHtml(student.id)}"
          aria-label="Xoá ${escapeHtml(student.name)}"
        >Xoá</button>
      </td>
    `;
    studentTbody.appendChild(tr);
  });
}

// ─── Modal helpers ────────────────────────────────────────────────────────────

function openAddModal() {
  clearErrors();
  fieldId.value      = '';
  studentForm.reset();
  modalTitle.textContent = 'Thêm học sinh';
  document.getElementById('btn-submit').textContent = 'Lưu';
  modalOverlay.hidden = false;
  fieldName.focus();
}

/**
 * @param {string} id
 */
function openEditModal(id) {
  const student = studentStore.getById(id);
  if (!student) return;

  clearErrors();
  fieldId.value          = student.id;
  fieldName.value        = student.name;
  fieldClass.value       = student.className;
  fieldDob.value         = student.dateOfBirth;
  fieldGender.value      = student.gender;
  fieldEmail.value       = student.email;
  modalTitle.textContent = 'Sửa thông tin học sinh';
  document.getElementById('btn-submit').textContent = 'Cập nhật';
  modalOverlay.hidden = false;
  fieldName.focus();
}

function closeModal() {
  modalOverlay.hidden = true;
  clearErrors();
  studentForm.reset();
  fieldId.value = '';
}

// ─── Delete confirm helpers ───────────────────────────────────────────────────

/**
 * @param {string} id
 */
function openConfirm(id) {
  const student = studentStore.getById(id);
  if (!student) return;
  pendingDeleteId       = id;
  confirmMsg.textContent = `Bạn có chắc muốn xoá học sinh "${student.name}" không?`;
  confirmOverlay.hidden  = false;
  btnConfirmOk.focus();
}

function closeConfirm() {
  pendingDeleteId       = null;
  confirmOverlay.hidden = true;
}

// ─── Event handlers ───────────────────────────────────────────────────────────

btnAdd.addEventListener('click', openAddModal);
btnCloseModal.addEventListener('click', closeModal);
btnCancel.addEventListener('click', closeModal);

// Close modals on overlay click
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});
confirmOverlay.addEventListener('click', (e) => {
  if (e.target === confirmOverlay) closeConfirm();
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (!modalOverlay.hidden)   closeModal();
    if (!confirmOverlay.hidden) closeConfirm();
  }
});

// Form submit (add or update)
studentForm.addEventListener('submit', (e) => {
  e.preventDefault();
  clearErrors();

  const data = {
    name:        fieldName.value,
    className:   fieldClass.value,
    dateOfBirth: fieldDob.value,
    gender:      fieldGender.value,
    email:       fieldEmail.value,
  };

  try {
    const id = fieldId.value;
    if (id) {
      studentStore.update(id, data);
    } else {
      studentStore.add(data);
    }
    closeModal();
    renderStudents();
  } catch (err) {
    if (err.errors) {
      showErrors(err.errors);
    }
  }
});

// Delegated clicks on table rows (edit / delete buttons)
studentTbody.addEventListener('click', (e) => {
  const editBtn   = e.target.closest('.btn-edit');
  const deleteBtn = e.target.closest('.btn-delete');

  if (editBtn) {
    openEditModal(editBtn.dataset.id);
    return;
  }
  if (deleteBtn) {
    openConfirm(deleteBtn.dataset.id);
  }
});

// Confirm delete
btnConfirmOk.addEventListener('click', () => {
  if (!pendingDeleteId) return;
  studentStore.remove(pendingDeleteId);
  closeConfirm();
  renderStudents();
});

btnConfirmCancel.addEventListener('click', closeConfirm);

// Live search
searchInput.addEventListener('input', renderStudents);

// ─── Bootstrap ────────────────────────────────────────────────────────────────
renderStudents();
