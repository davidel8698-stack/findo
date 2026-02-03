---
phase: 21-background-depth-system
plan: 01
subsystem: ui
tags: [gsap, scrolltrigger, svg, parallax, background, animation]

# Dependency graph
requires:
  - phase: 20-typography-gradient-foundation
    provides: Gradient variables, animation timing, reduced motion patterns
provides:
  - BackgroundDepth component with three-layer visual system
  - GSAP ScrollTrigger parallax on gradient orbs
  - Inline SVG grid pattern and noise texture
  - Barrel export for easy import
affects: [22-micro-interactions, 26-glassmorphism]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "blur(80px) on container not individual animated elements for GPU performance"
    - "Viewport units (vw) for responsive sizing without breakpoint jumps"
    - "Inline SVG feTurbulence for zero HTTP request noise texture"

key-files:
  created:
    - website/components/background/BackgroundDepth.tsx
    - website/components/background/index.ts
  modified: []

key-decisions:
  - "Used existing gsapConfig.ts for GSAP imports (consistent with SmoothScroll.tsx pattern)"
  - "3 orbs within will-change budget (research recommended max 4)"
  - "scrub: 1.5 for organic parallax feel vs scrub: true for immediate response"

patterns-established:
  - "Background layers use fixed position with -z-10, pointer-events-none, aria-hidden"
  - "SVG patterns use unique IDs to avoid conflicts (bg-grid-pattern)"
  - "Motion preference check before GSAP initialization (useState + useEffect pattern)"

# Metrics
duration: 2min
completed: 2026-02-03
---

# Phase 21 Plan 01: BackgroundDepth Component Summary

**Three-layer background system with inline SVG grid/noise and GSAP ScrollTrigger parallax on orange/amber gradient orbs**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-03T16:12:46Z
- **Completed:** 2026-02-03T16:14:12Z
- **Tasks:** 1
- **Files modified:** 2

## Accomplishments

- Created BackgroundDepth component with three visual layers (grid, orbs, noise)
- Implemented GSAP ScrollTrigger parallax with subtle speed differentials (-80px, -120px, -60px)
- Applied blur(80px) to container for GPU-accelerated performance
- Added prefers-reduced-motion check before parallax initialization
- Used viewport units for responsive sizing without breakpoint jumps

## Task Commits

Each task was committed atomically:

1. **Task 1: Create BackgroundDepth Component with All Layers** - `7b38371` (feat)

## Files Created/Modified

- `website/components/background/BackgroundDepth.tsx` - Three-layer background component with parallax
- `website/components/background/index.ts` - Barrel export for BackgroundDepth

## Decisions Made

- **Used existing gsapConfig.ts:** Imported GSAP, ScrollTrigger, useGSAP from `@/lib/gsapConfig` for consistency with SmoothScroll.tsx pattern
- **3 orbs within budget:** Research recommended max 4 will-change elements; used 3 for safety margin
- **scrub: 1.5 for organic feel:** Provides 1.5s smoothing lag for natural motion (vs scrub: true for immediate)
- **Initial state prefersReducedMotion=true:** Safer default until preference is checked client-side

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- BackgroundDepth component ready for layout integration (Plan 21-02)
- Component exports from `@/components/background` barrel
- Parallax animation integrates with existing Lenis smooth scroll via gsapConfig

---
*Phase: 21-background-depth-system*
*Completed: 2026-02-03*
