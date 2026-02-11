# Section Cleanup Record

**Date:** 2026-02-10
**Reason:** Clean slate for rebuilding sections to Linear-quality standard
**Context:** Phase 32 (Autopilot Hero Visualization) achieved Linear-quality design. Other sections do not meet this standard and will be rebuilt one-by-one.

## Sections Removed

### 1. social-proof/
**Files Removed:**
- SocialProofCounters.tsx
- TestimonialsCarousel.tsx
- VideoTestimonial.tsx
- TrustBadges.tsx
- GuaranteeBadge.tsx
- FloatingActivityWidget.tsx
- TestimonialCard.tsx
- index.ts

**Purpose:** Social proof metrics, testimonials, trust badges, activity widget
**Rebuild Priority:** High (conversion-critical)

### 2. trust/
**Files Removed:**
- TeamSection.tsx
- ContactSection.tsx
- index.ts

**Purpose:** Team showcase, contact information
**Rebuild Priority:** Medium

### 3. offer/
**Files Removed:**
- PricingSection.tsx
- PricingComparison.tsx
- ROICalculator.tsx
- FAQSection.tsx
- ZeroRiskSummary.tsx
- GuaranteeBadges.tsx
- index.ts

**Purpose:** Pricing, ROI calculator, FAQ, guarantees, risk elimination
**Rebuild Priority:** High (conversion-critical)

### 4. conversion/
**Files Removed:**
- ConversionSection.tsx
- LeadCaptureForm.tsx
- FormSuccess.tsx
- PhoneInput.tsx

**Purpose:** Lead capture forms, CTA sections
**Rebuild Priority:** Critical (primary conversion mechanism)

### 5. demo/
**Files Removed:**
- DemoSection.tsx
- InteractiveDemo.tsx
- LottieDemo.tsx

**Purpose:** Product demo, interactive showcase
**Rebuild Priority:** Medium-High

### 6. emotional/
**Files Removed:**
- PainPointSection.tsx
- ReliefSection.tsx

**Purpose:** Pain point acknowledgment, solution relief presentation
**Rebuild Priority:** Medium
**Status:** REBUILT as text-journey/ (Phase 34, 2026-02-11)

### 7. FooterCTA.tsx (standalone)
**Purpose:** Final conversion opportunity at page bottom
**Rebuild Priority:** High

## Total Files Removed

- **7 folders/files deleted**
- **~28 component files removed**
- **~225 lines removed from page.tsx** (reduced to ~22 lines)

## Preserved Components

The following were preserved as they meet quality standards or are utilities:

| Component | Location | Reason |
|-----------|----------|--------|
| **hero/** | sections/hero/ | LinearHeroPanel achieved Linear-quality design |
| **logo-carousel/** | sections/logo-carousel/ | Phase 33: Infinite scroll logos, grayscale filter, seamless bg |
| **text-journey/** | sections/text-journey/ | Phase 34: Apple-quality scroll reveals, 7-block emotional narrative |
| **motion/** | components/motion/ | FadeIn, ScrollReveal, StaggerContainer, SectionReveal, variants (reusable for future sections) |
| **seo/** | components/seo/ | StructuredData utility component |
| **background/** | components/background/ | BackgroundDepth layout component |
| **navigation/** | components/navigation/ | Navigation component (uses GlassNav) |
| **ui/** | components/ui/ | shadcn/ui components (Button, Card, Badge, Input, etc.) |
| **atoms/** | components/atoms/ | Logo, Icon components |
| **molecules/** | components/molecules/ | CTAGroup, StatItem, NavLink, FormField |

## v1.1 Archive Note

The deleted sections were part of **v1.1 Sales Website** (shipped 2026-02-03). They achieved functional requirements but did not meet the Linear-quality visual standard established in Phase 32.

All code is preserved in git history for reference:
- Commit before cleanup: `05aa5f5` (docs(32): Phase 32 complete)
- Previous section implementation: `5b58f7a` and earlier

## Rebuild Plan

Sections are being rebuilt incrementally (each section = one Phase) using Linear-quality design workflow:
1. Reference `design-bible/LINEAR-BLUEPRINT.md` for visual specs
2. Follow `DESIGN-PHASE-WORKFLOW.md` process
3. Compare against Linear website screenshots
4. Pass design certification before shipping

### Rebuild Progress

| Original Section | Rebuilt As | Phase | Status |
|------------------|------------|-------|--------|
| emotional/ | text-journey/ | 34 | Complete |
| social-proof/ | TBD | 35+ | Pending |
| trust/ | TBD | TBD | Pending |
| offer/ | TBD | TBD | Pending |
| conversion/ | TBD | TBD | Pending |
| demo/ | TBD | TBD | Pending |
| FooterCTA.tsx | TBD | TBD | Pending |

---

*Cleanup performed: 2026-02-10*
*Last updated: 2026-02-11 - emotional/ rebuilt as text-journey/ (Phase 34)*
