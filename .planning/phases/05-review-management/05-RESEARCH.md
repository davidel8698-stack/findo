# Phase 5: Review Management - Research

**Researched:** 2026-01-28
**Domain:** Google Reviews API, AI Reply Generation, WhatsApp Interactive Messages
**Confidence:** HIGH

## Summary

Phase 5 implements autonomous review management: positive reviews (4-5 stars) get AI-generated auto-replies, negative reviews (1-3 stars) get drafted responses sent to the owner for approval via WhatsApp. The phase builds on existing infrastructure from Phase 4 (Google OAuth, reviews service, token refresh) and Phase 3 (WhatsApp messaging, AI with Claude).

Key research areas:
- **Review Detection**: Hourly polling via existing scheduled job infrastructure (review-check job already registered in scheduler/jobs.ts)
- **AI Reply Generation**: Claude Haiku 4.5 with structured outputs for personalized Hebrew replies
- **Owner Approval Flow**: WhatsApp interactive buttons for approve/edit workflow
- **State Tracking**: Database schema for processed reviews and pending approvals

**Primary recommendation:** Use hourly polling for review detection (Cloud Pub/Sub unreliable per Phase 4 research), Claude Haiku 4.5 with structured outputs for reply generation, and WhatsApp interactive reply buttons within 24-hour session windows for owner approval flow.

## Standard Stack

The established libraries/tools for this domain:

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@anthropic-ai/sdk` | installed | AI reply generation | Already used in Phase 3 for intent extraction |
| `googleapis` | ^170.x | Google Reviews API | Already used in Phase 4 for OAuth and reviews |
| `bullmq` | installed | Job scheduling | Already used for scheduled jobs |

### Supporting (Already Installed)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `drizzle-orm` | installed | Database operations | Review tracking schema |
| WhatsApp client | custom | Interactive messages | Owner approval notifications |

### New Dependencies
None required - all necessary libraries already installed.

**Installation:**
```bash
# No new packages needed
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── db/schema/
│   └── reviews.ts              # Review tracking schema (NEW)
├── services/
│   ├── google/
│   │   └── reviews.ts          # (EXISTS) Add new review detection helpers
│   └── review-management/
│       ├── index.ts            # Orchestration service (NEW)
│       ├── reply-generator.ts  # Claude AI reply generation (NEW)
│       └── approval-flow.ts    # Owner WhatsApp approval (NEW)
├── queue/workers/
│   └── review-poll.worker.ts   # Hourly review polling worker (NEW)
└── scheduler/
    └── jobs.ts                 # (EXISTS) review-check job already registered
```

### Pattern 1: Review State Machine
**What:** Track review lifecycle from detection through reply posting
**When to use:** All review processing

```typescript
// Review states
type ReviewStatus =
  | 'detected'        // New review found
  | 'auto_replied'    // Positive: AI reply posted
  | 'pending_approval' // Negative: Awaiting owner response
  | 'approved'        // Owner approved draft
  | 'edited'          // Owner provided custom reply
  | 'replied'         // Final reply posted
  | 'expired';        // 48h timeout, draft auto-posted
```

### Pattern 2: AI Reply Generation with Structured Output
**What:** Use Claude Haiku 4.5 with structured outputs for consistent reply format
**When to use:** Generating both positive auto-replies and negative review drafts

```typescript
// Source: https://platform.claude.com/docs/en/build-with-claude/structured-outputs
import Anthropic from '@anthropic-ai/sdk';

interface ReviewReply {
  replyText: string;      // Hebrew reply text
  tone: 'warm' | 'apologetic' | 'neutral';
  referencedContent: string;  // What from review was referenced
}

const anthropic = new Anthropic();

