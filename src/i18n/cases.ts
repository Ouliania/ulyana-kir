import type { Locale } from './ui';

/** Case body copy — author RU first, then sync EN (SPEC V20) */
export const caseCopy = {
  ru: {
    techexpert: {
      tag: 'Создание сайта',
      project: 'Сайт для дистрибьютора ИС «Техэксперт»',
      problem:
        'Устаревший сайт не передавал статус официального дистрибьютора. Описание сервиса строилось на сухих функциях, а не на понятных выгодах для бизнеса.',
      solution: [
        'Анализ B2B-аудитории и перенос фокуса с сухих характеристик на язык выгод',
        'Проектирование CJM с микрошагами до заявки для холодных клиентов',
        'Сборка на Tilda с кастомным кодом: чертежная сетка, интерактивная карта и анимации',
      ],
      metrics: [] as { value: string; label: string }[],
      result: [
        'Имиджевый B2B-инструмент, который формирует доверие к компании и закрывает ключевые возражения до контакта с отделом продаж.',
      ],
    },
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
      project: 'Разработка сценария клиента до заявки',
      problem:
        'Клиент переходил с маркетплейса на свой сайт Yandex.Kit. На сайте был каталог без ответов на задачи и страхи покупателей.',
      solution: [
        'Навигация каталога по целям (город, прогулки, нагрузки)',
        'Созданы баннеры-смыслы в обход ограничений конструктора',
        'Две воронки с отработкой страхов, мешающих заявкам',
      ],
      metrics: [] as { value: string; label: string }[],
      result: [
        'Независимость от маркетплейсов: автономный сайт, доводящий онлайн- и офлайн-клиентов до заявки через закрытие страхов.',
      ],
    },
    creator: {
      tag: 'Создание сайта',
      project: 'Создание сайта на коде',
      problem:
        'Экспертиза и кейсы рассеяны по соцсетям и дискам, не раскрывая подход и глубину работы. Отсутствовала единая точка касания с потенциальными клиентами.',
      solution: [
        'Спроектировала концепцию, структуру страницы, тексты и упаковку кейсов',
        'Сверстала сайт на коде (React + Node.js) с динамическими анимациями',
        'Выстроила понятный путь клиента: от знакомства с подходом до изучения работ и отправки заявки',
      ],
      metrics: [] as { value: string; label: string }[],
      result: [
        'Единый хаб личного бренда, который экономит время на квалификации клиентов и повышает конверсию в сделку за счет прозрачности.',
      ],
    },
    'interval-lingo': {
      tag: 'Создание MVP',
      project: 'Создание Telegram Mini App для изучения английского',
      problem:
        'Стандартные сервисы с карточками (Flashcards) заставляют заучивать слова в изоляции, из-за чего люди не понимают, как применять их в реальной речи.',
      solution: [
        'Исследована проблема (Problem-Solution Fit) и спроектирована концепция изучения слов в контексте',
        'Проработан простой сценарий пользователя (CJM) и интерфейс приложения',
        'Выполнен полный цикл сборки и запуска Mini App в Telegram с подключением базы данных',
      ],
      metrics: [] as { value: string; label: string }[],
      result: [
        'Готовое продуктовое MVP с системой интервальных повторений, обучающее использовать живые фразы в контексте.',
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
    techexpert: {
      tag: 'Website Development',
      project: '"Tech-Expert" Distributor Website',
      problem:
        'An outdated site failed to reflect official distributor status, listing dry tech specs instead of clear business value.',
      solution: [
        'B2B audience analysis and reframing tech features into tangible client benefits',
        'Customer journey design featuring friction-free micro-conversions',
        'Tilda development with custom code: blueprint grid background, interactive map, and dynamic animations',
      ],
      metrics: [] as { value: string; label: string }[],
      result: [
        'High-trust B2B platform that builds brand authority and addresses buyer objections before the first sales touchpoint.',
      ],
    },
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
      tag: 'E-commerce Development',
      project: 'Customer Journey Optimization for a Bike E-commerce Store',
      problem:
        'Transitioning from marketplaces to their own Yandex.Kit site, the catalog failed to address buyers’ goals and online purchase fears.',
      solution: [
        'Intent-based catalog navigation (commuting, weekend rides, heavy loads)',
        'Custom visual narrative banners bypassing CMS limitations',
        'Dual sales funnels handling core conversion objections',
      ],
      metrics: [] as { value: string; label: string }[],
      result: [
        'Marketplace independence: a standalone site driving both online and offline leads by proactively addressing buyer objections.',
      ],
    },
    creator: {
      tag: 'Website Development',
      project: 'Custom-Coded Website Development',
      problem:
        'Case studies and expertise were scattered across social platforms and drives, failing to convey methodology and depth. The creator lacked a unified touchpoint for potential clients.',
      solution: [
        'Designed the site concept, layout, copywriting, and case study packaging',
        'Coded the site using React + Node.js with dynamic animations',
        'Built a clear customer journey: from understanding the workflow to reviewing cases and submitting a request',
      ],
      metrics: [] as { value: string; label: string }[],
      result: [
        'A single personal brand hub that saves time on client qualification and boosts deal conversion through process transparency.',
      ],
    },
    'interval-lingo': {
      tag: 'MVP Development',
      project: 'Telegram Mini App for Contextual English Learning',
      problem:
        'Traditional flashcard apps force isolated vocabulary memorization, leaving learners unable to use words in real-world conversations.',
      solution: [
        'Conducted user problem research (Problem-Solution Fit) to design a context-first learning concept',
        'Mapped out a friction-free user journey (CJM) and clean UI/UX layout',
        'Built and deployed a full-stack Telegram Mini App integrated with a custom database',
      ],
      metrics: [] as { value: string; label: string }[],
      result: [
        'A launch-ready EdTech MVP featuring spaced repetition for learning practical phrases in context.',
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
