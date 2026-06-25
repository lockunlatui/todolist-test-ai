/**
 * Landing Page Tests — TOD-008
 * Uses Node.js built-in test runner + jsdom
 * Run: node --test tests/
 */

'use strict';

const { test, describe, before } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

// ---- Load HTML ----
const HTML_PATH = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(HTML_PATH, 'utf8');

// ---- VALIDATORS import ----
const { VALIDATORS } = require('../js/main.js');

// ---- Shared DOM ----
let document;

before(() => {
  const dom = new JSDOM(html, { url: 'http://localhost' });
  document = dom.window.document;
});

// ============================================================
// AC 1: Page structure — title, description, images, price
// ============================================================
describe('AC1: Full real estate information displayed', () => {
  test('page has a <title> containing bất động sản keywords', () => {
    const title = document.querySelector('title');
    assert.ok(title, '<title> element must exist');
    const lower = title.textContent.toLowerCase();
    const hasKeyword = lower.includes('bất động sản') || lower.includes('địa ốc');
    assert.ok(hasKeyword, `<title> "${title.textContent}" should reference bất động sản / địa ốc`);
  });

  test('hero section contains a main heading (h1)', () => {
    const h1 = document.querySelector('.hero h1, #hero h1');
    assert.ok(h1, 'Hero section must contain an <h1>');
    assert.ok(h1.textContent.trim().length > 0, '<h1> must not be empty');
  });

  test('hero section has a description paragraph', () => {
    const desc = document.querySelector('.hero__description');
    assert.ok(desc, '.hero__description must exist');
    assert.ok(desc.textContent.trim().length > 20, 'Hero description too short');
  });

  test('properties section exists with at least 3 cards', () => {
    const cards = document.querySelectorAll('.property-card');
    assert.ok(cards.length >= 3, `Expected ≥3 property cards, got ${cards.length}`);
  });

  test('each property card has a title', () => {
    document.querySelectorAll('.property-card').forEach((card, i) => {
      const title = card.querySelector('.property-card__title');
      assert.ok(title && title.textContent.trim().length > 0, `Card #${i} missing title`);
    });
  });

  test('each property card has a description', () => {
    document.querySelectorAll('.property-card').forEach((card, i) => {
      const desc = card.querySelector('.property-card__description');
      assert.ok(desc && desc.textContent.trim().length > 0, `Card #${i} missing description`);
    });
  });

  test('each property card shows a price', () => {
    document.querySelectorAll('.property-card').forEach((card, i) => {
      const price = card.querySelector('.property-card__price-value');
      assert.ok(price && price.textContent.trim().length > 0, `Card #${i} missing price`);
      // Price should contain a number
      assert.match(price.textContent, /\d/, `Card #${i} price has no number`);
    });
  });

  test('property type label shown on each card', () => {
    document.querySelectorAll('.property-card').forEach((card, i) => {
      const type = card.querySelector('.property-card__type');
      assert.ok(type && type.textContent.trim().length > 0, `Card #${i} missing type label`);
    });
  });

  test('location shown on each card', () => {
    document.querySelectorAll('.property-card').forEach((card, i) => {
      const loc = card.querySelector('.property-card__location');
      assert.ok(loc && loc.textContent.trim().length > 0, `Card #${i} missing location`);
    });
  });
});

// ============================================================
// AC 2: CTA buttons visible and correctly linked
// ============================================================
describe('AC2: CTA buttons visible and functional', () => {
  test('hero section has at least one CTA link/button', () => {
    const ctas = document.querySelectorAll('.hero__actions .btn');
    assert.ok(ctas.length >= 1, 'Hero must have at least one CTA button');
  });

  test('primary CTA points to #properties or #contact', () => {
    const primaryCta = document.querySelector('.hero__actions .btn--primary');
    assert.ok(primaryCta, 'Primary CTA must exist in hero');
    const href = primaryCta.getAttribute('href') || '';
    assert.ok(href.startsWith('#'), `Primary CTA href should be an anchor, got: "${href}"`);
  });

  test('each property card has a "Liên Hệ" CTA button', () => {
    document.querySelectorAll('.property-card').forEach((card, i) => {
      const cta = card.querySelector('.btn');
      assert.ok(cta, `Card #${i} missing CTA button`);
      assert.ok(cta.textContent.trim().length > 0, `Card #${i} CTA is empty`);
    });
  });

  test('contact section exists with an id of "contact"', () => {
    const contact = document.getElementById('contact');
    assert.ok(contact, '#contact section must exist for CTA targets');
  });

  test('contact form has a submit button', () => {
    const btn = document.getElementById('submit-btn');
    assert.ok(btn, '#submit-btn must exist');
    assert.equal(btn.type, 'submit', 'submit-btn must be type=submit');
  });

  test('register form has required fields (name, phone)', () => {
    const name = document.getElementById('fullname');
    const phone = document.getElementById('phone');
    assert.ok(name, '#fullname input must exist');
    assert.ok(phone, '#phone input must exist');
    assert.ok(name.required, 'fullname must be required');
    assert.ok(phone.required, 'phone must be required');
  });

  test('nav has a contact CTA link', () => {
    const navCta = document.querySelector('.nav__link--cta');
    assert.ok(navCta, 'Navigation must have a CTA link');
    assert.ok(
      navCta.getAttribute('href')?.includes('#contact'),
      'Nav CTA should link to #contact',
    );
  });
});

