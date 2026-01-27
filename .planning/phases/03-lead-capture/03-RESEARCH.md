# Phase 3: Lead Capture - Research

**Researched:** 2026-01-27
**Domain:** Voicenter Webhook Integration, Conversation State Machine, AI Intent Extraction
**Confidence:** MEDIUM (Voicenter docs not directly fetchable; patterns verified via multiple sources)

## Summary

Phase 3 implements missed call to lead conversion: Voicenter webhook fires for unanswered calls, system waits 2 minutes (BullMQ delayed job), sends WhatsApp to caller, chatbot collects name/need/preference via conversation, and notifies business owner with structured summary.

The research identified three core technical domains:
1. **Voicenter CDR Webhook** - HTTP POST notifications after call completion with status (NOANSWER/ANSWER/etc.), caller number, and target number
2. **Conversation State Machine** - Simple object-based pattern tracking chatbot state per conversation (no XState needed for this use case)
3. **AI Intent Extraction** - Claude structured outputs with Zod for extracting name/need/preference from unclear Hebrew messages

**Primary recommendation:** Use BullMQ delayed jobs for 2-minute wait, simple object-based state machine for conversation flow, Claude Haiku 4.5 with Zod structured outputs for intent extraction. Extend existing WhatsApp infrastructure from Phase 2.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| BullMQ | 5.67.1 | Delayed job (2-min wait), lead capture queue | Already in project, supports delays natively |
| @anthropic-ai/sdk | Latest | AI intent extraction from messages | Official Anthropic SDK, TypeScript-first |
| zod | 4.3.6 | Schema validation for AI outputs | Already in project, integrates with Anthropic SDK |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| drizzle-orm | 0.45.1 | Lead and missed call database operations | Already in project |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Simple state machine | XState | XState is overkill for linear chatbot flow; adds complexity |
| Claude Haiku 4.5 | GPT-4o-mini | Claude has better structured outputs and Hebrew support |
| Polling Voicenter | Webhook | Webhook is real-time and more efficient |

**Installation:**
```bash
pnpm add @anthropic-ai/sdk
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── db/schema/
│   ├── leads.ts              # Lead table, missed calls table
│   └── lead-conversations.ts # Chatbot conversation state
├── services/
│   ├── voicenter/
│   │   ├── webhooks.ts       # CDR webhook parsing
│   │   └── types.ts          # CDR payload types
│   ├── lead-capture/
│   │   ├── chatbot.ts        # Conversation state machine
│   │   ├── intent.ts         # AI intent extraction
│   │   └── notifications.ts  # Owner notifications
│   └── whatsapp/             # (existing from Phase 2)
├── queue/workers/
│   ├── voicenter-cdr.worker.ts    # Process CDR webhooks
│   ├── lead-outreach.worker.ts    # 2-min delayed WhatsApp send
│   ├── lead-reminder.worker.ts    # 2h and 24h reminders
│   └── whatsapp-message.worker.ts # (extend for chatbot)
└── routes/
    └── webhooks.ts           # Add Voicenter endpoint
```

### Pattern 1: Voicenter CDR Webhook Handler

**What:** HTTP endpoint receiving call detail records after each call completes
**When to use:** Every call event from Voicenter

```typescript
// src/services/voicenter/types.ts
export interface VoicenterCDR {
  caller: string;           // Caller phone number (e.g., "0512345678")
  target: string;           // Target phone/extension
  time: number;             // Epoch timestamp
  Duration: number;         // Call duration in seconds (0 = not answered)
  DialStatus: VoicenterCallStatus;
  DID: string;              // Called number (the business number)
  CallID: string;           // Unique call identifier
  QueueName?: string;       // Queue name if applicable
  RepresentativeName?: string;
  RecordURL?: string;       // Recording URL if recorded
}

export type VoicenterCallStatus =
  | 'ANSWER'      // Call was answered
  | 'NOANSWER'    // No answer (missed call)
  | 'BUSY'        // Line busy
  | 'CANCEL'      // Caller hung up before answer
  | 'CONGESTION'  // Network congestion
  | 'ABANDONE'    // Abandoned in queue
  | 'VOEND';      // Voicemail ended

// Missed call statuses that should trigger lead capture
export const MISSED_CALL_STATUSES: VoicenterCallStatus[] = [
  'NOANSWER', 'CANCEL', 'BUSY', 'ABANDONE'
];
```

