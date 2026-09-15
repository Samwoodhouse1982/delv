# delv.

The marketing site for DELV Consulting Ltd, trading as `delv.`

Six content pages plus a privacy shell and a 404, built with Astro and plain
CSS. No framework, no CMS, no client-side router. The whole site ships about
3kb of JavaScript, and most pages ship 0.5kb of it.

`delv-build-brief.md` is the specification. `reference/prototype.html` is the
approved single-file prototype it was ported from: it is the design and copy
source of truth and is not edited.

---


## Getting back to a working site

The growth-narrative work starts from `e83773f`, pinned as the branch
`origin/pre-growth-narrative`. **REVERT.md** has the three routes back and
which one to use when. Read it before rolling anything back rather than
improvising a force-push.

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
overflow. `npm run check:preview` does the same against a build with the proof
and quote slots filled, which a normal build leaves empty. Both need a
Chromium:

```
npx playwright install chromium
```

or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to one you already have.

A clean axe run is a floor, not a pass. Axe does not reliably detect
SC 1.4.11, focus indicators and form control boundaries, which is precisely
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
| `src/data/proof.ts` | results and quotes, and which pages show them |

Strings are rendered with `set:html`, so they keep their typographic
characters (`&rsquo;`, `&middot;`, `&ldquo;`) and must stay HTML-safe. A bare
`<` or `&` will break the page.

**No em dashes.** Not in copy, not in page titles. Recast rather than
substituting a hyphen: a colon where it introduces a list or an elaboration, a
comma where it is parenthetical, a full stop where the clauses stand alone.
`&middot;` separates the parts of a page title.

**Two positioning arguments** run through the copy and anything new should
carry them. First, the value of value: the proof is the asset, and the
narrative, the research, the value propositions, the tools, the content and the
training are all built from it, so the client is not buying a report. Second,
knowing where the number has to land: the capability is not only the figure but
how the NHS and other health systems actually buy it. Neither claims a track
record; that waits on real proof.

**Metrics over narrative** is the voice. Procurement scores what it can count
and investors discount what they cannot check, so the copy says so. Keep that
in anything new: a number with a stated basis, not three paragraphs working up
to one.

Each page file also exports a `meta` object with the `<title>`, the meta
description and the OG card. Change a heading and the OG card no longer
matches: re-run `npm run og` and commit the PNGs.

### Changing a page

1. Edit the relevant `src/data/*.ts`.
2. `npm run build && npm run a11y`.
3. If a heading changed, `npm run og` and commit `public/og/*.png`.

### Brand

`public/brand/` holds the two supplied files: `delv-logo.svg`, the wordmark,
and `delv-icon.svg`, the square mark.

The wordmark is **inlined** by `src/components/Logo.astro` rather than loaded
as an `<img>`, for one reason: the supplied file paints the letterforms in
`--ink`, which is invisible on the site's deep bands. Inline, they take
`currentColor`, so one file serves the header in ink and the footer in white
with no second file to keep in step. To change the mark, replace the paths in
that component and in `public/brand/`.

The dot reads from `--logo-dot`, defaulting to the aquamarine in the supplied
file. It is faint on paper at header size, around 1.3:1. That is legitimate:
SC 1.4.3 and 1.4.11 both exempt logotypes, and it is the designer's choice.
If it ever reads too quiet, `--logo-dot: var(--mark-deep)` is the one-line
change, and that is what the rest of the site uses for aquamarine on light.

`public/favicon.svg` is a copy of the icon. `favicon.ico` and
`apple-touch-icon.png` are rasterised from it by `npm run icons`, and the OG
cards inline the wordmark, so `npm run og` follows any change to it. Edit the
brand file, re-run both, commit the output.

**Two corrections to the supplied files**, both worth knowing if a new version
arrives. The icon's white square was `x="1" width="200"` inside a `0 0 200 200`
viewBox, so it sat one unit right of the frame and overflowed the right edge,
leaving a transparent stripe down the left. It is squared to the viewBox here.
And the wordmark is ink-only, with no light variant supplied, which is what the
inlining solves.

Adding a section means a component in `src/components/` and a block in the
page file. The components are deliberately thin: they take content and render
the prototype's markup, and hold no copy of their own.

---

## Imagery

`Figure.astro` renders an image slot sized from an aspect ratio, so dropping a
real photograph in later shifts nothing on the page.

**No slot has a picture in it yet.** Until one does, each renders the brief for
the photograph that belongs there: what to shoot, how to frame it, what to
avoid. That is deliberate. An empty grey box reads as a broken image; a brief
reads as a commission, and whoever takes the photograph can see what it is for
and what shape it has to be.

