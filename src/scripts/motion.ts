import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CONTENT_SEL =
  'p, li, h3, h4, .card, .glass-card, .flow-card, .btn, video, img, ' +
  '.info-block, .contact-link, .hero-subtitle, .hero-footnote, .hero-actions, ' +
  '.hero-badge, .hero-dashboard-mockup, .blog-card, .case-card, .pricing-card, .hours-list, ' +
  '.info-split-grid, .code-card-preview';

const EXCLUDE =
  '.csk-panel, .st-card, .st-tab, .st-viz, .prose, .interlude, ' +
  '[data-flow], [data-interlude-root], [data-animate], [data-cta-toy]';

/** Universal cross-browser content reveal — all pages, all browsers */
export function initContentReveal(root: ParentNode = document): void {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  const mainEls = root.querySelectorAll('main');

  mainEls.forEach((main) => {
    // Collect top-level containers (sections or direct .container children of main)
    const boxes: HTMLElement[] = [];
    const seen = new Set<HTMLElement>();

    const add = (el: HTMLElement) => {
      if (seen.has(el)) return;
      seen.add(el);
      boxes.push(el);
    };

    // Prefer sections — they're the natural semantic units
    const sections = main.querySelectorAll<HTMLElement>('section');
    if (sections.length > 0) {
      sections.forEach(add);
    } else {
      // Fallback: direct containers (for pages without <section>)
      main.querySelectorAll<HTMLElement>(':scope > .container, :scope > .section-padding').forEach(add);
    }

    // Always also handle .blog-grid and .contacts-grid directly
    main.querySelectorAll<HTMLElement>('.blog-grid, .contacts-grid').forEach((grid) => {
      if (!grid.closest('section')) add(grid);
    });

    boxes.forEach((trigger) => {
      if (trigger.closest(EXCLUDE)) return;

      const items = trigger.querySelectorAll<HTMLElement>(CONTENT_SEL);
      const filtered = [...items].filter(
        (el) => !el.closest(EXCLUDE) && !el.closest('[data-animate]'),
      );
      if (filtered.length < 2) return;

      // Single atomic call — GSAP handles hide + reveal + ScrollTrigger together
      gsap.from(filtered, {
        opacity: 0,
        y: 32,
        duration: 0.75,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger,
          start: 'top 88%',
          once: true,
        },
      });
    });
  });
}

export function initBrandMotion(root: ParentNode = document): void {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Universal content reveal first
  initContentReveal(root);

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

  // Cases title-in-air: start hidden, once-play rise when bridge enters
  root.querySelectorAll<HTMLElement>('[data-animate="cases-bridge"]').forEach((el) => {
    const trigger = el.closest('.section-bridge') ?? el;
    const inner = el.querySelector<HTMLElement>('.cases-bridge-inner') ?? el;
    if (reduce) {
      gsap.set(inner, { clearProps: 'transform,opacity' });
      return;
    }

    gsap.set(inner, { yPercent: 120, opacity: 0 });

    const playIn = () => {
      gsap.to(inner, {
        yPercent: 0,
        opacity: 1,
        duration: 1.1,
        ease: 'power3.out',
        overwrite: true,
        clearProps: 'transform,opacity',
      });
    };

    ScrollTrigger.create({
      trigger,
      start: 'top 82%',
      once: true,
      onEnter: playIn,
      // Tall pins above can refresh past start — don't leave title stuck hidden
      onRefresh: (self) => {
        if (self.progress > 0 || self.start < self.scroll()) {
          gsap.set(inner, { yPercent: 0, opacity: 1, clearProps: 'transform,opacity' });
        }
      },
    });
  });

  // Case panels: staggered enter (copy + media) — replaces pin/rails
  root.querySelectorAll<HTMLElement>('[data-animate="case-panel"]').forEach((panel) => {
    const copyBits = panel.querySelectorAll<HTMLElement>(
      '.csk-index, .csk-project-block, .csk-chip, .csk-field, .csk-proof-item',
    );
    const visualBits = panel.querySelectorAll<HTMLElement>(
      '.csk-proof-block, .csk-result-prose',
    );
    const bits = [...copyBits, ...visualBits];

    if (reduce) {
      gsap.set(bits, { clearProps: 'transform,opacity' });
    } else if (bits.length) {
      gsap.set(bits, { opacity: 0, y: 36 });

      ScrollTrigger.create({
        trigger: panel,
        start: 'top 78%',
        once: true,
        onEnter: () => {
          gsap.to(bits, {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.07,
            ease: 'power3.out',
            overwrite: true,
            clearProps: 'transform,opacity',
          });
        },
        onRefresh: (self) => {
          if (self.progress > 0 || self.start < self.scroll()) {
            gsap.set(bits, { opacity: 1, y: 0, clearProps: 'transform,opacity' });
          }
        },
      });
    }

    // Видео — без отдельной анимации: появляется вместе с .csk-media
    // (уже в bits). Один лёгкий ритм для всего блока.
  });

  // Sticky / tall pin sections above can desync ScrollTrigger — refresh after layout
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });

  // Final stabilisation: after fonts + images settle, recalc all trigger positions
  const stabilize = () => ScrollTrigger.refresh();
  window.addEventListener('load', stabilize);
  if (document.fonts?.ready) document.fonts.ready.then(stabilize);
  // Force a later refresh too (dynamic content, late images)
  setTimeout(stabilize, 1200);
}
