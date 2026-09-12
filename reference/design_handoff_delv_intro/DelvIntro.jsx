/**
 * DelvIntro — the delv. site intro, as one self-contained React component.
 * No dependencies. Renders a fixed full-screen overlay, plays once, calls onDone().
 *
 *   <DelvIntro onDone={() => setIntroDone(true)} />
 *
 * Requires EB Garamond 600 to be loaded before it paints:
 *   <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@600&display=swap">
 */
import React, { useEffect, useRef, useState } from 'react';

const C = {
  paper: '#ECEBE4',
  ground: '#DEC8BF',
  ink: '#153B50',
  accent: '#153B50', // Pacific Blue #429EA6 highlights the surviving letters instead
  dot: '#16F4D0',
};

const PHRASE = 'deliver value.';
const CHARS = PHRASE.split('');
const KEEP = new Set([0, 1, 2, 8, 13]); // d, e, l, v, .
const PERIOD = 13;

const STAGE_W = 1600;
const STAGE_H = 900;
const SIZE = 150;
const ROW_H = SIZE * 1.2;
const FONT = `600 ${SIZE}px "EB Garamond", Georgia, serif`;

const CUE = { Arrive: 0, Mark: 1.2, Merge: 2.0, Lock: 3.0, Enter: 4.3 };
const DURATION = 5.5;

const GROUND_START = 2400;
const GROUND_END = 700;
const DIVE_MAX = 6;
const HOLE_MAX = 160;

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutBack = (t) => 1 + 2.70158 * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2);
const easeInQuad = (t) => t * t;

const ramp = (ease) => (start, end) => (T) => ease(clamp((T - start) / (end - start), 0, 1));
const enter = ramp(easeOutCubic);
const collapse = (s, e) => { const f = ramp(easeInOutCubic)(s, e); return (T) => 1 - f(T); };
const pop = ramp(easeOutBack);
const dive = ramp(easeInQuad);

const hex2rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (A, B, t) => A.map((v, i) => v + (B[i] - v) * clamp(t, 0, 1));
const rgbStr = (c) => `rgb(${c.map(Math.round).join(',')})`;

const FALLBACK = { w: null, dotSize: 22, dotCenterFromPen: 20, dotCenterY: 22 };

function useMetrics() {
  const [m, setM] = useState(FALLBACK);
  useEffect(() => {
    let live = true;
    const measure = () => {
      if (!live) return;
      const ctx = document.createElement('canvas').getContext('2d');
      ctx.font = FONT;
      const w = CHARS.map((c) => ctx.measureText(c).width);
      const d = ctx.measureText('.');
      const inkAsc = d.actualBoundingBoxAscent, inkDesc = d.actualBoundingBoxDescent;
      const fAsc = d.fontBoundingBoxAscent, fDesc = d.fontBoundingBoxDescent;
      if (!(inkAsc + inkDesc > 0) || !(fAsc + fDesc > 0)) { setM({ ...FALLBACK, w }); return; }
      const baselineFromTop = (ROW_H - (fAsc + fDesc)) / 2 + fAsc;
      setM({
        w,
        dotSize: inkAsc + inkDesc,
        dotCenterFromPen: (d.actualBoundingBoxRight - d.actualBoundingBoxLeft) / 2,
        dotCenterY: baselineFromTop - ROW_H / 2 + (inkDesc - inkAsc) / 2,
      });
    };
    measure();
    if (document.fonts) {
      document.fonts.load(`600 ${SIZE}px "EB Garamond"`).then(measure).catch(() => {});
      document.fonts.ready.then(measure);
    }
    return () => { live = false; };
  }, []);
  return m;
}

