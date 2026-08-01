# Shared UI primitives — ulyanaweb (Astro 6)

Framework: Astro 6 · CSS: vanilla layered CSS (`src/styles/global.css`) · Motion: GSAP · No Tailwind/shadcn.

## InteractiveHoverButton
Path: `src/components/InteractiveHoverButton.astro`  
Primary CTA (Telegram / discuss). Uses global `.btn.btn-primary`.

```astro
---
interface Props {
  href?: string;
  target?: string;
  rel?: string;
  type?: 'button' | 'submit' | 'reset';
  class?: string;
  label: string;
}
const { href, target, rel, type = 'button', class: className = '', label } = Astro.props;
const Tag = href ? 'a' : 'button';
---
<Tag class:list={['btn', 'btn-primary', className]} href={href} target={target} rel={rel} type={href ? undefined : type}>
  {label}
</Tag>
```

## Wordmark
Path: `src/components/Wordmark.astro`  
Brand: `Ulyana` in blue block + `Kirp` outside.

```astro
---
interface Props { href?: string; class?: string; }
const { href = '/', class: className = '' } = Astro.props;
---
<a href={href} class:list={['wordmark', className]} aria-label="Ulyana Kirp">
  <span class="wordmark-first">Ulyana</span>
  <span class="wordmark-last">Kirp</span>
</a>
<style>
  .wordmark { display: inline-flex; align-items: center; gap: 0.2rem; font-family: var(--font-body); font-size: 1.05rem; letter-spacing: -0.01em; line-height: 1; }
  .wordmark-first { background: var(--color-blue); color: #fff; font-weight: 500; padding: 0.35rem 0.5rem; border-radius: var(--radius-default); }
  .wordmark-last { color: var(--color-text-primary); font-weight: 300; padding-block: 0.35rem; }
</style>
```

## LangSwitch
Path: `src/components/LangSwitch.astro`  
EN / RU twin-path switcher with cookie `lang`.

```astro
---
import { twinPath, type Locale } from '../i18n/ui';
interface Props { locale: Locale; }
const { locale } = Astro.props;
const pathname = Astro.url.pathname;
---
<div class="lang-switch" role="group" aria-label="Language">
  <a href={twinPath(pathname, 'en')} class:list={['lang-opt', { active: locale === 'en' }]} hreflang="en" lang="en" data-set-lang="en">EN</a>
  <span class="lang-sep" aria-hidden="true">/</span>
  <a href={twinPath(pathname, 'ru')} class:list={['lang-opt', { active: locale === 'ru' }]} hreflang="ru" lang="ru" data-set-lang="ru">RU</a>
</div>
```

## Global button classes (from `global.css`)
- `.btn` — base control
- `.btn-primary` — solid `#0274DE` blue, white text
- `.btn-secondary` — outline / muted

## Type roles (from `global.css`)
- `.type-label` — quiet section H2 (services, cases)
- `.type-display` — loud section H2 (how I work)
- `.type-band` — CTA-band H2
- `.type-lead` — support under display/band
- `.section-head` / `.section-head--label` — chrome pad only

No Card/Dialog primitive library — page sections are custom Astro components.
