/**
 * AbsorptionCore — the JS half of graphic 02 ("Same ink, one form").
 *
 * Everything else in the set is pure CSS. This one is not, for two reasons:
 *   1. Each mark must travel from its own position to the core, so its keyframes
 *      depend on a distance only measurable at runtime.
 *   2. The core's growth is keyed to the marks' actual arrival times, so it gains
 *      a visible step each time one lands rather than following a fixed curve.
 *
 * Render the scatter as: a cloud wrapper > one positioned outer div per mark
 * (carrying the CSS `delvFloat` drift) > one inner circle. The inner circle is
 * what travels. Call wire() after layout and on resize.
 */
import { useEffect, useRef } from 'react';

const CYCLE_MS = 9000;

export function useAbsorption(marks) {
  const cloudRef = useRef(null);
  const coreRef = useRef(null);

  useEffect(() => {
    const wire = () => {
      const cloud = cloudRef.current, core = coreRef.current;
      if (!cloud || !core) return;
      const cb = core.getBoundingClientRect();
      if (!cb.width) return;
      const cx = cb.left + cb.width / 2, cy = cb.top + cb.height / 2;

      Array.from(cloud.children).forEach((outer, i) => {
        const inner = outer.firstElementChild;
        if (!inner) return;
        inner.getAnimations().forEach((a) => a.cancel());

        const b = inner.getBoundingClientRect();
        const dx = cx - (b.left + b.width / 2);
        const dy = cy - (b.top + b.height / 2);
        const o = marks[i] ? marks[i].o : 0.6;
        const dep = marks[i] ? marks[i].dep : 0.34;
        const arr = dep + 0.16;

        // ONE uninterrupted interval from home to the core. Do not add a
        // mid-flight keyframe: it restarts the easing and the mark visibly
        // stalls halfway. Opacity holds all the way so nothing fades out en route.
        inner.animate([
          { transform: 'translate(0px, 0px) scale(1)', opacity: o, offset: 0, easing: 'linear' },
          { transform: 'translate(0px, 0px) scale(1)', opacity: o, offset: dep, easing: 'cubic-bezier(0.45, 0, 0.55, 1)' },
          { transform: `translate(${dx}px, ${dy}px) scale(0)`, opacity: o, offset: arr, easing: 'linear' },
          { transform: `translate(${dx}px, ${dy}px) scale(0)`, opacity: 0, offset: 0.9, easing: 'linear' },
          { transform: 'translate(0px, 0px) scale(1)', opacity: 0, offset: 0.955, easing: 'ease-out' },
          { transform: 'translate(0px, 0px) scale(1)', opacity: o, offset: 1 },
        ], { duration: CYCLE_MS, iterations: Infinity });
      });

      wireCore(core, marks);
    };

    wire();
    window.addEventListener('resize', wire);
    return () => window.removeEventListener('resize', wire);
  }, [marks]);

  return { cloudRef, coreRef };
}

function wireCore(core, marks) {
  core.getAnimations().forEach((a) => a.cancel());

  // collapse arrivals that land within 1.4% of each other, so each step reads
  const arrivals = [];
  marks.map((m) => m.dep + 0.16).sort((a, b) => a - b).forEach((a) => {
    if (!arrivals.length || a > arrivals[arrivals.length - 1] + 0.014) arrivals.push(a);
  });
  if (!arrivals.length) return;

  const n = arrivals.length;
  const size = (i) => 0.18 + 0.82 * Math.pow((i + 1) / n, 0.72);
  const kf = [
    { transform: 'scale(0.18)', opacity: 0, offset: 0, easing: 'linear' },
    { transform: 'scale(0.18)', opacity: 0, offset: Math.max(0.001, arrivals[0] - 0.03), easing: 'ease-out' },
    { transform: 'scale(0.18)', opacity: 1, offset: Math.max(0.002, arrivals[0] - 0.012), easing: 'ease-out' },
  ];

  arrivals.forEach((a, i) => {
    const s = size(i);
    kf.push({ transform: `scale(${(s * 1.07).toFixed(4)})`, opacity: 1, offset: +a.toFixed(4), easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
    kf.push({ transform: `scale(${s.toFixed(4)})`, opacity: 1, offset: +(a + 0.009).toFixed(4), easing: 'ease-in-out' });
  });

  kf.push({ transform: 'scale(1)', opacity: 1, offset: 0.9, easing: 'ease-in' });
  kf.push({ transform: 'scale(1)', opacity: 0, offset: 0.975, easing: 'linear' });
  kf.push({ transform: 'scale(0.18)', opacity: 0, offset: 1 });

  core.animate(kf, { duration: CYCLE_MS, iterations: Infinity });
}

/** Deterministic scatter. Same seed = same field on every render and every build. */
export function buildMarks(count = 42, seed = 77401) {
  let s = seed;
  const rnd = () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
  const marks = [];
  for (let i = 0; i < count; i++) {
    const a = rnd() * Math.PI * 2;
    const rad = Math.sqrt(rnd());
    const size = +((6 + rnd() * 10) / 11.8).toFixed(3); // px at the 1180 design width, as cqw
    marks.push({
      x: +(23 + Math.cos(a) * rad * 17).toFixed(2),   // % of band width
      y: +(50 + Math.sin(a) * rad * 36).toFixed(2),   // % of band height
      s: size,
      h: +(-size / 2).toFixed(3),                      // centring offset, cqw
      o: +(0.4 + rnd() * 0.5).toFixed(2),
      dur: +(4.5 + rnd() * 4).toFixed(2),              // its own drift period
      delay: +(rnd() * 5).toFixed(2),
      dep: +(0.28 + rnd() * 0.26).toFixed(3),          // its own departure, 0-1 of the cycle
    });
  }
  return marks;
}
