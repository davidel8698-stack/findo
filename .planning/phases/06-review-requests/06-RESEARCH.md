# Phase 6: Review Requests - Research

**Researched:** 2026-01-28
**Domain:** Invoice Detection (Greeninvoice/iCount), Review Request Timing, WhatsApp Templates
**Confidence:** MEDIUM

## Summary

Phase 6 implements automated review request workflows triggered by completed service (invoice creation). The phase involves integrating with two Israeli accounting platforms (Greeninvoice and iCount), scheduling delayed review requests (24 hours after service), and implementing smart follow-up (one reminder after 3 days, then stop).

Key research findings:
- **Greeninvoice**: Has webhooks but currently only for expense-related events, NOT invoice creation. Document type 305 = Invoice. Polling via API is the reliable approach.
- **iCount**: No webhook system found. API supports `doc_search` for listing documents by date. Polling is the only option.
- **Polling Strategy**: Both systems require polling for invoice detection. Use hourly polling with date filtering to detect new invoices.
- **WhatsApp Templates**: Required for review request messages (customer hasn't messaged us first). Need approved template with direct Google review link.

**Primary recommendation:** Use hourly polling for both Greeninvoice and iCount (webhooks unreliable/unavailable for invoice creation). Store last poll timestamp per tenant. WhatsApp template required for initial outreach. Schedule delayed jobs (24h, +3 days) via BullMQ delayed jobs.

## Standard Stack

The established libraries/tools for this domain:

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `bullmq` | installed | Delayed job scheduling | Already used for review-reminder, supports delay |
| `drizzle-orm` | installed | Database operations | Existing schema patterns |
| WhatsApp client | custom | Template messages | Existing sendTemplateMessage function |

### New Dependencies
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| None | - | - | All libraries already installed |

**No new packages required** - existing HTTP/fetch capabilities sufficient for Greeninvoice/iCount API calls.

**Installation:**
```bash
# No new packages needed
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── db/schema/
│   └── invoices.ts              # Invoice tracking schema (NEW)
├── services/
│   ├── greeninvoice/
│   │   ├── index.ts             # Client and authentication (NEW)
│   │   └── documents.ts         # Document listing/search (NEW)
│   ├── icount/
│   │   ├── index.ts             # Client and authentication (NEW)
│   │   └── documents.ts         # Document listing/search (NEW)
│   └── review-request/
│       ├── index.ts             # Orchestration service (NEW)
│       ├── triggers.ts          # Invoice detection logic (NEW)
│       └── messages.ts          # WhatsApp message generation (NEW)
├── routes/
│   └── webhooks.ts              # (EXISTS) Add greeninvoice/icount endpoints
├── queue/workers/
│   ├── invoice-poll.worker.ts   # Hourly invoice polling (NEW)
│   └── review-request.worker.ts # Send review request after delay (NEW)
└── scheduler/
    └── jobs.ts                  # (EXISTS) Add invoice-poll job
```

### Pattern 1: Polling-Based Invoice Detection (Both Platforms)
**What:** Hourly poll both Greeninvoice and iCount APIs for new invoices since last poll
**When to use:** All invoice detection (webhooks unreliable or unavailable)

```typescript
// Source: Based on existing review-poll.worker.ts pattern
interface InvoicePollState {
  tenantId: string;
  provider: 'greeninvoice' | 'icount';
  lastPollAt: Date;
  lastInvoiceDate: Date | null;
}

async function pollForNewInvoices(
  tenantId: string,
  provider: 'greeninvoice' | 'icount'
): Promise<DetectedInvoice[]> {
  const state = await getInvoicePollState(tenantId, provider);
  const lastDate = state?.lastInvoiceDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days back for first poll

  let invoices: DetectedInvoice[];

  if (provider === 'greeninvoice') {
    invoices = await fetchGreeninvoiceDocuments(tenantId, lastDate);
  } else {
    invoices = await fetchIcountDocuments(tenantId, lastDate);
  }

  // Filter to only new invoices (type 305 for Greeninvoice, 'invoice' for iCount)
  const newInvoices = invoices.filter(inv =>
    new Date(inv.createdAt) > lastDate &&
    !await isInvoiceProcessed(tenantId, inv.invoiceId, provider)
  );

  // Update poll state
  await updateInvoicePollState(tenantId, provider, {
    lastPollAt: new Date(),
    lastInvoiceDate: newInvoices.length > 0
      ? new Date(Math.max(...newInvoices.map(i => new Date(i.createdAt).getTime())))
      : state?.lastInvoiceDate || null,
  });

  return newInvoices;
}
```

### Pattern 2: Greeninvoice API Client
**What:** JWT-based authentication and document search
**When to use:** Tenants using Greeninvoice

```typescript
// Source: Greeninvoice API documentation (greeninvoice.docs.apiary.io)
const GREENINVOICE_API = 'https://api.greeninvoice.co.il/api/v1';

interface GreeninvoiceAuth {
  id: string;    // API Key ID
  secret: string; // API Key Secret
}

async function getGreeninvoiceToken(auth: GreeninvoiceAuth): Promise<string> {
  const response = await fetch(`${GREENINVOICE_API}/account/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: auth.id, secret: auth.secret }),
  });

  if (!response.ok) throw new Error('Greeninvoice auth failed');

  const data = await response.json();
  return data.token; // JWT valid for 1 hour
}

