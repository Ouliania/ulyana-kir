# ulyanaweb.ru — SPEC

## §G Goal
Персональный сайт Ульяны Кирпичниковой → холодный лид: показать работы + коротко объяснить «что делаю» → контакт (Telegram).
Сайт = портфолио-витрина + понятный оффер. ⊥ каталог платных аудитов как главная воронка.
Бесплатный экспресс-аудит = OK как CTA к разговору (не продукт-прайс).
**Primary audience = EN.** RU = второй язык (полный паритет UI/текстов brand-сайта).

### Marketing spine (v1) — cold scan ≤10s
Who: owner / founder needing site as sales tool (EN primary; RU parity).
Promise: structure + copy + design + launch → site works in acquisition/sales/retention.
Proof: real cases (video stage + honest role tag) + Review social proof.
Path: header Discuss / Telegram; free express-audit = conversation opener ⊥ priced product.
⊥: paid-audit catalog as main funnel; fake full-ownership claims; empty Review.

## §C Constraints
- Host: **reg.ru** (текущий `.ru` + будущий `.com` на том же хостинге). Deploy = static build (`astro build` → `dist/`) типичен для reg.ru; ⊥ рассчитывать на CF/Vercel geo headers из коробки.
- Domains: `ulyanaweb.ru` live; план `ulyanaweb.com` (тот же site). Оба домена → один билд. Canonical ? `.com` для EN audience после покупки (решить при запуске `.com`).
- Стек: Astro 6, `src/pages` = роуты. Формы → Google Apps Script (`src/config.ts`).
- Контакт: Telegram `@UlyanaKir`, email `hello@ulyanaweb.ru`.
- Локали: `en` (default) + `ru`. URL: `/` = EN, `/ru/...` = RU.
- Авто-язык на reg.ru (нет server geo):
  1. cookie `lang` (manual) ! wins
  2. client geo via lightweight IP API (1 request / first visit) → cookie `lang` + soft redirect twin URL
  3. else `Accept-Language`
  4. else `en`
  RU countries: RU, BY, KZ (? UA — решить). Иначе `en`.
- Optional later: Cloudflare DNS proxy перед reg.ru → тогда server/edge geo без API. Не блокер сейчас.
- Demo-кейсы (hotel) могут свой EN/RU toggle; brief-карточки brand ! bilingual.
- Акцент / палитра: Notion-inspired tokens (см. §I Design). Primary blue `#0274DE`. ⊥ салатовый / acid lime `#9DFF20`.
- Визуальный язык: чистый Notion-like — воздух, typography-first, sharp/near-sharp corners, без card-soup. Ref: `docs/design/figma-hero.png`, `docs/design/figma-case.png`.
- Шрифты: локальные `public/fonts` (OFL). Brand = **Source Serif 4** (headings) + **Source Sans 3** (body/UI). Один стек EN+RU (кириллица). ⊥ Inter/Roboto/system как primary. ⊥ commercial Neue Montreal на live. Demo-кейсы (hotel) могут свой stack (Bebas ?).
- Hero (Figma): logo-block brand + centered H1 + short support (+ form). Height = content + pad, ⊥ force 100vh. Gap → next block (`--section-gap`) > hero inner gap. CTA в header («Discuss a project»).
- Case page: Service (serif H) + project caption (link · roles) | Problem | Solution (+ Result ? real metric only) + media stage (видео сайта: скролл + interaction). Stack = case-page meta only, ∉ home cards. ⊥ статичный скриншот-as-only-proof когда есть video/demo. ⊥ fake Result / empty Result placeholder.
- Motion: GSAP (+ ScrollTrigger) ! на brand UI. ≥2–3 intentional motions / key surface (hero entrance, scroll reveals, case media). `prefers-reduced-motion` → simplify/disable. ⊥ random noise / infinite spam.
- Cards только если UI-interaction. ⊥ card-soup.
- Холодный outreach: быстрый скан «кто / что / proof / write».
- Кейсы с узкой ролью ! tag роли. ⊥ фейк «весь сайт мой».
- Living demo cases = валидный proof.
- **No trailing period** on single-sentence UI fragments (cards, labels, subheads, short leads, CTAs) when no following sentence. Multi-sentence body: periods between sentences OK; closing period on final stand-alone card line ⊥.
- Правки только под текущий §T.

