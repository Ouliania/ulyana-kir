import { getCaseCopy, type CaseSlug } from '../i18n/cases';
import type { Locale } from '../i18n/ui';

export type CaseRole = string;

export interface CaseStudy {
  slug: CaseSlug;
  /** Short project name for links / captions */
  projectName: string;
  url?: string;
  /** Home chips — display labels (e.g. structure, Custom Code) */
  role: CaseRole[];
  /** Home media wash — rotates per case (⊥ all blue) */
  tint?: 'blue' | 'violet' | 'yellow' | 'teal' | 'shell';
  /** Case page meta only — omit from home cards */
  stack?: { en: string; ru: string };
  /** Path under /public, e.g. /videos/creator.mp4 */
  video?: string;
  poster?: string;
  /** landscape 16:9 (default) | portrait phone / Mini App */
  mediaAspect?: 'landscape' | 'portrait';
  featured?: boolean;
}

export const cases: CaseStudy[] = [
  {
    slug: 'techexpert',
    projectName: 'Техэксперт',
    url: 'https://techexpert-kodex.tilda.ws/',
    role: ['UX Strategy', 'B2B Copywriting', '#Tilda', '#CustomCode'],
    tint: 'shell',
    stack: {
      en: 'Tilda + Custom Code',
      ru: 'Tilda + Custom Code',
    },
    video: '/videos/techexpert.mp4',
    featured: true,
  },
  {
    slug: 'progolos',
    projectName: 'Progolos · Vladivostok',
    url: 'https://progolos.pro/vladivostok',
    role: ['UX Strategy', 'Copywriting'],
    tint: 'blue',
    video: '/videos/progolos.mp4',
    featured: true,
  },
  {
    slug: 'grom-bike',
    projectName: 'Grom.bike',
    url: 'https://grom.bike/',
    role: ['UX Strategy', 'Copywriting', 'Design'],
    tint: 'yellow',
    stack: {
      en: 'Yandex Kit',
      ru: 'Yandex Kit',
    },
    video: '/videos/grom-bike.mp4',
    featured: true,
  },
  {
    slug: 'creator',
    projectName: 'Creator',
    url: 'https://creator.ulyanaweb.ru/',
    role: ['UX Strategy', 'Copywriting', '#CustomCoded'],
    tint: 'violet',
    stack: {
      en: 'React + Node.js',
      ru: 'React + Node.js',
    },
    video: '/videos/creator.mp4',
    featured: true,
  },
  {
    slug: 'interval-lingo',
    projectName: 'IntervalLingo',
    url: 'https://t.me/Interval_eng_bot',
    role: [
      'Product Design',
      'Product Management',
      'UX/UI',
      'React',
      'Vite',
      '#TelegramMiniApp',
    ],
    tint: 'shell',
    stack: {
      en: 'React · Telegram Mini App',
      ru: 'React · Telegram Mini App',
    },
    video: '/videos/interval-lingo.mp4',
    mediaAspect: 'portrait',
    featured: true,
  },
  {
    slug: 'aliya-wooden',
    projectName: 'Wooden Chalets · Aliya',
    url: '/cases/wooden-room/',
    role: ['Layout', 'Booking UX'],
    tint: 'teal',
    stack: {
      en: 'Clean code',
      ru: 'Чистый код',
    },
    video: '/videos/wooden-chalet.mp4',
    featured: false,
  },
];

export function getCase(slug: string): CaseStudy | undefined {
  return cases.find((c) => c.slug === slug);
}

/** Localized fields for a case (home + case page) */
export function caseLocalized(item: CaseStudy, locale: Locale) {
  const copy = getCaseCopy(locale, item.slug);
  if (!copy) {
    throw new Error(`Missing case copy for ${item.slug}/${locale}`);
  }
  return {
    ...copy,
    projectName: item.projectName,
  };
}
