import type { Locale } from './ui';

/** Case body copy — author RU first, then sync EN (SPEC V20) */
export const caseCopy = {
  ru: {
    progolos: {
      tag: 'Увеличение конверсии',
      project:
        'UX и копирайтинг для лендинга студии вокала Progolos под рекламу',
      problem:
        'Сайт не закрывал главные страхи новичков («нет слуха», «уже поздно учиться», «стесняюсь»), а структура не имела промежуточных целевых действий для «холодного» трафика',
      solution: [
        'Провела анализ конкурентов и психологических барьеров целевой аудитории',
        'Пересобрала путь клиента (CJM) и создала новую структуру с пошаговой проработкой возражений и страхов',
        'Ввела легкие промежуточные целевые шаги (микроконверсии) для вовлечения людей, не готовых сразу купить курс',
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
        'UX and copy for the Progolos vocal studio landing page built for performance ads',
      problem:
        'The site did not address beginners’ main fears (“no ear for music”, “too late to learn”, “I’m shy”), and the structure had no intermediate actions for cold traffic',
      solution: [
        'Analyzed competitors and the audience’s psychological barriers',
        'Rebuilt the customer journey (CJM) and a new structure that works objections and fears step by step',
        'Added light intermediate goals (micro-conversions) for people not ready to buy a course yet',
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
