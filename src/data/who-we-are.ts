import type { CtaBand, Figure, Hero, PageMeta, Person } from './types';
import { isPreview } from './preview';

export const meta: PageMeta = {
  title: 'Who we are · delv.',
  description:
    'A former GP and medical director, and a commercial lead who has taken value stories through NHS procurement. The two people behind delv.',
  ogImage: '/og/who-we-are.png',
};

export const hero: Hero = {
  heading: 'We have been in your shoes.',
  sub: 'Between us we have worked across the digital health ecosystem: clinical practice, global health technology, health systems, and startups trying to get their first real contract over the line.',
};

export const people: Person[] = [
  {
    name: 'Dr Shubs Upadhyay',
    role: 'Co-founder',
    portrait: {
      label: 'Headshot. Plain background, natural light, no clinical props or stethoscope staging. Shoulders up, looking at camera.',
      ratio: '4/5',
    },
    paragraphs: [
      'A former GP who became medical director at Ada Health, where value and evidence were commercial questions as much as clinical ones.',
      'Shubs co-chaired the ITU/WHO focus group working group on clinical evaluation of AI for health, bringing together experts globally to establish evaluation frameworks for developers and policy makers. He works at the join between clinical credibility, regulatory expectation and commercial reality.',
    ],
  },
  {
    name: 'Sam Woodhouse',
    role: 'Co-founder',
    portrait: {
      label: 'Headshot. Same background, light and crop as the other founder, shot in the same session so the pair sit together.',
      ratio: '4/5',
    },
    paragraphs: [
      'Sam has spent his career making health technology understandable to the people who buy it, as a marketing and commercial lead inside and alongside digital health companies.',
      'He has built ROI calculators and value narratives for electronic patient record, symptom assessment and healthcare risk management vendors, and has worked at the sharp end of NHS procurement, where a claim either survives scrutiny or quietly loses the deal.',
    ],
  },
];

export const different = {
  heading: 'What makes us different',
  items: [
    {
      heading: 'We have defended the number in the room',
      body: 'We have carried the number into the meeting and had it questioned. That is a different experience from advising on it.',
    },
    {
      heading: 'We work in the data itself',
      body: 'We do not hand over a set of recommendations and leave. We sit with your analysts, work in the actual numbers, and give back things your team can use on Monday.',
    },
    {
      heading: 'We know how health systems buy',
      body: 'Evidence that convinces a clinician does not always convince a commissioner. What clears an NHS business case is not what clears a German sickness fund or a US integrated delivery network. We build for the system you are selling into, and we know where the approval sits.',
    },
    {
      heading: 'We do not need the data to be tidy',
      body: 'Incomplete data, a stakeholder who leaves mid-project, a roadmap that moved last week. That is the normal case in healthcare, not the exception, and it is what we plan for.',
    },
  ],
};

/**
 * The wider bench: specialists brought in per engagement, distinct from the
 * two co-founders above.
 *
 * `name` is optional. A specialist who has not agreed to be named, or a seat
 * that is not filled yet, is listed by discipline alone — which is honest and
 * still tells a buyer the capability is there.
 */
export interface BenchMember {
  /** Omit until there is a real person who has agreed to be named. */
  name?: string;
  /** The discipline. Doubles as the heading when there is no name. */
  role: string;
  /** One sentence: what they are brought in for. */
  body: string;
}

/** Real bench members go here. */
const publishedBench: BenchMember[] = [];

/**
 * Shape and length reference. Obviously not real people — never replace these
 * with anything a reader could mistake for a colleague.
 */
const sampleBench: BenchMember[] = [
  {
    name: 'Placeholder Name',
    role: 'Health economics',
    body: 'Cost-effectiveness and budget impact modelling, and the submissions that have to survive an HTA reviewer rather than a sales meeting.',
  },
  {
    name: 'Placeholder Name',
    role: 'Product',
    body: 'What the product would need to capture to prove the claim, and how to instrument for it without derailing a roadmap.',
  },
];

export const teamImage: Figure = {
  label: 'The two founders working, not posing. A whiteboard, a laptop with a model open, a real conversation. Landscape, room to breathe on the right.',
  ratio: '16/9',
  caption: 'Replace with a real photograph before launch.',
};

export const bench = {
  heading: 'A small core, and a wider bench',
  paragraphs: [
    'We keep the core team small on purpose. You get the people you met. When a piece of work needs a health economist, a statistician or a specialist from your own part of the market, we bring them in and say what they cost.',
  ],
  muted:
    'We would rather tell you a piece of work is outside our range than stretch to fill it.',
  /** Renders nothing while empty, so the section reads exactly as it does now. */
  people: isPreview ? sampleBench : publishedBench,
};

export const cta: CtaBand = {
  heading: 'Come and test us on your hardest claim.',
  body: 'Bring the number you are least confident about. That conversation tells you more about us than any case study.',
  action: { label: 'Start a conversation', href: '/contact' },
};
