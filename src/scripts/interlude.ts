import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initInterlude(root: ParentNode = document): void {
  const section = root.querySelector<HTMLElement>('#interlude');
  if (!section) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const bg = section.querySelector<HTMLElement>('[data-interlude="bg"]');
  const words = section.querySelectorAll<HTMLElement>('[data-interlude="word"]');
  const vignette = section.querySelector<HTMLElement>('[data-interlude="vignette"]');
  const grid = section.querySelector<HTMLElement>('[data-interlude="grid"]');
  const lines = section.querySelectorAll<HTMLElement>('.interlude-line');
  const attr = section.querySelector<HTMLElement>('[data-interlude="attr"]');

  if (reduce) {
    gsap.set(lines, { clearProps: 'all', opacity: 1 });
    gsap.set(words, { clearProps: 'all', opacity: 1, scale: 1, filter: 'none' });
    if (attr) gsap.set(attr, { clearProps: 'all', opacity: 1 });
    if (bg) gsap.set(bg, { clearProps: 'all', scale: 1 });
    if (grid) gsap.set(grid, { clearProps: 'all' });
    return;
  }

  // Initial states
  gsap.set(bg, { scale: 1.15, y: -40 });
  gsap.set(grid, { y: 0, opacity: 0.4 });
  gsap.set(lines, { y: 40, opacity: 0.5 });
  if (attr) gsap.set(attr, { opacity: 0, y: 8 });

  const headerOffset = () => {
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--header-height').trim();
    const n = Number.parseFloat(raw);
    return Number.isFinite(n) ? n : 80;
  };

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: section,
      start: () => `top ${headerOffset()}px`,
      end: '+=180%',
      pin: true,
      pinSpacing: true,
      scrub: 0.8,
      invalidateOnRefresh: true,
    },
  });

  // Parallax: bg zooms in and settles horizontally
  tl.to(bg, { scale: 1, y: 0, duration: 1.5 }, 0);

  // Grid drifts upward and fades
  if (grid) {
    tl.to(grid, { y: -30, opacity: 0.1, duration: 1.5 }, 0);
  }

  // Vignette breathing: darken then lighten
  if (vignette) {
    tl.to(
      vignette,
      { background: 'radial-gradient(circle at center, transparent 20%, rgba(10,22,48,0.8) 100%)', duration: 0.8 },
      0,
    );
    tl.to(
      vignette,
      { background: 'radial-gradient(circle at center, transparent 40%, rgba(10,22,48,0.3) 100%)', duration: 0.7 },
      0.7,
    );
  }

  // Lines slide up
  tl.to(
    lines,
    { y: 0, opacity: 1, stagger: 0.2, duration: 0.9, ease: 'power2.out' },
    0.1,
  );

  // Words pop: scale + blur release with overshoot
  tl.to(
    words,
    {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      stagger: 0.05,
      duration: 0.6,
      ease: 'back.out(1.4)',
    },
    0.2,
  );

  // Quiet attribution after the quote settles
  if (attr) {
    tl.to(attr, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, 0.95);
  }

  tl.to({}, { duration: 0.4 });

  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
}
