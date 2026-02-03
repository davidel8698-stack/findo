---
phase: 23-3d-phone-mockup
plan: 02
subsystem: ui
tags: [next-image, phone-mockup, drop-shadow, screen-glow, hero]

# Dependency graph
requires:
  - phase: 23-01
    provides: CSS foundation with phone shadow and screen glow variables
provides:
  - Pre-rendered 3D phone mockup component with image asset
  - Multi-layer drop-shadow for realistic depth
  - Screen glow effect with brand orange tint
  - Activity feed overlay positioned inside phone screen
affects: [23-03, 23-04, hero-section]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "drop-shadow for PNG transparency-aware shadows"
    - "Next.js Image with priority for hero LCP"

key-files:
  created:
    - website/public/images/phone-mockup.png
  modified:
    - website/components/sections/hero/PhoneMockup.tsx

key-decisions:
  - "Use drop-shadow filter instead of box-shadow for PNG transparency"
  - "Screen overlay at 4.5%/2% inset for thin bezel alignment"
  - "Screen glow 20% opacity brand orange with 40px blur"

patterns-established:
  - "PNG phone mockup with drop-shadow for realistic depth"
  - "Screen content overlay with percentage-based positioning"

# Metrics
duration: 8min
completed: 2026-02-03
---

# Phase 23 Plan 02: Phone Mockup Component Summary

**Pre-rendered 3D phone image with multi-layer drop-shadow, screen glow, and activity feed overlay**

## Performance

- **Duration:** 8 min
- **Started:** 2026-02-03T19:11:36Z
- **Completed:** 2026-02-03T19:19:00Z
- **Tasks:** 2 (1 user action, 1 implementation)
- **Files modified:** 2

## Accomplishments
- Replaced pure CSS phone frame with pre-rendered 3D iPhone mockup PNG
- Added multi-layer drop-shadow (4 layers) for realistic floating depth effect
- Added screen glow effect with brand orange at 20% opacity and 40px blur
- Positioned screen content overlay to match phone bezel dimensions
- Added rim light border for dark mode separation

## Task Commits

Each task was committed atomically:

1. **Task 1: Obtain 3D phone mockup image** - (user action) - User provided phone-mockup.png
2. **Task 2: Refactor PhoneMockup to use 3D image** - `8530947` (feat)

**Plan metadata:** TBD (docs: complete plan)

## Files Created/Modified
- `website/public/images/phone-mockup.png` - 379KB pre-rendered 3D iPhone mockup with transparent background
- `website/components/sections/hero/PhoneMockup.tsx` - Refactored to use Image + effects instead of pure CSS frame

## Decisions Made
- **Drop-shadow over box-shadow:** Using filter: drop-shadow() because PNG has transparency - shadow follows actual phone shape, not bounding rectangle
- **Screen overlay positioning:** 4.5% sides, 2% top/bottom inset values tuned to match the specific phone image bezel width
- **Priority loading:** Added `priority` prop to Image for LCP optimization (hero image should preload)
- **Rim light:** Added subtle white/5 top border for premium separation in dark mode

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - straightforward implementation following plan specifications.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Phone mockup component ready for activity feed integration (23-03)
- Multi-layer shadow and screen glow effects in place
- Screen overlay may need fine-tuning after visual verification with activity feed content

---
*Phase: 23-3d-phone-mockup*
*Completed: 2026-02-03*