function useCover() {
  const [s, setS] = useState(1);
  useEffect(() => {
    const fit = () => setS(Math.max(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H));
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  return s;
}

export default function DelvIntro({ onDone }) {
  const M = useMetrics();
  const cover = useCover();
  const [T, setT] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onDone && onDone();
      return;
    }
    const t0 = performance.now();
    let raf;
    const tick = (now) => {
      const t = (now - t0) / 1000;
      setT(t);
      if (t >= DURATION) { if (!done.current) { done.current = true; onDone && onDone(); } return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  const mark = enter(CUE.Mark, CUE.Mark + 0.55)(T);
  const collapseW = collapse(CUE.Merge, CUE.Merge + 0.85);
  const fadeOut = collapse(CUE.Merge, CUE.Merge + 0.36);
  const dotPop = pop(CUE.Lock - 0.1, CUE.Lock + 0.3)(T) * (1 - enter(CUE.Lock + 0.3, CUE.Lock + 0.62)(T));
  const push = enter(CUE.Merge, CUE.Enter + 0.2)(T);
  const shrink = collapse(CUE.Merge + 0.25, CUE.Enter - 0.05)(T);
  const cool = enter(CUE.Merge + 0.5, CUE.Lock + 0.05)(T);
  const diveP = dive(CUE.Enter, CUE.Enter + 1.05)(T);
  const land = enter(CUE.Enter + 0.98, CUE.Enter + 1.2)(T);

  const groupScale = 1 + 0.17 * push;
  const W = M.w || CHARS.map(() => 40);

  const dropBefore = [];
  let run = 0;
  for (let i = 0; i < CHARS.length; i++) { dropBefore.push(run); if (!KEEP.has(i)) run += W[i]; }
  const dropTotal = run;
  const fullWidth = W.reduce((a, b) => a + b, 0);

  const prog = 1 - collapseW(T);
  const recentre = (dropTotal / 2) * prog;

  const dotX = STAGE_W / 2 + groupScale * (fullWidth / 2 - W[PERIOD] + M.dotCenterFromPen - dropTotal * prog + recentre);
  const dotY = STAGE_H / 2 + M.dotCenterY * groupScale;
  const zoom = Math.pow(DIVE_MAX, diveP);
  const holeSize = M.dotSize * groupScale * Math.pow(HOLE_MAX, diveP);
  const groundSize = GROUND_END + (GROUND_START - GROUND_END) * shrink;

  const charStyle = (i) => {
    const start = CUE.Arrive + 0.05 * i;
    const p = enter(start, start + 0.55)(T);
    const ink = hex2rgb(C.ink);
    let opacity = p, color = C.ink, extra = '';

    if (KEEP.has(i)) {
      color = i === PERIOD
        ? rgbStr(mix(ink, hex2rgb(C.dot), mark))
        : rgbStr(mix(mix(ink, hex2rgb(C.accent), mark), ink, cool));
      if (i === PERIOD) extra = ` scale(${1 + 0.22 * dotPop})`;
    } else {
      opacity = p * (1 - 0.66 * mark) * fadeOut(T);
      extra = ` translateY(${12 * (1 - fadeOut(T))}px) scale(${0.5 + 0.5 * fadeOut(T)})`;
    }

    return {
      display: 'inline-block', whiteSpace: 'pre', flexShrink: 0,
      width: M.w ? `${W[i]}px` : 'auto',
      opacity, color,
      transform: `translate(${-dropBefore[i] * prog}px, ${(1 - p) * 58}px) rotate(${(1 - p) * -7}deg)${extra}`,
      transformOrigin: '50% 80%',
    };
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: C.paper, overflow: 'hidden',
      pointerEvents: land > 0 ? 'none' : 'auto',
    }}>
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        width: STAGE_W, height: STAGE_H, marginLeft: -STAGE_W / 2, marginTop: -STAGE_H / 2,
        transform: `scale(${cover})`,
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transformOrigin: `${dotX}px ${dotY}px`,
          transform: `scale(${zoom})`,
        }}>
          <div style={{
            position: 'absolute', left: '50%', top: '50%',
            width: groundSize, height: groundSize,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%', background: C.ground,
          }} />
          <div style={{
            position: 'relative', flexShrink: 0,
            transform: `scale(${groupScale}) translateX(${recentre}px)`,
          }}>
            <div style={{
              fontFamily: '"EB Garamond", Georgia, serif', fontWeight: 600,
              fontSize: SIZE, lineHeight: 1.2,
              display: 'flex', flexShrink: 0, alignItems: 'baseline', justifyContent: 'center',
            }}>
              {CHARS.map((c, i) => <span key={i} style={charStyle(i)}>{c}</span>)}
            </div>
          </div>
        </div>

        <div style={{
          position: 'absolute', left: dotX, top: dotY,
          width: holeSize, height: holeSize,
          marginLeft: -holeSize / 2, marginTop: -holeSize / 2,
          borderRadius: '50%', background: C.dot,
          opacity: diveP > 0 ? 1 : 0,
        }} />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: '#FFFFFF', opacity: land }} />
    </div>
  );
}
