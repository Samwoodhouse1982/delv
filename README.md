# delv.

The marketing site for DELV Consulting Ltd, trading as `delv.`

Six content pages plus a privacy shell and a 404, built with Astro and plain
CSS. No framework, no CMS, no client-side router. The whole site ships about
3kb of JavaScript, and most pages ship 0.5kb of it.

`delv-build-brief.md` is the specification. `reference/prototype.html` is the
approved single-file prototype it was ported from: it is the design and copy
source of truth and is not edited.

---

## Running it

```
npm install
npm run dev          # http://localhost:4321
npm run build        # static output in dist/
npm run preview      # serve the built output
```

Node 20.3 or later.

## Checks

```
npm run check        # astro check, then axe-core over the built site
npm run a11y         # just the axe pass (needs a build first)
```

`npm run a11y` serves `dist/` and runs axe-core over all eight pages at 320,
375, 768, 1024 and 1440px, and fails on any violation or any horizontal
overflow. It needs a Chromium:

```
npx playwright install chromium
```

or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to one you already have.

A clean axe run is a floor, not a pass. Axe does not reliably detect
SC 1.4.11 — focus indicators and form control boundaries — which is precisely
where the prototype was weakest, so check those by hand after any change to
`--hair-strong`, the focus rules, or the claim demo colours.

---

## Where the copy lives

Every word on the site is in `src/data/`, one file per page plus `site.ts` for
the nav, footer and company details. Changing wording should never mean
opening a component.

| File | Page |
| --- | --- |
| `src/data/home.ts` | `/` |
| `src/data/what-we-do.ts` | `/what-we-do` |
| `src/data/for-startups.ts` | `/for-startups` |
| `src/data/how-we-work.ts` | `/how-we-work` |
| `src/data/who-we-are.ts` | `/who-we-are` |
| `src/data/contact.ts` | `/contact`, including the form fields and messages |
| `src/data/privacy.ts` | `/privacy` |
| `src/data/site.ts` | nav, footer, company details, email |

Strings are rendered with `set:html`, so they keep their typographic
characters — `&rsquo;`, `&mdash;`, `&middot;`, `&ldquo;` — and must stay
HTML-safe. A bare `<` or `&` will break the page.

Each page file also exports a `meta` object with the `<title>`, the meta
description and the OG card. Change a heading and the OG card no longer
matches: re-run `npm run og` and commit the PNGs.

### Changing a page

1. Edit the relevant `src/data/*.ts`.
2. `npm run build && npm run a11y`.
3. If a heading changed, `npm run og` and commit `public/og/*.png`.

The favicon is `public/favicon.svg`; `favicon.ico` and `apple-touch-icon.png`
are rasterised from it by `npm run icons`. Edit the SVG, re-run that, commit
the bitmaps.

Adding a section means a component in `src/components/` and a block in the
page file. The components are deliberately thin: they take content and render
the prototype's markup, and hold no copy of their own.

---

## Design system

`src/styles/global.css` is the whole of it, ported from the prototype. Tokens
at the top, then base, layout, motifs, header, content blocks, form, footer.

Three things to know before changing it:

**Every colour has one job.** Yale blue carries structure. Pacific blue is
structural detail only and never text — it does not meet contrast at body
size. Aquamarine is the evidence colour. Rosy taupe marks the unevidenced
claim in the home hero and appears nowhere else. `--error` is for validation
messages. The one-job rule is what keeps the palette legible; spreading a
colour is how it stops meaning anything.

**There is one animation.** The highlighter sweep on the home hero: 750ms,
500ms delay, once on load, and rendered in its finished state immediately
under `prefers-reduced-motion: reduce`. Nothing else moves. Scroll-triggered
reveals, fade-ups, counters and hover transforms are all out of scope by
decision, not by omission.

**Four colour values deviate from the prototype**, each because the
prototype's value failed WCAG. They are commented `Correction` in the
stylesheet and recorded in §5, §8 and §10 of the brief: `--claim-weak`,
the taupe wash at 30%, `--hair-strong` on form controls, and the first
`.claim-tick` at 52%. Do not revert them.

