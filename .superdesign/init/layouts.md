# Layouts — ulyanaweb

## Root Layout
Path: `src/layouts/Layout.astro`  
Renders the standard HTML page structure, Google Font link tags, SEO meta, schema, and basic global styles.

```astro
---
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
  image?: string;
  canonicalURL?: string;
  schema?: Record<string, unknown>;
  lang?: 'en' | 'ru';
}

const {
  title,
  description = 'Ulyana Kirpichnikova — websites as sales tools. Structure, copy, design, and launch.',
  image = '/og-image.png',
  canonicalURL = Astro.url.href,
  schema,
  lang = 'en',
} = Astro.props;

const defaultSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Ulyana Kirpichnikova',
  image: Astro.site ? new URL(image, Astro.site).toString() : canonicalURL,
  description,
  url: canonicalURL,
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'RU',
  },
  knowsAbout: [
    'Web Design',
    'UX/UI Design',
    'Conversion Rate Optimization',
    'Copywriting',
    'Astro Development',
  ],
};

const finalSchema = schema || defaultSchema;
---

<!DOCTYPE html>
<html lang={lang}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <link rel="icon" href="/favicon.ico" />
    <link
      rel="preload"
      href="/fonts/source-serif-4-latin-500-normal.woff2"
      as="font"
      type="font/woff2"
      crossorigin
    />
    <link
      rel="preload"
      href="/fonts/source-sans-3-latin-400-normal.woff2"
      as="font"
      type="font/woff2"
      crossorigin
    />
    {
      lang === 'ru' && (
        <>
          <link
            rel="preload"
            href="/fonts/source-serif-4-cyrillic-500-normal.woff2"
            as="font"
            type="font/woff2"
            crossorigin
          />
          <link
            rel="preload"
            href="/fonts/source-sans-3-cyrillic-400-normal.woff2"
            as="font"
            type="font/woff2"
            crossorigin
          />
        </>
      )
    }
    <meta name="generator" content={Astro.generator} />
    <title>{title}</title>
    <meta name="title" content={title} />
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalURL} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonicalURL} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:title" content={title} />
    <meta property="twitter:description" content={description} />
    <meta property="twitter:image" content={image} />
    <script type="application/ld+json" is:inline set:html={JSON.stringify(finalSchema)} />
  </head>
  <body>
    <slot />
    <script>
      import { initMagicSurfaces } from '../scripts/magic-surface';
      import { initHeadingReveal } from '../scripts/heading-reveal';
      initMagicSurfaces();
      initHeadingReveal();
    </script>
  </body>
</html>
```

## PageShell Frame
Path: `src/components/PageShell.astro`  
Renders the white content substrate over the page frame.

```astro
---
/**
 * White content substrate on the beige page frame (Apollo-style).
 * Header stays outside; wrap <main> + <Footer> here.
 */
---

<div class="page-shell">
  <slot />
</div>
```

## Navigation Header
Path: `src/components/Header.astro`  
Renders the fixed top navigation bar, logo wordmark, lang switch, and discussion CTA.

```astro
---
import Wordmark from './Wordmark.astro';
import LangSwitch from './LangSwitch.astro';
import InteractiveHoverButton from './InteractiveHoverButton.astro';
import { localeFromPath, t, type Locale } from '../i18n/ui';

interface Props {
  locale?: Locale;
}

const locale = Astro.props.locale ?? localeFromPath(Astro.url.pathname);
const pathname = Astro.url.pathname;
const homePath = locale === 'ru' ? '/ru/' : '/';
const isHome =
  pathname === homePath ||
  pathname === homePath.replace(/\/$/, '') ||
  (locale === 'en' && (pathname === '/' || pathname === ''));
const contactsHref = locale === 'ru' ? '/ru/contacts/' : '/contacts/';
const discussHref = 'https://t.me/UlyanaKir';
const casesHref = locale === 'ru' ? '/ru/cases/' : '/cases/';
const servicesHref = isHome ? '#services' : `${homePath}#services`;
const reviewHref = isHome ? '#reviews' : `${homePath}#reviews`;
---

<header class="main-header">
  <div class="header-bar">
    <Wordmark href={homePath} />

    <input type="checkbox" id="menu-toggle" class="menu-toggle" aria-label="Open menu" />
    <label for="menu-toggle" class="burger" aria-hidden="true">
      <span></span>
      <span></span>
    </label>

    <nav class="nav" aria-label="Primary">
      <div class="nav-links">
        <a href={casesHref} class="nav-link">{t(locale, 'navCases')}</a>
        <a href={servicesHref} class="nav-link">{t(locale, 'navServices')}</a>
        <a href={reviewHref} class="nav-link">{t(locale, 'navApproach')}</a>
        <a href={contactsHref} class="nav-link">{t(locale, 'navContacts')}</a>
      </div>
      <div class="nav-end">
        <LangSwitch locale={locale} />
        <InteractiveHoverButton href={discussHref} target="_blank" rel="noopener noreferrer" class="header-cta" label={t(locale, 'discuss')} />
      </div>
    </nav>
  </div>
</header>

