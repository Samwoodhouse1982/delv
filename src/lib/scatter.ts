/**
 * The deterministic scatter behind graphic 02, "Same ink, one form".
 *
 * It runs in component frontmatter, so the field is baked into the HTML at
 * build time and nothing in this file ships to the browser. Same seed, same
 * field, every build: a graphic that reshuffles on every deploy is a diff
 * nobody can review.
 *
 * The handoff's own generator, constants unchanged. See
 * reference/design_handoff_delv_graphics/AbsorptionCore.jsx.
 *
 * There was a second generator here, `buildField`, for graphic 01 behind the
 * home page's claim demo. Graphic 01 went on 15 Sep 2026 when that block
 * became a typed sequence and a field of marks moving behind the words started
 * competing with them.
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
