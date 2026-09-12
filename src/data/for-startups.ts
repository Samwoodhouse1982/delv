import type { CtaBand, Figure, Hero, PageMeta, Pillar, StageRow } from './types';

export const meta: PageMeta = {
  title: 'For startups · delv.',
  description:
    'Early-stage healthtech is judged on evidence long before it has any. How delv. helps founders build the proof before a deal, a raise or an outcomes contract needs it.',
  ogImage: '/og/for-startups.png',
};

export const hero: Hero = {
  heading: 'For founders with traction and no proof yet.',
  sub: 'Early-stage healthtech gets judged on evidence long before it has any. We help you build the base, and the narrative, early enough that it compounds instead of costing you a quarter.',
};

export const moments = {
  heading: 'Three moments when founders call us',
  rows: [
    {
      heading: 'The deal that will not close',
      when: 'Usually the second or third NHS conversation',
      body: 'The clinical team love it. Then it reaches finance, and someone asks what it saves and against what baseline. Enthusiasm scores nothing in that meeting. Minutes, money and metrics do.',
    },
    {
      heading: 'The raise',
      when: 'Eight to twelve weeks before the process opens',
      body: 'Diligence will test the gap between what the deck claims and what the data supports. Closing that gap in advance is cheaper than explaining it live, and it changes the questions you get asked.',
    },
    {
      heading: 'The contract with outcomes attached',
      when: 'After signature, sometimes too soon after',
      body: 'Value-based and outcomes-based agreements tie revenue to demonstrable impact. If nobody designed the measurement before go-live, the evidence you need may not exist by the time it is due.',
    },
  ] satisfies StageRow[],
};

export const where = {
  heading: 'Where you are matters',
  lede: 'The same three stages, weighted differently depending on how much evidence you can realistically generate yet.',
  pillars: [
    {
      step: 'Pre-seed to seed',
      heading: 'Build the base',
      body: 'Decide what you will need to prove, and instrument for it now. It costs very little at this stage and is expensive to retrofit once you have customers, integrations and a roadmap to defend.',
    },
    {
      step: 'Series A',
      heading: 'Turn traction into evidence',
      body: 'Convert live deployments into defensible proof points. A first real value model, a business case your buyers can reuse internally, and an investor narrative that matches the data room.',
    },
    {
      step: 'Series B and scale',
      heading: 'Standardise it',
      body: 'One claims library, one model, consistent numbers across markets and reps. Fewer legal surprises, faster procurement, and a repeatable way to add new evidence as it arrives.',
    },
  ] satisfies Pillar[],
};

export const outcome = {
  heading: 'What you end up with',
  details: [
    'A clear statement of what your product is worth, to whom, and under what conditions',
    'A value model with sourced assumptions you can hand to a sceptical analyst',
    'A claims library your team can use without checking with legal every time',
    'Materials that work in procurement, in a data room, and on a stand at a conference',
    'A measurement plan that keeps producing evidence after we leave',
  ],
  note: 'What we do not do: market sizing, fundraising theatre, or inventing a comparator to make a number look better. If the honest answer is smaller than you hoped, you will hear it from us first.',
};

export const outcomeImage: Figure = {
  label: 'The deliverables as objects: a claims library, a business case pack, a one-page evidence map. Flat lay or on a desk, ordered rather than styled.',
  ratio: '3/2',
};

export const cta: CtaBand = {
  heading: 'Start with a Value Audit.',
  body: 'A fixed-fee look at what you claim, what your data can support, and what to fix first. Enough to make the next decision with, whether or not you work with us after it.',
  action: { label: 'Start a conversation', href: '/contact' },
};
