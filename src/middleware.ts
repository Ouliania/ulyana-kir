// @ts-ignore
import Typograf from 'typograf';
import { defineMiddleware } from 'astro:middleware';

const tp = new Typograf({
  locale: ['ru', 'en-US'],
  htmlEntity: { type: 'name' } // Преобразует неразрывные пробелы в &nbsp; и кавычки в елочки
});

export const onRequest = defineMiddleware(async (context, next) => {
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
