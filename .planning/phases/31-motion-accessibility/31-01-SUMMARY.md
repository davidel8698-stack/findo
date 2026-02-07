---
phase: 31-motion-accessibility
plan: 01
subsystem: ui
tags: [css-variables, animation, easing, duration, motion, tailwind]

# Dependency graph
requires:
  - phase: 30-component-library
    provides: Base component library with AnimatedButton using springLinear
provides:
  - CSS easing curves (standard, bouncy, material, quick-press)
  - CSS duration tokens (hover, reveal, shimmer)
  - JS constants matching CSS for Motion components
affects: [31-02, 31-03, all-motion-phases]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - CSS custom properties for motion in @theme block
    - JS constants matching CSS variables for consistency

key-files:
  created: []
  modified:
    - website/app/globals.css
    - website/lib/animation.ts

key-decisions:
  - "Easing values use Linear-style cubic-bezier curves"
  - "Duration tokens follow MOTION-02/03/04 spec ranges"
  - "JS constants exported as const for type safety"

patterns-established:
  - "CSS easing/duration tokens in @theme for Tailwind access"
  - "Matching JS exports in animation.ts for Motion component parity"

# Metrics
duration: 5min
completed: 2026-02-06
---

# Phase 31 Plan 01: Easing & Duration Tokens Summary

**CSS easing curves (standard, bouncy, material, quick-press) and duration tokens (hover 150ms, reveal 400ms, shimmer 1.5s) for Linear-style motion system**

## Performance

- **Duration:** 5 min
- **Started:** 2026-02-06
- **Completed:** 2026-02-06
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Four easing curves as CSS custom properties in @theme
- Duration tokens for hover (150-200ms), reveal (300-500ms), shimmer (1.5s/3s)
- Matching JS constants in animation.ts for Motion component consistency
- Build passes with no TypeScript errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Add CSS easing and duration tokens to globals.css** - `4013ea8` (feat)
2. **Task 2: Add matching JS constants to animation.ts** - `9ea9900` (feat)

## Files Created/Modified
- `website/app/globals.css` - Added easing curves and duration tokens in @theme block
- `website/lib/animation.ts` - Added cssEasing and cssDuration exports

## Decisions Made
- Easing curves follow Linear-style feel with smooth ease-out (standard) and slight overshoot (bouncy)
- Duration tokens align with MOTION requirements: 150-200ms hover, 300-500ms reveal, 1.5s shimmer
- JS constants use `as const` for full type inference in Motion components

## Deviations from Plan
None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Easing and duration tokens ready for use in AnimatedButton, cards, and section reveals
- CSS variables accessible via Tailwind utilities
- JS constants ready for Motion component transitions
- Foundation complete for Phase 31 plans 02-03

---
*Phase: 31-motion-accessibility*
*Completed: 2026-02-06*
