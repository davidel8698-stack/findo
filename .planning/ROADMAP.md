# Roadmap: Findo

## Milestones

- **v1.0 MVP** - Phases 1-11 (shipped 2026-01-30)
- **v1.1 Sales Website** - Phases 12-19 (in progress)

## Phases

<details>
<summary>v1.0 MVP (Phases 1-11) - SHIPPED 2026-01-30</summary>

### Phase 1: Foundation
**Goal**: Database, auth, multi-tenant architecture
**Plans**: 8 plans

### Phase 2: WhatsApp Integration
**Goal**: Meta Business API connection, webhook processing
**Plans**: 6 plans

### Phase 3: Lead Capture
**Goal**: Missed call detection, WhatsApp chatbot, lead storage
**Plans**: 6 plans

### Phase 4: Google Integration
**Goal**: OAuth, Business Profile API connection
**Plans**: 4 plans

### Phase 5: Review Management
**Goal**: Review polling, AI auto-reply, owner approval flow
**Plans**: 6 plans

### Phase 6: Review Requests
**Goal**: Invoice detection, automated review request flow
**Plans**: 7 plans

### Phase 7: GBP Content
**Goal**: Weekly photos, monthly posts, holiday hours automation
**Plans**: 8 plans

### Phase 8: GBP Optimization
**Goal**: Metrics monitoring, alerts, A/B testing, auto-tuning
**Plans**: 7 plans

### Phase 9: Dashboard & Notifications
**Goal**: Stats, activity feed, settings, WhatsApp-first notifications
**Plans**: 8 plans

### Phase 10: Setup & Billing
**Goal**: 2-minute wizard, progressive profiling, PayPlus integration
**Plans**: 6 plans

### Phase 11: Worker Registration
**Goal**: All workers registered, jobs active
**Plans**: 1 plan

**v1.0 Total: 11 phases, 67 plans, 56 requirements**

</details>

---

## v1.1 Sales Website

**Milestone Goal:** World-class Hebrew sales website achieving 50% conversion from qualified referral traffic through psychological journey optimization, visual excellence, and technical performance.

**Requirements:** 98 requirements across 13 psychological phases (A-M)
**Tech Stack:** Next.js 16, Tailwind 4.0, Motion + GSAP, shadcn/ui
**Certification Target:** 95+ (EXEMPLARY) on Design Bible test

---

### Phase 12: Technical Foundation ✓
**Goal**: Next.js 16 project with Hebrew RTL architecture, animation infrastructure, and performance foundation
**Depends on**: Phase 11 (v1.0 complete)
**Requirements**: PERF-07, PERF-08, MOBILE-01, A11Y-01 (partial)
**Success Criteria** (what must be TRUE):
  1. ✓ Next.js 16 project builds and deploys to Vercel successfully
  2. ✓ Hebrew RTL layout renders correctly with dir="rtl" and logical CSS properties
  3. ✓ Heebo font loads without FOUT (font-display: swap, preloaded)
  4. ✓ Motion and GSAP animation libraries configured with tree-shaking
  5. ✓ Tailwind 4.0 with logical properties (ms-, me-, ps-, pe-) works in all components
**Plans**: 5 plans
**Completed**: 2026-01-31
**Deployment**: https://website-nine-theta-12.vercel.app

Plans:
- [x] 12-01-PLAN.md - Next.js 16 project setup with App Router, TypeScript, Tailwind 4.0
- [x] 12-02-PLAN.md - Hebrew RTL foundation (dir, DirectionProvider, logical properties)
- [x] 12-03-PLAN.md - Font optimization and animation library setup
- [x] 12-04-PLAN.md - Project structure, content layer, utilities
- [x] 12-05-PLAN.md - Vercel deployment and Phase 12 verification

---

### Phase 13: Design System & Components ✓
**Goal**: Complete atomic component library with Hebrew typography, RTL-aware animations, and accessibility built-in
**Depends on**: Phase 12
**Requirements**: MOBILE-02, MOBILE-04, MOBILE-07, A11Y-01, A11Y-02, A11Y-03, TRUST-04 (partial)
**Success Criteria** (what must be TRUE):
  1. ✓ All atomic components (Button, Input, Badge, Card) render correctly in RTL
  2. ✓ Button touch targets are 48px minimum on mobile
  3. ✓ Typography scale readable without zoom (16px+ body, Hebrew-optimized)
  4. ✓ Animation variants (fadeInUp, staggerContainer, scaleIn) are GPU-accelerated
  5. ✓ Components pass WCAG 2.1 AA contrast requirements (4.5:1 for text)
  6. ✓ ScrollReveal component works with Intersection Observer + Motion