### Fonts

Archivo and Newsreader, both variable, both self-hosted from `public/fonts/`
so there is no third-party request. Each real face is shadowed by a
metric-matched fallback (`size-adjust`, `ascent-override`,
`descent-override`, `line-gap-override`) so `font-display: swap` cannot shift
the layout when the webfont lands.

Those override values are derived, not guessed. `npm run fonts:metrics` reads
the shipped woff2 files and the real Arial and Georgia metrics from
`@capsizecss/metrics`, and prints the two `@font-face` blocks to paste into
`global.css`. See `scripts/font-metrics.mjs` for the arithmetic and
`scripts/fonts.md` for how to refresh the font files themselves.

---

## The contact form

`src/components/ContactForm.astro`. It posts to Netlify Forms, with a
honeypot and no CAPTCHA.

Without JavaScript it submits natively and Netlify renders its own
confirmation. With JavaScript it validates inline — each message tied to its
field with `aria-describedby`, `aria-invalid` set, focus moved to the first
field that failed — then posts in the background and swaps itself for the
confirmation panel.

If the post fails, nothing the user typed is lost: the form stays filled and
the status region offers a `mailto:` with the whole message pre-composed.

The status region is rendered on every page load and only its text changes.
Do not make it `display: none` when empty — an element outside the
accessibility tree does not announce when a message arrives in it.

**Before wiring this to HubSpot, ask Sam.** The pattern, if he wants it, is
Netlify Forms for storage plus a serverless function posting to the HubSpot
Forms API, so a CRM outage never loses an enquiry.

---

## Deployment

Netlify, building from `main`. `netlify.toml` holds the configuration:

```
npm ci --omit=dev && npm run build   →   dist/
```

`--omit=dev` keeps Playwright out of the deploy image; it is only needed for
`npm run og` and `npm run a11y`, which run locally.

Cloudflare Pages works too, with the same command and output directory — but
the contact form posts to Netlify Forms, so moving hosts means moving the form
backend as well.

---

## Still a placeholder

None of these blocks development. All of them block launch.

- **Company details.** The footer legal strip shows only the registered name
  and place of registration. A limited company must also show its company
  number and registered office on its website. Both are `null` in
  `src/data/site.ts`, and the strip renders only what is filled in. **The site
  cannot go live without them.**
- **Email address.** `hello@delv.health` is unconfirmed. It is in
  `src/data/site.ts` and feeds the footer, the form note and the `mailto:`
  fallback.
- **Privacy notice.** `/privacy` is built but its text is Sam's to supply. The
  page is `noindex` until then; `src/data/privacy.ts` says what to replace.
- **Domain.** `delv.health` is a placeholder, set as `site` in
  `astro.config.mjs` and in `public/robots.txt`. Canonicals, Open Graph URLs
  and the sitemap all derive from it, so change it in both places.
- **Brand punctuation.** The favicon and OG cards use `delv.` with a single
  terminal full stop. `.delv.` and `:delv:` were both in the source material.
  Confirm before these are treated as final.
- **LinkedIn.** `site.sameAs` is empty, so the home page's `Organization`
  JSON-LD omits the property rather than pointing at nothing.
- **Analytics.** Nothing is loaded. Plausible is the intended choice, and is
  cookieless, but it is not in yet.

## Noted, not changed

Copy is the client's deliverable and has been through review, so nothing was
edited during the port. Nothing in it read as a typo.

Two defects in the prototype's CSS were fixed, because leaving them would have
shipped inaccessible pages. Both are recorded in §10 of the brief: the header
CTA's colour losing to `nav.main a` on specificity, and the first
`.claim-tick` at 4.0:1.

The prototype's founder bios and the contact page's "What happens next" were
`h3` elements sitting directly under the page `h1`. They are `h2` here, styled
at `h3`'s size by `.as-h3`, so the outline is correct and the design is
unchanged.

## Out of scope

Blog, case studies, gated downloads, newsletter, client portal, multilingual,
dark mode, CMS, ROI calculator embed. Several are likely phase two; the CSS
and components are structured so an `/insights` index and article template
could be added without touching the design system.
