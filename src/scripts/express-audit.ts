/**
 * Express-audit popup — triggered by [data-express-audit].
 * Two fields: current site URL + contact → sent to @ulyana_leads_bot.
 */
export function initExpressAudit(): void {
  const btn = document.querySelector<HTMLButtonElement>('[data-express-audit]');
  if (!btn) return;

  const lang = document.documentElement.lang === 'ru' ? 'ru' : 'en';

  // Guard: don't create duplicate overlays on HMR
  if (document.querySelector('.ea-overlay')) return;

  const t = {
    ru: {
      title: 'Бесплатный экспресс-аудит',
      sub: 'Оставьте ссылку на сайт и контакт, и я пришлю краткий аудит',
      sitePlaceholder: 'адрес вашего сайта',
      contactPlaceholder: '@telegram, +7999..., email',
      submit: 'Получить аудит',
      cancel: 'Закрыть',
      sending: 'Отправляю...',
      thanks: 'Спасибо! Пришлю аудит в ближайшее время',
      error: 'Ошибка. Напишите в Telegram: @UlyanaKir',
      siteRequired: 'Введите адрес сайта',
      contactRequired: 'Введите контакт',
    },
    en: {
      title: 'Free express-audit',
      sub: 'Leave your current site address and contact — I’ll send a quick audit',
      sitePlaceholder: 'your-site.com',
      contactPlaceholder: '@telegram, +7999..., email',
      submit: 'Get audit',
      cancel: 'Close',
      sending: 'Sending...',
      thanks: 'Thanks! I’ll send the audit shortly',
      error: 'Error. Message me on Telegram: @UlyanaKir',
      siteRequired: 'Enter your site address',
      contactRequired: 'Enter your contact',
    },
  }[lang];

  // Build DOM once
  const overlay = document.createElement('div');
  overlay.className = 'ea-overlay';
  overlay.setAttribute('aria-hidden', 'true');

  const dialog = document.createElement('div');
  dialog.className = 'ea-dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-label', t.title);
  dialog.innerHTML = /* html */ `
    <button type="button" class="ea-close" aria-label="${lang === 'ru' ? 'Закрыть' : 'Close'}">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    </button>
    <h3 class="ea-title">${t.title}</h3>
    <p class="ea-sub">${t.sub}</p>
    <form class="ea-form">
      <input
        type="text"
        class="ea-input"
        name="site"
        placeholder="${t.sitePlaceholder}"
        autocomplete="off"
        required
      />
      <input
        type="text"
        class="ea-input"
        name="contact"
        placeholder="${t.contactPlaceholder}"
        autocomplete="off"
        required
      />
      <div class="ea-actions">
        <button type="submit" class="btn btn-primary">${t.submit}</button>
        <button type="button" class="btn btn-secondary ea-cancel">${t.cancel}</button>
      </div>
      <div class="ea-status"></div>
    </form>
  `;

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  const siteInput = dialog.querySelector<HTMLInputElement>('input[name="site"]')!;
  const contactInput = dialog.querySelector<HTMLInputElement>('input[name="contact"]')!;
  const form = dialog.querySelector<HTMLFormElement>('.ea-form')!;
  const status = dialog.querySelector<HTMLDivElement>('.ea-status')!;
  const closeBtn = dialog.querySelector<HTMLButtonElement>('.ea-close')!;
  const cancelBtn = dialog.querySelector<HTMLButtonElement>('.ea-cancel')!;

  const open = () => {
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => siteInput.focus());
    });
  };

  const close = () => {
    overlay.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  btn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  cancelBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const site = siteInput.value.trim();
    const contact = contactInput.value.trim();

    if (!site) {
      status.textContent = t.siteRequired;
      status.className = 'ea-status error';
      return;
    }
    if (!contact) {
      status.textContent = t.contactRequired;
      status.className = 'ea-status error';
      return;
    }

    status.textContent = t.sending;
    status.className = 'ea-status';

    try {
      const BOT_TOKEN = (window as any).__LEADS_BOT_TOKEN__;
      const CHAT_ID = (window as any).__LEADS_CHAT_ID__;

      if (BOT_TOKEN && CHAT_ID) {
        const msg = [
          `New express-audit request`,
          `Site: ${site}`,
          `Contact: ${contact}`,
          `Page: ${document.title}`,
        ].join('\n');
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: CHAT_ID, text: msg }),
        });
      }

      status.textContent = t.thanks;
      status.className = 'ea-status success';
      form.reset();
    } catch (_err) {
      status.textContent = t.error;
      status.className = 'ea-status error';
    }
  });
}
