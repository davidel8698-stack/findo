# Requirements: Findo v2.0 Visual Excellence

**Defined:** 2026-02-03
**Core Value:** Transform website from "functional MVP" to world-class visual excellence rivaling Linear, Stripe, and Vercel. First reaction: "WOW" not "nice".

## v2.0 Requirements

Requirements for visual excellence milestone. Each maps to roadmap phases.

### Gradients & Glows

- [x] **GRAD-01**: Hero headline uses gradient text (orange-500 → amber-500)
- [x] **GRAD-02**: CTA buttons have glow effect on hover (orange-500/20 blur)
- [x] **GRAD-03**: Primary CTA has subtle pulse animation (glow intensity cycles)
- [x] **GRAD-04**: Section headlines use gradient text where impactful
- [x] **GRAD-05**: Multi-layer shadows on elevated elements (4-layer shadow system)
- [x] **GRAD-06**: Rim lighting effect on dark mode elements for depth

### Background Depth

- [x] **BG-01**: Subtle grid pattern overlay (5% opacity, covers full viewport)
- [x] **BG-02**: Gradient orbs/blobs as ambient background elements (blurred, orange/20)
- [x] **BG-03**: Noise texture overlay for premium feel (inline SVG, subtle)
- [x] **BG-04**: Background layers work at all breakpoints (mobile, tablet, desktop)
- [x] **BG-05**: Background transitions smoothly between sections (not jarring)
- [x] **BG-06**: Orbs have subtle parallax movement on scroll

### Glassmorphism

- [ ] **GLASS-01**: Feature cards use glassmorphism (backdrop-blur + border)
- [ ] **GLASS-02**: Stats section cards have glass effect
- [ ] **GLASS-03**: Testimonial cards have glass effect with hover lift
- [ ] **GLASS-04**: Mobile fallback for devices that can't handle backdrop-blur
- [ ] **GLASS-05**: Maximum 3-5 glass elements visible per viewport (performance budget)
- [ ] **GLASS-06**: Alternative gradient borders available where glass is too expensive

### Animation Choreography

- [ ] **ANIM-01**: Hero section has orchestrated entrance sequence (7-phase timeline)
- [ ] **ANIM-02**: Background fades in first (0-300ms)
- [ ] **ANIM-03**: Navigation slides down (200-500ms)
- [ ] **ANIM-04**: Hero headline reveals word-by-word or letter-by-letter (300-800ms)
- [ ] **ANIM-05**: Subheadline fades up with delay (600-900ms)
- [ ] **ANIM-06**: CTA buttons scale in with bounce easing (800-1100ms)
- [ ] **ANIM-07**: Phone mockup slides in from side (500-1200ms)
- [ ] **ANIM-08**: Activity feed starts animating after hero complete (1000ms+)
- [ ] **ANIM-09**: Each section has scroll-triggered reveal animation
- [ ] **ANIM-10**: Stagger delays between child elements (100-150ms)
- [ ] **ANIM-11**: Stats numbers count up when section enters viewport
- [ ] **ANIM-12**: Testimonial cards slide in from alternating sides
- [ ] **ANIM-13**: prefers-reduced-motion respected (opacity-only fallback)

### Micro-Interactions

- [ ] **MICRO-01**: Buttons scale 1.02-1.05 on hover with glow intensify
- [ ] **MICRO-02**: Buttons scale 0.98 on press with reduced shadow
- [ ] **MICRO-03**: Cards lift (translateY -4px) on hover with shadow increase
- [ ] **MICRO-04**: Links have animated underline (slides in from left)
- [ ] **MICRO-05**: Input fields have focus glow effect
- [ ] **MICRO-06**: Error states have shake animation + red glow pulse
- [ ] **MICRO-07**: All transitions use cubic-bezier easing (not linear)
- [ ] **MICRO-08**: Hover states have 250ms duration (not instant)

### 3D Mockup

- [ ] **MOCK-01**: Pre-rendered 3D phone mockup with realistic shadows
- [ ] **MOCK-02**: Activity feed animation plays inside mockup (story sequence)
- [ ] **MOCK-03**: Multi-layer CSS shadows create depth (4 shadow layers)
- [ ] **MOCK-04**: Parallax movement on scroll (simple-parallax-js)
- [ ] **MOCK-05**: Screen has subtle glow effect
- [ ] **MOCK-06**: Mockup optimized for LCP (AVIF/WebP, preload)
- [ ] **MOCK-07**: Dark mode lighting looks premium (rim light, reflections)

