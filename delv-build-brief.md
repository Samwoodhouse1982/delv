# Build brief — delv. website

**For:** Claude Code
**Client:** DELV Consulting Ltd (trading as `delv.`)
**Prepared by:** Sam Woodhouse
**Date:** September 2026
**Reference prototype:** `reference/prototype.html` (single-file HTML — this is the design and copy source of truth)

---

## 1. What you are building

A six-page static marketing site for `delv.`, a value-and-evidence consultancy for healthtech companies. The audience is founders and commercial leads at funded digital health startups and scale-ups, plus a smaller investor audience.

A complete, approved prototype already exists at `reference/prototype.html`. It contains final copy, the full design system and all six pages implemented with hash-based routing.

**Your job is to port it to a production codebase.** Not to redesign it, not to rewrite the copy.

Where the prototype and this brief disagree, this brief wins. Where the brief is silent, follow the prototype exactly.

---

## 2. Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | **Astro 5** (static output) | Six content pages, zero app state. Ships no JS by default, which is the point. |
| Styling | **Plain CSS with custom properties**, one global stylesheet plus scoped component styles | The design depends on hairline rules, tick gradients and precise optical spacing already expressed as CSS variables. Porting to Tailwind means re-deriving all of it for no gain. |
| Content | Typed data files in `src/data/` (one `.ts` per page) | Sam edits copy often. Copy should never require touching a component. Not `src/content/` &mdash; that name carries content-collection semantics in Astro, and these are plain typed objects, not a collection. |
| Forms | **A Vercel serverless function** forwarding to a configurable webhook, with a `mailto:` fallback | See §8. Netlify Forms was the original choice; the repo deploys to Vercel, which has no equivalent. |
| Hosting | **Vercel**, deploy on push to `main`, preview per branch | Decided: Sam no longer uses Netlify. `vercel.json` holds the config; `public/_headers` and `netlify.toml` are gone. |
| Analytics | **Plausible** (self-hosted or cloud) | Cookieless, so no consent banner in most readings of PECR. Confirm with Sam before adding anything that sets a cookie. |
| Package manager | `npm` | No preference, just be consistent. |

Do not add: a CMS, React/Vue/Svelte, a component library, an animation library, a cookie banner, or a chat widget. If you think one is needed, stop and ask.

---

## 3. Repo structure

```
delv-site/
  reference/prototype.html        # read-only; do not edit
  vercel.json                     # deploy config, headers, clean URLs
  api/contact.js                  # contact form endpoint (serverless)
  scripts/og.mjs                  # renders the OG images; run manually, output committed
  src/
    layouts/Base.astro            # html shell, head, header, footer, skip link
    components/
      Header.astro
      Footer.astro
      Rule.astro                  # the tick-mark measurement rule
      Pillars.astro               # 3-up bordered column block
      OfferGrid.astro             # 3-up offer block (Value Audit / Project / Embedded)
      StageList.astro             # 2-col label/prose rows
      DetailList.astro            # hairline list with short tick markers
      ProblemList.astro
      Bios.astro                  # 2-col founder bios
      Bench.astro                 # the wider bench, name optional
      Results.astro               # 3-up anonymised results, highlighted figure
      Quote.astro                 # pull quote with tick rule and attribution
      QA.astro
      Note.astro                  # aquamarine left-rule callout
      CtaBand.astro
      ClaimDemo.astro             # hero what/why device
      ContactForm.astro
    data/
      home.ts  what-we-do.ts  for-startups.ts  how-we-work.ts  who-we-are.ts  contact.ts
      site.ts                     # nav, footer, company details, email, strapline
      proof.ts                    # results and quotes registries, and placement
      preview.ts                  # the PLACEHOLDER_PREVIEW flag, shared
    pages/
      index.astro
      what-we-do.astro
      for-startups.astro
      how-we-work.astro
      who-we-are.astro
      contact.astro
      privacy.astro
      thank-you.astro
      could-not-send.astro
      404.astro
    styles/global.css
  public/
    fonts/                        # self-hosted woff2 + OFL.txt — see §5
    og/                           # social cards, 1200x630 PNG, one per page
    favicon.svg  favicon.ico  apple-touch-icon.png  robots.txt
```

