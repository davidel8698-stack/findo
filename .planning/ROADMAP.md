# Roadmap: Findo

## Overview

Findo delivers autonomous SMB management through 10 phases that build from infrastructure to intelligence. The journey starts with multi-tenant foundations and WhatsApp integration (the core communication channel), progresses through lead capture and review management (the core value proposition), adds GBP content automation and optimization (the differentiators), and concludes with onboarding polish and billing (the business enablers). Every phase delivers observable value; together they create a system that operates 24/7 without owner intervention after a 2-minute setup.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation** - Multi-tenant infrastructure with queue-first webhook processing
- [x] **Phase 2: WhatsApp Integration** - Meta Embedded Signup and bidirectional messaging
- [x] **Phase 3: Lead Capture** - Missed call detection and WhatsApp chatbot lead qualification
- [x] **Phase 4: Google Integration** - GBP OAuth and review monitoring
- [x] **Phase 5: Review Management** - Auto-reply to positive reviews, draft responses for negative
- [ ] **Phase 6: Review Requests** - Invoice-triggered and manual review request flows
- [ ] **Phase 7: GBP Content** - Photo requests, uploads, and promotional posts
- [ ] **Phase 8: GBP Optimization** - Metrics monitoring and autonomous tuning
- [ ] **Phase 9: Dashboard & Notifications** - Confidence window and WhatsApp-first UX
- [ ] **Phase 10: Setup & Billing** - 2-minute onboarding wizard and payment processing

## Phase Details

### Phase 1: Foundation
**Goal**: Infrastructure that isolates tenants, processes webhooks reliably, and secures credentials
**Depends on**: Nothing (first phase)
**Requirements**: INFR-01, INFR-02, INFR-03, INFR-04, INFR-05, INFR-06
**Success Criteria** (what must be TRUE):
  1. System processes webhook at /webhook/test and returns 200 within 500ms while job queues asynchronously
  2. Two test tenants exist in database with Row-Level Security preventing cross-tenant data access
  3. Encrypted token storage accepts and retrieves test credentials without exposing plaintext
  4. Background job scheduler runs hourly, daily, and weekly test jobs on schedule
  5. Activity feed receives real-time updates when test events are published
**Plans**: 8 plans

Plans:
- [x] 01-01-PLAN.md - Initialize project with TypeScript, Hono, and database schema
- [x] 01-02-PLAN.md - Row-Level Security and tenant context middleware
- [x] 01-03-PLAN.md - Encrypted token vault for credentials
- [x] 01-04-PLAN.md - BullMQ queue infrastructure
- [x] 01-05-PLAN.md - Webhook endpoints and activity service
- [x] 01-06-PLAN.md - Background job scheduler
- [x] 01-07-PLAN.md - Activity feed SSE and verification scripts
- [x] 01-08-PLAN.md - Gap closure: Redis warm-up and RLS GRANT statements

**Research flag**: None (standard patterns)

---

### Phase 2: WhatsApp Integration
**Goal**: Business owners can connect WhatsApp in one click and system can send/receive messages
**Depends on**: Phase 1
**Requirements**: INTG-01, INTG-02
**Success Criteria** (what must be TRUE):
  1. User clicks "Connect WhatsApp" and completes Meta Embedded Signup popup without leaving the app
  2. System stores WABA ID, Phone Number ID, and tokens encrypted in Token Vault
  3. System can send a WhatsApp message to a test number and message is delivered
  4. System receives incoming WhatsApp messages via webhook and queues them for processing
**Plans**: 6 plans

Plans:
- [x] 02-01-PLAN.md - WhatsApp database schema and Graph API client service
- [x] 02-02-PLAN.md - Embedded Signup callback endpoint for token exchange
- [x] 02-03-PLAN.md - Webhook handler with signature verification
- [x] 02-04-PLAN.md - Message and status processing workers
- [x] 02-05-PLAN.md - Daily token validation job
- [x] 02-06-PLAN.md - Frontend UI for Connect WhatsApp button and Meta Embedded Signup

**Research flag**: Completed (02-RESEARCH.md)

---

### Phase 3: Lead Capture
**Goal**: Missed calls become qualified leads delivered to business owner via WhatsApp
**Depends on**: Phase 2
**Requirements**: LEAD-01, LEAD-02, LEAD-03, LEAD-04, LEAD-05, LEAD-06, LEAD-07, INTG-05, NOTF-03
**Success Criteria** (what must be TRUE):
  1. Voicenter webhook fires for unanswered call and system waits 2 minutes before acting
  2. Caller receives WhatsApp message "I saw you called [business]..." after 2-minute delay
  3. WhatsApp chatbot collects customer name, need, and contact preference through conversation
  4. Lead is saved with organized summary viewable in system
  5. Business owner receives WhatsApp notification with complete lead details and can respond
  6. All three phone options work: new Voicenter number, transfer existing, use current mobile
**Plans**: 6 plans

