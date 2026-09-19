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
  reference/design_handoff_delv_intro/     # the 5.5s intro handoff, as delivered
  reference/design_handoff_delv_graphics/  # the six section graphics, as delivered
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
      Figure.astro                # image slot, or the brief for the picture
      Intro.astro                 # the 5.5s opening animation
      graphics/                   # the six section graphics, see §5
        Distillation.astro        # 01, home hero
        Absorption.astro          # 02, home "the what / the why" band
        StageMark.astro           # 03, one shape per pillar
        Restatement.astro         # 04, What we do, Articulate
        EngagementFlow.astro      # 05, How we work
        Mark.astro                # 06, the vocabulary at list size
    lib/scatter.ts                # the two deterministic mark fields, build time
    data/
      home.ts  what-we-do.ts  how-we-work.ts  who-we-are.ts  contact.ts
      for-startups.ts  scale-ups.ts  enterprise.ts   # the Who we help group
      site.ts                     # nav, footer, company details, email, strapline
      proof.ts                    # results and quotes registries, and placement
      preview.ts                  # the PLACEHOLDER_PREVIEW flag, shared
    pages/
      index.astro
      what-we-do.astro
      for-startups.astro
      scale-ups.astro
      enterprise.astro
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
| `/` | Home | delv. · Prove the value. Prove your why. |
| `/what-we-do` | Approach (Define / Measure / Articulate) | What we do — delv. |
| `/for-startups` | Startups | For startups — delv. |
| `/scale-ups` | Scale-ups | Scale-ups · delv. |
| `/enterprise` | Enterprise | Enterprise · delv. |
| `/how-we-work` | How we work | How we work — delv. |
| `/who-we-are` | Who we are | Who we are — delv. |
| `/contact` | Contact | Start a conversation — delv. |
| `/privacy` | Privacy notice | Privacy — delv. |
| `/404` | Not found | — |
| `/thank-you` | Form success, no-JavaScript redirect target | Thank you — delv. |
| `/could-not-send` | Form failure, no-JavaScript redirect target | That did not send — delv. |

Nav labels are the prototype's, plus a Home link added 12 Sep 2026 at Sam's request. Note the prototype's internal routes were `/approach` and `/startups`; the public URLs are `/what-we-do` and `/for-startups` to match the labels. Page files, data files and component props all use the public names. The prototype was never published, so no redirects from the old hash routes are needed.

**Restructured 13 Sep 2026** for the audience group: Home &middot; What we do &middot; **Who we help** &middot; How we work &middot; Who we are &middot; [Start a conversation].

"Who we help" is a group, not a page. It has no landing route and does not need one, so it is a disclosure button and a panel rather than an anchor: a parent link that goes nowhere is the usual way this pattern fails a keyboard user. Each child carries a one-line descriptor.

| Child | Descriptor | Route |
| --- | --- | --- |
| Startups | Traction, and no proof yet | `/for-startups` |
| Scale-ups | Live deployments, scattered evidence | `/scale-ups` |
| Enterprise | Multiple markets, multiple versions | `/enterprise` |

The startups **label** becomes "Startups" so it reads as a sibling; the **slug** stays `/for-startups`, with no rename and no redirect.

On the desktop bar the panel floats and hover opens it, with `aria-expanded` set by the same handler so what a screen reader is told and what is on screen never disagree. Hover peeks and a click holds it open: with a plain toggle, a pointer user hovers, sees it open, clicks the thing they are pointing at and it shuts in their face. Inside the mobile menu it is an accordion in the flow. `hidden` is the closed state in the markup, so a page whose script never runs shows the button with nothing under it rather than a panel that cannot be closed, and the footer carries the same three links for exactly that case.

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
--teal:         #157276;  /* structural labels: stage names, timings, roles, offer meta */
--paper-mint:   #E7F7F1;  /* third band ground */
--coral:        #FF5E5B;  /* background graphics only — see below */
--coral-deep:   #A15057;  /* the same hue where it has to be text */
--error:        #9B2C1E;  /* form validation messages, and nothing else */
```

**Every colour has one job.** Yale blue carries structure: body text, deep bands, primary buttons, focus rings. Pacific blue is structural detail only — list markers, hairline ticks, form focus — never text, because it does not meet contrast at body size. Aquamarine is the evidence colour: the highlighter, the logotype full stop, the active nav underline, the footer strapline, buttons on deep bands. Rosy taupe has exactly one use, the unevidenced claim in the home hero, and must not spread anywhere else. `--error` likewise has exactly one use, form validation messages.

Nothing in this palette is yellow. Earlier drafts of this brief described the `Note` callout rule and the focus ring on deep bands as yellow; both are aquamarine &mdash; `--mark-deep` on light backgrounds, `--mark` on deep ones.

`--mark-deep` exists because aquamarine at full strength fails contrast on light backgrounds. Use `--mark` on deep bands and `--mark-deep` on light ones.

`--hair-strong` exists because WCAG 2.2 SC 1.4.11 requires 3:1 for the boundary of a user interface component. `--hair` on white is 1.35:1, so a form field drawn with it has no perceptible edge. `--hair-strong` is 3.3:1 on white and 3.1:1 on paper. Use it for `input`, `textarea` and `select` borders **only**. Every other rule on the site stays `--hair`.

One further correction to the prototype: `.claim-text.weak` is `#8E7E79`, which is 3.3:1 on paper and 2.5:1 where the taupe wash sits behind it. Both fail, and the line is below the large-text threshold on any viewport under about 860px. Use **`#6B5F5A`** for the weak claim text and take the taupe wash from 38% down to **30%**. That gives 5.7:1 on paper and 4.6:1 over the wash, and keeps the device intact. See §10.

**Colour, added 12 Sep 2026.** The site read as too austere, so three tokens joined the palette and each has a job like the rest.

`--teal` carries the small structural labels: stage names, timings, roles, offer meta. It is aquamarine deepened 30% towards ink, which is the point at which it still reads as teal and clears 4.5:1 on paper (5.28), paper-dim (4.75) and paper-mint (5.13). `--mark-deep` was tried first and rejected: it is 4.28 on paper-dim, so it stays a marker colour and never becomes text.

`--paper-mint` is a third band ground, so the rhythm is not only linen and ink.

`--coral` is **background graphics only, and that is a limit rather than a preference.** At full strength it is 2.79:1 on paper, 2.51 on paper-dim, 2.71 on mint. That fails text at 4.5:1 and it also fails the 3:1 floor for a marker, a rule or a focus ring, so it cannot be a tick or a button. White on coral is 3.0 and ink on coral 3.95, so it cannot carry a button label either. It is also kept off Contact: `--error` lives there, and two warm reds a few centimetres apart, one decorative and one meaning &ldquo;you have made a mistake&rdquo;, is a signal worth protecting. Text that wants to be coral uses `--coral-deep`.

