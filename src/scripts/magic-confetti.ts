/**
 * Magic UI–style confetti via `canvas-confetti`
 * (same engine as `npx shadcn@latest add @magicui/confetti` — React wrapper skipped; Astro has no React).
 * Recipes adapted from Magic UI: fireworks + side cannons.
 */
import confetti from 'canvas-confetti';

const BRAND_COLORS = ['#0274DE', '#6B5CE7', '#0C972F', '#EBF151', '#62ACEF', '#FFFDC2'];

function originFromEl(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  return {
    x: (rect.left + rect.width / 2) / window.innerWidth,
    y: (rect.top + rect.height / 2) / window.innerHeight,
  };
}

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

/** Fireworks burst (Magic UI confetti-fireworks) centered on element */
export function fireMagicConfetti(anchor: HTMLElement) {
  const origin = originFromEl(anchor);
  const duration = 2.4 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = {
    startVelocity: 28,
    spread: 360,
    ticks: 55,
    zIndex: 40,
    colors: BRAND_COLORS,
  };

  const interval = window.setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    const particleCount = Math.max(12, 42 * (timeLeft / duration));
    void confetti({
      ...defaults,
      particleCount,
      origin: {
        x: randomInRange(origin.x - 0.12, origin.x + 0.12),
        y: randomInRange(Math.max(0.05, origin.y - 0.18), origin.y),
      },
    });
  }, 220);

  // Side cannons (Magic UI confetti-side-cannons), shortened
  const sideEnd = Date.now() + 1200;
  const sideFrame = () => {
    if (Date.now() > sideEnd) return;
    void confetti({
      particleCount: 2,
      angle: 60,
      spread: 50,
      startVelocity: 50,
      origin: { x: 0, y: origin.y },
      colors: BRAND_COLORS,
      zIndex: 40,
    });
    void confetti({
      particleCount: 2,
      angle: 120,
      spread: 50,
      startVelocity: 50,
      origin: { x: 1, y: origin.y },
      colors: BRAND_COLORS,
      zIndex: 40,
    });
    requestAnimationFrame(sideFrame);
  };
  sideFrame();
}