Plans:
- [x] 03-01-PLAN.md - Lead database schema and Voicenter types
- [x] 03-02-PLAN.md - Voicenter webhook endpoint and CDR processing worker
- [x] 03-03-PLAN.md - Lead outreach worker (2-minute delayed WhatsApp)
- [x] 03-04-PLAN.md - Chatbot state machine and AI intent extraction
- [x] 03-05-PLAN.md - Lead message handler and owner notifications
- [x] 03-06-PLAN.md - Reminder system (2h and 24h follow-ups)

**Research flag**: Completed (03-RESEARCH.md)

---

### Phase 4: Google Integration
**Goal**: Business owners can connect Google and system can read/write to their GBP
**Depends on**: Phase 1
**Requirements**: INTG-03, INTG-04
**Success Criteria** (what must be TRUE):
  1. User clicks "Connect Google" and completes OAuth flow selecting their business
  2. System stores access and refresh tokens encrypted with proactive refresh before expiry
  3. System can read business profile details and existing reviews from GBP API
  4. System can post a reply to a review via GBP API
**Plans**: 4 plans

Plans:
- [x] 04-01-PLAN.md - Google OAuth foundation (schema, OAuth service, callback routes)
- [x] 04-02-PLAN.md - Google API services (profile and reviews)
- [x] 04-03-PLAN.md - Token refresh worker (proactive refresh every 5 minutes)
- [x] 04-04-PLAN.md - Google connection frontend UI (Hebrew, RTL)

**Research flag**: Completed (04-RESEARCH.md)

---

### Phase 5: Review Management
**Goal**: Positive reviews get auto-replies; negative reviews get drafted responses awaiting owner approval
**Depends on**: Phase 4
**Requirements**: GBPR-01, GBPR-02, GBPR-03, GBPR-04, GBPR-05, GBPR-06, NOTF-02
**Success Criteria** (what must be TRUE):
  1. System checks for new reviews every hour and detects new reviews within 1 hour of posting
  2. New 4-5 star review receives AI-generated reply using reviewer's name and referencing their content
  3. New 1-3 star review triggers WhatsApp alert to owner with ready-made response draft
  4. Owner can approve or edit negative review response before it posts
  5. Auto-replies match owner's voice and business type (Hebrew, professional, warm)
**Plans**: 6 plans

Plans:
- [x] 05-01-PLAN.md - Review tracking database schema
- [x] 05-02-PLAN.md - AI reply generator with Claude Haiku 4.5
- [x] 05-03-PLAN.md - Review poll worker for hourly detection and auto-reply
- [x] 05-04-PLAN.md - Owner notification with WhatsApp interactive buttons
- [x] 05-05-PLAN.md - Owner response handler for approve/edit workflow
- [x] 05-06-PLAN.md - 48h reminder and auto-post system

**Research flag**: Completed (05-RESEARCH.md)

---

### Phase 6: Review Requests
**Goal**: Customers receive review requests automatically after service, with smart follow-up
**Depends on**: Phase 2, Phase 4
**Requirements**: REVW-01, REVW-02, REVW-03, REVW-04, REVW-05, REVW-06, REVW-07, INTG-06, INTG-07
**Success Criteria** (what must be TRUE):
  1. Greeninvoice polling detects new invoices and triggers review request flow
  2. iCount polling detects new invoices and triggers review request flow
  3. Manual trigger works: dashboard "Mark as service" button creates review request
  4. System waits 24 hours after service before sending WhatsApp with direct Google review link
  5. If no review after 3 days, system sends exactly 1 reminder then stops (no spam)
**Plans**: 7 plans

Plans:
- [ ] 06-01-PLAN.md - Review request schema and accounting connections
- [ ] 06-02-PLAN.md - Greeninvoice API client (JWT auth, document search)
- [ ] 06-03-PLAN.md - iCount API client (session auth, document search)
- [ ] 06-04-PLAN.md - Invoice poll worker (hourly detection, 24h delayed jobs)
- [ ] 06-05-PLAN.md - Review request worker (WhatsApp templates, 3-day reminder)
- [ ] 06-06-PLAN.md - Manual trigger UI (dashboard form)
- [ ] 06-07-PLAN.md - Review completion detection (cross-reference with review poll)

**Research flag**: Completed (06-RESEARCH.md) - CRITICAL: Neither Greeninvoice nor iCount has webhooks for invoice creation. Polling is required for both.

---

### Phase 7: GBP Content
**Goal**: Business's Google profile stays fresh with regular photos and promotional posts
**Depends on**: Phase 4
**Requirements**: GBPC-01, GBPC-02, GBPC-03, GBPC-04, GBPC-05, NOTF-04
**Success Criteria** (what must be TRUE):
  1. Owner receives weekly WhatsApp asking for 1-2 photos from the week
  2. Photos sent to system are uploaded to GBP within 24 hours
  3. Monthly promotional post is created from owner-provided content or AI-generated if none provided
  4. System checks business details (holidays, hours) and offers updates for owner approval
  5. Photo request notifications are actionable via WhatsApp reply
