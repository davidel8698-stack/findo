---
phase: 06-review-requests
plan: 05
subsystem: review-request-worker
tags: [bullmq, whatsapp, templates, google-reviews]
dependency-graph:
  requires: [06-01]
  provides: [review-request-worker, review-message-service]
  affects: [06-07]
tech-stack:
  added: []
  patterns: [delayed-jobs, whatsapp-templates, google-review-links]
key-files:
  created:
    - src/services/review-request/messages.ts
    - src/services/review-request/index.ts
    - src/queue/workers/review-request.worker.ts
  modified:
    - src/queue/index.ts
    - src/db/schema/google.ts
decisions:
  - placeId field added to googleConnections schema
metrics:
  duration: ~38 min (includes checkpoint wait)
  completed: 2026-01-28
---

# Phase 6 Plan 05: Review Request Worker Summary

**One-liner:** BullMQ worker sends WhatsApp review requests with Google review links, schedules single 3-day reminder, then stops (no spam).

## What Was Built

Review request worker that processes delayed review request jobs and sends WhatsApp template messages with direct Google review links.

### Key Components

1. **Message Service** (`src/services/review-request/messages.ts`)
   - `generateGoogleReviewLink(placeId)` - Creates direct Google review URL
   - `sendReviewRequestMessage()` - Sends initial review request template
   - `sendReviewReminderMessage()` - Sends 3-day follow-up template

2. **Review Request Worker** (`src/queue/workers/review-request.worker.ts`)
   - Handles `send-review-request` jobs (24h after invoice)
   - Handles `send-review-reminder` jobs (3 days after initial)
   - Status transitions: pending -> requested -> stopped
   - Skips if customer already left review (completed status)
   - Marks as 'stopped' after reminder (REVW-07: no spam)

3. **Infrastructure**
   - Worker exported from `src/queue/index.ts`
   - Uses existing `reviewRequestQueue` from queues.ts
   - Concurrency: 5 (multiple requests in parallel)

### Status Lifecycle

```
pending (invoice detected, waiting 24h)
    |
    v
requested (initial WhatsApp sent)
    |
    +---> completed (customer left review)
    |
    v
stopped (reminder sent, no more messages)
```

## Commits

| Hash | Type | Description |
|------|------|-------------|
| 7c1217c | feat | Create review request message service |
| 8794bf3 | feat | Create review request worker |
| f59c82c | chore | Export worker from queue module |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added placeId field to googleConnections schema**
- **Found during:** Task 1 preparation
- **Issue:** Plan assumed `googleConnection.placeId` exists but schema had no such field
- **Fix:** Added `placeId: varchar('place_id', { length: 100 })` to googleConnections table
- **Files modified:** src/db/schema/google.ts
- **Commit:** 7c1217c (included with Task 1)

## Verification Checklist

- [x] src/services/review-request/messages.ts exists with template functions
- [x] src/services/review-request/index.ts exports message service
- [x] src/queue/workers/review-request.worker.ts exists
- [x] Worker handles both send-review-request and send-review-reminder jobs
- [x] Status transitions: pending -> requested -> stopped (or completed)
- [x] Only 1 reminder is scheduled (REVW-06)
- [x] After reminder, status is 'stopped' (REVW-07: no spam)
- [x] TypeScript compiles without errors

## User Setup

WhatsApp templates created and submitted for approval in Meta Business Suite:

1. **review_request** template (Hebrew)
   - Body with customer name and business name variables
   - URL button linking to Google review page

2. **review_reminder** template (Hebrew)
   - Body with business name variable
   - URL button linking to Google review page

## Dependencies

**Requires:**
- 06-01: Review requests schema (reviewRequests table)
- reviewRequestQueue from queues.ts
- WhatsApp client (createWhatsAppClient)
- Google connection with placeId

**Provides:**
- startReviewRequestWorker() function
- Review message generation functions

## Next Phase Readiness

Phase 6 continues with:
- 06-07: Review completion tracking (detect when customer leaves review)

No blockers. Worker ready to process review request jobs once:
1. WhatsApp templates are approved by Meta
2. Tenants have Google Place ID configured
