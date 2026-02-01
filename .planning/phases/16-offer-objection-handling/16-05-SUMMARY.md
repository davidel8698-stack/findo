---
phase: 16
plan: 05
subsystem: offer-pricing
tags: [pricing, comparison, homepage, integration]

dependency-graph:
  requires: [16-02, 16-03, 16-04]
  provides: [pricing-comparison, homepage-integration]
  affects: [17-conversion-flow, 19-certification]

tech-stack:
  added: []
  patterns: [three-column-comparison, check-x-icons, scroll-reveal-cascade]

key-files:
  created:
    - website/components/sections/offer/PricingComparison.tsx
    - website/components/sections/offer/PricingSection.tsx
  modified:
    - website/components/sections/offer/index.ts
    - website/app/page.tsx
    - website/components/sections/hero/HeroContent.tsx

decisions:
  - id: pricing-comparison-highlight
    choice: "bg-primary/5 for Findo column"
    reason: "Visually highlight recommended option without being overwhelming"
  - id: hero-trust-reassurance
    choice: "Added ללא כרטיס אשראי to Hero CTA"
    reason: "OFFER-01 requires trust reassurance near all CTAs"

metrics:
  duration: "4 min"
  completed: "2026-02-01"
---

# Phase 16 Plan 05: Comparison Table Summary

**Pricing section with three-column comparison (DIY | Agency | Findo) integrated into homepage with all Phase 16 sections.**

## What Was Built

### PricingComparison.tsx (113 lines)
Three-column comparison table showing:
- DIY: Free but costs your time
- Agency: Expensive (3,000-10,000/month) with commitment
- Findo: Sweet spot (350/month, 500 setup, no commitment)

Features:
- 8 comparison rows covering cost, setup time, features
- Check/X icons for boolean feature comparison
- Findo column highlighted with bg-primary/5
- "Recommended" badge under Findo header
- overflow-x-auto for mobile scroll

### PricingSection.tsx (72 lines)
Complete pricing section combining:
- PricingComparison table
- Large price display (350/month + 500 setup)
- CTA button with trial message
- Trust reassurance: "ללא כרטיס אשראי" (OFFER-01)
- ScrollReveal animations

### Homepage Integration
Integrated all Phase 16 sections into psychological journey:
1. Hero (existing)
2. SocialProofCounters (existing)
3. TestimonialsCarousel (existing)
4. VideoTestimonial (existing)
5. **ROICalculator** (NEW - show value)
6. **PricingSection** (NEW - transparent pricing)
7. **ZeroRiskSummary** (NEW - eliminate risk)
8. TrustBadges (existing)
9. **FAQSection** (NEW - address objections)
10. TeamSection (existing)
11. ContactSection (existing)
12. Footer (existing)

All Phase 15 sections preserved unchanged.

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Findo column highlight | bg-primary/5 | Subtle highlight that doesn't distract |
| Price formatting | 350 ₪/חודש with setup below | Clear, transparent pricing |
| Hero trust message | Added ללא כרטיס אשראי | OFFER-01 requirement for all CTAs |
| Section order | ROI > Pricing > Risk > Trust > FAQ | Psychological journey: value before price |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added trust reassurance to Hero CTA**
- **Found during:** Task 3 verification
- **Issue:** OFFER-01 requires "ללא כרטיס אשראי" near all CTAs, Hero was missing it
- **Fix:** Added trust message below Hero CTA group
- **Files modified:** website/components/sections/hero/HeroContent.tsx
- **Commit:** e53f1b4

## Requirements Satisfied

| Requirement | Status | Evidence |
|-------------|--------|----------|
| OFFER-01 | SATISFIED | "ללא כרטיס אשראי" in Hero and PricingSection |
| OFFER-03 | SATISFIED | 350/month + 500 setup clearly visible |
| OBJ-01 | SATISFIED | ZeroRiskSummary integrated |
| OBJ-02 | SATISFIED | FAQSection integrated |

## Files Changed

| File | Change Type | Lines |
|------|-------------|-------|
| PricingComparison.tsx | Created | 113 |
| PricingSection.tsx | Created | 72 |
| index.ts | Modified | +2 |
| page.tsx | Modified | +23 |
| HeroContent.tsx | Modified | +4 |

## Verification Results

- [x] npm run build passes with no errors
- [x] PricingComparison.tsx shows three-column table
- [x] PricingSection.tsx displays 350/month + 500 setup
- [x] PricingSection.tsx contains "ללא כרטיס אשראי" near CTA
- [x] index.ts exports all offer section components
- [x] page.tsx imports and renders all Phase 16 sections
- [x] page.tsx preserves all existing Phase 15 sections
- [x] Findo column highlighted as recommended

## Commits

| Hash | Message |
|------|---------|
| 1214902 | feat(16-05): create three-column pricing comparison table |
| 8856c3d | feat(16-05): create pricing section with comparison and CTA |
| e53f1b4 | feat(16-05): integrate all Phase 16 sections into homepage |

## Next Phase Readiness

Phase 16 Plan 05 complete. Ready for:
- 16-06: UAT Verification (final plan of phase)
- Phase 17: Conversion Flow (forms, CTAs, mobile optimization)