**Webhook Handler:**
```typescript
// src/routes/webhooks.ts (extend existing)
whatsappWebhook.post('/voicenter/cdr', async (c) => {
  const cdr: VoicenterCDR = await c.req.json();

  // Respond immediately - Voicenter expects 200 OK
  // Processing happens asynchronously

  await webhookQueue.add('voicenter-cdr', {
    source: 'voicenter',
    eventId: cdr.CallID,
    eventType: 'cdr.received',
    payload: cdr,
    receivedAt: new Date().toISOString(),
  });

  return c.text('OK', 200);
});
```

### Pattern 2: 2-Minute Delayed Job

**What:** Wait 2 minutes before sending WhatsApp (in case owner calls back)
**When to use:** After detecting a missed call

```typescript
// src/queue/workers/voicenter-cdr.worker.ts
import { Queue } from 'bullmq';

const leadOutreachQueue = new Queue('lead-outreach', {
  connection: createRedisConnection(),
});

async function processMissedCall(cdr: VoicenterCDR, tenantId: string) {
  // Check if this is a missed call
  if (!MISSED_CALL_STATUSES.includes(cdr.DialStatus)) {
    return; // Answered call, no action needed
  }

  // Store missed call record
  const missedCall = await db.insert(missedCalls).values({
    tenantId,
    callerPhone: normalizePhone(cdr.caller),
    businessPhone: cdr.DID,
    callId: cdr.CallID,
    status: cdr.DialStatus,
    calledAt: new Date(cdr.time * 1000),
    processAfter: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes from now
  }).returning();

  // Schedule delayed job - 2 minutes = 120,000 milliseconds
  await leadOutreachQueue.add(
    'send-initial-message',
    {
      tenantId,
      missedCallId: missedCall[0].id,
      callerPhone: normalizePhone(cdr.caller),
    },
    { delay: 2 * 60 * 1000 } // 2 minutes delay
  );
}
```

### Pattern 3: Simple Conversation State Machine

**What:** Track chatbot conversation state without external library
**When to use:** Managing lead qualification conversation flow

```typescript
// src/services/lead-capture/chatbot.ts

// Conversation states
export type ConversationState =
  | 'awaiting_response'      // Initial message sent, waiting for any reply
  | 'awaiting_name'          // Asked for name
  | 'awaiting_need'          // Asked about their need
  | 'awaiting_preference'    // Asked for contact preference
  | 'completed'              // All info collected
  | 'unresponsive';          // No response after reminders

// State machine definition
export const conversationMachine = {
  initial: 'awaiting_response',
  states: {
    awaiting_response: {
      on: {
        MESSAGE_RECEIVED: { target: 'awaiting_name' },
        REMINDER_1_SENT: { target: 'awaiting_response' },
        REMINDER_2_SENT: { target: 'awaiting_response' },
        TIMEOUT: { target: 'unresponsive' },
      },
    },
    awaiting_name: {
      on: {
        NAME_EXTRACTED: { target: 'awaiting_need' },
        MESSAGE_RECEIVED: { target: 'awaiting_name' }, // Re-try extraction
      },
    },
    awaiting_need: {
      on: {
        NEED_EXTRACTED: { target: 'awaiting_preference' },
        MESSAGE_RECEIVED: { target: 'awaiting_need' },
      },
    },
    awaiting_preference: {
      on: {
        PREFERENCE_EXTRACTED: { target: 'completed' },
        MESSAGE_RECEIVED: { target: 'awaiting_preference' },
      },
    },
    completed: {
      // Terminal state - no transitions
    },
    unresponsive: {
      // Terminal state - no transitions
    },
  },
};

// State transition function
export function transition(
  currentState: ConversationState,
  event: string
): ConversationState {
  const stateConfig = conversationMachine.states[currentState];
  const nextState = stateConfig?.on?.[event]?.target;
  return nextState || currentState;
}
```

