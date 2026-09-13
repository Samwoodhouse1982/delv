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
 * Scale-ups. The Measure page.
 *
 * Each audience page leans on a different one of the three stages, and that is
 * the only thing stopping three pages about evidence from collapsing into one.
 * Startups is Define: the evidence does not exist yet. This one is Measure: the
 * evidence exists in the data and nobody has gone to get it. Enterprise is
 * Articulate: it exists several times over and none of the versions agree.
 *
 * If a paragraph here would work equally well on either of the other two, it is
 * written at the wrong level and belongs in neither.
 */

export const meta: PageMeta = {
  title: 'Scale-ups · delv.',
  description:
    'For healthtech companies moving from pilot funding to recurrent budget. delv. turns live deployment data into a value model your commercial team can run.',
  ogImage: '/og/scale-ups.png',
};

export const hero: Hero = {
  heading: 'The proof is already in your deployment data.',
  sub: 'Twelve months of live use across several trusts, and a product generating data that nobody set up to prove anything. Most of the work is digging through what you already have, before any modelling starts. We go and get the number, then build it so your team can run it again without us.',
  actions: [
    { label: 'Start a conversation', href: '/contact' },
    { label: 'See what we do', href: '/what-we-do', ghost: true },
  ],
};

export const moments = {
  heading: 'Three moments when scale-ups call us',
  rows: [
    {
      heading: 'The pilot that has to become a budget line',
      when: 'After the third or fourth pilot',
      body: 'Innovation money bought the pilot and everybody was pleased with it. Recurrent budget is a different conversation, with a different person, who wants a baseline against a comparator, and a number that holds up in a finance review. Nothing you gathered during the pilot was designed for that meeting.',
    },
    {
      heading: 'The renewal that becomes a re-procurement',
      when: 'Usually six months before the contract ends',
      body: 'The trust that signed three years ago now has to justify keeping you: against a framework, against a rival, and against doing nothing. Nobody on your side can say what the deployment delivered, because nobody was asked to measure it at the time.',
    },
    {
      heading: 'The business case that does not travel',
      when: 'The first market that is not the NHS',
      body: 'Your argument was built once, for one system. The first buyer outside it wants the same product justified against a different payer and a different evidence bar, and the deck you have does not convert.',
    },
  ] satisfies StageRow[],
};

export const work = {
  heading: 'What the work looks like',
  lede: 'All three stages, weighted heavily towards the middle one. Most of the value here is in the data you already have.',
  /*
   * The marks read left to right as the argument does: a claim not yet closed,
   * the same claim measured, then that finding restated for whoever asks next.
   */
  marks: [
    'unclosed',
    'measured',
    'restated',
  ] as const satisfies readonly MarkKind[],
  pillars: [
    {
      step: 'Short',
      heading: 'Agree what is worth proving',
      body: 'We audit what you already claim, sort the evidenced from the inherited, and pick the two or three numbers that would change a procurement conversation. This stage is quick, because you are not starting from nothing.',
    },
    {
      step: 'The bulk of it',
      heading: 'Go and get the number',
      body: 'We work in your deployment data. Where the data is thin we say so, and use a proxy with the reasoning written down. You get a model with an assumptions log and a stated basis for every figure. Attribution is set low on purpose, so the number survives someone checking it.',
    },
    {
      step: 'What makes it repeat',
      heading: 'Build it so it runs again',
      body: 'By the next renewal, you need to be able to update it without us. We hand over something your commercial team can run on a new prospect, refresh as deployments mature, and defend in a room we are not in.',
    },
  ] satisfies Pillar[],
};

export const outcome = {
  heading: 'What you end up with',
  details: [
    'A value model built from your live deployment data, with a documented assumptions log',
    'A business case template your buyer can put through their own internal approvals',
    'The baseline you should have captured at go-live, reconstructed as far as the data allows',
    'A second-market version of the same argument, rebuilt around that payer and budget holder',
    'An ROI calculator your sales team walks a prospect through, using that prospect&rsquo;s own numbers',
    'A Value Library holding the claims you can now make and the sourcing behind each one',
    'A measurement plan so the next twelve months of deployments produce evidence by design',
  ],
  note: 'What we will not do: reconstruct a baseline the data cannot support, pick the comparator that flatters the result, or hand back a model only we know how to update. If the honest number is smaller than the one in your deck, you will hear it from us before a customer finds it.',
};

export const outcomeImage: Figure = {
  label:
    'A value model open on screen beside a printed business case. Mid-work, in use, not styled.',
  ratio: '3/2',
  caption:
    'Replace with a real anonymised artefact from a live engagement before launch.',
};

/**
 * All three audience pages offer a calculator and all three mean something
 * different by it. A startup gets a public web tool built on a modelled
 * scenario. This one is sales-led and built on real deployment data. Enterprise
 * gets one method applied across every market. If those three ever read the
 * same, the difference has not been written hard enough.
 */
export const calculator = {
  heading: 'The model becomes a tool your team can sell with',
  paragraphs: [
    'A value model that lives in a spreadsheet gets used by the person who built it. We turn yours into a calculator a salesperson opens in front of a prospect, fills in with that trust&rsquo;s own establishment, activity and cost figures, and leaves behind as a business case with the assumptions printed on it.',
    'A prospect who has typed in their own numbers is arguing with their own arithmetic, not with your marketing.',
  ],
  caption:
    'Every input carries its default, its source, and the range we think holds.',
};

export const cta: CtaBand = {
  heading: 'Start with a Value Model Build.',
  body: 'Six to eight weeks, fixed fee. We work in your deployment data and hand back one number you can defend, the assumptions behind it, and the template that carries it into procurement. Your team owns it and can run it again.',
  action: { label: 'Start a conversation', href: '/contact' },
};