// Document types per Greeninvoice API:
// 300 = Proforma Invoice
// 305 = Invoice (tax invoice) - THIS IS WHAT WE WANT
// 320 = Invoice/Receipt
// 400 = Receipt

async function fetchGreeninvoiceDocuments(
  tenantId: string,
  fromDate: Date
): Promise<DetectedInvoice[]> {
  const connection = await getAccountingConnection(tenantId, 'greeninvoice');
  if (!connection) return [];

  const token = await getGreeninvoiceToken(connection.credentials);

  const response = await fetch(`${GREENINVOICE_API}/documents/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      type: [305, 320], // Invoice and Invoice/Receipt
      fromDate: fromDate.toISOString().split('T')[0],
      toDate: new Date().toISOString().split('T')[0],
      pageSize: 100,
      sort: 'createdAt',
      sortType: 'desc',
    }),
  });

  if (!response.ok) throw new Error(`Greeninvoice search failed: ${response.status}`);

  const data = await response.json();
  return data.items.map((doc: GreeninvoiceDocument) => ({
    invoiceId: doc.id,
    invoiceNumber: doc.number,
    customerName: doc.client?.name || 'Unknown',
    customerPhone: doc.client?.phone,
    customerEmail: doc.client?.emails?.[0],
    amount: doc.total,
    currency: doc.currency,
    createdAt: doc.createdAt,
    provider: 'greeninvoice' as const,
  }));
}
```

### Pattern 3: iCount API Client
**What:** Session-based authentication and document search
**When to use:** Tenants using iCount

```typescript
// Source: iCount API documentation (api.icount.co.il)
const ICOUNT_API = 'https://api.icount.co.il';

interface IcountAuth {
  companyId: string;
  username: string;
  password: string;
}

interface IcountSession {
  sid: string;
  expiresAt: Date;
}

async function getIcountSession(auth: IcountAuth): Promise<IcountSession> {
  const response = await fetch(`${ICOUNT_API}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      cid: auth.companyId,
      user: auth.username,
      pass: auth.password,
    }),
  });

  if (!response.ok) throw new Error('iCount auth failed');

  const data = await response.json();
  if (data.status !== 'ok') throw new Error(`iCount error: ${data.reason}`);

  return {
    sid: data.sid,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
  };
}

// iCount document types:
// invoice, invrec (invoice+receipt), receipt, refund, order, offer, delivery, deal

