# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-30)

**Core value:** Business owner does nothing after 2-minute setup. Findo operates autonomously 24/7.
**Current focus:** v1.1 Sales Website - 50% conversion from qualified referral traffic

## Current Position

Phase: 13 - Design System
Plan: 02 of 5 complete
Status: In progress
Last activity: 2026-02-01 - Completed 13-02-PLAN.md (Dark Mode & Color Tokens)

Progress: [=======>..............] 7/37 plans (v1.1)

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
| 13 | Design System | MOBILE-02, MOBILE-04, MOBILE-07, A11Y-* | Plans 01-02 complete |
| 14 | Hero & First Impression | 5SEC-01 to 5SEC-07, ACTION-01/02 | Not started |
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
- Total plans completed: 7
- Average duration: 8.2 min
- Estimated plans: ~37

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
Stopped at: Completed 13-02-PLAN.md (Dark Mode & Color Tokens)
Resume file: None

**Next step:** Execute 13-03-PLAN.md (Animation Variants)

**Phase 12 Deployment:**
- Production URL: https://website-nine-theta-12.vercel.app
- Human verification: APPROVED

---
*Updated: 2026-02-01 after 13-02-PLAN.md completion*