File names follow §4's public paths, not the prototype's internal route names. There is no `approach.astro` or `startups.astro`.

---

## 4. Routes

Hash routing in the prototype was a demo constraint. Production uses real paths.

| Path | Page | `<title>` |
| --- | --- | --- |
| `/` | Home | delv. — prove the value, prove the why |
| `/what-we-do` | Approach (Define / Measure / Articulate) | What we do — delv. |
| `/for-startups` | Startups | For startups — delv. |
| `/how-we-work` | How we work | How we work — delv. |
| `/who-we-are` | Who we are | Who we are — delv. |
| `/contact` | Contact | Start a conversation — delv. |
| `/privacy` | Privacy notice | Privacy — delv. |
| `/404` | Not found | — |
| `/thank-you` | Form success, no-JavaScript redirect target | Thank you — delv. |
| `/could-not-send` | Form failure, no-JavaScript redirect target | That did not send — delv. |

Nav labels stay exactly as the prototype: What we do · For startups · How we work · Who we are · [Start a conversation]. Note the prototype's internal routes were `/approach` and `/startups`; the public URLs are `/what-we-do` and `/for-startups` to match the labels. Page files, data files and component props all use the public names. The prototype was never published, so no redirects from the old hash routes are needed.

`/privacy` is new and not in the prototype. Build the page and layout; Sam supplies the text. Do not draft a privacy notice yourself.

---

## 5. Design system

Port these verbatim from the prototype. Do not "improve" the palette or the scale.

### Colour

```css
--ink:          #153B50;  /* yale blue — body text, deep bands, primary buttons */
--ink-deep:     #0E2B3B;  /* button hover */
--brand:        #429EA6;  /* pacific blue — list markers, hairline ticks, form focus */
--mark:         #16F4D0;  /* aquamarine — evidence highlight, buttons on deep bands */
--mark-deep:    #097C6A;  /* the same, deepened for small marks on light backgrounds */
--taupe:        #CC998D;  /* rosy taupe — the unevidenced claim, and nothing else */
--paper:        #F7F7F3;  /* page background — soft linen, lightened one step */
--paper-dim:    #ECEBE4;  /* soft linen, as supplied — alternate band */
--graphite:     #4E6675;  /* secondary text */
--hair:         #D8D7CE;  /* 1px rules, borders, tick marks */
--hair-dark:    #2F5870;  /* the same, on deep bands */
--hair-strong:  #7F909C;  /* form control boundaries — the one hairline that must meet 3:1 */
--on-brand:     #A9C4D2;  /* secondary text on deep bands */
--on-brand-dim: #8FADBE;  /* footer legal strip */
--error:        #9B2C1E;  /* form validation messages, and nothing else */
```

**Every colour has one job.** Yale blue carries structure: body text, deep bands, primary buttons, focus rings. Pacific blue is structural detail only — list markers, hairline ticks, form focus — never text, because it does not meet contrast at body size. Aquamarine is the evidence colour: the highlighter, the logotype full stop, the active nav underline, the footer strapline, buttons on deep bands. Rosy taupe has exactly one use, the unevidenced claim in the home hero, and must not spread anywhere else. `--error` likewise has exactly one use, form validation messages.

Nothing in this palette is yellow. Earlier drafts of this brief described the `Note` callout rule and the focus ring on deep bands as yellow; both are aquamarine &mdash; `--mark-deep` on light backgrounds, `--mark` on deep ones.

`--mark-deep` exists because aquamarine at full strength fails contrast on light backgrounds. Use `--mark` on deep bands and `--mark-deep` on light ones.

`--hair-strong` exists because WCAG 2.2 SC 1.4.11 requires 3:1 for the boundary of a user interface component. `--hair` on white is 1.35:1, so a form field drawn with it has no perceptible edge. `--hair-strong` is 3.3:1 on white and 3.1:1 on paper. Use it for `input`, `textarea` and `select` borders **only**. Every other rule on the site stays `--hair`.

