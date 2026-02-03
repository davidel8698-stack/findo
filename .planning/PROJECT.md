# Findo

## What This Is

Findo is a Hebrew SaaS platform for small and medium-sized businesses in Israel that runs completely autonomously after a 2-minute setup. It solves three critical problems SMBs face daily: lost leads from unanswered phone calls, lack of positive Google reviews due to no automated request mechanism, and poor management of their Google Business Profile. The business owner does nothing beyond initial installation — Findo works 24/7 in the background.

The platform now includes a world-class Hebrew sales website optimized for high-conversion referral traffic with Lighthouse 95+ performance, complete analytics infrastructure, and psychological journey-based design.

## Core Value

The business owner does nothing. Findo operates completely autonomously after a 2-minute setup, capturing leads, growing reviews, and managing their digital presence without any ongoing effort.

## Current State

**Version:** v1.1 Sales Website (shipped 2026-02-03)
**Status:** Production ready

**Codebase:**
- Backend: 29,580 lines of TypeScript (v1.0 MVP)
- Website: 17,507 lines of TypeScript (v1.1 Sales Website)
- 19 phases, 110 plans executed
- 20 workers registered, 15 scheduled jobs active

**Tech Stack:**
- Backend: Hono, Drizzle ORM + PostgreSQL, BullMQ + Redis, Claude Haiku 4.5, PayPlus
- Website: Next.js 16, Tailwind 4.0, Motion + GSAP, shadcn/ui, PostHog, Vercel
- Integrations: Meta Graph API (WhatsApp), Google Business Profile API

## Requirements

### Validated

**v1.0 MVP (shipped 2026-01-30):**
- ✓ LEAD-01 to LEAD-07 — v1.0 (Missed call → WhatsApp chatbot → lead capture → owner notification)
- ✓ REVW-01 to REVW-07 — v1.0 (Invoice detection → 24h delay → review request → 3-day reminder)
- ✓ GBPR-01 to GBPR-06 — v1.0 (Review polling → AI auto-reply for positive → owner approval for negative)
- ✓ GBPC-01 to GBPC-05 — v1.0 (Weekly photos, monthly posts, holiday hours)
- ✓ GBPO-01 to GBPO-07 — v1.0 (Metrics monitoring, alerts, A/B testing, auto-tuning)
- ✓ SETUP-01 to SETUP-06 — v1.0 (2-minute wizard, progressive profiling)
- ✓ DASH-01 to DASH-08 — v1.0 (Stats, activity feed, settings, actions)
- ✓ NOTF-01 to NOTF-05 — v1.0 (WhatsApp-first notifications)
- ✓ INTG-01 to INTG-07 — v1.0 (WhatsApp, Google, Voicenter, Greeninvoice, iCount)
- ✓ INFR-01 to INFR-06 — v1.0 (Multi-tenant, RLS, encryption, queues, jobs, activity feed)
- ✓ BILL-01 to BILL-03 — v1.0 (Setup fee, subscription, PayPlus)

**v1.1 Sales Website (shipped 2026-02-03):**
- ✓ 5SEC-01 to 5SEC-07 — v1.1 (5-second test: headline, subheadline, visual, CTA, trust signal, RTL)
- ✓ PROOF-01 to PROOF-06, PROOF-08 — v1.1 (Testimonials, video, counters, authority signals)
- ✓ OFFER-01 to OFFER-08 — v1.1 (Free trial, guarantee, 2-min setup, ROI calculator, pricing, FAQ)
- ✓ ACTION-01 to ACTION-08 — v1.1 (CTAs, value-focused text, minimal form, Israeli phone validation)
- ✓ OBJ-01 to OBJ-08 — v1.1 (Objection handling via proof, transparency, guarantee, differentiation)
- ✓ TRUST-01 to TRUST-05, TRUST-07, TRUST-08 — v1.1 (Contact info, team, security, social validation, no dark patterns)
- ✓ EMOTION-01 to EMOTION-08 — v1.1 (Pain acknowledgment, relief, autonomy, success visualization, micro-interactions)
- ✓ DEMO-01 to DEMO-05 — v1.1 (Video demo, interactive Storylane, fast loading, mobile-friendly)
- ✓ PERF-01 to PERF-08 — v1.1 (Lighthouse 95+, LCP < 1.5s, CLS = 0, 60fps animations)
- ✓ MOBILE-01 to MOBILE-08 — v1.1 (Mobile-first, 48px touch targets, thumb-zone CTA, no horizontal scroll)
- ✓ SEO-01 to SEO-04 — v1.1 (Hebrew meta tags, structured data, sitemap, Open Graph)
- ✓ A11Y-01 to A11Y-03 — v1.1 (Semantic HTML, screen reader, color contrast)
- ✓ ANALYTICS-01 to ANALYTICS-06 — v1.1 (PostHog, conversion tracking, heatmaps, A/B testing)
- ✓ CERT-01 to CERT-06 — v1.1 (Certification 69%, 5-second test, device testing, Hebrew review)

