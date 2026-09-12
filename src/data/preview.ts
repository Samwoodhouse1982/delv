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
 * anyone setting anything.
 *
 * Every sample entry is marked "Sample" or "Placeholder". Never write sample
 * content a reader could mistake for a real client or a real colleague.
 */

/**
 * ===================== REMOVE BEFORE LAUNCH =====================
 *
 * Shows the placeholders on production too, not just on previews.
 *
 * Sam asked for this deliberately on 12 Sep 2026: the site is on a test
 * domain with no traffic, and seeing the placeholders in place is more useful
 * than keeping production clean while nobody is looking.
 *
 * Set this back to false before the site goes live, or production will serve
 * sample results, sample quotes and placeholder colleagues to real visitors.
 * Nothing else needs changing: previews keep their placeholders either way.
 *
 * ================================================================
 */
const SHOW_PLACEHOLDERS_ON_PRODUCTION = true;

const explicit = process.env.PLACEHOLDER_PREVIEW;

export const isPreview =
  explicit === undefined
    ? SHOW_PLACEHOLDERS_ON_PRODUCTION || process.env.VERCEL_ENV === 'preview'
    : explicit !== '' && explicit !== '0';
