# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# code-style
- Do not add a period at the end of standalone sentences, especially in cards, subheadings, and labels. Confidence: 0.85
- Two languages (RU/EN) with API-based locale detection to serve the correct language. Confidence: 0.70
- Use the Notion-inspired color palette: #0274DE, #F57564, #62ACEF, #2B9D99, #E6F4FE (no beige paper #F6F5F4). Confidence: 0.75

# typography
- Use Manrope font for Russian text. Confidence: 0.70

# animation
- Add modern, engaging animations throughout the site (motion, interactive hover effects, interesting transitions). Confidence: 0.70
- Use GSAP for scroll-driven animations and complex motion effects. Confidence: 0.70
- Scroll-triggered viz/assembly animations should not start immediately — insert a short pause (~0.8s) so the user can absorb the static layout before parts begin moving. Confidence: 0.70
- Avoid empty/stark sections — pair scroll-pinning mechanics with rich visuals: backgrounds, imagery, or animated elements to prevent a boring look. Confidence: 0.65

# code-style
- Do not duplicate label in UI headings — if a tab/pill already says what something is, do not repeat the same label as an h3 inside the card. Confidence: 0.85
- Prefers concise, punchy tab/pill labels — typically 2–3 words rather than longer descriptive phrases. Confidence: 0.65
- For service/offer cards: value-heading (large) → action buttons → bullet list. No descriptive paragraph between heading and buttons — the heading itself carries the description. Confidence: 0.80
- Marketing headings should be outcome-driven and benefit-oriented — answer "what the client gets" rather than "what I do." Use confident, concrete language from first person or result perspective. Confidence: 0.80
- In Russian marketing copy, prefers "вёрстка" (layout/coding) over "разработка" (development) when describing the design-to-code service — positions the offering as design + precise implementation, not broad software development. Confidence: 0.75

# workflow
See [workflow/taste.md](workflow/taste.md)