## §I Interfaces
### i18n
- locales: `en` | `ru`
- routes: `/{path}` = EN; `/ru/{path}` = RU (mirror)
- `html[lang]` = active locale
- hreflang + sitemap ∀ bilingual page (оба домена `.ru` / `.com` когда оба live)
- UI switcher EN|RU → cookie `lang` + twin URL
- geo на reg.ru: client script first-visit → IP API (напр. `ipapi.co` / `ipwho.is` free) → set cookie → redirect once. ⊥ spam API каждый pageview.
- Brand UI dict: `src/i18n/ui.ts`. Case body copy: `src/i18n/cases.ts` (nested keys).
- middleware сейчас: Typograf only — locale detect на static = client; Typograf ru/en по locale

### Strict i18n (brand + cases)
1. ⊥ hardcoded user-facing strings ∈ components. ∀ labels/copy → `t()` | case dict lookup.
2. **Author RU first** ∈ master locale (`ui.ru` / `cases.ru`) — source of truth for new/changed copy. Route default still `en` (V11).
3. After RU keys change → immediately sync twin keys ∈ `en` (parity). ⊥ leave EN stale/missing.
4. Key names = nested semantic by feature: `cases.progolos.problem`, `case.problemWas` (dot path / nested object).

### Host / domains
- build: static `dist/` → upload reg.ru
- domains: `ulyanaweb.ru` + planned `ulyanaweb.com` → same files
- subdomains cases: `creator.ulyanaweb.ru`, later `progolos.ulyanaweb.ru` (и `.com` twin ? later)

### Public nav (cold) — оба языка — по Figma
- Logo wordmark: `Ulyana` ∈ blue block + `Kirp` outside (ref hero)
- Links: Cases | Review | Contacts (+ lang EN|RU)
- Header CTA: «Discuss a project» → Telegram / discuss
- `/code` ! keep URL, ∉ primary nav (Figma) — link from home/body if needed
- `/` | `/ru/` home; `/cases`…; `/contacts`…; `/privacy-policy`

### Design tokens (Notion-inspired)
CSS vars ∈ `src/styles/global.css`:
```
--color-blue:        #0274DE  /* primary CTA / logo block, ! everywhere */
--color-blue-soft:   #62ACEF
--color-blue-tint:   #E6F4FE
--color-violet:      #6B5CE7  /* tab2 (deep-site) identity */
--color-lime:        #61F185  /* tab3 (conversion) tint (pill bg). Accent (text/solid fill) = #0C972F, same hue, ∈ ServiceTabsSection.astro --st-accent-2, not a global token */
--color-yellow:      #EBF151  /* tab4 (ecommerce) identity, replaces amber/mustard */
--color-teal:        #2B9D99  /* legacy — CasePage `.roles` only, ⊥ new tab identity */
--color-shell:       #ccd7fe  /* page frame */
--color-surface:     #FFFFFF  /* white substrate */
--color-text:        #0D0D0D
--color-text-muted:  #6B6B6B
--color-accent:      var(--color-blue)
```
Accent roles: blue = primary action, ∀ real CTA button (header/modal/card) always blue|black, ⊥ tab-hue. Services-tabs family (blue/violet/lime/yellow, `ServiceTabsSection.astro`) = tab-pill identity, light bg + black text on the pill itself. Each tab ! two-tier: `--st-tint-N` (light, pill bg + pale illustration washes) + `--st-accent-N` (dark/saturated enough to read as solid button/line/digit-text on white — see V2), same hue as tint-N **except yellow** — dark-yellow reads mustard/khaki (⊥), so tab4's `--st-accent-3` = `--color-text-primary` (black) instead. ⊥ coral (removed 2026-07, unused/legacy). ⊥ amber (planned #FFC85E never shipped, superseded by yellow above).

