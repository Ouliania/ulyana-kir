/**
 * Orbit Flow — orbiting icons around hub, scroll-driven collapse, browser reveal.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface OrbitNode {
  el: HTMLElement;
  angle: number;
  radius: number;
  speed: number;
}

interface OrbitContext {
  container: HTMLElement;
  svg: SVGSVGElement;
  hub: HTMLElement;
  nodes: OrbitNode[];
  out: HTMLElement;
  running: boolean;
  progress: number; // 0 = full orbit, 1 = collapsed
  rafId: number;
}

const BASE_SPEED = 0.35; // radians per second
const SPEED_SPREAD = 0.18;

function edgeCenter(
  container: DOMRect,
  el: HTMLElement
): { x: number; y: number } {
  const r = el.getBoundingClientRect();
  return {
    x: r.left - container.left + r.width / 2,
    y: r.top - container.top + r.height / 2,
  };
}

function smoothPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): string {
  const dx = x2 - x1;
  const c1x = x1 + dx * 0.45;
  const c2x = x1 + dx * 0.55;
  return `M ${x1.toFixed(1)},${y1.toFixed(1)} C ${c1x.toFixed(1)},${y1.toFixed(1)} ${c2x.toFixed(1)},${y2.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`;
}

function drawBeams(ctx: OrbitContext): void {
  const box = ctx.container.getBoundingClientRect();
  if (box.width < 8 || box.height < 8) return;

  ctx.svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
  ctx.svg.setAttribute('width', String(box.width));
  ctx.svg.setAttribute('height', String(box.height));

  const hubCenter = edgeCenter(box, ctx.hub);
  let html = '';

  ctx.nodes.forEach((n, i) => {
    const center = edgeCenter(box, n.el);
    const d = smoothPath(center.x, center.y, hubCenter.x, hubCenter.y);

    html += `<path class="flow-path-base" d="${d}" fill="none" />`;
    const delay = (i % 5) * 0.28;
    html += `<path class="flow-path-beam" d="${d}" fill="none" style="animation-delay:${delay}s" />`;
  });

  ctx.svg.innerHTML = html;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    ctx.svg.querySelectorAll('.flow-path-beam').forEach((p) => {
      (p as SVGElement).style.animation = 'none';
      (p as SVGElement).style.strokeDasharray = 'none';
      (p as SVGElement).style.strokeOpacity = '0.45';
    });
  }
}

function positionNodes(
  ctx: OrbitContext,
  t: number // elapsed seconds for continuous rotation
): void {
  ctx.nodes.forEach((n) => {
    const angle = n.angle + t * n.speed;
    const r = n.radius * (1 - ctx.progress);
    const cx = r * Math.cos(angle);
    const cy = r * Math.sin(angle);
    n.el.style.setProperty('--ox', `calc(50% + ${cx}px)`);
    n.el.style.setProperty('--oy', `calc(50% + ${cy}px)`);
  });
}

export function initOrbitFlow(root: ParentNode = document): void {
  const containers = root.querySelectorAll<HTMLElement>('[data-orbit]');
  if (containers.length === 0) return;

  containers.forEach((container) => {
    const svg = container.querySelector<SVGSVGElement>('.orbit-svg');
    const hub = container.querySelector<HTMLElement>('[data-orbit-hub]');
    const nodeEls = [
      ...container.querySelectorAll<HTMLElement>('[data-orbit-node]'),
    ];
    const out = container.querySelector<HTMLElement>('[data-orbit-out]');

    if (!svg || !hub || nodeEls.length === 0 || !out) return;

    // Distribute angles evenly with staggered radii for visual depth
    const count = nodeEls.length;
    const nodes: OrbitNode[] = nodeEls.map((el, i) => ({
      el,
      angle: (i / count) * Math.PI * 2 - Math.PI / 2, // start from top
      radius: 110 + (i % 3) * 18, // staggered radii
      speed: BASE_SPEED + (i - Math.floor(count / 2)) * SPEED_SPREAD * 0.15,
    }));

    const ctx: OrbitContext = {
      container,
      svg,
      hub,
      nodes,
      out,
      running: true,
      progress: 0,
      rafId: 0,
    };

    // Store ctx on element for ScrollTrigger callbacks
    (container as any).__orbitCtx = ctx;

    let lastTime = performance.now();

    function frame(now: number) {
      if (!ctx.running) return;
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      // Continuous rotation — only when not fully collapsed
      const t =
        ctx.progress >= 1 ? ctx.nodes[0].angle / ctx.nodes[0].speed : now / 1000 + 0;
      // Use elapsed for consistent rotation even during collapse
      const elapsed = now / 1000;

      positionNodes(ctx, elapsed);
      drawBeams(ctx);

      ctx.rafId = requestAnimationFrame(frame);
    }

    // Initial draw
    lastTime = performance.now();
    positionNodes(ctx, 0);
    requestAnimationFrame(() => {
      drawBeams(ctx);
      lastTime = performance.now();
      ctx.rafId = requestAnimationFrame(frame);
    });

    // ResizeObserver for beam redraw
    const ro = new ResizeObserver(() => drawBeams(ctx));
    ro.observe(container);

    // ScrollTrigger — collapse orbit + reveal browser
    ScrollTrigger.create({
      trigger: container,
      start: 'top 75%',
      end: 'bottom 35%',
      onUpdate(self) {
        ctx.progress = self.progress;

        // Fade browser in during last 30% of scroll
        const browserProgress = Math.max(
          0,
          (self.progress - 0.7) / 0.3
        );
        gsap.set(ctx.out, { opacity: browserProgress });
      },
      onLeaveBack() {
        ctx.progress = 0;
        gsap.set(ctx.out, { opacity: 0 });
      },
    });

    // Reduced motion
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduce.matches) {
      ctx.nodes.forEach((n) => {
        n.speed = 0;
        n.el.style.setProperty('--ox', `calc(50% + ${Math.cos(n.angle) * n.radius}px)`);
        n.el.style.setProperty('--oy', `calc(50% + ${Math.sin(n.angle) * n.radius}px)`);
      });
      gsap.set(ctx.out, { opacity: 1 });
      ctx.running = false;
    }
  });
}