### Pattern 4: AI Intent Extraction with Structured Output

**What:** Extract name, need, and contact preference from Hebrew messages
**When to use:** Processing each customer message in lead conversation

```typescript
// src/services/lead-capture/intent.ts
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Schema for extracted lead info
export const LeadInfoSchema = z.object({
  name: z.string().nullable().describe('Customer name if mentioned'),
  need: z.string().nullable().describe('What the customer needs/wants'),
  contactPreference: z.string().nullable().describe('When/how they want to be contacted'),
  confidence: z.enum(['high', 'medium', 'low']).describe('Confidence in extraction'),
});

export type LeadInfo = z.infer<typeof LeadInfoSchema>;

export async function extractLeadInfo(
  message: string,
  conversationHistory: string[],
  currentState: ConversationState
): Promise<LeadInfo> {
  const systemPrompt = `You are extracting lead information from Hebrew WhatsApp messages.
The conversation is with a potential customer who called a business and didn't get through.

Current conversation state: ${currentState}
Previous messages: ${conversationHistory.join('\n')}

Extract the following from the customer's message:
- name: Their name if they mentioned it
- need: What they need/want (their reason for calling)
- contactPreference: When they want to be called back (morning, evening, specific time, ASAP, etc.)

Be generous in extraction - if they say "אני דני" extract "דני" as name.
If they describe a problem, that's their need.
If they say "תתקשרו אליי מחר" that's a contact preference.

Return null for fields that cannot be determined from the message.`;

  const response = await anthropic.beta.messages.create({
    model: 'claude-haiku-4-5-20250929',
    max_tokens: 256,
    betas: ['structured-outputs-2025-11-13'],
    system: systemPrompt,
    messages: [
      { role: 'user', content: message }
    ],
    output_format: {
      type: 'json_schema',
      schema: {
        type: 'object',
        properties: {
          name: { type: ['string', 'null'] },
          need: { type: ['string', 'null'] },
          contactPreference: { type: ['string', 'null'] },
          confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
        },
        required: ['name', 'need', 'contactPreference', 'confidence'],
        additionalProperties: false,
      },
    },
  });

  const result = JSON.parse(response.content[0].text);
  return LeadInfoSchema.parse(result);
}
```

### Pattern 5: Lead Conversation Message Handler

**What:** Extend WhatsApp message worker to handle lead conversations
**When to use:** When receiving message from a phone number with active lead conversation

```typescript
// Extension to whatsapp-message.worker.ts
import { extractLeadInfo, LeadInfo } from '../services/lead-capture/intent';
import { transition } from '../services/lead-capture/chatbot';

async function handleLeadConversationMessage(
  message: ParsedMessage,
  leadConversation: LeadConversation
): Promise<void> {
  // Extract info using AI
  const extractedInfo = await extractLeadInfo(
    message.text || '',
    leadConversation.messageHistory,
    leadConversation.state
  );

  // Update lead with extracted info
  const updates: Partial<Lead> = {};
  if (extractedInfo.name) updates.customerName = extractedInfo.name;
  if (extractedInfo.need) updates.need = extractedInfo.need;
  if (extractedInfo.contactPreference) updates.contactPreference = extractedInfo.contactPreference;

  await db.update(leads)
    .set(updates)
    .where(eq(leads.id, leadConversation.leadId));

  // Determine next state and response
  let event = 'MESSAGE_RECEIVED';
  if (extractedInfo.name && leadConversation.state === 'awaiting_name') {
    event = 'NAME_EXTRACTED';
  } else if (extractedInfo.need && leadConversation.state === 'awaiting_need') {
    event = 'NEED_EXTRACTED';
  } else if (extractedInfo.contactPreference && leadConversation.state === 'awaiting_preference') {
    event = 'PREFERENCE_EXTRACTED';
  }

  const nextState = transition(leadConversation.state, event);

  // Update conversation state
  await db.update(leadConversations)
    .set({
      state: nextState,
      messageHistory: [...leadConversation.messageHistory, message.text],
      updatedAt: new Date(),
    })
    .where(eq(leadConversations.id, leadConversation.id));

  // Send appropriate response based on new state
  await sendChatbotResponse(leadConversation, nextState, extractedInfo);

  // Notify owner if state completed or info updated
  if (nextState === 'completed' || Object.keys(updates).length > 0) {
    await notifyOwnerOfLeadUpdate(leadConversation.leadId);
  }
}
```

