# Roadmap: Findo

## Milestones

- ✅ **v1.0 MVP** - Phases 1-11 (shipped 2026-01-30)
- ✅ **v1.1 Sales Website** - Phases 12-19 (shipped 2026-02-03)
- 🚧 **v2.0 Visual Excellence** - Phases 20-27 (in progress)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-11) - SHIPPED 2026-01-30</summary>

Autonomous SMB management platform that captures leads from missed calls, auto-replies to reviews, requests reviews after service, manages GBP content, and optimizes performance — all without owner intervention after a 2-minute setup.

See MILESTONES.md for full v1.0 details.

</details>

<details>
<summary>✅ v1.1 Sales Website (Phases 12-19) - SHIPPED 2026-02-03</summary>

World-class Hebrew sales website with conversion-optimized psychological journey, achieving Lighthouse 95+ performance, complete analytics infrastructure, and production-ready deployment for high-converting referral traffic.

See MILESTONES.md for full v1.1 details.

</details>

### 🚧 v2.0 Visual Excellence (In Progress)

**Milestone Goal:** Transform website from "functional MVP" (69% certification) to world-class visual excellence rivaling Linear, Stripe, and Vercel. Target first reaction: "WOW" not "nice".

#### Phase 20: Typography & Gradient Foundation
**Goal**: Establish premium visual language with gradient text and optimized Hebrew typography across all content.
**Depends on**: Phase 19 (v1.1 complete)
**Requirements**: GRAD-01, GRAD-04, TYPO-01, TYPO-02, TYPO-03, TYPO-04, TYPO-05, TYPO-06, RTL-01
**Success Criteria** (what must be TRUE):
  1. Hero headline displays gradient text (orange-500 → amber-500) rendering correctly with Hebrew characters
  2. Section headlines use gradient text where impactful without performance degradation
  3. Hebrew body text has line-height 1.8 for readability
  4. Typography hierarchy is clear through size AND color (secondary text uses zinc-400)
  5. Gradient directions work correctly in RTL (start/end not left/right)
**Plans**: 3 plans

Plans:
- [x] 20-01-PLAN.md — Gradient text foundation + hero headline
- [x] 20-02-PLAN.md — Hebrew typography optimization
- [x] 20-03-PLAN.md — Section gradients + visual verification

#### Phase 21: Background Depth System
**Goal**: Create sophisticated visual environment with layered background elements (grid, orbs, noise) that sets premium tone.
**Depends on**: Phase 20
**Requirements**: BG-01, BG-02, BG-03, BG-04, BG-05, BG-06
**Success Criteria** (what must be TRUE):
  1. Subtle grid pattern overlay (5% opacity) covers full viewport across all breakpoints
  2. Gradient orbs/blobs create ambient background depth with orange/20 blur
  3. Noise texture overlay adds premium feel via inline SVG (no HTTP request)
  4. Background layers work at mobile, tablet, and desktop without jarring transitions
  5. Orbs have subtle parallax movement on scroll
  6. Lighthouse Performance remains 95+ with all background layers active
**Plans**: 2 plans

Plans:
- [x] 21-01-PLAN.md — BackgroundDepth component (grid, orbs, noise, parallax)
- [x] 21-02-PLAN.md — Layout integration + performance verification

#### Phase 22: Glow Effects & Multi-Layer Shadows
**Goal**: Bring attention to conversion points with sophisticated glow effects and multi-layer shadow system.
**Depends on**: Phase 21
**Requirements**: GRAD-02, GRAD-03, GRAD-05, GRAD-06
**Success Criteria** (what must be TRUE):
  1. Primary CTA has subtle pulse animation (glow intensity cycles) that draws attention without distraction
  2. CTA buttons have glow effect on hover (orange-500/20 blur with 2-3 shadow layers)
  3. Elevated elements use 4-layer shadow system for realistic depth
  4. Dark mode elements have rim lighting effect for premium separation
  5. Glow effects limited to 5-8 elements per viewport (performance budget maintained)
**Plans**: 3 plans

Plans:
- [x] 22-01-PLAN.md — CSS foundation (shadow variables, glow keyframes)
- [x] 22-02-PLAN.md — Component enhancements (Button glow, Card rim lighting, Input focus)
- [x] 22-03-PLAN.md — Integration (apply effects to CTAs, cards) + visual verification

#### Phase 23: 3D Phone Mockup
**Goal**: Deliver hero visual centerpiece with pre-rendered 3D phone mockup featuring realistic shadows and subtle parallax.
**Depends on**: Phase 22
**Requirements**: MOCK-01, MOCK-02, MOCK-03, MOCK-04, MOCK-05, MOCK-06, MOCK-07, RTL-04
**Success Criteria** (what must be TRUE):
  1. Pre-rendered 3D phone mockup displays with realistic multi-layer CSS shadows (contact + directional + ambient)
  2. Activity feed animation plays inside mockup as story sequence
  3. Screen has subtle glow effect enhancing premium feel
  4. Parallax movement on scroll works without jank (simple-parallax-js or GSAP)
  5. Mockup optimized for LCP < 1.5s (AVIF/WebP format, preloaded)
  6. Dark mode lighting looks premium with rim light and reflections
  7. Phone mockup positioned correctly for RTL (left side of text)
**Plans**: TBD

Plans:
- [ ] 23-01: TBD

