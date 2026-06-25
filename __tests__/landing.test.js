/**
 * Unit tests for PremiumLand landing page (TOD-009)
 * Tests: form validation, mobile nav toggle, form submission flow
 */

'use strict';

const {
  validateField,
  setFieldError,
  initMobileNav,
  initContactForm,
  submitFormData,
} = require('../main');

/* ============================================================
   Helpers
   ============================================================ */

function makeInput({ name, type = 'text', value = '', required = false } = {}) {
  const el = document.createElement('input');
  el.name = name;
  el.type = type;
  el.value = value;
  if (required) el.required = true;
  return el;
}

function makeErrorSpan(name) {
  const el = document.createElement('span');
  el.id = `error-${name}`;
  return el;
}

/* ============================================================
   validateField
   ============================================================ */

describe('validateField()', () => {
  test('returns empty string for valid non-required empty field', () => {
    const field = makeInput({ name: 'message', type: 'text', value: '' });
    expect(validateField(field)).toBe('');
  });

  test('returns required message for empty required field', () => {
    const field = makeInput({ name: 'name', type: 'text', value: '', required: true });
    expect(validateField(field)).toBe('Vui lòng điền thông tin này.');
  });

  test('returns required message for whitespace-only value', () => {
    const field = makeInput({ name: 'name', type: 'text', value: '   ', required: true });
    expect(validateField(field)).toBe('Vui lòng điền thông tin này.');
  });

  test('accepts valid Vietnamese phone number (0901234567)', () => {
    const field = makeInput({ name: 'phone', type: 'tel', value: '0901234567', required: true });
    expect(validateField(field)).toBe('');
  });

  test('accepts valid phone with +84 prefix', () => {
    const field = makeInput({ name: 'phone', type: 'tel', value: '+84901234567', required: true });
    expect(validateField(field)).toBe('');
  });

  test('rejects invalid phone number', () => {
    const field = makeInput({ name: 'phone', type: 'tel', value: '12345', required: true });
    expect(validateField(field)).toBe('Số điện thoại không hợp lệ. Vui lòng nhập số Việt Nam (VD: 0901234567).');
  });

  test('accepts valid email', () => {
    const field = makeInput({ name: 'email', type: 'email', value: 'user@example.com' });
    expect(validateField(field)).toBe('');
  });

  test('rejects invalid email', () => {
    const field = makeInput({ name: 'email', type: 'email', value: 'not-an-email' });
    expect(validateField(field)).toBe('Địa chỉ email không hợp lệ.');
  });

  test('skips email validation when value is empty (optional field)', () => {
    const field = makeInput({ name: 'email', type: 'email', value: '' });
    expect(validateField(field)).toBe('');
  });

  test('skips phone validation when value is empty (optional field)', () => {
    const field = makeInput({ name: 'phone', type: 'tel', value: '' });
    expect(validateField(field)).toBe('');
  });
});

/* ============================================================
   setFieldError
   ============================================================ */

describe('setFieldError()', () => {
  let field, errorEl;

  beforeEach(() => {
    document.body.innerHTML = '';
    field = makeInput({ name: 'name', type: 'text' });
    errorEl = makeErrorSpan('name');
    document.body.appendChild(field);
    document.body.appendChild(errorEl);
  });

  test('sets error text and invalid class', () => {
    setFieldError(field, 'Lỗi rồi!');
    expect(errorEl.textContent).toBe('Lỗi rồi!');
    expect(field.classList.contains('is-invalid')).toBe(true);
    expect(field.getAttribute('aria-invalid')).toBe('true');
  });

  test('clears error text and removes invalid class', () => {
    field.classList.add('is-invalid');
    field.setAttribute('aria-invalid', 'true');
    errorEl.textContent = 'Old error';

    setFieldError(field, '');
    expect(errorEl.textContent).toBe('');
    expect(field.classList.contains('is-invalid')).toBe(false);
    expect(field.getAttribute('aria-invalid')).toBeNull();
  });

  test('does nothing when errorEl does not exist', () => {
    const orphan = makeInput({ name: 'orphan' });
    // no error span with id="error-orphan" in DOM
    expect(() => setFieldError(orphan, 'test')).not.toThrow();
  });
});

/* ============================================================
   initMobileNav
   ============================================================ */