### Pattern 6: Owner Notification with Structured Summary

**What:** Send WhatsApp notification to owner with lead details
**When to use:** When new lead info is collected or lead is completed

```typescript
// src/services/lead-capture/notifications.ts

export async function notifyOwnerOfLeadUpdate(leadId: string): Promise<void> {
  const lead = await db.query.leads.findFirst({
    where: eq(leads.id, leadId),
    with: { tenant: true },
  });

  if (!lead || !lead.tenant) return;

  // Format structured summary (per CONTEXT.md decision)
  const isComplete = lead.customerName && lead.need && lead.contactPreference;
  const header = isComplete ? 'lead_new' : 'lead_new_partial';

  // Build summary message
  const summary = formatLeadSummary(lead, isComplete);

  // Send to owner via WhatsApp
  const client = await createWhatsAppClient(lead.tenantId);
  if (!client) return;

  await sendTextMessage(
    client,
    lead.tenant.ownerPhone,
    summary
  );
}

function formatLeadSummary(lead: Lead, isComplete: boolean): string {
  const lines: string[] = [];

  // Header with emoji
  lines.push(isComplete ? 'lead_new_full' : 'lead_new_partial');

  // Name
  if (lead.customerName) {
    lines.push(`name: ${lead.customerName}`);
  }

  // Need
  if (lead.need) {
    lines.push(`need: ${lead.need}`);
  }

  // Contact preference
  if (lead.contactPreference) {
    lines.push(`preference: ${lead.contactPreference}`);
  }

  // Phone (clickable)
  lines.push(`phone: ${lead.customerPhone}`);

  return lines.join('\n');
}
```

### Anti-Patterns to Avoid

- **Processing webhook synchronously:** Voicenter expects fast 200 OK response. Queue processing.
- **Sending WhatsApp immediately on missed call:** Owner may call back within 2 minutes.
- **Using complex state machine library:** XState is overkill for linear lead qualification flow.
- **Asking clarifying questions:** Per CONTEXT.md - AI extracts intent, doesn't ask for clarification.
- **Waiting for complete lead before notifying owner:** Notify immediately, update as info comes.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Delayed job scheduling | setTimeout or custom scheduler | BullMQ delayed jobs | Survives server restarts, reliable |
| AI intent extraction | Regex parsing of Hebrew | Claude Haiku + structured outputs | Hebrew is complex, AI handles ambiguity |
| Phone number normalization | Custom regex | Dedicated normalizer function | Israeli numbers have many formats |
| Webhook signature verification | Skip it | Voicenter provides auth mechanism | Security |

**Key insight:** The AI layer is essential for Hebrew intent extraction - regex cannot handle the variety of ways customers express themselves in Hebrew casual conversation.

## Common Pitfalls

### Pitfall 1: Duplicate Lead Creation

