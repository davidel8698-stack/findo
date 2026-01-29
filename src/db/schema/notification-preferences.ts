import { pgTable, uuid, boolean, timestamp } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';

/**
 * Notification Preferences Table
 *
 * Granular notification settings per tenant.
 * Controls which events trigger WhatsApp notifications to business owner.
 *
 * Per CONTEXT.md: "Granular notification preferences - Choose exactly which events trigger WhatsApp notifications"
 *
 * Default behavior: Notify all (opt-out per type).
 * Grouped by category: leads, reviews, content, system.
 */
export const notificationPreferences = pgTable('notification_preferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }).unique(),

  // Lead notifications
  notifyNewLead: boolean('notify_new_lead').notNull().default(true),
  notifyLeadQualified: boolean('notify_lead_qualified').notNull().default(true),
  notifyLeadUnresponsive: boolean('notify_lead_unresponsive').notNull().default(true),

  // Review notifications
  notifyNewReview: boolean('notify_new_review').notNull().default(true),
  notifyNegativeReview: boolean('notify_negative_review').notNull().default(true), // Always on for approval flow
  notifyReviewPosted: boolean('notify_review_posted').notNull().default(false), // Less important

  // Content notifications
  notifyPhotoRequest: boolean('notify_photo_request').notNull().default(true),
  notifyPostApproval: boolean('notify_post_approval').notNull().default(true),

  // System notifications
  notifySystemAlert: boolean('notify_system_alert').notNull().default(true),
  notifyWeeklyReport: boolean('notify_weekly_report').notNull().default(true),

  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// Type exports for TypeScript inference
export type NotificationPreferences = typeof notificationPreferences.$inferSelect;
export type NewNotificationPreferences = typeof notificationPreferences.$inferInsert;