async function fetchIcountDocuments(
  tenantId: string,
  fromDate: Date
): Promise<DetectedInvoice[]> {
  const connection = await getAccountingConnection(tenantId, 'icount');
  if (!connection) return [];

  const session = await getIcountSession(connection.credentials);

  const response = await fetch(`${ICOUNT_API}/api/doc_search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      sid: session.sid,
      doctype: 'invoice,invrec', // Both invoice types
      from_date: fromDate.toISOString().split('T')[0],
      to_date: new Date().toISOString().split('T')[0],
    }),
  });

  if (!response.ok) throw new Error(`iCount search failed: ${response.status}`);

  const data = await response.json();
  return data.docs.map((doc: IcountDocument) => ({
    invoiceId: doc.docnum,
    invoiceNumber: doc.docnum,
    customerName: doc.client_name || 'Unknown',
    customerPhone: doc.client_phone,
    customerEmail: doc.client_email,
    amount: doc.total,
    currency: 'ILS',
    createdAt: doc.docdate,
    provider: 'icount' as const,
  }));
}
```

### Pattern 4: Delayed Review Request via BullMQ
**What:** Schedule review request 24 hours after invoice detection
**When to use:** Every detected invoice triggers delayed job

```typescript
// Source: Based on existing lead-reminder pattern
import { reviewRequestQueue } from '../queue/index';

async function scheduleReviewRequest(
  tenantId: string,
  invoice: DetectedInvoice
): Promise<void> {
  // 24 hours delay
  const delayMs = 24 * 60 * 60 * 1000;

  await reviewRequestQueue.add(
    'send-review-request',
    {
      tenantId,
      invoiceId: invoice.invoiceId,
      provider: invoice.provider,
      customerPhone: invoice.customerPhone,
      customerName: invoice.customerName,
    },
    {
      delay: delayMs,
      jobId: `review-req-${tenantId}-${invoice.provider}-${invoice.invoiceId}`,
      removeOnComplete: true,
    }
  );

  console.log(
    `[review-request] Scheduled request for ${invoice.invoiceId} in 24h`
  );
}
```

### Pattern 5: Google Review Link Generation
**What:** Generate direct Google review link from Place ID
**When to use:** Creating review request message

```typescript
// Source: Google Places API documentation
function generateGoogleReviewLink(placeId: string): string {
  return `https://search.google.com/local/writereview?placeid=${placeId}`;
}

// Shortened version using URL shortener (optional)
async function generateShortReviewLink(
  tenantId: string,
  placeId: string
): Promise<string> {
  const longUrl = generateGoogleReviewLink(placeId);

  // Option: Use bit.ly or similar for shorter URLs
  // For now, return direct link - WhatsApp handles long URLs fine
  return longUrl;
}
```

### Pattern 6: Review Request with One Reminder
**What:** Send initial request, then 1 reminder after 3 days, then stop
**When to use:** Review request lifecycle

```typescript
// Source: Phase requirements (REVW-06, REVW-07)
type ReviewRequestStatus =
  | 'pending'       // Invoice detected, waiting 24h
  | 'requested'     // Initial request sent
  | 'reminded'      // 3-day reminder sent
  | 'completed'     // Customer left review
  | 'stopped';      // No review, stopped (no spam)

async function sendReviewRequest(
  tenantId: string,
  request: ReviewRequestRecord
): Promise<void> {
  const client = await createWhatsAppClient(tenantId);
  if (!client) throw new Error('No WhatsApp client');

  const tenant = await getTenant(tenantId);
  const reviewLink = generateGoogleReviewLink(tenant.googlePlaceId);

  // Must use template (customer hasn't messaged us)
  await sendTemplateMessage(
    client,
    request.customerPhone,
    'review_request', // Template name - must be pre-approved
    'he',
    [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: request.customerName || '' },
          { type: 'text', text: tenant.businessName },
        ],
      },
      {
        type: 'button',
        sub_type: 'url',
        index: 0,
        parameters: [{ type: 'text', text: reviewLink }],
      },
    ]
  );

  // Update status and schedule reminder
  await updateReviewRequest(request.id, {
    status: 'requested',
    requestedAt: new Date(),
  });

  // Schedule 3-day reminder
  await reviewRequestQueue.add(
    'send-review-reminder',
    { reviewRequestId: request.id },
    {
      delay: 3 * 24 * 60 * 60 * 1000, // 3 days
      jobId: `review-reminder-${request.id}`,
    }
  );
}

