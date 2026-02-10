# Roadmap: Findo

## Milestones

- v1.0 MVP - Phases 1-11 (shipped 2026-01-30)
- v1.1 Sales Website - Phases 12-19 (shipped 2026-02-03)
- v2.0 Visual Excellence - Phases 20-27 (certified 2026-02-05)
- v3.0 Linear Design System - Phases 28-36 (in progress)

## Phases

<details>
<summary>v1.0 MVP (Phases 1-11) - SHIPPED 2026-01-30</summary>

Autonomous SMB management platform that captures leads from missed calls, auto-replies to reviews, requests reviews after service, manages GBP content, and optimizes performance — all without owner intervention after a 2-minute setup.

See MILESTONES.md for full v1.0 details.

</details>

<details>
<summary>v1.1 Sales Website (Phases 12-19) - SHIPPED 2026-02-03</summary>

World-class Hebrew sales website with conversion-optimized psychological journey, achieving Lighthouse 95+ performance, complete analytics infrastructure, and production-ready deployment for high-converting referral traffic.

See MILESTONES.md for full v1.1 details.

</details>

<details>
<summary>v2.0 Visual Excellence (Phases 20-27) - CERTIFIED 2026-02-05</summary>

World-class visual polish transforming website from "functional MVP" (69% certification) to premium visual excellence rivaling Linear, Stripe, and Vercel. First reaction: "WOW" not "nice".

**Result:** CERTIFIED WITH NOTES - Desktop 90+, human validation passed, mobile performance documented for future optimization.

See MILESTONES.md for full v2.0 details.
See milestones/v2.0-REQUIREMENTS.md for requirements archive.

</details>

### v3.0 Linear Design System (In Progress)

**Milestone Goal:** Transform the Findo sales website with Linear's signature design system — semantic color tokens, refined typography, comprehensive component library, motion system, and 7 conceptual visualizations that tell clear value stories. The result: a premium SaaS aesthetic that rivals Linear itself while maintaining Findo's Hebrew brand identity.

