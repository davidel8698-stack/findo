# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-05)

**Core value:** The business owner does nothing. Findo operates completely autonomously after a 2-minute setup, capturing leads, growing reviews, and managing their digital presence without any ongoing effort.
**Current focus:** v3.0 Linear Design System - Phase 32 Autopilot Hero Visualization (RESET - awaiting re-planning)

## Current Position

Phase: 32 of 36 (Autopilot Hero Visualization) - **RESET**
Plan: 0 of TBD (needs re-planning)
Status: Reset - original implementation removed, awaiting re-planning with new design workflow
Last activity: 2026-02-06 - Phase 32 RESET (did not meet Linear design quality standards)

Progress: [#########################] 31/36 phases complete (v1.0 + v1.1 + v2.0 + v3.0 phases 28-31)

## Milestone Summary

**v1.0 MVP shipped 2026-01-30**
- 11 phases, 67 plans, 56 requirements
- 29,580 lines of TypeScript
- 4 days from start to ship

**v1.1 Sales Website shipped 2026-02-03**
- 8 phases (12-19), 43 plans, 98 requirements
- 17,507 lines of TypeScript
- 4 days from start to ship

**v2.0 Visual Excellence certified 2026-02-05**
- 8 phases (20-27), 31 plans, 75 requirements
- ~17,000 lines of TypeScript (website)
- 3 days from start to ship

**v3.0 Linear Design System (in progress)**
- 9 phases (28-36), TBD plans, 68 requirements
- Phases: Foundation, Layout, Components, Motion, 4x Visualizations, Certification

## Performance Metrics

**Combined (All Milestones):**
- Total phases complete: 31 (phases 1-31)
- Total plans executed: 158 (153 + 5 from 31-01 through 31-05)
- Total requirements satisfied: 288 (274 + 14 MOTION/A11Y requirements from Phase 31)
- Calendar days: 11 days (2026-01-27 to 2026-02-06)

## Accumulated Context

### Decisions

All decisions logged in PROJECT.md Key Decisions table.

Key v2.0 decisions affecting v3.0:
- GSAP + Motion two-library strategy (continue for v3.0 visualizations)
- Mobile GSAP skip pattern (apply to new visualizations)
- Glassmorphism with mobile fallback (foundation for component library)

**Phase 28-01 Decisions:**
- Used inline style for BackgroundDepth (avoid Tailwind double-prefix bg-bg-primary)
- Glass tokens split: blur values in @theme, rgba formulas in :root
- Maintained backward compatibility with existing color tokens

**Phase 28-02 Decisions:**
- Removed 5xl/6xl/7xl font sizes (30px, 60px, 72px not on 4px grid)
- Use Tailwind v4 associated properties for bundled text tokens
- Responsive typography via utility composition (not @theme media queries)

**Phase 29-01 Decisions:**
- Leveraged existing Tailwind spacing scale (already 4px-based)
- 60% mobile scale for section padding (72/120, 48/80, 40/64)
- Container edge padding: 16px mobile, 24px desktop

**Phase 29-02 Decisions:**
- Section classification: hero/feature/cta/footer for semantic padding
- Kept Hero Form py-8 -mt-16 (special overlap positioning)
- Kept footer pb-20 md:pb-12 override (sticky bar clearance)

**Phase 30-01 Decisions:**
- springLinear preset: stiffness 260, damping 20 for Linear-style overshoot
- Primary button gradient: bg-gradient-to-r from-primary to-primary/90
- Ghost hover: no bg change, only text color (muted to foreground)
- AnimatedButton cannot support asChild (use Button for links)

**Phase 30-02 Decisions:**
- Wrapper technique for gradient borders (border-image incompatible with border-radius)
- GlassCard solid mobile fallback for performance
- HighlightedCard badge positioned with absolute -top-3

**Phase 30-03 Decisions:**
- 85% mobile opacity for nav glass (darker for readability without blur)
- 15% desktop bg + 16px blur for nav glass (stronger blur per COMP-09)
- Consistent 10% border opacity on all nav scroll states

**Phase 30-05 Decisions:**
- Hardcoded hex values for semantic badge colors (COLOR-05 spec values)
- FooterCTA uses Button (not AnimatedButton) to support asChild/Slot pattern

**Phase 30-04 Decisions:**
- CTAGroup secondary uses ghost variant (not outline) per COMP-11 spec
- SocialProofRow commented in HeroContent until actual logos available
- Badge with sparkle emoji for 'new feature' announcement pattern

**Phase 30-06 Decisions:**
- Navigation inside Providers for motion context access
- Text-based Findo logo (no image assets needed)
- Single ghost CTA for conversion-focused homepage
- pt-16 body wrapper for fixed nav clearance

**Phase 30-07 Decisions:**
- AnimatedCard for ZeroRiskSummary (hover lift + rim lighting)
- withCard prop defaults to false for backward compatibility
- Conditional py-6 padding (omit when card wrapper provides its own)

### Pending Todos

**Phase 32 Reset Required:**
- Original Phase 32 implementation removed (did not meet Linear design quality standards)
- Re-planning required using new design workflow
- Must follow `.planning/DESIGN-PHASE-WORKFLOW.md` process
- Must reference `design-bible/LINEAR-BLUEPRINT.md` for visual specs
- Must compare against `Screenshots of the linear website/` references

See: `.planning/phases/32-autopilot-hero-visualization/ARCHIVED-RESET.md` for details.

### Blockers/Concerns

**Production Readiness:**
- RLS enforcement requires findo_app database user creation
- Meta Business Verification required for WhatsApp Business API

**v3.0 Considerations:**
- Mobile Lighthouse variable (44-81) on local Windows - monitor during v3.0
- 7 new visualizations may impact performance - gate each phase
- OneDrive path causes Next.js build cache issues (verified CSS compiles correctly)

**Phase 30-08 Decisions:**
- Success badge replaces icon as verification indicator in guarantees
- Info badge complements outline badge in hero (not replaces)
- Flex gap-2 layout for graceful badge pairing

**Phase 31-01 Decisions:**
- Linear-style easing curves (ease-standard, ease-bouncy, ease-material, ease-quick-press)
- Duration tokens per MOTION spec: 150-200ms hover, 300-500ms reveal, 1.5s shimmer
- JS constants use `as const` for full type inference in Motion components

**Phase 31-02 Decisions:**
- Used @property for GPU-accelerated angle animation (avoids JS-based rotation)
- conic-gradient with 12% color wedge for subtle shimmer sweep
- Static fallback for Safari pre-15.4 using linear-gradient
- ShimmerCard component with noShimmer prop for programmatic disable

**Phase 31-03 Decisions:**
- SkipLink uses sr-only/focus:not-sr-only pattern for keyboard-only visibility
- Changed div.pt-16 wrapper to semantic main#main-content element
- CSS already compliant - added A11Y-02/A11Y-03 markers for documentation

**Phase 31-04 Decisions:**
- Link underline uses --duration-hover (150ms) with --ease-quick-press and fallbacks
- Added :focus-visible to link underline for keyboard accessibility
- hoverTransition uses bouncy easing, revealTransition uses standard easing
- MOTION-08 GPU-only property rule documented in animation.ts

**Phase 31-05 Decisions:**
- Touch target CSS is safety net (most buttons already meet 48px via padding)
- .tap-target-expand utility uses ::before pseudo-element for expanded tap area
- Contrast verification documented in CSS near color tokens for co-location

**Phase 32-01 Decisions (SUPERSEDED - implementation removed):**
~~- useRef initialized with empty function for TypeScript strict mode~~
~~- RTL-aware positioning using right instead of left for Hebrew UI~~
~~- intervalMs=0 disables increment for status text panels~~
~~- zPosition prop system: front/middle/back with preset 3D transforms~~

*Note: Phase 32 was reset because implementation did not meet Linear design quality standards. Re-planning required with new design workflow.*

## Session Continuity

Last session: 2026-02-06
Stopped at: Phase 32 RESET - original implementation removed
Resume action: `/gsd:discuss-phase 32` (re-discuss before planning - see updated 32-CONTEXT.md)

---
*Updated: 2026-02-06 after Phase 32 reset*
