# Requirements: Findo

**Defined:** 2026-01-27
**Core Value:** Business owner does nothing after 2-minute setup. Findo operates autonomously 24/7.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Lead Capture (LEAD)

- [ ] **LEAD-01**: Missed call detected via Voicenter webhook (caller number + timestamp)
- [ ] **LEAD-02**: System waits 2 minutes before acting (in case owner calls back)
- [ ] **LEAD-03**: WhatsApp message sent to caller: "I saw you called [business]..."
- [ ] **LEAD-04**: Chatbot collects customer details (configurable questions per business type)
- [ ] **LEAD-05**: Customer saved as lead with organized summary
- [ ] **LEAD-06**: Business owner notified via WhatsApp with lead details
- [ ] **LEAD-07**: Phone options supported: new number, transfer existing, use current mobile

### Review Requests (REVW)

- [ ] **REVW-01**: Invoice creation triggers review request flow (Greeninvoice webhook)
- [ ] **REVW-02**: Invoice creation triggers review request flow (iCount integration)
- [ ] **REVW-03**: Manual trigger: forward invoice to Findo or "Mark as service" button
- [ ] **REVW-04**: System waits 24 hours after service before sending request
- [ ] **REVW-05**: WhatsApp sent with personalized message and direct Google review link
- [ ] **REVW-06**: If no review after 3 days, send 1 reminder
- [ ] **REVW-07**: After reminder, stop (no spam)

### GBP Reviews (GBPR)

