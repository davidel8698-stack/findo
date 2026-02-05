---
phase: 25-animation-choreography
plan: 01
subsystem: ui
tags: [gsap, animation, react-hooks, entrance-choreography, reduced-motion]

# Dependency graph
requires:
  - phase: 13-design-system
    provides: GSAP config and useGSAP hook integration
  - phase: 24-micro-interactions
    provides: useShake hook pattern in lib/hooks
provides:
  - useHeroEntrance hook with 7-phase GSAP timeline
  - Hero entrance choreography (~1.2s orchestrated sequence)
  - Reduced motion accessibility fallback (opacity-only, 150ms)
  - lib/hooks barrel export pattern
affects: [25-02-scroll-reveals, 25-03-stats-counter]

# Tech tracking
tech-stack:
  added: []
  patterns: [gsap-matchMedia-reduced-motion, data-attribute-targeting, timeline-position-parameters]

key-files:
  created:
    - website/lib/hooks/useHeroEntrance.ts
    - website/lib/hooks/index.ts
  modified:
    - website/components/sections/hero/Hero.tsx
    - website/components/sections/hero/HeroContent.tsx

key-decisions:
  - "7-phase timeline with ~30% overlap using position parameters"
  - "60px rise for phone mockup (special treatment per CONTEXT.md)"
  - "gsap.matchMedia for reduced motion with auto-revert"
  - "Custom event 'hero-entrance-complete' for activity feed sync"

patterns-established:
  - "gsap.matchMedia for reduced motion: dual condition object with reduceMotion/standard"
  - "data-hero-* attributes for GSAP timeline targeting"
  - "lib/hooks barrel export for hook organization"

# Metrics
duration: 3min
completed: 2026-02-05
---

# Phase 25 Plan 01: Hero Entrance Summary

**7-phase GSAP timeline choreography for hero entrance with 30% overlap, 60px phone mockup rise, and reduced-motion opacity-only fallback**

## Performance

- **Duration:** 3 min
- **Started:** 2026-02-05T09:25:33Z
- **Completed:** 2026-02-05T09:28:48Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Created useHeroEntrance hook orchestrating 7-phase GSAP timeline completing in ~1.2s
- Background fades first (0-300ms), headline rises 30px (300-800ms), phone mockup rises 60px (500-1200ms)
- CTAs scale in with back.out(1.7) bounce easing for premium feel
- Reduced motion fallback uses gsap.matchMedia for opacity-only animation with auto-revert
- Dispatches 'hero-entrance-complete' custom event at 1000ms for activity feed synchronization

## Task Commits

Each task was committed atomically:

1. **Task 1: Create useHeroEntrance hook with GSAP timeline** - `b4aaf55` (feat)
2. **Task 2: Add data attributes and wire Hero entrance** - `221461a` (feat)

## Files Created/Modified
- `website/lib/hooks/useHeroEntrance.ts` - 7-phase GSAP timeline hook with reduced motion support
- `website/lib/hooks/index.ts` - Barrel export for useHeroEntrance and useShake
- `website/components/sections/hero/Hero.tsx` - scopeRef integration, data-hero-bg, data-hero-mockup attributes
- `website/components/sections/hero/HeroContent.tsx` - data-hero-headline, data-hero-subheadline, data-hero-cta attributes

## Decisions Made
- **Timeline position parameters for 30% overlap**: Used absolute time positions (0, 0.2, 0.3, 0.5, 0.6, 0.8, 1.0) instead of relative offsets for precise control
- **Phone mockup 60px rise**: Larger motion than text elements (30px, 20px) per CONTEXT.md "special treatment"
- **back.out(1.7) for CTAs**: Bounce easing creates confidence/premium feel matching "snappy and confident" personality
- **gsap.matchMedia over useMediaQuery**: Built-in reduced motion detection with automatic cleanup on revert

## Deviations from Plan
None - plan executed exactly as written.

## Issues Encountered
None - all files existed as expected, GSAP config was already properly set up from Phase 13.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Hero entrance choreography complete and tested
- Pattern established for scroll-triggered reveals (25-02)
- gsap.matchMedia pattern ready for reuse in scroll animations
- lib/hooks barrel export ready for additional animation hooks

---
*Phase: 25-animation-choreography*
*Completed: 2026-02-05*
