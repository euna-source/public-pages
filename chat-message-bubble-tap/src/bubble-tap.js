import { SPEC } from './config.js';
import { choosePair } from './reaction.js';

/** Standalone renderer. State, API calls and typography stay with the host app. */
export class BubbleTapEffect {
  constructor(layer, { motion = SPEC.motion, pool = SPEC.emoji.pool, random = Math.random } = {}) {
    this.layer = layer;
    this.motion = motion;
    this.pool = pool;
    this.random = random;
    this.particles = [];
    this.timers = new Set();
    this.frame = null;
    this.destroyed = false;
    this.reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    this.tick = this.tick.bind(this);
  }

  play({ clientX, clientY }) {
    if (this.destroyed) return [];
    const glyphs = choosePair(this.pool, this.random);
    const bounds = this.layer.getBoundingClientRect();
    const sx = bounds.width / this.layer.clientWidth || 1;
    const sy = bounds.height / this.layer.clientHeight || 1;
    const x = (clientX - bounds.left) / sx;
    const y = (clientY - bounds.top) / sy;
    // Capture this reaction's pair before scheduling, so rapid taps remain independent.
    glyphs.forEach((glyph, index) => {
      const timer = setTimeout(() => {
        this.timers.delete(timer);
        if (this.destroyed) return;
        const m = this.motion, rand = this.random;
        const size = m.sizeRange[0] + rand() * (m.sizeRange[1] - m.sizeRange[0]);
        const el = document.createElement('span');
        el.className = 'th';
        el.textContent = glyph;
        el.style.fontSize = `${size}px`;
        this.layer.append(el);
        this.particles.push({ el, x: x - size / 2, y: y - size / 2,
          vx: (rand() * 2 - 1) * m.sideVelocity,
          vy: -m.upVelocity * (m.upRandomFactor[0] + rand() * (m.upRandomFactor[1] - m.upRandomFactor[0])),
          r: (rand() * 2 - 1) * m.initialRotation,
          vr: (rand() * 2 - 1) * m.rotationVelocity,
          t: 0, reduced: this.reducedMotion.matches });
        if (this.frame === null) {
          this.lastTime = performance.now();
          this.frame = requestAnimationFrame(this.tick);
        }
      }, index * this.motion.spawnIntervalMs);
      this.timers.add(timer);
    });
    return glyphs;
  }

  tick(now) {
    const m = this.motion;
    const dt = Math.min(m.dtClampSec, (now - this.lastTime) / 1000);
    this.lastTime = now;
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.t += dt;
      if (p.reduced) {
        p.el.style.transform = `translate(${p.x}px,${p.y}px)`;
        p.el.style.opacity = String(Math.max(0, 1 - p.t / m.reducedMotionDurationSec));
      } else {
        p.vy += m.gravity * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.vr * dt;
        const k = p.t / m.popDurationSec;
        const scale = k >= 1 ? 1 : k < .6 ? k / .6 * m.peakScale : m.peakScale - (k - .6) / .4 * (m.peakScale - 1);
        p.el.style.transform = `translate(${p.x}px,${p.y}px) rotate(${p.r}deg) scale(${scale})`;
      }
      if ((p.reduced && p.t >= m.reducedMotionDurationSec) || (!p.reduced && p.y > this.layer.clientHeight + m.removeBelow)) {
        p.el.remove(); this.particles.splice(i, 1);
      }
    }
    this.frame = this.particles.length ? requestAnimationFrame(this.tick) : null;
  }

  clear() {
    for (const timer of this.timers) clearTimeout(timer);
    this.timers.clear();
    if (this.frame !== null) cancelAnimationFrame(this.frame);
    this.frame = null;
    for (const p of this.particles) p.el.remove();
    this.particles = [];
  }

  destroy() { this.clear(); this.destroyed = true; }
}

/** Pointer input requires two consecutive taps; keyboard activation stays accessible. */
export function bindBubbleTap(button, { effect, react, onAccepted = () => {}, onHaptic = () => {}, onRejected = () => {}, onError = () => {} }) {
  let pending = false, disposed = false;
  async function activate(event) {
    if (pending || disposed || button.disabled) return;
    pending = true;
    const bounds = button.getBoundingClientRect();
    const point = event.detail === 0
      ? { clientX: bounds.left + bounds.width / 2, clientY: bounds.top + bounds.height / 2 }
      : { clientX: event.clientX, clientY: event.clientY };
    try {
      const result = await react();
      if (disposed) return;
      if (!result.accepted) { onRejected(result); return; }
      onAccepted(result);
      effect.play(point);
      // Unsupported haptics must never break the accepted visual reaction.
      try { onHaptic(); } catch { /* Optional platform feedback. */ }
    } catch (error) { if (!disposed) onError(error); }
    finally { pending = false; }
  }
  let firstTap = null;
  const resetTap = () => { firstTap = null; };
  const resetOutside = event => { if (!button.contains(event.target)) resetTap(); };
  function handleClick(event) {
    if (pending || disposed || button.disabled) { resetTap(); return; }
    // Keyboard and assistive technology produce clicks with detail 0.
    if (event.detail === 0) { resetTap(); activate(event); return; }
    const tap = { time: event.timeStamp, x: event.clientX, y: event.clientY };
    if (firstTap && tap.time - firstTap.time <= SPEC.interaction.doubleTapWindowMs
        && Math.hypot(tap.x - firstTap.x, tap.y - firstTap.y) <= SPEC.interaction.doubleTapMaxDistancePx) {
      resetTap(); activate(event);
    } else { firstTap = tap; }
  }
  button.addEventListener('click', handleClick);
  button.addEventListener('demo-reset', resetTap);
  document.addEventListener('pointerdown', resetOutside, true);
  document.addEventListener('pointercancel', resetTap, true);
  document.addEventListener('scroll', resetTap, true);
  window.addEventListener('blur', resetTap);
  return () => {
    disposed = true; resetTap();
    button.removeEventListener('click', handleClick);
    button.removeEventListener('demo-reset', resetTap);
    document.removeEventListener('pointerdown', resetOutside, true);
    document.removeEventListener('pointercancel', resetTap, true);
    document.removeEventListener('scroll', resetTap, true);
    window.removeEventListener('blur', resetTap);
  };
}
