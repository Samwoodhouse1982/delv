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
 * Sample entries exist only when this is set, so they cannot reach a deploy
 * by accident. Every one of them is marked "Sample" or "Placeholder" — never
 * write sample content a reader could mistake for a real client or colleague.
 */
export const isPreview = Boolean(process.env.PLACEHOLDER_PREVIEW);
