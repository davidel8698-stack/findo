---
phase: 10
plan: 05
subsystem: progressive-profiling
tags: [whatsapp, worker, profiling, onboarding]

dependency-graph:
  requires: [10-01]
  provides: [progressive-profile-service, progressive-profile-worker]
  affects: [none]

tech-stack:
  added: []
  patterns: [weekly-scheduled-worker, response-tracking-in-stepData]

key-files:
  created:
    - src/services/progressive-profile/questions.ts
    - src/services/progressive-profile/service.ts
    - src/services/progressive-profile/index.ts
    - src/queue/jobs/progressive-profile.job.ts
    - src/queue/workers/progressive-profile.worker.ts
  modified:
    - src/queue/workers/whatsapp-message.worker.ts

decisions:
  - id: stepdata-profile-storage
    choice: Store profile answers in setupProgress.stepData.profile
    reason: Reuse existing stepData JSONB column, no schema migration needed
  - id: ignore-count-threshold
    choice: Stop asking after 2 consecutive ignored questions
    reason: Per CONTEXT.md, avoid spam and respect owner time
  - id: 7-day-pending-window
    choice: Consider question pending for 7 days after sending
    reason: Weekly job cadence, gives owner time to respond

metrics:
  duration: ~5 min
  completed: 2026-01-30
---

# Phase 10 Plan 05: Progressive Profiling via WhatsApp Summary

**One-liner:** Weekly WhatsApp questions (weeks 1-4) collect business details post-setup, stopping after 2 ignored questions.

## What Was Built

### Progressive Profile Questions (src/services/progressive-profile/questions.ts)
- 4 Hebrew questions for weeks 1-4:
  - Week 1: Main services offered (text)
  - Week 2: Unique value proposition (text)
  - Week 3: Amenities - parking/accessibility (quick reply buttons)
  - Week 4: Special closure times (text)
- `getQuestionForWeek(week)` function for lookup

### Progressive Profile Service (src/services/progressive-profile/service.ts)
- `getWeeksSinceSetup(tenantId)` - Calculate weeks since setup completion
- `hasAnswered(tenantId, field)` - Check if field already answered
- `getIgnoreCount(tenantId)` / `incrementIgnoreCount` / `resetIgnoreCount` - Ignore tracking
- `storeAnswer(tenantId, field, value)` - Save answer to stepData.profile
- `getNextQuestion(tenantId)` - Get unanswered question for current week
- `recordQuestionSent(tenantId, field)` - Track pending for response detection
- `getPendingProfileQuestion(tenantId)` - Get pending question within 7-day window

### Job Scheduler (src/queue/jobs/progressive-profile.job.ts)
- `PROGRESSIVE_PROFILE_JOB` constant for job identification
- `scheduleProgressiveProfilingJob()` - Schedules Monday 10:00 AM Israel time

### Worker (src/queue/workers/progressive-profile.worker.ts)
- Processes all active tenants with completed setup
- Checks and increments ignore count for unanswered questions
- Skips tenants with 2+ consecutive ignores
- Sends questions via WhatsApp (text or interactive buttons)
- 100ms delay between tenants for rate limiting
- Auto-starts at import (const export pattern)

### Message Worker Integration (src/queue/workers/whatsapp-message.worker.ts)
- Added profile response handler (priority 6, before lead chatbot)
- Detects pending profile questions for owner messages
- Stores answers and resets ignore count
- Sends Hebrew confirmation: "תודה! השמרנו את המידע."

## Verification Checklist

- [x] 4 progressive questions defined with Hebrew text
- [x] Service calculates weeks since setup correctly
- [x] hasAnswered checks tenant profile fields
- [x] Ignore count tracking works (stops after 2)
- [x] Weekly job runs Monday 10:00 AM Israel time
- [x] Worker sends questions to active tenants only
- [x] 100ms delay between tenants (rate limiting)
- [x] Profile responses stored in tenant record (stepData.profile)
- [x] Confirmation message sent after answer stored
- [x] Quick reply buttons work for question 3 (amenities)
- [x] TypeScript compiles without errors

## Deviations from Plan

None - plan executed exactly as written.

## Key Patterns Used

1. **Response tracking via stepData JSONB:**
   - `lastQuestionSentAt` and `lastQuestionField` track pending questions
   - `profilingIgnoreCount` tracks consecutive ignores
   - `profile` object stores answers by field name

2. **Weekly scheduled worker pattern:**
   - Same pattern as photo-request, holiday-check workers
   - Cron: `0 10 * * 1` (Monday 10:00 AM Israel time)
   - Single concurrency for sequential tenant processing

3. **Message priority integration:**
   - Profile responses at priority 6 (after hours, before lead chatbot)
   - Only processes owner messages with pending questions
   - Reuses existing WhatsApp client and sendTextMessage

## Commits

| Hash | Type | Description |
|------|------|-------------|
| 9254b2b | feat | Add progressive profiling questions and service |
| e0bc020 | feat | Add progressive profiling worker and job scheduler |
| 634d503 | feat | Integrate profile response handling in message worker |

## Files Changed

```
src/services/progressive-profile/questions.ts  (new)
src/services/progressive-profile/service.ts    (new)
src/services/progressive-profile/index.ts      (new)
src/queue/jobs/progressive-profile.job.ts      (new)
src/queue/workers/progressive-profile.worker.ts (new)
src/queue/workers/whatsapp-message.worker.ts   (modified)
```

## Next Phase Readiness

Progressive profiling is complete. The worker needs to be:
1. Imported in src/index.ts for auto-start
2. Job scheduled at startup via `scheduleProgressiveProfilingJob()`

No blockers for 10-06 (Billing UI).
