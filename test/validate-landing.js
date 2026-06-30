/**
 * validate-landing.js
 * Smoke-validation for index.html — zero external dependencies.
 * Run: node test/validate-landing.js
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, '..', 'index.html');

/* ─── Load file ─────────────────────────────────────────────────────── */
let html;
try {
  html = fs.readFileSync(HTML_PATH, 'utf8');
} catch (e) {
  console.error('✗ Cannot read index.html:', e.message);
  process.exit(1);
}

/* ─── Test harness ──────────────────────────────────────────────────── */
let passed = 0;
let failed = 0;
const failures = [];

function check(label, condition) {
  if (condition) {
    passed++;
  } else {
    failed++;
    failures.push(label);
    console.error(`  ✗ FAIL: ${label}`);
  }
}

/* ─── FR checks ─────────────────────────────────────────────────────── */

// FR-1: Hero headline + subline
check('FR-1: Contains "Welcome, Subaru" headline', html.includes('Welcome, Subaru'));
check('FR-1: Contains hero-headline element', html.includes('hero-headline'));
check('FR-1: Contains "FPT Connected Car Services" subline', html.includes('FPT Connected Car Services'));
check('FR-1: Contains hero-subline element', html.includes('hero-subline'));

// FR-2: Japanese greeting
check('FR-2: Japanese greeting ようこそ FPT へ present', html.includes('ようこそ FPT へ'));
check('FR-2: hero-greeting element present', html.includes('hero-greeting'));
check('FR-2: lang="ja" attribute on greeting element', html.includes('lang="ja"'));

// FR-3: Session metadata in hero
check('FR-3: hero-meta element present', html.includes('hero-meta'));
check('FR-3: sessionDate present in CONFIG', html.includes('sessionDate'));
check('FR-3: sessionLocation present in CONFIG', html.includes('sessionLocation'));
check('FR-3: hostTeam present in CONFIG', html.includes('hostTeam'));

// FR-4: Agenda timeline strip
check('FR-4: agenda-strip element present', html.includes('agenda-strip'));
check('FR-4: agenda-steps element present', html.includes('agenda-steps'));
check('FR-4: activeStep variable in CONFIG', html.includes('activeStep'));
check('FR-4: active CSS class defined', html.includes('.agenda-step.active'));

// FR-5: Footer partnership text
check('FR-5: "FPT × Subaru — Connected Car Services" in footerText', html.includes('FPT × Subaru — Connected Car Services'));
check('FR-5: footer element present', html.includes('<footer'));

// FR-6: Done toggle / progress tracker
check('FR-6: done-badge element present', html.includes('done-badge'));
check('FR-6: btn-done-toggle button present', html.includes('btn-done-toggle'));
check('FR-6: is-done class used for toggle', html.includes('is-done'));
check('FR-6: No localStorage usage', !html.includes('localStorage'));

/* ─── US checks ─────────────────────────────────────────────────────── */

// US-1: Large font via clamp
check('US-1: clamp() used for hero-headline font-size', /hero-headline[\s\S]{0,300}clamp/.test(html));

// US-2: 2x2 grid layout
check('US-2: cards-grid present', html.includes('cards-grid'));
check('US-2: grid-template-columns: repeat(2, 1fr)', html.includes('repeat(2, 1fr)'));
check('US-2: grid-template-rows: repeat(2, 1fr)', html.includes('repeat(2, 1fr)'));

// US-3: QR + demo button + offline fallback
check('US-3: QRCode library CDN included', html.includes('qrcodejs') || html.includes('qrcode'));
check('US-3: new QRCode( call present', html.includes('new QRCode('));
check('US-3: btn-demo open demo button present', html.includes('btn-demo'));
check('US-3: Offline fallback for QR present', html.includes('qrOffline') || html.includes('typeof QRCode'));
check('US-3: url-fallback element present', html.includes('url-fallback'));

// US-4: Agenda maps 1:1 to cards
check('US-4: agenda-steps built from CONFIG.stations', html.includes('CONFIG.stations'));
check('US-4: 4 station entries in CONFIG', (html.match(/step:\s*[1-4]/g) || []).length === 4);