**Plans**: TBD

Plans:
- [ ] 07-01: TBD
- [ ] 07-02: TBD

**Research flag**: None (standard patterns)

---

### Phase 8: GBP Optimization
**Goal**: System monitors GBP metrics and autonomously optimizes for better performance
**Depends on**: Phase 5, Phase 6, Phase 7
**Requirements**: GBPO-01, GBPO-02, GBPO-03, GBPO-04, GBPO-05, GBPO-06, GBPO-07, NOTF-05
**Success Criteria** (what must be TRUE):
  1. Dashboard shows GBP metrics: average rating, review rate, total reviews, response percentage
  2. Dashboard shows visibility metrics: impressions, contacts, search queries
  3. Dashboard shows content metrics: image count, image views
  4. Alert is sent when review rate drops below target (2-3 per week)
  5. System autonomously adjusts review request timing based on response rates
  6. System A/B tests message templates and adopts better performers
**Plans**: TBD

Plans:
- [ ] 08-01: TBD
- [ ] 08-02: TBD

**Research flag**: None (standard patterns)

---

### Phase 9: Dashboard & Notifications
**Goal**: Business owner has confidence window showing Findo is working, with WhatsApp-first interactions
**Depends on**: Phase 3, Phase 5, Phase 8
**Requirements**: DASH-01, DASH-02, DASH-03, DASH-04, DASH-05, DASH-06, DASH-07, DASH-08, NOTF-01
**Success Criteria** (what must be TRUE):
  1. Main dashboard shows daily stats: calls received, unanswered, WhatsApp sent, new reviews, current rating
  2. Activity feed shows timeline of all events with timestamps, updating in real-time
  3. Owner can approve/edit negative review responses directly from dashboard
  4. Owner can upload photos and enter promotional content when requested
  5. Settings allow customizing: response templates, wait times, notification preferences, chatbot questions
  6. Weekly and monthly reports show performance trends with clear graphs
  7. Most interactions happen via WhatsApp; dashboard is for confidence, not daily use
**Plans**: TBD

Plans:
- [ ] 09-01: TBD
- [ ] 09-02: TBD
- [ ] 09-03: TBD

**Research flag**: None (standard patterns)

---

### Phase 10: Setup & Billing
**Goal**: New business completes setup in 2 minutes and pays for the service
**Depends on**: Phase 2, Phase 4, Phase 3
**Requirements**: SETUP-01, SETUP-02, SETUP-03, SETUP-04, SETUP-05, SETUP-06, BILL-01, BILL-02, BILL-03
**Success Criteria** (what must be TRUE):
  1. Setup wizard collects minimal info (name, type, owner name, address, hours) in under 60 seconds
  2. "Connect WhatsApp" button completes Meta Embedded Signup in one click
  3. "Connect Google" button completes OAuth in one click
  4. Telephony option selection (new/transfer/use current) is clear and works for each option
  5. After setup, dashboard shows "Findo is now working in the background" within 2 minutes of starting
  6. Progressive profiling asks for more details over time without burdening initial setup
  7. User can pay 3,500 NIS setup fee and 350 NIS/month subscription through the system
**Plans**: TBD

Plans:
- [ ] 10-01: TBD
- [ ] 10-02: TBD
- [ ] 10-03: TBD

**Research flag**: User research on actual onboarding time

---

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 9 -> 10

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 8/8 | Complete | 2026-01-27 |
| 2. WhatsApp Integration | 6/6 | Complete | 2026-01-27 |
| 3. Lead Capture | 6/6 | Complete | 2026-01-27 |
| 4. Google Integration | 4/4 | Complete | 2026-01-28 |
| 5. Review Management | 6/6 | Complete | 2026-01-28 |
| 6. Review Requests | 0/7 | Planned | - |
| 7. GBP Content | 0/TBD | Not started | - |
| 8. GBP Optimization | 0/TBD | Not started | - |
| 9. Dashboard & Notifications | 0/TBD | Not started | - |
| 10. Setup & Billing | 0/TBD | Not started | - |

---

## Requirement Coverage

**Total v1 requirements:** 56
**Mapped to phases:** 56
**Coverage:** 100%

| Category | Count | Phase(s) |
|----------|-------|----------|
| INFR | 6 | Phase 1 |
| INTG | 7 | Phase 2 (2), Phase 4 (2), Phase 6 (3) |
| LEAD | 7 | Phase 3 |
| REVW | 7 | Phase 6 |
| GBPR | 6 | Phase 5 |
| GBPC | 5 | Phase 7 |
| GBPO | 7 | Phase 8 |
| SETUP | 6 | Phase 10 |
| DASH | 8 | Phase 9 |
| NOTF | 5 | Phase 3 (1), Phase 5 (1), Phase 7 (1), Phase 8 (1), Phase 9 (1) |
| BILL | 3 | Phase 10 |

---
*Roadmap created: 2026-01-27*
*Last updated: 2026-01-28*
