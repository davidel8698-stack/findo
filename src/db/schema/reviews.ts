import { pgTable, uuid, varchar, text, timestamp, integer, pgEnum, index, unique } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';
import { googleConnections } from './google';

/**
 * Review status enum - covers full lifecycle from detection through reply posting.
 * Based on CONTEXT.md requirements for positive auto-reply and negative owner approval.
 */
export const reviewStatusEnum = pgEnum('review_status', [
  'detected',         // New review found during polling
  'auto_replied',     // Positive review: AI reply posted automatically
  'pending_approval', // Negative review: Awaiting owner response
  'reminded',         // 48h reminder sent to owner
  'approved',         // Owner approved draft reply
  'edited',           // Owner provided custom reply text
  'replied',          // Final reply posted to Google
  'expired',          // 48h after reminder, draft auto-posted
]);

/**
 * Processed reviews table - tracks every review detected and processed by Findo.
 * Core table for review management functionality.
 */
export const processedReviews = pgTable('processed_reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  googleConnectionId: uuid('google_connection_id').notNull().references(() => googleConnections.id),

  // Google review identifiers
  reviewId: varchar('review_id', { length: 255 }).notNull(), // Google's review ID
  reviewName: varchar('review_name', { length: 512 }).notNull(), // Full resource name from Google

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
  ownerResponse: text('owner_response'), // If edited, what owner typed

  // Timestamps
  detectedAt: timestamp('detected_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  // Prevent duplicate processing - unique per tenant and review
  uniqueReview: unique('processed_reviews_tenant_review_unique').on(table.tenantId, table.reviewId),
  // Find pending approvals for reminders
  statusIdx: index('processed_reviews_status_idx').on(table.status),
  // Find reviews needing reminder or auto-post based on approval time
  approvalSentIdx: index('processed_reviews_approval_sent_idx').on(table.approvalSentAt),
}));

/**
 * Review poll state table - tracks per-tenant polling timestamps.
 * Used to detect new reviews since last poll.
 */
export const reviewPollState = pgTable('review_poll_state', {
  tenantId: uuid('tenant_id').primaryKey().references(() => tenants.id, { onDelete: 'cascade' }),
  lastPollAt: timestamp('last_poll_at', { withTimezone: true }).defaultNow().notNull(),
  lastReviewUpdateTime: timestamp('last_review_update_time', { withTimezone: true }), // Nullable for first poll
});

// Type exports for TypeScript inference
export type ProcessedReview = typeof processedReviews.$inferSelect;
export type NewProcessedReview = typeof processedReviews.$inferInsert;

export type ReviewPollState = typeof reviewPollState.$inferSelect;
export type NewReviewPollState = typeof reviewPollState.$inferInsert;
