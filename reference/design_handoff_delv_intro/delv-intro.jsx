// delv-intro.jsx — "deliver value." collapses into the delv. wordmark, then dives into the dot.
const { useState, useEffect } = React;

const PHRASE = 'deliver value.';
const CHARS = PHRASE.split('');
const KEEP = [0, 1, 2, 8, 13]; // d, e, l, v, .
const KEEPSET = new Set(KEEP);
const PERIOD = 13;

const C = {
  paper: '#ECEBE4',
  ink: '#153B50',
  teal: '#429EA6',
  mint: '#16F4D0',
  clay: '#CC998D',
  ground: '#DEC8BF',
};

const SIZE = 150;
const ROW_H = SIZE * 1.2;
const FONT = '600 ' + SIZE + 'px "EB Garamond", Georgia, serif';
const GROUND_START = 2400;
const GROUND_END = 700;
const DIVE_MAX = 6;      // how far the composition itself flies in
const HOLE_MAX = 160;    // how fast the dot swallows the frame

const MOTION = {
  enter: (start, end) => animate({ from: 0, to: 1, start, end, ease: Easing.easeOutCubic }),
  collapse: (start, end) => animate({ from: 1, to: 0, start, end, ease: Easing.easeInOutCubic }),
  pop: (start, end) => animate({ from: 0, to: 1, start, end, ease: Easing.easeOutBack }),
  dive: (start, end) => animate({ from: 0, to: 1, start, end, ease: Easing.easeInQuad }),
};

function hex2rgb(h) { return [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); }
function mix(A, B, t) { return A.map((v, i) => v + (B[i] - v) * clamp(t, 0, 1)); }
function rgbStr(c) { return `rgb(${c.map(Math.round).join(',')})`; }

// Glyph metrics straight from the font, so the dive lands on the full stop's true centre.
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
      document.fonts.load('600 ' + SIZE + 'px "EB Garamond"').then(measure).catch(() => {});
      document.fonts.ready.then(measure);
    }
    const t = setTimeout(measure, 600);
    return () => { live = false; clearTimeout(t); };
  }, []);
  return m;
}

