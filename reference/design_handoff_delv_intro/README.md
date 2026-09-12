# Handoff: delv. site intro animation

## Overview
A 5.5-second brand intro that plays once on first entry to the delv. website. The phrase
**deliver value.** types itself into place, the letters that are not part of the logo drop
away, the survivors slide together into **delv.**, and the camera then dives into the
aquamarine full stop until it fills the frame and opens onto the site.

## About the design files
Everything in this bundle is a **design reference built in HTML** — a prototype of the
intended look and timing, not production code to paste in. `DelvIntro.jsx` is the closest
thing to a drop-in: a single dependency-free React component that reproduces the piece
exactly. Recreate or adapt it using your codebase's own conventions (your animation
library, your overlay/portal pattern, your font loading). If your site is not React, the
timing table and geometry below are enough to rebuild it in any framework.

## Fidelity
**High-fidelity.** Colours, type, timing and easing are final. Reproduce them exactly.

---

## Design tokens

| Token | Hex | Used for |
| --- | --- | --- |
| Soft Linen | `#ECEBE4` | page ground behind the circle |
| Rosy Taupe | `#CC998D` | brand reference (not painted directly) |
| Ground | `#DEC8BF` | the full-bleed field that contracts to the circle — Rosy Taupe lightened toward Soft Linen |
| Yale Blue | `#153B50` | the wordmark |
| Pacific Blue | `#429EA6` | highlight option for the surviving letters (currently set to Yale Blue) |
| Aquamarine | `#16F4D0` | the full stop, and the dive |
| White | `#FFFFFF` | the final flash that hands off to the site |

**Type:** EB Garamond, weight 600 (Semibold). This is the logo's own typeface, which is why
the animation can end on live text rather than the SVG.
Google Fonts: `https://fonts.googleapis.com/css2?family=EB+Garamond:wght@600&display=swap`

**Design stage:** 1600 × 900. Font size 150px, line-height 1.2 (row height 180px). Every
measurement below is in that coordinate space; scale the whole stage to cover the viewport
(`scale = max(vw/1600, vh/900)`).

---

## Timeline

Total 5.5s, played once. Section starts are the running sum of the durations.

| Scene | Start | Dur | What happens |
| --- | --- | --- | --- |
| Arrive | 0.0 | 1.2 | The 14 characters of `deliver value.` rise 58px, rotate from −7°, and fade in, staggered 0.05s apart, each over 0.55s |
| Mark | 1.2 | 0.8 | The letters that are not `d e l v .` fade to 34% over 0.55s; the full stop turns Aquamarine |
| Merge | 2.0 | 1.0 | The dropped letters fall 12px, shrink to 50% and fade out (0.36s); every character slides left by the total width of the dropped letters before it (0.85s) |
| Lock | 3.0 | 1.3 | The ground contracts from a 2400px disc to a 700px circle; the full stop bumps to 122% and settles back to 100% |
| Enter | 4.3 | 1.2 | The composition zooms 6× about the full stop while the full stop itself expands 160×, filling the frame; white fades in over the last 0.22s |

### Easing
Three curves carry everything:
- `enter` — easeOutCubic (entrances, fades, settles)
- `collapse` — easeInOutCubic (the letter collapse, the ground contraction)
- `pop` — easeOutBack (the full stop's bump)
- `dive` — easeInQuad, driving an exponential scale `pow(n, t)` so the zoom feels constant-rate

---

## Geometry that matters

**The letters.** `deliver value.` — indices 0,1,2 (`d e l`), 8 (`v`) and 13 (`.`) survive;
the other nine drop. Measure each character's advance width with canvas `measureText` at
`600 150px "EB Garamond"`. Do **not** animate CSS `width` — that reflows the whole row every
frame and visibly janks. Instead give every character its fixed measured width and translate
it left by the cumulative width of the dropped characters before it, then translate the row
right by half the total dropped width so it stays centred.

**The dive target.** The camera must scale about the full stop's exact ink centre, or the
frame lurches sideways. Get it from canvas `TextMetrics` for `.`:
- horizontal centre within its advance = `(actualBoundingBoxRight − actualBoundingBoxLeft) / 2`
- vertical centre relative to the row centre = `baselineFromTop − rowHeight/2 + (actualBoundingBoxDescent − actualBoundingBoxAscent) / 2`, where `baselineFromTop = (rowHeight − (fontBoundingBoxAscent + fontBoundingBoxDescent))/2 + fontBoundingBoxAscent`

Set `transform-origin` to that point and apply **scale only** — no translation. Panning to
recentre while the zoom is still shallow is what made earlier versions feel broken.

**The dive itself.** Scaling live text to 400× rasterises badly. Instead the composition
zooms a modest 6×, and a separate Aquamarine circle — positioned at the full stop's stage
coordinates, starting at exactly the glyph's ink diameter — grows 160× on top of it. Because
it starts the same size, in the same place, in the same colour, it reads as the full stop
itself swallowing the screen.

---

## Behaviour on the site

- Plays once, on first entry. Gate it in `sessionStorage` (or `localStorage` for once-ever)
  so returning visitors are not made to sit through it.
- Renders as a `position: fixed` overlay above the page at a high z-index, with
  `pointer-events: none` once the white flash begins so it never blocks a click.
- Unmount on completion — `DelvIntro.jsx` fires `onDone()` at 5.5s.
- **Honour `prefers-reduced-motion`.** `DelvIntro.jsx` skips straight to `onDone()`.
- Preload EB Garamond 600 before the overlay paints; a fallback-font first frame changes the
  measured widths and the letters will jump when the real font swaps in.

## State
One value: elapsed time in seconds, advanced by `requestAnimationFrame` from a `performance.now()`
baseline. Everything visible is a pure function of it — there is no other state, and no
per-frame DOM reads.

## Assets
- `delv-03.svg` — the supplied logo. **Not used by the animation** (the end frame is live
  EB Garamond text, which matches). Keep it for static placements.

## Files in this bundle
| File | What it is |
| --- | --- |
| `DelvIntro.jsx` | Self-contained React component, no dependencies — the thing to port |
| `Delv Intro.dc.html` | The prototype page as built, for reference |
| `delv-intro.jsx` | The prototype's source, built on a timeline engine with a scrubber |
| `delv-03.svg` | The supplied logo |
