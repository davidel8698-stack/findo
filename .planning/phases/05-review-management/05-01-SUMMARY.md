---
phase: 05-review-management
plan: 01
subsystem: database
tags: [drizzle, postgres, reviews, schema, polling]

# Dependency graph
requires:
  - phase: 04-google-integration
    provides: googleConnections table for foreign key reference
  - phase: 01-foundation
    provides: tenants table for foreign key reference
provides:
  - processedReviews table for review lifecycle tracking
  - reviewPollState table for per-tenant poll timestamps
  - reviewStatusEnum with 8 lifecycle states
  - TypeScript types for ProcessedReview and ReviewPollState
affects: [05-02, 05-03, 05-04, review-poll-worker, review-management-service]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "pgEnum for status state machines (same as lead_status pattern)"
    - "Unique constraint on (tenantId, entityId) for deduplication"

key-files:
  created:
    - src/db/schema/reviews.ts
    - drizzle/0006_clammy_king_bedlam.sql
  modified:
    - src/db/schema/index.ts

key-decisions:
  - "Unique constraint on (tenantId, reviewId) prevents duplicate review processing"
  - "isPositive as integer (1/0) for simple boolean storage compatible with queries"
  - "reviewPollState with tenantId as primary key (one poll state per tenant)"

patterns-established:
  - "Review status enum follows lead_status pattern with 8 lifecycle states"
  - "Poll state tracking via separate table with lastPollAt timestamp"

# Metrics
duration: 3min
completed: 2026-01-28
---

# Phase 5 Plan 01: Review Schema Summary

**Database schema for review tracking with 8-state lifecycle enum, processedReviews table with 22 fields, and reviewPollState table for per-tenant polling**

## Performance

- **Duration:** 3 min
- **Started:** 2026-01-28T12:52:26Z
- **Completed:** 2026-01-28T12:55:25Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Created reviewStatusEnum with 8 states covering full review lifecycle (detected -> replied/expired)
- Created processedReviews table with all fields for review data, AI drafts, owner approval, and posting
- Created reviewPollState table for tracking per-tenant poll timestamps
- Added unique constraint on (tenantId, reviewId) to prevent duplicate processing
- Added indexes for status queries and approval timestamp queries
- Ran migration to create tables in database

## Task Commits

Each task was committed atomically:

1. **Task 1: Create reviews schema with review lifecycle tracking** - `a0c73c5` (feat)
2. **Task 2: Export reviews schema and run migration** - `c573303` (chore)

## Files Created/Modified
- `src/db/schema/reviews.ts` - New schema file with processedReviews, reviewPollState tables and reviewStatusEnum
- `src/db/schema/index.ts` - Added export for reviews module
- `drizzle/0006_clammy_king_bedlam.sql` - Generated migration with CREATE TABLE statements

## Decisions Made
- Used integer for isPositive (1/0) instead of boolean for simple query compatibility
- Made tenantId the primary key for reviewPollState (one poll state per tenant, not per connection)
- Used unique constraint instead of unique index for (tenantId, reviewId) - cleaner SQL and error messages

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None - drizzle-kit generate and push both succeeded on first attempt.

## User Setup Required

None - no external service configuration required. Tables created via migration.

## Next Phase Readiness
- processedReviews table ready for review detection and tracking
- reviewPollState table ready for polling timestamp management
- TypeScript types (ProcessedReview, ReviewPollState) importable from schema
- Ready for Plan 02: Review Poll Worker implementation

---
*Phase: 05-review-management*
*Completed: 2026-01-28*
