# Requirements: Findo v3.0 Linear Design System

**Defined:** 2026-02-05
**Core Value:** Premium SaaS aesthetic following Linear's design principles while maintaining Findo brand identity for Israeli SMBs.

## v3.0 Requirements

Requirements for Linear Design System adaptation. Each maps to roadmap phases.

### Color System

- [x] **COLOR-01**: Implement semantic color token system (bg/dark, bg/surface, text/primary, accent/primary, etc.)
- [x] **COLOR-02**: Refine dark background to #08090A with surface hierarchy (#151516 elevated)
- [x] **COLOR-03**: Define glass surface formula (5% white, blur 20px, 8% border) as reusable tokens
- [x] **COLOR-04**: Implement accent glow tokens with specific opacity values (0.15, 0.2, 0.3)
- [x] **COLOR-05**: Create semantic status colors (success #22C55E, warning #EAB308, error #EF4444, info #3B82F6)
- [x] **COLOR-06**: Document color tokens as CSS custom properties in Tailwind @theme

### Typography

- [x] **TYPO-01**: Implement 4px-based type scale (12, 14, 16, 18, 20, 24, 32, 48, 62px)
- [x] **TYPO-02**: Define weight system per use case (400 body, 500 caption, 600 labels/buttons, 700 H2-H3, 800 display)
- [x] **TYPO-03**: Implement letter-spacing on labels (tracking for 12px uppercase labels)
- [x] **TYPO-04**: Define line-height formula (1.1-1.16 display, 1.2-1.3 headings, 1.5-1.6 body)
- [x] **TYPO-05**: Implement responsive typography scale (62px -> 48px -> 36px for H1)
- [x] **TYPO-06**: Ensure Hebrew (Heebo) font works with Linear-style hierarchy
- [x] **TYPO-07**: Document typography tokens as Tailwind text utilities

### Grid & Spacing

- [x] **SPACE-01**: Implement 4px base spacing scale (4, 8, 12, 16, 24, 32, 48, 64, 96, 128px)
- [x] **SPACE-02**: Configure 12-column grid with 24-32px gutters
- [x] **SPACE-03**: Set max-width to ~1200px for content containers
- [x] **SPACE-04**: Implement section padding specs (120px hero top, 80px sections, 64px CTA, 48px footer)
- [x] **SPACE-05**: Define breakpoints (640/768/1024/1440px) with consistent behavior
- [x] **SPACE-06**: Audit all sections for spacing consistency with 4px grid
- [x] **SPACE-07**: Document spacing tokens as Tailwind spacing utilities

### Components

- [x] **COMP-01**: Redesign primary button (gradient bg, -2px hover lift, 0.95 active scale, bouncy easing)
- [x] **COMP-02**: Redesign secondary button (transparent, border 20% white, 5% bg on hover)
- [x] **COMP-03**: Redesign ghost button (no bg, muted text, white on hover)
- [x] **COMP-04**: Implement button sizes (S: 32px/8px-16px, M: 40px/12px-24px, L: 48px/16px-32px)
- [x] **COMP-05**: Redesign cards (gradient border, 16px radius, 32px padding, -4px hover lift)
- [x] **COMP-06**: Implement highlighted card variant (2px accent border, glow shadow, "Most popular" badge)
- [x] **COMP-07**: Redesign badges/chips (pill shape 20px radius, semantic color variants)
- [x] **COMP-08**: Redesign navigation (64px height, sticky, semi-transparent + blur on scroll)
- [x] **COMP-09**: Implement navigation scroll state (85% opacity, stronger blur when scrolled)
- [x] **COMP-10**: Redesign footer CTA section with tagline pattern
- [x] **COMP-11**: Implement hero pattern structure (badge -> H1 -> subheadline -> CTAs -> social proof)
- [x] **COMP-12**: Redesign social proof row (grayscale logos, 48px gap, 60% opacity)
- [x] **COMP-13**: Implement glassmorphism card system (5% white bg, blur 20px, 8% border, per Linear spec)

### Motion & Animation

- [x] **MOTION-01**: Implement Linear easing curves as CSS variables (standard, material, bouncy, quick-press)
- [x] **MOTION-02**: Standardize hover animations to 150-200ms with bouncy easing
- [x] **MOTION-03**: Standardize reveal animations to 300-500ms with standard easing
- [x] **MOTION-04**: Implement shimmer border effect (1.5s duration, 3s delay, signature Linear animation)
- [x] **MOTION-05**: Apply shimmer to hero cards/featured elements
- [x] **MOTION-06**: Audit all animations for "motion should be felt, not seen" principle
- [x] **MOTION-07**: Implement link underline animation (scaleX with transform-origin)
- [x] **MOTION-08**: Ensure all animations use GPU-accelerated properties only (transform, opacity)

### Accessibility

- [x] **A11Y-01**: Implement skip to content link (visible on focus)
- [x] **A11Y-02**: Enhance focus states with visible outlines on all interactive elements
- [x] **A11Y-03**: Implement prefers-reduced-motion media query (disable/reduce all animations)
- [x] **A11Y-04**: Test and document keyboard navigation path through all sections
- [x] **A11Y-05**: Verify WCAG AA+ contrast on all text/background combinations
- [x] **A11Y-06**: Ensure all interactive elements have sufficient touch targets (48px minimum)

### Conceptual Visualizations

- [x] **VIZ-01**: Build "Autopilot Hero" — 3D dashboard with real-time status indicators, animated notifications/updates
- [ ] **VIZ-02**: Build "Lead Recovery Flow" — Animated missed call -> WhatsApp -> recovered lead sequence with glassmorphism cards
- [ ] **VIZ-03**: Build "Review Engine" — GBP card with filling stars, counter, rating climbing 4.2 -> 4.8 visualization
- [ ] **VIZ-04**: Build "WhatsApp Center" — Messages flowing automatically from multiple triggers (lead, reminder, review request)
- [ ] **VIZ-05**: Build "Lead Pipeline" — Funnel visualization with items moving through stages, live counters
- [ ] **VIZ-06**: Build "Chaos -> Serenity" — Before/after or morphing visualization (scattered -> organized)
- [ ] **VIZ-07**: Build "GBP Optimization Loop" — Circular self-learning cycle showing continuous improvement
- [x] **VIZ-08**: All visualizations use 3D perspective on floating UI elements
- [x] **VIZ-09**: All visualizations use scroll-triggered animations (Motion + GSAP)
- [x] **VIZ-10**: Each visualization communicates ONE clear story/value proposition

### Performance

- [ ] **PERF-01**: Maintain Desktop Lighthouse score 90+ (no regression from v2.0)
- [ ] **PERF-02**: Maintain 60fps animations during scroll and interactions
- [ ] **PERF-03**: Maintain CLS = 0 (no layout shifts from animations)
- [ ] **PERF-04**: Performance gate on each phase (test before merge)
- [ ] **PERF-05**: Optimize visualization assets (AVIF/WebP, lazy loading for off-screen)
- [ ] **PERF-06**: Implement will-change toggle pattern (add before animation, remove after)

### Certification

- [ ] **CERT-01**: Full design system audit against Linear blueprint checklist
- [ ] **CERT-02**: All 7 visualizations tell clear value stories (user testing)
- [ ] **CERT-03**: RTL (Hebrew) validation — all effects work correctly in RTL
- [ ] **CERT-04**: Mobile validation — all components and visualizations work on mobile
- [ ] **CERT-05**: Cross-browser testing (Chrome, Safari, Firefox, Edge)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Content/copy rewrite | Focus on visual design, Hebrew copy patterns differ from English |
| Linear exact colors | Adapting principles, keeping Findo orange brand |
| Dashboard redesign | v3.0 focuses on sales website only |
| New pages | Single landing page focus |
| Interactive 3D (Spline/Three.js) | Pre-rendered + CSS animations preferred for performance |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| COLOR-01 | Phase 28 | Complete |
| COLOR-02 | Phase 28 | Complete |
| COLOR-03 | Phase 28 | Complete |
| COLOR-04 | Phase 28 | Complete |
| COLOR-05 | Phase 28 | Complete |
| COLOR-06 | Phase 28 | Complete |
| TYPO-01 | Phase 28 | Complete |
| TYPO-02 | Phase 28 | Complete |
| TYPO-03 | Phase 28 | Complete |
| TYPO-04 | Phase 28 | Complete |
| TYPO-05 | Phase 28 | Complete |
| TYPO-06 | Phase 28 | Complete |
| TYPO-07 | Phase 28 | Complete |
| SPACE-01 | Phase 29 | Complete |
| SPACE-02 | Phase 29 | Complete |
| SPACE-03 | Phase 29 | Complete |
| SPACE-04 | Phase 29 | Complete |
| SPACE-05 | Phase 29 | Complete |
| SPACE-06 | Phase 29 | Complete |
| SPACE-07 | Phase 29 | Complete |
| COMP-01 | Phase 30 | Complete |
| COMP-02 | Phase 30 | Complete |
| COMP-03 | Phase 30 | Complete |
| COMP-04 | Phase 30 | Complete |
| COMP-05 | Phase 30 | Complete |
| COMP-06 | Phase 30 | Complete |
| COMP-07 | Phase 30 | Complete |
| COMP-08 | Phase 30 | Complete |
| COMP-09 | Phase 30 | Complete |
| COMP-10 | Phase 30 | Complete |
| COMP-11 | Phase 30 | Complete |
| COMP-12 | Phase 30 | Complete |
| COMP-13 | Phase 30 | Complete |
| MOTION-01 | Phase 31 | Complete |
| MOTION-02 | Phase 31 | Complete |
| MOTION-03 | Phase 31 | Complete |
| MOTION-04 | Phase 31 | Complete |
| MOTION-05 | Phase 31 | Complete |
| MOTION-06 | Phase 31 | Complete |
| MOTION-07 | Phase 31 | Complete |
| MOTION-08 | Phase 31 | Complete |
| A11Y-01 | Phase 31 | Complete |
| A11Y-02 | Phase 31 | Complete |
| A11Y-03 | Phase 31 | Complete |
| A11Y-04 | Phase 31 | Complete |
| A11Y-05 | Phase 31 | Complete |
| A11Y-06 | Phase 31 | Complete |
| VIZ-01 | Phase 32 | Complete |
| VIZ-08 | Phase 32 | Complete |
| VIZ-09 | Phase 32 | Complete |
| VIZ-10 | Phase 32 | Complete |
| VIZ-02 | Phase 33 | Pending |
| VIZ-03 | Phase 33 | Pending |
| VIZ-04 | Phase 34 | Pending |
| VIZ-05 | Phase 34 | Pending |
| VIZ-06 | Phase 35 | Pending |
| VIZ-07 | Phase 35 | Pending |
| PERF-01 | Phase 36 | Pending |
| PERF-02 | Phase 36 | Pending |
| PERF-03 | Phase 36 | Pending |
| PERF-04 | Phase 36 | Pending |
| PERF-05 | Phase 36 | Pending |
| PERF-06 | Phase 36 | Pending |
| CERT-01 | Phase 36 | Pending |
| CERT-02 | Phase 36 | Pending |
| CERT-03 | Phase 36 | Pending |
| CERT-04 | Phase 36 | Pending |
| CERT-05 | Phase 36 | Pending |

**Coverage:**
- v3.0 requirements: 68 total
- Mapped to phases: 68
- Unmapped: 0

---
*Requirements defined: 2026-02-05*
*Last updated: 2026-02-10 - Phase 32 requirements complete (51/68)*
