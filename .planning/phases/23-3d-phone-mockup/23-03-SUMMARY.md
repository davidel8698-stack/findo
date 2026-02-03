---
phase: 23-3d-phone-mockup
plan: 03
subsystem: ui
tags: [parallax, motion-react, useScroll, useTransform, prefers-reduced-motion, hero]

# Dependency graph
requires:
  - phase: 23-02
    provides: Pre-rendered 3D phone mockup component with image and shadows
provides:
  - Scroll parallax (40px range) for depth perception
  - Mouse parallax (3deg tilt) for desktop interactivity
  - prefers-reduced-motion support
  - CLS prevention via contain-layout
affects: [23-04, hero-section, performance-testing]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "useScroll + useTransform for scroll-linked animation"
    - "useMotionValue + useSpring for smooth mouse tracking"
    - "Mobile detection via matchMedia for conditional effects"

key-files:
  created: []
  modified:
    - website/components/sections/hero/PhoneMockup.tsx

key-decisions:
  - "40px scroll parallax range (phone moves slower than content)"
  - "3 degree max rotation for mouse parallax (subtle, not dramatic)"
  - "Desktop only for mouse parallax (>1024px breakpoint)"
  - "Spring config stiffness:100 damping:30 for natural feel"

patterns-established:
  - "Motion hooks for parallax instead of GSAP ScrollTrigger"
  - "matchMedia for progressive enhancement on desktop"
  - "contain-layout for transform animations to prevent CLS"

# Metrics
duration: 3min
completed: 2026-02-03
---

# Phase 23 Plan 03: Parallax Effects Summary

**Scroll and mouse parallax using Motion hooks with prefers-reduced-motion support and CLS prevention**

## Performance

- **Duration:** 3 min
- **Started:** 2026-02-03T19:18:30Z
- **Completed:** 2026-02-03T19:47:36Z
- **Tasks:** 3
- **Files modified:** 1

## Accomplishments
- Added scroll parallax using useScroll and useTransform hooks - phone moves 40px slower than page scroll
- Added mouse parallax for desktop only - phone tilts 3 degrees toward cursor with spring easing
- Implemented prefers-reduced-motion check to disable parallax for accessibility
- Added contain-layout class to prevent CLS from parallax transforms

## Task Commits

Each task was committed atomically:

1. **Task 1: Add scroll parallax effect** - `baa39a1` (feat)
2. **Task 2: Add mouse parallax (desktop only)** - `f41f93a` (feat)
3. **Task 3: Add contain-layout for CLS prevention** - `b794752` (perf)

**Plan metadata:** TBD (docs: complete plan)

## Files Created/Modified
- `website/components/sections/hero/PhoneMockup.tsx` - Added Motion hooks for scroll/mouse parallax with accessibility support

## Decisions Made
- **40px scroll range:** Per CONTEXT.md "20-40px movement intensity" - chose upper bound for visible depth
- **3 degree rotation:** Subtle tilt that's noticeable but not distracting (within premium feel)
- **Spring config (100/30):** Balanced between responsiveness and smoothness
- **1024px breakpoint:** Standard tablet/desktop cutoff - no mouse tracking on touch devices

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - straightforward implementation following plan specifications.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- PhoneMockup now has full parallax behavior (scroll + mouse)
- Activity feed integration ready (23-04)
- Motion hooks pattern established for future parallax needs
- Accessibility fully supported via prefers-reduced-motion

---
*Phase: 23-3d-phone-mockup*
*Completed: 2026-02-03*
