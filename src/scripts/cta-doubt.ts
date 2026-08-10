export function initCtaDoubt(): void {
  const btn = document.querySelector<HTMLButtonElement>('[data-cta-doubt]');
  if (!btn) return;

  const lang = document.documentElement.lang === 'ru' ? 'ru' : 'en';

  // Guard: don't create duplicate overlays on HMR
  if (document.querySelector('.dbt-overlay')) return;

  const t = {
    ru: {
      title: 'Вижу, вы ещё думаете, понимаю',
      body: 'Буду рада, если поделитесь причиной сомнений — постараюсь дать максимально честный ответ.',
      placeholder: 'Расскажите, что вас смущает...',
      send: 'Отправить',
      cancel: 'Закрыть',
      sending: 'Отправляю...',
      thanks: 'Спасибо, что поделились! Постараюсь ответить в ближайшее время.',
      error: 'Ошибка. Напишите мне в Telegram: @UlyanaKir',
    },
    en: {
      title: 'I see you\'re still thinking, I get it',
      body: 'I\'d be glad if you share what\'s holding you back — I\'ll try to give the most honest answer.',
      placeholder: 'Tell me what concerns you...',
      send: 'Send',
      cancel: 'Close',
      sending: 'Sending...',
      thanks: 'Thanks for sharing! I\'ll get back to you soon.',
      error: 'Error. Message me on Telegram: @UlyanaKir',
    },
  }[lang];

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'dbt-overlay';
  overlay.setAttribute('aria-hidden', 'true');

  const dialog = document.createElement('div');
  dialog.className = 'dbt-dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-label', t.title);
  dialog.innerHTML = /* html */ `
    <button type="button" class="dbt-close" aria-label="${lang === 'ru' ? 'Закрыть' : 'Close'}">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    </button>
    <h3 class="dbt-title">${t.title}</h3>
    <p class="dbt-body">${t.body}</p>
    <form class="dbt-form">
      <textarea
        class="dbt-textarea"
        name="reason"
        rows="3"
        placeholder="${t.placeholder}"
        required
      ></textarea>
      <div class="dbt-actions">
        <button type="submit" class="btn btn-primary">${t.send}</button>
        <button type="button" class="btn btn-secondary dbt-cancel">${t.cancel}</button>
      </div>
      <div class="dbt-status"></div>
    </form>
  `;

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  const textarea = dialog.querySelector<HTMLTextAreaElement>('.dbt-textarea')!;
  const form = dialog.querySelector<HTMLFormElement>('.dbt-form')!;
  const status = dialog.querySelector<HTMLDivElement>('.dbt-status')!;
  const closeBtn = dialog.querySelector<HTMLButtonElement>('.dbt-close')!;
  const cancelBtn = dialog.querySelector<HTMLButtonElement>('.dbt-cancel')!;

  const open = () => {
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => textarea.focus());
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
    const reason = textarea.value.trim();
    if (!reason) return;

    status.textContent = t.sending;
    status.className = 'dbt-status';

    try {
      const BOT_TOKEN = (window as any).__TELEGRAM_BOT_TOKEN__;
      const CHAT_ID = (window as any).__TELEGRAM_CHAT_ID__;

      if (BOT_TOKEN && CHAT_ID) {
        const msg = `Doubt reason from ${document.title}\nPage: ${location.href}\nReason: ${reason}`;
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: CHAT_ID, text: msg }),
        });
      }

      status.textContent = t.thanks;
      status.className = 'dbt-status success';
      form.querySelectorAll('button').forEach((b) => (b.disabled = true));
      setTimeout(() => {
        close();
        form.reset();
        form.querySelectorAll('button').forEach((b) => (b.disabled = false));
      }, 2500);
    } catch (_err) {
      status.textContent = t.error;
      status.className = 'dbt-status error';
    }
  });
}
