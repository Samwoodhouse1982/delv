/**
 * The geometry behind the growth narrative: the soil field and the root system.
 *
 * Like scatter.ts, this runs in component frontmatter, so the field is baked
 * into the HTML at build time and nothing in this file ships to the browser.
 * Same seed, same picture, every build. A drawing that reshuffles on every
 * deploy is a diff nobody can review.
 *
 * Two coordinate systems, on purpose, and the reason is in Narrative.astro:
 * lines live in a stretched SVG and are measured in stage percentages, while
 * marks are CSS elements and carry their own size in cqw so a circle stays a
 * circle.
 */

/** The design width the handoff measured against. 1cqw is this over 100. */
const DESIGN_W = 1180;
const PX = DESIGN_W / 100;

/** Numerical Recipes LCG, the same one scatter.ts uses. */
function lcg(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const round = (n: number, places = 2) => Number(n.toFixed(places));

export interface SoilMark {
  /** Centre, as a percentage of the stage. */
  x: number;
  y: number;
  /** Diameter, in cqw, so it scales with the band rather than the viewport. */
  s: number;
  o: number;
}

export interface Root {
  /**
   * The path, in stage percentages. Drawn in an SVG with
   * preserveAspectRatio="none", so only the shape stretches; the stroke does
   * not, and neither does anything drawn as a mark.
   */
  d: string;
  /** Rough path length, for the draw-on animation's dasharray. */
  len: number;
  /**
   * Whether this root found anything. A root that reaches nothing is an
   * `unclosed` mark in the existing vocabulary: a claim not yet closed. The
   * failures are not decoration — a root system where every probe succeeds is
   * the visual equivalent of a case study with no failures in it.
   */
  finds: boolean;
  /** Where it ends, for the mark that sits at the tip. */
  tip: { x: number; y: number };
  /** Draw order, 0 to 1, so the system spreads rather than appearing at once. */
  order: number;
}

/**
 * The soil: undifferentiated activity, in Rosy Taupe, denser with depth.
 *
 * `top` and `bottom` bound the field as stage percentages, so the caller
 * decides how much of the page is underground rather than this file assuming
 * it. Marks avoid a corridor down the middle where the roots will run, so the
 * root system reads against the field rather than through it.
 */
export function buildSoil(
  count = 76,
  seed = 51009,
  top = 0,
  bottom = 100,
): SoilMark[] {
  const rnd = lcg(seed);
  const marks: SoilMark[] = [];
  const span = bottom - top;

  while (marks.length < count) {
    const x = round(4 + rnd() * 92);
    // Biased downward: rnd() squared puts more of the field deep rather than
    // spreading it evenly, so depth reads as depth and not as wallpaper.
    const y = round(top + Math.pow(rnd(), 0.62) * span);
    const s = round((5 + rnd() * 9) / PX, 3);

    // The corridor the trunk runs down, at the same 28% the roots use. Marks
    // inside it are dropped rather than nudged aside, because nudging produces
    // a visible halo.
    if (Math.abs(x - 28) < 4 && y < top + span * 0.55) continue;

    marks.push({ x, y, s, o: round(0.18 + rnd() * 0.34) });
  }

  return marks;
}

/**
 * The root system: one trunk descending from where the seed landed, and
 * probes branching off it into the field.
 *
 * Every root is a quadratic curve rather than a straight line, because a
 * straight probe reads as a diagram and a curved one reads as something that
 * had to find its way. They stay within the line vocabulary either way: the
 * weight is the measuring rule's, and nothing tapers.
 */
export function buildRoots(seed = 30117, top = 0, bottom = 100): Root[] {
  const rnd = lcg(seed);
  const roots: Root[] = [];
  const span = bottom - top;

  /*
   * The trunk descends at 28% of the width, not at 50%.
   *
   * Centred looked right in the abstract and was wrong on the page: the site's
   * `.split` sections put a short heading in the left column and the prose in
   * the right, so the middle of the page is the middle of a paragraph. The
   * roots ran lines through the copy, which is the brief's own first failure
   * mode — the motion becoming the point rather than the copy.
   *
   * 28% sits under the heading column, which is the one part of these sections
   * that is mostly empty below its first two lines. It is also the more
   * distinctive composition: a root system rising off-centre rather than a
   * tree diagram bisecting the page.
   */
  const TRUNK = 28;
  const trunkEnd = top + span * 0.86;
  roots.push({
    d: `M ${TRUNK} ${round(top)} C ${TRUNK} ${round(top + span * 0.3)} ${TRUNK - 0.8} ${round(top + span * 0.5)} ${TRUNK - 0.4} ${round(trunkEnd)}`,
    len: round(trunkEnd - top),
    finds: true,
    tip: { x: TRUNK - 0.4, y: round(trunkEnd) },
    order: 0,
  });

  /*
   * Eight probes, alternating sides so the system balances, each leaving the
   * trunk at a different depth. Three of the eight find nothing. That ratio
   * is a judgement rather than a measurement, and it is the one number here
   * worth arguing about: too few failures and the picture is a brochure, too
   * many and the company looks like it cannot find anything.
   */
  const FAILS = new Set([1, 4, 6]);

  for (let i = 0; i < 8; i++) {
    const side = i % 2 === 0 ? 1 : -1;
    const startY = top + span * (0.12 + (i / 8) * 0.64 + rnd() * 0.04);
    /*
     * Drop exceeds reach, always. The first version had it the other way and
     * the probes read as flight paths sweeping across the page rather than as
     * roots going down, and they crossed the measure while they did it. A root
     * that travels further sideways than downward is not a root.
     *
     * A probe that finds nothing also stops short. It did not get as far.
     */
    const found = !FAILS.has(i);
    const scale = found ? 1 : 0.55;
    const reach = (6 + rnd() * 13) * side * scale;
    const drop = span * (0.13 + rnd() * 0.1) * scale;
    const endX = TRUNK + reach;
    const endY = startY + drop;
    /* The control point sits out ahead of the start, so the probe leaves the
       trunk sideways and turns down rather than setting off diagonally. */
    const cx = TRUNK + reach * 0.75;
    const cy = startY + drop * 0.2;

    roots.push({
      d: `M ${TRUNK} ${round(startY)} Q ${round(cx)} ${round(cy)} ${round(endX)} ${round(endY)}`,
      len: round(Math.hypot(reach, drop) * 1.15),
      finds: found,
      tip: { x: round(endX), y: round(endY) },
      order: round(0.08 + (i / 8) * 0.8, 3),
    });
  }

  return roots;
}
