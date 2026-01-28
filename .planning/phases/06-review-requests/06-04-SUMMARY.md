---
phase: 06-review-requests
plan: 04
subsystem: invoice-polling
tags: [bullmq, greeninvoice, icount, polling, scheduled-jobs]

dependency_graph:
  requires: [06-01, 06-02, 06-03]
  provides:
    - review request queue for delayed job scheduling
    - invoice poll worker for provider polling
    - hourly scheduled job at minute :15
  affects: [06-05, 06-06, 06-07]

tech_stack:
  added: []
  patterns:
    - scheduled job with minute offset for load spreading
    - dual-provider polling (Greeninvoice, iCount)
    - 24-hour delayed job scheduling (REVW-04 compliance)
    - error isolation per tenant

key_files:
  created:
    - src/queue/workers/invoice-poll.worker.ts
  modified:
    - src/queue/queues.ts
    - src/queue/index.ts
    - src/scheduler/jobs.ts

decisions:
  - id: invoice-poll-minute-offset
    choice: "Run invoice-poll at :15, review-check at :00, review-reminder at :30"
    reason: "Spread hourly jobs to avoid resource contention"
  - id: token-vault-api-key-type
    choice: "Store provider credentials as api_key type with vault ID as identifier"
    reason: "Consistent with token vault patterns, supports provider-specific credential formats"

metrics:
  duration: ~4 min
  completed: 2026-01-28
---

# Phase 06 Plan 04: Invoice Poll Worker Summary

Hourly invoice polling worker that detects new invoices from Greeninvoice and iCount, then schedules 24-hour delayed review request jobs.

## What Was Built

### Review Request Queue
- `reviewRequestQueue`: BullMQ queue for delayed review request processing
- `ReviewRequestJobData`: Interface with reviewRequestId for type safety
- Exported from queue module for worker access

### Invoice Poll Worker
- `startInvoicePollWorker()`: Worker that processes invoice-poll scheduled jobs
- Polls all active accounting connections (both Greeninvoice and iCount)
- For each new invoice with customer phone: creates review request + schedules 24h delayed job
- For invoices without customer phone: records as 'skipped' to prevent re-processing

Key features:
- **24-hour delay**: Per REVW-04, review requests sent 24h after service
- **Duplicate prevention**: Checks existing reviewRequests before creating new ones
- **Error isolation**: Failures for one tenant don't stop processing others
- **Rate limiting**: 100ms delay between connections to respect API limits
- **Single concurrency**: One job at a time to avoid API rate limit issues

### Scheduled Job Registration
- Registered `invoice-poll` job at minute :15 hourly
- Offset from review-check (:00) and review-reminder (:30) to spread load
- Added `invoice-poll` to ScheduledJobData type union

## Technical Implementation

### pollConnection() Function
```typescript
// For each active accounting connection:
1. Fetch credentials from token vault
2. Calculate fromDate (lastInvoiceDate or 7 days back)
3. Fetch invoices from provider (Greeninvoice or iCount)
4. For each invoice:
   - Skip if already processed
   - If no phone: record as 'skipped'
   - If has phone: create reviewRequest + schedule 24h job
5. Update connection lastPollAt and lastInvoiceDate
```

### Job Scheduling Pattern
```typescript
reviewRequestQueue.add(
  'send-review-request',
  { reviewRequestId: request.id },
  {
    delay: 24 * 60 * 60 * 1000, // 24 hours
    jobId: `review-req-${request.id}`,
    removeOnComplete: true,
  }
);
```

## Deviations from Plan

None - plan executed exactly as written.

## Verification Results

- [x] src/queue/queues.ts has reviewRequestQueue
- [x] src/queue/workers/invoice-poll.worker.ts exists
- [x] src/scheduler/jobs.ts registers invoice-poll job at :15
- [x] Worker is exported from queue module
- [x] TypeScript compiles without errors

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | 8ff1923 | Add review request queue and type |
| 2 | 90f2094 | Create invoice poll worker |
| 3 | b71a491 | Register scheduled job and export worker |

## Integration Points

**Inputs:**
- `accountingConnections` table (provider, credentials, lastPollAt)
- Token vault for decrypted provider credentials
- Greeninvoice/iCount API clients from Phase 06-02/03

**Outputs:**
- `reviewRequests` table records (pending or skipped status)
- `reviewRequestQueue` jobs (24h delayed)

**Consumed by:**
- Phase 06-05: Review request worker (processes the delayed jobs)

## Files Changed

| File | Change Type | Purpose |
|------|-------------|---------|
| src/queue/queues.ts | Modified | Added reviewRequestQueue and ReviewRequestJobData |
| src/queue/index.ts | Modified | Export queue, type, and worker |
| src/scheduler/jobs.ts | Modified | Register invoice-poll hourly job |
| src/queue/workers/invoice-poll.worker.ts | Created | Invoice polling worker |

## Next Steps

- 06-05: Create review request worker that processes the delayed jobs
- 06-06: Build dashboard UI for review request management
- 06-07: Create API routes for manual review request triggers
