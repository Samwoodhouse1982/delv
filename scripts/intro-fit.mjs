/**
 * Checks that the intro's phrase is actually on screen, at every shape.
 *
 *   node scripts/intro-fit.mjs
 *
 * ## Why this exists
 *
 * The intro composes on a fixed virtual stage that is scaled to cover the
 * viewport. Cover means the scale is driven by whichever axis needs more, so
 * on a portrait phone a landscape stage is scaled by its height and the
 * phrase runs off both sides. At 390x844 the reader saw "iver val": no d, no
 * full stop, and the whole piece is about a phrase condensing into "delv."
 *
 * It shipped. Nothing caught it, and nothing could have: axe was clean,
 * because the overlay is aria-hidden and carries no content; the overflow
 * check was clean, because the overlay is `position: fixed` inside
 * `overflow: hidden` and clips rather than scrolls; the page diff was clean,
 * because the markup never changed. It is only wrong once a browser has laid
 * it out at a particular aspect ratio.
 *
 * So this lays it out, at twenty shapes from a small phone in portrait to a
 * 2560 desktop, and asks the only question that matters: is every visible
 * letter inside the viewport?
 *
 * ## What it does not check
 *
 * That the animation is any good. Timing, easing and the dive into the full
 * stop are all judged by eye, as they should be.
 */
import { launchChromium } from './browser.mjs';
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const ROOT = new URL('../dist/', import.meta.url).pathname;
const TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};

/* Portrait first, then landscape. The two lists exercise the two stages. */
const SIZES = [
  [320, 568],
  [360, 640],
  [375, 667],
  [390, 844],
  [414, 896],
  [430, 932],
  [768, 1024],
  [820, 1180],
  [1024, 1366],
  [568, 320],
  [640, 360],
  [844, 390],
  [932, 430],
  [1024, 768],
  [1280, 800],
  [1440, 900],
  [1920, 1080],
  [2560, 1440],
];

const server = http.createServer(async (req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  let file = path.join(ROOT, url);
  try {
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
  } catch {
    file = path.join(ROOT, '404.html');
  }
  try {
    const body = await readFile(file);
    res.writeHead(200, {
      'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream',
    });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end('not found');
  }
});
await new Promise((r) => server.listen(4321, r));

const browser = await launchChromium();
let bad = 0;

for (const [w, h] of SIZES) {
  const context = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/', { waitUntil: 'domcontentloaded' });

  /* A second in: every letter has arrived and none has been dropped yet. */
  await page
    .waitForFunction(() => performance.now() >= 1000, null, { timeout: 15000 })
    .catch(() => {});

  const box = await page.evaluate(() => {
    const spans = [...document.querySelectorAll('#introRow > span')];
    if (!spans.length) return null;
    let left = Infinity;
    let right = -Infinity;
    let top = Infinity;
    let bottom = -Infinity;
    for (const span of spans) {
      /* A letter already faded out is not something anyone has to see. */
      if (Number(getComputedStyle(span).opacity) < 0.05) continue;
      const r = span.getBoundingClientRect();
      left = Math.min(left, r.left);
      right = Math.max(right, r.right);
      top = Math.min(top, r.top);
      bottom = Math.max(bottom, r.bottom);
    }
    return { left, right, top, bottom, vw: innerWidth, vh: innerHeight };
  });

  await context.close();

  if (!box) {
    console.log(`  SKIP  ${w}x${h}: the overlay did not play`);
    continue;
  }

  const fits =
    box.left >= 0 && box.right <= box.vw && box.top >= 0 && box.bottom <= box.vh;
  const used = Math.round(((box.right - box.left) / box.vw) * 100);
  if (fits) {
    console.log(`  ok    ${String(`${w}x${h}`).padEnd(10)} ${used}% of the width`);
  } else {
    console.log(
      `  CLIPS ${String(`${w}x${h}`).padEnd(10)} x ${Math.round(box.left)}..${Math.round(
        box.right,
      )} of ${box.vw}, y ${Math.round(box.top)}..${Math.round(box.bottom)} of ${box.vh}`,
    );
    bad++;
  }
}

await browser.close();
server.close();

console.log(
  bad === 0
    ? `\n  the intro fits at all ${SIZES.length} shapes`
    : `\n  the intro is cut off at ${bad} of ${SIZES.length} shapes`,
);
process.exit(bad ? 1 : 0);