async function generateReviewReply(
  review: { reviewerName: string; comment?: string; starRating: number },
  businessName: string,
  isPositive: boolean
): Promise<ReviewReply> {
  const response = await anthropic.beta.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    betas: ['structured-outputs-2025-11-13'],
    messages: [{
      role: 'user',
      content: `Generate a ${isPositive ? 'thank you' : 'apologetic'} reply to this Google review.

Business: ${businessName}
Reviewer: ${review.reviewerName}
Rating: ${review.starRating} stars
Review: ${review.comment || '(no text, rating only)'}

Requirements:
- Write in Hebrew
- 1-2 sentences maximum
- Warm, personal tone (not corporate)
- Reference something specific they mentioned (if available)
- No emojis
- Sign as the business (not "the team")`
    }],
    output_format: {
      type: 'json_schema',
      schema: {
        type: 'object',
        properties: {
          replyText: { type: 'string' },
          tone: { type: 'string', enum: ['warm', 'apologetic', 'neutral'] },
          referencedContent: { type: 'string' }
        },
        required: ['replyText', 'tone', 'referencedContent'],
        additionalProperties: false
      }
    }
  });

  return JSON.parse(response.content[0].text);
}
```

### Pattern 3: WhatsApp Interactive Buttons for Approval
**What:** Send review notification with approve/edit buttons within 24-hour session
**When to use:** Negative review owner notification

```typescript
// Source: WhatsApp Cloud API interactive messages
// Note: Interactive buttons work within 24-hour session OR as template
async function sendApprovalRequest(
  client: WhatsAppClient,
  ownerPhone: string,
  review: Review,
  draftReply: string
): Promise<MessageSendResult> {
  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: ownerPhone,
    type: 'interactive',
    interactive: {
      type: 'button',
      body: {
        text: `ביקורת חדשה (${review.starRating} כוכבים)

${review.reviewerName}: "${review.comment || 'ללא טקסט'}"

תשובה מוצעת:
"${draftReply}"

מה תרצה לעשות?`
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: `approve_${review.reviewId}`,
              title: 'אשר ושלח'
            }
          },
          {
            type: 'reply',
            reply: {
              id: `edit_${review.reviewId}`,
              title: 'רוצה לערוך'
            }
          }
        ]
      }
    }
  };

  const response = await client.request<SendMessageResponse>(
    client.messagesEndpoint,
    { method: 'POST', body: JSON.stringify(payload) }
  );

  return {
    messageId: response.messages[0].id,
    waId: response.contacts[0].wa_id,
  };
}
```

### Pattern 4: Polling-Based Review Detection
**What:** Compare current reviews against last known state to detect new reviews
**When to use:** Hourly review-check job

```typescript
// Source: Based on existing listReviews from Phase 4
async function detectNewReviews(tenantId: string): Promise<Review[]> {
  const connection = await getGoogleConnection(tenantId);
  if (!connection || connection.status !== 'active') return [];

  // Get last poll timestamp
  const lastPoll = await getLastReviewPollTimestamp(tenantId);

  // Fetch recent reviews ordered by updateTime
  const { reviews } = await listReviews(
    tenantId,
    connection.accountId,
    connection.locationId!,
    { orderBy: 'updateTime desc', pageSize: 50 }
  );

  // Filter to reviews we haven't processed
  const newReviews = reviews.filter(r => {
    const updateTime = new Date(r.updateTime);
    return updateTime > lastPoll && !r.reply; // Unreplied reviews since last poll
  });

  // Update poll timestamp
  await updateLastReviewPollTimestamp(tenantId);

  return newReviews;
}
```

### Anti-Patterns to Avoid
- **Relying on Cloud Pub/Sub alone**: Per Phase 4 research, unreliable for some accounts; polling is primary
- **Generating replies without review context**: Always pass reviewer name and comment to AI
- **Sending notifications outside 24-hour window**: Use template messages for initial contact, interactive only in session
- **Posting reply without length validation**: Google limits replies to 4096 bytes (Hebrew = 2-3 bytes/char)
- **Ignoring review updates**: A review can be edited after reply; track updateTime to detect changes

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| AI reply generation | String templates | Claude structured outputs | Handles variation, tone, Hebrew naturally |
| Reply length validation | Manual byte counting | Buffer.byteLength() | Already in reviews.ts |
| Job scheduling | setInterval | BullMQ repeatable jobs | Already registered in jobs.ts |
| Review deduplication | Custom tracking | reviewId primary key | Google provides unique ID |
| WhatsApp buttons | Text parsing | Interactive messages | Built-in button click handling |

**Key insight:** The core infrastructure exists - this phase is orchestration, not building new primitives.

## Common Pitfalls

### Pitfall 1: Reply Byte Limit Exceeded
**What goes wrong:** Claude generates Hebrew reply that exceeds 4096 bytes
**Why it happens:** Hebrew chars are 2-3 bytes; 1000 characters = ~2500 bytes, safe. But AI might generate longer.
**How to avoid:**
  - Set max_tokens: 512 (limits output)
  - Add explicit "1-2 sentences" instruction
  - Validate before posting: `Buffer.byteLength(reply, 'utf8') <= 4096`
  - Truncate with ellipsis if necessary
**Warning signs:** Google API returns 400 error on reply post

### Pitfall 2: WhatsApp Session Expiry for Approval
**What goes wrong:** Owner receives interactive buttons but can't click (24h expired)
**Why it happens:** Negative review notification sent when no active session
**How to avoid:**
  - Track session expiry for owner's phone
  - Use template message if no active session
  - OR: Use text message with "reply 1 to approve, or type your response"
**Warning signs:** Interactive message fails with session error

### Pitfall 3: 3-Star Edge Case Misclassification
**What goes wrong:** 3-star review treated as negative when it's actually positive
**Why it happens:** 3-star can be "good experience but one issue" or "disappointing"
**How to avoid:**
  - Per CONTEXT.md: Analyze sentiment for 3-star reviews
  - Use Claude to classify: "Is this review positive or negative overall?"
  - Default to negative if uncertain (safer to get owner approval)
**Warning signs:** Unnecessary owner notifications for positive 3-star reviews

### Pitfall 4: Duplicate Reply Posting
**What goes wrong:** Same reply posted twice to a review
**Why it happens:** Worker retries after successful post but before status update
**How to avoid:**
  - Use atomic operation: check reply status + post + update status in transaction
  - Check review.reply exists before posting
  - Use idempotency key based on reviewId
**Warning signs:** Google shows duplicate replies (first one wins, subsequent fail)

### Pitfall 5: Missing 48h Auto-Post
**What goes wrong:** Negative review never gets a response
**Why it happens:** Owner never responds, no auto-post mechanism
**How to avoid:**
  - Schedule 48h reminder job when creating pending_approval record
  - After reminder, schedule another 48h job for auto-post
  - State machine: pending_approval -> reminded -> expired (auto-posted)
**Warning signs:** Old negative reviews with no replies

### Pitfall 6: Review Update After Reply
**What goes wrong:** Customer updates review (changes rating or text) after reply
**Why it happens:** Google allows review edits anytime
**How to avoid:**
  - Track review updateTime in database
  - On poll, compare updateTime to detect changes
  - Alert owner if rating changed significantly (e.g., 4 -> 2)
**Warning signs:** Reply doesn't match current review content

## Code Examples

Verified patterns from official sources:

### Review Tracking Schema
```typescript
// Source: Based on existing schema patterns in src/db/schema/
import { pgTable, uuid, varchar, timestamp, integer, text, pgEnum, index } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { googleConnections } from './google';

