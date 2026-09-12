/**
 * Runs axe-core over every built page and fails if anything is reported.
 *
 * §10 of the build brief makes "Axe DevTools reports zero violations" part of
 * the definition of done, which only stays true if it is checked on every
 * change rather than once at the end. Run `npm run check`.
 *
 * A clean run here is a floor, not a pass. Axe does not reliably catch
 * SC 1.4.11 (focus indicators, form control boundaries) or reading order, so
 * those are still checked by hand — see the README.
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { launchChromium } from './browser.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');

const PAGES = [
  '/',
  '/what-we-do',
  '/for-startups',
  '/how-we-work',
  '/who-we-are',
  '/contact',
  '/thank-you',
  '/could-not-send',
  '/privacy',
  '/404',
];

// Every width in §10's responsive list, so a violation that only appears once
// the mobile nav is in play is still caught.
const WIDTHS = [320, 375, 768, 1024, 1440];

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
};

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  // Mirrors a static host: an extensionless path resolves to the index.html
  // inside the matching directory (Astro's directory format), falling back to
  // a sibling .html file, which is how /404 is emitted.
  const path = url.pathname;
  const candidates = extname(path)
    ? [path]
    : [join(path, 'index.html'), `${path.replace(/\/$/, '')}.html`];

  for (const candidate of candidates) {
    try {
      const body = await readFile(join(root, candidate));
      res.writeHead(200, {
        'Content-Type': TYPES[extname(candidate)] ?? 'application/octet-stream',
      });
      return res.end(body);
    } catch {
      // Try the next shape.
    }
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('not found');
});

await new Promise((done) => server.listen(0, '127.0.0.1', done));
const base = `http://127.0.0.1:${server.address().port}`;

const axeSource = await readFile(
  resolve(dirname(fileURLToPath(import.meta.url)), '..', 'node_modules/axe-core/axe.min.js'),
  'utf-8',
);

const browser = await launchChromium();
let failures = 0;

for (const width of WIDTHS) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });

  for (const path of PAGES) {
    await page.goto(base + path, { waitUntil: 'networkidle' });
    await page.addScriptTag({ content: axeSource });

    const { violations } = await page.evaluate(() =>
      // @ts-expect-error axe is injected above
      window.axe.run(document, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] },
      }),
    );

    // The page must never scroll sideways, at any width (§10).
    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );

    if (violations.length === 0 && !overflows) continue;

    failures += violations.length + (overflows ? 1 : 0);
    console.error(`\n${path} at ${width}px`);
    if (overflows) console.error('  · horizontal overflow');
    for (const violation of violations) {
      console.error(`  · [${violation.impact}] ${violation.id}: ${violation.help}`);
      for (const node of violation.nodes.slice(0, 3)) {
        console.error(`      ${node.target.join(' ')}`);
      }
    }
  }

  await page.close();
}

await browser.close();
server.close();

if (failures > 0) {
  console.error(`\n${failures} accessibility problem(s). See above.`);
  process.exit(1);
}

console.log(`axe: clean across ${PAGES.length} pages x ${WIDTHS.length} widths.`);
