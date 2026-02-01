---
phase: 14-hero-first-impression
plan: 01
subsystem: ui
tags: [hero, rtl, tailwind, next.js, hebrew, phone-mockup]

# Dependency graph
requires:
  - phase: 13-design-system
    provides: Button, CTAGroup, Icon components
provides:
  - Hero section layout with RTL-native grid
  - HeroContent with Hebrew headline and CTA
  - PhoneMockup CSS phone frame for activity cards
affects: [14-02-activity-cards, 14-03-animations, 17-conversion-flow]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "RTL grid ordering with order-1/order-2 classes"
    - "100dvh for full viewport height on mobile"
    - "Logical CSS properties for RTL (start/end)"

key-files:
  created:
    - website/components/sections/hero/Hero.tsx
    - website/components/sections/hero/HeroContent.tsx
    - website/components/sections/hero/PhoneMockup.tsx
    - website/components/sections/hero/index.ts
  modified: []

key-decisions:
  - "Hebrew headline 'Your business works. You don't have to.' (problem-focused, under 8 words)"
  - "ArrowLeft icon for RTL CTA (flips automatically via rtlFlip prop)"
  - "100dvh for mobile-safe full viewport height"

patterns-established:
  - "RTL grid ordering: content order-2/lg:order-1, visual order-1/lg:order-2"
  - "Section structure: sections/[name]/[Component].tsx with barrel export"

# Metrics
duration: 8min
completed: 2026-02-01
---

# Phase 14 Plan 01: Hero Section Layout Summary

**RTL-native hero section with Hebrew headline, CTA group, and CSS phone mockup container for activity feed**

## Performance

- **Duration:** 8 min
- **Started:** 2026-02-01
- **Completed:** 2026-02-01
- **Tasks:** 3
- **Files created:** 4

## Accomplishments

- Hero section renders with RTL-native layout (content right, visual left on desktop)
- Hebrew headline and subheadline display with correct typography
- Phone mockup provides container for activity feed cards (Plan 02)
- Full viewport height on desktop, adapts on mobile with dvh units

## Task Commits

Each task was committed atomically:

1. **Task 1: Create PhoneMockup component** - `9d39fc4` (feat)
2. **Task 2: Create HeroContent component** - `9fff1bb` (feat)
3. **Task 3: Create Hero section** - `69d18bf` (feat)

## Files Created/Modified

- `website/components/sections/hero/PhoneMockup.tsx` - CSS phone frame with notch, side buttons, and screen area
- `website/components/sections/hero/HeroContent.tsx` - Headline, subheadline, and CTA group
- `website/components/sections/hero/Hero.tsx` - Main section with RTL-native grid layout
- `website/components/sections/hero/index.ts` - Barrel exports for all hero components

## Decisions Made

- **Hebrew headline:** "Your business works. You don't have to." (problem-focused alternative)
- **CTA text:** "Start for free" (primary) and "How does it work?" (secondary)
- **Phone sizing:** h-[500px] w-[240px] mobile, md:h-[600px] md:w-[290px] desktop
- **100dvh:** Used dynamic viewport height for mobile browser address bar compatibility

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Plan 14-02 executed in parallel, creating ActivityCard and ActivityFeed components
- index.ts was automatically updated with those exports by parallel execution
- No conflicts - Task 3 committed Hero.tsx successfully

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Hero layout complete and ready for activity cards (Plan 02)
- PhoneMockup accepts children prop for activity feed content
- All components use "use client" for Motion animations in future plans

---
*Phase: 14-hero-first-impression*
*Completed: 2026-02-01*