export const reviewStatusEnum = pgEnum('review_status', [
  'detected',
  'auto_replied',
  'pending_approval',
  'reminded',
  'approved',
  'edited',
  'replied',
  'expired'
]);

export const processedReviews = pgTable('processed_reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  googleConnectionId: uuid('google_connection_id').notNull().references(() => googleConnections.id),

  // Google review identifiers
  reviewId: varchar('review_id', { length: 255 }).notNull(),
  reviewName: varchar('review_name', { length: 512 }).notNull(), // Full resource name

  // Review content (snapshot at detection time)
  reviewerName: varchar('reviewer_name', { length: 255 }).notNull(),
  starRating: integer('star_rating').notNull(), // 1-5
  comment: text('comment'), // Nullable for rating-only reviews
  reviewCreateTime: timestamp('review_create_time', { withTimezone: true }).notNull(),
  reviewUpdateTime: timestamp('review_update_time', { withTimezone: true }).notNull(),

  // Processing state
  status: reviewStatusEnum('status').default('detected').notNull(),
  isPositive: integer('is_positive').notNull(), // 1 = positive (4-5 or positive 3), 0 = negative

  // AI-generated reply
  draftReply: text('draft_reply'),
  draftTone: varchar('draft_tone', { length: 20 }), // warm, apologetic, neutral

  // Final reply (may differ from draft if owner edited)
  postedReply: text('posted_reply'),
  repliedAt: timestamp('replied_at', { withTimezone: true }),

  // Owner approval tracking
  approvalMessageId: varchar('approval_message_id', { length: 255 }), // WhatsApp message ID
  approvalSentAt: timestamp('approval_sent_at', { withTimezone: true }),
  reminderSentAt: timestamp('reminder_sent_at', { withTimezone: true }),
  ownerResponse: text('owner_response'), // If edited, what they typed

  // Timestamps
  detectedAt: timestamp('detected_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  // Prevent duplicate processing
  uniqueReview: index('processed_reviews_review_id_idx').on(table.tenantId, table.reviewId).unique(),
  // Find pending approvals for reminders
  statusIdx: index('processed_reviews_status_idx').on(table.status),
  // Find reviews needing auto-post
  approvalSentIdx: index('processed_reviews_approval_sent_idx').on(table.approvalSentAt),
}));

