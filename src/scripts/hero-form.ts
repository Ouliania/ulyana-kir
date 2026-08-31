import { markLeadSubmitted } from './exit-intent';

export function initHeroForm(): void {
  const form = document.getElementById('hero-contact-form') as HTMLFormElement | null;
  if (!form) return;

  const input = document.getElementById('hero-contact') as HTMLInputElement;
  const status = document.getElementById('hero-form-status');
  const lang = form.dataset.lang || 'en';
  const isRu = lang === 'ru';

  const methodHints: Record<string, { placeholder: string; validate: (v: string) => boolean; label: string }> = {
    telegram: {
      placeholder: '@username',
      validate: (v) => /^@[a-zA-Z][\w_]{3,}$/.test(v),
      label: 'Telegram',
    },
    whatsapp: {
      placeholder: '+79991234567',
      validate: (v) => /^\+?\d{10,}$/.test(v),
      label: 'WhatsApp',
    },
    email: {
      placeholder: 'name@example.com',
      validate: (v) => /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v),
      label: 'Email',
    },
    linkedin: {
      placeholder: 'linkedin.com/in/username',
      validate: (v) => /linkedin\.com\/in\/[^\s/]+/.test(v),
      label: 'LinkedIn',
    },
    facebook: isRu ? {
      placeholder: '+79991234567',
      validate: (v) => /^\+?\d{10,}$/.test(v),
      label: 'Макс',
    } : {
      placeholder: 'facebook.com/username',
      validate: (v) => /facebook\.com\/[^\s/]+/.test(v),
      label: 'Facebook',
    },
  };

  const detectMethod = (value: string): string => {
    const v = value.trim();
    if (/^@[a-zA-Z]/.test(v)) return 'telegram';
    // Phone-like: only detect as whatsapp (not facebook) for RU
    if (/^\+?\d{10,}$/.test(v)) return 'whatsapp';
    if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) return 'email';
    if (/linkedin\.com\/in\//.test(v)) return 'linkedin';
    if (/facebook\.com\//.test(v)) return 'facebook';
    return '';
  };

  const radios = () => document.querySelectorAll<HTMLInputElement>('#hero-methods input[type=radio]');
  const getCheckedRadio = () => document.querySelector<HTMLInputElement>('#hero-methods input[type=radio]:checked');

  // Auto-detect method from input
  input.addEventListener('input', () => {
    const detected = detectMethod(input.value);
    const radio = document.querySelector<HTMLInputElement>(`#hero-methods input[value="${detected}"]`);
    if (detected && radio) {
      radio.checked = true;
    }
  });

  // Click on a method chip → set placeholder & check radio
  document.querySelectorAll<HTMLInputElement>('#hero-methods input[type=radio]').forEach((radio) => {
    radio.addEventListener('change', () => {
      const hint = methodHints[radio.value];
      if (hint) {
        input.placeholder = hint.placeholder;
        input.focus();
      }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const contact = input.value.trim();
    if (!contact) return;

    const methodEl = getCheckedRadio();
    const method = methodEl?.value || detectMethod(contact) || 'telegram';

    // Validate: if a method is explicitly selected, check that input matches
    if (methodEl && methodHints[method]) {
      const { validate, label } = methodHints[method];
      if (!validate(contact)) {
        if (status) {
          status.textContent = lang === 'ru'
            ? `Похоже, это не ${label}. Проверьте формат`
            : `Doesn't look like ${label}. Check the format`;
          status.className = 'hero-form-note error';
        }
        return;
      }
    }

    if (status) {
      status.textContent = lang === 'ru' ? 'Отправляю...' : 'Sending...';
      status.className = 'hero-form-note';
    }

    try {
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
      markLeadSubmitted();
      form.reset();
      radios().forEach(m => m.checked = false);
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