### Content grid
- Inside `page-shell`: shared inline inset `--content-inline: clamp(1.5rem, 3.5vw, 2.75rem)` (services tabs edge = law).
- Section stack gap: `--section-gap: clamp(2.5rem, 5vw, 4rem)` — between major home blocks. ! > hero inner gap (`1.25rem`).
- `.container`, services tabs/columns, interlude media ! use `--content-inline`. Media may stretch full content-width (to that pad).
- Blog prose later ? wider reading measure / larger text inset — exception, not default.

### Motion (GSAP)
- Lib: `gsap` + `ScrollTrigger` (CDN или npm). Vanilla/Astro script islands.
- Pattern pack (minimum):
  1. Hero: H1 + support fade/up stagger on load
  2. «See cases» cue subtle y-loop (respect reduced-motion)
  3. Case rows / sections: scroll-triggered reveal
  4. Case media stage: gentle parallax or mask reveal on enter
  5. Home interlude (hero→services): pin + scrub word/line reveal over backdrop (`#interlude`, `src/scripts/interlude.ts`)
  6. Services tab1 (`fast-landing`): browser-assemble (`src/scripts/landing-assemble.ts`). Start ! after stage fully on screen. Autoloop while tab1 active.
  7. Services tab2 (`deep-site`): 9 depth steps + rising bar chart (`src/scripts/deep-assemble.ts`). Steps highlight 01→09 then all-lit hold; bars grow each step. Violet tab accent. ⊥ Conversion/CR labels (tab3). Gate + reduced-motion → static all-lit + max bars.
  8. Services tab3 (`conversion`): redesign-story browser (`src/scripts/conv-assemble.ts`). Shortened tab1 chassis ⊥ banner row (5 slots: hero/lines/mid/cta/foot), each slot's turn paired 1:1 with a metric count-up (hero→Bounce↓, lines→Conversion rate↑, mid→ROI↑, cta→Leads↑); `foot` = hold beat, all landed. Color follows tab1's own split, ⊥ "every slot morphs color" — hero (wash) + mid (tile wash) + cta (solid) = lime (`--st-tint-2` `#61F185` wash / `--st-accent-2` `#0C972F` solid, same hue); `lines` + `foot-title`/`foot-line`(+`--short`) = plain neutral gray always, before AND after (text-line mockups, ≡ tab1's `.st-slot--lines`/`.st-foot-title`/`.st-foot-line`/`.st-foot-line--short` — never brand-colored, no tab1 `.st-foot-btn` equivalent here so foot has nothing to color). Metric-number (`.st-dash-val`) text = `--st-accent-2`. Direction via arrow ↑/↓, ⊥ red/green mixed colors. Scene (`.st-illu--conv`) = same outer box as tab1 (`.st-illu--landing`: `--st-sq` + aspect `6/7`); browser + metrics both `width: 78%` ≡ `.st-browser--sq`. ⊥ wider full-column stretch. Gate + reduced-motion → static all-after + metrics at target.
  9. Services tab4 (`ecommerce`): tab1 chassis reused verbatim (fly+dock, 4 parts: hero/lines/mid/cta, ⊥ foot/banner) via `src/scripts/store-assemble.ts`; mid = 6 product cards (img+name+price), 2 rows of 3. Cart FAB lives ∈ `.st-shop-frame` (wraps mockup + FAB together) so it travels with the mockup's shrink/shift-left on assembly, ⊥ float fixed against outer scene. Yellow — `--st-tint-3` (`#EBF151`) = pill/pale wash + cta bar/fly solid fill; `--st-accent-3` = `--color-text-primary` (black, ⊥ same-hue-but-darker like tab3 — dark yellow reads mustard/khaki, rejected) = cart-icon glyph + toast-icon glyph (both on solid tint-3 bg, ≡ same recipe — B6: a pale-tint bg + tint-3 glyph was tried for the toast icon and blended into itself, reverted to match the cart's already-working solid-bg/black-glyph pair). Toast card (`.st-shop-toast`) sized up for readability (icon 1.7rem, text 0.78rem, amount 0.82rem). After assembly: 5 live-sale toasts pop near the corner cart FAB, badge ticks up, then fade→reset→reassemble loop. Gate + reduced-motion → static assembled + badge at target, no toasts.
