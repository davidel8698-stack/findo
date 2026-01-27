import { pgTable, uuid, varchar, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';

// Tenant status enum - covers full lifecycle from trial to cancellation
export const tenantStatusEnum = pgEnum('tenant_status', [
  'trial',      // 14-day free trial
  'active',     // Paying customer
  'grace',      // Trial ended, 3-day grace period
  'paused',     // Service paused (not paying)
  'cancelled'   // Cancelled, pending deletion
]);

export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().defaultRandom(),

  // Business information (minimal for 2-minute setup)
  businessName: varchar('business_name', { length: 255 }).notNull(),
  businessType: varchar('business_type', { length: 100 }),
  ownerName: varchar('owner_name', { length: 255 }).notNull(),
  ownerEmail: varchar('owner_email', { length: 255 }).notNull().unique(),
  ownerPhone: varchar('owner_phone', { length: 50 }), // Personal phone for backup auth

  // Business address (for GBP)
  address: text('address'),

  // Status and lifecycle
  status: tenantStatusEnum('status').default('trial').notNull(),
  trialEndsAt: timestamp('trial_ends_at', { withTimezone: true }),
  gracePeriodEndsAt: timestamp('grace_period_ends_at', { withTimezone: true }),

  // Timezone for scheduled jobs (Israel by default)
  timezone: varchar('timezone', { length: 50 }).default('Asia/Jerusalem').notNull(),

  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }), // Soft delete for 90-day retention
});

// Type exports for TypeScript inference
export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;