### RTL Adaptations

- [x] **RTL-01**: Gradient directions work correctly in RTL (start/end not left/right)
- [ ] **RTL-02**: Parallax/slide animations work right-to-left
- [ ] **RTL-03**: Carousel arrows swap sides for RTL
- [ ] **RTL-04**: Phone mockup positioned correctly for RTL (left side of text)
- [ ] **RTL-05**: All animation directions respect document direction
- [ ] **RTL-06**: Link underlines animate from right in RTL

### Hebrew Typography

- [x] **TYPO-01**: Hebrew body text has line-height 1.8 (readability)
- [~] **TYPO-02**: Hebrew headlines have tighter letter-spacing — *Deferred: User decision to use normal letter-spacing*
- [x] **TYPO-03**: Secondary text uses muted color (zinc-400)
- [x] **TYPO-04**: Typography scale creates clear hierarchy (size AND color)
- [x] **TYPO-05**: Bold weights (700-800) for headline impact
- [x] **TYPO-06**: Gradient text renders correctly with Hebrew characters

### Performance Gates

- [ ] **PERF-01**: Lighthouse Performance score 95+ (desktop)
- [ ] **PERF-02**: Lighthouse Performance score 95+ (mobile)
- [ ] **PERF-03**: LCP < 1.5s (desktop), < 2.5s (mobile)
- [ ] **PERF-04**: CLS = 0 (no layout shift from animations)
- [ ] **PERF-05**: 60fps animations (no jank)
- [ ] **PERF-06**: Tested on Samsung Galaxy A24 4G (mid-range baseline)
- [ ] **PERF-07**: All animations use GPU-accelerated properties only
- [ ] **PERF-08**: will-change limited to <10 elements at any time

### Section Upgrades

- [ ] **SECT-01**: Hero section upgraded with all visual effects
- [ ] **SECT-02**: Stats section upgraded (glass cards, count animations)
- [ ] **SECT-03**: Testimonials section upgraded (glass cards, slide animations)
- [ ] **SECT-04**: ROI Calculator section upgraded (glass effect, interactions)
- [ ] **SECT-05**: FAQ section upgraded (accordion animations, hover states)
- [ ] **SECT-06**: Pricing section upgraded (card hover effects)
- [ ] **SECT-07**: Founder section upgraded (photo effects, gradient accents)
- [ ] **SECT-08**: Contact section upgraded (card glows, WhatsApp emphasis)
- [ ] **SECT-09**: Footer section upgraded (consistent styling)
- [ ] **SECT-10**: Navigation upgraded (consistent with new visual language)

### Certification

- [ ] **CERT-01**: 5-person "professional rating" test averages 9+ out of 10
- [ ] **CERT-02**: Lighthouse 95+ maintained after all visual upgrades
- [ ] **CERT-03**: Real device testing on mid-range Android (Galaxy A24)
- [ ] **CERT-04**: Hebrew typography review by native speaker
- [ ] **CERT-05**: No glassmorphism on elements that cause jank

## Out of Scope

