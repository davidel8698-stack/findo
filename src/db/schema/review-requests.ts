import { pgTable, uuid, varchar, text, timestamp, pgEnum, index, unique } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';

/**
 * Review request status enum - covers full lifecycle from invoice detection to completion.
 * Based on 06-RESEARCH.md requirements for delayed review requests with single reminder.
 */
export const reviewRequestStatusEnum = pgEnum('review_request_status', [
  'pending',    // Invoice detected, waiting 24h
  'requested',  // Initial WhatsApp sent
  'reminded',   // 3-day reminder sent
  'completed',  // Customer left review
  'stopped',    // No review after reminder, flow ended
  'skipped',    // No customer phone, could not send
]);

/**
 * Review request source enum - tracks origin of each review request.
 * Supports multiple integration sources and manual triggers.
 */
export const reviewRequestSourceEnum = pgEnum('review_request_source', [
  'greeninvoice', // From Greeninvoice polling
  'icount',       // From iCount polling
  'manual',       // Dashboard "Mark as service" button
  'forwarded',    // Forwarded invoice to Findo via WhatsApp
]);

/**
 * Accounting provider enum - supported accounting platforms.
 * Israeli market focus: Greeninvoice and iCount.
 */
export const accountingProviderEnum = pgEnum('accounting_provider', [
  'greeninvoice',
  'icount',
]);

/**
 * Review requests table - tracks review request lifecycle.
 * Core table for invoice-triggered review requests.
 */
export const reviewRequests = pgTable('review_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),

  // Source tracking
  source: reviewRequestSourceEnum('source').notNull(),
  invoiceId: varchar('invoice_id', { length: 255 }), // Provider's invoice ID (nullable for manual)
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
 * References token_vault for encrypted credential storage.
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

// Type exports for TypeScript inference
export type ReviewRequest = typeof reviewRequests.$inferSelect;
export type NewReviewRequest = typeof reviewRequests.$inferInsert;

export type AccountingConnection = typeof accountingConnections.$inferSelect;
export type NewAccountingConnection = typeof accountingConnections.$inferInsert;
