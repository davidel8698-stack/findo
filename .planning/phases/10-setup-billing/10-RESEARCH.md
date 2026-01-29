# Phase 10: Setup & Billing - Research

**Researched:** 2026-01-30
**Domain:** Onboarding Wizard, Israeli Payment Processing, Progressive Profiling
**Confidence:** MEDIUM-HIGH

## Summary

Phase 10 implements the 2-minute setup wizard and billing system for Findo. The research covers three main domains: (1) multi-step wizard UX for server-side rendered HTML with Hono, (2) Israeli payment gateway integration for NIS billing, and (3) progressive profiling patterns for collecting business information over time via WhatsApp.

The Israeli payment landscape requires using local gateways since Stripe is not available in Israel. The recommended approach is PayPlus or Tranzila for recurring subscriptions in NIS. For the setup wizard, a simple 5-step flow with server-side state management (Redis or DB) matches the existing Hono patterns. Progressive profiling should leverage the existing WhatsApp infrastructure to collect additional business details post-setup.

**Primary recommendation:** Build a 5-step wizard using existing Hono HTML rendering patterns, integrate PayPlus for NIS recurring billing, and implement progressive profiling via scheduled WhatsApp messages using the existing worker/scheduler infrastructure.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| PayPlus | N/A | Israeli payment gateway | PCI DSS Level 1, native NIS support, recurring billing, API available |
| Hono | 4.11.7 | Form handling & routing | Already in project, SSR HTML rendering established |
| @hono/zod-validator | 0.7.6 | Form validation | Already in project, type-safe validation |
| BullMQ | 5.67.1 | Progressive profiling jobs | Already in project for scheduled workers |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Tranzila | N/A | Alternative payment gateway | If PayPlus unavailable or for comparison |
| zod | 4.3.6 | Schema validation for wizard steps | Validate each step before proceeding |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| PayPlus | Tranzila | Tranzila has longer market presence, PayPlus has better modern API |
| PayPlus | Cardcom | Cardcom good for recurring, PayPlus better developer experience |
| Server session | LocalStorage | Server session more secure for payment flow, matches existing patterns |

**Installation:**
```bash
# No new npm packages required - PayPlus API is REST-based
# Existing stack sufficient
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── routes/
│   └── setup/              # Setup wizard routes
│       ├── index.ts        # Wizard step routing
│       └── billing.ts      # Billing/payment routes
├── views/
│   └── setup/              # Setup wizard views
│       ├── step-1-business.ts    # Business info form
│       ├── step-2-whatsapp.ts    # WhatsApp connect
│       ├── step-3-google.ts      # Google connect
│       ├── step-4-telephony.ts   # Telephony options
│       ├── step-5-billing.ts     # Payment setup
│       └── complete.ts           # Success page
├── services/
│   └── billing/
│       ├── payplus.ts      # PayPlus API client
│       ├── subscription.ts # Subscription management
│       └── webhook.ts      # Payment webhook handler
├── db/schema/
│   └── billing.ts          # Billing schema (subscriptions, payments)
└── queue/workers/
    └── progressive-profile.worker.ts  # Weekly profiling questions
```

### Pattern 1: Multi-Step Wizard with Server State
**What:** Store wizard progress in database (not session) for durability
**When to use:** User may close browser mid-setup, need to resume
**Example:**
```typescript
// Source: Project pattern from existing Hono routes
// db/schema/setup-progress.ts
export const setupProgress = pgTable('setup_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  currentStep: integer('current_step').default(1).notNull(),
  stepData: jsonb('step_data'), // JSON blob for partial data
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// routes/setup/index.ts
setupRoutes.post('/step/:step', zValidator('form', stepSchemas[step]), async (c) => {
  const step = parseInt(c.req.param('step'));
  const formData = c.req.valid('form');
  const tenantId = c.get('tenant').tenantId;

  // Save step data
  await saveStepProgress(tenantId, step, formData);

  // Return next step HTML or redirect
  if (step < 5) {
    return c.html(renderStep(step + 1, await getProgress(tenantId)));
  } else {
    return c.redirect('/setup/complete');
  }
});
```

