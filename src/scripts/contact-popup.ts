/**
 * Universal contact popup — triggered by [data-contact-popup] buttons.
 * Replaces direct t.me links with a modal form:
 * contact field + method chips (auto-detect) + optional message + Telegram Bot API send.
 */
import { markLeadSubmitted } from './exit-intent';

export function initContactPopup(): void {
  const triggers = document.querySelectorAll<HTMLElement>('[data-contact-popup]');
  if (triggers.length === 0) return;

  const lang = document.documentElement.lang === 'ru' ? 'ru' : 'en';

  // Guard: don't create duplicate overlays on HMR
  if (document.querySelector('.cu-overlay')) return;

  const t = {
    ru: {
      title: 'Обсудить проект',
      subtitle: 'Оставьте контакт и пару слов о проекте — я свяжусь с вами',
      contactPlaceholder: '@telegram, +7999..., email или ссылка',
      messagePlaceholder: 'Пара слов о проекте (если считаете нужным)',
      send: 'Отправить',
      cancel: 'Закрыть',
      sending: 'Отправляю...',
      thanks: 'Спасибо! Я свяжусь с вами в ближайшее время',
      error: 'Ошибка. Напишите мне в Telegram: @UlyanaKir',
    },
    en: {
      title: 'Discuss project',
      subtitle: 'Leave your contact and a few words about the project — I\'ll reach out',
      contactPlaceholder: '@telegram, +7999..., email or link',
      messagePlaceholder: 'A few words about the project (optional)',
      send: 'Send',
      cancel: 'Close',
      sending: 'Sending...',
      thanks: 'Thanks! I\'ll reach out shortly',
      error: 'Error. Message me on Telegram: @UlyanaKir',
    },
  }[lang];

  const methods = [
    { value: 'telegram', label: 'Telegram' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'email', label: 'Email' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'facebook', label: lang === 'ru' ? 'MAX' : 'Facebook' },
  ];

  const detectMethod = (v: string): string => {
    if (/^@[a-zA-Z]/.test(v)) return 'telegram';
    if (/^\+?\d{10,}$/.test(v)) return 'whatsapp';
    if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) return 'email';
    if (/linkedin\.com\/in\//.test(v)) return 'linkedin';
    if (/facebook\.com\//.test(v)) return 'facebook';
    return '';
  };

  // Build DOM once
  const overlay = document.createElement('div');
  overlay.className = 'cu-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = /* html */ `
    <div class="cu-dialog" role="dialog" aria-modal="true" aria-label="${t.title}">
      <button type="button" class="cu-close" aria-label="${lang === 'ru' ? 'Закрыть' : 'Close'}">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </button>
      <h3 class="cu-title">${t.title}</h3>
      <p class="cu-subtitle">${t.subtitle}</p>
      <form class="cu-form">
        <input
          type="text"
          class="cu-input"
          name="contact"
          placeholder="${t.contactPlaceholder}"
          autocomplete="off"
          required
        />
        <div class="cu-methods">
          ${methods.map((m, i) => /* html */ `
            <label class="cu-method">
              <input type="radio" name="method" value="${m.value}" ${i === 0 ? 'checked' : ''} />
              <span class="cu-method-chip">${m.label}</span>
            </label>
          `).join('')}
        </div>
        <textarea
          class="cu-textarea"
          name="message"
          rows="3"
          placeholder="${t.messagePlaceholder}"
        ></textarea>
        <div class="cu-actions">
          <button type="submit" class="btn btn-primary">${t.send}</button>
        </div>
        <div class="cu-status"></div>
      </form>
    </div>
  `;
  document.body.appendChild(overlay);

  const dialog = overlay.querySelector<HTMLElement>('.cu-dialog')!;
  const input = overlay.querySelector<HTMLInputElement>('.cu-input')!;
  const textarea = overlay.querySelector<HTMLTextAreaElement>('.cu-textarea')!;
  const form = overlay.querySelector<HTMLFormElement>('.cu-form')!;
  const status = overlay.querySelector<HTMLDivElement>('.cu-status')!;
  const closeBtn = overlay.querySelector<HTMLButtonElement>('.cu-close')!;

  const radios = () => overlay.querySelectorAll<HTMLInputElement>('input[name="method"]');

  const open = () => {
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => input.focus());
    });
  };

  const close = () => {
    overlay.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  // Wire triggers
  triggers.forEach((btn) => btn.addEventListener('click', open));

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
  });

  // Auto-detect method from input
  input.addEventListener('input', () => {
    const detected = detectMethod(input.value);
    const radio = overlay.querySelector<HTMLInputElement>(`input[name="method"][value="${detected}"]`);
    if (detected && radio) radio.checked = true;
  });

  // Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const contact = input.value.trim();
    if (!contact) return;

    const methodEl = overlay.querySelector<HTMLInputElement>('input[name="method"]:checked');
    const method = methodEl?.value || 'telegram';

    status.textContent = t.sending;
    status.className = 'cu-status';

    try {
      const BOT_TOKEN = (window as any).__TELEGRAM_BOT_TOKEN__;
      const CHAT_ID = (window as any).__TELEGRAM_CHAT_ID__;

      if (BOT_TOKEN && CHAT_ID) {
        const msgText = textarea.value.trim();
        const msg = [
          `New lead from ulyanaweb.ru`,
          `Contact: ${contact}`,
          `Method: ${method}`,
          msgText ? `Message: ${msgText}` : '',
          `Page: ${document.title}`,
        ].filter(Boolean).join('\n');
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: CHAT_ID, text: msg }),
        });
      }

      status.textContent = t.thanks;
      status.className = 'cu-status success';
      markLeadSubmitted();
      form.querySelectorAll('button').forEach((b) => (b.disabled = true));
      setTimeout(() => {
        close();
        form.reset();
        form.querySelectorAll('button').forEach((b) => (b.disabled = false));
        radios().forEach((r) => (r.checked = r.value === 'telegram'));
      }, 2500);
    } catch (_err) {
      status.textContent = t.error;
      status.className = 'cu-status error';
    }
  });
}
