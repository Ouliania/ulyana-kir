# animation
- Add modern, engaging animations throughout the site (motion, interactive hover effects, interesting transitions). Confidence: 0.70
- Use GSAP for scroll-driven animations and complex motion effects. Confidence: 0.70
- Scroll-triggered viz/assembly animations should not start immediately — insert a short pause (~0.8s) so the user can absorb the static layout before parts begin moving. Confidence: 0.70
- Avoid empty/stark sections — pair scroll-pinning mechanics with rich visuals: backgrounds, imagery, or animated elements to prevent a boring look. Confidence: 0.65
- All GSAP animations MUST respect `prefers-reduced-motion` — disable or simplify motion for users who opt out. Confidence: 0.85
- Scroll Snap transitions should use crisp 0→100% opacity (not crossfade blending) — old content hides fully, then new content appears. Confidence: 0.75
