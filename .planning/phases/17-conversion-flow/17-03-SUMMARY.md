---
phase: 17-conversion-flow
plan: 03
subsystem: conversion
tags: [cta, forms, animation, mobile, homepage]

dependency_graph:
  requires: ["17-02"]
  provides: ["ConversionSection", "scroll-to-form", "homepage-ctas"]
  affects: ["17-04", "18-*", "19-*"]

tech_stack:
  added: []
  patterns: ["AnimatePresence mode=wait", "scrollIntoView behavior=smooth"]

key_files:
  created:
    - website/components/sections/conversion/ConversionSection.tsx
  modified:
    - website/components/sections/hero/StickyCtaBar.tsx
    - website/app/page.tsx

decisions:
  - id: "17-03-01"
    choice: "Hero form as separate section below Hero component"
    rationale: "Hero component uses min-h-[100dvh] - adding form inside would break layout"
  - id: "17-03-02"
    choice: "4 CTAs instead of 5-6"
    rationale: "Strategic placement at high-intent points (hero, after proof, after pricing, after FAQ)"
  - id: "17-03-03"
    choice: "Negative margin (-mt-16) for hero form placement"
    rationale: "Creates visual overlap with hero section without modifying Hero component"

metrics:
  duration: "3 min"
  completed: "2026-02-01"
---

# Phase 17 Plan 03: Signup Section Integration Summary

AnimatePresence wrapper with smooth form/success transitions, 4 strategic CTAs on homepage, and mobile sticky bar scroll-to-form functionality.

## What Was Built

### Task 1: ConversionSection Component
- `ConversionSection.tsx` - AnimatePresence wrapper for form/success transition
- mode="wait" ensures smooth swap between states
- Three variants: hero (full width), section (card style), compact (inline)
- Social proof text "573+ businesses" shown by default on section/compact variants
- FormSuccess redirects to app.findo.co.il after 3 seconds

### Task 2: StickyCtaBar Scroll
- Added `formId` prop (defaults to "hero-form")
- onClick handler uses scrollIntoView with smooth behavior and block: center
- Maintains existing frosted glass effect and iOS safe area support

### Task 3: Homepage CTA Integration
- **Hero form** (`id="hero-form"`) - target for StickyCtaBar scroll
- **After Social Proof** - "Ready to join?" heading
- **After Pricing** - "Start today, free" with no credit card messaging
- **After FAQ** - "Have more questions?" with contact option
- Footer section has pb-20 on mobile for sticky bar clearance
- All Phase 14-16 sections preserved

## Requirements Satisfied

| Requirement | Implementation |
|-------------|----------------|
| ACTION-01 | 4 CTAs on homepage (hero, after proof, after pricing, after FAQ) |
| ACTION-03 | "What happens next" text below each CTA form |
| ACTION-08 | Social proof "573+ businesses" near section CTAs |
| MOBILE-03 | Sticky CTA scrolls to hero form on click |

## Files Changed

| File | Change |
|------|--------|
| `website/components/sections/conversion/ConversionSection.tsx` | Created - AnimatePresence wrapper |
| `website/components/sections/hero/StickyCtaBar.tsx` | Added formId prop and scroll handler |
| `website/app/page.tsx` | Added 4 ConversionSection instances |

## Commits

| Hash | Message |
|------|---------|
| fbb9b69 | feat(17-03): create ConversionSection with AnimatePresence |
| 1be2481 | feat(17-03): add scroll-to-form to StickyCtaBar |
| af892b9 | feat(17-03): integrate 4 CTAs throughout homepage |

## Verification Results

| Check | Status |
|-------|--------|
| ConversionSection animates form/success | PASS |
| StickyCtaBar scrolls to hero-form | PASS |
| Homepage has 4 CTAs | PASS |
| Each CTA has social proof nearby | PASS |
| Mobile footer not covered by sticky bar | PASS |
| npm run build passes | PASS |

## Deviations from Plan

None - plan executed exactly as written.

## Next Phase Readiness

**Phase 17-04:** Final verification and human UAT for conversion flow.
- All conversion components now integrated
- Ready for end-to-end testing of lead capture flow
- Webhook integration can be tested with LEAD_WEBHOOK_URL env var
