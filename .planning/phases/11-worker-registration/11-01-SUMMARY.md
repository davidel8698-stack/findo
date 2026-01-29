---
phase: 11-worker-registration
plan: 01
subsystem: infra
tags: [bullmq, workers, redis, queue, lifecycle]

# Dependency graph
requires:
  - phase: 05-review-management
    provides: review-poll.worker.ts, review-reminder.worker.ts
  - phase: 06-review-requests
    provides: invoice-poll.worker.ts, review-request.worker.ts
  - phase: 08-gbp-optimization
    provides: metrics-collection.worker.ts, auto-tuning.worker.ts
provides:
  - All 19 workers registered and running in src/index.ts
  - Graceful shutdown handlers for all workers
  - Gap closure from v1-MILESTONE-AUDIT.md
affects: [10-setup-billing, production-deployment]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Import-time worker instantiation for const exports
    - Lazy-started workers via start functions

key-files:
  created: []
  modified:
    - src/index.ts

key-decisions:
  - "metricsCollectionWorker and autoTuningWorker auto-start at import time (const export pattern)"
  - "4 workers use lazy-start pattern via start functions for controlled lifecycle"
  - "All 6 new workers have graceful shutdown handlers"

patterns-established:
  - "Worker registration pattern: import, track variable, start in start(), cleanup in shutdown()"
  - "Const export workers start at import time, no tracking variable needed"

# Metrics
duration: 4min
completed: 2026-01-30
---

# Phase 11 Plan 01: Worker Registration Summary

**Registered 6 missing workers (review-poll, review-reminder, invoice-poll, review-request, metrics-collection, auto-tuning) in src/index.ts, bringing total to 19/19 workers operational**

## Performance

- **Duration:** 4 min 15 sec
- **Started:** 2026-01-29T23:10:03Z
- **Completed:** 2026-01-29T23:14:18Z
- **Tasks:** 3
- **Files modified:** 1

## Accomplishments

- Added 6 worker imports to src/index.ts (lines 29-34)
- Added 4 worker tracking variables and 4 start calls in start() function
- Added 6 graceful shutdown handlers in shutdown() function
- Closed milestone audit gap: 19/19 workers now registered and operational

## Task Commits

Each task was committed atomically:

1. **Task 1: Add worker imports** - `cecfbd3` (feat)
2. **Task 2: Add worker tracking variables and start calls** - `00f06df` (feat)
3. **Task 3: Add shutdown handlers** - `12e1004` (feat)

## Files Created/Modified

- `src/index.ts` - Added 6 worker imports, 4 tracking variables, 4 start calls, 6 shutdown handlers

## Decisions Made

- **Const export pattern for metricsCollectionWorker and autoTuningWorker:** These workers are instantiated at import time and auto-start, following the pattern established by holidayCheckWorker
- **Lazy-start pattern for remaining 4 workers:** reviewPollWorker, reviewReminderWorker, invoicePollWorker, reviewRequestWorker use start functions for controlled lifecycle management

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All workers from Phases 5, 6, and 8 are now operational
- Review polling runs hourly to detect new Google reviews
- Invoice polling runs hourly to detect Greeninvoice/iCount invoices
- Review request worker sends WhatsApp review requests after 24h delay
- Metrics collection aggregates GBP metrics weekly
- Auto-tuning optimizes review timing weekly
- Ready for Phase 10 (Setup & Billing) and production deployment

---
*Phase: 11-worker-registration*
*Completed: 2026-01-30*