**Plans**: 6 plans
**Completed**: 2026-02-01

Plans:
- [x] 13-01-PLAN.md — shadcn/ui setup and atomic components (Button, Input, Badge, Card) with 48px touch targets
- [x] 13-02-PLAN.md — Dark mode theming (next-themes) and design tokens (typography, colors, spacing)
- [x] 13-03-PLAN.md — Animation system (Motion variants, ScrollReveal, FadeIn, StaggerContainer)
- [x] 13-04-PLAN.md — Custom atoms (Logo, Icon) and molecules (CTAGroup, StatItem, NavLink, FormField)
- [x] 13-05-PLAN.md — Component showcase and visual verification
- [x] 13-06-PLAN.md — UAT gap closure (button touch targets, dark mode, stagger animation)

---

### Phase 14: Hero & First Impression ✓
**Goal**: Above-fold experience that passes 5-second test with 100% accuracy - visitor knows what Findo is, what they can do, and who it's for
**Depends on**: Phase 13
**Requirements**: 5SEC-01, 5SEC-02, 5SEC-03, 5SEC-04, 5SEC-05, 5SEC-06, 5SEC-07, ACTION-01 (partial), ACTION-02
**Success Criteria** (what must be TRUE):
  1. ✓ Headline under 8 Hebrew words states core outcome (not features)
  2. ✓ Hero visual shows product in action (animated WhatsApp conversation or review reply)
  3. ✓ Primary CTA visible without scrolling with value-focused text
  4. ✓ Trust signal (customer count or key metric) visible above fold
  5. ✓ LCP under 2.5 seconds despite hero animation
  6. ✓ 3/3 testers correctly identify what Findo is, what they can do, and who it's for
**Plans**: 5 plans
**Completed**: 2026-02-01

Plans:
- [x] 14-01-PLAN.md — Hero section layout with RTL grid, phone mockup, and headline/CTA content
- [x] 14-02-PLAN.md — Activity feed animation with GSAP timeline (cards showing automated actions)
- [x] 14-03-PLAN.md — Trust signal, sticky mobile CTA, and homepage integration
- [x] 14-04-PLAN.md — LCP optimization and human verification checkpoint
- [x] 14-05-PLAN.md — UAT gap closure (activity feed animation fix, headline clarity)

---

### Phase 15: Social Proof & Trust ✓
**Goal**: Overwhelming evidence cascade that eliminates doubt - testimonials, metrics, case study, authority signals
**Depends on**: Phase 14
**Requirements**: PROOF-01, PROOF-02, PROOF-03, PROOF-04, PROOF-05, PROOF-06, PROOF-07, PROOF-08, TRUST-01, TRUST-02, TRUST-03, TRUST-05, TRUST-06, TRUST-07, TRUST-08
**Success Criteria** (what must be TRUE):
  1. ✓ Three testimonials with full attribution (real name, photo, business, specific metric)
  2. ✓ Video testimonial plays with Hebrew subtitles (autoplay muted)
  3. ✓ Real-time proof element shows recent activity or live counter
  4. ✓ Contact information prominent (WhatsApp, phone, email)
  5. ✓ Team section shows real photos and story
  6. ✓ Guarantee visible near every CTA and in footer
  7. ✓ No dark patterns (no fake urgency, no confirm shaming)
**Plans**: 6 plans
**Completed**: 2026-02-01

Plans:
- [x] 15-01-PLAN.md — Testimonial carousel with shadcn/ui Carousel, RTL support, full attribution cards
- [x] 15-02-PLAN.md — Video testimonial with autoplay and animated social proof counters
- [x] 15-03-PLAN.md — Floating activity widget, trust badges, and guarantee badge components
- [x] 15-04-PLAN.md — Team section (founder story) and contact section (WhatsApp, phone, email)
- [x] 15-05-PLAN.md — Homepage integration and human verification checkpoint
- [x] 15-06-PLAN.md — UAT gap closure (24/7 counter, trust badge icons, guarantee 30 days)

---

