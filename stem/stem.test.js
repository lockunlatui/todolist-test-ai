/**
 * STEM Landing Page – structural tests
 * Run with: node stem/stem.test.js
 * No external dependencies required.
 */

const fs   = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.error(`  ✗ ${label}`);
    failed++;
  }
}

console.log('\nSTEM Landing Page – structural tests\n');

// AC1 – Required sections present
console.log('AC1: Required sections');
assert(html.includes('id="hero"'),       'Hero section present');
assert(html.includes('id="intro"'),      'Intro (giới thiệu) section present');
assert(html.includes('id="highlights"'), 'Highlights (nội dung nổi bật) section present');
assert(html.includes('id="cta"'),        'CTA section present');

// AC2 – Responsive design markers
console.log('\nAC2: Responsive design');
assert(html.includes('viewport'),                          'Viewport meta tag present');
assert(html.includes('max-width: 768px'),                  'Mobile breakpoint defined');
assert(html.includes('min-width: 769px') || html.includes('max-width: 1024px'), 'Tablet breakpoint defined');
assert(html.includes('clamp('),                            'Fluid typography (clamp) used');
assert(html.includes('grid-template-columns: 1fr'),        'Responsive grid columns present');

// AC3 – CTA links redirect correctly
console.log('\nAC3: CTA links');
assert(html.includes('href="/dang-ky"'),  'Primary CTA links to /dang-ky');
assert(html.includes('href="/khoa-hoc"'), 'Secondary CTA links to /khoa-hoc');
assert(html.includes('id="main-cta"'),    'Main CTA element has id for tracking');
assert(html.includes('id="hero-cta"'),    'Hero CTA element has id for tracking');

// Accessibility basics
console.log('\nAccessibility');
assert(html.includes('aria-label'),        'aria-label attributes present');
assert(html.includes('role='),             'ARIA roles present');
assert(html.includes('lang="vi"'),         'Page lang set to Vietnamese');
assert(html.includes('<meta name="description"'), 'Meta description present');

// Output summary
console.log(`\n${'─'.repeat(40)}`);
console.log(`Passed: ${passed}  |  Failed: ${failed}`);
if (failed > 0) {
  console.error('\nSome tests failed.');
  process.exit(1);
} else {
  console.log('\nAll tests passed.');
}
