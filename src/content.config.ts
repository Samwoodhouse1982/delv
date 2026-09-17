import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * The content schema. One page is an ordered list of blocks.
 *
 * ## Why the pages became data
 *
 * Sam asked to edit the copy and the order of the sections himself, 17 Sep
 * 2026. Copy alone would have been a small job — it was already typed objects
 * in `src/data/`. Order is the larger one: it used to live in the page
 * templates as hand-written markup, so nothing outside the repository could
 * change it. Each page is now an array here and the templates just render
 * whatever the array says, in whatever order it says it.
 *
 * ## What that costs
 *
 * The old templates carried per-section tuning inline — a `max-width:20ch` on
 * one heading, a `margin-bottom:30px` on one split. Those cannot survive a
 * list a non-developer reorders, because they were tuned for the section
 * above and below. They are named options on the blocks instead (`band`,
 * `tight`, `layout`, `headingWidth`), and the renderer applies them. Every
 * page still renders byte-for-byte what it rendered before the change —
 * that is asserted, not assumed, by scripts/content-parity.mjs.
 *
 * ## Why Zod rather than the old interfaces
 *
 * Same guarantees, enforced at build rather than only in the editor, and the
 * CMS reads the same shapes. A bad edit in the CMS fails the build instead of
 * shipping: `astro check` catches a typo in a type, and the schema catches a
 * missing heading or an unknown block type.
 *
 * Most strings are rendered with `set:html`, so they keep their typographic
 * entities (&rsquo;, &middot;) and must stay HTML-safe: no bare `<` or `&`.
 * A few are not — see `action.label` below — and those want the character
 * itself. `npm run entities` fails the build if the two are ever mixed up.
 */

const action = z.object({
  /**
   * Rendered as text, not HTML: every component interpolates this into the
   * button rather than calling `set:html`. So an entity here ships literally,
   * as `Let&rsquo;s talk` on the page, which is what happened on 18 Sep 2026
   * when the home page's closing button got the first apostrophe any button
   * on the site had ever had. Write the character: ’, not `&rsquo;`.
   */
  label: z.string(),
  href: z.string(),
  /** Outline rather than filled. Secondary actions only. */
  ghost: z.boolean().optional(),
});

/**
 * An image slot. `src` is empty everywhere at the moment, so each renders as a
 * labelled placeholder carrying the brief for the picture that belongs there.
 * Add `src` and `alt` and it becomes the image in the same space: the box is
 * sized from `ratio` either way, so nothing on the page moves.
 */
const figure = z.object({
  /** Written as an instruction to whoever takes the photograph. */
  label: z.string(),
  /** Aspect ratio as "w/h", e.g. "16/9", "3/2", "4/5". */
  ratio: z.string().regex(/^\d+\/\d+$/, 'ratio must look like "16/9"'),
  caption: z.string().optional(),
  /** Path under public/. Until this is set the slot stays a placeholder. */
  src: z.string().optional(),
  /** Required once src is set. Empty string only if purely decorative. */
  alt: z.string().optional(),
});

/** The five shapes in the section-graphic vocabulary, at list size. */
const markKind = z.enum([
  'unclosed',
  'evidenced',
  'activity',
  'measured',
  'restated',
]);

/**
 * Every block carries these. They are the tuning that used to be inline
 * styles, reduced to choices a non-developer can make without being able to
 * make the page ugly.
 *
 * `band` is the ground the section sits on. The rhythm of the page is the
 * alternation between them, which is why it is a choice and not a free
 * colour: five named grounds, each with its contrast already measured
 * against the type that sits on it.
 */
