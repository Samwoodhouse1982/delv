import type { CtaBand, Figure, Hero, PageMeta, Pillar } from './types';

export const meta: PageMeta = {
  title: 'delv. · Prove the value. Prove the why.',
  description:
    'delv. helps healthtech companies define, measure and articulate value, so their claims stand up to procurement, investors and regulators.',
  ogImage: '/og/home.png',
};

export const hero: Hero = {
  // `mark` is the site's highlighter: a #16F4D0 wash behind the word, ink text
  // on top. #16F4D0 as the text colour itself is 1.31:1 on paper, illegible at
  // any size; this way the word carries the same colour at 8.39:1. Static, not
  // swept: the one animation on the site belongs to the claim demo below.
  heading:
    '<span class="hl">Prove the <span class="mark">value</span>.</span>' +
    '<span class="hl">Prove the why.</span>',
  sub: 'Your product works. Proving what it is worth to the person signing the budget is a different job. We help healthtech companies define, measure and articulate value, so that the claims you make in market hold up when someone checks the working.',
  actions: [
    { label: 'Start a conversation', href: '/contact' },
    { label: 'See how we work', href: '/what-we-do', ghost: true },
  ],
};

export const claim = {
  weak: {
    label: 'Before',
    text: '15,000 consultations a week run through the platform.',
  },
  strong: {
    label: 'After',
    text: 'Two minutes back on each one: 500 clinician hours a week, at one trust.',
  },
  caption:
    'Illustrative, and both lines describe the same trust in the same week. 15,000 consultations at two minutes each is 500 hours. The first number reports activity; the second is the one a finance director can take into a business case.',
};

export const what = {
  heading: 'Anyone can report the what',
  paragraphs: [
    'Downloads, seats, sessions and sign-ups all prove the same thing: somebody turned your product on. None of them tell a commissioner what changed, an investor what it is worth, or a regulator what you are entitled to claim.',
    /*
     * The closing line is kept. The edit brief dropped it here while its own
     * note on for-startups says it stays on the home page, and Sam confirmed
     * on 13 Sep that he wants the line. Cutting it from both would have taken
     * it off the site entirely.
     */
    'Procurement scores what it can count, and investors discount what they cannot check. A warm quote from a delighted clinician is not evidence, and a nice-to-have does not win a budget line. Minutes, money and metrics do.',
    'Most healthtech companies know this already. What they usually lack is the time, the data plumbing or the internal agreement to fix it, and the realisation tends to arrive with a tender deadline already moving towards them.',
  ],
  muted:
    'We sit between the economists and the optimists. A two-year multi-country study is more than most decisions need. A story from one enthusiastic ward is less. What works is a defensible number, pitched at the level the decision gets made.',
};

export const problems = {
  heading: 'Sound familiar?',
  lede: 'If two or more of these are true, there is usually a month of work that changes the shape of your year.',
  items: [
    'Your marketing claims have run ahead of the evidence behind them, and someone has started asking for the source: a customer, a regulator, or your own quality team.',
    'Procurement keeps asking for a business case, and every deal stalls at the same point.',
    'You are raising, and the deck says &ldquo;proven&rdquo; where the data room says &ldquo;pilot&rdquo;.',
    'You have signed an outcomes-based agreement and now have to evidence delivery in order to get paid.',
    'Sales, product, data and clinical each describe your value differently, and all of them are a bit right.',
    'The product generates plenty of data. None of it was set up to prove anything.',
  ],
};

export const stages = {
  heading: 'Define. Measure. Articulate.',
  lede: 'Three stages, in that order. Most people call us for the third and find out they need the first.',
  pillars: [
    {
      step: 'Stage one',
      heading: 'Define',
      body: 'What value means here: to you, to your buyer, and to whoever signs off the money. We audit the claims you already make and decide which are worth proving.',
    },
    {
      step: 'Stage two',
      heading: 'Measure',
      body: 'Financial, operational and clinical impact, built from the data you have, with the gaps named rather than papered over. One number with a stated basis beats three paragraphs of narrative.',
    },
    {
      step: 'Stage three',
      heading: 'Articulate',
      body: 'The same finding, shaped for a trust business case, an investor update and a sales conversation, plus the rules for how each claim can be used.',
    },
  ] satisfies Pillar[],
  action: { label: 'What each stage involves', href: '/what-we-do' },
};

export const table = {
  heading: 'We have been on your side of the table',
  paragraphs: [
    'Between us we have been a practising GP, a medical director inside a fast-scaling digital health company, and the person responsible for making a healthtech vendor&rsquo;s value story stand up in NHS procurement. We have written the claim, found the data that did not support it, and gone back to rebuild it.',
    'The other half of the job is knowing where the number has to land. We know how the NHS buys, who signs a business case off and at what level, and how the same argument has to be rebuilt for a health system in another country, where the payer, the budget and the evidence bar are all different.',
  ],
  action: { label: 'Who we are', href: '/who-we-are' },
};

export const tableImage: Figure = {
  label: 'A procurement or business case meeting from the seller side of the table. Documents and a screen with numbers on it, faces not required.',
  ratio: '3/2',
};

export const cta: CtaBand = {
  heading: 'Let&rsquo;s build your value story.',
  body: 'Tell us where the evidence gap is hurting most. If we are not the right people, we will say so on the call.',
  action: { label: 'Start a conversation', href: '/contact' },
};
