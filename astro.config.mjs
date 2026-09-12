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
  /*
   * Astro's default directory format, deliberately: it writes
   * what-we-do/index.html, which every static host resolves at /what-we-do on
   * its own. The flat `file` format writes what-we-do.html, which Vercel only
   * serves at /what-we-do when `cleanUrls` is set in vercel.json — so the whole
   * site 404s if that one line is ever removed. It did, on the first preview
   * deploy of this branch. Routing should not depend on a host config flag.
   */
  // Every page here is noindex, so listing it in the sitemap would send two
  // contradictory signals. /privacy rejoins once the notice is written and
  // the noindex comes off.
  integrations: [
    sitemap({
      filter: (page) =>
        !['/404', '/thank-you', '/could-not-send', '/privacy'].some((path) =>
          page.includes(path),
        ),
    }),
  ],
  compressHTML: true,
});
