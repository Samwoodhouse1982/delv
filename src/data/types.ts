/**
 * Shared shapes for the page content files.
 *
 * Copy in these files is final and has been through client review. Strings
 * carry their typographic characters (&rsquo;, &mdash;, &middot;) and are
 * rendered with set:html, so they must stay HTML-safe: no bare < or &.
 */

export interface PageMeta {
  /** Full <title>, exactly as §4 of the brief specifies it. */
  title: string;
  /** One sentence, under 155 characters. */
  description: string;
  /** Filename in public/og/. */
  ogImage: string;
}

export interface Hero {
  heading: string;
  sub: string;
  actions?: { label: string; href: string; ghost?: boolean }[];
}

export interface Pillar {
  step: string;
  heading: string;
  body: string;
  /** Optional link under the card, for a pillar that now has its own page. */
  action?: { label: string; href: string };
}

/**
 * The five shapes in the section-graphic vocabulary, at list size. See
 * src/components/graphics/Mark.astro.
 */
export type MarkKind =
  | 'unclosed'
  | 'evidenced'
  | 'activity'
  | 'measured'
  | 'restated';

export interface StageRow {
  heading: string;
  when: string;
  body: string;
}

export interface Offer {
  heading: string;
  meta: string;
  body: string;
  /** Optional link out of the card, to the audience page the offer belongs to. */
  action?: { label: string; href: string };
}

export interface QaItem {
  question: string;
  answer: string;
}

export interface CtaBand {
  heading: string;
  body: string;
  action: { label: string; href: string };
}

export interface Person {
  name: string;
  role: string;
  paragraphs: string[];
  /** Optional. Renders as a labelled slot until a real headshot exists. */
  portrait?: Figure;
}

/**
 * An image slot.
 *
 * `src` is empty everywhere at the moment, so every one of these renders as a
 * labelled placeholder carrying the brief for the picture that belongs there.
 * Add `src` and `alt` and it becomes the image, in the same space: the box is
 * sized from `ratio` either way, so nothing on the page moves.
 *
 * Write `label` as an instruction to whoever takes the photograph, not as a
 * description of a photograph that exists.
 */
export interface Figure {
  /** What the picture needs to be. Shown in the placeholder. */
  label: string;
  /** Aspect ratio as "w/h", e.g. "16/9", "3/2", "1/1". */
  ratio: string;
  /** Optional caption, in the site's small Archivo caption style. */
  caption?: string;
  /** Path under public/. Until this is set the slot stays a placeholder. */
  src?: string;
  /** Required once `src` is set. Empty string only if purely decorative. */
  alt?: string;
}