const base = {
  /** Shown in the CMS sidebar so a long page is navigable. Never rendered. */
  name: z.string().optional(),
  band: z
    .enum(['paper', 'linen', 'mint', 'deep', 'none'])
    .default('paper'),
  /** Less vertical padding. For a section that belongs with the one above. */
  tight: z.boolean().default(false),
  /**
   * The gap under a heading row.
   *
   * The templates carried six different values here — 26px, 28px, 30px and
   * two clamps — arrived at section by section. Four of them sit within 4px
   * of each other, which is not a distinction anyone will ever want to make
   * from a CMS, and exposing raw CSS to a content editor is how a page gets
   * broken by a typo. Two named gaps instead. The visual cost is measured in
   * scripts/content-parity.mjs rather than assumed.
   */
  headingGap: z.enum(['normal', 'wide']).default('normal'),
  /**
   * Suppresses the band's decorative discs. Emits the `contact-page` class,
   * which is named for the page it was written for rather than for what it
   * does — the note is in global.css beside the --coral rule.
   */
  plain: z.boolean().default(false),
  /**
   * Whether a two-column grid sits on the `.wrap` or inside it. Faithfulness
   * to the original markup rather than a design choice: two sections nested
   * them and the rest combined them. The two lay out identically — columns
   * match to the pixel at 360, 700, 1024, 1280 and 1600px, because `.split`
   * is a grid with no box of its own — so this keeps the parity check strict
   * rather than teaching it to forgive. The CMS hides it.
   */
  nestSplit: z.boolean().default(false),
};

/**
 * The blocks.
 *
 * A discriminated union on `type`, which is what lets the CMS offer "add a
 * block" as a typed list and lets the renderer switch on one field. Adding a
 * block type means adding a member here and a case in Blocks.astro, and the
 * build fails until both exist.
 */
