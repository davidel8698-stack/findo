---
phase: 25-animation-choreography
plan: 03
subsystem: ui
tags: [motion, rtl, react-hooks, scroll-animations, social-proof]

# Dependency graph
requires:
  - phase: 25-02
    provides: SectionReveal and SectionRevealItem components, fadeInRise variants
provides:
  - useDirection hook for RTL-aware slide animations
  - getSlideX helper for direction-aware x-offsets
  - Enhanced SocialProofCounters with SectionReveal integration
  - TestimonialsCarousel with alternating slide-in animations
affects: [future-rtl-animations, carousel-patterns, section-reveals]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - RTL-aware animation offsets via useDirection + getSlideX
    - Alternating slide pattern for carousel items

key-files:
  created:
    - website/lib/hooks/useDirection.ts
  modified:
    - website/lib/hooks/index.ts
    - website/components/sections/social-proof/SocialProofCounters.tsx
    - website/components/sections/social-proof/TestimonialsCarousel.tsx

key-decisions:
  - "50ms stagger for stats (unified impact, simultaneous count-up)"
  - "Alternating slide pattern: even cards from start, odd from end"
  - "RTL defaults: start=right, end=left in Hebrew"
  - "Individual whileInView for carousel cards (not parent stagger)"

patterns-established:
  - "RTL-aware slides: useDirection + getSlideX(fromStart|fromEnd, magnitude, isRTL)"
  - "Carousel animation: individual variants per item with whileInView"

# Metrics
duration: 7min
completed: 2026-02-05
---

# Phase 25 Plan 03: Social Proof Animations Summary

**RTL-aware useDirection hook plus SectionReveal integration for stats counters (50ms unified stagger) and testimonials (alternating slide-in pattern)**

## Performance

- **Duration:** 7 min
- **Started:** 2026-02-05T09:31:01Z
- **Completed:** 2026-02-05T09:38:00Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments
- Created useDirection hook with getSlideX helper for RTL-aware slide calculations
- Enhanced SocialProofCounters with SectionReveal for fast cascade (50ms) stagger
- Added alternating slide-in animations to TestimonialsCarousel with RTL correctness

## Task Commits

Each task was committed atomically:

1. **Task 1: Create useDirection hook for RTL-aware animations** - `5a9bb2d` (feat)
2. **Task 2: Enhance SocialProofCounters with SectionReveal** - `5acb85d` (feat)
3. **Task 3: Add alternating slide-in to TestimonialsCarousel** - `2ee1b02` (feat)

## Files Created/Modified
- `website/lib/hooks/useDirection.ts` - RTL direction detection hook with getSlideX helper
- `website/lib/hooks/index.ts` - Export useDirection, getSlideX, Direction type
- `website/components/sections/social-proof/SocialProofCounters.tsx` - SectionReveal with 50ms stagger
- `website/components/sections/social-proof/TestimonialsCarousel.tsx` - Alternating slide-in with RTL support

## Decisions Made
- **50ms stagger for stats:** Per CONTEXT.md "unified impact, single moment of arrival" - faster than default 65ms
- **Alternating slide pattern:** Even indices (0, 2) from start, odd (1) from end - creates visual interest
- **RTL direction mapping:** In RTL, "start" = right side (+x offset), "end" = left side (-x offset)
- **Individual whileInView:** Carousel items animate independently since they may enter viewport at different times when scrolling through carousel

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all tasks completed without blocking issues.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Social proof section animations complete
- useDirection hook available for any future RTL-aware slide animations
- Ready for 25-04 (Features Grid Stagger) and 25-05 (Footer Cascade)

---
*Phase: 25-animation-choreography*
*Plan: 03*
*Completed: 2026-02-05*