**What goes wrong:** Same missed call creates multiple leads
**Why it happens:** Voicenter may retry webhook if no 200 response, or multiple extensions ring
**How to avoid:**
- Use CallID as idempotency key
- Upsert pattern: INSERT ... ON CONFLICT DO NOTHING
- Track processed CallIDs in Redis with TTL
**Warning signs:** Multiple leads from same phone number at same time

### Pitfall 2: 2-Minute Window Race Condition

**What goes wrong:** Owner calls back but WhatsApp still sends
**Why it happens:** Delayed job fires regardless of callback
**How to avoid:**
- Before sending WhatsApp, check if there's been a successful call since missed call
- Query Voicenter Call Log API or check CDR records for ANSWER status
- Cancel delayed job if possible (BullMQ job.remove())
**Warning signs:** Customer says "we already talked"

### Pitfall 3: Hebrew Name Extraction Failures

**What goes wrong:** AI fails to extract simple Hebrew name
**Why it happens:** Customer writes "ani dani" (transliterated) or uses nicknames
**How to avoid:**
- Prompt AI to handle both Hebrew script and transliteration
- Be generous - extract partial matches
- Store raw message for manual review
**Warning signs:** Many leads with null names despite customers introducing themselves

### Pitfall 4: Conversation State Desync

**What goes wrong:** State machine says "awaiting_need" but lead already has need filled
**Why it happens:** AI extracted multiple fields from one message
**How to avoid:**
- Always check lead record for existing data before deciding next question
- Update state based on what's MISSING, not what was just extracted
- Allow jumping states if multiple fields extracted at once
**Warning signs:** Chatbot asks for info customer already provided

### Pitfall 5: Reminder Spam

**What goes wrong:** Customer receives too many reminders
**Why it happens:** Reminder jobs scheduled but customer already responded
**How to avoid:**
- Check conversation state before sending reminder
- Cancel pending reminder jobs when customer responds
- Track reminder count and enforce max (2 per CONTEXT.md)
**Warning signs:** Customer complaints, blocks

### Pitfall 6: Owner Notification Fatigue

**What goes wrong:** Owner gets too many notifications for same lead
**Why it happens:** Notifying on every message instead of meaningful updates
**How to avoid:**
- Debounce notifications (max 1 per 5 minutes per lead)
- Only notify when NEW field is extracted, not on every message
- Aggregate updates if multiple fields extracted quickly
**Warning signs:** Owner disables notifications, ignores them

## Code Examples

### Database Schema for Leads

```typescript
// src/db/schema/leads.ts
import { pgTable, uuid, varchar, text, timestamp, pgEnum, integer } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';

export const leadStatusEnum = pgEnum('lead_status', [
  'new',           // Just captured, awaiting info
  'qualifying',    // Chatbot collecting info
  'qualified',     // All info collected
  'unresponsive',  // Customer didn't respond after reminders
  'contacted',     // Owner contacted customer
  'converted',     // Became a customer
  'lost',          // Didn't convert
]);

export const leadSourceEnum = pgEnum('lead_source', [
  'missed_call',   // From Voicenter missed call
  'manual',        // Manually added
  'website',       // Future: website form
]);

export const leads = pgTable('leads', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),

  // Source tracking
  source: leadSourceEnum('source').default('missed_call').notNull(),
  sourceId: varchar('source_id', { length: 100 }), // Voicenter CallID

  // Customer info
  customerPhone: varchar('customer_phone', { length: 20 }).notNull(),
  customerName: varchar('customer_name', { length: 255 }),

  // Lead qualification
  need: text('need'),                           // What they need
  contactPreference: text('contact_preference'), // When to call back

  // Status tracking
  status: leadStatusEnum('status').default('new').notNull(),

  // Timestamps
  capturedAt: timestamp('captured_at', { withTimezone: true }).defaultNow().notNull(),
  qualifiedAt: timestamp('qualified_at', { withTimezone: true }),
  contactedAt: timestamp('contacted_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Lead conversation state tracking
export const leadConversationStateEnum = pgEnum('lead_conversation_state', [
  'awaiting_response',
  'awaiting_name',
  'awaiting_need',
  'awaiting_preference',
  'completed',
  'unresponsive',
]);

export const leadConversations = pgTable('lead_conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  leadId: uuid('lead_id').notNull().references(() => leads.id, { onDelete: 'cascade' }).unique(),

  // State machine
  state: leadConversationStateEnum('state').default('awaiting_response').notNull(),

  // Reminder tracking
  reminder1SentAt: timestamp('reminder1_sent_at', { withTimezone: true }),
  reminder2SentAt: timestamp('reminder2_sent_at', { withTimezone: true }),

  // Conversation context
  whatsappConversationId: uuid('whatsapp_conversation_id'),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Missed calls tracking (for idempotency and analytics)
export const missedCalls = pgTable('missed_calls', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),

  // Voicenter data
  callId: varchar('call_id', { length: 100 }).notNull().unique(), // Idempotency key
  callerPhone: varchar('caller_phone', { length: 20 }).notNull(),
  businessPhone: varchar('business_phone', { length: 20 }).notNull(),
  status: varchar('status', { length: 20 }).notNull(), // NOANSWER, BUSY, etc.

  // Processing
  calledAt: timestamp('called_at', { withTimezone: true }).notNull(),
  processedAt: timestamp('processed_at', { withTimezone: true }),
  leadId: uuid('lead_id').references(() => leads.id),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
```

