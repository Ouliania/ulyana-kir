/**
 * Services tab3 — redesign story: browser slots morph before→after (dull → teal)
 * one at a time, each paired with a metric counting up. Final slot (foot) = hold
 * with all metrics landed. Starts only after services stage is fully on screen.
 */
import { gsap } from 'gsap';

type SceneState = {
  scene: HTMLElement;
  viz: HTMLElement | null;
  stage: HTMLElement | null;
  tl: gsap.core.Timeline | null;
  onScroll: (() => void) | null;
  started: boolean;
  mode: 'off' | 'waiting' | 'auto';
};

const states = new WeakMap<HTMLElement, SceneState>();

/** Slot index → metric index it drives. Last slot (foot) has no metric — it's the hold beat. */
const SLOT_METRIC = [0, 1, 2, 3];

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

function slotsOf(scene: HTMLElement): HTMLElement[] {
  return [...scene.querySelectorAll<HTMLElement>('[data-conv-slot]')];
}

function metricsOf(scene: HTMLElement): HTMLElement[] {
  return [...scene.querySelectorAll<HTMLElement>('[data-conv-metric]')];
}

function formatValue(fmt: string | null, value: number): string {
  if (fmt === 'x') return `×${value.toFixed(1)}`;
  return `${Math.round(value)}%`;
}

function setMetric(metric: HTMLElement, value: number): void {
  const num = metric.querySelector<HTMLElement>('[data-conv-num]');
  if (!num) return;
  num.textContent = formatValue(metric.dataset.fmt ?? null, value);
}

function metricTarget(metric: HTMLElement): number {
  return Number.parseFloat(metric.dataset.target ?? '0') || 0;
}

/** Starting value before the metric counts — 0 for "gained" metrics, a real baseline for "reduced" ones (e.g. Bounce). */
function metricFrom(metric: HTMLElement): number {
  return Number.parseFloat(metric.dataset.from ?? '0') || 0;
}

function resetScene(scene: HTMLElement): void {
  slotsOf(scene).forEach((slot) => slot.classList.remove('is-active', 'is-after'));
  metricsOf(scene).forEach((metric) => {
    metric.classList.remove('is-active');
    setMetric(metric, metricFrom(metric));
  });
}

function showFinished(scene: HTMLElement): void {
  slotsOf(scene).forEach((slot) => slot.classList.add('is-after'));
  metricsOf(scene).forEach((metric) => setMetric(metric, metricTarget(metric)));
}

function killMotion(state: SceneState): void {
  if (state.tl) {
    state.tl.kill();
    state.tl = null;
  }
}

function killAll(state: SceneState): void {
  killMotion(state);
  if (state.onScroll) {
    window.removeEventListener('scroll', state.onScroll);
    state.onScroll = null;
  }
  state.started = false;
}

function buildLoop(scene: HTMLElement): gsap.core.Timeline {
  const slots = slotsOf(scene);
  const metrics = metricsOf(scene);
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.2 });

  tl.call(() => resetScene(scene));
  tl.to({}, { duration: 0.25 });

  slots.forEach((slot, i) => {
    const metric = metrics[SLOT_METRIC[i]];

    tl.call(() => {
      slot.classList.add('is-active', 'is-after');
      metric?.classList.add('is-active');
    });

    if (metric) {
      const target = metricTarget(metric);
      const proxy = { v: metricFrom(metric) };
      tl.to(
        proxy,
        {
          v: target,
          duration: 0.55,
          ease: 'power2.out',
          onUpdate: () => setMetric(metric, proxy.v),
        },
        '<',
      );
    } else {
      tl.to({}, { duration: 0.4 });
    }

    tl.call(() => slot.classList.remove('is-active'));
    tl.to({}, { duration: 0.22 });
  });

  // Hold — everything landed
  tl.to({}, { duration: 1.1 });

  // Soft fade toward reset
  tl.to(slots, {
    opacity: 0.5,
    duration: 0.28,
    ease: 'power1.in',
    stagger: 0.02,
  });
  tl.call(() => {
    slots.forEach((slot) => gsap.set(slot, { clearProps: 'opacity' }));
  });

  return tl;
}

function beginConv(state: SceneState): void {
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
    beginConv(state);
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

export function initConvAssemble(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-conv-assemble]').forEach(bindScene);
}
