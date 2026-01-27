import { pgTable, uuid, varchar, text, timestamp, jsonb, index } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';

export const activityEvents = pgTable('activity_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),

  // Event classification
  eventType: varchar('event_type', { length: 50 }).notNull(),
  // Examples: 'webhook.received', 'lead.created', 'review.detected',
  //           'message.sent', 'job.scheduled', 'token.refreshed'

  // Event details
  title: varchar('title', { length: 255 }).notNull(), // Human-readable title
  description: text('description'), // Optional longer description
  metadata: jsonb('metadata').$type<Record<string, unknown>>(), // Flexible event data

  // Source tracking
  source: varchar('source', { length: 50 }).notNull(), // 'webhook', 'scheduler', 'api', 'system'
  sourceId: varchar('source_id', { length: 255 }), // External reference (webhook_id, job_id, etc.)

  // Timestamps
  occurredAt: timestamp('occurred_at', { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  // Index for efficient tenant + time queries (dashboard feed)
  tenantTimeIdx: index('activity_events_tenant_time_idx').on(table.tenantId, table.occurredAt),
  // Index for event type filtering
  eventTypeIdx: index('activity_events_event_type_idx').on(table.eventType),
}));

export type ActivityEvent = typeof activityEvents.$inferSelect;
export type NewActivityEvent = typeof activityEvents.$inferInsert;