- ⊥ animate everything. Intention > quantity.
- `gsap.matchMedia` + `prefers-reduced-motion: reduce` → instant/opacity-only; interlude → no pin/scrub, static frame + text visible; landing-assemble → static finished site, no loop; deep-assemble → static final steps+bars.

### Services scroll rails
- Desktop pin scroll: `.st-section` height = N rail-units × `100vh` (sticky `.st-stage` pinned inside); a scroll `onScroll` picks whichever `.st-rail`'s center is nearest viewport center → sets active tab (`src/components/ServiceTabsSection.astro` inline script).
- Last rail (tab4, `.st-rail--last`) = `flex: 1.5` (section total `4.5 × 100vh`, ⊥ `4×`) — a hard/fast scroll flick that cleanly carries someone tab1→2→3 needs noticeably more distance to also clear tab4, so it can't fly straight through the last tab into the next section (cases) without a visible pause on it (bug: tab4 was getting skipped entirely on fast scroll — B7).

### Services tabs (home right viz)
- Tab1 `viz-browser`: scene ∈ right column (aspect ~6/7). Parts = hero / lines / CTA / mid squares / foot / blue banner. Coral ≤ 1 accent. ⊥ compress.
- Tab2 `viz-analytics`: compact numbered list (business→audience→competitors→positioning→path→structure→copy→design→build) + clean rising bars. EN+RU labels. ⊥ Conversion label.
- Tab3 `viz-dashboard`: redesign-story browser (shortened tab1 chassis, no banner row) + 2×2 metric cards (Bounce / Conversion rate / ROI / Leads), lime accent, count-up synced per slot. See motion §7-8 above.
- Tab4 `viz-store`: tab1 chassis reused (hero/lines/mid/cta), mid = product cards, yellow accent + live-sale toasts + cart badge (FAB rides mockup corner ∈ `.st-shop-frame`). See motion §9 above. Mobile &lt;768: viz hidden (current).

### Home IA
- Order: hero → **interlude** (manifesto / about beat) → services → cases → approach → discuss CTA
- Interlude = pin mid-viewport: stage `100svh`, frame centered with `--section-gap` top+bottom + `--content-inline` sides. Width/height screen-fluid (`calc(100svh - 2*section-gap)` × content width). `border-radius: var(--radius-media)`, cover, asset `simulator_backdrop.webp`. ⊥ fixed px media box. Cite V7.

### Case layout (ref `docs/design/figma-case.png`)
- **Home cases stage** (`#cases`): sticky opaque stage + rails. Chrome (inactive short bars / active long bar + index) spans above columns. Grid `1.125fr / 1fr` + `2.5rem` gutter. Result on soft `--color-blue-tint` plaque; serif copy, weight 400. Solution list = text only (⊥ icons). «Что сделано» = blue label, normal weight. Classic snapshot = commit `037d452`. ⊥ case deep-link CTA while write-ups deferred.
- Home copy spine: Tag → Project → Problem (Was) → Solution (Done) → Result metrics? | qualitative. Role honesty kept. Stack = case page only.
- Case page: Tag/Service (serif H) + project caption (link · roles) | Problem | Solution (+ Result) + media stage. May reuse expanded fields.
- Result ? only real number when claim metric (Honesty > volume). ⊥ invent / empty placeholder row.
- Media: video stage preferential; poster while loading. Optional live URL | immersive demo.
- Mobile &lt;900: pin off → stacked cases (readable), same copy spine.
- v1 home featured while redesign lands: **progolos** + **grom-bike** + **creator**; other registry cases wait approval (T28).

### Brand / tech
- Tokens + motion scripts under `src/styles/`, `src/scripts/motion.ts` (?)
- form: POST → `GOOGLE_SCRIPT_URL` ∈ `src/config.ts`
- middleware: Typograf — на static host ? skip/runtime unavailable; Typograf build-time optional
- Design refs: `docs/design/figma-hero.png`, `docs/design/figma-case.png`

