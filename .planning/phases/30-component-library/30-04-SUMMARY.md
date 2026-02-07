---
phase: 30-component-library
plan: 04
subsystem: ui
tags: [hero, badge, social-proof, linear-pattern, cta]

# Dependency graph
requires:
  - phase: 30-01
    provides: Button variants including ghost variant
  - phase: 30-05
    provides: Badge component with semantic variants
provides:
  - SocialProofRow molecule for grayscale customer logos
  - Linear hero structure (badge -> H1 -> subheadline -> CTAs -> social proof)
  - Ghost variant CTA pairing pattern
affects: [31-motion, hero-animations, landing-page]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Linear hero: badge -> H1 -> subheadline -> CTAs -> social proof"
    - "CTA pairing: Primary + Ghost (not outline)"
    - "Social proof logos: grayscale 60% opacity, hover to color"

key-files:
  created:
    - website/components/molecules/SocialProofRow.tsx
  modified:
    - website/components/sections/hero/HeroContent.tsx
    - website/components/molecules/CTAGroup.tsx
    - website/components/molecules/index.ts

key-decisions:
  - "CTAGroup secondary uses ghost variant (not outline) per COMP-11 spec"
  - "SocialProofRow commented in HeroContent until actual logos available"
  - "Badge with sparkle emoji for 'new feature' announcement pattern"

patterns-established:
  - "Linear hero structure: Badge above H1, social proof below CTAs"
  - "48px gap (gap-12) between social proof logos"
  - "Grayscale + opacity transition on hover for logo rows"

# Metrics
duration: 3min
completed: 2026-02-05
---

# Phase 30 Plan 04: Hero Pattern Summary

**Linear-style hero structure with badge-first hierarchy, ghost CTA pairing, and SocialProofRow molecule for grayscale customer logos**

## Performance

- **Duration:** 3 min
- **Started:** 2026-02-05T21:41:13Z
- **Completed:** 2026-02-05T21:44:13Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Created SocialProofRow molecule with 48px gap, 60% opacity, hover-to-color effect
- Restructured HeroContent to Linear pattern: Badge -> H1 -> Subheadline -> CTAs -> Social Proof
- Updated CTAGroup secondary button to use ghost variant per COMP-11

## Task Commits

Each task was committed atomically:

1. **Task 1: Create SocialProofRow molecule** - `280b74f` (feat)
2. **Task 2: Update HeroContent with badge-first structure** - `ac848a6` (feat)

## Files Created/Modified
- `website/components/molecules/SocialProofRow.tsx` - New molecule for grayscale customer logos with hover effect
- `website/components/molecules/index.ts` - Added SocialProofRow export
- `website/components/sections/hero/HeroContent.tsx` - Badge above H1, Linear hero structure
- `website/components/molecules/CTAGroup.tsx` - Changed secondary button from outline to ghost variant

## Decisions Made
- **CTAGroup ghost variant:** CONTEXT.md specifies "CTA pairing: Primary + Ghost" but CTAGroup used "outline". Changed to ghost per spec.
- **SocialProofRow commented:** Logo images don't exist yet. Component created and imported but usage commented until actual business logos are added.
- **Badge emoji:** Used sparkle emoji (&#10024;) for "new feature" announcement per Linear pattern.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] CTAGroup secondary button used wrong variant**
- **Found during:** Task 2 (HeroContent restructure)
- **Issue:** CTAGroup used "outline" variant for secondary button, but COMP-11 spec requires "Primary + Ghost" pairing
- **Fix:** Changed variant from "outline" to "ghost" in CTAGroup.tsx
- **Files modified:** website/components/molecules/CTAGroup.tsx
- **Verification:** Build passes, ghost variant applied correctly
- **Committed in:** ac848a6 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 missing critical)
**Impact on plan:** Fix ensures CTA pairing matches Linear spec. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Hero structure complete and follows Linear pattern
- SocialProofRow ready for use when business logos are available
- Ready for Phase 31 (Motion) hero animations

---
*Phase: 30-component-library*
*Completed: 2026-02-05*
