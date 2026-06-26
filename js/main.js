/**
 * Vinhomes Grand Park – Landing Page
 * main.js
 *
 * Responsibilities:
 *  - Sticky header shadow on scroll
 *  - Mobile nav toggle
 *  - Smooth-scroll for anchor links
 *  - Contact modal open/close (CTA buttons)
 *  - Contact form validation & submit
 */

'use strict';

/* ---- Selectors ---- */
const header = document.getElementById('header');
const navToggle = document.getElementById('navToggle');
const navList = document.getElementById('navList');
const modal = document.getElementById('contactModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const successClose = document.getElementById('successClose');
const apartmentSelect = document.getElementById('apartment');

/* ---- Scroll: sticky header ---- */
function onScroll() {
  header.classList.toggle('scrolled', window.scrollY > 10);
}
window.addEventListener('scroll', onScroll, { passive: true });

/* ---- Mobile nav toggle ---- */
navToggle.addEventListener('click', () => {
  const isOpen = navList.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

/* Close nav when a link is clicked */
navList.addEventListener('click', (e) => {
  if (e.target.classList.contains('nav__link')) {
    navList.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

/* ---- Modal helpers ---- */

/**
 * Opens the contact modal, optionally pre-selecting an apartment type.
 * @param {string} [apartmentType] – value to set on the apartment <select>
 */
function openModal(apartmentType) {
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  if (apartmentType && apartmentSelect) {
    apartmentSelect.value = apartmentType;
  }

  // Focus first focusable element inside modal
  const firstInput = modal.querySelector('input, select, textarea, button');
  if (firstInput) {
    setTimeout(() => firstInput.focus(), 80);
  }
}

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
  contactForm.hidden = false;
  formSuccess.hidden = true;
  resetForm();
}

/* ---- CTA buttons that open modal ---- */
const ctaButtons = [
  document.getElementById('navCta'),
  document.getElementById('heroCta'),
  document.getElementById('aboutCta'),
  document.getElementById('bannerCta'),
];

ctaButtons.forEach((btn) => {
  if (btn) {
    btn.addEventListener('click', () => openModal());
  }
});

/* Pricing card CTAs – pre-select apartment type */
const apartmentTypeMap = {
  Studio: 'studio',
  '2PN': '2pn',
  '3-4PN': '3pn',
};

document.querySelectorAll('.pricing-card__cta').forEach((btn) => {
  btn.addEventListener('click', () => {
    const type = btn.dataset.type;
    openModal(apartmentTypeMap[type] || '');
  });
});

/* Close modal */
modalOverlay.addEventListener('click', closeModal);
modalClose.addEventListener('click', closeModal);
successClose.addEventListener('click', closeModal);

/* Close on Escape */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('open')) {
    closeModal();
  }
});

/* ---- Form validation ---- */
const validators = {
  fullName: {
    el: document.getElementById('fullName'),
    errorEl: document.getElementById('fullNameError'),
    validate(value) {
      if (!value.trim()) return 'Vui lòng nhập họ và tên.';
      if (value.trim().length < 2) return 'Họ và tên phải có ít nhất 2 ký tự.';
      return '';
    },
  },
  phone: {
    el: document.getElementById('phone'),
    errorEl: document.getElementById('phoneError'),
    validate(value) {
      if (!value.trim()) return 'Vui lòng nhập số điện thoại.';
      const cleaned = value.replace(/[\s\-().]/g, '');
      if (!/^(0|\+84)[3-9]\d{8}$/.test(cleaned)) {
        return 'Số điện thoại không hợp lệ (ví dụ: 0912 345 678).';
      }
      return '';
    },
  },
  email: {
    el: document.getElementById('email'),
    errorEl: document.getElementById('emailError'),
    validate(value) {
      if (!value.trim()) return ''; // optional
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
        return 'Địa chỉ email không hợp lệ.';
      }
      return '';
    },
  },
};

/**
 * Validates a single field and updates error display.
 * @param {object} fieldConfig
 * @returns {boolean} isValid
 */
function validateField(fieldConfig) {
  const { el, errorEl, validate } = fieldConfig;
  const error = validate(el.value);
  errorEl.textContent = error;
  el.classList.toggle('invalid', !!error);
  return !error;
}

/* Real-time validation on blur */
Object.values(validators).forEach((config) => {
  config.el.addEventListener('blur', () => validateField(config));
  config.el.addEventListener('input', () => {
    if (config.el.classList.contains('invalid')) {
      validateField(config);
    }
  });
});

function resetForm() {
  contactForm.reset();
  Object.values(validators).forEach(({ el, errorEl }) => {
    errorEl.textContent = '';
    el.classList.remove('invalid');
  });
}

/**
 * Validates all required fields.
 * @returns {boolean}
 */
function validateForm() {
  const results = Object.values(validators).map(validateField);
  return results.every(Boolean);
}

/* ---- Form submit ---- */
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    const firstInvalid = contactForm.querySelector('.invalid');
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  const submitBtn = document.getElementById('submitBtn');
  submitBtn.textContent = 'Đang gửi…';
  submitBtn.disabled = true;

  // Simulate async submission (replace with real fetch when backend is ready)
  await simulateSubmit({
    fullName: document.getElementById('fullName').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    apartment: apartmentSelect.value,
    message: document.getElementById('message').value,
  });

  submitBtn.textContent = 'Gửi Đăng Ký';
  submitBtn.disabled = false;

  // Show success state
  contactForm.hidden = true;
  formSuccess.hidden = false;
  formSuccess.querySelector('button').focus();
});

/**
 * Simulates an API call. Replace with real fetch() when backend is available.
 * @param {object} data
 * @returns {Promise<void>}
 */
async function simulateSubmit(data) {
  return new Promise((resolve) => {
    // TODO: replace with actual POST to /api/contact
    console.info('[Contact form] Submitted:', data);
    setTimeout(resolve, 900);
  });
}

/* ---- Smooth scroll for nav anchors (fallback for older browsers) ---- */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = header.offsetHeight + 8;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---- Intersection observer: fade-in sections ---- */
if ('IntersectionObserver' in window) {
  const sections = document.querySelectorAll('.section, .hero__stats, .feature-card, .pricing-card');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  sections.forEach((el) => {
    el.classList.add('fade-in');
    observer.observe(el);
  });
}

/* Add CSS for fade-in dynamically so JS controls it */
const fadeStyle = document.createElement('style');
fadeStyle.textContent = `
  .fade-in { opacity: 0; transform: translateY(24px); transition: opacity 0.55s ease, transform 0.55s ease; }
  .fade-in.visible { opacity: 1; transform: translateY(0); }
`;
document.head.appendChild(fadeStyle);
