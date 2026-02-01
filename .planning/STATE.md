# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-30)

**Core value:** Business owner does nothing after 2-minute setup. Findo operates autonomously 24/7.
**Current focus:** v1.1 Sales Website - 50% conversion from qualified referral traffic

## Current Position

Phase: 14 - Hero & First Impression
Plan: 02 of 6 complete
Status: In progress
Last activity: 2026-02-01 - Completed 14-02-PLAN.md (Activity Feed)

Progress: [============>............] 13/38 plans (v1.1)

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
| 14 | Hero & First Impression | 5SEC-01 to 5SEC-07, ACTION-01/02 | In progress (2/6) |
| 15 | Social Proof & Trust | PROOF-*, TRUST-* | Not started |
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
- Total plans completed: 13
- Average duration: 7.2 min
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
Stopped at: Completed 14-02-PLAN.md (Activity Feed)
Resume file: None

**Next step:** Continue Phase 14: Plans 03-06

**Phase 12 Deployment:**
- Production URL: https://website-nine-theta-12.vercel.app
- Human verification: APPROVED

**Phase 13 Verification:**
- 6/6 success criteria verified
- 3 UAT gaps closed (button 48px, dark mode, stagger)
- All requirements satisfied (MOBILE-02, MOBILE-04, MOBILE-07, A11Y-01/02/03, TRUST-04)

**Phase 14 Progress:**
- 14-01 complete: Hero section layout with RTL-native grid, HeroContent, PhoneMockup
- 14-02 complete: ActivityCard and ActivityFeed with GSAP animation

---
*Updated: 2026-02-01 after 14-02-PLAN.md completion - Activity Feed components*
