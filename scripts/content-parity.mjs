/**
 * Proves a content migration lossless.
 *
 * Compares the <main> of every built page against a snapshot of the build
 * from before the migration, after normalising whitespace. The pages became
 * data so Sam can reorder them from a CMS; this is what stops that change
 * quietly altering what a reader sees.
 *
 *   node scripts/content-parity.mjs
 *
 * The baseline lives outside the repository, so regenerate it from the last
 * good commit before starting a migration:
 *
 *   git stash && npm run build && cp -r dist "$BASELINE" && git stash pop
 *
 * Set BASELINE to point at it; it defaults to the path used during the
 * September 2026 migration.
 */
import { readFile } from 'node:fs/promises';
import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';
const walk = (d) => readdirSync(d).flatMap(f => { const p = path.join(d,f); return statSync(p).isDirectory() ? walk(p) : [p]; });
/*
 * The one accepted difference: the six hand-tuned heading gaps collapse to
 * two named ones, which Sam agreed to when he asked for reorderable blocks.
 * Normalised here so the check stays useful, and counted so the cost stays
 * visible rather than disappearing into a passing test.
 */
const GAPS = /margin-bottom:(?:2[0-9]px|30px|clamp\(2[0-9]px,3vw,[0-9]+px\))/g;
let gapChanges = 0;
const norm = (h, count) => {
  const m = h.match(/<main[^>]*>([\s\S]*)<\/main>/);
  let s = (m ? m[1] : h).replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();
  /* Class order carries no meaning in CSS, and the renderer composes the band
     classes in a different order from the hand-written templates. Sorted so
     the check tests what a reader sees rather than how a string was built. */
  s = s.replace(/class="([^"]+)"/g, (_, c) => `class="${c.trim().split(/\s+/).sort().join(' ')}"`);
  if (count) gapChanges += (s.match(GAPS) ?? []).length;
  return s.replace(GAPS, 'margin-bottom:GAP');
};
const base = process.env.BASELINE ?? '/tmp/claude-0/baseline';
let same = 0, diff = [];
for (const f of walk(base).filter(f => f.endsWith('.html')).sort()) {
  const rel = path.relative(base, f);
  let now;
  try { now = await readFile(path.join('/home/user/delv/dist', rel), 'utf8'); }
  catch { diff.push([rel, 'MISSING in new build']); continue; }
  const a = norm(await readFile(f, 'utf8'), false);
  const b = norm(now, true);
  if (a === b) { same++; continue; }
  // first divergence, for a usable message
  let i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++;
  diff.push([rel, `diverges at char ${i}\n      was: …${a.slice(Math.max(0,i-60), i+90)}\n      now: …${b.slice(Math.max(0,i-60), i+90)}`]);
}
console.log(`  ${same} pages render identically to the baseline (${gapChanges} heading gaps normalised to the two named values)`);
for (const [f, why] of diff) console.log(`  DIFF ${f}: ${why}`);
process.exit(diff.length ? 1 : 0);
