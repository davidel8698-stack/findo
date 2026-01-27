---
phase: 03-lead-capture
plan: 06
subsystem: api
tags: [bullmq, whatsapp, leads, reminders, workers]

# Dependency graph
requires:
  - phase: 03-01
    provides: leads and leadConversations schema
  - phase: 03-03
    provides: lead outreach worker that schedules reminders
  - phase: 03-04
    provides: chatbot state machine (isTerminalState, transition)
provides:
  - Lead reminder worker processing 2h and 24h reminders
  - Unresponsive lead marking after timeout
  - Activity events for unresponsive leads
affects: [lead-dashboard, lead-analytics, whatsapp-workers]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - BullMQ job name routing (send-reminder vs mark-unresponsive)
    - Activity service integration for lead events

key-files:
  created:
    - src/queue/workers/lead-reminder.worker.ts
  modified:
    - src/queue/index.ts
    - src/index.ts

key-decisions:
  - "Schedule unresponsive timeout 24h after reminder 2 (total 48h from initial message)"
  - "Use activityService.createAndPublish for lead.unresponsive events"
  - "Idempotent reminders via reminder1SentAt/reminder2SentAt checks"

patterns-established:
  - "Lead reminder job routing: send-reminder and mark-unresponsive job names"
  - "Terminal state check before any reminder action"

# Metrics
duration: 5min
completed: 2026-01-27
---

# Phase 3 Plan 06: Lead Reminder Worker Summary

**BullMQ worker for 2h/24h follow-up reminders to unresponsive leads, with automatic unresponsive marking after timeout**

## Performance

- **Duration:** 5 min
- **Started:** 2026-01-27T20:00:00Z
- **Completed:** 2026-01-27T20:05:00Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Lead reminder worker sends follow-up messages at 2h and 24h intervals
- Idempotent reminder processing (skips if already sent)
- Terminal state checking (skips reminders for completed/unresponsive leads)
- Automatic unresponsive marking after 24h timeout post-reminder 2
- Activity events created for unresponsive leads

## Task Commits

Each task was committed atomically:

1. **Task 1: Create lead reminder worker** - `be4e1f7` (feat)
2. **Task 2: Register reminder worker in queue exports and startup** - `c2a593a` (feat)

## Files Created/Modified
- `src/queue/workers/lead-reminder.worker.ts` - Worker processing lead reminders and timeout marking
- `src/queue/index.ts` - Export startLeadReminderWorker
- `src/index.ts` - Import, start, and graceful shutdown for reminder worker

## Decisions Made
- **Unresponsive timeout timing:** 24h after reminder 2, totaling 48h from initial message (24h to reminder 2, then 24h timeout)
- **Activity service integration:** Used activityService.createAndPublish() instead of non-existent createLeadActivity
- **Business name fallback:** tenant.businessName || tenant.ownerName for reminder messages

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed tenant.name to tenant.ownerName**
- **Found during:** Task 1 (Create lead reminder worker)
- **Issue:** Plan code referenced tenant.name which doesn't exist in schema
- **Fix:** Changed to tenant.ownerName based on tenants schema
- **Files modified:** src/queue/workers/lead-reminder.worker.ts
- **Verification:** TypeScript compilation passes
- **Committed in:** be4e1f7 (Task 1 commit)

**2. [Rule 3 - Blocking] Used activityService instead of createLeadActivity**
- **Found during:** Task 1 (Create lead reminder worker)
- **Issue:** Plan referenced createLeadActivity from notifications.ts which doesn't exist
- **Fix:** Used activityService.createAndPublish() from existing activity service
- **Files modified:** src/queue/workers/lead-reminder.worker.ts
- **Verification:** TypeScript compilation passes, activity events work
- **Committed in:** be4e1f7 (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (1 bug, 1 blocking)
**Impact on plan:** Both auto-fixes necessary for compilation. No scope creep.

## Issues Encountered
None - plan executed smoothly after the auto-fixes.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Lead reminder system complete (2h + 24h reminders)
- Ready for Phase 3 completion (lead capture MVP complete)
- Future: Lead dashboard, analytics, owner notification preferences

---
*Phase: 03-lead-capture*
*Completed: 2026-01-27*
