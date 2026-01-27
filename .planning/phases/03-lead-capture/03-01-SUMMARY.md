---
phase: 03-lead-capture
plan: 01
subsystem: database
tags: [drizzle, schema, leads, voicenter, phone-normalization]

dependency-graph:
  requires: [01-01, 02-01]
  provides: [lead-schema, voicenter-types, phone-utils]
  affects: [03-02, 03-03, 03-04]

tech-stack:
  added: []
  patterns: [uuid-primary-keys, cascade-delete, idempotency-keys, state-machine-enum]

key-files:
  created:
    - src/db/schema/leads.ts
    - src/services/voicenter/types.ts
    - src/services/voicenter/index.ts
    - src/lib/phone.ts
    - drizzle/0004_careless_old_lace.sql
  modified:
    - src/db/schema/index.ts

decisions:
  - id: lead-status-enum
    choice: 7-state lifecycle (new->qualifying->qualified->contacted->converted/lost/unresponsive)
    rationale: Covers full funnel from capture to outcome
  - id: missed-call-idempotency
    choice: callId as unique constraint
    rationale: Voicenter CallID is unique per call, prevents duplicate lead creation
  - id: lead-conversation-unique
    choice: One conversation per lead (1:1 via unique constraint on lead_id)
    rationale: Each lead has exactly one chatbot conversation flow
  - id: phone-normalization
    choice: Always normalize to +972XXXXXXXXX format
    rationale: Consistent format for lookups and deduplication

metrics:
  duration: 3.6 min
  completed: 2026-01-27
---

# Phase 03 Plan 01: Lead Capture Schema Summary

**One-liner:** Three database tables (leads, lead_conversations, missed_calls) with Voicenter CDR types and Israeli phone normalization.

## What Was Built

### Database Schema (`src/db/schema/leads.ts`)

Three tables for lead capture functionality:

1. **leads** - Core lead records
   - Tenant-scoped with cascade delete
   - Source tracking (missed_call, manual, website)
   - Customer info (phone required, name optional)
   - Qualification fields (need, contactPreference)
   - Status enum covering full funnel lifecycle
   - Lifecycle timestamps (capturedAt, qualifiedAt, contactedAt)
   - Indexes on tenantId, status, customerPhone

2. **lead_conversations** - Chatbot state tracking
   - One-to-one with leads (unique constraint on leadId)
   - State machine enum for conversation flow
   - Reminder tracking (reminder1SentAt, reminder2SentAt)
   - Link to WhatsApp conversation for context

3. **missed_calls** - Voicenter CDR records
   - Idempotency via unique callId (Voicenter CallID)
   - Call details (callerPhone, businessPhone, status)
   - Processing tracking (calledAt, processedAt)
   - Optional link to created lead

### Voicenter Types (`src/services/voicenter/types.ts`)

TypeScript types matching Voicenter CDR webhook payload:

- `VoicenterCDR` interface with all webhook fields
- `VoicenterCallStatus` union type for call statuses
- `MISSED_CALL_STATUSES` array for lead capture triggers
- `isMissedCall()` type guard for safe status checking

### Phone Utilities (`src/lib/phone.ts`)

Israeli phone number handling:

- `normalizeIsraeliPhone()` - Any format to +972XXXXXXXXX
- `formatPhoneDisplay()` - To local format (050-123-4567)
- `isValidIsraeliMobile()` - Validate mobile numbers

## Key Implementation Details

### State Machine Design

The lead conversation state machine is defined as a database enum:
```
awaiting_response -> awaiting_name -> awaiting_need -> awaiting_preference -> completed
                 \-> unresponsive (after max reminders)
```

### Idempotency Strategy

Missed calls use Voicenter's CallID as unique key. If webhook retries occur, the second insert fails silently, preventing duplicate leads.

### Phone Number Normalization

All phone numbers stored in normalized +972 format:
- Enables consistent lookups (find existing lead by phone)
- Works with any input format from Voicenter
- Supports display conversion when needed

## Deviations from Plan

None - plan executed exactly as written.

## Commits

| Hash | Type | Description |
|------|------|-------------|
| f17f7f9 | feat | Lead capture database schema (3 tables, 3 enums, indexes) |
| e3c2fff | feat | Voicenter CDR webhook types |
| ce57ea6 | feat | Israeli phone number normalization utilities |

## Next Phase Readiness

Ready for 03-02: Voicenter Webhook Handler

Required for next plan:
- Voicenter types: DONE
- Phone normalizer: DONE
- Lead/missed_calls schema: DONE
- WhatsApp connection lookup by phone: EXISTS (from Phase 2)

Environment setup needed:
- None for schema - database migration will run on deploy
- Voicenter webhook URL will be configured in Voicenter dashboard during integration
