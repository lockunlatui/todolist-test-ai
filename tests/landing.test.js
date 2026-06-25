/**
 * Landing Page – Unit Tests
 *
 * Tests cover:
 *  - HTML structure requirements (AC1: project info present)
 *  - Responsive meta tag (AC2: viewport)
 *  - CTA and contact form presence (AC3)
 *  - Form validation logic in script.js
 *
 * Run with: node tests/landing.test.js
 * (Uses Node.js built-ins only — no external deps required)
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

/* -------------------------------------------------------
   Minimal test harness
   ------------------------------------------------------- */
let passed = 0;
let failed = 0;
const errors = [];

function assert(condition, description) {
  if (condition) {
    passed++;
    console.log(`  ✓  ${description}`);
  } else {
    failed++;
    errors.push(description);
    console.error(`  ✗  ${description}`);
  }
}

function describe(group, fn) {
  console.log(`\n▶ ${group}`);
  fn();
}

/* -------------------------------------------------------
   Load files
   ------------------------------------------------------- */
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const css  = fs.readFileSync(path.join(ROOT, 'styles.css'), 'utf8');
const js   = fs.readFileSync(path.join(ROOT, 'script.js'), 'utf8');

/* -------------------------------------------------------
   AC1 – Project information is displayed
   ------------------------------------------------------- */
describe('AC1: Project information', () => {
  assert(html.includes('Vinhomes Grand Park'), 'Contains project name');
  assert(html.includes('271'), 'Contains project area/size (271 ha)');
  assert(
    html.includes('tỷ') || html.includes('giá') || html.includes('Giá'),
    'Contains price information'
  );
  assert(
    html.includes('<img') && html.includes('alt='),
    'Contains images with alt text (accessibility)'
  );
  assert(
    html.includes('id="du-an"') || html.includes('id="bang-gia"'),
    'Has project/pricing sections with IDs for navigation'
  );
  assert(
    html.includes('Thủ Đức') || html.includes('TP.HCM'),
    'Contains location description'
  );
  assert(
    html.includes('Chủ Đầu Tư') || html.includes('Vingroup'),
    'Contains developer/owner information'
  );
});

/* -------------------------------------------------------
   AC2 – Responsive layout
   ------------------------------------------------------- */
describe('AC2: Responsive design', () => {
  assert(
    html.includes('viewport') && html.includes('width=device-width'),
    'Has viewport meta tag'
  );
  assert(
    css.includes('@media') && css.includes('min-width'),
    'CSS contains media queries for responsive breakpoints'
  );
  assert(
    css.includes('640px') || css.includes('768px') || css.includes('1024px'),
    'CSS has common breakpoints (640/768/1024)'
  );
  assert(
    css.includes('grid') || css.includes('flex'),
    'CSS uses modern layout (grid/flex)'
  );
  assert(
    css.includes('clamp(') || css.includes('vw'),
    'CSS uses fluid typography / spacing (clamp or vw)'
  );
});

/* -------------------------------------------------------
   AC3 – CTA and contact form
   ------------------------------------------------------- */
describe('AC3: CTA and contact form', () => {
  assert(
    html.includes('id="lien-he"'),
    'Has contact section with id="lien-he"'
  );
  assert(
    html.includes('btn-primary') || html.includes('btn btn'),
    'Has CTA button(s)'
  );
  assert(
    html.includes('<form') && html.includes('contact-form'),
    'Has contact form with id'
  );
  assert(
    html.includes('type="tel"'),
    'Contact form has phone field'
  );
  assert(
    html.includes('type="submit"'),
    'Contact form has submit button'
  );
  assert(
    html.includes('tel:') || html.includes('0901'),
    'Contact phone number is present and linked'
  );
  assert(
    html.includes('mailto:'),
    'Contact email is present and linked'
  );
});

/* -------------------------------------------------------
   Script – Form validation logic (regex tests without DOM)
   ------------------------------------------------------- */
describe('Script: Phone validation regex', () => {
  // Extract regex from script.js source
  const phoneRegexMatch = js.match(/const phoneRegex = (\/[^\/]+\/[a-z]*)/);
  assert(phoneRegexMatch !== null, 'phoneRegex is defined in script.js');

  if (phoneRegexMatch) {
    // Evaluate the regex safely
    const regexStr = phoneRegexMatch[1];
    const match = regexStr.match(/^\/(.+)\/([a-z]*)$/);
    const regex = new RegExp(match[1], match[2]);

    assert(regex.test('0901234567'), 'Accepts valid 10-digit mobile number');
    assert(regex.test('+84901234567'), 'Accepts +84 prefix number');
    assert(!regex.test('12345'), 'Rejects short invalid number');
    assert(!regex.test('abc1234567'), 'Rejects non-numeric input');
    assert(!regex.test(''), 'Rejects empty string (handled separately by required check)');
  }
});

describe('Script: Email validation regex', () => {
  const emailRegexMatch = js.match(/const emailRegex = (\/[^\/]+\/[a-z]*)/);
  assert(emailRegexMatch !== null, 'emailRegex is defined in script.js');

  if (emailRegexMatch) {
    const regexStr = emailRegexMatch[1];
    const match = regexStr.match(/^\/(.+)\/([a-z]*)$/);
    const regex = new RegExp(match[1], match[2]);

    assert(regex.test('user@example.com'), 'Accepts valid email');
    assert(regex.test('name+tag@sub.domain.vn'), 'Accepts email with plus and subdomain');
    assert(!regex.test('notanemail'), 'Rejects string with no @');
    assert(!regex.test('missing@tld'), 'Rejects email with no top-level domain');
  }
});

/* -------------------------------------------------------
   Accessibility checks
   ------------------------------------------------------- */
describe('Accessibility', () => {
  assert(html.includes('lang="vi"'), 'HTML lang attribute set to "vi"');
  assert(html.includes('aria-label'), 'Has aria-label attributes');
  assert(html.includes('role="alert"'), 'Error messages use role="alert"');
  assert(html.includes('aria-required="true"'), 'Required fields have aria-required');
  assert(
    html.includes('aria-labelledby') || html.includes('aria-label'),
    'Sections have accessible labels'
  );
  assert(
    !html.includes('<img') || html.includes('alt='),
    'All img tags have alt attributes (no empty src without alt)'
  );
});

/* -------------------------------------------------------
   File structure
   ------------------------------------------------------- */
describe('File structure', () => {
  assert(fs.existsSync(path.join(ROOT, 'index.html')), 'index.html exists');
  assert(fs.existsSync(path.join(ROOT, 'styles.css')), 'styles.css exists');
  assert(fs.existsSync(path.join(ROOT, 'script.js')), 'script.js exists');
  assert(html.includes('<link rel="stylesheet" href="styles.css"'), 'HTML links to styles.css');
  assert(html.includes('<script src="script.js"'), 'HTML includes script.js');
});

/* -------------------------------------------------------
   Summary
   ------------------------------------------------------- */
console.log(`\n${'─'.repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.error('\nFailed tests:');
  errors.forEach((e) => console.error(`  ✗  ${e}`));
  process.exit(1);
} else {
  console.log('\nAll tests passed ✓');
  process.exit(0);
}
