import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  pgEnum,
  integer,
  boolean,
  jsonb,
} from 'drizzle-orm/pg-core';
import { tenants } from './tenants';

// Subscription status enum - covers full billing lifecycle
export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'trial',           // 14-day trial period
  'pending_payment', // Setup fee not yet paid
  'active',          // Paying customer
  'past_due',        // Payment failed, grace period
  'cancelled',       // Subscription ended
]);

// Subscriptions table - one per tenant, tracks billing state
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Tenant reference (one subscription per tenant)
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' })
    .unique(),

  // PayPlus integration references
  payplusCustomerId: varchar('payplus_customer_id', { length: 100 }), // PayPlus customer reference
  payplusTokenId: varchar('payplus_token_id', { length: 100 }), // Token for recurring charges

  // Subscription status
  status: subscriptionStatusEnum('status').default('trial').notNull(),

  // Payment flags
  setupFeePaid: boolean('setup_fee_paid').default(false).notNull(),

  // Pricing (stored in agorot to avoid floating point)
  monthlyAmountAgorot: integer('monthly_amount_agorot').default(35000).notNull(), // 350 NIS
  setupFeeAgorot: integer('setup_fee_agorot').default(350000).notNull(), // 3500 NIS

  // Trial period
  trialEndsAt: timestamp('trial_ends_at', { withTimezone: true }),

  // Billing cycle dates
  currentPeriodStart: timestamp('current_period_start', { withTimezone: true }),
  currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }),
  nextBillingDate: timestamp('next_billing_date', { withTimezone: true }),

  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Payments table - transaction history
export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Tenant reference
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),

  // Subscription reference (nullable for manual payments)
  subscriptionId: uuid('subscription_id').references(() => subscriptions.id),

  // PayPlus transaction reference
  payplusTransactionId: varchar('payplus_transaction_id', { length: 100 }),

  // Payment amount (stored in agorot)
  amountAgorot: integer('amount_agorot').notNull(),
  currency: varchar('currency', { length: 3 }).default('ILS').notNull(),

  // Payment type
  type: varchar('type', { length: 20 }).notNull(), // 'setup_fee', 'subscription', 'manual'

  // Payment status
  status: varchar('status', { length: 20 }).notNull(), // 'pending', 'completed', 'failed', 'refunded'

  // Card details (for display purposes)
  cardLast4: varchar('card_last_4', { length: 4 }),
  cardBrand: varchar('card_brand', { length: 20 }), // 'visa', 'mastercard', 'isracard'

  // Failure tracking
  failureReason: varchar('failure_reason', { length: 500 }),
  retryCount: integer('retry_count').default(0),

  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  paidAt: timestamp('paid_at', { withTimezone: true }),
});

// Setup progress table - tracks wizard state across sessions
export const setupProgress = pgTable('setup_progress', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Tenant reference (one progress record per tenant)
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' })
    .unique(),

  // Current wizard step (1-5)
  currentStep: integer('current_step').default(1).notNull(),

  // Partial form data per step (JSON)
  stepData: jsonb('step_data'),

  // Completion tracking
  completedAt: timestamp('completed_at', { withTimezone: true }),

  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Type exports for TypeScript inference
export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type SetupProgress = typeof setupProgress.$inferSelect;
export type NewSetupProgress = typeof setupProgress.$inferInsert;
