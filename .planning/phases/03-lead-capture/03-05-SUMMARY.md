---
phase: 03-lead-capture
plan: 05
subsystem: lead-capture
tags: [whatsapp, chatbot, notifications, ai]
---

# Phase 03 Plan 05: Lead Conversation Worker & Owner Notifications

**One-liner:** WhatsApp message worker extended to process lead conversations with AI intent extraction and Hebrew owner notifications.

## What Was Built

### 1. Owner Notification Service (`src/services/lead-capture/notifications.ts`)

Created owner notification service for WhatsApp-based lead alerts:

- **`formatLeadSummary()`** - Formats lead data into Hebrew structured summary:
  - Complete leads: "ליד חדש" with emoji header
  - Incomplete leads: "ליד חדש (חלקי)"
  - Clickable phone number formatted via `formatPhoneDisplay()`
  - Fields: name (שם), need (צורך), preference (העדפה)

- **`notifyOwnerOfLead()`** - Sends WhatsApp notification to owner:
  - Retrieves lead and tenant data
  - Uses tenant's `ownerPhone` field for notification
  - Creates WhatsApp client and sends formatted summary
  - Graceful failure handling (notification failure doesn't break lead flow)

- **`createLeadActivity()`** - Creates activity feed events for lead lifecycle:
  - Events: lead.created, lead.updated, lead.qualified, lead.unresponsive
  - Integrates with existing activity queue infrastructure

### 2. WhatsApp Message Worker Extension (`src/queue/workers/whatsapp-message.worker.ts`)

Extended the existing message worker to detect and handle lead conversations:

- **Lead Conversation Detection:**
  - Looks up `leadConversations` by `whatsappConversationId` after conversation window opens
  - Retrieves associated lead record for processing

- **`handleLeadConversation()` function:**
  1. Skip processing if conversation in terminal state (completed/unresponsive)
  2. Extract customer info using AI (`extractLeadInfo`)
  3. Merge extracted info with existing lead data (don't overwrite)
  4. Update lead record with new name/need/preference
  5. Determine next state using `getNextState` state machine
  6. Update conversation state if changed
  7. Cancel pending reminders (customer responded)
  8. Send chatbot follow-up question via `getChatbotResponse`
  9. Mark lead as qualified when all info collected
  10. Notify owner of lead updates

## Integration Points

| From | To | Via | Purpose |
|------|-----|-----|---------|
| whatsapp-message.worker.ts | intent.ts | `extractLeadInfo()` | AI-powered customer info extraction |
| whatsapp-message.worker.ts | chatbot.ts | `getNextState()` | State machine transitions |
| whatsapp-message.worker.ts | messages.ts | `getChatbotResponse()` | Get Hebrew response for state |
| whatsapp-message.worker.ts | notifications.ts | `notifyOwnerOfLead()` | Send owner WhatsApp notification |
| notifications.ts | whatsapp/messages.ts | `sendTextMessage()` | Send to owner |
| notifications.ts | queues.ts | `activityQueue` | Create activity events |

## Files Modified

| File | Change |
|------|--------|
| `src/services/lead-capture/notifications.ts` | Created - owner notification service |
| `src/services/lead-capture/index.ts` | Added notifications export |
| `src/queue/workers/whatsapp-message.worker.ts` | Extended with handleLeadConversation |

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Use tenant.ownerPhone for notifications | Existing schema field, no migration needed |
| Don't throw on notification failure | Notification is non-critical, lead flow must continue |
| Cancel reminders on any customer response | Per CONTEXT.md - customer engaged, reminders not needed |
| Notify owner even for incomplete leads | Per CONTEXT.md - real-time updates, owner can still call |
| Skip terminal state messages | No point processing messages after conversation ended |

## Deviations from Plan

None - plan executed exactly as written.

## Success Criteria Met

- [x] Incoming messages from leads detected via conversation ID
- [x] AI extracts customer info and updates lead record
- [x] Chatbot sends appropriate follow-up questions based on state
- [x] State transitions correctly when info is collected
- [x] Owner receives notification with emoji-formatted summary
- [x] Pending reminders cancelled when customer responds

## Next Phase Readiness

**Dependencies satisfied for:**
- Plan 03-06: Lead reminder worker (reminders already scheduled, cancellation working)
- Plan 03-07: Lead dashboard (leads updated, qualified status set)

**Blockers:** None

## Metrics

- **Duration:** ~4 minutes
- **Completed:** 2026-01-27
- **Tasks:** 2/2 completed
- **Commits:** 2 (feat: notification service, feat: worker extension)