Coral is **filled on light grounds and outlined on deep ones.** A translucent coral fill over ink composites to plum and reads as a stain; a stroke keeps the hue because it is not asked to carry a tint.

**The dot.** The brand mark is a full stop, so the full stop is the background graphic: oversized discs and rings, cropped by the band edge, always behind the content. Two rules keep them safe. `overflow: clip` on the band means a graphic wider than the viewport can never scroll the page sideways. And every tint is capped where text stays legible if a line runs across it, so a dot can sit under a paragraph without quietly costing contrast.

**No decorative gradients.** The palette was supplied with gradient variants; they are not used and should not be introduced. Flat colour and hairlines are the system. The two `linear-gradient` declarations that build the measurement rule and the highlighter are structural motifs, not decoration &mdash; they stay.

### Type

- **EB Garamond** (variable, weight 400&ndash;800, set at 600) &mdash; headings. Added 12 Sep 2026 at Sam's request, replacing Archivo there so the headings sit with the serif wordmark supplied the same day. The scale, tracking and leading all moved with it; see the comment above the heading rules in `global.css` for why and by how much.
- **Archivo** (variable, width 88&ndash;112, weight 400&ndash;700) &mdash; nav, buttons, labels, form fields, captions.
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

### Section graphics

Added 12 Sep 2026 from a second design handoff, kept as delivered at
`reference/design_handoff_delv_graphics/`. Six graphics, marked high fidelity:
colours, geometry and timing are final.

They are **conceptual, not evidential**. No figures, no axes, nothing a reader
could mistake for a result. All six are built from one small vocabulary, and it
is the vocabulary the copy already uses: a field of taupe marks is
undifferentiated activity, a ring is a claim, a scale laid across it is
measurement, one filled aquamarine point is the thing worth counting.

| # | Graphic | Where it sits | Motion |
| --- | --- | --- | --- |
| 01 | Distillation | **Removed 15 Sep 2026.** See below | |
| 02 | Same ink, one form | Home, the "warm fuzzy feelings" band | 9s loop, script-driven |
| 03 | Define / Measure / Articulate | Home, one shape per pillar | Draws once on reveal |
| 04 | One finding, more than one job | What we do, Articulate | 11s loop |
| 05 | The engagement, drawing itself | How we work, the engagement band | 11s loop |
| 06 | Repeating marks | The three offers, and each stage on What we do | Static |

The handoff's palette is the site's palette exactly: linen, yale blue, rosy
taupe, pacific blue, aquamarine. Nothing new was added for them.

Three rules hold the set together, and the first is the handoff's own:

1. **`cqw`, not `px`.** Every band that holds a graphic is a size container and
   every mark, ring and disc inside it is sized in `cqw`. This is structural.
   The design width is 1180px, so `1cqw` is 11.8px at full size and any value
   taken from a mock is that value over 11.8. Sizing the focal points in fixed
   px inside a fluid band breaks below about 700px, where the band hits its
   height floor and stops shrinking vertically while the focal points do not.
2. **The resting state is the finished state.** The animation is additive and
   gated behind `data-motion` like everything else in the Motion section below.
   Reduced motion, no JavaScript, or a browser without container query units
   all get the argument in one static frame. Nothing here ever waits to appear.
3. **Decorative, and marked as such.** They restate the copy beside them; they
   do not add to it. All six are `aria-hidden` and out of the tab order.

Three deliberate divergences from the handoff, each for a stated reason:

- Graphic 01 moved behind the illustrative claim on 13 Sep 2026 and was
  removed on 15 Sep, when that block became a typed sequence. Both were Sam's
  calls and both were right. Under the comparison the field was a second
  telling of the same argument; behind it, it was the substrate the argument
  stood on; and once the words themselves started moving it became a second
  thing moving behind them, competing with the beat it was there to support.
  Its ringed point survives as the sequence's last beat. The handoff bundle
  stays in `reference/`, and §7b records what the field cost while it was
  there, because the contrast ceiling it forced is the reason two of the
  block's colours are the values they are.
- Graphic 02 is placed on the "warm fuzzy feelings" band rather than
  next to the Before / After device. Its own two labels are *the what* and *the
  why*, which is that band's argument word for word — more so since the copy of
  18 Sep 2026, which says "it's the “what”, not the “why”" outright — and it
  wants a yale blue ground, which that band already has. Putting a second full band inside the
  hero, under the claim demo and graphic 01, was too much in one screen.
- Graphic 03 draws once as its pillar arrives and then stays drawn, instead of
  looping on a shared 9s cycle. The loop is right for a specimen band standing
  on its own. Split across three columns of body copy it leaves the third
  pillar with an empty box above its heading for five seconds out of every
  nine, and that reads as a picture that failed to load, not as a stage waiting
  its turn. As a reveal it is the same gesture the measurement rule already
  makes.
- Graphic 03's scale is drawn with `stroke-dashoffset` rather than wiped in by
  animating `width` on a wrapper. Same window, same easing; `width` is a layout
  property and the rule below rules it out.

### Motion

One orchestrated moment: the claim demo in the home hero, about two seconds, once on load. Three beats, extended from the prototype's single sweep at Sam's request on 12 Sep 2026 to show the shift from the old claim to the new one. The activity claim is struck through, the evidenced claim rises in behind it, then the highlighter sweeps the number.

**Laid out in two columns from 13 Sep 2026**, at Sam's request: before on the left, after on the right, with the dashed rule that used to separate the rows now separating the columns. The comparison is the point of the block and two columns put both halves in one glance. Below 700px they stack again. The type comes down from a 27px ceiling to 23px, because each claim now has half the width; that also takes the line permanently below the large-text threshold, which simplifies its contrast requirement rather than complicating it (see §10).

**Rebuilt as five beats, 15 Sep 2026**, at Sam's request, and the whole thing
is inverted from how it used to work.

The sequence is now about the words: the activity claim types itself out, two
strokes cross it through, the evidenced claim rises in beside it, the
highlighter sweeps the number, and the mark lands. About four and a half
seconds. The page's argument is that one of those two sentences is worth
writing down, so watching one get written and struck and the other arrive
intact is the argument rather than a decoration of it.

It used to run at page load from `backwards` fill, so the resting state fell
out of the animation not running. It now runs on scroll into view, which
typing makes necessary: four and a half seconds that start before a reader has
arrived is four and a half seconds nobody sees. So the markup is the finished
state, always, and the script adds `data-claim-armed` to take it apart only
once it has established it can put it back. No JavaScript, no
`IntersectionObserver`, reduced motion, or a script that throws: every one of
them leaves the attribute off and the finished comparison on screen.

