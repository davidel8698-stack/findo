---
phase: 07-gbp-content
plan: 01
subsystem: workers
tags: [bullmq, whatsapp, gbp, photos, scheduler, drizzle]

# Dependency graph
requires:
  - phase: 02-whatsapp-integration
    provides: WhatsApp client and messaging functions
  - phase: 04-google-integration
    provides: Google connections table for GBP status
provides:
  - photoRequests table for weekly photo request tracking
  - gbpPhotos table for GBP photo uploads
  - photo-request.worker.ts for weekly photo requests
  - photo-reminder scheduled job for follow-up
affects: [07-gbp-content (remaining plans), 08-analytics]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - ISO week number calculation for deduplication
    - Weekly request with 2-day reminder flow
    - Multi-connection check (WhatsApp AND Google)

key-files:
  created:
    - src/db/schema/gbp-content.ts
    - src/queue/workers/photo-request.worker.ts
  modified:
    - src/db/schema/index.ts
    - src/scheduler/jobs.ts
    - src/queue/queues.ts

key-decisions:
  - "Thursday 10:00 AM for photo request (end of Israeli work week)"
  - "Saturday 10:00 AM for reminder (2 days after request)"
  - "7-day expiration window for photo requests"
  - "Require both WhatsApp AND Google connection for photo requests"
  - "ISO week number for idempotency (unique constraint)"

patterns-established:
  - "ISO week calculation for weekly deduplication"
  - "Multi-connection gating (tenant must have both providers active)"

# Metrics
duration: 5min
completed: 2026-01-29
---

# Phase 7 Plan 01: Photo Request Foundation Summary

**Weekly photo request system with photoRequests/gbpPhotos tables, Thursday request job, and Saturday reminder flow**

## Performance

- **Duration:** 5 min
- **Started:** 2026-01-29T11:41:56Z
- **Completed:** 2026-01-29T11:46:43Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments
- Created photoRequests table for weekly photo request tracking with ISO week deduplication
- Created gbpPhotos table for tracking photos uploaded to GBP
- Implemented photo-request worker sending weekly WhatsApp in Hebrew to business owners
- Added photo-reminder job for 2-day follow-up if no response
- Scheduled jobs on Thursday (request) and Saturday (reminder) at 10:00 AM Israel time

## Task Commits

Each task was committed atomically:

1. **Task 1: Create GBP Content Database Schema** - `e041de7` (feat)
2. **Task 2: Implement Photo Request Worker** - `78d5639` (feat)
3. **Task 3: Add Photo Reminder Logic** - Included in `78d5639` (same worker file)

## Files Created/Modified
- `src/db/schema/gbp-content.ts` - photoRequests and gbpPhotos tables with enums
- `src/db/schema/index.ts` - Added gbp-content export
- `src/queue/workers/photo-request.worker.ts` - Photo request and reminder worker
- `src/scheduler/jobs.ts` - Scheduled jobs for photo-request and photo-reminder
- `src/queue/queues.ts` - Added photo-reminder to ScheduledJobData type

## Decisions Made
- **Thursday 10:00 AM for photo request:** End of Israeli work week, good time to ask about photos from the week
- **Saturday 10:00 AM for reminder:** 2 days after request per CONTEXT.md spec
- **7-day expiration:** Requests marked expired after week ends if no response
- **Multi-connection gating:** Only send requests to tenants with both active WhatsApp AND Google connections
- **ISO week deduplication:** Unique constraint on (tenantId, week, year) prevents duplicate requests

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all tasks completed successfully.

## User Setup Required

None - no external service configuration required. Photo requests use existing WhatsApp and Google connections.

## Next Phase Readiness
- Photo request infrastructure complete
- Ready for Plan 02: Photo upload handling (receiving photos from WhatsApp, uploading to GBP)
- photoRequests table tracks request lifecycle (sent -> received -> uploaded)
- gbpPhotos table ready for individual photo tracking

---
*Phase: 07-gbp-content*
*Completed: 2026-01-29*