### Chatbot Response Generator

```typescript
// src/services/lead-capture/chatbot-responses.ts

// Response templates (Hebrew)
const RESPONSES = {
  initial: (businessName: string) =>
    `היי, ראיתי שניסית להתקשר ל${businessName} ולא הצלחתי לענות. איך אפשר לעזור?`,

  askName: () =>
    `אשמח לעזור! איך קוראים לך?`,

  askNeed: (name: string) =>
    `שלום ${name}! במה אפשר לעזור?`,

  askPreference: () =>
    `מתי נוח לך שנחזור אליך?`,

  complete: () =>
    `תודה! אנחנו נחזור אליך בהקדם.`,

  reminder1: (businessName: string) =>
    `היי, ראיתי שניסית להתקשר ל${businessName}. עדיין צריך עזרה?`,

  reminder2: (businessName: string) =>
    `שלום, זו תזכורת אחרונה - אם עדיין צריך עזרה, אשמח לשמוע ממך.`,
};

export async function sendChatbotResponse(
  conversation: LeadConversation,
  state: ConversationState,
  lead: Lead,
  tenant: Tenant
): Promise<void> {
  const client = await createWhatsAppClient(lead.tenantId);
  if (!client) return;

  let message: string;

  switch (state) {
    case 'awaiting_name':
      // If we just transitioned from awaiting_response, greet and ask
      message = RESPONSES.askName();
      break;
    case 'awaiting_need':
      message = RESPONSES.askNeed(lead.customerName || 'friend');
      break;
    case 'awaiting_preference':
      message = RESPONSES.askPreference();
      break;
    case 'completed':
      message = RESPONSES.complete();
      break;
    default:
      return; // No response needed
  }

  await sendTextMessage(client, lead.customerPhone, message);
}
```

### Voicenter CDR Worker

