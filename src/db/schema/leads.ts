import { pgTable, uuid, varchar, text, timestamp, pgEnum, index, unique } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';

// Lead status enum - covers full lifecycle from capture to conversion
export const leadStatusEnum = pgEnum('lead_status', [
  'new',           // Just captured, awaiting info
  'qualifying',    // Chatbot collecting info
  'qualified',     // All info collected
  'unresponsive',  // Customer didn't respond after reminders
  'contacted',     // Owner contacted customer
  'converted',     // Became a customer
  'lost',          // Didn't convert
]);

// Lead source enum - where the lead came from
export const leadSourceEnum = pgEnum('lead_source', [
  'missed_call',   // From Voicenter missed call
  'manual',        // Manually added
  'website',       // Future: website form
]);

// Lead conversation state enum - chatbot state machine
export const leadConversationStateEnum = pgEnum('lead_conversation_state', [
  'awaiting_response',   // Initial message sent, waiting for any reply
  'awaiting_name',       // Asked for name
  'awaiting_need',       // Asked about their need
  'awaiting_preference', // Asked for contact preference
  'completed',           // All info collected
  'unresponsive',        // No response after reminders
]);

/**
 * Leads table - tracks potential customers captured from missed calls.
 * Core table for lead capture functionality.
 */
export const leads = pgTable('leads', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),

  // Source tracking
  source: leadSourceEnum('source').default('missed_call').notNull(),
  sourceId: varchar('source_id', { length: 100 }), // Voicenter CallID for idempotency

  // Customer info
  customerPhone: varchar('customer_phone', { length: 20 }).notNull(),
  customerName: varchar('customer_name', { length: 255 }),

  // Lead qualification
  need: text('need'),                           // What they need
  contactPreference: text('contact_preference'), // When to call back

  // Status tracking
  status: leadStatusEnum('status').default('new').notNull(),

  // Lifecycle timestamps
  capturedAt: timestamp('captured_at', { withTimezone: true }).defaultNow().notNull(),
  qualifiedAt: timestamp('qualified_at', { withTimezone: true }),
  contactedAt: timestamp('contacted_at', { withTimezone: true }),

  // Record timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  // Index for tenant queries (most common)
  tenantIdx: index('leads_tenant_id_idx').on(table.tenantId),
  // Index for status filtering
  statusIdx: index('leads_status_idx').on(table.status),
  // Index for phone lookups (check if customer already a lead)
  customerPhoneIdx: index('leads_customer_phone_idx').on(table.customerPhone),
}));

/**
 * Lead conversations table - tracks chatbot conversation state.
 * One conversation per lead (1:1 relationship).
 */
export const leadConversations = pgTable('lead_conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  leadId: uuid('lead_id').notNull().references(() => leads.id, { onDelete: 'cascade' }).unique(),

  // State machine
  state: leadConversationStateEnum('state').default('awaiting_response').notNull(),

  // Reminder tracking
  reminder1SentAt: timestamp('reminder1_sent_at', { withTimezone: true }),
  reminder2SentAt: timestamp('reminder2_sent_at', { withTimezone: true }),

  // Link to WhatsApp conversation for message context
  whatsappConversationId: uuid('whatsapp_conversation_id'),

  // Record timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  // Index for lead lookups
  leadIdx: index('lead_conversations_lead_id_idx').on(table.leadId),
}));

/**
 * Missed calls table - tracks Voicenter missed call events.
 * Used for idempotency (via callId) and analytics.
 */
export const missedCalls = pgTable('missed_calls', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),

  // Voicenter data - callId is idempotency key
  callId: varchar('call_id', { length: 100 }).notNull().unique(),
  callerPhone: varchar('caller_phone', { length: 20 }).notNull(),
  businessPhone: varchar('business_phone', { length: 20 }).notNull(),
  status: varchar('status', { length: 20 }).notNull(), // NOANSWER, BUSY, CANCEL, ABANDONE

  // Timestamps
  calledAt: timestamp('called_at', { withTimezone: true }).notNull(),
  processedAt: timestamp('processed_at', { withTimezone: true }),

  // Link to lead if created
  leadId: uuid('lead_id').references(() => leads.id),

  // Record timestamp
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Type exports for TypeScript inference
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;

export type LeadConversation = typeof leadConversations.$inferSelect;
export type NewLeadConversation = typeof leadConversations.$inferInsert;

export type MissedCall = typeof missedCalls.$inferSelect;
export type NewMissedCall = typeof missedCalls.$inferInsert;