## §V Invariants
V1: Nav cold = Cases | Review | Contacts + Discuss CTA (+ lang). Blog/paid-audit ∉ nav. `/code` URL ok, ∉ primary nav.
V2: Brand colors = Notion set + tab family (§I). Primary `#0274DE` ! ∀ real CTA. ∀ tab ! two-tier pair: `--st-tint-N` (light, pill bg + pale wash, ~contrast 1-2 vs white — bg only) + `--st-accent-N` (dark/saturated, ≥3:1 vs white — solid buttons/bars/lines + digit/text color), same hue as tint-N *unless that hue has no readable dark variant* (yellow → mustard/khaki; there use `--color-text-primary` black instead — B3). ⊥ accent ≡ tint (too light to read as line/digit — B1/B2 cause was a badly *chosen* 2nd shade — muddy hue or copy-of-tint — not the 2-tier idea itself). ⊥ acid neon direct (`#9DFF20`/`#6EDB00`).
V3: Hero = Figma type-led: brand logo-block + 1 H1 + 1 support + See-cases cue. Header holds primary CTA. ⊥ pricing/stats/audit-sim/dashboard в hero.
V4: Home/cases показывают реальные работы. Media stage prefer video of site interaction over still-only. ⊥ placeholder B2B/SaaS выдумки.
V5: Brand type = Source Serif 4 (headings) + Source Sans 3 (body/UI), local woff2. ≠ Inter/Roboto/Arial/system как primary. EN+RU same stack.
V6: Primary CTA = Discuss / Telegram | free express-audit as conversation. ⊥ paid audit price as primary.
V7: Перед новым разделом → cite §G: помогает cold lead? Нет → ⊥.
V8: Agent session ! читать `SPEC.md` + `.cursor/rules/ulyanaweb.mdc` до кода.
V9: ∀ case card ! role tag: design | layout | copy | structure | booking UX | full. Honesty > volume.
V10: Demo-кейсы (hotel tree) под `/cases/...`; immersive demo без brand Header OK.
V11: Brand UI ! EN+RU паритет. Default EN. Auto locale: cookie → client IP geo → Accept-Language → `en`.
V12: Manual lang switch ! persist cookie + twin URL. Geo ⊥ override cookie. IP API ≤ 1× / visitor until cookie set.
V13: `html[lang]` + hreflang корректны ∀ bilingual page.
V14: Один static build → reg.ru; `.ru` + `.com` (когда купишь) = same site.
V15: Case structure = Tag/Service (H) + project caption | Problem (Was) | Solution (Done, list OK) (+ Result ? metric) + media stage (video). Home desktop = sticky stage, video|copy split, content-layer crossfade on scroll rails ⊥ whole-card scroll-away. Stack = case-page only.
V20: ∀ user-facing copy ∈ i18n dicts. Author RU first → sync EN. Nested semantic keys. ⊥ hardcoded strings ∈ components.
V16: GSAP motion on brand surfaces; honor `prefers-reduced-motion`. ≥2 intentional motions on home.
V17: Single-sentence UI fragments (cards, labels, subheads, short leads) ⊥ trailing period when no following sentence.
V18: Agent ! treat `SPEC.md` as source of truth for scope/IA/type/copy spine. Code explore only for narrow fix or SPEC drift.
V19: **Phase gate** — Phase 2 (blog nav, expand services pages, more cases) ⊥ until v1 Definition of Done (§Notes) = met. Amend SPEC → then code.