Six slots, defined in each page's data file next to its copy:

| Page | Slot | Ratio |
| --- | --- | --- |
| `/` | Procurement scene, in the "side of the table" split | 3:2 |
| `/what-we-do` | A value model artefact, closing the Measure stage | 16:9 |
| `/for-startups` | The deliverables as objects | 3:2 |
| `/how-we-work` | A working session with a client team | 16:9 |
| `/who-we-are` | Two founder portraits | 4:5 |
| `/who-we-are` | The founders working, by the bench section | 16:9 |

To fill one, set `src` (a path under `public/`) and `alt` on the figure in its
data file. It becomes the image in the same space. Portraits are capped at
240px wide by the stylesheet: a headshot at full column width is 600px of face
before the reader reaches a word of the bio.

---

## Placeholder content

Three things are structurally built but have no real content yet: the proof
results, the client quotes, and the wider bench on `/who-we-are`. Every
component renders nothing when its data is empty, so a section with no content
does not appear at all rather than leaving a gap.

The registries themselves are empty. Nothing invented is committed as real
content: a consultancy whose argument is that unevidenced claims do not
survive contact with a buyer cannot ship invented ones of its own, and a
placeholder testimonial or a placeholder colleague is indistinguishable from a
fabricated one to everybody reading it. What is committed is clearly marked
sample content, shown only where a flag says to show it.

**Production currently shows the placeholders too.** That is
`SHOW_PLACEHOLDERS_ON_PRODUCTION` in `src/data/preview.ts`, set `true` at
Sam's request while the site is on a test domain with no traffic. **Set it back
to `false` before launch** or real visitors will see sample results, sample
quotes and placeholder colleagues.

Preview deployments show them either way, via `VERCEL_ENV`, with nothing to
configure in the Vercel dashboard.

Locally:

```
npm run dev:preview      # or: build:preview, check:preview
```

`PLACEHOLDER_PREVIEW=1` fills all three with entries marked "Sample" and
"Placeholder Name"; `PLACEHOLDER_PREVIEW=0` forces them off even on a preview
deployment. Setting the variable explicitly always wins over `VERCEL_ENV`, so
production only ever shows placeholders if someone deliberately sets it
there.

### Proof and quotes

`src/data/proof.ts` holds two registries, anonymised `results` and client
`quotes`, plus a `placement` map saying which page shows which. **Both
registries of real content are empty**, and the components render nothing when
they are, so a band with nothing in it does not appear.

To publish real proof, add entries to `published` / `publishedQuotes` in
`src/data/proof.ts` and list their ids under the right page in `placement`.
Ids that do not resolve are ignored, so withdrawing a result is a one-line
change rather than a broken build.

Where they appear:

| Page | Results | Quote |
| --- | --- | --- |
| `/` | 3-up band after the pillars | dim band before the CTA |
| `/for-startups` | 3-up band before the CTA | dim band before the CTA |
| `/how-we-work` | none | band before the CTA |
| `/who-we-are` | none | dim band before the CTA |

A `Result` is a figure, the client at whatever level of anonymity they agreed
to, what the work was, and the basis. **The basis is not optional.** The
figure gets the highlighter, which on this site means an evidenced claim, and
the basis is the line that earns it.

Check the slots render correctly before publishing content into them:

```
npm run check:preview
```

which builds with the sample entries and runs the full axe pass over them.

One thing not to add: `Review` or `AggregateRating` JSON-LD. §9 of the brief
rules it out, and self-serving review markup on your own site is against
Google's structured data guidelines regardless of what the brief says.

### The wider bench

`bench.people` in `src/data/who-we-are.ts`, rendered under "A small core, and
a wider bench" on `/who-we-are` by `Bench.astro`. This is where specialists
brought in per engagement go: the health economist and the statistician the
section's own copy already names, as distinct from the two co-founders above,
whose bios stay in `people`.

A `BenchMember` is `{ name?, role, body }`. **`name` is optional**, and that is
the useful part: a specialist who has not agreed to be named, or a seat you
have not filled, is listed by discipline alone. The row is then headed by the
role instead, which is honest and still tells a buyer the capability is there.

Two placeholders are set up, health economics and product. Moving
either into the core team is a matter of writing them into `people` as a
`Person` with `role: 'Co-founder'` or whatever is accurate, and deleting them
from `bench.people`. Worth thinking about before you do: the section's copy
promises a *small* core, and the bios are all currently titled Co-founder, so
a third full bio implies something about standing that may not be true.

