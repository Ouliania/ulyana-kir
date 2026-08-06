import type { Locale } from './ui';

/** Case body copy — author RU first, then sync EN (SPEC V20) */
export const caseCopy = {
  ru: {
    progolos: {
      tag: 'Увеличение конверсии',
      project:
        'Увеличение конверсии сайта студии вокала «Progolos»',
      problem:
        'Сайт не закрывал страхи новичков, а структура не имела промежуточных действий для холодного трафика.',
      solution: [
        'Анализ психологических барьеров аудитории',
        'Карта пути клиента (CJM) с пошаговой отработкой страхов',
        'Внедрение микроконверсий для вовлечения сомнений',
      ],
      /** Big A-style figures — only when real numbers exist */
      metrics: [
        { value: '4×', label: 'выросла конверсия сайта в заявку' },
        { value: '−68%', label: 'снизилась стоимость привлечения клиента (CPA)' },
      ],
      result: [] as string[],
    },
    'grom-bike': {
      tag: 'Интернет-магазин',
      project:
        'UX-реорганизация и копирайтинг для интернет-магазина велосипедов',
      problem:
        'Сухой каталог с характеристиками вместо ответов на задачи покупателя. Ограничения платформы и страхи онлайн-заказа.',
      solution: [
        'Навигация каталога по целям (город, прогулки, нагрузки)',
        'Графические баннеры-смыслы в обход рамок конструктора',
        'Две воронки: онлайн-покупка с гарантией / тест-драйв в шоуруме',
      ],
      metrics: [] as { value: string; label: string }[],
      result: [
        'Понятный онлайн-магазин под задачи клиента и бесшовный зазыв в офлайн',
      ],
    },
    creator: {
      tag: 'Сайт с проработкой смыслов и дизайна',
      project: 'Сайт-портфолио для контент-мейкера',
      problem:
        'Стандартные шаблоны не передавали статус и креативность автора, ограничивая интерактив.',
      solution: [
        'Кастомная сборка на стеке React + Node.js без конструкторов',
        'Интерактивная JS-анимация с трекингом курсора на первом экране',
        'Прозрачная воронка: портфолио → прайс-лист → форма заявки',
      ],
      metrics: [] as { value: string; label: string }[],
      result: [
        'Имиджевый технологичный сайт, превращающий просмотры в доверие и заказы',
      ],
    },
    'interval-lingo': {
      tag: 'Telegram Mini App',
      project:
        'Telegram Mini App для изучения английских слов и фраз в контексте',
      problem:
        'Приложения с карточками (Flashcards) заставляют заучивать изолированные слова, которые люди не могут применить в речи.',
      solution: [
        'Переход от зубрежки слов к освоению речевых паттернов и контекста',
        'Проектирование сфокусированного UI-интерфейса без лишнего шума',
        'Полный цикл сборки и запуска Mini App в Telegram',
      ],
      metrics: [] as { value: string; label: string }[],
      result: [
        'Работающее продуктовое MVP с высокой скоростью освоения живых фраз',
      ],
    },
    'aliya-wooden': {
      tag: 'UX бронирования',
      project: 'Путь бронирования для Wooden Chalets · Aliya',
      problem: 'Низкий процент завершения бронирования номера на сайте',
      solution: [
        'Проработка пути бронирования прямо на странице номера отеля с интерактивным калькулятором',
      ],
      metrics: [] as { value: string; label: string }[],
      result: [] as string[],
    },
  },
  en: {
    progolos: {
      tag: 'Conversion boost',
      project:
        'Website Conversion Optimization for "Progolos" Vocal Studio',
      problem:
        'The site did not address beginners’ main fears, and the structure had no intermediate actions for cold traffic.',
      solution: [
        'Audience psychological barrier analysis',
        'Step-by-step objection-handling CJM',
        'Micro-conversion triggers addition',
      ],
      metrics: [
        { value: '4×', label: 'site-to-lead conversion grew' },
        { value: '−68%', label: 'cost per acquisition (CPA) dropped' },
      ],
      result: [] as string[],
    },
    'grom-bike': {
      tag: 'Online store',
      project: 'UX reorganization and copy for a bicycle online store',
      problem:
        'A dry tech-spec catalog with no task-based logic, strict CMS limits, and online purchase anxieties.',
      solution: [
        'Intent-based catalog structure (commuting, weekend rides)',
        'Custom visual narrative banners bypassing CMS limits',
        'Dual funnel: online shipping guarantees / showroom test drive',
      ],
      metrics: [] as { value: string; label: string }[],
      result: [
        'User-friendly e-commerce journey driving both online sales and store visits',
      ],
    },
    creator: {
      tag: 'Site with deep strategy & design',
      project: 'Portfolio site for a content creator',
      problem:
        'Generic templates failed to showcase creator identity or support custom interactive graphics.',
      solution: [
        'Custom code engineering using React & Node.js',
        'Interactive hero section with cursor-tracking JS animation',
        'Streamlined flow: showcase → pricing → direct inquiry',
      ],
      metrics: [] as { value: string; label: string }[],
      result: [
        'High-speed, immersive brand platform that builds instant authority',
      ],
    },
    'interval-lingo': {
      tag: 'Telegram Mini App',
      project:
        'Telegram Mini App for learning English words and phrases in context',
      problem:
        'Traditional flashcard apps force isolated word memorization, leading to zero real-world speaking skills.',
      solution: [
        'Context-driven learning model instead of standalone vocabulary',
        'Distraction-free, zero-friction Telegram Mini App UI',
        'Full-stack development and deployment from scratch',
      ],
      metrics: [] as { value: string; label: string }[],
      result: [
        'Fully functional EdTech MVP focused on immediate phrase application',
      ],
    },
    'aliya-wooden': {
      tag: 'Booking UX',
      project: 'Booking path for Wooden Chalets · Aliya',
      problem: 'Low completion rate for room bookings on the site',
      solution: [
        'Booking path on the hotel room page with an interactive calculator',
      ],
      metrics: [] as { value: string; label: string }[],
      result: [] as string[],
    },
  },
} as const;

export type CaseSlug = keyof typeof caseCopy.ru;

export type CaseMetric = { value: string; label: string };

export type CaseCopyFields = {
  tag: string;
  project: string;
  problem: string;
  solution: readonly string[];
  /** A-style big figures — only when real metrics exist */
  metrics: readonly CaseMetric[];
  /** Qualitative result prose when no numeric metrics */
  result: readonly string[];
};

export function getCaseCopy(locale: Locale, slug: string): CaseCopyFields | undefined {
  const dict = caseCopy[locale] as Record<string, CaseCopyFields>;
  return dict[slug];
}
