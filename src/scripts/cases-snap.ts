/**
 * Home cases stage: sticky shell + scroll rails.
 * Layer swap modes via `data-cs-motion`: curtain (default) | cube (alt).
 */

const SNAP_CLASS = 'is-cases-snapping';

function pad(n: number): string {
  return String(n + 1).padStart(2, '0');
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function initCasesSnap(root: ParentNode = document): () => void {
  const section = root.querySelector<HTMLElement>('[data-cases-stage]');
  if (!section) return () => {};

  const rails = Array.from(section.querySelectorAll<HTMLElement>('[data-cs-rail]'));
  const dots = Array.from(section.querySelectorAll<HTMLElement>('[data-cs-dot]'));
  const indexCur = section.querySelector<HTMLElement>('[data-cs-index-cur]');
  const html = document.documentElement;
  const n = rails.length;
  if (n === 0) return () => {};

  let active = 0;
  let sectionVisible = false;
  let leaveTimer: number | undefined;

  const desktopMq = window.matchMedia('(min-width: 900px)');
  const pin = section.querySelector<HTMLElement>('.cs-pin');
  const mobile = section.querySelector<HTMLElement>('.cs-mobile');

  const syncA11ySurface = () => {
    const desk = desktopMq.matches;
    if (pin) pin.setAttribute('aria-hidden', desk ? 'false' : 'true');
    if (mobile) mobile.setAttribute('aria-hidden', desk ? 'true' : 'false');
  };

  const setSnap = () => {
    if (!desktopMq.matches || prefersReducedMotion() || !sectionVisible) {
      html.classList.remove(SNAP_CLASS);
      return;
    }
    html.classList.add(SNAP_CLASS);
  };

  const setActive = (next: number, { scrollToRail = false } = {}) => {
    if (next < 0 || next >= n) return;
    if (next === active && !scrollToRail) {
      // keep chrome/videos in sync only when index actually changes
    } else {
      const prev = active;
      active = next;

      if (leaveTimer) window.clearTimeout(leaveTimer);

      if (prev !== next) {
        section.dataset.csDir = next > prev ? 'next' : 'prev';
      }

      section.querySelectorAll<HTMLElement>('[data-cs-i]').forEach((layer) => {
        const i = Number(layer.dataset.csI);
        const wasActive = layer.classList.contains('is-active');
        layer.classList.remove('is-active', 'is-leaving');
        if (i === prev && prev !== next && wasActive && !prefersReducedMotion()) {
          layer.classList.add('is-leaving');
        }
        if (i === next) {
          layer.classList.add('is-active');
        }
      });

      leaveTimer = window.setTimeout(() => {
        section.querySelectorAll<HTMLElement>('.is-leaving').forEach((el) => {
          el.classList.remove('is-leaving');
        });
      }, prefersReducedMotion() ? 0 : 40);

      dots.forEach((dot, i) => {
        const on = i === next;
        dot.classList.toggle('is-active', on);
        dot.setAttribute('aria-selected', on ? 'true' : 'false');
      });

      if (indexCur) indexCur.textContent = pad(next);

      section.querySelectorAll<HTMLVideoElement>('[data-cs-video]').forEach((video) => {
        const layer = video.closest<HTMLElement>('[data-cs-i]');
        const i = Number(layer?.dataset.csI);
        if (i === next) {
          void video.play?.().catch(() => {});
        } else {
          video.pause?.();
        }
      });
    }

    if (scrollToRail && desktopMq.matches) {
      const rail = rails[next];
      const top = rail.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    }
  };

  const nearestRail = (): number => {
    const mid = window.innerHeight * 0.45;
    let best = 0;
    let bestDist = Infinity;
    rails.forEach((rail, i) => {
      const r = rail.getBoundingClientRect();
      const c = r.top + r.height / 2;
      const d = Math.abs(c - mid);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    return best;
  };

  const onScroll = () => {
    if (!desktopMq.matches) return;
    const next = nearestRail();
    if (next !== active) setActive(next);
  };

  const sectionIo = new IntersectionObserver(
    (entries) => {
      sectionVisible = entries.some((e) => e.isIntersecting && e.intersectionRatio > 0.05);
      setSnap();
      if (sectionVisible && desktopMq.matches) onScroll();
    },
    { threshold: [0, 0.05, 0.15] },
  );
  sectionIo.observe(section);

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const i = Number(dot.dataset.csDot);
      if (Number.isFinite(i)) setActive(i, { scrollToRail: true });
    });
  });

  const onMq = () => {
    setSnap();
    syncA11ySurface();
    if (desktopMq.matches) onScroll();
  };
  desktopMq.addEventListener('change', onMq);
  syncA11ySurface();

  const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  mqMotion.addEventListener('change', setSnap);

  setActive(0);
  const firstVideo = section.querySelector<HTMLVideoElement>('.cs-layer.is-active [data-cs-video]');
  void firstVideo?.play?.().catch(() => {});

  return () => {
    sectionIo.disconnect();
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    desktopMq.removeEventListener('change', onMq);
    mqMotion.removeEventListener('change', setSnap);
    html.classList.remove(SNAP_CLASS);
    if (leaveTimer) window.clearTimeout(leaveTimer);
  };
}
