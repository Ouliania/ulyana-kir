# Custom Rules for ulyanaweb-2026

## Focus & Scope
- **Do not stray into unrelated tasks:** Never autonomously launch browser subagents to test unrelated pages or features (such as language translation checks, calculator testing) unless the user explicitly requested it.
- **Verification scope:** When verifying changes, check only the specific URL and element target of the current task. Do not navigate to other parts of the site.
- **No unsolicited testing:** Only perform verification using standard `curl` or browser checks on the current active local server port (typically `http://localhost:4321/`).

## Collaboration Protocol (How to work with the User)
1. **Plan First:** Before making ANY code edit (except extremely trivial typos), write a short, clear step-by-step description of:
   - What file will be modified.
   - What lines and what logic will change.
   - Why this change is necessary.
   - Do NOT include full "before/after" code snippets in the plan to save tokens and maintain speed; summarize conceptually.
   Wait for the user's "Proceed" or feedback before touching the code.
2. **One File at a Time:** Focus on one file at a time. Implement changes sequentially, verifying the first one before proceeding to the second.
3. **No Blind Animation/JS Edits:** If the browser verification tool fails or cannot capture screenshots, do not write complex JS or GSAP positioning logic blindly. Ask the user for description or feedback first.
4. **CSS Over JS for Layout:** Any responsive adjustments (paddings, element hiding, sizes on different screen heights) must be done strictly via CSS media queries. Do not use JS/GSAP to calculate static layouts.
5. **Concise Communication:** Keep answers short, dry, and direct. Avoid conversational filler or long explanations.
