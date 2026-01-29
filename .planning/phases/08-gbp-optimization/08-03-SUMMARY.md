---
phase: 08-gbp-optimization
plan: 03
subsystem: services
tags: [metrics, optimization, baseline, worker, scheduler, drizzle]

# Dependency graph
requires:
  - phase: 08-01-optimization-schema
    provides: metricSnapshots, tenantBaselines tables
  - phase: 08-02-performance-api
    provides: getPerformanceMetrics, getMediaMetrics, dateRangeForWeek
  - phase: 05-review-management
    provides: processedReviews table for review metrics
  - phase: 06-review-requests
    provides: reviewRequests table for conversion metrics
provides:
  - Metrics collector service with weekly aggregation
  - Dynamic baseline calculation from 4-8 weeks of data
  - Batch processing for all active tenants
  - Scheduled worker for automatic weekly collection
affects: [08-04, 08-05, 08-06, 08-07]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Moving average baseline calculation"
    - "Upsert with ON CONFLICT for idempotent snapshots"
    - "Rate limited batch processing (100ms between tenants)"

key-files:
  created:
    - src/services/optimization/metrics-collector.ts
    - src/services/optimization/index.ts
    - src/queue/workers/metrics-collection.worker.ts
  modified:
    - src/scheduler/jobs.ts
    - src/queue/queues.ts

key-decisions:
  - "Monday 2:00 AM for metrics collection - captures full Sun-Sat week"
  - "4+ weeks required for baseline calculation - statistical validity"
  - "Moving average across 8 weeks max - recent data weighted equally"

patterns-established:
  - "Metrics collection pattern: batch all tenants with rate limiting"
  - "Baseline calculation: require minimum samples before setting"

# Metrics
duration: 6min
completed: 2026-01-29
---

# Phase 08 Plan 03: Metrics Collection Summary

**Weekly metrics collector service with batch tenant processing, dynamic baseline calculation from 4-8 weeks of data, and scheduled Monday 2:00 AM collection job**

## Performance

- **Duration:** 6 min
- **Started:** 2026-01-29T18:39:33Z
- **Completed:** 2026-01-29T18:45:23Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments
- Created metrics-collector.ts with collectMetricsForTenant, calculateBaseline, collectMetricsForAllTenants
- Worker processes 'metrics-collection' jobs from scheduled queue with single concurrency
- Scheduled job runs weekly Monday 2:00 AM Israel time to capture full week data
- Baseline uses moving average from 4-8 weeks of metricSnapshots

## Task Commits

Each task was committed atomically:

1. **Task 1: Create metrics collector service** - `ba815a5` (feat)
2. **Task 2: Create metrics collection worker** - `94a35ba` (feat)
3. **Task 3: Register scheduled job for weekly collection** - `f97e3e3` (feat)

## Files Created/Modified
- `src/services/optimization/metrics-collector.ts` - Core metrics collection and baseline calculation
- `src/services/optimization/index.ts` - Service exports
- `src/queue/workers/metrics-collection.worker.ts` - BullMQ worker for scheduled processing
- `src/scheduler/jobs.ts` - Added metrics-collection job registration
- `src/queue/queues.ts` - Added 'metrics-collection' to ScheduledJobData type

## Decisions Made
- **Monday 2:00 AM collection time** - Captures complete Sun-Sat week data before processing
- **4+ weeks required for baseline** - Ensures statistical validity before setting baseline
- **8 weeks max for baseline calculation** - Moving average uses recent data (not entire history)
- **100ms delay between tenants** - Rate limit protection consistent with other batch workers

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Metrics collection pipeline ready for GBPO-01/02/03 monitoring
- Baseline calculation ready for alert threshold comparisons
- Worker integration ready for 08-07 (Worker Registration)
- Dashboard can query metricSnapshots for trend visualization (08-06)

---
*Phase: 08-gbp-optimization*
*Completed: 2026-01-29*