Only the typing needs JavaScript, because the claim wraps and a `steps()`
width animation only works on one unwrapped line. It costs 462 bytes gzipped.
The other four beats are CSS keyed off one class.

The script also waits for the intro overlay, which replaces the rule that used
to pause the beats behind it: the block is inside the viewport while the
overlay is over it, so intersection alone would play the whole sequence to a
covered screen.

**The stage deliverables open, from 19 Sep 2026**, at Sam's request, and this
is the only thing on the site a reader operates rather than watches.

The three lists on What we do run to four, six and eight items one under
another, which on a phone was a wall of wrapping lines nobody scans. Each row
is now a `<details>`: the deliverable is the label, the qualifier opens
underneath. Native, so it needs no JavaScript, is a button to the keyboard,
is announced as expanded or collapsed without any ARIA to get wrong, and is
opened by the browser's own find-in-page when a match is inside a closed row.
Checked: it opens by tap and by Enter.

**Open above 800px, closed below**, which is where `.split` stacks. Above it
the list sits in a column beside the stage heading with room to spare and
there is nothing to gain by hiding eight lines; below it the column is the
whole width and the list is the wall this replaced. Sam's call, 19 Sep 2026,
over collapsing everywhere.

The rows are open in the markup and an inline script closes them, never the
other way round, and the two are not equivalent: whatever happens to the
script, the state it fails into is everything visible. Checked with JavaScript
disabled — 18 of 18 open at both widths, and the control still toggles. The
script sits directly after the list so it runs while the parser is still
there: measured across the first 40 frames the page ever renders, the row is
its closed height on every one of them, so nothing expands and collapses.

It runs once. Crossing 800px afterwards, by resizing or by turning a phone,
leaves the rows alone: someone who has opened four of them has said something
about what they want to read. Checked: three open at 1280, still three after
a resize to 390.

Two things it needed that a bullet does not. The row's padding moved from the
list item onto the summary, because the summary is the control and padding
outside it is dead: measured before the move, a 25px target inside a 47px row.
And the plus is graphite rather than the brand teal the tick beside it uses —
the tick is decoration and may sit at 2.93:1, but the plus is the only thing
telling a sighted reader the row opens, which is a UI component indicator
under SC 1.4.11 and has a 3:1 floor. Graphite measures 5.05:1.

The open is animated with `interpolate-size` and `::details-content`, which is
what makes a height of `auto` a reachable endpoint; `interpolate-size` is set
on the element rather than `:root`, because it is inherited and would
otherwise change what every `auto` on the site can animate to. Measured: 13
distinct heights across the open with motion allowed, one under reduced
motion. A browser without either feature still opens the row, instantly.

`DetailList` is untouched and still renders plain bullets for the `details`
block type on the other pages. Those are short lists with nothing to hide.

Nothing else on the site moves except the section graphics above and the logo
dot below.

### The logo dot

**Added 15 Sep 2026, at Sam’s request.** The full stop in the header mark
contracts to half size while its own edge expands away as a hairline ring,
holds, and comes back. One second, twice: once as a page lands, and again on
hover or keyboard focus of the logo link. The same point-and-ring vocabulary as
the shapes behind the claim demo.

It runs on **arrival, not on departure**, and that is the whole design. Every
link here is a full page load, so an animation started on click is cut off
wherever the next page happens to paint: under 150ms on a warm cache, seconds
on a cold connection, and the dot caught at an arbitrary frame. Running it as
the new header lands is the same event from the reader’s side and is the same
length every time. Cross-document view transitions would allow the real thing,
and were rejected: the CSS-only form reaches Chromium and recent Safari only,
and Astro’s `ClientRouter` would turn full loads into swaps, which the intro
gate, the claim demo’s observer, the nav disclosure and focus handling are all
built around. A flourish is not worth re-testing the motion system.

Back and forward restore from bfcache rather than re-parsing, so it does not
replay on those. Deliberate: a logo that moves on the back button feels fussy.

The ring is a `<circle>` in `Logo.astro`, concentric with the dot path and at
`opacity: 0` at rest, so the resting mark is declared rather than falling out
of an animation not running. Only the header animates it; the footer carries
the same markup, inert. Two details worth keeping:

- **`vector-effect="non-scaling-stroke"` makes stroke-width screen pixels**,
  outside the transform chain and outside the viewBox’s 0.2px-per-unit scale.
  At the 5 units a hairline would normally need, the ring rendered as a solid
  aquamarine blob. It is 1.2.
- **`overflow: visible` on the mark.** The dot very nearly touches the right
  and bottom edges of the cropped viewBox, and browsers set `overflow: hidden`
  on the root `svg`, so the open ring was clipped. The element’s own box is
  unchanged, so nothing moves on the page.

The dot contracts to half rather than to a pinpoint. Smaller reads better as a
diagram and worse as a wordmark: at a third, the full stop stops being a full
stop for the length of the hold.

`prefers-reduced-motion: reduce` must render the finished state immediately with no animation at all. Verified at 250ms under reduced motion: the block is never armed, the claim is never split into characters, and the strike, the rise, the sweep and the mark all read as complete.

Four traps were hit rebuilding this, all recorded in §10 because every one of them is the sort that a typecheck, a build and an axe run all pass.

**Reversed 12 Sep 2026, at Sam's request:** scroll reveals are now in. Blocks fade and rise as they enter, three-ups reveal column by column, and the measurement rules draw from the left rather than rising, because a ruler being laid down is the right gesture for the device. Hover is limited to colour, a nav underline that grows from the left, and the list tick marks extending a few pixels. **Still out:** parallax, counters, and hover transforms that move a block.

Every one of these is gated twice: inside `prefers-reduced-motion: no-preference`, and behind a `data-motion` attribute the script only sets when both that query passes and the browser has an `IntersectionObserver`. No JavaScript, an old browser, or reduced motion each get the finished page. **Nothing on the site is ever waiting on an animation to become visible**, and nothing animates a property that affects layout, so none of it can cost a layout shift.

---

## 6. Copy

All copy is final and lives in `reference/prototype.html`. Move it into `src/data/*.ts` as typed objects. Rules:

