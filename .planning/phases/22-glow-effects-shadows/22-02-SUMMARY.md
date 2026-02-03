---
phase: 22-glow-effects-shadows
plan: 02
subsystem: ui
tags: [glow, shadows, rim-lighting, button, card, input, tailwind, css-variables]

# Dependency graph
requires:
  - phase: 22-01
    provides: CSS foundation with cta-pulse, cta-glow-static classes, shadow CSS variables
provides:
  - Button component with glow variant (cta, cta-static, hover, none)
  - Card and AnimatedCard with rimLight prop
  - AnimatedCard using CSS variable shadow system
  - Input with neutral focus glow
affects: [22-03, hero-section, sticky-cta, pricing-cards]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Pseudo-element technique for performant hover glow (opacity animation only)"
    - "CSS variables for shadow elevation system"
    - "Dark mode rim lighting via border-t utility"

key-files:
  created: []
  modified:
    - website/components/ui/button.tsx
    - website/components/ui/card.tsx
    - website/components/ui/input.tsx

key-decisions:
  - "Hover glow uses pseudo-element for GPU-accelerated opacity animation"
  - "AnimatedCard rimLight defaults to true, Card defaults to false"
  - "Input uses neutral white glow (doesn't compete with CTA orange)"

patterns-established:
  - "glow variant pattern: cva with none/cta/cta-static/hover options"
  - "rimLight prop pattern: dark: prefix for dark-mode-only rim lighting"
  - "CSS variable shadows: style={{ boxShadow: 'var(--shadow-*)' }}"

# Metrics
duration: 4min
completed: 2026-02-03
---

# Phase 22 Plan 02: UI Component Enhancement Summary

**Button glow variant (cta/cta-static/hover), Card rim lighting with 4-layer shadows, Input focus glow**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-03
- **Completed:** 2026-02-03
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments
- Button component gains glow variant with 4 options: none, cta (pulse), cta-static (mobile), hover (performant pseudo-element)
- Card and AnimatedCard support rimLight prop for dark mode top edge highlight
- AnimatedCard uses CSS variables (--shadow-elevation-medium, --shadow-hover) for consistent shadow system
- Input component has subtle neutral focus glow with 200ms transition

## Task Commits

Each task was committed atomically:

1. **Task 1: Add glow variant to Button component** - `dda9155` (feat)
2. **Task 2: Add rimLight prop and enhance shadows on Card** - `a38896a` (feat)
3. **Task 3: Add focus glow to Input component** - `6ed3bea` (feat)

## Files Created/Modified
- `website/components/ui/button.tsx` - Added glow variant to buttonVariants cva, updated Button and AnimatedButton to accept glow prop
- `website/components/ui/card.tsx` - Added CardProps and AnimatedCardProps interfaces with rimLight, integrated CSS variable shadows
- `website/components/ui/input.tsx` - Added focus-visible:shadow for neutral glow, transition-shadow for smooth animation

## Decisions Made
- **Hover glow technique:** Uses pseudo-element (::after) with opacity animation for GPU acceleration - only opacity changes on hover, no box-shadow recalculation
- **rimLight defaults:** AnimatedCard defaults to true (premium cards should have rim lighting), Card defaults to false (basic cards are simpler)
- **Neutral input glow:** Uses white/neutral color to not compete with CTA orange per CONTEXT.md guidance

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - TypeScript compiled successfully after each task.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- All UI components now leverage CSS foundation from 22-01
- Ready for 22-03 integration testing and visual verification
- Button glow="cta" ready for hero CTA usage
- AnimatedCard ready for pricing/feature cards with premium rim lighting

---
*Phase: 22-glow-effects-shadows*
*Completed: 2026-02-03*
