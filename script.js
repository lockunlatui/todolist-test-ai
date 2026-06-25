/**
 * Vinhomes Grand Park – Landing Page Script
 *
 * Responsibilities:
 *  1. Mobile nav toggle
 *  2. Contact form validation + async submit simulation
 *  3. Smooth close of mobile menu when nav link is clicked
 *  4. Lazy-load fallback for browsers that don't support it natively (via IntersectionObserver)
 */

'use strict';

/* -------------------------------------------------------
   1. Mobile Nav Toggle
   ------------------------------------------------------- */
const navToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');

if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isExpanded));
    mobileMenu.hidden = isExpanded;
  });

  // Close mobile menu when a nav link is clicked
  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.hidden = true;
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
      navToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.hidden = true;
    }
  });
}

/* -------------------------------------------------------
   2. Contact Form
   ------------------------------------------------------- */
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
const resetFormBtn = document.getElementById('reset-form-btn');
const submitBtn = document.getElementById('submit-btn');

/**
 * Validates a single form field.
 * @param {HTMLElement} field
 * @returns {string} empty string if valid, error message otherwise
 */
function validateField(field) {
  const { id, value, required, type, pattern } = field;
  const trimmed = value.trim();

  if (required && trimmed === '') {
    return 'Vui lòng điền thông tin này.';
  }

  if (type === 'tel' && trimmed !== '') {
    const phoneRegex = /^(0|\+84)[0-9]{8,10}$/;
    if (!phoneRegex.test(trimmed.replace(/\s/g, ''))) {
      return 'Số điện thoại không hợp lệ (VD: 0901234567).';
    }
  }

  if (type === 'email' && trimmed !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return 'Email không hợp lệ.';
    }
  }

  return '';
}

/**
 * Shows or clears a field's error state.
 * @param {HTMLElement} field
 * @param {string} message
 */
function setFieldError(field, message) {
  const errorEl = document.getElementById(`${field.id}-error`);
  if (!errorEl) return;

  if (message) {
    field.classList.add('invalid');
    errorEl.textContent = message;
    errorEl.hidden = false;
    field.setAttribute('aria-describedby', `${field.id}-error`);
  } else {
    field.classList.remove('invalid');
    errorEl.textContent = '';
    errorEl.hidden = true;
    field.removeAttribute('aria-describedby');
  }
}

/**
 * Validates all required/checkable fields.
 * @returns {boolean} true if the entire form is valid
 */
function validateForm() {
  const fields = contactForm.querySelectorAll('input, select, textarea');
  let firstError = null;
  let isValid = true;

  fields.forEach((field) => {
    const error = validateField(field);
    if (error) {
      setFieldError(field, error);
      if (!firstError) firstError = field;
      isValid = false;
    } else {
      setFieldError(field, '');
    }
  });

  if (firstError) firstError.focus();
  return isValid;
}

// Live validation – only fire after user has interacted with the field
if (contactForm) {
  contactForm.querySelectorAll('input, select, textarea').forEach((field) => {
    let dirty = false;

    field.addEventListener('blur', () => {
      dirty = true;
      setFieldError(field, validateField(field));
    });

    field.addEventListener('input', () => {
      if (dirty) setFieldError(field, validateField(field));
    });
  });
}

/**
 * Simulates an async form submission.
 * Replace the setTimeout body with a real fetch() call when a backend is available.
 * @param {FormData} data
 * @returns {Promise<void>}
 */
function submitFormData(data) {
  return new Promise((resolve) => {
    // TODO: replace with real API endpoint
    // fetch('/api/contact', { method: 'POST', body: data }).then(...)
    setTimeout(resolve, 1200);
  });
}

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Loading state
    submitBtn.setAttribute('data-loading', 'true');
    submitBtn.disabled = true;

    try {
      const formData = new FormData(contactForm);
      await submitFormData(formData);

      // Success state
      contactForm.hidden = true;
      formSuccess.hidden = false;
    } catch (err) {
      console.error('Form submission error:', err);
      // Re-enable button on failure so user can retry
      submitBtn.removeAttribute('data-loading');
      submitBtn.disabled = false;
      alert('Gửi thông tin thất bại. Vui lòng thử lại hoặc liên hệ trực tiếp qua số điện thoại.');
    }
  });
}

// Reset form
if (resetFormBtn) {
  resetFormBtn.addEventListener('click', () => {
    contactForm.reset();
    contactForm.hidden = false;
    formSuccess.hidden = true;
    submitBtn.removeAttribute('data-loading');
    submitBtn.disabled = false;
    // Clear all error states
    contactForm.querySelectorAll('input, select, textarea').forEach((f) => {
      setFieldError(f, '');
    });
  });
}

/* -------------------------------------------------------
   3. Lazy-load Polyfill (for older browsers)
   ------------------------------------------------------- */
if (!('loading' in HTMLImageElement.prototype) && 'IntersectionObserver' in window) {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  lazyImages.forEach((img) => observer.observe(img));
}

/* -------------------------------------------------------
   4. Smooth active-section highlight in nav (optional UX)
   ------------------------------------------------------- */
(function highlightActiveSection() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: `-${64 + 32}px 0px -55% 0px` }
  );

  sections.forEach((s) => observer.observe(s));
})();
