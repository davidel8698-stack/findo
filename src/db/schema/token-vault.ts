import { pgTable, uuid, varchar, text, timestamp, index, pgEnum, unique } from 'drizzle-orm/pg-core';
import { tenants } from './tenants';

// Provider types for OAuth/API tokens
export const tokenProviderEnum = pgEnum('token_provider', [
  'whatsapp',    // WhatsApp Business API tokens
  'google',      // Google OAuth (GBP, etc.)
  'voicenter',   // Voicenter API credentials
  'greeninvoice', // Greeninvoice API
  'icount',      // iCount API
  'clerk',       // Clerk authentication
]);

// Token types within a provider
export const tokenTypeEnum = pgEnum('token_type', [
  'access_token',   // Short-lived access token
  'refresh_token',  // Long-lived refresh token
  'api_key',        // Static API key
  'webhook_secret', // Webhook signature verification secret
]);

export const tokenVault = pgTable('token_vault', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),

  // Token identification
  provider: tokenProviderEnum('provider').notNull(),
  tokenType: tokenTypeEnum('token_type').notNull(),
  identifier: varchar('identifier', { length: 255 }), // Provider-specific ID (e.g., WABA ID, GBP account ID)

  // Encrypted token value (NEVER store plaintext)
  encryptedValue: text('encrypted_value').notNull(),

  // Token metadata
  expiresAt: timestamp('expires_at', { withTimezone: true }), // NULL for non-expiring tokens
  lastUsedAt: timestamp('last_used_at', { withTimezone: true }),
  lastRefreshedAt: timestamp('last_refreshed_at', { withTimezone: true }),

  // Status tracking
  isValid: varchar('is_valid', { length: 10 }).default('true').notNull(), // 'true', 'false', 'unknown'
  lastError: text('last_error'), // Last error message if token failed

  // Audit timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  // Unique constraint: one token per tenant/provider/type/identifier combo
  uniqueToken: unique('token_vault_unique').on(
    table.tenantId,
    table.provider,
    table.tokenType,
    table.identifier
  ),
  // Index for token lookups
  tenantProviderIdx: index('token_vault_tenant_provider_idx').on(table.tenantId, table.provider),
  // Index for token health monitoring (find expiring tokens)
  expiresAtIdx: index('token_vault_expires_at_idx').on(table.expiresAt),
}));

export type TokenVaultEntry = typeof tokenVault.$inferSelect;
export type NewTokenVaultEntry = typeof tokenVault.$inferInsert;
