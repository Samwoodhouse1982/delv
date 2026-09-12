import type { Hero, PageMeta } from './types';

export const meta: PageMeta = {
  title: 'Start a conversation — delv.',
  description:
    'Tell us where the evidence gap is hurting — a stalled deal, an approaching raise, a claim you are no longer sure about. We reply within two working days.',
  ogImage: '/og/contact.png',
};

export const hero: Hero = {
  heading: 'Start a conversation.',
  sub: 'Tell us where the evidence gap is hurting &mdash; a stalled deal, an approaching raise, a claim you are no longer sure about. We will come back within two working days.',
};

export interface Field {
  id: string;
  /** Form field name, as the endpoint and the webhook payload see it. */
  name: string;
  label: string;
  type: 'text' | 'email' | 'select' | 'textarea';
  required?: boolean;
  autocomplete?: string;
  placeholder?: string;
  /** Shown inline when a required field is empty or invalid. */
  error?: string;
  options?: string[];
  /** The non-selectable default for a select. */
  prompt?: string;
}

export const fields: Field[] = [
  {
    id: 'f-name',
    name: 'name',
    label: 'Your name',
    type: 'text',
    required: true,
    autocomplete: 'name',
    error: 'Add your name so we know who we are replying to.',
  },
  {
    id: 'f-company',
    name: 'company',
    label: 'Company',
    type: 'text',
    autocomplete: 'organization',
  },
  {
    id: 'f-email',
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    autocomplete: 'email',
    error: 'Add an email address we can reply to.',
  },
  {
    id: 'f-stage',
    name: 'stage',
    label: 'Where you are',
    type: 'select',
    prompt: 'Select one',
    options: [
      'Pre-seed or seed',
      'Series A',
      'Series B or later',
      'Established business',
      'Investor',
    ],
  },
  {
    id: 'f-msg',
    name: 'message',
    label: 'What is stuck?',
    type: 'textarea',
    required: true,
    placeholder:
      'A sentence or two is plenty. If there is a deadline, tell us what it is.',
    error: 'Tell us in a line or two what is stuck.',
  },
];

export const form = {
  submit: 'Send it',
  /** Rendered as prose under the button. */
  note: 'Prefer to write directly? <a href="mailto:{email}">{email}</a>',
  /**
   * Replaces the form on a successful submission, and is the whole of
   * /thank-you, which is where a no-JavaScript submission lands.
   */
  success: {
    heading: 'Thank you — that has reached us.',
    paragraphs: [
      'We reply within two working days, from a real person. The first step is a 30-minute call to understand the problem, with no deck.',
      'If there is a fit, you will get a short written brief with deliverables and pricing. If there is not, we will tell you, and point you somewhere better if we can.',
    ],
  },
  /**
   * /could-not-send, where a no-JavaScript submission lands if the endpoint
   * fails. With JavaScript this case is handled in place and never navigates,
   * because the form still holds everything the visitor typed.
   *
   * Telling someone their enquiry arrived when it did not is the one failure
   * this site cannot afford, so the path exists even though it is rare.
   */
  couldNotSend: {
    heading: 'That did not send.',
    paragraphs: [
      'Something went wrong at our end, not yours. We would rather tell you than leave you waiting on a reply that was never coming.',
      'Email us directly at <a href="mailto:{email}">{email}</a> and we will pick it up from there, with the same two working day reply.',
    ],
  },
  /** Shown if the POST fails; the mailto: composer is offered alongside. */
  failure:
    'That did not send, and we would rather not lose what you wrote. Your answers are still here &mdash; send them by email instead and you will also keep a copy.',
  failureAction: 'Send it by email instead',
  invalidEmail: 'That email address is missing something. Check it and try again.',
};

export const next = {
  heading: 'What happens next',
  items: [
    'We reply within two working days, from a real person',
    'A 30-minute call to understand the problem &mdash; no deck',
    'If there is a fit, a short written brief with deliverables and pricing',
    'If there is not, we will tell you, and point you somewhere better if we can',
  ],
  note: 'Working to a tender or funding deadline? Put the date in your first message and we will tell you honestly whether it is achievable.',
};
