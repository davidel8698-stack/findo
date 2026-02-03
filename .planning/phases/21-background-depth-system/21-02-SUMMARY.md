---
phase: 21-background-depth-system
plan: 02
subsystem: ui
tags: [gsap, parallax, background, layout, performance, lighthouse]

# Dependency graph
requires:
  - phase: 21-01
    provides: BackgroundDepth component with grid, orbs, and noise layers
  - phase: 20
    provides: Typography and gradient foundation with CSS variables pattern
provides:
  - BackgroundDepth integrated into website root layout
  - CSS variables for background depth system tuning
  - Verified Lighthouse 95+ performance on mobile and desktop
affects: [22-scroll-polish, 23-micro-interactions, 26-glassmorphism]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Background layers positioned behind all page content via z-index -10"
    - "CSS variables in @theme block for tunable visual systems"

key-files:
  created: []
  modified:
    - website/app/layout.tsx
    - website/app/globals.css

key-decisions:
  - "BackgroundDepth placed as direct child of body, outside Providers wrapper"
  - "CSS variables defined for future tuning without component changes"

patterns-established:
  - "Full-page visual layers: position fixed, inset 0, pointer-events none, z-index -10"
  - "Background system variables: --bg-* prefix in @theme block"

# Metrics
duration: 5min
completed: 2026-02-03
---

# Phase 21 Plan 02: Layout Integration Summary

**BackgroundDepth component integrated into root layout with grid, orbs, and noise layers - Lighthouse 95+ verified on mobile and desktop**

## Performance

- **Duration:** 5 min
- **Started:** 2026-02-03T18:17:58Z
- **Completed:** 2026-02-03T18:25:00Z
- **Tasks:** 3
- **Files modified:** 2

## Accomplishments

- BackgroundDepth component rendered in website root layout behind all page content
- CSS variables added for background depth system tuning (--bg-grid-opacity, --bg-orb-blur, etc.)
- Human-verified: grid pattern, blurred orbs, noise texture, scroll parallax all working
- Lighthouse Performance 95+ confirmed on both mobile and desktop

## Task Commits

Each task was committed atomically:

1. **Task 1: Integrate BackgroundDepth into Layout** - `a34881a` (feat)
2. **Task 2: Add CSS Variables for Background Tuning** - `ea8677b` (feat)
3. **Task 3: Visual and Performance Verification** - CHECKPOINT APPROVED (human-verify)

**Plan metadata:** (this commit) (docs: complete plan)

## Files Created/Modified

- `website/app/layout.tsx` - Added BackgroundDepth import and render before Providers
- `website/app/globals.css` - Added CSS variables for background depth tuning

## Decisions Made

- **BackgroundDepth placement:** Direct child of body, outside Providers wrapper - ensures background is always behind all page content regardless of provider/context structure
- **CSS variables for tuning:** Defined --bg-grid-opacity, --bg-orb-blur, --bg-noise-opacity, --bg-noise-size for future adjustments without component changes

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - integration proceeded smoothly with human verification confirming all visual and performance requirements.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Background depth system complete and production-ready
- Lighthouse 95+ maintained - performance budget intact
- Ready for Phase 22 (Scroll Polish) to enhance scroll behaviors
- Background layers provide foundation for Phase 26 (Glassmorphism) glass cards

---
*Phase: 21-background-depth-system*
*Completed: 2026-02-03*
