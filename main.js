/**
 * PremiumLand – Real Estate Landing Page
 * main.js – UI interactions & form handling
 */

'use strict';

/* ============================================================
   MOBILE NAV TOGGLE
   ============================================================ */

/**
 * Toggle mobile navigation menu.
 * @param {HTMLButtonElement} toggle
 * @param {HTMLElement} mobileNav
 */
function initMobileNav(toggle, mobileNav) {
  if (!toggle || !mobileNav) return;

  toggle.addEventListener('click', () => {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    const next = !isExpanded;
    toggle.setAttribute('aria-expanded', String(next));
    mobileNav.hidden = !next;
  });

  // Close on nav-link click
  mobileNav.querySelectorAll('.nav-mobile-link').forEach((link) => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      mobileNav.hidden = true;
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !mobileNav.contains(e.target)) {
      toggle.setAttribute('aria-expanded', 'false');
      mobileNav.hidden = true;
    }
  });
}

/* ============================================================
   FORM VALIDATION HELPERS
   ============================================================ */

const MESSAGES = {
  required: 'Vui lòng điền thông tin này.',
  phone: 'Số điện thoại không hợp lệ. Vui lòng nhập số Việt Nam (VD: 0901234567).',
  email: 'Địa chỉ email không hợp lệ.',
};

/**
 * Validate a single form field.
 * Returns an error message string, or empty string if valid.
 * @param {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement} field
 * @returns {string}
 */
function validateField(field) {
  const { name, value, type, required } = field;
  const trimmed = value.trim();

  if (required && trimmed === '') return MESSAGES.required;

  if (type === 'tel' && trimmed !== '') {
    const phoneRe = /^(0|\+84)[0-9]{9,10}$/;
    if (!phoneRe.test(trimmed.replace(/\s/g, ''))) return MESSAGES.phone;
  }

  if (type === 'email' && trimmed !== '') {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(trimmed)) return MESSAGES.email;
  }

  return '';
}

/**
 * Show or clear an error for a field.
 * @param {HTMLElement} field
 * @param {string} message
 */
function setFieldError(field, message) {
  const errorEl = document.getElementById(`error-${field.name}`);
  if (!errorEl) return;

  errorEl.textContent = message;
  if (message) {
    field.classList.add('is-invalid');
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', `error-${field.name}`);
  } else {
    field.classList.remove('is-invalid');
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
  }
}

/**
 * Validate all fields in the form.
 * @param {HTMLFormElement} form
 * @returns {boolean} true if all fields are valid
 */
function validateForm(form) {
  let isValid = true;
  const fields = form.querySelectorAll('input, textarea, select');
  fields.forEach((field) => {
    const msg = validateField(field);
    setFieldError(field, msg);
    if (msg) isValid = false;
  });
  return isValid;
}

/* ============================================================
   CONTACT FORM SUBMISSION
   ============================================================ */

/**
 * Simulate async form submission (replace with real API call).
 * @param {FormData} data
 * @returns {Promise<void>}
 */
function submitFormData(data) {
  // Simulated async submit – replace body with fetch() for real backend.
  return new Promise((resolve) => {
    setTimeout(() => {
      // Log payload for development purposes (no secrets)
      const payload = Object.fromEntries(data.entries());
      console.info('[PremiumLand] Form submitted:', payload);
      resolve();
    }, 900);
  });
}

/**
 * Initialise contact form with validation + submit handling.
 * @param {HTMLFormElement} form
 * @param {HTMLElement} successEl
 * @param {HTMLButtonElement} resetBtn
 */
function initContactForm(form, successEl, resetBtn) {
  if (!form || !successEl) return;

  // Inline validation on blur
  form.querySelectorAll('input, textarea').forEach((field) => {
    field.addEventListener('blur', () => {
      const msg = validateField(field);
      setFieldError(field, msg);
    });
    // Clear error on input
    field.addEventListener('input', () => {
      if (field.classList.contains('is-invalid')) {
        const msg = validateField(field);
        setFieldError(field, msg);
      }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm(form)) {
      // Focus first invalid field
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const submitBtn = form.querySelector('#submit-btn');
    const btnText = submitBtn?.querySelector('.btn-text');
    const btnLoading = submitBtn?.querySelector('.btn-loading');

    // Show loading state
    if (submitBtn) submitBtn.disabled = true;
    if (btnText) btnText.hidden = true;
    if (btnLoading) btnLoading.hidden = false;

    try {
      const formData = new FormData(form);
      await submitFormData(formData);

      // Show success message
      form.hidden = true;
      successEl.hidden = false;
      successEl.focus();
    } catch (err) {
      console.error('[PremiumLand] Submit error:', err);
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      if (btnText) btnText.hidden = false;
      if (btnLoading) btnLoading.hidden = true;
    }
  });

  // Reset button – show form again
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.querySelectorAll('input, textarea').forEach((f) => {
        setFieldError(f, '');
      });
      successEl.hidden = true;
      form.hidden = false;
      form.querySelector('input')?.focus();
    });
  }
}

/* ============================================================
   SMOOTH SCROLL OFFSET (for sticky header)
   ============================================================ */

function initSmoothScrollOffset() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const headerH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-h') || '72',
        10
      );
      const y = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
}

/* ============================================================
   STICKY HEADER SHADOW
   ============================================================ */

function initHeaderScroll(header) {
  if (!header) return;
  const onScroll = () => {
    header.style.boxShadow = window.scrollY > 10
      ? '0 2px 16px rgba(0,0,0,0.10)'
      : '';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ============================================================
   BOOTSTRAP
   ============================================================ */

function init() {
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.getElementById('nav-mobile');
  initMobileNav(toggle, mobileNav);

  const form = document.getElementById('contact-form');
  const successEl = document.getElementById('form-success');
  const resetBtn = document.getElementById('reset-form-btn');
  initContactForm(form, successEl, resetBtn);

  const header = document.querySelector('.site-header');
  initHeaderScroll(header);

  initSmoothScrollOffset();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

/* ============================================================
   EXPORTS (for unit tests)
   ============================================================ */

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validateField,
    validateForm,
    setFieldError,
    initMobileNav,
    initContactForm,
    submitFormData,
  };
}
