import type { Locale } from './ui';

/** Case body copy — author RU first, then sync EN (SPEC V20) */
export const caseCopy = {
  ru: {
    progolos: {
      tag: 'Копирайтинг / Увеличение конверсии',
      project:
        'Увеличение конверсии сайта студии вокала «Progolos»',
      problem:
        'Сайт не закрывал главные страхи новичков («нет слуха», «уже поздно учиться», «стесняюсь»), а структура не имела промежуточных целевых действий для «холодного» трафика.',
      solution: [
        'Провела анализ конкурентов и психологических барьеров целевой аудитории.',
        'Пересобрала путь клиента (CJM) и создала новую структуру с пошаговой проработкой возражений и страхов.',
        'Внедрила легкие промежуточные целевые шаги (микроконверсии) для вовлечения людей, не готовых сразу купить курс.',
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
        'Клиент переходил с маркетплейса на собственный сайт (платформа Яндекс.Кит). Сайт выглядел как сухой каталог характеристик без прогрева, отработки возражений и логики продаж. Платформа имела жесткие ограничения (нельзя добавлять произвольные блоки и форматировать текст)',
      solution: [
        'Перестроила логику каталога: перевела навигацию с технических характеристик на задачи пользователя («для города», «для прогулок», «для высоких нагрузок»)',
        'Обошла ограничения платформы: разработала визуальные баннеры-смыслы (графические блоки), чтобы обойти технический лимит конструктора и донести до клиента офферы и преимущества',
        'Разделила сценарии (CJM): для иногородних — закрыла страхи онлайн-покупки (сложность сборки, доставка, целостность); для местных — настроила воронку с зазывом в офлайн-шоурум на бесплатный тест-драйв',
      ],
      metrics: [] as { value: string; label: string }[],
      result: [
        'Сформирован удобный онлайн-каталог с понятной навигацией по целям покупки и бесшовным сценарием заказа как для онлайн-клиентов, так и для посетителей офлайн-магазина',
      ],
    },
    creator: {
      tag: 'Сайт-портфолио',
      project: 'Сайт-портфолио для контент-мейкера',
      problem:
        'Стандартные конструкторы и шаблоны не передавали индивидуальность автора и не позволяли реализовать сложную интерактивную графику. Требовалось создать современный сайт-витрину, который закрывает две задачи: выстраивает уровень доверия и ведет клиента по четкой воронке к заявке',
      solution: [
        'Разработка на чистом коде: реализовала проект на стеке React + Node.js с индивидуальной версткой без конструкторов',
        'Креативный интерактив: запрограммировала интерактивный заглавный блок с отслеживанием положения курсора (JS/Canvas animation) для вовлечения пользователя с первых секунд',
        'Конверсионная структура: спроектировала понятный путь клиента от первого впечатления через портфолио и прайс-лист к форме обратной связи',
      ],
      metrics: [] as { value: string; label: string }[],
      result: [
        'Имиджевый, высокоскоростной сайт с интерактивом, который через понятную структуру отвечает на самые важные вопросы клиента перед заявкой и вызывает доверие',
      ],
    },
    'interval-lingo': {
      tag: 'Продуктовый дизайн',
      project:
        'Telegram Mini App для изучения английских слов и фраз в контексте',
      problem:
        'Большинство приложений (Quizlet, Anki) используют механическое заучивание изолированных слов по карточкам (Flashcards). Это создает «иллюзию знания»: человек помнит перевод слова на карточке, но не может использовать его в реальной речи и контексте',
      solution: [
        'Отказалась от заучивания отдельных слов в пользу освоения готовых устойчивых фраз и смысловых контекстов через написание слов',
        'Спроектировала удобное добавление слов и фраз — в том числе с AI-генерацией в контексте предложения — плюс интервальное повторение',
        'Спроектировала интерфейс и с помощью вайбкодинга с базой данных через сервер запустила приложение',
      ],
      metrics: [] as { value: string; label: string }[],
      result: [
        'Работающий MVP, где пользователь заучивает не абстрактные слова, а готовые паттерны речи через написание их в контексте — с лёгким AI-пополнением словаря под интерес пользователя',
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
      tag: 'Copywriting / Conversion Boost / UX Strategy',
      project:
        'Website Conversion Optimization for "Progolos" Vocal Studio',
      problem:
        'The website failed to address core beginner anxieties ("I have no pitch," "it\'s too late to learn," "I\'m shy"), offering no soft entry points (micro-conversions) for cold ad traffic.',
      solution: [
        'Conducted a thorough competitor analysis and mapped out the target audience’s psychological barriers.',
        'Redesigned the Customer Journey Map (CJM) and created a new page structure addressing objections and fears step by step.',
        'Introduced low-friction intermediate CTAs (micro-conversions) to engage leads not yet ready for an immediate purchase.',
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
        'The client was moving from a marketplace to their own site (Yandex Kit). The site read as a dry specs catalog — no warmup, objection handling, or sales logic. The platform had hard limits (no custom blocks, limited text formatting)',
      solution: [
        'Restructured the catalog: shifted navigation from technical specs to user jobs (“for the city”, “for leisure rides”, “for heavy loads”)',
        'Worked around platform limits: designed meaning-led visual banners (graphic blocks) to carry offers and benefits past the builder’s constraints',
        'Split journeys (CJM): for out-of-town buyers — closed online-purchase fears (assembly, delivery, integrity); for locals — a funnel that invites a free in-store test ride',
      ],
      metrics: [] as { value: string; label: string }[],
      result: [
        'A clear online catalog navigated by purchase goals, with a seamless order path for both online buyers and offline store visitors',
      ],
    },
    creator: {
      tag: 'Portfolio site',
      project: 'Portfolio site for a content creator',
      problem:
        'Standard builders and templates could not carry the author’s individuality or support complex interactive graphics. The brief was a modern showcase site that does two jobs: builds trust and walks the client through a clear funnel to an inquiry',
      solution: [
        'Custom code: built the project on React + Node.js with bespoke layout — no page builders',
        'Creative interaction: programmed an interactive hero that tracks cursor position (JS/Canvas animation) to engage from the first seconds',
        'Conversion structure: designed a clear path from first impression through portfolio and pricing to the contact form',
      ],
      metrics: [] as { value: string; label: string }[],
      result: [
        'An image-led, fast site with interaction — a clear structure that answers the client’s main questions before inquiry and builds trust',
      ],
    },
    'interval-lingo': {
      tag: 'Product design',
      project:
        'Telegram Mini App for learning English words and phrases in context',
      problem:
        'Most apps (Quizlet, Anki) rely on mechanical memorization of isolated words on flashcards. That creates an “illusion of knowing”: people recall the translation on the card but cannot use the word in real speech and context',
      solution: [
        'Dropped isolated-word drills in favor of ready-made collocations and meaning contexts learned by writing the words',
        'Designed easy add-word / add-phrase flows — including AI generation inside a sentence — plus spaced repetition',
        'Designed the interface and shipped the app with vibe coding against a server-backed database',
      ],
      metrics: [] as { value: string; label: string }[],
      result: [
        'A working MVP where users learn speech patterns, not abstract words — by writing them in context, with light AI vocabulary growth tailored to their interests',
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
