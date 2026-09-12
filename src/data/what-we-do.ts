import type { Hero, PageMeta } from './types';

export const meta: PageMeta = {
  title: 'What we do — delv.',
  description:
    'Define, measure and articulate: the three stages every delv. engagement runs through, and what each one produces.',
  ogImage: '/og/what-we-do.png',
};

export const hero: Hero = {
  heading: 'Define. Measure. Articulate.',
  sub: 'Projects of any size run through the same three stages. We can start at any of them, but we check the first one is sound before we build on it.',
};

export interface Stage {
  label: string;
  heading: string;
  lede: string;
  paragraphs: string[];
  details: string[];
}

export const stages: Stage[] = [
  {
    label: 'Stage one',
    heading: 'Define',
    lede: 'What does value mean to your company, and to the person who has to justify buying it?',
    paragraphs: [
      'Value is not a fixed quantity. What counts to an ICB finance lead is not what counts to a clinical director, and neither is what counts to a Series B lead investor. We start by getting specific about whose decision you are trying to change.',
      'Then we look honestly at what you already say. Most companies are carrying a mix of claims: some evidenced, some inherited from a pitch deck two years ago, some quietly indefensible. Sorting them is uncomfortable and fast.',
    ],
    details: [
      'Audit of current messaging, claims and proof points &mdash; including the ones nobody can source',
      'Hypotheses for the claims that would actually move deals, ranked by what it would cost to prove them',
      'A shift from inward-looking product language to statements the market recognises',
      'Baselining whatever real-world or research data already exists',
      'A review of what your product captures today, and what it would need to capture',
      'Sessions with commercial, product, data and clinical to get one version of the story',
    ],
  },
  {
    label: 'Stage two',
    heading: 'Measure',
    lede: 'How much, and how do you know?',
    paragraphs: [
      'We identify the financial, operational and clinical measures that matter for your market &mdash; money saved, revenue protected, hours released, appointments freed, errors avoided, readmissions prevented &mdash; and work out which of them you can credibly attribute to your product.',
      'Attribution is where most value models fall over. We are explicit about assumptions, conservative where the data is thin, and we keep an audit trail so that when an analyst asks where a figure came from, there is an answer.',
    ],
    details: [
      'Metric selection for your market and buyer, not a generic ROI template',
      'Data extraction, and measurement of the gain that is genuinely attributable to you',
      'Modelling with a documented assumptions log and sourced comparators',
      'Health economic analysis where it is warranted &mdash; and a straight answer when it is not',
      'Data gathering at client sites where the evidence has to come from the field',
      'A repeatable flow so evidence keeps refreshing instead of ageing in a slide',
    ],
  },
  {
    label: 'Stage three',
    heading: 'Articulate',
    lede: 'Who needs to hear it, and in what form?',
    paragraphs: [
      'A finding that stays in a spreadsheet has no commercial effect. The same result has to become a business case a trust can put through its own approvals, a slide a founder can use in a room, and a line an investor can check.',
      'We build the assets and the governance around them: where each claim came from, what it can and cannot be used for, and who updates it when the data moves.',
    ],
    details: [
      'Messaging and claims library &mdash; versioned, sourced and auditable, ready to sit alongside your QMS',
      'ROI calculators, from sales-led walkthroughs to short web tools for lead generation',
      'Case studies, business case templates, white papers, briefings and speaker notes',
      'Investor and board materials that connect evidence to the commercial model',
      'Award submissions and value-based presentation material',
      'Disclaimers and usage rules, so claims are communicated responsibly',
      'Internal enablement, so the fiftieth sales conversation sounds like the first',
    ],
  },
];

export const closing = {
  heading: 'We will tell you when a claim does not hold.',
  body: 'It is a strange thing to advertise, but it is the whole point. An evidence partner who agrees with everything is worth nothing to you the first time a customer&rsquo;s analyst goes through the numbers line by line.',
  action: { label: 'Start a conversation', href: '/contact' },
};
