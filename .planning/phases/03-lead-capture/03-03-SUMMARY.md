---
phase: 03-lead-capture
plan: 03
subsystem: lead-outreach
tags: [whatsapp, hebrew, bullmq, workers]
completed: 2026-01-27
duration: 5 min
dependency-graph:
  requires: [03-01]
  provides: [lead-outreach-worker, hebrew-messages]
  affects: [03-04, 03-05]
tech-stack:
  added: []
  patterns: [bullmq-worker, message-templates]
key-files:
  created:
    - src/services/lead-capture/messages.ts
    - src/services/lead-capture/index.ts
    - src/queue/workers/lead-outreach.worker.ts
  modified:
    - src/queue/queues.ts
    - src/queue/index.ts
    - src/index.ts
    - src/services/voicenter/types.ts
decisions:
  - key: warm-personal-tone
    choice: Hebrew messages feel like owner wrote them, no automation mentions
    rationale: Per CONTEXT.md - builds trust, feels personal
  - key: qualifying-status
    choice: New leads start with status 'qualifying'
    rationale: Chatbot is collecting info, not yet qualified
  - key: reminder-schedule
    choice: 2h and 24h reminders scheduled at lead creation
    rationale: Per CONTEXT.md non-response handling decision
metrics:
  tasks-completed: 2
  tasks-total: 2
  commits: 2
---

# Phase 3 Plan 3: Lead Outreach Worker Summary

Hebrew message templates + BullMQ worker sends warm WhatsApp to missed call callers after 2-minute delay.

## What Was Built

### 1. Hebrew Message Templates (src/services/lead-capture/messages.ts)

Complete set of Hebrew messages for lead capture conversation:

| Message | Purpose | Hebrew Text |
|---------|---------|-------------|
| initial | First contact after missed call | "היי, ראיתי שניסית להתקשר ל{business} ולא הצלחתי לענות. איך אפשר לעזור?" |
| askName | Get customer name | "אשמח לעזור! איך קוראים לך?" |
| askNeed | Understand their need | "שלום {name}! במה אפשר לעזור לך?" |
| askPreference | When to call back | "מתי נוח לך שנחזור אליך?" |
| complete | End conversation | "תודה! אנחנו נחזור אליך בהקדם." |
| reminder1 | 2h follow-up | "היי, ראיתי שניסית להתקשר ל{business}. עדיין צריך עזרה?" |
| reminder2 | 24h final reminder | "שלום, זו תזכורת אחרונה - אם עדיין צריך עזרה, אשמח לשמוע ממך." |

Helper functions:
- `formatInitialMessage(businessName)` - Format initial message
- `getChatbotResponse(state, context)` - Get response for conversation state
- `getReminderMessage(number, businessName)` - Get reminder text

### 2. Lead Outreach Worker (src/queue/workers/lead-outreach.worker.ts)

BullMQ worker that processes delayed outreach jobs:

**Flow:**
1. Receive job from leadOutreachQueue (2-min delay)
2. Verify tenant exists and has active WhatsApp connection
3. Check for existing lead (idempotent - skip if exists)
4. Create WhatsApp client and send initial message
5. Create lead record (status: 'qualifying')
6. Create/update WhatsApp conversation record
7. Create lead conversation (state: 'awaiting_response')
8. Schedule reminder jobs (2h and 24h)

**Integration points:**
- Uses `createWhatsAppClient` from Phase 2 infrastructure
- Uses `sendTextMessage` for actual WhatsApp send
- Creates records in leads, leadConversations, whatsappConversations tables
- Queues jobs to leadReminderQueue

### 3. Queue Infrastructure Updates

New queues in src/queue/queues.ts (already existed from 03-02):
- `leadOutreachQueue` - Initial WhatsApp outreach
- `leadReminderQueue` - Follow-up reminders

Worker startup in src/index.ts:
- `leadOutreachWorker` started with other workers
- Graceful shutdown handling included

## Key Links Established

| From | To | Via |
|------|----|----|
| lead-outreach.worker.ts | services/whatsapp | sendTextMessage for initial outreach |
| lead-outreach.worker.ts | db/schema/leads | Insert lead and leadConversation records |
| lead-outreach.worker.ts | lead-capture/messages | formatInitialMessage for Hebrew content |
| lead-outreach.worker.ts | leadReminderQueue | Schedule 2h and 24h reminders |

## Decisions Made

1. **Message tone: warm and personal** - Per CONTEXT.md, messages should feel like they come from the owner, not a system. No mention of automation or assistant.

2. **Lead status: qualifying** - New leads start with 'qualifying' status because chatbot is collecting info. Will move to 'qualified' when complete.

3. **Existing lead handling** - If lead exists for phone number, skip initial message. Links missed call to existing lead for analytics.

4. **Business name fallback** - Uses tenant.businessName, falls back to tenant.ownerName, then 'העסק' (generic "the business").

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed VoicenterCDR interface compatibility**
- **Found during:** Task 2 TypeScript verification
- **Issue:** VoicenterCDR interface missing index signature, incompatible with `Record<string, unknown>` in WebhookJobData
- **Fix:** Added `[key: string]: unknown` index signature to VoicenterCDR
- **Files modified:** src/services/voicenter/types.ts
- **Commit:** c94df9b

## Commits

| Hash | Type | Description |
|------|------|-------------|
| c3d5f99 | feat | Hebrew message templates for lead capture |
| c94df9b | feat | Lead outreach worker with integrations |

## Files Changed

**Created:**
- `src/services/lead-capture/messages.ts` - Hebrew message templates
- `src/services/lead-capture/index.ts` - Service barrel file
- `src/queue/workers/lead-outreach.worker.ts` - BullMQ worker

**Modified:**
- `src/index.ts` - Start lead outreach worker
- `src/services/voicenter/types.ts` - Add index signature for type compatibility

## Next Phase Readiness

**Ready for 03-04 (Chatbot State Machine):**
- Lead conversation state starts at 'awaiting_response'
- Message templates for all states available
- whatsappConversationId linked for message tracking

**Blocking issues:** None

## Verification Evidence

```
=== Final Verification ===

1. TypeScript check: PASS

2. Message templates exports: LEAD_MESSAGES, formatInitialMessage, getChatbotResponse

3. Worker export: startLeadOutreachWorker exported from queue/index.ts

4. Worker startup: leadOutreachWorker = startLeadOutreachWorker() in src/index.ts

5. Initial message tone: "היי, ראיתי שניסית להתקשר ל${businessName} ולא הצלחתי לענות..."
```
