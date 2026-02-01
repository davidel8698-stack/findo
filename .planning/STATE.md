# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-30)

**Core value:** Business owner does nothing after 2-minute setup. Findo operates autonomously 24/7.
**Current focus:** v1.1 Sales Website - 50% conversion from qualified referral traffic

## Current Position

Phase: 15 - Social Proof & Trust
Plan: 06 of 6 complete (gap closure)
Status: COMPLETE ✓ (UAT gaps closed, ready for re-test)
Last activity: 2026-02-01 - Completed 15-06 gap closure plan

Progress: [======================>...] 22/38 plans (v1.1)

## Milestone Summary

**v1.0 MVP shipped 2026-01-30**

- 11 phases, 67 plans, 56 requirements
- 29,580 lines of TypeScript
- 4 days from start to ship

Archives:
- `.planning/milestones/v1.0-ROADMAP.md`
- `.planning/milestones/v1.0-REQUIREMENTS.md`
- `.planning/milestones/v1.0-MILESTONE-AUDIT.md`

**v1.1 Sales Website (in progress)**

- 8 phases (12-19), ~37 plans, 98 requirements
- Target: 50% conversion from qualified referral traffic
- Certification: 95+ (EXEMPLARY) on Design Bible test
- Tech: Next.js 16, Tailwind 4.0, Motion + GSAP, shadcn/ui

## v1.1 Phase Overview

| Phase | Name | Requirements | Status |
|-------|------|--------------|--------|
| 12 | Technical Foundation | PERF-07, PERF-08, MOBILE-01, A11Y-01 | COMPLETE |
| 13 | Design System | MOBILE-02, MOBILE-04, MOBILE-07, A11Y-* | VERIFIED ✓ |
| 14 | Hero & First Impression | 5SEC-01 to 5SEC-07, ACTION-01/02 | COMPLETE ✓ |
| 15 | Social Proof & Trust | PROOF-*, TRUST-* | VERIFIED ✓ |
| 16 | Offer & Objection | OFFER-*, OBJ-* | Not started |
| 17 | Conversion Flow | ACTION-*, MOBILE-03/08, EMOTION-08 | Not started |
| 18 | Emotional Journey & Demo | EMOTION-*, DEMO-* | Not started |
| 19 | Performance & Certification | PERF-*, SEO-*, ANALYTICS-*, CERT-* | Not started |

## Performance Metrics

**v1.0 Velocity:**
- Total plans completed: 67
- Average duration: 5.3 min
- Total execution time: ~6 hours

**v1.1 Velocity:**
- Total plans completed: 21
- Average duration: 7.8 min
- Estimated plans: ~38

## Accumulated Context

### Decisions

All v1 decisions logged in PROJECT.md Key Decisions table with outcomes marked.

**v1.1 Architecture Decisions:**
- Next.js 16 (upgraded from planned 15.5) - sales website has no API routes
- Tailwind 4.0 with CSS-first @theme configuration
- Motion + GSAP two-library animation strategy
- Heebo font with preload optimization
- PostHog for analytics (session replay, funnels, A/B testing)
- Vercel for deployment (CDN, preview URLs)

**12-01 Decisions:**
- Used Next.js 16.1.6 instead of 15.5 - create-next-app defaults to latest, and sales website has no API routes so API stability concern doesn't apply
- Used app/ structure instead of src/app/ - create-next-app v16 default
- Tailwind 4.0 CSS-first with @theme blocks, no tailwind.config.ts

**12-02 Decisions:**
- Created Providers client component wrapper for DirectionProvider (server components cannot use React context)
- Established logical properties pattern (ps-/pe-/ms-/me- instead of pl-/pr-/ml-/mr-) for RTL support

**12-03 Decisions:**
- Upgraded @radix-ui/react-direction to 1.1.2-rc for React 19 compatibility (createContext fix)
- Centralized GSAP config in lib/gsapConfig.ts - all imports must go through this file
- Provider nesting order: DirectionProvider > MotionProvider > SmoothScroll (RTL outermost)

