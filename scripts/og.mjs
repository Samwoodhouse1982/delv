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
import { mkdir, readFile, writeFile } from 'node:fs/promises';
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
const wordmark = (await readFile(resolve(root, 'public/brand/delv-logo.svg'), 'utf-8'))
  .replace(/<defs>[\s\S]*?<\/defs>/, '')
  .replace(/class="cls-1"/g, 'fill="currentColor"')
  .replace(/class="cls-2"/g, 'fill="#16F4D0"')
  .replace('<svg ', '<svg class="logo" ');

const CARDS = [
  { file: 'home.png', heading: 'Prove the <span class="mark">value</span>,\nprove your why', eyebrow: null },
  { file: 'what-we-do.png', heading: 'Define. Measure.\nArticulate.', eyebrow: 'What we do' },
  { file: 'for-startups.png', heading: 'For founders with traction\nand no proof yet.', eyebrow: 'For startups' },
  { file: 'how-we-work.png', heading: 'Fast, hands-on, and\nspecific to your business.', eyebrow: 'How we work' },
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