One further correction to the prototype: `.claim-text.weak` is `#8E7E79`, which is 3.3:1 on paper and 2.5:1 where the taupe wash sits behind it. Both fail, and the line is below the large-text threshold on any viewport under about 860px. Use **`#6B5F5A`** for the weak claim text and take the taupe wash from 38% down to **30%**. That gives 5.7:1 on paper and 4.6:1 over the wash, and keeps the device intact. See §10.

**No decorative gradients.** The palette was supplied with gradient variants; they are not used and should not be introduced. Flat colour and hairlines are the system. The two `linear-gradient` declarations that build the measurement rule and the highlighter are structural motifs, not decoration &mdash; they stay.

### Type

- **Archivo** (variable, width 88–112, weight 400–700) — headings, nav, buttons, labels, form fields.
- **Newsreader** (variable, optical size 6–72, weight 300–500) — body prose.

The prototype loads these from Google Fonts. **Self-host them** in production: download the variable woff2 files to `public/fonts/`, declare with `@font-face` and `font-display: swap`, and `<link rel="preload">` the two faces used above the fold. This removes a third-party request and the associated GDPR question about Google Fonts and IP addresses.

Both faces are SIL Open Font Licence 1.1, which permits self-hosting but requires the licence to travel with the files. Commit `public/fonts/OFL.txt`.

`font-display: swap` guarantees a fallback-to-webfont repaint, and neither face shares metrics with its fallback &mdash; so swap on its own is incompatible with §10's zero-layout-shift criterion. Declare a metric-matched fallback face behind each real one, using `size-adjust`, `ascent-override`, `descent-override` and `line-gap-override` derived from the actual font tables, and put it second in the stack:

```css
font-family: "Archivo", "Archivo Fallback", Helvetica, Arial, sans-serif;
```

Derive the overrides from the downloaded fonts rather than copying values from a blog post, and record how they were derived in the README.

Scale, letter-spacing, line-height and `font-stretch` values are all in the prototype stylesheet. Copy them across.

### Layout

- Content max-width `1180px`, gutter `clamp(20px, 5vw, 64px)`.
- Prose measure `64ch`. Leads `30ch`. Do not let body copy run wider.
- Left-aligned throughout. No centred text blocks.
- Band rhythm: `clamp(56px, 7vw, 104px)` vertical, alternating paper / paper-dim / ink.

### Motifs

1. **Measurement rule** — `repeating-linear-gradient` tick marks with a 1px baseline. Used as section separators and in short form as a heading underline. This is the signature device.
2. **Highlighter** — `linear-gradient` background sized to `0.62em` from the baseline, applied to evidenced claims only.
3. **Tick markers** — 9px horizontal hairline in `--brand` as list markers. No bullets, no icons, no numbers except where content is genuinely sequential (the Define / Measure / Articulate stages, and the engagement steps).

   Earlier drafts said `--mark-deep` here, contradicting the colour paragraph above, which gives list markers to pacific blue. Pacific blue wins: it is what the prototype ships and what the one-job-per-colour rule says. Aquamarine stays the evidence colour.

### Motion

One orchestrated moment: the highlighter sweep on the home hero, 750ms, 500ms delay, once on load. Nothing else.

`prefers-reduced-motion: reduce` must render the swept state immediately with no animation. This is already implemented in the prototype — keep it.

**Do not add** scroll-triggered reveals, fade-up-on-enter, parallax, counters, or hover transforms on cards. If a section looks static, that is the design.

---

## 6. Copy

All copy is final and lives in `reference/prototype.html`. Move it into `src/data/*.ts` as typed objects. Rules:

- **Do not rewrite, shorten, expand, or "tighten" any sentence** on your own initiative. Copy is the client's deliverable and has been through review. Sam directs changes to it; this brief does not.
- **The value of value.** Added 12 Sep 2026, from a colleague's note. delv sells the case for doing the work, not only the work: the proof is the asset, and the narrative, the science communications and research, the value propositions, the tools, the content and the training are all built from it. The argument sits in the Articulate stage on What we do, where the outputs already live, phrased as "you are not buying a report, you are buying the asset everything else is built from".
- **Knowing where the number has to land.** Same note. The capability being sold is not only the number but the understanding of how the NHS, and health systems elsewhere, actually buy: who signs a business case off, at what level, and how the same argument has to be rebuilt for another system. It appears in the Home "side of the table" section, as a named differentiator on Who we are, and in the "Who do you usually work with?" answer. **Deliberately not claimed: proven success.** The colleague's note mentioned it, but the proof slots are still empty, and asserting a track record the site cannot evidence is the precise failure the site exists to argue against. It goes in when there is a result to put behind it (§13.9).
- **Metrics over narrative.** Added at Sam's request, 12 Sep 2026. Procurement scores what it can count and investors discount what they cannot check, so the copy says so: a nice-to-have and a warm quote from a delighted clinician do not win a budget line, and minutes, money and metrics do. The line lands on Home in the "Anyone can report the what" band, in the Measure pillar, in the Measure stage on What we do, and in the first of the three moments on For startups. Keep that voice in anything new.
- Preserve UK spelling throughout (organisation, prioritise, recognise).
- Preserve typographic characters: `&rsquo;` for apostrophes, `&middot;` in meta strings.
- **No em dashes anywhere.** Sam's instruction, 12 Sep 2026, and it overrides the prototype. Recast each one rather than swapping in a hyphen: a colon where it introduces a list or an elaboration, a comma where it is parenthetical, a full stop where the clauses stand alone. `&middot;` is the separator in page titles. The rendered site is checked for `\u2014` on every build.
- Flag, don't fix: if you spot a typo or factual inconsistency, list it in the PR description rather than silently editing.

Placeholders in the prototype that need replacing before launch — leave them in place and list them in the README:

- `hello@delv.health` — email address unconfirmed
- Registered company number, place of registration and registered office address
- Privacy notice content
- The `Privacy` footer link currently has no href (in production it points at `/privacy`; the page content is the placeholder)

---

## 7. Section inventory

Build these as components and compose the pages from content files.

**Home** — hero (H1 strapline + lede + two CTAs) → claim demo (what/why, captioned "Illustrative") → tick rule → dark band "Anyone can report the what" → "Sound familiar?" six-item problem list → dim band with three pillars → **results band** → "We have been on your side of the table" split → **quote band** → dark CTA band.

**What we do** — hero → tick rule → three alternating bands (Define / Measure / Articulate), each a split with stage label, H2, lede and a detail list → dark band "We will tell you when a claim does not hold."

**For startups** — hero → "Three moments when founders call us" stage list → dim band with three stage-of-company pillars → "What you end up with" detail list plus the `Note` callout → **results band** → **quote band** → dark CTA band ending on the Value Audit.

**How we work** — hero → four-step engagement stage list → dim band with the three-up offer grid (Value Audit / Project / Embedded) → "Six tests" split → dim band Q&A (six items) → **quote band** → dark CTA band.

**Who we are** — hero → two-column bios with portrait slots → dim band "What makes us different" (four items) → "A small core, and a wider bench" split, followed by **the bench list** → **quote band** → dark CTA band.

**Contact** — hero → split with the form on the left and "What happens next" plus the deadline note on the right.

### Placeholder content

Three things are structurally built and empty: the proof results, the client
quotes, and the wider bench on Who we are. All of it renders nothing while
empty, and `PLACEHOLDER_PREVIEW=1` fills it with entries marked
&ldquo;Sample&rdquo; and &ldquo;Placeholder Name&rdquo; so the design can be
reviewed. The flag lives in `src/data/preview.ts`.

Vercel preview deployments turn it on by themselves, via `VERCEL_ENV`, so every
branch preview shows the placeholders in place with nothing to configure.
Production never does unless the variable is set there deliberately.

The rule for all three: never write sample content a reader could mistake for
a real client or a real colleague. A placeholder testimonial or a placeholder
person on a live site is indistinguishable from a fabricated one to everybody
reading it.

#### Imagery

Added at Sam's request, 12 Sep 2026: the prototype carried no pictures at all
and reads text-heavy. `Figure.astro` renders an image slot sized from an aspect
ratio, so a real photograph dropped in later shifts nothing on the page.

