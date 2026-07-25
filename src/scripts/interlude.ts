import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initInterlude(root: ParentNode = document): void {
  const section = root.querySelector<HTMLElement>('#interlude');
  if (!section) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const bg = section.querySelector<HTMLElement>('[data-interlude="bg"]');
  const words = section.querySelectorAll<HTMLElement>('[data-interlude="word"]');

  if (reduce) {
    if (bg) gsap.set(bg, { clearProps: 'all' });
    gsap.set(words, { opacity: 1, y: 0 });
    return;
  }

  gsap.set(words, { opacity: 0, y: 28 });
  if (bg) gsap.set(bg, { scale: 1.03 });

  const headerOffset = () => {
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--header-height').trim();
    const n = Number.parseFloat(raw);
    return Number.isFinite(n) ? n : 80;
  };

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: section,
      // Pin below fixed header so top --section-gap stays visible (was hidden under header)
      start: () => `top ${headerOffset()}px`,
      end: '+=160%',
      pin: true,
      pinSpacing: true,
      scrub: 0.8,
      invalidateOnRefresh: true,
    },
  });

  if (bg) {
    tl.to(bg, { scale: 1, duration: 1 }, 0);
  }

  if (words.length) {
    tl.to(
      words,
      {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.45,
      },
      0.18,
    );
  }

  tl.to({}, { duration: 0.4 });

  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
}
