/**
 * CTA Character Mood — sphere follows cursor across the CTA band.
 *
 * - Cursor in left third  → red + flat mouth (doubt)
 * - Cursor in right third → green + big smile (discuss)
 * - Cursor elsewhere / out of view → default (cyan/violet + gentle smile)
 * - Parallax: face + blob layers shift slightly toward cursor for depth
 */

const MOOD_TRANSITION_MS = 200;

export function initCtaCharacterMood(): void {
  const char = document.querySelector<HTMLElement>('.cta-char');
  if (!char) return;

  const hero = char.closest<HTMLElement>('.cta-hero');
  if (!hero) return;

  // On mobile — no mood changes, only parallax
  const mobileMq = window.matchMedia('(max-width: 699px)');
  let isMobile = mobileMq.matches;

  mobileMq.addEventListener('change', (e) => {
    isMobile = e.matches;
    if (isMobile) char!.removeAttribute('data-mood');
  });

  let currentMood: 'green' | 'red' | null = null;
  let rafId = 0;

  function setMood(mood: 'green' | 'red' | null, xRatio: number, yRatio: number): void {
    if (mood !== currentMood) {
      currentMood = mood;
      if (mood) {
        char!.setAttribute('data-mood', mood);
      } else {
        char!.removeAttribute('data-mood');
      }
    }
    char!.style.setProperty('--look-x', String(xRatio));
    char!.style.setProperty('--look-y', String(yRatio));
  }

  function onMove(e: MouseEvent): void {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const rect = hero!.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.max(Math.abs(dx), Math.abs(dy));
      const maxDist = Math.max(rect.width, rect.height) * 1.2;

      // Outside: reset
      if (dist > maxDist) {
        setMood(null, 0, 0);
        rafId = 0;
        return;
      }

      // Horizontal ratio (-1 left .. +1 right)
      const xRatio = Math.max(-1, Math.min(1, dx / (rect.width * 0.6)));
      // Vertical ratio (-1 top .. +1 bottom) — subtle head tilt
      const yRatio = Math.max(-1, Math.min(1, dy / (rect.height * 0.5)));

      const third = rect.width / 3;
      let mood: 'green' | 'red' | null = null;

      if (!isMobile) {
        if (dx < -third * 0.5) {
          mood = 'red';   // left side → red (doubt)
        } else if (dx > third * 0.5) {
          mood = 'green'; // right side → green (discuss)
        }
      }
      // middle zone = default (null)

      setMood(mood, xRatio, yRatio);
      rafId = 0;
    });
  }

  document.addEventListener('mousemove', onMove, { passive: true });

  // Touch support
  document.addEventListener('touchmove', (e: TouchEvent) => {
    const t = e.touches[0];
    if (t) onMove({ clientX: t.clientX, clientY: t.clientY } as MouseEvent);
  }, { passive: true });
}