**12-04 Decisions:**
- Used website/* paths (not website/src/*) - aligns with 12-01 project structure
- cn() utility with clsx + tailwind-merge for class merging
- Israeli formatting utilities (formatPhone, formatPrice, formatDateHebrew)

**12-05 Decisions:**
- Frankfurt (fra1) Vercel region - closest edge to Israeli users
- Security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection) on all routes

**13-01 Decisions:**
- Button default height h-12 (48px) for WCAG mobile touch target compliance (MOBILE-02)
- Loading state uses shimmer animation not spinner per CONTEXT.md
- Badge/Card use logical properties (ps-/pe-) for RTL support
- Input uses text-start instead of text-left for RTL alignment

**13-02 Decisions:**
- Orange primary color (#f97316) for conversion-optimized CTAs - proven high conversion, high contrast
- HSL color format for shadcn/ui compatibility
- Provider order updated: DirectionProvider > ThemeProvider > MotionProvider > SmoothScroll
- Typography scale: 16px base minimum for WCAG accessibility
- @custom-variant dark for Tailwind 4 dark mode support

**13-03 Decisions:**
- Spring physics: stiffness 200, damping 15 for bouncy feel per CONTEXT.md playful character
- UseInViewOptions margin type required for Motion v12 TypeScript compatibility
- Default margin -100px triggers animation before element fully visible

**13-04 Decisions:**
- NavLink uses title prop to match existing NavItem type (not label as in plan)
- Icon component uses aria-hidden for decorative icons
- FormField uses React useId() for accessible label-input association

**13-05 Decisions:**
- Unified barrel export enables `import { Button, Logo, ScrollReveal } from "@/components"`
- Showcase page organized by component category with ScrollReveal animations

**13-06 Decisions (UAT Gap Closure):**
- All button sizes use h-12 minimum for 48px WCAG touch targets
- ThemeProvider removes enableSystem to prevent light mode override
- StatItem wrapped in m.div with fadeInUp for stagger container compatibility

**14-01 Decisions (Hero Layout):**
- Hebrew headline "Your business works. You don't have to." (problem-focused, under 8 words)
- RTL grid ordering: content order-2/lg:order-1, visual order-1/lg:order-2
- 100dvh for mobile-safe full viewport height
- ArrowLeft icon for RTL CTA (flips automatically via rtlFlip prop)

**14-02 Decisions (Activity Feed):**
- Activity type union for strict type mapping (review | post | lead | call)
- back.out(1.7) easing for bouncy personality matching CONTEXT.md
- Cards start with opacity-0, GSAP animates from that state
- GSAP class targeting: Use semantic class names (activity-card) for selectors

**14-03 Decisions (Hero Integration):**
- TrustSignal uses specific numbers (573) not rounded (500+) per research
- StickyCtaBar shows after 400px scroll when hero CTA out of view
- iOS safe area: pb-[env(safe-area-inset-bottom,1rem)]
- Homepage replaces Phase 13 component showcase with Hero

**14-04 Decisions (LCP Optimization):**
- Animation cards start opacity-0 via CSS class, GSAP animates from that state
- will-change-transform added for GPU acceleration, removed onComplete
- No hero images - pure CSS phone mockup is LCP performance win
- LCP element is h1 headline text, server-rendered in HeroContent

**14-05 Decisions (UAT Gap Closure):**
- GSAP fromTo() required when element has CSS opacity-0 class (from() animates TO current CSS state)
- Outcome-focused headline "More customers. Less work." - 4 words, states benefit directly
- Subheadline explains 24/7 automation with specific actions (reviews, content, leads)

**15-02 Decisions (Video & Counters):**
- Video uses burned-in subtitles per CONTEXT.md - no subtitle track in code
- Spring physics stiffness:100 damping:30 for smooth counting (not bouncy)
- Counter animation triggers once only (once: true) to avoid restart on scroll
- Viewport detection: amount: 0.5 for video (50% visible), margin: -100px for counters

**15-03 Decisions (Social Proof Components):**
- FloatingActivityWidget timing: 5s initial delay, 5s show / 3s hide cycle
- Activity types: signup, review, lead (covers main platform value props)
- RTL positioning: start-4 instead of left-4 for automatic RTL flip
- SSL badge uses Shield icon fallback (always available, no missing image)
- GuaranteeBadge variants: inline (near CTAs) and full (dedicated sections)
- localStorage persistence key: "findo-activity-widget-dismissed"

**15-04 Decisions (Team & Contact):**
- Founder story as quote-style blockquote with large quotation mark decoration
- WhatsApp highlighted as primary contact method (green accent, "preferred" badge)
- Contact values use dir="ltr" for proper phone/email display in RTL context
- Business hours note added below contact cards for transparency

### Pending Todos

None.

### Blockers/Concerns

**Production Readiness (v1.0):**
- RLS enforcement requires findo_app database user creation (documented in docs/rls-setup.md)
- Human UAT required before production deployment

**External Dependencies:**
- Meta Business Verification: Required for WhatsApp Business API
- Google API Access: OAuth consent screen approved
- PayPlus: Sandbox tested, production credentials needed

**v1.1 Dependencies:**
- Real customer testimonials needed (photos, names, metrics)
- Video testimonial production required
- Interactive demo platform decision (Storylane vs Navattic)
- Native Hebrew copywriter for final copy review

**Research Flags:**
- Phase 14: GSAP ScrollTrigger + Lenis integration with Next.js 16 App Router - RESOLVED in 12-03
- Phase 18: Interactive demo platform comparison and embed performance

## Session Continuity

Last session: 2026-02-01
Stopped at: Completed 15-06-PLAN.md (UAT gap closure)
Resume file: None

**Next step:** UAT re-test Phase 15, then begin Phase 16: Offer & Objection Handling

**15-06 Gap Closure (UAT):**
- Added 24/7 availability metric to SocialProofCounters (StaticMetric component)
- Converted all TrustBadges to Lucide icons (no external images)
- Added "30 יום" to GuaranteeBadge inline variant
- Build passes, 3/3 UAT gaps should now be closed

**15-01 Re-execution:**
- carousel.tsx created (shadcn/ui pattern with Embla)
- TestimonialCard.tsx created with Testimonial type export
- TestimonialsCarousel.tsx created with 3 placeholder testimonials
- npm used for installation due to pnpm/OneDrive sync issues
- TrustBadges type error fixed (Badge interface added)

**Phase 12 Deployment:**
- Production URL: https://website-nine-theta-12.vercel.app
- Human verification: APPROVED

**Phase 13 Verification:**
- 6/6 success criteria verified
- 3 UAT gaps closed (button 48px, dark mode, stagger)
- All requirements satisfied (MOBILE-02, MOBILE-04, MOBILE-07, A11Y-01/02/03, TRUST-04)

**Phase 14 Verification:**
- 6/6 success criteria verified
- 21/21 must-haves verified
- 8/8 requirements satisfied (5SEC-01 through 5SEC-07, ACTION-02)
- Human verification: APPROVED (5-second test, LCP, visual, mobile)

**Phase 14 UAT Gap Closure (14-05):**
- Fixed GSAP animation: fromTo() for explicit opacity 0->1 transition
- Fixed headline: outcome-focused "More customers. Less work."
- UAT tests 1, 2, 3, 8, 10, 12 should now pass on re-test

**Phase 15 Progress (15-02):**
- Created VideoTestimonial with viewport autoplay using Motion useInView
- Click-to-unmute toggle with VolumeX/Volume2 icons
- Created SocialProofCounters with spring animation (useSpring + useTransform)
- Hebrew locale formatting (he-IL) for number display
- Build verification blocked by OneDrive node_modules sync issue

**Phase 15 Progress (15-03):**
- Created FloatingActivityWidget with 10 activities, RTL positioning
- Created TrustBadges with 4 authority badges, hover effects
- Created GuaranteeBadge with inline/full variants
- Build verification blocked by OneDrive node_modules sync issue

**Phase 15 Progress (15-04):**
- Created TeamSection with founder photo, name, role, and personal story
- Story explains pain point from personal experience (why Findo exists)
- Created ContactSection with WhatsApp, phone, and email cards
- WhatsApp highlighted as primary (green accent, badge)
- All contact methods use proper protocols (wa.me, tel:, mailto:)
- Build verification blocked by OneDrive node_modules sync issue

**15-01 Decisions:**
- shadcn/ui Carousel pattern with Embla (native RTL support)
- npm used for package installation (pnpm EPERM with OneDrive)
- Motion hover effect on TestimonialCard for playful character

**15-05 Decisions:**
- Direct imports instead of barrel exports for SSR compatibility
- Section order follows psychological journey: metrics > testimonials > video > trust > team > contact
- GuaranteeBadge at 3 positions: below hero, after testimonials, footer

**Phase 15 Verification:**
- 21/21 must-haves verified (100%)
- 7/7 success criteria satisfied
- 12/15 requirements complete (PROOF-07, TRUST-06 deferred)
- Human verification: APPROVED
- Testimonials, video, counters, floating widget, trust badges, team, contact all working
- Mobile responsive verified

**15-06 Decisions (UAT Gap Closure):**
- StaticMetric component for non-numeric values like 24/7
- Discriminated union type for mixed metric rendering (animated vs static)
- Icons as primary display for all trust badges (not fallback)
- Consistent 30-day messaging across inline and full guarantee variants

---
*Updated: 2026-02-01 after 15-06 gap closure complete — UAT re-test recommended*