- **Do not rewrite, shorten, expand, or "tighten" any sentence** on your own initiative. Copy is the client's deliverable and has been through review. Sam directs changes to it; this brief does not.
- **The value of value.** Added 12 Sep 2026, from a colleague's note. delv sells the case for doing the work, not only the work: the proof is the asset, and the narrative, the science communications and research, the value propositions, the tools, the content and the training are all built from it. The argument sits in the Articulate stage on What we do, where the outputs already live, phrased as "you are not buying a report, you are buying the asset everything else is built from". Since 18 Sep 2026 that stage names science communications outright, as strategy plus support with research proposals, papers and journal submissions.
- **Knowing where the number has to land.** Same note. The capability being sold is not only the number but the understanding of how the NHS, and health systems elsewhere, actually buy: who signs a business case off, at what level, and how the same argument has to be rebuilt for another system. It appears as a named differentiator on Who we are and in the "Who do you usually work with?" answer. (It was in the Home "side of the table" section too, until Sam's copy edit of 18 Sep 2026 replaced both of that block's paragraphs; Home now introduces the founders rather than the buying knowledge, and the argument is carried on the two pages above.) **Deliberately not claimed: proven success.** The colleague's note mentioned it, but the proof slots are still empty, and asserting a track record the site cannot evidence is the precise failure the site exists to argue against. It goes in when there is a result to put behind it (§13.9).
- **Metrics over narrative.** Added at Sam's request, 12 Sep 2026. Procurement scores what it can count and investors discount what they cannot check, so the copy says so: a nice-to-have and a warm quote from a delighted clinician do not win a budget line, and minutes, money and metrics do. The line lands on Home in the "warm fuzzy feelings" band, in the Measure stage on What we do, and in the first of the three moments on For startups. Keep that voice in anything new. (It was in the Home Measure pillar too, as "one number with a stated basis beats three paragraphs of narrative", until Sam's copy edit of 18 Sep 2026 gave that pillar the standardised-approach argument instead. The principle is unchanged; it is carried in three places now rather than four.)
- Preserve UK spelling throughout (organisation, prioritise, recognise).
- Preserve typographic characters: `&rsquo;` for apostrophes, `&middot;` in meta strings.
- **No em dashes anywhere.** Sam's instruction, 12 Sep 2026, and it overrides the prototype. Recast each one rather than swapping in a hyphen: a colon where it introduces a list or an elaboration, a comma where it is parenthetical, a full stop where the clauses stand alone. `&middot;` is the separator in page titles. The rendered site is checked for `\u2014` on every build.
- Flag, don't fix: if you spot a typo or factual inconsistency, list it in the PR description rather than silently editing.
- **The brand line is "Prove the value. Prove your why."** Two sentences, not a comma splice. Sam settled it on 15 Sep 2026, after it went to "your why" on 13 Sep and briefly to "the why" on 15 Sep off the back of a copy edit. **"Your why" is the version. Do not change it back on the strength of a document.** It sets the home `h1`, the home `<title>`, `site.strapline` in the footer of every page, and the home OG card, and the headline's measured fit constant moves with it every time (§5). The `.delv.` and comma-joined variants are dead.
- **"Minutes, money and metrics do." is kept, once.** Sam confirmed on 13 Sep 2026 that he wants the line. It ran on Home and on Startups; the 15 Sep edit pass cut the Startups instance, so it is now a single line on Home rather than a refrain. Do not cut the last one.
- **The library is not a proper noun.** "Value Library" was capitalised as a product name; it is now "a claims and evidence library", lower case, everywhere. A capitalised noun naming an artefact reads as something you license, and delv. sells the work rather than the thing. The engagement names stay capitalised, because Value Audit, Value Model Build and Claims and Evidence Review are pieces of work. `/for-startups` keeps the shorter "claims library", which is the same artefact under a shorter descriptive name.
- **Copy amends pass, 13 Sep 2026.** A site-wide pass against a separate amends brief, applied to `src/data/*.ts` only. It removed every QMS reference, took the software vocabulary out of the Enterprise deliverables (engine, variants, maintained system, "without a consultant"), and cut the site's most-repeated rhetorical move, the "X, not Y" contrastive negation, from 25 instances to 7. Copy is now materially ahead of `reference/prototype.html`: 34% of substantial strings still match it verbatim, and the two newest pages share none of it. **The prototype is no longer the copy source of truth**, only the design one, and §13.15 tracks the decision to retire it as a copy reference.

Placeholders in the prototype that need replacing before launch — leave them in place and list them in the README:

- `hello@delv.health` — email address unconfirmed
- Registered company number, place of registration and registered office address
- Privacy notice content
- The `Privacy` footer link currently has no href (in production it points at `/privacy`; the page content is the placeholder)

---

## 7. Section inventory

Build these as components and compose the pages from content files.

**Home** — hero (H1 strapline + lede + two CTAs) → claim demo (Before / After, captioned "Illustrative") → tick rule → dark band "Move on from warm fuzzy feelings" → "Sound familiar?" six-item problem list → dim band with three pillars → **results band** → "We have been on your side of the table" split → **quote band** → dark CTA band.

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
Ten slots are placed, one to three a page, defined in each page's data file
alongside its copy: two founder portraits at 4:5 on Who we are plus a working
shot, a procurement scene on Home, a value model artefact on What we do, the
deliverables on Startups, a working session on How we work, and on the two new
audience pages a value model beside a printed business case, a claims record
beside a bid response, and the claims and evidence library in use.

Setting `src` and `alt` on a slot turns it into the image, in the same space.

The section graphics added on 12 Sep 2026 do **not** stand in for any of these
six. The handoff says so explicitly and it is right: those pages argue from
first-hand experience, and abstract marks where a photograph belongs would work
against that. All six slots stay open.

### The intro

A 5.5-second brand animation, added 12 Sep 2026 from a design handoff kept at
`reference/design_handoff_delv_intro/`. The phrase **deliver value.** types
itself in, the letters that are not part of the logo drop away, the survivors
slide together into **delv.**, and the camera dives into the aquamarine full
stop until it fills the frame.

The handoff is marked high fidelity: colours, type, timing and easing are
final and reproduced exactly. It ships a React component; the site is Astro,
so `Intro.astro` is the same piece in vanilla, to the same numbers.

Three behaviours matter more than the animation itself.

**It plays once per session.** The gate is a blocking script in the document
head, not in the component, because deciding any later means a returning
visitor sees a frame of the overlay before it is removed. `sessionStorage`
means it replays in a new tab; `localStorage` would make it once-ever.

**Suspended 13 Sep 2026 at Sam's request** while the site was on a test domain
with no traffic, and **restored 18 Sep 2026**, also at his: `REPLAY_EVERY_VISIT`
in that head script is `false` again, and the animation plays once a session.
It was always only the one boolean — `Intro.astro` recorded the visit on every
play throughout — so nothing else moved in either direction. Checked on the
way back: the first load of a session plays, the next page does not, a new
session plays again, and a repeat load leaves no overlay in the DOM and no
scroll lock on the body. Reduced motion is deliberately outside the flag:
skipping the overlay there is an accessibility guarantee, not a preference
about how often to show a brand animation.

