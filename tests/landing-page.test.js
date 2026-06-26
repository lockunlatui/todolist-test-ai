/**
 * Landing page structure tests – TOD-012
 * Uses Node.js built-in test runner (node --test) + assert; no extra deps needed.
 */
'use strict';

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const indexHtml   = fs.readFileSync(path.join(ROOT, 'index.html'),   'utf8');
const contactHtml = fs.readFileSync(path.join(ROOT, 'contact.html'), 'utf8');
const stylesCSS   = fs.readFileSync(path.join(ROOT, 'styles.css'),   'utf8');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
/** Count all non-overlapping occurrences of `needle` in `haystack`. */
function count(haystack, needle) {
  return (haystack.split(needle).length - 1);
}

// ---------------------------------------------------------------------------
// AC-1: Hero banner, product list and prices visible on load
// ---------------------------------------------------------------------------
describe('AC-1: index.html – hero banner + products + prices', () => {

  test('has <title> tag', () => {
    assert.match(indexHtml, /<title>[^<]+<\/title>/);
  });

  test('has viewport meta (responsive prerequisite)', () => {
    assert.match(indexHtml, /name=["']viewport["']/);
  });

  test('hero section is present', () => {
    assert.match(indexHtml, /class=["'][^"']*hero[^"']*["']/);
  });

  test('hero has an h1 heading', () => {
    assert.match(indexHtml, /<h1[^>]*>/);
  });

  test('products section is present', () => {
    assert.match(indexHtml, /id=["']products["']/);
  });

  test('at least 6 product cards rendered', () => {
    const cardCount = count(indexHtml, 'product-card__name');
    assert.ok(cardCount >= 6, `Expected ≥ 6 products, got ${cardCount}`);
  });

  test('all product cards show a price', () => {
    const priceCount = count(indexHtml, 'product-card__price');
    const nameCount  = count(indexHtml, 'product-card__name');
    assert.ok(
      priceCount >= nameCount,
      `Each card should have a price element; names=${nameCount} prices=${priceCount}`
    );
  });

  test('prices use Vietnamese currency symbol ₫', () => {
    assert.match(indexHtml, /₫/);
  });

  test('stylesheet is linked', () => {
    assert.match(indexHtml, /href=["']styles\.css["']/);
  });

});

// ---------------------------------------------------------------------------
// AC-2: "Mua ngay" button redirects to contact page / form
// ---------------------------------------------------------------------------
describe('AC-2: "Mua ngay" button links to contact.html', () => {

  test('"Mua ngay" text appears at least once', () => {
    assert.match(indexHtml, /Mua ngay/);
  });

  test('every "Mua ngay" button links to contact.html', () => {
    // Match only anchors with the buy-now-btn class (product CTA buttons)
    const btnRegex = /<a\b[^>]+class=["'][^"']*buy-now-btn[^"']*["'][^>]*href=["']([^"']+)["'][^>]*>|<a\b[^>]+href=["']([^"']+)["'][^>]*class=["'][^"']*buy-now-btn[^"']*["'][^>]*>/gi;
    const matches = [...indexHtml.matchAll(btnRegex)];
    assert.ok(matches.length >= 1, 'Expected at least one .buy-now-btn anchor');
    for (const m of matches) {
      const href = m[1] || m[2];
      assert.match(
        href,
        /^contact\.html/,
        `Expected href to start with "contact.html", got "${href}"`
      );
    }
  });

  test('contact.html exists and has a <form>', () => {
    assert.match(contactHtml, /<form[^>]*>/);
  });

  test('contact form has a phone input field', () => {
    assert.match(contactHtml, /type=["']tel["']/);
  });

  test('contact form has a name input field', () => {
    assert.match(contactHtml, /name=["']fullName["']/);
  });

  test('contact form has a submit button', () => {
    assert.match(contactHtml, /type=["']submit["']/);
  });

  test('contact.html pre-fills product from query string via JS', () => {
    // Script reads URLSearchParams and sets selectedIndex
    assert.match(contactHtml, /URLSearchParams/);
    assert.match(contactHtml, /product-select/);
  });

});

// ---------------------------------------------------------------------------
// AC-3: Responsive layout – mobile-friendly
// ---------------------------------------------------------------------------
describe('AC-3: Responsive layout', () => {

  test('viewport meta tag is set to width=device-width', () => {
    assert.match(indexHtml, /width=device-width/);
  });

  test('CSS has at least one @media query', () => {
    assert.match(stylesCSS, /@media/);
  });

  test('CSS targets max-width: 600px for mobile breakpoint', () => {
    assert.match(stylesCSS, /max-width:\s*600px/);
  });

  test('CSS targets max-width: 900px for tablet breakpoint', () => {
    assert.match(stylesCSS, /max-width:\s*900px/);
  });

  test('product grid uses auto-fill for responsive columns', () => {
    assert.match(stylesCSS, /auto-fill/);
  });

  test('hero layout switches to single-column on small screens', () => {
    // The responsive section sets grid-template-columns: 1fr
    assert.match(stylesCSS, /grid-template-columns:\s*1fr\b/);
  });

  test('contact.html also has viewport meta tag', () => {
    assert.match(contactHtml, /width=device-width/);
  });

  test('contact.html links same stylesheet', () => {
    assert.match(contactHtml, /href=["']styles\.css["']/);
  });

});