// Last poll tracking per tenant
export const reviewPollState = pgTable('review_poll_state', {
  tenantId: uuid('tenant_id').primaryKey().references(() => tenants.id, { onDelete: 'cascade' }),
  lastPollAt: timestamp('last_poll_at', { withTimezone: true }).defaultNow().notNull(),
  lastReviewUpdateTime: timestamp('last_review_update_time', { withTimezone: true }),
});
```

### Review Poll Worker
```typescript
// Source: Based on existing worker patterns
import { Worker, Job } from 'bullmq';
import { createRedisConnection } from '../lib/redis';
import { db } from '../db/index';
import { googleConnections } from '../db/schema/google';
import { eq } from 'drizzle-orm';
import { listReviews } from '../services/google/reviews';
import { processNewReview } from '../services/review-management';

export const reviewPollWorker = new Worker(
  'scheduled',
  async (job: Job) => {
    if (job.name !== 'review-check') return;

    console.log('[review-poll] Starting hourly review check');

    // Get all active Google connections
    const connections = await db.query.googleConnections.findMany({
      where: eq(googleConnections.status, 'active'),
    });

    console.log(`[review-poll] Checking ${connections.length} tenants`);

    for (const connection of connections) {
      if (!connection.locationId) {
        console.log(`[review-poll] Skipping tenant ${connection.tenantId} - no location`);
        continue;
      }

      try {
        // Detect new reviews
        const newReviews = await detectNewReviews(connection.tenantId);

        for (const review of newReviews) {
          await processNewReview(connection.tenantId, review);
        }

        if (newReviews.length > 0) {
          console.log(`[review-poll] Processed ${newReviews.length} new reviews for tenant ${connection.tenantId}`);
        }

        // Rate limit protection
        await sleep(100);
      } catch (error) {
        console.error(`[review-poll] Error for tenant ${connection.tenantId}:`, error);
        // Continue with other tenants
      }
    }

    console.log('[review-poll] Completed hourly review check');
  },
  {
    connection: createRedisConnection(),
    concurrency: 1, // Single worker to respect rate limits
  }
);
```

### Sentiment Analysis for 3-Star Reviews
```typescript
// Source: Pattern based on existing intent.ts
async function classifyReviewSentiment(
  comment: string | undefined,
  starRating: number
): Promise<boolean> {
  // Clear positive or negative
  if (starRating >= 4) return true;
  if (starRating <= 2) return false;

  // 3-star: analyze sentiment
  if (!comment) {
    // No text, 3-star without context -> treat as negative (safer)
    return false;
  }

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 64,
    messages: [{
      role: 'user',
      content: `This is a 3-star Google review. Is the overall sentiment POSITIVE or NEGATIVE?

Review: "${comment}"

Reply with only one word: POSITIVE or NEGATIVE`
    }],
  });

  const text = response.content[0].text.toUpperCase();
  return text.includes('POSITIVE');
}
```

### Owner Response Handler (WhatsApp Webhook)
```typescript
// Source: Extend existing webhook processing
async function handleOwnerReviewResponse(
  tenantId: string,
  messageFrom: string,
  messageText: string,
  buttonId?: string
): Promise<void> {
  // Check if this is a button click
  if (buttonId?.startsWith('approve_')) {
    const reviewId = buttonId.replace('approve_', '');
    await approveReviewReply(tenantId, reviewId);
    return;
  }

  if (buttonId?.startsWith('edit_')) {
    const reviewId = buttonId.replace('edit_', '');
    await requestEditedReply(tenantId, reviewId);
    return;
  }

  // Check if this is a text response to pending edit request
  const pendingEdit = await getPendingEditForOwner(tenantId, messageFrom);
  if (pendingEdit) {
    await submitEditedReply(tenantId, pendingEdit.reviewId, messageText);
    return;
  }

  // Check for Hebrew approval command
  if (messageText.trim() === 'אשר') {
    const latestPending = await getLatestPendingApproval(tenantId, messageFrom);
    if (latestPending) {
      await approveReviewReply(tenantId, latestPending.reviewId);
      return;
    }
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Parse AI response as text | Structured outputs beta | Nov 2025 | Guaranteed JSON format |
| claude-3-haiku-20240307 | claude-haiku-4-5-20251001 | Oct 2025 | Better Hebrew, extended thinking |
| Text-based approval | Interactive buttons | 2024+ | Better UX, trackable clicks |
| Cloud Pub/Sub for reviews | Polling as primary | Ongoing | More reliable detection |

**Deprecated/outdated:**
- `claude-3-haiku-20240307`: Still works but newer claude-haiku-4-5-20251001 is better for Hebrew
- Conversation-based WhatsApp pricing: Changed to per-message July 2025 (service replies still free)

## Open Questions

Things that couldn't be fully resolved:

1. **WhatsApp Template Requirement for Initial Notification**
   - What we know: Interactive buttons need 24-hour session OR approved template
   - What's unclear: If owner hasn't messaged recently, how to start conversation
   - Recommendation: Create "negative_review_alert" template with buttons, OR use text + instructions

2. **Multiple Reviews from Same Reviewer**
   - What we know: Claude's discretion per CONTEXT.md
   - What's unclear: Best approach (batch into single message? Separate handling?)
   - Recommendation: Process individually, but add de-duplication window (5 min) to batch into single notification

3. **Review Update Detection Timing**
   - What we know: Track updateTime, alert if rating changes significantly
   - What's unclear: How quickly after reply can customer edit?
   - Recommendation: Track updateTime on each poll; if review updated after reply, create activity event

## Sources

### Primary (HIGH confidence)
- Phase 4 RESEARCH.md - Google Reviews API patterns
- [Anthropic Structured Outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs) - Beta feature for JSON outputs
- [Claude Haiku 4.5 Release](https://openrouter.ai/anthropic/claude-haiku-4.5) - Model capabilities
- Existing codebase: src/services/google/reviews.ts, src/services/lead-capture/intent.ts

### Secondary (MEDIUM confidence)
- [WhatsApp Interactive Messages](https://whatsapp.github.io/WhatsApp-Nodejs-SDK/api-reference/messages/interactive/) - Button format
- [Google Reviews API Reference](https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews) - Reply endpoint

### Tertiary (LOW confidence)
- WhatsApp pricing changes (July 2025) - needs verification for current rates
- Review update timing - based on general Google behavior

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already installed and used
- Architecture: HIGH - Builds directly on Phase 3 and 4 patterns
- Pitfalls: MEDIUM - Based on API documentation and common patterns
- Owner approval flow: MEDIUM - WhatsApp session handling needs validation

**Research date:** 2026-01-28
**Valid until:** 2026-02-28 (30 days - stable APIs, established patterns)

---

## Appendix: Required Environment Variables

All already configured from previous phases:
```bash
# Already set (Phase 4)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=...

# Already set (Phase 3)
ANTHROPIC_API_KEY=...

# Already set (Phase 2)
META_APP_ID=...
META_APP_SECRET=...
WHATSAPP_WEBHOOK_VERIFY_TOKEN=...
```

## Appendix: Message Templates Needed

If using templates for owner notifications (recommended for reliability):

1. **negative_review_alert** - Alert for 1-3 star reviews
   - Body: Review details + draft reply
   - Buttons: "Approve" + "Edit"
   - Category: Utility
   - Language: Hebrew

2. **review_reminder** - 48h reminder
   - Body: Reminder that review needs response
   - Buttons: "Approve Now" + "Edit"
   - Category: Utility
   - Language: Hebrew

## Appendix: Job Schedule

```typescript
// Already registered in scheduler/jobs.ts:
// 'review-check' - runs every hour at minute 0

// New jobs to add:
// 'review-reminder' - runs every hour, checks for 48h+ pending approvals
// 'review-auto-post' - runs every hour, posts expired (48h after reminder) drafts
```