## §T Tasks
| id | status | task | cites |
|----|--------|------|-------|
| T1 | x | Написать SPEC + Cursor rule | V8 |
| T1b | x | Amend: wooden-room demo; IA; real cases | §C,§I |
| T1c | x | Amend: EN-primary bilingual + geo locale | V11–V13 |
| T1d | x | Amend: host reg.ru + planned .com; client IP geo | V14,§I |
| T1e | x | Amend: Figma hero/case + Notion tokens + GSAP | V2,V3,V15,V16 |
| T2 | x | Apply Notion tokens in `global.css`; kill lime | V2 |
| T3 | x | Nav = Figma (Cases/Review/Contacts + Discuss); hide blog/audit | V1,V6 |
| T4 | x | Rebuild home to Figma hero (+ EN copy) | V3,V4,V6,V11,V16 |
| T5 | x | Brand fonts: Source Serif 4 (heads) + Source Sans 3 (body), local woff2, EN=RU | V5 |
| T6 | ~ | Case registry + template: Service\|Problem\|Solution\|+Result + video; stack page-only | V4,V9,V15 |
| T7 | . | Hotel case tree + brief wrapper | V10 |
| T8 | . | Обновить `llms.txt` + README | §G |
| T9 | . | later Phase2: `/audit` psych rebuild + i18n | V1,V19 |
| T10 | . | later Phase2: blog в nav + IA | V1,V19 |
| T11 | . | later: progolos → subdomain | §I |
| T12 | ~ | i18n scaffold: dicts, `/ru`, switcher done; client IP geo still open | V11–V14 |
| T13 | . | later: `.com` DNS + canonical | V14 |
| T14 | x | Wire GSAP + ScrollTrigger motion pack (hero/reveal/cue) | V16 |
| T15 | ~ | Case videos embedded (creator, grom, progolos, wooden); polish/compress + posters | V4,V15 |
| T16 | x | Home interlude: Starry Night pin+scrub between hero/services | V7,V16,V17 |
| T17 | x | Services tab1 viz: tall browser assemble loop (GSAP) | V2,V16,§I |
| T18 | x | Services tab2 viz: 9 depth steps + rising bars | V2,V16,§I |
| T19 | x | Services tab3 viz: redesign-story slots + metric count-up | V2,V16,§I |
| T20 | x | Services tab4 viz: store assemble (tab1 chassis) + sale toasts + cart badge | V2,V16,§I |
| T20b | x | Serif heading letter-spacing (−0.01em; was grotesk −0.03em) | V5 |
| T21 | . | Copy pass under serif: hero + section heads EN/RU (shorter lines, air) | V3,V11,V17 |
| T22 | ~ | Case proof + copy: Service/Problem/Solution/Result (инфостиль); posters; role tags | V4,V9,V15,V17 |
| T23 | . | Reviews section = real social proof (nav Review ! empty) | V1,§G |
| T24 | . | Drop unused Neue Montreal from brand (keep only if hotel-demo needs) | V5 |
| T25 | . | later: client IP geo soft-redirect (cookie wins) | V11–V12 |
| T26 | . | later Phase2: dedicated service pages polish EN+RU parity | V11,V19 |
| T27 | . | later Phase2: expand case registry (more real works + video) | V4,V9,V15,V19 |
| T28 | ~ | Home cases: cinema-band A + B readable copy; metrics only when real | V4,V15,V16,V20 |
| T29 | . | After T28 OK: migrate remaining featured cases to new panel format | V4,V15,V19 |

