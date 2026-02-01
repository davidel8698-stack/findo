---
phase: 14-hero-first-impression
plan: 05
subsystem: ui
tags: [gsap, animation, hero, ux-copy, conversion]

# Dependency graph
requires:
  - phase: 14-02
    provides: ActivityFeed component with GSAP timeline
  - phase: 14-01
    provides: HeroContent component with headline
provides:
  - Fixed GSAP fromTo animation for activity cards
  - Outcome-focused Hebrew headline for 5-second test
  - UAT gap closure for tests 1, 2, 3, 8, 10, 12
affects: [phase-15, uat-retest]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "GSAP fromTo for elements with initial CSS opacity-0"

key-files:
  created: []
  modified:
    - website/components/sections/hero/ActivityFeed.tsx
    - website/components/sections/hero/HeroContent.tsx

key-decisions:
  - "Use gsap.fromTo() not gsap.from() when target has CSS opacity-0"
  - "Headline outcome-focused: 'More customers. Less work.' (4 words)"

patterns-established:
  - "GSAP opacity animation: Use fromTo when CSS sets initial opacity"

# Metrics
duration: 2min
completed: 2026-02-01
---

# Phase 14 Plan 05: UAT Gap Closure Summary

**GSAP fromTo animation fix for invisible activity cards + outcome-focused Hebrew headline passing 5-second test**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-01T09:38:46Z
- **Completed:** 2026-02-01T09:40:24Z
- **Tasks:** 2/2
- **Files modified:** 2

## Accomplishments

- Fixed GSAP animation: cards now animate from opacity 0 to 1 (were staying invisible)
- Replaced mechanism-focused headline with outcome-focused "More customers. Less work."
- Subheadline now explains 24/7 automation with specific actions
- Closes UAT gaps: tests 1, 2, 3, 8, 10, 12 should now pass on re-test

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix GSAP animation** - `a71ed72` (fix)
2. **Task 2: Outcome-focused headline** - `dd08078` (fix)

## Files Created/Modified

- `website/components/sections/hero/ActivityFeed.tsx` - Changed tl.from() to tl.fromTo() with explicit start/end opacity
- `website/components/sections/hero/HeroContent.tsx` - Updated headline and subheadline copy

## Decisions Made

1. **GSAP fromTo pattern** - Cards have `opacity-0` CSS class to prevent FOUC. gsap.from() animates FROM specified values TO current CSS state, so 0->0 = invisible. gsap.fromTo() explicitly sets both ends: 0->1 = visible.

2. **Outcome-focused copy** - UAT showed metaphorical headline failed 5-second test. New headline "More customers. Less work." directly states outcome (more customers) and benefit (less work) that business owners care about.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - both fixes applied cleanly with no complications.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 14 UAT gaps closed
- Ready for UAT re-test of tests 1, 2, 3, 8, 10, 12
- Phase 15 (Social Proof & Trust) can begin after re-test passes

---
*Phase: 14-hero-first-impression*
*Completed: 2026-02-01*
