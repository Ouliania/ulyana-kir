# Routes — ulyanaweb

This project uses Astro file-based routing. Localization is handled via localized subdirectories (e.g. `src/pages/ru/` for Russian).

## Route Mapping

| URL Path | Localized Path (RU) | Component File | Description |
|---|---|---|---|
| `/` | `/ru/` | `src/pages/index.astro` / `src/pages/ru/index.astro` | Home Page (includes services, case previews, reviews) |
| `/cases/` | `/ru/cases/` | `src/pages/cases/index.astro` / `src/pages/ru/cases/index.astro` | Cases archive listing |
| `/cases/[slug]` | `/ru/cases/[slug]` | `src/pages/cases/[slug].astro` / `src/pages/ru/cases/[slug].astro` | Individual Case Study detail page |
| `/contacts/` | `/ru/contacts/` | `src/pages/contacts.astro` / `src/pages/ru/contacts.astro` | Contact and discussion page |
| `/code/` | `/ru/code/` | `src/pages/code.astro` / `src/pages/ru/code.astro` | Code / Site toy page (showcases custom layouts) |
| `/audit/` | — | `src/pages/audit.astro` | Audit/Services landing page |
| `/privacy-policy/`| `/ru/privacy-policy/`| `src/pages/privacy-policy.astro` / `src/pages/ru/privacy-policy.astro` | Privacy Policy page |
