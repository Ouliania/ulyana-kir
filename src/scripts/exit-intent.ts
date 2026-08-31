/**
 * Soft Exit-Intent — аккуратная плашка при попытке уйти.
 * Показывается только тем, кто ещё не оставил заявку (флаг в sessionStorage).
 *
 * 4 варианта причины → свой ответ:
 *  1. price      → поле задачи + контакт → отправка в бота
 *  2. content    → пояснение + контакт → отправка в бота
 *  3. expertise  → пояснение + контакт → отправка в бота
 *  4. comparing  → «Буду рада видеть вас снова!» + закрыть
 */

const LEAD_SUBMITTED_KEY = 'lead-submitted';

export function markLeadSubmitted(): void {
  sessionStorage.setItem(LEAD_SUBMITTED_KEY, '1');
}

export function initExitIntent(): void {
  if (sessionStorage.getItem(LEAD_SUBMITTED_KEY)) return;
  if (sessionStorage.getItem('exit-intent-shown')) return;
  if (document.querySelector('.ei-overlay')) return;

  const lang = document.documentElement.lang === 'ru' ? 'ru' : 'en';

  const t = {
    ru: {
      title: 'Помогите мне стать лучше. Почему уходите без заявки?',
      choose: 'выберите ваш вариант',
      opts: {
        price: 'Непонятно, сколько это стоит',
        content: 'У меня ещё нет структуры/текстов',
        expertise: 'Не уверен в качестве и экспертизе',
        comparing: 'Просто сравниваю, может загляну позже',
      },
      priceTitle: 'Опишите кратко задачу — и я скажу вилку',
      contentTitle: 'Я сама проектирую структуру и пишу тексты. Вам не нужен копирайтер. Оставьте контакты и обсудим вашу задачу.',
      expertiseTitle: 'Понимаю вас! Давайте встретимся на 15 минут, и вы лично оцените понимание вашего бизнеса и задачи, и сделаете свои выводы. Оставьте контакты и обсудим вашу задачу.',
      comparingTitle: 'Поняла. Буду рада видеть вас снова!',
      taskPlaceholder: 'Кратко опишите задачу...',
      contactPlaceholder: '@telegram, +7999..., email',
      send: 'Отправить',
      back: 'Назад',
      close: 'Закрыть',
      sending: 'Отправляю...',
      thanks: 'Спасибо! Я свяжусь с вами в ближайшее время',
      error: 'Ошибка. Напишите в Telegram: @UlyanaKir',
      contactRequired: 'Введите контакт',
      taskRequired: 'Опишите задачу',
    },
    en: {
      title: 'Help me improve. Why are you leaving without a request?',
      choose: 'choose your option',
      opts: {
        price: "It's unclear how much it costs",
        content: "I don't have structure/copy yet",
        expertise: "I'm not sure about the quality and expertise",
        comparing: "Just comparing, maybe I'll come back later",
      },
      priceTitle: 'Briefly describe your task — and I’ll tell you the price range',
      contentTitle: 'I design the structure and write the copy myself. You don’t need a copywriter. Leave your contacts and let’s discuss your task.',
      expertiseTitle: 'I understand! Let’s meet for 15 minutes and you’ll personally assess how well I understand your business and task. Leave your contacts and let’s discuss.',
      comparingTitle: "Got it. I'd be glad to see you again!",
      taskPlaceholder: 'Briefly describe your task...',
      contactPlaceholder: '@telegram, +7999..., email',
      send: 'Send',
      back: 'Back',
      close: 'Close',
      sending: 'Sending...',
      thanks: 'Thanks! I’ll reach out shortly',
      error: 'Error. Message me on Telegram: @UlyanaKir',
      contactRequired: 'Enter your contact',
      taskRequired: 'Describe your task',
    },
  }[lang];

  // Build DOM once
  const overlay = document.createElement('div');
  overlay.className = 'ei-overlay';
  overlay.setAttribute('aria-hidden', 'true');

  const dialog = document.createElement('div');
  dialog.className = 'ei-dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-label', t.title);
  dialog.innerHTML = /* html */ `
    <button type="button" class="ei-close" data-ei-close aria-label="${t.close}">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    </button>
    <h3 class="ei-title">${t.title}</h3>
    <p class="ei-hint">${t.choose}</p>
    <div class="ei-options" data-ei-options>
      ${Object.keys(t.opts).map((k) => /* html */ `
        <button type="button" class="ei-option" data-ei-option="${k}">${t.opts[k as keyof typeof t.opts]}</button>
      `).join('')}
    </div>
    <div class="ei-panel" data-ei-panel hidden></div>
  `;

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  const optionsEl = dialog.querySelector<HTMLDivElement>('[data-ei-options]')!;
  const panelEl = dialog.querySelector<HTMLDivElement>('[data-ei-panel]')!;
  const closeBtn = dialog.querySelector<HTMLButtonElement>('[data-ei-close]')!;

  const open = () => {
    sessionStorage.setItem('exit-intent-shown', '1');
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    overlay.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  // Показать ответ-панель для выбранного варианта
  const showPanel = (kind: string) => {
    optionsEl.hidden = true;

    if (kind === 'comparing') {
      panelEl.hidden = false;
      panelEl.innerHTML = /* html */ `
        <p class="ei-answer">${t.comparingTitle}</p>
        <div class="ei-actions">
          <button type="button" class="btn btn-primary" data-ei-close-panel>${t.close}</button>
        </div>
      `;
      panelEl.querySelector<HTMLButtonElement>('[data-ei-close-panel]')!.addEventListener('click', close);
      return;
    }

    const needsTask = kind === 'price';
    const title = kind === 'price' ? t.priceTitle : kind === 'content' ? t.contentTitle : t.expertiseTitle;

    panelEl.hidden = false;
    panelEl.innerHTML = /* html */ `
      <p class="ei-answer">${title}</p>
      <form class="ei-form">
        ${needsTask ? `<input type="text" class="ei-input" name="task" placeholder="${t.taskPlaceholder}" autocomplete="off" />` : ''}
        <input type="text" class="ei-input" name="contact" placeholder="${t.contactPlaceholder}" autocomplete="off" required />
        <div class="ei-actions">
          <button type="submit" class="btn btn-primary">${t.send}</button>
          <button type="button" class="btn btn-secondary" data-ei-back>${t.back}</button>
        </div>
        <div class="ei-status"></div>
      </form>
    `;

    const form = panelEl.querySelector<HTMLFormElement>('.ei-form')!;
    const taskInput = panelEl.querySelector<HTMLInputElement>('input[name="task"]');
    const contactInput = panelEl.querySelector<HTMLInputElement>('input[name="contact"]')!;
    const status = panelEl.querySelector<HTMLDivElement>('.ei-status')!;
    const backBtn = panelEl.querySelector<HTMLButtonElement>('[data-ei-back]')!;

    backBtn.addEventListener('click', () => {
      panelEl.hidden = true;
      panelEl.innerHTML = '';
      optionsEl.hidden = false;
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const contact = contactInput.value.trim();
      const task = taskInput ? taskInput.value.trim() : '';

      if (needsTask && !task) {
        status.textContent = t.taskRequired;
        status.className = 'ei-status error';
        return;
      }
      if (!contact) {
        status.textContent = t.contactRequired;
        status.className = 'ei-status error';
        return;
      }

      status.textContent = t.sending;
      status.className = 'ei-status';

      try {
        const BOT_TOKEN = (window as any).__LEADS_BOT_TOKEN__ || (window as any).__TELEGRAM_BOT_TOKEN__;
        const CHAT_ID = (window as any).__LEADS_CHAT_ID__ || (window as any).__TELEGRAM_CHAT_ID__;

        if (BOT_TOKEN && CHAT_ID) {
          const reason = t.opts[kind as keyof typeof t.opts];
          const msg = [
            `Exit-intent lead`,
            `Reason: ${reason}`,
            task ? `Task: ${task}` : '',
            `Contact: ${contact}`,
            `Page: ${location.href}`,
          ].filter(Boolean).join('\n');
          await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: msg }),
          });
        }

        markLeadSubmitted();
        status.textContent = t.thanks;
        status.className = 'ei-status success';
        form.querySelectorAll('button').forEach((b) => (b.disabled = true));
        setTimeout(close, 2000);
      } catch (_err) {
        status.textContent = t.error;
        status.className = 'ei-status error';
      }
    });
  };

  // Клик по варианту
  optionsEl.addEventListener('click', (e) => {
    const opt = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-ei-option]');
    if (opt) showPanel(opt.dataset.eiOption || '');
  });

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
  });

  // === Триггеры ухода ===

  // 1) Десктоп: курсор уходит за верхнюю границу окна
  document.addEventListener('mouseout', (e: MouseEvent) => {
    if (e.clientY <= 0 && !e.relatedTarget) open();
  });

  // 2) Мобильные / смена вкладки: страница скрывается
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') open();
  });
}