Until a photograph exists each slot renders the **brief for the picture that
belongs there**, not a grey rectangle: what to shoot, how to frame it, what to
avoid. An empty box reads as a broken image; a brief reads as a commission.
Six slots are placed, one or two a page, defined in each page's data file
alongside its copy: two founder portraits at 4:5 on Who we are plus a working
shot, a procurement scene on Home, a value model artefact on What we do, the
deliverables on For startups, and a working session on How we work.

Setting `src` and `alt` on a slot turns it into the image, in the same space.

### Proof and quotes

Added after the prototype, at Sam's request, against §13.6. Two components and
one data file, `src/data/proof.ts`, holding a registry of anonymised results, a
registry of client quotes, and a map of which page shows which.

**The registries ship empty and the components render nothing when they are**,
so no proof band or quote band appears until there is something true to put in
it. This is not a stub waiting to be finished: a consultancy arguing that
unevidenced claims do not survive a buyer cannot publish invented ones, and
placeholder testimonials on a live site are indistinguishable from fabricated
ones to everyone reading it. `PROOF_PREVIEW=1` fills both registries with
entries marked &ldquo;Sample&rdquo; and &ldquo;Placeholder Name&rdquo; so the
design can be reviewed; they exist only when that variable is set.

A result is a figure, the client at whatever level of anonymity they agreed to,
what the work was, and the basis. The figure carries the highlighter, which on
this site means an evidenced claim &mdash; so the basis is required, not
optional. It is the line that earns the highlighter.

No `Review` or `AggregateRating` markup accompanies any of this. §9 already
rules it out, and self-serving review markup on your own domain is against
Google's structured data guidelines independently of that.

#### The wider bench

`bench.people` in `src/data/who-we-are.ts`, rendered by `Bench.astro` under the
&ldquo;A small core, and a wider bench&rdquo; split, in the `stage-row` pattern
rather than as full bios. Specialists brought in per engagement go here &mdash;
the health economist and the statistician that section's own copy already names
&mdash; as distinct from the two co-founders, who stay in `people`.

`name` is optional; a member without one is headed by their discipline. That
covers both a specialist who will not be named and a seat that is not filled,
without either becoming a fictional person.

Placeholders for a health economist and a product leader are set up in preview.
Promoting one to the core team means writing them into `people` and removing
them from `bench.people` &mdash; but note that the section promises a *small*
core and every bio is currently titled Co-founder, so a third full bio implies
a standing that may not be intended.

---

## 8. Contact form

Fields: name (required), company, email (required, valid), stage (select: Pre-seed or seed / Series A / Series B or later / Established business / Investor), message (required).

The stage select needs a non-selectable placeholder option as its default. The prototype defaults to &ldquo;Pre-seed or seed&rdquo;, so anyone who skips the field is silently recorded as pre-seed &mdash; worse than leaving it blank. The field itself stays optional.

Use a real `<form>` element. The prototype is a `<div>` with a `type="button"`, which is why it has no Enter-to-submit and no native validation, and why a submission without JavaScript goes nowhere.

Behaviour:

1. Client-side validation on submit. Inline errors against each field, in the interface's voice — say what is missing and how to fix it. No apologies, no red banner at the top. Tie each error to its field with `aria-describedby` and set `aria-invalid`, and move focus to the first field that failed.
2. POST to `/api/contact`, a Vercel serverless function, with a honeypot field checked server-side.
3. On success, replace the form with a confirmation that repeats what happens next and the reply window (two working days).
4. On failure, keep the user's input and offer the `mailto:` fallback with the message pre-filled — the prototype's `mailto:` composer is the model for this.
5. No CAPTCHA unless spam becomes a real problem.
6. Render the status region on every page load and toggle its text, not its `display`. The prototype's `.status` is `display:none` until it has a message, which takes it out of the accessibility tree at the moment the message arrives and makes the announcement unreliable.
7. The error colour is `#9B2C1E`. It is in the prototype but not in the §5 palette; treat it as an eighth job for an eighth colour and add it to the token list as `--error`.

