import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initInterlude(root: ParentNode = document): void {
  const section = root.querySelector<HTMLElement>('#interlude');
  if (!section) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const bg = section.querySelector<HTMLElement>('[data-interlude="bg"]');
  const chars = section.querySelectorAll<HTMLElement>('[data-interlude="char"]');
  const vignette = section.querySelector<HTMLElement>('[data-interlude="vignette"]');
  const lines = section.querySelectorAll<HTMLElement>('.interlude-line');
  const attr = section.querySelector<HTMLElement>('[data-interlude="attr"]');
  const frame = section.querySelector<HTMLElement>('.interlude-frame');
  const copy = section.querySelector<HTMLElement>('.interlude-copy');
  const solidBg = section.querySelector<HTMLElement>('[data-interlude="solid-bg"]');

  if (reduce) {
    gsap.set(lines, { clearProps: 'all', opacity: 1 });
    gsap.set(chars, { clearProps: 'all', opacity: 1, y: 0, filter: 'none' });
    if (attr) gsap.set(attr, { clearProps: 'all', opacity: 1 });
    if (bg) gsap.set(bg, { clearProps: 'all', scale: 1, opacity: 1 });
    if (frame) gsap.set(frame, { clearProps: 'all' });
    if (copy) gsap.set(copy, { clearProps: 'all' });
    if (solidBg) gsap.set(solidBg, { clearProps: 'all' });
    return;
  }

  // Initial states
  gsap.set(bg, { scale: 1.05, y: -20, opacity: 0 });
  if (solidBg) gsap.set(solidBg, { opacity: 1 });
  if (vignette) gsap.set(vignette, { opacity: 0 });
  if (frame) {
    gsap.set(frame, {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      y: 0,
    });
  }
  if (copy) gsap.set(copy, { opacity: 0 });
  gsap.set(lines, { opacity: 1 });
  gsap.set(chars, { opacity: 0, y: 20, filter: 'blur(10px)' });
  if (attr) gsap.set(attr, { opacity: 0, y: 8 });

  // Scroll-pinned timeline that morphs the circle and reveals text
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 85%',
      end: '+=120%',
      pin: true,
      pinSpacing: true,
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  });

  // 1. Morph circle to full card
  if (frame) {
    tl.fromTo(
      frame,
      {
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        y: 0,
      },
      {
        width: '100%',
        height: '100%',
        borderRadius: 'var(--radius-media)',
        y: 0,
        duration: 1.2,
        ease: 'power3.inOut',
      }
    );
  }

  // 2. Fade in copy container, waves, vignette, and fade out solid blue bg
  if (copy) {
    tl.to(copy, { opacity: 1, duration: 0.4 }, '-=0.4');
  }
  if (solidBg) {
    tl.to(solidBg, { opacity: 0, duration: 0.8 }, '-=0.8');
  }
  tl.to(bg, { opacity: 1, duration: 0.8 }, '-=0.8');
  if (vignette) {
    tl.to(vignette, { opacity: 1, duration: 0.4 }, '-=0.4');
  }

  // 3. Staggered reveal of characters
  tl.to(
    chars,
    {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      stagger: 0.012,
      duration: 0.7,
      ease: 'power2.out',
    },
    '-=0.2'
  );

  // 4. Reveal attribution
  if (attr) {
    tl.to(attr, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, '-=0.2');
  }

  // Buffer at the end of pin
  tl.to({}, { duration: 0.3 });

  // Parallax scroll-linked effects for background waves
  gsap.fromTo(
    bg,
    { y: -20, scale: 1.05 },
    {
      y: 20,
      scale: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    }
  );

  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
}