## §B Bugs
| id | date | cause | fix |
|----|------|-------|-----|
| B1 | 2026-07-25 | services-tabs lime/yellow accent split into 2 shades (bright tint + separately-derived muted/pale accent) → pale one invisible, dark one read dirty/mustard | 1st fix: collapsed to 1 hex/tab (accent≡tint) + forced text/bars black-or-gray. Superseded by B2 — see below |
| B2 | 2026-07-25 | B1's "1 hex" fix made `--st-accent-2` = pale `--st-tint-2` (`#A9F795`→`#61F185`) — too light to draw as a line/digit (contrast ~1.3-1.5 vs white); downstream cta-bar/foot-line/metric-numbers got hardcoded to gray/black instead, drifting from tab1/tab2's own pattern (solid `--color-blue`/`--color-violet` accent used directly for buttons+active text) | V2: real fix was never "1 hex" — pick a proper 2nd hex, same hue as tint, dark/saturated enough for ≥3:1 vs white (`--st-accent-2` = `#27863F`, hue matches `--color-lime` `#61F185`). Applied to cta bar, foot-line, `.st-dash-val` digit text |
| B3 | 2026-07-25 | Tab4 (yellow) had the same B2 gap: `--st-accent-3` ≡ `--st-tint-3`, cta bar/fly hardcoded gray | Yellow has no usable dark-but-still-yellow (reads mustard/khaki — stays ⊥ per §C). Set `--st-accent-3: var(--color-text-primary)` (black) as the tab's 2nd color instead of a same-hue derivative; fixed `.st-shop-toast-icon` (was bg:accent-3+color:text-primary → black-on-black) to bg:tint-3 + color:accent-3 |
| B4 | 2026-07-25 | Over-corrected B2: colored tab3's `--lines` span + `--foot` title/line green too, "morphs dull→lime" (§I bullet 8) read as *every* slot recolors. But tab1 (the actual reference) only colors hero/mid/cta — its `.st-slot--lines`/`.st-foot-title`/`.st-foot-line` are plain gray always, only `.st-foot-btn` (a real button) gets `--color-blue` | Reverted lines/foot-title/foot-line to permanent neutral gray (no `.is-after` override) — matches tab1 exactly: text-line mockups ⊥ brand color, only hero/mid/cta (banner/tile/button) carry it. Amended §I bullet 8 |
| B5 | 2026-07-25 | B3's fix set `--st-accent-3` = black, but tab4's hero/product-img/mid/fly/toast *washes* still read that same var at low % for their pale tint (`color-mix(accent-3 14%, #fff)` etc) — with accent-3 now black those washes turned pure grayscale, whole tab4 illustration looked gray. Separately, tab3's hero/mid washes used low-% mixes of the *dark* `--st-accent-2` (12-32%) instead of the *light* `--st-tint-2` directly, unlike tab1's pattern (uses `--color-blue-tint` directly) — read washed-out/muddy vs tab1's vivid blue. `--st-accent-2` itself (`#27863F`, S55%) also read dull/blackish next to tab1's saturated `#0274DE` | Tab4: swapped all wash-only `--st-accent-3` refs (hero/product-img/mid/fly/toast-border, ⊥ solid cta fill + toast-icon color, those stay black) → `--st-tint-3`, restoring yellow tint in washes. Tab3: hero/mid washes now mix `--st-tint-2` (was `--st-accent-2`) matching tab1's direct-tint recipe. Bumped `--st-accent-2` → `#0C972F` (S85%, brighter/more saturated, ⊥ black-mixed muddy read), still ≥3:1 vs white |
| B6 | 2026-07-25 | Tab4 cta bar (`.st-shop-slot--cta`/`.st-shop-fly--cta`) fill flipped `--st-accent-3`(black)→`--st-tint-3`(yellow) on request, then toast-icon flipped bg `--st-tint-3`(solid)→28%-tint + glyph `--st-accent-3`(black)→`--st-tint-3` on the same "no black" ask — but glyph-on-28%-tint-bg is same hue at low contrast, bell icon blended into its own chip (unreadable), regressing the original black-on-black concern from B3 into a yellow-on-yellow one | Toast-icon reverted to bg `var(--st-tint-3)` (solid) + glyph `var(--st-accent-3)` (black) — matches `.st-shop-cart`'s already-working bg/glyph pair exactly. Cta bar fill stays yellow (that one has enough surrounding white/gray to read fine solid) |
| B7 | 2026-07-25 | Services scroll-pin used 4 equal `100vh` rails (1 per tab) with plain nearest-rail-center `onScroll`, no minimum dwell — a hard/fast scroll flick could cross the whole tab4 rail's capture zone in one gesture and land past the section entirely, so tab4 (last tab, ecommerce) was never consciously seen. CSS `scroll-snap` was considered but rejected: this page already runs GSAP ScrollTrigger `pin:true` (interlude) and mixing native scroll-snap with ScrollTrigger pinning is a known conflict source (janky/incorrect pin recalculation) | Gave the last rail (`.st-rail--last`) `flex: 1.5` and bumped `.st-section` height `4×100vh → 4.5×100vh` — tab4 now needs ~50% more scroll distance to clear, so the same flick that comfortably crosses tabs 1→2→3 can no longer also skip tab4 unnoticed. Purely local to this section; no global scroll behavior touched |
| B8 | 2026-07-31 | Home cases sticky `.case-pin` stack read as whole-screen card cover, not content-block change; expanded case copy needs fuller panel | T28: sticky full-viewport **stage** + N scroll rails; active rail swaps layered copy/video via opacity+y (in from below). Desktop split video\|copy, no card chrome. ⊥ document-wide scroll-snap during interlude/services pins. Mobile: stacked, no pin |

