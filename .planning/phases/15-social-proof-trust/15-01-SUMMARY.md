---
phase: 15
plan: 01
subsystem: social-proof
tags: [carousel, testimonials, embla, rtl]
requires: [14-hero]
provides: [testimonial-carousel, testimonial-card]
affects: [15-02, 15-03, 17-homepage]
tech-stack:
  added: [embla-carousel-react]
  patterns: [rtl-carousel, motion-hover]
key-files:
  created:
    - website/components/ui/carousel.tsx
    - website/components/sections/social-proof/TestimonialCard.tsx
    - website/components/sections/social-proof/TestimonialsCarousel.tsx
  modified:
    - website/components/sections/social-proof/index.ts
    - website/components/sections/social-proof/TrustBadges.tsx
    - website/package.json
decisions:
  - id: 15-01-01
    decision: Use shadcn/ui Carousel pattern with Embla
    rationale: Native RTL support, consistent with existing shadcn/ui components
  - id: 15-01-02
    decision: Use npm for package installation (pnpm had OneDrive sync issues)
    rationale: pnpm EPERM errors due to OneDrive file locking during symlink creation
  - id: 15-01-03
    decision: Arrows use ArrowRight/ArrowLeft icons with rtl:rotate-180
    rationale: RTL navigation arrows point correct direction on hover
metrics:
  duration: 173min
  completed: 2026-02-01
---

# Phase 15 Plan 01: Testimonial Carousel Summary

**One-liner:** shadcn/ui Carousel with Embla and RTL-native testimonial cards with full attribution (photo, name, business, metric badge)

## What Was Built

1. **Carousel Component** (`website/components/ui/carousel.tsx`)
   - shadcn/ui-style Carousel using embla-carousel-react
   - RTL support via `direction: "rtl"` in opts
   - Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext exports
   - 48px touch-target navigation buttons

2. **TestimonialCard Component** (`website/components/sections/social-proof/TestimonialCard.tsx`)
   - Exports `TestimonialCard` and `Testimonial` type
   - Full attribution: quote, avatar (48x48), name, business, industry, metric badge
   - Motion hover effect with springBouncy for playful character
   - Uses existing Card/CardContent components

3. **TestimonialsCarousel Section** (`website/components/sections/social-proof/TestimonialsCarousel.tsx`)
   - 3 placeholder testimonials with PROOF-01/02/03 variety:
     - Metric-focused: "40% more leads" (restaurant)
     - Industry variety: "4.2 to 4.8 stars" (beauty clinic)
     - Emotional outcome: "peace of mind" (hair salon)
   - RTL configuration: `dir="rtl"` + `direction: "rtl"`
   - Navigation arrows with `rtl:rotate-180` class
   - ScrollReveal wrapper for entrance animation
   - Responsive: full-width mobile, 2 cards tablet, 3 cards desktop

## Requirements Satisfied

| Requirement | How Satisfied |
|-------------|---------------|
| PROOF-01 | Metric-focused testimonial with "40% more leads" |
| PROOF-02 | Industry variety with different business types |
| PROOF-03 | Emotional outcome "peace of mind" testimonial |

## Decisions Made

1. **Use shadcn/ui Carousel pattern with Embla**
   - Consistent with existing component library
   - Native RTL support through `direction` option
   - Loop mode enabled for continuous browsing

2. **npm used instead of pnpm for installation**
   - pnpm had EPERM errors due to OneDrive file locking
   - npm install worked reliably
   - Added package-lock.json alongside pnpm-lock.yaml

3. **Motion hover effect on cards**
   - `whileHover={{ scale: 1.02 }}` with springBouncy
   - Matches playful character from CONTEXT.md

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed TrustBadges type error**
- **Found during:** Task 1 build verification
- **Issue:** `useIcon` property not recognized due to `as const` type inference
- **Fix:** Added explicit `Badge` interface with optional `useIcon` property
- **Files modified:** `website/components/sections/social-proof/TrustBadges.tsx`
- **Commit:** 0e40e5b

**2. [Rule 3 - Blocking] npm used instead of pnpm**
- **Found during:** Task 1 dependency installation
- **Issue:** pnpm EPERM errors during symlink creation (OneDrive sync conflict)
- **Fix:** Used npm install which worked reliably
- **Files modified:** package.json, package-lock.json added
- **Impact:** Dual lockfiles warning in build (cosmetic only)

## Verification Results

| Check | Status |
|-------|--------|
| `pnpm build` passes | PASS |
| carousel.tsx exists | PASS |
| TestimonialCard exports Testimonial type | PASS |
| TestimonialsCarousel has 3 testimonials | PASS |
| dir="rtl" and direction: "rtl" both set | PASS |
| rtl:rotate-180 on navigation arrows | PASS |

## Next Phase Readiness

**Ready for:**
- Plan 15-02: Video testimonials with autoplay
- Plan 15-03: Social proof counters
- Homepage integration of TestimonialsCarousel

**Pending:**
- Real customer testimonials (photos, names, metrics) for production
- Placeholder avatar images in /public/testimonials/

## Technical Notes

- Carousel arrows positioned with `-start-12` and `-end-12` using logical properties
- CarouselContent uses `-ms-4` for RTL gap handling
- CarouselItem uses `ps-4 basis-full md:basis-1/2 lg:basis-1/3` for responsive layout
- Metric badge uses `bg-primary/10 text-primary` for accent color
