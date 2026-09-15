import type { Figure, Hero, PageMeta } from './types';

export const meta: PageMeta = {
  title: 'What we do · delv.',
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
      'An audit of your current messaging, claims and proof points, including the ones nobody can source',
      /* "would move deals", not "would genuinely move deals". The edit brief
         restored an intensifier the 13 Sep pass had taken out. */
      'Hypotheses for the claims that would move deals, ranked by what it would cost to prove them',
      'A baseline of whatever real-world or research data you already hold, and a review of what the product would need to capture',
      'Sessions with commercial, product, data and clinical to agree one version of the story',
    ],
  },
  {
    label: 'Stage two',
    heading: 'Measure',
    lede: 'How much, and how do you know?',
    paragraphs: [
      'We identify the financial, operational and clinical measures that matter for your market: money saved, revenue protected, hours released, appointments freed, errors avoided, readmissions prevented. Then we work out which of them you can credibly attribute to your product.',
      /*
       * Attribution first. It is the substantive point and was sitting behind
       * the aside about length. The aside also loses its trailing clause,
       * which carried the last P5 intensifier left anywhere on the site.
       */
      'Attribution is where most value models fall over. We are explicit about assumptions, conservative where the data is thin, and we keep an audit trail, so that when an analyst asks where a figure came from there is an answer.',
      'Length is not evidence either. A buyer will not read four pages of narrative to find the number, and a reviewer who has to hunt for it will assume it is not there. We work to figures a finance lead can lift straight into a model.',
    ],
    details: [
      'Metric selection for your market and buyer, not a generic ROI template',
      'Data extraction, and measurement of the gain that is attributable to you',
      'Modelling with a documented assumptions log and sourced comparators',
      'Health economic analysis where it is warranted, and a straight answer when it is not',
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
      'What you are buying is the asset the rest of your commercial material is built from, rather than a report. One finding, built properly, becomes a sales proposition, an investor narrative, a conference abstract and the numbers inside an ROI tool.',
    ],
    details: [
      'A claims and evidence library holding every claim you make: versioned, sourced and auditable, so any claim can be traced back on request',
      'ROI calculators, from sales-led walkthroughs to short web tools for lead generation',
      'Case studies, business case templates, white papers, briefings and award submissions',
      'Investor and board materials that connect evidence to the commercial model',
      'Disclaimers and usage rules, so claims are communicated responsibly',
      'Internal enablement, so the fiftieth sales conversation sounds like the first',
    ],
  },
];

export const stageImage: Figure = {
  label: 'A value model on screen. An assumptions log, sourced comparators, a figure with its basis visible next to it. Shot close, legible but not readable.',
  ratio: '16/9',
  caption: 'Replace with a real artefact from a live engagement, anonymised.',
};

export const closing = {
  heading: 'We will tell you when a claim does not hold.',
  body: 'It is a strange thing to advertise, but it is the whole point. An evidence partner who agrees with everything is worth nothing to you the first time a customer&rsquo;s analyst goes through the numbers line by line.',
  action: { label: 'Start a conversation', href: '/contact' },
};