The endpoint picks no vendor. It validates, then forwards the enquiry as JSON to whatever `CONTACT_WEBHOOK_URL` is set to &mdash; an email relay, Zapier, Make, a Google Apps Script, a Slack webhook. Until that variable is set the form does not deliver **and says so**: with JavaScript the visitor gets the `mailto:` composer carrying everything they typed, without it they land on `/could-not-send`. Nothing a visitor writes is lost on any path, which is what makes it safe to deploy ahead of the webhook.

Two extra routes exist only as redirect targets for a submission made without JavaScript: `/thank-you` and `/could-not-send`. Both are `noindex` and excluded from the sitemap. A validation failure redirects back to `/contact` rather than to `/could-not-send`, because telling someone the failure was ours when it was a missing field is its own small dishonesty.

Ask Sam before pointing `CONTACT_WEBHOOK_URL` at HubSpot. If he wants it, the pattern is store-then-forward rather than a direct post, so a CRM outage never loses an enquiry.

---

## 9. Legal, SEO and metadata

- **UK trading disclosures.** A limited company must show its registered name, company number, place of registration and registered office address on its website. Put these in the footer legal strip. The site cannot go live without them.
- Per-page `<title>` and `meta description`. Descriptions are yours to write — one sentence, under 155 characters, no keyword stuffing.
- Open Graph and Twitter card tags on every page, with a static OG image per page in `public/og/`, 1200&times;630 PNG. Build the OG images in the site's own visual language: ink background, `delv.` logotype, page heading in Archivo, the tick rule. Do not generate them at request time — render them once with a committed script and commit the output, so a deploy never depends on a headless browser being available.
- `sitemap.xml` via `@astrojs/sitemap`, and a `robots.txt` that allows everything and points at the sitemap.
- JSON-LD `Organization` schema on the home page: name, url, logo, description, `sameAs` for LinkedIn once it exists. No `Review` or `AggregateRating` markup — there is nothing to base it on.
- Canonical URLs on every page.
- Set `<html lang="en-GB">`.

---

## 10. Acceptance criteria

The build is done when all of the following are true:

Two defects in the prototype's own CSS were found during the port and fixed;
they are recorded here so they are not reintroduced.

- `nav.main a` outweighs `.btn` on specificity, so the header's "Start a
  conversation" button renders graphite on ink (1.96:1), and ink on ink —
  invisible — on `/contact`, where `aria-current` lands on it. The nav colour
  rules are scoped `:not(.btn)`.
- `.claim-tick` on the first claim row is `color-mix(in srgb, var(--taupe)
  62%, var(--ink))`, which is 4.0:1 at 12px semibold. It is 52% in the build,
  which is 4.75:1 and keeps the taupe cast.

**Accessibility**
- Keyboard-navigable end to end, with a visible focus ring on every interactive element: 2px `--ink`, 3px offset, and `--mark` on deep bands. This applies to form fields too. The prototype suppresses the outline on inputs in favour of a 28%-opacity pacific glow, which is 1.3:1 against the page and fails SC 1.4.11 — the ring is not optional there. Keep the glow if you like, underneath the ring.
- Non-text contrast (SC 1.4.11): focus indicators and the boundary of every form control meet 3:1 against what is adjacent to them. This is the criterion the prototype misses most often, and Axe will not catch it — check it by hand.
- The skip link's target carries `tabindex="-1"` so focus actually lands on `<main>`.
- Working skip link.
- Every page has exactly one `h1` and no skipped heading levels.
- Body text meets WCAG AA (4.5:1), including the de-emphasised claim line in the hero. That line is **not** large text: it is `clamp(19px, 1.4vw + 12px, 27px)` at weight 350, so it only clears the 24px large-text threshold above roughly an 860px viewport, and on every phone it is normal text needing 4.5:1. The prototype's `#8E7E79` on `#F7F7F3` is 3.3:1, and 2.5:1 where the taupe wash sits behind it. Ship `#6B5F5A` with the wash at 30%, per §5. Do not lighten it back.
- Form inputs have real `<label>` elements, and errors are announced via `role="status"` or `aria-live`.
- Axe DevTools reports zero violations. Automate this rather than checking it once: `@axe-core/cli` against the built output, wired into `npm run check`, so the criterion stays true as the site changes. A clean Axe run is a floor, not a pass — the contrast and focus items above are outside what it detects.