async function sendReviewReminder(reviewRequestId: string): Promise<void> {
  const request = await getReviewRequest(reviewRequestId);

  // Check if already reviewed (via Google polling in Phase 5)
  if (request.status === 'completed') {
    console.log(`[review-request] ${reviewRequestId} already reviewed, skipping`);
    return;
  }

  // Send reminder (only one!)
  const client = await createWhatsAppClient(request.tenantId);
  const tenant = await getTenant(request.tenantId);
  const reviewLink = generateGoogleReviewLink(tenant.googlePlaceId);

  await sendTemplateMessage(
    client,
    request.customerPhone,
    'review_reminder', // Reminder template
    'he',
    [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: tenant.businessName },
        ],
      },
      {
        type: 'button',
        sub_type: 'url',
        index: 0,
        parameters: [{ type: 'text', text: reviewLink }],
      },
    ]
  );

  // Mark as stopped - no more messages (REVW-07: no spam)
  await updateReviewRequest(request.id, {
    status: 'stopped',
    reminderSentAt: new Date(),
  });
}
```

### Anti-Patterns to Avoid
- **Relying on Greeninvoice webhooks for invoice creation**: Documented webhooks only support expense events, not document creation
- **Assuming iCount has webhooks**: No webhook system found - polling only
- **Sending review requests without delay**: 24-hour delay is required (REVW-04)
- **Sending multiple reminders**: Only 1 reminder allowed, then stop (REVW-06, REVW-07)
- **Using freeform messages for review requests**: Customer hasn't messaged us - template required
- **Storing accounting credentials in plaintext**: Use token-vault encryption

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Delayed job scheduling | setTimeout | BullMQ delayed jobs | Survives restarts, visible in queue |
| Template message sending | Custom HTTP | sendTemplateMessage() | Already handles all edge cases |
| Credential encryption | Custom | token-vault service | Already used for OAuth tokens |
| Idempotency | Manual dedup | Job IDs with invoice ID | BullMQ handles deduplication |
| Review link generation | Manual URL building | generateGoogleReviewLink() | Consistent format |

**Key insight:** The infrastructure for delayed messaging and webhook processing exists from Phases 3 and 5. This phase orchestrates existing capabilities for a new trigger source (invoices).

## Common Pitfalls

### Pitfall 1: Greeninvoice JWT Expiration
**What goes wrong:** API calls fail with 401 after 1 hour
**Why it happens:** Greeninvoice JWT tokens expire after 1 hour
**How to avoid:**
  - Cache token with expiration tracking
  - Refresh token 5 minutes before expiration
  - Handle 401 by re-authenticating
**Warning signs:** Intermittent 401 errors in invoice poll worker

### Pitfall 2: iCount Session Management
**What goes wrong:** Concurrent requests fail or corrupt session
**Why it happens:** iCount uses session ID (sid) that may not support concurrency
**How to avoid:**
  - Use single session per polling cycle
  - Logout after polling completes
  - Don't share sessions across workers
**Warning signs:** "Session expired" or auth errors

### Pitfall 3: Missing Customer Phone on Invoice
**What goes wrong:** Can't send review request - no phone number
**Why it happens:** Customer info incomplete in accounting system
**How to avoid:**
  - Check for phone before scheduling review request
  - Log as warning, don't fail job
  - Consider email fallback (future enhancement)
**Warning signs:** Many invoices skipped due to missing phone

### Pitfall 4: WhatsApp Template Not Approved
**What goes wrong:** Review requests fail to send
**Why it happens:** Template not submitted or rejected by Meta
**How to avoid:**
  - Create and submit templates BEFORE implementing code
  - Use utility category (not marketing to avoid restrictions)
  - Follow Meta's template guidelines (no promotional language)
**Warning signs:** Template message API returns rejection error

### Pitfall 5: Duplicate Review Requests
**What goes wrong:** Customer receives multiple requests for same service
**Why it happens:** Invoice detected multiple times, or reprocessed after restart
**How to avoid:**
  - Track processed invoices in database (unique constraint on invoiceId + provider)
  - Use BullMQ job ID for deduplication
  - Check existing review request before scheduling
**Warning signs:** Customer complaints about spam

### Pitfall 6: Review Detection After Request Sent
**What goes wrong:** Reminder sent even though customer already reviewed
**Why it happens:** Review detection (Phase 5) and review request system not synchronized
**How to avoid:**
  - Cross-reference with processed_reviews table
  - Match by customer phone (approximate) or reviewer name
  - Check review status before sending reminder
**Warning signs:** Customer receives reminder after leaving review

### Pitfall 7: Manual Trigger Without Invoice
**What goes wrong:** Owner marks service complete but no invoice data
**Why it happens:** Manual trigger (REVW-03) needs different data source
**How to avoid:**
  - Manual trigger requires customer phone and name input
  - Create synthetic "invoice" record for tracking
  - Same delayed job flow as invoice-triggered requests
**Warning signs:** Manual trigger button does nothing

## Code Examples

Verified patterns from official sources:

### Invoice Tracking Schema
```typescript
// Source: Based on existing schema patterns
import { pgTable, uuid, varchar, text, timestamp, pgEnum, index, unique } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';

