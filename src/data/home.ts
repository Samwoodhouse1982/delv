import type { CtaBand, Figure, Hero, PageMeta, Pillar } from './types';

export const meta: PageMeta = {
  title: 'delv. · prove the value, prove your why.',
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
    '<span class="hl">Prove the <span class="mark">value</span>,</span>' +
    '<span class="hl">prove your why.</span>',
  sub: 'Your product works. The hard part is showing what it is worth. We help healthtech companies define, measure and articulate value, so the claims on your website survive a procurement review, a data room and a clinical safety officer.',
  actions: [
    { label: 'Start a conversation', href: '/contact' },
    { label: 'See how we work', href: '/what-we-do', ghost: true },
  ],
};

export const claim = {
  weak: {
    label: 'Before',
    text: '4,000 clinicians use the platform every week.',
  },
  strong: {
    label: 'After',
    text: '1.4 hours returned per clinician per week: 92 working days a month, at one trust.',
  },
  caption:
    'Illustrative. The first line is activity. The second is the one a finance director can put in a business case.',
};

export const what = {
  heading: 'Anyone can report the what',
  paragraphs: [
    'Downloads, seats, sessions, sign-ups. They prove someone turned your product on. They do not tell a commissioner what changed, an investor what it is worth, or a regulator what you are entitled to claim.',
    'The why is harder. What changed, for whom, by how much, and how you know. That is the version that gets signed off, and it is the version almost nobody has ready when it is asked for.',
    'Procurement scores what it can count. Investors discount what they cannot check. A warm quote from a delighted clinician is not evidence, and a nice-to-have does not win a budget line. Minutes, money and metrics do.',
    'Most healthtech companies know this. What they lack is the time, the data plumbing or the internal agreement to fix it, usually while a tender deadline is moving towards them.',
  ],
  muted:
    'We sit in the space between the economists and the optimists. Not a two-year multi-country study. Not a heroic anecdote from one ward. A defensible number, at the level your buyer actually makes the decision.',
};

export const problems = {
  heading: 'Sound familiar?',
  lede: 'If two or more of these are true, there is usually a month of work that changes the shape of your year.',
  items: [
    'Your marketing claims have run ahead of the evidence behind them, and someone has started asking for the source: a customer, a regulator, or your own quality team.',
    'Procurement keeps asking for a business case, and every deal stalls in the same place.',
    'You are raising, and the deck says &ldquo;proven&rdquo; where the data room says &ldquo;pilot&rdquo;.',
    'You signed an outcomes-based or value-based agreement and now have to evidence delivery to get paid.',
    'Sales, product, data and clinical each describe your value differently, and all of them are a bit right.',
    'The product generates plenty of data. None of it was designed to answer &ldquo;so what?&rdquo;',
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
    'Between us we have been a practising GP, a medical director inside a fast-scaling digital health company, and the person responsible for making a healthtech vendor&rsquo;s value story stand up in NHS procurement.',
    'We have written the claim, found the data that did not support it, and had to go back and rebuild it. That is why we are useful early, and why we will tell you when a number does not hold.',
    'The other half of the job is knowing where the number has to land. We know how the NHS buys, who signs a business case off and at what level, and how the same argument has to be rebuilt for a health system in another country.',
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
