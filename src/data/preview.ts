/**
 * Placeholder preview.
 *
 * Some content on this site is structurally built but has no real content
 * yet: the proof results and quotes in `proof.ts`, and the wider bench in
 * `who-we-are.ts`. All of it ships empty, and the components render nothing
 * when it is, so those sections simply do not appear.
 *
 * Set PLACEHOLDER_PREVIEW to fill them with obviously fake entries so the
 * design can be reviewed:
 *
 *   npm run dev:preview
 *   npm run build:preview
 *   npm run check:preview
 *
 * On Vercel this turns itself on for preview deployments, so every branch
 * preview shows the placeholders and they can be reviewed in place without
 * anyone setting anything. Production never shows them unless someone sets
 * PLACEHOLDER_PREVIEW explicitly in the Production environment, which is a
 * deliberate act rather than an accident.
 *
 * Every sample entry is marked "Sample" or "Placeholder" — never write sample
 * content a reader could mistake for a real client or a real colleague.
 */
const explicit = process.env.PLACEHOLDER_PREVIEW;

export const isPreview =
  explicit === undefined
    ? process.env.VERCEL_ENV === 'preview'
    : explicit !== '' && explicit !== '0';
