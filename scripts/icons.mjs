/**
 * Rasterises public/favicon.svg into the PNG and ICO the layout links.
 *
 * Run manually (`npm run icons`) and commit the output; it only changes when
 * the favicon does. The SVG is the master — edit that, not the bitmaps.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { launchChromium } from './browser.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const svg = await readFile(resolve(root, 'public/favicon.svg'), 'utf-8');

const browser = await launchChromium();

const render = async (size) => {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  await page.setContent(
    `<style>html,body{margin:0;padding:0}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`,
    { waitUntil: 'load' },
  );
  const png = await page.screenshot({ type: 'png', omitBackground: true });
  await page.close();
  return png;
};

const apple = await render(180);
await writeFile(resolve(root, 'public/apple-touch-icon.png'), apple);
console.log(`icons: apple-touch-icon.png (${apple.length} bytes)`);

// A PNG wrapped in an ICO container. Every browser that still asks for
// /favicon.ico understands PNG-in-ICO, and it saves shipping a BMP encoder.
const png32 = await render(32);
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // one image
header.writeUInt8(32, 6); // width
header.writeUInt8(32, 7); // height
header.writeUInt8(0, 8); // palette size: none
header.writeUInt8(0, 9); // reserved
header.writeUInt16LE(1, 10); // colour planes
header.writeUInt16LE(32, 12); // bits per pixel
header.writeUInt32LE(png32.length, 14);
header.writeUInt32LE(22, 18); // offset to the image data
await writeFile(resolve(root, 'public/favicon.ico'), Buffer.concat([header, png32]));
console.log(`icons: favicon.ico (${22 + png32.length} bytes)`);

await browser.close();
