/**
 * Bright thin gradient border flare — case cards only.
 */

const AUTO = ['.case-card', '[data-magic]'].join(', ');

type Tracked = {
  el: HTMLElement;
  rim: HTMLElement;
  tx: number;
  ty: number;
  x: number;
  y: number;
  active: boolean;
};

const tracked = new Map<HTMLElement, Tracked>();
let raf = 0;

const STRIP =
  '.wordmark, .nav-link, .lang-switch, .btn, a.btn, button.btn, .btn-interactive, .bih, .footer-nav a, .contact-link, .code-tab, .glass-card, .pricing-card, .lang-opt';

function ensureRim(el: HTMLElement): HTMLElement {
  let rim = el.querySelector<HTMLElement>(':scope > .magic-rim');
  if (!rim) {
    rim = document.createElement('span');
    rim.className = 'magic-rim';
    rim.setAttribute('aria-hidden', 'true');
    el.prepend(rim);
  }
  el.querySelectorAll(':scope > .magic-orb').forEach((n) => n.remove());
  return rim;
}

function stripMagic(el: HTMLElement) {
  el.classList.remove('magic-surface');
  delete el.dataset.magicBound;
  el.querySelectorAll(':scope > .magic-rim, :scope > .magic-orb').forEach((n) => n.remove());
  tracked.delete(el);
}

function tick() {
  raf = 0;
  tracked.forEach((t) => {
    t.x += (t.tx - t.x) * 0.24;
    t.y += (t.ty - t.y) * 0.24;
    t.el.style.setProperty('--magic-x', `${t.x}px`);
    t.el.style.setProperty('--magic-y', `${t.y}px`);
    t.rim.style.opacity = t.active ? '1' : '0';

    if (t.active || Math.abs(t.tx - t.x) > 0.5 || Math.abs(t.ty - t.y) > 0.5) {
      if (!raf) raf = requestAnimationFrame(tick);
    }
  });
}

function schedule() {
  if (!raf) raf = requestAnimationFrame(tick);
}

function bind(el: HTMLElement) {
  if (el.dataset.magicBound === '1') return;
  if (el.matches(STRIP) || el.closest(STRIP)) return;
  if (!el.matches('.case-card, [data-magic]')) return;

  el.dataset.magicBound = '1';
  el.classList.add('magic-surface');

  const rim = ensureRim(el);
  const rect = el.getBoundingClientRect();
  const t: Tracked = {
    el,
    rim,
    tx: rect.width / 2,
    ty: rect.height / 2,
    x: rect.width / 2,
    y: rect.height / 2,
    active: false,
  };
  tracked.set(el, t);

  const setPos = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    t.tx = e.clientX - r.left;
    t.ty = e.clientY - r.top;
  };

  el.addEventListener('pointerenter', (e) => {
    setPos(e);
    t.x = t.tx;
    t.y = t.ty;
    t.active = true;
    schedule();
  });
  el.addEventListener('pointermove', (e) => {
    setPos(e);
    t.active = true;
    schedule();
  });
  el.addEventListener('pointerleave', () => {
    t.active = false;
    schedule();
  });
}

export function initMagicSurfaces(root: ParentNode = document): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  // Clean leftovers from earlier experiments
  root.querySelectorAll<HTMLElement>(STRIP).forEach(stripMagic);
  root.querySelectorAll<HTMLElement>('.magic-surface').forEach((el) => {
    if (!el.matches('.case-card, [data-magic]')) stripMagic(el);
  });

  root.querySelectorAll<HTMLElement>(AUTO).forEach(bind);
}
