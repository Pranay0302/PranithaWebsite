# Film section, Thayyam gallery, and spark cursor

Date: 2026-07-23
Status: Approved

## Goal

Add a "Film" category to the portfolio containing a "Thayyam" concept-art
project (the eight images in `images/concepts/`), shown as an aesthetically
pleasing grid. Give Film / Thayyam its own cursor treatment: warm sparks
instead of ink splots. Calm the default ink splots site-wide.

## Decisions (from brainstorming)

1. **Structure:** "Film" is a new section in the `PORTFOLIO` data model, with a
   nav tab and a `film.html` page built like `illustrations.html`. The Thayyam
   collection lives inside it. Because Home renders every collection, the
   Thayyam card appears next to Illustrations automatically.
2. **Grid view:** the project viewer (lightbox) renders Thayyam as a responsive
   masonry grid (whole images, no cropping) instead of the vertical stack.
3. **Spark cursor scope:** sparks are active across the whole Film page and
   whenever the Thayyam viewer is open from any page. Ink everywhere else.

## Changes

### Data model (`js/data.js`)
Add a fourth section after Illustrations:

- `id: "film"`, `num: "04"`, `title: "Film"`, blurb about concept art for film.
- One collection `Thayyam`, `note: "Concept art"`, `cover: concept-1.jpeg`,
  `layout: "grid"`, `cursor: "spark"`, `images: img("concepts", [concept-1..8])`.

### Page + nav
- New `film.html`: copy of `illustrations.html` with `data-section="film"`,
  `data-autoopen="true"`, updated `<title>` / meta and `aria-current`.
- Add `<a href="film.html">Film</a>` after the Illustrations link in the nav of
  every page: index, visual-dev, design, illustrations, about, film.

### Grid viewer (`js/main.js` + `css/style.css`)
- `openLightbox` adds class `lb__stack--grid` to `.lb__stack` when
  `collection.layout === "grid"`.
- CSS `.lb__stack--grid`: CSS multi-column masonry (2 cols, 3 on wide screens),
  `break-inside: avoid`; images full width, auto height. Other viewers unchanged.

### Spark cursor (`js/main.js`)
- Introduce `cursorMode` (`"ink"` default, `"spark"`). Base mode is `spark` when
  the page's `#work` has `data-section="film"`.
- Particles carry a `type` (`"ink"` | `"spark"`). `onMove` spawns the type for
  the current mode.
- Spark = small warm dot with additive glow (`globalCompositeOperation
  = "lighter"`), color chosen from orange `#ff7a18`, red `#e0341f`, yellow
  `#ffd24a`, small outward + slight upward velocity, quick fade.
- `openLightbox` sets `cursorMode = "spark"` when `collection.cursor === "spark"`;
  `closeLightbox` reverts to the page base mode.

### Calmer ink (`js/main.js`)
Tune the default ink splot down on three axes:
- Less spread: base radius `2 + rand*2.5 + min(speed*2, 3.5)`; growth `×0.02..0.06`.
- Shorter spread: tendril length `0.7..1.4×`; droplet distance `1.2..3.0×`.
- Less intensity: alpha `0.28..0.44`.
Ink color `20,18,15` unchanged. Values easily tunable after live review.

## Out of scope
Lightbox close/scroll behavior, touch and reduced-motion paths (trail already
runs only on fine pointer, non-reduced-motion).