### Phase 16: Offer & Objection Handling ✓
**Goal**: Risk elimination so complete that saying no requires effort - pricing transparency, guarantees, FAQ
**Depends on**: Phase 15
**Requirements**: OFFER-01, OFFER-02, OFFER-03, OFFER-04, OFFER-05, OFFER-06, OFFER-07, OFFER-08, OBJ-01, OBJ-02, OBJ-03, OBJ-04, OBJ-05, OBJ-06, OBJ-07, OBJ-08
**Success Criteria** (what must be TRUE):
  1. ✓ Free trial messaging on every CTA with "no credit card required"
  2. ✓ Named money-back guarantee visible near every CTA
  3. ✓ 2-minute setup promise displayed with badge
  4. ✓ Zero risk summary block lists all risk eliminators
  5. ✓ Pricing transparent (350 NIS/month, setup fee, what's included)
  6. ✓ ROI calculator shows value is 10x+ the cost
  7. ✓ FAQ addresses top 5 objections in under 50 words each
  8. ✓ Comparison with alternatives makes decision obvious
**Plans**: 6 plans
**Completed**: 2026-02-01

Plans:
- [x] 16-01-PLAN.md — Install Radix primitives, create slider/accordion UI components
- [x] 16-02-PLAN.md — Three-guarantee badge system and zero risk summary block
- [x] 16-03-PLAN.md — ROI calculator with animated sliders and results
- [x] 16-04-PLAN.md — FAQ section with accordion and WhatsApp CTA
- [x] 16-05-PLAN.md — Pricing section with comparison table and homepage integration
- [x] 16-06-PLAN.md — Human verification checkpoint

---

### Phase 17: Conversion Flow & Forms ✓
**Goal**: Action path so simple that NOT taking it requires conscious resistance - minimal friction, smart forms, mobile-optimized CTAs
**Depends on**: Phase 16
**Requirements**: ACTION-01, ACTION-03, ACTION-04, ACTION-05, ACTION-06, ACTION-07, ACTION-08, MOBILE-03, MOBILE-08, EMOTION-08
**Success Criteria** (what must be TRUE):
  1. Primary CTA appears 4-6 times on homepage (above fold, after sections, sticky mobile)
  2. What happens next is crystal clear below every CTA
  3. Lead form has 2 fields maximum (phone + name)
  4. Israeli phone format auto-detected, validated inline with checkmark
  5. Mobile CTA in thumb zone with 48px height, sticky on scroll
  6. Social proof snippet near every CTA
  7. Achievement moment on signup with celebration animation
**Plans**: 4 plans
**Completed**: 2026-02-01

Plans:
- [x] 17-01-PLAN.md — Validation utilities and canvas-confetti installation
- [x] 17-02-PLAN.md — LeadCaptureForm, PhoneInput, FormSuccess, and server action
- [x] 17-03-PLAN.md — ConversionSection, StickyCtaBar update, homepage CTA integration
- [x] 17-04-PLAN.md — Human verification checkpoint

---

### Phase 18: Emotional Journey & Demo ✓
**Goal**: Emotional experience that makes visitors feel the problem and relief - video demo, interactive tour, micro-interactions
**Depends on**: Phase 17
**Requirements**: EMOTION-01, EMOTION-02, EMOTION-03, EMOTION-04, EMOTION-05, EMOTION-06, EMOTION-07, DEMO-01, DEMO-02, DEMO-03, DEMO-04, DEMO-05
**Success Criteria** (what must be TRUE):
  1. Pain point acknowledged emotionally ("You're losing customers right now")
  2. Relief promised emotionally ("Never worry about missed calls again")
  3. Autonomy emphasized ("You don't do anything - it works while you work")
  4. Video demo under 90 seconds shows complete flow (Hebrew with subtitles)
  5. Interactive demo option available (Storylane/Navattic embed)
  6. Demo loads fast (lazy-loaded, thumbnail before play, no LCP impact)
  7. Micro-interactions delight (hover effects, smooth scroll, pleasant animations)
  8. Copy speaks to THEM (conversational Hebrew, "you" focused)
**Plans**: 5 plans
**Completed**: 2026-02-02

Plans:
- [x] 18-01-PLAN.md — Emotional sections (PainPointSection, ReliefSection) with PAS messaging
- [x] 18-02-PLAN.md — Lottie demo component with lazy loading and poster fallback
- [x] 18-03-PLAN.md — Interactive demo (Storylane) with fullscreen modal
- [x] 18-04-PLAN.md — Micro-interactions (AnimatedButton, AnimatedCard, hover effects)
- [x] 18-05-PLAN.md — Human verification checkpoint

---

### Phase 19: Performance, SEO & Certification
**Goal**: Technical excellence achieving 95+ Lighthouse, complete SEO, analytics tracking, and Design Bible certification
**Depends on**: Phase 18
**Requirements**: PERF-01, PERF-02, PERF-03, PERF-04, PERF-05, PERF-06, MOBILE-05, MOBILE-06, SEO-01, SEO-02, SEO-03, SEO-04, ANALYTICS-01, ANALYTICS-02, ANALYTICS-03, ANALYTICS-04, ANALYTICS-05, ANALYTICS-06, CERT-01, CERT-02, CERT-03, CERT-04, CERT-05, CERT-06
**Success Criteria** (what must be TRUE):
  1. Lighthouse Performance 95+ on mobile
  2. LCP under 1.5 seconds, CLS exactly 0, INP under 100ms
  3. All animations 60fps with no jank on scroll
  4. Under 3 seconds load on 3G connection
  5. No horizontal scroll on any device
  6. Hebrew meta tags optimized, structured data complete
  7. PostHog tracking verified (page views, CTA clicks, form submissions, demo views)
  8. Real device testing passed (iPhone + Android)
  9. Native Hebrew speaker approved all copy
  10. Design Bible certification 95+ achieved
**Plans**: 6 plans

Plans:
- [ ] 19-01-PLAN.md — PostHog analytics setup with reverse proxy
- [ ] 19-02-PLAN.md — SEO foundation (meta, sitemap, robots, structured data)
- [ ] 19-03-PLAN.md — Conversion event tracking integration
- [ ] 19-04-PLAN.md — Animation performance optimization (60fps, CLS)
- [ ] 19-05-PLAN.md — Lighthouse audit and Core Web Vitals verification
- [ ] 19-06-PLAN.md — Design Bible certification and final sign-off

---

## Progress

**Execution Order:**
Phases execute in numeric order: 12 -> 13 -> 14 -> 15 -> 16 -> 17 -> 18 -> 19

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1-11 | v1.0 MVP | 67/67 | Complete | 2026-01-30 |
| 12. Technical Foundation | v1.1 | 5/5 | Complete | 2026-01-31 |
| 13. Design System | v1.1 | 6/6 | Complete | 2026-02-01 |
| 14. Hero & First Impression | v1.1 | 5/5 | Complete | 2026-02-01 |
| 15. Social Proof & Trust | v1.1 | 6/6 | Complete | 2026-02-01 |
| 16. Offer & Objection Handling | v1.1 | 6/6 | Complete | 2026-02-01 |
| 17. Conversion Flow & Forms | v1.1 | 4/4 | Complete | 2026-02-01 |
| 18. Emotional Journey & Demo | v1.1 | 5/5 | Complete | 2026-02-02 |
| 19. Performance, SEO & Certification | v1.1 | 0/6 | Planned | - |

**v1.1 Total: 8 phases, 43 plans, 98 requirements**

---

## Requirement Coverage

### Phase A: 5-Second Victory (7 requirements)
| Requirement | Phase | Status |
|-------------|-------|--------|
| 5SEC-01 | Phase 14 | Complete |
| 5SEC-02 | Phase 14 | Complete |
| 5SEC-03 | Phase 14 | Complete |
| 5SEC-04 | Phase 14 | Complete |
| 5SEC-05 | Phase 14 | Complete |
| 5SEC-06 | Phase 14 | Complete |
| 5SEC-07 | Phase 14 | Complete |

### Phase B: Proof Cascade (8 requirements)
| Requirement | Phase | Status |
|-------------|-------|--------|
| PROOF-01 | Phase 15 | Complete |
| PROOF-02 | Phase 15 | Complete |
| PROOF-03 | Phase 15 | Complete |
| PROOF-04 | Phase 15 | Complete |
| PROOF-05 | Phase 15 | Complete |
| PROOF-06 | Phase 15 | Complete |
| PROOF-07 | Phase 15 | Deferred |
| PROOF-08 | Phase 15 | Complete |

### Phase C: Irresistible Offer (8 requirements)
| Requirement | Phase | Status |
|-------------|-------|--------|
| OFFER-01 | Phase 16 | Complete |
| OFFER-02 | Phase 16 | Complete |
| OFFER-03 | Phase 16 | Complete |
| OFFER-04 | Phase 16 | Complete |
| OFFER-05 | Phase 16 | Complete |
| OFFER-06 | Phase 16 | Complete |
| OFFER-07 | Phase 16 | Complete |
| OFFER-08 | Phase 16 | Complete |

### Phase D: Effortless Action (8 requirements)
| Requirement | Phase | Status |
|-------------|-------|--------|
| ACTION-01 | Phase 14, 17 | Complete |
| ACTION-02 | Phase 14 | Complete |
| ACTION-03 | Phase 17 | Complete |
| ACTION-04 | Phase 17 | Complete |
| ACTION-05 | Phase 17 | Complete |
| ACTION-06 | Phase 17 | Complete |
| ACTION-07 | Phase 17 | Complete |
| ACTION-08 | Phase 17 | Complete |

### Phase E: Objection Obliterator (8 requirements)
| Requirement | Phase | Status |
|-------------|-------|--------|
| OBJ-01 | Phase 16 | Complete |
| OBJ-02 | Phase 16 | Complete |
| OBJ-03 | Phase 16 | Complete |
| OBJ-04 | Phase 16 | Complete |
| OBJ-05 | Phase 16 | Complete |
| OBJ-06 | Phase 16 | Complete |
| OBJ-07 | Phase 16 | Complete |
| OBJ-08 | Phase 16 | Complete |

### Phase F: Trust Architecture (8 requirements)
| Requirement | Phase | Status |
|-------------|-------|--------|
| TRUST-01 | Phase 15 | Complete |
| TRUST-02 | Phase 15 | Complete |
| TRUST-03 | Phase 15 | Complete |
| TRUST-04 | Phase 13 | Complete |
| TRUST-05 | Phase 15 | Complete |
| TRUST-06 | Phase 16 | Deferred |
| TRUST-07 | Phase 15 | Complete |
| TRUST-08 | Phase 15 | Complete |

### Phase G: Emotional Journey (8 requirements)
| Requirement | Phase | Status |
|-------------|-------|--------|
| EMOTION-01 | Phase 18 | Complete |
| EMOTION-02 | Phase 18 | Complete |
| EMOTION-03 | Phase 18 | Complete |
| EMOTION-04 | Phase 18 | Complete |
| EMOTION-05 | Phase 18 | Complete |
| EMOTION-06 | Phase 18 | Complete |
| EMOTION-07 | Phase 18 | Complete |
| EMOTION-08 | Phase 17 | Complete |

### Phase H: Live Demo (5 requirements)
| Requirement | Phase | Status |
|-------------|-------|--------|
| DEMO-01 | Phase 18 | Complete |
| DEMO-02 | Phase 18 | Complete |
| DEMO-03 | Phase 18 | Complete |
| DEMO-04 | Phase 18 | Complete |
| DEMO-05 | Phase 18 | Complete |

### Phase I: Technical Excellence (8 requirements)
| Requirement | Phase | Status |
|-------------|-------|--------|
| PERF-01 | Phase 19 | Pending |
| PERF-02 | Phase 19 | Pending |
| PERF-03 | Phase 19 | Pending |
| PERF-04 | Phase 19 | Pending |
| PERF-05 | Phase 19 | Pending |
| PERF-06 | Phase 19 | Pending |
| PERF-07 | Phase 12 | Complete |
| PERF-08 | Phase 12 | Complete |

### Phase J: Mobile Mastery (8 requirements)
| Requirement | Phase | Status |
|-------------|-------|--------|
| MOBILE-01 | Phase 12 | Complete |
| MOBILE-02 | Phase 13 | Complete |
| MOBILE-03 | Phase 17 | Complete |
| MOBILE-04 | Phase 13 | Complete |
| MOBILE-05 | Phase 19 | Pending |
| MOBILE-06 | Phase 19 | Pending |
| MOBILE-07 | Phase 13 | Complete |
| MOBILE-08 | Phase 17 | Complete |

### Phase K: SEO & Accessibility (7 requirements)
| Requirement | Phase | Status |
|-------------|-------|--------|
| SEO-01 | Phase 19 | Pending |
| SEO-02 | Phase 19 | Pending |
| SEO-03 | Phase 19 | Pending |
| SEO-04 | Phase 19 | Pending |
| A11Y-01 | Phase 12, 13 | Complete |
| A11Y-02 | Phase 13 | Complete |
| A11Y-03 | Phase 13 | Complete |

### Phase L: Analytics (6 requirements)
| Requirement | Phase | Status |
|-------------|-------|--------|
| ANALYTICS-01 | Phase 19 | Pending |
| ANALYTICS-02 | Phase 19 | Pending |
| ANALYTICS-03 | Phase 19 | Pending |
| ANALYTICS-04 | Phase 19 | Pending |
| ANALYTICS-05 | Phase 19 | Pending |
| ANALYTICS-06 | Phase 19 | Pending |

### Phase M: Certification Gates (6 requirements)
| Requirement | Phase | Status |
|-------------|-------|--------|
| CERT-01 | Phase 19 | Pending |
| CERT-02 | Phase 19 | Pending |
| CERT-03 | Phase 19 | Pending |
| CERT-04 | Phase 19 | Pending |
| CERT-05 | Phase 19 | Pending |
| CERT-06 | Phase 19 | Pending |

**Coverage: 98/98 requirements mapped**

---

*Roadmap created: 2026-01-31*
*Milestone: v1.1 Sales Website*
*Conversion target: 50% from qualified referral traffic*
