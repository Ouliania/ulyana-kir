# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# code-style
- Do not add a period at the end of standalone sentences, especially in cards, subheadings, and labels. Confidence: 0.85
- Two languages (RU/EN) with API-based locale detection to serve the correct language. Confidence: 0.70
- Use the Notion-inspired color palette: #0274DE, #F57564, #62ACEF, #2B9D99, #E6F4FE (no beige paper #F6F5F4). No muddy/dirty color variants — every color must be clean and recognizable. Consistency within a component: the same accent color used in a tab should be the one driving the tab's visualization. Confidence: 0.80

# typography
- Use Source Serif 4 (serif, headings) + Source Sans 3 (sans, body) from Google Fonts — free, no license purchase needed. Confidence: 0.90
- Headings (H2) can vary in style between blocks — some blocks emphasize the heading (serif, larger, prominent), others emphasize the content with a subdued heading. Design the heading role per-block, not one-size-fits-all. Confidence: 0.85
- Base body text is 1rem (16px). Smaller sizes (14–15px) are reserved for special design cases or secondary text, not the default. Confidence: 0.80
- Convert raw px/rem values into design system tokens rather than hardcoding them in components. Confidence: 0.80

# animation
See [animation/taste.md](animation/taste.md)
# code-style
See [code-style/taste.md](code-style/taste.md)
# layout
- Every page section should be a `<section>` wrapper with standard padding — spacing lives on the section, not on inner div/container. Confidence: 0.85
- Left-edge alignment: all content/h2 headings should start from the same left boundary as other blocks — no drifting offsets. Confidence: 0.75
- Use CSS Grid `fr` units for two-column layouts rather than fixed widths — allows proportional sizing (e.g., visual column slightly wider than copy column). Confidence: 0.70

# case-cards
- Case card information hierarchy: service tag → chips/labels → project description → problem → solution → result. Service label is the primary heading, not the project name. Confidence: 0.85
- Result blocks use a serif font (matching heading font) at a size between heading and body — elevated but not giant. On a subtle background plate to separate from body text. Confidence: 0.70
- Bullet lists in cases: small blue dot markers (not heavy bullets), consistent with the services block. Confidence: 0.75
- Tags/chips: outlined style (no solid fill), normal weight, no caps — placed next to the service label in the same row. Confidence: 0.70
- Slider pagination: active indicator larger than inactive ones, styled as bars (not dots). Confidence: 0.70

# marketing
- Marketing copy must stay calm and trust-building — avoid aggressive loss-aversion framing (e.g., "Stop losing customers," "Хватит терять клиентов"). The user's voice is Notion-inspired, subtle, and positions the site as "working as part of the business," not as a fear-based funnel. When in doubt, err softer. Confidence: 0.75
- When marketing copy doesn't fit the visual layout (line breaks, overflow, cramped space), practical fit wins over tonal or conceptual purity — but first try CSS/layout adjustments (font-size clamp, flex-wrap, max-width) to accommodate the desired copy. Only revert to shorter alternatives when layout adjustments are exhausted. The layout constraint is non-negotiable. Confidence: 0.85
- Among CSS fixes for overflow, prefer widening the container (max-width/max-inline-size) before reducing font size or allowing text wrap — preserving large, impactful typography is higher priority than constraining the block to a narrow measure. Confidence: 0.65
- Multi-line headings should break at semantic phrase boundaries, not mid-thought — e.g., "I build websites / tailored to business goals" rather than "I build websites tailored to / business goals." The user will specify which phrase belongs together on a line. Confidence: 0.70

# i18n
- Master locale is Russian — all new keys created in RU first, then propagated to EN and other locales. Confidence: 0.85
- Never hardcode user-facing strings in components; always use i18n keys with dot-notation (`t('section.key')`). Confidence: 0.85
- EN translations should use the direct lexical equivalent of the Russian verb — prefer the closest English cognate over looser synonyms, especially in headlines where a register shift changes the voice (e.g., «создаю» → "create," not "build"). Confidence: 0.45
- For EN marketing copy, natural idiomatic English that captures intent and tone beats strict cognate-matching with the RU source — the user will supply or approve the final EN copy, often rewriting the entire passage rather than tweaking individual words (e.g., «Создаю сайты под задачи бизнеса» → "I build websites tailored to business goals," not "Creating websites for business goals"). Confidence: 0.85
- In EN copy, prefers "no-code" as a standalone term (without trailing "platforms") when describing site-building tools — user explicitly removed "platforms" from "no-code platforms," leaving just "code or no-code." Confidence: 0.60

# workflow
See [workflow/taste.md](workflow/taste.md)
