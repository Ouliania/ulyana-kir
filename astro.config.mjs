// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function singleSitemap() {
  return {
    name: 'single-sitemap',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const destDir = fileURLToPath(dir);
        const sitemap0 = path.join(destDir, 'sitemap-0.xml');
        const sitemapIndex = path.join(destDir, 'sitemap-index.xml');
        const sitemapTarget = path.join(destDir, 'sitemap.xml');

        try {
          await fs.copyFile(sitemap0, sitemapTarget);
          await fs.unlink(sitemap0);
          await fs.unlink(sitemapIndex);
          logger.info('`sitemap.xml` created (consolidated single sitemap)');
        } catch (err) {
          logger.error(`Error consolidating sitemap: ${err}`);
        }
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://www.ulyanaweb.ru',
  integrations: [
    sitemap({
      filter: (page) => {
        const url = new URL(page);
        if (
          url.pathname === '/blog/' ||
          (url.pathname.startsWith('/blog/') && !url.pathname.startsWith('/ru/blog/'))
        ) {
          return false;
        }
        return true;
      },
    }),
    singleSitemap(),
  ],
});