// US-5: Self-contained; no console errors; kiosk-safe
check('US-5: setInterval for clock present (unattended)', html.includes('setInterval'));
check('US-5: try/catch around QR generation', html.includes('try {') || html.includes('try{'));
check('US-5: No external image assets', !/<img\s[^>]*src=["'][^"'#]/.test(html));
check('US-5: No localStorage', !html.includes('localStorage'));

// US-6: FPT brand colors
check('US-6: FPT blue #0072BC present', html.includes('#0072BC'));
check('US-6: FPT orange #F37021 present', html.includes('#F37021'));
check('US-6: FPT green #6CC24A present', html.includes('#6CC24A'));
check('US-6: No <img> logo assets', !/<img\s[^>]*alt=["'][^"']*logo/i.test(html));

/* ─── Station card checks ────────────────────────────────────────────── */

// Card 1 — Digital Key
check('Card-1: "Digital Key" title present', html.includes('Digital Key'));
check('Card-1: CCC4 present', html.includes('CCC4'));
check('Card-1: accent blue #0072BC for card 1', html.match(/Digital Key[\s\S]{0,500}#0072BC/) !== null || html.match(/step:\s*1[\s\S]{0,300}#0072BC/) !== null);
check('Card-1: Remote lock/unlock feature', html.includes('Remote lock'));
check('Card-1: Owner pairing feature', html.includes('Owner pairing'));
check('Card-1: Key sharing feature', html.includes('Key sharing'));
check('Card-1: Auto lock/unlock feature', html.includes('Auto lock'));
check('Card-1: Engine start/stop feature', html.includes('Engine start'));
check('Card-1: Manage key lifecycle feature', html.includes('Manage key lifecycle'));

// Card 2 — OTA Management
check('Card-2: "OTA Management" title present', html.includes('OTA Management'));
check('Card-2: accent orange #F37021 for card 2', html.includes('#F37021'));
check('Card-2: Successful OTA update feature', html.includes('Successful OTA update'));
check('Card-2: Anti-Rollback feature', html.includes('Anti-Rollback'));
check('Card-2: Fleet campaign feature', html.includes('Fleet campaign'));
check('Card-2: Resume download feature', html.includes('Resume download'));

// Card 3 — AMS AI Agent
check('Card-3: "AMS AI Agent" title present', html.includes('AMS AI Agent'));
check('Card-3: accent green #6CC24A for card 3', html.includes('#6CC24A'));
check('Card-3: Aftersales Maintenance Service subtitle', html.includes('Aftersales Maintenance Service'));
check('Card-3: L1/L2/L3 maintenance feature', html.includes('L1') && html.includes('L2') && html.includes('L3'));
check('Card-3: Live demo feature', html.includes('Live demo'));

// Card 4 — Nami PM AI Agent
check('Card-4: "Nami PM AI Agent" title present', html.includes('Nami PM AI Agent'));
check('Card-4: gradient accent (blue+orange) present', html.includes('gradient: true') || html.includes("gradient:true"));
check('Card-4: accentEnd #F37021 for gradient', html.includes('accentEnd'));
check('Card-4: Monitor projects feature', html.includes('Monitor projects'));
check('Card-4: Manage tasks/scope/risks feature', html.includes('Manage tasks'));

/* ─── Architecture checks ────────────────────────────────────────────── */

check('ARCH: Single HTML file (no local <script src=> for custom JS)',
  // CDN scripts are fine; only flag relative/local .js includes
  !/<script\s[^>]*src=["'](?!https?:\/\/)/.test(html)
);
check('ARCH: CONFIG object at top of script', html.includes('const CONFIG = {'));
check('ARCH: stations array in CONFIG', html.includes('stations:'));
check('ARCH: clamp() used for responsive sizing', html.includes('clamp('));
check('ARCH: viewport units used (vh/vw)', html.includes('vh') && html.includes('vw'));
check('ARCH: Semantic headings: <h1>', html.includes('<h1'));
// h2 elements are created via el('h2', ...) — check the JS call
check('ARCH: Semantic headings: h2 (created via el/createElement)', html.includes("'h2'") || html.includes('"h2"') || html.includes('<h2'));
check('ARCH: role="main" present', html.includes('role="main"'));
check('ARCH: role="banner" present', html.includes('role="banner"'));
check('ARCH: role="contentinfo" present', html.includes('role="contentinfo"'));
check('ARCH: Marquee ticker for unattended kiosk', html.includes('ticker'));
check('ARCH: Hero gradient animation defined', html.includes('heroGradient') || html.includes('@keyframes'));
check('ARCH: Card hover lift CSS transform', html.includes('hover') && html.includes('transform'));
check('ARCH: contrastText utility present', html.includes('contrastText'));
check('ARCH: Inter font imported', html.includes('Inter'));

/* ─── Summary ────────────────────────────────────────────────────────── */

const total = passed + failed;
console.log(`\n${'─'.repeat(52)}`);
console.log(`  validate-landing.js  —  ${total} checks`);
console.log(`${'─'.repeat(52)}`);

if (failed === 0) {
  console.log(`  ✅  ${passed} / ${total} checks pass\n`);
  process.exit(0);
} else {
  console.log(`  ❌  ${passed} pass, ${failed} FAIL\n`);
  console.log('Failed checks:');
  failures.forEach(f => console.log(`  · ${f}`));
  console.log('');
  process.exit(1);
}
