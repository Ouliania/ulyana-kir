import gsap from 'gsap';
import { fireMagicConfetti } from './magic-confetti';

/** Win only when stack order matches exactly top → bottom */
const WIN_ORDER = [
  'hero',
  'path',
  'benefits',
  'trust',
  'objections',
  'finalCta',
  'faq',
] as const;

type DragState = {
  tile: HTMLElement;
  ghost: HTMLElement;
  offsetX: number;
  offsetY: number;
  from: 'tray' | 'stack';
  pointerId: number;
};

export function initCtaSiteToy() {
  const root = document.querySelector<HTMLElement>('[data-cta-toy]');
  if (!root || root.dataset.ready === '1') return;
  root.dataset.ready = '1';

  const field = root.querySelector<HTMLElement>('[data-cta-field]');
  const stack = root.querySelector<HTMLElement>('[data-cta-stack]');
  const tray = root.querySelector<HTMLElement>('[data-cta-tray]');
  const hint = root.querySelector<HTMLElement>('[data-cta-hint]');
  if (!field || !stack || !tray || !hint) return;

  shuffleTray(tray);

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let drag: DragState | null = null;
  let won = false;

  const syncFilled = () => {
    const count = stack.querySelectorAll('[data-cta-tile]').length;
    root.classList.toggle('is-filled', count > 0);
  };

  const syncPlacement = () => {
    const tiles = [...stack.querySelectorAll<HTMLElement>('[data-cta-tile]')];
    tiles.forEach((tile, index) => {
      const id = tile.dataset.tileId || '';
      const correct = WIN_ORDER[index] === id;
      tile.classList.toggle('is-correct', correct);
      tile.classList.toggle('is-wrong', !correct);
      tile.setAttribute('aria-invalid', correct ? 'false' : 'true');
    });
    // Clear feedback when tile returns to tray
    tray.querySelectorAll<HTMLElement>('[data-cta-tile]').forEach((tile) => {
      tile.classList.remove('is-correct', 'is-wrong');
      tile.removeAttribute('aria-invalid');
    });
  };

  const checkWin = () => {
    if (won) return;
    const ids = [...stack.querySelectorAll<HTMLElement>('[data-cta-tile]')].map(
      (el) => el.dataset.tileId || '',
    );
    if (ids.length !== WIN_ORDER.length) return;
    if (!WIN_ORDER.every((id, i) => ids[i] === id)) return;
    triggerWin();
  };

  const triggerWin = () => {
    won = true;
    root.classList.add('is-won');
    stack.setAttribute('data-cta-assembled', '1');
    // Drop red/green — assembled = same plaque tint for all
    stack.querySelectorAll<HTMLElement>('[data-cta-tile]').forEach((tile) => {
      tile.classList.remove('is-correct', 'is-wrong');
    });

    if (!reduced) {
      const tiles = stack.querySelectorAll<HTMLElement>('[data-cta-tile]');
      gsap.fromTo(
        tiles,
        { scale: 0.98 },
        { scale: 1, duration: 0.35, stagger: 0.03, ease: 'power2.out' },
      );
      fireMagicConfetti(field);
    }
  };

  const placeInStack = (tile: HTMLElement, clientY: number) => {
    const others = [...stack.querySelectorAll<HTMLElement>('[data-cta-tile]')].filter(
      (el) => el !== tile,
    );
    for (const other of others) {
      const r = other.getBoundingClientRect();
      if (clientY < r.top + r.height / 2) {
        stack.insertBefore(tile, other);
        return;
      }
    }
    stack.appendChild(tile);
  };

  const onPointerDown = (event: PointerEvent) => {
    if (won) return;
    const tile = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-cta-tile]');
    if (!tile || !root.contains(tile)) return;
    if (event.button != null && event.button !== 0) return;

    event.preventDefault();
    const rect = tile.getBoundingClientRect();
    const ghost = tile.cloneNode(true) as HTMLElement;
    ghost.classList.add('is-ghost');
    ghost.style.width = `${rect.width}px`;
    ghost.style.height = `${rect.height}px`;
    ghost.style.left = `${rect.left}px`;
    ghost.style.top = `${rect.top}px`;
    document.body.appendChild(ghost);

    tile.classList.add('is-dragging');
    tile.setPointerCapture(event.pointerId);

    drag = {
      tile,
      ghost,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      from: stack.contains(tile) ? 'stack' : 'tray',
      pointerId: event.pointerId,
    };
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    drag.ghost.style.left = `${event.clientX - drag.offsetX}px`;
    drag.ghost.style.top = `${event.clientY - drag.offsetY}px`;

    const overField = hit(field, event.clientX, event.clientY);
    field.classList.toggle('is-drop-target', overField);
  };

  const onPointerUp = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.pointerId) return;

    const { tile, ghost, from } = drag;
    const overField = hit(field, event.clientX, event.clientY);
    const overTray = hit(tray, event.clientX, event.clientY);

    ghost.remove();
    tile.classList.remove('is-dragging');
    field.classList.remove('is-drop-target');

    if (overField) {
      placeInStack(tile, event.clientY);
    } else if (overTray || from === 'stack') {
      tray.appendChild(tile);
    }

    drag = null;
    syncFilled();
    syncPlacement();
    checkWin();
  };

  root.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);
}

function shuffleTray(tray: HTMLElement) {
  const tiles = [...tray.querySelectorAll<HTMLElement>('[data-cta-tile]')];
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = tiles[i]!;
    const b = tiles[j]!;
    tiles[i] = b;
    tiles[j] = a;
  }
  tiles.forEach((tile) => tray.appendChild(tile));
}

function hit(el: HTMLElement, x: number, y: number) {
  const r = el.getBoundingClientRect();
  return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
}
