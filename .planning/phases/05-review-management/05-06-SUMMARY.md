---
phase: 05
plan: 06
subsystem: review-management
tags: [worker, scheduler, whatsapp, google, bullmq]

# Dependency graph
requires: [05-03, 05-04]
provides: [review-reminder-worker, auto-post-system]
affects: [05-05]

# Tech tracking
tech-stack:
  added: []
  patterns: [48h-reminder-escalation, auto-post-expiry, window-aware-messaging]

# File tracking
key-files:
  created:
    - src/queue/workers/review-reminder.worker.ts
  modified:
    - src/scheduler/jobs.ts
    - src/queue/queues.ts
    - src/queue/index.ts

# Decisions
decisions:
  - id: 05-06-01
    choice: "48h threshold from approvalSentAt for reminder"
    rationale: "Per CONTEXT.md: 48h reminder if owner doesn't respond"
  - id: 05-06-02
    choice: "48h threshold from reminderSentAt for auto-post"
    rationale: "Per CONTEXT.md: auto-post if still no response 48h after reminder"
  - id: 05-06-03
    choice: "Hour :30 for review-reminder job"
    rationale: "Offset from review-check at :00 to spread load"
  - id: 05-06-04
    choice: "Interactive buttons when session open, text fallback otherwise"
    rationale: "Consistent with approval-flow pattern from 05-04"
  - id: 05-06-05
    choice: "Single concurrency for review-reminder worker"
    rationale: "Rate limit protection for Google API"

# Metrics
metrics:
  duration: ~5 min
  completed: 2026-01-28
---

# Phase 05 Plan 06: Review Reminder Worker Summary

**One-liner:** 48h reminder and auto-post system for pending review approvals using BullMQ scheduled jobs.

## What Was Built

### Review Reminder Worker (`src/queue/workers/review-reminder.worker.ts`)

Worker that processes hourly review-reminder scheduled jobs:

1. **sendReminders function:**
   - Queries processedReviews where status='pending_approval', approvalSentAt < 48h ago, reminderSentAt is NULL
   - For each review needing reminder:
     - Loads tenant for ownerPhone
     - Checks session window via getOwnerWindowExpiration
     - Sends interactive buttons if window open, text fallback if closed
     - Updates status to 'reminded', sets reminderSentAt
     - Creates activity event 'review.reminder_sent'
   - Rate limits 100ms between tenants

2. **autoPostExpired function:**
   - Queries processedReviews where status='reminded', reminderSentAt < 48h ago
   - For each expired review:
     - Posts draftReply via postReviewReply to Google
     - Updates status to 'expired', sets postedReply and repliedAt
     - Notifies owner via WhatsApp about auto-post
     - Creates activity event 'review.auto_posted'
   - Rate limits 100ms between tenants

3. **Error isolation:**
   - Each review wrapped in try/catch
   - Individual failures logged but don't fail entire job

### Scheduled Job Registration (`src/scheduler/jobs.ts`)

- Added 'review-reminder' job type to ScheduledJobData
- Registered review-reminder job running hourly at minute 30
- Offset from review-check at minute 0 to spread load

### Queue Index Export (`src/queue/index.ts`)

- Exported startReviewReminderWorker for application startup

## Key Patterns

### Status Lifecycle
```
pending_approval (48h) -> reminded (48h) -> expired (auto-posted)
```

### Window-Aware Messaging
```typescript
if (isWindowOpen(windowExpiresAt)) {
  await sendInteractiveButtons(client, ownerPhone, reminderMessage, [
    { id: `approve_${review.id}`, title: 'אשר ושלח' },
    { id: `edit_${review.id}`, title: 'רוצה לערוך' },
  ]);
} else {
  const textWithInstructions = `${reminderMessage}\n\nהשב 'אשר' לאישור...`;
  await sendTextMessage(client, ownerPhone, textWithInstructions);
}
```

### Reminder Message (Hebrew)
```
תזכורת: ממתינה תשובה לביקורת (X כוכבים)

"comment preview..."

תשובה מוצעת:
"draft reply"
```

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Reminder threshold | 48h from approvalSentAt | Per CONTEXT.md requirements |
| Auto-post threshold | 48h from reminderSentAt | Total 96h before auto-post |
| Job timing | Hourly at :30 | Offset from review-check at :00 |
| Button pattern | Same as approval-flow | Consistent owner experience |
| Worker concurrency | Single | Google API rate limits |

## Deviations from Plan

None - plan executed exactly as written.

## Files Changed

| File | Change |
|------|--------|
| `src/queue/workers/review-reminder.worker.ts` | Created - reminder and auto-post worker |
| `src/scheduler/jobs.ts` | Added review-reminder job registration |
| `src/queue/queues.ts` | Added 'review-reminder' to ScheduledJobData |
| `src/queue/index.ts` | Export startReviewReminderWorker |

## Next Phase Readiness

### Immediate Next (05-05 - Owner Response Handler)
- review-reminder.worker.ts provides the reminder flow that 05-05 needs to handle
- Button IDs (approve_{id}, edit_{id}) match what 05-04 established
- Status 'reminded' is handled by 05-05 response processing

### Integration Points
- postReviewReply from src/services/google/reviews.ts for auto-posting
- sendInteractiveButtons/sendTextMessage from src/services/whatsapp/messages.ts
- activityService for audit trail events
- processedReviews schema with status lifecycle

### Testing Considerations
- Verify 48h threshold calculations
- Test window open vs closed messaging paths
- Confirm status transitions work correctly
- Test Google API error handling