### Active

(None — milestone complete, next requirements defined via `/gsd:new-milestone`)

### Out of Scope

- English/Arabic language support — Hebrew only, simplifies AI layer and UI
- Agency/consultant multi-business management — individual business owners only for v1
- Rivhit integration — poor API quality, not worth the effort
- Mobile app — web-first, mobile responsive is sufficient
- Real-time chat with customers — Findo collects info and hands off, doesn't replace the business
- Offline mode — real-time is core value
- PROOF-07 (Case study preview) — Deferred to post-launch when real customer data available
- TRUST-06 (Legal compliance pages) — Deferred, privacy policy and terms of service needed before public launch

## Context

**Target Market:**
- Small and medium-sized businesses in Israel
- Price-sensitive (can't afford high monthly fees)
- Don't have time or knowledge to manage their digital presence
- Often miss calls because they're busy working

**Technical Environment:**
- Backend: 29,580 LOC TypeScript (Hono, Drizzle, BullMQ)
- Website: 17,507 LOC TypeScript (Next.js 16, Tailwind 4.0, Motion + GSAP)
- Building with Claude (AI-assisted development)
- Hebrew language throughout (UI, messages, AI-generated content)

**Integration Partners:**
- Meta (WhatsApp Business API) — requires Tech Provider registration and Business Verification
- Google (Business Profile API) — OAuth consent verified
- Voicenter — Israeli VoIP provider, webhooks for call events
- Greeninvoice — best Israeli accounting API, polling for invoices
- iCount — secondary accounting integration, polling for invoices
- PayPlus — Israeli payment processor, recurring billing

**Deployment:**
- Backend: Pending production deployment
- Website: https://website-nine-theta-12.vercel.app (Vercel Frankfurt edge)

## Constraints

- **Language**: Hebrew only — all UI, messages, and AI-generated content in Hebrew
- **Cost**: Must be cheap to maintain — target customers are price-sensitive SMBs
- **Quality**: High quality, stable, durable — this is the differentiation
- **Autonomy**: System must work without user intervention after setup
- **Setup time**: Must complete in 2 minutes or less

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Hebrew only for v1 | Focus on Israeli market, simplify AI layer | ✓ Good |
| Individual business owners only (no agencies) | Simpler multi-tenant model, clearer UX | ✓ Good |
| Voicenter for telephony | Israeli provider, webhook support for unanswered calls | ✓ Good |
| Greeninvoice as primary accounting | Best API quality in Israel | ✓ Good |
| Meta Embedded Signup for WhatsApp | One-click connection, create WhatsApp Business in same flow | ✓ Good |
| Notification-driven UX over dashboard-driven | Reinforces "you don't need to do anything" core value | ✓ Good |
| Progressive profiling over long setup | Keeps 2-minute setup promise | ✓ Good |
| Claude Haiku 4.5 for AI | Cost-effective, good Hebrew support | ✓ Good |
| Queue-first webhook architecture | Fast response, reliable async processing | ✓ Good |
| Row-Level Security for tenant isolation | Database-level security, prevents bugs | ✓ Good |
| Polling for reviews and invoices | No webhooks available from providers | — Necessary |
| PayPlus for payments | Israeli processor, recurring billing support | ✓ Good |
| Next.js 16 for sales website | App Router, RSC, no API routes needed | ✓ Good |
| Tailwind 4.0 CSS-first | @theme blocks, native CSS variables | ✓ Good |
| Motion + GSAP two-library strategy | Motion for React, GSAP for complex timelines | ✓ Good |
| PostHog with reverse proxy | Bypasses ad blockers, prevents 30-40% session loss | ✓ Good |
| 69% certification for MVP | Solid technical foundation, iterate on content post-launch | ✓ Good |

---
*Last updated: 2026-02-03 after v1.1 milestone*
