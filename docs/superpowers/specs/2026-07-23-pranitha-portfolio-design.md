# Pranitha Andra — Portfolio Site Design

**Date:** 2026-07-23
**Source content:** https://www.behance.net/pranithaandra

## Goal

A minimal, image-forward personal portfolio website for Pranitha Andra with
interactive-but-restrained design ("clean gallery + subtle motion"). Three work
sections plus an About page. All artwork is pulled from the Behance profile.

## Person / About

- **Name:** Pranitha Andra
- **Location:** San José, CA, USA
- **Role / tagline:** Designer · Visual Development · Environment Artist
- **Availability:** Available for freelance & full-time
- **Links:** Instagram (@pranitha_andra), LinkedIn

## Stack

- Static site: hand-written HTML + CSS + a small amount of vanilla JS.
- No build step, no framework, no dependencies.
- Runs by opening `index.html` directly or via any static host
  (Netlify / GitHub Pages).

Rationale: minimal, fast, durable, image-first. A framework/build would add
maintenance cost with no benefit for a small static portfolio.

## Pages

1. `index.html` — landing hero + the three work sections in one scrolling page.
2. `about.html` — About Me.

## Content mapping (Behance → sections)

| Section | Group | Behance project(s) (gallery id) |
|---|---|---|
| Visual Development | — | Dream? (251034483), Heavy bloom (167243753), Corner Stop (128259243) |
| Design | — | 2026 DESIGN PORTFOLIO (241494523) |
| Backgrounds | Environment Artworks | curated environment/landscape images hand-picked from across all projects |
| Backgrounds | Reference Study | Portrait Study (147234957) + Film studies :D (102992055), combined |
| Backgrounds | Photobashing | Photobashing (132866717) |

## Layout & interaction

- **Nav:** minimal sticky top bar — name/monogram left; "Work · About" right.
  Smooth-scroll to sections on the home page; About is its own page.
- **Hero:** large name + role tagline, generous whitespace.
- **Sections:** each is a heading + a responsive image grid of project covers.
  Visual Development and Design list their projects directly. Backgrounds is
  presented as three named sub-groups (Environment Artworks, Reference Study,
  Photobashing).
- **Lightbox:** clicking a cover opens a lightbox that steps through all of that
  project's images. Controls: left/right arrows and on-screen arrows, swipe on
  touch, Esc/click-outside to close, image counter.
- **Motion (restrained):** fade-up reveal on scroll (IntersectionObserver),
  gentle hover zoom on thumbnails, smooth lightbox fades/transitions. All motion
  gated behind `prefers-reduced-motion: no-preference`.
- **Responsive:** multi-column grid on desktop collapsing to a single column on
  mobile; nav and hero scale down.

## Visual style

- **Canvas:** warm off-white background (~`#faf8f5`), near-black ink
  (~`#1a1a1a`), one restrained accent color.
- **Type:** refined serif for display headings + a clean sans for body/UI
  (loaded from Google Fonts or system stack). Elegant, understated — the art
  leads.

## Asset pipeline

- Download high-resolution WebP (~1400px wide) for every needed project image
  from the Behance CDN (`mir-s3-cdn-cf.behance.net/project_modules/1400_webp/…`)
  into `images/<project-slug>/`.
- Images are lazy-loaded (`loading="lazy"`) and sized to avoid layout shift.
- A `data.js` module maps sections → groups → projects → ordered image lists so
  galleries and the lightbox are data-driven and easy to update later.
- For **Environment Artworks**, after downloading, review the images and
  hand-pick the environment/landscape pieces into that group.

## File structure

```
index.html
about.html
css/style.css
js/data.js        # section/project/image data model
js/main.js        # scroll reveal, lightbox, nav behavior
images/<slug>/*.webp
```

## Out of scope (YAGNI)

- CMS / admin, contact form backend, blog, analytics.
- Build tooling, bundlers, package managers.
- Projects not listed in the mapping above (e.g. Just some cats, Characters of
  alie, Character sketches, The struggle XO, Affter effects) — unless they
  contribute an environment image to the curated Environment Artworks group.