const block = z.discriminatedUnion('type', [
  /* The page's opening. First block on every page, and not repeatable. */
  z.object({
    ...base,
    type: z.literal('hero'),
    heading: z.string(),
    /**
     * The standfirst, one entry per paragraph. A list rather than a string
     * because the home page's opening became two paragraphs on 18 Sep 2026
     * and `.hero .sub` carries its own top margin, so two of them space
     * themselves. Every other page has one.
     */
    sub: z.array(z.string()).min(1),
    actions: z.array(action).default([]),
    /** The home page's two-line lockup, which has its own measured fit. */
    lockup: z.boolean().default(false),
    /** Less space under the hero, for a page whose first block is a form. */
    tightBottom: z.boolean().default(false),
    /**
     * The before / after claim demo, which sits inside the hero rather than
     * after it. Part of the hero block because it is part of the hero's
     * markup: it cannot be moved away from the heading without moving the
     * heading with it.
     */
    claim: z
      .object({
        weak: z.object({ label: z.string(), text: z.string() }),
        strong: z.object({ label: z.string(), text: z.string() }),
        /**
         * Optional since 18 Sep 2026. It carried the arithmetic tying the two
         * lines together, and the word "Illustrative" with it; when the lines
         * stopped deriving from each other there was nothing left for it to
         * explain. See the note in index.json.
         */
        caption: z.string().optional(),
      })
      .optional(),
  }),

  /* A measurement rule across the page, or a short one. */
  z.object({
    ...base,
    type: z.literal('rule'),
    short: z.boolean().default(false),
  }),

  /* Paragraphs, with or without a heading beside them. */
  z.object({
    ...base,
    type: z.literal('prose'),
    heading: z.string().optional(),
    /** Sits beside the heading in a split, above the body in a full block. */
    lede: z.string().optional(),
    paragraphs: z.array(z.string()).default([]),
    /** A closing line in the muted style. */
    muted: z.string().optional(),
    /** A caption-styled line under the paragraphs. */
    caption: z.string().optional(),
    layout: z.enum(['full', 'split']).default('full'),
    /** A rule under the heading, in the split layout. */
    headingRule: z.boolean().default(false),
    /** Caps the heading's measure, in ch. The old inline max-width. */
    headingWidth: z.number().optional(),
    figure: figure.optional(),
    /** A section graphic after the body. Enterprise's calculator uses it. */
    graphic: z.enum(['absorption', 'restatement', 'engagementFlow']).optional(),
    /** Holds the paragraphs to a reading measure. Long-form pages want it. */
    bodyMax: z.boolean().default(false),
    /** Puts the graphic under the whole split rather than in the body column. */
    graphicAfter: z.boolean().default(false),
    /** A button after the body. */
    action: action.optional(),
  }),

  /* A numbered or stepped set of cards. */
  z.object({
    ...base,
    type: z.literal('pillars'),
    heading: z.string().optional(),
    lede: z.string().optional(),
    items: z
      .array(
        z.object({
          step: z.string(),
          heading: z.string(),
          body: z.string(),
          action: action.omit({ ghost: true }).optional(),
        }),
      )
      .default([]),
    marks: z.array(markKind).optional(),
    /** Graphic 03, the large stage shapes. Home only. */
    shapes: z.boolean().default(false),
    /** A button under the grid. */
    action: action.optional(),
  }),

  /* A stepped list: heading, when, body. */
  z.object({
    ...base,
    type: z.literal('stages'),
    heading: z.string().optional(),
    lede: z.string().optional(),
    headingWidth: z.number().optional(),
    rows: z
      .array(
        z.object({
          heading: z.string(),
          when: z.string(),
          body: z.string(),
        }),
      )
      .default([]),
    /** After the list. How we work draws the engagement under its own stages. */
    graphic: z.enum(['absorption', 'restatement', 'engagementFlow']).optional(),
    figure: figure.optional(),
  }),

  /*
   * One of the three stages on What we do: a mark, a label, a heading and a
   * lede on the left; the argument and the deliverables on the right. Its own
   * block rather than a variant of `prose`, because the left column carries
   * four things in a fixed order and nothing else on the site does.
   */
  z.object({
    ...base,
    type: z.literal('stage'),
    mark: markKind.optional(),
    label: z.string(),
    heading: z.string(),
    lede: z.string(),
    paragraphs: z.array(z.string()).default([]),
    details: z.array(z.string()).default([]),
    figure: figure.optional(),
    graphic: z.enum(['absorption', 'restatement', 'engagementFlow']).optional(),
  }),

  /*
   * A closing statement inside a band, with one action. Not the same as `cta`:
   * that is the site-wide closing band with its own component and ground,
   * this sits in the page's own rhythm. What we do ends on one.
   */
  z.object({
    ...base,
    type: z.literal('callout'),
    heading: z.string(),
    headingWidth: z.number().optional(),
    body: z.string(),
    action: action.omit({ ghost: true }),
  }),

  /* A deliverables list, optionally with a figure beside it and a closing note. */
  z.object({
    ...base,
    type: z.literal('details'),
    heading: z.string().optional(),
    /** Above the list. Enterprise's claims library sets the scene first. */
    paragraphs: z.array(z.string()).default([]),
    items: z.array(z.string()).default([]),
    note: z.string().optional(),
    layout: z.enum(['full', 'split']).default('split'),
    headingRule: z.boolean().default(false),
    figure: figure.optional(),
    /** Which column the figure sits in. Under the heading, or under the list. */
    figureSide: z.enum(['left', 'right']).default('left'),

  }),

  /*
   * A heading beside a stack of short sub-sections. Who we are uses it for
   * "What makes us different": three h3s and a paragraph each, which is a
   * different thing from a details list and a different thing from prose.
   */
  z.object({
    ...base,
    type: z.literal('stack'),
    heading: z.string().optional(),
    headingRule: z.boolean().default(false),
    items: z
      .array(z.object({ heading: z.string(), body: z.string() }))
      .default([]),
  }),

  /* The tick-marked problem list. */
  z.object({
    ...base,
    type: z.literal('problems'),
    heading: z.string().optional(),
    lede: z.string().optional(),
    items: z.array(z.string()).default([]),
  }),

  /* The entry-point cards. */
  z.object({
    ...base,
    type: z.literal('offers'),
    /**
     * Groups rather than one list. How we work runs two grids in one band —
     * where to start, then where it goes next — and the second heading is
     * smaller and tighter to the grid above it. Modelling that as two blocks
     * would put them on two grounds.
     */
    groups: z
      .array(
        z.object({
          heading: z.string().optional(),
          lede: z.string().optional(),
          items: z
            .array(
              z.object({
                heading: z.string(),
                meta: z.string(),
                body: z.string(),
                action: action.omit({ ghost: true }).optional(),
              }),
            )
            .default([]),
          marks: z.array(markKind).optional(),
        }),
      )
      .default([]),
  }),

  /* Questions and answers. */
  z.object({
    ...base,
    type: z.literal('qa'),
    heading: z.string().optional(),
    items: z
      .array(z.object({ question: z.string(), answer: z.string() }))
      .default([]),
  }),

  /* The founders. */
  z.object({
    ...base,
    type: z.literal('people'),
    items: z
      .array(
        z.object({
          name: z.string(),
          role: z.string(),
          paragraphs: z.array(z.string()).default([]),
          portrait: figure.optional(),
        }),
      )
      .default([]),
  }),

  /* The wider bench: prose beside a figure, then a stepped list. */
  z.object({
    ...base,
    type: z.literal('bench'),
    heading: z.string().optional(),
    paragraphs: z.array(z.string()).default([]),
    muted: z.string().optional(),
    figure: figure.optional(),
    /** The wider bench. `name` is omitted until a real person has agreed to
        be named, and the role doubles as the heading until then. */
    members: z
      .array(
        z.object({
          name: z.string().optional(),
          role: z.string(),
          body: z.string(),
        }),
      )
      .default([]),
  }),

  /* A picture on its own. */
  z.object({
    ...base,
    type: z.literal('figure'),
    figure,
  }),

  /*
   * The proof slots. These read from src/data/proof.ts by page key rather
   * than carrying their content here, because the same result appears on more
   * than one page and a figure that disagrees with itself across two pages is
   * the exact thing this company sells against. The block controls placement;
   * proof.ts controls truth.
   */
  z.object({
    ...base,
    type: z.literal('proof'),
    page: z.string(),
    heading: z.string().optional(),
    lede: z.string().optional(),
  }),
  z.object({
    ...base,
    type: z.literal('proofQuote'),
    page: z.string(),
  }),

  /*
   * The enquiry form, and the "what happens next" column beside it. One block
   * because the two are a single promise: the form asks, and the column says
   * what asking gets you.
   */
  z.object({
    ...base,
    type: z.literal('contactForm'),
    heading: z.string().optional(),
    items: z.array(z.string()).default([]),
    note: z.string().optional(),
  }),

  /* One of the section graphics. */
  z.object({
    ...base,
    type: z.literal('graphic'),
    kind: z.enum(['absorption', 'restatement', 'engagementFlow']),
  }),

  /* The closing band. Last block on every page. */
  z.object({
    ...base,
    type: z.literal('cta'),
    heading: z.string(),
    /**
     * Optional since 18 Sep 2026. The home page's closing band makes its
     * whole argument in the heading now, and a band with an empty paragraph
     * in it is not the same thing as a band with no paragraph. The other
     * five closing bands still have one.
     */
    body: z.string().optional(),
    action: action.omit({ ghost: true }),
  }),
]);

const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.json' }),
  schema: z.object({
    /** The route, without slashes. "index" is the home page. */
    route: z.string(),
    /** Ordering in the CMS list only. */
    order: z.number().default(0),
    meta: z.object({
      /** Full <title>. */
      title: z.string(),
      /** One sentence, under 155 characters. */
      description: z.string().max(165),
      /** Filename in public/og/. */
      ogImage: z.string(),
      /** Keeps a page out of search results. */
      noindex: z.boolean().default(false),
    }),
    blocks: z.array(block).default([]),
  }),
});

export const collections = { pages };
export type Block = z.infer<typeof block>;
