/**
 * Địa Ốc Việt — Landing Page JavaScript
 * Handles: sticky nav, mobile menu, counter animation, form validation
 */

'use strict';

/* ============================================================
   Sticky Header
   ============================================================ */
function initStickyHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}

/* ============================================================
   Mobile Navigation
   ============================================================ */
function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const navList = document.getElementById('nav-list');
  if (!toggle || !navList) return;

  toggle.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on nav link click
  navList.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', () => {
      navList.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on click outside
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !navList.contains(e.target)) {
      navList.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navList.classList.contains('is-open')) {
      navList.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      toggle.focus();
    }
  });
}

/* ============================================================
   Stats Counter Animation
   ============================================================ */
function animateCounter(el, target, duration) {
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString('vi-VN');
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-item__number[data-target]');
  if (!statNumbers.length) return;

  let animated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      if (animated) return;
      const isVisible = entries.some((e) => e.isIntersecting);
      if (!isVisible) return;

      animated = true;
      observer.disconnect();

      statNumbers.forEach((el) => {
        const target = parseInt(el.dataset.target, 10);
        if (!Number.isFinite(target)) return;
        animateCounter(el, target, 1800);
      });
    },
    { threshold: 0.3 },
  );

  statNumbers.forEach((el) => observer.observe(el));
}

/* ============================================================
   Contact Form Validation & Submission
   ============================================================ */
const VALIDATORS = {
  fullname: (v) => (v.trim().length >= 2 ? '' : 'Vui lòng nhập họ và tên (ít nhất 2 ký tự)'),
  phone: (v) => (/^[0-9]{10,11}$/.test(v.replace(/\s/g, '')) ? '' : 'Số điện thoại không hợp lệ (10–11 số)'),
  email: (v) => {
    if (!v.trim()) return ''; // optional
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Địa chỉ email không hợp lệ';
  },
};

function showError(inputId, message) {
  const input = document.getElementById(inputId);
  const errorEl = document.getElementById(`${inputId}-error`);
  if (!input || !errorEl) return;
  input.classList.toggle('is-error', !!message);
  errorEl.textContent = message;
}

function validateField(inputId) {
  const input = document.getElementById(inputId);
  if (!input || !VALIDATORS[inputId]) return true;
  const error = VALIDATORS[inputId](input.value);
  showError(inputId, error);
  return !error;
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  const successEl = document.getElementById('contact-success');
  const submitBtn = document.getElementById('submit-btn');
  if (!form || !successEl || !submitBtn) return;

  // Inline validation on blur
  ['fullname', 'phone', 'email'].forEach((id) => {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener('blur', () => validateField(id));
    input.addEventListener('input', () => {
      if (input.classList.contains('is-error')) validateField(id);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const validName = validateField('fullname');
    const validPhone = validateField('phone');
    const validEmail = validateField('email');

    if (!validName || !validPhone || !validEmail) {
      // Focus first error field
      const firstError = form.querySelector('.is-error');
      firstError?.focus();
      return;
    }

    // Simulate async submission (no real network call)
    submitBtn.disabled = true;
    submitBtn.textContent = 'Đang gửi...';

    setTimeout(() => {
      form.hidden = true;
      successEl.hidden = false;
      successEl.focus();
    }, 800);
  });
}

/* ============================================================
   Bootstrap
   ============================================================ */
function init() {
  initStickyHeader();
  initMobileNav();
  initStatsCounter();
  initContactForm();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

// Export for testing (Node.js / jsdom environment)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { animateCounter, VALIDATORS, validateField };
}
