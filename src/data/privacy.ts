import type { Hero, PageMeta } from './types';

export const meta: PageMeta = {
  title: 'Privacy — delv.',
  description:
    'How DELV Consulting Ltd handles personal data collected through this website.',
  ogImage: '/og/privacy.png',
};

export const hero: Hero = {
  heading: 'Privacy notice.',
  sub: 'How we handle the personal data you give us through this website.',
};

/**
 * PLACEHOLDER — §4 of the build brief: "Build the page and layout; Sam
 * supplies the text. Do not draft a privacy notice yourself."
 *
 * Replace `placeholder` with a `sections` array of { heading, paragraphs }
 * once the text arrives, and delete the placeholder block from
 * src/pages/privacy.astro. The page is intentionally not in the footer's
 * main navigation columns; it is linked from the legal strip.
 */
export const placeholder = {
  heading: 'This notice is not written yet',
  paragraphs: [
    'The privacy notice is being drafted and will be published here before the site goes live.',
    'In the meantime, if you want to know what we hold about you or ask us to delete it, email us and we will answer.',
  ],
};