**Reduced motion skips it entirely.** The overlay is never rendered at all,
rather than rendered and hurried.

**The letters are measured against the real EB Garamond**, never a fallback.
They stay hidden until `document.fonts.load` resolves, because a fallback
first frame gives different advance widths and the letters visibly jump when
the real face arrives. The face is preloaded ahead of the gate script.

The overlay is `aria-hidden`, has no focusable children, and any key or click
ends it early. That last is not in the handoff: 5.5 seconds is a long time to
hold someone who arrived to read something.

**Portrait gets its own stage and two lines.** Added 18 Sep 2026, on Sam's
report that it did not sit well on a phone, and he was being generous. The
handoff composes on a fixed 1600x900 stage scaled to cover the viewport, and
cover takes whichever axis needs more: on a 390x844 phone that is the height,
scaling by 0.94 and putting the 801px phrase on screen at 751px inside 390px
of viewport. The reader saw **iver val** &mdash; no d, no full stop, no logo,
in a piece whose entire subject is a phrase condensing into one. A tablet held
upright cropped it the same way, so the switch is the viewport's aspect ratio
rather than a width breakpoint.

Portrait composes on 900x1600 with **deliver** over **value.**, and the merge
gains a vertical component: the two lines close as the letters slide together,
so **delv.** lands on one line exactly as it always did. Everything else &mdash;
timing, easing, colour, the dive &mdash; is untouched, and the landscape
rendering is unchanged to within frame-timing noise (measured: mean pixel
difference 0.05&ndash;0.8 of 255 against 0.0&ndash;0.6 between two runs of the
same build).

Making it possible meant giving up half-flow, half-transform positioning. Each
letter used to take its place in the line from flex layout and move from there
by transform, which cannot express two lines becoming one. Positions are now
computed outright, which the script was already equipped for since it measures
every advance width with canvas. The two are provably identical on one line,
for every character and every frame: the old expression reduces to the new one
algebraically, and the screenshots agree.

`npm run intro` lays the overlay out at eighteen viewport shapes and fails if
any visible letter is off screen. It exists because nothing else could have
caught this: axe is clean (the overlay is `aria-hidden` and carries no
content), the overflow check is clean (`position: fixed` inside
`overflow: hidden` clips rather than scrolls), and the page diff is clean (the
markup never changed). Run against the old code it fails all ten portrait
shapes and passes all eight landscape ones.

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

## 7b. The illustrative claim, and what a field behind text costs

Merged 13 Sep 2026 at Sam's request: the distillation graphic was a band under
the claim, and is now the field behind it, one section. The layout question was
easy. The contrast question was not, and it is written down here because the
numbers are what constrain any future change to this block.

**Text sitting on a scatter has to clear 4.5:1 against a mark at full
strength.** Not against the average, and not against the ground between marks.
A mark can land under any glyph at some viewport width, and there is no honest
way to promise otherwise when the text reflows and the field does not.

Measured, `#CC998D` over `#F7F7F3`:

| Mark alpha | Weak line `#6B5F5A` | Caption `#4E6675` | Before label at 52% | at 40% |
| --- | --- | --- | --- | --- |
| 0.26 | 4.71:1 | 4.61:1 | 3.90:1 | 4.76:1 |
| 0.30 | 4.57:1 | 4.47:1 | 3.78:1 | 4.61:1 |
| 0.78 | 3.05:1 | 2.99:1 | 2.53:1 | 3.08:1 |

So the ceiling is **0.26**, in `OPACITY_CEILING` in `src/lib/scatter.ts`, and
the field gets its weight from the number of marks rather than the darkness of
them. Two things had to move before even 0.26 was available:

1. **The weak line's flat 30% taupe wash is gone.** Two taupe layers compound.
   With the wash in place, no mark alpha at all clears 4.5:1 behind that line:
   0.10 already lands at 4.32:1. The wash was standing in for exactly what the
   field now does, so this is a device replaced rather than removed. The strike
   itself is untouched, and it is still the animated beat.
2. **The Before label went from 52% to 40% taupe-in-ink**, per the table above.

Two further rules follow from the merge and should not be quietly relaxed:

- **The right fifth belongs to the resolution mark.** `.claim-pair` is capped
  at `max-width: 78%` above 900px, and below that the mark drops into a
  reserved band along the bottom. It is a layout reservation, not a padding
  value that happens to be big enough today, and it is asserted at ten
  viewport widths against every rendered line box in the block.
- **The field is sized in em against a font-size of `1cqw`,** which is the same
  number the other graphics write directly in cqw but with a floor under it.
  Pure cqw is right for a band. Here the block is 335px wide on a phone, where
  1cqw is 3.35px and a mark comes out as two pixels of 26% taupe.

---

## 7a. The Who we help group

Added 13 Sep 2026 from a separate brief. Three audience pages under one nav
parent. `/for-startups` already existed and was edited, not rebuilt.

### The spine that keeps them distinct

Three pages about evidence is the point at which overlap becomes the main risk.
The thing that stops them collapsing is that each leans on a different one of
the three stages.

| Page | Dominant stage | The problem in one line | Entry offer |
| --- | --- | --- | --- |
| Startups | **Define** | The evidence does not exist yet | Value Audit |
| Scale-ups | **Measure** | The evidence exists in the data and nobody has gone to get it | Value Model Build |
| Enterprise | **Articulate** | The evidence exists several times over and none of the versions agree | Claims and Evidence Review |

Hold that line. If a section on one page could be lifted onto another without
anyone noticing, it is written at the wrong level and should be cut rather than
reworded. Same for the entry offers: one per page, no sharing. Checked
mechanically at build time as well as by eye, and the only block of copy the
three pages share is the site-wide footer blurb.

### The two artefacts

The entry offers are engagements. These two are what clients remember buying,
and both are named on the pages so a reader can see there is something concrete
at the end.

**The claims and evidence library.** One place holding every claim the business makes,
versioned and sourced, with the evidence attached, an owner against each entry,
and usage rules saying where it can be used. Built to sit alongside a QMS.
Offered on all three pages and sized very differently: a startup gets a working
spreadsheet, an enterprise gets a governed system with review cycles and market
variants. It is the headline deliverable on Enterprise and gets a band of its
own there.

It is now the product name, so `/what-we-do` and the symptom assessment proof
card were brought into line. `/for-startups` still says "claims library" in two
places and that is accepted rather than a reason to reopen a page the brief
says not to touch.

**ROI calculators.** On all three pages and a different tool each time, because
this is the likeliest place for the pages to start repeating themselves.

