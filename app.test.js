/**
 * Unit tests for SlideController.
 * Run: node --test app.test.js
 */

import { test, describe, beforeEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import { SlideController } from './app.js';

// ── Construction ─────────────────────────────────────────────────────────────

describe('SlideController — construction', () => {
  test('creates with valid totalSlides', () => {
    const c = new SlideController(4);
    assert.equal(c.totalSlides, 4);
    assert.equal(c.currentIndex, 0);
  });

  test('throws RangeError for totalSlides = 0', () => {
    assert.throws(() => new SlideController(0), RangeError);
  });

  test('throws RangeError for negative totalSlides', () => {
    assert.throws(() => new SlideController(-1), RangeError);
  });

  test('throws RangeError for non-integer totalSlides', () => {
    assert.throws(() => new SlideController(2.5), RangeError);
  });

  test('uses default autoPlayDelay of 5000', () => {
    const c = new SlideController(3);
    assert.equal(c.autoPlayDelay, 5000);
  });

  test('accepts custom autoPlayDelay', () => {
    const c = new SlideController(3, { autoPlayDelay: 2000 });
    assert.equal(c.autoPlayDelay, 2000);
  });
});

// ── Navigation ────────────────────────────────────────────────────────────────

describe('SlideController — next / prev / goTo', () => {
  let c;
  beforeEach(() => { c = new SlideController(4); });

  test('next() advances index', () => {
    c.next();
    assert.equal(c.currentIndex, 1);
  });

  test('next() wraps around at end', () => {
    c.goTo(3);
    c.next();
    assert.equal(c.currentIndex, 0);
  });

  test('prev() goes back', () => {
    c.goTo(2);
    c.prev();
    assert.equal(c.currentIndex, 1);
  });

  test('prev() wraps around at start', () => {
    c.prev();
    assert.equal(c.currentIndex, 3);
  });

  test('goTo() sets specific index', () => {
    c.goTo(2);
    assert.equal(c.currentIndex, 2);
  });

  test('goTo() throws for negative index', () => {
    assert.throws(() => c.goTo(-1), RangeError);
  });

  test('goTo() throws for index >= totalSlides', () => {
    assert.throws(() => c.goTo(4), RangeError);
  });

  test('goTo() throws for non-integer index', () => {
    assert.throws(() => c.goTo(1.5), RangeError);
  });
});

// ── Event listeners ───────────────────────────────────────────────────────────

describe('SlideController — on / off / events', () => {
  test('emits change event with from/to on next()', () => {
    const c = new SlideController(3);
    const events = [];
    c.on('change', e => events.push(e));
    c.next();
    assert.deepEqual(events, [{ from: 0, to: 1 }]);
  });

  test('emits change event on prev()', () => {
    const c = new SlideController(3);
    const events = [];
    c.on('change', e => events.push(e));
    c.prev();
    assert.deepEqual(events, [{ from: 0, to: 2 }]);
  });

  test('unsubscribe function removes listener', () => {
    const c = new SlideController(3);
    const calls = [];
    const unsub = c.on('change', e => calls.push(e));
    unsub();
    c.next();
    assert.equal(calls.length, 0);
  });

  test('off() removes listener', () => {
    const c = new SlideController(3);
    const calls = [];
    const fn = e => calls.push(e);
    c.on('change', fn);
    c.off('change', fn);
    c.next();
    assert.equal(calls.length, 0);
  });

  test('multiple listeners on same event all fire', () => {
    const c = new SlideController(3);
    let a = 0, b = 0;
    c.on('change', () => a++);
    c.on('change', () => b++);
    c.next();
    assert.equal(a, 1);
    assert.equal(b, 1);
  });
});

// ── Auto-play ─────────────────────────────────────────────────────────────────

describe('SlideController — autoPlay', () => {
  test('isAutoPlaying() is false initially', () => {
    const c = new SlideController(3);
    assert.equal(c.isAutoPlaying(), false);
  });

  test('isAutoPlaying() is true after startAutoPlay()', (t) => {
    t.mock.timers.enable({ apis: ['setInterval'] });
    const c = new SlideController(3);
    c.startAutoPlay(100);
    assert.equal(c.isAutoPlaying(), true);
    c.destroy();
  });

  test('startAutoPlay() is a no-op when already running', (t) => {
    t.mock.timers.enable({ apis: ['setInterval'] });
    const c = new SlideController(3);
    c.startAutoPlay(100);
    const events = [];
    c.on('autoplay', e => events.push(e));
    c.startAutoPlay(100); // second call — should not emit again
    assert.equal(events.length, 0);
    c.destroy();
  });

  test('stopAutoPlay() sets isAutoPlaying() to false', (t) => {
    t.mock.timers.enable({ apis: ['setInterval'] });
    const c = new SlideController(3);
    c.startAutoPlay(100);
    c.stopAutoPlay();
    assert.equal(c.isAutoPlaying(), false);
  });

  test('auto-play advances slide after interval fires', (t) => {
    t.mock.timers.enable({ apis: ['setInterval'] });
    const c = new SlideController(3);
    c.startAutoPlay(1000);
    t.mock.timers.tick(1000);
    assert.equal(c.currentIndex, 1);
    c.destroy();
  });

  test('auto-play wraps after enough ticks', (t) => {
    t.mock.timers.enable({ apis: ['setInterval'] });
    const c = new SlideController(3);
    c.startAutoPlay(1000);
    t.mock.timers.tick(3000); // 3 ticks → back to 0
    assert.equal(c.currentIndex, 0);
    c.destroy();
  });

  test('emits autoplay event with active:true on start', (t) => {
    t.mock.timers.enable({ apis: ['setInterval'] });
    const c = new SlideController(3);
    const events = [];
    c.on('autoplay', e => events.push(e));
    c.startAutoPlay(100);
    assert.deepEqual(events, [{ active: true }]);
    c.destroy();
  });

  test('emits autoplay event with active:false on stop', (t) => {
    t.mock.timers.enable({ apis: ['setInterval'] });
    const c = new SlideController(3);
    const events = [];
    c.startAutoPlay(100);
    c.on('autoplay', e => events.push(e));
    c.stopAutoPlay();
    assert.deepEqual(events, [{ active: false }]);
  });
});

// ── Destroy ───────────────────────────────────────────────────────────────────

describe('SlideController — destroy', () => {
  test('destroy() stops auto-play', (t) => {
    t.mock.timers.enable({ apis: ['setInterval'] });
    const c = new SlideController(3);
    c.startAutoPlay(100);
    c.destroy();
    assert.equal(c.isAutoPlaying(), false);
  });

  test('destroy() clears all listeners (no events fire after)', (t) => {
    t.mock.timers.enable({ apis: ['setInterval'] });
    const c = new SlideController(3);
    const calls = [];
    c.on('change', e => calls.push(e));
    c.destroy();
    c.next();
    assert.equal(calls.length, 0);
  });
});