### Pattern 2: Israeli Payment Gateway Integration (PayPlus)
**What:** Token-based recurring billing with hosted payment page
**When to use:** Setup fee + monthly subscription collection
**Example:**
```typescript
// Source: PayPlus API pattern (verified via GitHub repos)
// services/billing/payplus.ts
interface PayPlusConfig {
  apiKey: string;
  secretKey: string;
  terminalId: string;
  sandbox: boolean;
}

async function createPaymentPage(params: {
  tenantId: string;
  amount: number; // Amount in agorot (cents)
  currency: 'ILS';
  description: string;
  successUrl: string;
  failureUrl: string;
  createToken: boolean; // For recurring payments
}): Promise<{ paymentPageUrl: string; transactionUid: string }> {
  const response = await fetch('https://restapidev.payplus.co.il/api/v1.0/PaymentPages/generateLink', {
    method: 'POST',
    headers: {
      'Authorization': JSON.stringify({ api_key: config.apiKey, secret_key: config.secretKey }),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      payment_page_uid: params.terminalId,
      charge_method: params.createToken ? 3 : 1, // 3 = token, 1 = charge
      amount: params.amount,
      currency_code: 'ILS',
      more_info: params.description,
      customer: { customer_uid: params.tenantId },
      success_url: params.successUrl,
      failure_url: params.failureUrl,
    }),
  });

  const data = await response.json();
  return {
    paymentPageUrl: data.data.payment_page_link,
    transactionUid: data.data.transaction_uid,
  };
}
```

### Pattern 3: Telephony Option Selection
**What:** Three-choice UI for phone number setup
**When to use:** Step 4 of wizard - telephony configuration
**Example:**
```typescript
// views/setup/step-4-telephony.ts
export function renderTelephonyStep(): string {
  return `
    <div class="space-y-4">
      <h2 class="text-xl font-semibold">הגדרת טלפון</h2>
      <p class="text-gray-600">איך תרצו לקבל שיחות?</p>

      <div class="grid gap-4">
        <!-- Option 1: New Number -->
        <label class="telephony-option cursor-pointer">
          <input type="radio" name="telephonyOption" value="new" class="hidden peer" />
          <div class="peer-checked:border-blue-500 peer-checked:bg-blue-50 border-2 rounded-xl p-4">
            <div class="flex items-center gap-3">
              <span class="text-2xl">&#128222;</span>
              <div>
                <p class="font-medium">מספר חדש מ-Voicenter</p>
                <p class="text-sm text-gray-500">מספר ישראלי חדש - מופעל מיד</p>
              </div>
            </div>
          </div>
        </label>

        <!-- Option 2: Transfer Existing -->
        <label class="telephony-option cursor-pointer">
          <input type="radio" name="telephonyOption" value="transfer" class="hidden peer" />
          <div class="peer-checked:border-blue-500 peer-checked:bg-blue-50 border-2 rounded-xl p-4">
            <div class="flex items-center gap-3">
              <span class="text-2xl">&#128260;</span>
              <div>
                <p class="font-medium">העברת מספר קיים</p>
                <p class="text-sm text-gray-500">נעביר את המספר הנוכחי שלכם - 3-5 ימי עבודה</p>
              </div>
            </div>
          </div>
        </label>

        <!-- Option 3: Use Current Mobile -->
        <label class="telephony-option cursor-pointer">
          <input type="radio" name="telephonyOption" value="current" class="hidden peer" />
          <div class="peer-checked:border-blue-500 peer-checked:bg-blue-50 border-2 rounded-xl p-4">
            <div class="flex items-center gap-3">
              <span class="text-2xl">&#128241;</span>
              <div>
                <p class="font-medium">שימוש בנייד הנוכחי</p>
                <p class="text-sm text-gray-500">נגדיר העברת שיחות מהנייד שלכם</p>
              </div>
            </div>
          </div>
        </label>
      </div>
    </div>
  `;
}
```

