# Design System — ulyanaweb

## Brand
Personal portfolio of Ulyana Kirpichnikova. Cold lead: works + what I do → Telegram Discuss.
Notion-inspired calm: air, typography-first, near-sharp corners, no card-soup.
Not boring = **rhythm of emphasis** (quiet labels → loud stages → display beats), not random fonts/sizes.

## Section chrome
Every major block = `<section class="section-block">`.
- Section owns `--section-gap` (vertical) + `--content-inline` (horizontal).
- Content sits inside. ⊥ section air on inner `div`s.
- Pin stages (services, cases): add `section-block--bleed` (full shell width; title via `.section-head` or `.section-bridge`).
- **Cases air:** `#cases` starts with `.section-bridge` + `.type-display` (title-in-air) → sticky stage. One H2. GSAP scrub clip on `data-animate="cases-bridge"`.
- Exceptions: hero, interlude.

## Voice / IA
EN-primary (`/`), RU parity (`/ru/...`). Nav: Cases | Review | Contacts + Discuss.
No trailing period on single-sentence UI fragments.

## Visual tokens
- Primary blue `#0274DE` — CTAs, logo block, accents
- Shell `#DBEAF5` · Surface `#fffefe` · Text `#0D0D0D` / `#3D3D3D` / `#6B6B6B`
- Type: Source Serif 4 (heads) + Source Sans 3 (body), local woff2
- Radius: 4 / 8 / 12 / 16 · Soft media shadow OK on floating case video only
- Full tokens: `src/styles/global.css` + `.superdesign/init/theme.md`

## Section title roles (use these — don’t invent sizes)
Semantic `h2` always. Class = where the eye should land:

| Role | Class | Use when | Feel |
|------|-------|----------|------|
| **label** | `.type-label` | Services, Cases | Quiet secondary — content/stage carries |
| **display** | `.type-display` | How I work (+ `.type-lead`) | Loud serif — title shares the stage |
| **band** | `.type-band` | Discuss CTA strip | Strong close on tint band |

Hero = `--fs-h1` / `.hero-title` (own). Case Tag inside panel = case chrome, not a section role.
Chrome pad: `.section-head` + `.section-head--label`. ⊥ one-off `font-size` on section H2.

## Cases block — current (SPEC)
Home + `/cases`: soft **whole-case plaque** + **copy | visual** + smaller video inset.
Desktop ≤4: sticky stack (cards ride over). Archive >4: static plaques.
⊥ full-bleed video column. ⊥ `100vh` rails.

## Motion
GSAP ScrollTrigger rails. Honor reduced-motion. ≥2–3 intentional motions on home.
