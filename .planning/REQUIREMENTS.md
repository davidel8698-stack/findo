# Requirements: Findo v2.0 Visual Excellence

**Defined:** 2026-02-03
**Core Value:** Transform website from "functional MVP" to world-class visual excellence rivaling Linear, Stripe, and Vercel. First reaction: "WOW" not "nice".

## v2.0 Requirements

Requirements for visual excellence milestone. Each maps to roadmap phases.

### Gradients & Glows

- [ ] **GRAD-01**: Hero headline uses gradient text (orange-500 → amber-500)
- [ ] **GRAD-02**: CTA buttons have glow effect on hover (orange-500/20 blur)
- [ ] **GRAD-03**: Primary CTA has subtle pulse animation (glow intensity cycles)
- [ ] **GRAD-04**: Section headlines use gradient text where impactful
- [ ] **GRAD-05**: Multi-layer shadows on elevated elements (4-layer shadow system)
- [ ] **GRAD-06**: Rim lighting effect on dark mode elements for depth

### Background Depth

- [ ] **BG-01**: Subtle grid pattern overlay (5% opacity, covers full viewport)
- [ ] **BG-02**: Gradient orbs/blobs as ambient background elements (blurred, orange/20)
- [ ] **BG-03**: Noise texture overlay for premium feel (inline SVG, subtle)
- [ ] **BG-04**: Background layers work at all breakpoints (mobile, tablet, desktop)
- [ ] **BG-05**: Background transitions smoothly between sections (not jarring)
- [ ] **BG-06**: Orbs have subtle parallax movement on scroll

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

- [ ] **RTL-01**: Gradient directions work correctly in RTL (start/end not left/right)
- [ ] **RTL-02**: Parallax/slide animations work right-to-left
- [ ] **RTL-03**: Carousel arrows swap sides for RTL
- [ ] **RTL-04**: Phone mockup positioned correctly for RTL (left side of text)
- [ ] **RTL-05**: All animation directions respect document direction
- [ ] **RTL-06**: Link underlines animate from right in RTL

### Hebrew Typography

- [ ] **TYPO-01**: Hebrew body text has line-height 1.8 (readability)
- [ ] **TYPO-02**: Hebrew headlines have tighter letter-spacing
- [ ] **TYPO-03**: Secondary text uses muted color (zinc-400)
- [ ] **TYPO-04**: Typography scale creates clear hierarchy (size AND color)
- [ ] **TYPO-05**: Bold weights (700-800) for headline impact
- [ ] **TYPO-06**: Gradient text renders correctly with Hebrew characters

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
| GRAD-01 to GRAD-06 | TBD | Pending |
| BG-01 to BG-06 | TBD | Pending |
| GLASS-01 to GLASS-06 | TBD | Pending |
| ANIM-01 to ANIM-13 | TBD | Pending |
| MICRO-01 to MICRO-08 | TBD | Pending |
| MOCK-01 to MOCK-07 | TBD | Pending |
| RTL-01 to RTL-06 | TBD | Pending |
| TYPO-01 to TYPO-06 | TBD | Pending |
| PERF-01 to PERF-08 | TBD | Pending |
| SECT-01 to SECT-10 | TBD | Pending |
| CERT-01 to CERT-05 | TBD | Pending |

**Coverage:**
- v2.0 requirements: 75 total
- Mapped to phases: 0 (roadmap pending)
- Unmapped: 75 ⚠️

---
*Requirements defined: 2026-02-03*
*Last updated: 2026-02-03 after initial definition*