<style>
  .main-header {
    position: fixed;
    inset: 0 0 auto 0;
    z-index: 100;
    height: var(--header-height);
    background: color-mix(in srgb, var(--color-shell) 88%, transparent);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    /* Match page-shell outer edge, then section content inset */
    padding-inline: calc(var(--page-shell-inset) + var(--content-inline));
  }

  .header-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    width: 100%;
    max-inline-size: none;
  }

  .menu-toggle {
    display: none;
  }

  .burger {
    display: none;
    flex-direction: column;
    justify-content: center;
    gap: 6px;
    width: 28px;
    height: 28px;
    z-index: 110;
    cursor: pointer;
  }

  .burger span {
    display: block;
    height: 2px;
    width: 100%;
    background: var(--color-text-primary);
    transition: transform 0.25s ease, opacity 0.25s ease;
  }

  .nav {
    display: flex;
    align-items: center;
    gap: 2rem;
    flex: 1;
    justify-content: flex-end;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 1.75rem;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .nav-link {
    font-size: 0.95rem;
    font-weight: 400;
    color: var(--color-text-secondary);
    transition: color 0.15s ease;
  }

  .nav-link:hover {
    color: var(--color-text-primary);
  }

  .nav-end {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-shrink: 0;
  }

  .header-cta {
    flex-shrink: 0;
  }

  @media (max-width: 900px) {
    .burger {
      display: flex;
    }

    .nav-links {
      position: static;
      transform: none;
      flex-direction: column;
      gap: 1.5rem;
    }

    .nav {
      position: fixed;
      inset: 0 0 0 auto;
      width: min(80vw, 320px);
      height: 100vh;
      background: var(--color-surface);
      border-left: 1px solid var(--color-border);
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 2rem;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      z-index: 105;
    }

    .nav-end {
      flex-direction: column;
      gap: 1.25rem;
    }

    body:has(.menu-toggle:checked) .nav {
      transform: translateX(0);
    }

    body:has(.menu-toggle:checked) .burger span:first-child {
      transform: translateY(4px) rotate(45deg);
    }

    body:has(.menu-toggle:checked) .burger span:last-child {
      transform: translateY(-4px) rotate(-45deg);
    }
  }
</style>
```

## Footer
Path: `src/components/Footer.astro`  
Renders the footer content with navigation links and copyright info.

```astro
---
import Wordmark from './Wordmark.astro';
import { localeFromPath, t, type Locale } from '../i18n/ui';

interface Props {
  locale?: Locale;
}

const locale = Astro.props.locale ?? localeFromPath(Astro.url.pathname);
const year = new Date().getFullYear();
const homePath = locale === 'ru' ? '/ru/' : '/';
const isHome =
  Astro.url.pathname === homePath ||
  Astro.url.pathname === homePath.replace(/\/$/, '') ||
  (locale === 'en' && (Astro.url.pathname === '/' || Astro.url.pathname === ''));
const contactsHref = locale === 'ru' ? '/ru/contacts/' : '/contacts/';
const codeHref = locale === 'ru' ? '/ru/code/' : '/code/';
const privacyHref = locale === 'ru' ? '/ru/privacy-policy/' : '/privacy-policy/';
---

<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-brand">
      <Wordmark href={homePath} />
      <p>{t(locale, 'footerTagline')}</p>
    </div>
    <nav class="footer-nav" aria-label="Footer">
      <a href={isHome ? '#cases' : `${homePath}#cases`}>{t(locale, 'navCases')}</a>
      <a href={isHome ? '#reviews' : `${homePath}#reviews`}>{t(locale, 'navApproach')}</a>
      <a href={contactsHref}>{t(locale, 'navContacts')}</a>
      <a href={codeHref}>{t(locale, 'codeSites')}</a>
      <a href="https://t.me/UlyanaKir" target="_blank" rel="noopener noreferrer">Telegram</a>
    </nav>
  </div>
  <div class="footer-bottom">
    <p>© {year} Ulyana Kirpichnikova</p>
    <a href={privacyHref}>{t(locale, 'privacy')}</a>
  </div>
</footer>

<style>
  .site-footer {
    border-top: 1px solid var(--color-border);
    background: transparent;
    /* Match .section-block horizontal edge (no .container 1200 cap) */
    padding-block: 3.5rem 2rem;
    padding-inline: var(--content-inline);
    margin-block-start: 0;
  }

  .footer-inner {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 2rem;
    margin-block-end: 2.5rem;
    max-inline-size: none;
  }

  .footer-brand {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-inline-size: 360px;
  }

  .footer-brand p {
    font-size: var(--fs-small);
    color: var(--color-text-muted);
  }

  .footer-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem 1.5rem;
    align-content: flex-start;
  }

  .footer-nav a {
    color: var(--color-text-secondary);
    font-size: var(--fs-small);
    transition: color 0.15s ease;
  }

  .footer-nav a:hover {
    color: var(--color-blue);
  }

  .footer-bottom {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 0.75rem;
    padding-block-start: 1.5rem;
    border-top: 1px solid var(--color-border);
    font-size: 0.85rem;
    color: var(--color-text-muted);
  }

  .footer-bottom a {
    color: var(--color-text-muted);
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .footer-bottom a:hover {
    color: var(--color-text-primary);
  }
</style>
```