function Piece(props) {
  const { T, CUES } = useComposition();
  const M = useMetrics();
  const widths = M.w;

  const accent = props.accent || C.teal;
  const dotColor = props.dotColor || C.mint;

  const tMark = Number(CUES.Mark), tMerge = Number(CUES.Merge);
  const tLock = Number(CUES.Lock), tEnter = Number(CUES.Enter);

  const mark = MOTION.enter(tMark, tMark + 0.55)(T);
  const collapseW = MOTION.collapse(tMerge, tMerge + 0.85);
  const fadeOut = MOTION.collapse(tMerge, tMerge + 0.36);
  const dotPop = MOTION.pop(tLock - 0.1, tLock + 0.3)(T) * (1 - MOTION.enter(tLock + 0.3, tLock + 0.62)(T));
  const push = MOTION.enter(tMerge, tEnter + 0.2)(T);
  const shrink = MOTION.collapse(tMerge + 0.25, tEnter - 0.05)(T);
  const cool = MOTION.enter(tMerge + 0.5, tLock + 0.05)(T);
  const dive = MOTION.dive(tEnter, tEnter + 1.05)(T);
  const land = MOTION.enter(tEnter + 0.98, tEnter + 1.2)(T);

  const groupScale = 1 + 0.17 * push;
  const W = widths || CHARS.map(() => 40);
  const periodW = W[PERIOD];

  // running total of the width given up by the letters that drop out
  const dropBefore = [];
  let run = 0;
  for (let i = 0; i < CHARS.length; i++) { dropBefore.push(run); if (!KEEPSET.has(i)) run += W[i]; }
  const dropTotal = run;
  const fullWidth = W.reduce((a, b) => a + b, 0);

  const prog = 1 - collapseW(T);
  const recentre = (dropTotal / 2) * prog;

  // where the full stop sits on the 1600x900 stage — the point the camera dives into
  const dotX = 800 + groupScale * (fullWidth / 2 - periodW + M.dotCenterFromPen - dropTotal * prog + recentre);
  const dotY = 450 + M.dotCenterY * groupScale;
  const zoom = Math.pow(DIVE_MAX, dive);
  const holeSize = M.dotSize * groupScale * Math.pow(HOLE_MAX, dive);

  const charStyle = (i) => {
    const start = Number(CUES.Arrive) + 0.05 * i;
    const p = MOTION.enter(start, start + 0.55)(T);
    const keep = KEEPSET.has(i);
    let opacity = p, color = C.ink, extra = '';

    if (keep) {
      const ink = hex2rgb(C.ink);
      color = i === PERIOD
        ? rgbStr(mix(ink, hex2rgb(dotColor), mark))
        : rgbStr(mix(mix(ink, hex2rgb(accent), mark), ink, cool));
      if (i === PERIOD) extra = ` scale(${1 + 0.22 * dotPop})`;
    } else {
      opacity = p * (1 - 0.66 * mark) * fadeOut(T);
      extra = ` translateY(${12 * (1 - fadeOut(T))}px) scale(${0.5 + 0.5 * fadeOut(T)})`;
    }

    return {
      display: 'inline-block', whiteSpace: 'pre', flexShrink: 0,
      width: widths ? W[i] + 'px' : 'auto',
      opacity, color,
      transform: `translate(${-dropBefore[i] * prog}px, ${(1 - p) * 58}px) rotate(${(1 - p) * -7}deg)${extra}`,
      transformOrigin: '50% 80%',
    };
  };

  const typeFont = { fontFamily: '"EB Garamond", Georgia, serif', fontWeight: 600, fontSize: SIZE, lineHeight: 1.2 };
  const groundSize = GROUND_END + (GROUND_START - GROUND_END) * (props.halo === false ? 1 : shrink);

  return (
    <div style={{ position: 'absolute', inset: 0, background: C.paper, overflow: 'hidden' }}>
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

        <div style={{ position: 'relative', flexShrink: 0, transform: `scale(${groupScale}) translateX(${recentre}px)` }}>
          <div style={{ ...typeFont, display: 'flex', flexShrink: 0, alignItems: 'baseline', justifyContent: 'center' }}>
            {CHARS.map((c, i) => <span key={i} style={charStyle(i)}>{c}</span>)}
          </div>
        </div>
      </div>

      <div style={{
        position: 'absolute', left: dotX, top: dotY,
        width: holeSize, height: holeSize, marginLeft: -holeSize / 2, marginTop: -holeSize / 2,
        borderRadius: '50%', background: dotColor,
        opacity: dive > 0 ? 1 : 0, pointerEvents: 'none',
      }} />
      <div style={{ position: 'absolute', inset: 0, background: '#FFFFFF', opacity: land, pointerEvents: 'none' }} />
    </div>
  );
}

function DelvIntroApp() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <CompositionStage width={1600} height={900} bg={C.paper}
        scenes={window.OM_SCENES} playback={window.OM_PLAYBACK}>
        <Piece accent={t.accent} dotColor={t.dotColor} halo={t.halo} />
      </CompositionStage>
      <TweaksPanel>
        <TweakSection label="Brand" />
        <TweakColor label="Highlight" value={t.accent}
          options={[C.teal, C.mint, C.clay]}
          onChange={(v) => setTweak('accent', v)} />
        <TweakColor label="Dot" value={t.dotColor}
          options={[C.mint, C.teal, C.clay]}
          onChange={(v) => setTweak('dotColor', v)} />
        <TweakToggle label="Contract to circle" value={t.halo} onChange={(v) => setTweak('halo', v)} />
        <TweakSection label="Editing" />
        <TweakToggle label="Motion editor" value={t.motionEditor}
          onChange={(v) => setTweak('motionEditor', v)} />
      </TweaksPanel>
    </div>
  );
}

window.DelvIntroApp = DelvIntroApp;
