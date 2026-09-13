/**
 * Deterministic scatter fields for the section graphics.
 *
 * Both generators run in component frontmatter, so the fields are baked into
 * the HTML at build time and nothing in this file ships to the browser. Same
 * seed, same field, every build: a graphic that reshuffles on every deploy is
 * a diff nobody can review.
 *
 * `buildMarks` is the handoff's own generator, constants unchanged. See
 * reference/design_handoff_delv_graphics/AbsorptionCore.jsx.
 */

/** The design width the handoff measured against. 1cqw is this over 100. */
const DESIGN_W = 1180;
const PX = DESIGN_W / 100;

/** Numerical Recipes LCG. Small, and identical in every engine. */
function lcg(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const round = (n: number, places = 2) => Number(n.toFixed(places));

export interface Mark {
  /** Centre, as a percentage of band width. */
  x: number;
  /** Centre, as a percentage of band height. */
  y: number;
  /** Diameter, in cqw. */
  s: number;
  o: number;
  /** Its own drift period, in seconds. */
  dur: number;
  delay: number;
  /**
   * Its own departure, as a fraction of the 9s absorption cycle. Only graphic
   * 02 reads it; graphic 01's field never leaves home.
   */
  dep: number;
}

/**
 * Graphic 02's cloud: a rough disc around x=23%, every mark with its own
 * departure time. Ported from the handoff verbatim.
 */
export function buildMarks(count = 34, seed = 77401): Mark[] {
  const rnd = lcg(seed);
  const marks: Mark[] = [];

  for (let i = 0; i < count; i++) {
    const a = rnd() * Math.PI * 2;
    const rad = Math.sqrt(rnd());
    const s = round((6 + rnd() * 10) / PX, 3);
    marks.push({
      x: round(23 + Math.cos(a) * rad * 17),
      y: round(50 + Math.sin(a) * rad * 36),
      s,
      o: round(0.4 + rnd() * 0.5),
      dur: round(4.5 + rnd() * 4),
      delay: round(rnd() * 5),
      dep: round(0.28 + rnd() * 0.26, 3),
    });
  }

  return marks;
}

/**
 * Graphic 01's field: dense at the left and thinning to the right, so the eye
 * runs out of scatter at about the point the rings start. Three things fall
 * off together along the way, because any one of them on its own reads as an
 * accident rather than a gradient: how many marks there are, how big they
 * are, and how far from the centre line they stray.
 *
 * The field sits behind the claim demo's text, which sets a hard ceiling on
 * how dark a mark may be. Every text colour in that block has to clear 4.5:1
 * against a mark at full strength, because a mark can land under any glyph at
 * some viewport width and there is no honest way to guarantee otherwise.
 *
 * Measured, at #CC998D over #F7F7F3:
 *
 *   mark alpha   weak line   caption   Before label
 *   0.26         4.71:1      4.61:1    4.76:1
 *   0.30         4.57:1      4.47:1    4.61:1   <- caption fails
 *
 * So OPACITY_CEILING is 0.26, and the density comes from the number of marks
 * rather than the weight of them. Two things had to move for even that to be
 * available, both in global.css: the weak line's flat 30% taupe wash is gone,
 * because two taupe layers compound and with the wash in place no mark alpha
 * at all clears 4.5:1 (0.10 already lands at 4.32:1); and the Before label
 * deepened from 52% to 40% taupe-in-ink, which is 4.76:1 against a full mark
 * where 52% was 3.90:1.
 */
const OPACITY_CEILING = 0.26;

export function buildField(count = 76, seed = 20863): Mark[] {
  const rnd = lcg(seed);
  const marks: Mark[] = [];

  for (let i = 0; i < count; i++) {
    // u^2.1 pulls a uniform draw towards zero, which is the density gradient.
    const t = Math.pow(rnd(), 2.1);
    // Stops at 78%: the right fifth is the resolution zone, and a stray mark
    // out there reads as something the field failed to gather up.
    const x = 2 + 76 * t;
    // The field converges on the focal point as well as thinning out.
    const spread = 46 * (1 - 0.62 * t);
    const s = round(((6 + rnd() * 11) * (1 - 0.4 * t)) / PX, 3);

    marks.push({
      x: round(x),
      y: round(50 + (rnd() * 2 - 1) * spread),
      s,
      o: round(OPACITY_CEILING * (0.42 + rnd() * 0.58) * (1 - 0.3 * t)),
      dur: round(5 + rnd() * 4.5),
      delay: round(rnd() * 6),
      dep: 0,
    });
  }

  return marks;
}
