# Extractable Components — ulyanaweb

This file catalogs UI components from the codebase that can be extracted as reusable Superdesign `DraftComponent` entities.

## Header
- Source: `src/components/Header.astro`
- Category: layout
- Description: Main top navigation with logo wordmark, localized page links, language switcher, and discussion CTA.
- Extractable props: locale (string, default: "en")
- Hardcoded: Logo text, menu items list, discussion Telegram link

## Footer
- Source: `src/components/Footer.astro`
- Category: layout
- Description: Site footer with logo, localized links, Telegram link, copyright, and privacy policy link.
- Extractable props: locale (string, default: "en")
- Hardcoded: Logo text, links list, copyright text

## InteractiveHoverButton
- Source: `src/components/InteractiveHoverButton.astro`
- Category: basic
- Description: Interactive button styling used for call-to-actions.
- Extractable props: href (string), label (string), target (string), rel (string), type (string)
- Hardcoded: CSS transition classes

## CaseStackList
- Source: `src/components/CaseStackList.astro`
- Category: basic
- Description: Stacked and sticky-scrolling showcase of business case studies.
- Extractable props: locale (string, default: "en")
- Hardcoded: case studies mock/data fetch, CSS classes for GSAP animation