export const accountingProviderEnum = pgEnum('accounting_provider', [
  'greeninvoice',
  'icount',
]);

export const reviewRequestStatusEnum = pgEnum('review_request_status', [
  'pending',     // Invoice detected, waiting 24h
  'requested',   // Initial request sent
  'reminded',    // 3-day reminder sent
  'completed',   // Customer left review
  'stopped',     // No review after reminder, stopped
  'skipped',     // No customer phone, skipped
]);

export const reviewRequestSourceEnum = pgEnum('review_request_source', [
  'greeninvoice',
  'icount',
  'manual',      // Manual "mark as service" button
  'forwarded',   // Forwarded invoice to Findo
]);

/**
 * Review requests table - tracks review request lifecycle.
 */
export const reviewRequests = pgTable('review_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),

  // Source tracking
  source: reviewRequestSourceEnum('source').notNull(),
  invoiceId: varchar('invoice_id', { length: 255 }), // Provider's invoice ID
  invoiceNumber: varchar('invoice_number', { length: 100 }),

  // Customer info
  customerPhone: varchar('customer_phone', { length: 20 }),
  customerName: varchar('customer_name', { length: 255 }),
  customerEmail: varchar('customer_email', { length: 255 }),

  // Status tracking
  status: reviewRequestStatusEnum('status').default('pending').notNull(),

  // Lifecycle timestamps
  invoiceDetectedAt: timestamp('invoice_detected_at', { withTimezone: true }).defaultNow().notNull(),
  scheduledForAt: timestamp('scheduled_for_at', { withTimezone: true }), // 24h after detection
  requestedAt: timestamp('requested_at', { withTimezone: true }),
  reminderSentAt: timestamp('reminder_sent_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),

  // Message tracking
  requestMessageId: varchar('request_message_id', { length: 255 }), // WhatsApp message ID
  reminderMessageId: varchar('reminder_message_id', { length: 255 }),

  // Record timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  // Prevent duplicate requests for same invoice
  uniqueInvoice: unique('review_requests_invoice_unique').on(table.tenantId, table.source, table.invoiceId),
  // Index for status queries
  statusIdx: index('review_requests_status_idx').on(table.status),
  // Index for scheduled time queries
  scheduledIdx: index('review_requests_scheduled_idx').on(table.scheduledForAt),
}));

/**
 * Accounting connections table - stores provider credentials.
 */
export const accountingConnections = pgTable('accounting_connections', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),

  provider: accountingProviderEnum('provider').notNull(),
  status: varchar('status', { length: 20 }).default('active').notNull(), // active, inactive, error

  // Encrypted credentials stored in token_vault
  credentialsVaultId: uuid('credentials_vault_id').notNull(),

  // Poll tracking
  lastPollAt: timestamp('last_poll_at', { withTimezone: true }),
  lastInvoiceDate: timestamp('last_invoice_date', { withTimezone: true }),
  lastError: text('last_error'),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  // One connection per provider per tenant
  uniqueProvider: unique('accounting_connections_provider_unique').on(table.tenantId, table.provider),
}));

export type ReviewRequest = typeof reviewRequests.$inferSelect;
export type NewReviewRequest = typeof reviewRequests.$inferInsert;

