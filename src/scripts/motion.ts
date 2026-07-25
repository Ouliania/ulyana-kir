import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initBrandMotion(root: ParentNode = document): void {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const heroItems = root.querySelectorAll<HTMLElement>('[data-animate="hero"]');
  if (heroItems.length) {
    if (reduce) {
      gsap.set(heroItems, { opacity: 1, y: 0 });
    } else {
      gsap.from(heroItems, {
        opacity: 0,
        y: 28,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power3.out',
        clearProps: 'transform',
      });
    }
  }

  const cue = root.querySelector<HTMLElement>('[data-animate="cue"]');
  if (cue && !reduce) {
    gsap.to(cue, {
      y: 8,
      duration: 1.1,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
    });
  }

  root.querySelectorAll<HTMLElement>('[data-animate="reveal"]').forEach((el) => {
    if (reduce) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }
    gsap.from(el, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
      // clear so sticky / later layout isn't left at opacity:0
      clearProps: 'opacity,transform',
    });
  });

  root.querySelectorAll<HTMLElement>('[data-animate="stagger"]').forEach((group) => {
    const items = group.querySelectorAll<HTMLElement>(':scope > *');
    if (!items.length) return;
    if (reduce) {
      gsap.set(items, { opacity: 1, y: 0 });
      return;
    }
    gsap.from(items, {
      opacity: 0,
      y: 28,
      duration: 0.65,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: group,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
      clearProps: 'opacity,transform',
    });
  });

  // Sticky / tall pin sections above can desync ScrollTrigger — refresh after layout
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
}