| Feature | Reason |
|---------|--------|
| Real testimonials/content | Visual excellence first, content upgrade in separate milestone |
| Spline interactive 3D | Pre-rendered chosen for performance, Spline deferred |
| Custom cursor | Low ROI, adds complexity, mobile doesn't benefit |
| Page transitions | Single-page site, no route transitions needed |
| Video backgrounds | Performance risk, static visuals chosen instead |
| Complex particle effects | Performance risk, gradient orbs sufficient |
| AI-generated Hebrew copy | Native copywriter needed, separate milestone |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| GRAD-01 | Phase 20 | Pending |
| GRAD-04 | Phase 20 | Pending |
| TYPO-01 | Phase 20 | Pending |
| TYPO-02 | Phase 20 | Pending |
| TYPO-03 | Phase 20 | Pending |
| TYPO-04 | Phase 20 | Pending |
| TYPO-05 | Phase 20 | Pending |
| TYPO-06 | Phase 20 | Pending |
| RTL-01 | Phase 20 | Pending |
| BG-01 | Phase 21 | Pending |
| BG-02 | Phase 21 | Pending |
| BG-03 | Phase 21 | Pending |
| BG-04 | Phase 21 | Pending |
| BG-05 | Phase 21 | Pending |
| BG-06 | Phase 21 | Pending |
| GRAD-02 | Phase 22 | Pending |
| GRAD-03 | Phase 22 | Pending |
| GRAD-05 | Phase 22 | Pending |
| GRAD-06 | Phase 22 | Pending |
| MOCK-01 | Phase 23 | Pending |
| MOCK-02 | Phase 23 | Pending |
| MOCK-03 | Phase 23 | Pending |
| MOCK-04 | Phase 23 | Pending |
| MOCK-05 | Phase 23 | Pending |
| MOCK-06 | Phase 23 | Pending |
| MOCK-07 | Phase 23 | Pending |
| RTL-04 | Phase 23 | Pending |
| MICRO-01 | Phase 24 | Pending |
| MICRO-02 | Phase 24 | Pending |
| MICRO-03 | Phase 24 | Pending |
| MICRO-04 | Phase 24 | Pending |
| MICRO-05 | Phase 24 | Pending |
| MICRO-06 | Phase 24 | Pending |
| MICRO-07 | Phase 24 | Pending |
| MICRO-08 | Phase 24 | Pending |
| RTL-06 | Phase 24 | Pending |
| ANIM-01 | Phase 25 | Pending |
| ANIM-02 | Phase 25 | Pending |
| ANIM-03 | Phase 25 | Pending |
| ANIM-04 | Phase 25 | Pending |
| ANIM-05 | Phase 25 | Pending |
| ANIM-06 | Phase 25 | Pending |
| ANIM-07 | Phase 25 | Pending |
| ANIM-08 | Phase 25 | Pending |
| ANIM-09 | Phase 25 | Pending |
| ANIM-10 | Phase 25 | Pending |
| ANIM-11 | Phase 25 | Pending |
| ANIM-12 | Phase 25 | Pending |
| ANIM-13 | Phase 25 | Pending |
| RTL-02 | Phase 25 | Pending |
| RTL-05 | Phase 25 | Pending |
| GLASS-01 | Phase 26 | Pending |
| GLASS-02 | Phase 26 | Pending |
| GLASS-03 | Phase 26 | Pending |
| GLASS-04 | Phase 26 | Pending |
| GLASS-05 | Phase 26 | Pending |
| GLASS-06 | Phase 26 | Pending |
| SECT-01 | Phase 26 | Pending |
| SECT-02 | Phase 26 | Pending |
| SECT-03 | Phase 26 | Pending |
| SECT-04 | Phase 26 | Pending |
| SECT-05 | Phase 26 | Pending |
| SECT-06 | Phase 26 | Pending |
| SECT-07 | Phase 26 | Pending |
| SECT-08 | Phase 26 | Pending |
| SECT-09 | Phase 26 | Pending |
| SECT-10 | Phase 26 | Pending |
| RTL-03 | Phase 26 | Pending |
| PERF-01 | Phase 27 | Pending |
| PERF-02 | Phase 27 | Pending |
| PERF-03 | Phase 27 | Pending |
| PERF-04 | Phase 27 | Pending |
| PERF-05 | Phase 27 | Pending |
| PERF-06 | Phase 27 | Pending |
| PERF-07 | Phase 27 | Pending |
| PERF-08 | Phase 27 | Pending |
| CERT-01 | Phase 27 | Pending |
| CERT-02 | Phase 27 | Pending |
| CERT-03 | Phase 27 | Pending |
| CERT-04 | Phase 27 | Pending |
| CERT-05 | Phase 27 | Pending |

**Coverage:**
- v2.0 requirements: 75 total
- Mapped to phases: 75 (100% coverage)
- Unmapped: 0 ✓

**Phase Distribution:**
- Phase 20 (Typography & Gradient Foundation): 9 requirements
- Phase 21 (Background Depth System): 6 requirements
- Phase 22 (Glow Effects & Multi-Layer Shadows): 4 requirements
- Phase 23 (3D Phone Mockup): 8 requirements
- Phase 24 (Micro-Interactions): 9 requirements
- Phase 25 (Animation Choreography): 15 requirements
- Phase 26 (Glassmorphism & Section Upgrades): 17 requirements
- Phase 27 (Performance Certification): 13 requirements

---
*Requirements defined: 2026-02-03*
*Last updated: 2026-02-03 after roadmap creation (100% coverage achieved)*
