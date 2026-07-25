/**
 * Services tab1 — parts assemble into square browser.
 * Starts only after services stage is fully on screen (sticky card docked).
 * Then slower autoplay → idle loop while tab1 active.
 */
import { gsap } from 'gsap';

type SceneState = {
  scene: HTMLElement;
  viz: HTMLElement | null;
  stage: HTMLElement | null;
  assemble: gsap.core.Timeline | null;
  loop: gsap.core.Timeline | null;
  observer: MutationObserver | null;
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

/** Sticky services card fills the viewport under the header. */
function isStageFullyOnScreen(stage: HTMLElement | null): boolean {
  if (!stage) return true;
  const r = stage.getBoundingClientRect();
  const h = headerOffset();
  const vh = window.innerHeight;
  return (
    r.top <= h + 10 &&
    r.bottom >= vh - 10 &&
    r.height >= vh - h - 28
  );
}

/** Scrolled back up — card not yet (or no longer) docked. */
function isStageAboveViewport(stage: HTMLElement | null): boolean {
  if (!stage) return false;
  return stage.getBoundingClientRect().top > headerOffset() + 48;
}

function setAssembled(scene: HTMLElement, on: boolean): void {
  scene.classList.toggle('is-assembled', on);
}

function parts(scene: HTMLElement) {
  return {
    hero: scene.querySelector<HTMLElement>('[data-fly="hero"]'),
    lines: scene.querySelector<HTMLElement>('[data-fly="lines"]'),
    cta: scene.querySelector<HTMLElement>('[data-fly="cta"]'),
    mid: scene.querySelector<HTMLElement>('[data-fly="mid"]'),
    foot: scene.querySelector<HTMLElement>('[data-fly="foot"]'),
    banner: scene.querySelector<HTMLElement>('[data-fly="banner"]'),
    slotHero: scene.querySelector<HTMLElement>('[data-slot="hero"]'),
    slotLines: scene.querySelector<HTMLElement>('[data-slot="lines"]'),
    slotCta: scene.querySelector<HTMLElement>('[data-slot="cta"]'),
    slotMid: scene.querySelector<HTMLElement>('[data-slot="mid"]'),
    slotFoot: scene.querySelector<HTMLElement>('[data-slot="foot"]'),
    slotBanner: scene.querySelector<HTMLElement>('[data-slot="banner"]'),
  };
}

function flyList(p: ReturnType<typeof parts>): HTMLElement[] {
  return [p.hero, p.lines, p.cta, p.mid, p.foot, p.banner].filter(Boolean) as HTMLElement[];
}

function slotList(p: ReturnType<typeof parts>): HTMLElement[] {
  return [
    p.slotHero,
    p.slotLines,
    p.slotCta,
    p.slotMid,
    p.slotFoot,
    p.slotBanner,
  ].filter(Boolean) as HTMLElement[];
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
  gsap.killTweensOf(state.scene.querySelectorAll('[data-fly], [data-slot]'));
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
  setAssembled(scene, true);
}

function resetParts(scene: HTMLElement): void {
  const p = parts(scene);
  setAssembled(scene, false);
  gsap.set(slotList(p), { opacity: 0, scale: 0.96 });
  gsap.set(flyList(p), {
    opacity: 1,
    visibility: 'visible',
    clearProps: 'transform',
  });
}

function dock(
  fly: HTMLElement,
  slot: HTMLElement | null,
): { x: number; y: number; scale: number } {
  if (!slot) return { x: 0, y: 0, scale: 0.85 };
  const f = fly.getBoundingClientRect();
  const s = slot.getBoundingClientRect();
  return {
    x: s.left + s.width / 2 - (f.left + f.width / 2),
    y: s.top + s.height / 2 - (f.top + f.height / 2),
    scale: Math.min(s.width / Math.max(f.width, 1), s.height / Math.max(f.height, 1), 1.15),
  };
}

/** One-shot assemble — ~2× faster (~1.8–2s). */
function buildAssemble(scene: HTMLElement): gsap.core.Timeline {
  const p = parts(scene);
  const browser = scene.querySelector<HTMLElement>('.st-browser--sq');
  const tl = gsap.timeline({ paused: true });

  if (!browser || !p.hero || !p.lines || !p.cta || !p.mid || !p.foot || !p.banner) return tl;

  // Beat: floaters visible before first dock
  tl.to({}, { duration: 0.22 });

  const step = (fly: HTMLElement, slot: HTMLElement | null, dur = 0.35): void => {
    const target = dock(fly, slot);
    tl.to(
      fly,
      {
        x: target.x,
        y: target.y,
        scale: target.scale * 0.92,
        opacity: 0.12,
        duration: dur,
        ease: 'power2.out',
      },
      '+=0.06',
    );
    if (slot) {
      tl.to(
        slot,
        { opacity: 1, scale: 1, duration: dur * 0.9, ease: 'power2.out' },
        '<+=0.09',
      );
    }
    tl.set(fly, { opacity: 0, visibility: 'hidden' });
  };

  step(p.hero, p.slotHero, 0.38);
  step(p.lines, p.slotLines, 0.32);
  step(p.cta, p.slotCta, 0.3);
  step(p.mid, p.slotMid, 0.35);
  step(p.foot, p.slotFoot, 0.35);
  step(p.banner, p.slotBanner, 0.32);
  tl.call(() => setAssembled(scene, true));

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
  loop.to({}, { duration: 1.1 });
  loop.to(slots, {
    opacity: 0,
    scale: 0.96,
    duration: 0.22,
    ease: 'power1.in',
    stagger: 0.02,
  });
  loop.call(() => {
    setAssembled(state.scene, false);
    gsap.set(flies, {
      x: 0,
      y: 0,
      scale: 1,
      clearProps: 'transform',
      opacity: 0,
      visibility: 'hidden',
    });
  });
  loop.to(flies, {
    opacity: 1,
    visibility: 'visible',
    duration: 0.2,
    stagger: 0.03,
    ease: 'power1.out',
  });
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
  // Recalc docks after layout settle
  requestAnimationFrame(() => {
    if (!isActive(state.viz, state.scene)) return;
    state.assemble = buildAssemble(state.scene);
    state.mode = 'auto';
    // Insert a short pause so the user absorbs the card layout before parts start flying
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

  const viz =
    scene.closest<HTMLElement>('[data-st-viz]') ||
    scene.closest<HTMLElement>('.st-viz');
  const section = scene.closest('.st-section');
  const stage =
    section?.querySelector<HTMLElement>('[data-st-stage]') ||
    scene.closest<HTMLElement>('[data-st-stage]');

  const state: SceneState = {
    scene,
    viz,
    stage,
    assemble: null,
    loop: null,
    observer: null,
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
    state.observer = new MutationObserver(sync);
    state.observer.observe(viz, { attributes: true, attributeFilter: ['class'] });
  }

  sync();
}

export function initLandingAssemble(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-landing-assemble]').forEach(bindScene);
}
