---
phase: 07-gbp-content
plan: 04
subsystem: api
tags: [gbp, google-api, bullmq, whatsapp, scheduled-jobs, posts]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: Queue infrastructure, BullMQ workers, Redis
  - phase: 04-google-integration
    provides: Google OAuth, createAuthenticatedClient
  - phase: 07-01
    provides: GBP content schema (postRequests table already created)
provides:
  - GBP posts API service (createPost, listPosts, deletePost)
  - Monthly post request worker with compelling messaging
  - Scheduled job for 1st of month post requests
affects: [07-05, 07-06, owner-notifications]

# Tech tracking
tech-stack:
  added: []
  patterns: [monthly-scheduled-worker, gbp-posts-api]

key-files:
  created:
    - src/services/google/posts.ts
    - src/queue/workers/monthly-post.worker.ts
  modified:
    - src/db/schema/gbp-content.ts
    - src/services/google/index.ts
    - src/queue/queues.ts
    - src/scheduler/jobs.ts

key-decisions:
  - "Phone number regex validation before post creation (Google policy)"
  - "1500 char limit validation with clear error message"
  - "Hebrew language code (he) for all posts"
  - "Monthly job on 1st at 10:00 AM Israel time"
  - "100ms rate limit between tenants"

patterns-established:
  - "GBP Posts API: Use My Business v4 API with createAuthenticatedClient"
  - "Monthly worker: Follow photo-request.worker pattern with idempotency via month/year"

# Metrics
duration: 8min
completed: 2026-01-29
---

# Phase 07 Plan 04: Promotional Posts Schema and Worker Summary

**GBP posts service with phone number validation and monthly request worker sending compelling Hebrew messages about post benefits**

## Performance

- **Duration:** 8 min
- **Started:** 2026-01-29T11:42:11Z
- **Completed:** 2026-01-29T11:50:24Z
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments

- GBP posts service with phone number and character limit validation
- Monthly post request worker with compelling Hebrew messaging
- Scheduled job for 1st of each month at 10:00 AM Israel time
- Idempotent post request creation via month/year check

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend Schema with Post Requests Table** - `e041de7` (already existed from 07-01)
2. **Task 2: Create GBP Posts Service** - `9053215` (feat)
3. **Task 3: Create Monthly Post Request Worker** - `aec6122` (feat)

## Files Created/Modified

- `src/db/schema/gbp-content.ts` - Added postRequests table, postRequestStatusEnum, postTypeEnum (was already in 07-01)
- `src/services/google/posts.ts` - GBP posts API with createPost, listPosts, deletePost
- `src/services/google/index.ts` - Export posts service functions and types
- `src/queue/workers/monthly-post.worker.ts` - Monthly post request worker
- `src/queue/queues.ts` - Added 'monthly-post' to ScheduledJobData type
- `src/scheduler/jobs.ts` - Scheduled monthly-post job

## Decisions Made

- **Phone number validation regex:** `\d{2,3}[-.\s]?\d{7}|\d{10}` catches Israeli formats
- **Character limit:** 1500 chars max per Google policy, clear error message
- **Message content:** Compelling statistics (35% more views) with clear options
- **Three response options:** Provide content, request AI, or skip
- **100ms rate limit:** Consistent with other workers (photo-request pattern)

## Deviations from Plan

### Auto-recognized Issues

**1. [Existing Work] Schema already created in 07-01**
- **Found during:** Task 1 (Schema extension)
- **Issue:** postRequests table was already created as part of commit e041de7 in 07-01
- **Resolution:** Verified table exists with correct structure, no additional work needed
- **Impact:** None - plan noted this possibility

---

**Total deviations:** 1 (recognized existing work)
**Impact on plan:** None - plan explicitly noted schema may exist from 07-01

## Issues Encountered

None - execution proceeded smoothly.

## User Setup Required

None - no external service configuration required. Uses existing Google OAuth connection.

## Next Phase Readiness

- Posts service ready for 07-05 (Post Response Handler)
- Worker ready for 07-06 (Post Approval Flow)
- Monthly scheduling ready for production deployment
- Requires active WhatsApp AND Google connections per tenant

---
*Phase: 07-gbp-content*
*Completed: 2026-01-29*
