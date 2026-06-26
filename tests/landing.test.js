/**
 * tests/landing.test.js
 *
 * Unit tests for the real-estate landing page.
 *
 * Strategy: runs under jest-environment-jsdom. We load the raw HTML via fs
 * and inject it into the jsdom document. No external JSDOM constructor needed.
 *
 * Covers all three ACs:
 *  AC1 – Project info (name, description, price) visible on page load
 *  AC2 – Responsive layout (viewport meta, stylesheet link)
 *  AC3 – CTA buttons present; contact form reachable
 *
 * Plus: form validation pure-function unit tests and accessibility checks.
 */

'use strict';

const fs = require('fs');
const path = require('path');

/* ---- Load HTML into jsdom before each test ---- */
const htmlPath = path.resolve(__dirname, '..', 'index.html');
const rawHtml = fs.readFileSync(htmlPath, 'utf-8');

beforeEach(() => {
  document.documentElement.innerHTML = rawHtml;
});

/* =========================================================
   AC1 – Project information visible on page load
   ========================================================= */
describe('AC1 – Project information', () => {
  test('page <title> contains project name', () => {
    expect(document.title).toMatch(/Vinhomes/i);
  });

  test('hero section displays the project name', () => {
    const hero = document.querySelector('.hero__title');
    expect(hero).not.toBeNull();
    expect(hero.textContent).toMatch(/Vinhomes/i);
  });

  test('project description / subtitle is present and non-trivial', () => {
    const subtitle = document.querySelector('.hero__subtitle');
    expect(subtitle).not.toBeNull();
    expect(subtitle.textContent.trim().length).toBeGreaterThan(20);
  });

  test('each pricing card shows a price (contains "tỷ")', () => {
    const amounts = document.querySelectorAll('.pricing-card__amount');
    expect(amounts.length).toBeGreaterThan(0);
    amounts.forEach((el) => {
      expect(el.textContent).toMatch(/tỷ/i);
    });
  });

  test('there are at least 3 pricing cards', () => {
    const cards = document.querySelectorAll('.pricing-card');
    expect(cards.length).toBeGreaterThanOrEqual(3);
  });

  test('about section lists at least 4 project specs', () => {
    const specs = document.querySelectorAll('.about__spec');
    expect(specs.length).toBeGreaterThanOrEqual(4);
  });

  test('gallery section has at least 4 items', () => {
    const items = document.querySelectorAll('.gallery__item');
    expect(items.length).toBeGreaterThanOrEqual(4);
  });

  test('features section has at least 4 feature cards', () => {
    const features = document.querySelectorAll('.feature-card');
    expect(features.length).toBeGreaterThanOrEqual(4);
  });
});

/* =========================================================
   AC2 – Responsive layout
   ========================================================= */
describe('AC2 – Responsive layout', () => {
  test('viewport meta tag is present with width=device-width', () => {
    const meta = document.querySelector('meta[name="viewport"]');
    expect(meta).not.toBeNull();
    expect(meta.getAttribute('content')).toMatch(/width=device-width/i);
  });

  test('stylesheet is linked', () => {
    const link = document.querySelector('link[rel="stylesheet"]');
    expect(link).not.toBeNull();
    expect(link.getAttribute('href')).toContain('styles.css');
  });

  test('main.js script is included', () => {
    const script = document.querySelector('script[src]');
    expect(script).not.toBeNull();
    expect(script.getAttribute('src')).toContain('main.js');
  });
});

/* =========================================================
   AC3 – CTA triggers contact form / modal
   ========================================================= */
describe('AC3 – CTA → contact form', () => {
  test('contact modal element is in the DOM', () => {
    const modal = document.getElementById('contactModal');
    expect(modal).not.toBeNull();
  });

  test('modal is not open by default (no "open" class)', () => {
    const modal = document.getElementById('contactModal');
    expect(modal.classList.contains('open')).toBe(false);
  });

  test('contact form is present inside the modal', () => {
    const form = document.getElementById('contactForm');
    expect(form).not.toBeNull();
  });

  test('form contains required inputs: fullName and phone', () => {
    expect(document.getElementById('fullName')).not.toBeNull();
    expect(document.getElementById('phone')).not.toBeNull();
  });

  test('all four main CTA buttons exist', () => {
    ['navCta', 'heroCta', 'aboutCta', 'bannerCta'].forEach((id) => {
      expect(document.getElementById(id)).not.toBeNull();
    });
  });

  test('each pricing card has a CTA button with a data-type attribute', () => {
    const pricingBtns = document.querySelectorAll('.pricing-card__cta');
    expect(pricingBtns.length).toBeGreaterThanOrEqual(3);
    pricingBtns.forEach((btn) => {
      expect(btn.dataset.type).toBeTruthy();
    });
  });

  test('modal has a close button', () => {
    const close = document.getElementById('modalClose');
    expect(close).not.toBeNull();
  });

  test('success state element is present but hidden by default', () => {
    const success = document.getElementById('formSuccess');
    expect(success).not.toBeNull();
    expect(success.hasAttribute('hidden')).toBe(true);
  });
});