---

## Design system

`src/styles/global.css` is the whole of it, ported from the prototype. Tokens
at the top, then base, layout, motifs, header, content blocks, form, footer.

Three things to know before changing it:

**The dot is the background graphic.** The brand mark is a full stop, so
oversized discs and rings, cropped by the band edge, sit behind the content.
`overflow: clip` on each band means one wider than the viewport can never
scroll the page sideways, and every tint is capped where text stays legible
if a line runs across it.

**Coral (`--coral`, #FF5E5B) is for those graphics and nothing else.** It is
2.79:1 on paper, so it fails as text *and* fails the 3:1 floor for a marker or
a focus ring. It cannot be a tick, a rule or a button. It is also kept off
Contact, where `--error` lives: two warm reds side by side, one decorative and
one meaning "you got that wrong", is a signal worth protecting. Use
`--coral-deep` if it has to be text. Fill it on light grounds and stroke it on
dark ones, because a translucent coral fill over ink composites to plum.

**Every colour has one job.** Yale blue carries structure. Pacific blue is
structural detail only and never text, because it does not meet contrast at
body size. Aquamarine is the evidence colour. Rosy taupe marks the unevidenced
claim in the home hero and appears nowhere else. `--error` is for validation
messages. The one-job rule is what keeps the palette legible; spreading a
colour is how it stops meaning anything.

**Motion is opt-in twice over.** Everything except the claim demo lives inside
`prefers-reduced-motion: no-preference` *and* behind a `data-motion` attribute
that the script in `Base.astro` only sets when that query passes and the
browser has an `IntersectionObserver`. No JavaScript, an old browser, or
reduced motion each get the finished page. Nothing is ever waiting on an
animation to become visible, and nothing animates a property that affects
layout, so none of it can cost a layout shift.

`npm run a11y` runs with reduced motion forced on for the same reason: with
reveals active, anything below the fold sits at opacity 0 and drops out of
axe's contrast checks.

What moves: blocks fade and rise as they scroll in, three-ups reveal column by
column, section rules draw from the left. Hover is colour only, plus a nav
underline that grows and list tick marks that extend a few pixels. Parallax,
counters and hover transforms that move a block stay out.

**The intro** is a separate thing again: a 5.5s brand animation that plays
once per session on first entry, ported from
`reference/design_handoff_delv_intro/` (its README has the timing table and
the geometry). `Intro.astro` is the vanilla port of the handoff's React
component, to the same numbers. Everything visible is a pure function of
elapsed seconds; there is no state but the clock.

Two things about it are worth knowing before you touch it.

*The gate runs in the document head*, as a blocking inline script in
`Base.astro`, not in the component. It has to: deciding later means a
returning visitor gets a frame of the overlay before it is taken away. It sets
`data-intro="play"` on `<html>`, which is also what unhides the overlay and
locks body scroll. Because that attribute locks scroll, the same script arms
an 8-second timeout to remove it, so a module script that never arrives cannot
leave the page stuck.

*The letters are measured against the real font, never a fallback.* The
component holds them at `visibility: hidden` until `document.fonts.load` for
EB Garamond 600 resolves, because a fallback first frame gives different
advance widths and every letter jumps when the real face swaps in. The face is
preloaded in the head, ahead of the gate script, so this resolves from cache.

`sessionStorage` means the intro replays in a new tab, which is what
`sessionStorage` is. Swap it for `localStorage` if you want once-ever.

**The hero has its own sequence**, the claim demo. Three beats over
about two seconds, once on load: the activity claim is struck through, the
evidenced claim rises in, the highlighter sweeps the number. Nothing else on
the site moves.

Each beat rests in its **finished** state and animates *from* the start, using
`animation-fill-mode: backwards`. Animate towards the end state instead and a
browser that runs no animation shows an unstruck claim with no highlight,
which is the story half-told. Under `prefers-reduced-motion: reduce` all three
are switched off and the finished comparison renders immediately. Scroll-triggered
reveals, fade-ups, counters and hover transforms are all out of scope by
decision, not by omission.

**Four colour values deviate from the prototype**, each because the
prototype's value failed WCAG. They are commented `Correction` in the
stylesheet and recorded in §5, §8 and §10 of the brief: `--claim-weak`,
the taupe wash at 30%, `--hair-strong` on form controls, and the first
`.claim-tick` at 52%. Do not revert them.

### Fonts

Three variable faces, all self-hosted from `public/fonts/` so there is no
third-party request: **EB Garamond Semibold** for headings, **Archivo** for
nav, buttons, labels and captions, **Newsreader** for body prose.

EB Garamond replaced Archivo on headings so they sit with the serif wordmark.
Three values had to move with it, because the old ones were tuned for a
grotesque: the size scale is up about 12% (EB Garamond's x-height is 0.40em
against Archivo's 0.526em, so the same px size reads much smaller), tracking
relaxed from -0.022em to -0.008em, and leading from 1.06 to 1.12 because EB
Garamond's extenders span 1.3em and collide at the tighter setting. There is
no `font-stretch`: EB Garamond has a weight axis only.

Archivo is deliberately **not** preloaded. It sets 14.5px nav links and
buttons, its fallback is metric-matched so nothing shifts when it arrives, and
a third preload would put 90kb in front of the LCP. Each real face is shadowed by a
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

`src/components/ContactForm.astro` posts to `api/contact.js`, a Vercel
serverless function. Vercel has no equivalent of Netlify Forms, so this is
the form backend.

**It deliberately picks no vendor.** The function validates the enquiry and
forwards it as JSON to whatever `CONTACT_WEBHOOK_URL` points at: an email
relay, Zapier, Make, a Google Apps Script, HubSpot, a Slack webhook. Set that
one variable in the Vercel project and the form works. `CONTACT_WEBHOOK_TOKEN`
is optional and is sent as a bearer token if present.

**Until that variable is set the form does not deliver**, and says so rather
than pretending. With JavaScript the visitor gets the `mailto:` composer with
everything they typed already in it; without, they land on `/could-not-send`,
which gives them the email address. Nothing the visitor wrote is lost on any
path. That is what makes it safe to deploy before the webhook exists.

With JavaScript the form validates inline, tying each message to its field
with `aria-describedby`, setting `aria-invalid`, and moving focus to the first
field that failed. It then posts in the background and swaps itself for the
confirmation panel, so nobody submits twice.

Without JavaScript it submits natively, native constraint validation does the
checking, and the function redirects: `/thank-you` on success, `/contact` on a
validation failure the browser should have caught, `/could-not-send` when the
failure is ours. Both pages are `noindex` and out of the sitemap.

The status region is rendered on every page load and only its text changes.
Do not make it `display: none` when empty. An element outside the
accessibility tree does not announce when a message arrives in it.

**Before pointing `CONTACT_WEBHOOK_URL` at HubSpot, ask Sam.** The pattern, if
he wants it, is store-then-forward rather than a direct post, so a CRM outage
cannot lose an enquiry.

---

## Deployment

Vercel, building from `main`, with preview deployments per branch.
`vercel.json` holds the configuration:

```
npm ci --omit=dev   →   npm run build   →   dist/
```

`--omit=dev` matters: without it Vercel installs Playwright on every build and
downloads a Chromium nobody uses. Playwright is only needed for `npm run og`,
`npm run icons` and `npm run a11y`, all of which run locally.

`vercel.json` also carries the cache and security headers, `trailingSlash:
false` and `cleanUrls`.

**On page URLs.** Astro builds with its default directory format, so a page is
`what-we-do/index.html` and every static host resolves `/what-we-do` to it
without being told. Do not switch to `build.format: 'file'`. That writes a flat
`what-we-do.html`, which Vercel only serves at `/what-we-do` when `cleanUrls`
is set, so deleting one line of `vercel.json` 404s every page on the site.
That is not hypothetical: it is what the first preview deploy of this branch
did.

Environment variables to set in the Vercel project:

| Variable | Purpose |
| --- | --- |
| `CONTACT_WEBHOOK_URL` | Where enquiries go. Until it is set, the form tells visitors it could not send. |
| `CONTACT_WEBHOOK_TOKEN` | Optional. Sent as `Authorization: Bearer` if present. |

Moving host again means revisiting two things: `vercel.json`, and
`api/contact.js`, which uses the Vercel Node function signature.

---

## Still a placeholder

The working list is **`FIX-LATER.md`** in the repo root: every outstanding
item, grouped, with the file to change against each one. It is the list to
tick off.

This section used to duplicate it and had already drifted, so it now points at
it instead. The reasoning behind each decision, and the options where there is
a real choice, is in §13 and §13a of `delv-build-brief.md`.

Three of them are one-line changes that will otherwise ship as they are:
`SHOW_PLACEHOLDERS_ON_PRODUCTION` in `src/data/preview.ts`,
`REPLAY_EVERY_VISIT` in `src/layouts/Base.astro`, and `CONTACT_WEBHOOK_URL` in
the Vercel project.

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
