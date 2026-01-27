---
phase: 01-foundation
plan: 06
subsystem: scheduler
tags: [bullmq, cron, recurring-jobs, activity-feed, redis-pubsub, workers]

# Dependency graph
requires:
  - phase: 01-04
    provides: BullMQ queue infrastructure (scheduledQueue, activityQueue)
provides:
  - Activity feed worker with Redis pub/sub for real-time dashboard
  - Job scheduler for recurring tasks (hourly, daily, weekly)
  - Test jobs for Phase 1 verification
  - subscribeToActivityFeed helper for SSE endpoint
affects: [02-whatsapp, 03-voicenter, 04-gbp, 05-review-automation, 09-dashboard]

# Tech tracking
tech-stack:
  added: []
  patterns: [cron scheduling with timezone, pub/sub for real-time updates, tenant-isolated channels]

key-files:
  created:
    - src/queue/workers/activity.worker.ts
    - src/scheduler/jobs.ts
    - src/scheduler/index.ts
  modified: []

key-decisions:
  - "Activity worker concurrency: 10 (lightweight pub/sub operations)"
  - "Tenant-specific pub/sub channels: activity:tenant:{id} pattern"
  - "All scheduled jobs use Asia/Jerusalem timezone for Israeli business hours"
  - "Daily/weekly jobs at 10:00 AM (after morning rush)"
  - "Weekly jobs on Sunday (start of Israeli work week)"
  - "Test jobs enabled only in non-production for verification"

patterns-established:
  - "Scheduler exports initializeScheduler() called at app startup"
  - "Job definitions in src/scheduler/jobs.ts with scheduleXxxJobs() functions"
  - "Activity pub/sub via tenant-specific Redis channels"
  - "subscribeToActivityFeed returns cleanup function for SSE lifecycle"

# Metrics
duration: 4min
completed: 2026-01-27
---

# Phase 01 Plan 06: Background Job Scheduler Summary

**Activity feed worker with Redis pub/sub for real-time dashboard updates, and recurring job scheduler with hourly (review-check, token-refresh), daily (digest), and weekly (photo-request) jobs using Israel timezone**

## Performance

- **Duration:** 4 min
- **Started:** 2026-01-27
- **Completed:** 2026-01-27
- **Tasks:** 2/3 (Task 3 deferred to 01-05 per instructions)
- **Files created:** 3

## Accomplishments

- Created activity feed worker that processes events and publishes to tenant-specific Redis pub/sub channels
- Implemented job scheduler with production recurring jobs (review-check, token-refresh, photo-request, daily-digest)
- Added test jobs (hourly, daily, weekly) for Phase 1 verification of scheduling
- Provided subscribeToActivityFeed helper for future SSE endpoint implementation
- All jobs use Asia/Jerusalem timezone for Israeli business context

## Task Commits

Each task was committed atomically:

1. **Task 1: Create activity feed worker** - `947aa17` (feat)
2. **Task 2: Create job scheduler and job definitions** - `4d8e7e3` (feat)
3. **Task 3: Integrate into main app** - Deferred to plan 01-05

## Files Created

- `src/queue/workers/activity.worker.ts` - Activity worker with Redis pub/sub, startActivityWorker(), subscribeToActivityFeed()
- `src/scheduler/jobs.ts` - Job definitions: scheduleTestJobs(), scheduleRecurringJobs(), removeTestJobs(), listScheduledJobs()
- `src/scheduler/index.ts` - Central export with initializeScheduler() for app startup

## Decisions Made

1. **Activity worker concurrency: 10** - Activity events are lightweight pub/sub operations, high concurrency is appropriate
2. **Tenant-specific channels** - `activity:tenant:{id}` pattern ensures tenant isolation for real-time feeds
3. **Israel timezone for all jobs** - Asia/Jerusalem timezone per CONTEXT.md for Israeli market
4. **10:00 AM for daily/weekly** - After morning rush per CONTEXT.md guidance
5. **Sunday for weekly jobs** - Start of Israeli work week (Sunday-Thursday)
6. **subscribeToActivityFeed returns cleanup** - Enables proper SSE connection lifecycle management

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed TypeScript error in listScheduledJobs**
- **Found during:** Task 2 (Job scheduler implementation)
- **Issue:** `job.next` can be undefined in BullMQ types, causing TypeScript error with `new Date(job.next)`
- **Fix:** Added null check: `job.next ? new Date(job.next).toISOString() : 'unknown'`
- **Files modified:** src/scheduler/jobs.ts
- **Verification:** TypeScript compiles without errors
- **Committed in:** 4d8e7e3 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Minor type safety fix required for correct compilation. No scope creep.

## Issues Encountered

None - TypeScript compilation passed after fixing the type issue.

## User Setup Required

None - scheduler uses existing REDIS_URL environment variable from plan 01-04.

## Next Phase Readiness

- Scheduler and activity worker ready for integration in plan 01-05 (main app startup)
- Activity feed pub/sub ready for SSE endpoint in dashboard phase
- Test jobs enable verification of scheduling in Phase 1 completion tests
- All production job slots defined (handlers to be implemented in later phases)

## Scheduled Jobs Overview

| Job | Frequency | Time | Purpose |
|-----|-----------|------|---------|
| review-check | Hourly | :00 | Poll for new Google reviews |
| token-refresh | Every 30 min | :00, :30 | Proactive OAuth token refresh |
| photo-request | Weekly | Sunday 10:00 AM | Request business photos via WhatsApp |
| daily-digest | Daily | 10:00 AM | Send activity summary to owners |
| test-hourly | Hourly | :00 | Phase 1 verification |
| test-daily | Daily | 10:00 AM | Phase 1 verification |
| test-weekly | Weekly | Sunday 10:00 AM | Phase 1 verification |

---
*Phase: 01-foundation*
*Completed: 2026-01-27*
