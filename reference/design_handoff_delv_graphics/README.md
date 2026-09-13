# Handoff: delv. section graphics

## Overview
Five section graphics and one icon set for delv.health. They are **conceptual, not
evidential** — no figures, no axes, nothing that could be read as a result. Each carries
one idea, and all six are built from the same small vocabulary: a field of marks, a
boundary, and one thing that survives.

| # | Graphic | Belongs on | Motion |
| --- | --- | --- | --- |
| 01 | Distillation | Home hero | Slow drift, breathing ring |
| 02 | Same ink, one form | Home, Before / After | 9s loop, JS-driven |
| 03 | Define · Measure · Articulate | Home, three-stage block | 9s loop, CSS |
| 04 | One finding, more than one job | What we do — Articulate | 11s loop, CSS |
| 05 | The engagement, drawing itself | How we work | 11s loop, CSS |
| 06 | Repeating marks | Anywhere a list needs a face | Static |

## About the design files
These are **design references built in HTML**, not a component library. `graphics.html`
carries the exact markup, `delv-graphics.css` the exact motion. Port them into the site's
own conventions — your component structure, your scroll-reveal pattern, your token names.
The markup is plain divs, SVG and inline styles, so it transfers with very little
translation.

## Fidelity
**High-fidelity.** Colours, geometry and timing are final.

---

## Palette

| Token | Hex | Role here |
| --- | --- | --- |
| Soft Linen | `#ECEBE4` | light band grounds |
| Yale Blue | `#153B50` | dark band grounds, strokes, filled marks |
| Rosy Taupe | `#CC998D` | the scattered marks — undifferentiated activity |
| Pacific Blue | `#429EA6` | the measuring rules |
| Aquamarine | `#16F4D0` | the one thing that counts, every time |

The page ground behind the bands is the site's own `#F7F7F3`.
Display type is **EB Garamond 600** (the logo face); captions are Figtree.

---

## The one engineering rule: `cqw`, not `px`

Every band is a **size container** (`container-type: inline-size`) and every mark, ring and
disc inside it is sized in `cqw`. This is not a stylistic choice — it is what stops the
graphics breaking. An earlier version sized the focal points in fixed px inside fluid bands;
below ~700px the band hit its `min-height` floor and stopped shrinking vertically while the
focal points did not shrink at all, so discs collided with labels and the hero's rings
clipped past the band edge.

The design width is **1180px**, so `1cqw` = 11.8px at full size. Any px value taken from a
mock should be divided by 11.8 before it goes in.

Graphic 05 is the exception: it is an SVG on a 1180×240 viewBox with `min-width: 620px`
inside an `overflow-x: auto` band. A four-node horizontal flow cannot usefully compress to
a phone width — below 620px it scrolls rather than collapsing into sub-pixel strokes.

---

## Graphic by graphic

**01 Distillation.** A field of taupe marks, dense at the left and thinning to the right,
resolving into one aquamarine point inside two rings. Each mark drifts on its own period and
phase. Density is generated from a fixed seed — same field every build.

**02 Same ink, one form.** The scatter travels into the core and is absorbed. The two things
that make it work, both easy to lose in a port:
- Each mark departs on **its own** schedule and flies a **single uninterrupted interval**
  from home to the core. A mid-flight keyframe restarts the easing and every mark visibly
  stalls halfway. Opacity holds full the whole way; the mark scales to zero exactly at the rim.
- The core's keyframes are **generated from the marks' actual arrival times**, so it gains a
  step of size with a small overshoot each time one lands. A fixed growth curve reads as the
  cloud simply disappearing.
See `AbsorptionCore.jsx`. Two aquamarine rings pulse outward during the absorption window.

**03 Define · Measure · Articulate.** Three stages on one shape. A boundary closes with a few
marks left outside it; a scale wipes across it edge to edge; it resolves into one filled claim
with two smaller restatements. Sequenced on a shared 9s cycle.

**04 One finding, more than one job.** The source emits three times; each parcel travels to a
differently shaped container and fills it. The source **shrinks as it gives** — the point is
that nothing is restated that was not there. Three containers for the three audiences the
copy names (business case, founder's slide, investor's line). Unlabelled.

**05 The engagement, drawing itself.** Four states of one claim, each more resolved than the
last: an unclosed ring, a closed ring, a measured ring, a filled mark with its centre. The
line draws between them in sequence and **carries on past the final node, off the right
edge** — that detail is the page's actual argument, so don't crop it. No stage names, no time
labels. Connectors use `pathLength="100"` so a single dashoffset animation drives segments of
different lengths.

**06 Repeating marks.** The same shapes at list size: claim unclosed, claim evidenced,
undifferentiated activity, measured, restated. Static SVG, stroke-width 2.75.

---

## Behaviour on the site
- All loops are infinite and independent; nothing needs to be synchronised across sections.
- Prefer starting them on scroll into view rather than at page load — `IntersectionObserver`
  toggling `animation-play-state`, or mounting graphic 02 only when visible.
- **Honour `prefers-reduced-motion`.** Every graphic has a legible resting state: for 02 and
  04 that is the end of the cycle (core grown, containers filled); for 03 and 05 it is the
  fully drawn state. Render those statically rather than suppressing the graphic.
- Text contrast inside the graphics was checked against WCAG AA; the band-02 labels sit at
  0.82 alpha on Yale Blue for that reason. Don't dial them back.

## Accessibility
The graphics are decorative — they restate the body copy, they do not add information. Mark
them `aria-hidden="true"` and leave them out of the tab order.

## Files in this bundle
| File | What it is |
| --- | --- |
| `graphics.html` | Exact markup for all six, one `<section>` each |
| `delv-graphics.css` | The motion layer — every `@keyframes` used |
| `AbsorptionCore.jsx` | Graphic 02's JS: travel paths and the arrival-keyed core |
| `Delv Graphics.dc.html` | The live prototype, for reference |

## Not in scope
The two image placeholders on *What we do* and *How we work*, and the three on *Who we are*,
are briefs for real photography. They should stay photography — abstract marks there would
work against a page whose argument is first-hand experience.
