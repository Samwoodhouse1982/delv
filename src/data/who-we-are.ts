import type { CtaBand, Hero, PageMeta, Person } from './types';

export const meta: PageMeta = {
  title: 'Who we are — delv.',
  description:
    'A former GP and medical director, and a commercial lead who has taken value stories through NHS procurement. The two people behind delv.',
  ogImage: '/og/who-we-are.png',
};

export const hero: Hero = {
  heading: 'We have been in your shoes.',
  sub: 'Between us we have worked across the digital health ecosystem &mdash; clinical practice, global health technology, health systems, and startups trying to get their first real contract over the line.',
};

export const people: Person[] = [
  {
    name: 'Dr Shubs Upadhyay',
    role: 'Co-founder',
    paragraphs: [
      'A former GP who became medical director at Ada Health, where value and evidence were commercial questions as much as clinical ones.',
      'Shubs co-chaired the ITU/WHO focus group working group on clinical evaluation of AI for health, bringing together experts globally to establish evaluation frameworks for developers and policy makers. He works at the join between clinical credibility, regulatory expectation and commercial reality.',
    ],
  },
  {
    name: 'Sam Woodhouse',
    role: 'Co-founder',
    paragraphs: [
      'Sam has spent his career making health technology understandable to the people who buy it, as a marketing and commercial lead inside and alongside digital health companies.',
      'He has built ROI calculators and value narratives for electronic patient record, symptom assessment and healthcare risk management vendors, and has worked at the sharp end of NHS procurement &mdash; where a claim either survives scrutiny or quietly loses the deal.',
    ],
  },
];

export const different = {
  heading: 'What makes us different',
  items: [
    {
      heading: 'We have been on your side of the table',
      body: 'We have carried the number into the meeting and had it questioned. That is a different experience from advising on it.',
    },
    {
      heading: 'We roll up our sleeves',
      body: 'We do not shout from the sidelines. We get into the data, sit with your team, and hand back things people can use on Monday.',
    },
    {
      heading: 'We are comfortable with ambiguity',
      body: 'Healthcare rarely follows a straight path. We are used to incomplete data, shifting stakeholders and a roadmap that moved last week.',
    },
  ],
};

export const bench = {
  heading: 'A small core, and a wider bench',
  paragraphs: [
    'We keep the core team small on purpose &mdash; you get the people you met, not a team you have never spoken to. When a piece of work needs a health economist, a statistician or a specialist from your own part of the market, we bring them in and say what they cost.',
  ],
  muted:
    'We would rather tell you a piece of work is outside our range than stretch to fill it.',
};

export const cta: CtaBand = {
  heading: 'Come and test us on your hardest claim.',
  body: 'Bring the number you are least confident about. That conversation tells you more about us than any case study.',
  action: { label: 'Start a conversation', href: '/contact' },
};