- [ ] **GBPR-01**: Check for new reviews every hour via GBP API polling
- [ ] **GBPR-02**: Auto-reply to 4-5 star reviews (AI-generated, personalized, owner's voice)
- [ ] **GBPR-03**: Reply uses reviewer's name and references their review content
- [ ] **GBPR-04**: Alert owner for 1-3 star reviews via WhatsApp
- [ ] **GBPR-05**: Provide ready-made reply draft for negative reviews
- [ ] **GBPR-06**: Owner approves/edits before negative reply is posted

### GBP Content (GBPC)

- [ ] **GBPC-01**: Weekly photo request sent to owner ("Send 1-2 photos from the week")
- [ ] **GBPC-02**: System uploads received photos to GBP
- [ ] **GBPC-03**: Monthly promotional post (owner provides content)
- [ ] **GBPC-04**: AI generates promotional post if owner doesn't provide
- [ ] **GBPC-05**: Check business details (holidays, hours) and offer updates for approval

### GBP Optimization (GBPO)

- [ ] **GBPO-01**: Monitor GBP metrics: average rating, review rate, total reviews, response %
- [ ] **GBPO-02**: Monitor visibility metrics: impressions, contacts, search queries
- [ ] **GBPO-03**: Monitor content metrics: image count, image views
- [ ] **GBPO-04**: Alert if review rate drops below target (2-3 per week)
- [ ] **GBPO-05**: Autonomous optimization: adjust review request timing
- [ ] **GBPO-06**: Autonomous optimization: adjust message templates
- [ ] **GBPO-07**: Autonomous optimization: A/B test approaches

### Setup & Onboarding (SETUP)

- [ ] **SETUP-01**: 2-minute setup wizard (business name, type, owner name, address, hours)
- [ ] **SETUP-02**: "Connect WhatsApp" button via Meta Embedded Signup
- [ ] **SETUP-03**: "Connect Google" button via OAuth 2.0
- [ ] **SETUP-04**: Select telephony option (new/transfer/use current)
- [ ] **SETUP-05**: Dashboard shows "Findo is now working in the background"
- [ ] **SETUP-06**: Progressive profiling: collect more details over time via WhatsApp

### Dashboard (DASH)

- [ ] **DASH-01**: Main screen shows daily stats (calls, WhatsApp sent, reviews, rating)
- [ ] **DASH-02**: Activity feed with timeline of events and timestamps
- [ ] **DASH-03**: Approve/edit negative review responses before posting
- [ ] **DASH-04**: Upload photos when system requests
- [ ] **DASH-05**: Enter promotional content for monthly posts
- [ ] **DASH-06**: View weekly/monthly reports and performance graphs
- [ ] **DASH-07**: Settings: response templates, wait times, notification preferences
- [ ] **DASH-08**: Settings: chatbot questions (configurable per business type)

### Notifications (NOTF)

- [ ] **NOTF-01**: Most interactions via WhatsApp to business owner (not dashboard)
- [ ] **NOTF-02**: "New negative review" notification with tap-to-respond
- [ ] **NOTF-03**: "New lead" notification with summary
- [ ] **NOTF-04**: Photo request notifications
- [ ] **NOTF-05**: Review rate alert if below target

### Integrations (INTG)

- [ ] **INTG-01**: WhatsApp Business API via Meta Embedded Signup
- [ ] **INTG-02**: Store WABA ID, Phone Number ID, tokens encrypted
- [ ] **INTG-03**: Google Business Profile API via OAuth 2.0
- [ ] **INTG-04**: Store access + refresh tokens encrypted, handle refresh
- [ ] **INTG-05**: Voicenter webhook for unanswered calls
- [ ] **INTG-06**: Greeninvoice webhook for invoice creation
- [ ] **INTG-07**: iCount integration for invoice detection

### Infrastructure (INFR)

- [x] **INFR-01**: Multi-tenant architecture (one account = one business)
- [x] **INFR-02**: Secure tenant data isolation (Row-Level Security)
- [x] **INFR-03**: Encrypted storage for all tokens and credentials
- [x] **INFR-04**: Queue-based webhook processing (respond fast, process async)
- [x] **INFR-05**: Background job scheduling (hourly, daily, weekly, monthly)
- [x] **INFR-06**: Real-time activity feed updates

### Billing (BILL)

- [ ] **BILL-01**: One-time setup fee: ~3,500 NIS
- [ ] **BILL-02**: Monthly subscription: 350 NIS/month
- [ ] **BILL-03**: Payment processing integration

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Language & Localization

- **LANG-01**: English language support
- **LANG-02**: Arabic language support

### Advanced Integrations

- **AINT-01**: Rivhit accounting integration
- **AINT-02**: Additional Israeli VoIP providers
- **AINT-03**: SMS fallback for non-WhatsApp users

### Agency Features

- **AGCY-01**: Multi-business management for agencies
- **AGCY-02**: Agency dashboard with all clients
- **AGCY-03**: White-label options

### Mobile

- **MOBL-01**: Native mobile app (iOS)
- **MOBL-02**: Native mobile app (Android)

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Rivhit integration | Poor API quality, limited webhook support, not worth effort for v1 |
| Real-time chat with customers | Findo collects info and hands off, doesn't replace the business |
| Review gating (filter negative before posting) | Illegal under FTC guidelines, up to $51,744/violation |
| Complex workflow builders | Creates support burden, against "autonomous" core value |
| Video content for GBP | Storage/bandwidth costs, complexity, defer to future |
| Mobile app | Web-first approach, mobile responsive is sufficient for v1 |
| Multi-language support | Hebrew-only focus simplifies AI layer and UI |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| LEAD-01 | Phase 3 | Pending |
| LEAD-02 | Phase 3 | Pending |
| LEAD-03 | Phase 3 | Pending |
| LEAD-04 | Phase 3 | Pending |
| LEAD-05 | Phase 3 | Pending |
| LEAD-06 | Phase 3 | Pending |
| LEAD-07 | Phase 3 | Pending |
| REVW-01 | Phase 6 | Pending |
| REVW-02 | Phase 6 | Pending |
| REVW-03 | Phase 6 | Pending |
| REVW-04 | Phase 6 | Pending |
| REVW-05 | Phase 6 | Pending |
| REVW-06 | Phase 6 | Pending |
| REVW-07 | Phase 6 | Pending |
| GBPR-01 | Phase 5 | Pending |
| GBPR-02 | Phase 5 | Pending |
| GBPR-03 | Phase 5 | Pending |
| GBPR-04 | Phase 5 | Pending |
| GBPR-05 | Phase 5 | Pending |
| GBPR-06 | Phase 5 | Pending |
| GBPC-01 | Phase 7 | Pending |
| GBPC-02 | Phase 7 | Pending |
| GBPC-03 | Phase 7 | Pending |
| GBPC-04 | Phase 7 | Pending |
| GBPC-05 | Phase 7 | Pending |
| GBPO-01 | Phase 8 | Pending |
| GBPO-02 | Phase 8 | Pending |
| GBPO-03 | Phase 8 | Pending |
| GBPO-04 | Phase 8 | Pending |
| GBPO-05 | Phase 8 | Pending |
| GBPO-06 | Phase 8 | Pending |
| GBPO-07 | Phase 8 | Pending |
| SETUP-01 | Phase 10 | Pending |
| SETUP-02 | Phase 10 | Pending |
| SETUP-03 | Phase 10 | Pending |
| SETUP-04 | Phase 10 | Pending |
| SETUP-05 | Phase 10 | Pending |
| SETUP-06 | Phase 10 | Pending |
| DASH-01 | Phase 9 | Pending |
| DASH-02 | Phase 9 | Pending |
| DASH-03 | Phase 9 | Pending |
| DASH-04 | Phase 9 | Pending |
| DASH-05 | Phase 9 | Pending |
| DASH-06 | Phase 9 | Pending |
| DASH-07 | Phase 9 | Pending |
| DASH-08 | Phase 9 | Pending |
| NOTF-01 | Phase 9 | Pending |
| NOTF-02 | Phase 5 | Pending |
| NOTF-03 | Phase 3 | Pending |
| NOTF-04 | Phase 7 | Pending |
| NOTF-05 | Phase 8 | Pending |
| INTG-01 | Phase 2 | Pending |
| INTG-02 | Phase 2 | Pending |
| INTG-03 | Phase 4 | Pending |
| INTG-04 | Phase 4 | Pending |
| INTG-05 | Phase 3 | Pending |
| INTG-06 | Phase 6 | Pending |
| INTG-07 | Phase 6 | Pending |
| INFR-01 | Phase 1 | Complete |
| INFR-02 | Phase 1 | Complete |
| INFR-03 | Phase 1 | Complete |
| INFR-04 | Phase 1 | Complete |
| INFR-05 | Phase 1 | Complete |
| INFR-06 | Phase 1 | Complete |
| BILL-01 | Phase 10 | Pending |
| BILL-02 | Phase 10 | Pending |
| BILL-03 | Phase 10 | Pending |

**Coverage:**
- v1 requirements: 56 total
- Mapped to phases: 56
- Unmapped: 0

---
*Requirements defined: 2026-01-27*
*Last updated: 2026-01-27 after roadmap creation*