### Pattern 4: Progressive Profiling via WhatsApp
**What:** Scheduled WhatsApp messages to collect additional business info
**When to use:** Post-setup, week 1-4 of service
**Example:**
```typescript
// services/progressive-profile/questions.ts
export const PROGRESSIVE_QUESTIONS = [
  {
    week: 1,
    question: 'מה השירותים העיקריים שאתם מציעים?',
    field: 'services',
    type: 'text',
  },
  {
    week: 2,
    question: 'מה מייחד את העסק שלכם מהמתחרים?',
    field: 'uniqueValue',
    type: 'text',
  },
  {
    week: 3,
    question: 'יש לכם חניה? נגישות לנכים?',
    field: 'amenities',
    type: 'quick_reply',
    options: ['יש חניה', 'יש נגישות', 'שניהם', 'אף אחד'],
  },
  {
    week: 4,
    question: 'רוצים להוסיף שעות פעילות מיוחדות?',
    field: 'specialHours',
    type: 'text',
  },
];

// queue/workers/progressive-profile.worker.ts
export const progressiveProfileWorker = new Worker(
  'progressive-profile',
  async (job) => {
    const { tenantId } = job.data;

    // Get tenant's week number since signup
    const tenant = await getTenant(tenantId);
    const weeksSinceSignup = getWeeksSince(tenant.createdAt);

    // Find question for this week
    const question = PROGRESSIVE_QUESTIONS.find(q => q.week === weeksSinceSignup);
    if (!question) return;

    // Check if already answered
    const answered = await hasAnswered(tenantId, question.field);
    if (answered) return;

    // Send WhatsApp message
    await sendWhatsAppMessage(tenantId, {
      template: 'progressive_profile',
      parameters: [question.question],
    });
  },
  { connection: redis }
);
```

### Anti-Patterns to Avoid
- **Collecting too much upfront:** Keep initial setup to 5 fields max (name, type, owner, address, hours). More kills conversion.
- **External payment redirects without return handling:** Always handle success/failure callbacks properly with clear Hebrew messaging.
- **Blocking on integrations:** Don't require WhatsApp/Google connection to be "complete" before allowing billing. Show as "pending" and proceed.
- **Storing card numbers:** Never store card data - use PayPlus tokens exclusively.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Payment processing | Custom card handling | PayPlus hosted page | PCI compliance, fraud detection, Israeli regulations |
| Recurring billing | Manual monthly charges | PayPlus token billing | Handles retries, card expiry, bank holidays |
| Form wizard state | LocalStorage wizard | Server-side progress table | Durability, security, works across devices |
| Phone validation | Regex validation | libphonenumber or similar | Israeli formats complex (05X, 07X, 02-09) |
| Business hours | Custom hour picker | Structured JSON schema | GBP API expects specific format |

**Key insight:** Payment processing in Israel has regulatory requirements (PCI-DSS, Bank of Israel oversight) that make DIY approaches risky. Using established gateways provides compliance out of the box.

## Common Pitfalls

### Pitfall 1: Stripe Assumption
**What goes wrong:** Developers assume Stripe works in Israel and plan integration around it.
**Why it happens:** Stripe is dominant globally, easy to find docs for.
**How to avoid:** Stripe does NOT operate in Israel (no clearing license from Bank of Israel). Must use Israeli gateways.
**Warning signs:** References to Stripe in design docs, npm packages for Stripe in dependencies.

### Pitfall 2: Token vs. Charge Confusion
**What goes wrong:** Setting up for recurring but not requesting token creation.
**Why it happens:** Payment APIs have multiple "charge methods" - single charge doesn't create token.
**How to avoid:** PayPlus charge_method=3 for token, charge_method=5 for token+charge. Document clearly.
**Warning signs:** First payment works, second month fails with "no payment method".

### Pitfall 3: Abandoned Wizard State Conflicts
**What goes wrong:** User A starts wizard, abandons, starts again later. Old state interferes.
**Why it happens:** Not handling partial progress cleanup or merge.
**How to avoid:** Either (a) always resume from saved state, or (b) clear on new start with confirmation.
**Warning signs:** Form shows old/stale data, validation fails on clean input.

### Pitfall 4: Hebrew/RTL Form Issues
**What goes wrong:** Form inputs look broken, submit buttons in wrong position.
**Why it happens:** Not testing RTL layout thoroughly.
**How to avoid:** All forms must have dir="rtl", test with actual Hebrew input, check button alignment.
**Warning signs:** Labels appear on wrong side of inputs, error messages misaligned.

### Pitfall 5: Progressive Profiling Spam
**What goes wrong:** System sends too many WhatsApp messages, owner mutes Findo.
**Why it happens:** Aggressive profiling schedule, not respecting response patterns.
**How to avoid:** Max 1 question per week. If 2 ignored in a row, stop asking. Never more than 4 total.
**Warning signs:** Owner complaints, high unsubscribe rate, ignored messages.

