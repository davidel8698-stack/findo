---
phase: 09-dashboard-notifications
plan: 01
subsystem: database
tags: [schema, notification-preferences, chatbot-config, drizzle]

dependency_graph:
  requires:
    - phase-01 tenants schema
  provides:
    - notificationPreferences table
    - chatbotConfig table
    - ChatbotQuestion interface
  affects:
    - 09-02 settings API endpoints
    - 09-05 notification delivery logic

tech_stack:
  added: []
  patterns:
    - JSONB with TypeScript type safety
    - Unique tenant constraint pattern
    - Default values for opt-out preferences

key_files:
  created:
    - src/db/schema/notification-preferences.ts
    - src/db/schema/chatbot-config.ts
  modified:
    - src/db/schema/index.ts

decisions:
  - decision: "10 boolean notification flags with sensible defaults"
    rationale: "Per CONTEXT.md: granular notification preferences with opt-out per type"
  - decision: "JSONB for chatbot questions with ChatbotQuestion interface"
    rationale: "Flexible structure for add/edit/reorder while maintaining type safety"
  - decision: "Default Hebrew questions for all business types"
    rationale: "Per CONTEXT.md: defaults work for all businesses, owner customizes as needed"

metrics:
  duration: ~4 min
  completed: 2026-01-29
---

# Phase 9 Plan 1: Database Schema - Notification Preferences & Chatbot Config Summary

**One-liner:** Notification preferences table with 10 boolean flags and chatbot config with JSONB questions array for customizable lead qualification.

## What Was Built

### Notification Preferences Table (`notification_preferences`)
- Unique constraint on tenantId (one row per tenant)
- Boolean flags grouped by category:
  - **Lead notifications:** notifyNewLead, notifyLeadQualified, notifyLeadUnresponsive
  - **Review notifications:** notifyNewReview, notifyNegativeReview, notifyReviewPosted
  - **Content notifications:** notifyPhotoRequest, notifyPostApproval
  - **System notifications:** notifySystemAlert, notifyWeeklyReport
- Sensible defaults: mostly true for important notifications, false for less important (reviewPosted)
- Type exports: NotificationPreferences, NewNotificationPreferences

### Chatbot Config Table (`chatbot_config`)
- Unique constraint on tenantId (one row per tenant)
- JSONB `questions` column with ChatbotQuestion[] type
- ChatbotQuestion interface: id, text, expectedType, order, isRequired, isActive
- Default Hebrew questions:
  1. "איך קוראים לך?" (name, text, required)
  2. "במה אוכל לעזור לך?" (need, text, required)
  3. "מתי נוח לך שנחזור אליך?" (preference, text, optional)
- Type exports: ChatbotConfig, NewChatbotConfig, ChatbotQuestion

### Schema Index Updates
- Both new schemas exported from `src/db/schema/index.ts`

## Deviations from Plan

None - plan executed exactly as written.

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| 10 boolean flags with defaults | Per CONTEXT.md granular preferences with opt-out model |
| JSONB for questions array | Flexible for add/edit/reorder, $type for type safety |
| Default Hebrew questions | Work for all business types, customizable per tenant |
| negativeReview default true | Always notify owner for approval flow |
| reviewPosted default false | Less important, owner can opt-in |

## Commits

| Hash | Message |
|------|---------|
| bd8a405 | feat(09-01): create notification preferences schema |
| 97dff1c | feat(09-01): create chatbot config schema |
| 09876e9 | feat(09-01): export notification preferences and chatbot config from schema index |

## Verification

- [x] `npx tsc --noEmit` - full project compiles
- [x] notification-preferences.ts has 10 boolean notification flags
- [x] chatbot-config.ts has JSONB questions column
- [x] Both tables have unique tenant constraint
- [x] Both exported from schema/index.ts

## Next Phase Readiness

**Ready for 09-02:** Settings API endpoints can now use these schemas for CRUD operations.

**Dependencies satisfied:**
- NotificationPreferences and NewNotificationPreferences types available
- ChatbotConfig, NewChatbotConfig, ChatbotQuestion types available
- Default chatbot questions exported for seeding
