/**
 * Services tab2 — 9 depth steps highlight in sequence; bars grow each step.
 * Starts only after services stage is fully on screen.
 */
import { gsap } from 'gsap';

type SceneState = {
  scene: HTMLElement;
  viz: HTMLElement | null;
  stage: HTMLElement | null;
  tl: gsap.core.Timeline | null;
  observer: MutationObserver | null;
  onScroll: (() => void) | null;
  started: boolean;
  mode: 'off' | 'waiting' | 'auto';
};

const states = new WeakMap<HTMLElement, SceneState>();

/** 9 levels × 6 bars — monotonic “readiness” growth */
const BAR_LEVELS: number[][] = [
  [14, 18, 12, 16, 20, 15],
  [20, 26, 18, 24, 28, 22],
  [26, 34, 24, 32, 36, 28],
  [32, 42, 30, 40, 44, 36],
  [40, 50, 38, 48, 54, 44],
  [48, 58, 46, 56, 64, 52],
  [56, 68, 54, 66, 74, 60],
  [66, 78, 64, 76, 84, 70],
  [78, 90, 74, 88, 96, 82],
];

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

function stepsOf(scene: HTMLElement): HTMLElement[] {
  return [...scene.querySelectorAll<HTMLElement>('[data-deep-step]')];
}

function barsOf(scene: HTMLElement): HTMLElement[] {
  return [...scene.querySelectorAll<HTMLElement>('[data-deep-bar]')];
}

function setStepState(steps: HTMLElement[], activeIdx: number, allLit: boolean): void {
  steps.forEach((el, i) => {
    el.classList.toggle('is-active', !allLit && i === activeIdx);
    el.classList.toggle('is-done', allLit || i < activeIdx);
  });
}

function setBarHeights(bars: HTMLElement[], level: number, immediate = false): void {
  const heights = BAR_LEVELS[Math.max(0, Math.min(level, BAR_LEVELS.length - 1))];
  bars.forEach((bar, i) => {
    const h = `${heights[i] ?? 20}%`;
    if (immediate) {
      gsap.set(bar, { height: h });
    } else {
      gsap.to(bar, { height: h, duration: 0.38, ease: 'power2.out' });
    }
  });
}

function killMotion(state: SceneState): void {
  if (state.tl) {
    state.tl.kill();
    state.tl = null;
  }
  gsap.killTweensOf(barsOf(state.scene));
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
  const steps = stepsOf(scene);
  const bars = barsOf(scene);
  setStepState(steps, steps.length - 1, true);
  setBarHeights(bars, BAR_LEVELS.length - 1, true);
}

function resetScene(scene: HTMLElement): void {
  const steps = stepsOf(scene);
  const bars = barsOf(scene);
  steps.forEach((el) => {
    el.classList.remove('is-active', 'is-done');
  });
  setBarHeights(bars, 0, true);
}

function buildLoop(scene: HTMLElement): gsap.core.Timeline {
  const steps = stepsOf(scene);
  const bars = barsOf(scene);
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.15 });

  tl.call(() => resetScene(scene));
  tl.to({}, { duration: 0.2 });

  for (let i = 0; i < steps.length; i++) {
    tl.call(() => {
      setStepState(steps, i, false);
      setBarHeights(bars, i, false);
    });
    tl.to({}, { duration: 0.4 });
  }

  // All lit + peak bars
  tl.call(() => {
    setStepState(steps, steps.length - 1, true);
    setBarHeights(bars, BAR_LEVELS.length - 1, false);
  });
  tl.to({}, { duration: 1.05 });

  // Soft fade toward reset
  tl.to(steps, {
    opacity: 0.35,
    duration: 0.28,
    ease: 'power1.in',
    stagger: 0.02,
  });
  tl.call(() => {
    steps.forEach((el) => {
      el.classList.remove('is-active', 'is-done');
      gsap.set(el, { clearProps: 'opacity' });
    });
  });

  return tl;
}

function beginDeep(state: SceneState): void {
  if (state.started || !isActive(state.viz, state.scene)) return;
  if (prefersReduce()) {
    showFinished(state.scene);
    state.started = true;
    return;
  }

  state.started = true;
  killMotion(state);
  resetScene(state.scene);
  state.mode = 'auto';
  state.tl = buildLoop(state.scene);
}

function onScrollGate(state: SceneState): void {
  if (!isActive(state.viz, state.scene) || prefersReduce()) return;

  if (isStageAboveViewport(state.stage)) {
    if (state.started || state.mode === 'auto') {
      killMotion(state);
      state.started = false;
      state.mode = 'waiting';
      resetScene(state.scene);
    }
    return;
  }

  if (!state.started && isStageFullyOnScreen(state.stage)) {
    beginDeep(state);
  }
}

function armGate(state: SceneState): void {
  if (state.onScroll) {
    window.removeEventListener('scroll', state.onScroll);
    state.onScroll = null;
  }

  state.mode = 'waiting';
  state.started = false;
  resetScene(state.scene);

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
    tl: null,
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

export function initDeepAssemble(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-deep-assemble]').forEach(bindScene);
}
