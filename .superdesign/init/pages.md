# Pages — ulyanaweb

This file documents the dependency trees for the key entry-point pages.

## Home Page
URL: `/` (EN) & `/ru/` (RU)  
Entry: `src/pages/index.astro` / `src/pages/ru/index.astro`  
Dependencies:
- `src/components/HomePage.astro`
  - `src/layouts/Layout.astro`
  - `src/components/Header.astro`
    - `src/components/Wordmark.astro`
    - `src/components/LangSwitch.astro`
    - `src/components/InteractiveHoverButton.astro`
  - `src/components/Footer.astro`
    - `src/components/Wordmark.astro`
  - `src/components/PageShell.astro`
  - `src/components/CaseStackList.astro`
  - `src/components/InteractiveHoverButton.astro`
  - `src/components/KineticText.astro`
  - `src/components/Interlude.astro`
  - `src/components/ServiceTabsSection.astro`
  - `src/components/WorkFlow.astro`
  - `src/components/CtaSiteToy.astro`

## Cases Archive
URL: `/cases/` (EN) & `/ru/cases/` (RU)  
Entry: `src/pages/cases/index.astro` / `src/pages/ru/cases/index.astro`  
Dependencies:
- `src/components/CasesArchivePage.astro`
  - `src/layouts/Layout.astro`
  - `src/components/Header.astro`
    - `src/components/Wordmark.astro`
    - `src/components/LangSwitch.astro`
    - `src/components/InteractiveHoverButton.astro`
  - `src/components/Footer.astro`
    - `src/components/Wordmark.astro`
  - `src/components/PageShell.astro`
  - `src/components/Breadcrumbs.astro`
  - `src/components/CaseStackList.astro`

## Individual Case Page
URL: `/cases/[slug]` (EN) & `/ru/cases/[slug]` (RU)  
Entry: `src/pages/cases/[slug].astro` / `src/pages/ru/cases/[slug].astro`  
Dependencies:
- `src/components/CasePage.astro`
  - `src/layouts/Layout.astro`
  - `src/components/Header.astro`
    - `src/components/Wordmark.astro`
    - `src/components/LangSwitch.astro`
    - `src/components/InteractiveHoverButton.astro`
  - `src/components/Footer.astro`
    - `src/components/Wordmark.astro`
  - `src/components/PageShell.astro`
  - `src/components/Breadcrumbs.astro`
  - `src/components/InteractiveHoverButton.astro`
  - `src/components/KineticText.astro`