// ============================================================
// AC 3: Responsive / structural checks
// ============================================================
describe('AC3: Responsive layout structure', () => {
  test('viewport meta tag is set for mobile', () => {
    const viewport = document.querySelector('meta[name="viewport"]');
    assert.ok(viewport, 'viewport meta must exist');
    const content = viewport.getAttribute('content') || '';
    assert.ok(content.includes('width=device-width'), 'viewport must include width=device-width');
    assert.ok(content.includes('initial-scale=1'), 'viewport must include initial-scale=1');
  });

  test('nav toggle button exists (hamburger for mobile)', () => {
    const toggle = document.getElementById('nav-toggle');
    assert.ok(toggle, '#nav-toggle must exist for mobile menu');
    assert.equal(toggle.getAttribute('aria-expanded'), 'false', 'aria-expanded should default to false');
  });

  test('stylesheet link targets css/styles.css', () => {
    const link = document.querySelector('link[rel="stylesheet"]');
    assert.ok(link, '<link rel="stylesheet"> must exist');
    assert.ok(link.getAttribute('href')?.includes('styles.css'), 'must link to styles.css');
  });

  test('page sections exist for all content areas', () => {
    const requiredIds = ['hero', 'properties', 'features', 'stats', 'contact'];
    requiredIds.forEach((id) => {
      assert.ok(document.getElementById(id), `Section #${id} must exist`);
    });
  });

  test('main element wraps all sections', () => {
    const main = document.querySelector('main');
    assert.ok(main, '<main> element must exist');
    const hero = main.querySelector('#hero');
    assert.ok(hero, '<main> must contain #hero');
  });

  test('footer exists with contact info', () => {
    const footer = document.querySelector('footer, .footer');
    assert.ok(footer, 'Footer must exist');
    const text = footer.textContent;
    assert.ok(text.includes('1800') || text.includes('@'), 'Footer should contain contact info');
  });
});

// ============================================================
// Form Validation Logic Unit Tests
// ============================================================
describe('Form validators', () => {
  test('fullname: rejects empty string', () => {
    assert.notEqual(VALIDATORS.fullname(''), '');
  });

  test('fullname: rejects single char', () => {
    assert.notEqual(VALIDATORS.fullname('A'), '');
  });

  test('fullname: accepts normal name', () => {
    assert.equal(VALIDATORS.fullname('Nguyễn Văn A'), '');
  });

  test('phone: rejects non-numeric', () => {
    assert.notEqual(VALIDATORS.phone('abc'), '');
  });

  test('phone: rejects 9-digit number', () => {
    assert.notEqual(VALIDATORS.phone('090123456'), '');
  });

  test('phone: accepts 10-digit number', () => {
    assert.equal(VALIDATORS.phone('0901234567'), '');
  });

  test('phone: accepts 11-digit number', () => {
    assert.equal(VALIDATORS.phone('09012345678'), '');
  });

  test('phone: rejects 12-digit number', () => {
    assert.notEqual(VALIDATORS.phone('090123456789'), '');
  });

  test('email: optional — accepts empty', () => {
    assert.equal(VALIDATORS.email(''), '');
  });

  test('email: rejects invalid format', () => {
    assert.notEqual(VALIDATORS.email('not-an-email'), '');
  });

  test('email: accepts valid email', () => {
    assert.equal(VALIDATORS.email('user@example.com'), '');
  });
});
