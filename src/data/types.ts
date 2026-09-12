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
}

export interface StageRow {
  heading: string;
  when: string;
  body: string;
}

export interface Offer {
  heading: string;
  meta: string;
  body: string;
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
}
