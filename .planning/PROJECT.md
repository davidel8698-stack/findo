# Findo

## What This Is

Findo is a Hebrew SaaS platform for small and medium-sized businesses in Israel that runs completely autonomously after a 2-minute setup. It solves three critical problems SMBs face daily: lost leads from unanswered phone calls, lack of positive Google reviews due to no automated request mechanism, and poor management of their Google Business Profile. The business owner does nothing beyond initial installation — Findo works 24/7 in the background.

## Core Value

The business owner does nothing. Findo operates completely autonomously after a 2-minute setup, capturing leads, growing reviews, and managing their digital presence without any ongoing effort.

## Requirements

### Validated

(None yet — ship to validate)

### Active

**Missed Call → WhatsApp Lead Capture:**
- [ ] Phone rings → no answer after 20 seconds → system waits 2 minutes → WhatsApp sent to caller
- [ ] WhatsApp chatbot collects customer details (configurable per business type)
- [ ] Customer saved as lead with organized summary
- [ ] Lead handed off to business owner via WhatsApp notification
- [ ] Voicenter integration for unanswered call webhooks
- [ ] Support for: new number (instant), transfer existing number (3-5 days), use current mobile

**Post-Service → Review Requests:**
- [ ] Invoice detected → wait 24 hours → WhatsApp with direct Google review link
- [ ] If no review after 3 days → send 1 reminder → stop
- [ ] Manual trigger: forward invoice to Findo WhatsApp/Email, or "Mark as service" button
- [ ] Greeninvoice integration (webhook on invoice creation)
- [ ] iCount integration (webhook or polling)

**GBP Autopilot (runs forever, completely autonomous):**
- [ ] Review monitoring: check for new reviews every hour
- [ ] Auto-reply to 4-5 star reviews: personalized, in owner's voice, uses reviewer name and references their content
- [ ] Negative review alerts (1-3 stars): WhatsApp to owner with ready-made reply draft
- [ ] Weekly photo requests: "Send 1-2 photos from the week" → system uploads to GBP
- [ ] Monthly promotional post: owner provides content, or AI generates if they don't
- [ ] Business details updates: holidays, hours changes → offer update for approval
- [ ] Review rate monitoring: alert if drops below target (2-3 per week)

**GBP Optimization Loop (autonomous intelligence):**
- [ ] Monitor metrics: average rating, review rate, total reviews, response %, impressions, contacts, search queries, image count, image views
- [ ] Optimization levers — Reviews: request timing, reminder timing, message templates
- [ ] Optimization levers — Content: photo requests (specific types), posting frequency, post style/format
- [ ] Optimization levers — Profile: hours, services, features, description keywords, category suggestions
- [ ] Optimization levers — Engagement: WhatsApp templates, timing, A/B testing
- [ ] Continuous improvement cycle: monitor → identify gaps → plan actions → execute → measure → repeat

**Setup Flow (2 minutes):**
- [ ] Step 1: Business information (minimal: name, type, owner name, address, hours)
- [ ] Step 2: "Connect WhatsApp" button → Meta Embedded Signup popup → done
- [ ] Step 3: "Connect Google" button → Google OAuth popup → done
- [ ] Step 4: Select telephony option (new number / transfer / use current mobile)
- [ ] Step 5: Dashboard shows "Findo is now working in the background"

**Progressive Profiling (post-setup):**
- [ ] System asks for more details over time via WhatsApp/notifications
- [ ] Week 1: "What services do you offer?"
- [ ] Week 2: "What makes your business special?"
- [ ] Week 3: "Do you have parking? Accessibility features?"
- [ ] Business profile gets richer without burdening setup

**Dashboard (confidence window, not control panel):**
- [ ] Main screen: daily stats (calls received, unanswered, WhatsApp sent, new reviews, current rating)
- [ ] Activity feed: timeline of events with timestamps
- [ ] Actions: approve/edit negative review responses, upload photos, enter promotions, view reports, adjust settings
- [ ] Settings: response templates, wait times, notification preferences, chatbot questions
- [ ] Weekly/monthly reports and performance graphs

**Notification-Driven UX:**
- [ ] Most interactions via WhatsApp/SMS to business owner
- [ ] "New negative review — tap to respond" → opens specific screen → approve → done
- [ ] No need to browse dashboard daily

**Integrations:**
- [ ] WhatsApp Business API via Meta Embedded Signup (configuration ID, code exchange, WABA ID + Phone Number ID storage)
- [ ] Google Business Profile API via OAuth 2.0 (consent screen, code exchange, access + refresh tokens, business list)
- [ ] Voicenter (Israeli VoIP): webhook for unanswered calls (caller number + timestamp)
- [ ] Greeninvoice: webhook on document.created (customer phone/email, name, service)
- [ ] iCount: API integration (webhook or polling)

**Billing:**
- [ ] One-time setup fee: ~3,500 NIS
- [ ] Monthly subscription: 350 NIS/month
- [ ] Payment processing integration

**Multi-tenant Architecture:**
- [ ] One account = one business
- [ ] Secure data isolation between tenants
- [ ] Encrypted storage of tokens and credentials

### Out of Scope

- English/Arabic language support — Hebrew only for v1
- Agency/consultant multi-business management — individual business owners only
- Rivhit integration — poor API quality, not worth the effort for v1
- Mobile app — web-first, mobile later
- Real-time chat with customers — Findo collects info and hands off, doesn't replace the business

## Context

**Target Market:**
- Small and medium-sized businesses in Israel
- Price-sensitive (can't afford high monthly fees)
- Don't have time or knowledge to manage their digital presence
- Often miss calls because they're busy working

**Technical Environment:**
- Greenfield project — no existing code, designs, or documentation
- Building with Claude (AI-assisted development)
- Hebrew language throughout (UI, messages, AI-generated content)

**Integration Partners:**
- Meta (WhatsApp Business API) — requires Tech Provider registration and Business Verification (2-4 weeks)
- Google (Business Profile API) — requires API access request and OAuth consent verification (3-5 days)
- Voicenter — Israeli VoIP provider, webhooks for call events
- Greeninvoice — best Israeli accounting API, full webhook support
- iCount — secondary accounting integration, limited webhooks

**Key Technical Decisions Already Made:**
- WhatsApp via Meta Embedded Signup (one-click connection)
- Google via OAuth 2.0 (standard flow)
- Voicenter for telephony (webhook-based)
- Greeninvoice as primary accounting integration

## Constraints

- **Language**: Hebrew only — all UI, messages, and AI-generated content in Hebrew
- **Cost**: Must be cheap to maintain — target customers are price-sensitive SMBs
- **Quality**: High quality, stable, durable — this is the differentiation
- **Autonomy**: System must work without user intervention after setup
- **Setup time**: Must complete in 2 minutes or less

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Hebrew only for v1 | Focus on Israeli market, simplify AI layer | — Pending |
| Individual business owners only (no agencies) | Simpler multi-tenant model, clearer UX | — Pending |
| Voicenter for telephony | Israeli provider, webhook support for unanswered calls | — Pending |
| Greeninvoice as primary accounting | Best API quality, full webhook support | — Pending |
| Meta Embedded Signup for WhatsApp | One-click connection, can create WhatsApp Business in same flow | — Pending |
| Notification-driven UX over dashboard-driven | Reinforces "you don't need to do anything" core value | — Pending |
| Progressive profiling over long setup | Keeps 2-minute setup promise, system gets smarter over time | — Pending |

---
*Last updated: 2026-01-27 after initialization*