| Page | Shape | Built from |
| --- | --- | --- |
| Startups | Short public web tool | A modelled scenario with visible assumptions |
| Scale-ups | Sales-led, walked through live | Your real deployment data |
| Enterprise | One method across every market | The library, with a version per market |

### What changed on the pages that already existed

- **Startups.** Two changes only, both forced by the siblings arriving rather
  than by preference: the nav label, and a single "More on this" link under the
  "Series B and scale" card, which now describes work with its own page. Copy
  untouched.
- **How we work.** "Three ways to work with us" became **Where to start** (the
  three entry offers, one per audience page, each linking to it) and **Where it
  goes next** (Project and Embedded). Five undifferentiated cards read as a
  menu; this reads as a path.
- **Contact.** The stage select mirrors the nav exactly: Startup, Scale-up,
  Enterprise, Investor. The previous list mixed funding stages with company
  types, so a Series A scale-up and an established enterprise could each
  plausibly pick two different options.

### Deliberately out of scope

Investors are the fourth segment in the 101 overview: portfolio value audits,
value due diligence, backing the right horse. They stay off all three pages. A
different buyer with a different purchase, and folding them in would dilute
whichever page took them. Still §13.11.

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
  62%, var(--ink))`, which is 4.0:1 at 12px semibold. It went to 52% in the
  build, 4.75:1, and to 40% on 13 Sep 2026 once a mark could sit behind it:
  52% is only 3.90:1 against one, 40% is 4.76:1.

Two more were found on 12 Sep 2026, both in the build's own CSS rather than
the prototype's, and both recorded for the same reason.

- **A bare `1fr` grid track is a trap.** Every single-column stack under
  `max-width: 800px` used `grid-template-columns: 1fr`, which floors the track
  at its content's min-content size. A box with an `aspect-ratio` and a
  `min-height` reports a min-content *width* of the two multiplied together, so
  one section graphic in a column silently widened the whole column to 833px at
  phone width, with only the band's `overflow: clip` hiding it. Every track is
  now `minmax(0, 1fr)`, which is what the desktop tracks already used.
- **`.figure { margin: 0 }` beat the `.mt-*` utilities.** Same specificity,
  later in the file, so every `<Figure class="mt-block">` on the site was
  rendering flush against whatever sat above it. The reset now sets
  `margin-block-end` and `margin-inline` and leaves `margin-top` to the
  utility.

Three more on 13 Sep 2026, all of them specificity, all of them silent.

- **`.gfx` beat `.claim-field`.** Equal specificity and declared later in the
  file, so the field layer took `position: relative` and `width: 100%`,
  collapsed to zero height because every child is absolute, and clipped itself
  away. It is `.claim .claim-field` now.
- **`.claim-field .claim-resolve` beat the reduced-motion override.** The
  override was one class short, so it never applied, and the blanket
  `animation-duration: 0.01ms !important` does not help because it does not
  touch the delay. A reader with reduced motion got 1.35s of empty space and
  then a mark appearing. Both overrides now match the specificity of the rule
  they are overriding.
- **The same rule beat the `[data-intro="play"]` pause**, so the fourth beat
  would have played out behind the intro overlay.

None of the three would have shown up in a typecheck, a build or an axe run.
The reduced-motion one was found by asserting the resting state in a browser,
which is the only thing that does find them.

Four more on 15 Sep 2026, rebuilding the claim demo as a typed sequence. Same
character: everything compiled, everything rendered, everything passed axe.

- **`.claim-text.weak span` matched every character span** the typewriter
  creates, so each letter took 0.12em of padding and its own copy of both
  strike strokes. The sentence rendered 58% too wide with a line through every
  glyph. The selector is `.claim-strike` now, which also puts it below the
  rules that arm the sequence instead of above them.
- **Substituting U+00A0 for spaces removed every line-break opportunity.** It
  was there to stop the caret jumping back at a collapsed end-of-line space.
  The claim then ran in one line straight through the column rule and under
  the claim beside it. A caret in the wrong place for one 31ms frame is much
  the cheaper problem.
- **Removing `data-claim-armed` when typing finished** dropped the four rules
  that had not run yet and snapped the block to its finished state three
  seconds early. The attribute stays for good now; every animation carries
  `forwards`, and a filled final frame outranks the declaration it overrides.
- **`claimResolve` declared only a `from`.** The implicit `to` takes the
  element's own computed value, which while armed is `opacity: 0`, so the mark
  spent its whole animation going from nothing to nothing and never appeared.
  Both ends are written out now, with `var(--o, 1)` because the three elements
  land on three different opacities.

And one that was not a bug yet but would have become one: the general
`[data-motion] .gfx-ring--breathe` rule was left in place alongside the
sequence's own. A browser keeps an animation's start time when only the rule
around it changes, so the loop's clock began when `data-motion` landed rather
than when the sequence did, and its 4.15s delay was measured from page load. On
any page where the reader took longer than that to scroll down, the ring was
already on screen while everything around it was still armed.

**The worked example**
- The home page's illustrative claim is the site's own evidenced claim, so its arithmetic has to survive a reader doing it. The two lines shared a denominator and the caption showed the working: 15,000 consultations a week at two minutes each is 500 clinician hours a week, at one trust. Settled 13 Sep 2026, after the previous pair (4,000 clinicians platform-wide against 92 working days a month at one trust) turned out not to reconcile on any basis, and to invite exactly the multiplication that exposes it.
- **Superseded 18 Sep 2026, on Sam's copy edit.** The pair is now "15,000 downloads since launch" against "Saved 2 minutes per consultation, releasing 500 clinician hours every week". The two lines no longer share a unit or a period: downloads since launch cannot produce hours per week, so 500 is asserted rather than shown. That is a deliberate change of register — Before and After as two kinds of claim, not one claim worked through — and it is recorded here because it reverses a rule this file had settled twice. The caption field is optional now, in the schema and in the editor, because for a few hours that day there was nothing for it to say.
- **The "Illustrative" note is back, same day, at Sam's request**, reading "Illustrative figures, not a client result." It no longer shows any working, because there is no longer any working to show; what it does is stop a reader taking the After line for a delv result, which is the risk that grew when the arithmetic went. Keep it. If the figures are ever made to reconcile again, the note stays anyway and the working goes back in front of it.
- Reinstating it needed one layout change. The caption is the last thing in the block, and below 900px the resolution mark leaves the right-hand strip and drops into a reserved band along the bottom, which is where the caption now is. So the caption takes the same reservation the columns take: 78% at width, 72% narrow, both derived from the rings' 11.19cqw at their centre rather than guessed. Measured against rendered pixels at seven widths from 1600 to 360: nothing is painted behind the caption at any of them, and it is 5.62:1 on bare paper.

**Accessibility**
- Keyboard-navigable end to end, with a visible focus ring on every interactive element: 2px `--ink`, 3px offset, and `--mark` on deep bands. This applies to form fields too. The prototype suppresses the outline on inputs in favour of a 28%-opacity pacific glow, which is 1.3:1 against the page and fails SC 1.4.11 — the ring is not optional there. Keep the glow if you like, underneath the ring.
- Non-text contrast (SC 1.4.11): focus indicators and the boundary of every form control meet 3:1 against what is adjacent to them. This is the criterion the prototype misses most often, and Axe will not catch it — check it by hand.
- The skip link's target carries `tabindex="-1"` so focus actually lands on `<main>`.
- Working skip link.
- Every page has exactly one `h1` and no skipped heading levels.
- Body text meets WCAG AA (4.5:1), including the de-emphasised claim line in the hero. That line is **never** large text: since the two-column layout of 13 Sep 2026 it is `clamp(18px, 0.85vw + 12.5px, 23px)` at weight 350, so it needs 4.5:1 at every viewport, with no threshold to reason about. The prototype's `#8E7E79` on `#F7F7F3` is 3.3:1. `#6B5F5A` is 5.73:1 on bare paper and 4.71:1 against a field mark at the 0.26 ceiling. Do not lighten it back, and do not put a second taupe layer under it: see §7b.
- The claim block is checked against **rendered pixels**, not only against the token maths. `scripts/` has no runner for this yet; it was done by hiding the glyphs, screenshotting the block, and taking the darkest pixel actually painted behind every line box. Lowest measured: 4.60:1. Redo it if the field, the ceiling or any of those four colours changes.
- Form inputs have real `<label>` elements, and errors are announced via `role="status"` or `aria-live`.
- Axe DevTools reports zero violations. Automate this rather than checking it once: `@axe-core/cli` against the built output, wired into `npm run check`, so the criterion stays true as the site changes. A clean Axe run is a floor, not a pass — the contrast and focus items above are outside what it detects.

