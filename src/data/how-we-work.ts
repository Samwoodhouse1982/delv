import type { CtaBand, Figure, Hero, Offer, PageMeta, QaItem, StageRow } from './types';

export const meta: PageMeta = {
  title: 'How we work · delv.',
  description:
    'How a delv. engagement runs, the three ways to work with us, and the six tests every deliverable has to pass before it leaves us.',
  ogImage: '/og/how-we-work.png',
};

export const hero: Hero = {
  heading: 'Fast, hands-on, and specific to your business.',
  sub: 'We work as an extension of your team rather than from the sidelines. Healthcare rarely follows a straight line, so we plan for that instead of pretending otherwise.',
};

export const engagement = {
  heading: 'How an engagement runs',
  rows: [
    {
      heading: 'Discover',
      when: 'Week one',
      body: 'Every product has a context. We spend the first conversations understanding the problem you are solving, how you are solving it, and what the market is currently demanding of you. We listen before we propose.',
    },
    {
      heading: 'Brief',
      when: 'Before any money moves',
      body: 'We come back with a set of deliverables and indicative pricing, tied to your most urgent need without ignoring the medium term. You will know what you are buying and what it costs before you commit.',
    },
    {
      heading: 'Investigate',
      when: 'The bulk of the work',
      body: 'We meet stakeholders across commercial, marketing, product, data and clinical. We ask the awkward questions, find the gaps and the lever points, and zoom out to check where the market is heading.',
    },
    {
      heading: 'Deliver',
      when: 'And afterwards',
      body: 'Models, scenarios, real-world value, research and science communications strategy where relevant. Then the link to what happens next, because a value story that is not maintained ages quickly.',
    },
  ] satisfies StageRow[],
};

export const offers = {
  heading: 'Three ways to work with us',
  lede: 'Most startups begin with the first. Fees are fixed and agreed before we start, unless you would rather buy days.',
  items: [
    {
      heading: 'Value Audit',
      meta: 'Fixed fee &middot; about three weeks',
      body: 'Where your claims stand, what your data can support, and a ranked list of what to fix first. Ends with a claims-and-evidence map you own.',
    },
    {
      heading: 'Project',
      meta: 'Fixed fee &middot; scoped deliverables',
      body: 'A defined piece of work: a value model, an ROI calculator, a claims library, a business case pack, an investor evidence narrative.',
    },
    {
      heading: 'Embedded',
      meta: 'Retained days each month',
      body: 'We act as your value lead while you are too small to hire one. Useful through a raise, a tender cycle or a first outcomes-based contract.',
    },
  ] satisfies Offer[],
};

export const tests = {
  heading: 'Six tests for anything we hand over',
  lede: 'We are in this for long relationships, which means the work has to keep earning after the invoice. Every deliverable has to pass the same six tests before it leaves us.',
  items: [
    '<strong>Impactful</strong>: it changes a decision someone is about to make',
    '<strong>Relevant</strong>: it speaks to your market, not to consultancy in general',
    '<strong>Demonstrable</strong>: the evidence behind it can be shown, not just asserted',
    '<strong>Quantifiable</strong>: there is a number, with a stated basis',
    '<strong>Usable</strong>: your team can pick it up without us in the room',
    '<strong>Marketable</strong>: it can go in front of customers and hold up',
  ],
};

export const qa = {
  heading: 'Questions we get asked',
  items: [
    {
      question: 'Why &ldquo;delv.&rdquo;?',
      answer:
        'It is short for delivering value, and for delving deep enough into a business to find value worth shouting about.',
    },
    {
      question: 'Can we trust you to speak to our customers directly?',
      answer:
        'Yes. We have worked with organisations around the world and can be clear about our purpose, our limits and our respect for a client&rsquo;s own processes. We turn up as an extension of your team.',
    },
    {
      question:
        'We already have a value-based agreement in place. Does that change things?',
      answer:
        'It raises the stakes. Value-based agreements tie revenue to demonstrable health economic or operational outcomes, so evidence is a contractual obligation rather than a marketing nicety. Absence of evidence puts the contract and the revenue at risk, and it is usually recoverable if you start early enough.',
    },
    {
      question: 'Who do you usually work with?',
      answer:
        'Companies of all sizes, but most often startups and scale-ups evidencing their value in order to sell, raise or exit. We also run value reviews for investors looking at a portfolio company.',
    },
    {
      question: 'How quickly can you start?',
      answer:
        'Tell us your deadline in the first email. A Value Audit can usually begin within a fortnight; larger projects depend on the stakeholders we need access to.',
    },
    {
      question: 'What does it cost?',
      answer:
        'Fixed fees for defined deliverables, or a day rate for advisory and embedded work, with specialist input such as health economics priced separately and transparently. You get pricing in the brief, before you commit.',
    },
  ] satisfies QaItem[],
};

export const workingImage: Figure = {
  label: 'Working session with a client team. Around a table or a screen, mid-discussion. Should read as an extension of their team, not a consultant presenting.',
  ratio: '16/9',
};

export const cta: CtaBand = {
  heading: 'Tell us what is stuck.',
  body: 'A first call costs nothing and usually clarifies the problem, whoever ends up solving it.',
  action: { label: 'Start a conversation', href: '/contact' },
};
