import type {
  CtaBand,
  Figure,
  Hero,
  MarkKind,
  Offer,
  PageMeta,
  QaItem,
  StageRow,
} from './types';

export const meta: PageMeta = {
  title: 'How we work · delv.',
  description:
    'How a delv. engagement runs, where to start for a startup, a scale-up or an enterprise, and the six tests every deliverable has to pass before it leaves us.',
  ogImage: '/og/how-we-work.png',
};

export const hero: Hero = {
  heading: 'Priced before we start. Useful after we leave.',
  sub: 'We work inside your team rather than presenting to it. You see the deliverables and the price before you commit to anything, and what we hand over has to keep working once we have gone.',
};

export const engagement = {
  heading: 'How an engagement runs',
  rows: [
    {
      heading: 'Discover',
      when: 'Week one',
      body: 'We spend the first conversations on the problem you are solving, how you are solving it, and what your market is currently demanding of you. No proposal until we understand all three.',
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

/*
 * Split in two, because three entry offers plus Project plus Embedded is five
 * undifferentiated cards and that reads as a menu rather than a path. The
 * first group is one entry offer per audience page, in the order the nav puts
 * them; the second is where the work goes once it has started.
 *
 * The marks are the same vocabulary as the section graphics. The three entry
 * offers carry the three stages, because that is exactly what they are: a
 * Value Audit defines, a Value Model Build measures, a Claims and Evidence
 * Review reconciles what is already being said.
 */
export const offers = {
  heading: 'Where to start',
  lede: 'One entry point per audience, each a fixed fee agreed before we start. Every one of them ends with something you own whether or not you carry on with us.',
  marks: [
    'unclosed',
    'measured',
    'restated',
  ] as const satisfies readonly MarkKind[],
  items: [
    {
      heading: 'Value Audit',
      meta: 'Fixed fee &middot; about three weeks',
      body: 'Where your claims stand, what your data can support, and a ranked list of what to fix first.',
      action: { label: 'For startups', href: '/for-startups' },
    },
    {
      heading: 'Value Model Build',
      meta: 'Fixed fee &middot; six to eight weeks',
      body: 'One defensible number built from your live deployment data, with the assumptions log and the business case template that carries it.',
      action: { label: 'For scale-ups', href: '/scale-ups' },
    },
    {
      heading: 'Claims and Evidence Review',
      meta: 'Fixed fee &middot; four to six weeks',
      body: 'Every claim you make in market, reconciled against its evidence, with a ranked remediation and retirement list.',
      action: { label: 'For enterprise', href: '/enterprise' },
    },
  ] satisfies Offer[],
};

export const next = {
  heading: 'Where it goes next',
  lede: 'What most engagements become once the first piece has told us what is needed.',
  marks: ['evidenced', 'measured'] as const satisfies readonly MarkKind[],
  items: [
    {
      heading: 'Project',
      meta: 'Fixed fee &middot; scoped deliverables',
      body: 'A defined build: a claims and evidence library, an ROI calculator or calculator estate, a business case pack, an investor evidence narrative.',
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
  lede: 'Work that stops being useful the month after we invoice it was not worth buying. Every deliverable passes the same six tests before it leaves us.',
  items: [
    '<strong>Impactful</strong>: it changes a decision someone is about to make',
    '<strong>Relevant</strong>: it speaks to your market, not to consultancy in general',
    '<strong>Demonstrable</strong>: the evidence behind it can be produced on request',
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
        'Yes, and we have done it with organisations around the world. We are explicit about who we are, what we are asking and why, and we work to your rules on how your customers are approached. We turn up as part of your team, and your customers are told exactly that.',
    },
    {
      question:
        'We already have a value-based agreement in place. Does that change things?',
      answer:
        'It raises the stakes. Value-based agreements tie revenue to demonstrable health economic or operational outcomes, so evidence becomes a contractual obligation. That puts the contract and the revenue at risk. The position is usually recoverable if you start early enough.',
    },
    {
      question: 'Who do you usually work with?',
      answer:
        'Companies of all sizes, but most often startups and scale-ups evidencing their value in order to sell, raise or exit. Investors use us too: a Value Audit to screen a company before backing it, or to find the readiness gaps in one already in the portfolio. Most of that work is aimed at the NHS, and we build for health systems outside the UK where the buyer, the budget and the evidence bar are all different.',
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
