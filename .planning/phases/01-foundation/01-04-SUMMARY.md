---
phase: 01-foundation
plan: 04
subsystem: queue-infrastructure
tags: [bullmq, redis, ioredis, workers, webhooks, async-processing]

# Dependency graph
requires: [01-01]
provides:
  - Redis connection management for BullMQ
  - Webhook queue for external service webhooks
  - Scheduled jobs queue for recurring tasks
  - Notification and activity queues
  - Webhook and scheduled job workers
affects: [02-whatsapp, 03-voicenter, 04-gbp, 05-review-automation, all-phases]

# Tech tracking
tech-stack:
  added: []
  patterns: [queue-first webhook processing, exponential backoff retry, separate queue connections]

key-files:
  created:
    - src/lib/redis.ts
    - src/queue/queues.ts
    - src/queue/index.ts
    - src/queue/workers/webhook.worker.ts
    - src/queue/workers/test.worker.ts
  modified: []

key-decisions:
  - "maxRetriesPerRequest: null for BullMQ compatibility with blocking commands"
  - "Separate Redis connections for each queue/worker (BullMQ requirement)"
  - "Exponential backoff starting at 1 second (1s, 2s, 4s, 8s, 16s)"
  - "Keep completed jobs 24 hours, failed jobs 7 days for debugging"
  - "Four separate queues: webhooks, scheduled, notifications, activity"
  - "Webhook worker concurrency: 5, Scheduled worker concurrency: 3"

patterns-established:
  - "Queue definitions in src/queue/queues.ts with type-safe job interfaces"
  - "Workers in src/queue/workers/ with startXxxWorker() factory functions"
  - "Redis connection via createRedisConnection() for queue/worker instances"
  - "Webhook routing by source in worker switch statement"

# Metrics
duration: 4.5min
completed: 2026-01-27
---

# Phase 01 Plan 04: BullMQ Queue Infrastructure Summary

**Redis connection with BullMQ-compatible settings (maxRetriesPerRequest: null), four queues (webhooks, scheduled, notifications, activity) with exponential backoff retry, and webhook/scheduled workers ready for async processing**

## Performance

- **Duration:** 4.5 min
- **Started:** 2026-01-27T14:32:59Z
- **Completed:** 2026-01-27T14:37:27Z
- **Tasks:** 3/3
- **Files created:** 5

## Accomplishments

- Created Redis connection management with Upstash TLS support and BullMQ-compatible settings
- Defined four BullMQ queues with type-safe job interfaces for webhooks, scheduled jobs, notifications, and activity
- Implemented webhook worker with routing by source and test handler integration
- Implemented scheduled worker with test and placeholder handlers for future phases
- Configured exponential backoff retry strategy (1s base, 5 attempts for most queues)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Redis connection for BullMQ** - `c11d508` (feat)
2. **Task 2: Create BullMQ queue definitions** - `f03e1f4` (feat)
3. **Task 3: Create webhook and test workers** - `2f0413b` (feat)

## Files Created

- `src/lib/redis.ts` - Redis connection management with URL parsing, TLS detection, BullMQ settings
- `src/queue/queues.ts` - Queue definitions (webhookQueue, scheduledQueue, notificationQueue, activityQueue) with job type interfaces
- `src/queue/index.ts` - Central export for queues and job types
- `src/queue/workers/webhook.worker.ts` - Webhook processing worker with source routing
- `src/queue/workers/test.worker.ts` - Scheduled job worker with test and placeholder handlers

## Decisions Made

1. **maxRetriesPerRequest: null** - Required for BullMQ blocking commands (BLPOP/BRPOP)
2. **Separate Redis connections** - BullMQ requires separate connections for queues and workers (cannot share)
3. **Exponential backoff** - 1s base delay with 5 attempts gives reasonable retry window (1+2+4+8+16 = 31s total)
4. **Job retention** - 24h/1000 for completed (debugging), 7 days for failed (investigation)
5. **Four queue types** - Separate queues allow independent scaling, monitoring, and priority management
6. **Worker concurrency** - 5 for webhooks (IO-bound), 3 for scheduled (may be CPU-bound)

## Deviations from Plan

None - plan executed exactly as written. The webhook worker was simplified compared to the plan template since the tenant-context middleware and activity_events schema already exist from previous phases.

## Issues Encountered

None - all TypeScript compilation passed on first attempt.

## Queue Architecture Overview

```
External Services
     |
     v
[webhook endpoint] --> [webhookQueue] --> [webhookWorker]
                                               |
                                               v
                                        [activityQueue] --> [activityWorker*]

[scheduler] --> [scheduledQueue] --> [scheduledWorker]

[API/System] --> [notificationQueue] --> [notificationWorker*]

* Workers to be implemented in future phases
```

## Next Phase Readiness

- Queue infrastructure ready for Phase 2 (WhatsApp) webhook processing
- Workers can be extended with actual business logic in Phase 3+ implementations
- Test handlers available for Phase 1 end-to-end verification
- All queues have type-safe job interfaces for IDE autocomplete

---
*Phase: 01-foundation*
*Completed: 2026-01-27*
