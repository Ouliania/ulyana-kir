import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initInterlude(root: ParentNode = document): void {
  const section = root.querySelector<HTMLElement>('#interlude');
  if (!section) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const bg = section.querySelector<HTMLElement>('[data-interlude="bg"]');
  const chars = section.querySelectorAll<HTMLElement>('[data-interlude="char"]');
  const words = section.querySelectorAll<HTMLElement>('.interlude-word');
  const vignette = section.querySelector<HTMLElement>('[data-interlude="vignette"]');
  const lines = section.querySelectorAll<HTMLElement>('[data-interlude="line"]');
  const attr = section.querySelector<HTMLElement>('[data-interlude="attr"]');
  const frame = section.querySelector<HTMLElement>('.interlude-frame');
  const copy = section.querySelector<HTMLElement>('.interlude-copy');

  if (reduce) {
    gsap.set(lines, { clearProps: 'all', opacity: 1 });
    gsap.set(words, { clearProps: 'all', opacity: 1, scale: 1, filter: 'none' });
    gsap.set(chars, { clearProps: 'all', opacity: 1, y: 0, filter: 'none' });
    if (attr) gsap.set(attr, { clearProps: 'all', opacity: 1 });
    if (bg) gsap.set(bg, { clearProps: 'all', scale: 1, opacity: 1 });
    if (frame) gsap.set(frame, { clearProps: 'all' });
    if (copy) gsap.set(copy, { clearProps: 'all' });
    return;
  }

  // Initial states
  gsap.set(bg, { scale: 1.05, y: -20 });
  if (vignette) gsap.set(vignette, { opacity: 0 });
  if (frame) {
    // Do NOT touch frame.y — CSS positions the circle at the hero
    // boundary via layout (place-items + negative margin). GSAP animating
    // transform would override the CSS offset and shift the circle.
    gsap.set(frame, {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
    });
  }
  // Hide the quote content completely in circle state. opacity alone is not
  // enough: inside the 120px circle the quote wraps to ~14 lines and its
  // block (651px) overflows the circle. visibility:hidden removes it from
  // paint/layout influence until the card morph reveals it.
  if (copy) gsap.set(copy, { opacity: 0, visibility: 'hidden' });
  gsap.set(lines, { opacity: 0, y: 30 });
  gsap.set(words, { opacity: 0, scale: 1.06, filter: 'blur(8px)' });
  gsap.set(chars, { clearProps: 'all', opacity: 1, y: 0, filter: 'none' });
  if (attr) gsap.set(attr, { opacity: 0, y: 8 });

  // Scroll-scrubbed timeline. Section is 3× viewport tall, stage is sticky
  // → frame stays pinned while user scrolls through. 'top top' → '+=200%'
  // gives 2 full screens of morph + text reveal before services appear.
  const cardTarget = (): { width: string; height: string } => {
    const stage = section.querySelector<HTMLElement>('.interlude-stage');
    const cs = getComputedStyle(stage!);
    const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    return {
      width: `${stage!.clientWidth - padX}px`,
      height: `${stage!.clientHeight - padY}px`,
    };
  };

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 80%',
      end: 'bottom top',
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });

  /* Single smooth morph: circle → rounded rect in one continuous tween.
   * scrubbed by scroll, no hard stage boundary.
   * Total duration = 0.78 matches previous two-stage timing for text reveal sync. */
  if (frame) {
    tl.fromTo(
      frame,
      { width: '120px', height: '120px', borderRadius: '50%' },
      {
        width: () => cardTarget().width,
        height: () => cardTarget().height,
        borderRadius: 'var(--radius-media)',
        duration: 0.78,
        ease: 'power2.inOut',
      }
    );
  }

  /* Text reveal: starts near the end of morph (0.72 / 0.78 ≈ 92%).
   * All subsequent animations fire in quick succession so text is fully visible
   * while the card still fills the screen. */
  if (copy) {
    tl.to(copy, { opacity: 1, visibility: 'visible', duration: 0.35 }, 0.72);
  }
  if (vignette) {
    tl.to(vignette, { opacity: 1, duration: 0.4 }, 0.76);
  }

  // Lines slide up
  tl.to(
    lines,
    { opacity: 1, y: 0, stagger: 0.12, duration: 0.7, ease: 'power2.out' },
    0.82
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
    0.87
  );

  // Reveal attribution
  if (attr) {
    tl.to(attr, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, 0.92);
  }

  // Empty tail: card stays fully visible for extra scroll room before
  // the section exits and "What I do" comes into view.
  tl.to({}, { duration: 1.0 });

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
        start: 'top 80%',
        end: 'bottom top',
        scrub: true,
      },
    }
  );

  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
}
