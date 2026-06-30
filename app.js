/**
 * SlideController — pure logic, no DOM.
 * @module app
 */

export class SlideController {
  /**
   * @param {number} totalSlides  Number of slides (must be >= 1)
   * @param {object} [options]
   * @param {number} [options.autoPlayDelay=5000]  Interval in ms
   */
  constructor(totalSlides, options = {}) {
    if (!Number.isInteger(totalSlides) || totalSlides < 1) {
      throw new RangeError('totalSlides must be a positive integer');
    }
    this.totalSlides = totalSlides;
    this.currentIndex = 0;
    this.autoPlayDelay = typeof options.autoPlayDelay === 'number' ? options.autoPlayDelay : 5000;
    /** @type {Map<string, Set<Function>>} */
    this._listeners = new Map();
    this._autoPlayTimer = null;
  }

  /** Move to next slide (wraps around). */
  next() {
    this.goTo((this.currentIndex + 1) % this.totalSlides);
  }

  /** Move to previous slide (wraps around). */
  prev() {
    this.goTo((this.currentIndex - 1 + this.totalSlides) % this.totalSlides);
  }

  /**
   * Jump to a specific index.
   * @param {number} index
   */
  goTo(index) {
    if (!Number.isInteger(index) || index < 0 || index >= this.totalSlides) {
      throw new RangeError(`index must be 0–${this.totalSlides - 1}, got ${index}`);
    }
    const from = this.currentIndex;
    this.currentIndex = index;
    this._emit('change', { from, to: index });
  }

  /**
   * Register an event listener.
   * @param {'change'|'autoplay'} event
   * @param {Function} fn
   * @returns {Function}  Unsubscribe function
   */
  on(event, fn) {
    if (!this._listeners.has(event)) this._listeners.set(event, new Set());
    this._listeners.get(event).add(fn);
    return () => this.off(event, fn);
  }

  /**
   * Remove an event listener.
   * @param {string} event
   * @param {Function} fn
   */
  off(event, fn) {
    this._listeners.get(event)?.delete(fn);
  }

  /**
   * Start auto-play.  No-op if already running.
   * @param {number} [delay]  Override autoPlayDelay
   */
  startAutoPlay(delay) {
    if (this._autoPlayTimer !== null) return; // already running
    const ms = typeof delay === 'number' ? delay : this.autoPlayDelay;
    this._autoPlayTimer = setInterval(() => this.next(), ms);
    this._emit('autoplay', { active: true });
  }

  /** Stop auto-play. */
  stopAutoPlay() {
    if (this._autoPlayTimer !== null) {
      clearInterval(this._autoPlayTimer);
      this._autoPlayTimer = null;
      this._emit('autoplay', { active: false });
    }
  }

  /** @returns {boolean} */
  isAutoPlaying() {
    return this._autoPlayTimer !== null;
  }

  /** Tear down timers and listeners. */
  destroy() {
    this.stopAutoPlay();
    this._listeners.clear();
  }

  // ── private ──────────────────────────────────────────────────────────────

  _emit(event, data) {
    this._listeners.get(event)?.forEach(fn => fn(data));
  }
}
