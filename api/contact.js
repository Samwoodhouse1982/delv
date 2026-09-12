/**
 * Contact form endpoint.
 *
 * A Vercel serverless function, because Vercel has no equivalent of Netlify
 * Forms. It deliberately picks no vendor: it validates the enquiry and
 * forwards it as JSON to whatever CONTACT_WEBHOOK_URL points at — an email
 * relay, Zapier, Make, a Google Apps Script, HubSpot, Slack. Set that one
 * environment variable in the Vercel project and the form works.
 *
 * Until it is set, this returns 503 and the page falls back to the mailto:
 * composer with everything the visitor typed already in it, so an enquiry is
 * never silently lost. That fallback is the reason this can ship unfinished.
 *
 * Do not wire this to HubSpot without asking Sam first (§8 of the build
 * brief). If he wants it, the pattern is store-then-forward so a CRM outage
 * cannot lose an enquiry.
 */

const REQUIRED = ['name', 'email', 'message'];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** A fetch() submission wants JSON back; a native form post wants a page. */
const wantsJson = (req) => (req.headers.accept ?? '').includes('application/json');

/**
 * A fetch() caller gets JSON and handles the outcome in place. A native form
 * post gets a redirect to a real page — and which page matters: a validation
 * failure is the visitor's to fix and belongs back at the form, while a
 * failure at our end must say so rather than imply the enquiry arrived.
 */
const respond = (req, res, status, body, redirectTo) => {
  if (wantsJson(req)) return res.status(status).json(body);
  return res.redirect(303, redirectTo);
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body ?? {};
  const value = (key) => String(body[key] ?? '').trim();

  // Honeypot. Answer as though it worked — a bot that knows it failed comes
  // back with the field removed.
  if (value('bot-field')) return respond(req, res, 200, { ok: true }, '/thank-you');

  const missing = REQUIRED.filter((field) => !value(field));
  if (missing.length > 0) {
    return respond(req, res, 400, { error: 'missing', fields: missing }, '/contact');
  }
  if (!EMAIL.test(value('email'))) {
    return respond(req, res, 400, { error: 'email' }, '/contact');
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (!webhook) {
    // Not configured. The page offers the mailto: composer on this, which is
    // why it is safe to deploy before the webhook exists.
    return respond(req, res, 503, { error: 'not-configured' }, '/could-not-send');
  }

  try {
    const forwarded = await fetch(webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.CONTACT_WEBHOOK_TOKEN
          ? { Authorization: `Bearer ${process.env.CONTACT_WEBHOOK_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({
        name: value('name'),
        company: value('company'),
        email: value('email'),
        stage: value('stage'),
        message: value('message'),
        receivedAt: new Date().toISOString(),
      }),
    });

    if (!forwarded.ok) throw new Error(`webhook responded ${forwarded.status}`);
    return respond(req, res, 200, { ok: true }, '/thank-you');
  } catch (error) {
    // Log for the Vercel function logs; the visitor gets the mailto: fallback
    // rather than an apology and a lost enquiry.
    console.error('contact: forwarding failed', error);
    return respond(req, res, 502, { error: 'forwarding-failed' }, '/could-not-send');
  }
}
