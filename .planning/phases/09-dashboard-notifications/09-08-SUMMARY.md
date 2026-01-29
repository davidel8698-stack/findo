---
phase: 09-dashboard-notifications
plan: 08
subsystem: notifications
tags: [notification-preferences, whatsapp, notification-gate]

dependency-graph:
  requires:
    - "09-01" # notification preferences schema
    - "09-06" # settings pages (preference management UI)
  provides:
    - "Notification preference enforcement"
    - "NotificationType enum"
    - "shouldNotify service"
  affects:
    - All WhatsApp notification workers

tech-stack:
  patterns:
    - "Gate pattern for notification control"
    - "In-memory caching with TTL"
    - "Preference-aware notification dispatch"

key-files:
  created:
    - src/services/notification-gate.ts
  modified:
    - src/services/lead-capture/notifications.ts
    - src/services/review-management/approval-flow.ts
    - src/services/review-management/response-handler.ts
    - src/queue/workers/photo-request.worker.ts
    - src/queue/workers/post-approval.worker.ts
    - src/services/optimization/auto-tuner.ts
    - src/services/optimization/alert-detector.ts

decisions:
  - id: notification-gate-pattern
    choice: "Centralized shouldNotify service"
    rationale: "Single point for preference enforcement across all workers"
  - id: negative-review-always-on
    choice: "NEGATIVE_REVIEW always returns true in shouldNotify"
    rationale: "Critical for approval flow - owner must approve negative review responses"
  - id: preference-caching
    choice: "1-minute in-memory cache for preferences"
    rationale: "Avoid repeated DB queries during burst notifications"
  - id: skip-with-log
    choice: "Log when notification skipped due to preference"
    rationale: "Debugging and monitoring notification behavior"

metrics:
  duration: "6 min"
  completed: "2026-01-29"
---

# Phase 09 Plan 08: Notification Preference Integration Summary

**One-liner:** Notification gate service with preference checks integrated into all WhatsApp notification workers.

## What Was Built

### Notification Gate Service (`src/services/notification-gate.ts`)

Created a centralized service for checking notification preferences:

1. **NotificationType enum** - Covers all notification types:
   - `NEW_LEAD`, `LEAD_QUALIFIED`, `LEAD_UNRESPONSIVE`
   - `NEW_REVIEW`, `NEGATIVE_REVIEW`, `REVIEW_POSTED`
   - `PHOTO_REQUEST`, `POST_APPROVAL`
   - `SYSTEM_ALERT`, `WEEKLY_REPORT`

2. **shouldNotify(tenantId, type)** - Main preference check:
   - Queries notificationPreferences for tenant
   - Creates default record if none exists
   - Maps NotificationType to preference column
   - Returns boolean value
   - **Special case:** NEGATIVE_REVIEW always returns true

3. **Preference caching** - 1-minute TTL to avoid DB overhead

4. **Helper exports:**
   - `getNotificationPreferences(tenantId)` - Full preference record
   - `clearPreferencesCache(tenantId)` - Cache invalidation

### Integration Points

All notification workers now check preferences before sending:

| Worker/Service | Notification Type | Behavior |
|----------------|-------------------|----------|
| Lead notifications | NEW_LEAD / LEAD_QUALIFIED | Skip if disabled |
| Review approval | NEGATIVE_REVIEW | Always sends (critical) |
| Review approval | NEW_REVIEW | Skip if disabled |
| Review posted | REVIEW_POSTED | Skip confirmation if disabled |
| Photo request | PHOTO_REQUEST | Create record but skip WhatsApp |
| Post approval | POST_APPROVAL | Skip, auto-publish after timeout |
| Weekly summary | WEEKLY_REPORT | Skip summary for tenant |
| System alerts | SYSTEM_ALERT | Skip alert if disabled |

## Commits

| Hash | Message |
|------|---------|
| 1b7a8c2 | feat(09-08): create notification gate service |
| a435888 | feat(09-08): add preference checks to lead and review notifications |
| 17281cb | feat(09-08): add preference checks to content and system notifications |

## Verification Results

- [x] `npx tsc --noEmit` - Full project compiles
- [x] NotificationType enum covers all notification types
- [x] shouldNotify correctly queries preferences
- [x] All notification workers import and use shouldNotify
- [x] Disabled preferences result in skipped notifications
- [x] Negative review always notifies (safety requirement)
- [x] Workers log when notifications are skipped

## Deviations from Plan

None - plan executed exactly as written.

## Testing Notes

To test notification preferences:

1. Create tenant with specific preferences disabled (e.g., `notifyNewLead=false`)
2. Trigger the notification event (e.g., new lead from missed call)
3. Verify no WhatsApp sent, log shows "Skipping notification (preference disabled)"
4. Enable preference, trigger again, verify WhatsApp sent

## Next Phase Readiness

This plan completes the notification preference integration. The settings pages from 09-06 already provide UI for managing these preferences. The full notification preference flow is:

1. Owner toggles preference in Settings > Notifications tab
2. Settings service updates database
3. Notification gate checks preference on each notification
4. WhatsApp only sent if preference enabled

No blockers for proceeding.
