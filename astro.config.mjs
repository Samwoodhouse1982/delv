// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Placeholder until the domain in §13.1 of the brief is settled. `site` has to
// be a real absolute URL for canonicals, Open Graph and the sitemap to resolve,
// so this is one of the values to change before launch.
export const SITE_URL = 'https://delv.health';

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  // Keep the transactional pages and the 404 out of the sitemap; they are
  // noindex and only reachable as a form redirect target.
  integrations: [
    sitemap({
      filter: (page) =>
        !['/404', '/thank-you', '/could-not-send'].some((path) =>
          page.includes(path),
        ),
    }),
  ],
  compressHTML: true,
});