### Pitfall 6: Webhook Security
**What goes wrong:** Fake payment confirmations accepted, billing marked complete without payment.
**Why it happens:** Not validating webhook signatures from PayPlus.
**How to avoid:** Always verify webhook signature before updating payment status.
**Warning signs:** Billing discrepancies, "paid" tenants with no actual transactions.

## Code Examples

Verified patterns from official sources:

### Wizard Step Validation Schema
```typescript
// Source: Project pattern + Zod docs
import { z } from 'zod';

// Step 1: Business Information
export const step1Schema = z.object({
  businessName: z.string().min(2, 'שם העסק קצר מדי').max(255),
  businessType: z.enum(['plumber', 'electrician', 'garage', 'general']),
  ownerName: z.string().min(2, 'שם בעל העסק קצר מדי').max(255),
  address: z.string().min(5, 'כתובת קצרה מדי').max(500),
  businessHours: z.object({
    sunday: z.object({ open: z.string(), close: z.string() }).optional(),
    monday: z.object({ open: z.string(), close: z.string() }).optional(),
    tuesday: z.object({ open: z.string(), close: z.string() }).optional(),
    wednesday: z.object({ open: z.string(), close: z.string() }).optional(),
    thursday: z.object({ open: z.string(), close: z.string() }).optional(),
    friday: z.object({ open: z.string(), close: z.string() }).optional(),
    saturday: z.object({ open: z.string(), close: z.string() }).optional(),
  }),
});

// Step 4: Telephony
export const step4Schema = z.object({
  telephonyOption: z.enum(['new', 'transfer', 'current']),
  existingNumber: z.string().optional(), // Required if transfer/current
}).refine(
  (data) => {
    if (data.telephonyOption !== 'new' && !data.existingNumber) {
      return false;
    }
    return true;
  },
  { message: 'יש להזין מספר טלפון', path: ['existingNumber'] }
);
```

### Billing Schema
```typescript
// Source: Project pattern for schema design
import { pgTable, uuid, varchar, integer, timestamp, pgEnum, boolean } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';

export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'trial',           // 14-day trial
  'pending_payment', // Setup fee not paid
  'active',          // Paying customer
  'past_due',        // Payment failed, grace period
  'cancelled',       // Subscription ended
]);

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }).unique(),

  // PayPlus tokens
  payplusCustomerId: varchar('payplus_customer_id', { length: 100 }),
  payplusTokenId: varchar('payplus_token_id', { length: 100 }), // For recurring charges

  // Subscription details
  status: subscriptionStatusEnum('status').default('trial').notNull(),
  setupFeePaid: boolean('setup_fee_paid').default(false).notNull(),
  monthlyAmountAgorot: integer('monthly_amount_agorot').default(35000).notNull(), // 350 NIS = 35000 agorot

  // Trial tracking
  trialEndsAt: timestamp('trial_ends_at', { withTimezone: true }),

  // Billing cycle
  currentPeriodStart: timestamp('current_period_start', { withTimezone: true }),
  currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }),
  nextBillingDate: timestamp('next_billing_date', { withTimezone: true }),

  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  subscriptionId: uuid('subscription_id').references(() => subscriptions.id),

  // PayPlus reference
  payplusTransactionId: varchar('payplus_transaction_id', { length: 100 }),

  // Payment details
  amountAgorot: integer('amount_agorot').notNull(),
  currency: varchar('currency', { length: 3 }).default('ILS').notNull(),
  type: varchar('type', { length: 20 }).notNull(), // 'setup_fee', 'subscription', 'manual'
  status: varchar('status', { length: 20 }).notNull(), // 'pending', 'completed', 'failed', 'refunded'

  // Card info (last 4 only, no full numbers)
  cardLast4: varchar('card_last_4', { length: 4 }),
  cardBrand: varchar('card_brand', { length: 20 }), // 'visa', 'mastercard', 'isracard'

  // Failure tracking
  failureReason: varchar('failure_reason', { length: 500 }),
  retryCount: integer('retry_count').default(0),

  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  paidAt: timestamp('paid_at', { withTimezone: true }),
});
```

