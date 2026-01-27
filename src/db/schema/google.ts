import { pgTable, uuid, varchar, timestamp, index, pgEnum, unique } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';

// Google connection status (same as WhatsApp pattern)
export const googleConnectionStatusEnum = pgEnum('google_connection_status', [
  'pending',      // Connection initiated but not verified
  'active',       // Connection verified and working
  'disconnected', // User disconnected
  'invalid',      // Token became invalid
]);

/**
 * Google Business Profile connections per tenant.
 * One connection per tenant (single GBP account per business).
 */
export const googleConnections = pgTable('google_connections', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }).unique(),

  // Google Business Profile identifiers
  accountId: varchar('account_id', { length: 50 }).notNull(), // GBP Account ID from accounts.list
  accountName: varchar('account_name', { length: 255 }).notNull(), // Account display name
  locationId: varchar('location_id', { length: 50 }), // Primary location ID for reviews
  locationName: varchar('location_name', { length: 255 }), // Location display name (business name)

  // Connection health
  status: googleConnectionStatusEnum('status').default('pending').notNull(),
  verifiedAt: timestamp('verified_at', { withTimezone: true }), // When connection was verified working

  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  // Index for status queries (find invalid connections for reconnection)
  statusIdx: index('google_connections_status_idx').on(table.status),
}));

// Type exports
export type GoogleConnection = typeof googleConnections.$inferSelect;
export type NewGoogleConnection = typeof googleConnections.$inferInsert;
