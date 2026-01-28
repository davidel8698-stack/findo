---
phase: 05-review-management
plan: 03
subsystem: queue-workers
tags: [bullmq, polling, google-reviews, automation]

dependency_graph:
  requires:
    - 05-01 (processedReviews table for review tracking)
    - 05-02 (generateReviewReply and classifyReviewSentiment)
    - 05-04 (checkAndSendApproval for negative reviews, executed first)
  provides:
    - Hourly review polling via 'review-check' scheduled job
    - detectNewReviews orchestration function
    - processNewReview orchestration function
    - startReviewPollWorker for application boot
  affects:
    - 05-05 (reminders and auto-post will build on processed reviews)

tech_stack:
  added: []
  patterns:
    - Filter pattern in BullMQ workers (job.name check)
    - Rate limiting with sleep between tenant iterations
    - Per-tenant error isolation (continue on failure)

key_files:
  created:
    - src/queue/workers/review-poll.worker.ts
  modified:
    - src/queue/index.ts
    - src/services/review-management/index.ts (Task 1 was already done via 05-04)

decisions:
  - id: single-concurrency
    decision: "Worker runs with concurrency: 1"
    rationale: "Respect Google API rate limits, reviews not time-critical"
  - id: rate-limit-delay
    decision: "100ms delay between tenant iterations"
    rationale: "Consistent with other workers, prevents API throttling"
  - id: per-tenant-isolation
    decision: "Errors caught per-tenant without failing entire job"
    rationale: "One tenant's API issue shouldn't block others"

metrics:
  duration: "8 min"
  completed: "2026-01-28"
---

# Phase 05 Plan 03: Review Polling Worker Summary

**One-liner:** Hourly review polling worker that processes 'review-check' jobs, detects new reviews via Google API comparison, and auto-replies to positive reviews.

## What Was Built

### Review Poll Worker (`review-poll.worker.ts`)

1. **Worker Configuration:**
   - Listens on 'scheduled' queue
   - Filters to job.name === 'review-check'
   - Single concurrency to respect Google API rate limits

2. **Processing Logic:**
   - Fetches all active Google connections with locationId
   - For each tenant: calls detectNewReviews -> processNewReview
   - 100ms delay between tenants for rate limit protection
   - Per-tenant try/catch to isolate failures

3. **Logging:**
   - `[review-poll] Starting hourly review check`
   - `[review-poll] Checking N tenants (M skipped - no location)`
   - `[review-poll] Processed X/Y new reviews for tenant Z`
   - `[review-poll] Completed hourly review check`

### Queue Index Registration

- Exported `startReviewPollWorker` from `src/queue/index.ts`
- Worker starts on application boot

### Orchestration Functions (Already Existed from 05-04)

The `detectNewReviews` and `processNewReview` functions were already implemented as part of 05-04 (approval flow) execution. They provide:

1. **detectNewReviews:**
   - Filters reviews to only unprocessed, unreplied, recent reviews
   - Updates reviewPollState with current timestamp
   - Uses upsert pattern for poll state

2. **processNewReview:**
   - Classifies sentiment (handles 3-star edge case)
   - Generates AI reply via Claude Haiku 4.5
   - Posts reply for positive reviews immediately
   - Marks negative reviews as pending_approval
   - Creates activity events for audit trail

## Review Flow

```
Hourly Cron (scheduler/jobs.ts)
        |
        v
'review-check' job on 'scheduled' queue
        |
        v
review-poll.worker.ts
        |
        v
For each active Google connection:
    |
    +-> detectNewReviews(tenantId, connection)
    |       |
    |       +-> listReviews (Google API)
    |       +-> Filter: not in processedReviews
    |       +-> Filter: updateTime > lastPollAt
    |       +-> Filter: no reply exists
    |       +-> Update reviewPollState
    |
    +-> For each new review:
            |
            +-> processNewReview(tenantId, connectionId, review)
                    |
                    +-> classifyReviewSentiment (AI for 3-stars)
                    +-> generateReviewReply (Claude Haiku 4.5)
                    +-> INSERT into processedReviews
                    |
                    +-> If positive:
                    |       +-> postReviewReply (Google API)
                    |       +-> UPDATE status = 'auto_replied'
                    |       +-> Create activity event
                    |
                    +-> If negative:
                            +-> UPDATE status = 'pending_approval'
                            +-> checkAndSendApproval (WhatsApp)
                            +-> Create activity event
```

## Deviations from Plan

### Out-of-Order Execution

Task 1 (orchestration functions) was already completed as part of 05-04 execution before 05-03 ran. The linter auto-integrated the approval-flow module into index.ts, which actually improved the negative review handling by immediately notifying owners.

**Impact:** Positive - negative reviews now trigger owner notifications immediately, which is better than the plan's original "return review ID for approval flow (next plan)" approach.

## Commits

| Hash | Type | Description |
|------|------|-------------|
| 329aafa | feat | Create review poll worker for hourly review checks |
| 9cfc6bb | chore | Register review poll worker in queue index |

Note: Task 1 was already committed as part of 05-04 (commits a9b4d92, 4a78ac9).

## Success Criteria Verification

| Criteria | Status |
|----------|--------|
| Review poll worker processes hourly review-check jobs | PASS |
| New reviews detected by comparing Google API vs database | PASS |
| Positive reviews (4-5 stars, positive 3-stars) get auto-replied | PASS |
| Reply is posted to Google and recorded in database | PASS |
| Status transitions: detected -> auto_replied (positive) | PASS |
| Negative reviews stay in pending_approval for approval flow | PASS |
| Error handling prevents single tenant failures from crashing job | PASS |

## Next Phase Readiness

**Ready for 05-05:**
- Review polling is operational
- Processed reviews are tracked in database with correct status
- Approval flow integrated for negative reviews
- Activity events provide audit trail

**Integration points:**
- 05-05 (reminders): Can query processedReviews for pending_approval status + approvalSentAt
- 05-05 (auto-post): Can query for expired reviews and post drafts

---
*Phase: 05-review-management*
*Completed: 2026-01-28*
