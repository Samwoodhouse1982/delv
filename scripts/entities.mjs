/**
 * Fails the build if an HTML entity ever ships as literal text.
 *
 *   node scripts/entities.mjs
 *
 * ## Why this exists
 *
 * Most content strings are rendered with `set:html`, so `&rsquo;` in a JSON
 * file becomes a typographic apostrophe on the page. A few are not: every
 * component interpolates `action.label` into its button as text. An entity in
 * one of those is escaped on the way out, and the page reads
 * `Let&rsquo;s talk`.
 *
 * That happened on 18 Sep 2026, on the home page's closing button — the first
 * apostrophe any button on the site had ever carried, so nothing had ever
 * exercised the difference. It survived `astro check`, the schema, axe, the
 * page diff and the editor: every one of them saw a valid string. It was
 * caught by reading the built HTML.
 *
 * So this reads the built HTML. `&amp;` followed by something that looks like
 * an entity name is never what anyone meant to write; it is always a string
 * that went through one escape too many.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;

/** `&amp;rsquo;`, `&amp;#8217;`, `&amp;#x2019;` — one escape too many. */
const DOUBLE = /&amp;(#\d+|#x[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]{1,30});/g;

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(full);
    else if (entry.name.endsWith('.html')) yield full;
  }
}

let problems = 0;
let pages = 0;

for await (const file of htmlFiles(DIST)) {
  pages++;
  const html = await readFile(file, 'utf8');
  for (const m of html.matchAll(DOUBLE)) {
    const where = html.slice(Math.max(0, m.index - 40), m.index + m[0].length + 20);
    console.log(`  ESCAPED  ${path.relative(DIST, file)}: ${m[0]}`);
    console.log(`           …${where.replace(/\s+/g, ' ')}…`);
    problems++;
  }
}

console.log(
  problems === 0
    ? `  no double-escaped entities in ${pages} pages`
    : `\n  ${problems} entity/entities shipped as literal text`,
);
process.exit(problems ? 1 : 0);
