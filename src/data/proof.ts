/**
 * Proof: anonymised results and client quotes.
 *
 * Both registries are EMPTY, and the components render nothing when they are.
 * The proof band and the quote band simply do not appear on a page with no
 * content for them, so the live site today looks exactly as it did before
 * these slots existed. That is deliberate: a consultancy whose argument is
 * that unevidenced claims do not survive contact with a buyer cannot ship
 * invented ones of its own.
 *
 * To see the design without publishing anything:
 *
 *   npm run dev:preview
 *
 * which fills both registries with clearly fake sample entries. They exist
 * only when PLACEHOLDER_PREVIEW is set, so they cannot reach a deploy by
 * accident. See src/data/preview.ts.
 *
 * To publish real proof: add entries below and list their ids in `placement`.
 *
 * Do NOT add Review or AggregateRating JSON-LD alongside these. §9 of the
 * build brief rules it out, and self-serving review markup on your own site
 * is against Google's structured data guidelines regardless.
 */

import { isPreview } from './preview';

export interface Result {
  /** Referenced from `placement`. */
  id: string;
  /**
   * The evidenced number. Gets the highlighter, so it must be a claim that
   * holds — what changed, for whom, by how much.
   */
  figure: string;
  /** Who it was, at whatever level of anonymity the client agreed to. */
  client: string;
  /** What the work was and what moved. */
  what: string;
  /** How the number is known. The line an analyst would ask for. */
  basis: string;
}

export interface Quote {
  /** Referenced from `placement`. */
  id: string;
  text: string;
  /** A name, or a role alone where the client will not be named. */
  name: string;
  role: string;
  company: string;
}

type PageKey =
  | 'home'
  | 'what-we-do'
  | 'for-startups'
  | 'scale-ups'
  | 'enterprise'
  | 'how-we-work'
  | 'who-we-are';

/** Real results go here. */
const published: Result[] = [];

/** Real quotes go here. */
const publishedQuotes: Quote[] = [];

/**
 * Shape and length reference for the two components. Obviously not real —
 * that is the point. Never fill these in with anything a reader could mistake
 * for a client.
 */
const sampleResults: Result[] = [
  {
    id: 'sample-1',
    figure: '1.4 hours returned per clinician per week',
    client: 'Sample: a UK EPR vendor',
    what: 'A value model built from twelve months of deployment data at one trust, and the business case template that carried it into procurement.',
    basis: 'Time-and-motion baseline across 240 clinicians at one trust, with the assumptions log published alongside the model.',
  },
  {
    id: 'sample-2',
    figure: 'Procurement cycle cut from nine months to five',
    client: 'Sample: a symptom assessment company',
    what: 'One claims and evidence library replacing four inconsistent decks, with sourcing and usage rules attached to every claim.',
    basis: 'Median time from first meeting to signature, eleven trusts, before and after.',
  },
  {
    id: 'sample-3',
    figure: 'Series B closed without a diligence challenge on evidence',
    client: 'Sample: a risk management platform',
    what: 'An evidence narrative reconciled against the data room eight weeks before the process opened.',
    basis: 'Diligence question log, compared with the previous round.',
  },
];

const sampleQuotes: Quote[] = [
  {
    id: 'sample-home',
    text: 'They told us two of our headline claims would not survive a finance review. That was uncomfortable and completely right, and it is why the rest of the numbers held.',
    name: 'Placeholder Name',
    role: 'Chief Commercial Officer',
    company: 'Placeholder Health',
  },
  {
    id: 'sample-startups',
    text: 'We had traction and no proof. Six weeks later we had a model our buyers could take into their own approvals without us in the room.',
    name: 'Placeholder Name',
    role: 'Co-founder',
    company: 'Placeholder Health',
  },
  {
    id: 'sample-hww',
    text: 'They sat with our data team rather than sending a deck. The output was something we could still maintain a year later.',
    name: 'Placeholder Name',
    role: 'VP Product',
    company: 'Placeholder Health',
  },
  {
    id: 'sample-who',
    text: 'The value of having someone who has carried the number into the meeting is that they know which questions are coming.',
    name: 'Placeholder Name',
    role: 'Medical Director',
    company: 'Placeholder Health',
  },
  {
    id: 'sample-scale-ups',
    text: 'We had three years of usage data and no idea what it proved. What came back was a number our own finance team could not pull apart, which is what made it useful.',
    name: 'Placeholder Name',
    role: 'Chief Commercial Officer',
    company: 'Placeholder Health',
  },
  {
    id: 'sample-enterprise',
    text: 'Four business units had four versions of the same number and all four were arguably right. Having one of them chosen, sourced and written down took an argument off the table for good.',
    name: 'Placeholder Name',
    role: 'Global Marketing Director',
    company: 'Placeholder Health',
  },
];

export const results: Result[] = isPreview ? sampleResults : published;
export const quotes: Quote[] = isPreview ? sampleQuotes : publishedQuotes;

/**
 * Which proof appears on which page. Ids that do not resolve are ignored, so
 * a page silently drops a result rather than breaking the build if one is
 * withdrawn.
 *
 * `results` is capped at three per page by the component's layout.
 */
export const placement: Record<
  PageKey,
  { heading?: string; lede?: string; results: string[]; quote: string | null }
> = {
  home: {
    /*
     * No lede since 18 Sep 2026, on Sam's edit. The component already draws a
     * heading without one as a plain h2 rather than a split, so there is
     * nothing to change but this.
     */
    heading: 'Without proof, what&rsquo;s the point?',
    results: isPreview ? ['sample-1', 'sample-2', 'sample-3'] : [],
    quote: isPreview ? 'sample-home' : null,
  },
  'what-we-do': { results: [], quote: null },
  'for-startups': {
    heading: 'What it has been worth to founders',
    results: isPreview ? ['sample-2', 'sample-3'] : [],
    quote: isPreview ? 'sample-startups' : null,
  },
  'scale-ups': {
    heading: 'What it has been worth',
    results: isPreview ? ['sample-1'] : [],
    quote: isPreview ? 'sample-scale-ups' : null,
  },
  /*
   * `results` stays empty even in preview, and that is the point rather than an
   * oversight. The card that fits this page is sample-2, the symptom assessment
   * one, and it already runs on the home page and on Startups. Running it on a
   * third page would be the same evidence doing three jobs, and inventing a
   * fourth card to avoid that is exactly what this site argues against. The
   * band renders nothing until a real engagement is chosen for it. §13 of the
   * brief tracks it.
   */
  enterprise: {
    heading: 'What it has been worth',
    results: [],
    quote: isPreview ? 'sample-enterprise' : null,
  },
  'how-we-work': {
    results: [],
    quote: isPreview ? 'sample-hww' : null,
  },
  'who-we-are': {
    results: [],
    quote: isPreview ? 'sample-who' : null,
  },
};

export function resultsFor(page: PageKey): Result[] {
  return placement[page].results
    .map((id) => results.find((result) => result.id === id))
    .filter((result): result is Result => Boolean(result))
    .slice(0, 3);
}

export function quoteFor(page: PageKey): Quote | null {
  const id = placement[page].quote;
  return id ? (quotes.find((quote) => quote.id === id) ?? null) : null;
}
