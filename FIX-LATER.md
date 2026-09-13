# Fix later

Everything outstanding on the delv. site, in one place, as a checklist.

This is the list of **actions**. The reasoning behind each one, and the
options where there is a choice to make, lives in `delv-build-brief.md` §13
(launch decisions) and §13a (editorial decisions). Tick things off here; go
there when you need to remember why something is on the list.

Last reconciled against the built site: 13 Sep 2026.

---

## A. Blocks launch

The site is incomplete, misleading or legally short without these. Most are
one-line changes.

- [ ] **Set `CONTACT_WEBHOOK_URL`** in the Vercel project. Until then the form
      cannot deliver. It fails honestly rather than silently, so nothing a
      visitor types is lost, but no enquiry reaches an inbox.
- [ ] **`SHOW_PLACEHOLDERS_ON_PRODUCTION` to `false`** in `src/data/preview.ts`.
      The live site is currently serving sample results, sample quotes and
      placeholder colleagues.
- [ ] **`REPLAY_EVERY_VISIT` to `false`** in `src/layouts/Base.astro`. The
      5.5-second intro plays on every page view, so every internal click costs
      a visitor five and a half seconds.
- [ ] **Company number and registered office** in `src/data/site.ts`. Both are
      `null`. A limited company must show them on its website. The footer strip
      renders only what is filled in, so it is incomplete rather than wrong.
- [ ] **Confirm the email address.** `hello@delv.health` in `src/data/site.ts`
      feeds the footer, the form note and the `mailto:` fallback.
- [ ] **Supply the privacy notice.** `/privacy` is built and `noindex`;
      `src/data/privacy.ts` says what to replace. Nobody should draft this but
      you.
- [ ] **Settle the domain.** `delv.health` is a placeholder in two places:
      `SITE_URL` in `astro.config.mjs` and the sitemap line in
      `public/robots.txt`. Canonicals, Open Graph URLs and the sitemap all
      derive from the first.
- [ ] **Decide on analytics.** Nothing is loaded. Plausible is the intended
      choice and is cookieless, but it is not in.

## B. Content to supply

- [ ] **Proof.** Both registries in `src/data/proof.ts` are empty, so four
      bands across four pages do not render at all. For a consultancy whose
      argument is that unevidenced claims do not survive a buyer, this is the
      largest gap on the site. One anonymised result with its basis attached,
      and one quote, would change how it converts.
- [ ] **A proof card for Enterprise specifically.** Deliberately empty, even in
      preview. Look for a multi-market or multi-business-unit vendor where
      consolidating the claims or the calculators produced a measurable
      commercial result.
- [ ] **Ten photographs.** Every slot carries its own brief for whoever shoots
      it. Three on Who we are (two portraits at 4:5 and a working shot), two on
      Enterprise, one each on Home, What we do, Startups, Scale-ups and How we
      work.
- [ ] **The wider bench.** `publishedBench` in `src/data/who-we-are.ts` is
      empty. Three placeholder disciplines are showing while
      `SHOW_PLACEHOLDERS_ON_PRODUCTION` is on (health economics, regulatory,
      product) and they disappear when it goes off, so anything meant to
      survive launch has to move into `publishedBench`. `name` is optional
      there, so a real seat can be listed by discipline alone.
- [ ] **LinkedIn.** `site.sameAs` is empty, so the home page's `Organization`
      JSON-LD omits the property rather than pointing at nothing.

## C. Needs someone else

- [ ] **Confirm the ITU/WHO credential with Shubs.** `/who-we-are` currently
      says "co-chaired the ITU/WHO focus group working group on clinical
      evaluation of AI for health". "Focus group working group" is a
      duplication, and the body is probably the Focus Group on Artificial
      Intelligence for Health (FG-AI4H), which has working groups beneath it.
      **Get the exact body and role from him before anyone rewrites it.**
      Getting an evidence consultancy's own credential wrong is the worst
      available error on this site.

## D. Scope calls

- [ ] **The Value Incubator and the Value Due Diligence Framework.** Named
      offers in the business plan, absent from the site. If they are real they
      belong on How we work beside the Value Audit; if they were working
      titles, the brief should stop citing them.
- [ ] **Investors as an audience.** The plan gives them a full proposition. The
      site gives them two mentions and a line in the contact form. A page, or a
      section on Startups.
- [ ] **A price anchor on the Value Audit.** Startups screen on cost, and
      "fixed fee" with no from-price does not clear that screen.

## E. Editorial polish

None of this blocks anything. Full detail and proposed wording in §13a of the
brief.

The one worth doing as a group, because a reader who visits two of the three
audience pages will see the template:

- [ ] **"Three moments when X call us"** on all three. Vary at least two.
- [ ] **The refusal paragraph** on all three, always in the same position.
      Keep the construction on one page.
- [ ] **The ownership reassurance in the CTA**, four instances now. Vary two.
- [ ] **The differing-market anaphora**, three instances. Reduce to one.

Then, each on its own:

- [ ] "defensible" is at three; the target was two.
- [ ] "a sceptical analyst" appears on Home and Startups in near-identical
      phrasing.
- [ ] Two meta descriptions still open "How delv." (Startups, Enterprise).
- [ ] "Sound familiar?" on Home is the only weak heading on the page.
- [ ] List saturation on What we do: two six-item lists with a triple anaphora
      between them.
- [ ] The six tests on How we work. Four may land harder than six.
- [ ] "the asset everything else is built from" on What we do.
- [ ] "A repeatable flow" on What we do.
- [ ] "One calculator, not five" on Enterprise.
- [ ] The abstract triplet in Shubs' bio.
- [ ] Two contrastive negations the amends brief did not list, one on
      Enterprise and one on Who we are.

## F. Housekeeping

- [ ] **Retire `reference/prototype.html` as the copy reference.** It is 34%
      verbatim against the data files, and Scale-ups and Enterprise share none
      of it. Still the reference for layout, spacing and the motifs; anyone
      reading it for wording is reading an old draft.
- [ ] **Consider a CI check.** `npm run check` runs `astro check` and the axe
      suite. Nothing runs it automatically on push.
