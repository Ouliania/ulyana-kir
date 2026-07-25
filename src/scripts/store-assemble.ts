/**
 * Services tab4 — store assembles (tab1 fly/dock pattern, 4 parts: hero/lines/mid/cta),
 * then a short run of live "sale" toast notifications ticks the cart badge up.
 * Starts only after services stage is fully on screen. Then autoplay loop while tab4 active.
 */
import { gsap } from 'gsap';

type SceneState = {
  scene: HTMLElement;
  viz: HTMLElement | null;
  stage: HTMLElement | null;
  assemble: gsap.core.Timeline | null;
  loop: gsap.core.Timeline | null;
  onScroll: (() => void) | null;
  started: boolean;
  mode: 'off' | 'waiting' | 'auto';
};

const states = new WeakMap<HTMLElement, SceneState>();

function prefersReduce(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function headerOffset(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--header-height').trim();
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : 72;
}

function isActive(viz: HTMLElement | null, scene: HTMLElement): boolean {
  if (viz) return viz.classList.contains('active');
  return scene.closest('.st-viz')?.classList.contains('active') ?? true;
}

function isStageFullyOnScreen(stage: HTMLElement | null): boolean {
  if (!stage) return true;
  const r = stage.getBoundingClientRect();
  const h = headerOffset();
  const vh = window.innerHeight;
  return r.top <= h + 10 && r.bottom >= vh - 10 && r.height >= vh - h - 28;
}

function isStageAboveViewport(stage: HTMLElement | null): boolean {
  if (!stage) return false;
  return stage.getBoundingClientRect().top > headerOffset() + 48;
}

function setAssembled(scene: HTMLElement, on: boolean): void {
  scene.classList.toggle('is-assembled', on);
}

function parts(scene: HTMLElement) {
  return {
    hero: scene.querySelector<HTMLElement>('[data-shop-fly="hero"]'),
    lines: scene.querySelector<HTMLElement>('[data-shop-fly="lines"]'),
    mid: scene.querySelector<HTMLElement>('[data-shop-fly="mid"]'),
    cta: scene.querySelector<HTMLElement>('[data-shop-fly="cta"]'),
    slotHero: scene.querySelector<HTMLElement>('[data-shop-slot="hero"]'),
    slotLines: scene.querySelector<HTMLElement>('[data-shop-slot="lines"]'),
    slotMid: scene.querySelector<HTMLElement>('[data-shop-slot="mid"]'),
    slotCta: scene.querySelector<HTMLElement>('[data-shop-slot="cta"]'),
  };
}

function flyList(p: ReturnType<typeof parts>): HTMLElement[] {
  return [p.hero, p.lines, p.mid, p.cta].filter(Boolean) as HTMLElement[];
}

function slotList(p: ReturnType<typeof parts>): HTMLElement[] {
  return [p.slotHero, p.slotLines, p.slotMid, p.slotCta].filter(Boolean) as HTMLElement[];
}

function badgeOf(scene: HTMLElement): HTMLElement | null {
  return scene.querySelector<HTMLElement>('[data-shop-badge]');
}

function toastsOf(scene: HTMLElement): HTMLElement[] {
  return [...scene.querySelectorAll<HTMLElement>('[data-shop-toast]')];
}

function setBadge(scene: HTMLElement, n: number): void {
  const badge = badgeOf(scene);
  if (badge) badge.textContent = String(n);
}

function killMotion(state: SceneState): void {
  if (state.loop) {
    state.loop.kill();
    state.loop = null;
  }
  if (state.assemble) {
    state.assemble.kill();
    state.assemble = null;
  }
  gsap.killTweensOf(state.scene.querySelectorAll('[data-shop-fly], [data-shop-slot], [data-shop-toast]'));
}

function killAll(state: SceneState): void {
  killMotion(state);
  if (state.onScroll) {
    window.removeEventListener('scroll', state.onScroll);
    state.onScroll = null;
  }
  state.started = false;
}

function showFinished(scene: HTMLElement): void {
  const p = parts(scene);
  gsap.set(flyList(p), { opacity: 0, visibility: 'hidden', clearProps: 'transform' });
  gsap.set(slotList(p), { opacity: 1, clearProps: 'transform' });
  gsap.set(toastsOf(scene), { opacity: 0, visibility: 'hidden', clearProps: 'transform' });
  setBadge(scene, toastsOf(scene).length);
  setAssembled(scene, true);
}

function resetParts(scene: HTMLElement): void {
  const p = parts(scene);
  setAssembled(scene, false);
  gsap.set(slotList(p), { opacity: 0, scale: 0.96 });
  gsap.set(flyList(p), { opacity: 1, visibility: 'visible', clearProps: 'transform' });
  gsap.set(toastsOf(scene), { opacity: 0, visibility: 'hidden', clearProps: 'transform' });
  setBadge(scene, 0);
}

function dock(fly: HTMLElement, slot: HTMLElement | null): { x: number; y: number; scale: number } {
  if (!slot) return { x: 0, y: 0, scale: 0.85 };
  const f = fly.getBoundingClientRect();
  const s = slot.getBoundingClientRect();
  return {
    x: s.left + s.width / 2 - (f.left + f.width / 2),
    y: s.top + s.height / 2 - (f.top + f.height / 2),
    scale: Math.min(s.width / Math.max(f.width, 1), s.height / Math.max(f.height, 1), 1.15),
  };
}

/** One-shot assemble — same rhythm as tab1, minus foot/banner. */
function buildAssemble(scene: HTMLElement): gsap.core.Timeline {
  const p = parts(scene);
  const tl = gsap.timeline({ paused: true });

  if (!p.hero || !p.lines || !p.mid || !p.cta) return tl;

  tl.to({}, { duration: 0.22 });

  const step = (fly: HTMLElement, slot: HTMLElement | null, dur = 0.35): void => {
    const target = dock(fly, slot);
    tl.to(
      fly,
      { x: target.x, y: target.y, scale: target.scale * 0.92, opacity: 0.12, duration: dur, ease: 'power2.out' },
      '+=0.06',
    );
    if (slot) {
      tl.to(slot, { opacity: 1, scale: 1, duration: dur * 0.9, ease: 'power2.out' }, '<+=0.09');
    }
    tl.set(fly, { opacity: 0, visibility: 'hidden' });
  };

  step(p.hero, p.slotHero, 0.38);
  step(p.lines, p.slotLines, 0.32);
  step(p.mid, p.slotMid, 0.35);
  step(p.cta, p.slotCta, 0.3);
  tl.call(() => setAssembled(scene, true));

  return tl;
}

/** After assembly: sale notifications dock into the stack one by one and
 * stay put (they don't replace each other) while the cart badge ticks up. */
function buildSellSequence(scene: HTMLElement): gsap.core.Timeline {
  const toasts = toastsOf(scene);
  const tl = gsap.timeline();

  tl.to({}, { duration: 0.25 });

  toasts.forEach((toast, i) => {
    tl.call(() => setBadge(scene, i + 1));
    tl.to(toast, { opacity: 1, visibility: 'visible', y: 0, duration: 0.2, ease: 'power2.out' }, '+=0.32');
  });

  tl.to({}, { duration: 0.9 });

  return tl;
}

function startIdleLoop(state: SceneState): void {
  if (prefersReduce()) return;
  if (state.loop) {
    state.loop.kill();
    state.loop = null;
  }

  const p = parts(state.scene);
  const slots = slotList(p);
  const flies = flyList(p);

  const loop = gsap.timeline({ repeat: -1, repeatDelay: 0.1 });
  loop.add(buildSellSequence(state.scene));
  loop.to({}, { duration: 0.5 });
  loop.to(slots, { opacity: 0, scale: 0.96, duration: 0.22, ease: 'power1.in', stagger: 0.02 });
  loop.call(() => {
    setAssembled(state.scene, false);
    gsap.set(flies, { x: 0, y: 0, scale: 1, clearProps: 'transform', opacity: 0, visibility: 'hidden' });
    gsap.set(toastsOf(state.scene), { opacity: 0, visibility: 'hidden', clearProps: 'transform' });
    setBadge(state.scene, 0);
  });
  loop.to(flies, { opacity: 1, visibility: 'visible', duration: 0.2, stagger: 0.03, ease: 'power1.out' });
  loop.to({}, { duration: 0.18 });
  loop.call(() => {
    if (state.assemble) state.assemble.kill();
    resetParts(state.scene);
    state.assemble = buildAssemble(state.scene);
  });
  loop.to(
    {},
    {
      duration: 2.1,
      ease: 'none',
      onUpdate: function () {
        if (!state.assemble) return;
        state.assemble.progress(this.progress());
      },
      onComplete: () => {
        if (state.assemble) state.assemble.progress(1);
        setAssembled(state.scene, true);
      },
    },
  );

  state.loop = loop;
  state.mode = 'auto';
}

function beginAssemble(state: SceneState): void {
  if (state.started || !isActive(state.viz, state.scene)) return;
  if (prefersReduce()) {
    showFinished(state.scene);
    state.started = true;
    return;
  }

  state.started = true;
  killMotion(state);
  resetParts(state.scene);
  requestAnimationFrame(() => {
    if (!isActive(state.viz, state.scene)) return;
    state.assemble = buildAssemble(state.scene);
    state.mode = 'auto';
    state.assemble.to({}, { duration: 0.8 }, 0);
    gsap.to(state.assemble, {
      progress: 1,
      duration: state.assemble.duration(),
      ease: 'none',
      onComplete: () => {
        setAssembled(state.scene, true);
        startIdleLoop(state);
      },
    });
  });
}

function onScrollGate(state: SceneState): void {
  if (!isActive(state.viz, state.scene) || prefersReduce()) return;

  if (isStageAboveViewport(state.stage)) {
    if (state.started || state.mode === 'auto') {
      killMotion(state);
      state.started = false;
      state.mode = 'waiting';
      resetParts(state.scene);
    }
    return;
  }

  if (!state.started && isStageFullyOnScreen(state.stage)) {
    beginAssemble(state);
  }
}

function armGate(state: SceneState): void {
  if (state.onScroll) {
    window.removeEventListener('scroll', state.onScroll);
    state.onScroll = null;
  }

  state.mode = 'waiting';
  state.started = false;
  resetParts(state.scene);

  state.onScroll = () => onScrollGate(state);
  window.addEventListener('scroll', state.onScroll, { passive: true });
  onScrollGate(state);
}

function play(state: SceneState): void {
  killAll(state);
  if (prefersReduce()) {
    showFinished(state.scene);
    state.mode = 'off';
    return;
  }

  requestAnimationFrame(() => {
    if (!isActive(state.viz, state.scene)) return;
    armGate(state);
  });
}

function stop(state: SceneState): void {
  killAll(state);
  state.mode = 'off';
  showFinished(state.scene);
}

function bindScene(scene: HTMLElement): void {
  if (states.has(scene)) return;

  const viz = scene.closest<HTMLElement>('[data-st-viz]') || scene.closest<HTMLElement>('.st-viz');
  const section = scene.closest('.st-section');
  const stage =
    section?.querySelector<HTMLElement>('[data-st-stage]') || scene.closest<HTMLElement>('[data-st-stage]');

  const state: SceneState = {
    scene,
    viz,
    stage,
    assemble: null,
    loop: null,
    onScroll: null,
    started: false,
    mode: 'off',
  };
  states.set(scene, state);

  const sync = (): void => {
    if (isActive(viz, scene)) play(state);
    else stop(state);
  };

  if (viz) {
    const observer = new MutationObserver(sync);
    observer.observe(viz, { attributes: true, attributeFilter: ['class'] });
  }

  sync();
}

export function initStoreAssemble(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-shop-assemble]').forEach(bindScene);
}