export type AccountingConnection = typeof accountingConnections.$inferSelect;
export type NewAccountingConnection = typeof accountingConnections.$inferInsert;
```

### Invoice Poll Worker
```typescript
// Source: Based on existing worker patterns
import { Worker, Job } from 'bullmq';
import { createRedisConnection } from '../../lib/redis';
import { db } from '../../db/index';
import { accountingConnections, reviewRequests } from '../../db/schema/index';
import { eq } from 'drizzle-orm';
import { reviewRequestQueue } from '../index';
import { type ScheduledJobData } from '../queues';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function startInvoicePollWorker(): Worker<ScheduledJobData> {
  const worker = new Worker<ScheduledJobData>(
    'scheduled',
    async (job: Job<ScheduledJobData>) => {
      if (job.name !== 'invoice-poll') return;

      console.log('[invoice-poll] Starting hourly invoice check');

      // Get all active accounting connections
      const connections = await db.query.accountingConnections.findMany({
        where: eq(accountingConnections.status, 'active'),
      });

      console.log(`[invoice-poll] Checking ${connections.length} connections`);

      for (const connection of connections) {
        try {
          const newInvoices = await pollForNewInvoices(
            connection.tenantId,
            connection.provider
          );

          for (const invoice of newInvoices) {
            // Skip if no customer phone
            if (!invoice.customerPhone) {
              console.log(
                `[invoice-poll] Skipping invoice ${invoice.invoiceId} - no phone`
              );
              await createReviewRequest(connection.tenantId, invoice, 'skipped');
              continue;
            }

            // Create review request record
            const request = await createReviewRequest(
              connection.tenantId,
              invoice,
              'pending'
            );

            // Schedule for 24h later
            await reviewRequestQueue.add(
              'send-review-request',
              { reviewRequestId: request.id },
              {
                delay: 24 * 60 * 60 * 1000, // 24 hours
                jobId: `review-req-${request.id}`,
              }
            );
          }

          if (newInvoices.length > 0) {
            console.log(
              `[invoice-poll] Processed ${newInvoices.length} invoices for ${connection.tenantId}`
            );
          }

          // Rate limit between connections
          await sleep(100);
        } catch (error) {
          console.error(
            `[invoice-poll] Error for ${connection.tenantId}/${connection.provider}:`,
            error
          );
          // Update connection with error
          await db
            .update(accountingConnections)
            .set({ lastError: String(error), updatedAt: new Date() })
            .where(eq(accountingConnections.id, connection.id));
        }
      }

      console.log('[invoice-poll] Completed hourly invoice check');
    },
    {
      connection: createRedisConnection(),
      concurrency: 1,
    }
  );

  console.log('[invoice-poll] Worker started');
  return worker;
}
```

### WhatsApp Message Templates Required
```
Template 1: review_request
Category: Utility
Language: Hebrew (he)

Header: None
Body: "{{1}} שלום,
תודה על שבחרת ב{{2}}!
נשמח אם תקדיש רגע להשאיר לנו ביקורת בגוגל.
זה עוזר לעסקים קטנים כמונו."

Button: URL button
- Text: "השאר ביקורת"
- URL type: Dynamic
- URL: https://search.google.com/local/writereview?placeid={{1}}

Variables:
- Body {{1}}: Customer name
- Body {{2}}: Business name
- Button {{1}}: Place ID suffix (appended to base URL)
```

```
Template 2: review_reminder
Category: Utility
Language: Hebrew (he)

Header: None
Body: "רק תזכורת קטנה - נשמח לשמוע מה חשבת על {{1}}.
ביקורת שלך באמת עוזרת לנו."

Button: URL button
- Text: "השאר ביקורת"
- URL type: Dynamic
- URL: https://search.google.com/local/writereview?placeid={{1}}

Variables:
- Body {{1}}: Business name
- Button {{1}}: Place ID suffix
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Webhook-only for invoices | Polling as primary | N/A for Israeli platforms | Greeninvoice/iCount don't support invoice webhooks |
| SMS for review requests | WhatsApp templates | 2024+ | Higher engagement rates in Israel |
| Multiple reminders | Single reminder then stop | Best practice | Reduces spam complaints, maintains quality rating |

**Israeli accounting platform notes:**
- Greeninvoice (aka Morning) - Acquired by TeamSystem (Dec 2024) for $150M. Primary platform for freelancers/SMBs.
- iCount - 60,000+ users in Israel. Session-based API, Hebrew-focused.
- Both require polling - neither has reliable webhook for invoice creation.

