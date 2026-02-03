---
phase: 19-performance-seo-certification
plan: 04
subsystem: performance
tags: [animation, gsap, motion, css, gpu, reduced-motion, cls, lcp, accessibility]

# Dependency graph
requires:
  - phase: 13-design-system
    provides: Animation infrastructure (Motion + GSAP)
  - phase: 14-hero-first-impression
    provides: ActivityFeed component with GSAP timeline
provides:
  - GPU-optimized animation configurations (gpuSpring, gpuDuration)
  - Reduced motion CSS support for WCAG 2.1 AA
  - CLS prevention utilities (contain-layout)
  - Non-blocking LCP via requestIdleCallback
affects: [future-animations, accessibility-audit, lighthouse-optimization]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - requestIdleCallback for non-blocking animations
    - contain-layout for CLS prevention
    - GPU-only properties (transform, opacity) for 60fps

key-files:
  created: []
  modified:
    - website/app/globals.css
    - website/lib/animation.ts
    - website/components/motion/variants.ts
    - website/components/sections/hero/ActivityFeed.tsx

key-decisions:
  - "requestIdleCallback with 1s timeout and setTimeout fallback for Safari"
  - "linkUnderline uses scaleX instead of width for GPU-only animation"
  - "contain-layout CSS utility for CLS prevention on animated containers"
  - "gpuSpring with stiffness:300, damping:30 for performance-critical animations"

patterns-established:
  - "GPU-only animation: Only animate transform and opacity, never width/height/margin/padding"
  - "requestIdleCallback pattern: Defer non-critical animations until browser idle"
  - "will-change cleanup: Always remove will-change hints after animation completes"

# Metrics
duration: 8min
completed: 2026-02-03
---

# Phase 19 Plan 04: Animation Performance Summary

**GPU-optimized animations with reduced motion support, CLS prevention, and non-blocking LCP via requestIdleCallback**

## Performance

- **Duration:** 8 min
- **Started:** 2026-02-03
- **Completed:** 2026-02-03
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments
- Enhanced reduced motion CSS with GSAP/Motion support for WCAG 2.1 AA compliance
- Added GPU-optimized spring and duration presets (gpuSpring, gpuDuration)
- Fixed linkUnderline variant to use scaleX instead of width (GPU-only)
- ActivityFeed now uses requestIdleCallback to defer animation until browser idle
- Added contain-layout CSS utility for CLS prevention

## Task Commits

Each task was committed atomically:

1. **Task 1: Add reduced motion and GPU acceleration CSS utilities** - `24d6583` (feat)
2. **Task 2: Optimize animation configs for GPU-only 60fps** - `6ab6840` (perf)
3. **Task 3: Optimize ActivityFeed for non-blocking LCP** - `b5acc24` (perf)

## Files Created/Modified
- `website/app/globals.css` - Enhanced reduced motion, GPU acceleration hints, contain-layout utility
- `website/lib/animation.ts` - Added gpuSpring, gpuDuration, staggerConfig, viewportConfig
- `website/components/motion/variants.ts` - Fixed linkUnderline to use scaleX, added GPU-only documentation
- `website/components/sections/hero/ActivityFeed.tsx` - requestIdleCallback wrapper, contain-layout class

## Decisions Made
- **requestIdleCallback pattern:** Uses 1 second timeout with setTimeout(100ms) fallback for Safari (no requestIdleCallback support)
- **linkUnderline fix:** Changed from width animation to scaleX with originX:0 for GPU-only compositing
- **gpuSpring config:** stiffness:300, damping:30, mass:1 for snappy 60fps performance
- **contain-layout:** CSS containment property to isolate animated elements from causing CLS

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None - all tasks completed without issues. Build verified passing.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Animation performance optimizations complete
- Ready for Lighthouse testing to verify:
  - CLS = 0 (contain-layout prevents layout shifts)
  - 60fps animations (GPU-only properties)
  - LCP not blocked by animations (requestIdleCallback)
  - Reduced motion preferences respected (WCAG 2.1 AA)
- Plan 19-05 (Final Testing & Certification) can proceed

---
*Phase: 19-performance-seo-certification*
*Completed: 2026-02-03*
