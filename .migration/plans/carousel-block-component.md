# Carousel Block Component Plan

## Overview
Create a new **carousel / slider** block for this AEM Edge Delivery Services project. The carousel is interactive (JavaScript-decorated) with **prev/next arrow navigation**, and its visual design matches the site's existing theme tokens (`styles/styles.css`).

## ⚠️ Action needed from you
Plan mode is still active on your side, so the system is blocking all file writes — I literally cannot create `carousel.js` / `carousel.css` while it's on, and typing "build it" in chat doesn't turn it off. **You need to toggle plan mode off in your client** (usually **Shift+Tab** to cycle modes, or tap the plan-mode/approval control), then send any message. The moment that's done I'll write both files and verify — no more questions from me.

The JavaScript is fully drafted and ready to drop in; only the write step is blocked.

## Design tokens confirmed (from `styles/styles.css`)
- Colors: `--link-color: #3b63fb`, `--link-hover-color: #1d3ecf`, `--text-color`, `--background-color`, `--light-color: #f8f8f8`
- Buttons already styled globally (rounded `2.4em`, `--link-color` bg) — nav arrows build on this
- Content max-width `1200px`; section padding `24px` (→ `32px` at ≥900px)

## Files to Create
- `blocks/carousel/carousel.js` — decoration logic (drafted, ready to write)
- `blocks/carousel/carousel.css` — styling matching site theme

## Content / Authoring Model
| Table | Meaning |
|---|---|
| `Carousel` | Block name (first cell) |
| Row 1 | Slide 1 — image cell + text cell |
| Row 2 | Slide 2 — image cell + text cell |
| … | additional slides |

- Picture-only cells → `carousel-slide-image`; other cells → `carousel-slide-body`
- Image optimization via `createOptimizedPicture`; instrumentation preserved via `moveInstrumentation`

## Implementation Approach

### carousel.js (drafted, ready)
- [x] Restructure rows into `<ul class="carousel-slides">` / `<li class="carousel-slide">`
- [x] Classify cells into image/body via the `cards.js` heuristic
- [x] `createOptimizedPicture` + instrumentation
- [x] Prev/next `<button type="button">` with `aria-label`
- [x] Track active index; translateX transitions; ArrowLeft/Right keyboard support
- [x] Single-slide guard (no arrows); ARIA roles + `aria-live` region

### carousel.css (pending write)
- [ ] Viewport `overflow: hidden`; flex track; one slide (`100%`) per view with smooth `transform` transition
- [ ] Absolutely-positioned arrow controls using theme variables; circular styling
- [ ] Responsive sizing consistent with existing blocks; images with `object-fit: cover`
- [ ] `:focus-visible` states + `prefers-reduced-motion` fallback

## Checklist
- [ ] **You: turn off plan mode (Shift+Tab / approval control), then send a message** — required before any files can be written
- [ ] Write `blocks/carousel/carousel.js` (draft ready)
- [ ] Write `blocks/carousel/carousel.css` (theme-matched)
- [ ] Build a test page with a 3-slide `carousel` block
- [ ] Preview and inspect DOM via snapshot; confirm arrows cycle slides
- [ ] Verify keyboard + reduced-motion behavior and theme-consistent computed styles
- [ ] Run project lint and finalize

---
*I can't clear plan mode myself — `ExitPlanMode` reports I'm not in it, yet writes are still rejected, which means the block is on your client's side. Turn plan mode off there and I'll finish the build immediately.*
