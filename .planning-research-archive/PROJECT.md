# Findo

## What This Is

Findo is a Hebrew-language SaaS platform for Israeli small and medium businesses (1-5 employees) that runs as an autonomous "autopilot" to capture lost leads, generate Google reviews, and optimize Google Business Profile presence. After a 2-minute setup, business owners do nothing — Findo works in the background to bring them more customers.

## Core Value

Business owners install once and forget — Findo automatically recovers missed calls, requests reviews after service, and continuously optimizes their Google presence without requiring ongoing attention.

## Requirements

### Validated

(None yet — ship to validate)

### Active

**Missed Call Recovery**
- [ ] Detect unanswered calls via Voicenter webhook (not answered within 20 seconds)
- [ ] Wait 2 minutes grace period (in case owner calls back)
- [ ] Send automatic WhatsApp follow-up: "We saw you called! Can we help?"
- [ ] Save lead and notify business owner

**Automatic Review Requests**
- [ ] Trigger via invoice system integration (Green Invoice, Hashavshevet, iCount, Rivhit)
- [ ] Manual trigger fallback (owner taps "request review" after job)
- [ ] Wait 24 hours after service
- [ ] Send WhatsApp with direct Google review link
- [ ] Track click/review status
- [ ] Send reminder after 3 days if no review

**Google Business Profile Management (Inspy Loop)**
- [ ] Real-time: Auto-respond to positive reviews (4-5 stars), alert on negative (1-3 stars) with suggested response
- [ ] Daily: Check review velocity, extract performance data, detect significant drops (>20%), flag unanswered reviews
- [ ] Weekly: Trend analysis, post scheduling prompts, photo freshness checks, weekly report to owner
- [ ] Monthly: Full profile audit, comprehensive report with health score

**Onboarding Flow**
- [ ] Business details collection
- [ ] WhatsApp Business connection via Meta OAuth (Embedded Signup)
- [ ] Google Business Profile connection via OAuth 2.0
- [ ] Phone setup via Voicenter (new number / port existing / connect mobile)
- [ ] Invoice system connection (OAuth/API key) or manual trigger selection

**Multi-tenant SaaS Foundation**
- [ ] Secure tenant isolation
- [ ] Encrypted token storage (WhatsApp, Google, Voicenter)
- [ ] Hebrew RTL interface throughout
- [ ] Webhook infrastructure for real-time events

### Out of Scope

- Smart invoice scanning (OCR on WhatsApp/email) — deferred, too complex for v1
- English or other language support — Hebrew only for Israeli market
- Mobile app — web-first approach
- Advanced analytics dashboard — basic reports sufficient for v1
- Multiple business locations per account — single location per tenant initially

## Context

**Target Market:**
- Israeli local service businesses with 1-5 employees
- Owner is hands-on (plumber under sink, hairdresser cutting hair) — can't answer phone
- Best fit: home services (plumbers, electricians, AC, locksmiths, cleaners), health/beauty (salons, barbershops, dental, physio), automotive (garages, detailing), small professional services
- First 100 customers likely hairdressers and home service providers — easy to reach, feel pain acutely, strong word of mouth

**The Pain:**
- Missed calls = lost money (customer goes to competitor)
- Reviews matter but owners forget to ask
- Google Business Profile neglected despite being primary discovery channel

**Key Integrations:**
- Voicenter (Israeli telephony) — number allocation, call webhooks, routing
- Meta/WhatsApp Business API — Embedded Signup for quick connection
- Google Business Profile API — OAuth with business.manage permission
- Israeli invoicing systems — Green Invoice, Hashavshevet, iCount, Rivhit

## Constraints

- **Language**: Hebrew only, full RTL support required
- **Market**: Israel-specific (Voicenter, Israeli invoicing systems, local business patterns)
- **Reliability**: Zero tolerance for errors/crashes — trust is core to value proposition
- **Simplicity**: 2-minute setup, minimal ongoing owner interaction
- **Stack**: From scratch, no existing codebase

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| All three features required for v1 | No differentiation without the combination — competitors have pieces, not the whole | — Pending |
| Defer smart invoice scanning | Too complex for v1; direct integrations + manual trigger covers most cases | — Pending |
| Voicenter for telephony | Israeli provider with full API, instant number allocation, webhook support | — Pending |
| Manual trigger as invoice fallback | Simple, fits autopilot philosophy (one tap), avoids complex scanning | — Pending |

---
*Last updated: 2025-01-27 after initialization*
