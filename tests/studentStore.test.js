/**
 * Unit tests for studentStore.js
 * Tests all CRUD operations and validation logic.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { createStudentStore, validateStudent, STORAGE_KEY } from '../src/studentStore.js';

// ─── In-memory storage stub ──────────────────────────────────────────────────
function createMemoryStorage() {
  const store = {};
  return {
    getItem(key) { return store[key] ?? null; },
    setItem(key, value) { store[key] = value; },
    clear() { Object.keys(store).forEach((k) => delete store[k]); },
  };
}

// ─── validateStudent ─────────────────────────────────────────────────────────
describe('validateStudent', () => {
  it('returns no errors for a valid student', () => {
    const errors = validateStudent({
      name: 'Nguyễn Văn A',
      className: '10A1',
      dateOfBirth: '2008-05-15',
      gender: 'Nam',
      email: 'a@example.com',
    });
    expect(errors).toEqual({});
  });

  it('requires name', () => {
    const errors = validateStudent({ name: '', className: '10A1', dateOfBirth: '2008-01-01' });
    expect(errors.name).toBeTruthy();
  });

  it('requires className', () => {
    const errors = validateStudent({ name: 'A', className: '', dateOfBirth: '2008-01-01' });
    expect(errors.className).toBeTruthy();
  });

  it('requires dateOfBirth', () => {
    const errors = validateStudent({ name: 'A', className: '10A', dateOfBirth: '' });
    expect(errors.dateOfBirth).toBeTruthy();
  });

  it('rejects invalid dateOfBirth', () => {
    const errors = validateStudent({ name: 'A', className: '10A', dateOfBirth: 'not-a-date' });
    expect(errors.dateOfBirth).toBeTruthy();
  });

  it('rejects malformed email', () => {
    const errors = validateStudent({
      name: 'A', className: '10A', dateOfBirth: '2008-01-01',
      email: 'not-an-email',
    });
    expect(errors.email).toBeTruthy();
  });

  it('allows empty email', () => {
    const errors = validateStudent({
      name: 'A', className: '10A', dateOfBirth: '2008-01-01',
      email: '',
    });
    expect(errors.email).toBeUndefined();
  });

  it('rejects name longer than 100 chars', () => {
    const errors = validateStudent({
      name: 'A'.repeat(101),
      className: '10A',
      dateOfBirth: '2008-01-01',
    });
    expect(errors.name).toBeTruthy();
  });
});

// ─── createStudentStore ──────────────────────────────────────────────────────
describe('createStudentStore', () => {
  let storage;
  let store;

  beforeEach(() => {
    storage = createMemoryStorage();
    store   = createStudentStore(storage);
  });

  // getAll
  describe('getAll()', () => {
    it('returns [] when storage is empty', () => {
      expect(store.getAll()).toEqual([]);
    });

    it('returns previously stored students', () => {
      const s = store.add({ name: 'Lan', className: '10B', dateOfBirth: '2008-03-10' });
      const all = store.getAll();
      expect(all).toHaveLength(1);
      expect(all[0].id).toBe(s.id);
    });
  });

  // add
  describe('add()', () => {
    it('persists a new student and returns it with an id', () => {
      const student = store.add({ name: 'Minh', className: '11C', dateOfBirth: '2007-07-22' });
      expect(student.id).toBeTruthy();
      expect(student.name).toBe('Minh');
      expect(store.getAll()).toHaveLength(1);
    });

    it('trims whitespace from name and className', () => {
      const student = store.add({ name: '  Hà  ', className: ' 12A ', dateOfBirth: '2006-01-01' });
      expect(student.name).toBe('Hà');
      expect(student.className).toBe('12A');
    });

    it('throws with .errors when validation fails', () => {
      expect(() => store.add({ name: '', className: '', dateOfBirth: '' })).toThrow();
      try {
        store.add({ name: '', className: '', dateOfBirth: '' });
      } catch (e) {
        expect(e.errors).toBeTruthy();
        expect(e.errors.name).toBeTruthy();
      }
    });

    it('assigns unique ids to multiple students', () => {
      const a = store.add({ name: 'A', className: '10', dateOfBirth: '2008-01-01' });
      const b = store.add({ name: 'B', className: '10', dateOfBirth: '2008-01-02' });
      expect(a.id).not.toBe(b.id);
      expect(store.getAll()).toHaveLength(2);
    });

    it('defaults gender and email to empty string when not provided', () => {
      const s = store.add({ name: 'T', className: '10', dateOfBirth: '2008-01-01' });
      expect(s.gender).toBe('');
      expect(s.email).toBe('');
    });
  });

  // getById
  describe('getById()', () => {
    it('returns the student if found', () => {
      const added = store.add({ name: 'X', className: '9', dateOfBirth: '2009-01-01' });
      expect(store.getById(added.id)).toMatchObject({ name: 'X' });
    });

    it('returns undefined for unknown id', () => {
      expect(store.getById('nonexistent-id')).toBeUndefined();
    });
  });

  // update
  describe('update()', () => {
    it('updates a student and persists the change', () => {
      const s = store.add({ name: 'Old', className: '10', dateOfBirth: '2008-01-01' });
      const updated = store.update(s.id, { name: 'New', className: '11', dateOfBirth: '2007-06-01' });
      expect(updated.name).toBe('New');
      expect(store.getById(s.id)?.name).toBe('New');
    });

    it('throws when student id is not found', () => {
      expect(() =>
        store.update('ghost-id', { name: 'X', className: '1', dateOfBirth: '2008-01-01' })
      ).toThrow();
    });

    it('throws with .errors when validation fails', () => {
      const s = store.add({ name: 'Old', className: '10', dateOfBirth: '2008-01-01' });
      try {
        store.update(s.id, { name: '', className: '', dateOfBirth: '' });
        expect.fail('should have thrown');
      } catch (e) {
        expect(e.errors).toBeTruthy();
      }
    });
  });

  // remove
  describe('remove()', () => {
    it('removes the student and returns true', () => {
      const s = store.add({ name: 'Del', className: '10', dateOfBirth: '2008-01-01' });
      expect(store.remove(s.id)).toBe(true);
      expect(store.getAll()).toHaveLength(0);
    });

    it('returns false for unknown id', () => {
      expect(store.remove('ghost')).toBe(false);
    });

    it('does not affect other students', () => {
      const a = store.add({ name: 'A', className: '10', dateOfBirth: '2008-01-01' });
      const b = store.add({ name: 'B', className: '10', dateOfBirth: '2008-02-01' });
      store.remove(a.id);
      const remaining = store.getAll();
      expect(remaining).toHaveLength(1);
      expect(remaining[0].id).toBe(b.id);
    });
  });

  // storage key
  describe('STORAGE_KEY', () => {
    it('uses the correct storage key', () => {
      store.add({ name: 'K', className: '10', dateOfBirth: '2008-01-01' });
      expect(storage.getItem(STORAGE_KEY)).not.toBeNull();
    });

    it('handles corrupt storage gracefully', () => {
      storage.setItem(STORAGE_KEY, 'not-valid-json{{');
      expect(store.getAll()).toEqual([]);
    });
  });
});