**Performance**
- Lighthouse ≥ 95 on performance, accessibility, best practices and SEO, mobile profile.
- Zero layout shift from font loading.
- Total JS under 10kb across the site. If a page needs none, it ships none.
  Measured 12 Sep 2026, gzipped: 3.8kb on Home, which carries the intro, the
  reveal observer and graphic 02's absorption script; 4.1kb on Contact; 2.9kb
  everywhere else. The section graphics are otherwise pure CSS, and both mark
  fields are generated in component frontmatter at build time from a fixed
  seed, so the field is identical on every build and none of the generator
  reaches the browser.

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

## 12a. Checked against the business plan

`delv. 101 overview` was reviewed against the built site on 12 Sep 2026. The
site carries the plan's spine faithfully: the Define / Measure / Articulate
pillars and their sub-lists, the space between the economists and the
optimists, the six pain points, the four-step engagement, the six tests, both
bios, the pricing model, the VBA and trust answers, and the QMS integration.
Three small additions were made where the site had narrowed the plan: the
regulatory and quality dimension of the first pain point, and the investor use
of the Value Audit, both in the offer card and in the answer to who we work
with.

Four things in the plan are **deliberately not on the site**, and each is a
decision rather than an oversight.

1. **Two of the four audience segments.** The plan writes full Define /
   Measure / Articulate propositions for Startups, SMBs, Large Corporations
   and Investors. §1 of this brief scopes the site to founders and commercial
   leads at funded startups and scale-ups, plus a smaller investor audience,
   so SMB and enterprise have no page. Investors now appear in two places
   rather than one, but still have no page of their own.
2. **The Value Incubator.** A named offer in the plan, twice. The site's three
   ways to work are Value Audit, Project and Embedded; Embedded is the closest
   but is not the same thing and is not named that way.
3. **The Value Due Diligence Framework.** The plan's investor-facing method.
   Not on the site at all.
4. **The value flywheel.** The plan calls for a graphic and uses the word four
   times. The site expresses the idea once, as &ldquo;a repeatable flow so
   evidence keeps refreshing instead of ageing in a slide&rdquo;, and has an
   empty image slot on What we do that would take the diagram. Graphic 05 on
   How we work is adjacent but not the same thing: it argues that the work
   keeps running after we leave, by carrying its line off the right edge. It is
   a line, not a loop, and it is not a substitute for the flywheel.

Smaller omissions, all judged not worth the words: press releases, landing
pages and sales decks from the deliverables list, and named partner
organisations such as OHE.

**Where the site deliberately departs from the plan.** The voice is harder.
The plan is a conventional consultancy document; the site says it will tell
you when a claim does not hold, that it does not do fundraising theatre, and
that if the honest answer is smaller than you hoped you will hear it first.
That came from the prototype and from Sam's direction since, and it is the
site's strongest asset. The plan's `.delv.` and `:delv:` are settled as
`delv.` by the supplied logo, and the plan's US spellings are UK throughout,
per §6.

---

## 13. Open decisions for Sam

Not blockers for starting, but all are blockers for launch.

**The tickable version of this is `FIX-LATER.md` in the repo root.** That file
is the actions and the file paths; this section is why each one is a decision
rather than a fix. Keep them in step.