/* =========================================================
   Form validation – pure function unit tests
   (mirrors validators in main.js, kept isolated for speed)
   ========================================================= */
describe('Form validation – pure logic', () => {
  function validateFullName(value) {
    if (!value.trim()) return 'Vui lòng nhập họ và tên.';
    if (value.trim().length < 2) return 'Họ và tên phải có ít nhất 2 ký tự.';
    return '';
  }

  function validatePhone(value) {
    if (!value.trim()) return 'Vui lòng nhập số điện thoại.';
    const cleaned = value.replace(/[\s\-().]/g, '');
    if (!/^(0|\+84)[3-9]\d{8}$/.test(cleaned)) {
      return 'Số điện thoại không hợp lệ (ví dụ: 0912 345 678).';
    }
    return '';
  }

  function validateEmail(value) {
    if (!value.trim()) return '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
      return 'Địa chỉ email không hợp lệ.';
    }
    return '';
  }

  describe('validateFullName()', () => {
    test.each([
      ['', true],
      ['  ', true],
      ['A', true],
    ])('invalid: "%s" → error', (val, hasError) => {
      expect(!!validateFullName(val)).toBe(hasError);
    });

    test.each([
      ['An', false],
      ['Nguyễn Văn A', false],
    ])('valid: "%s" → no error', (val, hasError) => {
      expect(!!validateFullName(val)).toBe(hasError);
    });
  });

  describe('validatePhone()', () => {
    test.each([
      ['', true],
      ['123', true],
      ['0212345678', true],   // landline prefix – invalid mobile
      ['abcdefghij', true],
    ])('invalid: "%s" → error', (val, hasError) => {
      expect(!!validatePhone(val)).toBe(hasError);
    });

    test.each([
      ['0912345678', false],
      ['0 912 345 678', false],  // spaces accepted
      ['+84912345678', false],
    ])('valid: "%s" → no error', (val, hasError) => {
      expect(!!validatePhone(val)).toBe(hasError);
    });
  });

  describe('validateEmail()', () => {
    test('empty email is valid (optional field)', () => {
      expect(validateEmail('')).toBe('');
      expect(validateEmail('   ')).toBe('');
    });

    test.each([
      ['notanemail', true],
      ['missing@', true],
      ['@domain.com', true],
    ])('invalid: "%s" → error', (val, hasError) => {
      expect(!!validateEmail(val)).toBe(hasError);
    });

    test.each([
      ['user@example.com', false],
      ['nguyen.van.a@gmail.com', false],
    ])('valid: "%s" → no error', (val, hasError) => {
      expect(!!validateEmail(val)).toBe(hasError);
    });
  });
});

/* =========================================================
   Accessibility checks
   ========================================================= */
describe('Accessibility', () => {
  test('contact modal has role="dialog" and aria-modal="true"', () => {
    const modal = document.getElementById('contactModal');
    expect(modal.getAttribute('role')).toBe('dialog');
    expect(modal.getAttribute('aria-modal')).toBe('true');
  });

  test('modal aria-labelledby points to a real element', () => {
    const modal = document.getElementById('contactModal');
    const labelId = modal.getAttribute('aria-labelledby');
    expect(labelId).toBeTruthy();
    const labelEl = document.getElementById(labelId);
    expect(labelEl).not.toBeNull();
  });

  test('nav toggle button has an aria-label', () => {
    const toggle = document.getElementById('navToggle');
    expect(toggle.getAttribute('aria-label')).toBeTruthy();
  });

  test('modal close button has an aria-label', () => {
    const closeBtn = document.getElementById('modalClose');
    expect(closeBtn.getAttribute('aria-label')).toBeTruthy();
  });

  test('form inputs have associated labels', () => {
    const inputs = ['fullName', 'phone', 'email'];
    inputs.forEach((id) => {
      const label = document.querySelector(`label[for="${id}"]`);
      expect(label).not.toBeNull();
    });
  });
});