#### Phase 24: Micro-Interactions
**Goal**: Add sophisticated hover and interaction states to every interactive element (buttons, cards, links, inputs).
**Depends on**: Phase 23
**Requirements**: MICRO-01, MICRO-02, MICRO-03, MICRO-04, MICRO-05, MICRO-06, MICRO-07, MICRO-08, RTL-06
**Success Criteria** (what must be TRUE):
  1. Buttons scale 1.02-1.05 on hover with glow intensify, scale 0.98 on press with reduced shadow
  2. Cards lift (translateY -4px) on hover with shadow increase
  3. Links have animated underline that slides in from left (right in RTL)
  4. Input fields have focus glow effect (box-shadow with 4px spread)
  5. Error states have shake animation + red glow pulse
  6. All transitions use cubic-bezier easing (not linear) with 250ms duration
  7. All micro-interactions maintain 60fps on Galaxy A24 4G
**Plans**: TBD

Plans:
- [ ] 24-01: TBD

#### Phase 25: Animation Choreography
**Goal**: Implement orchestrated entrance sequences and scroll-triggered reveals that create premium polish through timing precision.
**Depends on**: Phase 24
**Requirements**: ANIM-01, ANIM-02, ANIM-03, ANIM-04, ANIM-05, ANIM-06, ANIM-07, ANIM-08, ANIM-09, ANIM-10, ANIM-11, ANIM-12, ANIM-13, RTL-02, RTL-05
**Success Criteria** (what must be TRUE):
  1. Hero section has 7-phase orchestrated entrance: background (0-300ms) → nav (200-500ms) → headline (300-800ms) → subheadline (600-900ms) → CTAs (800-1100ms) → mockup (500-1200ms) → feed (1000ms+)
  2. Each section has scroll-triggered reveal animation with stagger delays (100-150ms)
  3. Stats numbers count up when section enters viewport
  4. Testimonial cards slide in from alternating sides with stagger
  5. prefers-reduced-motion respected (opacity-only fallback implemented)
  6. Parallax/slide animations work right-to-left in RTL
  7. All animation directions respect document direction
  8. GSAP timeline + Motion orchestration maintains 60fps during entrance sequence
**Plans**: TBD

Plans:
- [ ] 25-01: TBD

#### Phase 26: Glassmorphism & Section Upgrades
**Goal**: Apply glassmorphism effect strategically (DANGER ZONE - performance tested) and upgrade all sections with full visual language.
**Depends on**: Phase 25
**Requirements**: GLASS-01, GLASS-02, GLASS-03, GLASS-04, GLASS-05, GLASS-06, SECT-01, SECT-02, SECT-03, SECT-04, SECT-05, SECT-06, SECT-07, SECT-08, SECT-09, SECT-10, RTL-03
**Success Criteria** (what must be TRUE):
  1. Feature cards use glassmorphism (backdrop-blur + border) limited to 3-5 cards per viewport
  2. Stats section cards have glass effect with count animations
  3. Testimonial cards have glass effect with hover lift
  4. Mobile devices get solid rgba() background fallback (no backdrop-blur if performance drops)
  5. Alternative gradient borders available where glass is too expensive
  6. All 10 sections (Hero, Stats, Testimonials, ROI Calculator, FAQ, Pricing, Founder, Contact, Footer, Navigation) upgraded with full visual language
  7. Carousel arrows swap sides for RTL correctly
  8. Lighthouse Performance remains 95+ after glassmorphism implementation (critical gate)
**Plans**: TBD

Plans:
- [ ] 26-01: TBD

#### Phase 27: Performance Certification
**Goal**: Validate all performance gates, conduct device testing, and achieve 9+ professional rating for v2.0 certification.
**Depends on**: Phase 26
**Requirements**: PERF-01, PERF-02, PERF-03, PERF-04, PERF-05, PERF-06, PERF-07, PERF-08, CERT-01, CERT-02, CERT-03, CERT-04, CERT-05
**Success Criteria** (what must be TRUE):
  1. Lighthouse Performance score 95+ on desktop AND mobile
  2. LCP < 1.5s desktop, < 2.5s mobile
  3. CLS = 0 (no layout shift from animations verified)
  4. 60fps animations maintained on Samsung Galaxy A24 4G (physical device tested)
  5. All animations use GPU-accelerated properties only (transform, opacity)
  6. will-change limited to <10 elements at any time (verified in DevTools)
  7. 5-person "professional rating" test averages 9+ out of 10
  8. No glassmorphism on elements that cause jank (performance-validated)
  9. Hebrew typography review by native speaker completed with approval
**Plans**: TBD

Plans:
- [ ] 27-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 20 → 21 → 22 → 23 → 24 → 25 → 26 → 27

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 20. Typography & Gradient Foundation | v2.0 | 3/3 | ✅ Complete | 2026-02-03 |
| 21. Background Depth System | v2.0 | 2/2 | ✅ Complete | 2026-02-03 |
| 22. Glow Effects & Multi-Layer Shadows | v2.0 | 3/3 | ✅ Complete | 2026-02-03 |
| 23. 3D Phone Mockup | v2.0 | 0/TBD | Not started | - |
| 24. Micro-Interactions | v2.0 | 0/TBD | Not started | - |
| 25. Animation Choreography | v2.0 | 0/TBD | Not started | - |
| 26. Glassmorphism & Section Upgrades | v2.0 | 0/TBD | Not started | - |
| 27. Performance Certification | v2.0 | 0/TBD | Not started | - |

---
*Roadmap created: 2026-02-03*
*Last updated: 2026-02-03 after Phase 22 execution complete*