1. **Domain.** `delv.health` is used as the placeholder. `delv.co.uk` and `delv.com` were unavailable at last check.
2. **Brand punctuation.** Settled. A wordmark was supplied on 12 Sep 2026: `delv` in a high-contrast serif with the terminal full stop as an aquamarine dot. It is in `public/brand/`, inlined by `Logo.astro` for the header and footer, and carried through the favicon, the touch icon and all seven OG cards. The `.delv.` and `:delv:` variants are dead.
3. **Company details** for the trading disclosures strip.
4. **Email address** for the footer and the `mailto:` fallback.
5. **Where enquiries go.** `CONTACT_WEBHOOK_URL` in the Vercel project. Until it is set the form cannot deliver; it fails honestly rather than silently, but no enquiry reaches an inbox.
6. **Privacy notice** text, and whether analytics goes in at launch.
7. **Placeholders on production.** `SHOW_PLACEHOLDERS_ON_PRODUCTION` in `src/data/preview.ts` is `true`, so the live site serves sample results, sample quotes and placeholder colleagues. Sam asked for this on 12 Sep 2026 while the site is on a test domain with no traffic. **Set it back to `false` before launch.**
8. **Photography.** Ten image slots are placed and none has a picture in it. Each carries its own brief. Until they are shot the site shows the briefs.
9. **Proof.** The slots are built (§7) and empty. Sam is filling them at a later stage. For a consultancy selling evidence this remains the largest gap, and it is now a content decision rather than a build one: one anonymised result with its basis attached, and one quote, would change the conversion profile of the whole site. Until then four bands across four pages do not render at all.
10. **The Value Incubator and the Value Due Diligence Framework.** Both are named offers in the business plan and neither is on the site. If they are real, they belong on How we work next to the Value Audit; if they were working titles, this brief should stop citing them.
11. **Investors as an audience.** The plan gives them a full proposition. The site gives them two mentions and a line in the contact form. A page, or a section on For startups, is a scope call.
12. **The Enterprise proof card.** The band is built and deliberately empty, and it stays empty even in placeholder preview. The card that fits the page is the symptom assessment one, "procurement cycle cut from nine months to five", which is this page's thesis almost word for word. It already runs on Home and on Startups, and Startups is not being reopened. Running one card on three pages, or inventing a fourth to avoid that, is exactly what this site argues against. What to look for: a multi-market or multi-business-unit vendor where consolidating the claims or the calculators produced a measurable commercial result, written to the same pattern with the basis line underneath.
13. ~~**The intro plays on every load.**~~ **Closed 18 Sep 2026.** `REPLAY_EVERY_VISIT` in the head script in `src/layouts/Base.astro` is `false`, so the 5.5-second animation runs once a session rather than on every page view. Sam had asked for every load on 13 Sep 2026 while the site was on a test domain; he asked for it back on 18 Sep. Nothing else had to change with it, in either direction.
14. **Retire the prototype as the copy reference.** `reference/prototype.html` is 34% verbatim against the data files after the 13 Sep amends pass, and `/scale-ups` and `/enterprise` share none of it. It is still the reference for layout, spacing and the motifs. Someone reading it for wording will be reading an old draft.
15. **A price anchor** on the Value Audit. Startups screen on cost, and "fixed fee" without a from-price does not clear that screen.

---

## 13a. Open editorial decisions

From the copy amends brief of 13 Sep 2026. Its Tier 1 finds are applied; these
are the Tier 2 items, which are Sam's editorial call rather than fixes. None
blocks a deploy. Counts below are measured against the rendered site, not
against the amends brief, because the Tier 1 pass moved several of them.

These are section E of `FIX-LATER.md`, with the proposed wording kept here.

**Accuracy, and the one that matters most**

1. **The ITU/WHO credential on Who we are.** Currently "co-chaired the ITU/WHO
   focus group working group on clinical evaluation of AI for health". "Focus
   group working group" reads as a duplication. The body is the ITU/WHO **Focus
   Group on Artificial Intelligence for Health (FG-AI4H)**, which has topic and
   working groups beneath it, so the accurate construction is probably closer
   to "co-chaired a working group of the ITU/WHO Focus Group on AI for Health,
   on the clinical evaluation of AI". **Confirm the exact body and role with
   Shubs before anyone touches it.** Getting an evidence consultancy's own
   credential wrong is the worst available error on this site.

**Cross-page repetition, all three audience pages**

Each of these is a good line. Three of them in the same position is a
template, and a reader who visits two of the three pages will see it.

2. **"Three moments when X call us"**, on all three, same heading and same
   three-card structure. Vary at least two, and consider whether one page can
   run two cards or four.
3. **The refusal paragraph**, on all three, always as the last paragraph of the
   deliverables list. Keep the construction on one page and let the refusal
   arrive differently, or in a different position, on the other two.
4. **The ownership reassurance in the CTA**, now four instances: the three
   audience pages plus How we work. Vary two.
5. **The differing-market anaphora**, down from four instances to three
   (Scale-ups, Enterprise, How we work). Reduce to one.

**Repeated vocabulary**

6. **"defensible"**, done. Two instances, Startups and How we work, down
   from eight. Enterprise went to "credible" in the 16 September pass. Home
   had picked one up with the rewritten `muted` paragraph in the same window
   and now reads "a number your buyer can put their name to": `survive`,
   `hold up` and the verb `defend` were all at three or more, so a synonym
   would only have moved the repetition. "Quietly indefensible" on What we
   do is a different word and stays.
7. **"a sceptical analyst"**, done, and then gone. The Startups deliverable
   reads "a value model with sourced assumptions, built to be questioned",
   which took "analyst" from four instances to three. The last one was the
   Home proof lede, and Sam deleted that lede on 18 Sep 2026 along with the
   heading above it, so the phrase is not on the site at all now. Nothing
   needs doing; this is only here so the next person does not go looking for
   it in `proof.ts`.
8. **Two meta descriptions still open "How delv."** (Startups, Enterprise).
   Scale-ups was recast in the Tier 1 pass. Defensible as a pattern; worth a
   look if the other two are ever regenerated.

**Single lines, each optional**

9. **"Sound familiar?"** on Home. The only weak heading on the page.
   Alternatives: "Where this usually bites". ("If two or more of these are
   true" was the other, and it is spent: it was the block's lede, and Sam's
   copy edit of 18 Sep 2026 removed it along with the six original items. The
   heading now carries the block on its own, with `headingGap: wide` doing the
   work the lede used to do.)
10. ~~**List saturation on What we do.**~~ **Addressed differently, 19 Sep
    2026.** Two parallel lists in close succession with a triple anaphora
    between them, and the second had just grown to eight items. The proposal
    was to trim the first to four; what happened instead is that all three
    stage lists became disclosures, so each row is one short line until a
    reader opens it. The saturation was a length problem and the length is
    gone. The anaphora between the lists is untouched and still worth a look.
11. **The six tests on How we work.** Six labelled adjectives with colon
    definitions is a recognisable consultancy-deck shape, and the list does not
    spell anything. Four may land harder. Relevant and Marketable overlap.
    There is a reasonable case for leaving it.
12. **"the asset everything else is built from"** on What we do. The README
    lists it as core positioning and the line is good; "the asset" is the only
    word in it that leans product.
13. **"A repeatable flow"** on What we do. "Flow" and "refreshing" suggest an
    automated pipeline. "A way of refreshing the evidence that your team can
    repeat, so it does not age in a slide" puts a person in it.
14. **"One calculator, not five"** on Enterprise. A contrastive negation in a
    heading, which is where it is most visible, but it is a good heading.
15. **The abstract triplet in Shubs' bio**: "He works at the join between
    clinical credibility, regulatory expectation and commercial reality." The
    most consultant-flavoured line in either bio. Bios tolerate more than
    marketing copy does.

**Two the amends brief did not list**

16. **Enterprise carries three contrastive negations** against a threshold of
    one: the designated keeper "not in the maths", the protected "a decision,
    not an analysis", and an unlisted third in a Value Library bullet, "held
    against the parent claim rather than as separate untracked copies".
17. **Who we are carries an unlisted second**, in the bench section: "survive
    an HTA reviewer rather than a sales meeting".
