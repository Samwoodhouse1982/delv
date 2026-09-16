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
export interface Root {
  /**
   * The path, in percentages of the region below the ground line. Drawn in an
   * SVG with preserveAspectRatio="none", so only the shape stretches; the
   * stroke does not, and neither does anything drawn as a mark.
   */
  d: string;
  /** Rough path length, for the draw-on animation's dasharray. */
  len: number;
  /**
   * Branch order. 0 is the taproot, 1 a branch off it, 2 a branch off that.
   * It drives stroke width, because the single strongest cue that a line is a
   * root rather than an arc is that it gets thinner every time it divides.
   */
  order: number;
  /**
   * Whether this root found anything. A root that reaches nothing is an
   * `unclosed` mark in the existing vocabulary: a claim not yet closed. The
   * failures are not decoration — a root system where every probe succeeds is
   * the visual equivalent of a case study with no failures in it.
   */
  finds: boolean;
  /** Where it ends, for the mark that sits at the tip. Null for a root that
      only exists to carry others. */
  tip: { x: number; y: number } | null;
  /** Draw order, 0 to 1, so the system spreads rather than appearing at once. */
  seq: number;
}

/**
 * The root system: a taproot descending from where the seed landed, branches
 * off it, and branches off those.
 *
 * ## Why this was rebuilt
 *
 * The first version was a trunk with eight single probes, drawn at one weight
 * with no subdivision, and Sam's reaction was that it did not look like roots.
 * He was right. Avoiding a stock tree had been taken as far as avoiding the
 * thing entirely: what makes a line read as a root rather than as an arc is
 * that it divides, and divides again, and thins each time it does. Neither
 * happened, so the drawing read as neither a tree nor anything else.
 *
 * Branching and thinning are structural cues, not botanical ones. Nothing here
 * is drawn as a tapering organic form: every path is still a stroke at the
 * weight of a measuring rule, and the weight simply steps down by order. That
 * keeps the vocabulary the five section graphics use while letting the shape
 * be legible.
 */
export function buildRoots(seed = 30117, top = 0, bottom = 100): Root[] {
  const rnd = lcg(seed);
  const roots: Root[] = [];
  const span = bottom - top;

  /*
   * The taproot descends at 28% of the width, not at 50%. Centred looked right
   * in the abstract and was wrong on the page: the site's `.split` sections put
   * a short heading in the left column and the prose in the right, so the
   * middle of the page is the middle of a paragraph, and roots drawn there ran
   * lines through the copy.
   */
  const TRUNK = 28;

  /* A quadratic through a start, a direction and a distance. */
  const curve = (
    x: number,
    y: number,
    dx: number,
    dy: number,
    bend: number,
  ) => {
    const ex = x + dx;
    const ey = y + dy;
    /* The control point sits ahead and to the side, so the root leaves its
       parent sideways and turns down rather than setting off diagonally. */
    const cx = x + dx * bend;
    const cy = y + dy * (1 - bend) * 0.55;
    return {
      d: `M ${round(x)} ${round(y)} Q ${round(cx)} ${round(cy)} ${round(ex)} ${round(ey)}`,
      ex,
      ey,
      len: round(Math.hypot(dx, dy) * 1.2),
    };
  };

  /*
   * Roughly a third of the tips find nothing. A judgement rather than a
   * measurement, and the one number here worth arguing about: too few failures
   * and the picture is a brochure, too many and the company looks like it
   * cannot find anything.
   */
  const fails = () => rnd() < 0.34;

  const grow = (
    x: number,
    y: number,
    dir: number,
    order: number,
    seq: number,
  ) => {
    if (order > 2 || y > bottom - 4) return;

    /* Each order reaches less far and drops less deep than its parent. */
    const spread = [0, 11, 6.5][order] ?? 5;
    const depth = [0, 0.13, 0.08][order] ?? 0.06;

    const kids = order === 1 ? 2 : 1 + Math.floor(rnd() * 2);

    for (let i = 0; i < kids; i++) {
      const away = dir * (0.55 + rnd() * 0.95);
      const dx = away * spread;
      const dy = span * depth * (0.7 + rnd() * 0.7);
      const c = curve(x, y, dx, dy, 0.7 + rnd() * 0.2);
      const childSeq = round(seq + 0.1 + rnd() * 0.12, 3);

      /* An order-2 root is a tip. An order-1 root carries more roots, and only
         the ones that carry nothing get a mark, so the system does not end in
         a rash of dots at every junction. */
      const terminal = order === 2 || rnd() < 0.4;
      const found = terminal ? !fails() : true;

      roots.push({
        d: c.d,
        len: c.len,
        order,
        finds: found,
        tip: terminal ? { x: round(c.ex), y: round(c.ey) } : null,
        seq: childSeq,
      });

      if (!terminal) grow(c.ex, c.ey, dir, order + 1, childSeq);
      /* One in three carries on straight down as well as sideways, which is
         what stops the system reading as a row of chevrons. */
      if (!terminal && rnd() < 0.34) {
        grow(c.ex, c.ey, -dir, order + 1, childSeq + 0.04);
      }
    }
  };

  /* The taproot, wandering slightly rather than ruled straight. */
  const end = top + span * 0.88;
  roots.push({
    d:
      `M ${TRUNK} ${round(top)} ` +
      `C ${TRUNK + 1.2} ${round(top + span * 0.26)} ` +
      `${TRUNK - 1.6} ${round(top + span * 0.58)} ` +
      `${TRUNK - 0.6} ${round(end)}`,
    len: round(end - top),
    order: 0,
    finds: true,
    tip: { x: TRUNK - 0.6, y: round(end) },
    seq: 0,
  });

  /* Six branch points down the taproot, alternating sides. */
  for (let i = 0; i < 6; i++) {
    const t = 0.1 + (i / 6) * 0.7 + rnd() * 0.05;
    const y = top + span * t;
    /* The taproot's own wander, so branches leave the line rather than the
       column the line started in. */
    const x = TRUNK + Math.sin(t * 3.1) * 1.4;
    grow(x, y, i % 2 === 0 ? 1 : -1, 1, round(t, 3));
  }

  return roots;
}

