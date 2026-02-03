# Findo

## What This Is

Findo is a Hebrew SaaS platform for small and medium-sized businesses in Israel that runs completely autonomously after a 2-minute setup. It solves three critical problems SMBs face daily: lost leads from unanswered phone calls, lack of positive Google reviews due to no automated request mechanism, and poor management of their Google Business Profile. The business owner does nothing beyond initial installation — Findo works 24/7 in the background.

## Core Value

The business owner does nothing. Findo operates completely autonomously after a 2-minute setup, capturing leads, growing reviews, and managing their digital presence without any ongoing effort.

## Current State

**Version:** v1.0 MVP (shipped 2026-01-30)
**Status:** Ready for production deployment pending human UAT

**Codebase:**
- 29,580 lines of TypeScript
- 11 phases, 67 plans executed
- 20 workers registered
- 15 scheduled jobs active

**Tech Stack:**
- Hono (web framework)
- Drizzle ORM + PostgreSQL
- BullMQ + Redis (queues)
- Claude Haiku 4.5 (AI)
- PayPlus (payments)
- Meta Graph API (WhatsApp)
- Google Business Profile API

## Requirements

### Validated

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

### Active

**v1.1 Sales Website** — World-class, high-conversion marketing site

- [ ] Homepage with "wow" visual design, live demo, and social proof
- [ ] Pricing page with clear value communication
- [ ] Feature presentation with benefits hierarchy
- [ ] Trust-building elements (testimonials, metrics, guarantees)
- [ ] Mobile-first, Hebrew RTL throughout
- [ ] Primary CTA: Start free trial

### Out of Scope

- English/Arabic language support — Hebrew only, simplifies AI layer and UI
- Agency/consultant multi-business management — individual business owners only for v1
- Rivhit integration — poor API quality, not worth the effort
- Mobile app — web-first, mobile responsive is sufficient
- Real-time chat with customers — Findo collects info and hands off, doesn't replace the business
- Offline mode — real-time is core value

## Context

**Target Market:**
- Small and medium-sized businesses in Israel
- Price-sensitive (can't afford high monthly fees)
- Don't have time or knowledge to manage their digital presence
- Often miss calls because they're busy working

**Technical Environment:**
- Shipped v1.0 with 29,580 LOC TypeScript
- Building with Claude (AI-assisted development)
- Hebrew language throughout (UI, messages, AI-generated content)

**Integration Partners:**
- Meta (WhatsApp Business API) — requires Tech Provider registration and Business Verification
- Google (Business Profile API) — OAuth consent verified
- Voicenter — Israeli VoIP provider, webhooks for call events
- Greeninvoice — best Israeli accounting API, polling for invoices
- iCount — secondary accounting integration, polling for invoices
- PayPlus — Israeli payment processor, recurring billing

**User Feedback:** (pending production deployment)

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

---
*Last updated: 2026-01-30 after v1.0 milestone*
