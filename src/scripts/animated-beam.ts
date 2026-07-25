/**
 * Vanilla AnimatedBeam — clean edge-to-edge paths between flow nodes.
 */

type Pair = { from: HTMLElement; to: HTMLElement };

function edgePoint(
  container: DOMRect,
  el: HTMLElement,
  side: 'left' | 'right' | 'center'
) {
  const r = el.getBoundingClientRect();
  const y = r.top - container.top + r.height / 2;
  if (side === 'left') return { x: r.left - container.left, y };
  if (side === 'right') return { x: r.right - container.left, y };
  return { x: r.left - container.left + r.width / 2, y };
}

/** Smooth cubic: mostly horizontal travel, gentle vertical ease */
function smoothPath(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  const c1x = x1 + dx * 0.45;
  const c2x = x1 + dx * 0.55;
  return `M ${x1.toFixed(1)},${y1.toFixed(1)} C ${c1x.toFixed(1)},${y1.toFixed(1)} ${c2x.toFixed(1)},${y2.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`;
}

export function initWorkFlowBeams(root: ParentNode = document): void {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  root.querySelectorAll<HTMLElement>('[data-flow]').forEach((container) => {
    const svg = container.querySelector<SVGSVGElement>('.flow-svg');
    if (!svg) return;

    const hub = container.querySelector<HTMLElement>('[data-flow-hub]');
    const inputs = [...container.querySelectorAll<HTMLElement>('[data-flow-from]')];
    const outputs = [...container.querySelectorAll<HTMLElement>('[data-flow-to]')];
    if (!hub || !inputs.length || !outputs.length) return;

    const draw = () => {
      const box = container.getBoundingClientRect();
      if (box.width < 8 || box.height < 8) return;

      svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
      svg.setAttribute('width', String(box.width));
      svg.setAttribute('height', String(box.height));

      const vertical = box.width < 700;
      let html = '';
      let i = 0;

      // Hub center = intersection point for all beams
      const hubCenter = edgePoint(box, hub, 'center');

      inputs.forEach((from) => {
        const start = vertical
          ? {
              x: from.getBoundingClientRect().left - box.left + from.offsetWidth / 2,
              y: from.getBoundingClientRect().bottom - box.top,
            }
          : edgePoint(box, from, 'right');
        const end = vertical
          ? {
              x: hubCenter.x,
              y: hub.getBoundingClientRect().top - box.top,
            }
          : hubCenter;
        const d = smoothPath(start.x, start.y, end.x, end.y);
        const delay = (i++ % 5) * 0.28;
        html += `<path class="flow-path-base" d="${d}" fill="none" /><path class="flow-path-beam" d="${d}" fill="none" style="animation-delay:${delay}s" />`;
      });

      outputs.forEach((to) => {
        const start = vertical
          ? {
              x: hubCenter.x,
              y: hub.getBoundingClientRect().bottom - box.top,
            }
          : hubCenter;
        const end = vertical
          ? {
              x: to.getBoundingClientRect().left - box.left + to.offsetWidth / 2,
              y: to.getBoundingClientRect().top - box.top,
            }
          : edgePoint(box, to, 'left');
        const d = smoothPath(start.x, start.y, end.x, end.y);
        const delay = (i++ % 5) * 0.28;
        html += `<path class="flow-path-base" d="${d}" fill="none" /><path class="flow-path-beam" d="${d}" fill="none" style="animation-delay:${delay}s" />`;
      });

      svg.innerHTML = html;

      if (reduce) {
        svg.querySelectorAll('.flow-path-beam').forEach((p) => {
          (p as SVGElement).style.animation = 'none';
          (p as SVGElement).style.strokeDasharray = 'none';
          (p as SVGElement).style.strokeOpacity = '0.45';
        });
      }
    };

    draw();
    requestAnimationFrame(() => requestAnimationFrame(draw));
    const ro = new ResizeObserver(() => draw());
    ro.observe(container);
    window.addEventListener('load', draw, { once: true });
  });
}
