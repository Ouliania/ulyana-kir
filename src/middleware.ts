// @ts-ignore
import Typograf from 'typograf';
import { defineMiddleware } from 'astro:middleware';

const tp = new Typograf({
  locale: ['ru', 'en-US'],
  htmlEntity: { type: 'name' } // Преобразует неразрывные пробелы в &nbsp; и кавычки в елочки
});

/** Domain → default locale. Domains not listed here default to 'en'. */
const DOMAIN_DEFAULT_LOCALE: Record<string, 'ru' | 'en'> = {
  'ulyanaweb.ru': 'ru',
  'www.ulyanaweb.ru': 'ru',
};

function defaultLocaleForHost(hostname: string): 'ru' | 'en' {
  const host = hostname.split(':')[0]; // strip port for local dev
  return DOMAIN_DEFAULT_LOCALE[host] ?? 'en';
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname, hostname } = context.url;

  const defaultLocale = defaultLocaleForHost(hostname);
  const cookieLang = context.cookies.get('lang')?.value as 'ru' | 'en' | undefined;
  const effectiveLocale: 'ru' | 'en' = cookieLang ?? defaultLocale;

  const isRuPath = pathname === '/ru' || pathname.startsWith('/ru/');
  const isRoot = pathname === '/' || pathname === '';

  // Skip redirects for static assets
  const isStaticAsset =
    pathname.startsWith('/_astro/') ||
    pathname.startsWith('/assets/') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/videos/') ||
    pathname.startsWith('/fonts/') ||
    /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?|webp|mp4|webm|json|xml|txt)(\?.*)?$/i.test(pathname);

  // Redirect based on domain + cookie
  if (!isStaticAsset && effectiveLocale === 'ru' && !isRuPath) {
    const target = isRoot ? '/ru/' : `/ru${pathname}${pathname.endsWith('/') ? '' : '/'}`;
    return new Response(null, { status: 302, headers: { Location: target } });
  }

  if (!isStaticAsset && effectiveLocale === 'en' && isRuPath) {
    const rest = pathname.replace(/^\/ru/, '') || '/';
    const target = rest.endsWith('/') || rest === '/' ? rest : `${rest}/`;
    return new Response(null, { status: 302, headers: { Location: target } });
  }

  const response = await next();
  
  // Обрабатываем только HTML-ответы
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('text/html')) {
    const html = await response.text();
    const processedHtml = tp.execute(html);
    
    return new Response(processedHtml, {
      status: response.status,
      headers: response.headers
    });
  }
  
  return response;
});