```typescript
// src/queue/workers/voicenter-cdr.worker.ts
import { Worker, Job } from 'bullmq';
import { createRedisConnection } from '../../lib/redis';
import { db } from '../../db/index';
import { missedCalls, leads, leadConversations, whatsappConnections } from '../../db/schema/index';
import { eq, and } from 'drizzle-orm';
import { MISSED_CALL_STATUSES, type VoicenterCDR } from '../../services/voicenter/types';
import { normalizeIsraeliPhone } from '../../lib/phone';

interface VoicenterCDRJobData {
  source: 'voicenter';
  eventId: string;
  eventType: 'cdr.received';
  payload: VoicenterCDR;
  receivedAt: string;
}

async function processVoicenterCDR(job: Job<VoicenterCDRJobData>): Promise<void> {
  const cdr = job.data.payload;

  // Skip if not a missed call
  if (!MISSED_CALL_STATUSES.includes(cdr.DialStatus)) {
    console.log(`[voicenter-cdr] Call ${cdr.CallID} answered (${cdr.DialStatus}), skipping`);
    return;
  }

  // Find tenant by business phone (DID)
  const connection = await db.query.whatsappConnections.findFirst({
    where: eq(whatsappConnections.displayPhoneNumber, normalizeIsraeliPhone(cdr.DID)),
  });

  if (!connection) {
    console.warn(`[voicenter-cdr] No WhatsApp connection for DID ${cdr.DID}`);
    return;
  }

  const tenantId = connection.tenantId;
  const callerPhone = normalizeIsraeliPhone(cdr.caller);

  // Idempotency check - skip if already processed
  const existing = await db.query.missedCalls.findFirst({
    where: eq(missedCalls.callId, cdr.CallID),
  });

  if (existing) {
    console.log(`[voicenter-cdr] Call ${cdr.CallID} already processed, skipping`);
    return;
  }

  // Store missed call record
  const [missedCall] = await db.insert(missedCalls).values({
    tenantId,
    callId: cdr.CallID,
    callerPhone,
    businessPhone: cdr.DID,
    status: cdr.DialStatus,
    calledAt: new Date(cdr.time * 1000),
  }).returning();

  console.log(`[voicenter-cdr] Recorded missed call ${cdr.CallID} from ${callerPhone}`);

  // Schedule delayed outreach (2 minutes)
  const { leadOutreachQueue } = await import('../queues');

  await leadOutreachQueue.add(
    'send-initial-message',
    {
      tenantId,
      missedCallId: missedCall.id,
      callerPhone,
    },
    {
      delay: 2 * 60 * 1000, // 2 minutes
      jobId: `lead-outreach-${missedCall.id}`, // For cancellation if needed
    }
  );

  console.log(`[voicenter-cdr] Scheduled outreach for ${callerPhone} in 2 minutes`);
}

export function startVoicenterCDRWorker(): Worker<VoicenterCDRJobData> {
  const worker = new Worker<VoicenterCDRJobData>(
    'webhooks',
    async (job) => {
      if (job.name === 'voicenter-cdr') {
        await processVoicenterCDR(job);
      }
    },
    {
      connection: createRedisConnection(),
      concurrency: 5,
    }
  );

  worker.on('completed', (job) => {
    if (job.name === 'voicenter-cdr') {
      console.log(`[voicenter-cdr] Job ${job.id} completed`);
    }
  });

  worker.on('failed', (job, err) => {
    if (job?.name === 'voicenter-cdr') {
      console.error(`[voicenter-cdr] Job ${job.id} failed:`, err.message);
    }
  });

  console.log('[voicenter-cdr] Worker started');
  return worker;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Regex-based intent extraction | LLM structured outputs | 2025 | Much better Hebrew understanding |
| Complex state machine libraries | Simple object-based machines | 2024 | Reduced complexity for linear flows |
| Polling for call data | Webhook-based CDR | Standard | Real-time processing |
| JSON.parse for LLM outputs | Constrained decoding (structured outputs) | Nov 2025 | Guaranteed valid JSON |

**Deprecated/outdated:**
- Manual JSON parsing of LLM responses: Use structured outputs with Zod
- XState for simple linear flows: Overkill, use simple state object

## Open Questions

1. **Voicenter Webhook Authentication**
   - What we know: Voicenter sends HTTP POST with CDR data
   - What's unclear: Exact authentication mechanism (API key header? Signature?)
   - Recommendation: Contact Voicenter support during implementation to get auth details

2. **Phone Number Format from Voicenter**
   - What we know: Examples show "0512345678" format
   - What's unclear: Is it always local format? Does it include country code?
   - Recommendation: Build flexible normalizer that handles multiple formats

3. **Owner Callback Detection**
   - What we know: Should cancel WhatsApp if owner called back within 2 minutes
   - What's unclear: How to reliably detect owner's outbound call to same number
   - Recommendation: Query recent CDRs before sending, or accept occasional redundant message

4. **Claude Haiku 4.5 Hebrew Performance**
   - What we know: Haiku is cost-effective, supports structured outputs
   - What's unclear: Hebrew extraction quality vs Sonnet
   - Recommendation: Test with real Hebrew messages during implementation; upgrade to Sonnet if needed

## Sources

### Primary (HIGH confidence)
- [Voicenter CDR Notification System API](https://www.voicenter.com/API/CDR-Notification-System-API) - Webhook concept and fields
- [Voicenter WebSDK GitHub](https://github.com/VoicenterTeam/VoicenterWebSDK) - CDR object structure, dial statuses
- [BullMQ Delayed Jobs Documentation](https://docs.bullmq.io/guide/jobs/delayed) - Delay implementation
- [Anthropic Structured Outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) - Zod integration, beta headers

### Secondary (MEDIUM confidence)
- [XState Documentation](https://stately.ai/docs/xstate) - State machine concepts (not used, but informed simple pattern)
- [Simple State Machines without Libraries](https://dev.to/davidkpiano/you-don-t-need-a-library-for-state-machines-k7h) - Object-based pattern
- [WhatsApp Lead Qualification Best Practices](https://www.flowcart.ai/blog/whatsapp-lead-generation) - Flow design principles
- [Anthropic Claude API Pricing](https://platform.claude.com/docs/en/about-claude/pricing) - Haiku pricing for cost estimation

### Tertiary (LOW confidence)
- Voicenter marketing pages - Could not fetch actual API documentation
- Various chatbot implementation examples - General patterns only

## Metadata

**Confidence breakdown:**
- Voicenter Integration: MEDIUM - Webhook concept clear, exact payload format needs verification
- State Machine: HIGH - Simple pattern well-documented, proven approach
- AI Intent Extraction: HIGH - Anthropic structured outputs well-documented
- BullMQ Delayed Jobs: HIGH - Already in project, pattern is straightforward

**Research date:** 2026-01-27
**Valid until:** 2026-02-27 (30 days - APIs are stable)

---

## Integration with Existing Infrastructure

### Extends Phase 2 WhatsApp Infrastructure

- Uses existing `whatsappConnections` for tenant lookup by phone number
- Uses existing `whatsappMessages` table for message tracking
- Uses existing `whatsappConversations` for 24-hour window
- Uses existing `WhatsAppClient` for sending messages
- Extends `whatsapp-message.worker.ts` to detect lead conversations

### New Queues Needed

```typescript
// Add to src/queue/queues.ts
export const leadOutreachQueue = new Queue('lead-outreach', {
  ...defaultQueueOptions,
  connection: createRedisConnection(),
});

export const leadReminderQueue = new Queue('lead-reminders', {
  ...defaultQueueOptions,
  connection: createRedisConnection(),
});
```

### Environment Variables

```bash
# Voicenter (existing infrastructure)
# Webhook URL will be configured in Voicenter dashboard

# Anthropic API for intent extraction
ANTHROPIC_API_KEY=sk-ant-...
```

### Cost Estimation

| Component | Unit Cost | Est. Monthly Volume | Monthly Cost |
|-----------|-----------|---------------------|--------------|
| Claude Haiku 4.5 | $1/M in, $5/M out | ~10K extractions | ~$2-5 |
| WhatsApp Messages | $0.004/utility | ~5K messages | ~$20 |
| BullMQ/Redis | Included | - | - |

Total incremental cost: ~$25/month for moderate usage.