export interface Limb {
  d: string;
  len: number;
  /** 0 the stem, 1 a limb off it, 2 a limb off that. Drives stroke width. */
  order: number;
  /** Where it ends, for the mark at the tip. Null for a limb that carries others. */
  tip: { x: number; y: number } | null;
  /** The one thing that counts. Exactly one limb in the canopy carries it. */
  counts: boolean;
  seq: number;
}

/**
 * Beats 5 and 6: the stem, and the canopy.
 *
 * The same construction as the root system, turned over: a spine, limbs off
 * it, limbs off those, thinning by order. Deliberately the same, because the
 * argument the page makes is that the visible thing and the thing underneath
 * are one structure, and drawing them in two different languages would say the
 * opposite.
 *
 * The proportion is the point. This zone is a fraction of the depth the roots
 * occupy, and it stays that way: a large root system under a small visible
 * thing is a truer picture of evidence work than the reverse, and it is more
 * distinctive than a tree getting bigger.
 *
 * Coordinates run 0 at the top of the zone to 100 at the ground line beneath
 * it, so the stem grows from 100 upward.
 */
export function buildTree(seed = 88213): Limb[] {
  const rnd = lcg(seed);
  const limbs: Limb[] = [];
  const STEM = 28;

  /*
   * The control point sits high and only part of the way out, so a limb rises
   * as it leaves the stem and spreads late. The first version put it level
   * with the start and far to the side, which sent every limb sideways before
   * it hooked upward — the whole canopy read as drooping, closer to a fountain
   * than a tree. Branches reach up. That is most of what makes a canopy a
   * canopy rather than more roots.
   */
  const curve = (x: number, y: number, dx: number, dy: number, lift: number) => {
    const ex = x + dx;
    const ey = y + dy;
    const cx = x + dx * 0.42;
    const cy = y + dy * lift;
    return {
      d: `M ${round(x)} ${round(y)} Q ${round(cx)} ${round(cy)} ${round(ex)} ${round(ey)}`,
      ex,
      ey,
      len: round(Math.hypot(dx, dy) * 1.25),
    };
  };

  /* The stem. Modest, and it does not reach the top of its own zone: a stem,
     not a trunk, because at this beat the thing has only just surfaced. */
  const crown = 30;
  limbs.push({
    d: `M ${STEM} 100 C ${STEM - 0.9} 78 ${STEM + 1.1} 54 ${STEM - 0.3} ${crown}`,
    len: 100 - crown,
    order: 0,
    tip: null,
    counts: false,
    seq: 0,
  });

  const grow = (x: number, y: number, dir: number, order: number, seq: number) => {
    if (order > 2) return;
    /*
     * Rise still beats spread, but only just, and the numbers are in different
     * units: this zone is about as wide as it is tall, so a limb of 24 up and
     * 7.5 across is three to one in actual pixels and the canopy came out as a
     * sheaf of near-parallel stems. Widened until the crown is broader than it
     * is tall, which is what a crown is.
     */
    const spread = [0, 17, 11][order] ?? 8;
    const rise = [0, 19, 11][order] ?? 8;
    const kids = 2;

    for (let i = 0; i < kids; i++) {
      /* Each pair fans rather than running parallel: the first child leans
         out, the second climbs. */
      const lean = i === 0 ? 0.75 + rnd() * 0.5 : 0.28 + rnd() * 0.36;
      const dx = dir * lean * spread;
      const dy = -rise * (i === 0 ? 0.6 + rnd() * 0.35 : 0.9 + rnd() * 0.45);
      const c = curve(x, y, dx, dy, 0.72 + rnd() * 0.16);
      const childSeq = round(seq + 0.12 + rnd() * 0.1, 3);
      const terminal = order === 2 || rnd() < 0.3;

      limbs.push({
        d: c.d,
        len: c.len,
        order,
        tip: terminal ? { x: round(c.ex), y: round(c.ey) } : null,
        counts: false,
        seq: childSeq,
      });

      if (!terminal) grow(c.ex, c.ey, dir, order + 1, childSeq);
      if (!terminal && rnd() < 0.4) grow(c.ex, c.ey, -dir, order + 1, childSeq + 0.05);
    }
  };

  /*
   * Six limb points, alternating, and they start at 0.42 of the stem rather
   * than 0.25: a bare lower stem and the branching held up near the crown is
   * what separates a tree from a shrub.
   */
  for (let i = 0; i < 6; i++) {
    const t = 0.42 + (i / 6) * 0.5;
    grow(
      STEM + Math.sin(t * 3) * 0.8,
      100 - (100 - crown) * t,
      i % 2 === 0 ? 1 : -1,
      1,
      round(t, 3),
    );
  }

  /*
   * One tip carries aquamarine, and only one. The colour means the one thing
   * that counts, and a canopy of it would be the failure the brief names: the
   * moment it becomes the colour of leaves it stops meaning anything, and the
   * highlighter behind the word value in the hero loses its force with it.
   * The highest tip gets it.
   */
  const tips = limbs.filter((l) => l.tip);
  const highest = tips.reduce((a, b) => (a.tip!.y <= b.tip!.y ? a : b));
  highest.counts = true;

  return limbs;
}
