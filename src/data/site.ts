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
  /** One line under the label, in the Who we help panel only. */
  descriptor?: string;
}

/**
 * A nav entry that is a group rather than a link. "Who we help" is the only
 * one: it has no landing route of its own, so it is a disclosure button and a
 * panel rather than an anchor. A parent link to nowhere is the usual way this
 * pattern goes wrong.
 */
export interface NavGroup {
  label: string;
  /** Used for the button's aria-controls and the panel's id. */
  id: string;
  /*
   * `readonly`, and it has to be. `site` is `as const`, so the literal's
   * children are a readonly tuple. A mutable `NavItem[]` here would make the
   * group literal not assignable to NavGroup, the type guard below would fail
   * to exclude it from the link branch, and `entry.href` would type as
   * possibly undefined at every call site.
   */
  children: readonly NavItem[];
}

export type NavEntry = NavItem | NavGroup;

/*
 * Generic, not `(entry: NavEntry) => entry is NavGroup`.
 *
 * `site` is `as const`, so the nav array's element type is a union of the
 * literal object types rather than NavEntry itself. A guard narrowing to the
 * NavGroup interface leaves the group literal in the false branch, because
 * excluding it needs the two to be mutually assignable, and `entry.href` then
 * types as possibly undefined in the link branch. Extracting from the caller's
 * own union sidesteps the question.
 */
export function isGroup<T extends NavEntry>(
  entry: T,
): entry is Extract<T, { children: readonly unknown[] }> {
  return 'children' in entry;
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
  strapline: 'Prove the value, prove your why.',
  blurb:
    'Evidence of value for healthtech companies. We turn what your product does into proof of what it is worth.',
  /** PLACEHOLDER — address unconfirmed, see §13.4 of the brief. */
  email: 'hello@delv.health',
  /** Populated once the LinkedIn page exists; feeds JSON-LD sameAs. */
  sameAs: [] as string[],

  /*
   * "Who we help" is a group, not a page. The three audience pages each lean
   * on a different one of the three stages, which is what keeps them from
   * collapsing into each other: startups on Define, scale-ups on Measure,
   * enterprise on Articulate. The descriptors say so in a reader's words.
   *
   * The startups slug stays /for-startups while the label becomes "Startups",
   * so it reads as a sibling of the other two. Renaming the route would break
   * every link already pointing at it for no reader-visible gain.
   */
  nav: [
    { label: 'Home', href: '/' },
    { label: 'What we do', href: '/what-we-do' },
    {
      label: 'Who we help',
      id: 'nav-who-we-help',
      children: [
        {
          label: 'Startups',
          href: '/for-startups',
          descriptor: 'Traction, and no proof yet',
        },
        {
          label: 'Scale-ups',
          href: '/scale-ups',
          descriptor: 'Live deployments, scattered evidence',
        },
        {
          label: 'Enterprise',
          href: '/enterprise',
          descriptor: 'Multiple markets, multiple versions',
        },
      ],
    },
    { label: 'How we work', href: '/how-we-work' },
    { label: 'Who we are', href: '/who-we-are' },
    { label: 'Start a conversation', href: '/contact', cta: true },
  ] satisfies NavEntry[],

  /*
   * Three labelled columns. No column heading repeats a link inside it, which
   * is why the first is "The work" rather than "What we do": a heading and its
   * own first link reading identically looks like a mistake.
   *
   * The three audience pages are here as well as in the nav group, and that is
   * load-bearing rather than duplication. The group in the header is a
   * disclosure that needs JavaScript to open; the footer is how those pages
   * stay reachable when it does not run.
   */
  footerNav: [
    {
      heading: 'The work',
      items: [
        { label: 'What we do', href: '/what-we-do' },
        { label: 'How we work', href: '/how-we-work' },
      ],
    },
    {
      heading: 'Who we help',
      items: [
        { label: 'Startups', href: '/for-startups' },
        { label: 'Scale-ups', href: '/scale-ups' },
        { label: 'Enterprise', href: '/enterprise' },
      ],
    },
    {
      heading: 'About',
      items: [
        { label: 'Who we are', href: '/who-we-are' },
        { label: 'Contact', href: '/contact' },
      ],
    },
  ] satisfies { heading: string; items: NavItem[] }[],

  company: {
    legalName: 'DELV Consulting Ltd',
    companyNumber: null,
    placeOfRegistration: 'Registered in England and Wales',
    registeredOffice: null,
  } satisfies CompanyDetails,
} as const;

export type Site = typeof site;
