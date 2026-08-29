/**
 * Contact widget — плавающая иконка мессенджера (справа внизу, всегда видна).
 * Через 20 секунд показывает приветственное облачко (один раз за сессию).
 * Клик по иконке тоже открывает/закрывает облачко.
 */
export function initContactWidget(): void {
  const widget = document.querySelector<HTMLElement>('[data-contact-widget]');
  if (!widget) return;

  const bubble = widget.querySelector<HTMLElement>('[data-cw-bubble]');
  const fab = widget.querySelector<HTMLElement>('[data-cw-fab]');
  const close = widget.querySelector<HTMLElement>('[data-cw-close]');
  if (!bubble || !fab) return;

  const shownKey = 'contact-widget-bubble-shown';

  // Показать облачко (общее действие, без проверки флага)
  const show = () => {
    bubble.classList.add('is-visible');
    bubble.setAttribute('aria-hidden', 'false');
  };

  const hide = () => {
    bubble.classList.remove('is-visible');
    bubble.setAttribute('aria-hidden', 'true');
  };

  // Автопоказ через 20 секунд — только один раз за сессию
  const autoShow = () => {
    if (sessionStorage.getItem(shownKey)) return;
    sessionStorage.setItem(shownKey, '1');
    show();
  };

  window.setTimeout(autoShow, 20000);

  // Клик по иконке — всегда переключает облачко (тумблер)
  fab.addEventListener('click', () => {
    bubble.classList.contains('is-visible') ? hide() : show();
  });

  close?.addEventListener('click', hide);

  // Закрыть по Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hide();
  });
}
