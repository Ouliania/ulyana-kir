# Theme — ulyanaweb (Notion-inspired)

## Compact token summary

### Colors
| Token | Value | Role |
|-------|-------|------|
| `--color-blue` | `#0274DE` | Primary CTA / logo block |
| `--color-blue-soft` | `#62ACEF` | Soft accent |
| `--color-blue-tint` | `#E6F4FE` | Pale wash / CTA band |
| `--color-shell` | `#DBEAF5` | Page frame (live code) |
| `--color-surface` | `#fffefe` | White substrate |
| `--color-text-primary` | `#0D0D0D` | Strong text / display / band |
| `--color-text-secondary` | `#3D3D3D` | Body + label titles |
| `--color-text-muted` | `#6B6B6B` | Labels / meta |
| `--color-border` | `#E2E0DC` | Hairlines |
| `--color-violet` | `#6B5CE7` | Services tab2 only |
| `--color-lime` / accent | `#61F185` / `#0C972F` | Services tab3 |
| `--color-yellow` | `#EBF151` | Services tab4 |

⊥ acid lime `#9DFF20`. No purple-on-white marketing defaults.

### Typography
- Headings: **Source Serif 4** (`--font-heading`), weight 500, tracking −0.01em
- Body/UI: **Source Sans 3** (`--font-body`), weight 400–500
- Scale:
  - `--fs-h1` — hero only
  - `--fs-h2-label` — quiet section titles (services, cases)
  - `--fs-h2` — CTA band / default H2
  - `--fs-h2-display` — title-led sections (how I work)
  - `--fs-h3` · `--fs-body` · `--fs-small`

### Section title roles (classes ∈ `global.css`)
| Class | Token | Home |
|-------|-------|------|
| `.type-label` | `--fs-h2-label`, secondary color | `#services`, `#cases` |
| `.type-display` | `--fs-h2-display`, primary | `#reviews` (How I work) |
| `.type-band` | `--fs-h2`, primary | `#discuss` |
| `.type-lead` | body support under display/band | lead paragraphs |

Chrome: `.section-head` + `.section-head--label` (inline pad / gap).
Rule: pick a role → done. ⊥ new `font-size` in a section stylesheet for H2.

### Radii / spacing
- `--radius-default: 4px` · `--radius-button: 8px` · `--radius-card: 12px` · `--radius-media: 16px`
- `--content-inline: clamp(1.5rem, 3.5vw, 2.75rem)`
- `--section-gap: clamp(2.5rem, 5vw, 4rem)`
- `--header-height: 80px`
- `--shadow-card: none` (Notion calm)

### Section chrome
- Default: `<section class="section-block">` — owns `padding-block: var(--section-gap)` + `padding-inline: var(--content-inline)`. Content inside, ⊥ pad on inner wrappers.
- Pin stages: `section-block section-block--bleed` (services, cases) — inline pad 0; `.section-head` restores title edge.
- Exceptions: hero, interlude.
- `.container` = optional measure cap, not home section law.

### Motion
GSAP + ScrollTrigger. Honor `prefers-reduced-motion`. Cases: sticky stage + content-layer crossfade.

## Source
Full tokens live in `src/styles/global.css` `@layer base` `:root` + type roles in `@layer components`. Prefer this summary for draft context budget. Law = `SPEC.md` §I / V21.