describe('initMobileNav()', () => {
  let toggle, mobileNav;

  beforeEach(() => {
    document.body.innerHTML = `
      <button class="nav-toggle" aria-expanded="false" aria-controls="nav-mobile">
        <span></span><span></span><span></span>
      </button>
      <div id="nav-mobile" hidden>
        <ul>
          <li><a class="nav-mobile-link" href="#features">Tiện ích</a></li>
        </ul>
      </div>
    `;
    toggle = document.querySelector('.nav-toggle');
    mobileNav = document.getElementById('nav-mobile');
    initMobileNav(toggle, mobileNav);
  });

  test('opens menu on toggle click', () => {
    toggle.click();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(mobileNav.hidden).toBe(false);
  });

  test('closes menu on second toggle click', () => {
    toggle.click();
    toggle.click();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(mobileNav.hidden).toBe(true);
  });

  test('closes menu when a mobile link is clicked', () => {
    toggle.click();
    expect(mobileNav.hidden).toBe(false);
    document.querySelector('.nav-mobile-link').click();
    expect(mobileNav.hidden).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  test('does not throw when toggle or nav is null', () => {
    expect(() => initMobileNav(null, null)).not.toThrow();
    expect(() => initMobileNav(toggle, null)).not.toThrow();
  });
});

/* ============================================================
   initContactForm – submission flow
   ============================================================ */

describe('initContactForm()', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="contact-form">
        <div class="form-field">
          <input id="field-name" name="name" type="text" required />
          <span id="error-name" role="alert"></span>
        </div>
        <div class="form-field">
          <input id="field-phone" name="phone" type="tel" required pattern="^(0|\\+84)[0-9]{9,10}$" />
          <span id="error-phone" role="alert"></span>
        </div>
        <div class="form-field">
          <input id="field-email" name="email" type="email" />
          <span id="error-email" role="alert"></span>
        </div>
        <button type="submit" id="submit-btn">
          <span class="btn-text">Gửi</span>
          <span class="btn-loading" hidden>Đang gửi...</span>
        </button>
      </form>
      <div id="form-success" hidden>
        <button id="reset-form-btn">Gửi lại</button>
      </div>
    `;
  });

  function getEls() {
    return {
      form: document.getElementById('contact-form'),
      successEl: document.getElementById('form-success'),
      resetBtn: document.getElementById('reset-form-btn'),
    };
  }

  test('shows validation errors when submitted with empty required fields', () => {
    const { form, successEl, resetBtn } = getEls();
    initContactForm(form, successEl, resetBtn);

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(document.getElementById('error-name').textContent).toBe('Vui lòng điền thông tin này.');
    expect(document.getElementById('error-phone').textContent).toBe('Vui lòng điền thông tin này.');
    expect(successEl.hidden).toBe(true);
  });

  test('shows success panel after valid submission', async () => {
    const { form, successEl, resetBtn } = getEls();
    initContactForm(form, successEl, resetBtn);

    document.getElementById('field-name').value = 'Nguyễn Văn A';
    document.getElementById('field-phone').value = '0901234567';

    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(submitEvent);

    // Wait for simulated async submit (900ms in real code, but jest fakes timers)
    await new Promise((r) => setTimeout(r, 1100));

    expect(form.hidden).toBe(true);
    expect(successEl.hidden).toBe(false);
  });

  test('reset button re-shows the form', async () => {
    const { form, successEl, resetBtn } = getEls();
    initContactForm(form, successEl, resetBtn);

    document.getElementById('field-name').value = 'Nguyễn Văn A';
    document.getElementById('field-phone').value = '0901234567';

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await new Promise((r) => setTimeout(r, 1100));

    expect(form.hidden).toBe(true);
    resetBtn.click();

    expect(form.hidden).toBe(false);
    expect(successEl.hidden).toBe(true);
  });

  test('does not throw when form or successEl is null', () => {
    expect(() => initContactForm(null, null, null)).not.toThrow();
  });
});

/* ============================================================
   submitFormData
   ============================================================ */

describe('submitFormData()', () => {
  test('resolves without throwing', async () => {
    const data = new FormData();
    data.append('name', 'Test');
    await expect(submitFormData(data)).resolves.toBeUndefined();
  });
});
