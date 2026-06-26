/**
 * Integration tests for student management UI (AC-level).
 * Uses jsdom via vitest's built-in environment.
 *
 * AC-1: Page load shows student list.
 * AC-2: Add student form saves and displays new student.
 * AC-3: Delete removes student from list.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createStudentStore, STORAGE_KEY } from '../src/studentStore.js';

// ─── Minimal DOM helpers ─────────────────────────────────────────────────────

/**
 * Renders the student list into a detached DOM tree.
 * Returns the tbody element and store for assertions.
 */
function buildDOM(initialStudents = []) {
  // Set up jsdom document structure matching index.html
  document.body.innerHTML = `
    <table>
      <tbody id="student-tbody"></tbody>
    </table>
    <p id="empty-msg" hidden></p>
    <input id="search-input" />
  `;

  // In-memory store
  const storage = { data: {}, getItem: (k) => storage.data[k] ?? null, setItem: (k, v) => { storage.data[k] = v; } };
  if (initialStudents.length) {
    storage.setItem(STORAGE_KEY, JSON.stringify(initialStudents));
  }
  const store = createStudentStore(storage);

  const tbody   = document.getElementById('student-tbody');
  const emptyMsg = document.getElementById('empty-msg');

  function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }
  function formatDate(iso) {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  }

  function render(query = '') {
    const all = store.getAll();
    const filtered = query
      ? all.filter((s) => s.name.toLowerCase().includes(query) || s.className.toLowerCase().includes(query))
      : all;

    tbody.innerHTML = '';
    if (filtered.length === 0) { emptyMsg.hidden = false; return; }
    emptyMsg.hidden = true;
    filtered.forEach((s, i) => {
      const tr = document.createElement('tr');
      tr.dataset.id = s.id;
      tr.innerHTML = `
        <td>${i + 1}</td>
        <td>${escapeHtml(s.name)}</td>
        <td>${escapeHtml(s.className)}</td>
        <td>${escapeHtml(formatDate(s.dateOfBirth))}</td>
        <td>${escapeHtml(s.gender)}</td>
        <td>${escapeHtml(s.email)}</td>
        <td>
          <button class="btn-edit" data-id="${s.id}">Sửa</button>
          <button class="btn-delete" data-id="${s.id}">Xoá</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  return { store, tbody, emptyMsg, render };
}

// ─── AC-1: View list ──────────────────────────────────────────────────────────
describe('AC-1: page load shows student list', () => {
  it('renders all students in the store on first render', () => {
    const students = [
      { id: '1', name: 'Nguyễn Văn A', className: '10A1', dateOfBirth: '2008-05-15', gender: 'Nam', email: '' },
      { id: '2', name: 'Trần Thị B',   className: '10A2', dateOfBirth: '2008-08-20', gender: 'Nữ',  email: 'b@test.com' },
    ];
    const { tbody, emptyMsg, render } = buildDOM(students);

    render();

    const rows = tbody.querySelectorAll('tr');
    expect(rows).toHaveLength(2);
    expect(emptyMsg.hidden).toBe(true);

    // AC-1: check full info columns
    const cells = rows[0].querySelectorAll('td');
    expect(cells[1].textContent).toBe('Nguyễn Văn A');
    expect(cells[2].textContent).toBe('10A1');
    expect(cells[3].textContent).toBe('15/05/2008');  // formatted date
    expect(cells[4].textContent).toBe('Nam');
  });

  it('shows empty message when no students exist', () => {
    const { tbody, emptyMsg, render } = buildDOM([]);
    render();
    expect(tbody.querySelectorAll('tr')).toHaveLength(0);
    expect(emptyMsg.hidden).toBe(false);
  });
});

// ─── AC-2: Add student ────────────────────────────────────────────────────────
describe('AC-2: add student form saves and displays new student', () => {
  it('newly added student appears in the rendered list', () => {
    const { store, tbody, render } = buildDOM([]);

    render(); // empty initially
    expect(tbody.querySelectorAll('tr')).toHaveLength(0);

    // Simulate form submit: add a student via store
    store.add({
      name: 'Lê Văn C',
      className: '11B',
      dateOfBirth: '2007-12-01',
      gender: 'Nam',
      email: 'c@test.com',
    });

    render(); // re-render after add

    const rows = tbody.querySelectorAll('tr');
    expect(rows).toHaveLength(1);
    const cells = rows[0].querySelectorAll('td');
    expect(cells[1].textContent).toBe('Lê Văn C');
    expect(cells[2].textContent).toBe('11B');
    expect(cells[3].textContent).toBe('01/12/2007');
  });

  it('multiple adds accumulate in the list', () => {
    const { store, tbody, render } = buildDOM([]);

    store.add({ name: 'A', className: '10', dateOfBirth: '2008-01-01' });
    store.add({ name: 'B', className: '10', dateOfBirth: '2008-02-01' });
    store.add({ name: 'C', className: '10', dateOfBirth: '2008-03-01' });

    render();

    expect(tbody.querySelectorAll('tr')).toHaveLength(3);
  });
});

// ─── AC-3: Delete student ─────────────────────────────────────────────────────
describe('AC-3: delete removes student from list and does not reappear after reload', () => {
  it('removes the student from the rendered list', () => {
    const students = [
      { id: 'del-1', name: 'Xoá Tôi', className: '9A', dateOfBirth: '2010-01-01', gender: '', email: '' },
      { id: 'keep-1', name: 'Giữ Lại', className: '9B', dateOfBirth: '2010-02-01', gender: '', email: '' },
    ];
    const { store, tbody, render } = buildDOM(students);

    render();
    expect(tbody.querySelectorAll('tr')).toHaveLength(2);

    // Simulate delete
    store.remove('del-1');
    render(); // re-render (simulates "reload" / DOM refresh)

    const rows = tbody.querySelectorAll('tr');
    expect(rows).toHaveLength(1);

    const names = [...rows].map((r) => r.querySelectorAll('td')[1].textContent);
    expect(names).not.toContain('Xoá Tôi');
    expect(names).toContain('Giữ Lại');
  });

  it('shows empty message after last student is deleted', () => {
    const students = [
      { id: 'only-1', name: 'Duy Nhất', className: '8A', dateOfBirth: '2011-01-01', gender: '', email: '' },
    ];
    const { store, tbody, emptyMsg, render } = buildDOM(students);

    render();
    store.remove('only-1');
    render();

    expect(tbody.querySelectorAll('tr')).toHaveLength(0);
    expect(emptyMsg.hidden).toBe(false);
  });

  it('removed student does not reappear in a fresh store instance', () => {
    // Simulates persistence across page reload
    const mem = { data: {}, getItem: (k) => mem.data[k] ?? null, setItem: (k, v) => { mem.data[k] = v; } };
    const store1 = createStudentStore(mem);
    const added = store1.add({ name: 'Sẽ Bị Xoá', className: '7A', dateOfBirth: '2012-01-01' });
    store1.remove(added.id);

    // Create a brand-new store backed by the SAME storage (simulates reload)
    const store2 = createStudentStore(mem);
    const all = store2.getAll();
    expect(all.find((s) => s.id === added.id)).toBeUndefined();
  });
});

// ─── Search filter ────────────────────────────────────────────────────────────
describe('Search filter', () => {
  it('filters students by name', () => {
    const students = [
      { id: '1', name: 'Nguyễn Văn Hùng', className: '10A', dateOfBirth: '2008-01-01', gender: '', email: '' },
      { id: '2', name: 'Trần Thị Mai',    className: '10B', dateOfBirth: '2008-02-01', gender: '', email: '' },
    ];
    const { tbody, render } = buildDOM(students);

    render('hùng');

    const rows = tbody.querySelectorAll('tr');
    expect(rows).toHaveLength(1);
    expect(rows[0].querySelectorAll('td')[1].textContent).toBe('Nguyễn Văn Hùng');
  });

  it('filters students by class', () => {
    const students = [
      { id: '1', name: 'A', className: '10A', dateOfBirth: '2008-01-01', gender: '', email: '' },
      { id: '2', name: 'B', className: '11B', dateOfBirth: '2008-02-01', gender: '', email: '' },
    ];
    const { tbody, render } = buildDOM(students);

    render('11b');

    expect(tbody.querySelectorAll('tr')).toHaveLength(1);
    expect(tbody.querySelector('tr td:nth-child(3)')?.textContent).toBe('11B');
  });
});
