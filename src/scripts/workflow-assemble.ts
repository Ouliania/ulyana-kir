/**
 * WorkFlow block — simplified "site assembles from parts" loop.
 * Autoplays and repeats: parts fly into browser slots, hold, then reset.
 */
import { gsap } from 'gsap';

type PartName = 'hero' | 'lines' | 'cta' | 'mid' | 'foot';

const PART_NAMES: PartName[] = ['hero', 'lines', 'cta', 'mid', 'foot'];

type Parts = Record<PartName, HTMLElement | null> & {
  slots: Record<PartName, HTMLElement | null>;
};

type SceneState = {
  scene: HTMLElement;
  assemble: gsap.core.Timeline | null;
  loop: gsap.core.Timeline | null;
  started: boolean;
};

const states = new WeakMap<HTMLElement, SceneState>();

function prefersReduce(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function parts(scene: HTMLElement): Parts {
  const p = {} as Parts;
  PART_NAMES.forEach((name) => {
    (p as any)[name] = scene.querySelector<HTMLElement>(`[data-wf-fly="${name}"]`);
  });
  (p as any).slots = {} as Record<PartName, HTMLElement | null>;
  PART_NAMES.forEach((name) => {
    p.slots[name] = scene.querySelector<HTMLElement>(`[data-wf-slot="${name}"]`);
  });
  return p;
}

function flyList(p: Parts): HTMLElement[] {
  return PART_NAMES.map((n) => p[n]).filter(Boolean) as HTMLElement[];
}

function slotList(p: Parts): HTMLElement[] {
  return PART_NAMES.map((n) => p.slots[n]).filter(Boolean) as HTMLElement[];
}

function setAssembled(scene: HTMLElement, on: boolean): void {
  scene.classList.toggle('is-assembled', on);
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
  gsap.killTweensOf(state.scene.querySelectorAll('[data-wf-fly], [data-wf-slot]'));
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
    x: 0,
    y: 0,
    scale: 1,
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

function buildAssemble(scene: HTMLElement): gsap.core.Timeline {
  const p = parts(scene);
  const tl = gsap.timeline({ paused: true });
  const names: PartName[] = ['hero', 'lines', 'cta', 'mid', 'foot'];
  if (names.some((n) => !p[n] || !p.slots[n])) return tl;

  tl.to({}, { duration: 0.2 });

  names.forEach((name, i) => {
    const fly = p[name] as HTMLElement;
    const slot = p.slots[name];
    const target = dock(fly, slot);
    const dur = 0.3 + i * 0.02;

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
      '+=0.05',
    );
    if (slot) {
      tl.to(
        slot,
        { opacity: 1, scale: 1, duration: dur * 0.9, ease: 'power2.out' },
        '<+=0.08',
      );
    }
    tl.set(fly, { opacity: 0, visibility: 'hidden' });
  });

  tl.call(() => setAssembled(scene, true));
  return tl;
}

function startIdleLoop(state: SceneState): void {
  if (prefersReduce()) return;
  if (state.loop) {
    state.loop.kill();
    state.loop = null;
  }

  const scene = state.scene;
  const p = parts(scene);
  const slots = slotList(p);
  const flies = flyList(p);

  const loop = gsap.timeline({ repeat: -1, repeatDelay: 0.1 });
  loop.to({}, { duration: 1.4 });
  loop.to(slots, {
    opacity: 0,
    scale: 0.96,
    duration: 0.2,
    ease: 'power1.in',
    stagger: 0.02,
  });
  loop.call(() => {
    setAssembled(scene, false);
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
    duration: 0.18,
    stagger: 0.03,
    ease: 'power1.out',
  });
  loop.to({}, { duration: 0.16 });
  loop.call(() => {
    if (state.assemble) state.assemble.kill();
    resetParts(scene);
    state.assemble = buildAssemble(scene);
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
        setAssembled(scene, true);
      },
    },
  );

  state.loop = loop;
}

function begin(state: SceneState): void {
  if (state.started) return;
  if (prefersReduce()) {
    showFinished(state.scene);
    state.started = true;
    return;
  }

  state.started = true;
  killMotion(state);
  resetParts(state.scene);

  requestAnimationFrame(() => {
    state.assemble = buildAssemble(state.scene);
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

function bindScene(scene: HTMLElement): void {
  if (states.has(scene)) return;
  const state: SceneState = {
    scene,
    assemble: null,
    loop: null,
    started: false,
  };
  states.set(scene, state);
  begin(state);
}

export function initWorkFlowAssemble(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-workflow-assemble]').forEach(bindScene);
}
