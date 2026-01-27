---
phase: 02-whatsapp-integration
plan: 04
subsystem: messaging
tags: [whatsapp, workers, queue, conversations]
executed: 2026-01-27
duration: 6.5 min
status: complete

dependency-graph:
  requires: [02-01, 02-03]
  provides: [message-workers, conversation-service, status-tracking]
  affects: [02-05, 02-06]

tech-stack:
  added: []
  patterns: [queue-workers, 24-hour-window, batch-processing]

key-files:
  created:
    - src/services/whatsapp/conversations.ts
    - src/queue/workers/whatsapp-message.worker.ts
    - src/queue/workers/whatsapp-status.worker.ts
  modified:
    - src/services/whatsapp/index.ts
    - src/queue/index.ts
    - src/index.ts

decisions:
  - id: conversation-upsert
    choice: "Upsert pattern for conversation creation"
    rationale: "Check for existing conversation first, then update or create"
  - id: status-backfill
    choice: "Backfill missed status timestamps"
    rationale: "If we receive 'read' but missed 'sent' or 'delivered', set those too"
  - id: autoreply-best-effort
    choice: "Auto-reply failures logged but don't fail job"
    rationale: "User notification is secondary to message storage"

metrics:
  tasks: 3/3
  commits: 3
  files-created: 3
  files-modified: 3
---

# Phase 2 Plan 4: WhatsApp Message Workers Summary

**One-liner:** Queue workers for incoming WhatsApp messages and status updates with 24-hour conversation window management.

## What Was Built

### Conversation Service (`src/services/whatsapp/conversations.ts`)
Complete 24-hour window management for WhatsApp conversations:
- `openConversationWindow()`: Opens/extends 24-hour window when customer messages
- `getConversation()`: Retrieves conversation info with window status
- `isWindowOpen()`: Checks if current 24-hour window allows freeform reply
- `incrementMessageCount()`: Updates message stats for outbound messages
- `getConversationById()`: Retrieves conversation by UUID

### Message Processing Worker (`src/queue/workers/whatsapp-message.worker.ts`)
Processes incoming WhatsApp messages from the webhooks queue:
- Listens for `whatsapp-messages` jobs on `webhooks` queue
- Finds tenant by WABA ID from `whatsappConnections` table
- Opens/extends 24-hour conversation window on each customer message
- Saves messages to `whatsapp_messages` table with proper direction/type
- Creates activity events for real-time dashboard updates
- Sends Hebrew auto-reply for unsupported message types (audio, video, etc.)

### Status Update Worker (`src/queue/workers/whatsapp-status.worker.ts`)
Batch processes delivery/read status updates:
- Listens for `whatsapp-statuses` jobs on `webhooks` queue
- Finds messages by `waMessageId` and updates status
- Sets appropriate timestamps (`sentAt`, `deliveredAt`, `readAt`)
- Records error codes for failed messages
- Handles missing intermediate statuses (backfills timestamps)

## Implementation Details

### Message Flow
```
Webhook POST -> Parse -> Queue (webhooks/whatsapp-messages)
    -> Message Worker -> Find tenant by WABA
        -> Open/extend conversation window
        -> Save to whatsapp_messages
        -> Create activity event
        -> Auto-reply if unsupported type
```

### Status Flow
```
Webhook POST -> Parse -> Queue (webhooks/whatsapp-statuses)
    -> Status Worker -> Find message by waMessageId
        -> Update status + timestamp
        -> Backfill missed timestamps
        -> Record error code if failed
```

### Auto-Reply Message (Hebrew)
```
שלום! קיבלנו את ההודעה שלך, אך אנו תומכים כרגע רק בהודעות טקסט ותמונות.
אנא שלח/י הודעת טקסט או תמונה ונשמח לעזור.
```
Translation: "Hello! We received your message, but we currently only support text and images. Please send a text or image message and we'll be happy to help."

## Commits

| Hash | Type | Description |
|------|------|-------------|
| 06b1a59 | feat | Create conversation service for 24-hour window tracking |
| 751417c | feat | Create WhatsApp message processing worker |
| 708daba | feat | Create WhatsApp status update worker |

## Decisions Made

1. **Upsert Pattern for Conversations**: Check for existing conversation first, then update or create. This handles both new customers and returning customers gracefully.

2. **Status Timestamp Backfill**: If we receive a 'read' status but never got 'sent' or 'delivered', we set those timestamps to the same time. This ensures consistent data even if status updates arrive out of order or some are missed.

3. **Best-Effort Auto-Reply**: Auto-reply for unsupported message types is logged on failure but doesn't fail the job. Message storage is the primary concern; notification is secondary.

## Deviations from Plan

None - plan executed exactly as written.

## Verification Results

- [x] File exists: `src/services/whatsapp/conversations.ts`
- [x] `openConversationWindow`, `getConversation`, `isWindowOpen` exported
- [x] File exists: `src/queue/workers/whatsapp-message.worker.ts`
- [x] File exists: `src/queue/workers/whatsapp-status.worker.ts`
- [x] Workers exported from `src/queue/index.ts`
- [x] TypeScript compiles: `pnpm tsc --noEmit`

## Next Phase Readiness

**Ready for 02-05 (Connection Status)**
- Conversation service provides window status checking
- Workers are processing messages and updating statuses
- Activity events are being created for dashboard visibility

**Dependencies Provided:**
- `openConversationWindow()` - Called when customer messages
- `isConversationWindowOpen()` - Used before sending freeform messages
- Message status tracking - For delivery confirmation