## Open Questions

Things that couldn't be fully resolved:

1. **Greeninvoice Document Search Endpoint**
   - What we know: API has `/documents/search` endpoint
   - What's unclear: Exact filter parameters, pagination format
   - Recommendation: Test with sandbox environment, document actual response format

2. **iCount API v3 vs Legacy**
   - What we know: Both `api.icount.co.il` and `api-v3.icount.co.il` exist
   - What's unclear: Feature parity, which to use for doc_search
   - Recommendation: Start with legacy API (more documentation), migrate if needed

3. **Review Detection Cross-Reference**
   - What we know: Phase 5 tracks reviews by reviewer name
   - What's unclear: How to reliably match customer from invoice to reviewer
   - Recommendation: Use phone number heuristic (last 4 digits in reviewer name), or detect any new review within 48h of request

4. **Manual Trigger UI**
   - What we know: REVW-03 requires manual trigger
   - What's unclear: Where does this button appear (dashboard? WhatsApp?)
   - Recommendation: Add to dashboard activity feed for now, WhatsApp "mark as service" is Phase 6 scope

## Sources

### Primary (HIGH confidence)
- Greeninvoice API documentation - JWT auth, document types 300/305/320/400
- Existing codebase: src/services/whatsapp/messages.ts, src/queue/workers/review-reminder.worker.ts
- Google Places API - Review link format: `https://search.google.com/local/writereview?placeid=...`

### Secondary (MEDIUM confidence)
- [Greeninvoice Apiary docs](https://greeninvoice.docs.apiary.io/) - API structure
- [GitHub: danielrosehill/Green-Invoice-API-My-Notes](https://github.com/danielrosehill/Green-Invoice-API-My-Notes) - Webhook payload example
- [iCount API features](https://www.icount.net/features/api/) - General capabilities
- [iCount Python gist](https://gist.github.com/urigoren/682c82e706063497f351ce2059a2426d) - doc_search endpoint

### Tertiary (LOW confidence)
- Greeninvoice webhook events - Documented only for expense events, NOT document creation
- iCount webhook system - No evidence of webhooks in documentation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already installed
- Greeninvoice API: MEDIUM - API documented but webhook limitations discovered
- iCount API: MEDIUM - Less documentation, polling confirmed as only option
- WhatsApp templates: HIGH - Same pattern as Phase 3/5
- Timing/scheduling: HIGH - BullMQ delayed jobs well-documented

**Critical finding:** Neither Greeninvoice nor iCount provides webhooks for invoice creation events. Polling is REQUIRED for both platforms.

**Research date:** 2026-01-28
**Valid until:** 2026-02-28 (30 days - stable patterns, APIs unlikely to change)

---

## Appendix: Queue and Job Types to Add

```typescript
// In src/queue/queues.ts - add:

export const reviewRequestQueue = new Queue('review-requests', {
  ...defaultQueueOptions,
  connection: createRedisConnection(),
});

export interface ReviewRequestJobData {
  reviewRequestId: string;
}

// In src/queue/index.ts - add ScheduledJobData type:
// 'invoice-poll' - runs every hour
```

## Appendix: Scheduler Job to Add

```typescript
// In src/scheduler/jobs.ts - add:

await scheduledQueue.add(
  'invoice-poll',
  {
    jobType: 'invoice-poll',
  } satisfies ScheduledJobData,
  {
    repeat: {
      pattern: '15 * * * *', // Every hour at minute 15 (offset from review-check at :00)
    },
    jobId: 'invoice-poll-hourly',
  }
);
console.log('[scheduler] Registered: invoice-poll (hourly)');
```

## Appendix: Environment Variables Needed

```bash
# Greeninvoice (per tenant, stored in token_vault)
# GREENINVOICE_API_ID=...
# GREENINVOICE_API_SECRET=...

# iCount (per tenant, stored in token_vault)
# ICOUNT_COMPANY_ID=...
# ICOUNT_USERNAME=...
# ICOUNT_PASSWORD=...

# Sandbox for testing
GREENINVOICE_SANDBOX_URL=https://sandbox.d.greeninvoice.co.il/api/v1
```
