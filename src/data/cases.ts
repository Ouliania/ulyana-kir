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
  task: { en: string; ru: string };
  implementation: { en: string; ru: string };
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
    task: {
      en: 'Build a portfolio site for a 3D creator that stops the scroll and drives inquiries',
      ru: 'Собрать портфолио для 3D-криейтора, которое останавливает скролл и приводит заявки',
    },
    implementation: {
      en: 'EN landing with clear offer, service grid, cases, and frictionless contact path',
      ru: 'EN-лендинг: оффер, услуги, кейсы и короткий путь к контакту',
    },
    video: '/videos/creator.mp4',
    featured: true,
  },
  {
    slug: 'grom-bike',
    project: 'Grom.bike',
    url: 'https://grom.bike/',
    role: ['copy', 'structure'],
    task: {
      en: 'Move off marketplace dependency and attract owned traffic',
      ru: 'Уйти от зависимости от маркетплейса и привлечь свой трафик',
    },
    implementation: {
      en: 'Fast, low-cost landing structure on Yandex Kit — message and path to purchase',
      ru: 'Быстро и недорого собрали страницу на Kit от Яндекса — смысл и путь к покупке',
    },
    video: '/videos/grom-bike.mp4',
    featured: true,
  },
  {
    slug: 'progolos',
    project: 'Progolos · Vladivostok',
    url: 'https://progolos.pro/vladivostok',
    role: ['structure', 'copy'],
    task: {
      en: 'Rework structure and copy so paid search stops leaking leads',
      ru: 'Переработать структуру и тексты, чтобы контекст перестал терять заявки',
    },
    implementation: {
      en: 'City-page structure and message rebuilt — search CPA −57–68%, conversions ×3–4 in Vladivostok and Khabarovsk',
      ru: 'Пересобрала структуру и тексты городской страницы — CPA в поиске −57–68%, конверсии ×3–4 во Владивостоке и Хабаровске',
    },
    video: '/videos/progolos.mp4',
    featured: true,
  },
  {
    slug: 'aliya-wooden',
    project: 'Wooden Chalets · Aliya',
    url: '/cases/wooden-room/',
    role: ['layout', 'booking UX'],
    task: {
      en: 'Show a booking path for a premium room type as a living product demo',
      ru: 'Показать путь бронирования премиум-номера как живое продуктовое демо',
    },
    implementation: {
      en: 'Interactive room page: gallery, amenities, dates, and booking summary UX',
      ru: 'Интерактивная страница номера: галерея, удобства, даты и UX сводки бронирования',
    },
    video: '/videos/wooden-chalet.mp4',
    featured: true,
  },
];

export function getCase(slug: string): CaseStudy | undefined {
  return cases.find((c) => c.slug === slug);
}