## §Notes (context, not law)

### Definition of Done — v1 (витрина + смыслы)
v1 = done when ∀ true:
1. **Visual** — Source Serif 4 / Source Sans 3 live EN+RU; tokens Notion; no lime; letter-spacing serif ≈ −0.01em; weight table: heads Serif 500, body/nav/btn Sans 400–500, logo Kirp Sans 300; hierarchy via family ⊥ weight spam.
2. **Home cold path** — hero (H1 + support + cue) → interlude → services → cases (video proof) → approach → Review ! empty → Discuss CTA. Nav matches V1.
3. **Marketing spine** — §G who/promise/proof/path readable on page (EN+RU parity); ⊥ draft gibberish / empty Review.
4. **Cases** — ∀ featured: Tag\|Project\|Problem\|Solution (+ Result ? metric) + working video + role tag; home = full-viewport snap panels (content-block transition); stack on case page only; posters preferred.
5. **i18n** — `/` EN + `/ru/...` parity for brand surfaces; lang cookie + switcher. Geo soft-redirect ? nice-to-have (T25), ⊥ block v1.
6. **Ship** — `astro build` → `dist/` → reg.ru; no commercial Neue Montreal on brand live.
⊥ v1 scope: blog in nav, audit as product, `.com` canonical, Phase2 expansions.

### Phase 2 — after v1 DoD (amend SPEC before code)
Order when opening Phase2:
1. **Blog** — content model + index/slug EN+RU; then nav (T10). Hidden files OK until ready.
2. **Services pages** — dedicated `/services/...` (+ `/ru/services/...`) polish; home tabs stay overview (T26).
3. **More cases** — registry growth; video+role required (T27). Honesty > volume.
4. Optional: `/audit` rebuild (T9); progolos subdomain (T11); `.com` (T13).
Gate: V19 — ⊥ start Phase2 tasks as “now” until v1 DoD checked off in §Notes / §T.

### Next-up plan (2026-07-25) — finish v1 cold lead
1. **Case proof** (T22/T15) — posters + compress heavy mp4; role tags honest.
2. **Reviews** (T23) — real social proof.
3. **Copy under serif** (T21) — hero + section heads EN/RU; shorter lines (deferred until asked).
4. **Cleanup** (T24) — drop unused Neue Montreal from brand if hotel-demo OK without.
5. **llms.txt + README** (T8).
6. **Geo** (T25) — nice-to-have after v1 feel solid.
7. **`.com` later** (T13).
⊥ now: blog/audit в nav; Phase2 expand; soft rounded sans (Nunito); ломать GSAP pack.

- Мало «полных» кейсов — нормально. Честная роль > пустой каталог.
- `wooden-room` = demo case booking UX (Aliya). Сеть → отель → номер.
- creator.ulyanaweb.ru = live case. progolos = pending subdomain.
- Figma copy draft-y (EN/RU mix, «bisness») — polish when writing i18n dicts; structure wins now.
- Case video: screen record (CleanShot / OBS) реального сайта → webm/mp4 в `public/cases/...`, autoplay muted loop OK + controls; лучше короткий 15–40s highlight path.
- Grom.bike в Figma = пример разметки кейса (тексты-черновики).
- Review ∈ nav = отзывы / social proof section (не code review).
- Motion: people love it — но Notion calm + GSAP punch = subtle polish, не carnival.
- Рестарт order: tokens → header/hero Figma → case template → GSAP → i18n → videos.
- Host = reg.ru static; `.com` later same `dist/`.

### Hidden / keep
- `/blog/*` hide nav. `/audit*` keep files, out of nav, rebuild later.
- Cases model: live URL | text-role | immersive `/cases/...` + video stage.
