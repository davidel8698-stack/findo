---
phase: 31-motion-accessibility
plan: 02
subsystem: ui
tags: [css, animation, @property, shimmer, motion, accessibility]

# Dependency graph
requires:
  - phase: 31-01
    provides: Motion tokens in globals.css (--duration-shimmer, --delay-shimmer)
provides:
  - "@property --shimmer-angle CSS custom property"
  - "@keyframes shimmer-rotate animation"
  - ".shimmer-border CSS class with ::before/::after pseudo-elements"
  - "ShimmerCard React component"
  - "prefers-reduced-motion fallback for shimmer"
affects: [hero-sections, featured-cards, 31-03, phase-32]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "@property for GPU-accelerated CSS custom property animation"
    - "conic-gradient for rotating shimmer effect"
    - "Wrapper pseudo-element technique for gradient borders"

key-files:
  created: []
  modified:
    - website/app/globals.css
    - website/components/ui/card.tsx

key-decisions:
  - "Used @property for GPU-accelerated angle animation (avoids JS-based rotation)"
  - "conic-gradient with 12% color wedge for subtle shimmer sweep"
  - "Static fallback for Safari pre-15.4 using linear-gradient"

patterns-established:
  - "shimmer-border: Premium rotating border effect for hero elements only"
  - "ShimmerCard: Component wrapper with noShimmer prop for conditional disable"

# Metrics
duration: 8min
completed: 2026-02-06
---

# Phase 31 Plan 02: Shimmer Border Effect Summary

**GPU-accelerated rotating shimmer border using CSS @property with ShimmerCard component wrapper and full accessibility fallbacks**

## Performance

- **Duration:** 8 min
- **Started:** 2026-02-06
- **Completed:** 2026-02-06
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Implemented @property --shimmer-angle for GPU-accelerated CSS animation
- Created shimmer-rotate keyframes with conic-gradient for premium border effect
- Added ShimmerCard component with noShimmer prop for hero/featured elements
- Built comprehensive accessibility fallbacks (prefers-reduced-motion, Safari pre-15.4)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add shimmer CSS animation to globals.css** - `7b8b4cd` (feat)
2. **Task 2: Add ShimmerCard component to card.tsx** - `6efc66c` (feat)

## Files Created/Modified
- `website/app/globals.css` - Added @property --shimmer-angle, @keyframes shimmer-rotate, .shimmer-border class with ::before/::after pseudo-elements, reduced motion fallback, Safari fallback
- `website/components/ui/card.tsx` - Added ShimmerCard component with noShimmer prop, exported from module

## Decisions Made
- Used @property for GPU-accelerated angle animation (avoids JS-based rotation)
- conic-gradient with 12% color wedge (0-12%, 88-100%) for subtle shimmer sweep
- Static linear-gradient fallback for Safari pre-15.4 (@supports not (font: -apple-system-body))
- Reduced motion fallback shows static 20% opacity border (no animation)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Shimmer border effect ready for hero card implementation
- ShimmerCard component available for feature sections
- Motion tokens from 31-01 integrated (--duration-shimmer, --delay-shimmer)
- Ready for Plan 03 (Hero Card implementation)

---
*Phase: 31-motion-accessibility*
*Completed: 2026-02-06*