#### Phase 28: Design Foundation
**Goal**: Establish the complete color and typography token system as CSS custom properties
**Depends on**: v2.0 complete
**Requirements**: COLOR-01, COLOR-02, COLOR-03, COLOR-04, COLOR-05, COLOR-06, TYPO-01, TYPO-02, TYPO-03, TYPO-04, TYPO-05, TYPO-06, TYPO-07
**Success Criteria** (what must be TRUE):
  1. All semantic color tokens (bg, surface, text, accent, status) defined as CSS custom properties
  2. Dark background (#08090A) with surface hierarchy implemented across all sections
  3. Glass surface formula (5% white, blur, 8% border) available as reusable token
  4. 4px-based type scale renders correctly with Heebo font at all breakpoints
  5. Typography weights and line-heights documented and applied consistently
**Plans**: 2 plans

Plans:
- [x] 28-01-PLAN.md — Color token system (bg, surface, text, accent, status, border, glow)
- [x] 28-02-PLAN.md — Typography token system (4px scale, semantic tokens, weights)

#### Phase 29: Layout System
**Goal**: Implement comprehensive 4px-grid spacing system with responsive breakpoints
**Depends on**: Phase 28
**Requirements**: SPACE-01, SPACE-02, SPACE-03, SPACE-04, SPACE-05, SPACE-06, SPACE-07
**Success Criteria** (what must be TRUE):
  1. 4px base spacing scale (4-128px) available as Tailwind utilities
  2. 12-column grid with proper gutters renders on all breakpoints
  3. Content containers respect 1200px max-width
  4. Section padding follows Linear specs (120px hero, 80px sections, etc.)
  5. All existing sections pass 4px grid audit
**Plans**: 2 plans

Plans:
- [x] 29-01-PLAN.md — Spacing tokens, section rhythm utilities, container configuration
- [x] 29-02-PLAN.md — Section spacing audit and 4px grid alignment

#### Phase 30: Component Library
**Goal**: Redesign all interactive components to Linear specifications with proper variants
**Depends on**: Phase 29
**Requirements**: COMP-01, COMP-02, COMP-03, COMP-04, COMP-05, COMP-06, COMP-07, COMP-08, COMP-09, COMP-10, COMP-11, COMP-12, COMP-13
**Success Criteria** (what must be TRUE):
  1. Primary/secondary/ghost buttons have correct hover/active states with bouncy easing
  2. Cards display gradient borders, proper lift animation, and highlighted variant works
  3. Navigation is sticky with scroll state transitions (opacity + blur)
  4. Hero follows badge-H1-subheadline-CTAs-social-proof structure
  5. Glassmorphism cards render with correct blur/border/background formula
**Plans**: 8 plans

Plans:
- [x] 30-01-PLAN.md — Button redesign (primary, secondary, ghost, sizes, bouncy spring)
- [x] 30-02-PLAN.md — Card redesign (gradient border, highlighted, glassmorphism)
- [x] 30-03-PLAN.md — Navigation redesign with scroll state transitions
- [x] 30-04-PLAN.md — Hero pattern structure and social proof row
- [x] 30-05-PLAN.md — Footer CTA section and badge/chip redesign
- [x] 30-06-PLAN.md — GlassNav integration into layout (gap closure)
- [x] 30-07-PLAN.md — Card variants integration into visible sections (gap closure)
- [x] 30-08-PLAN.md — Badge semantic variants integration (gap closure)

#### Phase 31: Motion & Accessibility
**Goal**: Implement Linear easing curves, standardized animations, and complete accessibility layer
**Depends on**: Phase 30
**Requirements**: MOTION-01, MOTION-02, MOTION-03, MOTION-04, MOTION-05, MOTION-06, MOTION-07, MOTION-08, A11Y-01, A11Y-02, A11Y-03, A11Y-04, A11Y-05, A11Y-06
**Success Criteria** (what must be TRUE):
  1. Easing curves (standard, bouncy, material, quick-press) defined as CSS variables
  2. Hover animations complete in 150-200ms, reveal animations in 300-500ms
  3. Shimmer border effect appears on hero cards/featured elements
  4. Skip-to-content link visible on focus, keyboard navigation works through all sections
  5. prefers-reduced-motion disables/reduces all animations
**Plans**: 5 plans

Plans:
- [x] 31-01-PLAN.md — CSS easing curves and duration tokens
- [x] 31-02-PLAN.md — Shimmer border effect and ShimmerCard component
- [x] 31-03-PLAN.md — Skip link, focus states, layout integration
- [x] 31-04-PLAN.md — Animation audit and GPU-only standardization
- [x] 31-05-PLAN.md — Touch targets, keyboard nav docs, contrast verification

#### Phase 32: Autopilot Hero Visualization
**Goal**: Build the flagship "Autopilot Hero" — a 3D dashboard showing Findo running autonomously
**Depends on**: Phase 31
**Requirements**: VIZ-01, VIZ-08, VIZ-09, VIZ-10
**Success Criteria** (what must be TRUE):
  1. 3D dashboard with perspective renders above the fold
  2. Real-time status indicators animate (reviews, leads, messages)
  3. Scroll-triggered entrance animation activates on viewport entry
  4. Single clear story communicated: "Findo runs your business while you sleep"
**Plans**: 2 plans

Plans:
- [x] 32-01-PLAN.md — Static layout: 3D container, DashboardPanel shell, 3 panel content components, Hebrew data, sub-components
- [x] 32-02-PLAN.md — Animations + Hero integration: entrance stagger, count-up, periodic updates, usePeriodicUpdates hook, Hero.tsx integration

#### Phase 33: Value Visualizations Part 1
**Goal**: Build Lead Recovery Flow and Review Engine visualizations
**Depends on**: Phase 32
**Requirements**: VIZ-02, VIZ-03
**Success Criteria** (what must be TRUE):
  1. Lead Recovery shows missed call -> WhatsApp -> recovered lead animated sequence
  2. Review Engine shows GBP card with stars filling and rating climbing 4.2 -> 4.8
  3. Both use glassmorphism cards with proper 3D perspective
  4. Each communicates ONE clear value proposition
**Plans**: TBD

Plans:
- [ ] 33-01: Lead Recovery Flow visualization
- [ ] 33-02: Review Engine visualization

#### Phase 34: Value Visualizations Part 2
**Goal**: Build WhatsApp Center and Lead Pipeline visualizations
**Depends on**: Phase 33
**Requirements**: VIZ-04, VIZ-05
**Success Criteria** (what must be TRUE):
  1. WhatsApp Center shows messages flowing from multiple triggers (lead, reminder, review)
  2. Lead Pipeline shows funnel with items moving through stages and live counters
  3. Both use scroll-triggered animations with GSAP/Motion
  4. Each communicates ONE clear value proposition
**Plans**: TBD

Plans:
- [ ] 34-01: WhatsApp Center visualization
- [ ] 34-02: Lead Pipeline visualization

#### Phase 35: Value Visualizations Part 3
**Goal**: Build Chaos-to-Serenity and GBP Optimization Loop visualizations
**Depends on**: Phase 34
**Requirements**: VIZ-06, VIZ-07
**Success Criteria** (what must be TRUE):
  1. Chaos->Serenity shows before/after or morphing visualization (scattered -> organized)
  2. GBP Loop shows circular self-learning cycle with continuous improvement indicators
  3. Both use 3D perspective and scroll-triggered animations
  4. Each communicates ONE clear value proposition
**Plans**: TBD

Plans:
- [ ] 35-01: Chaos-to-Serenity visualization
- [ ] 35-02: GBP Optimization Loop visualization

#### Phase 36: Certification & Polish
**Goal**: Full design system audit, cross-browser testing, RTL/mobile validation, performance verification
**Depends on**: Phase 35
**Requirements**: PERF-01, PERF-02, PERF-03, PERF-04, PERF-05, PERF-06, CERT-01, CERT-02, CERT-03, CERT-04, CERT-05
**Success Criteria** (what must be TRUE):
  1. Desktop Lighthouse score 90+ maintained (no regression from v2.0)
  2. All animations run at 60fps with CLS = 0
  3. Full Linear blueprint audit checklist passes
  4. RTL (Hebrew) works correctly for all effects
  5. Mobile renders and animates correctly on all 7 visualizations
**Plans**: TBD

Plans:
- [ ] 36-01: Performance optimization and verification
- [ ] 36-02: Design system audit against Linear blueprint
- [ ] 36-03: RTL and mobile validation
- [ ] 36-04: Cross-browser testing and final certification

## Progress

| Phase | Milestone | Plans | Status | Completed |
|-------|-----------|-------|--------|-----------|
| 1-11 | v1.0 MVP | 67 | SHIPPED | 2026-01-30 |
| 12-19 | v1.1 Sales Website | 43 | SHIPPED | 2026-02-03 |
| 20-27 | v2.0 Visual Excellence | 31 | CERTIFIED | 2026-02-05 |
| 28 - Design Foundation | v3.0 | 2 | Complete | 2026-02-05 |
| 29 - Layout System | v3.0 | 2 | Complete | 2026-02-05 |
| 30 - Component Library | v3.0 | 8 | Complete | 2026-02-06 |
| 31 - Motion & Accessibility | v3.0 | 5 | Complete | 2026-02-06 |
| 32 - Autopilot Hero | v3.0 | 2 | Complete | 2026-02-10 |
| 33 - Value Viz Part 1 | v3.0 | TBD | Not started | - |
| 34 - Value Viz Part 2 | v3.0 | TBD | Not started | - |
| 35 - Value Viz Part 3 | v3.0 | TBD | Not started | - |
| 36 - Certification | v3.0 | TBD | Not started | - |

**Total:** 36 phases across 4 milestones

---
*Roadmap created: 2026-02-03*
*Last updated: 2026-02-10 - Phase 32 COMPLETE (Linear-quality hero visualization shipped)*
