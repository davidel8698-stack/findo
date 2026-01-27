---
phase: 03-lead-capture
plan: 02
subsystem: webhooks
tags: [voicenter, cdr, webhooks, queue, bullmq]

dependency_graph:
  requires:
    - 03-01 (leads schema, missed_calls table, Voicenter types)
  provides:
    - Voicenter CDR webhook endpoint
    - Lead outreach and reminder queues
    - CDR processing worker
  affects:
    - 03-03 (initial WhatsApp message)
    - 03-04 (chatbot conversation)
    - 03-05 (owner notifications)

tech_stack:
  added: []
  patterns:
    - Webhook endpoint with immediate queue
    - Worker filtering by job name
    - Delayed job scheduling for 2-min wait

key_files:
  created:
    - src/queue/workers/voicenter-cdr.worker.ts
  modified:
    - src/routes/webhooks.ts
    - src/queue/queues.ts
    - src/queue/index.ts

decisions:
  - id: voicenter-cdr-endpoint-path
    choice: "/webhooks/voicenter/cdr"
    rationale: "Clear path structure, leaves /voicenter for potential future endpoints"
  - id: worker-on-webhooks-queue
    choice: "Process CDR jobs on existing webhooks queue"
    rationale: "Reuses infrastructure, filters by job name for CDR-specific handling"
  - id: payload-type-cast
    choice: "Cast VoicenterCDR to Record<string, unknown> at webhook level"
    rationale: "WebhookJobData uses generic Record; worker uses proper VoicenterCDR type"

metrics:
  duration: 5.5 min
  completed: 2026-01-27
---

# Phase 3 Plan 2: Voicenter CDR Webhook Summary

Voicenter CDR endpoint receiving missed calls, queueing for 2-minute delayed lead outreach.

## What Was Built

### 1. Voicenter CDR Webhook Endpoint

**File:** `src/routes/webhooks.ts`

```typescript
webhookRoutes.post('/voicenter/cdr', async (c) => {
  // Parse and validate CDR payload
  // Queue to webhookQueue with job name 'voicenter-cdr'
  // Respond 200 OK immediately (<500ms)
});
```

- Validates required fields: CallID, caller, DID, DialStatus
- Queues job immediately for async processing
- Fast response for Voicenter webhook reliability

### 2. Lead Queues

**File:** `src/queue/queues.ts`

```typescript
export const leadOutreachQueue = new Queue('lead-outreach', {...});
export const leadReminderQueue = new Queue('lead-reminders', {...});

export interface LeadOutreachJobData {
  tenantId: string;
  missedCallId: string;
  callerPhone: string;
}

export interface LeadReminderJobData {
  leadId: string;
  leadConversationId: string;
  reminderNumber: 1 | 2;
}
```

### 3. Voicenter CDR Worker

**File:** `src/queue/workers/voicenter-cdr.worker.ts`

```typescript
export function startVoicenterCDRWorker(): Worker<VoicenterCDRJobData> {
  // Listens on 'webhooks' queue
  // Filters for 'voicenter-cdr' jobs
  // Processes missed calls, schedules outreach
}
```

Processing flow:
1. Check if missed call (isMissedCall type guard)
2. Find tenant by DID -> WhatsApp connection lookup
3. Idempotency check via callId
4. Store missed call record
5. Schedule 2-minute delayed lead outreach

## Key Integration Points

### Webhook -> Queue -> Worker Flow

```
Voicenter POST /webhooks/voicenter/cdr
    |
    v
webhookQueue.add('voicenter-cdr', {...})
    |
    v
voicenter-cdr.worker (filters job.name === 'voicenter-cdr')
    |
    v
leadOutreachQueue.add({...}, { delay: 120000 })
    |
    v (after 2 minutes)
lead-outreach.worker sends WhatsApp
```

### Phone Number Normalization

```typescript
// DID from Voicenter: "0771234567"
// WhatsApp displayPhoneNumber: "+972771234567"
const normalizedDID = normalizeIsraeliPhone(cdr.DID);
// Matches connection for tenant lookup
```

## Deviations from Plan

None - plan executed exactly as written.

## Files Changed

| File | Change |
|------|--------|
| src/routes/webhooks.ts | Added /voicenter/cdr endpoint |
| src/queue/queues.ts | Added leadOutreachQueue, leadReminderQueue, job data interfaces |
| src/queue/workers/voicenter-cdr.worker.ts | Created CDR processing worker |
| src/queue/index.ts | Exported startVoicenterCDRWorker |

## Commits

| Hash | Message |
|------|---------|
| 8fa48a1 | feat(03-02): add Voicenter CDR webhook endpoint |
| 8b2a6f4 | feat(03-02): add lead outreach and reminder queues |
| 0884141 | feat(03-02): create Voicenter CDR processing worker |

## Next Phase Readiness

**Ready for 03-03 (Initial WhatsApp Message)**:
- leadOutreachQueue available for delayed job scheduling
- Worker creates missed call records with tenant association
- 2-minute delay implemented per CONTEXT.md

**Dependencies provided**:
- POST /webhooks/voicenter/cdr endpoint
- leadOutreachQueue with LeadOutreachJobData
- leadReminderQueue with LeadReminderJobData
- startVoicenterCDRWorker function

**User setup required**:
- Configure Voicenter CDR webhook URL in dashboard
- Point to: https://your-domain.com/webhooks/voicenter/cdr
