export type CaseRole =
  | 'design'
  | 'layout'
  | 'copy'
  | 'structure'
  | 'booking UX'
  | 'full';

export interface CaseStudy {
  slug: string;
  project: string;
  url?: string;
  role: CaseRole[];
  service: { en: string; ru: string };
  problem: { en: string; ru: string };
  solution: { en: string; ru: string };
  /** Real metric only — omit when none */
  result?: { en: string; ru: string };
  /** Case page meta only — omit from home cards */
  stack?: { en: string; ru: string };
  /** Path under /public, e.g. /videos/creator.mp4 */
  video?: string;
  poster?: string;
  featured?: boolean;
}

export const cases: CaseStudy[] = [
  {
    slug: 'creator',
    project: 'creator.ulyanaweb.ru',
    url: 'https://creator.ulyanaweb.ru/',
    role: ['full'],
    service: {
      en: 'Portfolio site',
      ru: 'Сайт портфолио',
    },
    problem: {
      en: 'Stand out as a freelancer — leave cheap freelance platforms and high competition',
      ru: 'Выделиться фрилансеру, уйти от дешевых фриланс бирж и высокой конкуренции',
    },
    solution: {
      en: 'Portfolio with a clear offer, work samples, and a short path to inquiry',
      ru: 'Портфолио с оффером, работами и коротким путём к заявке',
    },
    stack: {
      en: 'Clean code',
      ru: 'Чистый код',
    },
    video: '/videos/creator.mp4',
    featured: true,
  },
  {
    slug: 'grom-bike',
    project: 'Grom.bike',
    url: 'https://grom.bike/',
    role: ['copy', 'structure'],
    service: {
      en: 'Online store',
      ru: 'Интернет-магазин',
    },
    problem: {
      en: 'Marketplace dependency and fees. No direct contact with the customer',
      ru: 'Зависимость от маркетплейса и комиссий. Нет прямого контакта с клиентом',
    },
    solution: {
      en: 'Own page on Yandex Kit — offer and path to purchase',
      ru: 'Своя страница на Yandex Kit: оффер и путь к покупке',
    },
    stack: {
      en: 'Yandex Kit',
      ru: 'Yandex Kit',
    },
    video: '/videos/grom-bike.mp4',
    featured: true,
  },
  {
    slug: 'progolos',
    project: 'Progolos · Vladivostok',
    url: 'https://progolos.pro/vladivostok',
    role: ['structure', 'copy'],
    service: {
      en: 'Conversion boost',
      ru: 'Увеличение конверсии',
    },
    problem: {
      en: 'High cost per lead from Yandex Direct',
      ru: 'Высокая стоимость заявки с Яндекс Директ',
    },
    solution: {
      en: 'Rebuilt city-page structure and copy',
      ru: 'Пересобрала структуру и тексты городской страницы',
    },
    result: {
      en: 'Conversions ×4, CPA −68.5%',
      ru: 'Рост конверсии в 4 раза, снижение CPA на 68.5%',
    },
    video: '/videos/progolos.mp4',
    featured: true,
  },
  {
    slug: 'aliya-wooden',
    project: 'Wooden Chalets · Aliya',
    url: '/cases/wooden-room/',
    role: ['layout', 'booking UX'],
    service: {
      en: 'Booking UX',
      ru: 'UX бронирования',
    },
    problem: {
      en: 'Low completion rate for room bookings on the site',
      ru: 'Низкий процент завершения бронирования номера на сайте',
    },
    solution: {
      en: 'Booking path on the hotel room page with an interactive calculator',
      ru: 'Проработка пути бронирования прямо на странице номера отеля с интерактивным калькулятором',
    },
    stack: {
      en: 'Clean code',
      ru: 'Чистый код',
    },
    video: '/videos/wooden-chalet.mp4',
    featured: true,
  },
];

export function getCase(slug: string): CaseStudy | undefined {
  return cases.find((c) => c.slug === slug);
}
