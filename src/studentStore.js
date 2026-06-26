/**
 * studentStore.js
 * Pure data-layer module for student CRUD.
 * Persists to localStorage under STORAGE_KEY.
 * Exports a factory so tests can inject a custom storage backend.
 */

export const STORAGE_KEY = 'ql_hoc_sinh';

/**
 * @typedef {Object} Student
 * @property {string} id        - Unique identifier (crypto UUID or fallback)
 * @property {string} name      - Full name (required)
 * @property {string} className - Class / grade string e.g. "10A1" (required)
 * @property {string} dateOfBirth - ISO date string YYYY-MM-DD (required)
 * @property {string} gender    - "Nam" | "Nữ" | "Khác" | ""
 * @property {string} email     - Email address (optional)
 */

/**
 * Generates a small unique id without depending on any library.
 * Uses crypto.randomUUID when available, falls back to Math.random.
 * @returns {string}
 */
function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Validates student fields.
 * Returns an object where each key maps to an error message, or {} if valid.
 * @param {Partial<Student>} data
 * @returns {Record<string, string>}
 */
export function validateStudent(data) {
  const errors = {};

  if (!data.name || !data.name.trim()) {
    errors.name = 'Họ và tên không được để trống.';
  } else if (data.name.trim().length > 100) {
    errors.name = 'Họ và tên không được vượt quá 100 ký tự.';
  }

  if (!data.className || !data.className.trim()) {
    errors.className = 'Lớp không được để trống.';
  }

  if (!data.dateOfBirth) {
    errors.dateOfBirth = 'Ngày sinh không được để trống.';
  } else if (isNaN(Date.parse(data.dateOfBirth))) {
    errors.dateOfBirth = 'Ngày sinh không hợp lệ.';
  }

  if (data.email && data.email.trim()) {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(data.email.trim())) {
      errors.email = 'Email không đúng định dạng.';
    }
  }

  return errors;
}

/**
 * Creates a StudentStore backed by the given storage object.
 * @param {Storage | { getItem(k: string): string|null, setItem(k: string, v: string): void }} storage
 * @returns {StudentStore}
 */
export function createStudentStore(storage) {
  /** @returns {Student[]} */
  function load() {
    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  /** @param {Student[]} students */
  function save(students) {
    storage.setItem(STORAGE_KEY, JSON.stringify(students));
  }

  return {
    /**
     * Returns a shallow copy of all students.
     * @returns {Student[]}
     */
    getAll() {
      return load();
    },

    /**
     * Finds a student by id.
     * @param {string} id
     * @returns {Student | undefined}
     */
    getById(id) {
      return load().find((s) => s.id === id);
    },

    /**
     * Adds a new student.
     * Throws if validation fails.
     * @param {Omit<Student, 'id'>} data
     * @returns {Student} The newly created student (with id)
     */
    add(data) {
      const errors = validateStudent(data);
      if (Object.keys(errors).length > 0) {
        throw Object.assign(new Error('Validation failed'), { errors });
      }
      const student = {
        id: generateId(),
        name: data.name.trim(),
        className: data.className.trim(),
        dateOfBirth: data.dateOfBirth,
        gender: data.gender || '',
        email: (data.email || '').trim(),
      };
      const students = load();
      students.push(student);
      save(students);
      return student;
    },

    /**
     * Updates an existing student by id.
     * Throws if not found or validation fails.
     * @param {string} id
     * @param {Omit<Student, 'id'>} data
     * @returns {Student} The updated student
     */
    update(id, data) {
      const errors = validateStudent(data);
      if (Object.keys(errors).length > 0) {
        throw Object.assign(new Error('Validation failed'), { errors });
      }
      const students = load();
      const idx = students.findIndex((s) => s.id === id);
      if (idx === -1) throw new Error(`Student with id "${id}" not found.`);
      const updated = {
        id,
        name: data.name.trim(),
        className: data.className.trim(),
        dateOfBirth: data.dateOfBirth,
        gender: data.gender || '',
        email: (data.email || '').trim(),
      };
      students[idx] = updated;
      save(students);
      return updated;
    },

    /**
     * Removes a student by id.
     * Returns true if the student was found and removed, false otherwise.
     * @param {string} id
     * @returns {boolean}
     */
    remove(id) {
      const students = load();
      const next = students.filter((s) => s.id !== id);
      if (next.length === students.length) return false;
      save(next);
      return true;
    },
  };
}

/** Default store backed by window.localStorage */
export const studentStore = createStudentStore(
  typeof localStorage !== 'undefined'
    ? localStorage
    : { getItem: () => null, setItem: () => {} }
);
