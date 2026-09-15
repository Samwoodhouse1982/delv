import type {
  CtaBand,
  Figure,
  Hero,
  MarkKind,
  PageMeta,
  Pillar,
  StageRow,
} from './types';

/**
 * Enterprise. The Articulate page.
 *
 * Startups is Define, scale-ups is Measure, and this one is Articulate: at
 * scale the problem is rarely a shortage of proof, it is four credible
 * versions of the same number with nobody empowered to choose between them.
 *
 * The claims and evidence library is the headline deliverable here and a
 * supporting one elsewhere, which is why it gets a section of its own
 * rather than a bullet.
 */

export const meta: PageMeta = {
  title: 'Enterprise · delv.',
  description:
    'How delv. helps multi-market healthtech companies hold one version of the number: a single claims record, one methodology, and governance that keeps it true.',
  ogImage: '/og/enterprise.png',
};

export const hero: Hero = {
  heading: 'You have the evidence. It does not agree with itself.',
  sub: 'At scale the problem is rarely a shortage of proof. It is four credible versions of the same number, in four places, with nobody empowered to choose between them. We build the single version, and the rules that keep it true.',
  actions: [
    { label: 'Start a conversation', href: '/contact' },
    { label: 'See what we do', href: '/what-we-do', ghost: true },
  ],
};

export const moments = {
  heading: 'Three moments when enterprises call us',
  rows: [
    {
      heading: 'The same claim, four different numbers',
      when: 'Found during a legal or quality review',
      body: 'Sales say thirty per cent. The website says a third. The last case study said twenty-eight, and nobody has seen the working behind any of them. Each version was reasonable when it was written. One of them is the one a customer will eventually quote back at you.',
    },
    {
      heading: 'The bid team with no approved source',
      when: 'Twenty or more tenders a year',
      body: 'Your bid writers need a sourced, current, permitted claim on a deadline, and what they have is a shared drive and whoever answers first. Every response is a small act of improvisation, and the risk compounds every time one of them wins.',
    },
    {
      heading: 'One product, four evidence bars',
      when: 'Wherever the second and third markets are',
      body: 'A German sickness fund, a US integrated delivery network and an Australian state health service each want the same argument rebuilt around their own payer and their own standard of proof. Rebuilding it locally, every time, is how the versions diverged in the first place.',
    },
  ] satisfies StageRow[],
};

export const version = {
  heading: 'What one version of the number means',
  lede: 'Standardising value communication takes three pieces of work.',
  marks: [
    'evidenced',
    'measured',
    'restated',
  ] as const satisfies readonly MarkKind[],
  pillars: [
    {
      step: 'One',
      heading: 'One record',
      body: 'Every claim you make in market, in one place, versioned and sourced, with the evidence attached and an owner against it.',
    },
    {
      step: 'Two',
      heading: 'One methodology',
      body: 'The same way of calculating value in every market and every business unit, so two teams looking at comparable data reach the same figure. Local adaptation happens at the payer and budget layer, not in the maths.',
    },
    {
      step: 'Three',
      heading: 'Governance that holds',
      body: 'Who can say what, where, and on what basis. Usage rules and disclaimers attached to each claim, a route for adding new evidence, and a review cycle so nothing quietly ages into being wrong.',
    },
  ] satisfies Pillar[],
};

export const changes = {
  heading: 'What changes',
  details: [
    'A claims and evidence library holding every claim you make, versioned, sourced and owned',
    'One ROI calculator, with the versions each market needs built from the same method',
    'A single value methodology your markets apply consistently',
    'Usage rules and disclaimers, so no claim can travel further than the evidence behind it',
    'A retirement list: the claims to stop making, and what to say instead',
    'Enablement that survives a sales hire, so the numbers do not drift apart again',
  ],
  note: 'What we will not do: rubber-stamp the version that happens to be most commercially convenient, or produce a framework nobody inside the business has agreed to. Choosing between four credible numbers is a decision, not an analysis, and getting the right people in the room for it is most of the job.',
};

export const changesImage: Figure = {
  label:
    'The claims and evidence library open on screen beside a printed bid response. Ordered, in use, mid-work.',
  ratio: '3/2',
  caption:
    'Replace with a real anonymised artefact from a live engagement before launch.',
};

/** The centrepiece of this page, and a supporting deliverable on the other two. */
export const library = {
  heading: 'The claims and evidence library',
  paragraphs: [
    'One place holding every claim your business makes, with the evidence attached to it. Something maintained, with an owner against each entry, a review date, and rules about where each claim is allowed to go. A slide does none of that, and neither does a shared folder, or a document that leaves when the person who built it does.',
    'Most of what it prevents is invisible. A bid writer stops improvising, a new market stops inventing its own version, and legal stops finding out about a claim at the point it has already been published.',
  ],
  spec: [
    'Every claim, versioned, with its source and the working behind it',
    'An owner and a review date against each entry, so somebody is accountable for each one staying true',
    'Usage rules per claim: which markets, which audiences, which materials, with what disclaimer',
    'Market variants held against the parent claim rather than as separate untracked copies',
    'A route for adding new evidence as deployments mature, which your team runs',
    'Ready to hand to an auditor, or to a customer&rsquo;s reviewer, without preparation',
  ],
};

export const libraryImage: Figure = {
  label:
    'The library in use. A claim record open with its source, owner and usage rules visible. Legible but not readable.',
  ratio: '16/9',
  caption:
    'Replace with a real anonymised artefact from a live engagement before launch.',
};

export const calculator = {
  heading: 'One calculator, not five',
  paragraphs: [
    'Somewhere in most enterprises there are several ROI calculators, built by different teams in different years, all sincerely trying to prove the same product. They do not agree, and the first customer to see two of them will ask why.',
    'We build one model with the library behind it, then work up the versions each market needs: local payer, local cost base, local evidence bar, one underlying method. When a claim changes, every version is updated from the same source, so they cannot drift apart again.',
  ],
};

export const cta: CtaBand = {
  heading: 'Start with a Claims and Evidence Review.',
  body: 'Four to six weeks, fixed fee. Every claim you currently make in market, reconciled against the evidence behind it, with a ranked list of what to fix, what to retire and what to prove next. You own the output whether or not you carry on with us.',
  action: { label: 'Start a conversation', href: '/contact' },
};
