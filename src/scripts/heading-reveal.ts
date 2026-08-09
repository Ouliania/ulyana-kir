import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Animates headings on scroll:
 *   h1/h2 — per-letter fade-in + slide-up + blur → clear
 *   h3   — whole-block fade-in + slide-up + blur → clear
 *
 * KineticText headings (`.kinetic-letter` spans) are animated as-is,
 * keeping their CSS hover effect intact.
 */
export function initHeadingReveal(root: ParentNode = document): void {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const headings = root.querySelectorAll<HTMLElement>('h1, h2');

  // Recalc ScrollTrigger positions when service tabs switch
  window.addEventListener('st:tabchange', () => {
    ScrollTrigger.refresh();
  });

  for (const heading of headings) {
    if (heading.dataset.headingReveal === 'done') continue;

    // Headings inside prose or with explicit opt-out → simple fade-up, no per-letter split
    if (heading.closest('.prose') || heading.closest('[data-heading-skip]')) {
      heading.dataset.headingReveal = 'done';
      if (reduce) {
        gsap.set(heading, { clearProps: 'transform,opacity' });
        continue;
      }
      gsap.from(heading, {
        opacity: 0,
        y: 28,
        duration: 0.75,
        ease: 'power2.out',
        scrollTrigger: { trigger: heading, start: 'top 92%', toggleActions: 'play none none none' },
        clearProps: 'transform,opacity',
      });
      continue;
    }

    const tag = heading.tagName.toLowerCase();

    /* ── KineticText headings (already have .kinetic-letter spans) ── */
    const kineticLetters = heading.querySelectorAll<HTMLElement>('.kinetic-letter');
    if (kineticLetters.length > 0) {
      heading.dataset.headingReveal = 'done';
      if (reduce) {
        gsap.set(kineticLetters, { clearProps: 'all', opacity: 1 });
        continue;
      }
      gsap.set(kineticLetters, { opacity: 0, y: 16, filter: 'blur(8px)' });
      gsap.to(kineticLetters, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        stagger: 0.04,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: heading, start: 'top 85%', end: 'top 40%', scrub: false },
      });
      continue;
    }

    /* ── H1/H2 — per-letter ── */
    // Skip semantic inline formatting; allow plain <br> (replace with space)
    if (heading.querySelector('a, em, strong, img, svg')) continue;

    // Replace <br> with space before wrapping
    heading.querySelectorAll('br').forEach(br => br.replaceWith(' '));

    let text = heading.textContent ?? '';
    if (!text.trim()) continue;

    // Wrap every letter in <span class="hr-letter">
    heading.innerHTML = '';
    for (const char of text) {
      if (char === ' ') {
        heading.append(' ');
      } else {
        const span = document.createElement('span');
        span.className = 'hr-letter';
        span.textContent = char;
        heading.append(span);
      }
    }
    heading.dataset.headingReveal = 'done';

    const letters = heading.querySelectorAll<HTMLElement>('.hr-letter');
    if (letters.length === 0) continue;

    if (reduce) {
      gsap.set(letters, { clearProps: 'all', opacity: 1 });
      continue;
    }

    gsap.set(letters, { opacity: 0, y: 16, filter: 'blur(8px)' });
    gsap.to(letters, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      stagger: 0.04,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: { trigger: heading, start: 'top 85%', end: 'top 40%', scrub: false },
    });
  }
}
