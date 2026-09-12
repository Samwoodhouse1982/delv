/**
 * Derives the metric-override values for the fallback @font-face rules in
 * src/styles/global.css, so `font-display: swap` cannot shift the layout.
 *
 * Two things come out of this:
 *
 *   size-adjust        makes the fallback's average advance width match the
 *                      webfont's, so text wraps at the same points and the
 *                      line count does not change when the webfont arrives.
 *
 *   ascent-override    pin the fallback's line box to the webfont's, so block
 *   descent-override   heights are identical whichever font is painting.
 *   line-gap-override  These depend only on the webfont's own metrics, so they
 *                      are exact.
 *
 * Webfont metrics are read from the woff2 files we actually ship. Arial and
 * Georgia metrics come from @capsizecss/metrics, which extracts them from the
 * real binaries; do not substitute remembered values, they are easy to get
 * wrong and impossible to notice.
 *
 * Run: npm run fonts:metrics, then paste the output into global.css.
 */
import { readFileSync } from 'node:fs';
import { fromBuffer } from '@capsizecss/unpack';
import arial from '@capsizecss/metrics/arial';
import georgia from '@capsizecss/metrics/georgia';

const FACES = [
  {
    name: 'Archivo',
    file: 'public/fonts/archivo-latin.woff2',
    fallback: 'Arial',
    metrics: arial,
    // Archivo's fvar default is wght 600 / wdth 100, which is the weight
    // headings, buttons and labels are set at. No correction needed.
    instanceCorrection: 1,
    instanceNote: 'default instance is wght 600 / wdth 100, the weight we set headings at',
  },
  {
    name: 'EB Garamond',
    file: 'public/fonts/ebgaramond-latin.woff2',
    fallback: 'Georgia',
    metrics: georgia,
    // fvar defaults to wght 400; headings are set at 600. Mean lowercase
    // advance is 0.42863em at 400 and 0.45730em at 600.
    instanceCorrection: 0.45730 / 0.42863,
    instanceNote: 'corrected from the wght 400 default up to the wght 600 headings are set at',
  },
  {
    name: 'Newsreader',
    file: 'public/fonts/newsreader-latin.woff2',
    fallback: 'Georgia',
    metrics: georgia,
    // capsize reads hmtx, which for a variable font is the default instance:
    // Newsreader defaults to wght 400 / opsz 18, but body prose is set at 350.
    // Mean lowercase advance is 0.45359em at 400 and 0.44848em at 350, so the
    // shipped instance is 1.13% wide for our purposes. Reproduce with:
    //   fontTools.varLib.instancer.instantiateVariableFont(f, {wght: N, opsz: 18})
    //   then mean(hmtx[g].advance / unitsPerEm) over "a".."z" and space.
    instanceCorrection: 0.44848 / 0.45359,
    instanceNote: 'corrected from the wght 400 default down to the wght 350 we set body prose at',
  },
];

const pct = (n) => `${(n * 100).toFixed(2)}%`;

for (const face of FACES) {
  const m = await fromBuffer(readFileSync(face.file));
  const f = face.metrics.default ?? face.metrics;

  // Expressed as a fraction of the em on both sides, so unitsPerEm cancels.
  const webAvg = (m.xWidthAvg / m.unitsPerEm) * face.instanceCorrection;
  const fallbackAvg = f.xWidthAvg / f.unitsPerEm;
  const sizeAdjust = webAvg / fallbackAvg;

  // Overrides apply to the adjusted em, hence the division.
  const ascent = m.ascent / m.unitsPerEm / sizeAdjust;
  const descent = Math.abs(m.descent) / m.unitsPerEm / sizeAdjust;
  const lineGap = m.lineGap / m.unitsPerEm / sizeAdjust;

  console.log(`\n/* ${face.name} over ${face.fallback} — ${face.instanceNote}.`);
  console.log(`   ${face.name} ${webAvg.toFixed(5)}em average advance, ${face.fallback} ${fallbackAvg.toFixed(5)}em.`);
  console.log(`   Regenerate with: npm run fonts:metrics */`);
  console.log(`@font-face {`);
  console.log(`  font-family: "${face.name} Fallback";`);
  console.log(`  src: local("${face.fallback}");`);
  console.log(`  size-adjust: ${pct(sizeAdjust)};`);
  console.log(`  ascent-override: ${pct(ascent)};`);
  console.log(`  descent-override: ${pct(descent)};`);
  console.log(`  line-gap-override: ${pct(lineGap)};`);
  console.log(`}`);
}