### Dashboard Success Message
```typescript
// Source: Per SETUP-05 requirement
export function renderSetupComplete(tenantId: string): string {
  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Findo - ההגדרה הושלמה</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 min-h-screen flex items-center justify-center">
  <div class="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
    <!-- Success Animation -->
    <div class="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
      <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
    </div>

    <h1 class="text-2xl font-bold text-gray-800 mb-2">מעולה! Findo עובד עבורכם</h1>

    <p class="text-gray-600 mb-6">
      מעכשיו Findo פועל ברקע 24/7.<br/>
      אין צורך לעשות שום דבר - פשוט תמשיכו לעבוד.
    </p>

    <!-- What's Happening -->
    <div class="bg-blue-50 rounded-xl p-4 mb-6 text-right">
      <h3 class="font-medium text-blue-800 mb-2">מה קורה עכשיו?</h3>
      <ul class="text-sm text-blue-700 space-y-1">
        <li>&#10003; שיחות שלא נענות - הודעת WhatsApp נשלחת ללקוח</li>
        <li>&#10003; ביקורות חדשות - מענה אוטומטי ב-Google</li>
        <li>&#10003; בקשות לביקורות - נשלחות אחרי שירות</li>
      </ul>
    </div>

    <!-- Next Steps -->
    <a href="/dashboard" class="block w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition-colors">
      לצפייה בלוח הבקרה
    </a>

    <p class="text-xs text-gray-400 mt-4">
      תקבלו עדכונים ב-WhatsApp כשיהיו דברים שצריכים את תשומת לבכם
    </p>
  </div>
</body>
</html>`;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Credit card iframes | Hosted payment pages | 2023-2024 | Better mobile UX, simpler PCI compliance |
| Long signup forms | Progressive profiling | 2024-2025 | 30-50% better conversion, less friction |
| Wizard with localStorage | Server-side state | 2024 | Works across devices, more secure |
| SMS for payments | WhatsApp for everything | 2025 | Israeli market prefers WhatsApp |

**Deprecated/outdated:**
- Direct card collection in forms: Avoid - requires full PCI compliance
- Stripe in Israel: Not available - do not attempt

## Open Questions

Things that couldn't be fully resolved:

1. **PayPlus vs Tranzila Final Selection**
   - What we know: Both support NIS recurring, both PCI compliant
   - What's unclear: Current pricing, exact API differences, webhook reliability
   - Recommendation: Contact both for quotes, select based on developer experience and support

2. **Trial Period Implementation**
   - What we know: PROJECT.md mentions trial, REQUIREMENTS.md doesn't specify length
   - What's unclear: Is there a trial period? How long? Does setup fee apply after trial?
   - Recommendation: Clarify with business stakeholder before implementation

3. **Voicenter Number Provisioning API**
   - What we know: Three options exist (new/transfer/current)
   - What's unclear: Exact API for provisioning new numbers, transfer process details
   - Recommendation: Research Voicenter API separately, may need Phase 3 completion first

4. **Setup Fee Timing**
   - What we know: 3,500 NIS setup fee + 350 NIS/month
   - What's unclear: Is setup fee charged upfront or after trial? Can billing be skipped for testing?
   - Recommendation: Implement with configurable timing, default to upfront

## Sources

### Primary (HIGH confidence)
- Project existing code patterns (routes/pages.ts, views/*, db/schema/*)
- PayPlus GitHub repositories - https://github.com/PayPlus-Gateway
- Tranzila official docs - https://docs.tranzila.com/

### Secondary (MEDIUM confidence)
- Stripe Israel article (confirms unavailability) - https://stripe.com/resources/more/payments-in-israel
- SaaS onboarding best practices 2026 - https://www.designstudiouiux.com/blog/saas-onboarding-ux/
- Progressive profiling guide - https://www.descope.com/learn/post/progressive-profiling
- Multi-step form patterns - https://django-formtools.readthedocs.io/en/latest/wizard.html
- Hono validation docs - https://hono.dev/docs/guides/validation

### Tertiary (LOW confidence)
- Payment gateway comparisons (WebSearch, verify before relying)
- Israeli payment market overview (general knowledge, verify specifics)

## Metadata

**Confidence breakdown:**
- Standard stack: MEDIUM - Israeli gateways verified, specific API details need validation
- Architecture: HIGH - Matches existing project patterns exactly
- Pitfalls: HIGH - Common issues well-documented, based on verified sources

**Research date:** 2026-01-30
**Valid until:** 30 days (payment gateway APIs stable, UX patterns evolving slowly)