**Performance**
- Lighthouse ≥ 95 on performance, accessibility, best practices and SEO, mobile profile.
- Zero layout shift from font loading.
- Total JS under 10kb across the site. If a page needs none, it ships none.

**Responsive**
- Works from 320px up. Check 320, 375, 768, 1024, 1440.
- Mobile nav: the prototype's toggle pattern, `aria-expanded` maintained, closes on Escape with focus returned to the toggle. Real page navigation replaces the prototype's close-on-route-change.
- No horizontal scroll at any width.

**Cross-browser** — current Safari, Chrome, Firefox, plus iOS Safari. Check `backdrop-filter` on the sticky header degrades acceptably.

---

## 11. Build sequence

Work in order and commit at each checkpoint. Push a preview deploy at step 4 for review before styling detail work.

1. Scaffold Astro, install deps, set up the repo structure, self-host the fonts and derive the fallback metric overrides.
2. Port `global.css` — tokens, type scale, band rhythm, rule and highlighter motifs.
3. Build `Base.astro`, `Header.astro`, `Footer.astro`, and the route shells with real paths.
4. Move all copy into `src/data/*.ts` and render the six pages. **Checkpoint: preview deploy for Sam.**
5. Build the remaining components and match the prototype's spacing and hairlines precisely.
6. Contact form, validation, success and failure states.
7. Metadata, OG images, sitemap, robots, JSON-LD, 404 and privacy shell.
8. Accessibility and Lighthouse passes; fix to the criteria in §10. Apply the three prototype corrections in §5 and §8 (weak claim colour, form control boundaries, focus rings on fields) as you go, not at the end.
9. README: how to run it, where copy lives, how to change a page, what is still a placeholder, deploy process.

---

## 12. Out of scope

Blog, case study templates, gated downloads, newsletter signup, client portal, multilingual, dark mode toggle, CMS, ROI calculator embed.

Several of these are likely in phase two. Structure the CSS and components so a `/insights` index and article template could be added without touching the design system, but do not build them now.

---

## 13. Open decisions for Sam

Not blockers for starting, but all are blockers for launch.

1. **Domain.** `delv.health` is used as the placeholder. `delv.co.uk` and `delv.com` were unavailable at last check.
2. **Brand punctuation.** Settled. A wordmark was supplied on 12 Sep 2026: `delv` in a high-contrast serif with the terminal full stop as an aquamarine dot. It is in `public/brand/`, inlined by `Logo.astro` for the header and footer, and carried through the favicon, the touch icon and all seven OG cards. The `.delv.` and `:delv:` variants are dead.
3. **Company details** for the trading disclosures strip.
4. **Email address** for the footer and the `mailto:` fallback.
5. **Where enquiries go.** `CONTACT_WEBHOOK_URL` in the Vercel project. Until it is set the form cannot deliver; it fails honestly rather than silently, but no enquiry reaches an inbox.
6. **Privacy notice** text, and whether analytics goes in at launch.
7. **Placeholders on production.** `SHOW_PLACEHOLDERS_ON_PRODUCTION` in `src/data/preview.ts` is `true`, so the live site serves sample results, sample quotes and placeholder colleagues. Sam asked for this on 12 Sep 2026 while the site is on a test domain with no traffic. **Set it back to `false` before launch.**
8. **Photography.** Six image slots are placed and none has a picture in it. Each carries its own brief. Until they are shot the site shows the briefs.
9. **Proof.** The slots are built (§7) and empty. Sam is filling them at a later stage. For a consultancy selling evidence this remains the largest gap, and it is now a content decision rather than a build one: one anonymised result with its basis attached, and one quote, would change the conversion profile of the whole site. Until then four bands across four pages do not render at all.
10. **A price anchor** on the Value Audit. Startups screen on cost, and "fixed fee" without a from-price does not clear that screen.
