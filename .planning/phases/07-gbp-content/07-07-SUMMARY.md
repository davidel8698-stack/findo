---
phase: 07-gbp-content
plan: 07
subsystem: infra
tags: [bullmq, workers, lifecycle, shutdown, graceful]

# Dependency graph
requires:
  - phase: 07-01
    provides: photoRequests schema and photo-request.worker.ts
  - phase: 07-02
    provides: photo-upload.worker.ts
  - phase: 07-04
    provides: monthly-post.worker.ts
  - phase: 07-05
    provides: post-approval.worker.ts
  - phase: 07-06
    provides: holiday-check.worker.ts
provides:
  - Worker registration in src/index.ts
  - All Phase 7 workers started on application boot
  - Graceful shutdown cleanup for all Phase 7 workers
affects: [08-dashboard, 09-analytics, deployment]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Worker registration pattern (import, track, start, cleanup)
    - Dual-worker cleanup for postApprovalWorker
    - Import-time instantiation for holidayCheckWorker

key-files:
  created: []
  modified:
    - src/index.ts

key-decisions:
  - "holidayCheckWorker imported as already-instantiated worker (not lazy-started)"
  - "postApprovalWorker returns dual workers requiring separate cleanup"

patterns-established:
  - "Phase 7 workers follow same registration pattern as Phases 1-6 workers"
  - "Workers requiring multiple cleanup calls handled explicitly"

# Metrics
duration: 3min
completed: 2026-01-29
---

# Phase 7 Plan 07: Worker Registration Summary

**Register all Phase 7 GBP Content workers in src/index.ts for photo requests, uploads, monthly posts, approval workflows, and holiday checks**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-01-29T13:58:17Z
- **Completed:** 2026-01-29T14:01:xx
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments
- Registered 5 Phase 7 workers in application entry point
- All workers now start when server starts (4 lazy-started, 1 at import)
- Graceful shutdown properly cleans up all workers before Redis close
- TypeScript compiles without errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Register Phase 7 workers in src/index.ts** - `a7efeea` (feat)

## Files Created/Modified
- `src/index.ts` - Added 5 worker imports, 4 tracking variables, 4 start calls, 6 cleanup blocks

## Decisions Made
- `holidayCheckWorker` is imported as already-instantiated worker (not a start function)
- `postApprovalWorker` returns `{ notificationWorker, scheduledWorker }` requiring separate cleanup calls

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required. All Phase 7 workers use existing environment variables (REDIS_URL, DATABASE_URL, etc.) configured in earlier phases.

## Next Phase Readiness
- Phase 7 GBP Content is now fully operational
- All workers start and process jobs from scheduled queue
- Ready for Phase 8 (Dashboard) or Phase 9 (Analytics)
- No blockers

---
*Phase: 07-gbp-content*
*Completed: 2026-01-29*
