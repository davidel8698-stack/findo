import { pgTable, uuid, varchar, text, timestamp, integer, pgEnum, unique, index, boolean } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';

/**
 * Photo request status enum - tracks weekly photo request lifecycle.
 * Flow: sent -> received -> uploaded OR sent -> expired (after week ends)
 */
export const photoRequestStatusEnum = pgEnum('photo_request_status', [
  'sent',      // WhatsApp request sent to owner
  'received',  // Owner sent photo(s) in response
  'uploaded',  // Photos uploaded to GBP
  'skipped',   // Owner opted out or no response needed
  'expired',   // Week ended without response
]);

/**
 * GBP photo category enum - Google Business Profile photo categories.
 * Based on Google My Business API MediaItem categories.
 */
export const gbpPhotoCategoryEnum = pgEnum('gbp_photo_category', [
  'COVER',          // Cover photo
  'PROFILE',        // Profile photo
  'EXTERIOR',       // Building exterior
  'INTERIOR',       // Building interior
  'PRODUCT',        // Products
  'AT_WORK',        // Team at work
  'FOOD_AND_DRINK', // Food and drinks (restaurants/cafes)
  'MENU',           // Menu items
  'COMMON_AREA',    // Common areas (hotels)
  'ROOMS',          // Rooms (hotels)
  'TEAMS',          // Team photos
  'ADDITIONAL',     // Additional/uncategorized
]);

/**
 * GBP photo status enum - tracks photo state in Google Business Profile.
 */
export const gbpPhotoStatusEnum = pgEnum('gbp_photo_status', [
  'processing', // Upload initiated, not yet live
  'live',       // Visible on GBP
  'rejected',   // Rejected by Google (policy violation)
  'removed',    // Removed from GBP
]);

/**
 * Photo requests table - tracks weekly photo request cycles.
 * Each week, owners receive a WhatsApp request for 1-2 photos.
 * Per CONTEXT.md: Weekly requests on Thursday (end of Israeli work week).
 */
export const photoRequests = pgTable('photo_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),

  // Request lifecycle status
  status: photoRequestStatusEnum('status').default('sent').notNull(),

  // Lifecycle timestamps
  requestedAt: timestamp('requested_at', { withTimezone: true }).notNull(), // When WhatsApp sent
  receivedAt: timestamp('received_at', { withTimezone: true }),   // When photo(s) received
  uploadedAt: timestamp('uploaded_at', { withTimezone: true }),   // When uploaded to GBP
  reminderSentAt: timestamp('reminder_sent_at', { withTimezone: true }), // If reminder was sent

  // Media tracking
  mediaIds: text('media_ids').array(),     // WhatsApp media IDs received
  gbpMediaIds: text('gbp_media_ids').array(), // GBP media IDs after upload

  // Week tracking for deduplication (ISO week number)
  week: integer('week').notNull(),  // ISO week number (1-53)
  year: integer('year').notNull(),  // Year

  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }), // Soft delete
}, (table) => ({
  // Prevent duplicate requests for same tenant in same week
  uniqueWeek: unique('photo_requests_week_unique').on(table.tenantId, table.week, table.year),
  // Index for status queries
  statusIdx: index('photo_requests_status_idx').on(table.status),
  // Index for tenant queries
  tenantIdx: index('photo_requests_tenant_idx').on(table.tenantId),
}));

/**
 * GBP photos table - tracks individual photos uploaded to Google Business Profile.
 * Links to photo requests when uploaded via weekly request flow.
 */
export const gbpPhotos = pgTable('gbp_photos', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),

  // Optional link to photo request (if from weekly request flow)
  photoRequestId: uuid('photo_request_id').references(() => photoRequests.id, { onDelete: 'set null' }),

  // GBP identifiers
  mediaItemId: text('media_item_id').notNull(), // GBP media item ID

  // Photo metadata
  category: gbpPhotoCategoryEnum('category').notNull(),
  sourceUrl: text('source_url').notNull(), // URL used for upload (S3/storage URL)

  // Status tracking
  status: gbpPhotoStatusEnum('status').default('processing').notNull(),
  uploadedAt: timestamp('uploaded_at', { withTimezone: true }).notNull(),

  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }), // Soft delete
}, (table) => ({
  // Index for tenant queries
  tenantIdx: index('gbp_photos_tenant_idx').on(table.tenantId),
  // Index for photo request queries
  photoRequestIdx: index('gbp_photos_request_idx').on(table.photoRequestId),
  // Index for status queries
  statusIdx: index('gbp_photos_status_idx').on(table.status),
}));

/**
 * Post Requests Table
 *
 * Tracks monthly promotional post request flow:
 * 1. Initial request sent to owner
 * 2. Owner provides content OR requests AI generation
 * 3. AI generates draft (if requested)
 * 4. Owner approves/edits
 * 5. Post published to GBP
 *
 * Per CONTEXT.md: Reminder sequence if no response, safe auto-publish as last resort.
 */

export const postRequestStatusEnum = pgEnum('post_request_status', [
  'requested',        // Initial WhatsApp sent
  'owner_content',    // Owner provided their content
  'ai_generating',    // AI is generating draft
  'pending_approval', // Draft ready, waiting for owner
  'approved',         // Owner approved, ready to publish
  'published',        // Posted to GBP
  'skipped',          // Owner declined, no post this month
  'auto_published',   // Published safe content without approval
]);

export const postTypeEnum = pgEnum('post_type', [
  'STANDARD',  // General update
  'EVENT',     // Event announcement
  'OFFER',     // Special offer/promotion
]);

export const postRequests = pgTable('post_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  status: postRequestStatusEnum('status').notNull().default('requested'),
  month: integer('month').notNull(), // 1-12
  year: integer('year').notNull(),

  // Content
  ownerContent: text('owner_content'), // Owner-provided text
  aiDraft: text('ai_draft'), // AI-generated draft
  finalContent: text('final_content'), // Approved content to publish
  postType: postTypeEnum('post_type').default('STANDARD'),
  callToActionType: text('call_to_action_type'), // LEARN_MORE, BOOK, ORDER, etc.
  callToActionUrl: text('call_to_action_url'),
  imageUrl: text('image_url'), // Optional image URL

  // Tracking
  requestedAt: timestamp('requested_at', { withTimezone: true }),
  reminder1SentAt: timestamp('reminder1_sent_at', { withTimezone: true }),
  reminder2SentAt: timestamp('reminder2_sent_at', { withTimezone: true }),
  draftSentAt: timestamp('draft_sent_at', { withTimezone: true }),
  approvedAt: timestamp('approved_at', { withTimezone: true }),
  publishedAt: timestamp('published_at', { withTimezone: true }),

  // GBP result
  gbpPostId: text('gbp_post_id'),
  gbpPostState: text('gbp_post_state'), // LIVE, PROCESSING, REJECTED

  // Metadata
  isSafeContent: boolean('is_safe_content').default(false), // True if auto-publishable
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => ({
  // Index for tenant + month + year lookups (idempotency check)
  tenantMonthIdx: index('post_requests_tenant_month_idx').on(table.tenantId, table.month, table.year),
  // Index for status queries
  postStatusIdx: index('post_requests_status_idx').on(table.status),
}));

// Type exports for TypeScript inference
export type PhotoRequest = typeof photoRequests.$inferSelect;
export type NewPhotoRequest = typeof photoRequests.$inferInsert;

export type GbpPhoto = typeof gbpPhotos.$inferSelect;
export type NewGbpPhoto = typeof gbpPhotos.$inferInsert;

export type PostRequest = typeof postRequests.$inferSelect;
export type NewPostRequest = typeof postRequests.$inferInsert;
