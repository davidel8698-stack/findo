---
phase: 30-component-library
plan: 01
subsystem: ui
tags: [button, animation, spring, framer-motion, tailwind, cva]

# Dependency graph
requires:
  - phase: 28-design-foundation
    provides: color tokens and glass effects foundation
  - phase: 29-layout-system
    provides: spacing tokens for padding
provides:
  - Button variants (primary gradient, secondary transparent, ghost)
  - Linear-style bouncy spring animation preset (springLinear)
  - Button size tokens (S/M/L: 32px/40px/48px)
  - AnimatedButton with -2px hover lift and 0.95 tap scale
affects: [30-component-library, cards, forms, hero, cta]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Linear bouncy spring (stiffness: 260, damping: 20)"
    - "Button gradient pattern (bg-gradient-to-r from-primary to-primary/90)"
    - "Transparent button with border (border-white/20)"

key-files:
  created: []
  modified:
    - website/lib/animation.ts
    - website/components/ui/button.tsx
    - website/components/sections/FooterCTA.tsx

key-decisions:
  - "springLinear uses stiffness: 260, damping: 20 for slight overshoot"
  - "Primary button uses gradient, not solid color"
  - "Ghost button has no bg on hover, only text color change"
  - "AnimatedButton cannot support asChild (use Button for links)"

patterns-established:
  - "Linear bouncy spring: springLinear for interactive elements"
  - "Button hover: -2px lift (y: -2)"
  - "Button tap: 0.95 scale with bouncy spring"
  - "Size tokens: S=32px, M=40px, L=48px"

# Metrics
duration: 8min
completed: 2026-02-05
---

# Phase 30 Plan 01: Button Redesign Summary

**Linear-style button variants with gradient primary, transparent secondary, and bouncy spring animations (springLinear: 260/20)**

## Performance

- **Duration:** 8 min
- **Started:** 2026-02-05T21:31:33Z
- **Completed:** 2026-02-05T21:39:xx
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Added springLinear preset (stiffness: 260, damping: 20) for Linear-style bouncy feel
- Redesigned button variants: primary gradient, secondary transparent with border, ghost with muted text
- Updated button sizes to S(32px), M(40px), L(48px) per COMP-04 spec
- AnimatedButton now uses -2px hover lift and 0.95 tap scale with springLinear

## Task Commits

Each task was committed atomically:

1. **Task 1: Add Linear bouncy spring preset to animation.ts** - `9934587` (feat)
2. **Task 2: Redesign button variants and sizes** - `3c5e335` (feat)

## Files Created/Modified

- `website/lib/animation.ts` - Added springLinear export for Linear-style interactions
- `website/components/ui/button.tsx` - Redesigned variants, sizes, and AnimatedButton animations
- `website/components/sections/FooterCTA.tsx` - Bug fix: use Button instead of AnimatedButton for links

## Decisions Made

1. **springLinear values (260/20):** Higher stiffness with moderate damping creates slight overshoot for playful bounce-back feel per Linear design
2. **Gradient primary:** Using `bg-gradient-to-r from-primary to-primary/90` instead of solid color for premium appearance
3. **Ghost hover:** No background change on hover, only text color (muted-foreground to foreground) for subtle interaction
4. **Icon size:** Updated from h-12 to h-10 to match default button size

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed AnimatedButton asChild usage in FooterCTA**
- **Found during:** Task 2 (build verification)
- **Issue:** FooterCTA was using AnimatedButton with asChild prop for links, but AnimatedButton is a motion component that doesn't support the Slot pattern
- **Fix:** Changed FooterCTA to use regular Button component (which supports asChild) for the link elements
- **Files modified:** website/components/sections/FooterCTA.tsx
- **Verification:** npm run build passes
- **Committed in:** 3c5e335 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Bug fix was necessary for build to pass. No scope creep.

## Issues Encountered

- OneDrive path causing .next cache lock issues - resolved by clearing lock file
- Next.js routes.d.ts cache corruption - resolved by clearing .next folder

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Button component ready for use across all sections
- springLinear preset available for other interactive components (cards, inputs)
- Ready for 30-02 (Card Component) or other component library plans

---
*Phase: 30-component-library*
*Plan: 01*
*Completed: 2026-02-05*
