/**
 * Site-wide content: nav, footer, company details.
 *
 * Everything a page says lives in this directory. If you are changing wording,
 * you should not need to open a component.
 */

export interface NavItem {
  label: string;
  href: string;
  /** Renders as the button at the end of the nav rather than a plain link. */
  cta?: boolean;
}

/** Values still waiting on §13 of the build brief. Search for PLACEHOLDER. */
export interface CompanyDetails {
  legalName: string;
  /** PLACEHOLDER — Companies House number, required before launch. */
  companyNumber: string | null;
  /** PLACEHOLDER — required before launch. */
  placeOfRegistration: string;
  /** PLACEHOLDER — registered office address, required before launch. */
  registeredOffice: string | null;
}

export const site = {
  name: 'delv.',
  /** Used in <title> suffixes and the OG cards. */
  shortName: 'delv',
  strapline: 'Prove the value. Prove the why.',
  blurb:
    'Evidence of value for healthtech companies. We turn what your product does into proof of what it is worth.',
  /** PLACEHOLDER — address unconfirmed, see §13.4 of the brief. */
  email: 'hello@delv.health',
  /** Populated once the LinkedIn page exists; feeds JSON-LD sameAs. */
  sameAs: [] as string[],

  nav: [
    { label: 'Home', href: '/' },
    { label: 'What we do', href: '/what-we-do' },
    { label: 'For startups', href: '/for-startups' },
    { label: 'How we work', href: '/how-we-work' },
    { label: 'Who we are', href: '/who-we-are' },
    { label: 'Start a conversation', href: '/contact', cta: true },
  ] satisfies NavItem[],

  footerNav: [
    [
      { label: 'What we do', href: '/what-we-do' },
      { label: 'For startups', href: '/for-startups' },
      { label: 'How we work', href: '/how-we-work' },
    ],
    [
      { label: 'Who we are', href: '/who-we-are' },
      { label: 'Contact', href: '/contact' },
    ],
  ] satisfies NavItem[][],

  company: {
    legalName: 'DELV Consulting Ltd',
    companyNumber: null,
    placeOfRegistration: 'Registered in England and Wales',
    registeredOffice: null,
  } satisfies CompanyDetails,
} as const;

export type Site = typeof site;
