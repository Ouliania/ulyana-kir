export function initHeroForm(): void {
  const form = document.getElementById('hero-contact-form') as HTMLFormElement | null;
  if (!form) return;

  const input = document.getElementById('hero-contact') as HTMLInputElement;
  const status = document.getElementById('hero-form-status');
  const lang = form.dataset.lang || 'en';

  const detectMethod = (value: string): string => {
    const v = value.trim();
    if (/^@[a-zA-Z]/.test(v)) return 'telegram';
    if (/^\+?[78]\d{10,}/.test(v) || /^\d{11,}/.test(v)) return 'whatsapp';
    if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) return 'email';
    if (/linkedin\.com\/in\//.test(v)) return 'linkedin';
    return '';
  };

  input.addEventListener('input', () => {
    const detected = detectMethod(input.value);
    if (detected) {
      const radio = document.querySelector<HTMLInputElement>(`#hero-methods input[value="${detected}"]`);
      if (radio) radio.checked = true;
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const contact = input.value.trim();
    if (!contact) return;

    const methodEl = document.querySelector<HTMLInputElement>('#hero-methods input[type=radio]:checked');
    const method = methodEl?.value || detectMethod(contact) || 'telegram';

    if (status) {
      status.textContent = lang === 'ru' ? 'Отправляю...' : 'Sending...';
      status.className = 'hero-form-note';
    }

    try {
      // Telegram bot env vars — injected at build time via Astro
      const BOT_TOKEN = (window as any).__TELEGRAM_BOT_TOKEN__;
      const CHAT_ID = (window as any).__TELEGRAM_CHAT_ID__;

      if (BOT_TOKEN && CHAT_ID) {
        const msg = `New lead from ulyanaweb.ru\nContact: ${contact}\nMethod: ${method}\nPage: ${document.title}`;
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: CHAT_ID, text: msg }),
        });
      }

      if (status) {
        status.textContent = lang === 'ru'
          ? 'Спасибо! Я свяжусь с вами в ближайшее время'
          : 'Thanks! I\'ll reach out shortly';
        status.className = 'hero-form-note success';
      }
      form.reset();
      document.querySelectorAll<HTMLInputElement>('#hero-methods input[type=radio]').forEach(m => m.checked = false);
    } catch (_err) {
      if (status) {
        status.textContent = lang === 'ru'
          ? 'Ошибка. Напишите мне в Telegram: @UlyanaKir'
          : 'Error. Message me on Telegram: @UlyanaKir';
        status.className = 'hero-form-note error';
      }
    }
  });
}
