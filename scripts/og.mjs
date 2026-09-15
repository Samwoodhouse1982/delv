/**
 * Renders the Open Graph cards into public/og/, one per page, 1200x630.
 *
 * Run manually (`npm run og`) and commit the output. Deploys must not depend
 * on a headless browser being available, and these only change when a page
 * heading does.
 *
 * The cards are drawn in the site's own language: ink ground, the delv.
 * logotype with its aquamarine full stop, the page heading in Archivo, and
 * the measurement rule. Fonts are loaded straight off disk, so the render
 * does not touch the network.
 */
import { launchChromium } from './browser.mjs';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = resolve(root, 'public/og');
const fontUrl = (file) => pathToFileURL(resolve(root, 'public/fonts', file)).href;

/*
 * The real wordmark, inlined with currentColor on the letterforms so it can be
 * painted white on the ink ground. The supplied file paints them in --ink,
 * which would be invisible here.
 */
const logoSvg = await readFile(resolve(root, 'public/brand/delv-logo.svg'), 'utf-8');
if (!/class="cls-1"/.test(logoSvg) || !/class="cls-2"/.test(logoSvg)) {
  throw new Error(
    'delv-logo.svg no longer uses cls-1 (letterforms) and cls-2 (dot). ' +
      'Recolouring here depends on those names: without them the wordmark ' +
      'would paint in its own ink and vanish against the card. Update the ' +
      'replacements below to match the new export.',
  );
}
const wordmark = logoSvg
  .replace(/<defs>[\s\S]*?<\/defs>/, '')
  .replace(/class="cls-1"/g, 'fill="currentColor"')
  .replace(/class="cls-2"/g, 'fill="#16F4D0"')
  .replace('<svg ', '<svg class="logo" ');

/*
 * Headings are transcribed from each page's h1, not read from the data files,
 * because they carry their own line breaks. That means they drift when a page
 * is reworded: check them against src/data/*.ts when you change an h1.
 */
const CARDS = [
  { file: 'home.png', heading: 'Prove the <span class="mark">value</span>.\nProve the why.', eyebrow: null },
  { file: 'what-we-do.png', heading: 'Define. Measure.\nArticulate.', eyebrow: 'What we do' },
  { file: 'for-startups.png', heading: 'For founders with traction\nand no proof yet.', eyebrow: 'Startups' },
  { file: 'scale-ups.png', heading: 'The proof is already in\nyour deployment data.', eyebrow: 'Scale-ups' },
  { file: 'enterprise.png', heading: 'You have the evidence.\nIt does not agree with itself.', eyebrow: 'Enterprise' },
  { file: 'how-we-work.png', heading: 'Priced before we start.\nUseful after we leave.', eyebrow: 'How we work' },
  { file: 'who-we-are.png', heading: 'We have been\nin your shoes.', eyebrow: 'Who we are' },
  { file: 'contact.png', heading: 'Start a conversation.', eyebrow: 'Contact' },
  { file: 'privacy.png', heading: 'Privacy notice.', eyebrow: 'Legal' },
];

const card = ({ heading, eyebrow }) => `
<!doctype html>
<meta charset="utf-8">
<style>
  @font-face {
    font-family: "Archivo";
    src: url("${fontUrl('archivo-latin.woff2')}") format("woff2");
    font-weight: 100 900;
    font-stretch: 62% 125%;
  }
  @font-face {
    font-family: "EB Garamond";
    src: url("${fontUrl('ebgaramond-latin.woff2')}") format("woff2");
    font-weight: 400 800;
  }
  * { box-sizing: border-box; margin: 0; }
  body {
    width: 1200px; height: 630px;
    background: #153B50;
    font-family: "Archivo", sans-serif;
    color: #fff;
    padding: 72px 80px;
    display: flex; flex-direction: column; justify-content: space-between;
  }
  .logo { width: 168px; height: auto; display: block; color: #fff; }
  .eyebrow {
    font-size: 20px; font-weight: 600; color: #A9C4D2;
    letter-spacing: 0.01em; margin-bottom: 22px;
  }
  h1 {
    font-family: "EB Garamond", serif;
    font-size: 86px; font-weight: 600;
    letter-spacing: -0.008em; line-height: 1.08;
    white-space: pre-line; max-width: 20ch;
  }
  /*
   * The word carries the same colour here, but as ink rather than a wash.
   * On paper the site washes it, because #16F4D0 as text is 1.31:1 there.
   * On this ground the opposite holds: aquamarine text on ink is 8.39:1,
   * while a wash would force the word to ink and invert it out of a line of
   * white type, which reads as a glitch. The footer strapline already sets
   * aquamarine on ink the same way.
   */
  .mark { color: #16F4D0; }
  .rule {
    height: 13px; margin-top: 44px;
    background-image: repeating-linear-gradient(to right, #2F5870 0 1px, transparent 1px 15px);
    border-bottom: 1px solid #2F5870;
  }
</style>
${wordmark}
<div>
  ${eyebrow ? `<div class="eyebrow">${eyebrow}</div>` : ''}
  <h1>${heading}</h1>
  <div class="rule"></div>
</div>
`;

const browser = await launchChromium();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});

await mkdir(outDir, { recursive: true });

for (const spec of CARDS) {
  await page.setContent(card(spec), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const png = await page.screenshot({ type: 'png' });
  await writeFile(resolve(outDir, spec.file), png);
  console.log(`og: ${spec.file} (${png.length} bytes)`);
}

await browser.close();

/*
 * Every card in public/og/ has to come from CARDS.
 *
 * On 13 Sep 2026 scale-ups.png and enterprise.png sat in public/og/ for a day
 * with no entry here: a bad revert took their CARDS lines out and nobody
 * noticed, because the two files were already committed and every page still
 * had an image to point at. The next person to run this script would have
 * regenerated seven cards and left two stale ones behind, which is a failure
 * that shows up months later on somebody's LinkedIn preview.
 */
const rendered = new Set(CARDS.map((spec) => spec.file));
const orphans = (await readdir(outDir))
  .filter((file) => file.endsWith('.png') && !rendered.has(file))
  .sort();

if (orphans.length > 0) {
  console.error(
    [
      '',
      `og: ${orphans.length} card(s) in public/og/ with no entry in CARDS:`,
      ...orphans.map((file) => `  ${file}`),
      '',
      'Add them to CARDS, or delete them if the route has gone.',
      '',
    ].join('\n'),
  );
  process.exitCode = 1;
}
