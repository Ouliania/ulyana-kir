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
      '.csk-index, .csk-project-block, .csk-field',
    );
    const visualBits = panel.querySelectorAll<HTMLElement>(
      '.csk-media, .csk-proof-block, .csk-result-prose',
    );
    const bits = [...copyBits, ...visualBits];
    if (!bits.length) return;

    if (reduce) {
      gsap.set(bits, { clearProps: 'transform,opacity' });
      return;
    }

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
  });

  // Sticky / tall pin sections above can desync ScrollTrigger — refresh after layout
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
}
